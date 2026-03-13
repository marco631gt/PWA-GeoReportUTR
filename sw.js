const CACHE_NAME = 'version-1';
const ASSET = [
    './',
    './index.html',
    './css/style.css',
    './app.js',
    './images/main-icon.png',
    './db.js',
    //ver lo del css nuevo, QUE NO SE ME OLVIDE
];



// 1 Install 

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Pre-cacheando App Shell');
                return cache.addAll(ASSET);
            })
    )
});

// 2 Evento Activación

self.addEventListener('activate', event => {
    console.log('Sw: Service worker activo y listo para controlar la App');
});

// 3 Evento Fetch: Interceptar cada peticion al servidor

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si existe en cache, lo devolvemos; si no, vamos a la red
                return response || fetch(event.request);
            })
    );
    console.log('Sw: Interceptando peticiones, ejemplo ', event.request.url);
    if (event.request.url.includes('style.css')) {
        {
            console.log('El SW ha detectado que pides el CSS, Podemos bloquearlo o cambiarlo');
        }
    }
});