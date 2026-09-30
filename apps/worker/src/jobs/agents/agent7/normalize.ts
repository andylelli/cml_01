/**
 * Deterministic normalisation of a raw outline before schema validation: act purposes, word counts, beat coercion, field hoisting, and the coercion telemetry.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import { auditBeatJobs, isBeatJobFieldsEnabled, repairBeatSequence, isBeatSequenceRepairEnabled, stripClearanceText, GOLDEN_AGE_BEATS, isAgent7StructuredOutputEnabled, readOutlineCoercions } from "@cml/prompts-llm";
import type { NarrativeOutline } from "@cml/prompts-llm";
import { distributeChapterWordBudget } from "@cml/story-validation";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  isStripClearancesEnabled,
} from "./flags.js";

/**
 * Known natural-language aliases the LLM reaches for → the canonical Golden-Age beat.
 * Only high-confidence mappings; anything not here (and not already canonical) is dropped.
 */
const BEAT_SYNONYMS: Record<string, string> = {
  discovery: "crime",
  investigation: "first_enquiries",
  interrogation: "first_enquiries",
  interview: "first_enquiries",
  interviews: "first_enquiries",
  enquiries: "first_enquiries",
  inquiries: "first_enquiries",
  motive: "motives",
  suspicion: "motives",
  alibi: "alibis",
  confrontation: "final_trap",
  trap: "final_trap",
  climax: "final_trap",
  reveal: "revelation",
  resolution: "revelation",
  solution: "revelation",
  denouement: "revelation",
};

/**
 * Deterministically normalise `scene.beat` to the Golden-Age enum, in place.
 *
 * `scene.beat` is an OPTIONAL controlled-vocabulary field, but the schema enforces the
 * Golden-Age enum on ANY value present. The allowed vocabulary is only injected into the
 * prompt on the exact 10-chapter path (beatArcBlock in agent7-narrative.ts). Off that path
 * the model still emits `beat` and free-texts values like "interrogation"/"discovery"/
 * "resolution", which hard-abort the run at schema validation — even through the schema-repair
 * retry (run_01150a9f). Deterministic code owns `beat` (agent-7 redesign: beat is
 * scheduler-owned), so map known synonyms onto the canonical arc, normalise casing/whitespace,
 * and drop anything unrecognised. Never abort a run on this cosmetic, optional field.
 *
 * @returns counts of coerced (synonym-mapped) and dropped (unrecognised) beats.
 */
// ── R4 step 4: coercion telemetry ────────────────────────────────────────────
/**
 * How often the coercion layer actually fired this run, and under which arm.
 *
 * WHY THIS EXISTS. R3/R4 add schema-constrained decoding to Agent 7, which should make the ~55-site
 * coercion layer redundant. "Should" is the problem: REVIEW §2.4 catalogues three shape bugs that
 * failed SILENTLY, and the only reason they were expensive is that nothing counted them. Deleting
 * coercion because the schema is on would be the same mistake in reverse — removing a safety net on
 * a belief rather than on a measurement.
 *
 * S7 ("retire coercion sites proven dead") consumes these counters. The bar it should be held to:
 * zero firings across several real runs on the flag-ON arm, per helper, before any site is deleted.
 */
import type { Agent7CoercionCounters } from "../context.js";
export type { Agent7CoercionCounters };

const COUNT_KEYS = [
  "beatsCoerced", "beatsDropped", "fieldsHoisted",
  "parseRepaired", "parseExtracted", "totalsSynthesized", "totalScenesCorrected", "mechanismStagesCleared",
  "clueIdsDropped",
] as const;
type CountKey = (typeof COUNT_KEYS)[number];

const emptyCoercionCounters = (): Agent7CoercionCounters => ({
  structuredOutput: isAgent7StructuredOutputEnabled(),
  ...(Object.fromEntries(COUNT_KEYS.map((k) => [k, 0])) as Record<CountKey, number>),
  firings: 0,
});

/** `[R4]` line keys: the three original names first and unchanged, then A7-11's. */
const snake = (k: string): string => k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

/**
 * Accumulate one helper's result onto the run. Stored on `ctx`, never in module state — a module
 * counter would leak across runs in a batch harness and quietly inflate the very number S7 reads.
 */
export function recordAgent7Coercion(
  ctx: OrchestratorContext,
  delta: Partial<Record<CountKey, number>>,
): void {
  const counters = (ctx.agent7Coercion ??= emptyCoercionCounters());
  let changed = 0;
  for (const key of COUNT_KEYS) {
    counters[key] += delta[key] ?? 0;
    changed += delta[key] ?? 0;
  }
  if (changed > 0) counters.firings += 1;
}

