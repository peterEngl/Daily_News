# Fortschritt: Daily News als Web-App

Stand: 16.11.2026 · Branch `web-app` (auf GitHub hochgeladen)

- Design-Dokument: `docs/superpowers/specs/2026-11-16-web-app-design.md` (von Peter freigegeben, inkl. Abschnitt „Sicherheit“)
- Umsetzungsplan: `docs/superpowers/plans/2026-11-16-web-app.md` (7 Tasks, wird von Claude selbst in der Sitzung umgesetzt, nicht mit Subagenten)
- Arbeitsweise: Nach jedem Task kurz zusammenfassen und auf Peters OK warten (`CLAUDE.md`). Commit-Nachrichten auf Englisch, eine Zeile.

## Erledigt

| Task | Inhalt | Ergebnis |
|---|---|---|
| 1 | Prüfprogramm `tests/pruefe-ausgabe.mjs` | 12 Tests grün |
| 2 | `format.js`: Wiener Zeit, Datum, Zahlen, Hinweistexte | 11 Tests grün |
| 3 | `ausgabe.json` mit Ausgabe Nr. 4 | Prüfung „OK“, alle 73 Texte wortgleich mit der alten Seite |
| 4 | App-Hülle: `index.html`, `style.css`, `render.js`, `app.js`, `fonts/`, `tests/server.py` | sieht aus wie die alte Seite (hell/dunkel, Handy); CSP, XSS-, Leer-Ressort- und Ladefehler-Probe bestanden |

## Als Nächstes

- **Task 5: Live-Kurse** (`kurse.js`, `tests/kurse.test.js`, Einbindung in `app.js`). Details im Plan. Wichtig aus Task 4: Die Zeilen der Kurstafel brauchen `role="row"` und die Zellen `role="cell"`, wie in der alten Seite, weil das CSS die Tabelle als Kacheln darstellt.
- Task 6: Manifest, Symbole, Service Worker. Danach testet Peter die App lokal.
- Task 7: Aufräumen (alte Tests `tests/pruefe-index.ps1` und `tests/ausgabe-4-links.txt` nur nach Peters OK löschen), `CLAUDE.md` auf Web-App-Stand bringen.
- Danach, nicht Teil des Plans: tägliche Aufgabe anlegen; Veröffentlichung mit Schritt 0 (Impressum/Datenschutz/CoinGecko) und Sicherheitsschritten.

## Befehle (PowerShell, im Projektordner)

- Alle Tests: `node --test "tests/*.test.*"` (nicht `node --test tests/`, das geht seit Node 21 nicht)
- Ausgabe prüfen: `node tests\pruefe-ausgabe.mjs` (muss „OK“ melden)
- App lokal starten: `python tests\server.py`, dann `http://localhost:8000/`

## Offene Punkte

- **Node-Update** von 24.19.0 auf 26.13.1 (winget, `OpenJS.NodeJS.LTS`) wurde gestartet und wartet auf Peters Bestätigung der Windows-Administratorabfrage. Danach `node --version` prüfen und die Tests erneut laufen lassen.

## Entscheidungen während der Umsetzung

- Testbefehl mit Dateimuster statt Ordner (siehe oben).
- Zusätzliche Prüfungen im Prüfprogramm: `javascript:`-Links, leere Texte, Liste statt Objekt.
- Wochentage und Monate als feste deutsche Listen (einheitlich „Di“ statt „Di.“).
- Weitergaben wie „Bloomberg, nach AI Weekly“ stehen im Quellennamen. Dadurch entfallen in Ausgabe 4 zwei Zweitlinks (FT-Original, AI Weekly).
- Schriften stammen von fontsource über jsDelivr (Sans) bzw. unpkg (Serif), weil jsDelivr zeitweise mit 503 antwortete. Format geprüft.
- `app.js` zeigt die Ausgabe an, ohne auf das Speichern der Offline-Kopie zu warten. Vorher blieb die Seite in einem frischen Browser auf „Wird geladen …“ hängen.
- „Redaktionsschluss 06:50 Uhr“ ohne „MEZ“, Fußzeile „Wiener Ortszeit“, weil im Sommer MESZ gilt.
- Bei HTTP-Fehler mit vorhandener Kopie lautet der Hinweis ebenfalls „Offline – gespeicherte Ausgabe“.

Das ausführliche Protokoll liegt lokal in `.superpowers/sdd/2026-11-16-web-app/progress.md` (nicht im Repository).
