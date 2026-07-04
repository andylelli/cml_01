/**
 * Single source of truth for writing the human-readable story markdown into `stories/`.
 *
 * Both entry points that run the pipeline — the API server (a UI-triggered run) and the canary script
 * (a locally-triggered run) — call THIS function, so a story file has the same title, slug, path, and
 * formatting regardless of how the run was triggered. Previously the API and the canary each had their
 * own copy; the canary's copy used `prose.note` as a title fallback (the exact diagnostic-note leak
 * `deriveStoryTitle` was built to prevent) and a different generic default, so the two diverged.
 *
 * Title resolution is delegated to `deriveStoryTitle` (prose.title → caller fallback → "Mystery Story").
 * Character normalisation folds in the same mojibake + smart-punctuation fixes the API applied via
 * `sanitizeProsePayload`, so the output is identical even when the caller passes un-sanitised prose.
 */

import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { deriveStoryTitle } from "@cml/prompts-llm";

// Mojibake (double-encoded UTF-8) + smart-punctuation → ASCII, matching the API's sanitizeProsePayload +
// the previous inline story normalisation. Idempotent, so pre-sanitised prose is unaffected.
const MOJIBAKE: Array<[RegExp, string]> = [
  [/â€™/g, "'"], [/â€˜/g, "'"], [/â€œ|â€\x9d/g, '"'], [/â€"|â€”/g, "—"], [/â€“/g, "–"],
  [/â€¦/g, "..."], [/Â/g, ""], [/�/g, ""],
];
const normText = (value: unknown): string => {
  let s = String(value ?? "");
  for (const [re, rep] of MOJIBAKE) s = s.replace(re, rep);
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/[–—]/g, "-")
    .trim();
};

export interface SaveReadableStoryArgs {
  /** Absolute path to the workspace `stories/` directory. */
  storiesDir: string;
  /** The prose payload (with `chapters`). */
  prose: Record<string, unknown> | null | undefined;
  runId: string;
  /** Title fallback when prose has no title — the synopsis/case title (e.g. CASE.meta.title). */
  fallbackTitle?: string;
  /** Injectable clock for deterministic tests; defaults to `new Date()`. */
  now?: Date;
}

export interface SavedStory {
  /** Absolute path of the written file. */
  absPath: string;
  /** Path relative to `storiesDir` (e.g. "story_20260704-1030/the_clockwork_alibi.md"). */
  relPath: string;
  slug: string;
  title: string;
}

/**
 * Write the story markdown. Returns the saved paths. Creates `stories/story_<YYYYMMDD-HHMM>/<slug>.md`.
 */
export async function saveReadableStory(args: SaveReadableStoryArgs): Promise<SavedStory> {
  const prose = args.prose ?? {};
  const storyTitle = normText(deriveStoryTitle(prose as { title?: unknown; note?: unknown }, args.fallbackTitle));
  const slug = storyTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48);
  const now = args.now ?? new Date();
  const datePart =
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}` +
    `-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const dirName = `story_${datePart}`;
  const filename = `${slug || "mystery_story"}.md`;
  const storyDir = path.join(args.storiesDir, dirName);
  const absPath = path.join(storyDir, filename);

  const chapters = Array.isArray((prose as any).chapters) ? ((prose as any).chapters as Array<Record<string, unknown>>) : [];
  const lines: string[] = [`# ${storyTitle}`, ``, `*Run ID: ${args.runId} — Generated ${now.toDateString()}*`, ``, `---`];
  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    const chTitle = normText(ch.title || `Chapter ${i + 1}`);
    lines.push(``, `## Chapter ${i + 1}: ${chTitle}`, ``);
    const paragraphs = Array.isArray(ch.paragraphs) ? (ch.paragraphs as unknown[]) : (ch.text ? [ch.text] : []);
    for (const p of paragraphs) {
      const text = normText(p);
      if (text) lines.push(text, ``);
    }
    lines.push(`---`);
  }

  const content = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  await mkdir(storyDir, { recursive: true });
  await writeFile(absPath, content, "utf-8");
  return { absPath, relPath: path.join(dirName, filename), slug, title: storyTitle };
}
