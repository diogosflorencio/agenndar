import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * IMPORTANTE (Vercel/Build):
 * Não podemos dar throw aqui, porque o Next pode importar este arquivo durante o prerender/build.
 * Em produção, configure as env vars no painel da Vercel.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let _supabase: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabase) return _supabase
  if (!supabaseUrl || !supabaseAnonKey) return null

  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  })

  return _supabase
}

// Compat: imports existentes (mas pode ser null)
export const supabase = getSupabaseClient()

