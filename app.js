// Einstieg der App: Ausgabe laden und anzeigen.
import { baueAusgabe } from './render.js';
import { ausgabeHinweis } from './format.js';

const AUSGABE_URL = './ausgabe.json';
const AUSGABE_CACHE = 'daily-news-ausgabe';

// Netz zuerst; bei Erfolg Kopie im Cache-Speicher ablegen, bei Fehler die Kopie lesen.
async function ladeAusgabe() {
  try {
    const antwort = await fetch(AUSGABE_URL, { cache: 'no-cache' });
    if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
    const kopie = antwort.clone();
    const ausgabe = await antwort.json();
    // Offline-Kopie nebenher ablegen; die Anzeige wartet nicht darauf.
    globalThis.caches?.open(AUSGABE_CACHE)
      .then((cache) => cache.put(AUSGABE_URL, kopie))
      .catch(() => { /* Cache-Speicher nicht verfügbar: ohne Offline-Kopie weiter */ });
    return { ausgabe, ausDemNetz: true };
  } catch (netzFehler) {
    let gespeichert;
    try {
      const cache = await caches.open(AUSGABE_CACHE);
      gespeichert = await cache.match(AUSGABE_URL);
    } catch { /* kein Cache-Speicher */ }
    if (!gespeichert) throw netzFehler;
    return { ausgabe: await gespeichert.json(), ausDemNetz: false };
  }
}

async function start() {
  try {
    const { ausgabe, ausDemNetz } = await ladeAusgabe();
    baueAusgabe(ausgabe, document);
    const hinweis = ausgabeHinweis({ ausgabeDatum: ausgabe.datum, ausDemNetz, jetzt: new Date() });
    const feld = document.getElementById('ausgabe-hinweis');
    feld.textContent = hinweis ?? '';
    feld.hidden = hinweis === null;
  } catch (fehler) {
    console.error('Ausgabe nicht ladbar:', fehler);
    document.getElementById('ladefehler').hidden = false;
    document.getElementById('ausgabe-datum').textContent = 'Keine Ausgabe';
  }
}

start();
