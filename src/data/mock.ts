import type {
  Organization,
  User,
  Member,
  Store,
  Camera,
  AlertRule,
  Protocol,
  AlertEvent,
  ProtocolExecution,
  Integration,
  DashboardStats,
  NotificationSettings,
  CameraTemplate,
  TrafficByStore,
  DailyTraffic,
  QueuePoint,
  StoreHeatmapData,
  JourneyData,
  NPSData,
  SurveyResponse,
  StorePerformance,
  AnalyticsSummary,
} from "@/lib/types";

// =============================================================================
// Helpers
// =============================================================================

const ago = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const daysAgo = (days: number): string =>
  new Date(Date.UTC(2026, 1, 26) - days * 86_400_000).toISOString();

const thumb = (label: string): string =>
  `https://placehold.co/640x360/e2e8f0/64748b?text=${encodeURIComponent(label)}`;

// =============================================================================
// Legacy lightweight interfaces (kept for sidebar / nav compatibility)
// =============================================================================

export interface LegacyStore {
  id: string;
  name: string;
  address: string;
  cameraCount: number;
  activeAlerts: number;
  status: "online" | "offline" | "partial";
}

export interface NavUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "viewer" | "operator";
  avatarUrl?: string;
  initials: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "alert" | "info" | "warning";
}

export const mockStores: LegacyStore[] = [
  { id: "sto_01", name: "Sucursal Centro", address: "Av. Chapultepec 432, Col. Americana, Guadalajara", cameraCount: 4, activeAlerts: 5, status: "online" },
  { id: "sto_02", name: "Sucursal Sur", address: "Av. López Mateos 1890, Col. Chapalita, Guadalajara", cameraCount: 4, activeAlerts: 3, status: "online" },
  { id: "sto_03", name: "Bodega Norte", address: "Calle Industrial 78, Zapopan", cameraCount: 2, activeAlerts: 7, status: "partial" },
];

export const mockUser: NavUser = { id: "usr_01", name: "JuanJo", email: "jcmendoza@grupobajio.mx", role: "admin", initials: "JC" };

export const mockNotifications: Notification[] = [
  { id: "notif-1", title: "Movimiento detectado", message: "Cámara Acceso Carga — Bodega Norte detectó movimiento fuera de horario.", timestamp: "2026-02-26T08:14:00Z", read: false, type: "alert" },
  { id: "notif-2", title: "Cámara desconectada", message: "Cámara Interior Almacén — Bodega Norte perdió conexión.", timestamp: "2026-02-26T07:45:00Z", read: false, type: "warning" },
  { id: "notif-3", title: "Protocolo actualizado", message: "El protocolo 'Telegram Alertas' fue modificado por un administrador.", timestamp: "2026-02-25T22:10:00Z", read: true, type: "info" },
];

// =============================================================================
// Organization
// =============================================================================

export const organization: Organization = {
  id: "org_01",
  name: "Grupo Comercial del Bajío",
  slug: "grupo-comercial-bajio",
  logoUrl: null,
  plan: "pro",
  createdAt: daysAgo(180),
};

// =============================================================================
// Users
// =============================================================================

export const users: User[] = [
  { id: "usr_01", email: "jcmendoza@grupobajio.mx", name: "JuanJo Solorzano", phone: "+523312345678", avatarUrl: null, createdAt: daysAgo(180) },
  { id: "usr_02", email: "maria.lopez@grupobajio.mx", name: "María López Rivera", phone: "+523319876543", avatarUrl: null, createdAt: daysAgo(150) },
  { id: "usr_03", email: "roberto.hdz@grupobajio.mx", name: "Roberto Hernández Díaz", phone: "+523315551234", avatarUrl: null, createdAt: daysAgo(90) },
  { id: "usr_04", email: "ana.garcia@grupobajio.mx", name: "Ana García Morales", phone: null, avatarUrl: null, createdAt: daysAgo(30) },
];

// =============================================================================
// Members
// =============================================================================

export const members: Member[] = [
  { id: "mem_01", orgId: "org_01", userId: "usr_01", role: "owner", invitedAt: daysAgo(180), acceptedAt: daysAgo(180), user: users[0] },
  { id: "mem_02", orgId: "org_01", userId: "usr_02", role: "admin", invitedAt: daysAgo(150), acceptedAt: daysAgo(149), user: users[1] },
  { id: "mem_03", orgId: "org_01", userId: "usr_03", role: "operator", invitedAt: daysAgo(90), acceptedAt: daysAgo(89), user: users[2] },
  { id: "mem_04", orgId: "org_01", userId: "usr_04", role: "viewer", invitedAt: daysAgo(30), acceptedAt: null, user: users[3] },
];

// =============================================================================
// Stores
// =============================================================================

const defaultBusinessHours = {
  monday: { open: "08:00", close: "21:00" }, tuesday: { open: "08:00", close: "21:00" },
  wednesday: { open: "08:00", close: "21:00" }, thursday: { open: "08:00", close: "21:00" },
  friday: { open: "08:00", close: "22:00" }, saturday: { open: "09:00", close: "22:00" },
  sunday: { open: "10:00", close: "18:00" },
};

const warehouseBusinessHours = {
  monday: { open: "06:00", close: "18:00" }, tuesday: { open: "06:00", close: "18:00" },
  wednesday: { open: "06:00", close: "18:00" }, thursday: { open: "06:00", close: "18:00" },
  friday: { open: "06:00", close: "18:00" }, saturday: { open: "07:00", close: "14:00" },
  sunday: { open: "00:00", close: "00:00" },
};

