// Live-Kurse von CoinGecko für die Kurstafel.
import { formatKurs, formatAenderung, uhrzeitWien } from './format.js';

export const KURS_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true';
export const MUENZEN = [
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'ethereum', name: 'Ether' },
  { id: 'binancecoin', name: 'BNB' },
  { id: 'ripple', name: 'XRP' },
];

const INTERVALL_MS = 60_000;
const SPEICHER_SCHLUESSEL = 'daily-news-kurse';

const zahlOderNull = (x) => (typeof x === 'number' && Number.isFinite(x) ? x : null);

// Prüft die Antwort; nur endliche Zahlen werden übernommen.
export function leseKurse(json) {
  const quelle = json !== null && typeof json === 'object' ? json : {};
  let stand = null;
  const werte = MUENZEN.map(({ id, name }) => {
    const m = quelle[id] !== null && typeof quelle[id] === 'object' ? quelle[id] : {};
    const zeit = zahlOderNull(m.last_updated_at);
    if (zeit !== null && (stand === null || zeit > stand)) stand = zeit;
    return { name, usd: zahlOderNull(m.usd), aenderung: zahlOderNull(m.usd_24h_change) };
  });
  if (werte.every((w) => w.usd === null)) throw new Error('Keine Kurse in der Antwort');
  return { werte, stand };
}

export function kursHinweis(zustand, stand) {
  if (zustand === 'keine' || stand === null) return 'Kurse derzeit nicht verfügbar. Keine Anlageberatung.';
  const uhrzeit = uhrzeitWien(stand);
  if (zustand === 'aktuell') return `Stand ${uhrzeit} Uhr (Wiener Zeit), Quelle: CoinGecko. Keine Anlageberatung.`;
  return `Letzter Stand ${uhrzeit} Uhr (Wiener Zeit) – derzeit keine Verbindung. Quelle: CoinGecko. Keine Anlageberatung.`;
}

function zelle(doc, inhalt) {
  const td = doc.createElement('td');
  td.setAttribute('role', 'cell');
  if (typeof inhalt === 'string') td.textContent = inhalt;
  else td.append(inhalt);
  return td;
}

function zeigeWerte(doc, werte) {
  const zeilen = werte.map((w) => {
    const tr = doc.createElement('tr');
    tr.setAttribute('role', 'row');
    let aenderung = '–';
    if (w.aenderung !== null) {
      const { text, richtung } = formatAenderung(w.aenderung);
      aenderung = doc.createElement('span');
      aenderung.className = richtung;
      aenderung.textContent = text;
    }
    tr.append(zelle(doc, w.name), zelle(doc, w.usd === null ? '–' : formatKurs(w.usd)), zelle(doc, aenderung));
    return tr;
  });
  doc.getElementById('kurstafel-body').replaceChildren(...zeilen);
}

// Jeder Speicherzugriff kann werfen (gesperrter Speicher, privates Fenster).
function speicher(doc) {
  try { return doc.defaultView?.localStorage ?? null; } catch { return null; }
}

export function starteKurse(doc, fetchFn = fetch) {
  const hinweis = doc.getElementById('kurstafel-hinweis');
  let letzte = null;

  try {
    const gespeichert = speicher(doc)?.getItem(SPEICHER_SCHLUESSEL);
    if (gespeichert) letzte = leseKurse(JSON.parse(gespeichert));
  } catch { letzte = null; /* kaputt oder manipuliert: ignorieren */ }
  if (letzte) {
    zeigeWerte(doc, letzte.werte);
    hinweis.textContent = kursHinweis('veraltet', letzte.stand);
  }

  async function lade() {
    try {
      const antwort = await fetchFn(KURS_URL, { credentials: 'omit' });
      if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
      const json = await antwort.json();
      letzte = leseKurse(json);
      zeigeWerte(doc, letzte.werte);
      hinweis.textContent = kursHinweis('aktuell', letzte.stand);
      try { speicher(doc)?.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(json)); } catch { /* ohne Speicher weiter */ }
    } catch (fehler) {
      console.warn('Kurse nicht ladbar:', fehler);
      hinweis.textContent = letzte ? kursHinweis('veraltet', letzte.stand) : kursHinweis('keine', null);
    }
  }

  lade();
  setInterval(() => { if (doc.visibilityState === 'visible') lade(); }, INTERVALL_MS);
  doc.addEventListener('visibilitychange', () => { if (doc.visibilityState === 'visible') lade(); });
}
