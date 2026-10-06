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

import { auditFixesEnabled } from "@cml/cml";

const escape = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The case's people, from the contract, for the two rules that need them (V-10). Ignored with the flag off. */
export interface CulpritContext {
  /** `fairPlay.victim` — the person a deed verb must be done TO. */
  victim?: string;
  /** Every name the contract puts on a page (`scenes[].present`), for the shared-surname rule. */
  cast?: ReadonlyArray<string>;
}

/** The case's people as one list, from the contract — the context every call site passes. */
export const culpritContextOf = (core: {
  scenes: ReadonlyArray<{ present?: ReadonlyArray<string> }>;
  fairPlay: { victim?: string };
}): CulpritContext => ({
  victim: core.fairPlay.victim,
  cast: [...new Set(core.scenes.flatMap((s) => s.present ?? []))],
});

const nameTokens = (name: string): string[] =>
  name.split(/\s+/).map((t) => t.replace(/[^\p{L}'’-]/gu, "")).filter((t) => t.length >= 2);

/**
 * WF-005 V2O-01 / V2K-03 (A_111 V-10, PROSE_V2_AUDIT_FIXES) — the same families, three rules tighter.
 *
 * MEASURED over every manuscript in `stories/` (one per distinct cast): 160 sentences satisfied the deed clause,
 * 125 of them on cut/struck/pushed/shot, and 2 of those 125 had a person as the verb's object — *"Isabel Morton's wit
 * had cut through the silence"* satisfied the gate's fair-play stop with every accusation stripped from the reveal.
 *
 *   1. A deed verb counts only with a PERSON as its object: the victim's name (any part of it) or him/her/them.
 *      "struck eleven", "cut through the silence", "pushed open the door" and "Eleanor drowned while…" do not.
 *   2. A name followed by 's is a POSSESSOR, never the agent: *"Isabel Morton's wit"*, *"the murderer was Morton's
 *      footman"*. Every clause, both directions — except *"X's confession"*, which is X's own act.
 *   3. The surname alone stands for the culprit only when nobody else in the case carries it. Two cases in the
 *      archive put the culprit and the victim under one surname; there *"Hemsworth was killed"* is the victim.
 */
const namesAsCulpritAudited = (text: string, culprit: string, context: CulpritContext): boolean => {
  const tokens = nameTokens(culprit);
  const surname = tokens[tokens.length - 1] ?? culprit;
  const lower = culprit.toLowerCase();
  const others = [...(context.cast ?? []), context.victim ?? ""]
    .map((n) => String(n ?? "").trim())
    .filter((n) => n && !n.toLowerCase().includes(lower) && !lower.includes(n.toLowerCase()));
  const surnameShared = others.some((n) => nameTokens(n).some((t) => t.toLowerCase() === surname.toLowerCase()));
  const alternatives = surnameShared || tokens.length < 2 ? [culprit] : [culprit, surname];
  const name = `\\b(?:${alternatives.map(escape).join("|")})(?![’']s\\b)`;

  const victimParts = context.victim ? [context.victim, ...nameTokens(context.victim)] : [];
  const person = `(?:him|her|them|${victimParts.length > 0 ? victimParts.map(escape).join("|") : "(?!)"})`;
  const killVerb =
    `(?:killed|murdered|poisoned|strangled|throttled|struck|stabbed|shot|drowned|smothered|suffocated|bludgeoned|pushed|cut)`;
  const deed = `${killVerb}\\s+${person}\\b`;

  const didIt = `${name}[^.!?]{0,80}\\b(?:${deed}|is the (?:killer|murderer|culprit)\\b|did it\\b)`;
  const youAccused =
    `${name}[^.!?]{0,40}\\byou\\b[^.!?]{0,80}\\b(?:${deed}|alone could\\b|only you\\b|no one else could\\b|nobody else could\\b)` +
    `|${name}[^.!?]{0,40}\\byou\\b[^.!?]{0,20}\\b(?:were|are) the (?:killer|murderer|one)\\b`;
  const wasThem = `\\b(?:killer|murderer|culprit) (?:is|was)[^.!?]{0,20}${name}`;
  const authored =
    `${name}[^.!?]{0,80}\\b(?:engineered|committed|carried out|planned|plotted|staged|arranged|` +
    `contrived|orchestrated|devised|executed)\\b[^.!?]{0,20}\\b(?:murder|killing|crime|death)\\b`;
  const attributed =
    `\\b(?:murder|killing|crime)\\b[^.!?]{0,40}\\b(?:was|were)\\b[^.!?]{0,20}` +
    `(?:committed by|the work of|done by)[^.!?]{0,20}${name}`;
  /**
   * The one possessive that IS the culprit's act: *"Harold Finch's confession"*. MEASURED: without it, 3 of 29 stored
   * books whose only naming after the reveal is "X's confession" would newly stop at the gate.
   */
  const ownConfession = `\\b(?:${alternatives.map(escape).join("|")})[’']s\\s+(?:\\w+\\s+){0,2}confession\\b`;
  const confessed =
    `${name}[^.!?]{0,60}\\bconfess(?:ed|es|ion)\\b|\\bconfess(?:ed|es|ion)[^.!?]{0,40}${name}|${ownConfession}`;
  const responsible =
    `${name}[^.!?]{0,60}\\b(?:was|is|had been)\\s+guilty\\b` +
    `|${name}[^.!?]{0,60}\\b(?:was|is|had been)\\s+responsible\\b(?!\\s+for\\s+)` +
    `|${name}[^.!?]{0,60}\\b(?:was|is|had been)\\s+responsible\\s+for\\s+(?:the\\s+)?(?:murder|killing|death|crime)\\b` +
    `|\\bresponsible for (?:the )?(?:murder|killing|death|crime)\\b[^.!?]{0,40}${name}`;
  const arrested =
    `${name}[^.!?]{0,60}\\b(?:was arrested|were arrested|taken into custody|led away|charged with (?:the )?(?:murder|killing|crime))\\b` +
    `|\\b(?:arrest(?:ed)?|collect|take into custody)\\b[^.!?]{0,30}${name}[^.!?]{0,40}\\b(?:constable|police|inspector|sergeant|custody)\\b`;

  return new RegExp([didIt, youAccused, wasThem, authored, attributed, confessed, responsible, arrested].join("|"), "i").test(text);
};

export const namesAsCulprit = (text: string, culprit: string, context: CulpritContext = {}): boolean => {
  if (!culprit) return false;
  if (auditFixesEnabled()) return namesAsCulpritAudited(text, culprit, context);
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
