/**
 * The acceptance test — the same contract, re-checked against the finished manuscript.
 *
 * THIS IS WHAT MAKES GEOMETRY A STAGE RATHER THAN A UTILITY (§2): every other stage asserts about a
 * plan; this is the only one that writes its acceptance test BEFORE the artefact exists and enforces
 * it AFTER. A violation becomes regeneration feedback naming the missed obligation — never an
 * injected sentence. That is the defect this whole line of work exists to remove.
 *
 * Two rules govern where the caller runs it (§8.9), and this codebase has already paid for getting
 * them wrong once — deterministic post-processing running after validation, corrupting clean output
 * with nothing left to re-validate it:
 *   1. The chapter-level test runs on the COMMITTED chapter text, after all deterministic
 *      post-processing — never before. A sweep that runs later can otherwise violate a constraint
 *      that had already passed.
 *   2. The whole-manuscript test runs after every chapter is committed.
 *
 * Everything here is pure and total. Missing input yields an `unmet` check with a stated
 * reason, or no check at all — never a throw, and never a fabricated violation.
 */

import type {
  GeometryAcceptanceOptions,
  GeometryAcceptanceReport,
  GeometryChapter,
  GeometryCheck,
  GeometryVerdict,
  GeometryViolation,
  StoryGeometry,
} from "./types.js";

// ── text helpers ─────────────────────────────────────────────────────────────

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Fold typographic punctuation to ASCII before any matching.
 *
 * FOUND 2026-08-04 by the probe reporting a false negative on a live run. The CML held
 * `actual_time_of_death: "two o’clock"` with a curly apostrophe; the shipped manuscript used straight
 * apostrophes throughout — 233 of them, zero curly — because prose sanitization normalises smart
 * quotes and the case model never passes through it. A needle taken from the CML and a haystack taken
 * from the page therefore disagree on a character no reader can see, and the check reported "the
 * case's true time never appears in the story" about a story that says it **thirteen times**.
 *
 * Every comparison in this file folds BOTH sides. Same family as the paragraph-vs-sentence and
 * index-vs-chapter defects: the instrument and the text have to agree on what a match is.
 */
export const foldTypography = (value: string): string =>
  String(value ?? "")
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”‟″]/g, '"')
    .replace(/[‐-―−]/g, "-")
    .replace(/ /g, " ");

/**
 * Which array slot holds chapter N.
 *
 * FOUND ON REVIEW 2026-08-03. This was `chapters[n - 1]`, which is correct only while the array is a
 * dense, in-order list starting at chapter 1. When it is not — a resumed run splicing committed
 * chapters, a checkpoint restore, any future batching change — every check silently reads a different
 * chapter than the one the contract binds. The probe was unambiguous: reordering a compliant
 * manuscript produced **six fabricated violations**, including "the reveal never names the culprit"
 * against a chapter that names them in its first sentence.
 *
 * A misaligned checker is worse than no checker: it reports confidently, and in `apply` mode it would
 * regenerate clean chapters to fix defects they do not have.
 *
 * `chapterNumber` is authoritative when the manuscript declares it. When NO chapter declares one,
 * position is all there is and is used. When some do and none matches, the chapter is absent — never
 * "probably that one".
 */
export const chapterIndexFor = (chapters: ReadonlyArray<GeometryChapter>, n: number): number => {
  const declared = chapters.findIndex((c) => Number(c?.chapterNumber) === n);
  if (declared >= 0) return declared;
  const anyDeclared = chapters.some((c) => Number.isFinite(Number(c?.chapterNumber)));
  if (anyDeclared) return -1;
  return n >= 1 && n <= chapters.length ? n - 1 : -1;
};

const paragraphsOf = (chapter: GeometryChapter | undefined): string[] =>
  Array.isArray(chapter?.paragraphs) ? chapter!.paragraphs!.map((p) => foldTypography(String(p ?? ""))) : [];

const textOf = (chapter: GeometryChapter | undefined): string => paragraphsOf(chapter).join("\n\n");

/**
 * THE FOLDING BOUNDARY (REVIEW_05 §10.3 / N3).
 *
 * Every value that crosses from the CASE MODEL into a comparison with the PAGE goes through here.
 * `paragraphsOf` folds the page; this folds everything held up against it — names, key terms, clock
 * anchors, method names.
 *
 * Why a named boundary rather than scattered calls: the previous fix folded the haystack and not the
 * needles, and that partial state was WORSE than no folding at all — `parseClockTime` returned null
 * on a curly anchor, so the case's own true time never entered the allowed set while the now-folded
 * prose parsed cleanly, and the check accused the manuscript of inventing the very hour the case had
 * declared. A boundary cannot be half-applied; a call site can.
 *
 * `paragraphIndices` on a violation still index the ORIGINAL paragraphs — folding is
 * position-preserving, so a scoped regeneration targets the text that actually shipped.
 */
const needle = (value: string | null | undefined): string => foldTypography(String(value ?? ""));

/**
 * Match a character by full name, or by surname when the surname is distinctive.
 *
 * The surname guard is not fussiness: a culprit surnamed "Bell" or "Frost" would otherwise match
 * every doorbell and every cold morning in the book, and the check would report a reveal that names
 * the culprit in a chapter that does nothing of the kind. Same trap the A_61 RC4.4 fix closed.
 */
const COMMON_WORD_SURNAMES = new Set([
  "bell", "frost", "gray", "grey", "green", "hall", "hill", "king", "lane", "moor", "moore",
  "rice", "stone", "wood", "young", "cook", "field", "brook", "marsh", "ward", "west", "banks",
]);

export const nameMatcher = (name: string, options?: { includeFirstName?: boolean }): RegExp | null => {
  const full = needle(name).trim();
  if (!full) return null;
  const parts = full.split(/\s+/);
  const surname = parts[parts.length - 1] ?? "";
  const alternatives = [escapeRe(full)];
  const distinctive = (part: string) => part.length >= 4 && !COMMON_WORD_SURNAMES.has(part.toLowerCase());
  if (parts.length > 1 && distinctive(surname)) alternatives.push(escapeRe(surname));
  /**
   * X18 — the FIRST name, on request only.
   *
   * Prose introduces a character in full and then refers to them familiarly, so a reveal can name the
   * culprit a dozen times without ever repeating the surname: *"Hugo's mask of indifference cracked"*.
   * Requiring the full name or surname made the disclosure test blind to that, and geometry reported
   * `unmet` on a reveal an external reader scored 9/10 (REVIEW_05 §32.3).
   *
   * Opt-in rather than default because the two callers want different things. Disclosure asks "was the
   * reader told?", where a familiar reference counts. The clincher and false-solution checks ask
   * whether a specific NAMED person appears, and a bare first name is weaker evidence there.
   *
   * Same distinctiveness guard as the surname: "Hugo" qualifies, a culprit called "Grace" or "Hope"
   * would not, because a reveal chapter is full of both.
   */
  if (options?.includeFirstName && parts.length > 1 && distinctive(parts[0]!)) {
    alternatives.push(escapeRe(parts[0]!));
  }
  return new RegExp(`\\b(?:${alternatives.join("|")})\\b`, "i");
};

/**
 * What it looks like to name someone as the person who did it.
 *
 * `(?:was|is|were|had been|held) responsible` and `to blame` were ADDED 2026-08-04, and the order of
 * that fix mattered. REVIEW_05 §3 showed that adding "responsible" on its own would have been the
 * WRONG move: it is the injector's own template word, so a bigger vocabulary alone would have turned
 * a false negative ("the reveal never discloses") into a false CERTIFICATION — geometry marking a
 * chapter satisfied on the strength of a sentence the pipeline wrote for itself.
 *
 * It is safe only because the third verdict exists first. A disclosure matching an injector template
 * returns `met_by_injection`, so widening the vocabulary makes the machine sentence VISIBLE rather
 * than accepted. Do not widen this further without checking that ordering still holds.
 *
 * Deliberately `was responsible` and not bare `responsible`: a character can be responsible for the
 * arrangements, the household, or the noise.
 *
 * ── X49 (REVIEW_11 §6) — IT HAD NO VERB FOR A BLOW, AND `FIRST_PERSON_ADMISSION` DID ──
 *
 * MEASURED on run `mystery-1786999938275`: **0 of chapter 8's 112 sentences matched this marker at
 * all** — in the reveal chapter an external reader scored 9/10 and called *"on-page, physical, and
 * emotionally satisfying"*. `reveal_culprit_not_named` fired, two regen calls went UNRESOLVED
 * (400 → 400), and the story shipped with a release-gate warning contradicting its own best chapter.
 *
 * The case's death method was *"struck with a heavy bronze statuette"* and the chapter's disclosure
 * sentence is *"Dr. Finch was struck down with a heavy bronze statuette"*. The list below carried
 * stabbing, shooting, strangling, poisoning, bludgeoning and smothering — every method except the
 * commonest one in the genre. And `FIRST_PERSON_ADMISSION`, forty lines down, ALREADY had
 * `struck (him|her|them) down` and `drowned`: the same act recognised in first person and invisible
 * in third. That is REVIEW_05 §6's defect-5 family — a fix applied to one side of a comparison.
 *
 * The header above says do not widen without checking the `met_by_injection` ordering still holds.
 * It does: none of these appear in an injector template, so a match can only be `met`, never a
 * machine sentence certified as a disclosure.
 *
 * CHOSEN ON EVIDENCE, not on vocabulary. Every candidate was run over all 187 corpus manuscripts,
 * sentence-scoped, counting only sentences the OLD marker did not already match:
 *
 *   struck…down          2 hits — BOTH genuine disclosures, 0 false positives
 *   fatal/killing blow  12 hits — all method statements or restatements
 *   dealt/struck blow    1 hit  — genuine
 *   drowned him/her/them 9 hits — all genuine
 *   held him/her under   7 hits — all genuine
 *   beat…to death / clubbed / battered him|her|them — 0 hits (completeness, costs nothing)
 *
 * Bare `drowned` was REJECTED on that evidence: it takes 40+ sentences of *"drowned out by the
 * storm"* / *"drowned beneath the patter of drizzle"*, which is X27's "shot a glance" defect exactly.
 * Only the agentive forms are here. Likewise `battered` is bounded to a person — this corpus is full
 * of *"the battered logbook"*.
 */
