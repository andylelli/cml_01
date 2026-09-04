/**
 * The sentences the pipeline writes for itself — one registry, so a checker can tell them apart from
 * prose (REVIEW_05 §10.1 / N1).
 *
 * WHY THIS FILE EXISTS. On run `mystery-1785870981757` the finished manuscript named its murderer in
 * exactly one sentence, and no human wrote it:
 *
 *   "Captain Ivor Hale was responsible; the evidence allowed no other reading."
 *
 * Three machine layers produced it. `enforceCulpritEvidencePresence` injected
 * *"…was responsible, and the evidence placed the matter beyond all reasonable doubt."* because the
 * model had named nobody; the `B5` scaffold floor then rewrote that into the shorter form above,
 * because the scaffold detector recognises the first phrasing and not the second. Geometry's
 * acceptance test could see neither, so "the story never names its culprit" read as satisfied.
 *
 * TWO PROPERTIES THIS FILE MUST HAVE, and both are load-bearing:
 *
 *   1. **The builders live here, and the injectors call them.** A registry that re-types the strings
 *      is a second body that drifts from the first — the trap this codebase has paid for repeatedly.
 *      `agent9-run.ts` imports these rather than holding its own copies.
 *   2. **It carries the LAUNDERED forms too.** A registry containing only what the injector writes
 *      would have matched nothing on that run, because what SHIPPED was the floor's rewrite. Every
 *      floor that edits an injected sentence must contribute its replacement here.
 *
 * The patterns are deliberately loose about names and punctuation and strict about the template
 * wording: the wording is ours and fixed, the names are not.
 */

import { buildResolutionBackstopSentence } from "./clue-validation.js";

export { buildResolutionBackstopSentence };

/**
 * `enforceCulpritEvidencePresence` — the deterministic floor for "the prose never links the culprit
 * to the act". MOVED from `agent9-run.ts`; the text is byte-identical, because changing it would
 * change what ships.
 */
export const buildCulpritEvidenceSentence = (culprit: string): string =>
  `${culprit} was responsible, and the evidence placed the matter beyond all reasonable doubt.`;
/**
 * The SAME floor, written so it does not break the rule the model is failed for.
 *
 * ── THE DEFECT, MEASURED ─────────────────────────────────────────────────────────────────────────
 *
 * `buildCulpritEvidenceSentence` above is a summary verdict, and the resolution lint forbids exactly
 * that: "Resolution chapter must close with an in-scene moment (dialogue, action, or sensation), not
 * a summary verdict sentence." So every time the floor fires, the pipeline writes a sentence the model
 * would be failed for, records the violation, and ships it because ADR-0003 says injections stand (X4).
 *
 * X4 built its counters to make that a number rather than an anecdote. Across the 18 archived runs
 * carrying the telemetry: 5 injections, 10 violations — every injection breaks two rules,
 * `verdict_closer.was_responsible` and `verdict_closer.beyond`. A 100% VIOLATION RATE. This is not a
 * floor that occasionally trips a rule; as written it cannot produce a compliant sentence.
 *
 * External readers have quoted the result back three times, most recently as "Hugo Vane was
 * responsible; the evidence allowed no other reading" — "not story prose; generator residue"
 * (ANALYSIS_74 §9.4).
 *
 * ── WHY THIS IS NOT THE ADR-0003 ARGUMENT ────────────────────────────────────────────────────────
 *
 * REVIEW_05 §10.6 framed the choice as REFUSE the injection (which trades a bad sentence for a MISSING
 * obligation, and ADR-0003 forbids that) versus LET IT STAND. There is a third option, and this
 * codebase already took it once: `buildResolutionBackstopSentence` had the same conflict and A_57 D4
 * resolved it by dramatizing the backstop — a confession beat ending on a sensation — so it satisfies
 * its obligation AND closes in scene. Nothing is refused; the wording stops fighting a rule it never
 * needed to fight.
 *
 * ── THE CONTRACT THIS MUST STILL MEET ────────────────────────────────────────────────────────────
 *
 * `culpritEvidenceLinkInText` requires all three, and the tests assert them against the REAL
 * predicate rather than trusting the prose to look right: the culprit's NAME, a culprit term
 * (culprit/killer/murderer/responsible/"did it"), and an evidence term (evidence/proof/alibi/
 * timeline/...). "did it" and "proof" carry two of them; the name carries the third. It must also
 * match NONE of RESOLUTION_VERDICT_CLOSER_RULES, which is exactly what the old form failed.
 */
