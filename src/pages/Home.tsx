import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MapPin, Flame, UtensilsCrossed } from 'lucide-react'
import { storeInfo, menuItems } from '../lib/data'

export default function Home() {
  const popularItems = menuItems.filter(item => item.popular)

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-[#1a1410] via-[#0f0b09] to-[#0a0706] px-4 py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#d97757] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#f59e0b] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#d97757]/10 border border-[#d97757]/30 rounded-full px-4 py-1 mb-4">
              <Flame size={16} className="text-[#d97757]" />
              <span className="text-[#d97757] text-sm font-medium">Hot & Fresh</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">{storeInfo.name}</h1>
            <p className="text-xl text-[#a89f91] mb-6">{storeInfo.tagline}</p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d97757] to-[#c96649] text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-[#d97757]/30 transition-all min-h-[52px] text-lg font-semibold"
            >
              <UtensilsCrossed size={20} />
              Order Now <ArrowRight size={20} />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#a89f91]">
            <div className="flex items-center gap-2 bg-[#1a1410]/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#2a221b]">
              <Clock size={18} className="text-[#d97757]" />
              <span>{storeInfo.hours.open} - {storeInfo.hours.close}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1a1410]/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#2a221b]">
              <MapPin size={18} className="text-[#d97757]" />
              <span>{storeInfo.address}</span>
            </div>
          </div>
        </div>
      </div>
      {popularItems.length > 0 && (
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flame size={24} className="text-[#d97757]" />
                Popular Picks
              </h2>
              <Link to="/menu" className="text-[#d97757] hover:text-[#c96649] flex items-center gap-1 text-sm font-medium">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularItems.map((item) => (
                <Link
                  key={item.id}
                  to="/menu"
                  className="group bg-gradient-to-br from-[#1a1410] to-[#15100c] rounded-xl p-5 border border-[#2a221b] hover:border-[#d97757] hover:shadow-lg hover:shadow-[#d97757]/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold text-lg group-hover:text-[#d97757] transition-colors">{item.name}</h3>
                    <span className="text-[#d97757] font-bold text-lg">₹{(item.price / 100).toFixed(0)}</span>
                  </div>
                  <p className="text-[#a89f91] text-sm leading-relaxed">{item.description}</p>
                  <div className="mt-3 text-xs text-[#d97757] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Add to cart <ArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
