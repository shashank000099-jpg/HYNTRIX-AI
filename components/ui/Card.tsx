'use client';

import { type PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      className={`
        glass-card rounded-2xl border border-white/8 p-6 
        hover:border-white/12 hover:shadow-lg transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