export const stores: Store[] = [
  { id: "sto_01", orgId: "org_01", name: "Sucursal Centro", address: "Av. Chapultepec 432, Col. Americana, Guadalajara, Jalisco", lat: 20.6697, lng: -103.3613, timezone: "America/Mexico_City", businessHours: defaultBusinessHours, createdAt: daysAgo(170), camerasCount: 4, camerasOnline: 3, alertsToday: 5 },
  { id: "sto_02", orgId: "org_01", name: "Sucursal Sur", address: "Av. López Mateos 1890, Col. Chapalita, Guadalajara, Jalisco", lat: 20.6526, lng: -103.4013, timezone: "America/Mexico_City", businessHours: defaultBusinessHours, createdAt: daysAgo(140), camerasCount: 4, camerasOnline: 4, alertsToday: 3 },
  { id: "sto_03", orgId: "org_01", name: "Bodega Norte", address: "Calle Industrial 78, Parque Industrial Belenes, Zapopan, Jalisco", lat: 20.7284, lng: -103.3883, timezone: "America/Mexico_City", businessHours: warehouseBusinessHours, createdAt: daysAgo(100), camerasCount: 2, camerasOnline: 1, alertsToday: 7 },
];

// =============================================================================
// Cameras
// =============================================================================

export const cameras: Camera[] = [
  { id: "cam_01", storeId: "sto_01", name: "Entrada Principal", rtspUrl: "rtsp://192.168.1.10:554/stream1", status: "online", resolution: "1920x1080", fpsTarget: 15, lastFrameAt: ago(1), thumbnailUrl: thumb("Entrada Principal"), createdAt: daysAgo(170), rulesCount: 2, storeName: "Sucursal Centro" },
  { id: "cam_02", storeId: "sto_01", name: "Caja Registradora 1", rtspUrl: "rtsp://192.168.1.11:554/stream1", status: "online", resolution: "1920x1080", fpsTarget: 15, lastFrameAt: ago(1), thumbnailUrl: thumb("Caja Registradora 1"), createdAt: daysAgo(170), rulesCount: 1, storeName: "Sucursal Centro" },
  { id: "cam_03", storeId: "sto_01", name: "Pasillo Central", rtspUrl: "rtsp://192.168.1.12:554/stream1", status: "online", resolution: "1280x720", fpsTarget: 10, lastFrameAt: ago(2), thumbnailUrl: thumb("Pasillo Central"), createdAt: daysAgo(165), rulesCount: 1, storeName: "Sucursal Centro" },
  { id: "cam_04", storeId: "sto_01", name: "Bodega Trasera", rtspUrl: "rtsp://192.168.1.13:554/stream1", status: "offline", resolution: "1280x720", fpsTarget: 10, lastFrameAt: ago(320), thumbnailUrl: thumb("Bodega Trasera"), createdAt: daysAgo(165), rulesCount: 2, storeName: "Sucursal Centro" },
  { id: "cam_05", storeId: "sto_02", name: "Entrada Principal", rtspUrl: "rtsp://192.168.2.10:554/stream1", status: "online", resolution: "1920x1080", fpsTarget: 15, lastFrameAt: ago(1), thumbnailUrl: thumb("Entrada Sur"), createdAt: daysAgo(140), rulesCount: 2, storeName: "Sucursal Sur" },
  { id: "cam_06", storeId: "sto_02", name: "Caja Registradora 1", rtspUrl: "rtsp://192.168.2.11:554/stream1", status: "online", resolution: "1920x1080", fpsTarget: 15, lastFrameAt: ago(1), thumbnailUrl: thumb("Caja Sur"), createdAt: daysAgo(140), rulesCount: 1, storeName: "Sucursal Sur" },
  { id: "cam_07", storeId: "sto_02", name: "Estacionamiento", rtspUrl: "rtsp://192.168.2.12:554/stream1", status: "online", resolution: "2560x1440", fpsTarget: 12, lastFrameAt: ago(1), thumbnailUrl: thumb("Estacionamiento"), createdAt: daysAgo(135), rulesCount: 2, storeName: "Sucursal Sur" },
  { id: "cam_08", storeId: "sto_02", name: "Oficina Gerente", rtspUrl: "rtsp://192.168.2.13:554/stream1", status: "online", resolution: "1280x720", fpsTarget: 10, lastFrameAt: ago(2), thumbnailUrl: thumb("Oficina Gerente"), createdAt: daysAgo(130), rulesCount: 1, storeName: "Sucursal Sur" },
  { id: "cam_09", storeId: "sto_03", name: "Acceso Carga", rtspUrl: "rtsp://192.168.3.10:554/stream1", status: "online", resolution: "1920x1080", fpsTarget: 15, lastFrameAt: ago(1), thumbnailUrl: thumb("Acceso Carga"), createdAt: daysAgo(100), rulesCount: 3, storeName: "Bodega Norte" },
  { id: "cam_10", storeId: "sto_03", name: "Interior Almacén", rtspUrl: "rtsp://192.168.3.11:554/stream1", status: "offline", resolution: "1920x1080", fpsTarget: 15, lastFrameAt: ago(480), thumbnailUrl: thumb("Interior Almacen"), createdAt: daysAgo(100), rulesCount: 2, storeName: "Bodega Norte" },
];

// =============================================================================
// Protocols
// =============================================================================

export const protocols: Protocol[] = [
  { id: "pro_01", orgId: "org_01", name: "Telegram Alertas", type: "telegram_message", configJson: { botToken: "••••••••••", chatId: "-1001234567890", includeScreenshot: true, messageTemplate: "{{rule_name}} en {{store_name}} — {{camera_name}} ({{confidence}}%)" }, isActive: true, createdAt: daysAgo(160), usedByRulesCount: 3 },
  { id: "pro_02", orgId: "org_01", name: "Llamar al dueño", type: "phone_call", configJson: { provider: "twilio", toNumber: "+523312345678", fromNumber: "+15551234567", voiceMessage: "Alerta de seguridad en {{store_name}}. Tipo: {{rule_name}}. Revise la aplicación.", maxRetries: 2 }, isActive: true, createdAt: daysAgo(155), usedByRulesCount: 2 },
  { id: "pro_03", orgId: "org_01", name: "Webhook POS", type: "webhook", configJson: { url: "https://pos.grupobajio.mx/api/webhooks/security", method: "POST", headers: { Authorization: "Bearer ••••••" }, includeClip: false }, isActive: true, createdAt: daysAgo(120), usedByRulesCount: 1 },
];