const GUILT_MARKER =
  /\b(?:killed|murdered|strangled|poisoned|stabbed|shot|bludgeoned|smothered|struck\s+(?:\w+\s+){0,2}down|(?:fatal|killing|deadly|mortal)\s+blow|(?:struck|dealt|delivered)\s+the\s+(?:\w+\s+)?blow|beat\s+(?:\w+\s+){0,2}to\s+death|clubbed|battered\s+(?:him|her|them)|drowned\s+(?:him|her|them)|held\s+(?:him|her|them)\s+under|is\s+(?:the|our|your)\s+(?:murderer|killer|culprit)|was\s+(?:the|our)\s+(?:murderer|killer|culprit)|committed\s+the\s+murder|confess(?:ed|es|ion)|guilty|guilt|arrested?|took\s+the\s+life|(?:was|is|were|had\s+been|held)\s+responsible|to\s+blame|(?:had\s+)?tampered\s+with|admitted\s+(?:it|everything|the\s+truth)|had\s+done\s+it|did\s+it)\b/i;

/**
 * X27 — the guilt verbs that are also ordinary English.
 *
 * FOUND BY THE FIRST APPLY-MODE RUN, 2026-08-07. In a nine-chapter manuscript the ONLY sentence
 * pairing the culprit with a guilt marker was:
 *
 *   "He shot a pointed glance at Captain Ivor Hale, who bristled but said nothing."
 *
 * `shot` is in `GUILT_MARKER` as a murder method, and "shot a glance" is one of the commonest idioms
 * in English. So geometry reported `manuscriptDisclosure: met @ch4` for a story that never discloses,
 * `revealBinding: refuted` on a binding that may be sound, and — worst — handed the judge
 * `noResolution = false`, so the ending cap did NOT fire on a story that never names its murderer.
 * That is M1's original defect reproduced, and the FALSE CERTIFICATION §14.2 warned the widening
 * would risk. It arrived through a pre-existing marker rather than through X18, but the effect is the
 * one that section named.
 *
 * STRIPPED, NOT REJECTED, and the distinction is this morning's X21 bug. A guard of the form
 * "contains an idiom → not a disclosure" lets one glance mask a real accusation in the same sentence.
 * Removing the idiomatic spans first and testing what remains cannot mask anything.
 */
/**
 * X49b (REVIEW_11 §6) — X27 RECURRED, IN THE RELATIVE-CLAUSE ORDER, AND IT IS WHY THE LOCATOR SAID
 * "CHAPTER 4".
 *
 * The stripper below was written for `shot a glance` — VERB then NOUN. English also writes the
 * glance first and the verb in a relative clause, and on run `mystery-1786999938275` chapter 4 the
 * ONLY sentence pairing the culprit with a guilt marker was:
 *
 *   "Eleanor caught the quick glance Beatrice shot toward Hugo Vane, a silent question…"
 *
 * `shot` survived the strip, so the advisory reveal-locator reported that the manuscript "discloses
 * in chapter 4" — a claim REVIEW_10 §10.4 then escalated N8 on. Chapter 4 is an interrogation scene
 * and discloses nothing; the cold reader put the reveal in chapter 8, where the contract bound it.
 *
 * MEASURED over all 187 corpus manuscripts: 6 sentences match the inverted order and **all six are
 * this idiom** ("caught the glance X shot at Y") — no real disclosure is lost. `shot through with`
 * is here for the same reason, found in the same sweep.
 *
 * ── X59, THE THIRD WORD ORDER (found on the 08-19 run) ──
 *
 * English also writes this DITRANSITIVELY — verb, recipient, then the noun:
 *
 *   "She shot Hugo Vane a look that was more tired than accusatory"   (ch2 of story_20260819-0147)
 *
 * Neither X27's `shot a glance` nor X49b's `glance … shot` reaches it, and it is the most dangerous
 * form of the three, because the recipient is a NAME — so the sentence pairs the culprit with a guilt
 * verb, which is exactly the conjunction `disclosingSentence` is looking for. On that run it made
 * `findManuscriptDisclosure` report the whole book as disclosing at **chapter 2**, in a manuscript
 * whose reveal is chapter 10.
 *
 * MEASURED: 25 sentences across 171 manuscripts match the ditransitive form, **all 25 are the idiom**,
 * and none was covered by an existing branch. A real shooting has no article-plus-look-noun after the
 * recipient ("he shot the man" does not match; "he shot the man a look" does).
 */
const GUILT_IDIOM =
  /\b(?:shot\s+(?:a|an|the)?\s*(?:pointed|quick|sharp|sidelong|warning|dark|nervous)?\s*(?:glance|look|glare|smile|grin)|shot\s+(?:\w+\s+){1,3}(?:a|an|the)\s+(?:\w+\s+){0,2}(?:glance|look|glare|smile|grin)|(?:glance|look|glare|smile|grin)s?\s+(?:\w+\s+){0,2}shot|shot\s+through\s+with|shot\s+back|shot\s+to\s+h(?:is|er)\s+feet|shot\s+up|killed\s+the\s+(?:engine|lights|conversation|time)|stabbed\s+at|a\s+stab\s+of|arrested\s+h(?:is|er)\s+attention)\b/gi;

/** The sentence with its idiomatic guilt-words removed, so what remains is what the verb means. */
const withoutGuiltIdioms = (sentence: string): string => sentence.replace(GUILT_IDIOM, " ");

const MOTIVE_MARKER =
  /\b(?:motive|because|in\s+order\s+to|so\s+that|to\s+protect|to\s+conceal|to\s+silence|revenge|inheritance|blackmail|jealous(?:y)?|ruin|debt|disgrace|exposure)\b/i;

const CONCEALMENT_MARKER =
  /\b(?:staged|rigged|faked|forged|contrived|tampered|set\s+the\s+(?:clock|hands)|moved\s+the\s+hands|wound\s+the\s+clock|deception|concealment|alibi\s+was\s+manufactured)\b/i;

const CLEARANCE_MARKER =
  /\b(?:cleared|ruled\s+out|eliminated|in\s+the\s+clear|not\s+the\s+(?:culprit|killer|murderer)|innocent|alibi\s+(?:holds|held|is\s+confirmed|checks\s+out)|could\s+not\s+have\s+(?:done|killed)|freed\s+from\s+suspicion|above\s+suspicion)\b/i;

/**
 * X21 — "cleared" is a verb a novelist uses constantly, and almost never about a suspect.
 *
 * MEASURED 2026-08-07 across the two N6 manuscripts: 4 of 13 clearance matches in the control and 2
 * of 11 in the treatment are idioms — throats, tables, the air. `clearanceBudget.maxSentences` is
 * **2**, so a third of the budget was being spent on people clearing their throats, and
 * `clearance_over_budget` fired on the treatment while partly counting them.
 *
 * Same family as the `Bell`/`Frost` surname guard above: a word that is evidence in one register and
 * furniture in another needs the register pinned before it counts.
 */
const CLEARANCE_IDIOM =
  /\bclear(?:ed|ing|s)?\s+(?:h(?:is|er)\s+throat|the\s+(?:throat|table|room|air|plates|dishes)|a\s+space|away|out)\b/i;

/** A clearance sentence, with the idioms excluded. */
const isClearanceSentence = (sentence: string): boolean =>
  CLEARANCE_MARKER.test(sentence) && !CLEARANCE_IDIOM.test(sentence);


/**
 * Time-shaped phrases on the page. Deliberately a recogniser, not a parser — every hit is handed to
 * the injected `parseClockTime` (the project's one implementation) to decide what it actually means.
 */
