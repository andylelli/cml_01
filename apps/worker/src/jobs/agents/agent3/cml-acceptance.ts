/**
 * Accepting a generated CML: the request builder, deterministic repairs (inference evidence, culprit alibi
 * coverage, alibi spans) with revalidation, and the victim/culprit collision check. Used by Agent 3's
 * first attempt and by both retries (collision, novelty). Moved from agent3-run.ts (code review A34-04 /
 * CR-24), which re-exports what it exported.
 */
import { envOn } from "../../env-flags.js";
import { generateCML } from "@cml/prompts-llm";
import {
  checkChronologyCoherence, deriveCaseChronology, findUnanchoredClockValues, isAlibiPlanEnabled,
  isChronologyEnabled, renderCaseTimes, renderPlannedCulpritAlibi, summariseChronology,
} from "@cml/cml";
import { parseClockTime, validateCml, alibiSpanFromWindow,
  isValidAlibiSpan,
  repairActualCovered,
  renderAlibiWindow,
} from "@cml/cml";
import { type OrchestratorContext } from "../shared.js";

function buildEvidenceFallback(step: any, stepIndex: number): string {
  const observation = String(step?.observation ?? "").trim();
  const correction = String(step?.correction ?? "").trim();
  const effect = String(step?.effect ?? "").trim();
  const source = observation || correction || effect;
  if (source.length > 0) {
    return `Corroborating evidence for step ${stepIndex}: ${source.slice(0, 140)}`;
  }
  return `Corroborating evidence for inference step ${stepIndex}.`;
}

function repairInferenceRequiredEvidence(cml: any): number {
  const caseBlock = cml?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps;
  if (!Array.isArray(steps)) {
    return 0;
  }

  let repairedCount = 0;
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    if (!step || typeof step !== "object") continue;
    if (Array.isArray(step.required_evidence) && step.required_evidence.length > 0) continue;

    step.required_evidence = [buildEvidenceFallback(step, i + 1)];
    repairedCount += 1;
  }

  return repairedCount;
}

/**
 * ── T2 FLOOR: DERIVE THE STRUCTURED ALIBI SPAN ONCE, HERE ────────────────────────────────────────
 *
 * `checkCaseTimelineDeception` prefers `cast[].alibi_span` over parsing `alibi_window`. That only
 * helps cases which HAVE a span, and every case on disk was authored before spans existed.
 *
 * This is the migration, and its placement is the point: the parse happens exactly ONCE, at Agent 3,
 * where a failure is cheap and — via `AGENT3_ALIBI_UNREADABLE_GATE` — visible. Everything downstream
 * reads numbers. That is what "no parser needed for our own facts" actually requires; a structured
 * field the model may or may not emit is not enough on its own.
 *
 * MEASURED before this existed: 6 of the 52 stored cases (12%) had a culprit whose window could not
 * be read at all, so the deception check was silent on one case in eight, and the four failures had
 * four different causes. Run 89022 scored 85/100 with its staged time of death OUTSIDE the culprit's
 * own alibi and nothing said so.
 *
 * NEVER OVERWRITES a span the model authored — a derived value must not silently replace a declared
 * one — and never invents a span from a window it cannot read. A window that stays unreadable is
 * still unreadable, and still reported; this floor closes the gap for the 88% it CAN read, not the
 * 12% it cannot.
 */
/**
 * ── REPAIR `actual_covered` RATHER THAN ABORT ON IT ─────────────────────────────────────────────
 *
 * The culprit's alibi covering the REAL time of death makes the concealment incoherent, and Agent 3
 * will not fix it: MEASURED on runs 22362 and 25586 it returned the IDENTICAL broken case on all
 * three attempts, with feedback naming the exact correction. 25586 then aborted having paid for four
 * artifacts.
 *
 * The arithmetic is trivial and cannot fail — see `repairActualCovered`, verified 4 of 4 against every
 * stored case with this shape. So the window is trimmed and the PROSE IS RE-RENDERED FROM THE TRIMMED
 * NUMBER, which is the one thing that makes this safe: value and words come out of a single function,
 * so the repair cannot leave the case saying 5:00–6:00 while the arithmetic believes 5:00–5:30. That
 * drift is the defect this project has met three times in other clothes.
 *
 * Requires a span, so it rides with `AGENT3_ALIBI_SPAN_FLOOR`. Repairs the CULPRIT only: a witness
 * whose alibi covers the real time of death is not a contradiction, it is a witness.
 */
