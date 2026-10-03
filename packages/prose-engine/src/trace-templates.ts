/**
 * A_110 IMPLEMENTATION PLAN 0.3 / WP-006 K6 / WP-007 §2.4 — ORDER RULES AS DECLARE TEMPLATES, THREE-VALUED.
 *
 * `contract-rules.ts` holds the "always" family: a property of each chapter alone. The rules A_110's acceptance needs
 * are about ORDER across chapters — introduced before first seen, the evidence before the test, nobody cleared after
 * the arrest, the victim alive before the body is found. Process mining catalogued exactly these shapes as Declare
 * templates over finite traces (Pesic & van der Aalst 2006; LTLf, De Giacomo & Vardi 2013), so a rule here is a
 * template name and two predicates over the chapter sequence, not a new function.
 *
 * Each rule answers HOLDS, VIOLATED or UNKNOWN (runtime-verification's LTL3; WP-006 K4). Unknown is returned when
 * the contract does not carry the field the rule reads — an introduction table with the opening flag off, a living
 * victim before P3 sets `victimAlive`. A check that cannot read its input must not report health (WP-006 §2.3).
 *
 * D1 and D2 are not here on purpose: the contract CONSTRUCTS their lines, so a contract-level check of them could only
 * restate the construction. They are measured on the manuscript (`probes/owner-needs-probe.mjs`).
 */
import type { BookContract, SceneContract } from "./types.js";

export type Verdict = "holds" | "violated" | "unknown";
export interface TraceVerdict {
  rule: string;
  verdict: Verdict;
  /** The chapters (or "book") where it fails; for unknown, what could not be read. */
  where: string[];
}

type Pred = (s: SceneContract) => boolean;
const ch = (s: SceneContract): string => `ch${s.chapter}`;
const ordered = (c: BookContract): SceneContract[] => [...c.scenes].sort((a, b) => a.chapter - b.chapter);

/** precedence(a, b): every chapter where b holds has a at or before it (¬b W a). */
export const precedence = (trace: SceneContract[], a: Pred, b: Pred): string[] => {
  const failures: string[] = [];
  let seenA = false;
  for (const s of trace) {
    if (a(s)) seenA = true;
    if (b(s) && !seenA) failures.push(ch(s));
  }
  return failures;
};

/** response(a, b): every chapter where a holds is followed, at it or later, by b (G(a → F b)). */
export const response = (trace: SceneContract[], a: Pred, b: Pred): string[] =>
  trace.filter((s, i) => a(s) && !trace.slice(i).some(b)).map(ch);

/** notSuccession(a, b): no chapter where b holds comes strictly after a chapter where a holds (G(a → X G ¬b)). */
export const notSuccession = (trace: SceneContract[], a: Pred, b: Pred): string[] => {
  const first = trace.findIndex(a);
  return first < 0 ? [] : trace.slice(first + 1).filter(b).map(ch);
};

/** existence(a): a holds in some chapter. */
export const existence = (trace: SceneContract[], a: Pred): string[] => (trace.some(a) ? [] : ["book"]);

interface TraceRule {
  name: string;
  /** Unknown, with the reason, when the contract does not carry what the rule reads. */
  unknown?: (c: BookContract) => string | null;
  check: (c: BookContract, trace: SceneContract[]) => string[];
}

const testChapterOf = (c: BookContract): number => c.roles.discriminatingTest ?? c.roles.reveal;
const isBody = (c: BookContract): Pred => (s) => s.present.includes(c.fairPlay.victim) && !s.wound && !s.victimAlive;

export const TRACE_RULES: ReadonlyArray<TraceRule> = [
  {
    // Fair play: what the test turns on is on the page before the test.
    name: "decisive-clue-before-test",
    unknown: (c) => (c.fairPlay.decisiveClueIds.length === 0 ? "no decisive clues listed" : null),
    check: (c, trace) =>
      c.fairPlay.decisiveClueIds.flatMap((id) => {
        const shown = (s: SceneContract) => s.mustSurface.some((m) => m.id === id);
        const atTest = (s: SceneContract) => s.chapter === testChapterOf(c);
        return precedence(trace, shown, atTest).map((where) => `${id} (${where})`);
      }),
  },
  {
    // A_96: clearances after the arrest. Once the culprit is named, nobody else is cleared.
    name: "no-clearance-after-reveal",
    check: (c, trace) => notSuccession(trace, (s) => s.chapter === c.roles.reveal, (s) => s.eliminationsAllowed.length > 0),
  },
  {
    // P1: each person is introduced no later than the first chapter they are on the page.
    name: "introduced-at-first-appearance",
    unknown: (c) => (c.scenes.some((s) => (s.opening?.introductions ?? []).length > 0) ? null : "the contract carries no introductions"),
    check: (c, trace) => {
      const introduced = new Set(trace.flatMap((s) => (s.opening?.introductions ?? []).map((i) => i.name)));
      return [...introduced].flatMap((name) =>
        precedence(trace, (s) => (s.opening?.introductions ?? []).some((i) => i.name === name), (s) => s.present.includes(name)).map((where) => `${name} (${where})`),
      );
    },
  },
  {
    // P3: the victim is on the page alive before the body is found, and never alive after it.
    name: "victim-alive-before-found",
    unknown: (c) => (c.scenes.some((s) => s.victimAlive) ? null : "no chapter marks the victim alive"),
    check: (c, trace) => [
      ...existence(trace, isBody(c)),
      ...precedence(trace, (s) => !!s.victimAlive, isBody(c)),
      ...notSuccession(trace, isBody(c), (s) => !!s.victimAlive),
    ],
  },
];

export const checkTraceRules = (contract: BookContract): TraceVerdict[] => {
  const trace = ordered(contract);
  return TRACE_RULES.map((rule) => {
    const why = rule.unknown?.(contract) ?? null;
    if (why) return { rule: rule.name, verdict: "unknown" as const, where: [why] };
    const where = rule.check(contract, trace);
    return { rule: rule.name, verdict: where.length ? ("violated" as const) : ("holds" as const), where };
  });
};
