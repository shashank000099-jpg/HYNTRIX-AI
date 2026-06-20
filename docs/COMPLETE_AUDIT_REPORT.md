# COMPLETE LAUNCH AUDIT REPORT

## A. Exact Database Tables Used

### Payment Flow Tables:
1. **`payments`** (from `schema.sql`) - Main payment transactions table
   - Columns: `id`, `user_id`, `amount`, `currency`, `status`, `razorpay_order_id`, `razorpay_payment_id`, `plan`, `created_at`, `updated_at`
   - Status check: `('pending', 'completed', 'failed', 'cancelled')`
   - Migration `001_fix_payments_columns.sql` added: `order_id`, `payment_id`, `credits`, `error_message`, `receipt`, `notes`

2. **`payment_transactions`** (from `credits-billing.sql`) - **UNUSED** by runtime code
   - Created but never queried by billing-service.ts

3. **`credit_history`** (from `credits-billing.sql`) - Credit movement audit trail
4. **`payment_events`** (from `credits-billing.sql`) - Webhook event audit
5. **`credits`** (from `schema.sql`) - User credit wallet

### Report Flow Tables:
1. **`stored_reports`** (from `schema.sql`) - Where AI-generated reports are actually saved
2. **`saved_reports`** (from `schema.sql`) - Report bookmark/index table
3. **`history`** (from `schema.sql`) - User activity log
4. **`startup_reports`**, **`founder_reports`**, **`social_reports`** (from `schema.sql`) - Legacy report tables (unused by new AI flow)

## B. Reports Table Schema (`saved_reports`)

```sql
saved_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('startup', 'founder', 'social')),
  report_id uuid NOT NULL,          -- References stored_reports.id
  title text,
  subtitle text,
  score int,
  saved_at timestamptz DEFAULT now()
)
```

## C. Why Transaction Status Is Not Updating

**ROOT CAUSE: Check constraint mismatch between code and database.**

The `payments` table has a CHECK constraint:
```sql
status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled'))
```

But `billing-service.ts` sets status to `'success'`:
```typescript
// Line 144 in billing-service.ts
.update({ status: 'success', ... })
```

`'success'` is NOT in the allowed values `('pending', 'completed', 'failed', 'cancelled')`. The database rejects the update with a check constraint violation. The error is silently caught and logged, but the status never changes from 'pending'.

**Secondary issue:** The `credits-billing.sql` migration created a separate `payment_transactions` table with the correct status values `('pending', 'success', 'failed', 'cancelled', 'refunded')`, but the runtime code writes to `payments` table, not `payment_transactions`.

## D. Why Saved Reports Cannot Be Viewed

**ROOT CAUSE: Two separate issues.**

1. **Reports are saved to `stored_reports` but NOT indexed in `saved_reports`:**
   - `app/api/ai/generate/route.ts` saves the AI report to `stored_reports` table (line 252-263)
   - But it NEVER creates an entry in `saved_reports` table
   - The `saved-reports/page.tsx` queries `saved_reports` table, which is empty

2. **No detail page or link to view full report content:**
   - The saved-reports page cards are NOT clickable (no `<Link>` wrapper)
   - There is no API endpoint to fetch a single report from `stored_reports` by ID
   - There is no detail page to display the full report content

## E. Exact Files That Need Fixing

### Payment Status Fix:
1. **`database/001_fix_payments_columns.sql`** - Add ALTER to fix status check constraint
2. **`lib/services/billing-service.ts`** - No changes needed (code is correct, DB constraint is wrong)

### Report Viewing Fix:
3. **`app/api/ai/generate/route.ts`** - Add `saved_reports` insert after storing report
4. **`app/saved-reports/page.tsx`** - Make report cards clickable with links to detail page
5. **`app/saved-reports/report/[id]/page.tsx`** - NEW: Report detail page
6. **`app/api/reports/[id]/route.ts`** - NEW: API to fetch single report from `stored_reports`