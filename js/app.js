/**
 * GenCode® Clinical Genomic Dashboard & Adaptive Reporting Controller (index.html)
 * - Adapts the glassmorphic 3D pedestal dashboard architecture 100% to GenCode® genomic telemetry
 * - Implements 3-Mode Audience-Adaptive Reporting:
 *     1) Clinical / Professional View
 *     2) Research / Advanced Bioinformatics View
 *     3) Patient-Friendly View
 * - Implements 3-Level Progressive Disclosure (Level 1 Essential -> Level 2 Interpretation -> Level 3 Provenance)
 * - Clearly separates Observed Findings vs. Inferred Interpretations, Pathogenicity vs. Diagnosis, and Uncertainty
 */

import { CASES_DATA, DEFAULT_CASE_ID } from '../data/cases.js?v=gencode12';
import { renderPedigreeSVG } from './pedigree.js?v=gencode13';
import { analyzeClinicalCase } from './analyzer.js?v=gencode8';
import { installRoles } from './roles.js?v=3';
import { sanitizeUntrustedCase } from './sanitize.js?v=1';

const LANG_STORAGE_KEY = 'gencode_lang_v1';
const SESSION_STORAGE_KEY = 'gencode_session_v1';
const ACTIVE_CASE_STORAGE_KEY = 'gencode_active_case_v1';

const UI_TRANSLATIONS = {
  pl: {
    nav_lp: 'Strona główna',
    case_menu_label: 'Przypadek',
    btn_share_patient: "Udostępnij pacjentowi",
    empty_cl_kicker: "WORKSPACE KLINICYSTY",
    empty_cl_title: "Dodaj przypadek do analizy",
    empty_cl_text: "Wklej opis wywiadu lub wynik badania genetycznego — GenCode® przygotuje analizę, rodowód i raport dla pacjenta.",
    empty_cl_btn: "+ Dodaj nowy przypadek",
    empty_cl_note: "Przypadki zapisują się tylko w tej przeglądarce. Raport przekażesz pacjentowi przyciskiem „Udostępnij pacjentowi”.",
    empty_pt_kicker: "STREFA PACJENTA",
    empty_pt_title: "Otwórz swój raport",
    empty_pt_text: "Wklej link do raportu otrzymany od lekarza albo wybierz plik raportu (.gencode.json).",
    empty_pt_btn: "Otwórz raport",
    empty_pt_file: "lub wybierz plik raportu",
    empty_pt_note: "Raport ma charakter informacyjny i nie zastępuje rozmowy z lekarzem genetykiem.",
    share_kicker: "RAPORT DLA PACJENTA",
    share_title: "Udostępnij raport pacjentowi",
    share_lead: "Pacjent zobaczy tylko raport w prostym języku, kartę informacyjną i rodowód — bez narzędzi klinicznych. Dane są zapisane w samym linku, nie na serwerze.",
    share_download: "Pobierz plik raportu",
    share_copy: "Kopiuj link",
    share_note: "Wyślij link bezpośrednio pacjentowi (np. e-mailem). Każdy, kto ma link, może otworzyć raport.",
    lvl3_mol_kicker: 'DIAGNOSTYKA MOLEKULARNA • HGVS / ACMG / GRCh38',
    lvl3_sci_kicker: 'BAZY POPULACYJNE I STRUKTURA BIAŁKA 3D',
    tpl_nf1_short: 'Przypadek 1: NF1 (RASopatie)',
    tpl_pten_short: 'Przypadek 2: PTEN (zespół Cowdena)',
    pcard_print: 'Drukuj kartę',
    report_heading: 'Raport adaptacyjny',
    level1_pill: 'POZIOM 1 • KLUCZOWE WNIOSKI I INTEGRALNOŚĆ KLINICZNA',
    int_observed: 'POTWIERDZONA OBSERWACJA LABORATORYJNA',
    int_inferred: 'WNIOSKOWANIE I INTERPRETACJA KLINICZNA',
    int_boundary: 'KLASYFIKACJA PATOGENNOŚCI ≠ ROZPOZNANIE',
    int_uncertainty: 'OBSZAR NIEPEWNOŚCI I WYMAGANA WERYFIKACJA',
    bc_workspace: 'GenCode® Workspace',
    bc_module_overview: 'Przegląd i Próbki',
    tpl_zestaw11_short: 'Zestaw 11: BRCA1 c.3607C>T',
    tpl_cftr_short: 'Przypadek 2: CFTR (F508del)',
    btn_add_case_top: '+ Nowy przypadek',
    anat_click_hint: 'Kliknij węzeł molekularny (1–3)',
    btn_switch_case: '↺ Zmień / Dodaj przypadek kliniczny',
    active_case_subtitle:
      'Raport prezentuje dane w układzie progresywnego ujawniania (Poziom 1: Kluczowe wnioski i Rodowód → Poziom 2: Interpretacja i Kaskada → Poziom 3: Dowody źródłowe i 3D).',
    tab_clinical: 'Widok Kliniczny (Lekarz)',
    tab_research: 'Widok Badawczy (NGS / 3D)',
    tab_patient: 'Widok dla Pacjenta',
    btn_print: 'Drukuj / PDF',
    patient_badge: 'KOMUNIKACJA Z PACJENTEM — JĘZYK PRZYSTĘPNY I ZROZUMIAŁY',
    patient_what_it_means_title: '💡 Co ten wynik oznacza dla Ciebie i rodziny?',
    patient_family_note_title: '👨‍👩‍👧‍👦 Wyjaśnienie sytuacji w rodzinie i niepewności',
    patient_steps_title: '✅ Najważniejsze kolejne kroki do omówienia z lekarzem',
    step_pedigree_badge: 'WIZUALIZACJA GENOMOWA I RODOWODOWA • POKOLENIA I–IV',
    card_pedigree_title: 'Interaktywny Rodowód Genetyczny (Kliknij dowolnego członka rodziny)',
    ped_mode_color: 'Kolor kliniczny',
    ped_mode_bw: 'Klasyczny B&W (ISCN/Egzamin)',
    btn_export_svg: 'Pobierz SVG',
    insp_pheno_label: 'Fenotyp i historia kliniczna',
    insp_geno_label: 'Status i ryzyko genetyczne',
    insp_rec_label: 'Zalecenie diagnostyczne',
    lvl2_banner_title:
      'Interpretacja Genotyp–Fenotyp, Symulator Kaskadowy i Tabela Zaleceń Rodzinnych',
    lvl2_banner_sub:
      'Kliknij, aby rozwinąć lub zwinąć szczegółowe uzasadnienie kliniczne, symulację scenariuszy oraz plan badań dla każdego członka rodziny.',
    lvl3_banner_title:
      'Adnotacja Molekularna (HGVS / GRCh38 / gnomAD v4.1), Domeny 3D Białka i Proweniencja Baz Danych',
    lvl3_banner_sub:
      'Przeznaczony dla diagnostów laboratoryjnych, bioinformatyków i audytu jakości (identyfikatory ClinVar, UniProt/AlphaFold 3D, wersje baz).',
    pro_variant_card_title: 'Charakterystyka Molekularna Wariantu',
    pro_case_prompt_label: 'Oryginalny opis przypadku klinicznego (Tekst źródłowy)',
    pro_science_card_title: 'Adnotacja Populacyjna i Strukturalna 3D',
    step_q2_badge: 'INTERPRETACJA KLINICZNA • GENOTYP–FENOTYP',
    card_q2_title: 'Czy w rodzinie występuje choroba genetycznie uwarunkowana?',
    step_sim_badge: 'SYMULATOR DECYZYJNY DLA LEKARZA',
    card_sim_title: 'Symulator Kaskadowy „What-If”',
    sim_desc:
      'Przełącz scenariusz (wariant dziedziczony lub de novo), aby zobaczyć, jak zmienia się plan badań i ryzyko u krewnych:',
    sim_btn_germline: 'Scenariusz A: Wariant odziedziczony od rodzica',
    sim_btn_somatic: 'Scenariusz B: Wariant de novo',
    step_q3_badge: 'PLAN POSTĘPOWANIA DIAGNOSTYCZNEGO W RODZINIE',
    card_q3_title: 'Szczegółowe zalecenia diagnostyczne dla poszczególnych członków rodziny',
    filter_all: 'Wszyscy',
    filter_urgent: 'Krok 1 (Pilne)',
    filter_cascade: 'Krok 2–3 (Kaskadowe)',
    filter_cyto: 'Krok 4 / Dalsi krewni',
    th_member: 'Członek rodziny',
    th_status: 'Status kliniczny',
    th_priority: 'Priorytet',
    th_test: 'Zalecane badanie i postępowanie lekarskie',
    th_rationale: 'Uzasadnienie patogenetyczne'
  },
  en: {
    nav_lp: 'Home Page',
    case_menu_label: 'Case',
    btn_share_patient: "Share with patient",
    empty_cl_kicker: "CLINICIAN WORKSPACE",
    empty_cl_title: "Add a case to analyse",
    empty_cl_text: "Paste the family history or the genetic test result — GenCode® will prepare the analysis, pedigree and a patient report.",
    empty_cl_btn: "+ Add new case",
    empty_cl_note: "Cases are saved only in this browser. Send the report to the patient with “Share with patient”.",
    empty_pt_kicker: "PATIENT AREA",
    empty_pt_title: "Open your report",
    empty_pt_text: "Paste the report link from your doctor or choose the report file (.gencode.json).",
    empty_pt_btn: "Open report",
    empty_pt_file: "or choose a report file",
    empty_pt_note: "The report is for information only and does not replace a conversation with a clinical geneticist.",
    share_kicker: "PATIENT REPORT",
    share_title: "Share the report with the patient",
    share_lead: "The patient sees only the plain-language report, the information sheet and the pedigree — no clinical tools. The data is stored in the link itself, not on a server.",
    share_download: "Download report file",
    share_copy: "Copy link",
    share_note: "Send the link directly to the patient (e.g. by e-mail). Anyone with the link can open the report.",
    lvl3_mol_kicker: 'MOLECULAR DIAGNOSTICS • HGVS / ACMG / GRCh38',
    lvl3_sci_kicker: 'POPULATION DATA & 3D PROTEIN STRUCTURE',
    tpl_nf1_short: 'Case 1: NF1 (RASopathies)',
    tpl_pten_short: 'Case 2: PTEN (Cowden syndrome)',
    pcard_print: 'Print sheet',
    report_heading: 'Adaptive report',
    level1_pill: 'LEVEL 1 • KEY FINDINGS & CLINICAL INTEGRITY',
    int_observed: 'CONFIRMED LABORATORY OBSERVATION',
    int_inferred: 'CLINICAL INFERENCE & INTERPRETATION',
    int_boundary: 'PATHOGENICITY CLASS ≠ DIAGNOSIS',
    int_uncertainty: 'UNCERTAINTY & REQUIRED VERIFICATION',
    bc_workspace: 'GenCode® Workspace',
    bc_module_overview: 'Overview & Samples',
    tpl_zestaw11_short: 'Case Set 11: BRCA1 c.3607C>T',
    tpl_cftr_short: 'Case 2: CFTR (F508del)',
    btn_add_case_top: '+ New Case',
    anat_click_hint: 'Click a molecular node (1–3)',
    btn_switch_case: '↺ Switch / Add Clinical Case',
    active_case_subtitle:
      'Structured with progressive disclosure (Level 1: Essential Findings & Pedigree → Level 2: Interpretation & Cascade → Level 3: Provenance & 3D).',
    tab_clinical: 'Clinical View (MD)',
    tab_research: 'Research View (NGS / 3D)',
    tab_patient: 'Patient-Friendly View',
    btn_print: 'Print / PDF',
    patient_badge: 'PATIENT COMMUNICATION — PLAIN & ACCESSIBLE MEDICAL LANGUAGE',
    patient_what_it_means_title: '💡 What does this result mean for you and your family?',
    patient_family_note_title: '👨‍👩‍👧‍👦 Explaining family inheritance & diagnostic uncertainty',
    patient_steps_title: '✅ Most important next steps to discuss with your clinician',
    step_pedigree_badge: 'GENOMIC & PEDIGREE VISUALIZATION • GENERATIONS I–IV',
    card_pedigree_title: 'Interactive Genetic Pedigree (Click any family member to inspect)',
    ped_mode_color: 'Clinical Color',
    ped_mode_bw: 'Classic Exam B&W',
    btn_export_svg: 'Download SVG',
    insp_pheno_label: 'Phenotype & clinical history',
    insp_geno_label: 'Genetic status & risk',
    insp_rec_label: 'Diagnostic recommendation',
    lvl2_banner_title:
      'Genotype–Phenotype Interpretation, What-If Cascade Simulator & Family Management Matrix',
    lvl2_banner_sub:
      'Click to expand or collapse detailed clinical justification, scenario simulation, and family member testing protocol.',
    lvl3_banner_title:
      'Molecular Annotations (HGVS / GRCh38 / gnomAD v4.1), 3D Protein Domains & Database Provenance',
    lvl3_banner_sub:
      'Designed for molecular pathologists, bioinformaticians, and quality audit trails (ClinVar IDs, UniProt/AlphaFold 3D, database versions).',
    pro_variant_card_title: 'Molecular Variant Characterization',
    pro_case_prompt_label: 'Original clinical case description (Source text)',
    pro_science_card_title: 'Population & 3D Structural Annotation',
    step_q2_badge: 'CLINICAL INTERPRETATION • GENOTYPE–PHENOTYPE',
    card_q2_title: 'Is there a genetically determined disease in this family?',
    step_sim_badge: 'CLINICAL DECISION SIMULATOR',
    card_sim_title: 'What-If Cascade Simulator',
    sim_desc:
      'Switch the scenario (inherited or de novo variant) to see how the testing plan and relatives\' risk change:',
    sim_btn_germline: 'Scenario A: Variant inherited from a parent',
    sim_btn_somatic: 'Scenario B: De novo variant',
    step_q3_badge: 'FAMILY DIAGNOSTIC MANAGEMENT PLAN',
    card_q3_title: 'Detailed diagnostic recommendations for each family member',
    filter_all: 'All Members',
    filter_urgent: 'Step 1 (Urgent)',
    filter_cascade: 'Step 2–3 (Cascade)',
    filter_cyto: 'Step 4 / Extended',
    th_member: 'Family Member',
    th_status: 'Clinical Status',
    th_priority: 'Priority',
    th_test: 'Recommended Diagnostic Action',
    th_rationale: 'Pathogenetic Rationale'
  }
};

