import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { StoreProvider, useStore } from '../lib/store'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <StoreProvider>{children}</StoreProvider>
)

describe('Store', () => {
  it('calculates cart totals correctly', () => {
    const { result } = renderHook(() => useStore(), { wrapper })
    
    const mockItem = {
      id: 'test',
      name: 'Test',
      description: 'test',
      price: 10000,
      category: 'test',
      veg: true,
      available: true,
    }
    
    act(() => {
      result.current.addToCart(mockItem, 2)
    })
    
    expect(result.current.cartCount).toBe(2)
    expect(result.current.cartTotal).toBe(20000)
  })

  it('prevents duplicate orders with same attemptId', async () => {
    const { result } = renderHook(() => useStore(), { wrapper })
    
    const mockItem = {
      id: 'test2',
      name: 'Test2',
      description: 'test',
      price: 5000,
      category: 'test',
      veg: true,
      available: true,
    }
    
    act(() => {
      result.current.addToCart(mockItem)
    })
    
    const orderData = {
      attemptId: 'same-id',
      items: result.current.cart,
      subtotal: result.current.cartTotal,
      total: result.current.cartTotal,
      customer: { name: 'Test', hostelRoom: 'A1' },
      orderType: 'pickup' as const,
    }
    
    await expect(result.current.placeOrder(orderData)).rejects.toThrow()
  })
})
