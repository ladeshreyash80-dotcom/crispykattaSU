import { describe, it, expect } from 'vitest'
import { checkoutSchema } from '../lib/schema'

describe('Checkout validation', () => {
  it('validates valid checkout data', () => {
    const result = checkoutSchema.safeParse({
      name: 'John Doe',
      hostelRoom: 'Hostel A 101',
      orderType: 'pickup',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid checkout data', () => {
    const result = checkoutSchema.safeParse({
      name: 'J',
      hostelRoom: '',
      orderType: 'pickup',
    })
    expect(result.success).toBe(false)
  })
})
