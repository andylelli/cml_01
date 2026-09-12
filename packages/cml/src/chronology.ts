/**
 * A_90 Moves 1 and 3 — ONE CHRONOLOGY, SOLVED FROM THE DEVICE, PRINTED BEFORE A WORD IS WRITTEN.
 *
 * WHAT WENT WRONG ON THE 82/100 BOOK (run 88651, `ANALYSIS_90` §10). The device locked one clock
 * ("music restarts at twenty minutes past four") and three durations (seven, three, ten minutes). No
 * duration said which clock it starts or ends at, so `buildDeviceArithmeticRule` — which needs
 * exactly one duration — printed nothing, and Agent 3 wrote "a silent intermission starting at four
 * o'clock". Four o'clock plus seven minutes is not twenty past four. The reader did the subtraction.
 *
 * THE MISSING FIELD is a duration's anchor: `{ at: "<clock fact id>", edge: "start" | "end" }`.
 * With it the intermission that ENDS at the music restart is known to begin at thirteen minutes past
 * four before Agent 3 runs. This module:
 *
 *   • `solveLockedChronology` — events from the locked clocks, then every anchored duration solved
 *     to its other endpoint, to a fixed point. Intervals are PAIRS OF EVENTS, never free durations,
 *     so an interval cannot disagree with its own length. Durations nothing anchors stay `unplaced`
 *     and are reported, never guessed (A_89 A1's guess had a 94% false-positive rate).
 *   • `renderChronologyBlock` — the solved clock, printed into the Agent 3 prompt as settled values.
 *     This is where Move 3 renders `constraint_space.time.*`: at authoring time, not in a post-pass
 *     that rewrites one field and leaves the same number wrong in four others.
 *   • `deriveCaseChronology` — after generation, the same object rebuilt from the case: death times,
 *     `time.anchors`, `time.windows`, alibi endpoints, plus the locked/solved events.
 *   • `findUnanchoredClockValues` (Move 1) — every clock value anywhere in an artifact must resolve
 *     to an event of the chronology. MEASURED over 53 archived cases with anchors and windows
 *     counted as declarations: 27 stray values (6%), in 17 cases (32%). Reported, not gated: 32% is
 *     above B1's off-switch line, so the lever is the prompt operation and this is its instrument.
 *   • `checkChronologyCoherence` — a window whose stated length disagrees with its endpoints, and a
 *     case anchor that contradicts a solved event. Error-level only under `AGENT3_CHRONOLOGY_ERRORS`.
 *   • `renderCaseTimes` — the ONE post-pass rewrite that cannot create a new contradiction: a death
 *     time that parses to a locked clock but spells it differently is respelled to the locked form.
 *     Free-text durations and endpoints are deliberately NOT rewritten here; they reach Agent 4's
 *     revision as findings instead, because a single-field rewrite of a value that also appears in
 *     the mechanism, the anchors and the clues manufactures the contradiction it meant to remove.
 *
 * Flags: `AGENT3_CHRONOLOGY` (prompt block + telemetry + spelling), `AGENT3_CHRONOLOGY_ERRORS`
 * (coherence findings become validation errors), both default OFF, read at call time (ADR-0004).
 */
import { buildTemporalSpine, renderClockWords, type SpineFactInput } from "./temporal-spine.js";
import {
  alibiSpanToWindow,
  isValidAlibiSpan,
  parseClockTime,
  parseDurationMinutes,
  parseTimeWindow,
} from "./timeline-deception.js";
import { alibiSpanFromWindow } from "./alibi-span.js";

const DIAL = 720;
const mod = (n: number): number => ((n % DIAL) + DIAL) % DIAL;

export const isChronologyEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3_CHRONOLOGY ?? ""));
export const isChronologyErrorsEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3_CHRONOLOGY_ERRORS ?? ""));

