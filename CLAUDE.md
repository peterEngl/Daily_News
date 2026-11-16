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
- Seitentitel, geplante Aufgabe und Speicherschlüssel der Design-Umschaltung (`daily-news-design`) heißen überall „Daily News".
- Die tägliche Ausgabe wird von einer geplanten Aufgabe in claude.ai erzeugt („Daily News täglich", läuft täglich um 6:40 Uhr Wiener Zeit, damit sie um 7 Uhr fertig ist). Sie recherchiert per Websuche und ersetzt die Inhalte der Seite. Diese Aufgabe läuft nicht lokal.
- Drei Designvarianten liegen als Claude-Design-Leinwand vor: https://claude.ai/artifact/QWtjUKo1EQibNzCEWkQbfh
  - A · Boulevard: plakativ, roter Kopf, gelbe Hinweisbalken
  - B · Terminal: dunkel, Monospace, Kurs-Kacheln
  - C · Magazin: hell, Karten, eine Farbe je Ressort
- Die Seite hat bereits eine Design-Umschaltung: Klassik, Boulevard, Terminal, Magazin. Es ist noch keine Variante als Standard gewählt.
- Ordnerinhalt: `CLAUDE.md`, `index.html` (Momentaufnahme der Ausgabe Nr. 4 vom 16.11.2026, ein eigenständiges HTML-Dokument, lokal im Browser lauffähig) und `entwuerfe/` (die drei Designentwürfe als `.dc.html`, nur Referenz; sie lassen sich nur in Claude Design anzeigen, nicht lokal).
- Der Ordner ist ein Git-Repository, Branch `main`, verbunden mit GitHub: https://github.com/peterEngl/Daily_News (Remote `origin`). Hochladen mit `git push`. Die GitHub-CLI (`gh`) ist installiert (`C:\Program Files\GitHub CLI\gh.exe`); Anmeldung mit `gh auth login`.
- Die Online-Seite wird täglich von der geplanten Aufgabe überschrieben. Die lokale `index.html` ändert sich dadurch nicht und ist nur eine Kopie.

## Ziele

1. Das Design überarbeiten (die Umschaltung zwischen den Varianten ist umgesetzt).
2. Eine Web-App daraus machen.
3. Den Umfang der News vergrößern.

## Aufbau der Ausgabe

- Kopf mit Titel, Datum und Ausgabennummer
- Aufmacher (wichtigste Meldung des Tages)
- Kurstafel: Bitcoin, Ether, BNB, XRP mit Kurs in USD und Veränderung in 24 Stunden
- Drei Ressorts: KI, Games, Krypto, je mit einem Hauptartikel, weiteren Artikeln und Kurzmeldungen
- „Was diese Woche ansteht": Termine der kommenden Tage in Wiener Zeit

## Regeln für Inhalte

- Meldungen in eigenen Worten zusammenfassen, keine wörtlichen Übernahmen. Zu jeder Meldung ein Quellenlink.
- Nur aufnehmen, was in einer Quelle belegt ist. Nichts erfinden. Gibt es zu einem Ressort nichts Belegbares, das so kennzeichnen.
- Kurse sind Momentaufnahmen: Zeitpunkt und Quelle nennen und „Keine Anlageberatung" stehen lassen.
- Zeiten in Wiener Ortszeit (MEZ/MESZ).
