/**
 * GenCode® Workspace — dwa poziomy dostępu
 *  • Klinicysta (?role=clinician): pusty Workspace bez demo → dodaje własne przypadki (zapisywane w przeglądarce),
 *    może udostępnić raport pacjentowi linkiem lub plikiem.
 *  • Pacjent (?role=patient): widzi wyłącznie raport w prostym języku i kartę informacyjną,
 *    otwierane z linku od lekarza (#r=…) albo z pliku .gencode.json.
 * Bez parametru role aplikacja działa jak dotąd (przypadki demonstracyjne z linków ?case=…).
 */

import { sanitizeUntrustedCase } from './sanitize.js?v=1';

const MY_CASES_KEY = 'gencode_my_cases_v1';
const ROLE_KEY = 'gencode_role_v1';

const T = {
  pl: {
    clinicianBadge: 'Klinicysta',
    patientBadge: 'Pacjent',
    myCases: 'Moje przypadki',
    noCases: 'Nie masz jeszcze zapisanych przypadków.',
    del: 'Usuń',
    delConfirm: 'Usunąć ten przypadek z tej przeglądarki?',
    emptyText: 'Wklej opis wywiadu lub wynik badania genetycznego — GenCode® przygotuje analizę, rodowód i raport dla pacjenta.',
    needText: 'Wklej opis przypadku lub dodaj zdjęcie wyniku, aby uruchomić analizę.',
    analysisError: 'Nie udało się przeanalizować przypadku. Sprawdź opis (lub klucz API) i spróbuj ponownie.',
    badLink: 'Nie udało się odczytać raportu. Sprawdź, czy wklejono cały link lub właściwy plik.',
    copied: 'Skopiowano link',
    copy: 'Kopiuj link',
    shareSize: (kb) => `Rozmiar linku: ${kb} KB`,
    yourReport: 'Twój raport'
  },
  en: {
    clinicianBadge: 'Clinician',
    patientBadge: 'Patient',
    myCases: 'My cases',
    noCases: 'You have no saved cases yet.',
    del: 'Delete',
    delConfirm: 'Delete this case from this browser?',
    emptyText: 'Paste the family history or the genetic test result — GenCode® will prepare the analysis, pedigree and a patient report.',
    needText: 'Paste a case description or add a photo of the result to run the analysis.',
    analysisError: 'The case could not be analysed. Check the description (or API key) and try again.',
    badLink: 'The report could not be read. Make sure you pasted the whole link or the right file.',
    copied: 'Link copied',
    copy: 'Copy link',
    shareSize: (kb) => `Link size: ${kb} KB`,
    yourReport: 'Your report'
  }
};