export interface DurationAnchor {
  /** A clock fact id, or another duration's computed endpoint: `<id>_start` / `<id>_end`. */
  at: string;
  /** The duration STARTS at that event, or ENDS at it. */
  edge: "start" | "end";
}

export interface ChronologyFactInput extends SpineFactInput {
  anchor?: unknown;
}

export interface ChronoEvent {
  id: string;
  label: string;
  /** Minutes on the 12-hour dial, 0..719 — the unit every validator in this package already uses. */
  dial: number;
  /** The raw spelling the case or device used, when there is one; solved events have none. */
  raw?: string;
  source: "locked" | "solved" | "case";
  /** For a solved event: the arithmetic that produced it, in words. */
  via?: string;
}

export interface ChronoInterval {
  id: string;
  label: string;
  start: string;
  end: string;
  /** Minutes from `start` to `end` on the dial. */
  minutes: number;
  source: "locked" | "case";
  /** A length the case STATES for this interval, when it states one — checked against `minutes`. */
  statedMinutes?: number | null;
  /** The locked duration's own spelling ("seven minutes"), so the prompt prints the value the prose will. */
  lengthRaw?: string;
}

export interface UnplacedDuration {
  id: string;
  raw: string;
  minutes: number;
  /** Why it could not be placed. */
  reason: string;
}

export interface Chronology {
  events: ChronoEvent[];
  intervals: ChronoInterval[];
  unplaced: UnplacedDuration[];
  notes: string[];
}

export const parseDurationAnchor = (raw: unknown): DurationAnchor | null => {
  if (!raw || typeof raw !== "object") return null;
  const at = String((raw as any).at ?? (raw as any).event ?? "").trim();
  const edgeRaw = String((raw as any).edge ?? "").trim().toLowerCase();
  const edge = /^start/.test(edgeRaw) ? "start" : /^end/.test(edgeRaw) ? "end" : null;
  if (!at || !edge) return null;
  return { at, edge };
};

const addEvent = (
  chrono: Chronology,
  event: Omit<ChronoEvent, "dial"> & { dial: number | null },
): string | null => {
  if (event.dial === null || !Number.isFinite(event.dial)) return null;
  const dial = mod(Math.round(event.dial));
  chrono.events.push({ ...event, dial });
  return event.id;
};

const findEvent = (chrono: Chronology, id: string): ChronoEvent | undefined =>
  chrono.events.find((e) => e.id === id);

/**
 * Events from the locked clocks, then anchored durations solved outward to a fixed point.
 */
