/**
 * Agent 7.5 — the Story Geometry compiler.
 *
 * Design: architecture/GEOMETRY-AGENT-DESIGN.md · concept: architecture/STORY-GEOMETRY.md
 *
 * Five responsibilities and nothing else: derive the manuscript contract from the frozen CML plus
 * the Agent-7 outline; resolve the two creative choices the case model deliberately leaves open;
 * close the time model; trigger bounded outline repair when the contract cannot be closed; and own
 * the post-prose acceptance test (which lives in Agent 9, where the manuscript is).
 *
 * WHAT IT MUST NEVER DO (§3), because each line is a boundary someone will be tempted to cross:
 * write or edit prose, invent a case fact, invent a clue, assign a scene or order a beat, re-audit
 * fair play, score anything, or abort a run.
 *
 * WHY IT IS MOSTLY DETERMINISTIC. The finding that shaped the design is that this project has made
 * the derive-don't-police turn three times — `@cml/beat-scheduler`, `@cml/clue-spec`,
 * `timeline-deception.ts` — and wired in none of them. Geometry is therefore not mainly a missing
 * capability; it is a missing integration point. This stage is the place that owns them, runs them
 * together, and reports the result. `checkCaseTimelineDeception` is called here for the first time
 * since it was written.
 */

// X39 — the case's two temporal spines, checked while a repair is still cheap (REVIEW_09 §3).
import { checkCaseTimelineDeception, checkCaseTimeCoherence } from "@cml/prompts-llm";
import {
  applyGeometryOutlineRepair,
  caseOf,
  deriveStoryGeometry,
  roleOf,
  type GeometryClue,
  type GeometryResolution,
  type StoryGeometry,
} from "@cml/story-geometry";

import { type OrchestratorContext } from "./shared.js";

// ── flags (runtime getters, never module consts — the dotenv-freeze trap) ─────

export type GeometryStageMode = "off" | "shadow" | "gate";

/**
 * `off` — the stage does not run.
 * `shadow` — derive, close, report. Changes nothing (default). This is Phase 1 of the build
 *            sequence: it costs no LLM call and no behaviour, and it is what makes the contract
 *            checkable against manuscripts we already have.
 * `gate` — additionally applies bounded, additive outline repair and warns loudly on what is left.
 *          Never an abort: the gate binds the OUTLINE, and the manuscript path only regenerates
 *          (ADR-0003).
 */
export const resolveGeometryStageMode = (env: NodeJS.ProcessEnv = process.env): GeometryStageMode => {
  const raw = String(env.AGENT75_GEOMETRY ?? "").trim().toLowerCase();
  if (raw === "off" || raw === "0" || raw === "false" || raw === "no") return "off";
  if (raw === "gate" || raw === "on" || raw === "1" || raw === "true") return "gate";
  return "shadow";
};

/**
 * The one LLM call (§6): which trace is the clincher, and whom does the false solution accuse.
 *
 * Default OFF, and the deterministic path is complete without it — a stage whose derivation depends
 * on a call it might not make is a stage that reports "unavailable" the first time the cheap
 * deployment hiccups. When on, it costs roughly £0.002 against the ~£0.24 of repair per run the
 * contract exists to prevent.
 */
const isGeometryResolveEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT75_GEOMETRY_RESOLVE ?? ""));

// ── the open-choice resolve ──────────────────────────────────────────────────

const RESOLVE_SYSTEM =
  "You are a Golden Age detective-fiction editor. You are given a finished, frozen case file and the " +
  "clues it already contains. You make exactly two selections. You never invent a clue, a character, " +
  "or a fact, and you never write prose.";

