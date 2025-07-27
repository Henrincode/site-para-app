const CACHE_NAME = 'mural-cache-v3';
const OFFLINE_URL = '/offline.html';        // caminho absoluto
const ASSETS = [
    '/',                                       // index
    '/index.html',
    '/offline.html',
    '/styles.css',
    '/verificarconexao.js',
    '/icons/192.png',
    '/icons/512.png',
    '/icons/apple-icon-180.png',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Se for navegação (página HTML sendo carregada)...
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // se funcionar, atualiza cache da página de navegação
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match(OFFLINE_URL))
        );
        return;
    }

    // Para outros recursos (CSS, JS, imagens)…
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
