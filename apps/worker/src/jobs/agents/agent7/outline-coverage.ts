/**
 * Outline coverage: the closure/test/elimination vocabularies, the quality gate, and the deterministic coverage patch.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import { formatNarrative } from "@cml/prompts-llm";
import type { NarrativeOutline } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import {
  type OrchestratorContext,
  type OutlineCoverageIssue,
  buildOutlineRepairGuardrails,
} from "../shared.js";
import {
  buildNarrativeSceneCountGuardrails,
  captureNarrativeSceneCountSnapshot,
  checkNarrativeSceneCountFloor,
  flattenNarrativeScenes,
} from "./scene-refs.js";
import {
  Agent7Run,
  rescoreNarrative,
} from "./generate.js";

const OUTLINE_TEST_TERMS_RE = /\b(tests?|experiments?|re-?enact|reenact|traps?|demonstrat\w*|verif\w*|proofs?|examin\w*|timing\s+test|constraint\s+proof)\b/i;

const OUTLINE_EXCLUSION_TERMS_RE = /\b(exclud\w*|exclusions?|eliminat\w*|ruled\s+out|could\s*not\s+have|cannot\s+be\s+the\s+culprit|only\s+one\s+person\s+could|impossible\s+for|proves?\s+innocent)\b/i;

/**
 * X62 — A TRAILING `\b` NEUTERS A STEM, AND BOTH OF THESE LISTS SHIPPED WITH ONE.
 *
 * `\b(...|eliminat|...)\b` cannot match "eliminate", "eliminating" or "eliminated": after `eliminat`
 * comes a word character, so the closing boundary fails. The term matched only the bare string
 * "eliminat", which no outline has ever written. `\balibi\b` missed "alibis" the same way, and
 * `\bclue\b` missed "clues".
 *
 * MEASURED over the 32 archived Agent 7 outlines: the closure FLOOR below fired on **17 of 32** with
 * the old lists and **8 of 32** with these. Nine outlines were told they had no suspect-closure
 * coverage while their own scenes said "Clearing the Others" and "verifying their alibis" — and that
 * false alarm is not free. It drives an outline retry, a repair guardrail, and a deterministic patch
 * that APPENDS clearance language to an Act 3 scene, so a wordlist that could not read the outline was
 * manufacturing the very duplicate clearances three external reads complained about.
 *
 * Inflections only. No new vocabulary: every term here is one the old list already intended.
 */
export const OUTLINE_EVIDENCE_TERMS_RE = /\b(because|therefore|proofs?|evidence|measured|timed|observed|alibis?|timelines?|constraints?|clues?)\b/i;

export const OUTLINE_ELIMINATION_TERMS_RE = /\b(clear(?:ed|s|ing)|clear\s+(?:the\s+)?(?:innocent\s+)?suspects?|rul(?:ed|es|ing)\s+out|eliminat\w*|exclud\w*|innocent|not\s+the\s+(?:culprit|killer|murderer)|alibis?\s+(?:hold|holds|confirmed|verified)|could\s*not\s+have)\b/i;

/** The scene fields both closure checks read. One helper so the floor and the ceiling cannot drift. */
export const sceneClosureText = (scene: any): string =>
  [scene?.title ?? "", scene?.purpose ?? "", scene?.summary ?? "", scene?.dramaticElements?.revelation ?? ""].join(" ");

/**
 * X32 — how many scenes carry a suspect-clearance JOB, counted one scene at a time.
 *
 * Check 2 below is a floor with no ceiling: it joins every scene into a single string and asks whether
 * the language appears anywhere, so three clearance scenes satisfy it exactly as one does. The defect
 * named in three external reads is the opposite shape — a cleared suspect cleared again, after the
 * question is settled — and nothing in the pipeline could see it.
 */
export const countSuspectClosureScenes = (narrative: any): string[] =>
  ((narrative?.acts ?? []) as any[])
    .flatMap((act: any) => (Array.isArray(act?.scenes) ? act.scenes : []))
    .filter((scene: any) => {
      const text = sceneClosureText(scene);
      return OUTLINE_ELIMINATION_TERMS_RE.test(text) && OUTLINE_EVIDENCE_TERMS_RE.test(text);
    })
    .map((scene: any) => String(scene?.title ?? `scene ${scene?.sceneNumber ?? "?"}`));

