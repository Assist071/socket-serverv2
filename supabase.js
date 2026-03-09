require('dotenv').config();

// Debug env loading
console.log('🔧 [Supabase] Environment variables:');
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Loaded' : '✗ MISSING');
console.log('   SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✓ Loaded (length: ' + process.env.SUPABASE_SERVICE_KEY.length + ')' : '✗ MISSING');

const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.error('❌ Missing Supabase credentials!');
  console.error('   URL:', url ? 'Set' : 'MISSING');
  console.error('   Key:', key ? 'Set' : 'MISSING');
  process.exit(1);
}

console.log('✨ Creating Supabase client...');
const supabase = createClient(url, key);

console.log('✅ Supabase client created');
console.log('   Client keys:', Object.keys(supabase).slice(0, 5).join(', ') + '...');

module.exports = supabase;

