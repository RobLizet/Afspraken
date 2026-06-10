const CACHE = "onze-agenda-v4.11";

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([
      "/Afspraken/",
      "/Afspraken/index.html",
      "/Afspraken/manifest.json"
    ]).catch(() => {}))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // Altijd netwerk-eerst voor HTML (zodat updates direct zichtbaar zijn)
  if(e.request.mode === "navigate" || e.request.destination === "document"){
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first voor overige assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
