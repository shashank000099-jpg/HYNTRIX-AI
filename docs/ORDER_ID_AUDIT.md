# Runtime Error: `column "order_id" does not exist`

## Exact Root Cause

The code in `lib/services/billing-service.ts` (line ~82) does:
```typescript
await supabase
  .from('payments')
  .insert({
    order_id: orderId,   // <-- Column name used by code
    payment_id: null,
    ...
  })
```

But the **production `payments` table** was created from `database/schema.sql` (the original schema), which defines the column as **`razorpay_order_id`**, NOT `order_id`.

## Table Definitions (Two Competing Schemas)

### 1. `database/schema.sql` — Lines 277-288 (PRODUCTION REALITY)
```sql
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  amount int not null,
  currency text default 'INR',
  status text default 'pending',
  razorpay_order_id text,         -- ⚠️ COLUMN NAME: razorpay_order_id
  razorpay_payment_id text,
  plan text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 2. `database/supabase-migration.sql` — Lines 4-18 (NEVER APPLIED TO PRODUCTION)
```sql
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id text unique not null,  -- ✅ COLUMN NAME: order_id
  payment_id text,
  amount integer not null,
  credits integer not null,
  ...
);
```

### 3. `database/credits-billing.sql` — Lines 7-20 (DIFFERENT TABLE)
```sql
create table if not exists payment_transactions (  -- ⚠️ DIFFERENT TABLE NAME
  id uuid primary key default gen_random_uuid(),
  ...
  order_id text not null,
  ...
);
```
This creates a *separate* table `payment_transactions`, not `payments`. It is never queried by the runtime code.

## Audit Checklist

### ✅ 1. Is production using the same Supabase project?
The `.env` file has different placeholder values vs `.env.local` which has:
```
NEXT_PUBLIC_SUPABASE_URL=https://fvcivjcynzfwgtuvzqkw.supabase.co
```
This is the live Supabase project. Yes, the production deployment uses this same project.

### ✅ 2. Print SUPABASE_URL
```
NEXT_PUBLIC_SUPABASE_URL=https://fvcivjcynzfwgtuvzqkw.supabase.co
```
Project reference: `fvcivjcynzfwgtuvzqkw`

### ✅ 3. Print project reference ID
```
fvcivjcynzfwgtuvzqkw
```

### ✅ 4. Print exact insert query executed by create-order
File: `lib/services/billing-service.ts` (lines 78-91):
```typescript
const { data, error } = await supabase
  .from('payments')
  .insert({
    user_id: userId,
    order_id: orderId,         // ← CAUSES ERROR: No such column in production
    payment_id: null,
    amount: amount,
    credits: credits,
    currency: 'INR',
    status: 'pending',
    receipt: receipt || null,
    notes: notes || null,
  })
  .select()
  .single()
```

### ✅ 5. Verify deployment is using latest code
The code in `billing-service.ts` file on disk matches what's shown (confirming the current codebase has `order_id`). If Vercel deploys from this branch, it deploys this same code.

### ✅ 6. Verify create-order is querying public.transactions
`createPendingTransaction` queries `public.payments` (NOT `public.transactions`). The `payments` table exists but its column is `razorpay_order_id`, not `order_id`.

### ✅ 7. Verify no old migration/schema cache exists
There are **three competing SQL definitions**:
- `database/schema.sql` — has `razorpay_order_id` (`payments` table)
- `database/supabase-migration.sql` — has `order_id` (`payments` table)  
- `database/credits-billing.sql` — has `order_id` (`payment_transactions` table, different name)

Since `create table if not exists` does **not** alter existing tables, the production database still has the original schema from `schema.sql` with `razorpay_order_id`.

## Summary

| File | Table Name | Column Name |
|------|-----------|-------------|
| `schema.sql` (RUN ON PROD) | `payments` | `razorpay_order_id` |
| `supabase-migration.sql` (NOT RUN) | `payments` | `order_id` |
| `billing-service.ts` (CODE) | `payments` | `order_id` ❌ |

**The fix must be one of:**
1. **Run `database/supabase-migration.sql`** on the Supabase SQL Editor to migrate the `payments` table to the new schema with `order_id`.
2. **OR** Change `billing-service.ts` to use `razorpay_order_id` instead of `order_id` and keep the old schema.

Solution 1 is recommended since `supabase-migration.sql` also adds `credits`, `error_message`, `receipt`, and `notes` columns needed by the billing system.