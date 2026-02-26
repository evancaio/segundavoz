#!/usr/bin/env node

/**
 * Run Prisma migrations only if DATABASE_URL is configured.
 * This allows deploying an app before creating the production database.
 */

const { spawnSync } = require('child_process');

const dbUrl = process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL;

if (!dbUrl) {
  console.log('ℹ️  DATABASE_URL not set — skipping Prisma migrations.');
  process.exit(0);
}

console.log('🔁 DATABASE_URL found — running `prisma migrate deploy`');
const res = spawnSync('npx', ['prisma', 'migrate', 'deploy'], { stdio: 'inherit' });

if (res.status !== 0) {
  console.error('\n❌ prisma migrate deploy failed');
  process.exit(res.status || 1);
}

console.log('\n✅ prisma migrate deploy completed');