export function evaluateOutlineCoverage(narrative: NarrativeOutline, cml: CaseData): OutlineCoverageIssue[] {
  const issues: OutlineCoverageIssue[] = [];
  const cmlCase = (cml as any)?.CASE ?? {};
  const allScenes = (narrative.acts ?? []).flatMap((act) =>
    Array.isArray(act.scenes) ? act.scenes : []
  );

  // --- Check 1: discriminating test scene ---
  const hasDiscriminatingTestScene = allScenes.some((scene) => {
    const blob = [
      scene.title ?? "",
      scene.purpose ?? "",
      scene.summary ?? "",
      scene.dramaticElements?.revelation ?? "",
      scene.dramaticElements?.tension ?? "",
    ].join(" ");
    return (
      OUTLINE_TEST_TERMS_RE.test(blob) &&
      OUTLINE_EXCLUSION_TERMS_RE.test(blob) &&
      OUTLINE_EVIDENCE_TERMS_RE.test(blob)
    );
  });
  const DISC_TEST_FALLBACK_RE = /discriminating|re-?enactment|crucial\s+test|decisive\s+experiment|trap\s+is\s+set|ruling\s+out/i;
  const hasTestMention = allScenes.some((scene) =>
    DISC_TEST_FALLBACK_RE.test([scene.title ?? "", scene.purpose ?? "", scene.summary ?? ""].join(" "))
  );
  if (!hasDiscriminatingTestScene && !hasTestMention) {
    issues.push({
      type: "missing_discriminating_test_scene",
      message:
        "Outline has no scene whose summary/purpose contains discriminating test, re-enactment, or suspect-elimination language",
    });
  }

  // --- Check 2: suspect closure / elimination coverage ---
  const castRoster: any[] = Array.isArray(cmlCase.cast) ? cmlCase.cast : [];
  const culprits: string[] = Array.isArray(cmlCase.culpability?.culprits)
    ? (cmlCase.culpability.culprits as string[])
    : [];
  const suspects = castRoster
    .filter((c: any) => String(c.role_archetype ?? c.role ?? '').toLowerCase().includes('suspect'))
    .map((c: any) => (c.name ?? "").trim())
    .filter((name: string) => name.length > 0 && !culprits.includes(name));

  if (suspects.length > 0) {
    const allSceneText = allScenes.map(sceneClosureText).join(" ");
    const hasAnyClosure =
      OUTLINE_ELIMINATION_TERMS_RE.test(allSceneText) && OUTLINE_EVIDENCE_TERMS_RE.test(allSceneText);
    if (!hasAnyClosure) {
      issues.push({
        type: "missing_suspect_closure_scene",
        message:
          "Outline has no scene with suspect elimination/closure language (cleared, ruled out, alibi confirmed, etc.)",
      });
    }

    // --- Check 3: suspect closure CEILING (X32) ---
    //
    // Check 2 can only ever complain about too FEW clearances. The 08-19 outline allocated the job to
    // two scenes ("Clearing the Others" in Act 2 and "Clearances and Culprit Revealed" in Act 3) and
    // the manuscript duly resolved the suspects, resolved them again during the discriminating test,
    // and resolved them a third time after the confession. Check 2 was satisfied throughout, so
    // `AGENT9_FOLD_SUSPECT_CLEARANCES` — which lives inside the repair guardrail Check 2 triggers —
    // was never reachable on the run whose defect it was built to fix.
    //
    // GATED on that same flag, because ANY issue here drives an outline retry (see the call site) and
    // 11 of the 32 archived outlines allocate more than one. Flag off: default behaviour is unchanged
    // and the count is reported as a warning only. Flag on: the ceiling drives the fold guardrail, at
    // the trigger where folding is the actual repair.
    // 2026-08-23 — THE ISSUE IS GONE; THE REPAIR IS A STAMP. See `applySuspectClearanceGate` below.
    //
    // Raising an issue here put the repair on the outline-RETRY path, and that is the whole reason the
    // flag stayed off: 11 of 32 archived outlines allocate the job more than once, so turning it on
    // re-rolled a third of all outlines at a fresh Agent 7 call each — to fix a defect a re-roll is
    // not even reliably going to avoid reproducing. The flag is named *fold*, and A_67 FIX-1 Change C
    // designed it as a fold, so it now folds: a deterministic per-scene gate, no retry, no LLM call.
    //
    // The count stays visible as the always-on `[X32]` warning at the call site, which is what it was
    // built to be.
  }

  return issues;
}

