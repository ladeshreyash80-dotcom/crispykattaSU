-- Create function to validate order items server-side
CREATE OR REPLACE FUNCTION validate_order_items()
RETURNS TRIGGER AS $$
DECLARE
  menu_item RECORD;
  calculated_subtotal INTEGER := 0;
  order_total INTEGER := 0;
BEGIN
  -- Fetch the menu item
  SELECT id, price, available INTO menu_item
  FROM public.menu_items
  WHERE id = NEW.menu_item_id;
  
  -- Validate item exists and is available
  IF menu_item.id IS NULL THEN
    RAISE EXCEPTION 'Menu item not found';
  END IF;
  
  IF NOT menu_item.available THEN
    RAISE EXCEPTION 'Menu item is not available';
  END IF;
  
  -- Store the canonical price from DB, not client-submitted
  NEW.menu_item_price := menu_item.price;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS validate_order_item_before_insert ON order_items;
CREATE TRIGGER validate_order_item_before_insert
  BEFORE INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION validate_order_items();
