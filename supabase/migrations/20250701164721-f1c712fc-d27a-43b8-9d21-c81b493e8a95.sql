
-- Add foreign key constraints to the messages table to properly link with profiles
ALTER TABLE public.messages 
ADD CONSTRAINT messages_from_user_id_fkey 
FOREIGN KEY (from_user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_to_user_id_fkey 
FOREIGN KEY (to_user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key constraint to link messages with listings
ALTER TABLE public.messages 
ADD CONSTRAINT messages_listing_id_fkey 
FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;
