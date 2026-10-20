import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { categories, menuItems } from '../lib/data'
import { useStore } from '../lib/store'
import { formatINR } from '../lib/money'

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { addToCart, cart, updateQuantity } = useStore()

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory)

  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cart.find(ci => ci.menuItem.id === itemId)
    return cartItem?.quantity || 0
  }

  return (
    <div className="min-h-screen">
      <div className="bg-[#1a1410] px-4 py-4 sticky top-0 z-10 border-b border-[#2a221b]">
        <h1 className="text-2xl font-bold text-white mb-4">Menu</h1>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] ${
              selectedCategory === 'all'
                ? 'bg-[#d97757] text-white'
                : 'bg-[#2a221b] text-[#a89f91] hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] ${
                selectedCategory === cat.id
                  ? 'bg-[#d97757] text-white'
                  : 'bg-[#2a221b] text-[#a89f91] hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredItems.map((item) => {
            const qty = getItemQuantityInCart(item.id)
            return (
              <div
                key={item.id}
                className="bg-[#1a1410] rounded-lg border border-[#2a221b] overflow-hidden flex flex-col sm:flex-row"
              >
                {item.image && (
                  <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 p-4 flex gap-3 items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${item.veg ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {item.veg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>
                    <p className="text-[#a89f91] text-sm mb-2">{item.description}</p>
                    <p className="text-[#d97757] font-bold">{formatINR(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.available || item.price <= 0}
                      className="bg-[#d97757] text-white px-4 py-2 rounded-lg hover:bg-[#c96649] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]"
                      title={item.price <= 0 ? 'Price pending confirmation' : ''}
                    >
                      <Plus size={18} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#2a221b] rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, qty - 1)}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:text-[#d97757]"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-white font-semibold min-w-[30px] text-center">{qty}</span>
                      <button
                        onClick={() => updateQuantity(item.id, qty + 1)}
                        disabled={!item.available}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:text-[#d97757] disabled:opacity-50"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  )}
                  {!item.available && <span className="text-xs text-red-400 mt-1">Unavailable</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
