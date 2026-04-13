const CACHE_NAME = 'paceMates-v1';
const urlsToCache = ['/index.html', '/manifest.json', '/'];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((cacheNames) => Promise.all(
        cacheNames.map((cacheName) => 
            cacheName !== CACHE_NAME && caches.delete(cacheName)
        )
    )));
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse));
            return response;
        }).catch(() => caches.match('/index.html'));
    }));
});
