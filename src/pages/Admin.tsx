import { useState, useEffect } from 'react'
import { LogIn, LogOut } from 'lucide-react'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Admin() {
  const [authState, setAuthState] = useState<{ user: User | null; loaded: boolean } | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const configured = isSupabaseConfigured()
  const user = authState?.user ?? null
  const loading = configured && !authState?.loaded

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
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const client = getSupabaseClient()
    if (!client) { setError('Supabase not configured'); return }
    const { error: signInError } = await client.auth.signInWithPassword({ email, password })
    if (signInError) setError(signInError.message)
  }

  const handleSignOut = async () => {
    const client = getSupabaseClient()
    if (client) await client.auth.signOut()
  }

  if (!configured) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f0b09] text-white">Not configured</div>
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f0b09] text-white">Loading...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0b09]">
        <div className="bg-[#1a1410] rounded-lg p-6 max-w-md w-full border border-[#2a221b]">
          <h1 className="text-2xl font-bold text-white mb-2">Owner Login</h1>
          <form onSubmit={handleSignIn} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-[#2a221b] text-white px-3 py-2 rounded" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-[#2a221b] text-white px-3 py-2 rounded" required />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-[#d97757] text-white py-2 rounded">Sign In</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0b09] text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <button onClick={handleSignOut} className="flex items-center gap-2"><LogOut size={18}/> Sign Out</button>
      </div>
    </div>
  )
}
