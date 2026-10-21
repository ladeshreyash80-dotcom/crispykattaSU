import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MapPin } from 'lucide-react'
import { storeInfo, menuItems } from '../lib/data'

export default function Home() {
  const popularItems = menuItems.filter(item => item.popular)

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-[#1a1410] to-[#0f0b09] px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{storeInfo.name}</h1>
              <p className="text-[#a89f91]">{storeInfo.tagline}</p>
            </div>
            <Link
              to="/menu"
              className="bg-[#d97757] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#c96649] transition-colors min-h-[44px]"
            >
              Order Now <ArrowRight size={18} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-[#a89f91] mb-6">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{storeInfo.hours.open} - {storeInfo.hours.close}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{storeInfo.address}</span>
            </div>
          </div>
        </div>
      </div>
      {popularItems.length > 0 && (
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Popular Picks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularItems.map((item) => (
                <Link
                  key={item.id}
                  to="/menu"
                  className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b] hover:border-[#d97757] transition-colors"
                >
                  <h3 className="text-white font-semibold">{item.name}</h3>
                  <p className="text-[#a89f91] text-sm mt-1">{item.description}</p>
                  <p className="text-[#d97757] font-bold mt-2">₹{(item.price / 100).toFixed(0)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
