"use client";

import type { JourneyTransition } from "@/lib/types";

interface FlowDiagramProps {
  transitions: JourneyTransition[];
  className?: string;
}

export function FlowDiagram({ transitions, className }: FlowDiagramProps) {
  // Collect unique zones and position them
  const zones = Array.from(
    new Set(transitions.flatMap((t) => [t.fromZone, t.toZone]))
  );

  const maxCount = Math.max(...transitions.map((t) => t.count));
  const zonePositions = new Map<string, { x: number; y: number }>();
  zones.forEach((zone, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    zonePositions.set(zone, {
      x: 80 + col * 200,
      y: 60 + row * 100,
    });
  });

  const width = 600;
  const height = Math.max(200, Math.ceil(zones.length / 3) * 100 + 40);

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: 400 }}
      >
        {/* Connections */}
        {transitions.map((t, i) => {
          const from = zonePositions.get(t.fromZone);
          const to = zonePositions.get(t.toZone);
          if (!from || !to) return null;
          const thickness = Math.max(1, (t.count / maxCount) * 8);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 - 20;
          return (
            <g key={i}>
              <path
                d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                fill="none"
                stroke="hsl(160, 60%, 45%)"
                strokeWidth={thickness}
                opacity={0.4 + (t.count / maxCount) * 0.5}
                markerEnd="url(#arrow)"
              />
              <text
                x={midX}
                y={midY - 5}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={10}
              >
                {t.count}
              </text>
            </g>
          );
        })}

        {/* Arrow marker */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(160, 60%, 45%)" />
          </marker>
        </defs>

        {/* Zone nodes */}
        {zones.map((zone) => {
          const pos = zonePositions.get(zone);
          if (!pos) return null;
          return (
            <g key={zone}>
              <rect
                x={pos.x - 55}
                y={pos.y - 18}
                width={110}
                height={36}
                rx={8}
                fill="hsl(160, 40%, 94%)"
                stroke="hsl(160, 60%, 45%)"
                strokeWidth={1.5}
              />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="fill-foreground"
                fontSize={12}
                fontWeight={500}
              >
                {zone}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
