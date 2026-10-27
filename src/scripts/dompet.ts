// DompetKita — logika klien (satu file, tanpa framework).
// State di localStorage `dompetkita:v1` (skema berversi, try/catch, fallback default).
// Semua angka = CONTOH latihan, bukan uang/harga sungguhan.
import { ASSETS, SPEEDS, KONTAK, ALAMAT_SAYA, SALDO_AWAL, TRANSAKSI_CONTOH, KUIS } from '../data/dompet';
import type { AssetId, SpeedId, Tx } from '../data/dompet';

const LS_KEY = 'dompetkita:v1';
const LS_GERAK = 'dompetkita:gerak';

interface State {
  v: 1;
  balances: Record<AssetId, number>;
  txs: Tx[];
  lessonsDone: string[];
  quiz: { score: number; done: boolean } | null;
  queueClicks: number;
  nextNo: number;
}

const DEFAULT_STATE: State = {
  v: 1,
  balances: { ...SALDO_AWAL },
  txs: [...TRANSAKSI_CONTOH],
  lessonsDone: [],
  quiz: null,
  queueClicks: 0,
  nextNo: 119,
};

function loadState(): State {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const s = JSON.parse(raw) as Partial<State>;
    if (s.v !== 1 || !s.balances || !Array.isArray(s.txs)) return structuredClone(DEFAULT_STATE);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...s,
      balances: { ...SALDO_AWAL, ...(s.balances ?? {}) },
      txs: s.txs.filter((t) => t && typeof t.jumlah === 'number'),
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* penyimpanan penuh/diblokir: aplikasi tetap jalan di memori */
  }
}

let state = loadState();

// ---------- format ----------
const fmtRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number, d = 0) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: d }).format(n);
const assetById = (id: AssetId) => ASSETS.find((a) => a.id === id)!;
const speedById = (id: SpeedId) => SPEEDS.find((s) => s.id === id)!;
const feeFor = (aset: AssetId, speed: SpeedId) => speedById(speed).biaya[aset];
const fmtAsset = (n: number, aset: AssetId) =>
  aset === 'IDR' ? fmtRp(n) : `${fmtNum(n, assetById(aset).desimal)} ${aset}`;
const fmtTanggal = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
const totalRp = () => (Object.keys(state.balances) as AssetId[]).reduce((s, k) => s + state.balances[k] * assetById(k).hargaContohRp, 0);

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel);
const $$ = (sel: string) => [...document.querySelectorAll<HTMLElement>(sel)];

function announce(msg: string) {
  const live = $('#live-region');
  if (live) live.textContent = msg;
}

let toastTimer: number | undefined;
function toast(msg: string) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  announce(msg);
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove('show'), 2600);
}

async function salinTeks(teks: string, pesanOk: string) {
  try {
    await navigator.clipboard.writeText(teks);
    toast(pesanOk);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = teks;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      toast(pesanOk);
    } catch {
      toast('Gagal menyalin, Mas/Mbak — salin manual saja, ya.');
    }
    ta.remove();
  }
}

// ---------- render: saldo ----------
function renderSaldo() {
  const total = $('#saldo-total');
  if (total) total.textContent = fmtRp(totalRp());
  const rincian = $('#saldo-rincian');
  if (rincian) {
    rincian.innerHTML = (Object.keys(state.balances) as AssetId[])
      .map((k) => {
        const a = assetById(k);
        return `<li class="flex items-start justify-between gap-3 border-b-2 border-dashed border-[var(--line)] py-2 last:border-0">
          <span class="font-bold">${a.nama}</span>
          <span class="text-right font-mono"><span class="block">${fmtAsset(state.balances[k], k)}</span><span class="block text-xs text-[var(--redup)]">≈ ${fmtRp(state.balances[k] * a.hargaContohRp)}</span></span>
        </li>`;
      })
      .join('');
  }
}

// ---------- render: riwayat (karcis) ----------
let filterAktif: 'semua' | 'kirim' | 'terima' = 'semua';

