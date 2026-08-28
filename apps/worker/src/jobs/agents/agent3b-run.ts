/**
 * Agent 3b: Hard-Logic Device Ideation
 *
 * Extracted from mystery-orchestrator.ts. Runs generateHardLogicDevices(),
 * handles scoring-path retry and schema validation, computes hardLogicDirectives,
 * and writes ctx.hardLogicDevices + ctx.hardLogicDirectives.
 *
 * Pillar 1: when enableLockedFactRegistry is true, also populates
 * ctx.lockedFactRegistry from the primary device and emits locked-facts-{runId}.json
 * to apps/worker/logs/.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
// A_74 §8 DE8 — the curated device corpus, retrieved deterministically. See device-library-block.ts.
import { buildDeviceLibraryBlock } from "../device-library-block.js";
import { assignedFamilyFromTheme } from "../cell-scheduler.js";
import { join } from "path";

import {
  generateHardLogicDevices,
  parsePlausibilityJudgeMode,
  plausibilityGatePass,
  judgeMechanismPlausibility,
  buildPlausibilityJudgeFeedback,
  AGENT3B_PLAUSIBILITY_FLOOR,
  extractThemeMechanismFamilies,
  scoreDeviceThemeMatch,
} from "@cml/prompts-llm";
// X38 — the case checked against itself, at the £0.03 end of the pipeline (REVIEW_09 §3).
import {
  validateArtifact,
  checkCaseTimeCoherence,
  parseClockTime,
  parseDurationMinutes,
  rewriteDurationMinutes,
  dialGapMinutes,
} from "@cml/cml";
import { HardLogicScorer, scoreRealHardLogic } from "@cml/story-validation";
import { adaptHardLogicForScoring } from "../scoring-adapters/index.js";
import {
  type OrchestratorContext,
  executeAgentWithRetry,
  appendRetryFeedback,
  mergeHardLogicDirectives,
  applyHonestScorer,
} from "./shared.js";

// A_53 P6 (lockedfact-digit-form-not-repaired): convert digit/metric values in a locked-fact value to
// era word-form at REGISTRY BUILD, so the enforced ground truth matches era-word prose (a digit value
// like "10:50 PM" never substring-matches "ten-fifty" prose → permanent false warning + Agent 9 told
// to inject the era-violating digits). Holistic + parameter-free: pure number→word conversion.
const numberToWordsSmall = (n: number): string => {
  const ones = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven",
    "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (n < 0 || n >= 100) return String(n); // leave large/negative numbers as-is
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? tens[t] : `${tens[t]}-${ones[o]}`;
};

const wordifyLockedFactValue = (value: string): string => {
  let out = value;
  // Clock times: "10:50 PM", "10:50 p.m.", "10:50" → "ten-fifty" / "ten o'clock" (era word-form;
  // surrounding prose carries the meridiem, which the canonical value omits).
  out = out.replace(/\b(\d{1,2}):(\d{2})\s*(?:a\.?m\.?|p\.?m\.?)?/gi, (_m, h: string, min: string) => {
    const hour = parseInt(h, 10);
    const minute = parseInt(min, 10);
    if (hour > 23 || minute > 59) return _m;
    const hour12 = ((hour + 11) % 12) + 1;
    const hourWord = numberToWordsSmall(hour12);
    return minute === 0 ? `${hourWord} o'clock` : `${hourWord}-${numberToWordsSmall(minute)}`;
  });
  // Standalone small number before a measurement word: "4 metres" → "four metres".
  out = out.replace(/\b(\d{1,2})\b(?=\s+[a-zA-Z])/g, (_m, d: string) => numberToWordsSmall(parseInt(d, 10)));
  return out;
};

/**
 * A_72 C1 — the article belongs to the SENTENCE, never to the locked value.
 *
 * ── WHAT THIS COST, MEASURED ─────────────────────────────────────────────────────────────────────
 *
 * The 2026-08-23 run registered two locked times side by side:
 *
 *     high_tide_time        "ten minutes past eleven"
 *     weapon_release_time   "a quarter past eleven"     <- the article is INSIDE the value
 *
 * Both reach Agent 9 under a HARD verbatim contract — *"reproduce those exact words"*. They are not
 * parallel, so the model regularises them, and the shipped manuscript says **"a ten minutes past
 * eleven" about ten times**, including the line the external reader quoted back:
 *
 *     "By then it was a ten minutes past eleven. It had taken fifteen minutes in all.
 *      By then it was a ten minutes past eleven."
 *
 * That read scored `prose` **6/10** — the lowest of its ten categories and the drag on the whole book
 * (A_72 §5). The reader's own forecast for fixing this class was **86-89** against an actual 81.
 *
 * ── WHY AT REGISTRATION, AND ONLY HERE ───────────────────────────────────────────────────────────
 *
 * `wordifyLockedFactValue` above already establishes the principle: the registry is where a value is
 * made canonical, because every downstream consumer — the prose contract, the validator's substring
 * match, the artifact on disk — reads the same string. Stripping the article in a prompt would leave
 * the validator hunting for a form nobody was told to write.
 *
 * ── DELIBERATELY NARROW ──────────────────────────────────────────────────────────────────────────
 *
 * Only a leading `a` / `an` / `the`, and only when what follows still carries the value. A locked fact
 * whose whole value is an article is left alone rather than emptied, and nothing inside the phrase is
 * touched: "half past ten" keeps its shape, "the ledger for the second week" loses only its first word.
 * Grammar is not corrected and words are not reordered — this removes one leading token or does
 * nothing, so it cannot invent a value the device never declared.
 */
