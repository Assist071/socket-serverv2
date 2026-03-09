require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ FATAL: Supabase configuration missing!');
  console.error('   SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗ MISSING');
  console.error('   SUPABASE_KEY:', SUPABASE_KEY ? '✓' : '✗ MISSING');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

console.log('✅ Supabase client initialized');

module.exports = supabase;

