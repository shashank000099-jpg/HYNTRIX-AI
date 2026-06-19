# HYNTRIX AI — BILLING SYSTEM AUDIT REPORT

## Section A: Issues Found

### A1. Schema Mismatch — `transactions` table columns don't match code

**Existing schema (schema.sql) `transactions` columns:**
```
id              uuid          ✓
user_id         uuid          ✓  (references users(id))
transaction_type text         ✓  (purchase/usage/bonus/refund/signup)
credits         integer       ✓
balance_before  integer       ✓
balance_after   integer       ✓
description     text          ✓
reference_type  text          ✓
reference_id    text          ✓
created_at      timestamptz   ✓
```

**Missing columns needed by billing code:**
```
order_id        text          ✗ MISSING
payment_id      text          ✗ MISSING
amount          integer       ✗ MISSING
currency        text          ✗ MISSING
status          text          ✗ MISSING  (pending/success/failed/cancelled)
error_message   text          ✗ MISSING
updated_at      timestamptz   ✗ MISSING
```

### A2. Schema Mismatch — `credit_history` table does not exist

**Required columns:**
```
id              uuid          ✗ TABLE MISSING
user_id         uuid          ✗ TABLE MISSING
type            text          ✗ TABLE MISSING  (purchase/usage)
credits         integer       ✗ TABLE MISSING
description     text          ✗ TABLE MISSING
feature_name    text          ✗ TABLE MISSING
transaction_id  uuid          ✗ TABLE MISSING
created_at      timestamptz   ✗ TABLE MISSING
```

### A3. Code References Wrong Table Name — `payment_transactions`

**Files affected:**
- `lib/services/billing-service.ts` — writes to `payment_transactions` table
- `app/api/billing/transactions/route.ts` — queries `payment_transactions`
- `app/credits-billing/page.tsx` — queries `payment_transactions`
- `app/credits-billing/transaction/[id]/page.tsx` — queries `payment_transactions`

**Problem:** These files reference `payment_transactions` but the existing schema has a `transactions` table. The table must be `transactions` after we ALTER it to add the required columns.

### A4. Credit Deduct API Does Not Write `credit_history`

**File:** `app/api/credits/deduct/route.ts`

**Problem:** Deducts credits and writes to old `transactions` table but does NOT write to `credit_history` table. After adding `credit_history`, the deduct API must also write a `credit_history` record.

### A5. Duplicate `transactions` Migration Risk

**File:** `database/supabase-migration.sql`

**Problem:** Creates `transactions` with `CREATE TABLE IF NOT EXISTS`. The table already exists in schema.sql. The new definition has different columns. Running this migration will keep the old table structure (since it already exists), so the new columns will NOT be added.

### A6. Foreign Key Reference

**Problem:** `schema.sql` has `transactions.user_id` referencing `users(id)`. The `credit_history` migration references `transactions(id)`. Both must reference `auth.users(id)` for consistency with Supabase Auth.

---

## Section B: Required Code Changes

### B1. `lib/services/billing-service.ts`
- Change all `payment_transactions` → `transactions`
- Update column references to match existing schema + new columns
- All functions that reference the table must use lowercase `transactions`

### B2. `app/api/billing/transactions/route.ts`
- Change `payment_transactions` → `transactions`

### B3. `app/credits-billing/page.tsx`
- Change `payment_transactions` → `transactions`

### B4. `app/credits-billing/transaction/[id]/page.tsx`
- Change `payment_transactions` → `transactions`

### B5. `app/api/credits/deduct/route.ts`
- After writing to old `transactions` table, also write to `credit_history`

---

## Section C: Required Supabase SQL

Run this in Supabase SQL Editor:

```sql
-- C1. Add missing columns to existing transactions table
alter table if exists transactions
  add column if not exists order_id text,
  add column if not exists payment_id text,
  add column if not exists amount integer,
  add column if not exists currency text default 'INR',
  add column if not exists status text default 'pending',
  add column if not exists error_message text,
  add column if not exists updated_at timestamptz default now();

-- C2. Add status check constraint if not present
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'transactions_status_check'
  ) then
    alter table transactions
      add constraint transactions_status_check
      check (status in ('pending', 'success', 'failed', 'cancelled'));
  end if;
end $$;

-- C3. Create indexes for new columns
create index if not exists idx_transactions_order_id on transactions(order_id);
create index if not exists idx_transactions_status on transactions(status);

-- C4. Create credit_history table
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

-- C5. Enable RLS on credit_history
alter table if exists credit_history enable row level security;

create policy "Users can view own credit history"
  on credit_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own credit history"
  on credit_history for insert
  with check (auth.uid() = user_id);
```

---

## Section D: Files That Must Be Modified

| # | File | Change Required |
|---|------|-----------------|
| 1 | `lib/services/billing-service.ts` | `payment_transactions` → `transactions` (all references) |
| 2 | `app/api/billing/transactions/route.ts` | `payment_transactions` → `transactions` |
| 3 | `app/credits-billing/page.tsx` | `payment_transactions` → `transactions` |
| 4 | `app/credits-billing/transaction/[id]/page.tsx` | `payment_transactions` → `transactions` |
| 5 | `app/api/razorpay/create-order/route.ts` | Uses `billing-service.ts` — no direct change needed after fix |
| 6 | `app/api/razorpay/verify-payment/route.ts` | Uses `billing-service.ts` — no direct change needed |
| 7 | `app/api/razorpay/cancel-order/route.ts` | Uses `billing-service.ts` — no direct change needed |
| 8 | `app/api/razorpay/webhook/route.ts` | Uses `billing-service.ts` — no direct change needed |
| 9 | `app/api/credits/deduct/route.ts` | Add `credit_history` insert after successful deduction |
| 10 | `database/supabase-migration.sql` | Replace with ALTER TABLE statements (Section C) |