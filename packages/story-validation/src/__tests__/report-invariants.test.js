import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { validateGenerationReportInvariants, assertGenerationReportInvariants, } from '../scoring/report-invariants.js';
describe('GenerationReport invariants', () => {
    it('flags template-linter abort contradiction from frozen fixture', () => {
        const here = dirname(fileURLToPath(import.meta.url));
        const fixturePath = join(here, 'fixtures', 'report-template-linter-contradiction.json');
        const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'));
        const violations = validateGenerationReportInvariants(fixture);
        expect(violations.map(v => v.code)).toContain('template_linter_abort_without_failed_checks');
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
        expect(violations.map(v => v.code)).toContain('nsd_revealed_clues_missing_evidence_anchors');
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
        expect(violations.map(v => v.code)).not.toContain('nsd_revealed_clues_missing_evidence_anchors');
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
        expect(violations.map(v => v.code)).toContain('failed_phase_signal_cannot_have_passed_outcome');
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
            diagnostics: [
                { key: 'agent9_prose_post_generation_summary', agent: 'agent9_prose', details: {} },
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
        expect(violations.map(v => v.code)).not.toContain('failed_phase_signal_cannot_have_passed_outcome');
        expect(() => assertGenerationReportInvariants(report)).not.toThrow();
    });
    // ── E1: missing_post_generation_summary ─────────────────────────────────────
    describe('E1 – missing_post_generation_summary', () => {
        it('flags when agent9_prose phase exists but post_generation_summary diagnostic is absent', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 80,
                overall_grade: 'B',
                passed: true,
                run_outcome: 'passed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: true }],
                diagnostics: [], // summary diagnostic intentionally absent
                summary: {
                    phases_passed: 1, phases_failed: 0, total_phases: 1, pass_rate: 100,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).toContain('missing_post_generation_summary');
        });
        it('accepts when agent9_prose phase exists and post_generation_summary diagnostic is present', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 80,
                overall_grade: 'B',
                passed: true,
                run_outcome: 'passed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: true }],
                diagnostics: [
                    { key: 'agent9_prose_post_generation_summary', agent: 'agent9_prose', details: {} },
                ],
                summary: {
                    phases_passed: 1, phases_failed: 0, total_phases: 1, pass_rate: 100,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).not.toContain('missing_post_generation_summary');
        });
        it('does not flag when no agent9_prose phase exists (no prose run)', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 95,
                overall_grade: 'A',
                passed: true,
                run_outcome: 'passed',
                phases: [{ agent: 'agent2_cast', phase_name: 'Cast Design', passed: true }],
                diagnostics: [], // no post_generation_summary needed when no prose phase
                summary: {
                    phases_passed: 1, phases_failed: 0, total_phases: 1, pass_rate: 100,
                    weakest_phase: 'agent2_cast', strongest_phase: 'agent2_cast',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).not.toContain('missing_post_generation_summary');
        });
        it('flags even when diagnostics array is undefined', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 80,
                overall_grade: 'B',
                passed: false,
                run_outcome: 'failed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: false }],
                // diagnostics field intentionally missing
                summary: {
                    phases_passed: 0, phases_failed: 1, total_phases: 1, pass_rate: 0,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).toContain('missing_post_generation_summary');
        });
        it('assertGenerationReportInvariants throws when post_generation_summary is missing', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 70,
                overall_grade: 'C',
                passed: false,
                run_outcome: 'failed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: false }],
                diagnostics: [],
                summary: {
                    phases_passed: 0, phases_failed: 1, total_phases: 1, pass_rate: 0,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            expect(() => assertGenerationReportInvariants(report)).toThrow('missing_post_generation_summary');
        });
        it('flags legacy progress metrics when canonical progress fields are missing', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 70,
                overall_grade: 'C',
                passed: false,
                run_outcome: 'failed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: false }],
                diagnostics: [
                    {
                        key: 'agent9_prose_post_generation_summary',
                        agent: 'agent9_prose',
                        phase_name: 'Prose Generation',
                        diagnostic_type: 'post_generation_summary',
                        details: {
                            expected_chapter_count: 20,
                            chapters_generated: 14,
                        },
                    },
                ],
                summary: {
                    phases_passed: 0, phases_failed: 1, total_phases: 1, pass_rate: 0,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).toContain('missing_canonical_progress_metrics');
        });
        it('flags legacy underflow metrics when canonical underflow fields are missing', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 70,
                overall_grade: 'C',
                passed: false,
                run_outcome: 'failed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: false }],
                diagnostics: [
                    {
                        key: 'agent9_prose_post_generation_summary',
                        agent: 'agent9_prose',
                        phase_name: 'Prose Generation',
                        diagnostic_type: 'post_generation_summary',
                        details: {
                            expected_chapter_count: 20,
                            chapters_generated: 14,
                            expected_chapters_total: 20,
                            chapters_generated_committed: 14,
                            chapters_failed_uncommitted: 6,
                            story_words_total: 12123,
                            chapter_words_hard_floor: 704,
                            word_underflow_hard_floor_misses: 2,
                        },
                    },
                ],
                summary: {
                    phases_passed: 0, phases_failed: 1, total_phases: 1, pass_rate: 0,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).toContain('missing_canonical_underflow_metrics');
        });
        it('accepts legacy aliases when canonical progress and underflow fields are also present', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 80,
                overall_grade: 'B',
                passed: true,
                run_outcome: 'passed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: true }],
                diagnostics: [
                    {
                        key: 'agent9_prose_post_generation_summary',
                        agent: 'agent9_prose',
                        phase_name: 'Prose Generation',
                        diagnostic_type: 'post_generation_summary',
                        details: {
                            expected_chapter_count: 20,
                            chapters_generated: 20,
                            expected_chapters_total: 20,
                            chapters_generated_committed: 20,
                            chapters_failed_uncommitted: 0,
                            story_words_total: 20840,
                            chapter_words_hard_floor: 704,
                            word_underflow_hard_floor_misses: 0,
                            word_underflow_hard_floor_chapters: [],
                            chapter_words_hard_floor_miss_count: 0,
                            chapters_with_hard_floor_miss: [],
                        },
                    },
                ],
                summary: {
                    phases_passed: 1, phases_failed: 0, total_phases: 1, pass_rate: 100,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).not.toContain('missing_canonical_progress_metrics');
            expect(violations.map(v => v.code)).not.toContain('missing_canonical_underflow_metrics');
        });
        it('accepts canonical-only progress and underflow metrics without legacy aliases', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 80,
                overall_grade: 'B',
                passed: true,
                run_outcome: 'passed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: true }],
                diagnostics: [
                    {
                        key: 'agent9_prose_post_generation_summary',
                        agent: 'agent9_prose',
                        phase_name: 'Prose Generation',
                        diagnostic_type: 'post_generation_summary',
                        details: {
                            expected_chapters_total: 20,
                            chapters_generated_committed: 20,
                            chapters_failed_uncommitted: 0,
                            story_words_total: 20840,
                            chapter_words_hard_floor: 704,
                            chapter_words_hard_floor_miss_count: 0,
                            chapters_with_hard_floor_miss: [],
                        },
                    },
                ],
                summary: {
                    phases_passed: 1, phases_failed: 0, total_phases: 1, pass_rate: 100,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).not.toContain('missing_canonical_progress_metrics');
            expect(violations.map(v => v.code)).not.toContain('missing_canonical_underflow_metrics');
        });
        it('flags mismatched canonical and legacy progress aliases when both are present', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 70,
                overall_grade: 'C',
                passed: false,
                run_outcome: 'failed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: false }],
                diagnostics: [
                    {
                        key: 'agent9_prose_post_generation_summary',
                        agent: 'agent9_prose',
                        phase_name: 'Prose Generation',
                        diagnostic_type: 'post_generation_summary',
                        details: {
                            expected_chapters_total: 20,
                            chapters_generated_committed: 14,
                            chapters_failed_uncommitted: 6,
                            story_words_total: 12123,
                            chapter_words_hard_floor: 704,
                            expected_chapter_count: 21,
                            chapters_generated: 13,
                        },
                    },
                ],
                summary: {
                    phases_passed: 0, phases_failed: 1, total_phases: 1, pass_rate: 0,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).toContain('canonical_legacy_progress_metric_mismatch');
        });
        it('flags mismatched canonical and legacy underflow aliases when both are present', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 70,
                overall_grade: 'C',
                passed: false,
                run_outcome: 'failed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: false }],
                diagnostics: [
                    {
                        key: 'agent9_prose_post_generation_summary',
                        agent: 'agent9_prose',
                        phase_name: 'Prose Generation',
                        diagnostic_type: 'post_generation_summary',
                        details: {
                            expected_chapters_total: 20,
                            chapters_generated_committed: 14,
                            chapters_failed_uncommitted: 6,
                            story_words_total: 12123,
                            chapter_words_hard_floor: 704,
                            chapter_words_hard_floor_miss_count: 2,
                            chapters_with_hard_floor_miss: [3, 4],
                            word_underflow_hard_floor_misses: 1,
                            word_underflow_hard_floor_chapters: [3],
                        },
                    },
                ],
                summary: {
                    phases_passed: 0, phases_failed: 1, total_phases: 1, pass_rate: 0,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).toContain('canonical_legacy_underflow_metric_mismatch');
        });
        it('flags missing count_reconciliation when metrics_snapshot is present', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 80,
                overall_grade: 'B',
                passed: true,
                run_outcome: 'passed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: true }],
                diagnostics: [
                    {
                        key: 'agent9_prose_post_generation_summary',
                        agent: 'agent9_prose',
                        phase_name: 'Prose Generation',
                        diagnostic_type: 'post_generation_summary',
                        details: {
                            metrics_snapshot: 'final',
                            expected_chapters_total: 20,
                            chapters_generated_committed: 20,
                            chapters_failed_uncommitted: 0,
                            story_words_total: 20840,
                            chapter_words_hard_floor: 704,
                            chapter_words_hard_floor_miss_count: 0,
                            chapters_with_hard_floor_miss: [],
                        },
                    },
                ],
                summary: {
                    phases_passed: 1, phases_failed: 0, total_phases: 1, pass_rate: 100,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).toContain('missing_count_reconciliation');
        });
        it('flags malformed count_reconciliation payloads', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 80,
                overall_grade: 'B',
                passed: true,
                run_outcome: 'passed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: true }],
                diagnostics: [
                    {
                        key: 'agent9_prose_post_generation_summary',
                        agent: 'agent9_prose',
                        phase_name: 'Prose Generation',
                        diagnostic_type: 'post_generation_summary',
                        details: {
                            metrics_snapshot: 'final',
                            expected_chapters_total: 20,
                            chapters_generated_committed: 20,
                            chapters_failed_uncommitted: 0,
                            story_words_total: 20840,
                            chapter_words_hard_floor: 704,
                            chapter_words_hard_floor_miss_count: 0,
                            chapters_with_hard_floor_miss: [],
                            count_reconciliation: {
                                expected_chapters_total: 20,
                                chapters_generated_committed: 20,
                                chapters_failed_uncommitted: 0,
                                failed_uncommitted_chapter_ranges: [{ start: 5, end: 3 }],
                                chapter_word_buckets: {
                                    hard_floor_miss_count: -1,
                                },
                                run_state: 'done',
                            },
                        },
                    },
                ],
                summary: {
                    phases_passed: 1, phases_failed: 0, total_phases: 1, pass_rate: 100,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).toContain('malformed_count_reconciliation');
        });
        it('accepts valid count_reconciliation payloads', () => {
            const report = {
                project_id: 'proj-1',
                run_id: 'run-1',
                generated_at: new Date().toISOString(),
                total_duration_ms: 1,
                total_cost: 0,
                overall_score: 80,
                overall_grade: 'B',
                passed: true,
                run_outcome: 'passed',
                phases: [{ agent: 'agent9_prose', phase_name: 'Prose Generation', passed: true }],
                diagnostics: [
                    {
                        key: 'agent9_prose_post_generation_summary',
                        agent: 'agent9_prose',
                        phase_name: 'Prose Generation',
                        diagnostic_type: 'post_generation_summary',
                        details: {
                            metrics_snapshot: 'final',
                            expected_chapters_total: 20,
                            chapters_generated_committed: 20,
                            chapters_failed_uncommitted: 0,
                            story_words_total: 20840,
                            chapter_words_hard_floor: 704,
                            chapter_words_hard_floor_miss_count: 0,
                            chapters_with_hard_floor_miss: [],
                            count_reconciliation: {
                                expected_chapters_total: 20,
                                chapters_generated_committed: 20,
                                chapters_failed_uncommitted: 0,
                                failed_uncommitted_chapter_ranges: [],
                                chapter_word_buckets: {
                                    hard_floor_miss_count: 0,
                                    pass_count: 20,
                                },
                                run_state: 'complete',
                            },
                        },
                    },
                ],
                summary: {
                    phases_passed: 1, phases_failed: 0, total_phases: 1, pass_rate: 100,
                    weakest_phase: 'agent9_prose', strongest_phase: 'agent9_prose',
                    retry_stats: { total_retries: 0, phases_retried: 0, retry_rate: '0.00', retried_phases: [] },
                    total_cost: 0,
                },
                threshold_config: { mode: 'standard' },
            };
            const violations = validateGenerationReportInvariants(report);
            expect(violations.map(v => v.code)).not.toContain('missing_count_reconciliation');
            expect(violations.map(v => v.code)).not.toContain('malformed_count_reconciliation');
        });
    });
});
//# sourceMappingURL=report-invariants.test.js.map