export const buildCulpritEvidenceSentenceInScene = (culprit: string): string =>
  `"You did it." The words settled and nobody took them back. ` +
  `${culprit} said nothing, and the proof on the table said the rest.`;


/**
 * ── A_75 §6.3 (P3.2) — THE CLUE-PARAGRAPH BUILDERS, MOVED HERE ───────────────────────────────────
 *
 * These two sentences shipped from `deterministic-repair.ts` for the whole life of the project, which
 * is this file's property #1 violated for the LARGEST injector in the pipeline: the builder lived in
 * one module and the registry that exists to recognise its output lived in another. That is the same
 * second-body trap the header warns about, and it is exactly why `isInjectedSentence` returned false
 * for every sentence this injector has ever written (fixed 2026-08-26). The builder now lives beside
 * the patterns that must match it.
 *
 * ── THE DEFECT THE LIST GRAMMAR FIXES ────────────────────────────────────────────────────────────
 *
 * `description` and `pointsTo` are TOKEN BAGS. `composeProseTermPhrase` reduces a clue to de-spoiled
 * key terms — "Temporal conflict hale alibi", "Victim last seen alive minutes past" — deliberately,
 * so no 12-word span of the spec can survive into the prose. The old inference sentence then used a
 * token bag as a SUBJECT and as a VERB COMPLEMENT:
 *
 *     "Weighed against the rest, Victim last seen alive minutes past bent the trail toward
 *      Temporal conflict hale alibi."
 *
 * That is not a wording problem to be reworded. **A token bag is grammatical in a list and nowhere
 * else**, so no phrasing that puts one in subject position can be made to read. The fix is to render
 * the operands where their grammar works: after a colon, as a list.
 *
 * Flag-gated `AGENT9_CLUE_LIST_GRAMMAR` (default OFF), read at CALL time — a module-const flag freezes
 * before dotenv and this repo has paid for that twice.
 */
export const isClueListGrammarEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env.AGENT9_CLUE_LIST_GRAMMAR === "true" || env.AGENT9_CLUE_LIST_GRAMMAR === "1";

/**
 * The observation half. The lead carries the investigator's NAME and the terms sit in a SEPARATE
 * sentence — never merged. That separation is load-bearing and predates this move: abort class #6
 * (run `mystery-1784244374547`) shipped a lead and a key-term list as ONE sentence, the character
 * lifecycle validator's death heuristic saw a cast name beside the word "body", marked the DETECTIVE
 * deceased in ch3, and the release gate killed the run. A worker test runs the real validator over
 * this output.
 */
export const buildClueObservationParagraph = (
  investigatorName: string,
  clueList: string,
  isEarly: boolean,
): string => {
  // PASS 8: with an empty name or empty list this used to emit
  // `" pressed on to the next concrete detail. The record now held: ."` — a leading space, a
  // subjectless sentence and an empty list, pasted straight into the manuscript. A builder with
  // nothing to say must say NOTHING; the guard lives here rather than only in the caller, because
  // this is exported and every other caller would have to remember it.
  if (!String(investigatorName ?? "").trim() || !String(clueList ?? "").trim()) return "";
  const lead = isEarly
    ? `${investigatorName} laid the facts out plainly where the others could see them.`
    : `${investigatorName} pressed on to the next concrete detail.`;
  return `${lead} The record now held: ${clueList}.`;
};

