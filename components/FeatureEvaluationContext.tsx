import {
  Award,
  BarChart3,
  Crown,
  Eye,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { PERFORMANCE_TIERS } from '../lib/performance-tiers'

type EvaluationCategory = 'startup' | 'founder' | 'social'

interface FeatureEvaluationContextProps {
  category: EvaluationCategory
  featureKey: string
  featureTitle: string
}

const contextByCategory = {
  startup: {
    accent: 'blue',
    label: 'Startup Opportunity Program',
    evaluatedIntro:
      'This analysis measures whether the idea has real market pull, execution logic, monetization strength, and long-term defensibility.',
    criteria: [
      ['Market Demand', 'Problem urgency, audience size, and willingness to pay'],
      ['Competition', 'Existing alternatives, saturation, and differentiation'],
      ['Scalability', 'Ability to grow without proportional operational drag'],
      ['Monetization', 'Pricing, margins, repeatability, and revenue quality'],
      ['Execution Capability', 'Feasibility, founder readiness, and launch clarity'],
      ['Founder Potential', 'Evidence that the team can learn, adapt, and ship'],
      ['Growth Potential', 'Expansion paths, channels, and compounding advantages'],
      ['Sustainability', 'Moat, retention, and long-term resilience'],
    ],
    why: [
      ['Investor-Level Scrutiny', 'Strong claims are tested against evidence, execution risk, and market reality.'],
      ['Opportunity Discovery', 'Exceptional submissions may be reviewed for recognition, visibility, and future programs.'],
      ['Competitive Benchmarking', 'Scores are calibrated so outstanding ideas feel meaningfully different from average ones.'],
    ],
    highScore:
      'Exceptional startup submissions may be reviewed for visibility, recognition, Founder Spotlight, Startup Showcase, leaderboard ranking, product feedback, growth guidance, development assistance consideration, and future opportunity programs.',
    specialTitle: 'Startup Recognition System',
    specialDescription:
      'Exceptional startup ideas may qualify for manual review, Founder Spotlight, Startup Showcase, growth guidance, development assistance consideration, and future opportunity programs.',
  },
  founder: {
    accent: 'emerald',
    label: 'Founder Spotlight Program',
    evaluatedIntro:
      'This analysis measures founder potential across execution ability, leadership, judgment, resilience, and readiness to move from insight to action.',
    criteria: [
      ['Execution Ability', 'Ability to turn plans into shipped work'],
      ['Vision Clarity', 'Strength and coherence of the founder direction'],
      ['Resilience', 'Capacity to handle pressure, failure, and ambiguity'],
      ['Adaptability', 'Willingness to learn, pivot, and update assumptions'],
      ['Leadership', 'Ability to communicate, prioritize, and lead others'],
      ['Resourcefulness', 'Ability to create progress with limited resources'],
      ['Strategic Thinking', 'Quality of tradeoffs, sequencing, and market judgment'],
      ['Self-Awareness', 'Clarity about strengths, weaknesses, and blind spots'],
    ],
    why: [
      ['Founder Discovery', 'Exceptional founders may be identified for spotlight, recognition, and future programs.'],
      ['Capability Benchmarking', 'Scores reward evidence-backed execution potential, not confidence alone.'],
      ['Development Roadmap', 'The report highlights what to strengthen before larger opportunities are pursued.'],
    ],
    highScore:
      'Exceptional founder evaluations may become eligible for recognition, spotlight opportunities, rankings, community visibility, and future founder development programs.',
    specialTitle: 'Founder Spotlight System',
    specialDescription:
      'High-performing founders may be considered for Founder Spotlight, featured rankings, recognition status, community recognition, and future programs.',
  },
  social: {
    accent: 'purple',
    label: 'Creator & Influencer Opportunity Program',
    evaluatedIntro:
      'This analysis measures creator potential through content quality, authentic engagement, brand clarity, growth trajectory, and monetization readiness.',
    criteria: [
      ['Content Quality', 'Originality, consistency, clarity, and production strength'],
      ['Engagement Rate', 'Audience response quality beyond follower count'],
      ['Growth Trajectory', 'Momentum, channel signals, and repeatable growth loops'],
      ['Brand Consistency', 'Visual identity, voice, niche clarity, and positioning'],
      ['Monetization Readiness', 'Commercial fit, offer potential, and trust signals'],
      ['Niche Authority', 'Depth, credibility, and influence within the category'],
      ['Audience Quality', 'Authenticity, loyalty, and relevance of the audience'],
      ['Differentiation', 'How clearly the creator stands apart from similar accounts'],
    ],
    why: [
      ['Talent Discovery', 'Outstanding creators may be identified for recognition, rankings, and spotlight opportunities.'],
      ['Growth Clarity', 'The analysis separates vanity metrics from durable creator potential.'],
      ['Competitive Benchmarking', 'High scores reflect content strength, audience quality, and strategy, not follower count alone.'],
    ],
    highScore:
      'Outstanding creators may become eligible for Creator Spotlight, featured rankings, talent recognition, community exposure, Creator Showcase, future collaboration opportunities, future reward programs, and growth opportunities.',
    specialTitle: 'Top Creator Recognition',
    specialDescription:
      'Outstanding creators may become eligible for Creator Spotlight, featured rankings, recognition status, and future creator programs.',
  },
} satisfies Record<EvaluationCategory, {
  accent: string
  label: string
  evaluatedIntro: string
  criteria: string[][]
  why: string[][]
  highScore: string
  specialTitle: string
  specialDescription: string
}>

function getSpecialTitle(category: EvaluationCategory, featureKey: string) {
  if (category !== 'social') return contextByCategory[category].specialTitle
  if (featureKey.includes('youtube')) return 'Creator Potential Program'
  if (featureKey.includes('instagram')) return 'Top Creator Recognition'
  return contextByCategory.social.specialTitle
}

export default function FeatureEvaluationContext({
  category,
  featureKey,
  featureTitle,
}: FeatureEvaluationContextProps) {
  const context = contextByCategory[category]
  const accentClasses = {
    blue: {
      border: 'border-blue-500/20',
      bg: 'bg-blue-500/5',
      text: 'text-blue-400',
      gradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
    },
    emerald: {
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/5',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500/10 via-green-500/5 to-transparent',
    },
    purple: {
      border: 'border-purple-500/20',
      bg: 'bg-purple-500/5',
      text: 'text-purple-400',
      gradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    },
  }[context.accent as 'blue' | 'emerald' | 'purple']

  return (
    <div className="space-y-12">
      <section className={`rounded-3xl border ${accentClasses.border} bg-gradient-to-br ${accentClasses.gradient} p-6 md:p-8`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className={`inline-flex items-center gap-2 rounded-full border ${accentClasses.border} ${accentClasses.bg} px-3 py-1 text-xs font-semibold ${accentClasses.text}`}>
              <Sparkles className="h-3.5 w-3.5" />
              {context.label}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              {featureTitle} is a competitive evaluation
            </h2>
            <p className="text-sm leading-7 text-slate-300 md:text-base">
              Your submission is measured seriously. Strong evidence, original positioning, and execution quality improve the score; weak assumptions and unsupported claims reduce it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:min-w-[280px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <BarChart3 className={`mx-auto h-5 w-5 ${accentClasses.text}`} />
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Score</p>
              <p className="mt-1 text-lg font-bold text-white">0-100</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <Crown className={`mx-auto h-5 w-5 ${accentClasses.text}`} />
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Elite</p>
              <p className="mt-1 text-lg font-bold text-white">90+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <Target className={`h-5 w-5 ${accentClasses.text}`} />
          <h2 className="text-2xl font-bold tracking-tight text-white">What Is Being Evaluated?</h2>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-slate-400">{context.evaluatedIntro}</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {context.criteria.map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-2 text-xs leading-6 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Lightbulb className={`h-5 w-5 ${accentClasses.text}`} />
            <h2 className="text-2xl font-bold tracking-tight text-white">Why This Matters</h2>
          </div>
          <div className="space-y-3">
            {context.why.map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-xs leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Award className={`h-5 w-5 ${accentClasses.text}`} />
            <h2 className="text-2xl font-bold tracking-tight text-white">Performance Tiers</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.values(PERFORMANCE_TIERS).map((tier) => (
              <div key={tier.key} className={`rounded-2xl border p-4 ${tier.borderColor} ${tier.bgColor}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`text-sm font-bold ${tier.color}`}>{tier.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{tier.range[0]}-{tier.range[1]}</p>
                  </div>
                  <span className="text-xl">{tier.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`rounded-3xl border ${accentClasses.border} ${accentClasses.bg} p-6 md:p-8`}>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TrendingUp className={`h-5 w-5 ${accentClasses.text}`} />
              <h2 className="text-2xl font-bold tracking-tight text-white">What Happens If You Score Highly?</h2>
            </div>
            <p className="text-sm leading-7 text-slate-300">{context.highScore}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className={`mt-0.5 h-5 w-5 ${accentClasses.text}`} />
              <div>
                <p className="text-sm font-semibold text-white">{getSpecialTitle(category, featureKey)}</p>
                <p className="mt-2 text-xs leading-6 text-slate-400">{context.specialDescription}</p>
                <p className="mt-3 text-xs leading-6 text-slate-500">
                  This is not a guarantee of rewards, funding, investment, prizes, partnerships, or opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
        <div className="flex items-start gap-3">
          <Eye className="mt-0.5 h-4 w-4 text-slate-500" />
          <p className="text-xs leading-6 text-slate-500">
            HyntrixAI is a recognition and opportunity discovery ecosystem designed to identify exceptional founders, creators, startup ideas, and emerging talent. Users who perform exceptionally well may be reviewed, recognized, featured, become eligible for programs, qualify for consideration, or be considered for future initiatives.
          </p>
        </div>
      </section>
    </div>
  )
}
