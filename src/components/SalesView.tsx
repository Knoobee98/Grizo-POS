import React, { useState } from 'react';
import { Product, CartItem, Customer, Employee } from '../types';
import { formatCurrency } from '../utils/format';

interface SalesViewProps {
  products: Product[];
  cart: CartItem[];
  ticketNo: string;
  selectedCustomer: Customer | null;
  discountAmount: number;
  taxRate: number; // e.g. 0.085 for 8.5%
  currentCashier?: Employee;
  currencySymbol?: string;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onSelectCustomer: (customer: Customer | null) => void;
  onApplyDiscount: (amount: number) => void;
  onSaveOrder: () => void;
  onVoidOrder: () => void;
  onCheckout: () => void;
  onOpenScanner: () => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  products,
  cart,
  ticketNo,
  selectedCustomer,
  discountAmount,
  taxRate,
  currentCashier,
  currencySymbol = 'Rp',
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onSelectCustomer,
  onApplyDiscount,
  onSaveOrder,
  onVoidOrder,
  onCheckout,
  onOpenScanner
}) => {
  const isRestrictedFromPOS = currentCashier?.role !== 'Cashier';
  const [showAdminRestrictionModal, setShowAdminRestrictionModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock'>('all');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [tempDiscount, setTempDiscount] = useState<string>(discountAmount > 0 ? discountAmount.toString() : '10000');

  // Available categories dynamically generated from products
  const dynamicCategories: string[] = Array.from(new Set(products.map((p) => p.category)));
  const allCategoryOptions: string[] = ['All Items', 'Sale', ...dynamicCategories];

  // Filter products based on search, category, and stock
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All Items'
        ? true
        : selectedCategory === 'Sale'
        ? p.price < 30 || (p.lowStockThreshold && p.stock <= p.lowStockThreshold)
        : p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'inStock'
        ? p.stock > 0
        : p.stock <= (p.lowStockThreshold || 5);

    return matchesCategory && matchesSearch && matchesStock;
  });

  // Calculate Subtotal, Tax, Total
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const calculatedTax = Math.round((subtotal - discountAmount) * taxRate * 100) / 100;
  const finalTax = calculatedTax < 0 ? 0 : calculatedTax;
  const grandTotal = Math.max(0, subtotal - discountAmount + finalTax);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#f9f9fc]">
      {/* Left Main Product Catalog Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto min-w-0">
        {/* Restriction Banner for non-cashier roles */}
        {isRestrictedFromPOS && (
          <div className="bg-[#ffdad6]/60 border border-[#ffdad6] text-[#ba1a1a] p-4 rounded-xl flex items-center justify-between gap-3 shadow-2xs mb-4 font-label-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[28px] text-[#EF4444] shrink-0">lock</span>
              <div>
                <h4 className="font-bold text-[15px] leading-tight">
                  Akses Dibatasi — Mode {currentCashier?.role || 'Management'}
                </h4>
                <p className="text-[12.5px] opacity-90 mt-0.5">
                  Akun {currentCashier?.role || 'Admin / Manager'} tidak dapat menambah barang ke keranjang atau memproses transaksi. Hak akses transaksi khusus untuk akun <strong>Kasir</strong>.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAdminRestrictionModal(true)}
              className="px-3.5 py-2 bg-[#EF4444] text-white rounded-lg text-[12px] font-bold hover:bg-[#dc2626] transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              Info Akses
            </button>
          </div>
        )}

        {/* Search Bar & Scanner Button */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727780] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk berdasarkan nama, SKU, atau kategori..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-[#c2c7d1] focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 text-[15px] outline-none font-body-md transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727780] hover:text-[#1a1c1e]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <button
            onClick={() => {
              if (isRestrictedFromPOS) {
                setShowAdminRestrictionModal(true);
                return;
              }
              onOpenScanner();
            }}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-3 bg-white border border-[#c2c7d1] rounded-xl hover:bg-[#eeeef0] text-[#1a1c1e] font-label-sm text-[13.5px] sm:text-[14px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            <span className="hidden sm:inline">Scan Barcode</span>
          </button>

          {/* Header Cart Toggle Button (Visible on Mobile & Tablet < lg) */}
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-3 bg-[#00355f] text-white rounded-xl hover:bg-[#0f4c81] font-label-sm text-[13px] sm:text-[13.5px] font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            title="Buka Keranjang Belanja"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            <span className="hidden sm:inline">Keranjang</span>
            {totalItemCount > 0 ? (
              <span className="bg-[#10B981] text-white text-[11px] font-bold px-2 py-0.5 rounded-full font-label-data">
                {totalItemCount} | {formatCurrency(grandTotal, currencySymbol)}
              </span>
            ) : (
              <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                0
              </span>
            )}
          </button>
        </div>

        {/* Prominent Filter & Category Card */}
        <div className="bg-white p-3.5 rounded-xl border border-[#c2c7d1] mb-5 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f4c81] text-[20px]">filter_alt</span>
              <span className="font-label-sm text-[14px] font-bold text-[#1a1c1e]">
                Filter & Kategori Produk
              </span>
              <span className="bg-[#eeeef0] text-[#42474f] text-[12px] font-label-data font-bold px-2.5 py-0.5 rounded-full border border-[#c2c7d1]">
                {filteredProducts.length} Produk Tampil
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Category Dropdown Select */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#eeeef0] text-[#1a1c1e] border border-[#c2c7d1] px-3 py-1.5 rounded-lg text-[13px] font-label-sm font-semibold outline-none cursor-pointer focus:border-[#0f4c81]"
              >
                {allCategoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    Kategori: {cat}
                  </option>
                ))}
              </select>

              {/* Reset Filter Button */}
              {(selectedCategory !== 'All Items' || searchQuery !== '' || stockFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('All Items');
                    setSearchQuery('');
                    setStockFilter('all');
                  }}
                  className="px-2.5 py-1.5 bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#EF4444] rounded-lg text-[12px] font-label-sm font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Chips / Pills Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {allCategoryOptions.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === 'All Items'
                  ? products.length
                  : cat === 'Sale'
                  ? products.filter((p) => p.price < 30 || (p.lowStockThreshold && p.stock <= p.lowStockThreshold)).length
                  : products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-label-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#0f4c81] text-white shadow-xs'
                      : 'bg-[#f3f3f6] border border-[#c2c7d1] text-[#42474f] hover:bg-[#eeeef0] hover:text-[#1a1c1e]'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[11px] font-label-data px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-[#c2c7d1]/50 text-[#42474f]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stock Filter Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#eeeef0]">
            <span className="text-[12px] font-label-sm text-[#727780] font-semibold">Status Stok:</span>
            <button
              onClick={() => setStockFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[12px] font-label-sm font-semibold transition-all cursor-pointer ${
                stockFilter === 'all'
                  ? 'bg-[#42474f] text-white'
                  : 'bg-[#eeeef0] text-[#727780] hover:text-[#1a1c1e]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStockFilter('inStock')}
              className={`px-2.5 py-1 rounded-md text-[12px] font-label-sm font-semibold transition-all cursor-pointer ${
                stockFilter === 'inStock'
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#eeeef0] text-[#727780] hover:text-[#1a1c1e]'
              }`}
            >
              Tersedia ({products.filter((p) => p.stock > 0).length})
            </button>
            <button
              onClick={() => setStockFilter('lowStock')}
              className={`px-2.5 py-1 rounded-md text-[12px] font-label-sm font-semibold transition-all cursor-pointer ${
                stockFilter === 'lowStock'
                  ? 'bg-[#F59E0B] text-white'
                  : 'bg-[#eeeef0] text-[#727780] hover:text-[#1a1c1e]'
              }`}
            >
              Stok Menipis ({products.filter((p) => p.stock <= (p.lowStockThreshold || 5)).length})
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 flex-1">
          {filteredProducts.map((p) => {
            const isLowStock = p.stock <= (p.lowStockThreshold || 5) && p.stock > 0;
            const isOutOfStock = p.stock === 0;

            return (
              <div
                key={p.id}
                onClick={() => {
                  if (isRestrictedFromPOS) {
                    setShowAdminRestrictionModal(true);
                    return;
                  }
                  if (!isOutOfStock) onAddToCart(p);
                }}
                className={`bg-white rounded-xl border border-[#c2c7d1] shadow-xs hover:border-[#0f4c81] hover:shadow-md transition-all flex flex-col overflow-hidden group cursor-pointer relative ${
                  isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98]'
                }`}
              >
                {/* Image Container with Badge */}
                <div className="relative aspect-4/3 w-full bg-[#f3f3f6] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Role Restriction Indicator Tag */}
                  {isRestrictedFromPOS && (
                    <div className="absolute top-2 left-2 z-10 bg-[#EF4444]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[12px]">lock</span>
                      <span>Kasir Only</span>
                    </div>
                  )}

                  {/* Stock Level Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    {isOutOfStock ? (
                      <span className="bg-[#42474f]/90 text-white font-label-data text-[11px] px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 font-semibold">
                        Out of stock
                      </span>
                    ) : isLowStock ? (
                      <span className="bg-[#F59E0B] text-white font-label-data text-[11px] px-2.5 py-1 rounded-full shadow-xs font-bold">
                        Low: {p.stock}
                      </span>
                    ) : (
                      <span className="bg-white/90 backdrop-blur-xs text-[#1a1c1e] border border-[#c2c7d1] font-label-data text-[11px] px-2.5 py-1 rounded-full shadow-xs font-semibold">
                        {p.stock} in stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-1">
                  <div>
                    <h3 className="font-label-sm text-[13px] sm:text-[14px] font-bold text-[#1a1c1e] line-clamp-2 leading-tight">
                      {p.name}
                    </h3>
                    {p.subtitle && (
                      <p className="font-label-sm text-[11px] text-[#727780] truncate mt-0.5">
                        {p.subtitle}
                      </p>
                    )}
                    <p className="font-label-data text-[10.5px] text-[#727780] mt-0.5">
                      SKU: {p.sku}
                    </p>
                  </div>

                  <div className="font-label-data text-[13.5px] sm:text-[15px] font-bold text-[#00355f] mt-1">
                    {formatCurrency(p.price, currencySymbol)}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 text-center text-[#727780]">
              <span className="material-symbols-outlined text-[48px] opacity-40 mb-2">
                search_off
              </span>
              <p className="font-headline-md text-[18px] font-semibold">No products found</p>
              <p className="font-body-md text-[14px] mt-1">
                Try searching for another term or selecting a different category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Bar for Mobile Screen & Tablet (< lg) */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-[#00355f] text-white px-3.5 py-2 shadow-2xl flex items-center justify-between z-30 lg:hidden border-t border-white/20">
        <div className="flex items-center gap-2.5">
          <div className="relative bg-white/10 p-1.5 rounded-lg border border-white/20">
            <span className="material-symbols-outlined text-[20px] text-white">shopping_cart</span>
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#EF4444] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#00355f]">
                {totalItemCount}
              </span>
            )}
          </div>
          <div>
            <p className="font-label-sm text-[10.5px] text-blue-100 font-medium leading-none">Total Pesanan</p>
            <p className="font-label-data text-[14px] font-bold text-white mt-0.5">
              {formatCurrency(grandTotal, currencySymbol)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileCartOpen(true)}
          className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-label-sm text-[12.5px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <span>Buka Keranjang</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Mobile/Tablet Cart Backdrop Overlay */}
      {isMobileCartOpen && (
        <div
          onClick={() => setIsMobileCartOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Right Sidebar / Mobile & Tablet Cart Sheet Drawer */}
      <div
        className={`bg-white flex flex-col shrink-0 transition-all duration-300 ${
          isMobileCartOpen
            ? 'fixed right-0 top-0 bottom-0 w-full sm:w-[400px] md:w-[420px] z-50 shadow-2xl border-l border-[#c2c7d1] lg:static lg:z-auto lg:w-[350px] xl:w-[410px] lg:flex lg:shadow-none'
            : 'hidden lg:flex lg:w-[350px] xl:w-[410px] lg:border-l border-[#c2c7d1] h-full lg:static'
        }`}
      >
        {/* Cart Header */}
        <div className="px-5 py-4 border-b border-[#c2c7d1] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#00355f] text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shopping_cart
            </span>
            <h2 className="font-headline-md text-[18px] sm:text-[20px] font-bold text-[#1a1c1e]">
              Keranjang Belanja
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-data text-[13px] bg-[#f3f3f6] text-[#42474f] px-2.5 py-1 rounded-md font-bold border border-[#c2c7d1]">
              Ticket {ticketNo}
            </span>
            <button
              onClick={() => setIsMobileCartOpen(false)}
              className="lg:hidden w-8 h-8 rounded-full bg-[#eeeef0] flex items-center justify-center text-[#42474f] hover:text-[#1a1c1e] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Customer Selector Bar */}
        <div className="px-4 py-2.5 bg-[#f9f9fc] border-b border-[#c2c7d1] flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsCustomerModalOpen(true)}
            className="flex items-center gap-2 text-[13px] font-label-sm text-[#42474f] hover:text-[#00355f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span className="font-semibold">
              {selectedCustomer ? (
                <span className="text-[#0f4c81] font-bold">{selectedCustomer.name}</span>
              ) : (
                'Add Customer (Optional)'
              )}
            </span>
          </button>
          {selectedCustomer && (
            <button
              onClick={() => onSelectCustomer(null)}
              className="text-[#EF4444] text-[12px] hover:underline font-semibold"
            >
              Remove
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-xl border border-[#c2c7d1] p-3.5 flex gap-3 items-center shadow-2xs hover:border-[#0f4c81]/40 transition-colors"
            >
              {/* Stepper controls */}
              <div className="flex flex-col items-center bg-[#f3f3f6] border border-[#c2c7d1] rounded-lg p-1 min-w-[36px]">
                <button
                  onClick={() => {
                    if (isRestrictedFromPOS) {
                      setShowAdminRestrictionModal(true);
                      return;
                    }
                    onUpdateQuantity(item.product.id, 1);
                  }}
                  className="w-7 h-7 flex items-center justify-center text-[#1a1c1e] hover:bg-white rounded-md font-bold transition-colors cursor-pointer active:scale-90"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="font-label-data text-[14px] font-bold text-[#1a1c1e] my-1">
                  {item.quantity}
                </span>
                <button
                  onClick={() => {
                    if (isRestrictedFromPOS) {
                      setShowAdminRestrictionModal(true);
                      return;
                    }
                    if (item.quantity > 1) {
                      onUpdateQuantity(item.product.id, -1);
                    } else {
                      onRemoveFromCart(item.product.id);
                    }
                  }}
                  className="w-7 h-7 flex items-center justify-center text-[#42474f] hover:text-[#EF4444] hover:bg-white rounded-md font-bold transition-colors cursor-pointer active:scale-90"
                  aria-label="Decrease quantity"
                >
                  {item.quantity === 1 ? (
                    <span className="material-symbols-outlined text-[16px] text-[#EF4444]">
                      delete
                    </span>
                  ) : (
                    '—'
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-label-sm text-[13.5px] font-bold text-[#1a1c1e] truncate leading-snug">
                  {item.product.name}
                </h4>
                <p className="font-label-data text-[10.5px] text-[#727780] mt-0.5">
                  SKU: {item.product.sku}
                </p>
                <p className="font-label-data text-[11px] text-[#42474f] mt-0.5 font-medium">
                  {formatCurrency(item.product.price, currencySymbol)} / unit
                </p>
              </div>

              {/* Total Item Price */}
              <div className="text-right font-label-data text-[13.5px] sm:text-[14.5px] font-bold text-[#1a1c1e] shrink-0">
                {formatCurrency(item.product.price * item.quantity, currencySymbol)}
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-12 text-[#727780] text-center">
              <span className="material-symbols-outlined text-[52px] opacity-30 mb-2">
                remove_shopping_cart
              </span>
              <p className="font-headline-md text-[16px] font-semibold">Keranjang Masih Kosong</p>
              <p className="font-body-md text-[13px] text-[#727780] max-w-[200px] mt-1">
                Pilih produk dari katalog untuk mulai membuat pesanan.
              </p>
            </div>
          )}
        </div>

        {/* Order Totals & Checkout Summary */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#c2c7d1] space-y-2 shrink-0 shadow-xs">
          <div className="flex justify-between font-label-data text-[13px] text-[#42474f]">
            <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
            <span className="font-bold text-[#1a1c1e]">{formatCurrency(subtotal, currencySymbol)}</span>
          </div>

          <div className="flex justify-between font-label-data text-[13px] text-[#42474f]">
            <span>Pajak ({(taxRate * 100).toFixed(1)}%)</span>
            <span className="font-bold text-[#1a1c1e]">{formatCurrency(finalTax, currencySymbol)}</span>
          </div>

          <div className="flex justify-between items-center font-label-data text-[13px]">
            <button
              onClick={() => {
                if (isRestrictedFromPOS) {
                  setShowAdminRestrictionModal(true);
                  return;
                }
                setIsDiscountModalOpen(true);
              }}
              className="text-[#10B981] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">local_offer</span>
              <span>{discountAmount > 0 ? 'Diskon diterapkan' : '+ Tambah Diskon'}</span>
            </button>
            <span className="font-bold text-[#10B981]">
              -{discountAmount > 0 ? formatCurrency(discountAmount, currencySymbol) : formatCurrency(0, currencySymbol)}
            </span>
          </div>

          {/* Grand Total */}
          <div className="pt-2 border-t border-[#c2c7d1] flex justify-between items-baseline">
            <span className="font-headline-md text-[15px] sm:text-[16px] font-bold text-[#1a1c1e]">Total Bayar</span>
            <span className="font-label-data text-[20px] sm:text-[23px] font-extrabold text-[#00355f] tracking-tight">
              {formatCurrency(grandTotal, currencySymbol)}
            </span>
          </div>

          {/* Action Row Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                if (isRestrictedFromPOS) {
                  setShowAdminRestrictionModal(true);
                  return;
                }
                onSaveOrder();
              }}
              disabled={cart.length === 0}
              className="py-2 px-3 border border-[#c2c7d1] rounded-xl font-label-sm text-[12.5px] font-bold text-[#1a1c1e] hover:bg-[#eeeef0] transition-colors flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Simpan</span>
            </button>

            <button
              onClick={() => {
                if (isRestrictedFromPOS) {
                  setShowAdminRestrictionModal(true);
                  return;
                }
                onVoidOrder();
              }}
              disabled={cart.length === 0}
              className="py-2 px-3 border border-[#ffdad6] rounded-xl font-label-sm text-[12.5px] font-bold text-[#EF4444] hover:bg-[#ffdad6]/30 transition-colors flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
              <span>Batalkan</span>
            </button>
          </div>

          {/* Big Green Checkout Button */}
          <button
            onClick={() => {
              if (isRestrictedFromPOS) {
                setShowAdminRestrictionModal(true);
                return;
              }
              onCheckout();
            }}
            disabled={cart.length === 0 || isRestrictedFromPOS}
            className={`w-full py-2.5 rounded-xl font-label-sm text-[14.5px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer ${
              isRestrictedFromPOS
                ? 'bg-[#c2c7d1] text-[#727780]'
                : 'bg-[#10B981] hover:bg-[#059669] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isRestrictedFromPOS ? 'lock' : 'payments'}
            </span>
            <span>
              {isRestrictedFromPOS ? 'Akses Khusus Kasir' : `Bayar (${formatCurrency(grandTotal, currencySymbol)})`}
            </span>
          </button>
        </div>
      </div>

      {/* Role Restriction Warning Modal */}
      {showAdminRestrictionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#c2c7d1] shadow-2xl space-y-4 text-center animate-fade-in">
            <div className="w-14 h-14 bg-[#ffdad6] text-[#EF4444] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">no_accounts</span>
            </div>
            <div>
              <h3 className="font-headline-md text-[20px] font-extrabold text-[#1a1c1e]">
                Akses Transaksi Dibatasi
              </h3>
              <p className="font-body-md text-[13.5px] text-[#42474f] mt-2 leading-relaxed">
                Anda saat ini masuk sebagai <span className="font-bold text-[#EF4444]">{currentCashier?.role || 'Management'}</span>. Wewenang membuat, memilih produk, serta memproses transaksi penjualan <strong className="text-[#1a1c1e]">HANYA DAPAT DILAKUKAN OLEH KASIR</strong>.
              </p>
            </div>

            <div className="bg-[#f3f3f6] p-3.5 rounded-xl text-left border border-[#c2c7d1] text-xs text-[#42474f] space-y-1.5">
              <p className="font-bold text-[#1a1c1e] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#0f4c81]">info</span>
                Petunjuk Penggunaan:
              </p>
              <p>• Silakan log out / ganti akun ke <strong>Kasir 1</strong> atau <strong>Kasir 2</strong> di menu profil untuk melayani transaksi pembeli.</p>
              <p>• Akun {currentCashier?.role || 'Admin / Manager'} tetap dapat memantau laporan, mengelola produk, dan mengubah pengaturan toko.</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowAdminRestrictionModal(false)}
                className="w-full py-2.5 bg-[#0f4c81] text-white rounded-xl font-label-sm text-[13.5px] font-bold hover:bg-[#00355f] transition-all cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#c2c7d1] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#c2c7d1]">
              <h3 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
                Diskon Nota Transaksi
              </h3>
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                className="text-[#727780] hover:text-[#1a1c1e] p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-md text-[13px] text-[#42474f]">
              Masukkan nominal potongan diskon untuk pesanan ini:
            </p>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#1a1c1e] text-[15px]">
                {currencySymbol || 'Rp'}
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={tempDiscount}
                onChange={(e) => setTempDiscount(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-[#c2c7d1] rounded-xl text-[18px] font-bold outline-none focus:border-[#0f4c81] font-label-data"
              />
            </div>

            {/* Preset Discount Buttons */}
            <div>
              <p className="font-label-sm text-[11px] text-[#727780] uppercase block mb-1.5 font-bold">
                Pilih Nominal Cepat:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[5000, 10000, 20000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTempDiscount(amt.toString())}
                    className="py-1.5 px-2 bg-[#f3f3f6] hover:bg-[#0f4c81] hover:text-white border border-[#c2c7d1] rounded-lg font-label-data text-[12px] font-bold text-[#1a1c1e] transition-colors cursor-pointer"
                  >
                    {formatCurrency(amt, currencySymbol)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#c2c7d1]">
              <button
                type="button"
                onClick={() => {
                  onApplyDiscount(0);
                  setIsDiscountModalOpen(false);
                }}
                className="flex-1 py-2.5 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px] text-[#EF4444] font-bold hover:bg-[#ffdad6]/20 transition-colors cursor-pointer"
              >
                Hapus Diskon
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = parseFloat(tempDiscount) || 0;
                  onApplyDiscount(val);
                  setIsDiscountModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-[#0f4c81] text-white rounded-xl font-label-sm text-[13px] font-bold hover:bg-[#00355f] transition-colors cursor-pointer shadow-xs"
              >
                Terapkan Diskon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Selection Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#c2c7d1] shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
                Attach Customer to Order
              </h3>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="text-[#727780] hover:text-[#1a1c1e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[
                { id: 'c-1', name: 'Sarah Jenkins', phone: '(555) 234-5678', loyaltyPoints: 240 },
                { id: 'c-2', name: 'Michael Chang', phone: '(555) 345-6789', loyaltyPoints: 110 },
                { id: 'c-3', name: 'Elena Rostova', phone: '(555) 456-7890', loyaltyPoints: 480 },
                { id: 'c-4', name: 'David Miller', phone: '(555) 567-8901', loyaltyPoints: 65 }
              ].map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => {
                    onSelectCustomer(cust);
                    setIsCustomerModalOpen(false);
                  }}
                  className="p-3 border border-[#c2c7d1] rounded-xl hover:bg-[#F0F7FF] cursor-pointer flex justify-between items-center transition-colors"
                >
                  <div>
                    <p className="font-label-sm text-[14px] font-bold text-[#1a1c1e]">
                      {cust.name}
                    </p>
                    <p className="font-label-data text-[12px] text-[#727780]">{cust.phone}</p>
                  </div>
                  <span className="font-label-data text-[12px] bg-[#76f4e0]/30 text-[#006f63] font-bold px-2 py-0.5 rounded-full">
                    {cust.loyaltyPoints} pts
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const name = prompt('Enter customer name:');
                if (name) {
                  onSelectCustomer({ id: 'c-' + Date.now(), name, loyaltyPoints: 0 });
                  setIsCustomerModalOpen(false);
                }
              }}
              className="w-full py-2.5 border border-dashed border-[#0f4c81] text-[#0f4c81] rounded-xl font-label-sm text-[13px] font-bold hover:bg-[#0f4c81]/5"
            >
              + Add New Customer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
