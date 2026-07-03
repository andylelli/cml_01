/**
 * Agent 3b — Independent Mechanism-Plausibility Judge (ANALYSIS_50 P2.2 / T2.4).
 *
 * A focused, separate LLM call (NOT the generator self-checking) that answers one question:
 * given the era's physics and this scene, does this mechanism actually work? It returns a
 * structured verdict with a 0–100 score and reasons. A device scoring below the floor (≥80)
 * is regenerated with the failure reasons fed back — "this doesn't work" is a first-class path
 * (documentation/12_system_redesign/08_agent_3b_hard_logic_devices.md §4.3).
 *
 * Default OFF. shadow = score + log only (no behaviour change, telemetry). enforce = bounded
 * regenerate-with-feedback, accept-best-by-score, never throws (the judge swallows its own errors
 * to ran:false so a sampling artefact can never abort a logically sound build).
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import { resolveDesignModel } from "./utils/model-tiers.js";
import type { HardLogicDeviceIdea } from "./types.js";

/** Hard floor for the plausibility verdict (ANALYSIS_50 §5 P2.2). */
export const AGENT3B_PLAUSIBILITY_FLOOR = 80;

export type PlausibilityJudgeMode = "off" | "shadow" | "enforce";

/** Mirror of the AGENT2B_VOICE_CHECK / AGENT6_REVEAL_GATE parsing. Default OFF. */
export const parsePlausibilityJudgeMode = (raw: string | undefined): PlausibilityJudgeMode => {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!v || v === "off" || v === "false" || v === "0") return "off";
  if (v === "enforce") return "enforce";
  return "shadow";
};

/** A score passes the gate iff it is a finite number ≥ the floor. */
export const plausibilityGatePass = (score: number): boolean =>
  Number.isFinite(score) && score >= AGENT3B_PLAUSIBILITY_FLOOR;

export interface PlausibilityJudgeResult {
  /** false when the judge did not run (disabled, missing device, or swallowed error). */
  ran: boolean;
  /** 0–100; 0 when not run. */
  score: number;
  verdict: "pass" | "fail";
  reasons: string[];
  suggestions: string[];
  /** per-invocation cost delta in USD. */
  cost: number;
  durationMs: number;
  error?: string;
}

export interface PlausibilityJudgeContext {
  decade: string;
  location?: string;
  institution?: string;
  runId?: string;
  projectId?: string;
}

const JUDGE_AGENT_LABEL = "Agent3b-PlausibilityJudge";

const clampScore = (value: unknown): number => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
};

const asStringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map((v) => String(v ?? "").trim()).filter((v) => v.length > 0)
    : typeof value === "string" && value.trim()
      ? [value.trim()]
      : [];

export const buildPlausibilityJudgePrompt = (
  device: HardLogicDeviceIdea,
  ctx: PlausibilityJudgeContext,
): { system: string; user: string } => {
  const era = String(ctx.decade ?? "").trim() || "the period";
  const scene = [ctx.location, ctx.institution].filter(Boolean).join(", ");
  const hasValues = !!(device.lockedFacts && device.lockedFacts.length > 0);
  const system =
    "You are an exacting physical-plausibility judge for Golden Age detective fiction. You assess ONE " +
    "mechanism against the real physics, chemistry, and engineering available in the stated era. You are " +
    "allowed — expected — to say a mechanism does not work. Do not reward cleverness over correctness. " +
    "Respond with strict JSON: " +
    '{ "score": <0-100 integer>, "reasons": ["why it does or does not work"], ' +
    '"suggestions": ["concrete fixes if it does not"] }. ' +
    "score ≥ 80 means a knowledgeable reader of the era would accept it as genuinely workable; " +
    "below 80 means a real physical flaw, anachronism, a hand-wave, " +
    // RC3.2 — magnitude/decisiveness: a mechanism can be DIRECTIONALLY real yet quantitatively far too
    // small to cause the plot consequence it is claimed to cause (e.g. thermal expansion of a metal rod
    // producing a decisive, minutes-scale timing shift). That is a failure, not a pass.
    "or an effect whose real-world MAGNITUDE is far too small to produce the plot consequence it is " +
    "claimed to cause. A mechanism that is directionally real but quantitatively negligible (e.g. thermal " +
    "expansion of a metal rod producing a decisive, minutes-scale timing shift) MUST score below 80.";
  const user =
    `Era: ${era}${scene ? `\nScene: ${scene}` : ""}\n\n` +
    `Mechanism title: ${device.title}\n` +
    `Core principle (${device.principleType}): ${device.corePrinciple}\n` +
    `Surface illusion: ${device.surfaceIllusion}\n` +
    `Underlying reality (the physical claim to judge): ${device.underlyingReality}\n` +
    (hasValues
      ? `Concrete physical values: ${device.lockedFacts!.map((f) => `${f.id}=${f.value}`).join("; ")}\n`
      : "") +
    `\nGiven the era's real physics and this scene, does this mechanism actually work? ` +
    (hasValues
      ? `Using the concrete values above, estimate the ORDER OF MAGNITUDE of the effect and state whether ` +
        `it is large enough to cause the described plot consequence. If the effect is real but too small ` +
        `to be decisive, that is a failure (score < 80). `
      : `Consider whether the effect's magnitude is large enough to be decisive, not merely directionally real. `) +
    `Judge only the underlying reality, not the prose. Return JSON only.`;
  return { system, user };
};

