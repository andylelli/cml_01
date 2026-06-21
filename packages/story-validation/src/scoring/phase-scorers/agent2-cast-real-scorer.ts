/**
 * Agent 2 — "grade the REAL artifact" cast scorer.
 *
 * Foundation for the Agent 2 redesign
 * (documentation/12_system_redesign/02_agent_2_cast.md §3 + §5 + §9.2).
 *
 * The CURRENT scorer ([agent2-cast-scorer.ts]) grades phantom fields the agent never
 * emits — `opportunity_channels`, `behavioral_tells`, `culprit_eligibility`,
 * `relationships: string[]` — all *fabricated by an adapter*
 * ([agent2-scoring-adapter.ts]). It is scoring an impedance-mismatched shadow of the
 * real artifact (§3).
 *
 * This module is the ADDITIVE replacement: it grades the *actual* `CastDesign` via the
 * existing deterministic checker (`checkCast` from `@cml/prompts-llm`), reading REAL
 * metrics — distinctness, graph connectivity, gender completeness, dangling references —
 * never fabricated arrays.
 *
 * It is NOT wired into the live scoring path. It introduces zero risk to current scoring:
 * the existing scorer, adapter, and all live wiring are untouched. It returns a
 * `PhaseScore`-compatible shape so it can be slotted in when the redesign lands.
 *
 * Dependency note: `@cml/prompts-llm` is NOT a dependency of `@cml/story-validation`
 * (its deps are `@cml/cml`, `@cml/llm-client`, `js-yaml`). To keep that boundary clean,
 * this scorer does NOT import `checkCast`; the caller computes the `CastCheckResult`
 * (in the worker, where `@cml/prompts-llm` is already a dependency) and passes it in. The
 * structural types below are declared locally and are assignment-compatible with the
 * `@cml/prompts-llm` exports (`CastDesign`, `CastCheckResult`, `CastCheckMetrics`).
 */

import { PhaseScore, TestResult } from '../types.js';
import {
  pass,
  fail,
  partial,
  calculateCategoryScore,
  getCriticalFailures,
} from '../scorer-utils.js';

// ---------------------------------------------------------------------------
// Structural mirrors of the @cml/prompts-llm exports (kept local so this package
// does not need to depend on @cml/prompts-llm). These are intentionally loose
// (optional fields, no `additionalProperties` constraint) so the real exported
// types — which are stricter — are assignable to them.
// ---------------------------------------------------------------------------

/** Mirror of `CharacterProfile` from `@cml/prompts-llm`. */
export interface RealCastCharacter {
  name: string;
  ageRange?: string;
  occupation?: string;
  roleArchetype?: string;
  publicPersona?: string;
  privateSecret?: string;
  motiveSeed?: string;
  motiveStrength?: string;
  alibiWindow?: string;
  accessPlausibility?: string;
  stakes?: string;
  characterArcPotential?: string;
  gender?: string;
}

/** Mirror of `CastDesign` from `@cml/prompts-llm` (only the fields this scorer reads). */
export interface RealCastDesign {
  characters: RealCastCharacter[];
  relationships?: unknown;
  diversity?: unknown;
  crimeDynamics?: unknown;
}

/** Mirror of `CastGraphMetrics` from `@cml/prompts-llm`. */
export interface RealCastGraphMetrics {
  nodes: number;
  edges: number;
  isolatedNodes: string[];
  highTensionEdges: number;
  danglingNames: string[];
}

/** Mirror of `CastCheckMetrics` from `@cml/prompts-llm`. */
export interface RealCastCheckMetrics {
  count: number;
  expectedCount: number | null;
  uniqueArchetypes: number;
  archetypeUniqueRatio: number;
  ageBandSpread: number;
  socialPositionSpread: number;
  genderCompleteness: number;
  placeholderCount: number;
  illegalEnumCount: number;
  graph: RealCastGraphMetrics;
}

/** Mirror of `CastCheckResult` from `@cml/prompts-llm`. */
export interface RealCastCheckResult {
  ok: boolean;
  issues: Array<{ code: string; severity: 'error' | 'warn'; character?: string; message: string }>;
  metrics: RealCastCheckMetrics;
  feedback: string[];
}

export interface ScoreRealCastOptions {
  /** Expected character count. Used by the completeness component. */
  expectedCount?: number;
}

/** A `PhaseScore`-compatible result. */
export type RealCastScore = PhaseScore;

// Fields that must be present (non-empty) on every character for completeness.
const REQUIRED_CHARACTER_FIELDS: (keyof RealCastCharacter)[] = [
  'name',
  'gender',
  'ageRange',
  'occupation',
  'roleArchetype',
  'publicPersona',
  'privateSecret',
  'motiveSeed',
  'stakes',
];

const isNonEmpty = (v: unknown): boolean =>
  typeof v === 'string' ? v.trim().length > 0 : v !== null && v !== undefined;

function calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Grade a real `CastDesign` from the deterministic `checkCast` metrics.
 *
 * @param cast  The actual cast artifact the agent emitted.
 * @param check The result of `checkCast(cast, { expectedCount })`, computed by the caller
 *              (keeps the `@cml/prompts-llm` dependency out of this package).
 * @param opts  Optional `expectedCount`. If omitted, falls back to `check.metrics.expectedCount`.
 */
export function scoreRealCast(
  cast: RealCastDesign,
  check: RealCastCheckResult,
  opts: ScoreRealCastOptions = {}
): RealCastScore {
  const metrics = check.metrics;
  const characters = Array.isArray(cast?.characters) ? cast.characters : [];
  const expectedCount =
    opts.expectedCount ?? (metrics.expectedCount !== null ? metrics.expectedCount : characters.length);

  const tests: TestResult[] = [];

  tests.push(...validationTests(metrics, characters.length));
  tests.push(...qualityTests(metrics));
  tests.push(...completenessTests(metrics, characters, expectedCount));
  tests.push(...consistencyTests(metrics, characters));

  const validation_score = calculateCategoryScore(tests, 'validation');
  const quality_score = calculateCategoryScore(tests, 'quality');
  const completeness_score = calculateCategoryScore(tests, 'completeness');
  const consistency_score = calculateCategoryScore(tests, 'consistency');

  // Same weighting as the current scorer (validation 40 / quality 30 / completeness 20 / consistency 10).
  const total =
    validation_score * 0.4 +
    quality_score * 0.3 +
    completeness_score * 0.2 +
    consistency_score * 0.1;

  const criticalFailures = getCriticalFailures(tests);
  const passed = criticalFailures.length === 0 && total >= 60;

  const component_failures: string[] = [];
  if (validation_score < 60) component_failures.push('validation');
  if (quality_score < 50) component_failures.push('quality');
  if (completeness_score < 60) component_failures.push('completeness');
  if (consistency_score < 50) component_failures.push('consistency');

  return {
    agent: 'agent2-cast',
    validation_score,
    quality_score,
    completeness_score,
    consistency_score,
    total: Math.round(total),
    grade: calculateGrade(total),
    passed,
    tests,
    component_failures: component_failures.length > 0 ? component_failures : undefined,
    failure_reason: !passed
      ? buildFailureReason(criticalFailures, component_failures)
      : undefined,
  };
}

/**
 * Validation: structure integrity from the REAL metrics — no placeholders, no illegal
 * enums, full gender completeness. High when placeholderCount===0 && illegalEnumCount===0
 * && genderCompleteness===1.
 */
function validationTests(metrics: RealCastCheckMetrics, count: number): TestResult[] {
  const tests: TestResult[] = [];

  if (count === 0) {
    tests.push(fail('Cast not empty', 'validation', 3.0, 'Cast has no characters', 'critical'));
    return tests;
  }
  tests.push(pass('Cast not empty', 'validation', 1.0));

  // No placeholder characters (the §3 padding tell). Any placeholder is a critical defect.
  tests.push(
    metrics.placeholderCount === 0
      ? pass('No placeholder characters', 'validation', 2.0)
      : fail(
          'No placeholder characters',
          'validation',
          2.0,
          `${metrics.placeholderCount} placeholder character(s) present`,
          'critical'
        )
  );

  // No illegal enums (motiveStrength / accessPlausibility).
  tests.push(
    metrics.illegalEnumCount === 0
      ? pass('No illegal enum values', 'validation', 2.0)
      : fail(
          'No illegal enum values',
          'validation',
          2.0,
          `${metrics.illegalEnumCount} illegal enum value(s)`,
          'major'
        )
  );

  // Gender completeness — load-bearing for prose pronoun-lock (§5).
  const genderPct = Math.round(metrics.genderCompleteness * 100);
  tests.push(
    metrics.genderCompleteness >= 1
      ? pass('Gender completeness', 'validation', 2.0, 'All characters have a legal gender')
      : metrics.genderCompleteness > 0
      ? partial(
          'Gender completeness',
          'validation',
          genderPct,
          2.0,
          `${genderPct}% of characters have a legal gender`,
          'major'
        )
      : fail('Gender completeness', 'validation', 2.0, 'No characters have a legal gender', 'critical')
  );

  return tests;
}

/**
 * Quality: distinctness (archetypeUniqueRatio) + graph health (≥1 high-tension edge,
 * no isolated nodes, no dangling names).
 */
