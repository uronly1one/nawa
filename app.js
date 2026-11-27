/* Nawa · Tambak Bersholawat — v1.0 */
(() => {
'use strict';
const C = window.NAWA_CONFIG;
const sb = supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const CHANGELOG = window.NAWA_CHANGELOG || [];

/* ---------- Ikon ---------- */
const I = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2 .6 3.5 2.4 3.5 5.7"/>',
  heart: '<path d="M12 20s-8-4.9-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.1 12 20 12 20z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.01"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  music: '<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 9"/>',
  file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  logout: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  comment: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
};
const ic = (n, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;

/* ---------- Anti-blok teks ---------- */
const inField = t => t && t.closest && t.closest('input,textarea');
document.addEventListener('contextmenu', e => { if (!inField(e.target)) e.preventDefault(); });
document.addEventListener('selectstart', e => { if (!inField(e.target)) e.preventDefault(); });
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('copy', e => { if (!inField(e.target)) e.preventDefault(); });

/* ---------- State ---------- */
const S = { user: null, profile: null, admin: false, route: 'beranda', arg: null };
const cache = {}; const ROWS = {}; const modals = [];
const DEF = { pustaka: 'teks', komunitas: 'kelompok', dukung: 'program' };
const ORDER = ['beranda', 'jadwal', 'pustaka', 'komunitas', 'dukung', 'profil'];
const NAV = [['beranda', 'Beranda', 'home'], ['jadwal', 'Jadwal', 'calendar'], ['pustaka', 'Pustaka', 'book'], ['komunitas', 'Komunitas', 'users'], ['dukung', 'Dukung', 'heart']];
const app = $('#app');

/* ---------- Tema ---------- */
function applyTheme() {
  const t = localStorage.getItem('nawa_theme') || 'auto';
  if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  $('meta[name=theme-color]').content = dark ? '#1b2c22' : '#4a6454';
}
applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

/* ---------- Util ---------- */
function toast(m) {
  $$('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('on'));
  setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 300); }, 2600);
}
function modal(html, { close = true } = {}) {
  const o = document.createElement('div'); o.className = 'ov';
  o.innerHTML = `<div class="md" role="dialog">${close ? `<button class="x" aria-label="Tutup">${ic('x', 20)}</button>` : ''}${html}</div>`;
  document.body.appendChild(o);
  requestAnimationFrame(() => requestAnimationFrame(() => o.classList.add('on')));
  const entry = { close: () => end(), dismissable: close };
  modals.push(entry);
  const end = () => { const i = modals.indexOf(entry); if (i >= 0) modals.splice(i, 1); o.classList.remove('on'); setTimeout(() => o.remove(), 240); };
  if (close) { o.addEventListener('click', e => { if (e.target === o) end(); }); $('.x', o).onclick = end; }
  return { el: o, close: end };
}
function confirmBox(text, ok, label = 'Hapus') {
  const m = modal(`<h3>${esc(text)}</h3><button class="btn dng" id="cy">${label}</button><button class="btn ghost" id="cn">Batal</button>`);
  $('#cn', m.el).onclick = m.close; $('#cy', m.el).onclick = () => { m.close(); ok(); };
}
const normWa = v => { let d = String(v).replace(/\D/g, ''); if (d.startsWith('0')) d = '62' + d.slice(1); else if (d.startsWith('8')) d = '62' + d; return d; };
const showWa = w => w ? '0' + w.replace(/^62/, '') : '';
const pw = p => 'nawa' + p + 'tb';
const fmtDate = d => d ? new Date(d + 'T00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
const first = n => (n || '').trim().split(/\s+/)[0] || '';
function msg(e) {
  const m = (e && (e.message || e.error_description)) || String(e);
  if (/Invalid login/i.test(m)) return 'No. WhatsApp atau PIN salah';
  if (/already registered|already been registered/i.test(m)) return 'No. WhatsApp sudah terdaftar';
  if (/profiles_wa_key|duplicate key/i.test(m)) return 'No. WhatsApp sudah terdaftar';
  if (/not confirmed/i.test(m)) return 'Akun belum aktif. Matikan "Confirm email" di Supabase';
  if (/terlalu_banyak/.test(m)) return 'Terlalu banyak percobaan. Coba lagi 15 menit lagi';
  if (/Failed to fetch|NetworkError/i.test(m)) return 'Tidak ada koneksi internet';
  return m;
}
function stagger(el) { $$('.stg', el).forEach(p => [...p.children].slice(0, 10).forEach((c, i) => c.style.setProperty('--i', i))); }
const hideSplash = () => { const s = $('#splash'); if (s) { s.classList.add('off'); setTimeout(() => s.remove(), 350); } };

/* ---------- Install ---------- */
let dip = null;
const UA = navigator.userAgent;
const IOS = /iphone|ipad|ipod/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const MOBILE_FF = /firefox/i.test(UA) && /android/i.test(UA);
const standalone = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: minimal-ui)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { } };
const ssGet = k => { try { return sessionStorage.getItem(k); } catch { return null; } };
const ssSet = (k, v) => { try { sessionStorage.setItem(k, v); } catch { } };

addEventListener('beforeinstallprompt', e => { e.preventDefault(); dip = e; setTimeout(() => installSheet('prompt'), 1500); });
addEventListener('appinstalled', () => {
  dip = null; lsSet('nawa_installed', '1'); hideSheet();
  $$('#inst,[data-a="install"]').forEach(x => x.remove());
});

// Popup Instal: muncul di browser (bukan di aplikasi yang sudah terpasang), hilang setelah terpasang
function hideSheet() { const e = $('#isheet'); if (!e) return; e.classList.remove('on'); setTimeout(() => e.remove(), 400); }
function installSheet(kind) {
  if (standalone() || lsGet('nawa_installed') || ssGet('nawa_inst_later') || $('#isheet')) return;
  const prompt = kind === 'prompt' && dip;
  const e = document.createElement('div'); e.id = 'isheet'; e.className = 'isheet';
  e.innerHTML = `<img src="icon-192.png" alt=""><div class="tx"><b>Pasang Aplikasi Tambak Bersholawat</b><small>${prompt ? 'Pasang di layar utama HP agar lebih mudah dibuka, seperti aplikasi biasa.' : 'Ketuk tombol di bawah untuk melihat cara memasangnya di layar utama HP.'}</small></div>
    <div class="acts"><button class="btn" id="is-go">${prompt ? 'Instal' : 'Lihat Caranya'}</button><button class="btn ghost" id="is-no">Nanti saja</button></div>`;
  document.body.appendChild(e);
  requestAnimationFrame(() => requestAnimationFrame(() => e.classList.add('on')));
  $('#is-no', e).onclick = () => { ssSet('nawa_inst_later', '1'); hideSheet(); };
  $('#is-go', e).onclick = async () => {
    if (prompt && dip) {
      const d = dip; dip = null; hideSheet();
      try { d.prompt(); const r = await d.userChoice; if (r.outcome !== 'accepted') ssSet('nawa_inst_later', '1'); } catch { }
    } else { ssSet('nawa_inst_later', '1'); hideSheet(); installHelp(); }
  };
}
// Peramban yang tidak punya tombol instal otomatis (iPhone/iPad, Firefox Android): tampilkan petunjuk
addEventListener('load', () => { if ((IOS || MOBILE_FF) && !standalone()) setTimeout(() => installSheet('manual'), 2200); });

