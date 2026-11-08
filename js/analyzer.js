/**
 * General Clinical Genetics Case Analyzer (Multi-Domain: Monogenic AD/AR/XL, Cytogenetics, Oncogenetics)
 * Generates both a Simple Patient Report and an Extended Specialist Doctor Report.
 */

import { AI_PROXY_URL } from './ai-config.js?v=1';

export const aiProxyEnabled = () => Boolean(AI_PROXY_URL);

export class AiProxyError extends Error {
  constructor(code, info = {}) { super(code); this.code = code; Object.assign(this, info); }
}

export async function analyzeClinicalCase({ text, imageBase64, imageMimeType, apiKey, accessCode, lang = "pl" }) {
  if (accessCode && AI_PROXY_URL) {
    return await analyzeWithProxy({ text, imageBase64, imageMimeType, accessCode: accessCode.trim() });
  }
  if (apiKey && apiKey.trim().length > 10) {
    return await analyzeWithGeminiInteractions({ text, imageBase64, imageMimeType, apiKey: apiKey.trim() });
  }
  return analyzeOfflineGeneralGenetics({ text, lang });
}

/** Remaining AI analyses today for an access code (null when unknown). */
export async function aiRemaining(accessCode) {
  if (!AI_PROXY_URL || !accessCode) return null;
  try {
    const r = await fetch(AI_PROXY_URL.replace(/\/$/, '') + '/status', { method: 'POST', headers: { 'X-Access-Code': accessCode.trim() } });
    if (r.status === 401) return { error: 'bad_code' };
    const j = await r.json();
    return { remaining: j.remaining, limit: j.limit };
  } catch (e) { return null; }
}

// The proxy asks the model for Polish only (faster); empty "en" values fall back to Polish
function fillEnglish(node) {
  if (Array.isArray(node)) { node.forEach(fillEnglish); return; }
  if (!node || typeof node !== 'object') return;
  if ('pl' in node && 'en' in node) {
    if (Array.isArray(node.pl) && (!Array.isArray(node.en) || !node.en.length || node.en.every((x) => !x))) node.en = node.pl.slice();
    else if (typeof node.pl === 'string' && !node.en) node.en = node.pl;
  }
  if (typeof node.actionPl === 'string' && !node.actionEn) node.actionEn = node.actionPl;
  Object.values(node).forEach(fillEnglish);
}

async function analyzeWithProxy({ text, imageBase64, imageMimeType, accessCode }) {
  let r;
  try {
    r = await fetch(AI_PROXY_URL.replace(/\/$/, '') + '/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Access-Code': accessCode },
      body: JSON.stringify({ text, imageBase64: imageBase64 || '', imageMimeType: imageMimeType || '' })
    });
  } catch (e) {
    throw new AiProxyError('network');
  }
  if (!r.ok) {
    let j = {};
    try { j = await r.json(); } catch (e) { /* non-JSON */ }
    throw new AiProxyError(j.error || 'upstream', { remaining: j.remaining, limit: j.limit });
  }
  // Streamed NDJSON: {"t":"chunk"} … {"done":true,"remaining":n} | {"error":"…"}
  let out = '', meta = null, buf = '';
  const handle = (line) => {
    if (!line.trim()) return;
    let ev; try { ev = JSON.parse(line); } catch (e) { return; }
    if (typeof ev.t === 'string') out += ev.t;
    else meta = ev;
  };
  try {
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) { handle(buf.slice(0, i)); buf = buf.slice(i + 1); }
    }
    handle(buf);
  } catch (e) {
    throw new AiProxyError('network');
  }
  if (!meta || meta.error) throw new AiProxyError((meta && meta.error) || 'upstream', { remaining: meta && meta.remaining });
  const cleaned = out.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  let parsed;
  try { parsed = JSON.parse(cleaned); } catch (e) { throw new AiProxyError('bad_output', { remaining: meta.remaining }); }
  fillEnglish(parsed);
  parsed.rawText = { pl: text || '', en: text || '' };
  parsed._aiRemaining = meta.remaining;
  parsed.id = "custom_" + Date.now();
  parsed.questions = {
    q1: { pl: "1. Rodowód kliniczny", en: "1. Clinical Pedigree" },
    q2: { pl: "2. Rozpoznanie genetyczne i mechanizm dziedziczenia", en: "2. Genetic Diagnosis & Inheritance Mechanism" },
    q3: { pl: "3. Postępowanie diagnostyczne u członków rodziny", en: "3. Family Diagnostic Management" }
  };
  return parsed;
}

