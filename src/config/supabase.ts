import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase clients
let supabaseClient: SupabaseClient | null = null;
let supabaseAnonClient: SupabaseClient | null = null;

// Function to get Supabase client with service role key for admin operations
export const getSupabase = (): SupabaseClient | null => {
  if (!supabaseClient) {
    const supabaseUrl = process.env['SUPABASE_URL'];
    const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
    
    if (supabaseUrl && supabaseServiceKey) {
      supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
  }
  return supabaseClient;
};

// Function to get Supabase client with anon key for user operations
export const getSupabaseAnon = (): SupabaseClient | null => {
  if (!supabaseAnonClient) {
    const supabaseUrl = process.env['SUPABASE_URL'];
    const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'];
    
    if (supabaseUrl && supabaseAnonKey) {
      supabaseAnonClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
      });
    }
  }
  return supabaseAnonClient;
};

// Backward compatibility
export const supabase = getSupabase();
export const supabaseAnon = getSupabaseAnon();

// Function to validate Supabase configuration
export const validateSupabaseConfig = () => {
  const supabaseUrl = process.env['SUPABASE_URL'];
  const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
};

export default getSupabase;
