import { useState, useEffect } from 'react'
import { LogIn, LogOut, Package, Settings, Menu as MenuIcon, Database } from 'lucide-react'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Admin() {
  const [authState, setAuthState] = useState<{ user: User | null; loaded: boolean } | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const configured = isSupabaseConfigured()

  // The owner dashboard talks to Supabase. When the project is not configured
  // we must never touch the client — the auth client throws if the URL is
  // missing, which would crash the whole route.
  useEffect(() => {
    const client = getSupabaseClient()
    if (!client) return

    let active = true

    client.auth.getSession().then(({ data: { session } }) => {
      if (!active) return
      setAuthState({ user: session?.user ?? null, loaded: true })
    })

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setAuthState({ user: session?.user ?? null, loaded: true })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const user = authState?.user ?? null
  const loading = configured && !authState?.loaded

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const client = getSupabaseClient()
    if (!client) {
      setError('Supabase is not configured on this deployment.')
      return
    }
    const { error: signInError } = await client.auth.signInWithPassword({ email, password })
    if (signInError) setError(signInError.message)
  }

  const handleSignOut = async () => {
    const client = getSupabaseClient()
    if (client) await client.auth.signOut()
  }

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0b09]">
        <div className="bg-[#1a1410] rounded-lg p-6 max-w-md w-full border border-[#2a221b]">
          <div className="flex items-center gap-2 mb-4">
            <Database size={20} className="text-[#d97757]" aria-hidden="true" />
            <h1 className="text-xl font-bold text-white">Setup required</h1>
          </div>
          <p className="text-[#a89f91] mb-4">
            The owner dashboard needs a Supabase project. Add these environment variables
            and redeploy:
          </p>
          <ul className="text-sm text-[#d97757] bg-[#0f0b09] border border-[#2a221b] rounded p-3 mb-4 space-y-1">
            <li><code>VITE_SUPABASE_URL</code></li>
            <li><code>VITE_SUPABASE_ANON_KEY</code></li>
          </ul>
          <p className="text-[#a89f91] text-sm">
            Ordering and browsing still work without a database — orders are kept on the
            customer&apos;s device until the backend is connected.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0b09] text-[#a89f91]">
        Loading dashboard…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0b09]">
        <div className="bg-[#1a1410] rounded-lg p-6 max-w-md w-full border border-[#2a221b]">
          <h1 className="text-2xl font-bold text-white mb-2">Owner Login</h1>
          <p className="text-[#a89f91] mb-6">Sign in with an authorized owner account</p>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="owner-email" className="block text-[#a89f91] text-sm mb-1">Email</label>
              <input
                id="owner-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2a221b] text-white px-3 py-3 rounded-lg border border-[#3a322b] focus:border-[#d97757] focus:outline-none min-h-[44px]"
                required
              />
            </div>
            <div>
              <label htmlFor="owner-password" className="block text-[#a89f91] text-sm mb-1">Password</label>
              <input
                id="owner-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2a221b] text-white px-3 py-3 rounded-lg border border-[#3a322b] focus:border-[#d97757] focus:outline-none min-h-[44px]"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#d97757] text-white py-3 rounded-lg hover:bg-[#c96649] min-h-[44px] flex items-center justify-center gap-2"
            >
              <LogIn size={18} aria-hidden="true" />
              Sign In
            </button>
          </form>
          <p className="text-xs text-[#a89f91] mt-4">
            Owner access requires an account with the <code>owner</code> role set in
            app_metadata.
          </p>
        </div>
      </div>
    )
  }

  const isOwner = user.app_metadata?.role === 'owner'

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0b09]">
        <div className="bg-[#1a1410] rounded-lg p-6 max-w-md w-full border border-[#2a221b] text-center">
          <h1 className="text-xl font-bold text-white mb-4">Unauthorized</h1>
          <p className="text-[#a89f91] mb-6">This account does not have owner privileges.</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="bg-[#2a221b] text-white px-4 py-2 rounded-lg hover:bg-[#3a322b] min-h-[44px]"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0b09]">
      <div className="bg-[#1a1410] px-4 py-4 border-b border-[#2a221b] flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
          <p className="text-[#a89f91] text-sm">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[#a89f91] hover:text-white px-3 py-2 min-h-[44px]"
        >
          <LogOut size={18} aria-hidden="true" />
          Sign Out
        </button>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-[#d97757]" aria-hidden="true" />
            <h2 className="text-white font-semibold">Orders</h2>
          </div>
          <p className="text-[#a89f91] text-sm">Manage incoming orders and update statuses</p>
        </div>
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
          <div className="flex items-center gap-2 mb-2">
            <MenuIcon size={20} className="text-[#d97757]" aria-hidden="true" />
            <h2 className="text-white font-semibold">Menu</h2>
          </div>
          <p className="text-[#a89f91] text-sm">Manage menu items, prices, and availability</p>
        </div>
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
          <div className="flex items-center gap-2 mb-2">
            <Settings size={20} className="text-[#d97757]" aria-hidden="true" />
            <h2 className="text-white font-semibold">Settings</h2>
          </div>
          <p className="text-[#a89f91] text-sm">Configure store hours, info, and settings</p>
        </div>
      </div>
    </div>
  )
}