// =============================================================================
// Alert Rules
// =============================================================================

export const alertRules: AlertRule[] = [
  {
    id: "rul_01", orgId: "org_01", name: "Intrusión nocturna",
    description: "Detecta personas fuera de horario laboral (22:00-06:00) en todas las sucursales.",
    type: "person_detected", confidenceThreshold: 0.7, cooldownSeconds: 300,
    scheduleJson: { type: "time_range", startTime: "22:00", endTime: "06:00", days: ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"] },
    zoneConfigJson: null, isActive: true, createdAt: daysAgo(150), camerasCount: 6, protocolsCount: 2,
    protocols: [protocols[0], protocols[1]],
    cameras: [cameras[0], cameras[3], cameras[4], cameras[6], cameras[8], cameras[9]],
  },
  {
    id: "rul_02", orgId: "org_01", name: "Arma detectada",
    description: "Alerta inmediata cuando el modelo detecta un arma visible en cualquier cámara.",
    type: "weapon", confidenceThreshold: 0.6, cooldownSeconds: 60,
    scheduleJson: { type: "always" },
    zoneConfigJson: null, isActive: true, createdAt: daysAgo(150), camerasCount: 10, protocolsCount: 2,
    protocols: [protocols[0], protocols[1]],
    cameras: [...cameras],
  },
  {
    id: "rul_03", orgId: "org_01", name: "Fuego / Humo",
    description: "Detecta fuego o humo visible para activar protocolo de emergencia.",
    type: "fire", confidenceThreshold: 0.75, cooldownSeconds: 120,
    scheduleJson: { type: "always" },
    zoneConfigJson: null, isActive: true, createdAt: daysAgo(145), camerasCount: 10, protocolsCount: 3,
    protocols: [protocols[0], protocols[1], protocols[2]],
    cameras: [...cameras],
  },
  {
    id: "rul_04", orgId: "org_01", name: "Persona en zona restringida",
    description: "Detecta presencia humana en zonas delimitadas como restringidas (bodega, servidor, caja fuerte).",
    type: "intrusion", confidenceThreshold: 0.8, cooldownSeconds: 180,
    scheduleJson: { type: "always" },
    zoneConfigJson: { zones: [{ id: "z1", label: "Bodega", polygon: [[0.1,0.2],[0.9,0.2],[0.9,0.8],[0.1,0.8]] }, { id: "z2", label: "Servidor", polygon: [[0.3,0.3],[0.7,0.3],[0.7,0.7],[0.3,0.7]] }] },
    isActive: true, createdAt: daysAgo(140), camerasCount: 4, protocolsCount: 1,
    protocols: [protocols[0]],
    cameras: [cameras[3], cameras[7], cameras[8], cameras[9]],
  },
];

// =============================================================================
// Alert Events (last 24 h)
// =============================================================================

export const alertEvents: AlertEvent[] = [
  { id: "evt_01", orgId: "org_01", storeId: "sto_03", cameraId: "cam_09", alertRuleId: "rul_01", timestamp: ago(18), confidence: 0.92, boundingBoxJson: { x: 320, y: 140, w: 120, h: 280 }, screenshotUrl: thumb("Alerta+Intrusion"), clipUrl: null, status: "triggered", acknowledgedByUserId: null, acknowledgedAt: null, notes: null, storeName: "Bodega Norte", cameraName: "Acceso Carga", ruleName: "Intrusión nocturna", ruleType: "person_detected" },
  { id: "evt_02", orgId: "org_01", storeId: "sto_01", cameraId: "cam_01", alertRuleId: "rul_02", timestamp: ago(45), confidence: 0.73, boundingBoxJson: { x: 480, y: 200, w: 60, h: 90 }, screenshotUrl: thumb("Alerta+Arma"), clipUrl: null, status: "acknowledged", acknowledgedByUserId: "usr_01", acknowledgedAt: ago(40), notes: "Revisado — objeto era un paraguas oscuro.", storeName: "Sucursal Centro", cameraName: "Entrada Principal", ruleName: "Arma detectada", ruleType: "weapon" },
  { id: "evt_03", orgId: "org_01", storeId: "sto_02", cameraId: "cam_07", alertRuleId: "rul_01", timestamp: ago(78), confidence: 0.85, boundingBoxJson: { x: 100, y: 50, w: 200, h: 350 }, screenshotUrl: thumb("Alerta+Estacionamiento"), clipUrl: null, status: "false_alarm", acknowledgedByUserId: "usr_02", acknowledgedAt: ago(72), notes: "Guardia de seguridad haciendo ronda.", storeName: "Sucursal Sur", cameraName: "Estacionamiento", ruleName: "Intrusión nocturna", ruleType: "person_detected" },
  { id: "evt_04", orgId: "org_01", storeId: "sto_03", cameraId: "cam_09", alertRuleId: "rul_04", timestamp: ago(125), confidence: 0.88, boundingBoxJson: { x: 200, y: 100, w: 150, h: 300 }, screenshotUrl: thumb("Zona+Restringida"), clipUrl: null, status: "resolved", acknowledgedByUserId: "usr_03", acknowledgedAt: ago(118), notes: "Empleado autorizado, se actualizó la zona.", storeName: "Bodega Norte", cameraName: "Acceso Carga", ruleName: "Persona en zona restringida", ruleType: "intrusion" },
  { id: "evt_05", orgId: "org_01", storeId: "sto_01", cameraId: "cam_03", alertRuleId: "rul_03", timestamp: ago(190), confidence: 0.78, boundingBoxJson: { x: 400, y: 300, w: 180, h: 120 }, screenshotUrl: thumb("Alerta+Humo"), clipUrl: null, status: "false_alarm", acknowledgedByUserId: "usr_01", acknowledgedAt: ago(182), notes: "Vapor del área de cocina del local contiguo.", storeName: "Sucursal Centro", cameraName: "Pasillo Central", ruleName: "Fuego / Humo", ruleType: "fire" },
  { id: "evt_06", orgId: "org_01", storeId: "sto_02", cameraId: "cam_05", alertRuleId: "rul_01", timestamp: ago(260), confidence: 0.71, boundingBoxJson: { x: 150, y: 80, w: 110, h: 260 }, screenshotUrl: thumb("Intrusion+Sur"), clipUrl: null, status: "resolved", acknowledgedByUserId: "usr_02", acknowledgedAt: ago(250), notes: "Personal de limpieza llegó temprano.", storeName: "Sucursal Sur", cameraName: "Entrada Principal", ruleName: "Intrusión nocturna", ruleType: "person_detected" },
  { id: "evt_07", orgId: "org_01", storeId: "sto_01", cameraId: "cam_02", alertRuleId: "rul_02", timestamp: ago(340), confidence: 0.64, boundingBoxJson: { x: 510, y: 220, w: 55, h: 85 }, screenshotUrl: thumb("Alerta+Caja"), clipUrl: null, status: "false_alarm", acknowledgedByUserId: "usr_01", acknowledgedAt: ago(330), notes: "Reflejo metálico del escáner de código de barras.", storeName: "Sucursal Centro", cameraName: "Caja Registradora 1", ruleName: "Arma detectada", ruleType: "weapon" },
  { id: "evt_08", orgId: "org_01", storeId: "sto_03", cameraId: "cam_09", alertRuleId: "rul_04", timestamp: ago(410), confidence: 0.91, boundingBoxJson: { x: 280, y: 90, w: 140, h: 310 }, screenshotUrl: thumb("Zona+Bodega"), clipUrl: null, status: "triggered", acknowledgedByUserId: null, acknowledgedAt: null, notes: null, storeName: "Bodega Norte", cameraName: "Acceso Carga", ruleName: "Persona en zona restringida", ruleType: "intrusion" },
  { id: "evt_09", orgId: "org_01", storeId: "sto_02", cameraId: "cam_08", alertRuleId: "rul_04", timestamp: ago(500), confidence: 0.82, boundingBoxJson: { x: 350, y: 180, w: 100, h: 240 }, screenshotUrl: thumb("Oficina+Alerta"), clipUrl: null, status: "acknowledged", acknowledgedByUserId: "usr_02", acknowledgedAt: ago(490), notes: "Gerente entrando fuera de horario — se le recordó registrar acceso.", storeName: "Sucursal Sur", cameraName: "Oficina Gerente", ruleName: "Persona en zona restringida", ruleType: "intrusion" },
  { id: "evt_10", orgId: "org_01", storeId: "sto_01", cameraId: "cam_01", alertRuleId: "rul_01", timestamp: ago(620), confidence: 0.76, boundingBoxJson: { x: 220, y: 60, w: 130, h: 290 }, screenshotUrl: thumb("Nocturna+Centro"), clipUrl: null, status: "resolved", acknowledgedByUserId: "usr_03", acknowledgedAt: ago(610), notes: "Repartidor dejó paquete fuera de horario.", storeName: "Sucursal Centro", cameraName: "Entrada Principal", ruleName: "Intrusión nocturna", ruleType: "person_detected" },
  { id: "evt_11", orgId: "org_01", storeId: "sto_03", cameraId: "cam_09", alertRuleId: "rul_03", timestamp: ago(720), confidence: 0.79, boundingBoxJson: { x: 440, y: 260, w: 160, h: 100 }, screenshotUrl: thumb("Humo+Bodega"), clipUrl: null, status: "resolved", acknowledgedByUserId: "usr_01", acknowledgedAt: ago(705), notes: "Montacargas emitiendo humo — se reportó a mantenimiento.", storeName: "Bodega Norte", cameraName: "Acceso Carga", ruleName: "Fuego / Humo", ruleType: "fire" },
  { id: "evt_12", orgId: "org_01", storeId: "sto_02", cameraId: "cam_06", alertRuleId: "rul_02", timestamp: ago(840), confidence: 0.67, boundingBoxJson: { x: 390, y: 190, w: 70, h: 95 }, screenshotUrl: thumb("Arma+Caja+Sur"), clipUrl: null, status: "false_alarm", acknowledgedByUserId: "usr_02", acknowledgedAt: ago(832), notes: "Cliente con herramienta de trabajo (desarmador grande).", storeName: "Sucursal Sur", cameraName: "Caja Registradora 1", ruleName: "Arma detectada", ruleType: "weapon" },
  { id: "evt_13", orgId: "org_01", storeId: "sto_01", cameraId: "cam_04", alertRuleId: "rul_04", timestamp: ago(980), confidence: 0.86, boundingBoxJson: { x: 260, y: 110, w: 130, h: 280 }, screenshotUrl: thumb("Bodega+Trasera"), clipUrl: null, status: "acknowledged", acknowledgedByUserId: "usr_03", acknowledgedAt: ago(970), notes: "Proveedor sin gafete, se le escoltó.", storeName: "Sucursal Centro", cameraName: "Bodega Trasera", ruleName: "Persona en zona restringida", ruleType: "intrusion" },
  { id: "evt_14", orgId: "org_01", storeId: "sto_03", cameraId: "cam_09", alertRuleId: "rul_01", timestamp: ago(1120), confidence: 0.94, boundingBoxJson: { x: 180, y: 70, w: 140, h: 320 }, screenshotUrl: thumb("Nocturna+Bodega"), clipUrl: null, status: "triggered", acknowledgedByUserId: null, acknowledgedAt: null, notes: null, storeName: "Bodega Norte", cameraName: "Acceso Carga", ruleName: "Intrusión nocturna", ruleType: "person_detected" },
  { id: "evt_15", orgId: "org_01", storeId: "sto_02", cameraId: "cam_07", alertRuleId: "rul_03", timestamp: ago(1350), confidence: 0.77, boundingBoxJson: { x: 500, y: 310, w: 100, h: 70 }, screenshotUrl: thumb("Fuego+Estacionamiento"), clipUrl: null, status: "false_alarm", acknowledgedByUserId: "usr_01", acknowledgedAt: ago(1340), notes: "Reflejo de sol en charco de agua — falso positivo.", storeName: "Sucursal Sur", cameraName: "Estacionamiento", ruleName: "Fuego / Humo", ruleType: "fire" },
];

// =============================================================================
// Protocol Executions
// =============================================================================

export const protocolExecutions: ProtocolExecution[] = [
  { id: "pex_01", alertEventId: "evt_01", protocolId: "pro_01", status: "delivered", executedAt: ago(17), responseJson: { messageId: 98234, chatId: "-1001234567890" } },
  { id: "pex_02", alertEventId: "evt_01", protocolId: "pro_02", status: "delivered", executedAt: ago(17), responseJson: { callSid: "CA_abc123", duration: 22 } },
  { id: "pex_03", alertEventId: "evt_02", protocolId: "pro_01", status: "delivered", executedAt: ago(44), responseJson: { messageId: 98210, chatId: "-1001234567890" } },
  { id: "pex_04", alertEventId: "evt_02", protocolId: "pro_02", status: "failed", executedAt: ago(44), responseJson: { error: "No answer after 3 attempts" } },
  { id: "pex_05", alertEventId: "evt_05", protocolId: "pro_01", status: "delivered", executedAt: ago(189), responseJson: { messageId: 98105, chatId: "-1001234567890" } },
  { id: "pex_06", alertEventId: "evt_05", protocolId: "pro_03", status: "delivered", executedAt: ago(189), responseJson: { httpStatus: 200, body: { received: true } } },
  { id: "pex_07", alertEventId: "evt_08", protocolId: "pro_01", status: "sent", executedAt: ago(409), responseJson: null },
  { id: "pex_08", alertEventId: "evt_11", protocolId: "pro_01", status: "delivered", executedAt: ago(719), responseJson: { messageId: 97950, chatId: "-1001234567890" } },
  { id: "pex_09", alertEventId: "evt_11", protocolId: "pro_02", status: "delivered", executedAt: ago(719), responseJson: { callSid: "CA_def456", duration: 18 } },
  { id: "pex_10", alertEventId: "evt_11", protocolId: "pro_03", status: "delivered", executedAt: ago(718), responseJson: { httpStatus: 200, body: { received: true } } },
];

// =============================================================================
// Integrations
// =============================================================================

export const integrations: Integration[] = [
  { id: "int_01", orgId: "org_01", type: "telegram", configJson: { botUsername: "@CamaronAlertBot", chatId: "-1001234567890", chatTitle: "Alertas Grupo Bajio", connectedChannels: 3 }, status: "connected", connectedAt: daysAgo(160) },
  { id: "int_02", orgId: "org_01", type: "webhook", configJson: { provider: "twilio", accountSid: "AC--------", fromNumber: "+15551234567", balance: "$42.50 USD" }, status: "connected", connectedAt: daysAgo(155) },
  { id: "int_03", orgId: "org_01", type: "whatsapp", configJson: {}, status: "disconnected", connectedAt: null },
  { id: "int_04", orgId: "org_01", type: "slack", configJson: {}, status: "disconnected", connectedAt: null },
];

// =============================================================================
// Dashboard Stats
// =============================================================================

export const dashboardStats: DashboardStats = {
  camerasOnline: 8,
  camerasTotal: 10,
  storesActive: 3,
  storesTotal: 3,
  alertsToday: 15,
  alertsWeek: 47,
  offlineCameras: 2,
};

// =============================================================================
// Query Helpers
// =============================================================================

export function getCamerasForStore(storeId: string): Camera[] {
  return cameras.filter((c) => c.storeId === storeId);
}

export function getAlertsForStore(storeId: string): AlertEvent[] {
  return alertEvents.filter((a) => a.storeId === storeId);
}

export function getRulesForStore(storeId: string): AlertRule[] {
  const storeCameraIds = new Set(cameras.filter((c) => c.storeId === storeId).map((c) => c.id));
  return alertRules.filter((r) => r.cameras.some((c) => storeCameraIds.has(c.id)));
}

export function getStoreById(storeId: string): Store | undefined {
  return stores.find((s) => s.id === storeId);
}

// =============================================================================
// Notification Settings
// =============================================================================

export const notificationSettings: NotificationSettings = {
  emailAlerts: true,
  pushNotifications: true,
  criticalOnly: false,
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
};

// =============================================================================
// Camera Templates
// =============================================================================

// =============================================================================
// Analytics — Foot Traffic
// =============================================================================

const generateHourlyData = (base: number) =>
  Array.from({ length: 14 }, (_, i) => {
    const hour = (8 + i).toString().padStart(2, "0") + ":00";
    const factor = i < 3 ? 0.4 : i < 6 ? 0.8 : i < 9 ? 1.0 : i < 12 ? 0.7 : 0.3;
    const entries = Math.round(base * factor * (0.85 + Math.random() * 0.3));
    const exits = Math.round(entries * (0.75 + Math.random() * 0.4));
    return { hour, entries, exits };
  });

export const trafficByStore: TrafficByStore[] = [
  { storeId: "sto_01", storeName: "Sucursal Centro", todayVisitors: 847, yesterdayVisitors: 792, weeklyAvg: 810, peakHour: "13:00", hourlyData: generateHourlyData(80) },
  { storeId: "sto_02", storeName: "Sucursal Sur", todayVisitors: 623, yesterdayVisitors: 658, weeklyAvg: 640, peakHour: "14:00", hourlyData: generateHourlyData(60) },
  { storeId: "sto_03", storeName: "Bodega Norte", todayVisitors: 124, yesterdayVisitors: 118, weeklyAvg: 115, peakHour: "10:00", hourlyData: generateHourlyData(15) },
];

export const dailyTraffic: DailyTraffic[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 2, 26) - i * 86_400_000);
  const dateStr = d.toISOString().slice(0, 10);
  const base = 1400 + Math.round(Math.sin(i * 0.5) * 200 + Math.random() * 150);
  return { date: dateStr, visitors: base, entries: Math.round(base * 1.05), exits: Math.round(base * 0.98) };
});