function installHelp() {
  const steps = IOS
    ? '<div><b>iPhone / iPad (Safari)</b><ol><li>Ketuk tombol Bagikan (kotak dengan panah ke atas) di bagian bawah layar</li><li>Geser ke bawah, pilih "Tambah ke Layar Utama"</li><li>Ketuk Tambah</li></ol><small style="margin-top:8px">Jika bukan Safari, buka dulu link aplikasi ini di Safari.</small></div>'
    : '<div><b>Android</b><ol><li>Ketuk menu ⋮ (tiga titik) di pojok kanan atas browser</li><li>Pilih "Instal aplikasi" atau "Tambahkan ke layar utama"</li><li>Ketuk Instal</li></ol></div>';
  const m = modal(`<h3>Cara Install Aplikasi</h3>${standalone() ? '<p>Aplikasi sudah terpasang di perangkat ini.</p>' : `
    ${dip ? '<button class="btn" id="do-inst">Install Sekarang</button>' : ''}
    <div class="steps">${steps}</div>`}`);
  const b = $('#do-inst', m.el);
  if (b) b.onclick = async () => { const d = dip; dip = null; m.close(); try { d.prompt(); await d.userChoice; } catch { } };
}
function infoVersi() {
  const c = CHANGELOG[0]; if (!c) return;
  modal(`<h3>Info Aplikasi</h3><div class="cl">
    <div class="v"><b>Ver. ${esc(c.v)}</b></div>
    ${c.add?.length ? `<h4>Ditambahkan</h4><ul>${c.add.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${c.fix?.length ? `<h4>Diperbaiki</h4><ul>${c.fix.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>`);
}

/* =====================================================================
   AUTH
   ===================================================================== */
function authView(mode = 'login') {
  S.user = null; S.profile = null; S.admin = false;
  const reg = mode === 'register';
  app.innerHTML = `<div class="auth view">
    <img class="logo" src="icon-192.png" alt="">
    <h1>Tambak Bersholawat</h1>
    <p class="sub">${reg ? 'Daftar untuk memakai semua fitur' : 'Masuk untuk melanjutkan'}</p>
    <form id="fa" autocomplete="off">
      ${reg ? `<label class="fld"><span>Nama Sesuai KTP</span><input name="nama" required autocomplete="name"></label>` : ''}
      <label class="fld"><span>No. WhatsApp</span><input name="wa" inputmode="tel" required autocomplete="tel" placeholder="08xxxxxxxxxx"></label>
      ${reg ? `<label class="fld"><span>Alamat</span><textarea name="alamat" rows="2" required></textarea></label>` : ''}
      <label class="fld"><span>${reg ? 'Buat PIN (4 angka)' : 'PIN'}</span><input class="pin" name="pin" type="password" inputmode="numeric" maxlength="4" pattern="\\d{4}" required placeholder="••••" autocomplete="off"></label>
      <button class="btn">${reg ? 'Daftar' : 'Masuk'}</button>
    </form>
    <div class="links">${reg ? '<span></span><button id="sw">Sudah punya akun? Masuk</button>' : '<button id="lupa">Lupa PIN?</button><button id="sw">Belum punya akun? Daftar</button>'}</div>
    ${standalone() ? '' : `<button class="corner l" id="inst" aria-label="Cara install">${ic('download', 20)}</button>`}
    <button class="corner r" id="adm" aria-label="Login admin">${ic('shield', 20)}</button>
  </div>`;
  $('#sw').onclick = () => authView(reg ? 'login' : 'register');
  if ($('#inst')) $('#inst').onclick = installHelp;
  $('#adm').onclick = adminLogin;
  if (!reg) $('#lupa').onclick = lupaPin;
  $('#fa').onsubmit = async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target)); const b = $('.btn', e.target);
    const wa = normWa(f.wa);
    if (wa.length < 10 || wa.length > 15) return toast('No. WhatsApp tidak valid');
    if (!/^\d{4}$/.test(f.pin)) return toast('PIN harus 4 angka');
    if (reg && (!f.nama.trim() || !f.alamat.trim())) return toast('Semua kolom wajib diisi');
    b.disabled = true;
    try {
      if (reg) {
        const { data, error } = await sb.auth.signUp({ email: wa + '@nawa.app', password: pw(f.pin), options: { data: { nama: f.nama.trim(), wa, alamat: f.alamat.trim(), pin: f.pin } } });
        if (error) throw error;
        if (!data.session) throw new Error('Akun belum aktif. Matikan "Confirm email" di Supabase');
      } else {
        const { error } = await sb.auth.signInWithPassword({ email: wa + '@nawa.app', password: pw(f.pin) });
        if (error) throw error;
      }
      await enter();
    } catch (err) { toast(msg(err)); b.disabled = false; }
  };
}

function adminLogin() {
  const m = modal(`<h3>Login Admin</h3><form><label class="fld"><span>Email</span><input name="e" type="email" required autocomplete="username"></label><label class="fld"><span>Password</span><input name="p" type="password" required autocomplete="current-password"></label><button class="btn">Masuk</button></form>`);
  $('form', m.el).onsubmit = async e => {
    e.preventDefault(); const b = $('.btn', m.el); b.disabled = true;
    const f = Object.fromEntries(new FormData(e.target));
    try {
      const { data, error } = await sb.auth.signInWithPassword({ email: f.e.trim(), password: f.p });
      if (error) throw error;
      const { data: a } = await sb.from('admins').select('user_id').eq('user_id', data.user.id).maybeSingle();
      if (!a) { await sb.auth.signOut(); throw new Error('Akun ini bukan admin'); }
      m.close(); await enter();
    } catch (err) { toast(msg(err)); b.disabled = false; }
  };
}

function lupaPin() {
  const m = modal(`<h3>Lupa PIN</h3><p class="mu">Isi data sesuai saat Anda mendaftar.</p><form>
    <label class="fld"><span>Nama</span><input name="nama" required></label>
    <label class="fld"><span>No. WhatsApp</span><input name="wa" inputmode="tel" required></label>
    <label class="fld"><span>Alamat (opsional)</span><textarea name="alamat" rows="2"></textarea></label>
    <button class="btn">Tampilkan PIN</button></form>`);
  $('form', m.el).onsubmit = async e => {
    e.preventDefault(); const b = $('.btn', m.el); b.disabled = true;
    const f = Object.fromEntries(new FormData(e.target));
    try {
      const { data, error } = await sb.rpc('lupa_pin', { p_nama: f.nama, p_wa: normWa(f.wa), p_alamat: f.alamat || null });
      if (error) throw error;
      if (!data) { toast('Data tidak cocok'); b.disabled = false; return; }
      m.close();
      setTimeout(() => {
        const r = modal(`<h3>PIN Anda</h3><div class="bigpin">${esc(data)}</div><button class="btn" id="bk">Kembali ke Login</button>`);
        $('#bk', r.el).onclick = r.close;
      }, 200);
    } catch (err) { toast(msg(err)); b.disabled = false; }
  };
}