export function repairCulpritAlibiCoverage(cml: any): Array<{ name: string; before: string; after: string }> {
  const caseBlock = cml?.CASE ?? cml;
  const mech = caseBlock?.hidden_model?.mechanism ?? {};
  const apparent = parseClockTime(mech.apparent_time_of_death);
  const actual = parseClockTime(mech.actual_time_of_death);
  if (apparent === null || actual === null) return [];

  const culprits: string[] = (caseBlock?.culpability?.culprits ?? []).map((n: unknown) => String(n ?? "").trim());
  const repaired: Array<{ name: string; before: string; after: string }> = [];

  for (const member of Array.isArray(caseBlock?.cast) ? caseBlock.cast : []) {
    if (!member || typeof member !== "object") continue;
    if (!culprits.includes(String(member.name ?? "").trim())) continue;
    if (!isValidAlibiSpan(member.alibi_span)) continue;

    const fixed = repairActualCovered(member.alibi_span, apparent, actual);
    if (!fixed) continue;

    const before = String(member.alibi_window ?? "");
    member.alibi_span = fixed;
    member.alibi_window = renderAlibiWindow(fixed);   // one function, so they cannot disagree
    repaired.push({ name: String(member.name ?? "?"), before, after: member.alibi_window });
  }
  return repaired;
}

export function deriveAlibiSpans(cml: any): { derived: number; unreadable: string[] } {
  const caseBlock = cml?.CASE ?? cml;
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  let derived = 0;
  const unreadable: string[] = [];

  for (const member of cast) {
    if (!member || typeof member !== "object") continue;
    if (isValidAlibiSpan(member.alibi_span)) continue;          // declared wins over derived
    const window = String(member.alibi_window ?? member.alibiWindow ?? "").trim();
    if (!window) continue;
    const span = alibiSpanFromWindow(window);
    if (!span) { unreadable.push(`${String(member.name ?? "?")}: ${JSON.stringify(window)}`); continue; }
    member.alibi_span = span;
    derived += 1;
  }
  return { derived, unreadable };
}

