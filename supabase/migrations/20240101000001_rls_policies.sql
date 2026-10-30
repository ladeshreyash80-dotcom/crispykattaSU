-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Categories: read-only for everyone
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Menu items: read-only for everyone (customers browse), write only for authenticated users
DROP POLICY IF EXISTS "Menu items are viewable by everyone" ON menu_items;
CREATE POLICY "Menu items are viewable by everyone" ON menu_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
CREATE POLICY "Authenticated users can insert menu items" ON menu_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;
CREATE POLICY "Authenticated users can update menu items" ON menu_items FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;
CREATE POLICY "Authenticated users can delete menu items" ON menu_items FOR DELETE USING (auth.role() = 'authenticated');

-- Orders: anyone can create orders (customers without accounts), authenticated can read/update all
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
CREATE POLICY "Authenticated users can view all orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
CREATE POLICY "Authenticated users can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;
CREATE POLICY "Authenticated users can delete orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- Order items: anyone can create when placing order, authenticated can read
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can view all order items" ON order_items;
CREATE POLICY "Authenticated users can view all order items" ON order_items FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can update order items" ON order_items;
CREATE POLICY "Authenticated users can update order items" ON order_items FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can delete order items" ON order_items;
CREATE POLICY "Authenticated users can delete order items" ON order_items FOR DELETE USING (auth.role() = 'authenticated');

-- Loyalty points: SECURITY FIX - users can ONLY view their OWN loyalty points
-- Removed OR auth.role() = 'authenticated' which allowed any authenticated user to read ALL records
DROP POLICY IF EXISTS "Users can view own loyalty points" ON loyalty_points;
CREATE POLICY "Users can view own loyalty points" ON loyalty_points FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Authenticated users can manage loyalty points" ON loyalty_points;
CREATE POLICY "Authenticated users can manage loyalty points" ON loyalty_points FOR ALL USING (auth.role() = 'authenticated');

-- Point transactions: SECURITY FIX - users can ONLY view their OWN transactions
-- Removed OR auth.role() = 'authenticated' which allowed any authenticated user to read ALL records
DROP POLICY IF EXISTS "Users can view own point transactions" ON point_transactions;
CREATE POLICY "Users can view own point transactions" ON point_transactions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Authenticated users can manage point transactions" ON point_transactions;
CREATE POLICY "Authenticated users can manage point transactions" ON point_transactions FOR ALL USING (auth.role() = 'authenticated');

-- Store settings: readable by everyone, writable only by authenticated
DROP POLICY IF EXISTS "Store settings are viewable by everyone" ON store_settings;
CREATE POLICY "Store settings are viewable by everyone" ON store_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage store settings" ON store_settings;
CREATE POLICY "Authenticated users can manage store settings" ON store_settings FOR ALL USING (auth.role() = 'authenticated');
