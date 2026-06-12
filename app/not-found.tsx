import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-surface/90 p-10 shadow-soft">
      <h1 className="text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 max-w-xl text-slate-400">
        The Hyntrix AI control room could not locate that destination. Head back to the dashboard to continue.
      </p>
      <Link href="/dashboard" className="mt-8 inline-flex rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">
        Return to dashboard
      </Link>
    </div>
  );
}
