import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useStore } from '../lib/store'
import { formatINR } from '../lib/money'
import { storeInfo } from '../lib/data'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useStore()

  const deliveryFee = cartTotal >= storeInfo.freeDeliveryAbove ? 0 : storeInfo.deliveryFee
  const total = cartTotal + deliveryFee

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <ShoppingBag size={64} className="text-[#a89f91] mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
        <p className="text-[#a89f91] mb-6 text-center">Add some delicious items to your cart</p>
        <Link
          to="/menu"
          className="bg-[#d97757] text-white px-6 py-3 rounded-lg hover:bg-[#c96649] min-h-[44px] flex items-center"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-[#1a1410] px-4 py-4 border-b border-[#2a221b]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Your Cart ({cartCount})</h1>
          <button
            onClick={clearCart}
            className="text-[#a89f91] hover:text-red-400 flex items-center gap-1 min-h-[44px] px-2"
          >
            <Trash2 size={18} />
            Clear
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3 max-w-4xl mx-auto">
        {cart.map((ci) => (
          <div key={ci.menuItem.id} className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-white font-semibold">{ci.menuItem.name}</h3>
                <p className="text-[#d97757] font-semibold">{formatINR(ci.menuItem.price)}</p>
              </div>
              <button
                onClick={() => removeFromCart(ci.menuItem.id)}
                className="text-[#a89f91] hover:text-red-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#a89f91] text-sm">Subtotal: {formatINR(ci.menuItem.price * ci.quantity)}</span>
              <div className="flex items-center gap-2 bg-[#2a221b] rounded-lg">
                <button
                  onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:text-[#d97757]"
                >
                  <Minus size={18} />
                </button>
                <span className="text-white font-semibold min-w-[30px] text-center">{ci.quantity}</span>
                <button
                  onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:text-[#d97757]"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b] space-y-2">
          <div className="flex justify-between text-[#a89f91]">
            <span>Subtotal</span>
            <span>{formatINR(cartTotal)}</span>
          </div>
          <div className="flex justify-between text-[#a89f91]">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
          </div>
          {cartTotal < storeInfo.freeDeliveryAbove && deliveryFee > 0 && (
            <p className="text-xs text-[#d97757]">Add {formatINR(storeInfo.freeDeliveryAbove - cartTotal)} more for free delivery</p>
          )}
          <div className="border-t border-[#2a221b] pt-2 mt-2 flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
        </div>

        <Link
          to="/checkout"
          className="block bg-[#d97757] text-white text-center py-4 rounded-lg hover:bg-[#c96649] min-h-[44px] flex items-center justify-center font-semibold"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
