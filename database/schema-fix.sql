-- HYNTRIX AI - Database Fix Migration
-- Run this in Supabase SQL Editor to fix all issues

-- 1. Fix any existing users with invalid plan values
-- The schema only allows: 'free', 'premium', 'pro', 'enterprise'
-- This fixes users who got 'starter', 'basic', 'Free', etc.
UPDATE users SET plan = 'free' WHERE plan NOT IN ('free', 'premium', 'pro', 'enterprise');

-- 2. Ensure all existing users have 0 credits (no free credits)
UPDATE users SET credits = 0;
