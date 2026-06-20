-- ============================================
-- PAYMENTS TABLE (Razorpay order/payment records)
-- ============================================
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id text unique not null,
  payment_id text,
  amount integer not null,
  credits integer not null,
  currency text default 'INR',
  status text not null default 'pending' check (status in ('pending', 'success', 'failed', 'cancelled', 'refunded')),
  error_message text,
  receipt text,
  notes jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_payments_order_id on payments(order_id);
create index if not exists idx_payments_user_id on payments(user_id);
create index if not exists idx_payments_status on payments(status);
create index if not exists idx_payments_created_at on payments(created_at);

alter table if exists payments enable row level security;

drop policy if exists "Users can view own payments" on payments;
create policy "Users can view own payments"
  on payments for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own payments" on payments;
create policy "Users can insert own payments"
  on payments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own payments" on payments;
create policy "Users can update own payments"
  on payments for update
  using (auth.uid() = user_id);

-- ============================================
-- CREDIT HISTORY TABLE (credit usage tracking)
-- ============================================
create table if not exists credit_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('purchase', 'usage')),
  credits integer not null,
  description text,
  feature_name text,
  payment_id uuid references payments(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_credit_history_user_id on credit_history(user_id);
create index if not exists idx_credit_history_type on credit_history(type);
create index if not exists idx_credit_history_created_at on credit_history(created_at);

alter table if exists credit_history enable row level security;

drop policy if exists "Users can view own credit history" on credit_history;
create policy "Users can view own credit history"
  on credit_history for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own credit history" on credit_history;
create policy "Users can insert own credit history"
  on credit_history for insert
  with check (auth.uid() = user_id);

-- ============================================
-- CREDITS TABLE (user wallet)
-- ============================================
create table if not exists credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  remaining integer not null default 0,
  used integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_credits_user_id on credits(user_id);

alter table if exists credits enable row level security;

drop policy if exists "Users can view own credits" on credits;
create policy "Users can view own credits"
  on credits for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own credits" on credits;
create policy "Users can update own credits"
  on credits for update
  using (auth.uid() = user_id);

-- ============================================
-- PAYMENT EVENTS TABLE (webhook audit log)
-- ============================================
create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_data jsonb not null,
  order_id text,
  payment_id text,
  processed boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_payment_events_order_id on payment_events(order_id);
create index if not exists idx_payment_events_processed on payment_events(processed);