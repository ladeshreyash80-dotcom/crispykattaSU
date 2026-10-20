import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, MessageCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import { formatINR } from '../lib/money'
import { storeInfo } from '../lib/data'

export default function Confirmation() {
  const { orderId } = useParams<{ orderId: string }>()
  const { getOrder } = useStore()
  const order = orderId ? getOrder(orderId) : undefined

  useEffect(() => {
    if (!order) {
      // Order might not be found, but we should still show something
    }
  }, [order])

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
        <p className="text-[#a89f91] mb-6 text-center">We couldn't find this order.</p>
        <Link
          to="/menu"
          className="bg-[#d97757] text-white px-6 py-3 rounded-lg hover:bg-[#c96649] min-h-[44px] flex items-center"
        >
          Back to Menu
        </Link>
      </div>
    )
  }

  const whatsappMessage = encodeURIComponent(
    `*New Order - ${order.id}*\n\n` +
    `*Customer:* ${order.customer.name}\n` +
    `*Contact:* ${order.customer.phone || 'N/A'}\n` +
    `*Location:* ${order.customer.hostelRoom}\n` +
    `*Order Type:* ${order.orderType}\n\n` +
    `*Items:*\n` +
    order.items.map(item => `- ${item.quantity}x ${item.menuItem.name} - ${formatINR(item.menuItem.price * item.quantity)}`).join('\n') +
    `\n\n*Subtotal:* ${formatINR(order.subtotal)}\n` +
    `*Total:* ${formatINR(order.total)}\n\n` +
    `*Status:* ${order.status}`
  )

  const whatsappUrl = `https://wa.me/${storeInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`

  return (
    <div className="min-h-screen">
      <div className="bg-[#1a1410] px-4 py-8 text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-[#a89f91]">Thank you for your order</p>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto space-y-4">
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b] text-center">
          <p className="text-[#a89f91] text-sm mb-1">Order Number</p>
          <p className="text-[#d97757] text-xl font-bold font-mono">{order.id}</p>
        </div>

        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b] space-y-3">
          <h2 className="text-white font-semibold">Order Details</h2>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between">
                <span className="text-[#a89f91]">{item.quantity}x {item.menuItem.name}</span>
                <span className="text-white">{formatINR(item.menuItem.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2a221b] pt-2 space-y-1">
            <div className="flex justify-between text-[#a89f91]">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-white font-bold">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b] space-y-2">
          <h2 className="text-white font-semibold">Customer Info</h2>
          <p className="text-[#a89f91]"><span className="text-white">Name:</span> {order.customer.name}</p>
          {order.customer.phone && <p className="text-[#a89f91]"><span className="text-white">Phone:</span> {order.customer.phone}</p>}
          <p className="text-[#a89f91]"><span className="text-white">Location:</span> {order.customer.hostelRoom}</p>
          <p className="text-[#a89f91]"><span className="text-white">Type:</span> {order.orderType}</p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 min-h-[44px] flex items-center justify-center gap-2 font-semibold"
        >
          <MessageCircle size={20} />
          Send Order via WhatsApp
        </a>

        <Link
          to={`/track/${order.id}`}
          className="block w-full bg-[#2a221b] text-white text-center py-4 rounded-lg hover:bg-[#3a322b] min-h-[44px] flex items-center justify-center"
        >
          Track Order
        </Link>

        <Link
          to="/menu"
          className="block w-full text-[#a89f91] text-center py-3 hover:text-white"
        >
          Order More
        </Link>
      </div>
    </div>
  )
}
