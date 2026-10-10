import type { AnswerMap } from "../types/form";
import type { Role, SessionSnapshot, ParticipantState } from "../types/session";
import { broadcastSync } from "./sync";

const k = (code: string, suffix: string) => `session_${code}_${suffix}`;

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function ensureSession(code: string): void {
  if (!localStorage.getItem(k(code, "created"))) {
    localStorage.setItem(k(code, "created"), new Date().toISOString());
  }
}

function readParticipant(code: string, role: Role): ParticipantState {
  const answers = readJSON<AnswerMap>(k(code, `${role}_answers`));
  const name = localStorage.getItem(k(code, `${role}_name`)) ?? "";
  const submitted = localStorage.getItem(k(code, `${role}_submitted`)) === "true";
  const step = Number(localStorage.getItem(k(code, `${role}_step`)) ?? "0") || 0;
  const updatedAt = localStorage.getItem(k(code, `${role}_updated`)) ?? undefined;
  const exists = answers !== null || !!name || submitted;
  return {
    exists,
    name: name || (typeof answers?.p1 === "string" ? (answers.p1 as string) : ""),
    answers: answers ?? {},
    submitted,
    step,
    updatedAt,
  };
}

export function readSession(code: string): SessionSnapshot {
  // Role identity is tab-scoped (sessionStorage) so two tabs of the same
  // browser can genuinely be two different applicants; answers and status
  // live in localStorage so every tab sees them.
  const myRoleRaw = sessionStorage.getItem(k(code, "myrole"));
  return {
    code,
    created: localStorage.getItem(k(code, "created")),
    personA: readParticipant(code, "personA"),
    personB: readParticipant(code, "personB"),
    myRole: myRoleRaw === "personA" || myRoleRaw === "personB" ? myRoleRaw : null,
  };
}

export function setMyRole(code: string, role: Role): void {
  sessionStorage.setItem(k(code, "myrole"), role);
  broadcastSync(code);
}

export function saveAnswers(code: string, role: Role, answers: AnswerMap, step?: number): void {
  localStorage.setItem(k(code, `${role}_answers`), JSON.stringify(answers));
  if (typeof answers.p1 === "string" && answers.p1.trim()) {
    localStorage.setItem(k(code, `${role}_name`), answers.p1.trim());
  }
  if (typeof step === "number") {
    localStorage.setItem(k(code, `${role}_step`), String(step));
  }
  localStorage.setItem(k(code, `${role}_updated`), new Date().toISOString());
  broadcastSync(code);
}

export function saveStep(code: string, role: Role, step: number): void {
  localStorage.setItem(k(code, `${role}_step`), String(step));
  broadcastSync(code);
}

export function markSubmitted(code: string, role: Role, answers: AnswerMap): void {
  saveAnswers(code, role, answers);
  localStorage.setItem(k(code, `${role}_submitted`), "true");
  localStorage.setItem(k(code, `${role}_submittedAt`), new Date().toISOString());
  broadcastSync(code);
}

export function importParticipant(code: string, role: Role, name: string, answers: AnswerMap): void {
  ensureSession(code);
  localStorage.setItem(k(code, `${role}_answers`), JSON.stringify(answers));
  localStorage.setItem(k(code, `${role}_name`), name || (typeof answers.p1 === "string" ? answers.p1 : role === "personA" ? "Person A" : "Person B"));
  localStorage.setItem(k(code, `${role}_submitted`), "true");
  localStorage.setItem(k(code, `${role}_updated`), new Date().toISOString());
  broadcastSync(code);
}

export function clearRoleData(code: string, role: Role): void {
  const suffixes = ["_answers", "_name", "_submitted", "_submittedAt", "_step", "_updated"];
  suffixes.forEach((s) => localStorage.removeItem(k(code, `${role}${s}`)));
  if (sessionStorage.getItem(k(code, "myrole")) === role) {
    sessionStorage.removeItem(k(code, "myrole"));
  }
  broadcastSync(code);
}

export function nukeSession(code: string): void {
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`session_${code}_`)) toRemove.push(key);
  }
  toRemove.forEach((key) => localStorage.removeItem(key));
  sessionStorage.removeItem(k(code, "myrole"));
  broadcastSync(code);
}
