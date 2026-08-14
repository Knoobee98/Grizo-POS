import React, { useState, useEffect } from 'react';
import { TabType, Product, Category, CartItem, Customer, Transaction, CashierStat, Employee, AttendanceRecord, StoreConfig, DEFAULT_STORE_CONFIG } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_CASHIERS,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE
} from './data/mockData';

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

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('sales');
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('grizo_pos_session') !== null;
  });

  // Core Data States (stored in localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('grizo_pos_products');
    if (saved) {
      const parsed: Product[] = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].price < 1000) {
        return INITIAL_PRODUCTS;
      }
      return parsed;
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('grizo_pos_categories');
    if (saved) {
      return JSON.parse(saved);
    }
    return INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('grizo_pos_transactions');
    if (saved) {
      const parsed: Transaction[] = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].total < 1000) {
        return INITIAL_TRANSACTIONS;
      }
      return parsed;
    }
    return INITIAL_TRANSACTIONS;
  });

  const [cashierStats, setCashierStats] = useState<CashierStat[]>(() => {
    const saved = localStorage.getItem('grizo_pos_cashier_stats');
    if (saved) {
      const parsed: CashierStat[] = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].totalSales < 1000) {
        return INITIAL_CASHIERS;
      }
      return parsed;
    }
    return INITIAL_CASHIERS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('grizo_pos_employees');
    if (saved) {
      const parsed: Employee[] = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].totalSalesToday > 0 && parsed[0].totalSalesToday < 1000) {
        return INITIAL_EMPLOYEES;
      }
      return parsed;
    }
    return INITIAL_EMPLOYEES;
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('grizo_pos_attendance_logs');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

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
    // Sanitize state to prevent modal or cart leakage across roles
    setCart([]);
    setDiscountAmount(0);
    setSelectedCustomer(null);
    setIsPaymentModalOpen(false);
    setActiveReceipt(null);
    setSelectedDetailTransaction(null);
    setIsScannerOpen(false);
    setIsNotificationsOpen(false);
    setIsHelpOpen(false);
  };

  // Active Cart State
  const [cart, setCart] = useState<CartItem[]>(() => [
    {
      product: INITIAL_PRODUCTS[0], // Basic Cotton Tee - White
      quantity: 2
    },
    {
      product: INITIAL_PRODUCTS[1], // Classic Slim Denim Jeans
      quantity: 1
    }
  ]);

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('grizo_pos_store_config');
    return saved ? JSON.parse(saved) : DEFAULT_STORE_CONFIG;
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(50000);
  const [taxRate, setTaxRate] = useState<number>(() => storeConfig.taxRate || 0.085);
  const [ticketNumberCount, setTicketNumberCount] = useState<number>(4092);

  const handleSaveConfig = (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    setTaxRate(newConfig.taxRate);
    localStorage.setItem('grizo_pos_store_config', JSON.stringify(newConfig));
  };

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
      // Ignore when typing inside input or textarea
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

  // Save changes to local storage with QuotaExceededError protection
  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_products', JSON.stringify(products));
    } catch (err) {
      console.warn('Storage quota exceeded when saving products:', err);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_categories', JSON.stringify(categories));
    } catch (err) {
      console.warn('Storage quota exceeded when saving categories:', err);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_transactions', JSON.stringify(transactions));
    } catch (err) {
      console.warn('Storage quota exceeded when saving transactions:', err);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_cashier_stats', JSON.stringify(cashierStats));
    } catch (err) {
      console.warn('Storage quota exceeded when saving cashier stats:', err);
    }
  }, [cashierStats]);

  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_employees', JSON.stringify(employees));
    } catch (err) {
      console.warn('Storage quota exceeded when saving employees:', err);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_attendance_logs', JSON.stringify(attendanceLogs));
    } catch (err) {
      console.warn('Storage quota exceeded when saving attendance logs:', err);
    }
  }, [attendanceLogs]);

  // Ensure non-cashier roles (Admin & Store Manager) cannot remain on sales tab
  useEffect(() => {
    if (currentCashier && currentCashier.role !== 'Cashier' && activeTab === 'sales') {
      setActiveTab('dashboard');
    }
  }, [currentCashier, activeTab]);

  // Attendance Handlers
  const handleCheckIn = (employeeId: string, notes?: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      employeeName: emp ? emp.name : 'Unknown Staff',
      date: todayStr,
      checkInTime: timeStr,
      status: 'Checked In',
      notes: notes || 'Masuk Shift Regular'
    };

    setAttendanceLogs((prev) => [newRecord, ...prev]);

    // Update employee status
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, status: 'Active' } : e))
    );
  };

  const handleCheckOut = (employeeId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setAttendanceLogs((prev) =>
      prev.map((log) => {
        if (log.employeeId === employeeId && log.date === todayStr) {
          return {
            ...log,
            checkOutTime: timeStr,
            status: 'Checked Out'
          };
        }
        return log;
      })
    );

    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, status: 'Offline' } : e))
    );
  };

  const handleToggleBreak = (employeeId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];

    setAttendanceLogs((prev) =>
      prev.map((log) => {
        if (log.employeeId === employeeId && log.date === todayStr) {
          const nextStatus = log.status === 'On Break' ? 'Checked In' : 'On Break';
          return { ...log, status: nextStatus };
        }
        return log;
      })
    );

    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === employeeId) {
          const nextStatus = e.status === 'On Break' ? 'Active' : 'On Break';
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  // Cart Operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleSaveOrder = () => {
    if (cart.length === 0) return;
    alert(`Order #${ticketNumberCount} saved safely. You can retrieve saved orders anytime.`);
  };

  const handleVoidOrder = () => {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to void this current order?')) {
      setCart([]);
      setDiscountAmount(0);
      setSelectedCustomer(null);
    }
  };

  // Checkout Payment Complete
  const handleCompleteTransaction = (newTx: Transaction) => {
    // Attach cashierId key for data isolation
    const isolatedTx: Transaction = {
      ...newTx,
      cashierId: currentCashier.cashierKey
    };

    // 1. Add transaction
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
          // Restore product stock
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
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Category Handlers
  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  // Reset demo data
  const handleResetDemoData = () => {
    localStorage.removeItem('grizo_pos_products');
    localStorage.removeItem('grizo_pos_categories');
    localStorage.removeItem('grizo_pos_transactions');
    localStorage.removeItem('grizo_pos_cashier_stats');
    localStorage.removeItem('grizo_pos_employees');
    localStorage.removeItem('grizo_pos_attendance_logs');
    localStorage.removeItem('grizo_pos_store_config');
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setCashierStats(INITIAL_CASHIERS);
    setEmployees(INITIAL_EMPLOYEES);
    setAttendanceLogs(INITIAL_ATTENDANCE);
    setStoreConfig(DEFAULT_STORE_CONFIG);
    setTaxRate(DEFAULT_STORE_CONFIG.taxRate);
    setCurrentCashier(INITIAL_EMPLOYEES[0]);
  };

  // Calculations for active order
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const calculatedTax = Math.round((subtotal - discountAmount) * taxRate * 100) / 100;
  const finalTax = Math.max(0, calculatedTax);
  const grandTotal = Math.max(0, subtotal - discountAmount + finalTax);

  return (
    <>
      {!isAuthenticated ? (
        <LoginScreen employees={employees} onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="bg-[#f9f9fc] text-[#1a1c1e] h-screen w-screen overflow-hidden flex font-body-md select-none">
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
            {/* Top Header Navigation */}
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
              onSaveOrder={handleSaveOrder}
              onVoidOrder={handleVoidOrder}
              onCheckout={() => setIsPaymentModalOpen(true)}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              categories={categories}
              currencySymbol={storeConfig.currencySymbol}
              onAddProduct={handleAddProduct}
              onUpdateStock={handleUpdateStock}
              onDeleteProduct={handleDeleteProduct}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              currentCashier={currentCashier}
              transactions={transactions}
              cashierStats={cashierStats}
              currencySymbol={storeConfig.currencySymbol}
              onSelectTransaction={setSelectedDetailTransaction}
              onExportReport={() => {
                const csvContent =
                  'data:text/csv;charset=utf-8,' +
                  ['Ticket,Date,Time,Cashier,Payment,Status,Total'].join(',') +
                  '\n' +
                  transactions
                    .map(
                      (t) =>
                        `${t.ticketNo},${t.date},${t.time},${t.cashierName},${t.paymentMethod},${t.status},${t.total}`
                    )
                    .join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `grizo_pos_sales_report_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              currentCashier={currentCashier}
              employees={employees}
              attendanceLogs={attendanceLogs}
              storeConfig={storeConfig}
              onNavigate={setActiveTab}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onToggleBreak={handleToggleBreak}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesView
              employees={employees}
              currentCashier={currentCashier}
              currencySymbol={storeConfig.currencySymbol}
              onSelectCashier={setCurrentCashier}
              onAddEmployee={(emp) => setEmployees((prev) => [emp, ...prev])}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              storeConfig={storeConfig}
              onSaveConfig={handleSaveConfig}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      {isPaymentModalOpen && (
        <PaymentModal
          cart={cart}
          subtotal={subtotal}
          tax={finalTax}
          discount={discountAmount}
          total={grandTotal}
          ticketNo={`#${ticketNumberCount}`}
          cashierName={currentCashier.name}
          selectedCustomer={selectedCustomer}
          currencySymbol={storeConfig.currencySymbol}
          onClose={() => setIsPaymentModalOpen(false)}
          onCompleteTransaction={handleCompleteTransaction}
        />
      )}

      {activeReceipt && (
        <ReceiptModal
          transaction={activeReceipt}
          storeConfig={storeConfig}
          onClose={() => setActiveReceipt(null)}
          onNewSale={() => setActiveTab('sales')}
        />
      )}

      {selectedDetailTransaction && (
        <TransactionDetailModal
          transaction={selectedDetailTransaction}
          currencySymbol={storeConfig.currencySymbol}
          onClose={() => setSelectedDetailTransaction(null)}
          onRefund={handleRefundTransaction}
          onPrintReceipt={(tx) => {
            setSelectedDetailTransaction(null);
            setActiveReceipt(tx);
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

