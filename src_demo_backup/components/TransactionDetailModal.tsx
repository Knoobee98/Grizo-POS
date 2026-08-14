import React from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface TransactionDetailModalProps {
  transaction: Transaction;
  currencySymbol?: string;
  onClose: () => void;
  onRefund: (txId: string) => void;
  onPrintReceipt: (tx: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  currencySymbol = 'Rp',
  onClose,
  onRefund,
  onPrintReceipt
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#c2c7d1] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#c2c7d1] bg-[#f9f9fc] flex justify-between items-center">
          <div>
            <h3 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
              Transaction Details {transaction.ticketNo}
            </h3>
            <p className="font-label-data text-[12px] text-[#727780]">
              {transaction.date} at {transaction.time} • Cashier: {transaction.cashierName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#727780] hover:text-[#1a1c1e] p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center p-3 bg-[#f3f3f6] rounded-xl border border-[#c2c7d1]">
            <div>
              <p className="font-label-sm text-[12px] text-[#727780]">STATUS & PAYMENT</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-label-data ${
                    transaction.status === 'COMPLETED'
                      ? 'bg-[#10B981]/10 text-[#10B981]'
                      : 'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}
                >
                  {transaction.status}
                </span>
                <span className="font-label-data text-[13px] font-bold text-[#1a1c1e]">
                  {transaction.paymentMethod}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-label-sm text-[12px] text-[#727780]">TOTAL</p>
              <p className="font-headline-md text-[20px] font-extrabold text-[#00355f]">
                {formatCurrency(transaction.total, currencySymbol)}
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h4 className="font-label-sm text-[13px] font-bold text-[#1a1c1e] mb-2 uppercase">
              Purchased Items ({transaction.items.length})
            </h4>
            <div className="space-y-2 border border-[#c2c7d1] rounded-xl p-3 bg-white">
              {transaction.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-[13px]">
                  <div>
                    <p className="font-label-sm font-bold text-[#1a1c1e]">{it.productName}</p>
                    <p className="font-label-data text-[11px] text-[#727780]">
                      SKU: {it.sku} • {it.quantity} x {formatCurrency(it.unitPrice, currencySymbol)}
                    </p>
                  </div>
                  <span className="font-label-data font-bold text-[#1a1c1e]">
                    {formatCurrency(it.subtotal, currencySymbol)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-1.5 font-label-data text-[13px] text-[#42474f] pt-2 border-t border-[#c2c7d1]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">{formatCurrency(transaction.subtotal, currencySymbol)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-[#10B981]">
                <span>Discount:</span>
                <span className="font-bold">-{formatCurrency(transaction.discount, currencySymbol)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (8.5%):</span>
              <span className="font-bold">{formatCurrency(transaction.tax, currencySymbol)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#c2c7d1] bg-[#f9f9fc] flex gap-2">
          <button
            onClick={() => onPrintReceipt(transaction)}
            className="flex-1 py-2.5 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px] font-bold text-[#1a1c1e] bg-white hover:bg-[#eeeef0] flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">receipt</span>
            <span>View Receipt</span>
          </button>

          {transaction.status === 'COMPLETED' && (
            <button
              onClick={() => {
                if (confirm(`Process a full refund for ${transaction.ticketNo}?`)) {
                  onRefund(transaction.id);
                  onClose();
                }
              }}
              className="flex-1 py-2.5 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded-xl font-label-sm text-[13px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
              <span>Process Refund</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
