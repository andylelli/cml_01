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