function karcisHtml(tx: Tx): string {
  const tanda = tx.jenis === 'kirim' ? '−' : '+';
  return `<article class="karcis p-4 sm:p-5" data-id="${tx.id}">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="font-mono text-sm font-bold tracking-wide">${tx.no} ${tx.contoh ? '· CONTOH' : ''}</p>
        <p class="font-mono text-xs text-[var(--redup)]">${fmtTanggal(tx.waktu)} · ${speedById(tx.kecepatan).nama} · ${speedById(tx.kecepatan).waktu}</p>
      </div>
      <span class="stempel on px-2 py-1 text-xs" aria-hidden="true">LUNAS</span>
    </div>
    <div class="karcis-divider my-3"></div>
    <p class="text-lg font-bold">${tx.jenis === 'kirim' ? 'Kirim ke' : 'Terima dari'} ${tx.pihak}</p>
    <p class="font-mono text-2xl font-bold ${tx.jenis === 'kirim' ? 'text-[var(--pop)]' : 'text-[var(--loket)]'}">${tanda}${fmtAsset(tx.jumlah, tx.aset)}</p>
    <p class="font-mono text-sm text-[var(--redup)]">Biaya jaringan: ${tx.biaya > 0 ? `${fmtAsset(tx.biaya, tx.aset)} (≈ ${fmtRp(tx.biaya * assetById(tx.aset).hargaContohRp)})` : 'Rp0 (penerimaan)'}</p>
    <div class="mt-3 flex gap-2">
      <button type="button" class="btn-loket btn-salin-karcis border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-bold" data-id="${tx.id}">Salin karcis</button>
      <button type="button" class="btn-loket btn-sobek border-2 border-[var(--line)] bg-white px-3 py-2 text-sm font-bold" data-id="${tx.id}">Sobek (hapus)</button>
    </div>
  </article>`;
}

function renderRiwayat() {
  const wadah = $('#daftar-riwayat');
  const kosong = $('#riwayat-kosong');
  if (!wadah) return;
  const list = state.txs.filter((t) => filterAktif === 'semua' || t.jenis === filterAktif);
  wadah.innerHTML = list.map(karcisHtml).join('');
  if (kosong) kosong.hidden = list.length > 0;
  $$('.filter-riwayat').forEach((b) => {
    const aktif = b.dataset.filter === filterAktif;
    b.setAttribute('aria-pressed', String(aktif));
    b.classList.toggle('bg-[var(--loket)]', aktif);
    b.classList.toggle('text-white', aktif);
  });
}

// ---------- estimasi kirim ----------
function bacaFormKirim(): { kontak: string; aset: AssetId; jumlah: number; kecepatan: SpeedId } {
  const kontak = (document.querySelector<HTMLInputElement>('input[name="kontak"]:checked')?.value ?? KONTAK[0].nama) as string;
  const aset = ($('#kirim-aset') as HTMLSelectElement)?.value as AssetId;
  const jumlah = parseFloat(($('#kirim-jumlah') as HTMLInputElement)?.value.replace(',', '.') ?? NaN);
  const kecepatan = (document.querySelector<HTMLInputElement>('input[name="kecepatan"]:checked')?.value ?? 'standar') as SpeedId;
  return { kontak, aset, jumlah, kecepatan };
}

function renderEstimasi() {
  const { aset, jumlah, kecepatan } = bacaFormKirim();
  const box = $('#estimasi');
  if (!box) return;
  const biaya = feeFor(aset, kecepatan);
  const saldo = state.balances[aset];
  const set = (id: string, teks: string) => {
    const el = $(`#${id}`);
    if (el) el.textContent = teks;
  };
  if (!Number.isFinite(jumlah) || jumlah <= 0) {
    set('est-biaya', `Biaya: ${fmtAsset(biaya, aset)} (≈ ${fmtRp(biaya * assetById(aset).hargaContohRp)})`);
    set('est-total', 'Total: —');
    set('est-waktu', `Perkiraan sampai: ${speedById(kecepatan).waktu}`);
    set('est-sisa', `Saldo ${aset} kamu: ${fmtAsset(saldo, aset)}`);
    return;
  }
  const total = jumlah + biaya;
  set('est-biaya', `Biaya: ${fmtAsset(biaya, aset)} (≈ ${fmtRp(biaya * assetById(aset).hargaContohRp)})`);
  set('est-total', `Total yang keluar: ${fmtAsset(total, aset)}`);
  set('est-waktu', `Perkiraan sampai: ${speedById(kecepatan).waktu}`);
  set('est-sisa', total > saldo ? `Saldo tidak cukup — kurang ${fmtAsset(total - saldo, aset)}` : `Sisa saldo setelah kirim: ${fmtAsset(saldo - total, aset)}`);
}

