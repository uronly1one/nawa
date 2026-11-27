const CACHE = 'nawa-v1.0';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Data & file Supabase: selalu langsung ke jaringan
  if (url.hostname.endsWith('supabase.co')) return;

  // Cangkang aplikasi + pustaka CDN: tampil instan dari cache, diperbarui di belakang layar
  const ok = url.origin === location.origin || url.hostname === 'cdn.jsdelivr.net';
  if (!ok) return;
  e.respondWith(
    caches.open(CACHE).then(async c => {
      const hit = await c.match(req, { ignoreSearch: true });
      const net = fetch(req).then(r => { if (r && r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net || (req.mode === 'navigate' ? c.match('index.html') : undefined);
    })
  );
});
