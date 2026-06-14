import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Dashboard - Founder OS Command Center | HYNTRIX AI',
  description: 'Monitor insights, saved reports, historical analysis, and credit usage from your premium AI intelligence workspace.',
  alternates: {
    canonical: `${SITE_URL}/dashboard`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}