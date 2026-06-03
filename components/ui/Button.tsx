'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import type { PropsWithChildren } from 'react';

type ButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '', 
  ...props 
}: PropsWithChildren<ButtonProps>) {
  const sizeStyles = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-7 py-4 text-base'
  };

  const variantStyles = {
    primary: 'bg-[#0071e3] text-white hover:bg-[#0077ed] shadow-lg shadow-blue-900/20',
    secondary: 'bg-slate-900 text-slate-100 ring-1 ring-white/10 hover:bg-slate-800 hover:ring-white/20',
    ghost: 'bg-white/5 text-slate-100 hover:bg-white/10 backdrop-blur-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center rounded-full font-semibold
        transition-all duration-200 ease-out
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
