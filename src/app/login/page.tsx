"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Loader2, CheckCircle2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setMode, clearMode } from "@/lib/demo-mode";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  const handleDemo = () => {
    clearMode();
    router.push("/dashboard");
  };

  const handleSeed = () => {
    setMode("seed");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-1.5 justify-center mb-8">
          <span className="text-xl font-bold tracking-tight text-foreground">
            camar-
          </span>
          <span className="text-xl font-bold tracking-tight text-primary">
            On
          </span>
          <span className="relative ml-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
        </div>

        <div className="rounded-xl border bg-white p-6">
          {!sent ? (
            <>
              <h1 className="text-lg font-semibold text-foreground text-center mb-1">
                Iniciar sesion
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Te enviaremos un enlace magico a tu email
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@negocio.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar enlace magico"
                  )}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wide">
                  <span className="bg-white px-2 text-muted-foreground">
                    o
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSeed}
                >
                  <Radio className="mr-2 h-4 w-4 text-primary" />
                  Entrar con cuenta seed (streams en vivo)
                </Button>
                <button
                  type="button"
                  onClick={handleDemo}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Saltar al demo (datos mock) →
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center rounded-full bg-accent p-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Revisa tu email
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enviamos un enlace magico a{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSent(false)}
              >
                Usar otro email
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