export const solveLockedChronology = (facts: ReadonlyArray<ChronologyFactInput>): Chronology => {
  const chrono: Chronology = { events: [], intervals: [], unplaced: [], notes: [] };
  const list = (facts ?? []).filter((f) => String(f?.value ?? "").trim().length > 0);
  if (list.length === 0) return chrono;

  const spine = buildTemporalSpine(list);
  const byId = new Map(list.map((f) => [String(f.id ?? "").trim(), f] as const));

  for (const instant of spine.instants) {
    const fact = byId.get(instant.id);
    addEvent(chrono, {
      id: instant.id,
      label: String(fact?.description ?? "").trim() || instant.id,
      dial: instant.minutes % DIAL,
      raw: String(fact?.value ?? "").trim(),
      source: "locked",
    });
  }

  type Pending = { id: string; raw: string; minutes: number; anchor: DurationAnchor | null; derivedFrom: string[] };
  const pending: Pending[] = spine.durations.map((d) => {
    const fact = byId.get(d.id);
    return {
      id: d.id,
      raw: String(fact?.value ?? "").trim(),
      minutes: d.minutes,
      anchor: parseDurationAnchor(fact?.anchor),
      derivedFrom: Array.isArray(fact?.derivedFrom) ? (fact!.derivedFrom as unknown[]).map((x) => String(x).trim()) : [],
    };
  });

  // A duration derived from two CLOCK facts is the interval between them — already an event pair.
  const placed = new Set<string>();
  for (const d of pending) {
    if (d.derivedFrom.length !== 2) continue;
    const [x, y] = d.derivedFrom as [string, string];
    const ex = findEvent(chrono, x);
    const ey = findEvent(chrono, y);
    if (!ex || !ey) continue;
    const forward = mod(ey.dial - ex.dial);
    const [start, end] = forward === d.minutes || forward <= DIAL / 2 ? [ex, ey] : [ey, ex];
    chrono.intervals.push({
      id: d.id,
      label: String(byId.get(d.id)?.description ?? "").trim() || d.id,
      start: start.id,
      end: end.id,
      minutes: mod(end.dial - start.dial),
      source: "locked",
      statedMinutes: d.minutes,
      lengthRaw: d.raw,
    });
    placed.add(d.id);
  }

  // Anchored durations, to a fixed point: an anchor may name an event another duration solved.
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const d of pending) {
      if (placed.has(d.id) || !d.anchor) continue;
      const at = findEvent(chrono, d.anchor.at);
      if (!at) continue;
      const label = String(byId.get(d.id)?.description ?? "").trim() || d.id;
      if (d.anchor.edge === "end") {
        const startId = `${d.id}_start`;
        if (!findEvent(chrono, startId)) {
          addEvent(chrono, {
            id: startId,
            label: `${d.id} begins`,
            dial: at.dial - d.minutes,
            source: "solved",
            via: `${at.raw ?? renderClockWords(at.dial)} less ${d.raw}`,
          });
        }
        chrono.intervals.push({ id: d.id, label, start: startId, end: at.id, minutes: d.minutes, source: "locked", statedMinutes: d.minutes, lengthRaw: d.raw });
      } else {
        const endId = `${d.id}_end`;
        if (!findEvent(chrono, endId)) {
          addEvent(chrono, {
            id: endId,
            label: `${d.id} ends`,
            dial: at.dial + d.minutes,
            source: "solved",
            via: `${at.raw ?? renderClockWords(at.dial)} plus ${d.raw}`,
          });
        }
        chrono.intervals.push({ id: d.id, label, start: at.id, end: endId, minutes: d.minutes, source: "locked", statedMinutes: d.minutes, lengthRaw: d.raw });
      }
      placed.add(d.id);
      progressed = true;
    }
  }

  for (const d of pending) {
    if (placed.has(d.id)) continue;
    const reason = d.anchor
      ? `anchored at "${d.anchor.at}", which is not a clock fact or a solved endpoint`
      : d.derivedFrom.length === 2
        ? `derived from ${d.derivedFrom.join(" and ")}, which are not both clock facts`
        : "no anchor and no derivation";
    chrono.unplaced.push({ id: d.id, raw: d.raw, minutes: d.minutes, reason });
  }
  for (const u of spine.unreadable) chrono.notes.push(`unreadable locked fact: ${u}`);
  return chrono;
};

// ── Clock values in free text ─────────────────────────────────────────────────────────────────────

const HOUR_WORDS = "one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|midnight|noon";
const UNIT_WORDS = "one|two|three|four|five|six|seven|eight|nine";
const TEEN_WORDS = "ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen";
const TENS_WORDS = "twenty|thirty|forty|fifty";

/**
 * Every spelling a clock value takes in this project's cases and prose: "4:13", "thirteen
 * minutes past four", "a quarter to five", "four o'clock", and the spoken "three fifty-five" that
 * `renderAlibiWindow` writes. Each candidate is confirmed by `parseClockTime`, so a phrase the
 * pattern over-reaches for ("went to four") is dropped rather than counted.
 */
