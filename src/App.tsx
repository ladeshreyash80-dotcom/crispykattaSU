import { Routes, Route } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Track from './pages/Track'
import KattaCard from './pages/KattaCard'
import HostelWars from './pages/HostelWars'
import StoreInfo from './pages/StoreInfo'
import Admin from './pages/Admin'
import Kiosk from './pages/Kiosk'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="confirmation/:orderId" element={<Confirmation />} />
          <Route path="track/:orderId" element={<Track />} />
          <Route path="katta-card" element={<KattaCard />} />
          <Route path="hostel-wars" element={<HostelWars />} />
          <Route path="store" element={<StoreInfo />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/kiosk" element={<Kiosk />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </StoreProvider>
  )
}

export default App
