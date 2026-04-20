"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ChatPanel } from "@/components/agent/ChatPanel";
import { VoiceOverlay } from "@/components/agent/VoiceOverlay";
import { AgentProvider } from "@/lib/agent-context";
import { DatasetProvider } from "@/lib/dataset-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DatasetProvider>
    <AgentProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar — fixed, scrolls internally */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* TopBar — sticky */}
          <TopBar />

          {/* Only this area scrolls */}
          <main className="flex-1 overflow-y-auto bg-[hsl(var(--background))] p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Panels rendered at root level, outside overflow-hidden */}
      <ChatPanel />
      <VoiceOverlay />
    </AgentProvider>
    </DatasetProvider>
  );
}
