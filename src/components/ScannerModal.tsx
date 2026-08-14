import React, { useState } from 'react';
import { Product } from '../types';

interface ScannerModalProps {
  products: Product[];
  onScanProduct: (product: Product) => void;
  onClose: () => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  products,
  onScanProduct,
  onClose
}) => {
  const [skuCode, setSkuCode] = useState('');
  const [scannedMessage, setScannedMessage] = useState<string | null>(null);

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuCode) return;

    const matched = products.find(
      (p) => p.sku.toLowerCase() === skuCode.trim().toLowerCase()
    );

    if (matched) {
      onScanProduct(matched);
      setScannedMessage(`Added: ${matched.name} (${matched.sku})`);
      setSkuCode('');
      setTimeout(() => setScannedMessage(null), 2000);
    } else {
      setScannedMessage(`No product found matching SKU "${skuCode}"`);
      setTimeout(() => setScannedMessage(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#c2c7d1] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#c2c7d1] bg-[#f9f9fc] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6366F1] text-[22px]">
              qr_code_scanner
            </span>
            <h3 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
              Barcode Scanner Simulator
            </h3>
          </div>
          <button onClick={onClose} className="text-[#727780] hover:text-[#1a1c1e]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scanner Viewport Simulation */}
        <div className="p-6 space-y-4 text-center">
          <div className="relative aspect-16/9 bg-[#1a1c1e] rounded-xl overflow-hidden border-2 border-dashed border-[#6366F1] flex flex-col items-center justify-center p-4 text-white">
            <div className="w-full h-0.5 bg-[#EF4444] animate-pulse shadow-[0_0_8px_#EF4444]" />
            <span className="material-symbols-outlined text-[48px] text-[#8ebdf9] my-2">
              barcode
            </span>
            <p className="font-label-sm text-[12px] text-[#c2c7d1]">
              Align product barcode within frame or tap a product below
            </p>
          </div>

          {scannedMessage && (
            <div
              className={`p-2.5 rounded-xl font-label-sm text-[13px] font-bold transition-all ${
                scannedMessage.startsWith('Added')
                  ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30'
                  : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
              }`}
            >
              {scannedMessage}
            </div>
          )}

          {/* Manual SKU Form */}
          <form onSubmit={handleManualScanSubmit} className="space-y-2">
            <label className="font-label-sm text-[12px] text-[#42474f] uppercase block font-bold text-left">
              Type or Scan SKU Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. TS-WHT-M"
                value={skuCode}
                onChange={(e) => setSkuCode(e.target.value)}
                className="flex-1 px-3.5 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#6366F1] font-label-data text-[14px] uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#6366F1] text-white rounded-xl font-label-sm text-[13px] font-bold"
              >
                Scan
              </button>
            </div>
          </form>

          {/* Quick Scan Shortcuts */}
          <div className="text-left pt-2 border-t border-[#c2c7d1]">
            <p className="font-label-sm text-[11px] text-[#727780] uppercase mb-2 font-bold">
              Quick Scan Simulation Shortcuts:
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {products.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onScanProduct(p);
                    setScannedMessage(`Added: ${p.name}`);
                    setTimeout(() => setScannedMessage(null), 1800);
                  }}
                  className="p-2 border border-[#c2c7d1] rounded-lg hover:bg-[#F0F7FF] text-left transition-colors cursor-pointer"
                >
                  <p className="font-label-sm text-[12px] font-bold text-[#1a1c1e] truncate">
                    {p.name}
                  </p>
                  <p className="font-label-data text-[10px] text-[#6366F1]">{p.sku}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c2c7d1] bg-[#f9f9fc]">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px] font-bold text-[#1a1c1e] hover:bg-[#eeeef0]"
          >
            Done Scanning
          </button>
        </div>
      </div>
    </div>
  );
};
