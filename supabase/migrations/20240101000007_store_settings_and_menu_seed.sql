-- Add stall_photo to store_settings (consistent with frontend expectations)
INSERT INTO store_settings (key, value)
VALUES ('stall_photo', '{"url": null}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Ensure all 10 categories exist (matching frontend)
INSERT INTO categories (id, name, slug, sort_order) VALUES
  ('22222222-2222-4222-8222-000000000001', 'Snacks', 'snacks', 1),
  ('22222222-2222-4222-8222-000000000002', 'Khichdi & Patties', 'khichdi-patties', 2),
  ('22222222-2222-4222-8222-000000000003', 'Burgers', 'burgers', 3),
  ('22222222-2222-4222-8222-000000000004', 'Fries', 'fries', 4),
  ('22222222-2222-4222-8222-000000000005', 'Rolls & Wraps', 'rolls', 5),
  ('22222222-2222-4222-8222-000000000006', 'Momos', 'momos', 6),
  ('22222222-2222-4222-8222-000000000007', 'Sandwiches', 'sandwiches', 7),
  ('22222222-2222-4222-8222-000000000008', 'Pizza', 'pizza', 8),
  ('22222222-2222-4222-8222-000000000009', 'Shakes & Desserts', 'shakes', 9),
  ('22222222-2222-4222-8222-00000000000a', 'Mocktails & Tea', 'beverages', 10)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, slug = EXCLUDED.slug, sort_order = EXCLUDED.sort_order;
