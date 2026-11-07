/**
 * Corrected Textbook-Accurate Clinical Genetics Pedigree SVG Renderer (PTGC / Bennett / NSGC)
 * Spacious 1160x660 layout with zero label overlap, multi-line captions, and Exam B&W / Clinical Color toggle.
 */
export function renderPedigreeSVG(
  container,
  caseData,
  lang = "pl",
  selectedId = "III-3",
  scenario = "pending",
  onSelectMember = null,
  examBwMode = false
) {
  const members = caseData.pedigreeMembers || [];
  const byId = Object.fromEntries(members.map(m => [m.id, m]));

  const phenotypeStyles = examBwMode
    ? {
        ovarian_cancer: { fill: "#0b111e", stroke: "#0b111e" },
        affected: { fill: "#0b111e", stroke: "#0b111e" },
        endometrial_cancer: { fill: "url(#hatch-diagonal)", stroke: "#0b111e" },
        other_cancer: { fill: "url(#hatch-cross)", stroke: "#0b111e" },
        neuro: { fill: "url(#hatch-dots)", stroke: "#0b111e" },
        miscarriages: { fill: "#ffffff", stroke: "#0b111e" },
        unaffected: { fill: "#ffffff", stroke: "#0b111e" },
        unknown: { fill: "#ffffff", stroke: "#3D4463" }
      }
    : {
        ovarian_cancer: { fill: "#0b111e", stroke: "#0b111e" },
        affected: { fill: "#0b111e", stroke: "#0b111e" },
        endometrial_cancer: { fill: "#dc2626", stroke: "#991b1b" },
        other_cancer: { fill: "#6366f1", stroke: "#5B4BF0" },
        neuro: { fill: "#5B4BF0", stroke: "#0369a1" },
        miscarriages: { fill: "#ffffff", stroke: "#0b111e" },
        unaffected: { fill: "#ffffff", stroke: "#0b111e" },
        unknown: { fill: "#FAFAFE", stroke: "#5B6280" }
      };

  function getScenarioBadge(m) {
    const info = m.riskByScenario?.[scenario] || m.riskByScenario?.pending;
    if (!info) return null;

    if (caseData.id === "cftr_ar") {
      if (m.proband) {
        return { text: "CFTR +/+ (100%)", color: "#ffffff", bg: "#dc2626" };
      }
      if (m.id === "I-1" || m.id === "I-2") {
        return scenario === "somatic"
          ? { text: lang === "pl" ? "Weryfikacja fazy" : "Phase Check", color: "#0b111e", bg: "#E6E4F2" }
          : { text: lang === "pl" ? "Nosiciel (100%)" : "Carrier (100%)", color: "#9a3412", bg: "#ffedd5" };
      }
      if (m.id === "I-3") {
        return { text: "50% (Krok 2)", color: "#854d0e", bg: "#fef9c3" };
      }
      if (m.id === "II-1") {
        return { text: "2/3 (~67%)", color: "#2E1A8F", bg: "#dbeafe" };
      }
      return null;
    }

    if (caseData.id !== "zestaw11") {
      // Case-defined badge (riskByScenario[scenario].badge = { pl, en })
      if (info && info.badge) {
        const txt = info.badge[lang] || info.badge.pl;
        const neg = /\(−\)|\(-\)|0%/.test(txt);
        const pos = /\(\+\)|NF1|Dziedz|Inher|De novo/i.test(txt);
        return neg ? { text: txt, color: "#15803d", bg: "#dcfce7" }
             : m.proband || pos ? { text: txt, color: "#ffffff", bg: "#6A3DFF" }
             : { text: txt, color: "#ffffff", bg: "#0b111e" };
      }
      // Custom cases
      if (m.proband) {
        return scenario === "somatic"
          ? { text: lang === "pl" ? "Somatyczna" : "Somatic", color: "#2E3552", bg: "#E6E4F2" }
          : { text: lang === "pl" ? "Probant (+)" : "Proband (+)", color: "#ffffff", bg: "#dc2626" };
      }
      if (scenario === "somatic") {
        return { text: "0%", color: "#15803d", bg: "#dcfce7" };
      }
      return info.risk ? { text: String(info.risk).slice(0, 14), color: "#9a3412", bg: "#ffedd5" } : null;
    }

    if (m.id === "III-3") {
      if (scenario === "somatic") return { text: lang === "pl" ? "Somatyczna" : "Somatic", color: "#2E3552", bg: "#E6E4F2" };
      if (scenario === "pending") return { text: lang === "pl" ? "KROK 1: Krew" : "STEP 1: Blood", color: "#ffffff", bg: "#0b111e" };
      return { text: "Germline (+)", color: "#ffffff", bg: "#dc2626" };
    }
    if (scenario === "somatic") {
      return { text: "0%", color: "#15803d", bg: "#dcfce7" };
    }
    if (m.id === "II-4") {
      if (scenario === "germline_paternal") return { text: lang === "pl" ? "Nosiciel (+)" : "Carrier (+)", color: "#ffffff", bg: "#dc2626" };
      if (scenario === "germline_maternal") return { text: "(−) 0%", color: "#15803d", bg: "#dcfce7" };
      return { text: lang === "pl" ? "KROK 2" : "STEP 2", color: "#0b111e", bg: "#E6E4F2" };
    }
    if (m.id === "II-5") {
      if (scenario === "germline_maternal") return { text: lang === "pl" ? "Nosicielka (+)" : "Carrier (+)", color: "#ffffff", bg: "#dc2626" };
      if (scenario === "germline_paternal") return { text: "(−) 0%", color: "#15803d", bg: "#dcfce7" };
      return { text: lang === "pl" ? "KROK 2" : "STEP 2", color: "#0b111e", bg: "#E6E4F2" };
    }
    if (m.id === "III-1" || m.id === "III-4") {
      return { text: "50%", color: "#9a3412", bg: "#ffedd5" };
    }
    if (m.id === "IV-1" || m.id === "IV-2" || m.id === "IV-3" || m.id === "IV-4") {
      return { text: "25% / 50%*", color: "#854d0e", bg: "#fef9c3" };
    }
    if (m.id === "II-6") {
      if (scenario === "germline_maternal") return { text: "50%", color: "#9a3412", bg: "#ffedd5" };
      if (scenario === "germline_paternal") return { text: "0%", color: "#15803d", bg: "#dcfce7" };
    }
    if (m.id === "II-1") {
      if (scenario === "germline_paternal") return { text: "50%", color: "#9a3412", bg: "#ffedd5" };
      if (scenario === "germline_maternal") return { text: "0%", color: "#15803d", bg: "#dcfce7" };
    }
    return null;
  }

  const R = 22;

  // Fit the drawing to the family for generic cases (small pedigrees no longer float in a huge canvas)
  const isLegacyLayout = caseData.id === "zestaw11" || caseData.id === "cftr_ar";
  let viewBox = "0 0 1160 640";
  let vbLeft = 0;
  if (!isLegacyLayout && members.length) {
    const xs = members.map(m => m.x), ys = members.map(m => m.y);
    vbLeft = Math.min(...xs) - 250;
    const vbTop = Math.min(...ys) - 70;
    const vbW = Math.max(...xs) + 190 - vbLeft;
    const vbH = Math.max(...ys) + 85 - vbTop;
    viewBox = `${vbLeft} ${vbTop} ${vbW} ${vbH}`;
  }

  let linesSvg = "";
  if (caseData.id === "zestaw11") {
    linesSvg = `
      <!-- Generation Roman Numeral Row Markers -->
      <g font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="700" fill="#0b111e">
        <rect x="16" y="47" width="32" height="28" rx="6" fill="#F3F2FA"/>
        <text x="32" y="66" text-anchor="middle">I</text>

        <rect x="16" y="197" width="32" height="28" rx="6" fill="#F3F2FA"/>
        <text x="32" y="216" text-anchor="middle">II</text>

        <rect x="16" y="367" width="32" height="28" rx="6" fill="#F3F2FA"/>
        <text x="32" y="386" text-anchor="middle">III</text>

        <rect x="16" y="537" width="32" height="28" rx="6" fill="#F3F2FA"/>
        <text x="32" y="556" text-anchor="middle">IV</text>
      </g>

      <!-- Horizontal Generation Guide Hairlines -->
      <line x1="60" y1="65" x2="1130" y2="65" stroke="#F3F2FA" stroke-width="1" stroke-dasharray="4,4"/>
      <line x1="60" y1="215" x2="1130" y2="215" stroke="#F3F2FA" stroke-width="1" stroke-dasharray="4,4"/>
      <line x1="60" y1="385" x2="1130" y2="385" stroke="#F3F2FA" stroke-width="1" stroke-dasharray="4,4"/>
      <line x1="60" y1="555" x2="1130" y2="555" stroke="#F3F2FA" stroke-width="1" stroke-dasharray="4,4"/>

      <!-- ================= GENERATION I -> II (PATERNAL BRANCH) ================= -->
      <!-- I-1 (375,65) married to I-2 (495,65), midpoint = (435,65) -->
      <line x1="397" y1="65" x2="473" y2="65" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="435" y1="65" x2="435" y2="148" stroke="#0b111e" stroke-width="2.2"/>

      <!-- Paternal Sibship Bar: II-1 (195), II-2 (345), II-3 (475), II-4 Czesław (605) -->
      <line x1="195" y1="148" x2="605" y2="148" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="195" y1="148" x2="195" y2="193" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="345" y1="148" x2="345" y2="193" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="475" y1="148" x2="475" y2="193" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="605" y1="148" x2="605" y2="193" stroke="#0b111e" stroke-width="2.2"/>

      <!-- II-1 (195,215) + Wife (105,215): Marriage & Infertility Double Horizontal Bar (=) -->
      <circle cx="105" cy="215" r="20" fill="#ffffff" stroke="#5B6280" stroke-width="2"/>
      <text x="105" y="253" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#5B6280">${lang === "pl" ? "Żona stryja" : "Uncle's wife"}</text>
      <line x1="125" y1="215" x2="173" y2="215" stroke="#0b111e" stroke-width="2"/>
      <!-- Vertical descent from marriage midpoint (150,215) to double bar -->
      <line x1="150" y1="215" x2="150" y2="282" stroke="#0b111e" stroke-width="2"/>
      <line x1="134" y1="282" x2="166" y2="282" stroke="#0b111e" stroke-width="2.4"/>
      <line x1="134" y1="288" x2="166" y2="288" stroke="#0b111e" stroke-width="2.4"/>
      <text x="150" y="304" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#3D4463">${lang === "pl" ? "niepłodność" : "infertility"}</text>

      <!-- II-2 (345,215): Childless / Never started a family (single horizontal bar below vertical stub) -->
      <line x1="345" y1="280" x2="345" y2="296" stroke="#0b111e" stroke-width="1.8"/>
      <line x1="331" y1="296" x2="359" y2="296" stroke="#0b111e" stroke-width="2.2"/>
      <text x="345" y="310" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" fill="#5B6280">${lang === "pl" ? "bezdzietna" : "no children"}</text>

      <!-- ================= GENERATION I -> II (MATERNAL BRANCH) ================= -->
      <!-- I-3 (825,65) married to I-4 (945,65), midpoint = (885,65) -->
      <line x1="847" y1="65" x2="923" y2="65" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="885" y1="65" x2="885" y2="148" stroke="#0b111e" stroke-width="2.2"/>

      <!-- Maternal Sibship Bar: II-5 Genowefa (755), II-6 Wiesława (985) -->
      <line x1="755" y1="148" x2="985" y2="148" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="755" y1="148" x2="755" y2="193" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="985" y1="148" x2="985" y2="193" stroke="#0b111e" stroke-width="2.2"/>

      <!-- II-6 Wiesława (985,215) + Partner (1085,215) & 3 Spontaneous Miscarriage Triangles (▲) -->
      <rect x="1065" y="195" width="40" height="40" rx="2" fill="#ffffff" stroke="#5B6280" stroke-width="2"/>
      <text x="1085" y="253" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#5B6280">${lang === "pl" ? "Partner" : "Partner"}</text>
      <line x1="1007" y1="215" x2="1065" y2="215" stroke="#0b111e" stroke-width="2"/>
      <!-- Descent from midpoint (1036, 215) to miscarriage sibship bar at y=282 -->
      <line x1="1036" y1="215" x2="1036" y2="282" stroke="#0b111e" stroke-width="2"/>
      <line x1="996" y1="282" x2="1076" y2="282" stroke="#0b111e" stroke-width="2"/>
      <!-- 3 small triangles for spontaneous abortions (SAB) -->
      <g transform="translate(996, 282)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#0b111e" stroke-width="1.8"/>
        <polygon points="0,10 -10,26 10,26" fill="${examBwMode ? "#ffffff" : "#fef3c7"}" stroke="#0b111e" stroke-width="2"/>
      </g>
      <g transform="translate(1036, 282)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#0b111e" stroke-width="1.8"/>
        <polygon points="0,10 -10,26 10,26" fill="${examBwMode ? "#ffffff" : "#fef3c7"}" stroke="#0b111e" stroke-width="2"/>
      </g>
      <g transform="translate(1076, 282)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#0b111e" stroke-width="1.8"/>
        <polygon points="0,10 -10,26 10,26" fill="${examBwMode ? "#ffffff" : "#fef3c7"}" stroke="#0b111e" stroke-width="2"/>
      </g>
      <text x="1036" y="324" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#0b111e">${lang === "pl" ? "3× poronienie samoistne" : "3× spontaneous miscarriage"}</text>

      <!-- ================= GENERATION II -> III (PARENTS TO KATARZYNA & SIBLINGS) ================= -->
      <!-- Marriage between II-4 Czesław (605,215) & II-5 Genowefa (755,215), midpoint = (680,215) -->
      <line x1="627" y1="215" x2="733" y2="215" stroke="#0b111e" stroke-width="2.6"/>
      <line x1="680" y1="215" x2="680" y2="322" stroke="#0b111e" stroke-width="2.6"/>

      <!-- Generation III Sibship Bar: III-1 Older Brother (410), III-3 Katarzyna (680), III-4 Younger Sister (910) -->
      <line x1="410" y1="322" x2="910" y2="322" stroke="#0b111e" stroke-width="2.4"/>
      <line x1="410" y1="322" x2="410" y2="363" stroke="#0b111e" stroke-width="2.4"/>
      <line x1="680" y1="322" x2="680" y2="363" stroke="#0b111e" stroke-width="2.4"/>
      <line x1="910" y1="322" x2="910" y2="363" stroke="#0b111e" stroke-width="2.4"/>

      <!-- ================= GENERATION III -> IV (OLDER BROTHER & DIZYGOTIC TWINS) ================= -->
      <!-- Partner of III-1 at (290,385), married to III-1 (410,385), midpoint = (350,385) -->
      <circle cx="290" cy="385" r="20" fill="#ffffff" stroke="#5B6280" stroke-width="2"/>
      <text x="290" y="424" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#5B6280">${lang === "pl" ? "Bratowa (III-2)" : "Sister-in-law (III-2)"}</text>
      <line x1="310" y1="385" x2="388" y2="385" stroke="#0b111e" stroke-width="2.2"/>

      <!-- Dizygotic Twin Chevron (∧ from single point 350,455 to IV-1 at 280,533 and IV-2 at 420,533 WITHOUT horizontal bar) -->
      <line x1="350" y1="385" x2="350" y2="458" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="350" y1="458" x2="280" y2="533" stroke="#0b111e" stroke-width="2.4"/>
      <line x1="350" y1="458" x2="420" y2="533" stroke="#0b111e" stroke-width="2.4"/>
      <circle cx="350" cy="458" r="3.5" fill="#0b111e"/>
      <text x="350" y="505" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#3D4463">${lang === "pl" ? "bliźnięta dwujajowe (DZ)" : "dizygotic twins (DZ)"}</text>

      <!-- ================= GENERATION III -> IV (YOUNGER SISTER & TWO SONS) ================= -->
      <!-- III-4 (910,385) married to Husband III-5 at (1020,385), midpoint = (965,385) -->
      <rect x="1000" y="365" width="40" height="40" rx="2" fill="#ffffff" stroke="#5B6280" stroke-width="2"/>
      <text x="1020" y="424" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#5B6280">${lang === "pl" ? "Szwagier (III-5)" : "Brother-in-law (III-5)"}</text>
      <line x1="932" y1="385" x2="1000" y2="385" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="965" y1="385" x2="965" y2="482" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="900" y1="482" x2="1030" y2="482" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="900" y1="482" x2="900" y2="533" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="1030" y1="482" x2="1030" y2="533" stroke="#0b111e" stroke-width="2.2"/>
    `;
  } else if (caseData.id === "cftr_ar") {
    linesSvg = `
      <g font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="700" fill="#0b111e">
        <rect x="16" y="197" width="32" height="28" rx="6" fill="#F3F2FA"/>
        <text x="32" y="216" text-anchor="middle">I</text>
        <rect x="16" y="392" width="32" height="28" rx="6" fill="#F3F2FA"/>
        <text x="32" y="411" text-anchor="middle">II</text>
      </g>
      <!-- Parents I-1 (420,215) & I-2 (680,215) marriage line -->
      <line x1="442" y1="215" x2="658" y2="215" stroke="#0b111e" stroke-width="2.4"/>
      <line x1="550" y1="215" x2="550" y2="335" stroke="#0b111e" stroke-width="2.4"/>
      <!-- Sibship between I-2 (680,215) and Aunt I-3 (910,215) -->
      <line x1="680" y1="145" x2="910" y2="145" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="680" y1="145" x2="680" y2="193" stroke="#0b111e" stroke-width="2.2"/>
      <line x1="910" y1="145" x2="910" y2="193" stroke="#0b111e" stroke-width="2.2"/>
      <!-- Children sibship: II-1 Zuzia (450,410) & II-2 Antoś (650,410) -->
      <line x1="450" y1="335" x2="650" y2="335" stroke="#0b111e" stroke-width="2.4"/>
      <line x1="450" y1="335" x2="450" y2="388" stroke="#0b111e" stroke-width="2.4"/>
      <line x1="650" y1="335" x2="650" y2="388" stroke="#0b111e" stroke-width="2.4"/>
    `;
  } else {
    // Dynamic connector lines for custom parsed cases (connect parents in Gen II to proband in Gen III)
    const genII = members.filter(m => m.gen === "II");
    const genIII = members.filter(m => m.gen === "III");
    let customConnectors = "";
    if (genII.length >= 2 && genIII.length >= 1) {
      const p1 = genII[0];
      const p2 = genII[1];
      const midX = (p1.x + p2.x) / 2;
      const midY = p1.y;
      const sibY = (midY + genIII[0].y) / 2;
      const minChildX = Math.min(...genIII.map(c => c.x));
      const maxChildX = Math.max(...genIII.map(c => c.x));
      customConnectors += `
        <line x1="${p1.x + R}" y1="${midY}" x2="${p2.x - R}" y2="${midY}" stroke="#0b111e" stroke-width="2.4"/>
        <line x1="${midX}" y1="${midY}" x2="${midX}" y2="${sibY}" stroke="#0b111e" stroke-width="2.4"/>
        <line x1="${minChildX}" y1="${sibY}" x2="${maxChildX}" y2="${sibY}" stroke="#0b111e" stroke-width="2.4"/>
      `;
      genIII.forEach(ch => {
        customConnectors += `<line x1="${ch.x}" y1="${sibY}" x2="${ch.x}" y2="${ch.y - R}" stroke="#0b111e" stroke-width="2.4"/>`;
      });
    }
    // Generation markers: one per row of members, numbered from the members' labels (e.g. "I-1" → I)
    const rows = [...new Set(members.map(m => m.y))].sort((a, b) => a - b);
    linesSvg = rows.map((y, i) => {
      const lab = (members.find(m => m.y === y)?.label || "").split("-")[0] || ["I", "II", "III", "IV"][i];
      return `<g font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="700" fill="#0b111e">
        <rect x="${vbLeft + 16}" y="${y - 18}" width="32" height="28" rx="6" fill="#F3F2FA"/>
        <text x="${vbLeft + 32}" y="${y + 1}" text-anchor="middle">${lab}</text></g>`;
    }).join("") + customConnectors;
  }

  const nodesSvg = members.map(m => {
    const pStyle = phenotypeStyles[m.phenotype] || phenotypeStyles.unaffected;
    const isSelected = m.id === selectedId;
    const badge = getScenarioBadge(m);

    const selectionHalo = isSelected
      ? (m.sex === "M"
        ? `<rect x="${m.x - R - 7}" y="${m.y - R - 7}" width="${(R + 7) * 2}" height="${(R + 7) * 2}" rx="6" fill="none" stroke="#0b111e" stroke-width="2.5" stroke-dasharray="4,3"/>`
        : `<circle cx="${m.x}" cy="${m.y}" r="${R + 7}" fill="none" stroke="#0b111e" stroke-width="2.5" stroke-dasharray="4,3"/>`)
      : "";

    const shapeSvg = m.sex === "M"
      ? `<rect x="${m.x - R}" y="${m.y - R}" width="${R * 2}" height="${R * 2}" rx="2" fill="${pStyle.fill}" stroke="${pStyle.stroke}" stroke-width="2.4"/>`
      : `<circle cx="${m.x}" cy="${m.y}" r="${R}" fill="${pStyle.fill}" stroke="${pStyle.stroke}" stroke-width="2.4"/>`;

    const innerMark = m.phenotype === "unknown"
      ? `<text x="${m.x}" y="${m.y + 5}" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#3D4463">?</text>`
      : "";

    const deceasedSlash = m.deceased
      ? `<line x1="${m.x - R - 7}" y1="${m.y + R + 7}" x2="${m.x + R + 7}" y2="${m.y - R - 7}" stroke="#0b111e" stroke-width="2.4" stroke-linecap="round"/>`
      : "";

    // Proband Arrow (pointing to bottom-left of Proband)
    const probandLabel = lang === "pl" ? (m.sex === "M" ? "P (Probant)" : "P (Probantka)") : "P (Proband)";
    const probandArrow = m.proband
      ? `<g class="proband-arrow">
          <line x1="${m.x - R - 34}" y1="${m.y + R + 28}" x2="${m.x - R - 6}" y2="${m.y + R + 6}" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
          <polygon points="${m.x - R - 4},${m.y + R + 4} ${m.x - R - 15},${m.y + R + 6} ${m.x - R - 7},${m.y + R + 15}" fill="#dc2626"/>
          <text x="${m.x - R - 38}" y="${m.y + R + 33}" text-anchor="end" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#dc2626">${probandLabel}</text>
        </g>`
      : "";

    // Scenario pill above node
    const badgeSvg = badge
      ? `<g transform="translate(${m.x}, ${m.y - R - 15})">
          <rect x="-46" y="-11" width="92" height="18" rx="9" fill="${badge.bg}"/>
          <text x="0" y="2" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="700" fill="${badge.color}">${badge.text}</text>
        </g>`
      : "";

    const line1 = m.age?.[lang] || m.age?.pl || "";
    const line2 = m.subLabel ? (m.subLabel[lang] || m.subLabel.pl || "") : "";

    return `
      <g class="pedigree-node" data-member-id="${m.id}" style="cursor: pointer;">
        ${selectionHalo}
        ${shapeSvg}
        ${innerMark}
        ${deceasedSlash}
        ${probandArrow}
        ${badgeSvg}
        <text x="${m.x}" y="${m.y + R + 16}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="11.5" font-weight="800" fill="#0b111e">${m.label}</text>
        <text x="${m.x}" y="${m.y + R + 30}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#2E3552">${line1}</text>
        ${line2 ? `<text x="${m.x}" y="${m.y + R + 43}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="500" fill="${m.proband ? "#dc2626" : "#5B6280"}">${line2}</text>` : ""}
      </g>
    `;
  }).join("");

  container.innerHTML = `
    <svg id="pedigree-svg" viewBox="${viewBox}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: #ffffff; border-radius: 12px; display: block;">
      <defs>
        <pattern id="pedigree-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#FAFAFE" stroke-width="1"/>
        </pattern>
        <pattern id="hatch-diagonal" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#0b111e" stroke-width="3"/>
        </pattern>
        <pattern id="hatch-cross" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 8 8 M 8 0 L 0 8" stroke="#0b111e" stroke-width="1.8"/>
        </pattern>
        <pattern id="hatch-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill="#0b111e"/>
        </pattern>
      </defs>
      <rect width="1160" height="640" fill="url(#pedigree-grid)"/>
      ${linesSvg}
      ${nodesSvg}
    </svg>
  `;

  if (onSelectMember) {
    container.querySelectorAll(".pedigree-node").forEach(node => {
      node.addEventListener("click", () => {
        const id = node.getAttribute("data-member-id");
        if (id && byId[id]) {
          onSelectMember(byId[id]);
        }
      });
    });
  }
}
