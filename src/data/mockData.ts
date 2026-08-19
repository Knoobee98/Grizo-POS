import { Product, Category, Transaction, CashierStat, Employee, Customer, AttendanceRecord } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Coffee Beans', type: 'Barang', description: 'Biji kopi sangrai pilihan', icon: 'coffee' },
  { id: 'cat-2', name: 'Tea', type: 'Barang', description: 'Koleksi teh herbal & daun segar', icon: 'emoji_food_beverage' },
  { id: 'cat-3', name: 'Apparel', type: 'Barang', description: 'Pakaian, kaos & apron toko', icon: 'checkroom' },
  { id: 'cat-4', name: 'Accessories', type: 'Barang', description: 'Aksesoris, tas & tumbler', icon: 'style' },
  { id: 'cat-5', name: 'Footwear', type: 'Barang', description: 'Sepatu & alas kaki', icon: 'steps' },
  { id: 'cat-6', name: 'General Merchandise', type: 'Barang', description: 'Barang umum toko', icon: 'storefront' },
  { id: 'cat-7', name: 'Jasa Seduh Barista', type: 'Jasa', description: 'Layanan manual brew V60, Aeropress & Espresso Bar', icon: 'local_cafe' },
  { id: 'cat-8', name: 'Jasa Roasting Kopi', type: 'Jasa', description: 'Layanan sangrai green bean custom batch', icon: 'skillet' },
  { id: 'cat-9', name: 'Jasa Servis Mesin', type: 'Jasa', description: 'Perawatan & perbaikan mesin espresso & grinder', icon: 'build' },
  { id: 'cat-10', name: 'Jasa Cuci & Treatment', type: 'Jasa', description: 'Perawatan deep clean sepatu & kain pilihan', icon: 'dry_cleaning' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Basic Cotton Tee - White',
    sku: 'TS-WHT-M',
    category: 'Apparel',
    itemType: 'Barang',
    price: 150000,
    stock: 92,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    description: '100% Organic combed cotton crewneck t-shirt in crisp white.'
  },
  {
    id: 'prod-2',
    name: 'Classic Slim Denim Jeans - Dark Wash',
    sku: 'DN-DKW-32',
    category: 'Apparel',
    itemType: 'Barang',
    price: 450000,
    stock: 14,
    lowStockThreshold: 15,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80',
    description: 'Stretch denim slim fit jeans with heavy duty stitching.'
  },
  {
    id: 'prod-3',
    name: 'Premium Leather Belt - Black',
    sku: 'BT-BLK-L',
    category: 'Accessories',
    itemType: 'Barang',
    price: 250000,
    stock: 3,
    lowStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&auto=format&fit=crop&q=80',
    description: 'Full-grain Italian leather belt with solid brass buckle.'
  },
  {
    id: 'prod-4',
    name: 'Canvas Tote Bag - Natural',
    sku: 'TB-NAT-01',
    category: 'Accessories',
    itemType: 'Barang',
    price: 95000,
    stock: 42,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=500&auto=format&fit=crop&q=80',
    description: 'Heavy duty 16oz cotton canvas tote with interior zip pocket.'
  },
  {
    id: 'prod-5',
    name: 'Colombian Supremo Roast',
    subtitle: '250g Whole Bean',
    sku: 'COF-COL-250',
    category: 'Coffee Beans',
    itemType: 'Barang',
    price: 125000,
    stock: 145,
    lowStockThreshold: 20,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80',
    description: 'Single origin roasted coffee beans with notes of caramel and red apple.'
  },
  {
    id: 'prod-6',
    name: 'Nomad Travel Tumbler',
    subtitle: '16oz / Matte Black',
    sku: 'MUG-NOM-16B',
    category: 'Accessories',
    itemType: 'Barang',
    price: 160000,
    stock: 4,
    lowStockThreshold: 8,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80',
    description: 'Double-wall vacuum insulated stainless steel travel tumbler.'
  },
  {
    id: 'prod-7',
    name: 'Jasmine Pearl Green Tea',
    subtitle: 'Out of Stock',
    sku: 'TEA-JAS-50G',
    category: 'Tea',
    itemType: 'Barang',
    price: 85000,
    stock: 0,
    lowStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    description: 'Hand-rolled dragon pearls scented with fresh jasmine blossoms.'
  },
  {
    id: 'prod-8',
    name: 'Heavy Canvas Apron',
    subtitle: 'One Size / Olive',
    sku: 'APR-CAN-OLV',
    category: 'Apparel',
    itemType: 'Barang',
    price: 300000,
    stock: 28,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80',
    description: 'Barista & workshop canvas apron with quick-release harness straps.'
  },
  {
    id: 'prod-9',
    name: 'Everyday Sport Sneakers',
    subtitle: 'Size 10 / Grey',
    sku: 'FW-RUN-10',
    category: 'Footwear',
    itemType: 'Barang',
    price: 750000,
    stock: 12,
    lowStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    description: 'Lightweight breathable mesh athletic shoes.'
  },
  {
    id: 'prod-10',
    name: 'Minimalist Leather Cardholder',
    sku: 'WL-MIN-BRN',
    category: 'Accessories',
    itemType: 'Barang',
    price: 180000,
    stock: 18,
    lowStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80',
    description: 'Slim vegetable-tanned leather pocket card holder.'
  },
  // Default Services (Jasa)
  {
    id: 'prod-srv-1',
    name: 'Jasa Manual Brew V60 / Kalita',
    subtitle: 'Seduh Fresh Barista',
    sku: 'SRV-BRW-V60',
    category: 'Jasa Seduh Barista',
    itemType: 'Jasa',
    price: 35000,
    stock: 999,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    description: 'Layanan penyeduhan kopi manual V60 dengan beans pilihan barista.'
  },
  {
    id: 'prod-srv-2',
    name: 'Jasa Roasting Kopi Green Beans (Per Kg)',
    subtitle: 'Custom Roast Profile',
    sku: 'SRV-RST-1KG',
    category: 'Jasa Roasting Kopi',
    itemType: 'Jasa',
    price: 50000,
    stock: 999,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500&auto=format&fit=crop&q=80',
    description: 'Jasa sangrai biji kopi mentah dengan mesin roaster profesional.'
  },
  {
    id: 'prod-srv-3',
    name: 'Jasa Servis & Descaling Mesin Espresso',
    subtitle: 'Paket Perawatan Rutin',
    sku: 'SRV-MCH-SVC',
    category: 'Jasa Servis Mesin',
    itemType: 'Jasa',
    price: 250000,
    stock: 999,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    description: 'Pembersihan kerak kalk, sanitasi boiler & kalibrasi tekanan mesin.'
  },
  {
    id: 'prod-srv-4',
    name: 'Jasa Deep Cleaning & Care Sepatu',
    subtitle: 'Layanan Treatment Sepatu',
    sku: 'SRV-SHN-CLN',
    category: 'Jasa Cuci & Treatment',
    itemType: 'Jasa',
    price: 75000,
    stock: 999,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80',
    description: 'Pembersihan menyeluruh upper, midsole & insole sepatu.'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'trx-8902',
    ticketNo: '#TRX-8902',
    time: '14:23',
    date: '2026-08-12',
    cashierId: 'kasir1',
    cashierName: 'Kasir 1 (Alice S.)',
    customerName: 'Sarah Jenkins',
    paymentMethod: 'Credit Card',
    status: 'COMPLETED',
    items: [
      { productId: 'prod-1', productName: 'Basic Cotton Tee - White', sku: 'TS-WHT-M', quantity: 2, unitPrice: 150000, subtotal: 300000 },
      { productId: 'prod-2', productName: 'Classic Slim Denim Jeans - Dark Wash', sku: 'DN-DKW-32', quantity: 1, unitPrice: 450000, subtotal: 450000 }
    ],
    subtotal: 750000,
    tax: 63750,
    discount: 50000,
    total: 763750
  },
  {
    id: 'trx-8901',
    ticketNo: '#TRX-8901',
    time: '14:15',
    date: '2026-08-12',
    cashierId: 'kasir2',
    cashierName: 'Kasir 2 (Bob J.)',
    customerName: 'Walk-in Customer',
    paymentMethod: 'Cash',
    status: 'COMPLETED',
    items: [
      { productId: 'prod-8', productName: 'Heavy Canvas Apron', sku: 'APR-CAN-OLV', quantity: 1, unitPrice: 300000, subtotal: 300000 }
    ],
    subtotal: 300000,
    tax: 25500,
    discount: 0,
    total: 325500,
    amountTendered: 350000,
    changeDue: 24500
  },
  {
    id: 'trx-8900',
    ticketNo: '#TRX-8900',
    time: '14:02',
    date: '2026-08-12',
    cashierId: 'kasir1',
    cashierName: 'Kasir 1 (Alice S.)',
    customerName: 'Michael Chang',
    paymentMethod: 'N/A',
    status: 'REFUNDED',
    items: [
      { productId: 'prod-6', productName: 'Nomad Travel Tumbler', sku: 'MUG-NOM-16B', quantity: 1, unitPrice: 160000, subtotal: 160000 }
    ],
    subtotal: 160000,
    tax: 0,
    discount: 0,
    total: -160000
  },
  {
    id: 'trx-8899',
    ticketNo: '#TRX-8899',
    time: '13:55',
    date: '2026-08-12',
    cashierId: 'kasir1',
    cashierName: 'Kasir 1 (Alice S.)',
    customerName: 'Elena Rostova',
    paymentMethod: 'Mobile Pay',
    status: 'COMPLETED',
    items: [
      { productId: 'prod-2', productName: 'Classic Slim Denim Jeans - Dark Wash', sku: 'DN-DKW-32', quantity: 1, unitPrice: 450000, subtotal: 450000 },
      { productId: 'prod-5', productName: 'Colombian Supremo Roast', sku: 'COF-COL-250', quantity: 1, unitPrice: 125000, subtotal: 125000 }
    ],
    subtotal: 575000,
    tax: 48875,
    discount: 25000,
    total: 598875
  },
  {
    id: 'trx-8898',
    ticketNo: '#TRX-8898',
    time: '13:40',
    date: '2026-08-12',
    cashierId: 'kasir2',
    cashierName: 'Kasir 2 (Bob J.)',
    customerName: 'Walk-in Customer',
    paymentMethod: 'Credit Card',
    status: 'COMPLETED',
    items: [
      { productId: 'prod-9', productName: 'Everyday Sport Sneakers', sku: 'FW-RUN-10', quantity: 1, unitPrice: 750000, subtotal: 750000 },
      { productId: 'prod-2', productName: 'Classic Slim Denim Jeans - Dark Wash', sku: 'DN-DKW-32', quantity: 1, unitPrice: 450000, subtotal: 450000 },
      { productId: 'prod-3', productName: 'Premium Leather Belt - Black', sku: 'BT-BLK-L', quantity: 1, unitPrice: 250000, subtotal: 250000 }
    ],
    subtotal: 1450000,
    tax: 123250,
    discount: 100000,
    total: 1473250
  }
];

