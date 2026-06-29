/**
 * Agent 2: Cast & Motive Designer
 *
 * Extracted from mystery-orchestrator.ts. Runs designCast(), handles
 * scoring-path retry and schema-repair retry, and writes ctx.cast.
 */

import {
  designCast,
  generateCastNames,
  checkCast,
  summarizeCastCheck,
  type NameGeneratorContext,
  type CastCheckResult,
} from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { CastDesignScorer, scoreRealCast } from "@cml/story-validation";
import { adaptCastForScoring } from "../scoring-adapters/index.js";
import {
  type OrchestratorContext,
  executeAgentWithRetry,
  appendRetryFeedback,
  preAgent9LlmRetriesEnabled,
  preAgent9ContractRecoveryEnabled,
  applyHonestScorer,
} from "./shared.js";
import { isDetectiveArchetype } from "./identity-match.js";

// A_53 P10 (infer-gender-sets-rebuilt-per-call): these high-confidence name→gender lists and the
// feminine-suffix heuristic are constant data, so hoist them to module scope. Previously two
// ~30-element Sets + the suffix regex were rebuilt for every gender-less character (×the retry
// path); at module scope they are built exactly once per process.
const FEMALE_NAMES = new Set([
  "mary", "margaret", "clara", "vivienne", "geraldine", "evelyn", "agnes", "edith",
  "florence", "dorothy", "alice", "beatrice", "constance", "eleanor", "harriet",
  "ada", "cecilia", "rose", "violet", "lillian", "grace", "ruth", "helen", "jane",
  "elizabeth", "catherine", "anne", "anna", "emma", "charlotte", "louisa", "ethel",
]);
const MALE_NAMES = new Set([
  "harold", "james", "thomas", "edward", "arthur", "richard", "william", "henry",
  "charles", "george", "frederick", "albert", "walter", "ernest", "herbert", "alfred",
  "john", "robert", "samuel", "francis", "hugh", "reginald", "percy", "cecil", "rupert",
]);
// Classic feminine suffixes (-a / -ine / -ette …) are reliable enough for a fallback.
const FEMININE_SUFFIX_RE = /(?:a|ine|ette|elle|een|ina)$/;

// A_53 P10 (checkcast-recomputed-multiple-times): `checkCast` (archetype maps + relationship-graph
// walk) was run 2–3× over the SAME cast object (scorer honest-fallback + shadow logger). Memoize by
// cast-object identity + expectedCount via a WeakMap so each distinct cast is checked at most once;
// the result is identical and the entry is GC'd with the cast. Generic/holistic — no story data.
const castCheckCache = new WeakMap<object, Map<number, CastCheckResult>>();
function checkCastMemo(
  cast: Parameters<typeof checkCast>[0],
  opts: { expectedCount: number },
): CastCheckResult {
  const key = (cast as unknown as object) ?? null;
  if (!key || typeof key !== "object") {
    return checkCast(cast, opts);
  }
  let byCount = castCheckCache.get(key);
  if (!byCount) {
    byCount = new Map<number, CastCheckResult>();
    castCheckCache.set(key, byCount);
  }
  const cached = byCount.get(opts.expectedCount);
  if (cached) return cached;
  const result = checkCast(cast, opts);
  byCount.set(opts.expectedCount, result);
  return result;
}

/**
 * Normalise common LLM field-name variants in a raw cast artifact.
 * Handles snake_case crimeDynamics keys, missing required array fields,
 * and relationships returned as a bare array instead of { pairs: [...] }.
 * Mutates the object in place — call before validateArtifact.
 * Any deterministic repairs (e.g. the K1 victim invariant) are surfaced on `warnings`.
 */
