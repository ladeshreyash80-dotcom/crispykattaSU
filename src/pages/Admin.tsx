import { useState, useEffect } from 'react'
import { LogIn, LogOut } from 'lucide-react'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Admin() {
  const [authState, setAuthState] = useState<{ user: User | null; loaded: boolean } | null>({ user: null, loaded: false })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const configured = isSupabaseConfigured()

  useEffect(() => {
    try {
      const client = getSupabaseClient()
      if (!client) {
        setAuthState({ user: null, loaded: true })
        return
      }
      let active = true
      client.auth.getSession().then(({ data: { session } }) => {
        if (!active) return
        setAuthState({ user: session?.user ?? null, loaded: true })
      }).catch(() => {
        if (!active) return
        setAuthState({ user: null, loaded: true })
      })
      const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
        if (!active) return
        setAuthState({ user: session?.user ?? null, loaded: true })
      })
      return () => { active = false; subscription.unsubscribe() }
    } catch (err) {
      console.error('Admin init error:', err)
      setAuthState({ user: null, loaded: true })
    }
  }, [])

  const user = authState?.user ?? null
  const loading = configured && !authState?.loaded

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const client = getSupabaseClient()
      if (!client) { setError('Supabase not configured on this deployment.'); return }
      const { error: signInError } = await client.auth.signInWithPassword({ email, password })
      if (signInError) setError(signInError.message)
    } catch (err: any) {
      setError(err?.message || 'Sign in failed')
    }
  }

  const handleSignOut = async () => {
    try {
      const client = getSupabaseClient()
      if (client) await client.auth.signOut()
    } catch (err) {
      console.error(err)
    }
  }

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0b09]">
        <div className="bg-[#1a1410] rounded-lg p-6 max-w-md w-full border border-[#2a221b]">
          <h1 className="text-xl font-bold text-white mb-2">Owner Dashboard</h1>
          <p className="text-[#a89f91]">Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0b09] text-[#a89f91]">
        Loading dashboard...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0b09]">
        <div className="bg-[#1a1410] rounded-lg p-6 max-w-md w-full border border-[#2a221b]">
          <h1 className="text-2xl font-bold text-white mb-2">Owner Login</h1>
          <p className="text-[#a89f91] mb-6">Sign in to access the dashboard</p>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[#a89f91] text-sm mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#2a221b] text-white px-3 py-2 rounded border border-[#3a322b]" required />
            </div>
            <div>
              <label className="block text-[#a89f91] text-sm mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#2a221b] text-white px-3 py-2 rounded border border-[#3a322b]" required />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-[#d97757] text-white py-2 rounded flex items-center justify-center gap-2">
              <LogIn size={18} /> Sign In
            </button>
          </form>
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
        <button onClick={handleSignOut} className="flex items-center gap-2 text-[#a89f91] hover:text-white">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="bg-[#1a1410] rounded-lg p-6 border border-[#2a221b]">
          <p className="text-white">Dashboard is ready. Menu and settings can be managed via the existing backend.</p>
        </div>
      </div>
    </div>
  )
}
