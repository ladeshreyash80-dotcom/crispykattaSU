/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { MenuItem } from './data'

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  note?: string
}

export interface Order {
  id: string
  attemptId: string
  items: CartItem[]
  subtotal: number
  total: number
  customer: {
    name: string
    phone?: string
    hostelRoom: string
  }
  orderType: 'pickup' | 'delivery'
  status: 'received' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'rejected'
  createdAt: string
  notes?: string
}

interface StoreContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  orders: Order[]
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>
  getOrder: (id: string) => Order | undefined
  profile: { name: string; phone?: string } | null
  updateProfile: (profile: { name: string; phone?: string }) => void
  points: number
  addPoints: (points: number) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('crispy-katta-cart') : null
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('crispy-katta-orders') : null
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const ordersRef = useRef<Order[]>(orders)
  useEffect(() => {
    ordersRef.current = orders
  }, [orders])

  const [profile, setProfile] = useState<{ name: string; phone?: string } | null>(() => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('crispy-katta-profile') : null
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('crispy-katta-points') : null
      return saved ? parseInt(saved) : 0
    } catch {
      return 0
    }
  })
  const attemptIdToOrderRef = useRef<Map<string, Order>>(new Map())

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('crispy-katta-cart', JSON.stringify(cart))
      }
    } catch {}
  }, [cart])

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('crispy-katta-orders', JSON.stringify(orders))
      }
    } catch {}
    // Sync to attempt map
    for (const o of orders) {
      if (o.attemptId && !attemptIdToOrderRef.current.has(o.attemptId)) {
        attemptIdToOrderRef.current.set(o.attemptId, o)
      }
    }
  }, [orders])

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('crispy-katta-profile', JSON.stringify(profile))
      }
    } catch {}
  }, [profile])

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('crispy-katta-points', points.toString())
      }
    } catch {}
  }, [points])

  const addToCart = (item: MenuItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id)
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        )
      }
      return [...prev, { menuItem: item, quantity }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prev) =>
      prev.map((ci) => (ci.menuItem.id === itemId ? { ...ci, quantity } : ci))
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0)
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0)

  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    // Idempotency check - prevent duplicate orders with same attemptId
    const existingOrder =
      (orderData.attemptId ? attemptIdToOrderRef.current.get(orderData.attemptId) : undefined) ||
      ordersRef.current.find(o => o.attemptId === orderData.attemptId) ||
      orders.find(o => o.attemptId === orderData.attemptId)
    if (existingOrder) {
      if (orderData.attemptId) {
        attemptIdToOrderRef.current.set(orderData.attemptId, existingOrder)
      }
      return existingOrder
    }

    const order: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      status: 'received',
      createdAt: new Date().toISOString(),
    }

    // Persist to Supabase when the backend is configured. Uses atomic RPC
    // to create order + items in a single transaction with server-side price validation.
    try {
      const { getSupabaseClient } = await import('./supabase')
      const client = getSupabaseClient()
      if (client) {
        const items = orderData.items
          .filter((item) => item.menuItem.dbId)
          .map((item) => ({
            menu_item_id: item.menuItem.dbId,
            quantity: item.quantity,
          }))
        if (items.length > 0) {
          const { data, error } = await client.rpc('create_order_atomic', {
            p_order_number: order.id,
            p_attempt_id: orderData.attemptId || null,
            p_customer_name: orderData.customer.name,
            p_customer_phone: orderData.customer.phone || null,
            p_hostel_room: orderData.customer.hostelRoom,
            p_order_type: orderData.orderType,
            p_notes: orderData.notes || null,
            p_items: items,
          })
          if (error) {
            console.error('Order creation failed:', error)
            throw error
          }
          // Update order with server-calculated total
          if (data && data[0]) {
            order.total = data[0].total
            order.subtotal = data[0].total
          }
        }
      }
    } catch (err) {
      console.error('Supabase order persistence failed:', err)
      // Do not silently continue - throw so caller knows
      throw err
    }

    if (order.attemptId) {
      attemptIdToOrderRef.current.set(order.attemptId, order)
    }
    setOrders((prev) => {
      const next = [order, ...prev]
      ordersRef.current = next
      return next
    })
    clearCart()
    return order
  }

  const getOrder = (id: string) => orders.find((o) => o.id === id)

  const updateProfile = (profileData: { name: string; phone?: string }) => {
    setProfile(profileData)
  }

  const addPoints = (pointsToAdd: number) => {
    setPoints((prev) => prev + pointsToAdd)
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        placeOrder,
        getOrder,
        profile,
        updateProfile,
        points,
        addPoints,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
