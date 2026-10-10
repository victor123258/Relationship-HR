import { useEffect, useState } from "react";
import { subscribeSync } from "../lib/sync";

/**
 * Re-render trigger that fires whenever any tab/window of this browser
 * writes session data (BroadcastChannel + storage events).
 */
export function useSyncTick(matchCode?: string): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeSync((code) => {
      if (!matchCode || !code || code === matchCode) {
        setTick((t) => t + 1);
      }
    });
    return unsub;
  }, [matchCode]);

  return tick;
}
