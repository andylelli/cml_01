/**
 * Pipeline stage groups that are more than one stage call: the profile trio (2b/2c/2d, parallel under R9),
 * the character bundle (Pillar 2), and the cross-run novelty constraints. Moved from generateMystery (code
 * review ORC-01 / CR-25).
 */
import { join } from "path";
import { WORKER_RUNTIME_PATHS } from "../runtime-paths.js";
const WORKER_APP_ROOT = WORKER_RUNTIME_PATHS.workerAppRoot;
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { isDetectiveArchetype, isVictimArchetype, roleTextsOf } from "@cml/cml";
import type {
  CharacterProfilesResult,
  WorldDocumentResult,
} from "@cml/prompts-llm";
import {
  runAgent2b,
  runAgent2c,
  runAgent2d,
  describeError,
  type OrchestratorContext,
  type CharacterBundle,
  type CharacterBundleEntry,
} from "../agents/index.js";
import {
  isCrossRunNoveltyEnabled,
  loadNoveltyLedger,
  mergePriorRunsIntoConstraints,
} from "../novelty-ledger.js";
import { logLedgerDispersion } from "../novelty-dispersion.js";
import { resolveSchedulerMode, scheduleCell, logScheduledCell, loadCorpusCells } from "../cell-scheduler.js";
import {
  ResumeSkipTracker,
  type ResumeStageField,
} from "../resume-hydration.js";

const HUMOUR_STYLE_CLICHE: Record<string, string> = {
  polite_savagery:  "she felt a wave of unease",
  sardonic:         "palpable tension filled the room",
  dry_wit:          "a surge of determination washed over her",
  self_deprecating: "she knew with certainty she was right",
  observational:    "everyone could sense the atmosphere",
  understatement:   "the situation was extremely serious",
  deadpan:          "he was utterly speechless",
  blunt:            "she chose her words with great care",
  none:             "sighed deeply and felt a sense of peace",
};

/**
 * X63 — the behaviour contract was ROLE-BLIND, and the comment below said otherwise.
 *
 * `permittedBehavioursByAct` is the only per-character behavioural steering that reaches Agent 9
 * (prompt-blocks.ts prints it as "Act N behaviour contract"). It was documented as "derived from
 * motive seed + role" and derived from motive seed alone: `CharacterProfilesResult` carries no role
 * field at all, so there was nothing in scope to read. Two consequences, both on the page:
 *
 *   • THE DETECTIVE was told "May show unease, evasion, or mild defensiveness when questioned. One
 *     behavioural tell is permitted." The detective is not a suspect, and in this genre a behavioural
 *     tell IS the currency of guilt — the same signal X49's GUILT_MARKER sweep exists to police.
 *   • THE VICTIM, dead since Act I scene 1, was given a three-act live contract ending in "Full
 *     character reveal permissible — confrontation, confession, or vindication".
 *
 * DELIBERATELY NOT CHANGED: culprit and innocent suspects still share one contract. Giving the
 * culprit its own Act II allowance would hand Agent 9 a behavioural signal the innocents lack, which
 * is early disclosure by construction — the defect X59 spent three reviews removing.
 */