const buildResolvePrompt = (caseData: any, clues: ReadonlyArray<GeometryClue>): string => {
  const culprit = String((caseData?.culpability?.culprits ?? [])[0] ?? "");
  const suspects = ((caseData?.cast ?? []) as any[])
    .filter((c) => {
      const role = roleOf(c);
      return !role.includes("detective") && !role.includes("victim") && String(c?.name ?? "") !== culprit;
    })
    .map((c) => String(c?.name ?? "").trim())
    .filter(Boolean);
  const clueLines = clues
    .map((c) => `  - ${c.id} [${c.category ?? "?"}/${c.criticality ?? "?"}] ${String(c.description ?? "").slice(0, 180)}`)
    .join("\n");

  return [
    `CULPRIT: ${culprit || "(unstated)"}`,
    `DEATH METHOD: ${String(caseData?.death_method ?? "(unstated)")}`,
    `OTHER SUSPECTS: ${suspects.join(", ") || "(none listed)"}`,
    ``,
    `EXISTING CLUES (you must choose from these — do not invent one):`,
    clueLines || "  (none)",
    ``,
    `Make two selections:`,
    `1. THE CLINCHER — which single clue above is the physical trace that only ${culprit || "the culprit"} could`,
    `   have left? Prefer a concrete physical object or mark over testimony. Return its id, and a one-line`,
    `   restatement of what it physically is (not a sentence of prose — a description of the object).`,
    `2. THE FALSE ACCUSED — which of the other suspects does the story's false solution accuse? It must NOT`,
    `   be ${culprit || "the culprit"}.`,
    ``,
    `Reply as JSON: {"clincher_clue_id": string, "clincher_trace": string, "false_solution_accused": string}`,
  ].join("\n");
};

/**
 * Ask, then verify. The reply is only used where it names something that already exists — an unknown
 * clue id or an accused who is the culprit is discarded and the derivation falls back. A resolve that
 * could invent a clue would breach §3 through the back door.
 */
const resolveOpenChoices = async (
  ctx: OrchestratorContext,
  clues: ReadonlyArray<GeometryClue>,
): Promise<{ resolution: GeometryResolution | null; cost: number }> => {
  const caseData = caseOf(ctx.cml);
  const costBefore = ctx.client.getCostTracker().getTotalCost();
  try {
    const response = await ctx.client.chat({
      messages: [
        { role: "system", content: RESOLVE_SYSTEM },
        { role: "user", content: buildResolvePrompt(caseData, clues) },
      ],
      temperature: 0.2,
      maxTokens: 400,
      jsonMode: true,
      logContext: {
        runId: ctx.runId,
        projectId: ctx.projectId ?? "",
        agent: "Agent75-StoryGeometry",
      },
    } as any);

    const parsed = JSON.parse(response.content) as Record<string, unknown>;
    const clueId = String(parsed.clincher_clue_id ?? "").trim();
    const trace = String(parsed.clincher_trace ?? "").trim();
    const accused = String(parsed.false_solution_accused ?? "").trim();

    const culprit = String((caseData?.culpability?.culprits ?? [])[0] ?? "").trim();
    const castNames = new Set(((caseData?.cast ?? []) as any[]).map((c) => String(c?.name ?? "").trim()));
    const knownClue = clues.some((c) => String(c.id ?? "") === clueId);

    return {
      resolution: {
        clincherClueId: knownClue ? clueId : null,
        clincherTrace: knownClue && trace ? trace : null,
        accused: accused && accused !== culprit && castNames.has(accused) ? accused : null,
      },
      cost: ctx.client.getCostTracker().getTotalCost() - costBefore,
    };
  } catch (err) {
    ctx.warnings.push(
      `[Agent 7.5] geometry resolve failed: ${err instanceof Error ? err.message : String(err)} — ` +
        `falling back to the deterministic selection.`,
    );
    return { resolution: null, cost: ctx.client.getCostTracker().getTotalCost() - costBefore };
  }
};

// ── the stage ────────────────────────────────────────────────────────────────

