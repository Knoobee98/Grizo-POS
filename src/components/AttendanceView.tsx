import React, { useState } from 'react';
import { AttendanceRecord, Employee, StoreConfig, TabType } from '../types';

interface AttendanceViewProps {
  currentCashier: Employee;
  employees?: Employee[];
  attendanceLogs: AttendanceRecord[];
  storeConfig?: StoreConfig;
  onNavigate?: (tab: TabType) => void;
  onCheckIn: (employeeId: string, notes?: string) => void;
  onCheckOut: (employeeId: string) => void;
  onToggleBreak: (employeeId: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentCashier,
  employees = [],
  attendanceLogs,
  storeConfig,
  onNavigate,
  onCheckIn,
  onCheckOut,
  onToggleBreak
}) => {
  const [shiftNote, setShiftNote] = useState('');
  const [selectedFilterEmp, setSelectedFilterEmp] = useState<string>('all');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const isManagement = currentCashier.role === 'Admin' || currentCashier.role === 'Store Manager';

  // Find today's active record for current user (if cashier)
  const myTodayRecord = attendanceLogs.find(
    (a) => a.employeeId === currentCashier.id && a.date === todayStr
  );

  const isCheckedIn = myTodayRecord && myTodayRecord.status !== 'Checked Out';
  const isOnBreak = myTodayRecord && myTodayRecord.status === 'On Break';

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckIn(currentCashier.id, shiftNote || 'Shift Regular');
    setShiftNote('');
  };

  const filteredLogs = attendanceLogs.filter((log) => {
    // If Cashier (not Admin/Manager), strictly isolate to personal attendance logs!
    if (!isManagement && log.employeeId !== currentCashier.id) {
      return false;
    }

    const matchEmp =
      selectedFilterEmp === 'all' || log.employeeId === selectedFilterEmp;
    const matchStatus =
      selectedFilterStatus === 'all' || log.status === selectedFilterStatus;

    return matchEmp && matchStatus;
  });

  // Calculate Stats
  const cashierEmployees = employees.filter((e) => e.role === 'Cashier');
  const totalCashiersCount = cashierEmployees.length || 2;

  const totalTodayPresent = attendanceLogs.filter(
    (a) => a.date === todayStr && (a.status === 'Checked In' || a.status === 'Late')
  ).length;

  const totalTodayOnBreak = attendanceLogs.filter(
    (a) => a.date === todayStr && a.status === 'On Break'
  ).length;

  const totalTodayLate = attendanceLogs.filter(
    (a) => a.date === todayStr && a.status === 'Late'
  ).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f9f9fc]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#c2c7d1] shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-[26px] font-bold text-[#1a1c1e]">
                {isManagement ? 'Laporan Absensi Kasir' : 'Sistem Absensi Kasir'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30">
                Grizolabs Module
              </span>
            </div>
            <p className="font-body-md text-[14px] text-[#42474f] mt-0.5">
              {isManagement
                ? 'Laporan Kehadiran Terpusat & Pemantauan Shift Kasir'
                : `Absensi & Waktu Kerja Sesi: ${currentCashier.name}`}
            </p>
          </div>

          {/* Shift Schedule Badge */}
          <div className="flex items-center gap-3 bg-[#f9f9fc] p-3 rounded-xl border border-[#c2c7d1]">
            <div className="text-right">
              <p className="font-label-sm text-[11px] text-[#727780] uppercase font-bold">
                Jadwal Shift Standar
              </p>
              <p className="font-label-data text-[14px] font-extrabold text-[#0f4c81]">
                {storeConfig?.workShiftStart || '08:00'} - {storeConfig?.workShiftEnd || '17:00'}{' '}
                <span className="text-[11px] font-normal text-[#727780]">
                  (Toleransi {storeConfig?.lateToleranceMinutes ?? 15}m)
                </span>
              </p>
            </div>
            {isManagement && onNavigate && (
              <button
                onClick={() => onNavigate('settings')}
                className="p-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Atur Jam Kerja di Settings"
              >
                <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className={isManagement ? 'space-y-6' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
          {/* Cashier Attendance Action Card (Only for Cashier role) */}
          {!isManagement && (
            <div className="bg-white rounded-2xl p-6 border border-[#c2c7d1] shadow-xs space-y-5 lg:col-span-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-[#c2c7d1]">
                  <h2 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
                    Terminal Check-In
                  </h2>
                  <span className="font-label-data text-[12px] text-[#727780] font-bold">
                    {new Date().toLocaleDateString('id-ID', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>

                <div className="my-4 text-center p-4 bg-[#f3f3f6] rounded-xl border border-[#c2c7d1]">
                  <p className="font-label-sm text-[12px] text-[#727780] uppercase">
                    Status Kehadiran Hari Ini
                  </p>
                  <div className="mt-2 flex justify-center items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isOnBreak
                          ? 'bg-[#F59E0B] animate-ping'
                          : isCheckedIn
                          ? 'bg-[#10B981] animate-pulse'
                          : 'bg-[#727780]'
                      }`}
                    />
                    <span className="font-headline-md text-[20px] font-extrabold text-[#1a1c1e]">
                      {isOnBreak
                        ? 'Dalam Istirahat'
                        : isCheckedIn
                        ? 'Sudah Check-In'
                        : 'Belum Check-In'}
                    </span>
                  </div>

                  {myTodayRecord && (
                    <div className="mt-3 pt-3 border-t border-[#c2c7d1]/80 text-[12px] text-[#42474f] font-label-data flex justify-around">
                      <div>
                        <span className="text-[#727780] block">Masuk:</span>
                        <span className="font-bold text-[#10B981]">
                          {myTodayRecord.checkInTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#727780] block">Keluar:</span>
                        <span className="font-bold text-[#EF4444]">
                          {myTodayRecord.checkOutTime || '--:--'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!isCheckedIn ? (
                  <form onSubmit={handleCheckInSubmit} className="space-y-3">
                    <div>
                      <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                        Catatan Shift (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Shift Pagi Terminal 1"
                        value={shiftNote}
                        onChange={(e) => setShiftNote(e.target.value)}
                        className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl font-body-md text-[13px] outline-none focus:border-[#6366F1]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-headline-md text-[15px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[22px]">login</span>
                      <span>Check-In Masuk Shift</span>
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => onToggleBreak(currentCashier.id)}
                      className={`w-full py-2.5 rounded-xl font-label-sm text-[14px] font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        isOnBreak
                          ? 'bg-[#10B981]/10 text-[#059669] border-[#10B981]'
                          : 'bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isOnBreak ? 'play_arrow' : 'pause'}
                      </span>
                      <span>{isOnBreak ? 'Selesai Istirahat' : 'Mulai Istirahat'}</span>
                    </button>

                    <button
                      onClick={() => onCheckOut(currentCashier.id)}
                      className="w-full py-3 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded-xl font-headline-md text-[15px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[22px]">logout</span>
                      <span>Check-Out Selesai Shift</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#c2c7d1] text-[12px] text-[#727780] font-label-sm">
                <p>📍 Lokasi: Main Branch Terminal</p>
                <p>👤 Kasir Aktif: {currentCashier.name}</p>
              </div>
            </div>
          )}

          {/* Attendance Stats & Overview */}
          <div className={isManagement ? 'space-y-6' : 'lg:col-span-2 space-y-4'}>
            {isManagement && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-[#c2c7d1] shadow-2xs">
                  <p className="font-label-sm text-[11px] text-[#727780] uppercase">Hadir Hari Ini</p>
                  <p className="font-headline-lg text-[22px] font-extrabold text-[#10B981] mt-1">
                    {totalTodayPresent} Kasir
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#c2c7d1] shadow-2xs">
                  <p className="font-label-sm text-[11px] text-[#727780] uppercase">Dalam Istirahat</p>
                  <p className="font-headline-lg text-[22px] font-extrabold text-[#F59E0B] mt-1">
                    {totalTodayOnBreak} Kasir
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#c2c7d1] shadow-2xs">
                  <p className="font-label-sm text-[11px] text-[#727780] uppercase">Terlambat</p>
                  <p className="font-headline-lg text-[22px] font-extrabold text-[#EF4444] mt-1">
                    {totalTodayLate} Kasir
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#c2c7d1] shadow-2xs">
                  <p className="font-label-sm text-[11px] text-[#727780] uppercase">Total Kasir Active</p>
                  <p className="font-headline-lg text-[22px] font-extrabold text-[#00355f] mt-1">
                    {totalCashiersCount} Kasir
                  </p>
                </div>
              </div>
            )}

            {/* Filters Row */}
            <div className="bg-white p-3.5 rounded-xl border border-[#c2c7d1] shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {isManagement && (
                  <select
                    value={selectedFilterEmp}
                    onChange={(e) => setSelectedFilterEmp(e.target.value)}
                    className="bg-[#eeeef0] text-[#1a1c1e] border border-[#c2c7d1] px-3 py-1.5 rounded-xl font-label-sm text-[13px] font-semibold outline-none cursor-pointer"
                  >
                    <option value="all">Semua Kasir</option>
                    {cashierEmployees.length > 0 ? (
                      cashierEmployees.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="emp-1">Kasir 1 (Alice Smith)</option>
                        <option value="emp-2">Kasir 2 (Bob Jones)</option>
                      </>
                    )}
                  </select>
                )}

                <select
                  value={selectedFilterStatus}
                  onChange={(e) => setSelectedFilterStatus(e.target.value)}
                  className="bg-[#eeeef0] text-[#1a1c1e] border border-[#c2c7d1] px-3 py-1.5 rounded-xl font-label-sm text-[13px] font-semibold outline-none cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="Checked In">Checked In</option>
                  <option value="On Break">On Break</option>
                  <option value="Checked Out">Checked Out</option>
                  <option value="Late">Late</option>
                </select>
              </div>

              {!isManagement && (
                <div className="font-label-sm text-[12px] text-[#0f4c81] font-bold bg-[#F0F7FF] px-3 py-1 rounded-lg border border-[#c2c7d1]">
                  🔒 Mode Akses Kasir Terisolasi
                </div>
              )}
            </div>

            {/* Attendance Records Table */}
            <div className="bg-white rounded-xl border border-[#c2c7d1] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#c2c7d1] flex justify-between items-center bg-[#f9f9fc]">
                <h3 className="font-headline-md text-[16px] font-bold text-[#1a1c1e]">
                  {isManagement ? 'Laporan Riwayat Kehadiran Semua Kasir' : 'Riwayat Absensi Saya'}
                </h3>
                <span className="font-label-data text-[12px] text-[#727780]">
                  {filteredLogs.length} Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-[#f3f3f6] border-b border-[#c2c7d1]">
                      <th className="py-3 px-4 font-label-sm text-[12px] text-[#727780] uppercase">
                        NAMA KASIR
                      </th>
                      <th className="py-3 px-4 font-label-sm text-[12px] text-[#727780] uppercase">
                        TANGGAL
                      </th>
                      <th className="py-3 px-4 font-label-sm text-[12px] text-[#727780] uppercase">
                        CHECK IN
                      </th>
                      <th className="py-3 px-4 font-label-sm text-[12px] text-[#727780] uppercase">
                        CHECK OUT
                      </th>
                      <th className="py-3 px-4 font-label-sm text-[12px] text-[#727780] uppercase">
                        STATUS
                      </th>
                      <th className="py-3 px-4 font-label-sm text-[12px] text-[#727780] uppercase">
                        CATATAN
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-label-data text-[13px]">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b border-[#c2c7d1]/60 hover:bg-[#f9f9fc]">
                          <td className="py-3 px-4 font-bold text-[#1a1c1e]">
                            {log.employeeName}
                          </td>
                          <td className="py-3 px-4 text-[#42474f]">{log.date}</td>
                          <td className="py-3 px-4 font-bold text-[#10B981]">
                            {log.checkInTime}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#EF4444]">
                            {log.checkOutTime || '--:--'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                log.status === 'Checked In'
                                  ? 'bg-[#10B981]/10 text-[#10B981]'
                                  : log.status === 'On Break'
                                  ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                                  : log.status === 'Late'
                                  ? 'bg-[#EF4444]/10 text-[#EF4444]'
                                  : 'bg-[#eeeef0] text-[#727780]'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#727780]">{log.notes || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#727780]">
                          Tidak ada catatan absensi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

