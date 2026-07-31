import type { GenerationReport, RunOutcome } from './types.js';

export interface ReportInvariantViolation {
  code: string;
  message: string;
}

const TEMPLATE_LINTER_ABORT_PATTERN = /template\s*linter/i;

function toNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function getCanonicalOutcome(report: Record<string, unknown>): RunOutcome | undefined {
  const explicit = report.run_outcome;
  if (
    explicit === 'passed' ||
    explicit === 'failed' ||
    explicit === 'aborted' ||
    explicit === 'infra_failure' ||
    explicit === 'in_progress'
  ) {
    return explicit;
  }

  if (report.aborted === true) {
    return 'aborted';
  }

  if (report.passed === true) {
    return 'passed';
  }

  if (report.passed === false) {
    return 'failed';
  }

  return undefined;
}

function getAbortReason(report: Record<string, unknown>): string {
  const runOutcomeReason = report.run_outcome_reason;
  if (typeof runOutcomeReason === 'string' && runOutcomeReason.trim().length > 0) {
    return runOutcomeReason;
  }

  const legacyAbortReason = report.abort_reason;
  if (typeof legacyAbortReason === 'string' && legacyAbortReason.trim().length > 0) {
    return legacyAbortReason;
  }

  return '';
}

function getTemplateLinterFailedCheckCount(report: Record<string, unknown>): number {
  const diagnostics = Array.isArray(report.diagnostics) ? report.diagnostics : [];

  return diagnostics.reduce((total, entry) => {
    if (!entry || typeof entry !== 'object') {
      return total;
    }

    const details = (entry as Record<string, unknown>).details;
    if (!details || typeof details !== 'object') {
      return total;
    }

    return total + toNumber((details as Record<string, unknown>).template_linter_failed_checks);
  }, 0);
}

function hasMissingNsdEvidenceAnchors(report: Record<string, unknown>): boolean {
  const diagnostics = Array.isArray(report.diagnostics) ? report.diagnostics : [];

  for (const entry of diagnostics) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }

    const details = (entry as Record<string, unknown>).details;
    if (!details || typeof details !== 'object') {
      continue;
    }

    const trace = (details as Record<string, unknown>).nsd_transfer_trace;
    if (!Array.isArray(trace)) {
      continue;
    }

    for (const step of trace) {
      if (!step || typeof step !== 'object') {
        continue;
      }

      const stepRecord = step as Record<string, unknown>;
      const revealed = Array.isArray(stepRecord.newly_revealed_clue_ids)
        ? stepRecord.newly_revealed_clue_ids.filter((id): id is string => typeof id === 'string' && id.length > 0)
        : [];

      if (revealed.length === 0) {
        continue;
      }

      const anchors = Array.isArray(stepRecord.clue_evidence_anchors)
        ? stepRecord.clue_evidence_anchors
        : [];
      const anchoredClues = new Set(
        anchors
          .filter((anchor): anchor is Record<string, unknown> => Boolean(anchor) && typeof anchor === 'object')
          .map((anchor) => anchor.clue_id)
          .filter((value): value is string => typeof value === 'string' && value.length > 0)
      );

      const hasMissing = revealed.some((clueId) => !anchoredClues.has(clueId));
      if (hasMissing) {
        return true;
      }
    }
  }

  return false;
}

function hasFailedPhaseSignals(report: Record<string, unknown>): boolean {
  const phases = Array.isArray(report.phases) ? report.phases : [];
  const hasFailedPhase = phases.some((phase) => {
    if (!phase || typeof phase !== 'object') {
      return false;
    }
    return (phase as Record<string, unknown>).passed === false;
  });

  if (hasFailedPhase) {
    return true;
  }

  const summary = report.summary;
  if (!summary || typeof summary !== 'object') {
    return false;
  }

  return toNumber((summary as Record<string, unknown>).phases_failed) > 0;
}

// E1: helpers for post_generation_summary presence check
function hasAgent9ProsePhaseEntry(report: Record<string, unknown>): boolean {
  const phases = Array.isArray(report.phases) ? report.phases : [];
  return phases.some((phase) => {
    if (!phase || typeof phase !== 'object') return false;
    return (phase as Record<string, unknown>).agent === 'agent9_prose';
  });
}

function hasAgent9ProsePostGenerationSummaryDiagnostic(report: Record<string, unknown>): boolean {
  const diagnostics = Array.isArray(report.diagnostics) ? report.diagnostics : [];
  return diagnostics.some((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    return (entry as Record<string, unknown>).key === 'agent9_prose_post_generation_summary';
  });
}

