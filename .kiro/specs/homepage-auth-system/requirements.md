# Requirements Document

## Introduction

Fitur Homepage dan Authentication System adalah fondasi utama platform Repareka yang menyediakan tampilan utama seperti e-commerce (mirip Tokopedia) namun khusus untuk jasa reparasi, serta sistem autentikasi yang memisahkan akses untuk customer dan mitra. Homepage akan menjadi halaman pertama yang dilihat pengguna saat mengakses aplikasi, menampilkan layanan reparasi dari berbagai UMKM dengan fitur pencarian dan filtering yang intuitif. Sistem autentikasi akan mengarahkan user ke homepage setelah login, sedangkan mitra akan diarahkan ke dashboard khusus mereka.

## Requirements

### Requirement 1

**User Story:** Sebagai pengunjung baru, saya ingin melihat tampilan homepage yang menarik dengan daftar layanan reparasi yang tersedia, sehingga saya dapat dengan mudah menemukan jasa reparasi yang saya butuhkan.

#### Acceptance Criteria

1. WHEN pengguna mengakses root URL aplikasi THEN sistem SHALL menampilkan homepage dengan layout e-commerce
2. WHEN homepage dimuat THEN sistem SHALL menampilkan header dengan logo Repareka, search bar, dan tombol login/register
3. WHEN homepage dimuat THEN sistem SHALL menampilkan kategori layanan reparasi (Pakaian, Sepatu, Elektronik, Furniture, Jam/Aksesoris, Tas, Lainnya)
4. WHEN homepage dimuat THEN sistem SHALL menampilkan grid card layanan UMKM dengan foto, nama, rating, harga, dan lokasi
5. WHEN homepage dimuat THEN sistem SHALL menampilkan sidebar filter untuk kategori, lokasi, harga, dan rating
6. WHEN pengguna scroll ke bawah THEN sistem SHALL memuat lebih banyak layanan dengan infinite scroll

### Requirement 2

**User Story:** Sebagai pengguna, saya ingin dapat mencari dan memfilter layanan reparasi berdasarkan kategori, lokasi, harga, dan rating, sehingga saya dapat menemukan layanan yang sesuai dengan kebutuhan saya.

#### Acceptance Criteria

1. WHEN pengguna mengetik di search bar THEN sistem SHALL menampilkan hasil pencarian real-time
2. WHEN pengguna memilih kategori di filter THEN sistem SHALL menampilkan hanya layanan dari kategori tersebut
3. WHEN pengguna memilih filter lokasi THEN sistem SHALL menampilkan layanan berdasarkan provinsi dan kota/kabupaten
4. WHEN pengguna mengatur filter harga THEN sistem SHALL menampilkan layanan dalam rentang harga yang dipilih
5. WHEN pengguna memilih filter rating THEN sistem SHALL menampilkan layanan dengan rating minimum yang dipilih
6. WHEN pengguna menggunakan multiple filter THEN sistem SHALL menampilkan hasil yang memenuhi semua kriteria filter
7. WHEN tidak ada hasil yang ditemukan THEN sistem SHALL menampilkan pesan "Tidak ada layanan yang ditemukan" dengan saran pencarian

### Requirement 3

**User Story:** Sebagai customer, saya ingin dapat mendaftar dan login ke platform, sehingga saya dapat mengakses fitur booking dan komunikasi dengan penyedia jasa.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol "Daftar" THEN sistem SHALL menampilkan form registrasi customer
2. WHEN pengguna mengisi form registrasi customer dengan email, nama lengkap, password, dan lokasi THEN sistem SHALL memvalidasi data dan membuat akun customer
3. WHEN customer berhasil registrasi THEN sistem SHALL mengirim email verifikasi
4. WHEN customer mengklik link verifikasi email THEN sistem SHALL mengaktifkan akun dan redirect ke homepage
5. WHEN customer login dengan kredensial yang valid THEN sistem SHALL redirect ke homepage dengan status authenticated
6. WHEN customer mengakses fitur yang memerlukan autentikasi THEN sistem SHALL mengizinkan akses
7. WHEN customer logout THEN sistem SHALL menghapus session dan redirect ke homepage sebagai guest

### Requirement 4

