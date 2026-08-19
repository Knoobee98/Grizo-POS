import React, { useState, useEffect } from 'react';
import { TabType, Product, Category, Transaction, Employee, StoreConfig } from './types';

import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SalesView } from './components/SalesView';
import { ReportsView } from './components/ReportsView';
import { InventoryView } from './components/InventoryView';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { SettingsView } from './components/SettingsView';
import { AttendanceView } from './components/AttendanceView';

import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { ScannerModal } from './components/ScannerModal';
import { LoginScreen } from './components/LoginScreen';
import { NotificationsModal, NotificationItem } from './components/NotificationsModal';
import { HelpModal } from './components/HelpModal';

import { usePOSStore } from './hooks/usePOSStore';
import { useCart } from './hooks/useCart';
import { useAttendance } from './hooks/useAttendance';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('grizo_pos_session') !== null;
  });

  // Custom Hooks Store Initialization
  const {
    products,
    setProducts,
    categories,
    setCategories,
    transactions,
    setTransactions,
    cashierStats,
    setCashierStats,
    employees,
    setEmployees,
    storeConfig,
    taxRate,
    handleSaveConfig
  } = usePOSStore();

  const {
    cart,
    setCart,
    selectedCustomer,
    setSelectedCustomer,
    discountAmount,
    setDiscountAmount,
    ticketNumberCount,
    setTicketNumberCount,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleSaveOrder,
    handleVoidOrder,
    resetCart
  } = useCart(4092);

  const {
    attendanceLogs,
    handleCheckIn: performCheckIn,
    handleCheckOut: performCheckOut,
    handleToggleBreak: performToggleBreak
  } = useAttendance(employees);

  // Active Cashier
  const [currentCashier, setCurrentCashier] = useState<Employee>(() => {
    const savedSession = localStorage.getItem('grizo_pos_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        const match = employees.find((e) => e.id === parsed.id || e.cashierKey === parsed.cashierKey);
        if (match) return match;
      } catch (e) {
        console.error(e);
      }
    }
    return employees[0];
  });

  // Saved Session Check for Initial Tab Navigation
  const initialSessionUser = (() => {
    const savedSession = localStorage.getItem('grizo_pos_session');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        return null;
      }
    }
    return null;
  })();

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (initialSessionUser && initialSessionUser.role !== 'Cashier') {
      return 'dashboard';
    }
    return 'sales';
  });

  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);

  // Modal & Popup States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);
  const [selectedDetailTransaction, setSelectedDetailTransaction] = useState<Transaction | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => [
    {
      id: 'n-1',
      type: 'stock',
      title: 'Stok Kritis: Kopi Kapal Api 165g',
      message: 'Sisa stok kurang dari 10 unit (tersisa 8 unit). Harap lakukan pengadaan stok.',
      time: '10 menit lalu',
      isRead: false,
      actionTab: 'inventory',
      actionLabel: 'Restok Inventaris'
    },
    {
      id: 'n-2',
      type: 'attendance',
      title: 'Kasir Active Check-In',
      message: 'Kasir 1 aktif melayani di terminal POS toko.',
      time: '07:30 WIB',
      isRead: false,
      actionTab: 'attendance',
      actionLabel: 'Cek Absensi'
    },
    {
      id: 'n-3',
      type: 'sale',
      title: 'Pencapaian Target Penjualan',
      message: 'Total omset pendapatan toko hari ini melampaui target harian.',
      time: 'Hari ini',
      isRead: true,
      actionTab: 'reports',
      actionLabel: 'Lihat Laporan'
    },
    {
      id: 'n-4',
      type: 'system',
      title: 'Printer Thermal Terhubung',
      message: 'Koneksi pencetak nota kasir siap digunakan.',
      time: 'Kemarin',
      isRead: true,
      actionTab: 'settings',
      actionLabel: 'Pengaturan'
    }
  ]);

  const handleLoginSuccess = (loggedInCashier: Employee) => {
    setCurrentCashier(loggedInCashier);
    setIsAuthenticated(true);
    localStorage.setItem('grizo_pos_session', JSON.stringify(loggedInCashier));
    if (loggedInCashier.role !== 'Cashier') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('sales');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('grizo_pos_session');
    resetCart();
    setIsPaymentModalOpen(false);
    setActiveReceipt(null);
    setSelectedDetailTransaction(null);
    setIsScannerOpen(false);
    setIsNotificationsOpen(false);
    setIsHelpOpen(false);
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        if (e.key === 'Escape') {
          setIsPaymentModalOpen(false);
          setIsScannerOpen(false);
          setIsNotificationsOpen(false);
          setIsHelpOpen(false);
        }
        return;
      }

      if (e.key === 'F1') {
        e.preventDefault();
        setActiveTab('sales');
      } else if (e.key === 'F2') {
        e.preventDefault();
        setIsScannerOpen(true);
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (cart.length > 0) {
          setIsPaymentModalOpen(true);
        }
      } else if (e.key === 'Escape') {
        setIsPaymentModalOpen(false);
        setIsScannerOpen(false);
        setIsNotificationsOpen(false);
        setIsHelpOpen(false);
        setSelectedDetailTransaction(null);
        setActiveReceipt(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart.length]);

  // Ensure non-cashier roles (Admin & Store Manager) are redirected to dashboard if on sales tab
  useEffect(() => {
    if (currentCashier && currentCashier.role !== 'Cashier' && activeTab === 'sales') {
      setActiveTab('dashboard');
    }
  }, [currentCashier, activeTab]);

  // Attendance Handlers wrapping hook + employee status updates
  const handleCheckIn = async (employeeId: string, notes?: string) => {
    await performCheckIn(employeeId, notes);
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, status: 'Active' } : e))
    );
  };

  const handleCheckOut = async (employeeId: string) => {
    await performCheckOut(employeeId);
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, status: 'Offline' } : e))
    );
  };

  const handleToggleBreak = async (employeeId: string) => {
    await performToggleBreak(employeeId);
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === employeeId) {
          return { ...e, status: e.status === 'On Break' ? 'Active' : 'On Break' };
        }
        return e;
      })
    );
  };

  // Checkout Payment Complete Handler
  const handleCompleteTransaction = (newTx: Transaction) => {
    const isolatedTx: Transaction = {
      ...newTx,
      cashierId: currentCashier.cashierKey || currentCashier.id
    };

    // 1. Add to transaction list
    setTransactions((prev) => [isolatedTx, ...prev]);

    // 2. Reduce product stock
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = isolatedTx.items.find((item) => item.productId === prod.id);
        if (cartMatch) {
          const updatedStock = Math.max(0, prod.stock - cartMatch.quantity);
          return { ...prod, stock: updatedStock };
        }
        return prod;
      })
    );

    // 3. Update Cashier Stats & Employee Stats
    setCashierStats((prev) =>
      prev.map((stat) => {
        if (stat.name.toLowerCase().includes(isolatedTx.cashierName.toLowerCase())) {
          return {
            ...stat,
            txnsCount: stat.txnsCount + 1,
            totalSales: stat.totalSales + isolatedTx.total
          };
        }
        return stat;
      })
    );

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === currentCashier.id) {
          return {
            ...emp,
            txnsToday: emp.txnsToday + 1,
            totalSalesToday: emp.totalSalesToday + isolatedTx.total
          };
        }
        return emp;
      })
    );

    // Close payment modal & show receipt modal
    setIsPaymentModalOpen(false);
    setActiveReceipt(isolatedTx);

    // Reset current order
    setCart([]);
    setDiscountAmount(0);
    setSelectedCustomer(null);
    setTicketNumberCount((prev) => prev + 1);
  };

  // Refund Transaction
  const handleRefundTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === txId) {
          tx.items.forEach((item) => {
            setProducts((pList) =>
              pList.map((p) =>
                p.id === item.productId ? { ...p, stock: p.stock + item.quantity } : p
              )
            );
          });
          return { ...tx, status: 'REFUNDED' };
        }
        return tx;
      })
    );
  };

  // Inventory Handlers
  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [created, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Category Handlers
  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const created: Category = {
      ...newCat,
      id: `cat-${Date.now()}`
    };
    setCategories((prev) => [...prev, created]);
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;

    const inUseCount = products.filter((p) => p.category === cat.name).length;
    if (inUseCount > 0) {
      alert(`Cannot delete category "${cat.name}" because it is currently assigned to ${inUseCount} product(s). Please reassign those products first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== catId));
    }
  };

  // Employee Handlers
  const handleAddEmployee = (newEmp: Omit<Employee, 'id' | 'totalSalesToday' | 'txnsToday' | 'status'>) => {
    const created: Employee = {
      ...newEmp,
      id: `emp-${Date.now()}`,
      status: 'Offline',
      totalSalesToday: 0,
      txnsToday: 0
    };
    setEmployees((prev) => [...prev, created]);
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e))
    );
  };

  const handleDeleteEmployee = (empId: string) => {
    const isSelfDelete = currentCashier.id === empId;
    const confirmMsg = isSelfDelete
      ? 'Apakah Anda yakin ingin menghapus akun Anda sendiri? Anda akan otomatis dikeluarkan ke halaman login.'
      : 'Apakah Anda yakin ingin menghapus karyawan ini?';

    if (confirm(confirmMsg)) {
      setEmployees((prev) => prev.filter((e) => e.id !== empId));
      if (isSelfDelete) {
        handleLogout();
      }
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} employees={employees} />
      ) : (
        <div className="flex h-screen w-screen overflow-hidden bg-[#f9f9fc] font-sans antialiased text-[#1a1c1e]">
          {/* Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onNewSale={() => {
              setActiveTab('sales');
            }}
            isOpenMobile={isOpenMobileMenu}
            onCloseMobile={() => setIsOpenMobileMenu(false)}
            onLogout={handleLogout}
            currentCashier={currentCashier}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#f9f9fc] relative h-screen overflow-hidden">
            <TopBar
              currentCashier={currentCashier}
              onOpenMobileMenu={() => setIsOpenMobileMenu(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenSettings={() => setActiveTab('settings')}
              onOpenHelp={() => setIsHelpOpen(true)}
              unreadNotificationsCount={notifications.filter((n) => !n.isRead).length}
            />

            {/* View Switcher Container */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
              {activeTab === 'dashboard' && (
                <DashboardView
                  products={products}
                  transactions={transactions}
                  attendanceLogs={attendanceLogs}
                  currencySymbol={storeConfig.currencySymbol}
                  onNavigate={setActiveTab}
                  currentCashier={currentCashier}
                />
              )}

              {activeTab === 'sales' && currentCashier?.role === 'Cashier' && (
                <SalesView
                  products={products}
                  cart={cart}
                  ticketNo={`#${ticketNumberCount}`}
                  selectedCustomer={selectedCustomer}
                  discountAmount={discountAmount}
                  taxRate={taxRate}
                  currentCashier={currentCashier}
                  currencySymbol={storeConfig.currencySymbol}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                  onSelectCustomer={setSelectedCustomer}
                  onApplyDiscount={setDiscountAmount}
                  onCheckout={() => setIsPaymentModalOpen(true)}
                  onSaveOrder={handleSaveOrder}
                  onVoidOrder={handleVoidOrder}
                  onOpenScanner={() => setIsScannerOpen(true)}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  transactions={transactions}
                  cashierStats={cashierStats}
                  employees={employees}
                  currentCashier={currentCashier}
                  currencySymbol={storeConfig.currencySymbol}
                  onSelectTransaction={(tx) => setSelectedDetailTransaction(tx)}
                  onRefundTransaction={handleRefundTransaction}
                />
              )}

              {activeTab === 'inventory' && (
                <InventoryView
                  products={products}
                  categories={categories}
                  currencySymbol={storeConfig.currencySymbol}
                  currentCashier={currentCashier}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onNavigateHelp={() => setIsHelpOpen(true)}
                />
              )}

              {activeTab === 'employees' && (
                <EmployeesView
                  employees={employees}
                  currentCashier={currentCashier}
                  currencySymbol={storeConfig.currencySymbol}
                  onAddEmployee={handleAddEmployee}
                  onUpdateEmployee={handleUpdateEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                />
              )}

              {activeTab === 'attendance' && (
                <AttendanceView
                  attendanceLogs={attendanceLogs}
                  employees={employees}
                  currentCashier={currentCashier}
                  storeConfig={storeConfig}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                  onToggleBreak={handleToggleBreak}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView storeConfig={storeConfig} onSaveConfig={handleSaveConfig} />
              )}
            </div>
          </main>

          {/* Modal Popups */}
          {isPaymentModalOpen && (
            <PaymentModal
              cart={cart}
              ticketNo={`#${ticketNumberCount}`}
              selectedCustomer={selectedCustomer}
              discountAmount={discountAmount}
              taxRate={taxRate}
              currentCashier={currentCashier}
              currencySymbol={storeConfig.currencySymbol}
              onClose={() => setIsPaymentModalOpen(false)}
              onComplete={handleCompleteTransaction}
            />
          )}

          {activeReceipt && (
            <ReceiptModal
              transaction={activeReceipt}
              storeConfig={storeConfig}
              onClose={() => setActiveReceipt(null)}
            />
          )}

          {selectedDetailTransaction && (
            <TransactionDetailModal
              transaction={selectedDetailTransaction}
              currencySymbol={storeConfig.currencySymbol}
              onClose={() => setSelectedDetailTransaction(null)}
              onRefund={(txId) => {
                handleRefundTransaction(txId);
                setSelectedDetailTransaction(null);
              }}
            />
          )}

          {isScannerOpen && (
            <ScannerModal
              products={products}
              onScanProduct={handleAddToCart}
              onClose={() => setIsScannerOpen(false)}
            />
          )}

          {isNotificationsOpen && (
            <NotificationsModal
              products={products}
              notifications={notifications}
              onClose={() => setIsNotificationsOpen(false)}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onMarkAsRead={handleMarkNotificationAsRead}
              onClearAll={handleClearAllNotifications}
              onNavigate={(tab) => {
                setActiveTab(tab);
                setIsNotificationsOpen(false);
              }}
            />
          )}

          {isHelpOpen && (
            <HelpModal currentCashier={currentCashier} onClose={() => setIsHelpOpen(false)} />
          )}
        </div>
      )}
    </>
  );
}
