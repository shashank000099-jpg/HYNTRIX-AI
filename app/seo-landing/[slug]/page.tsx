// ============================================
// PROGRAMMATIC SEO LANDING PAGES
// ============================================

import { notFound } from 'next/navigation'
import { SEO_LANDING_PAGES } from '../../../lib/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata as seoMetadata } from '../../../lib/seo'
import { getOrganizationSchema, getBreadcrumbSchema } from '../../../lib/seo'
import { startupFeatures, founderFeatures, socialFeatures, opportunityFeatures } from '../../../lib/features'

interface PageParams {
  slug: string
}

interface Props {
  params: Promise<PageParams>
}

export async function generateStaticParams() {
  return SEO_LANDING_PAGES.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = SEO_LANDING_PAGES.find((p) => p.slug === slug)
  if (!page) return {}

  return seoMetadata({
    title: page.title,
    description: page.description,
    path: `/seo-landing/${slug}`,
    keywords: page.keywords,
    ogType: 'website',
  })
}

function getCategoryPath(category?: string): string {
  switch (category) {
    case 'client-finder': return 'ai-client-finder'
    case 'social': return 'social-intelligence'
    case 'opportunity': return 'opportunity-hub'
    case 'founder': return 'founder-intelligence'
    default: return 'startup-intelligence'
  }
}

export default async function SEOLandingPage({ params }: Props) {
  const { slug } = await params
  const page = SEO_LANDING_PAGES.find((p) => p.slug === slug)
  if (!page) notFound()

  const allFeatures = [...startupFeatures, ...founderFeatures, ...socialFeatures, ...opportunityFeatures]
  const organizationSchema = getOrganizationSchema()
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: page.h1, url: `/seo-landing/${slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-20">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400">HYNTRIX AI</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            {page.h1}
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
            {page.heroText}
          </p>
          <p className="max-w-2xl mx-auto text-sm text-slate-500 leading-relaxed">
            {page.description}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Get Started Free →
            </Link>
            <Link
              href="/buy-credits"
              className="px-8 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition"
            >
              View Pricing
            </Link>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">AI-Powered Intelligence Tools</h2>
            <p className="mt-2 text-slate-400">Every analysis costs 20 credits. No subscriptions, no hidden fees.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allFeatures.slice(0, 6).map((feature) => {
              const featurePath = `/${getCategoryPath(feature.category)}/${feature.key}`
              return (
              <Link key={feature.key} href={featurePath as any}>
                  <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/[0.08] hover:-translate-y-1 cursor-pointer">
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                    <p className="mt-3 text-xs font-medium text-blue-400 group-hover:text-blue-300">Try it now →</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up free and get started immediately.' },
              { step: '2', title: 'Buy Credits', desc: 'Purchase credits starting at just ₹22.' },
              { step: '3', title: 'Get Intelligence', desc: 'Run AI analysis on any tool in seconds.' },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Simple Pricing</h2>
            <p className="mt-2 text-slate-400">Pay only for what you use.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { credits: 20, price: '₹22', label: 'Quick Access' },
              { credits: 100, price: '₹99', label: 'Starter', popular: true },
              { credits: 250, price: '₹199', label: 'Most Popular', popular: true },
            ].map((pack) => (
              <div key={pack.label} className={`rounded-2xl border ${pack.popular ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/10 bg-white/5'} p-6 text-center`}>
                {pack.popular && <span className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white font-semibold">Popular</span>}
                <p className="text-3xl font-bold text-white mt-3">{pack.price}</p>
                <p className="text-sm text-slate-400 mt-1">{pack.credits} Credits</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 space-y-4">
          <h2 className="text-3xl font-bold text-white">Ready to Start?</h2>
          <p className="text-slate-400">Join founders building smarter with AI intelligence.</p>
          <Link href="/auth/signup" className="inline-block px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
            Create Free Account →
          </Link>
        </section>
      </div>
    </>
  )
}
