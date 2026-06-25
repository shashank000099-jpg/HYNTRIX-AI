'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { startupFeatures } from '../../lib/features'
import { ArrowRight, TrendingUp, Target, Award, Zap } from 'lucide-react'
import { PremiumBadge } from '../../components/ui/PremiumBadge'
import { PERFORMANCE_TIERS } from '../../lib/performance-tiers'

export default function StartupIntelligencePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide">
            <TrendingUp className="w-3.5 h-3.5" />
            Startup Opportunity Program
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Startup Intelligence
          </h1>
          <p className="max-w-3xl text-lg text-slate-300 leading-relaxed">
            Every startup idea is evaluated across Market Demand, Competition, Scalability, Monetization, Execution Capability, Founder Potential, Growth Potential, and Long-Term Sustainability. High-performing startup ideas may be reviewed by the HyntrixAI Team.
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
            Each startup analysis examines your idea across critical dimensions that determine real-world viability and success potential.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Market Demand', desc: 'Size, growth, and urgency of the problem', icon: '📊' },
            { label: 'Competition', desc: 'Competitive landscape and differentiation', icon: '⚔️' },
            { label: 'Scalability', desc: 'Ability to grow without proportional costs', icon: '📈' },
            { label: 'Monetization', desc: 'Revenue model and unit economics', icon: '💰' },
            { label: 'Execution', desc: 'Feasibility of building and launching', icon: '🎯' },
            { label: 'Founder Potential', desc: 'Capability and readiness to execute', icon: '🧬' },
            { label: 'Growth Potential', desc: 'Trajectory and expansion opportunities', icon: '🚀' },
            { label: 'Sustainability', desc: 'Long-term viability and defensibility', icon: '♻️' },
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
            In a competitive ecosystem, your startup idea is being evaluated alongside thousands of others. Performance matters.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Serious Evaluation', desc: 'Every idea is assessed with investor-level rigor. Weak models are penalized. Strong ideas are recognized.', icon: '⚖️' },
            { title: 'Opportunity Discovery', desc: 'Exceptional submissions may be reviewed for recognition, spotlight, and future programs.', icon: '💡' },
            { title: 'Competitive Ecosystem', desc: 'Your performance is measured against established benchmarks. High scores may get you noticed.', icon: '🏆' },
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
            Scores are strictly calibrated. Inflation is penalized. Exceptional performance is rare.
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
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent p-8 md:p-12 space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">What Happens If You Score Highly?</h2>
            <p className="text-slate-300 max-w-2xl leading-relaxed">
              Exceptional submissions may be reviewed for visibility, recognition, spotlight opportunities, rankings, and future programs. This is not a guarantee — it is an opportunity discovery ecosystem.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              'May be reviewed by the HyntrixAI Team',
              'May qualify for Founder Spotlight',
              'May be eligible for Startup Showcase',
              'May receive Product Feedback',
              'May access Growth Guidance',
              'May be considered for Development Assistance',
              'May qualify for Future Collaboration Opportunities',
              'May be eligible for Future Reward Programs',
              'May receive Community Recognition',
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-blue-400 mt-0.5">→</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Startup Recognition System */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">Startup Recognition System</h2>
          <p className="text-slate-400 max-w-2xl">
            Exceptional startup ideas may qualify for manual review and opportunity programs.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Manual Review', desc: 'High-scoring ideas may be reviewed by the HyntrixAI Team', icon: '🔍' },
            { title: 'Founder Spotlight', desc: 'Exceptional founders may be featured in our spotlight program', icon: '👑' },
            { title: 'Startup Showcase', desc: 'Top ideas may be showcased to our network', icon: '🌟' },
            { title: 'Growth Guidance', desc: 'Selected founders may receive strategic guidance', icon: '📈' },
            { title: 'Development Assistance', desc: 'May be considered for development support programs', icon: '🛠️' },
            { title: 'Future Opportunities', desc: 'May qualify for future collaboration and reward programs', icon: '🚀' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
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
          <p className="text-slate-400">Choose a tool to analyze your startup. Each evaluation costs 20 credits.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {startupFeatures.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/startup-intelligence/${feature.key}` as any}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02]">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{feature.icon || '⚡'}</span>
                      <PremiumBadge score={75 + Math.floor(Math.random() * 20)} size="sm" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{feature.category || 'Tool'}</p>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-xs text-yellow-400 font-medium">20 credits</span>
                      <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-1">
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