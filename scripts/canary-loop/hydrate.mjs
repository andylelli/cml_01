import path from "path";
import { parseAgentCode, PIPELINE_AGENT_ORDER, getCanonicalAgentForCode } from "./config.mjs";

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

  const hydratedArtifacts = {};
  const missingRequiredArtifacts = [];

  for (const upstreamCode of upstreamCodes) {
    const artifacts = resolveLatestAgentArtifacts({
      records,
      runFolder: artifactBundle.runFolder,
      upstreamCode,
    });

    const agentName = describeAgent(upstreamCode);
    if (!artifacts?.responseFilePath) {
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
        partial: false,
        warnings,
      },
    },
  };
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
