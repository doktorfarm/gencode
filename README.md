# GenCode® — platforma analizy genomowej

Statyczna aplikacja (HTML/CSS/JS, bez serwera) publikowana na GitHub Pages.

| Plik | Opis |
|---|---|
| `index.html` | Strona główna (landing) z wyborem trybu: klinicysta / pacjent |
| `app.html` | Workspace: `?role=clinician` (dodawanie przypadków, udostępnianie raportu), `?role=patient` (raport dla pacjenta z linku), `?case=nf1` / `?case=pten` (demo) |
| `prywatnosc.html` | Prywatność i warunki korzystania |

## Standardy wdrożeniowe
- **Dostępność:** WCAG 2.1 AA — 0 naruszeń w automatycznym audycie axe-core 4.10 (landing, Workspace klinicysty i pacjenta, demo, wersja mobilna); skip link, landmarki, pułapka fokusu i Esc w oknach, kontrast ≥ 4,5:1, `prefers-reduced-motion`.
- **Bezpieczeństwo:** Content-Security-Policy na każdej stronie; dane z linków, plików i odpowiedzi AI są neutralizowane przed renderowaniem (`js/sanitize.js`); brak kluczy API w kodzie; limit rozmiaru linku/pliku.
- **Prywatność:** brak serwera i analityki; przypadki tylko w localStorage przeglądarki; raport w linku po `#` (nie trafia do serwera); `noindex`.
- **Charakter narzędzia:** edukacyjny i wspierający — nie zastępuje konsultacji lekarza genetyka.
