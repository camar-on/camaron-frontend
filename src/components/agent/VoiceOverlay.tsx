"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Volume2,
  AlertTriangle,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgent } from "@/lib/agent-context";

/* ── Types ────────────────────────────────────────────────────────── */

type CallState = "connecting" | "listening" | "speaking" | "idle";

interface LiveAlert {
  id: string;
  time: string;
  type: string;
  store: string;
  camera: string;
  severity: "critical" | "warning" | "info";
}

/* ── Waveform component ───────────────────────────────────────────── */

function Waveform({
  active,
  color,
}: {
  active: boolean;
  color: "primary" | "white";
}) {
  const barCount = 40;
  return (
    <div className="flex items-center justify-center gap-[2px] h-16">
      {Array.from({ length: barCount }).map((_, i) => {
        const delay = i * 30;
        const baseHeight = active
          ? 8 + Math.sin(i * 0.5) * 20 + Math.random() * 20
          : 4;
        return (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-150 ${
              color === "primary" ? "bg-primary" : "bg-white/80"
            }`}
            style={{
              height: `${baseHeight}px`,
              animationDelay: `${delay}ms`,
              opacity: active ? 0.6 + Math.random() * 0.4 : 0.2,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Animated ring component ──────────────────────────────────────── */

function PulseRing({ state }: { state: CallState }) {
  const isActive = state === "speaking" || state === "listening";
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rings */}
      {isActive && (
        <>
          <span className="absolute h-44 w-44 rounded-full border border-primary/10 animate-ping [animation-duration:3s]" />
          <span className="absolute h-36 w-36 rounded-full border border-primary/15 animate-ping [animation-duration:2s]" />
          <span className="absolute h-28 w-28 rounded-full border border-primary/20 animate-pulse" />
        </>
      )}

      {/* Main circle */}
      <div
        className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500 ${
          state === "speaking"
            ? "bg-primary scale-110"
            : state === "listening"
            ? "bg-primary/90 scale-105"
            : state === "connecting"
            ? "bg-muted"
            : "bg-primary/80"
        }`}
      >
        {state === "connecting" ? (
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
          </div>
        ) : state === "speaking" ? (
          <Volume2 className="h-10 w-10 text-white animate-pulse" />
        ) : (
          <Sparkles className="h-10 w-10 text-white" />
        )}
      </div>
    </div>
  );
}

/* ── Mock live alerts ─────────────────────────────────────────────── */

const mockLiveAlerts: LiveAlert[] = [
  {
    id: "la1",
    time: "22:15:03",
    type: "Persona detectada",
    store: "Bodega Norte",
    camera: "Acceso Carga",
    severity: "warning",
  },
  {
    id: "la2",
    time: "22:12:41",
    type: "Movimiento en zona",
    store: "Sucursal Sur",
    camera: "Estacionamiento",
    severity: "info",
  },
];

/* ── Status messages ──────────────────────────────────────────────── */

const statusMessages: Record<CallState, string> = {
  connecting: "Conectando con el agente...",
  listening: "Escuchando...",
  speaking: "El agente está hablando...",
  idle: "Presiona el micrófono para hablar",
};

const transcriptLines = [
  {
    role: "agent" as const,
    text: "Hola JuanJo. Estoy monitoreando tus 3 tiendas en tiempo real. Todas las cámaras en línea excepto 2. ¿En qué te puedo ayudar?",
  },
  {
    role: "user" as const,
    text: "¿Cómo está la Bodega Norte?",
  },
  {
    role: "agent" as const,
    text: "La Bodega Norte tiene actividad inusual. 7 alertas hoy, principalmente en Acceso Carga. La cámara Interior Almacén lleva 8 horas offline. Recomiendo verificar la conexión. Hace un momento detecté movimiento en el acceso de carga.",
  },
];

/* ── Component ────────────────────────────────────────────────────── */

export function VoiceOverlay() {
  const { voiceOpen, closeVoice, openChat } = useAgent();
  const [callState, setCallState] = useState<CallState>("connecting");
  const [micMuted, setMicMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [transcript, setTranscript] = useState<typeof transcriptLines>([]);
  const [waveKey, setWaveKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate call lifecycle
  useEffect(() => {
    if (!voiceOpen) {
      setCallState("connecting");
      setElapsed(0);
      setAlerts([]);
      setTranscript([]);
      return;
    }

    // Connect after 2s
    const t1 = setTimeout(() => {
      setCallState("speaking");
      setTranscript([transcriptLines[0]]);
    }, 2000);

    // Agent done speaking
    const t2 = setTimeout(() => {
      setCallState("idle");
    }, 6000);

    // Simulated user speaks
    const t3 = setTimeout(() => {
      setCallState("listening");
      setTranscript((p) => [...p, transcriptLines[1]]);
    }, 9000);

    // Agent responds
    const t4 = setTimeout(() => {
      setCallState("speaking");
      setTranscript((p) => [...p, transcriptLines[2]]);
    }, 12000);

    // Back to idle
    const t5 = setTimeout(() => {
      setCallState("idle");
    }, 18000);

    // Live alert comes in
    const t6 = setTimeout(() => {
      setAlerts([mockLiveAlerts[0]]);
    }, 8000);

    const t7 = setTimeout(() => {
      setAlerts([mockLiveAlerts[0], mockLiveAlerts[1]]);
    }, 14000);

    return () => {
      [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
    };
  }, [voiceOpen]);

  // Elapsed timer
  useEffect(() => {
    if (!voiceOpen) return;
    timerRef.current = setInterval(() => {
      setElapsed((p) => p + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [voiceOpen]);

  // Waveform re-render
  useEffect(() => {
    if (callState === "speaking" || callState === "listening") {
      const interval = setInterval(() => setWaveKey((k) => k + 1), 150);
      return () => clearInterval(interval);
    }
  }, [callState]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const switchToChat = () => {
    closeVoice();
    openChat();
  };

  if (!voiceOpen) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60 }}
      className="flex"
    >
      {/* Main call area */}
      <div className="flex flex-1 flex-col items-center justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 px-8 py-8">
        {/* Top bar */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Asistente de Seguridad
              </p>
              <p className="text-[11px] text-white/50">Modo voz</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="border-white/10 bg-white/5 text-white/70 font-mono text-xs"
            >
              {formatTime(elapsed)}
            </Badge>
            <Badge
              variant="outline"
              className={`border-0 text-xs font-medium ${
                callState === "connecting"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              <span
                className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                  callState === "connecting"
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-green-400"
                }`}
              />
              {callState === "connecting" ? "Conectando" : "En llamada"}
            </Badge>
          </div>
        </div>

        {/* Center — Pulse ring + status */}
        <div className="flex flex-col items-center gap-8">
          <PulseRing state={callState} />

          <div className="text-center">
            <p className="text-sm text-white/70 mb-2">
              {statusMessages[callState]}
            </p>
            {/* Waveform */}
            <div className="h-16 w-64" key={waveKey}>
              <Waveform
                active={callState === "speaking" || callState === "listening"}
                color="white"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-full bg-white/5 hover:bg-white/10 text-white"
            onClick={() => setMicMuted((p) => !p)}
          >
            {micMuted ? (
              <MicOff className="h-6 w-6 text-red-400" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          <Button
            size="icon"
            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white"
            onClick={closeVoice}
          >
            <PhoneOff className="h-7 w-7" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-full bg-white/5 hover:bg-white/10 text-white"
            onClick={switchToChat}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Right sidebar — transcript + live alerts */}
      <div className="flex w-[340px] shrink-0 flex-col border-l border-white/5 bg-slate-950">
        {/* Close button */}
        <div className="flex h-14 items-center justify-between border-b border-white/5 px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Live Feed
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/5"
            onClick={closeVoice}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Live alerts */}
        {alerts.length > 0 && (
          <div className="border-b border-white/5 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              Live Alerts
            </p>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {alert.severity === "critical" ? (
                      <Shield className="h-3 w-3 text-red-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-yellow-400" />
                    )}
                    <span className="text-xs font-medium text-white/80">
                      {alert.type}
                    </span>
                    <span className="ml-auto text-[10px] text-white/30 font-mono">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40">
                    {alert.store} — {alert.camera}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
              Transcript
            </p>
          </div>
          <ScrollArea className="flex-1 px-4 pb-4">
            <div className="space-y-3 pt-2">
              {transcript.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      line.role === "agent"
                        ? "bg-primary/20 text-primary"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {line.role === "agent" ? "AI" : "TU"}
                  </span>
                  <p className="text-xs leading-relaxed text-white/60">
                    {line.text}
                  </p>
                </div>
              ))}

              {callState === "speaking" && (
                <div className="flex gap-2">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                    AI
                  </span>
                  <div className="flex items-center gap-1 pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
