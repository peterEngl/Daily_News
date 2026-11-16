// Prüft ausgabe.json auf das in docs/superpowers/specs/2026-11-16-web-app-design.md festgelegte Format.
// Aufruf: node tests/pruefe-ausgabe.mjs [pfad]   (Standard: ausgabe.json im Projektordner)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const RESSORT_IDS = ['ki', 'games', 'krypto'];

const istObjekt = (w) => w !== null && typeof w === 'object' && !Array.isArray(w);

function istDatum(w) {
  if (typeof w !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(w)) return false;
  const d = new Date(`${w}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === w;
}

export function pruefeAusgabe(daten) {
  const fehler = [];
  const melde = (pfad, text) => fehler.push(`${pfad}: ${text}`);

  const text = (wert, pfad) => {
    if (typeof wert !== 'string' || wert.trim() === '') return melde(pfad, 'nicht leerer Text nötig');
    if (/[<>]/.test(wert)) melde(pfad, 'darf kein < oder > enthalten');
  };
  const liste = (wert, pfad, mindestens = 0) => {
    if (!Array.isArray(wert)) { melde(pfad, 'Liste nötig'); return []; }
    if (wert.length < mindestens) melde(pfad, `mindestens ${mindestens} Eintrag nötig`);
    return wert;
  };
  const objekt = (wert, pfad) => {
    if (!istObjekt(wert)) { melde(pfad, 'Objekt nötig'); return false; }
    return true;
  };
  const quellen = (wert, pfad) => {
    if (Array.isArray(wert) && wert.length === 0) return melde(pfad, 'mindestens eine Quelle nötig');
    liste(wert, pfad, 1).forEach((q, i) => {
      const p = `${pfad}[${i}]`;
      if (!objekt(q, p)) return;
      text(q.name, `${p}.name`);
      let gueltig = typeof q.url === 'string' && q.url.startsWith('https://');
      if (gueltig) { try { new URL(q.url); } catch { gueltig = false; } }
      if (!gueltig) melde(`${p}.url`, 'gültige https-Adresse nötig');
    });
  };
  const absaetze = (wert, pfad) => liste(wert, pfad, 1).forEach((a, i) => text(a, `${pfad}[${i}]`));
  const artikel = (a, pfad) => {
    if (!objekt(a, pfad)) return;
    text(a.dachzeile, `${pfad}.dachzeile`);
    text(a.titel, `${pfad}.titel`);
    absaetze(a.absaetze, `${pfad}.absaetze`);
    quellen(a.quellen, `${pfad}.quellen`);
  };

  if (!istObjekt(daten)) return ['Ausgabe: Objekt nötig'];

  if (!Number.isInteger(daten.nummer) || daten.nummer < 1) melde('nummer', 'ganze Zahl ab 1 nötig');
  if (!istDatum(daten.datum)) melde('datum', 'gültiges Datum JJJJ-MM-TT nötig');
  if (typeof daten.redaktionsschluss !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(daten.redaktionsschluss)) {
    melde('redaktionsschluss', 'Uhrzeit HH:MM nötig');
  }

  if (objekt(daten.aufmacher, 'aufmacher')) {
    const a = daten.aufmacher;
    text(a.ressort, 'aufmacher.ressort');
    text(a.titel, 'aufmacher.titel');
    text(a.vorspann, 'aufmacher.vorspann');
    absaetze(a.absaetze, 'aufmacher.absaetze');
    quellen(a.quellen, 'aufmacher.quellen');
  }

  liste(daten.termine, 'termine').forEach((t, i) => {
    const p = `termine[${i}]`;
    if (!objekt(t, p)) return;
    if (!istDatum(t.datum)) melde(`${p}.datum`, 'gültiges Datum JJJJ-MM-TT nötig');
    else if (istDatum(daten.datum) && t.datum < daten.datum) melde(`${p}.datum`, 'liegt vor dem Ausgabedatum');
    text(t.text, `${p}.text`);
  });

  const ressorts = liste(daten.ressorts, 'ressorts');
  if (ressorts.length !== RESSORT_IDS.length) melde('ressorts', 'genau drei Ressorts nötig (ki, games, krypto)');
  ressorts.forEach((r, i) => {
    const p = `ressorts[${i}]`;
    if (!objekt(r, p)) return;
    if (r.id !== RESSORT_IDS[i]) melde(`${p}.id`, `erwartet "${RESSORT_IDS[i]}"`);
    text(r.titel, `${p}.titel`);
    if (r.keineMeldungen !== null) {
      text(r.keineMeldungen, `${p}.keineMeldungen`);
      const leer = r.hauptartikel === null
        && Array.isArray(r.artikel) && r.artikel.length === 0
        && Array.isArray(r.kurzmeldungen) && r.kurzmeldungen.length === 0;
      if (!leer) melde(p, 'mit keineMeldungen müssen hauptartikel null und artikel/kurzmeldungen leer sein');
      return;
    }
    artikel(r.hauptartikel, `${p}.hauptartikel`);
    liste(r.artikel, `${p}.artikel`).forEach((a, j) => artikel(a, `${p}.artikel[${j}]`));
    liste(r.kurzmeldungen, `${p}.kurzmeldungen`).forEach((k, j) => {
      const pk = `${p}.kurzmeldungen[${j}]`;
      if (!objekt(k, pk)) return;
      text(k.titel, `${pk}.titel`);
      text(k.text, `${pk}.text`);
      quellen(k.quellen, `${pk}.quellen`);
    });
  });

  return fehler;
}

function hauptprogramm() {
  const standard = join(dirname(fileURLToPath(import.meta.url)), '..', 'ausgabe.json');
  const pfad = resolve(process.argv[2] ?? standard);
  let daten;
  try {
    daten = JSON.parse(readFileSync(pfad, 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    console.log(`FEHLGESCHLAGEN (1 Prüfung):\n - ${pfad} nicht lesbar oder kein gültiges JSON: ${e.message}`);
    process.exit(1);
  }
  const fehler = pruefeAusgabe(daten);
  if (fehler.length > 0) {
    console.log(`FEHLGESCHLAGEN (${fehler.length} Prüfungen):`);
    fehler.forEach((f) => console.log(` - ${f}`));
    process.exit(1);
  }
  console.log(`OK: Ausgabe Nr. ${daten.nummer} vom ${daten.datum}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) hauptprogramm();
