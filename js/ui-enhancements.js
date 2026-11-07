/**
 * GenCode® Workspace — UI enhancements (loaded alongside app.js, no changes to app logic)
 *  1. Case menu: compact "Przypadek ▾" dropdown that mirrors the active case chip
 *  2. Overview mini-visualisations derived from the real card values (no decorative trends)
 *  3. Recommendation table: per-cell labels so rows become cards on mobile
 */
(function () {
  'use strict';

  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'pl');
  const T = {
    pl: { sup: 'Wspierający', vstr: 'Bardzo silny', ben: 'Łagodny', vus: 'VUS', pat: 'Patogenny',
          normal: '<30', inter: '30–59', cf: '≥60 CF', germ: 'Germinalny', som: 'Somatyczny', het: '50% heterozygota' },
    en: { sup: 'Supporting', vstr: 'Very strong', ben: 'Benign', vus: 'VUS', pat: 'Pathogenic',
          normal: '<30', inter: '30–59', cf: '≥60 CF', germ: 'Germline', som: 'Somatic', het: '50% heterozygous' }
  };

  /* ---------------- 1. Case menu ---------------- */
  function initCaseMenu() {
    const menu = document.getElementById('gc-case-menu');
    const cur = document.getElementById('gc-case-current');
    if (!menu || !cur) return;
    const sync = () => {
      const active = menu.querySelector('.mydna-case-chip.active') || menu.querySelector('.mydna-case-chip');
      if (!active) return;
      const label = active.querySelector('[data-i18n]') || active;
      const txt = label.textContent.trim();
      if (cur.textContent !== txt) cur.textContent = txt;
    };
    menu.addEventListener('click', (e) => {
      if (e.target.closest('.mydna-case-chip')) menu.open = false;
    });
    document.addEventListener('click', (e) => {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
    new MutationObserver(sync).observe(menu, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true, characterData: true });
    sync();
  }

  /* ---------------- 2. Overview visualisations ---------------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function segBar(n, active, labels, opts = {}) {
    let cells = '';
    for (let i = 1; i <= n; i++) {
      const on = opts.upTo ? i <= active : i === active;
      cells += `<i class="${on ? 'on' : ''}${opts.danger && on ? ' danger' : ''}"></i>`;
    }
    const lab = labels ? `<div class="gc-viz-l">${labels.map((l) => `<span>${esc(l)}</span>`).join('')}</div>` : '';
    return `<div class="gc-viz-seg">${cells}</div>${lab}`;
  }

  function vizFor(val, unit, cardIdx) {
    const t = T[lang()];
    const v = (val || '').trim();
    const u = (unit || '').trim();

    // ACMG evidence code → strength (PVS > PS > PM > PP)
    const ev = v.match(/^(PVS|PS|PM|PP)\d?/i);
    if (ev) {
      const lvl = { PP: 1, PM: 2, PS: 3, PVS: 4 }[ev[1].toUpperCase()];
      return segBar(4, lvl, [t.sup, t.vstr], { upTo: true });
    }
    // ACMG 5-tier class (arabic digit 1–5)
    const cls = v.match(/(?:klasa|class)\s*([1-5])\b/i);
    if (cls) {
      const k = +cls[1];
      return segBar(5, k, [t.ben, t.vus, t.pat], { danger: k >= 4 });
    }
    // Probability / range in %
    const pct = v.match(/(\d{1,3})(?:\s*[–-]\s*(\d{1,3}))?\s*%/);
    // Variant allele fraction: scale 0–100% with the heterozygous 50% reference
    if (pct && /vaf/i.test(u)) {
      const a = Math.min(100, +pct[1]);
      return `<div class="gc-viz-range"><span class="fill" style="width:${a}%"></span><i class="gc-viz-ref" style="left:50%"></i></div>
              <div class="gc-viz-l"><span>0%</span><span>${t.het}</span><span>100%</span></div>`;
    }
    if (pct) {
      const a = Math.min(100, +pct[1]);
      const b = Math.min(100, pct[2] ? +pct[2] : a);
      return `<div class="gc-viz-range"><span class="fill" style="width:${a}%"></span><span class="band" style="left:${a}%;width:${Math.max(1, b - a)}%"></span></div>
              ${/priori/i.test(u)
                ? `<div class="gc-viz-l"><span>${t.germ}</span><span>${t.som}</span></div>`
                : `<div class="gc-viz-l"><span>0%</span><span>100%</span></div>`}`;
    }
    // Sweat chloride (mmol/L): <30 normal · 30–59 intermediate · ≥60 consistent with CF
    if (/mmol\/l/i.test(u) && /^\d+(\.\d+)?$/.test(v)) {
      const x = Math.max(0, Math.min(120, +v));
      return `<div class="gc-viz-zones"><span style="width:25%"></span><span style="width:25%"></span><span class="hi" style="width:50%"></span><b style="left:${(x / 120) * 100}%"></b></div>
              <div class="gc-viz-l"><span>${t.normal}</span><span>${t.inter}</span><span>${t.cf}</span></div>`;
    }
    return '';
  }

  function renderViz() {
    document.querySelectorAll('.mydna-vital-card').forEach((card, i) => {
      const box = card.querySelector('.gc-viz');
      if (!box) return;
      const val = card.querySelector('.mydna-vital-badge strong')?.textContent;
      const unit = card.querySelector('.mydna-vital-badge small')?.textContent;
      const html = vizFor(val, unit, i + 1);
      if (box.dataset.sig === val + '|' + unit + '|' + lang()) return;
      box.dataset.sig = val + '|' + unit + '|' + lang();
      box.innerHTML = html;
      if (box.hidden !== !html) box.hidden = !html;
    });
  }

  function initViz() {
    const row = document.querySelector('.mydna-vitals-row');
    if (!row) return;
    let raf;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(renderViz); };
    new MutationObserver(schedule).observe(row, { subtree: true, childList: true, characterData: true });
    new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    renderViz();
  }

  /* ---------------- 3. Table labels for mobile cards ---------------- */
  function initTableLabels() {
    document.querySelectorAll('.diagnostic-table').forEach((table) => {
      const apply = () => {
        const heads = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach((tr) => {
          [...tr.children].forEach((td, i) => {
            if (heads[i] && td.getAttribute('data-label') !== heads[i]) td.setAttribute('data-label', heads[i]);
          });
        });
      };
      new MutationObserver(apply).observe(table, { subtree: true, childList: true, characterData: true });
      apply();
    });
  }

  /* ---------------- 4. Scroll-spy: breadcrumb + rail follow the visible section ---------------- */
  function initScrollSpy() {
    const bc = document.getElementById('bc-module-name');
    const SECTIONS = [
      { id: 'overview-pedestal-section', btn: 'rail-btn-dashboard', pl: 'Przegląd i Próbki', en: 'Overview & Samples' },
      { id: 'results-workspace', btn: 'rail-btn-patient', pl: 'Raporty Adaptacyjne', en: 'Adaptive Reports' },
      { id: 'pedigree-anchor', btn: 'rail-btn-pedigree', pl: 'Wizualizacja Rodowodu I–IV', en: 'Pedigree Visualization I–IV' },
      { id: 'level2-disclosure-bar', btn: 'rail-btn-doctor', pl: 'Interpretacja i Kaskada', en: 'Interpretation & Cascade' }
    ];
    let current = null;
    const update = () => {
      let active = SECTIONS[0];
      SECTIONS.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el && el.offsetParent !== null && el.getBoundingClientRect().top <= 140) active = sec;
      });
      const key = active.id + '|' + lang();
      if (key === current) return;
      current = key;
      if (bc) bc.textContent = active[lang()];
      document.querySelectorAll('.mydna-rail-btn').forEach((b) => b.classList.toggle('active', b.id === active.btn));
    };
    let raf;
    window.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    // Re-sync after the case-intake modal closes or the language changes
    const modal = document.getElementById('case-modal');
    if (modal) new MutationObserver(() => { if (modal.classList.contains('hidden')) { current = null; update(); } }).observe(modal, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(() => { current = null; update(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    update();
  }

  const init = () => { initCaseMenu(); initViz(); initTableLabels(); initScrollSpy(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
