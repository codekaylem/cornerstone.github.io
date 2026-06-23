/* Cornerstone — service worker. Precaches the full app shell so the whole
   confession + lessons work offline. ESV passages fetched from the API are
   cached at runtime (cache-first), so any verse you've opened once stays
   available with no signal. Bump CACHE_VERSION to force-refresh clients. */
const CACHE_VERSION = 'cornerstone-v1';
const SHELL_CACHE = CACHE_VERSION + '-shell';
const RUNTIME_CACHE = CACHE_VERSION + '-runtime';

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './app/chapters-a.js', './app/chapters-b.js', './app/chapters-c.js',
  './app/read-1.js', './app/read-2.js', './app/read-3.js', './app/read-4.js',
  './app/read-meta.js', './app/verses.js', './app/data.js',
  './app/ios-frame.jsx', './app/ui.jsx', './app/questions.jsx',
  './app/lesson.jsx', './app/home.jsx', './app/profile.jsx',
  './app/achievements.jsx', './app/auth.jsx', './app/hearts.jsx',
  './app/onboarding.jsx', './app/read.jsx', './app/practice.jsx', './app/app.jsx',
  // CDN libraries (opaque-safe: requested with cors)
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then((c) =>
      // addAll fails the whole install if one request 404s; cache individually instead.
      Promise.all(SHELL.map((u) =>
        c.add(new Request(u, { mode: u.startsWith('http') ? 'cors' : 'same-origin' })).catch(() => null)
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // ESV API + Google Fonts → cache-first (so opened verses & fonts work offline).
  if (url.hostname === 'api.esv.org' ||
      url.hostname === 'fonts.googleapis.com' ||
      url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        } catch (err) {
          return hit || Response.error();
        }
      })
    );
    return;
  }

  // App shell + everything else → cache-first, fall back to network, then index.
  e.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() =>
        req.mode === 'navigate' ? caches.match('./index.html') : Response.error()
      )
    )
  );
});
