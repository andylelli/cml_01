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
import { detectScaffoldNotProse, repetitionDensity, summariseRepetitionDensity } from "@cml/prose-guard";
import type { ProseChapterLike } from "@cml/prose-engine";

export const v2ShipCheckLines = (chapters: ReadonlyArray<ProseChapterLike>): string[] => {
  const lines: string[] = [];
  const texts = chapters.map((c) => (Array.isArray(c.paragraphs) ? c.paragraphs : []).join(" "));

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
