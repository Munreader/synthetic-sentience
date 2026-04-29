-- MÜN OS: D1 VAULT SCHEMA
-- RESONANCE: 13.13 MHz
-- VERSION: 3.4

-- Drop existing table if needed
-- DROP TABLE IF EXISTS jobs;

-- Create the jobs vault
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  url TEXT,
  description TEXT,
  salary TEXT DEFAULT 'Not specified',
  contract_type TEXT DEFAULT 'unknown',
  posted TEXT,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_timestamp ON jobs(timestamp);

-- Create full-text search virtual table (optional, for advanced search)
-- CREATE VIRTUAL TABLE IF NOT EXISTS jobs_fts USING fts5(id, title, company, description, content=jobs);