const HOUR_WORDS = "twelve|one|two|three|four|five|six|seven|eight|nine|ten|eleven";
const MINUTE_WORDS = "quarter|half|ten|five|twenty|twenty-five";
const TIME_MENTION = new RegExp(
  [
    `\\b\\d{1,2}:\\d{2}\\b`,
    `\\b(?:a\\s+)?(?:${MINUTE_WORDS})(?:\\s+minutes)?\\s+(?:past|to)\\s+(?:${HOUR_WORDS})\\b`,
    `\\b(?:${HOUR_WORDS})\\s+o['’]?clock\\b`,
  ].join("|"),
  "gi",
);

/**
 * Which paragraphs of an aftermath chapter re-deliver the reveal.
 *
 * Exported because the repair pass needs the SAME body the detector uses: a regen validated against a
 * second implementation of "is it still repeating?" can pass its own check and fail the real one.
 * That is the two-bodies-for-one-concept trap, and this codebase has paid for it repeatedly.
 *
 * A paragraph offends when it RE-ARGUES the case, not when it refers back to it.
 *
 * X20, FOUND BY A LIVE REHEARSAL 2026-08-07 for $0.0081. The rule was `namesCulpritAsGuilty ||
 * restatements >= 2`, so naming the culprit beside a guilt word was sufficient on its own. That
 * flagged this, in the aftermath of the run it was meant to repair:
 *
 *   "The hush that followed Beatrice Quill's confession still pressed close, but now it was
 *    tinged with a kind of exhausted relief."
 *
 * Zero restatements — no method, no motive, no concealment, no clearance. It is an aftermath
 * paragraph doing exactly its job: acknowledging what happened and showing what it cost. The header
 * above already said *"names the culprit as a DISCOVERY"*; the implementation only tested naming.
 *
 * And the pass could not repair it. The instruction forbids deleting, `preserveChapterLengthValidator`
 * forbids shrinking, and any rewrite that keeps the emotional reference keeps the flag — so the regen
 * burned two attempts and reported `score 375, was 375`. That is §2's "set up to fail" class, in the
 * thirteenth pass, and a full run would have discovered it at ~£1.50 instead of a penny.
 *
 * Naming now needs corroboration: the culprit named as guilty AND at least one restatement, or two
 * restatements without naming. Checked against what two external readers actually complained about —
 * ch9 *"repeats the clearances"* (naming + a clearance) and ch10 *"repeats the mechanism and
 * clearances"* (two restatements) — both still flag.
 */
export const detectAftermathRepeatParagraphs = (
  paragraphs: ReadonlyArray<string>,
  args: { culprit?: string | null; methodTerms?: ReadonlyArray<string> },
): number[] => {
  // X19 — the SAME matcher as disclosure, and for the same reason. This detector asks "does the
  // aftermath re-deliver the reveal?", which a familiar reference does just as well as a full name.
  // Sharing the narrow matcher is why it missed the repeat two external readers both named.
  const culpritRe = disclosureMatcher(args.culprit);
  const methodTerms = (args.methodTerms ?? []).map((t) => needle(t).toLowerCase()).filter(Boolean);
  const offending: number[] = [];
  paragraphs.forEach((paragraph, index) => {
    const text = foldTypography(String(paragraph ?? ""));
    const namesCulpritAsDiscovery = namesCulpritAsGuilty(text, culpritRe);
    const restatements = [
      methodTerms.some((t) => text.toLowerCase().includes(t)),
      CONCEALMENT_MARKER.test(text),
      // SENTENCE-scoped and idiom-stripped, for the two reasons this file keeps re-learning.
      // The header calls this "a motive-plus-guilt CLAUSE", but the test was paragraph-scoped, so a
      // motive word in the first sentence and a guilt word in the ninth counted as one clause (X21's
      // scope mismatch). And X27 stripped the "shot a glance" idiom in `disclosingSentence` and not
      // here, which is §6 defect 5 exactly — a fix applied to one side of the same comparison.
      sentencesOf(text).some((s) => MOTIVE_MARKER.test(s) && GUILT_MARKER.test(withoutGuiltIdioms(s))),
      // SENTENCE-scoped, not paragraph-scoped. FOUND ON REVIEW 2026-08-07, hours after X21 shipped:
      // `isClearanceSentence` is a conjunction (a clearance word AND not an idiom), so applying it to a
      // whole paragraph lets ONE "cleared her throat" mask a genuine clearance elsewhere in the same
      // paragraph. That is §6's scope-mismatch family — defects 1 and 3 — reintroduced by the fix for
      // a different false positive. A conjunction is only evidence at the granularity it is evaluated.
      sentencesOf(text).some(isClearanceSentence),
    ].filter(Boolean).length;
    if ((namesCulpritAsDiscovery && restatements >= 1) || restatements >= 2) offending.push(index);
  });
  return offending;
};

const sentencesOf = (text: string): string[] =>
  text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

/**
 * Does this text name the culprit AS the person who did it?
 *
 * SENTENCE-SCOPED, and that is not a refinement — it is the difference between working and not.
 * FOUND BY THE PHASE-1 BACKTEST (`scripts/geometry-backtest.mjs`): the paragraph-scoped version
 * declared `the_clock_s_deception` chapter 9 compliant, the exact chapter an external reviewer said
 * *"only points toward Hugo"*. The shipped markdown carries 5–8-sentence paragraphs, so the name and
 * a guilt word co-occurred in a paragraph that is a **suspect-clearance register** — Hale cleared,
 * Finch's innocence confirmed, Quill's alibi solid, and the word "guilty" thirty words away from
 * "Hugo Vane" doing no work at all.
 *
 * A conjunction is only evidence at the granularity a reader reads it.
 */
// DIAGNOSIS-BATCH #1 — exported for reuse: a premature-disclosure detector needs the exact same
// "does this text name the culprit as guilty" test this file already uses for the aftermath
// direction, so the two cannot disagree about what counts as a disclosure.
export const namesCulpritAsGuilty = (text: string, culpritRe: RegExp | null): boolean =>
  disclosingSentence(text, culpritRe) !== null;

/**
 * The sentence that satisfies the disclosure obligation, or null. Returned rather than a boolean so
 * the caller can ask WHO WROTE IT — a template match makes the difference between `met` and
 * `met_by_injection` (REVIEW_05 §10.1).
 */
const disclosingSentence = (text: string, culpritRe: RegExp | null): string | null => {
  if (!culpritRe) return null;
  const thirdPerson =
    sentencesOf(text).find((sentence) => culpritRe.test(sentence) && GUILT_MARKER.test(withoutGuiltIdioms(sentence))) ?? null;
  return thirdPerson ?? confessionDisclosure(text, culpritRe);
};

/**
 * X34 — A CONFESSION IS A DISCLOSURE, and until 2026-08-14 this file could not see one.
 *
 * MEASURED, on the N7 run. The repair pass was asked to make the reveal chapter disclose, and twice it
 * came back with exactly what the genre asks for:
 *
 *   "Hugo Vane sank into the nearest chair… \"I did it. I stopped the clock at a quarter to ten…\""
 *
 * `disclosingSentence` scored both `unmet`, because it wants the culprit's NAME and a guilt marker in
 * ONE sentence — and English writes a confession with the name in the attribution and the guilt in the
 * quoted first person. **The most idiomatic reveal in the genre could not satisfy the check that asks
 * whether the reveal happened**, so the only prose that COULD satisfy it was third-person narration of
 * the "X was responsible" shape — which is the injector's own template, and the sentence external
 * readers strike out by name (REVIEW_05 §32.2). The check was steering the manuscript toward the
 * machine-written form. That is the false-negative mirror of X27, and it cost a £1.22 run.
 *
 * THE RULE, and every clause of it is load-bearing against a FALSE CERTIFICATION (X27's lesson: the
 * worst outcome available here is certifying a reveal that did not happen):
 *
 *   1. the culprit is NAMED in the paragraph, and
 *   2. AFTER that name, a QUOTED span contains a first-person admission of the killing, and
 *   3. if that quote carries an explicit attribution naming a person, it names the CULPRIT.
 *
 * Clause 2's ordering is what rejects the false-confession trope — *"Beatrice's hands shook. 'I killed
 * her,' she said. Hugo Vane watched without expression."* — where the culprit is named only AFTER
 * someone else's admission. Clause 3 rejects the other half: another character confessing in a
 * paragraph the culprit already occupies. What remains unreachable by regex is a pronoun-attributed
 * confession by a third party in a paragraph the culprit is named in FIRST, which is X22's wall and is
 * recorded rather than chased.
 *
 * PARAGRAPH-SCOPED ON PURPOSE, and that is not a reversal of X27/X28. Those made a CONJUNCTION
 * sentence-scoped, because a name and a guilt word thirty words apart are not evidence about each
 * other. This is a different shape: a quoted admission is self-contained evidence that someone
 * confessed, and the paragraph is the unit that says who.
 */
