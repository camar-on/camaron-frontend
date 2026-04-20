"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Crosshair,
  Flame,
  Eye,
  Plus,
  Pencil,
  Clock,
  Gauge,
  Timer,
  Camera,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useDataset } from "@/lib/dataset-context";
import type { AlertRuleType } from "@/lib/types";

/* ── Helpers ────────────────────────────────────────────────────── */

const ruleTypeConfig: Record<
  AlertRuleType,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  intrusion: {
    label: "Intrusion",
    icon: Shield,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  weapon: {
    label: "Weapon",
    icon: Crosshair,
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  fire: {
    label: "Fire",
    icon: Flame,
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
  },
  person_detected: {
    label: "Person",
    icon: Eye,
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  custom: {
    label: "Custom",
    icon: Eye,
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

function formatSchedule(scheduleJson: Record<string, unknown>): string {
  if (scheduleJson.type === "always") return "24/7 - Always active";
  const start = scheduleJson.startTime as string;
  const end = scheduleJson.endTime as string;
  const days = scheduleJson.days as string[] | undefined;
  const dayCount = days?.length ?? 7;
  return `${start} - ${end} / ${dayCount === 7 ? "Every day" : `${dayCount} days/week`}`;
}

function getStoreCount(
  cameraIds: string[],
  allCameras: { id: string; storeId: string }[],
): number {
  const storeIds = new Set(
    allCameras
      .filter((c) => cameraIds.includes(c.id))
      .map((c) => c.storeId),
  );
  return storeIds.size;
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function AlertRulesPage() {
  const { alertRules, cameras } = useDataset();
  const [rules, setRules] = useState(alertRules);
  useEffect(() => { setRules(alertRules); }, [alertRules]);

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Alert Rules
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure detection rules and assign them to cameras.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/alert-rules/new">
              <Plus className="mr-2 h-4 w-4" />
              New Rule
            </Link>
          </Button>
        </div>

        {/* Rule cards */}
        <div className="space-y-4">
          {rules.map((rule) => {
            const config = ruleTypeConfig[rule.type];
            const Icon = config.icon;
            const cameraIds = rule.cameras.map((c) => c.id);
            const storeCount = getStoreCount(cameraIds, cameras);

            return (
              <div
                key={rule.id}
                className="rounded-xl border bg-white p-5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {/* Title row */}
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {rule.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={config.badgeClass}
                      >
                        {config.label}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {rule.description}
                    </p>

                    {/* Details row */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {formatSchedule(rule.scheduleJson)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5" />
                        Confidence: {rule.confidenceThreshold}%
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5" />
                        Cooldown: {rule.cooldownSeconds}s
                      </span>
                    </div>

                    {/* Applied to / Protocols */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Camera className="h-3.5 w-3.5" />
                        Applied to: {rule.camerasCount} cameras across{" "}
                        {storeCount} {storeCount === 1 ? "store" : "stores"}
                      </span>
                      {rule.protocols.length > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Store className="h-3.5 w-3.5" />
                          Protocols:{" "}
                          {rule.protocols.map((p) => p.name).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {rule.isActive ? "Active" : "Disabled"}
                      </span>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/alert-rules/${rule.id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