export function assembleCharacterBundle(
  runId: string,
  characterProfiles: CharacterProfilesResult,
  worldDocument: WorldDocumentResult,
  castRoster?: ReadonlyArray<unknown>,
): CharacterBundle {
  /** Role lookup by name. Reads `role_archetype ?? roleArchetype ?? role` — the three spellings. */
  const roleOf = (name: string): "detective" | "victim" | "suspect" => {
    const entry = (castRoster ?? []).find(
      (c: any) => String(c?.name ?? "").trim().toLowerCase() === name.trim().toLowerCase(),
    );
    if (!entry) return "suspect";
    const texts = roleTextsOf(entry);
    if (texts.some(isDetectiveArchetype)) return "detective";
    if (texts.some(isVictimArchetype)) return "victim";
    return "suspect";
  };

  const entries: CharacterBundleEntry[] = (characterProfiles.profiles ?? []).map((profile) => {
    const name = profile.name ?? "";
    const humourStyle: string = (profile as any).humourStyle ?? "none";
    const humourLevel: number = typeof (profile as any).humourLevel === "number" ? (profile as any).humourLevel : 0;
    const internalConflict: string = (profile as any).internalConflict ?? "";
    const speechMannerisms: string = (profile as any).speechMannerisms ?? "";
    const motiveSeed: string = (profile as any).motiveSeed ?? "";
    // A_61 RC5.3 — the LLM-emitted signature tic (the binding idiolect anchor the dialogue gate checks).
    const signatureTic: string = String((profile as any).signatureTic ?? "").trim();

    // Voice fragments from world document voice sketches
    const voiceSketch = (worldDocument.characterVoiceSketches ?? []).find(
      (s: any) => s.name === name,
    );
    const voiceFragments: Array<{ register: string; text: string }> = (
      (voiceSketch?.fragments ?? []) as Array<{ register?: string; text?: string }>
    )
      .filter((f) => f.text)
      .slice(0, 3)
      .map((f) => ({ register: f.register ?? "neutral", text: f.text! }));

    // Forbidden cliché: style-matched phrase this character would never say
    const forbiddenCliché = HUMOUR_STYLE_CLICHE[humourStyle] ?? HUMOUR_STYLE_CLICHE["none"];

    // Per-act permitted behaviours — derived from motive seed, internal conflict AND role (X63).
    const role = roleOf(name);

    // The detective is not a suspect. Unease, evasion and a "behavioural tell" are the vocabulary of
    // concealment, and handing them to the investigator both muddies the role and plants the signal
    // every guilt detector in the pipeline hunts for.
    const detectiveActs = {
      act1: `Observe and establish. Curiosity, professional detachment, and misreadings are all permitted; evasion is NOT — nothing this character does may read as concealment. ${internalConflict ? `Private preoccupation, never voiced as guilt: "${internalConflict}"` : ""}`.trim(),
      act2: `Press, test, and be wrong in public. Frustration and self-doubt are permitted; evasion, defensiveness under questioning and behavioural tells are NOT — this character is not a suspect and must never read as one. ${internalConflict ? `Private preoccupation surfacing as doubt about the case, not about themselves: "${internalConflict}"` : ""}`.trim(),
      act3: `Full reveal permissible: state the reasoning aloud, including what was misread earlier. Vindication belongs to the deduction, not to the person.`,
    };

    // The victim is dead from Act I. A live three-act contract for them is a category error, and the
    // Act III line was inviting a confession from a corpse.
    const victimActs = {
      act1: `DECEASED — present as a body, and in others' memory, testimony and flashback only. Write no live behaviour, no dialogue in the present, and no reaction to the investigation. ${motiveSeed ? `What their death sets in motion (context for OTHER characters, never their own action): "${motiveSeed}"` : ""}`.trim(),
      act2: `DECEASED — appears only through what others remember, claim or produce as evidence. Contradictions between accounts of them are permitted and useful; live behaviour is not.`,
      act3: `DECEASED — may be characterised retrospectively as the truth lands. No confrontation, no confession, no vindication of their own.`,
    };

    // Culprit and innocent suspects share one contract, deliberately: a distinct allowance for the
    // culprit would be a behavioural tell the innocents lack, which is early disclosure by construction.
    const suspectActs = {
      act1: `Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. ${motiveSeed ? `Hidden motive: "${motiveSeed}" — do not surface in Act I.` : ""}`.trim(),
      act2: `May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. ${internalConflict ? `Internal conflict emerging: "${internalConflict}"` : ""}`.trim(),
      // Act III used to be one byte-identical sentence for every character in every run — the only act
      // that read nothing from the profile at all. It is the act where the differences finally show.
      act3: `Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands. ${internalConflict ? `Resolve, or fail to resolve, this in the open: "${internalConflict}"` : ""}`.trim(),
    };

    const acts = role === "detective" ? detectiveActs : role === "victim" ? victimActs : suspectActs;
    const { act1, act2, act3 } = acts;

    return {
      name,
      voiceFragments,
      humourStyle,
      humourLevel,
      forbiddenCliché,
      internalConflict,
      speechMannerisms,
      signatureTic,
      permittedBehavioursByAct: { act1, act2, act3 },
    };
  });

  return { runId, characters: entries };
}

/**
 * R9 — runtime getter, never a module const (`module-const-flags-frozen-before-dotenv`).
 * Default OFF: parallelising the profile trio changes concurrency and error semantics, so it is
 * a behaviour lever under the corpus regime, not a free refactor.
 */
const profilesParallelEnabled = (): boolean =>
  process.env.AGENT_PROFILES_PARALLEL === "true" || process.env.AGENT_PROFILES_PARALLEL === "1";

export async function applyCrossRunNoveltyConstraints(noveltyConstraints: { divergeFrom: string[]; areas: string[]; avoidancePatterns: string[]; }, warnings: string[]) {
  if (isCrossRunNoveltyEnabled()) {
    try {
      const priorRuns = await loadNoveltyLedger();
      noveltyConstraints = mergePriorRunsIntoConstraints(noveltyConstraints, priorRuns);
      if (priorRuns.length > 0) {
        warnings.push(`Cross-run novelty: diverging from ${Math.min(priorRuns.length, 20)} recent run(s)`);
      }
      // A_74 §8 DE2 — publish coverage at the START too, so a run that never reaches the end (the
      // ones DE1 shows are missing from the corpus) still reports what the corpus looked like.
      logLedgerDispersion(priorRuns);
      /**
       * A_74 §8 DE5 — what the cell scheduler WOULD choose, computed every run.
       *
       * In `shadow` this changes nothing and costs nothing; it exists so the scheduler's judgement
       * can be inspected across ordinary runs before any paid run depends on it. The assignment
       * itself is applied at the INPUT layer (scripts/schedule-run.mjs), not here — a scheduler that
       * rewrites the theme mid-orchestrator would be invisible to the config that names the run.
       */
      const schedulerMode = resolveSchedulerMode();
      // A_79 C — the corpus is passed so an "unoccupied" cell can distinguish "we have not been
      // there" from "nobody has". `loadCorpusCells` returns [] unless NOVELTY_CELL_SCHEDULER_CORPUS
      // is on, and an empty corpus leaves the chosen cell unchanged.
      if (schedulerMode !== "off") {
        logScheduledCell(scheduleCell(priorRuns, 20, loadCorpusCells()), schedulerMode);
      }
    } catch (err) {
      warnings.push(`Cross-run novelty load skipped: ${describeError(err)}`);
    }
  }
  return noveltyConstraints;
}

