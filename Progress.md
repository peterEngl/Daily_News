# Fortschritt und aktueller Stand

Wechselnde Angaben zum Projekt. Dauerhafte Regeln stehen in `CLAUDE.md`; diese Datei wird dort mit `@Progress.md` automatisch mitgeladen.

Stand: 18.11.2026

## Ãœberblick

- Die Zeitung ist als Web-App (installierbar, offline lesbar) fertig und am 16.11.2026 in `main` zusammengefÃ¼hrt (Fast-Forward von `web-app`) und auf GitHub hochgeladen, aber noch nicht verÃ¶ffentlicht.
- Die bisherige Einzelseite (Ausgabe Nr. 4 vom 16.11.2026) ist weiterhin als Claude-Artifact online: https://claude.ai/artifact/38Kd4T6QJQ9Ns1QDh3rjF4
- Die alten DesignentwÃ¼rfe (Klassik, Boulevard, Terminal, Magazin) liegen als Referenz in `entwuerfe/` und unter https://claude.ai/artifact/QWtjUKo1EQibNzCEWkQbfh. Die Design-Umschaltung ist seit 16.11.2026 entfernt.
- Die geplante Cloud-Aufgabe â€žDaily News tÃ¤glichâ€œ ist am 16.11.2026 neu angelegt: https://claude.ai/code/routines/trig_012ZGJAkBG178t8AK6sC7PLs â€“ tÃ¤glich 6:40 Uhr Wiener Zeit (`CRON_TZ=Europe/Vienna 40 6 * * *`, gilt auch in der Sommerzeit), Modell Sonnet 5.5, keine Konnektoren, schreibt nur `ausgabe.json` und pusht auf `main` nur bei â€žOKâ€œ. Erster Lauf am 17.11.2026 steht aus (prÃ¼fen, ob der Push auf `main` durchgeht).

## Web-App (Ziel 2)

- Design-Dokument: `docs/superpowers/specs/2026-11-16-web-app-design.md` (von Peter freigegeben, inkl. Abschnitt â€žSicherheitâ€œ)
- Umsetzungsplan: `docs/superpowers/plans/2026-11-16-web-app.md` (7 Tasks, wird von Claude selbst in der Sitzung umgesetzt, nicht mit Subagenten)
- Nach jedem Task kurz zusammenfassen und auf Peters OK warten.

| Task | Inhalt | Ergebnis |
|---|---|---|
| 1 | PrÃ¼fprogramm `tests/pruefe-ausgabe.mjs` | 12 Tests grÃ¼n |
| 2 | `format.js`: Wiener Zeit, Datum, Zahlen, Hinweistexte | 11 Tests grÃ¼n |
| 3 | `ausgabe.json` mit Ausgabe Nr. 4 | PrÃ¼fung â€žOKâ€œ, alle 73 Texte wortgleich mit der alten Seite |
| 4 | App-HÃ¼lle: `index.html`, `style.css`, `render.js`, `app.js`, `fonts/`, `tests/server.py` | sieht aus wie die alte Seite (hell/dunkel, Handy); CSP, XSS-, Leer-Ressort- und Ladefehler-Probe bestanden |
| 5 | Live-Kurse: `kurse.js`, `tests/kurse.test.js`, Einbindung in `app.js` | 35 Tests grÃ¼n; im Browser: Live-Kurse, neue Abfrage nach 60 s, Netzfehler zeigt â€žderzeit keine Verbindungâ€œ mit stehenden Werten |
| 6 | Installierbar und offline: `manifest.webmanifest`, `sw.js`, `icons/`, Einbindung in `index.html` und `app.js` | Service Worker aktiv, HÃ¼lle und Ausgabe im Speicher, Offline-Start zeigt gespeicherte Ausgabe; am 16.11.2026 von Peter abgenommen (App installiert, Offline-Hinweis erscheint) |
| 7 | AufrÃ¤umen und Doku | erledigt: alte Tests `tests/pruefe-index.ps1` und `tests/ausgabe-4-links.txt` entfernt, `CLAUDE.md` neu gegliedert, committet und gepusht |

Der Umsetzungsplan ist damit vollstÃ¤ndig abgearbeitet.

## VerÃ¶ffentlichung (Sicherheits-Audit vom 16.11.2026)

