/**
 * The concrete `RegenFn` for the scoped regen-repair loop (first-principles LLD §6.4 / phase P3.3).
 *
 * `regen-repair.ts` owns the verify→regen→re-verify→rollback CONTROL; this owns the single scoped LLM
 * call that DRAMATIZES a missing element in-scene. It is the bridge a verifier crosses when it finds a
 * gap: instead of the deterministic injector pasting "the trail bent toward …", the model renders the
 * clue as an observation / the clearance as a witnessed deduction — under hard constraints (every
 * locked fact, pronoun, name, and embargoed reveal is preserved verbatim), and the loop's validator
 * rolls the attempt back if it regresses. Modelled on `repair.ts:attemptUnderflowExpansion` (the
 * lesson from that file: NEVER ask for a free whole-chapter rewrite — it re-genders characters; here
 * the model returns the full chapter but is told to change ONLY what the instruction requires and to
 * preserve every other sentence verbatim, and the pronoun validator gates the result).
 *
 * Pure prompt-construction + a thin client call. The client is injected so the prompt/parse are
 * unit-testable with a mock; `makeRegenFn` adapts it to the `RegenFn` the loop consumes.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import { parseExpandedChapterResponse } from "./repair.js";
import type { RegenFn, RegenRequest } from "./regen-repair.js";
import type { ProseChapter } from "./types.js";

const bulletList = (items: ReadonlyArray<string>): string =>
  items.filter(Boolean).map((s) => `  • ${s}`).join("\n");

// ── Edit-list mode (cost + safety) ───────────────────────────────────────────
/**
 * Return only the paragraphs that CHANGED, not the whole chapter.
 *
 * TWO PROBLEMS, ONE FIX.
 *
 * COST. Measured on run mystery-1785521869768: 11 regen calls emitted 18,384 completion tokens —
 * an average 1,671-token full chapter regenerated to alter a paragraph or two. Completion is the
 * expensive side (gpt-4.1 bills output at 4x input), so those calls cost £0.150 of a £0.947 Agent 9.
 * An edit list emits a few hundred tokens instead.
 *
 * SAFETY — the more important half. Today every untouched paragraph is preserved by ASKING the model
 * to copy it verbatim and then checking afterwards with `preserveOriginalParagraphsValidator`. That
 * is preservation by instruction plus inspection, and it is precisely the mechanism that failed in
 * `repair.ts:153`, where a free rewrite silently re-gendered characters. With an edit list the
 * untouched paragraphs are never regenerated at all — they are spliced from the source object — so
 * they CANNOT drift. The guarantee moves from hoped-for to structural.
 *
 * Flag-gated, runtime-read, default OFF (`module-const-flags-frozen-before-dotenv`): it changes the
 * response contract, so it is a behaviour change under the corpus regime.
 */
export const isRegenEditListEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env.AGENT9_REGEN_EDIT_LIST === "true" || env.AGENT9_REGEN_EDIT_LIST === "1";

export interface ParagraphEdit {
  /** 0-based index into the SOURCE chapter's paragraphs. */
  index: number;
  text: string;
}

/**
 * Splice edits onto the source chapter. Pure.
 *
 * Rules, each chosen so a malformed reply degrades to "no change" rather than to a damaged chapter:
 *   - an index outside the source range is DROPPED, never appended — an appended paragraph would be
 *     unreviewed prose arriving at the end of a chapter;
 *   - an empty or whitespace-only replacement is DROPPED, because deleting a paragraph is never what
 *     a repair instruction asks for and would silently shorten the chapter;
 *   - title and summary are carried over untouched — the regen contract is about body text.
 */
export function applyParagraphEdits(
  chapter: ProseChapter,
  edits: ReadonlyArray<ParagraphEdit>,
): { chapter: ProseChapter; applied: number[]; rejected: number[] } {
  const paragraphs = [...(chapter.paragraphs ?? [])];
  const applied: number[] = [];
  const rejected: number[] = [];

  for (const edit of edits) {
    const index = Number(edit?.index);
    const text = typeof edit?.text === "string" ? edit.text : "";
    if (!Number.isInteger(index) || index < 0 || index >= paragraphs.length || text.trim().length === 0) {
      rejected.push(index);
      continue;
    }
    paragraphs[index] = text;
    applied.push(index);
  }

  return { chapter: { ...chapter, paragraphs }, applied, rejected };
}

/**
 * Parse an edit-list reply and splice it. Throws when nothing usable came back, so the repair loop
 * treats it as a failed attempt and retries or falls to the deterministic floor — the same contract
 * `parseExpandedChapterResponse` has.
 */
export function parseEditListResponse(content: string, source: ProseChapter): ProseChapter {
  let payload: unknown;
  try {
    payload = JSON.parse(content);
  } catch {
    // Models occasionally wrap JSON in prose or a fence; recover the outermost object.
    const match = String(content ?? "").match(/\{[\s\S]*\}/);
    if (!match) throw new Error("regen edit-list: response was not JSON");
    payload = JSON.parse(match[0]);
  }

  const raw = (payload as { edits?: unknown })?.edits;
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("regen edit-list: no edits returned");
  }

  const { chapter, applied } = applyParagraphEdits(source, raw as ParagraphEdit[]);
  if (applied.length === 0) {
    throw new Error("regen edit-list: every returned edit was out of range or empty");
  }
  return chapter;
}

