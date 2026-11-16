// Prüft die Dateiliste DATEIEN im Workflow .github/workflows/veroeffentlichen.yml gegen die App-Hülle in sw.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ORDNER = join(dirname(fileURLToPath(import.meta.url)), '..');
const lies = (datei) => readFileSync(join(ORDNER, datei), 'utf8');

function dateiliste() {
  const treffer = lies('.github/workflows/veroeffentlichen.yml').match(/^\s*DATEIEN:\s*"([^"]+)"/m);
  assert.ok(treffer, 'Zeile DATEIEN: "…" im Workflow fehlt');
  return treffer[1].trim().split(/\s+/);
}

function huelle() {
  const block = lies('sw.js').match(/const HUELLE = \[([\s\S]*?)\];/);
  assert.ok(block, 'HUELLE in sw.js nicht gefunden');
  return [...block[1].matchAll(/'\.\/([^']*)'/g)].map((t) => t[1]).filter((e) => e !== '');
}

test('jede Datei der App-Hülle wird veröffentlicht', () => {
  const liste = dateiliste();
  const eintraege = huelle();
  assert.ok(eintraege.length > 5, 'HUELLE zu kurz gelesen');
  for (const e of eintraege) {
    assert.ok(liste.some((d) => e === d || e.startsWith(d + '/')), e);
  }
});

test('jeder Listeneintrag existiert', () => {
  for (const d of dateiliste()) assert.ok(existsSync(join(ORDNER, d)), d);
});

test('symbol.html wird nicht veröffentlicht', () => {
  const liste = dateiliste();
  assert.ok(!liste.includes('icons'));
  assert.ok(!liste.includes('icons/symbol.html'));
});
