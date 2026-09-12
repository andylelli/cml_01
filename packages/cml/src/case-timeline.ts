/**
 * A_89 A2 — ONE DERIVED TIMELINE, so the case's numbers exist once.
 *
 * A_89 A1 built the arithmetic check and then measured why it almost never fires: of 49 archived
 * cases that state both times, **46 name no opportunity window at all**, so the one fact a fair-play
 * mystery rests on — how long the culprit had — cannot be validated. Three agents write pieces of the
 * temporal model into three different free-text fields (Agent 3b's `lockedFacts` durations, Agent 3's
 * `hidden_model.mechanism` times, Agent 5's clue prose) and no numeric object ties them together.
 * Run 88651 shipped an intermission that starts at four o'clock and runs seven minutes, a ten-minute
 * murder window, and a death at a quarter past four; its reader did the arithmetic by hand and marked
 * `clues` 5/10.
 *
 * This module derives that object. It is a READER of what the case already says, not a second author:
 * every number it reports carries `stated` or `absent`, so a consumer can tell a fact from a gap.
 *
 * DELIBERATELY NOT CIRCULAR. When the case names no opportunity window, this does NOT invent one from
 * the gap — that would make A1's check `gap <= window` tautologically true and convert a missing fact
 * into a passing one. The window stays `absent`, A1 stays `not-determinable`, and the absence is
 * reported. The way to fix a missing number is to ask the agent that owns it for the number, which is
 * what `AGENT3_OPPORTUNITY_WINDOW` does to Agent 3's own prompt.
 *
 * Parsers are the project's own `parseClockTime` / `parseDurationMinutes` (see `temporal-closure.ts`
 * for why a second body of either is this repo's documented failure mode).
 */

import { checkTemporalClosure, type StatedInterval, type TemporalClosureVerdict } from "./temporal-closure.js";

export type Provenance = "stated" | "absent";

export interface CaseTimeline {
  /** True when both times parse — otherwise every field below is `absent`. */
  resolved: boolean;
  apparent: { minutes: number | null; provenance: Provenance };
  actual: { minutes: number | null; provenance: Provenance };
  /** What the deception must explain, in minutes on a 12-hour dial. */
  gapMinutes: number | null;
  /** How long the culprit had, WHEN THE CASE SAYS SO. Never inferred from the gap. */
  opportunityWindow: { minutes: number | null; source: string | null; provenance: Provenance };
  /** Every duration the case states, with where each came from. */
  intervals: StatedInterval[];
  /** A1's verdict, carried here so consumers read one object rather than two. */
  verdict: TemporalClosureVerdict;
  /** What is missing, in plain words, for the run report and for a prompt to ask about. */
  gaps: string[];
  summary: string;
}

/** Derive the canonical timeline for one case. Pure, total, never throws. */
export const deriveCaseTimeline = (cmlCase: any, lockedFacts: any[] = []): CaseTimeline => {
  const closure = checkTemporalClosure(cmlCase, lockedFacts);
  const gaps: string[] = [];

  if (!closure.checkable) {
    if (closure.apparentMinutes == null) gaps.push("apparent_time_of_death is missing or unparseable");
    if (closure.actualMinutes == null) gaps.push("actual_time_of_death is missing or unparseable");
  }
  if (!closure.opportunityWindow) {
    gaps.push(
      "no opportunity window: the case never says how long the culprit had, so the arithmetic a " +
      "fair-play reader will do cannot be checked",
    );
  }
  if (closure.checkable && closure.intervals.length === 0) {
    gaps.push("the case states no interval of any kind");
  }

  return {
    resolved: closure.checkable,
    apparent: {
      minutes: closure.apparentMinutes,
      provenance: closure.apparentMinutes == null ? "absent" : "stated",
    },
    actual: {
      minutes: closure.actualMinutes,
      provenance: closure.actualMinutes == null ? "absent" : "stated",
    },
    gapMinutes: closure.gapMinutes,
    opportunityWindow: closure.opportunityWindow
      ? { minutes: closure.opportunityWindow.minutes, source: closure.opportunityWindow.source, provenance: "stated" }
      : { minutes: null, source: null, provenance: "absent" },
    intervals: closure.intervals,
    verdict: closure.verdict,
    gaps,
    summary: closure.summary,
  };
};

/** One line for the run report; "" when the case carries no times at all. */
export const summariseCaseTimeline = (timeline: CaseTimeline): string => {
  if (!timeline.resolved && timeline.gaps.length === 0) return "";
  const head = timeline.resolved
    ? `gap ${timeline.gapMinutes}m; window ${
        timeline.opportunityWindow.provenance === "stated"
          ? `${timeline.opportunityWindow.minutes}m (${timeline.opportunityWindow.source})`
          : "ABSENT"
      }; ${timeline.intervals.length} stated interval(s); verdict ${timeline.verdict}`
    : `times unresolved; verdict ${timeline.verdict}`;
  return timeline.gaps.length > 0 ? `${head}. Missing: ${timeline.gaps.join("; ")}.` : `${head}.`;
};

/** Is the derived timeline switched on? Env read at call time (ADR-0004). */
export const isCaseTimelineEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3_CASE_TIMELINE ?? "").trim());
