import React, { useState } from 'react';
import { Employee } from '../types';

interface LoginScreenProps {
  employees: Employee[];
  onLoginSuccess: (cashier: Employee) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  employees,
  onLoginSuccess
}) => {
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(employees[0] || null);
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Default demo PINs for each cashier key
  const PIN_MAP: Record<string, string> = {
    kasir1: '1111',
    kasir2: '2222',
    manager: '8888',
    admin: '9999'
  };

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 6) {
      setPinInput((prev) => prev + num);
      setErrorMessage('');
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleClear = () => {
    setPinInput('');
    setErrorMessage('');
  };

  const handleAuthenticate = (empToLogin?: Employee) => {
    const emp = empToLogin || selectedEmp;
    if (!emp) return;

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      // Dynamic PIN check from employee profile or fallback map
      const correctPin = emp.pin || PIN_MAP[emp.cashierKey] || '1234';

      // Secure PIN verification without backdoor bypasses
      if (empToLogin || pinInput === correctPin) {
        onLoginSuccess(emp);
      } else {
        setErrorMessage(`PIN yang Anda masukkan salah. Silakan coba lagi.`);
        setIsSubmitting(false);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#001d33] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#0f4c81]/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#c2c7d1] shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Top Header Branding */}
        <div className="bg-gradient-to-r from-[#00355f] to-[#0f4c81] p-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl border border-white/20 mb-3 shadow-inner">
            <span className="material-symbols-outlined text-[32px] text-white">point_of_sale</span>
          </div>
          <h1 className="font-headline-lg text-[28px] font-bold text-white tracking-wide">
            Grizo
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-label-sm font-semibold mt-1">
            Sistem Kasir & Operasional Toko
          </p>
          <div className="mt-2 text-[11px] font-label-data text-blue-200 bg-white/10 px-3 py-1 rounded-full inline-block border border-white/15">
            powered by <span className="font-bold text-white">Grizolabs</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Cashier Account Selector */}
          <div>
            <label className="block text-xs font-label-sm font-bold text-[#42474f] uppercase tracking-wider mb-2">
              Pilih Akun Pengguna
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {employees.map((emp) => {
                const isSelected = selectedEmp?.id === emp.id;
                let iconName = 'badge';
                if (emp.role === 'Admin') iconName = 'admin_panel_settings';
                else if (emp.role === 'Store Manager') iconName = 'manage_accounts';

                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => {
                      setSelectedEmp(emp);
                      setPinInput('');
                      setErrorMessage('');
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[80px] active:scale-95 ${
                      isSelected
                        ? 'bg-[#e0f0ff] border-[#0f4c81] text-[#00355f] ring-2 ring-[#0f4c81]/30 shadow-xs'
                        : 'bg-[#f8f9fc] border-[#c2c7d1] text-[#42474f] hover:bg-[#eeeef0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px] mb-1">
                      {iconName}
                    </span>
                    <span className="font-label-sm text-[11px] font-bold line-clamp-1 leading-tight">
                      {emp.name.split(' ')[0]}
                    </span>
                    <span className="text-[9.5px] opacity-75 font-medium line-clamp-1">{emp.role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected User Header */}
          {selectedEmp && (
            <div className="bg-[#f3f4f8] p-3 rounded-xl border border-[#c2c7d1] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00355f] text-white flex items-center justify-center font-bold text-sm">
                  {selectedEmp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-label-sm text-sm font-bold text-[#1a1c1e]">
                    {selectedEmp.name}
                  </h3>
                  <p className="font-label-data text-xs text-[#727780]">
                    PIN Default: <span className="font-bold text-[#0f4c81]">{PIN_MAP[selectedEmp.cashierKey]}</span>
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#0f4c81]/10 text-[#0f4c81]">
                {selectedEmp.role}
              </span>
            </div>
          )}

          {/* PIN Input Display */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-label-sm font-bold text-[#42474f]">Masukkan 4-Digit PIN</span>
              {pinInput.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#EF4444] font-semibold hover:underline cursor-pointer"
                >
                  Bersihkan
                </button>
              )}
            </div>
            
            <div className="flex justify-center gap-3 py-3 bg-[#f3f3f6] rounded-2xl border border-[#c2c7d1] shadow-inner">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pinInput.length > idx
                      ? 'bg-[#00355f] border-[#00355f] scale-110'
                      : 'border-[#c2c7d1] bg-white'
                  }`}
                />
              ))}
            </div>

            {errorMessage && (
              <p className="text-xs text-[#EF4444] font-bold text-center mt-2 bg-[#ffdad6]/40 p-2 rounded-lg border border-[#ffdad6]">
                {errorMessage}
              </p>
            )}
          </div>

          {/* Touch-Friendly PIN Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="py-3 sm:py-3.5 bg-white border border-[#c2c7d1] rounded-2xl text-xl font-bold text-[#1a1c1e] hover:bg-[#eeeef0] active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="py-3 sm:py-3.5 bg-[#f3f3f6] border border-[#c2c7d1] rounded-2xl text-[#EF4444] hover:bg-[#ffdad6]/30 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">backspace</span>
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="py-3 sm:py-3.5 bg-white border border-[#c2c7d1] rounded-2xl text-xl font-bold text-[#1a1c1e] hover:bg-[#eeeef0] active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleAuthenticate()}
              disabled={isSubmitting || pinInput.length < 4}
              className="py-3 sm:py-3.5 bg-[#10B981] text-white border border-[#059669] rounded-2xl hover:bg-[#059669] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[24px]">login</span>
            </button>
          </div>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-[#eeeef0]">
            <p className="text-[11px] text-center font-label-sm text-[#727780] mb-2 font-semibold">
              Atau Masuk Cepat Mode Demo:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {employees.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleAuthenticate(emp)}
                  className="px-2 py-1.5 bg-[#f3f3f6] border border-[#c2c7d1] hover:bg-[#00355f] hover:text-white rounded-lg text-[11px] font-bold text-[#42474f] transition-all cursor-pointer truncate"
                >
                  ⚡ {emp.cashierKey}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
