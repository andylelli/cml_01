/**
 * Deducibility engine (§4.3 engine 2).
 *
 * Walks the authored inference path in order and decides two things:
 *   - SOUND: every elimination edge is actually justified by its premises, and no clue is used
 *     before the reader is shown it (`availableByStep`).
 *   - REACHES CULPRIT: the eliminations single out exactly the named culprit.
 *
 * This is the engine that catches §4.6's unsound Step 3 ("boarded ≠ departed") and the §3
 * `fallbackCulprit` failure (the path convicts A but `culprits=[B]`).
 */

import type { DeducibilityResult, Observation, TypedCml } from "../types.js";
import { isEliminableFrom, suspectsOf } from "../util.js";

export function checkDeducibility(cml: TypedCml): DeducibilityResult {
  const issues: string[] = [];
  const clueById = new Map(cml.clues.map((c) => [c.id, c]));
  const eliminated = new Set<string>();

  cml.inferencePath.forEach((edge, idx) => {
    const stepNo = idx + 1;

    const premiseObs: Observation[] = [];
    for (const pid of edge.from) {
      const obs = clueById.get(pid);
      if (!obs) {
        issues.push(`Step ${stepNo} (${edge.id}): premise "${pid}" is not in the shown clue set.`);
        continue;
      }
      if (obs.availableByStep > stepNo) {
        issues.push(
          `Step ${stepNo} (${edge.id}): clue "${pid}" is used before the reader has it ` +
            `(available by step ${obs.availableByStep}).`,
        );
      }
      premiseObs.push(obs);
    }

    if (edge.rule === "time_correction") {
      return; // establishes the window for the reader; the true window lives in crime.window
    }

    // An elimination (temporal access_impossible/alibi_contradiction, OR unique_capability) is
    // justified iff its premises alone make the suspect eliminable.
    const justified = isEliminableFrom(premiseObs, edge.eliminates, cml.crime);
    if (!justified) {
      issues.push(
        `Step ${stepNo} (${edge.id}): elimination of ${edge.eliminates} is UNSOUND — the premises ` +
          `do not place them away from the crime scene for the whole window ` +
          `(e.g. "boarded at 08:12" does not entail "absent from the study during the window").`,
      );
    }
    eliminated.add(edge.eliminates);
  });

  // soundness is the step-level verdict; the culprit-reach check is separate
  const sound = issues.length === 0;

  const suspects = suspectsOf(cml);
  const survivors = suspects.filter((s) => !eliminated.has(s.id)).map((s) => s.id);
  const reachesCulprit = survivors.length === 1 && survivors[0] === cml.solution.culpritId;
  if (!reachesCulprit) {
    issues.push(
      `Inference path survivors {${survivors.join(", ")}} ≠ {${cml.solution.culpritId}} — ` +
        `the path does not single out the named culprit.`,
    );
  }

  return { sound, reachesCulprit, issues };
}
