"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  alertEvents as mockAlertEvents,
  alertRules as mockAlertRules,
  cameras as mockCameras,
  dashboardStats as mockDashboardStats,
  integrations as mockIntegrations,
  members as mockMembers,
  notificationSettings as mockNotificationSettings,
  organization as mockOrg,
  protocols as mockProtocols,
  stores as mockStores,
  getCamerasForStore as mockGetCamerasForStore,
  getAlertsForStore as mockGetAlertsForStore,
  getRulesForStore as mockGetRulesForStore,
  mockStores as mockLegacyStores,
  mockUser as mockNavUser,
  type LegacyStore,
  type NavUser,
} from "@/data/mock";
import type {
  AlertEvent,
  AlertRule,
  Camera,
  DashboardStats,
  Integration,
  Member,
  NotificationSettings,
  Organization,
  Protocol,
  Store,
} from "./types";
import { useDemoMode } from "./demo-mode";
import {
  toAlertEvent,
  toAlertRule,
  toCamera,
  toIntegration,
  toLegacyStore,
  toMember,
  toNavUser,
  toOrganization,
  toProtocol,
  toStore,
  computeDashboardStats,
  type RawAlertEvent,
  type RawAlertRule,
  type RawCamera,
  type RawIntegration,
  type RawMember,
  type RawOrg,
  type RawProtocol,
  type RawSeedUser,
  type RawStore,
} from "./seed-shapes";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return (await res.json()) as T;
}

export interface Dataset {
  // UI-level
  currentUser: NavUser;
  organization: Organization;
  legacyStores: LegacyStore[]; // for sidebar
  notificationSettings: NotificationSettings;
  dashboardStats: DashboardStats;

  // Domain entities (already converted to the typed shapes the UI uses)
  stores: Store[];
  cameras: Camera[];
  alertEvents: AlertEvent[];
  alertRules: AlertRule[];
  protocols: Protocol[];
  members: Member[];
  integrations: Integration[];

  // Query helpers (mode-aware)
  getCamerasForStore: (storeId: string) => Camera[];
  getAlertsForStore: (storeId: string) => AlertEvent[];
  getRulesForStore: (storeId: string) => AlertRule[];

  // Meta
  isLoading: boolean;
  isSeedMode: boolean;
}

const Ctx = createContext<Dataset | null>(null);

/* -------------------------------------------------------------------------- */
/*  Demo mode — just return the mock arrays directly.                         */
/* -------------------------------------------------------------------------- */

function demoDataset(): Dataset {
  return {
    currentUser: mockNavUser,
    organization: mockOrg,
    legacyStores: mockLegacyStores,
    notificationSettings: mockNotificationSettings,
    dashboardStats: mockDashboardStats,
    stores: mockStores,
    cameras: mockCameras,
    alertEvents: mockAlertEvents,
    alertRules: mockAlertRules,
    protocols: mockProtocols,
    members: mockMembers,
    integrations: mockIntegrations,
    getCamerasForStore: mockGetCamerasForStore,
    getAlertsForStore: mockGetAlertsForStore,
    getRulesForStore: mockGetRulesForStore,
    isLoading: false,
    isSeedMode: false,
  };
}

/* -------------------------------------------------------------------------- */
/*  Seed mode — fetch everything from backend, build the typed dataset.       */
/* -------------------------------------------------------------------------- */

