import React, { createContext, useContext, useEffect, useState } from 'react'
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
    const saved = localStorage.getItem('crispy-katta-cart')
    return saved ? JSON.parse(saved) : []
  })

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('crispy-katta-orders')
    return saved ? JSON.parse(saved) : []
  })

  const [profile, setProfile] = useState<{ name: string; phone?: string } | null>(() => {
    const saved = localStorage.getItem('crispy-katta-profile')
    return saved ? JSON.parse(saved) : null
  })

  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('crispy-katta-points')
    return saved ? parseInt(saved) : 0
  })

  useEffect(() => {
    localStorage.setItem('crispy-katta-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('crispy-katta-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('crispy-katta-profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('crispy-katta-points', points.toString())
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
    // Idempotency check - prevent duplicate orders with same attemptId in short time
    const existingOrder = orders.find(o => o.attemptId === orderData.attemptId)
    if (existingOrder) {
      return existingOrder
    }

    const order: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      status: 'received',
      createdAt: new Date().toISOString(),
    }

    setOrders((prev) => [order, ...prev])
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
