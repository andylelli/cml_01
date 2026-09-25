/**
 * PROSE ENGINE v2 — THE EDITOR AND ITS GUARDS (ANALYSIS_99 §10.8).
 *
 * ── THE ONE PLACE PROSE CHANGES AFTER IT IS WRITTEN ──────────────────────────────────────────────
 *
 * L1: no deterministic pass writes or rewrites a sentence. v1 has about ten that do, and A_84 traced
 * EVERY "generated line" an external reader has ever named to one of them — 95 time-value
 * injections across 29 books, 95 of 95 with the value already on the page; a culprit-evidence
 * template that is the last line of six novels; a clue paste that fired on 8 of 10 chapters of the
 * last completed run. WP-001 §4.3 named the ratchet: three of six reviewer-named lines were
 * themselves fixes for earlier reviewer-named lines.
 *
 * So v2 changes prose in exactly one way: an LLM returns an EDIT LIST of find/replace pairs, and
 * each pair is applied on its own under `mutateThenValidate` with the guards below. An edit that
 * breaks anything is reverted alone, and the rest of the list still lands.
 *
 * ── THE GUARDS ARE THE LIST OF THINGS THIS PROJECT HAS BROKEN BY EDITING ─────────────────────────
 *
 *   lockedValuesIntact    A_90 §11.2: a repetition pass paraphrased a locked clock and the book said
 *                         "froze at three past midnight past three".
 *   clockValuesIntact     the same defect measured as arithmetic rather than as text.
 *   castNamesIntact       A_89 C1: the phrase splice lowercased a surname — "Nora gaunt let a
 *                         flicker of amusement" — quoted by a reader as generator scaffolding.
 *   clueCoverageNotWorse  A_90 §13: a pass that removed "repetition" removed the reveal's own
 *                         evidence and the book came back with two rubric caps.
 *   noNewScaffold         the ratchet: an edit that introduces a template is the next complaint.
 *   noMalformedSplice     A_96 F4: "You; searching for blame in the shadowed places".
 *   noNewDuplicate        run 98dec72a: a speech closed, then restarted word for word after a stray
 *                         quotation mark in the same paragraph. A replacement that restates the
 *                         text beside it raises names, clue terms and length, so no other guard fell.
 *   registerNotWorse      register is the only validated predictor; an edit may not spend it.
 *   lengthWithin          A_94 §6: a wording read as a diet took the book 17% shorter.
 */

import { mutateThenValidate } from "@cml/prose-guard";
import type { Validator } from "@cml/prose-guard";
import { extractClockValues } from "@cml/cml";

import { bookRegisterRate } from "./findings.js";
import { repeatedRuns, splitSentences } from "./sentences.js";
import type { EditList, EditOutcome, Finding, GuardName, ProseChapterLike, SceneContract } from "./types.js";

const normalise = (text: string): string => String(text ?? "").replace(/\s+/g, " ").trim();

const bodyOf = (chapter: ProseChapterLike): string => (chapter.paragraphs ?? []).join("\n\n");

const wordCount = (chapter: ProseChapterLike): number =>
  bodyOf(chapter).split(/\s+/).filter(Boolean).length;

/** Clock dials in a chapter, sorted — the arithmetic, not the wording. */
const dialsOf = (chapter: ProseChapterLike): string =>
  extractClockValues(bodyOf(chapter))
    .map((v) => v.dial)
    .sort((a, b) => a - b)
    .join(",");

const countOccurrences = (haystack: string, needle: string): number => {
  if (!needle) return 0;
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
};

/** A_96 F4's shapes, plus the two older ones. A splice that produces any of these is reverted. */
const MALFORMED_PATTERNS: ReadonlyArray<RegExp> = [
  /\b(?:you|i|we|they|he|she|it|who|that|there|what);\s+\w+ing\b/i,
  /\b[A-Z][a-z]+ s [a-z]/,
  /\b(the|a|an|of|in|on|at|to|with|by)\s+\1\b/i,
  /\b(?:his|her|its|their|my|our|your)\s+(?:he|she|it|they|we|i|you)\b/i,
  /\s,|\s\.|\(\s*\)/,
];

