import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Opportunity Hub - AI Market Opportunity Scanner | HYNTRIX AI',
  description: 'Discover market gaps, emerging trends, and profitable niches with AI-powered opportunity intelligence. Find your next business idea.',
  alternates: {
    canonical: `${SITE_URL}/opportunity-hub`,
  },
  openGraph: {
    title: 'Opportunity Hub - AI Market Opportunity Scanner | HYNTRIX AI',
    description: 'Discover market gaps, emerging trends, and profitable niches with AI-powered opportunity intelligence.',
  },
};

export default function OpportunityHubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}