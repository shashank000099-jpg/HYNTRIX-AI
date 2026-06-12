'use client'

import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '../lib/auth-store'
import { useRouter, usePathname } from 'next/navigation'

const publicPaths = ['/', '/auth/login', '/auth/signup', '/auth/forgot-password']

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { initialize, initialized, loading, user } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!initialized) return

    const isPublic = publicPaths.some(p => pathname.startsWith(p)) || pathname.startsWith('/auth/callback')

    if (!user && !isPublic && !loading) {
      router.push('/auth/login')
    }
  }, [initialized, user, loading, pathname, router])

  if (loading && !initialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading Hyntrix AI...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}