/** The clue shape geometry reads, mapped off the live Agent-5 distribution. */
const readClues = (ctx: OrchestratorContext): GeometryClue[] =>
  ((ctx.clues?.clues ?? []) as any[]).map((c) => ({
    id: String(c?.id ?? ""),
    description: typeof c?.description === "string" ? c.description : undefined,
    pointsTo: typeof c?.pointsTo === "string" ? c.pointsTo : undefined,
    category: typeof c?.category === "string" ? c.category : undefined,
    criticality: typeof c?.criticality === "string" ? c.criticality : undefined,
    keyTerms: Array.isArray(c?.keyTerms) ? c.keyTerms.map(String) : undefined,
    supportsInferenceStep: typeof c?.supportsInferenceStep === "number" ? c.supportsInferenceStep : undefined,
    isDeathMethodTell: c?.isDeathMethodTell === true,
  })).filter((c) => c.id);

const summarise = (geometry: StoryGeometry): string =>
  `chapters=${geometry.chapterCount} ` +
  `times=${geometry.timeModel.apparentTime ?? "?"}/${geometry.timeModel.trueTime ?? "?"} ` +
  `clincher=${geometry.clincher ? `${geometry.clincher.clueId ?? "unmapped"}@${geometry.clincher.plantByChapter}→${geometry.clincher.payoffChapter}` : "none"} ` +
  `method=${geometry.methodSignature ? `${geometry.methodSignature.method}@${geometry.methodSignature.plantChapter}` : "none"} ` +
  `contracts=${geometry.chapterContract.map((c) => `${c.chapter}:${c.role}`).join(",") || "none"} ` +
  `closed=${geometry.closure.closed}`;

/**
 * Derive the contract, close it against the outline, and publish it.
 *
 * Never throws into the run. A geometry stage that becomes a new abort class would be the exact
 * mistake §7 forbids — so every failure path ends in a warning, `ctx.storyGeometry` left undefined,
 * and the pipeline continuing as it does today.
 */
