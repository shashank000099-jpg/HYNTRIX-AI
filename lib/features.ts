import type { FeatureDefinition } from './types'

export const startupFeatures: FeatureDefinition[] = [
  { key: 'startup-judge', title: 'Startup Judge', description: 'Analyze new business ideas for viability, market fit and execution risk.', category: 'startup', inputLabel: 'Describe your startup concept' },
  { key: 'startup-roast', title: 'Startup Roast', description: 'Get a sharp critique to sharpen your pitch and reveal hidden weaknesses.', category: 'startup', inputLabel: 'Share your startup summary' },
  { key: 'death-scanner', title: 'Death Scanner', description: 'Scan risky assumptions and fatal traps before you launch.', category: 'startup', inputLabel: 'Enter your business model and team details' },
  { key: 'competitor-scanner', title: 'Competitor Scanner', description: 'Benchmark your idea against existing players and categories.', category: 'startup', inputLabel: 'Enter competitors and differentiation points' },
  { key: 'success-predictor', title: 'Success Predictor', description: 'Project your launch potential with a data-informed readiness score.', category: 'startup', inputLabel: 'Describe your launch plan and metrics' },
  { key: 'business-model-analyzer', title: 'Business Model Analyzer', description: 'Review pricing, margins and recurring revenue signals.', category: 'startup', inputLabel: 'Describe your business model' },
  { key: 'moat-analyzer', title: 'Moat Analyzer', description: 'Evaluate defensibility and long-term barriers to entry.', category: 'startup', inputLabel: 'Describe your competitive advantage' }
]

export const founderFeatures: FeatureDefinition[] = [
  { key: 'founder-dna', title: 'Founder DNA', description: 'Discover your leadership profile and core strengths.', category: 'founder', inputLabel: 'Describe your founder background' },
  { key: 'founder-score', title: 'Founder Score', description: 'Get a comprehensive score across execution, vision and resilience.', category: 'founder', inputLabel: 'Describe your startup journey so far' },
  { key: 'founder-weakness-scanner', title: 'Founder Weakness Scanner', description: 'Identify blind spots and gaps in your founder skill set.', category: 'founder', inputLabel: 'Describe your current challenges and struggles' },
  { key: 'leadership-analyzer', title: 'Leadership Analyzer', description: 'Evaluate your leadership style and team management approach.', category: 'founder', inputLabel: 'Describe your team and leadership style' },
  { key: 'founder-readiness', title: 'Founder Readiness', description: 'Measure your operational readiness and launch confidence.', category: 'founder', inputLabel: 'Describe your current progress and team' },
  { key: 'founder-gps', title: 'Founder GPS', description: 'Get a strategic map for your next 90-day priorities.', category: 'founder', inputLabel: 'Describe your current goals and obstacles' },
  { key: 'founder-roadmap', title: 'Founder Roadmap', description: 'Build a milestone-driven plan from idea to scale.', category: 'founder', inputLabel: 'Outline your project timeline and resources' }
]

export const opportunityFeatures: FeatureDefinition[] = [
  { key: 'opportunity-finder', title: 'Opportunity Finder', description: 'Spot emerging gaps and high-value market windows.', category: 'opportunity', inputLabel: 'Describe your target audience and trends' },
  { key: 'market-gap-scanner', title: 'Market Gap Scanner', description: 'Reveal unmet customer needs that you can own.', category: 'opportunity', inputLabel: 'Enter the category you want to target' },
  { key: 'trend-detector', title: 'Trend Detector', description: 'Identify rising trends before they peak and capitalize early.', category: 'opportunity', inputLabel: 'Describe your industry or niche' },
  { key: 'niche-discovery', title: 'Niche Discovery', description: 'Find profitable micro-niches with low competition and high demand.', category: 'opportunity', inputLabel: 'Describe your skills and interests' },
  { key: 'opportunity-radar', title: 'Opportunity Radar', description: 'Scan multiple opportunity signals across markets simultaneously.', category: 'opportunity', inputLabel: 'Describe your target audience and trends' },
  { key: 'side-hustle-finder', title: 'Side Hustle Finder', description: 'Generate premium micro-startup concepts for quick revenue.', category: 'opportunity', inputLabel: 'Describe your skills and available time' },
  { key: 'income-roadmap', title: 'Income Roadmap', description: 'Model recurring income streams and profit pacing.', category: 'opportunity', inputLabel: 'Describe your financial goals and runway' }
]

