# LyteDev

Production-ready Next.js App Router portfolio and CMS for `https://lytedev.ca`.

## Stack

- Next.js 16 App Router
- TypeScript + React 19
- Supabase Auth, Postgres, and Storage
- Server Components by default
- Server Actions for admin mutations
- Markdown-based project and blog content

## What is included

- Public pages: `/`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/about`
- Private admin: `/admin`, `/admin/login`, `/admin/projects`, `/admin/posts`, `/admin/media`
- Supabase schema + RLS + storage policies in `supabase/migrations`
- Seed content for Lyte Engine, Membrant, and Calorie Tracker
- SEO routes: `sitemap.xml` and `robots.txt`
- Fallback local seed rendering for the public site when Supabase is not configured yet

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`.
3. Fill in the Supabase values described below.
4. Start the app:

   ```bash
   npm run dev
   ```

## Required environment variables

Add these to `.env.local` and to your Vercel project:

```env
NEXT_PUBLIC_SITE_URL=https://lytedev.ca
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Notes:

- For local development, set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- This project does not use a Supabase service-role key.
- All browser and server requests use the anonymous key plus RLS-protected authenticated sessions.

## Supabase setup

### 1) Create the Supabase project

1. Go to the Supabase dashboard.
2. Create a new project.
3. Choose a region close to where you want the site hosted.
4. Wait for the database to finish provisioning.

### 2) Run the database schema and seed migrations

You can run the SQL in either of these ways:

- Preferred: use the Supabase CLI and run the files in `supabase/migrations`
- Simple dashboard path: open the SQL editor and run the files in order

Run these files in this exact order:

1. `supabase/migrations/202608180001_create_lytedev_schema.sql`
2. `supabase/migrations/202608180002_seed_lytedev_content.sql`

That creates:

- `projects`
- `posts`
- `admin_users`
- `project_status` enum
- `updated_at` triggers
- RLS policies for public reads and admin-only writes
- a public `media` storage bucket with admin-only writes

### 3) Configure authentication

Use the built-in Supabase auth system only.

In Supabase:

1. Open `Authentication` -> `Providers`.
2. Enable `Email`.
3. Decide whether you want to use password login, magic links, or both.
4. Disable public sign-ups. The site is designed for a single owner and does not expose registration UI.

Then configure redirect URLs:

1. Open `Authentication` -> `URL Configuration`.
2. Set `Site URL`:
   - local: `http://localhost:3000`
   - production: `https://lytedev.ca`
3. Add redirect URLs:
   - `http://localhost:3000/auth/confirm`
   - `https://lytedev.ca/auth/confirm`

### 4) Create your administrator account

Because public registration is disabled, create the admin user manually:

1. Open `Authentication` -> `Users`.
2. Click `Add user`.
3. Create your account with your email and a password.

Then allow that user into the admin area:

1. Copy the new user ID from the Auth user record.
2. Run this SQL in the SQL editor:

   ```sql
   insert into public.admin_users (user_id)
   values ('YOUR_AUTH_USER_ID');
   ```

Only users listed in `admin_users` can access `/admin` or write content.

### 5) Configure storage

The migration already creates a public storage bucket named `media`.

Verify this in Supabase:

1. Open `Storage`.
2. Confirm the `media` bucket exists.
3. Confirm uploads are allowed only for authenticated admin users through the policies created by the migration.

The admin forms upload project and blog images directly into this bucket.

### 6) Add local environment variables

In Supabase:

1. Open `Project Settings` -> `API`.
2. Copy:
   - Project URL
   - `anon` public key

Place them in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 7) Add environment variables in Vercel

1. Create a Vercel project and import this repository.
2. In Vercel project settings, open `Environment Variables`.
3. Add:
   - `NEXT_PUBLIC_SITE_URL=https://lytedev.ca`
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
4. Apply them to Production, Preview, and Development as needed.

### 8) Deploy to Vercel

1. Push the repository.
2. Import it into Vercel if you have not already.
3. Confirm the framework is detected as Next.js.
4. Set the environment variables.
5. Deploy.

After deployment:

- open `/admin/login`
- sign in with your Supabase admin account
- confirm you can create and publish content

### 9) Connect `lytedev.ca`

In Vercel:

1. Open your project.
2. Go to `Settings` -> `Domains`.
3. Add `lytedev.ca`.
4. Add `www.lytedev.ca` if you want it redirected.
5. Update your DNS records exactly as Vercel instructs.
6. Once the domain is active, set `NEXT_PUBLIC_SITE_URL=https://lytedev.ca` in Vercel.
7. Redeploy so canonical URLs and auth redirects use the correct origin.

## Admin behavior and security model

- `/admin` routes are protected on the server side.
- Anonymous visitors are redirected to `/admin/login`.
- Authenticated users must also exist in `public.admin_users`.
- Database writes rely on RLS, not hidden UI.
- The Supabase anonymous key is safe to expose; the service-role key is never used in the app.

## Content model

### Projects

- title
- slug
- short description
- markdown content
- status
- technologies
- GitHub URL
- live URL
- image URL
- featured flag
- published flag
- display order
- created / updated timestamps

### Posts

- title
- slug
- excerpt
- markdown content
- tags
- cover image URL
- published flag
- published at timestamp
- created / updated timestamps

## Commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Notes for content editing

- The public site falls back to local seed content if Supabase is not configured yet.
- The admin area requires a real Supabase project.
- Project and post forms support image upload, publish state, and manual slug editing after auto-generation.
- Markdown preview is built into the blog post editor.
