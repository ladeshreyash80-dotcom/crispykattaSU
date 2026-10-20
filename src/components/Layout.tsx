import { Outlet, Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Home, Menu as MenuIcon, Gift, Swords } from 'lucide-react'
import { useStore } from '../lib/store'

export default function Layout() {
  const { cartCount } = useStore()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'HOME' },
    { path: '/menu', icon: MenuIcon, label: 'MENU' },
    { path: '/katta-card', icon: Gift, label: 'REWARDS' },
    { path: '/hostel-wars', icon: Swords, label: 'WARS' },
    { path: '/cart', icon: ShoppingCart, label: 'CART', badge: cartCount },
  ]

  return (
    <div className="min-h-screen bg-[#0f0b09] flex flex-col">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0705] border-t-2 border-yellow-400/50 px-1 py-1.5">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/')
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-1.5 min-w-[48px] min-h-[48px] rounded-lg transition-all ${
                  isActive ? 'text-yellow-400' : 'text-[#a89f91] hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon size={22} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 font-bold">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] mt-0.5 font-bold tracking-wide">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
