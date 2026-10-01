/**
 * The chapter texts the rubric scorer reads.
 *
 * Moved out of the v1 engine's `agent9-prose/regen-integration.ts` by owner decision 1 (2026-09-30), which deleted that
 * engine; these are the declarations the v2 engine, Agent 7 or scoring still read (with every helper they
 * reference, moved by `scripts/move-declarations.mjs --closure`). Nothing in them changed.
 */

/**
 * A_64 §2 (the 7.2 rewire) — THE scoring-text assembly, single-sourced. The rubric scores
 * `chapters.join("\n\n")` where each chapter is `title\n\n` + `paragraphs.join("\n\n")` (previously a
 * private orchestrator helper), while the dual-value LEVER detected on ONE chapter's
 * `paragraphs.join(" ")` — so a canonical pair whose 240-char window spans a chapter boundary (or text
 * reflowed by post-pass hygiene) fired the cap at scoring while the lever stayed silent on every arm:
 * the 7.2 "enabled and silent / tide_on capped anyway" split-brain. The orchestrator now delegates to
 * this function, so lever-scope and cap-scope provably read the same text.
 */
export function assembleScoringChapterTexts(chapters: unknown): string[] {
  return (Array.isArray(chapters) ? chapters : [])
    .map((c: any) => {
      const body = Array.isArray(c?.paragraphs) ? c.paragraphs.join("\n\n") : String(c?.content ?? c?.text ?? "");
      const title = c?.title ? `${c.title}\n\n` : "";
      return `${title}${body}`.trim();
    })
    .filter(Boolean);
}
