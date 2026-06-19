alter table if exists transactions
  add column if not exists order_id text,
  add column if not exists payment_id text,
  add column if not exists amount integer,
  add column if not exists currency text default 'INR',
  add column if not exists status text default 'pending',
  add column if not exists error_message text,
  add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'transactions_status_check'
  ) then
    alter table transactions
      add constraint transactions_status_check
      check (status in ('pending', 'success', 'failed', 'cancelled'));
  end if;
end $$;

create index if not exists idx_transactions_order_id on transactions(order_id);
create index if not exists idx_transactions_status on transactions(status);

create table if not exists credit_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('purchase', 'usage')),
  credits integer not null,
  description text,
  feature_name text,
  transaction_id uuid references transactions(id) on delete set null,
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