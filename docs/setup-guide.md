# Hyntrix AI Setup Guide

**Simple steps to get Hyntrix AI running on your computer or server.**

---

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd rehyntrixai
npm install
```

---

## Step 2: Create .env.local File

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Now open `.env.local` and add your API keys. Don't worry, we'll go through each one.

---

## Step 3: Set Up Supabase (Database & Auth)

Supabase is where all your user data and reports are stored. It also handles login.

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and create a new project
3. Go to **Settings > API** in your project
4. Copy these two values:
   - `Project URL` → Add to `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Add as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Go to **Settings > API** and scroll down to find `service_role` key
   - Copy it → Add as `SUPABASE_SERVICE_ROLE_KEY`

Now run this SQL to create all the tables:

1. Open Supabase SQL Editor
2. Copy everything from `database/schema.sql`
3. Paste it in the SQL Editor and run it

**That's it!** Supabase is ready.

---

## Step 4: Set Up Razorpay (Payments)

Razorpay collects payment from users in India.

1. Go to [razorpay.com](https://razorpay.com)
2. Create an account and verify your business
3. Go to **Settings > API Keys**
4. Copy:
   - `Key ID` → Add as `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `Key Secret` → Add as `RAZORPAY_SECRET_KEY`

**Payment is ready!** Users can now buy credits.

---

## Step 5: Set Up Gemini (AI Analysis)

Google Gemini powers the startup analysis, founder DNA, and smart advice.

1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Create a new project
4. Copy the API key
5. Add it to `.env.local` as `GEMINI_API_KEY`

**AI is ready!** The app can now analyze startups and give feedback.

---

## Step 6: Set Up YouTube API (Social Analysis)

YouTube API lets users check their channel growth.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Search for "YouTube Data API" and enable it
4. Go to **Credentials** and create an API Key
5. Copy the key → Add as `YOUTUBE_API_KEY`

**YouTube analysis is ready!**

---

## Step 7: Set Up Apify (Social Scraping)

Apify fetches data from Instagram, Twitter, and other platforms.

1. Go to [apify.com](https://apify.com)
2. Create an account
3. Go to **Settings > Integrations > API**
4. Copy your API Token
5. Add it as `APIFY_API_KEY`

**Social intelligence is ready!**

---

## Step 8: Set Up OpenAI (Optional)

OpenAI is optional. It can be used for premium features.

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and add a payment method
3. Go to **API Keys**
4. Create a new key
5. Add it as `OPENAI_API_KEY`

**Optional: Premium AI is ready!**

---

## Step 9: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the login page. Create an account and enjoy!

---

## Step 10: Deploy to Vercel (Optional)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project" and select your GitHub repo
4. Add the same `.env.local` variables in Vercel dashboard
5. Click "Deploy"

**Your app is now live!**

---

## Troubleshooting

**"Supabase connection failed"**
- Check if `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Make sure Supabase project is active

**"Login not working"**
- Make sure the Supabase schema is created
- Check if authentication is enabled in Supabase

**"Payments not working"**
- Check if `RAZORPAY_KEY_ID` is correct
- Make sure you're in test mode first

**"Reports not generating"**
- Check if `GEMINI_API_KEY` is valid
- Check if API key has quota left

---

## Need Help?

Check the feature map at `docs/feature-map.md` to understand which API powers which feature.
