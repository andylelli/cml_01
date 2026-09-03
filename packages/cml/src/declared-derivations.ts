/**
 * PHASE 1 — check what the device SAYS it derived, using the temporal spine.
 *
 * THE GAP THIS FILLS, measured on run mystery-1788457673117 (external read 76/100, whose reviewer's
 * first complaint was *"that arithmetic is wrong"*). Four independent checks were blind to the same
 * three locked facts, and the fourth is the one this file answers:
 *
 *   1. `parseClockTime("a quarter to six on the evening prior")` returns 345 — 5:45 AM, silently
 *      dropping 12 hours and a day.
 *   2. `isAtomicLockedFactValue` is false for the same string, so the ship-checks skip it.
 *   3. `reconcileDeviceArithmetic` (X38) knows only `duration = |A − B|`; the case declared
 *      `instant = instant + duration` and it hit `continue` without a word.
 *   4. **`checkCaseTimeCoherence` fires only when there are EXACTLY two clock facts and EXACTLY one
 *      duration.** This case has two clocks and TWO durations, so it never ran at all.
 *
 * (4) is why this check is driven by DECLARATIONS rather than by counting facts. A case that declares
 * `derivedFrom` has told us the pairing, so no counting heuristic is needed and no extra duration can
 * switch the check off. On the archive that matters: 25 of 44 runs declare at least one derivation,
 * and 11 of those 25 (44%) carry one that does not close.
 *
 * IT DIAGNOSES; IT DOES NOT REWRITE. `reconcileDeviceArithmetic`'s own comment has the reason and it
 * is right: the pass "will not guess which of three numbers is wrong". In the 76/100 case the
 * declaration itself is miswired — repairing the derived INSTANT would move the call sheet's creation
 * to the previous evening and destroy the case, when the value actually wrong is the delay. So the
 * output is a violation that feeds the design-tier regeneration (`AGENT3B_ARITHMETIC_REGEN`), where
 * the model re-authors a coherent set for about a cent, instead of £1 of prose rendering numbers that
 * cannot work.
 */

import type { CaseTimeCoherenceViolation } from "./timeline-deception.js";
import { buildTemporalSpine, type SpineFactInput } from "./temporal-spine.js";

const minutesToWords = (minutes: number): string => {
  const sign = minutes < 0 ? "-" : "";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${sign}${m} minute(s)`;
  if (m === 0) return `${sign}${h} hour(s)`;
  return `${sign}${h}h ${m}m`;
};

/**
 * Every declared derivation that does not close, in the shape the design-tier regeneration consumes.
 *
 * Each status is reported differently on purpose, because they ask the author for different things:
 *   • `fails`          — the numbers are simply wrong; say by how much.
 *   • `underspecified` — the case does not state a daypart, so the arithmetic CANNOT be checked. This
 *                        is a real defect and a silent one: today the pipeline picks a meridiem by
 *                        accident and reports a confident answer.
 *   • `unreadable`     — the declaration names something that is not a time, or a shape with no
 *                        computable meaning. X38 answered this with `continue`; silence is what let
 *                        the defect ship.
 */
export const checkDeclaredDerivations = (
  lockedFacts?: ReadonlyArray<SpineFactInput>,
): CaseTimeCoherenceViolation[] => {
  const facts = lockedFacts ?? [];
  if (facts.length === 0) return [];

  const spine = buildTemporalSpine(facts);
  const violations: CaseTimeCoherenceViolation[] = [];

  for (const finding of spine.findings) {
    if (finding.status === "closes") continue;

    if (finding.status === "fails") {
      violations.push({
        code: "declared_derivation_broken",
        message:
          `The case declares "${finding.id}" to be derived from two other locked facts, and the ` +
          `arithmetic does not close: ${finding.detail}. A reader meets every one of these values in ` +
          `the prose verbatim, so the sum they are asked to do will not come out. Repair the CASE — ` +
          `change whichever single value is wrong, and keep the other two.`,
      });
      continue;
    }

    if (finding.status === "underspecified") {
      violations.push({
        code: "declared_derivation_broken",
        message:
          `"${finding.id}" is declared derived, but the case never says which half of the day its ` +
          `times fall in, so the arithmetic cannot be checked at all: ${finding.detail}. ` +
          `"twenty minutes past three" is 03:20 or 15:20 and nothing in the case chooses. State the ` +
          `daypart on each clock value ("in the evening", "in the morning") so the interval is ` +
          `determined rather than assumed.`,
      });
      continue;
    }

    violations.push({
      code: "declared_derivation_broken",
      message:
        `"${finding.id}" declares a derivation this case cannot compute: ${finding.detail}. Either the ` +
        `declaration names the wrong facts, or one of them is not a time or a duration. A declared ` +
        `dependency that cannot be evaluated is worse than none, because every downstream check ` +
        `treats it as satisfied.`,
    });
  }

  // A time-shaped value the strict reader could not resolve is reported once, as a group: it is the
  // input to every temporal check in the pipeline, so an unreadable one blinds all of them at once.
  if (spine.unreadable.length > 0) {
    violations.push({
      code: "declared_derivation_broken",
      message:
        `${spine.unreadable.length} locked fact(s) look like times but cannot be read as one: ` +
        `${spine.unreadable.join("; ")}. Every temporal check in the pipeline reads these values, so ` +
        `an unreadable one is not a small problem — it silently exempts the case from all of them.`,
    });
  }

  return violations;
};

/** Exposed for telemetry: what the spine made of the registry, without forming a judgement. */
export const summariseSpine = (lockedFacts?: ReadonlyArray<SpineFactInput>): string => {
  const spine = buildTemporalSpine(lockedFacts ?? []);
  const instants = spine.instants
    .map((i) => `${i.id}=${minutesToWords(i.absolute)}(${i.meridiem}${i.dayOffset ? `,day${i.dayOffset}` : ""})`)
    .join(" ");
  const durations = spine.durations.map((d) => `${d.id}=${minutesToWords(d.minutes)}`).join(" ");
  const outcomes = spine.findings.map((f) => `${f.id}:${f.status}`).join(" ");
  return `instants[${instants}] durations[${durations}] derivations[${outcomes || "none declared"}]`;
};
