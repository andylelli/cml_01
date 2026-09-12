/**
 * A_90 Move 2 — THE CULPRIT'S ALIBI IS COMPUTED FROM THE TWO DEATH TIMES, NOT AUTHORED BESIDE THEM.
 *
 * The deception in every one of this project's cases rests on two invariants that are pure
 * arithmetic: the STAGED time of death sits inside the culprit's alibi (that is what the staging is
 * for), and the REAL time sits outside it (that is what convicts). MEASURED over the archive
 * (ANALYSIS_90 §9): of 48 decidable cases, 13 (27%) break one of the two. Every one was authored by
 * Agent 3 in the same call that authored the times — the model was asked to satisfy an inequality it
 * had just been told about, and a quarter of the time it did not.
 *
 * `checkCaseTimelineDeception` detects both, and since the 2026-09-05 vocabulary flags it detects
 * every archived shape (15 of 15). Detection then costs a retry, and on `actual_covered` the retry
 * has been measured twice to reproduce the identical broken case (see `repairActualCovered`). This
 * module removes the inequality from the model's hands:
 *
 *   1. BEFORE the call, `planAlibiBranches` prints the window the culprit must have for each way
 *      the model may assign the two locked clock values to apparent/actual. The model copies a
 *      value; it does not solve an inequality.
 *   2. AFTER the call, `renderPlannedCulpritAlibi` re-reads the model's apparent/actual and checks
 *      the culprit's emitted window against the two invariants. A window that satisfies them is
 *      LEFT ALONE — the model's own coherent story wins. A window that breaks them, or cannot be
 *      read, is rendered from the numbers with the model's location kept, and the change is logged.
 *
 * This is `temporal-spine.ts`'s principle applied to the one field that carried the most clock values
 * in the project (448 of 1,312): compute the number, render the words from it.
 *
 * Deterministic, no randomness: the same pair of times always yields the same window, so a resumed
 * run reproduces itself. Flag `AGENT3_ALIBI_PLAN`, default OFF, read at call time (ADR-0004).
 */
import {
  alibiSpanToWindow,
  isValidAlibiSpan,
  parseClockTime,
  parseDurationMinutes,
  parseTimeWindow,
  type AlibiSpan,
} from "./timeline-deception.js";
import { alibiSpanFromWindow, extractSpanLocation, renderAlibiWindow } from "./alibi-span.js";

const DIAL = 720;
const mod = (n: number): number => ((n % DIAL) + DIAL) % DIAL;

export const isAlibiPlanEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3_ALIBI_PLAN ?? ""));

/**
 * `AGENT3_DECEPTION_PAIR` — when the registry locks THREE or more clocks, which two are the
 * deception's? FOUND BY RUN 81042: the device locked the chime's actual strike (3:25), its displayed
 * time (3:45) and the victim's stopped watch (3:10), plus an interval derived from the first two.
 * Both `buildDeviceArithmeticRule` (needs 1–2 clocks) and `planAlibiBranches` (needs exactly 2)
 * self-gated to nothing, the model got no arithmetic and no computed window, staged 3:45 outside the
 * culprit's 4:00–4:30, and on the retry obeyed the validator literally — it moved the APPARENT time
 * to four o'clock, off every locked value — rather than moving the window. The device had already
 * said which two clocks matter: the interval's `derivedFrom`. This reads that declaration; it does
 * not guess. Runtime-read (ADR-0004); OFF leaves both rules byte-identical.
 */
export const isDeceptionPairEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3_DECEPTION_PAIR ?? ""));

export interface LockedClock {
  id: string;
  raw: string;
  dial: number;
}

export interface LockedDuration {
  id: string;
  raw: string;
  minutes: number;
}

export interface DeceptionPair {
  clocks: [LockedClock, LockedClock];
  /** The interval the device declares between them. */
  interval: LockedDuration;
}

export const readLockedClocksAndDurations = (
  lockedFacts: ReadonlyArray<{ id?: unknown; value?: unknown }>,
): { clocks: LockedClock[]; durations: LockedDuration[] } => {
  const clocks: LockedClock[] = [];
  const durations: LockedDuration[] = [];
  for (const fact of lockedFacts) {
    const raw = String(fact?.value ?? "").trim();
    if (!raw) continue;
    const id = String(fact?.id ?? "").trim() || "(unnamed)";
    const asDuration = parseDurationMinutes(raw);
    if (asDuration !== null) {
      durations.push({ id, raw, minutes: asDuration });
      continue;
    }
    const asClock = parseClockTime(raw);
    if (asClock !== null) clocks.push({ id, raw, dial: asClock });
  }
  return { clocks, durations };
};

/**
 * The two clocks a locked duration declares itself derived from, when both are locked clocks. Null
 * when the device declares no such pair — this never infers one from proximity or naming.
 */
