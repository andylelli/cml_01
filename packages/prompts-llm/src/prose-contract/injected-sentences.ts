/**
 * The sentences v1's deterministic injectors wrote, as a DETECTOR — the evaluation scripts still read archived v1 books that contain them. The builders were deleted with v1.
 *
 * Moved out of the v1 engine's `agent9-prose/injection-templates.ts` by owner decision 1 (2026-09-30), which deleted that
 * engine; these are the declarations the v2 engine, Agent 7 or scoring still read (with every helper they
 * reference, moved by `scripts/move-declarations.mjs --closure`). Nothing in them changed.
 */

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
  //
  // MEASURED 2026-09-08: the pipeline artifact of story_20260905-1242 carries this sentence as
  // `"You did it. ” The words settled…` — a space and a CURLY closing quote, put there by a pass that
  // ran after the floor. The pattern as first written required `."` and returned false on what
  // shipped, so every checker that consumes this registry — the scaffold regen, the clearance-trim
  // scrub, the geometry acceptance — was blind to the floor's own text on 4 of 4 recent books. The
  // quote and the whitespace are now tolerated HERE, in the pattern, because `checkManuscriptGeometry`
  // tests the raw array against raw text and never goes through `isInjectedSentence`.
  /["“]You did it\.\s*["”]\s*The words settled and nobody took them back\./i,
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
export const isInjectedSentence = (sentence: string): boolean => {
  // Fold typography before matching: curly quotes to straight, and no whitespace between a closing
  // punctuation mark and its closing quote. Downstream passes curl and space the floors' output
  // (see the "You did it" pattern above), and a recogniser that only knows the builder's raw form
  // certifies its own fixture and nothing that ships.
  const folded = String(sentence ?? "")
    .replace(/[“”„‟″‶]/g, '"')
    .replace(/[‘’‚‛′‵]/g, "'")
    .replace(/([.!?…])\s+(["'])/g, "$1$2");
  return INJECTED_SENTENCE_PATTERNS.some((re) => re.test(folded) || re.test(sentence));
};