export async function enforceOutlineQuality(ctx: OrchestratorContext, run: Agent7Run, narrative: NarrativeOutline) {
  const closureSceneTitles = countSuspectClosureScenes(narrative);
  if (closureSceneTitles.length > 1) {
    ctx.warnings.push(
      `[X32] Outline gives a suspect-clearance job to ${closureSceneTitles.length} scenes: ` +
      `${closureSceneTitles.join("; ")}. Every pass after the first repeats a resolved beat.`
    );
  }

  const outlineCoverageIssues = evaluateOutlineCoverage(narrative, ctx.cml!);
  if (outlineCoverageIssues.length > 0) {
    if (!run.contractRecoveryEnabled) {
      outlineCoverageIssues.forEach((issue) => ctx.warnings.push(`Outline coverage gap (contract recovery disabled): ${issue.message}`)
      );
    } else {
      const sceneCountLock = captureNarrativeSceneCountSnapshot(narrative);
      const outlineGuardrails = buildOutlineRepairGuardrails(outlineCoverageIssues, ctx.cml!);
      const countGuardrails = buildNarrativeSceneCountGuardrails(sceneCountLock, "coverage repair");
      outlineCoverageIssues.forEach((issue) => ctx.warnings.push(`Outline coverage gap: ${issue.message}`)
      );
      ctx.warnings.push("Regenerating outline with targeted quality guardrails");
      ctx.reportProgress("narrative", "Regenerating outline to address coverage gaps", 80);

      const narrativeRetryStart = Date.now();
      const retriedNarrative = await formatNarrative(ctx.client, {
        caseData: ctx.cml!,
        clues: ctx.clues!,
        targetLength: ctx.inputs.targetLength,
        narrativeStyle: ctx.inputs.narrativeStyle,
        detectiveType: ctx.inputs.detectiveType,
        qualityGuardrails: [...outlineGuardrails, ...countGuardrails, ...run.pacingGuardrails],
        runId: ctx.runId,
        projectId: ctx.projectId || "",
        ...run.lockedFactsSpread,
        ...run.completenessSpread,
      });

      ctx.agentCosts["agent7_narrative"] =
        retriedNarrative.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent7_narrative"] =
        (ctx.agentDurations["agent7_narrative"] || 0) + (Date.now() - narrativeRetryStart);

      const retryOutlineIssues = evaluateOutlineCoverage(retriedNarrative, ctx.cml!);
      const retryCountCheck = checkNarrativeSceneCountFloor(retriedNarrative, sceneCountLock);

      if (retryOutlineIssues.length < outlineCoverageIssues.length && retryCountCheck.ok) {
        narrative = retriedNarrative;
        ctx.warnings.push("Outline retry improved coverage");
        await rescoreNarrative(ctx, narrative);
        ctx.reportProgress(
          "narrative",
          `Outline retry: ${retriedNarrative.totalScenes} scenes (${retriedNarrative.estimatedTotalWords} words)`,
          85
        );
      } else {
        if (!retryCountCheck.ok) {
          ctx.warnings.push(
            `Outline retry rejected due to scene-count lock violation (${retryCountCheck.message}); keeping baseline outline and passing quality guardrails to prose generation.`
          );
        } else {
          ctx.warnings.push("Outline retry did not improve; will pass guardrails to prose generation");
        }
      }
    }
  }
  return narrative;
}