export const selectDeceptionPair = (
  lockedFacts: ReadonlyArray<{ id?: unknown; value?: unknown; derivedFrom?: unknown }>,
): DeceptionPair | null => {
  const { clocks, durations } = readLockedClocksAndDurations(lockedFacts);
  for (const fact of lockedFacts) {
    if (!Array.isArray(fact?.derivedFrom) || fact.derivedFrom.length !== 2) continue;
    const id = String(fact?.id ?? "").trim();
    const interval = durations.find((d) => d.id === id);
    if (!interval) continue;
    const [x, y] = (fact.derivedFrom as unknown[]).map((v) => String(v).trim());
    const a = clocks.find((c) => c.id === x);
    const b = clocks.find((c) => c.id === y);
    if (!a || !b || a === b) continue;
    return { clocks: [a, b], interval };
  }
  return null;
};

/** Inclusive containment on the 12-hour dial. A wrapping window [start > end] covers midnight/noon. */
export const dialWindowContains = (start: number, end: number, x: number): boolean => {
  const s = mod(start);
  const e = mod(end);
  const m = mod(x);
  return e >= s ? m >= s && m <= e : m >= s || m <= e;
};

/** "4:05" — the digit form the archive's alibi windows already use (58 of 58 cases). */
export const renderDialDigits = (dial: number): string => {
  const m = mod(Math.round(dial));
  const hour = Math.floor(m / 60) % 12 || 12;
  return `${hour}:${String(m % 60).padStart(2, "0")}`;
};

/** How long a planned alibi runs. Long enough to be an event, short enough to be checkable. */
const PLANNED_LENGTH = 35;
/** How far past the staged time the window may run, when the real time leaves room for it. */
const PLANNED_TAIL = 15;
/** The real time never sits on the boundary — a minute either side reads as inside to a reader. */
const REAL_TIME_GAP = 5;

/**
 * A window that contains the staged time and excludes the real one, on five-minute marks.
 *
 * WHY IT CANNOT FAIL when the two times differ: the window is built outward from the staged time on
 * the side AWAY from the real one, and on the near side it stops at least `REAL_TIME_GAP` short of
 * the real time (or at the staged time itself when the two are closer than that). Only the dial's
 * twelve can shorten it — a window is not allowed to wrap, because every parser downstream reads a
 * wrapping window as two days — and shrinking toward the staged time keeps both invariants.
 *
 * Returns null for the shapes it does not own: identical times (`times_identical` is a different
 * defect), unreadable input, or the vanishingly rare case where the dial leaves no room at all.
 */
export const planCulpritAlibiSpan = (apparentDial: number, actualDial: number): AlibiSpan | null => {
  if (!Number.isFinite(apparentDial) || !Number.isFinite(actualDial)) return null;
  const a = mod(Math.round(apparentDial));
  const r = mod(Math.round(actualDial));
  if (a === r) return null;

  const forward = mod(r - a);                 // clockwise minutes from the staged time to the real one
  const realIsAfter = forward <= DIAL / 2;

  let startOff: number;
  let endOff: number;
  if (realIsAfter) {
    endOff = Math.max(0, Math.floor(Math.min(PLANNED_TAIL, forward - REAL_TIME_GAP) / 5) * 5);
    startOff = endOff - PLANNED_LENGTH;
  } else {
    const backward = mod(a - r);
    startOff = -Math.max(0, Math.floor(Math.min(PLANNED_TAIL, backward - REAL_TIME_GAP) / 5) * 5);
    endOff = startOff + PLANNED_LENGTH;
  }

  // Five-minute marks on the far side, always rounding AWAY from the staged time so the window only
  // ever grows on the side the real time is not on.
  let start = a + startOff;
  let end = a + endOff;
  if (realIsAfter) start = Math.floor(start / 5) * 5;
  else end = Math.ceil(end / 5) * 5;

  // Never cross the dial's twelve.
  if (start < 0) start = 0;
  if (end > DIAL - 5) end = DIAL - 5;
  if (start > end) return null;
  if (end - start < 5) return null;
  if (!dialWindowContains(start, end, a) || dialWindowContains(start, end, r)) return null;

  return {
    startHour: Math.floor(start / 60) % 12,
    startMinute: start % 60,
    endHour: Math.floor(end / 60) % 12,
    endMinute: end % 60,
  };
};

export interface AlibiPlanBranch {
  apparentId: string;
  apparentRaw: string;
  actualId: string;
  actualRaw: string;
  /** Digit form, "3:55 to 4:30" — what the model copies into `alibi_window`, location appended by it. */
  window: string;
  span: AlibiSpan;
}

/**
 * One branch per way the model may assign the locked clock values to apparent/actual. Two locked
 * clocks give two branches; one locked clock plus one duration gives four (the other value is the
 * anchor plus or minus the duration, and either may be the staged one). The DIRECTION stays the
 * model's decision, exactly as `buildDeviceArithmeticRule` leaves it; only the inequality is taken
 * away. Any other registry shape returns no branches and the prompt is byte-identical.
 */