// =============================================================================
// Analytics — Queue Management
// =============================================================================

const generateSnapshots = (avgLen: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    timestamp: ago(i * 15),
    queueLength: Math.max(0, Math.round(avgLen + (Math.random() - 0.5) * avgLen * 0.8)),
    avgWaitMinutes: Math.round((avgLen * 2.5 + (Math.random() - 0.5) * 3) * 10) / 10,
  }));

export const queuePoints: QueuePoint[] = [
  { id: "q_01", storeId: "sto_01", storeName: "Sucursal Centro", name: "Caja 1", cameraId: "cam_02", currentLength: 4, avgWaitMinutes: 6.2, maxWaitMinutes: 12, status: "normal", snapshots: generateSnapshots(4) },
  { id: "q_02", storeId: "sto_01", storeName: "Sucursal Centro", name: "Caja 2", cameraId: "cam_03", currentLength: 8, avgWaitMinutes: 11.5, maxWaitMinutes: 18, status: "busy", snapshots: generateSnapshots(7) },
  { id: "q_03", storeId: "sto_02", storeName: "Sucursal Sur", name: "Caja Principal", cameraId: "cam_06", currentLength: 3, avgWaitMinutes: 4.8, maxWaitMinutes: 9, status: "normal", snapshots: generateSnapshots(3) },
  { id: "q_04", storeId: "sto_02", storeName: "Sucursal Sur", name: "Servicio al Cliente", cameraId: "cam_08", currentLength: 11, avgWaitMinutes: 15.3, maxWaitMinutes: 25, status: "critical", snapshots: generateSnapshots(10) },
];

