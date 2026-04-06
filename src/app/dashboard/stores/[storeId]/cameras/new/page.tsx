"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Wifi,
  Search,
  CheckCircle2,
  Loader2,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stores, cameraTemplates } from "@/data/mock";
import type { CameraTemplate } from "@/lib/types";

/* ── Page ────────────────────────────────────────────────────────── */

export default function AddCameraPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const store = stores.find((s) => s.id === storeId);
  const storeName = store?.name ?? "Unknown Store";

  /* Form state */
  const [cameraName, setCameraName] = useState("");
  const [connectionMethod, setConnectionMethod] = useState<
    "rtsp" | "discover"
  >("rtsp");
  const [rtspUrl, setRtspUrl] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [templateFields, setTemplateFields] = useState({
    ip: "",
    user: "admin",
    password: "",
    channel: "1",
    streamQuality: "main",
  });
  const [targetFps, setTargetFps] = useState("3");

  /* Connection test state */
  const [testState, setTestState] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  /* Select brand template */
  const handleSelectTemplate = (brand: string) => {
    const template = cameraTemplates.find((t) => t.brand === brand);
    if (!template) return;
    setSelectedBrand(brand);
    setTemplateFields({
      ip: "",
      user: template.defaultUser,
      password: template.defaultPassword,
      channel: template.defaultChannel,
      streamQuality: template.streamQualities[0] || "main",
    });
  };

  /* Build RTSP URL from template */
  const buildRtspUrl = (template: CameraTemplate): string => {
    return template.urlTemplate
      .replace("{user}", templateFields.user)
      .replace("{password}", templateFields.password)
      .replace("{ip}", templateFields.ip || "192.168.1.100")
      .replace("{channel}", templateFields.channel);
  };

  /* Simulate connection test */
  const testConnection = () => {
    setTestState("testing");
    setTimeout(() => {
      setTestState("success");
    }, 2000);
  };

  const selectedTemplate = cameraTemplates.find(
    (t) => t.brand === selectedBrand
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Back link */}
        <Link
          href={`/dashboard/stores/${storeId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {storeName}
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-8">
          Add Camera to {storeName}
        </h1>

        <div className="space-y-8">
          {/* ── Camera Name ────────────────────────────────────── */}
          <div className="rounded-xl border bg-white p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="camera-name">Camera Name</Label>
              <Input
                id="camera-name"
                value={cameraName}
                onChange={(e) => setCameraName(e.target.value)}
                placeholder="e.g. Entrance Main, Aisle B, Parking Lot"
              />
            </div>
          </div>

          {/* ── Connection Method ──────────────────────────────── */}
          <div>
            <Label className="mb-3 block">Connection Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {/* RTSP Direct */}
              <button
                type="button"
                onClick={() => setConnectionMethod("rtsp")}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  connectionMethod === "rtsp"
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "bg-white hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-sm text-foreground">
                    RTSP Direct
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter an RTSP URL manually or use a brand template.
                </p>
              </button>

              {/* Auto-Discover */}
              <button
                type="button"
                disabled
                className="rounded-xl border bg-white p-4 text-left opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold text-sm text-foreground">
                    Auto-Discover
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-600 border-amber-200 text-[10px]"
                  >
                    Coming Soon
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically find cameras on your local network.
                </p>
              </button>
            </div>
          </div>

          {/* ── RTSP URL ──────────────────────────────────────── */}
          {connectionMethod === "rtsp" && (
            <div className="rounded-xl border bg-white p-5 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="rtsp-url">RTSP URL</Label>
                <Input
                  id="rtsp-url"
                  value={
                    selectedBrand && selectedTemplate
                      ? buildRtspUrl(selectedTemplate)
                      : rtspUrl
                  }
                  onChange={(e) => {
                    setRtspUrl(e.target.value);
                    setSelectedBrand(null);
                  }}
                  placeholder="rtsp://user:password@ip:554/stream"
                  className="font-mono text-sm"
                />
              </div>

              {/* Quick Templates */}
              <div className="space-y-3">
                <Label>Quick Templates</Label>
                <div className="flex flex-wrap gap-2">
                  {cameraTemplates.map((tmpl) => (
                    <Button
                      key={tmpl.brand}
                      variant={
                        selectedBrand === tmpl.brand ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleSelectTemplate(tmpl.brand)}
                    >
                      {tmpl.brand}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Template fields (shown when brand selected) */}
              {selectedBrand && selectedTemplate && (
                <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                  <p className="text-sm font-medium text-foreground">
                    {selectedBrand} Configuration
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tmpl-ip">IP Address</Label>
                      <Input
                        id="tmpl-ip"
                        value={templateFields.ip}
                        onChange={(e) =>
                          setTemplateFields((prev) => ({
                            ...prev,
                            ip: e.target.value,
                          }))
                        }
                        placeholder="192.168.1.100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tmpl-user">Username</Label>
                      <Input
                        id="tmpl-user"
                        value={templateFields.user}
                        onChange={(e) =>
                          setTemplateFields((prev) => ({
                            ...prev,
                            user: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tmpl-pass">Password</Label>
                      <Input
                        id="tmpl-pass"
                        type="password"
                        value={templateFields.password}
                        onChange={(e) =>
                          setTemplateFields((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tmpl-channel">Channel</Label>
                      <Input
                        id="tmpl-channel"
                        value={templateFields.channel}
                        onChange={(e) =>
                          setTemplateFields((prev) => ({
                            ...prev,
                            channel: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tmpl-quality">Stream Quality</Label>
                    <Select
                      value={templateFields.streamQuality}
                      onValueChange={(v) =>
                        setTemplateFields((prev) => ({
                          ...prev,
                          streamQuality: v,
                        }))
                      }
                    >
                      <SelectTrigger id="tmpl-quality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTemplate.streamQualities.map((q) => (
                          <SelectItem key={q} value={q}>
                            {q.charAt(0).toUpperCase() + q.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Test Connection */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={testConnection}
                  disabled={testState === "testing"}
                >
                  {testState === "testing" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Radio className="mr-2 h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </Button>
              </div>

              {/* Success state */}
              {testState === "success" && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-sm text-emerald-800">
                      Connection Successful
                    </span>
                  </div>
                  {/* Preview placeholder */}
                  <div className="rounded-lg bg-slate-800 h-40 flex items-center justify-center mb-3">
                    <p className="text-sm text-slate-400">
                      Camera preview
                    </p>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>
                      Resolution:{" "}
                      <span className="font-medium text-foreground">
                        1920x1080
                      </span>
                    </span>
                    <span>
                      Codec:{" "}
                      <span className="font-medium text-foreground">
                        H.264
                      </span>
                    </span>
                    <span>
                      Bitrate:{" "}
                      <span className="font-medium text-foreground">
                        4096 kbps
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Target FPS ────────────────────────────────────── */}
          <div className="rounded-xl border bg-white p-5 space-y-2">
            <Label htmlFor="fps">Target FPS</Label>
            <Select value={targetFps} onValueChange={setTargetFps}>
              <SelectTrigger id="fps" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((fps) => (
                  <SelectItem key={fps} value={String(fps)}>
                    {fps} FPS
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Higher FPS means more processing but better detection accuracy.
              Default: 3 FPS.
            </p>
          </div>

          {/* ── Actions ───────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/stores/${storeId}`}>Cancel</Link>
            </Button>
            <Button disabled={!cameraName.trim()}>Add Camera</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
