import React, { useState } from 'react';
import { Product, Category, ItemType } from '../types';
import { formatCurrency } from '../utils/format';
import { CategoryManagerModal } from './CategoryManagerModal';

interface InventoryViewProps {
  products: Product[];
  categories: Category[];
  currencySymbol?: string;
  onAddProduct: (p: Product) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  categories,
  currencySymbol = 'Rp',
  onAddProduct,
  onUpdateStock,
  onDeleteProduct,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'lowStock'>('all');
  const [selectedItemType, setSelectedItemType] = useState<'All' | ItemType>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingStockProduct, setEditingStockProduct] = useState<Product | null>(null);
  const [newStockInput, setNewStockInput] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdItemType, setNewProdItemType] = useState<ItemType>('Barang');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('25000');
  const [newProdStock, setNewProdStock] = useState('50');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80'
  );

  const lowStockCount = products.filter(
    (p) => (p.itemType || 'Barang') === 'Barang' && p.stock <= (p.lowStockThreshold || 10)
  ).length;

  const filteredProducts = products.filter((p) => {
    const itemType = p.itemType || 'Barang';
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLowStock =
      filterMode === 'lowStock'
        ? itemType === 'Barang' && p.stock <= (p.lowStockThreshold || 10)
        : true;

    const matchesItemType = selectedItemType === 'All' ? true : itemType === selectedItemType;
    const matchesCategory = selectedCategory === 'All' ? true : p.category === selectedCategory;

    return matchesSearch && matchesLowStock && matchesItemType && matchesCategory;
  });

  const filteredCategoriesForDropdown = categories.filter((c) => {
    if (selectedItemType === 'All') return true;
    return c.type === selectedItemType;
  });

  const availableCategoriesForNewForm = categories.filter((c) => c.type === newProdItemType);

  const handleOpenAddModal = () => {
    setNewProdItemType('Barang');
    const defaultCat = categories.find((c) => c.type === 'Barang')?.name || 'General Merchandise';
    setNewProdCategory(defaultCat);
    setIsAddModalOpen(true);
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdSku) return;

    const created: Product = {
      id: 'prod-' + Date.now(),
      name: newProdName,
      subtitle: newProdSubtitle || undefined,
      sku: newProdSku.toUpperCase(),
      category: newProdCategory || (newProdItemType === 'Barang' ? 'General Merchandise' : 'Jasa Umum'),
      itemType: newProdItemType,
      price: parseFloat(newProdPrice) || 0,
      stock: newProdItemType === 'Jasa' ? 999 : parseInt(newProdStock, 10) || 0,
      lowStockThreshold: newProdItemType === 'Jasa' ? 0 : 10,
      image: newProdImage
    };

    onAddProduct(created);
    setIsAddModalOpen(false);
    // Reset form
    setNewProdName('');
    setNewProdSubtitle('');
    setNewProdSku('');
  };

  const handleStockUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStockProduct) {
      onUpdateStock(editingStockProduct.id, parseInt(newStockInput, 10) || 0);
      setEditingStockProduct(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f9f9fc]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Header Title & Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-[28px] sm:text-[32px] font-bold text-[#1a1c1e]">
              Manajemen Inventaris & Kategori
            </h1>
            <p className="font-body-md text-[14px] sm:text-[15px] text-[#42474f]">
              Kelola stok barang fisik, daftar jasa/layanan, serta kategori toko.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727780] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, SKU, atau kategori..."
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-[#c2c7d1] focus:border-[#0f4c81] text-[13.5px] outline-none shadow-2xs font-body-md"
              />
            </div>

            <button
              onClick={() => setIsCategoryManagerOpen(true)}
              className="bg-white border border-[#c2c7d1] hover:bg-[#eeeef0] text-[#1a1c1e] px-3.5 py-2 rounded-xl font-label-sm text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0f4c81]">category</span>
              <span>Kelola Kategori</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="bg-[#0f4c81] hover:bg-[#00355f] text-white px-3.5 py-2 rounded-xl font-label-sm text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Tambah Item</span>
            </button>
          </div>
        </div>

        {/* Filters Row (All Products, Goods/Services tabs, Low Stock badge, Category dropdown) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#c2c7d1] shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Goods vs Service Segmented Toggle */}
            <div className="flex bg-[#f0f0f3] p-1 rounded-xl border border-[#c2c7d1]/60">
              <button
                type="button"
                onClick={() => setSelectedItemType('All')}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-[12.5px] font-bold transition-all cursor-pointer ${
                  selectedItemType === 'All'
                    ? 'bg-white text-[#1a1c1e] shadow-xs'
                    : 'text-[#727780] hover:text-[#1a1c1e]'
                }`}
              >
                Semua Tipe
              </button>
              <button
                type="button"
                onClick={() => setSelectedItemType('Barang')}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-[12.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedItemType === 'Barang'
                    ? 'bg-white text-[#0f4c81] shadow-xs'
                    : 'text-[#727780] hover:text-[#1a1c1e]'
                }`}
              >
                <span>📦 Barang</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedItemType('Jasa')}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-[12.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedItemType === 'Jasa'
                    ? 'bg-white text-[#7c3aed] shadow-xs'
                    : 'text-[#727780] hover:text-[#1a1c1e]'
                }`}
              >
                <span>🛠️ Jasa</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 rounded-xl font-label-sm text-[12.5px] font-semibold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#1a1c1e] text-white shadow-2xs'
                  : 'bg-[#eeeef0] text-[#42474f] hover:bg-[#e8e8ea]'
              }`}
            >
              Semua ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('lowStock')}
              className={`px-3 py-1.5 rounded-xl font-label-sm text-[12.5px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                filterMode === 'lowStock'
                  ? 'bg-[#EF4444] text-white shadow-2xs'
                  : 'bg-white border border-[#ffdad6] text-[#EF4444] hover:bg-[#ffdad6]/20'
              }`}
            >
              <span>Stok Menipis</span>
              <span className="bg-[#EF4444] text-white font-label-data text-[10.5px] font-bold px-1.5 py-0.2 rounded-full">
                {lowStockCount}
              </span>
            </button>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#eeeef0] text-[#1a1c1e] border border-[#c2c7d1] px-3 py-1.5 rounded-xl font-label-sm text-[12.5px] font-semibold outline-none cursor-pointer"
            >
              <option value="All">Semua Kategori</option>
              {filteredCategoriesForDropdown.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.type === 'Jasa' ? '🛠️ ' : '📦 '} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterMode('all');
              setSelectedItemType('All');
              setSelectedCategory('All');
            }}
            className="px-3 py-1.5 border border-[#c2c7d1] rounded-xl text-[#42474f] font-label-sm text-[12.5px] font-semibold hover:bg-[#eeeef0] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Main Inventory Table Container */}
        <div className="bg-white rounded-xl border border-[#c2c7d1] shadow-xs overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-[#f3f3f6] border-b border-[#c2c7d1]">
                  <th className="py-3 px-4 font-label-sm text-[11.5px] text-[#727780] font-semibold uppercase tracking-wider">
                    NAMA ITEM & TIPE
                  </th>
                  <th className="py-3 px-4 font-label-sm text-[11.5px] text-[#727780] font-semibold uppercase tracking-wider">
                    SKU / KATEGORI
                  </th>
                  <th className="py-3 px-4 font-label-sm text-[11.5px] text-[#727780] font-semibold uppercase tracking-wider">
                    HARGA SATUAN
                  </th>
                  <th className="py-3 px-4 font-label-sm text-[11.5px] text-[#727780] font-semibold uppercase tracking-wider">
                    STATUS STOK / LAYANAN
                  </th>
                  <th className="py-3 px-4 font-label-sm text-[11.5px] text-[#727780] font-semibold uppercase tracking-wider text-right">
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody className="font-label-data text-[13.5px]">
                {filteredProducts.map((prod, idx) => {
                  const isService = prod.itemType === 'Jasa';
                  const isLow = !isService && prod.stock <= (prod.lowStockThreshold || 10) && prod.stock > 0;
                  const isZero = !isService && prod.stock === 0;

                  return (
                    <tr
                      key={prod.id}
                      className={`border-b border-[#c2c7d1]/60 hover:bg-[#F0F7FF] transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9fc]'
                      }`}
                    >
                      {/* Product Name & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-[#eeeef0] overflow-hidden border border-[#c2c7d1] shrink-0 p-1 flex items-center justify-center">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-label-sm text-[14px] font-bold text-[#1a1c1e] flex items-center gap-1.5">
                              <span>{prod.name}</span>
                              <span
                                className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                  isService
                                    ? 'bg-purple-100 text-[#7c3aed] border border-purple-200'
                                    : 'bg-blue-100 text-[#0f4c81] border border-blue-200'
                                }`}
                              >
                                {isService ? 'JASA' : 'BARANG'}
                              </span>
                            </div>
                            {prod.subtitle && (
                              <div
                                className={`font-label-sm text-[11.5px] mt-0.5 ${
                                  prod.subtitle === 'Out of Stock'
                                    ? 'text-[#EF4444] font-bold'
                                    : 'text-[#727780]'
                                }`}
                              >
                                {prod.subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU / Category */}
                      <td className="py-3.5 px-4 text-[#42474f]">
                        <div className="font-bold text-[#1a1c1e]">{prod.sku}</div>
                        <div className="text-[12px] text-[#727780]">{prod.category}</div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3.5 px-4 font-extrabold text-[#1a1c1e]">
                        {formatCurrency(prod.price, currencySymbol)}
                      </td>

                      {/* Stock Level Badge */}
                      <td className="py-3.5 px-4">
                        {isService ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-purple-50 text-[#7c3aed] border border-purple-200">
                            <span className="material-symbols-outlined text-[14px]">all_inclusive</span>
                            <span>Layanan / Non-Stok</span>
                          </span>
                        ) : isZero ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-[#eeeef0] text-[#727780] border border-[#c2c7d1]">
                            Habis (0 unit)
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-extrabold bg-[#ffdad6] text-[#93000a] border border-[#EF4444]/30">
                            <span className="material-symbols-outlined text-[13px]">warning</span>
                            <span>{prod.stock} unit (Menipis)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-[#eeeef0] text-[#1a1c1e] border border-[#c2c7d1]">
                            {prod.stock} unit
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isService && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingStockProduct(prod);
                                setNewStockInput(prod.stock.toString());
                              }}
                              className="p-1.5 text-[#0f4c81] hover:bg-[#eeeef0] rounded-lg transition-colors cursor-pointer"
                              title="Sesuaikan Stok"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                edit_square
                              </span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus item ${prod.name}?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-[#EF4444] hover:bg-[#ffdad6]/40 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Item"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#727780]">
                      <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-[#0f4c81]/10 text-[#0f4c81] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[32px]">inventory_2</span>
                        </div>
                        <h4 className="font-headline-md text-[17px] font-bold text-[#1a1c1e]">
                          Belum Ada Produk atau Layanan
                        </h4>
                        <p className="font-body-md text-[13px] text-[#727780] leading-relaxed">
                          Toko Anda masih kosong. Mulai dengan membuat Kategori terlebih dahulu, lalu tambahkan item Barang atau Jasa pertama Anda.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => setIsCategoryManagerOpen(true)}
                            className="px-3.5 py-2 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px] font-bold text-[#1a1c1e] bg-white hover:bg-[#eeeef0] transition-all cursor-pointer"
                          >
                            1. Buat Kategori
                          </button>
                          <button
                            onClick={handleOpenAddModal}
                            className="px-4 py-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-label-sm text-[13px] font-bold shadow-xs transition-all cursor-pointer"
                          >
                            2. + Tambah Item
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3.5 border-t border-[#c2c7d1] bg-white flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="font-label-sm text-[12.5px] text-[#42474f]">
              Menampilkan 1 - {filteredProducts.length} dari total {products.length} item
            </span>

            <div className="flex items-center gap-1 font-label-data text-[12.5px]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-lg border border-[#c2c7d1] hover:bg-[#eeeef0] flex items-center justify-center font-bold text-[#42474f] cursor-pointer"
              >
                &lt;
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#0f4c81] text-white flex items-center justify-center font-bold">
                1
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-7 h-7 rounded-lg border border-[#c2c7d1] hover:bg-[#eeeef0] flex items-center justify-center font-bold text-[#42474f] cursor-pointer"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {editingStockProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleStockUpdateSubmit}
            className="bg-white rounded-2xl p-5 max-w-sm w-full border border-[#c2c7d1] shadow-xl space-y-3.5"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-[16px] font-bold text-[#1a1c1e]">
                Sesuaikan Jumlah Stok
              </h3>
              <button
                type="button"
                onClick={() => setEditingStockProduct(null)}
                className="text-[#727780] hover:text-[#1a1c1e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-label-sm text-[13.5px] font-bold text-[#0f4c81]">
              {editingStockProduct.name}
            </p>

            <div>
              <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                Jumlah Stok Baru (Unit):
              </label>
              <input
                type="number"
                min="0"
                value={newStockInput}
                onChange={(e) => setNewStockInput(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#c2c7d1] rounded-xl text-[16px] font-bold outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingStockProduct(null)}
                className="flex-1 py-2 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[#0f4c81] text-white rounded-xl font-label-sm text-[13px] font-bold hover:bg-[#00355f]"
              >
                Simpan Stok
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <form
            onSubmit={handleCreateProductSubmit}
            className="bg-white rounded-2xl p-4 sm:p-5 max-w-lg w-full border border-[#c2c7d1] shadow-xl space-y-3.5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#c2c7d1]">
              <h3 className="font-headline-md text-[17px] font-bold text-[#1a1c1e]">
                Tambah Item Inventaris Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#727780] hover:text-[#1a1c1e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Item Type Selector */}
            <div>
              <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1.5 font-bold">
                Pilih Tipe Item *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewProdItemType('Barang');
                    const cat = categories.find((c) => c.type === 'Barang')?.name || 'General Merchandise';
                    setNewProdCategory(cat);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    newProdItemType === 'Barang'
                      ? 'border-[#0f4c81] bg-[#0f4c81]/10 text-[#0f4c81] font-bold ring-2 ring-[#0f4c81]/20'
                      : 'border-[#c2c7d1] bg-white text-[#42474f] hover:bg-[#eeeef0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                  <span className="text-[12.5px]">📦 Barang (Fisik)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewProdItemType('Jasa');
                    const cat = categories.find((c) => c.type === 'Jasa')?.name || 'Jasa Seduh Barista';
                    setNewProdCategory(cat);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    newProdItemType === 'Jasa'
                      ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 text-[#7c3aed] font-bold ring-2 ring-[#8b5cf6]/20'
                      : 'border-[#c2c7d1] bg-white text-[#42474f] hover:bg-[#eeeef0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">build</span>
                  <span className="text-[12.5px]">🛠️ Jasa (Layanan)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-full">
                <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                  Nama {newProdItemType === 'Barang' ? 'Produk' : 'Layanan Jasa'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    newProdItemType === 'Barang'
                      ? 'Contoh: Kopi Arabika House Blend 250g'
                      : 'Contoh: Jasa Servis Mesin Espresso'
                  }
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[13.5px]"
                />
              </div>

              <div>
                <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                  Keterangan / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Perawatan Rutin / Size L"
                  value={newProdSubtitle}
                  onChange={(e) => setNewProdSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[13.5px]"
                />
              </div>

              <div>
                <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                  Kode SKU / Ref *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SRV-001 atau KPB-001"
                  value={newProdSku}
                  onChange={(e) => setNewProdSku(e.target.value)}
                  className="w-full px-3 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[13.5px] uppercase"
                />
              </div>

              <div>
                <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                  Kategori ({newProdItemType}) *
                </label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[13.5px] bg-white cursor-pointer"
                >
                  {availableCategoriesForNewForm.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  {availableCategoriesForNewForm.length === 0 && (
                    <option value={newProdItemType === 'Barang' ? 'General' : 'Jasa Umum'}>
                      {newProdItemType === 'Barang' ? 'General' : 'Jasa Umum'}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                  Harga Satuan (Rp) *
                </label>
                <input
                  type="number"
                  step="500"
                  min="0"
                  required
                  placeholder="25000"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[13.5px] font-bold text-[#1a1c1e]"
                />
              </div>

              {newProdItemType === 'Barang' ? (
                <div className="col-span-full">
                  <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                    Jumlah Stok Awal *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="50"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[13.5px]"
                  />
                </div>
              ) : (
                <div className="col-span-full bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-[#7c3aed] text-[12px] font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <span>Jasa / Layanan tidak memerlukan pencatatan jumlah stok fisik.</span>
                </div>
              )}

              <div className="col-span-full space-y-2">
                <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block font-bold">
                  Gambar Produk / Layanan
                </label>

                {/* Image Upload / Preview Container */}
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#f9f9fc] p-3 rounded-xl border border-[#c2c7d1]">
                  {/* Thumbnail Preview */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#c2c7d1] overflow-hidden shrink-0 flex items-center justify-center relative group">
                    <img
                      src={
                        newProdImage ||
                        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80'
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {newProdImage && (
                      <button
                        type="button"
                        onClick={() => setNewProdImage('')}
                        className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[11px] font-bold"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-lg font-label-sm text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all">
                        <span className="material-symbols-outlined text-[16px]">upload_file</span>
                        <span>Unggah Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            // Compress image using HTML Canvas to prevent localStorage quota crash
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_WIDTH = 300;
                                const MAX_HEIGHT = 300;
                                let width = img.width;
                                let height = img.height;

                                if (width > height) {
                                  if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                  }
                                } else {
                                  if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                  }
                                }

                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                ctx?.drawImage(img, 0, 0, width, height);

                                // Convert & compress image to WebP format (with JPEG fallback if WebP is unsupported)
                                let compressedBase64 = canvas.toDataURL('image/webp', 0.75);
                                if (!compressedBase64.startsWith('data:image/webp')) {
                                  compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
                                }
                                setNewProdImage(compressedBase64);
                              };
                              img.src = event.target?.result as string;
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      <span className="text-[11px] text-[#727780]">atau tempel URL di bawah</span>
                    </div>

                    <input
                      type="url"
                      placeholder="https:// domain.com/foto.jpg"
                      value={newProdImage.startsWith('data:') ? '' : newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#c2c7d1] rounded-lg outline-none focus:border-[#0f4c81] font-body-md text-[12px] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#c2c7d1]">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px] font-semibold text-[#42474f] hover:bg-[#eeeef0]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[#0f4c81] text-white rounded-xl font-label-sm text-[13px] font-bold shadow-xs hover:bg-[#00355f] cursor-pointer"
              >
                Simpan Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        products={products}
        onAddCategory={onAddCategory}
        onUpdateCategory={onUpdateCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
};