/** Sentences of eight words or more that occur more than once in the chapter, with their counts. */
const duplicatedSentences = (body: string): Map<string, number> => {
  const seen = new Map<string, number>();
  for (const sentence of splitSentences(normalise(body))) {
    if (sentence.split(/\s+/).length < 8) continue;
    const key = sentence.toLowerCase();
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  // §06.8: the near-copies no sentence match sees — a doubled clause, a line said twice.
  for (const paragraph of body.split(/\n\n/)) {
    for (const run of repeatedRuns(paragraph)) seen.set(`run: ${run}`, 2);
  }
  return new Map([...seen].filter(([, count]) => count > 1));
};

const SCAFFOLD_RE =
  /\b(clue_[a-z0-9_]+|act_?\d+|scene_?\d+|prose_requirements|hidden_model|locked[_ ]fact|validator|contract)\b/i;

export interface GuardContext {
  scene?: SceneContract;
  lockedValues: ReadonlyArray<string>;
  castNames: ReadonlyArray<string>;
  /** How far a chapter may move from its original length before an edit is refused. */
  lengthTolerance?: number;
}

/**
 * Each guard as a NUMBER, higher being better.
 *
 * The first cut had one composite score and attributed a rollback to whichever violation was new —
 * which named nothing at all when an edit was reverted for a score fall with no new violation, the
 * commonest case (deleting a cast name, gutting a clue's key terms). A rollback tally that cannot say
 * which guard fired is a tally nobody can act on, and this project has shipped that too: the polish
 * pass recorded 39 of 72 rollbacks as the word "validation_regression" and every proposal to fix the
 * polish prompt was a guess until A_86 item 23 carried the detail out.
 */
export const measureGuards = (
  chapter: ProseChapterLike,
  context: GuardContext,
): Record<GuardName, number> => {
  const body = bodyOf(chapter);
  const lowered = body.toLowerCase();
  return {
    lockedValuesIntact: context.lockedValues.reduce((n, v) => n + countOccurrences(body, v), 0),
    clockValuesIntact: extractClockValues(body).length,
    castNamesIntact: context.castNames.reduce((n, name) => n + countOccurrences(body, name), 0),
    clueCoverageNotWorse: (context.scene?.mustSurface ?? []).reduce(
      (n, surface) => n + surface.keyTerms.filter((t) => lowered.includes(t)).length,
      0,
    ),
    noNewScaffold: -(body.match(new RegExp(SCAFFOLD_RE.source, "gi")) ?? []).length,
    noMalformedSplice: -MALFORMED_PATTERNS.filter((re) => re.test(body)).length,
    noNewDuplicate: -[...duplicatedSentences(body).values()].reduce((n, c) => n + (c - 1), 0),
    registerNotWorse: -Math.round(bookRegisterRate([chapter]) * 1_000),
    lengthWithin: wordCount(chapter),
  };
};

/** The guards that may never fall. `lengthWithin` is a tolerance, not a floor, so it is handled apart. */
const NEVER_FALL: GuardName[] = [
  "lockedValuesIntact",
  "clockValuesIntact",
  "castNamesIntact",
  "clueCoverageNotWorse",
  "noNewScaffold",
  "noMalformedSplice",
  "noNewDuplicate",
  "registerNotWorse",
];

/**
 * The guards as one validator, for `mutateThenValidate` — the law's door (L2). Its score is the sum
 * of the measurements, so any fall reverts; `measureGuards` is what then says WHICH.
 */
export const buildGuards = (context: GuardContext): { validator: Validator<ProseChapterLike>; names: GuardName[] } => {
  const validator: Validator<ProseChapterLike> = (chapter) => {
    const measures = measureGuards(chapter, context);
    const violations: string[] = [];
    if (measures.noNewScaffold < 0) violations.push("noNewScaffold");
    if (measures.noMalformedSplice < 0) violations.push("noMalformedSplice");
    // A VIOLATION per duplicated sentence, not only a score: the score is a sum, and a splice that
    // repeats a sentence with a name in it raises `castNamesIntact` by exactly what it takes from
    // this guard. One string per sentence, so a repair removes a string and a new copy adds one.
    for (const key of duplicatedSentences(bodyOf(chapter)).keys()) {
      violations.push(`noNewDuplicate: "${key.slice(0, 60)}"`);
    }
    for (const value of context.lockedValues) {
      if (!bodyOf(chapter).includes(value)) violations.push(`lockedValuesIntact: "${value}" absent`);
    }
    const score = NEVER_FALL.reduce((sum, name) => sum + measures[name], 0);
    return { ok: violations.length === 0, score, violations };
  };
  return { validator, names: [...NEVER_FALL, "lengthWithin"] };
};

/** Which guard fell between two measurements. Exact, because the tally is only useful if it is. */
export const guardThatFell = (
  before: Record<GuardName, number>,
  after: Record<GuardName, number>,
): GuardName | null => {
  for (const name of NEVER_FALL) {
    if (after[name] < before[name]) return name;
  }
  return null;
};

export interface ApplyOptions extends GuardContext {
  /** Findings this list addresses, so the survivors can be reported. */
  findings: ReadonlyArray<Finding>;
}

/**
 * Apply an edit list to one chapter, ONE EDIT AT A TIME.
 *
 * Cumulative on success: each edit is validated against the chapter as the previous edits left it,
 * so a list cannot pass individually and fail together. A `find` that does not match exactly once is
 * skipped and counted — an editor that cannot locate its own quote has not earned a guess.
 */
export const applyEditList = (
  chapter: ProseChapterLike,
  list: EditList,
  options: ApplyOptions,
): { chapter: ProseChapterLike; outcome: EditOutcome } => {
  const { validator } = buildGuards(options);
  const originalWords = wordCount(chapter);
  const originalDials = dialsOf(chapter);
  const tolerance = options.lengthTolerance ?? 0.15;

  let current = chapter;
  let applied = 0;
  let skipped = 0;
  const rolledBack: Partial<Record<GuardName, number>> = {};
  const addressed = new Set<number>();

  for (const edit of list.edits ?? []) {
    const find = String(edit?.find ?? "");
    const replace = String(edit?.replace ?? "");
    if (!find) {
      skipped += 1;
      continue;
    }
    const body = bodyOf(current);
    /**
     * The quote must occur once in the chapter AND live inside one paragraph.
     *
     * `bodyOf` joins paragraphs with a blank line and the replacement runs PER PARAGRAPH, so a
     * `find` that spans a paragraph break passes a body-level uniqueness check and then matches no
     * paragraph at all. MEASURED 2026-09-19: such an edit returned `applied: 1, skipped: 0,
     * rolledBack: {}, unresolved: 0` with the text byte-identical — counted as a repair, marking its
     * finding resolved, having changed nothing. Every `applied` and `unresolved` this engine has
     * reported was measured with that ruler.
     */
    const paragraphsWithFind = (current.paragraphs ?? []).filter((p) => p.includes(find));
    if (countOccurrences(body, find) !== 1 || paragraphsWithFind.length !== 1) {
      skipped += 1;
      continue;
    }

    const mutate = (input: ProseChapterLike): ProseChapterLike => ({
      ...input,
      paragraphs: (input.paragraphs ?? []).map((p) => (p.includes(find) ? p.replace(find, replace) : p)),
    });

    const before = measureGuards(current, options);
    const outcome = mutateThenValidate(current, mutate, validator);
    if (!outcome.applied || outcome.reverted) {
      const guard = guardThatFell(before, measureGuards(mutate(current), options)) ?? "registerNotWorse";
      rolledBack[guard] = (rolledBack[guard] ?? 0) + 1;
      continue;
    }

    // The two whole-chapter guards, which only make sense against the chapter as it started.
    const candidate = outcome.value;
    if (dialsOf(candidate) !== originalDials) {
      rolledBack.clockValuesIntact = (rolledBack.clockValuesIntact ?? 0) + 1;
      continue;
    }
    const moved = Math.abs(wordCount(candidate) - originalWords) / Math.max(1, originalWords);
    if (moved > tolerance) {
      rolledBack.lengthWithin = (rolledBack.lengthWithin ?? 0) + 1;
      continue;
    }

    // Belt and braces: an edit that leaves the chapter byte-identical is not a repair, whatever
    // route it took to get here. It is counted as skipped so the tally stays honest.
    if (bodyOf(candidate) === body) {
      skipped += 1;
      continue;
    }

    current = candidate;
    applied += 1;
    for (const index of edit.addresses ?? []) addressed.add(index);
  }

  const unresolved = options.findings.filter((_, index) => !addressed.has(index));
  const declined = (list.cannot ?? [])
    .filter((c) => c.finding >= 0 && c.finding < options.findings.length && c.why)
    .map((c) => ({ finding: c.finding, why: c.why }));
  return { chapter: current, outcome: { applied, skipped, rolledBack, unresolved, declined } };
};

/**
 * The editor's prompt for one chapter. It sees the whole book for context and changes one chapter,
 * and it returns an edit list — never a rewritten chapter, because a rewritten chapter is a new
 * draft that nothing has selected.
 */
export const buildEditorPrompt = (args: {
  chapter: ProseChapterLike;
  chapterNumber: number;
  findings: ReadonlyArray<Finding>;
  scene?: SceneContract;
}): string => {
  const lines: string[] = [];
  lines.push(`Chapter ${args.chapterNumber} of a finished Golden Age detective novella needs specific repairs.`);
  lines.push("");
  lines.push("WHAT IS WRONG — each one quotes the text it is about:");
  args.findings.forEach((f, index) => {
    lines.push(`  ${index + 1}. [${f.class}] ${f.note}`);
    lines.push(`     "${f.quote}"`);
  });
  if (args.scene) {
    lines.push("");
    lines.push("WHAT THIS CHAPTER OWES, which every repair must leave standing:");
    for (const surface of args.scene.mustSurface) {
      lines.push(`  the reader can use: ${surface.observable || surface.keyTerms.join(", ")}`);
    }
    for (const withheld of args.scene.mustNotReveal.filter((w) => w.what === "culprit")) {
      lines.push(`  the culprit is named in chapter ${withheld.until}, not here`);
    }
  }
  lines.push("");
  lines.push("RETURN AN EDIT LIST, and nothing else:");
  lines.push('  {"edits":[{"find":"","replace":"","addresses":[1]}],"cannot":[{"finding":1,"why":""}]}');
  lines.push("");
  lines.push("  `find` is copied exactly from the chapter and occurs there once. Keep every locked");
  lines.push("  value, every clock time and every name exactly as they stand. Where a repair would");
  lines.push("  cost the chapter something it owes, put it in `cannot` with the reason.");
  lines.push("");
  lines.push(`THE CHAPTER`);
  for (const paragraph of args.chapter.paragraphs ?? []) {
    lines.push("");
    lines.push(paragraph);
  }
  return lines.join("\n");
};

/** Parse an editor reply. Total: an unreadable reply is an empty list, never an exception. */
export const parseEditList = (raw: string): EditList => {
  try {
    const text = String(raw ?? "");
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end <= start) return { edits: [], cannot: [] };
    const parsed = JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
    const edits = Array.isArray(parsed.edits) ? parsed.edits : [];
    const cannot = Array.isArray(parsed.cannot) ? parsed.cannot : [];
    return {
      edits: edits
        .map((e) => {
          const entry = e as Record<string, unknown>;
          return {
            find: String(entry?.find ?? ""),
            replace: String(entry?.replace ?? ""),
            addresses: Array.isArray(entry?.addresses)
              ? (entry.addresses as unknown[]).map((n) => Number(n) - 1).filter((n) => Number.isFinite(n) && n >= 0)
              : [],
          };
        })
        .filter((e) => e.find.length > 0),
      cannot: cannot
        .map((c) => {
          const entry = c as Record<string, unknown>;
          return { finding: Number(entry?.finding) - 1, why: normalise(String(entry?.why ?? "")) };
        })
        .filter((c) => Number.isFinite(c.finding)),
    };
  } catch {
    return { edits: [], cannot: [] };
  }
};

/** One line for the run report. */
export const summariseEdits = (outcomes: ReadonlyArray<EditOutcome>): string => {
  const applied = outcomes.reduce((n, o) => n + o.applied, 0);
  const skipped = outcomes.reduce((n, o) => n + o.skipped, 0);
  const rolled = outcomes.reduce<Record<string, number>>((acc, o) => {
    for (const [guard, count] of Object.entries(o.rolledBack)) acc[guard] = (acc[guard] ?? 0) + (count ?? 0);
    return acc;
  }, {});
  const rolledText = Object.entries(rolled)
    .sort((a, b) => b[1] - a[1])
    .map(([guard, count]) => `${guard} ${count}`)
    .join(", ");
  const unresolved = outcomes.reduce((n, o) => n + o.unresolved.length, 0);
  const declined = outcomes.reduce((n, o) => n + (o.declined?.length ?? 0), 0);
  return (
    `applied ${applied}, skipped ${skipped} (no unique match), rolled back ` +
    `${Object.values(rolled).reduce((a, b) => a + b, 0)}${rolledText ? ` [${rolledText}]` : ""}, ` +
    `unresolved ${unresolved}${declined > 0 ? `, declined ${declined}` : ""}`
  );
};
