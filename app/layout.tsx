import type { Metadata } from 'next';
import type React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import AppShell from '../components/ui/AppShell';
import AuthProvider from '../components/AuthProvider';
import { I18nProvider } from '../lib/i18n';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'HYNTRIX AI',
  description: 'AI Operating System for founders, creators and businesses.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
