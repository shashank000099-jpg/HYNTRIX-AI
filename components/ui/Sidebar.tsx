'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Rocket, Star, Users, FileText, Settings, Clock3, Award, ShieldCheck, Sparkles, MessageCircle, Circle, User } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Startup', href: '/startup-intelligence', icon: Rocket },
  { label: 'Founder', href: '/founder-intelligence', icon: Star },
  { label: 'Opportunity', href: '/opportunity-hub', icon: Sparkles },
  { label: 'Social', href: '/social-intelligence', icon: MessageCircle },
  { label: 'Simulators', href: '/simulators', icon: Circle },
  { label: 'Board Room', href: '/board-room', icon: ShieldCheck },
  { label: 'Founder Hub', href: '/founder-hub', icon: Award },
  { label: 'History', href: '/history', icon: Clock3 },
  { label: 'Saved Reports', href: '/saved-reports', icon: FileText },
  { label: 'Profile', href: '/profile', icon: User }
];

const navItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.02, duration: 0.3 }
  })
};

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

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
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 shadow-soft hover:bg-white/8 transition-colors duration-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Rocket size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">HYNTRIX AI</p>
                <p className="text-sm font-semibold text-white">Founder OS</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-400">A premium AI command center for launch-ready founders.</p>
          </motion.div>

          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
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
              );
            })}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-auto rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 via-transparent to-white/0 p-5 shadow-soft hover:border-white/10 transition-colors duration-200"
          >
            <p className="text-sm text-slate-300">Your AI operating system is ready. Connect integrations in settings and explore growth intelligence.</p>
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
            const Icon = item.icon;
            const active = isActive(item.href);
            
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
            );
          })}
        </nav>
      </motion.div>
    </>
  );
}
