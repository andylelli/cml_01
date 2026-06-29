/**
 * The production rubric judge (aligning-the-scoring-system.md §8.1 → §8.2).
 *
 * `createLLMRubricJudge` wraps ANY chat function into a `RubricJudge`. It keeps `@cml/rubric-score`
 * pure: the package takes no LLM-client dependency — the caller passes a `ChatFn` (e.g. a thin wrapper
 * over `AzureOpenAIClient.chat`). This is the single non-deterministic seam; everything downstream
 * (the hard caps) is deterministic.
 */

import type { JudgeRequest, JudgeResult, RubricJudge } from "./score.js";
import type { FlagCitation } from "./structural-verifiers.js";
import { CATEGORIES, type Category, type CategoryMark, type RubricScore, type StoryFacts } from "./types.js";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatArgs {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  model?: string;
}

/** Minimal chat contract (AzureOpenAIClient.chat satisfies this). */
export type ChatFn = (args: ChatArgs) => Promise<{ content: string }>;

export interface LLMJudgeOptions {
  model?: string;
  /** Low by default — the rubric judge must be reproducible. */
  temperature?: number;
  maxTokens?: number;
}

export function createLLMRubricJudge(chat: ChatFn, opts: LLMJudgeOptions = {}): RubricJudge {
  return async (req: JudgeRequest): Promise<JudgeResult> => {
    const res = await chat({
      model: opts.model,
      messages: [
        { role: "system", content: req.systemPrompt },
        { role: "user", content: req.userMessage },
      ],
      temperature: opts.temperature ?? 0.2,
      maxTokens: opts.maxTokens ?? 4000,
      jsonMode: true,
    });
    return parseJudgeResult(res.content);
  };
}

/** Map a model's free-form category label to a canonical `Category`. */
function normalizeCategory(raw: unknown): Category | undefined {
  const k = String(raw ?? "").toLowerCase().replace(/[^a-z]+/g, "_").replace(/^_+|_+$/g, "");
  if (!k) return undefined;
  const table: Record<string, Category> = {
    premise: "premise", premise_concept: "premise", concept: "premise",
    opening_hook: "opening_hook", opening: "opening_hook", hook: "opening_hook",
    plot_structure: "plot_structure", plot: "plot_structure", structure: "plot_structure",
    character_clarity: "character_clarity", character: "character_clarity", characters: "character_clarity", clarity: "character_clarity",
    dialogue: "dialogue",
    atmosphere: "atmosphere", setting: "atmosphere", atmosphere_setting: "atmosphere",
    clues: "clues", mystery_clues: "clues", evidence: "clues", evidence_logic: "clues", mystery_clues_evidence_logic: "clues",
    pacing: "pacing",
    ending: "ending", reveal: "ending", ending_reveal: "ending",
    prose: "prose", polish: "prose", prose_polish: "prose",
  };
  return table[k] ?? CATEGORIES.find((c) => k.includes(c) || c.includes(k));
}

const num = (...vals: unknown[]): number => {
  for (const v of vals) if (typeof v === "number" && Number.isFinite(v)) return v;
  return 0;
};

/** Parse a judge response into `{ rubric, flags }`, tolerant of code fences, alt keys, and missing fields. */
export function parseJudgeResult(content: string): JudgeResult {
  const obj = JSON.parse(stripFences(content)) as Record<string, unknown>;
  // A_55 (critical): some judge outputs (gpt-4.1-mini) return `categories` as an OBJECT MAP keyed by
  // category name (`{ premise: {mark,reason}, opening_hook: {...}, … }`) instead of the schema's ARRAY.
  // The old `Array.isArray(...) ? ... : []` silently produced [] → the whole score collapsed to a FALSE
  // raw 0 while the judge's own `total` (e.g. 73) was discarded. Accept both shapes: convert the map's
  // entries to the array form (key → category label), letting the normalizer below resolve the label.
  const rawCats: Array<Record<string, unknown>> = Array.isArray(obj.categories)
    ? (obj.categories as Array<Record<string, unknown>>)
    : obj.categories && typeof obj.categories === "object"
      ? Object.entries(obj.categories as Record<string, unknown>).map(([key, val]) => {
          const v = (val && typeof val === "object" ? (val as Record<string, unknown>) : {}) as Record<string, unknown>;
          return { ...v, category: v.category ?? key };
        })
      : [];
  // Normalize each category to { category, mark, reason }: tolerate `name`/`score`/`value` keys and,
  // when the label is missing, fall back to position (the schema requires the 10 in canonical order).
  const categories: CategoryMark[] = rawCats.map((c, i) => ({
    category: normalizeCategory(c.category ?? c.name ?? c.category_name ?? c.label) ?? CATEGORIES[i] ?? "prose",
    mark: Math.max(0, Math.min(10, num(c.mark, c.score, c.value, c.rating, c.out_of_10))),
    reason: String(c.reason ?? c.notes ?? c.note ?? c.comment ?? ""),
  }));
  const rubric: RubricScore = {
    categories,
    total: typeof obj.total === "number" ? obj.total : categories.reduce((s, c) => s + (c.mark ?? 0), 0),
    overall_view: typeof obj.overall_view === "string" ? obj.overall_view : "",
    what_works: asStringArray(obj.what_works),
    main_problems: asStringArray(obj.main_problems),
    chapter_issues: Array.isArray(obj.chapter_issues) ? (obj.chapter_issues as RubricScore["chapter_issues"]) : [],
    fastest_fixes: asStringArray(obj.fastest_fixes),
  };
  const flags = obj.flags && typeof obj.flags === "object" ? (obj.flags as StoryFacts) : undefined;
  const flagCitations = parseFlagCitations(obj.flag_citations);
  return { rubric, flags, flagCitations };
}

/** Parse the judge's per-flag citations (K2 §2), tolerant of alt key names and missing fields. */
function parseFlagCitations(raw: unknown): FlagCitation[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: FlagCitation[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const c = item as Record<string, unknown>;
    const flag = String(c.flag ?? c.condition ?? c.name ?? "").trim();
    if (!flag) continue;
    const chapterRaw = c.chapter ?? c.chapter_number ?? c.ch;
    const chapter = typeof chapterRaw === "number" && Number.isFinite(chapterRaw) ? chapterRaw : Number(chapterRaw);
    const sentence = String(c.sentence ?? c.quote ?? c.text ?? c.evidence ?? "").trim();
    out.push({ flag, chapter: Number.isFinite(chapter) ? chapter : undefined, sentence: sentence || undefined });
  }
  return out.length ? out : undefined;
}

function stripFences(s: string): string {
  const m = /```(?:json)?\s*([\s\S]*?)```/.exec(s);
  return (m ? m[1] : s).trim();
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}
