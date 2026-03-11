import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  validateGenerationReportInvariants,
  assertGenerationReportInvariants,
} from '../scoring/report-invariants.js';

describe('GenerationReport invariants', () => {
  it('flags template-linter abort contradiction from frozen fixture', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const fixturePath = join(
      here,
      'fixtures',
      'report-template-linter-contradiction.json'
    );
    const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'));

    const violations = validateGenerationReportInvariants(fixture);

    expect(violations.map(v => v.code)).toContain(
      'template_linter_abort_without_failed_checks'
    );
  });

  it('accepts a coherent aborted report with template-linter failures', () => {
    const report = {
      project_id: 'proj-1',
      run_id: 'run-1',
      generated_at: new Date('2026-03-09T00:00:00Z').toISOString(),
      total_duration_ms: 1,
      total_cost: 0,
      overall_score: 65,
      overall_grade: 'D',
      passed: false,
      phases: [],
      diagnostics: [
        {
          key: 'agent9_prose_post_generation_summary',
          details: {
            template_linter_failed_checks: 2,
          },
        },
      ],
      summary: {
        phases_passed: 0,
        phases_failed: 1,
        total_phases: 1,
        pass_rate: 0,
        weakest_phase: 'agent9-prose',
        strongest_phase: 'agent9-prose',
        retry_stats: {
          total_retries: 0,
          phases_retried: 0,
          retry_rate: '0.00',
          retried_phases: [],
        },
        total_cost: 0,
      },
      threshold_config: { mode: 'standard' },
      run_outcome: 'aborted',
      run_outcome_reason: 'Template linter blocked batch acceptance.',
    };

    const violations = validateGenerationReportInvariants(report);
    expect(violations).toEqual([]);
    expect(() => assertGenerationReportInvariants(report)).not.toThrow();
  });

  it('flags NSD traces that reveal clues without matching evidence anchors', () => {
    const report = {
      project_id: 'proj-1',
      run_id: 'run-1',
      generated_at: new Date('2026-03-09T00:00:00Z').toISOString(),
      total_duration_ms: 1,
      total_cost: 0,
      overall_score: 65,
      overall_grade: 'D',
      passed: false,
      phases: [],
      diagnostics: [
        {
          key: 'agent9_prose_post_generation_summary',
          details: {
            nsd_transfer_trace: [
              {
                newly_revealed_clue_ids: ['clue_1'],
                clue_evidence_anchors: [],
              },
            ],
          },
        },
      ],
      summary: {
        phases_passed: 0,
        phases_failed: 1,
        total_phases: 1,
        pass_rate: 0,
        weakest_phase: 'agent9-prose',
        strongest_phase: 'agent9-prose',
        retry_stats: {
          total_retries: 0,
          phases_retried: 0,
          retry_rate: '0.00',
          retried_phases: [],
        },
        total_cost: 0,
      },
      threshold_config: { mode: 'standard' },
      run_outcome: 'failed',
    };

    const violations = validateGenerationReportInvariants(report);
    expect(violations.map(v => v.code)).toContain(
      'nsd_revealed_clues_missing_evidence_anchors'
    );
  });

  it('accepts NSD traces when every revealed clue has a matching anchor', () => {
    const report = {
      project_id: 'proj-1',
      run_id: 'run-1',
      generated_at: new Date('2026-03-09T00:00:00Z').toISOString(),
      total_duration_ms: 1,
      total_cost: 0,
      overall_score: 65,
      overall_grade: 'D',
      passed: false,
      phases: [],
      diagnostics: [
        {
          key: 'agent9_prose_post_generation_summary',
          details: {
            nsd_transfer_trace: [
              {
                newly_revealed_clue_ids: ['clue_1', 'clue_2'],
                clue_evidence_anchors: [
                  { clue_id: 'clue_1' },
                  { clue_id: 'clue_2' },
                ],
              },
            ],
          },
        },
      ],
      summary: {
        phases_passed: 0,
        phases_failed: 1,
        total_phases: 1,
        pass_rate: 0,
        weakest_phase: 'agent9-prose',
        strongest_phase: 'agent9-prose',
        retry_stats: {
          total_retries: 0,
          phases_retried: 0,
          retry_rate: '0.00',
          retried_phases: [],
        },
        total_cost: 0,
      },
      threshold_config: { mode: 'standard' },
      run_outcome: 'failed',
    };

    const violations = validateGenerationReportInvariants(report);
    expect(violations.map(v => v.code)).not.toContain(
      'nsd_revealed_clues_missing_evidence_anchors'
    );
  });

  it('flags passed outcomes when phase failure signals are present', () => {
    const report = {
      project_id: 'proj-1',
      run_id: 'run-1',
      generated_at: new Date('2026-03-09T00:00:00Z').toISOString(),
      total_duration_ms: 1,
      total_cost: 0,
      overall_score: 92,
      overall_grade: 'A',
      passed: true,
      phases: [
        {
          agent: 'agent9_prose',
          phase_name: 'Prose Generation',
          passed: false,
        },
      ],
      summary: {
        phases_passed: 0,
        phases_failed: 1,
        total_phases: 1,
        pass_rate: 0,
        weakest_phase: 'agent9-prose',
        strongest_phase: 'agent9-prose',
        retry_stats: {
          total_retries: 0,
          phases_retried: 0,
          retry_rate: '0.00',
          retried_phases: [],
        },
        total_cost: 0,
      },
      threshold_config: { mode: 'standard' },
      run_outcome: 'passed',
    };

    const violations = validateGenerationReportInvariants(report);
    expect(violations.map(v => v.code)).toContain(
      'failed_phase_signal_cannot_have_passed_outcome'
    );
  });

  it('accepts passed outcomes when no phase failure signals exist', () => {
    const report = {
      project_id: 'proj-1',
      run_id: 'run-1',
      generated_at: new Date('2026-03-09T00:00:00Z').toISOString(),
      total_duration_ms: 1,
      total_cost: 0,
      overall_score: 92,
      overall_grade: 'A',
      passed: true,
      phases: [
        {
          agent: 'agent9_prose',
          phase_name: 'Prose Generation',
          passed: true,
        },
      ],
      summary: {
        phases_passed: 1,
        phases_failed: 0,
        total_phases: 1,
        pass_rate: 100,
        weakest_phase: 'agent9-prose',
        strongest_phase: 'agent9-prose',
        retry_stats: {
          total_retries: 0,
          phases_retried: 0,
          retry_rate: '0.00',
          retried_phases: [],
        },
        total_cost: 0,
      },
      threshold_config: { mode: 'standard' },
      run_outcome: 'passed',
    };

    const violations = validateGenerationReportInvariants(report);
    expect(violations.map(v => v.code)).not.toContain(
      'failed_phase_signal_cannot_have_passed_outcome'
    );
    expect(() => assertGenerationReportInvariants(report)).not.toThrow();
  });
});
