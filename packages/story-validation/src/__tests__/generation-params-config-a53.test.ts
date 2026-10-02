import { describe, expect, it } from 'vitest';
import { getGenerationParams, DEFAULT_CONFIG } from '../generation-params.js';

// A_53 P6 — config single source of truth. These pin the values that previously diverged between the
// YAML and DEFAULT_CONFIG, so a future drift fails CI instead of silently changing live behavior.

describe('generation-params — single source of truth (A_53 P6)', () => {
  // The Agent 6 max_remediation_cycles pin went with the key (2026-10-02): the blind-reader remediation
  // cycles it budgeted were retired with Agent 6's retry arm (owner decision A6-Q01), and nothing reads it.

  it('novelty similarity_threshold_default fires the audit by default (shouldSkipNovelty=false)', () => {
    const threshold = getGenerationParams().agent8_novelty.params.thresholds.similarity_threshold_default;
    expect(threshold).toBeLessThan(1); // threshold >= 1 would skip the audit
    expect(threshold).toBeCloseTo(0.9, 6);
  });
});

// A_56 X-E — the fallback DEFAULT_CONFIG (used on YAML-load failure) must not drift below the live YAML
// for truncation-critical model params. The YAML deliberately raised agent2b/2c to 8000 and agent3b to
// 6000 to stop JSON truncation; DEFAULT_CONFIG had drifted to 4000/4500/2600, so a YAML read error would
// silently reintroduce the truncation. This parity test fails CI if either source drifts again.
describe('generation-params — DEFAULT_CONFIG fallback parity with live YAML (A_56 X-E)', () => {
  const truncationCritical = [
    'agent2b_profiles',
    'agent2c_location_profiles',
    'agent3b_hard_logic_devices',
  ] as const;

  it('DEFAULT_CONFIG model.max_tokens + attempts match the live (YAML) config for truncation-critical agents', () => {
    const live = getGenerationParams();
    for (const agent of truncationCritical) {
      expect(DEFAULT_CONFIG[agent].params.model.max_tokens).toBe(live[agent].params.model.max_tokens);
      expect(DEFAULT_CONFIG[agent].params.generation.default_max_attempts).toBe(
        live[agent].params.generation.default_max_attempts,
      );
    }
  });

  it('the raised ceilings stay raised (2b/2c=8000, 3b=6000) so profile/device JSON is not truncated', () => {
    const live = getGenerationParams();
    expect(live.agent2b_profiles.params.model.max_tokens).toBe(8000);
    expect(live.agent2c_location_profiles.params.model.max_tokens).toBe(8000);
    expect(live.agent3b_hard_logic_devices.params.model.max_tokens).toBe(6000);
  });
});

// A7-D06 — act ratios are a pair. Clamped one at a time, 0.8 + 0.8 gave act 3 a negative share and hung
// the scene-count rebalance; a pair that leaves act 3 under 0.1 now falls back to the defaults.
describe('generation-params — act distribution is a pair (A7-D06)', () => {
  const dflt = { act1_ratio: 0.28, act2_ratio: 0.47 };
  it('keeps a pair that leaves act 3 at least 0.1', async () => {
    const { actRatiosAsPair } = await import('../act-distribution.js');
    expect(actRatiosAsPair({ act1_ratio: 0.3, act2_ratio: 0.5 }, dflt)).toEqual({ act1_ratio: 0.3, act2_ratio: 0.5 });
    expect(actRatiosAsPair({ act1_ratio: 0.4, act2_ratio: 0.5 }, dflt)).toEqual({ act1_ratio: 0.4, act2_ratio: 0.5 });
  });
  it('falls back to the defaults when act 3 would be under 0.1 (0.8 + 0.8 used to leave it at -0.6)', async () => {
    const { actRatiosAsPair } = await import('../act-distribution.js');
    expect(actRatiosAsPair({ act1_ratio: 0.8, act2_ratio: 0.8 }, dflt)).toEqual(dflt);
    expect(actRatiosAsPair({ act1_ratio: 0.45, act2_ratio: 0.5 }, dflt)).toEqual(dflt);
  });
  it('the live config is a valid pair', () => {
    const d = getGenerationParams().agent7_narrative.params.pacing.act_distribution;
    expect(1 - d.act1_ratio - d.act2_ratio).toBeGreaterThanOrEqual(0.1 - 1e-9);
  });
});
