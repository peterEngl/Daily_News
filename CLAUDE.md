# Daily News

Tägliche Zeitung zu den Themen KI, Games und Krypto, auf Deutsch.
Der Name ist „Daily News".

## Arbeitsweise (gilt immer)

- Antworte auf Deutsch. Bei englischsprachigen Inhalten frage zuerst, ob der Output englisch bleiben oder auf Deutsch erstellt werden soll.
- Erkläre vor jedem Schritt kurz, was du tun wirst und warum. Bei mehreren Schritten nenne zuerst den Plan in wenigen Punkten, dann setze ihn um.
- Lösche nie Dateien oder Ordner ohne ausdrückliche Bestätigung. Nenne vorher genau, welche Dateien betroffen sind, und warte auf das OK. Das gilt auch für Befehle, die Dateien überschreiben oder unwiderruflich verändern.
- Wähle die einfachste Lösung, die das Problem zuverlässig löst. Keine unnötigen Abstraktionen, Abhängigkeiten oder Zusatzfunktionen. Ist eine komplexere Lösung deutlich besser, schlage sie vor und erkläre kurz den Vorteil, statt sie direkt umzusetzen.
- Arbeitsumgebung: Windows-Laptop. Befehle also für Windows schreiben (PowerShell), nicht für Linux oder macOS.

## Stand (16.11.2026)

- Die Zeitung ist bisher eine einzelne HTML-Seite, veröffentlicht als Claude-Artifact: https://claude.ai/artifact/38Kd4T6QJQ9Ns1QDh3rjF4
- Der Seitentitel heißt „Daily News".
- Die geplante Aufgabe „Daily News täglich" (claude.ai, täglich 6:40 Uhr Wiener Zeit) wurde am 16.11.2026 gelöscht und muss neu angelegt werden. Vorlage für Aufbau und Design ist die lokale `index.html`.
- Design (seit 16.11.2026): ein einziges Design, orientiert am Stil von derstandard.at, aber ohne dessen Logo, Name, Hausschrift oder Markenfarbe. Hellgrauer Hintergrund, helle Kacheln, Schrift „Source Sans 3", Titel in „Source Serif 4", Akzentfarbe `#b3122b`, Dunkelmodus nach Systemeinstellung. Die Kurstafel steht als Laufband oben, die Termine als Seitenspalte neben dem Aufmacher. Die Design-Umschaltung und die Varianten Klassik, Boulevard, Terminal und Magazin sind entfernt; die alten Entwürfe liegen nur noch als Referenz in `entwuerfe/` und unter https://claude.ai/artifact/QWtjUKo1EQibNzCEWkQbfh.
- Ordnerinhalt: `CLAUDE.md`, `index.html` (Momentaufnahme der Ausgabe Nr. 4 vom 16.11.2026, ein eigenständiges HTML-Dokument, lokal im Browser lauffähig), `entwuerfe/` (die drei Designentwürfe als `.dc.html`, nur Referenz; sie lassen sich nur in Claude Design anzeigen, nicht lokal), `tests/` (Inhaltstest `pruefe-index.ps1` mit der Linkliste der Ausgabe Nr. 4; gilt nur für diese Momentaufnahme und muss bei einer neuen Ausgabe angepasst werden) und `docs/superpowers/` (Design-Dokument und Umsetzungsplan zum neuen Design).
- Der Ordner ist ein Git-Repository, Branch `main`, verbunden mit GitHub: https://github.com/peterEngl/Daily_News (Remote `origin`). Hochladen mit `git push`. Die GitHub-CLI (`gh`) ist installiert (`C:\Program Files\GitHub CLI\gh.exe`); Anmeldung mit `gh auth login`.
- Die Online-Seite (Artifact) zeigt seit 16.11.2026 das neue Design (Ausgabe Nr. 4, veröffentlicht aus der lokalen `index.html`).
- Inhaltstest: `powershell -NoProfile -ExecutionPolicy Bypass -File tests\pruefe-index.ps1` (muss „OK" melden).

## Ziele

1. Das Design überarbeiten (erledigt am 16.11.2026: neues Einzel-Design, siehe „Stand").
2. Eine Web-App daraus machen.
3. Den Umfang der News vergrößern.

## Aufbau der Ausgabe

- Kopf mit Titel, Datum und Ausgabennummer
- Kurstafel als Streifen unter dem Kopf: Bitcoin, Ether, BNB, XRP mit Kurs in USD und Veränderung in 24 Stunden
- Aufmacher (wichtigste Meldung des Tages), daneben als Seitenspalte „Was diese Woche ansteht": Termine der kommenden Tage in Wiener Zeit
- Drei Ressorts: KI, Games, Krypto, je mit einem Hauptartikel, weiteren Artikeln und Kurzmeldungen

## Regeln für Inhalte

- Meldungen in eigenen Worten zusammenfassen, keine wörtlichen Übernahmen. Zu jeder Meldung ein Quellenlink.
- Nur aufnehmen, was in einer Quelle belegt ist. Nichts erfinden. Gibt es zu einem Ressort nichts Belegbares, das so kennzeichnen.
- Kurse sind Momentaufnahmen: Zeitpunkt und Quelle nennen und „Keine Anlageberatung" stehen lassen.
- Zeiten in Wiener Ortszeit (MEZ/MESZ).
