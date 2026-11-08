/**
 * GenCode® — przypadki kliniczne (dane referencyjne Workspace)
 * 1. nf1  — Nerwiakowłókniakowatość typu 1 (panel RASopatii, ZGM IMiD)
 */

export const DEFAULT_CASE_ID = "nf1";

export const CASES_DATA = {
  "nf1": {
    "id": "nf1",
    "category": {
      "pl": "Genetyka kliniczna • RASopatie / Neurofibromatoza",
      "en": "Clinical genetics • RASopathies / Neurofibromatosis"
    },
    "inheritanceMode": {
      "pl": "Autosomalne dominujące (AD) • ~50% przypadków de novo",
      "en": "Autosomal dominant (AD) • ~50% of cases de novo"
    },
    "title": {
      "pl": "Przypadek 1 — Nerwiakowłókniakowatość typu 1: NF1 c.3525_3526del p.(Arg1176SerfsTer18)",
      "en": "Case 1 — Neurofibromatosis type 1: NF1 c.3525_3526del p.(Arg1176SerfsTer18)"
    },
    "badge": {
      "pl": "RASopatie • Panel NGS SS_CRANIO_v4a",
      "en": "RASopathies • NGS panel SS_CRANIO_v4a"
    },
    "rawText": {
      "pl": "NGS (KAPA Hyper Choice, Roche; panel SS_CRANIO_v4a; NextSeq550). Analizowano 24 geny RASopatii (PTPN11, SOS1, SOS2, RAF1, BRAF, KRAS, NRAS, HRAS, RRAS, RRAS2, RIT1, MRAS, MAP2K1, MAP2K2, NF1, SPRED1, SPRED2, LZTR1, CBL, SHOC2, PPP1CB, FBXW11, MAPK1, CDC42). Zidentyfikowano patogenny wariant NF1 NM_001042492.3:c.[3525_3526del];[=] p.[(Arg1176SerfsTer18)];[=] w stanie heterozygotycznym (138/259 odczytów). ClinVar VCV000428971.41, HGMD CD000971; opisywany u pacjentów z NF1. Zalecenia laboratorium: konsultacja genetyczna, różnicowanie kliniczne, badanie rodziców (ocena de novo).",
      "en": "NGS (KAPA Hyper Choice, Roche; SS_CRANIO_v4a panel; NextSeq550). 24 RASopathy genes analysed. A pathogenic heterozygous NF1 variant NM_001042492.3:c.[3525_3526del];[=] p.[(Arg1176SerfsTer18)];[=] was identified (138/259 reads). ClinVar VCV000428971.41, HGMD CD000971; reported in NF1 patients. Lab recommendations: genetic counselling, clinical differential diagnosis, parental testing (de novo assessment)."
    },
    "patientReport": {
      "headline": {
        "pl": "Co oznacza wynik badania genetycznego i jakie są kolejne kroki?",
        "en": "What does the genetic result mean and what are the next steps?"
      },
      "summary": {
        "pl": "W badaniu znaleziono zmianę w jednej z dwóch kopii genu NF1. Ten gen działa jak „hamulec” wzrostu komórek. Zmiana wyłącza jedną kopię genu, dlatego jest uznawana za przyczynę nerwiakowłókniakowatości typu 1 (NF1) i najpewniej tłumaczy objawy Pani/dziecka. Ostateczne rozpoznanie stawia lekarz po badaniu klinicznym.",
        "en": "The test found a change in one of the two copies of the NF1 gene, which acts as a 'brake' on cell growth. The change switches off one copy, so it is considered the cause of neurofibromatosis type 1 (NF1) and most likely explains the symptoms. The final diagnosis is made by a physician after a clinical examination."
      },
      "hereditaryExplanation": {
        "pl": "NF1 dziedziczy się autosomalnie dominująco: każde dziecko osoby z tą zmianą ma 50% szans, że ją odziedziczy. U około połowy osób zmiana pojawia się po raz pierwszy w rodzinie (de novo). Badanie rodziców pokaże, czy tak jest w Pani/Państwa rodzinie — od tego zależy ryzyko dla rodzeństwa.",
        "en": "NF1 is autosomal dominant: each child of a person with the change has a 50% chance of inheriting it. In about half of people the change arises for the first time in the family (de novo). Testing the parents will show which applies — this determines the risk for siblings."
      },
      "simpleSteps": {
        "pl": [
          "Wizyta w Poradni Genetycznej: omówienie wyniku i badanie kliniczne (kryteria NF1).",
          "Badanie krwi obojga biologicznych rodziców w kierunku tej samej zmiany.",
          "Regularne kontrole: skóra, wzrok, ciśnienie, kręgosłup, rozwój i nauka — zgodnie z planem opieki."
        ],
        "en": [
          "Genetics clinic visit: result discussion and clinical examination (NF1 criteria).",
          "Blood test of both biological parents for the same change.",
          "Regular check-ups: skin, eyes, blood pressure, spine, development and learning — per the care plan."
        ]
      }
    },
    "questions": {
      "q1": {
        "pl": "1. Wariant NF1 i jego mechanizm (utrata funkcji)",
        "en": "1. The NF1 variant and its mechanism (loss of function)"
      },
      "q2": {
        "pl": "2. Wariant a rozpoznanie: kryteria NF1 i różnicowanie RASopatii",
        "en": "2. Variant vs. diagnosis: NF1 criteria and RASopathy differential"
      },
      "q3": {
        "pl": "3. De novo czy dziedziczony? Ryzyko w rodzinie i opieka",
        "en": "3. De novo or inherited? Family risk and care"
      }
    },
    "variant": {
      "gene": "NF1",
      "transcript": "NM_001042492.3 (MANE Select) • NP_001035957.1",
      "hgvs_c": "c.3525_3526del",
      "hgvs_p": "p.(Arg1176SerfsTer18)",
      "genomic_grch38": "17q11.2 (współrzędne GRCh38 — brak w raporcie)",
      "rsid": "ClinVar VCV000428971.41 • HGMD CD000971",
      "classification": {
        "pl": "Patogenny (Klasa 5 ACMG)",
        "en": "Pathogenic (ACMG class 5)"
      },
      "consequence": {
        "pl": "Delecja 2 nukleotydów → przesunięcie ramki odczytu i przedwczesny kodon STOP (18 kodonów dalej). Oczekiwany rozpad mRNA (NMD) i haploinsuficjencja neurofibrominy — znany mechanizm choroby (LoF).",
        "en": "2-nt deletion → frameshift and premature stop codon 18 codons downstream. Expected nonsense-mediated decay (NMD) and neurofibromin haploinsufficiency — established disease mechanism (LoF)."
      },
      "sampleSource": {
        "pl": "DNA (materiał wg zlecenia; najpewniej krew obwodowa)",
        "en": "DNA (sample per request; most likely peripheral blood)"
      },
      "germlineLikelihood": "VAF ~53% (138/259)"
    },
    "scienceAnalysis": {
      "clinvar": {
        "variationId": "VCV000428971.41",
        "significance": "Pathogenic (wg raportu)",
        "stars": "Status recenzji do weryfikacji w ClinVar",
        "acmgCriteria": [
          "PVS1 (frameshift → NMD; LoF to znany mechanizm NF1)",
          "PS4_Moderate (wariant opisywany u wielu pacjentów z NF1 — HGMD/ClinVar; liczba probandów do weryfikacji)",
          "PM2_Supporting (brak/niezwykle rzadki w gnomAD — do weryfikacji)",
          "PS2 (możliwe do dodania, jeśli badanie rodziców potwierdzi de novo)"
        ]
      },
      "gnomad": {
        "variantId": "NF1 c.3525_3526del (GRCh38 — do uzupełnienia)",
        "rsid": "—",
        "globalAF": "Brak danych w raporcie — do sprawdzenia",
        "summaryPl": "Częstość populacyjna nie została podana w raporcie. Dla wariantu powodującego chorobę AD o wysokiej penetracji oczekuje się braku w gnomAD (PM2_Supporting).",
        "summaryEn": "Population frequency is not given in the report. For a highly penetrant AD disease variant, absence from gnomAD is expected (PM2_Supporting)."
      },
      "structural3D": {
        "uniprot": "P21359 (neurofibromina, 2839 aa)",
        "alphafoldModel": "AF-P21359-F1",
        "domains": [
          {
            "name": "CSRD",
            "range": "≈543–909 aa",
            "status": "retained",
            "rolePl": "Domena bogata w cysteinę/serynę (fosforylacja przez PKA)",
            "roleEn": "Cysteine/serine-rich domain (PKA phosphorylation)"
          },
          {
            "name": "TBD • p.Arg1176fs",
            "range": "≈1095–1197 aa",
            "status": "truncation_site",
            "rolePl": "Rejon wiązania tubuliny — tu powstaje przesunięcie ramki (aa 1176)",
            "roleEn": "Tubulin-binding region — frameshift arises here (aa 1176)"
          },
          {
            "name": "GRD (RasGAP)",
            "range": "≈1198–1530 aa",
            "status": "lost",
            "rolePl": "Domena GAP inaktywująca RAS — kluczowa dla funkcji supresorowej; nie powstaje z allelu z wariantem",
            "roleEn": "RAS-inactivating GAP domain — key for tumour-suppressor function; not produced from the variant allele"
          },
          {
            "name": "Sec14–PH • CTD",
            "range": "≈1545–2839 aa",
            "status": "lost",
            "rolePl": "Wiązanie lipidów, lokalizacja błonowa, region C-końcowy",
            "roleEn": "Lipid binding, membrane localisation, C-terminal region"
          }
        ],
        "therapeuticImpactPl": "Utrata funkcji neurofibrominy → nadaktywność szlaku RAS–MAPK. Objawowe, nieoperacyjne nerwiakowłókniaki splotowate można leczyć inhibitorami MEK (selumetynib — program lekowy B.155 dla dzieci; mirdametynib — rejestracja UE 2025).",
        "therapeuticImpactEn": "Loss of neurofibromin → RAS–MAPK pathway overactivity. Symptomatic inoperable plexiform neurofibromas can be treated with MEK inhibitors (selumetinib — Polish drug programme B.155 for children; mirdametinib — EU approval 2025)."
      }
    },
    "dashboardTelemetry": {
      "caseCode": "GC-2026-NF1",
      "sampleId": "ZGM IMiD • panel SS_CRANIO_v4a",
      "qcStatus": {
        "pl": "NGS NextSeq550 • 138/259 odczytów",
        "en": "NGS NextSeq550 • 138/259 reads"
      },
      "card1": {
        "title": {
          "pl": "Wariant Główny",
          "en": "Primary Variant"
        },
        "sub": "NF1 • c.3525_3526del",
        "badgeVal": "PVS1",
        "badgeUnit": "Frameshift"
      },
      "card2": {
        "title": {
          "pl": "Klasyfikacja ACMG",
          "en": "ACMG Classification"
        },
        "sub": "ClinVar VCV000428971",
        "badgeVal": "Klasa 5",
        "badgeUnit": "Pathogenic"
      },
      "card3": {
        "title": {
          "pl": "Frakcja Allelu (VAF)",
          "en": "Allele Fraction (VAF)"
        },
        "sub": {
          "pl": "138 / 259 odczytów",
          "en": "138 / 259 reads"
        },
        "badgeVal": "53%",
        "badgeUnit": "VAF"
      },
      "condHeading": {
        "pl": "Parametry Dziedziczenia i Ryzyka",
        "en": "Inheritance & Risk Parameters"
      },
      "condSubcount": {
        "pl": "Probantka + 2 rodziców • dziedziczenie AD",
        "en": "Proband + 2 parents • AD inheritance"
      },
      "cond1": {
        "title": {
          "pl": "Ryzyko dla Potomstwa",
          "en": "Offspring Risk"
        },
        "sub": {
          "pl": "Każde dziecko Badanej (AD)",
          "en": "Each child of the proband (AD)"
        },
        "val": "50.0",
        "unit": "% ryzyka",
        "activeTick": 6
      },
      "cond2": {
        "title": {
          "pl": "Szansa De Novo (a priori)",
          "en": "De Novo Likelihood (prior)"
        },
        "sub": {
          "pl": "Odsetek NF1 bez wywiadu rodzinnego",
          "en": "Share of NF1 without family history"
        },
        "val": "~50",
        "unit": "% de novo",
        "activeTick": 6
      },
      "widePill": {
        "title": {
          "pl": "Kryteria NF1 (rewizja 2021)",
          "en": "NF1 criteria (2021 revision)"
        },
        "sub": {
          "pl": "Wariant NF1 z VAF ~50% = 1 kryterium; rozpoznanie: ≥2 kryteria (lub ≥1 przy chorym rodzicu)",
          "en": "NF1 variant at VAF ~50% = 1 criterion; diagnosis: ≥2 criteria (or ≥1 with an affected parent)"
        },
        "pill": {
          "pl": "KROK 1: RODZICE + OCENA KLINICZNA",
          "en": "STEP 1: PARENTS + CLINICAL ASSESSMENT"
        }
      },
      "gauge": {
        "title": {
          "pl": "Ryzyko dla Rodzeństwa",
          "en": "Sibling Risk"
        },
        "sub": {
          "pl": "Zależy od wyniku badania rodziców",
          "en": "Depends on parental testing"
        },
        "val": "50%",
        "unit": {
          "pl": "jeśli dziedziczony",
          "en": "if inherited"
        },
        "target": {
          "pl": "<1% jeśli de novo",
          "en": "<1% if de novo"
        },
        "dashArray": "145 302"
      },
      "actionBanner": {
        "title": {
          "pl": "Priorytet Kliniczny (Krok 1): Badanie Rodziców i Konsultacja Genetyczna",
          "en": "Clinical Priority (Step 1): Parental Testing & Genetic Counselling"
        },
        "desc": {
          "pl": "Celowane badanie wariantu NF1 c.3525_3526del u obojga biologicznych rodziców (ocena de novo vs. dziedziczenie) oraz badanie kliniczne Badanej pod kątem kryteriów NF1 i różnicowania RASopatii.",
          "en": "Targeted NF1 c.3525_3526del testing in both biological parents (de novo vs. inherited) and clinical examination of the proband for NF1 criteria and RASopathy differential."
        },
        "cta": {
          "pl": "Przejdź do Raportu i Rodowodu ↓",
          "en": "Open Report & Pedigree ↓"
        }
      },
      "locusMap": {
        "d1": "CSRD",
        "d2": "TBD • fs1176",
        "d3": "GRD (RasGAP)",
        "s1": {
          "pl": "DNA • panel NGS",
          "en": "DNA • NGS panel"
        },
        "s2": {
          "pl": "Rodzice: Sanger",
          "en": "Parents: Sanger"
        }
      },
      "hotspots": [
        {
          "top": "21.5%",
          "left": "74%",
          "title": {
            "pl": "Locus Chromosomowy — NF1 (17q11.2)",
            "en": "Chromosomal Locus — NF1 (17q11.2)"
          },
          "sub": {
            "pl": "NM_001042492.3 • c.3525_3526del w stanie heterozygotycznym",
            "en": "NM_001042492.3 • heterozygous c.3525_3526del"
          },
          "locus": "chr17q11.2 • NF1"
        },
        {
          "top": "50.5%",
          "left": "66%",
          "title": {
            "pl": "Neurofibromina — Utrata Domeny GRD",
            "en": "Neurofibromin — GRD Domain Loss"
          },
          "sub": {
            "pl": "Przesunięcie ramki w aa 1176, przed domeną RasGAP → NMD",
            "en": "Frameshift at aa 1176, upstream of the RasGAP domain → NMD"
          },
          "locus": "p.Arg1176SerfsTer18"
        },
        {
          "top": "79.5%",
          "left": "48%",
          "title": {
            "pl": "Segregacja — Badanie Rodziców",
            "en": "Segregation — Parental Testing"
          },
          "sub": {
            "pl": "Ustalenie, czy wariant powstał de novo (I-1, I-2)",
            "en": "Determine whether the variant is de novo (I-1, I-2)"
          },
          "locus": "de novo vs. AD"
        }
      ]
    },
    "integrityAndProvenance": {
      "observedFinding": {
        "pl": "W DNA Badanej wykryto heterozygotyczny wariant NF1 NM_001042492.3:c.3525_3526del p.(Arg1176SerfsTer18) (138/259 odczytów, VAF ~53%). W pozostałych 23 genach RASopatii z panelu nie zgłoszono wariantów istotnych klinicznie.",
        "en": "A heterozygous NF1 variant NM_001042492.3:c.3525_3526del p.(Arg1176SerfsTer18) was detected (138/259 reads, VAF ~53%). No clinically relevant variants were reported in the other 23 RASopathy panel genes."
      },
      "inferredInterpretation": {
        "pl": "Wariant prowadzi do utraty funkcji jednego allelu NF1 i jest prawdopodobną przyczyną objawów Badanej. VAF ~50% przemawia za zmianą konstytucyjną (obecną we wszystkich komórkach), a nie mozaikową.",
        "en": "The variant causes loss of function of one NF1 allele and is the likely cause of the proband's symptoms. VAF ~50% supports a constitutional (not mosaic) change."
      },
      "classificationVsDiagnosis": {
        "pl": "Patogenny wariant NF1 to jedno kryterium diagnostyczne NF1 (rewizja 2021). Rozpoznanie choroby wymaga ≥2 kryteriów (np. ≥6 plam café-au-lait, piegi pachowe/pachwinowe) lub 1 kryterium przy chorym rodzicu — decyduje lekarz po badaniu.",
        "en": "A pathogenic NF1 variant is one NF1 diagnostic criterion (2021 revision). Diagnosis requires ≥2 criteria (e.g. ≥6 café-au-lait macules, axillary/inguinal freckling) or 1 criterion with an affected parent — the physician decides after examination."
      },
      "uncertaintyNote": {
        "pl": "Nieznane: obraz kliniczny Badanej i wiek (nie podano w raporcie), wywiad rodzinny, status rodziców (de novo vs. dziedziczenie; możliwa mozaika u rodzica), częstość w gnomAD i współrzędne GRCh38. Opis metody w raporcie jest ucięty (parametry sekwencjonowania).",
        "en": "Unknown: the proband's phenotype and age (not in the report), family history, parental status (de novo vs. inherited; possible parental mosaicism), gnomAD frequency and GRCh38 coordinates. The method description in the report is truncated."
      },
      "sources": [
        {
          "db": "ClinVar",
          "version": "VCV000428971.41",
          "id": "NF1 c.3525_3526del",
          "status": "Pathogenic (wg raportu ZGM IMiD)"
        },
        {
          "db": "HGMD",
          "version": "wg raportu",
          "id": "CD000971",
          "status": "Opisany u pacjentów z NF1"
        },
        {
          "db": "gnomAD",
          "version": "v4.1 (GRCh38)",
          "id": "—",
          "status": "Do weryfikacji (brak w raporcie)"
        },
        {
          "db": "ACMG/AMP + kryteria NF1",
          "version": "2015 / Legius 2021",
          "id": "PVS1 + PS4_Mod + PM2_Sup",
          "status": "Klasa 5 (Pathogenic)"
        }
      ]
    },
    "q2Analysis": {
      "verdictBanner": {
        "pl": "Wniosek główny: patogenny wariant utraty funkcji NF1 (VAF ~53%, konstytucyjny) jest prawdopodobną przyczyną objawów Badanej i stanowi jedno kryterium rozpoznania NF1. Potrzebne są: ocena kliniczna (kryteria 2021, różnicowanie z innymi RASopatiami) oraz badanie rodziców — wynik określi ryzyko dla rodzeństwa i może dodać kryterium PS2.",
        "en": "Main conclusion: a pathogenic NF1 loss-of-function variant (VAF ~53%, constitutional) is the likely cause of the proband's symptoms and is one NF1 diagnostic criterion. Required: clinical assessment (2021 criteria, differential vs. other RASopathies) and parental testing — the result defines sibling risk and may add PS2."
      },
      "cards": [
        {
          "tag": {
            "pl": "1. Interpretacja molekularna",
            "en": "1. Molecular interpretation"
          },
          "title": {
            "pl": "Dlaczego ten wariant jest patogenny?",
            "en": "Why is this variant pathogenic?"
          },
          "points": {
            "pl": [
              "Delecja 2 pz powoduje przesunięcie ramki i przedwczesny STOP — oczekiwany rozpad mRNA (NMD), a więc brak białka z tego allelu (PVS1).",
              "Haploinsuficjencja NF1 to dobrze udokumentowany mechanizm NF1; wariant był wielokrotnie raportowany u chorych (ClinVar, HGMD).",
              "Białko skrócone przed domeną GRD (RasGAP) i tak nie mogłoby hamować RAS."
            ],
            "en": [
              "The 2-bp deletion causes a frameshift and premature stop — NMD expected, so no protein from this allele (PVS1).",
              "NF1 haploinsufficiency is a well-established mechanism; the variant has been repeatedly reported in patients (ClinVar, HGMD).",
              "A protein truncated before the GRD (RasGAP) domain could not inhibit RAS anyway."
            ]
          }
        },
        {
          "tag": {
            "pl": "2. Kryteria i różnicowanie",
            "en": "2. Criteria & differential"
          },
          "title": {
            "pl": "Czy to już rozpoznanie NF1?",
            "en": "Is this already an NF1 diagnosis?"
          },
          "points": {
            "pl": [
              "Wariant NF1 z VAF ~50% w prawidłowej tkance = 1 kryterium (Legius i wsp. 2021). Drugie kryterium potwierdza się w badaniu (np. ≥6 CALM, piegi, guzki Lischa, nerwiakowłókniaki, glejak nerwu wzrokowego, zmiany kostne).",
              "Panel zlecono w kierunku RASopatii — warto ocenić cechy zespołu NF1–Noonan (NFNS), który też wynika z wariantów NF1.",
              "Brak wariantu w SPRED1 (zespół Legiusa) i innych genach panelu zawęża różnicowanie."
            ],
            "en": [
              "NF1 variant at VAF ~50% in normal tissue = 1 criterion (Legius et al. 2021). The second criterion is confirmed clinically (e.g. ≥6 CALMs, freckling, Lisch nodules, neurofibromas, optic glioma, bone lesions).",
              "The panel targeted RASopathies — assess features of neurofibromatosis–Noonan syndrome (NFNS), also caused by NF1 variants.",
              "No variant in SPRED1 (Legius syndrome) or other panel genes narrows the differential."
            ]
          }
        },
        {
          "tag": {
            "pl": "3. Rodzina",
            "en": "3. Family"
          },
          "title": {
            "pl": "Co da badanie rodziców?",
            "en": "What will parental testing show?"
          },
          "points": {
            "pl": [
              "Wariant u rodzica: rodzeństwo Badanej ma 50% ryzyka; rodzic wymaga oceny klinicznej (zmienna ekspresja — objawy mogą być łagodne).",
              "Brak wariantu u obojga: wariant de novo (dodatkowe kryterium PS2); ryzyko dla rodzeństwa niskie (<1%) z powodu możliwej mozaiki germinalnej.",
              "Ryzyko dla dzieci Badanej: zawsze 50% — możliwa diagnostyka prenatalna lub PGT-M."
            ],
            "en": [
              "Variant in a parent: siblings have a 50% risk; the parent needs clinical assessment (variable expressivity — symptoms may be mild).",
              "Absent in both: de novo (adds PS2); sibling risk low (<1%) due to possible germline mosaicism.",
              "Risk to the proband's children: always 50% — prenatal diagnosis or PGT-M possible."
            ]
          }
        },
        {
          "tag": {
            "pl": "4. Opieka",
            "en": "4. Care"
          },
          "title": {
            "pl": "Plan nadzoru",
            "en": "Surveillance plan"
          },
          "points": {
            "pl": [
              "Co roku: badanie skóry, ciśnienie tętnicze, wzrost/obwód głowy, kręgosłup, rozwój i nauka.",
              "Dzieci: coroczne badanie okulistyczne (glejak drogi wzrokowej najczęściej <8 r.ż.).",
              "Kobiety z NF1: nadzór piersi od 30 r.ż. (MRI do ok. 50 r.ż.) wg ERN GENTURIS/NCCN; czujność na szybko rosnący, bolesny guz (MPNST)."
            ],
            "en": [
              "Annually: skin exam, blood pressure, growth/head circumference, spine, development and learning.",
              "Children: annual eye exam (optic pathway glioma mostly <8 years).",
              "Women with NF1: breast surveillance from age 30 (MRI to ~50) per ERN GENTURIS/NCCN; watch for a fast-growing painful mass (MPNST)."
            ]
          }
        }
      ]
    },
    "simulator": {
      "btnA": {
        "pl": "Scenariusz A: Wariant odziedziczony od rodzica (50% u rodzeństwa)",
        "en": "Scenario A: Variant inherited from a parent (50% sibling risk)"
      },
      "btnB": {
        "pl": "Scenariusz B: Wariant de novo (<1% u rodzeństwa)",
        "en": "Scenario B: De novo variant (<1% sibling risk)"
      },
      "boxA": {
        "pl": "<strong style='color:var(--status-danger);display:block;margin-bottom:6px;'>✓ Scenariusz A: wariant wykryty u jednego z rodziców</strong><ul style='padding-left:18px;line-height:1.6;'><li><strong>Rodzic nosiciel:</strong> ma NF1 (penetrancja ~100%, zmienna ekspresja) — wymaga oceny klinicznej i planu nadzoru.</li><li><strong>Rodzeństwo Badanej:</strong> 50% ryzyka — badanie celowane lub ocena kliniczna.</li><li><strong>Rodzina rodzica nosiciela:</strong> rozszerzenie badań kaskadowych na jego krewnych I stopnia.</li></ul>",
        "en": "<strong style='color:var(--status-danger);display:block;margin-bottom:6px;'>✓ Scenario A: variant found in one parent</strong><ul style='padding-left:18px;line-height:1.6;'><li><strong>Carrier parent:</strong> has NF1 (penetrance ~100%, variable expressivity) — needs clinical assessment and surveillance.</li><li><strong>Proband's siblings:</strong> 50% risk — targeted test or clinical assessment.</li><li><strong>Carrier parent's family:</strong> extend cascade testing to their first-degree relatives.</li></ul>"
      },
      "boxB": {
        "pl": "<strong style='color:var(--brand-primary);display:block;margin-bottom:6px;'>✓ Scenariusz B: wariant nieobecny u obojga rodziców (de novo)</strong><ul style='padding-left:18px;line-height:1.6;'><li><strong>Klasyfikacja:</strong> potwierdzone de novo (przy zgodnym fenotypie) dodaje kryterium PS2.</li><li><strong>Rodzeństwo:</strong> ryzyko niskie (<1%) — możliwa mozaika germinalna u rodzica.</li><li><strong>Potomstwo Badanej:</strong> nadal 50% — poradnictwo przedkoncepcyjne, opcja PGT-M lub diagnostyki prenatalnej.</li></ul>",
        "en": "<strong style='color:var(--brand-primary);display:block;margin-bottom:6px;'>✓ Scenario B: variant absent in both parents (de novo)</strong><ul style='padding-left:18px;line-height:1.6;'><li><strong>Classification:</strong> confirmed de novo (with consistent phenotype) adds PS2.</li><li><strong>Siblings:</strong> low risk (<1%) — possible parental germline mosaicism.</li><li><strong>Proband's offspring:</strong> still 50% — preconception counselling, PGT-M or prenatal diagnosis.</li></ul>"
      }
    },
    "pedigreeMembers": [
      {
        "id": "I-1",
        "gen": "II",
        "label": "I-1",
        "name": {
          "pl": "Ojciec Badanej",
          "en": "Proband's father"
        },
        "sex": "M",
        "age": {
          "pl": "wiek nieznany",
          "en": "age unknown"
        },
        "subLabel": {
          "pl": "status nieznany",
          "en": "status unknown"
        },
        "deceased": false,
        "phenotype": "unknown",
        "condition": {
          "pl": "Fenotyp nieznany — wymaga oceny klinicznej (zmienna ekspresja NF1)",
          "en": "Phenotype unknown — needs clinical assessment (variable NF1 expressivity)"
        },
        "x": 420,
        "y": 215,
        "priority": "step1",
        "testMethod": {
          "pl": "Celowane badanie wariantu NF1 c.3525_3526del z krwi (Sanger/NGS) + badanie skóry i oczu",
          "en": "Targeted NF1 c.3525_3526del test from blood (Sanger/NGS) + skin and eye exam"
        },
        "clinicalRationale": {
          "pl": "Ustalenie, czy wariant jest dziedziczony; nosiciel może mieć łagodne, nierozpoznane objawy NF1.",
          "en": "Determines whether the variant is inherited; a carrier may have mild, unrecognised NF1."
        },
        "riskByScenario": {
          "pending": {
            "risk": "Krok 1",
            "actionPl": "Badanie celowane z krwi",
            "actionEn": "Targeted blood test",
            "badge": {
              "pl": "KROK 1: Krew",
              "en": "STEP 1: Blood"
            }
          },
          "germline_paternal": {
            "risk": "50% (1 z 2 rodziców)",
            "actionPl": "Jeśli nosiciel: ocena kliniczna NF1 i badania jego krewnych",
            "actionEn": "If carrier: NF1 clinical assessment and testing of his relatives",
            "badge": {
              "pl": "1 z 2 (+)",
              "en": "1 of 2 (+)"
            }
          },
          "germline_maternal": {
            "risk": "50%",
            "actionPl": "Badanie celowane",
            "actionEn": "Targeted test"
          },
          "somatic": {
            "risk": "(−) de novo",
            "actionPl": "Wynik ujemny — rozważyć niską mozaikę germinalną",
            "actionEn": "Negative — consider low-level germline mosaicism",
            "badge": {
              "pl": "(−) de novo",
              "en": "(−) de novo"
            }
          }
        }
      },
      {
        "id": "I-2",
        "gen": "II",
        "label": "I-2",
        "name": {
          "pl": "Matka Badanej",
          "en": "Proband's mother"
        },
        "sex": "F",
        "age": {
          "pl": "wiek nieznany",
          "en": "age unknown"
        },
        "subLabel": {
          "pl": "status nieznany",
          "en": "status unknown"
        },
        "deceased": false,
        "phenotype": "unknown",
        "condition": {
          "pl": "Fenotyp nieznany — wymaga oceny klinicznej",
          "en": "Phenotype unknown — needs clinical assessment"
        },
        "x": 680,
        "y": 215,
        "priority": "step1",
        "testMethod": {
          "pl": "Celowane badanie wariantu NF1 c.3525_3526del z krwi + badanie skóry i oczu",
          "en": "Targeted NF1 c.3525_3526del test from blood + skin and eye exam"
        },
        "clinicalRationale": {
          "pl": "Jak u ojca — określenie pochodzenia wariantu i ryzyka dla rodzeństwa Badanej.",
          "en": "As for the father — establishes variant origin and sibling risk."
        },
        "riskByScenario": {
          "pending": {
            "risk": "Krok 1",
            "actionPl": "Badanie celowane z krwi",
            "actionEn": "Targeted blood test",
            "badge": {
              "pl": "KROK 1: Krew",
              "en": "STEP 1: Blood"
            }
          },
          "germline_paternal": {
            "risk": "50% (1 z 2 rodziców)",
            "actionPl": "Jeśli nosicielka: ocena kliniczna NF1 i badania jej krewnych",
            "actionEn": "If carrier: NF1 clinical assessment and testing of her relatives",
            "badge": {
              "pl": "1 z 2 (+)",
              "en": "1 of 2 (+)"
            }
          },
          "germline_maternal": {
            "risk": "50%",
            "actionPl": "Badanie celowane",
            "actionEn": "Targeted test"
          },
          "somatic": {
            "risk": "(−) de novo",
            "actionPl": "Wynik ujemny — rozważyć niską mozaikę germinalną",
            "actionEn": "Negative — consider low-level germline mosaicism",
            "badge": {
              "pl": "(−) de novo",
              "en": "(−) de novo"
            }
          }
        }
      },
      {
        "id": "II-1",
        "gen": "III",
        "label": "II-1",
        "name": {
          "pl": "Badana (probantka)",
          "en": "Proband"
        },
        "sex": "F",
        "age": {
          "pl": "wiek nieznany",
          "en": "age unknown"
        },
        "subLabel": {
          "pl": "NF1 c.3525_3526del (+)",
          "en": "NF1 c.3525_3526del (+)"
        },
        "deceased": false,
        "phenotype": "affected",
        "proband": true,
        "condition": {
          "pl": "Objawy kliniczne (niewyszczególnione w raporcie) — skierowanie na panel RASopatii; heterozygotyczny patogenny wariant NF1",
          "en": "Clinical features (not specified in report) — referred for RASopathy panel; heterozygous pathogenic NF1 variant"
        },
        "x": 550,
        "y": 410,
        "priority": "step1",
        "testMethod": {
          "pl": "Konsultacja genetyczna: ocena kryteriów NF1 (2021), różnicowanie (NFNS), plan nadzoru wielospecjalistycznego",
          "en": "Genetic consultation: NF1 criteria (2021), differential (NFNS), multidisciplinary surveillance plan"
        },
        "clinicalRationale": {
          "pl": "Wariant = 1 kryterium; potwierdzenie rozpoznania i wdrożenie opieki zgodnej z wytycznymi.",
          "en": "Variant = 1 criterion; confirm the diagnosis and start guideline-based care."
        },
        "riskByScenario": {
          "pending": {
            "risk": "Heterozygota (VAF 53%)",
            "actionPl": "Konsultacja genetyczna i ocena kliniczna",
            "actionEn": "Genetic consultation and clinical assessment",
            "badge": {
              "pl": "NF1 (+)",
              "en": "NF1 (+)"
            }
          },
          "germline_paternal": {
            "risk": "Dziedziczony (AD)",
            "actionPl": "Opieka NF1; 50% ryzyka dla potomstwa",
            "actionEn": "NF1 care; 50% offspring risk",
            "badge": {
              "pl": "Dziedziczony",
              "en": "Inherited"
            }
          },
          "germline_maternal": {
            "risk": "Dziedziczony (AD)",
            "actionPl": "Opieka NF1; 50% ryzyka dla potomstwa",
            "actionEn": "NF1 care; 50% offspring risk"
          },
          "somatic": {
            "risk": "De novo",
            "actionPl": "Opieka NF1; 50% ryzyka dla potomstwa",
            "actionEn": "NF1 care; 50% offspring risk",
            "badge": {
              "pl": "De novo",
              "en": "De novo"
            }
          }
        }
      }
    ],
    "patientCard": {
      "title": {
        "pl": "Pisemna karta informacyjna dla pacjenta",
        "en": "Written patient information sheet"
      },
      "subtitle": {
        "pl": "Nerwiakowłókniakowatość typu 1 (NF1) • na podstawie wyniku badania panelowego NGS (ZGM IMiD)",
        "en": "Neurofibromatosis type 1 (NF1) • based on the NGS panel result (ZGM IMiD)"
      },
      "sections": [
        {
          "key": "dx",
          "title": {
            "pl": "Rozpoznanie",
            "en": "Diagnosis"
          },
          "items": [
            {
              "label": {
                "pl": "Nazwa choroby",
                "en": "Disease"
              },
              "text": {
                "pl": "Nerwiakowłókniakowatość typu 1 (NF1, choroba von Recklinghausena) — rozpoznanie molekularne; ostateczne potwierdzenie kliniczne wg kryteriów 2021 podczas konsultacji genetycznej.",
                "en": "Neurofibromatosis type 1 (NF1, von Recklinghausen disease) — molecular diagnosis; final clinical confirmation per the 2021 criteria at genetic consultation."
              }
            },
            {
              "label": {
                "pl": "Genotyp",
                "en": "Genotype"
              },
              "text": {
                "pl": "NF1: NM_001042492.3:c.[3525_3526del];[=], NP_001035957.1:p.[(Arg1176SerfsTer18)];[=] — heterozygota (jedna kopia genu zmieniona, druga prawidłowa).",
                "en": "NF1: NM_001042492.3:c.[3525_3526del];[=], NP_001035957.1:p.[(Arg1176SerfsTer18)];[=] — heterozygous (one altered copy, one normal)."
              }
            },
            {
              "label": {
                "pl": "Kody",
                "en": "Codes"
              },
              "text": {
                "pl": "ORPHA:636 • OMIM #162200 (gen NF1: *613113) • ICD-10: Q85.0 • ICD-11: LD2D.10",
                "en": "ORPHA:636 • OMIM #162200 (NF1 gene: *613113) • ICD-10: Q85.0 • ICD-11: LD2D.10"
              }
            }
          ]
        },
        {
          "key": "about",
          "title": {
            "pl": "Omówienie",
            "en": "About the condition"
          },
          "items": [
            {
              "label": {
                "pl": "Częstość",
                "en": "Frequency"
              },
              "text": {
                "pl": "Jedna z najczęstszych chorób genetycznych: ok. 1 na 3000 urodzeń, w każdej populacji, u obu płci jednakowo.",
                "en": "One of the most common genetic disorders: about 1 in 3,000 births, in all populations, equally in both sexes."
              }
            },
            {
              "label": {
                "pl": "Patomechanizm",
                "en": "Mechanism"
              },
              "text": {
                "pl": "Gen NF1 koduje neurofibrominę — białko hamujące szlak wzrostu komórek RAS–MAPK (supresor nowotworów). U Pani wykryto delecję 2 nukleotydów, która przesuwa ramkę odczytu i wprowadza przedwczesny sygnał STOP. Taka „skrócona” instrukcja jest zwykle niszczona w komórce, więc z tej kopii genu nie powstaje białko (utrata funkcji, haploinsuficjencja). Mniej neurofibrominy = słabszy „hamulec” wzrostu komórek skóry, nerwów, kości i mózgu; guzy powstają, gdy w danej komórce dojdzie do uszkodzenia także drugiej kopii genu.",
                "en": "The NF1 gene encodes neurofibromin, which restrains the RAS–MAPK cell-growth pathway (a tumour suppressor). You have a 2-nucleotide deletion that shifts the reading frame and introduces an early STOP signal. Such a message is usually destroyed, so no protein is made from that copy (loss of function, haploinsufficiency). Less neurofibromin means a weaker 'brake' on skin, nerve, bone and brain cells; tumours arise when the second copy is also damaged in a given cell."
              }
            },
            {
              "label": {
                "pl": "Objawy, penetracja i ekspresja",
                "en": "Features, penetrance & expressivity"
              },
              "text": {
                "pl": "Penetracja jest praktycznie pełna (objawy ma prawie każdy nosiciel do wieku szkolnego), ale ekspresja jest bardzo zmienna — nawet w jednej rodzinie przebieg może być łagodny lub ciężki; nie da się go przewidzieć na podstawie samego wariantu.",
                "en": "Penetrance is virtually complete (almost every carrier has features by school age), but expressivity varies widely — even within a family the course may be mild or severe; it cannot be predicted from the variant alone."
              }
            },
            {
              "label": {
                "pl": "Zależność od wieku",
                "en": "Age-related features"
              },
              "text": {
                "pl": "Niemowlęctwo/wczesne dzieciństwo: plamy café-au-lait (zwykle ≥6 do 2 r.ż.), nerwiakowłókniaki splotowate (wrodzone), dysplazje kości (np. rzekomy staw goleni). 3–7 r.ż.: piegi pachowe i pachwinowe, glejak drogi wzrokowej (szczyt <6–8 r.ż.), trudności w nauce/ADHD (u ok. połowy dzieci). Szkoła/dojrzewanie: guzki Lischa tęczówki, skolioza, niski wzrost, makrocefalia. Od okresu dojrzewania i z wiekiem: przybywa nerwiakowłókniaków skórnych (również w ciąży); u dorosłych częstsze nadciśnienie, ryzyko złośliwego guza osłonek nerwów (MPNST, ok. 8–13% w ciągu życia) i — u kobiet — raka piersi przed 50 r.ż.",
                "en": "Infancy/early childhood: café-au-lait macules (usually ≥6 by age 2), plexiform neurofibromas (congenital), bone dysplasia (e.g. tibial pseudarthrosis). Ages 3–7: axillary/inguinal freckling, optic pathway glioma (peak <6–8 years), learning difficulties/ADHD (about half of children). School age/puberty: Lisch nodules, scoliosis, short stature, macrocephaly. From puberty and with age: more cutaneous neurofibromas (also in pregnancy); adults have more hypertension, risk of malignant peripheral nerve sheath tumour (MPNST, ~8–13% lifetime) and, in women, breast cancer before 50."
              }
            }
          ]
        },
        {
          "key": "prog",
          "title": {
            "pl": "Rokowanie",
            "en": "Prognosis"
          },
          "items": [
            {
              "label": {
                "pl": "Wyleczenie",
                "en": "Cure"
              },
              "text": {
                "pl": "Choroby nie można wyleczyć przyczynowo — wariant jest obecny we wszystkich komórkach. Leczy się objawy i powikłania; część guzów (nerwiakowłókniaki splotowate) zmniejsza się pod wpływem leków celowanych.",
                "en": "There is no causal cure — the variant is present in all cells. Symptoms and complications are treated; some tumours (plexiform neurofibromas) shrink with targeted drugs."
              }
            },
            {
              "label": {
                "pl": "Jakość życia i samodzielność",
                "en": "Quality of life & independence"
              },
              "text": {
                "pl": "Większość osób z NF1 prowadzi samodzielne życie: uczy się, pracuje, zakłada rodziny. Jakość życia zależy od nasilenia zmian skórnych, trudności w nauce i powikłań; średnia długość życia jest nieco krótsza niż w populacji, głównie z powodu nowotworów i chorób naczyń — regularny nadzór pozwala wykrywać je wcześnie.",
                "en": "Most people with NF1 live independently: they study, work and have families. Quality of life depends on skin involvement, learning difficulties and complications; average life expectancy is somewhat shorter, mainly due to tumours and vascular disease — regular surveillance allows early detection."
              }
            },
            {
              "label": {
                "pl": "Wsparcie systemu",
                "en": "Support needs"
              },
              "text": {
                "pl": "Potrzebna jest stała, koordynowana opieka wielospecjalistyczna (genetyk, pediatra/internista, dermatolog, okulista, neurolog, ortopeda, onkolog). Dzieci z trudnościami w nauce mogą wymagać wsparcia psychologiczno-pedagogicznego (opinia/orzeczenie poradni, dostosowanie nauczania).",
                "en": "Ongoing coordinated multidisciplinary care is needed (geneticist, paediatrician/internist, dermatologist, ophthalmologist, neurologist, orthopaedist, oncologist). Children with learning difficulties may need educational/psychological support (school adjustments)."
              }
            }
          ]
        },
        {
          "key": "risk",
          "title": {
            "pl": "Ryzyko powtórzenia",
            "en": "Recurrence risk"
          },
          "items": [
            {
              "label": {
                "pl": "Sposób dziedziczenia",
                "en": "Inheritance"
              },
              "text": {
                "pl": "Autosomalny dominujący — wystarczy jedna zmieniona kopia genu. U ok. 50% chorych wariant powstaje de novo (pierwszy raz w rodzinie).",
                "en": "Autosomal dominant — one altered copy is enough. In about 50% of patients the variant arises de novo (first time in the family)."
              }
            },
            {
              "label": {
                "pl": "Potomstwo",
                "en": "Children"
              },
              "text": {
                "pl": "Każde dziecko Badanej ma 50% ryzyka odziedziczenia wariantu (niezależnie od płci). Nasilenia objawów u dziecka nie da się przewidzieć.",
                "en": "Each of the proband's children has a 50% risk of inheriting the variant (regardless of sex). Severity in a child cannot be predicted."
              }
            },
            {
              "label": {
                "pl": "Rodzice i rodzeństwo",
                "en": "Parents & siblings"
              },
              "text": {
                "pl": "Wskazane celowane badanie obojga biologicznych rodziców. Jeśli wariant ma rodzic — rodzeństwo Badanej ma 50% ryzyka, a rodzic wymaga oceny klinicznej (objawy mogą być bardzo łagodne). Jeśli rodzice nie mają wariantu (de novo) — ryzyko dla rodzeństwa jest niskie (<1%), ale nie zerowe (możliwa mozaika w komórkach rozrodczych).",
                "en": "Targeted testing of both biological parents is recommended. If a parent carries the variant, siblings have a 50% risk and the parent needs clinical assessment (features may be very mild). If neither does (de novo), sibling risk is low (<1%) but not zero (possible germline mosaicism)."
              }
            },
            {
              "label": {
                "pl": "Inni krewni i diagnostyka prenatalna",
                "en": "Other relatives & prenatal testing"
              },
              "text": {
                "pl": "Badania kaskadowe u krewnych linii rodzica nosiciela. Przy planowaniu ciąży: poradnictwo przedkoncepcyjne; możliwa diagnostyka prenatalna (biopsja kosmówki/amniopunkcja z badaniem znanego wariantu) lub diagnostyka preimplantacyjna PGT-M w ramach in vitro. Badanie dzieci w kierunku NF1 jest uzasadnione (objawy ujawniają się w dzieciństwie i wymagają nadzoru).",
                "en": "Cascade testing in the carrier parent's relatives. When planning pregnancy: preconception counselling; prenatal diagnosis (CVS/amniocentesis for the known variant) or preimplantation PGT-M with IVF. Testing children for NF1 is appropriate (features appear in childhood and need surveillance)."
              }
            }
          ]
        },
        {
          "key": "rec",
          "title": {
            "pl": "Zalecenia",
            "en": "Recommendations"
          },
          "items": [
            {
              "label": {
                "pl": "Profilaktyka i nadzór",
                "en": "Prevention & surveillance"
              },
              "text": {
                "pl": "Co roku: badanie lekarskie ze skórą, pomiar ciśnienia tętniczego, ocena wzrostu i kręgosłupa, rozwoju i nauki. Dzieci: coroczne badanie okulistyczne (do ok. 8 r.ż., potem rzadziej). Rezonans magnetyczny — przy objawach lub wg decyzji lekarza (nie rutynowo u bezobjawowych). Kobiety: nadzór piersi od 30 r.ż. (MRI do ok. 50 r.ż., potem mammografia) wg ERN GENTURIS. Pilny kontakt z lekarzem przy szybko rosnącym, bolesnym lub twardym guzie, nowym niedowładzie, bólach głowy, pogorszeniu widzenia.",
                "en": "Annually: medical exam incl. skin, blood pressure, growth and spine, development and learning. Children: annual eye exam (until ~8, then less often). MRI only for symptoms or per physician (not routine when asymptomatic). Women: breast surveillance from 30 (MRI to ~50, then mammography) per ERN GENTURIS. Seek urgent care for a fast-growing, painful or hard lump, new weakness, headaches or worsening vision."
              }
            },
            {
              "label": {
                "pl": "Terapia celowana",
                "en": "Targeted therapy"
              },
              "text": {
                "pl": "Objawowe, nieoperacyjne nerwiakowłókniaki splotowate leczy się inhibitorami MEK: selumetynib — refundowany dla dzieci w programie lekowym NFZ B.155 (od 2024 r.); mirdametynib — zarejestrowany w UE (2025) dla dzieci od 2 r.ż. i dorosłych. Kwalifikacja w ośrodku onkologii dziecięcej/specjalistycznym.",
                "en": "Symptomatic inoperable plexiform neurofibromas are treated with MEK inhibitors: selumetinib — reimbursed for children in the Polish NFZ drug programme B.155 (since 2024); mirdametinib — EU-approved (2025) for patients aged 2+ including adults. Eligibility assessed at a specialist (paediatric oncology) centre."
              }
            },
            {
              "label": {
                "pl": "Dalsze postępowanie i rehabilitacja",
                "en": "Follow-up & rehabilitation"
              },
              "text": {
                "pl": "Koordynowana opieka w ośrodku doświadczonym w NF1; zmiany skórne — leczenie dermatologiczne/chirurgiczne; skolioza i zmiany kostne — ortopeda i fizjoterapia; trudności w nauce — diagnoza psychologiczna i terapia (np. logopedyczna, pedagogiczna). Przekazywać wynik badania każdemu lekarzowi prowadzącemu.",
                "en": "Coordinated care at a centre experienced in NF1; skin lesions — dermatological/surgical treatment; scoliosis and bone lesions — orthopaedics and physiotherapy; learning difficulties — psychological assessment and therapy. Share this result with every treating physician."
              }
            }
          ]
        },
        {
          "key": "support",
          "title": {
            "pl": "Wsparcie",
            "en": "Support"
          },
          "items": [
            {
              "label": {
                "pl": "Organizacje pacjentów",
                "en": "Patient organisations"
              },
              "text": {
                "pl": "Stowarzyszenie Neurofibromatozy Polska; Children's Tumor Foundation Europe (CTF Europe) — informacje dla rodzin i badania kliniczne. Lista organizacji pacjentów: nfz.gov.pl (Dla pacjenta → organizacje pacjentów).",
                "en": "Stowarzyszenie Neurofibromatozy Polska; Children's Tumor Foundation Europe (CTF Europe) — family information and clinical trials. Patient organisation list: nfz.gov.pl."
              }
            },
            {
              "label": {
                "pl": "Placówki medyczne i OECR",
                "en": "Centres & rare-disease expert centres"
              },
              "text": {
                "pl": "Ośrodki koordynowanej opieki nad chorymi z neurofibromatozami i RASopatiami (pilotaż NFZ): Instytut Matki i Dziecka w Warszawie, UCK WUM w Warszawie, UCK w Gdańsku, Szpital Uniwersytecki nr 1 w Bydgoszczy. Aktualna lista Ośrodków Eksperckich Chorób Rzadkich (OECR): gov.pl — Plan dla Chorób Rzadkich. Informacje o chorobie: orpha.net (ORPHA:636).",
                "en": "Coordinated-care centres for neurofibromatoses and RASopathies (NFZ pilot): Institute of Mother and Child, Warsaw; UCK WUM, Warsaw; UCK Gdańsk; University Hospital No. 1, Bydgoszcz. Current list of rare-disease expert centres (OECR): gov.pl — Rare Diseases Plan. Disease information: orpha.net (ORPHA:636)."
              }
            },
            {
              "label": {
                "pl": "Edukacja",
                "en": "Education"
              },
              "text": {
                "pl": "Poradnia psychologiczno-pedagogiczna (opinia o specyficznych trudnościach w nauce, ewentualnie orzeczenie o potrzebie kształcenia specjalnego) — dostosowanie warunków nauki.",
                "en": "School psychological-educational counselling service (assessment of specific learning difficulties, special educational needs statement) — adapted learning conditions."
              }
            }
          ]
        }
      ],
      "footer": {
        "pl": "Karta ma charakter informacyjny i nie zastępuje konsultacji lekarskiej. Wymaga weryfikacji przez lekarza genetyka przed przekazaniem pacjentce (m.in. aktualność programów NFZ i danych kontaktowych).",
        "en": "This sheet is informational and does not replace medical consultation. It must be verified by a clinical geneticist before handing to the patient (incl. current NFZ programmes and contacts)."
      }
    }
  }
};
