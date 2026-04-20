"use client";

import { UserPlus, Shield, Settings, Eye, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDataset } from "@/lib/dataset-context";
import type { MemberRole } from "@/lib/types";

/* ── Role config ────────────────────────────────────────────────── */

const roleConfig: Record<
  MemberRole,
  { label: string; badgeClass: string; icon: React.ElementType; description: string }
> = {
  owner: {
    label: "Owner",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Shield,
    description:
      "Full access to all resources. Can manage billing, team members, and organization settings.",
  },
  admin: {
    label: "Admin",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Settings,
    description:
      "Can manage stores, cameras, alert rules, and protocols. Cannot delete the organization or manage billing.",
  },
  operator: {
    label: "Operator",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Monitor,
    description:
      "Can view live feeds, acknowledge alerts, and add notes. Cannot modify rules or settings.",
  },
  viewer: {
    label: "Viewer",
    badgeClass: "bg-slate-50 text-slate-600 border-slate-200",
    icon: Eye,
    description:
      "Read-only access to dashboards and alert history. Cannot take any actions.",
  },
};

function getInitials(name: string | null, email: string): string {
  if (name && name.trim().length > 0) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (email?.[0] ?? "?").toUpperCase();
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function TeamPage() {
  const { members } = useDataset();
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Team Members
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage who has access to your organization.
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Members table */}
        <div className="rounded-xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const isPending = member.acceptedAt === null;
                const displayName =
                  member.user.name && member.user.name.trim().length > 0
                    ? member.user.name
                    : null;
                const config = roleConfig[member.role];

                return (
                  <TableRow key={member.id}>
                    {/* Member (avatar + name) */}
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {getInitials(displayName, member.user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          {displayName ? (
                            <p className="text-sm font-medium text-foreground">
                              {displayName}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              Pending invite
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Badge variant="outline" className={config.badgeClass}>
                        {config.label}
                      </Badge>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-sm text-muted-foreground">
                      {member.user.email}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {isPending ? (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-600 border-amber-200"
                        >
                          Pending
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          Active
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Roles explanation */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Roles</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              Object.entries(roleConfig) as [
                MemberRole,
                (typeof roleConfig)[MemberRole],
              ][]
            ).map(([role, config]) => {
              const Icon = config.icon;
              return (
                <div
                  key={role}
                  className="rounded-xl border bg-white p-4 flex items-start gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <Badge variant="outline" className={config.badgeClass}>
                      {config.label}
                    </Badge>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {config.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
