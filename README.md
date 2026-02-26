# SegundaVoz - Legal Case Management Platform

A Next.js application for managing legal cases with role-based access (admin, doctor, student), payments via Stripe, and document collaboration.

## Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM (PostgreSQL recommended)
- **Auth**: NextAuth.js v4
- **Payments**: Stripe
- **Email**: Nodemailer
- **File Upload**: Multer

## ⚠️ CRITICAL: Vercel Deployment - SQLite Migration Required

Your project currently uses **SQLite** (`prisma/dev.db`), which **will NOT persist on Vercel**. Vercel's filesystem is ephemeral and resets on each deployment.

### Required Actions for Vercel:

1. **Create a PostgreSQL database** (options):
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Railway](https://railway.app)
   - [Neon](https://neon.tech)
   - [PlanetScale](https://planetscale.com)

2. **Update Build Config** ✅ (Already done)
   - `package.json` now includes: `prisma generate && prisma migrate deploy && next build`

3. **Set Environment Variables in Vercel Dashboard**:
   - `DATABASE_URL` → PostgreSQL connection string
   - `NEXTAUTH_SECRET` → Generate: `openssl rand -base64 32`
   - `NEXTAUTH_URL` → Your Vercel domain (e.g., `https://myapp.vercel.app`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → From Stripe dashboard
   - `STRIPE_SECRET_KEY` → From Stripe
   - `STRIPE_WEBHOOK_SECRET` → From Stripe Webhooks
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` → SMTP settings

## Local Development

### 1. Clone & Install

```bash
git clone https://github.com/evancaio/segundavoz.git
cd segundavoz
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` (use SQLite locally if you prefer):

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-change-in-production"
# Add other env vars...
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32  # or use Node: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma db seed  # Optional: populate sample data
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Production (Vercel)

### Step 1: Ensure PostgreSQL is Set Up

Do NOT use SQLite. Create a PostgreSQL database and get the connection string.

### Step 2: Connect to Vercel

1. Push code to GitHub (already done)
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Add environment variables (see list above)
5. Deploy!

The build will automatically:
- Generate Prisma client
- Run database migrations
- Build Next.js app

### Step 3: Monitor Build

Watch the Vercel dashboard for build progress. Common issues:
- ❌ No `DATABASE_URL` → set it!
- ❌ `DATABASE_URL` uses SQLite → must be PostgreSQL
- ❌ Database not accessible from internet → configure firewall
- ❌ Missing env vars → check Vercel dashboard

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Run database seeder
npx prisma migrate dev --name <name>  # Create migration
npx prisma studio   # Open database UI
npx prisma generate # Regenerate Prisma client
```

## Project Structure

```
src/
  app/
    api/
      auth/          # NextAuth endpoints
      cases/         # Case CRUD API
      payment/       # Stripe checkout & webhooks
      upload/        # File upload handler
    admin/           # Admin dashboard
    doctor/          # Doctor pages & cases
    student/         # Student pages & cases
    cases/           # Case detail pages
    login/           # Login page
    register/        # Registration page
    dashboard/       # Dashboard pages
  components/        # Reusable React components
  lib/               # Utilities (auth, Prisma, Stripe, email)
  types/             # TypeScript types & NextAuth config
prisma/
  schema.prisma      # Database schema
  seed.ts            # Sample data script
  dev.db             # SQLite database (local only)
```

## API Routes

- `POST /api/auth/register` – User registration
- `POST /api/auth/[...nextauth]` – NextAuth endpoints
- `GET/POST /api/cases` – List/create cases
- `GET/PUT /api/cases/[id]` – Case details/update
- `POST /api/cases/[id]/comment` – Add comment
- `POST /api/cases/[id]/opinion` – Add doctor opinion
- `POST /api/cases/[id]/accept` – Doctor accepts case
- `POST /api/payment/create` – Create Stripe checkout session
- `POST /api/payment/webhook` – Stripe webhook handler
- `POST /api/upload` – Upload case documents

## Troubleshooting

### Vercel Build Fails

| Error | Solution |
|-------|----------|
| "No DATABASE_URL" | Add to Vercel env vars |
| "sqlite not supported" | Use PostgreSQL, not SQLite |
| "Cannot connect to database" | Check database firewall settings |
| "Missing env var" | Verify all vars in Vercel dashboard |

### Local Development Issues

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npx kill-port 3000` or use `PORT=3001 npm run dev` |
| "Prisma client not found" | Run `npx prisma generate` |
| Database errors | Check `.env.local` DATABASE_URL |
| Build fails | Delete `.next/` and rebuild: `rm -r .next && npm run build` |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT
