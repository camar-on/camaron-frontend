"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
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

              <div className="mt-4 text-center">
                <Link
                  href="/dashboard"
                  className="text-xs text-primary hover:underline"
                >
                  Saltar al demo →
                </Link>
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