/**
 * A7-11 — formatNarrative's own coercions on one returned outline, onto the run's counters. Called once
 * per outline, at every call site that keeps one. The `mechanism_stage` clearing was a console line only;
 * it is now a warning too.
 */
export function recordOutlineCoercions(ctx: OrchestratorContext, outline: unknown): void {
  const counts = readOutlineCoercions(outline);
  if (!counts) return;
  recordAgent7Coercion(ctx, counts);
  if (counts.mechanismStagesCleared > 0) {
    ctx.warnings.push(
      `[Agent 7] mechanism_stage ran backwards; cleared on ${counts.mechanismStagesCleared} scene(s) (the reveal order was out of sequence).`,
    );
  }
}

/**
 * Emit the run's counters once, to both channels that survive the process:
 *   - `ctx.warnings`, which the orchestrator captures wholesale into the `run_warnings` diagnostic
 *     (chain logs die with the terminal; the report is the durable record);
 *   - a dedicated report diagnostic, so an A/B analyser can read the number without regex over prose.
 *
 * Emitted even when every count is ZERO. A zero that is never written is indistinguishable from a
 * telemetry path that never ran — which is precisely the defect class this counter exists to detect.
 */
export function emitAgent7CoercionTelemetry(ctx: OrchestratorContext): void {
  const counters = ctx.agent7Coercion ?? emptyCoercionCounters();
  ctx.agent7Coercion = counters;

  ctx.warnings.push(
    `[R4] agent7 coercion telemetry: structured_output=${counters.structuredOutput} firings=${counters.firings} ` +
      COUNT_KEYS.map((k) => `${snake(k)}=${counters[k]}`).join(" "),
  );

  try {
    (ctx as any).scoreAggregator?.upsertDiagnostic?.(
      "agent7_coercion",
      "agent7_narrative",
      "Agent 7 Coercion Counters",
      "agent7_coercion",
      { ...counters },
    );
  } catch {
    // Telemetry must never abort a run that produced a valid outline.
  }
}

export function coerceNarrativeSceneBeats(narrative: unknown): { coerced: number; dropped: number } {
  const allowed = new Set<string>(GOLDEN_AGE_BEATS);
  let coerced = 0;
  let dropped = 0;
  const acts = (narrative as any)?.acts;
  if (!Array.isArray(acts)) return { coerced, dropped };
  for (const act of acts) {
    if (!act || !Array.isArray(act.scenes)) continue;
    for (const scene of act.scenes) {
      if (!scene || typeof scene !== "object" || scene.beat == null || scene.beat === "") continue;
      const key = String(scene.beat).trim().toLowerCase();
      if (allowed.has(key)) {
        if (scene.beat !== key) scene.beat = key; // normalise casing/whitespace
        continue;
      }
      if (BEAT_SYNONYMS[key]) {
        scene.beat = BEAT_SYNONYMS[key];
        coerced++;
      } else {
        delete scene.beat;
        dropped++;
      }
    }
  }
  return { coerced, dropped };
}

/**
 * ── A MISSING `estimatedWordCount` MUST NOT COST A RUN ──────────────────────────────────────────
 *
 * FOUND BY AN ABORT, run 87779 (2026-09-05, seed 87779). The model omitted `estimatedWordCount` on
 * every scene, twice in a row, and the outline failed schema validation with ten identical errors:
 *
 *     Outline schema failure: acts[0].scenes[0].estimatedWordCount is required   (x10)
 *     Pipeline failure: Narrative outline artifact failed schema validation
 *
 * MEASURED: this had never happened before — zero occurrences across `logs/llm.jsonl` and the store —
 * so it is a new compliance failure, not a regression. Contract recovery ran and could not supply the
 * field either.
 *
 * Synthesised for the same reason `act.purpose` is synthesised in `runAgent7`, and under the doctrine
 * `hoistMisplacedSceneFields` states above: never abort a run over a field the pipeline can work out
 * for itself. This one is the easiest of all — it is an ESTIMATE, and `distributeChapterWordBudget`
 * already computes exactly this number, position-weighted, and is what the scheduler uses downstream.
 * Deriving it is not a guess; it is the value the rest of the pipeline would have used regardless.
 *
 * NEVER OVERWRITES a count the model did author, so this can only turn an abort into a run.
 *
 * Exported, like its two siblings, because a repair that needs a £1 run to test is a repair nobody
 * tests — the same lesson the declared-derivation wiring taught on 2026-09-03.
 */
