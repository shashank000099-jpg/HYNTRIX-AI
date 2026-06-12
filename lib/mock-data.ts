// ============================================
// MOCK DATA FOR PHASE 1 - NO API INTEGRATION
// ============================================

export const mockUser = {
  id: 'mock-user-001',
  email: 'founder@hyntrix.ai',
  name: 'Alex Taylor',
  avatar_url: null,
  age: 28,
  skills: ['Product', 'Marketing', 'Sales'],
  budget: '₹5L - ₹10L',
  goal: 'Build a SaaS product',
  plan: 'pro' as const,
  credits: 680,
  xp: 8200,
  level: 12,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-06-11T10:00:00Z',
  is_admin: false
};

export const mockStartupReport = {
  overallScore: 82,
  verdict: 'Strong Potential — Proceed with Focused Execution',
  metrics: [
    { label: 'Market Demand', value: 86, color: 'from-blue-500 to-cyan-400' },
    { label: 'Competition', value: 72, color: 'from-purple-500 to-pink-400' },
    { label: 'Revenue Potential', value: 79, color: 'from-green-500 to-emerald-400' },
    { label: 'Risk Level', value: 61, color: 'from-orange-500 to-yellow-400' },
    { label: 'Team Readiness', value: 74, color: 'from-indigo-500 to-blue-400' },
    { label: 'Execution Speed', value: 88, color: 'from-teal-500 to-cyan-400' }
  ],
  strengths: [
    'Clear value proposition with strong differentiation',
    'Early traction signals from target segment',
    'Strong monetization path with recurring revenue model',
    'Founder has relevant domain expertise'
  ],
  weaknesses: [
    'Limited team bandwidth for rapid scaling',
    'High customer acquisition cost in current model',
    'Regulatory exposure in key markets',
    'No clear moat against well-funded competitors'
  ],
  opportunities: [
    'Premium segment expansion with enterprise tier',
    'Strategic partnerships with complementary tools',
    'Recurring service add-ons for existing customers',
    'International market entry in 12 months'
  ],
  threats: [
    'Market consolidation by larger players',
    'Copycat entrants with lower pricing',
    'Execution pacing risk with small team',
    'Economic downturn reducing discretionary spend'
  ],
  recommendations: [
    'Validate positioning with highest-value customer segment first',
    'Focus on repeatable acquisition with bottom-up conversion funnel',
    'Build lean minimum lovable product before expanding channels',
    'Establish 3 strategic partnerships in next 90 days'
  ],
  actionPlan: [
    'Week 1-2: Customer discovery interviews with 20 target users',
    'Week 3-4: Build and launch MVP landing page with waitlist',
    'Month 2: Soft launch to waitlist with feedback loop',
    'Month 3: Iterate based on data and prepare for paid acquisition'
  ]
};

export const mockFounderReport = {
  founderType: 'The Visionary Builder',
  score: 76,
  archetype: 'Product-Led Founder',
  metrics: [
    { label: 'Vision Clarity', value: 88 },
    { label: 'Execution Speed', value: 71 },
    { label: 'Resilience', value: 82 },
    { label: 'Leadership', value: 69 },
    { label: 'Market Awareness', value: 74 },
    { label: 'Financial Acumen', value: 58 }
  ],
  strengths: [
    'Exceptional product intuition and user empathy',
    'Strong ability to communicate vision to team',
    'High resilience under pressure and setbacks',
    'Natural ability to attract early believers'
  ],
  weaknesses: [
    'Tendency to over-engineer before validating',
    'Struggles with delegation and letting go',
    'Financial modeling and unit economics gaps',
    'Difficulty saying no to feature requests'
  ],
  recommendations: [
    'Hire a strong operator or COO to complement your vision',
    'Implement weekly financial review rituals',
    'Practice ruthless prioritization with a 3-item daily focus',
    'Build a personal board of advisors for accountability'
  ],
  actionPlan: [
    'Take the Founder Weakness Scanner to identify top 3 gaps',
    'Schedule weekly 1:1s with each team member',
    'Read "The Hard Thing About Hard Things" this month',
    'Join a founder peer group for accountability'
  ]
};