/* ---------- Masuk ke aplikasi ---------- */
async function enter() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { authView('login'); hideSplash(); return; }
  S.user = session.user;
  const [p, a] = await Promise.all([
    sb.from('profiles').select('*').eq('id', S.user.id).maybeSingle(),
    sb.from('admins').select('user_id').eq('user_id', S.user.id).maybeSingle()
  ]);
  S.profile = p.data; S.admin = !!a.data;
  if (!S.profile && !S.admin) {
    await sb.auth.signOut(); authView('login'); hideSplash();
    toast(p.error ? msg(p.error) : 'Data akun tidak ditemukan'); return;
  }
  shell(); hideSplash();
  if (!S.admin && !S.profile.foto_url) gate();
}

/* =====================================================================
   CANGKANG APLIKASI
   ===================================================================== */
function avatarHtml() {
  if (S.profile?.foto_url) return `<img src="${esc(S.profile.foto_url)}" alt="">`;
  return `<b>${esc((S.profile?.nama || 'A')[0].toUpperCase())}</b>`;
}
const updAv = () => { const a = $('#b-prof'); if (a) a.innerHTML = avatarHtml(); };

function shell() {
  app.innerHTML = `
    <header class="top">
      <button class="ib" id="b-info" aria-label="Info aplikasi">${ic('info', 24)}</button>
      <h1>Tambak Bersholawat</h1>
      <button class="ib av" id="b-prof" aria-label="Profil">${avatarHtml()}</button>
    </header>
    <main id="main"></main>
    <nav class="bot"><i class="ind"></i>${NAV.map(([r, l, i]) => `<button data-r="${r}">${ic(i, 23)}<span>${l}</span></button>`).join('')}</nav>`;
  $('#b-info').onclick = infoVersi;
  $('#b-prof').onclick = () => go('profil');
  $('.bot').onclick = e => { const b = e.target.closest('button'); if (b && b.dataset.r !== S.route) go(b.dataset.r); };
  $('#main').onclick = onAction;
  S.route = 'beranda';
  history.replaceState({ r: 'beranda', a: null }, '');
  go('beranda', undefined, false, true);
}

function go(r, arg, still, fromPop) {
  const main = $('#main'); if (!main) return;
  const prev = ORDER.indexOf(S.route), st = main.scrollTop;
  const was = S.route;
  S.route = r; S.arg = arg ?? DEF[r] ?? null;
  if (!still && !fromPop) { const stt = { r, a: S.arg }; if (r !== was) history.pushState(stt, ''); else history.replaceState(stt, ''); }
  $$('.bot button').forEach(b => b.classList.toggle('on', b.dataset.r === r));
  const ix = NAV.findIndex(n => n[0] === r), ind = $('.ind');
  if (ind) { ind.style.opacity = ix < 0 ? 0 : 1; ind.style.transform = `translateX(${Math.max(ix, 0) * 100}%)`; }
  const v = document.createElement('div');
  v.className = 'view' + (still ? ' still' : '');
  v.style.setProperty('--dx', (ORDER.indexOf(r) >= prev ? 14 : -14) + 'px');
  main.replaceChildren(v);
  V[r](v); stagger(v);
  main.scrollTop = still ? st : 0;
}
const refresh = () => go(S.route, S.arg, true);

/* ---------- Data ---------- */
function load(t, cb) {
  if (cache[t]) cb(cache[t]);
  sb.from(t).select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
    if (error) { if (!cache[t]) cb(null, error); return; }
    if (!cache[t] || JSON.stringify(cache[t]) !== JSON.stringify(data)) { cache[t] = data; cb(data); }
  });
}
const SK = '<div class="sk"></div><div class="sk"></div><div class="sk"></div>';
function fill(el, tb, rows, err, render, empty) {
  if (err) { el.innerHTML = `<div class="empty">Gagal memuat.<br>${esc(msg(err))}</div>`; return; }
  rows.forEach(r => ROWS[tb + ':' + r.id] = r);
  el.innerHTML = rows.length ? rows.map(render).join('') : `<div class="empty">${empty}</div>`;
  stagger(el.parentElement || el);
  [...el.children].slice(0, 10).forEach((c, i) => c.style.setProperty('--i', i));
}
const admBtns = (tb, r) => S.admin ? `<div class="adm"><button data-a="ed:${tb}:${r.id}" aria-label="Ubah">${ic('edit', 18)}</button><button class="dl" data-a="del:${tb}:${r.id}" aria-label="Hapus">${ic('trash', 18)}</button></div>` : '';
const fab = tb => S.admin ? `<button class="fab" data-a="add:${tb}" aria-label="Tambah">${ic('plus', 26)}</button>` : '';
const head = (t, s) => `<div class="head"><h2>${t}</h2><p>${s}</p></div>`;
const seg = (opts, cur) => `<div class="seg">${opts.map(([k, l]) => `<button data-a="arg:${k}" class="${k === cur ? 'on' : ''}">${l}</button>`).join('')}</div>`;