function normaliseCastOutput(castRaw: Record<string, unknown>, warnings: string[] = []): void {
  // --- crimeDynamics: snake_case → camelCase ---
  const cd = ((castRaw.crimeDynamics ?? {}) as Record<string, unknown>);
  if (!cd.possibleCulprits && cd.possible_culprits)         { cd.possibleCulprits = cd.possible_culprits; }
  if (!cd.redHerrings && cd.red_herrings)                   { cd.redHerrings = cd.red_herrings; }
  if (!cd.victimCandidates && cd.victim_candidates)         { cd.victimCandidates = cd.victim_candidates; }
  if (!cd.detectiveCandidates && cd.detective_candidates)   { cd.detectiveCandidates = cd.detective_candidates; }

  // --- crimeDynamics: ensure all required arrays are present, deriving from characters if needed ---
  const characters = Array.isArray(castRaw.characters)
    ? (castRaw.characters as Array<Record<string, unknown>>)
    : [];

  // --- characters: coerce enum-like fields to valid schema values ---
  // Prevent deterministic-mode schema aborts for near-miss enum values.
  const normaliseMotiveStrength = (value: unknown): "weak" | "moderate" | "strong" | "compelling" => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (raw === "weak" || raw === "moderate" || raw === "strong" || raw === "compelling") {
      return raw;
    }
    if (/compell|overwhelm|extreme|decisive|certain/.test(raw)) return "compelling";
    if (/strong|high|powerful|major|serious/.test(raw)) return "strong";
    if (/moderate|medium|mixed|balanced/.test(raw)) return "moderate";
    if (/weak|low|minor|slight|none|n\/a|na|unknown|unclear/.test(raw)) return "weak";
    return "moderate";
  };

  const normaliseAccessPlausibility = (value: unknown): "impossible" | "unlikely" | "possible" | "easy" => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (raw === "impossible" || raw === "unlikely" || raw === "possible" || raw === "easy") {
      return raw;
    }
    if (/certain|definite|guarant|easy|high|sure/.test(raw)) return "easy";
    if (/like|probable|often|common|frequent/.test(raw)) return "possible";
    if (/unlike|improbab|rare|seldom|difficult|hard/.test(raw)) return "unlikely";
    if (/impossible|never|no.access|barred/.test(raw)) return "impossible";
    return "possible";
  };

  const normaliseGender = (value: unknown): "male" | "female" | "non-binary" | undefined => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (!raw) return undefined;
    if (raw === "male" || raw === "female" || raw === "non-binary") return raw;
    if (/^m(ale)?$|^man$|^boy$/.test(raw)) return "male";
    if (/^f(emale)?$|^woman$|^girl$/.test(raw)) return "female";
    if (/non[-\s]?binary|\benby\b|^nb$/.test(raw)) return "non-binary";
    return undefined;
  };

  // FIX 4: name-based gender inference, used only as a fallback when the LLM omits
  // gender. Conservative: a small high-confidence list + classic suffix heuristics for
  // the Golden Age (1920s–1950s) name space this generator targets. Returns undefined
  // when uncertain so the caller can fall back to deterministic alternation.
  const inferGenderFromName = (name: string): "male" | "female" | undefined => {
    const first = name.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
    if (!first) return undefined;
    // A_53 P10 (infer-gender-sets-rebuilt-per-call): reference the module-scope constants
    // instead of rebuilding the Sets/regex on every call.
    if (FEMALE_NAMES.has(first)) return "female";
    if (MALE_NAMES.has(first)) return "male";
    if (FEMININE_SUFFIX_RE.test(first)) return "female";
    return undefined;
  };

  const normaliseRelationshipTension = (value: unknown): "none" | "low" | "moderate" | "high" => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (raw === "none" || raw === "low" || raw === "moderate" || raw === "high") {
      return raw;
    }
    if (/none|no\s*tension|neutral|calm/.test(raw)) return "none";
    if (/low|mild|minor|slight/.test(raw)) return "low";
    if (/moderate|medium|mixed/.test(raw)) return "moderate";
    if (/high|severe|intense|strong/.test(raw)) return "high";
    return "moderate";
  };

  for (const character of characters) {
    if (character.motiveStrength === undefined && character.motive_strength !== undefined) {
      character.motiveStrength = character.motive_strength;
    }
    if (character.accessPlausibility === undefined && character.access_plausibility !== undefined) {
      character.accessPlausibility = character.access_plausibility;
    }
    character.motiveStrength = normaliseMotiveStrength(character.motiveStrength);
    character.accessPlausibility = normaliseAccessPlausibility(character.accessPlausibility);
  }

  // FIX 4: Guarantee every character has a gender. The Agent 9 prose pronoun-lock builds
  // its table from `characters.filter(c => c.gender)`, so any character missing gender was
  // silently excluded and the model defaulted to "he" — the root cause of women being
  // narrated with male pronouns. Resolve in order: declared → inferred-from-name →
  // deterministic alternation, so the field is never empty when it reaches prose.
  characters.forEach((character, idx) => {
    const declared = normaliseGender(character.gender);
    if (declared) {
      character.gender = declared;
      return;
    }
    character.gender =
      inferGenderFromName(String(character.name ?? "")) ?? (idx % 2 === 0 ? "female" : "male");
  });

  // A_52 role model: identify the detective by the explicit `role` field first, then the archetype
  // regex — NOT an exact "detective" archetype match (which missed a detective labelled e.g.
  // "Authority Figure" and let them leak into the culprit/victim fallbacks).
  // A_53 P4 (Pattern D): prefer the explicit role, then the detectiveCandidates roster, then a
  // word-boundary archetype test that excludes non-police "building inspector"-style occupations.
  const detectiveCandidateSet = new Set(
    (Array.isArray(cd.detectiveCandidates) ? (cd.detectiveCandidates as unknown[]) : [])
      .map((n) => String(n ?? "").trim().toLowerCase())
      .filter(Boolean),
  );
  const looksDetective = (c: Record<string, unknown>): boolean =>
    String((c as Record<string, unknown>).role ?? "").trim().toLowerCase() === "detective" ||
    detectiveCandidateSet.has(String(c.name ?? "").trim().toLowerCase()) ||
    isDetectiveArchetype(String(c.roleArchetype ?? ""));
  const nonDetectiveNames = characters
    .filter((c) => !looksDetective(c) && c.name)
    .map((c) => String(c.name));
  const detectiveNames = characters
    .filter((c) => looksDetective(c) && c.name)
    .map((c) => String(c.name));
  if (!Array.isArray(cd.possibleCulprits) || (cd.possibleCulprits as unknown[]).length === 0) {
    cd.possibleCulprits = nonDetectiveNames.slice(0, Math.min(3, nonDetectiveNames.length));
  }
  if (!Array.isArray(cd.redHerrings)) {
    cd.redHerrings = [];
  }
  if (!Array.isArray(cd.victimCandidates) || (cd.victimCandidates as unknown[]).length === 0) {
    cd.victimCandidates = nonDetectiveNames.slice(0, 1);
  }
  if (!Array.isArray(cd.detectiveCandidates) || (cd.detectiveCandidates as unknown[]).length === 0) {
    cd.detectiveCandidates = detectiveNames.length > 0 ? detectiveNames : nonDetectiveNames.slice(0, 1);
  }
  castRaw.crimeDynamics = cd;

  // --- relationships: normalise to { pairs: [...] } if LLM returned a bare array ---
  const rels = castRaw.relationships;
  if (Array.isArray(rels)) {
    castRaw.relationships = { pairs: rels };
  } else if (rels !== null && typeof rels === "object") {
    const relObj = rels as Record<string, unknown>;
    if (!Array.isArray(relObj.pairs) && Array.isArray((relObj as any).characters)) {
      relObj.pairs = (relObj as any).characters;
    } else if (!Array.isArray(relObj.pairs)) {
      relObj.pairs = [];
    }
  }

  const extractedCharacterPairs: Array<Record<string, unknown>> = [];
  const pushExtractedPair = (character1: string, rawPair: Record<string, unknown>): void => {
    const source = character1.trim();
    const character2 = String(
      rawPair.character2
      ?? rawPair.with
      ?? rawPair.target
      ?? rawPair.character
      ?? rawPair.name
      ?? "",
    ).trim();
    if (!source || !character2 || source === character2) {
      return;
    }
    extractedCharacterPairs.push({
      character1: source,
      character2,
      relationship: String(rawPair.relationship ?? rawPair.relation ?? rawPair.type ?? "social acquaintance").trim() || "social acquaintance",
      tension: normaliseRelationshipTension(rawPair.tension),
      sharedHistory: String(
        rawPair.sharedHistory
        ?? rawPair.shared_history
        ?? rawPair.history
        ?? `${source} and ${character2} have unresolved social friction tied to the case.`,
      ).trim() || `${source} and ${character2} have unresolved social friction tied to the case.`,
    });
  };

  // Some LLM outputs nest `relationships` under each character, which is not part of the
  // schema contract. Lift these links into top-level relationships.pairs and strip the
  // nested field so schema validation and scoring read a single canonical relationship map.
  for (const character of characters) {
    const characterName = String(character.name ?? "").trim();
    const nestedRelationships = (character as Record<string, unknown>).relationships;
    if (Array.isArray(nestedRelationships)) {
      for (const entry of nestedRelationships) {
        if (entry && typeof entry === "object") {
          pushExtractedPair(characterName, entry as Record<string, unknown>);
        }
      }
    } else if (nestedRelationships && typeof nestedRelationships === "object") {
      const nested = nestedRelationships as Record<string, unknown>;
      if (Array.isArray(nested.pairs)) {
        for (const entry of nested.pairs) {
          if (entry && typeof entry === "object") {
            pushExtractedPair(characterName, entry as Record<string, unknown>);
          }
        }
      } else {
        for (const [target, relationValue] of Object.entries(nested)) {
          if (relationValue && typeof relationValue === "object") {
            const relationObj = relationValue as Record<string, unknown>;
            pushExtractedPair(characterName, {
              ...relationObj,
              character2: relationObj.character2 ?? target,
            });
          } else if (typeof relationValue === "string") {
            pushExtractedPair(characterName, {
              character2: target,
              relationship: relationValue,
            });
          }
        }
      }
    }
    delete (character as Record<string, unknown>).relationships;
  }

  const castNames = characters
    .map((c) => String(c.name ?? "").trim())
    .filter((name) => name.length > 0);
  // A_53 P10 (cast-names-stringified-repeatedly): build one lowercased Set of cast names so the
  // relationship-merge below uses O(1) `.has` membership instead of O(pairs×cast) `Array.includes`.
  const castNameKeys = new Set(castNames.map((name) => name.toLowerCase()));

  const relationshipContainer =
    castRaw.relationships !== null && typeof castRaw.relationships === "object"
      ? (castRaw.relationships as Record<string, unknown>)
      : ((castRaw.relationships = {}) as Record<string, unknown>);

  const existingPairsRaw = Array.isArray(relationshipContainer.pairs)
    ? (relationshipContainer.pairs as Array<Record<string, unknown>>)
    : [];
  const mergedPairCandidates = [...existingPairsRaw, ...extractedCharacterPairs]
    .filter((pair): pair is Record<string, unknown> => Boolean(pair) && typeof pair === "object")
    .map((pair) => {
      const character1 = String(pair.character1 ?? "").trim();
      const character2 = String(pair.character2 ?? "").trim();
      return {
        ...pair,
        character1,
        character2,
        relationship: String(pair.relationship ?? "social acquaintance").trim() || "social acquaintance",
        tension: normaliseRelationshipTension(pair.tension),
        sharedHistory: String(pair.sharedHistory ?? "").trim()
          || `${character1} and ${character2} have unresolved social friction tied to the case.`,
      };
    })
    .filter((pair) => pair.character1.length > 0 && pair.character2.length > 0 && pair.character1 !== pair.character2);

  const seenPairKeys = new Set<string>();
  const existingPairs: Array<Record<string, unknown>> = [];
  for (const pair of mergedPairCandidates) {
    const key = `${String(pair.character1).toLowerCase()}::${String(pair.character2).toLowerCase()}::${String(pair.relationship).toLowerCase()}`;
    if (seenPairKeys.has(key)) continue;
    seenPairKeys.add(key);
    existingPairs.push(pair);
  }
  relationshipContainer.pairs = existingPairs;

  const hasCastReferencedRelationship = existingPairs.some((pair) => {
    const c1 = String(pair.character1 ?? "").trim();
    const c2 = String(pair.character2 ?? "").trim();
    // A_53 P10 (cast-names-stringified-repeatedly): `.has` against the prebuilt lowercased Set.
    return castNameKeys.has(c1.toLowerCase()) && castNameKeys.has(c2.toLowerCase()) && c1 !== c2;
  });

  if (castNames.length >= 2 && (!hasCastReferencedRelationship || existingPairs.length === 0)) {
    const fallbackPairs: Array<{
      character1: string;
      character2: string;
      relationship: string;
      tension: "none" | "low" | "moderate" | "high";
      sharedHistory: string;
    }> = [];

    // Ring topology guarantees each character gets at least two references when cast size >= 3.
    for (let i = 0; i < castNames.length; i += 1) {
      const character1 = castNames[i];
      const character2 = castNames[(i + 1) % castNames.length];
      if (character1 === character2) continue;
      fallbackPairs.push({
        character1,
        character2,
        relationship: "social acquaintance",
        tension: "moderate",
        sharedHistory: "They have ongoing social friction connected to the case environment.",
      });
    }

    // For two-character edge cases, add reverse edge so density is >= 2 per character.
    if (castNames.length === 2) {
      fallbackPairs.push({
        character1: castNames[1],
        character2: castNames[0],
        relationship: "social acquaintance",
        tension: "moderate",
        sharedHistory: "They have ongoing social friction connected to the case environment.",
      });
    }

    relationshipContainer.pairs = fallbackPairs;
  }

  // --- K1: enforce the first-class victim invariant (deterministic, repair-not-abort) ---
  // Runs after possibleCulprits and relationships are settled so it can both fix
  // crimeDynamics and synthesise the missing motive-anchor edge.
  enforceVictimRoleInvariant(castRaw, warnings);

  // --- diversity: coerce string fields to string[] ---
  // gpt-4.1-mini returns a single string for recommendations/stereotypeCheck when
  // it has one unified thought. The schema requires string[]; wrap rather than abort.
  const div = castRaw.diversity;
  if (div !== null && typeof div === 'object') {
    const divObj = div as Record<string, unknown>;
    if (typeof divObj.recommendations === 'string') {
      divObj.recommendations = divObj.recommendations ? [divObj.recommendations] : [];
    } else if (!Array.isArray(divObj.recommendations)) {
      divObj.recommendations = [];
    }
    if (typeof divObj.stereotypeCheck === 'string') {
      divObj.stereotypeCheck = divObj.stereotypeCheck ? [divObj.stereotypeCheck] : [];
    } else if (!Array.isArray(divObj.stereotypeCheck)) {
      divObj.stereotypeCheck = [];
    }
  } else {
    // A_53 P2 (crash guard): the LLM omitted `diversity` entirely — default the shape so downstream
    // (cast.cast.diversity.stereotypeCheck) can never raw-TypeError before the schema-repair seam runs.
    castRaw.diversity = { stereotypeCheck: [], recommendations: [] };
  }
}

