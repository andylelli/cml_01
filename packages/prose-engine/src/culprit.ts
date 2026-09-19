/**
 * PROSE ENGINE v2 — "IS THIS TEXT NAMING X AS THE MURDERER?", ONCE.
 *
 * ── WHY THIS IS A MODULE ────────────────────────────────────────────────────────────────────────
 *
 * `gate.ts` said *"the same predicate the selector uses, so the gate and the selector cannot
 * disagree (L6)"* and it was not true: there were TWO copies, and they had already drifted apart in
 * both directions.
 *
 * - `gate.ts` was widened on 2026-09-19 to recognise *"Nora Quayle engineered the murder"*, a
 *   sentence that had cost a run. `selector.ts` was not, so the reveal gate and the early-naming
 *   gate disagreed about what counts as an accusation.
 * - `selector.ts` carried a clause `gate.ts` never had: a bare `\bI (killed|murdered|…)\b` with NO
 *   name in it. In the early-naming direction that fires on any first-person admission by anyone —
 *   a red herring's false confession, a witness quoting the victim — and it fires for EVERY culprit
 *   at once, because nothing in it refers to the person being tested.
 *
 * That is WF-002's divergence rule meeting the one place it actually bites: this predicate is the
 * sole input to a WRITE — a gate that stops a run and a finding that spends an editor call.
 *
 * ── IT RUNS IN BOTH DIRECTIONS, WHICH IS WHY IT IS NARROW ───────────────────────────────────────
 *
 * The reveal chapter MUST satisfy it; every earlier chapter must NOT. So it has to separate an
 * accusation from a suspicion, and every clause below is a construction that cannot be said about
 * someone merely being watched. A closed list of verbs is not enough — see
 * `closed-vocabulary-deciding-a-pass` — so the families are agent-plus-guilt-noun, the deed
 * attributed to a name, and a confession, rather than one more synonym for "killed".
 *
 * The bare first-person clause is NOT reinstated. It names nobody, so it cannot answer the question
 * this function is asked; a reveal carried entirely by an unattributed *"I killed him"* genuinely
 * does not name its culprit, and the gate saying so is right.
 */

const escape = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const namesAsCulprit = (text: string, culprit: string): boolean => {
  if (!culprit) return false;
  const surname = culprit.split(/\s+/).slice(-1)[0] ?? culprit;
  const name = `(?:${escape(culprit)}|${escape(surname)})`;

  /** Doing the deed, named directly. */
  const didIt =
    `${name}[^.!?]{0,80}\\b(?:killed|murdered|poisoned|strangled|struck|is the (?:killer|murderer|culprit)|did it)\\b`;
  /** "the murderer was X" — the deed first, the name second. */
  const wasThem = `\\b(?:killer|murderer|culprit) (?:is|was)[^.!?]{0,20}${name}`;
  /**
   * Agent + guilt NOUN: "X engineered the murder", "X carried out the killing". Every verb here is
   * one of authorship, so none of them can be said of a suspect the detective is merely watching.
   */
  const authored =
    `${name}[^.!?]{0,80}\\b(?:engineered|committed|carried out|planned|plotted|staged|arranged|` +
    `contrived|orchestrated|devised|executed)\\b[^.!?]{0,20}\\b(?:murder|killing|crime|death)\\b`;
  /** The deed, attributed: "the murder was the work of X". */
  const attributed =
    `\\b(?:murder|killing|crime)\\b[^.!?]{0,40}\\b(?:was|were)\\b[^.!?]{0,20}` +
    `(?:committed by|the work of|done by)[^.!?]{0,20}${name}`;
  /** A confession is an accusation the culprit makes about themselves. */
  const confessed = `${name}[^.!?]{0,60}\\bconfess(?:ed|es|ion)\\b|\\bconfess(?:ed|es|ion)[^.!?]{0,40}${name}`;

  return new RegExp([didIt, wasThem, authored, attributed, confessed].join("|"), "i").test(text);
};
