import Link from "next/link";
import {
  Camera,
  Shield,
  Zap,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-foreground">
              camar-
            </span>
            <span className="text-lg font-bold tracking-tight text-primary">
              On
            </span>
            <span className="relative ml-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar sesion
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">
                Probar demo
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            Plataforma de vigilancia con AI
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight mb-4">
            Tus camaras,
            <br />
            <span className="text-primary">ahora inteligentes</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
            Conecta tus camaras de seguridad existentes. camar-On las analiza
            con AI en tiempo real y ejecuta protocolos de respuesta automaticos
            cuando detecta situaciones de riesgo.
          </p>
          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button size="lg">
                Explorar demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Contactar ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-sm font-medium text-primary mb-2">
            Caracteristicas
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-10">
            Todo lo que necesitas para proteger tu negocio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Camera,
                title: "Monitoreo en vivo",
                desc: "Ve todas tus camaras desde el dashboard o tu celular, en tiempo real.",
              },
              {
                icon: Shield,
                title: "Deteccion AI",
                desc: "Detecta personas, armas, fuego y situaciones de riesgo automaticamente.",
              },
              {
                icon: Zap,
                title: "Respuesta automatica",
                desc: "Configura protocolos: alertas Telegram, llamadas, webhooks.",
              },
              {
                icon: Bell,
                title: "Alertas instantaneas",
                desc: "Recibe notificaciones con screenshot y clip del evento detectado.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border bg-background p-6"
              >
                <div className="inline-flex items-center justify-center rounded-lg bg-accent p-2.5 mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-sm font-medium text-primary mb-2">Como funciona</p>
          <h2 className="text-2xl font-bold text-foreground mb-10">
            3 pasos para proteger tu negocio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Conecta tus camaras",
                desc: "Agrega la URL RTSP de tus camaras existentes. Soportamos Hikvision, Dahua, Reolink y mas.",
              },
              {
                step: "02",
                title: "Configura reglas",
                desc: "Define que detectar, en que horarios, y en que zonas de la imagen.",
              },
              {
                step: "03",
                title: "Recibe alertas",
                desc: "Cuando algo pasa, recibes una alerta con evidencia por Telegram, llamada o webhook.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <span className="text-3xl font-bold text-primary/30">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="rounded-xl border bg-background p-8 max-w-md mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-2">MVP</p>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Prueba piloto gratuita
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Estamos buscando negocios piloto en Guadalajara para probar la
              plataforma sin costo.
            </p>
            <ul className="text-left space-y-2 mb-6 text-sm">
              {[
                "Hasta 10 camaras",
                "Alertas por Telegram ilimitadas",
                "Dashboard web y app movil",
                "Soporte directo del equipo",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">Solicitar acceso</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground">
              camar-
            </span>
            <span className="text-sm font-semibold text-primary">On</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; 2026 camar-On. Guadalajara, Mexico.
          </p>
        </div>
      </footer>
    </div>
  );
}
