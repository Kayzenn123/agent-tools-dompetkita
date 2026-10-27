// Data DompetKita — dipakai render statis (index.astro) dan logika klien.
// SEMUA angka di sini adalah CONTOH untuk latihan, BUKAN harga pasar nyata.
// Harga contoh diberi label "CONTOH" di UI; jangan pernah disajikan sebagai fakta pasar.

export type AssetId = 'IDR' | 'BTC' | 'ETH';
export type SpeedId = 'lambat' | 'standar' | 'cepat';

export interface Asset {
  id: AssetId;
  nama: string;
  simbol: string;
  // Harga contoh 1 unit dalam Rupiah (BUKAN harga pasar).
  hargaContohRp: number;
  desimal: number;
}

export const ASSETS: Asset[] = [
  { id: 'IDR', nama: 'Rupiah (contoh)', simbol: 'Rp', hargaContohRp: 1, desimal: 0 },
  { id: 'BTC', nama: 'Bitcoin (contoh)', simbol: 'BTC', hargaContohRp: 1_650_000_000, desimal: 8 },
  { id: 'ETH', nama: 'Ethereum (contoh)', simbol: 'ETH', hargaContohRp: 52_000_000, desimal: 6 },
];

export interface Speed {
  id: SpeedId;
  nama: string;
  waktu: string;
  // Biaya contoh per aset (dalam unit aset).
  biaya: Record<AssetId, number>;
}

export const SPEEDS: Speed[] = [
  {
    id: 'lambat',
    nama: 'Santai',
    waktu: '±10 menit',
    biaya: { IDR: 1500, BTC: 0.00002, ETH: 0.0004 },
  },
  {
    id: 'standar',
    nama: 'Biasa',
    waktu: '±3 menit',
    biaya: { IDR: 4000, BTC: 0.00005, ETH: 0.001 },
  },
  {
    id: 'cepat',
    nama: 'Ngebut',
    waktu: '±30 detik',
    biaya: { IDR: 9000, BTC: 0.00012, ETH: 0.0025 },
  },
];

export interface Kontak {
  nama: string;
  pendek: string;
  peran: string;
  // Alamat contoh (bukan alamat sungguhan).
  alamat: string;
}

export const KONTAK: Kontak[] = [
  { nama: 'Budi Santoso', pendek: 'Budi', peran: 'Teman sekantor', alamat: '0xBUD1c0n70h000000000000000000000000000001' },
  { nama: 'Siti Rahma', pendek: 'Siti', peran: 'Kakak kelas', alamat: '0x5171c0n70h000000000000000000000000000002' },
  { nama: 'Agus Wijaya', pendek: 'Agus', peran: 'Tetangga kos', alamat: '0xA6U5c0n70h000000000000000000000000000003' },
  { nama: 'Dewi Lestari', pendek: 'Dewi', peran: 'Teman kuliah', alamat: '0xD3W1c0n70h000000000000000000000000000004' },
  { nama: 'Rizky Pratama', pendek: 'Rizky', peran: 'Adik tingkat', alamat: '0xR12Kc0n70h000000000000000000000000000005' },
  { nama: 'Maya Putri', pendek: 'Maya', peran: 'Rekan lomba', alamat: '0xMAYAc0n70h000000000000000000000000000006' },
  { nama: 'Joko Susilo', pendek: 'Joko', peran: 'Tukang fotokopi', alamat: '0xJ0K0c0n70h000000000000000000000000000007' },
  { nama: 'Ani Wijayanti', pendek: 'Ani', peran: 'Bendahara RT', alamat: '0xAN1c0n70h0000000000000000000000000000008' },
];

// Alamat dompet pengunjung (contoh, deterministik — bukan alamat sungguhan).
export const ALAMAT_SAYA = '0xD0MP3TK1TA9a4F2c8E1b7D3a5F9c2E8b4A6d0';

export interface Tx {
  id: string;
  no: string;
  jenis: 'kirim' | 'terima';
  pihak: string;
  aset: AssetId;
  jumlah: number;
  biaya: number;
  kecepatan: SpeedId;
  waktu: string; // ISO
  contoh: boolean;
}

export const SALDO_AWAL: Record<AssetId, number> = { IDR: 250_000, BTC: 0.0021, ETH: 0.045 };

