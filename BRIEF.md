# BRIEF — DompetKita — 2026-10-27
## Masalah/usecase (1 kalimat + siapa yang kena)
Pemula Indonesia takut salah kirim uang kripto karena tidak pernah latihan dulu — DompetKita adalah loket latihan dompet kripto berbahasa Indonesia, tempat siapa pun bisa kirim, terima, dan hitung biaya pakai uang contoh tanpa risiko kehilangan uang sungguhan.

## Konsep visual (1 kalimat)
Situs ini satu papan pengumuman loket bus antarkota: saldo terpampang seperti papan keberangkatan, setiap transaksi keluar sebagai karcis bernomor yang bisa disobek, dan Pak Loket yang menyapa.

## Hasil seed (seed 2026-11-04, lolos cek LOG.md manual)
- domain: antrean puskesmas → diterjemahkan sebagai bahasa LOKET (ambil nomor, dilayani, karcis)
- layout: papan pengumuman penuh stiker
- reference: tiket bus antarkota
- constraint: tanpa shadow dan gradient
- motion: kamera zoom in + pan kanan saat scroll · marquee ikon SVG + teks · variable font axis · cursor senter/spotlight · curtain wipe antar section
- icons: pixel-art, Material Symbols
- fonts: display Teachers · body Biryani · aksen Source Code Pro
- palette: light / analogous hue 136 — bg oklch(0.95 0.045 136), surface oklch(0.90 0.040 136), text oklch(0.20 0.040 136), muted oklch(0.45 0.030 136), accent oklch(0.61 0.190 166), accent2 oklch(0.64 0.169 106), pop oklch(0.87 0.233 333)
- CATATAN SEED: pick-seed.js buta terhadap LOG.md (builds/2026-10-18 dan 2026-10-21 tidak punya seed.json). Seed pertama (2026-11-02) tabrakan 100% dengan Loakan 2026-10-18; re-seed 2026-11-03 tabrakan 100% dengan KarcisParkir 2026-10-21. Seed final dicari dengan script cek-LOG manual (`/tmp/pick-log-aware.js`), lolos 4–5/5 sumbu vs 14 build terakhir. Disahkan ATURAN 19 v5 (seed bermasalah sejak awal, sebelum tulis kode).

## 3 arah desain (2 kalimat masing-masing) + arah terpilih dan alasannya
1. **Loket bank jadul** — meja kayu, stempel tinta, buku besar. Hangat tapi terlalu serius dan gelap untuk pemula.
2. **Papan pengumuman RT** — stiker, pengumuman, koran kuning. Ramai dan akrab, tapi rawan berantakan kalau semua jadi stiker.
3. **Terminal bus antarkota** — karcis bernomor, papan keberangkatan, jadwal. Paling nyambung dengan ide "kirim uang = berangkat", dan karcis adalah artefak yang bisa disimpan.
**Terpilih: gabungan 2 + 3** — papan pengumuman loket terminal: stiker sebagai section, karcis sebagai transaksi, papan keberangkatan sebagai saldo. Paling jauh dari build sebelumnya (tidak ada yang memakai metafora terminal bus untuk dompet).

## Keputusan berani
Tidak ada navbar dan tidak ada hero marketing — pengunjung langsung berdiri di depan loket: saldo contoh terpampang seperti papan keberangkatan dan formulir kirim sudah terbuka di 5 detik pertama. Setiap transaksi yang berhasil TIDAK muncul sebagai toast, melainkan sebagai KARCIS KERTAS bernomor seri yang keluar dari loket dan bisa disobek (animasi sobek) atau disalin isinya.

## Persona/suara
**Pak Loket** — petugas loket terminal yang sabar, memanggil "Mas/Mbak", menjelaskan pakai analogi bus dan karcis ("biaya jaringan itu kayak ongkos tol, Mas — makin cepat makin mahal"). Semua copy, termasuk pesan error dan empty state, bersuara Pak Loket. Error tidak pernah minta maaf berlebihan; langsung bilang apa yang salah dan apa yang harus dilakukan.

