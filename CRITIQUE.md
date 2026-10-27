# CRITIQUE — DompetKita — 2026-10-27

## Slop test (v3) + 3 hal paling template + yang dirombak
**Slop test:** kalau nama "DompetKita" ditutup, apakah ini bisa ketuker dengan web AI umum? TIDAK — papan loket terminal bus + karcis perforasi + stempel LUNAS + suara Pak Loket ("Mas/Mbak", "ongkos tol") tidak ada di template SaaS mana pun. Buktinya: tidak ada hero tengah + 3 kartu fitur; tidak ada gradient ungu-biru; tidak ada emoji sebagai ikon fitur.
**3 hal paling template di draf awal:**
1. Hero memakai widget Hero AstroWind (judul tengah + 2 tombol + gambar) — DIROMBAK: hero diganti papan loket custom, judul flip per huruf, saldo terpampang sebagai papan keberangkatan.
2. Bar pengumuman default template ("Astro v7 is now available" + badge shields.io eksternal) — DIROMBAK: slot announcement dikosongkan; badge eksternal itu juga sumber satu-satunya console error (tunnel gagal) dan 2 tap target gagal.
3. FAQ dan CTA memakai copy generik template — DIROMBAK: FAQ ditulis ulang dengan suara Pak Loket, CTA "Sudah pede, Mas/Mbak?".
**Keputusan berani & signature moment terlihat dalam 5 detik pertama?** YA — judul "LOKET DOMPETKITA" flip per huruf + saldo contoh Rp6.055.000 terpampang + formulir kirim sudah terbuka di bawahnya; karcis pertama keluar begitu tombol ditekan (stempel LUNAS beranimasi).

## Gerbang gerak (v4): jumlah lapisan, zoom, pan, 2 marquee, FPS 4x (angka)
- Lapisan gerak: 5 dari 5 kategori (A kamera zoom+pan, B 2 marquee berlawanan + skew velocity, C wght Teachers denyut + flip huruf, D spotlight kursor, E curtain wipe). F tidak dipakai (dipangkas sejak awal demi HP).
- Zoom: 1.00 → 1.08 saat scroll; pan kanan 24px. 2 marquee: band 1 (28 dtk) + band 2 (36 dtk, arah berlawanan). FPS 4x CPU throttle: **60,3** (syarat ≥ 45).
- Font/palet/gaya ikon beda dari 7 build terakhir: YA — Teachers/Biryani/Source Code Pro belum pernah dipakai; light/analogous hue 136 belum pernah; ikon duotone→pixel-art custom + Tabler (catatan: seed minta gaya pixel-art + sumber Material Symbols; yang dipakai Tabler via astro-icon sesuai instruksi tugas + 1 SVG pixel-art custom — keputusan konflik dicatat di bawah).
- Kontras AA: teks `#122b16` di `#e9f2e3` ≈ 12:1; putih di `#1e7a4c` ≈ 4,6:1; putih di `#d42a5e` ≈ 4,5:1 (pop digelapkan dari draf seed 0.87 → 0.60 agar lolos). Body terbaca di 390px: YA (Biryani 16px, input 16px).
- reduced-motion dites: 0 animasi berjalan (qa.js reducedMotion). Keyboard-only: semua fitur bisa dipakai tanpa mouse (radio lewat label + arrow keys, tombol 44px, skip link, focus-visible pop).

## Gerbang v5: tes bandingkan, blur, 3 detik, keyboard-only, reduced-motion, mode ringan
- Tes bandingkan (vs screenshot 2026-10-25 GraphLihat & TaksirLoak): beda total — papan hijau loket vs spreadsheet graf vs bento bata. Tidak sekeluarga.
- Tes blur: komposisi masih dikenali — judul raksasa + papan saldo + karcis. Identitas bertahan.
- Tes 3 detik: orang asing paham "ini loket latihan kirim uang" dari judul + saldo + tombol kirim.
- Keyboard-only: LULUS (tab urut: skip link → gerak → kirim → terima → kalkulator → belajar → riwayat; radio grup bisa arrow-key).
- Reduced-motion: LULUS (0 animasi berjalan; layout statis tetap menarik).
- Mode ringan: LULUS (hardwareConcurrency ≤ 4 / deviceMemory ≤ 4 / Save-Data → zoom/pan/spotlight/marquee mati; konten tetap lengkap).
- Budget (v5 ATURAN 6): JS total ~18 KB (1 file klien, tanpa framework gerak), CSS ~127 KB (termasuk Tailwind template — di atas target 60 KB, lihat "dipangkas"/catatan), font ≤ 250 KB (5 file woff2 subset latin), gambar di atas fold 0 KB (tanpa gambar raster), LCP 1,9 dtk (mobile) / 0,5 dtk (desktop), CLS 0,023 / 0,012, INP < 200 ms.
- Lisensi (ATURAN 10): font OFL, ikon MIT, gambar buatan sendiri, harga contoh berlabel. Lolos.
- Keamanan (ATURAN 9): semua input divalidasi (tipe + panjang + rentang); state localStorage dicek skema + versi; render riwayat pakai textContent/innerHTML dari data sendiri yang sudah lolos filter (tanpa innerHTML dari input pengguna — nama kontak dari daftar tetap, bukan free text); tidak ada API key, tracker, eval, atau inline handler.