function kirimUang(e: Event) {
  e.preventDefault();
  const err = $('#kirim-error');
  const { kontak, aset, jumlah, kecepatan } = bacaFormKirim();
  const jumlahInput = $('#kirim-jumlah') as HTMLInputElement;
  const gagal = (pesan: string) => {
    if (err) {
      err.textContent = pesan;
      err.hidden = false;
    }
    jumlahInput?.classList.add('field-error');
    jumlahInput?.focus();
    announce(pesan);
  };
  jumlahInput?.classList.remove('field-error');
  if (err) err.hidden = true;

  if (!Number.isFinite(jumlah) || jumlah <= 0) {
    gagal('Jumlahnya belum diisi dengan benar, Mas/Mbak — tulis dulu berapa yang mau dikirim, harus lebih dari nol.');
    return;
  }
  const biaya = feeFor(aset, kecepatan);
  const total = jumlah + biaya;
  if (total > state.balances[aset]) {
    gagal(`Saldo ${aset} kurang ${fmtAsset(total - state.balances[aset], aset)} untuk kirim ini. Kurangi jumlahnya atau pilih aset lain, ya.`);
    return;
  }

  const btn = $('#btn-kirim') as HTMLButtonElement;
  btn.disabled = true;
  btn.textContent = 'Menempel stempel…';
  window.setTimeout(() => {
    state.balances[aset] -= total;
    const tx: Tx = {
      id: `t${Date.now()}`,
      no: `DK-${String(state.nextNo++).padStart(6, '0')}`,
      jenis: 'kirim',
      pihak: kontak,
      aset,
      jumlah,
      biaya,
      kecepatan,
      waktu: new Date().toISOString(),
      contoh: false,
    };
    state.txs.unshift(tx);
    saveState();
    renderSaldo();
    renderRiwayat();
    // tampilkan karcis hasil
    const k = $('#karcis-hasil');
    const set = (id: string, teks: string) => {
      const el = $(`#${id}`);
      if (el) el.textContent = teks;
    };
    set('karcis-no', `${tx.no}`);
    set('karcis-pihak', `Kirim ke ${kontak}`);
    set('karcis-jumlah', `−${fmtAsset(jumlah, aset)}`);
    set('karcis-biaya', `Biaya: ${fmtAsset(biaya, aset)} · ${speedById(kecepatan).nama} · sampai ${speedById(kecepatan).waktu}`);
    set('karcis-waktu', fmtTanggal(tx.waktu));
    if (k) {
      k.hidden = false;
      k.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const stempel = $('#stempel-karcis');
    stempel?.classList.remove('on');
    window.setTimeout(() => stempel?.classList.add('on'), 200);
    btn.disabled = false;
    btn.textContent = 'Tempel stempel & kirim';
    announce(`Berhasil. Karcis ${tx.no} sudah keluar: kirim ${fmtAsset(jumlah, aset)} ke ${kontak}.`);
  }, 600);
}

// ---------- kalkulator ----------
function renderKalkulator() {
  const aset = ($('#kalk-aset') as HTMLSelectElement)?.value as AssetId;
  const jumlah = parseFloat((($('#kalk-jumlah') as HTMLInputElement)?.value.replace(',', '.') ?? 'NaN'));
  const kecepatan = (document.querySelector<HTMLInputElement>('input[name="kalk-kecepatan"]:checked')?.value ?? 'standar') as SpeedId;
  if (!aset) return;
  const biaya = feeFor(aset, kecepatan);
  const set = (id: string, teks: string) => {
    const el = $(`#${id}`);
    if (el) el.textContent = teks;
  };
  set('kalk-biaya', `Biaya jaringan: ${fmtAsset(biaya, aset)} (≈ ${fmtRp(biaya * assetById(aset).hargaContohRp)})`);
  set('kalk-waktu', `Perkiraan sampai: ${speedById(kecepatan).waktu}`);
  set(
    'kalk-total',
    Number.isFinite(jumlah) && jumlah > 0
      ? `Total yang keluar: ${fmtAsset(jumlah + biaya, aset)}`
      : 'Tulis jumlah dulu, Mas/Mbak — biar ongkosnya kehitung.'
  );
}

// ---------- belajar & kuis ----------
function renderBelajar() {
  const done = state.lessonsDone.length;
  const bar = $('#belajar-progress-bar') as HTMLElement | null;
  const teks = $('#belajar-progress-teks');
  if (bar) bar.style.width = `${(done / 5) * 100}%`;
  if (teks) teks.textContent = `${done} dari 5 pelajaran selesai dibaca`;
  $$('.pelajaran').forEach((d) => {
    const id = d.dataset.id ?? '';
    const btn = d.querySelector<HTMLButtonElement>('.btn-selesai');
    const sudah = state.lessonsDone.includes(id);
    d.classList.toggle('selesai', sudah);
    if (btn) btn.textContent = sudah ? '✓ Sudah dibaca' : 'Tandai sudah dibaca';
  });
}

function renderKuis() {
  const hasil = $('#kuis-hasil');
  if (!hasil) return;
  if (!state.quiz?.done) {
    hasil.hidden = true;
    return;
  }
  hasil.hidden = false;
  const skor = $('#kuis-skor');
  if (skor) skor.textContent = `Skor kamu: ${state.quiz.score} dari 5 — ${state.quiz.score === 5 ? 'lulus loket, Mas/Mbak!' : state.quiz.score >= 3 ? 'lumayan, tapi baca lagi pelajaran di atas, ya.' : 'belum lulus — baca pelan-pelan pelajaran di atas dulu.'}`;
}

// ---------- ekspor ----------
function unduh(nama: string, isi: string, tipe: string) {
  const blob = new Blob([isi], { type: tipe });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nama;
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportCSV() {
  const baris = [['nomor', 'jenis', 'pihak', 'aset', 'jumlah', 'biaya', 'kecepatan', 'waktu', 'contoh']];
  state.txs.forEach((t) => baris.push([t.no, t.jenis, t.pihak, t.aset, String(t.jumlah), String(t.biaya), t.kecepatan, t.waktu, String(t.contoh)]));
  unduh('dompetkita-riwayat.csv', baris.map((r) => r.map((c) => `"${c.replaceAll('"', '""')}"`).join(',')).join('\n'), 'text/csv');
  toast('Riwayat diunduh sebagai CSV, Mas/Mbak.');
}

function exportJSON() {
  unduh('dompetkita-riwayat.json', JSON.stringify({ v: 1, diekspor: new Date().toISOString(), saldo: state.balances, transaksi: state.txs }, null, 2), 'application/json');
  toast('Riwayat diunduh sebagai JSON, Mas/Mbak.');
}

// ---------- deep-link ----------
function terapkanDeepLink() {
  const p = new URLSearchParams(location.search);
  const tab = p.get('tab');
  if (tab) {
    const target = document.getElementById(tab);
    if (target) window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
  }
  const ke = p.get('ke');
  if (ke) {
    const radio = document.querySelector<HTMLInputElement>(
      `input[name="kontak"][value="${CSS.escape(KONTAK.find((k) => k.nama.toLowerCase().includes(ke.toLowerCase()) || k.pendek.toLowerCase() === ke.toLowerCase())?.nama ?? '')}"]`
    );
    if (radio) radio.checked = true;
  }
  const jumlah = p.get('jumlah');
  if (jumlah && $('#kirim-jumlah')) ($('#kirim-jumlah') as HTMLInputElement).value = jumlah;
  const aset = p.get('aset');
  if (aset && $('#kirim-aset') && ASSETS.some((a) => a.id === aset)) ($('#kirim-aset') as HTMLSelectElement).value = aset;
  renderEstimasi();
}

// ---------- gerak (v4 A–E + MODE RINGAN) ----------
function setupGerak() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ringan =
    prefersReduced ||
    (navigator.hardwareConcurrency ?? 99) <= 4 ||
    ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 99) <= 4 ||
    ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false);
  const tersimpan = localStorage.getItem(LS_GERAK);
  let gerakMati = tersimpan === 'mati' || prefersReduced;

  const btnGerak = $('#btn-gerak');
  const terapkan = () => {
    document.body.classList.toggle('gerak-mati', gerakMati);
    document.body.classList.toggle('mode-ringan', ringan);
    if (btnGerak) {
      btnGerak.textContent = gerakMati ? 'Gerak: mati' : 'Gerak: nyala';
      btnGerak.setAttribute('aria-pressed', String(!gerakMati));
    }
  };
  terapkan();
  btnGerak?.addEventListener('click', () => {
    gerakMati = !gerakMati;
    localStorage.setItem(LS_GERAK, gerakMati ? 'mati' : 'nyala');
    terapkan();
    toast(gerakMati ? 'Gerak dimatikan, Mas/Mbak — halaman jadi tenang.' : 'Gerak dinyalakan lagi.');
  });

  // jeda marquee
  $$('.btn-jeda-marquee').forEach((b) => {
    b.addEventListener('click', () => {
      const jeda = !document.querySelector('.marquee-band')?.classList.contains('paused');
      $$('.marquee-band').forEach((m) => m.classList.toggle('paused', jeda));
      $$('.btn-jeda-marquee').forEach((x) => {
        x.textContent = jeda ? 'Jalankan marquee' : 'Jeda marquee';
        x.setAttribute('aria-pressed', String(jeda));
      });
    });
  });

  if (gerakMati || ringan) return; // mode tenang: tidak ada listener scroll

  // A kamera + C wght + B skew velocity
  const board = $('#board-zoom');
  const root = document.documentElement;
  let raf = 0;
  let lastY = window.scrollY;
  let skewReset: number | undefined;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const y = window.scrollY;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = Math.min(y / max, 1);
      const vel = Math.abs(y - lastY);
      lastY = y;
      if (board) {
        board.style.setProperty('--zoom', (1 + p * 0.08).toFixed(3));
        board.style.setProperty('--pan', `${(p * 24).toFixed(1)}px`);
      }
      root.style.setProperty('--hero-wght', String(Math.round(560 + p * 220)));
      const skew = Math.min(vel * 0.12, 6);
      root.style.setProperty('--marquee-skew', `${skew.toFixed(1)}deg`);
      window.clearTimeout(skewReset);
      skewReset = window.setTimeout(() => root.style.setProperty('--marquee-skew', '0deg'), 160);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // E curtain wipe
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target as HTMLElement).classList.add('in-view')),
    { threshold: 0.12 }
  );
  $$('.wipe').forEach((el) => io.observe(el));

  // D spotlight (pointer halus saja)
  if (window.matchMedia('(pointer: fine)').matches) {
    const spot = $('#spotlight');
    window.addEventListener('mousemove', (e) => {
      spot?.style.setProperty('--mx', `${e.clientX}px`);
      spot?.style.setProperty('--my', `${e.clientY}px`);
      spot?.classList.add('on');
    }, { passive: true });
  }
}

// ---------- init ----------
function init() {
  renderSaldo();
  renderRiwayat();
  renderBelajar();
  renderKuis();
  renderEstimasi();
  renderKalkulator();
  terapkanDeepLink();
  setupGerak();

  // kirim
  $('#form-kirim')?.addEventListener('submit', kirimUang);
  ['kirim-aset', 'kirim-jumlah'].forEach((id) => $(`#${id}`)?.addEventListener('input', renderEstimasi));
  $$('input[name="kontak"], input[name="kecepatan"]').forEach((el) => el.addEventListener('change', renderEstimasi));
  $('#btn-salin-karcis')?.addEventListener('click', () => {
    const teks = [
      `KARCIS ${$('#karcis-no')?.textContent ?? ''} — DOMPETKITA (CONTOH)`,
      $('#karcis-pihak')?.textContent ?? '',
      $('#karcis-jumlah')?.textContent ?? '',
      $('#karcis-biaya')?.textContent ?? '',
      $('#karcis-waktu')?.textContent ?? '',
    ].join('\n');
    salinTeks(teks, 'Karcis disalin, Mas/Mbak.');
  });
  $('#btn-karcis-baru')?.addEventListener('click', () => {
    const k = $('#karcis-hasil');
    if (k) k.hidden = true;
    ($('#form-kirim') as HTMLFormElement)?.reset();
    renderEstimasi();
    $('#kirim-jumlah')?.focus();
  });

  // terima
  const alamatEl = $('#alamat-saya');
  if (alamatEl) alamatEl.textContent = ALAMAT_SAYA;
  $('#btn-salin-alamat')?.addEventListener('click', () => salinTeks(ALAMAT_SAYA, 'Alamat disalin, Mas/Mbak.'));
  $('#btn-bagikan-alamat')?.addEventListener('click', () =>
    salinTeks(`DompetKita saya (contoh): ${ALAMAT_SAYA} — kirim uang contoh ke alamat ini untuk latihan.`, 'Teks alamat disalin, Mas/Mbak.')
  );

  // kalkulator
  ['kalk-aset', 'kalk-jumlah'].forEach((id) => $(`#${id}`)?.addEventListener('input', renderKalkulator));
  $$('input[name="kalk-kecepatan"]').forEach((el) => el.addEventListener('change', renderKalkulator));

  // riwayat: delegasi klik
  $('#daftar-riwayat')?.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const salinBtn = t.closest<HTMLButtonElement>('.btn-salin-karcis');
    const sobekBtn = t.closest<HTMLButtonElement>('.btn-sobek');
    if (salinBtn) {
      const tx = state.txs.find((x) => x.id === salinBtn.dataset.id);
      if (tx) {
        salinTeks(
          `KARCIS ${tx.no} — DOMPETKITA (${tx.contoh ? 'CONTOH' : 'LATIHAN'})\n${tx.jenis === 'kirim' ? 'Kirim ke' : 'Terima dari'} ${tx.pihak}\n${tx.jenis === 'kirim' ? '−' : '+'}${fmtAsset(tx.jumlah, tx.aset)}\nBiaya: ${fmtAsset(tx.biaya, tx.aset)} · ${fmtTanggal(tx.waktu)}`,
          'Karcis disalin, Mas/Mbak.'
        );
      }
      return;
    }
    if (sobekBtn) {
      const card = sobekBtn.closest<HTMLElement>('.karcis');
      const id = sobekBtn.dataset.id;
      if (card) card.classList.add('tearing');
      window.setTimeout(() => {
        state.txs = state.txs.filter((x) => x.id !== id);
        saveState();
        renderRiwayat();
        toast('Karcis disobek dan dibuang, Mas/Mbak.');
      }, 360);
    }
  });
  $$('.filter-riwayat').forEach((b) =>
    b.addEventListener('click', () => {
      filterAktif = (b.dataset.filter as 'semua' | 'kirim' | 'terima') ?? 'semua';
      renderRiwayat();
    })
  );
  $('#btn-export-csv')?.addEventListener('click', exportCSV);
  $('#btn-export-json')?.addEventListener('click', exportJSON);
  $('#btn-reset-demo')?.addEventListener('click', () => {
    if (window.confirm('Reset demo? Semua karcis latihan dan skor akan kembali seperti semula.')) {
      localStorage.removeItem(LS_KEY);
      location.reload();
    }
  });

  // belajar
  $$('.btn-selesai').forEach((b) =>
    b.addEventListener('click', () => {
      const d = b.closest<HTMLElement>('.pelajaran');
      const id = d?.dataset.id ?? '';
      if (!id) return;
      state.lessonsDone = state.lessonsDone.includes(id)
        ? state.lessonsDone.filter((x) => x !== id)
        : [...state.lessonsDone, id];
      saveState();
      renderBelajar();
    })
  );

  // kuis
  $('#form-kuis')?.addEventListener('submit', (e) => {
    e.preventDefault();
    let skor = 0;
    KUIS.forEach((soal) => {
      const pilih = document.querySelector<HTMLInputElement>(`input[name="${soal.id}"]:checked`);
      const fs = document.querySelector<HTMLElement>(`fieldset[data-soal="${soal.id}"]`);
      const benar = pilih?.value === String(soal.benar);
      if (benar) skor++;
      fs?.classList.remove('benar', 'salah');
      fs?.classList.add(pilih ? (benar ? 'benar' : 'salah') : 'salah');
      const pen = fs?.querySelector<HTMLElement>('.penjelasan');
      if (pen) {
        pen.hidden = false;
        pen.textContent = `Penjelasan: ${soal.penjelasan}`;
      }
    });
    state.quiz = { score: skor, done: true };
    saveState();
    renderKuis();
    $('#kuis-hasil')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    announce(`Kuis selesai. Skor ${skor} dari 5.`);
  });

  // easter egg: nomor antrean
  $('#nomor-antrean')?.addEventListener('click', () => {
    state.queueClicks++;
    saveState();
    const el = $('#nomor-antrean .nomor');
    if (state.queueClicks >= 5) {
      if (el) el.textContent = 'A-000';
      $('#stempel-rahasia')?.classList.add('on');
      announce('Stempel rahasia muncul: DIDAHULUKAN — kamu tamu istimewa, Mas/Mbak.');
    } else if (el) {
      el.textContent = `A-00${state.queueClicks}`;
    }
  });
  if (state.queueClicks >= 5) {
    const el = $('#nomor-antrean .nomor');
    if (el) el.textContent = 'A-000';
    $('#stempel-rahasia')?.classList.add('on');
  }
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
