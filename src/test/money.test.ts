import { describe, it, expect } from 'vitest'
import { formatINR, paiseToRupees, rupeesToPaise } from '../lib/money'

describe('Money utilities', () => {
  it('formats paise to INR', () => {
    expect(formatINR(10000)).toContain('100')
  })

  it('converts paise to rupees', () => {
    expect(paiseToRupees(15000)).toBe(150)
  })

  it('converts rupees to paise', () => {
    expect(rupeesToPaise(150)).toBe(15000)
  })
})