export const CLOCK_PHRASE_RE = new RegExp(
  [
    String.raw`\b\d{1,2}:\d{2}\b`,
    String.raw`\b(?:(?:a\s+)?(?:quarter|half)|(?:${TENS_WORDS})(?:-(?:${UNIT_WORDS}))?(?:\s+minutes?)?|(?:${TEEN_WORDS}|${UNIT_WORDS})(?:\s+minutes?)?)\s+(?:past|after|to|before)\s+(?:${HOUR_WORDS})\b`,
    String.raw`\b(?:${HOUR_WORDS})\s+o['’]?clock\b`,
    String.raw`\b(?:${HOUR_WORDS})\s+(?:oh\s+(?:${UNIT_WORDS})|(?:${TENS_WORDS})(?:-(?:${UNIT_WORDS}))?|${TEEN_WORDS})\b`,
  ].join("|"),
  "gi",
);

export interface ClockValue {
  raw: string;
  dial: number;
}

export const extractClockValues = (text: string): ClockValue[] => {
  const out: ClockValue[] = [];
  const src = String(text ?? "");
  CLOCK_PHRASE_RE.lastIndex = 0;
  for (const m of src.matchAll(CLOCK_PHRASE_RE)) {
    const raw = m[0];
    const dial = parseClockTime(raw);
    if (dial === null) continue;
    out.push({ raw, dial: mod(dial) });
  }
  return out;
};

// ── The chronology as the case states it ──────────────────────────────────────────────────────────

/**
 * A window entry as THE CLOCK asks for it: "<start> to <end> — <what happens> (<length>)". The
 * endpoints are read from the part before any dash or parenthetical, so a label that happens to
 * contain a number cannot become an endpoint; the length is read from its own phrase.
 */
const windowHead = (entry: string): string =>
  entry.replace(/\([^)]*\)/g, " ").split(/\s[—–-]\s|:\s(?=[A-Za-z])/)[0] ?? entry;

/**
 * A length, not a clock: "seven minutes" yes, the "twenty-five minutes" of "twenty-five minutes past
 * three" no. FOUND BY RUN 81042's telemetry — the first version read the case's own window
 * "ten minutes past three to twenty-five minutes past three" as a 25-minute length and reported a
 * mismatch that did not exist. `AGENT3_CHRONOLOGY_ERRORS` was OFF, so it cost nothing; had it been on
 * it would have sent Agent 4 to repair a correct window. The negative lookahead is the fix.
 */
const DURATION_PHRASE_RE = /\b(?:\d{1,3}|[a-z]+(?:-[a-z]+)?(?:\s+and\s+a\s+half)?)\s*[-\s]?\s*minutes?\b(?!\s+(?:past|to|after|before|until|till)\b)|\b(?:an?|\d{1,2}|[a-z]+)\s+hours?(?:\s+and\s+(?:a\s+half|[a-z]+\s+minutes?))?\b(?!\s+(?:past|to|after|before|until|till)\b)/i;

const statedLength = (entry: string): number | null => {
  const m = DURATION_PHRASE_RE.exec(entry);
  if (!m) return null;
  return parseDurationMinutes(m[0]);
};

/** The fields that DECLARE events; a clock value there defines the chronology rather than using it. */
const DECLARATION_PATH_RE = /^(?:constraint_space\.time\.(?:anchors|windows)\[\]|cast\[\]\.alibi_window|hidden_model\.mechanism\.(?:apparent|actual)_time_of_death)$/;

