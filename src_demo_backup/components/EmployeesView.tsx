import React, { useState } from 'react';
import { Employee } from '../types';
import { formatCurrency } from '../utils/format';

interface EmployeesViewProps {
  employees: Employee[];
  currentCashier: Employee;
  currencySymbol?: string;
  onSelectCashier: (emp: Employee) => void;
  onAddEmployee: (emp: Employee) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  currentCashier,
  currencySymbol = 'Rp',
  onSelectCashier,
  onAddEmployee
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Cashier' | 'Admin' | 'Store Manager'>('Cashier');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newEmp: Employee = {
      id: 'emp-' + Date.now(),
      name,
      role,
      email: email || `${name.toLowerCase().replace(' ', '.')}@grizopos.com`,
      phone: phone || '+1 (555) 000-0000',
      status: 'Active',
      totalSalesToday: 0,
      txnsToday: 0,
      cashierKey: 'kasir1'
    };

    onAddEmployee(newEmp);
    setIsAddModalOpen(false);
    setName('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f9f9fc]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-[30px] font-bold text-[#1a1c1e]">
              Staff & Staff Roles
            </h1>
            <p className="font-body-md text-[15px] text-[#42474f]">
              Manage terminal cashier permissions and view sales performance
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#6366F1] hover:bg-[#5254e0] text-white px-4 py-2.5 rounded-xl font-label-sm text-[14px] font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Add Staff Member</span>
          </button>
        </div>

        {/* Staff Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const isActiveUser = currentCashier.id === emp.id;

            return (
              <div
                key={emp.id}
                className={`bg-white rounded-xl p-5 border shadow-2xs flex flex-col justify-between transition-all ${
                  isActiveUser ? 'border-[#0f4c81] ring-2 ring-[#0f4c81]/20' : 'border-[#c2c7d1]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0f4c81]/10 text-[#0f4c81] font-headline-lg text-[20px] font-bold flex items-center justify-center">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-label-sm text-[16px] font-bold text-[#1a1c1e]">
                          {emp.name}
                        </h3>
                        <span className="font-label-data text-[12px] text-[#0f4c81] font-bold bg-[#F0F7FF] px-2 py-0.5 rounded-md border border-[#c2c7d1]">
                          {emp.role}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-label-data ${
                        emp.status === 'Active'
                          ? 'bg-[#10B981]/10 text-[#10B981]'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-[13px] font-body-md text-[#42474f] pt-2 border-t border-[#c2c7d1]">
                    <p>Email: {emp.email}</p>
                    <p>Phone: {emp.phone}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-[#f3f3f6] rounded-xl border border-[#c2c7d1]/60">
                    <div>
                      <p className="font-label-sm text-[11px] text-[#727780]">TODAY'S TXNS</p>
                      <p className="font-label-data text-[16px] font-bold text-[#1a1c1e]">
                        {emp.txnsToday}
                      </p>
                    </div>
                    <div>
                      <p className="font-label-sm text-[11px] text-[#727780]">TOTAL SALES</p>
                      <p className="font-label-data text-[15px] font-bold text-[#10B981]">
                        {formatCurrency(emp.totalSalesToday, currencySymbol)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#c2c7d1]">
                  {isActiveUser ? (
                    <div className="w-full py-2 bg-[#F0F7FF] text-[#0f4c81] font-label-sm text-[13px] font-bold rounded-xl text-center border border-[#0f4c81]/30">
                      Active Cashier Terminal User
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectCashier(emp)}
                      className="w-full py-2 bg-white border border-[#c2c7d1] hover:bg-[#eeeef0] text-[#1a1c1e] font-label-sm text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Switch Terminal to {emp.name.split(' ')[0]}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#c2c7d1] shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#c2c7d1]">
              <h3 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
                Add Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#727780] hover:text-[#1a1c1e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Marcus Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#6366F1] font-body-md text-[14px]"
              />
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                Terminal Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#6366F1] font-body-md text-[14px] bg-white"
              >
                <option value="Cashier">Cashier</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="marcus@grizopos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#6366F1] font-body-md text-[14px]"
              />
            </div>

            <div>
              <label className="font-label-sm text-[12px] text-[#42474f] uppercase block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#6366F1] font-body-md text-[14px]"
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#c2c7d1]">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[#6366F1] text-white rounded-xl font-label-sm text-[13px] font-bold"
              >
                Create Staff Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