/* ---------- Konfigurasi form admin ---------- */
const T = {
  pengumuman: { label: 'Kabar', fields: [{ k: 'isi', l: 'Isi pengumuman', t: 'textarea', req: 1 }] },
  agenda: { label: 'Agenda', fields: [
    { k: 'judul', l: 'Nama kegiatan', req: 1 }, { k: 'jenis', l: 'Jenis', t: 'select', o: ['rutin', 'tahunan', 'khusus'] },
    { k: 'hari', l: 'Hari (untuk rutinan, mis. Malam Jumat)' }, { k: 'tanggal', l: 'Tanggal (untuk acara tertentu)', t: 'date' },
    { k: 'waktu', l: 'Jam' }, { k: 'lokasi', l: 'Lokasi' }, { k: 'keterangan', l: 'Keterangan', t: 'textarea' }] },
  pustaka: { label: 'Pustaka', fields: [
    { k: 'judul', l: 'Judul', req: 1 }, { k: 'kategori', l: 'Kategori', t: 'select', o: ['teks', 'ebook', 'audio', 'arsip'] },
    { k: 'isi', l: 'Teks (untuk kategori teks)', t: 'textarea' }, { k: 'url', l: 'Tautan file (ebook / audio / arsip)', t: 'file' }] },
  kelompok: { label: 'Kelompok', fields: [{ k: 'nama', l: 'Nama kelompok', req: 1 }, { k: 'info', l: 'Info', t: 'textarea' }, { k: 'kontak', l: 'Kontak' }] },
  galeri: { label: 'Foto', fields: [{ k: 'judul', l: 'Keterangan' }, { k: 'foto_url', l: 'Foto', t: 'file', img: 1, req: 1 }] },
  usulan: { label: 'Usulan', fields: [{ k: 'judul', l: 'Judul usulan', req: 1 }, { k: 'isi', l: 'Isi usulan', t: 'textarea' }] },
  program: { label: 'Program', fields: [{ k: 'judul', l: 'Nama program', req: 1 }, { k: 'keterangan', l: 'Keterangan', t: 'textarea' }, { k: 'status', l: 'Status (mis. Berjalan / Selesai)' }] },
  donasi: { label: 'Kanal Donasi', fields: [{ k: 'nama_kanal', l: 'Nama kanal (mis. BRI, DANA)', req: 1 }, { k: 'nomor', l: 'Nomor rekening / HP' }, { k: 'atas_nama', l: 'Atas nama' }, { k: 'keterangan', l: 'Keterangan', t: 'textarea' }] },
  laporan: { label: 'Laporan', fields: [{ k: 'judul', l: 'Judul', req: 1 }, { k: 'tanggal', l: 'Tanggal', t: 'date' }, { k: 'isi', l: 'Isi laporan', t: 'textarea' }] }
};
function fld(f, v = '') {
  const r = f.req ? 'required' : '';
  if (f.t === 'textarea') return `<label class="fld"><span>${f.l}</span><textarea name="${f.k}" rows="4" ${r}>${esc(v)}</textarea></label>`;
  if (f.t === 'select') return `<label class="fld"><span>${f.l}</span><select name="${f.k}">${f.o.map(o => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('')}</select></label>`;
  if (f.t === 'file') return `<label class="fld"><span>${f.l}</span><input name="${f.k}" value="${esc(v)}" placeholder="Tempel tautan, atau pilih file di bawah"><input type="file" name="${f.k}__file" accept="${f.img ? 'image/*' : '*/*'}"></label>`;
  return `<label class="fld"><span>${f.l}</span><input name="${f.k}" type="${f.t || 'text'}" value="${esc(v)}" ${r}></label>`;
}
async function upload(file) {
  const p = Date.now() + '_' + file.name.replace(/[^\w.]+/g, '_');
  const { error } = await sb.storage.from('media').upload(p, file);
  if (error) throw error;
  return sb.storage.from('media').getPublicUrl(p).data.publicUrl;
}
function editor(tb, row) {
  const c = T[tb];
  const m = modal(`<h3>${row ? 'Ubah' : 'Tambah'} ${c.label}</h3><form>${c.fields.map(f => fld(f, row?.[f.k] ?? '')).join('')}<button class="btn">Simpan</button></form>`);
  $('form', m.el).onsubmit = async e => {
    e.preventDefault(); const b = $('.btn', m.el); b.disabled = true;
    try {
      const fd = new FormData(e.target), o = {};
      for (const f of c.fields) {
        let v = (fd.get(f.k) || '').toString().trim() || null;
        if (f.t === 'file') { const file = fd.get(f.k + '__file'); if (file && file.size) { b.textContent = 'Mengunggah…'; v = await upload(file); } }
        if (f.req && !v) throw new Error(`${f.l} wajib diisi`);
        o[f.k] = v;
      }
      if (tb === 'usulan' && !row) { o.user_id = S.user.id; o.nama = S.profile?.nama || 'Anggota'; }
      const { error } = row ? await sb.from(tb).update(o).eq('id', row.id) : await sb.from(tb).insert(o);
      if (error) throw error;
      m.close(); toast('Tersimpan'); refresh();
    } catch (err) { toast(msg(err)); b.disabled = false; b.textContent = 'Simpan'; }
  };
}

/* ---------- Aksi (event delegation) ---------- */
function onAction(e) {
  const t = e.target.closest('[data-a]'); if (!t) return;
  const [a, x, y] = t.dataset.a.split(':');
  if (a === 'go') go(x, y || undefined);
  else if (a === 'arg') go(S.route, x);
  else if (a === 'add') editor(x);
  else if (a === 'ed') editor(x, ROWS[x + ':' + y]);
  else if (a === 'del') confirmBox('Hapus item ini?', async () => {
    const { error } = await sb.from(x).delete().eq('id', y);
    if (error) return toast(msg(error));
    cache[x] = (cache[x] || []).filter(r => r.id !== y); toast('Dihapus'); refresh();
  });
  else if (a === 'open') openItem(ROWS[x + ':' + y]);
  else if (a === 'img') openImg(ROWS['galeri:' + x]);
  else if (a === 'copy') { navigator.clipboard?.writeText(t.dataset.v || '').then(() => toast('Nomor disalin'), () => toast('Gagal menyalin')); }
  else if (a === 'like') toggleLike(x);
  else if (a === 'coms') openComments(x);
  else if (a === 'post') composePost();
  else if (a === 'delpost') confirmBox('Hapus postingan ini?', () => deletePost(x));
  else if (a === 'update') cekUpdate();
  else if (a === 'install') installHelp();
  else if (a === 'info') infoVersi();
  else if (a === 'photo') changePhoto();
  else if (a === 'theme') { localStorage.setItem('nawa_theme', x); applyTheme(); refresh(); }
  else if (a === 'logout') confirmBox('Keluar dari aplikasi?', async () => { S.user = null; await sb.auth.signOut(); Object.keys(cache).forEach(k => delete cache[k]); FEED = null; authView('login'); }, 'Keluar');
}

/* =====================================================================
   HALAMAN
   ===================================================================== */
const V = {};

