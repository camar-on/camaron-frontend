"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Grid2X2,
  LayoutPanelLeft,
  Play,
  Check,
  X,
  Eye,
  Maximize2,
  Minimize2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getStoreById,
  getCamerasForStore,
  getAlertsForStore,
} from "@/data/mock";
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

const ruleTypeLabel: Record<AlertRuleType, string> = {
  person_detected: "Person",
  weapon: "Weapon",
  fire: "Fire",
  intrusion: "Intrusion",
  custom: "Custom",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

type Layout = "2x2" | "1+3";

export default function StoreMonitorPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const store = getStoreById(storeId);
  const storeCameras = getCamerasForStore(storeId);
  const storeAlerts = getAlertsForStore(storeId);

  const [layout, setLayout] = useState<Layout>("2x2");
  const [expandedCam, setExpandedCam] = useState<string | null>(null);
  const [selectedCamTab, setSelectedCamTab] = useState(
    storeCameras[0]?.id ?? ""
  );
  const [timelineValue, setTimelineValue] = useState([75]);

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(210,40%,98%)]">
        <p className="text-muted-foreground text-lg">Store not found.</p>
      </div>
    );
  }

  const onlineCount = storeCameras.filter((c) => c.status === "online").length;

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)] font-[family-name:var(--font-geist-sans)]">
      {/* Header ----------------------------------------------------- */}
      <header className="border-b bg-white px-8 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href={`/dashboard/stores/${storeId}`}
            className="hover:text-foreground transition-colors"
          >
            {store.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Monitor</span>
        </nav>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* LIVE indicator */}
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-200">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-live" />
              LIVE
            </span>
            <h1 className="text-xl font-semibold text-foreground">
              {store.name}
            </h1>
            <span className="text-sm text-muted-foreground">
              {onlineCount}/{storeCameras.length} cameras
            </span>
          </div>

          {/* Layout toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={layout === "2x2" ? "default" : "outline"}
              size="sm"
              onClick={() => setLayout("2x2")}
            >
              <Grid2X2 className="mr-1.5 h-3.5 w-3.5" />
              2x2
            </Button>
            <Button
              variant={layout === "1+3" ? "default" : "outline"}
              size="sm"
              onClick={() => setLayout("1+3")}
            >
              <LayoutPanelLeft className="mr-1.5 h-3.5 w-3.5" />
              1+3
            </Button>
          </div>
        </div>
      </header>

      {/* Main content: cameras + sidebar ---------------------------- */}
      <div className="flex">
        {/* Camera grid */}
        <div className="flex-1 p-6">
          {/* Expanded single camera */}
          {expandedCam ? (
            <div className="mb-4">
              {(() => {
                const cam = storeCameras.find((c) => c.id === expandedCam);
                if (!cam) return null;
                return (
                  <div className="relative rounded-xl bg-slate-900 aspect-video overflow-hidden border border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cam.thumbnailUrl ?? ""}
                      alt={cam.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                    {/* Overlay: camera name */}
                    <div className="absolute top-3 left-3 text-white text-sm font-medium bg-black/50 rounded px-2 py-0.5">
                      {cam.name}
                    </div>
                    {/* LIVE badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-live" />
                        LIVE
                      </span>
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                        <Play className="h-7 w-7 text-white ml-1" />
                      </div>
                    </div>
                    {/* Collapse */}
                    <button
                      onClick={() => setExpandedCam(null)}
                      className="absolute bottom-3 right-3 p-1.5 rounded bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })()}
            </div>
          ) : null}

          {/* Grid */}
          {!expandedCam && (
            <div
              className={
                layout === "2x2"
                  ? "grid grid-cols-2 gap-4"
                  : "grid grid-cols-3 gap-4"
              }
            >
              {storeCameras.map((cam, idx) => {
                const isMainIn1Plus3 = layout === "1+3" && idx === 0;
                return (
                  <div
                    key={cam.id}
                    className={`relative rounded-xl bg-slate-900 overflow-hidden border border-slate-700 cursor-pointer group ${
                      isMainIn1Plus3
                        ? "col-span-2 row-span-2 aspect-video"
                        : "aspect-video"
                    }`}
                    onClick={() => setExpandedCam(cam.id)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cam.thumbnailUrl ?? ""}
                      alt={cam.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    />
                    {/* Camera name */}
                    <div className="absolute top-3 left-3 text-white text-xs font-medium bg-black/50 rounded px-2 py-0.5">
                      {cam.name}
                    </div>
                    {/* LIVE badge */}
                    {cam.status === "online" && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1.5 rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-live" />
                          LIVE
                        </span>
                      </div>
                    )}
                    {cam.status === "offline" && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1.5 rounded bg-gray-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
                          OFFLINE
                        </span>
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-0.5" />
                      </div>
                    </div>
                    {/* Expand icon */}
                    <button className="absolute bottom-3 right-3 p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Camera tabs -------------------------------------------- */}
          <div className="mt-6">
            <Tabs
              value={selectedCamTab}
              onValueChange={setSelectedCamTab}
            >
              <TabsList>
                {storeCameras.map((cam) => (
                  <TabsTrigger key={cam.id} value={cam.id}>
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${
                        cam.status === "online" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {cam.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Timeline scrubber -------------------------------------- */}
          <div className="mt-6 bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                Timeline
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                20:45:00
              </span>
            </div>
            <Slider
              value={timelineValue}
              onValueChange={setTimelineValue}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
              <span>18:00</span>
              <span>19:00</span>
              <span>20:00</span>
              <span>21:00</span>
            </div>
          </div>
        </div>

        {/* Right sidebar: Live Alerts ------------------------------- */}
        <aside className="w-[320px] border-l bg-white">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold text-foreground text-sm">
              Live Alerts
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {storeAlerts.length} alerts from this store
            </p>
          </div>
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-4 space-y-3">
              {storeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border p-3 bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${statusDot[alert.status]}`}
                      />
                      <span className="text-xs font-medium text-foreground">
                        {ruleTypeLabel[alert.ruleType]}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {alert.cameraName} &middot; {Math.round(alert.confidence * 100)}% confidence
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Check className="mr-1 h-3 w-3" />
                      Ack
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <X className="mr-1 h-3 w-3" />
                      False
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
