/**
 * ANALYSIS_109 M1 — THE CASE'S TIMES AS ONE NETWORK.
 *
 * What already exists, and is NOT repeated here: `timeline-deception.ts` checks the CULPRIT's alibi
 * against the staged and real times; `temporal-closure.ts` checks a named opportunity window against
 * the device. Each is one invariant. This puts every time statement the case makes into one Simple
 * Temporal Network, and asks three questions no existing module asks:
 *
 *   1. Can all the TRUE statements hold at once? If not, which ones clash (the negative cycle).
 *   2. What is the act's window, derived from everything — last seen alive, the murder window, the
 *      actual time, the discovery — rather than read from one field?
 *   3. Does each innocent's alibi COVER that window? An alibi that ends before the act begins clears
 *      nobody. MEASURED on the golden cases before this was built: most innocents' alibis in 4 of 4
 *      do not cover the stated murder window; run 98dec72a cleared Margot with 9:00–10:00 for a murder
 *      at 10:10–10:45, and its reader called the timeline muddled.
 *
 * Classification of each statement is a RULE over its wording (INFERRED); statements it cannot place
 * are counted, never guessed. Claims — testimony, a stopped clock, a chime — are the FALSE timeline's
 * material and stay out of the true network; a conflict they would cause is the mystery, not a fault.
 *
 * ASSUMED: the case happens within one twelve-hour stretch. Dial values (0..719, `chronology.ts`) are
 * unwrapped onto a line by cutting the dial at its widest empty gap — the smallest arc that holds
 * every time the case states. Temporal-spine's day boundaries are out of scope here.
 */
import type { Chronology } from "../chronology.js";
import type { CaseModel } from "./model.js";
import { solveStn } from "./stn.js";
import type { StnConstraint } from "./stn.js";

export type StatementRole = "act-window" | "act-time" | "alive-at" | "discovery" | "claim" | "context";

export interface ClassifiedStatement {
  id: string;
  label: string;
  role: StatementRole;
}

export type Coverage = "covers" | "partial" | "none" | "unknown";

export interface AlibiCoverage {
  name: string;
  /** The alibi on the unwrapped line, when it parsed. */
  alibi: [number, number] | null;
  coverage: Coverage;
}

export interface TimelineAnalysis {
  consistent: boolean;
  /** The TRUE statements that cannot all hold, when inconsistent. */
  conflict: string[];
  /** The act's tightest window on the dial (0..719), when anything bounds it on both sides. */
  act: { from: number; to: number } | null;
  /** Which kinds of statement bounded the act. */
  actFrom: StatementRole[];
  /** Every suspect who is neither culprit nor the false solution's accused. */
  innocents: AlibiCoverage[];
  /** The culprit's and the accused's, for the report; their alibis are MEANT to be contested. */
  contested: AlibiCoverage[];
  statements: ClassifiedStatement[];
}