export const mockSocialReport = {
  platform: 'Instagram',
  handle: '@yourhandle',
  overallScore: 74,
  metrics: [
    { label: 'Growth Rate', value: 68 },
    { label: 'Engagement Rate', value: 82 },
    { label: 'Brand Consistency', value: 71 },
    { label: 'Content Quality', value: 79 },
    { label: 'Trust Score', value: 65 },
    { label: 'Monetization Readiness', value: 58 }
  ],
  strengths: [
    'Strong visual identity and consistent aesthetic',
    'High engagement rate above industry average',
    'Authentic storytelling that resonates with audience',
    'Good use of Reels for discovery and reach'
  ],
  weaknesses: [
    'Inconsistent posting schedule hurting algorithm reach',
    'Bio and CTA not optimized for conversions',
    'Limited use of Stories for community building',
    'No clear monetization funnel from profile'
  ],
  contentIdeas: [
    'Behind-the-scenes founder journey series',
    'Weekly "Lesson Learned" carousel posts',
    'Live Q&A sessions with your audience',
    'Collaboration posts with complementary creators',
    'User-generated content campaigns'
  ],
  suggestions: [
    'Post consistently at 6-8 PM IST for maximum reach',
    'Update bio with clear value proposition and link',
    'Use 5-7 targeted hashtags instead of 30 generic ones',
    'Respond to all comments within first hour of posting'
  ]
};

export const mockOpportunityReport = {
  overallScore: 79,
  opportunityTitle: 'AI-Powered B2B SaaS for SME Automation',
  marketSize: '₹2,400 Cr',
  growthRate: '34% YoY',
  competitionLevel: 'Medium',
  timeToMarket: '3-6 months',
  opportunities: [
    { title: 'Workflow Automation for SMEs', score: 88, description: 'High demand, low competition in Tier 2 cities' },
    { title: 'AI Customer Support Tools', score: 82, description: 'Growing need with WhatsApp Business integration' },
    { title: 'Inventory Management SaaS', score: 76, description: 'Underserved market with strong retention potential' },
    { title: 'HR & Payroll Automation', score: 71, description: 'Compliance-driven demand with recurring revenue' }
  ],
  recommendations: [
    'Focus on Tier 2 city SMEs as primary beachhead market',
    'Build WhatsApp-first product for maximum adoption',
    'Price at ₹999-2999/month for SME affordability',
    'Partner with CA firms and business consultants for distribution'
  ]
};

export const mockAdvisorFeedback = {
  'product-advisor': {
    name: 'Priya Sharma',
    role: 'Product Advisor',
    avatar: '👩‍💼',
    responses: [
      "Your product roadmap needs clearer prioritization. Focus on the one feature that drives 80% of value for your core user.",
      "The onboarding flow has too many steps. Users should experience the 'aha moment' within 60 seconds.",
      "Consider a freemium tier to reduce friction. Your conversion funnel will improve significantly.",
      "Build in public. Share your product journey — it creates trust and attracts early adopters organically."
    ]
  },
  'growth-advisor': {
    name: 'Rahul Mehta',
    role: 'Growth Advisor',
    avatar: '👨‍💻',
    responses: [
      "Your CAC is too high for the current LTV. Focus on organic channels — content, SEO, and community — before paid ads.",
      "Referral programs work exceptionally well in B2B SaaS. Give users a reason to share with their network.",
      "Your email sequences need more value before the ask. Educate first, sell second.",
      "Double down on what's already working. Find your one growth lever and optimize it relentlessly."
    ]
  },
  'finance-advisor': {
    name: 'Anita Patel',
    role: 'Finance Advisor',
    avatar: '👩‍🏫',
    responses: [
      "Your runway is 8 months at current burn. You need to either cut costs by 30% or accelerate revenue immediately.",
      "Consider revenue-based financing before equity dilution. It's cheaper and preserves your cap table.",
      "Your pricing is 40% below market. Raise prices — your best customers won't churn, and you'll attract better ones.",
      "Build a 13-week cash flow model. Know exactly when you'll run out of money and plan 3 months ahead."
    ]
  },
  'legal-advisor': {
    name: 'Vikram Singh',
    role: 'Legal Advisor',
    avatar: '👨‍⚖️',
    responses: [
      "Register your IP immediately. A provisional patent costs ₹15,000 and protects you for 12 months.",
      "Your terms of service don't cover data processing adequately. Update before you scale to enterprise clients.",
      "Structure as a Private Limited company now. It makes fundraising, hiring, and contracts significantly easier.",
      "Get a proper founder agreement with vesting schedules. 50/50 splits without vesting are a red flag for investors."
    ]
  }
};

