import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - Account Settings | HYNTRIX AI',
  description: 'Manage your Hyntrix AI profile, view credit usage, and customize your account settings.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}