"use client";

import {
  MessageCircle,
  Phone,
  MessageSquare,
  Hash,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDataset } from "@/lib/dataset-context";
import type { IntegrationType, IntegrationStatus } from "@/lib/types";

/* ── Config ─────────────────────────────────────────────────────── */

interface IntegrationDisplayConfig {
  label: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const integrationDisplay: Record<IntegrationType, IntegrationDisplayConfig> = {
  telegram: {
    label: "Telegram",
    icon: MessageCircle,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  webhook: {
    label: "Twilio",
    icon: Phone,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageSquare,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  slack: {
    label: "Slack",
    icon: Hash,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
};

function statusBadge(status: IntegrationStatus, type: IntegrationType) {
  // WhatsApp and Slack are "coming soon"
  if (
    (type === "whatsapp" || type === "slack") &&
    status === "disconnected"
  ) {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-600 border-amber-200"
      >
        <Sparkles className="mr-1 h-3 w-3" />
        Coming Soon
      </Badge>
    );
  }

  if (status === "connected") {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-200"
      >
        <Check className="mr-1 h-3 w-3" />
        Connected
      </Badge>
    );
  }

  if (status === "error") {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200"
      >
        <X className="mr-1 h-3 w-3" />
        Error
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-slate-50 text-slate-500 border-slate-200"
    >
      Disconnected
    </Badge>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function IntegrationsPage() {
  const { integrations } = useDataset();
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Integrations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect third-party services to deliver alerts and automate
            workflows.
          </p>
        </div>

        {/* Integration cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {integrations.map((integration) => {
            const display = integrationDisplay[integration.type];
            const Icon = display.icon;
            const isComingSoon =
              (integration.type === "whatsapp" ||
                integration.type === "slack") &&
              integration.status === "disconnected";
            const isConnected = integration.status === "connected";

            return (
              <div
                key={integration.id}
                className={`rounded-xl border bg-white p-5 transition-colors ${
                  isComingSoon ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Colored icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${display.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${display.iconColor}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Title + status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {display.label}
                      </h3>
                      {statusBadge(integration.status, integration.type)}
                    </div>

                    {/* Details */}
                    {integration.type === "telegram" && isConnected && (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          Bot:{" "}
                          <span className="font-medium text-foreground">
                            {integration.configJson.botUsername as string}
                          </span>
                        </p>
                        <p>
                          Connected channels:{" "}
                          <span className="font-medium text-foreground">
                            {integration.configJson.connectedChannels as number}
                          </span>
                        </p>
                      </div>
                    )}

                    {integration.type === "webhook" && isConnected && (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          Phone:{" "}
                          <span className="font-medium text-foreground">
                            {integration.configJson.fromNumber as string}
                          </span>
                        </p>
                        <p>
                          Balance:{" "}
                          <span className="font-medium text-foreground">
                            {integration.configJson.balance as string}
                          </span>
                        </p>
                      </div>
                    )}

                    {isComingSoon && (
                      <p className="text-sm text-muted-foreground">
                        This integration is not yet available. Stay tuned for
                        updates.
                      </p>
                    )}

                    {/* Actions */}
                    {isConnected && (
                      <div className="flex items-center gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                        >
                          Disconnect
                        </Button>
                      </div>
                    )}

                    {!isConnected && !isComingSoon && (
                      <div className="mt-4">
                        <Button size="sm">Connect</Button>
                      </div>
                    )}
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
