"use client";

import { Suspense } from "react";
import NewCameraClient from "./NewCameraClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <NewCameraClient />
    </Suspense>
  );
}