const LEADING_ARTICLE_RE = /^(?:a|an|the)\s+(?=\S)/i;

export const stripLeadingArticleFromLockedValue = (value: string): string => {
  const trimmed = value.trim();
  const stripped = trimmed.replace(LEADING_ARTICLE_RE, "");
  // Never empty a fact, and never return something so short it stops being a usable anchor.
  return stripped.trim().length >= 2 ? stripped.trim() : trimmed;
};


/**
 * X38-AT-SOURCE — make the device satisfy its own arithmetic before the values freeze.
 *
 * MEASURED 2026-08-20 over the 20 archived locked-fact registries
 * (`scripts/probe-device-arithmetic.mjs`). Of the ten devices either branch of
 * `checkCaseTimeCoherence` can read, **ten have arithmetic that does not close** — not the half
 * REVIEW_05 §12.11 reported, which counted cases the gate cannot read as cases it passed. And they
 * cluster: **six of the ten are wrong by exactly five minutes**, four of those the identical shape —
 * two clock values twenty-five minutes apart under a duration declaring twenty. The model is not
 * making scattered slips. It reaches for a round duration while writing clock values that a
 * quarter-hour idiom pushes five minutes further apart than that, and it does so most of the time.
 *
 * So X38 is promoted from a warning to a repair, HERE, because Agent 3b is the last moment the values
 * are still soft — locked facts are contractual and injected into the prose verbatim, so past this
 * point the only available repair is a chapter that contradicts the registry, which is why X38 was
 * built as a detector with no repair path. Agent 3 has not authored `hidden_model.mechanism` yet
 * either, and that prose restates the interval ("delaying the shadow by about twenty minutes"), so a
 * repair applied one agent later would fix the fact and leave the description stating the old number
 * — a fix that authors the defect it removes, this tracker's own recurring pattern.
 *
 * **IT REPAIRS ONLY WHAT THE DEVICE DECLARED DERIVED, and this is the whole design.**
 *
 * The first draft of this pass rewrote the DURATION on the reasoning that it is the derived quantity —
 * the two clock values are what the prose prints and what the alibi windows are built on, so the
 * interval is the one the case can absorb. That is true of every device in the archive, and the
 * archive is **24 of 24 clock-family devices** (pendulum, bell, sundial, hourglass, escapement). It is
 * FALSE for families this pipeline actively asks for: a poison's onset, a tide's period, a fuse's
 * burn are physical constants, and when the numbers disagree it is the TIMES that must move, not the
 * interval. Rewriting the interval there would silently corrupt the mechanism and produce a story
 * whose poison acts in the wrong time. The corpus could not have shown that, because it contains no
 * such device — which is exactly why a corpus must not be the source of a repair's assumptions.
 *
 * So the author declares it. `derivedFrom` names the facts a value is a consequence of; absent, the
 * value is PRIMARY and untouchable. The rule this encodes is general:
 *
 *      A DETECTOR MAY GUESS. A REPAIRER MAY NOT.
 *
 * A warning that is wrong costs a minute of reading. A rewritten locked fact is printed into the book
 * verbatim and is unrecoverable. So `checkCaseTimeCoherence` keeps its shape heuristic and keeps
 * WARNING on every incoherent device — no coverage is lost — while nothing WRITES without a licence
 * from the case itself.
 *
 * Verified, not assumed. The declared relation is recomputed, the rewritten value re-parsed by the
 * function that produced it, and the whole registry re-checked by the DETECTOR; if any step fails the
 * old value goes back and the run keeps the warning it always had. That assertion is the X64/X65
 * lesson — a substitution applied without one silently no-opped for an entire run.
 */
