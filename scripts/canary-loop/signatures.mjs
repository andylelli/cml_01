import crypto from "crypto";
import fs from "fs/promises";

export async function classifyFailureSignature({ agent, artifactBundle }) {
  const collected = await collectCandidateMessages(artifactBundle);
  const best = selectBestSignature(agent, collected);
  return best;
}

export function classifyFailureText({ agent, text, source = "runtime" }) {
  return classifyMessage(agent, {
    source,
    stage: "pipeline",
    text: text || "No runtime failure markers provided.",
  });
}

async function collectCandidateMessages(artifactBundle) {
  const candidates = [];

  if (artifactBundle.runReport) {
    const reason = artifactBundle.runReport.run_outcome_reason;
    if (reason) {
      candidates.push({
        source: "run_report.run_outcome_reason",
        stage: "pipeline",
        text: String(reason),
      });
    }

    const outcome = artifactBundle.runReport.run_outcome;
    if (outcome && outcome !== "success") {
      candidates.push({
        source: "run_report.run_outcome",
        stage: "pipeline",
        text: `run_outcome=${outcome}`,
      });
    }
  }

  const lastResponse = artifactBundle.agentResponses[artifactBundle.agentResponses.length - 1];
  if (lastResponse) {
    const text = await readSafe(lastResponse);
    if (text) {
      candidates.push({
        source: "agent_response",
        stage: "agent_output",
        text: tail(text, 5000),
      });
    }
  }

  for (const logPath of artifactBundle.logs ?? []) {
    const text = await readSafe(logPath);
    if (!text) {
      continue;
    }
    const bounded = extractRunScopedLogTail(text, artifactBundle.runId);
    if (bounded) {
      candidates.push({
        source: "log",
        stage: "pipeline",
        text: bounded,
      });
    }
  }

  if (candidates.length === 0) {
    candidates.push({
      source: "none",
      stage: "pipeline",
      text: "No failure markers discovered from artifacts.",
    });
  }

  return candidates;
}

function selectBestSignature(agent, candidates) {
  let best = null;
  for (const candidate of candidates) {
    const signature = classifyMessage(agent, candidate);
    if (!best || signature.confidence > best.confidence) {
      best = signature;
    }
  }
  return best;
}

function classifyMessage(agent, candidate) {
  const message = candidate.text;
  const lowered = message.toLowerCase();

  const rule =
    matchRule(lowered, /red[ -]?herring.*overlap|overlapping red herring/, {
      className: "agent5.red_herring_overlap",
      severity: "critical",
      kind: "error",
      confidence: 0.95,
      stage: "clues",
      validator: candidate.source,
    }) ??
    matchRule(lowered, /invalid source path|source path.*invalid|path.*out of bounds/, {
      className: "agent5.invalid_source_path",
      severity: "critical",
      kind: "error",
      confidence: 0.9,
      stage: "clues",
      validator: candidate.source,
    }) ??
    matchRule(lowered, /discriminating.*coverage|id coverage|coverage error/, {
      className: "agent5.discriminating_id_coverage",
      severity: "critical",
      kind: "error",
      confidence: 0.85,
      stage: "clues",
      validator: candidate.source,
    }) ??
    matchRule(lowered, /weak elimination evidence|suspect elimination coverage/, {
      className: "agent5.weak_elimination_evidence",
      severity: "critical",
      kind: "error",
      confidence: 0.82,
      stage: "clues",
      validator: candidate.source,
    }) ??
    matchRule(lowered, /time style|digit-time|\b\d{1,2}:\d{2}\b/, {
      className: "agent5.time_style_violation",
      severity: "warning",
      kind: "warning",
      confidence: 0.75,
      stage: "clues",
      validator: candidate.source,
    }) ??
    matchRule(lowered, /fair[ -]?play.*structural|critical fair[ -]?play/, {
      className: "agent6.fairplay_structural_critical",
      severity: "critical",
      kind: "error",
      confidence: 0.86,
      stage: "fairplay",
      validator: candidate.source,
    }) ??
    matchRule(lowered, /null guard|cannot read properties of null|undefined is not an object/, {
      className: "agent6.runtime_null_guard",
      severity: "critical",
      kind: "error",
      confidence: 0.84,
      stage: "runtime",
      validator: candidate.source,
    }) ??
    matchRule(lowered, /required_evidence.*missing|required evidence.*missing/, {
      className: "cml.required_evidence_missing",
      severity: "critical",
      kind: "error",
      confidence: 0.88,
      stage: "cml-revision",
      validator: candidate.source,
    }) ??
    matchRule(lowered, /schema.*required|required field|validation failed/, {
      className: "cml.schema_required_field_missing",
      severity: "critical",
      kind: "error",
      confidence: 0.72,
      stage: "schema",
      validator: candidate.source,
    }) ??
    matchRule(lowered, /backfill threshold|threshold breach/, {
      className: "orchestrator.backfill_threshold_breach",
      severity: "critical",
      kind: "error",
      confidence: 0.8,
      stage: "orchestrator",
      validator: candidate.source,
    });

  const classified =
    rule ??
    {
      className: "unknown.pipeline_failure",
      severity: "critical",
      kind: lowered.includes("warning") ? "warning" : "error",
      confidence: 0.45,
      stage: candidate.stage,
      validator: candidate.source,
    };

  const normalizedMessage = normalizeMessage(message);
  const signatureId = createSignatureId(classified.className, normalizedMessage, classified.stage);

  return {
    signatureId,
    agent,
    stage: classified.stage,
    class: classified.className,
    severity: classified.severity,
    confidence: classified.confidence,
    kind: classified.kind,
    message: normalizedMessage,
    evidence: [],
    rawMarkers: [truncate(message, 500)],
    validator: classified.validator,
  };
}

function matchRule(text, regex, output) {
  if (!regex.test(text)) {
    return null;
  }
  return output;
}

function normalizeMessage(message) {
  return String(message)
    .replace(/run_[a-f0-9-]{8,}/gi, "run_<id>")
    .replace(/\battempt\s*\d+\b/gi, "attempt <n>")
    .replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}t[0-9:.+-z]+/gi, "<timestamp>")
    .replace(/\s+/g, " ")
    .trim();
}

function createSignatureId(className, message, stage) {
  const hash = crypto
    .createHash("sha1")
    .update(`${className}|${message}|${stage}`)
    .digest("hex")
    .slice(0, 16);
  return `${className}:${hash}`;
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

function tail(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(text.length - maxLength);
}

function extractRunScopedLogTail(text, runId) {
  const lines = text.split(/\r?\n/);
  if (!runId) {
    return tail(text, 2000);
  }
  const filtered = lines.filter((line) => line.includes(runId));
  if (filtered.length === 0) {
    return null;
  }
  return tail(filtered.join("\n"), 2000);
}

async function readSafe(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}
