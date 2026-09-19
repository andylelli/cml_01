/**
 * PROSE ENGINE v2 — THE GATE (ANALYSIS_99 §10.9).
 *
 * ── TWO HARD STOPS, AND THEY ARE BOTH FAIR PLAY ──────────────────────────────────────────────────
 *
 * v1 carries 16 release-gate reasons and 7 hard stops, and `pipeline.ts:141` fails a run at
 * `major > 5`. Run 95041 wrote ten chapters and 13,928 words, met four `temporal_contradiction`
 * majors — every one of them the case's OWN forged document dates — and saved nothing. That is the
 * defect this file exists to make impossible: a book that exists is worth more than a book that
 * would have been slightly better, and a warning a human reads costs nothing.
 *
 * So exactly two things stop a run, both of them the fair-play contract the genre rests on:
 *
 *   1. the culprit is never named as the murderer in the reveal chapter;
 *   2. a decisive clue is on no page before the reveal.
 *
 * Both are unreachable once the selector's hard gates and the editor's second round have run, and
 * each reports what came closest, so a stop is a diagnosis rather than a loss.
 *
 * Everything else — every v1 release-gate reason, every validation major — is a WARNING line.
 */

import { indexChapters } from "./chapter-index.js";
import { namesAsCulprit } from "./culprit.js";
import type { ContractCore, Finding, ProseChapterLike } from "./types.js";

export interface GateVerdict {
  /** True when the book may ship. False only for the two fair-play breaches. */
  ship: boolean;
  stops: string[];
  warnings: string[];
}

const bodyOf = (chapter: ProseChapterLike | undefined): string =>
  String((chapter?.paragraphs ?? []).join(" "));

export const applyGate = (args: {
  chapters: ReadonlyArray<ProseChapterLike>;
  core: ContractCore;
  expected: ReadonlyArray<number>;
  findings: ReadonlyArray<Finding>;
  deterministicWrites: number;
}): GateVerdict => {
  const stops: string[] = [];
  const warnings: string[] = [];
  const order = [...args.expected].sort((a, b) => a - b);
  const byChapter = indexChapters(args.chapters, args.expected);

  // 1. the culprit is named where the contract says they are named.
  const revealBody = bodyOf(byChapter.get(args.core.roles.reveal));
  const named = args.core.fairPlay.culprits.filter((c) => namesAsCulprit(revealBody, c));
  if (args.core.fairPlay.culprits.length > 0 && named.length === 0) {
    stops.push(
      `the reveal chapter (${args.core.roles.reveal}) never names ${args.core.fairPlay.culprits.join(", ")} as the murderer`,
    );
  }

  // 2. every decisive clue is on a page before the reveal.
  const beforeReveal = order
    .filter((c) => c < args.core.roles.reveal)
    .map((c) => bodyOf(byChapter.get(c)).toLowerCase())
    .join(" ");
  for (const id of args.core.fairPlay.decisiveClueIds) {
    const surface = args.core.scenes.flatMap((s) => s.mustSurface).find((s) => s.id === id);
    if (!surface || surface.keyTerms.length < 3) continue;
    const hits = surface.keyTerms.filter((t) => beforeReveal.includes(t)).length;
    if (hits === 0) {
      stops.push(`the decisive clue ${id} is on no page before the reveal (${surface.keyTerms.slice(0, 4).join(", ")})`);
    }
  }

  // L1, asserted rather than trusted: v2 writes no sentence the model did not write.
  if (args.deterministicWrites > 0) {
    warnings.push(`DETERMINISTIC WRITES: ${args.deterministicWrites} — v2's first law says this is zero`);
  }

  // Everything else the findings carry, grouped so the report is readable rather than long.
  const byClass = new Map<string, number>();
  for (const finding of args.findings) byClass.set(finding.class, (byClass.get(finding.class) ?? 0) + 1);
  for (const [cls, count] of [...byClass.entries()].sort((a, b) => b[1] - a[1])) {
    warnings.push(`${cls}: ${count} unresolved`);
  }

  for (const chapter of order) {
    if (!byChapter.has(chapter)) warnings.push(`chapter ${chapter} is missing from the manuscript`);
  }

  return { ship: stops.length === 0, stops, warnings };
};
