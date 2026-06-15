-- HYNTRIX AI - Production Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- EXTENSIONS
-- ============================================
create extension if not exists "pgcrypto";

-- ============================================
-- PROFILES TABLE (extends Supabase Auth.users)
-- ============================================

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  avatar_url text,
  age int,
  skills text[] default '{}',
  budget text,
  goal text default 'start-business',
  plan text default 'free' check (plan in ('free', 'premium', 'pro', 'enterprise')),
  credits int default 0,
  xp int default 0,
  level int default 1,
  is_admin boolean default false,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_users_email on users(email);
create index if not exists idx_users_plan on users(plan);
create index if not exists idx_users_is_admin on users(is_admin);

-- ============================================
-- USER SETTINGS TABLE
-- ============================================

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade unique,
  notifications_enabled boolean default true,
  email_updates boolean default true,
  theme text default 'dark',
  language text default 'en',
  preferences jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_settings_user_id on settings(user_id);

-- ============================================
-- STREAKS TABLE
-- ============================================

create table if not exists streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade unique,
  streak_days int default 0,
  last_active_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_streaks_user_id on streaks(user_id);

-- ============================================
-- REPORTS TABLES
-- ============================================

create table if not exists startup_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  startup_name text not null,
  startup_description text,
  market_score int,
  competition_score int,
  revenue_score int,
  risk_score int,
  total_score int,
  verdict text,
  strengths text[],
  weaknesses text[],
  recommendations text[],
  action_plan text[],
  report_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_startup_reports_user_id on startup_reports(user_id);
create index if not exists idx_startup_reports_created_at on startup_reports(created_at);

create table if not exists founder_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  founder_type text,
  strengths text[],
  weaknesses text[],
  skills text[],
  action_plan text[],
  score int,
  report_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_founder_reports_user_id on founder_reports(user_id);

create table if not exists social_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'youtube', 'linkedin', 'telegram', 'x')),
  username text not null,
  growth_score int,
  brand_score int,
  trust_score int,
  content_ideas text[],
  suggestions text[],
  report_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_social_reports_user_id on social_reports(user_id);
create index if not exists idx_social_reports_platform on social_reports(platform);

-- ============================================
-- SAVED REPORTS & HISTORY
-- ============================================

create table if not exists saved_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  report_type text not null check (report_type in ('startup', 'founder', 'social')),
  report_id uuid not null,
  title text,
  subtitle text,
  score int,
  saved_at timestamptz default now()
);

create index if not exists idx_saved_reports_user_id on saved_reports(user_id);

create table if not exists history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  action text not null,
  feature text,
  feature_type text,
  report_id uuid,
  score int,
  details jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_history_user_id on history(user_id);
create index if not exists idx_history_created_at on history(created_at);

-- ============================================
-- CREDITS & PAYMENTS
-- ============================================

create table if not exists credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade unique,
  amount int not null default 0,
  used int default 0,
  remaining int default 0,
  plan_name text default 'free',
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_credits_user_id on credits(user_id);

-- Transaction audit trail for credits
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('purchase', 'usage', 'bonus', 'refund', 'signup')),
  credits integer not null,
  balance_before integer not null default 0,
  balance_after integer not null default 0,
  description text,
  reference_type text,
  reference_id text,
  created_at timestamptz default now()
);

create index if not exists idx_transactions_user_id on transactions(user_id);
create index if not exists idx_transactions_created_at on transactions(created_at);

-- Stored AI reports (unified for all features)
create table if not exists stored_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  feature_key text not null,
  feature_title text,
  category text,
  input text,
  report jsonb not null,
  credits_used int default 0,
  saved boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_stored_reports_user_id on stored_reports(user_id);
create index if not exists idx_stored_reports_feature_key on stored_reports(feature_key);
create index if not exists idx_stored_reports_created_at on stored_reports(created_at);

-- AI Client Finder tables (future)
create table if not exists client_finder_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  search_query text,
  industry text,
  location text,
  min_size text,
  keywords text[],
  results_count int,
  credits_used int default 20,
  created_at timestamptz default now()
);

create index if not exists idx_client_finder_searches_user_id on client_finder_searches(user_id);

create table if not exists client_finder_results (
  id uuid primary key default gen_random_uuid(),
  search_id uuid references client_finder_searches(id) on delete cascade,
  company_name text,
  website text,
  industry text,
  size text,
  location text,
  tech_stack text[],
  funding text,
  fit_score int,
  opportunity_summary text,
  outreach_text text,
  decision_makers jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_client_finder_results_search_id on client_finder_results(search_id);

-- Analytics events (future)
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  event_type text not null,
  event_data jsonb default '{}',
  page text,
  session_id text,
  created_at timestamptz default now()
);

create index if not exists idx_analytics_events_user_id on analytics_events(user_id);
create index if not exists idx_analytics_events_type on analytics_events(event_type);
create index if not exists idx_analytics_events_created_at on analytics_events(created_at);

-- Advisor feedback (board room)
create table if not exists advisor_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  session_id text,
  advisor_id text,
  question text,
  feedback text,
  created_at timestamptz default now()
);

create index if not exists idx_advisor_feedback_user_id on advisor_feedback(user_id);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  amount int not null,
  currency text default 'INR',
  status text default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  razorpay_order_id text,
  razorpay_payment_id text,
  plan text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_payments_user_id on payments(user_id);
create index if not exists idx_payments_status on payments(status);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  plan text not null,
  status text not null check (status in ('active', 'cancelled', 'expired')),
  started_at timestamptz default now(),
  renewed_at timestamptz,
  canceled_at timestamptz,
  expires_at timestamptz
);