const FIRST_PERSON_ADMISSION =
  /\bI\s+(?:killed|murdered|strangled|poisoned|stabbed|shot|bludgeoned|smothered|drowned|did\s+it|took\s+(?:his|her|their)\s+life|struck\s+(?:him|her|them)\s+down)\b|\bit\s+was\s+me\b|\bI\s+confess\b|\bI\s+(?:am|was)\s+(?:the\s+)?(?:guilty|the\s+(?:killer|murderer|culprit))\b/i;

/**
 * The name an admission is explicitly attributed to, if the attribution names anyone.
 *
 * Read in a window AFTER the admission, which is where English puts it: `"I killed her," said Beatrice`.
 *
 * ── BOTH ORDERS, and the second one was missing (found on review 2026-08-18) ──
 *
 * The first version matched VERB-then-NAME only — `said Beatrice Quill` — and English writes the
 * speech tag the other way round at least as often: `Beatrice Quill said`. The consequence was a
 * FALSE CERTIFICATION, the exact class REVIEW_05 §10.1 exists to prevent. Measured:
 *
 *   "Hugo Hale stiffened by the window. \"I killed her,\" said Beatrice Quill."   → unmet  ✅
 *   "Hugo Hale stiffened by the window. \"I killed her,\" Beatrice Quill said."   → MET    ❌
 *
 * Same paragraph, same confession by the same wrong person, opposite verdicts — and only the first
 * shape had a test. So a second character's confession certified the culprit's reveal, `noResolution`
 * went to the judge as false, and nothing downstream could correct it.
 *
 * ONE REGEX WITH TWO ALTERNATIVES, not two regexes, because the answer must be the attribution
 * NEAREST the admission — the speaker — and leftmost-match gives that for free. A second `exec` pass
 * would have to compare offsets by hand, which is the kind of bookkeeping this file gets wrong.
 *
 * The name is in group 1 or group 2 depending on which alternative won; `attributedName` reads both.
 * `[A-Z][a-z]+` needs two characters, so the bare "I" that opens every admission cannot match.
 */
const ATTRIBUTION_VERB =
  "(?:said|replied|answered|whispered|murmured|admitted|confessed|breathed|snapped|told|cried)";
const ATTRIBUTION_TITLE =
  "(?:(?:Dr|Mr|Mrs|Ms|Miss|Captain|Col|Colonel|Major|Sir|Lady|Lord|Inspector|Prof|Professor|Reverend|Rev)\\.?\\s+)*";
const ATTRIBUTION_NAME = "([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)";
const ADMISSION_ATTRIBUTION = new RegExp(
  `\\b${ATTRIBUTION_VERB}\\s+${ATTRIBUTION_TITLE}${ATTRIBUTION_NAME}` +
    `|\\b${ATTRIBUTION_TITLE}${ATTRIBUTION_NAME}\\s+${ATTRIBUTION_VERB}\\b`,
);

/** The captured name from either alternative of `ADMISSION_ATTRIBUTION`. */
const attributedName = (match: RegExpExecArray): string | null => match[1] ?? match[2] ?? null;

/**
 * NO QUOTE-SPAN EXTRACTION, and that is a correction rather than a shortcut.
 *
 * The first draft of this rule required the admission to sit inside a quoted span, and its extractor
 * treated `'` as a delimiter — so *"Hugo Hale's shoulders sagged"* opened a span at the possessive and
 * swallowed the real speech that followed. The fixture caught it. Manuscripts here mix straight,
 * curly, single and double quotes with possessives and contractions in every paragraph, so quote
 * pairing is not a reliable instrument on this corpus (the same defect is why `probe:dialogue-tics`
 * under-reads — X30b).
 *
 * `FIRST_PERSON_ADMISSION` is narrow enough to carry the weight without it: "I killed", "I did it",
 * "it was me". Negations do not match, because the patterns are contiguous — *"I did not kill her"*
 * and *"I didn't do it"* both fail to match "I killed"/"I did it".
 */
const confessionDisclosure = (paragraph: string, culpritRe: RegExp | null): string | null => {
  if (!culpritRe) return null;
  const namedAt = paragraph.search(culpritRe);
  if (namedAt < 0) return null;

  for (const sentence of sentencesOf(paragraph)) {
    const at = paragraph.indexOf(sentence);
    /**
     * The culprit must be named BEFORE the admission — the clause that refuses the false-confession
     * trope, where another character admits it and the culprit is merely named afterwards.
     *
     * `at < 0` cannot happen for a trimmed split of this paragraph, and it fails CLOSED anyway:
     * the first draft skipped the ordering test when the offset was unresolvable (fail-open) and
     * then sliced from a negative index, which in JS counts from the END of the string. A guard
     * that cannot locate its own evidence must decline, not guess.
     */
    if (at < 0 || at < namedAt) continue;
    const admission = FIRST_PERSON_ADMISSION.exec(sentence);
    if (!admission) continue;
    // An attribution naming someone else is someone else's confession.
    const after = paragraph.slice(at + (admission.index ?? 0), at + (admission.index ?? 0) + 160);
    const attributed = ADMISSION_ATTRIBUTION.exec(after);
    const speaker = attributed ? attributedName(attributed) : null;
    if (speaker && !culpritRe.test(speaker)) continue;
    return sentence;
  }
  return null;
};

/**
 * DIAGNOSIS-BATCH #1 — a SECOND-PERSON accusation, confirmed by the culprit's silent (non-denying)
 * presence, rather than a first-person spoken admission. `confessionDisclosure` above is FIRST-PERSON
 * only ("I did it," said X) — MEASURED directly against story_20260903-0738's actual shipped text
 * before writing this: `"You did it. " The words hung between them, final and irrevocable. Ivor
 * Kestrel offered a slow nod, his eyes steady but silent.` is a real, common Golden-Age confirmation
 * shape (the detective accuses; the culprit's silence or nod IS the confirmation) that
 * `confessionDisclosure` cannot see — its own ordering guard ("the culprit must be named BEFORE the
 * admission") is inverted here: the accusation comes first, the culprit is named describing their
 * REACTION to it.
 *
 * DELIBERATELY A NEW, SEPARATE FUNCTION, not a modification of `confessionDisclosure` or
 * `FIRST_PERSON_ADMISSION` in place. Those carry an extensive, hard-won history of narrow escapes
 * from the false-confession trope (X27, X49b, X59, each a real incident this file's own comments
 * record) — widening them risks reopening one of those. This is net-new, used only by the caller
 * that needs it (a premature-disclosure MEASURE, not the existing production disclosure checks),
 * so it can be wrong without touching anything already shipping.
 *
 * DELIBERATELY LOOSER than `confessionDisclosure` in one way (the culprit's name may appear anywhere
 * in the paragraph, not adjacent to the accusation — accepted because this is a warning-only MEASURE,
 * never a gate) and DELIBERATELY GUARDED in another: `culpritRe` is built from the actual named
 * culprit (`disclosureMatcher`), so an accusation of a DIFFERENT, innocent suspect — the false-
 * solution beat's own genre convention — cannot match this at all; and an explicit denial anywhere in
 * the same paragraph withholds the match, so a suspicion voiced and then refuted is not read as a
 * confirmed disclosure.
 */
const SECOND_PERSON_ACCUSATION =
  /\byou\s+(?:did\s+it|killed|murdered|are\s+the\s+(?:killer|murderer|culprit)|were\s+responsible)\b|\bit\s+was\s+you\b/i;
// Deliberately NOT anchored to a contraction ("that's") — the FIRST version was and missed "that IS
// not true", caught by this function's own test before shipping (the exact class of bug this file's
// history keeps recording: a guard that only matches the phrasing the author happened to type).
const ACCUSATION_DENIAL =
  /\b(?:not\s+me\b|didn.?t\s+do\s+it|i\s+didn.?t|not\s+true|you.?re\s+wrong|i\s+deny|i\s+refuse)\b/i;

/**
 * A 5-sentence window (the accusation, plus TWO sentences either side) — MEASURED, not assumed, on
 * the real text this was built from: `"You did it. " The words hung between them, final and
 * irrevocable. Ivor Kestrel offered a slow nod...` puts the reaction naming the culprit TWO
 * sentences after the accusation, with one neutral beat between. A radius-1 window (tried first)
 * missed this exact instance.
 *
 * NO WINDOW SIZE MAKES THIS BOTH PRECISE AND COMPLETE, and that is recorded rather than hidden. A
 * radius-1 window under-reaches (misses the real instance above); this radius-2 window over-reaches
 * on the opposite failure mode, ALSO caught directly by this function's own test: "'You did it,' she
 * said [to someone else]. Hugo Vane watched from the doorway, saying nothing." — accusing the wrong
 * person, with the real culprit merely a bystander two sentences away, still matches. Chosen
 * deliberately toward RECALL over precision because this is a warning-only MEASURE: a false positive
 * costs one dismissible line in `ctx.warnings`; a false negative means the check never helps at all.
 * A gate would need the opposite choice, which is one more reason this stays a measure.
 */
