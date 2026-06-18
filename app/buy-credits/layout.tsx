import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/config';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Buy Credits - AI Intelligence Credits | HYNTRIX AI',
  description: 'Purchase credits for AI-powered startup analysis, founder assessment, social media intelligence, and client finding. Starting at just ₹22.',
  alternates: {
    canonical: `${SITE_URL}/buy-credits`,
  },
  openGraph: {
    title: 'Buy Credits - AI Intelligence Credits | HYNTRIX AI',
    description: 'Purchase credits for AI-powered startup analysis, founder assessment, social media intelligence, and client finding.',
  },
};

export default function BuyCreditsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
