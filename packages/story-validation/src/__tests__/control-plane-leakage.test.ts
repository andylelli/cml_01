import { describe, it, expect } from 'vitest';
import {
  detectControlPlaneLeakage,
  detectVerbatimFieldEcho,
} from '../control-plane-leakage.js';

// The exact discriminating_test.design fed to Agent9 in run_1d55f7c7.
const DESIGN =
  "A controlled reenactment demonstrates the grandfather clock's spring tension and hand " +
  'positions under normal winding versus tampered winding conditions, using the found winding ' +
  'key and clock mechanism. This physical test, combined with servant testimony about unusual ' +
  "chimes, exposes the impossibility of the clock showing the true time of death, confirming " +
  "Lady Beatrice's manipulation.";

describe('detectVerbatimFieldEcho', () => {
  it('flags a chapter that transcribes the discriminating-test design verbatim', () => {
    const prose =
      'Inspector Fox then ran the test in full view. A controlled reenactment demonstrates the ' +
      "grandfather clock's spring tension and hand positions under normal winding versus tampered " +
      'winding conditions, using the found winding key and clock mechanism. The room went still.';
    const findings = detectVerbatimFieldEcho(prose, [DESIGN]);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].wordCount).toBeGreaterThanOrEqual(12);
  });

  it('does NOT flag a genuine paraphrase of the same mechanism', () => {
    const prose =
      'Fox wound the clock the ordinary way and the hands held true; then he forced it back, and ' +
      'the spring went slack as the hands slipped out of true. Only a deliberate hand could do that.';
    const findings = detectVerbatimFieldEcho(prose, [DESIGN]);
    expect(findings).toHaveLength(0);
  });

  it('does NOT flag short locked-fact strings (below the consecutive-word threshold)', () => {
    const prose = 'The clock read ten minutes past eleven, but the watch said quarter past ten.';
    const findings = detectVerbatimFieldEcho(prose, [
      'ten minutes past eleven',
      'forty minutes',
      'quarter past ten',
    ]);
    expect(findings).toHaveLength(0);
  });

  it('ignores empty / whitespace fed strings and empty prose', () => {
    expect(detectVerbatimFieldEcho('', [DESIGN])).toHaveLength(0);
    expect(detectVerbatimFieldEcho('Some prose.', ['', '   ', null, undefined])).toHaveLength(0);
  });
});

describe('detectControlPlaneLeakage — schema/outline reasoning patterns', () => {
  it('flags an "Eliminates X because… narrowing the solution" reasoning leak', () => {
    const prose =
      'Eliminates Charles Wynthorpe because stable logs and alibi testimonies corroborate his ' +
      'absence from the scene, narrowing the solution toward Lady Beatrice Wynthorpe.';
    const codes = detectControlPlaneLeakage(prose).map((f) => f.code);
    expect(codes).toContain('reasoning_leak_eliminates');
    expect(codes).toContain('reasoning_leak_narrowing');
  });

  it('flags "direct evidence links… mechanism access point… excludes competing suspect timelines"', () => {
    const prose =
      'The direct evidence links Lady Beatrice Wynthorpe to the mechanism access point before the ' +
      'discriminating test and excludes competing suspect timelines.';
    const codes = detectControlPlaneLeakage(prose).map((f) => f.code);
    expect(codes).toContain('reasoning_leak_direct_evidence');
    expect(codes).toContain('reasoning_leak_access_point');
    expect(codes).toContain('reasoning_leak_competing_timelines');
  });

  it('does NOT flag ordinary denouement prose that merely mentions a test', () => {
    const prose =
      'Fox set the two timepieces side by side and let the household watch. The clock had lied; ' +
      'the watch had not. No one in the room could pretend otherwise now.';
    const findings = detectControlPlaneLeakage(prose);
    expect(findings.filter((f) => f.code.startsWith('reasoning_leak'))).toHaveLength(0);
  });

  describe('contract_term is scaffold-qualified (not the ordinary English word)', () => {
    it('does NOT flag the verb/noun "contract" in ordinary prose', () => {
      for (const prose of [
        'The storm pressed close, making the walls seem to contract around the anxious guests.',
        'She produced the marriage contract and laid it on the table.',
        'He had begun to contract a fever by the third night.',
      ]) {
        expect(detectControlPlaneLeakage(prose).map((f) => f.code)).not.toContain('contract_term');
      }
    });
    it('still flags genuine scaffold contract terminology', () => {
      for (const prose of [
        'This chapter satisfies the obligation contract for the discovery beat.',
        'The chapter contract requires three clues before the reveal.',
        'Each scene must meet its contract requirements before commit.',
      ]) {
        expect(detectControlPlaneLeakage(prose).map((f) => f.code)).toContain('contract_term');
      }
    });
  });
});
