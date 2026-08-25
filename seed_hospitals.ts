import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { hospitals } from './src/data/mock.ts';

const envFile = fs.readFileSync('.env', 'utf-8');
const env: Record<string, string> = {};
for (const line of envFile.split('\n')) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    env[k.trim()] = v.trim();
  }
}

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const generateRegId = (role: string) => {
  return `HOS-${Math.floor(Math.random() * 900000) + 100000}`;
};

const createAccounts = async () => {
  for (const h of hospitals) {
    const name = h.name;
    const email = name.toLowerCase().replace(/[^a-z0-g]/g, '') + '@hospital.meddoc.com';
    const { error } = await supabase.auth.signUp({
      email,
      password: "Password123!",
      options: {
        data: { role: 'hospital', name, registration_id: generateRegId('hospital') }
      }
    });
    if (error && !error.message.includes("already registered") && !error.message.includes("rate limit")) {
      console.log(`Failed ${name}: ${error.message}`);
    } else {
      console.log(`Created (or Exists) ${name} (${email})`);
    }
  }
};
createAccounts();
