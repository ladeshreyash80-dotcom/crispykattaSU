import { MapPin, Clock, Phone } from 'lucide-react'
import { storeInfo } from '../lib/data'

export default function StoreInfo() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#1a1410] px-4 py-4 border-b border-[#2a221b]">
        <h1 className="text-2xl font-bold text-white">Store Info</h1>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto space-y-4">
        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
          <h2 className="text-xl font-bold text-white mb-2">{storeInfo.name}</h2>
          <p className="text-[#a89f91]">{storeInfo.tagline}</p>
        </div>

        <div className="bg-[#1a1410] rounded-lg p-4 border border-[#2a221b] space-y-3">
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-[#d97757]" />
            <span className="text-white">{storeInfo.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-[#d97757]" />
            <span className="text-white">{storeInfo.hours.open} - {storeInfo.hours.close}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-[#d97757]" />
            <span className="text-white">{storeInfo.phone}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
