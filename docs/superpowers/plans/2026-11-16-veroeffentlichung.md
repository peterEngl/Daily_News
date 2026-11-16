# Veröffentlichung über GitHub Actions – Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein GitHub-Actions-Workflow veröffentlicht nur die App-Dateien plus die geprüfte `ausgabe.json` vom Branch `ausgabe`; die Cloud-Aufgabe pusht nur noch dorthin.

**Architecture:** Workflow `.github/workflows/veroeffentlichen.yml` auf `main` (Push, manuell, 4:50/5:50/6:50 UTC). Job `bauen` testet, holt `ausgabe.json` von `ausgabe`, prüft sie, kopiert eine feste Dateiliste nach `_site/`. Job `veroeffentlichen` stellt bereit, nur wenn die Repository-Variable `VEROEFFENTLICHEN` = `true`.

**Tech Stack:** GitHub Actions (ubuntu-latest, bash), Node 24, `node --test`, offizielle Pages-Aktionen.

**Spec:** `docs/superpowers/specs/2026-11-16-veroeffentlichung-design.md`

## Global Constraints

- Nur `ausgabe.json` kommt vom Branch `ausgabe`; alle anderen veröffentlichten Dateien kommen aus `main`.
- Veröffentlichte Dateien: `index.html style.css app.js render.js format.js kurse.js sw.js manifest.webmanifest fonts icons/icon-192.png icons/icon-512.png icons/apple-touch-icon.png` – nicht `icons/symbol.html`.
- Rechte: `contents: read`, `pages: write`, `id-token: write`; `concurrency: { group: pages, cancel-in-progress: false }`.
- Checkout mit `persist-credentials: false`; fremde Aktionen auf vollen Commit-Hash gepinnt, Version als Kommentar.
- Fehlt Branch oder Datei `ausgabe`: Lauf schlägt fehl, kein Rückgriff auf `main`.
- Kein Workflow-Eingabeparameter für einen anderen Quell-Branch.
- Commit-Nachrichten eine Zeile Englisch. Windows/PowerShell lokal; Workflow-Schritte in bash.
- Pages wird in diesem Plan nicht eingeschaltet, `VEROEFFENTLICHEN` nicht gesetzt.

## Review Focus

- Später neu hinzugefügte App-Datei fehlt in der Workflow-Liste → Seite online kaputt. Test in Task 1 vergleicht die Liste mit `HUELLE` in `sw.js`.
- Listeneintrag zeigt auf nicht existierende Datei (Tippfehler, Umbenennung) → Test in Task 1 prüft Existenz.
- Ungültige oder kaputte `ausgabe.json` auf `ausgabe` → Lauf muss fehlschlagen (lokale Gegenprobe Task 1).
- Branch `ausgabe` enthält zusätzliche Dateien (z. B. manipuliertes `index.html`) → dürfen nicht in `_site/` landen (lokale Gegenprobe Task 1).
- Cloud-Aufgabe pusht trotz Prompt auf `main` → bewusst offene Lücke laut Spec; in Task 4 am Lauf-Protokoll prüfen und melden.

---

### Task 1: Workflow und Listen-Test (lokal, noch nicht pushen)

**Files:**
- Create: `.github/workflows/veroeffentlichen.yml`
- Create: `tests/veroeffentlichen.test.mjs`

**Interfaces:**
- Produces: im Workflow genau eine Zeile `DATEIEN: "<Liste aus Global Constraints>"` (env auf Job-Ebene von `bauen`), damit der Test sie per Regex `/^\s*DATEIEN:\s*"([^"]+)"/m` lesen kann.

- [ ] **Step 1: Test schreiben** `tests/veroeffentlichen.test.mjs` mit `node:test`:
  - `test('jede Datei der App-Hülle wird veröffentlicht')`: liest `HUELLE` aus `sw.js` (Regex auf die Array-Literale `'./…'`), entfernt `./`, lässt `''` (für `'./'`) weg; für jeden Eintrag `assert.ok(liste.some((d) => e === d || e.startsWith(d + '/')), e)`.
  - `test('jeder Listeneintrag existiert')`: `existsSync` für jeden Eintrag von `DATEIEN`.
  - `test('symbol.html wird nicht veröffentlicht')`: `assert.ok(!liste.includes('icons'))` und `!liste.includes('icons/symbol.html')`.
- [ ] **Step 2:** `node --test "tests/*.test.*"` → FAIL (Workflow-Datei fehlt).
- [ ] **Step 3: Workflow schreiben** nach Spec-Abschnitt „Workflow“. Hashes ermitteln mit `gh api repos/actions/<name>/releases/latest --jq .tag_name` und `gh api repos/actions/<name>/commits/<tag> --jq .sha` für `checkout`, `setup-node`, `upload-pages-artifact`, `deploy-pages`. Schritt „Ausgabe holen“: `git fetch --depth 1 origin ausgabe` dann `git show FETCH_HEAD:ausgabe.json > _site/ausgabe.json` (bash mit `set -euo pipefail`). Kopierschritt: `cp -r --parents $DATEIEN _site/` und danach `find _site -type f | sort` ins Protokoll. Job `veroeffentlichen`: `needs: bauen`, `if: vars.VEROEFFENTLICHEN == 'true'`, `environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }`.
- [ ] **Step 4:** `node --test "tests/*.test.*"` → alle grün (bisher 35 + 3).
- [ ] **Step 5: Lokale Gegenprobe in Git Bash** (Ordner im Scratchpad, Befehle wie im Workflow):
  - gültige `ausgabe.json` + `index.html` mit Inhalt `MANIPULIERT` in einem Testordner als „Branch-Inhalt“ → nur `ausgabe.json` daraus wird übernommen, `_site/index.html` ist die aus `main`; `find _site -type f` zeigt genau die Liste + `ausgabe.json`.
  - `ausgabe.json` mit `"nummer": 0` → `node tests/pruefe-ausgabe.mjs _site/ausgabe.json` endet mit Exit-Code 1.
  - `git show` auf nicht existierenden Ref → Exit-Code ≠ 0, `set -e` bricht ab.
