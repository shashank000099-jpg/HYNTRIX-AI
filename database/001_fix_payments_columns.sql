-- ============================================
-- SAFE PRODUCTION MIGRATION
-- Fix payments table column mismatch
-- ============================================
-- The runtime code uses: order_id, payment_id, credits, error_message, receipt, notes
-- The production table has: razorpay_order_id, razorpay_payment_id (no credits/receipt/notes)
-- 
-- This migration adds the missing columns and backfills existing data.
-- It does NOT remove old columns (backward compatible).
-- It does NOT modify the transactions table.
-- ============================================

-- 1. Add missing columns (IF NOT EXISTS makes it idempotent)
alter table payments add column if not exists order_id text;
alter table payments add column if not exists payment_id text;
alter table payments add column if not exists credits integer;
alter table payments add column if not exists error_message text;
alter table payments add column if not exists receipt text;
alter table payments add column if not exists notes jsonb;

-- 2. Backfill order_id from existing razorpay_order_id
update payments
set order_id = razorpay_order_id
where order_id is null
  and razorpay_order_id is not null;

-- 3. Backfill payment_id from existing razorpay_payment_id
update payments
set payment_id = razorpay_payment_id
where payment_id is null
  and razorpay_payment_id is not null;

-- 4. Add index on new columns for performance
create index if not exists idx_payments_order_id_new on payments(order_id);
create index if not exists idx_payments_payment_id on payments(payment_id);

-- ============================================
-- VERIFICATION (run after migration):
-- select column_name, data_type from information_schema.columns
-- where table_name = 'payments' order by ordinal_position;
-- ============================================