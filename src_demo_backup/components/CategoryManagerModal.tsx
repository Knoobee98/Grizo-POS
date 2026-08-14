import React, { useState } from 'react';
import { Category, ItemType, Product } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [filterType, setFilterType] = useState<'All' | ItemType>('All');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<ItemType>('Barang');
  const [catDescription, setCatDescription] = useState('');
  const [catIcon, setCatIcon] = useState('category');

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => {
    if (filterType === 'All') return true;
    return c.type === filterType;
  });

  const handleOpenAddForm = () => {
    setEditingCategory(null);
    setCatName('');
    setCatType('Barang');
    setCatDescription('');
    setCatIcon('category');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatType(cat.type);
    setCatDescription(cat.description || '');
    setCatIcon(cat.icon || 'category');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        name: catName.trim(),
        type: catType,
        description: catDescription.trim() || undefined,
        icon: catIcon || 'category'
      });
    } else {
      const newCat: Category = {
        id: 'cat-' + Date.now(),
        name: catName.trim(),
        type: catType,
        description: catDescription.trim() || undefined,
        icon: catIcon || 'category'
      };
      onAddCategory(newCat);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (cat: Category) => {
    const linkedCount = products.filter((p) => p.category === cat.name).length;
    let msg = `Yakin ingin menghapus kategori "${cat.name}"?`;
    if (linkedCount > 0) {
      msg += `\n\nPerhatian: Ada ${linkedCount} produk/jasa yang saat ini terdaftar dalam kategori ini.`;
    }
    if (window.confirm(msg)) {
      onDeleteCategory(cat.id);
    }
  };

  const iconOptions = [
    { name: 'category', label: 'Umum' },
    { name: 'coffee', label: 'Kopi' },
    { name: 'emoji_food_beverage', label: 'Minuman/Teh' },
    { name: 'checkroom', label: 'Pakaian' },
    { name: 'style', label: 'Aksesoris' },
    { name: 'steps', label: 'Sepatu' },
    { name: 'storefront', label: 'Toko' },
    { name: 'local_cafe', label: 'Barista/Seduh' },
    { name: 'skillet', label: 'Roasting' },
    { name: 'build', label: 'Servis/Perbaikan' },
    { name: 'dry_cleaning', label: 'Cuci/Care' },
    { name: 'precision_manufacturing', label: 'Mesin' },
    { name: 'spa', label: 'Perawatan' },
    { name: 'handyman', label: 'Pertukangan' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#c2c7d1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#c2c7d1] flex justify-between items-center bg-[#f9f9fc] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0f4c81]/10 text-[#0f4c81] rounded-xl">
              <span className="material-symbols-outlined text-[22px]">category</span>
            </div>
            <div>
              <h2 className="font-headline-md text-[18px] font-bold text-[#1a1c1e]">
                Manajemen Kategori Barang & Jasa
              </h2>
              <p className="font-label-data text-[12px] text-[#727780]">
                Kelola kelompok produk fisik (Barang) dan layanan non-fisik (Jasa)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#727780] hover:text-[#1a1c1e] p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* Top Bar: Tabs & Add Category Button */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex bg-[#f0f0f3] p-1 rounded-xl border border-[#c2c7d1]/60 shrink-0">
              <button
                type="button"
                onClick={() => setFilterType('All')}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-[12.5px] font-bold transition-all cursor-pointer ${
                  filterType === 'All'
                    ? 'bg-white text-[#1a1c1e] shadow-xs'
                    : 'text-[#727780] hover:text-[#1a1c1e]'
                }`}
              >
                Semua ({categories.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('Barang')}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-[12.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterType === 'Barang'
                    ? 'bg-white text-[#0f4c81] shadow-xs'
                    : 'text-[#727780] hover:text-[#1a1c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                <span>Barang ({categories.filter((c) => c.type === 'Barang').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('Jasa')}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-[12.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterType === 'Jasa'
                    ? 'bg-white text-[#8b5cf6] shadow-xs'
                    : 'text-[#727780] hover:text-[#1a1c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">build</span>
                <span>Jasa ({categories.filter((c) => c.type === 'Jasa').length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenAddForm}
              className="px-3.5 py-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-label-sm text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Tambah Kategori</span>
            </button>
          </div>

          {/* Form Modal / Accordion inside modal */}
          {isFormOpen && (
            <form
              onSubmit={handleSubmit}
              className="bg-[#f8fafc] border-2 border-[#0f4c81]/30 p-4 rounded-2xl space-y-3.5 shadow-sm animate-in fade-in duration-200"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#c2c7d1]">
                <h3 className="font-headline-md text-[15px] font-bold text-[#1a1c1e] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#0f4c81]">
                    {editingCategory ? 'edit' : 'add_box'}
                  </span>
                  <span>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-[#727780] hover:text-[#1a1c1e]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Tipe Selector: Barang vs Jasa */}
              <div>
                <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1.5 font-bold">
                  Pilih Tipe Kategori *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCatType('Barang')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      catType === 'Barang'
                        ? 'border-[#0f4c81] bg-[#0f4c81]/10 text-[#0f4c81] font-bold ring-2 ring-[#0f4c81]/20'
                        : 'border-[#c2c7d1] bg-white text-[#42474f] hover:bg-[#eeeef0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                    <div>
                      <p className="text-[13px] leading-tight">Barang (Fisik)</p>
                      <p className="text-[10.5px] text-[#727780] font-normal leading-tight mt-0.5">
                        Produk fisik bermenyimpan stok
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCatType('Jasa')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      catType === 'Jasa'
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 text-[#7c3aed] font-bold ring-2 ring-[#8b5cf6]/20'
                        : 'border-[#c2c7d1] bg-white text-[#42474f] hover:bg-[#eeeef0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">build</span>
                    <div>
                      <p className="text-[13px] leading-tight">Jasa (Layanan)</p>
                      <p className="text-[10.5px] text-[#727780] font-normal leading-tight mt-0.5">
                        Layanan pekerjaan & non-stok
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                    Nama Kategori *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Coffee Beans atau Jasa Servis"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[13.5px] bg-white"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                    Pilih Ikon
                  </label>
                  <select
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className="w-full px-3 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[13.5px] bg-white cursor-pointer"
                  >
                    {iconOptions.map((ic) => (
                      <option key={ic.name} value={ic.name}>
                        {ic.label} ({ic.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-full">
                  <label className="font-label-sm text-[11.5px] text-[#42474f] uppercase block mb-1 font-bold">
                    Deskripsi Kategori
                  </label>
                  <input
                    type="text"
                    placeholder="Deskripsi singkat mengenai kelompok ini..."
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-[#c2c7d1] rounded-xl outline-none focus:border-[#0f4c81] font-body-md text-[13.5px] bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-2 border border-[#c2c7d1] rounded-xl font-label-sm text-[13px] font-semibold text-[#42474f] hover:bg-[#eeeef0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-label-sm text-[13px] font-bold shadow-xs cursor-pointer"
                >
                  {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          )}

          {/* Categories Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCategories.map((cat) => {
              const linkedCount = products.filter((p) => p.category === cat.name).length;
              const isBarang = cat.type === 'Barang';

              return (
                <div
                  key={cat.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#c2c7d1] shadow-xs flex flex-col justify-between hover:border-[#0f4c81]/40 transition-all group"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-xl flex items-center justify-center ${
                            isBarang
                              ? 'bg-[#0f4c81]/10 text-[#0f4c81]'
                              : 'bg-[#8b5cf6]/10 text-[#7c3aed]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {cat.icon || (isBarang ? 'inventory_2' : 'build')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-label-sm text-[14px] font-bold text-[#1a1c1e] leading-snug">
                            {cat.name}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isBarang
                                ? 'bg-blue-50 text-[#0f4c81] border border-blue-200'
                                : 'bg-purple-50 text-[#7c3aed] border border-purple-200'
                            }`}
                          >
                            {isBarang ? '📦 Barang' : '🛠️ Jasa'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleOpenEditForm(cat)}
                          className="p-1.5 text-[#727780] hover:text-[#0f4c81] hover:bg-[#f0f0f3] rounded-lg transition-colors cursor-pointer"
                          title="Edit Kategori"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 text-[#727780] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Kategori"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {cat.description && (
                      <p className="font-body-md text-[12px] text-[#727780] line-clamp-2 mt-1">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-[#f0f0f3] flex justify-between items-center font-label-data text-[11.5px] text-[#42474f]">
                    <span>Item terhubung:</span>
                    <span className="font-bold bg-[#f3f3f6] px-2 py-0.5 rounded-md text-[#1a1c1e]">
                      {linkedCount} {isBarang ? 'produk' : 'layanan'}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="col-span-full text-center py-8 bg-white rounded-2xl border border-dashed border-[#c2c7d1]">
                <span className="material-symbols-outlined text-[40px] text-[#727780] opacity-40 mb-1">
                  category
                </span>
                <p className="font-headline-md text-[14px] font-bold text-[#1a1c1e]">
                  Tidak ada kategori terdaftar
                </p>
                <p className="font-body-md text-[12px] text-[#727780] mt-0.5">
                  Klik tombol "+ Tambah Kategori" di atas untuk membuat kategori baru.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#c2c7d1] bg-[#f9f9fc] flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1a1c1e] text-white rounded-xl font-label-sm text-[13px] font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
