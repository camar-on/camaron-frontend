"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Phone,
  FileText,
  Sparkles,
  Bot,
  User,
  Shield,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAgent } from "@/lib/agent-context";

/* ── Types ────────────────────────────────────────────────────────── */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "report";
}

/* ── Mock conversation seed ───────────────────────────────────────── */

const seedMessages: Message[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Hola JuanJo. Soy tu asistente de seguridad camar-On. Puedo ayudarte con el estado de tus tiendas, generar reportes de incidentes, o analizar patrones de alertas. ¿En qué te puedo ayudar?",
    timestamp: new Date(Date.now() - 60000),
    type: "text",
  },
];

/* ── Simulated alert messages (fire automatically) ────────────────── */

const scheduledAlerts = [
  {
    delay: 15000,
    content:
      "🚨 **Alerta en tiempo real** — Se detectó una persona en zona restringida en **Bodega Norte**, cámara Acceso Carga. Confianza: 88%. ¿Quieres que abra el monitor en vivo?",
  },
  {
    delay: 45000,
    content:
      "⚠️ **Aviso** — La cámara Interior Almacén en **Bodega Norte** acaba de volver a estar online después de 8 horas offline. Revisando el feed...",
  },
];

/* ── Simulated responses ──────────────────────────────────────────── */

function getAutoResponse(input: string): { content: string; type: "text" | "report" } {
  const lower = input.toLowerCase();

  if (lower.includes("reporte") || lower.includes("report") || lower.includes("resumen")) {
    return {
      type: "report",
      content: `📊 **Reporte de Seguridad — 26 Feb 2026**

---

**Resumen General**
- Tiendas activas: **3/3**
- Cámaras en línea: **8/10** (2 offline)
- Alertas hoy: **15 eventos**
- Alertas falsas: **4 (27%)**
- Tiempo promedio de respuesta: **4.2 min**

---

**🔴 Incidentes Críticos**
1. **Arma detectada** — Sucursal Centro, Entrada Principal (22:15) — Confianza: 87% — Reconocido: paraguas oscuro
2. **Intrusión nocturna** — Bodega Norte, Acceso Carga (03:42) — Sin reconocer

**⚠️ Cámaras Offline**
- Bodega Trasera (Sucursal Centro) — offline hace 5h 20min
- Interior Almacén (Bodega Norte) — offline hace 8h

**📈 Tendencias**
- Las alertas de intrusión aumentaron **23%** esta semana vs. la anterior
- Sucursal Sur tiene el menor índice de falsas alarmas (12%)
- Bodega Norte concentra el **47%** de todas las alertas

**💡 Recomendaciones**
1. Revisar conectividad de las 2 cámaras offline
2. Ajustar zona de detección en Acceso Carga (muchas alertas repetidas)
3. Considerar agregar cámara adicional en estacionamiento de Bodega Norte`,
    };
  }

  if (lower.includes("bodega") || lower.includes("norte")) {
    return {
      type: "text",
      content:
        "**Bodega Norte** tiene actividad inusual hoy: 7 alertas, la mayoría en Acceso Carga. La cámara Interior Almacén está offline desde hace 8 horas — recomiendo verificar la conexión. También detecté una intrusión nocturna a las 03:42 que aún no ha sido reconocida. ¿Quieres que genere un reporte completo?",
    };
  }

  if (lower.includes("centro") || lower.includes("sucursal centro")) {
    return {
      type: "text",
      content:
        "**Sucursal Centro** tiene 3/4 cámaras online. La cámara Bodega Trasera está offline. Hoy se detectó un posible arma a las 22:15 en la entrada — fue reconocido como un paraguas. También hubo una alerta de humo que resultó ser vapor de la cocina del local contiguo. En general, la tienda está operando normal.",
    };
  }

  if (lower.includes("alerta") || lower.includes("alert")) {
    return {
      type: "text",
      content:
        "Hoy van **15 alertas** en total: 3 sin reconocer (triggered), 4 reconocidas, 4 marcadas como falsa alarma, y 4 resueltas. Los tipos más frecuentes son intrusión (6) y detección de arma (4). El tiempo promedio de respuesta es 4.2 minutos. ¿Quieres que profundice en alguna alerta?",
    };
  }

  if (lower.includes("offline") || lower.includes("cámara") || lower.includes("camara")) {
    return {
      type: "text",
      content:
        "Actualmente hay **2 cámaras offline**:\n\n1. **Bodega Trasera** (Sucursal Centro) — última actividad hace 5h 20min\n2. **Interior Almacén** (Bodega Norte) — última actividad hace 8h\n\nAmbas perdieron conexión hoy. Podría ser un problema de red local. Recomiendo verificar el estado del switch/router en cada ubicación.",
    };
  }

  if (lower.includes("monitor") || lower.includes("abr") || lower.includes("sí") || lower.includes("si")) {
    return {
      type: "text",
      content:
        "Perfecto. Te recomiendo ir a la sección **Monitor** para ver el feed en vivo de Bodega Norte. También puedo silenciar alertas repetidas de esa zona si quieres — solo dime y ajusto el cooldown a 10 minutos.",
    };
  }

  return {
    type: "text",
    content:
      "He revisado la información disponible. Actualmente tus 3 tiendas están activas con 8 de 10 cámaras en línea. ¿Te gustaría que genere un **reporte** detallado, analice una tienda en particular, o revise las **alertas** de hoy?",
  };
}

