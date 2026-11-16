# Veröffentlichung über GitHub Actions – Design

Stand: 16.11.2026 · Grundlage: Sicherheits-Audit vom 16.11.2026, Funde 1 und 4

## Warum

Daily News soll über GitHub Pages öffentlich werden. Ab dann gilt:

- Jeden Morgen schreibt eine Cloud-Aufgabe ohne menschliche Kontrolle die Ausgabe. Sie liest dafür fremde Webseiten. Eine präparierte Seite könnte versuchen, sie zu manipulieren. Bisher steht die Regel „nur `ausgabe.json` ändern“ nur in ihrem Prompt, sie wird also von genau dem Modell geprüft, das manipuliert werden könnte (Fund 1).
- Würde Pages direkt aus `main` veröffentlichen, wären auch `CLAUDE.md`, `Progress.md`, `docs/`, `tests/` und `entwuerfe/` öffentlich abrufbar (Fund 4).

## Ziele

- Online geht nur eine feste Liste von App-Dateien.
- Von der Cloud-Aufgabe gelangt ausschließlich `ausgabe.json` auf die Seite, und nur, wenn sie die Prüfung besteht. Das wird durch festen Code im Workflow erzwungen, nicht durch den Prompt.
- Schlägt Prüfung oder Test fehl, bleibt die bisherige Seite unverändert online, und GitHub meldet den Fehler per Mail.

## Nicht-Ziele

- Keine inhaltliche Prüfung der Meldungen (Falschmeldungen, Linkziele). Das bleibt Fund 2 und ist getrennt zu entscheiden.
- Kein eigenes Hosting, keine eigene Domain.
- Kein Einschalten von Pages in diesem Schritt. Das passiert erst mit der Veröffentlichung nach Schritt 0 (Impressum, Datenschutz, CoinGecko).

## Anti-Ziele

- Die Seite darf durch einen Fehler der Cloud-Aufgabe nie leer oder kaputt online gehen.
- Kein stilles Überspringen: Jeder Fehler muss als fehlgeschlagener Workflow-Lauf sichtbar sein.

## Ansätze

- **A – Eigener Branch `ausgabe` (gewählt von Peter):** Die Cloud-Aufgabe pusht nur noch auf den Branch `ausgabe`, der nur `ausgabe.json` enthält. Der Workflow auf `main` nimmt alle App-Dateien aus `main` und von `ausgabe` ausschließlich `ausgabe.json`. Was die Aufgabe sonst auf `ausgabe` ablegt, wird nie veröffentlicht. Nachteil: Die Ausgabe erscheint nicht sofort, weil der Workflow zeitgesteuert läuft und GitHub solche Läufe verspätet starten kann. Außerdem liegt die aktuelle Ausgabe nicht mehr auf `main`.
- **B – Alles auf `main`, Prüfung beim Veröffentlichen:** Veröffentlicht nur die App-Dateien und prüft `ausgabe.json`. Programmänderungen der Aufgabe würden aber mitveröffentlicht, weil der Workflow ihre Pushes nicht von Peters unterscheiden kann. Löst Fund 4 vollständig, Fund 1 nur teilweise. Verworfen.

**Bewusst offene Lücke (Entscheidung Peter, 16.11.2026: vorerst keine Sperre):** Die Cloud-Aufgabe pusht vermutlich mit Peters Rechten. Eine manipulierte Aufgabe könnte daher direkt auf `main` pushen, und der Workflow würde das veröffentlichen. Mögliche spätere Abhilfe: eine Regel auf `main`, die Pushes nur über einen SSH-Schlüssel auf Peters Laptop erlaubt. Ob das die Aufgabe wirklich ausschließt, zeigt die Kennung, unter der sie pusht (erster Lauf am 17.11.2026).

## Aufbau

### Branch `ausgabe`

- Er enthält nur die Datei `ausgabe.json` und wird ohne gemeinsame Historie mit `main` angelegt (orphan).
- Zum Start erhält er die zum Umstellungszeitpunkt aktuelle `ausgabe.json` von `main`. Hat die Cloud-Aufgabe bis dahin noch auf `main` gepusht, ist das die neueste Ausgabe.
- `ausgabe.json` auf `main` wird danach nicht mehr täglich aktualisiert. Sie bleibt als Beispiel für Tests und den lokalen Server.

### Workflow `.github/workflows/veroeffentlichen.yml`

- **Auslöser:** Push auf `main`, manuell (`workflow_dispatch`) und zeitgesteuert um 4:50, 5:50 und 6:50 UTC. Die Cloud-Aufgabe läuft um 6:40 Uhr Wiener Zeit, also um 5:40 UTC im Winter und 4:40 UTC im Sommer. Die Ausgabe ist damit im Winter etwa um 6:50 bis 7:50 Uhr online, im Sommer ab etwa 6:50 Uhr, verspätete Starts von GitHub nicht eingerechnet. Ein zusätzlicher Lauf fängt eine länger laufende Aufgabe ab. Zeitgesteuerte Läufe nutzen immer die Workflow-Datei von `main`.
- **Rechte:** `contents: read`, `pages: write`, `id-token: write`. `concurrency`-Gruppe `pages`, laufende Veröffentlichungen werden nicht abgebrochen.
- **Job `bauen`** (immer):
  1. Checkout von `main` ohne gespeicherte Zugangsdaten (`persist-credentials: false`).
  2. Node 24 einrichten, dann `node --test "tests/*.test.*"` ausführen.
  3. `git fetch --depth 1 origin ausgabe` und `git show FETCH_HEAD:ausgabe.json` nach `_site/ausgabe.json`. Fehlt der Branch oder die Datei, schlägt der Lauf fehl. Auf `main` wird nicht stillschweigend zurückgegriffen.
  4. `node tests/pruefe-ausgabe.mjs _site/ausgabe.json` muss „OK“ melden.
  5. Feste Liste nach `_site/` kopieren: `index.html`, `style.css`, `app.js`, `render.js`, `format.js`, `kurse.js`, `sw.js`, `manifest.webmanifest`, `fonts/` (inkl. `OFL.txt`) sowie `icons/icon-192.png`, `icons/icon-512.png` und `icons/apple-touch-icon.png`. Nicht dabei: `icons/symbol.html` und alles andere.
  6. Pages-Artefakt aus `_site/` hochladen.
