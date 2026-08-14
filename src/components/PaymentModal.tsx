import React, { useState } from 'react';
import { CartItem, Customer, Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface PaymentModalProps {
  cart: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  ticketNo: string;
  cashierName: string;
  selectedCustomer: Customer | null;
  currencySymbol?: string;
  onClose: () => void;
  onCompleteTransaction: (newTx: Transaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  cart,
  subtotal,
  tax,
  discount,
  total,
  ticketNo,
  cashierName,
  selectedCustomer,
  currencySymbol = 'Rp',
  onClose,
  onCompleteTransaction
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Cash' | 'Mobile Pay' | 'Gift Card'>('Credit Card');
  const [amountTendered, setAmountTendered] = useState<string>(Math.ceil(total).toString());
  const [isProcessing, setIsProcessing] = useState(false);

  const tenderedNumber = parseFloat(amountTendered) || 0;
  const changeDue = Math.max(0, tenderedNumber - total);

  // Quick cash preset amounts
  const getQuickCashOptions = (): number[] => {
    const isIDR = !currencySymbol || currencySymbol === 'Rp' || currencySymbol === 'IDR';
    if (isIDR || total >= 1000) {
      const p1 = total;
      const p2 = Math.ceil(total / 20000) * 20000 || total + 20000;
      const p3 = Math.ceil(total / 50000) * 50000 || total + 50000;
      const p4 = Math.ceil(total / 100000) * 100000 || total + 100000;
      return Array.from(new Set([p1, p2, p3, p4].filter((n) => n >= total)));
    } else {
      return Array.from(new Set([total, 20, 50, 100].filter((n) => n >= total)));
    }
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const dateStr = now.toISOString().split('T')[0];

      const newTx: Transaction = {
        id: 'trx-' + Date.now(),
        ticketNo: ticketNo,
        time: `${hours}:${minutes}`,
        date: dateStr,
        cashierName,
        cashierId: 'kasir1',
        customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
        paymentMethod,
        status: 'COMPLETED',
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          unitPrice: item.product.price,
          subtotal: item.product.price * item.quantity
        })),
        subtotal,
        tax,
        discount,
        total,
        amountTendered: paymentMethod === 'Cash' ? tenderedNumber : total,
        changeDue: paymentMethod === 'Cash' ? changeDue : 0
      };

      onCompleteTransaction(newTx);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md sm:max-w-lg w-full border border-[#c2c7d1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#c2c7d1] flex justify-between items-center bg-[#f9f9fc] shrink-0">
          <div>
            <h2 className="font-headline-md text-[16px] sm:text-[18px] font-bold text-[#1a1c1e]">
              Pembayaran Transaksi
            </h2>
            <p className="font-label-data text-[11px] sm:text-[12px] text-[#727780]">
              No. Tiket: <span className="font-bold text-[#1a1c1e]">{ticketNo}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#727780] hover:text-[#1a1c1e] p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">close</span>
          </button>
        </div>

        <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
          {/* Amount Due Compact Banner */}
          <div className="bg-[#00355f] text-white p-3 sm:p-4 rounded-xl text-center shadow-inner">
            <span className="font-label-sm text-[10.5px] sm:text-[11.5px] text-[#8ebdf9] uppercase tracking-wider block font-bold">
              Total Tagihan Pembayaran
            </span>
            <span className="font-label-data text-[22px] sm:text-[28px] font-extrabold tracking-tight block mt-0.5">
              {formatCurrency(total, currencySymbol)}
            </span>
          </div>

          {/* Payment Method Tabs */}
          <div>
            <label className="font-label-sm text-[11px] sm:text-[12px] text-[#42474f] uppercase block mb-1.5 font-bold">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {[
                { id: 'Credit Card', icon: 'credit_card', label: 'Kartu EDC' },
                { id: 'Cash', icon: 'payments', label: 'Tunai' },
                { id: 'Mobile Pay', icon: 'contactless', label: 'QRIS / E-Wallet' },
                { id: 'Gift Card', icon: 'card_giftcard', label: 'Voucher' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-2 sm:p-2.5 rounded-xl border font-label-sm text-[11.5px] sm:text-[12.5px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? 'border-[#10B981] bg-[#10B981]/10 text-[#059669] ring-2 ring-[#10B981]/30'
                      : 'border-[#c2c7d1] bg-white text-[#42474f] hover:bg-[#eeeef0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">{m.icon}</span>
                  <span className="truncate max-w-full">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash Tendered & Change Helper */}
          {paymentMethod === 'Cash' && (
            <div className="bg-[#f3f3f6] p-3 sm:p-3.5 rounded-xl border border-[#c2c7d1] space-y-2.5">
              <label className="font-label-sm text-[11px] sm:text-[12px] text-[#42474f] uppercase font-bold block">
                Jumlah Uang Diterima ({currencySymbol || 'Rp'})
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[14px] sm:text-[15px] text-[#1a1c1e]">
                  {currencySymbol || 'Rp'}
                </span>
                <input
                  type="number"
                  step="1000"
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(e.target.value)}
                  className="w-full pl-11 pr-3 py-2 bg-white border border-[#c2c7d1] rounded-xl font-label-data text-[15px] sm:text-[16px] font-extrabold outline-none focus:border-[#10B981]"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div>
                <p className="font-label-sm text-[10.5px] text-[#727780] uppercase block mb-1 font-bold">
                  Pilihan Uang Pas / Nominal:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {getQuickCashOptions().map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountTendered(amt.toString())}
                      className="px-2.5 py-1 bg-white border border-[#c2c7d1] rounded-lg font-label-data text-[11px] sm:text-[12px] font-bold text-[#1a1c1e] hover:bg-[#eeeef0] transition-colors cursor-pointer"
                    >
                      {amt === total ? 'Uang Pas' : formatCurrency(amt, currencySymbol)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change Calculation */}
              <div className="flex justify-between items-center pt-2 border-t border-[#c2c7d1]">
                <span className="font-label-sm text-[12.5px] sm:text-[13.5px] text-[#42474f] font-bold">
                  Kembalian:
                </span>
                <span className="font-label-data text-[15px] sm:text-[17px] font-extrabold text-[#10B981]">
                  {formatCurrency(changeDue, currencySymbol)}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'Credit Card' && (
            <div className="p-3 bg-[#F0F7FF] border border-[#c2c7d1] rounded-xl text-center text-[#0f4c81] font-body-md text-[12px] sm:text-[13px]">
              <span className="material-symbols-outlined text-[28px] sm:text-[32px] mb-0.5">contactless</span>
              <p className="font-bold">Mesin EDC Siap Ditap/Digesek</p>
              <p className="text-[11px] sm:text-[12px] text-[#42474f] mt-0.5">
                Tempelkan atau gesek kartu debit/kredit pelanggan pada mesin EDC.
              </p>
            </div>
          )}

          {paymentMethod === 'Mobile Pay' && (
            <div className="p-3 bg-[#f0fdf4] border border-[#c2c7d1] rounded-xl text-center text-[#15803d] font-body-md text-[12px] sm:text-[13px]">
              <span className="material-symbols-outlined text-[28px] sm:text-[32px] mb-0.5">qr_code_2</span>
              <p className="font-bold">QRIS / Kode QR Siap Di-scan</p>
              <p className="text-[11px] sm:text-[12px] text-[#42474f] mt-0.5">
                Minta pelanggan memindai kode QR pada layar atau struk.
              </p>
            </div>
          )}

          {paymentMethod === 'Gift Card' && (
            <div className="p-3 bg-[#fff7ed] border border-[#c2c7d1] rounded-xl text-center text-[#c2410c] font-body-md text-[12px] sm:text-[13px]">
              <span className="material-symbols-outlined text-[28px] sm:text-[32px] mb-0.5">card_giftcard</span>
              <p className="font-bold">Voucher / Kartu Hadiah</p>
              <p className="text-[11px] sm:text-[12px] text-[#42474f] mt-0.5">
                Masukkan atau pindai kode voucher diskon toko.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-[#c2c7d1] bg-white flex gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px] sm:text-[14px] font-bold text-[#42474f] hover:bg-[#eeeef0] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleProcessPayment}
            disabled={isProcessing || (paymentMethod === 'Cash' && tenderedNumber < total)}
            className="flex-2 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-label-sm text-[13px] sm:text-[14.5px] font-bold flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-40 transition-colors cursor-pointer"
          >
            {isProcessing ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Bayar {formatCurrency(total, currencySymbol)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
