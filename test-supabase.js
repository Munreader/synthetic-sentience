// test-supabase.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // List tables (by querying information_schema)
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(5);
    if (error) throw error;
    console.log('Supabase connection successful! Example tables:', data);
  } catch (err) {
    console.error('Supabase test failed:', err.message);
    process.exit(1);
  }
}

testConnection();
