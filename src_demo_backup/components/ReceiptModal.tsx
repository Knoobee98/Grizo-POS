import React, { useState } from 'react';
import { Transaction, StoreConfig, DEFAULT_STORE_CONFIG } from '../types';
import { formatCurrency } from '../utils/format';
import { printViaWebBluetooth, isWebBluetoothSupported } from '../utils/bluetoothPrinter';

interface ReceiptModalProps {
  transaction: Transaction;
  storeConfig?: StoreConfig;
  onClose: () => void;
  onNewSale?: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  storeConfig = DEFAULT_STORE_CONFIG,
  onClose,
  onNewSale
}) => {
  const [isBluetoothPrinting, setIsBluetoothPrinting] = useState(false);
  const [printMessage, setPrintMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePrintSystem = () => {
    window.print();
  };

  const handlePrintBluetooth = async () => {
    setIsBluetoothPrinting(true);
    setPrintMessage(null);

    const result = await printViaWebBluetooth(transaction, storeConfig);

    setIsBluetoothPrinting(false);
    if (result.success) {
      setPrintMessage({
        type: 'success',
        text: `Struk berhasil dicetak ke ${result.deviceName || 'Printer Bluetooth'}!`
      });
    } else {
      setPrintMessage({
        type: 'error',
        text: result.error || 'Gagal mencetak ke printer Bluetooth.'
      });
    }
  };

  const curr = storeConfig.currencySymbol || 'Rp';
  const hasBluetooth = isWebBluetoothSupported();

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#c2c7d1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Printable Receipt Paper Container */}
        <div className="p-6 overflow-y-auto font-label-data text-[#1a1c1e] space-y-4 print:p-0">
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-[#c2c7d1]">
            <h2 className="font-headline-md text-[22px] font-bold text-[#00355f] uppercase">
              {storeConfig.storeName}
            </h2>
            <p className="font-body-md text-[13px] text-[#42474f]">{storeConfig.storeBranch}</p>
            {storeConfig.address && (
              <p className="text-[11px] text-[#727780]">{storeConfig.address}</p>
            )}
            {storeConfig.phone && (
              <p className="text-[11px] text-[#727780]">{storeConfig.phone}</p>
            )}
            <p className="text-[12px] text-[#727780] pt-1">
              {transaction.date} • {transaction.time}
            </p>
            <p className="text-[12px] font-bold text-[#0f4c81]">Ticket {transaction.ticketNo}</p>
          </div>

          <div className="text-[12px] text-[#42474f] space-y-0.5">
            <p>Kasir: {transaction.cashierName}</p>
            {transaction.customerName && <p>Pelanggan: {transaction.customerName}</p>}
            <p>Metode: {transaction.paymentMethod}</p>
            <p>Status: {transaction.status}</p>
          </div>

          {/* Items */}
          <div className="border-t border-b border-dashed border-[#c2c7d1] py-3 space-y-2 text-[13px]">
            {transaction.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{it.productName}</p>
                  <p className="text-[11px] text-[#727780]">
                    {it.quantity} x {formatCurrency(it.unitPrice, curr)}
                  </p>
                </div>
                <span className="font-bold">{formatCurrency(it.subtotal, curr)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-[13px] text-[#42474f]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">{formatCurrency(transaction.subtotal, curr)}</span>
            </div>

            {transaction.discount > 0 && (
              <div className="flex justify-between text-[#10B981]">
                <span>Diskon:</span>
                <span className="font-bold">-{formatCurrency(transaction.discount, curr)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Pajak ({(storeConfig.taxRate * 100).toFixed(1)}%):</span>
              <span className="font-bold">{formatCurrency(transaction.tax, curr)}</span>
            </div>

            <div className="flex justify-between text-[18px] font-extrabold text-[#1a1c1e] pt-2 border-t border-[#c2c7d1]">
              <span>TOTAL:</span>
              <span>{formatCurrency(transaction.total, curr)}</span>
            </div>

            {transaction.amountTendered !== undefined && transaction.amountTendered > 0 && (
              <div className="flex justify-between text-[12px] pt-1 text-[#727780]">
                <span>Diterima:</span>
                <span>{formatCurrency(transaction.amountTendered, curr)}</span>
              </div>
            )}
            {transaction.changeDue !== undefined && transaction.changeDue >= 0 && (
              <div className="flex justify-between text-[12px] text-[#10B981] font-bold">
                <span>Kembalian:</span>
                <span>{formatCurrency(transaction.changeDue, curr)}</span>
              </div>
            )}
          </div>

          <div className="text-center pt-4 border-t border-dashed border-[#c2c7d1] text-[11px] text-[#727780]">
            <p className="font-bold">{storeConfig.receiptFooter}</p>
          </div>
        </div>

        {/* Print Status Feedback */}
        {printMessage && (
          <div
            className={`px-4 py-2 text-[12px] font-bold flex items-center justify-between border-t ${
              printMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            <span>{printMessage.text}</span>
            <button
              onClick={() => setPrintMessage(null)}
              className="text-current opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="p-3.5 border-t border-[#c2c7d1] bg-[#f9f9fc] flex flex-col sm:flex-row gap-2">
          {hasBluetooth && (
            <button
              onClick={handlePrintBluetooth}
              disabled={isBluetoothPrinting}
              className="flex-1 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-label-sm text-[12.5px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">bluetooth</span>
              <span>{isBluetoothPrinting ? 'Menghubungkan...' : 'Cetak Bluetooth'}</span>
            </button>
          )}

          <button
            onClick={handlePrintSystem}
            className="flex-1 py-2.5 border border-[#c2c7d1] rounded-xl font-label-sm text-[12.5px] font-bold text-[#1a1c1e] bg-white hover:bg-[#eeeef0] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Sistem</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onNewSale) onNewSale();
            }}
            className="flex-1 py-2.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-label-sm text-[12.5px] font-bold shadow-xs cursor-pointer"
          >
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  );
};


