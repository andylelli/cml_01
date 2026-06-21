import { describe, expect, it } from 'vitest';
import {
  scoreRealCast,
  RealCastDesign,
  RealCastCharacter,
  RealCastCheckResult,
  RealCastCheckMetrics,
} from '../agent2-cast-real-scorer.js';

// ---------------------------------------------------------------------------
// Test helper: a minimal, faithful re-implementation of the @cml/prompts-llm
// `checkCast` metric computation, for the fields this scorer reads. Kept in the
// test (not imported) so the package stays free of the @cml/prompts-llm dep,
// exactly as the production caller would compute it and hand it in.
// ---------------------------------------------------------------------------

const MOTIVE_STRENGTHS = new Set(['weak', 'moderate', 'strong', 'compelling']);
const ACCESS = new Set(['impossible', 'unlikely', 'possible', 'easy']);
const GENDERS = new Set(['male', 'female', 'non-binary']);
const norm = (v: unknown): string =>
  typeof v === 'string' ? v.trim().toLowerCase().replace(/\s+/g, ' ') : '';
const isPlaceholder = (name: unknown): boolean =>
  /^placeholder(\s*\d+)?$/i.test(String(name ?? '').trim());

interface Edge {
  a: string;
  b: string;
  tension: string;
}

function extractEdges(cast: RealCastDesign): Edge[] {
  const rel = cast.relationships as { pairs?: Array<Record<string, unknown>> } | undefined;
  const pairs = Array.isArray(rel?.pairs) ? rel!.pairs! : [];
  const out: Edge[] = [];
  for (const p of pairs) {
    const a = String(p?.character1 ?? '').trim();
    const b = String(p?.character2 ?? '').trim();
    if (a && b) out.push({ a, b, tension: norm(p?.tension) });
  }
  return out;
}

