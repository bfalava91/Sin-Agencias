
-- Create a table for property listings with all the form fields
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Re-advertising
  is_readvertising BOOLEAN DEFAULT false,
  
  -- Property Details
  postcode TEXT,
  flat_number TEXT,
  address_line_2 TEXT,
  address_line_3 TEXT,
  town TEXT,
  advert_type TEXT,
  property_type TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  furnishing TEXT,
  description TEXT,
  
  -- Tenancy Details
  monthly_rent DECIMAL(10,2),
  weekly_rent DECIMAL(10,2),
  deposit TEXT,
  min_tenancy INTEGER,
  max_tenants INTEGER,
  move_in_date DATE,
  
  -- Features
  bills_included BOOLEAN DEFAULT false,
  garden_access BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  fireplace BOOLEAN DEFAULT false,
  
  -- Tenant Preferences
  students_allowed BOOLEAN DEFAULT false,
  families_allowed BOOLEAN DEFAULT false,
  dss_accepted BOOLEAN DEFAULT false,
  pets_allowed BOOLEAN DEFAULT false,
  smokers_allowed BOOLEAN DEFAULT false,
  students_only BOOLEAN DEFAULT false,
  
  -- Availability
  availability TEXT,
  remote_viewings BOOLEAN DEFAULT false,
  youtube_url TEXT,
  
  -- Status and metadata
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only manage their own listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own listings
CREATE POLICY "Users can view their own listings" 
  ON public.listings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own listings
CREATE POLICY "Users can create their own listings" 
  ON public.listings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own listings
CREATE POLICY "Users can update their own listings" 
  ON public.listings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own listings
CREATE POLICY "Users can delete their own listings" 
  ON public.listings 
  FOR DELETE 
  USING (auth.uid() = user_id);