function buildSeedDataset(raw: {
  me: RawSeedUser;
  org: RawOrg;
  stores: RawStore[];
  cameras: RawCamera[];
  events: RawAlertEvent[];
  rules: RawAlertRule[];
  protocols: RawProtocol[];
  members: RawMember[];
  integrations: RawIntegration[];
  ruleCameras: { alert_rule_id: string; camera_id: string }[];
  ruleProtocols: { alert_rule_id: string; protocol_id: string }[];
}): Dataset {
  // rule → counts
  const ruleCountByCamera: Record<string, number> = {};
  for (const link of raw.ruleCameras) {
    ruleCountByCamera[link.camera_id] =
      (ruleCountByCamera[link.camera_id] ?? 0) + 1;
  }

  // Convert primary entities
  const stores = raw.stores.map((s) => toStore(s, raw.cameras));
  const legacyStores = raw.stores.map((s) => toLegacyStore(s, raw.cameras));
  const cameras = raw.cameras.map((c) => toCamera(c, raw.stores, ruleCountByCamera));
  const protocolsUsedBy: Record<string, number> = {};
  for (const link of raw.ruleProtocols) {
    protocolsUsedBy[link.protocol_id] =
      (protocolsUsedBy[link.protocol_id] ?? 0) + 1;
  }
  const protocols = raw.protocols.map((p) =>
    toProtocol(p, protocolsUsedBy[p.id] ?? 0),
  );

  // Rule → cameras/protocols maps (after camera/protocol conversion)
  const ruleCamerasById: Record<string, Camera[]> = {};
  for (const link of raw.ruleCameras) {
    const cam = cameras.find((c) => c.id === link.camera_id);
    if (!cam) continue;
    (ruleCamerasById[link.alert_rule_id] ??= []).push(cam);
  }
  const ruleProtocolsById: Record<string, Protocol[]> = {};
  for (const link of raw.ruleProtocols) {
    const proto = protocols.find((p) => p.id === link.protocol_id);
    if (!proto) continue;
    (ruleProtocolsById[link.alert_rule_id] ??= []).push(proto);
  }

  const alertRules = raw.rules.map((r) =>
    toAlertRule(r, ruleCamerasById, ruleProtocolsById),
  );
  const alertEvents = raw.events.map((e) =>
    toAlertEvent(e, raw.stores, raw.cameras, raw.rules),
  );
  const members = raw.members.map(toMember);
  const integrations = raw.integrations.map(toIntegration);

  const getCamerasForStore = (storeId: string) =>
    cameras.filter((c) => c.storeId === storeId);
  const getAlertsForStore = (storeId: string) =>
    alertEvents.filter((a) => a.storeId === storeId);
  const getRulesForStore = (storeId: string) => {
    const camIds = new Set(
      cameras.filter((c) => c.storeId === storeId).map((c) => c.id),
    );
    return alertRules.filter((r) =>
      r.cameras.some((c) => camIds.has(c.id)),
    );
  };

  return {
    currentUser: toNavUser(raw.me),
    organization: toOrganization(raw.org),
    legacyStores,
    notificationSettings: mockNotificationSettings, // not stored server-side yet
    dashboardStats: computeDashboardStats(cameras, alertEvents, stores),
    stores,
    cameras,
    alertEvents,
    alertRules,
    protocols,
    members,
    integrations,
    getCamerasForStore,
    getAlertsForStore,
    getRulesForStore,
    isLoading: false,
    isSeedMode: true,
  };
}

function emptySeedDataset(isLoading: boolean): Dataset {
  return {
    currentUser: { id: "seed", name: "Seed Demo", email: "seed@camaron.demo", role: "admin", initials: "SD" },
    organization: { ...mockOrg, name: "camar-On Live Demo" },
    legacyStores: [],
    notificationSettings: mockNotificationSettings,
    dashboardStats: {
      camerasOnline: 0,
      camerasTotal: 0,
      storesActive: 0,
      storesTotal: 0,
      alertsToday: 0,
      alertsWeek: 0,
      offlineCameras: 0,
    },
    stores: [],
    cameras: [],
    alertEvents: [],
    alertRules: [],
    protocols: [],
    members: [],
    integrations: [],
    getCamerasForStore: () => [],
    getAlertsForStore: () => [],
    getRulesForStore: () => [],
    isLoading,
    isSeedMode: true,
  };
}

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

export function DatasetProvider({ children }: { children: ReactNode }) {
  const mode = useDemoMode();
  const [seed, setSeed] = useState<Dataset>(emptySeedDataset(true));

  useEffect(() => {
    if (mode !== "seed") return;
    let cancelled = false;
    setSeed(emptySeedDataset(true));

    (async () => {
      try {
        const [
          me, org, stores, cameras, events, rules, protocols,
          members, integrations, ruleCameras, ruleProtocols,
        ] = await Promise.all([
          getJson<RawSeedUser>("/api/v1/seed/me"),
          getJson<RawOrg>("/api/v1/seed/org"),
          getJson<RawStore[]>("/api/v1/seed/stores"),
          getJson<RawCamera[]>("/api/v1/seed/cameras"),
          getJson<RawAlertEvent[]>("/api/v1/seed/alert-events"),
          getJson<RawAlertRule[]>("/api/v1/seed/alert-rules"),
          getJson<RawProtocol[]>("/api/v1/seed/protocols"),
          getJson<RawMember[]>("/api/v1/seed/members"),
          getJson<RawIntegration[]>("/api/v1/seed/integrations"),
          getJson<{ alert_rule_id: string; camera_id: string }[]>("/api/v1/seed/alert-rule-cameras"),
          getJson<{ alert_rule_id: string; protocol_id: string }[]>("/api/v1/seed/alert-rule-protocols"),
        ]);
        if (cancelled) return;
        setSeed(buildSeedDataset({
          me, org, stores, cameras, events, rules, protocols,
          members, integrations, ruleCameras, ruleProtocols,
        }));
      } catch (err) {
        console.error("seed dataset fetch failed:", err);
        if (!cancelled) setSeed(emptySeedDataset(false));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const value = useMemo<Dataset>(
    () => (mode === "seed" ? seed : demoDataset()),
    [mode, seed],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDataset(): Dataset {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDataset must be used within DatasetProvider");
  return ctx;
}
