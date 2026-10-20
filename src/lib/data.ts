export interface MenuItem {
  id: string
  name: string
  description: string
  price: number // in paise
  category: string
  image?: string
  veg: boolean
  available: boolean
  popular?: boolean
}

export interface Category {
  id: string
  name: string
  icon?: string
}

export const categories: Category[] = [
  { id: 'momos', name: 'Momos' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'pizza', name: 'Pizza' },
  { id: 'rolls', name: 'Rolls' },
  { id: 'shakes', name: 'Shakes' },
  { id: 'snacks', name: 'Snacks' },
]

export const menuItems: MenuItem[] = [
  {
    id: 'momo-steam-6',
    name: 'Steamed Momos (6pcs)',
    description: 'Classic veg momos served with spicy chutney',
    price: 6000, // ₹60
    category: 'momos',
    veg: true,
    available: true,
    popular: true,
  },
  {
    id: 'momo-fry-6',
    name: 'Fried Momos (6pcs)',
    description: 'Crispy fried momos with spicy dip',
    price: 7000,
    category: 'momos',
    veg: true,
    available: true,
    popular: true,
  },
  {
    id: 'burger-classic',
    name: 'Classic Veg Burger',
    description: 'Crispy patty with lettuce, tomato, cheese',
    price: 8000,
    category: 'burgers',
    veg: true,
    available: true,
    popular: true,
  },
  {
    id: 'pizza-margherita',
    name: 'Margherita Pizza (Regular)',
    description: 'Cheesy pizza with fresh basil',
    price: 14900,
    category: 'pizza',
    veg: true,
    available: true,
  },
  {
    id: 'roll-paneer',
    name: 'Paneer Roll',
    description: 'Grilled paneer wrapped in paratha',
    price: 9000,
    category: 'rolls',
    veg: true,
    available: true,
  },
  {
    id: 'shake-chocolate',
    name: 'Chocolate Shake',
    description: 'Thick chocolate milkshake',
    price: 7000,
    category: 'shakes',
    veg: true,
    available: true,
  },
]

export const storeInfo = {
  name: 'Crispy Katta',
  tagline: 'College Gate Ka Street Food',
  phone: '+91-9876543210',
  whatsapp: '+919876543210',
  address: 'Near College Gate, Campus Road',
  hours: {
    open: '17:00',
    close: '23:00',
  },
  deliveryFee: 0,
  freeDeliveryAbove: 19900, // ₹199
  minOrder: 0,
}
