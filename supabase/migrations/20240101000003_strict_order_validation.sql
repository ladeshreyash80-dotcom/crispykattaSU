-- Create function to validate order items server-side
CREATE OR REPLACE FUNCTION validate_order_items()
RETURNS TRIGGER AS $$
DECLARE
  menu_item RECORD;
BEGIN
  -- Fetch the menu item (canonical data from DB)
  SELECT id, price, available, name INTO menu_item
  FROM public.menu_items
  WHERE id = NEW.menu_item_id;
  
  -- Validate item exists
  IF menu_item.id IS NULL THEN
    RAISE EXCEPTION 'Menu item not found: %', NEW.menu_item_id;
  END IF;
  
  -- Validate item is available
  IF NOT menu_item.available THEN
    RAISE EXCEPTION 'Menu item is not available: %', menu_item.name;
  END IF;
  
  -- Validate quantity is positive (additional to CHECK constraint)
  IF NEW.quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than zero';
  END IF;
  
  -- Override client-submitted values with canonical DB values
  -- This prevents price manipulation and fake item names
  NEW.menu_item_price := menu_item.price;
  NEW.menu_item_name := menu_item.name;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS validate_order_item_before_insert ON order_items;
CREATE TRIGGER validate_order_item_before_insert
  BEFORE INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION validate_order_items();
