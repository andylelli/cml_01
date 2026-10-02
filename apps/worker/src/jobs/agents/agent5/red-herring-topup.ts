/**
 * A5-Q04 (owner decision, 2026-10-02) — a targeted red-herring top-up, placed AFTER separation.
 *
 * MEASURED (OPEN-QUESTIONS §1): red herrings are lost to deterministic pruning in
 * `separateRedHerringsFromSolution` (coverage-retries.ts), not to the model — 6 of 61 projects since
 * 2026-08-03 shipped 0 red herrings while the model had returned 2, and the floor (which runs BEFORE the
 * separation) fired 0 times. So the repair has to sit after the pruner.
 *
 * Flag `AGENT5_RED_HERRING_TOPUP`, default OFF, read at call time. OFF: returns its input untouched and
 * makes no call (byte-identical). ON, when fewer than RED_HERRING_BUDGET red herrings survived the
 * separation: ONE LLM call on Agent 5's client and label that asks ONLY for the missing red herrings,
 * carrying the false assumption and the true-solution correction vocabulary the pruner scores against; the
 * reply is validated through the same `separateRedHerringsFromSolution` (on the new entries alone), and
 * the survivors are appended. Never aborts: a failed call or a pruned reply leaves the input as it was.
 */
import { readBooleanFlag } from "@cml/cml";
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult, RedHerring } from "@cml/prompts-llm";
import { getGenerationParams } from "@cml/story-validation";
import type { OrchestratorContext } from "../shared.js";
import { getCaseBlock, isOverlapCandidateToken, normalizeTokens } from "../../clue-contracts/contracts.js";
import type { Agent5Run, Agent5State } from "./run-state.js";
import { RED_HERRING_BUDGET } from "./extraction.js";
import { separateRedHerringsFromSolution } from "./coverage-retries.js";

/** The agent label Agent 5's own calls carry — same cost bucket, same model routing (AGENT5_MODEL). */
const AGENT5_LABEL = "Agent5-ClueExtraction";

export function redHerringTopupEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("AGENT5_RED_HERRING_TOPUP", false, env);
}

/** The words `findRedHerringOverlapDetails` scores a red herring against: inference-step corrections. */
export function correctionVocabulary(cml: CaseData): string[] {
  const steps = getCaseBlock(cml)?.inference_path?.steps;
  if (!Array.isArray(steps)) return [];
  return [
    ...new Set(
      steps.flatMap((step) =>
        String(step?.correction ?? "")
          .toLowerCase()
          .split(/\s+/)
          .map((w: string) => w.replace(/[^a-z0-9]/g, ""))
          .filter((w: string) => isOverlapCandidateToken(w)),
      ),
    ),
  ];
}

export function buildRedHerringTopupPrompt(
  cml: CaseData,
  clues: ClueDistributionResult,
  missing: number,
): { system: string; user: string } {
  const caseBlock = getCaseBlock(cml);
  const statement = String(caseBlock?.false_assumption?.statement ?? "").trim();
  const why = String(caseBlock?.false_assumption?.why_it_seems_reasonable ?? "").trim();
  const culprits = (Array.isArray(caseBlock?.culpability?.culprits) ? caseBlock.culpability.culprits : [])
    .map((c: unknown) => String(c ?? "").trim())
    .filter(Boolean);
  const innocents = (Array.isArray(caseBlock?.cast) ? caseBlock.cast : [])
    .filter((m) => String(m?.culprit_eligibility ?? "").toLowerCase() === "eligible")
    .map((m) => String(m?.name ?? "").trim())
    .filter((name: string) => Boolean(name) && !culprits.includes(name));
  const forbidden = correctionVocabulary(cml);
  const preferred = normalizeTokens(`${statement} ${why}`).filter((t) => isOverlapCandidateToken(t));
  const existing = Array.isArray(clues.redHerrings) ? clues.redHerrings : [];

  const system =
    "You are Agent 5 of a Golden Age mystery pipeline, writing red herrings only. A red herring is a false trail: " +
    "evidence that makes the reader believe the case's false assumption and suspect an innocent person. " +
    "Output valid JSON only.";
  const lines = [
    `Write exactly ${missing} new red herring(s).`,
    "",
    `False assumption every red herring must support: "${statement}"`,
    why ? `Why it seems reasonable: "${why}"` : "",
    "",
    innocents.length > 0
      ? `Each red herring points at one of these innocent suspects: ${innocents.join(", ")}.`
      : "Each red herring points at an innocent member of the cast.",
    culprits.length > 0 ? `The culprit is ${culprits.join(", ")}; a red herring never points at the culprit.` : "",
    "",
    "Build each description and misdirection from the false assumption's own vocabulary:",
    preferred.length > 0 ? preferred.map((t) => `  - ${t}`).join("\n") : "  - (the false assumption's wording)",
    "",
    "The true solution is described with the words below. A red herring that uses them is removed automatically, so " +
      "none of these words may appear in any description or misdirection:",
    forbidden.length > 0 ? forbidden.map((t) => `  - ${t}`).join("\n") : "  - none",
    "",
    existing.length > 0
      ? `Red herrings already in the case (write different ones, with different ids):\n${existing
          .map((rh) => `  - ${rh.id}: ${rh.description}`)
          .join("\n")}`
      : "",
    "",
    'Return JSON: {"redHerrings":[{"id":"rh_<short_slug>","description":"...","supportsAssumption":"...","misdirection":"..."}]}',
  ];
  return { system, user: lines.filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n") };
}

/** Parse and shape-check the reply; ids are made unique against the red herrings already kept. */
export function parseTopupReply(content: string, existing: RedHerring[], missing: number): RedHerring[] {
  let data: any;
  try {
    data = JSON.parse(content);
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start < 0 || end <= start) return [];
    try {
      data = JSON.parse(content.slice(start, end + 1));
    } catch {
      return [];
    }
  }
  const raw = Array.isArray(data?.redHerrings) ? data.redHerrings : Array.isArray(data) ? data : [];
  const taken = new Set(existing.map((rh) => String(rh?.id ?? "").trim()));
  const out: RedHerring[] = [];
  for (const entry of raw) {
    const description = String(entry?.description ?? "").trim();
    if (!description) continue;
    let id = String(entry?.id ?? "").trim() || `rh_topup_${out.length + 1}`;
    while (taken.has(id)) id = `${id}_b`;
    taken.add(id);
    out.push({
      id,
      description,
      supportsAssumption: String(entry?.supportsAssumption ?? "").trim(),
      misdirection: String(entry?.misdirection ?? "").trim(),
    });
    if (out.length >= missing) break;
  }
  return out;
}

