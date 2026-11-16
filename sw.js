// Service Worker: hält die App-Hülle offline bereit.
// Bei jeder Änderung an Dateien der App-Hülle CACHE-Version erhöhen.
// ausgabe.json und fremde Adressen (CoinGecko) laufen ungefiltert durch; die Ausgabe-Kopie verwaltet app.js.

const CACHE = 'daily-news-v1';
const HUELLE = [
  './', './index.html', './style.css', './app.js', './render.js', './format.js', './kurse.js',
  './manifest.webmanifest',
  './fonts/source-sans-3-latin-wght.woff2', './fonts/source-serif-4-latin-700.woff2',
  './icons/icon-192.png', './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(HUELLE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(namen
        .filter((n) => n.startsWith('daily-news-v') && n !== CACHE)
        .map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/ausgabe.json')) return;

  event.respondWith(
    caches.match(request).then((treffer) => treffer || fetch(request).then((antwort) => {
      if (antwort.ok && antwort.type === 'basic') {
        const kopie = antwort.clone();
        caches.open(CACHE).then((cache) => cache.put(request, kopie));
      }
      return antwort;
    })),
  );
});
