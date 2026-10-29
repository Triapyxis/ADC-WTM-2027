# ADC-WTM Appointment Letter Portal

Fresh, Vercel-ready Next.js project for collecting appointment requests, requiring National Coordinator approval, and generating a PDF only after approval.

## What it does
- Public appointment request form at `/`
- Date defaults to the current date in Nigeria (`Africa/Lagos`)
- Requests are saved as `pending` in Supabase
- Token-protected review dashboard at `/admin`
- Admin can approve or reject requests
- PDF download is available only for approved requests
- Optional official letterhead image: add `public/letterhead.jpg` or `public/letterhead.png`
- Responsive green-and-gold ADC-WTM styling

## Required setup before deployment

### 1. Create the database
Create a Supabase project, open **SQL Editor**, and run `supabase/schema.sql`.

### 2. Add environment variables
In **Vercel → Project → Settings → Environment Variables**, add:

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role key (server-side only)
- `ADMIN_ACCESS_TOKEN` — a long, random secret used to access `/admin`

Never prefix the service-role key with `NEXT_PUBLIC_`. Do not put secrets in GitHub or in the `public` folder. `.env.example` is a template, not real credentials.

### 3. Deploy the correct project root
1. Extract this ZIP on your computer.
2. Create a new GitHub repository. Upload the **contents inside** the extracted `adc-wtm-fresh-vercel` folder so `package.json` is at the repository root. Do not upload the ZIP itself or an extra parent folder.
3. In Vercel, import that repository.
4. Set **Framework Preset: Next.js** and **Root Directory** to `./` (repository root). Leave Build Command and Output Directory on their defaults.
5. Add the three environment variables above, then deploy.

### 4. Local run
Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local
# Fill in real Supabase values in .env.local
npm run dev
```

Production build check:

```bash
npm run build
npm run typecheck
```

## Important notes
- This project intentionally does not contain real credentials. Supabase setup is required for submission and approval storage to work.
- Email delivery is not wired into this fresh build; approval and PDF generation work independently. Add and test a verified email provider before enabling automatic sending.
- If you have a scanned signature image, do not commit it to a public repository. It can be integrated as a server-only asset after confirming the repository's privacy and intended usage.
- The admin token is a simple shared-secret gate. For a larger production deployment, use authenticated accounts, role-based access, audit logging, and rate limiting.
