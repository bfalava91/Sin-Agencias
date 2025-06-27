
-- Enable RLS on listings table
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own listings (all statuses)
CREATE POLICY "Users can view their own listings" 
  ON public.listings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to see published listings from others
CREATE POLICY "Users can view active listings" 
  ON public.listings 
  FOR SELECT 
  USING (status = 'active');

-- Policy for users to insert their own listings
CREATE POLICY "Users can create their own listings" 
  ON public.listings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own listings
CREATE POLICY "Users can update their own listings" 
  ON public.listings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own listings
CREATE POLICY "Users can delete their own listings" 
  ON public.listings 
  FOR DELETE 
  USING (auth.uid() = user_id);
