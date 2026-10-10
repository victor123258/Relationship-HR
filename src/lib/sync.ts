/**
 * Cross-tab synchronization without a backend.
 * Primary: BroadcastChannel (instant, same browser).
 * Fallback: window "storage" events fire automatically in other tabs
 * whenever localStorage changes — those are listened to in useSync.
 */

const CHANNEL_NAME = "relationship-hr-sync-v1";

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") return null;
  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch {
      channel = null;
    }
  }
  return channel;
}

export function broadcastSync(matchCode?: string): void {
  const ch = getChannel();
  if (ch) {
    try {
      ch.postMessage({ type: "session-update", matchCode, at: Date.now() });
    } catch {
      /* noop */
    }
  }
}

export function subscribeSync(listener: (matchCode?: string) => void): () => void {
  const ch = getChannel();
  const onMessage = (event: MessageEvent) => {
    if (event.data?.type === "session-update") {
      listener(event.data.matchCode);
    }
  };
  ch?.addEventListener("message", onMessage);

  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key.startsWith("session_")) {
      const match = event.key.match(/^session_([A-Z0-9]{6})_/);
      listener(match?.[1]);
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    ch?.removeEventListener("message", onMessage);
    window.removeEventListener("storage", onStorage);
  };
}
