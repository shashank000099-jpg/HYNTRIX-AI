'use client';

export default function LoadingOverlay({ label = 'Analyzing your request...' }: { label?: string }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[2rem] bg-black/70 text-center text-white backdrop-blur-sm">
      <div className="space-y-4 px-6 py-8">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-primary" />
        <p className="text-sm text-slate-200">{label}</p>
      </div>
    </div>
  );
}
