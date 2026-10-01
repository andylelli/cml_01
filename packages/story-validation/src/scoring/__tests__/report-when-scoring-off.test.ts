import { describe, expect, it } from 'vitest';
import { ScoreAggregator } from '../aggregator.js';

/**
 * SCO-Q08 (owner decision 8, 2026-10-01): the run report is written even when ENABLE_SCORING is off. With no
 * phase scored, the 0 average must not read as an F — the report is marked unscored and graded N/A.
 */
const meta = { story_id: 'run_x', started_at: new Date(0), completed_at: new Date(1000), user_id: 'proj_x' };

describe('a report with phase scoring off', () => {
  it('is marked unscored and graded N/A, with the reason saying why', () => {
    const report = new ScoreAggregator({ mode: 'standard' } as any).generateReport({ ...meta, scoring_enabled: false });
    expect(report.scoring_enabled).toBe(false);
    expect(report.overall_grade).toBe('N/A');
    expect(report.scoring_outcome?.grade).toBe('N/A');
    expect(report.run_outcome_reason).toMatch(/^Phase scoring off \(ENABLE_SCORING\)/);
  });

  it('a scored report is unchanged (no marker, a real grade)', () => {
    const report = new ScoreAggregator({ mode: 'standard' } as any).generateReport(meta);
    expect(report.scoring_enabled).toBeUndefined();
    expect(report.overall_grade).not.toBe('N/A');
  });
});
