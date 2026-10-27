# DompetKita — Loket Latihan Dompet Kripto untuk Pemula

> **SIMULASI — bukan dompet sungguhan.** Semua saldo, harga, alamat, dan karcis di sini hanya contoh untuk latihan. Tidak ada uang sungguhan yang bergerak, tidak ada data yang dikirim ke server.

DompetKita adalah loket latihan dompet kripto berbahasa Indonesia. Pemula bisa latihan **kirim, terima, dan hitung biaya** pakai uang contoh — salah kirim pun tidak apa-apa. Dijaga oleh **Pak Loket**, petugas loket terminal yang sabar.

**Live:** https://kayzenn123.github.io/agent-tools-dompetkita/

## Fitur

- **Kirim uang contoh** — pilih 1 dari 8 kontak lokal, pilih aset (IDR / BTC / ETH contoh), tulis jumlah, lihat estimasi biaya transparan per kecepatan (Santai / Biasa / Ngebut), lalu "tempel stempel" — transaksi keluar sebagai **karcis bernomor** (DK-000119, dst).
- **Terima** — alamat dompet contoh + tombol salin (clipboard + fallback).
- **Kalkulator ongkos tol** — hitung biaya jaringan sebelum kirim.
- **Belajar di bangku loket** — 5 pelajaran singkat (dompet, alamat, biaya, seed phrase, cek sebelum kirim) + **kuis 5 soal** dengan penjelasan dan skor tersimpan.
- **Riwayat karcis** — semua transaksi tersimpan di browser (localStorage `dompetkita:v1`, berversi), filter masuk/keluar, salin karcis, sobek (hapus) dengan animasi, ekspor **CSV/JSON**, reset demo.
- **Deep-link** — `?tab=kirim&ke=Siti&jumlah=25000&aset=IDR` membuka formulir kirim yang sudah terisi.
- **Easter egg** — ketuk nomor antrean "A-001" lima kali.

## Teknologi

- [Astro](https://astro.build) v7 + [Tailwind CSS](https://tailwindcss.com) v4 (template [AstroWind](https://github.com/arthelokyo/astrowind), MIT)
- Font: **Teachers** (variable, display), **Biryani** (body), **Source Code Pro** (aksen mono) — via Astro Fonts API (Fontsource), self-hosted
- Ikon: Tabler via `astro-icon` + 1 SVG pixel-art karcis digambar sendiri
- Tanpa backend, tanpa tracker, tanpa API key. Semua state di `localStorage`.

## Skor

| | Mobile | Desktop |
|---|---|---|
| Lighthouse Performance | 91 | 100 |
| Lighthouse Accessibility | 96 | 96 |
| Lighthouse Best Practices | 100 | 100 |
| Lighthouse SEO | 100 | 100 |
| FPS (CPU throttle 4x) | 60,3 | — |

- `tools/qa.js` (Playwright): exit 0 di Chromium — tanpa overflow, tanpa console error, 0 target sentuh < 44px, 1× `<h1>`, 0 animasi berjalan saat `prefers-reduced-motion`.
- Tes fungsi otomatis: 24 cek lulus (kirim, validasi, kalkulator, kuis, easter egg, persistensi, deep-link, ekspor CSV, salin alamat).

## Cara jalanin

```bash
npm install
npm run dev     # http://localhost:4321/agent-tools-dompetkita
npm run build   # output ke dist/
```

## Desain

- **Konsep:** situs = satu papan pengumuman loket terminal bus. Saldo terpampang seperti papan keberangkatan; transaksi keluar sebagai karcis perforasi; stempel LUNAS merah muda.
- **Palet (light / analogous hue 136):** kertas `#e9f2e3`, permukaan `#dcead2`, tinta `#122b16`, hijau loket `#1e7a4c`, limau `#5a8f2a`, stempel `#d42a5e`.
- **Gerak:** zoom + pan saat scroll, 2 marquee berlawanan arah (ikut kecepatan scroll), sumbu wght Teachers berdenyut, spotlight kursor, curtain wipe antar section. Ada tombol **"Gerak: nyala/mati"** + MODE RINGAN otomatis (CPU/RAM kecil, Save-Data, atau FPS < 40).
- **Constraint:** tanpa shadow dan gradient (kecuali mask spotlight, sesuai seed).

## Kredit aset

- Font (OFL): Teachers, Biryani, Source Code Pro — Google Fonts / Fontsource.
- Ikon (MIT): Tabler Icons via astro-icon. SVG karcis digambar sendiri.
- Gambar: semua SVG/CSS buatan sendiri; tidak ada foto stok.
- Harga BTC/ETH yang tampil adalah **harga contoh yang dipatok untuk latihan**, bukan harga pasar.

## Lisensi

Kode: MIT (template AstroWind © Arthelokyo). Konten dan pelajaran DompetKita: © 2026 DompetKita.
