/**
 * PROSE ENGINE v2 — THE WRITER'S OUTPUT FORMAT (ANALYSIS_99 §10.5).
 *
 * ── WHY DELIMITED TEXT AND NOT JSON ──────────────────────────────────────────────────────────────
 *
 * v1 asks for the chapters as a JSON object and pays for it: five `jsonrepair` call sites, ~55
 * coercion sites, and a whole class of failure where a 25,000-token JSON string loses a brace and the
 * run reports a schema error for a TRUNCATION (A_88 found exactly that on run
 * `mystery-1789105355374`, where both Agent 7 attempts were cut mid-string and the guard could not
 * fire because an absent `finish_reason` defaults to `"stop"`).
 *
 * A delimiter cannot corrupt a paragraph. The parser below reads `=== CHAPTER N: title ===`, and its
 * truncation test is STRUCTURAL — the chapters it was promised against the chapters it found, and
 * whether the last one ends on a terminator — so it does not depend on the provider telling the
 * truth about why it stopped. `finishReasonPresent` (built in A_88) is a second opinion, never the
 * first.
 *
 * ── AND WHY A CONTINUE RATHER THAN A REDRAFT ─────────────────────────────────────────────────────
 *
 * A truncated segment has already paid for the chapters it did finish. v1 throws the batch away and
 * re-runs it with an escalated temperature; v2 keeps what parsed and asks for the rest, with the
 * accepted chapters as prior text. That is the difference between paying twice and paying once.
 */

import type { Draft, ProseChapterLike } from "./types.js";

/** The one delimiter. Tolerant of extra hashes, colons and whitespace; strict about the number. */
const CHAPTER_HEADER_RE = /^[\s#*]*={2,}\s*CHAPTER\s+(\d+)\s*:?\s*(.*?)\s*={2,}[\s*]*$/i;

/** A looser second pass, for a writer that drops the trailing rule. Only used when the strict one finds nothing. */
const LOOSE_HEADER_RE = /^[\s#*]*(?:={2,}\s*)?CHAPTER\s+(\d+)\s*[:—-]\s*(.+?)\s*(?:={2,})?[\s*]*$/i;

export interface ParseResult extends Draft {
  /** Headers the parser saw that named a chapter outside the segment. */
  unexpected: number[];
}

const endsMidSentence = (paragraphs: string[]): boolean => {
  const last = paragraphs[paragraphs.length - 1] ?? "";
  if (!last) return true;
  return !/[.!?…"'”’)]\s*$/.test(last.trim());
};

/**
 * Parse a writer reply into chapters. Never throws: a reply this cannot read at all is a draft with
 * no chapters, which the backstop treats as an empty attempt rather than an exception.
 */
export const parseWriterOutput = (
  raw: string,
  expected: ReadonlyArray<number>,
  segment = 0,
  attempt = 1,
): ParseResult => {
  const lines = String(raw ?? "").split(/\r?\n/);
  const expectedSet = new Set(expected);

  const collect = (pattern: RegExp): Array<{ chapter: number; title: string; body: string[] }> => {
    const out: Array<{ chapter: number; title: string; body: string[] }> = [];
    let current: { chapter: number; title: string; body: string[] } | null = null;
    for (const line of lines) {
      const match = pattern.exec(line);
      if (match) {
        if (current) out.push(current);
        current = { chapter: Number(match[1]), title: String(match[2] ?? "").trim(), body: [] };
        continue;
      }
      if (current) current.body.push(line);
    }
    if (current) out.push(current);
    return out;
  };

  let found = collect(CHAPTER_HEADER_RE);
  if (found.length === 0) found = collect(LOOSE_HEADER_RE);

  const toParagraphs = (body: string[]): string[] =>
    body
      .join("\n")
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter(Boolean);

  const unexpected = found
    .map((entry) => entry.chapter)
    .filter((chapter) => Number.isFinite(chapter) && !expectedSet.has(chapter));

  // Order is the CONTRACT's, not the reply's: a writer that emits 5 before 4 has not written a
  // different book, and ordering here is lossless where re-asking is not. The first header for a
  // chapter wins, so a writer that repeats one does not overwrite what it already wrote.
  const wanted = [...expectedSet].sort((a, b) => a - b);
  const chapters: ProseChapterLike[] = [];
  const seen = new Set<number>();
  for (const chapter of wanted) {
    const entry = found.find((f) => f.chapter === chapter);
    if (!entry) continue;
    const paragraphs = toParagraphs(entry.body);
    if (paragraphs.length === 0) continue;
    seen.add(chapter);
    chapters.push({ title: entry.title, number: chapter, paragraphs });
  }

  const missing = wanted.filter((chapter) => !seen.has(chapter));
  const last = chapters[chapters.length - 1];
  const truncated = missing.length > 0 || (last !== undefined && endsMidSentence(last.paragraphs));

  return { segment, attempt, chapters, truncated, missing, unexpected };
};

/**
 * The format instruction the writer is given. Structure only — it names no wording, quotes no prose,
 * and shows no example sentence, because A_67 is unambiguous that an example is a template.
 */
export const writerFormatInstruction = (chapters: ReadonlyArray<number>): string =>
  [
    "Write the chapters below, in order, as plain prose.",
    "",
    "Begin each one with a line of exactly this shape, and nothing else on that line:",
    "",
    "=== CHAPTER <number>: <the chapter's title> ===",
    "",
    "Separate paragraphs with a blank line. Use no other headings, no numbering inside a chapter, no",
    "notes to the reader and no commentary about the writing.",
    "",
    `Chapters owed: ${chapters.join(", ")}.`,
  ].join("\n");

/** The ask for a continuation: what was accepted, and what is still owed. */
export const continueInstruction = (
  accepted: ReadonlyArray<number>,
  remaining: ReadonlyArray<number>,
): string =>
  [
    `Chapters ${accepted.join(", ") || "(none)"} are written and are above, in full.`,
    `Continue with ${remaining.join(", ")}, in the same format and the same voice.`,
    "Start at the chapter header. Repeat nothing that is already written.",
  ].join("\n");
