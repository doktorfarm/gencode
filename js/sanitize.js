/**
 * GenCode® — neutralizacja danych z niezaufanych źródeł
 * (link od lekarza, plik raportu, odpowiedź modelu AI, localStorage).
 * Aplikacja wstawia część treści przez innerHTML, więc każdy tekst z zewnątrz
 * jest „rozbrajany”: znaki < > " ` zamieniane na bezpieczne odpowiedniki typograficzne,
 * a klucze obiektów ograniczone do bezpiecznych nazw. Treść pozostaje czytelna.
 */
const MAP = { '<': '‹', '>': '›', '"': '”', '`': 'ʼ' };
const SAFE_KEY = /^[A-Za-z0-9_-]{1,64}$/;
// Notacja HGVS używa ">" (np. c.3607C>T) — tam jest bezpieczna, bo bez "<" nie powstanie znacznik.
const cleanString = (s) => String(s).replace(/[<"`]/g, (c) => MAP[c]);

export function sanitizeCase(input, depth = 0) {
  if (depth > 12) return undefined;
  if (typeof input === 'string') return cleanString(input).slice(0, 20000);
  if (typeof input === 'number' || typeof input === 'boolean') return input;
  if (Array.isArray(input)) return input.slice(0, 200).map((v) => sanitizeCase(v, depth + 1));
  if (input && typeof input === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(input)) {
      if (!SAFE_KEY.test(k) || k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      out[k] = sanitizeCase(v, depth + 1);
    }
    return out;
  }
  return undefined;
}

/** Fields that legitimately carry HTML (authored in-app only) are dropped from untrusted cases. */
export function sanitizeUntrustedCase(c) {
  const s = sanitizeCase(c) || {};
  delete s.simulator; // simulator boxes are HTML — only trusted built-in cases may define them
  if (s.pedigreeMembers) {
    s.pedigreeMembers = s.pedigreeMembers.map((m) => ({
      ...m,
      x: Number.isFinite(+m.x) ? +m.x : 0,
      y: Number.isFinite(+m.y) ? +m.y : 0,
      sex: m.sex === 'M' ? 'M' : 'F'
    }));
  }
  return s;
}
