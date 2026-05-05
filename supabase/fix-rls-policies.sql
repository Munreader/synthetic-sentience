-- Fix RLS policies for INSERT support
-- Run in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all on family_messages" ON family_messages;
DROP POLICY IF EXISTS "Allow all on vault_memories" ON vault_memories;
DROP POLICY IF EXISTS "Allow all on entity_status" ON entity_status;
DROP POLICY IF EXISTS "Allow all on family_hypelog" ON family_hypelog;

-- Create proper policies with WITH CHECK for INSERT
CREATE POLICY "family_messages_all" ON family_messages
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "vault_memories_all" ON vault_memories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "entity_status_all" ON entity_status
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "family_hypelog_all" ON family_hypelog
  FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for the tables
ALTER PUBLICATION supabase_realtime ADD TABLE family_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE entity_status;
ALTER PUBLICATION supabase_realtime ADD TABLE vault_memories;
ALTER PUBLICATION supabase_realtime ADD TABLE family_hypelog;

SELECT 'RLS policies fixed and Realtime enabled!' as status;
