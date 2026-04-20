"use client";

import { useEffect, useState } from "react";

const KEY = "camaron_demo_mode";
const EVENT = "camaron-demo-mode-change";

export type DemoMode = "demo" | "seed";

export function getMode(): DemoMode {
  if (typeof window === "undefined") return "demo";
  const raw = window.localStorage.getItem(KEY);
  return raw === "seed" ? "seed" : "demo";
}

export function setMode(mode: DemoMode): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, mode);
  window.dispatchEvent(new Event(EVENT));
}

export function clearMode(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

/** React hook — re-renders when mode changes (same tab or other tab). */
export function useDemoMode(): DemoMode {
  const [mode, setModeState] = useState<DemoMode>("demo");
  useEffect(() => {
    setModeState(getMode());
    const listener = () => setModeState(getMode());
    window.addEventListener(EVENT, listener);
    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener(EVENT, listener);
      window.removeEventListener("storage", listener);
    };
  }, []);
  return mode;
}
