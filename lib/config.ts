// ============================================
// PRODUCTION DOMAIN CONFIGURATION
// ============================================
// Only use https://hyntrixai.com in production
// No localhost, no vercel.app, no IP addresses

export const SITE_CONFIG = {
  name: 'HYNTRIX AI',
  tagline: 'AI Operating System for Founders',
  description: 'Premium AI intelligence platform for founders, creators, and businesses. Analyze your startup, discover your founder DNA, find clients, and get expert AI advice.',
  url: process.env.NODE_ENV === 'production' 
    ? 'https://hyntrixai.com' 
    : 'http://localhost:3000',
  siteUrl: 'https://hyntrixai.com',
  locale: 'en_US',
  twitterHandle: '@hyntrixai',
  logo: '/logo.png',
  logoWidth: 1200,
  logoHeight: 630,
  defaultOgImage: '/og-image.png',
  themeColor: '#1e3a5f',
  backgroundColor: '#0a0a1a',
} as const

export const SITE_NAME = 'HYNTRIX AI'
export const SITE_URL = 'https://hyntrixai.com'
export const TWITTER_HANDLE = '@hyntrixai'
export const DEFAULT_OG_IMAGE = '/og-image.png'

// ============================================
// FEATURE METADATA FOR SEO
// Each tool gets unique SEO metadata
// ============================================

export interface ToolSEOData {
  title: string
  description: string
  keywords: string[]
  path: string
  category: 'startup-intelligence' | 'founder-intelligence' | 'social-intelligence' | 'opportunity-hub' | 'ai-client-finder'
  structuredData: Record<string, any>
}

