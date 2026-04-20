"use client";

import type {
  AlertEvent,
  AlertRule,
  Camera,
  DashboardStats,
  Integration,
  Member,
  Organization,
  Protocol,
  Store,
  User,
} from "./types";
import type { NavUser, LegacyStore } from "@/data/mock";

/* Raw snake_case row shapes coming from Supabase via the seed endpoints. */

export type RawStore = {
  id: string;
  org_id: string;
  name: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  timezone?: string | null;
  business_hours?: Record<string, { open: string; close: string }> | null;
  created_at?: string | null;
  cameras_count?: number | null;
  cameras_online?: number | null;
  alerts_today?: number | null;
};

export type RawCamera = {
  id: string;
  store_id: string;
  name: string;
  rtsp_url: string;
  status: "online" | "offline" | "error";
  resolution?: string | null;
  fps_target?: number | null;
  last_frame_at?: string | null;
  created_at?: string | null;
};

export type RawAlertRule = {
  id: string;
  org_id: string;
  name: string;
  description?: string | null;
  type: string;
  confidence_threshold?: number | null;
  cooldown_seconds?: number | null;
  schedule_json?: Record<string, unknown> | null;
  zone_config_json?: Record<string, unknown> | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

export type RawProtocol = {
  id: string;
  org_id: string;
  name: string;
  type: string;
  config_json?: Record<string, unknown> | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

export type RawAlertEvent = {
  id: string;
  org_id: string;
  store_id: string;
  camera_id: string;
  alert_rule_id: string;
  occurred_at: string;
  confidence: number;
  bounding_box_json?: { x: number; y: number; w: number; h: number } | null;
  screenshot_url?: string | null;
  clip_url?: string | null;
  status: "triggered" | "acknowledged" | "resolved" | "false_alarm";
  acknowledged_by_user_id?: string | null;
  acknowledged_at?: string | null;
  notes?: string | null;
};

export type RawMember = {
  id: string;
  org_id: string;
  user_id: string;
  role: "owner" | "admin" | "operator" | "viewer";
  invited_at: string;
  accepted_at: string | null;
  profile?: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    avatar_url: string | null;
    created_at: string;
  } | null;
};

export type RawIntegration = {
  id: string;
  org_id: string;
  type: "telegram" | "whatsapp" | "slack" | "webhook";
  config_json: Record<string, unknown>;
  status: "connected" | "disconnected" | "error";
  connected_at: string | null;
};

export type RawOrg = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  plan?: "free" | "starter" | "pro" | "enterprise" | null;
  created_at?: string | null;
};

export type RawSeedUser = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "operator" | "viewer";
  initials: string;
  org_id: string;
};

/* ------------------------------ converters ------------------------------ */

export function toNavUser(u: RawSeedUser): NavUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role === "owner" ? "admin" : u.role,
    initials: u.initials,
  };
}

export function toStore(s: RawStore, cameras: RawCamera[]): Store {
  const storeCams = cameras.filter((c) => c.store_id === s.id);
  return {
    id: s.id,
    orgId: s.org_id,
    name: s.name,
    address: s.address ?? "",
    lat: s.lat ?? 0,
    lng: s.lng ?? 0,
    timezone: s.timezone ?? "UTC",
    businessHours: s.business_hours ?? {},
    createdAt: s.created_at ?? new Date().toISOString(),
    camerasCount: s.cameras_count ?? storeCams.length,
    camerasOnline:
      s.cameras_online ?? storeCams.filter((c) => c.status === "online").length,
    alertsToday: s.alerts_today ?? 0,
  };
}

export function toLegacyStore(s: RawStore, cameras: RawCamera[]): LegacyStore {
  const storeCams = cameras.filter((c) => c.store_id === s.id);
  const online = storeCams.filter((c) => c.status === "online").length;
  return {
    id: s.id,
    name: s.name,
    address: s.address ?? "",
    cameraCount: s.cameras_count ?? storeCams.length,
    activeAlerts: s.alerts_today ?? 0,
    status:
      online === storeCams.length && storeCams.length > 0
        ? "online"
        : online === 0
        ? "offline"
        : "partial",
  };
}

export function toCamera(
  c: RawCamera,
  stores: RawStore[],
  ruleCounts: Record<string, number>,
): Camera {
  const store = stores.find((s) => s.id === c.store_id);
  return {
    id: c.id,
    storeId: c.store_id,
    name: c.name,
    rtspUrl: c.rtsp_url,
    status: c.status,
    resolution: c.resolution ?? "",
    fpsTarget: c.fps_target ?? 0,
    lastFrameAt: c.last_frame_at ?? null,
    thumbnailUrl: null,
    createdAt: c.created_at ?? new Date().toISOString(),
    rulesCount: ruleCounts[c.id] ?? 0,
    storeName: store?.name ?? "",
  };
}