export const socialFeatures: FeatureDefinition[] = [
  { key: 'instagram-analyzer', title: 'Instagram Analyzer', description: 'Evaluate your profile for growth, content and trust signals.', category: 'social', inputLabel: 'Enter an Instagram handle or URL', platform: 'instagram' },
  { key: 'youtube-analyzer', title: 'YouTube Analyzer', description: 'Review growth signals and monetization fit for creators.', category: 'social', inputLabel: 'Enter a YouTube channel URL or handle', platform: 'youtube' },
  { key: 'x-analyzer', title: 'X Analyzer', description: 'Score your content and influence on X with precision.', category: 'social', inputLabel: 'Enter an X profile or URL', platform: 'x' },
  { key: 'telegram-analyzer', title: 'Telegram Analyzer', description: 'Analyze engagement, trust and community health.', category: 'social', inputLabel: 'Enter a Telegram channel or group link', platform: 'telegram' },
  { key: 'facebook-analyzer', title: 'Facebook Intelligence', description: 'Evaluate Facebook pages for audience quality, engagement and growth.', category: 'social', inputLabel: 'Enter a Facebook page URL or name', platform: 'facebook' },
  { key: 'instagram-judge', title: 'Instagram Judge', description: 'Deep audit of your Instagram brand and content strategy.', category: 'social', inputLabel: 'Enter an Instagram handle or URL', platform: 'instagram' },
  { key: 'youtube-judge', title: 'YouTube Judge', description: 'Full channel audit for growth and monetization readiness.', category: 'social', inputLabel: 'Enter a YouTube channel URL or handle', platform: 'youtube' },
  { key: 'telegram-judge', title: 'Telegram Judge', description: 'Community health and engagement deep dive.', category: 'social', inputLabel: 'Enter a Telegram channel or group link', platform: 'telegram' },
  { key: 'x-judge', title: 'X Judge', description: 'Influence and content quality scoring for X.', category: 'social', inputLabel: 'Enter an X profile or URL', platform: 'x' },
  { key: 'facebook-judge', title: 'Facebook Judge', description: 'Deep audit of Facebook brand presence, content strategy and monetization.', category: 'social', inputLabel: 'Enter a Facebook page URL or name', platform: 'facebook' },
  // LinkedIn features - kept for future
  { key: 'linkedin-analyzer', title: 'LinkedIn Intelligence', description: 'Measure brand presence, positioning and authority. Coming soon.', category: 'social', inputLabel: 'Enter a LinkedIn profile or company page', platform: 'linkedin' },
  { key: 'linkedin-judge', title: 'LinkedIn Judge', description: 'Professional brand and authority assessment. Coming soon.', category: 'social', inputLabel: 'Enter a LinkedIn profile or company page', platform: 'linkedin' },
]

export const clientFinderFeatures: FeatureDefinition[] = [
  { key: 'ai-client-finder', title: 'AI Client Finder', description: 'Find high-value clients using AI-powered business intelligence.', category: 'client-finder', inputLabel: 'Describe your ideal client profile' },
]

export const boardAdvisors = [
  { key: 'product-advisor', title: 'Product Advisor', description: 'Fast product feedback shaped for founders and launch teams.' },
  { key: 'growth-advisor', title: 'Growth Advisor', description: 'Growth guidance for traction, funnels and brand velocity.' },
  { key: 'finance-advisor', title: 'Finance Advisor', description: 'Capital, pricing and runway advice for founder-led businesses.' },
  { key: 'legal-advisor', title: 'Legal Advisor', description: 'Smart compliance & structure recommendations for startups.' }
]

export const founderHubSections = [
  { key: 'xp', title: 'XP & Points', description: 'Track your experience points and progress toward the next level.', icon: '⚡' },
  { key: 'levels', title: 'Levels', description: 'See your current level and what unlocks at each milestone.', icon: '🏆' },
  { key: 'achievements', title: 'Achievements', description: 'View all earned badges and unlock new ones through actions.', icon: '🎖️' },
  { key: 'challenges', title: 'Challenges', description: 'Complete daily and weekly challenges to earn bonus XP.', icon: '🎯' }
]

export const landingFeatures = [
  'Startup Judge', 'Startup Roast', 'Death Scanner', 'Founder DNA', 'Opportunity Finder', 'Instagram Analyzer', 'YouTube Analyzer', 'Telegram Analyzer', 'LinkedIn Analyzer', 'X Analyzer', 'AI Client Finder', 'Market Gap Scanner', 'Niche Discovery', 'Trend Detector'
]