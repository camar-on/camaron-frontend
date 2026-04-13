"use client";

import Link from "next/link";
import {
  Users,
  TrendingUp,
  Smile,
  AlertTriangle,
  Clock,
  Building2,
} from "lucide-react";
import {
  AreaChart,
  Area,
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
import { analyticsSummary, trafficByStore, storePerformances } from "@/data/mock";

export default function AnalyticsOverviewPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Retail Analytics</h1>
        <p className="text-sm text-muted-foreground">
          AI-powered insights from your camera network
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Visitors Today"
          value={analyticsSummary.totalVisitorsToday.toLocaleString()}
          icon={Users}
          trend={{ value: 6.9, label: "vs yesterday" }}
        />
        <StatCard
          title="Avg Conversion"
          value={`${analyticsSummary.avgConversionRate}%`}
          icon={TrendingUp}
          trend={{ value: 2.1, label: "vs last week" }}
        />
        <StatCard
          title="Avg NPS"
          value={analyticsSummary.avgNPS}
          icon={Smile}
          trend={{ value: 4, label: "vs last month" }}
        />
        <StatCard
          title="Critical Queues"
          value={analyticsSummary.criticalQueues}
          icon={AlertTriangle}
          className={analyticsSummary.criticalQueues > 0 ? "border-destructive/30" : ""}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Visitor Trend */}
        <ChartCard title="Weekly Visitors" subtitle="Last 7 days">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analyticsSummary.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => d.slice(5)}
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <defs>
                <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="hsl(var(--chart-1))"
                fill="url(#visitorsGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visitors by Store */}
        <ChartCard title="Visitors by Store" subtitle="Today">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trafficByStore}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="storeName"
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(n: string) => n.replace("Sucursal ", "")}
              />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="todayVisitors" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Today" />
              <Bar dataKey="yesterdayVisitors" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Yesterday" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-4">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Busiest Store</p>
            <p className="font-semibold">{analyticsSummary.busiestStore}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Peak Hour</p>
            <p className="font-semibold">{analyticsSummary.busiestHour}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Avg Dwell Time</p>
            <p className="font-semibold">{analyticsSummary.avgDwellTime} min</p>
          </div>
        </Card>
      </div>

      {/* Store Performance Table */}
      <ChartCard title="Store Performance" subtitle="Today's metrics">
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
                <TableCell>
                  <Link
                    href={`/dashboard/analytics/performance`}
                    className="font-medium hover:underline"
                  >
                    {sp.storeName}
                  </Link>
                </TableCell>
                <TableCell className="text-right">{sp.visitors.toLocaleString()}</TableCell>
                <TableCell className="text-right">{sp.transactions}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      sp.conversionRate >= 40
                        ? "border-green-200 bg-green-50 text-green-700"
                        : sp.conversionRate >= 30
                        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }
                  >
                    {sp.conversionRate}%
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