export function applyCmlRepairAndRevalidate(
  cmlResult: Awaited<ReturnType<typeof generateCML>>,
  ctx: OrchestratorContext,
  phase: string,
): Awaited<ReturnType<typeof generateCML>> {
  // A_53 P6 (inference-required-evidence-not-repaired-on-valid-path): repair empty required_evidence
  // UNCONDITIONALLY — a schema-VALID CML can still ship steps with required_evidence:[] (Agent 5
  // depends on it), so the prior early return on validity caused silent fair-play data loss. Only the
  // re-validation outcome is gated.
  const wasValid = cmlResult.validation.valid;
  /**
   * T2 — structure the alibi window before anything downstream reads it.
   *
   * FLAG-GATED, and it should have been from the start. Shipping this unflagged was a mistake: the
   * span feeds `checkCaseTimelineDeception`, so deriving spans STRENGTHENS a gate, and a change that
   * alters how often a gate fires is exactly what this project's flag discipline exists to control.
   *
   * MEASURED on run 25586: the floor derived 4 spans, the gate then saw `actual_covered` — the real
   * time of death (5:45) inside the culprit's own alibi (5:00–6:00), a genuine defect — Agent 3 failed
   * to fix it across all THREE attempts producing the identical case each time, and the run aborted
   * having paid for four artifacts. The detection was right and the outcome was still a lost run.
   *
   * OFF restores the pre-2026-09-05 baseline exactly. ON is worth having again once `actual_covered`
   * has a deterministic repair — trimming the culprit's window to exclude the real time of death is
   * always satisfiable when apparent and actual differ — because then a defect the model cannot fix
   * stops costing the whole run.
   */
  /**
   * A_90 Move 2 — runs BEFORE T2 so that, with both on, T2 finds nothing left to trim. Keeps every
   * culprit window that already satisfies the two invariants; renders the rest from the numbers with
   * the model's location kept. MEASURED over the archive with production flags: clears 15 of 15
   * flagged cases and touches 0 of 38 clean ones. The former abort on these codes becomes a repair.
   */
  let renderedByA90 = 0;
  if (isAlibiPlanEnabled()) {
    for (const change of renderPlannedCulpritAlibi(cmlResult.cml as any)) {
      renderedByA90 += 1;
      ctx.warnings.push(
        `[A_90 alibi-plan] ${change.name}'s alibi window (${change.reason}) rendered from the two death times, ` +
          `location kept: ${JSON.stringify(change.before)} -> ${JSON.stringify(change.after)}.`,
      );
    }
  }
  const spanFloorOn = envOn("AGENT3_ALIBI_SPAN_FLOOR");
  const spans = spanFloorOn
    ? deriveAlibiSpans(cmlResult.cml as any)
    : { derived: 0, unreadable: [] as string[] };
  if (spans.derived > 0 || spans.unreadable.length > 0) {
    ctx.warnings.push(
      `[T2 alibi-span] derived ${spans.derived} structured span(s) from prose windows` +
        (spans.unreadable.length
          ? `; ${spans.unreadable.length} window(s) UNREADABLE and left without one: ${spans.unreadable.join(" | ")}`
          : "; every window read"),
    );
  }
  /**
   * Gated on the FLAG, not on `spans.derived > 0`.
   *
   * FOUND BY AUDIT 2026-09-05. The first version ran the repair only when the floor had derived at
   * least one span — so a case where the model AUTHORED its spans (nothing to derive) never got
   * repaired, which is precisely the case T2 is building towards. `repairCulpritAlibiCoverage` is
   * already a no-op without a valid span, so calling it under the flag is both safe and correct.
   */
  if (spanFloorOn) {
    const coverage = repairCulpritAlibiCoverage(cmlResult.cml as any);
    for (const r of coverage) {
      ctx.warnings.push(
        `[T2 alibi-repair] ${r.name}'s alibi covered the REAL time of death, which Agent 3 does not fix ` +
          `on retry (measured: identical case on all 3 attempts, twice). Trimmed deterministically and ` +
          `the window re-rendered from the number: ${JSON.stringify(r.before)} -> ${JSON.stringify(r.after)}.`,
      );
    }
  }
  /**
   * A_90 Moves 1 and 3 — the chronology as the case states it, against the device's solved clock:
   * the one spelling rewrite that cannot manufacture a contradiction, then telemetry. Findings are
   * not errors here; `AGENT3_CHRONOLOGY_ERRORS` raises them inside generateCML's own loop instead,
   * where they reach the retry and Agent 4 rather than an abort.
   */
  if (isChronologyEnabled()) {
    try {
      const caseBlock = (cmlResult.cml as any)?.CASE ?? cmlResult.cml;
      const facts = (ctx.lockedFactRegistry ?? []) as any[];
      const chrono = deriveCaseChronology(caseBlock, facts);
      for (const change of renderCaseTimes(caseBlock, chrono)) {
        renderedByA90 += 1;
        ctx.warnings.push(
          `[A_90 chronology] respelled ${change.path}: ${JSON.stringify(change.before)} -> ${JSON.stringify(change.after)} (${change.reason}).`,
        );
      }
      const anchoring = findUnanchoredClockValues(caseBlock, chrono);
      const findings = checkChronologyCoherence(caseBlock, chrono, facts);
      ctx.warnings.push(`[A_90 chronology] ${phase}: ${summariseChronology(chrono, anchoring, findings)}`);
    } catch (error) {
      ctx.warnings.push(`[A_90 chronology] telemetry failed during ${phase}: ${(error as Error).message}`);
    }
  }

  const repairedCount = repairInferenceRequiredEvidence(cmlResult.cml as any);
  if (repairedCount === 0 && renderedByA90 === 0) {
    return cmlResult;
  }

  const repairedValidation = validateCml(cmlResult.cml as any);
  if (!repairedValidation.valid) {
    // Repair didn't yield a valid document — preserve the prior result/validation.
    return cmlResult;
  }

  if (repairedCount > 0) {
    ctx.warnings.push(
      `Agent 3: Auto-repaired required_evidence for ${repairedCount} inference step(s) during ${phase}` +
        (wasValid ? "." : " and recovered schema validity."),
    );
  }
  if (renderedByA90 > 0 && !wasValid) {
    ctx.warnings.push(
      `[A_90] ${renderedByA90} rendered value(s) recovered validity during ${phase} — the run continues where it used to abort.`,
    );
  }
  return {
    ...cmlResult,
    validation: repairedValidation,
  };
}

