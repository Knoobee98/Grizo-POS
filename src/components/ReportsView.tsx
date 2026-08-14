import React, { useState } from 'react';
import { Transaction, CashierStat, Employee } from '../types';
import { formatCurrency } from '../utils/format';

interface ReportsViewProps {
  currentCashier: Employee;
  transactions: Transaction[];
  cashierStats: CashierStat[];
  currencySymbol?: string;
  onSelectTransaction: (tx: Transaction) => void;
  onExportReport: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentCashier,
  transactions,
  cashierStats,
  currencySymbol = 'Rp',
  onSelectTransaction,
  onExportReport
}) => {
  const [dateRange, setDateRange] = useState<'All Time' | 'Today' | 'Yesterday' | 'Last 7 Days' | 'This Month'>('All Time');
  const [reportType, setReportType] = useState<'Store Total' | 'By Cashier'>('Store Total');
  const [selectedCashierFilter, setSelectedCashierFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ time: string; amount: number; txns: number } | null>(null);

  const isManagement = currentCashier.role === 'Admin' || currentCashier.role === 'Store Manager';

  // Date Filtering Helper
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayStr = yesterdayObj.toISOString().split('T')[0];

  const sevenDaysAgoObj = new Date();
  sevenDaysAgoObj.setDate(sevenDaysAgoObj.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgoObj.toISOString().split('T')[0];

  const currentMonthPrefix = todayStr.substring(0, 7); // "YYYY-MM"

  // Data Isolation & Date Filter
  const cashierIsolatedTransactions = transactions.filter((tx) => {
    // 1. Role Filter
    if (!isManagement) {
      if (tx.cashierId !== currentCashier.cashierKey) return false;
    } else if (selectedCashierFilter !== 'all') {
      if (tx.cashierId !== selectedCashierFilter) return false;
    }

    // 2. Date Range Filter
    if (dateRange === 'Today') {
      return tx.date === todayStr;
    } else if (dateRange === 'Yesterday') {
      return tx.date === yesterdayStr;
    } else if (dateRange === 'Last 7 Days') {
      return tx.date >= sevenDaysAgoStr;
    } else if (dateRange === 'This Month') {
      return tx.date.startsWith(currentMonthPrefix);
    }
    return true; // 'All Time'
  });

  const filteredTransactions = cashierIsolatedTransactions.filter(
    (tx) =>
      tx.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.cashierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate dynamic totals for the view
  const grossRevenue = cashierIsolatedTransactions
    .filter((tx) => tx.status === 'COMPLETED')
    .reduce((acc, tx) => acc + tx.total, 0);

  const totalTxnCount = cashierIsolatedTransactions.filter((tx) => tx.status === 'COMPLETED').length;
  const avgOrderValue = totalTxnCount > 0 ? grossRevenue / totalTxnCount : 0;
  const totalRefunds = cashierIsolatedTransactions
    .filter((tx) => tx.status === 'REFUNDED')
    .reduce((acc, tx) => acc + Math.abs(tx.total), 0);

  // Hourly data calculation from actual transactions or fallback
  const hourlyData = [
    { time: '08:00', amount: grossRevenue * 0.1, txns: Math.round(totalTxnCount * 0.1) },
    { time: '10:00', amount: grossRevenue * 0.2, txns: Math.round(totalTxnCount * 0.2) },
    { time: '12:00', amount: grossRevenue * 0.35, txns: Math.round(totalTxnCount * 0.35) },
    { time: '14:00', amount: grossRevenue * 0.25, txns: Math.round(totalTxnCount * 0.25) },
    { time: '16:00', amount: grossRevenue * 0.1, txns: Math.round(totalTxnCount * 0.1) }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F5F3FF]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Isolation Alert Banner for Cashiers */}
        {!isManagement && (
          <div className="bg-[#0f4c81] text-white p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[28px] text-[#76f4e0]">
                lock
              </span>
              <div>
                <h3 className="font-headline-md text-[16px] font-bold">
                  Laporan Transaksi Kasir Terisolasi ({currentCashier.name})
                </h3>
                <p className="font-body-md text-[13px] text-[#8ebdf9]">
                  Sesuai ketentuan keamanan, halaman ini khusus menampilkan performa dan riwayat penjualan personal milik Anda.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#76f4e0]/20 text-[#76f4e0] border border-[#76f4e0]/40 shrink-0">
              Kasir Key: {currentCashier.cashierKey}
            </span>
          </div>
        )}

        {/* Page Header & Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-[32px] font-bold text-[#1a1c1e]">
              {isManagement ? 'Laporan Penjualan Toko' : 'Laporan Penjualan Saya'}
            </h1>
            <p className="font-body-md text-[15px] text-[#42474f]">
              {isManagement
                ? 'Ringkasan performa gabungan toko dan statistik per kasir'
                : `Statistik penjualan personal sesi ${currentCashier.name}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto bg-white p-2 rounded-xl border border-[#c2c7d1] shadow-xs">
            {isManagement && (
              <select
                value={selectedCashierFilter}
                onChange={(e) => setSelectedCashierFilter(e.target.value)}
                className="bg-[#eeeef0] text-[#1a1c1e] font-label-sm text-[13px] font-semibold px-3 py-2 rounded-lg outline-none cursor-pointer border border-[#c2c7d1]"
              >
                <option value="all">Semua Kasir (Store Total)</option>
                <option value="kasir1">Kasir 1 (Alice S.)</option>
                <option value="kasir2">Kasir 2 (Bob J.)</option>
              </select>
            )}

            {/* Date Selector */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="appearance-none bg-[#eeeef0] text-[#1a1c1e] font-label-sm text-[13px] font-semibold pl-8 pr-8 py-2 rounded-lg outline-none cursor-pointer border border-[#c2c7d1]"
              >
                <option value="All Time">Semua Riwayat</option>
                <option value="Today">Hari Ini</option>
                <option value="Yesterday">Kemarin</option>
                <option value="Last 7 Days">7 Hari Terakhir</option>
                <option value="This Month">Bulan Ini</option>
              </select>
              <span className="material-symbols-outlined text-[18px] text-[#42474f] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                calendar_today
              </span>
            </div>

            {/* Export Action */}
            <button
              onClick={onExportReport}
              className="ml-auto lg:ml-2 p-2 text-[#6366F1] hover:bg-[#eeeef0] rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-label-sm text-[13px] font-bold"
              title="Export CSV Report"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* KPI Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-white rounded-xl p-5 border border-[#c2c7d1] shadow-xs flex flex-col relative overflow-hidden group hover:border-[#6366F1]/40 transition-colors">
            <span className="font-label-sm text-[13px] text-[#42474f]">Pendapatan Kotor</span>
            <div className="font-display-price text-[26px] xl:text-[32px] font-extrabold text-[#1a1c1e] my-2">
              {formatCurrency(grossRevenue, currencySymbol)}
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-[#10B981] font-label-sm text-[12px] font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+14.2%</span>
              <span className="text-[#727780] font-normal ml-1">vs kemarin</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-xl p-5 border border-[#c2c7d1] shadow-xs flex flex-col relative overflow-hidden group hover:border-[#6366F1]/40 transition-colors">
            <span className="font-label-sm text-[13px] text-[#42474f]">Total Transaksi</span>
            <div className="font-display-price text-[32px] xl:text-[38px] font-extrabold text-[#1a1c1e] my-2">
              {totalTxnCount} Nota
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-[#10B981] font-label-sm text-[12px] font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+5.1%</span>
              <span className="text-[#727780] font-normal ml-1">vs kemarin</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-xl p-5 border border-[#c2c7d1] shadow-xs flex flex-col relative overflow-hidden group hover:border-[#6366F1]/40 transition-colors">
            <span className="font-label-sm text-[13px] text-[#42474f]">Rata-rata Transaksi</span>
            <div className="font-display-price text-[26px] xl:text-[32px] font-extrabold text-[#1a1c1e] my-2">
              {formatCurrency(avgOrderValue, currencySymbol)}
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-[#F59E0B] font-label-sm text-[12px] font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_flat</span>
              <span>Stabil</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-xl p-5 border border-[#c2c7d1] shadow-xs flex flex-col relative overflow-hidden group hover:border-[#6366F1]/40 transition-colors">
            <span className="font-label-sm text-[13px] text-[#42474f]">Total Refund</span>
            <div className="font-display-price text-[26px] xl:text-[32px] font-extrabold text-[#EF4444] my-2">
              {formatCurrency(totalRefunds, currencySymbol)}
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-[#10B981] font-label-sm text-[12px] font-bold">
              <span>0.8% dari total sales</span>
            </div>
          </div>
        </div>

        {/* Main Data Area (Chart + Cashier Leaderboard) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Over Time Interactive Visualizer */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-[#c2c7d1] shadow-xs p-5 flex flex-col min-h-[380px]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-headline-md text-[20px] font-bold text-[#1a1c1e]">
                  Kecepatan Penjualan Jam
                </h3>
                <p className="font-body-md text-[13px] text-[#727780]">
                  Grafik distribusi transaksi sepanjang hari
                </p>
              </div>
            </div>

            {/* Interactive SVG Chart Container */}
            <div className="flex-1 bg-[#f3f3f6] rounded-xl border border-[#c2c7d1]/60 p-4 flex flex-col justify-between relative overflow-hidden">
              {hoveredDataPoint && (
                <div className="absolute top-4 right-4 bg-[#1a1c1e] text-white p-2.5 rounded-lg text-[12px] font-label-data shadow-md z-20">
                  <p className="font-bold text-[#76f4e0]">{hoveredDataPoint.time}</p>
                  <p>Revenue: {formatCurrency(hoveredDataPoint.amount, currencySymbol)}</p>
                  <p>Transactions: {hoveredDataPoint.txns}</p>
                </div>
              )}

              <div className="relative flex-1 flex items-end justify-between gap-2 pt-8 px-4 border-b border-[#c2c7d1]">
                {hourlyData.map((d, i) => {
                  const maxVal = Math.max(...hourlyData.map((x) => x.amount)) || 100;
                  const heightPercent = Math.min(100, Math.max(15, (d.amount / maxVal) * 100));
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredDataPoint(d)}
                      onMouseLeave={() => setHoveredDataPoint(null)}
                      className="flex-1 flex flex-col items-center group cursor-pointer"
                    >
                      <div className="w-full max-w-[48px] bg-white rounded-t-lg border-t border-x border-[#c2c7d1] relative overflow-hidden flex items-end h-[180px]">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-gradient-to-t from-[#0f4c81] to-[#6366F1] group-hover:from-[#10B981] group-hover:to-[#34d399] transition-all duration-300 rounded-t-sm"
                        />
                      </div>
                      <span className="font-label-data text-[12px] text-[#727780] mt-2 font-semibold">
                        {d.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex justify-between items-center text-[12px] font-label-data text-[#727780] px-2">
                <span>Distribusi Jam Penjualan</span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" /> Total Sales
                </span>
              </div>
            </div>
          </div>

          {/* Top Cashiers Leaderboard */}
          <div className="bg-white rounded-xl border border-[#c2c7d1] shadow-xs p-5 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-headline-md text-[20px] font-bold text-[#1a1c1e]">
                {isManagement ? 'Performa Kasir' : 'Status Sesi Saya'}
              </h3>
              <span className="font-label-sm text-[12px] text-[#6366F1] bg-[#F5F3FF] font-bold px-2.5 py-1 rounded-md border border-[#6366F1]/20">
                Hari Ini
              </span>
            </div>

            <div className="space-y-3.5 flex-1">
              {cashierStats.map((cashier) => (
                <div
                  key={cashier.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    !isManagement && cashier.name.includes(currentCashier.name)
                      ? 'bg-[#f0f7ff] border-[#0f4c81]'
                      : 'hover:bg-[#f3f3f6] border-transparent hover:border-[#c2c7d1]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${cashier.colorClass} flex items-center justify-center font-bold text-[18px] font-headline-lg shrink-0 shadow-2xs`}
                  >
                    {cashier.avatarLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-label-sm text-[14px] font-bold text-[#1a1c1e] truncate">
                      {cashier.name}
                    </div>
                    <div className="font-label-data text-[12px] text-[#727780] mt-0.5">
                      {cashier.txnsCount} Txns
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-label-data text-[14px] text-[#1a1c1e] font-extrabold">
                      {formatCurrency(cashier.totalSales, currencySymbol)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Recent Transactions Table */}
        <div className="bg-white rounded-xl border border-[#c2c7d1] shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#c2c7d1] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
            <h3 className="font-headline-md text-[20px] font-bold text-[#1a1c1e]">
              Daftar Nota Transaksi ({filteredTransactions.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727780] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari no. nota / kasir..."
                className="w-full pl-9 pr-3 py-2 bg-[#f9f9fc] rounded-lg border border-[#c2c7d1] focus:border-[#6366F1] text-[13px] font-body-md outline-none transition-all placeholder:text-[#727780]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-[#f3f3f6] border-b border-[#c2c7d1]">
                  <th className="py-3 px-5 font-label-sm text-[12px] text-[#727780] font-semibold uppercase">
                    WAKTU
                  </th>
                  <th className="py-3 px-5 font-label-sm text-[12px] text-[#727780] font-semibold uppercase">
                    NO. NOTA
                  </th>
                  <th className="py-3 px-5 font-label-sm text-[12px] text-[#727780] font-semibold uppercase">
                    KASIR
                  </th>
                  <th className="py-3 px-5 font-label-sm text-[12px] text-[#727780] font-semibold uppercase">
                    PEMBAYARAN
                  </th>
                  <th className="py-3 px-5 font-label-sm text-[12px] text-[#727780] font-semibold uppercase">
                    STATUS
                  </th>
                  <th className="py-3 px-5 font-label-sm text-[12px] text-[#727780] font-semibold uppercase text-right">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody className="font-label-data text-[14px]">
                {filteredTransactions.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className={`border-b border-[#c2c7d1]/50 hover:bg-[#f3f3f6]/60 transition-colors cursor-pointer ${
                      idx % 2 === 0 ? 'bg-[#f9f9fc]' : 'bg-white'
                    }`}
                  >
                    <td className="py-3.5 px-5 text-[#1a1c1e] font-medium">{tx.time}</td>
                    <td className="py-3.5 px-5 text-[#6366F1] font-bold hover:underline">
                      {tx.ticketNo}
                    </td>
                    <td className="py-3.5 px-5 text-[#1a1c1e]">{tx.cashierName}</td>
                    <td className="py-3.5 px-5 text-[#42474f]">{tx.paymentMethod}</td>
                    <td className="py-3.5 px-5">
                      {tx.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                          COMPLETED
                        </span>
                      ) : tx.status === 'REFUNDED' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30">
                          REFUNDED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                          {tx.status}
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-3.5 px-5 text-right font-bold ${
                        tx.status === 'REFUNDED' ? 'text-[#EF4444]' : 'text-[#1a1c1e]'
                      }`}
                    >
                      {formatCurrency(tx.total, currencySymbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

