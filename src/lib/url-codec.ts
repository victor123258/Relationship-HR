import LZString from "lz-string";

/**
 * URL-safe base64 compression for sharing data through links
 * (handoff links + shareable reports). No server involved.
 */
export function encodePayload<T>(payload: T): string {
  const json = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodePayload<T>(encoded: string): T | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function buildShareUrl(path: string): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#${path}`;
}