export async function runAgent75(ctx: OrchestratorContext): Promise<void> {
  const mode = resolveGeometryStageMode();
  if (mode === "off") return;

  // R5 — a resumed run inherits the contract rather than re-deriving a different one (§8.10). This
  // stage is deliberately NOT routed through the orchestrator's `stage()` guard: that guard enforces
  // a contiguous skip prefix, and a stage that legitimately produces nothing when `off` would close
  // the prefix and force every later stage to re-run. The artifact restore is enough.
  if (ctx.storyGeometry) {
    ctx.warnings.push("[Agent 7.5] geometry restored from artifact — contract inherited, not re-derived.");
    return;
  }

  const started = Date.now();
  let cost = 0;
  try {
    ctx.reportProgress("narrative", "Compiling story geometry...", 94);

    const caseData = caseOf(ctx.cml);
    const clues = readClues(ctx);

    // The directional invariant for false-time concealments. Built in response to an external review
    // that called the timeline "backwards", exported from its package — and, until this line, called
    // by no agent.
    const timelineViolations = checkCaseTimelineDeception(caseData).map((v) => ({
      code: v.code,
      message: v.message,
    }));

    let resolution: GeometryResolution | null = null;
    if (isGeometryResolveEnabled() && clues.length > 0) {
      const resolved = await resolveOpenChoices(ctx, clues);
      resolution = resolved.resolution;
      cost += resolved.cost;
    }

    const geometry = deriveStoryGeometry({
      cml: ctx.cml,
      clues,
      narrative: (ctx.narrative as any) ?? null,
      timelineViolations,
      // REVIEW_05 §10.2 (N2) — the device's other fixed clock values. Without them the two-time check
      // reports a locked timer setting as an incoherence the story invented.
      lockedFacts: ctx.lockedFactRegistry,
      resolution,
    });

    let repairs: string[] = [];
    if (mode === "gate" && !geometry.closure.closed) {
      // Bounded, additive, and re-checked. It buys outline repair before the expensive stage; it does
      // not stop the run. Calling it a hard gate would claim an enforcement strength it does not have.
      const result = applyGeometryOutlineRepair(geometry, (ctx.narrative as any) ?? null, ctx.cml);
      repairs = result.repairs;
    }

    /**
     * X39 (REVIEW_09 §3) — the case keeps time twice, and this is the first stage that can see both.
     *
     * Agent 3b owns the device's locked clock values; Agent 3 owns the mechanism's two anchors; and
     * geometry binds its whole time model to the latter. On the 08-15 run those were 8:15/8:45 while
     * the device locked 7:15/7:05 — and because locked facts are injected verbatim, the manuscript
     * printed the device's pair and the anchors reached the page ZERO times. Every temporal check that
     * run was measuring times the book does not contain, and the acceptance test could only say so
     * after £1 of prose had been written against them.
     *
     * Reported here, before the outline is spent on: a case that keeps time twice is an upstream
     * defect, and the manuscript-side `time_anchors_absent` is its symptom rather than its cause.
     */
    for (const violation of checkCaseTimeCoherence({
      lockedFacts: ctx.lockedFactRegistry ?? [],
      apparentTime: geometry.timeModel.apparentTime,
      actualTime: geometry.timeModel.trueTime,
    })) {
      ctx.warnings.push(`[X39] Agent 7.5 case-time incoherence (${violation.code}): ${violation.message}`);
    }

    ctx.storyGeometry = geometry;
    ctx.agentCosts["agent75_geometry"] = cost;
    ctx.agentDurations["agent75_geometry"] = Date.now() - started;

    console.info(`[Agent 7.5 geometry:${mode}] ${summarise(geometry)}`);
    if (repairs.length > 0) {
      ctx.warnings.push(`[Agent 7.5] bounded outline repair applied: ${repairs.join("; ")}.`);
    }
    if (!geometry.closure.closed) {
      // Loud, and then the run continues. An unclosable geometry is an upstream defect worth reading,
      // not a reason to throw away thirteen stages of work.
      ctx.warnings.push(
        `[Agent 7.5] GEOMETRY NOT CLOSED (${mode}) — ${geometry.closure.unmet.length} unmet: ` +
          geometry.closure.unmet.map((u) => `${u.field}/${u.code}`).join(", ") +
          `. First: ${geometry.closure.unmet[0]?.message ?? ""}`,
      );
    }
    for (const waived of geometry.closure.waived) {
      ctx.warnings.push(`[Agent 7.5] ${waived.field} waived — ${waived.reason}.`);
    }
    for (const note of geometry.closure.notes) {
      ctx.warnings.push(`[Agent 7.5] ${note}.`);
    }

    publishGeometryDiagnostic(ctx, mode, geometry, repairs);
  } catch (err) {
    // A new stage must not become a new abort class (§7, failure semantics).
    ctx.warnings.push(
      `[Agent 7.5] geometry unavailable: ${err instanceof Error ? err.message : String(err)} — pipeline continues unchanged.`,
    );
    ctx.agentDurations["agent75_geometry"] = Date.now() - started;
  }
}

/**
 * Publish the contract to the report, including the checks that passed.
 *
 * A zero that is never written is indistinguishable from a check that never ran — the A_70/A_71 rule,
 * and the exact defect that left the `[R4]` counters unreadable. `mode` is on the record too: a run
 * that shows no repairs because the stage was in shadow must not read like a run that needed none.
 */
function publishGeometryDiagnostic(
  ctx: OrchestratorContext,
  mode: GeometryStageMode,
  geometry: StoryGeometry,
  repairs: string[],
): void {
  const details = {
    mode,
    closed: geometry.closure.closed,
    unmet: geometry.closure.unmet,
    waived: geometry.closure.waived,
    notes: geometry.closure.notes,
    repairs,
    chapter_count: geometry.chapterCount,
    time_model: geometry.timeModel,
    clincher: geometry.clincher,
    method_signature: geometry.methodSignature,
    chapter_contract: geometry.chapterContract,
    false_solution: geometry.falseSolution,
    clearance_budget: geometry.clearanceBudget,
  };
  ctx.scoringLogger?.logPhaseDiagnostic(
    "agent75_geometry",
    "Story Geometry",
    "geometry_contract",
    details,
    ctx.runId,
    ctx.projectId ?? "",
  );
  ctx.scoreAggregator?.upsertDiagnostic(
    "agent75_geometry_contract",
    "agent75_geometry",
    "Story Geometry",
    "geometry_contract",
    details,
  );
}
