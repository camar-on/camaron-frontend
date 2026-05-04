"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  Clock,
  ChevronRight,
  Settings,
  Play,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDataset } from "@/lib/dataset-context";
import { CameraPlayer } from "@/components/video/CameraPlayer";
import type { AlertEventStatus, AlertRuleType } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatBusinessHours(
  bh: Record<string, { open: string; close: string }>
): string {
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const entry = bh[today];
  if (!entry || (entry.open === "00:00" && entry.close === "00:00"))
    return "Closed today";
  return `${entry.open} - ${entry.close}`;
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

export default function StoreDetailPage() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("id") ?? "";
  const {
    stores,
    getCamerasForStore,
    getAlertsForStore,
    getRulesForStore,
    isLoading,
    isSeedMode,
  } = useDataset();
  const store = stores.find((s) => s.id === storeId);
  const storeCameras = getCamerasForStore(storeId);
  const storeAlerts = getAlertsForStore(storeId).slice(0, 10);
  const storeRules = getRulesForStore(storeId);

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(210,40%,98%)]">
        <p className="text-muted-foreground text-lg">
          {isLoading && isSeedMode
            ? "Loading store…"
            : "Store not found."}
        </p>
      </div>
    );
  }

  const onlineCount = storeCameras.filter((c) => c.status === "online").length;

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)] p-8 font-[family-name:var(--font-geist-sans)]">
      {/* Breadcrumb ------------------------------------------------- */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Stores
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{store.name}</span>
      </nav>

      {/* Store header ------------------------------------------------ */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground mb-3">
          {store.name}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {store.address}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Today: {formatBusinessHours(store.businessHours)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                onlineCount === storeCameras.length
                  ? "bg-green-500"
                  : onlineCount === 0
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            />
            {onlineCount}/{storeCameras.length} cameras online
          </span>
        </div>
      </div>

      {/* Cameras ---------------------------------------------------- */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-6">Cameras</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {storeCameras.map((cam) => (
            <Card
              key={cam.id}
              className="border bg-white rounded-xl shadow-none overflow-hidden"
            >
              {/* Live stream */}
              <div className="relative">
                <CameraPlayer rtspUrl={cam.rtspUrl} label={cam.name} />
                <div className="absolute top-3 right-3">
                  <Badge
                    className={`text-xs font-medium border ${
                      cam.status === "online"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${
                        cam.status === "online" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {cam.status}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{cam.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {cam.rulesCount} rule{cam.rulesCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Settings className="mr-1.5 h-3.5 w-3.5" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dashboard/stores/detail/monitor?id=${storeId}`}
                    >
                      <Play className="mr-1.5 h-3.5 w-3.5" />
                      Watch
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Alert Rules Applied ---------------------------------------- */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Alert Rules Applied
        </h2>
        <Card className="border bg-white rounded-xl shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Rule</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cameras</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-right">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storeRules.map((rule) => {
                const schedule = rule.scheduleJson as {
                  days?: string[];
                  startTime?: string;
                  endTime?: string;
                };
                const camerasInStore = rule.cameras.filter(
                  (c) => c.storeId === storeId
                );
                return (
                  <TableRow key={rule.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {rule.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {rule.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${ruleTypeBadge[rule.type]}`}
                      >
                        {ruleTypeLabel[rule.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {camerasInStore.map((c) => c.name).join(", ")}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {schedule.days?.join(", ") ?? "All days"}
                      <br />
                      {schedule.startTime} - {schedule.endTime}
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={rule.isActive}
                        aria-label={`Toggle ${rule.name}`}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Recent Alerts ---------------------------------------------- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Alerts
          </h2>
          <span className="text-sm text-muted-foreground">
            Last {storeAlerts.length} alerts
          </span>
        </div>
        <Card className="border bg-white rounded-xl shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Camera</TableHead>
                <TableHead className="text-right w-[100px]">
                  Confidence
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storeAlerts.map((alert) => {
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
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${sc.dot}`}
                        />
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
    </div>
  );
}
