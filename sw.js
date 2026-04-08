const CACHE_NAME = 'georeport-v1';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './app.js',
    './db.js',
    './manifest.json',
    './offline.html'
];

// Install: Cache First para App Shell
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

// Fetch: Network First para evitar datos obsoletos en reportes
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match(e.request).then(res => {
                if (res) return res;
                if (e.request.mode === 'navigate') {
                    return caches.match('./offline.html');
                }
            });
        })
    );
});