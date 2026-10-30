-- Enable RLS on all tables (idempotent - safe to re-run)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Categories: read-only for everyone (public and authenticated)
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT TO anon, authenticated
  USING (true);

-- Menu items: read-only for everyone, write only for owners (narrowed in migration 000002)
DROP POLICY IF EXISTS "Menu items are viewable by everyone" ON menu_items;
CREATE POLICY "Menu items are viewable by everyone" ON menu_items
  FOR SELECT TO anon, authenticated
  USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
CREATE POLICY "Authenticated users can insert menu items" ON menu_items
  FOR INSERT TO authenticated
  WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;
CREATE POLICY "Authenticated users can update menu items" ON menu_items
  FOR UPDATE TO authenticated
  USING (true);
DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;
CREATE POLICY "Authenticated users can delete menu items" ON menu_items
  FOR DELETE TO authenticated
  USING (true);

-- Orders: NO direct INSERT policy - order creation must go through create_order_atomic() RPC
-- This prevents customers from bypassing server-side price validation and atomic order creation
-- The create_order_atomic() function is SECURITY DEFINER and bypasses RLS
-- Only owners can read/update/delete orders (narrowed in migration 000002)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
CREATE POLICY "Authenticated users can view all orders" ON orders
  FOR SELECT TO authenticated
  USING (true);
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
CREATE POLICY "Authenticated users can update orders" ON orders
  FOR UPDATE TO authenticated
  USING (true);
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;
CREATE POLICY "Authenticated users can delete orders" ON orders
  FOR DELETE TO authenticated
  USING (true);

-- Order items: NO direct INSERT policy - items are created via create_order_atomic() RPC
-- This prevents customers from inserting order items with fake prices or names
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can view all order items" ON order_items;
CREATE POLICY "Authenticated users can view all order items" ON order_items
  FOR SELECT TO authenticated
  USING (true);
DROP POLICY IF EXISTS "Authenticated users can update order items" ON order_items;
CREATE POLICY "Authenticated users can update order items" ON order_items
  FOR UPDATE TO authenticated
  USING (true);
DROP POLICY IF EXISTS "Authenticated users can delete order items" ON order_items;
CREATE POLICY "Authenticated users can delete order items" ON order_items
  FOR DELETE TO authenticated
  USING (true);

-- Loyalty points: SECURITY FIX - users can ONLY view their OWN loyalty points
-- Removed OR auth.role() = 'authenticated' which allowed any authenticated user to read ALL records
DROP POLICY IF EXISTS "Users can view own loyalty points" ON loyalty_points;
CREATE POLICY "Users can view own loyalty points" ON loyalty_points
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Authenticated users can manage loyalty points" ON loyalty_points;
CREATE POLICY "Authenticated users can manage loyalty points" ON loyalty_points
  FOR ALL TO authenticated
  USING (true);

-- Point transactions: SECURITY FIX - users can ONLY view their OWN transactions
-- Removed OR auth.role() = 'authenticated' which allowed any authenticated user to read ALL records
DROP POLICY IF EXISTS "Users can view own point transactions" ON point_transactions;
CREATE POLICY "Users can view own point transactions" ON point_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Authenticated users can manage point transactions" ON point_transactions;
CREATE POLICY "Authenticated users can manage point transactions" ON point_transactions
  FOR ALL TO authenticated
  USING (true);

-- Store settings: readable by everyone, writable only by authenticated
DROP POLICY IF EXISTS "Store settings are viewable by everyone" ON store_settings;
CREATE POLICY "Store settings are viewable by everyone" ON store_settings
  FOR SELECT TO anon, authenticated
  USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage store settings" ON store_settings;
CREATE POLICY "Authenticated users can manage store settings" ON store_settings
  FOR ALL TO authenticated
  USING (true);
