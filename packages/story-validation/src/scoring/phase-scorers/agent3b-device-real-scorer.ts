/**
 * Agent 3b — "grade the REAL artifact" hard-logic device-depth scorer (ANALYSIS_50 T3.6).
 *
 * The vanity `scoreDeviceDepth` ([agent4-hard-logic-scorer.ts]) rewards `description.length > 30`
 * and array `.length`. This grades real DEPTH on the primary device: a concrete physical claim in
 * `underlyingReality`, ≥2 substantive `fairPlayClues`, a specific `principleType`+`corePrinciple`,
 * `lockedFacts` with concrete values, and a non-generic `whyNotTrope`. Deterministic — distinct from
 * the P2.2 LLM plausibility judge. Local mirror — no prompts-llm dependency.
 */

import { PhaseScore, TestResult } from '../types.js';
import { pass, fail, partial } from '../scorer-utils.js';
import { assembleHonestScore } from '../honest-scorer.js';

export interface RealDevice {
  title?: string;
  corePrinciple?: string;
  principleType?: string;
  surfaceIllusion?: string;
  underlyingReality?: string;
  fairPlayClues?: string[];
  whyNotTrope?: string;
  lockedFacts?: Array<{ id?: string; value?: string; description?: string }>;
}

const PRINCIPLE_TYPES = new Set(['physical_law', 'mathematical_principle', 'cognitive_bias', 'social_logic']);
const CONCRETE_RE = /\d|degree|minute|second|hour|inch|foot|feet|metre|meter|gram|pound|temperature|pressure|angle|expand|contract|heat|cool|freeze|melt|dissolve|evaporate|refract|reflect|magnet|current|voltage|tide|gravity|density|viscos/i;
const GENERIC_TROPE_RE = /^(it'?s novel|this is novel|not a trope|fresh|original|unique)\.?$/i;
const wc = (s: unknown): number => String(s ?? '').trim().split(/\s+/).filter(Boolean).length;

export function scoreRealHardLogic(devices: RealDevice[] | undefined | null): PhaseScore {
  const list = Array.isArray(devices) ? devices : [];
  const primary = list[0] ?? {};
  const tests: TestResult[] = [];

  // ── Validation ──
  tests.push(list.length >= 1 && String(primary.title ?? '').trim().length > 0
    ? pass('Primary device present', 'validation', 1.5)
    : fail('Primary device present', 'validation', 1.5, 'no device / no title', 'critical'));
  tests.push(String(primary.underlyingReality ?? '').trim().length > 0
    ? pass('Underlying reality stated', 'validation', 1.5)
    : fail('Underlying reality stated', 'validation', 1.5, 'underlyingReality empty', 'critical'));

  // ── Quality (T3.6 core: depth, not length) ──
  tests.push(CONCRETE_RE.test(String(primary.underlyingReality ?? ''))
    ? pass('Concrete physical claim', 'quality', 2.0)
    : fail('Concrete physical claim', 'quality', 2.0, 'underlyingReality has no measurable/mechanistic content', 'major'));
  const clues = (primary.fairPlayClues ?? []).filter((c) => wc(c) >= 5);
  tests.push(partial('Substantive fair-play clues', 'quality',
    clues.length >= 2 ? 100 : clues.length === 1 ? 55 : 0, 1.5, `${clues.length} substantive clue(s)`));
  tests.push(PRINCIPLE_TYPES.has(String(primary.principleType ?? '')) && wc(primary.corePrinciple) >= 4
    ? pass('Specific principle', 'quality', 1.0)
    : partial('Specific principle', 'quality', 40, 1.0, 'principleType/corePrinciple thin'));

  // ── Completeness ── lockedFacts with concrete values
  const facts = (primary.lockedFacts ?? []).filter((f) => /\d|degree|minute|hour|inch|foot|metre|meter/i.test(String(f?.value ?? '')));
  tests.push(partial('Locked facts (concrete values)', 'completeness',
    facts.length >= 1 ? 100 : (primary.lockedFacts ?? []).length >= 1 ? 50 : 0, 1.5, `${facts.length} concrete locked fact(s)`));

  // ── Consistency ──
  const surface = String(primary.surfaceIllusion ?? '').trim().toLowerCase();
  const under = String(primary.underlyingReality ?? '').trim().toLowerCase();
  tests.push(surface && under && surface !== under
    ? pass('Illusion differs from reality', 'consistency', 1.0)
    : fail('Illusion differs from reality', 'consistency', 1.0, 'surfaceIllusion == underlyingReality or empty', 'minor'));
  tests.push(String(primary.whyNotTrope ?? '').trim().length > 0 && !GENERIC_TROPE_RE.test(String(primary.whyNotTrope ?? '').trim())
    ? pass('Non-generic novelty rationale', 'consistency', 1.0)
    : partial('Non-generic novelty rationale', 'consistency', 40, 1.0, 'whyNotTrope generic/empty'));

  return assembleHonestScore('agent3b-hard-logic', tests);
}
