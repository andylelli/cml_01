/**
 * Retry-gate guard (ANALYSIS_50 hardening).
 *
 * Each A_50 lever adds an independent LLM regeneration loop when set to `enforce`. The acceptance
 * discipline — "one retry-bearing gate per replay" so a moved rubric category is attributable, and
 * so cost doesn't compound — was previously documentation-only. This makes it enforceable: at
 * pipeline start we count the active enforce retry gates, surface a worst-case extra-call budget,
 * and refuse to start when more than one is on (unless ALLOW_MULTIPLE_RETRY_GATES is set).
 *
 * Pure (reads an injected env map) and unit-tested; the orchestrator calls evaluateRetryGateGuard()
 * once before the pipeline. Default (no enforce flags) ⇒ empty result ⇒ byte-identical behaviour.
 */

type EnvMap = Record<string, string | undefined>;

const isOn = (v: string | undefined): boolean => /^(1|true|yes|on)$/i.test(String(v ?? "").trim());
const isEnforce = (v: string | undefined): boolean =>
  String(v ?? "").trim().toLowerCase() === "enforce";
const capInt = (v: string | undefined, dflt: number, max: number): number =>
  Math.min(max, Math.max(0, Math.trunc(Number(v ?? dflt)) || 0));

export interface RetryGateInfo {
  flag: string;
  label: string;
  /** judge/probe calls + regenerations at the configured cap (worst case). */
  worstCaseExtraCalls: number;
}

/** Enumerate the retry-bearing gates currently set to enforce/active in `env`. */
export const assessRetryGates = (env: EnvMap): { active: RetryGateInfo[]; worstCaseExtraCalls: number } => {
  const active: RetryGateInfo[] = [];

  if (isEnforce(env.AGENT2B_VOICE_CHECK)) {
    active.push({
      flag: "AGENT2B_VOICE_CHECK",
      label: "Agent 2b voice gate",
      worstCaseExtraCalls: capInt(env.AGENT2B_VOICE_MAX_RETRIES, 1, 3),
    });
  }
  if (isEnforce(env.AGENT3B_PLAUSIBILITY_JUDGE)) {
    const r = capInt(env.AGENT3B_PLAUSIBILITY_MAX_RETRIES, 1, 3);
    // 1 baseline judge call + (regenerate + re-judge) per retry.
    active.push({ flag: "AGENT3B_PLAUSIBILITY_JUDGE", label: "Agent 3b plausibility judge", worstCaseExtraCalls: 1 + r * 2 });
  }
  if (isEnforce(env.AGENT2C_SCENE_GATE)) {
    active.push({
      flag: "AGENT2C_SCENE_GATE",
      label: "Agent 2c scene gate",
      worstCaseExtraCalls: capInt(env.AGENT2C_SCENE_GATE_MAX_RETRIES, 1, 2),
    });
  }
  if (isEnforce(env.AGENT6_REVEAL_GATE)) {
    // 1 early+mid blind-reader probe; may also trigger the legacy Agent 6 remediation loop.
    active.push({ flag: "AGENT6_REVEAL_GATE", label: "Agent 6 reveal gate", worstCaseExtraCalls: 1 });
  }
  if (isOn(env.NOVELTY_CROSS_RUN) && isOn(env.NOVELTY_HARD_FAIL)) {
    // Novelty audit fires and can hard-fail → CML regeneration + re-audit.
    active.push({ flag: "NOVELTY_HARD_FAIL", label: "Agent 8 novelty hard-fail", worstCaseExtraCalls: 2 });
  }

  return { active, worstCaseExtraCalls: active.reduce((s, g) => s + g.worstCaseExtraCalls, 0) };
};

export interface RetryGateGuardResult {
  warnings: string[];
  /** When set, the orchestrator must throw before starting the pipeline. */
  fatal?: string;
}

/**
 * Telemetry + safety: warn with the active gates and their worst-case extra-call budget, and
 * produce a fatal message when >1 retry-bearing gate is enforced without an explicit override.
 */
export const evaluateRetryGateGuard = (env: EnvMap = process.env as EnvMap): RetryGateGuardResult => {
  const { active, worstCaseExtraCalls } = assessRetryGates(env);
  const warnings: string[] = [];
  if (active.length === 0) return { warnings };

  warnings.push(
    `[retry-gate-guard] ${active.length} retry-bearing gate(s) active: ${active.map((g) => g.flag).join(", ")}; ` +
      `worst-case ~${worstCaseExtraCalls} extra LLM call(s).`,
  );

  if (active.length > 1 && !isOn(env.ALLOW_MULTIPLE_RETRY_GATES)) {
    return {
      warnings,
      fatal:
        `Refusing to start: ${active.length} retry-bearing gates are set to enforce ` +
        `(${active.map((g) => g.flag).join(", ")}). The acceptance discipline is exactly one retry gate per run ` +
        `(so a moved rubric category is attributable and cost is bounded). Enable one, or set ` +
        `ALLOW_MULTIPLE_RETRY_GATES=1 to override deliberately.`,
    };
  }
  return { warnings };
};
