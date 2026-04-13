"use client";

import { cn } from "@/lib/utils";

interface HeatmapGridProps {
  grid: number[][];
  className?: string;
}

function getHeatColor(value: number): string {
  // Interpolate from teal (low) → yellow (mid) → red (high)
  if (value <= 50) {
    const t = value / 50;
    const r = Math.round(20 + t * 215);
    const g = Math.round(184 - t * 24);
    const b = Math.round(166 - t * 146);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const t = (value - 50) / 50;
    const r = Math.round(235 + t * 20);
    const g = Math.round(160 - t * 110);
    const b = Math.round(20 - t * 10);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export function HeatmapGrid({ grid, className }: HeatmapGridProps) {
  return (
    <div className={cn("aspect-[4/3] w-full", className)}>
      <div
        className="grid h-full w-full gap-[2px] rounded-lg overflow-hidden"
        style={{
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0]?.length ?? 8}, 1fr)`,
        }}
      >
        {grid.flatMap((row, rowIdx) =>
          row.map((value, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className="rounded-sm transition-colors"
              style={{ backgroundColor: getHeatColor(value), opacity: 0.7 + value * 0.003 }}
              title={`Activity: ${value}%`}
            />
          ))
        )}
      </div>
    </div>
  );
}
