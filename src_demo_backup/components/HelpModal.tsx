import React, { useState } from 'react';
import { Employee } from '../types';

interface HelpModalProps {
  currentCashier?: Employee;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ currentCashier, onClose }) => {
  const isManagement = currentCashier?.role === 'Admin' || currentCashier?.role === 'Store Manager';
  const [activeTab, setActiveTab] = useState<'onboarding' | 'shortcuts' | 'guide' | 'faq'>(
    isManagement ? 'onboarding' : 'shortcuts'
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#c2c7d1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#c2c7d1] bg-[#f9f9fc] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">help</span>
            </div>
            <div>
              <h3 className="font-headline-md text-[19px] font-bold text-[#1a1c1e]">
                Pusat Bantuan & Onboarding Mandiri
              </h3>
              <p className="font-label-data text-[12px] text-[#727780]">
                Panduan langkah demi langkah pengaturan toko baru
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#e8e8ea] text-[#727780] hover:text-[#1a1c1e] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#c2c7d1] bg-white px-3 sm:px-5 text-xs sm:text-sm font-label-sm font-bold overflow-x-auto">
          {isManagement && (
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'onboarding'
                  ? 'border-[#0F4C81] text-[#0F4C81]'
                  : 'border-transparent text-[#727780] hover:text-[#1a1c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span>Setup Toko Baru</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'shortcuts'
                ? 'border-[#0F4C81] text-[#0F4C81]'
                : 'border-transparent text-[#727780] hover:text-[#1a1c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">keyboard</span>
            <span>Pintasan Keyboard</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'guide'
                ? 'border-[#0F4C81] text-[#0F4C81]'
                : 'border-transparent text-[#727780] hover:text-[#1a1c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Panduan Role</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'faq'
                ? 'border-[#0F4C81] text-[#0F4C81]'
                : 'border-transparent text-[#727780] hover:text-[#1a1c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            <span>FAQ</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {activeTab === 'onboarding' && (
            <div className="space-y-4">
              <div className="bg-[#f0fdf4] p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">rocket_launch</span>
                <span>Selamat datang! Ikuti 4 langkah mudah di bawah ini untuk mengonfigurasi toko baru Anda sampai siap melayani transaksi kasir.</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: '1',
                    title: 'Atur Profil & Identitas Toko',
                    desc: 'Buka menu Settings. Isi Nama Toko, Alamat, No. Telp, Tarif Pajak (PPN %), dan Catatan Struk.',
                    icon: 'store',
                    tag: 'Menu Settings'
                  },
                  {
                    step: '2',
                    title: 'Buat Kategori Barang & Jasa',
                    desc: 'Buka menu Inventory > Kelola Kategori. Pisahkan kategori produk fisik (Barang) dan layanan non-stok (Jasa).',
                    icon: 'category',
                    tag: 'Menu Inventory'
                  },
                  {
                    step: '3',
                    title: 'Input Katalog Produk / Layanan',
                    desc: 'Klik "+ Tambah Item" di Inventory. Masukkan Nama, SKU, Harga, serta Stok Awal (untuk barang fisik).',
                    icon: 'inventory_2',
                    tag: 'Menu Inventory'
                  },
                  {
                    step: '4',
                    title: 'Daftarkan Karyawan & Akun Kasir',
                    desc: 'Buka menu Employees > "+ Tambah Karyawan". Buat akun Kasir 1 / Kasir 2 agar staf Anda bisa login & mulai jualan.',
                    icon: 'badge',
                    tag: 'Menu Employees'
                  }
                ].map((st) => (
                  <div key={st.step} className="p-3.5 bg-[#f9f9fc] rounded-2xl border border-[#c2c7d1] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                      {st.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-label-sm text-[14px] font-bold text-[#1a1c1e] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-[#0F4C81]">{st.icon}</span>
                          <span>{st.title}</span>
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] border border-[#0F4C81]/20">
                          {st.tag}
                        </span>
                      </div>
                      <p className="font-body-md text-[12.5px] text-[#42474f] mt-1 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <div className="bg-[#f0f7ff] p-3.5 rounded-xl border border-[#0F4C81]/20 text-xs text-[#0F4C81] flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
                <span>Gunakan kombinasi tombol keyboard di bawah untuk mempercepat transaksi kasir di toko.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'F1', desc: 'Buka Tab Penjualan (New Sale)' },
                  { key: 'F2 / Ctrl+F', desc: 'Cari Produk / Scan Barcode' },
                  { key: 'F4 / Space', desc: 'Buka Modal Pembayaran (Pay Now)' },
                  { key: 'F8', desc: 'Sematkan Pelanggan (Loyalty)' },
                  { key: 'F9', desc: 'Terapkan Diskon Nota' },
                  { key: 'Esc', desc: 'Batalkan / Tutup Pop-Up Modal' }
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-[#f9f9fc] rounded-xl border border-[#c2c7d1]/80"
                  >
                    <span className="font-body-md text-[13px] text-[#1a1c1e] font-medium">
                      {s.desc}
                    </span>
                    <kbd className="px-2.5 py-1 bg-white border border-[#c2c7d1] rounded-lg font-mono font-bold text-[12px] text-[#0F4C81] shadow-2xs">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-5 text-sm text-[#42474f]">
              <div className="space-y-2">
                <h4 className="font-label-sm text-[15px] font-bold text-[#1a1c1e] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  Alur Melayani Transaksi Pembeli
                </h4>
                <ol className="list-decimal pl-10 space-y-1.5 text-[13.5px] leading-relaxed">
                  <li>Pilih kategori atau cari nama produk/SKU di tab <strong>Sales (POS)</strong>.</li>
                  <li>Klik produk untuk menambahkan ke keranjang pesanan. Sesuaikan jumlah unit (+ / -).</li>
                  <li>Sematkan pelanggan (opsional) atau berikan diskon nota jika ada promosi.</li>
                  <li>Klik tombol <strong>Bayar Sekarang (Pay Now)</strong>.</li>
                  <li>Pilih metode pembayaran (Cash / QRIS / EDC Card / Transfer) lalu konfirmasi.</li>
                  <li>Cetak nota stang atau simpan sebagai laporan resmi.</li>
                </ol>
              </div>

              <div className="pt-3 border-t border-[#c2c7d1] space-y-2">
                <h4 className="font-label-sm text-[15px] font-bold text-[#1a1c1e] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  Pembatasan Wewenang Hak Akses (Role System)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px] pt-1">
                  <div className="p-3 bg-[#E0F0FF] rounded-xl border border-[#0F4C81]/30 text-[#00355f]">
                    <p className="font-bold text-[13px] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[16px]">badge</span>
                      Akun KASIR
                    </p>
                    <p>Khusus memproses transaksi kasir, mengelola keranjang, menerima pembayaran, dan mencatat absensi harian.</p>
                  </div>

                  <div className="p-3 bg-[#F5F3FF] rounded-xl border border-[#6366F1]/30 text-[#3730a3]">
                    <p className="font-bold text-[13px] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                      Akun MANAGER / ADMIN
                    </p>
                    <p>Mempunyai wewenang memantau laporan pendapatan, mengelola stok produk, menambah akun karyawan, & konfigurasi toko.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3.5 text-xs text-[#42474f]">
              <div className="p-3.5 bg-[#f9f9fc] rounded-xl border border-[#c2c7d1]">
                <h5 className="font-bold text-[14px] text-[#1a1c1e] mb-1">
                  Q: Bagaimana jika printer struk tidak otomatis mencetak?
                </h5>
                <p className="leading-relaxed">
                  A: Pastikan izin cetak (Print popup) telah diaktifkan di browser Anda. Anda dapat menekan tombol <strong>Cetak Struk</strong> di modal transaksi atau menggunakan kombinasi <code>Ctrl + P</code>.
                </p>
              </div>

              <div className="p-3.5 bg-[#f9f9fc] rounded-xl border border-[#c2c7d1]">
                <h5 className="font-bold text-[14px] text-[#1a1c1e] mb-1">
                  Q: Bagaimana cara mengganti tarif pajak toko?
                </h5>
                <p className="leading-relaxed">
                  A: Masuk dengan akun Manager/Admin, lalu buka tab <strong>Settings</strong>. Pada bagian <em>Tax Rate / Pajak (%)</em>, ubah sesuai dengan ketentuan yang berlaku lalu simpan.
                </p>
              </div>

              <div className="p-3.5 bg-[#f9f9fc] rounded-xl border border-[#c2c7d1]">
                <h5 className="font-bold text-[14px] text-[#1a1c1e] mb-1">
                  Q: Bagaimana jika perlu menghubungi tim bantuan teknis?
                </h5>
                <p className="leading-relaxed">
                  A: Hubungi pusat dukungan Grizolabs via email di <strong>support@grizolabs.com</strong> atau layanan panggilan pesan kilat <strong>+62 812-3456-7890</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#c2c7d1] bg-[#f9f9fc] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0F4C81] text-white rounded-xl font-label-sm text-[13.5px] font-bold hover:bg-[#00355f] transition-all cursor-pointer shadow-xs"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
