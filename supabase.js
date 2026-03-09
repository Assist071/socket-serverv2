// Load .env only in development (optional)
try {
  require('dotenv').config();
} catch (err) {
  console.log('⚠️  dotenv not available (OK on production like Render)');
}

const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

console.log('🔧 Supabase Config:');
console.log('   URL:', url ? '✓' : '✗ MISSING');
console.log('   Key:', key ? '✓' : '✗ MISSING');

if (!url || !key) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(url, key);
console.log('✅ Supabase client ready');

module.exports = supabase;