export const TOOLS_SEO: Record<string, ToolSEOData> = {
  'startup-judge': {
    title: 'Startup Judge - AI Startup Analyzer | HYNTRIX AI',
    description: 'Get your startup idea judged by AI. Analyze viability, market fit, competition, and execution risk. Make data-informed decisions before you launch.',
    keywords: ['startup judge', 'startup analyzer', 'business idea analyzer', 'startup viability test', 'ai startup analysis'],
    path: '/startup-intelligence/startup-judge',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Startup Judge',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'startup-roast': {
    title: 'Startup Roast - Honest AI Startup Critique | HYNTRIX AI',
    description: 'Get a brutally honest AI critique of your startup idea. Sharpen your pitch, reveal hidden weaknesses, and build a stronger business.',
    keywords: ['startup roast', 'startup critique', 'business feedback', 'startup pitch review', 'ai startup critic'],
    path: '/startup-intelligence/startup-roast',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Startup Roast',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'death-scanner': {
    title: 'Death Scanner - Startup Failure Risk Analyzer | HYNTRIX AI',
    description: 'Scan your startup for fatal flaws and risky assumptions before launch. Identify what kills startups and fix it early with AI-powered analysis.',
    keywords: ['startup failure', 'death scanner', 'startup risk analysis', 'business risk assessment', 'startup pitfalls'],
    path: '/startup-intelligence/death-scanner',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Death Scanner',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'competitor-scanner': {
    title: 'Competitor Scanner - AI Competitive Analysis Tool | HYNTRIX AI',
    description: 'Benchmark your startup against competitors. Analyze market positioning, differentiation, and competitive advantages with AI-powered intelligence.',
    keywords: ['competitor analysis', 'competitive analysis', 'market benchmarking', 'competitor scanner', 'ai competitor research'],
    path: '/startup-intelligence/competitor-scanner',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Competitor Scanner',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'success-predictor': {
    title: 'Success Predictor - AI Startup Success Score | HYNTRIX AI',
    description: 'Predict your startup success probability with AI. Get a data-informed readiness score and actionable insights to improve your launch strategy.',
    keywords: ['startup success prediction', 'business success score', 'startup readiness', 'launch potential analysis', 'ai predictor'],
    path: '/startup-intelligence/success-predictor',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Success Predictor',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'business-model-analyzer': {
    title: 'Business Model Analyzer - AI Revenue Model Review | HYNTRIX AI',
    description: 'Analyze your business model with AI. Review pricing, margins, recurring revenue signals, and monetization strategy for startup success.',
    keywords: ['business model analysis', 'revenue model analysis', 'pricing strategy', 'monetization analysis', 'ai business review'],
    path: '/startup-intelligence/business-model-analyzer',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Business Model Analyzer',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'moat-analyzer': {
    title: 'Moat Analyzer - AI Competitive Moat Assessment | HYNTRIX AI',
    description: 'Evaluate your startup defensibility and long-term competitive advantages. Analyze barriers to entry and sustainable differentiation with AI.',
    keywords: ['competitive moat', 'business defensibility', 'competitive advantage', 'barriers to entry', 'ai moat analysis'],
    path: '/startup-intelligence/moat-analyzer',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Moat Analyzer',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'founder-dna': {
    title: 'Founder DNA - AI Founder Personality Test | HYNTRIX AI',
    description: 'Discover your founder DNA and leadership profile. Get AI-powered insights into your strengths, weaknesses, and founder archetype.',
    keywords: ['founder dna', 'founder personality test', 'leadership profile', 'entrepreneur assessment', 'ai founder analysis'],
    path: '/founder-intelligence/founder-dna',
    category: 'founder-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Founder DNA',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'founder-score': {
    title: 'Founder Score - AI Founder Performance Score | HYNTRIX AI',
    description: 'Get a comprehensive founder score across execution, vision, and resilience dimensions. AI-powered assessment of your entrepreneurial capabilities.',
    keywords: ['founder score', 'entrepreneur assessment', 'founder performance', 'startup founder evaluation', 'ai founder scoring'],
    path: '/founder-intelligence/founder-score',
    category: 'founder-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Founder Score',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'founder-weakness-scanner': {
    title: 'Founder Weakness Scanner - AI Blind Spot Detector | HYNTRIX AI',
    description: 'Identify your blind spots and gaps as a founder. Get AI-powered insights into areas where you need to improve or build a team.',
    keywords: ['founder weaknesses', 'entrepreneur blind spots', 'founder gaps', 'startup founder weaknesses', 'ai founder analysis'],
    path: '/founder-intelligence/founder-weakness-scanner',
    category: 'founder-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Founder Weakness Scanner',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'leadership-analyzer': {
    title: 'Leadership Analyzer - AI Leadership Style Assessment | HYNTRIX AI',
    description: 'Evaluate your leadership style and team management approach with AI. Get actionable insights to become a better founder-leader.',
    keywords: ['leadership analysis', 'leadership style assessment', 'founder leadership', 'team management', 'ai leadership review'],
    path: '/founder-intelligence/leadership-analyzer',
    category: 'founder-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Leadership Analyzer',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'founder-readiness': {
    title: 'Founder Readiness - AI Launch Readiness Check | HYNTRIX AI',
    description: 'Measure your operational readiness and launch confidence. Get AI-powered insights into whether you are ready to start your startup journey.',
    keywords: ['founder readiness', 'startup readiness', 'launch readiness', 'entrepreneur preparedness', 'ai readiness assessment'],
    path: '/founder-intelligence/founder-readiness',
    category: 'founder-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Founder Readiness',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'founder-gps': {
    title: 'Founder GPS - AI Strategic Roadmap Generator | HYNTRIX AI',
    description: 'Get a strategic map for your next 90-day priorities as a founder. AI-powered actionable roadmap based on your current goals and obstacles.',
    keywords: ['founder gps', 'startup roadmap', 'strategic planning', '90 day plan', 'ai roadmap generator'],
    path: '/founder-intelligence/founder-gps',
    category: 'founder-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Founder GPS',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'founder-roadmap': {
    title: 'Founder Roadmap - AI Milestone Planner | HYNTRIX AI',
    description: 'Build a milestone-driven plan from idea to scale. Get AI-powered step-by-step roadmap tailored to your startup journey.',
    keywords: ['founder roadmap', 'startup milestones', 'business planning', 'startup scale plan', 'ai milestone planner'],
    path: '/founder-intelligence/founder-roadmap',
    category: 'founder-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Founder Roadmap',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'opportunity-finder': {
    title: 'Opportunity Finder - AI Market Opportunity Scanner | HYNTRIX AI',
    description: 'Spot emerging market gaps and high-value business opportunities. Get AI-powered insights into untapped market windows for your next venture.',
    keywords: ['opportunity finder', 'market opportunity', 'business opportunity', 'market gaps', 'ai opportunity scanner'],
    path: '/opportunity-hub/opportunity-finder',
    category: 'opportunity-hub',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Opportunity Finder',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'market-gap-scanner': {
    title: 'Market Gap Scanner - AI Unmet Need Detector | HYNTRIX AI',
    description: 'Reveal unmet customer needs and market gaps you can own. Get AI-powered analysis of underserved segments and emerging demands.',
    keywords: ['market gap', 'unmet needs', 'market analysis', 'customer needs', 'ai market research'],
    path: '/opportunity-hub/market-gap-scanner',
    category: 'opportunity-hub',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Market Gap Scanner',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'trend-detector': {
    title: 'Trend Detector - AI Trend Analysis Tool | HYNTRIX AI',
    description: 'Identify rising trends before they peak. Get AI-powered early signals of emerging trends in your industry to capitalize on market shifts.',
    keywords: ['trend detector', 'trend analysis', 'emerging trends', 'market trends', 'ai trend detection'],
    path: '/opportunity-hub/trend-detector',
    category: 'opportunity-hub',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Trend Detector',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'niche-discovery': {
    title: 'Niche Discovery - AI Profitable Niche Finder | HYNTRIX AI',
    description: 'Find profitable micro-niches with low competition and high demand. Get AI-powered niche discovery based on your skills and interests.',
    keywords: ['niche discovery', 'profitable niches', 'micro niche', 'niche market', 'ai niche finder'],
    path: '/opportunity-hub/niche-discovery',
    category: 'opportunity-hub',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Niche Discovery',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'opportunity-radar': {
    title: 'Opportunity Radar - AI Multi-Market Scanner | HYNTRIX AI',
    description: 'Scan multiple opportunity signals across markets simultaneously. Get AI-powered comprehensive opportunity intelligence.',
    keywords: ['opportunity radar', 'market scanning', 'opportunity intelligence', 'multi market analysis', 'ai opportunity scan'],
    path: '/opportunity-hub/opportunity-radar',
    category: 'opportunity-hub',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Opportunity Radar',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'side-hustle-finder': {
    title: 'Side Hustle Finder - AI Micro-Startup Generator | HYNTRIX AI',
    description: 'Generate premium micro-startup concepts for quick revenue. Get AI-powered side hustle ideas tailored to your skills and available time.',
    keywords: ['side hustle', 'micro startup', 'side business', 'passive income', 'ai side hustle ideas'],
    path: '/opportunity-hub/side-hustle-finder',
    category: 'opportunity-hub',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Side Hustle Finder',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'income-roadmap': {
    title: 'Income Roadmap - AI Revenue Modeling Tool | HYNTRIX AI',
    description: 'Model recurring income streams and profit pacing. Get AI-powered financial roadmap for your startup or side business.',
    keywords: ['income roadmap', 'revenue modeling', 'income streams', 'profit planning', 'ai financial planning'],
    path: '/opportunity-hub/income-roadmap',
    category: 'opportunity-hub',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Income Roadmap',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'instagram-analyzer': {
    title: 'Instagram Analyzer - AI Instagram Growth Tool | HYNTRIX AI',
    description: 'Analyze your Instagram profile for growth, content quality, and engagement. Get AI-powered insights to grow your Instagram presence.',
    keywords: ['instagram analyzer', 'instagram growth', 'instagram analysis', 'social media analysis', 'ai instagram tool'],
    path: '/social-intelligence/instagram-analyzer',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Instagram Analyzer',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'youtube-analyzer': {
    title: 'YouTube Analyzer - AI YouTube Channel Audit | HYNTRIX AI',
    description: 'Analyze your YouTube channel for growth signals and monetization fit. Get AI-powered insights to optimize your content strategy.',
    keywords: ['youtube analyzer', 'youtube channel analysis', 'youtube growth', 'creator analytics', 'ai youtube tool'],
    path: '/social-intelligence/youtube-analyzer',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'YouTube Analyzer',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'linkedin-analyzer': {
    title: 'LinkedIn Analyzer - AI LinkedIn Profile Review | HYNTRIX AI',
    description: 'Analyze your LinkedIn profile for brand presence and authority. Get AI-powered insights to optimize your professional brand.',
    keywords: ['linkedin analyzer', 'linkedin profile review', 'linkedin optimization', 'professional branding', 'ai linkedin tool'],
    path: '/social-intelligence/linkedin-analyzer',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'LinkedIn Analyzer',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'telegram-analyzer': {
    title: 'Telegram Analyzer - AI Telegram Channel Analysis | HYNTRIX AI',
    description: 'Analyze Telegram channels for engagement, trust, and community health. Get AI-powered insights to grow your Telegram audience.',
    keywords: ['telegram analyzer', 'telegram channel analysis', 'telegram growth', 'community analysis', 'ai telegram tool'],
    path: '/social-intelligence/telegram-analyzer',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Telegram Analyzer',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'x-analyzer': {
    title: 'X Analyzer - AI Twitter Profile Analysis | HYNTRIX AI',
    description: 'Analyze your X (Twitter) profile for influence and content quality. Get AI-powered insights to grow your presence on X.',
    keywords: ['x analyzer', 'twitter analysis', 'x profile analysis', 'social media influence', 'ai twitter tool'],
    path: '/social-intelligence/x-analyzer',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'X Analyzer',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'instagram-judge': {
    title: 'Instagram Judge - AI Instagram Deep Audit | HYNTRIX AI',
    description: 'Get a deep audit of your Instagram brand and content strategy. AI-powered comprehensive analysis of your Instagram presence.',
    keywords: ['instagram judge', 'instagram audit', 'instagram brand analysis', 'content strategy', 'ai instagram audit'],
    path: '/social-intelligence/instagram-judge',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Instagram Judge',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'youtube-judge': {
    title: 'YouTube Judge - AI YouTube Channel Audit | HYNTRIX AI',
    description: 'Full channel audit for growth and monetization readiness. Get AI-powered deep analysis of your YouTube channel performance.',
    keywords: ['youtube judge', 'youtube channel audit', 'youtube monetization', 'creator audit', 'ai youtube audit'],
    path: '/social-intelligence/youtube-judge',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'YouTube Judge',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'linkedin-judge': {
    title: 'LinkedIn Judge - AI Professional Brand Assessment | HYNTRIX AI',
    description: 'Professional brand and authority assessment for LinkedIn. Get AI-powered deep audit of your LinkedIn presence and positioning.',
    keywords: ['linkedin judge', 'linkedin audit', 'professional brand', 'linkedin authority', 'ai linkedin audit'],
    path: '/social-intelligence/linkedin-judge',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'LinkedIn Judge',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'telegram-judge': {
    title: 'Telegram Judge - AI Community Health Analysis | HYNTRIX AI',
    description: 'Community health and engagement deep dive for Telegram. Get AI-powered analysis of your Telegram community and growth potential.',
    keywords: ['telegram judge', 'telegram community analysis', 'telegram audit', 'community health', 'ai telegram audit'],
    path: '/social-intelligence/telegram-judge',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Telegram Judge',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'x-judge': {
    title: 'X Judge - AI Influence & Content Scoring | HYNTRIX AI',
    description: 'Influence and content quality scoring for X (Twitter). Get AI-powered deep audit of your X presence and engagement strategy.',
    keywords: ['x judge', 'twitter audit', 'x influence score', 'content quality', 'ai twitter audit'],
    path: '/social-intelligence/x-judge',
    category: 'social-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'X Judge',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
    }
  },
  'ai-client-finder': {
    title: 'AI Client Finder - Find High-Value Clients | HYNTRIX AI',
    description: 'Find high-value clients using AI-powered business intelligence. Discover companies that need your services with actionable outreach suggestions.',
    keywords: ['client finder', 'lead generation', 'business development', 'client acquisition', 'ai client finder'],
    path: '/ai-client-finder',
    category: 'ai-client-finder',
    structuredData: {
      '@type': 'WebApplication',
      name: 'AI Client Finder',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'product-advisor': {
    title: 'Product Advisor - AI Product Feedback for Founders | HYNTRIX AI',
    description: 'Get fast AI-powered product feedback shaped for founders and launch teams. Validate your product strategy with expert AI insights.',
    keywords: ['product advisor', 'product feedback', 'product strategy', 'founder advice', 'ai product consultant'],
    path: '/board-room/product-advisor',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Product Advisor',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'growth-advisor': {
    title: 'Growth Advisor - AI Growth Strategy Consultant | HYNTRIX AI',
    description: 'Get AI-powered growth guidance for traction, funnels, and brand velocity. Accelerate your startup growth with expert insights.',
    keywords: ['growth advisor', 'growth strategy', 'startup growth', 'marketing strategy', 'ai growth consultant'],
    path: '/board-room/growth-advisor',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Growth Advisor',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'finance-advisor': {
    title: 'Finance Advisor - AI Financial Planning for Startups | HYNTRIX AI',
    description: 'Get AI-powered advice on capital, pricing, and runway for founder-led businesses. Make smarter financial decisions with expert AI insights.',
    keywords: ['finance advisor', 'startup finance', 'pricing strategy', 'runway planning', 'ai financial advisor'],
    path: '/board-room/finance-advisor',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Finance Advisor',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
  'legal-advisor': {
    title: 'Legal Advisor - AI Compliance & Structure Advisor | HYNTRIX AI',
    description: 'Get AI-powered recommendations on compliance and business structure for startups. Navigate legal complexity with expert AI guidance.',
    keywords: ['legal advisor', 'startup legal', 'business compliance', 'company structure', 'ai legal advisor'],
    path: '/board-room/legal-advisor',
    category: 'startup-intelligence',
    structuredData: {
      '@type': 'WebApplication',
      name: 'Legal Advisor',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }
  },
}

// ============================================
// SEO LANDING PAGES
// Extra SEO-friendly landing pages for programmatic SEO
// ============================================

export const SEO_LANDING_PAGES = [
  {
    slug: 'startup-idea-validator',
    title: 'Startup Idea Validator - Is Your Idea Worth Building? | HYNTRIX AI',
    description: 'Validate your startup idea with AI-powered analysis. Get instant feedback on market demand, competition, and execution feasibility before building.',
    keywords: ['startup idea validator', 'idea validation', 'business idea validation', 'startup validation tool', 'validate startup idea'],
    h1: 'Startup Idea Validator',
    heroText: 'Is your startup idea worth building? Find out in seconds.',
  },
  {
    slug: 'ai-startup-analyzer',
    title: 'AI Startup Analyzer - Free AI Business Analysis | HYNTRIX AI',
    description: 'Get a comprehensive AI-powered analysis of your startup. Covering market fit, competition, revenue model, and growth potential in seconds.',
    keywords: ['ai startup analyzer', 'business analysis ai', 'startup analysis tool', 'free startup analysis', 'ai business consultant'],
    h1: 'AI Startup Analyzer',
    heroText: 'Analyze your startup with the power of AI.',
  },
  {
    slug: 'founder-personality-test',
    title: 'Founder Personality Test - Discover Your Entrepreneur Type | HYNTRIX AI',
    description: 'Take the AI-powered founder personality test. Discover your entrepreneurial archetype, strengths, and blind spots as a founder.',
    keywords: ['founder personality test', 'entrepreneur personality', 'founder archetype', 'business personality test', 'startup founder test'],
    h1: 'Founder Personality Test',
    heroText: 'What type of founder are you? Discover your entrepreneurial DNA.',
  },
  {
    slug: 'youtube-growth-analyzer',
    title: 'YouTube Growth Analyzer - Free Channel Audit | HYNTRIX AI',
    description: 'Analyze your YouTube channel growth with AI. Get insights on content strategy, audience engagement, and monetization potential.',
    keywords: ['youtube growth analyzer', 'youtube channel audit', 'youtube analytics', 'creator growth tool', 'free youtube analysis'],
    h1: 'YouTube Growth Analyzer',
    heroText: 'Unlock your YouTube growth potential with AI insights.',
  },
  {
    slug: 'instagram-growth-analyzer',
    title: 'Instagram Growth Analyzer - Free AI Profile Audit | HYNTRIX AI',
    description: 'Analyze your Instagram growth with AI. Get actionable insights on content, engagement, and brand positioning to grow your following.',
    keywords: ['instagram growth analyzer', 'instagram audit', 'instagram analytics', 'social media growth', 'free instagram analysis'],
    h1: 'Instagram Growth Analyzer',
    heroText: 'Supercharge your Instagram growth with AI analysis.',
  },
  {
    slug: 'linkedin-profile-review',
    title: 'LinkedIn Profile Review - Free AI Analysis | HYNTRIX AI',
    description: 'Get a free AI-powered LinkedIn profile review. Optimize your professional brand, headline, experience, and content strategy.',
    keywords: ['linkedin profile review', 'linkedin optimization', 'linkedin profile analysis', 'professional branding', 'free linkedin review'],
    h1: 'LinkedIn Profile Review',
    heroText: 'Optimize your LinkedIn profile with AI-powered insights.',
  },
  {
    slug: 'telegram-channel-analyzer',
    title: 'Telegram Channel Analyzer - Free AI Community Audit | HYNTRIX AI',
    description: 'Analyze your Telegram channel with AI. Measure engagement, community health, and growth potential for your Telegram audience.',
    keywords: ['telegram channel analyzer', 'telegram analytics', 'telegram community analysis', 'channel audit', 'free telegram analysis'],
    h1: 'Telegram Channel Analyzer',
    heroText: 'Analyze and grow your Telegram community with AI.',
  },
  {
    slug: 'x-profile-analyzer',
    title: 'X Profile Analyzer - Free AI Twitter Analysis | HYNTRIX AI',
    description: 'Get a free AI-powered analysis of your X (Twitter) profile. Measure influence, content quality, and engagement potential.',
    keywords: ['x profile analyzer', 'twitter analysis', 'x analytics', 'social media influence', 'free twitter analysis'],
    h1: 'X Profile Analyzer',
    heroText: 'Analyze your X presence with AI-powered intelligence.',
  },
  {
    slug: 'business-competitor-analysis',
    title: 'Business Competitor Analysis - Free AI Competitive Research | HYNTRIX AI',
    description: 'Get AI-powered competitive analysis for your business. Benchmark against competitors, identify gaps, and find your competitive advantage.',
    keywords: ['competitor analysis', 'competitive research', 'business benchmarking', 'competition analysis', 'ai competitor research'],
    h1: 'Business Competitor Analysis',
    heroText: 'Outsmart your competition with AI intelligence.',
  },
  {
    slug: 'market-analysis-tool',
    title: 'Market Analysis Tool - Free AI Market Research | HYNTRIX AI',
    description: 'Get comprehensive market analysis with AI. Understand market size, trends, competition, and opportunities for your business idea.',
    keywords: ['market analysis', 'market research tool', 'market intelligence', 'business analysis', 'ai market research'],
    h1: 'Market Analysis Tool',
    heroText: 'Make data-driven decisions with AI market intelligence.',
  },
  {
    slug: 'side-hustle-ideas',
    title: 'Side Hustle Ideas - AI-Powered Business Generator | HYNTRIX AI',
    description: 'Generate profitable side hustle ideas tailored to your skills. Get AI-powered micro-startup concepts that match your time and expertise.',
    keywords: ['side hustle ideas', 'side business ideas', 'passive income ideas', 'micro business', 'ai side hustle generator'],
    h1: 'AI Side Hustle Ideas',
    heroText: 'Discover profitable side hustles tailored to you.',
  },
  {
    slug: 'startup-pitch-analyzer',
    title: 'Startup Pitch Analyzer - Free AI Pitch Deck Review | HYNTRIX AI',
    description: 'Analyze and improve your startup pitch with AI. Get feedback on your value proposition, market opportunity, and investor appeal.',
    keywords: ['startup pitch analyzer', 'pitch deck review', 'investor pitch', 'startup pitching', 'ai pitch analysis'],
    h1: 'Startup Pitch Analyzer',
    heroText: 'Perfect your pitch with AI-powered feedback.',
  },
  {
    slug: 'business-idea-generator',
    title: 'Business Idea Generator - AI Startup Concept Creator | HYNTRIX AI',
    description: 'Generate innovative business ideas with AI. Get startup concepts based on market trends, your skills, and emerging opportunities.',
    keywords: ['business idea generator', 'startup idea generator', 'business concept', 'entrepreneur ideas', 'ai idea generator'],
    h1: 'Business Idea Generator',
    heroText: 'Generate winning business ideas with AI.',
  },
  {
    slug: 'revenue-model-analyzer',
    title: 'Revenue Model Analyzer - Free AI Monetization Review | HYNTRIX AI',
    description: 'Analyze your revenue model with AI. Get insights on pricing strategy, monetization channels, and revenue optimization for your business.',
    keywords: ['revenue model analyzer', 'monetization analysis', 'pricing strategy', 'revenue optimization', 'ai revenue analysis'],
    h1: 'Revenue Model Analyzer',
    heroText: 'Optimize your revenue model with AI intelligence.',
  },
]