export const INITIAL_CASHIERS: CashierStat[] = [
  {
    id: 'cash-1',
    name: 'Kasir 1 (Alice Smith)',
    avatarLetter: '1',
    txnsCount: 142,
    totalSales: 15450000,
    colorClass: 'bg-[#0f4c81] text-[#8ebdf9]'
  },
  {
    id: 'cash-2',
    name: 'Kasir 2 (Bob Jones)',
    avatarLetter: '2',
    txnsCount: 110,
    totalSales: 12100000,
    colorClass: 'bg-[#76f4e0] text-[#006f63]'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Kasir 1 (Alice Smith)',
    role: 'Cashier',
    email: 'kasir1@grizopos.com',
    phone: '+62 812-3456-7891',
    status: 'Active',
    totalSalesToday: 15450000,
    txnsToday: 142,
    cashierKey: 'kasir1',
    pin: '1111',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    qrCode: 'GRIZO-EMP-emp-1-kasir1'
  },
  {
    id: 'emp-2',
    name: 'Kasir 2 (Bob Jones)',
    role: 'Cashier',
    email: 'kasir2@grizopos.com',
    phone: '+62 812-3456-7892',
    status: 'Active',
    totalSalesToday: 12100000,
    txnsToday: 110,
    cashierKey: 'kasir2',
    pin: '2222',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    qrCode: 'GRIZO-EMP-emp-2-kasir2'
  },
  {
    id: 'emp-3',
    name: 'Admin Grizolabs',
    role: 'Admin',
    email: 'admin@grizolabs.com',
    phone: '+62 812-9999-0000',
    status: 'Active',
    totalSalesToday: 27550000,
    txnsToday: 252,
    cashierKey: 'admin',
    pin: '9999',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    qrCode: 'GRIZO-EMP-emp-3-admin'
  },
  {
    id: 'emp-4',
    name: 'Manager Toko (Charlie)',
    role: 'Store Manager',
    email: 'manager@grizopos.com',
    phone: '+62 812-8888-0000',
    status: 'Active',
    totalSalesToday: 8500000,
    txnsToday: 45,
    cashierKey: 'manager',
    pin: '8888',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    qrCode: 'GRIZO-EMP-emp-4-manager'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-101',
    employeeId: 'emp-1',
    employeeName: 'Kasir 1 (Alice Smith)',
    date: '2026-08-12',
    checkInTime: '07:55',
    checkOutTime: '17:00',
    status: 'Checked Out',
    notes: 'Shift Pagi - Tepat Waktu',
    totalHours: 6.0
  },
  {
    id: 'att-102',
    employeeId: 'emp-2',
    employeeName: 'Kasir 2 (Bob Jones)',
    date: '2026-08-12',
    checkInTime: '08:12',
    checkOutTime: '17:00',
    status: 'Checked Out',
    notes: 'Shift Pagi - Terlambat 12 Menit',
    totalHours: 5.7
  },
  {
    id: 'att-100',
    employeeId: 'emp-1',
    employeeName: 'Kasir 1 (Alice Smith)',
    date: '2026-08-11',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    status: 'Checked Out',
    notes: 'Shift Lengkap',
    totalHours: 9.0
  },
  {
    id: 'att-099',
    employeeId: 'emp-2',
    employeeName: 'Kasir 2 (Bob Jones)',
    date: '2026-08-11',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    status: 'Checked Out',
    notes: 'Shift Lengkap',
    totalHours: 9.0
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c-1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '(555) 234-5678', loyaltyPoints: 240, totalSpent: 1240.50 },
  { id: 'c-2', name: 'Michael Chang', email: 'mchang@example.com', phone: '(555) 345-6789', loyaltyPoints: 110, totalSpent: 620.00 },
  { id: 'c-3', name: 'Elena Rostova', email: 'elena.r@example.com', phone: '(555) 456-7890', loyaltyPoints: 480, totalSpent: 2890.00 },
  { id: 'c-4', name: 'David Miller', email: 'dmiller@example.com', phone: '(555) 567-8901', loyaltyPoints: 65, totalSpent: 310.00 }
];

