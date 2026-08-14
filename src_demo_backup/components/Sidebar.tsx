import React from 'react';
import { TabType, Employee } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNewSale: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
  currentCashier?: Employee;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onNewSale,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  currentCashier
}) => {
  const isRestrictedFromPOS = currentCashier?.role !== 'Cashier';

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'sales', label: 'Sales (POS)', icon: 'point_of_sale' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory_2' },
    { id: 'reports', label: 'Laporan Penjualan', icon: 'assessment' },
    { id: 'attendance', label: isRestrictedFromPOS ? 'Laporan Absensi Kasir' : 'Absensi Kasir', icon: 'badge' },
    { id: 'employees', label: 'Employees', icon: 'group' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  // Completely remove Sales POS menu for Admin and Store Manager
  const visibleNavItems = navItems.filter(item => !(item.id === 'sales' && isRestrictedFromPOS));

  const handleSelect = (id: TabType) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNewSaleClick = () => {
    if (isRestrictedFromPOS) {
      alert(`🔒 Akses Dibatasi:\n\nAkun ${currentCashier?.role || 'Pengguna ini'} tidak memiliki wewenang membuat atau menambah transaksi penjualan baru.\n\nTransaksi hanya dapat diproses oleh akun KASIR. Silakan ganti ke akun Kasir.`);
      return;
    }
    onNewSale();
    handleSelect('sales');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Docked Sidebar Navigation */}
      <nav
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-[#f9f9fc] border-r border-[#c2c7d1] flex flex-col py-4 gap-2 shrink-0 z-50 transition-transform duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="px-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e8e8ea] shrink-0 border border-[#c2c7d1] flex items-center justify-center">
            <img
              alt="Store Logo"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm2K2PjPoWjkEvLjKrQ9kunT-BFI_6mvaM45u_j2-j8n3xXohbObuLvALSg4YA1YeCD9Z_Fjh5ATvvml1DBtY6iCVZtkFFOLNz8TXdxcR30_dorr32tp5kekG2XTLqpeKyPAJJL5EFdJEeFVgyvU4ct2quyQhgqXEWR-KiMuf-3hvjBVbHAR61GqSt1SGNCgO1gCRdqcmsAA4vjPk-8v1kwW57mFe5qr_-RTrRrxl1ifpiZUSMKd0p"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-headline-md text-[18px] leading-tight font-bold text-[#00355f] truncate">
              {currentCashier ? currentCashier.name : 'Main Branch'}
            </h2>
            <p className="font-label-sm text-[12px] text-[#42474f] truncate flex items-center gap-1 font-semibold">
              <span className={`w-2 h-2 rounded-full ${isRestrictedFromPOS ? 'bg-[#EF4444]' : 'bg-[#10B981]'}`} />
              <span>{currentCashier ? `Role: ${currentCashier.role}` : 'Admin Terminal'}</span>
            </p>
          </div>
        </div>

        {/* New Sale Action Button - Only for Cashiers */}
        {!isRestrictedFromPOS && (
          <div className="px-4 mb-3">
            <button
              onClick={handleNewSaleClick}
              className="w-full touch-target rounded-xl font-label-sm text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm font-semibold py-2.5 cursor-pointer bg-[#6366F1] text-white hover:bg-[#5254e0]"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                add
              </span>
              <span>New Sale</span>
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2">
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all active:scale-[0.98] text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#0f4c81] text-white font-bold shadow-xs'
                    : 'text-[#42474f] hover:bg-[#e8e8ea] hover:text-[#1a1c1e]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
                  }}
                >
                  {item.icon}
                </span>
                <span className="font-label-sm text-[14px]">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Logout & Branding */}
        <div className="mt-auto px-2 border-t border-[#c2c7d1] pt-3 space-y-2">
          <button
            onClick={() => {
              if (onLogout) {
                onLogout();
              } else {
                alert('Logged out safely. Select cashiers or sign in again.');
              }
            }}
            className="w-full flex items-center gap-3 text-[#EF4444] hover:bg-[#ffdad6]/40 rounded-xl px-4 py-2 transition-all active:scale-[0.98] text-left font-label-sm text-[14px] font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span>Logout</span>
          </button>
          
          <div className="px-3 py-2 text-center border-t border-[#c2c7d1]/50">
            <p className="font-label-sm text-[11px] text-[#727780] font-semibold">
              Powered by <span className="text-[#6366F1] font-bold">Grizolabs</span>
            </p>
          </div>
        </div>
      </nav>
    </>
  );
};
