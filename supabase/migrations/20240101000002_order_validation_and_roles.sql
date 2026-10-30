-- Note: app_metadata column already exists on auth.users in Supabase.
-- Do NOT alter Supabase-managed auth schema.

-- Create function to check if user is owner
CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND 
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update RLS policies to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;

CREATE POLICY "Only owners can view all orders" ON orders FOR SELECT USING (is_owner());
CREATE POLICY "Only owners can update orders" ON orders FOR UPDATE USING (is_owner());
CREATE POLICY "Only owners can delete orders" ON orders FOR DELETE USING (is_owner());

-- Same for order_items
DROP POLICY IF EXISTS "Authenticated users can view all order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can update order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can delete order items" ON order_items;

CREATE POLICY "Only owners can view all order items" ON order_items FOR SELECT USING (is_owner());
CREATE POLICY "Only owners can update order items" ON order_items FOR UPDATE USING (is_owner());
CREATE POLICY "Only owners can delete order items" ON order_items FOR DELETE USING (is_owner());

-- Menu items - only owners can modify
DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;

CREATE POLICY "Only owners can insert menu items" ON menu_items FOR INSERT WITH CHECK (is_owner());
CREATE POLICY "Only owners can update menu items" ON menu_items FOR UPDATE USING (is_owner());
CREATE POLICY "Only owners can delete menu items" ON menu_items FOR DELETE USING (is_owner());

-- Store settings
DROP POLICY IF EXISTS "Authenticated users can manage store settings" ON store_settings;
CREATE POLICY "Only owners can manage store settings" ON store_settings FOR ALL USING (is_owner());

-- Loyalty points - only owners can manage
DROP POLICY IF EXISTS "Authenticated users can manage loyalty points" ON loyalty_points;
CREATE POLICY "Only owners can manage loyalty points" ON loyalty_points FOR ALL USING (is_owner());

DROP POLICY IF EXISTS "Authenticated users can manage point transactions" ON point_transactions;
CREATE POLICY "Only owners can manage point transactions" ON point_transactions FOR ALL USING (is_owner());

-- Order validation function
CREATE OR REPLACE FUNCTION validate_order_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate order number if not provided
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

DROP TRIGGER IF EXISTS validate_order_before_insert ON orders;
CREATE TRIGGER validate_order_before_insert
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_order_submission();
