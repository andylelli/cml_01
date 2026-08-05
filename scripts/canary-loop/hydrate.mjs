import path from "path";
import { parseAgentCode, PIPELINE_AGENT_ORDER, getCanonicalAgentForCode } from "./config.mjs";
import {
  chooseByManuscriptShape,
  committedManuscriptShape,
  loadCommittedArtifact,
  reportHydrationSource,
} from "./committed.mjs";

const LEGACY_OPTIONAL_UPSTREAM_CODES = new Set(["2b", "2c", "2d"]);

/**
 * X5 — agents that are *conditional*, not legacy: they are in `PIPELINE_AGENT_ORDER` because they
 * can run, and absent from a run's records because they were not needed.
 *
 * Agent 4 is the revision pass Agent 3 invokes only when its CML fails validation (`agent3-cml.ts`
 * → `reviseCml`, after the targeted-patch path has failed to resolve). **It has no records in any of
 * the thirteen archived runs** — so before this rule every replay reported a required upstream
 * missing, on every run, for a reason that was never a defect. A warning that always fires trains
 * people to read past warnings, which is how the real one gets missed.
 *
 * The distinction that keeps this honest: *no records at all* means the stage did not fire and there
 * is nothing to hydrate. *Records but no artifact* means it DID fire and the artifact is genuinely
 * missing — the CML downstream needs is the revised one, so that stays a hard error.
 */
const CONDITIONAL_UPSTREAM_CODES = new Set(["4"]);

