import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Social Intelligence - AI Social Media Analysis | HYNTRIX AI',
  description: 'Analyze Instagram, YouTube, LinkedIn, Telegram, and X profiles with AI. Get growth insights, content recommendations, and brand authority scores.',
  alternates: {
    canonical: `${SITE_URL}/social-intelligence`,
  },
  openGraph: {
    title: 'Social Intelligence - AI Social Media Analysis | HYNTRIX AI',
    description: 'Analyze Instagram, YouTube, LinkedIn, Telegram, and X profiles with AI. Get growth insights and content recommendations.',
  },
};

export default function SocialIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}