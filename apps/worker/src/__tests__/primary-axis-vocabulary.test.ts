/**
 * ONE axis vocabulary, and an unknown value is an ERROR.
 *
 * THE DEFECT (found by review, 2026-08-20). Two incompatible vocabularies ran at once — the CML
 * layer named `temporal | spatial | identity | behavioral | authority`, while the orchestrator and
 * the API named `temporal | spatial | social | psychological | mechanical`. Only two members were
 * common, and `normalizePrimaryAxis` ended in `default: return "temporal"`. So three of the five
 * values `canary-core-inputs.yaml` documents were silently coerced:
 *
 *     identity -> temporal      behavioral -> temporal      authority -> temporal
 *
 * with no warning, and `deriveHardLogicDirectives` — whose switch listed the OTHER vocabulary —
 * seeded zero mechanism families for them on top.
 *
 * MEASURED CONSEQUENCE: 23 of 23 archived cases are `false_assumption.type: temporal`, and 24 of 24
 * devices are clock-family. Four of the five advertised axes have never been generated once. Five of
 * the fifteen geometry codes are temporal-only, so a third of geometry would go quiet on an axis no
 * run has ever produced.
 *
 * These tests hold the contract that makes "any combination of story parameters" checkable: every
 * documented value survives end to end, retired spellings still work, and anything else throws
 * before a penny is spent.
 */

import { describe, expect, it, vi } from 'vitest';

import {
  CML_PRIMARY_AXES,
  DEFAULT_PRIMARY_AXIS,
  normalizePrimaryAxis,
  deriveHardLogicDirectives,
} from '../jobs/agents/shared.js';

describe('normalizePrimaryAxis — every documented axis survives itself', () => {
  it('returns each of the five unchanged', () => {
    for (const axis of CML_PRIMARY_AXES) {
      expect(normalizePrimaryAxis(axis), axis).toBe(axis);
    }
  });

  it('no longer collapses the three that used to become temporal', () => {
    // The exact regression. Before the fix all three returned "temporal".
    expect(normalizePrimaryAxis('identity')).toBe('identity');
    expect(normalizePrimaryAxis('behavioral')).toBe('behavioral');
    expect(normalizePrimaryAxis('authority')).toBe('authority');
  });

  it('accepts the retired spellings, because saved specs still carry them', () => {
    expect(normalizePrimaryAxis('social')).toBe('authority');
    expect(normalizePrimaryAxis('psychological')).toBe('behavioral');
  });

  it('is tolerant of case and surrounding space, and of nothing else', () => {
    expect(normalizePrimaryAxis('  Identity ')).toBe('identity');
    expect(normalizePrimaryAxis('TEMPORAL')).toBe('temporal');
  });
});

describe('normalizePrimaryAxis — an unknown axis is an error, not a temporal mystery', () => {
  it('throws on a value it does not recognise', () => {
    expect(() => normalizePrimaryAxis('nonsense')).toThrow(/Unknown primaryAxis/);
  });

  it('names what was passed and what is accepted', () => {
    try {
      normalizePrimaryAxis('temporl'); // the typo that used to cost a whole run
      throw new Error('should have thrown');
    } catch (err) {
      const message = String((err as Error).message);
      expect(message).toContain('temporl');
      for (const axis of CML_PRIMARY_AXES) expect(message).toContain(axis);
    }
  });

  it('rejects "mechanical" rather than turning it into an identity mystery', () => {
    // It used to map to "identity": a caller asking for a device plot got impersonation and twins.
    expect(() => normalizePrimaryAxis('mechanical')).toThrow(/mechanical/);
  });
});

describe('normalizePrimaryAxis — an absent axis defaults, and says so', () => {
  it('defaults for undefined, null and empty', () => {
    for (const absent of [undefined, null, '', '   ']) {
      expect(normalizePrimaryAxis(absent as string | undefined)).toBe(DEFAULT_PRIMARY_AXIS);
    }
  });

  it('reports the default through the callback, so a run log records that nobody chose', () => {
    const onDefault = vi.fn();
    normalizePrimaryAxis(undefined, onDefault);
    expect(onDefault).toHaveBeenCalledOnce();
    expect(String(onDefault.mock.calls[0]![0])).toMatch(/not specified/);
  });

  it('does NOT report a default when an axis was given', () => {
    const onDefault = vi.fn();
    normalizePrimaryAxis('spatial', onDefault);
    expect(onDefault).not.toHaveBeenCalled();
  });
});

describe('deriveHardLogicDirectives — every axis seeds mechanism families', () => {
  it('seeds a distinct, non-empty family set for all five', () => {
    const seen = new Map<string, string[]>();
    for (const axis of CML_PRIMARY_AXES) {
      const families = deriveHardLogicDirectives(undefined, axis, undefined).mechanismFamilies;
      // Before the fix, identity/behavioral/authority fell through `default: break` and got none.
      expect(families.length, `${axis} seeded nothing`).toBeGreaterThan(0);
      seen.set(axis, families);
    }
    // Each axis must seed something of its own, or the axis is not doing any work.
    const signatures = [...seen.values()].map((f) => [...f].sort().join('|'));
    expect(new Set(signatures).size).toBe(CML_PRIMARY_AXES.length);
  });

  it('gives identity its own families rather than the mechanical ones it used to inherit', () => {
    const families = deriveHardLogicDirectives(undefined, 'identity', undefined).mechanismFamilies;
    expect(families.join(' ')).toMatch(/substitution|misidentification/);
    expect(families.join(' ')).not.toMatch(/acoustic or pressure|mechanical sequence/);
  });

  it('still layers theme-derived families on top of the axis ones', () => {
    const families = deriveHardLogicDirectives('a locked-room poisoning', 'spatial', undefined)
      .mechanismFamilies;
    expect(families.join(' ')).toMatch(/sealed-space/);
    expect(families.join(' ')).toMatch(/access path|geometry-based/);
  });
});
