import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { leseKurse, kursHinweis, starteKurse, KURS_URL } from '../kurse.js';

const T1 = Date.UTC(2026, 10, 16, 6, 10) / 1000;
const T2 = Date.UTC(2026, 10, 16, 6, 12) / 1000;

const BEISPIEL = {
  bitcoin: { usd: 91234.5, usd_24h_change: 1.234, last_updated_at: T1 },
  ethereum: { usd: 3120.1, usd_24h_change: -2.5, last_updated_at: T2 },
  binancecoin: { usd: 612.3, usd_24h_change: 0.4, last_updated_at: T1 },
  ripple: { usd: 0.5432, usd_24h_change: -0.1, last_updated_at: T1 },
};

test('leseKurse: vollständige Antwort ergibt 4 Werte in fester Reihenfolge, stand = Maximum', () => {
  const { werte, stand } = leseKurse(BEISPIEL);
  assert.deepEqual(werte.map((w) => w.name), ['Bitcoin', 'Ether', 'BNB', 'XRP']);
  assert.deepEqual(werte[1], { name: 'Ether', usd: 3120.1, aenderung: -2.5 });
  assert.equal(stand, T2);
});

test('leseKurse: fehlende Münze wird null, kein Fehler', () => {
  const { ripple, ...ohneXrp } = BEISPIEL;
  const { werte } = leseKurse(ohneXrp);
  assert.deepEqual(werte[3], { name: 'XRP', usd: null, aenderung: null });
});

test('leseKurse: leere Antwort oder Fehlerantwort wirft', () => {
  assert.throws(() => leseKurse({}));
  assert.throws(() => leseKurse({ status: { error_code: 429 } }));
  assert.throws(() => leseKurse(null));
  assert.throws(() => leseKurse('text'));
});

test('leseKurse: Text, NaN und Infinity statt Zahl werden null', () => {
  const { werte } = leseKurse({
    ...BEISPIEL,
    bitcoin: { usd: '<script>alert(1)</script>', usd_24h_change: 'x' },
    ethereum: { usd: NaN, usd_24h_change: Infinity },
  });
  assert.deepEqual(werte[0], { name: 'Bitcoin', usd: null, aenderung: null });
  assert.deepEqual(werte[1], { name: 'Ether', usd: null, aenderung: null });
  assert.equal(werte[2].usd, 612.3);
});

test('kursHinweis: exakte Texte für alle drei Zustände', () => {
  const stand = Date.UTC(2026, 10, 16, 6, 12) / 1000;
  assert.equal(kursHinweis('aktuell', stand), 'Stand 07:12 Uhr (Wiener Zeit), Quelle: CoinGecko. Keine Anlageberatung.');
  assert.equal(kursHinweis('veraltet', stand), 'Letzter Stand 07:12 Uhr (Wiener Zeit) – derzeit keine Verbindung. Quelle: CoinGecko. Keine Anlageberatung.');
  assert.equal(kursHinweis('keine', null), 'Kurse derzeit nicht verfügbar. Keine Anlageberatung.');
});

// --- Minimales Fake-Dokument: nur das, was starteKurse braucht ---

function fakeElement(tag) {
  return {
    tag, children: [], className: '', role: null, _text: '',
    set textContent(t) { this._text = t; this.children = []; },
    get textContent() { return this._text + this.children.map((c) => c.textContent).join(''); },
    append(...k) { this.children.push(...k); },
    replaceChildren(...k) { this._text = ''; this.children = k; },
    setAttribute(name, wert) { if (name === 'role') this.role = wert; },
  };
}

function fakeDokument({ speicher } = {}) {
  const body = fakeElement('tbody');
  const hinweis = fakeElement('p');
  const lauscher = {};
  const doc = {
    visibilityState: 'visible',
    getElementById: (id) => ({ 'kurstafel-body': body, 'kurstafel-hinweis': hinweis })[id] ?? null,
    createElement: fakeElement,
    addEventListener: (typ, fn) => { lauscher[typ] = fn; },
    get defaultView() { return speicher === undefined ? null : { localStorage: speicher }; },
  };
  return { doc, body, hinweis, lauscher };
}

function fakeSpeicher(inhalt = {}) {
  return {
    daten: { ...inhalt },
    getItem(k) { return k in this.daten ? this.daten[k] : null; },
    setItem(k, v) { this.daten[k] = String(v); },
  };
}

const gesperrterSpeicher = {
  getItem() { throw new Error('SecurityError'); },
  setItem() { throw new Error('SecurityError'); },
};

const antwort = (json) => Promise.resolve({ ok: true, json: () => Promise.resolve(json) });
const warte = () => new Promise((r) => setImmediate(r));

