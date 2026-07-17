-- Subscribers table for "Join the Circuit" email capture
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  subscribed_at timestamptz not null default now(),
  status text not null default 'active'
);

alter table public.subscribers enable row level security;

-- Anyone (signed in or not) can insert new subscribers, nothing else.
-- No select/update/delete policy is created, so those stay denied by default.
create policy "Public can insert subscribers"
  on public.subscribers
  for insert
  to public
  with check (true);