- [ ] **Step 6:** `sw.js` unverändert lassen (Workflow ist keine Datei der App-Hülle). Auf einem lokalen Branch `veroeffentlichung` committen (damit ein zwischenzeitliches `git push` auf `main` den Workflow nicht vorzeitig mitnimmt), **nicht pushen**: `Add publishing workflow`. In Task 2 Step 5 per `git merge --ff-only veroeffentlichung` auf `main` bringen.
- [ ] **Step 7:** Peter zusammenfassen, auf OK warten.

### Task 2: Umstellung (erst nach dem Lauf der Cloud-Aufgabe am 17.11.2026)

**Files:** keine Dateien in `main` außer dem Push aus Task 1; neuer Branch `ausgabe`; Routine `trig_012ZGJAkBG178t8AK6sC7PLs`.

- [ ] **Step 1:** `RemoteTrigger list_runs` + `get_run_log` für den Lauf vom 17.11.: Ergebnis, Push auf `main` erfolgreich?, Kennung des Pushes (`git log -1 --format='%an %ae | %cn %ce'` nach `git pull`). Peter berichten. Schlug der Lauf fehl, hier stoppen und mit Peter klären.
- [ ] **Step 2:** `git pull` auf `main`, dann `node tests\pruefe-ausgabe.mjs` → „OK“ mit der neuesten Nummer.
- [ ] **Step 3: Branch `ausgabe` anlegen** ohne die Arbeitskopie zu verändern: `git worktree add --orphan -b ausgabe <scratchpad>/ausgabe` (bei älterem Git: `git worktree add --detach` + `git checkout --orphan ausgabe` + `git rm -rf .`), `ausgabe.json` aus `main` hineinkopieren, Commit `Start ausgabe branch with issue No. <n>`, `git push -u origin ausgabe`, Worktree entfernen (`git worktree remove`). Prüfen: `git ls-tree -r --name-only origin/ausgabe` zeigt nur `ausgabe.json`.
- [ ] **Step 4: Prompt der Routine umstellen** (`RemoteTrigger update`, nur `job_config.ccr.events[0].data.message.content` ändern, gleiche UUID): Schritte 1/6–8 laut Spec-Abschnitt „Cloud-Aufgabe“ – vorige Ausgabe mit `git fetch origin ausgabe` + `git show origin/ausgabe:ausgabe.json > ausgabe.json`; Abbruch, wenn deren Datum heute ist; Veröffentlichen per `git worktree add /tmp/ausgabe origin/ausgabe`, Datei kopieren, `git -C /tmp/ausgabe status --porcelain` darf nur `ausgabe.json` zeigen, Commit `Add issue No. <n>`, `git -C /tmp/ausgabe push origin HEAD:ausgabe`; „Nie auf main pushen, in der main-Arbeitskopie nichts committen.“ Danach `RemoteTrigger get` und den neuen Prompt gegenlesen.
- [ ] **Step 5:** `git push origin main` (Workflow aus Task 1). Lauf mit `gh run watch` bzw. `gh run list --workflow veroeffentlichen.yml` → Job `bauen` grün, `veroeffentlichen` übersprungen; im Protokoll die Dateiliste prüfen.
- [ ] **Step 6:** Peter zusammenfassen, auf OK warten.

### Task 3: Doku

**Files:** Modify `CLAUDE.md` (Abschnitte „Aufbau der Web-App“, „Tägliche Aufgabe (Regeln)“), `docs/superpowers/specs/2026-11-16-web-app-design.md` (Abschnitt „Tägliche Aufgabe“: ein Satz mit Verweis auf das neue Design), `Progress.md`.

- [ ] **Step 1:** `CLAUDE.md`: `.github/workflows/veroeffentlichen.yml` in den Aufbau; Regel „Die tägliche Aufgabe ändert nur `ausgabe.json` und pusht nur auf den Branch `ausgabe`“; „Push nur, wenn …“ entsprechend; „Neue App-Dateien in `DATEIEN` im Workflow und in `HUELLE` in `sw.js` eintragen“. Datei unter 200 Zeilen.
- [ ] **Step 2:** Web-App-Spec und `Progress.md` nachziehen (Stand, offene Lücke „keine Sperre auf main“, nächster Schritt).
- [ ] **Step 3:** `node --test "tests/*.test.*"` grün, Commit `Document publishing workflow`, `git push`.

### Task 4: Erster Lauf nach der Umstellung prüfen (18.11.2026)

- [ ] **Step 1:** `RemoteTrigger list_runs`/`get_run_log`: neuer Commit auf `ausgabe`, kein neuer Commit der Aufgabe auf `main` (`git log origin/main --since=...`). Pushverbot auf `ausgabe` oder Push auf `main` → Peter melden.
- [ ] **Step 2:** Zeitgesteuerter Workflow-Lauf nach dem Commit grün, Protokoll zeigt die neue Nummer („OK: Ausgabe Nr. …“).
- [ ] **Step 3:** `Progress.md` nachtragen, Commit `Note first run on ausgabe branch`, Push. Peter berichten.
