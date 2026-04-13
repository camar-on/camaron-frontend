"use client";

import { useState } from "react";
import { Users, Clock, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatCard } from "@/components/analytics/StatCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { trafficByStore, dailyTraffic } from "@/data/mock";

export default function TrafficPage() {
  const [selectedStore, setSelectedStore] = useState(trafficByStore[0].storeId);
  const store = trafficByStore.find((t) => t.storeId === selectedStore) ?? trafficByStore[0];
  const changeVsYesterday = store.yesterdayVisitors
    ? Math.round(((store.todayVisitors - store.yesterdayVisitors) / store.yesterdayVisitors) * 1000) / 10
    : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Foot Traffic</h1>
        <p className="text-sm text-muted-foreground">
          Camera-based people counting and visitor trends
        </p>
      </div>

      {/* Store selector */}
      <Tabs value={selectedStore} onValueChange={setSelectedStore}>
        <TabsList>
          {trafficByStore.map((t) => (
            <TabsTrigger key={t.storeId} value={t.storeId}>
              {t.storeName}
            </TabsTrigger>
          ))}
        </TabsList>

        {trafficByStore.map((t) => (
          <TabsContent key={t.storeId} value={t.storeId}>
            {/* KPI Cards */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                title="Today's Visitors"
                value={t.todayVisitors.toLocaleString()}
                icon={Users}
                trend={{ value: changeVsYesterday, label: "vs yesterday" }}
              />
              <StatCard
                title="Peak Hour"
                value={t.peakHour}
                icon={Clock}
              />
              <StatCard
                title="Weekly Average"
                value={t.weeklyAvg.toLocaleString()}
                icon={TrendingUp}
              />
            </div>

            {/* Hourly Chart */}
            <div className="mt-6">
              <ChartCard
                title="Hourly Entries vs Exits"
                subtitle={`${t.storeName} — Today`}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={t.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="entries"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={false}
                      name="Entries"
                    />
                    <Line
                      type="monotone"
                      dataKey="exits"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={false}
                      name="Exits"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Daily trend (all stores) */}
      <ChartCard title="Daily Visitors" subtitle="Last 30 days — All stores">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyTraffic.slice().reverse()}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tickFormatter={(d: string) => d.slice(5)}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="visitors" fill="hsl(var(--chart-1))" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
