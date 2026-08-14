import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables (or fallback to dummy for local demo mode)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL';
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
