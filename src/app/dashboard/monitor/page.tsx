"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Monitor,
  Check,
  X,
  Eye,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    second: "2-digit",
    hour12: true,
  });
}

const statusDot: Record<AlertEventStatus, string> = {
  triggered: "bg-red-500",
  acknowledged: "bg-yellow-500",
  resolved: "bg-green-500",
  false_alarm: "bg-gray-400",
};

const statusBg: Record<AlertEventStatus, { bg: string; text: string }> = {
  triggered:    { bg: "bg-red-50",    text: "text-red-700" },
  acknowledged: { bg: "bg-yellow-50", text: "text-yellow-700" },
  resolved:     { bg: "bg-green-50",  text: "text-green-700" },
  false_alarm:  { bg: "bg-gray-100",  text: "text-gray-600" },
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

export default function MultiStoreMonitorPage() {
  const { stores, alertEvents, getCamerasForStore } = useDataset();
  const [selectedStoreIds, setSelectedStoreIds] = useState<Set<string>>(
    new Set(stores.map((s) => s.id))
  );

  useEffect(() => {
    setSelectedStoreIds(new Set(stores.map((s) => s.id)));
  }, [stores]);

  function toggleStore(storeId: string) {
    setSelectedStoreIds((prev) => {
      const next = new Set(prev);
      if (next.has(storeId)) {
        next.delete(storeId);
      } else {
        next.add(storeId);
      }
      return next;
    });
  }

  const filteredStores = stores.filter((s) => selectedStoreIds.has(s.id));

  const unifiedAlerts = alertEvents
    .filter((a) => selectedStoreIds.has(a.storeId))
    .slice(0, 15);

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)] font-[family-name:var(--font-geist-sans)]">
      {/* Header ----------------------------------------------------- */}
      <header className="border-b bg-white px-8 py-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Monitor Center</span>
        </nav>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Monitor className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Monitor Center
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitoring {filteredStores.length} store
                {filteredStores.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Select Stores */}
          <div className="flex items-center gap-2">
            {stores.map((s) => {
              const active = selectedStoreIds.has(s.id);
              return (
                <Button
                  key={s.id}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleStore(s.id)}
                >
                  {s.name.replace("Sucursal ", "")}
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main content ---------------------------------------------- */}
        <div className="flex-1 p-6 space-y-8">
          {filteredStores.map((store) => {
            const storeCams = getCamerasForStore(store.id);
            const onlineCount = storeCams.filter(
              (c) => c.status === "online"
            ).length;

            return (
              <section key={store.id}>
                {/* Store label */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        onlineCount === storeCams.length
                          ? "bg-green-500"
                          : onlineCount === 0
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <h2 className="font-semibold text-foreground">
                      {store.name}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {onlineCount}/{storeCams.length} online
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/stores/${store.id}/monitor`}>
                      Open full view
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>

                {/* Live camera grid */}
                <div className="grid grid-cols-4 gap-3">
                  {storeCams.map((cam) => (
                    <CameraPlayer
                      key={cam.id}
                      rtspUrl={cam.rtspUrl}
                      label={cam.name}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Right sidebar: Unified Alerts Feed ----------------------- */}
        <aside className="w-[340px] border-l bg-white">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold text-foreground text-sm">
              Unified Alerts Feed
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              All stores &middot; {unifiedAlerts.length} recent
            </p>
          </div>
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="p-4 space-y-3">
              {unifiedAlerts.map((alert) => {
                const sc = statusBg[alert.status];
                return (
                  <div
                    key={alert.id}
                    className="rounded-lg border p-3 bg-white hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${statusDot[alert.status]}`}
                        />
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium ${ruleTypeBadge[alert.ruleType]}`}
                        >
                          {ruleTypeLabel[alert.ruleType]}
                        </Badge>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-foreground">
                        {alert.storeName}
                      </span>{" "}
                      &middot; {alert.cameraName}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${sc.bg} ${sc.text}`}
                      >
                        {alert.status.replace("_", " ")}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {Math.round(alert.confidence * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                      >
                        <Eye className="mr-0.5 h-2.5 w-2.5" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                      >
                        <Check className="mr-0.5 h-2.5 w-2.5" />
                        Ack
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                      >
                        <X className="mr-0.5 h-2.5 w-2.5" />
                        False
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