export function synthesiseMissingWordCounts(
  narrative: unknown,
  targetLength?: string,
): { scenes: number; acts: number } {
  const acts = Array.isArray((narrative as any)?.acts) ? (narrative as any).acts : [];
  const allScenes = acts.flatMap((act: any) => (Array.isArray(act?.scenes) ? act.scenes : []));
  if (allScenes.length === 0) return { scenes: 0, acts: 0 };

  const budgets = distributeChapterWordBudget(allScenes.length, targetLength);
  let scenes = 0;
  allScenes.forEach((scene: any, index: number) => {
    if (!scene || typeof scene !== "object") return;
    if (Number.isFinite(scene.estimatedWordCount)) return;
    scene.estimatedWordCount = budgets[index] ?? budgets[budgets.length - 1] ?? 1800;
    scenes += 1;
  });

  let actsFixed = 0;
  for (const act of acts) {
    if (!act || typeof act !== "object" || Number.isFinite(act.estimatedWordCount)) continue;
    const own = Array.isArray(act.scenes) ? act.scenes : [];
    act.estimatedWordCount = own.reduce(
      (sum: number, sc: any) => sum + (Number.isFinite(sc?.estimatedWordCount) ? sc.estimatedWordCount : 0),
      0,
    );
    actsFixed += 1;
  }
  return { scenes, acts: actsFixed };
}

/**
 * 2026-09-17 bug check — the clause loop and its regex were a second body of
 * `stripClearanceText` in `agent7-beat-sequence.ts` (WF-002: two components computing the same set
 * disagree exactly where one feeds a WRITE, and both of these write the outline). One body now, and
 * it carries the reveal-clause guard: a confrontation that mentions the culprit's broken alibi is
 * not a clearance.
 */
export function stripClearancesFromFinalScene(narrative: unknown): { stripped: string[] } {
  const acts = (narrative as any)?.acts;
  if (!Array.isArray(acts)) return { stripped: [] };
  const scenes = acts.flatMap((a: any) => (Array.isArray(a?.scenes) ? a.scenes : []));
  const last = scenes[scenes.length - 1];
  if (!last || typeof last !== "object") return { stripped: [] };
  const stripped: string[] = [...stripClearanceText(last)];
  if (typeof last.title === "string" && /^\s*clearances?\s+(?:and|&)\s+/i.test(last.title)) {
    stripped.push(last.title);
    last.title = last.title.replace(/^\s*clearances?\s+(?:and|&)\s+/i, "").trim();
  }
  return { stripped };
}

export function hoistMisplacedSceneFields(narrative: unknown): { hoisted: number } {
  let hoisted = 0;
  const acts = (narrative as any)?.acts;
  if (!Array.isArray(acts)) return { hoisted };
  const isEmpty = (v: unknown): boolean =>
    v == null || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0);
  for (const act of acts) {
    if (!act || !Array.isArray(act.scenes)) continue;
    for (const scene of act.scenes) {
      if (!scene || typeof scene !== "object") continue;
      const nested = scene.setting && typeof scene.setting === "object" ? scene.setting : null;
      if (nested) {
        for (const field of ["purpose", "summary", "characters", "cluesRevealed", "dramaticElements"] as const) {
          if (isEmpty(scene[field]) && !isEmpty(nested[field])) {
            scene[field] = nested[field];
            hoisted++;
          }
        }
      }
      // Last-resort summary synthesis from the model's OWN authored intent (purpose + dramatic beats),
      // so a scene given a title/purpose but no summary passes the completeness gate without fabricating
      // plot the model never wrote — and without aborting the run.
      if (isEmpty(scene.summary)) {
        const de = scene.dramaticElements && typeof scene.dramaticElements === "object" ? scene.dramaticElements : {};
        const parts = [scene.purpose, de.revelation, de.conflict, de.tension]
          .map((p: unknown) => (typeof p === "string" ? p.trim() : ""))
          .filter(Boolean);
        if (parts.length > 0) {
          scene.summary = parts.join(" ");
          hoisted++;
        }
      }
    }
  }
  return { hoisted };
}

