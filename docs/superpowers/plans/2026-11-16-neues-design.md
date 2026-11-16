# Neues Design – Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `index.html` bekommt ein einziges Design im Stil von derstandard.at; Umschaltung und alte Varianten entfallen, Inhalte bleiben unverändert.

**Architecture:** Eine eigenständige HTML-Datei mit eingebettetem CSS, ohne JavaScript. Inhalte (Texte, Links) werden 1:1 übernommen, nur Markup-Anordnung und CSS ändern sich. Ein PowerShell-Test sichert ab, dass kein Inhalt verloren geht.

**Tech Stack:** HTML, CSS, Google Fonts (Source Sans 3, Source Serif 4), PowerShell für Test, Edge headless für Screenshots.

**Spec:** `docs/superpowers/specs/2026-11-16-neues-design-design.md`

## Global Constraints

- Kein Logo, Name, Hausschrift („STMatilda“) oder Magenta von derStandard.
- Akzentfarbe `#b3122b`; Schriften nur „Source Sans 3“ und „Source Serif 4“ (Letztere nur für den Titel „Daily News“).
- Dunkler Modus nach `prefers-color-scheme` bleibt.
- Keine Reste der Umschaltung: kein `data-design`, kein `daily-news-design`, kein `<script>`.
- Alle 40 Quellenlinks, „Keine Anlageberatung“, Zeitpunkt und Quelle der Kurse bleiben erhalten.
- Handy (375 px): einspaltig, kein waagrechtes Scrollen.

## Review Focus

- Lange Wörter/Überschriften am Handy (z. B. „Rechenzentrumsbetreiber“) erzeugen waagrechtes Scrollen → `overflow-wrap:anywhere`/`hyphens:auto` mit `lang="de"`; Screenshot-Prüfung 375 px.
- Laufband mit vier Kurs-Kacheln bei schmaler Breite → 2×2, Zahlen nicht umbrechen.
- Dunkelmodus: Kacheln und Text kontrastreich, Akzent lesbar.
- Ressort ohne belegbare Meldungen (Inhaltsregel) → Raster darf mit weniger Artikeln nicht zerfallen; Test-Hinweis im Plan, Prüfung visuell durch Wegdenken nicht nötig, CSS nutzt `auto-fill` statt fester Spaltenzahl.
- Lange Aufmacher-Texte (4 Absätze) neben Seitenspalte → Seitenspalte darf nicht gestreckt wirken (`align-self:start`).

---

### Task 1: Inhaltstest

**Files:**
- Create: `tests/pruefe-index.ps1`
- Create: `tests/ausgabe-4-links.txt` (Ausgangsliste aus der aktuellen `index.html`)

- [ ] **Step 1:** `tests/ausgabe-4-links.txt` aus der aktuellen `index.html` erzeugen: alle `href="http…"` ohne `fonts.googleapis.com`/`fonts.gstatic.com`, eine pro Zeile, in Reihenfolge. Erwartet: 40 Zeilen.
- [ ] **Step 2:** `tests/pruefe-index.ps1` schreiben. Prüft `index.html` und gibt bei Fehler Exit-Code 1 mit Meldung:
  - Links (gleiche Filterung) als Multimenge identisch mit `ausgabe-4-links.txt`.
  - Enthält „Keine Anlageberatung“, „CoinGecko“, „06:45“, `id="ki"`, `id="games"`, `id="krypto"`, `id="termine"`.
  - Enthält nicht: `data-design`, `daily-news-design`, `<script`, `UnifrakturCook`.
- [ ] **Step 3:** Test gegen die alte Datei laufen lassen. Erwartet: FAIL nur wegen `data-design`/`daily-news-design`/`<script`/`UnifrakturCook`; Linkvergleich OK.

### Task 2: Neues Design in `index.html`

**Files:**
- Modify: `index.html` (komplett: `<head>`-Schriften, `<style>`, Kopf, Aufmacher, Kurstafel, Termine, Skript)

- [ ] **Step 1:** Kopf: Titel „Daily News“ links (Source Serif 4, fett), „Ausgabe Nr. 4“ rechts; darunter Datum als Pille und Ressort-Navigation. Design-Buttons entfernen.
- [ ] **Step 2:** Kurstafel als Laufband direkt unter dem Kopf: vier Kacheln (Name, Kurs, Veränderung mit ▲/▼), darunter die bestehende Notiz mit Zeitpunkt, Quelle und „Keine Anlageberatung“ wörtlich.
- [ ] **Step 3:** Aufmacher als Kachel links, Termine („Was diese Woche ansteht“) als Seitenspalte rechts; am Handy Termine unter dem Aufmacher.
- [ ] **Step 4:** Ressorts: Kopfzeile mit Ressortname und Linie, Hauptartikel als breite Kachel, weitere Artikel als Kachelreihe, „Kurz gemeldet“ als Listen-Kachel.
- [ ] **Step 5:** CSS neu: Tokens auf `:root` (Hintergrund ca. `#e6e6e6`, Kacheln heller, Schrift ca. `#212121`, Akzent `#b3122b`), Dunkelmodus-Tokens, alle `data-design`-Regeln und das `<script>` entfernen.
- [ ] **Step 6:** `tests/pruefe-index.ps1` ausführen. Erwartet: PASS.

### Task 3: Sichtprüfung

- [ ] **Step 1:** Edge headless Screenshots in den Scratchpad: 1280×2400 hell, 375×2400 hell, 1280×2400 mit `--force-dark-mode`.
- [ ] **Step 2:** Screenshots ansehen; Review-Focus-Punkte prüfen, Mängel beheben, Test erneut PASS.

### Task 4: Abschluss

**Files:**
- Modify: `CLAUDE.md` (Abschnitt „Stand“: Umschaltung entfällt, neues Design beschrieben, offener Punkt geplante Aufgabe)

- [ ] **Step 1:** `CLAUDE.md` anpassen.
- [ ] **Step 2:** Commit mit Spec, Plan, Test, `index.html`, `CLAUDE.md`; nach Freigabe durch den Nutzer `git push`.
