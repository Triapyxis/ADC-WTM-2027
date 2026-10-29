-- Run this SQL in Supabase Dashboard > SQL Editor.
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  position text not null,
  state text not null,
  effective_date date not null,
  responsibilities text not null,
  email text,
  phone text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.appointments enable row level security;

-- Intentionally do not create anon/authenticated policies. All database access
-- is performed by Next.js server routes using SUPABASE_SERVICE_ROLE_KEY.
-- Never expose the service role key in NEXT_PUBLIC_* variables.
