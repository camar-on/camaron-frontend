"use client";

import Link from "next/link";
import {
  Camera,
  ShieldAlert,
  Store,
  WifiOff,
  Eye,
  Monitor,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDataset } from "@/lib/dataset-context";
import type { AlertEventStatus, AlertRuleType } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const statusColor: Record<AlertEventStatus, { dot: string; bg: string; text: string }> = {
  triggered:    { dot: "bg-red-500",    bg: "bg-red-50",    text: "text-red-700" },
  acknowledged: { dot: "bg-yellow-500", bg: "bg-yellow-50", text: "text-yellow-700" },
  resolved:     { dot: "bg-green-500",  bg: "bg-green-50",  text: "text-green-700" },
  false_alarm:  { dot: "bg-gray-400",   bg: "bg-gray-100",  text: "text-gray-600" },
};

const ruleTypeLabel: Record<AlertRuleType, string> = {
  person_detected: "Person",
  weapon: "Weapon",
  fire: "Fire",
  intrusion: "Intrusion",
  custom: "Custom",
};

const ruleTypeBadge: Record<AlertRuleType, string> = {
  person_detected: "bg-blue-50 text-blue-700 border-blue-200",
  weapon: "bg-red-50 text-red-700 border-red-200",
  fire: "bg-orange-50 text-orange-700 border-orange-200",
  intrusion: "bg-purple-50 text-purple-700 border-purple-200",
  custom: "bg-slate-50 text-slate-700 border-slate-200",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const {
    currentUser,
    dashboardStats,
    alertEvents,
    stores,
    getCamerasForStore,
  } = useDataset();
  const recentAlerts = alertEvents.slice(0, 8);

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)] p-8 font-[family-name:var(--font-geist-sans)]">
      {/* Greeting --------------------------------------------------- */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">
          {getGreeting()}, {currentUser.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is what is happening across your stores today.
        </p>
      </div>

      {/* Stat cards ------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {/* Cameras Online */}
        <Card className="border bg-white rounded-xl p-6 shadow-none border-l-4 border-l-green-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Camera className="h-5 w-5 text-green-600" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {dashboardStats.camerasOnline}
            <span className="text-lg font-normal text-muted-foreground">
              /{dashboardStats.camerasTotal}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Cameras Online</p>
        </Card>

        {/* Stores Active */}
        <Card className="border bg-white rounded-xl p-6 shadow-none border-l-4 border-l-blue-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Store className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {dashboardStats.storesActive}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Stores Active</p>
        </Card>

        {/* Alerts Today */}
        <Card className="border bg-white rounded-xl p-6 shadow-none border-l-4 border-l-orange-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <ShieldAlert className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {dashboardStats.alertsToday}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Alerts Today</p>
        </Card>

        {/* Offline Cameras */}
        <Card className="border bg-white rounded-xl p-6 shadow-none border-l-4 border-l-red-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <WifiOff className="h-5 w-5 text-red-500" />
            </div>
            {dashboardStats.offlineCameras > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs text-yellow-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                Warning
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-foreground">
            {dashboardStats.offlineCameras}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Offline Cameras</p>
        </Card>
      </div>

      {/* Recent Alerts ---------------------------------------------- */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Alerts
          </h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <Card className="border bg-white rounded-xl shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Camera</TableHead>
                <TableHead className="text-right w-[100px]">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAlerts.map((alert) => {
                const sc = statusColor[alert.status];
                return (
                  <TableRow key={alert.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatTime(alert.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {alert.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${ruleTypeBadge[alert.ruleType]}`}
                      >
                        {ruleTypeLabel[alert.ruleType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{alert.storeName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {alert.cameraName}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {Math.round(alert.confidence * 100)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Store Status ----------------------------------------------- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Store Status
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => {
            const storeCams = getCamerasForStore(store.id);
            const onlineCount = storeCams.filter(
              (c) => c.status === "online"
            ).length;
            const allOnline = onlineCount === storeCams.length;
            const noneOnline = onlineCount === 0;

            let indicator = "bg-green-500";
            if (noneOnline) indicator = "bg-red-500";
            else if (!allOnline) indicator = "bg-yellow-500";

            return (
              <Card
                key={store.id}
                className="border bg-white rounded-xl shadow-none p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${indicator}`}
                      />
                      <h3 className="font-semibold text-foreground">
                        {store.name}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {store.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-5 text-sm">
                  <div>
                    <span className="font-medium text-foreground">
                      {onlineCount}/{storeCams.length}
                    </span>{" "}
                    <span className="text-muted-foreground">cameras online</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      {store.alertsToday}
                    </span>{" "}
                    <span className="text-muted-foreground">alerts today</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/stores/${store.id}`}>
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/stores/${store.id}/monitor`}>
                      <Monitor className="mr-1.5 h-3.5 w-3.5" />
                      Monitor
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
