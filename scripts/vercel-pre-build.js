#!/usr/bin/env node

/**
 * Vercel Build Safety Check
 * Valida que DATABASE_URL está configurada com PostgreSQL (não SQLite)
 * Roda antes do Prisma migrate
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vercel Build Safety Check...\n');

// 1. Check DATABASE_URL exists
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ FATAL: DATABASE_URL environment variable not set!');
  console.error('\n📋 You MUST configure DATABASE_URL in Vercel Dashboard:');
  console.error('   1. Go to: https://vercel.com/dashboard/[project]/settings/environment-variables');
  console.error('   2. Add variable: DATABASE_URL');
  console.error('   3. Use PostgreSQL connection string (NOT SQLite)');
  console.error('\n📦 Options to create PostgreSQL:');
  console.error('   - Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres');
  console.error('   - Railway: https://railway.app');
  console.error('   - Neon: https://neon.tech');
  console.error('   - PlanetScale (MySQL): https://planetscale.com\n');
  process.exit(1);
}

// 2. Warn if SQLite is used (development only)
if (dbUrl.includes('file:') || dbUrl.includes('.db')) {
  console.warn('⚠️  WARNING: Your DATABASE_URL uses SQLite!');
  console.warn('    SQLite does NOT persist on Vercel (ephemeral filesystem).\n');
  
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    console.error('❌ FATAL: Cannot deploy with SQLite in production!');
    console.error('\n🔧 Fix: Change DATABASE_URL to PostgreSQL in Vercel Dashboard\n');
    process.exit(1);
  }
}

// 3. Validate it looks like a valid connection string
if (!dbUrl.includes('postgresql://') && !dbUrl.includes('mysql://') && !dbUrl.includes('file:')) {
  console.warn('⚠️  WARNING: DATABASE_URL does not look like a valid connection string');
  console.warn(`    Value: ${dbUrl.substring(0, 30)}...\n`);
}

// 4. Check Prisma schema doesn't hardcode SQLite
const schemaPath = path.join(__dirname, 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  if (schema.includes('provider = "sqlite"')) {
    console.warn('⚠️  WARNING: prisma/schema.prisma still has provider = "sqlite"');
    console.warn('    This is OK for local dev, but DATABASE_URL will override it.\n');
  }
}

console.log('✅ Database configuration looks good!\n');
console.log(`   DATABASE_URL: ${dbUrl.substring(0, 50)}...`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