export const TRANSAKSI_CONTOH: Tx[] = [
  { id: 'c1', no: 'DK-000118', jenis: 'kirim', pihak: 'Budi Santoso', aset: 'IDR', jumlah: 50_000, biaya: 4000, kecepatan: 'standar', waktu: '2026-10-26T09:12:00+07:00', contoh: true },
  { id: 'c2', no: 'DK-000117', jenis: 'terima', pihak: 'Siti Rahma', aset: 'IDR', jumlah: 120_000, biaya: 0, kecepatan: 'standar', waktu: '2026-10-25T18:40:00+07:00', contoh: true },
  { id: 'c3', no: 'DK-000116', jenis: 'kirim', pihak: 'Agus Wijaya', aset: 'BTC', jumlah: 0.0005, biaya: 0.00005, kecepatan: 'standar', waktu: '2026-10-25T11:05:00+07:00', contoh: true },
  { id: 'c4', no: 'DK-000115', jenis: 'terima', pihak: 'Dewi Lestari', aset: 'ETH', jumlah: 0.01, biaya: 0, kecepatan: 'standar', waktu: '2026-10-24T20:22:00+07:00', contoh: true },
  { id: 'c5', no: 'DK-000114', jenis: 'kirim', pihak: 'Maya Putri', aset: 'IDR', jumlah: 25_000, biaya: 1500, kecepatan: 'lambat', waktu: '2026-10-24T08:15:00+07:00', contoh: true },
  { id: 'c6', no: 'DK-000113', jenis: 'terima', pihak: 'Rizky Pratama', aset: 'IDR', jumlah: 75_000, biaya: 0, kecepatan: 'standar', waktu: '2026-10-23T16:30:00+07:00', contoh: true },
];

export interface Pelajaran {
  id: string;
  judul: string;
  isi: string[];
}

export const PELAJARAN: Pelajaran[] = [
  {
    id: 'p1',
    judul: 'Dompet itu apa, sih?',
    isi: [
      'Dompet kripto itu seperti dompet biasa, tapi isinya bukan uang kertas — melainkan kunci digital yang membuktikan uang itu milikmu.',
      'Analoginya seperti loket: dompetmu adalah nomor antreanmu. Siapa pun bisa melihat nomornya, tapi hanya kamu yang bisa mengambil uangnya.',
      'Dompet tidak menyimpan koin di dalamnya. Koin tercatat di buku besar (blockchain), dompet hanya menyimpan kuncinya.',
    ],
  },
  {
    id: 'p2',
    judul: 'Alamat dompet: seperti nomor rekening, tapi…',
    isi: [
      'Alamat dompet adalah deretan huruf dan angka, contohnya 0xD0MP…A6d0. Kamu boleh membagikannya ke siapa saja — sama seperti nomor rekening.',
      'Satu huruf saja salah, uang bisa nyasar ke orang lain dan tidak bisa ditarik kembali. Makanya selalu salin-tempel, jangan ketik manual.',
      'Cek tiga huruf pertama dan tiga huruf terakhir alamat sebelum menekan kirim. Itu kebiasaan paling murah yang bisa menyelamatkan uangmu.',
    ],
  },
  {
    id: 'p3',
    judul: 'Biaya jaringan: ongkos tolnya internet uang',
    isi: [
      'Setiap kirim uang kripto dikenakan biaya jaringan — ongkos untuk para pencatat (validator) yang mengesahkan transaksimu.',
      'Makin ramai jalannya, makin mahal ongkosnya. Makanya ada pilihan Santai, Biasa, dan Ngebut — sama seperti memilih jalur di terminal.',
      'Biaya dihitung per transaksi, bukan per jumlah. Kirim Rp10.000 dan Rp10.000.000 di kecepatan yang sama biayanya sama.',
    ],
  },
  {
    id: 'p4',
    judul: 'Seed phrase: kunci master yang tidak boleh dibagikan',
    isi: [
      'Seed phrase adalah 12 atau 24 kata rahasia. Siapa pun yang memegangnya bisa menguras dompetmu — tanpa perlu kata sandi apa pun.',
      'Petugas loket sungguhan TIDAK PERNAH meminta seed phrase. Kalau ada yang memintanya, itu penipu. Titik.',
      'Tulis di kertas, simpan di tempat aman, jangan pernah difoto atau disimpan di catatan HP yang tersinkron ke cloud.',
    ],
  },
  {
    id: 'p5',
    judul: 'Cek sebelum kirim: tiga detik yang menyelamatkan',
    isi: [
      'Sebelum menekan kirim, cek tiga hal: (1) alamat tujuan benar, (2) jumlah benar, (3) jaringan/aset benar.',
      'Kirim dulu jumlah kecil sebagai tes kalau baru pertama kali kirim ke seseorang — seperti mengetuk pintu sebelum masuk.',
      'Transaksi kripto tidak bisa dibatalkan. Tidak ada tombol "undo" dan tidak ada call center yang bisa menariknya kembali.',
    ],
  },
];

export interface Soal {
  id: string;
  tanya: string;
  pilihan: string[];
  benar: number;
  penjelasan: string;
}