export const planAlibiBranches = (
  lockedFacts: ReadonlyArray<{ id?: unknown; value?: unknown; derivedFrom?: unknown }>,
): AlibiPlanBranch[] => {
  let { clocks, durations } = readLockedClocksAndDurations(lockedFacts);
  // Three or more locked clocks: the device's own derivedFrom names the two that matter (run 81042).
  if (isDeceptionPairEnabled() && clocks.length >= 3) {
    const pair = selectDeceptionPair(lockedFacts);
    if (pair) {
      clocks = [...pair.clocks];
      durations = [pair.interval];
    }
  }

  const candidates: Array<{ apparent: typeof clocks[0]; actual: typeof clocks[0] }> = [];
  if (clocks.length === 2) {
    const [x, y] = clocks as [typeof clocks[0], typeof clocks[0]];
    candidates.push({ apparent: x, actual: y }, { apparent: y, actual: x });
  } else if (clocks.length === 1 && durations.length === 1) {
    const anchor = clocks[0]!;
    const d = durations[0]!;
    for (const sign of [1, -1] as const) {
      const other = {
        id: `${anchor.id} ${sign > 0 ? "plus" : "less"} ${d.id}`,
        raw: renderDialDigits(anchor.dial + sign * d.minutes),
        dial: mod(anchor.dial + sign * d.minutes),
      };
      candidates.push({ apparent: anchor, actual: other }, { apparent: other, actual: anchor });
    }
  }

  const branches: AlibiPlanBranch[] = [];
  for (const c of candidates) {
    const span = planCulpritAlibiSpan(c.apparent.dial, c.actual.dial);
    if (!span) continue;
    const [s, e] = alibiSpanToWindow(span);
    branches.push({
      apparentId: c.apparent.id,
      apparentRaw: c.apparent.raw,
      actualId: c.actual.id,
      actualRaw: c.actual.raw,
      window: `${renderDialDigits(s)} to ${renderDialDigits(e)}`,
      span,
    });
  }
  return branches;
};

export interface PlannedAlibiChange {
  name: string;
  before: string;
  after: string;
  /** Which invariant the emitted window broke, or `unreadable`. */
  reason: "unreadable" | "apparent_not_covered" | "actual_covered" | "apparent_not_covered+actual_covered";
}

/** A location the extractor returned that still carries a clock value is not a location. */
const cleanLocation = (raw: string | null | undefined): string | undefined => {
  const text = String(raw ?? "").trim();
  if (!text) return undefined;
  if (parseTimeWindow(text, { wide: true }) || parseClockTime(text) !== null) return undefined;
  if (/\d{1,2}[:.]\d{2}/.test(text)) return undefined;
  return text;
};

/**
 * Post-generation: keep every culprit window that satisfies the two invariants; render every one
 * that does not. Mutates the case in place (the same contract as `deriveAlibiSpans` and
 * `repairCulpritAlibiCoverage`, which run beside it) and returns what changed.
 */
export const renderPlannedCulpritAlibi = (cml: any): PlannedAlibiChange[] => {
  const caseBlock = cml?.CASE ?? cml;
  const mech = caseBlock?.hidden_model?.mechanism ?? {};
  const apparent = parseClockTime(mech.apparent_time_of_death);
  const actual = parseClockTime(mech.actual_time_of_death);
  if (apparent === null || actual === null) return [];

  const culprits: string[] = (caseBlock?.culpability?.culprits ?? [])
    .map((n: unknown) => String(n ?? "").trim())
    .filter(Boolean);
  if (culprits.length === 0) return [];

  const changes: PlannedAlibiChange[] = [];
  for (const member of Array.isArray(caseBlock?.cast) ? caseBlock.cast : []) {
    if (!member || typeof member !== "object") continue;
    if (!culprits.includes(String(member.name ?? "").trim())) continue;

    const window = String(member.alibi_window ?? member.alibiWindow ?? "").trim();
    const span: AlibiSpan | null = isValidAlibiSpan(member.alibi_span)
      ? member.alibi_span
      : alibiSpanFromWindow(window);

    let reason: PlannedAlibiChange["reason"] | null = null;
    if (!span) {
      reason = "unreadable";
    } else {
      const [s, e] = alibiSpanToWindow(span);
      const coversApparent = dialWindowContains(s, e, apparent);
      const coversActual = dialWindowContains(s, e, actual);
      if (coversApparent && !coversActual) continue;          // the model's own window is coherent: keep it
      reason = !coversApparent && coversActual
        ? "apparent_not_covered+actual_covered"
        : !coversApparent ? "apparent_not_covered" : "actual_covered";
    }

    const planned = planCulpritAlibiSpan(apparent, actual);
    if (!planned) continue;
    const location = cleanLocation(span?.location) ?? cleanLocation(extractSpanLocation(window));
    const rendered: AlibiSpan = { ...planned, ...(location ? { location } : {}) };
    member.alibi_span = rendered;
    member.alibi_window = renderAlibiWindow(rendered);
    changes.push({ name: String(member.name ?? "?"), before: window, after: member.alibi_window, reason });
  }
  return changes;
};
