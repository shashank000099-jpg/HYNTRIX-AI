'use client';

export default function CircularProgress({ value }: { value: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-white/5 shadow-soft">
      <svg className="h-full w-full" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-semibold text-white">{value}%</p>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">score</p>
      </div>
    </div>
  );
}
