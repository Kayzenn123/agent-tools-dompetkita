import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Loket', href: getPermalink('/#loket') },
    { text: 'Kirim', href: getPermalink('/#kirim') },
    { text: 'Terima', href: getPermalink('/#terima') },
    { text: 'Kalkulator', href: getPermalink('/#kalkulator') },
    { text: 'Belajar', href: getPermalink('/#belajar') },
    { text: 'Riwayat', href: getPermalink('/#riwayat') },
  ],
  actions: [{ text: 'Kirim uang contoh', href: getPermalink('/#kirim') }],
};

export const footerData = {
  links: [
    {
      title: 'Loket',
      links: [
        { text: 'Kirim', href: getPermalink('/#kirim') },
        { text: 'Terima', href: getPermalink('/#terima') },
        { text: 'Kalkulator biaya', href: getPermalink('/#kalkulator') },
        { text: 'Belajar', href: getPermalink('/#belajar') },
        { text: 'Riwayat karcis', href: getPermalink('/#riwayat') },
      ],
    },
    {
      title: 'Tanya Pak Loket',
      links: [
        { text: 'Apa itu dompet kripto?', href: getPermalink('/#belajar') },
        { text: 'Kenapa ada biaya jaringan?', href: getPermalink('/#belajar') },
        { text: 'Apa itu seed phrase?', href: getPermalink('/#belajar') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/Kayzenn123/agent-tools-dompetkita' },
  ],
  footNote: `
    DompetKita adalah <strong>simulator edukasi</strong> — semua saldo, harga, dan alamat di sini hanya contoh, bukan uang sungguhan. Dibangun sebagai loket latihan untuk pemula.
  `,
};
