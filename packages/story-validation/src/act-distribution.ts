export interface ActRatios {
  act1_ratio: number;
  act2_ratio: number;
}

/**
 * A7-D06 — act ratios are a PAIR: each is clamped to [0.1, 0.8] on its own, and act 3 gets what is left.
 * Clamped one at a time, 0.8 + 0.8 left act 3 at -0.6: a negative scene count in the prompt and a scene-count
 * rebalance that never terminates. A pair that leaves act 3 under the same 0.1 floor falls back to the defaults,
 * as an invalid single value does.
 */
export function actRatiosAsPair(clamped: ActRatios, defaults: ActRatios): ActRatios {
  if (1 - clamped.act1_ratio - clamped.act2_ratio < 0.1 - 1e-9) return { act1_ratio: defaults.act1_ratio, act2_ratio: defaults.act2_ratio };
  return clamped;
}
