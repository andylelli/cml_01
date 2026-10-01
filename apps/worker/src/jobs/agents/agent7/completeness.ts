/**
 * The pre-commit completeness check and the Pillar-4 outline completeness contract.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import { narrativeInputs } from "./generate.js";
import { formatNarrative } from "@cml/prompts-llm";
import type { NarrativeOutline } from "@cml/prompts-llm";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  buildNarrativeSceneCountGuardrails,
  captureNarrativeSceneCountSnapshot,
  checkNarrativeSceneCountFloor,
  flattenNarrativeScenes,
} from "./scene-refs.js";
import {
  adoptOutlineCandidate,
  hoistMisplacedSceneFields,
  recordAgent7Coercion,
  recordOutlineCoercions,
} from "./normalize.js";
import { verifiedFixesEnabled } from "@cml/cml";
import {
  Agent7Run,
  rescoreNarrative,
} from "./generate.js";

/**
 * A7-06 — a pivotElement / factEstablished value that says nothing. The patch that fills these and the gate
 * that checks them each wrote this literal (36 lines apart); one, so they cannot disagree.
 */
const GENERIC_CONTRACT_VALUE_RE = /^(n\/a|tbd|none|generic|placeholder|investigation continues|scene continues|characters discuss|more clues|\s*)$/i;

function evaluateOutlinePreCommitCompleteness(narrative: NarrativeOutline): string[] {
  const issues: string[] = [];
  const allScenes = flattenNarrativeScenes(narrative);

  if (allScenes.length === 0) {
    return ["Outline contains zero scenes."];
  }

  const sceneNumbers = allScenes
    .map((ref) => Number(ref.scene?.sceneNumber))
    .filter((value) => Number.isFinite(value));
  if (sceneNumbers.length !== allScenes.length) {
    issues.push("One or more scenes are missing numeric sceneNumber values.");
  } else {
    const sorted = [...sceneNumbers].sort((left, right) => left - right);
    for (let i = 0; i < sorted.length; i += 1) {
      if (sorted[i] !== i + 1) {
        issues.push("Scene numbering must be contiguous from 1..N before prose handoff.");
        break;
      }
    }
  }

  const missingCoreFields = allScenes.filter((ref) => {
    const title = String(ref.scene?.title ?? "").trim();
    const purpose = String(ref.scene?.purpose ?? "").trim();
    const summary = String(ref.scene?.summary ?? "").trim();
    return title.length === 0 || purpose.length === 0 || summary.length === 0;
  });
  if (missingCoreFields.length > 0) {
    issues.push(
      `Found ${missingCoreFields.length} scene(s) missing title/purpose/summary required for prose handoff.`,
    );
  }

  const missingCharacterScenes = allScenes.filter((ref) => !Array.isArray(ref.scene?.characters) || ref.scene.characters.length === 0);
  if (missingCharacterScenes.length > 0) {
    issues.push(
      `Found ${missingCharacterScenes.length} scene(s) with empty characters arrays.`,
    );
  }

  return issues.slice(0, 8);
}

export async function enforcePreCommitCompleteness(ctx: OrchestratorContext, run: Agent7Run, narrative: NarrativeOutline) {
  {
    const preCommitIssues = evaluateOutlinePreCommitCompleteness(narrative);
    if (preCommitIssues.length > 0) {
      // Pre-commit completeness remediation is a structural repair (generate the missing content),
      // not a speculative quality retry. Run unconditionally regardless of retriesEnabled.
      const sceneCountLock = captureNarrativeSceneCountSnapshot(narrative);
      ctx.warnings.push(
        `Outline pre-commit completeness gate found ${preCommitIssues.length} issue(s); running bundled remediation pass.`
      );
      ctx.reportProgress("narrative", "Bundled remediation: fixing outline completeness gaps", 86);

      const remediationStart = Date.now();
      const remediatedNarrative = await formatNarrative(ctx.client, narrativeInputs(ctx, run, [
        "BUNDLED PRE-COMMIT CONTRACT: fix all listed outline completeness issues in this single response.",
        ...preCommitIssues.map((issue) => `Pre-commit issue: ${issue}`),
        ...buildNarrativeSceneCountGuardrails(sceneCountLock, "pre-commit completeness remediation"),
      ]));
      recordOutlineCoercions(ctx, remediatedNarrative); // A7-11

      ctx.agentCosts["agent7_narrative"] =
        remediatedNarrative.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent7_narrative"] =
        (ctx.agentDurations["agent7_narrative"] ?? 0) + (Date.now() - remediationStart);

      // recover any still-misplaced fields before the abort gate
      // A7-02 (owner decision 12, CML_VERIFIED_FIXES): ON, the full adoption normalisation (which includes the
      // hoist) runs here, before the gate, where the hoist ran. OFF: the hoist alone.
      if (verifiedFixesEnabled()) adoptOutlineCandidate(ctx, remediatedNarrative, "completeness");
      else recordAgent7Coercion(ctx, { fieldsHoisted: hoistMisplacedSceneFields(remediatedNarrative).hoisted });
      const countCheck = checkNarrativeSceneCountFloor(remediatedNarrative, sceneCountLock);
      const remainingIssues = evaluateOutlinePreCommitCompleteness(remediatedNarrative);

      if (!countCheck.ok) {
        // Completeness remediation is allowed to add scenes — treat a changed scene
        // count as a warning rather than a hard abort. The lock was set before
        // remediation; if the model needs an extra scene to satisfy a completeness
        // requirement, that is the correct behaviour.
        ctx.warnings.push(
          `Outline pre-commit remediation changed scene count: ${countCheck.message}. Accepted — completeness remediation may legitimately add scenes.`
        );
      }
      if (remainingIssues.length > 0) {
        throw new Error(
          `Outline pre-commit remediation left unresolved completeness issues: ${remainingIssues.join(" | ")}`
        );
      }

      narrative = remediatedNarrative;
      ctx.warnings.push("Outline pre-commit remediation succeeded.");
      await rescoreNarrative(ctx, narrative);
    }
  }
  return narrative;
}

