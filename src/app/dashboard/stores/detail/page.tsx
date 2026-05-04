"use client";

import { Suspense } from "react";
import StoreDetailClient from "./StoreDetailClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <StoreDetailClient />
    </Suspense>
  );
}
