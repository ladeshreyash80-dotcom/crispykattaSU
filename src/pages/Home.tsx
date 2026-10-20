import { Link } from 'react-router-dom'
import { storeInfo, menuItems } from '../lib/data'

export default function Home() {
  const popularItems = menuItems.filter(item => item.popular).slice(0, 4)

  return (
    <div className="min-h-screen pb-4">
      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-condensed text-3xl sm:text-4xl tracking-tight text-white uppercase">
              {storeInfo.name}
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white text-xs font-bold uppercase">
              OPEN
            </span>
          </div>
          <p className="text-[#a89f91] text-sm">{storeInfo.tagline}</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 mb-6">
        <div className="max-w-md mx-auto relative rounded-2xl overflow-hidden border border-[#2a221b] shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop" 
            alt="Indian college street food stall with momos, burgers, rolls and chai" 
            className="w-full h-48 sm:h-56 object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/assets/hero-stall.svg'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
            <div className="mb-3">
              <h2 className="font-condensed text-4xl sm:text-5xl text-white uppercase leading-none mb-2">
                HOT FRESH
                <br />
                <span className="relative inline-block">
                  STREET FOOD
                  <span className="absolute bottom-1 left-0 w-full h-1 bg-yellow-400"></span>
                </span>
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/menu"
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-center py-3 rounded-lg font-bold text-base uppercase tracking-wide shadow-lg transition-all min-h-[48px] flex items-center justify-center"
              >
                ORDER NOW
              </Link>
              <Link
                to="/menu"
                className="w-full bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 text-center py-3 rounded-lg font-bold text-base uppercase tracking-wide transition-all min-h-[48px] flex items-center justify-center"
              >
                SEE THE MENU
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Ticker */}
      <section className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-2">
          <div className="flex animate-marquee">
            <div className="flex-shrink-0 flex items-center gap-8 px-4 text-black font-bold text-sm uppercase whitespace-nowrap">
              <span>🔥 HOT MOMOS • FRESH BURGERS • CRISPY ROLLS • STEAMING CHAI 🔥</span>
              <span>🔥 HOT MOMOS • FRESH BURGERS • CRISPY ROLLS • STEAMING CHAI 🔥</span>
              <span>🔥 HOT MOMOS • FRESH BURGERS • CRISPY ROLLS • STEAMING CHAI 🔥</span>
            </div>
            <div className="flex-shrink-0 flex items-center gap-8 px-4 text-black font-bold text-sm uppercase whitespace-nowrap">
              <span>🔥 HOT MOMOS • FRESH BURGERS • CRISPY ROLLS • STEAMING CHAI 🔥</span>
              <span>🔥 HOT MOMOS • FRESH BURGERS • CRISPY ROLLS • STEAMING CHAI 🔥</span>
              <span>🔥 HOT MOMOS • FRESH BURGERS • CRISPY ROLLS • STEAMING CHAI 🔥</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="px-4 mb-6">
        <div className="max-w-md mx-auto">
          <h2 className="font-condensed text-2xl text-white uppercase mb-4 tracking-wide">
            {popularItems.length > 0 ? 'POPULAR PICKS' : 'OUR MENU'}
          </h2>
          <div className="space-y-3">
            {(popularItems.length > 0 ? popularItems : menuItems.slice(0, 4)).map((item) => (
              <Link
                key={item.id}
                to="/menu"
                className="block bg-gradient-to-r from-[#15100c] to-[#1a1410] rounded-lg overflow-hidden border border-[#2a221b] hover:border-yellow-400/50 hover:shadow-lg transition-all"
              >
                {item.image && (
                  <div className="w-full h-32 overflow-hidden">
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
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-white font-bold text-base">{item.name}</h3>
                    <span className="text-yellow-400 font-bold text-base">{item.price > 0 ? `₹${(item.price / 100).toFixed(0)}` : 'Price TBA'}</span>
                  </div>
                  <p className="text-[#a89f91] text-sm">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/menu"
            className="block mt-4 text-center text-yellow-400 hover:text-yellow-300 font-bold uppercase text-sm tracking-wide"
          >
            VIEW FULL MENU →
          </Link>
        </div>
      </section>
    </div>
  )
}