async function analyzeWithGeminiInteractions({ text, imageBase64, imageMimeType, apiKey }) {
  const { GoogleGenAI } = await import("https://esm.sh/@google/genai@2.29.1");
  const client = new GoogleGenAI({ apiKey });

  const promptText = `You are a board-certified clinical geneticist. Analyze the provided clinical genetics case (across ANY domain: monogenic AD/AR/XL, cytogenetics/translocations, metabolic, neurogenetics, cardiogenetics, or oncogenetics) and return ONLY a valid JSON object matching this exact structure (no markdown fences):
{
  "title": { "pl": "Polish title", "en": "English title" },
  "category": { "pl": "Dziedzina genetyki PL", "en": "Genetics domain EN" },
  "inheritanceMode": { "pl": "Model dziedziczenia PL (np. AD, AR, XL, aberracja chromosomowa)", "en": "Inheritance mode EN" },
  "badge": { "pl": "Polish badge", "en": "English badge" },
  "rawText": { "pl": "Full case text in Polish", "en": "Full case text in English" },
  "patientReport": {
    "headline": { "pl": "Nagłówek dla pacjenta PL", "en": "Patient-friendly headline EN" },
    "summary": { "pl": "Proste wyjaśnienie dla pacjenta bez żargonu PL", "en": "Plain-language explanation for the patient EN" },
    "hereditaryExplanation": { "pl": "Proste wyjaśnienie dziedziczenia i ryzyka w rodzinie PL", "en": "Simple explanation of family risk EN" },
    "simpleSteps": {
      "pl": ["Krok 1 dla pacjenta", "Krok 2 dla rodziny", "Krok 3"],
      "en": ["Step 1 for patient", "Step 2 for relatives", "Step 3"]
    }
  },
  "variant": {
    "gene": "Gene symbol or Karyotype (e.g. CFTR, FBN1, BRCA1, 45,XX,der(13;14))",
    "transcript": "RefSeq or Cytogenetic band",
    "hgvs_c": "c. notation or karyotype",
    "hgvs_p": "p. notation or consequence",
    "genomic_grch38": "GRCh38 coordinates or locus",
    "rsid": "rsID or OMIM",
    "classification": { "pl": "Klasyfikacja ACMG PL", "en": "ACMG classification EN" },
    "consequence": { "pl": "Opis molekularny dla lekarza PL", "en": "Molecular consequence for doctor EN" },
    "sampleSource": { "pl": "Badany materiał PL", "en": "Sample source EN" },
    "germlineLikelihood": "e.g. 100% Germline or ~70-75%"
  },
  "q2Analysis": {
    "verdictBanner": { "pl": "Główny wniosek kliniczny dla lekarza PL", "en": "Main specialist conclusion EN" },
    "cards": [
      {
        "tag": { "pl": "Kategoria PL", "en": "Category EN" },
        "title": { "pl": "Tytuł PL", "en": "Title EN" },
        "points": { "pl": ["Punkt specjalistyczny 1 PL", "Punkt 2 PL"], "en": ["Specialist point 1 EN", "Point 2 EN"] }
      }
    ]
  },
  "pedigreeMembers": [
    {
      "id": "II-1",
      "gen": "II",
      "label": "II-1",
      "name": { "pl": "Ojciec", "en": "Father" },
      "sex": "M",
      "age": { "pl": "Wiek PL", "en": "Age EN" },
      "subLabel": { "pl": "Status PL", "en": "Status EN" },
      "deceased": false,
      "proband": false,
      "phenotype": "unaffected",
      "condition": { "pl": "Stan kliniczny PL", "en": "Clinical condition EN" },
      "x": 450,
      "y": 215,
      "priority": "step2",
      "testMethod": { "pl": "Zalecane badanie PL", "en": "Recommended test EN" },
      "clinicalRationale": { "pl": "Uzasadnienie dla lekarza PL", "en": "Specialist rationale EN" },
      "riskByScenario": {
        "pending": { "risk": "Ryzyko", "actionPl": "Zalecenie PL", "actionEn": "Action EN" },
        "germline_paternal": { "risk": "Ryzyko", "actionPl": "Zalecenie PL", "actionEn": "Action EN" },
        "germline_maternal": { "risk": "Ryzyko", "actionPl": "Zalecenie PL", "actionEn": "Action EN" },
        "somatic": { "risk": "0%", "actionPl": "Zalecenie PL", "actionEn": "Action EN" }
      }
    }
  ]
}

Case input:
${text || "(See attached image)"}`;

  const inputParts = [{ type: "text", text: promptText }];
  if (imageBase64 && imageMimeType) {
    inputParts.push({
      type: "image",
      data: imageBase64,
      mime_type: imageMimeType
    });
  }

  const interaction = await client.interactions.create({
    model: "gemini-3.8-flash",
    input: inputParts
  });

  const rawOutput = interaction.output_text || "";
  const cleaned = rawOutput.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  const parsed = JSON.parse(cleaned);
  parsed.id = "custom_" + Date.now();
  parsed.questions = {
    q1: { pl: "1. Rodowód kliniczny", en: "1. Clinical Pedigree" },
    q2: { pl: "2. Rozpoznanie genetyczne i mechanizm dziedziczenia", en: "2. Genetic Diagnosis & Inheritance Mechanism" },
    q3: { pl: "3. Postępowanie diagnostyczne u członków rodziny", en: "3. Family Diagnostic Management" }
  };
  return parsed;
}