export async function runProfileStages(ctx: OrchestratorContext, skipTracker: ResumeSkipTracker, skippedStages: ResumeStageField[], stage: (field: ResumeStageField, run: (c: OrchestratorContext) => Promise<void>) => Promise<void>) {
  if (profilesParallelEnabled()) {
    ctx.warnings.push("[R9] Profile agents 2b/2c/2d running in PARALLEL (AGENT_PROFILES_PARALLEL).");
    const suppressedSave = async () => { };
    const isolated = (): { sub: OrchestratorContext; buf: string[]; } => {
      const buf: string[] = [];
      return { sub: { ...ctx, warnings: buf, savePartialReport: suppressedSave } as OrchestratorContext, buf };
    };

    // REVIEW_02 §3.1 — the resume gate lives in `stage()`, and this branch does not call it. Left
    // as it was, a resumed run with R9 on would RE-RUN all three profile agents whose artifacts had
    // just been restored: three needless LLM calls, restored artifacts overwritten with fresh ones,
    // and `skippedStages` under-reporting what the run did. R5's own acceptance test ("resume →
    // 0 LLM calls for stages 1-13") failed whenever R9's flag was on, and it looked like a resume
    // bug rather than a flag interaction. Consult the same tracker, then parallelise the remainder.
    type ProfileStage = {
      field: "characterProfiles" | "locationProfiles" | "temporalContext";
      run: (c: OrchestratorContext) => Promise<void>;
    };
    const profileStages: ProfileStage[] = [
      { field: "characterProfiles", run: runAgent2b },
      { field: "locationProfiles", run: runAgent2c },
      { field: "temporalContext", run: runAgent2d },
    ];
    const selection = skipTracker.selectPending(
      ctx as OrchestratorContext,
      profileStages.map((s) => s.field)
    );
    skippedStages.push(...selection.skipped);
    const isolatedRuns = profileStages
      .filter((s) => selection.pending.includes(s.field))
      .map((s) => ({ stage: s, ...isolated() }));

    // Promise.all rejects on the FIRST failure. Each agent keeps its own retry/abort semantics;
    // a rejection here propagates to the same catch that would have caught it sequentially.
    await Promise.all(isolatedRuns.map((r) => r.stage.run(r.sub)));

    // Artifact keys are assigned on the clone, so copy them back explicitly — and ONLY for stages
    // that ran. Copying from a clone of a skipped stage would write back the restored value, which
    // is harmless today but would mask a future divergence between clone and ctx.
    for (const r of isolatedRuns) {
      if (r.stage.field === "characterProfiles") ctx.characterProfiles = r.sub.characterProfiles;
      if (r.stage.field === "locationProfiles") ctx.locationProfiles = r.sub.locationProfiles;
      if (r.stage.field === "temporalContext") ctx.temporalContext = r.sub.temporalContext;
    }
    // Deterministic merge order — never arrival order. `isolatedRuns` preserves 2b → 2c → 2d.
    for (const r of isolatedRuns) ctx.warnings.push(...r.buf);
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  } else {
    await stage("characterProfiles", (c) => runAgent2b(c)); // Character Profiles
    await stage("locationProfiles", (c) => runAgent2c(c)); // Location Profiles
    await stage("temporalContext", (c) => runAgent2d(c));
  }
}

export function assembleCharacterBundleStage(ctx: OrchestratorContext) {
  if (ctx.inputs.enableCharacterBundle && ctx.characterProfiles && ctx.worldDocument) {
    ctx.characterBundle = assembleCharacterBundle(
      ctx.runId,
      ctx.characterProfiles,
      ctx.worldDocument,
      ((ctx.cml as any)?.CASE?.cast ?? (ctx.cast as any)?.characters ?? []) as ReadonlyArray<unknown>
    );
    try {
      const logsDir = join(WORKER_APP_ROOT, "logs");
      if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });
      writeFileSync(
        join(logsDir, `character-bundle-${ctx.runId}.json`),
        JSON.stringify(ctx.characterBundle, null, 2),
        "utf8"
      );
    } catch (err) {
      ctx.warnings.push(`Pillar 2: failed to write character-bundle file: ${String(err)}`);
    }
    ctx.warnings.push(
      `Pillar 2: character bundle assembled with ${ctx.characterBundle.characters.length} character(s): ` +
      ctx.characterBundle.characters.map((c) => c.name).join(", ")
    );
  }
}
