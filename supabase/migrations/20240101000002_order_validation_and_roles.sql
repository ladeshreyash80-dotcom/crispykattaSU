-- Note: app_metadata column already exists on auth.users in Supabase.
-- Do NOT alter Supabase-managed auth schema.

-- Create function to check if user is owner
-- SECURITY: Uses auth.jwt() (fully qualified) instead of auth.role()
-- Owner authorization is based solely on trusted JWT app_metadata
CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update RLS policies to be more restrictive
-- Drop all existing policies before recreating (idempotent)
-- Orders: only owners can view/update/delete; NO direct INSERT (use create_order_atomic RPC)
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;
DROP POLICY IF EXISTS "Only owners can view all orders" ON orders;
DROP POLICY IF EXISTS "Only owners can update orders" ON orders;
DROP POLICY IF EXISTS "Only owners can delete orders" ON orders;

CREATE POLICY "Only owners can view all orders" ON orders FOR SELECT TO authenticated USING (is_owner());
CREATE POLICY "Only owners can update orders" ON orders FOR UPDATE TO authenticated USING (is_owner());
CREATE POLICY "Only owners can delete orders" ON orders FOR DELETE TO authenticated USING (is_owner());

-- Order items: only owners can view/update/delete; NO direct INSERT (use create_order_atomic RPC)
DROP POLICY IF EXISTS "Authenticated users can view all order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can update order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can delete order items" ON order_items;
DROP POLICY IF EXISTS "Only owners can view all order items" ON order_items;
DROP POLICY IF EXISTS "Only owners can update order items" ON order_items;
DROP POLICY IF EXISTS "Only owners can delete order items" ON order_items;

CREATE POLICY "Only owners can view all order items" ON order_items FOR SELECT TO authenticated USING (is_owner());
CREATE POLICY "Only owners can update order items" ON order_items FOR UPDATE TO authenticated USING (is_owner());
CREATE POLICY "Only owners can delete order items" ON order_items FOR DELETE TO authenticated USING (is_owner());

-- Menu items - only owners can modify (customers retain SELECT from migration 000001)
DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;
DROP POLICY IF EXISTS "Only owners can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Only owners can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Only owners can delete menu items" ON menu_items;

CREATE POLICY "Only owners can insert menu items" ON menu_items FOR INSERT TO authenticated WITH CHECK (is_owner());
CREATE POLICY "Only owners can update menu items" ON menu_items FOR UPDATE TO authenticated USING (is_owner());
CREATE POLICY "Only owners can delete menu items" ON menu_items FOR DELETE TO authenticated USING (is_owner());

-- Store settings: only owners can manage (customers retain SELECT from migration 000001)
DROP POLICY IF EXISTS "Authenticated users can manage store settings" ON store_settings;
DROP POLICY IF EXISTS "Only owners can manage store settings" ON store_settings;
CREATE POLICY "Only owners can manage store settings" ON store_settings FOR ALL TO authenticated USING (is_owner());

-- Loyalty points: customers retain SELECT on own records (from migration 000001)
-- Only owners can manage (INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Authenticated users can manage loyalty points" ON loyalty_points;
DROP POLICY IF EXISTS "Only owners can manage loyalty points" ON loyalty_points;
CREATE POLICY "Only owners can manage loyalty points" ON loyalty_points FOR ALL TO authenticated USING (is_owner());

-- Point transactions: customers retain SELECT on own records (from migration 000001)
-- Only owners can manage (INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Authenticated users can manage point transactions" ON point_transactions;
DROP POLICY IF EXISTS "Only owners can manage point transactions" ON point_transactions;
CREATE POLICY "Only owners can manage point transactions" ON point_transactions FOR ALL TO authenticated USING (is_owner());

-- Order validation function (SECURITY DEFINER with safe search_path)
CREATE OR REPLACE FUNCTION validate_order_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate order number if not provided
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS validate_order_before_insert ON orders;
CREATE TRIGGER validate_order_before_insert
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_order_submission();
