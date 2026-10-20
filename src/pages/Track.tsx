import { useParams } from 'react-router-dom'
import { Clock, CheckCircle, ChefHat, Truck, Package } from 'lucide-react'
import { useStore } from '../lib/store'

export default function Track() {
  const { orderId } = useParams<{ orderId: string }>()
  const { getOrder } = useStore()
  const order = orderId ? getOrder(orderId) : undefined

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
      </div>
    )
  }

  const statuses = [
    { key: 'received', label: 'Order Received', icon: Clock },
    { key: 'accepted', label: 'Order Accepted', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { key: 'ready', label: 'Ready', icon: Package },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'completed', label: 'Completed', icon: CheckCircle },
  ]

  const currentIndex = statuses.findIndex(s => s.key === order.status)

  return (
    <div className="min-h-screen">
      <div className="bg-[#1a1410] px-4 py-4 border-b border-[#2a221b]">
        <h1 className="text-2xl font-bold text-white">Track Order</h1>
        <p className="text-[#a89f91] font-mono">{order.id}</p>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto">
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
          <h2 className="text-white font-semibold mb-4">Order Status</h2>
          <div className="space-y-4">
            {statuses.map((status, index) => {
              const Icon = status.icon
              const isCompleted = index <= currentIndex
              const isCurrent = index === currentIndex
              return (
                <div key={status.key} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[44px] min-h-[44px] ${
                    isCompleted ? 'bg-[#d97757] text-white' : 'bg-[#2a221b] text-[#a89f91]'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className={`${isCompleted ? 'text-white' : 'text-[#a89f91]'}`}>{status.label}</p>
                    {isCurrent && <p className="text-[#d97757] text-sm">Current Status</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
