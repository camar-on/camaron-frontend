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