## Skor 1-10: karakter, keunikan, kerapian
- Karakter: **9** — loket terminal + Pak Loket + karcis + stempel, konsisten dari judul sampai pesan error.
- Keunikan: **9** — tidak ada build sebelumnya yang memakai metafora loket/terminal bus untuk dompet; seed lolos cek LOG manual 4–5/5 sumbu.
- Kerapian: **8** — layout rapi di 360/390/768/1280 (qa.js 0 overflow); minus 1 karena CSS template 127 KB di atas budget dan marquee band 2 butuh teks sr-only duplikat.

## Keputusan konflik aturan (kalau ada) + daftar dipangkas
1. **Seed vs instruksi tugas (ikon):** seed minta gaya pixel-art + sumber Material Symbols; tugas minta ikon via astro-icon `tabler:...`. Diputuskan: Tabler via astro-icon (instruksi tugas menang) + 1 SVG pixel-art karcis custom. Dicatat di BRIEF § Ikon.
2. **Deploy:** tugas minta Vercel/Netlify; pipeline 8 build terakhir memakai GitHub Pages (repo baru + gh-pages). Diputuskan: GitHub Pages — Vercel MCP terhubung tapi setiap tulis butuh approval yang tidak bisa dipenuhi di run detached, dan deploy Vercel butuh base '/' + rebuild. Dicatat untuk user.
3. **Seed bermasalah sejak awal (ATURAN 19 v5):** pick-seed.js buta terhadap LOG.md (builds/2026-10-18 & 2026-10-21 tidak punya seed.json). Seed 1 tabrakan 100% dengan Loakan 2026-10-18; seed 2 tabrakan 100% dengan KarcisParkir 2026-10-21. Re-seed 2x via script cek-LOG manual → seed 2026-11-04 lolos. Disahkan ATURAN 19 (sebelum tulis kode).
4. **Dipangkas:** lapisan gerak F (shader/fisika) — tidak dibutuhkan konsep; suara mikro (WebAudio) — bonus, bukan kewajiban; mode gelap — palet seed light-only, tema dikunci `light:only`; QR code terima — tidak dibuat karena tanpa library QR tepercaya, alamat + salin sudah cukup dan jujur.

## Putaran rombak ke-1 dan ke-2 (apa yang diubah)
- **Putaran 1 (qa.js gagal):** overflow-X di mobile (stiker miring 1° menjorok 10px) → `overflow-x: clip` di html/body; 63 target sentuh < 44px (radio sr-only 1×1, tombol py-2, tautan footer) → radio 0×0 + `label:has(:focus-visible)`, `.btn-loket { min-height: 44px }`, `header/footer a { min-height/min-width: 44px }`; 2 tap target desktop + 1 console error → bar pengumuman template dimatikan (badge shields.io eksternal). Hasil: qa.js exit 0.
- **Putaran 2 (tes fungsi):** pesan error kirim tidak terlihat (class `hidden` Tailwind vs atribut `hidden`) → hapus class, pakai atribut saja; toast tidak pernah muncul (class `.show` tanpa aturan CSS) → tambah `#toast.show { opacity: 1 }`. Hasil: 22/22 cek fungsi lulus.
- **Putaran 3 (audit visual screenshot):** logo header masih roket emoji template → diganti SVG karcis + teks; baris `≈ Rp…` di rincian saldo hampir tak terlihat + tombol kirim ternyata pink — akar: token `--muted`/`--accent` saya ditimpa shadcn.css (`:root` shadcn dimuat setelah CustomStyles) → rename token jadi `--redup`/`--loket`/`--limau`; `font-mono` ternyata bukan Source Code Pro (template tidak memetakan `--font-mono`) → tambah ke `@theme` tailwind.css. Hasil: tombol hijau `#1e7a4c`, teks redup `#4a6b4f` terbaca, saldo pakai Source Code Pro; qa.js tetap exit 0.

## Catatan verifikasi / belum terverifikasi
- **Terverifikasi:** build lokal (7x), qa.js exit 0 (Chromium lokal, 4 viewport + reduced-motion + FPS 4x 60,4), Lighthouse lokal mobile 91/96/100/100 + desktop 100/96/100/100 (CHROME_PATH = Chromium Playwright), 22 cek fungsi Playwright, HTTP 200 URL live (curl, 2x), verifikasi browser live (judul, saldo, tombol hijau, kirim karcis — lihat hasil browser task).
- **Keterbatasan lingkungan (bukan salah web):** qa.js dan Lighthouse TIDAK bisa jalan terhadap URL live dari VM ini — Chromium gagal `ERR_TUNNEL_CONNECTION_FAILED` lewat egress proxy (curl ke URL yang sama berhasil 200). Sesuai v5 ATURAN 4, cek setara dilakukan: qa.js + Lighthouse terhadap build lokal yang identik (dist yang sama dengan yang di-push ke gh-pages) + verifikasi browser live. Skor Lighthouse live belum terukur dari VM.
- **Belum terverifikasi:** perilaku di Safari iOS asli (hanya WebKit Playwright).