export const deriveCaseChronology = (
  cmlCase: any,
  facts: ReadonlyArray<ChronologyFactInput> = [],
): Chronology => {
  const C = cmlCase?.CASE ?? cmlCase ?? {};
  const chrono = solveLockedChronology(facts);

  const mech = C?.hidden_model?.mechanism ?? {};
  for (const [id, field] of [["apparent_time_of_death", mech.apparent_time_of_death], ["actual_time_of_death", mech.actual_time_of_death]] as const) {
    const raw = String(field ?? "").trim();
    if (!raw) continue;
    addEvent(chrono, { id, label: id.replace(/_/g, " "), dial: parseClockTime(raw), raw, source: "case" });
  }

  const T = C?.constraint_space?.time ?? {};
  (Array.isArray(T.anchors) ? T.anchors : []).forEach((entry: unknown, i: number) => {
    const s = String(entry ?? "");
    extractClockValues(s).forEach((c, j) =>
      addEvent(chrono, { id: `anchor_${i}${j ? `_${j}` : ""}`, label: s, dial: c.dial, raw: c.raw, source: "case" }),
    );
  });

  (Array.isArray(T.windows) ? T.windows : []).forEach((entry: unknown, i: number) => {
    const s = String(entry ?? "");
    const window = parseTimeWindow(windowHead(s), { wide: true });
    if (!window) {
      extractClockValues(s).forEach((c, j) =>
        addEvent(chrono, { id: `window_${i}${j ? `_${j}` : ""}`, label: s, dial: c.dial, raw: c.raw, source: "case" }),
      );
      return;
    }
    const [start, end] = window;
    const startId = addEvent(chrono, { id: `window_${i}_start`, label: `${s} — start`, dial: start, source: "case" });
    const endId = addEvent(chrono, { id: `window_${i}_end`, label: `${s} — end`, dial: end, source: "case" });
    if (!startId || !endId) return;
    chrono.intervals.push({
      id: `window_${i}`,
      label: s,
      start: startId,
      end: endId,
      minutes: mod(end - start),
      source: "case",
      statedMinutes: statedLength(s),
    });
  });

  for (const member of Array.isArray(C?.cast) ? C.cast : []) {
    if (!member || typeof member !== "object") continue;
    const name = String(member.name ?? "").trim() || "?";
    const span = isValidAlibiSpan(member.alibi_span)
      ? member.alibi_span
      : alibiSpanFromWindow(String(member.alibi_window ?? member.alibiWindow ?? ""));
    if (!span) continue;
    const [start, end] = alibiSpanToWindow(span);
    const startId = addEvent(chrono, { id: `alibi:${name}:start`, label: `${name}'s alibi begins`, dial: start, source: "case" });
    const endId = addEvent(chrono, { id: `alibi:${name}:end`, label: `${name}'s alibi ends`, dial: end, source: "case" });
    if (startId && endId) {
      chrono.intervals.push({ id: `alibi:${name}`, label: `${name}'s alibi`, start: startId, end: endId, minutes: mod(end - start), source: "case" });
    }
  }

  return chrono;
};

// ── Move 1: every clock value resolves to an event ────────────────────────────────────────────────

export interface UnanchoredClockValue {
  path: string;
  raw: string;
  dial: number;
}

export interface ClockAnchoring {
  /** Clock values examined (declaration fields excluded). */
  total: number;
  unanchored: UnanchoredClockValue[];
}

const walkStrings = (value: unknown, path: string, visit: (path: string, text: string) => void): void => {
  if (typeof value === "string") {
    visit(path, value);
  } else if (Array.isArray(value)) {
    for (const item of value) walkStrings(item, `${path}[]`, visit);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      walkStrings(v, path ? `${path}.${k}` : k, visit);
    }
  }
};

/**
 * Walk any artifact — the case, the clues, the outline — and report every clock value that matches
 * no event of the chronology. For the case itself the declaration fields are skipped; pass `skip`
 * to exclude other artifacts' own declaration fields.
 */
export const findUnanchoredClockValues = (
  artifact: unknown,
  chrono: Chronology,
  opts: { skip?: (path: string) => boolean } = {},
): ClockAnchoring => {
  const dials = new Set(chrono.events.map((e) => e.dial));
  const skip = opts.skip ?? ((path: string) => DECLARATION_PATH_RE.test(path));
  const result: ClockAnchoring = { total: 0, unanchored: [] };
  walkStrings(artifact, "", (path, text) => {
    if (skip(path)) return;
    for (const value of extractClockValues(text)) {
      result.total += 1;
      if (!dials.has(value.dial)) result.unanchored.push({ path, raw: value.raw, dial: value.dial });
    }
  });
  return result;
};

// ── Coherence: an interval cannot disagree with its own endpoints ─────────────────────────────────

