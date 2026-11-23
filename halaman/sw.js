/* Service Worker REASON — cache-first + network refresh (stale-while-revalidate) */
const CACHE = 'reason-v12';
const CORE = [
  'beranda-reason.html',
  'tugas.html',
  'ringkasan.html',
  'dosen.html',
  'scraping.html',
  'peta.html',
  'tutor-ai.html',
  'diagnostik.html',
  'latihan.html',
  'soal.html',
  'login.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'pwa.js',
  'vendor/wobnimo.js',
  'mascots/bimo.js',
  'mascots/foku.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  // Navigasi: coba jaringan dulu, fallback ke beranda saat offline
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })  // lawan HTTP-cache: navigasi selalu HTML terbaru
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match('beranda-reason.html'))
    );
    return;
  }

  // Aset: cache-first, segarkan di latar belakang
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
