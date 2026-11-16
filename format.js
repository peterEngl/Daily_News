// Reine Hilfsfunktionen: Wiener Zeit, Datumstexte, Zahlenformat, Hinweistexte.
// Keine Zugriffe auf DOM oder Netz, damit alles mit node --test prüfbar ist.

const ZEITZONE = 'Europe/Vienna';
const WOCHENTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const WOCHENTAGE_KURZ = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

const wienTeile = new Intl.DateTimeFormat('en-GB', {
  timeZone: ZEITZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

function teileWien(datum) {
  const t = {};
  for (const { type, value } of wienTeile.formatToParts(datum)) t[type] = value;
  return t;
}

// Kalendertag aus "JJJJ-MM-TT", unabhängig von Zeitzonen
function kalendertag(iso) {
  const [j, m, t] = iso.split('-').map(Number);
  return { jahr: j, monat: m, tag: t, wochentag: new Date(Date.UTC(j, m - 1, t)).getUTCDay() };
}

export function heuteWien(jetzt) {
  const t = teileWien(jetzt);
  return `${t.year}-${t.month}-${t.day}`;
}

export function stundeWien(jetzt) {
  return Number(teileWien(jetzt).hour);
}

export function uhrzeitWien(unixSekunden) {
  const t = teileWien(new Date(unixSekunden * 1000));
  return `${t.hour}:${t.minute}`;
}

export function datumLang(iso) {
  const d = kalendertag(iso);
  return `${WOCHENTAGE[d.wochentag]}, ${d.tag}. ${MONATE[d.monat - 1]} ${d.jahr}`;
}

export function datumKurz(iso) {
  const d = kalendertag(iso);
  return `${WOCHENTAGE_KURZ[d.wochentag]} ${d.tag}.${d.monat}.`;
}

export function formatKurs(usd) {
  const stellen = usd >= 100 ? 0 : usd >= 1 ? 2 : 3;
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen }).format(usd);
}

export function formatAenderung(prozent) {
  const betrag = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(Math.abs(prozent));
  return { text: `${betrag} %`, richtung: prozent < 0 ? 'dn' : 'up' };
}

export function ausgabeHinweis({ ausgabeDatum, ausDemNetz, jetzt }) {
  if (!ausDemNetz) return 'Offline – gespeicherte Ausgabe';
  if (ausgabeDatum < heuteWien(jetzt) && stundeWien(jetzt) >= 8) return 'Die heutige Ausgabe ist noch nicht erschienen.';
  return null;
}

export function quellenZeile(anzahl) {
  return anzahl === 1 ? 'Quelle: ' : 'Quellen: ';
}