export const KUIS: Soal[] = [
  {
    id: 'k1',
    tanya: 'Apa yang sebenarnya disimpan di dalam dompet kripto?',
    pilihan: ['Koin digitalnya langsung', 'Kunci digital yang membuktikan kepemilikan', 'Uang kertas hasil cetakan', 'Nomor rekening bank'],
    benar: 1,
    penjelasan: 'Koin tercatat di blockchain. Dompet hanya menyimpan kunci yang membuktikan koin itu milikmu.',
  },
  {
    id: 'k2',
    tanya: 'Seseorang mengaku petugas dan meminta 12 kata seed phrase-mu. Apa yang kamu lakukan?',
    pilihan: ['Berikan, karena dia petugas', 'Berikan sebagian saja', 'Jangan pernah berikan ke siapa pun', 'Berikan kalau dia menunjukkan KTP'],
    benar: 2,
    penjelasan: 'Seed phrase = kunci master. Petugas sungguhan tidak pernah memintanya. Siapa pun yang memintanya adalah penipu.',
  },
  {
    id: 'k3',
    tanya: 'Kamu salah ketik satu huruf alamat tujuan. Apa yang terjadi pada uangmu?',
    pilihan: ['Otomatis kembali dalam 24 jam', 'Bisa ditarik lewat call center', 'Bisa hilang dan tidak bisa ditarik kembali', 'Tertahan dan bisa dibatalkan'],
    benar: 2,
    penjelasan: 'Transaksi kripto tidak bisa dibatalkan. Alamat salah = uang nyasar. Makanya selalu salin-tempel.',
  },
  {
    id: 'k4',
    tanya: 'Kenapa kirim di jam ramai biayanya lebih mahal?',
    pilihan: ['Karena kurs naik', 'Karena validator memprioritaskan yang bayar lebih', 'Karena dompetnya sedang rusak', 'Karena ada pajak jam ramai'],
    benar: 1,
    penjelasan: 'Biaya jaringan seperti ongkos tol: makin ramai jalannya, makin mahal untuk didahulukan.',
  },
  {
    id: 'k5',
    tanya: 'Sebelum kirim ke orang baru, kebiasaan paling aman adalah…',
    pilihan: ['Langsung kirim semuanya', 'Kirim jumlah kecil dulu sebagai tes', 'Kirim lewat tangkapan layar', 'Minta orang itu mengirim dulu'],
    benar: 1,
    penjelasan: 'Kirim jumlah kecil dulu untuk memastikan alamat dan jaringan benar — seperti mengetuk pintu sebelum masuk.',
  },
];

export interface Faq {
  tanya: string;
  jawab: string;
}

export const FAQ_PAK_LOKET: Faq[] = [
  {
    tanya: 'Apakah uang di DompetKita ini uang sungguhan?',
    jawab:
      'Bukan, Mas/Mbak. Semua saldo, harga, dan alamat di sini hanya contoh untuk latihan. Tidak ada uang sungguhan yang bergerak. Kalau sudah pede, silakan pakai dompet sungguhan — tapi ingat pelajaran di atas dulu.',
  },
  {
    tanya: 'Kenapa harga BTC/ETH di sini beda dengan yang di berita?',
    jawab:
      'Karena harga di sini memang contoh yang kami patok untuk latihan, bukan harga pasar. Harga pasar berubah tiap detik; kalau mau harga asli, cek di bursa resmi.',
  },
  {
    tanya: 'Apakah data saya disimpan di server?',
    jawab:
      'Tidak. Semua catatan tersimpan di browser Mas/Mbak sendiri (localStorage). Kami tidak melihat, tidak mengirim, dan tidak menjual apa pun.',
  },
  {
    tanya: 'Saya salah kirim di latihan ini, bagaimana?',
    jawab:
      'Tenang — ini latihan, jadi tidak ada yang hilang sungguhan. Tekan "Reset demo" di bagian riwayat, saldo kembali seperti semula dan Mas/Mbak bisa coba lagi.',
  },
  {
    tanya: 'Apa bedanya dompet kripto dengan rekening bank?',
    jawab:
      'Di bank, uangmu dijaga bank dan bisa dibantu kalau lupa kata sandi. Di kripto, kamulah banknya sendiri: tidak ada yang bisa membantumu kalau kunci hilang — tapi juga tidak ada yang bisa membekukan uangmu.',
  },
];

export const MARQUEE_1 = 'KIRIM ✳ TERIMA ✳ HITUNG BIAYA ✳ BELAJAR ✳ KARCIS ✳ LOKET BUKA ✳ ';
export const MARQUEE_2 = 'BIAYA SANTAI Rp1.500 ✳ BIAYA BIASA Rp4.000 ✳ BIAYA NGEBUT Rp9.000 ✳ UANG CONTOH — BUKAN UANG SUNGGUHAN ✳ ';
