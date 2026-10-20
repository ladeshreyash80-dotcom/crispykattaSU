import { useState, useEffect } from 'react'
import { LogIn } from 'lucide-react'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const configured = isSupabaseConfigured()

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }
    try {
      const client = getSupabaseClient()
      if (!client) {
        setLoading(false)
        return
      }
      client.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
    } catch {
      setLoading(false)
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const client = getSupabaseClient()
      if (!client) { setError('Not configured'); return }
      const { error: signInError } = await client.auth.signInWithPassword({ email, password })
      if (signInError) setError(signInError.message)
    } catch (err: any) {
      setError(err?.message || 'Failed')
    }
  }

  if (!configured) {
    return (
      <div style={{minHeight:'100vh',background:'#0f0b09',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        <div style={{background:'#1a1410',padding:'24px',borderRadius:'8px',maxWidth:'400px',width:'100%',border:'1px solid #2a221b'}}>
          <h1 style={{color:'white',fontSize:'20px',marginBottom:'8px'}}>Owner Dashboard</h1>
          <p style={{color:'#a89f91'}}>Supabase not configured</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{minHeight:'100vh',background:'#0f0b09',display:'flex',alignItems:'center',justifyContent:'center',color:'#a89f91'}}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{minHeight:'100vh',background:'#0f0b09',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        <div style={{background:'#1a1410',padding:'24px',borderRadius:'8px',maxWidth:'400px',width:'100%',border:'1px solid #2a221b'}}>
          <h1 style={{color:'white',fontSize:'24px',marginBottom:'8px'}}>Owner Login</h1>
          <form onSubmit={handleSignIn} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{padding:'8px',background:'#2a221b',color:'white',border:'1px solid #3a322b',borderRadius:'4px'}} required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{padding:'8px',background:'#2a221b',color:'white',border:'1px solid #3a322b',borderRadius:'4px'}} required />
            {error && <p style={{color:'#f87171',fontSize:'14px'}}>{error}</p>}
            <button type="submit" style={{padding:'8px',background:'#d97757',color:'white',border:'none',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              <LogIn size={18} /> Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:'#0f0b09',padding:'20px'}}>
      <div style={{background:'#1a1410',padding:'16px',borderRadius:'8px',border:'1px solid #2a221b'}}>
        <h1 style={{color:'white',fontSize:'24px',marginBottom:'8px'}}>Owner Dashboard</h1>
        <p style={{color:'#a89f91'}}>{user.email}</p>
      </div>
    </div>
  )
}
