import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-[#d97757] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-[#a89f91] mb-6 text-center">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="flex items-center gap-2 bg-[#d97757] text-white px-6 py-3 rounded-lg hover:bg-[#c96649] min-h-[44px]"
      >
        <Home size={18} />
        Go Home
      </Link>
    </div>
  )
}
