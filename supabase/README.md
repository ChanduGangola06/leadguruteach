# Supabase Setup Guide — LeadGuruTeach

This guide explains how to connect LeadGuruTeach to Supabase and run the database schema for auth, admin panel, and dynamic site content.

---

## What the schema creates

| Table | Purpose |
|-------|---------|
| `profiles` | User roles (`student` / `admin`), linked to `auth.users` |
| `packages` | Course bundles (pricing, courses, FAQs, etc.) |
| `banners` | Homepage carousel images |
| `featured_courses` | 12-card course grid on homepage |
| `testimonials` | Student testimonials section |
| `instructors` | Mentors marquee section |
| `audit_logs` | Login/register/API audit trail (admin-only read) |

Also included:
- Row Level Security (RLS) policies
- Storage buckets: `banners`, `media`
- Auto-create profile on signup (trigger)
- Seed data for packages, banners, courses, etc.

---

## Prerequisites

- A free [Supabase](https://supabase.com) account
- Node.js 18+ and this project cloned locally
- `npm install` already run

---

## Step 1 — Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New project**
3. Choose organization, name, database password (save this — used for direct Postgres only)
4. Pick a region → **Create new project**
5. Wait until the project status is **Active**

Your project URL will look like:

```
https://YOUR-PROJECT-REF.supabase.co
```

---

## Step 2 — Get API keys

1. In Supabase Dashboard → **Project Settings** (gear icon)
2. Open **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Legacy format: `eyJ...` (long JWT)
     - New format: `sb_publishable_...`

> Do **not** use the database password or `service_role` key in the Next.js app.

---

## Step 3 — Configure environment variables

In the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
NEXT_PUBLIC_ADMIN_EMAILS=your@email.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Restart the dev server after any env change:

```bash
npm run dev
```

---

## Step 4 — Run the main schema (fresh install)

This is the **primary script** for a new project.

1. Open **SQL Editor** in Supabase Dashboard  
   `Dashboard → SQL → New query`

2. Open this file in your code editor:

   ```
   supabase/schema.sql
   ```

3. **Select all** (`Cmd+A` / `Ctrl+A`) → **Copy**

4. Paste into the Supabase SQL Editor

5. Click **Run** (or `Cmd+Enter`)

6. You should see **Success. No rows returned** (or success with seed insert counts)

### What `schema.sql` does

- Creates all tables, functions, triggers, indexes
- Enables RLS and policies
- Creates storage buckets `banners` and `media`
- Inserts sample packages, banners, featured courses, testimonials, instructors

---

## Step 5 — Create your admin account

### Option A — Register in the app (recommended)

1. Set your email in `NEXT_PUBLIC_ADMIN_EMAILS` before signing up
2. Go to [http://localhost:3000/register](http://localhost:3000/register)
3. Create an account with that email
4. You are auto-promoted to admin on signup

### Option B — Create user in Supabase Dashboard

1. **Authentication → Users → Add user**
2. Set email + password, enable **Auto Confirm User**
3. Run in SQL Editor:

```sql
-- From supabase/fix_admin_user.sql
UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email = 'your@email.com';

INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Admin', 'admin'
FROM auth.users
WHERE email = 'your@email.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

4. Log in at `/login` → you should reach `/dashboard/admin`

---

## Step 6 — Verify everything works

| Check | URL / action |
|-------|----------------|
| Homepage loads dynamic content | [http://localhost:3000](http://localhost:3000) |
| Login | [http://localhost:3000/login](http://localhost:3000/login) |
| Admin panel | [http://localhost:3000/dashboard/admin](http://localhost:3000/dashboard/admin) |
| Manage packages | `/dashboard/admin/packages` |
| Manage banners | `/dashboard/admin/banners` |
| Audit logs | `/dashboard/admin/audit-logs` |

In Supabase **Table Editor**, confirm tables exist under `public`.

---

## SQL files reference

| File | When to use |
|------|-------------|
| **`schema.sql`** | **Fresh setup** — run once on a new Supabase project |
| `migration_content_tables.sql` | Only if you ran an **older** schema (before featured courses / testimonials / instructors) |
| `migration_audit_logs.sql` | Only if you need to add **audit_logs** without re-running full schema |
| `fix_admin_user.sql` | User created in Dashboard but **can't login** or **not admin** |
| `drop_schema.sql` | **Reset** — delete all app tables to start over (keeps `auth.users`) |

---

## Updating an existing database (migrations)

If you already ran `schema.sql` earlier and only need new tables:

### Add featured courses, testimonials, instructors

Run:

```
supabase/migration_content_tables.sql
```

### Add audit logging

Run:

```
supabase/migration_audit_logs.sql
```

> If unsure, run the full `schema.sql` on a **fresh** project, or use `drop_schema.sql` first then `schema.sql`.

---

## Reset database (drop everything)

To remove all app tables and start clean:

1. Run **`supabase/drop_schema.sql`** in SQL Editor  
   (Uses Supabase-safe storage delete — see file comments if errors occur)

2. Run **`supabase/schema.sql`** again

**Note:** `drop_schema.sql` does **not** delete login accounts in `auth.users`.

---

## Storage buckets

Created automatically by `schema.sql`:

| Bucket | Used for |
|--------|----------|
| `banners` | Banner image uploads in admin |
| `media` | Featured course / general media uploads |

Upload from admin panel, or paste image URLs directly in forms.

---

## Troubleshooting

### "Invalid email or password" on login

- User created in Dashboard may have **unconfirmed email** → run `fix_admin_user.sql`
- Or use **Authentication → Users → Send password recovery**
- Or disable email confirmation: **Authentication → Providers → Email → Confirm email** (dev only)

### "Unable to create account"

- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon/publishable** key, not DB password
- Restart `npm run dev` after changing `.env`
- Email may already exist → use `/login` instead

### Admin panel redirects to `/dashboard`

- Run: `UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';`
- Ensure email is in `NEXT_PUBLIC_ADMIN_EMAILS`

### Tables missing / admin CRUD fails

- Re-run `schema.sql` in SQL Editor
- Check **Table Editor** for `public.profiles`, `public.packages`, etc.

### Storage delete error when running `drop_schema.sql`

Supabase blocks direct `DELETE` on storage tables. The updated `drop_schema.sql` sets `storage.allow_delete_query`. If it still fails, skip section 3 in that file and delete buckets manually under **Storage** in the dashboard.

### RLS / permission errors

- Ensure you are logged in as admin for admin routes
- Policies are created by `schema.sql` — re-run if policies were dropped

---

## Quick checklist

```
[ ] Supabase project created
[ ] .env.local filled (URL + anon key + admin email)
[ ] schema.sql run in SQL Editor — success
[ ] npm run dev restarted
[ ] Registered or created admin user
[ ] profiles.role = 'admin' for your email
[ ] /dashboard/admin opens
```

---

## Related project files

```
supabase/
├── schema.sql                  ← Main schema (run this first)
├── drop_schema.sql             ← Reset all tables
├── migration_content_tables.sql
├── migration_audit_logs.sql
├── fix_admin_user.sql
└── README.md                   ← This file

.env.local                      ← Your secrets (not committed)
.env.local.example              ← Template
lib/supabase/                   ← App Supabase client code
app/actions/                    ← Server actions (auth, packages, banners)
```

For app features and routes, see the root [README.md](../README.md).
