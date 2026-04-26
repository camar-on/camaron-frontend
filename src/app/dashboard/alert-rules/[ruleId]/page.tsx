"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useDataset } from "@/lib/dataset-context";
import type { AlertRuleType } from "@/lib/types";

/* ── Constants ──────────────────────────────────────────────────── */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const typeOptions: { value: AlertRuleType; label: string }[] = [
  { value: "intrusion", label: "Intrusion" },
  { value: "weapon", label: "Weapon Detection" },
  { value: "fire", label: "Fire / Smoke" },
  { value: "person_detected", label: "Person Detected" },
  { value: "custom", label: "Custom" },
];

/* ── Helpers ────────────────────────────────────────────────────── */

function parseScheduleGrid(
  scheduleJson: Record<string, unknown>
): boolean[][] {
  const grid = DAYS.map(() => HOURS.map(() => false));

  if (scheduleJson.type === "always") {
    return DAYS.map(() => HOURS.map(() => true));
  }

  const startTime = scheduleJson.startTime as string | undefined;
  const endTime = scheduleJson.endTime as string | undefined;
  const days = (scheduleJson.days as string[] | undefined) ?? DAYS;

  if (!startTime || !endTime) return grid;

  const startH = parseInt(startTime.split(":")[0], 10);
  const endH = parseInt(endTime.split(":")[0], 10);

  days.forEach((day) => {
    const dayIdx = DAYS.findIndex(
      (d) => d.toLowerCase() === day.substring(0, 3).toLowerCase()
    );
    if (dayIdx === -1) return;

    if (startH <= endH) {
      for (let h = startH; h < endH; h++) grid[dayIdx][h] = true;
    } else {
      // Overnight range
      for (let h = startH; h < 24; h++) grid[dayIdx][h] = true;
      for (let h = 0; h < endH; h++) grid[dayIdx][h] = true;
    }
  });

  return grid;
}

/* ── Component ──────────────────────────────────────────────────── */

