"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AgentContextValue {
  chatOpen: boolean;
  voiceOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  openVoice: () => void;
  closeVoice: () => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const toggleChat = useCallback(() => setChatOpen((p) => !p), []);
  const openVoice = useCallback(() => {
    setChatOpen(false);
    setVoiceOpen(true);
  }, []);
  const closeVoice = useCallback(() => setVoiceOpen(false), []);

  return (
    <AgentContext.Provider
      value={{ chatOpen, voiceOpen, openChat, closeChat, toggleChat, openVoice, closeVoice }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}
