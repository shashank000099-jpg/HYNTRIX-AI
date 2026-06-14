'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/auth-store'
import Link from 'next/link'
import { Zap, Clock, Database, Shield } from 'lucide-react'

export default function AIClientFinderPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">AI Client Finder</p>
        <h1 className="text-4xl font-semibold text-white">Find High-Value Clients</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">
          Use AI-powered business intelligence to discover potential clients, analyze their fit, and get outreach recommendations.
        </p>
      </div>

      {/* Coming Soon Message */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-blue-500/10 p-8 md:p-12 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-500/30">
          <Database className="h-10 w-10 text-blue-400" />
        </div>
        <div className="space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Client Intelligence Engine</h2>
          <p className="text-slate-400 leading-relaxed">
            Our AI-powered client finder is being trained on millions of business data points 
            to deliver high-quality leads with actionable outreach strategies.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
          <div className="rounded-xl bg-white/5 p-4 text-left">
            <Zap className="h-5 w-5 text-yellow-400 mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">AI-Powered Matching</h3>
            <p className="text-xs text-slate-400">Smart algorithms find your ideal clients</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-left">
            <Clock className="h-5 w-5 text-green-400 mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">Real-Time Data</h3>
            <p className="text-xs text-slate-400">Fresh business intelligence daily</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-left">
            <Shield className="h-5 w-5 text-purple-400 mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">Verified Leads</h3>
            <p className="text-xs text-slate-400">High-quality, validated prospects only</p>
          </div>
        </div>

        <div className="pt-4">
          <div className="inline-block px-6 py-3 rounded-xl bg-blue-600/50 text-blue-300 text-sm font-semibold border border-blue-500/30">
            🚀 Launching Soon — Join the Waitlist
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="text-lg font-semibold text-white">How It Will Work</h3>
            <p className="mt-2 text-sm text-slate-300">
              Input your business type, target location, industry, and keywords. Our AI will scan 
              millions of companies to find high-value leads with opportunity scores, lead quality ratings, 
              and personalized outreach suggestions. Each search will cost 20 credits.
            </p>
          </div>
        </div>
      </div>

      {user && (
        <div className="flex justify-center">
          <Link 
            href="/buy-credits" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-sm"
          >
            <Zap className="h-4 w-4" />
            Buy Credits & Prepare
          </Link>
        </div>
      )}
    </div>
  )
}