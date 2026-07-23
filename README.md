# MOKA india — Jewellery Store

A jewellery e-commerce site inspired by [mokaindia.com](https://mokaindia.com), with an admin panel for products and Razorpay checkout.

## Features

- Storefront: home, collections, product pages, cart, checkout
- Admin panel: add / edit / delete products, view orders
- Razorpay payments
- PostgreSQL via Prisma (production-ready)

## Local setup

1. Start Postgres:

```bash
docker compose up -d
```

2. Install, migrate, seed, run:

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin login (local defaults)

- URL: [/admin](http://localhost:3000/admin)
- Email: `admin@mokaindia.com`
- Password: `admin123`

Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`, then re-run `npm run db:seed`.

### Razorpay

Add keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys):

```env
RAZORPAY_KEY_ID="rzp_live_..."          # or rzp_test_...
RAZORPAY_KEY_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_..."
ALLOW_DEMO_PAYMENTS="false"
```

In development, placeholder keys enable demo checkout. In production, real keys are required unless `ALLOW_DEMO_PAYMENTS=true`.

---

## Production readiness (Netlify + Render)

SQLite cannot be used on Netlify/Render. Use **PostgreSQL** everywhere in production.

### Recommended architectures

| Approach | App host | Database | Best when |
|----------|----------|----------|-----------|
| **A (simplest)** | [Render](https://render.com) Web Service | Render Postgres (or Neon) | You want one platform for the whole app |
| **B (Netlify + DB)** | [Netlify](https://netlify.com) | Neon / Supabase / Render Postgres | You prefer Netlify for the Next.js app |

Do **not** run the same app on both Netlify and Render at once unless you intentionally split traffic. Pick one host for the Next.js app, and point it at a managed Postgres.

### Shared production checklist

1. **Postgres** — create a database and copy `DATABASE_URL` (use the SSL URL if offered, often `?sslmode=require`).
2. **Secrets** — set strong values:
   - `AUTH_SECRET` → `openssl rand -base64 32`
   - `ADMIN_PASSWORD` → long random password
   - Razorpay **live** keys for real payments
3. **URLs** — set both to your live site URL:
   - `AUTH_URL=https://your-domain.com`
   - `NEXTAUTH_URL=https://your-domain.com`
4. **Seed admin once** after first deploy (see below).
5. **Disable demo payments**: `ALLOW_DEMO_PAYMENTS=false`

### Option A — Deploy on Render

1. Push this repo to GitHub.
2. In Render: **New → Blueprint** and select the repo (`render.yaml` is included).
3. Or manually:
   - Create a **PostgreSQL** database
   - Create a **Web Service** (Node)
   - Build: `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Start: `npm run start`
   - Health check path: `/api/health`
4. Set env vars (see table below). Set `AUTH_URL` / `NEXTAUTH_URL` to your `https://….onrender.com` URL (or custom domain).
5. After first deploy, seed the admin user (one-time):

```bash
# From your machine, pointed at the production DATABASE_URL
DATABASE_URL="postgresql://..." ADMIN_EMAIL="you@brand.com" ADMIN_PASSWORD="strong-pass" npm run db:seed
```

Or open a Render shell on the web service and run the same with production env already present.

### Option B — Deploy on Netlify (+ external Postgres)

1. Create a free Postgres on [Neon](https://neon.tech) or [Supabase](https://supabase.com) (or a Render Postgres instance).
2. Push this repo to GitHub → **Add new site** on Netlify from that repo.
3. Build settings are in `netlify.toml` (Next.js is auto-detected).
4. In **Site configuration → Environment variables**, add all vars from the table below.
5. Deploy, then seed admin once using the production `DATABASE_URL` as in Option A.

`NEXT_PUBLIC_RAZORPAY_KEY_ID` is inlined at **build** time — if you change it, trigger a new deploy.

### Environment variables

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Postgres connection string |
| `AUTH_SECRET` | Yes | Long random secret |
| `AUTH_URL` | Yes | Public site URL (`https://…`) |
| `NEXTAUTH_URL` | Yes | Same as `AUTH_URL` |
| `ADMIN_EMAIL` | Yes (for seed) | Admin login email |
| `ADMIN_PASSWORD` | Yes (for seed) | Admin login password |
| `RAZORPAY_KEY_ID` | Yes (prod) | Server key |
| `RAZORPAY_KEY_SECRET` | Yes (prod) | Server secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes (prod) | Public key (build-time) |
| `ALLOW_DEMO_PAYMENTS` | No | Must be `false` in production |

### After go-live

- Point a custom domain in Netlify or Render DNS settings
- Switch Razorpay to **live** keys and complete Razorpay KYC
- Change the default admin password
- Confirm `/api/health` returns `{ "ok": true, "db": "up" }`
- Place a small test order end-to-end

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `docker compose up -d` | Start local Postgres |
| `npm run db:setup` | Migrate + seed |
| `npm run db:seed` | Re-seed admin & sample products |
| `npm run db:migrate` | Create a new migration (local) |
| `npm run db:deploy` | Apply migrations (CI/production) |
| `npm run build` | Production build |
