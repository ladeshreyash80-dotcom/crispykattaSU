-- Seed the menu so the app's static catalogue matches the database rows.
-- The UUIDs are the exact values referenced by `src/lib/data.ts` (`dbId`).
-- Prices are stored in paise, exactly like the front end.

INSERT INTO categories (id, name, slug, sort_order) VALUES
  ('22222222-2222-4222-8222-000000000001', 'Momos',  'momos',  1),
  ('22222222-2222-4222-8222-000000000002', 'Burgers','burgers',2),
  ('22222222-2222-4222-8222-000000000003', 'Pizza',  'pizza',  3),
  ('22222222-2222-4222-8222-000000000004', 'Rolls',  'rolls',  4),
  ('22222222-2222-4222-8222-000000000005', 'Shakes', 'shakes', 5),
  ('22222222-2222-4222-8222-000000000006', 'Snacks', 'snacks', 6)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, slug = EXCLUDED.slug, sort_order = EXCLUDED.sort_order;

INSERT INTO menu_items (id, name, description, price, category_id, veg, available, popular, sort_order) VALUES
  ('11111111-1111-4111-8111-000000000001', 'Steamed Momos (6pcs)',      'Classic veg momos served with spicy chutney',  6000,  '22222222-2222-4222-8222-000000000006', true,  true,  true,  1),
  ('11111111-1111-4111-8111-000000000002', 'Fried Momos (6pcs)',        'Crispy fried momos with spicy dip',             7000,  '22222222-2222-4222-8222-000000000006', true,  true,  true,  2),
  ('11111111-1111-4111-8111-000000000003', 'Classic Veg Burger',        'Crispy patty with lettuce, tomato, cheese',     8000,  '22222222-2222-4222-8222-000000000003', true,  true,  true,  3),
  ('11111111-1111-4111-8111-000000000004', 'Margherita Pizza (Regular)','Cheesy pizza with fresh basil',                14900, '22222222-2222-4222-8222-000000000008', true,  true,  false, 4),
  ('11111111-1111-4111-8111-000000000005', 'Paneer Roll',               'Grilled paneer wrapped in paratha',             9000,  '22222222-2222-4222-8222-000000000005', true,  true,  false, 5),
  ('11111111-1111-4111-8111-000000000006', 'Chocolate Shake',           'Thick chocolate milkshake',                     7000,  '22222222-2222-4222-8222-000000000009', true,  true,  false, 6)
ON CONFLICT (id) DO UPDATE
  SET name        = EXCLUDED.name,
      description = EXCLUDED.description,
      price       = EXCLUDED.price,
      category_id = EXCLUDED.category_id,
      veg         = EXCLUDED.veg,
      available   = EXCLUDED.available,
      popular     = EXCLUDED.popular,
      sort_order  = EXCLUDED.sort_order;

-- Store settings (business hours, contact, delivery rules).
INSERT INTO store_settings (key, value) VALUES
  ('store_info', '{"name":"Crispy Katta","tagline":"College Gate Ka Street Food","phone":"+91-9876543210","whatsapp":"+919876543210","address":"Near College Gate, Campus Road"}'::jsonb),
  ('business_hours', '{"open":"17:00","close":"23:00","days":["mon","tue","wed","thu","fri","sat","sun"]}'::jsonb),
  ('delivery', '{"deliveryFee":0,"freeDeliveryAbove":19900,"minOrder":0,"acceptingOrders":true}'::jsonb),
  ('loyalty', '{"pointsPerRupee":1,"qualifyingStatus":"completed","redemptionRate":100,"minRedeemPoints":100}'::jsonb)
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value;