export function validateGenerationReportInvariants(
  report: GenerationReport | Record<string, unknown>
): ReportInvariantViolation[] {
  const candidate = report as Record<string, unknown>;
  const violations: ReportInvariantViolation[] = [];

  const outcome = getCanonicalOutcome(candidate);
  const passed = candidate.passed;
  const abortReason = getAbortReason(candidate);

  if (outcome === 'passed' && passed !== true) {
    violations.push({
      code: 'outcome_passed_requires_passed_true',
      message: 'run_outcome=passed requires passed=true.',
    });
  }

  if (outcome === 'failed' && passed === true) {
    violations.push({
      code: 'outcome_failed_requires_passed_false',
      message: 'run_outcome=failed requires passed=false.',
    });
  }

  if (outcome === 'aborted' && passed === true) {
    violations.push({
      code: 'aborted_run_cannot_pass',
      message: 'Aborted runs cannot have passed=true.',
    });
  }

  if (outcome === 'infra_failure' && passed === true) {
    violations.push({
      code: 'infra_failure_run_cannot_pass',
      message: 'Infrastructure-failure runs cannot have passed=true.',
    });
  }

  if (outcome === 'aborted' && abortReason.length === 0) {
    violations.push({
      code: 'aborted_run_requires_reason',
      message: 'Aborted runs must include run_outcome_reason (or legacy abort_reason).',
    });
  }

  if (outcome === 'infra_failure' && abortReason.length === 0) {
    violations.push({
      code: 'infra_failure_run_requires_reason',
      message: 'run_outcome=infra_failure requires run_outcome_reason (or legacy abort_reason).',
    });
  }

  if (TEMPLATE_LINTER_ABORT_PATTERN.test(abortReason)) {
    const linterFailedChecks = getTemplateLinterFailedCheckCount(candidate);
    if (linterFailedChecks <= 0) {
      violations.push({
        code: 'template_linter_abort_without_failed_checks',
        message:
          'Abort reason references template linter but diagnostics report zero template_linter_failed_checks.',
      });
    }
  }

  const explicitOutcome = candidate.run_outcome;
  const hasExplicitFailedOutcome = explicitOutcome === 'failed';
  if (hasMissingNsdEvidenceAnchors(candidate) && (outcome === 'passed' || (outcome === 'failed' && !hasExplicitFailedOutcome))) {
    violations.push({
      code: 'nsd_revealed_clues_missing_evidence_anchors',
      message:
        'NSD transfer trace includes newly revealed clue IDs without matching clue evidence anchors.',
    });
  }

  const releaseGateOutcome = candidate.release_gate_outcome;
  if (releaseGateOutcome && typeof releaseGateOutcome === 'object') {
    const status = (releaseGateOutcome as Record<string, unknown>).status;
    if (status === 'failed' && outcome === 'passed') {
      violations.push({
        code: 'release_gate_failed_cannot_have_passed_outcome',
        message: 'release_gate_outcome.status=failed is incompatible with run_outcome=passed.',
      });
    }
  }

  // A_71 §1 — this invariant predates A_65b Ph1.3 and, until now, directly contradicted it.
  //
  // Ph1.3 redefined `run_outcome`: it derives from the RELEASE GATE (gate ∈ {passed, warning} =
  // the story SHIPPED ⇒ 'passed') and the phase-threshold verdict was demoted to its own field,
  // `phase_thresholds_met`. So "shipped, but some phase missed its threshold" became a legitimate,
  // designed state — and this check still called it a violation. `save()` asserts invariants, so
  // the throw meant the finalized report was NEVER WRITTEN and the misleading `in_progress`
  // partial survived as the only record of the run.
  //
  // MEASURED (A_71): 7 of 9 reports on disk are stranded partials, and Cast Design fails its
  // threshold on every run (A_70 §6, quality ≈ 49) — so any shipped run tripped this. The two
  // reports that finalized are exactly the two with `phases_failed: 0`.
  //
  // The genuine contradiction is narrower: claiming every threshold was met while a phase reports
  // failure. That is what we assert now. A report with no `phase_thresholds_met` field is
  // pre-Ph1.3 and keeps the old conservative reading.
  if (outcome === 'passed' && hasFailedPhaseSignals(candidate)) {
    const thresholdsMet = candidate.phase_thresholds_met;
    if (thresholdsMet === true) {
      violations.push({
        code: 'phase_thresholds_met_contradicts_failed_phase_signal',
        message:
          'phase_thresholds_met=true is incompatible with failed phase signals (phases[].passed=false or summary.phases_failed>0).',
      });
    } else if (thresholdsMet === undefined) {
      violations.push({
        code: 'failed_phase_signal_cannot_have_passed_outcome',
        message:
          'Failed phase signals (phases[].passed=false or summary.phases_failed>0) are incompatible with run_outcome=passed.',
      });
    }
  }

  // E1: agent9_prose phase present → post_generation_summary diagnostic required.
  // A_71 — exempt live `in_progress` snapshots: a partial written mid-prose legitimately has the
  // phase registered before its summary diagnostic exists, and a throw here would leave the run
  // with NO artifact at all (savePartialReport swallows the error). E1 still binds every final
  // report, which is the record it was written to protect.
  if (
    candidate.in_progress !== true &&
    hasAgent9ProsePhaseEntry(candidate) &&
    !hasAgent9ProsePostGenerationSummaryDiagnostic(candidate)
  ) {
    violations.push({
      code: 'missing_post_generation_summary',
      message:
        'agent9_prose phase is present but agent9_prose_post_generation_summary diagnostic is missing.',
    });
  }

  return violations;
}

export function assertGenerationReportInvariants(
  report: GenerationReport | Record<string, unknown>
): void {
  const violations = validateGenerationReportInvariants(report);
  if (violations.length === 0) {
    return;
  }

  const detail = violations.map(v => `${v.code}: ${v.message}`).join(' | ');
  throw new Error(`GenerationReport invariant violation(s): ${detail}`);
}