export function reconcileDeviceArithmetic(ctx: OrchestratorContext): void {
  const registry = ctx.lockedFactRegistry;
  if (!registry || registry.length === 0) return;

  // The ONLY entry point: a fact the device declared to be a consequence of exactly two others.
  // No declaration, no rewrite — a primary value is untouchable no matter how the numbers look.
  const byId = new Map(registry.map((f, index) => [String(f.id ?? "").trim(), { fact: f, index }]));
  const candidates = registry
    .map((fact, index) => ({ fact, index }))
    .filter(({ fact }) => Array.isArray(fact.derivedFrom) && fact.derivedFrom.length === 2);
  if (candidates.length === 0) return;

  for (const { fact, index } of candidates) {
    const id = String(fact.id ?? "").trim() || "(unnamed)";
    const raw = String(fact.value ?? "").trim();
    const sources = (fact.derivedFrom ?? []).map((s) => byId.get(s.trim()));

    // A declaration naming facts that do not exist is a defect in the declaration, not a licence.
    if (sources.some((s) => s === undefined)) {
      ctx.warnings.push(
        `[X38] ${id} declares derivedFrom [${(fact.derivedFrom ?? []).join(", ")}], and at least one of ` +
          `those ids is not in the registry. Not repaired — an unresolvable declaration is not a licence.`,
      );
      continue;
    }

    // This pass knows ONE relation: an interval between two clock positions. A declared dependency
    // between other quantities (a distance from a speed and a time, a total from its parts) is
    // recorded by the case and simply not actionable here — which is a silence, not a pass.
    const a = parseClockTime(String(sources[0]!.fact.value ?? ""));
    const b = parseClockTime(String(sources[1]!.fact.value ?? ""));
    const current = parseDurationMinutes(raw);
    if (a === null || b === null || current === null) continue;

    const gap = dialGapMinutes(a, b);
    if (gap === current) continue; // the declared relation already holds

    // Two sources at the same clock value make a zero-length interval, which is not a mechanism.
    if (gap === 0) {
      ctx.warnings.push(
        `[X38] device arithmetic NOT repaired: ${sources[0]!.fact.id} and ${sources[1]!.fact.id} lock ` +
          `the same time, so ${id} has no interval to state. Left for the case to answer.`,
      );
      continue;
    }

    const declared = { index, id, raw, minutes: current };
    const clockIds = [sources[0]!.fact.id, sources[1]!.fact.id];

  // Also the guard against a dial wrap. `parseClockTime` is dial-relative (0..719) on purpose, so a
  // pair straddling midnight — 11:50 and 00:10 — reads as 700 minutes apart rather than twenty. The
  // detector has always computed it that way; the repair must not turn that into a locked fact
  // declaring "seven hundred minutes". `rewriteDurationMinutes` refuses anything it cannot spell as a
  // minute count under a hundred, so the case keeps its warning and a person reads it.
    const repaired = rewriteDurationMinutes(declared.raw, gap);
    if (repaired === null) {
      ctx.warnings.push(
        `[X38] device arithmetic NOT repaired: ${declared.id} "${declared.raw}" could not be restated at ` +
          `${gap} minutes without guessing at its wording. The incoherence stands, and is reported below.`,
      );
      continue;
    }

    const before = declared.raw;
    registry[declared.index] = { ...registry[declared.index]!, value: repaired };

    // The assertion. If the rewrite did not do what it claimed, put it back.
    if (parseDurationMinutes(repaired) !== gap) {
      registry[declared.index] = { ...registry[declared.index]!, value: before };
      ctx.warnings.push(
        `[X38] device arithmetic repair REVERTED: restating ${declared.id} as "${repaired}" does not ` +
          `read back as ${gap} minutes. This is a defect in the repair, not in the case.`,
      );
      continue;
    }

    ctx.warnings.push(
      `[X38] device arithmetic repaired at source: ${declared.id} declares itself derived from ` +
        `${clockIds.join(" and ")}, which are ${gap} minutes apart, so "${before}" (${declared.minutes}) ` +
        `is restated as "${repaired}". Only the declared-derived value changed; its sources are untouched.`,
    );
  }
}

/**
 * Write `locked-facts-{runId}.json`.
 *
 * EXPORTED, and called twice per run — found on review 2026-08-18. The registry is BUILT here from the
 * device, but X51 appends the case's own facts (the weapon, each suspect's alibi location) at the end
 * of `runAgent3`, which happens later. With a single write at build time the artifact showed only the
 * device's clock times, so an audit of a future run would read this file and conclude the weapon and
 * alibi pins never landed. This project diagnoses runs from artifacts; an artifact that is a snapshot
 * of an intermediate state is worse than none.
 */
