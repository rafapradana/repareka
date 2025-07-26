# Database Setup Documentation

## Overview
Database schema dan konfigurasi Supabase untuk platform Repareka telah berhasil dibuat dengan lengkap.

## Tabel yang Dibuat

### 1. users
Tabel untuk menyimpan data customer/pengguna biasa.
- **Kolom utama**: id, email, full_name, phone, avatar_url, province, city, address
- **RLS**: Users hanya dapat melihat dan mengupdate data mereka sendiri

### 2. mitra  
Tabel untuk menyimpan data mitra/penyedia jasa.
- **Kolom utama**: id, email, business_name, phone, address, province, city, business_type, verification_status, is_active
- **RLS**: Mitra hanya dapat melihat dan mengupdate data mereka sendiri, Admin dapat melihat semua mitra

### 3. categories
Tabel untuk menyimpan kategori layanan.
- **Kolom utama**: id, name, slug, icon, description, is_active
- **RLS**: Semua user dapat melihat categories yang aktif, hanya admin yang dapat mengelola

### 4. services
Tabel untuk menyimpan layanan yang ditawarkan mitra.
- **Kolom utama**: id, mitra_id, category_id, title, description, price_min, price_max, images, rating, total_reviews, is_active
- **RLS**: Semua user dapat melihat services aktif dari mitra terverifikasi, mitra dapat mengelola services mereka sendiri

## Row Level Security (RLS)
Semua tabel telah dikonfigurasi dengan RLS policies yang sesuai untuk:
- Customer: Akses terbatas pada data mereka sendiri
- Mitra: Akses terbatas pada data bisnis mereka sendiri  
- Admin: Akses penuh untuk verifikasi dan pengelolaan
- Guest: Akses read-only pada data publik

## Authentication & Custom Claims
- Function untuk set dan get user role
- Trigger otomatis untuk membuat profile saat user baru mendaftar
- Support untuk role: customer, mitra, admin

## Seed Data
### Categories (7 kategori):
1. Pakaian 👕
2. Sepatu 👞  
3. Elektronik 📱
4. Furniture 🪑
5. Jam/Aksesoris ⌚
6. Tas 👜
7. Lainnya 🔧

### Sample Data:
- 5 sample mitra dengan status approved
- 12 sample services dari berbagai kategori
- Semua dengan data realistis (rating, reviews, harga, lokasi)

## Utility Functions
- `get_services_with_details()`: Mengambil services dengan informasi mitra dan kategori
- `search_services(query)`: Pencarian services berdasarkan keyword
- `set_user_role()`, `get_user_role()`: Manajemen role user
- `is_admin()`, `is_mitra()`: Helper functions untuk check role

## Database Indexes
Telah dibuat indexes yang optimal untuk:
- Email lookups (users, mitra)
- Location-based queries (province, city)
- Service filtering (category, rating, price, active status)
- Verification status queries

## Status
✅ Database schema lengkap
✅ RLS policies configured  
✅ Authentication setup dengan custom claims
✅ Seed data untuk development
✅ Utility functions untuk aplikasi
✅ Indexes untuk performance optimization

Database siap untuk digunakan oleh aplikasi frontend.