export const mockSimulatorPersonas = {
  'customer-simulator': [
    { name: 'Budget Buyer', emoji: '💰', description: 'Price-sensitive, needs ROI justification' },
    { name: 'Power User', emoji: '⚡', description: 'Feature-focused, wants advanced capabilities' },
    { name: 'Skeptic', emoji: '🤔', description: 'Doubts claims, needs proof and references' },
    { name: 'Premium Buyer', emoji: '💎', description: 'Values quality and support over price' },
    { name: 'Enterprise Buyer', emoji: '🏢', description: 'Needs security, compliance, and SLAs' }
  ],
  'investor-simulator': [
    { name: 'Angel Investor', emoji: '😇', description: 'Early stage, values founder potential' },
    { name: 'VC Partner', emoji: '💼', description: 'Metrics-driven, wants 10x returns' },
    { name: 'Strategic Investor', emoji: '🎯', description: 'Industry player, wants synergies' },
    { name: 'Impact Investor', emoji: '🌱', description: 'Values social impact alongside returns' }
  ],
  'shark-tank-simulator': [
    { name: 'The Shark', emoji: '🦈', description: 'Aggressive, tests your conviction' },
    { name: 'The Mentor', emoji: '🧠', description: 'Supportive but asks hard questions' },
    { name: 'The Skeptic', emoji: '🔍', description: 'Challenges every assumption' },
    { name: 'The Deal Maker', emoji: '🤝', description: 'Interested but negotiates hard' }
  ],
  'co-founder-simulator': [
    { name: 'Technical Co-Founder', emoji: '👨‍💻', description: 'CTO profile, product-focused' },
    { name: 'Business Co-Founder', emoji: '📊', description: 'Sales and operations focused' },
    { name: 'Creative Co-Founder', emoji: '🎨', description: 'Design and brand focused' },
    { name: 'Finance Co-Founder', emoji: '💹', description: 'CFO profile, numbers-driven' }
  ]
};

export const mockXPData = {
  currentXP: 8200,
  nextLevelXP: 8380,
  level: 12,
  totalXPEarned: 8200,
  xpHistory: [
    { action: 'Completed Startup Judge analysis', xp: 50, date: '2 hours ago' },
    { action: 'Saved a report', xp: 10, date: '3 hours ago' },
    { action: 'Completed daily challenge', xp: 100, date: '1 day ago' },
    { action: 'Ran Founder DNA analysis', xp: 50, date: '2 days ago' },
    { action: 'Shared a report', xp: 25, date: '3 days ago' },
    { action: 'Completed 7-day streak', xp: 200, date: '5 days ago' }
  ]
};