/**
 * Run the judge on a single device. Never throws — any error resolves to ran:false so the caller
 * can decide (shadow logs, enforce keeps the best-so-far). Returns the per-invocation cost delta.
 */
export async function judgeMechanismPlausibility(
  client: AzureOpenAIClient,
  device: HardLogicDeviceIdea | undefined | null,
  ctx: PlausibilityJudgeContext,
): Promise<PlausibilityJudgeResult> {
  const empty: PlausibilityJudgeResult = {
    ran: false,
    score: 0,
    verdict: "fail",
    reasons: [],
    suggestions: [],
    cost: 0,
    durationMs: 0,
  };
  if (!device || typeof device !== "object") return empty;

  const startTime = Date.now();
  const costTracker = client.getCostTracker();
  const costBefore = costTracker.getSummary().byAgent[JUDGE_AGENT_LABEL] || 0;
  try {
    const { system, user } = buildPlausibilityJudgePrompt(device, ctx);
    const response = await client.chat({
      model: resolveDesignModel(),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      jsonMode: true,
      logContext: {
        runId: ctx.runId || "unknown",
        projectId: ctx.projectId || "unknown",
        agent: JUDGE_AGENT_LABEL,
      },
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.content);
    } catch {
      const match = response.content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    const score = clampScore(parsed?.score);
    const durationMs = Date.now() - startTime;
    const cost = (costTracker.getSummary().byAgent[JUDGE_AGENT_LABEL] || 0) - costBefore;
    return {
      ran: true,
      score,
      verdict: plausibilityGatePass(score) ? "pass" : "fail",
      reasons: asStringList(parsed?.reasons),
      suggestions: asStringList(parsed?.suggestions),
      cost,
      durationMs,
    };
  } catch (error) {
    return {
      ...empty,
      durationMs: Date.now() - startTime,
      cost: (costTracker.getSummary().byAgent[JUDGE_AGENT_LABEL] || 0) - costBefore,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/** Turn a failing verdict into a concrete, de-duplicated regeneration instruction. */
export const buildPlausibilityJudgeFeedback = (result: PlausibilityJudgeResult): string => {
  const lines: string[] = [];
  const seen = new Set<string>();
  const push = (s: string) => {
    const t = s.trim();
    const key = t.toLowerCase();
    if (t && !seen.has(key)) {
      seen.add(key);
      lines.push(t);
    }
  };
  result.reasons.forEach((r) => push(`Plausibility flaw: ${r}`));
  result.suggestions.forEach((s) => push(`Fix: ${s}`));
  const header =
    `The primary mechanism scored ${result.score}/100 on independent physical plausibility ` +
    `(floor ${AGENT3B_PLAUSIBILITY_FLOOR}). Regenerate so the underlying reality genuinely works ` +
    `in the stated era.`;
  return [header, ...lines].join("\n");
};
