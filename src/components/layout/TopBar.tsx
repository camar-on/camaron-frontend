"use client";

import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronRight,
  LogOut,
  User,
  Settings,
  Sparkles,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockUser, mockNotifications } from "@/data/mock";
import { useAgent } from "@/lib/agent-context";

// ── Breadcrumb label resolver ─────────────────

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  monitor: "Monitor",
  stores: "Stores",
  "alert-rules": "Alert Rules",
  protocols: "Protocols",
  integrations: "Integrations",
  team: "Team",
  settings: "Settings",
  new: "New",
  agent: "AI Agent",
  voice: "Voice Mode",
};

function resolveBreadcrumbs(pathname: string) {
  const segments = pathname
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean);

  return segments.map((segment) => ({
    label: labelMap[segment] ?? decodeURIComponent(segment),
    segment,
  }));
}

// ── TopBar component ──────────────────────────

export function TopBar() {
  const pathname = usePathname();
  const breadcrumbs = resolveBreadcrumbs(pathname);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;
  const { toggleChat, openVoice, chatOpen } = useAgent();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb.segment} className="flex items-center gap-1">
            {idx > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            )}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        <TooltipProvider delayDuration={200}>
          {/* AI Agent button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={chatOpen ? "default" : "ghost"}
                size="sm"
                className={
                  chatOpen
                    ? "gap-1.5"
                    : "gap-1.5 text-muted-foreground"
                }
                onClick={toggleChat}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">AI Agent</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chat with security agent</TooltipContent>
          </Tooltip>

          {/* Voice Mode button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={openVoice}
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Voice</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice call with agent</TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="mx-1 h-5 w-px bg-border" />

          {/* Notification bell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 focus-visible:ring-0"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs font-medium">
                  {mockUser.initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">
                {mockUser.name}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground">
                  {mockUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
