-- Storage buckets for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('stall-photos', 'stall-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('menu-images', 'menu-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: public read, owner-only write
-- Drop existing policies first (idempotent)
DROP POLICY IF EXISTS "Public read access for stall-photos" ON storage.objects;
DROP POLICY IF EXISTS "Owner upload for stall-photos" ON storage.objects;
DROP POLICY IF EXISTS "Owner update for stall-photos" ON storage.objects;
DROP POLICY IF EXISTS "Owner delete for stall-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for menu-images" ON storage.objects;
DROP POLICY IF EXISTS "Owner upload for menu-images" ON storage.objects;
DROP POLICY IF EXISTS "Owner update for menu-images" ON storage.objects;
DROP POLICY IF EXISTS "Owner delete for menu-images" ON storage.objects;

CREATE POLICY "Public read access for stall-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stall-photos');

CREATE POLICY "Owner upload for stall-photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'stall-photos' AND is_owner());

CREATE POLICY "Owner update for stall-photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'stall-photos' AND is_owner())
  WITH CHECK (bucket_id = 'stall-photos' AND is_owner());

CREATE POLICY "Owner delete for stall-photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'stall-photos' AND is_owner());

CREATE POLICY "Public read access for menu-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Owner upload for menu-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-images' AND is_owner());

CREATE POLICY "Owner update for menu-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'menu-images' AND is_owner())
  WITH CHECK (bucket_id = 'menu-images' AND is_owner());

CREATE POLICY "Owner delete for menu-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-images' AND is_owner());
