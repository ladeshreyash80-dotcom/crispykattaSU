import { Gift, Star } from 'lucide-react'
import { useStore } from '../lib/store'

export default function KattaCard() {
  const { points } = useStore()

  return (
    <div className="min-h-screen">
      <div className="bg-[#1a1410] px-4 py-4 border-b border-[#2a221b]">
        <h1 className="text-2xl font-bold text-white">Katta Card</h1>
        <p className="text-[#a89f91]">Loyalty Rewards</p>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-[#d97757] to-[#f59e0b] rounded-lg p-6 text-center text-black">
          <Star size={48} className="mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-1">Your Points</h2>
          <p className="text-4xl font-bold">{points}</p>
        </div>

        <div className="mt-6 bg-[#1a1410] rounded-lg p-4 border border-[#2a221b]">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={20} className="text-[#d97757]" />
            <h3 className="text-white font-semibold">How it works</h3>
          </div>
          <p className="text-[#a89f91] text-sm">
            Earn points on every order! Points are awarded when orders are completed.
          </p>
        </div>
      </div>
    </div>
  )
}
