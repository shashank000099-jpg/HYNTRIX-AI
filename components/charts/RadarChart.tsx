'use client';

const labels = ['Strategy', 'Market', 'Team', 'Growth', 'Execution'];
const points = labels.map((_, index) => {
  const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
  return angle;
});

export default function RadarChart({ values }: { values: number[] }) {
  const normalized = values.slice(0, labels.length).map((value) => Math.min(100, Math.max(0, value)) / 100);
  const path = normalized
    .map((value, index) => {
      const angle = points[index];
      const x = 70 + Math.cos(angle) * 60 * value;
      const y = 70 + Math.sin(angle) * 60 * value;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ') + ' Z';

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-40 w-40">
        {[5, 4, 3, 2, 1].map((step) => (
          <circle key={step} cx="70" cy="70" r={step * 12} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        ))}
        {labels.map((label, index) => {
          const angle = points[index];
          const x = 70 + Math.cos(angle) * 68;
          const y = 70 + Math.sin(angle) * 68;
          return (
            <g key={label}>
              <line x1="70" y1="70" x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <text x={x} y={y} fill="#94a3b8" fontSize="9" textAnchor={x > 70 ? 'start' : 'end'} dominantBaseline="middle">
                {label}
              </text>
            </g>
          );
        })}
        <path d={path} fill="rgba(79, 70, 229, 0.24)" stroke="#4F46E5" strokeWidth="2" />
      </svg>
    </div>
  );
}
