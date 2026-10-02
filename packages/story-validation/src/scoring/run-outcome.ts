/**
 * SCO-05 — the run's outcome, derived once: release-gate status, run outcome (ADR-0006), its reason, and
 * the display status. Moved verbatim out of ScoreAggregator.generateReport so it is a pure function of the
 * phases and diagnostics (run-outcome-matrix.test.ts pins it over 36 input combinations).
 */
import type { GenerationDiagnostic, GenerationReport, PhaseReport } from './types.js';

/** Infrastructure failures (DNS / connectivity) as they appear in failure reasons, errors and diagnostics. */
export const INFRA_SIGNAL_PATTERN =
  /(\[infra[_\-\s]?precheck\]|infra[_\-\s]?failure|enotfound|eai_again|dns\s+resolution\s+failed|azure\s+endpoint\s+dns|etimedout|econnreset|socket\s+hang\s+up)/i;

export function deriveRunOutcome(phases: PhaseReport[], diagnostics: GenerationDiagnostic[]) {
    // Determine if all phases passed threshold. This is not the final run status,
    // because release-gate hard stops can still force failed/aborted outcomes.
    const phaseThresholdPassed = phases.every((p) => p.passed);

    const releaseGateDiagnostic = diagnostics.find(
      (d) => d.diagnostic_type === 'release_gate_summary'
    );
    const releaseGateDetails =
      (releaseGateDiagnostic?.details as Record<string, unknown> | undefined) ?? {};
    const releaseGateStatusRaw = releaseGateDetails['validation_status'];
    const releaseGateHardStopCount = Number(
      releaseGateDetails['release_gate_hard_stop_count'] ?? 0
    );
    const releaseGateWarningCount = Number(
      releaseGateDetails['release_gate_warning_count'] ?? 0
    );

    const inferredDeterministicHardGateFailure = phases.some((phase) => {
      const failureReason = String(phase.score.failure_reason ?? '').toLowerCase();
      const phaseErrors = Array.isArray(phase.errors)
        ? phase.errors.join(' ').toLowerCase()
        : '';
      return (
        phase.passed === false &&
        (/gate failed|hard gate|hard-stop|hard stop/.test(failureReason) ||
          /gate failed|hard gate|hard-stop|hard stop/.test(phaseErrors))
      );
    });

      const inferredInfraFailure = phases.some((phase) => {
      const failureReason = String(phase.score.failure_reason ?? '');
      const phaseErrors = Array.isArray(phase.errors)
        ? phase.errors.join(' ')
        : '';
      return INFRA_SIGNAL_PATTERN.test(failureReason) || INFRA_SIGNAL_PATTERN.test(phaseErrors);
    }) || diagnostics.some((diagnostic) => {
      const payload = [
        diagnostic.key,
        diagnostic.diagnostic_type,
        JSON.stringify(diagnostic.details ?? {}),
      ].join(' ');
      return INFRA_SIGNAL_PATTERN.test(payload);
    });

    const effectiveReleaseGateHardStopCount = Math.max(
      releaseGateHardStopCount,
      inferredDeterministicHardGateFailure ? 1 : 0,
    );

    const effectiveReleaseGateStatusRaw =
      releaseGateStatusRaw === 'passed' || releaseGateStatusRaw === 'failed'
        ? releaseGateStatusRaw
        : inferredDeterministicHardGateFailure
          ? 'failed'
          : releaseGateStatusRaw;
    // A hard stop ALWAYS fails the gate. `validation_status` is the story-validation pipeline's
    // verdict, not the gate's — run a3c2973f validated clean (0 issues) yet hard-stopped on NSD
    // clue visibility, and trusting the raw field verbatim produced the contradictory surface
    // `release_gate_outcome: { status: "passed", hard_stop_count: 1 }` on an aborted run.
    // Ledger P0.2 (run f90e5f09): warnings WITHOUT a hard stop are a SHIPPED needs-review gate
    // ('warning'), not 'failed' — the story exists and was scored; run_outcome stays phase-driven.
    const releaseGateStatus: 'passed' | 'warning' | 'failed' | 'unknown' =
      effectiveReleaseGateHardStopCount > 0
        ? 'failed'
        : effectiveReleaseGateStatusRaw === 'passed' || effectiveReleaseGateStatusRaw === 'failed'
          ? effectiveReleaseGateStatusRaw
          : releaseGateWarningCount > 0
            ? 'warning'
            : diagnostics.some((d) => d.diagnostic_type === 'release_gate_summary')
              ? 'passed'
              : 'unknown';

    // A_65b Ph1.3 (reliability plan) — run_outcome derives from the P0.2 definition: the release
    // gate ∈ {passed, warning} means the story SHIPPED ⇒ 'passed'. The old phase-threshold branch
    // stamped 'failed' on 21 shipped runs (the M1v2-2 artifact) and every corpus scan had to know
    // that folklore to read outcomes correctly. Phase thresholds are demoted to their own field
    // (`phase_thresholds_met`) — an advisory quality signal, never a run-failure signal. The
    // unknown-gate fallback stays phase-driven (no gate evidence → the old conservative read).
    const runOutcome: GenerationReport['run_outcome'] =
      inferredInfraFailure
        ? 'infra_failure'
        : effectiveReleaseGateHardStopCount > 0
        ? 'aborted'
        : releaseGateStatus === 'failed'
          ? 'failed'
        : releaseGateStatus === 'passed' || releaseGateStatus === 'warning'
          ? 'passed'
        : phaseThresholdPassed
          ? 'passed'
          : 'failed';

    const runOutcomeReason =
      runOutcome === 'infra_failure'
        ? 'Infrastructure failure (DNS/connectivity)'
        : runOutcome === 'aborted'
        ? inferredDeterministicHardGateFailure
          ? 'Deterministic hard gate failure'
          : 'Release gate hard-stop'
        : runOutcome === 'failed' && releaseGateStatus === 'failed'
          ? 'Release gate failed'
        : runOutcome === 'failed'
          ? 'One or more phases failed threshold'
        // A_71 — say so when 'passed' came from the phase-threshold fallback rather than from a
        // scored gate. `unknown` means no gate evidence was recorded at all, so this run is NOT
        // shipped by the P0.2 definition even though the outcome reads 'passed'; leaving the
        // reason blank is what made the two readings look like a contradiction rather than a
        // documented fallback (A_70 §4).
        : runOutcome === 'passed' && releaseGateStatus === 'unknown'
          ? 'Phase thresholds met; no release-gate evidence recorded (ship status unconfirmed)'
          : undefined;

    const normalizedDisplayStatus =
      runOutcome === 'aborted' || runOutcome === 'infra_failure'
        ? runOutcome
        : effectiveReleaseGateHardStopCount > 0 || releaseGateStatus === 'failed' && releaseGateWarningCount === 0
          ? 'failed'
          : releaseGateWarningCount > 0
            ? 'warning'
            : runOutcome;

  return {
    phaseThresholdPassed, releaseGateDetails, releaseGateWarningCount, inferredDeterministicHardGateFailure,
    effectiveReleaseGateHardStopCount, releaseGateStatus, runOutcome, runOutcomeReason, normalizedDisplayStatus,
  };
}