/**
 * Exported for `harness:agent3:direct`. The harness must build the SAME request production does —
 * a copy would test a prompt nobody runs, which is the divergence trap this repo has paid for
 * repeatedly (`restated-facts-must-be-generated-and-checked`).
 */
export function buildCmlGenerationRequest(ctx: OrchestratorContext, noveltyConstraints: any) {
  const setting = ctx.setting!;
  const cast = ctx.cast!;
  const backgroundContext = ctx.backgroundContext!;
  const hardLogicDevices = ctx.hardLogicDevices!;
  const hardLogicDirectives = ctx.hardLogicDirectives!;

  return {
    decade: setting.setting.era.decade,
    location: setting.setting.location.description,
    institution: setting.setting.location.type,
    tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
    weather: setting.setting.atmosphere.weather,
    socialStructure: setting.setting.era.socialNorms.join(", "),
    theme:
      ctx.inputs.theme && ctx.inputs.theme.trim().length > 0
        ? `${ctx.inputs.theme} | hard-logic modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`
        : `Hard-logic mystery | modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`,
    castSize: cast.cast.characters.length,
    castNames: cast.cast.characters.map((c: any) => c.name),
    castGenders: Object.fromEntries(cast.cast.characters.filter((c: any) => c.gender).map((c: any) => [c.name, c.gender])),
    detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
    victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
    complexityLevel: hardLogicDirectives.complexityLevel,
    mechanismFamilies: hardLogicDirectives.mechanismFamilies,
    primaryAxis: ctx.primaryAxis,
    hardLogicModes: hardLogicDirectives.hardLogicModes,
    difficultyMode: hardLogicDirectives.difficultyMode,
    hardLogicDevices: hardLogicDevices.devices,
    // REVIEW_04 §11.2 B1 — the device's locked times, so Agent 3 does not author a second clock.
    // Self-gating: `buildCMLPrompt` ignores them unless AGENT3_DEVICE_TIME_BINDING is on, and the
    // registry is empty unless `enableLockedFactRegistry` populated it.
    lockedFacts: ctx.lockedFactRegistry,
    backgroundContext,
    noveltyConstraints,
    runId: ctx.runId,
    projectId: ctx.projectId || "",
  };
}

/**
 * F1b: Validate that no culprit in culpability.culprits[] has role="victim" in the cast.
 * When the CML generator incorrectly assigns the victim as the culprit, Agent 9's
 * enforceCulpritEvidencePresence will inject an accusation for a dead character — producing
 * a story where the victim is simultaneously dead in Ch1 and accused in the final chapter.
 * Returns a list of collision messages (empty = clean).
 */
export function checkVictimCulpritCollision(cml: any): string[] {
  const culprits: string[] = Array.isArray(cml?.CASE?.culpability?.culprits)
    ? cml.CASE.culpability.culprits.map((n: any) => String(n ?? '').trim()).filter(Boolean)
    : [];
  if (culprits.length === 0) return [];

  const victimNames = new Set<string>(
    ((cml?.CASE?.cast ?? []) as any[])
      .filter((c: any) => {
        // Generated CML uses role_archetype ("victim", "the victim").
        // Example YAMLs may use the legacy `role` field — check both.
        // A_53 P4 (Pattern D): exact-match the controlled vocabulary, never substring — otherwise
        // "victim's confidant"/"victim advocate" false-positive as the victim.
        const ra = String(c.role_archetype ?? '').trim().toLowerCase().replace(/^the\s+/, '');
        const roleField = String(c.role ?? '').trim().toLowerCase();
        return ra === 'victim' || roleField === 'victim';
      })
      .map((c: any) => String(c.name ?? '').trim().toLowerCase())
  );

  return culprits
    .filter((name) => victimNames.has(name.toLowerCase()))
    .map((name) => `CML victim/culprit collision: "${name}" is listed as both a victim (role=victim in cast) and a culprit (culpability.culprits). This will cause an impossible story — accusation injected for a dead character.`);
}