export function toAlertRule(
  r: RawAlertRule,
  ruleCameras: Record<string, Camera[]>,
  ruleProtocols: Record<string, Protocol[]>,
): AlertRule {
  return {
    id: r.id,
    orgId: r.org_id,
    name: r.name,
    description: r.description ?? "",
    type: (r.type as AlertRule["type"]) ?? "custom",
    confidenceThreshold: r.confidence_threshold ?? 0.5,
    cooldownSeconds: r.cooldown_seconds ?? 60,
    scheduleJson: r.schedule_json ?? {},
    zoneConfigJson: r.zone_config_json ?? null,
    isActive: r.is_active ?? true,
    createdAt: r.created_at ?? new Date().toISOString(),
    cameras: ruleCameras[r.id] ?? [],
    camerasCount: (ruleCameras[r.id] ?? []).length,
    protocols: ruleProtocols[r.id] ?? [],
    protocolsCount: (ruleProtocols[r.id] ?? []).length,
  };
}

export function toProtocol(p: RawProtocol, usedByRules: number): Protocol {
  return {
    id: p.id,
    orgId: p.org_id,
    name: p.name,
    type: (p.type as Protocol["type"]) ?? "webhook",
    configJson: p.config_json ?? {},
    isActive: p.is_active ?? true,
    createdAt: p.created_at ?? new Date().toISOString(),
    usedByRulesCount: usedByRules,
  };
}

export function toAlertEvent(
  e: RawAlertEvent,
  stores: RawStore[],
  cameras: RawCamera[],
  rules: RawAlertRule[],
): AlertEvent {
  const store = stores.find((s) => s.id === e.store_id);
  const camera = cameras.find((c) => c.id === e.camera_id);
  const rule = rules.find((r) => r.id === e.alert_rule_id);
  return {
    id: e.id,
    orgId: e.org_id,
    storeId: e.store_id,
    cameraId: e.camera_id,
    alertRuleId: e.alert_rule_id,
    timestamp: e.occurred_at,
    confidence: e.confidence,
    boundingBoxJson: e.bounding_box_json ?? null,
    screenshotUrl: e.screenshot_url ?? null,
    clipUrl: e.clip_url ?? null,
    status: e.status,
    acknowledgedByUserId: e.acknowledged_by_user_id ?? null,
    acknowledgedAt: e.acknowledged_at ?? null,
    notes: e.notes ?? null,
    storeName: store?.name ?? "",
    cameraName: camera?.name ?? "",
    ruleName: rule?.name ?? "",
    ruleType: (rule?.type as AlertRule["type"]) ?? "custom",
  };
}

export function toMember(m: RawMember): Member {
  const user: User = m.profile
    ? {
        id: m.profile.id,
        email: m.profile.email,
        name: m.profile.name ?? "",
        phone: m.profile.phone ?? null,
        avatarUrl: m.profile.avatar_url ?? null,
        createdAt: m.profile.created_at,
      }
    : {
        id: m.user_id,
        email: "unknown@camaron.demo",
        name: "Unknown user",
        phone: null,
        avatarUrl: null,
        createdAt: m.invited_at,
      };
  return {
    id: m.id,
    orgId: m.org_id,
    userId: m.user_id,
    role: m.role,
    invitedAt: m.invited_at,
    acceptedAt: m.accepted_at,
    user,
  };
}

export function toIntegration(i: RawIntegration): Integration {
  return {
    id: i.id,
    orgId: i.org_id,
    type: i.type,
    configJson: i.config_json ?? {},
    status: i.status,
    connectedAt: i.connected_at,
  };
}

export function toOrganization(o: RawOrg): Organization {
  return {
    id: o.id,
    name: o.name,
    slug: o.slug,
    logoUrl: o.logo_url ?? null,
    plan: o.plan ?? "free",
    createdAt: o.created_at ?? new Date().toISOString(),
  };
}

export function computeDashboardStats(
  cameras: Camera[],
  alertEvents: AlertEvent[],
  stores: Store[],
): DashboardStats {
  const camerasOnline = cameras.filter((c) => c.status === "online").length;
  const offlineCameras = cameras.filter((c) => c.status !== "online").length;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const weekAgo = Date.now() - 7 * 86_400_000;
  return {
    camerasOnline,
    camerasTotal: cameras.length,
    storesActive: stores.filter((s) => s.camerasOnline > 0).length,
    storesTotal: stores.length,
    alertsToday: alertEvents.filter(
      (e) => new Date(e.timestamp).getTime() >= startOfDay.getTime(),
    ).length,
    alertsWeek: alertEvents.filter(
      (e) => new Date(e.timestamp).getTime() >= weekAgo,
    ).length,
    offlineCameras,
  };
}