// =============================================================================
// Analytics — Heatmaps
// =============================================================================

export const storeHeatmaps: StoreHeatmapData[] = [
  {
    storeId: "sto_01", storeName: "Sucursal Centro",
    zones: [
      { zoneId: "z01", zoneName: "Entrada", activityLevel: 95, dwellTimeAvg: 15, visitorCount: 820 },
      { zoneId: "z02", zoneName: "Pasillo Central", activityLevel: 78, dwellTimeAvg: 45, visitorCount: 650 },
      { zoneId: "z03", zoneName: "Electrónicos", activityLevel: 62, dwellTimeAvg: 120, visitorCount: 340 },
      { zoneId: "z04", zoneName: "Ropa", activityLevel: 55, dwellTimeAvg: 90, visitorCount: 290 },
      { zoneId: "z05", zoneName: "Cajas", activityLevel: 85, dwellTimeAvg: 180, visitorCount: 710 },
      { zoneId: "z06", zoneName: "Bodega", activityLevel: 12, dwellTimeAvg: 30, visitorCount: 45 },
    ],
    grid: [
      [95, 85, 60, 45, 30, 20, 15, 10],
      [90, 78, 65, 55, 40, 35, 25, 12],
      [70, 62, 58, 50, 45, 42, 30, 15],
      [55, 50, 48, 55, 60, 55, 35, 18],
      [40, 45, 50, 62, 70, 65, 40, 20],
      [85, 80, 75, 70, 85, 80, 50, 12],
    ],
  },
  {
    storeId: "sto_02", storeName: "Sucursal Sur",
    zones: [
      { zoneId: "z07", zoneName: "Entrada", activityLevel: 88, dwellTimeAvg: 12, visitorCount: 600 },
      { zoneId: "z08", zoneName: "Promociones", activityLevel: 72, dwellTimeAvg: 60, visitorCount: 420 },
      { zoneId: "z09", zoneName: "Alimentos", activityLevel: 80, dwellTimeAvg: 75, visitorCount: 510 },
      { zoneId: "z10", zoneName: "Hogar", activityLevel: 45, dwellTimeAvg: 95, visitorCount: 210 },
      { zoneId: "z11", zoneName: "Cajas", activityLevel: 82, dwellTimeAvg: 150, visitorCount: 560 },
      { zoneId: "z12", zoneName: "Estacionamiento", activityLevel: 65, dwellTimeAvg: 20, visitorCount: 580 },
    ],
    grid: [
      [88, 80, 55, 40, 35, 25, 20, 65],
      [82, 72, 60, 50, 45, 38, 30, 60],
      [75, 68, 80, 70, 55, 42, 35, 50],
      [60, 55, 75, 65, 50, 45, 38, 40],
      [50, 48, 60, 55, 48, 42, 35, 35],
      [82, 78, 72, 68, 82, 75, 50, 30],
    ],
  },
  {
    storeId: "sto_03", storeName: "Bodega Norte",
    zones: [
      { zoneId: "z13", zoneName: "Acceso Carga", activityLevel: 70, dwellTimeAvg: 25, visitorCount: 95 },
      { zoneId: "z14", zoneName: "Almacén A", activityLevel: 45, dwellTimeAvg: 300, visitorCount: 40 },
      { zoneId: "z15", zoneName: "Almacén B", activityLevel: 35, dwellTimeAvg: 240, visitorCount: 30 },
      { zoneId: "z16", zoneName: "Oficina", activityLevel: 55, dwellTimeAvg: 180, visitorCount: 25 },
    ],
    grid: [
      [70, 60, 45, 35, 30, 25, 20, 15],
      [65, 55, 45, 40, 35, 30, 22, 12],
      [50, 45, 40, 35, 35, 28, 20, 10],
      [40, 38, 35, 55, 50, 35, 18, 8],
      [30, 28, 30, 45, 40, 30, 15, 8],
      [25, 22, 25, 35, 30, 25, 12, 5],
    ],
  },
];

