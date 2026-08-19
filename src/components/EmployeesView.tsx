import React, { useState } from 'react';
import { Employee } from '../types';
import { formatCurrency } from '../utils/format';

interface EmployeesViewProps {
  employees: Employee[];
  currentCashier: Employee;
  currencySymbol?: string;
  onAddEmployee: (emp: Omit<Employee, 'id' | 'totalSalesToday' | 'txnsToday' | 'status'>) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (empId: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  currentCashier,
  currencySymbol = 'Rp',
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQRModalEmp, setSelectedQRModalEmp] = useState<Employee | null>(null);

  // Form Registration State
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Cashier' | 'Admin' | 'Store Manager'>('Cashier');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Handle Photo Upload & Canvas WebP Compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxDim = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const webpData = canvas.toDataURL('image/webp', 0.8);
        setAvatarUrl(webpData);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const cleanCashierKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const generatedId = `emp-${Date.now()}`;
    const generatedQR = `GRIZO-EMP-${generatedId}-${cleanCashierKey}`;

    onAddEmployee({
      name,
      role,
      email: email || `${cleanCashierKey}@grizo.com`,
      phone: phone || '+62 812-0000-0000',
      pin: pin || '1234',
      cashierKey: cleanCashierKey,
      avatarUrl: avatarUrl || undefined,
      qrCode: generatedQR
    });

    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setPin('');
    setAvatarUrl('');
    setRole('Cashier');
  };

  const handlePrintPDFCard = (emp: Employee) => {
    const qrText = emp.qrCode || `GRIZO-EMP-${emp.id}-${emp.cashierKey}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
    const avatarHtml = emp.avatarUrl
      ? `<img src="${emp.avatarUrl}" class="avatar-img" />`
      : `<div class="avatar-placeholder">${emp.name.charAt(0)}</div>`;

    const printWindow = window.open('', '_blank', 'width=800,height=700');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Mohon izinkan popup browser.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>KARTU_KARYAWAN_${emp.name.replace(/\s+/g, '_')}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background-color: #f3f4f6;
              margin: 0;
              padding: 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .card-container {
              width: 85.6mm;
              height: 125mm;
              background: linear-gradient(135deg, #0f4c81 0%, #002244 100%);
              border-radius: 16px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.25);
              color: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
              box-sizing: border-box;
              position: relative;
              overflow: hidden;
            }
            .card-header {
              text-align: center;
              margin-bottom: 12px;
            }
            .card-header h1 {
              font-size: 22px;
              font-weight: 800;
              margin: 0;
              letter-spacing: 2px;
              color: #ffffff;
            }
            .card-header p {
              font-size: 9px;
              color: #93c5fd;
              margin: 2px 0 0 0;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .avatar-box {
              width: 90px;
              height: 90px;
              border-radius: 50%;
              border: 3px solid #60a5fa;
              overflow: hidden;
              margin-bottom: 10px;
              background-color: rgba(255,255,255,0.1);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }
            .avatar-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .avatar-placeholder {
              font-size: 36px;
              font-weight: bold;
              color: #ffffff;
            }
            .emp-name {
              font-size: 16px;
              font-weight: 700;
              margin: 0;
              text-align: center;
              color: #ffffff;
            }
            .emp-role {
              font-size: 10px;
              font-weight: 700;
              background-color: rgba(255,255,255,0.2);
              color: #e0f2fe;
              padding: 3px 12px;
              border-radius: 20px;
              margin: 4px 0 10px 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .qr-box {
              background: white;
              padding: 8px;
              border-radius: 12px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.15);
              margin-bottom: 8px;
            }
            .qr-box img {
              width: 100px;
              height: 100px;
              display: block;
            }
            .emp-details {
              font-size: 8.5px;
              color: #dbeafe;
              text-align: center;
              line-height: 1.3;
            }
            .emp-id-code {
              font-family: monospace;
              font-size: 8px;
              color: #93c5fd;
              margin-top: 4px;
            }
            .print-btn {
              margin-top: 20px;
              padding: 10px 24px;
              background-color: #0f4c81;
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 14px;
              cursor: pointer;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            @media print {
              body {
                background: none;
                padding: 0;
              }
              .print-btn {
                display: none;
              }
              .card-container {
                box-shadow: none;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="card-container">
            <div class="card-header">
              <h1>GRIZO</h1>
              <p>OFFICIAL STAFF ID CARD</p>
            </div>
            <div class="avatar-box">
              ${avatarHtml}
            </div>
            <h2 class="emp-name">${emp.name}</h2>
            <div class="emp-role">${emp.role}</div>
            <div class="qr-box">
              <img src="${qrApiUrl}" alt="QR Code" />
            </div>
            <div class="emp-details">
              <div>${emp.email}</div>
              <div>${emp.phone}</div>
              <div class="emp-id-code">ID: ${emp.id}</div>
            </div>
          </div>
          <button class="print-btn" onclick="window.print()">Simpan / Cetak Kartu PDF</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f9f9fc]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-[30px] font-bold text-[#1a1c1e]">
              Manajemen Karyawan & Hak Akses
            </h1>
            <p className="font-body-md text-[15px] text-[#42474f]">
              Kelola profil staff, foto, QR Code akses, PIN terminal, dan cetak Kartu ID Karyawan PDF
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0f4c81] hover:bg-[#00355f] text-white px-4 py-2.5 rounded-xl font-label-sm text-[14px] font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Registrasi Karyawan Baru</span>
          </button>
        </div>

        {/* Staff Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {employees.map((emp) => {
            const isActiveUser = currentCashier.id === emp.id;

            return (
              <div
                key={emp.id}
                className={`bg-white rounded-2xl p-5 border shadow-2xs flex flex-col justify-between transition-all ${
                  isActiveUser ? 'border-[#0f4c81] ring-2 ring-[#0f4c81]/20' : 'border-[#c2c7d1]'
                }`}
              >
                <div>
                  {/* Top Avatar & Status Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {emp.avatarUrl ? (
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-[#c2c7d1] shadow-2xs"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#0f4c81]/10 text-[#0f4c81] font-headline-lg text-[22px] font-bold flex items-center justify-center border border-[#0f4c81]/20">
                          {emp.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-label-sm text-[16px] font-bold text-[#1a1c1e]">
                          {emp.name}
                        </h3>
                        <span className="font-label-data text-[11px] text-[#0f4c81] font-bold bg-[#F0F7FF] px-2 py-0.5 rounded-md border border-[#0f4c81]/30">
                          {emp.role}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-label-data ${
                        emp.status === 'Active'
                          ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30'
                          : emp.status === 'On Break'
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                          : 'bg-[#727780]/10 text-[#727780] border border-[#727780]/30'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  {/* Profile Details List */}
                  <div className="space-y-2 text-[13px] font-body-md text-[#42474f] py-3 border-t border-b border-[#c2c7d1]/80">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#727780]">mail</span>
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#727780]">call</span>
                      <span>{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#727780]">password</span>
                      <span>PIN Akses Terminal: <strong className="text-[#1a1c1e]">****</strong> ({emp.pin || '1234'})</span>
                    </div>
                  </div>

                  {/* Sales Summary */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-[#f3f3f6] rounded-xl border border-[#c2c7d1]/60">
                    <div>
                      <p className="font-label-sm text-[10px] text-[#727780] uppercase">Txns Hari Ini</p>
                      <p className="font-label-data text-[15px] font-bold text-[#1a1c1e]">
                        {emp.txnsToday} Transaksi
                      </p>
                    </div>
                    <div>
                      <p className="font-label-sm text-[10px] text-[#727780] uppercase">Omset Hari Ini</p>
                      <p className="font-label-data text-[14px] font-bold text-[#10B981]">
                        {formatCurrency(emp.totalSalesToday, currencySymbol)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Card, PDF Print & QR Code Trigger */}
                <div className="pt-3 mt-3 border-t border-[#c2c7d1] flex items-center gap-2">
                  <button
                    onClick={() => setSelectedQRModalEmp(emp)}
                    className="p-2 bg-[#f3f3f6] hover:bg-[#e4e4e7] border border-[#c2c7d1] text-[#0f4c81] rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                    title="Lihat QR Code Karyawan"
                  >
                    <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                  </button>

                  <button
                    onClick={() => handlePrintPDFCard(emp)}
                    className="px-3 py-2 bg-[#F0F7FF] hover:bg-[#e0f0ff] border border-[#0f4c81]/40 text-[#0f4c81] font-label-sm text-[12px] font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    title="Cetak Kartu Karyawan PDF"
                  >
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    <span>Cetak PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus data karyawan "${emp.name}"?`)) {
                        onDeleteEmployee(emp.id);
                      }
                    }}
                    className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 ml-auto"
                    title="Hapus Karyawan"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registrasi Karyawan Baru Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#c2c7d1] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#c2c7d1]">
              <div>
                <h3 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
                  Registrasi Karyawan Baru
                </h3>
                <p className="font-body-md text-[12px] text-[#727780]">
                  Lengkapi identitas, foto profil, dan kredensial akses terminal POS
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#727780] hover:text-[#1a1c1e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Photo Avatar Picker */}
            <div className="flex items-center gap-4 p-3 bg-[#f9f9fc] rounded-xl border border-[#c2c7d1]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-2xl object-cover border border-[#0f4c81]"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#0f4c81]/10 text-[#0f4c81] flex items-center justify-center border border-dashed border-[#0f4c81]">
                  <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
                </div>
              )}
              <div className="flex-1">
                <label className="font-label-sm text-[12px] text-[#42474f] font-bold block mb-1">
                  Foto Profil Karyawan (WebP Compressed)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="font-body-md text-[12px] text-[#727780] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#0f4c81] file:text-white hover:file:bg-[#00355f] cursor-pointer"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[14px]"
                />
              </div>

              <div>
                <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                  Peran / Tanggung Jawab *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[14px] bg-white"
                >
                  <option value="Cashier">Kasir (POS Only)</option>
                  <option value="Store Manager">Store Manager (Manajemen & Laporan)</option>
                  <option value="Admin">Admin (Full System Access)</option>
                </select>
              </div>

              <div>
                <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                  Email Kontak *
                </label>
                <input
                  type="email"
                  required
                  placeholder="david@grizo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[14px]"
                />
              </div>

              <div>
                <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                  No. Telepon / WA *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+62 812-3456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[14px]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                  PIN Akses Terminal (4 Digit) *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="e.g. 5555"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[14px] tracking-widest font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-[#F0F7FF] rounded-xl border border-[#0f4c81]/20 text-[12px] text-[#0f4c81]">
              💡 <strong>Info Otomatisasi:</strong> Karyawan baru role Kasir akan berstatus <em>Offline</em> (wajib Check-In shift), sedangkan Admin/Store Manager langsung berstatus <em>Active</em>.
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#c2c7d1]">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2.5 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px] hover:bg-[#eeeef0] transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-label-sm text-[13px] font-bold transition-all cursor-pointer"
              >
                Simpan & Daftarkan Karyawan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Card Detail QR Code & Cetak PDF Karyawan */}
      {selectedQRModalEmp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#c2c7d1] shadow-xl text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#c2c7d1]">
              <h3 className="font-headline-md text-[16px] font-bold text-[#1a1c1e]">
                Kartu QR Code Karyawan
              </h3>
              <button
                type="button"
                onClick={() => setSelectedQRModalEmp(null)}
                className="text-[#727780] hover:text-[#1a1c1e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-[#f9f9fc] rounded-2xl border border-[#c2c7d1] flex flex-col items-center">
              {selectedQRModalEmp.avatarUrl ? (
                <img
                  src={selectedQRModalEmp.avatarUrl}
                  alt={selectedQRModalEmp.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#0f4c81] mb-2"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#0f4c81]/10 text-[#0f4c81] font-bold text-[22px] flex items-center justify-center mb-2">
                  {selectedQRModalEmp.name.charAt(0)}
                </div>
              )}

              <h4 className="font-label-sm text-[16px] font-bold text-[#1a1c1e]">
                {selectedQRModalEmp.name}
              </h4>
              <p className="font-label-data text-[12px] text-[#0f4c81] font-bold mb-3">
                {selectedQRModalEmp.role}
              </p>

              {/* Generated QR Code Image */}
              <div className="bg-white p-3 rounded-xl border border-[#c2c7d1] shadow-2xs">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    selectedQRModalEmp.qrCode || `GRIZO-EMP-${selectedQRModalEmp.id}-${selectedQRModalEmp.cashierKey}`
                  )}`}
                  alt="Employee QR Code"
                  className="w-40 h-40 object-contain"
                />
              </div>

              <p className="font-mono text-[10px] text-[#727780] mt-3">
                {selectedQRModalEmp.qrCode || `GRIZO-EMP-${selectedQRModalEmp.id}-${selectedQRModalEmp.cashierKey}`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePrintPDFCard(selectedQRModalEmp)}
                className="flex-1 py-2.5 bg-[#F0F7FF] border border-[#0f4c81]/30 text-[#0f4c81] font-label-sm text-[13px] font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                <span>Cetak PDF</span>
              </button>
              <button
                onClick={() => setSelectedQRModalEmp(null)}
                className="flex-1 py-2.5 bg-[#0f4c81] text-white font-label-sm text-[13px] font-bold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
