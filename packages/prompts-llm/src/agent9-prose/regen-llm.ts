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

/** Build the (system, user) messages for a single scoped regen. Pure. */
export function buildRegenPrompt(req: RegenRequest): { system: string; user: string } {
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
    "Preserve every other sentence verbatim. Do not reorder events, add or remove characters, or change who is implicated or cleared.",
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
    "Return EXACTLY this schema and nothing else:",
    '{"chapter":{"title":"...","summary":"...","paragraphs":["...","..."]}}',
    "SOURCE CHAPTER JSON:",
    JSON.stringify({ title: req.chapter.title, summary: req.chapter.summary, paragraphs: req.chapter.paragraphs }),
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
}

/**
 * Adapt an LLM client into the `RegenFn` the repair loop calls. The returned function builds the
 * scoped prompt, calls the model once, and parses the single-chapter payload. Any throw/parse failure
 * propagates to the loop, which treats it as a failed attempt (then retries or falls to the logged
 * floor) — it never crashes the run.
 */
export function makeRegenFn(opts: MakeRegenFnOptions): RegenFn {
  return async (req: RegenRequest): Promise<ProseChapter> => {
    const { system, user } = buildRegenPrompt(req);
    const response = await opts.client.chat({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      model: opts.model,
      temperature: opts.temperature ?? 0.3,
      maxTokens: opts.maxTokens ?? 4000,
      jsonMode: true,
      logContext: {
        runId: opts.runId ?? "",
        projectId: opts.projectId ?? "",
        agent: `Agent9-Regen-Ch${req.defect.chapter}-${req.defect.kind}`,
      },
    });
    return parseExpandedChapterResponse(response.content);
  };
}