export interface ChronologyFinding {
  code: "window_duration_mismatch" | "anchor_contradicts_solved_event";
  path: string;
  message: string;
}

const STOP_TOKENS = new Set(["duration", "interval", "window", "time", "minutes", "minute", "hours", "hour", "period", "length", "delay", "gap", "start", "end", "begins", "ends"]);
const distinctiveTokens = (text: string): string[] =>
  Array.from(new Set(String(text).toLowerCase().split(/[^a-z]+/).filter((t) => t.length >= 5 && !STOP_TOKENS.has(t))));

export const checkChronologyCoherence = (
  cmlCase: any,
  chrono: Chronology,
  facts: ReadonlyArray<ChronologyFactInput> = [],
): ChronologyFinding[] => {
  const C = cmlCase?.CASE ?? cmlCase ?? {};
  const findings: ChronologyFinding[] = [];

  for (const interval of chrono.intervals) {
    if (interval.source !== "case" || interval.statedMinutes == null) continue;
    if (interval.statedMinutes === interval.minutes) continue;
    const start = findEvent(chrono, interval.start);
    const end = findEvent(chrono, interval.end);
    if (!start || !end) continue;
    findings.push({
      code: "window_duration_mismatch",
      path: `constraint_space.time.windows[${interval.id.replace(/^window_/, "")}]`,
      message:
        `"${interval.label}" runs ${renderClockWords(start.dial)} to ${renderClockWords(end.dial)}, ` +
        `which is ${interval.minutes} minutes, but states a length of ${interval.statedMinutes} minutes. ` +
        `An interval is the pair of times at its ends; change whichever single value is wrong so the ` +
        `subtraction comes out, and keep the other two.`,
    });
  }

  // A case anchor about the same thing as a solved event, at a different time. Conservative on
  // purpose: at least two distinctive tokens must be shared, and the anchor's clock must match NO
  // locked or solved event — a coincidence with any settled value is not a contradiction.
  const settled = new Set(chrono.events.filter((e) => e.source !== "case").map((e) => e.dial));
  const anchors: string[] = Array.isArray(C?.constraint_space?.time?.anchors) ? C.constraint_space.time.anchors.map(String) : [];
  for (const event of chrono.events) {
    if (event.source !== "solved") continue;
    const durationId = event.id.replace(/_(start|end)$/, "");
    const fact = facts.find((f) => String(f?.id ?? "").trim() === durationId);
    const tokens = distinctiveTokens(`${durationId.replace(/_/g, " ")} ${String(fact?.description ?? "")}`);
    if (tokens.length < 2) continue;
    anchors.forEach((anchor, i) => {
      const anchorTokens = new Set(distinctiveTokens(anchor));
      const shared = tokens.filter((t) => anchorTokens.has(t));
      if (shared.length < 2) return;
      for (const value of extractClockValues(anchor)) {
        if (settled.has(value.dial)) continue;
        findings.push({
          code: "anchor_contradicts_solved_event",
          path: `constraint_space.time.anchors[${i}]`,
          message:
            `"${anchor}" places ${shared.join("/")} at ${renderClockWords(value.dial)}, but the device settles ` +
            `${event.label} at ${renderClockWords(event.dial)} (${event.via}). Use the settled value.`,
        });
      }
    });
  }

  return findings;
};

// ── The one safe post-pass: spelling ──────────────────────────────────────────────────────────────

export interface CaseTimeRender {
  path: string;
  before: string;
  after: string;
  reason: string;
}

