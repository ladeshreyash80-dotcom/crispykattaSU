-- Security hardening: set safe search_path on SECURITY DEFINER functions
-- This prevents search_path injection attacks

CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND 
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Also fix validate_order_submission
CREATE OR REPLACE FUNCTION validate_order_submission()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix validate_order_items
CREATE OR REPLACE FUNCTION validate_order_items()
RETURNS TRIGGER AS $$
DECLARE
  v_price INTEGER;
  v_available BOOLEAN;
  v_name TEXT;
BEGIN
  SELECT price, available, name INTO v_price, v_available, v_name
  FROM public.menu_items
  WHERE id = NEW.menu_item_id;

  IF v_price IS NULL THEN
    RAISE EXCEPTION 'Menu item not found: %', NEW.menu_item_id;
  END IF;

  IF NOT v_available THEN
    RAISE EXCEPTION 'Menu item not available: %', v_name;
  END IF;

  -- Override client-submitted price with canonical DB price
  NEW.menu_item_price := v_price;
  NEW.menu_item_name := v_name;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix create_order_atomic
CREATE OR REPLACE FUNCTION create_order_atomic(
  p_order_number TEXT,
  p_attempt_id UUID,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_hostel_room TEXT,
  p_order_type TEXT,
  p_notes TEXT,
  p_items JSONB
)
RETURNS TABLE(order_id UUID, order_number TEXT, total INTEGER) AS $$
DECLARE
  v_order_id UUID;
  v_subtotal INTEGER := 0;
  v_item JSONB;
  v_menu_item RECORD;
  v_quantity INTEGER;
  v_existing_order UUID;
BEGIN
  -- Check for duplicate attempt_id
  IF p_attempt_id IS NOT NULL THEN
    SELECT id INTO v_existing_order
    FROM public.orders
    WHERE attempt_id = p_attempt_id;
    
    IF v_existing_order IS NOT NULL THEN
      SELECT o.id, o.order_number, o.total INTO v_order_id, p_order_number, v_subtotal
      FROM public.orders o
      WHERE o.id = v_existing_order;
      RETURN QUERY SELECT v_order_id, p_order_number, v_subtotal;
      RETURN;
    END IF;
  END IF;

  -- Validate and calculate subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := (v_item->>'quantity')::INTEGER;
    
    IF v_quantity <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for item %', v_item->>'menu_item_id';
    END IF;
    
    SELECT id, price, available, name INTO v_menu_item
    FROM public.menu_items
    WHERE id = (v_item->>'menu_item_id')::UUID;
    
    IF v_menu_item.id IS NULL THEN
      RAISE EXCEPTION 'Menu item not found: %', v_item->>'menu_item_id';
    END IF;
    
    IF NOT v_menu_item.available THEN
      RAISE EXCEPTION 'Menu item not available: %', v_menu_item.name;
    END IF;
    
    v_subtotal := v_subtotal + (v_menu_item.price * v_quantity);
  END LOOP;

  -- Create order
  INSERT INTO public.orders (
    order_number, attempt_id, customer_name, customer_phone,
    hostel_room, order_type, subtotal, total, status, notes
  ) VALUES (
    p_order_number, p_attempt_id, p_customer_name, p_customer_phone,
    p_hostel_room, p_order_type, v_subtotal, v_subtotal, 'received', p_notes
  )
  RETURNING id INTO v_order_id;

  -- Create order items with canonical prices
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := (v_item->>'quantity')::INTEGER;
    
    SELECT id, price, name INTO v_menu_item
    FROM public.menu_items
    WHERE id = (v_item->>'menu_item_id')::UUID;
    
    INSERT INTO public.order_items (
      order_id, menu_item_id, menu_item_name, menu_item_price, quantity
    ) VALUES (
      v_order_id, v_menu_item.id, v_menu_item.name, v_menu_item.price, v_quantity
    );
  END LOOP;

  RETURN QUERY SELECT v_order_id, p_order_number, v_subtotal;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

GRANT EXECUTE ON FUNCTION create_order_atomic TO anon, authenticated;
