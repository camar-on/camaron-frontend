"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { rtspToHls } from "@/lib/stream";

interface CameraPlayerProps {
  /** Camera's RTSP URL — we derive the MediaMTX HLS URL from the path. */
  rtspUrl: string;
  /** Optional label overlay (e.g. camera name). */
  label?: string;
  /** Play muted — required for browser autoplay. */
  muted?: boolean;
  /** Visual aspect ratio. Defaults to 16/9. */
  aspect?: "16/9" | "4/3" | "1/1";
  className?: string;
}

/**
 * Plays a live MediaMTX stream over HLS. Uses hls.js where needed; Safari
 * and iOS play HLS natively.
 */
export function CameraPlayer({
  rtspUrl,
  label,
  muted = true,
  aspect = "16/9",
  className,
}: CameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"loading" | "playing" | "error">(
    "loading",
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = rtspToHls(rtspUrl);
    let hls: import("hls.js").default | null = null;
    let cancelled = false;

    setStatus("loading");

    // Safari + iOS can play HLS natively.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(() => {});
    } else {
      // Everyone else: hls.js (dynamic import so it's not in the initial bundle).
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) {
          setStatus("error");
          return;
        }
        hls = new Hls({ liveDurationInfinity: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) setStatus("error");
        });
        video.play().catch(() => {});
      });
    }

    const onPlaying = () => setStatus("playing");
    const onError = () => setStatus("error");
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);

    return () => {
      cancelled = true;
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
      if (hls) hls.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [rtspUrl]);

  const aspectClass =
    aspect === "16/9"
      ? "aspect-video"
      : aspect === "4/3"
      ? "aspect-[4/3]"
      : "aspect-square";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-black rounded-md",
        aspectClass,
        className,
      )}
    >
      <video
        ref={videoRef}
        muted={muted}
        autoPlay
        playsInline
        controls={false}
        className="h-full w-full object-cover"
      />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">
          Connecting…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-xs text-white">
          Stream unavailable
        </div>
      )}

      {label && (
        <div className="pointer-events-none absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {label}
        </div>
      )}

      {/* Live dot */}
      {status === "playing" && (
        <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded bg-red-600/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          Live
        </div>
      )}
    </div>
  );
}
