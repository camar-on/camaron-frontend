"use client";

import { Suspense } from "react";
import StoreMonitorClient from "./StoreMonitorClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <StoreMonitorClient />
    </Suspense>
  );
}