/* ── Quick action chips ───────────────────────────────────────────── */

const quickActions = [
  { label: "Generar reporte", icon: FileText },
  { label: "Estado de alertas", icon: AlertTriangle },
  { label: "Cámaras offline", icon: Shield },
  { label: "Análisis Bodega Norte", icon: TrendingDown },
];

/* ── Component ────────────────────────────────────────────────────── */

export function ChatPanel() {
  const { chatOpen, closeChat, openVoice } = useAgent();
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const alertsScheduled = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatOpen]);

  // Schedule alert messages when chat is first opened
  useEffect(() => {
    if (chatOpen && !alertsScheduled.current) {
      alertsScheduled.current = true;
      const timers = scheduledAlerts.map((alert) =>
        setTimeout(() => {
          const alertMsg: Message = {
            id: `alert-${Date.now()}`,
            role: "assistant",
            content: alert.content,
            timestamp: new Date(),
            type: "text",
          };
          setMessages((prev) => [...prev, alertMsg]);
        }, alert.delay)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [chatOpen]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      const delay = 1200 + Math.random() * 1500;
      setTimeout(() => {
        const response = getAutoResponse(text);
        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: response.content,
          timestamp: new Date(),
          type: response.type,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, delay);
    },
    [isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Backdrop */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={closeChat}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          zIndex: 50,
          transform: chatOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms ease-in-out",
        }}
        className="flex flex-col border-l bg-white"
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Asistente de Seguridad
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <p className="text-[11px] text-muted-foreground">Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                closeChat();
                openVoice();
              }}
              title="Switch to voice mode"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={closeChat}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "assistant" ? "bg-primary/10" : "bg-slate-100"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-slate-500" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : msg.content.startsWith("🚨")
                      ? "bg-red-50 text-foreground rounded-bl-md border border-red-200"
                      : msg.content.startsWith("⚠️")
                      ? "bg-amber-50 text-foreground rounded-bl-md border border-amber-200"
                      : "bg-slate-50 text-foreground rounded-bl-md border"
                  }`}
                >
                  {msg.type === "report" ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 mb-2">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">
                          Security Report
                        </span>
                      </div>
                      <div className="text-xs leading-relaxed whitespace-pre-line">
                        {msg.content.split("\n").map((line, i) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <p key={i} className="font-semibold mt-2 mb-0.5">
                                {line.replace(/\*\*/g, "")}
                              </p>
                            );
                          }
                          if (line.startsWith("---")) {
                            return (
                              <hr key={i} className="my-2 border-slate-200" />
                            );
                          }
                          if (line.startsWith("- ") || line.match(/^\d+\./)) {
                            return (
                              <p key={i} className="ml-2 my-0.5">
                                {line}
                              </p>
                            );
                          }
                          return <p key={i}>{line}</p>;
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return (
                            <strong key={i}>
                              {part.replace(/\*\*/g, "")}
                            </strong>
                          );
                        }
                        return part;
                      })}
                    </p>
                  )}
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.role === "user"
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="rounded-2xl rounded-bl-md border bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions — shown when conversation is fresh */}
        {messages.length <= 1 && !isTyping && (
          <div className="shrink-0 border-t px-4 py-3">
            <p className="text-[11px] font-medium text-muted-foreground mb-2">
              Sugerencias
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.label)}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre tus tiendas..."
              className="flex-1 rounded-lg border bg-slate-50 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/40 focus:bg-white transition-colors"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-lg"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
