/**
 * Agent 2 — deterministic cast checker.
 *
 * Phase-0 foundation for the Agent 2 redesign
 * (documentation/12_system_redesign/02_agent_2_cast.md §9.2). This is the pure, no-LLM
 * verifier the redesign hinges on: it computes distinctness, graph health, gender/enum
 * completeness, and a count/placeholder assertion directly from a `CastDesign`, and emits
 * *targeted* retry-feedback strings.
 *
 * It is the deterministic replacement for two current mechanisms:
 *   - `diversifyRoleArchetypes` (post-hoc canned-label reassignment) — replaced by *measuring*
 *     archetype distinctness and asking the model to re-cast a specific duplicate.
 *   - the stereotype hard-gate (`throw` on a non-empty self-audit) — replaced by a deterministic
 *     "thinly drawn character" warn that feeds the retry instead of killing the run.
 *
 * Nothing here mutates the cast or calls an LLM. It only reports. (README thesis #2:
 * verify with a checker, not another LLM.)
 */

import type { CastDesign, CharacterProfile } from "./agent2-cast.js";

const MOTIVE_STRENGTHS = new Set(["weak", "moderate", "strong", "compelling"]);
const ACCESS_PLAUSIBILITIES = new Set(["impossible", "unlikely", "possible", "easy"]);
const TENSIONS = new Set(["none", "low", "moderate", "high"]);
const GENDERS = new Set(["male", "female", "non-binary"]);

/** Archetypes that are *supposed* to be unique/fixed and so are exempt from the duplicate penalty. */
const PROTECTED_ARCHETYPE = /(detective|investigator|inspector|sleuth|victim)/;

export type CastCheckSeverity = "error" | "warn";

export interface CastCheckIssue {
  /** Stable machine code, e.g. "placeholder_character", "duplicate_archetype". */
  code: string;
  severity: CastCheckSeverity;
  /** Character name this issue is about, when applicable. */
  character?: string;
  /** Human-readable description. */
  message: string;
  /** A single targeted instruction suitable for one structured-feedback retry. */
  feedback: string;
}

export interface CastGraphMetrics {
  nodes: number;
  edges: number;
  isolatedNodes: string[];
  highTensionEdges: number;
  /** Edge endpoints that do not match any cast member's name. */
  danglingNames: string[];
}

export interface CastCheckMetrics {
  count: number;
  expectedCount: number | null;
  uniqueArchetypes: number;
  /** unique archetypes / character count, across all characters. */
  archetypeUniqueRatio: number;
  ageBandSpread: number;
  socialPositionSpread: number;
  /** fraction of characters with a legal gender (0..1). */
  genderCompleteness: number;
  placeholderCount: number;
  illegalEnumCount: number;
  graph: CastGraphMetrics;
  /** K1: the resolved victim's name, or null when no victim is designated. */
  victimName: string | null;
  /** K1: true when the victim is neither a culprit-candidate nor the detective. */
  victimDistinct: boolean;
  /** K1: true when the victim has a relationship edge to at least one culprit-candidate. */
  victimTiedToSuspect: boolean;
}

export interface CastCheckResult {
  /** true when there are no error-severity issues. */
  ok: boolean;
  issues: CastCheckIssue[];
  metrics: CastCheckMetrics;
  /** De-duplicated targeted retry strings, error-severity first. */
  feedback: string[];
}

export interface CastCheckOptions {
  /** Expected character count. When set, a mismatch is an error. */
  expectedCount?: number;
  /** Minimum archetype-uniqueness ratio before a (warn) signal fires. Default 0.7. */
  minArchetypeUniqueRatio?: number;
  /** Below this length, a character's persona+secret reads as thinly drawn (warn). Default 12. */
  thinFieldThreshold?: number;
}

const norm = (v: unknown): string =>
  typeof v === "string" ? v.trim().toLowerCase().replace(/\s+/g, " ") : "";

const isPlaceholderName = (name: unknown): boolean =>
  /^placeholder(\s*\d+)?$/i.test(String(name ?? "").trim());

