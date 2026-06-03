-- HYNTRIX AI - Production Database Schema
-- All tables have proper indexes, constraints, and security

-- ============================================
-- AUTHENTICATION & USERS
-- ============================================

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  avatar_url text,
  age int,
  skills text[] default '{}',
  budget text,
  goal text,
  plan text default 'free' check (plan in ('free', 'premium', 'pro', 'enterprise')),
  credits int default 0,
  xp int default 0,
  level int default 1,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_users_email on users(email);
create index idx_users_plan on users(plan);
create index idx_users_is_admin on users(is_admin);

-- ============================================
-- REPORTS
-- ============================================

create table startup_reports (
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

create index idx_startup_reports_user_id on startup_reports(user_id);
create index idx_startup_reports_created_at on startup_reports(created_at);

create table founder_reports (
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

create index idx_founder_reports_user_id on founder_reports(user_id);

create table social_reports (
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

create index idx_social_reports_user_id on social_reports(user_id);
create index idx_social_reports_platform on social_reports(platform);

-- ============================================
-- SAVED & HISTORY
-- ============================================

create table saved_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  report_type text not null check (report_type in ('startup', 'founder', 'social')),
  report_id uuid not null,
  saved_at timestamptz default now()
);

create index idx_saved_reports_user_id on saved_reports(user_id);

create table history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  action text not null,
  feature text,
  details jsonb,
  created_at timestamptz default now()
);

create index idx_history_user_id on history(user_id);
create index idx_history_created_at on history(created_at);

-- ============================================
-- CREDITS & PAYMENTS
-- ============================================

create table credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  amount int not null,
  used int default 0,
  remaining int,
  plan_name text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index idx_credits_user_id on credits(user_id);

create table payments (
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

create index idx_payments_user_id on payments(user_id);
create index idx_payments_status on payments(status);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  plan text not null,
  status text not null check (status in ('active', 'cancelled', 'expired')),
  started_at timestamptz default now(),
  renewed_at timestamptz,
  canceled_at timestamptz,
  expires_at timestamptz
);

create index idx_subscriptions_user_id on subscriptions(user_id);

-- ============================================
-- GAMIFICATION
-- ============================================

create table achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text,
  icon text,
  unlocked_at timestamptz default now()
);

create index idx_achievements_user_id on achievements(user_id);

create table streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  streak_days int default 0,
  last_active_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_streaks_user_id on streaks(user_id);

-- ============================================
-- USER SETTINGS
-- ============================================

create table settings (
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

create index idx_settings_user_id on settings(user_id);

-- ============================================
-- ADVISOR & EXPERT SYSTEMS
-- ============================================

create table advisors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('product', 'growth', 'finance', 'legal')),
  expertise text,
  photo_url text,
  bio text,
  created_at timestamptz default now()
);

create table advisor_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  session_id uuid,
  advisor_id uuid references advisors(id),
  question text,
  feedback text,
  created_at timestamptz default now()
);

create index idx_advisor_feedback_user_id on advisor_feedback(user_id);

create table shark_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  investment_range text,
  photo_url text,
  personality text,
  bio text,
  created_at timestamptz default now()
);

-- ============================================
-- AUDIT & SECURITY
-- ============================================

create table audit_logs (
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

create index idx_audit_logs_user_id on audit_logs(user_id);
create index idx_audit_logs_created_at on audit_logs(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
alter table users enable row level security;
alter table startup_reports enable row level security;
alter table founder_reports enable row level security;
alter table social_reports enable row level security;
alter table saved_reports enable row level security;
alter table history enable row level security;
alter table credits enable row level security;
alter table payments enable row level security;
alter table subscriptions enable row level security;
alter table achievements enable row level security;
alter table streaks enable row level security;
alter table settings enable row level security;
alter table advisor_feedback enable row level security;
alter table audit_logs enable row level security;

-- Users can only see their own data
create policy "Users can see their own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on users for update
  using (auth.uid() = id);

-- Reports: Users can only access their own reports
create policy "Users can see their own startup reports"
  on startup_reports for select
  using (auth.uid() = user_id);

create policy "Users can see their own founder reports"
  on founder_reports for select
  using (auth.uid() = user_id);

create policy "Users can see their own social reports"
  on social_reports for select
  using (auth.uid() = user_id);

-- Credits & Payments: Users can only see their own
create policy "Users can see their own credits"
  on credits for select
  using (auth.uid() = user_id);

create policy "Users can see their own payments"
  on payments for select
  using (auth.uid() = user_id);

-- History: Users can only see their own
create policy "Users can see their own history"
  on history for select
  using (auth.uid() = user_id);

-- Settings: Users can only access their own
create policy "Users can see their own settings"
  on settings for select
  using (auth.uid() = user_id);

create policy "Users can update their own settings"
  on settings for update
  using (auth.uid() = user_id);
