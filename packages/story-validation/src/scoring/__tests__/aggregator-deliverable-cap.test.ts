/**
 * The headline cannot claim more than the DELIVERABLE earned.
 *
 * MEASURED over the 15 archived reports carrying a prose phase (2026-08-20): **every one reports
 * grade A**, in a band of 93.4 to 97.4, while the prose phase underneath ranges 60 to 100. Four were
 * graded A with the prose phase at 60/D. `run_0a61b082` scored 95.64/A on a manuscript in which
 * neither "killed" nor "murdered" occurs at all, and whose reveal-repair had already failed on the
 * run's own console.
 *
 * The cause is arithmetic, not policy. `overall_score` is the unweighted mean of fourteen phases,
 * thirteen of which score upstream artifacts that sit at or near 100 by construction, so the
 * manuscript is one fourteenth of its own report card and a prose phase of 60 costs under three
 * points. Internally the run that read 86 externally scores 96.71 and the run that read 81 scores
 * 97.29 — in that order.
 *
 * These tests hold two things: the cap, and the WIRING. A cap keyed on an agent name that the
 * orchestrator no longer registers is a cap that silently stops applying, which is this codebase's
 * most repeated failure mode.
 */

import { describe, expect, it } from 'vitest';

import { ScoreAggregator } from '../aggregator.js';
import type { PhaseScore } from '../types.js';

const phaseScore = (agent: string, total: number): PhaseScore =>
  ({
    agent,
    validation_score: total,
    quality_score: total,
    completeness_score: total,
    consistency_score: total,
    total,
    grade: 'A',
    passed: total >= 70,
    tests: [],
  }) as unknown as PhaseScore;

/** The thirteen upstream phases, at the near-perfect scores the corpus actually shows. */
const UPSTREAM: Array<[string, number]> = [
  ['agent1_setting', 100], ['agent2_cast', 100], ['agent2e_background_context', 98],
  ['agent3b_hard_logic_devices', 100], ['agent3_cml', 100], ['agent8_novelty', 100],
  ['agent5_clues', 95], ['agent6_fairplay', 100], ['agent2b_profiles', 94],
  ['agent2c_location_profiles', 92], ['agent2d_temporal_context', 100],
  ['agent65_world_builder', 100], ['agent7_narrative', 100],
];

const build = (proseScore: number | null) => {
  const agg = new ScoreAggregator();
  for (const [agent, total] of UPSTREAM) {
    agg.addPhaseScore(agent, agent, phaseScore(agent, total), 0, 0);
  }
  if (proseScore !== null) {
    agg.addPhaseScore('agent9_prose', 'Prose Generation', phaseScore('agent9_prose', proseScore), 0, 0);
  }
  return agg.generateReport({
    story_id: 'test-run',
    user_id: 'test-project',
    started_at: new Date(0),
    completed_at: new Date(1000),
  });
};

describe('the headline is capped by the manuscript it describes', () => {
  it('reproduces run_0a61b082 — 60/D prose no longer reports as an A', () => {
    const report = build(60);
    // Before this cap the same inputs produced 95.64 / A.
    expect(report.overall_score).toBe(60);
    expect(report.overall_grade).not.toBe('A');
  });

  it('does not inflate a manuscript that scored better than the pipeline mean', () => {
    // The cap is a ceiling, never a floor: a 100 prose phase leaves the mean untouched.
    const report = build(100);
    expect(report.overall_score).toBeGreaterThan(95);
    expect(report.overall_score).toBeLessThan(100);
  });

  it('separates the two runs the old headline ranked backwards', () => {
    // 08-17 read 86 with prose 99; 08-19 read 81 with prose 100. The headline still cannot tell
    // them apart — that is a rubric problem, not this one — but it can no longer rank a 60 above
    // either, which is what it did.
    const good = build(99);
    const bad = build(60);
    expect(good.overall_score).toBeGreaterThan(bad.overall_score + 30);
  });

  it('is monotone in the manuscript score', () => {
    const scores = [50, 60, 70, 80, 90, 100].map((p) => build(p).overall_score);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]!).toBeGreaterThanOrEqual(scores[i - 1]!);
    }
  });
});

describe('the cap is wired to the phase the orchestrator actually registers', () => {
  it('applies to the agent key agent9-run.ts uses', () => {
    // agent9-run.ts calls upsertPhaseScore("agent9_prose", "Prose Generation", ...). If that key is
    // ever renamed, this test fails rather than the cap silently ceasing to apply.
    expect(build(60).phases.some((p) => p.agent === 'agent9_prose')).toBe(true);
    expect(build(60).overall_score).toBe(60);
  });

  it('does NOT cap a snapshot written before the manuscript exists', () => {
    // An in_progress partial has no prose phase. Capping it would re-grade exactly the artifacts
    // A_71 exists to label, and would report a pre-prose run as though its book had scored zero.
    const report = build(null);
    expect(report.phases.some((p) => p.agent === 'agent9_prose')).toBe(false);
    expect(report.overall_score).toBeGreaterThan(95);
  });

  it('leaves the per-phase scores untouched — the mean is still readable as pipeline health', () => {
    const report = build(60);
    const upstream = report.phases.filter((p) => p.agent !== 'agent9_prose');
    expect(upstream).toHaveLength(UPSTREAM.length);
    expect(upstream.every((p) => p.score.total >= 92)).toBe(true);
    expect(report.phase_thresholds_met).toBe(false);
  });
});
