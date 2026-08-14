import React from 'react';
import { Employee } from '../types';

interface TopBarProps {
  currentCashier?: Employee;
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  unreadNotificationsCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  onOpenNotifications,
  onOpenSettings,
  onOpenHelp,
  unreadNotificationsCount = 2
}) => {
  return (
    <header className="flex justify-between items-center px-4 w-full h-16 z-30 bg-white border-b border-[#c2c7d1] shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden text-[#42474f] p-2 rounded-lg hover:bg-[#e8e8ea] transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <div className="hidden sm:flex items-baseline gap-2">
          <h1 className="text-[22px] font-headline-md font-bold text-[#00355f]">
            Grizo POS
          </h1>
          <span className="font-label-sm text-[11px] text-[#727780] font-semibold">
            powered by <span className="text-[#6366F1] font-bold">Grizolabs</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#eeeef0] px-3 py-1 rounded-full border border-[#c2c7d1]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="font-label-sm text-[12px] text-[#42474f]">Online</span>
        </div>
      </div>

      {/* Trailing Action Icons */}
      <div className="flex items-center gap-2">
        {/* Action Icon Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full hover:bg-[#e8e8ea] active:scale-95 transition-all flex items-center justify-center text-[#42474f] relative cursor-pointer"
            title="Notifikasi POS"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full hover:bg-[#e8e8ea] active:scale-95 transition-all flex items-center justify-center text-[#42474f] cursor-pointer"
            title="Pengaturan Toko"
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>

          <button
            onClick={onOpenHelp}
            className="w-10 h-10 rounded-full hover:bg-[#e8e8ea] active:scale-95 transition-all flex items-center justify-center text-[#42474f] cursor-pointer"
            title="Bantuan & Pintasan Keyboard"
          >
            <span className="material-symbols-outlined text-[22px]">help</span>
          </button>
        </div>
      </div>
    </header>
  );
};