// =============================================================================
// Analytics — Customer Journey
// =============================================================================

export const journeyData: JourneyData[] = [
  {
    storeId: "sto_01", storeName: "Sucursal Centro",
    transitions: [
      { fromZone: "Entrada", toZone: "Pasillo Central", count: 680, avgDurationSeconds: 30 },
      { fromZone: "Pasillo Central", toZone: "Electrónicos", count: 310, avgDurationSeconds: 45 },
      { fromZone: "Pasillo Central", toZone: "Ropa", count: 260, avgDurationSeconds: 40 },
      { fromZone: "Electrónicos", toZone: "Cajas", count: 220, avgDurationSeconds: 60 },
      { fromZone: "Ropa", toZone: "Cajas", count: 180, avgDurationSeconds: 55 },
      { fromZone: "Pasillo Central", toZone: "Cajas", count: 150, avgDurationSeconds: 35 },
      { fromZone: "Cajas", toZone: "Entrada", count: 540, avgDurationSeconds: 25 },
      { fromZone: "Electrónicos", toZone: "Ropa", count: 80, avgDurationSeconds: 50 },
    ],
    topPaths: [
      { path: ["Entrada", "Pasillo Central", "Electrónicos", "Cajas", "Entrada"], percentage: 28 },
      { path: ["Entrada", "Pasillo Central", "Ropa", "Cajas", "Entrada"], percentage: 22 },
      { path: ["Entrada", "Pasillo Central", "Cajas", "Entrada"], percentage: 18 },
      { path: ["Entrada", "Pasillo Central", "Electrónicos", "Ropa", "Cajas", "Entrada"], percentage: 10 },
    ],
    avgVisitDuration: 22,
    avgZonesVisited: 3.4,
  },
  {
    storeId: "sto_02", storeName: "Sucursal Sur",
    transitions: [
      { fromZone: "Entrada", toZone: "Promociones", count: 380, avgDurationSeconds: 25 },
      { fromZone: "Entrada", toZone: "Alimentos", count: 280, avgDurationSeconds: 30 },
      { fromZone: "Promociones", toZone: "Alimentos", count: 210, avgDurationSeconds: 40 },
      { fromZone: "Alimentos", toZone: "Cajas", count: 350, avgDurationSeconds: 50 },
      { fromZone: "Promociones", toZone: "Hogar", count: 120, avgDurationSeconds: 45 },
      { fromZone: "Hogar", toZone: "Cajas", count: 100, avgDurationSeconds: 55 },
      { fromZone: "Cajas", toZone: "Estacionamiento", count: 420, avgDurationSeconds: 20 },
    ],
    topPaths: [
      { path: ["Entrada", "Promociones", "Alimentos", "Cajas", "Estacionamiento"], percentage: 32 },
      { path: ["Entrada", "Alimentos", "Cajas", "Estacionamiento"], percentage: 25 },
      { path: ["Entrada", "Promociones", "Hogar", "Cajas", "Estacionamiento"], percentage: 15 },
    ],
    avgVisitDuration: 18,
    avgZonesVisited: 3.1,
  },
];

