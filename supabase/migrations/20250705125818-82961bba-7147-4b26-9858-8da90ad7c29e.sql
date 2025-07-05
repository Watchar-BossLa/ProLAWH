
-- Add missing columns to chat_rooms table
ALTER TABLE public.chat_rooms 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS max_members integer DEFAULT 100;

-- Add missing columns to chat_participants table
ALTER TABLE public.chat_participants 
ADD COLUMN IF NOT EXISTS last_read_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_muted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();

-- Make id column primary key if it's not already
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                WHERE table_name = 'chat_participants' 
                AND constraint_type = 'PRIMARY KEY') THEN
    ALTER TABLE public.chat_participants ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Create typing_indicators table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.typing_indicators (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid NOT NULL,
  user_id uuid NOT NULL,
  is_typing boolean NOT NULL DEFAULT false,
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

-- Create message_reactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL,
  user_id uuid NOT NULL,
  reaction text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

-- Create read_receipts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.read_receipts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL,
  user_id uuid NOT NULL,
  read_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS on new tables if not already enabled
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.read_receipts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for typing_indicators (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'typing_indicators' AND policyname = 'Users can view typing indicators in their chats') THEN
    CREATE POLICY "Users can view typing indicators in their chats" 
      ON public.typing_indicators 
      FOR SELECT 
      USING (
        EXISTS (
          SELECT 1 FROM chat_participants cp 
          WHERE cp.chat_id = typing_indicators.chat_id 
          AND cp.user_id = auth.uid()
        )
      );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'typing_indicators' AND policyname = 'Users can manage their own typing status') THEN
    CREATE POLICY "Users can manage their own typing status" 
      ON public.typing_indicators 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create RLS policies for message_reactions (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'message_reactions' AND policyname = 'Users can view reactions in their chats') THEN
    CREATE POLICY "Users can view reactions in their chats" 
      ON public.message_reactions 
      FOR SELECT 
      USING (
        EXISTS (
          SELECT 1 FROM chat_messages cm
          JOIN chat_participants cp ON cp.chat_id = cm.connection_id::uuid
          WHERE cm.id::text = message_reactions.message_id::text
          AND cp.user_id = auth.uid()
        )
      );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'message_reactions' AND policyname = 'Users can manage their own reactions') THEN
    CREATE POLICY "Users can manage their own reactions" 
      ON public.message_reactions 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create RLS policies for read_receipts (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'read_receipts' AND policyname = 'Users can view read receipts in their chats') THEN
    CREATE POLICY "Users can view read receipts in their chats" 
      ON public.read_receipts 
      FOR SELECT 
      USING (
        EXISTS (
          SELECT 1 FROM chat_messages cm
          JOIN chat_participants cp ON cp.chat_id = cm.connection_id::uuid
          WHERE cm.id::text = read_receipts.message_id::text
          AND cp.user_id = auth.uid()
        )
      );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'read_receipts' AND policyname = 'Users can manage their own read receipts') THEN
    CREATE POLICY "Users can manage their own read receipts" 
      ON public.read_receipts 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;
