import React, { useState } from 'react';
import { Product, TabType } from '../types';

export interface NotificationItem {
  id: string;
  type: 'stock' | 'sale' | 'attendance' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionTab?: TabType;
  actionLabel?: string;
}

interface NotificationsModalProps {
  products: Product[];
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (tab: TabType) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  products,
  notifications,
  onClose,
  onMarkAllAsRead,
  onMarkAsRead,
  onClearAll,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'stock' | 'attendance' | 'system'>('all');

  // Low stock products count
  const lowStockProducts = products.filter((p) => p.stock < 10);

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'stock':
        return { icon: 'warning', color: 'text-[#EF4444] bg-[#ffdad6]' };
      case 'sale':
        return { icon: 'payments', color: 'text-[#10B981] bg-[#d1fae5]' };
      case 'attendance':
        return { icon: 'badge', color: 'text-[#0F4C81] bg-[#E0F0FF]' };
      case 'system':
      default:
        return { icon: 'info', color: 'text-[#6366F1] bg-[#F5F3FF]' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#c2c7d1]">
        {/* Header */}
        <div className="p-4 border-b border-[#c2c7d1] flex items-center justify-between bg-[#f9f9fc]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </div>
            <div>
              <h3 className="font-headline-md text-[17px] font-bold text-[#1a1c1e]">
                Notifikasi POS
              </h3>
              <p className="font-label-data text-[12px] text-[#727780]">
                {unreadCount > 0 ? `${unreadCount} pemberitahuan belum dibaca` : 'Semua pemberitahuan dibaca'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#e8e8ea] text-[#727780] hover:text-[#1a1c1e] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Low Stock Highlight Summary */}
        {lowStockProducts.length > 0 && (
          <div className="bg-[#fff8f6] p-3 px-4 border-b border-[#ffdad6] flex items-center justify-between text-xs text-[#900000]">
            <div className="flex items-center gap-2 font-medium">
              <span className="material-symbols-outlined text-[18px] text-[#EF4444]">inventory_2</span>
              <span><strong>{lowStockProducts.length} produk</strong> stok kurang dari 10 unit</span>
            </div>
            <button
              onClick={() => {
                onNavigate('inventory');
                onClose();
              }}
              className="px-2.5 py-1 bg-[#EF4444] text-white rounded-lg font-bold text-[11px] hover:bg-[#dc2626] transition-colors cursor-pointer"
            >
              Cek Stok
            </button>
          </div>
        )}

        {/* Action Controls & Filters */}
        <div className="p-3 border-b border-[#c2c7d1] flex items-center justify-between gap-2 bg-white text-xs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-[#0F4C81] text-white'
                  : 'bg-[#f3f3f6] text-[#42474f] hover:bg-[#e8e8ea]'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('stock')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === 'stock'
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-[#f3f3f6] text-[#42474f] hover:bg-[#e8e8ea]'
              }`}
            >
              Stok Kritis
            </button>
            <button
              onClick={() => setFilter('attendance')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === 'attendance'
                  ? 'bg-[#0F4C81] text-white'
                  : 'bg-[#f3f3f6] text-[#42474f] hover:bg-[#e8e8ea]'
              }`}
            >
              Absensi
            </button>
            <button
              onClick={() => setFilter('system')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === 'system'
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-[#f3f3f6] text-[#42474f] hover:bg-[#e8e8ea]'
              }`}
            >
              Sistem
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[#0F4C81] font-bold text-[11px] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Tandai Dibaca
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#727780]">
              <span className="material-symbols-outlined text-[48px] text-[#c2c7d1] mb-2">
                notifications_off
              </span>
              <p className="font-bold text-[14px] text-[#1a1c1e]">Tidak ada pemberitahuan</p>
              <p className="text-[12px] mt-1">Belum ada notifikasi baru dalam kategori ini.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const { icon, color } = getIconForType(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => onMarkAsRead(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex gap-3 ${
                    item.isRead
                      ? 'bg-white border-[#c2c7d1]/60 opacity-80'
                      : 'bg-[#f0f7ff] border-[#0F4C81]/30 shadow-xs'
                  }`}
                >
                  {!item.isRead && (
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-[#0F4C81]" />
                  )}

                  <div
                    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold ${color}`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{icon}</span>
                  </div>

                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-label-sm text-[13.5px] font-bold text-[#1a1c1e] truncate">
                        {item.title}
                      </h4>
                    </div>
                    <p className="font-body-md text-[12px] text-[#42474f] mt-1 leading-snug">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="font-label-data text-[11px] text-[#727780]">
                        {item.time}
                      </span>

                      {item.actionTab && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(item.actionTab!);
                            onClose();
                          }}
                          className="font-label-sm text-[11.5px] text-[#0F4C81] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{item.actionLabel || 'Buka Tab'}</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-[#c2c7d1] bg-[#f9f9fc] flex gap-2">
          <button
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="flex-1 py-2 border border-[#c2c7d1] rounded-xl text-[12.5px] font-bold text-[#EF4444] hover:bg-[#ffdad6]/20 transition-colors disabled:opacity-40 cursor-pointer"
          >
            Bersihkan Notifikasi
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-[#0F4C81] text-white rounded-xl text-[12.5px] font-bold hover:bg-[#00355f] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
