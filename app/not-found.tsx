import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | HYNTRIX AI',
  description: 'The page you are looking for does not exist or has been moved.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg text-center space-y-8">
        <div className="space-y-2">
          <p className="text-8xl font-bold text-white/10">404</p>
          <h1 className="text-3xl font-semibold text-white">Page not found</h1>
          <p className="text-slate-400 leading-relaxed">
            The Hyntrix AI control room could not locate that destination. 
            It may have been moved or the URL might be incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/" 
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-sm"
          >
            Return Home
          </Link>
          <Link 
 href="/startup-intelligence" 
 className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition text-sm"
          >
            Explore Tools
          </Link>
        </div>

        <div className="pt-8 border-t border-white/5">
          <p className="text-sm text-slate-500">Popular pages:</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {[
              { href: '/startup-intelligence' as const, label: 'Startup Intelligence' },
              { href: '/founder-intelligence' as const, label: 'Founder Intelligence' },
              { href: '/social-intelligence' as const, label: 'Social Intelligence' },
              { href: '/buy-credits' as const, label: 'Buy Credits' },
            ].map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}