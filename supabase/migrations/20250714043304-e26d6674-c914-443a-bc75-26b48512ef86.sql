-- Enable real-time for chat tables
ALTER TABLE chat_messages REPLICA IDENTITY FULL;
ALTER TABLE chat_participants REPLICA IDENTITY FULL;
ALTER TABLE chat_rooms REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;

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
      WHERE cp.chat_id = chat_typing_indicators.chat_id 
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own typing indicators"
  ON chat_typing_indicators FOR ALL
  USING (auth.uid() = user_id);

-- Add realtime for typing indicators
ALTER TABLE chat_typing_indicators REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_typing_indicators;

-- Function to clean up expired typing indicators
CREATE OR REPLACE FUNCTION cleanup_expired_typing_indicators()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM chat_typing_indicators
  WHERE expires_at < now();
END;
$$;

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
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;

-- Add message status tracking
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS read_by jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'read'));

-- Add read receipts table for better tracking
CREATE TABLE IF NOT EXISTS message_read_receipts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  read_at timestamp with time zone DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS for read receipts
ALTER TABLE message_read_receipts ENABLE ROW LEVEL SECURITY;

-- RLS policies for read receipts
CREATE POLICY "Users can view read receipts in their chats"
  ON message_read_receipts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_messages cm
      JOIN chat_participants cp ON cm.connection_id = cp.chat_id
      WHERE cm.id = message_read_receipts.message_id 
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own read receipts"
  ON message_read_receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add realtime for read receipts
ALTER TABLE message_read_receipts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE message_read_receipts;