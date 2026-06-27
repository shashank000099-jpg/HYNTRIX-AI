// ============================================
// DYNAMIC SITEMAP GENERATION
// ============================================

import { SITE_URL } from '../lib/config'
import { TOOLS_SEO, SEO_LANDING_PAGES } from '../lib/config'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/startup-intelligence`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/founder-intelligence`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/social-intelligence`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/opportunity-hub`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ai-client-finder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/board-room`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Tool pages (programmatic SEO)
  const toolPages: MetadataRoute.Sitemap = Object.values(TOOLS_SEO).map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // SEO landing pages
  const seoLandingPages: MetadataRoute.Sitemap = SEO_LANDING_PAGES.map((page) => ({
    url: `${SITE_URL}/seo-landing/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...toolPages, ...seoLandingPages]
}