/** One inference sentence per clue. `description` and `pointsTo` are key-term bags, never sentences. */
export interface ClueInferenceOperands {
  description: string;
  pointsTo?: string;
}

/**
 * The inference half. Two renderings, and the flag chooses:
 *
 *   OFF (today's shipped text)  "Weighed against the rest, <bag> bent the trail toward <bag>."
 *   ON  (the list grammar)      "Weighed against the rest, one detail told against the account: <bag>.
 *                                What it pointed to: <bag>."
 *
 * Both keep the operands out of any sentence carrying a cast name, so abort class #6 stays closed.
 */
export const buildClueInferenceSentence = (entry: ClueInferenceOperands): string => {
  if (isClueListGrammarEnabled()) {
    return entry.pointsTo
      ? `Weighed against the rest, one detail told against the account: ${entry.description}. `
        + `What it pointed to: ${entry.pointsTo}.`
      : `Weighed against the rest, one detail told against the account: ${entry.description}.`;
  }
  return entry.pointsTo
    ? `Weighed against the rest, ${entry.description} bent the trail toward ${entry.pointsTo}.`
    : `Weighed against the rest, ${entry.description} left the standing account weaker.`;
};

export const buildClueInferenceParagraph = (entries: ReadonlyArray<ClueInferenceOperands>): string => {
  // PASS 8: an empty list produced `"That detail shifted the reasoning. "` — a machine sentence
  // announcing a detail that is not there, with a trailing space. Same rule as above.
  const usable = (entries ?? []).filter((e) => String(e?.description ?? "").trim().length > 0);
  if (usable.length === 0) return "";
  return `${usable.length > 1 ? "Those details" : "That detail"} shifted the reasoning. `
    + usable.map(buildClueInferenceSentence).join(" ");
};

/** `enforceSuspectEliminationPresence` — the floor for "this suspect is never cleared in the prose". */
export const buildSuspectClearanceSentence = (surname: string): string =>
  `${surname} was thoroughly cleared by the evidence; the alibi confirmed they could not have committed the crime.`;

/**
 * Every sentence shape the pipeline writes for itself, INCLUDING the forms the scaffold floors
 * rewrite them into.
 *
 * A checker matching any of these has found machine text, not authored prose. Used by geometry's
 * acceptance test to return `met_by_injection` rather than `met` — the distinction that gives the
 * injector-retirement work (THINK_01 Move 5, REVIEW_05 §12.4) an exit condition it can measure.
 */
