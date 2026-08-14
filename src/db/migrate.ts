import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.pqjqkblogffbznafjmvg:Grizolabs123!@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';

const sql = postgres(connectionString, { ssl: 'require', prepare: false });

async function migrate() {
  console.log('Migrating database via direct SQL...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS store_config (
        id TEXT PRIMARY KEY DEFAULT 'main_store',
        store_name TEXT NOT NULL,
        store_branch TEXT,
        address TEXT,
        phone TEXT,
        tax_rate NUMERIC,
        currency_symbol TEXT,
        receipt_footer TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subtitle TEXT,
        sku TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        item_type TEXT NOT NULL DEFAULT 'Barang',
        price NUMERIC NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        low_stock_threshold INT DEFAULT 10,
        image TEXT,
        description TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        ticket_no TEXT UNIQUE NOT NULL,
        cashier_id TEXT NOT NULL,
        cashier_name TEXT NOT NULL,
        customer_name TEXT,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL,
        subtotal NUMERIC NOT NULL,
        tax NUMERIC NOT NULL,
        discount NUMERIC DEFAULT 0,
        total NUMERIC NOT NULL,
        amount_tendered NUMERIC,
        change_due NUMERIC,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS attendance_logs (
        id TEXT PRIMARY KEY,
        employee_id TEXT NOT NULL,
        employee_name TEXT NOT NULL,
        date TEXT NOT NULL,
        check_in_time TEXT NOT NULL,
        check_out_time TEXT,
        status TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Enable Row Level Security and add public policy for Supabase client
    await sql`ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;`;
    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'attendance_logs' AND policyname = 'Public POS Attendance Access'
        ) THEN
          CREATE POLICY "Public POS Attendance Access" ON attendance_logs FOR ALL USING (true) WITH CHECK (true);
        END IF;
      END $$;
    `;

    // Enable Supabase Realtime Publication for attendance_logs
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'attendance_logs'
        ) THEN
          ALTER PUBLICATION supabase_realtime ADD TABLE attendance_logs;
        END IF;
      END $$;
    `;

    // Force update all records to Checked Out
    await sql`UPDATE attendance_logs SET status = 'Checked Out';`;

    console.log('✅ ALL DRIZZLE/POSTGRES TABLES & REALTIME POLICIES SUCCESSFULLY CREATED IN SUPABASE!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
}

migrate();
