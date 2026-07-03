/**
 * Deterministic `StoryFacts` extraction (aligning-the-scoring-system.md §4 "available today").
 *
 * Reads the *exact* facts the rubric's most damaging hard caps need — role collisions (from the CASE
 * artifact, exact), template leakage (from the prose), and victim-unnamed. These cost a single
 * artifact read and are enforced as caps regardless of the LLM critic's variance. The *semantic*
 * facts (dead-victim-alive, weak-murder-method, reveal-uses-unplanted) are supplied by the judge and
 * merged in `scoreStory`; they default to "not a problem".
 */

import { detectTemplateLeakage, detectScaffoldNotProse, detectReportStyleClearance } from "@cml/prose-guard";
import type { StoryFacts } from "./types.js";

export interface CastMember {
  name?: string;
  role?: string;
  role_archetype?: string;
  gender?: string;
}

export interface ScoringCaseInput {
  cast?: CastMember[];
  culpability?: { culprits?: string[] };
  hidden_model?: { mechanism?: { description?: string }; outcome?: { result?: string } };
  death_method?: string;
  meta?: { crime_class?: { category?: string; subtype?: string } };
}

// ROADMAP_TO_80 M0 / L1: the "weak murder method (concealment explained, death not)" cap means the
// prose describes how the timeline was faked but never how the victim DIED. The honest test is
// "is the manner of death mentioned?" — so resolve robust death-method stems from the typed
// death_method (or meta.crime_class) and check those against the prose, rather than an exact
// substring of the outcome sentence (which almost never appears verbatim in free prose).
const DEATH_METHOD_TOKENS: Array<[RegExp, string[]]> = [
  // NB: "wound" is deliberately excluded — it collides with "wound" (past tense of wind), common in
  // clock-tampering mysteries ("the clock was wound back"). "stab" stems stab/stabbed/stabbing.
  [/stab|knif|blade/i, ["stab", "blade", "knife", "dagger"]],
  [/shoot|shot|gun|firearm|pistol|revolver/i, ["shot", "gunshot", "bullet", "firearm", "pistol"]],
  [/strangl|garrot|throttl/i, ["strangl", "throttl", "garrot"]],
  [/poison|arsenic|cyanide|toxin/i, ["poison", "arsenic", "cyanide", "toxin"]],
  [/bludgeon|blunt|cudgel/i, ["bludgeon", "blunt", "blow"]],
  [/drown/i, ["drown"]],
  [/smother|suffocat|asphyxiat/i, ["smother", "suffocat", "asphyxiat"]],
  [/electrocut/i, ["electrocut"]],
  [/burn|arson/i, ["burn"]],
];

function resolveDeathMethodTokens(c: ScoringCaseInput): string[] {
  const explicit = typeof c.death_method === "string" ? c.death_method : "";
  const haystack = `${explicit} ${c.meta?.crime_class?.subtype ?? ""} ${c.meta?.crime_class?.category ?? ""}`;
  for (const [re, tokens] of DEATH_METHOD_TOKENS) if (re.test(haystack)) return tokens;
  if (explicit.trim()) {
    return explicit.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length > 3);
  }
  return [];
}

const VICTIM_RE = /victim/i;
const DETECTIVE_RE = /detective|sleuth|investigator|inspector|sergeant|constable/i;

const norm = (s: string): string => s.trim().toLowerCase();
const includesCI = (haystack: string, needle: string): boolean =>
  needle.trim().length > 0 && haystack.toLowerCase().includes(needle.trim().toLowerCase());

