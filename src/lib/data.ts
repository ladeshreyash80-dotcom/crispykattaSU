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
  { id: 'snacks', dbId: '22222222-2222-4222-8222-000000000001', name: 'Snacks' },
  { id: 'khichdi-patties', dbId: '22222222-2222-4222-8222-000000000002', name: 'Khichdi & Patties' },
  { id: 'burgers', dbId: '22222222-2222-4222-8222-000000000003', name: 'Burgers' },
  { id: 'fries', dbId: '22222222-2222-4222-8222-000000000004', name: 'Fries' },
  { id: 'rolls', dbId: '22222222-2222-4222-8222-000000000005', name: 'Rolls & Wraps' },
  { id: 'momos', dbId: '22222222-2222-4222-8222-000000000006', name: 'Momos' },
  { id: 'sandwiches', dbId: '22222222-2222-4222-8222-000000000007', name: 'Sandwiches' },
  { id: 'pizza', dbId: '22222222-2222-4222-8222-000000000008', name: 'Pizza' },
  { id: 'shakes', dbId: '22222222-2222-4222-8222-000000000009', name: 'Shakes & Desserts' },
  { id: 'beverages', dbId: '22222222-2222-4222-8222-00000000000a', name: 'Mocktails & Tea' },
]

export const menuItems: MenuItem[] = [
  // Snacks
  { id: 'kadhi-samosa', name: 'Kadhi Samosa', description: 'Crispy samosas in kadhi', price: 0, category: 'snacks', veg: true, available: true, popular: true },
  { id: 'samosa', name: 'Samosa', description: 'Crispy potato samosa', price: 0, category: 'snacks', veg: true, available: true },
  { id: 'fries', name: 'Fries', description: 'Crispy golden fries', price: 2000, category: 'snacks', veg: true, available: true, popular: true },
  { id: 'samosa-pav', name: 'Samosa + Pav', description: 'Samosa served with pav', price: 0, category: 'snacks', veg: true, available: true },
  { id: 'kadhi-bhel', name: 'Kadhi Bhel', description: 'Tangy kadhi bhel', price: 0, category: 'snacks', veg: true, available: true },
  { id: 'crispy-vada', name: 'Crispy Vada', description: 'Crispy vada', price: 2500, category: 'snacks', veg: true, available: true },
  { id: 'peri-peri-vada', name: 'Peri Peri Vada', description: 'Spicy peri peri vada', price: 2500, category: 'snacks', veg: true, available: true },
  { id: 'cheese-vada', name: 'Cheese Vada', description: 'Vada with cheese', price: 0, category: 'snacks', veg: true, available: true },
  { id: 'kanda-pohe', name: 'Kanda Pohe', description: 'Classic Maharashtrian pohe', price: 3000, category: 'snacks', veg: true, available: true },
  { id: 'shabudana-vada', name: 'Shabudana Vada', description: 'Crispy sabudana vada', price: 4000, category: 'snacks', veg: true, available: true },
  // Khichdi & Patties
  { id: 'khichdi', name: 'Khichdi', description: 'Comforting rice khichdi', price: 3500, category: 'khichdi-patties', veg: true, available: true },
  { id: 'patties', name: 'Patties', description: 'Crispy patties', price: 2500, category: 'khichdi-patties', veg: true, available: true },
  // Burgers
  { id: 'veggie-crunch-burger', name: 'Veggie Crunch Burger', description: 'Crunchy veggie burger', price: 0, category: 'burgers', veg: true, available: true },
  { id: 'aloo-tikki-burger', name: 'Aloo Tikki Burger', description: 'Aloo tikki burger', price: 0, category: 'burgers', veg: true, available: true },
  { id: 'spicy-paneer-burger', name: 'Spicy Paneer Burger', description: 'Spicy paneer burger', price: 9900, category: 'burgers', veg: true, available: true },
  // Fries
  { id: 'peri-peri-fries', name: 'Peri Peri Fries', description: 'Spicy peri peri fries', price: 2500, category: 'fries', veg: true, available: true },
  { id: 'cheese-fries', name: 'Cheese Fries', description: 'Fries with cheese', price: 4000, category: 'fries', veg: true, available: true },
  // Rolls & Wraps
  { id: 'veg-roll', name: 'Veg Roll', description: 'Vegetable roll', price: 4000, category: 'rolls', veg: true, available: true, popular: true },
  { id: 'aloo-roll', name: 'Aloo Roll', description: 'Aloo roll', price: 4000, category: 'rolls', veg: true, available: true },
  { id: 'paneer-roll', name: 'Paneer Roll', description: 'Paneer roll', price: 5000, category: 'rolls', veg: true, available: true },
  { id: 'paneer-cheese-roll', name: 'Paneer Cheese Roll', description: 'Paneer cheese roll', price: 7000, category: 'rolls', veg: true, available: true },
  // Momos
  { id: 'veg-momos', name: 'Veg Momos', description: 'Vegetable momos', price: 0, category: 'momos', veg: true, available: true },
  { id: 'paneer-fried-momos', name: 'Paneer Fried Momos', description: 'Fried paneer momos', price: 0, category: 'momos', veg: true, available: true },
  { id: 'veg-cheese-momos', name: 'Veg Cheese Momos', description: 'Veg cheese momos', price: 0, category: 'momos', veg: true, available: true },
  { id: 'veg-steam-momos', name: 'Veg Steam Momos', description: 'Steamed veg momos', price: 0, category: 'momos', veg: true, available: true },
  { id: 'paneer-steam-momos', name: 'Paneer Steam Momos', description: 'Steamed paneer momos', price: 0, category: 'momos', veg: true, available: true },
  // Sandwiches
  { id: 'grill-sandwich', name: 'Grill Sandwich', description: 'Grilled sandwich', price: 0, category: 'sandwiches', veg: true, available: true },
  { id: 'paneer-grill-sandwich', name: 'Paneer Grill Sandwich', description: 'Paneer grilled sandwich', price: 0, category: 'sandwiches', veg: true, available: true },
  // Pizza
  { id: 'margherita-pizza', name: 'Margherita Pizza', description: 'Margherita pizza', price: 15900, category: 'pizza', veg: true, available: true },
  { id: 'paneer-tikka-pizza', name: 'Paneer Tikka Pizza', description: 'Paneer tikka pizza', price: 17900, category: 'pizza', veg: true, available: true },
  { id: 'paneer-makhani-pizza', name: 'Paneer Makhani Pizza', description: 'Paneer makhani pizza', price: 18900, category: 'pizza', veg: true, available: true },
  // Shakes & Desserts
  { id: 'cold-coffee', name: 'Cold Coffee', description: 'Cold coffee', price: 0, category: 'shakes', veg: true, available: true },
  { id: 'kitkat-shake', name: 'KitKat Shake', description: 'KitKat milkshake', price: 0, category: 'shakes', veg: true, available: true },
  { id: 'oreo-shake', name: 'Oreo Shake', description: 'Oreo milkshake', price: 0, category: 'shakes', veg: true, available: true },
  { id: 'choco-lava', name: 'Choco Lava', description: 'Choco lava cake', price: 0, category: 'shakes', veg: true, available: true },
  { id: 'brownie', name: 'Brownie', description: 'Chocolate brownie', price: 0, category: 'shakes', veg: true, available: true },
  // Mocktails & Tea
  { id: 'tea', name: 'Tea', description: 'Hot tea', price: 1200, category: 'beverages', veg: true, available: true },
  { id: 'coffee', name: 'Coffee', description: 'Hot coffee', price: 3000, category: 'beverages', veg: true, available: true },
  { id: 'mojito', name: 'Mojito', description: 'Refreshing mojito', price: 4900, category: 'beverages', veg: true, available: true },
  { id: 'kachhi-kairi', name: 'Kachhi Kairi', description: 'Raw mango drink', price: 5900, category: 'beverages', veg: true, available: true },
  { id: 'blue-lagoon', name: 'Blue Lagoon', description: 'Blue lagoon mocktail', price: 4900, category: 'beverages', veg: true, available: true },
  { id: 'orange-blast', name: 'Orange Blast', description: 'Orange blast drink', price: 5900, category: 'beverages', veg: true, available: true },
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
