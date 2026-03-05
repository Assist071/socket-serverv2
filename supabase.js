const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://pljfczpwersfytcxbwvk.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsamZjenB3ZXJzZnl0Y3hid3ZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1MDcxMywiZXhwIjoyMDg3MDI2NzEzfQ.k0UYHuLMFpSbr7-rkHCiAfzzBwRMz9hXwKhA-obSj9Q'
);

module.exports = supabase;
