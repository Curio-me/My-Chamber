-- ========================================================
-- Virtual Chamber: Database Schema for Supabase
-- Paste this into your Supabase Dashboard -> SQL Editor and click "Run"
-- ========================================================

-- 1. Create advocate_profiles table
create table if not exists public.advocate_profiles (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  slug text unique not null,
  full_name text not null,
  enrollment_no text,
  bio text,
  mobile text,
  office_phone text,
  email text,
  office_address text,
  map_url text,
  years_exp int default 0,
  courts text[] default '{}',
  specializations text[] default '{}',
  languages text[] default '{}',
  custom_links jsonb default '[]',
  photo_url text,
  instagram_url text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  is_verified boolean default true,
  theme_preference text default 'dark',
  enable_3d boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.advocate_profiles enable row level security;

-- 3. Policy: Public can view all published advocate chambers
drop policy if exists "Allow public read access" on public.advocate_profiles;
create policy "Allow public read access"
  on public.advocate_profiles
  for select
  using (true);

-- 4. Policy: Allow insert for authenticated users or public onboarding
drop policy if exists "Allow insert profiles" on public.advocate_profiles;
create policy "Allow insert profiles"
  on public.advocate_profiles
  for insert
  with check (true);

-- 5. Policy: Allow updates
drop policy if exists "Allow update profiles" on public.advocate_profiles;
create policy "Allow update profiles"
  on public.advocate_profiles
  for update
  using (true);

-- 6. Insert initial profile for Adv. RajaVikrant Sharma
insert into public.advocate_profiles (
  id,
  slug,
  full_name,
  enrollment_no,
  bio,
  mobile,
  office_phone,
  email,
  office_address,
  map_url,
  years_exp,
  courts,
  specializations,
  languages,
  is_verified,
  theme_preference,
  enable_3d
) values (
  'rajavikrant',
  'rajavikrant',
  'Adv. RajaVikrant Sharma',
  'PH//7797//2025',
  'Advocate with 1+ years of experience practicing at the Punjab and Haryana High Court. I have handled over 2 Constitutional cases, 5 Consumer Cases and have a strong track record in Cyber, Civil and Consumer disputes. My mission is to ensure every client receives fair representation and justice, regardless of their background.',
  '',
  '',
  '',
  'Advocate Chamber, Punjab and Haryana High Court Complex, Chandigarh',
  '',
  1,
  array['Punjab and Haryana High Court'],
  array['Civil Law', 'Cheque Bounce (NI Act)', 'Constitutional Law', 'Consumer Law', 'Cyber Law', 'Criminal Law'],
  array['English', 'Hindi', 'Punjabi'],
  true,
  'dark',
  true
) on conflict (slug) do nothing;