## Palet (harmoni, kenapa, psikologi warna, token oklch final, hasil cek kontras AA)
- Harmoni analogous hue 136 (hijau daun → hijau limau), mode light. Hijau = uang, jalan, "boleh berangkat"; kertas krem-hijau = papan pengumuman terminal yang sudah lama ditempel.
- Token final (disesuaikan dari draf seed agar kontras AA lolos):
  - --bg: #e9f2e3 (oklch 0.94 0.04 136) — kertas papan
  - --surface: #dcead2 (oklch 0.90 0.04 136) — permukaan stiker
  - --text: #122b16 (oklch 0.20 0.04 136) — tinta hijau tua
  - --muted: #4a6b4f (oklch 0.45 0.03 136) — teks sekunder
  - --accent: #1e7a4c (oklch 0.60 0.16 166, digelapkan dari draf 0.61 agar teks putih AA) — hijau loket
  - --accent-2: #5a8f2a (oklch 0.60 0.16 106) — hijau limau
  - --pop: #d42a5e (oklch 0.60 0.20 333, digelapkan dari draf 0.87 agar teks putih AA) — stempel merah muda, dipakai <5% area (stempel, nomor seri, peringatan)
- Psikologi: hijau tenang + stempel merah muda = "aman tapi resmi". Kontras teks biasa di atas bg ≥ 4.5:1 (teks #122b16 di #e9f2e3 ≈ 12:1; putih di #1e7a4c ≈ 4.6:1 — dicek ulang saat QA).

## Font (display/body/aksen, alasan, id Fontsource, variable atau bukan)
- Display **Teachers** (variable, wght 400–800) — tulisan tangan guru/petugas loket, dipakai untuk judul besar + angka saldo. Sumbu wght dianimasikan saat scroll (denyut).
- Body **Biryani** (400/700) — sans humanis yang terbaca di HP kecil, dipakai untuk isi dan formulir.
- Aksen **Source Code Pro** (400/700) — mono untuk alamat dompet, nomor seri karcis, dan angka tarif. Kontras "tulisan tangan vs mesin" = loket manusia + sistem.
- Id Fontsource: `@fontsource-variable/teachers`, `@fontsource/biryani`, `@fontsource/source-code-pro`. Maks 3 family.

## Ikon (gaya, sumber, daftar 12+ ikon, 3+ custom)
- Gaya: pixel-art (kotak-kotak tegas, tanpa fill lembut) + Material Symbols untuk ikon UI.
- Daftar (14): dompet, kirim (panah kanan), terima (panah kiri), karcis, loket, koin, amplop, buku (belajar), kalkulator, salin, unduh, hapus, stempel, jam.
- Custom (4, digambar sendiri sebagai SVG pixel-art): **karcis bernomor** (dengan lubang perforasi), **loket** (jendela + papan nama), **koin DOM** (lingkaran pixel + huruf D), **stempel LUNAS** (lingkaran + teks melengkung).
- Larangan: tanpa emoji sebagai ikon; tanpa rocket/lightbulb/shield/sparkle.

## Gerak (kategori A-F yang dipakai, narasi yang menyatukan, MODE RINGAN apa yang dimatikan)
Narasi: **scroll = berjalan masuk ke dalam terminal** — makin ke bawah, makin dekat ke loket.
- A Kamera: zoom in + pan kanan saat scroll (papan loket membesar, lalu bergeser ke formulir kirim).
- B Marquee: 2 band berlawanan — band 1: "KIRIM • TERIMA • HITUNG BIAYA • BELAJAR •" + ikon SVG; band 2: tarif contoh berjalan. Kecepatan ikut velocity scroll, ada tombol jeda.
- C Teks: Teachers wght denyut saat scroll + split huruf flip 3D pada judul "LOKET DOMPETKITA".
- D Input: cursor senter/spotlight mask (desktop saja, pointer: fine) — seperti senter petugas memeriksa karcis.
- E Reveal: curtain wipe antar section (tirai loket dibuka).
- F: tidak dipakai (dipangkas sejak awal demi performa HP).
- MODE RINGAN (hardwareConcurrency ≤ 4 / deviceMemory ≤ 4 / Save-Data / FPS < 40): matikan A (zoom/pan), D (spotlight), dan marquee jadi statis; C jadi wght tetap.

## Storyboard hero moment (tabel scroll 0/25/50/75/100%)
| Scroll | Yang terlihat | Kamera (zoom/pan) | Marquee | Teks | Interaksi |
| --- | --- | --- | --- | --- | --- |
| 0% | Papan loket: "LOKET DOMPETKITA" + saldo contoh Rp250.000 terpampang | scale 1.0 | band 1 jalan | judul flip 3D per huruf | saldo bisa diklik → rincian 3 aset |
| 25% | Formulir kirim terbuka, karcis kosong menunggu | zoom 1.08, pan kanan ke formulir | band 1 + band 2 | wght Teachers menebal | pilih kontak → nama terisi, biaya muncul |
| 50% | Kalkulator biaya: geser kecepatan, tarif berubah | zoom 1.15 | band 2 jalan | angka tarif scramble | geser kecepatan → biaya + waktu berubah |
| 75% | Mode belajar: 5 pelajaran + kuis | pan kembali ke tengah | jeda (tombol jeda terlihat) | judul pelajaran wipe | klik pelajaran → kartu terbuka, kuis bisa dijawab |
| 100% | Riwayat karcis + ekspor + footer Pak Loket | zoom out 1.0 | band 1 pelan | "TERIMA KASIH, MAS/MBAK" | ekspor CSV/JSON, sobek karcis |

Pertunjukan utama: di 0–25% — karcis kosong berubah menjadi karcis bernomor begitu pengunjung menekan "KIRIM", dengan animasi stempel LUNAS. Yang dirasakan pengunjung di 5 detik pertama: "Oh, ini loket — saya langsung bisa kirim uang contoh."

## Konten (15+ item nyata, easter egg)
- 8 kontak lokal: Budi Santoso, Siti Rahma, Agus Wijaya, Dewi Lestari, Rizky Pratama, Maya Putri, Joko Susilo, Ani Wijayanti (dengan nama pendek untuk karcis).
- 3 aset contoh: IDR (Rupiah contoh), BTC contoh, ETH contoh — harga contoh berlabel jelas "CONTOH — bukan harga pasar" (R7: tidak ada angka yang diklaim sebagai harga pasar nyata).
- 6 transaksi contoh di riwayat awal (berlabel CONTOH): kirim ke Budi Rp50.000, terima dari Siti Rp120.000, kirim ke Agus 0,001 BTC contoh, dst.
- 5 pelajaran: (1) Dompet itu apa, (2) Alamat dompet, (3) Biaya jaringan, (4) Seed phrase — jangan dibagikan, (5) Cek sebelum kirim.
- 5 soal kuis (pilihan ganda, jawaban + penjelasan).
- Tarif biaya contoh: lambat Rp1.500 / ±10 mnt, standar Rp4.000 / ±3 mnt, cepat Rp9.000 / ±30 dtk — berlabel CONTOH.
- Alamat dompet contoh: `0xDOMP...7KITA` (dibuat deterministik, label CONTOH — bukan alamat sungguhan).
- Easter egg: ketuk nomor antrean "A-001" sebanyak 5 kali → stempel rahasia "DIDAHULUKAN" + nomor berubah jadi "A-000 — TAMU ISTIMEWA".

## Teknik visual orisinal (2+)
1. **Karcis perforasi CSS** — karcis transaksi dengan lubang perforasi (radial-gradient mask + garis putus-putus) dan nomor seri mono; animasi "sobek" (clip-path) saat karcis dihapus dari riwayat.
2. **Pola papan pengumuman** — background repeating-linear-gradient garis tipis + stiker yang diputar acak 1–3° (tanpa shadow, sesuai constraint), pin paku SVG di tiap sudut stiker.
3. **Stempel LUNAS** — SVG teks melengkung di lingkaran ganda, dianimasikan dengan scale + rotate saat transaksi berhasil (bukan gambar stok).

## Suara (ya/tidak, detail)
Tidak — tanpa audio. (Bonus suara dipangkas; fokus ke fungsi + gerak.)

## Fungsi (v2 FASE 1 — wajib jalan)
- Kirim: pilih kontak + aset + jumlah → estimasi biaya transparan → validasi (saldo kurang, jumlah ≤ 0, jumlah > saldo) → konfirmasi → karcis bernomor + saldo berkurang + riwayat bertambah. Semua state di localStorage key `dompetkita:v1` (try/catch + cek skema + fallback default).
- Terima: tampilkan alamat contoh + tombol salin (clipboard + fallback) + tombol "minta" (deep-link ?tab=kirim).
- Riwayat: filter semua/masuk/keluar, hapus per item (animasi sobek), ekspor CSV + JSON (download), reset demo.
- Belajar: 5 pelajaran (accordion), kuis 5 soal, skor tersimpan, progress.
- Kalkulator: aset + kecepatan → biaya Rp + estimasi waktu.
- Deep-link: `?tab=kirim&ke=Budi&jumlah=50000&aset=IDR`, `?tab=belajar`, `?tab=riwayat`, `?tab=kalkulator`. State utama bisa dibagikan lewat link.
- Empty state: riwayat kosong → "Belum ada karcis, Mas — kirim pertama dulu, yuk." Loading state: tombol kirim → "Menempel stempel…" 600ms. Error state: pesan spesifik Pak Loket.
- Tidak ada data pribadi sungguhan, tidak ada API key, tidak ada tracker.