- Audit-Ergebnis: App-Code in Ordnung (kein XSS, CSP, Service Worker, CoinGecko-PrÃ¼fung), keine Geheimnisse in der Historie. Funde: (1) Cloud-Aufgabe kÃ¶nnte andere Dateien als `ausgabe.json` live bringen, (2) Links kÃ¶nnen auf beliebige Seiten zeigen (offen, getrennt zu entscheiden), (3) private iCloud-Adresse in 28 alten Commits, (4) Pages wÃ¼rde das ganze Repository verÃ¶ffentlichen, (5) `.gitignore` fehlte (erledigt), (6) Einbetten in fremde Seiten nicht verhinderbar (akzeptiert).
- Repository seit 16.11.2026 **Ã¶ffentlich** (Peter). Neue Commits in diesem Repository nutzen die GitHub-noreply-Adresse (repo-lokale `git config`); alte Commits unverÃ¤ndert, Umschreiben nur mit Peters OK.
- Funde 1 und 4: Design `docs/superpowers/specs/2026-11-16-veroeffentlichung-design.md` und Plan `docs/superpowers/plans/2026-11-16-veroeffentlichung.md` (4 Tasks) von Peter freigegeben. Umsetzung durch Claude selbst in der Sitzung, nach jedem Task auf Peters OK warten. Bewusst offen: keine Sperre auf `main` (Peter, 16.11.2026).

## Als NÃ¤chstes

- Task 1 des VerÃ¶ffentlichungs-Plans erledigt und von Peter abgenommen (16.11.2026): Workflow `.github/workflows/veroeffentlichen.yml` und `tests/veroeffentlichen.test.mjs` als Commit `Add publishing workflow` nur lokal auf Branch `veroeffentlichung` (nicht gepusht), 38 Tests grÃ¼n, lokale Gegenprobe bestanden. Aktionen gepinnt: checkout v7.0.1, setup-node v7.1.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1.
- Erster Lauf am 17.11.2026 geprÃ¼ft (Task 2, Step 1â€“2): Ausgabe Nr. 5 als `5315bb6` auf `main`, nur `ausgabe.json`, Kennung `Claude noreply@anthropic.com`, PrÃ¼fung â€žOKâ€œ. Aber: Die Cloud-Umgebung `env_01CkuaEBf7cMRh5pM32o6aGY` sperrte das Ã–ffnen von Artikeln (WebFetch), Inhalte stÃ¼tzen sich nur auf Suchergebnisse; Ausgabe Nr. 5 inhaltlich ungeprÃ¼ft.
- Peter (17.11.2026): voller Netzzugang fÃ¼r die Umgebung vorerst zurÃ¼ckgestellt, Netzzugang bleibt eingeschrÃ¤nkt. VerschÃ¤rfung des Auftrags (jede Quelle mit WebFetch Ã¶ffnen, sonst weglassen; gesperrte Adressen nennen) am selben Tag wieder zurÃ¼ckgenommen, weil sie bei gesperrtem Netz fast leere Ausgaben ergÃ¤be. Auftrag ist wieder wie am 16.11.2026; Ausgaben bleiben bis zur Netzfreigabe inhaltlich ungeprÃ¼ft (nur Suchergebnisse).
- Task 2 Step 3â€“5 am 17.11.2026 erledigt: Branch `ausgabe` (orphan, nur `ausgabe.json` Nr. 5, Commit `2b0b4f3`) gepusht; Auftrag der Routine umgestellt (vorige Ausgabe von `origin/ausgabe`, Push nur per Worktree `/tmp/ausgabe` mit `git push origin HEAD:ausgabe`, nie auf `main`), gegengelesen; Workflow per Cherry-Pick als `374d2fa` auf `main` gepusht, 38 Tests grÃ¼n, Lauf 44040928652: `bauen` grÃ¼n (â€žOK: Ausgabe Nr. 5â€œ, 15 Dateien in `_site/` laut Liste), `veroeffentlichen` Ã¼bersprungen.
- Task 3 (Doku) am 17.11.2026 erledigt: `CLAUDE.md` (Aufbau, Regeln der tÃ¤glichen Aufgabe) und Web-App-Spec (Verweis auf das VerÃ¶ffentlichungs-Design) angepasst. Weiterhin bewusst offen: keine Sperre auf `main`.
- **VerÃ¶ffentlicht am 17.11.2026** (Peter, bewusst vor Zwei-Faktor-Anmeldung, App-ZugriffsprÃ¼fung und Task 4): Pages mit Quelle â€žGitHub Actionsâ€œ, `VEROEFFENTLICHEN=true`, HTTPS erzwungen; Lauf 44042022447 grÃ¼n (`bauen` und `veroeffentlichen`). https://peterengl.github.io/Daily_News/ zeigt Ausgabe Nr. 5, Service Worker aktiv, Dateien auÃŸerhalb der Liste liefern 404, HTTP leitet auf HTTPS um.
- Handy-Test am 17./18.11.2026 von Peter bestanden (â€žWeb App funktioniert am Handyâ€œ).
- Task 4 am 18.11.2026: Lauf hat Ausgabe Nr. 6 als `f00273a` auf `ausgabe` gepusht (Push auf `ausgabe` erlaubt), `main` unverÃ¤ndert. Workflow-Lauf 44314350720 grÃ¼n, â€žOK: Ausgabe Nr. 6â€œ, live. Zwei AuffÃ¤lligkeiten: (1) Von den Zeitplan-LÃ¤ufen 4:50/5:50/6:50 UTC kam nur einer, und erst um 13:30 UTC â€“ Nr. 6 war erst ab ca. 14:30 Uhr online. (2) Ein Stop-Hook der Cloud-Umgebung verlangte, die geÃ¤nderte `ausgabe.json` in der `main`-Arbeitskopie zu committen und zu pushen; die Aufgabe lehnte richtig ab und setzte die Datei zurÃ¼ck. Weiterhin nur Suchergebnisse (WebFetch gesperrt).
- **Als NÃ¤chstes:** Zwei-Faktor-Anmeldung und Zugriff der Claude-GitHub-App (nur dieses Repository) prÃ¼fen; Zeitplan des Workflows am 19.11. beobachten; Auftrag um AufrÃ¤umschritt ergÃ¤nzen (siehe AuffÃ¤lligkeit 2, Peters OK ausstehend).
- Entschieden von Peter am 16.11.2026: Impressum vorerst nicht nÃ¶tig (private Nutzung in der Familie, Seite trotzdem Ã¶ffentlich); Kurse live direkt von CoinGecko; Datenschutzhinweis in der FuÃŸzeile.

