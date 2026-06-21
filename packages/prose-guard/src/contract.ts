/**
 * Chapter-as-contract derivation (Agent 9 redesign §4.1).
 *
 * The obligation set is *generated, not authored* — it falls straight out of the validated CML and
 * the Agent 7 scene plan. Each chapter gets its exact `must_surface` / `must_not_reveal` /
 * `present` / `eliminations_allowed` spec, so "did the prose satisfy the contract?" replaces the
 * grab-bag of completeness / clue_timing / continuity / fair_play retry families with ONE
 * machine-checkable question. Pure, deterministic, no LLM.
 *
 * The key fair-play derivation: a clue revealed in chapter K is in `must_not_reveal` for every
 * chapter before K (it may not leak early), and the culprit is `must_not_reveal` until the reveal
 * chapter. This is exactly the §5 invariant — fair-play is checked *as the prose is written*, not
 * re-audited at the end.
 */

import type { ChapterObligationContract, ClueSurfaceObligation } from "./types.js";

export interface SceneInput {
  chapter: number;
  beat?: string;
  present?: string[];
  location?: string;
  time_window?: { from?: string; to?: string };
  /** Clues this scene reveals — ids, or objects carrying prose-facing key terms (from Agent 5). */
  cluesRevealed?: Array<string | { id: string; keyTerms?: string[]; as?: string }>;
  eliminations?: string[];
}

export interface ContractDerivationOptions {
  culpritName?: string;
  /** Chapter where the culprit is revealed; default = the last chapter present. */
  revealChapter?: number;
  /** id → prose-facing key terms (Agent 5's prose-facing descriptions). */
  clueKeyTerms?: Record<string, string[]>;
}

function normalizeClue(c: string | { id: string; keyTerms?: string[]; as?: string }): ClueSurfaceObligation {
  return typeof c === "string" ? { clue: c } : { clue: c.id, keyTerms: c.keyTerms, as: c.as };
}

/** Derive one obligation contract per chapter from the scene plan + CML facts. */
export function deriveChapterContracts(
  scenes: SceneInput[],
  opts: ContractDerivationOptions = {},
): ChapterObligationContract[] {
  // group scenes by chapter (the pipeline is 1 scene per chapter, but merge defensively)
  const byChapter = new Map<number, SceneInput[]>();
  for (const s of scenes) {
    const arr = byChapter.get(s.chapter) ?? [];
    arr.push(s);
    byChapter.set(s.chapter, arr);
  }
  const chapters = [...byChapter.keys()].sort((a, b) => a - b);
  const revealChapter = opts.revealChapter ?? (chapters.length ? Math.max(...chapters) : 0);

  // first chapter each clue is revealed, and the prose-facing key terms it was revealed with —
  // so a clue's `must_not_reveal` entry in an EARLIER chapter carries the same terms the leak check
  // must look for (not just the bare id).
  const firstReveal = new Map<string, number>();
  const keyTermsById = new Map<string, string[]>();
  for (const s of scenes) {
    for (const c of s.cluesRevealed ?? []) {
      const o = normalizeClue(c);
      const ch = firstReveal.get(o.clue);
      if (ch == null || s.chapter < ch) firstReveal.set(o.clue, s.chapter);
      if (o.keyTerms?.length && !keyTermsById.has(o.clue)) keyTermsById.set(o.clue, o.keyTerms);
    }
  }

  const termsFor = (id: string): string[] | undefined => opts.clueKeyTerms?.[id] ?? keyTermsById.get(id);
  const withTerms = (id: string): ClueSurfaceObligation => ({ clue: id, keyTerms: termsFor(id) });

  return chapters.map((chapter) => {
    const group = byChapter.get(chapter)!;
    const present = [...new Set(group.flatMap((s) => s.present ?? []))];
    const eliminations = [...new Set(group.flatMap((s) => s.eliminations ?? []))];
    const location = group.find((s) => s.location)?.location;
    const time_window = group.find((s) => s.time_window)?.time_window;
    const beat = group.map((s) => s.beat).filter(Boolean).join("; ") || undefined;

    const must_surface = group
      .flatMap((s) => s.cluesRevealed ?? [])
      .map(normalizeClue)
      .map((o) => ({ ...o, keyTerms: termsFor(o.clue) ?? o.keyTerms }));

    // every clue first revealed in a LATER chapter must not leak here
    const mustNotRevealClues = [...firstReveal.entries()]
      .filter(([, ch]) => ch > chapter)
      .map(([id]) => withTerms(id))
      .sort((a, b) => a.clue.localeCompare(b.clue));

    return {
      chapter,
      beat,
      present,
      location,
      time_window,
      must_surface,
      must_not_reveal: { solution_culprit: chapter < revealChapter, clues: mustNotRevealClues },
      eliminations_allowed: eliminations,
    };
  });
}
