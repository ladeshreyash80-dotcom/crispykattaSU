import { useState, useEffect } from 'react'
import { LogIn, LogOut, Package, Settings, Menu as MenuIcon } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#1a1410] rounded-lg p-6 max-w-md w-full border border-[#2a221b]">
          <h1 className="text-xl font-bold text-white mb-4">Supabase Not Configured</h1>
          <p className="text-[#a89f91] mb-4">
            Admin authentication requires Supabase configuration. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to environment variables.
          </p>
          <p className="text-[#a89f91] text-sm">
            See .env.example for required variables.
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#1a1410] rounded-lg p-6 max-w-md w-full border border-[#2a221b]">
          <h1 className="text-2xl font-bold text-white mb-2">Owner Login</h1>
          <p className="text-[#a89f91] mb-6">Sign in with an authorized owner account</p>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[#a89f91] text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2a221b] text-white px-3 py-3 rounded-lg border border-[#3a322b] focus:border-[#d97757] focus:outline-none min-h-[44px]"
                required
              />
            </div>
            <div>
              <label className="block text-[#a89f91] text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2a221b] text-white px-3 py-3 rounded-lg border border-[#3a322b] focus:border-[#d97757] focus:outline-none min-h-[44px]"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#d97757] text-white py-3 rounded-lg hover:bg-[#c96649] min-h-[44px] flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Sign In
            </button>
          </form>
          <p className="text-xs text-[#a89f91] mt-4">
            Owner access requires an account with role set in app_metadata.
          </p>
        </div>
      </div>
    )
  }

  const isOwner = user.app_metadata?.role === 'owner'

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#1a1410] rounded-lg p-6 max-w-md w-full border border-[#2a221b] text-center">
          <h1 className="text-xl font-bold text-white mb-4">Unauthorized</h1>
          <p className="text-[#a89f91] mb-6">This account does not have owner privileges.</p>
          <button
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
    <div className="min-h-screen">
      <div className="bg-[#1a1410] px-4 py-4 border-b border-[#2a221b] flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
          <p className="text-[#a89f91] text-sm">{user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[#a89f91] hover:text-white px-3 py-2 min-h-[44px]"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-[#d97757]" />
            <h3 className="text-white font-semibold">Orders</h3>
          </div>
          <p className="text-[#a89f91] text-sm">Manage incoming orders and update statuses</p>
        </div>
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
          <div className="flex items-center gap-2 mb-2">
            <MenuIcon size={20} className="text-[#d97757]" />
            <h3 className="text-white font-semibold">Menu</h3>
          </div>
          <p className="text-[#a89f91] text-sm">Manage menu items, prices, and availability</p>
        </div>
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
          <div className="flex items-center gap-2 mb-2">
            <Settings size={20} className="text-[#d97757]" />
            <h3 className="text-white font-semibold">Settings</h3>
          </div>
          <p className="text-[#a89f91] text-sm">Configure store hours, info, and settings</p>
        </div>
      </div>
    </div>
  )
}