interface RelEdge {
  a: string;
  b: string;
  tension: string;
}

/** Read relationships from either the current `pairs` shape or the redesign's `edges` shape. */
function extractEdges(cast: CastDesign): RelEdge[] {
  const rel = cast.relationships as unknown as Record<string, unknown> | undefined;
  if (!rel || typeof rel !== "object") return [];

  const out: RelEdge[] = [];
  const pairs = Array.isArray(rel.pairs) ? (rel.pairs as Array<Record<string, unknown>>) : [];
  for (const p of pairs) {
    const a = String(p?.character1 ?? "").trim();
    const b = String(p?.character2 ?? "").trim();
    if (a && b) out.push({ a, b, tension: norm(p?.tension) });
  }
  const edges = Array.isArray(rel.edges) ? (rel.edges as Array<Record<string, unknown>>) : [];
  for (const e of edges) {
    const a = String(e?.a ?? "").trim();
    const b = String(e?.b ?? "").trim();
    if (a && b) out.push({ a, b, tension: norm(e?.tension) });
  }
  return out;
}

/**
 * Check a cast deterministically. Pure: never mutates `cast`, never calls an LLM, never throws.
 */
export function checkCast(cast: CastDesign, opts: CastCheckOptions = {}): CastCheckResult {
  const minRatio = opts.minArchetypeUniqueRatio ?? 0.7;
  const thinThreshold = opts.thinFieldThreshold ?? 12;
  const expectedCount = opts.expectedCount ?? null;

  const characters: CharacterProfile[] = Array.isArray(cast?.characters) ? cast.characters : [];
  const issues: CastCheckIssue[] = [];

  const castNames = characters.map((c) => String(c?.name ?? "").trim()).filter(Boolean);
  const castNameSet = new Set(castNames.map((n) => n.toLowerCase()));

  // --- count ---
  if (expectedCount !== null && characters.length !== expectedCount) {
    issues.push({
      code: "count_mismatch",
      severity: "error",
      message: `Expected ${expectedCount} characters, got ${characters.length}.`,
      feedback: `Return exactly ${expectedCount} characters (got ${characters.length}).`,
    });
  }

  // --- per-character: placeholder, gender, enums, thin character ---
  let placeholderCount = 0;
  let illegalEnumCount = 0;
  let genderedCount = 0;
  const ageBands = new Set<string>();
  const socialPositions = new Set<string>();

  characters.forEach((char, idx) => {
    const name = String(char?.name ?? "").trim() || `character ${idx + 1}`;

    if (isPlaceholderName(char?.name)) {
      placeholderCount += 1;
      issues.push({
        code: "placeholder_character",
        severity: "error",
        character: name,
        message: `Character ${idx + 1} is a placeholder ("${name}").`,
        feedback: `Replace placeholder character ${idx + 1} with a real, period-grounded suspect.`,
      });
    }

    const gender = norm(char?.gender);
    if (gender && GENDERS.has(gender)) {
      genderedCount += 1;
    } else {
      issues.push({
        code: "missing_gender",
        severity: "error",
        character: name,
        message: `${name} has no legal gender (got ${JSON.stringify(char?.gender)}).`,
        feedback: `Assign ${name} a gender of "male", "female", or "non-binary".`,
      });
    }

    const motive = norm(char?.motiveStrength);
    if (motive && !MOTIVE_STRENGTHS.has(motive)) {
      illegalEnumCount += 1;
      issues.push({
        code: "illegal_motive_strength",
        severity: "error",
        character: name,
        message: `${name} has illegal motiveStrength "${char?.motiveStrength}".`,
        feedback: `Set ${name}'s motiveStrength to one of weak|moderate|strong|compelling.`,
      });
    }

    const access = norm(char?.accessPlausibility);
    if (access && !ACCESS_PLAUSIBILITIES.has(access)) {
      illegalEnumCount += 1;
      issues.push({
        code: "illegal_access_plausibility",
        severity: "error",
        character: name,
        message: `${name} has illegal accessPlausibility "${char?.accessPlausibility}".`,
        feedback: `Set ${name}'s accessPlausibility to one of impossible|unlikely|possible|easy.`,
      });
    }

    const persona = String(char?.publicPersona ?? "").trim();
    const secret = String(char?.privateSecret ?? "").trim();
    if (persona.length < thinThreshold && secret.length < thinThreshold) {
      issues.push({
        code: "thinly_drawn_character",
        severity: "warn",
        character: name,
        message: `${name} is thinly drawn (publicPersona and privateSecret are both near-empty).`,
        feedback: `Give ${name} a specific publicPersona and a concrete privateSecret — not a one-word sketch.`,
      });
    }

    if (char?.ageRange) ageBands.add(norm(char.ageRange));
    if (char?.occupation) socialPositions.add(norm(char.occupation));
  });

  // --- archetype distinctness ---
  const archetypeKeys = characters
    .map((c) => norm(c?.roleArchetype))
    .filter(Boolean);
  const uniqueArchetypes = new Set(archetypeKeys).size;
  const archetypeUniqueRatio = archetypeKeys.length > 0 ? uniqueArchetypes / archetypeKeys.length : 0;

  // Surface every specific duplicate so the retry can re-cast exactly one of them, rather than
  // resending the whole prompt (the old `diversifyRoleArchetypes` slapped on canned labels).
  // Independent of the aggregate ratio: the redesign wants no two characters to share a primary
  // archetype, even when the cast still clears the 70% bar overall.
  const seen = new Map<string, string>(); // archetype key -> first character name
  for (const char of characters) {
    const key = norm(char?.roleArchetype);
    if (!key || PROTECTED_ARCHETYPE.test(key)) continue;
    const name = String(char?.name ?? "").trim() || "a character";
    const first = seen.get(key);
    if (first) {
      issues.push({
        code: "duplicate_archetype",
        severity: "warn",
        character: name,
        message: `${name} shares the archetype "${char?.roleArchetype}" with ${first}.`,
        feedback: `Re-cast ${name} to a distinct archetype (it duplicates ${first}'s "${char?.roleArchetype}").`,
      });
    } else {
      seen.set(key, name);
    }
  }

  // Aggregate low-diversity signal (the scorer's ≥70%-unique expectation).
  if (archetypeKeys.length > 0 && archetypeUniqueRatio < minRatio) {
    issues.push({
      code: "low_archetype_diversity",
      severity: "warn",
      message: `Only ${uniqueArchetypes}/${archetypeKeys.length} archetypes are distinct (below ${minRatio}).`,
      feedback: `Increase archetype diversity: only ${uniqueArchetypes} of ${archetypeKeys.length} characters have a distinct archetype.`,
    });
  }

  // --- relationship graph ---
  const edges = extractEdges(cast);
  const incident = new Map<string, number>();
  castNames.forEach((n) => incident.set(n.toLowerCase(), 0));
  const danglingNames: string[] = [];
  let highTensionEdges = 0;

  for (const edge of edges) {
    if (edge.tension === "high") highTensionEdges += 1;
    for (const endpoint of [edge.a, edge.b]) {
      const key = endpoint.toLowerCase();
      if (castNameSet.has(key)) {
        incident.set(key, (incident.get(key) ?? 0) + 1);
      } else if (!danglingNames.includes(endpoint)) {
        danglingNames.push(endpoint);
      }
    }
  }

  const isolatedNodes = castNames.filter((n) => (incident.get(n.toLowerCase()) ?? 0) === 0);
  for (const name of isolatedNodes) {
    issues.push({
      code: "isolated_node",
      severity: "warn",
      character: name,
      message: `${name} has no relationship edges.`,
      feedback: `Give ${name} at least one relationship with another cast member.`,
    });
  }
  for (const dangling of danglingNames) {
    issues.push({
      code: "edge_references_noncast_name",
      severity: "warn",
      message: `Relationship references "${dangling}", who is not in the cast.`,
      feedback: `Fix the relationship referencing "${dangling}" to point at a real cast member.`,
    });
  }
  if (edges.length > 0 && highTensionEdges === 0) {
    issues.push({
      code: "no_high_tension_edge",
      severity: "warn",
      message: "No relationship has high tension; the cast lacks a strong fault line.",
      feedback: "Make at least one relationship high-tension to give the mystery a fault line.",
    });
  }

  // --- victim (K1): first-class, named, distinct from detective/culprit/suspects ---
  // A fair-play mystery needs five distinct roles (victim + detective + culprit + >=2 suspects).
  // The victim must be a NAMED, profiled character tied to a culprit-candidate (the motive anchor),
  // never the detective and never one of the suspects. These are all warn-severity: a victim defect
  // feeds a retry/repair, it never errors the cast (repair-not-abort).
  const cd = (cast?.crimeDynamics ?? {}) as { possibleCulprits?: unknown; victimCandidates?: unknown };
  const possibleCulprits = Array.isArray(cd.possibleCulprits)
    ? cd.possibleCulprits.map((n) => String(n).trim()).filter(Boolean)
    : [];
  const culpritKeys = new Set(possibleCulprits.map((n) => n.toLowerCase()));
  const victimCandidates = Array.isArray(cd.victimCandidates)
    ? cd.victimCandidates.map((n) => String(n).trim()).filter(Boolean)
    : [];

  // A_52 role model: prefer the explicit `role` field over archetype inference.
  const roleOf = (c: CharacterProfile): string => norm((c as { role?: unknown })?.role);
  const detectiveChar =
    characters.find((c) => roleOf(c) === "detective" && String(c?.name ?? "").trim()) ??
    characters.find((c) => /(detective|investigator|inspector|sleuth)/.test(norm(c?.roleArchetype)));
  const detectiveName = detectiveChar ? String(detectiveChar.name ?? "").trim() : "";

  const victimByRole = characters.find((c) => roleOf(c) === "victim" && String(c?.name ?? "").trim());
  const victimByArchetype = characters.find((c) => /victim/.test(norm(c?.roleArchetype)) && String(c?.name ?? "").trim());
  const victimByCandidate = characters.find((c) =>
    victimCandidates.some((v) => v.toLowerCase() === String(c?.name ?? "").trim().toLowerCase()),
  );
  const victimChar = victimByRole ?? victimByArchetype ?? victimByCandidate ?? null;
  const victimName = victimChar ? String(victimChar.name ?? "").trim() : (victimCandidates[0] ?? null);

  // Role-count check (only when the explicit `role` field is in use): exactly one detective, one victim.
  const rolesPresent = characters.some((c) => roleOf(c).length > 0);
  if (rolesPresent) {
    const detectiveCount = characters.filter((c) => roleOf(c) === "detective").length;
    const victimRoleCount = characters.filter((c) => roleOf(c) === "victim").length;
    if (detectiveCount !== 1) {
      issues.push({
        code: "role_count_detective",
        severity: "warn",
        message: `Expected exactly one character with role "detective"; got ${detectiveCount}.`,
        feedback: 'Tag exactly ONE character with role "detective".',
      });
    }
    if (victimRoleCount !== 1) {
      issues.push({
        code: "role_count_victim",
        severity: "warn",
        message: `Expected exactly one character with role "victim"; got ${victimRoleCount}.`,
        feedback: 'Tag exactly ONE character with role "victim".',
      });
    }
  }

  let victimDistinct = false;
  let victimTiedToSuspect = false;

  if (!victimName) {
    issues.push({
      code: "missing_victim",
      severity: "warn",
      message: 'No character is designated as the victim (no "victim" archetype and no crimeDynamics.victimCandidates).',
      feedback:
        'Designate exactly one character as the victim: roleArchetype "victim", named in crimeDynamics.victimCandidates, distinct from the detective and from possibleCulprits.',
    });
  } else {
    const vk = victimName.toLowerCase();
    const victimIsCulprit = culpritKeys.has(vk);
    const victimIsDetective = Boolean(detectiveName) && vk === detectiveName.toLowerCase();
    victimDistinct = !victimIsCulprit && !victimIsDetective;

    if (victimIsCulprit) {
      issues.push({
        code: "victim_is_suspect",
        severity: "warn",
        character: victimName,
        message: `The victim ${victimName} also appears in possibleCulprits.`,
        feedback: `Remove the victim ${victimName} from possibleCulprits — the victim cannot also be a suspect.`,
      });
    }
    if (victimIsDetective) {
      issues.push({
        code: "victim_is_detective",
        severity: "warn",
        character: victimName,
        message: `The victim ${victimName} is also the detective.`,
        feedback: "The victim and the detective must be different characters; reassign one role.",
      });
    }
    if (victimChar) {
      const vp = String((victimChar as CharacterProfile).publicPersona ?? "").trim();
      const vs = String((victimChar as CharacterProfile).privateSecret ?? "").trim();
      if (vp.length < thinThreshold && vs.length < thinThreshold) {
        issues.push({
          code: "victim_thinly_drawn",
          severity: "warn",
          character: victimName,
          message: `The victim ${victimName} is thinly drawn — their death will not carry weight.`,
          feedback: `Give the victim ${victimName} a concrete publicPersona and privateSecret so the loss matters and the motive is specific.`,
        });
      }
    }

    victimTiedToSuspect = edges.some((e) => {
      const a = e.a.toLowerCase();
      const b = e.b.toLowerCase();
      return (a === vk && culpritKeys.has(b)) || (b === vk && culpritKeys.has(a));
    });
    if (possibleCulprits.length > 0 && !victimTiedToSuspect) {
      issues.push({
        code: "victim_not_tied_to_suspect",
        severity: "warn",
        character: victimName,
        message: `The victim ${victimName} has no relationship with any culprit-candidate — the motive has no anchor.`,
        feedback: `Add a high-tension relationship between the victim ${victimName} and at least one possibleCulprit (the motive anchor).`,
      });
    }
  }

  const metrics: CastCheckMetrics = {
    count: characters.length,
    expectedCount,
    uniqueArchetypes,
    archetypeUniqueRatio,
    ageBandSpread: ageBands.size,
    socialPositionSpread: socialPositions.size,
    genderCompleteness: characters.length > 0 ? genderedCount / characters.length : 0,
    placeholderCount,
    illegalEnumCount,
    graph: {
      nodes: castNames.length,
      edges: edges.length,
      isolatedNodes,
      highTensionEdges,
      danglingNames,
    },
    victimName,
    victimDistinct,
    victimTiedToSuspect,
  };

  // Errors first, then warns; de-duplicate identical feedback strings.
  const ordered = [...issues].sort((a, b) => {
    if (a.severity === b.severity) return 0;
    return a.severity === "error" ? -1 : 1;
  });
  const feedback: string[] = [];
  for (const issue of ordered) {
    if (!feedback.includes(issue.feedback)) feedback.push(issue.feedback);
  }

  return {
    ok: !issues.some((i) => i.severity === "error"),
    issues,
    metrics,
    feedback,
  };
}

/** One-line human summary for shadow-mode logging. */
export function summarizeCastCheck(result: CastCheckResult): string {
  const m = result.metrics;
  const errors = result.issues.filter((i) => i.severity === "error").length;
  const warns = result.issues.filter((i) => i.severity === "warn").length;
  return (
    `ok=${result.ok} errors=${errors} warns=${warns} ` +
    `count=${m.count}${m.expectedCount !== null ? `/${m.expectedCount}` : ""} ` +
    `archetypeUniq=${m.archetypeUniqueRatio.toFixed(2)} genderComplete=${m.genderCompleteness.toFixed(2)} ` +
    `placeholders=${m.placeholderCount} illegalEnums=${m.illegalEnumCount} ` +
    `isolated=${m.graph.isolatedNodes.length} highTension=${m.graph.highTensionEdges} dangling=${m.graph.danglingNames.length} ` +
    `victim=${m.victimName ?? "none"} victimDistinct=${m.victimDistinct} victimTied=${m.victimTiedToSuspect}`
  );
}
