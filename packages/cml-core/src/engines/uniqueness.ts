/**
 * Uniqueness engine (§4.3 engine 3) — the one that makes fair-play *provable*.
 *
 * Independently of the authored path, it asks for each suspect S: is there a consistent world,
 * satisfying every shown clue, in which S is the culprit? (Here: is S NOT eliminable from the
 * full clue set?) The survivors are the suspects the reader cannot rule out. The solution is
 * fair iff there is exactly one survivor and it is the named culprit.
 *
 * For a closed circle of 5–8 suspects this is an exhaustive, cheap decision — no sampling, no
 * "seems solvable" (§4.3). It is what catches §4.6's {Carrow, Vale}.
 */

import type { TypedCml, UniquenessResult } from "../types.js";
import { isEliminableFrom, suspectsOf } from "../util.js";

export function checkUniqueness(cml: TypedCml): UniquenessResult {
  const suspects = suspectsOf(cml);

  const possibleSuspects = suspects
    .filter((s) => !isEliminableFrom(cml.clues, s.id, cml.crime))
    .map((s) => s.id);

  const named = cml.solution.culpritId;
  const unique = possibleSuspects.length === 1 && possibleSuspects[0] === named;

  let diagnosis: string | undefined;
  if (possibleSuspects.length === 0) {
    diagnosis =
      `NO_POSSIBLE_CULPRIT: every suspect is eliminated by the clues — the crime cannot be pinned on anyone.`;
  } else if (!possibleSuspects.includes(named)) {
    diagnosis =
      `IMPOSSIBLE_CULPRIT: named culprit ${named} is eliminated by the clues; ` +
      `the only consistent culprit(s) would be {${possibleSuspects.join(", ")}}.`;
  } else if (possibleSuspects.length > 1) {
    const spares = possibleSuspects.filter((p) => p !== named);
    diagnosis =
      `SOLUTION_NOT_UNIQUE: {${possibleSuspects.join(", ")}} are all consistent with the shown clues. ` +
      `The reader cannot rule out ${spares.join(", ")}. Add a discriminating fact, or the case is unfair.`;
  }

  return { unique, possibleSuspects, named, diagnosis };
}
