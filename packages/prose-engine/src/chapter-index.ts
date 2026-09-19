/**
 * PROSE ENGINE v2 — WHICH PROSE IS WHICH CHAPTER.
 *
 * ── WHY THIS IS A MODULE AND NOT SIX COPIES OF TWO LINES ────────────────────────────────────────
 *
 * Six sites derived a chapter's number from its POSITION — `chapters[i]` for the i-th expected
 * number — which is correct only when every chapter is present. It is not a rare state: the writer's
 * continuation loop stops when a round adds nothing, and the first paid v2 run took exactly that
 * path and shipped 2 chapters of 10.
 *
 * MEASURED 2026-09-19 on `resume-1789805865810`'s manuscript: drop chapter 3 from a ten-chapter book
 * and `applyGate` reads `written[8]` as chapter 9. `written[8]` is then *"Confrontation and
 * Aftermath"* — chapter 10. **The fair-play reveal check reads the aftermath and reports nothing.**
 * That book still shipped, because chapter 10 also named the culprit; the luck is not the point, the
 * silence is. Every checker, the clue audit, the editor's anchors and the critic's prompt shared the
 * same assumption, so a single gap misfiled the whole tail of the book in all of them at once.
 *
 * So the number travels WITH the prose. `parseWriterOutput` already knows it — it reads the header
 * the writer wrote and fills the contract's chapters in order — and now records it. This module is
 * the one place that turns a list of chapters into a map, and it is what every site calls.
 */

import type { ProseChapterLike } from "./types.js";

/**
 * Chapter number → its prose.
 *
 * Uses the number each chapter carries. Falls back to position ONLY when no chapter carries one,
 * which is prose written before this field existed — an archived artifact, a hand-built fixture —
 * and never a half-numbered book, because a partial match is the state that would reintroduce the
 * defect quietly.
 */
export const indexChapters = (
  chapters: ReadonlyArray<ProseChapterLike>,
  expected: ReadonlyArray<number>,
): Map<number, ProseChapterLike> => {
  const byChapter = new Map<number, ProseChapterLike>();
  const numbered = chapters.filter((c) => typeof c?.number === "number");

  if (chapters.length > 0 && numbered.length === chapters.length) {
    for (const chapter of chapters) byChapter.set(chapter.number as number, chapter);
    return byChapter;
  }

  [...expected]
    .sort((a, b) => a - b)
    .forEach((chapter, index) => {
      const written = chapters[index];
      if (written) byChapter.set(chapter, written);
    });
  return byChapter;
};

/** The chapter numbers actually present, in order. */
export const writtenChapterNumbers = (
  chapters: ReadonlyArray<ProseChapterLike>,
  expected: ReadonlyArray<number>,
): number[] => [...indexChapters(chapters, expected).keys()].sort((a, b) => a - b);
