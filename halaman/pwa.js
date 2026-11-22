/* Registrasi Service Worker REASON — gagal diam-diam di origin tak aman (http LAN) */
(function () {
  if (!('serviceWorker' in navigator)) return;
  addEventListener('load', function () {
    navigator.serviceWorker
      .register('sw.js')
      .catch(function (err) {
        console.warn('[pwa] SW tidak aktif (perlu HTTPS/localhost):', err && err.message);
      });
  });
})();