export function writeLockedFactsArtifact(ctx: OrchestratorContext): void {
  try {
    const logsDir = join(ctx.workerAppRoot, "logs");
    if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });
    writeFileSync(
      join(logsDir, `locked-facts-${ctx.runId}.json`),
      JSON.stringify({ runId: ctx.runId, registry: ctx.lockedFactRegistry ?? [] }, null, 2),
      "utf8",
    );
  } catch (err) {
    ctx.warnings.push(`Pillar 1: failed to write locked-facts file: ${String(err)}`);
  }
}

export async function runAgent3b(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("hard_logic_devices", "Generating novel hard-logic device concepts...", 28);

  const setting = ctx.setting!;
  const cast = ctx.cast!;
  const backgroundContext = ctx.backgroundContext!;

  // A_53 P11 (plausibility-regen-reuses-stale-theme-families): the locked mechanism families that the
  // theme commits to were previously re-derived in ~3 places with different inputs (the generator's
  // internal extract, the plausibility-regen guard's `matchedThemePrimary` flags, and the theme-lock
  // telemetry below). Because the generator computed `matchedThemePrimary` from the *initial* directives'
  // abstract axis families — which the keyword map can't see — the "never trade theme for plausibility"
  // guard silently never engaged. Compute ONE canonical family list here from the same inputs and reuse it
  // for every theme-coherence decision in this file, so the guard and the telemetry agree. Stored on ctx
  // for any downstream cross-agent reuse. Holistic: derived purely from the theme prose + structured hints.
  const lockedThemeFamilies = extractThemeMechanismFamilies(
    ctx.inputs.theme,
    ctx.initialHardLogicDirectives.mechanismFamilies,
  );
  (ctx as { lockedThemeFamilies?: string[] }).lockedThemeFamilies = lockedThemeFamilies;

  /**
   * A_74 §8 DE8 — retrieve ONCE, here, and pass the same block to all three generate calls below.
   *
   * All three (first pass, scoring-path retry, plausibility regen) must see identical raw material.
   * A retry that silently retrieved a different corpus would make "the retry produced a better
   * device" unattributable, which is the same class of defect as A_53 P11 directly above: one
   * concept re-derived in three places with different inputs.
   */
  const scheduledFamily = assignedFamilyFromTheme(ctx.inputs.theme);
  const deviceLibraryBlock = buildDeviceLibraryBlock({
    decade: Number(String(setting.setting.era.decade).replace(/[^0-9]/g, "")) || 1930,
    primaryAxis: ctx.primaryAxis,
    noveltyFamily: scheduledFamily ?? undefined,
    limit: 4,
  });
  if (scheduledFamily) {
    console.warn(`[DE5/DE8] theme carries a scheduled mechanism assignment: ${scheduledFamily}`);
  }
  // Whether a result's PRIMARY device (devices[0], the source of the locked-fact registry + CML) realizes
  // the canonical locked families. Re-derived locally against ONE family list rather than trusting the
  // generator's `matchedThemePrimary` (which was computed from a possibly-different family list). When the
  // theme leaves the mechanism open (no locked families) this is vacuously false — matching the prior
  // semantics where the guard short-circuits and full novelty is preserved.
  const primaryRealizesTheme = (devices: { devices: Array<Parameters<typeof scoreDeviceThemeMatch>[0]> }): boolean =>
    lockedThemeFamilies.length > 0 &&
    devices.devices.length > 0 &&
    scoreDeviceThemeMatch(devices.devices[0], lockedThemeFamilies) > 0;

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent3b_hard_logic_devices",
      "Hard Logic Devices",
      async (retryFeedback?: string) => {
        const hlResult = await generateHardLogicDevices(ctx.client, {
          runId: ctx.runId,
          projectId: ctx.projectId || "",
          decade: setting.setting.era.decade,
          location: setting.setting.location.description,
          institution: setting.setting.location.type,
          tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
          theme: appendRetryFeedback(ctx.inputs.theme, retryFeedback),
          primaryAxis: ctx.primaryAxis,
          mechanismFamilies: ctx.initialHardLogicDirectives.mechanismFamilies,
          hardLogicModes: ctx.initialHardLogicDirectives.hardLogicModes,
          difficultyMode: ctx.initialHardLogicDirectives.difficultyMode,
          noveltyConstraints: ctx.noveltyConstraints,
          deviceLibraryBlock,
        });
        return { result: hlResult, cost: hlResult.cost };
      },
      async (hlResult) => {
        const scorer = new HardLogicScorer();
        const adapted = adaptHardLogicForScoring(hlResult.devices);
        const score = await scorer.score({}, adapted, {
          previous_phases: {
            agent1_setting: setting.setting,
            agent2_cast: cast.cast,
            agent2e_background_context: backgroundContext,
          },
          cml: undefined as any,
          threshold_config: { mode: "standard" },
        });
        return { adapted, score: applyHonestScorer(score, () => scoreRealHardLogic(hlResult.devices), ctx.warnings, "agent3b-hard-logic") };
      },
      ctx.retryManager,
      ctx.scoreAggregator,
      ctx.scoringLogger,
      ctx.runId,
      ctx.projectId || "",
      ctx.warnings,
      ctx.savePartialReport,
    );
    ctx.hardLogicDevices = result;
    ctx.agentCosts["agent3b_hard_logic_devices"] = cost;
    ctx.agentDurations["agent3b_hard_logic_devices"] = duration;
  } else {
    const hardLogicStart = Date.now();
    ctx.hardLogicDevices = await generateHardLogicDevices(ctx.client, {
      runId: ctx.runId,
      projectId: ctx.projectId || "",
      decade: setting.setting.era.decade,
      location: setting.setting.location.description,
      institution: setting.setting.location.type,
      tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
      theme: ctx.inputs.theme,
      primaryAxis: ctx.primaryAxis,
      mechanismFamilies: ctx.initialHardLogicDirectives.mechanismFamilies,
      hardLogicModes: ctx.initialHardLogicDirectives.hardLogicModes,
      difficultyMode: ctx.initialHardLogicDirectives.difficultyMode,
      noveltyConstraints: ctx.noveltyConstraints,
      deviceLibraryBlock,
    });
    ctx.agentCosts["agent3b_hard_logic_devices"] = ctx.hardLogicDevices.cost;
    ctx.agentDurations["agent3b_hard_logic_devices"] = Date.now() - hardLogicStart;
  }

  const hardLogicValidation = validateArtifact("hard_logic_devices", ctx.hardLogicDevices);
  if (!hardLogicValidation.valid) {
    hardLogicValidation.errors.forEach((error) => ctx.errors.push(`Agent 3b schema failure: ${error}`));
    throw new Error("Hard-logic device artifact failed schema validation");
  }
  hardLogicValidation.warnings.forEach((warning) => ctx.warnings.push(`Agent 3b schema warning: ${warning}`));

  // ── P2.2 (T2.4): Independent mechanism-plausibility judge (AGENT3B_PLAUSIBILITY_JUDGE) ──
  // Default OFF ⇒ skipped, behaviour byte-identical. shadow ⇒ judge the primary device + log the
  // score, no behaviour change. enforce ⇒ bounded regenerate-with-feedback while below the floor,
  // accept the best candidate by score, re-validate schema each time, never throw. There is no
  // upstream skip decision for Agent 3b, so gating lives entirely here (Phase-1 novelty trap N/A).
  const plausibilityMode = parsePlausibilityJudgeMode(process.env.AGENT3B_PLAUSIBILITY_JUDGE);
  if (plausibilityMode !== "off" && ctx.hardLogicDevices!.devices.length > 0) {
    const judgeCtx = {
      decade: setting.setting.era.decade,
      location: setting.setting.location.description,
      institution: setting.setting.location.type,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    };
    // enforce retries are bounded both ways (Phase-1 lesson: "Infinity" must not defeat "bounded").
    const boundedRetries =
      plausibilityMode === "enforce"
        ? Math.min(3, Math.max(0, Math.trunc(Number(process.env.AGENT3B_PLAUSIBILITY_MAX_RETRIES ?? 1)) || 0))
        : 0;

    const accrueJudgeCost = (cost: number, durationMs: number) => {
      ctx.agentCosts["agent3b_hard_logic_devices"] =
        (ctx.agentCosts["agent3b_hard_logic_devices"] || 0) + cost;
      ctx.agentDurations["agent3b_hard_logic_devices"] =
        (ctx.agentDurations["agent3b_hard_logic_devices"] || 0) + durationMs;
    };

    let bestDevices = ctx.hardLogicDevices!;
    let bestJudge = await judgeMechanismPlausibility(ctx.client, bestDevices.devices[0], judgeCtx);
    if (bestJudge.ran) accrueJudgeCost(bestJudge.cost, bestJudge.durationMs);

    let attempt = 0;
    while (
      plausibilityMode === "enforce" &&
      bestJudge.ran &&
      !plausibilityGatePass(bestJudge.score) &&
      attempt < boundedRetries
    ) {
      attempt += 1;
      const feedback = buildPlausibilityJudgeFeedback(bestJudge);
      ctx.warnings.push(
        `[agent3b-plausibility][enforce] score ${bestJudge.score} < ${AGENT3B_PLAUSIBILITY_FLOOR} ` +
          `(attempt ${attempt}/${boundedRetries}); regenerating with plausibility feedback.`,
      );
      const regenStart = Date.now();
      // True marginal cost via byAgent delta — the generator's returned .cost is a cumulative total.
      const genLabel = "Agent3b-HardLogicDeviceGenerator";
      const genCostBefore = ctx.client.getCostTracker().getSummary().byAgent[genLabel] || 0;
      let regenerated: Awaited<ReturnType<typeof generateHardLogicDevices>>;
      try {
        regenerated = await generateHardLogicDevices(ctx.client, {
          runId: ctx.runId,
          projectId: ctx.projectId || "",
          decade: setting.setting.era.decade,
          location: setting.setting.location.description,
          institution: setting.setting.location.type,
          tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", feedback),
          theme: appendRetryFeedback(ctx.inputs.theme || "", feedback),
          primaryAxis: ctx.primaryAxis,
          mechanismFamilies: ctx.initialHardLogicDirectives.mechanismFamilies,
          hardLogicModes: ctx.initialHardLogicDirectives.hardLogicModes,
          difficultyMode: ctx.initialHardLogicDirectives.difficultyMode,
          noveltyConstraints: ctx.noveltyConstraints,
          deviceLibraryBlock,
        });
      } catch (err) {
        // A gate must never kill a run: a regeneration failure keeps the best-so-far.
        ctx.warnings.push(`[agent3b-plausibility][enforce] regeneration error: ${(err as Error).message}; keeping previous best.`);
        break;
      }
      const genCostAfter = ctx.client.getCostTracker().getSummary().byAgent[genLabel] || 0;
      accrueJudgeCost(Math.max(0, genCostAfter - genCostBefore), Date.now() - regenStart);

      // Re-validate the regenerated candidate before considering it (Phase-1: re-validate mutations).
      const regenValidation = validateArtifact("hard_logic_devices", regenerated);
      if (!regenValidation.valid) {
        ctx.warnings.push(
          "[agent3b-plausibility][enforce] regenerated candidate failed schema validation; keeping previous best.",
        );
        continue;
      }
      const regenJudge = await judgeMechanismPlausibility(ctx.client, regenerated.devices[0], judgeCtx);
      if (regenJudge.ran) accrueJudgeCost(regenJudge.cost, regenJudge.durationMs);
      // A_50 §9.3: accept-best-by-score, but NEVER trade a theme-coherent primary for an off-theme
      // one — a more "plausible" tide device that abandons the locked clock theme makes the case
      // incoherent (the probe's regen did exactly this). Recovering theme-coherence the current best
      // lacks is always worth accepting; otherwise fall back to the plausibility-score rank.
      // A_53 P11 (plausibility-regen-reuses-stale-theme-families): judge theme-coherence against the
      // single canonical family list, not the generator's `matchedThemePrimary` (computed from a
      // different family list) — that mismatch is why this guard silently never engaged.
      const bestThemeOk = primaryRealizesTheme(bestDevices);
      const regenThemeOk = primaryRealizesTheme(regenerated);
      const acceptRegen =
        regenJudge.ran &&
        (regenThemeOk || !bestThemeOk) &&
        ((regenThemeOk && !bestThemeOk) || regenJudge.score > bestJudge.score);
      if (acceptRegen) {
        bestDevices = regenerated;
        bestJudge = regenJudge;
      } else if (regenJudge.ran && regenJudge.score > bestJudge.score && bestThemeOk && !regenThemeOk) {
        ctx.warnings.push(
          `[agent3b-plausibility][enforce] rejected a higher-plausibility regen (score ${regenJudge.score} > ` +
            `${bestJudge.score}) because it abandoned the locked theme family; keeping theme-coherent primary.`,
        );
      }
    }

    ctx.hardLogicDevices = bestDevices;
    const gateState =
      plausibilityMode === "enforce"
        ? plausibilityGatePass(bestJudge.score)
          ? "pass"
          : `accept-after-${attempt}`
        : "shadow";
    ctx.warnings.push(
      `[agent3b-plausibility][${plausibilityMode}] gate=${gateState} score=${bestJudge.score} ` +
        `ran=${bestJudge.ran}${bestJudge.error ? ` error=${bestJudge.error}` : ""}`,
    );
  }

  // A_50 §9.3: telemetry — if the theme commits to a concrete mechanism family but no generated
  // device realized it (off-theme primary), the locked-fact registry/CML will diverge from the
  // theme. Surface it (never abort) so the prompt fix's effect is observable across runs.
  // A_53 P11 (plausibility-regen-reuses-stale-theme-families): reuse the single canonical
  // `lockedThemeFamilies` computed once at the top and the local `primaryRealizesTheme` check, so the
  // telemetry agrees with the regen guard instead of re-deriving from possibly-different inputs.
  if (lockedThemeFamilies.length > 0 && !primaryRealizesTheme(ctx.hardLogicDevices!)) {
    ctx.warnings.push(
      `[agent3b-theme-lock] theme commits to [${lockedThemeFamilies.join(", ")}] but no device realized it; ` +
        `primary device ("${ctx.hardLogicDevices!.devices[0]?.title ?? "?"}") is off-theme — locked facts may diverge from the case.`,
    );
  }

  ctx.hardLogicDirectives = mergeHardLogicDirectives(
    ctx.initialHardLogicDirectives,
    ctx.hardLogicDevices!.devices,
  );

  // ── Pillar 1 (Unit 1.1 + 1.2): Build LockedFactRegistry from primary device ──
  if (ctx.inputs.enableLockedFactRegistry) {
    /**
     * Extracted so the arithmetic-regeneration path below can REBUILD the registry from a fresh
     * device. Byte-identical work to what ran inline before; the only change is that it can now be
     * called twice.
     */
    const buildRegistryFromPrimaryDevice = (): void => {
      const primaryDevice = ctx.hardLogicDevices!.devices[0];
      const rawFacts: Array<{ id?: unknown; value?: unknown; description?: unknown; derivedFrom?: unknown }> =
        Array.isArray(primaryDevice?.lockedFacts) ? primaryDevice.lockedFacts : [];

      ctx.lockedFactRegistry = rawFacts
        .filter((f) => typeof f.id === "string" && typeof f.value === "string" && (f.value as string).trim().length > 0)
        .map((f) => {
          const id = (f.id as string).trim();
          const original = (f.value as string).trim();
          const wordified = wordifyLockedFactValue(original);
          if (wordified !== original) {
            ctx.warnings.push(`Pillar 1: repaired digit-form locked fact ${id} "${original}" → "${wordified}" (era word-form)`);
          }
          // A_72 C1: the article belongs to the sentence, not the value. See the helper's header for
          // what "a quarter past eleven" beside "ten minutes past eleven" did to the 08-23 manuscript.
          const value = stripLeadingArticleFromLockedValue(wordified);
          if (value !== wordified) {
            ctx.warnings.push(`[A_72 C1] stripped leading article from locked fact ${id}: "${wordified}" → "${value}"`);
          }
          return {
            id,
            value,
            description: typeof f.description === "string" ? (f.description as string).trim() : "",
            // Carried through verbatim: it is the ONLY licence any later pass has to rewrite this value.
            ...(Array.isArray(f.derivedFrom)
              ? { derivedFrom: (f.derivedFrom as unknown[]).map((x) => String(x).trim()).filter(Boolean) }
              : {}),
          };
        });

      // X38-at-source: reconcile before the artifact is written, so locked-facts-{runId}.json records
      // the values the run actually used rather than the ones it was about to repair.
      reconcileDeviceArithmetic(ctx);
    };

    buildRegistryFromPrimaryDevice();

    // Emit to apps/worker/logs/locked-facts-{runId}.json for observability.
    writeLockedFactsArtifact(ctx);

    // The assignment now happens inside `buildRegistryFromPrimaryDevice`, so TypeScript no longer
    // narrows it here. Read once into a local rather than asserting non-null at each use.
    const builtRegistry = ctx.lockedFactRegistry ?? [];
    ctx.warnings.push(
      `Pillar 1: locked fact registry built with ${builtRegistry.length} fact(s): ` +
        builtRegistry.map((f) => `${f.id}="${f.value}"`).join(", "),
    );

    /**
     * X38 (REVIEW_09 §3) — the device's own arithmetic, at the cheapest end of the pipeline.
     *
     * The 08-15 device declared `murder_time_displayed` 7:15, `chime_recorded_time` 7:05 and
     * `pendulum_delay_duration` "fourteen minutes". 7:15 − 7:05 is ten. These values are injected into
     * the prose VERBATIM, so the contradiction shipped, and the cold read led with it and marked the
     * clue logic 6/10.
     *
     * Here rather than at acceptance because Agent 9 cannot repair it: a locked fact is contractual,
     * and a chapter rewritten to reconcile the numbers would contradict the registry. This is the
     * moment the case is still cheap to fix — before an outline, before £1 of prose written against it.
     */
    let arithmeticViolations = checkCaseTimeCoherence({ lockedFacts: ctx.lockedFactRegistry });
    for (const violation of arithmeticViolations) {
      ctx.warnings.push(`[X38] Pillar 1 case-time incoherence (${violation.code}): ${violation.message}`);
    }

    /**
     * ── A_75 §11: THE WARNING NOW DOES SOMETHING ─────────────────────────────────────────────────
     *
     * The comment above argues that this is the only moment the case can be fixed — "Agent 9 cannot
     * repair it: a locked fact is contractual" — and until now the code answered by pushing a warning
     * and continuing.
     *
     * MEASURED over the 29 stored device artifacts: **10 (34%) ship with arithmetic that does not
     * work.** `reconcileDeviceArithmetic` above repairs only a fact that DECLARES `derivedFrom` with
     * two sources — correctly conservative, it will not guess which of three numbers is wrong — and
     * **6 of the 10 carry no such declaration**, so the repair cannot reach them.
     *
     * What happens to those six is documented end to end for `canary_1787512796199`: X38 warned here,
     * geometry raised `locked_time_arithmetic` again at Agent 9 (where it can only warn), the book
     * shipped, and BOTH external readers spent essentially their whole review on the hourglass
     * numbers. `clues` scored 5 and 7 — the category with the most recoverable headroom in the ledger.
     *
     * So: regenerate the DEVICE, which is the thing that is wrong, at the design-tier price
     * (~$0.01–0.02) rather than paying £1 of prose to render numbers that cannot work. Bounded to one
     * attempt, and the regenerated device is accepted ONLY if the arithmetic actually clears — a
     * regeneration that fails leaves the original in place, so this can never make a case worse or
     * abort a run.
     *
     * Flag-gated `AGENT3B_ARITHMETIC_REGEN`, default OFF, read at call time.
     */
    const arithmeticRegenEnabled = /^(1|true|yes|on)$/i.test(process.env.AGENT3B_ARITHMETIC_REGEN ?? "");
    if (arithmeticRegenEnabled && arithmeticViolations.length > 0) {
      const beforeDevices = ctx.hardLogicDevices;
      const beforeRegistry = ctx.lockedFactRegistry;
      const feedback =
        `The device's own numbers must agree. ${arithmeticViolations.map((v) => v.message).join(" ")} `
        + `Regenerate the device so its locked facts are arithmetically consistent: if two clock times and `
        + `a duration are locked, the duration MUST equal the interval between the two times. State the `
        + `derived value's \`derivedFrom\` as the ids of the two facts it is computed from.`;
      const genLabel = "Agent3b-HardLogicDeviceGenerator";
      const costBefore = ctx.client.getCostTracker().getSummary().byAgent[genLabel] || 0;
      try {
        const regenerated = await generateHardLogicDevices(ctx.client, {
          runId: ctx.runId,
          projectId: ctx.projectId || "",
          decade: setting.setting.era.decade,
          location: setting.setting.location.description,
          institution: setting.setting.location.type,
          tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", feedback),
          theme: appendRetryFeedback(ctx.inputs.theme || "", feedback),
          primaryAxis: ctx.primaryAxis,
          mechanismFamilies: ctx.initialHardLogicDirectives.mechanismFamilies,
          hardLogicModes: ctx.initialHardLogicDirectives.hardLogicModes,
          difficultyMode: ctx.initialHardLogicDirectives.difficultyMode,
          noveltyConstraints: ctx.noveltyConstraints,
          deviceLibraryBlock,
        });
        const regenValid = validateArtifact("hard_logic_devices", regenerated);
        if (!regenValid.valid || !regenerated?.devices?.length) {
          ctx.warnings.push(`[X38-regen] regenerated device failed schema validation; keeping the original.`);
        } else {
          // Rebuild the registry from the NEW device and re-run the same check. Accept only on a clear.
          ctx.hardLogicDevices = regenerated;
          buildRegistryFromPrimaryDevice();
          const after = checkCaseTimeCoherence({ lockedFacts: ctx.lockedFactRegistry });
          if (after.length === 0) {
            writeLockedFactsArtifact(ctx);
            arithmeticViolations = [];
            ctx.warnings.push(
              `[X38-regen] device regenerated and its arithmetic now agrees — repaired at the design tier, `
              + `before an outline and before any prose was written against it.`,
            );
          } else {
            // Never trade a known-bad device for an unknown-bad one.
            ctx.hardLogicDevices = beforeDevices;
            ctx.lockedFactRegistry = beforeRegistry;
            ctx.warnings.push(
              `[X38-regen] regenerated device still disagrees (${after.map((v) => v.code).join(", ")}); `
              + `reverted to the original. The case ships with the incoherence NAMED, as before.`,
            );
          }
        }
      } catch (err) {
        ctx.warnings.push(`[X38-regen] regeneration error: ${(err as Error).message}; keeping the original.`);
      } finally {
        const costAfter = ctx.client.getCostTracker().getSummary().byAgent[genLabel] || 0;
        const spent = Math.max(0, costAfter - costBefore);
        if (spent > 0) ctx.warnings.push(`[X38-regen] spent £${spent.toFixed(4)} at the design tier.`);
      }
    }
  }

  ctx.reportProgress("hard_logic_devices", `Generated ${ctx.hardLogicDevices!.devices.length} novel hard-logic devices`, 31);
}