V.beranda = el => {
  const name = S.admin ? 'Admin' : first(S.profile?.nama);
  const qa = [['Jadwal', 'calendar', 'go:jadwal'], ['Teks Sholawat', 'book', 'go:pustaka:teks'], ['Audio', 'music', 'go:pustaka:audio'],
              ['Galeri', 'image', 'go:komunitas:galeri'], ['Donasi', 'heart', 'go:dukung:donasi'], ['Usulan', 'users', 'go:komunitas:usulan']];
  el.innerHTML = `<div class="tkw"><div class="ticker"><div class="tk-ic">📢</div><div class="tk-win st" id="tk">Memuat kabar…</div></div></div>
    <div class="pad stg">
      <div class="greet"><small>Assalamu'alaikum,</small><h2>${esc(name)}</h2><small class="tg">Bersholawat bersama, hati jadi tenang</small></div>
      <div class="banner" id="bn"><span class="chip">Agenda Terdekat</span><h3>Memuat…</h3></div>
      <h2 class="sec">Akses Cepat</h2>
      <div class="grid">${qa.map(([l, i, a], n) => `<button class="qa" data-a="${a}"><i class="t${n % 3}">${ic(i, 22)}</i>${l}</button>`).join('')}</div>
      ${dzikirCard()}
      <div class="sec-row"><h2 class="sec">Kabar Jama'ah</h2>${S.admin ? `<button class="mini" data-a="post">${ic('plus', 14)} Postingan</button>` : ''}</div>
      <div class="feed" id="feed">${FSK}</div>
    </div>`;
  loadFeed();
  load('pengumuman', (rows, err) => {
    const tk = $('#tk', el); if (!tk) return;
    if (!err && rows.length) {
      const txt = rows.map(r => r.isi.replace(/\s+/g, ' ')).join('  ✦  ');
      const rep = Math.max(1, Math.ceil(140 / txt.length));
      const half = `<span>${esc((txt + '  ✦  ').repeat(rep))}</span>`;
      tk.className = 'tk-win'; tk.innerHTML = `<div class="track" style="--d:${Math.max(18, txt.length * rep * 0.2)}s">${half}${half}</div>`;
    } else { tk.className = 'tk-win st'; tk.textContent = 'Belum ada pengumuman'; }
  });
  load('agenda', rows => {
    const bn = $('#bn', el); if (!bn) return;
    const today = new Date().toISOString().slice(0, 10);
    const next = rows.filter(r => r.tanggal && r.tanggal >= today).sort((a, b) => a.tanggal.localeCompare(b.tanggal))[0] || rows.find(r => r.jenis === 'rutin') || rows[0];
    bn.innerHTML = next
      ? `<span class="chip">Agenda Terdekat</span><h3>${esc(next.judul)}</h3><div class="meta"><span>${ic('calendar', 14)} ${esc(next.tanggal ? fmtDate(next.tanggal) : next.hari || '')}${next.waktu ? ' · ' + esc(next.waktu) : ''}</span>${next.lokasi ? `<span>${ic('pin', 14)} ${esc(next.lokasi)}</span>` : ''}</div><button class="bpill" data-a="go:jadwal">Lihat Jadwal →</button>`
      : '<span class="chip">Agenda Terdekat</span><h3>Belum ada agenda</h3>';
  });
};

V.jadwal = el => {
  el.innerHTML = head('Jadwal & Lokasi', 'Majelis rutin dan acara tahunan') + `<div class="pad stg" id="ls">${SK}</div>` + fab('agenda');
  load('agenda', (rows, err) => {
    const ls = $('#ls', el); if (!ls) return;
    const today = new Date().toISOString().slice(0, 10);
    const ord = r => (r.jenis === 'rutin' ? 0 : 1) + '' + (r.tanggal || '9999');
    const sorted = rows ? [...rows].sort((a, b) => ord(a).localeCompare(ord(b))) : rows;
    fill(ls, 'agenda', sorted, err, r => {
      const d = r.tanggal ? new Date(r.tanggal + 'T00:00') : null;
      const badge = d ? `<div class="dt"><div>${d.getDate()}<span>${d.toLocaleDateString('id-ID', { month: 'short' })}</span></div></div>` : `<div class="dt">${ic('calendar', 24)}</div>`;
      const past = r.tanggal && r.tanggal < today ? ' style="opacity:.6"' : '';
      return `<div class="card row"${past}>${badge}<div class="bd"><b>${esc(r.judul)}</b><small>${esc(r.tanggal ? fmtDate(r.tanggal) : r.hari || '')}${r.waktu ? ' · ' + esc(r.waktu) : ''} · ${esc(r.jenis)}</small>${r.lokasi ? `<small>${ic('pin', 13)} ${esc(r.lokasi)}</small>` : ''}${r.keterangan ? `<small>${esc(r.keterangan)}</small>` : ''}</div>${admBtns('agenda', r)}</div>`;
    }, 'Belum ada agenda');
  });
};

V.pustaka = el => {
  const cur = S.arg;
  el.innerHTML = head('Pustaka Sholawat & Kajian', 'Teks, ebook, audio, dan arsip jama\'ah') +
    seg([['teks', 'Teks Sholawat'], ['ebook', 'Ebook'], ['audio', 'Audio'], ['arsip', 'Arsip']], cur) +
    `<div class="pad stg" id="ls">${SK}</div>` + fab('pustaka');
  load('pustaka', (rows, err) => {
    const ls = $('#ls', el); if (!ls) return;
    const list = rows ? rows.filter(r => r.kategori === cur) : rows;
    const icon = { teks: 'book', ebook: 'file', audio: 'music', arsip: 'file' }[cur];
    fill(ls, 'pustaka', list, err, r => `<div class="card row tap" data-a="open:pustaka:${r.id}"><div class="dt">${ic(icon, 24)}</div><div class="bd"><b>${esc(r.judul)}</b><small>${r.isi ? esc(r.isi.slice(0, 70)) + '…' : esc(r.kategori)}</small></div>${admBtns('pustaka', r)}</div>`, 'Belum ada isi pada kategori ini');
  });
};
function openItem(r) {
  if (!r) return;
  let body = '';
  if (r.kategori === 'teks') body = `<div class="txt arab" dir="auto">${esc(r.isi || '')}</div>`;
  else if (r.kategori === 'audio' && r.url) body = `<audio controls preload="none" src="${esc(r.url)}"></audio>`;
  else if (r.url) body = `<a class="btn" style="display:block;text-align:center;text-decoration:none" href="${esc(r.url)}" target="_blank" rel="noopener">Buka ${esc(r.kategori)}</a>`;
  if (r.kategori !== 'teks' && r.isi) body = `<p class="txt">${esc(r.isi)}</p>` + body;
  modal(`<h3>${esc(r.judul)}</h3>${body || '<p class="mu">Belum ada isi.</p>'}`);
}

V.komunitas = el => {
  const cur = S.arg;
  el.innerHTML = head('Komunitas', 'Kelompok, usulan, dan galeri kegiatan') + seg([['kelompok', 'Kelompok'], ['usulan', 'Papan Usulan'], ['galeri', 'Galeri']], cur) +
    `<div class="pad stg" id="ls">${SK}</div>` + (cur === 'usulan' ? `<button class="fab" data-a="add:usulan" aria-label="Kirim usulan">${ic('plus', 26)}</button>` : fab(cur));
  load(cur, (rows, err) => {
    const ls = $('#ls', el); if (!ls) return;
    if (cur === 'kelompok') fill(ls, cur, rows, err, r => `<div class="card row"><div class="dt">${ic('users', 24)}</div><div class="bd"><b>${esc(r.nama)}</b>${r.info ? `<small>${esc(r.info)}</small>` : ''}${r.kontak ? `<small>${esc(r.kontak)}</small>` : ''}</div>${admBtns(cur, r)}</div>`, 'Belum ada kelompok');
    else if (cur === 'usulan') fill(ls, cur, rows, err, r => {
      const mine = r.user_id === S.user.id;
      const btn = S.admin || mine ? `<div class="adm"><button class="dl" data-a="del:usulan:${r.id}" aria-label="Hapus">${ic('trash', 18)}</button></div>` : '';
      return `<div class="card row"><div class="bd"><b>${esc(r.judul)}</b>${r.isi ? `<small>${esc(r.isi)}</small>` : ''}<small>— ${esc(r.nama || 'Anggota')}</small></div>${btn}</div>`;
    }, 'Belum ada usulan. Ketuk + untuk mengirim');
    else {
      if (err) return fill(ls, cur, rows, err, () => '', '');
      rows.forEach(r => ROWS['galeri:' + r.id] = r);
      ls.className = 'pad';
      ls.innerHTML = rows.length ? `<div class="gal">${rows.map((r, i) => `<figure style="animation-delay:${Math.min(i, 8) * 45}ms"><img loading="lazy" src="${esc(r.foto_url)}" alt="" data-a="img:${r.id}">${r.judul ? `<figcaption>${esc(r.judul)}</figcaption>` : ''}${admBtns('galeri', r)}</figure>`).join('')}</div>` : '<div class="empty">Belum ada foto</div>';
    }
  });
};
function openImg(r) { if (r) modal(`<div class="lb"><img src="${esc(r.foto_url)}" alt="">${r.judul ? `<p style="margin-top:10px">${esc(r.judul)}</p>` : ''}</div>`); }

