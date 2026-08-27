import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { doctors, hospitals } from './src/data/mock.ts'; // Wait, mock.ts is typescript, I cannot run it directly in node without ts-node/tsx.

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
  const { data: d, error: e1 } = await supabase.from('doctors_roster').select('id').limit(1);
  const { data: h, error: e2 } = await supabase.from('hospitals').select('id').limit(1);
  console.log("doctors_roster:", d, e1?.message);
  console.log("hospitals:", h, e2?.message);
}
check();
