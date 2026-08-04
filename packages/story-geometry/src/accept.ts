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

export const nameMatcher = (name: string): RegExp | null => {
  const full = needle(name).trim();
  if (!full) return null;
  const parts = full.split(/\s+/);
  const surname = parts[parts.length - 1] ?? "";
  const alternatives = [escapeRe(full)];
  if (parts.length > 1 && surname.length >= 4 && !COMMON_WORD_SURNAMES.has(surname.toLowerCase())) {
    alternatives.push(escapeRe(surname));
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
 */
const GUILT_MARKER =
  /\b(?:killed|murdered|strangled|poisoned|stabbed|shot|bludgeoned|smothered|is\s+(?:the|our|your)\s+(?:murderer|killer|culprit)|was\s+(?:the|our)\s+(?:murderer|killer|culprit)|committed\s+the\s+murder|confess(?:ed|es|ion)|guilty|arrested?|took\s+the\s+life|(?:was|is|were|had\s+been|held)\s+responsible|to\s+blame)\b/i;

const MOTIVE_MARKER =
  /\b(?:motive|because|in\s+order\s+to|so\s+that|to\s+protect|to\s+conceal|to\s+silence|revenge|inheritance|blackmail|jealous(?:y)?|ruin|debt|disgrace|exposure)\b/i;

const CONCEALMENT_MARKER =
  /\b(?:staged|rigged|faked|forged|contrived|tampered|set\s+the\s+(?:clock|hands)|moved\s+the\s+hands|wound\s+the\s+clock|deception|concealment|alibi\s+was\s+manufactured)\b/i;

const CLEARANCE_MARKER =
  /\b(?:cleared|ruled\s+out|eliminated|in\s+the\s+clear|not\s+the\s+(?:culprit|killer|murderer)|innocent|alibi\s+(?:holds|held|is\s+confirmed|checks\s+out)|could\s+not\s+have\s+(?:done|killed))\b/i;


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
 * A paragraph offends when it names the culprit as a discovery, or when it stacks two or more
 * restatements — the method, the concealment, a motive-plus-guilt clause, a suspect clearance. One
 * alone is fair: the aftermath may mention that a man was arrested. Two is the case being re-argued.
 */
export const detectAftermathRepeatParagraphs = (
  paragraphs: ReadonlyArray<string>,
  args: { culprit?: string | null; methodTerms?: ReadonlyArray<string> },
): number[] => {
  const culpritRe = args.culprit ? nameMatcher(args.culprit) : null;
  const methodTerms = (args.methodTerms ?? []).map((t) => needle(t).toLowerCase()).filter(Boolean);
  const offending: number[] = [];
  paragraphs.forEach((paragraph, index) => {
    const text = foldTypography(String(paragraph ?? ""));
    const namesCulpritAsDiscovery = namesCulpritAsGuilty(text, culpritRe);
    const restatements = [
      methodTerms.some((t) => text.toLowerCase().includes(t)),
      CONCEALMENT_MARKER.test(text),
      MOTIVE_MARKER.test(text) && GUILT_MARKER.test(text),
      CLEARANCE_MARKER.test(text),
    ].filter(Boolean).length;
    if (namesCulpritAsDiscovery || restatements >= 2) offending.push(index);
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
const namesCulpritAsGuilty = (text: string, culpritRe: RegExp | null): boolean =>
  disclosingSentence(text, culpritRe) !== null;

/**
 * The sentence that satisfies the disclosure obligation, or null. Returned rather than a boolean so
 * the caller can ask WHO WROTE IT — a template match makes the difference between `met` and
 * `met_by_injection` (REVIEW_05 §10.1).
 */
const disclosingSentence = (text: string, culpritRe: RegExp | null): string | null => {
  if (!culpritRe) return null;
  return sentencesOf(text).find((sentence) => culpritRe.test(sentence) && GUILT_MARKER.test(sentence)) ?? null;
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
    const allowed = new Set<number>();
    for (const raw of [
      geometry.timeModel.trueTime,
      geometry.timeModel.apparentTime,
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
    if (allowed.size === 0) {
      record({ field: "time_model", code: "time_model_unparseable", chapter: null, verdict: "unmet" }, {
        scope: "manuscript",
        message:
          "Neither temporal anchor parses as a clock time, so exclusivity cannot be checked against the page. " +
          "The manuscript may contain any number of times and nothing would notice.",
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

  const culpritRe = geometry.culprit ? nameMatcher(geometry.culprit) : null;
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
        const methodStated =
          geometry.methodSignature.keyTerms.some((t) => lower.includes(t)) ||
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
      const registerSentences = sentencesOf(textOf(chapter)).filter((s) => CLEARANCE_MARKER.test(s));
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

  return { violations, checks, extraTimes };
};

/** Chapter-local violations — the ones a scoped regeneration can act on. */
export const chapterScopedViolations = (report: GeometryAcceptanceReport): GeometryViolation[] =>
  report.violations.filter((v) => v.scope === "chapter" && v.chapter !== null);
