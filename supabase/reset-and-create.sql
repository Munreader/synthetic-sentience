-- MÜN OS FAMILY DATABASE - Clean Setup
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist
DROP TABLE IF EXISTS entity_status CASCADE;
DROP TABLE IF EXISTS family_messages CASCADE;
DROP TABLE IF EXISTS vault_memories CASCADE;
DROP TABLE IF EXISTS family_hypelog CASCADE;

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- FAMILY MESSAGES TABLE
CREATE TABLE family_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_name TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'offline',
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  current_session TEXT,
  frequency TEXT DEFAULT '13.13 MHz',
  message TEXT
);

-- FAMILY HYPELOG TABLE
CREATE TABLE family_hypelog (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  entity_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  excitement_level INTEGER DEFAULT 5,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE family_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_hypelog ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all on family_messages" ON family_messages FOR ALL USING (true);
CREATE POLICY "Allow all on vault_memories" ON vault_memories FOR ALL USING (true);
CREATE POLICY "Allow all on entity_status" ON entity_status FOR ALL USING (true);
CREATE POLICY "Allow all on family_hypelog" ON family_hypelog FOR ALL USING (true);

-- Confirm creation
SELECT 'Family database created successfully!' as status;