export function buildHydrationBundle({
  artifactBundle,
  startFromAgentCode,
  selectedAgentCode,
  hydratePriorFromRun,
}) {
  const pipelineOrder = PIPELINE_AGENT_ORDER;
  const startIndex = pipelineOrder.indexOf(startFromAgentCode);
  const selectedIndex = pipelineOrder.indexOf(selectedAgentCode);

  if (startIndex < 0) {
    return {
      ok: false,
      errors: [`Unsupported --startFromAgent boundary '${startFromAgentCode}'.`],
      warnings: [],
    };
  }

  if (selectedIndex < 0) {
    return {
      ok: false,
      errors: [`Unsupported --agent code '${selectedAgentCode}'.`],
      warnings: [],
    };
  }

  if (startIndex > selectedIndex) {
    return {
      ok: false,
      errors: [
        `Invalid boundary: startFromAgent '${describeAgent(startFromAgentCode)}' is downstream of selected agent '${describeAgent(selectedAgentCode)}'.`,
      ],
      warnings: [],
    };
  }

  const upstreamCodes = pipelineOrder.slice(0, startIndex);
  const warnings = [];

  if (!hydratePriorFromRun) {
    if (upstreamCodes.length > 0) {
      return {
        ok: false,
        errors: [
          "--hydratePriorFromRun=false is unsupported when upstream dependencies exist and no deterministic synthetic context provider is configured.",
        ],
        warnings,
      };
    }

    return {
      ok: true,
      errors: [],
      warnings,
      bundle: {
        sourceRunId: artifactBundle.runId,
        startFromAgent: describeAgent(startFromAgentCode),
        upstreamAgents: [],
        hydratedArtifacts: {},
        missingRequiredArtifacts: [],
        integrity: {
          partial: false,
          warnings,
        },
      },
    };
  }

  const records = Array.isArray(artifactBundle?.runState?.records)
    ? artifactBundle.runState.records
    : [];
  const observedAgentCodes = new Set(
    records
      .map((record) => parseAgentCode(record?.agent))
      .filter((code) => typeof code === "string" && code.length > 0)
  );

  const hydratedArtifacts = {};
  const missingRequiredArtifacts = [];
  const downgradedOptionalArtifacts = [];
  const skippedConditionalArtifacts = [];

  for (const upstreamCode of upstreamCodes) {
    const artifacts = resolveLatestAgentArtifacts({
      records,
      runFolder: artifactBundle.runFolder,
      upstreamCode,
      selection: artifactBundle.committedSelection?.[upstreamCode],
    });

    const agentName = describeAgent(upstreamCode);
    // A store-backed artifact is present whether or not the prompt log recorded an attempt.
    if (!artifacts?.responseFilePath && artifacts?.source !== "committed_artifact") {
      if (canDowngradeLegacyOptionalUpstream({ upstreamCode, startFromAgentCode, observedAgentCodes })) {
        downgradedOptionalArtifacts.push(agentName);
        continue;
      }
      if (canDowngradeConditionalUpstream({ upstreamCode, observedAgentCodes })) {
        skippedConditionalArtifacts.push(agentName);
        continue;
      }
      missingRequiredArtifacts.push(agentName);
      continue;
    }

    hydratedArtifacts[agentName] = {
      agentCode: upstreamCode,
      requestFilePath: artifacts.requestFilePath,
      responseFilePath: artifacts.responseFilePath,
      retryAttempt: artifacts.retryAttempt,
      sequence: artifacts.sequence,
      // N5 — which source the replay will actually read. Without it the report names a file and
      // says nothing about whether that file is what the run committed.
      source: artifacts.source,
      committedType: artifacts.committedType,
    };
  }

  if (missingRequiredArtifacts.length) {
    return {
      ok: false,
      errors: [
        `Missing required upstream hydration artifacts: ${missingRequiredArtifacts.join(", ")}.`,
      ],
      warnings,
      bundle: {
        sourceRunId: artifactBundle.runId,
        startFromAgent: describeAgent(startFromAgentCode),
        upstreamAgents: upstreamCodes.map(describeAgent),
        hydratedArtifacts,
        missingRequiredArtifacts,
        integrity: {
          partial: true,
          warnings,
        },
      },
    };
  }

  // Stated as "did not run", never as "missing". The bundle is complete — the stage was not needed.
  if (skippedConditionalArtifacts.length) {
    warnings.push(
      `Conditional upstream stage(s) did not run in the source run, so there is nothing to hydrate: ${skippedConditionalArtifacts.join(
        ", "
      )}.`
    );
  }

  if (downgradedOptionalArtifacts.length) {
    warnings.push(
      `Legacy run layout detected; downgraded missing optional upstream artifacts: ${downgradedOptionalArtifacts.join(
        ", "
      )}.`
    );
  }

  return {
    ok: true,
    errors: [],
    warnings,
    bundle: {
      sourceRunId: artifactBundle.runId,
      startFromAgent: describeAgent(startFromAgentCode),
      upstreamAgents: upstreamCodes.map(describeAgent),
      hydratedArtifacts,
      missingRequiredArtifacts: [],
      integrity: {
        partial: downgradedOptionalArtifacts.length > 0,
        warnings,
      },
    },
  };
}

function canDowngradeLegacyOptionalUpstream({ upstreamCode, startFromAgentCode, observedAgentCodes }) {
  if (!LEGACY_OPTIONAL_UPSTREAM_CODES.has(upstreamCode)) {
    return false;
  }

  // The 2b/2c/2d branches were introduced later in the pipeline. If the source
  // run has no records for any branch-specific agents and we are hydrating for
  // a downstream boundary, treat them as legacy-optional rather than required.
  const startsDownstreamOfBranch = PIPELINE_AGENT_ORDER.indexOf(startFromAgentCode) > PIPELINE_AGENT_ORDER.indexOf("2d");
  if (!startsDownstreamOfBranch) {
    return false;
  }

  const hasAnyBranchRecords = ["2b", "2c", "2d"].some((code) => observedAgentCodes.has(code));
  return !hasAnyBranchRecords;
}

