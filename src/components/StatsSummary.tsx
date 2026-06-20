import { useMemo } from 'react';
import { featureDescriptions } from '../data/californiaHousing';
import type { DataRow } from '../data/californiaHousing';

interface StatsSummaryProps {
  data: DataRow[];
}

const FEATURES = [
  'MedInc', 'HouseAge', 'AveRooms', 'AveBedrms',
  'Population', 'AveOccup', 'Latitude', 'Longitude', 'MedHouseVal',
];

function computeStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  const q1 = sorted[Math.floor(n * 0.25)];
  const median = sorted[Math.floor(n * 0.5)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  const skewness = values.reduce((acc, v) => acc + ((v - mean) / std) ** 3, 0) / n;
  return {
    count: n,
    mean: mean.toFixed(3),
    std: std.toFixed(3),
    min: sorted[0].toFixed(3),
    q1: q1.toFixed(3),
    median: median.toFixed(3),
    q3: q3.toFixed(3),
    max: sorted[n - 1].toFixed(3),
    iqr: iqr.toFixed(3),
    skewness: skewness.toFixed(3),
  };
}

const STAT_LABELS: { key: string; label: string; color: string }[] = [
  { key: 'count', label: 'Count', color: '#94a3b8' },
  { key: 'mean', label: 'Mean', color: '#06b6d4' },
  { key: 'std', label: 'Std Dev', color: '#a855f7' },
  { key: 'min', label: 'Min', color: '#f43f5e' },
  { key: 'q1', label: 'Q1 (25%)', color: '#f59e0b' },
  { key: 'median', label: 'Median', color: '#10b981' },
  { key: 'q3', label: 'Q3 (75%)', color: '#3b82f6' },
  { key: 'max', label: 'Max', color: '#ec4899' },
  { key: 'iqr', label: 'IQR', color: '#84cc16' },
  { key: 'skewness', label: 'Skewness', color: '#14b8a6' },
];

export function StatsSummary({ data }: StatsSummaryProps) {
  const stats = useMemo(() => {
    return FEATURES.map((f) => ({
      feature: f,
      description: featureDescriptions[f],
      stats: computeStats(data.map((r) => r[f as keyof DataRow] as number)),
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      {stats.map(({ feature, description, stats: s }) => (
        <div
          key={feature}
          className="bg-slate-800/30 border border-slate-700/30 rounded-xl overflow-hidden"
        >
          <div className="px-5 py-3 bg-slate-800/50 border-b border-slate-700/30">
            <div className="font-semibold text-white text-sm">{feature}</div>
            <div className="text-xs text-slate-400 mt-0.5">{description}</div>
          </div>
          <div className="px-5 py-3">
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
              {STAT_LABELS.map(({ key, label, color }) => (
                <div key={key} className="text-center">
                  <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                  <div className="text-sm font-mono font-semibold" style={{ color }}>
                    {s[key as keyof typeof s]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
