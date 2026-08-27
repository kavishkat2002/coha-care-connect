# Scripts

Development-only utility scripts for database operations, seeding, and data processing.
These files are **never imported by application code** and should not be bundled into the production build.

## Available Scripts

| Script | Description |
|---|---|
| `seed_hospitals.ts` | Seeds the Supabase `hospitals` table with initial hospital data |
| `seed_roster.ts` | Seeds the Supabase `doctor_roster` table with doctor schedule data |
| `generate_sql.ts` | Generates SQL migration scripts for new data models |
| `query_db.mjs` | Quick query runner for ad-hoc Supabase inspection |
| `check_db.mjs` | Runs a health check on the Supabase connection and key tables |
| `test_profile.mjs` | Tests the patient profile read/write API endpoints |
| `create_doctor_account.mjs` | One-time script to create a seeded doctor Supabase Auth account |
| `process_dataset.js` | Processes the breast cancer CSV dataset for ML training |

## Usage

Run any TypeScript script with `tsx`:

```bash
npx tsx scripts/seed_hospitals.ts
npx tsx scripts/seed_roster.ts
```

Run any ES module script with Node:

```bash
node scripts/query_db.mjs
node scripts/check_db.mjs
```

> **Note:** Ensure you have a valid `.env` file at the project root with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set before running any of these scripts.
