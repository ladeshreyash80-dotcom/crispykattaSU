import { z } from 'zod'

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number').optional(),
  hostelRoom: z.string().min(1, 'Hostel/Room or pickup location required'),
  orderType: z.enum(['pickup', 'delivery'], { required_error: 'Select order type' }),
  notes: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

export const adminAuthSchema = z.object({
  password: z.string().min(1, 'Password required'),
})

export const statusTransitionSchema = z.object({
  status: z.enum(['received', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'completed', 'rejected']),
})

export type OrderStatus = 'received' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'rejected'
