// ============================================
// UNIVERSAL FEATURE REGISTRY
// ============================================
// All 31+ Hyntrix AI features registered in one place

import type { FeatureRegistryEntry, FeatureCategory } from '../ai/types'

const CATEGORIES: Record<string, FeatureCategory> = {
  startup: 'startup-intelligence',
  founder: 'founder-intelligence',
  opportunity: 'opportunity-hub',
  social: 'social-intelligence',
  board: 'board-room',
  clientFinder: 'ai-client-finder',
}

export const FEATURE_REGISTRY: FeatureRegistryEntry[] = [
  // ============================================
  // STARTUP INTELLIGENCE (7)
  // ============================================
  {
    key: 'startup-judge',
    title: 'Startup Judge',
    description: 'Analyze new business ideas for viability, market fit and execution risk.',
    category: CATEGORIES.startup,
    credits: 20,
    promptTemplateKey: 'startupJudge',
    inputLabel: 'Describe your startup concept',
  },
  {
    key: 'startup-roast',
    title: 'Startup Roast',
    description: 'Get a sharp critique to sharpen your pitch and reveal hidden weaknesses.',
    category: CATEGORIES.startup,
    credits: 20,
    promptTemplateKey: 'startupRoast',
    inputLabel: 'Share your startup summary',
  },
  {
    key: 'death-scanner',
    title: 'Death Scanner',
    description: 'Scan risky assumptions and fatal traps before you launch.',
    category: CATEGORIES.startup,
    credits: 20,
    promptTemplateKey: 'deathScanner',
    inputLabel: 'Enter your business model and team details',
  },
  {
    key: 'competitor-scanner',
    title: 'Competitor Scanner',
    description: 'Benchmark your idea against existing players and categories.',
    category: CATEGORIES.startup,
    credits: 20,
    promptTemplateKey: 'competitorScanner',
    inputLabel: 'Enter competitors and differentiation points',
  },
  {
    key: 'success-predictor',
    title: 'Success Predictor',
    description: 'Project your launch potential with a data-informed readiness score.',
    category: CATEGORIES.startup,
    credits: 20,
    promptTemplateKey: 'successPredictor',
    inputLabel: 'Describe your launch plan and metrics',
  },
  {
    key: 'business-model-analyzer',
    title: 'Business Model Analyzer',
    description: 'Review pricing, margins and recurring revenue signals.',
    category: CATEGORIES.startup,
    credits: 20,
    promptTemplateKey: 'businessModelAnalyzer',
    inputLabel: 'Describe your business model',
  },
  {
    key: 'moat-analyzer',
    title: 'Moat Analyzer',
    description: 'Evaluate defensibility and long-term barriers to entry.',
    category: CATEGORIES.startup,
    credits: 20,
    promptTemplateKey: 'moatAnalyzer',
    inputLabel: 'Describe your competitive advantage',
  },

  // ============================================
  // FOUNDER INTELLIGENCE (7)
  // ============================================
  {
    key: 'founder-dna',
    title: 'Founder DNA',
    description: 'Discover your leadership profile and core strengths.',
    category: CATEGORIES.founder,
    credits: 20,
    promptTemplateKey: 'founderDNA',
    inputLabel: 'Describe your founder background',
  },
  {
    key: 'founder-score',
    title: 'Founder Score',
    description: 'Get a comprehensive score across execution, vision and resilience.',
    category: CATEGORIES.founder,
    credits: 20,
    promptTemplateKey: 'founderScore',
    inputLabel: 'Describe your startup journey so far',
  },
  {
    key: 'founder-weakness-scanner',
    title: 'Founder Weakness Scanner',
    description: 'Identify blind spots and gaps in your founder skill set.',
    category: CATEGORIES.founder,
    credits: 20,
    promptTemplateKey: 'founderWeaknessScanner',
    inputLabel: 'Describe your current challenges and struggles',
  },
  {
    key: 'leadership-analyzer',
    title: 'Leadership Analyzer',
    description: 'Evaluate your leadership style and team management approach.',
    category: CATEGORIES.founder,
    credits: 20,
    promptTemplateKey: 'leadershipAnalyzer',
    inputLabel: 'Describe your team and leadership style',
  },
  {
    key: 'founder-readiness',
    title: 'Founder Readiness',
    description: 'Measure your operational readiness and launch confidence.',
    category: CATEGORIES.founder,
    credits: 20,
    promptTemplateKey: 'founderReadiness',
    inputLabel: 'Describe your current progress and team',
  },
  {
    key: 'founder-gps',
    title: 'Founder GPS',
    description: 'Get a strategic map for your next 90-day priorities.',
    category: CATEGORIES.founder,
    credits: 20,
    promptTemplateKey: 'founderGPS',
    inputLabel: 'Describe your current goals and obstacles',
  },
  {
    key: 'founder-roadmap',
    title: 'Founder Roadmap',
    description: 'Build a milestone-driven plan from idea to scale.',
    category: CATEGORIES.founder,
    credits: 20,
    promptTemplateKey: 'founderRoadmap',
    inputLabel: 'Outline your project timeline and resources',
  },

  // ============================================
  // OPPORTUNITY HUB (7)
  // ============================================
  {
    key: 'opportunity-finder',
    title: 'Opportunity Finder',
    description: 'Spot emerging gaps and high-value market windows.',
    category: CATEGORIES.opportunity,
    credits: 20,
    promptTemplateKey: 'opportunityFinder',
    inputLabel: 'Describe your target audience and trends',
  },
  {
    key: 'market-gap-scanner',
    title: 'Market Gap Scanner',
    description: 'Reveal unmet customer needs that you can own.',
    category: CATEGORIES.opportunity,
    credits: 20,
    promptTemplateKey: 'marketGapScanner',
    inputLabel: 'Enter the category you want to target',
  },
  {
    key: 'trend-detector',
    title: 'Trend Detector',
    description: 'Identify rising trends before they peak and capitalize early.',
    category: CATEGORIES.opportunity,
    credits: 20,
    promptTemplateKey: 'trendDetector',
    inputLabel: 'Describe your industry or niche',
  },
  {
    key: 'niche-discovery',
    title: 'Niche Discovery',
    description: 'Find profitable micro-niches with low competition and high demand.',
    category: CATEGORIES.opportunity,
    credits: 20,
    promptTemplateKey: 'nicheDiscovery',
    inputLabel: 'Describe your skills and interests',
  },
  {
    key: 'opportunity-radar',
    title: 'Opportunity Radar',
    description: 'Scan multiple opportunity signals across markets simultaneously.',
    category: CATEGORIES.opportunity,
    credits: 20,
    promptTemplateKey: 'opportunityRadar',
    inputLabel: 'Describe your target audience and trends',
  },
  {
    key: 'side-hustle-finder',
    title: 'Side Hustle Finder',
    description: 'Generate premium micro-startup concepts for quick revenue.',
    category: CATEGORIES.opportunity,
    credits: 20,
    promptTemplateKey: 'sideHustleFinder',
    inputLabel: 'Describe your skills and available time',
  },
  {
    key: 'income-roadmap',
    title: 'Income Roadmap',
    description: 'Model recurring income streams and profit pacing.',
    category: CATEGORIES.opportunity,
    credits: 20,
    promptTemplateKey: 'incomeRoadmap',
    inputLabel: 'Describe your financial goals and runway',
  },

  // ============================================
  // SOCIAL INTELLIGENCE (10)
  // ============================================
  {
    key: 'instagram-analyzer',
    title: 'Instagram Analyzer',
    description: 'Evaluate your profile for growth, content and trust signals.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'instagramAnalyzer',
    inputLabel: 'Enter an Instagram handle or URL',
    platform: 'instagram',
    requiresExternalData: true,
    externalDataSource: ['apify-instagram-scraper'],
  },
  {
    key: 'youtube-analyzer',
    title: 'YouTube Analyzer',
    description: 'Review growth signals and monetization fit for creators.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'youtubeAnalyzer',
    inputLabel: 'Enter a YouTube channel URL or handle',
    platform: 'youtube',
    requiresExternalData: true,
    externalDataSource: ['youtube-data-api-v3'],
  },
  {
    key: 'x-analyzer',
    title: 'X Analyzer',
    description: 'Score your content and influence on X with precision.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'xAnalyzer',
    inputLabel: 'Enter an X profile or URL',
    platform: 'x',
    requiresExternalData: true,
    externalDataSource: ['apify-twitter-scraper'],
  },
  {
    key: 'linkedin-analyzer',
    title: 'LinkedIn Analyzer',
    description: 'Measure brand presence, positioning and authority.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'linkedinAnalyzer',
    inputLabel: 'Enter a LinkedIn profile or company page',
    platform: 'linkedin',
    requiresExternalData: true,
    externalDataSource: ['bright-data-linkedin'],
  },
  {
    key: 'telegram-analyzer',
    title: 'Telegram Analyzer',
    description: 'Analyze engagement, trust and community health.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'telegramAnalyzer',
    inputLabel: 'Enter a Telegram channel or group link',
    platform: 'telegram',
    requiresExternalData: true,
    externalDataSource: ['apify-telegram-scraper'],
  },
  {
    key: 'instagram-judge',
    title: 'Instagram Judge',
    description: 'Deep audit of your Instagram brand and content strategy.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'instagramJudge',
    inputLabel: 'Enter an Instagram handle or URL',
    platform: 'instagram',
    requiresExternalData: true,
    externalDataSource: ['apify-instagram-scraper'],
  },
  {
    key: 'youtube-judge',
    title: 'YouTube Judge',
    description: 'Full channel audit for growth and monetization readiness.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'youtubeJudge',
    inputLabel: 'Enter a YouTube channel URL or handle',
    platform: 'youtube',
    requiresExternalData: true,
    externalDataSource: ['youtube-data-api-v3'],
  },
  {
    key: 'telegram-judge',
    title: 'Telegram Judge',
    description: 'Community health and engagement deep dive.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'telegramJudge',
    inputLabel: 'Enter a Telegram channel or group link',
    platform: 'telegram',
    requiresExternalData: true,
    externalDataSource: ['apify-telegram-scraper'],
  },
  {
    key: 'linkedin-judge',
    title: 'LinkedIn Judge',
    description: 'Professional brand and authority assessment.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'linkedinJudge',
    inputLabel: 'Enter a LinkedIn profile or company page',
    platform: 'linkedin',
    requiresExternalData: true,
    externalDataSource: ['bright-data-linkedin'],
  },
  {
    key: 'x-judge',
    title: 'X Judge',
    description: 'Influence and content quality scoring for X.',
    category: CATEGORIES.social,
    credits: 20,
    promptTemplateKey: 'xJudge',
    inputLabel: 'Enter an X profile or URL',
    platform: 'x',
    requiresExternalData: true,
    externalDataSource: ['apify-twitter-scraper'],
  },

  // ============================================
  // BOARD ROOM (4)
  // ============================================
  {
    key: 'product-advisor',
    title: 'Product Advisor',
    description: 'Fast product feedback shaped for founders and launch teams.',
    category: CATEGORIES.board,
    credits: 20,
    promptTemplateKey: 'productAdvisor',
    inputLabel: 'Describe your product or feature idea',
  },
  {
    key: 'growth-advisor',
    title: 'Growth Advisor',
    description: 'Growth guidance for traction, funnels and brand velocity.',
    category: CATEGORIES.board,
    credits: 20,
    promptTemplateKey: 'growthAdvisor',
    inputLabel: 'Describe your current growth challenges',
  },
  {
    key: 'finance-advisor',
    title: 'Finance Advisor',
    description: 'Capital, pricing and runway advice for founder-led businesses.',
    category: CATEGORIES.board,
    credits: 20,
    promptTemplateKey: 'financeAdvisor',
    inputLabel: 'Describe your financial situation and questions',
  },
  {
    key: 'legal-advisor',
    title: 'Legal Advisor',
    description: 'Smart compliance & structure recommendations for startups.',
    category: CATEGORIES.board,
    credits: 20,
    promptTemplateKey: 'legalAdvisor',
    inputLabel: 'Describe your legal or compliance questions',
  },

  // ============================================
  // AI CLIENT FINDER (1)
  // ============================================
  {
    key: 'ai-client-finder',
    title: 'AI Client Finder',
    description: 'Find high-value clients using AI-powered business intelligence.',
    category: CATEGORIES.clientFinder,
    credits: 20,
    promptTemplateKey: 'clientFinder',
    inputLabel: 'Describe your ideal client profile',
    requiresExternalData: true,
    externalDataSource: ['company-database-api', 'bright-data-linkedin'],
  },
]

/**
 * Get a feature by its key
 */
export function getFeatureByKey(key: string): FeatureRegistryEntry | undefined {
  return FEATURE_REGISTRY.find((f) => f.key === key)
}

/**
 * Get all features in a category
 */
export function getFeaturesByCategory(category: FeatureCategory): FeatureRegistryEntry[] {
  return FEATURE_REGISTRY.filter((f) => f.category === category)
}

/**
 * Get features that require external data (social scraping)
 */
export function getFeaturesRequiringExternalData(): FeatureRegistryEntry[] {
  return FEATURE_REGISTRY.filter((f) => f.requiresExternalData)
}

/**
 * Get credit cost for a feature
 */
export function getFeatureCredits(key: string): number {
  const feature = getFeatureByKey(key)
  return feature?.credits ?? 20
}