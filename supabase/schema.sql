-- =========================================================
-- MoneyMate — Supabase schema
-- Run in: Supabase Dashboard → SQL Editor → New query
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- PROFILES (1:1 with auth.users)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text not null unique,
  email text not null,
  avatar_url text,
  preferred_currency text not null default 'IDR',
  monthly_budget_goal numeric not null default 0,
  theme text not null default 'system' check (theme in ('light','dark','system')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select using (auth.uid() = id);
create policy "Profiles are editable by owner"
  on public.profiles for update using (auth.uid() = id);
create policy "Profiles are insertable by owner"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    -- temporary unique username; user is prompted to replace it on first login
    'user_' || substr(new.id::text, 1, 8),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- TRANSACTIONS
-- ---------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('income','expense')),
  amount numeric not null check (amount > 0),
  category text not null,
  description text not null default '',
  date date not null default current_date,
  payment_method text not null default 'Cash',
  notes text,
  receipt_url text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx on public.transactions (user_id, date desc);

alter table public.transactions enable row level security;

create policy "Users manage their own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------
-- BUDGETS
-- ---------------------------------------------------------
create table if not exists public.budgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  amount numeric not null check (amount >= 0),
  month text not null, -- 'YYYY-MM'
  created_at timestamptz not null default now(),
  unique (user_id, category, month)
);

alter table public.budgets enable row level security;

create policy "Users manage their own budgets"
  on public.budgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Convenience view: budget usage computed from real transactions
create or replace view public.budget_usage as
select
  b.id,
  b.user_id,
  b.category,
  b.month,
  b.amount,
  coalesce(sum(t.amount), 0) as spent,
  case when b.amount > 0
    then round((coalesce(sum(t.amount), 0) / b.amount) * 100)
    else 0
  end as percent_used
from public.budgets b
left join public.transactions t
  on t.user_id = b.user_id
  and t.category = b.category
  and t.type = 'expense'
  and to_char(t.date, 'YYYY-MM') = b.month
group by b.id;

-- ---------------------------------------------------------
-- RECURRING BILLS
-- ---------------------------------------------------------
create table if not exists public.bills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  amount numeric not null check (amount >= 0),
  category text not null default 'Others',
  due_date date not null,
  repeat text not null default 'monthly' check (repeat in ('monthly','weekly','yearly','one-time')),
  is_paid boolean not null default false,
  icon text default 'receipt',
  created_at timestamptz not null default now()
);

alter table public.bills enable row level security;

create policy "Users manage their own bills"
  on public.bills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------
-- SPLIT BILLS
-- ---------------------------------------------------------
create table if not exists public.split_bills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  total_amount numeric not null check (total_amount > 0),
  split_type text not null default 'equal' check (split_type in ('equal','custom')),
  share_code text not null unique default upper(substr(md5(random()::text), 1, 7)),
  created_at timestamptz not null default now()
);

alter table public.split_bills enable row level security;

create policy "Users manage their own split bills"
  on public.split_bills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Anyone with the share_code can read via a shareable link (public read-only)
create policy "Split bills are readable via share link"
  on public.split_bills for select
  using (true);

create table if not exists public.split_bill_members (
  id uuid primary key default uuid_generate_v4(),
  split_bill_id uuid not null references public.split_bills(id) on delete cascade,
  name text not null,
  share numeric not null check (share >= 0),
  status text not null default 'pending' check (status in ('paid','pending')),
  avatar_color text default '#23324A'
);

alter table public.split_bill_members enable row level security;

create policy "Members readable if parent bill readable"
  on public.split_bill_members for select using (true);

create policy "Owner manages members"
  on public.split_bill_members for insert
  with check (
    exists (select 1 from public.split_bills sb where sb.id = split_bill_id and sb.user_id = auth.uid())
  );
create policy "Owner updates members"
  on public.split_bill_members for update
  using (
    exists (select 1 from public.split_bills sb where sb.id = split_bill_id and sb.user_id = auth.uid())
  );
create policy "Owner deletes members"
  on public.split_bill_members for delete
  using (
    exists (select 1 from public.split_bills sb where sb.id = split_bill_id and sb.user_id = auth.uid())
  );

-- ---------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('budget_exceeded','bill_due','receipt_scanned','split_payment','monthly_report')),
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users manage their own notifications"
  on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------
-- STORAGE — receipts bucket
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

create policy "Users read their own receipts"
  on storage.objects for select
  using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users upload their own receipts"
  on storage.objects for insert
  with check (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete their own receipts"
  on storage.objects for delete
  using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);

-- ---------------------------------------------------------
-- Helper: budget threshold notification trigger (80% / 100%)
-- ---------------------------------------------------------
create or replace function public.check_budget_threshold()
returns trigger as $$
declare
  v_budget record;
  v_spent numeric;
  v_percent numeric;
begin
  select * into v_budget from public.budgets
    where user_id = new.user_id and category = new.category
    and month = to_char(new.date, 'YYYY-MM')
    limit 1;

  if v_budget.id is not null then
    select coalesce(sum(amount), 0) into v_spent from public.transactions
      where user_id = new.user_id and category = new.category
      and type = 'expense' and to_char(date, 'YYYY-MM') = v_budget.month;

    v_percent := case when v_budget.amount > 0 then (v_spent / v_budget.amount) * 100 else 0 end;

    if v_percent >= 100 then
      insert into public.notifications (user_id, type, title, message)
      values (new.user_id, 'budget_exceeded', 'Budget exceeded',
        new.category || ' budget has reached ' || round(v_percent) || '% of the limit.');
    elsif v_percent >= 80 then
      insert into public.notifications (user_id, type, title, message)
      values (new.user_id, 'budget_exceeded', 'Approaching budget limit',
        new.category || ' budget has reached ' || round(v_percent) || '% of the limit.');
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_transaction_check_budget on public.transactions;
create trigger on_transaction_check_budget
  after insert on public.transactions
  for each row when (new.type = 'expense')
  execute procedure public.check_budget_threshold();
