'use client'

import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export default function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-3xl border px-4 py-3 text-sm text-white outline-none transition focus:ring-2 ${
        error
          ? 'border-red-500/50 bg-red-950/30 focus:border-red-500 focus:ring-red-500/20'
          : 'border-white/10 bg-slate-950/80 focus:border-primary focus:ring-primary/20'
      } ${className || ''}`}
    />
  )
}