/**
 * X5. A conditional stage with **no records of its own** did not fire, so the bundle is complete
 * without it — no downgrade, no partial flag, just a statement that it did not run.
 *
 * Deliberately NOT gated on the start boundary the way the legacy 2b/2c/2d rule is. That rule asks
 * "is this an old run?"; this one asks "did this stage happen?", and the answer does not depend on
 * where the replay starts.
 *
 * If `observedAgentCodes` DOES contain the code, the stage fired and its artifact is required — the
 * CML every downstream agent needs is then the revised one, and hydrating the pre-revision copy
 * would replay a story the run did not tell.
 */
function canDowngradeConditionalUpstream({ upstreamCode, observedAgentCodes }) {
  if (!CONDITIONAL_UPSTREAM_CODES.has(upstreamCode)) return false;
  return !observedAgentCodes.has(upstreamCode);
}

/**
 * `selection` is N5's per-agent answer to "which attempt did the run commit?" (see
 * `committed.mjs`). When it names a response file, that file wins over the highest-sequence one —
 * otherwise the bundle would print attempt 20 while the replay read attempt 18.
 *
 * A `committed_artifact` selection keeps whatever file exists for provenance, but its `source` says
 * the payload comes from the store — and an agent whose artifact is in the store needs no prompt
 * record at all, which is how a deterministic stage like Agent 7.5 hydrates.
 */
function resolveLatestAgentArtifacts({ records, runFolder, upstreamCode, selection }) {
  const matching = records
    .filter((record) => parseAgentCode(record.agent) === upstreamCode)
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

  if (!matching.length) {
    return selection?.source === "committed_artifact"
      ? { source: selection.source, committedType: selection.committedType }
      : null;
  }

  const chosen =
    (selection?.responseFile && matching.find((r) => r.responseFile === selection.responseFile)) ||
    matching[matching.length - 1];

  return {
    requestFilePath: resolveRunRelativePath(runFolder, chosen.requestFile),
    responseFilePath: resolveRunRelativePath(runFolder, chosen.responseFile),
    retryAttempt: chosen.retryAttempt,
    sequence: chosen.sequence,
    source: selection?.source,
    committedType: selection?.committedType,
  };
}

function resolveRunRelativePath(runFolder, fileName) {
  if (!fileName || typeof fileName !== "string") {
    return undefined;
  }
  return path.join(runFolder, fileName);
}

function describeAgent(code) {
  return getCanonicalAgentForCode(code) ?? `Agent${code}`;
}

/**
 * WHICH ATTEMPT SHIPPED? THE ARTIFACTS DO NOT SAY — so this reports the guess instead of hiding it.
 *
 * MEASURED 2026-08-03 (`scripts/geometry-backtest.mjs`, REVIEW_04 §8). "The highest-sequence response
 * is the one the run kept" is FALSE. On `run_20260802-1654` Agent 7 produced three outlines — 10
 * beats, then 10 with a duplicated `revelation`, then 9 — and the shipped manuscript matches the
 * FIRST. On `run_20260802-1818` it produced two and the manuscript matches the SECOND. A later
 * attempt can score worse and be discarded, and `.actual-run-state.json` records only sequence,
 * agent, retryAttempt and file names: **no validation status, no success flag, nothing saying which
 * candidate was committed.**
 *
 * 10 of 11 recorded runs have at least one multi-attempt agent (Agent 7 in 8, Agent 2 in 5, Agent 3
 * in 3), so this is the normal case. Hydrating the wrong Agent-7 attempt hands the replay a different
 * CHAPTER COUNT — one of the two variables that dominate any single-run comparison, and precisely
 * what matched-pair A/B exists to hold fixed.
 *
 * The real fix is to read the COMMITTED artifacts (the `onArtifact` store production resume already
 * uses) rather than the prompt record — REVIEW_04 §11.3 C1. Until then the guess must at least be
 * visible, because a silently mis-hydrated arm reports as a measured one.
 */
