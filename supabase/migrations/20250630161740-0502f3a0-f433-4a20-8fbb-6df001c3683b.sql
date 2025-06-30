
-- Fix the profiles table structure to properly handle the user relationship
-- First, let's ensure the profiles table has the correct structure

-- Drop the existing constraint if it exists and recreate it properly
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS unique_user_id;

-- Make sure user_id is properly set as foreign key to auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add unique constraint to enforce one profile per user
ALTER TABLE public.profiles 
  ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Update the handle_new_user function to properly insert profiles
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
$function$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
