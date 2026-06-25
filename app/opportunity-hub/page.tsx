'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { opportunityFeatures } from '../../lib/features'
import { ArrowRight, Lightbulb, TrendingUp, Target, Award } from 'lucide-react'
import { PremiumBadge } from '../../components/ui/PremiumBadge'
import { PERFORMANCE_TIERS } from '../../lib/performance-tiers'

export default function OpportunityHubPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium tracking-wide">
            <Lightbulb className="w-3.5 h-3.5" />
            Opportunity Discovery Ecosystem
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Opportunity Hub
          </h1>
          <p className="max-w-3xl text-lg text-slate-300 leading-relaxed">
            Discover market gaps, emerging trends, and profitable opportunities. Every analysis evaluates your ability to identify and capitalize on high-potential opportunities.
          </p>
        </div>
      </motion.div>

      {/* What Is Being Evaluated? */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">What Is Being Evaluated?</h2>
          <p className="text-slate-400 max-w-2xl">
            Each opportunity analysis examines market dynamics, trends, and gaps to identify high-potential areas for innovation and growth.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Market Size', desc: 'Total addressable market and growth potential', icon: '📊' },
            { label: 'Growth Rate', desc: 'Market expansion trajectory and momentum', icon: '📈' },
            { label: 'Competition', desc: 'Competitive intensity and whitespace opportunities', icon: '⚔️' },
            { label: 'Entry Barriers', desc: 'Difficulty of entering and competing', icon: '🚧' },
            { label: 'Profit Potential', desc: 'Revenue and margin opportunities', icon: '💰' },
            { label: 'Timing', desc: 'Market readiness and trend alignment', icon: '⏰' },
            { label: 'Innovation Gap', desc: 'Unmet needs and underserved segments', icon: '💡' },
            { label: 'Scalability', desc: 'Potential for rapid scaling and expansion', icon: '🚀' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="text-sm font-semibold text-white">{item.label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Why This Matters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">Why This Matters</h2>
          <p className="text-slate-400 max-w-2xl">
            In a world of infinite opportunities, the ability to identify the right ones separates successful founders from the rest.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Opportunity Discovery', desc: 'Identify high-potential market gaps before they become obvious. Early movers capture the most value.', icon: '🔍' },
            { title: 'Market Intelligence', desc: 'Get data-driven insights on trends, competition, and timing. Make informed decisions with confidence.', icon: '📊' },
            { title: 'Competitive Edge', desc: 'Your opportunity identification skills are benchmarked. Exceptional analysis may get you noticed.', icon: '🏆' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Performance Tiers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">Performance Tiers</h2>
          <p className="text-slate-400 max-w-2xl">
            Opportunity analysis scores are strictly calibrated. Generic insights are penalized. Exceptional market intelligence is rare.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(PERFORMANCE_TIERS).map((tier) => (
            <div key={tier.key} className={`rounded-2xl border p-5 ${tier.borderColor} ${tier.bgColor}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tier.badge}</span>
                <h3 className={`text-lg font-bold ${tier.color}`}>{tier.label}</h3>
              </div>
              <p className="text-xs text-slate-300 mb-2">{tier.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* What Happens If You Score Highly? */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-yellow-600/5 to-transparent p-8 md:p-12 space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">What Happens If You Score Highly?</h2>
            <p className="text-slate-300 max-w-2xl leading-relaxed">
              Exceptional opportunity analyses may be reviewed for recognition, spotlight opportunities, and future programs. This is not a guarantee — it is an opportunity discovery ecosystem.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              'May be reviewed by the HyntrixAI Team',
              'May qualify for Opportunity Spotlight',
              'May be eligible for Market Recognition',
              'May receive Expert Feedback',
              'May access Strategic Guidance',
              'May be considered for Development Assistance',
              'May qualify for Future Collaboration Opportunities',
              'May be eligible for Future Reward Programs',
              'May receive Community Recognition',
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 mt-0.5">→</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tools Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">AI Tools</h2>
          <p className="text-slate-400">Choose a tool to discover opportunities. Each evaluation costs 20 credits.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {opportunityFeatures.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/opportunity-hub/${feature.key}` as any}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02]">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{feature.icon || '⚡'}</span>
                      <PremiumBadge score={75 + Math.floor(Math.random() * 20)} size="sm" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{feature.category || 'Tool'}</p>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">{feature.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-xs text-yellow-400 font-medium">20 credits</span>
                      <span className="text-sm font-medium text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">
                        Analyze <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Legal Disclaimer */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-500">Important Notice:</strong> HyntrixAI is a recognition and opportunity discovery ecosystem. Evaluations, scores, and recognition statuses are AI-generated assessments for informational purposes only. They do not constitute a guarantee of rewards, funding, investment, prizes, partnerships, or opportunities. Any recognition, review, or selection is at the sole discretion of HyntrixAI and its team. Users who perform exceptionally well may be reviewed, recognized, featured, become eligible for programs, qualify for consideration, or be considered for future initiatives — but no outcomes are guaranteed.
          </p>
        </div>
      </section>
    </div>
  )
}