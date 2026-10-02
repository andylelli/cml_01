import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { StoryCoverInput } from "./types.js";

/** Chapters 1–2 only: spoiler-safe by construction (see StoryCoverInput.openingText). */
export const OPENING_CHAPTERS = 2;

const clean = (v: unknown) => (typeof v === "string" && v.trim() && v.trim() !== "auto" ? v.trim() : undefined);

/** Split a saved manuscript (save-readable-story.ts format) into title + chapter bodies. */
export const parseManuscript = (md: string): { title: string; chapters: string[] } => {
  const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "Untitled Mystery";
  const parts = md.split(/^##\s+Chapter\b.*$/m).slice(1);
  const chapters = parts.map((p) => p.replace(/^---\s*$/gm, "").trim()).filter(Boolean);
  return { title, chapters };
};

/**
 * Read `stories/<dir>/`: the one `.md` manuscript plus the `run-params.json` sidecar when present
 * (canary/CLI runs write it; UI runs do not, so every field from it is optional).
 */
export const readStoryDir = (dir: string): StoryCoverInput & { manuscriptPath: string } => {
  const md = readdirSync(dir).filter((f) => f.endsWith(".md") && !/^cover/i.test(f));
  if (md.length === 0) throw new Error(`no manuscript (.md) in ${dir}`);
  const manuscriptPath = join(dir, md[0]);
  const { title, chapters } = parseManuscript(readFileSync(manuscriptPath, "utf8"));
  if (chapters.length === 0) throw new Error(`${manuscriptPath} has no "## Chapter" sections`);
  const paramsPath = join(dir, "run-params.json");
  const p: Record<string, unknown> = existsSync(paramsPath) ? JSON.parse(readFileSync(paramsPath, "utf8")) : {};
  return {
    title,
    era: clean(p.eraPreference),
    locationPreset: clean(p.locationPreset),
    tone: clean(p.tone),
    primaryAxis: clean(p.primaryAxis),
    storyAngle: clean(p.storyAngle),
    openingText: chapters.slice(0, OPENING_CHAPTERS).join("\n\n"),
    manuscriptPath,
  };
};

/**
 * Build the input from an in-memory pipeline result (API / canary path), where the CML gives a better
 * era and setting than the request did.
 */
export const storyInputFromRun = (args: {
  title: string;
  prose: { chapters?: Array<{ paragraphs?: unknown[]; text?: unknown }> } | null | undefined;
  inputs?: Record<string, unknown>;
  cml?: Record<string, any> | null;
  author?: string;
}): StoryCoverInput => {
  const chapters = Array.isArray(args.prose?.chapters) ? args.prose!.chapters! : [];
  const openingText = chapters
    .slice(0, OPENING_CHAPTERS)
    .map((ch) => (Array.isArray(ch.paragraphs) ? ch.paragraphs.filter((x) => typeof x === "string").join("\n\n") : String(ch.text ?? "")))
    .join("\n\n");
  const meta = args.cml?.CASE?.meta ?? {};
  const era = clean(meta.era?.decade) ?? clean(typeof meta.era === "string" ? meta.era : undefined) ?? clean(args.inputs?.eraPreference);
  const setting =
    [clean(meta.setting?.place), clean(meta.setting?.location)].filter(Boolean).join(", ") ||
    clean(typeof meta.setting === "string" ? meta.setting : undefined);
  return {
    title: args.title,
    author: args.author,
    era,
    locationPreset: clean(args.inputs?.locationPreset),
    tone: clean(args.inputs?.tone),
    primaryAxis: clean(args.inputs?.primaryAxis),
    storyAngle: clean(args.inputs?.storyAngle),
    setting,
    openingText,
  };
};
