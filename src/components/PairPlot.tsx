import { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { DataRow } from '../data/californiaHousing';

interface PairPlotProps {
  data: DataRow[];
  features: string[];
}

const COLORS = ['#06b6d4', '#a855f7', '#f59e0b', '#10b981', '#f43f5e', '#3b82f6', '#ec4899', '#84cc16', '#14b8a6'];

const ALL_FEATURES = [
  'MedInc', 'HouseAge', 'AveRooms', 'AveBedrms',
  'Population', 'AveOccup', 'Latitude', 'Longitude', 'MedHouseVal',
];

export function PairPlot({ data, features: _features }: PairPlotProps) {
  const [selected, setSelected] = useState<string[]>(['MedInc', 'HouseAge', 'AveRooms', 'MedHouseVal']);

  const toggleFeature = (f: string) => {
    setSelected((prev) => {
      if (prev.includes(f)) {
        if (prev.length <= 2) return prev;
        return prev.filter((x) => x !== f);
      }
      if (prev.length >= 5) return prev;
      return [...prev, f];
    });
  };

  const subsample = useMemo(() => data.slice(0, 100), [data]);

  return (
    <div className="flex flex-col gap-4">
      {/* Feature selector */}
      <div className="flex flex-wrap gap-2">
        {ALL_FEATURES.map((f) => (
          <button
            key={f}
            onClick={() => toggleFeature(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
              selected.includes(f)
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/50 text-slate-400 border-slate-700/40 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="text-xs text-slate-500 self-center ml-2">Select 2–5 features</span>
      </div>

      {/* Grid */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}
      >
        {selected.map((yFeat, row) =>
          selected.map((xFeat, col) => {
            if (row === col) {
              // Diagonal: feature name label
              return (
                <div
                  key={`${row}-${col}`}
                  className="flex items-center justify-center rounded-lg bg-slate-800/60 border border-slate-700/30"
                  style={{ height: 130 }}
                >
                  <span className="text-xs font-bold text-cyan-400">{xFeat}</span>
                </div>
              );
            }
            const chartData = subsample.map((r) => ({
              x: r[xFeat as keyof DataRow] as number,
              y: r[yFeat as keyof DataRow] as number,
            }));
            return (
              <div
                key={`${row}-${col}`}
                className="rounded-lg bg-slate-800/30 border border-slate-700/20 overflow-hidden"
                style={{ height: 130 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={['auto', 'auto']}
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="y"
                      type="number"
                      domain={['auto', 'auto']}
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || payload.length === 0) return null;
                        const p = payload[0].payload as { x: number; y: number };
                        return (
                          <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white shadow-lg">
                            <div>{xFeat}: <span className="text-cyan-400">{p.x.toFixed(2)}</span></div>
                            <div>{yFeat}: <span className="text-purple-400">{p.y.toFixed(2)}</span></div>
                          </div>
                        );
                      }}
                    />
                    <Scatter data={chartData} opacity={0.6}>
                      {chartData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[col % COLORS.length]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
