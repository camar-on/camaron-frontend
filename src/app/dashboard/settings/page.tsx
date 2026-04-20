"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CreditCard,
  Bell,
  AlertTriangle,
  Upload,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDataset } from "@/lib/dataset-context";

/* ── Page ────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const { organization, notificationSettings } = useDataset();
  const [orgName, setOrgName] = useState(organization.name);
  const [orgSlug, setOrgSlug] = useState(organization.slug);
  const [notifications, setNotifications] = useState(notificationSettings);

  useEffect(() => {
    setOrgName(organization.name);
    setOrgSlug(organization.slug);
    setNotifications(notificationSettings);
  }, [organization, notificationSettings]);

  const toggleNotification = (
    key: keyof typeof notificationSettings
  ) => {
    if (typeof notifications[key] === "boolean") {
      setNotifications((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-8">
          Settings
        </h1>

        <div className="space-y-10">
          {/* ── Organization ──────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">
                Organization
              </h2>
            </div>
            <div className="rounded-xl border bg-white p-5 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-slug">URL Slug</Label>
                <div className="flex items-center gap-0">
                  <span className="inline-flex h-9 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                    app.camaron.ai/
                  </span>
                  <Input
                    id="org-slug"
                    value={orgSlug}
                    onChange={(e) => setOrgSlug(e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Upload Logo
                    </Button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG or SVG. Max 2MB.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </section>

          <Separator />

          {/* ── Plan ──────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Plan</h2>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                    <Crown className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">
                        {organization.plan.charAt(0).toUpperCase() +
                          organization.plan.slice(1)}{" "}
                        Plan
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        Current
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Up to 50 cameras, 10 alert rules, unlimited team members.
                    </p>
                  </div>
                </div>
                <Button variant="outline">Upgrade</Button>
              </div>
            </div>
          </section>

          <Separator />

          {/* ── Notifications ─────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">
                Notifications
              </h2>
            </div>
            <div className="rounded-xl border bg-white p-5 space-y-5">
              {/* Email alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Email Alerts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Receive alert notifications via email.
                  </p>
                </div>
                <Switch
                  checked={notifications.emailAlerts}
                  onCheckedChange={() => toggleNotification("emailAlerts")}
                />
              </div>

              <Separator />

              {/* Push notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Push Notifications
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Browser and mobile push notifications for alerts.
                  </p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={() =>
                    toggleNotification("pushNotifications")
                  }
                />
              </div>

              <Separator />

              {/* Critical only */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Critical Alerts Only
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Only send notifications for high-confidence alerts.
                  </p>
                </div>
                <Switch
                  checked={notifications.criticalOnly}
                  onCheckedChange={() => toggleNotification("criticalOnly")}
                />
              </div>

              <Separator />

              {/* Quiet hours */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Quiet Hours
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Suppress non-critical notifications from{" "}
                    {notifications.quietHoursStart} to{" "}
                    {notifications.quietHoursEnd}.
                  </p>
                </div>
                <Switch
                  checked={notifications.quietHoursEnabled}
                  onCheckedChange={() =>
                    toggleNotification("quietHoursEnabled")
                  }
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* ── Danger Zone ───────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="text-lg font-semibold text-destructive">
                Danger Zone
              </h2>
            </div>
            <div className="rounded-xl border-2 border-destructive/30 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Delete Organization
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete this organization and all associated
                    data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive">Delete Organization</Button>
              </div>
            </div>
          </section>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}
