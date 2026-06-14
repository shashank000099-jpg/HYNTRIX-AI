# Hyntrix AI - Your AI Founder Operating System

**Build, grow, and scale your business with AI-powered insights.**

Hyntrix AI is a complete, production-ready SaaS application that gives founders, creators, and entrepreneurs instant AI-powered analysis of their startup ideas, social media, and business potential.

---

## What Can You Do With Hyntrix AI?

### Free Features (No Payment Needed)
- **Check Your Startup** - Get a startup score and see if your idea has potential
- **Founder DNA** - Understand your strengths, weaknesses, and what kind of founder you are
- **Find Business Ideas** - Get personalized business ideas based on your skills and budget
- Get 3 free reports per day

### Paid Features (Premium)
- **Roast Your Startup** - Get brutal honest feedback on your business
- **Check Instagram Growth** - Analyze your Instagram and see what's working
- **Check YouTube Growth** - Analyze your YouTube channel performance
- **Board Room Advice** - Get advice from 4 expert advisors (Product, Growth, Finance, Legal)
- **Customer Simulator** - See how real customers will react to your idea
- **Shark Tank Pitch** - Practice pitching to investors and get feedback
- Unlimited reports, priority support, and more

---

## Features

### Core Technology
- **Next.js 15** - Fast, modern web framework
- **TypeScript** - Safe, professional code
- **Tailwind CSS** - Beautiful, responsive design
- **Supabase** - Secure database and user authentication
- **Mobile-First Design** - Works perfectly on phones and computers

### AI Integrations
- **Google Gemini** - For startup analysis and founder insights
- **OpenAI** - Optional premium AI features
- **YouTube API** - Analyze YouTube channel growth
- **Apify** - Extract data from social platforms
- **Razorpay** - Accept payments in India

### Security & Privacy
- No API keys are shown to users
- Secure login with email and password
- Google login support
- Protected routes - only logged-in users can access features
- Role-based access - admin and regular users
- Database row-level security (RLS) - users can only see their own data
- Encrypted passwords and secure sessions

---

## Quick Start

### 1. Install
```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### 2. Add Your API Keys
Copy `.env.example` to `.env.local` and add:
- Supabase database URL and keys
- Gemini AI key
- Razorpay payment keys
- YouTube, Apify, and OpenAI keys (optional)

See `docs/setup-guide.md` for detailed instructions.

### 3. Set Up Database
Run the SQL from `database/schema.sql` in your Supabase project.

### 4. Deploy
Push to GitHub and deploy to Vercel in 1 click.

---

## File Structure

```
rehyntrixai/
├── app/                 # All pages and routes
│   ├── auth/           # Login, signup, password reset
│   ├── admin/          # Hidden admin dashboard (integrations, logs, system)
│   ├── page.tsx        # Home page with quick actions
│   ├── profile/        # User profile and settings
│   ├── startup-intelligence/  # Startup analysis
│   ├── social-intelligence/   # Social media analysis
│   ├── board-room/     # Get advice from advisors
│   ├── simulators/     # Customer simulator, Shark Tank
│   └── settings/       # Billing, security, preferences
├── components/         # Reusable React components
│   ├── ui/            # Buttons, cards, inputs, etc.
│   └── MobileNav.tsx  # Bottom navigation for mobile
├── lib/
│   ├── types.ts       # TypeScript types
│   ├── supabase/      # Database client
│   ├── ai/            # Gemini and OpenAI
│   ├── social/        # YouTube, Apify
│   └── payments/      # Razorpay
├── database/          # SQL schema
└── docs/              # Documentation
    ├── setup-guide.md
    └── feature-map.md
```

---

## Pricing

### Free Plan
- 3 free reports per day
- Basic startup analysis
- Founder DNA test
- Forever free

### Premium (₹49 - ₹199 per month)
- Unlimited reports
- All paid features
- Priority support
- Cancel anytime

---

## Security Features

✅ **No Exposed Secrets** - API keys are never shown to users  
✅ **Secure Authentication** - Passwords are encrypted, sessions are secure  
✅ **Protected Routes** - Only logged-in users can see features  
✅ **Row-Level Security** - Users see only their own data  
✅ **Rate Limiting** - Protects against abuse  
✅ **Input Validation** - All data is validated and sanitized  
✅ **HTTPS Only** - All connections are encrypted  
✅ **Admin Panel** - Hidden `/admin` area for system management  

---

## Documentation

- **Setup Guide**: `docs/setup-guide.md` - Step-by-step API setup
- **Feature Map**: `docs/feature-map.md` - Which API powers which feature

---

## Architecture

### Frontend (User Sees)
- Clean, simple, mobile-first interface
- No technical jargon
- One-hand thumb-friendly navigation
- Fast loading and smooth animations

### Backend (Secret)
- Secure API routes
- Database validation
- Rate limiting
- Audit logging
- Admin controls

### Admin Area (Hidden)
- `/admin` - Only accessible to admins
- Integration health checks
- System logs and audit trails
- Never visible to regular users

---

## Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import to Vercel
3. Add `.env.local` variables
4. Deploy in 1 click

### Deploy to Anywhere
- Works with any Node.js hosting
- Docker ready
- Environment variables supported

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Google OAuth |
| AI | Google Gemini + OpenAI |
| Payments | Razorpay |
| Social | YouTube API + Apify |
| Hosting | Vercel (recommended) |

---

## Support

- **Setup Issues?** Check `docs/setup-guide.md`
- **Feature Questions?** Check `docs/feature-map.md`
- **API Problems?** Check `.env.example` and verify your keys
- **Database Issues?** Check `database/schema.sql` and Supabase logs

---

## License

This is a production-ready starter kit. Use, modify, and deploy freely.
