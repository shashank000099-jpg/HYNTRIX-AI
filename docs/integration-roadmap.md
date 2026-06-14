# HYNTRIX AI - Integration Roadmap (Phase 2)

## 1. Supabase (Foundation)
- Database: users, reports, credits, payments, challenges, achievements
- Auth: email/password, Google OAuth, magic links
- RLS: user-level data isolation

## 2. Gemini AI (Core Engine)
- 42+ feature prompts for all tools
- Structured JSON output, response parsing
- Streaming for simulators

## 3. Razorpay (Revenue)
- Plans: Free, Premium (999), Pro (2999), Enterprise
- Credit system: 3/month free, 100/month premium, unlimited pro
- Webhook-based payment confirmation

## 4. Report Storage
- Save reports to Supabase
- PDF export with branded layout
- Share links with token access

## 5. Authentication
- Login, signup, forgot password pages
- Protected routes via middleware
- Auth context provider

## Priority Order
1. Supabase DB + Auth (Weeks 1-2)
2. Gemini AI Engine (Weeks 3-4)
3. Opportunity + Social + Board Room (Weeks 5-6)
4. Razorpay + Credits (Weeks 7-8)
5. Report Storage + PDF + Polish (Weeks 9-10)

## Environment Variables
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- GEMINI_API_KEY
- NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
- YOUTUBE_API_KEY, APIFY_API_KEY