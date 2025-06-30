
-- Enable RLS on the messages table if not already enabled
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

-- Create RLS policies for messages
CREATE POLICY "Users can view received messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = to_user_id);

CREATE POLICY "Users can view sent messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = from_user_id);

CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = from_user_id);

-- Create indexes for better performance on message queries
CREATE INDEX IF NOT EXISTS idx_messages_to_user_sent_at ON public.messages(to_user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_from_user_sent_at ON public.messages(from_user_id, sent_at DESC);