test('starteKurse: erst aktuelle Werte, nach Netzfehler „Letzter Stand“ und Werte bleiben stehen', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const aufrufe = [];
  const fetchFn = mock.fn((url) => {
    aufrufe.push(url);
    return aufrufe.length === 1 ? antwort(BEISPIEL) : Promise.reject(new Error('offline'));
  });
  const { doc, body, hinweis } = fakeDokument({ speicher: fakeSpeicher() });

  starteKurse(doc, fetchFn);
  await warte();
  assert.equal(aufrufe[0], KURS_URL);
  assert.equal(hinweis.textContent, 'Stand 07:12 Uhr (Wiener Zeit), Quelle: CoinGecko. Keine Anlageberatung.');
  assert.equal(body.children.length, 4);
  const ersteZeile = body.children[0];
  assert.equal(ersteZeile.role, 'row');
  assert.deepEqual(ersteZeile.children.map((z) => z.role), ['cell', 'cell', 'cell']);
  assert.equal(ersteZeile.children[0].textContent, 'Bitcoin');
  assert.equal(ersteZeile.children[1].textContent, '91.235');
  assert.equal(ersteZeile.children[2].children[0].className, 'up');
  assert.equal(body.children[1].children[2].children[0].className, 'dn');

  t.mock.timers.tick(60_000);
  await warte();
  assert.equal(aufrufe.length, 2);
  assert.match(hinweis.textContent, /^Letzter Stand 07:12 Uhr .* derzeit keine Verbindung/);
  assert.equal(body.children.length, 4);
  assert.equal(body.children[0].children[1].textContent, '91.235');
});

test('starteKurse: fehlender Wert erscheint als „–“', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const { ripple, ...ohneXrp } = BEISPIEL;
  const { doc, body } = fakeDokument();
  starteKurse(doc, () => antwort(ohneXrp));
  await warte();
  assert.deepEqual(body.children[3].children.map((z) => z.textContent), ['XRP', '–', '–']);
});

test('starteKurse: lädt nur, wenn die Seite sichtbar ist, und sofort beim Sichtbarwerden', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const fetchFn = mock.fn(() => antwort(BEISPIEL));
  const { doc, lauscher } = fakeDokument();
  starteKurse(doc, fetchFn);
  await warte();
  assert.equal(fetchFn.mock.callCount(), 1);

  doc.visibilityState = 'hidden';
  t.mock.timers.tick(60_000);
  await warte();
  assert.equal(fetchFn.mock.callCount(), 1);

  doc.visibilityState = 'visible';
  lauscher.visibilitychange();
  await warte();
  assert.equal(fetchFn.mock.callCount(), 2);
});

test('starteKurse: gespeicherte Werte erscheinen sofort als veraltet und werden gespeichert', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const speicher = fakeSpeicher({ 'daily-news-kurse': JSON.stringify(BEISPIEL) });
  const { doc, body, hinweis } = fakeDokument({ speicher });
  starteKurse(doc, () => Promise.reject(new Error('offline')));
  assert.equal(body.children.length, 4);
  assert.match(hinweis.textContent, /^Letzter Stand 07:12 Uhr/);
  await warte();
  assert.match(hinweis.textContent, /^Letzter Stand 07:12 Uhr/);

  const neu = { ...BEISPIEL, bitcoin: { ...BEISPIEL.bitcoin, usd: 1 } };
  const speicher2 = fakeSpeicher();
  const zweites = fakeDokument({ speicher: speicher2 });
  starteKurse(zweites.doc, () => antwort(neu));
  await warte();
  assert.equal(JSON.parse(speicher2.daten['daily-news-kurse']).bitcoin.usd, 1);
});

test('starteKurse: kaputter oder manipulierter Speicherinhalt wird ignoriert', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  for (const inhalt of ['nicht json', '{"werte":"x"}', '{"bitcoin":{"usd":"<img src=x>"}}']) {
    const { doc, body, hinweis } = fakeDokument({ speicher: fakeSpeicher({ 'daily-news-kurse': inhalt }) });
    starteKurse(doc, () => Promise.reject(new Error('offline')));
    await warte();
    assert.equal(body.children.length, 0, inhalt);
    assert.equal(hinweis.textContent, 'Kurse derzeit nicht verfügbar. Keine Anlageberatung.', inhalt);
  }
});

test('starteKurse: läuft auch mit gesperrtem Speicher', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const { doc, body, hinweis } = fakeDokument({ speicher: gesperrterSpeicher });
  starteKurse(doc, () => antwort(BEISPIEL));
  await warte();
  assert.equal(body.children.length, 4);
  assert.match(hinweis.textContent, /^Stand 07:12 Uhr/);
});

test('starteKurse: HTTP-Fehler ohne gespeicherte Werte ergibt „nicht verfügbar“', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const { doc, hinweis } = fakeDokument();
  starteKurse(doc, () => Promise.resolve({ ok: false, status: 429, json: () => Promise.resolve({}) }));
  await warte();
  assert.equal(hinweis.textContent, 'Kurse derzeit nicht verfügbar. Keine Anlageberatung.');
});
