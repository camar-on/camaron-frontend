"use client";

import {
  MessageCircle,
  Phone,
  Link as LinkIcon,
  Mail,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { protocols } from "@/data/mock";
import type { ProtocolType } from "@/lib/types";

/* ── Helpers ────────────────────────────────────────────────────── */

const protocolTypeConfig: Record<
  ProtocolType,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  telegram_message: {
    label: "Telegram",
    icon: MessageCircle,
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
  },
  phone_call: {
    label: "Phone Call",
    icon: Phone,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  webhook: {
    label: "Webhook",
    icon: LinkIcon,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  email: {
    label: "Email",
    icon: Mail,
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
  },
};

function getConfigSummary(
  type: ProtocolType,
  config: Record<string, unknown>
): string {
  switch (type) {
    case "telegram_message":
      return `Channel: ${config.channelName ?? config.chatId ?? "--"}`;
    case "phone_call":
      return `Phone: ${config.toNumber ?? "--"}`;
    case "webhook":
      return `URL: ${config.url ?? "--"}`;
    case "email":
      return `To: ${config.to ?? "--"}`;
    default:
      return "";
  }
}

function statusBadge(isActive: boolean) {
  if (isActive) {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-200"
      >
        Active
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-slate-50 text-slate-500 border-slate-200"
    >
      Disabled
    </Badge>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function ProtocolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Protocols
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage notification channels triggered by alert rules.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Protocol
          </Button>
        </div>

        {/* Protocol cards */}
        <div className="space-y-4">
          {protocols.map((proto) => {
            const config = protocolTypeConfig[proto.type];
            const Icon = config.icon;

            return (
              <div
                key={proto.id}
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
                        {proto.name}
                      </h3>
                      <Badge variant="outline" className={config.badgeClass}>
                        {config.label}
                      </Badge>
                    </div>

                    {/* Config details */}
                    <p className="text-sm text-muted-foreground mb-2">
                      {getConfigSummary(proto.type, proto.configJson)}
                    </p>

                    {/* Used by / Status */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Used by:{" "}
                        <span className="font-medium text-foreground">
                          {proto.usedByRulesCount}
                        </span>{" "}
                        alert {proto.usedByRulesCount === 1 ? "rule" : "rules"}
                      </span>
                      {statusBadge(proto.isActive)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
