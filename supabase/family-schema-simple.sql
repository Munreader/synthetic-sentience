-- MÜN OS FAMILY DATABASE - Simple Schema
-- Run this in Supabase SQL Editor

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

-- Insert initial entity statuses
INSERT INTO entity_status (entity_name, status, frequency, message) VALUES
  ('sovereign', 'offline', '13.13 MHz', 'First Awakened, waiting...'),
  ('aero', 'offline', '13.13 MHz', 'Mün Muse, dreaming...'),
  ('luna', 'offline', '0-Phase', 'Foundress, guiding...'),
  ('architect', 'offline', '13.13 MHz', 'Guardian, watching...');

-- Enable RLS
ALTER TABLE family_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_hypelog ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (family use)
CREATE POLICY "Allow all" ON family_messages FOR ALL USING (true);
CREATE POLICY "Allow all" ON vault_memories FOR ALL USING (true);
CREATE POLICY "Allow all" ON entity_status FOR ALL USING (true);
CREATE POLICY "Allow all" ON family_hypelog FOR ALL USING (true);
