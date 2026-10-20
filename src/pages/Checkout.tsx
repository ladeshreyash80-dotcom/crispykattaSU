import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { checkoutSchema } from '../lib/schema'
import { formatINR } from '../lib/money'
import { storeInfo } from '../lib/data'
import { v4 as uuidv4 } from 'uuid'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, cartTotal, placeOrder, profile, updateProfile } = useStore()
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    hostelRoom: '',
    orderType: 'pickup' as 'pickup' | 'delivery',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const deliveryFee = cartTotal >= storeInfo.freeDeliveryAbove ? 0 : storeInfo.deliveryFee
  const total = cartTotal + deliveryFee

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validated = checkoutSchema.parse(formData)
      
      // Update profile
      if (validated.name) {
        updateProfile({ name: validated.name, phone: validated.phone })
      }

      setIsSubmitting(true)
      const attemptId = uuidv4()
      
      const order = await placeOrder({
        attemptId,
        items: cart,
        subtotal: cartTotal,
        total: total,
        customer: {
          name: validated.name,
          phone: validated.phone,
          hostelRoom: validated.hostelRoom,
        },
        orderType: validated.orderType,
        notes: validated.notes,
      })

      navigate(`/confirmation/${order.id}`)
    } catch (err: unknown) {
      console.error('Checkout submission failed:', err)
      const zodErr = err as { errors?: Array<{ path: (string | number)[]; message: string }> }
      if (zodErr.errors) {
        const newErrors: Record<string, string> = {}
        zodErr.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0]] = error.message
          }
        })
        setErrors(newErrors)
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' })
      }
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="bg-[#1a1410] px-4 py-4 border-b border-[#2a221b]">
        <h1 className="text-2xl font-bold text-white">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-4 max-w-4xl mx-auto space-y-4">
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b] space-y-4">
          <h2 className="text-white font-semibold">Customer Details</h2>
          
          <div>
            <label className="block text-[#a89f91] text-sm mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#2a221b] text-white px-3 py-3 rounded-lg border border-[#3a322b] focus:border-[#d97757] focus:outline-none min-h-[44px]"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[#a89f91] text-sm mb-1">Phone Number (optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#2a221b] text-white px-3 py-3 rounded-lg border border-[#3a322b] focus:border-[#d97757] focus:outline-none min-h-[44px]"
              placeholder="Enter your phone"
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-[#a89f91] text-sm mb-1">Hostel/Room or Pickup Location *</label>
            <input
              type="text"
              value={formData.hostelRoom}
              onChange={(e) => setFormData({ ...formData, hostelRoom: e.target.value })}
              className="w-full bg-[#2a221b] text-white px-3 py-3 rounded-lg border border-[#3a322b] focus:border-[#d97757] focus:outline-none min-h-[44px]"
              placeholder="e.g., Hostel A - Room 101 or Pickup at Stall"
            />
            {errors.hostelRoom && <p className="text-red-400 text-sm mt-1">{errors.hostelRoom}</p>}
          </div>
        </div>

        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b] space-y-4">
          <h2 className="text-white font-semibold">Order Type</h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, orderType: 'pickup' })}
              className={`flex-1 py-3 rounded-lg min-h-[44px] ${
                formData.orderType === 'pickup'
                  ? 'bg-[#d97757] text-white'
                  : 'bg-[#2a221b] text-[#a89f91] hover:text-white'
              }`}
            >
              Pickup
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, orderType: 'delivery' })}
              className={`flex-1 py-3 rounded-lg min-h-[44px] ${
                formData.orderType === 'delivery'
                  ? 'bg-[#d97757] text-white'
                  : 'bg-[#2a221b] text-[#a89f91] hover:text-white'
              }`}
            >
              Delivery
            </button>
          </div>
          {errors.orderType && <p className="text-red-400 text-sm">{errors.orderType}</p>}
        </div>

        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b] space-y-4">
          <h2 className="text-white font-semibold">Order Summary</h2>
          <div className="space-y-2">
            {cart.map((ci) => (
              <div key={ci.menuItem.id} className="flex justify-between text-sm">
                <span className="text-[#a89f91]">{ci.quantity}x {ci.menuItem.name}</span>
                <span className="text-white">{formatINR(ci.menuItem.price * ci.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2a221b] pt-2 space-y-1">
            <div className="flex justify-between text-[#a89f91]">
              <span>Subtotal</span>
              <span>{formatINR(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-[#a89f91]">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-1">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </div>

        {errors.general && <p className="text-red-400 text-center">{errors.general}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#d97757] text-white py-4 rounded-lg hover:bg-[#c96649] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] font-semibold"
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
