const CACHE_NAME = 'mural-cache-v5';
const OFFLINE_URL = './offline.html';

const ASSETS = [
    './',
    './index.html',
    './offline.html',
    './styles.css',
    './verificarconexao.js',
    './icons/192.png',
    // './icons/512.png',
    './icons/apple-icon-180.png'
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
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(resp => resp || caches.match(OFFLINE_URL));
        })
    );
});