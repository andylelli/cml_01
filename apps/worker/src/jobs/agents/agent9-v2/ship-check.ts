/**
 * 17-hitting-90 P0.3 — the ship-check, on v2's manuscript.
 *
 * v1's SHIP-CHECK block (`agent9-run.ts`, A_64 F2 / A_89 C2) never ran on a v2 book: the engine
 * branch returns before it. CLAUDE.md's read rule — never read a book whose ship-check says WORTH A
 * LOOK — therefore had nothing to read on v2. These are MEASURES of the finished text, never gates
 * (L4): the repetition density the reader of run 88651 was describing when he listed eight lines as
 * "generator scaffolding", and the scaffold detector's residual hits per chapter.
 *
 * The register rate is deliberately absent. It is the only validated instrument on v1 books and it
 * does not transfer to v2 (A_101 §4: reads 7.4 under the fit) — a v2 register figure would be read
 * as a gain that is not one.
 */
import {
  ANTI_COPY_DEFAULT_N,
  antiCopyEnabled,
  detectScaffoldNotProse,
  findCopiedSpans,
  loadAntiCopyIndexAsync,
  repetitionDensity,
  summariseRepetitionDensity,
} from "@cml/prose-guard";
import type { ProseChapterLike } from "@cml/prose-engine";

const chapterTexts = (chapters: ReadonlyArray<ProseChapterLike>): string[] =>
  chapters.map((c) => (Array.isArray(c.paragraphs) ? c.paragraphs : []).join(" "));

export const v2ShipCheckLines = (chapters: ReadonlyArray<ProseChapterLike>): string[] => {
  const lines: string[] = [];
  const texts = chapterTexts(chapters);

  const density = repetitionDensity(texts.join(" "));
  if (density.words > 0) lines.push(`[Agent 9 v2] SHIP-CHECK: repetition — ${summariseRepetitionDensity(density)}`);

  texts.forEach((text, i) => {
    const hits = detectScaffoldNotProse(text);
    if (hits.length > 0) {
      lines.push(`[Agent 9 v2] SHIP-CHECK scaffold residual [${hits.map((h) => h.rule).join(", ")}] in ch${i + 1}`);
    }
  });
  return lines;
};

/**
 * 2026-10-03 — the anti-copy check, on v2's manuscript. v1's call site (a hard fail, the last
 * statement of `runAgent9`) died with the v1 engine in 43b44336, and v2 had NO output-side copy check
 * while `PROSE_ANTI_COPY_GATE=true` sat in config and WP-003/WP-004 cited it as the guarantee.
 *
 * TELEMETRY, like everything in this file: one line per chapter with a hit, and ONE summary line
 * whenever the flag is on, so a book that was checked and clean is distinguishable from a book that
 * was never checked. Never a throw, never a retry driver — a gate that drives retries costs register
 * points (CLAUDE.md B1), and a hard fail on v2 is a decision for live-run data, not for this change.
 * MEASURED before wiring: 0 spans over 264 manuscripts at n=11 (10 v2-era, 254 archived), and an
 * 11-word lift planted in a real manuscript is reported.
 *
 * Async because the first call in a process builds a 12.2M-n-gram index (46–54 s) and the pipeline
 * runs inside the API process; `loadAntiCopyIndexAsync` yields to the event loop while it builds.
 * It also never rejects: the module's own docstring names the failure this avoids — a safety feature
 * that takes a paid run down because a text file is absent.
 *
 * The line cannot name the source WORK. The index stores 53-bit fingerprints of the n-grams, not
 * their origin, so the report is the copied run itself; finding the work is a grep over library/texts.
 */
export const v2AntiCopyShipCheckLines = async (chapters: ReadonlyArray<ProseChapterLike>): Promise<string[]> => {
  if (!antiCopyEnabled()) return [];
  try {
    const index = await loadAntiCopyIndexAsync();
    if (index.size === 0) {
      return [
        "[Agent 9 v2] SHIP-CHECK: anti-copy — NOT RUN: no source text was indexed, so the check finds nothing because it knows nothing",
      ];
    }
    const lines: string[] = [];
    let spanCount = 0;
    let chaptersHit = 0;
    chapterTexts(chapters).forEach((text, i) => {
      const spans = findCopiedSpans(text, index);
      if (spans.length === 0) return;
      spanCount += spans.length;
      chaptersHit += 1;
      const longest = spans.reduce((a, b) => (b.length > a.length ? b : a));
      lines.push(
        `[Agent 9 v2] SHIP-CHECK anti-copy — ch${i + 1}: ${spans.length} verbatim span(s), longest ${longest.length} words: "${longest.text.slice(0, 90)}"`,
      );
    });
    const indexed = `${index.sources.length} works, ${index.size.toLocaleString("en-GB")} n-grams`;
    lines.push(
      spanCount === 0
        ? `[Agent 9 v2] SHIP-CHECK: anti-copy — no verbatim span of ${ANTI_COPY_DEFAULT_N}+ words against ${indexed}. Clean.`
        : `[Agent 9 v2] SHIP-CHECK: anti-copy — ${spanCount} verbatim span(s) of ${ANTI_COPY_DEFAULT_N}+ words in ${chaptersHit} chapter(s) against ${indexed} — WORTH A LOOK BEFORE READING.`,
    );
    return lines;
  } catch (err) {
    return [`[Agent 9 v2] SHIP-CHECK: anti-copy — NOT RUN: ${err instanceof Error ? err.message : String(err)}`];
  }
};