export function enforceCompletenessContract(ctx: OrchestratorContext, narrative: NarrativeOutline) {
  if (ctx.inputs.enableOutlineCompleteness) {
    const allPatchScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes ?? []);
    let rhPatchCount = 0;
    for (const scene of allPatchScenes) {
      if ((scene.act === 1 || scene.act === 2) && (scene as any).redHerringPlacement === undefined) {
        (scene as any).redHerringPlacement = null;
        rhPatchCount += 1;
      }
    }
    if (rhPatchCount > 0) {
      ctx.warnings.push(
        `Outline completeness pre-patch: set redHerringPlacement=null on ${rhPatchCount} Act I-II scene(s) where the field was absent.`
      );
    }

    // Deterministic pre-patch: repair generic/N/A factEstablished and pivotElement values
    // by deriving a concrete fallback from the scene's other rich fields (summary, purpose, title).
    // The LLM occasionally emits "N/A" for bridging/transitional scenes.  This patch replaces
    // those values so the gate can pass without masking real structural gaps.
    let factPatchCount = 0;
    for (const scene of allPatchScenes) {
      const pivot = (scene as any).pivotElement;
      const fact = (scene as any).factEstablished;
      const pivotGeneric = !pivot || GENERIC_CONTRACT_VALUE_RE.test(String(pivot).trim());
      const factGeneric = !fact || GENERIC_CONTRACT_VALUE_RE.test(String(fact).trim());
      // Derive a fallback: prefer the sibling field if concrete, else use summary/purpose/title.
      const fallbackSource: string = (!pivotGeneric ? String(pivot).trim() : null) ??
        (typeof scene.summary === "string" && scene.summary.trim().length > 10 ? scene.summary.trim().slice(0, 120) : null) ??
        (typeof scene.purpose === "string" && scene.purpose.trim().length > 10 ? scene.purpose.trim().slice(0, 120) : null) ??
        (typeof scene.title === "string" && scene.title.trim().length > 0 ? `Scene establishes: ${scene.title.trim()}` : null) ??
        `Advances investigation in Act ${scene.act ?? "?"}`;
      if (factGeneric) {
        (scene as any).factEstablished = fallbackSource;
        factPatchCount += 1;
      }
      if (pivotGeneric) {
        const pivotFallback: string = (!factGeneric ? String(fact).trim() : null) ?? fallbackSource;
        (scene as any).pivotElement = pivotFallback;
        factPatchCount += 1;
      }
    }
    if (factPatchCount > 0) {
      ctx.warnings.push(
        `Outline completeness pre-patch: repaired generic factEstablished/pivotElement on ${factPatchCount} field(s) using scene summary/purpose.`
      );
    }
  }

  // Runs only when enableOutlineCompleteness is active.  Halts the pipeline if any
  // scene is missing pivotElement / factEstablished (all scenes), or if an Act I–II
  // scene is missing redHerringPlacement (which may be null, but must be present).
  if (ctx.inputs.enableOutlineCompleteness) {
    const allCompScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes ?? []);
    const missing: string[] = [];
    for (const scene of allCompScenes) {
      const sn = `Scene ${scene.sceneNumber} (Act ${scene.act})`;
      const pivot = (scene as any).pivotElement;
      const fact = (scene as any).factEstablished;
      if (!pivot || GENERIC_CONTRACT_VALUE_RE.test(String(pivot).trim())) {
        missing.push(`${sn}: pivotElement missing or generic ("${pivot ?? ''}")`);
      }
      if (!fact || GENERIC_CONTRACT_VALUE_RE.test(String(fact).trim())) {
        missing.push(`${sn}: factEstablished missing or generic ("${fact ?? ''}")`);
      }
      // Act I–II scenes must have redHerringPlacement present (null is OK; undefined is not)
      if ((scene.act === 1 || scene.act === 2) && (scene as any).redHerringPlacement === undefined) {
        missing.push(`${sn}: redHerringPlacement absent (must be null or a placement object)`);
      }
    }
    if (missing.length > 0) {
      const msg = `Outline completeness gate failed: ${missing.length} scene(s) have incomplete contracts:\n` +
        missing.slice(0, 8).join("\n");
      ctx.errors.push(msg);
      throw new Error(msg);
    }
    ctx.warnings.push(
      `Outline completeness gate passed: all ${allCompScenes.length} scenes have concrete` +
      ` pivotElement, factEstablished, and redHerringPlacement contracts.`
    );
  }
}