function computeCheck(cast: RealCastDesign, expectedCount?: number): RealCastCheckResult {
  const characters = cast.characters ?? [];
  const castNames = characters.map((c) => String(c?.name ?? '').trim()).filter(Boolean);
  const castNameSet = new Set(castNames.map((n) => n.toLowerCase()));

  let placeholderCount = 0;
  let illegalEnumCount = 0;
  let genderedCount = 0;
  const ageBands = new Set<string>();
  const socialPositions = new Set<string>();

  for (const char of characters) {
    if (isPlaceholder(char?.name)) placeholderCount += 1;
    if (GENDERS.has(norm(char?.gender))) genderedCount += 1;
    if (char?.motiveStrength && !MOTIVE_STRENGTHS.has(norm(char.motiveStrength))) illegalEnumCount += 1;
    if (char?.accessPlausibility && !ACCESS.has(norm(char.accessPlausibility))) illegalEnumCount += 1;
    if (char?.ageRange) ageBands.add(norm(char.ageRange));
    if (char?.occupation) socialPositions.add(norm(char.occupation));
  }

  const archetypeKeys = characters.map((c) => norm(c?.roleArchetype)).filter(Boolean);
  const uniqueArchetypes = new Set(archetypeKeys).size;
  const archetypeUniqueRatio = archetypeKeys.length > 0 ? uniqueArchetypes / archetypeKeys.length : 0;

  const edges = extractEdges(cast);
  const incident = new Map<string, number>();
  castNames.forEach((n) => incident.set(n.toLowerCase(), 0));
  const danglingNames: string[] = [];
  let highTensionEdges = 0;
  for (const edge of edges) {
    if (edge.tension === 'high') highTensionEdges += 1;
    for (const endpoint of [edge.a, edge.b]) {
      const key = endpoint.toLowerCase();
      if (castNameSet.has(key)) incident.set(key, (incident.get(key) ?? 0) + 1);
      else if (!danglingNames.includes(endpoint)) danglingNames.push(endpoint);
    }
  }
  const isolatedNodes = castNames.filter((n) => (incident.get(n.toLowerCase()) ?? 0) === 0);

  const metrics: RealCastCheckMetrics = {
    count: characters.length,
    expectedCount: expectedCount ?? null,
    uniqueArchetypes,
    archetypeUniqueRatio,
    ageBandSpread: ageBands.size,
    socialPositionSpread: socialPositions.size,
    genderCompleteness: characters.length > 0 ? genderedCount / characters.length : 0,
    placeholderCount,
    illegalEnumCount,
    graph: { nodes: castNames.length, edges: edges.length, isolatedNodes, highTensionEdges, danglingNames },
  };

  const hasError =
    placeholderCount > 0 ||
    illegalEnumCount > 0 ||
    genderedCount < characters.length ||
    (expectedCount !== undefined && characters.length !== expectedCount);

  return { ok: !hasError, issues: [], metrics, feedback: [] };
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeCharacter(overrides: Partial<RealCastCharacter> & { name: string }): RealCastCharacter {
  return {
    ageRange: '40s',
    occupation: 'estate solicitor',
    roleArchetype: 'disgraced insider',
    publicPersona: 'A measured professional with quiet authority.',
    privateSecret: 'Buried a clause in the late lord\'s will.',
    motiveSeed: 'A forged codicil is about to be audited.',
    motiveStrength: 'strong',
    alibiWindow: 'left the drawing room at nine',
    accessPlausibility: 'easy',
    stakes: 'his entire career and freedom',
    gender: 'male',
    ...overrides,
  };
}

/** A clean, well-formed 4-person cast with a connected high-tension graph. */
function cleanCast(): RealCastDesign {
  const characters: RealCastCharacter[] = [
    makeCharacter({ name: 'Edmund Crale', roleArchetype: 'estate solicitor', gender: 'male', ageRange: '50s', occupation: 'solicitor' }),
    makeCharacter({ name: 'Vivienne Ashe', roleArchetype: 'grieving widow', gender: 'female', ageRange: '40s', occupation: 'heiress' }),
    makeCharacter({ name: 'Harriet Vole', roleArchetype: 'ambitious secretary', gender: 'female', ageRange: '20s', occupation: 'secretary' }),
    makeCharacter({ name: 'Thomas Beck', roleArchetype: 'retired inspector', gender: 'male', ageRange: '60s', occupation: 'investigator' }),
  ];
  const relationships = {
    pairs: [
      { character1: 'Edmund Crale', character2: 'Vivienne Ashe', relationship: 'professional', tension: 'high', sharedHistory: 'drafted her husband\'s will' },
      { character1: 'Vivienne Ashe', character2: 'Harriet Vole', relationship: 'employer', tension: 'moderate', sharedHistory: 'mistress and aide' },
      { character1: 'Harriet Vole', character2: 'Thomas Beck', relationship: 'acquaintance', tension: 'low', sharedHistory: 'met at the club' },
      { character1: 'Thomas Beck', character2: 'Edmund Crale', relationship: 'rivals', tension: 'moderate', sharedHistory: 'an old case' },
    ],
  };
  return { characters, relationships, diversity: { stereotypeCheck: [], recommendations: [] } };
}

describe('scoreRealCast', () => {
  it('scores a clean, well-formed cast high and passes', () => {
    const cast = cleanCast();
    const check = computeCheck(cast, 4);
    const score = scoreRealCast(cast, check, { expectedCount: 4 });

    expect(score.passed).toBe(true);
    expect(score.total).toBeGreaterThanOrEqual(80);
    expect(score.validation_score).toBe(100);
    expect(score.quality_score).toBe(100);
    expect(score.agent).toBe('agent2-cast');
    expect(Array.isArray(score.tests)).toBe(true);
    expect(score.tests.length).toBeGreaterThan(0);
  });

  it('penalises validation when a placeholder character is present', () => {
    const cast = cleanCast();
    cast.characters[2] = makeCharacter({ name: 'Placeholder 3', roleArchetype: 'unknown' });
    const check = computeCheck(cast, 4);
    const score = scoreRealCast(cast, check, { expectedCount: 4 });
    const clean = scoreRealCast(cleanCast(), computeCheck(cleanCast(), 4), { expectedCount: 4 });

    expect(score.validation_score).toBeLessThan(clean.validation_score);
    const placeholderTest = score.tests.find((t) => t.name === 'No placeholder characters');
    expect(placeholderTest?.passed).toBe(false);
    expect(placeholderTest?.severity).toBe('critical');
    // Critical placeholder failure must drag the overall result to failed.
    expect(score.passed).toBe(false);
  });

  it('penalises validation when a gender is missing', () => {
    const cast = cleanCast();
    delete cast.characters[1].gender;
    const check = computeCheck(cast, 4);
    const score = scoreRealCast(cast, check, { expectedCount: 4 });
    const clean = scoreRealCast(cleanCast(), computeCheck(cleanCast(), 4), { expectedCount: 4 });

    expect(score.validation_score).toBeLessThan(clean.validation_score);
    const genderTest = score.tests.find((t) => t.name === 'Gender completeness');
    // 3 of 4 gendered → 75% → degraded score, flagged 'major'.
    expect(genderTest?.score).toBeLessThan(100);
    expect(genderTest?.severity).toBe('major');
  });

  it('penalises quality when archetypes are duplicated', () => {
    const cast = cleanCast();
    // Make 3 of 4 share one archetype → ratio 0.5, below the 0.7 floor.
    cast.characters[0].roleArchetype = 'insider';
    cast.characters[1].roleArchetype = 'insider';
    cast.characters[2].roleArchetype = 'insider';
    const check = computeCheck(cast, 4);
    const score = scoreRealCast(cast, check, { expectedCount: 4 });
    const clean = scoreRealCast(cleanCast(), computeCheck(cleanCast(), 4), { expectedCount: 4 });

    expect(score.quality_score).toBeLessThan(clean.quality_score);
    const distinctTest = score.tests.find((t) => t.name === 'Archetype distinctness');
    expect(distinctTest?.passed).toBe(false);
  });

  it('penalises quality when a node is isolated', () => {
    const cast = cleanCast();
    // Remove every edge that touches Thomas Beck → he becomes isolated.
    (cast.relationships as { pairs: Array<Record<string, unknown>> }).pairs = (
      cast.relationships as { pairs: Array<Record<string, unknown>> }
    ).pairs.filter((p) => p.character1 !== 'Thomas Beck' && p.character2 !== 'Thomas Beck');
    const check = computeCheck(cast, 4);
    const score = scoreRealCast(cast, check, { expectedCount: 4 });
    const clean = scoreRealCast(cleanCast(), computeCheck(cleanCast(), 4), { expectedCount: 4 });

    expect(check.metrics.graph.isolatedNodes).toContain('Thomas Beck');
    expect(score.quality_score).toBeLessThan(clean.quality_score);
    const isolatedTest = score.tests.find((t) => t.name === 'No isolated nodes');
    // 1 of 4 isolated → degraded score below the clean 100.
    expect(isolatedTest?.score).toBeLessThan(100);
  });

  it('penalises consistency when an edge references a non-cast name', () => {
    const cast = cleanCast();
    (cast.relationships as { pairs: Array<Record<string, unknown>> }).pairs.push({
      character1: 'Edmund Crale',
      character2: 'Mr Nobody',
      relationship: 'unknown',
      tension: 'low',
      sharedHistory: 'phantom',
    });
    const check = computeCheck(cast, 4);
    const score = scoreRealCast(cast, check, { expectedCount: 4 });
    const clean = scoreRealCast(cleanCast(), computeCheck(cleanCast(), 4), { expectedCount: 4 });

    expect(check.metrics.graph.danglingNames).toContain('Mr Nobody');
    expect(score.consistency_score).toBeLessThan(clean.consistency_score);
    const danglingTest = score.tests.find((t) => t.name === 'Graph references only real cast names');
    expect(danglingTest?.passed).toBe(false);
  });

  it('penalises completeness when the count is wrong', () => {
    const cast = cleanCast();
    cast.characters.pop(); // 3 of expected 4
    const check = computeCheck(cast, 4);
    const score = scoreRealCast(cast, check, { expectedCount: 4 });

    const countTest = score.tests.find((t) => t.name === 'Cast count matches expected');
    // 3 of expected 4 → degraded score, flagged 'major'.
    expect(countTest?.score).toBeLessThan(100);
    expect(countTest?.severity).toBe('major');
    expect(score.completeness_score).toBeLessThan(100);
  });

  it('falls back to check.metrics.expectedCount when opts omitted', () => {
    const cast = cleanCast();
    const check = computeCheck(cast, 4);
    const score = scoreRealCast(cast, check);
    const countTest = score.tests.find((t) => t.name === 'Cast count matches expected');
    expect(countTest?.passed).toBe(true);
  });

  it('never throws on a degenerate (empty) cast', () => {
    const emptyCast: RealCastDesign = { characters: [] };
    const check = computeCheck(emptyCast, 4);
    expect(() => scoreRealCast(emptyCast, check, { expectedCount: 4 })).not.toThrow();
    const score = scoreRealCast(emptyCast, check, { expectedCount: 4 });
    expect(score.passed).toBe(false);
    expect(score.grade).toBe('F');
  });

  it('returns a PhaseScore-compatible shape with a letter grade', () => {
    const cast = cleanCast();
    const score = scoreRealCast(cast, computeCheck(cast, 4), { expectedCount: 4 });
    expect(score).toHaveProperty('validation_score');
    expect(score).toHaveProperty('quality_score');
    expect(score).toHaveProperty('completeness_score');
    expect(score).toHaveProperty('consistency_score');
    expect(score).toHaveProperty('total');
    expect(score).toHaveProperty('grade');
    expect(score).toHaveProperty('passed');
    expect(score).toHaveProperty('tests');
    expect(['A', 'B', 'C', 'D', 'F']).toContain(score.grade);
  });
});
