import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    env[k.trim()] = v.trim();
  }
}

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('patient_profiles').select('*').limit(1);
  console.log("patient_profiles fetch error:", error?.message);

  const upsertRes = await supabase.from('patient_profiles').upsert({ id: 'test', name: 'test' });
  console.log("patient_profiles upsert error:", upsertRes.error?.message);
}
check();
