"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timezones = [
  "America/Mexico_City",
  "America/Cancun",
  "America/Monterrey",
  "America/Tijuana",
  "America/Hermosillo",
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function NewStorePage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [timezone, setTimezone] = useState("America/Mexico_City");
  const [saving, setSaving] = useState(false);
  const [hours, setHours] = useState(
    Object.fromEntries(
      daysOfWeek.map((d) => [d, { enabled: d !== "Sun", open: "09:00", close: "21:00" }])
    )
  );

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
        Add New Store
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Add a new location to start monitoring cameras.
      </p>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground text-sm">Basic Information</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input
              id="store-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sucursal Centro, Bodega Norte"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="store-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full street address"
                className="pl-9 min-h-[80px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz.replace("America/", "").replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Business Hours */}
        <div className="rounded-xl border bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground text-sm">Business Hours</h2>
          </div>

          <div className="space-y-2">
            {daysOfWeek.map((day) => {
              const h = hours[day];
              return (
                <div key={day} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setHours((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], enabled: !prev[day].enabled },
                      }))
                    }
                    className={`w-12 text-xs font-medium rounded-md py-1.5 text-center transition-colors ${
                      h.enabled
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day}
                  </button>
                  {h.enabled ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={h.open}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], open: e.target.value },
                          }))
                        }
                        className="w-32 text-sm"
                      />
                      <span className="text-muted-foreground text-xs">to</span>
                      <Input
                        type="time"
                        value={h.close}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], close: e.target.value },
                          }))
                        }
                        className="w-32 text-sm"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button disabled={!name.trim() || saving} onClick={handleSave}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Store"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
