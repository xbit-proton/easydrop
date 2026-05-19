const CACHE_NAME = 'visual-drop-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './Visuallogo.png',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  'https://unpkg.com/html5-qrcode'
];

// Install Lifecycle Layer
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation Layer: Flush legacy buffers
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Layer: Intercept networks for true offline compilation
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
