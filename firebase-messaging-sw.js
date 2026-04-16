// firebase-messaging-sw.js
// Dit bestand is alleen voor meldingen als de app gesloten is

importScripts('https://www.gstatic.com/firebasejs/12.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDeGP5IIWaFoG4PuISUueeccexrZOIVwGY",
  authDomain: "agenda-roblizet.firebaseapp.com",
  projectId: "agenda-roblizet",
  storageBucket: "agenda-roblizet.firebasestorage.app",
  messagingSenderId: "789902813974",
  appId: "1:789902813974:web:62231ad5f5f90b4a91fe37"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[FCM SW] Meldingen ontvangen:', payload);

  const title = payload.notification?.title || "Onze Agenda";
  const body  = payload.notification?.body  || "Je hebt een herinnering";

  self.registration.showNotification(title, {
    body: body,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    vibrate: [200, 100, 200],
    tag: "agenda-reminder"
  });
});