// A_61 RC4.4 — match a full cast name by its natural short forms (surname / first+surname), not only
// the verbatim decorated full name. Same false-negative class as the RC4.3 setting-fidelity head-noun
// fix: a valid story that refers to "Lady Beatrice Ellsworth" as "Ellsworth" must not be scored as if
// the name never appears. Mirrors story-validation's suspect-closure buildNameAliases (rubric-score
// cannot depend on story-validation, so a local copy — the established pattern in structural-verifiers).
// A bare-surname alias is only added when >=3 chars, and title+surname prose is covered by the surname
// alias (\bEllsworth\b matches "Lady Ellsworth"), so no collision-prone bare-first-name alias is used.
const NAME_TITLES = new Set([
  "dr","mr","mrs","miss","ms","lord","lady","sir","capt","captain","col","colonel","prof","professor",
  "rev","reverend","madame","madam","mme","mlle","hon","dame",
]);
const escapeReForName = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const nameAliasesForMatch = (fullName: string): string[] => {
  const raw = String(fullName ?? "").trim();
  const tokens = raw.split(/\s+/).map((t) => t.replace(/\.$/, "")).filter(Boolean);
  if (tokens.length === 0) return [];
  const hasTitle = NAME_TITLES.has(tokens[0].toLowerCase());
  const surname = tokens[tokens.length - 1];
  const firstNonTitle = hasTitle ? tokens[1] : tokens[0];
  const aliases = new Set<string>();
  aliases.add(tokens.join(" "));
  if (raw) aliases.add(raw);
  if (surname && surname.length >= 3) aliases.add(surname);
  if (firstNonTitle && surname && firstNonTitle.toLowerCase() !== surname.toLowerCase()) {
    aliases.add(`${firstNonTitle} ${surname}`);
  }
  return Array.from(aliases).filter(Boolean);
};
export const nameAppearsInProse = (fullName: string, prose: string): boolean => {
  const text = String(prose ?? "");
  return nameAliasesForMatch(fullName).some((alias) =>
    new RegExp(`\\b${escapeReForName(alias)}\\b`, "i").test(text));
};

function unwrapCase(cml: unknown): ScoringCaseInput {
  if (cml && typeof cml === "object") {
    const obj = cml as Record<string, unknown>;
    if (obj.CASE && typeof obj.CASE === "object") return obj.CASE as ScoringCaseInput;
    return obj as ScoringCaseInput;
  }
  return {};
}

/** A_57 D2 — the canonical staged/true discriminating pair, supplied by the world-state ledger. */
export interface DiscriminatingPairInput {
  values: [string, string];
}

export interface ExtractStoryFactsOptions {
  /** The discriminating clue's staged value and true value (from the world-state ledger). When present,
   *  enables the high-precision dual-value-without-contrast detector (D2). */
  discriminatingPair?: DiscriminatingPairInput | null;
}

