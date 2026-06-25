'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { founderFeatures } from '../../lib/features'
import { ArrowRight, Users, Target, Award, Zap } from 'lucide-react'
import { PremiumBadge } from '../../components/ui/PremiumBadge'
import { PERFORMANCE_TIERS } from '../../lib/performance-tiers'

export default function FounderIntelligencePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium tracking-wide">
            <Users className="w-3.5 h-3.5" />
            Founder Spotlight Program
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Founder Intelligence
          </h1>
          <p className="max-w-3xl text-lg text-slate-300 leading-relaxed">
            Exceptional founders may be featured and recognized for their vision, execution capability, and leadership potential. Your founder profile is evaluated for DNA, strengths, weaknesses, and growth trajectory.
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
            Each founder analysis examines your profile across critical dimensions that determine leadership potential and execution capability.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Execution Ability', desc: 'Capability to turn ideas into reality', icon: '🎯' },
            { label: 'Vision Clarity', desc: 'Ability to articulate and pursue a clear vision', icon: '🔭' },
            { label: 'Resilience', desc: 'Capacity to handle pressure and setbacks', icon: '💪' },
            { label: 'Adaptability', desc: 'Flexibility to pivot and learn quickly', icon: '🔄' },
            { label: 'Leadership', desc: 'Ability to inspire and guide teams', icon: '👑' },
            { label: 'Resourcefulness', desc: 'Skill in maximizing limited resources', icon: '🧩' },
            { label: 'Strategic Thinking', desc: 'Long-term planning and decision-making', icon: '♟️' },
            { label: 'Self-Awareness', desc: 'Understanding of strengths and weaknesses', icon: '🪞' },
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
            In the startup ecosystem, founder quality is the strongest predictor of success. Your performance matters.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Founder Discovery', desc: 'Exceptional founders may be identified for spotlight, recognition, and future opportunities.', icon: '🔍' },
            { title: 'Leadership Insights', desc: 'Get honest, data-driven feedback on your founder profile and leadership style.', icon: '📊' },
            { title: 'Competitive Edge', desc: 'Your founder score is benchmarked against top performers. High scores may get you noticed.', icon: '🏆' },
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
            Founder scores are strictly calibrated. Self-assessment alone is not enough. Evidence-backed capability is rewarded.
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
        <div className="rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-emerald-600/5 to-transparent p-8 md:p-12 space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">What Happens If You Score Highly?</h2>
            <p className="text-slate-300 max-w-2xl leading-relaxed">
              Exceptional founders may become eligible for recognition, spotlight opportunities, and future programs. This is not a guarantee — it is an opportunity discovery ecosystem.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              'May be eligible for Founder Spotlight',
              'May qualify for Featured Rankings',
              'May receive Recognition Status',
              'May be considered for Future Founder Programs',
              'May access Network Opportunities',
              'May be eligible for Mentorship Programs',
              'May qualify for Future Collaboration Opportunities',
              'May be eligible for Future Reward Programs',
              'May access Community Recognition',
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-green-400 mt-0.5">→</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Founder Spotlight Program */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">Founder Spotlight Program</h2>
          <p className="text-slate-400 max-w-2xl">
            Exceptional founders may be featured and recognized for their vision, execution capability, and leadership potential.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Founder Spotlight', desc: 'Exceptional founders may be featured in our spotlight program', icon: '👑' },
            { title: 'Recognition Program', desc: 'May be recognized for outstanding founder potential', icon: '🏆' },
            { title: 'Network Opportunities', desc: 'May be connected with investors and partners', icon: '🌐' },
            { title: 'Mentorship Access', desc: 'May be considered for mentorship programs', icon: '🎓' },
            { title: 'Community Recognition', desc: 'May receive recognition from the founder community', icon: '🌟' },
            { title: 'Future Programs', desc: 'May qualify for future founder development programs', icon: '🚀' },
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
          <p className="text-slate-400">Choose a tool to analyze your founder profile. Each evaluation costs 20 credits.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {founderFeatures.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/founder-intelligence/${feature.key}` as any}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02]">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{feature.icon || '⚡'}</span>
                      <PremiumBadge score={75 + Math.floor(Math.random() * 20)} size="sm" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{feature.category || 'Tool'}</p>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">{feature.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-xs text-yellow-400 font-medium">20 credits</span>
                      <span className="text-sm font-medium text-green-400 group-hover:text-green-300 transition-colors flex items-center gap-1">
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