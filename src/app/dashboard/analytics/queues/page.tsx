"use client";

import { useState } from "react";
import { Users, Clock, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/analytics/StatCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { queuePoints } from "@/data/mock";

const statusStyle = {
  normal: { dot: "bg-green-500", badge: "border-green-200 bg-green-50 text-green-700" },
  busy: { dot: "bg-yellow-500", badge: "border-yellow-200 bg-yellow-50 text-yellow-700" },
  critical: { dot: "bg-red-500", badge: "border-red-200 bg-red-50 text-red-700" },
};

export default function QueuesPage() {
  const [selectedQueue, setSelectedQueue] = useState(queuePoints[0].id);
  const activeQueue = queuePoints.find((q) => q.id === selectedQueue) ?? queuePoints[0];

  const avgWait = Math.round(queuePoints.reduce((s, q) => s + q.avgWaitMinutes, 0) / queuePoints.length * 10) / 10;
  const criticalCount = queuePoints.filter((q) => q.status === "critical").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Queue Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Real-time camera-detected queue monitoring
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Active Queue Points"
          value={queuePoints.length}
          icon={Users}
        />
        <StatCard
          title="Avg Wait Time"
          value={`${avgWait} min`}
          icon={Clock}
        />
        <StatCard
          title="Critical Alerts"
          value={criticalCount}
          icon={AlertTriangle}
          className={criticalCount > 0 ? "border-destructive/30" : ""}
        />
      </div>

      {/* Queue Point Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {queuePoints.map((q) => {
          const style = statusStyle[q.status];
          const isSelected = q.id === selectedQueue;
          return (
            <Card
              key={q.id}
              className={`cursor-pointer p-4 transition-colors ${
                isSelected ? "ring-2 ring-primary" : "hover:bg-accent/50"
              }`}
              onClick={() => setSelectedQueue(q.id)}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  <span className="font-medium text-sm">{q.name}</span>
                </div>
                <Badge variant="outline" className={style.badge}>
                  {q.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{q.storeName}</p>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Queue length</span>
                  <span className="font-semibold">{q.currentLength}</span>
                </div>
                <Progress value={Math.min(100, (q.currentLength / 15) * 100)} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Avg wait: {q.avgWaitMinutes} min</span>
                  <span>Max: {q.maxWaitMinutes} min</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Queue Length Over Time */}
        <ChartCard
          title="Queue Length Over Time"
          subtitle={`${activeQueue.name} — ${activeQueue.storeName}`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...activeQueue.snapshots].reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(t: string) =>
                  new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                labelFormatter={(t) =>
                  new Date(String(t)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              />
              <Line
                type="monotone"
                dataKey="queueLength"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Queue Length"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Wait Time Comparison */}
        <ChartCard title="Avg Wait Time by Point" subtitle="All queue points">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={queuePoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" unit=" min" />
              <Tooltip />
              <Bar dataKey="avgWaitMinutes" name="Avg Wait (min)" radius={[4, 4, 0, 0]}>
                {queuePoints.map((q) => (
                  <rect
                    key={q.id}
                    fill={
                      q.status === "critical"
                        ? "hsl(var(--chart-5))"
                        : q.status === "busy"
                        ? "hsl(var(--chart-4))"
                        : "hsl(var(--chart-1))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
