# Neues Design für Daily News (orientiert an derstandard.at)

Stand: 16.11.2026 · Größe: kleine Änderung (eine Seite, ein Design)

## Absicht

Daily News bekommt ein einziges, ruhiges Design im Stil einer modernen Nachrichtenseite, orientiert an derstandard.at. Die Umschaltung und die Varianten Klassik, Boulevard, Terminal und Magazin entfallen. Wenn das neue Design passt, werden sie nicht mehr gebraucht.

## Was vom Vorbild übernommen wird (Stil, nicht Marke)

- Hellgrauer Seitenhintergrund, Inhalte auf helleren Kacheln, fast schwarze Schrift.
- Eine serifenlose Schrift für alles. Fette, eher kleine Überschriften, die Gewichtung entsteht über die Position.
- Dachzeile über jeder Überschrift (vorhandene `kicker`), darunter eine kleine graue Zeile mit der Quelle.
- Dichtes Raster: großer Aufmacher mit schmaler Seitenspalte, darunter Reihen von Teasern.
- Laufband-Streifen oben mit vier Kacheln nebeneinander.
- Kopf: Titel links, darunter Datum als Pille und die Ressorts als Textzeile.

## Was bewusst nicht übernommen wird

Logo, Name, Hausschrift („STMatilda“), Markenfarbe Magenta. Die Seite darf nicht wie ein Ableger von derStandard wirken. Fotos gibt es keine, das Raster ist ein Text-Raster.

## Aufbau (Vorschlag)

```
Daily News                                   Ausgabe Nr. 4
[Mo, 16.11.2026]  KI  Games  Krypto  Termine
┌ KURSE · 06:45 MEZ ─────────────────────────────────────┐
│ Bitcoin 65.030 ▲1,2% │ Ether … │ BNB … │ XRP …          │  ← Kurstafel als Laufband
└ CoinGecko · Keine Anlageberatung ─────────────────────┘
┌ AUFMACHER · KI ─────────────────┐ ┌ DIESE WOCHE ──────┐
│ Große Überschrift                │ │ Di 17.11. …        │  ← Termine als Seitenspalte
│ Vorspann, Text, Quellen          │ │ Mi 18.11. …        │
└──────────────────────────────────┘ └────────────────────┘
KÜNSTLICHE INTELLIGENZ ─────────────────────────────────────
┌ Hauptartikel (breit) ──────────────────────────────────┐
┌ Artikel ┐ ┌ Artikel ┐ ┌ Artikel ┐
┌ Kurz gemeldet (Liste) ─────────────────────────────────┐
GAMES … KRYPTO … (gleich)
Fußzeile
```

Handy: alles einspaltig, das Laufband als 2×2-Kacheln.

## Entscheidungen

- **Weg C (deine Wahl):** nur noch ein Design. Umschaltung, `data-design`-CSS, das Skript mit dem Speicherschlüssel `daily-news-design` und die nicht mehr nötigen Schriften fallen weg.
- **Mein Vorschlag:** Die Kurstafel wird zum Laufband und die Termine wandern in die Seitenspalte neben den Aufmacher. Dadurch stehen die Termine weiter oben als bisher in „Aufbau der Ausgabe“ beschrieben. Die Inhalte bleiben dieselben.
- **Mein Vorschlag:** Schriften „Source Sans 3“ für alles, „Source Serif 4“ nur für den Titel „Daily News“ (Google Fonts). Akzentfarbe bleibt das bisherige Rot `#b3122b`.
- **Mein Vorschlag:** Den dunklen Modus nach Systemeinstellung behalten.

## Approaches (abgewogen)

- A · Fünfte Variante in der Umschaltung: wenig Aufwand, aber das Raster lässt sich kaum umbauen.
- B · Neues Design als Standard, Varianten bleiben: echtes Raster, aber die alten Varianten müssen nachjustiert werden.
- **C · Nur noch das neue Design (gewählt):** schlankste Seite, nur eine Vorlage für die tägliche Aufgabe. Die Entwürfe bleiben in `entwuerfe/`.

## Nicht Teil dieser Änderung

Keine neuen Inhalte, keine Web-App, keine Bilder, keine Änderung an den Regeln für Inhalte.

## Erfolg

- Die lokale `index.html` zeigt Ausgabe Nr. 4 vollständig im neuen Design, auf dem Desktop und am Handy (375 px), hell und dunkel, ohne waagrechtes Scrollen.
- Alle Quellenlinks, „Keine Anlageberatung“, Zeitpunkt und Quelle der Kurse bleiben erhalten.
- Keine Reste der alten Umschaltung im Code.

## Offen (deins)

- **Geplante Aufgabe „Daily News täglich“:** Sie läuft in claude.ai und ist von hier nicht erreichbar. Ohne Anpassung überschreibt sie das Design am nächsten Morgen. Nach der Umsetzung prüfst du in claude.ai, ob die Aufgabe die bestehende Seite als Vorlage nimmt oder das HTML selbst schreibt, und übernimmst dort gegebenenfalls die neue `index.html` als Vorlage. Ich kann die neue Seite auch auf die bestehende Artifact-Adresse veröffentlichen.
- `CLAUDE.md` wird danach angepasst (Design-Umschaltung entfällt, neues Design beschrieben).

## Dem Umsetzer überlassen

Genaue Abstände, Schriftgrößen, Kachelfarben im Dunkelmodus, Hover-Zustände.
