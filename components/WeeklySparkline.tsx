"use client";

export default function WeeklySparkline({ data, color = '#6ee7b7' }: { data: number[]; color?: string }) {
  const w = 260;
  const h = 56;
  const pad = 6;
  const max = Math.max(1, ...data);
  const step = (w - pad * 2) / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  const last = data.at(-1) ?? 0;
  const first = data.at(0) ?? 0;
  const diff = last - first;
  const positive = diff >= 0;

  return (
    <div className="chart">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      </svg>
      <div className={`badge ${positive ? 'positive' : 'negative'}`}>
        {positive ? '+' : ''}{diff}
      </div>
    </div>
  );
}
