const cacheName = 'nathalie-cuba-v2';
const assets = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('nathalie-cuba-') && key !== cacheName)
      .map(key => caches.delete(key))
  )));
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;

  event.respondWith(fetch(request).catch(async () => {
    const cache = await caches.open(cacheName);
    return await cache.match(request) ||
      (request.mode === 'navigate' ? await cache.match('./') : Response.error());
  }));
});
