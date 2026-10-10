import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { createSession, decodeSession, loadSession, mergeSession, saveSession } from "./session";

/**
 * Reads `?d=<base64>` from the hash-route query string, merges the payload
 * into localStorage, then strips it so the URL stays tidy.
 * This is how sealed files travel cross-device: inside the link itself.
 */
export function useImportPayload(code: string) {
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    const d = params.get("d");
    if (d) {
      const incoming = decodeSession(d);
      if (incoming && incoming.code.toUpperCase() === code.toUpperCase()) {
        const merged = mergeSession(loadSession(code), incoming);
        saveSession(merged);
      }
      params.delete("d");
      setParams(params, { replace: true });
    } else if (!loadSession(code)) {
      createSession(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);
}
