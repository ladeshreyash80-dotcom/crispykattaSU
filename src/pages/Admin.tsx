import { useState, useEffect } from 'react'
import { LogIn, LogOut } from 'lucide-react'
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
    console.log('Admin component mounted, configured:', configured)
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
        console.log('Got session:', session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
      }).catch((e) => {
        console.error('Session error:', e)
        setLoading(false)
      })
    } catch (e) {
      console.error('Init error:', e)
      setLoading(false)
    }
  }, [configured])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const client = getSupabaseClient()
      if (!client) { setError('Not configured'); return }
      const { error: signInError } = await client.auth.signInWithPassword({ email, password })
      if (signInError) setError(signInError.message)
      else {
        const session = await client.auth.getSession()
        setUser(session.data.session?.user ?? null)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed')
    }
  }

  const handleSignOut = async () => {
    try {
      const client = getSupabaseClient()
      if (client) await client.auth.signOut()
      setUser(null)
    } catch {}
  }

  return (
    <div style={{minHeight:'100vh',background:'#0f0b09',padding:'20px',color:'white'}}>
      <h1>Admin Dashboard</h1>
      {!configured && <div>Not configured</div>}
      {configured && loading && <div>Loading...</div>}
      {configured && !loading && !user && (
        <form onSubmit={handleSignIn} style={{display:'flex',flexDirection:'column',gap:'12px',maxWidth:'400px'}}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{padding:'8px',background:'#2a221b',color:'white',border:'1px solid #3a322b'}} required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{padding:'8px',background:'#2a221b',color:'white',border:'1px solid #3a322b'}} required />
          {error && <div style={{color:'red'}}>{error}</div>}
          <button type="submit" style={{padding:'8px',background:'#d97757',color:'white'}}>Sign In</button>
        </form>
      )}
      {configured && !loading && user && (
        <div>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleSignOut} style={{padding:'8px',background:'#d97757',color:'white'}}>Sign Out</button>
        </div>
      )}
    </div>
  )
}
