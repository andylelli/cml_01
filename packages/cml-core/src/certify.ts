/**
 * The fair-play certifier (§4.5).
 *
 * Runs the three engines and produces a `FairPlayCertificate`. This is the new exit condition the
 * redesign installs in place of `validateCml`'s schema-only pass: generation is done not when the
 * keys are present, but when the timeline is consistent, the shown clues entail the culprit, and
 * they entail no one else. `ok` is that certificate.
 */

import type { FairPlayCertificate, TypedCml } from "./types.js";
import { checkTimeline } from "./engines/timeline.js";
import { checkDeducibility } from "./engines/deducibility.js";
import { checkUniqueness } from "./engines/uniqueness.js";

export const CHECKER_VERSION = "cml-core/0.1.0";

export function certify(cml: TypedCml): FairPlayCertificate {
  const timeline = checkTimeline(cml);
  const deduce = checkDeducibility(cml);
  const unique = checkUniqueness(cml);

  const failures: string[] = [];
  if (!timeline.consistent) failures.push(...timeline.violations.map((v) => `timeline: ${v}`));
  if (!deduce.sound || !deduce.reachesCulprit) {
    failures.push(...deduce.issues.map((i) => `deducibility: ${i}`));
  }
  if (!unique.unique && unique.diagnosis) failures.push(`uniqueness: ${unique.diagnosis}`);

  const deducible = deduce.sound && deduce.reachesCulprit;
  const ok =
    timeline.consistent &&
    deducible &&
    unique.unique &&
    unique.possibleSuspects.length === 1 &&
    unique.possibleSuspects[0] === cml.solution.culpritId;

  return {
    caseId: cml.caseId,
    checkerVersion: CHECKER_VERSION,
    timelineConsistent: timeline.consistent,
    deducible,
    unique: unique.unique,
    culpritId: cml.solution.culpritId,
    uniqueAmong: unique.possibleSuspects,
    ok,
    failures,
  };
}
