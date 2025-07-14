-- Set replica identity for existing tables (if not already set)
DO $$
BEGIN
  -- Only set replica identity if not already FULL
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c 
    JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE n.nspname = 'public' AND c.relname = 'chat_messages' 
    AND c.relreplident = 'f'
  ) THEN
    ALTER TABLE chat_messages REPLICA IDENTITY FULL;
  END IF;
END $$;

-- Add typing indicators table
CREATE TABLE IF NOT EXISTS chat_typing_indicators (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid NOT NULL,
  user_id uuid NOT NULL,
  is_typing boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '10 seconds'),
  UNIQUE(chat_id, user_id)
);

-- Enable RLS for typing indicators
ALTER TABLE chat_typing_indicators ENABLE ROW LEVEL SECURITY;

-- RLS policies for typing indicators
CREATE POLICY "Users can view typing indicators in their chats"
  ON chat_typing_indicators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants cp
      WHERE cp.chat_id = chat_typing_indicators.chat_id::text
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own typing indicators"
  ON chat_typing_indicators FOR ALL
  USING (auth.uid() = user_id);

-- Add realtime for typing indicators
ALTER TABLE chat_typing_indicators REPLICA IDENTITY FULL;

-- Add presence tracking table
CREATE TABLE IF NOT EXISTS user_presence (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL,
  status text DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  last_seen timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for user presence
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- RLS policies for presence
CREATE POLICY "Anyone can view user presence"
  ON user_presence FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own presence"
  ON user_presence FOR ALL
  USING (auth.uid() = user_id);

-- Add realtime for presence
ALTER TABLE user_presence REPLICA IDENTITY FULL;

-- Add message status columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'chat_messages' AND column_name = 'read_by') THEN
    ALTER TABLE chat_messages ADD COLUMN read_by jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'chat_messages' AND column_name = 'status') THEN
    ALTER TABLE chat_messages ADD COLUMN status text DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'read'));
  END IF;
END $$;