// ============================================
// ENTERPRISE SEO UTILITY
// ============================================

import { SITE_NAME, SITE_URL, TWITTER_HANDLE, DEFAULT_OG_IMAGE } from './config'
import type { Metadata } from 'next'

export interface SEOProps {
  title: string
  description: string
  path: string
  keywords?: string[]
  ogImage?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
  author?: string
  noIndex?: boolean
  canonicalUrl?: string
}

/**
 * Generate comprehensive metadata for any page
 * Includes OpenGraph, Twitter Cards, and canonical URLs
 */
export function generateMetadata(props: SEOProps): Metadata {
  const {
    title,
    description,
    path,
    keywords = [],
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    publishedTime,
    author,
    noIndex = false,
    canonicalUrl
  } = props

  const url = `${SITE_URL}${path}`
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl || url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: ogType,
      ...(publishedTime && { publishedTime }),
      ...(author && { author }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(noIndex && { robots: { index: false, follow: false } as any }),
  }
}

/**
 * Generate JSON-LD structured data for a page
 */
type JsonLdType = 'WebApplication' | 'WebSite' | 'Organization' | 'Article' | 'Product' | 'BreadcrumbList' | 'FAQPage' | 'ItemList'

export function generateJsonLd(
  type: JsonLdType,
  data: Record<string, any>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }
}

/**
 * Organization structured data
 */
export function getOrganizationSchema() {
  return generateJsonLd('Organization', {
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'AI Operating System for Founders. Premium AI intelligence for startup analysis, founder assessment, and business growth.',
    sameAs: [
      'https://twitter.com/hyntrixai',
      'https://linkedin.com/company/hyntrixai',
    ],
  })
}

/**
 * WebSite structured data
 */
export function getWebsiteSchema() {
  return generateJsonLd('WebSite', {
    name: SITE_NAME,
    url: SITE_URL,
    description: 'AI Operating System for Founders',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  })
}

/**
 * Generate breadcrumb structured data
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return generateJsonLd('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  })
}

/**
 * Format category name for display
 */
export function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}