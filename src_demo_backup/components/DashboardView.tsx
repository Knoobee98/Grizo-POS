import React from 'react';
import { Product, Transaction, TabType, Employee } from '../types';
import { formatCurrency } from '../utils/format';

interface DashboardViewProps {
  products: Product[];
  transactions: Transaction[];
  onNavigate: (tab: TabType) => void;
  currentCashier?: Employee;
  currencySymbol?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  transactions,
  onNavigate,
  currentCashier,
  currencySymbol = 'Rp'
}) => {
  const isCashier = currentCashier ? currentCashier.role === 'Cashier' : true;

  const totalRevenue = transactions.reduce(
    (acc, tx) => (tx.status === 'COMPLETED' ? acc + tx.total : acc),
    0
  );
  const totalTxns = transactions.filter((tx) => tx.status === 'COMPLETED').length;
  const lowStockItems = products.filter((p) => p.stock <= (p.lowStockThreshold || 10));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f9f9fc]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Dashboard Title & Welcome */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-[30px] font-bold text-[#1a1c1e]">
              Terminal Dashboard
            </h1>
            <p className="font-body-md text-[15px] text-[#42474f]">
              Real-time overview of Main Branch terminal activity
            </p>
          </div>

          {isCashier && (
            <button
              onClick={() => onNavigate('sales')}
              className="bg-[#6366F1] hover:bg-[#5254e0] text-white px-5 py-2.5 rounded-xl font-label-sm text-[14px] font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Start New Sale</span>
            </button>
          )}
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#c2c7d1] shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0f4c81]/10 text-[#0f4c81] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">payments</span>
            </div>
            <div>
              <p className="font-label-sm text-[12px] text-[#727780] uppercase">Today's Revenue</p>
              <p className="font-headline-lg text-[22px] font-extrabold text-[#1a1c1e]">
                {formatCurrency(totalRevenue, currencySymbol)}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#c2c7d1] shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">shopping_bag</span>
            </div>
            <div>
              <p className="font-label-sm text-[12px] text-[#727780] uppercase">Completed Txns</p>
              <p className="font-headline-lg text-[24px] font-extrabold text-[#1a1c1e]">
                {totalTxns}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#c2c7d1] shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div>
              <p className="font-label-sm text-[12px] text-[#727780] uppercase">Low Stock Items</p>
              <p className="font-headline-lg text-[24px] font-extrabold text-[#1a1c1e]">
                {lowStockItems.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#c2c7d1] shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">group</span>
            </div>
            <div>
              <p className="font-label-sm text-[12px] text-[#727780] uppercase">Active Cashiers</p>
              <p className="font-headline-lg text-[24px] font-extrabold text-[#1a1c1e]">
                3 Active
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Navigation Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#c2c7d1] shadow-xs">
              <h2 className="font-headline-md text-[18px] font-bold text-[#1a1c1e] mb-4">
                Quick Shortcuts
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {isCashier && (
                  <button
                    onClick={() => onNavigate('sales')}
                    className="p-4 rounded-xl border border-[#c2c7d1] bg-[#f9f9fc] hover:bg-[#F0F7FF] hover:border-[#0f4c81] transition-all text-left flex flex-col gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[28px] text-[#0f4c81]">
                      point_of_sale
                    </span>
                    <div>
                      <p className="font-label-sm text-[14px] font-bold text-[#1a1c1e]">
                        Cashier Register
                      </p>
                      <p className="font-body-md text-[12px] text-[#727780]">
                        Process customer orders
                      </p>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => onNavigate('reports')}
                  className="p-4 rounded-xl border border-[#c2c7d1] bg-[#f9f9fc] hover:bg-[#F5F3FF] hover:border-[#6366F1] transition-all text-left flex flex-col gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[28px] text-[#6366F1]">
                    assessment
                  </span>
                  <div>
                    <p className="font-label-sm text-[14px] font-bold text-[#1a1c1e]">
                      Sales Reports
                    </p>
                    <p className="font-body-md text-[12px] text-[#727780]">
                      Analytics & transactions
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('inventory')}
                  className="p-4 rounded-xl border border-[#c2c7d1] bg-[#f9f9fc] hover:bg-[#F0F7FF] hover:border-[#0f4c81] transition-all text-left flex flex-col gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[28px] text-[#10B981]">
                    inventory_2
                  </span>
                  <div>
                    <p className="font-label-sm text-[14px] font-bold text-[#1a1c1e]">
                      Inventory Catalog
                    </p>
                    <p className="font-body-md text-[12px] text-[#727780]">
                      Stock levels & products
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white p-5 rounded-xl border border-[#c2c7d1] shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
                  Low Stock Warnings
                </h2>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="text-[#6366F1] font-label-sm text-[12px] font-bold hover:underline cursor-pointer"
                >
                  Manage Stock
                </button>
              </div>

              <div className="space-y-2">
                {lowStockItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border border-[#ffdad6] bg-[#ffdad6]/10 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="font-label-sm text-[14px] font-bold text-[#1a1c1e]">
                        {item.name}
                      </p>
                      <p className="font-label-data text-[12px] text-[#727780]">SKU: {item.sku}</p>
                    </div>
                    <span className="font-label-data text-[12px] font-extrabold bg-[#EF4444] text-white px-2.5 py-1 rounded-full">
                      {item.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Side Feed */}
          <div className="bg-white p-5 rounded-xl border border-[#c2c7d1] shadow-xs flex flex-col">
            <h2 className="font-headline-md text-[18px] font-bold text-[#1a1c1e] mb-3">
              Live Terminal Feed
            </h2>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
              {transactions.slice(0, 6).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 border border-[#c2c7d1] rounded-xl flex justify-between items-center hover:bg-[#f9f9fc]"
                >
                  <div>
                    <p className="font-label-data text-[13px] font-bold text-[#6366F1]">
                      {tx.ticketNo}
                    </p>
                    <p className="font-label-sm text-[12px] text-[#727780]">
                      {tx.cashierName} • {tx.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-data text-[14px] font-bold text-[#1a1c1e]">
                      {formatCurrency(tx.total, currencySymbol)}
                    </p>
                    <p className="font-label-data text-[10px] text-[#10B981] font-bold">
                      {tx.paymentMethod}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
