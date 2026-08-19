export type TabType = 'dashboard' | 'sales' | 'inventory' | 'reports' | 'attendance' | 'employees' | 'settings';

export type ItemType = 'Barang' | 'Jasa';

export interface Category {
  id: string;
  name: string;
  type: ItemType; // Separation between Goods and Services
  description?: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  sku: string;
  category: string;
  itemType?: ItemType; // 'Barang' or 'Jasa'
  price: number;
  stock: number;
  lowStockThreshold?: number;
  image: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount?: number; // dollar amount off or percentage
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  loyaltyPoints?: number;
  totalSpent?: number;
}

export interface Transaction {
  id: string;
  ticketNo: string;
  time: string; // e.g. "14:23"
  date: string; // e.g. "2026-08-12"
  cashierId: string; // 'kasir-1', 'kasir-2', etc. for isolation
  cashierName: string;
  customerName?: string;
  paymentMethod: 'Credit Card' | 'Cash' | 'Mobile Pay' | 'Gift Card' | 'Split' | 'N/A';
  status: 'COMPLETED' | 'REFUNDED' | 'VOID' | 'HELD';
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountTendered?: number;
  changeDue?: number;
}

export interface CashierStat {
  id: string;
  name: string;
  avatarLetter: string;
  txnsCount: number;
  totalSales: number;
  colorClass: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'Cashier' | 'Admin' | 'Store Manager';
  email: string;
  phone: string;
  status: 'Active' | 'On Break' | 'Offline';
  totalSalesToday: number;
  txnsToday: number;
  avatarUrl?: string;
  qrCode?: string;
  cashierKey: string;
  pin?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // e.g. "2026-08-12"
  checkInTime: string; // e.g. "08:00"
  checkOutTime?: string; // e.g. "17:00"
  status: 'Checked In' | 'On Break' | 'Checked Out' | 'Late';
  notes?: string;
  totalHours?: number;
}

export interface UserSession {
  id: string;
  name: string;
  role: 'Admin' | 'Cashier';
  cashierKey: 'kasir1' | 'kasir2' | 'admin';
}

export interface StoreConfig {
  storeName: string;
  storeBranch: string;
  address: string;
  phone: string;
  taxRate: number; // e.g. 0.085 for 8.5%
  currencySymbol: string; // e.g. '$' or 'Rp'
  receiptFooter: string;
  autoPrintReceipt: boolean;
  paperSize: '58mm' | '80mm' | 'A4';
  enableSound: boolean;
  workShiftStart?: string; // e.g. '08:00'
  workShiftEnd?: string;   // e.g. '17:00'
  lateToleranceMinutes?: number; // e.g. 15
}

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'Grizo Store',
  storeBranch: 'Main Branch Terminal #1',
  address: 'Jl. Ahmad Yani No. 123, Jakarta',
  phone: '+62 812-3456-7890',
  taxRate: 0.085,
  currencySymbol: 'Rp',
  receiptFooter: 'Terima kasih telah berbelanja di Grizo POS! Barang yang sudah dibeli dapat ditukar max 3 hari.',
  autoPrintReceipt: true,
  paperSize: '80mm',
  enableSound: true,
  workShiftStart: '08:00',
  workShiftEnd: '17:00',
  lateToleranceMinutes: 15
};