/** The exact facts: role collisions, template leakage, victim-unnamed. Everything else stays for the judge. */
export function extractStoryFacts(cml: unknown, prose: string, opts: ExtractStoryFactsOptions = {}): StoryFacts {
  const caseData = unwrapCase(cml);
  const cast = caseData.cast ?? [];
  const culprits = (caseData.culpability?.culprits ?? []).map((c) => norm(String(c)));

  const roleBlob = (c: CastMember): string => `${c.role ?? ""} ${c.role_archetype ?? ""}`;
  const victim = cast.find((c) => VICTIM_RE.test(roleBlob(c)));
  const detective = cast.find((c) => DETECTIVE_RE.test(roleBlob(c)));

  // Resolve the victim's name from the canonical `role:victim` cast member, else a dedicated victim
  // field on the CASE. ONLY flag `victimUnnamed` when we positively resolved a name AND it is absent
  // from the prose — never infer "unnamed" from "no role:victim member" (that conflates a CML tagging
  // gap with a prose defect; the LLM critic still judges victim-naming when we cannot resolve it).
  const asString = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v : undefined);
  const caseAny = caseData as Record<string, any>;
  const victimName =
    victim?.name ||
    asString(caseAny.victim) ||
    asString(caseAny.victim?.name) ||
    asString(caseAny.meta?.victim) ||
    asString(caseAny.meta?.victim?.name) ||
    // A_56 1-C: a victim promoted via `culpability.victim` (no `role:victim` cast tag) must still resolve,
    // so `victimUnnamed` fires consistently with the prose-side stageContractCheck (prompt-builder
    // resolveVictimName already checks this path). Only flags when the resolved name is absent from prose.
    asString(caseAny.culpability?.victim) ||
    asString(caseAny.culpability?.victim?.name) ||
    undefined;

  const facts: StoryFacts = {};
  if (victimName) {
    facts.culpritIsVictim = culprits.includes(norm(victimName)); // accidental culprit==victim collision
    if (detective?.name) facts.victimIsInvestigator = norm(detective.name) === norm(victimName);
    facts.victimUnnamed = !nameAppearsInProse(victimName, prose); // RC4.4: surname/first+surname count

  }
  // else: victim name unresolved → leave victimUnnamed undefined (do NOT flag); the judge decides.

  // mechanism present but no death method described → weak-murder-method signal (deterministic-ish).
  // Prefer the typed death-method tokens (manner of death); fall back to the old outcome-sentence
  // heuristic only when no death method is resolvable.
  const hasMechanism = Boolean(caseData.hidden_model?.mechanism?.description);
  const deathTokens = resolveDeathMethodTokens(caseData);
  if (hasMechanism && deathTokens.length > 0) {
    const lower = prose.toLowerCase();
    // Match each token at a WORD START (\b<stem>) so stems can still match inflections
    // ("stab"→stabbed/stabbing) without colliding on embedded substrings — e.g. an unanchored
    // includes("stab") matches "con-stab-le" / "e-stab-lish", which would silently CLEAR this cap
    // in any story with a constable. Tokens are alphabetic stems, so they are regex-safe to interpolate.
    facts.weakMurderMethod = !deathTokens.some((t) => new RegExp(`\\b${t}`).test(lower));
  } else {
    const outcome = caseData.hidden_model?.outcome?.result;
    if (hasMechanism && outcome) {
      facts.weakMurderMethod = !includesCI(prose, String(outcome).split(/[.,;]/)[0]?.slice(0, 30) ?? "");
    }
  }

  facts.templateLeakageHits = detectTemplateLeakage(prose);
  // First-principles LLD §6.4 — the deductive-scaffold family (complements detectTemplateLeakage,
  // which catches metadata/audit/comma-table leakage). De-duplicated to distinct rule labels.
  const scaffoldRules = Array.from(new Set(detectScaffoldNotProse(prose).map((h) => h.rule)));
  if (scaffoldRules.length > 0) facts.scaffoldHits = scaffoldRules;
  const malformed = detectMalformedSurfacing(prose);
  if (malformed.length > 0) facts.malformedEvidenceSurfacing = malformed;
  if (detectReportStyleClearance(prose)) facts.reportStyleClearance = true;
  if (opts.discriminatingPair && detectDualValueNoContrast(prose, opts.discriminatingPair)) {
    facts.dualValueNoContrast = true;
  }
  return facts;
}

/** Lowercased indexes of every occurrence of `needle` in `haystack`. */
function allIndexes(haystack: string, needle: string): number[] {
  const out: number[] = [];
  if (!needle) return out;
  let from = 0;
  for (;;) {
    const i = haystack.indexOf(needle, from);
    if (i === -1) break;
    out.push(i);
    from = i + needle.length;
  }
  return out;
}

/**
 * A_57 D2 — the discriminating clue's staged value and true value appear close together with NO contrast
 * connective binding them (two flat parallel truths instead of one contradiction). High-precision: it
 * fires only on the two CANONICAL values (from the world-state ledger) co-occurring within a tight window
 * and lacking a contrast connective in that window. A story that properly frames the contrast
 * ("the watch read X, yet the shadow could only fall that way at Y") is NOT flagged.
 */
