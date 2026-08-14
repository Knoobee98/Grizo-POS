# 🛒 Grizo-POS — Modern Cloud POS & Multi-Device Real-Time Store Management

**Grizo-POS** adalah aplikasi Kasir (Point of Sale) & Manajemen Toko modern berbasis web yang mendukung sinkronisasi data *multi-device* secara *real-time*, manajemen inventaris barang & jasa, cetak struk thermal via Bluetooth ESC/POS, serta pelaporan kinerja toko terpusat.

---

## 🌟 Deskripsi Singkat untuk Section "About" GitHub

> **Short Description (untuk kolom Description di GitHub repository):**
> 
> *Modern Cloud-Connected POS & Store Management System built with React, Vite, Drizzle ORM, and Supabase Realtime.*

---

## ✨ Fitur Utama (Key Features)

### 💻 1. Multi-Device Real-Time Tracking (Supabase Realtime)
- **Live Terminal & Shift Tracking**: Pelacakan status *Check-In*, *On Break*, dan *Check-Out* kasir secara seketika (*real-time WebSocket*) antar perangkat (HP/Tablet Kasir & Laptop Admin).
- **Statistik Kasir Aktif & Feed Omset Live**: Admin dapat memantau kasir bertugas dan total transaksi toko secara langsung tanpa perlu *refresh* halaman.

### 💳 2. Terminal Kasir & Cetak Struk Thermal (ESC/POS)
- **POS Kasir Interaktif**: Pencarian produk cepat, filter kategori, scanner kode batang/SKU, dan kalkulasi diskon & pajak instan.
- **Web Bluetooth Thermal Printer Integration**: Mendukung cetak struk nota langsung ke printer thermal Bluetooth (80mm/58mm) dengan format byte ESC/POS native, serta opsi dialog cetak sistem browser.

### 📦 3. Manajemen Inventaris & Kategori (Barang vs Jasa)
- **Dukungan Tipe Item**: Memisahkan pengelolaan antara produk **Barang Fisik** (dengan pelacakan stok otomatis) dan **Jasa/Layanan** (tanpa stok fisik).
- **Kompresi Gambar WebP**: Pengunggahan foto produk otomatis dikompresi ke format `image/webp` langsung di canvas browser untuk menghemat memori.
- **Peringatan Stok Kritis (*Low Stock Alert*)**: Notifikasi otomatis saat stok barang di bawah batas minimum.

### 📊 4. Pelaporan & Hak Akses Berbasis Role (RBAC)
- **Isolasi Role Ketat**:
  - **Kasir (`Cashier`)**: Akses eksklusif ke Mesin Kasir POS dan laporan riwayat transaksi pribadi.
  - **Admin & Store Manager**: Akses eksklusif ke Dashboard Terminal, Katalog Inventaris, Pengaturan Toko, dan Laporan Penjualan/Kehadiran Terpusat Seluruh Kasir (Menu POS Kasir tersembunyi).
- **Laporan Penjualan & Absensi**: Filter laporan rentang waktu dinamis (*Semua Riwayat*, *Hari Ini*, *Bulan Ini*) dan grafik pencapaian toko.

### 🚀 5. Arsitektur Modern & Database ORM
- **Drizzle ORM & PostgreSQL**: Skema database terstruktur dengan migrasi otomatis 5 tabel utama (`store_config`, `categories`, `products`, `transactions`, `attendance_logs`).
- **PWA Ready & Local Fallback**: Memiliki mekanisme proteksi kuota memori browser (`QuotaExceededError`) dan dukungan mode offline fallback.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion (Framer Motion)
- **Backend / Real-time**: Supabase Realtime (WebSocket), Supabase JS Client
- **Database & ORM**: PostgreSQL, Drizzle ORM, Drizzle-Kit
- **Hardware Integration**: Web Bluetooth API, ESC/POS Thermal Command Buffer
- **Image Processing**: Canvas WebP Compression

---

## 🏷️ GitHub Topics / Tags

Tambahkan kata kunci berikut di bagian **Topics** repository GitHub Anda:

`pos` • `point-of-sale` • `react` • `typescript` • `vite` • `drizzle-orm` • `supabase-realtime` • `esc-pos` • `bluetooth-printing` • `inventory-management` • `cashier-app` • `store-management`

---

## 🚀 Cara Menjalankan Lokal (Quick Start)

1. **Clone repository**:
   ```bash
   git clone https://github.com/USERNAME/Grizo-POS.git
   cd Grizo-POS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Pengaturan `.env`**:
   Salin `.env.example` menjadi `.env` dan masukkan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=postgresql://postgres.your-project:YOUR-PASSWORD@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
   ```

4. **Migrasi Database & Jalankan Server Dev**:
   ```bash
   npm run db:push
   npm run dev
   ```