/**
 * A_94 — `AGENT9_REPEAT_BAN_LIST`. Phrases this book has already used, as a countable ban.
 *
 * The 80/100 read of run 31372 listed six "generated" phrases. Five were not templates: they were
 * the model's own sentences, copied chapter to chapter — "Relief flickered" ×8, "the chain of
 * evidence drew taut" ×4, "she tucked a stray lock of hair behind her ear" ×9, exactly once in nine
 * of ten chapters. The copy channel is STORY TO DATE, which carries every prior chapter verbatim
 * (A_90 §12 #7: 16 of 24 copies came from the immediately preceding chapter). `AtmosphereRepair`
 * scrubs some of this after the fact and authored 5 of the last 20 reader-flagged lines doing it.
 *
 * This is the other end of the same lever: BEFORE the chapter is written, the six-word runs that
 * already repeat across the prior chapters are listed as things not to write. A ban list is an
 * operation (the tic-template ban went 23% → 0 of 7); a rate ("vary your phrasing") is not.
 *
 * LOCKED VALUES ARE EXEMPT. Repetition of a locked fact is mandated and harmless (A_90 §12); a span
 * containing a locked value of two or more words is never listed.
 */
import type { ProseChapter } from "./types.js";

export const isRepeatBanEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_REPEAT_BAN_LIST ?? "").trim());

/** Same normalisation as prose-guard's repetition instrument, so the two agree on what a span is. */
const normalise = (text: string): string[] =>
  String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

export interface RepeatedSpan {
  span: string;
  count: number;
}

export const collectRepeatedSpans = (
  priorChapters: ReadonlyArray<ProseChapter> | undefined,
  lockedValues: ReadonlyArray<string> = [],
  spanWords = 6,
  minRepeats = 2,
  limit = 12,
): RepeatedSpan[] => {
  const text = (priorChapters ?? [])
    .map((c) => (Array.isArray(c?.paragraphs) ? c.paragraphs.join(" ") : ""))
    .join(" ");
  const words = normalise(text);
  if (words.length < spanWords) return [];
  const counts = new Map<string, number>();
  const firstAt = new Map<string, number>();
  for (let i = 0; i + spanWords <= words.length; i += 1) {
    const span = words.slice(i, i + spanWords).join(" ");
    counts.set(span, (counts.get(span) ?? 0) + 1);
    if (!firstAt.has(span)) firstAt.set(span, i);
  }
  // LOCKED VALUES ARE EXEMPT BY POSITION, not by window text: every word that belongs to an occurrence
  // of a locked value is marked, and no window touching a marked word is counted. Testing the window
  // text alone let a merged passage rebuild a run around the value ("the clock had stopped at ten
  // minutes past") out of the windows either side of it.
  const marked = new Array<boolean>(words.length).fill(false);
  for (const value of lockedValues) {
    const seq = normalise(value);
    if (seq.length < 2) continue;
    for (let i = 0; i + seq.length <= words.length; i += 1) {
      let hit = true;
      for (let j = 0; j < seq.length; j += 1) {
        if (words[i + j] !== seq[j]) { hit = false; break; }
      }
      if (hit) for (let j = 0; j < seq.length; j += 1) marked[i + j] = true;
    }
  }
  const touchesLocked = (at: number): boolean => {
    for (let j = at; j < at + spanWords; j += 1) if (marked[j]) return true;
    return false;
  };
  // Every repeated window, in the order it first appears in the book. A window's exemption is judged
  // at EVERY occurrence, because a run copied beside a locked value once is still a run.
  const occurrences = new Map<string, number[]>();
  for (let i = 0; i + spanWords <= words.length; i += 1) {
    const span = words.slice(i, i + spanWords).join(" ");
    const list = occurrences.get(span);
    if (list) list.push(i); else occurrences.set(span, [i]);
  }
  const windows = [...counts.entries()]
    .filter(([span, count]) => count >= minRepeats && !(occurrences.get(span) ?? []).some(touchesLocked))
    .map(([span, count]) => ({ span, count, at: firstAt.get(span)! }))
    .sort((a, b) => a.at - b.at);
  // A copied SENTENCE produces a run of adjacent windows. Listing each window would fill the list
  // with the same sentence six ways and tell the model nothing it could act on; one entry carrying
  // the whole passage (capped) is the countable form. Windows whose first occurrence lies within one
  // span of the previous window's belong to the same passage.
  const MAX_PASSAGE_WORDS = 14;
  const passages: RepeatedSpan[] = [];
  let cluster: typeof windows = [];
  const flush = () => {
    if (cluster.length === 0) return;
    const start = cluster[0]!.at;
    const end = Math.min(cluster[cluster.length - 1]!.at + spanWords, start + MAX_PASSAGE_WORDS);
    passages.push({ span: words.slice(start, end).join(" "), count: Math.max(...cluster.map((w) => w.count)) });
    cluster = [];
  };
  for (const w of windows) {
    if (cluster.length > 0 && w.at - cluster[cluster.length - 1]!.at > spanWords) flush();
    cluster.push(w);
  }
  flush();
  passages.sort((a, b) => b.count - a.count || a.span.localeCompare(b.span));
  return passages.slice(0, limit);
};

export const buildRepeatBanBlock = (
  priorChapters: ReadonlyArray<ProseChapter> | undefined,
  lockedFacts: ReadonlyArray<{ value?: string }> | undefined,
): string => {
  const spans = collectRepeatedSpans(
    priorChapters,
    (lockedFacts ?? []).map((f) => String(f?.value ?? "")).filter(Boolean),
  );
  if (spans.length === 0) return "";
  return [
    "",
    "",
    "PHRASES THIS BOOK HAS ALREADY USED — MEASURED, NOT ADVISORY:",
    "Each passage below already appears in the chapters before this one the number of times shown.",
    "Do not write any of them again, nor a variant with one word changed. Where a locked fact must be",
    "restated, restate it in different words around the locked value.",
    ...spans.map((s) => `  ×${s.count}  "${s.span}"`),
  ].join("\n");
};
