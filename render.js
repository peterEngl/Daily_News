// Baut die Ausgabe aus ausgabe.json ins Gerüst von index.html.
// Inhalte werden nur als Text eingesetzt (textContent), nie als HTML.
import { datumLang, datumKurz, quellenZeile } from './format.js';

const NAV_NAMEN = { ki: 'KI', games: 'Games', krypto: 'Krypto' };

function el(doc, tag, klasse, text) {
  const e = doc.createElement(tag);
  if (klasse) e.className = klasse;
  if (text !== undefined) e.textContent = text;
  return e;
}

function quelleElement(doc, q) {
  let url = null;
  try {
    const u = new URL(q.url);
    if (u.protocol === 'https:' || u.protocol === 'http:') url = u.href;
  } catch { /* ungültige Adresse: nur Name zeigen */ }
  if (!url) return el(doc, 'span', null, q.name);
  const a = el(doc, 'a', null, q.name);
  a.href = url;
  a.rel = 'noopener noreferrer';
  return a;
}

// Hängt "A, B und C" als Links an ein Element an.
function haengeQuellenAn(doc, ziel, quellen) {
  quellen.forEach((q, i) => {
    if (i > 0) ziel.append(i === quellen.length - 1 ? ' und ' : ', ');
    ziel.append(quelleElement(doc, q));
  });
}

function quellenAbsatz(doc, quellen) {
  const p = el(doc, 'p', 'src', quellenZeile(quellen.length));
  haengeQuellenAn(doc, p, quellen);
  return p;
}

function baueArtikel(doc, a, istTop) {
  const art = el(doc, 'article', istTop ? 'top' : null);
  art.append(el(doc, 'p', 'kicker', a.dachzeile), el(doc, 'h3', null, a.titel));
  const ziel = istTop ? el(doc, 'div', 'txt') : art;
  a.absaetze.forEach((t) => ziel.append(el(doc, 'p', null, t)));
  ziel.append(quellenAbsatz(doc, a.quellen));
  if (istTop) art.append(ziel);
  return art;
}

function baueRessort(doc, r) {
  const sec = el(doc, 'section', 'res');
  sec.id = r.id;
  sec.setAttribute('aria-labelledby', `${r.id}-h`);
  const kopf = el(doc, 'div', 'reshead');
  const h2 = el(doc, 'h2', null, r.titel);
  h2.id = `${r.id}-h`;
  kopf.append(h2);
  sec.append(kopf);

  if (r.keineMeldungen) {
    sec.append(el(doc, 'p', 'leer tile', r.keineMeldungen));
    return sec;
  }

  const grid = el(doc, 'div', 'grid');
  grid.append(baueArtikel(doc, r.hauptartikel, true));
  r.artikel.forEach((a) => grid.append(baueArtikel(doc, a, false)));
  if (r.kurzmeldungen.length > 0) {
    const briefs = el(doc, 'div', 'briefs');
    const ul = el(doc, 'ul');
    r.kurzmeldungen.forEach((k) => {
      const li = el(doc, 'li');
      li.append(el(doc, 'b', null, k.titel), ` ${k.text} `);
      haengeQuellenAn(doc, li, k.quellen);
      ul.append(li);
    });
    briefs.append(el(doc, 'h3', null, 'Kurz gemeldet'), ul);
    grid.append(briefs);
  }
  sec.append(grid);
  return sec;
}

function baueAufmacher(doc, a) {
  const huelle = el(doc, 'div');
  const h2 = el(doc, 'h2', null, a.titel);
  h2.id = 'lead-h';
  const copy = el(doc, 'div', 'copy');
  a.absaetze.forEach((t) => copy.append(el(doc, 'p', null, t)));
  copy.append(quellenAbsatz(doc, a.quellen));
  huelle.append(el(doc, 'p', 'kicker', `Aufmacher · ${a.ressort}`), h2, el(doc, 'p', 'deck', a.vorspann), copy);
  return huelle;
}

export function baueAusgabe(ausgabe, doc) {
  const $ = (id) => doc.getElementById(id);

  $('ausgabe-nr').textContent = `Ausgabe Nr. ${ausgabe.nummer}`;
  $('ausgabe-datum').textContent = datumLang(ausgabe.datum);
  $('redaktionsschluss').textContent = `Redaktionsschluss ${ausgabe.redaktionsschluss} Uhr`;

  const nav = $('nav-ressorts');
  nav.replaceChildren();
  for (const r of ausgabe.ressorts) {
    const a = el(doc, 'a', null, NAV_NAMEN[r.id] ?? r.titel);
    a.href = `#${r.id}`;
    nav.append(a);
  }
  const termineLink = el(doc, 'a', null, 'Termine');
  termineLink.href = '#termine';
  nav.append(termineLink);

  $('aufmacher').replaceChildren(baueAufmacher(doc, ausgabe.aufmacher));

  $('termine-liste').replaceChildren(...ausgabe.termine.map((t) => {
    const li = el(doc, 'li');
    const zeit = el(doc, 'time', null, datumKurz(t.datum));
    zeit.dateTime = t.datum;
    li.append(zeit, el(doc, 'span', null, t.text));
    return li;
  }));

  $('ressorts').replaceChildren(...ausgabe.ressorts.map((r) => baueRessort(doc, r)));

  const tag = datumLang(ausgabe.datum).split(', ')[1];
  $('fussnote').textContent = 'Daily News fasst öffentlich zugängliche Meldungen in eigenen Worten zusammen; '
    + 'die verlinkten Quellen enthalten die Details. Zeitangaben in Wiener Ortszeit. '
    + `Kursangaben sind Momentaufnahmen und keine Anlageberatung. Zusammengestellt von Claude am ${tag}.`;
}
