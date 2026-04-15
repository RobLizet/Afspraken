// Onze Agenda – Service Worker met FCM
// Versie: 2026-v2
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const CACHE = "agenda-roblizet-v2";
const ASSETS = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

// Cache installatie
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Oude caches opruimen
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch strategie
self.addEventListener("fetch", e => {
  const url = e.request.url;
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

// Firebase initialiseren voor FCM
firebase.initializeApp({
  apiKey: "AIzaSyC5gP6H084hLqdczzVjhWdFXsqagTCAYkM",
  authDomain: "agenda-roblizet.firebaseapp.com",
  databaseURL: "https://agenda-roblizet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "agenda-roblizet",
  storageBucket: "agenda-roblizet.firebasestorage.app",
  messagingSenderId: "789902813974",
  appId: "1:789902813974:web:3efeb3021381b3ca91fe37"
});

const messaging = firebase.messaging();

// Melding ontvangen terwijl app GESLOTEN is
messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || "Onze Agenda";
  const body  = payload.notification?.body  || "Je hebt een herinnering";
  self.registration.showNotification(title, {
    body,
    icon:    "./icon-192.png",
    badge:   "./icon-192.png",
    vibrate: [200, 100, 200]
  });
});

// Klik op melding → open de app
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes("index.html") && "focus" in client) return client.focus();
      }
      return clients.openWindow("./index.html");
    })
  );
});
