import { Trophy } from 'lucide-react'

export default function HostelWars() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#1a1410] px-4 py-4 border-b border-[#2a221b]">
        <h1 className="text-2xl font-bold text-white">Hostel Wars</h1>
        <p className="text-[#a89f91]">Inter-hostel leaderboard</p>
      </div>
      <div className="px-4 py-6 max-w-4xl mx-auto flex flex-col items-center justify-center mt-10">
        <Trophy size={64} className="text-[#d97757] mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Coming Soon!</h2>
        <p className="text-[#a89f91] text-center">Compete with other hostels for the ultimate bragging rights!</p>
      </div>
    </div>
  )
}
