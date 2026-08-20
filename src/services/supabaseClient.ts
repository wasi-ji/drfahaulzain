import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

/**
  Single shared Supabase client used across the app for:
  - Real authentication (secure signup/login/logout via Supabase Auth)
  - Reading/writing the 'profiles' table (name, phone, role)

  If the environment variables aren't set (e.g. running locally without a
  .env file), this stays null and authService falls back gracefully.
*/
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