class ClinicalGeneticsWorkspace {
  constructor() {
    this.lang = 'pl';
    this.activeCase = null;
    this.audienceMode = 'clinical'; // 'clinical' | 'research' | 'patient'
    this.level2Expanded = true;
    this.level3Expanded = false;
    this.selectedMemberId = null;
    this.pedigreeMode = 'color';
    this.simScenario = 'germline_paternal';
    this.activeTableFilter = 'all';
    this.uploadedImageBase64 = null;
    this.uploadedImageMimeType = null;

    this.init();
  }

  init() {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'pl' || savedLang === 'en') {
        this.lang = savedLang;
      }
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (['clinical', 'research', 'patient'].includes(parsed.role)) {
          this.audienceMode = parsed.role;
        }
      }
    } catch (e) {
      // ignore
    }

    document.documentElement.lang = this.lang;
    document.getElementById('lang-pl')?.classList.toggle('active', this.lang === 'pl');
    document.getElementById('lang-en')?.classList.toggle('active', this.lang === 'en');

    this.bindEvents();

    const params = new URLSearchParams(window.location.search);
    const paramCaseId = params.get('case');
    const paramMode = params.get('mode') || params.get('view');
    const action = params.get('action');

    if (paramMode === 'pro' || paramMode === 'clinical') {
      this.audienceMode = 'clinical';
    } else if (paramMode === 'research') {
      this.audienceMode = 'research';
    } else if (paramMode === 'patient') {
      this.audienceMode = 'patient';
    }

    let initialCaseId = DEFAULT_CASE_ID;
    if (paramCaseId && CASES_DATA[paramCaseId]) {
      initialCaseId = paramCaseId;
    } else {
      try {
        const savedCaseId = sessionStorage.getItem(ACTIVE_CASE_STORAGE_KEY);
        if (savedCaseId && CASES_DATA[savedCaseId]) {
          initialCaseId = savedCaseId;
        }
      } catch (e) {
        // ignore
      }
    }

    this.applyTranslations();
    // Role entry (?role=clinician | ?role=patient): no demo case is preloaded
    if (installRoles(this, { CASES_DATA })) {
      this.setAudienceMode(this.audienceMode, false);
      return;
    }
    this.loadCase(CASES_DATA[initialCaseId], false);
    this.setAudienceMode(this.audienceMode, false);

    if (action === 'new') {
      this.openCaseModal();
    }
  }

  bindEvents() {
    document.getElementById('lang-pl')?.addEventListener('click', () => this.setLanguage('pl'));
    document.getElementById('lang-en')?.addEventListener('click', () => this.setLanguage('en'));

    const openModalBtns = [
      document.getElementById('btn-open-case-modal'),
      document.getElementById('btn-change-case')
    ];
    openModalBtns.forEach((btn) => {
      btn?.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCaseModal();
      });
    });

    document.getElementById('btn-close-case-modal')?.addEventListener('click', () => this.closeCaseModal());
    document.getElementById('btn-cancel-case-modal')?.addEventListener('click', () => this.closeCaseModal());

    // Case Switcher Chips & Template Buttons
    document.querySelectorAll('[data-load-case]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const caseId = btn.getAttribute('data-load-case');
        if (CASES_DATA[caseId]) {
          this.closeCaseModal();
          this.loadCase(CASES_DATA[caseId], true);
        }
      });
    });

    // Image upload preview in Add Case Modal
    const imgInput = document.getElementById('case-image-input');
    imgInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      this.uploadedImageMimeType = file.type || 'image/jpeg';
      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = String(reader.result || '');
        const commaIdx = resultStr.indexOf(',');
        this.uploadedImageBase64 = commaIdx > -1 ? resultStr.slice(commaIdx + 1) : resultStr;
        const preview = document.getElementById('case-image-preview');
        if (preview) {
          preview.src = resultStr;
          preview.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('btn-run-case-analysis')?.addEventListener('click', () => {
      this.handleAnalyzeCustomCase();
    });

    // 3-Mode Audience Tabs (Clinical, Research, Patient)
    document.getElementById('tab-clinical-view')?.addEventListener('click', () => {
      this.setAudienceMode('clinical', true);
    });
    document.getElementById('tab-research-view')?.addEventListener('click', () => {
      this.setAudienceMode('research', true);
    });
    document.getElementById('tab-patient-view')?.addEventListener('click', () => {
      this.setAudienceMode('patient', true);
    });

    // Progressive Disclosure Toggles (Level 2 & Level 3)
    document.getElementById('btn-toggle-level2')?.addEventListener('click', () => {
      this.setLevel2Expanded(!this.level2Expanded);
    });
    document.getElementById('btn-toggle-level3')?.addEventListener('click', () => {
      this.setLevel3Expanded(!this.level3Expanded);
      if (this.level3Expanded) {
        document.getElementById('level3-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    document.getElementById('btn-print-report')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-toggle-pcard')?.addEventListener('click', () => {
      this.setPatientCardExpanded(!this.pcardExpanded);
    });

    // Print only the patient information sheet
    document.getElementById('btn-print-pcard')?.addEventListener('click', () => {
      this.setPatientCardExpanded(true);
      document.body.classList.add('gc-print-pcard');
      const done = () => {
        document.body.classList.remove('gc-print-pcard');
        window.removeEventListener('afterprint', done);
      };
      window.addEventListener('afterprint', done);
      window.print();
      setTimeout(done, 1500);
    });

    // Pedigree Color vs Classic B&W Mode
    document.getElementById('ped-mode-color')?.addEventListener('click', () => {
      this.pedigreeMode = 'color';
      document.getElementById('ped-mode-color')?.classList.add('active');
      document.getElementById('ped-mode-bw')?.classList.remove('active');
      this.renderPedigree();
    });
    document.getElementById('ped-mode-bw')?.addEventListener('click', () => {
      this.pedigreeMode = 'bw';
      document.getElementById('ped-mode-bw')?.classList.add('active');
      document.getElementById('ped-mode-color')?.classList.remove('active');
      this.renderPedigree();
    });

    // Export SVG
    document.getElementById('btn-export-svg')?.addEventListener('click', () => {
      const svgEl = document.getElementById('pedigree-svg');
      if (!svgEl) return;
      const serializer = new XMLSerializer();
      const svgMarkup = serializer.serializeToString(svgEl);
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gencode_rodowod_${this.activeCase?.id || 'kliniczny'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Simulator Scenario Switch
    document.getElementById('sim-btn-germline')?.addEventListener('click', () => {
      this.simScenario = 'germline_paternal';
      document.getElementById('sim-btn-germline')?.classList.add('active');
      document.getElementById('sim-btn-somatic')?.classList.remove('active');
      this.renderPedigree();
      this.renderSimulator();
    });
    document.getElementById('sim-btn-somatic')?.addEventListener('click', () => {
      this.simScenario = 'somatic';
      document.getElementById('sim-btn-somatic')?.classList.add('active');
      document.getElementById('sim-btn-germline')?.classList.remove('active');
      this.renderPedigree();
      this.renderSimulator();
    });

    // Diagnostic Table Filters
    document.querySelectorAll('.filter-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeTableFilter = pill.getAttribute('data-filter') || 'all';
        this.renderDiagnosticTable();
      });
    });

    // =====================================================================
    // GENCODE GLASS MONITOR INTERACTIVE CONTROLS
    // =====================================================================
    document.querySelectorAll('.mydna-hotspot').forEach((hs) => {
      hs.addEventListener('click', () => {
        document.querySelectorAll('.mydna-hotspot').forEach((h) => h.classList.remove('active'));
        hs.classList.add('active');
        const title = hs.getAttribute('data-hotspot-title') || '';
        const sub = hs.getAttribute('data-hotspot-sub') || '';
        const locus = hs.getAttribute('data-hotspot-locus') || '';
        const titleEl = document.getElementById('anatomy-card-title');
        const subEl = document.getElementById('anatomy-card-sub');
        const locusEl = document.getElementById('anatomy-card-locus');
        if (titleEl) titleEl.textContent = title;
        if (subEl) subEl.textContent = sub;
        if (locusEl) locusEl.textContent = locus;
      });
    });

    const setRailActive = (btnId, moduleLabel) => {
      document.querySelectorAll('.mydna-rail-btn').forEach((b) => b.classList.remove('active'));
      document.getElementById(btnId)?.classList.add('active');
      const bcMod = document.getElementById('bc-module-name');
      if (bcMod && moduleLabel) bcMod.textContent = moduleLabel;
    };

    document.getElementById('rail-btn-dashboard')?.addEventListener('click', () => {
      setRailActive(
        'rail-btn-dashboard',
        this.lang === 'pl' ? 'Przegląd i Próbki' : 'Overview & Samples'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('rail-btn-pedigree')?.addEventListener('click', () => {
      setRailActive(
        'rail-btn-pedigree',
        this.lang === 'pl' ? 'Wizualizacja Rodowodu I–IV' : 'Pedigree Visualization I–IV'
      );
      document.getElementById('pedigree-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('rail-btn-patient')?.addEventListener('click', () => {
      setRailActive(
        'rail-btn-patient',
        this.lang === 'pl' ? 'Raporty Adaptacyjne' : 'Adaptive Reports'
      );
      document.getElementById('results-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('rail-btn-doctor')?.addEventListener('click', () => {
      setRailActive(
        'rail-btn-doctor',
        this.lang === 'pl' ? 'Interpretacja i Kaskada' : 'Interpretation & Cascade'
      );
      this.setLevel2Expanded(true);
      document.getElementById('level2-disclosure-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('rail-btn-add')?.addEventListener('click', () => {
      setRailActive(
        'rail-btn-add',
        this.lang === 'pl' ? 'Rejestracja Przypadku' : 'Case Intake'
      );
      this.openCaseModal();
    });

    // Quick switch button in topbar
    document.getElementById('btn-trigger-case-switch')?.addEventListener('click', () => {
      const ids = Object.keys(CASES_DATA);
      const nextId = ids[(ids.indexOf(this.activeCase?.id) + 1) % ids.length];
      this.loadCase(CASES_DATA[nextId], false);
    });

    // Action Banner CTA -> scroll smoothly to Report & Pedigree
    document.getElementById('btn-relax-action')?.addEventListener('click', () => {
      document.getElementById('results-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Search Input in GenCode Topbar (search gene, HGVS, or pedigree member ID/name)
    const searchInput = document.getElementById('mydna-search-input');
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) return;

        // Check if query matches a pedigree member in active case
        const matchedMember = this.activeCase?.pedigreeMembers?.find(
          (m) =>
            m.id.toLowerCase() === q ||
            (m.label && m.label.toLowerCase() === q) ||
            m.name?.pl?.toLowerCase().includes(q) ||
            m.name?.en?.toLowerCase().includes(q)
        );
        if (matchedMember) {
          this.selectPedigreeMember(matchedMember.id);
          document.getElementById('pedigree-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        if (q.includes('nf1') || q.includes('neurofib') || q.includes('3525') || q.includes('rasop')) {
          this.loadCase(CASES_DATA.nf1, false);
        } else if (q.includes('pten') || q.includes('cowden') || q.includes('955') || q.includes('phts')) {
          this.loadCase(CASES_DATA.pten, false);
        } else {
          this.openCaseModal();
          const customTxt = document.getElementById('custom-case-textarea');
          if (customTxt) customTxt.value = searchInput.value;
        }
      }
    });

    // Top 3 Telemetry Cards Click -> jump to relevant report level
    document.getElementById('vital-card-temp')?.addEventListener('click', () => {
      this.setLevel3Expanded(true);
      document.getElementById('level3-disclosure-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('vital-card-hr')?.addEventListener('click', () => {
      document.getElementById('integrity-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('vital-card-glucose')?.addEventListener('click', () => {
      this.setLevel2Expanded(true);
      document.getElementById('simulator-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    this.initScrollSystem();
  }

  setAudienceMode(mode, scrollToWorkspace = false) {
    this.audienceMode = mode;

    const tabs = {
      clinical: document.getElementById('tab-clinical-view'),
      research: document.getElementById('tab-research-view'),
      patient: document.getElementById('tab-patient-view')
    };

    Object.entries(tabs).forEach(([k, btn]) => {
      const isAct = k === mode;
      btn?.classList.toggle('active', isAct);
      btn?.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });

    const modeIndicator = document.getElementById('level1-mode-indicator');
    const modeLabels = {
      clinical: {
        pl: 'Tryb aktywny: Widok Kliniczny (Lekarz) — Poziom 1 + Poziom 2',
        en: 'Active Mode: Clinical View (MD) — Level 1 + Level 2'
      },
      research: {
        pl: 'Tryb aktywny: Widok Badawczy (NGS / 3D) — Poziom 1 + Poziom 2 + Poziom 3',
        en: 'Active Mode: Research View (NGS / 3D) — Level 1 + Level 2 + Level 3'
      },
      patient: {
        pl: 'Tryb aktywny: Widok dla Pacjenta — Poziom 1 (Język przystępny)',
        en: 'Active Mode: Patient-Friendly View — Level 1 (Plain Language)'
      }
    };
    if (modeIndicator) {
      modeIndicator.textContent = modeLabels[mode]?.[this.lang] || '';
    }

    document.body.dataset.audience = mode;
    if (this.activeCase?.patientCard) this.setPatientCardExpanded(mode === 'patient');
    const patientSection = document.getElementById('patient-report-section');
    if (mode === 'patient') {
      patientSection?.classList.add('patient-mode-highlighted');
      this.setLevel2Expanded(false);
      this.setLevel3Expanded(false);
    } else if (mode === 'clinical') {
      patientSection?.classList.remove('patient-mode-highlighted');
      this.setLevel2Expanded(true);
      this.setLevel3Expanded(false);
    } else if (mode === 'research') {
      patientSection?.classList.remove('patient-mode-highlighted');
      this.setLevel2Expanded(true);
      this.setLevel3Expanded(true);
    }

    if (scrollToWorkspace) {
      document.getElementById('results-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  setLevel2Expanded(expanded) {
    this.level2Expanded = expanded;
    const sec = document.getElementById('level2-section');
    const btn = document.getElementById('btn-toggle-level2');
    const lbl = document.getElementById('btn-toggle-level2-label');
    const ico = document.getElementById('btn-toggle-level2-icon');

    sec?.classList.toggle('hidden', !expanded);
    btn?.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (lbl) {
      lbl.textContent =
        this.lang === 'pl'
          ? expanded
            ? 'Zwiń Poziom 2 (Interpretacja i Kaskada)'
            : 'Rozwiń Poziom 2 (Interpretacja i Kaskada)'
          : expanded
          ? 'Collapse Level 2 (Interpretation & Cascade)'
          : 'Expand Level 2 (Interpretation & Cascade)';
    }
    if (ico) ico.textContent = expanded ? '↑' : '↓';
  }

  setLevel3Expanded(expanded) {
    this.level3Expanded = expanded;
    const sec = document.getElementById('level3-section');
    const btn = document.getElementById('btn-toggle-level3');
    const lbl = document.getElementById('btn-toggle-level3-label');
    const ico = document.getElementById('btn-toggle-level3-icon');

    sec?.classList.toggle('hidden', !expanded);
    btn?.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (lbl) {
      lbl.textContent =
        this.lang === 'pl'
          ? expanded
            ? 'Zwiń Poziom 3 (Dowody Źródłowe i 3D)'
            : 'Rozwiń Poziom 3 (Dowody Źródłowe i 3D)'
          : expanded
          ? 'Collapse Level 3 (Evidence & 3D)'
          : 'Expand Level 3 (Evidence & 3D)';
    }
    if (ico) ico.textContent = expanded ? '↑' : '↓';
  }

  openCaseModal() {
    document.getElementById('case-modal')?.classList.remove('hidden');
  }

  closeCaseModal() {
    document.getElementById('case-modal')?.classList.add('hidden');
  }

  async handleAnalyzeCustomCase() {
    const textarea = document.getElementById('custom-case-textarea');
    const apiKeyInput = document.getElementById('gemini-api-key-input');
    const runBtnLabel = document.getElementById('btn-run-case-label');

    const rawText = textarea?.value?.trim() || '';
    const apiKey = apiKeyInput?.value?.trim() || '';

    const errEl = document.getElementById('gc-case-error');
    if (errEl) errEl.hidden = true;
    if (!rawText && !this.uploadedImageBase64) {
      if (this.role) {
        this.showCaseError?.(this.rolesText?.().needText);
        return;
      }
      this.closeCaseModal();
      this.loadCase(CASES_DATA[DEFAULT_CASE_ID], true);
      return;
    }

    if (runBtnLabel) {
      runBtnLabel.textContent = this.lang === 'pl' ? 'Analizowanie przypadku...' : 'Analyzing case...';
    }

    try {
      const analyzedCase = await analyzeClinicalCase({
        text: rawText,
        imageBase64: this.uploadedImageBase64,
        imageMimeType: this.uploadedImageMimeType,
        apiKey,
        lang: this.lang
      });
      this.closeCaseModal();
      if (this.onCaseAnalyzed) this.onCaseAnalyzed(analyzedCase);
      else this.loadCase(sanitizeUntrustedCase(analyzedCase), true);
    } catch (err) {
      console.error('Case analysis fallback:', err);
      if (this.role) {
        this.showCaseError?.();
        return;
      }
      this.closeCaseModal();
      this.loadCase(CASES_DATA[DEFAULT_CASE_ID], true);
    } finally {
      if (runBtnLabel) {
        runBtnLabel.textContent =
          this.lang === 'pl'
            ? 'Uruchom analizę i wygeneruj raport'
            : 'Run analysis & generate report';
      }
    }
  }

  setLanguage(lang) {
    this.lang = lang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
    document.documentElement.lang = lang;
    document.getElementById('lang-pl')?.classList.toggle('active', lang === 'pl');
    document.getElementById('lang-en')?.classList.toggle('active', lang === 'en');
    this.applyTranslations();
    if (this.activeCase) {
      this.renderActiveCase();
    }
    this.setAudienceMode(this.audienceMode, false);
  }

  applyTranslations() {
    const dict = UI_TRANSLATIONS[this.lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
    this.setLevel2Expanded(this.level2Expanded);
    this.setLevel3Expanded(this.level3Expanded);
  }

  loadCase(caseData, scrollToReport = false) {
    // Reset the recommendations filter so a new case never opens on an empty table
    this.activeTableFilter = 'all';
    document.querySelectorAll('.filter-pill').forEach((p) => p.classList.toggle('active', p.getAttribute('data-filter') === 'all'));
    this.activeCase = caseData;
    try {
      if (caseData.id) {
        sessionStorage.setItem(ACTIVE_CASE_STORAGE_KEY, caseData.id);
      }
    } catch (e) {
      // ignore
    }

    document.querySelectorAll('.mydna-case-chip').forEach((chip) => {
      const chipCase = chip.getAttribute('data-load-case');
      chip.classList.toggle('active', chipCase === caseData.id);
    });

    const bcCase = document.getElementById('bc-active-case');
    if (bcCase) {
      bcCase.textContent =
        caseData.id === 'cftr_ar'
          ? 'Przypadek 2 (CFTR F508del/G542X)'
          : caseData.id === 'pten'
          ? 'Przypadek 2 (PTEN c.955_958del)'
          : caseData.id === 'nf1'
          ? 'Przypadek 1 (NF1 c.3525_3526del)'
          : caseData.id === 'zestaw11'
          ? 'Zestaw 11 (BRCA1 c.3607C>T)'
          : caseData.title?.[this.lang] || 'Przypadek Kliniczny';
    }

    const proband =
      caseData.pedigreeMembers?.find((m) => m.proband || m.isProband) ||
      caseData.pedigreeMembers?.[0];
    this.selectedMemberId = proband ? proband.id : null;

    this.renderActiveCase();

    if (scrollToReport) {
      setTimeout(() => {
        document.getElementById('results-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }

  renderDashboardTelemetry() {
    const c = this.activeCase;
    if (!c) return;
    const t = c.dashboardTelemetry || CASES_DATA[DEFAULT_CASE_ID].dashboardTelemetry;
    const v = c.variant || {};

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.textContent = val;
    };
    const pick = (obj) => (typeof obj === 'object' && obj !== null ? obj[this.lang] || obj.pl : obj);

    setTxt('mydna-sample-code', `${t.caseCode || 'GC-2026'} • ${t.sampleId || ''}`);
    setTxt('mydna-qc-pill', pick(t.qcStatus));
    setTxt('mydna-greeting-title', c.title?.[this.lang] || '');
    setTxt('mydna-greeting-sub', `${c.category?.[this.lang] || ''} • ${c.inheritanceMode?.[this.lang] || ''}`);

    setTxt('vital-1-title', pick(t.card1?.title));
    setTxt('vital-1-sub', t.card1?.sub || `${v.gene || ''} ${v.hgvs_c || ''}`);
    setTxt('vital-1-val', t.card1?.badgeVal || 'PVS1');
    setTxt('vital-1-unit', t.card1?.badgeUnit || 'ACMG');

    setTxt('vital-2-title', pick(t.card2?.title));
    setTxt('vital-2-sub', t.card2?.sub || 'ClinVar');
    setTxt('vital-2-val', t.card2?.badgeVal || 'Klasa 5');
    setTxt('vital-2-unit', t.card2?.badgeUnit || 'Pathogenic');

    setTxt('vital-3-title', pick(t.card3?.title));
    setTxt('vital-3-sub', pick(t.card3?.sub));
    setTxt('vital-3-val', t.card3?.badgeVal || v.germlineLikelihood || '70–75%');
    setTxt('vital-3-unit', t.card3?.badgeUnit || 'a priori');

    setTxt('conditions-heading', pick(t.condHeading));
    setTxt('conditions-subcount', pick(t.condSubcount));

    setTxt('cond-1-title', pick(t.cond1?.title));
    setTxt('cond-1-sub', pick(t.cond1?.sub));
    setTxt('cond-1-val', t.cond1?.val);
    setTxt('cond-1-unit', t.cond1?.unit);

    setTxt('cond-2-title', pick(t.cond2?.title));
    setTxt('cond-2-sub', pick(t.cond2?.sub));
    setTxt('cond-2-val', t.cond2?.val);
    setTxt('cond-2-unit', t.cond2?.unit);

    const setRulerTick = (rulerId, activeIdx = 5) => {
      const ruler = document.getElementById(rulerId);
      if (!ruler) return;
      const spans = ruler.querySelectorAll('span');
      spans.forEach((s, idx) => {
        s.classList.toggle('active', idx + 1 === activeIdx);
      });
    };
    setRulerTick('cond-1-ruler', t.cond1?.activeTick || 2);
    setRulerTick('cond-2-ruler', t.cond2?.activeTick || 7);

    setTxt('cond-sleep-title', pick(t.widePill?.title));
    setTxt('cond-sleep-sub', pick(t.widePill?.sub));
    setTxt('cond-sleep-pill', pick(t.widePill?.pill));

    setTxt('cond-act-title', pick(t.gauge?.title));
    setTxt('cond-act-sub', pick(t.gauge?.sub));
    setTxt('cond-act-val', t.gauge?.val);
    setTxt('cond-act-unit', pick(t.gauge?.unit));
    setTxt('cond-act-target', pick(t.gauge?.target));

    const arcEl = document.getElementById('mydna-activity-arc');
    if (arcEl && t.gauge?.dashArray) {
      arcEl.setAttribute('stroke-dasharray', t.gauge.dashArray);
    }

    // Locus / domain mini-map labels (case-defined, defaults restored otherwise)
    const lm = t.locusMap || {};
    const LM_DEFAULT = { d1: 'RING/TMD', d2: 'COILED / NBD1', d3: 'BRCT / R-DOM', s1: 'Krew (EDTA) • NGS', s2: 'Sanger / Kariotyp' };
    Object.keys(LM_DEFAULT).forEach((k) => setTxt('lm-' + k, lm[k] ? pick(lm[k]) : LM_DEFAULT[k]));
    setTxt('relax-banner-title', pick(t.actionBanner?.title));
    setTxt('relax-banner-desc', pick(t.actionBanner?.desc));
    setTxt('btn-relax-action', pick(t.actionBanner?.cta));

    // Update 3D Anatomical Hotspots
    if (Array.isArray(t.hotspots)) {
      t.hotspots.forEach((hData, idx) => {
        const btn = document.getElementById(`hotspot-${idx + 1}`);
        if (!btn) return;
        btn.style.top = hData.top;
        btn.style.left = hData.left;
        const hTitle = pick(hData.title);
        const hSub = pick(hData.sub);
        btn.setAttribute('data-hotspot-title', hTitle);
        btn.setAttribute('data-hotspot-sub', hSub);
        btn.setAttribute('data-hotspot-locus', hData.locus || '');
        if (idx === 0) {
          document.querySelectorAll('.mydna-hotspot').forEach((el) => el.classList.remove('active'));
          btn.classList.add('active');
          setTxt('anatomy-card-title', hTitle);
          setTxt('anatomy-card-sub', hSub);
          setTxt('anatomy-card-locus', hData.locus || '');
        }
      });
    }
  }

  renderActiveCase() {
    if (!this.activeCase) return;
    const c = this.activeCase;

    this.renderDashboardTelemetry();

    const badgeEl = document.getElementById('active-case-badge');
    const domainEl = document.getElementById('active-domain-badge');
    const titleEl = document.getElementById('active-case-title');

    if (badgeEl) badgeEl.textContent = c.badge?.[this.lang] || 'Przypadek Kliniczny';
    if (domainEl) domainEl.textContent = c.inheritanceMode?.[this.lang] || c.category?.[this.lang] || '';
    if (titleEl) titleEl.textContent = c.title?.[this.lang] || '';

    // Populate Level 1 Scientific Integrity & Uncertainty Separation Grid
    const ip = c.integrityAndProvenance || CASES_DATA[DEFAULT_CASE_ID].integrityAndProvenance;
    const obsEl = document.getElementById('int-observed-text');
    const infEl = document.getElementById('int-inferred-text');
    const bndEl = document.getElementById('int-boundary-text');
    const uncEl = document.getElementById('int-uncertainty-text');

    if (obsEl) obsEl.textContent = ip.observedFinding?.[this.lang] || '';
    if (infEl) infEl.textContent = ip.inferredInterpretation?.[this.lang] || '';
    if (bndEl) bndEl.textContent = ip.classificationVsDiagnosis?.[this.lang] || '';
    if (uncEl) uncEl.textContent = ip.uncertaintyNote?.[this.lang] || '';

    this.renderPatientReport();
    this.renderPatientCard();
    this.renderPedigree();
    if (this.selectedMemberId) {
      this.selectPedigreeMember(this.selectedMemberId);
    }
    this.renderProfessionalView();
  }

  renderPatientReport() {
    const c = this.activeCase;
    const pr = c.patientReport;
    if (!pr) return;

    const headline = document.getElementById('patient-headline');
    const lead = document.getElementById('patient-summary-lead');
    const whatItMeans = document.getElementById('patient-what-it-means');
    const familyNote = document.getElementById('patient-family-note');
    const stepsList = document.getElementById('patient-steps-list');
    const reassurance = document.getElementById('patient-reassurance-text');

    if (headline && pr.headline?.[this.lang]) headline.textContent = pr.headline[this.lang];
    // Lead = first sentence only (the full summary is shown in the card below — no duplicated paragraph)
    if (lead) {
      const full = pr.summary?.[this.lang] || '';
      const first = (full.match(/^.*?[.!?](\s|$)/) || [full])[0].trim();
      lead.textContent = pr.lead?.[this.lang] || first;
    }
    if (whatItMeans) whatItMeans.textContent = pr.summary?.[this.lang] || '';
    if (familyNote) familyNote.textContent = pr.hereditaryExplanation?.[this.lang] || '';
    if (reassurance) {
      reassurance.textContent =
        this.lang === 'pl'
          ? 'Informacja dotycząca bezpieczeństwa klinicznego: Ten opis w prostym języku ma charakter edukacyjny i przygotowuje do rozmowy z lekarzem genetykiem klinicznym. Nie zastępuje on formalnego rozpoznania lekarskiego ani nie stanowi samodzielnego zalecenia terapeutycznego.'
          : 'Clinical Safety Notice: This plain-language summary is educational and supports consultation with a qualified clinical geneticist. It does not constitute an independent medical diagnosis or treatment prescription.';
    }

    const stepsArr = pr.simpleSteps?.[this.lang] || pr.simpleSteps?.pl || [];
    if (stepsList && Array.isArray(stepsArr)) {
      stepsList.innerHTML = stepsArr
        .map((stepText, idx) => {
          const colonIdx = stepText.indexOf(':');
          const titlePart = colonIdx > -1 ? stepText.slice(0, colonIdx + 1) : `${this.lang === 'pl' ? 'Krok' : 'Step'} ${idx + 1}`;
          const descPart = colonIdx > -1 ? stepText.slice(colonIdx + 1).trim() : stepText;
          return `
            <div class="patient-step-item">
              <span class="patient-step-num">${idx + 1}</span>
              <div class="patient-step-content">
                <strong>${titlePart}</strong>
                <span>${descPart}</span>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }

  renderPedigree() {
    const svgWrapper = document.getElementById('pedigree-svg-wrapper');
    if (!svgWrapper || !this.activeCase) return;
    renderPedigreeSVG(
      svgWrapper,
      this.activeCase,
      this.lang,
      this.selectedMemberId,
      this.simScenario,
      (member) => this.selectPedigreeMember(member.id),
      this.pedigreeMode === 'bw'
    );
  }

  selectPedigreeMember(memberId) {
    if (!this.activeCase) return;
    const member = this.activeCase.pedigreeMembers?.find((m) => m.id === memberId);
    if (!member) return;

    this.selectedMemberId = memberId;
    this.renderPedigree();

    const idEl = document.getElementById('insp-id');
    const nameEl = document.getElementById('insp-name');
    const roleEl = document.getElementById('insp-role');
    const phenoEl = document.getElementById('insp-phenotype');
    const genoEl = document.getElementById('insp-genotype');
    const recEl = document.getElementById('insp-recommendation');

    const scenarioObj =
      member.riskByScenario?.[this.simScenario] || member.riskByScenario?.pending || {};

    if (idEl) {
      idEl.textContent = `${member.label || member.id} ${member.proband ? '• PROBAND' : ''}`;
    }
    if (nameEl) {
      nameEl.textContent = member.name?.[this.lang] || member.name?.pl || '';
    }
    if (roleEl) {
      roleEl.textContent = `${member.age?.[this.lang] || ''} • ${member.subLabel?.[this.lang] || ''}`;
    }
    if (phenoEl) {
      phenoEl.textContent = member.condition?.[this.lang] || '';
    }
    if (genoEl) {
      genoEl.textContent = scenarioObj.risk || '—';
    }
    if (recEl) {
      recEl.textContent =
        (this.lang === 'pl' ? scenarioObj.actionPl : scenarioObj.actionEn) ||
        member.testMethod?.[this.lang] ||
        '';
    }
  }

  renderProfessionalView() {
    const c = this.activeCase;
    if (!c) return;

    const v = c.variant || {};
    const kvContainer = document.getElementById('pro-variant-kv');
    const acmgBadge = document.getElementById('pro-acmg-badge');
    const origText = document.getElementById('pro-original-text');

    if (acmgBadge) {
      acmgBadge.textContent = v.classification?.[this.lang] || 'Pathogenic (ACMG)';
    }
    if (origText) {
      origText.textContent = c.rawText?.[this.lang] || '';
    }


    if (kvContainer) {
      const items = [
        { label: this.lang === 'pl' ? 'Gen / Transkrypt MANE' : 'Gene / MANE Transcript', val: `${v.gene || '—'} (${v.transcript || ''})` },
        { label: this.lang === 'pl' ? 'HGVS cDNA i białko' : 'HGVS cDNA & Protein', val: `${v.hgvs_c || '—'} ${v.hgvs_p || ''}` },
        { label: 'GRCh38 / rsID', val: `${v.genomic_grch38 || '—'} (${v.rsid || ''})` },
        { label: this.lang === 'pl' ? 'Materiał badany' : 'Sample Source', val: v.sampleSource?.[this.lang] || '—' },
        { label: this.lang === 'pl' ? 'Zygotyczność / frakcja allelu' : 'Zygosity / allele fraction', val: v.germlineLikelihood || '—' },
        { label: this.lang === 'pl' ? 'Skutek molekularny' : 'Molecular Consequence', val: v.consequence?.[this.lang] || '—', long: true }
      ];
      kvContainer.innerHTML = items
        .map(
          (item) => `
        <div class="kv-box${item.long ? ' kv-long' : ''}">
          <span class="kv-label">${item.label}</span>
          <span class="kv-val">${item.val}</span>
        </div>
      `
        )
        .join('');
    }

    // Science Multi-Omics & 3D Domain Track (Level 3)
    const sci = c.scienceAnalysis || {};
    const starsBadge = document.getElementById('pro-clinvar-stars');
    if (starsBadge) {
      const st = sci.clinvar?.stars || '';
      const known = /★/.test(st);
      starsBadge.textContent = known ? `ClinVar ${st.match(/★+/)[0]}` : (this.lang === 'pl' ? 'ClinVar: do weryfikacji' : 'ClinVar: to verify');
      starsBadge.className = 'badge ' + (known ? 'badge-teal' : 'badge-amber');
    }
    const clinvarEl = document.getElementById('pro-science-clinvar');
    const gnomadEl = document.getElementById('pro-science-gnomad');
    const structEl = document.getElementById('pro-science-structure');
    const domainTrack = document.getElementById('pro-domain-track');
    const provList = document.getElementById('pro-provenance-list');

    if (clinvarEl) {
      clinvarEl.innerHTML = `<strong>ClinVar (${sci.clinvar?.variationId || v.clinvar_id || 'VCV000054909'}):</strong> ${
        sci.clinvar?.significance || 'Pathogenic'
      } — ${sci.clinvar?.stars || v.review_status || (this.lang === 'pl' ? 'status do weryfikacji' : 'status to verify')}`;
    }
    if (gnomadEl) {
      gnomadEl.innerHTML = `<strong>gnomAD v4.1 (${sci.gnomad?.variantId || v.genomic_grch38 || 'GRCh38'}):</strong> AF = ${
        sci.gnomad?.globalAF || '0.0000142'
      } — ${this.lang === 'pl' ? sci.gnomad?.summaryPl || '' : sci.gnomad?.summaryEn || ''}`;
    }
    if (structEl) {
      structEl.innerHTML = `<strong>UniProt ${sci.structural3D?.uniprot || v.uniprotId || 'P38398'} (${
        sci.structural3D?.alphafoldModel || 'AlphaFold 3D'
      }):</strong> ${
        this.lang === 'pl'
          ? sci.structural3D?.therapeuticImpactPl || v.consequence?.pl || ''
          : sci.structural3D?.therapeuticImpactEn || v.consequence?.en || ''
      }`;
    }

    if (domainTrack && Array.isArray(sci.structural3D?.domains)) {
      domainTrack.innerHTML = sci.structural3D.domains
        .map(
          (d) => `
        <div class="domain-seg ${d.status === 'lost' ? 'lost' : ''}" title="${
            this.lang === 'pl' ? d.rolePl : d.roleEn
          }">
          <span>${d.name}</span>
          <small style="display:block; opacity:0.8;">${d.range}</small>
        </div>
      `
        )
        .join('');
    } else if (domainTrack) {
      domainTrack.innerHTML = '';
    }

    // Provenance Table
    const sources = c.integrityAndProvenance?.sources || CASES_DATA[DEFAULT_CASE_ID].integrityAndProvenance.sources;
    if (provList && Array.isArray(sources)) {
      provList.innerHTML = sources
        .map(
          (s) => `
        <div class="gc-prov-row">
          <span class="gc-prov-db">${s.db} <small>(${s.version})</small></span>
          <code class="gc-prov-id">${s.id}</code>
          <span class="gc-prov-status${/weryfik|verif|—|brak/i.test(s.status) ? ' is-pending' : ''}">${s.status}</span>
        </div>
      `
        )
        .join('');
    }

    // Level 2 Specialist Verdict & Reasoning
    const q2 = c.q2Analysis || {};
    const verdictEl = document.getElementById('pro-q2-verdict');
    const pointsEl = document.getElementById('pro-q2-points');

    if (verdictEl) {
      verdictEl.innerHTML = `<strong>${q2.verdictBanner?.[this.lang] || ''}</strong>`;
    }
    if (pointsEl && Array.isArray(q2.cards)) {
      pointsEl.innerHTML = q2.cards
        .map((card) => {
          const pts = card.points?.[this.lang] || card.points?.pl || [];
          return `
            <div class="reasoning-card">
              <div style="font-size:0.68rem; font-weight:800; text-transform:uppercase; color:var(--brand-primary); margin-bottom:3px;">
                ${card.tag?.[this.lang] || ''}
              </div>
              <h4>${card.title?.[this.lang] || ''}</h4>
              <ul style="padding-left:18px; margin-top:6px; font-size:0.81rem; color:var(--text-secondary); line-height:1.55;">
                ${pts.map((p) => `<li>${p}</li>`).join('')}
              </ul>
            </div>
          `;
        })
        .join('');
    }

    this.renderSimulator();
    this.renderDiagnosticTable();
  }

  renderPatientCard() {
    const wrap = document.getElementById('patient-card-section');
    if (!wrap) return;
    const pc = this.activeCase?.patientCard;
    if (!pc) {
      wrap.hidden = true;
      return;
    }
    const L = this.lang === 'pl' ? 'pl' : 'en';
    const t = (o) => (o && (o[L] || o.pl)) || '';
    const esc = (x) => String(x).replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
    document.getElementById('pcard-title').textContent = t(pc.title);
    document.getElementById('pcard-subtitle').textContent = t(pc.subtitle);
    document.getElementById('pcard-footer').textContent = t(pc.footer);
    document.getElementById('pcard-body').innerHTML = (pc.sections || [])
      .map(
        (sec, i) => `
        <section class="pcard-sec" data-key="${esc(sec.key || '')}">
          <h4><span class="pcard-n">${i + 1}</span>${esc(t(sec.title))}</h4>
          <dl>${(sec.items || [])
            .map((it) => `<div class="pcard-row"><dt>${esc(t(it.label))}</dt><dd>${esc(t(it.text))}</dd></div>`)
            .join('')}</dl>
        </section>`
      )
      .join('');
    wrap.hidden = false;
    this.setPatientCardExpanded(this.audienceMode === 'patient' || this.pcardExpanded === true);
  }

  setPatientCardExpanded(open) {
    this.pcardExpanded = open;
    const wrap = document.getElementById('patient-card-section');
    const btn = document.getElementById('btn-toggle-pcard');
    if (!wrap) return;
    wrap.classList.toggle('is-collapsed', !open);
    if (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open
        ? (this.lang === 'pl' ? 'Zwiń kartę' : 'Collapse sheet')
        : (this.lang === 'pl' ? 'Pokaż całą kartę' : 'Show full sheet');
    }
  }

  renderSimulator() {
    const simBox = document.getElementById('sim-output-box');
    const btnA = document.getElementById('sim-btn-germline');
    const btnB = document.getElementById('sim-btn-somatic');
    if (!simBox || !this.activeCase) return;

    // Case-defined simulator texts (generic — any case can provide `simulator`)
    const sim = this.activeCase.simulator;
    if (sim) {
      const L = this.lang === 'pl' ? 'pl' : 'en';
      if (btnA && sim.btnA) btnA.textContent = sim.btnA[L] || sim.btnA.pl;
      if (btnB && sim.btnB) btnB.textContent = sim.btnB[L] || sim.btnB.pl;
      const box = this.simScenario === 'somatic' ? sim.boxB : sim.boxA;
      simBox.innerHTML = box ? box[L] || box.pl : '';
      return;
    }

    if (this.activeCase.id === 'cftr_ar') {
      if (btnA) {
        btnA.textContent =
          this.lang === 'pl'
            ? 'Scenariusz A: Potwierdzony układ TRANS u rodziców (>99%)'
            : 'Scenario A: Confirmed Parental TRANS Phase (>99%)';
      }
      if (btnB) {
        btnB.textContent =
          this.lang === 'pl'
            ? 'Scenariusz B: Rzadki allel złożony CIS u jednego rodzica (<1%)'
            : 'Scenario B: Rare Complex CIS Allele in One Parent (<1%)';
      }
      if (this.simScenario !== 'somatic') {
        simBox.innerHTML =
          this.lang === 'pl'
            ? `
          <strong style="color:var(--status-danger); display:block; margin-bottom:6px;">
            ✓ Scenariusz A: Układ TRANS potwierdzony (Marta niesie jeden wariant CFTR, Tomasz drugi)
          </strong>
          <ul style="padding-left:18px; line-height:1.6;">
            <li><strong>Probant (Antoś, II-2):</strong> Potwierdzona bialleliczna mukowiscydoza (złożona heterozygotyczność) — kwalifikacja do terapii modulatorami CFTR (ETI).</li>
            <li><strong>Kolejne ciąże rodziców (I-1 i I-2):</strong> Stałe <strong>25% ryzyka</strong> choroby AR (oraz 50% nosicielstwa); możliwość diagnostyki prenatalnej lub PGT-M.</li>
            <li><strong>Siostra matki planująca ciążę (I-3, 27 l.):</strong> Ma 50% ryzyka nosicielstwa dokładnie tego wariantu, który wykryto u Marty (I-2) — pilne badanie celowane przed ciążą.</li>
            <li><strong>Starsza siostra Zuzia (II-1, 4 l.):</strong> Jako zdrowe dziecko pary nosicieli ma <strong>2/3 (~67%)</strong> prawdopodobieństwa bycia bezobjawową nosicielką.</li>
          </ul>
        `
            : `
          <strong style="color:var(--status-danger); display:block; margin-bottom:6px;">
            ✓ Scenario A: TRANS Phase Confirmed (One CFTR variant maternal, one paternal)
          </strong>
          <ul style="padding-left:18px; line-height:1.6;">
            <li><strong>Proband (Antoś, II-2):</strong> Confirmed biallelic Cystic Fibrosis (compound heterozygote) — eligible for ETI CFTR modulators.</li>
            <li><strong>Future pregnancies of parents (I-1 &amp; I-2):</strong> <strong>25% recurrence risk</strong> (50% carrier risk); eligible for prenatal diagnosis or PGT-M.</li>
            <li><strong>Maternal Aunt planning pregnancy (I-3, 27y):</strong> 50% risk of carrying Marta's identified maternal variant — urgent preconception testing.</li>
            <li><strong>Older sister Zuzia (II-1, 4y):</strong> As an unaffected sibling, she has a <strong>2/3 (~67%)</strong> probability of being a heterozygous carrier.</li>
          </ul>
        `;
      } else {
        simBox.innerHTML =
          this.lang === 'pl'
            ? `
          <strong style="color:var(--brand-primary); display:block; margin-bottom:6px;">
            ✓ Scenariusz B: Oba warianty na jednym chromosomie (Układ CIS) — wymagane poszerzenie diagnostyki
          </strong>
          <ul style="padding-left:18px; line-height:1.6;">
            <li><strong>Implikacja diagnostyczna:</strong> Gdyby oba warianty pochodziły wyłącznie od jednego rodzica (w układzie <em>cis</em>), przy chlorkach potu 98 mmol/L u dziecka należałoby pilnie szukać <strong>trzeciego wariantu patogennego</strong> (np. dużej delecji eksonowej metodą MLPA lub wariantu głęboko intronowego) na drugim chromosomie.</li>
            <li><strong>Dlatego badanie obojga rodziców jest obowiązkowe:</strong> Zakładanie układu <em>trans</em> bez zbadania krwi rodziców stanowi błąd w sztuce poradnictwa genetycznego.</li>
          </ul>
        `
            : `
          <strong style="color:var(--brand-primary); display:block; margin-bottom:6px;">
            ✓ Scenario B: Both variants on the same chromosome (CIS Phase) — extended workup required
          </strong>
          <ul style="padding-left:18px; line-height:1.6;">
            <li><strong>Diagnostic implication:</strong> If both variants were inherited on a single parental allele (<em>cis</em>), given sweat chloride of 98 mmol/L, full CFTR sequencing + MLPA copy-number analysis must be performed to identify the true pathogenic variant on the second allele.</li>
            <li><strong>Why parental segregation is mandatory:</strong> Never assume <em>trans</em> phase without testing both parents.</li>
          </ul>
        `;
      }
      return;
    }

    // Default / Zestaw 11 (BRCA1) & Custom Cases
    if (btnA) {
      btnA.textContent =
        this.lang === 'pl'
          ? 'Scenariusz A: Potwierdzona mutacja germinalna (~70–75%)'
          : 'Scenario A: Confirmed Germline Mutation (~70–75%)';
    }
    if (btnB) {
      btnB.textContent =
        this.lang === 'pl'
          ? 'Scenariusz B: Wyłącznie mutacja somatyczna w guzie (~25–30%)'
          : 'Scenario B: Somatic-Only Tumor Mutation (~25–30%)';
    }

    if (this.simScenario !== 'somatic') {
      simBox.innerHTML =
        this.lang === 'pl'
          ? `
        <strong style="color:var(--status-danger); display:block; margin-bottom:6px;">
          ✓ Scenariusz A: Wariant potwierdzony w krwi obwodowej (Mutacja germinalna — zespół HBOC / choroba dziedziczna)
        </strong>
        <ul style="padding-left:18px; line-height:1.6;">
          <li><strong>Probandka (III-3):</strong> Kwalifikacja do terapii celowanej (inhibitory PARP — olaparyb) oraz ścisłego nadzoru gruczołów piersiowych (MRI co 12 mies.).</li>
          <li><strong>Rodzice (II-4 Czesław i II-5 Genowefa) oraz rodzeństwo (III-1, III-4):</strong> Pilne badanie kaskadowe ukierunkowane na znany wariant (50% ryzyka u krewnych I stopnia).</li>
          <li><strong>Dzieci rodzeństwa (IV-1, IV-2 — bliźniaczki dwujajowe; IV-3, IV-4):</strong> Badanie kaskadowe po ukończeniu 18 r.ż., jeśli ich rodzic okaże się nosicielem (obie bliźniaczki dwujajowe badane osobno!).</li>
          <li><strong>Niezależny tor cytogenetyczny (II-6 Wiesława):</strong> Nadal obowiązuje badanie kariotypu w kierunku zrównoważonej translokacji chromosomowej.</li>
        </ul>
      `
          : `
        <strong style="color:var(--status-danger); display:block; margin-bottom:6px;">
          ✓ Scenario A: Variant confirmed in peripheral blood (Germline mutation — Hereditary syndrome)
        </strong>
        <ul style="padding-left:18px; line-height:1.6;">
          <li><strong>Proband (III-3):</strong> Eligible for targeted therapy (PARP inhibitors) and intensive breast MRI surveillance.</li>
          <li><strong>Parents (II-4, II-5) &amp; Siblings (III-1, III-4):</strong> Targeted cascade testing for the known familial variant (50% risk in 1st-degree relatives).</li>
          <li><strong>Dizygotic Twins (IV-1, IV-2) &amp; Nephews (IV-3, IV-4):</strong> Predictive testing at age ≥18 if their parent tests positive (both dizygotic twins must be tested independently!).</li>
          <li><strong>Independent Cytogenetic Track (II-6 Wiesława):</strong> Peripheral blood karyotype remains indicated due to 3 recurrent miscarriages.</li>
        </ul>
      `;
    } else {
      simBox.innerHTML =
        this.lang === 'pl'
          ? `
        <strong style="color:var(--brand-primary); display:block; margin-bottom:6px;">
          ✓ Scenariusz B: Wariant NIEOBECNY w krwi obwodowej (Wyłącznie mutacja somatyczna ograniczona do tkanki guza)
        </strong>
        <ul style="padding-left:18px; line-height:1.6;">
          <li><strong>Probandka (III-3):</strong> Zachowuje korzyść terapeutyczną z inhibitorów PARP (wrażliwość guza na syntetyczną letalność), ale nie ma dziedzicznego zespołu BRCA1.</li>
          <li><strong>Brak konieczności badań kaskadowych BRCA1 u krewnych:</strong> Rodzice (II-4, II-5), rodzeństwo (III-1, III-4) oraz bliźniaczki (IV-1, IV-2) mają 0% ryzyka odziedziczenia mutacji somatycznej guza.</li>
          <li><strong>Uwaga na II tor genetyczny w rodzinie:</strong> Wykluczenie germinalnego BRCA1 u Katarzyny <u>nie wyklucza</u> aberracji chromosomowej u ciotki Wiesławy (II-6, 3 poronienia).</li>
        </ul>
      `
          : `
        <strong style="color:var(--brand-primary); display:block; margin-bottom:6px;">
          ✓ Scenario B: Variant ABSENT in peripheral blood (Somatic-only mutation restricted to tumor tissue)
        </strong>
        <ul style="padding-left:18px; line-height:1.6;">
          <li><strong>Proband (III-3):</strong> Retains therapeutic eligibility for PARP inhibitors, without germline HBOC transmission risk.</li>
          <li><strong>No BRCA1 cascade testing required for relatives:</strong> Parents, siblings, and dizygotic twins have 0% risk from a somatic-only tumor mutation.</li>
          <li><strong>Second genetic track remains active:</strong> Maternal aunt Wiesława (II-6, 3 spontaneous miscarriages) still represents a separate cytogenetic history.</li>
        </ul>
      `;
    }
  }

  renderDiagnosticTable() {
    const tbody = document.getElementById('pro-diagnostic-tbody');
    if (!tbody || !this.activeCase) return;

    const members = this.activeCase.pedigreeMembers || [];
    const filtered = members.filter((m) => {
      if (this.activeTableFilter === 'all') return true;
      if (this.activeTableFilter === 'urgent') return m.priority === 'step1';
      if (this.activeTableFilter === 'cascade') return m.priority === 'step2' || m.priority === 'step3';
      if (this.activeTableFilter === 'cytogenetics') return m.priority === 'step4' || m.priority === 'low';
      return true;
    });

    const priorityBadgeMap = {
      step1: {
        cls: 'badge-danger',
        pl: 'KROK 1 • PILNE',
        en: 'STEP 1 • URGENT'
      },
      step2: {
        cls: 'badge-amber',
        pl: 'KROK 2 • RODZICE',
        en: 'STEP 2 • PARENTS'
      },
      step3: {
        cls: 'badge-teal',
        pl: 'KROK 3 • RODZEŃSTWO',
        en: 'STEP 3 • SIBLINGS'
      },
      step4: {
        cls: 'badge-indigo',
        pl: 'KROK 4 • ≥18 R.Ż. / CYTO',
        en: 'STEP 4 • ≥18Y / CYTO'
      },
      low: {
        cls: 'badge-slate',
        pl: 'NISKI PRIORYTET',
        en: 'LOW PRIORITY'
      },
      none: {
        cls: 'badge-slate',
        pl: 'ZMARLI / BRAK BADANIA',
        en: 'DECEASED / NO TEST'
      }
    };

    // Filter pills: show counts and disable options with no matching family members
    const FILTERS = {
      all: () => true,
      urgent: (m) => m.priority === 'step1',
      cascade: (m) => m.priority === 'step2' || m.priority === 'step3',
      cytogenetics: (m) => m.priority === 'step4' || m.priority === 'low'
    };
    document.querySelectorAll('.filter-pill[data-filter]').forEach((pill) => {
      const key = pill.getAttribute('data-filter');
      const n = members.filter(FILTERS[key] || FILTERS.all).length;
      let cnt = pill.querySelector('.filter-count');
      if (!cnt) {
        cnt = document.createElement('span');
        cnt.className = 'filter-count';
        pill.appendChild(cnt);
      }
      cnt.textContent = n;
      const empty = n === 0 && key !== 'all';
      pill.disabled = empty;
      pill.setAttribute('aria-disabled', empty ? 'true' : 'false');
      pill.title = empty ? (this.lang === 'pl' ? 'Brak osób w tej kategorii w tym przypadku' : 'No family members in this category for this case') : '';
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr class="gc-empty-row"><td colspan="5">${
        this.lang === 'pl'
          ? 'Brak członków rodziny w tej kategorii dla aktywnego przypadku. <button type="button" class="gc-link-btn" data-reset-filter>Pokaż wszystkich</button>'
          : 'No family members in this category for the active case. <button type="button" class="gc-link-btn" data-reset-filter>Show all</button>'
      }</td></tr>`;
      tbody.querySelector('[data-reset-filter]')?.addEventListener('click', () => {
        document.querySelector('.filter-pill[data-filter="all"]')?.click();
      });
      return;
    }

    tbody.innerHTML = filtered
      .map((m) => {
        const pInfo = priorityBadgeMap[m.priority] || priorityBadgeMap.none;
        const testStr =
          m.testMethod?.[this.lang] ||
          (this.lang === 'pl'
            ? m.riskByScenario?.pending?.actionPl
            : m.riskByScenario?.pending?.actionEn) ||
          '—';
        const ratStr = m.clinicalRationale?.[this.lang] || '—';

        return `
        <tr data-member-row="${m.id}" style="cursor:pointer;">
          <td>
            <strong style="color:var(--text-primary);">${m.label || m.id} — ${m.name?.[this.lang] || ''}</strong>
            <div style="font-size:0.74rem; color:var(--text-muted);">${m.age?.[this.lang] || ''} • ${
          m.subLabel?.[this.lang] || ''
        }</div>
          </td>
          <td>${m.condition?.[this.lang] || ''}</td>
          <td><span class="badge ${pInfo.cls}">${pInfo[this.lang]}</span></td>
          <td style="font-weight:500; color:var(--text-primary);">${testStr}</td>
          <td>${ratStr}</td>
        </tr>
      `;
      })
      .join('');

    tbody.querySelectorAll('[data-member-row]').forEach((row) => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-member-row');
        if (id) {
          this.selectPedigreeMember(id);
          document.getElementById('pedigree-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  initScrollSystem() {
    const progressBar = document.getElementById('scroll-progress-bar');
    const scrollFab = document.getElementById('scroll-up-fab');
    const ringCircle = document.getElementById('scroll-ring-circle');
    const circumference = 94.25;
    let lastScrollY = window.scrollY || 0;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, y / docHeight));

      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
      }
      if (ringCircle) {
        const offset = circumference * (1 - progress);
        ringCircle.style.strokeDashoffset = offset.toFixed(2);
      }

      const delta = y - lastScrollY;
      if (Math.abs(delta) > 4) {
        const dir = delta > 0 ? 'down' : 'up';
        document.body.setAttribute('data-scroll-dir', dir);
        if (scrollFab) {
          scrollFab.classList.toggle('is-scrolling-up', dir === 'up');
        }
        lastScrollY = y;
      }

      if (scrollFab) {
        scrollFab.classList.toggle('visible', y > 220);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    scrollFab?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.clinicalApp = new ClinicalGeneticsWorkspace();
});
