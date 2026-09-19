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

import type { ContractCore, Finding, ProseChapterLike } from "./types.js";

export interface GateVerdict {
  /** True when the book may ship. False only for the two fair-play breaches. */
  ship: boolean;
  stops: string[];
  warnings: string[];
}

const bodyOf = (chapter: ProseChapterLike | undefined): string =>
  String((chapter?.paragraphs ?? []).join(" "));

/**
 * Is this text naming `culprit` as the murderer?
 *
 * The same predicate the selector uses, so the gate and the selector cannot disagree (L6). It is
 * used in BOTH directions — the reveal chapter must satisfy it and every earlier chapter must not —
 * which is why it is deliberately narrow: an accusation, never a suspicion. Widening it to catch a
 * missed reveal also makes the early-naming gate fire on the middle of the book doing its job, so
 * every addition below is a construction that cannot be said about a merely suspected person.
 *
 * ── WHY THE VERB LIST GREW ──────────────────────────────────────────────────────────────────────
 *
 * MEASURED 2026-09-19, run `resume-1789805865810`: the gate STOPPED a book whose reveal chapter
 * says *"Nora Quayle engineered the murder, exploited the authority of the judge, and doctored the
 * records to conceal the truth."* The verb is `engineered` and `murder` is a NOUN, so a list built
 * from `killed|murdered|poisoned|strangled|struck` matched nothing. A ten-chapter, 8,182-word book
 * that names its culprit in the reveal was recorded as a failed run.
 *
 * This project has paid for this exact shape before — the guilt marker with no blunt-force verb, the
 * domain nouns colliding with a validator wordlist. A closed vocabulary that decides a PASS is a
 * vocabulary that will be missing the next word the prose uses, so the two families below cover the
 * construction (agent + guilt noun) rather than adding one more verb.
 */
const namesAsCulprit = (text: string, culprit: string): boolean => {
  if (!culprit) return false;
  const escape = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const surname = culprit.split(/\s+/).slice(-1)[0] ?? culprit;
  const name = `(?:${escape(culprit)}|${escape(surname)})`;
  /** Doing the deed, named directly. */
  const didIt = `${name}[^.!?]{0,80}\\b(?:killed|murdered|poisoned|strangled|struck|is the (?:killer|murderer|culprit)|did it)\\b`;
  /** "the murderer was X" — the deed first, the name second. */
  const wasThem = `\\b(?:killer|murderer|culprit) (?:is|was)[^.!?]{0,20}${name}`;
  /**
   * Agent + guilt NOUN: "X engineered the murder", "X carried out the killing". Every verb here is
   * one of authorship, so none of them can be said of a suspect the detective is merely watching.
   */
  const authored =
    `${name}[^.!?]{0,80}\\b(?:engineered|committed|carried out|planned|plotted|staged|arranged|` +
    `contrived|orchestrated|devised|executed)\\b[^.!?]{0,20}\\b(?:murder|killing|crime|death)\\b`;
  /** The deed, attributed: "the murder was the work of X", "the killing was committed by X". */
  const attributed =
    `\\b(?:murder|killing|crime)\\b[^.!?]{0,40}\\b(?:was|were)\\b[^.!?]{0,20}` +
    `(?:committed by|the work of|done by)[^.!?]{0,20}${name}`;
  /** A confession is an accusation the culprit makes about themselves. */
  const confessed = `${name}[^.!?]{0,60}\\bconfess(?:ed|es|ion)\\b|\\bconfess(?:ed|es|ion)[^.!?]{0,40}${name}`;
  return new RegExp([didIt, wasThem, authored, attributed, confessed].join("|"), "i").test(text);
};

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
  const byChapter = new Map<number, ProseChapterLike>();
  order.forEach((chapter, index) => {
    const written = args.chapters[index];
    if (written) byChapter.set(chapter, written);
  });

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
