import type { Metadata } from 'next';
import type React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import AppShell from '../components/ui/AppShell';
import AuthProvider from '../components/AuthProvider';
import { I18nProvider } from '../lib/i18n';
import { SITE_NAME, SITE_URL, SITE_CONFIG } from '../lib/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - AI Operating System for Founders`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_CONFIG.description,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_CONFIG.description,
    images: ['/og-image.png'],
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
  },
  verification: {
    google: "57AKPqN6-w8D7MbVKtE9ZuGbZmAdbfs8lsjcm3f5Oxk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    'AI startup analysis',
    'founder intelligence',
    'startup validator',
    'business analysis AI',
    'founder personality test',
    'Instagram analyzer AI',
    'YouTube channel analysis',
    'LinkedIn profile review',
    'AI client finder',
    'market opportunity scanner',
    'entrepreneur AI tools',
    'startup growth',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_CONFIG.description,
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@hyntrixai.com',
    },
    sameAs: [
      'https://twitter.com/hyntrixai',
      'https://linkedin.com/company/hyntrixai',
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: SITE_CONFIG.description,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: '22',
      availability: 'https://schema.org/InStock',
    },
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: SITE_NAME,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    description: SITE_CONFIG.description,
    image: `${SITE_URL}${SITE_CONFIG.defaultOgImage}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '22',
      highPrice: '199',
      offerCount: '3',
      availability: 'https://schema.org/InStock',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is HyntrixAI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'HyntrixAI is an AI-powered evaluation and opportunity discovery platform for founders, creators, startup ideas, and business growth.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do HyntrixAI credits work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Users purchase credits and spend them on AI analysis tools. Each core analysis uses a fixed credit cost shown before generation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are scores or recognition guaranteed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. HyntrixAI evaluations are informational. Recognition, review, rankings, programs, rewards, investments, and partnerships are not guaranteed.',
        },
      },
    ],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="theme-color" content={SITE_CONFIG.themeColor} />
        <meta name="background-color" content={SITE_CONFIG.backgroundColor} />
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-white`}>
        <AuthProvider>
          <I18nProvider>
            <AppShell>{children}</AppShell>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
