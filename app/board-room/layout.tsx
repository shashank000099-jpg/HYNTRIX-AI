import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Board Room - AI Advisory for Founders | HYNTRIX AI',
  description: 'Get AI-powered advice from your virtual board. Product, growth, finance, and legal advisors available 24/7 to help you make better decisions.',
  alternates: {
    canonical: `${SITE_URL}/board-room`,
  },
  openGraph: {
    title: 'Board Room - AI Advisory for Founders | HYNTRIX AI',
    description: 'Get AI-powered advice from your virtual board. Product, growth, finance, and legal advisors available 24/7.',
  },
};

export default function BoardRoomLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}