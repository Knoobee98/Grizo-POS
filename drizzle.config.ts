import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres.pqjqkblogffbznafjmvg:Grizolabs123!@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres'
  }
});
