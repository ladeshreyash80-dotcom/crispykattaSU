export interface MenuItem {
  /** Stable client-side identifier (also used as the React key). */
  id: string
  /**
   * Primary key of the matching row in the Supabase `menu_items` table.
   * Kept in sync with `supabase/migrations/20240101000004_seed_menu.sql`.
   * Orders reference this value so the `order_items.menu_item_id` foreign key
   * resolves instead of failing on a non-UUID slug.
   */
  dbId?: string
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
  /** Primary key of the matching row in the Supabase `categories` table. */
  dbId?: string
  name: string
  icon?: string
}

export const categories: Category[] = [
  { id: 'momos', dbId: '22222222-2222-4222-8222-000000000001', name: 'Momos' },
  { id: 'burgers', dbId: '22222222-2222-4222-8222-000000000002', name: 'Burgers' },
  { id: 'pizza', dbId: '22222222-2222-4222-8222-000000000003', name: 'Pizza' },
  { id: 'rolls', dbId: '22222222-2222-4222-8222-000000000004', name: 'Rolls' },
  { id: 'shakes', dbId: '22222222-2222-4222-8222-000000000005', name: 'Shakes' },
  { id: 'snacks', dbId: '22222222-2222-4222-8222-000000000006', name: 'Snacks' },
]

export const menuItems: MenuItem[] = [
  {
    id: 'momo-steam-6',
    dbId: '11111111-1111-4111-8111-000000000001',
    name: 'Steamed Momos (6pcs)',
    description: 'Classic veg momos served with spicy chutney',
    price: 6000, // ₹60
    category: 'momos',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&h=600&fit=crop',
    veg: true,
    available: true,
    popular: true,
  },
  {
    id: 'momo-fry-6',
    dbId: '11111111-1111-4111-8111-000000000002',
    name: 'Fried Momos (6pcs)',
    description: 'Crispy fried momos with spicy dip',
    price: 7000,
    category: 'momos',
    image: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=800&h=600&fit=crop',
    veg: true,
    available: true,
    popular: true,
  },
  {
    id: 'burger-classic',
    dbId: '11111111-1111-4111-8111-000000000003',
    name: 'Classic Veg Burger',
    description: 'Crispy patty with lettuce, tomato, cheese',
    price: 8000,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    veg: true,
    available: true,
    popular: true,
  },
  {
    id: 'pizza-margherita',
    dbId: '11111111-1111-4111-8111-000000000004',
    name: 'Margherita Pizza (Regular)',
    description: 'Cheesy pizza with fresh basil',
    price: 14900,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
    veg: true,
    available: true,
  },
  {
    id: 'roll-paneer',
    dbId: '11111111-1111-4111-8111-000000000005',
    name: 'Paneer Roll',
    description: 'Grilled paneer wrapped in paratha',
    price: 9000,
    category: 'rolls',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
    veg: true,
    available: true,
  },
  {
    id: 'shake-chocolate',
    dbId: '11111111-1111-4111-8111-000000000006',
    name: 'Chocolate Shake',
    description: 'Thick chocolate milkshake',
    price: 7000,
    category: 'shakes',
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&h=600&fit=crop',
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