function detectDualValueNoContrast(prose: string, pair: { values: [string, string] }): boolean {
  const a = String(pair.values?.[0] ?? "").trim().toLowerCase();
  const b = String(pair.values?.[1] ?? "").trim().toLowerCase();
  if (!a || !b || a === b) return false;
  const lower = prose.toLowerCase();
  const CONTRAST = /\b(?:but|yet|however|whereas|while|though|although|rather than|instead of|could only|only have|cannot|can['’]?t|impossible|contradict\w*|discrepan\w*|at odds|conflict\w*|mismatch\w*|inconsisten\w*|did not match|didn['’]?t match)\b/;
  const WINDOW = 240; // ~2-3 sentences: "stated as two flat, side-by-side truths"
  const idxsA = allIndexes(lower, a);
  const idxsB = allIndexes(lower, b);
  for (const ia of idxsA) {
    for (const ib of idxsB) {
      const lo = Math.min(ia, ib);
      const hi = Math.max(ia + a.length, ib + b.length);
      if (hi - lo <= WINDOW) {
        // Inspect a slightly padded window so a contrast connective just before/after still counts.
        const windowText = lower.slice(Math.max(0, lo - 48), Math.min(lower.length, hi + 48));
        if (!CONTRAST.test(windowText)) return true; // co-present, no contrast → the D2 defect
      }
    }
  }
  return false;
}

/**
 * A_57 D1 — a verbatim/descriptive locked-fact value spliced into prose with a stray apostrophe and no
 * space ("drizzle'the groundskeeper's entry … skies"). High-precision, parameter-generic: it matches an
 * apostrophe joining two word-tokens that is NEITHER a valid contraction/possessive ('s, n't, 're, 've,
 * 'll, 'd, 'm, o'clock) NOR a name particle (O'Brien, d'Arcy). Returns short context slices (capped).
 */
function detectMalformedSurfacing(prose: string): string[] {
  const re = /([a-z]+)['’]([a-z][a-z]*)/gi;
  const CONTRACTION = /^(?:s|t|re|ve|ll|d|m|clock)$/i;
  const NAME_PARTICLE = /^[odl]$/i;
  const hits: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(prose)) !== null && hits.length < 10) {
    if (CONTRACTION.test(m[2]) || NAME_PARTICLE.test(m[1])) continue;
    const start = Math.max(0, m.index - 18);
    hits.push(prose.slice(start, m.index + m[0].length + 18).replace(/\s+/g, " ").trim());
  }
  return hits;
}

/** Merge deterministic facts with judge-supplied semantic flags (the deterministic ones win for the exact caps). */
export function mergeFacts(deterministic: StoryFacts, fromJudge: StoryFacts = {}): StoryFacts {
  return {
    ...fromJudge,
    ...deterministic,
    // keep judge's semantic flags where the extractor doesn't speak
    deadVictimAppearsAlive: fromJudge.deadVictimAppearsAlive ?? deterministic.deadVictimAppearsAlive,
    deadVictimIsCulprit: fromJudge.deadVictimIsCulprit ?? deterministic.deadVictimIsCulprit,
    victimIdentityUnclear: fromJudge.victimIdentityUnclear ?? deterministic.victimIdentityUnclear,
    multipleRoleChanges: fromJudge.multipleRoleChanges ?? deterministic.multipleRoleChanges,
    pronounsUnstable: fromJudge.pronounsUnstable ?? deterministic.pronounsUnstable,
    culpritConfessesTamperingOnly: fromJudge.culpritConfessesTamperingOnly ?? deterministic.culpritConfessesTamperingOnly,
    revealUsesUnplantedEvidence: fromJudge.revealUsesUnplantedEvidence ?? deterministic.revealUsesUnplantedEvidence,
    mechanismExplainedTooEarly: fromJudge.mechanismExplainedTooEarly ?? deterministic.mechanismExplainedTooEarly,
    noResolution: fromJudge.noResolution ?? deterministic.noResolution,
    endingContradictsEarlier: fromJudge.endingContradictsEarlier ?? deterministic.endingContradictsEarlier,
    // the extractor's exact facts are authoritative
    weakMurderMethod: deterministic.weakMurderMethod ?? fromJudge.weakMurderMethod,
  };
}
