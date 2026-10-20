import { Outlet, Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Home, Menu as MenuIcon, User, Store } from 'lucide-react'
import { useStore } from '../lib/store'

export default function Layout() {
  const { cartCount } = useStore()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/menu', icon: MenuIcon, label: 'Menu' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { path: '/katta-card', icon: User, label: 'Loyalty' },
    { path: '/store', icon: Store, label: 'Store' },
  ]

  return (
    <div className="min-h-screen bg-[#0f0b09] flex flex-col">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1410] border-t border-[#2a221b] px-2 py-2">
        <div className="max-w-4xl mx-auto flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors ${
                  isActive ? 'text-[#d97757]' : 'text-[#a89f91] hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon size={20} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#d97757] text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
