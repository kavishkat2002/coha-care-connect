import pkg from 'pg';
import fs from 'fs';

const { Client } = pkg;

const connectionString = "postgresql://postgres.htkaegeoqtjmpdywrtzy:Kavishka2002@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres";

async function run() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to database successfully!");
    const sql = fs.readFileSync('/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/7666ba66-3c68-4f5c-af69-fe72b7be725e/doctor_reviews_migration.sql', 'utf8');
    console.log("Executing SQL migration...");
    await client.query(sql);
    
    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Error executing migration:", err);
  } finally {
    await client.end();
  }
}

run();
