/**
 * ANALYSIS_109 — the case-logic report, read at CALL time (ADR-0004). Default OFF.
 * ON: one `[A_109 case logic]` warning per check at the Agent 3 boundary. Telemetry, never a gate.
 */
export const isCaseLogicEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3_CASE_LOGIC ?? "").trim());
