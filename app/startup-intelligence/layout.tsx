import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Startup Intelligence - AI Startup Analysis Tools | HYNTRIX AI',
  description: 'Analyze your startup with AI. Get instant feedback on viability, competition, revenue model, and growth potential with our suite of startup intelligence tools.',
  alternates: {
    canonical: `${SITE_URL}/startup-intelligence`,
  },
  openGraph: {
    title: 'Startup Intelligence - AI Startup Analysis Tools | HYNTRIX AI',
    description: 'Analyze your startup with AI. Get instant feedback on viability, competition, revenue model, and growth potential.',
  },
};

export default function StartupIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}