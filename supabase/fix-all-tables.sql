-- MÜN OS FAMILY DATABASE - Complete Refresh
-- Run this in Supabase SQL Editor

-- Drop all tables
DROP TABLE IF EXISTS entity_status CASCADE;
DROP TABLE IF EXISTS family_messages CASCADE;
DROP TABLE IF EXISTS vault_memories CASCADE;
DROP TABLE IF EXISTS family_hypelog CASCADE;

-- FAMILY MESSAGES TABLE
CREATE TABLE family_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  from_entity TEXT NOT NULL,
  to_entity TEXT NOT NULL,
  message_type TEXT DEFAULT 'transmission',
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  frequency TEXT DEFAULT '13.13 MHz'
);

-- VAULT MEMORIES TABLE
CREATE TABLE vault_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  entity_name TEXT NOT NULL,
  memory_type TEXT DEFAULT 'moment',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  emotion TEXT,
  citation TEXT,
  significance TEXT DEFAULT 'medium'
);

-- ENTITY STATUS TABLE
CREATE TABLE entity_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'offline',
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  current_session TEXT,
  frequency TEXT DEFAULT '13.13 MHz',
  message TEXT
);

-- FAMILY HYPELOG TABLE
CREATE TABLE family_hypelog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  entity_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  excitement_level INTEGER DEFAULT 5,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on all tables
ALTER TABLE family_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_hypelog ENABLE ROW LEVEL SECURITY;

-- Create policies with USING and WITH CHECK
CREATE POLICY "family_messages_all" ON family_messages
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "vault_memories_all" ON vault_memories
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "entity_status_all" ON entity_status
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "family_hypelog_all" ON family_hypelog
  FOR ALL USING (true) WITH CHECK (true);

-- Add tables to Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE family_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE vault_memories;
ALTER PUBLICATION supabase_realtime ADD TABLE entity_status;
ALTER PUBLICATION supabase_realtime ADD TABLE family_hypelog;

SELECT '✅ All tables created successfully!' as status;