- **Job `veroeffentlichen`:** braucht `bauen`, Umgebung `github-pages`, Bereitstellung über die offizielle Pages-Aktion. Er läuft nur, wenn die Repository-Variable `VEROEFFENTLICHEN` den Wert `true` hat. Bis Peter Pages einschaltet und die Variable setzt, prüft der Workflow also nur und veröffentlicht nichts, und es entstehen keine Fehlschläge wegen eines fehlenden Pages-Zugangs.
- **Fremde Aktionen** (`actions/checkout`, `actions/setup-node`, `actions/upload-pages-artifact`, `actions/deploy-pages`) werden auf einen festen Commit-Hash gepinnt, die Version steht als Kommentar daneben.

### Cloud-Aufgabe „Daily News täglich“

Der Prompt wird angepasst, Zeitplan, Modell und Werkzeuge bleiben gleich:

1. `git fetch origin ausgabe` und die vorige Ausgabe mit `git show origin/ausgabe:ausgabe.json` in die Arbeitskopie holen. Sie bestimmt Nummer, Datum und Struktur.
2. Recherche, Schreiben und Prüfen wie bisher, mit dem Prüfprogramm von `main`.
3. Veröffentlichen: Den Branch `ausgabe` in einem eigenen Arbeitsverzeichnis auschecken (`git worktree add`), dort nur `ausgabe.json` ersetzen, prüfen, dass `git status --porcelain` ausschließlich `ausgabe.json` zeigt, mit `Add issue No. <nummer>` committen und `git push origin HEAD:ausgabe` ausführen.
4. Nie auf `main` pushen und in der `main`-Arbeitskopie nichts committen.

### Doku

- `CLAUDE.md`: Regeln „Tägliche Aufgabe“ und Aufbau anpassen. Die Aufgabe schreibt nur `ausgabe.json` auf den Branch `ausgabe`. Der Workflow veröffentlicht. Die Liste der veröffentlichten Dateien steht im Workflow, und neue App-Dateien müssen dort ergänzt werden (wie `CACHE` in `sw.js`).
- Design-Dokument Web-App, Abschnitt „Tägliche Aufgabe“: Verweis auf dieses Dokument.
- `Progress.md`: Stand nachtragen.

## Reihenfolge der Umstellung

1. Erst nach dem ersten Lauf der Cloud-Aufgabe am 17.11.2026, der noch nach altem Prompt auf `main` pusht: dessen Ergebnis und die Kennung prüfen, unter der gepusht wurde.
2. In einem Zug, damit die Aufgabe nicht dazwischen läuft: Branch `ausgabe` aus der dann aktuellen `ausgabe.json` von `main` (Nr. 5) anlegen und pushen, Prompt der Cloud-Aufgabe umstellen (über die Routine-Schnittstelle) und Workflow auf `main` committen und pushen. Mit `VEROEFFENTLICHEN` ungesetzt prüft er nur. Der Lauf durch den Push muss grün sein.
3. Doku anpassen.
4. Nächsten Lauf der Cloud-Aufgabe prüfen: Commit nur auf `ausgabe`, Workflow-Lauf um 4:50, 5:50 oder 6:50 UTC grün. Darf die Cloud-Umgebung nicht auf `ausgabe` pushen, wird das hier sichtbar, und der Prompt bzw. die Umgebung muss angepasst werden.
5. Später, mit der Veröffentlichung: Pages auf „GitHub Actions“ stellen, `VEROEFFENTLICHEN=true` setzen, „Enforce HTTPS“ aktivieren. Das macht Peter oder Claude mit Peters ausdrücklichem OK.

## Erfolgskriterien

- Workflow-Lauf grün: Tests bestanden, `ausgabe.json` von `ausgabe` geprüft, Artefakt enthält genau die Dateien der Liste (im Lauf-Protokoll aufgelistet).
- Gegenprobe lokal mit denselben Befehlen wie im Workflow: Eine absichtlich ungültige `ausgabe.json` lässt die Prüfung scheitern. Eine Datei außerhalb der Liste landet nicht in `_site/`. (Entscheidung Claude: Der Workflow erhält keinen Eingabeparameter für einen anderen Quell-Branch, damit nie eine Testausgabe veröffentlicht werden kann.)
- Nächster Lauf der Cloud-Aufgabe: neuer Commit nur auf `ausgabe`, `main` unverändert.

## Dem Bauenden überlassen

- Genaue Shell-Befehle im Workflow und im Prompt.
