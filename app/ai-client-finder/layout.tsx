import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: 'AI Client Finder - Find High-Value Clients | HYNTRIX AI',
  description: 'Find high-value clients using AI-powered business intelligence. Discover companies that need your services with actionable outreach suggestions.',
  alternates: {
    canonical: `${SITE_URL}/ai-client-finder`,
  },
  openGraph: {
    title: 'AI Client Finder - Find High-Value Clients | HYNTRIX AI',
    description: 'Find high-value clients using AI-powered business intelligence. Discover companies that need your services.',
  },
};

export default function AIClientFinderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}