'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '../lib/auth-store'
import { useCreditsStore } from '../lib/credits-store'
import { useEffect } from 'react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v7a1 1 0 001 1h12a1 1 0 001-1V9m-9 4v4m4-4v4m-9-8l2-1m10 0l2 1" />
      </svg>
    )
  },
  {
    label: 'Startup',
    href: '/startup-intelligence',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    label: 'Social',
    href: '/social-intelligence',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    label: 'Opportunity',
    href: '/opportunity-hub',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }
]

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuthStore()
  const { balance, fetchBalance } = useCreditsStore()

  // Fetch credits on mount and whenever user changes
  useEffect(() => {
    if (user?.id) {
      fetchBalance(user.id)
    }
  }, [user?.id, fetchBalance])

  // Don't show nav on auth pages or onboarding
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/onboarding')) {
    return null
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around gap-2 px-2 py-1.5">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link key={item.href} href={item.href as any}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-0.5"
              >
                <div className={`relative p-1.5 rounded-xl transition ${
                  isActive
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-gray-500 hover:text-white'
                }`}>
                  {item.icon}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 rounded-xl border-2 border-blue-400"
                    />
                  )}
                </div>
                <span className={`text-[10px] font-medium transition ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          )
        })}
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-red-400 transition"
        >
          <div className="p-1.5 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </div>
      {/* Live Credit Display - auto updates after deductions */}
      {user && (
        <div className="absolute -top-8 right-3">
          <Link href="/buy-credits">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/30 transition">
              <span>⚡</span>
              <span>{balance}</span>
            </div>
          </Link>
        </div>
      )}
    </nav>
  )
}