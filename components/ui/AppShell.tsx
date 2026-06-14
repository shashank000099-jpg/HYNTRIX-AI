'use client';

import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileNav from '../MobileNav';

const publicShellPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password'];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export default function AppShell({ children }: PropsWithChildren<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const hideShell = pathname.startsWith('/auth') || pathname.startsWith('/admin') || pathname.startsWith('/onboarding');

  if (hideShell) {
    return (
      <motion.div 
        className="min-h-screen bg-black px-4 py-8 sm:px-6 lg:px-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="app-shell">
      <div className="lg:flex lg:min-h-screen">
        <Sidebar />
        <motion.main 
          className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:py-10 lg:pb-10"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.main>
      </div>
      <MobileNav />
    </div>
  );
}
