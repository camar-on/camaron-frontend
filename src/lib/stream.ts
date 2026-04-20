"use client";

/** Base URL of MediaMTX's HLS egress (no path). */
export function mediamtxBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MEDIAMTX_BASE_URL || "http://localhost:8888"
  );
}

/** Base URL of MediaMTX's WebRTC egress (no path). */
export function mediamtxWebrtcBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MEDIAMTX_WEBRTC_BASE_URL ||
    "http://localhost:8889"
  );
}

/** Extract the MediaMTX path name from a `rtsp://host:port/<name>` URL. */
export function extractMediaMtxPath(rtspUrl: string): string {
  const match = rtspUrl.match(/^rtsp:\/\/[^/]+\/(.+)$/);
  return match ? match[1] : "";
}

/** Browser-playable HLS URL for a camera. */
export function rtspToHls(rtspUrl: string): string {
  return `${mediamtxBaseUrl()}/${extractMediaMtxPath(rtspUrl)}/index.m3u8`;
}

/** Built-in MediaMTX WebRTC player URL (full HTML page). */
export function rtspToWebrtcPlayer(rtspUrl: string): string {
  return `${mediamtxWebrtcBaseUrl()}/${extractMediaMtxPath(rtspUrl)}`;
}
