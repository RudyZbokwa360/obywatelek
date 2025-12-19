const CACHE_NAME = 'mObywatel-cache-v1';
const ASSETS_TO_CACHE = [
  '/mObywatel/',
  '/mObywatel/index.html',
  '/mObywatel/manifest.json',
  '/mObywatel/icons/icon-192.png',
  '/mObywatel/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        if (event.request.method === 'GET' && resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return resp;
      }).catch(() => caches.match('/mObywatel/index.html'));
    })
  );
});