export function normalizeRawOutline(ctx: OrchestratorContext, narrative: NarrativeOutline) {
  const ACT_DEFAULT_PURPOSES: Record<number, string> = {
    1: "Establish the setting, introduce key characters, and present the inciting incident.",
    2: "Develop the investigation, deepen the mystery, and introduce complications.",
    3: "Build to the confrontation, reveal the truth, and resolve the mystery.",
  };
  if (Array.isArray((narrative as any).acts)) {
    for (const act of (narrative as any).acts) {
      if (act && typeof act === "object" && !act.purpose && act.actNumber) {
        act.purpose = ACT_DEFAULT_PURPOSES[act.actNumber] ?? "Advance the story.";
        ctx.warnings.push(`act${act.actNumber}.purpose was missing — synthesised default.`);
      }
    }
  }

  // ── Truncation, named on attempt one ───────────────────────────────────────
  // MEASURED over 68 stored Agent 7 responses: 7 are truncated (10%), and 4 of the 5 earlier runs
  // carrying one still shipped a book — the schema-repair retry below is what rescued them. So this
  // REPORTS and does not abort; what was broken was that the eventual error blamed the schema.
  if ((narrative as { truncationWarning?: string; }).truncationWarning) {
    ctx.warnings.push(`[Agent 7] ${(narrative as { truncationWarning?: string; }).truncationWarning}`);
  }

  // ── Word-count synthesis (before schema validation) ─────────────────────────
  // See synthesiseMissingWordCounts: omitting this field aborted run 87779 outright.
  {
    const wordCounts = synthesiseMissingWordCounts(narrative, ctx.inputs.targetLength);
    if (wordCounts.scenes > 0 || wordCounts.acts > 0) {
      ctx.warnings.push(
        `Narrative word-count synthesis: the model omitted estimatedWordCount on ${wordCounts.scenes} scene(s) ` +
        `and ${wordCounts.acts} act(s); derived from distributeChapterWordBudget before schema validation — ` +
        `this exact omission aborted run 87779 outright.`
      );
    }
  }

  // ── Deterministic beat coercion (before schema validation) ──────────────────
  const beatCoercion = coerceNarrativeSceneBeats(narrative);
  recordAgent7Coercion(ctx, { beatsCoerced: beatCoercion.coerced, beatsDropped: beatCoercion.dropped });
  if (beatCoercion.coerced > 0 || beatCoercion.dropped > 0) {
    ctx.warnings.push(
      `Narrative beat coercion: mapped ${beatCoercion.coerced} synonym beat(s) to the Golden-Age arc, dropped ${beatCoercion.dropped} unrecognised beat(s) before schema validation.`
    );
  }
  const fieldHoist = hoistMisplacedSceneFields(narrative);
  recordAgent7Coercion(ctx, { fieldsHoisted: fieldHoist.hoisted });
  // A_95 M6 — did each beat do its job? Telemetry, not a gate: the CONTRACT in the prompt is the
  // operation (CLAUDE.md — a gate that drives retries costs +2.43 register points on the retried
  // chapter), and this line is how the next run says whether the contract landed. Baseline to beat:
  // false_solution 23 of 51, alibis 2 of 51.
  if (isBeatJobFieldsEnabled()) {
    const beatAudit = auditBeatJobs(narrative);
    const done = beatAudit.checked - beatAudit.failures.length;
    ctx.warnings.push(
      `[A_95 M6] beat jobs: ${done}/${beatAudit.checked} scenes did their beat's job` +
      (beatAudit.failures.length > 0
        ? ` — short: ${beatAudit.failures
          .map((f) => `s${f.sceneNumber}/${f.beat}${f.missingFields.length ? ` (no ${f.missingFields.join("+")})` : " (purpose)"}`)
          .join(", ")}`
        : "") +
      " — MEASURE only."
    );
  }

  // A_96 F2 — the beat sequence is a sequence: 36 of 52 stored outlines duplicated a beat, and a
  // second final_trap on run 50862 put the clearances AFTER the arrest and the reveal contract one
  // chapter late. Repairs (relabel / strip / retitle), never a gate.
  if (isBeatSequenceRepairEnabled()) {
    const seq = repairBeatSequence(narrative);
    const parts: string[] = [];
    if (seq.relabelled.length) parts.push(`relabelled ${seq.relabelled.map((r) => `s${r.sceneNumber} ${r.from}->${r.to}`).join(", ")}`);
    if (seq.clearancesStripped.length) parts.push(`clearances stripped after the reveal in s${[...new Set(seq.clearancesStripped.map((c) => c.sceneNumber))].join(",s")}`);
    if (seq.titlesStripped.length) parts.push(`beat-name prefixes removed from ${seq.titlesStripped.length} title(s)`);
    if (parts.length) ctx.warnings.push(`[A_96 F2] beat sequence repaired: ${parts.join("; ")}`);
  }

  // A_94 — the final scene may not order the alibi walk-back the prompt forbids (15 of 50 outlines did).
  if (isStripClearancesEnabled()) {
    const clearanceStrip = stripClearancesFromFinalScene(narrative);
    if (clearanceStrip.stripped.length > 0) {
      ctx.warnings.push(
        `[A_94] clearances stripped from the final (reveal) scene: ` +
        clearanceStrip.stripped.map((x) => JSON.stringify(x)).join(" | ")
      );
    }
  }
  if (fieldHoist.hoisted > 0) {
    ctx.warnings.push(
      `Narrative field hoist: recovered ${fieldHoist.hoisted} scene field(s) the model nested under 'setting' (purpose/summary/characters/…) before schema validation — prevents a spurious completeness abort.`
    );
  }
}
