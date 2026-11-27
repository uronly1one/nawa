const CACHE = 'nawa-v1.7';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'config.js', 'changelog.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

// Pasang: ambil file TERBARU langsung dari server (lewati cache browser), lalu aktif seketika
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(SHELL.map(u =>
        fetch(new Request(u, { cache: 'reload' })).then(r => { if (!r.ok) throw new Error(u); return c.put(u, r); })
      )))
      .then(() => self.skipWaiting())
  );
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

  // Data & file Supabase: langsung ke jaringan
  if (url.hostname.endsWith('supabase.co')) return;

  // Pustaka CDN: dari cache dulu (jarang berubah)
  if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const r = await fetch(req);
      if (r && r.ok) c.put(req, r.clone());
      return r;
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // File aplikasi: selalu cek versi terbaru dulu, cache hanya cadangan saat offline
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      const r = await fetch(new Request(req, { cache: 'no-cache' }));
      if (r && r.ok) c.put(req, r.clone());
      return r;
    } catch {
      return (await c.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? await c.match('index.html') : undefined) || Response.error();
    }
  })());
});
