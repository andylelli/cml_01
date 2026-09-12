/**
 * A_89 A1 — TEMPORAL CLOSURE: can the deception's interval contain the event it conceals?
 *
 * A mystery whose mechanism hides WHEN the death happened states two times — the time everyone
 * believes (`apparent_time_of_death`) and the true one (`actual_time_of_death`) — and one or more
 * durations: the silent interval, the window in which the culprit could move, the run-fast of a
 * tampered clock. Run 88651's reader did the arithmetic and marked `clues` 5/10 for it:
 *
 *   > "If the silence begins at 4:00 and lasts 7 minutes, the music should restart at 4:07, not 4:20.
 *   >  If the murder is at 4:20, it is outside the 4:00-4:07 intermission."
 *
 * The case stated the intermission start (four o'clock), its duration (seven minutes), a ten-minute
 * murder window, and a death at a quarter past four — after the silence it was supposed to hide
 * inside. Nothing checked it, because the temporal model is assembled by three agents that never
 * compare notes (Agent 3b writes durations into `lockedFacts`, Agent 3 writes the two times into
 * `hidden_model.mechanism`, Agent 5 writes the clue describing them) and every existing time check is
 * a STRING check — locked-fact/clue transposition, AM/PM specificity, `parseClockTime` vocabulary.
 *
 * THIS IS TELEMETRY, NOT A GATE, AND ITS FIRST DESIGN WAS WRONG.
 *
 * The first cut asserted that the apparent/actual GAP must fit inside the longest interval the case
 * states, and MEASURED 46 of 49 cases (94%) "failing". That is a wrong invariant, not a broken
 * corpus: a tampered clock's OFFSET (how far the timeline is shifted) and the DURATION of a pause are
 * different quantities, and nothing requires one to cover the other. Run 88651 is the case where they
 * coincide, because its mechanism is "move during the silence". A check that cries wolf on 94% of
 * runs is B1's off-switch-with-extra-steps in its most expensive form.
 *
 * So a verdict is returned ONLY where the case NAMES an opportunity window — a locked fact whose id
 * or description says murder/death/opportunity AND window/interval. In the archive that is **2 of 22**
 * cases, and both violate it. Everywhere else the answer is `not-determinable`, and that is the
 * finding rather than a gap in this module: **there is no canonical field for the window in which the
 * culprit could act**, so the one arithmetic fact a fair-play mystery rests on cannot be validated.
 * Giving the case that field is A_89 A2, and this module is what makes its absence countable.
 *
 * Parsers are the PROJECT'S. `timeline-deception.ts` already owns `parseClockTime` (which folds curly
 * apostrophes, after a manuscript was once accused of inventing the hour its own case declared) and
 * `parseDurationMinutes` (which refuses "past/to/o'clock" as a position rather than an offset). A
 * second body of either is this project's documented failure mode — A_73 §11.3, and A_88 found the
 * clearance vocabulary forked exactly that way beneath a comment claiming it was single-sourced. If
 * those parsers are too narrow, the fix belongs in them.
 */

import { parseClockTime, parseDurationMinutes } from "./timeline-deception.js";

export type TemporalClosureVerdict = "closes" | "does-not-close" | "not-determinable";

export interface StatedInterval {
  /** Where it came from, for the telemetry line. */
  source: string;
  minutes: number;
}

export interface TemporalClosureResult {
  /** Both times present and parseable — otherwise nothing here is checkable. */
  checkable: boolean;
  apparentMinutes: number | null;
  actualMinutes: number | null;
  /** The gap the deception must explain, in minutes, on a 12-hour dial. */
  gapMinutes: number | null;
  /** Every duration the case states, with where each came from. */
  intervals: StatedInterval[];
  /** The longest stated interval, or null when the case states none. */
  longestMinutes: number | null;
  /** The window the case explicitly names as the culprit's opportunity, when it names one. */
  opportunityWindow: StatedInterval | null;
  /**
   * `closes` / `does-not-close` ONLY when the case names an opportunity window. Anything else is
   * `not-determinable` — the case did not say, and guessing which stated duration is the window is
   * how the first cut of this module reached a 94% false-positive rate.
   */
  verdict: TemporalClosureVerdict;
  /** One human sentence, or "" when there is nothing to say. */
  summary: string;
}

