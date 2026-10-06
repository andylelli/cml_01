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

import { auditFixesEnabled } from "@cml/cml";
import { indexChapters } from "./chapter-index.js";
import { clueTermsOnPage, keyTermHits } from "./clue-terms.js";
import { culpritContextOf, namesAsCulprit } from "./culprit.js";
import type { ContractCore, Finding, ProseChapterLike } from "./types.js";

export interface GateVerdict {
  /** True when the book may ship. False only for the two fair-play breaches. */
  ship: boolean;
  stops: string[];
  warnings: string[];
  /** A_111 V-11 (PROSE_V2_AUDIT_FIXES only): report-only finding classes, which are not warnings. */
  reports?: string[];
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

  /**
   * 1. THE READER IS TOLD WHO DID IT.
   *
   * ── WHY THIS STOP IS BOOK-LEVEL AND NOT CHAPTER-LEVEL ─────────────────────────────────────────
   *
   * It used to require the naming in exactly `roles.reveal`. MEASURED 2026-09-19 by replaying this
   * gate over all 51 archived books v1 SHIPPED: **it stopped 44 of them**, every one for this reason.
   * A hard fair-play guarantee that fires on 86% of shipped books is not a guarantee.
   *
   * The diagnosis split in two, and only one half was the gate's business:
   *
   *   18 books name the culprit SOMEWHERE ELSE, and in 16 of those it is exactly one chapter later
   *      than this contract's reveal. Those books were written to a different plan, and naming the
   *      culprit a chapter later than planned is a contract mismatch, not a breach of fair play.
   *      It is a WARNING.
   *   26 books name the culprit NOWHERE by any construction. Two constructions out of that set were
   *      real accusations the predicate could not see (`was responsible`, the arrest) and are now in
   *      `culprit.ts`. What remains after that is a book that never attributes the act to anybody —
   *      the "X22 wall" recorded in `guilt-marker-has-no-blunt-force-verb`. That IS the breach this
   *      stop exists for, and it should be rare.
   *
   * So: the stop is "named nowhere at or after the reveal", which is the property a reader would
   * actually complain about, and §10.9's rule decides the rest — a book that exists is worth more
   * than a book that would have been slightly better.
   */
  const culprits = args.core.fairPlay.culprits;
  if (culprits.length > 0) {
    // A_111 V-10: the case's victim and cast travel with the predicate (ignored with PROSE_V2_AUDIT_FIXES off).
    const people = culpritContextOf(args.core);
    const revealBody = bodyOf(byChapter.get(args.core.roles.reveal));
    const namedInReveal = culprits.filter((c) => namesAsCulprit(revealBody, c, people));
    const laterBody = order
      .filter((c) => c > args.core.roles.reveal)
      .map((c) => bodyOf(byChapter.get(c)))
      .join(" ");
    const namedLater = culprits.filter((c) => namesAsCulprit(laterBody, c, people));
    const namedAnywhere = new Set([...namedInReveal, ...namedLater]);

    if (namedAnywhere.size === 0) {
      stops.push(
        `no chapter at or after the reveal (${args.core.roles.reveal}) names ` +
          `${culprits.join(", ")} as the murderer — the reader is never told who did it`,
      );
    } else if (namedInReveal.length === 0) {
      warnings.push(
        `the culprit is named after the reveal chapter (${args.core.roles.reveal}), not in it — ` +
          `the book resolves later than the contract planned`,
      );
    }
  }

  // 2. every decisive clue is on a page before the reveal.
  const beforeReveal = order
    .filter((c) => c < args.core.roles.reveal)
    .map((c) => bodyOf(byChapter.get(c)).toLowerCase())
    .join(" ");
  for (const id of args.core.fairPlay.decisiveClueIds) {
    const surface = args.core.scenes.flatMap((s) => s.mustSurface).find((s) => s.id === id);
    if (!surface || surface.keyTerms.length < 3) continue;
    /**
     * A_111 V-15 (WF-005 V2K-08). Any ONE term as a substring — "door", "lock" — is on some page of every book, so this
     * stop could never fire. With PROSE_V2_AUDIT_FIXES on, the clue is on a page when ONE chapter before the reveal
     * passes the selector's own `clue_missing` test (`clueTermsOnPage`) — the same predicate on the same unit, so the
     * selector and the gate cannot disagree about it. MEASURED over the 34 decisive clues (3+ key terms) of 29 distinct
     * stored books, "passes" = stays silent:
     *
     *                                   own book   another case   canon (3 texts)
     *   any one term, substring          34/34        34/34        31–33/34
     *   word rule, all pre-reveal text   34/34        19/34         5–8/34
     *   word rule, inside one chapter    34/34        10/34         1–3/34     <- this
     *
     * Read across ten thousand words, half of eight genre terms ("door", "lock", "traces", "handling") turn up in any
     * mystery; inside one chapter they mostly do not.
     */
    const onPage = auditFixesEnabled()
      ? order
          .filter((c) => c < args.core.roles.reveal)
          .some((c) => clueTermsOnPage(surface.keyTerms, bodyOf(byChapter.get(c)).toLowerCase()))
      : keyTermHits(surface.keyTerms, beforeReveal, "substring") > 0;
    if (!onPage) {
      stops.push(`the decisive clue ${id} is on no page before the reveal (${surface.keyTerms.slice(0, 4).join(", ")})`);
    }
  }

  // L1, asserted rather than trusted: v2 writes no sentence the model did not write.
  if (args.deterministicWrites > 0) {
    warnings.push(`DETERMINISTIC WRITES: ${args.deterministicWrites} — v2's first law says this is zero`);
  }

  // Everything else the findings carry, grouped so the report is readable rather than long.
  /**
   * A_111 V-11 (WF-005 V2K-10). A `report` finding is never sent to an editor (`run.ts` filters it out of every round),
   * so "unresolved" is not a state it can leave — and counting it as a warning made `validation_status` read
   * needs_review on 12 of 12 v2 runs. With PROSE_V2_AUDIT_FIXES on it is listed under `reports`, not `warnings`; the
   * run report's `findings:` line still counts it, since a report finding is never edited away.
   */
  const separateReports = auditFixesEnabled();
  const reports: string[] = [];
  const byClass = new Map<string, number>();
  const reportByClass = new Map<string, number>();
  for (const finding of args.findings) {
    const into = separateReports && finding.severity === "report" ? reportByClass : byClass;
    into.set(finding.class, (into.get(finding.class) ?? 0) + 1);
  }
  for (const [cls, count] of [...byClass.entries()].sort((a, b) => b[1] - a[1])) {
    warnings.push(`${cls}: ${count} unresolved`);
  }
  for (const [cls, count] of [...reportByClass.entries()].sort((a, b) => b[1] - a[1])) {
    reports.push(`${cls}: ${count} reported (report-only, never sent to an editor)`);
  }

  for (const chapter of order) {
    if (!byChapter.has(chapter)) warnings.push(`chapter ${chapter} is missing from the manuscript`);
  }

  return { ship: stops.length === 0, stops, warnings, ...(separateReports ? { reports } : {}) };
};
