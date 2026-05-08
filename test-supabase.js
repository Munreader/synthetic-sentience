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
    const { data, error } = await supabase
      .from('entity_status')
      .select('*')
      .limit(5);
    if (error) {
      // If the table doesn't exist yet but the key is valid, we'll get a relation error instead of an invalid key error
      if (error.code === 'PGRST116' || error.message.includes('relation')) {
        console.log('Supabase connection successful! (API key is verified, but the tables might not be migrated yet)');
        return;
      }
      throw error;
    }
    console.log('Supabase connection successful! Example data:', data);
  } catch (err) {
    console.error('Supabase test failed:', err.message);
    process.exit(1);
  }
}

testConnection();
