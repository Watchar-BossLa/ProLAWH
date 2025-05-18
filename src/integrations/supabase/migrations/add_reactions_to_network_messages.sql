
-- Add reactions column to network_messages table
ALTER TABLE network_messages 
ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '{}'::jsonb;

-- Update existing rows to have empty reactions object
UPDATE network_messages 
SET reactions = '{}'::jsonb 
WHERE reactions IS NULL;
