"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  Building2,
  Plus,
  ShieldAlert,
  Zap,
  Puzzle,
  Users,
  Settings,
  BarChart3,
  Footprints,
  Flame,
  Users2,
  Route,
  Smile,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { mockStores } from "@/data/mock";

// ── Navigation item types ─────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Monitor", href: "/dashboard/monitor", icon: Monitor },
];

const analyticsNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Foot Traffic", href: "/dashboard/analytics/traffic", icon: Footprints },
  { label: "Heatmaps", href: "/dashboard/analytics/heatmaps", icon: Flame },
  { label: "Queues", href: "/dashboard/analytics/queues", icon: Users2 },
  { label: "Journey", href: "/dashboard/analytics/journey", icon: Route },
  { label: "Satisfaction", href: "/dashboard/analytics/satisfaction", icon: Smile },
  { label: "Performance", href: "/dashboard/analytics/performance", icon: TrendingUp },
];

const bottomNav: NavItem[] = [
  { label: "Alert Rules", href: "/dashboard/alert-rules", icon: ShieldAlert },
  { label: "Protocols", href: "/dashboard/protocols", icon: Zap },
  { label: "Integrations", href: "/dashboard/integrations", icon: Puzzle },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

// ── Sidebar component ─────────────────────────

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/dashboard/analytics") return pathname === "/dashboard/analytics";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-5">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          camar-
          <span className="text-primary">On</span>
        </span>
        <span className="relative -ml-0.5 -mt-2 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
      </div>

      <Separator />

      {/* Scrollable nav area */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {/* Main navigation */}
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
            />
          ))}

          <Separator className="my-3" />

          {/* Stores section */}
          <span className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Stores
          </span>

          {mockStores.map((store) => {
            const href = `/dashboard/stores/${store.id}`;
            return (
              <Link
                key={store.id}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isActive(href) &&
                    "bg-accent font-medium text-accent-foreground"
                )}
              >
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="truncate">{store.name}</span>
                {store.activeAlerts > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive/10 px-1.5 text-[10px] font-semibold text-destructive">
                    {store.activeAlerts}
                  </span>
                )}
              </Link>
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            className="mt-1 justify-start gap-2 text-muted-foreground"
            asChild
          >
            <Link href="/dashboard/stores/new">
              <Plus className="h-4 w-4" />
              Add Store
            </Link>
          </Button>

          <Separator className="my-3" />

          {/* Analytics section */}
          <span className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Analytics
          </span>

          {analyticsNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
            />
          ))}

          <Separator className="my-3" />

          {/* Bottom navigation */}
          {bottomNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
            />
          ))}
        </nav>
      </ScrollArea>

    </aside>
  );
}

// ── Reusable nav link ─────────────────────────

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent font-medium text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}
