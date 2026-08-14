import { pgTable, text, numeric, integer, timestamp } from 'drizzle-orm/pg-core';

// 1. Store Config Table
export const storeConfigTable = pgTable('store_config', {
  id: text('id').primaryKey().default('main_store'),
  storeName: text('store_name').notNull(),
  storeBranch: text('store_branch'),
  address: text('address'),
  phone: text('phone'),
  taxRate: numeric('tax_rate'),
  currencySymbol: text('currency_symbol'),
  receiptFooter: text('receipt_footer'),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 2. Categories Table (Barang vs Jasa)
export const categoriesTable = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'Barang' | 'Jasa'
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow()
});

// 3. Products Table
export const productsTable = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subtitle: text('subtitle'),
  sku: text('sku').unique().notNull(),
  category: text('category').notNull(),
  itemType: text('item_type').notNull().default('Barang'),
  price: numeric('price').notNull(),
  stock: integer('stock').notNull().default(0),
  lowStockThreshold: integer('low_stock_threshold').default(10),
  image: text('image'),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 4. Transactions Table
export const transactionsTable = pgTable('transactions', {
  id: text('id').primaryKey(),
  ticketNo: text('ticket_no').unique().notNull(),
  cashierId: text('cashier_id').notNull(),
  cashierName: text('cashier_name').notNull(),
  customerName: text('customer_name'),
  paymentMethod: text('payment_method').notNull(),
  status: text('status').notNull(),
  subtotal: numeric('subtotal').notNull(),
  tax: numeric('tax').notNull(),
  discount: numeric('discount').default('0'),
  total: numeric('total').notNull(),
  amountTendered: numeric('amount_tendered'),
  changeDue: numeric('change_due'),
  createdAt: timestamp('created_at').defaultNow()
});

// 5. Attendance Logs Table
export const attendanceLogsTable = pgTable('attendance_logs', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  employeeName: text('employee_name').notNull(),
  date: text('date').notNull(),
  checkInTime: text('check_in_time').notNull(),
  checkOutTime: text('check_out_time'),
  status: text('status').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
});