V.dukung = el => {
  const cur = S.arg;
  el.innerHTML = head('Transparansi & Dukungan', 'Program sosial, donasi, dan laporan kegiatan') + seg([['program', 'Program Sosial'], ['donasi', 'Donasi / Infak'], ['laporan', 'Laporan']], cur) +
    `<div class="pad stg" id="ls">${SK}</div>` + fab(cur);
  load(cur, (rows, err) => {
    const ls = $('#ls', el); if (!ls) return;
    if (cur === 'program') fill(ls, cur, rows, err, r => `<div class="card row"><div class="dt">${ic('heart', 24)}</div><div class="bd"><b>${esc(r.judul)}</b>${r.status ? `<small>Status: ${esc(r.status)}</small>` : ''}${r.keterangan ? `<small>${esc(r.keterangan)}</small>` : ''}</div>${admBtns(cur, r)}</div>`, 'Belum ada program');
    else if (cur === 'donasi') fill(ls, cur, rows, err, r => `<div class="card row"><div class="bd"><b>${esc(r.nama_kanal)}</b>${r.nomor ? `<b style="font-size:18px;letter-spacing:.5px;margin-top:2px">${esc(r.nomor)}</b>` : ''}${r.atas_nama ? `<small>a.n. ${esc(r.atas_nama)}</small>` : ''}${r.keterangan ? `<small>${esc(r.keterangan)}</small>` : ''}</div>${r.nomor ? `<div class="adm"><button data-a="copy" data-v="${esc(r.nomor)}" aria-label="Salin">${ic('copy', 18)}</button></div>` : ''}${admBtns(cur, r)}</div>`, 'Belum ada kanal donasi');
    else fill(ls, cur, rows, err, r => `<div class="card row"><div class="bd"><b>${esc(r.judul)}</b>${r.tanggal ? `<small>${esc(fmtDate(r.tanggal))}</small>` : ''}${r.isi ? `<small class="txt" style="margin-top:6px;white-space:pre-wrap">${esc(r.isi)}</small>` : ''}</div>${admBtns(cur, r)}</div>`, 'Belum ada laporan');
  });
};

V.profil = el => {
  const p = S.profile, th = localStorage.getItem('nawa_theme') || 'auto';
  const photo = p?.foto_url ? `<img src="${esc(p.foto_url)}" alt="">` : esc((p?.nama || 'A')[0].toUpperCase());
  el.innerHTML = `<div class="pad stg">
    <div class="card idcard"><div class="avwrap"><div class="avbig">${S.admin ? ic('shield', 40) : photo}</div>${S.admin ? '' : `<button class="camb" data-a="photo" aria-label="Ganti foto">${ic('camera', 17)}</button>`}</div>
      <b style="font-size:18px">${esc(S.admin ? 'Administrator' : p.nama)}</b><small>${esc(S.admin ? S.user.email : showWa(p.wa))}</small>${S.admin ? '<span class="badge">Admin</span>' : '<span class="badge">Anggota</span>'}</div>
    ${S.admin ? '' : `<div class="card"><h2 class="sec" style="margin:0 0 10px">Keanggotaan</h2>
      <form id="fp"><label class="fld"><span>Nama</span><input value="${esc(p.nama)}" disabled></label>
      <label class="fld"><span>No. WhatsApp</span><input value="${esc(showWa(p.wa))}" disabled></label>
      <label class="fld"><span>Alamat</span><textarea name="alamat" rows="3" required>${esc(p.alamat)}</textarea></label>
      <button class="btn">Simpan Alamat</button></form></div>`}
    ${S.admin ? `<h2 class="sec">Kelola Kabar Berjalan</h2><div class="card"><div id="kb"></div><button class="btn" style="margin-top:12px" data-a="add:pengumuman">+ Tambah Kabar</button></div>` : ''}
    <h2 class="sec">Tampilan</h2>
    <div class="card" style="padding:4px 0 10px">${seg([['auto', 'Otomatis'], ['light', 'Terang'], ['dark', 'Gelap']], th).replace(/data-a="arg:/g, 'data-a="theme:')}</div>
    <div class="card" style="padding:4px 14px">
      ${standalone() ? '' : `<button class="lrow" data-a="install">${ic('download')}Cara Install Aplikasi</button>`}
      <button class="lrow" data-a="update">${ic('refresh')}Periksa Pembaruan</button>
      <button class="lrow" data-a="info">${ic('info')}Info Versi · Ver. ${esc(C.VERSION)}</button>
      <button class="lrow out" data-a="logout">${ic('logout')}Keluar</button></div>
  </div>`;
  if (S.admin) load('pengumuman', rows => {
    const kb = $('#kb', el); if (!kb || !rows) return;
    rows.forEach(r => ROWS['pengumuman:' + r.id] = r);
    kb.innerHTML = rows.map(r => `<div class="kr"><small>${esc(r.isi)}</small>${admBtns('pengumuman', r)}</div>`).join('') || '<div class="empty" style="padding:10px">Belum ada kabar</div>';
  });
  const f = $('#fp', el);
  if (f) f.onsubmit = async e => {
    e.preventDefault(); const b = $('.btn', f); b.disabled = true;
    const alamat = new FormData(f).get('alamat').trim();
    if (!alamat) { toast('Alamat wajib diisi'); b.disabled = false; return; }
    const { error } = await sb.from('profiles').update({ alamat }).eq('id', S.user.id);
    b.disabled = false;
    if (error) return toast(msg(error));
    S.profile.alamat = alamat; toast('Alamat tersimpan');
  };
};