class TopupRejected extends Error {}

export async function topUpRedHerringsAfterSeparation(
  ctx: OrchestratorContext,
  run: Agent5Run,
  state: Agent5State,
  clues: ClueDistributionResult,
): Promise<ClueDistributionResult> {
  if (!redHerringTopupEnabled()) return clues;
  const kept: RedHerring[] = Array.isArray(clues.redHerrings) ? clues.redHerrings : [];
  const missing = RED_HERRING_BUDGET - kept.length;
  if (missing <= 0) return clues;

  const started = Date.now();
  const prompt = buildRedHerringTopupPrompt(ctx.cml!, clues, missing);
  const config = getGenerationParams().agent5_clues.params;
  let proposed: RedHerring[] = [];
  try {
    const response = await ctx.client.chat({
      // resolveDesignModel()'s value (prompts-llm does not export it); the AGENT5_MODEL route applies by label.
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME_DESIGN || process.env.AZURE_OPENAI_DEPLOYMENT_NAME || undefined,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      temperature: config.model.temperature,
      maxTokens: config.model.max_tokens,
      jsonMode: true,
      logContext: {
        runId: ctx.runId,
        projectId: ctx.projectId || "",
        agent: AGENT5_LABEL,
        retryAttempt: state.extractionAttempt++,
      },
    } as any);
    proposed = parseTopupReply(String(response?.content ?? ""), kept, missing);
  } catch (e) {
    ctx.warnings.push(`[A5-Q04] red-herring top-up call failed (${(e as Error)?.message ?? e}); keeping ${kept.length}/${RED_HERRING_BUDGET}`);
    return clues;
  } finally {
    try {
      // Cumulative byAgent total, as every Agent 5 call site assigns it (CR-06 / ORC-D03).
      const total = ctx.client.getCostTracker?.().getSummary?.().byAgent?.[AGENT5_LABEL];
      if (typeof total === "number") ctx.agentCosts["agent5_clues"] = total;
      ctx.agentDurations["agent5_clues"] = (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - started);
    } catch {
      /* accounting never costs a run */
    }
  }

  // Validate through the SAME separation, on the new entries alone: survivors already passed it, and a
  // second sanitizer pass over them would rewrite text that is already clean. The separation's abort
  // path is turned into a rejection of the top-up, never of the run.
  const scratch: ClueDistributionResult = { ...clues, redHerrings: proposed };
  const scratchCtx = { ...ctx, warnings: [] as string[] } as OrchestratorContext;
  const scratchRun: Agent5Run = {
    ...run,
    failAgent5: (message: string): never => {
      throw new TopupRejected(message);
    },
  };
  let survivors: RedHerring[] = [];
  try {
    const separated = await separateRedHerringsFromSolution(scratchCtx, scratchRun, state, scratch);
    survivors = Array.isArray(separated.redHerrings) ? separated.redHerrings : [];
  } catch (e) {
    if (!(e instanceof TopupRejected)) throw e;
    survivors = [];
  }
  scratchCtx.warnings.forEach((w) => ctx.warnings.push(`[A5-Q04] ${w}`));
  const appended = survivors.slice(0, missing);
  clues.redHerrings = [...kept, ...appended];
  ctx.warnings.push(
    `[A5-Q04] red-herring top-up after separation: ${kept.length} survived, asked for ${missing}, ` +
      `model returned ${proposed.length}, ${appended.length} passed separation — now ${clues.redHerrings.length}/${RED_HERRING_BUDGET}` +
      (appended.length > 0 ? ` (${appended.map((rh) => rh.id).join(", ")})` : ""),
  );
  return clues;
}