export function applyCoveragePatch(ctx: OrchestratorContext, narrative: NarrativeOutline) {
  let finalCoverageIssues: OutlineCoverageIssue[];
  let coveragePatched = false;
  {
    const prePatchIssues = evaluateOutlineCoverage(narrative, ctx.cml!);
    finalCoverageIssues = prePatchIssues;
    // A_53 P1 (holistic): derive the patch vocabulary from the case's OWN discriminating test +
    // cast, never a fixed plot. The previous patch spliced a literal "clock mechanism" and exactly
    // "two suspects" into ANY mystery missing a discriminating-test scene — a false plot beat that
    // Agent 9 then honoured. We now parameterise the test method and the ruled-out count, and refer
    // to the mechanism only generically (so a poison/tide/acoustic case is never told it has a clock).
    const patchCase = (ctx.cml as any)?.CASE ?? {};
    const patchDiscrim = patchCase.discriminating_test ?? {};
    const patchMethod = String(patchDiscrim.method ?? "constraint_proof").replace(/_/g, " ").trim() || "constraint proof";
    const patchDesign = String(patchDiscrim.design ?? "").trim();
    const patchDesignClause = patchDesign ? ` (${patchDesign})` : "";
    const patchCulprits: string[] = Array.isArray(patchCase.culpability?.culprits)
      ? (patchCase.culpability.culprits as string[])
      : [];
    const nonCulpritSuspectCount = (Array.isArray(patchCase.cast) ? patchCase.cast : [])
      .filter((c: any) => String(c?.role_archetype ?? c?.role ?? "").toLowerCase().includes("suspect"))
      .map((c: any) => String(c?.name ?? "").trim())
      .filter((name: string) => name.length > 0 && !patchCulprits.includes(name)).length;
    const numberWord = (n: number): string => ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][n] ?? String(n);
    const ruledOutPhrase = nonCulpritSuspectCount >= 1
      ? `${numberWord(nonCulpritSuspectCount)} suspect${nonCulpritSuspectCount === 1 ? "" : "s"}`
      : "the other suspects";

    if (prePatchIssues.some((issue) => issue.type === "missing_discriminating_test_scene")) {
      const allRefs = flattenNarrativeScenes(narrative);
      const act2Last = [...allRefs].filter((r) => r.act === 2).at(-1);
      const act3First = allRefs.find((r) => r.act === 3);
      const fallback = allRefs[Math.floor(allRefs.length * 0.6)];
      const candidate = act2Last ?? act3First ?? fallback;
      if (candidate?.scene) {
        const patch = `The detective stages a discriminating ${patchMethod} test${patchDesignClause}: its` +
          ` constraints prove that ${ruledOutPhrase} are ruled out because the established mechanism` +
          ` could not have been operated by them — the evidence, timeline, and alibi confirm only the` +
          ` culprit had access.`;
        candidate.scene.purpose = [candidate.scene.purpose ?? "", patch].filter(Boolean).join(" ");
        coveragePatched = true; // A_53 P10: a purpose changed → final coverage scan must re-run.
        ctx.warnings.push(
          `Outline discriminating-test vocabulary patch applied deterministically to` +
          ` scene ${candidate.sceneNumber} (act ${candidate.act}).`
        );
      }
    }
    if (prePatchIssues.some((issue) => issue.type === "missing_suspect_closure_scene")) {
      const allRefs = flattenNarrativeScenes(narrative);
      const act3Scenes = allRefs.filter((r) => r.act === 3);
      const candidate = act3Scenes.at(-2) ?? act3Scenes.at(-1) ?? allRefs.at(-1);
      if (candidate?.scene) {
        const patch = `Suspects are systematically cleared: alibi confirmed for ${ruledOutPhrase}, ruled out by` +
          ` timeline evidence, leaving only the culprit identified by a complete evidence chain.`;
        candidate.scene.purpose = [candidate.scene.purpose ?? "", patch].filter(Boolean).join(" ");
        coveragePatched = true; // A_53 P10: a purpose changed → final coverage scan must re-run.
        ctx.warnings.push(
          `Outline suspect-closure vocabulary patch applied deterministically to` +
          ` scene ${candidate.sceneNumber} (act ${candidate.act}).`
        );
      }
    }
  }
  return { finalCoverageIssues, coveragePatched };
}