/* ---------- Sholawat Hari Ini ---------- */
const DZ = [
  ['اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ', 'Ya Allah, limpahkanlah rahmat kepada junjungan kami Nabi Muhammad dan keluarganya.'],
  ['صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ', 'Semoga rahmat dan keselamatan Allah tercurah kepada beliau.'],
  ['حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ', 'Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.']
];
const dzikirCard = () => {
  const d = DZ[Math.floor(Date.now() / 864e5) % DZ.length];
  return `<div class="dz"><span class="chip2">Sholawat Hari Ini</span><p class="arab" dir="rtl" lang="ar">${d[0]}</p><small>${d[1]}</small></div>`;
};

/* ---------- Postingan Beranda ---------- */
let FEED = null;
const FSK = '<div class="sk" style="height:220px"></div>';
const busy = new Set();
const ago = t => {
  const s = (Date.now() - new Date(t)) / 1000;
  if (s < 60) return 'baru saja'; if (s < 3600) return Math.floor(s / 60) + ' mnt lalu';
  if (s < 86400) return Math.floor(s / 3600) + ' jam lalu'; if (s < 604800) return Math.floor(s / 86400) + ' hari lalu';
  return new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};
function postHtml(p) {
  return `<article class="post" data-id="${p.id}">
    <div class="ph"><img src="icon-192.png" alt=""><div><b>Tambak Bersholawat</b><small>${ago(p.created_at)}</small></div>${S.admin ? `<div class="adm"><button class="dl" data-a="delpost:${p.id}" aria-label="Hapus">${ic('trash', 18)}</button></div>` : ''}</div>
    ${p.gambar_url ? `<img class="pimg" loading="lazy" src="${esc(p.gambar_url)}" alt="">` : ''}
    ${p.isi ? `<p class="pt">${esc(p.isi)}</p>` : ''}
    <div class="pa"><button data-a="like:${p.id}" class="${p.liked ? 'liked' : ''}" aria-label="Suka">${ic('heart', 22)}<span>${p.likes}</span></button><button data-a="coms:${p.id}" aria-label="Komentar">${ic('comment', 22)}<span>${p.coms}</span></button></div>
  </article>`;
}
function renderFeed() {
  const box = $('#feed'); if (!box || !FEED) return;
  box.innerHTML = FEED.length ? FEED.map(postHtml).join('') : '<div class="empty">Belum ada postingan</div>';
}
function paintPost(p) {
  const a = $(`.post[data-id="${p.id}"]`); if (!a) return;
  const [lb, cb] = $$('.pa button', a);
  lb.classList.toggle('liked', p.liked); $('span', lb).textContent = p.likes; $('span', cb).textContent = p.coms;
}
async function fetchFeed() {
  const { data: posts, error } = await sb.from('posts').select('*').order('created_at', { ascending: false }).limit(20);
  if (error) throw error;
  const ids = posts.map(p => p.id); let L = [], K = [];
  if (ids.length) {
    const [a, b] = await Promise.all([sb.from('post_likes').select('post_id,user_id').in('post_id', ids), sb.from('post_comments').select('post_id').in('post_id', ids)]);
    L = a.data || []; K = b.data || [];
  }
  return posts.map(p => ({ ...p, likes: L.filter(x => x.post_id === p.id).length, liked: L.some(x => x.post_id === p.id && x.user_id === S.user.id), coms: K.filter(x => x.post_id === p.id).length }));
}
function loadFeed() {
  if (FEED) renderFeed();
  fetchFeed().then(f => { if (!FEED || JSON.stringify(FEED) !== JSON.stringify(f)) { FEED = f; renderFeed(); } })
    .catch(err => { if (!FEED) { const b = $('#feed'); if (b) b.innerHTML = `<div class="empty">Gagal memuat postingan.<br>${esc(msg(err))}</div>`; } });
}
async function toggleLike(id) {
  const p = FEED?.find(x => x.id === id); if (!p || busy.has(id)) return;
  busy.add(id); const was = p.liked;
  p.liked = !was; p.likes += was ? -1 : 1; paintPost(p);
  const { error } = was ? await sb.from('post_likes').delete().eq('post_id', id).eq('user_id', S.user.id) : await sb.from('post_likes').insert({ post_id: id, user_id: S.user.id });
  busy.delete(id);
  if (error) { p.liked = was; p.likes += was ? 1 : -1; paintPost(p); toast(msg(error)); }
}
async function deletePost(id) {
  const p = FEED?.find(x => x.id === id);
  const { error } = await sb.from('posts').delete().eq('id', id);
  if (error) return toast(msg(error));
  if (p?.gambar_url) { const n = p.gambar_url.split('/posts/')[1]; if (n) sb.storage.from('posts').remove([decodeURIComponent(n.split('?')[0])]); }
  FEED = FEED.filter(x => x.id !== id); renderFeed(); toast('Postingan dihapus');
}
function pickImage() {
  return new Promise(res => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = () => res(i.files[0] || null); i.click(); });
}
// Kecilkan gambar sampai <= 1 MB (maks. sisi 1280px, JPEG)
async function shrink(file) {
  const LIMIT = 1000000;
  try {
    const bm = await createImageBitmap(file), k = Math.min(1, 1280 / Math.max(bm.width, bm.height));
    const w = Math.round(bm.width * k), h = Math.round(bm.height * k);
    for (let sc = 1; sc >= .4; sc -= .15) {
      const c = document.createElement('canvas'); c.width = Math.round(w * sc); c.height = Math.round(h * sc);
      c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height);
      for (let q = .85; q >= .5; q -= .1) {
        const b = await new Promise(r => c.toBlob(r, 'image/jpeg', q));
        if (b && b.size <= LIMIT) return b;
      }
    }
  } catch { }
  return null;
}
function composePost() {
  let blob = null;
  const m = modal(`<h3>Buat Postingan</h3><form>
    <label class="fld"><span>Tulisan</span><textarea name="isi" rows="4" maxlength="2000"></textarea></label>
    <div class="gp"><div class="pv" id="pv"></div><button type="button" class="btn ghost" id="ppick" style="width:auto;padding:10px 20px">Pilih Gambar (maks. 1 MB)</button></div>
    <button class="btn">Posting</button></form>`);
  $('#ppick', m.el).onclick = async () => {
    const f = await pickImage(); if (!f) return;
    toast('Memproses gambar…');
    const b = await shrink(f);
    if (!b) return toast('Gambar tidak bisa dikecilkan ke 1 MB');
    blob = b; $('#pv', m.el).innerHTML = `<img src="${URL.createObjectURL(b)}" alt="">`;
    $('#ppick', m.el).textContent = `Ganti Gambar (${Math.round(b.size / 1024)} KB)`;
  };
  $('form', m.el).onsubmit = async e => {
    e.preventDefault();
    const isi = new FormData(e.target).get('isi').trim();
    if (!isi && !blob) return toast('Tulis sesuatu atau pilih gambar');
    const btn = $('form>.btn', m.el); btn.disabled = true; btn.textContent = 'Memposting…';
    try {
      let url = null;
      if (blob) {
        const path = Date.now() + '.jpg';
        const { error } = await sb.storage.from('posts').upload(path, blob, { contentType: 'image/jpeg' });
        if (error) throw error;
        url = sb.storage.from('posts').getPublicUrl(path).data.publicUrl;
      }
      const { error } = await sb.from('posts').insert({ isi: isi || null, gambar_url: url });
      if (error) throw error;
      m.close(); toast('Terposting');
      fetchFeed().then(f => { FEED = f; renderFeed(); });
    } catch (err) { toast(msg(err)); btn.disabled = false; btn.textContent = 'Posting'; }
  };
}
async function openComments(id) {
  const m = modal(`<h3>Komentar</h3><div class="cl2" id="cl"><small>Memuat…</small></div>
    <form class="cf" id="cf"><input name="t" maxlength="500" placeholder="Tulis komentar…" autocomplete="off" required><button class="btn" style="width:auto;padding:0 18px">Kirim</button></form>`);
  const draw = async () => {
    const { data, error } = await sb.from('post_comments').select('*').eq('post_id', id).order('created_at', { ascending: true });
    const cl = $('#cl', m.el); if (!cl) return;
    if (error) { cl.innerHTML = `<small>${esc(msg(error))}</small>`; return; }
    cl.innerHTML = data.length ? data.map(c => `<div class="cm"><div><b>${esc(c.nama)}</b> <small style="display:inline">· ${ago(c.created_at)}</small><p>${esc(c.isi)}</p></div>${S.admin || c.user_id === S.user.id ? `<div class="adm"><button class="dl" data-cd="${c.id}" aria-label="Hapus">${ic('trash', 16)}</button></div>` : ''}</div>`).join('') : '<small>Belum ada komentar. Jadi yang pertama!</small>';
    const p = FEED?.find(x => x.id === id); if (p) { p.coms = data.length; paintPost(p); }
    cl.scrollTop = cl.scrollHeight;
  };
  m.el.addEventListener('click', async e => {
    const b = e.target.closest('[data-cd]'); if (!b) return;
    const { error } = await sb.from('post_comments').delete().eq('id', b.dataset.cd);
    if (error) return toast(msg(error)); draw();
  });
  $('#cf', m.el).onsubmit = async e => {
    e.preventDefault(); const inp = e.target.t, t = inp.value.trim(); if (!t) return;
    inp.disabled = true;
    const { error } = await sb.from('post_comments').insert({ post_id: id, user_id: S.user.id, isi: t });
    inp.disabled = false;
    if (error) return toast(msg(error));
    inp.value = ''; draw();
  };
  draw();
}

