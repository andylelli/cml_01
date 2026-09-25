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
  /**
   * 17-hitting-90 P1.6. The verb list had no "stabbed" — the arm-B case was a stabbing — which is the
   * `guilt-marker-has-no-blunt-force-verb` shape again. The verbs of killing this pipeline's
   * `death_method` field has produced are all here now.
   */
  const killVerb =
    `(?:killed|murdered|poisoned|strangled|throttled|struck|stabbed|shot|drowned|smothered|suffocated|bludgeoned|pushed|cut)`;
  const didIt = `${name}[^.!?]{0,80}\\b(?:${killVerb}|is the (?:killer|murderer|culprit)|did it)\\b`;
  /**
   * The accusation to the culprit's face, by name: *"Desmond Kestrel, you alone could have used the
   * cave's secret window"*. v2's gate read arm B's chapter 8 as naming nobody and stopped the book
   * for a reader who then named Desmond without hesitation (A_108 §3). "You" after the name, then a
   * verb of killing or the words that make only one person able, inside the sentence.
   */
  const youAccused =
    `${name}[^.!?]{0,40}\\byou\\b[^.!?]{0,80}\\b(?:${killVerb}|alone could|only you|no one else could|nobody else could)\\b` +
    `|${name}[^.!?]{0,40}\\byou\\b[^.!?]{0,20}\\b(?:were|are) the (?:killer|murderer|one)\\b`;
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
  /**
   * "X was responsible", "responsible for the murder ... X".
   *
   * MEASURED over the 26 archived books this predicate found NOTHING in: 3 of them say exactly this
   * and nothing stronger — *"Captain Ivor Hale was responsible; the evidence allowed no other
   * reading."* It is an attribution of the act, not a suspicion.
   */
  const responsible =
    // "was responsible" with nothing after it, or followed by the deed — never "responsible for the
    // linen", which is a duty roster and was the first false positive this clause produced.
    `${name}[^.!?]{0,60}\\b(?:was|is|had been)\\s+guilty\\b` +
    `|${name}[^.!?]{0,60}\\b(?:was|is|had been)\\s+responsible\\b(?!\\s+for\\s+)` +
    `|${name}[^.!?]{0,60}\\b(?:was|is|had been)\\s+responsible\\s+for\\s+(?:the\\s+)?(?:murder|killing|death|crime)\\b` +
    `|\\bresponsible for (?:the )?(?:murder|killing|death|crime)\\b[^.!?]{0,40}${name}`;
  /**
   * The arrest. Eight of those 26 end on it and on nothing else: a constable comes, the culprit is
   * led away, and no sentence ever says they killed anybody.
   *
   * It carries a known risk in the OTHER direction — a mid-book arrest of the real culprit, later
   * released, would read as an early naming. That is the genre's stock move performed on the wrong
   * person far more often than the right one, and the asymmetry decides it: a missed reveal STOPS a
   * finished book, while a false early naming costs one editor call.
   */
  const arrested =
    `${name}[^.!?]{0,60}\\b(?:was arrested|were arrested|taken into custody|led away|charged with (?:the )?(?:murder|killing|crime))\\b` +
    `|\\b(?:arrest(?:ed)?|collect|take into custody)\\b[^.!?]{0,30}${name}[^.!?]{0,40}\\b(?:constable|police|inspector|sergeant|custody)\\b`;

  return new RegExp([didIt, youAccused, wasThem, authored, attributed, confessed, responsible, arrested].join("|"), "i").test(text);
};
