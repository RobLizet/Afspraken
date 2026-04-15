// Onze Agenda – Service Worker
// Versie: 2026-v3 (geen Firebase importScripts, directe push handler)

const CACHE = “agenda-roblizet-v3”;
const ASSETS = [
“./index.html”,
“./manifest.json”,
“./icon-192.png”,
“./icon-512.png”,
“./icon-maskable-512.png”
];

// Cache installatie
self.addEventListener(“install”, e => {
e.waitUntil(
caches.open(CACHE)
.then(c => c.addAll(ASSETS))
.then(() => self.skipWaiting())
);
});

// Oude caches opruimen
self.addEventListener(“activate”, e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
).then(() => self.clients.claim())
);
});

// Fetch strategie: cache-first voor assets, network voor API calls
self.addEventListener(“fetch”, e => {
const url = e.request.url;
if (
url.includes(“firebasedatabase.app”) ||
url.includes(“firebaseapp.com”) ||
url.includes(“gstatic.com”) ||
url.includes(“googleapis.com”) ||
url.includes(“fonts.googleapis.com”)
) return;
e.respondWith(
caches.match(e.request).then(cached => cached || fetch(e.request))
);
});

// FCM push ontvangen terwijl app GESLOTEN is
self.addEventListener(“push”, e => {
let title = “Onze Agenda”;
let body  = “Je hebt een herinnering”;
try {
const data = e.data.json();
title = data.notification?.title || data.title || title;
body  = data.notification?.body  || data.body  || body;
} catch {}
e.waitUntil(
self.registration.showNotification(title, {
body,
icon:    “./icon-192.png”,
badge:   “./icon-192.png”,
vibrate: [200, 100, 200]
})
);
});

// Klik op melding → open de app
self.addEventListener(“notificationclick”, e => {
e.notification.close();
e.waitUntil(
clients.matchAll({ type: “window”, includeUncontrolled: true }).then(list => {
for (const client of list) {
if (client.url.includes(“index.html”) && “focus” in client) return client.focus();
}
return clients.openWindow(”./index.html”);
})
);
});