/* ---------- Foto profil ---------- */
function pickBlob() {
  return new Promise(res => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*';
    i.onchange = async () => {
      const f = i.files[0]; if (!f) return res(null);
      try {
        const bm = await createImageBitmap(f), s = Math.min(bm.width, bm.height), z = 512;
        const c = document.createElement('canvas'); c.width = c.height = z;
        c.getContext('2d').drawImage(bm, (bm.width - s) / 2, (bm.height - s) / 2, s, s, 0, 0, z, z);
        c.toBlob(b => res(b), 'image/jpeg', .85);
      } catch { res(null); }
    };
    i.click();
  });
}
async function uploadAvatar(blob) {
  const path = `${S.user.id}/avatar.jpg`;
  const { error } = await sb.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
  if (error) throw error;
  return sb.storage.from('avatars').getPublicUrl(path).data.publicUrl + '?v=' + Date.now();
}
async function changePhoto() {
  const blob = await pickBlob(); if (!blob) return;
  try {
    toast('Mengunggah foto…');
    const url = await uploadAvatar(blob);
    const { error } = await sb.from('profiles').update({ foto_url: url }).eq('id', S.user.id);
    if (error) throw error;
    S.profile.foto_url = url; updAv(); refresh(); toast('Foto diperbarui');
  } catch (e) { toast(msg(e)); }
}
function gate() {
  let blob = null;
  const m = modal(`<h3>Lengkapi Keanggotaan</h3><p class="mu">Foto profil dan alamat wajib diisi.</p>
    <div class="gp"><div class="avbig" id="gp">${ic('camera', 30)}</div><button class="btn ghost" id="gpick" style="width:auto;padding:10px 20px">Pilih Foto</button></div>
    <label class="fld"><span>Alamat</span><textarea id="gadr" rows="3">${esc(S.profile.alamat)}</textarea></label>
    <button class="btn" id="gsave" disabled>Simpan</button>`, { close: false });
  $('#gpick', m.el).onclick = async () => {
    const b = await pickBlob(); if (!b) return;
    blob = b; $('#gp', m.el).innerHTML = `<img src="${URL.createObjectURL(b)}" alt="">`; $('#gsave', m.el).disabled = false;
  };
  $('#gsave', m.el).onclick = async () => {
    const adr = $('#gadr', m.el).value.trim();
    if (!adr) return toast('Alamat wajib diisi');
    const btn = $('#gsave', m.el); btn.disabled = true; btn.textContent = 'Menyimpan…';
    try {
      const url = await uploadAvatar(blob);
      const { error } = await sb.from('profiles').update({ foto_url: url, alamat: adr }).eq('id', S.user.id);
      if (error) throw error;
      S.profile.foto_url = url; S.profile.alamat = adr; updAv(); m.close(); toast('Selamat datang!');
    } catch (e) { toast(msg(e)); btn.disabled = false; btn.textContent = 'Simpan'; }
  };
}

/* ---------- Mulai ---------- */
addEventListener('popstate', e => {
  if (modals.length) { const m = modals[modals.length - 1]; if (m.dismissable) m.close(); history.pushState({ r: S.route, a: S.arg }, ''); return; }
  if (!S.user || !$('#main')) return;
  const st = e.state; if (st && st.r) go(st.r, st.a ?? undefined, false, true);
});
sb.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT' && S.user) { S.user = null; authView('login'); } });
let swReg = null, swReloaded = false;
if ('serviceWorker' in navigator) {
  const hadCtl = !!navigator.serviceWorker.controller;
  // Versi baru aktif -> muat ulang otomatis sekali (hanya jika bukan pemasangan pertama)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadCtl || swReloaded) return; swReloaded = true;
    if (modals.length) toast('Pembaruan siap. Tutup lalu buka ulang aplikasi'); else location.reload();
  });
  addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
    .then(r => { swReg = r; r.update().catch(() => {}); }).catch(() => {}));
  // Setiap aplikasi dibuka kembali dari latar belakang, cek pembaruan
  document.addEventListener('visibilitychange', () => { if (!document.hidden && swReg) swReg.update().catch(() => {}); });
}
async function cekUpdate() {
  if (!swReg) return toast('Pembaruan hanya tersedia saat online');
  toast('Memeriksa pembaruan…');
  try { await swReg.update(); } catch { return toast('Tidak ada koneksi internet'); }
  setTimeout(() => { if (!swReloaded) toast('Aplikasi sudah versi terbaru'); }, 2500);
}
enter().catch(() => { authView('login'); hideSplash(); });
})();
