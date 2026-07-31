import { describe, expect, it } from 'vitest';
import { validateGenerationReportInvariants } from '../scoring/report-invariants.js';

/**
 * A_71 — the report-finalization defect.
 *
 * `FileReportRepository.save()` asserts these invariants, so a violation means the final report is
 * never written and the misleading `in_progress` partial survives as the only record of the run.
 *
 * MEASURED on the corpus: 7 of 9 reports on disk were stranded partials reading
 * `run_outcome: passed, overall_score: 96, phases: 13/13` for runs that scored 66–74 with chapters
 * failing validation. The two that finalized are exactly the two with `phases_failed: 0`.
 *
 * Root cause: `failed_phase_signal_cannot_have_passed_outcome` predates A_65b Ph1.3, which
 * redefined `run_outcome` to derive from the RELEASE GATE (shipped ⇒ 'passed') and moved the
 * phase-threshold verdict to `phase_thresholds_met`. "Shipped, but a phase missed its threshold"
 * became a designed state that this invariant still rejected — and Cast Design misses its
 * threshold on every run (A_70 §6), so it fired on essentially every shipped run.
 */

const baseReport = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  project_id: 'proj-a71',
  run_id: 'run-a71',
  generated_at: new Date('2026-07-31T00:00:00Z').toISOString(),
  total_duration_ms: 1,
  total_cost: 0,
  overall_score: 74,
  overall_grade: 'C',
  passed: true,
  run_outcome: 'passed',
  phases: [
    { agent: 'agent2_cast', phase_name: 'Cast Design', passed: false },
    { agent: 'agent9_prose', phase_name: 'Prose Generation', passed: true },
  ],
  diagnostics: [
    { key: 'agent9_prose_post_generation_summary', agent: 'agent9_prose', details: {} },
  ],
  summary: {
    phases_passed: 1,
    phases_failed: 1,
    total_phases: 2,
    pass_rate: 50,
    weakest_phase: 'agent2-cast',
    strongest_phase: 'agent9-prose',
    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
    total_cost: 0,
  },
  threshold_config: { mode: 'standard' },
  ...overrides,
});

describe('A_71 — a shipped run with a failing phase can finalize', () => {
  it('does NOT flag a shipped run whose phase_thresholds_met records the failure honestly', () => {
    const violations = validateGenerationReportInvariants(
      baseReport({ phase_thresholds_met: false })
    );

    // This is the exact shape that could not be saved before: gate shipped ⇒ run_outcome passed,
    // Cast Design below threshold, and phase_thresholds_met=false saying so.
    expect(violations).toEqual([]);
  });

  it('DOES flag the genuine contradiction: thresholds "all met" alongside a failed phase', () => {
    const violations = validateGenerationReportInvariants(
      baseReport({ phase_thresholds_met: true })
    );

    expect(violations.map((v) => v.code)).toContain(
      'phase_thresholds_met_contradicts_failed_phase_signal'
    );
  });

  it('keeps the pre-Ph1.3 conservative reading when phase_thresholds_met is absent', () => {
    const violations = validateGenerationReportInvariants(baseReport());

    expect(violations.map((v) => v.code)).toContain(
      'failed_phase_signal_cannot_have_passed_outcome'
    );
  });
});

describe('A_71 — in_progress partials', () => {
  it('accepts an in_progress snapshot that names itself, so a live run always has an artifact', () => {
    const violations = validateGenerationReportInvariants(
      baseReport({
        in_progress: true,
        incomplete: true,
        passed: false,
        run_outcome: 'in_progress',
        phase_thresholds_met: false,
      })
    );

    expect(violations).toEqual([]);
  });

  it('exempts an in_progress snapshot from the E1 post_generation_summary requirement', () => {
    // A partial written mid-prose legitimately has the phase registered before its summary
    // diagnostic exists. Throwing here left the run with NO artifact at all.
    const violations = validateGenerationReportInvariants(
      baseReport({
        in_progress: true,
        passed: false,
        run_outcome: 'in_progress',
        diagnostics: [],
      })
    );

    expect(violations.map((v) => v.code)).not.toContain('missing_post_generation_summary');
  });

  it('still requires post_generation_summary on a FINAL report', () => {
    const violations = validateGenerationReportInvariants(
      baseReport({ phase_thresholds_met: false, diagnostics: [] })
    );

    expect(violations.map((v) => v.code)).toContain('missing_post_generation_summary');
  });

  it('does not let an in_progress snapshot claim a passing outcome', () => {
    // The write-side stamps passed=false + run_outcome='in_progress' together; if either drifts
    // back to a pass claim the outcome checks must catch it.
    const violations = validateGenerationReportInvariants(
      baseReport({ in_progress: true, run_outcome: 'passed', passed: true })
    );

    expect(violations.length).toBeGreaterThan(0);
  });
});