// =============================================================================
// Analytics — Customer Satisfaction (NPS)
// =============================================================================

export const npsData: NPSData[] = [
  {
    storeId: "sto_01", storeName: "Sucursal Centro", npsScore: 42,
    promoters: 156, passives: 78, detractors: 52, totalResponses: 286,
    trend: [
      { month: "2025-10", nps: 35 }, { month: "2025-11", nps: 38 },
      { month: "2025-12", nps: 40 }, { month: "2026-01", nps: 36 },
      { month: "2026-02", nps: 44 }, { month: "2026-03", nps: 42 },
    ],
  },
  {
    storeId: "sto_02", storeName: "Sucursal Sur", npsScore: 55,
    promoters: 190, passives: 60, detractors: 38, totalResponses: 288,
    trend: [
      { month: "2025-10", nps: 48 }, { month: "2025-11", nps: 50 },
      { month: "2025-12", nps: 52 }, { month: "2026-01", nps: 54 },
      { month: "2026-02", nps: 58 }, { month: "2026-03", nps: 55 },
    ],
  },
  {
    storeId: "sto_03", storeName: "Bodega Norte", npsScore: 28,
    promoters: 22, passives: 18, detractors: 15, totalResponses: 55,
    trend: [
      { month: "2025-10", nps: 20 }, { month: "2025-11", nps: 25 },
      { month: "2025-12", nps: 30 }, { month: "2026-01", nps: 22 },
      { month: "2026-02", nps: 32 }, { month: "2026-03", nps: 28 },
    ],
  },
];

