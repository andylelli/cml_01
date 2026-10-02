import { describe, expect, it } from 'vitest';
import { ScoreAggregator } from '../aggregator.js';
import type { PhaseScore } from '../types.js';

/**
 * SCO-D12 (owner decision, 2026-10-02): a skipped novelty audit was recorded as 100/A and averaged into
 * overall_score — a check that did not run raised the headline. It is now recorded `not_applicable`, graded
 * 'N/A' and left out of every aggregate, as owner decision 8 did for a report with scoring off.
 */
const meta = { story_id: 'run_x', started_at: new Date(0), completed_at: new Date(1000), user_id: 'proj_x' };

const scored = (agent: string, total: number): PhaseScore => ({
  agent, total, grade: 'C', passed: true, tests: [],
  validation_score: total, quality_score: total, completeness_score: total, consistency_score: total,
});

/** The skipped-audit phase exactly as agent8-run.ts records it. */
const skippedNovelty: PhaseScore = {
  agent: 'agent8-novelty-audit',
  validation_score: 0, quality_score: 0, completeness_score: 0, consistency_score: 0,
  total: 0, grade: 'N/A', passed: true, not_applicable: true,
  tests: [{ name: 'Novelty check', category: 'validation', passed: true, score: 0, weight: 0, message: 'Skipped' }],
};

const build = (withSkipped: boolean) => {
  const agg = new ScoreAggregator({ mode: 'standard' });
  agg.upsertPhaseScore('agent2_cast', 'Cast Design', scored('agent2-cast', 90), 0, 0);
  agg.upsertPhaseScore('agent7_narrative', 'Narrative Outline', scored('agent7-narrative', 80), 0, 0);
  if (withSkipped) agg.upsertPhaseScore('agent8_novelty', 'Novelty Audit', skippedNovelty, 0, 0);
  return agg.generateReport(meta);
};

describe('a skipped novelty audit is N/A (SCO-D12)', () => {
  it('the same phases with and without a skipped novelty phase give the same overall score and grade', () => {
    const without = build(false);
    const withSkip = build(true);
    expect(withSkip.overall_score).toBe(without.overall_score);
    expect(withSkip.overall_score).toBe(85);
    expect(withSkip.overall_grade).toBe(without.overall_grade);
    expect(withSkip.phase_thresholds_met).toBe(without.phase_thresholds_met);
    expect(withSkip.run_outcome).toBe(without.run_outcome);
  });

  it('is still recorded, graded N/A, and counted in no summary statistic', () => {
    const r = build(true);
    const phase = r.phases.find((p) => p.agent === 'agent8_novelty')!;
    expect(phase.score.grade).toBe('N/A');
    expect(phase.score.not_applicable).toBe(true);
    expect(phase.passed).toBe(true);
    expect(r.summary.total_phases).toBe(2);
    expect(r.summary.phases_passed + r.summary.phases_failed).toBe(2);
    expect(r.summary.weakest_phase).not.toBe('Novelty Audit');
    expect(r.summary.strongest_phase).not.toBe('Novelty Audit');
  });

  it('the old 100/A record raised the headline — the defect this fixes', () => {
    const agg = new ScoreAggregator({ mode: 'standard' });
    agg.upsertPhaseScore('agent2_cast', 'Cast Design', scored('agent2-cast', 90), 0, 0);
    agg.upsertPhaseScore('agent7_narrative', 'Narrative Outline', scored('agent7-narrative', 80), 0, 0);
    agg.upsertPhaseScore('agent8_novelty', 'Novelty Audit', { ...scored('agent8-novelty-audit', 100), grade: 'A' }, 0, 0);
    expect(agg.generateReport(meta).overall_score).toBe(90);
  });
});
