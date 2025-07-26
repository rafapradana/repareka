---
inclusion: always
---

## Panduan Bahasa dan Konvensi Proyek

### Bahasa dan Komunikasi
- Selalu gunakan **bahasa Indonesia** untuk:
  - Komentar dalam kode
  - Dokumentasi
  - Respon chat dan komunikasi
  - Pesan commit dan dokumentasi teknis

### Standar Dokumentasi
- Dokumentasikan semua kode dengan baik, benar, rapi, dan selalu up-to-date
- Gunakan komentar yang jelas dan deskriptif dalam bahasa Indonesia
- Pastikan dokumentasi API dan fungsi selalu sinkron dengan implementasi

### Integrasi Database
- Untuk akses dan pengelolaan database, **wajib gunakan MCP tool Supabase**
- Jangan gunakan koneksi database langsung ataupun nulis sql as a file tanpa melalui MCP tool

### Pencarian dan Referensi
- Gunakan **Context7 MCP tool** untuk pencarian dokumentasi dan referensi library

### Tema dan Styling
- Selalu ikuti tema yang telah ditetapkan di `src/app/globals.css`
- Gunakan variabel CSS yang sudah didefinisikan:
  - Primary colors: `--primary-*` (hijau)
  - Secondary colors: `--secondary-*` (biru-hijau)
  - Base colors: `--base-*` (abu-abu)
- Pastikan konsistensi dengan layout di `src/app/layout.tsx`
- Gunakan font Inter yang sudah dikonfigurasi dengan variable `--font-sans`
- Dukung mode dark/light theme yang sudah diatur

### Arsitektur Kode
- Ikuti struktur Next.js App Router
- Gunakan TypeScript untuk type safety
- Implementasikan responsive design dengan Tailwind CSS