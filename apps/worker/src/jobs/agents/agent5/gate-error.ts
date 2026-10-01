/**
 * A5-06 (R1) — Agent 5's hard gates fail with a TYPED error naming the gate, not only a message.
 *
 * Before this, `classifyAgent5FailureClass` read the failure class off the message text with five
 * regexes, and every gate the regexes did not anticipate fell to `agent5.unknown_failure`. The gate is
 * now carried on the error, so a consumer can switch on it and the compiler sees every gate.
 *
 * THE LABELS ARE UNCHANGED. `ctx.agent5FailureClass` reaches `scripts/canary-loop/validate.mjs`, so a
 * typed error must not move any run's label. Each gate maps to exactly the label the regex produced
 * for that gate's message:
 *   - a gate whose message is fixed text (plus a count) maps to a constant — the regex's verdict on
 *     that text, pinned per gate by `r1-agent5-gate-error.test.ts`;
 *   - a gate whose message carries model- or case-derived text (`by_message`) keeps the regex, because
 *     that text can move the regex's verdict and a constant would then change a label.
 * Untyped errors keep the regex as their only classifier.
 *
 * The error's `name` is deliberately left as "Error" so `String(err)` and stack headers are
 * byte-identical to the plain `Error` it replaces.
 */

export type Agent5Gate =
  | "extraction_payload"
  | "red_herring_overlap"
  | "source_path"
  | "step_index"
  | "cast_path"
  | "audit_consistency"
  | "era_time_style"
  | "time_conflict"
  | "culprit_evidence"
  | "deterministic_contract"
  | "coverage";

export class Agent5GateError extends Error {
  readonly gate: Agent5Gate;
  constructor(gate: Agent5Gate, message: string) {
    super(message);
    this.gate = gate;
  }
}

/** The legacy message classifier — unchanged, and still the classifier for untyped failures. */
export const classifyAgent5FailureMessage = (message: string): string => {
  const normalized = String(message ?? "").toLowerCase();
  if (/red-?herring\s+overlap/.test(normalized)) return "agent5.red_herring_overlap";
  if (/source-?path|source path/.test(normalized)) return "agent5.invalid_source_path";
  if (/discriminating.*(id|evidence clue)|evidence id/.test(normalized)) return "agent5.discriminating_id_coverage";
  if (/weak elimination|suspect-coverage/.test(normalized)) return "agent5.weak_elimination_evidence";
  if (/time-style|digit-based time/.test(normalized)) return "agent5.time_style_violation";
  return "agent5.unknown_failure";
};

/**
 * Gate → today's label. `by_message` = the message carries variable text that can change the regex's
 * verdict, so the regex stays authoritative for it.
 */
export const AGENT5_GATE_LABEL: Readonly<Record<Agent5Gate, string>> = {
  extraction_payload: "agent5.unknown_failure",
  // The regex's FIRST rule matches this gate's fixed prefix, so its variable suffix cannot change it.
  red_herring_overlap: "agent5.red_herring_overlap",
  source_path: "agent5.invalid_source_path",
  step_index: "agent5.unknown_failure",
  cast_path: "agent5.unknown_failure",
  audit_consistency: "agent5.unknown_failure",
  era_time_style: "agent5.time_style_violation",
  time_conflict: "agent5.unknown_failure",
  culprit_evidence: "by_message",
  deterministic_contract: "by_message",
  coverage: "by_message",
};

export const classifyAgent5Failure = (message: string, gate?: Agent5Gate): string => {
  const label = gate ? AGENT5_GATE_LABEL[gate] : undefined;
  return label && label !== "by_message" ? label : classifyAgent5FailureMessage(message);
};