/**
 * A_52 role model (was K1, ANALYSIS_51 §1) — guarantee the fair-play cast structure:
 * exactly one DETECTIVE (alive throughout) and one first-class NAMED VICTIM (dead from the
 * murder on), with the remaining characters as suspects (the culprit is a hidden attribute of
 * one suspect, assigned downstream — never a role here). This is the root fix for both the
 * "phantom victim" and the "victim is dead AND alive" failure class.
 *
 * Deterministic and repair-not-abort (per MEMORY: a role defect must repair, never throw). It
 * (1) resolves the detective from the explicit `role` field → crimeDynamics.detectiveCandidates
 * → archetype regex (so a detective labelled e.g. "Authority Figure" is no longer missed and the
 * detective can never be designated victim); (2) resolves the victim from the explicit `role` →
 * victim archetype → victimCandidates → first non-detective non-culprit; (3) locks the victim's
 * archetype, (4) removes the victim from possibleCulprits (topping the pool back up), (5) pins
 * crimeDynamics.victimCandidates, (6) synthesises the motive-anchor relationship when missing,
 * and (7) tags every character's `role` (detective | victim | suspect) so downstream consumers
 * and the lifecycle lock read a fixed role instead of inferring it. Repairs surface on `warnings`.
 *
 * Exported for unit testing.
 */