export const INJECTED_SENTENCE_PATTERNS: ReadonlyArray<RegExp> = [
  // enforceCulpritEvidencePresence, as written…
  /\bwas responsible,\s*and the evidence placed the matter beyond all reasonable doubt\b/i,
  // …and as the B5 scaffold floor rewrites it. THIS is the form that shipped on 08-04.
  /\bwas responsible;\s*the evidence allowed no other reading\b/i,
  // buildCulpritEvidenceSentenceInScene — the COMPLIANT form. Registered here on purpose: this
  // file's property #2 is that a floor which changes an injected sentence must contribute its new
  // shape, or every checker that tells machine text from authored prose goes blind to it.
  /"You did it\."\s*The words settled and nobody took them back\./i,
  // enforceSuspectEliminationPresence
  /\bwas thoroughly cleared by the evidence;\s*the alibi confirmed they could not have committed the crime\b/i,
  // the A3 scaffold floor's replacement for the clearance phrasing
  /\bplaced\s+.{1,40}?\s+elsewhere\b/i,
  /**
   * buildDeterministicClueParagraphs (deterministic-repair.ts) — the MISSING-CLUE floor.
   *
   * MEASURED 2026-08-26: none of this injector's output matched anything in this list, so
   * `isInjectedSentence` returned false for every sentence it has ever written. That is this file's
   * property #2 violated for the LARGEST injector in the pipeline, and it has two consequences the
   * header already predicts: geometry returns `met` where it should return `met_by_injection`, and
   * the injector-retirement metric — "the distinction that gives that work an exit condition it can
   * measure" — has been blind to the injector most worth retiring.
   *
   * Three external readers have quoted this output back as "generator residue"; it has been visible
   * to humans and invisible to us. Registering it changes no prose — it changes what we can count.
   */
  /**
   * A_76 — THE TWO BIGGEST LIVE INJECTIONS WERE NOT REGISTERED HERE.
   *
   * `deterministic-repair.ts` (the discriminating-test floor, lines ~444–447) emits both of these,
   * and a corpus sweep of the 31 August manuscripts found them in **39% and 35% of books** — by far
   * the most frequent machine text currently shipping. Neither matched `isInjectedSentence`.
   *
   * That is exactly the failure this file's own property #2 warns about: *"a floor which changes an
   * injected sentence must contribute its new shape, or every checker that tells machine text from
   * authored prose goes blind to it."* The floor was changed and its new shapes never arrived, so
   * `AGENT9_RECAP_STRIP_INJECTED` could not strip them from the recap (leaving the model to imitate
   * its own machine register forward), the geometry acceptance pass could not count them, and every
   * measurement of "how much injected text is in this book" undercounted.
   *
   * Both branches of each ternary are registered, not just the one that happened to be sampled.
   */
  /\bRun again in front of them all, the test came out the same way\b/i,
  /\bas the only person whose story still needed the discredited theory to be true\b/i,
  /The record now held:/i,
  /(?:laid the facts out plainly where the others could see them|pressed on to the next concrete detail)/i,
  /(?:Those details|That detail) shifted the reasoning/i,
  /Weighed against the rest,.*(?:bent the trail toward|left the standing account weaker)/i,
  /**
   * …and the shape the MODEL paraphrases that line into, which the registry could not see.
   *
   * MEASURED on story_20260903-2136 (external read 77/100, `prose` 5/10, the reviewer quoting these
   * sentences as "generator-planning artifacts"): the code writes
   * `"That detail shifted the reasoning. Weighed against the rest, <bag> bent the trail toward <bag>."`
   * and the book contains
   * `"That detail turned the logic stacked against the rest, <bag> bent the trail toward <bag>."`
   * `isInjectedSentence` returned FALSE for every one of them.
   *
   * That is A_75 §2.1's mechanism rather than a template bug — the model was shown our voice in the
   * recap and rewrote our sentence in it — but the consequence is a registry blind to text the
   * pipeline is responsible for: `AGENT9_RECAP_STRIP_INJECTED` cannot remove what it cannot
   * recognise, and the injector-retirement metrics undercount.
   *
   * The verb rotates (upended / turned / tilted / overturned), so it is matched as `\w+`, and the
   * anchor is the phrase no author writes: "the logic stacked against the rest".
   *
   * BASELINED BEFORE ADDING, over all 32 archived manuscripts: 6 occurrences in 2 books, every one a
   * token bag ("Brass candlestick wiped traces blood groove"), zero authored prose. This registry
   * feeds a pass that DELETES text, so a loose pattern here costs real writing.
   */
  /\b(?:That detail|Those details)\s+\w+\s+the logic stacked against the rest\b/i,
  // …and the LIST-GRAMMAR rendering of the same floor (AGENT9_CLUE_LIST_GRAMMAR). Registered in the
  // same commit that introduced it: property #2 of this file is that a floor which changes its
  // sentence must contribute the new shape, and the alternative is a flag that silently blinds every
  // checker the moment it is switched on.
  /Weighed against the rest, one detail told against the account:/i,
  /What it pointed to:/i,
  // buildResolutionBackstopSentence — the confession backstop
  /"It was me\."\s*The words left\s+.{1,40}?\s+at last, barely above a whisper\./i,
  /"I confess\s*[—-]\s*I did it\."/i,
];