export const mockLevels = [
  { level: 1, title: 'Idea Seeker', xpRequired: 0, unlocks: ['Startup Judge', 'Founder DNA'], color: 'from-gray-500 to-gray-400' },
  { level: 2, title: 'Concept Builder', xpRequired: 200, unlocks: ['Startup Roast', 'Opportunity Finder'], color: 'from-blue-500 to-blue-400' },
  { level: 3, title: 'Validator', xpRequired: 500, unlocks: ['Death Scanner', 'Market Gap Scanner'], color: 'from-cyan-500 to-cyan-400' },
  { level: 4, title: 'Launcher', xpRequired: 1000, unlocks: ['Competitor Scanner', 'Social Analyzers'], color: 'from-teal-500 to-teal-400' },
  { level: 5, title: 'Traction Builder', xpRequired: 2000, unlocks: ['Success Predictor', 'Customer Simulator'], color: 'from-green-500 to-green-400' },
  { level: 6, title: 'Growth Hacker', xpRequired: 3500, unlocks: ['Board Room', 'Investor Simulator'], color: 'from-lime-500 to-lime-400' },
  { level: 7, title: 'Scale Operator', xpRequired: 5000, unlocks: ['Shark Tank Simulator', 'All Features'], color: 'from-yellow-500 to-yellow-400' },
  { level: 8, title: 'Market Leader', xpRequired: 7000, unlocks: ['Priority Support', 'Custom Reports'], color: 'from-orange-500 to-orange-400' },
  { level: 9, title: 'Category Creator', xpRequired: 9500, unlocks: ['API Access', 'White Label'], color: 'from-red-500 to-red-400' },
  { level: 10, title: 'Unicorn Founder', xpRequired: 12500, unlocks: ['All Premium Features', 'Founder Badge'], color: 'from-purple-500 to-pink-400' },
  { level: 11, title: 'Industry Titan', xpRequired: 16000, unlocks: ['Exclusive Masterclasses', 'Investor Intros'], color: 'from-violet-500 to-purple-400' },
  { level: 12, title: 'Legend', xpRequired: 20000, unlocks: ['Hall of Fame', 'Lifetime Access'], color: 'from-indigo-500 to-violet-400' }
];

export const mockAchievements = [
  { id: 'first-report', title: 'First Report', description: 'Generated your first AI report', icon: '📊', earned: true, earnedDate: '2024-01-20', xpReward: 50 },
  { id: 'startup-judge', title: 'Startup Judge', description: 'Completed 5 Startup Judge analyses', icon: '⚖️', earned: true, earnedDate: '2024-02-10', xpReward: 100 },
  { id: 'social-analyst', title: 'Social Analyst', description: 'Analyzed 3 social media profiles', icon: '📱', earned: true, earnedDate: '2024-03-05', xpReward: 75 },
  { id: 'board-member', title: 'Board Member', description: 'Consulted all 4 board advisors', icon: '💼', earned: true, earnedDate: '2024-03-20', xpReward: 150 },
  { id: 'streak-7', title: '7-Day Streak', description: 'Used Hyntrix AI 7 days in a row', icon: '🔥', earned: true, earnedDate: '2024-04-01', xpReward: 200 },
  { id: 'report-saver', title: 'Report Saver', description: 'Saved 10 reports to your library', icon: '💾', earned: true, earnedDate: '2024-04-15', xpReward: 100 },
  { id: 'simulator-pro', title: 'Simulator Pro', description: 'Completed 10 simulator sessions', icon: '🎭', earned: false, xpReward: 200 },
  { id: 'streak-30', title: '30-Day Streak', description: 'Used Hyntrix AI 30 days in a row', icon: '⚡', earned: false, xpReward: 500 },
  { id: 'opportunity-hunter', title: 'Opportunity Hunter', description: 'Found 5 market opportunities', icon: '🎯', earned: false, xpReward: 150 },
  { id: 'shark-survivor', title: 'Shark Survivor', description: 'Survived a full Shark Tank simulation', icon: '🦈', earned: false, xpReward: 300 },
  { id: 'founder-complete', title: 'Complete Founder', description: 'Completed all Founder Intelligence tools', icon: '🧬', earned: false, xpReward: 400 },
  { id: 'legend', title: 'Legend', description: 'Reached Level 12', icon: '👑', earned: false, xpReward: 1000 }
];

