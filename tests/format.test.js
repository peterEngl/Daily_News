import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  heuteWien, stundeWien, uhrzeitWien, datumLang, datumKurz,
  formatKurs, formatAenderung, ausgabeHinweis, quellenZeile,
} from '../format.js';

test('heuteWien: Winterzeit, kurz vor Mitternacht UTC ist in Wien schon morgen', () => {
  assert.equal(heuteWien(new Date('2026-11-16T23:30:00Z')), '2026-11-17');
});

test('heuteWien: Sommerzeit wechselt den Tag um 22:00 UTC', () => {
  assert.equal(heuteWien(new Date('2026-07-01T21:59:00Z')), '2026-07-01');
  assert.equal(heuteWien(new Date('2026-07-01T22:00:00Z')), '2026-07-02');
});

test('stundeWien: Sommer +2, Winter +1', () => {
  assert.equal(stundeWien(new Date('2026-07-01T06:30:00Z')), 8);
  assert.equal(stundeWien(new Date('2026-11-16T06:59:00Z')), 7);
});

test('uhrzeitWien wandelt Unix-Sekunden in Wiener Uhrzeit', () => {
  assert.equal(uhrzeitWien(Date.UTC(2026, 10, 16, 6, 12) / 1000), '07:12');
});

test('datumLang und datumKurz', () => {
  assert.equal(datumLang('2026-11-16'), 'Montag, 16. November 2026');
  assert.equal(datumKurz('2026-11-17'), 'Di 17.11.');
});

test('formatKurs mit Punkt als Tausendertrenner und gestaffelten Nachkommastellen', () => {
  assert.equal(formatKurs(65030.4), '65.030');
  assert.equal(formatKurs(1818.6), '1.819');
  assert.equal(formatKurs(594.2), '594');
  assert.equal(formatKurs(2.5), '2,50');
  assert.equal(formatKurs(0.96912), '0,969');
});

test('formatAenderung liefert Betrag und Richtung', () => {
  assert.deepEqual(formatAenderung(1.234), { text: '1,2 %', richtung: 'up' });
  assert.deepEqual(formatAenderung(-7.46), { text: '7,5 %', richtung: 'dn' });
  assert.equal(formatAenderung(0).richtung, 'up');
});

test('ausgabeHinweis: offline', () => {
  assert.equal(
    ausgabeHinweis({ ausgabeDatum: '2026-11-16', ausDemNetz: false, jetzt: new Date('2026-11-16T10:00:00Z') }),
    'Offline – gespeicherte Ausgabe',
  );
});

test('ausgabeHinweis: Ausgabe von gestern erst ab 8 Uhr Wiener Zeit melden', () => {
  const basis = { ausgabeDatum: '2026-11-15', ausDemNetz: true };
  assert.equal(ausgabeHinweis({ ...basis, jetzt: new Date('2026-11-16T06:59:00Z') }), null);
  assert.equal(
    ausgabeHinweis({ ...basis, jetzt: new Date('2026-11-16T07:00:00Z') }),
    'Die heutige Ausgabe ist noch nicht erschienen.',
  );
});

test('ausgabeHinweis: Ausgabe von heute braucht keinen Hinweis', () => {
  assert.equal(
    ausgabeHinweis({ ausgabeDatum: '2026-11-16', ausDemNetz: true, jetzt: new Date('2026-11-16T14:00:00Z') }),
    null,
  );
});

test('quellenZeile unterscheidet Einzahl und Mehrzahl', () => {
  assert.equal(quellenZeile(1), 'Quelle: ');
  assert.equal(quellenZeile(3), 'Quellen: ');
});
