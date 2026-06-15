'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Rocket, Star, Users, FileText, Settings, MessageCircle, LogOut, Zap, Bookmark } from 'lucide-react'
import { useAuthStore } from '../../lib/auth-store'
import { useState, useEffect } from 'react'
import { getWallet } from '../../lib/credits'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Startup Intelligence', href: '/startup-intelligence', icon: Rocket },
  { label: 'Founder Intelligence', href: '/founder-intelligence', icon: Star },
  { label: 'Social Intelligence', href: '/social-intelligence', icon: MessageCircle },
  { label: 'AI Client Finder', href: '/ai-client-finder', icon: Users },
  { label: 'Reports', href: '/history', icon: FileText },
  { label: 'Saved Reports', href: '/saved-reports', icon: Bookmark },
  { label: 'Pricing', href: '/buy-credits', icon: Zap },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const navItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.02, duration: 0.3 }
  })
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    async function fetchCredits() {
      if (!user?.id) return
      const wallet = await getWallet(user.id)
      setCredits(wallet.credits)
    }
    fetchCredits()
    const interval = setInterval(fetchCredits, 30000)
    return () => clearInterval(interval)
  }, [user?.id])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth/login'
  }

  return (
    <>
      <aside className="hidden w-full max-w-[300px] shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col gap-8 px-6 py-8">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 shadow-soft hover:bg-white/8 transition-colors duration-200 cursor-pointer">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Rocket size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">HYNTRIX AI</p>
                  <p className="text-sm font-semibold text-white">Founder OS</p>
                </div>
              </div>
            </Link>
            <p className="text-sm leading-6 text-slate-400">A premium AI command center for launch-ready founders.</p>
          </motion.div>

          {/* Credits Badge - links to buy-credits */}
          <Link href="/buy-credits">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 hover:from-yellow-500/15 hover:to-orange-500/15 transition cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-yellow-400">Credits</p>
                <p className="text-lg font-semibold text-white">
                  {credits.toLocaleString()}
                </p>
              </div>
              <div className="ml-auto">
                <span className="text-xs text-yellow-400 font-medium">Buy →</span>
              </div>
            </motion.div>
          </Link>

          <nav className="space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <motion.div
                  key={item.href}
                  custom={index}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Link
                    href={item.href as any}
                    className={`
                      group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium 
                      transition-all duration-200 ease-out
                      ${active 
                        ? 'bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/5' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 transition-colors duration-200 ${active ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`} />
                    <span>{item.label}</span>
                    {active && (
                      <motion.div 
                        className="ml-auto h-2 w-2 rounded-full bg-blue-400"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="space-y-3"
          >
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-xl"
      >
        <nav className="flex items-center gap-2 overflow-x-auto px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href as any}
                className={`
                  inline-flex min-w-[72px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-[11px] font-medium 
                  transition-all duration-200
                  ${active 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </nav>
      </motion.div>
    </>
  )
}