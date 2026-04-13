"use client";

import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/analytics/StatCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { FlowDiagram } from "@/components/analytics/FlowDiagram";
import { journeyData } from "@/data/mock";

export default function JourneyPage() {
  const [selectedStore, setSelectedStore] = useState(journeyData[0].storeId);
  const journey = journeyData.find((j) => j.storeId === selectedStore) ?? journeyData[0];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Customer Journey</h1>
        <p className="text-sm text-muted-foreground">
          Camera-tracked customer flow between store zones
        </p>
      </div>

      <Tabs value={selectedStore} onValueChange={setSelectedStore}>
        <TabsList>
          {journeyData.map((j) => (
            <TabsTrigger key={j.storeId} value={j.storeId}>
              {j.storeName}
            </TabsTrigger>
          ))}
        </TabsList>

        {journeyData.map((j) => (
          <TabsContent key={j.storeId} value={j.storeId}>
            {/* Summary stats */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard
                title="Avg Visit Duration"
                value={`${j.avgVisitDuration} min`}
                icon={Clock}
              />
              <StatCard
                title="Avg Zones Visited"
                value={j.avgZonesVisited}
                icon={MapPin}
              />
            </div>

            {/* Flow + Top Paths */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Flow Diagram */}
              <div className="lg:col-span-3">
                <ChartCard title="Zone Flow" subtitle="Line thickness = transition volume">
                  <FlowDiagram transitions={j.transitions} />
                </ChartCard>
              </div>

              {/* Top Paths */}
              <div className="space-y-3 lg:col-span-2">
                <h3 className="font-semibold">Top Paths</h3>
                {j.topPaths.map((tp, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Path #{idx + 1}</span>
                      <Badge variant="outline">{tp.percentage}%</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-xs">
                      {tp.path.map((zone, zi) => (
                        <span key={zi} className="flex items-center gap-1">
                          <span className="rounded bg-accent px-2 py-0.5 font-medium">
                            {zone}
                          </span>
                          {zi < tp.path.length - 1 && (
                            <span className="text-muted-foreground">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Transitions Table */}
      <ChartCard title="All Transitions" subtitle={journey.storeName}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Avg Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {journey.transitions
              .sort((a, b) => b.count - a.count)
              .map((t, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Badge variant="outline">{t.fromZone}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.toZone}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{t.count}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {t.avgDurationSeconds}s
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