export const renderCaseTimes = (cmlCase: any, chrono: Chronology): CaseTimeRender[] => {
  const C = cmlCase?.CASE ?? cmlCase;
  const mech = C?.hidden_model?.mechanism;
  if (!mech || typeof mech !== "object") return [];
  const changes: CaseTimeRender[] = [];
  for (const field of ["apparent_time_of_death", "actual_time_of_death"] as const) {
    const raw = String(mech[field] ?? "").trim();
    if (!raw) continue;
    const dial = parseClockTime(raw);
    if (dial === null) continue;
    const locked = chrono.events.find((e) => e.source === "locked" && e.dial === mod(dial) && e.raw);
    if (!locked || !locked.raw || locked.raw === raw) continue;
    mech[field] = locked.raw;
    changes.push({
      path: `hidden_model.mechanism.${field}`,
      before: raw,
      after: locked.raw,
      reason: `same minute as locked fact ${locked.id}; one spelling, because the prose prints the locked value verbatim`,
    });
  }
  return changes;
};

// ── Rendering for the prompt and the log ──────────────────────────────────────────────────────────

const quoteTime = (event: ChronoEvent): string => `"${event.raw ?? renderClockWords(event.dial)}"`;

/**
 * The solved clock as prompt lines. Empty unless the solver produced something the locked-facts list
 * does not already say — a solved endpoint or an interval — so a registry with nothing to solve
 * leaves the prompt byte-identical.
 */
export const renderChronologyBlock = (chrono: Chronology): string => {
  const solved = chrono.events.filter((e) => e.source === "solved");
  const intervals = chrono.intervals.filter((i) => i.source === "locked");
  if (solved.length === 0 && intervals.length === 0) return "";

  const lines: string[] = [];
  lines.push(`- THE CLOCK, computed from the locked facts above. Every value here is settled; print each as written and build the case on it:`);
  for (const e of chrono.events) {
    if (e.source === "case") continue;
    lines.push(`    • ${quoteTime(e)} — ${e.source === "locked" ? `${e.id}: ${e.label}` : `${e.label} (${e.via})`}`);
  }
  for (const i of intervals) {
    const s = findEvent(chrono, i.start);
    const e = findEvent(chrono, i.end);
    if (!s || !e) continue;
    lines.push(`    • ${i.id} (${i.label}): ${s.raw ?? renderClockWords(s.dial)} to ${e.raw ?? renderClockWords(e.dial)} (${i.lengthRaw ?? `${i.minutes} minutes`}) — put this in \`constraint_space.time.windows\` with both endpoints as written`);
  }
  if (chrono.unplaced.length > 0) {
    lines.push(
      `  Durations the device fixes but does not place on the clock: ` +
        chrono.unplaced.map((u) => `${u.id} ("${u.raw}")`).join(", ") +
        `. If you place one, write it in \`constraint_space.time.windows\` as "<start> to <end> — <what happens> (<length>)" with the subtraction done; endpoints that disagree with the length are a defect.`,
    );
  }
  return `\n${lines.join("\n")}`;
};

export const summariseChronology = (
  chrono: Chronology,
  anchoring?: ClockAnchoring,
  findings?: ChronologyFinding[],
): string => {
  const count = (source: ChronoEvent["source"]) => chrono.events.filter((e) => e.source === source).length;
  const parts: string[] = [
    `events ${chrono.events.length} (locked ${count("locked")}, solved ${count("solved")}, case ${count("case")}); intervals ${chrono.intervals.length}`,
  ];
  if (chrono.unplaced.length) parts.push(`unplaced locked durations: ${chrono.unplaced.map((u) => `${u.id} (${u.reason})`).join("; ")}`);
  if (anchoring) {
    parts.push(
      anchoring.unanchored.length === 0
        ? `every one of ${anchoring.total} clock value(s) anchors to an event`
        : `${anchoring.unanchored.length} of ${anchoring.total} clock value(s) anchor to NO event: ` +
          anchoring.unanchored.slice(0, 6).map((u) => `${u.path} "${u.raw}"`).join(", ") +
          (anchoring.unanchored.length > 6 ? ", …" : ""),
    );
  }
  if (findings && findings.length) parts.push(`coherence: ${findings.map((f) => `${f.code} at ${f.path}`).join("; ")}`);
  return parts.join(" | ");
};
