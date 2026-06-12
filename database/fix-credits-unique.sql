-- Fix: Add UNIQUE constraint to credits.user_id
-- This allows upsert with ON CONFLICT (user_id)
-- Run this in Supabase SQL Editor

ALTER TABLE public.credits
  ADD CONSTRAINT credits_user_id_unique
  UNIQUE (user_id);