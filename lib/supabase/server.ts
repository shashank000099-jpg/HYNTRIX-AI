import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const supabaseServer: SupabaseClient | null =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false
        }
      })
    : null;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Supabase server client is missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}
