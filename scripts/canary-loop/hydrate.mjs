import path from "path";
import { parseAgentCode, PIPELINE_AGENT_ORDER, getCanonicalAgentForCode } from "./config.mjs";

const LEGACY_OPTIONAL_UPSTREAM_CODES = new Set(["2b", "2c", "2d"]);

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

  for (const upstreamCode of upstreamCodes) {
    const artifacts = resolveLatestAgentArtifacts({
      records,
      runFolder: artifactBundle.runFolder,
      upstreamCode,
    });

    const agentName = describeAgent(upstreamCode);
    if (!artifacts?.responseFilePath) {
      if (canDowngradeLegacyOptionalUpstream({ upstreamCode, startFromAgentCode, observedAgentCodes })) {
        downgradedOptionalArtifacts.push(agentName);
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

function resolveLatestAgentArtifacts({ records, runFolder, upstreamCode }) {
  const matching = records
    .filter((record) => parseAgentCode(record.agent) === upstreamCode)
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

  if (!matching.length) {
    return null;
  }

  const latest = matching[matching.length - 1];
  return {
    requestFilePath: resolveRunRelativePath(runFolder, latest.requestFile),
    responseFilePath: resolveRunRelativePath(runFolder, latest.responseFile),
    retryAttempt: latest.retryAttempt,
    sequence: latest.sequence,
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
 * The highest-sequence response for an agent code, parsed.
 *
 * ONE BODY, deliberately (REVIEW_04 §11.1 A3). `canary-agent-boundary.mjs` and `canary-agent3.mjs`
 * each carried their own copy, which is the two-bodies-for-one-concept trap S3 exists to prevent —
 * and it mattered here, because §11.3 is going to change how this resolves and a fix applied to one
 * copy would have left the other quietly wrong.
 *
 * `readResponseFile` is injected so each caller keeps its own file reader and JSON parser.
 */
export async function readLatestAgentJson(runState, runFolder, agentCode, readResponseFile) {
  const records = Array.isArray(runState?.records) ? runState.records : [];
  const matches = records
    .filter((record) => parseAgentCode(record.agent) === agentCode)
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

  if (matches.length === 0) {
    throw new Error(`Missing required hydrated response for agent code '${agentCode}'.`);
  }

  const latest = matches[matches.length - 1];
  if (!latest.responseFile) {
    throw new Error(`Missing response file metadata for agent code '${agentCode}'.`);
  }
  reportHydrationAmbiguity(agentCode, matches, latest);

  return readResponseFile(path.join(runFolder, latest.responseFile));
}