## Offene Punkte

- Fund 2 (Linkziele) und Fund 3 (alte Commits mit iCloud-Adresse) noch zu entscheiden.

## Entscheidungen wÃ¤hrend der Umsetzung

- Keine Bilder zu den Meldungen (Peter, 16.11.2026): Fotos aus Quellen sind urheberrechtlich geschÃ¼tzt, eigene Grafiken bewusst verworfen.
- Testbefehl mit Dateimuster statt Ordner (`node --test tests/` geht seit Node 21 nicht).
- ZusÃ¤tzliche PrÃ¼fungen im PrÃ¼fprogramm: `javascript:`-Links, leere Texte, Liste statt Objekt.
- Wochentage und Monate als feste deutsche Listen (einheitlich â€žDiâ€œ statt â€žDi.â€œ).
- Weitergaben wie â€žBloomberg, nach AI Weeklyâ€œ stehen im Quellennamen. Dadurch entfallen in Ausgabe 4 zwei Zweitlinks (FT-Original, AI Weekly).
- Schriften stammen von fontsource Ã¼ber jsDelivr (Sans) bzw. unpkg (Serif), weil jsDelivr zeitweise mit 503 antwortete. Format geprÃ¼ft.
- `app.js` zeigt die Ausgabe an, ohne auf das Speichern der Offline-Kopie zu warten. Vorher blieb die Seite in einem frischen Browser auf â€žWird geladen â€¦â€œ hÃ¤ngen.
- â€žRedaktionsschluss 06:50 Uhrâ€œ ohne â€žMEZâ€œ, FuÃŸzeile â€žWiener Ortszeitâ€œ, weil im Sommer MESZ gilt.
- Bei HTTP-Fehler mit vorhandener Kopie lautet der Hinweis ebenfalls â€žOffline â€“ gespeicherte Ausgabeâ€œ.
- `localStorage` (`daily-news-kurse`) enthÃ¤lt die rohe CoinGecko-Antwort; beim Start lÃ¤uft sie durch `leseKurse`, also dieselbe PrÃ¼fung wie frische Daten.
- Kursabruf mit `credentials: 'omit'` (keine Cookies an CoinGecko).
- Symbole: Edge headless rendert nicht unter einer MindestfenstergrÃ¶ÃŸe. Deshalb nur `icon-512.png` mit Edge erzeugen, 192 und 180 daraus mit System.Drawing (bikubisch) verkleinern.
- Schrift im Symbol 51vmin (BuchstabenhÃ¶he ca. 33 % statt ca. 40 %), damit â€žDNâ€œ ganz im Sicherheitskreis maskierbarer Symbole (80 % Durchmesser) liegt; per PixelprÃ¼fung bestÃ¤tigt.

Das ausfÃ¼hrliche Protokoll liegt lokal in `.superpowers/sdd/2026-11-16-web-app/progress.md` (nicht im Repository).
