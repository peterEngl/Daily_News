import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefeAusgabe } from './pruefe-ausgabe.mjs';

const quelle = () => [{ name: 'Beispielquelle', url: 'https://example.com/meldung' }];
const artikel = (titel) => ({ dachzeile: 'Dachzeile', titel, absaetze: ['Ein Absatz.'], quellen: quelle() });
const ressort = (id, titel) => ({
  id,
  titel,
  keineMeldungen: null,
  hauptartikel: artikel(`Hauptartikel ${id}`),
  artikel: [artikel(`Artikel ${id}`)],
  kurzmeldungen: [{ titel: 'Kurz', text: 'Eine Kurzmeldung.', quellen: quelle() }],
});

function gueltig() {
  return {
    nummer: 4,
    datum: '2026-11-16',
    redaktionsschluss: '06:50',
    aufmacher: { ressort: 'KI', titel: 'Aufmacher', vorspann: 'Vorspann.', absaetze: ['Absatz.'], quellen: quelle() },
    termine: [{ datum: '2026-11-17', text: 'Ein Termin' }],
    ressorts: [ressort('ki', 'Künstliche Intelligenz'), ressort('games', 'Games'), ressort('krypto', 'Krypto')],
  };
}

const enthaelt = (fehler, teil) => fehler.some((f) => f.includes(teil));

test('gueltige Ausgabe hat keine Fehler', () => {
  assert.deepEqual(pruefeAusgabe(gueltig()), []);
});

test('HTML in einem Titel wird abgelehnt', () => {
  const a = gueltig();
  a.ressorts[0].hauptartikel.titel = '<img src=x onerror=alert(1)>';
  const fehler = pruefeAusgabe(a);
  assert.ok(enthaelt(fehler, 'ressorts[0].hauptartikel.titel'), fehler.join('\n'));
});

test('Meldung ohne Quelle wird abgelehnt', () => {
  const a = gueltig();
  a.ressorts[2].kurzmeldungen[0].quellen = [];
  assert.ok(enthaelt(pruefeAusgabe(a), 'ressorts[2].kurzmeldungen[0].quellen'));
});

test('http-Link wird abgelehnt', () => {
  const a = gueltig();
  a.aufmacher.quellen[0].url = 'http://example.com';
  assert.ok(enthaelt(pruefeAusgabe(a), 'aufmacher.quellen[0].url'));
});

test('javascript-Link wird abgelehnt', () => {
  const a = gueltig();
  a.aufmacher.quellen[0].url = 'javascript:alert(1)';
  assert.ok(enthaelt(pruefeAusgabe(a), 'aufmacher.quellen[0].url'));
});

test('falsche Ressort-Reihenfolge wird abgelehnt', () => {
  const a = gueltig();
  [a.ressorts[0], a.ressorts[1]] = [a.ressorts[1], a.ressorts[0]];
  assert.ok(enthaelt(pruefeAusgabe(a), 'ressorts[0].id'));
});

test('Ressort mit keineMeldungen und leeren Listen ist gueltig', () => {
  const a = gueltig();
  Object.assign(a.ressorts[1], { keineMeldungen: 'Heute nichts Belegbares.', hauptartikel: null, artikel: [], kurzmeldungen: [] });
  assert.deepEqual(pruefeAusgabe(a), []);
});

test('keineMeldungen zusammen mit Artikeln wird abgelehnt', () => {
  const a = gueltig();
  a.ressorts[1].keineMeldungen = 'Heute nichts Belegbares.';
  assert.ok(enthaelt(pruefeAusgabe(a), 'ressorts[1]'));
});

test('Termin vor dem Ausgabedatum wird abgelehnt', () => {
  const a = gueltig();
  a.termine[0].datum = '2026-11-15';
  assert.ok(enthaelt(pruefeAusgabe(a), 'termine[0].datum'));
});

test('ungueltiges Datum wird abgelehnt', () => {
  const a = gueltig();
  a.datum = '2026-02-30';
  assert.ok(enthaelt(pruefeAusgabe(a), 'datum'));
});

test('leerer Text wird abgelehnt', () => {
  const a = gueltig();
  a.aufmacher.absaetze = ['   '];
  assert.ok(enthaelt(pruefeAusgabe(a), 'aufmacher.absaetze[0]'));
});

test('kein Objekt liefert genau einen Fehler ohne Absturz', () => {
  assert.equal(pruefeAusgabe(null).length, 1);
  assert.equal(pruefeAusgabe([]).length, 1);
});