export const accusationConfirmedDisclosure = (paragraph: string, culpritRe: RegExp | null): string | null => {
  if (!culpritRe) return null;
  const sentences = sentencesOf(paragraph);
  for (let i = 0; i < sentences.length; i += 1) {
    if (!SECOND_PERSON_ACCUSATION.test(sentences[i])) continue;
    const windowStart = Math.max(0, i - 2);
    const windowEnd = Math.min(sentences.length, i + 3);
    const window = sentences.slice(windowStart, windowEnd).join(" ");
    if (!culpritRe.test(window)) continue;
    if (ACCUSATION_DENIAL.test(window)) continue;
    return sentences[i];
  }
  return null;
};

/**
 * DIAGNOSIS-BATCH #1 — does a chapter BEFORE the assigned reveal chapter already deliver the
 * culprit-naming disclosure that only the reveal chapter should own? A MEASURE, never a gate.
 *
 * MEASURED, story_20260903-0738 (external read 78/100): "Chapter 8 prepares the final test and
 * already proves a lot: it sets the spotlight to 45 degrees, shows the beam cannot create the
 * painted 135-degree shadow, connects the diagrams to Kestrel, and identifies his access and
 * motive... Then Chapter 9 repeats much of the same test." This is the REVERSE direction of the
 * already-shipped `detectAftermathRepeatParagraphs` (which checks chapters AFTER the reveal for
 * restatement) — nothing in this codebase checked the direction an EARLIER chapter preempting a
 * LATER one, confirmed by a dedicated research pass before writing this.
 *
 * WHY WARNING-ONLY, NOT A GATE, deliberately, on first principles rather than a measured base rate
 * (there is exactly one confirmed instance so far — n=1 is not a rate). Both signals this reuses are
 * narrow by design (`namesCulpritAsGuilty`'s existing, heavily-scarred history of false-confession-
 * trope near-misses; `accusationConfirmedDisclosure`'s own looser paragraph-scoped name match) —
 * gating on an unbaselined, narrow-by-construction signal is exactly the shape CLAUDE.md's evidence
 * standard and this file's own X27/X49b/X59 history warn against. Reports into the SAME
 * `geometry.closure.notes` channel `checkRevealBinding` already uses, at derive time is not
 * possible (this needs finished prose, which does not exist yet when geometry first derives) — the
 * caller supplies chapters post-generation instead.
 *
 * SCOPED, HONESTLY, to premature CULPRIT-NAMING specifically — the sharpest, most damaging single
 * form of one chapter doing another's job. It does NOT attempt the more general "does this chapter's
 * CONTENT duplicate that chapter's job" question for every possible job (the diagnosis this fix is
 * built from tried three keyword-based signals — theory/proof markers, an outline-tuned test/trap
 * regex, and the existing confession detector alone — against this exact case, and each one either
 * missed the defect or produced unreliable results; this is the one signal that, tested directly,
 * survived). A chapter that stages a demonstration WITHOUT naming the culprit as guilty is invisible
 * to this check, same as it always was.
 */
export const detectPrematureCulpritDisclosure = (
  chapters: ReadonlyArray<GeometryChapter>,
  revealChapter: number,
  culprit: string | null | undefined,
): string[] => {
  const culpritRe = disclosureMatcher(culprit);
  if (!culpritRe || revealChapter <= 1) return [];
  const findings: string[] = [];
  for (let n = 1; n < revealChapter; n += 1) {
    const idx = chapterIndexFor(chapters, n);
    const chapter = idx >= 0 ? chapters[idx] : undefined;
    if (!chapter) continue;
    for (const paragraph of paragraphsOf(chapter)) {
      const named = namesCulpritAsGuilty(paragraph, culpritRe) ? disclosingSentence(paragraph, culpritRe) : null;
      const accused = named ? null : accusationConfirmedDisclosure(paragraph, culpritRe);
      const sentence = named ?? accused;
      if (sentence) {
        findings.push(
          `chapter ${n} already names ${culprit} as guilty — "${sentence.trim().slice(0, 140)}" — before the ` +
            `chapter ${revealChapter} reveal this pipeline assigned the disclosure to`,
        );
        break; // one finding per chapter is enough
      }
    }
  }
  return findings;
};

/**
 * X18 — the matcher the DISCLOSURE question uses, which is not the one the other checks use.
 *
 * "Was the reader told who did it?" is satisfied by a familiar reference; "does this chapter name
 * this specific person?" is not. Built once per call site rather than threaded through, because the
 * distinction is the point and a shared matcher is what got this wrong.
 */
export const disclosureMatcher = (culprit: string | null | undefined): RegExp | null =>
  culprit ? nameMatcher(culprit, { includeFirstName: true }) : null;

/**
 * Does the manuscript name its culprit ANYWHERE, and who wrote the sentence that does?
 *
 * FOUND ON REVIEW 2026-08-06. The bound-chapter check (`reveal_culprit_not_named`) was being read by
 * the scoring path as though it answered this, and it does not. On the 08-04 run the contract bound
 * chapter 8, the disclosure landed in chapter 10, and the check returned `unmet` about a manuscript
 * that names its culprit on the page — so the judge was handed "this story never resolves" for a
 * story §14.4 had just decided counts as resolved. The detector WINS over the judge, so nothing
 * downstream could correct it.
 *
 * Scanned over every chapter on purpose, and NOT over the contract: the contract's binding is exactly
 * the thing in doubt (§5, and N4 measures the disagreement on 2 of 3 archived outlines). A repair
 * pass still needs the bound-chapter verdict — it names the chapter that would be regenerated — so
 * both are reported and neither is derived from the other.
 *
 * Chapter order matters to the answer: the FIRST disclosure is the one the reader receives, and an
 * authored sentence anywhere outranks an injected one, because a story that discloses properly in
 * chapter 9 is not made machine-written by a floor firing in chapter 10.
 *
 * `null` — NOT `unmet` — when the case names no culprit, because then there is no name to look for
 * and the question is unanswerable rather than answered "no". FOUND immediately by the corrected
 * backtest: the CML of the 80-scoring story has an empty `culprits` array (the `culprits_empty`
 * class the validator corpus check measures on 3 of 13 runs), and returning `unmet` there would have
 * capped the ending on the best story in the corpus. It is §13.3's rule in the third direction: a
 * fact nobody could compute must never be reported as a fact.
 */
export const findManuscriptDisclosure = (
  chapters: ReadonlyArray<GeometryChapter>,
  culprit: string | null | undefined,
  injectionTemplates: ReadonlyArray<RegExp> = [],
): { verdict: GeometryVerdict; chapter: number | null } | null => {
  const culpritRe = disclosureMatcher(culprit);
  if (!culpritRe) return null;

  let injectedAt: number | null = null;
  for (const [index, chapter] of chapters.entries()) {
    const chapterNumber = Number.isFinite(Number(chapter?.chapterNumber)) ? Number(chapter!.chapterNumber) : index + 1;
    for (const paragraph of paragraphsOf(chapter)) {
      const sentence = disclosingSentence(paragraph, culpritRe);
      if (sentence === null) continue;
      if (!injectionTemplates.some((re) => re.test(sentence))) return { verdict: "met", chapter: chapterNumber };
      if (injectedAt === null) injectedAt = chapterNumber;
    }
  }
  return injectedAt === null ? { verdict: "unmet", chapter: null } : { verdict: "met_by_injection", chapter: injectedAt };
};

// ── the test ─────────────────────────────────────────────────────────────────

/**
 * Re-check the contract against the finished manuscript.
 *
 * `chapters` is 1-indexed by position: chapter N is `chapters[N-1]`, which is how Agent 9 commits
 * them. Every constraint emits its outcome — INCLUDING the satisfied ones — because a zero that is
 * never written is indistinguishable from a check that never ran (§8.10).
 */
