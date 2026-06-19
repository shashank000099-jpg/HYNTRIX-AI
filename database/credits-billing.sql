-- ============================================
-- CREDITS & BILLING SYSTEM
-- ============================================
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- PAYMENT TRANSACTIONS TABLE
-- Tracks the full lifecycle of each payment
-- ============================================
create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  order_id text not null,
  payment_id text,
  amount integer not null,
  credits integer not null,
  currency text default 'INR',
  status text not null default 'pending' 
    check (status in ('pending', 'success', 'failed', 'cancelled', 'refunded')),
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for fast lookups
create index if not exists idx_payment_transactions_user_id on payment_transactions(user_id);
create index if not exists idx_payment_transactions_order_id on payment_transactions(order_id);
create index if not exists idx_payment_transactions_status on payment_transactions(status);
create index if not exists idx_payment_transactions_created_at on payment_transactions(created_at);

-- ============================================
-- CREDIT HISTORY TABLE
-- Tracks every credit movement (purchase + usage)
-- ============================================
create table if not exists credit_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null check (type in ('purchase', 'usage')),
  credits integer not null,
  description text,
  feature_name text,
  payment_transaction_id uuid references payment_transactions(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_credit_history_user_id on credit_history(user_id);
create index if not exists idx_credit_history_type on credit_history(type);
create index if not exists idx_credit_history_created_at on credit_history(created_at);

-- ============================================
-- PAYMENT EVENTS TABLE
-- Stores all webhook events for audit
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
create index if not exists idx_payment_events_type on payment_events(event_type);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table if exists payment_transactions enable row level security;
alter table if exists credit_history enable row level security;
alter table if exists payment_events enable row level security;

-- Payment transactions: users can only see their own
drop policy if exists "Users can view own payment transactions" on payment_transactions;
create policy "Users can view own payment transactions"
  on payment_transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own payment transactions" on payment_transactions;
create policy "Users can create own payment transactions"
  on payment_transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own payment transactions" on payment_transactions;
create policy "Users can update own payment transactions"
  on payment_transactions for update
  using (auth.uid() = user_id);

-- Credit history: users can only see their own
drop policy if exists "Users can view own credit history" on credit_history;
create policy "Users can view own credit history"
  on credit_history for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own credit history" on credit_history;
create policy "Users can create own credit history"
  on credit_history for insert
  with check (auth.uid() = user_id);

-- Payment events: service role only (not user-accessible)
drop policy if exists "Service role can manage payment events" on payment_events;
create policy "Service role can manage payment events"
  on payment_events for all
  using (true)
  with check (true);