**User Story:** Sebagai mitra UMKM, saya ingin dapat mendaftar dan login ke platform dengan akses terpisah dari customer, sehingga saya dapat mengelola profil bisnis dan menerima pesanan.

#### Acceptance Criteria

1. WHEN mitra mengakses URL "/mitra" THEN sistem SHALL menampilkan halaman registrasi/login khusus mitra
2. WHEN mitra mengisi form registrasi dengan business email, phone number, password, business name, dan address THEN sistem SHALL membuat akun mitra dengan status pending
3. WHEN mitra berhasil registrasi THEN sistem SHALL mengirim notifikasi ke admin untuk verifikasi
4. WHEN mitra login dengan kredensial yang valid dan akun sudah diverifikasi THEN sistem SHALL redirect ke dashboard mitra
5. WHEN mitra login dengan akun yang belum diverifikasi THEN sistem SHALL menampilkan pesan "Akun sedang dalam proses verifikasi"
6. WHEN mitra mengakses halaman customer THEN sistem SHALL redirect ke dashboard mitra
7. WHEN mitra logout THEN sistem SHALL menghapus session dan redirect ke halaman login mitra

### Requirement 5

**User Story:** Sebagai mitra yang sudah terverifikasi, saya ingin mengakses dashboard khusus mitra setelah login, sehingga saya dapat mengelola bisnis dan melihat pesanan masuk.

#### Acceptance Criteria

1. WHEN mitra login berhasil THEN sistem SHALL menampilkan dashboard mitra dengan sidebar navigation
2. WHEN dashboard mitra dimuat THEN sistem SHALL menampilkan overview metrics (pesanan baru, total pendapatan, rating rata-rata)
3. WHEN dashboard mitra dimuat THEN sistem SHALL menampilkan daftar pesanan terbaru dengan status
4. WHEN dashboard mitra dimuat THEN sistem SHALL menampilkan notifikasi pesanan baru dan pesan customer
5. WHEN mitra mengklik menu sidebar THEN sistem SHALL navigasi ke halaman yang sesuai (Pesanan, Profil, Kalender, dll)
6. WHEN mitra mengakses halaman yang memerlukan verifikasi THEN sistem SHALL mengizinkan akses hanya jika akun sudah diverifikasi

### Requirement 6

**User Story:** Sebagai pengguna guest (belum login), saya ingin dapat melihat layanan dan profil UMKM namun dengan akses terbatas, sehingga saya terdorong untuk mendaftar untuk mengakses fitur lengkap.

#### Acceptance Criteria

1. WHEN guest mengakses homepage THEN sistem SHALL menampilkan semua layanan tanpa batasan
2. WHEN guest mengklik profil UMKM THEN sistem SHALL menampilkan detail profil dalam mode read-only
3. WHEN guest mencoba mengakses fitur booking THEN sistem SHALL menampilkan modal "Silakan login untuk melakukan booking"
4. WHEN guest mencoba mengakses fitur chat THEN sistem SHALL menampilkan modal "Silakan login untuk mengirim pesan"
5. WHEN guest mencoba memberikan review THEN sistem SHALL menampilkan modal "Silakan login untuk memberikan ulasan"
6. WHEN guest mengklik "Login untuk melanjutkan" THEN sistem SHALL redirect ke halaman login dengan return URL

### Requirement 7

**User Story:** Sebagai pengguna mobile, saya ingin homepage dan sistem autentikasi yang responsive, sehingga saya dapat menggunakan platform dengan nyaman di perangkat mobile.

#### Acceptance Criteria

1. WHEN pengguna mengakses homepage di mobile THEN sistem SHALL menampilkan layout yang responsive dengan navigation drawer
2. WHEN pengguna menggunakan filter di mobile THEN sistem SHALL menampilkan filter dalam bottom sheet atau modal
3. WHEN pengguna mengisi form registrasi/login di mobile THEN sistem SHALL menampilkan form yang user-friendly dengan keyboard yang sesuai
4. WHEN pengguna scroll di mobile THEN sistem SHALL mempertahankan performance dengan lazy loading
5. WHEN pengguna menggunakan touch gesture THEN sistem SHALL merespons dengan smooth animation