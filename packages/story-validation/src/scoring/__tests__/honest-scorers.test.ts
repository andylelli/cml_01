/**
 * ANALYSIS_50 Phase 3 — honest scorers grade the REAL artifact. Each test asserts a well-formed
 * artifact scores high/passes and a hollow/regressed one scores low/fails (the regression-insurance
 * property), plus the off/shadow/enforce mode parser.
 */
import { describe, expect, it } from 'vitest';
import { parseHonestScorerMode } from '../honest-scorer.js';
import { scoreRealSetting } from '../phase-scorers/agent1-setting-real-scorer.js';
import { scoreRealLocations } from '../phase-scorers/agent2c-location-real-scorer.js';
import { scoreRealBackground } from '../phase-scorers/agent2e-background-real-scorer.js';
import { scoreRealCml } from '../phase-scorers/agent3-cml-real-scorer.js';
import { scoreRealHardLogic } from '../phase-scorers/agent3b-device-real-scorer.js';
import { scoreRealNarrative } from '../phase-scorers/agent7-narrative-real-scorer.js';

describe('parseHonestScorerMode', () => {
  it('defaults OFF; maps enforce / other-truthy→shadow', () => {
    expect(parseHonestScorerMode(undefined)).toBe('off');
    expect(parseHonestScorerMode('off')).toBe('off');
    expect(parseHonestScorerMode('0')).toBe('off');
    expect(parseHonestScorerMode('enforce')).toBe('enforce');
    expect(parseHonestScorerMode('shadow')).toBe('shadow');
    expect(parseHonestScorerMode('on')).toBe('shadow');
  });
});

describe('scoreRealSetting (T3.1)', () => {
  it('scores a real setting with atmosphere highly', () => {
    const s = scoreRealSetting({
      era: { decade: '1920s', technology: ['telephone'], communication: ['telegram'], socialNorms: ['class deference'], policing: ['village constable'] },
      location: { type: 'manor', description: 'An isolated moorland manor', physicalConstraints: ['locked gates', 'single bridge'], geographicIsolation: 'cut off by flooding', accessControl: ['butler admits guests'] },
      atmosphere: { weather: 'fog', timeOfDay: 'dusk', mood: 'foreboding', visualDescription: 'Gaslight smears across rain-dark oak as fog swallows the drive whole.' },
      realism: { anachronisms: [], implausibilities: [], recommendations: [] },
    });
    expect(s.passed).toBe(true);
    expect(s.total).toBeGreaterThanOrEqual(75);
  });
  it('critical-fails when the atmosphere block is missing', () => {
    const s = scoreRealSetting({ era: { decade: '1920s' }, location: { type: 'manor', description: 'x' } });
    expect(s.passed).toBe(false);
  });
});

describe('scoreRealLocations (T3.3)', () => {
  const rich = (id: string, base: string) => ({
    id, name: id, type: 'interior',
    sensoryDetails: {
      sights: [`${base} gaslight`, `${base} oak`, `${base} shadows`, `${base} portraits`],
      sounds: [`${base} clock`, `${base} fire`, `${base} rain`, `${base} floor`],
      smells: [`${base} beeswax`, `${base} ash`, `${base} leather`, `${base} damp`],
      tactile: [`${base} brass`, `${base} velvet`, `${base} draught`, `${base} stone`],
    },
  });
  it('rewards distinct atoms (4 crisp entries beat one long sentence)', () => {
    const s = scoreRealLocations({ keyLocations: [rich('library', 'lib'), rich('study', 'stu'), rich('hall', 'hal'), rich('garden', 'gar')], atmosphere: {} });
    expect(s.passed).toBe(true);
    expect(s.quality_score).toBeGreaterThanOrEqual(70);
  });
  it('penalizes a verbose single-atom field', () => {
    const s = scoreRealLocations({
      keyLocations: [{ id: 'a', name: 'a', type: 'interior', sensoryDetails: { sights: ['one very long run on sentence describing a great deal at length'], sounds: [], smells: [], tactile: [] } }],
      atmosphere: {},
    });
    expect(s.quality_score).toBeLessThan(50);
  });
});

describe('scoreRealBackground (T3.4)', () => {
  it('grades its own substantive artifact highly', () => {
    const s = scoreRealBackground(
      { status: 'ok', backdropSummary: 'A post-war estate where old money and new resentments collide under one roof during a long winter.', era: { decade: '1920s', socialStructure: 'declining gentry vs rising staff' }, setting: { location: 'manor', institution: 'family estate' }, castAnchors: ['Lady Vane', 'Carter', 'Mrs Hale', 'Dr Voss'], theme: 'inheritance and buried guilt' },
      { castRoster: ['Lady Vane', 'Carter', 'Mrs Hale', 'Dr Voss'], agent1Echo: ['an isolated moorland manor'] },
    );
    expect(s.passed).toBe(true);
  });
  it('dents completeness when anchors are not real cast names', () => {
    const s = scoreRealBackground(
      { status: 'ok', backdropSummary: 'A manor in winter with tensions running high among the assembled guests.', era: { decade: '1920s' }, setting: { location: 'manor', institution: 'estate' }, castAnchors: ['Some Stranger', 'Another Ghost'] },
      { castRoster: ['Lady Vane', 'Carter'] },
    );
    expect(s.completeness_score).toBeLessThan(60);
    expect(s.component_failures).toContain('completeness');
  });
});

