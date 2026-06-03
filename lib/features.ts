import type { FeatureDefinition } from './types';

export const startupFeatures: FeatureDefinition[] = [
  { key: 'startup-judge', title: 'Startup Judge', description: 'Analyze new business ideas for viability, market fit and execution risk.', category: 'startup', inputLabel: 'Describe your startup concept' },
  { key: 'startup-roast', title: 'Startup Roast', description: 'Get a sharp critique to sharpen your pitch and reveal hidden weaknesses.', category: 'startup', inputLabel: 'Share your startup summary' },
  { key: 'death-scanner', title: 'Death Scanner', description: 'Scan risky assumptions and fatal traps before you launch.', category: 'startup', inputLabel: 'Enter your business model and team details' },
  { key: 'competitor-scanner', title: 'Competitor Scanner', description: 'Benchmark your idea against existing players and categories.', category: 'startup', inputLabel: 'Enter competitors and differentiation points' },
  { key: 'success-predictor', title: 'Success Predictor', description: 'Project your launch potential with a data-informed readiness score.', category: 'startup', inputLabel: 'Describe your launch plan and metrics' },
  { key: 'business-model-analyzer', title: 'Business Model Analyzer', description: 'Review pricing, margins and recurring revenue signals.', category: 'startup', inputLabel: 'Describe your business model' },
  { key: 'moat-analyzer', title: 'Moat Analyzer', description: 'Evaluate defensibility and long-term barriers to entry.', category: 'startup', inputLabel: 'Describe your competitive advantage' }
];

export const founderFeatures: FeatureDefinition[] = [
  { key: 'founder-dna', title: 'Founder DNA', description: 'Discover your leadership profile and core strengths.', category: 'founder', inputLabel: 'Describe your founder background' },
  { key: 'founder-readiness', title: 'Founder Readiness', description: 'Measure your operational readiness and launch confidence.', category: 'founder', inputLabel: 'Describe your current progress and team' },
  { key: 'founder-gps', title: 'Founder GPS', description: 'Get a strategic map for your next 90-day priorities.', category: 'founder', inputLabel: 'Describe your current goals and obstacles' },
  { key: 'founder-roadmap', title: 'Founder Roadmap', description: 'Build a milestone-driven plan from idea to scale.', category: 'founder', inputLabel: 'Outline your project timeline and resources' }
];

export const opportunityFeatures: FeatureDefinition[] = [
  { key: 'opportunity-radar', title: 'Opportunity Radar', description: 'Spot emerging gaps and high-value market windows.', category: 'opportunity', inputLabel: 'Describe your target audience and trends' },
  { key: 'side-hustle-finder', title: 'Side Hustle Finder', description: 'Generate premium micro-startup concepts for quick revenue.', category: 'opportunity', inputLabel: 'Describe your skills and available time' },
  { key: 'market-gap-finder', title: 'Market Gap Finder', description: 'Reveal unmet customer needs that you can own.', category: 'opportunity', inputLabel: 'Enter the category you want to target' },
  { key: 'income-roadmap', title: 'Income Roadmap', description: 'Model recurring income streams and profit pacing.', category: 'opportunity', inputLabel: 'Describe your financial goals and runway' }
];

export const socialFeatures: FeatureDefinition[] = [
  { key: 'instagram-judge', title: 'Instagram Judge', description: 'Evaluate your profile for growth, content and trust.', category: 'social', inputLabel: 'Enter an Instagram handle or URL' },
  { key: 'youtube-judge', title: 'YouTube Judge', description: 'Review growth signals and monetization fit for creators.', category: 'social', inputLabel: 'Enter a YouTube channel URL or handle' },
  { key: 'telegram-judge', title: 'Telegram Judge', description: 'Analyze engagement, trust and community health.', category: 'social', inputLabel: 'Enter a Telegram channel or group link' },
  { key: 'linkedin-judge', title: 'LinkedIn Judge', description: 'Measure brand presence, positioning and authority.', category: 'social', inputLabel: 'Enter a LinkedIn profile or company page' },
  { key: 'x-judge', title: 'X Judge', description: 'Score your content and influence on X with precision.', category: 'social', inputLabel: 'Enter an X profile or URL' }
];

export const simulatorFeatures: FeatureDefinition[] = [
  { key: 'customer-simulator', title: 'Customer Simulator', description: 'Simulate conversations with buyer personas and download the transcript.', category: 'simulator', inputLabel: 'Who do you want to talk to?' }
];

export const boardAdvisors = [
  { key: 'product-advisor', title: 'Product Advisor', description: 'Fast product feedback shaped for founders and launch teams.' },
  { key: 'growth-advisor', title: 'Growth Advisor', description: 'Growth guidance for traction, funnels and brand velocity.' },
  { key: 'finance-advisor', title: 'Finance Advisor', description: 'Capital, pricing and runway advice for founder-led businesses.' },
  { key: 'legal-advisor', title: 'Legal Advisor', description: 'Smart compliance & structure recommendations for startups.' }
];

export const landingFeatures = [
  'Startup Judge', 'Startup Roast', 'Death Scanner', 'Founder DNA', 'Opportunity Radar', 'Instagram Judge', 'YouTube Judge', 'Telegram Judge', 'LinkedIn Judge', 'X Judge', 'Customer Simulator', 'Shark Tank', 'AI Board Of Directors', 'Market Gap Finder', 'Side Hustle Finder', 'Business Name Judge', 'Domain Judge', 'App Idea Judge'
];
