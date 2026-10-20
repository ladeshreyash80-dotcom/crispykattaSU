import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase client bootstrap.
 *
 * IMPORTANT: `createClient()` throws when the URL is empty or malformed, and it
 * throws at *call* time — i.e. at module evaluation if we call it at module
 * scope. Because `pages/Admin.tsx` statically imports this module, a throwing
 * module evaluation kills the entire import graph and React never mounts,
 * leaving a completely blank page.
 *
 * To avoid that we:
 *   1. never call `createClient()` at module scope,
 *   2. build the client lazily on first use,
 *   3. expose `isSupabaseConfigured()` so the UI can render a friendly setup
 *      message instead of throwing.
 */

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

/** True only when both a well-formed URL and a key are present. */
export const isSupabaseConfigured = (): boolean =>
  /^https?:\/\//i.test(supabaseUrl) && supabaseAnonKey.length > 0

export const SUPABASE_SETUP_MESSAGE =
  'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment and redeploy.'

let client: SupabaseClient | null = null
let initError: Error | null = null

/**
 * Returns a ready Supabase client, or `null` when the app is not configured.
 * Never throws.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (client) return client
  if (initError) return null

  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
    return client
  } catch (error) {
    initError = error instanceof Error ? error : new Error(String(error))
    return null
  }
}

/** The last client-initialisation error, if any. Safe to show to users. */
export const getSupabaseInitError = (): Error | null => initError

/**
 * Lazy proxy over the Supabase client.
 *
 * Accessing any property resolves the client on demand. If the app is not
 * configured this throws a descriptive error (which the app-level error
 * boundary renders as a friendly message) instead of taking down the whole
 * bundle at import time.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const instance = getSupabaseClient()
    if (!instance) {
      throw new Error(
        initError
          ? `Supabase client failed to initialise: ${initError.message}`
          : SUPABASE_SETUP_MESSAGE,
      )
    }
    const value = Reflect.get(instance, prop, receiver)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})