function qualityTests(metrics: RealCastCheckMetrics): TestResult[] {
  const tests: TestResult[] = [];
  const graph = metrics.graph;

  // Distinctness — archetype-uniqueness ratio.
  const distinctPct = Math.round(metrics.archetypeUniqueRatio * 100);
  tests.push(
    metrics.archetypeUniqueRatio >= 0.7
      ? pass('Archetype distinctness', 'quality', 2.0, `${distinctPct}% distinct archetypes`)
      : partial(
          'Archetype distinctness',
          'quality',
          distinctPct,
          2.0,
          `Only ${distinctPct}% of archetypes are distinct (need 70%)`,
          'minor'
        )
  );

  // Graph health: every node has an edge.
  tests.push(
    graph.isolatedNodes.length === 0
      ? pass('No isolated nodes', 'quality', 1.5, 'Every character has at least one relationship')
      : partial(
          'No isolated nodes',
          'quality',
          graph.nodes > 0
            ? Math.round(((graph.nodes - graph.isolatedNodes.length) / graph.nodes) * 100)
            : 0,
          1.5,
          `${graph.isolatedNodes.length} isolated character(s): ${graph.isolatedNodes.join(', ')}`,
          'minor'
        )
  );

  // Graph health: at least one high-tension fault line.
  tests.push(
    graph.highTensionEdges >= 1
      ? pass('Has high-tension edge', 'quality', 1.5, `${graph.highTensionEdges} high-tension edge(s)`)
      : fail(
          'Has high-tension edge',
          'quality',
          1.5,
          'No relationship has high tension; the cast lacks a strong fault line',
          'minor'
        )
  );

  return tests;
}

/**
 * Completeness: count===expectedCount, every character has the required fields.
 */
function completenessTests(
  metrics: RealCastCheckMetrics,
  characters: RealCastCharacter[],
  expectedCount: number
): TestResult[] {
  const tests: TestResult[] = [];

  // Exact count match.
  tests.push(
    metrics.count === expectedCount
      ? pass('Cast count matches expected', 'completeness', 2.0, `${metrics.count}/${expectedCount}`)
      : partial(
          'Cast count matches expected',
          'completeness',
          expectedCount > 0 ? Math.round((Math.min(metrics.count, expectedCount) / expectedCount) * 100) : 0,
          2.0,
          `Got ${metrics.count} characters, expected ${expectedCount}`,
          'major'
        )
  );

  // Required-field completeness across the cast.
  let completeCharacters = 0;
  const incomplete: string[] = [];
  for (const char of characters) {
    const missing = REQUIRED_CHARACTER_FIELDS.filter((f) => !isNonEmpty(char[f]));
    if (missing.length === 0) {
      completeCharacters += 1;
    } else {
      incomplete.push(`${char?.name || 'Unnamed'} (${missing.join(', ')})`);
    }
  }
  const completePct = characters.length > 0 ? Math.round((completeCharacters / characters.length) * 100) : 0;
  tests.push(
    completeCharacters === characters.length && characters.length > 0
      ? pass('All characters have required fields', 'completeness', 2.0, 'Every character is fully specified')
      : partial(
          'All characters have required fields',
          'completeness',
          completePct,
          2.0,
          `${completePct}% of characters complete; missing: ${incomplete.slice(0, 3).join('; ')}`,
          'major'
        )
  );

  // Age-band and social-position spread (distinctness signals from §5).
  tests.push(
    metrics.ageBandSpread >= 2
      ? pass('Age-band spread', 'completeness', 0.5, `${metrics.ageBandSpread} distinct age bands`)
      : partial('Age-band spread', 'completeness', metrics.ageBandSpread * 50, 0.5, 'Limited age spread', 'minor')
  );
  tests.push(
    metrics.socialPositionSpread >= 2
      ? pass('Social-position spread', 'completeness', 0.5, `${metrics.socialPositionSpread} distinct positions`)
      : partial(
          'Social-position spread',
          'completeness',
          metrics.socialPositionSpread * 50,
          0.5,
          'Limited social-position spread',
          'minor'
        )
  );

  return tests;
}

/**
 * Consistency: the relationship graph references only real cast names (danglingNames
 * empty), and the graph is internally sane (has edges when there is more than one node).
 */
function consistencyTests(metrics: RealCastCheckMetrics, characters: RealCastCharacter[]): TestResult[] {
  const tests: TestResult[] = [];
  const graph = metrics.graph;

  // No dangling references — every edge endpoint is a real cast member.
  tests.push(
    graph.danglingNames.length === 0
      ? pass('Graph references only real cast names', 'consistency', 2.0)
      : fail(
          'Graph references only real cast names',
          'consistency',
          2.0,
          `${graph.danglingNames.length} relationship reference(s) to non-cast names: ${graph.danglingNames.join(', ')}`,
          'major'
        )
  );

  // A multi-character cast should actually be connected (have edges).
  if (characters.length > 1) {
    tests.push(
      graph.edges > 0
        ? pass('Relationship graph is populated', 'consistency', 1.0, `${graph.edges} edge(s)`)
        : fail(
            'Relationship graph is populated',
            'consistency',
            1.0,
            'Cast has more than one character but no relationships',
            'minor'
          )
    );
  }

  return tests;
}

function buildFailureReason(
  criticalFailures: TestResult[],
  componentFailures: string[]
): string {
  const parts: string[] = [];
  if (criticalFailures.length > 0) {
    parts.push(`${criticalFailures.length} critical failure(s)`);
  }
  if (componentFailures.length > 0) {
    parts.push(`Components below minimum: ${componentFailures.join(', ')}`);
  }
  return parts.join('; ') || 'Score below threshold';
}
