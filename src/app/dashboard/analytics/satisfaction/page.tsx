"use client";

import { useState } from "react";
import { Smile } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { npsData, surveyResponses } from "@/data/mock";

const DONUT_COLORS = [
  "hsl(var(--chart-1))", // promoters
  "hsl(var(--chart-4))", // passives
  "hsl(var(--chart-5))", // detractors
];

const channelBadge = {
  qr: "bg-blue-50 text-blue-700 border-blue-200",
  email: "bg-purple-50 text-purple-700 border-purple-200",
  sms: "bg-orange-50 text-orange-700 border-orange-200",
};

function npsColor(score: number) {
  if (score >= 50) return "text-green-600";
  if (score >= 0) return "text-yellow-600";
  return "text-red-600";
}

function scoreColor(score: number) {
  if (score >= 9) return "bg-green-50 text-green-700 border-green-200";
  if (score >= 7) return "bg-yellow-50 text-yellow-700 border-yellow-200";
  return "bg-red-50 text-red-700 border-red-200";
}

export default function SatisfactionPage() {
  const [view, setView] = useState<"overview" | "responses">("overview");

  // Aggregate NPS
  const totalPromoters = npsData.reduce((s, n) => s + n.promoters, 0);
  const totalPassives = npsData.reduce((s, n) => s + n.passives, 0);
  const totalDetractors = npsData.reduce((s, n) => s + n.detractors, 0);
  const totalResponses = totalPromoters + totalPassives + totalDetractors;
  const overallNPS = Math.round(
    ((totalPromoters - totalDetractors) / totalResponses) * 100
  );

  const donutData = [
    { name: "Promoters", value: totalPromoters },
    { name: "Passives", value: totalPassives },
    { name: "Detractors", value: totalDetractors },
  ];

  // Trend data: combine all stores
  const months = npsData[0].trend.map((t) => t.month);
  const trendData = months.map((month) => {
    const entry: Record<string, string | number> = { month };
    npsData.forEach((n) => {
      const point = n.trend.find((t) => t.month === month);
      entry[n.storeName] = point?.nps ?? 0;
    });
    return entry;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Satisfaction</h1>
          <p className="text-sm text-muted-foreground">NPS scores and survey feedback</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as "overview" | "responses")}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "overview" ? (
        <>
          {/* Overall NPS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col items-center justify-center p-6">
              <p className="text-sm text-muted-foreground">Overall NPS</p>
              <p className={`text-5xl font-bold ${npsColor(overallNPS)}`}>{overallNPS}</p>
              <p className="mt-1 text-xs text-muted-foreground">{totalResponses} responses</p>
            </Card>

            {npsData.map((n) => (
              <StatCard
                key={n.storeId}
                title={n.storeName}
                value={n.npsScore}
                icon={Smile}
                trend={{
                  value: n.trend.length >= 2 ? n.trend[n.trend.length - 1].nps - n.trend[n.trend.length - 2].nps : 0,
                  label: "vs last month",
                }}
              />
            ))}
          </div>

          {/* Donut + NPS Trend */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Response Breakdown" subtitle="All stores combined">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {donutData.map((_, idx) => (
                      <Cell key={idx} fill={DONUT_COLORS[idx]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="NPS Trend" subtitle="Last 6 months by store">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(m: string) => m.slice(5)}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Legend />
                  {npsData.map((n, i) => (
                    <Line
                      key={n.storeId}
                      type="monotone"
                      dataKey={n.storeName}
                      stroke={`hsl(var(--chart-${i + 1}))`}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      ) : (
        /* Responses Table */
        <ChartCard title="Recent Survey Responses" subtitle={`${surveyResponses.length} responses`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveyResponses.map((sr) => (
                <TableRow key={sr.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {new Date(sr.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{sr.storeName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={scoreColor(sr.score)}>
                      {sr.score}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={channelBadge[sr.channel]}>
                      {sr.channel.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                    {sr.comment ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>
      )}
    </div>
  );
}