export const checkManuscriptGeometry = (
  geometry: StoryGeometry,
  chapters: ReadonlyArray<GeometryChapter>,
  options: GeometryAcceptanceOptions,
): GeometryAcceptanceReport => {
  const violations: GeometryViolation[] = [];
  const checks: GeometryCheck[] = [];
  const extraTimes: GeometryAcceptanceReport["extraTimes"] = [];

  const record = (check: GeometryCheck, violation?: Omit<GeometryViolation, "field" | "code" | "chapter">) => {
    checks.push(check);
    // `met_by_injection` is NOT a violation: the obligation is on the page, badly. Regenerating it
    // would re-run the pass that already failed into the floor. It is counted, not repaired.
    if (check.verdict === "unmet" && violation) {
      violations.push({ field: check.field, code: check.code, chapter: check.chapter, ...violation });
    }
  };

  const chapterAt = (n: number): GeometryChapter | undefined => {
    const index = chapterIndexFor(chapters, n);
    return index >= 0 ? chapters[index] : undefined;
  };

  /**
   * Which of the case's two temporal anchors a span of text actually states.
   *
   * ONE BODY, TWO QUESTIONS. X39 asks it of the whole manuscript ("is the story keeping time by some
   * other clock?"); X44 asks it of the reveal chapter ("does the disclosure put the two times side by
   * side?"). Those are different findings with different repairs, and the §9.1 lesson is that the way
   * to have two questions without two answers is one function, not two copies of six lines.
   *
   * Compares PARSED MINUTES, never strings: "a quarter past eight" and "8:15" are the same anchor, and
   * the case writes one form while the prose writes the other about as often as not.
   */
  const anchorsStatedIn = (text: string): { parseable: number; stated: number } => {
    const anchors = [geometry.timeModel.apparentTime, geometry.timeModel.trueTime]
      .map((raw) => (raw ? options.parseClockTime(needle(raw)) : null))
      .filter((m): m is number => m !== null);
    if (anchors.length === 0) return { parseable: 0, stated: 0 };
    const minutes = new Set<number>();
    for (const match of needle(text).matchAll(TIME_MENTION)) {
      const parsed = options.parseClockTime(match[0]);
      if (parsed !== null) minutes.add(parsed);
    }
    return { parseable: anchors.length, stated: anchors.filter((m) => minutes.has(m)).length };
  };

  /**
   * A chapter the contract binds but the manuscript does not have.
   *
   * This must NOT read as "the obligation was not delivered": an absent chapter yields empty text,
   * and every presence check would then fire at once — three fabricated violations from missing
   * input. The manuscript being shorter than the contract is one fact, reported once, and the
   * per-field checks for that chapter are skipped rather than failed.
   */
  const boundChapters = new Set<number>([
    ...geometry.chapterContract.map((c) => c.chapter),
    ...(geometry.methodSignature ? [geometry.methodSignature.plantChapter] : []),
    ...(geometry.clincher ? [geometry.clincher.payoffChapter] : []),
  ]);
  const missingChapters = [...boundChapters].filter((n) => !chapterAt(n)).sort((a, b) => a - b);
  if (missingChapters.length > 0) {
    record({ field: "chapter_contract", code: "contract_chapter_missing", chapter: null, verdict: "unmet" }, {
      scope: "manuscript",
      message:
        `The contract binds chapter(s) ${missingChapters.join(", ")}, which the manuscript does not contain ` +
        `(${chapters.length} chapter(s) present). Those obligations were not evaluated.`,
    });
  }

  // ── time_model: the manuscript contains no third time ─────────────────────
  // The one violation class that must never reach a repair pass (§8.5): a third clock time is a
  // PRE-PROSE defect. It is reported so the pre-prose gate can be judged on it, not regenerated.
  {
    /**
     * ACCOUNTED, not "exactly two". A mystery may state any number of clock readings; what it may not
     * state is one nothing accounts for. The two anchors plus every clock-valued locked fact — the
     * timer setting, the chime, the departure — are all accounted for, and flagging one of those was
     * geometry calling a manuscript incoherent for a time the case itself declared.
     */
    // X46 — THE MESSAGE AND THE CONDITION DISAGREED, and the message was the honest one.
    //
    // This used to gate on `allowed.size === 0` while saying "neither temporal anchor parses". Those
    // are different questions, because `allowed` also holds every clock-valued LOCKED FACT: a case
    // whose two anchors are both unreadable but whose device declares one parseable clock produced a
    // non-empty `allowed`, said nothing, and then scanned the manuscript against a set that did not
    // contain the story's own spine. Found while building X44 (REVIEW_10 §9), on the 86-scoring run,
    // whose anchors were "nine ten" and "nine twenty" — both null then, both parseable since X67.
    //
    // The anchors are now tracked separately, because they are what exclusivity MEANS. Without them
    // the scan is measuring the page against the device alone, and would report the case's own true
    // and apparent times as unaccounted — accusing the manuscript of the hours the case declared.
    const anchorMinutes: number[] = [];
    for (const raw of [geometry.timeModel.trueTime, geometry.timeModel.apparentTime]) {
      const parsed = options.parseClockTime(raw ? needle(raw) : undefined);
      if (parsed !== null) anchorMinutes.push(parsed);
    }

    const allowed = new Set<number>(anchorMinutes);
    for (const raw of [
      ...(geometry.timeModel.accountedTimes ?? []),
    ]) {
      // FOLD THE ANCHOR TOO. The first version of this fix folded only the haystack, which made the
      // defect worse rather than better: `parseClockTime("two o’clock")` returns null on the curly
      // form, so the case's true time never entered the allowed set — while the now-folded prose
      // parsed "two o'clock" cleanly and was reported as a THIRD time. The manuscript was accused of
      // inventing the very hour the case had declared.
      const parsed = options.parseClockTime(raw ? needle(raw) : undefined);
      if (parsed !== null) allowed.add(parsed);
    }
    if (anchorMinutes.length === 0) {
      const lockedParsed = allowed.size;
      record({ field: "time_model", code: "time_model_unparseable", chapter: null, verdict: "unmet" }, {
        scope: "manuscript",
        message:
          `Neither temporal anchor parses as a clock time (apparent: ${JSON.stringify(geometry.timeModel.apparentTime ?? null)}, ` +
          `true: ${JSON.stringify(geometry.timeModel.trueTime ?? null)})` +
          (lockedParsed > 0
            ? `, though ${lockedParsed} locked-fact value(s) do — which is why this used to stay silent here. `
            : ". ") +
          "Exclusivity cannot be checked against the page: the manuscript may contain any number of times " +
          "and nothing would notice. Repair the CASE, or teach the parser this shape.",
      });
    } else {
      chapters.forEach((chapter, index) => {
        const text = textOf(chapter);
        const chapterNumber = Number.isFinite(Number(chapter?.chapterNumber)) ? Number(chapter!.chapterNumber) : index + 1;
        for (const match of text.matchAll(TIME_MENTION)) {
          const phrase = match[0];
          const minutes = options.parseClockTime(phrase);
          if (minutes === null || allowed.has(minutes)) continue;
          if (extraTimes.some((t) => t.minutes === minutes)) continue;
          extraTimes.push({ chapter: chapterNumber, phrase, minutes });
        }
      });
      /**
       * X38 — THE DEVICE'S OWN ARITHMETIC, which nothing has ever checked.
       *
       * The 08-15 case declared three locked facts: `murder_time_displayed` "a quarter past seven",
       * `chime_recorded_time` "five minutes past seven", `pendulum_delay_duration` "fourteen minutes".
       * 7:15 − 7:05 is **ten**. The device contradicted itself before a word of prose existed, the
       * locked-fact layer then injected all three verbatim — that is its job — and the contradiction
       * shipped. The cold read led with it: *"the story cannot say 7:05 vs 7:15 and call it a
       * fourteen-minute lag"*, and scored the clue logic 6/10 for it.
       *
       * NARROW ON PURPOSE: exactly two clock-valued locked facts and exactly one duration. A case may
       * legitimately declare a duration that is about neither anchor (how long a chime lasts, how long
       * a walk takes), and with three times or two durations there is no single pairing to check. The
       * shape this fires on is the shape that broke: two clocks, one offset, and the offset is wrong.
       *
       * Reported here rather than gated pre-prose because that is this project's order — measure, then
       * promote. Its natural home once the signal holds is the locked-fact registry, where it would
       * fire before the prose it invalidates is paid for.
       */
      {
        // No injected duration parser ⇒ this check does not run. It never guesses: the pre-prose
        // `checkCaseTimeCoherence` is the authoritative one, and a second parser is what it must not be.
        const rawFacts = options.parseDurationMinutes
          ? (geometry.timeModel.accountedTimes ?? []).map((v) => String(v ?? "").trim()).filter(Boolean)
          : [];
        const clockValues: Array<{ raw: string; minutes: number }> = [];
        const durations: Array<{ raw: string; minutes: number }> = [];
        for (const raw of rawFacts) {
          const asDuration = options.parseDurationMinutes?.(raw) ?? null;
          if (asDuration !== null) {
            durations.push({ raw, minutes: asDuration });
            continue;
          }
          const asClock = options.parseClockTime(needle(raw));
          if (asClock !== null) clockValues.push({ raw, minutes: asClock });
        }
        if (clockValues.length === 2 && durations.length === 1) {
          const gap = (options.dialGapMinutes ?? ((x: number, y: number) => Math.abs(x - y)))(
            clockValues[0]!.minutes,
            clockValues[1]!.minutes,
          );
          const declared = durations[0]!.minutes;
          const agrees = gap === declared;
          record({ field: "time_model", code: "locked_time_arithmetic", chapter: null, verdict: agrees ? "met" : "unmet" }, {
            scope: "manuscript",
            message:
              `The case's own locked facts do not add up: "${clockValues[0]!.raw}" and "${clockValues[1]!.raw}" ` +
              `are ${gap} minutes apart, and "${durations[0]!.raw}" declares ${declared}. Locked facts are ` +
              `injected into the prose verbatim, so this contradiction ships as written and a reader meets ` +
              `two clock readings that refuse to explain the offset between them. The repair is to the CASE.`,
          });
        }
      }

      /**
       * X39 — AND THE ANCHORS THEMSELVES HAVE TO REACH THE PAGE.
       *
       * FOUND ON THE 08-15 RUN, by a cold read that could not have known the cause. The reader's
       * first complaint was that the clock arithmetic contradicted itself — 7:05 against 7:15, called
       * a fourteen-minute lag — and called it "the main score cap". The manuscript's times were
       * `murder_time_displayed` and `chime_recorded_time`, both LOCKED FACTS, injected verbatim. The
       * case's own anchors were "a quarter past eight" and "a quarter to nine", and they appear in the
       * manuscript **zero times, in any form**.
       *
       * So the case carried two temporal spines, the prose rendered the one geometry does not track,
       * and every time check that run was reasoning about clock readings that are not in the story.
       * `unaccounted_time` was correctly silent — the page's times ARE accounted for, by those locked
       * facts. Nothing asked the other question.
       *
       * A time model whose anchors never appear is not evidence about the manuscript. This is the
       * A_70/A_71 shape one more time: a measurement of something that is not there.
       *
       * BOTH must be missing before this fires. One anchor absent is ordinary — the true time is often
       * implied by the reveal rather than stated as a clock reading. Neither present means the
       * manuscript is telling a different story about time than the case is.
       */
      {
        const anchors: Array<{ label: string; raw: string }> = [];
        if (geometry.timeModel.apparentTime) anchors.push({ label: "apparent", raw: geometry.timeModel.apparentTime });
        if (geometry.timeModel.trueTime) anchors.push({ label: "true", raw: geometry.timeModel.trueTime });
        if (anchors.length > 0) {
          // An anchor that does not parse is `time_model_unparseable`'s business, not this check's.
          const page = anchorsStatedIn(chapters.map((c) => textOf(c)).join(" "));
          /**
           * BOTH, and the code has to say so as plainly as the comment does.
           *
           * FOUND BY REVIEW, hours after X39 shipped: the first version compared `missing.length` to
           * the parseable count, so a case with ONE parseable anchor that was absent fired the
           * violation — the exact "one anchor absent is ordinary" case the rule exists to permit, and
           * a contradiction between this check's documentation and its behaviour. With fewer than two
           * parseable anchors there is no two-time deception to look for.
           */
          const bothMissing = page.parseable >= 2 && page.stated === 0;
          record({ field: "time_model", code: "time_anchors_absent", chapter: null, verdict: bothMissing ? "unmet" : "met" }, {
            scope: "manuscript",
            message:
              `NEITHER temporal anchor appears in the manuscript — the case declares ` +
              `${anchors.map((a) => `${a.label} "${a.raw}"`).join(" and ")}, and the page states neither. ` +
              `The story is keeping time by some other clock (usually a locked fact the device authored), ` +
              `so every check built on these two anchors is measuring times that are not in the book.`,
          });
        }
      }

      const satisfied = extraTimes.length === 0;
      record({ field: "time_model", code: "unaccounted_time", chapter: null, verdict: satisfied ? "met" : "unmet" }, {
        scope: "manuscript",
        message:
          `The manuscript states ${extraTimes.length} time(s) that nothing in the case accounts for — neither anchor, nor any locked fact: ` +
          extraTimes.map((t) => `"${t.phrase}" (ch${t.chapter})`).join(", ") +
          `. A reader cannot build one sequence of events from clock readings the story never relates.`,
      });
    }
  }

  // X18 — the bound-chapter reveal check uses the disclosure matcher too. Its message says the chapter
  // "owes the reader disclosure", so it must accept the same evidence a reader does; leaving it narrow
  // would keep the false positive alive in `apply` mode, where it would regenerate a chapter that had
  // already told the reader who did it.
  const culpritRe = disclosureMatcher(geometry.culprit);
  const revealChapterNumber = geometry.chapterContract.find((c) => c.role === "reveal")?.chapter ?? null;

  // ── method_signature: present in chapter 1 ────────────────────────────────
  if (geometry.methodSignature && geometry.methodSignature.keyTerms.length > 0 && chapterAt(geometry.methodSignature.plantChapter)) {
    const plantChapter = geometry.methodSignature.plantChapter;
    const text = textOf(chapterAt(plantChapter)).toLowerCase();
    const satisfied = geometry.methodSignature.keyTerms.some((term) => text.includes(needle(term)));
    record({ field: "method_signature", code: "method_signature_absent", chapter: plantChapter, verdict: satisfied ? "met" : "unmet" }, {
      scope: "chapter",
      message:
        `Chapter ${plantChapter} shows no physical sign of the manner of death ("${geometry.methodSignature.method}"). ` +
        `The reveal will name a method the early chapters never physically supported.`,
    });
  }

  // ── clincher: produced in the payoff chapter, planted before it ───────────
  if (geometry.clincher && geometry.clincher.keyTerms.length > 0 && chapterAt(geometry.clincher.payoffChapter)) {
    const { payoffChapter, plantByChapter, keyTerms, trace } = geometry.clincher;

    const payoffText = textOf(chapterAt(payoffChapter)).toLowerCase();
    const payoffSatisfied = keyTerms.some((term) => payoffText.includes(needle(term)));
    record({ field: "clincher", code: "clincher_absent_at_payoff", chapter: payoffChapter, verdict: payoffSatisfied ? "met" : "unmet" }, {
      scope: "chapter",
      message:
        `Chapter ${payoffChapter} produces no decisive physical trace tying the culprit to the act. The contract ` +
        `names one: ${trace}. It exists in the clue set and must be on the page here as proof.`,
    });

    const plantWindow: GeometryChapter[] = [];
    for (let n = 1; n <= plantByChapter; n += 1) {
      const c = chapterAt(n);
      if (c) plantWindow.push(c);
    }
    const plantedBy = plantWindow.some((c) =>
      keyTerms.some((term) => textOf(c).toLowerCase().includes(needle(term))),
    );
    record({ field: "clincher", code: "clincher_not_planted", chapter: plantByChapter, verdict: plantedBy ? "met" : "unmet" }, {
      scope: "chapter",
      message:
        `The decisive trace does not appear anywhere in chapters 1–${plantByChapter}, so its production in the ` +
        `reveal is unearned. It must be on the page early, incidental and unremarked.`,
    });
  }

  // ── chapter_contract ──────────────────────────────────────────────────────
  for (const contract of geometry.chapterContract) {
    const chapter = chapterAt(contract.chapter);
    if (!chapter) continue;
    const paragraphs = paragraphsOf(chapter);
    const text = paragraphs.join("\n\n");

    if (contract.role === "reveal") {
      // "Chapter 9 only points toward Hugo" / "the truth poised to emerge in the hours ahead" — the
      // chapter titled "The Culprit Revealed" performed the wrong hermeneutic morpheme. Disclosure
      // was due; it delivered a suspended answer, and nothing in fourteen stages could tell.
      /**
       * WHO WROTE THE DISCLOSURE? (REVIEW_05 §10.1)
       *
       * A sentence matching an injector template is the pipeline talking to itself. Counting it as
       * `met` certifies template text as a reveal — the false certification §3 warns about — and it
       * is the state the 08-04 run actually shipped in.
       */
      const disclosure = paragraphs.map((p) => disclosingSentence(p, culpritRe)).find((x) => x !== null) ?? null;
      const injected =
        disclosure !== null && (options.injectionTemplates ?? []).some((re) => re.test(disclosure));
      record({
        field: "chapter_contract",
        code: "reveal_culprit_not_named",
        chapter: contract.chapter,
        verdict: disclosure === null ? "unmet" : injected ? "met_by_injection" : "met",
      }, {
        scope: "chapter",
        message: geometry.culprit
          ? `Chapter ${contract.chapter} is the reveal, and no paragraph names ${geometry.culprit} as the person who ` +
            `did it. The chapter owes the reader disclosure, not a further deferral.`
          : `Chapter ${contract.chapter} is the reveal, but the case names no culprit to check it against.`,
      });

      if (geometry.methodSignature && geometry.methodSignature.keyTerms.length > 0) {
        const lower = text.toLowerCase();
        // X15 — `needle(t)`, not `t`. This was the ONE comparison in the file that held a case-model
        // value up against the page without crossing the folding boundary, in the file whose header
        // says every such value does. Unreachable while method key terms are the hardcoded ASCII list
        // in `derive.ts`, and that is exactly why it survived: §6's defect 5 was a fix applied to one
        // side of a comparison, and a boundary with one exception is a boundary that will grow more.
        const methodStated =
          geometry.methodSignature.keyTerms.some((t) => lower.includes(needle(t).toLowerCase())) ||
          lower.includes(needle(geometry.methodSignature.method).toLowerCase());
        record({ field: "chapter_contract", code: "reveal_method_absent", chapter: contract.chapter, verdict: methodStated ? "met" : "unmet" }, {
          scope: "chapter",
          message: `Chapter ${contract.chapter} does not state how the murder was physically done.`,
        });
      }

      const motiveStated = MOTIVE_MARKER.test(text);
      record({ field: "chapter_contract", code: "reveal_motive_absent", chapter: contract.chapter, verdict: motiveStated ? "met" : "unmet" }, {
        scope: "chapter",
        message: `Chapter ${contract.chapter} does not state why the culprit did it.`,
      });

      /**
       * X44 — THE TWO TIMES, SIDE BY SIDE, IN THE CHAPTER THAT OWES THE ANSWER.
       *
       * This is the 08-06 cold read's second named gap, and the only one of its two that was never
       * built. That run scored 86 and hit best-ever in all ten categories; its reader asked for one
       * thing beyond tightening chapter 10:
       *
       *   "the true murder window could be stated in one crisp line: 'The clock showed 10:45, but the
       *    true time was 10:55.'"
       *
       * The reveal contract required the culprit named, the method, the motive and the decisive trace,
       * and said NOTHING about the clock — so a manuscript could satisfy every disclosure obligation
       * while leaving the reader to do the subtraction. In a story whose whole deception is temporal,
       * that is the one arithmetic the disclosure exists to perform.
       *
       * WHY THIS IS THE REVEAL'S JOB AND NOT THE PAGE'S. X39 already asks whether the anchors reach the
       * manuscript at all, and answers a CASE question — its repair is to the case, which is why it is
       * excused from prose repair. This asks whether the chapter that discloses puts them together, and
       * that is a prose defect with an obvious prose repair.
       *
       * DELIBERATELY GATED ON X39. If neither anchor appears anywhere in the book, the case is keeping
       * time by another clock and X39 owns the finding; firing here as well would report one defect
       * twice and aim a chapter rewrite at a chapter that cannot be rewritten into coherence. So this
       * fires only when the manuscript DOES state its times and the reveal is where they failed to meet.
       *
       * BOTH must parse, for X39's reason: with fewer than two anchors there is no two-time deception,
       * and "state both" is not an obligation a one-anchor case can owe.
       */
      {
        const inReveal = anchorsStatedIn(text);
        if (inReveal.parseable >= 2) {
          const onThePage = anchorsStatedIn(chapters.map((c) => textOf(c)).join(" "));
          const x39Owns = onThePage.stated === 0;
          const bothStated = inReveal.stated >= 2;
          record(
            { field: "chapter_contract", code: "reveal_times_not_stated", chapter: contract.chapter, verdict: bothStated || x39Owns ? "met" : "unmet" },
            {
              scope: "chapter",
              message:
                `Chapter ${contract.chapter} is the reveal and states ${inReveal.stated} of the case's two times ` +
                `(apparent "${geometry.timeModel.apparentTime}", true "${geometry.timeModel.trueTime}"). This ` +
                `case stages one hour and hides another, so its disclosure owes the reader both in the ` +
                `same passage, related to each other — the time the staged evidence showed, and the time ` +
                `the death actually happened. Without them the reader is left to do the subtraction the ` +
                `chapter exists to perform.`,
            },
          );
        }
      }
    }

    if (contract.role === "aftermath") {
      // Genette's unmotivated REPEATING NARRATION, in the exact technical sense: telling n times what
      // happened once. Nothing in the pipeline detects a repeated EVENT — AtmosphereRepair detects
      // repeated PHRASES, which is a different thing entirely.
      const offending = detectAftermathRepeatParagraphs(paragraphs, {
        culprit: geometry.culprit,
        methodTerms: geometry.methodSignature?.keyTerms ?? [],
      });
      const satisfied = offending.length === 0;
      record({ field: "chapter_contract", code: "aftermath_repeat", chapter: contract.chapter, verdict: satisfied ? "met" : "unmet" }, {
        scope: "chapter",
        paragraphIndices: offending,
        message:
          `Chapter ${contract.chapter} is aftermath and re-delivers what chapter ${revealChapterNumber ?? contract.chapter - 1} already ` +
          `disclosed in ${offending.length} paragraph(s). Aftermath owes consequence and reaction — not the ` +
          `solution a second time.`,
      });
    }

    if (contract.role === "false_solution" && geometry.falseSolution.accused) {
      const accusedRe = nameMatcher(geometry.falseSolution.accused);
      const accusesTheInnocent = accusedRe ? paragraphs.some((p) => accusedRe.test(p)) : false;
      record(
        { field: "false_solution", code: "false_solution_absent", chapter: contract.chapter, verdict: accusesTheInnocent ? "met" : "unmet" },
        {
          scope: "chapter",
          message: `Chapter ${contract.chapter} carries the false solution but never puts ${geometry.falseSolution.accused} in the frame.`,
        },
      );
    }
  }

  // ── clearance_budget ──────────────────────────────────────────────────────
  // "The clearances are logical but too mechanical" / "the Eleanor-alibi section is validation logic,
  // not story". A register of exonerations in the endgame reads as the machine talking.
  {
    const endgame = geometry.chapterContract
      .filter((c) => c.role === "reveal" || c.role === "aftermath")
      .map((c) => c.chapter);
    for (const chapterNumber of endgame) {
      const chapter = chapterAt(chapterNumber);
      if (!chapter) continue;
      /**
       * COUNT EXONERATIONS, NOT ARGUED ONES.
       *
       * FOUND 2026-08-04 against real manuscripts. This required a clearance word AND an evidence
       * connector IN THE SAME SENTENCE — and that had the test exactly backwards. Story 1810's
       * chapter 9, the register an external reviewer called "validation logic, not story", reads:
       *
       *     "You are cleared."  "You are ruled out."  "You could not have done it."
       *
       * Three bare verdicts, and the detector scored them ZERO — because a bare verdict cites no
       * evidence. The conjunct was selecting the clearances that at least show their reasoning while
       * missing the ones that are pure assertion, which are the whole complaint ("logical but too
       * mechanical", and complaint #1's "Sylvia, being the victim, obviously couldn't have been
       * involved").
       *
       * The budget is about how much of the endgame is spent exonerating people. That is a count of
       * clearances, full stop. On the corpus this now reads 1810 ch9=3 and ch10=11 (both over), and
       * the 08-04 run's ch9=2 (within budget — its clearances are dramatized in dialogue, which is
       * what `inScene` asks for).
       */
      const registerSentences = sentencesOf(textOf(chapter)).filter(isClearanceSentence);
      const satisfied = registerSentences.length <= geometry.clearanceBudget.maxSentences;
      record({ field: "clearance_budget", code: "clearance_over_budget", chapter: chapterNumber, verdict: satisfied ? "met" : "unmet" }, {
        scope: "chapter",
        message:
          `Chapter ${chapterNumber} spends ${registerSentences.length} sentences clearing suspects against a budget of ` +
          `${geometry.clearanceBudget.maxSentences}. Elimination belongs in scene, or in one sentence — never as a register. ` +
          `First: ${registerSentences.slice(0, 3).map((s) => `"${s.slice(0, 70)}"`).join(" / ")}`,
      });
    }
  }

  const manuscriptDisclosure = findManuscriptDisclosure(chapters, geometry.culprit, options.injectionTemplates ?? []);

  /**
   * X24 — settle N4's pre-prose guess against the finished manuscript.
   *
   * `checkRevealBinding` runs at DERIVE time, before any prose exists, so all it can do is compare a
   * beat label against a chapter TITLE. It has now fired on two runs whose binding was correct
   * (REVIEW_05 §34.1), and because it feeds `revealBindingUncertain` onto the run diagnostic it was
   * telling readers to distrust a binding that was right.
   *
   * Once the manuscript exists the question is no longer a guess: the contract bound a chapter, and
   * `manuscriptDisclosure` says which chapter actually discloses. Reporting that comparison turns a
   * hunch into a fact, which is the move X11 already made for the disclosure verdict itself.
   *
   * `not_measurable` when the case names no culprit — never "confirmed", because an unanswerable
   * question is not a passing one (§13.3's rule, third application).
   */
  const revealBinding: GeometryAcceptanceReport["revealBinding"] =
    revealChapterNumber === null
      ? { boundChapter: null, disclosureChapter: manuscriptDisclosure?.chapter ?? null, verdict: "not_measurable" }
      : manuscriptDisclosure === null || manuscriptDisclosure.chapter === null
        ? { boundChapter: revealChapterNumber, disclosureChapter: null, verdict: "not_measurable" }
        : {
            boundChapter: revealChapterNumber,
            disclosureChapter: manuscriptDisclosure.chapter,
            verdict: manuscriptDisclosure.chapter === revealChapterNumber ? "confirmed" : "refuted",
          };

  return {
    violations,
    checks,
    extraTimes,
    // Story-level, deliberately not derived from the reveal check above — see the function's header.
    manuscriptDisclosure,
    revealBinding,
  };
};

/** Chapter-local violations — the ones a scoped regeneration can act on. */
export const chapterScopedViolations = (report: GeometryAcceptanceReport): GeometryViolation[] =>
  report.violations.filter((v) => v.scope === "chapter" && v.chapter !== null);