export default function AlertRuleEditPage() {
  const params = useParams();
  const ruleId = params.ruleId as string;
  const isNew = ruleId === "new";
  const { alertRules, cameras, stores, protocols } = useDataset();
  const existingRule =
    alertRules.find((r) => r.id === ruleId) ??
    alertRules[0] ?? {
      id: "",
      orgId: "",
      name: "",
      description: "",
      type: "custom" as const,
      confidenceThreshold: 0.5,
      cooldownSeconds: 60,
      scheduleJson: {},
      zoneConfigJson: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      cameras: [],
      camerasCount: 0,
      protocols: [],
      protocolsCount: 0,
    };
  void cameras; void stores; void protocols;

  /* form state */
  const [name, setName] = useState(isNew ? "" : existingRule.name);
  const [type, setType] = useState<AlertRuleType>(
    isNew ? "intrusion" : existingRule.type
  );
  const [description, setDescription] = useState(
    isNew ? "" : existingRule.description
  );
  const [confidence, setConfidence] = useState(
    isNew ? 75 : existingRule.confidenceThreshold
  );
  const [cooldown, setCooldown] = useState(
    isNew ? 300 : existingRule.cooldownSeconds
  );
  const [scheduleGrid, setScheduleGrid] = useState<boolean[][]>(
    parseScheduleGrid(isNew ? { type: "always" } : existingRule.scheduleJson)
  );
  const [selectedCameras, setSelectedCameras] = useState<Set<string>>(
    new Set(isNew ? [] : existingRule.cameras.map((c) => c.id))
  );
  const [selectedProtocols, setSelectedProtocols] = useState<
    Record<string, { enabled: boolean; delay: number }>
  >(() => {
    const map: Record<string, { enabled: boolean; delay: number }> = {};
    protocols.forEach((p) => {
      const linked = existingRule.protocols.find((lp) => lp.id === p.id);
      map[p.id] = { enabled: !isNew && !!linked, delay: 0 };
    });
    return map;
  });

  /* grouped cameras by store */
  const camerasByStore = useMemo(() => {
    const grouped = new Map<string, typeof cameras>();
    cameras.forEach((cam) => {
      const list = grouped.get(cam.storeId) || [];
      list.push(cam);
      grouped.set(cam.storeId, list);
    });
    return grouped;
  }, [cameras]);

  /* schedule toggle */
  const toggleScheduleCell = (dayIdx: number, hourIdx: number) => {
    setScheduleGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[dayIdx][hourIdx] = !next[dayIdx][hourIdx];
      return next;
    });
  };

  /* camera toggle */
  const toggleCamera = (camId: string) => {
    setSelectedCameras((prev) => {
      const next = new Set(prev);
      if (next.has(camId)) next.delete(camId);
      else next.add(camId);
      return next;
    });
  };

  /* protocol toggle */
  const toggleProtocol = (proId: string) => {
    setSelectedProtocols((prev) => ({
      ...prev,
      [proId]: { ...prev[proId], enabled: !prev[proId].enabled },
    }));
  };

  const setProtocolDelay = (proId: string, delay: number) => {
    setSelectedProtocols((prev) => ({
      ...prev,
      [proId]: { ...prev[proId], delay },
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Back link */}
        <Link
          href="/dashboard/alert-rules"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Alert Rules
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-8">
          {isNew ? "Create Alert Rule" : `Edit: ${existingRule.name}`}
        </h1>

        <div className="space-y-10">
          {/* ── Section 1: Basic Info ─────────────────────────────── */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Basic Info
            </h2>
            <div className="rounded-xl border bg-white p-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. After-Hours Intrusion"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as AlertRuleType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this rule detects..."
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* ── Section 2: Detection Settings ────────────────────── */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Detection Settings
            </h2>
            <div className="rounded-xl border bg-white p-5 space-y-6">
              {/* Confidence slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Confidence Threshold</Label>
                  <span className="text-sm font-medium text-foreground tabular-nums">
                    {confidence}%
                  </span>
                </div>
                <Slider
                  value={[confidence]}
                  onValueChange={([v]) => setConfidence(v)}
                  min={50}
                  max={95}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50% (more alerts)</span>
                  <span>95% (fewer alerts)</span>
                </div>
              </div>
              {/* Cooldown */}
              <div className="space-y-2">
                <Label htmlFor="cooldown">Cooldown (seconds)</Label>
                <Input
                  id="cooldown"
                  type="number"
                  min={10}
                  max={3600}
                  value={cooldown}
                  onChange={(e) =>
                    setCooldown(parseInt(e.target.value, 10) || 0)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Minimum time between repeated alerts from the same camera.
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 3: Schedule Grid ─────────────────────────── */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Schedule
            </h2>
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-muted-foreground mb-4">
                Click cells to toggle active hours. Green cells indicate when
                the rule is active.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-12 text-xs font-medium text-muted-foreground text-left pr-2 pb-1">
                        Day
                      </th>
                      {HOURS.map((h) => (
                        <th
                          key={h}
                          className="text-[10px] font-normal text-muted-foreground text-center pb-1 px-0"
                          style={{ minWidth: 18 }}
                        >
                          {h % 6 === 0 ? `${h}h` : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day, dayIdx) => (
                      <tr key={day}>
                        <td className="text-xs font-medium text-muted-foreground pr-2 py-0.5">
                          {day}
                        </td>
                        {HOURS.map((_, hourIdx) => (
                          <td key={hourIdx} className="p-0">
                            <button
                              type="button"
                              onClick={() =>
                                toggleScheduleCell(dayIdx, hourIdx)
                              }
                              className={`block w-full h-5 border border-border/40 transition-colors ${
                                scheduleGrid[dayIdx][hourIdx]
                                  ? "bg-primary/30"
                                  : "bg-muted/30 hover:bg-muted/60"
                              }`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── Section 4: Assigned Cameras ──────────────────────── */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Assigned Cameras
            </h2>
            <div className="rounded-xl border bg-white p-5 space-y-5">
              {Array.from(camerasByStore.entries()).map(
                ([storeId, storeCameras]) => {
                  const store = stores.find((s) => s.id === storeId);
                  return (
                    <div key={storeId}>
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        {store?.name ?? storeId}
                      </h4>
                      <div className="space-y-2">
                        {storeCameras.map((cam) => (
                          <label
                            key={cam.id}
                            className="flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCameras.has(cam.id)}
                              onChange={() => toggleCamera(cam.id)}
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-foreground">
                                {cam.name}
                              </span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {cam.resolution} / {cam.fpsTarget} fps
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                cam.status === "online"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                              }
                            >
                              {cam.status}
                            </Badge>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {/* ── Section 5: Protocols ─────────────────────────────── */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Protocols
            </h2>
            <div className="rounded-xl border bg-white p-5 space-y-3">
              {protocols.map((proto) => {
                const state = selectedProtocols[proto.id];
                return (
                  <div
                    key={proto.id}
                    className="flex items-center gap-4 rounded-lg border px-4 py-3"
                  >
                    <Switch
                      checked={state?.enabled ?? false}
                      onCheckedChange={() => toggleProtocol(proto.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {proto.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {proto.type.replace("_", " ")}
                      </p>
                    </div>
                    {state?.enabled && (
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground whitespace-nowrap">
                          Delay (s)
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          max={600}
                          value={state.delay}
                          onChange={(e) =>
                            setProtocolDelay(
                              proto.id,
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Actions ──────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-8">
            <Button variant="outline" asChild>
              <Link href="/dashboard/alert-rules">Cancel</Link>
            </Button>
            <Button>{isNew ? "Create Rule" : "Save Changes"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
