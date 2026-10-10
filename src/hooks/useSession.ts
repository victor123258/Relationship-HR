import { useEffect, useMemo, useState } from "react";
import { ensureSession, readSession } from "../lib/session";
import type { SessionSnapshot } from "../types/session";
import { useSyncTick } from "./useSync";

const POLL_MS = 2000;

/**
 * Live session snapshot. Re-reads localStorage on cross-tab sync events
 * (BroadcastChannel / storage events) and a 2s poll, per the mutual-reveal
 * requirement — the waiting room relies on this to auto-unlock results.
 */
export function useSession(code: string, poll = false): SessionSnapshot {
  const tick = useSyncTick(code);
  const [pollTick, setPollTick] = useState(0);

  useEffect(() => {
    if (code) ensureSession(code);
  }, [code]);

  useEffect(() => {
    if (!poll) return;
    const id = window.setInterval(() => setPollTick((n) => n + 1), POLL_MS);
    return () => window.clearInterval(id);
  }, [poll]);

  return useMemo(
    () => readSession(code),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [code, tick, pollTick]
  );
}
