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
  if (explicit === 'passed' || explicit === 'failed' || explicit === 'aborted') {
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

  if (outcome === 'aborted' && passed === true) {
    violations.push({
      code: 'aborted_run_cannot_pass',
      message: 'Aborted runs cannot have passed=true.',
    });
  }

  if (outcome === 'aborted' && abortReason.length === 0) {
    violations.push({
      code: 'aborted_run_requires_reason',
      message: 'Aborted runs must include run_outcome_reason (or legacy abort_reason).',
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

  if (hasMissingNsdEvidenceAnchors(candidate)) {
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

  if (outcome === 'passed' && hasFailedPhaseSignals(candidate)) {
    violations.push({
      code: 'failed_phase_signal_cannot_have_passed_outcome',
      message:
        'Failed phase signals (phases[].passed=false or summary.phases_failed>0) are incompatible with run_outcome=passed.',
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