describe('scoreRealCml (T3.5)', () => {
  const goodCml = {
    CASE: {
      cast: [
        { name: 'Carter', motive_seed: 'silenced over a forged ledger', opportunity_channels: 'alone in the study at 9' },
        { name: 'Vane', motive_seed: 'feared exposure of an affair', opportunity_channels: 'key to the library' },
      ],
      closed_circle: { suspects: ['Carter', 'Vane'] },
      culpability: { culprits: ['Carter'] },
      inference_path: { steps: [
        { observation: 'clock stopped 9:14', correction: 'it was reset' },
        { observation: 'mud on the sill', correction: 'entry via window' },
        { observation: 'ink on the cuff', correction: 'forged the ledger' },
      ] },
      discriminating_test: { design: 'compare ink', knowledge_revealed: 'only the forger had it', pass_condition: 'match', evidence_clues: ['clue_1'] },
      false_solution: { accused_suspect: 'Vane', supporting_points: ['had a key', 'was seen nearby'], the_one_flaw: 'was on the phone at 9' },
      red_herrings: [
        { points_at_suspect: 'Vane', innocent_explanation: 'innocent errand' },
        { points_at_suspect: 'Hale', innocent_explanation: 'coincidence' },
      ],
    },
  };
  it('passes a well-formed CML', () => {
    const s = scoreRealCml(goodCml);
    expect(s.passed).toBe(true);
  });
  it('fails when the false solution accuses the real culprit', () => {
    const bad = JSON.parse(JSON.stringify(goodCml));
    bad.CASE.false_solution.accused_suspect = 'Carter';
    bad.CASE.red_herrings = [{ points_at_suspect: 'Carter', innocent_explanation: 'x' }];
    const s = scoreRealCml(bad);
    expect(s.consistency_score).toBeLessThan(60);
  });
  it('critical-fails when the discriminating test is missing', () => {
    const bad = JSON.parse(JSON.stringify(goodCml));
    delete bad.CASE.discriminating_test;
    expect(scoreRealCml(bad).passed).toBe(false);
  });
});

describe('scoreRealHardLogic (T3.6)', () => {
  it('rewards a concrete, clued device over a long-but-empty one', () => {
    const good = scoreRealHardLogic([{
      title: 'The Cooling Pendulum', principleType: 'physical_law',
      corePrinciple: 'thermal expansion alters a pendulum period',
      surfaceIllusion: 'the clock ran slow on its own',
      underlyingReality: 'a brass rod lengthens 0.5mm at 30 degrees, slowing the swing measurably',
      fairPlayClues: ['a radiator was moved beside the clock that afternoon', 'the case felt warm to the touch when found'],
      whyNotTrope: 'uses real thermal physics rather than a hidden accomplice',
      lockedFacts: [{ id: 'f1', value: '0.5mm at 30 degrees C', description: 'rod expansion' }],
    }]);
    expect(good.passed).toBe(true);
    const bad = scoreRealHardLogic([{
      title: 'X', principleType: 'physical_law',
      corePrinciple: 'logic', surfaceIllusion: 'impossible', underlyingReality: 'a clever trick happened somehow',
      fairPlayClues: ['a clue'], whyNotTrope: 'novel',
    }]);
    expect(bad.total).toBeLessThan(good.total);
  });
});

describe('scoreRealNarrative (T3.7)', () => {
  const scene = (loc: string, words: number) => ({ setting: { location: loc }, summary: 'the body is found and the household gathers', estimatedWordCount: words });
  it('rewards near-budget scenes over bloated ones', () => {
    // medium ideal ≈ 1700; near-budget vs heavily bloated
    const near = scoreRealNarrative({ acts: [{ scenes: Array.from({ length: 8 }, (_, i) => scene(`room${i}`, 1700)) }] }, 'medium');
    const bloated = scoreRealNarrative({ acts: [{ scenes: Array.from({ length: 8 }, (_, i) => scene(`room${i}`, 3200)) }] }, 'medium');
    expect(near.quality_score).toBeGreaterThan(bloated.quality_score);
  });
  it('critical-fails when there are no scenes', () => {
    expect(scoreRealNarrative({ acts: [] }, 'medium').passed).toBe(false);
  });
});
