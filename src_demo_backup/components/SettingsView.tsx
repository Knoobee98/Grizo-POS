import React, { useState, useEffect } from 'react';
import { StoreConfig, DEFAULT_STORE_CONFIG } from '../types';

interface SettingsViewProps {
  storeConfig: StoreConfig;
  onSaveConfig: (newConfig: StoreConfig) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  storeConfig,
  onSaveConfig,
  onResetDemoData
}) => {
  const [formData, setFormData] = useState<StoreConfig>(storeConfig || DEFAULT_STORE_CONFIG);
  const [taxInput, setTaxInput] = useState(((storeConfig?.taxRate || 0.085) * 100).toString());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  useEffect(() => {
    if (storeConfig) {
      setFormData(storeConfig);
      setTaxInput((storeConfig.taxRate * 100).toString());
    }
  }, [storeConfig]);

  const handleFieldChange = (field: keyof StoreConfig, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTax = parseFloat(taxInput);
    const validTaxRate = !isNaN(parsedTax) && parsedTax >= 0 ? parsedTax / 100 : 0.085;

    const finalConfig: StoreConfig = {
      ...formData,
      taxRate: validTaxRate
    };

    onSaveConfig(finalConfig);
    setSaveSuccessMsg('Konfigurasi toko berhasil disimpan secara permanen!');
    
    // Smooth scroll to top for alert feedback
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f9f9fc]">
      <form onSubmit={handleSaveAll} className="max-w-[1000px] mx-auto space-y-6 pb-12">
        {/* Header Title & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#c2c7d1] shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#0f4c81] text-[28px]">settings</span>
              <h1 className="font-headline-lg text-[26px] font-bold text-[#1a1c1e]">
                Pengaturan & Konfigurasi Toko
              </h1>
            </div>
            <p className="font-body-md text-[14px] text-[#42474f]">
              Atur identitas bisnis, pajak penjualan, format cetak struk thermal, dan sistem POS.
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-headline-md text-[15px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Simpan Konfigurasi</span>
          </button>
        </div>

        {/* Success Alert Toast */}
        {saveSuccessMsg && (
          <div className="bg-[#10B981]/10 border border-[#10B981] text-[#065f46] p-4 rounded-xl flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#10B981] text-[24px]">check_circle</span>
              <span className="font-label-sm text-[14px] font-bold">{saveSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessMsg('')}
              className="text-[#065f46] font-bold hover:underline text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 1. Identitas Toko & Cabang */}
        <div className="bg-white rounded-2xl border border-[#c2c7d1] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#c2c7d1]">
            <span className="material-symbols-outlined text-[#0f4c81] text-[22px]">store</span>
            <h2 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
              Informasi Toko & Cabang
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Nama Toko / Outlet
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => handleFieldChange('storeName', e.target.value)}
                placeholder="Contoh: Grizo Store"
                className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 font-body-md text-[14px]"
              />
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Nama Cabang / Terminal ID
              </label>
              <input
                type="text"
                required
                value={formData.storeBranch}
                onChange={(e) => handleFieldChange('storeBranch', e.target.value)}
                placeholder="Contoh: Cabang Utama - Kasir 1"
                className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 font-body-md text-[14px]"
              />
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Alamat Toko Lengkap
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Contoh: Jl. Ahmad Yani No. 123, Jakarta"
                className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 font-body-md text-[14px]"
              />
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Nomor Telepon / WhatsApp Toko
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="Contoh: +62 812-3456-7890"
                className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 font-body-md text-[14px]"
              />
            </div>
          </div>
        </div>

        {/* 2. Keuangan, Pajak & Mata Uang */}
        <div className="bg-white rounded-2xl border border-[#c2c7d1] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#c2c7d1]">
            <span className="material-symbols-outlined text-[#0f4c81] text-[22px]">payments</span>
            <h2 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
              Keuangan, Pajak Penjualan & Mata Uang
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Persentase Pajak Penjualan (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={taxInput}
                  onChange={(e) => setTaxInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 font-label-data text-[16px] font-bold"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-[#727780]">
                  %
                </span>
              </div>
              <p className="font-body-md text-[12px] text-[#727780] mt-1">
                Pajak aktif saat ini: <span className="font-bold text-[#0f4c81]">{(formData.taxRate * 100).toFixed(1)}%</span>
              </p>
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Simbol Mata Uang
              </label>
              <select
                value={formData.currencySymbol}
                onChange={(e) => handleFieldChange('currencySymbol', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[14px] bg-white cursor-pointer"
              >
                <option value="Rp">Rp (IDR - Indonesian Rupiah)</option>
                <option value="$">$ (USD - US Dollar)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - British Pound)</option>
                <option value="RM">RM (MYR - Malaysian Ringgit)</option>
                <option value="S$">S$ (SGD - Singapore Dollar)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Pengaturan Shift & Jam Kerja Karyawan */}
        <div className="bg-white rounded-2xl border border-[#c2c7d1] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#c2c7d1]">
            <span className="material-symbols-outlined text-[#0f4c81] text-[22px]">schedule</span>
            <h2 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
              Pengaturan Shift & Jam Kerja Karyawan (Kasir)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Jam Masuk Shift Standar
              </label>
              <input
                type="time"
                value={formData.workShiftStart || '08:00'}
                onChange={(e) => handleFieldChange('workShiftStart', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-label-data text-[15px] font-bold bg-white"
              />
              <p className="font-body-md text-[12px] text-[#727780] mt-1">
                Waktu mulai shift kerja harian kasir
              </p>
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Jam Keluar Shift Standar
              </label>
              <input
                type="time"
                value={formData.workShiftEnd || '17:00'}
                onChange={(e) => handleFieldChange('workShiftEnd', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-label-data text-[15px] font-bold bg-white"
              />
              <p className="font-body-md text-[12px] text-[#727780] mt-1">
                Waktu selesai shift kerja harian kasir
              </p>
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Toleransi Keterlambatan (Menit)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.lateToleranceMinutes ?? 15}
                  onChange={(e) => handleFieldChange('lateToleranceMinutes', parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-label-data text-[15px] font-bold"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-[#727780] text-[12px]">
                  menit
                </span>
              </div>
              <p className="font-body-md text-[12px] text-[#727780] mt-1">
                Batas keterlambatan sebelum ditandai status Late
              </p>
            </div>
          </div>
        </div>

        {/* 4. Konfigurasi Struk Thermal */}
        <div className="bg-white rounded-2xl border border-[#c2c7d1] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#c2c7d1]">
            <span className="material-symbols-outlined text-[#0f4c81] text-[22px]">receipt_long</span>
            <h2 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
              Pengaturan Struk Cetak / Thermal Receipt
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                Pesan Footer Struk (Catatan Penutup)
              </label>
              <textarea
                rows={3}
                value={formData.receiptFooter}
                onChange={(e) => handleFieldChange('receiptFooter', e.target.value)}
                placeholder="Contoh: Terima kasih atas kunjungan Anda! Simpan struk ini untuk penukaran barang."
                className="w-full p-3 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 font-body-md text-[13px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1 font-bold">
                  Ukuran Kertas Thermal Printer
                </label>
                <select
                  value={formData.paperSize}
                  onChange={(e) => handleFieldChange('paperSize', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[14px] bg-white cursor-pointer"
                >
                  <option value="58mm">58mm (Thermal Mini Printer)</option>
                  <option value="80mm">80mm (Thermal Kasir Standar)</option>
                  <option value="A4">A4 (Printer Invoice / Dokumen)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="autoPrintReceipt"
                  checked={formData.autoPrintReceipt}
                  onChange={(e) => handleFieldChange('autoPrintReceipt', e.target.checked)}
                  className="w-5 h-5 accent-[#0f4c81] cursor-pointer"
                />
                <label htmlFor="autoPrintReceipt" className="font-label-sm text-[14px] font-bold text-[#1a1c1e] cursor-pointer">
                  Tampilkan Pop-up Struk Otomatis Saat Selesai Bayar
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Reset Data & Lisensi */}
        <div className="bg-white rounded-2xl border border-[#ffdad6] p-6 shadow-xs space-y-4 mt-8">
          <div className="flex items-center gap-2 text-[#EF4444]">
            <span className="material-symbols-outlined text-[22px]">warning</span>
            <h2 className="font-headline-md text-[18px] font-bold">
              Reset Database & Data Demo
            </h2>
          </div>
          <p className="font-body-md text-[13px] text-[#42474f]">
            Mengembalikan seluruh produk, transaksi, absensi, dan pengaturan ke keadaan awal demo.
          </p>
          <button
            type="button"
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mereset seluruh data ke setelan default?')) {
                onResetDemoData();
                alert('Data demo berhasil direset!');
              }
            }}
            className="px-4 py-2 border border-[#EF4444] text-[#EF4444] hover:bg-[#ffdad6]/20 rounded-xl font-label-sm text-[13px] font-bold cursor-pointer transition-all"
          >
            Reset Seluruh Data Demo
          </button>
        </div>
      </form>
    </div>
  );
};
