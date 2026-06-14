import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Founder Intelligence - AI Founder Assessment Tools | HYNTRIX AI',
  description: 'Discover your founder DNA, leadership style, and entrepreneurial strengths with AI-powered founder assessment tools. Optimize your founder journey.',
  alternates: {
    canonical: `${SITE_URL}/founder-intelligence`,
  },
  openGraph: {
    title: 'Founder Intelligence - AI Founder Assessment Tools | HYNTRIX AI',
    description: 'Discover your founder DNA, leadership style, and entrepreneurial strengths with AI-powered assessment tools.',
  },
};

export default function FounderIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}