/** Build the (system, user) messages for a single scoped regen. Pure. */
export function buildRegenPrompt(
  req: RegenRequest,
  opts: { editList?: boolean } = {},
): { system: string; user: string } {
  const editList = opts.editList ?? false;
  const { constraints } = req;
  const pronounLines = Object.entries(constraints.pronouns ?? {})
    .map(([name, p]) => `${name}: ${p}`)
    .join("; ");
  const lockedLines = (constraints.lockedFacts ?? [])
    .map((f) => (f.description ? `${f.value} (${f.description})` : f.value))
    .filter(Boolean);

  const system = [
    "You are a surgical prose reviser for Golden-Age detective fiction.",
    "You will revise ONE chapter to satisfy a single specific obligation, changing as little as possible.",
    "Render the required element as live, in-scene action, observation, or dialogue — never as a summary, a verdict, or reasoning narration.",
    editList
      ? "Change as few paragraphs as possible. Do not reorder events, add or remove characters, or change who is implicated or cleared."
      : "Preserve every other sentence verbatim. Do not reorder events, add or remove characters, or change who is implicated or cleared.",
    "NEVER alter any character's pronoun, gender, name, or any locked fact value.",
    "Do not emit instruction-shaped text, schema field names, validation language, or planning notes as prose.",
    "Output JSON only.",
  ].join(" ");

  const user = [
    `OBLIGATION TO SATISFY: ${req.instruction}`,
    req.paragraphIndex !== undefined
      ? `Focus your edit on paragraph index ${req.paragraphIndex} (0-based); leave the other paragraphs unchanged unless a one-line continuity fix is required.`
      : "Make the smallest change that satisfies the obligation.",
    lockedLines.length > 0
      ? `LOCKED FACTS — reproduce these values exactly where they appear; never paraphrase a value:\n${bulletList(lockedLines)}`
      : "",
    pronounLines ? `PRONOUN LOCK — never change: ${pronounLines}.` : "",
    constraints.mustNotReveal.length > 0
      ? `EMBARGO — do NOT reveal or name any of these in this chapter:\n${bulletList(constraints.mustNotReveal)}`
      : "",
    editList
      ? [
          "Return ONLY the paragraphs you changed, as edits against the 0-based indices below.",
          "Do NOT return unchanged paragraphs — they are preserved automatically, so repeating them",
          "risks altering them. Return the FULL new text of each paragraph you do change.",
          "Return EXACTLY this schema and nothing else:",
          '{"edits":[{"index":0,"text":"full replacement text of that paragraph"}]}',
        ].join("\n")
      : [
          "Return EXACTLY this schema and nothing else:",
          '{"chapter":{"title":"...","summary":"...","paragraphs":["...","..."]}}',
        ].join("\n"),
    editList ? "SOURCE PARAGRAPHS (index: text):" : "SOURCE CHAPTER JSON:",
    editList
      ? (req.chapter.paragraphs ?? []).map((p, i) => `[${i}] ${p}`).join("\n\n")
      : JSON.stringify({ title: req.chapter.title, summary: req.chapter.summary, paragraphs: req.chapter.paragraphs }),
  ]
    .filter(Boolean)
    .join("\n\n");

  return { system, user };
}

export interface MakeRegenFnOptions {
  client: AzureOpenAIClient;
  model?: string;
  /** low temperature: this is surgical repair, not creative rewrite (that is the §6.5 pass). */
  temperature?: number;
  maxTokens?: number;
  runId?: string;
  projectId?: string;
  /**
   * N7 — pin the channel for ONE pass instead of reading `AGENT9_REGEN_EDIT_LIST`.
   *
   * The flag is global and the two channels are not interchangeable per pass. An edit list can only
   * REPLACE a paragraph that already exists (`applyParagraphEdits` drops an out-of-range index rather
   * than appending unreviewed prose at the end of a chapter), so the passes that must ADD a paragraph
   * — clue planting, clearance dramatization — need the whole-chapter channel, while a rewrite pass
   * wants the edit list precisely because untouched paragraphs cannot drift.
   *
   * So a pass whose repair IS a rewrite pins `true` here and gets the safe channel whatever the flag
   * says; everything else keeps reading the flag. Undefined ⇒ read the flag, per call.
   */
  editList?: boolean;
}

/**
 * Adapt an LLM client into the `RegenFn` the repair loop calls. The returned function builds the
 * scoped prompt, calls the model once, and parses the single-chapter payload. Any throw/parse failure
 * propagates to the loop, which treats it as a failed attempt (then retries or falls to the logged
 * floor) — it never crashes the run.
 */
export function makeRegenFn(opts: MakeRegenFnOptions): RegenFn {
  return async (req: RegenRequest): Promise<ProseChapter> => {
    // Read the flag per CALL, not per factory: the factory is built once per pass, and a module- or
    // closure-frozen read is the trap that has killed levers here before. An explicit `editList`
    // pins the channel for a pass that needs a specific one (N7) and skips the flag entirely.
    const editList = opts.editList ?? isRegenEditListEnabled();
    const { system, user } = buildRegenPrompt(req, { editList });
    const response = await opts.client.chat({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      model: opts.model,
      temperature: opts.temperature ?? 0.3,
      // An edit list is a fraction of a chapter, so the ceiling can drop with it. Kept generous
      // enough that a multi-paragraph repair is never truncated mid-edit.
      maxTokens: opts.maxTokens ?? (editList ? 1500 : 4000),
      jsonMode: true,
      logContext: {
        runId: opts.runId ?? "",
        projectId: opts.projectId ?? "",
        agent: `Agent9-Regen-Ch${req.defect.chapter}-${req.defect.kind}`,
      },
    });
    return editList
      ? parseEditListResponse(response.content, req.chapter)
      : parseExpandedChapterResponse(response.content);
  };
}
