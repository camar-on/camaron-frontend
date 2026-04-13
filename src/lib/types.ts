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

// =============================================================================
// Analytics Types
// =============================================================================

/** Hourly foot-traffic entry/exit counts */
export interface HourlyTraffic {
  hour: string;
  entries: number;
  exits: number;
}

/** Daily aggregated visitor data */
export interface DailyTraffic {
  date: string;
  visitors: number;
  entries: number;
  exits: number;
}

/** Per-store traffic summary with hourly breakdown */
export interface TrafficByStore {
  storeId: string;
  storeName: string;
  todayVisitors: number;
  yesterdayVisitors: number;
  weeklyAvg: number;
  peakHour: string;
  hourlyData: HourlyTraffic[];
}

/** Queue length snapshot at a point in time */
export interface QueueSnapshot {
  timestamp: string;
  queueLength: number;
  avgWaitMinutes: number;
}

/** Queue status levels */
export type QueueStatus = "normal" | "busy" | "critical";

/** A monitored queue point (e.g. checkout lane) */
export interface QueuePoint {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  cameraId: string;
  currentLength: number;
  avgWaitMinutes: number;
  maxWaitMinutes: number;
  status: QueueStatus;
  snapshots: QueueSnapshot[];
}

/** Activity data for a single store zone */
export interface ZoneActivity {
  zoneId: string;
  zoneName: string;
  activityLevel: number;
  dwellTimeAvg: number;
  visitorCount: number;
}

/** Store-level heatmap with zones and intensity grid */
export interface StoreHeatmapData {
  storeId: string;
  storeName: string;
  zones: ZoneActivity[];
  grid: number[][];
}

/** A transition between two store zones */
export interface JourneyTransition {
  fromZone: string;
  toZone: string;
  count: number;
  avgDurationSeconds: number;
}

/** Customer journey data for a store */
export interface JourneyData {
  storeId: string;
  storeName: string;
  transitions: JourneyTransition[];
  topPaths: { path: string[]; percentage: number }[];
  avgVisitDuration: number;
  avgZonesVisited: number;
}

/** Individual survey response */
export interface SurveyResponse {
  id: string;
  storeId: string;
  storeName: string;
  date: string;
  score: number;
  comment: string | null;
  channel: "qr" | "email" | "sms";
}

/** NPS data per store with monthly trend */
export interface NPSData {
  storeId: string;
  storeName: string;
  npsScore: number;
  promoters: number;
  passives: number;
  detractors: number;
  totalResponses: number;
  trend: { month: string; nps: number }[];
}

/** Store-level performance metrics with daily breakdown */
export interface StorePerformance {
  storeId: string;
  storeName: string;
  visitors: number;
  transactions: number;
  conversionRate: number;
  avgDwellTime: number;
  revenuePerVisitor: number;
  dailyData: {
    date: string;
    visitors: number;
    transactions: number;
    conversionRate: number;
  }[];
}

/** Analytics overview summary */
export interface AnalyticsSummary {
  totalVisitorsToday: number;
  totalVisitorsWeek: number;
  avgConversionRate: number;
  avgNPS: number;
  avgDwellTime: number;
  busiestStore: string;
  busiestHour: string;
  activeQueues: number;
  criticalQueues: number;
  weeklyTrend: { date: string; visitors: number }[];
}