const ALIBI_WORDS = /\balibi|\bclaims?\b|\bclaimed\b/i;
// "clock" never inside "o'clock": a scheduled six o'clock dinner is context, a clock reading is a claim.
const CLAIM_WORDS = /\b(?:indicat|stopped|chime|chimed|shows?|reads?|(?<!o')clock|watch|sundial|hourglass|testif|testimony|witness|sighting|reported|heard|according|appear|seem|rel(?:y|ies) on)/i;
const ACT_WORDS = /\b(?:murder|killing|killed|kill|death|died|attack|struck|stabbed|strangl|poison|shot|act)\b/i;

/** RULES, in order, for one statement's role. */
export const classifyStatement = (id: string, label: string): StatementRole => {
  if (id === "actual_time_of_death") return "act-time";
  if (id === "apparent_time_of_death") return "claim";
  const l = label.toLowerCase();
  if (/\b(?:discover|body (?:was )?found|found (?:dead|the body|her|him))/.test(l)) return "discovery";
  if (/\b(?:last (?:saw|seen|heard)|seen alive|alive at|was alive)/.test(l)) return CLAIM_WORDS.test(l) && !/\blast (?:saw|seen)/.test(l) ? "claim" : "alive-at";
  if (CLAIM_WORDS.test(l)) return "claim";
  if (ALIBI_WORDS.test(l)) return "context";
  if (ACT_WORDS.test(l)) return id.startsWith("window_") ? "act-window" : "act-time";
  return "context";
};

/** Cut the dial at its widest empty gap; map each dial value to minutes along that arc. */
const unwrapper = (dials: number[]): ((dial: number) => number) => {
  const sorted = [...new Set(dials.map((d) => ((d % 720) + 720) % 720))].sort((a, b) => a - b);
  if (sorted.length === 0) return (d) => d;
  let base = sorted[0]!;
  let widest = sorted[0]! + 720 - sorted[sorted.length - 1]!;
  for (let i = 1; i < sorted.length; i += 1) {
    const gap = sorted[i]! - sorted[i - 1]!;
    if (gap > widest) {
      widest = gap;
      base = sorted[i]!;
    }
  }
  return (d) => ((((d % 720) + 720) % 720) - base + 720) % 720;
};

const clock = (dial: number): string => {
  const h = Math.floor((((dial % 720) + 720) % 720) / 60);
  const m = (((dial % 720) + 720) % 720) % 60;
  return `${h === 0 ? 12 : h}:${String(m).padStart(2, "0")}`;
};

export const analyseTimeline = (model: CaseModel): TimelineAnalysis => {
  const chrono: Chronology = model.chronology;
  const eventDial = new Map(chrono.events.map((e) => [e.id, e.dial] as const));
  const lin = unwrapper(chrono.events.map((e) => e.dial));

  const statements: ClassifiedStatement[] = [];
  const constraints: StnConstraint[] = [{ from: "act_start", to: "act_end", min: 0, label: "the act starts before it ends" }];
  const actFrom = new Set<StatementRole>();
  const inAlibiInterval = new Set<string>();

  // Windows: an act window bounds both ends of the act.
  for (const interval of chrono.intervals) {
    if (interval.id.startsWith("alibi:")) {
      inAlibiInterval.add(interval.start).add(interval.end);
      continue;
    }
    const role = classifyStatement(interval.id, interval.label);
    statements.push({ id: interval.id, label: interval.label, role });
    if (role !== "act-window") continue;
    const from = lin(eventDial.get(interval.start) ?? 0);
    let to = lin(eventDial.get(interval.end) ?? 0);
    if (to < from) to += 720;
    constraints.push({ from: "Z", to: "act_start", min: from, label: interval.label });
    constraints.push({ from: "Z", to: "act_end", max: to, label: interval.label });
    actFrom.add(role);
  }

  // Point events that are not the ends of a window already classified above.
  const windowEnds = new Set(chrono.intervals.flatMap((i) => [i.start, i.end]));
  for (const event of chrono.events) {
    if (windowEnds.has(event.id) || inAlibiInterval.has(event.id)) continue;
    if (event.source !== "case") continue;
    const role = classifyStatement(event.id, event.label);
    statements.push({ id: event.id, label: event.label, role });
    const t = lin(event.dial);
    if (role === "act-time") {
      constraints.push({ from: "Z", to: "act_start", max: t, label: event.label });
      constraints.push({ from: "Z", to: "act_end", min: t, label: event.label });
    } else if (role === "alive-at") {
      constraints.push({ from: "Z", to: "act_start", min: t, label: event.label });
    } else if (role === "discovery") {
      constraints.push({ from: "Z", to: "act_end", max: t, label: event.label });
    } else continue;
    actFrom.add(role);
  }

  const stn = solveStn("Z", constraints);
  let act: TimelineAnalysis["act"] = null;
  if (stn.consistent) {
    const start = stn.bounds("act_start");
    const end = stn.bounds("act_end");
    // The act is determinable only when something bounds it on BOTH sides.
    if (start && end && Number.isFinite(start[0]) && Number.isFinite(end[1])) {
      act = { from: start[0], to: end[1] };
    }
  }

  const alibiOf = (name: string): [number, number] | null => {
    const interval = chrono.intervals.find((i) => i.id === `alibi:${name}`);
    if (!interval) return null;
    const from = lin(eventDial.get(interval.start) ?? 0);
    let to = lin(eventDial.get(interval.end) ?? 0);
    if (to < from) to += 720;
    return [from, to];
  };
  const coverage = (name: string): AlibiCoverage => {
    const alibi = alibiOf(name);
    if (!alibi || !act) return { name, alibi, coverage: "unknown" };
    if (alibi[0] <= act.from && alibi[1] >= act.to) return { name, alibi, coverage: "covers" };
    if (alibi[1] > act.from && alibi[0] < act.to) return { name, alibi, coverage: "partial" };
    return { name, alibi, coverage: "none" };
  };
  const contestedNames = new Set([...model.culprits, ...(model.falseAccused ? [model.falseAccused] : [])]);

  return {
    consistent: stn.consistent,
    conflict: stn.conflict,
    act: act ? { from: act.from, to: act.to } : null,
    actFrom: [...actFrom],
    innocents: model.suspects.filter((s) => !contestedNames.has(s.name)).map((s) => coverage(s.name)),
    contested: model.suspects.filter((s) => contestedNames.has(s.name)).map((s) => coverage(s.name)),
    statements,
  };
};

/** The act window and an alibi, in clock words for a report line. Unwrapped minutes back to a dial. */
export const summariseTimeline = (analysis: TimelineAnalysis, model: CaseModel): string => {
  const chrono = model.chronology;
  const lin = unwrapper(chrono.events.map((e) => e.dial));
  // Recover the base: the dial that maps to 0.
  const base = chrono.events.map((e) => e.dial).find((d) => lin(d) === 0) ?? 0;
  const at = (m: number): string => clock(base + m);
  const parts: string[] = [];
  if (!analysis.consistent) {
    parts.push(`timeline INCONSISTENT — these cannot all hold: ${analysis.conflict.map((c) => `"${c}"`).join(" · ")}`);
  } else if (!analysis.act) {
    parts.push("timeline consistent · the act has no window on both sides (not determinable)");
  } else {
    parts.push(`timeline consistent · act ${at(analysis.act.from)}–${at(analysis.act.to)} (from ${analysis.actFrom.join(", ")})`);
    const known = analysis.innocents.filter((i) => i.coverage !== "unknown");
    const covering = known.filter((i) => i.coverage === "covers").length;
    const short = (n: string): string => n.split(" ").slice(-1)[0] ?? n;
    parts.push(
      `innocents' alibis covering the act: ${covering} of ${known.length}` +
        (known.length > covering
          ? ` (${known.filter((i) => i.coverage !== "covers").map((i) => `${short(i.name)} ${i.coverage}`).join(", ")})`
          : ""),
    );
  }
  const unplaced = analysis.statements.filter((s) => s.role === "context").length;
  parts.push(`${analysis.statements.length} statements, ${unplaced} context-only`);
  return parts.join(" · ");
};
