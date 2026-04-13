"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartCard } from "@/components/analytics/ChartCard";
import { HeatmapGrid } from "@/components/analytics/HeatmapGrid";
import { storeHeatmaps } from "@/data/mock";

function formatDwellTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}m ${seconds % 60}s`;
}

export default function HeatmapsPage() {
  const [selectedStore, setSelectedStore] = useState(storeHeatmaps[0].storeId);
  const heatmap = storeHeatmaps.find((h) => h.storeId === selectedStore) ?? storeHeatmaps[0];

  const sortedZones = [...heatmap.zones].sort((a, b) => b.activityLevel - a.activityLevel);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Zone Heatmaps</h1>
        <p className="text-sm text-muted-foreground">
          Camera-detected activity intensity by store zone
        </p>
      </div>

      <Tabs value={selectedStore} onValueChange={setSelectedStore}>
        <TabsList>
          {storeHeatmaps.map((h) => (
            <TabsTrigger key={h.storeId} value={h.storeId}>
              {h.storeName}
            </TabsTrigger>
          ))}
        </TabsList>

        {storeHeatmaps.map((h) => (
          <TabsContent key={h.storeId} value={h.storeId}>
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Heatmap Grid */}
              <div className="lg:col-span-3">
                <ChartCard title="Activity Heatmap" subtitle="Real-time zone intensity">
                  <HeatmapGrid grid={h.grid} />
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "rgb(20, 184, 166)" }} />
                      Low
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "rgb(235, 160, 20)" }} />
                      Medium
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "rgb(255, 50, 10)" }} />
                      High
                    </span>
                  </div>
                </ChartCard>
              </div>

              {/* Zone Details */}
              <div className="space-y-3 lg:col-span-2">
                <h3 className="font-semibold">Zone Details</h3>
                {sortedZones.map((zone) => (
                  <Card key={zone.zoneId} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{zone.zoneName}</span>
                      <Badge
                        variant="outline"
                        className={
                          zone.activityLevel >= 75
                            ? "border-red-200 bg-red-50 text-red-700"
                            : zone.activityLevel >= 50
                            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                            : "border-green-200 bg-green-50 text-green-700"
                        }
                      >
                        {zone.activityLevel}%
                      </Badge>
                    </div>
                    <Progress value={zone.activityLevel} className="h-2" />
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>{zone.visitorCount} visitors</span>
                      <span>Avg dwell: {formatDwellTime(zone.dwellTimeAvg)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Zone Comparison Chart */}
      <ChartCard title="Zone Visitor Count" subtitle={heatmap.storeName}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedZones} layout="vertical">
            <XAxis type="number" fontSize={12} stroke="hsl(var(--muted-foreground))" />
            <YAxis
              type="category"
              dataKey="zoneName"
              width={120}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip />
            <Bar dataKey="visitorCount" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} name="Visitors" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