export function enforceVictimRoleInvariant(
  castRaw: Record<string, unknown>,
  warnings: string[] = [],
): void {
  const characters = Array.isArray(castRaw.characters)
    ? (castRaw.characters as Array<Record<string, unknown>>)
    : [];
  // Too small to host the distinct roles — leave it to checkCast to flag (don't fabricate).
  if (characters.length < 3) return;

  const cd = (castRaw.crimeDynamics ?? (castRaw.crimeDynamics = {})) as Record<string, unknown>;
  const nameOf = (c: Record<string, unknown>): string => String(c?.name ?? "").trim();
  const archetypeOf = (c: Record<string, unknown>): string => String(c?.roleArchetype ?? "").toLowerCase();
  const roleOf = (c: Record<string, unknown>): string => String(c?.role ?? "").trim().toLowerCase();
  // A_53 P4 (Pattern D): word-boundary archetype test that excludes non-police "building inspector".
  const archetypeDetective = (c: Record<string, unknown>): boolean =>
    isDetectiveArchetype(archetypeOf(c));

  const detectiveCandidateKeys = Array.isArray(cd.detectiveCandidates)
    ? (cd.detectiveCandidates as unknown[]).map((n) => String(n).trim().toLowerCase()).filter(Boolean)
    : [];
  const possibleCulprits = Array.isArray(cd.possibleCulprits)
    ? (cd.possibleCulprits as unknown[]).map((n) => String(n).trim()).filter(Boolean)
    : [];
  const culpritKeys = new Set(possibleCulprits.map((n) => n.toLowerCase()));
  const victimCandidates = Array.isArray(cd.victimCandidates)
    ? (cd.victimCandidates as unknown[]).map((n) => String(n).trim()).filter(Boolean)
    : [];

  // A_53 P10 (enforce-victim-redundant-name-scans): build a single lowerName→char Map (and the
  // matching detectiveCandidate Set) once, so the resolution/repair steps below do O(1) membership
  // instead of re-lowercasing the whole cast on every chained `.find`/`.filter`/`.map(nameOf)`.
  const byKey = new Map<string, Record<string, unknown>>();
  for (const c of characters) {
    const k = nameOf(c).toLowerCase();
    if (k && !byKey.has(k)) byKey.set(k, c);
  }
  const detectiveCandidateKeySet = new Set(detectiveCandidateKeys);

  // 0. Resolve THE detective (single) — explicit role → detectiveCandidates → archetype regex.
  const detective =
    characters.find((c) => roleOf(c) === "detective" && nameOf(c)) ??
    characters.find((c) => nameOf(c) && detectiveCandidateKeySet.has(nameOf(c).toLowerCase())) ??
    characters.find((c) => archetypeDetective(c) && nameOf(c));
  const detectiveKey = detective ? nameOf(detective).toLowerCase() : "";

  // 1. Resolve the victim — explicit role → victim archetype → victimCandidates → first
  //    non-detective non-culprit. The detective is excluded deterministically (no regex guessing).
  // A_53 P10 (enforce-victim-redundant-name-scans): victimCandidates as a Set for O(1) membership.
  const victimCandidateKeys = new Set(victimCandidates.map((v) => v.toLowerCase()));
  const victim =
    characters.find((c) => roleOf(c) === "victim" && nameOf(c) && nameOf(c).toLowerCase() !== detectiveKey) ??
    characters.find((c) => /victim/.test(archetypeOf(c)) && nameOf(c) && nameOf(c).toLowerCase() !== detectiveKey) ??
    characters.find((c) => nameOf(c) && nameOf(c).toLowerCase() !== detectiveKey && victimCandidateKeys.has(nameOf(c).toLowerCase())) ??
    characters.find((c) => {
      const k = nameOf(c).toLowerCase();
      return k && k !== detectiveKey && !culpritKeys.has(k);
    }) ??
    characters.find((c) => nameOf(c) && nameOf(c).toLowerCase() !== detectiveKey);

  if (!victim || !nameOf(victim)) {
    warnings.push(
      "[agent2-victim][repair] no eligible victim could be assigned (cast lacks a non-detective character) — grow the cast.",
    );
    return;
  }
  const victimName = nameOf(victim);
  const victimKey = victimName.toLowerCase();
  const detectiveNames = new Set(detectiveKey ? [detectiveKey] : []);

  // 2. Lock the victim archetype so the role is first-class downstream.
  if (!/victim/.test(archetypeOf(victim))) {
    const prior = String(victim.roleArchetype ?? "").trim();
    victim.roleArchetype = "victim";
    warnings.push(`[agent2-victim][repair] designated ${victimName} as the named victim (was "${prior || "unset"}").`);
  }

  // 3. The victim cannot be a suspect — remove from possibleCulprits and top the pool back up.
  if (culpritKeys.has(victimKey)) {
    const remaining = possibleCulprits.filter((n) => n.toLowerCase() !== victimKey);
    // A_53 P10 (enforce-victim-redundant-name-scans): iterate the prebuilt Map and dedup with a
    // single Set instead of `characters.map(nameOf)` + the O(n²) `merged.some(...)` scan.
    const eligible: string[] = [];
    for (const [k, c] of byKey) {
      if (k !== victimKey && !detectiveNames.has(k)) eligible.push(nameOf(c));
    }
    const merged: string[] = [];
    const mergedKeys = new Set<string>();
    for (const n of [...remaining, ...eligible]) {
      const k = n.toLowerCase();
      if (!mergedKeys.has(k)) { mergedKeys.add(k); merged.push(n); }
    }
    cd.possibleCulprits = merged.slice(0, Math.max(remaining.length, Math.min(3, merged.length)));
    warnings.push(
      `[agent2-victim][repair] removed the victim ${victimName} from possibleCulprits (a victim cannot also be a suspect).`,
    );
  }

  // 4. Pin victimCandidates to the single resolved victim.
  if (victimCandidates.length !== 1 || victimCandidates[0]?.toLowerCase() !== victimKey) {
    cd.victimCandidates = [victimName];
  }

  // 5. Motive anchor — ensure a victim↔culprit-candidate relationship exists.
  const culprits = Array.isArray(cd.possibleCulprits)
    ? (cd.possibleCulprits as unknown[]).map((n) => String(n).trim()).filter(Boolean)
    : [];

  // A_53 P11 (untethered-victim-no-culprit-silent): an empty possibleCulprits pool means the victim
  // would ship with no motive anchor and no warning. Deterministically promote the first eligible
  // non-victim / non-detective suspect (from the prebuilt Map) so a motive anchor always exists.
  if (culprits.length === 0) {
    let promoted: string | undefined;
    for (const [k, c] of byKey) {
      if (k && k !== victimKey && !detectiveNames.has(k)) { promoted = nameOf(c); break; }
    }
    if (promoted) {
      culprits.push(promoted);
      cd.possibleCulprits = [promoted];
      warnings.push(
        `[agent2-victim][repair] possibleCulprits was empty — promoted ${promoted} as an eligible suspect so the victim has a motive anchor.`,
      );
    } else {
      warnings.push(
        "[agent2-victim][repair] possibleCulprits was empty and no eligible non-victim/non-detective suspect exists to promote — grow the cast.",
      );
    }
  }

  // A_56 2-B: final minimum enforcement. Steps 3 (victim removal) and 5 (empty-pool promotion) above
  // can still leave possibleCulprits undersized (a single promoted suspect, or a capped merge), which
  // narrows the mystery to a near-foregone culprit. Deterministically top up from the remaining eligible
  // (non-victim, non-detective) cast to min(3, eligible) so suspect breadth always exists. Repair-not-
  // abort: warn and grow, never throw; capped at the actual eligible count so small casts degrade gracefully.
  {
    const eligibleEntries = [...byKey].filter(
      ([k]) => k && k !== victimKey && !detectiveNames.has(k),
    );
    const minRequired = Math.min(3, eligibleEntries.length);
    const poolKeys = new Set(culprits.map((c) => c.toLowerCase()));
    let added = 0;
    for (const [k, c] of eligibleEntries) {
      if (culprits.length >= minRequired) break;
      if (!poolKeys.has(k)) {
        culprits.push(nameOf(c));
        poolKeys.add(k);
        added += 1;
      }
    }
    if (added > 0) {
      cd.possibleCulprits = [...culprits];
      warnings.push(
        `[agent2-victim][repair] topped up possibleCulprits to ${culprits.length} (minimum ${minRequired}) so the suspect pool isn't undersized.`,
      );
    }
  }

  // A_53 P10 (enforce-victim-redundant-name-scans): culprit Set so the motive-anchor scan is
  // O(pairs) instead of O(pairs×culprits).
  const culpritLowerKeys = new Set(culprits.map((c) => c.toLowerCase()));
  const rel = (castRaw.relationships ?? (castRaw.relationships = {})) as Record<string, unknown>;
  const pairs = Array.isArray(rel.pairs) ? (rel.pairs as Array<Record<string, unknown>>) : (rel.pairs = []) as Array<Record<string, unknown>>;
  const tiedToCulprit = pairs.some((p) => {
    const a = String(p.character1 ?? "").toLowerCase();
    const b = String(p.character2 ?? "").toLowerCase();
    return (a === victimKey && culpritLowerKeys.has(b)) ||
      (b === victimKey && culpritLowerKeys.has(a));
  });
  if (!tiedToCulprit && culprits.length > 0) {
    const anchor = culprits[0];
    pairs.push({
      character1: victimName,
      character2: anchor,
      relationship: `${victimName} and ${anchor} — victim and prime suspect`,
      tension: "high",
      sharedHistory: `${anchor} held a personal grievance against ${victimName} that anchors the motive for the murder.`,
    });
    warnings.push(
      `[agent2-victim][repair] added the motive-anchor relationship ${victimName} ↔ ${anchor} (the victim must be tied to a suspect).`,
    );
  }

  // 6/7. Tag every character's explicit `role` so downstream consumers and the lifecycle lock read
  //      a fixed role instead of inferring it: exactly one detective, one victim, the rest suspects.
  //      (The culprit stays a hidden attribute of one suspect — never tagged here.) Re-tagging is a
  //      silent metadata repair, but a demotion of a stray extra detective is worth a warning.
  let demotedExtraDetectives = 0;
  for (const c of characters) {
    const k = nameOf(c).toLowerCase();
    if (!k) continue;
    if (k === victimKey) {
      c.role = "victim";
    } else if (k === detectiveKey) {
      c.role = "detective";
    } else {
      if (roleOf(c) === "detective") demotedExtraDetectives += 1;
      c.role = "suspect";
    }
  }
  if (demotedExtraDetectives > 0) {
    warnings.push(
      `[agent2-victim][repair] demoted ${demotedExtraDetectives} extra "detective"-tagged character(s) to suspect (exactly one detective allowed).`,
    );
  }
}

