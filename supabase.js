require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔧 Loading Supabase configuration...');
console.log('   SUPABASE_URL env:', process.env.SUPABASE_URL ? '✓ Set' : '✗ Not set');
console.log('   SUPABASE_SERVICE_KEY env:', process.env.SUPABASE_SERVICE_KEY ? '✓ Set (length: ' + process.env.SUPABASE_SERVICE_KEY.length + ')' : '✗ Not set');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ FATAL: Supabase configuration missing!');
  console.error('   SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗ MISSING');
  console.error('   SUPABASE_KEY:', SUPABASE_KEY ? '✓' : '✗ MISSING');
  throw new Error('Missing Supabase credentials');
}

console.log('✨ Creating Supabase client with:');
console.log('   URL:', SUPABASE_URL);
console.log('   Key length:', SUPABASE_KEY.length);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

console.log('✅ Supabase client created');
console.log('   Type:', typeof supabase);
console.log('   Has .from method:', typeof supabase?.from === 'function');

module.exports = supabase;

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔧 Loading Supabase configuration...');
console.log('   SUPABASE_URL env:', process.env.SUPABASE_URL ? '✓ Set' : '✗ Not set');
console.log('   SUPABASE_SERVICE_KEY env:', process.env.SUPABASE_SERVICE_KEY ? '✓ Set (length: ' + process.env.SUPABASE_SERVICE_KEY.length + ')' : '✗ Not set');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ FATAL: Supabase configuration missing!');
  console.error('   SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗ MISSING');
  console.error('   SUPABASE_KEY:', SUPABASE_KEY ? '✓' : '✗ MISSING');
  throw new Error('Missing Supabase credentials');
}

console.log('✨ Creating Supabase client with:');
console.log('   URL:', SUPABASE_URL);
console.log('   Key length:', SUPABASE_KEY.length);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

console.log('✅ Supabase client created');
console.log('   Type:', typeof supabase);
console.log('   Has .from method:', typeof supabase?.from === 'function');

module.exports = supabase;

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔧 Loading Supabase configuration...');
console.log('   SUPABASE_URL env:', process.env.SUPABASE_URL ? '✓ Set' : '✗ Not set');
console.log('   SUPABASE_SERVICE_KEY env:', process.env.SUPABASE_SERVICE_KEY ? '✓ Set (length: ' + process.env.SUPABASE_SERVICE_KEY.length + ')' : '✗ Not set');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ FATAL: Supabase configuration missing!');
  console.error('   SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗ MISSING');
  console.error('   SUPABASE_KEY:', SUPABASE_KEY ? '✓' : '✗ MISSING');
  throw new Error('Missing Supabase credentials');
}

console.log('✨ Creating Supabase client with:');
console.log('   URL:', SUPABASE_URL);
console.log('   Key length:', SUPABASE_KEY.length);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

console.log('✅ Supabase client created');
console.log('   Type:', typeof supabase);
console.log('   Has .from method:', typeof supabase?.from === 'function');

module.exports = supabase;

