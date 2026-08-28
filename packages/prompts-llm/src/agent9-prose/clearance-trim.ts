/**
 * A_75 §12 — trim a clearance REGISTER back to its budget, without losing a clearance.
 *
 * ── THE DEFECT, AND WHY IT IS THE BIGGEST ONE AGENT 9 OWNS ───────────────────────────────────────
 *
 * `clearance_over_budget` is the MOST FREQUENT geometry code in the archive: it fires on **17 of 23
 * runs (74%)**, ahead of `reveal_culprit_not_named` (61%) and `unaccounted_time` (57%). The check
 * counts sentences that exonerate somebody and compares them to a per-chapter budget; its own message
 * is *"Elimination belongs in scene, or in one sentence — never as a register."*
 *
 * Both external readers of the 2026-08-27 matched pair complained about exactly this, unprompted:
 *
 *   arm A — "Chapter 9 repeats clearances after the confession... It is not disastrous, but it slows
 *            the ending."
 *   arm B — "Chapter 9 repeats the clearances. It is clearer than the earlier version, but still
 *            unnecessary after Chapter 8."
 *
 * And `story-geometry/src/codes.ts` documents the gap in its own words:
 *
 *   > "too MANY clearances — a negative constraint, and the only negative pass that exists
 *   >  (aftermath_repeat) removes repetition rather than trimming a register"
 *
 * So the most frequent defect in the pipeline has NO repair. `AGENT9_FOLD_SUSPECT_CLEARANCES` is ON
 * and is a prompt steer; the model re-argues anyway, and nothing downstream trims it.
 *
 * ── THE ONE RULE THAT MAKES A DELETION SAFE ──────────────────────────────────────────────────────
 *
 * Cutting text is dangerous here: a suspect who is never cleared is a `suspect_closure_missing`
 * run-killer, which is a far worse trade than a slow ending. So this only ever removes a clearance
 * sentence whose suspect **has already been cleared in an EARLIER chapter**. The first clearance of
 * any suspect is untouchable, whatever the budget says. The result is that no obligation can be lost
 * by construction — the trim removes repetition, never coverage.
 *
 * It also stops at the budget rather than removing every redundancy: a book is allowed to mention an
 * earlier exoneration once more in passing. What the reader objects to is the REGISTER — three, five,
 * eleven of them in a row — not the existence of a callback.
 *
 * Uses the SAME recognisers as `story-geometry/accept.ts`, deliberately duplicated as a documented
 * mirror rather than imported, because prompts-llm must not depend on story-geometry. A test asserts
 * the two agree; if they ever drift, that test fails rather than the trim silently repairing a
 * different set of sentences than the one the gate counts.
 */

/** Mirror of `CLEARANCE_MARKER` in story-geometry/src/accept.ts. Kept in sync by test. */
export const CLEARANCE_MARKER_MIRROR =
  /\b(?:cleared|ruled\s+out|eliminated|in\s+the\s+clear|not\s+the\s+(?:culprit|killer|murderer)|innocent|alibi\s+(?:holds|held|is\s+confirmed|checks\s+out)|could\s+not\s+have\s+(?:done|killed)|freed\s+from\s+suspicion|above\s+suspicion)\b/i;

/** Mirror of `CLEARANCE_IDIOM` — "cleared her throat" is not an exoneration (X21). */
export const CLEARANCE_IDIOM_MIRROR =
  /\bclear(?:ed|ing|s)?\s+(?:h(?:is|er)\s+throat|the\s+(?:throat|table|room|air|plates|dishes)|a\s+space|away|out)\b/i;

export const isClearanceSentenceMirror = (sentence: string): boolean =>
  CLEARANCE_MARKER_MIRROR.test(sentence) && !CLEARANCE_IDIOM_MIRROR.test(sentence);

const splitSentences = (paragraph: string): string[] =>
  String(paragraph ?? "").split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);

/** Which cast members a sentence names. Surname or full name, whichever the prose used. */
const namesIn = (sentence: string, castNames: ReadonlyArray<string>): string[] => {
  const lower = sentence.toLowerCase();
  const hit: string[] = [];
  for (const full of castNames) {
    const name = String(full ?? "").trim();
    if (!name) continue;
    const surname = name.split(/\s+/).pop() ?? name;
    if (lower.includes(name.toLowerCase()) || (surname.length >= 4 && lower.includes(surname.toLowerCase()))) {
      hit.push(name);
    }
  }
  return hit;
};

export interface ClearanceTrimResult {
  chapters: Array<{ title?: string; paragraphs: string[] }>;
  /** One line per removed sentence, for the run warnings. Never silent. */
  removed: string[];
}

/**
 * Trim redundant clearance sentences in chapters that exceed `maxSentences`.
 *
 * Chapters are walked in order so "already cleared earlier" means earlier in the BOOK, and a suspect's
 * first clearance is recorded before any later chapter can be trimmed against it.
 */
export const trimRedundantClearances = (
  chapters: ReadonlyArray<{ title?: string; paragraphs?: string[] }>,
  castNames: ReadonlyArray<string>,
  maxSentences: number,
): ClearanceTrimResult => {
  const clearedEarlier = new Set<string>();
  const out: ClearanceTrimResult["chapters"] = [];
  const removed: string[] = [];

  chapters.forEach((chapter, idx) => {
    const paragraphs = Array.isArray(chapter?.paragraphs) ? [...chapter.paragraphs] : [];
    const chapterNumber = idx + 1;

    // Every clearance sentence in this chapter, located so a removal can be applied precisely.
    const located: Array<{ p: number; s: number; text: string; names: string[] }> = [];
    paragraphs.forEach((para, p) => {
      splitSentences(para).forEach((text, s) => {
        if (isClearanceSentenceMirror(text)) located.push({ p, s, text, names: namesIn(text, castNames) });
      });
    });

    const overBy = located.length - Math.max(0, maxSentences);
    if (overBy > 0) {
      // Only sentences whose subject was ALREADY cleared in an earlier chapter are candidates. A
      // sentence naming nobody is not a candidate either: it cannot be shown to be redundant.
      const redundant = located.filter((c) => c.names.length > 0 && c.names.every((n) => clearedEarlier.has(n)));
      // Trim from the END: the last restatement is the one a reader experiences as the register
      // outstaying its welcome, and the earlier one is likelier to be the dramatized version.
      const toCut = redundant.slice(-overBy);
      const cutKeys = new Set(toCut.map((c) => `${c.p}:${c.s}`));
      if (cutKeys.size > 0) {
        paragraphs.forEach((para, p) => {
          const sentences = splitSentences(para);
          const kept = sentences.filter((_, s) => !cutKeys.has(`${p}:${s}`));
          if (kept.length !== sentences.length) paragraphs[p] = kept.join(" ").trim();
        });
        for (const c of toCut) {
          removed.push(
            `ch${chapterNumber} clearance trimmed (${c.names.join(", ")} already cleared earlier): "${c.text.slice(0, 78)}"`,
          );
        }
      }
    }

    // Record this chapter's clearances AFTER trimming, so a suspect cleared only here still counts.
    for (const c of located) for (const n of c.names) clearedEarlier.add(n);

    out.push({ ...chapter, paragraphs: paragraphs.filter((p) => String(p ?? "").trim().length > 0) });
  });

  return { chapters: out, removed };
};