const collectIntervals = (cmlCase: any, lockedFacts: any[]): StatedInterval[] => {
  const out: StatedInterval[] = [];
  const seen = new Set<string>();
  const add = (source: string, raw: unknown) => {
    const minutes = parseDurationMinutes(raw);
    if (minutes == null || minutes <= 0) return;
    const key = `${source}:${minutes}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ source, minutes });
  };
  for (const fact of Array.isArray(lockedFacts) ? lockedFacts : []) {
    add(String((fact as any)?.id ?? "fact"), (fact as any)?.value);
  }
  const time = (cmlCase as any)?.constraint_space?.time ?? {};
  for (const w of Array.isArray(time.windows) ? time.windows : []) add("constraint_space.window", w);
  for (const a of Array.isArray(time.anchors) ? time.anchors : []) add("constraint_space.anchor", a);
  return out;
};

/**
 * The culprit's window of opportunity, when the case says what it is.
 *
 * A_89 A2 added `constraint_space.time.opportunity_window` so Agent 3 can DECLARE it, because the
 * archive shows it is otherwise absent in 46 of 49 cases. The declared field wins; a locked fact that
 * names one is the fallback, and that is how the three archived cases that can be checked today say
 * it.
 */
const findDeclaredWindow = (cmlCase: any): StatedInterval | null => {
  const declared = (cmlCase as any)?.constraint_space?.time?.opportunity_window;
  if (declared == null) return null;
  const minutes = parseDurationMinutes(typeof declared === "object" ? (declared as any)?.value : declared);
  if (minutes == null || minutes <= 0) return null;
  return { source: "constraint_space.time.opportunity_window", minutes };
};

/** A locked fact that explicitly names the culprit's window of opportunity. */
const findOpportunityWindow = (lockedFacts: any[]): StatedInterval | null => {
  for (const fact of Array.isArray(lockedFacts) ? lockedFacts : []) {
    const id = String((fact as any)?.id ?? "");
    const description = String((fact as any)?.description ?? "");
    const text = `${id} ${description}`.toLowerCase();
    if (!/(window|interval|opportunity)/.test(text)) continue;
    if (!/(murder|death|kill|crime|opportunity)/.test(text)) continue;
    const minutes = parseDurationMinutes((fact as any)?.value);
    if (minutes != null && minutes > 0) return { source: id || "opportunity_window", minutes };
  }
  return null;
};

const formatClock = (m: number): string =>
  `${Math.floor(m / 60) % 12 || 12}:${String(m % 60).padStart(2, "0")}`;

/**
 * Compute closure for one case. Pure, total, and never throws: a case that states no times is
 * `checkable: false`, which is a different thing from a case that fails.
 */
export const checkTemporalClosure = (cmlCase: any, lockedFacts: any[] = []): TemporalClosureResult => {
  const block = (cmlCase as any)?.CASE ?? cmlCase;
  const mechanism = block?.hidden_model?.mechanism ?? {};
  const apparentMinutes = parseClockTime(String(mechanism.apparent_time_of_death ?? ""));
  const actualMinutes = parseClockTime(String(mechanism.actual_time_of_death ?? ""));
  const intervals = collectIntervals(block, lockedFacts);
  const longestMinutes = intervals.length ? Math.max(...intervals.map((i) => i.minutes)) : null;
  const opportunityWindow = findDeclaredWindow(block) ?? findOpportunityWindow(lockedFacts);

  if (apparentMinutes == null || actualMinutes == null) {
    return {
      checkable: false, apparentMinutes, actualMinutes, gapMinutes: null, intervals,
      longestMinutes, opportunityWindow, verdict: "not-determinable", summary: "",
    };
  }

  // A 12-hour dial: the shorter way round is the interval the deception has to cover.
  const raw = Math.abs(actualMinutes - apparentMinutes);
  const gapMinutes = Math.min(raw, 720 - raw);
  const times =
    `apparent ${formatClock(apparentMinutes)} vs actual ${formatClock(actualMinutes)} — a ${gapMinutes}-minute gap`;
  const listed = intervals.length
    ? intervals.map((i) => `${i.source}=${i.minutes}m`).slice(0, 4).join(", ")
    : "none";

  if (!opportunityWindow) {
    return {
      checkable: true, apparentMinutes, actualMinutes, gapMinutes, intervals, longestMinutes,
      opportunityWindow, verdict: "not-determinable",
      summary: `${times}; the case names NO opportunity window, so the arithmetic cannot be checked. ` +
        `Stated intervals: ${listed}.`,
    };
  }

  const verdict: TemporalClosureVerdict =
    gapMinutes <= opportunityWindow.minutes ? "closes" : "does-not-close";
  const summary = verdict === "closes"
    ? `${times}, inside the stated opportunity window "${opportunityWindow.source}" of ` +
      `${opportunityWindow.minutes} minutes.`
    : `${times}, but the stated opportunity window "${opportunityWindow.source}" is only ` +
      `${opportunityWindow.minutes} minutes. The concealed interval cannot contain the event it ` +
      `conceals, and a reader who does the arithmetic will say so. Stated intervals: ${listed}.`;

  return {
    checkable: true, apparentMinutes, actualMinutes, gapMinutes, intervals, longestMinutes,
    opportunityWindow, verdict, summary,
  };
};

/** Is the closure telemetry switched on? Env read at call time (ADR-0004). */
export const isTemporalClosureCheckEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3_TEMPORAL_CLOSURE ?? "").trim());
