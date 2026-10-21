import { useState, useEffect } from 'react'
import { LogIn, LogOut, Upload, Plus, Save, X, Image, Menu as MenuIcon, Settings } from 'lucide-react'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  image_url: string | null
  veg: boolean
  available: boolean
  popular: boolean
  sort_order: number
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'menu' | 'images' | 'settings'>('menu')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null)
  const [stallPhotoUrl, setStallPhotoUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

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
      }).catch(() => setLoading(false))
    } catch {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user || !configured) return
    loadData()
  }, [user])

  const loadData = async () => {
    const client = getSupabaseClient()
    if (!client) return
    try {
      const [itemsRes, catsRes, settingsRes] = await Promise.all([
        client.from('menu_items').select('*').order('sort_order'),
        client.from('categories').select('*').order('sort_order'),
        client.from('store_settings').select('*').eq('key', 'stall_photo').maybeSingle()
      ])
      if (itemsRes.data) setMenuItems(itemsRes.data as MenuItem[])
      if (catsRes.data) setCategories(catsRes.data as Category[])
      if (settingsRes.data?.value && typeof settingsRes.data.value === 'object' && 'url' in settingsRes.data.value) {
        setStallPhotoUrl((settingsRes.data.value as any).url)
      }
    } catch (err) {
      console.error(err)
    }
  }

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

  const handleImageUpload = async (file: File, type: 'stall' | 'menu', itemId?: string) => {
    const client = getSupabaseClient()
    if (!client) return
    setUploading(true)
    setError(null)
    try {
      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const bucket = type === 'stall' ? 'stall-photos' : 'menu-images'
      const { error: uploadError } = await client.storage.from(bucket).upload(fileName, file)
      if (uploadError) {
        if (uploadError.message?.includes('Bucket not found')) {
          throw new Error(`Storage bucket "${bucket}" not found. Create it in Supabase Storage with public access enabled.`)
        }
        throw uploadError
      }
      const { data: { publicUrl } } = client.storage.from(bucket).getPublicUrl(fileName)
      if (type === 'stall') {
        setStallPhotoUrl(publicUrl)
        await client.from('store_settings').upsert({ key: 'stall_photo', value: { url: publicUrl } }, { onConflict: 'key' })
      } else if (type === 'menu' && itemId) {
        await client.from('menu_items').update({ image_url: publicUrl }).eq('id', itemId)
        await loadData()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveItem = async () => {
    if (!editingItem) return
    const client = getSupabaseClient()
    if (!client) return
    setSaving(true)
    setError(null)
    try {
      if (editingItem.id) {
        await client.from('menu_items').update(editingItem).eq('id', editingItem.id)
      } else {
        const { id, ...rest } = editingItem as any
        await client.from('menu_items').insert([rest])
      }
      setEditingItem(null)
      await loadData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return
    const client = getSupabaseClient()
    if (!client) return
    try {
      await client.from('menu_items').delete().eq('id', id)
      await loadData()
    } catch (err: any) {
      setError(err.message)
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
    <div style={{minHeight:'100vh',background:'#0f0b09',paddingBottom:'40px'}}>
      <div style={{background:'#1a1410',padding:'16px',borderBottom:'1px solid #2a221b',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{color:'white',fontSize:'24px'}}>Owner Dashboard</h1>
          <p style={{color:'#a89f91',fontSize:'14px'}}>{user.email}</p>
        </div>
        <button onClick={handleSignOut} style={{color:'#a89f91',background:'none',border:'none',display:'flex',alignItems:'center',gap:'6px',cursor:'pointer'}}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'20px'}}>
        <div style={{display:'flex',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
          <button onClick={() => setActiveTab('menu')} style={{padding:'8px 16px',background: activeTab==='menu'?'#d97757':'#2a221b',color:'white',border:'none',borderRadius:'4px',cursor:'pointer'}}><MenuIcon size={16} style={{display:'inline',marginRight:'6px'}}/>Menu</button>
          <button onClick={() => setActiveTab('images')} style={{padding:'8px 16px',background: activeTab==='images'?'#d97757':'#2a221b',color:'white',border:'none',borderRadius:'4px',cursor:'pointer'}}><Image size={16} style={{display:'inline',marginRight:'6px'}}/>Photos</button>
          <button onClick={() => setActiveTab('settings')} style={{padding:'8px 16px',background: activeTab==='settings'?'#d97757':'#2a221b',color:'white',border:'none',borderRadius:'4px',cursor:'pointer'}}><Settings size={16} style={{display:'inline',marginRight:'6px'}}/>Settings</button>
        </div>

        {error && <div style={{background:'#7f1d1d',color:'white',padding:'10px',borderRadius:'4px',marginBottom:'16px'}}>{error}</div>}

        {activeTab === 'images' && (
          <div style={{background:'#1a1410',padding:'20px',borderRadius:'8px',border:'1px solid #2a221b'}}>
            <h2 style={{color:'white',marginBottom:'16px'}}>Stall Photo</h2>
            <p style={{color:'#a89f91',marginBottom:'12px',fontSize:'14px'}}>Storage buckets required: 'stall-photos' and 'menu-images' (public). Create them in Supabase Storage if missing.</p>
            {stallPhotoUrl && <img src={stallPhotoUrl} alt="Stall" style={{width:'100%',maxHeight:'300px',objectFit:'cover',borderRadius:'8px',marginBottom:'16px'}} />}
            <label style={{background:'#d97757',color:'white',padding:'10px 20px',borderRadius:'4px',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:'8px'}}>
              <Upload size={18}/> {uploading ? 'Uploading...' : 'Upload/Replace Photo'}
              <input type="file" accept="image/*" style={{display:'none'}} onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'stall')} disabled={uploading} />
            </label>
          </div>
        )}

        {activeTab === 'menu' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px'}}>
              <h2 style={{color:'white'}}>Menu Items</h2>
              <button onClick={() => setEditingItem({ name: '', price: 0, available: true, veg: true, description: '' })} style={{background:'#d97757',color:'white',border:'none',padding:'8px 16px',borderRadius:'4px',cursor:'pointer'}}><Plus size={16} style={{display:'inline',marginRight:'6px'}}/>Add Item</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {menuItems.map((item) => (
                <div key={item.id} style={{background:'#1a1410',padding:'16px',borderRadius:'8px',border:'1px solid #2a221b',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    {item.image_url && <img src={item.image_url} alt={item.name} style={{width:'60px',height:'60px',objectFit:'cover',borderRadius:'4px'}} />}
                    <div>
                      <div style={{color:'white',fontWeight:'600'}}>{item.name}</div>
                      <div style={{color:'#a89f91',fontSize:'14px'}}>₹{(item.price/100).toFixed(0)} • {item.available ? 'Available' : 'Unavailable'}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'8px'}}>
                    <button onClick={() => setEditingItem(item)} style={{background:'none',border:'none',color:'#a89f91',cursor:'pointer'}}><Save size={18}/></button>
                    <button onClick={() => handleDeleteItem(item.id)} style={{background:'none',border:'none',color:'#f87171',cursor:'pointer'}}><X size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {editingItem && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',zIndex:50}}>
            <div style={{background:'#1a1410',padding:'24px',borderRadius:'8px',maxWidth:'400px',width:'100%',border:'1px solid #2a221b'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px'}}>
                <h3 style={{color:'white'}}>Edit Item</h3>
                <button onClick={() => setEditingItem(null)} style={{background:'none',border:'none',color:'#a89f91',cursor:'pointer'}}><X size={20}/></button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                <input value={editingItem.name || ''} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} placeholder="Name" style={{padding:'8px',background:'#2a221b',color:'white',border:'1px solid #3a322b',borderRadius:'4px'}} />
                <input type="number" value={editingItem.price !== undefined ? editingItem.price/100 : 0} onChange={(e) => setEditingItem({...editingItem, price: Math.round(parseFloat(e.target.value||'0')*100)})} placeholder="Price" style={{padding:'8px',background:'#2a221b',color:'white',border:'1px solid #3a322b',borderRadius:'4px'}} />
                <textarea value={editingItem.description || ''} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} placeholder="Description" style={{padding:'8px',background:'#2a221b',color:'white',border:'1px solid #3a322b',borderRadius:'4px'}} />
                <label style={{color:'white',display:'flex',alignItems:'center',gap:'8px'}}><input type="checkbox" checked={editingItem.available !== false} onChange={(e) => setEditingItem({...editingItem, available: e.target.checked})} /> Available</label>
                <button onClick={handleSaveItem} disabled={saving} style={{padding:'8px',background:'#d97757',color:'white',border:'none',borderRadius:'4px'}}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
