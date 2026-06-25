-- ============================================
-- STORED REPORTS RLS POLICIES (MISSING)
-- ============================================

alter table if exists stored_reports enable row level security;

drop policy if exists "Users can view own stored reports" on stored_reports;
create policy "Users can view own stored reports"
  on stored_reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create stored reports" on stored_reports;
create policy "Users can create stored reports"
  on stored_reports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own stored reports" on stored_reports;
create policy "Users can update own stored reports"
  on stored_reports for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own stored reports" on stored_reports;
create policy "Users can delete own stored reports"
  on stored_reports for delete
  using (auth.uid() = user_id);