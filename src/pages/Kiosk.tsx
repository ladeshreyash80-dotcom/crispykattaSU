import { Link } from 'react-router-dom'
import { Menu as MenuIcon } from 'lucide-react'
import { storeInfo } from '../lib/data'

export default function Kiosk() {
  return (
    <div className="min-h-screen bg-[#0f0b09] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{storeInfo.name}</h1>
        <p className="text-xl md:text-2xl text-[#a89f91] mb-8">{storeInfo.tagline}</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-[#d97757] text-white px-8 py-4 rounded-lg text-lg hover:bg-[#c96649] min-h-[44px]"
        >
          <MenuIcon size={24} />
          Browse Menu & Order
        </Link>
      </div>
    </div>
  )
}
