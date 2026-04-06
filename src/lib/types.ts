// =============================================================================
// camar-On — Data Model Types
// =============================================================================

/** Subscription plan tiers */
export type Plan = "free" | "starter" | "pro" | "enterprise";

/** Member roles with descending privilege */
export type MemberRole = "owner" | "admin" | "operator" | "viewer";

/** Camera connectivity status */
export type CameraStatus = "online" | "offline" | "error";

/** Built-in alert rule types */
export type AlertRuleType =
  | "person_detected"
  | "weapon"
  | "fire"
  | "intrusion"
  | "custom";

/** Protocol delivery channels */
export type ProtocolType =
  | "telegram_message"
  | "phone_call"
  | "webhook"
  | "email";

/** Alert event lifecycle */
export type AlertEventStatus =
  | "triggered"
  | "acknowledged"
  | "false_alarm"
  | "resolved";

/** Protocol execution delivery status */
export type ProtocolExecutionStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "failed";

/** Third-party integration channels */
export type IntegrationType = "telegram" | "whatsapp" | "slack" | "webhook";

/** Integration connection health */
export type IntegrationStatus = "connected" | "disconnected" | "error";

// =============================================================================
// Core Entities
// =============================================================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  plan: Plan;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Member {
  id: string;
  orgId: string;
  userId: string;
  role: MemberRole;
  invitedAt: string;
  acceptedAt: string | null;
  user: User;
}

export interface Store {
  id: string;
  orgId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  timezone: string;
  businessHours: Record<string, { open: string; close: string }>;
  createdAt: string;
  camerasCount: number;
  camerasOnline: number;
  alertsToday: number;
}

export interface Camera {
  id: string;
  storeId: string;
  name: string;
  rtspUrl: string;
  status: CameraStatus;
  resolution: string;
  fpsTarget: number;
  lastFrameAt: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  rulesCount: number;
  storeName: string;
}

export interface AlertRule {
  id: string;
  orgId: string;
  name: string;
  description: string;
  type: AlertRuleType;
  confidenceThreshold: number;
  cooldownSeconds: number;
  scheduleJson: Record<string, unknown>;
  zoneConfigJson: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  camerasCount: number;
  protocolsCount: number;
  protocols: Protocol[];
  cameras: Camera[];
}

export interface Protocol {
  id: string;
  orgId: string;
  name: string;
  type: ProtocolType;
  configJson: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  usedByRulesCount: number;
}

export interface AlertEvent {
  id: string;
  orgId: string;
  storeId: string;
  cameraId: string;
  alertRuleId: string;
  timestamp: string;
  confidence: number;
  boundingBoxJson: { x: number; y: number; w: number; h: number } | null;
  screenshotUrl: string | null;
  clipUrl: string | null;
  status: AlertEventStatus;
  acknowledgedByUserId: string | null;
  acknowledgedAt: string | null;
  notes: string | null;
  storeName: string;
  cameraName: string;
  ruleName: string;
  ruleType: AlertRuleType;
}

export interface ProtocolExecution {
  id: string;
  alertEventId: string;
  protocolId: string;
  status: ProtocolExecutionStatus;
  executedAt: string;
  responseJson: Record<string, unknown> | null;
}

export interface Integration {
  id: string;
  orgId: string;
  type: IntegrationType;
  configJson: Record<string, unknown>;
  status: IntegrationStatus;
  connectedAt: string | null;
}

export interface DashboardStats {
  camerasOnline: number;
  camerasTotal: number;
  storesActive: number;
  storesTotal: number;
  alertsToday: number;
  alertsWeek: number;
  offlineCameras: number;
}

// =============================================================================
// Settings & Preferences
// =============================================================================

export interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  criticalOnly: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

// =============================================================================
// Camera Templates (for RTSP quick-fill)
// =============================================================================

export interface CameraTemplate {
  brand: string;
  urlTemplate: string;
  defaultUser: string;
  defaultPassword: string;
  defaultChannel: string;
  streamQualities: string[];
}
