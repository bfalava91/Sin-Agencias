
-- Add images column to listings table
ALTER TABLE listings ADD COLUMN images text[] DEFAULT '{}';