/**
 * A_53 P9 (cast-schema-repair-full-regen): deterministic backfill of the required *string* fields a
 * cast_design near-miss most often drops (a single `stakes`/`motiveSeed`/`occupation`/… missing on
 * one character, or a blank pair field). Each backfill is generic and derived ONLY from the
 * artifact's own data (the character's name/occupation/archetype) — never a concrete plot — so it
 * is holistic for any story. Returns the number of fields repaired. The caller re-validates after;
 * if specific schema errors remain (structural failure — wrong shapes/types that can't be coerced)
 * it falls back to a full `designCast`, so this only short-circuits genuine cosmetic near-misses.
 */
function repairCastSchemaFields(castRaw: Record<string, unknown>): number {
  let repaired = 0;
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
  const setIfBlank = (obj: Record<string, unknown>, field: string, value: string): void => {
    if (!str(obj[field])) { obj[field] = value; repaired += 1; }
  };

  const characters = Array.isArray(castRaw.characters)
    ? (castRaw.characters as Array<Record<string, unknown>>)
    : [];
  for (const c of characters) {
    if (!c || typeof c !== "object") continue;
    const name = str(c.name) || "This character";
    const occupation = str(c.occupation);
    const archetype = str(c.roleArchetype);
    const descriptor = occupation || archetype || "a member of the household";
    // Required string fields per cast_design.schema.yaml. Enum/array fields are handled by
    // normaliseCastOutput; here we only fill missing/blank free-text, derived from the character.
    setIfBlank(c, "ageRange", "30s");
    setIfBlank(c, "occupation", archetype || "household member");
    setIfBlank(c, "roleArchetype", occupation || "suspect");
    setIfBlank(c, "publicPersona", `${name} presents as ${descriptor} and keeps up appearances in public.`);
    setIfBlank(c, "privateSecret", `${name} privately conceals something connected to the case.`);
    setIfBlank(c, "motiveSeed", `${name} has an unresolved grievance tied to the events of the case.`);
    setIfBlank(c, "alibiWindow", `${name}'s whereabouts during the crime window are only partly accounted for.`);
    setIfBlank(c, "stakes", `${name} has something to lose if the truth comes out.`);
    setIfBlank(c, "characterArcPotential", `${name} can be pressured into revealing more as the investigation tightens.`);
  }

  const rel = (castRaw.relationships ?? {}) as Record<string, unknown>;
  const pairs = Array.isArray(rel.pairs) ? (rel.pairs as Array<Record<string, unknown>>) : [];
  for (const p of pairs) {
    if (!p || typeof p !== "object") continue;
    const a = str(p.character1);
    const b = str(p.character2);
    setIfBlank(p, "relationship", "social acquaintance");
    setIfBlank(p, "sharedHistory", `${a || "They"} and ${b || "the other"} have unresolved social friction tied to the case.`);
  }

  return repaired;
}