export const surveyResponses: SurveyResponse[] = [
  { id: "srv_01", storeId: "sto_01", storeName: "Sucursal Centro", date: daysAgo(1), score: 9, comment: "Excelente atención, todo muy rápido.", channel: "qr" },
  { id: "srv_02", storeId: "sto_01", storeName: "Sucursal Centro", date: daysAgo(1), score: 7, comment: "Buena experiencia, las filas un poco largas.", channel: "email" },
  { id: "srv_03", storeId: "sto_02", storeName: "Sucursal Sur", date: daysAgo(1), score: 10, comment: "Me encantó la sección de promociones.", channel: "qr" },
  { id: "srv_04", storeId: "sto_02", storeName: "Sucursal Sur", date: daysAgo(2), score: 8, comment: null, channel: "sms" },
  { id: "srv_05", storeId: "sto_01", storeName: "Sucursal Centro", date: daysAgo(2), score: 3, comment: "Muy lenta la caja, esperé 20 minutos.", channel: "qr" },
  { id: "srv_06", storeId: "sto_03", storeName: "Bodega Norte", date: daysAgo(2), score: 6, comment: "Difícil encontrar productos sin señalización.", channel: "email" },
  { id: "srv_07", storeId: "sto_02", storeName: "Sucursal Sur", date: daysAgo(3), score: 9, comment: "El personal muy amable.", channel: "qr" },
  { id: "srv_08", storeId: "sto_01", storeName: "Sucursal Centro", date: daysAgo(3), score: 8, comment: "Buen surtido de productos.", channel: "sms" },
  { id: "srv_09", storeId: "sto_03", storeName: "Bodega Norte", date: daysAgo(3), score: 4, comment: "No hay suficiente personal.", channel: "qr" },
  { id: "srv_10", storeId: "sto_02", storeName: "Sucursal Sur", date: daysAgo(4), score: 10, comment: "Siempre vengo aquí, la mejor sucursal.", channel: "email" },
  { id: "srv_11", storeId: "sto_01", storeName: "Sucursal Centro", date: daysAgo(4), score: 5, comment: "El estacionamiento estaba lleno.", channel: "qr" },
  { id: "srv_12", storeId: "sto_02", storeName: "Sucursal Sur", date: daysAgo(5), score: 9, comment: null, channel: "sms" },
  { id: "srv_13", storeId: "sto_03", storeName: "Bodega Norte", date: daysAgo(5), score: 7, comment: "Precios buenos pero falta variedad.", channel: "qr" },
  { id: "srv_14", storeId: "sto_01", storeName: "Sucursal Centro", date: daysAgo(6), score: 8, comment: "Rápida atención en caja.", channel: "email" },
  { id: "srv_15", storeId: "sto_02", storeName: "Sucursal Sur", date: daysAgo(6), score: 2, comment: "Producto dañado y no quisieron cambiar.", channel: "qr" },
];

// =============================================================================
// Analytics — Store Performance
// =============================================================================

const generateDailyPerformance = (baseVisitors: number, baseConversion: number) =>
  Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 2, 26) - i * 86_400_000);
    const visitors = Math.round(baseVisitors * (0.85 + Math.random() * 0.3));
    const conversionRate = Math.round((baseConversion + (Math.random() - 0.5) * 8) * 10) / 10;
    const transactions = Math.round(visitors * conversionRate / 100);
    return { date: d.toISOString().slice(0, 10), visitors, transactions, conversionRate };
  });

export const storePerformances: StorePerformance[] = [
  { storeId: "sto_01", storeName: "Sucursal Centro", visitors: 847, transactions: 312, conversionRate: 36.8, avgDwellTime: 22, revenuePerVisitor: 185, dailyData: generateDailyPerformance(120, 37) },
  { storeId: "sto_02", storeName: "Sucursal Sur", visitors: 623, transactions: 268, conversionRate: 43.0, avgDwellTime: 18, revenuePerVisitor: 210, dailyData: generateDailyPerformance(90, 43) },
  { storeId: "sto_03", storeName: "Bodega Norte", visitors: 124, transactions: 31, conversionRate: 25.0, avgDwellTime: 35, revenuePerVisitor: 420, dailyData: generateDailyPerformance(18, 25) },
];

// =============================================================================
// Analytics — Summary
// =============================================================================

export const analyticsSummary: AnalyticsSummary = {
  totalVisitorsToday: 1594,
  totalVisitorsWeek: 10780,
  avgConversionRate: 34.9,
  avgNPS: 42,
  avgDwellTime: 25,
  busiestStore: "Sucursal Centro",
  busiestHour: "13:00",
  activeQueues: 4,
  criticalQueues: 1,
  weeklyTrend: Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 2, 26) - i * 86_400_000);
    return { date: d.toISOString().slice(0, 10), visitors: 1400 + Math.round(Math.random() * 400) };
  }).reverse(),
};

// =============================================================================
// Analytics — Query Helpers
// =============================================================================

export function getTrafficForStore(storeId: string): TrafficByStore | undefined {
  return trafficByStore.find((t) => t.storeId === storeId);
}

export function getQueuesForStore(storeId: string): QueuePoint[] {
  return queuePoints.filter((q) => q.storeId === storeId);
}

export function getHeatmapForStore(storeId: string): StoreHeatmapData | undefined {
  return storeHeatmaps.find((h) => h.storeId === storeId);
}

export function getJourneyForStore(storeId: string): JourneyData | undefined {
  return journeyData.find((j) => j.storeId === storeId);
}

export function getNPSForStore(storeId: string): NPSData | undefined {
  return npsData.find((n) => n.storeId === storeId);
}

export function getPerformanceForStore(storeId: string): StorePerformance | undefined {
  return storePerformances.find((p) => p.storeId === storeId);
}

export const cameraTemplates: CameraTemplate[] = [
  {
    brand: "Hikvision",
    urlTemplate: "rtsp://{user}:{password}@{ip}:554/Streaming/Channels/{channel}01",
    defaultUser: "admin",
    defaultPassword: "",
    defaultChannel: "1",
    streamQualities: ["main", "sub"],
  },
  {
    brand: "Dahua",
    urlTemplate: "rtsp://{user}:{password}@{ip}:554/cam/realmonitor?channel={channel}&subtype=0",
    defaultUser: "admin",
    defaultPassword: "",
    defaultChannel: "1",
    streamQualities: ["main", "sub", "extra"],
  },
  {
    brand: "Reolink",
    urlTemplate: "rtsp://{user}:{password}@{ip}:554/h264Preview_{channel}_main",
    defaultUser: "admin",
    defaultPassword: "",
    defaultChannel: "01",
    streamQualities: ["main", "sub"],
  },
  {
    brand: "TP-Link",
    urlTemplate: "rtsp://{user}:{password}@{ip}:554/stream{channel}",
    defaultUser: "admin",
    defaultPassword: "",
    defaultChannel: "1",
    streamQualities: ["main", "sub"],
  },
  {
    brand: "Generic",
    urlTemplate: "rtsp://{user}:{password}@{ip}:554/stream{channel}",
    defaultUser: "admin",
    defaultPassword: "",
    defaultChannel: "1",
    streamQualities: ["main"],
  },
];
