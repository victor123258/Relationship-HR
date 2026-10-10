import { useCallback, useEffect, useState } from "react";
import type { Answers, Role, SessionData } from "../types";

/* ------------------------------------------------------------------ */
/* Keys & code generation                                              */
/* ------------------------------------------------------------------ */

const PREFIX = "relhr:";
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O/1/I/L

export function genCode(len = 6): string {
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => CODE_CHARS[n % CODE_CHARS.length]).join("");
}

export const isValidCode = (code: string) => /^[A-Z2-9]{4,8}$/.test(code);

const sessionKey = (code: string) => `${PREFIX}session:${code}`;
const draftKey = (code: string, role: Role) => `${PREFIX}draft:${code}:${role}`;
const seatKey = (code: string) => `${PREFIX}seat:${code}`;

/* ------------------------------------------------------------------ */
/* Session CRUD                                                        */
/* ------------------------------------------------------------------ */

export function loadSession(code: string): SessionData | null {
  try {
    const raw = localStorage.getItem(sessionKey(code));
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function saveSession(s: SessionData) {
  localStorage.setItem(sessionKey(s.code), JSON.stringify(s));
  broadcast(s.code);
}

export function createSession(code: string): SessionData {
  const existing = loadSession(code);
  if (existing) return existing;
  const s: SessionData = { code, createdAt: Date.now() };
  saveSession(s);
  return s;
}

export function deleteSession(code: string) {
  localStorage.removeItem(sessionKey(code));
  localStorage.removeItem(seatKey(code));
  localStorage.removeItem(draftKey(code, "a"));
  localStorage.removeItem(draftKey(code, "b"));
}

/* ------------------------------------------------------------------ */
/* Seat (which applicant this device controls)                          */
/* ------------------------------------------------------------------ */

export function getSeat(code: string): Role | null {
  const v = localStorage.getItem(seatKey(code));
  return v === "a" || v === "b" ? v : null;
}

export function setSeat(code: string, role: Role) {
  localStorage.setItem(seatKey(code), role);
}

/* ------------------------------------------------------------------ */
/* Drafts (autosave while filling)                                      */
/* ------------------------------------------------------------------ */

export function loadDraft(code: string, role: Role): Answers {
  try {
    const raw = localStorage.getItem(draftKey(code, role));
    return raw ? (JSON.parse(raw) as Answers) : {};
  } catch {
    return {};
  }
}

export function saveDraft(code: string, role: Role, answers: Answers) {
  localStorage.setItem(draftKey(code, role), JSON.stringify(answers));
}

export function clearDraft(code: string, role: Role) {
  localStorage.removeItem(draftKey(code, role));
}

export function hasDraft(code: string, role: Role): boolean {
  return localStorage.getItem(draftKey(code, role)) !== null;
}

/* ------------------------------------------------------------------ */
/* Cross-device transport: encode whole session into the URL hash       */
/* ------------------------------------------------------------------ */

interface CompactParticipant {
  n: string;
  t: number;
  s: Answers;
}
interface CompactSession {
  v: 1;
  c: string;
  a?: CompactParticipant;
  b?: CompactSession["a"];
}

export function encodeSession(s: SessionData): string {
  const compact: CompactSession = {
    v: 1,
    c: s.code,
    ...(s.a ? { a: { n: s.a.name, t: s.a.submittedAt, s: s.a.answers } } : {}),
    ...(s.b ? { b: { n: s.b.name, t: s.b.submittedAt, s: s.b.answers } } : {}),
  };
  const json = JSON.stringify(compact);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSession(payload: string): SessionData | null {
  try {
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    const c = JSON.parse(json) as CompactSession;
    if (c.v !== 1 || !c.c) return null;
    return {
      code: c.c,
      createdAt: Date.now(),
      ...(c.a ? { a: { name: c.a.n, submittedAt: c.a.t, answers: c.a.s } } : {}),
      ...(c.b ? { b: { name: c.b.n, submittedAt: c.b.t, answers: c.b.s } } : {}),
    };
  } catch {
    return null;
  }
}

/** Merge incoming session data into local — newest submission wins per seat. */
export function mergeSession(local: SessionData | null, incoming: SessionData): SessionData {
  const base: SessionData = local ?? { code: incoming.code, createdAt: incoming.createdAt };
  const out: SessionData = { ...base, a: base.a, b: base.b };
  for (const role of ["a", "b"] as Role[]) {
    const inc = incoming[role];
    const cur = base[role];
    if (inc && (!cur || inc.submittedAt > cur.submittedAt)) {
      out[role] = inc;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Same-device / same-tab sync                                          */
/* ------------------------------------------------------------------ */

export function broadcast(code: string) {
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const ch = new BroadcastChannel(`${PREFIX}${code}`);
      ch.postMessage("update");
      ch.close();
    }
  } catch {
    /* noop */
  }
}

/* ------------------------------------------------------------------ */
/* React hook                                                           */
/* ------------------------------------------------------------------ */

export function useSession(code: string) {
  const [session, setSessionState] = useState<SessionData | null>(() => loadSession(code));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setSessionState(loadSession(code));
    setTick((t) => t + 1);

    const onStorage = (e: StorageEvent) => {
      if (e.key === sessionKey(code)) setTick((t) => t + 1);
    };
    window.addEventListener("storage", onStorage);

    let ch: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        ch = new BroadcastChannel(`${PREFIX}${code}`);
        ch.onmessage = () => setTick((t) => t + 1);
      }
    } catch {
      ch = null;
    }
    const interval = window.setInterval(() => {
      // Gentle poll as a final fallback (cheap localStorage read)
      setTick((t) => t + 1);
    }, 3000);

    return () => {
      window.removeEventListener("storage", onStorage);
      ch?.close();
      window.clearInterval(interval);
    };
  }, [code]);

  useEffect(() => {
    setSessionState(loadSession(code));
  }, [code, tick]);

  const update = useCallback(
    (mutate: (s: SessionData) => SessionData) => {
      const cur = loadSession(code) ?? { code, createdAt: Date.now() };
      const next = mutate(cur);
      saveSession(next);
      setSessionState(next);
      return next;
    },
    [code]
  );

  return { session, update };
}

/* ------------------------------------------------------------------ */
/* Share links                                                          */
/* ------------------------------------------------------------------ */

export function sessionUrl(code: string, session?: SessionData | null, path = ""): string {
  const { origin, pathname } = window.location;
  const data = session && (session.a || session.b) ? `?d=${encodeSession(session)}` : "";
  return `${origin}${pathname}#/session/${code}${path}${data}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}
