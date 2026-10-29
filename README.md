# Vervin

Platform untuk membuat portofolio, CV, dan bio-link secara instan. Pilih template, isi data, sesuaikan tampilannya, lalu langsung online di server Vervin.

> 🔗 Demo: [https://vervin.vercel.app/]

<!-- Tambahkan 1-2 tangkapan layar di sini, contoh: ![Tampilan Vervin](docs/screenshot.png) -->

## Tentang Vervin

Membuat portofolio atau CV online biasanya menuntut kemampuan coding, pembelian domain, dan pengaturan hosting. Vervin menyederhanakan semua itu: pengguna cukup memilih template dan mengisi data, sedangkan proses deploy ditangani oleh platform.

## Fitur

- Beberapa jenis halaman: portofolio, CV, bio-link, dan lainnya
- Pilihan template yang bisa dikustomisasi
- Deploy otomatis ke server Vervin tanpa konfigurasi manual

## Cara Menggunakan

1. Pilih template yang sesuai kebutuhan.
2. Isi data (profil, pengalaman, proyek, tautan).
3. Sesuaikan tampilan (warna, susunan, konten).
4. Deploy, dan halaman langsung bisa diakses publik.

## Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend & Database | Next.js, Supabase |
| Deployment | Vercel |
| Version Control | Git & GitHub |

## Menjalankan di Komputer Lokal

Prasyarat: Node.js dan akun Supabase.

```bash
git clone [https://github.com/belhartrp/vervin]
cd vervin
npm install
```

Buat berkas `.env.local` di folder utama lalu isi dengan kredensial Supabase milikmu (sesuaikan nama variabel dengan yang dipakai di kode):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jalankan server pengembangan:

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

> ⚠️ Jangan pernah mengunggah berkas `.env.local` atau kunci rahasia Supabase ke repository publik.

## Pembuat

Dibuat oleh **Belhart Rajesky Pasaribu**, mahasiswa Universitas Katolik Santo Thomas, Medan.

- LinkedIn: [https://www.linkedin.com/in/belhart-rajesky-pasaribu-8709a536b/]
- GitHub: [https://github.com/belhartrp]
- Portofolio: [https://belhartrp.vercel.app/]
