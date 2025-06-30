
-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true);

-- Create RLS policies for the bucket
CREATE POLICY "Allow authenticated users to upload listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Allow public read access to listing images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-images');

CREATE POLICY "Allow users to update their own listing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