/** Does this sentence match something the pipeline wrote for itself? */
export const isInjectedSentence = (sentence: string): boolean =>
  INJECTED_SENTENCE_PATTERNS.some((re) => re.test(sentence));

/**
 * ── A_75 §6.3 (P3.1) — EVERY BUILDER, DECLARED ───────────────────────────────────────────────────
 *
 * THE RULE THIS ENFORCES, and it is the whole point of the item:
 *
 *   > Text the pipeline writes for itself is held to the same standard as text the model writes.
 *
 * Until now that standard existed in one direction only. `RESOLUTION_VERDICT_CLOSER_RULES` failed the
 * MODEL for writing a summary verdict, and `enforceCulpritEvidencePresence` wrote one on every firing
 * — 5 injections, 10 violations, a 100% violation rate across the archived runs — and shipped it,
 * because ADR-0003 says injections stand. Three external readers quoted the result back as generator
 * residue.
 *
 * X4 fixed that ONE sentence. This makes the CLASS unrepresentable: the accompanying test walks this
 * registry, requires every `live` builder's specimen to break no model-bound rule AND to be matched by
 * `isInjectedSentence`, and requires every exported `build…` function in this module to appear here.
 * A new floor cannot be added in a violating form, or added without registering its shape, without
 * failing the suite. That is a rule rather than a repair — property A of §6.0.
 *
 * `superseded` marks a builder kept only so its defect stays pinned by a test. It is exempt from the
 * rule check and MUST NOT be called by an injector.
 */
export type InjectionBuilderStatus = "live" | "superseded";

export interface InjectionBuilderSpec {
  /** The exported function name, so the export sweep can match on it exactly. */
  id: string;
  status: InjectionBuilderStatus;
  /** Why it is superseded, and by what. Required for `superseded`, so the exemption is never silent. */
  supersededBy?: string;
  /** A specimen built with representative operands — the real builder, never a re-typed string. */
  specimen: () => string;
}

const SPECIMEN_CULPRIT = "Hugo Vane";
const SPECIMEN_SURNAME = "Marchbank";
const SPECIMEN_INVESTIGATOR = "Eleanor Voss";
/** Key-term bags of the shape `composeProseTermPhrase` actually emits — not tidy noun phrases. */
const SPECIMEN_CLUE = { description: "Victim last seen alive minutes past", pointsTo: "Temporal conflict hale alibi" };

export const INJECTION_BUILDERS: ReadonlyArray<InjectionBuilderSpec> = [
  {
    id: "buildCulpritEvidenceSentence",
    status: "superseded",
    supersededBy: "buildCulpritEvidenceSentenceInScene",
    specimen: () => buildCulpritEvidenceSentence(SPECIMEN_CULPRIT),
  },
  {
    id: "buildCulpritEvidenceSentenceInScene",
    status: "live",
    specimen: () => buildCulpritEvidenceSentenceInScene(SPECIMEN_CULPRIT),
  },
  {
    id: "buildSuspectClearanceSentence",
    status: "live",
    specimen: () => buildSuspectClearanceSentence(SPECIMEN_SURNAME),
  },
  {
    id: "buildResolutionBackstopSentence",
    status: "live",
    specimen: () => buildResolutionBackstopSentence(SPECIMEN_SURNAME),
  },
  {
    id: "buildClueObservationParagraph",
    status: "live",
    specimen: () => buildClueObservationParagraph(SPECIMEN_INVESTIGATOR, SPECIMEN_CLUE.description, false),
  },
  {
    id: "buildClueInferenceParagraph",
    status: "live",
    specimen: () => buildClueInferenceParagraph([SPECIMEN_CLUE]),
  },
  {
    id: "buildClueInferenceSentence",
    status: "live",
    specimen: () => buildClueInferenceSentence(SPECIMEN_CLUE),
  },
];
