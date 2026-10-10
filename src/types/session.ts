import type { AnswerMap } from "./form";

export type Role = "personA" | "personB";

export interface ParticipantState {
  exists: boolean;
  name: string;
  answers: AnswerMap;
  submitted: boolean;
  /** 0-based current step index for live progress display. */
  step: number;
  updatedAt?: string;
}

export interface SessionSnapshot {
  code: string;
  created: string | null;
  personA: ParticipantState;
  personB: ParticipantState;
  /** Which role THIS browser controls. */
  myRole: Role | null;
}

export const emptyParticipant = (): ParticipantState => ({
  exists: false,
  name: "",
  answers: {},
  submitted: false,
  step: 0,
});
