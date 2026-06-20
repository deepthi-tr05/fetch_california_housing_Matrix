import { useState } from 'react';

interface HeatmapProps {
  features: string[];
  matrix: number[][];
  descriptions: Record<string, string>;
}

function getColor(value: number): string {
  // -1 => deep red, 0 => slate, +1 => deep cyan
  const clamped = Math.max(-1, Math.min(1, value));
  if (clamped >= 0) {
    const t = clamped;
    const r = Math.round(15 + (6 - 15) * t);
    const g = Math.round(23 + (182 - 23) * t);
    const b = Math.round(42 + (212 - 42) * t);
    return `rgb(${r},${g},${b})`;
  } else {
    const t = -clamped;
    const r = Math.round(15 + (239 - 15) * t);
    const g = Math.round(23 + (68 - 23) * t);
    const b = Math.round(42 + (68 - 42) * t);
    return `rgb(${r},${g},${b})`;
  }
}

export function Heatmap({ features, matrix, descriptions }: HeatmapProps) {
  const [hovered, setHovered] = useState<{ i: number; j: number } | null>(null);

  const cellSize = 54;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Tooltip */}
      {hovered && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-center min-w-64 shadow-xl">
          <div className="text-slate-300 font-semibold mb-1">
            {features[hovered.i]} <span className="text-slate-500">↔</span> {features[hovered.j]}
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: getColor(matrix[hovered.i][hovered.j]) }}
          >
            r = {matrix[hovered.i][hovered.j].toFixed(3)}
          </div>
          <div className="text-xs text-slate-500 mt-1 max-w-xs">
            {descriptions[features[hovered.i]]}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="overflow-auto max-w-full">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `80px repeat(${features.length}, ${cellSize}px)`,
            gap: '2px',
          }}
        >
          {/* Header row */}
          <div />
          {features.map((f) => (
            <div
              key={f}
              className="flex items-end justify-center pb-1"
              style={{ height: 80 }}
            >
              <span
                className="text-xs text-slate-400 font-medium"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  maxHeight: 76,
                  overflow: 'hidden',
                }}
              >
                {f}
              </span>
            </div>
          ))}

          {/* Data rows */}
          {features.map((rowFeature, i) => (
            <>
              <div
                key={`label-${rowFeature}`}
                className="flex items-center justify-end pr-2 text-xs text-slate-400 font-medium truncate"
                style={{ height: cellSize }}
              >
                {rowFeature}
              </div>
              {features.map((_, j) => {
                const val = matrix[i][j];
                const isHovered = hovered?.i === i && hovered?.j === j;
                return (
                  <div
                    key={`${i}-${j}`}
                    className="rounded flex items-center justify-center cursor-pointer transition-all duration-150"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(val),
                      outline: isHovered ? '2px solid rgba(250,250,250,0.8)' : undefined,
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      zIndex: isHovered ? 10 : undefined,
                    }}
                    onMouseEnter={() => setHovered({ i, j })}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <span
                      className="text-xs font-mono font-bold select-none"
                      style={{ color: Math.abs(val) > 0.3 ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)' }}
                    >
                      {val.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="text-red-400 font-bold">-1.0</span>
        <div
          className="w-48 h-3 rounded-full"
          style={{
            background: 'linear-gradient(to right, rgb(239,68,68), rgb(15,23,42), rgb(6,182,212))',
          }}
        />
        <span className="text-cyan-400 font-bold">+1.0</span>
        <span className="ml-4 text-slate-500">Pearson r</span>
      </div>
    </div>
  );
}
