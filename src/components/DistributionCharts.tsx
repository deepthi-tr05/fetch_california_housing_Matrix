import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { DataRow } from '../data/californiaHousing';

interface DistributionChartsProps {
  data: DataRow[];
  features: string[];
}

const COLORS = [
  '#06b6d4', '#a855f7', '#f59e0b', '#10b981',
  '#f43f5e', '#3b82f6', '#ec4899', '#84cc16', '#14b8a6',
];

function buildHistogram(values: number[], bins = 20): { bin: string; count: number; center: number }[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / bins;
  if (step === 0) return [];
  const counts = Array(bins).fill(0);
  values.forEach((v) => {
    let idx = Math.floor((v - min) / step);
    if (idx >= bins) idx = bins - 1;
    counts[idx]++;
  });
  return counts.map((count, i) => ({
    bin: `${(min + i * step).toFixed(1)}`,
    center: min + (i + 0.5) * step,
    count,
  }));
}

function computeStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  const q1 = sorted[Math.floor(n * 0.25)];
  const median = sorted[Math.floor(n * 0.5)];
  const q3 = sorted[Math.floor(n * 0.75)];
  return { mean, std, q1, median, q3, min: sorted[0], max: sorted[n - 1] };
}

export function DistributionCharts({ data, features }: DistributionChartsProps) {
  const charts = useMemo(() => {
    return features.map((f, idx) => {
      const values = data.map((r) => r[f as keyof DataRow] as number);
      const hist = buildHistogram(values);
      const stats = computeStats(values);
      return { feature: f, hist, stats, color: COLORS[idx % COLORS.length] };
    });
  }, [data, features]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {charts.map(({ feature, hist, stats, color }) => (
        <div
          key={feature}
          className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-white">{feature}</h3>
            <div className="text-right text-xs text-slate-400">
              <div>μ = <span style={{ color }}>{stats.mean.toFixed(2)}</span></div>
              <div>σ = <span className="text-slate-300">{stats.std.toFixed(2)}</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={hist} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
              <XAxis dataKey="bin" tick={false} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const p = payload[0].payload as { bin: string; count: number; center: number };
                  return (
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
                      <div>Value: <span style={{ color }}>{p.center.toFixed(2)}</span></div>
                      <div>Count: <span className="text-white">{p.count}</span></div>
                    </div>
                  );
                }}
              />
              <ReferenceLine x={stats.mean.toFixed(1)} stroke={color} strokeDasharray="3 3" strokeOpacity={0.8} />
              <Bar dataKey="count" fill={color} fillOpacity={0.75} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-slate-500">
            <div>Min: <span className="text-slate-300">{stats.min.toFixed(1)}</span></div>
            <div className="text-center">Med: <span className="text-slate-300">{stats.median.toFixed(1)}</span></div>
            <div className="text-right">Max: <span className="text-slate-300">{stats.max.toFixed(1)}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}