create index if not exists idx_subscriptions_user_id on subscriptions(user_id);

-- ============================================
-- AUDIT LOGS
-- ============================================

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  action text not null,
  resource_type text,
  resource_id text,
  ip_address text,
  user_agent text,
  status text default 'success',
  created_at timestamptz default now()
);

create index if not exists idx_audit_logs_user_id on audit_logs(user_id);
create index if not exists idx_audit_logs_created_at on audit_logs(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
alter table if exists users enable row level security;
alter table if exists settings enable row level security;
alter table if exists streaks enable row level security;
alter table if exists startup_reports enable row level security;
alter table if exists founder_reports enable row level security;
alter table if exists social_reports enable row level security;
alter table if exists saved_reports enable row level security;
alter table if exists history enable row level security;
alter table if exists credits enable row level security;
alter table if exists payments enable row level security;
alter table if exists subscriptions enable row level security;
alter table if exists audit_logs enable row level security;

-- ============================================
-- USERS POLICIES
-- ============================================

drop policy if exists "Users can view own profile" on users;
create policy "Users can view own profile"
  on users for select
  using (auth.uid() = id);

drop policy if exists "Users can create own profile" on users;
create policy "Users can create own profile"
  on users for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on users;
create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

-- ============================================
-- SETTINGS POLICIES
-- ============================================

drop policy if exists "Users can view own settings" on settings;
create policy "Users can view own settings"
  on settings for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own settings" on settings;
create policy "Users can create own settings"
  on settings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own settings" on settings;
create policy "Users can update own settings"
  on settings for update
  using (auth.uid() = user_id);

-- ============================================
-- STREAKS POLICIES
-- ============================================

drop policy if exists "Users can view own streaks" on streaks;
create policy "Users can view own streaks"
  on streaks for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own streaks" on streaks;
create policy "Users can create own streaks"
  on streaks for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own streaks" on streaks;
create policy "Users can update own streaks"
  on streaks for update
  using (auth.uid() = user_id);

-- ============================================
-- STARTUP REPORTS POLICIES
-- ============================================

drop policy if exists "Users can view own startup reports" on startup_reports;
create policy "Users can view own startup reports"
  on startup_reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create startup reports" on startup_reports;
create policy "Users can create startup reports"
  on startup_reports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own startup reports" on startup_reports;
create policy "Users can update own startup reports"
  on startup_reports for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own startup reports" on startup_reports;
create policy "Users can delete own startup reports"
  on startup_reports for delete
  using (auth.uid() = user_id);

-- ============================================
-- FOUNDER REPORTS POLICIES
-- ============================================

drop policy if exists "Users can view own founder reports" on founder_reports;
create policy "Users can view own founder reports"
  on founder_reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create founder reports" on founder_reports;
create policy "Users can create founder reports"
  on founder_reports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own founder reports" on founder_reports;
create policy "Users can update own founder reports"
  on founder_reports for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own founder reports" on founder_reports;
create policy "Users can delete own founder reports"
  on founder_reports for delete
  using (auth.uid() = user_id);

-- ============================================
-- SOCIAL REPORTS POLICIES
-- ============================================

drop policy if exists "Users can view own social reports" on social_reports;
create policy "Users can view own social reports"
  on social_reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create social reports" on social_reports;
create policy "Users can create social reports"
  on social_reports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own social reports" on social_reports;
create policy "Users can update own social reports"
  on social_reports for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own social reports" on social_reports;
create policy "Users can delete own social reports"
  on social_reports for delete
  using (auth.uid() = user_id);

-- ============================================
-- SAVED REPORTS POLICIES
-- ============================================

drop policy if exists "Users can view own saved reports" on saved_reports;
create policy "Users can view own saved reports"
  on saved_reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can save reports" on saved_reports;
create policy "Users can save reports"
  on saved_reports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saved reports" on saved_reports;
create policy "Users can delete own saved reports"
  on saved_reports for delete
  using (auth.uid() = user_id);

-- ============================================
-- HISTORY POLICIES
-- ============================================

drop policy if exists "Users can view own history" on history;
create policy "Users can view own history"
  on history for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create history entries" on history;
create policy "Users can create history entries"
  on history for insert
  with check (auth.uid() = user_id);

-- ============================================
-- CREDITS POLICIES
-- ============================================

drop policy if exists "Users can view own credits" on credits;
create policy "Users can view own credits"
  on credits for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own credits" on credits;
create policy "Users can create own credits"
  on credits for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own credits" on credits;
create policy "Users can update own credits"
  on credits for update
  using (auth.uid() = user_id);

-- ============================================
-- PAYMENTS POLICIES
-- ============================================

drop policy if exists "Users can view own payments" on payments;
create policy "Users can view own payments"
  on payments for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own payments" on payments;
create policy "Users can create own payments"
  on payments for insert
  with check (auth.uid() = user_id);

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================

drop policy if exists "Users can view own subscriptions" on subscriptions;
create policy "Users can view own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own subscriptions" on subscriptions;
create policy "Users can create own subscriptions"
  on subscriptions for insert
  with check (auth.uid() = user_id);

-- ============================================
-- AUDIT LOGS - ADMIN ONLY
-- ============================================

drop policy if exists "Only admins can view audit logs" on audit_logs;
create policy "Only admins can view audit logs"
  on audit_logs for select
  using (
    auth.uid() in (
      select id from users where is_admin = true
    )
  );

drop policy if exists "Service role can insert audit logs" on audit_logs;
create policy "Service role can insert audit logs"
  on audit_logs for insert
  with check (true);