export const mockChallenges = {
  daily: [
    { id: 'd1', title: 'Run a Startup Analysis', description: 'Use any Startup Intelligence tool today', xpReward: 50, completed: false, timeLeft: '14h 32m' },
    { id: 'd2', title: 'Check Your Social Score', description: 'Analyze one social media profile', xpReward: 30, completed: true, timeLeft: '14h 32m' },
    { id: 'd3', title: 'Consult an Advisor', description: 'Get advice from any Board Room advisor', xpReward: 40, completed: false, timeLeft: '14h 32m' }
  ],
  weekly: [
    { id: 'w1', title: 'Complete 5 Analyses', description: 'Run 5 different AI analyses this week', xpReward: 200, progress: 3, total: 5, completed: false, timeLeft: '4 days' },
    { id: 'w2', title: 'Save 3 Reports', description: 'Save 3 reports to your library', xpReward: 100, progress: 1, total: 3, completed: false, timeLeft: '4 days' },
    { id: 'w3', title: 'Run a Simulator', description: 'Complete one full simulator session', xpReward: 150, progress: 0, total: 1, completed: false, timeLeft: '4 days' }
  ],
  special: [
    { id: 's1', title: 'Founder Week', description: 'Complete all Founder Intelligence tools', xpReward: 500, progress: 2, total: 7, completed: false, timeLeft: '12 days' },
    { id: 's2', title: 'Social Media Blitz', description: 'Analyze all 5 social platforms', xpReward: 400, progress: 1, total: 5, completed: false, timeLeft: '12 days' }
  ]
};

export const mockHistoryReports = [
  { id: '1', title: 'TechFlow SaaS — Startup Judge', subtitle: 'Comprehensive viability analysis for B2B workflow tool', badge: 'Startup Intelligence', score: 82, date: '2 hours ago', type: 'startup' },
  { id: '2', title: 'Founder DNA Analysis', subtitle: 'Leadership profile and core strengths assessment', badge: 'Founder Intelligence', score: 76, date: '1 day ago', type: 'founder' },
  { id: '3', title: 'Instagram Brand Audit', subtitle: 'Growth, engagement and monetization analysis', badge: 'Social Intelligence', score: 74, date: '3 days ago', type: 'social' },
  { id: '4', title: 'Market Gap Scanner — EdTech', subtitle: 'Unmet needs in online education market', badge: 'Opportunity Hub', score: 79, date: '5 days ago', type: 'opportunity' },
  { id: '5', title: 'Death Scanner — FinTech App', subtitle: 'Risk and fatal assumption analysis', badge: 'Startup Intelligence', score: 68, date: '1 week ago', type: 'startup' },
  { id: '6', title: 'YouTube Channel Audit', subtitle: 'Creator growth and monetization readiness', badge: 'Social Intelligence', score: 71, date: '1 week ago', type: 'social' },
  { id: '7', title: 'Competitor Scanner — HR SaaS', subtitle: 'Competitive landscape and differentiation analysis', badge: 'Startup Intelligence', score: 85, date: '2 weeks ago', type: 'startup' },
  { id: '8', title: 'Founder Weakness Scanner', subtitle: 'Blind spots and skill gap identification', badge: 'Founder Intelligence', score: 63, date: '2 weeks ago', type: 'founder' }
];

export const mockSavedReports = [
  { id: '1', title: 'TechFlow SaaS — Startup Judge', subtitle: 'Comprehensive viability analysis for B2B workflow tool', badge: 'Startup Intelligence', score: 82, savedDate: '2 hours ago', pages: 14 },
  { id: '2', title: 'Founder DNA Analysis', subtitle: 'Leadership profile and core strengths assessment', badge: 'Founder Intelligence', score: 76, savedDate: '1 day ago', pages: 9 },
  { id: '3', title: 'Market Gap Scanner — EdTech', subtitle: 'Unmet needs in online education market', badge: 'Opportunity Hub', score: 79, savedDate: '5 days ago', pages: 11 },
  { id: '4', title: 'Instagram Brand Audit', subtitle: 'Growth, engagement and monetization analysis', badge: 'Social Intelligence', score: 74, savedDate: '1 week ago', pages: 8 }
];
