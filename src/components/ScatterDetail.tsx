import { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import type { DataRow } from '../data/californiaHousing';

interface ScatterDetailProps {
  data: DataRow[];
}

const FEATURE_OPTIONS = [
  'MedInc', 'HouseAge', 'AveRooms', 'AveBedrms',
  'Population', 'AveOccup', 'Latitude', 'Longitude', 'MedHouseVal',
];

const QUARTILE_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4'];

export function ScatterDetail({ data }: ScatterDetailProps) {
  const [xAxis, setXAxis] = useState('MedInc');
  const [yAxis, setYAxis] = useState('MedHouseVal');

  const chartData = useMemo(() => {
    const values = data.map((r) => r[yAxis as keyof DataRow] as number);
    const sorted = [...values].sort((a, b) => a - b);
    const q25 = sorted[Math.floor(sorted.length * 0.25)];
    const q50 = sorted[Math.floor(sorted.length * 0.5)];
    const q75 = sorted[Math.floor(sorted.length * 0.75)];

    return data.map((r) => {
      const yVal = r[yAxis as keyof DataRow] as number;
      let quartile = 0;
      if (yVal > q75) quartile = 3;
      else if (yVal > q50) quartile = 2;
      else if (yVal > q25) quartile = 1;
      return {
        x: r[xAxis as keyof DataRow] as number,
        y: yVal,
        quartile,
      };
    });
  }, [data, xAxis, yAxis]);

  return (
    <div className="flex flex-col gap-4">
      {/* Axis selectors */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">X Axis:</label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg text-sm text-white px-3 py-1.5 outline-none focus:border-cyan-500/50"
          >
            {FEATURE_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Y Axis:</label>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg text-sm text-white px-3 py-1.5 outline-none focus:border-cyan-500/50"
          >
            {FEATURE_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto">
          {['Q1 (lowest)', 'Q2', 'Q3', 'Q4 (highest)'].map((label, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: QUARTILE_COLORS[i] }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800/20 rounded-xl border border-slate-700/30 p-4">
        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
            <XAxis
              dataKey="x"
              type="number"
              domain={['auto', 'auto']}
              name={xAxis}
              label={{ value: xAxis, position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 12 }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={['auto', 'auto']}
              name={yAxis}
              label={{ value: yAxis, angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 12 }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const p = payload[0].payload as { x: number; y: number; quartile: number };
                return (
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
                    <div className="font-semibold text-white mb-1">Data Point</div>
                    <div className="text-cyan-400">{xAxis}: <span className="text-white">{p.x.toFixed(3)}</span></div>
                    <div className="text-purple-400">{yAxis}: <span className="text-white">{p.y.toFixed(3)}</span></div>
                    <div className="text-slate-400 mt-1">Q{p.quartile + 1} quartile</div>
                  </div>
                );
              }}
            />
            <Scatter data={chartData} opacity={0.75}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={QUARTILE_COLORS[entry.quartile]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
