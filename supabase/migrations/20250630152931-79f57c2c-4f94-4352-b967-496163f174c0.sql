
-- First, let's add the user_id column and make it reference auth.users
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing records to set user_id = id (since id currently holds the auth user id)
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

-- Make user_id NOT NULL now that we've populated it
ALTER TABLE public.profiles 
  ALTER COLUMN user_id SET NOT NULL;

-- Add unique constraint to enforce one profile per user (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_user_id' 
        AND conrelid = 'public.profiles'::regclass
    ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT unique_user_id UNIQUE (user_id);
    END IF;
END $$;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- RLS Policies for profiles table
-- SELECT: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Update the handle_new_user function to use user_id instead of id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  meta_role TEXT;
  safe_role user_role;
BEGIN
  meta_role := NEW.raw_user_meta_data ->> 'role';

  -- Validate the role and default to 'tenant' if invalid
  IF meta_role = 'landlord' THEN
    safe_role := 'landlord';
  ELSE
    safe_role := 'tenant';
  END IF;

  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    safe_role
  );

  RETURN NEW;
END;
$function$
