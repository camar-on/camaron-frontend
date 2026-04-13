"use client";

import { Users, ShoppingCart, TrendingUp, Clock } from "lucide-react";
import {
  ComposedChart,
  BarChart as RBarChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
import { storePerformances } from "@/data/mock";

export default function PerformancePage() {
  const totalVisitors = storePerformances.reduce((s, p) => s + p.visitors, 0);
  const totalTransactions = storePerformances.reduce((s, p) => s + p.transactions, 0);
  const avgConversion = Math.round((totalTransactions / totalVisitors) * 1000) / 10;
  const avgDwell = Math.round(storePerformances.reduce((s, p) => s + p.avgDwellTime, 0) / storePerformances.length);

  // Use first store's daily data for the composed chart
  const composedData = storePerformances[0].dailyData.slice().reverse();

  // Conversion rate trend (all stores combined daily data averaged)
  const conversionTrend = storePerformances[0].dailyData
    .slice()
    .reverse()
    .map((d, i) => {
      const avgRate =
        storePerformances.reduce((s, p) => s + (p.dailyData[p.dailyData.length - 1 - i]?.conversionRate ?? 0), 0) /
        storePerformances.length;
      return { date: d.date, conversionRate: Math.round(avgRate * 10) / 10 };
    });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Store Performance</h1>
        <p className="text-sm text-muted-foreground">
          Conversion rates, dwell time, and store benchmarking
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visitors"
          value={totalVisitors.toLocaleString()}
          icon={Users}
          trend={{ value: 5.2, label: "vs last week" }}
        />
        <StatCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          icon={ShoppingCart}
          trend={{ value: 3.8, label: "vs last week" }}
        />
        <StatCard
          title="Avg Conversion"
          value={`${avgConversion}%`}
          icon={TrendingUp}
        />
        <StatCard
          title="Avg Dwell Time"
          value={`${avgDwell} min`}
          icon={Clock}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Visitors + Conversion Composed Chart */}
        <ChartCard
          title="Visitors & Conversion"
          subtitle={`${storePerformances[0].storeName} — Last 14 days`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={composedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => d.slice(5)}
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis yAxisId="left" fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" fontSize={12} stroke="hsl(var(--muted-foreground))" unit="%" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="visitors" fill="hsl(var(--chart-1))" radius={[3, 3, 0, 0]} name="Visitors" />
              <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="hsl(var(--chart-5))" strokeWidth={2} name="Conversion %" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Conversion Rate Trend */}
        <ChartCard title="Conversion Rate Trend" subtitle="All stores avg — Last 14 days">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={conversionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => d.slice(5)}
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" unit="%" />
              <Tooltip />
              <defs>
                <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="conversionRate"
                stroke="hsl(var(--chart-3))"
                fill="url(#convGrad)"
                strokeWidth={2}
                name="Conversion %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Store Comparison */}
      <ChartCard title="Store Benchmarking" subtitle="Visitors & Transactions comparison">
        <ResponsiveContainer width="100%" height={300}>
          <RBarChart data={storePerformances}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="storeName"
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(n: string) => n.replace("Sucursal ", "")}
            />
            <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Legend />
            <Bar dataKey="visitors" fill="hsl(var(--chart-1))" radius={[3, 3, 0, 0]} name="Visitors" />
            <Bar dataKey="transactions" fill="hsl(var(--chart-2))" radius={[3, 3, 0, 0]} name="Transactions" />
          </RBarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Benchmarking Table */}
      <ChartCard title="Detailed Metrics" subtitle="All stores">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Transactions</TableHead>
              <TableHead className="text-right">Conversion</TableHead>
              <TableHead className="text-right">Dwell Time</TableHead>
              <TableHead className="text-right">Rev / Visitor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storePerformances.map((sp) => (
              <TableRow key={sp.storeId}>
                <TableCell className="font-medium">{sp.storeName}</TableCell>
                <TableCell className="text-right">{sp.visitors.toLocaleString()}</TableCell>
                <TableCell className="text-right">{sp.transactions}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      sp.conversionRate >= avgConversion
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }
                  >
                    {sp.conversionRate}%
                    {sp.conversionRate >= avgConversion ? " ▲" : " ▼"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{sp.avgDwellTime} min</TableCell>
                <TableCell className="text-right">${sp.revenuePerVisitor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