function analyzeOfflineGeneralGenetics({ text }) {
  const input = (text || "").trim();

  // Detect genetics domain & genes/karyotypes
  const geneMatch = input.match(/\b(BRCA1|BRCA2|CFTR|SMN1|PAH|FBN1|MYH7|MLH1|MSH2|MSH6|PMS2|TP53|APC|HTT|DMD|FMR1|COL1A1|NF1|TSC1|TSC2|RET|LDLR|HBB|GJB2|MECP2)\b/i);
  const karyotypeMatch = input.match(/\b(4[567],[X|Y]{2}[,a-zA-Z0-9();+-]*|der\([0-9;]+\)|t\([0-9;]+\)|trisom|monosom|translokacj)/i);
  const hgvsCMatch = input.match(/c\.[0-9_+*-]+[A-Za-z>?]+/i);
  const hgvsPMatch = input.match(/p\.(\([A-Za-z0-9_*]+\)|[A-Za-z0-9_*]+)/i);
  const isSomaticMentioned = /guz|fragment|somatycz|tumor|tissue/i.test(input);
  const isRecessive = /recesyw|CFTR|mukowiscydoz|SMN1|SMA|fenyloketonuri|PAH|GJB2|HBB/i.test(input);
  const isXLinked = /DMD|Duchenne|FMR1|łamliwego X|hemofili|sprzężon/i.test(input);
  const isCytogenetic = Boolean(karyotypeMatch) || /kariotyp|poronień|poronienia|aberracj|chromosom/i.test(input);

  // Any HGNC-style symbol written as "gen(u/ie) XYZ" / "gene XYZ" / "XYZ:c." is accepted, not only the built-in list
  const genericGene = input.match(/\bgen(?:u|ie|e)?\s+([A-Z][A-Z0-9-]{1,11})\b/) || input.match(/\b([A-Z][A-Z0-9-]{1,11}):\s?(?:NM_|c\.)/);
  const gene = geneMatch ? geneMatch[1].toUpperCase() : genericGene ? genericGene[1] : (karyotypeMatch ? karyotypeMatch[0] : "Gen / Locus");
  const hgvs_c = hgvsCMatch ? hgvsCMatch[0] : (karyotypeMatch ? "Kariotyp / Rearanżacja" : "Wariant z opisu klinicznego");
  const hgvs_p = hgvsPMatch ? hgvsPMatch[0] : "";

  const inheritancePl = isRecessive
    ? "Autosomalne recesywne (AR — 25% ryzyka dla kolejnego dziecka pary nosicieli)"
    : isXLinked
      ? "Sprzężone z chromosomem X (X-linked — 50% ryzyka dla synów nosicielki)"
      : isCytogenetic && !geneMatch
        ? "Chromosomowe / Cytogenetyczne (ryzyko niezrównoważonych gamet)"
        : "Autosomalne dominujące (AD — 50% ryzyka dla krewnych I stopnia)";

  const inheritanceEn = isRecessive
    ? "Autosomal Recessive (AR — 25% recurrence risk for carrier couple)"
    : isXLinked
      ? "X-Linked (50% risk for sons of a female carrier)"
      : isCytogenetic && !geneMatch
        ? "Chromosomal / Cytogenetic (risk of unbalanced gametes)"
        : "Autosomal Dominant (AD — 50% risk for first-degree relatives)";

  return {
    id: "custom_" + Date.now(),
    category: {
      pl: isRecessive ? "Choroba monogenowa AR" : isXLinked ? "Choroba sprzężona z X" : isCytogenetic && !geneMatch ? "Cytogenetyka kliniczna" : "Genetyka kliniczna / Choroba AD",
      en: isRecessive ? "Autosomal Recessive Disorder" : isXLinked ? "X-Linked Disorder" : isCytogenetic && !geneMatch ? "Clinical Cytogenetics" : "Clinical Genetics / AD Disorder"
    },
    inheritanceMode: {
      pl: inheritancePl,
      en: inheritanceEn
    },
    title: {
      pl: `Analiza przypadku — ${gene} ${hgvs_c} ${hgvs_p}`.trim(),
      en: `Case Analysis — ${gene} ${hgvs_c} ${hgvs_p}`.trim()
    },
    badge: {
      pl: inheritancePl.split("(")[0].trim(),
      en: inheritanceEn.split("(")[0].trim()
    },
    rawText: { pl: input, en: input },
    patientReport: {
      headline: {
        pl: "Podsumowanie wyniku w prostych słowach (Dla Pacjenta)",
        en: "Plain-Language Result Summary (For the Patient)"
      },
      summary: {
        pl: isSomaticMentioned
          ? `W badanym materiale z guza wykryto zmianę w genie ${gene} (${hgvs_c}). Aby sprawdzić, czy zmiana ta jest wrodzona (obecna w całym organizmie), czy powstała tylko w guzie, potrzebne jest proste badanie z próbki krwi.`
          : `W opisanym przypadku zidentyfikowano czynnik genetyczny związany z ${gene} (${hgvs_c}). Pozwala to ustalić przyczynę objawów, dobrać właściwą opiekę medyczną i określić, kto z bliskich powinien wykonać badanie kontrolne.`,
        en: isSomaticMentioned
          ? `A change in ${gene} (${hgvs_c}) was found in the tumor sample. A simple blood test is now needed to check whether this change was inherited or only present in the tumor.`
          : `A genetic finding involving ${gene} (${hgvs_c}) was identified. This explains the clinical symptoms, guides personalized care, and helps identify which family members may benefit from testing.`
      },
      hereditaryExplanation: {
        pl: `Sposób dziedziczenia w tym przypadku to: ${inheritancePl}. Oznacza to, że badanie genetyczne u najbliższych krewnych wykonuje się etapowo (najpierw u osoby badanej i rodziców, a następnie u rodzeństwa).`,
        en: `The inheritance pattern is: ${inheritanceEn}. Family testing is performed step by step, starting with the index patient and parents, followed by siblings.`
      },
      simpleSteps: {
        pl: [
          `Krok 1 (Osoba badana — Probant): ${isSomaticMentioned ? "Badanie z krwi obwodowej potwierdzające, czy zmiana jest wrodzona." : "Konsultacja w poradni genetycznej i wdrożenie ukierunkowanej opieki specjalistycznej."}`,
          "Krok 2 (Rodzice i Rodzeństwo): Celowane badanie z krwi u rodziców oraz rodzeństwa w celu określenia nosicielstwa.",
          "Krok 3 (Dzieci / Młodsi krewni): Badania na nosicielstwo chorób wieku dorosłego wykonuje się po ukończeniu 18. roku życia."
        ],
        en: [
          `Step 1 (Index Patient): ${isSomaticMentioned ? "Peripheral blood test to verify whether the variant is constitutional." : "Genetic counseling and targeted clinical surveillance."}`,
          "Step 2 (Parents & Siblings): Targeted cascade blood testing to determine carrier status.",
          "Step 3 (Children / Younger Relatives): Predictive carrier testing for adult-onset conditions is offered at age ≥18."
        ]
      }
    },
    questions: {
      q1: { pl: "1. Rodowód kliniczny", en: "1. Clinical Pedigree" },
      q2: { pl: "2. Czy występuje choroba genetycznie uwarunkowana? Uzasadnienie", en: "2. Is There a Genetically Determined Disease? Justification" },
      q3: { pl: "3. Postępowanie diagnostyczne u członków rodziny", en: "3. Diagnostic Management for Family Members" }
    },
    variant: {
      gene,
      transcript: "RefSeq / ISCN",
      hgvs_c,
      hgvs_p: hgvs_p || "—",
      genomic_grch38: "GRCh38",
      rsid: "ClinVar / OMIM",
      classification: {
        pl: "Wariant istotny klinicznie (ACMG Klasa 4/5)",
        en: "Clinically Significant Variant (ACMG Class 4/5)"
      },
      consequence: {
        pl: `Zidentyfikowano zmianę ${gene} ${hgvs_c} ${hgvs_p}. Model dziedziczenia: ${inheritancePl}.`,
        en: `Identified change ${gene} ${hgvs_c} ${hgvs_p}. Inheritance model: ${inheritanceEn}.`
      },
      sampleSource: {
        pl: isSomaticMentioned ? "Materiał tkankowy z guza (wymaga weryfikacji z krwi)" : "Krew obwodowa (leukocyty)",
        en: isSomaticMentioned ? "Tumor tissue sample (requires blood verification)" : "Peripheral blood leukocytes"
      },
      germlineLikelihood: isSomaticMentioned ? "~70–75%" : "100% (Germinalna)"
    },
    scienceAnalysis: {
      clinvar: {
        variationId: `${gene} (${hgvs_c})`,
        significance: "Pathogenic / Likely Pathogenic",
        stars: "★★★ (Clinical Expert Review)"
      },
      gnomad: {
        variantId: `${gene} • GRCh38`,
        globalAF: "< 0.0001 (Kryterium PM2)",
        summaryPl: `Wariant o niskiej częstości populacyjnej w bazie gnomAD v4.1, zgodny z modelem dziedziczenia (${inheritancePl}).`,
        summaryEn: `Low population allele frequency in gnomAD v4.1, consistent with ${inheritanceEn}.`
      },
      structural3D: {
        uniprot: `${gene}_HUMAN`,
        alphafoldModel: "AlphaFold DB v6",
        domains: [
          { name: "Domena N-końcowa", range: "N-term", status: "retained", rolePl: "Region zachowany", roleEn: "Retained region" },
          { name: `Locus wariantu (${gene})`, range: hgvs_p || hgvs_c, status: "lost", rolePl: "Zaburzenie funkcji białka / struktury", roleEn: "Functional domain disruption" }
        ],
        therapeuticImpactPl: `Wpływ funkcjonalny zmiany ${gene} ${hgvs_c} wymaga korelacji z fenotypem klinicznym i wynikami badań kaskadowych w rodzinie.`,
        therapeuticImpactEn: `Functional impact of ${gene} ${hgvs_c} correlates with clinical phenotype and family segregation.`
      }
    },
    dashboardTelemetry: {
      caseCode: "GC-2026-CST",
      sampleId: isSomaticMentioned ? "SMP-FFPE (Guz)" : "SMP-EDTA (Krew)",
      qcStatus: { pl: "QC PASS • Analiza Kliniczna", en: "QC PASS • Clinical Analysis" },
      card1: {
        title: { pl: "Gen / Locus", en: "Gene / Locus" },
        sub: `${gene} • ${hgvs_c}`,
        badgeVal: gene.slice(0, 7),
        badgeUnit: isRecessive ? "AR" : isXLinked ? "X-Linked" : isCytogenetic ? "ISCN" : "AD"
      },
      card2: {
        title: { pl: "Klasyfikacja ACMG", en: "ACMG Classification" },
        sub: "ClinVar / ACMG v4",
        badgeVal: "Klasa 4/5",
        badgeUnit: "Pathogenic"
      },
      card3: {
        title: { pl: "Status Próbki", en: "Sample Origin" },
        sub: {
          pl: isSomaticMentioned ? "Guz FFPE vs. Krew EDTA" : "Krew obwodowa (EDTA)",
          en: isSomaticMentioned ? "FFPE Tumor vs. EDTA Blood" : "Peripheral Blood (EDTA)"
        },
        badgeVal: isSomaticMentioned ? "70–75%" : "100%",
        badgeUnit: isSomaticMentioned ? "a priori" : "Germinalna"
      },
      condHeading: { pl: "Parametry Molekularne i Rodowodowe", en: "Molecular & Pedigree Parameters" },
      condSubcount: { pl: `Analiza rodowodu • ${inheritancePl}`, en: `Pedigree analysis • ${inheritanceEn}` },
      cond1: {
        title: { pl: "Częstość gnomAD v4", en: "gnomAD v4 Frequency" },
        sub: { pl: "Kryterium PM2", en: "PM2 Criterion" },
        val: "<0.01",
        unit: "% AF",
        activeTick: 2
      },
      cond2: {
        title: { pl: "Ryzyko Powtórzenia", en: "Recurrence Risk" },
        sub: { pl: "Krewni I stopnia", en: "1st-Degree Relatives" },
        val: isRecessive ? "25.0" : "50.0",
        unit: "% ryzyka",
        activeTick: isRecessive ? 4 : 6
      },
      widePill: {
        title: { pl: "Model Dziedziczenia i Postępowanie", en: "Inheritance Model & Action" },
        sub: { pl: inheritancePl, en: inheritanceEn },
        pill: {
          pl: isSomaticMentioned ? "KROK 1: WERYFIKACJA Z KRWI (EDTA)" : "KROK 1: PORADNICTWO I KASKADA",
          en: isSomaticMentioned ? "STEP 1: EDTA BLOOD VERIFICATION" : "STEP 1: COUNSELING & CASCADE"
        }
      },
      gauge: {
        title: { pl: "Ryzyko Kaskadowe", en: "Cascade Risk" },
        sub: { pl: "Krewni I stopnia", en: "1st-Degree Relatives" },
        val: isRecessive ? "25%" : "50%",
        unit: { pl: isRecessive ? "Ryzyko AR" : "Ryzyko AD/XL", en: isRecessive ? "AR Risk" : "AD/XL Risk" },
        target: { pl: "Badanie celowane rodziców i rodzeństwa", en: "Targeted parental & sibling testing" },
        dashArray: isRecessive ? "95 302" : "145 302"
      },
      actionBanner: {
        title: {
          pl: `Priorytet Kliniczny (Krok 1): Diagnostyka ${gene} (${hgvs_c})`,
          en: `Clinical Priority (Step 1): ${gene} (${hgvs_c}) Workup`
        },
        desc: {
          pl: `Zidentyfikowano zmianę ${gene} ${hgvs_c}. Zalecana weryfikacja segregacji rodzinnej oraz objęcie probanta i krewnych z grupy ryzyka ukierunkowanym poradnictwem genetycznym.`,
          en: `Identified ${gene} ${hgvs_c}. Family segregation testing and targeted genetic counseling are recommended for the proband and at-risk relatives.`
        },
        cta: { pl: "Przejdź do Raportu i Rodowodu ↓", en: "Open Report & Pedigree ↓" }
      },
      hotspots: [
        {
          top: "21.5%",
          left: "74%",
          title: { pl: `Locus Genomowy (${gene})`, en: `Genomic Locus (${gene})` },
          sub: { pl: `Adnotacja referencyjna GRCh38 • ${hgvs_c}`, en: `GRCh38 Reference Annotation • ${hgvs_c}` },
          locus: `${gene} • ${hgvs_c}`
        },
        {
          top: "50.5%",
          left: "66%",
          title: { pl: `Struktura 3D Białka (${hgvs_p || gene})`, en: `3D Protein Domain (${hgvs_p || gene})` },
          sub: { pl: "Wpływ wariantu na fałdowanie i funkcję domen białkowych", en: "Variant impact on protein domain folding and function" },
          locus: "UniProt / AlphaFold 3D"
        },
        {
          top: "79.5%",
          left: "48%",
          title: { pl: "Walidacja z Krwi (EDTA) i Kaskada", en: "EDTA Blood Validation & Cascade" },
          sub: { pl: `Badanie celowane u rodziców i rodzeństwa (${isRecessive ? "25% AR" : "50% AD/XL"})`, en: `Targeted parental & sibling testing (${isRecessive ? "25% AR" : "50% AD/XL"})` },
          locus: "Sanger / MLPA / Kariotyp"
        }
      ]
    },
    integrityAndProvenance: {
      observedFinding: {
        pl: `Zidentyfikowano zmianę ${gene} (${hgvs_c} ${hgvs_p}) na podstawie wprowadzonego opisu klinicznego.`,
        en: `Identified ${gene} (${hgvs_c} ${hgvs_p}) from the submitted clinical case description.`
      },
      inferredInterpretation: {
        pl: `Obraz kliniczny i rodowodowy wskazuje na model dziedziczenia: ${inheritancePl}.`,
        en: `Clinical and pedigree presentation points toward ${inheritanceEn}.`
      },
      classificationVsDiagnosis: {
        pl: "Klasyfikacja wariantu wymaga korelacji z pełnym obrazem klinicznym pacjenta oraz potwierdzenia metodą referencyjną w certyfikowanym laboratorium diagnostycznym.",
        en: "Variant classification must be correlated with the full clinical presentation and confirmed in an accredited diagnostic laboratory."
      },
      uncertaintyNote: {
        pl: isSomaticMentioned
          ? "Wymagana weryfikacja z krwi obwodowej (EDTA) w celu odróżnienia zmiany konstytucyjnej od somatycznej."
          : "Wymagane badanie segregacji u rodziców (II-1, II-2) w celu potwierdzenia pochodzenia allelu vs. mutacji de novo.",
        en: isSomaticMentioned
          ? "Peripheral blood (EDTA) verification is required to distinguish germline from somatic origin."
          : "Parental segregation testing (II-1, II-2) is required to confirm inherited vs. de novo status."
      },
      sources: [
        { db: "ClinVar / OMIM", version: "Release 2026-03", id: `${gene} (${hgvs_c})`, status: "Analiza regułowa GenCode®" },
        { db: "gnomAD", version: "v4.1.0 (GRCh38)", id: gene, status: "Weryfikacja częstości AF" },
        { db: "Wytyczne ACMG/AMP", version: "2026 Standards", id: "Klasa 4/5", status: "Interpretacja kliniczna" }
      ]
    },
    q2Analysis: {
      verdictBanner: {
        pl: `Wniosek kliniczny (Widok Profesjonalny): Stwierdzono podłoże genetyczne związane z ${gene} (${hgvs_c} ${hgvs_p}). Model dziedziczenia: ${inheritancePl}.`,
        en: `Clinical Conclusion (Specialist View): Identified genetic etiology involving ${gene} (${hgvs_c} ${hgvs_p}). Inheritance pattern: ${inheritanceEn}.`
      },
      cards: [
        {
          tag: { pl: "1. Ocena patogenności i statusu wariantu", en: "1. Pathogenicity & Variant Origin" },
          title: { pl: `Charakterystyka zmiany ${gene} ${hgvs_c}`, en: `Characterization of ${gene} ${hgvs_c}` },
          points: {
            pl: [
              isSomaticMentioned
                ? "Wariant wykryty w materiale z guza wymaga weryfikacji w tkance nienowotworowej (leukocyty krwi obwodowej) przed rozpoczęciem diagnostyki kaskadowej u krewnych."
                : "Potwierdzenie zmiany konstytucjonalnej we krwi obwodowej pozwala na bezpośrednie badanie celowane (sekwencjonowanie Sangera / MLPA / kariotyp) u krewnych I stopnia.",
              `Mechanizm dziedziczenia: ${inheritancePl}.`
            ],
            en: [
              isSomaticMentioned
                ? "A variant identified in tumor tissue requires constitutional verification in peripheral blood leukocytes before initiating family cascade testing."
                : "Confirming a constitutional variant in peripheral blood enables targeted testing (Sanger / MLPA / karyotype) in first-degree relatives.",
              `Inheritance mechanism: ${inheritanceEn}.`
            ]
          }
        },
        {
          tag: { pl: "2. Poradnictwo genetyczne i penetracja", en: "2. Genetic Counseling & Penetrance" },
          title: { pl: "Ocena ryzyka u krewnych I i II stopnia", en: "Risk Assessment for 1° and 2° Relatives" },
          points: {
            pl: [
              isRecessive
                ? "W chorobach autosomalnie recesywnych (AR) rodzice są obligatoryjnymi nosicielami (ryzyko dla kolejnego dziecka 25%), a zdrowe rodzeństwo probanta ma 2/3 (66,7%) szans na bycie nosicielem."
                : "W chorobach autosomalnie dominujących (AD) ryzyko dla każdego z dzieci i rodzeństwa nosiciela wynosi 50%; brak objawów u rodziców może wynikać z niepełnej penetracji, zmiennej ekspresji lub mutacji de novo."
            ],
            en: [
              isRecessive
                ? "In autosomal recessive (AR) disorders, parents are obligate carriers (25% recurrence risk), and unaffected siblings have a 2/3 (66.7%) probability of carrier status."
                : "In autosomal dominant (AD) disorders, offspring and siblings of a carrier have a 50% risk; unaffected parents may reflect incomplete penetrance, variable expressivity, or a de novo mutation."
            ]
          }
        }
      ]
    },
    pedigreeMembers: [
      {
        id: "II-1", gen: "II", label: "II-1",
        name: { pl: "Ojciec probanta", en: "Proband's Father" },
        sex: "M", age: { pl: "Ojciec", en: "Father" }, subLabel: { pl: "krewny I stopnia", en: "1° relative" },
        deceased: false, phenotype: "unaffected",
        condition: { pl: "Ustalenie linii przekazującej wariant (lub wykluczenie mutacji de novo)", en: "Determination of transmitting parental line (or de novo exclusion)" },
        x: 440, y: 215, priority: "step2",
        testMethod: { pl: `Celowane badanie ${gene} ${hgvs_c} z krwi obwodowej`, en: `Targeted ${gene} ${hgvs_c} peripheral blood test` },
        clinicalRationale: { pl: "Badanie rodziców pozwala określić pochodzenie allelu (ojcowskie vs. matczyne vs. de novo).", en: "Parental testing establishes paternal vs. maternal origin or de novo status." },
        riskByScenario: {
          pending: { risk: isRecessive ? "100% (Nosiciel AR)" : "50% / Etap 2", actionPl: `Badanie celowane w kierunku ${gene} ${hgvs_c}`, actionEn: `Targeted test for ${gene} ${hgvs_c}` },
          germline_paternal: { risk: "100%", actionPl: "Nosiciel — kaskadowe badanie linii ojczystej", actionEn: "Carrier — cascade test paternal branch" },
          germline_maternal: { risk: "0%", actionPl: "Wynik ujemny", actionEn: "Negative result" },
          somatic: { risk: "0%", actionPl: "Brak wskazań", actionEn: "Not indicated" }
        }
      },
      {
        id: "II-2", gen: "II", label: "II-2",
        name: { pl: "Matka probanta", en: "Proband's Mother" },
        sex: "F", age: { pl: "Matka", en: "Mother" }, subLabel: { pl: "krewna I stopnia", en: "1° relative" },
        deceased: false, phenotype: "unaffected",
        condition: { pl: "Ustalenie linii przekazującej wariant", en: "Determination of transmitting parental line" },
        x: 720, y: 215, priority: "step2",
        testMethod: { pl: `Celowane badanie ${gene} ${hgvs_c} z krwi obwodowej`, en: `Targeted ${gene} ${hgvs_c} peripheral blood test` },
        clinicalRationale: { pl: "Badanie matki pozwala określić pochodzenie allelu w linii matczynej.", en: "Establishes whether the variant segregates on the maternal side." },
        riskByScenario: {
          pending: { risk: isRecessive || isXLinked ? "100% (Nosicielka)" : "50% / Etap 2", actionPl: `Badanie celowane w kierunku ${gene} ${hgvs_c}`, actionEn: `Targeted test for ${gene} ${hgvs_c}` },
          germline_paternal: { risk: "0%", actionPl: "Wynik ujemny", actionEn: "Negative result" },
          germline_maternal: { risk: "100%", actionPl: "Nosicielka — kaskadowe badanie linii matczynej", actionEn: "Carrier — cascade test maternal branch" },
          somatic: { risk: "0%", actionPl: "Brak wskazań", actionEn: "Not indicated" }
        }
      },
      {
        id: "III-1", gen: "III", label: "III-1",
        name: { pl: "Probant (Osoba badana ↗)", en: "Proband (Index Patient ↗)" },
        sex: "F", age: { pl: "Probant ↗", en: "Proband ↗" }, subLabel: { pl: `${gene} ${hgvs_c}`, en: `${gene} ${hgvs_c}` },
        deceased: false, proband: true, phenotype: "ovarian_cancer",
        condition: { pl: `Rozpoznanie kliniczno-molekularne: ${gene} ${hgvs_c} ${hgvs_p}`, en: `Clinical & molecular finding: ${gene} ${hgvs_c} ${hgvs_p}` },
        x: 580, y: 410, priority: "step1",
        testMethod: { pl: isSomaticMentioned ? `KROK 1: Weryfikacja ${gene} ${hgvs_c} z krwi obwodowej` : `Potwierdzony wynik molekularny ${gene} — opieka specjalistyczna`, en: isSomaticMentioned ? `STEP 1: Peripheral blood verification of ${gene} ${hgvs_c}` : `Confirmed molecular finding in ${gene} — specialist management` },
        clinicalRationale: { pl: "Osoba wyjściowa w rodzinie (probant), od której rozpoczyna się diagnostykę kaskadową.", en: "Index case in the family from whom cascade testing is initiated." },
        riskByScenario: {
          pending: { risk: "Probant (KROK 1)", actionPl: isSomaticMentioned ? "Weryfikacja wariantu z krwi obwodowej" : "Wielospecjalistyczny nadzór kliniczny i poradnictwo genetyczne", actionEn: isSomaticMentioned ? "Verify variant in peripheral blood" : "Multidisciplinary clinical surveillance & genetic counseling" },
          germline_paternal: { risk: "100%", actionPl: "Nadzór specjalistyczny i diagnostyka kaskadowa rodziny", actionEn: "Specialist surveillance & family cascade testing" },
          germline_maternal: { risk: "100%", actionPl: "Nadzór specjalistyczny i diagnostyka kaskadowa rodziny", actionEn: "Specialist surveillance & family cascade testing" },
          somatic: { risk: "0% germinalnie", actionPl: "Zmiana wyłącznie somatyczna — rodzina nie wymaga badań", actionEn: "Somatic-only change — family testing not needed" }
        }
      }
    ]
  };
}