/* ---------------- encoding (gzip + base64url, with plain fallback) ---------------- */
const b64url = (bytes) => {
  let s = '';
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64url = (str) => {
  const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
};

async function encodeCase(obj) {
  const json = new TextEncoder().encode(JSON.stringify(obj));
  if (typeof CompressionStream !== 'undefined') {
    const buf = await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
    return 'z' + b64url(new Uint8Array(buf));
  }
  return 'j' + b64url(json);
}

async function decodeCase(payload) {
  if (!payload || payload.length > 400000) throw new Error('payload too large');
  const kind = payload[0];
  const bytes = fromB64url(payload.slice(1));
  let text;
  if (kind === 'z') {
    const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    text = new TextDecoder().decode(buf);
  } else {
    text = new TextDecoder().decode(bytes);
  }
  return JSON.parse(text);
}

/** What the patient needs — clinician-only data stays out of the link. */
function patientSubset(c) {
  return {
    id: c.id,
    shared: true,
    title: c.title,
    category: c.category,
    inheritanceMode: c.inheritanceMode,
    badge: c.badge,
    variant: c.variant
      ? { gene: c.variant.gene, hgvs_c: c.variant.hgvs_c, hgvs_p: c.variant.hgvs_p, classification: c.variant.classification }
      : undefined,
    patientReport: c.patientReport,
    patientCard: c.patientCard,
    pedigreeMembers: c.pedigreeMembers
  };
}

/* ---------------- storage ---------------- */
const readMyCases = () => {
  try {
    const list = JSON.parse(localStorage.getItem(MY_CASES_KEY)) || [];
    return Array.isArray(list) ? list.map(sanitizeUntrustedCase) : [];
  } catch (e) {
    return [];
  }
};
const writeMyCases = (list) => {
  try {
    localStorage.setItem(MY_CASES_KEY, JSON.stringify(list.slice(0, 30)));
  } catch (e) {
    // storage full or blocked — keep working in memory
  }
};

export function installRoles(app, { CASES_DATA }) {
  const params = new URLSearchParams(location.search);
  let role = params.get('role');
  if (role !== 'clinician' && role !== 'patient') role = null;
  app.role = role;
  if (!role) return false; // classic demo behaviour

  try {
    sessionStorage.setItem(ROLE_KEY, role);
  } catch (e) {}

  const L = () => T[app.lang === 'en' ? 'en' : 'pl'];
  const body = document.body;
  body.dataset.role = role;
  const badge = document.getElementById('gc-role-badge');
  if (badge) {
    badge.textContent = role === 'patient' ? L().patientBadge : L().clinicianBadge;
    badge.hidden = false;
  }

  const empty = document.getElementById('gc-empty');
  const setNoCase = (on) => {
    body.classList.toggle('gc-no-case', on);
    if (empty) empty.hidden = !on;
  };

  /* ---------- clinician ---------- */
  const renderMyCases = () => {
    const list = readMyCases();
    // case menu → own cases only
    const strip = document.querySelector('#gc-case-menu .mydna-quick-case-strip');
    if (strip) {
      strip.innerHTML = list.length
        ? list
            .map(
              (c) => `<button type="button" class="mydna-case-chip${app.activeCase?.id === c.id ? ' active' : ''}" data-my-case="${c.id}">
                <span>📁</span><span>${(c.title?.[app.lang] || c.title?.pl || c.id).replace(/</g, '&lt;')}</span></button>`
            )
            .join('')
        : `<div class="gc-menu-empty">${L().noCases}</div>`;
      strip.querySelectorAll('[data-my-case]').forEach((b) =>
        b.addEventListener('click', () => {
          const c = readMyCases().find((x) => x.id === b.dataset.myCase);
          if (c) openCase(c, true);
          document.getElementById('gc-case-menu').open = false;
        })
      );
    }
    const cur = document.getElementById('gc-case-current');
    if (cur) cur.textContent = app.activeCase ? app.activeCase.title?.[app.lang] || app.activeCase.title?.pl : L().myCases;

    // empty-state list
    const box = document.getElementById('gc-my-cases-list');
    if (box) {
      box.innerHTML = list.length
        ? `<h4>${L().myCases}</h4>` +
          list
            .map(
              (c) => `<div class="gc-my-case"><button type="button" class="gc-my-open" data-open="${c.id}">
                <b>${(c.title?.[app.lang] || c.title?.pl || c.id).replace(/</g, '&lt;')}</b>
                <small>${(c.category?.[app.lang] || c.category?.pl || '').replace(/</g, '&lt;')}</small></button>
                <button type="button" class="gc-my-del" data-del="${c.id}" aria-label="${L().del}">${L().del}</button></div>`
            )
            .join('')
        : '';
      box.querySelectorAll('[data-open]').forEach((b) =>
        b.addEventListener('click', () => {
          const c = readMyCases().find((x) => x.id === b.dataset.open);
          if (c) openCase(c, false);
        })
      );
      box.querySelectorAll('[data-del]').forEach((b) =>
        b.addEventListener('click', () => {
          if (!confirm(L().delConfirm)) return;
          writeMyCases(readMyCases().filter((x) => x.id !== b.dataset.del));
          renderMyCases();
        })
      );
    }
  };

  const openCase = (c, scroll) => {
    setNoCase(false);
    app.loadCase(c, scroll);
    app.setAudienceMode(role === 'patient' ? 'patient' : app.audienceMode === 'patient' ? 'clinical' : app.audienceMode, false);
    if (role === 'clinician') renderMyCases();
    if (role === 'patient') {
      const h = document.querySelector('.gc-report-heading');
      if (h) {
        h.removeAttribute('data-i18n');
        h.textContent = `${L().yourReport}: ${(c.title?.[app.lang] || c.title?.pl || '').replace(/^(Przypadek|Case)\s+\d+\s+—\s+/, '')}`.replace(/:\s*$/, '');
      }
    }
  };

  app.onCaseAnalyzed = (raw) => {
    const c = sanitizeUntrustedCase(raw);
    if (!c.id) c.id = 'custom_' + Date.now();
    const list = readMyCases().filter((x) => x.id !== c.id);
    list.unshift(c);
    writeMyCases(list);
    openCase(c, true);
  };
  app.showCaseError = (msg) => {
    const el = document.getElementById('gc-case-error');
    if (el) {
      el.textContent = msg || L().analysisError;
      el.hidden = false;
    }
  };
  app.rolesText = L;

  /* ---------- share with patient ---------- */
  const shareModal = document.getElementById('share-modal');
  const shareOut = document.getElementById('share-link');
  document.getElementById('btn-share-patient')?.addEventListener('click', async () => {
    if (!app.activeCase) return;
    const subset = patientSubset(app.activeCase);
    const payload = await encodeCase(subset);
    const url = `${location.origin}${location.pathname}?role=patient#r=${payload}`;
    if (shareOut) shareOut.value = url;
    const size = document.getElementById('share-size');
    if (size) size.textContent = L().shareSize(Math.ceil(url.length / 1024));
    const dl = document.getElementById('share-download');
    if (dl) {
      dl.href = URL.createObjectURL(new Blob([JSON.stringify(subset)], { type: 'application/json' }));
      dl.download = `raport-${(app.activeCase.variant?.gene || 'gencode').toString().toLowerCase()}.gencode.json`;
    }
    shareModal?.classList.remove('hidden');
    shareOut?.select();
  });
  document.getElementById('share-copy')?.addEventListener('click', async (e) => {
    try {
      await navigator.clipboard.writeText(shareOut.value);
    } catch (err) {
      shareOut.select();
      document.execCommand('copy');
    }
    e.currentTarget.textContent = L().copied;
    setTimeout(() => (e.currentTarget.textContent = L().copy), 1800);
  });
  document.querySelectorAll('[data-close-share]').forEach((b) => b.addEventListener('click', () => shareModal?.classList.add('hidden')));
  shareModal?.addEventListener('click', (e) => {
    if (e.target === shareModal) shareModal.classList.add('hidden');
  });

  /* ---------- patient: open a shared report ---------- */
  const openFromPayload = async (payload) => {
    const c = sanitizeUntrustedCase(await decodeCase(payload));
    if (!c || !c.patientReport) throw new Error('not a report');
    openCase(c, false);
    try {
      history.replaceState(null, '', `${location.pathname}?role=patient#r=${payload}`);
    } catch (e) {}
  };
  const patientError = (on) => {
    const el = document.getElementById('gc-share-error');
    if (el) {
      el.textContent = L().badLink;
      el.hidden = !on;
    }
  };
  document.getElementById('btn-open-shared')?.addEventListener('click', async () => {
    const val = (document.getElementById('gc-share-input')?.value || '').trim();
    const m = val.match(/#r=([A-Za-z0-9_-]+)/) || val.match(/^([zj][A-Za-z0-9_-]{20,})$/);
    try {
      patientError(false);
      await openFromPayload(m ? m[1] : '');
    } catch (e) {
      patientError(true);
    }
  });
  document.getElementById('gc-share-file')?.addEventListener('change', async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      patientError(false);
      if (f.size > 2_000_000) throw new Error('too large');
      const c = sanitizeUntrustedCase(JSON.parse(await f.text()));
      if (!c.patientReport) throw new Error('not a report');
      openCase(c, false);
    } catch (err) {
      patientError(true);
    }
  });
  document.getElementById('btn-empty-add')?.addEventListener('click', () => app.openCaseModal());

  /* ---------- start ---------- */
  if (role === 'patient') {
    app.audienceMode = 'patient';
    const m = location.hash.match(/#r=([A-Za-z0-9_-]+)/);
    setNoCase(true);
    if (m) openFromPayload(m[1]).catch(() => patientError(true));
  } else {
    if (app.audienceMode === 'patient') app.audienceMode = 'clinical';
    const caseId = params.get('case');
    const own = readMyCases();
    if (caseId && CASES_DATA[caseId]) openCase(CASES_DATA[caseId], false);
    else setNoCase(true);
    renderMyCases();
    if (params.get('action') === 'new' && !own.length) app.openCaseModal();
  }
  return true;
}