export async function runAgent2(ctx: OrchestratorContext): Promise<void> {
  const retriesEnabled = preAgent9LlmRetriesEnabled();
  const contractRecoveryEnabled = preAgent9ContractRecoveryEnabled();
  ctx.reportProgress("cast", "Designing cast and motives...", 12);

  const setting = ctx.setting!;
  const totalCastSize = ctx.inputs.castNames?.length || (ctx.inputs.castSize || 6) + 1;
  const nameContext: NameGeneratorContext = {
    decade: parseInt(String(setting.setting.era.decade), 10) || undefined,
    locationType: setting.setting.location.type,
    locationDescription: setting.setting.location.description,
    socialContext: setting.setting.era.socialNorms.join(", "),
  };
  const effectiveCastNames = ctx.inputs.castNames ?? generateCastNames(ctx.runId, totalCastSize, nameContext);

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent2_cast",
      "Cast Design",
      async (retryFeedback?: string) => {
        const castResult = await designCast(ctx.client, {
          characterNames: effectiveCastNames,
          characterGenders: ctx.inputs.castGenders,
          castSize: totalCastSize,
          setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
          crimeType: "Murder",
          tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
          socialContext: setting.setting.era.socialNorms.join(", "),
          detectiveType: ctx.inputs.detectiveType,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        return { result: castResult, cost: castResult.cost };
      },
      async (castResult) => {
        const scorer = new CastDesignScorer();
        const adapted = adaptCastForScoring(castResult.cast);
        const scorerInput = {
          cast_size: ctx.inputs.castNames?.length || (ctx.inputs.castSize || 6) + 1,
        };
        const score = await scorer.score(scorerInput, adapted, {
          previous_phases: { agent1_setting: setting.setting },
          cml: undefined as any,
          threshold_config: { mode: "standard" },
        });
        return {
          adapted,
          score: applyHonestScorer(
            score,
            // A_53 P10 (checkcast-recomputed-multiple-times): memoized — reused by the shadow logger
            // when this attempt's cast is the one that ships.
            () => scoreRealCast(castResult.cast, checkCastMemo(castResult.cast, { expectedCount: scorerInput.cast_size }), { expectedCount: scorerInput.cast_size }),
            ctx.warnings,
            "agent2-cast",
          ),
        };
      },
      ctx.retryManager,
      ctx.scoreAggregator,
      ctx.scoringLogger,
      ctx.runId,
      ctx.projectId || "",
      ctx.warnings,
      ctx.savePartialReport,
    );
    ctx.cast = result;
    ctx.agentCosts["agent2_cast"] = cost;
    ctx.agentDurations["agent2_cast"] = duration;
  } else {
    const castStart = Date.now();
    ctx.cast = await designCast(ctx.client, {
      characterNames: effectiveCastNames,
      characterGenders: ctx.inputs.castGenders,
      castSize: totalCastSize,
      setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
      crimeType: "Murder",
      tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
      socialContext: setting.setting.era.socialNorms.join(", "),
      detectiveType: ctx.inputs.detectiveType,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent2_cast"] = ctx.cast.cost;
    ctx.agentDurations["agent2_cast"] = Date.now() - castStart;
  }

  const cast = ctx.cast!;

  // Normalise field-name variants (snake_case → camelCase, missing arrays, relationships shape)
  // before schema validation so cosmetic LLM formatting differences don't abort the pipeline.
  normaliseCastOutput((cast.cast as unknown) as Record<string, unknown>, ctx.warnings);

  // A_53 P2 (repair-not-abort): the stereotype self-report is advisory (the deterministic checkCast
  // is the real gate); the hard throw it was written to replace is demoted to warnings so an honest
  // self-report can't abort ~25 agents of work. diversity is also defaulted in normaliseCastOutput,
  // so the optional-chain access can never raw-TypeError.
  const stereotypeFlags = cast.cast.diversity?.stereotypeCheck ?? [];
  if (stereotypeFlags.length > 0) {
    stereotypeFlags.forEach((w: string) => ctx.warnings.push(`Agent 2 stereotype self-report: ${w}`));
    (cast.cast.diversity?.recommendations ?? []).forEach((r: string) =>
      ctx.warnings.push(`Agent 2 diversity recommendation: ${r}`),
    );
  }

  const castValidationPayload = {
    ...((cast.cast as unknown) as Record<string, unknown>),
    cost: cast.cost,
    latencyMs: cast.latencyMs,
  };
  let castSchemaValidation = validateArtifact("cast_design", castValidationPayload);
  if (!castSchemaValidation.valid) {
    if (!contractRecoveryEnabled) {
      castSchemaValidation.errors.forEach((error) => ctx.errors.push(`Cast schema failure: ${error}`));
      const errorSummary = castSchemaValidation.errors.slice(0, 3).join("; ");
      throw new Error(`Cast artifact failed schema validation (contract recovery disabled): ${errorSummary}`);
    }
    // A_53 P9 (cast-schema-repair-full-regen): before paying for a whole second designCast (itself
    // ≤3 internal attempts → doubles ~6k-token spend + latency on the critical path), try a
    // deterministic repair of the SPECIFIC residual fields and re-validate. normaliseCastOutput
    // already coerced the enum/array/structural shape; the residual is almost always a missing
    // free-text field on one character, which repairCastSchemaFields backfills from that character's
    // own data. Only if errors PERSIST after deterministic repair (true structural failure) do we
    // re-call the LLM. Holistic: every backfill derives from the artifact, never a concrete plot.
    let repairedDeterministically = false;
    const castRawForRepair = (cast.cast as unknown) as Record<string, unknown>;
    const repairedFieldCount = repairCastSchemaFields(castRawForRepair);
    if (repairedFieldCount > 0) {
      normaliseCastOutput(castRawForRepair, ctx.warnings);
      const repairedValidation = validateArtifact("cast_design", {
        ...castRawForRepair,
        cost: cast.cost,
        latencyMs: cast.latencyMs,
      });
      if (repairedValidation.valid) {
        castSchemaValidation = repairedValidation;
        repairedDeterministically = true;
        ctx.warnings.push(
          `Cast design schema near-miss repaired deterministically (${repairedFieldCount} field(s) backfilled); skipped a full cast regeneration`,
        );
      }
    }

    if (!repairedDeterministically) {
      ctx.warnings.push("Cast design failed schema validation on first attempt; retrying cast generation with schema repair guardrails");
      const schemaRepairGuardrails = [
        "Return a valid cast_design artifact that strictly matches required schema fields and types.",
        ...castSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
      ];
      const castSchemaRetryStart = Date.now();
      const retriedCast = await designCast(ctx.client, {
        characterNames: effectiveCastNames,
        castSize: totalCastSize,
        setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
        crimeType: "Murder",
        tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
        socialContext: setting.setting.era.socialNorms.join(", "),
        detectiveType: ctx.inputs.detectiveType,
        qualityGuardrails: schemaRepairGuardrails,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent2_cast"] = (ctx.agentCosts["agent2_cast"] || 0) + retriedCast.cost;
      ctx.agentDurations["agent2_cast"] = (ctx.agentDurations["agent2_cast"] || 0) + (Date.now() - castSchemaRetryStart);
      normaliseCastOutput((retriedCast.cast as unknown) as Record<string, unknown>, ctx.warnings);
      const retriedPayload = {
        ...((retriedCast.cast as unknown) as Record<string, unknown>),
        cost: retriedCast.cost,
        latencyMs: retriedCast.latencyMs,
      };
      const retryValidation = validateArtifact("cast_design", retriedPayload);
      if (!retryValidation.valid) {
        retryValidation.errors.forEach((error) => ctx.errors.push(`Cast schema failure: ${error}`));
        const errorSummary = retryValidation.errors.slice(0, 3).join("; ");
        throw new Error(`Cast artifact failed schema validation: ${errorSummary}`);
      }
      ctx.cast = retriedCast;
      castSchemaValidation = retryValidation;
      ctx.warnings.push("Cast design schema-repair retry succeeded");
    }
  }
  castSchemaValidation.warnings.forEach((warning) => ctx.warnings.push(`Cast schema warning: ${warning}`));

  // Phase-0 shadow: run the deterministic cast checker for telemetry only. Default OFF; when
  // AGENT2_CAST_CHECK is set (shadow/on) it LOGS findings (placeholder/gender/enum/archetype/
  // graph health) into warnings WITHOUT changing behavior — the deterministic foundation for the
  // Agent 2 redesign (documentation/12_system_redesign/02_agent_2_cast.md §9.2). The enforcement
  // path (deleting the normalize/pad/coerce gauntlet) waits on the constrained-decoding platform.
  const castCheckMode = (process.env.AGENT2_CAST_CHECK ?? "").trim().toLowerCase();
  if (castCheckMode && castCheckMode !== "off" && castCheckMode !== "false" && castCheckMode !== "0") {
    try {
      // A_53 P10 (checkcast-recomputed-multiple-times): memoized — reuses the scorer's result for
      // the shipping cast object instead of recomputing the full check.
      const check = checkCastMemo(ctx.cast!.cast, { expectedCount: totalCastSize });
      ctx.warnings.push(`[agent2-cast-check][shadow] ${summarizeCastCheck(check)}`);
      for (const issue of check.issues) {
        ctx.warnings.push(`[agent2-cast-check][shadow] ${issue.severity}: ${issue.message}`);
      }
    } catch (err) {
      ctx.warnings.push(`[agent2-cast-check][shadow] checker error: ${(err as Error).message}`);
    }
  }

  ctx.reportProgress("cast", `Cast designed (${ctx.cast!.cast.characters.length} characters)`, 25);
}
