/**
 * Story rendering helpers shared by every path that turns a finished `prose` artifact into files.
 *
 * Extracted from `agent9-replay.ts` when R5's resume CLI needed the same output (R5/R6, see
 * architecture/REVIEW_01.md). Three consumers now render stories — the replay bench, the resume CLI,
 * and the golden-set eval harness — and three private copies of "how a chapter becomes markdown"
 * would drift the moment one of them was fixed. Same reasoning as `artifact-store.ts`.
 *
 * The markdown shape here is deliberately the one the API's `saveReadableStoryText` writes, so a
 * story recovered by any of these paths is byte-comparable with one produced by a normal run.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { isStripBeatTitlesEnabled, stripBeatPrefixFromTitle, deriveStoryTitle } from "@cml/prompts-llm";

/** Fold smart punctuation to ASCII — the corpus is compared as text, and quote style is noise. */
export const normalizeStoryText = (s: unknown): string =>
  String(s ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/[–—]/g, "-")
    .trim();

/**
 * Plain prose join — exactly the text the live shadow scorer rubric-scores.
 *
 * This must stay identical to `assembleFullProse` in the orchestrator: the rubric judge's marks are
 * only comparable across runs if every path feeds it the same rendering of the same chapters.
 */
export function assembleFullProse(prose: unknown): string {
  const chapters = Array.isArray((prose as any)?.chapters) ? (prose as any).chapters : [];
  return chapters
    .map((c: any) => {
      const body = Array.isArray(c?.paragraphs)
        ? c.paragraphs.join("\n\n")
        : String(c?.content ?? c?.text ?? "");
      const title = c?.title ? `${c.title}\n\n` : "";
      return `${title}${body}`.trim();
    })
    .filter(Boolean)
    .join("\n\n");
}

export function storyFolderName(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `story_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

/** Readable story markdown, the same shape the API's `saveReadableStoryText` writes. */
export function saveReadableStory(
  prose: unknown,
  runId: string,
  storyDir: string,
  fallbackTitle: string,
): { filePath: string; slug: string; title: string } {
  const storyTitle = normalizeStoryText(deriveStoryTitle(prose as any, fallbackTitle)) || "Mystery Story";
  const slug =
    storyTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48) || "story";
  const chapters: any[] = Array.isArray((prose as any)?.chapters) ? (prose as any).chapters : [];
  const now = new Date();
  const lines: string[] = [`# ${storyTitle}`, ``, `*Run ID: ${runId} — Generated ${now.toDateString()}*`, ``, `---`];
  chapters.forEach((ch, i) => {
    // A_96 F1 — the LAST surface before the reader. The Agent 9 sanitiser strips this too, but some
    // internal path preserved the unstripped title on the 50862 pair (measured), and this is the
    // boundary A_96 B5 actually named: Agent 7 titles for its own bookkeeping, and THIS prints it.
    const chTitle = normalizeStoryText(
      isStripBeatTitlesEnabled() ? stripBeatPrefixFromTitle(ch?.title || `Chapter ${i + 1}`) : (ch?.title || `Chapter ${i + 1}`),
    );
    lines.push(``, `## Chapter ${i + 1}: ${chTitle}`, ``);
    const paragraphs = Array.isArray(ch?.paragraphs) ? ch.paragraphs : ch?.text ? [ch.text] : [];
    for (const p of paragraphs) {
      const text = normalizeStoryText(p);
      if (text) lines.push(text, ``);
    }
    lines.push(`---`);
  });
  const content = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  mkdirSync(storyDir, { recursive: true });
  const filePath = join(storyDir, `${slug}.md`);
  writeFileSync(filePath, content, "utf8");
  return { filePath, slug, title: storyTitle };
}
