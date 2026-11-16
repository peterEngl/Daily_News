# Fortschritt und aktueller Stand

Wechselnde Angaben zum Projekt. Dauerhafte Regeln stehen in `CLAUDE.md`; diese Datei wird dort mit `@Progress.md` automatisch mitgeladen.

Stand: 16.11.2026

## Überblick

- Die Zeitung ist als Web-App (installierbar, offline lesbar) fertig und am 16.11.2026 in `main` zusammengeführt (Fast-Forward von `web-app`) und auf GitHub hochgeladen, aber noch nicht veröffentlicht.
- Die bisherige Einzelseite (Ausgabe Nr. 4 vom 16.11.2026) ist weiterhin als Claude-Artifact online: https://claude.ai/artifact/38Kd4T6QJQ9Ns1QDh3rjF4
- Die alten Designentwürfe (Klassik, Boulevard, Terminal, Magazin) liegen als Referenz in `entwuerfe/` und unter https://claude.ai/artifact/QWtjUKo1EQibNzCEWkQbfh. Die Design-Umschaltung ist seit 16.11.2026 entfernt.
- Die geplante Cloud-Aufgabe „Daily News täglich“ ist am 16.11.2026 neu angelegt: https://claude.ai/code/routines/trig_012ZGJAkBG178t8AK6sC7PLs – täglich 6:40 Uhr Wiener Zeit (`CRON_TZ=Europe/Vienna 40 6 * * *`, gilt auch in der Sommerzeit), Modell Sonnet 5.5, keine Konnektoren, schreibt nur `ausgabe.json` und pusht auf `main` nur bei „OK“. Erster Lauf am 17.11.2026 steht aus (prüfen, ob der Push auf `main` durchgeht).

## Web-App (Ziel 2)

- Design-Dokument: `docs/superpowers/specs/2026-11-16-web-app-design.md` (von Peter freigegeben, inkl. Abschnitt „Sicherheit“)
- Umsetzungsplan: `docs/superpowers/plans/2026-11-16-web-app.md` (7 Tasks, wird von Claude selbst in der Sitzung umgesetzt, nicht mit Subagenten)
- Nach jedem Task kurz zusammenfassen und auf Peters OK warten.

| Task | Inhalt | Ergebnis |
|---|---|---|
| 1 | Prüfprogramm `tests/pruefe-ausgabe.mjs` | 12 Tests grün |
| 2 | `format.js`: Wiener Zeit, Datum, Zahlen, Hinweistexte | 11 Tests grün |
| 3 | `ausgabe.json` mit Ausgabe Nr. 4 | Prüfung „OK“, alle 73 Texte wortgleich mit der alten Seite |
| 4 | App-Hülle: `index.html`, `style.css`, `render.js`, `app.js`, `fonts/`, `tests/server.py` | sieht aus wie die alte Seite (hell/dunkel, Handy); CSP, XSS-, Leer-Ressort- und Ladefehler-Probe bestanden |
| 5 | Live-Kurse: `kurse.js`, `tests/kurse.test.js`, Einbindung in `app.js` | 35 Tests grün; im Browser: Live-Kurse, neue Abfrage nach 60 s, Netzfehler zeigt „derzeit keine Verbindung“ mit stehenden Werten |
| 6 | Installierbar und offline: `manifest.webmanifest`, `sw.js`, `icons/`, Einbindung in `index.html` und `app.js` | Service Worker aktiv, Hülle und Ausgabe im Speicher, Offline-Start zeigt gespeicherte Ausgabe; am 16.11.2026 von Peter abgenommen (App installiert, Offline-Hinweis erscheint) |
| 7 | Aufräumen und Doku | erledigt: alte Tests `tests/pruefe-index.ps1` und `tests/ausgabe-4-links.txt` entfernt, `CLAUDE.md` neu gegliedert, committet und gepusht |

Der Umsetzungsplan ist damit vollständig abgearbeitet.

## Als Nächstes

- Ersten Lauf der täglichen Aufgabe am 17.11.2026 prüfen (Ausgabe Nr. 5 auf `main`, Prüfung „OK“).
- Veröffentlichung (GitHub Pages) mit Schritt 0 (Impressum/Datenschutz/CoinGecko-Entscheidung) und den Sicherheitsschritten (Historie auf Geheimnisse prüfen, Zwei-Faktor-Anmeldung, „Enforce HTTPS“), dann Handy-Test.

## Offene Punkte

- Keine. (Node-Update auf 26.13.1 am 16.11.2026 erledigt; alle 35 Tests und die Ausgabeprüfung laufen damit.)

## Entscheidungen während der Umsetzung

- Testbefehl mit Dateimuster statt Ordner (`node --test tests/` geht seit Node 21 nicht).
- Zusätzliche Prüfungen im Prüfprogramm: `javascript:`-Links, leere Texte, Liste statt Objekt.
- Wochentage und Monate als feste deutsche Listen (einheitlich „Di“ statt „Di.“).
- Weitergaben wie „Bloomberg, nach AI Weekly“ stehen im Quellennamen. Dadurch entfallen in Ausgabe 4 zwei Zweitlinks (FT-Original, AI Weekly).
- Schriften stammen von fontsource über jsDelivr (Sans) bzw. unpkg (Serif), weil jsDelivr zeitweise mit 503 antwortete. Format geprüft.
- `app.js` zeigt die Ausgabe an, ohne auf das Speichern der Offline-Kopie zu warten. Vorher blieb die Seite in einem frischen Browser auf „Wird geladen …“ hängen.
- „Redaktionsschluss 06:50 Uhr“ ohne „MEZ“, Fußzeile „Wiener Ortszeit“, weil im Sommer MESZ gilt.
- Bei HTTP-Fehler mit vorhandener Kopie lautet der Hinweis ebenfalls „Offline – gespeicherte Ausgabe“.
- `localStorage` (`daily-news-kurse`) enthält die rohe CoinGecko-Antwort; beim Start läuft sie durch `leseKurse`, also dieselbe Prüfung wie frische Daten.
- Kursabruf mit `credentials: 'omit'` (keine Cookies an CoinGecko).
- Symbole: Edge headless rendert nicht unter einer Mindestfenstergröße. Deshalb nur `icon-512.png` mit Edge erzeugen, 192 und 180 daraus mit System.Drawing (bikubisch) verkleinern.
- Schrift im Symbol 51vmin (Buchstabenhöhe ca. 33 % statt ca. 40 %), damit „DN“ ganz im Sicherheitskreis maskierbarer Symbole (80 % Durchmesser) liegt; per Pixelprüfung bestätigt.

Das ausführliche Protokoll liegt lokal in `.superpowers/sdd/2026-11-16-web-app/progress.md` (nicht im Repository).