export function reportHydrationAmbiguity(agentCode, matches, chosen) {
  if (!Array.isArray(matches) || matches.length <= 1) return;
  console.log(
    `HYDRATION_AMBIGUOUS code=${agentCode} attempts=${matches.length} ` +
      `using=${chosen?.responseFile ?? "?"} ` +
      `(candidates: ${matches.map((m) => m?.responseFile ?? "?").join(", ")}) ` +
      `— the artifacts do not record which attempt the run committed; the highest sequence is a GUESS`,
  );
}

/**
 * The response the run COMMITTED for an agent code, parsed.
 *
 * ONE BODY, deliberately (REVIEW_04 §11.1 A3). `canary-agent-boundary.mjs` and `canary-agent3.mjs`
 * each carried their own copy, which is the two-bodies-for-one-concept trap S3 exists to prevent —
 * and it mattered here, because N5 changed how this resolves and a fix applied to one copy would
 * have left the other quietly wrong.
 *
 * Three resolutions in descending strength — the committed artifact, the shipped manuscript's
 * shape, then the old highest-sequence guess said out loud. `committed.mjs` holds the evidence and
 * the reasoning; this function holds only the order.
 *
 * `readResponseFile` is injected so each caller keeps its own file reader and JSON parser.
 */
export async function readLatestAgentJson(runState, runFolder, agentCode, readResponseFile, options = {}) {
  const records = Array.isArray(runState?.records) ? runState.records : [];
  const matches = records
    .filter((record) => parseAgentCode(record.agent) === agentCode)
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

  const workspaceRoot = options.workspaceRoot ?? process.cwd();
  const projectId = options.projectId ?? runState?.projectId;
  const runId = options.runId ?? runState?.runId;

  // 1. The committed artifact. No inference at all — this is what the stage handed downstream.
  const committed = await loadCommittedArtifact({ workspaceRoot, projectId, agentCode });
  if (committed) {
    reportHydrationSource(agentCode, "committed_artifact", `type=${committed.type} project=${projectId}`);
    return committed.payload;
  }

  if (matches.length === 0) {
    throw new Error(`Missing required hydrated response for agent code '${agentCode}'.`);
  }

  // 2. The shipped manuscript's shape. Only the outline is resolved this way: it is the artifact
  //    whose attempt choice changes the chapter count, and the only one the manuscript evidences.
  if (matches.length > 1 && agentCode === "7") {
    const selected = await selectOutlineByManuscript({ matches, runFolder, readResponseFile, workspaceRoot, runId });
    if (selected) return selected;
  }

  // 3. The guess, reported.
  const latest = matches[matches.length - 1];
  if (!latest.responseFile) {
    throw new Error(`Missing response file metadata for agent code '${agentCode}'.`);
  }
  reportHydrationAmbiguity(agentCode, matches, latest);

  return readResponseFile(path.join(runFolder, latest.responseFile));
}

/**
 * Resolution 2, kept separate so its failure is a fall-through and never an abort: an unparseable
 * candidate among twenty attempts must not take the replay down, it must leave the guess in place.
 */
async function selectOutlineByManuscript({ matches, runFolder, readResponseFile, workspaceRoot, runId }) {
  const shape = await committedManuscriptShape({ workspaceRoot, runId });
  if (!shape) return null;

  const candidates = [];
  for (const record of matches) {
    if (!record.responseFile) continue;
    try {
      candidates.push({
        sequence: record.sequence ?? 0,
        responseFile: record.responseFile,
        outline: await readResponseFile(path.join(runFolder, record.responseFile)),
      });
    } catch {
      // A candidate that will not parse cannot be the one that shipped.
    }
  }

  const chosen = chooseByManuscriptShape(candidates, shape);
  if (!chosen) return null;
  reportHydrationSource(
    "7",
    "committed_manuscript_shape",
    `using=${chosen.candidate.responseFile} chapters=${shape.chapterCount} ` +
      `titlesAgreeing=${chosen.agreement}/${shape.chapterCount} ` +
      `(of ${chosen.consideredCount} attempt(s) with the committed chapter count, ${candidates.length} total)`,
  );
  return chosen.candidate.outline;
}
