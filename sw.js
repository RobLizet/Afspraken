// Onze Agenda – Service Worker
// Versie: 2026-v1
const CACHE = "agenda-roblizet-v1";
const ASSETS = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
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
  const url = e.request.url;
  // Altijd live voor Firebase en externe scripts
  if (
    url.includes("firebasedatabase.app") ||
    url.includes("firebaseapp.com") ||
    url.includes("gstatic.com") ||
    url.includes("googleapis.com") ||
    url.includes("fonts.googleapis.com")
  ) return;

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
