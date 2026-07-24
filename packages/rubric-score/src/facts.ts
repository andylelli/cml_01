/**
 * Deterministic `StoryFacts` extraction (aligning-the-scoring-system.md §4 "available today").
 *
 * Reads the *exact* facts the rubric's most damaging hard caps need — role collisions (from the CASE
 * artifact, exact), template leakage (from the prose), and victim-unnamed. These cost a single
 * artifact read and are enforced as caps regardless of the LLM critic's variance. The *semantic*
 * facts (dead-victim-alive, weak-murder-method, reveal-uses-unplanted) are supplied by the judge and
 * merged in `scoreStory`; they default to "not a problem".
 */

import { detectTemplateLeakage, detectScaffoldNotProse, detectReportStyleClearance, detectDualValueNoContrast } from "@cml/prose-guard";
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
// A_61 RC4.4 (review fix) — surnames that are also ordinary English words. A BARE-surname alias for these
// would false-match atmospheric prose ("Frost coated the panes" for victim "Eleanor Frost"), falsely
// clearing victimUnnamed / vetoing the judge / inflating name coverage. For such names we keep the full
// name and first+surname aliases (still robust) but SUPPRESS the collision-prone bare surname.
export const COMMON_WORD_SURNAMES = new Set([
  "frost","stone","rose","green","brown","snow","marsh","reed","wood","woods","bell","gray","grey","hill",
  "hills","brook","brooks","moor","moore","heath","field","fields","bank","banks","ford","cross","west",
  "north","south","east","king","vale","dale","lane","park","hall","gate","gates","day","may","march",
  "rice","cook","cooke","fox","wolf","bird","finch","crane","swan","hart","lamb","drake","nightingale",
  "winter","summer","noble","young","little","long","short","white","black","gold","glass","waters",
  "rivers","forest","meadow","payne","pain","sterling","chance","savage","poole","pool","chase","love",
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
  // Bare surname only when ≥3 chars AND not an ordinary English word (else it false-matches prose noise).
  if (surname && surname.length >= 3 && !COMMON_WORD_SURNAMES.has(surname.toLowerCase())) aliases.add(surname);
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

/** Deterministic pronoun-instability evidence attached alongside `StoryFacts.pronounsUnstable`. */
export type StoryFactsWithEvidence = StoryFacts & {
  /** Offending sentences (chapter-labelled) behind a deterministic pronounsUnstable=true. */
  pronounInstabilityEvents?: string[];
};

/** The exact facts: role collisions, template leakage, victim-unnamed. Everything else stays for the judge. */
export function extractStoryFacts(cml: unknown, prose: string, opts: ExtractStoryFactsOptions = {}): StoryFactsWithEvidence {
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

  const facts: StoryFactsWithEvidence = {};
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

  // pronounsUnstable — deterministic (pronoun_policy "verify"): the same two high-precision drift
  // detectors story-validation runs (attribution-flip, impossible-self-reference), applied per chapter.
  // "Unstable" = a repeated defect: only set true on >= 2 confirmed events across >= 2 distinct
  // chapters; below that threshold the flag is left UNSET so the (citation-gated) judge still decides —
  // the detectors are precision-first and deliberately low-recall.
  const genderedCast = cast
    .map((c) => ({ name: String(c.name ?? "").trim(), gender: c.gender }))
    .filter((c) => c.name && normalizePronounGender(c.gender));
  if (genderedCast.length > 0) {
    const events: string[] = [];
    const chaptersWithEvents = new Set<number>();
    splitProseForPronounScan(prose).forEach((chapterText, i) => {
      for (const ev of detectPronounDriftEventsLocal(chapterText, genderedCast)) {
        chaptersWithEvents.add(i + 1);
        events.push(`ch${i + 1} [${ev.kind}] ${ev.characterName}: "${ev.sentence}"`);
      }
    });
    if (events.length >= 2 && chaptersWithEvents.size >= 2) {
      facts.pronounsUnstable = true;
      facts.pronounInstabilityEvents = events.slice(0, 10);
    }
  }

  return facts;
}

/**
 * A_57 D2 — MOVED to `@cml/prose-guard/dual-value.ts` (A_62 RC-2.2) so the generation loop can reach
 * it: the RC-2 rule is that a cap has a lever iff its detector is reachable from generation, and
 * `prompts-llm` must not depend on this package. Re-exported here verbatim so this package's public
 * API (and the worker's rewrite-acceptance import) is unchanged. The cap (facts.ts below) and the
 * regen lever (`runDualValueContrastRegenPass`) now key off the SAME function — same pattern as
 * `detectTemplateLeakage` / `detectScaffoldNotProse`.
 */
export { detectDualValueNoContrast } from "@cml/prose-guard";

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

// ---------------------------------------------------------------------------
// Pronoun-drift detector kernel — LOCAL REPLICA.
// Source of truth: packages/story-validation/src/prose-consistency-validator.ts
// (detectPronounDriftEvents / detectAttributionFlips / detectImpossibleSelfReferences).
// rubric-score cannot depend on story-validation (the established pattern — see
// nameAliasesForMatch above), so the predicate is replicated minimally here. Keep in sync.
// ---------------------------------------------------------------------------

interface PronounDriftEventLocal {
  kind: "attribution_flip" | "impossible_self_reference";
  characterName: string;
  sentence: string;
}

type PronounGender = "male" | "female";

function normalizePronounGender(gender: string | undefined): PronounGender | null {
  const g = (gender ?? "").trim().toLowerCase();
  return g === "male" || g === "female" ? g : null;
}

// Past-tense speech verbs only — prose is past tense.
const PRONOUN_SPEECH_VERBS =
  "said|asked|replied|observed|answered|added|continued|murmured|muttered|whispered|remarked|noted|" +
  "countered|insisted|agreed|admitted|conceded|pressed|urged|demanded|snapped|sighed|offered|ventured|" +
  "began|repeated|echoed|announced|declared|explained|protested|warned|corrected|mused|responded|" +
  "interjected|interrupted|confirmed|suggested";

const PRONOUN_SELF_NOUNS =
  "gloves?|hat|coat|jacket|waistcoat|collar|cuffs?|tie|cravat|spectacles|monocle|hair|moustache|mustache|" +
  "beard|brow|forehead|eyes?|jaw|chin|lips?|mouth|throat|voice|breath|composure|temper|gaze|expression|" +
  "hands?|fingers?|palms?|shoulders?|arms?|knees?|sleeves?|pockets?|watch|cane|pipe|notebook|notes|pen|" +
  "skirts?|gown|dress|shawl|scarf|handbag|umbrella|glasses|shoes?|boots?";

const PRONOUN_NAME_TITLES = new Set([...NAME_TITLES, "inspector", "sergeant", "constable"]);

/** Strip balanced quoted dialogue (mirrors story-validation's stripDialogueFromWindow). */
function stripQuotedDialogue(text: string): string {
  return text
    .replace(/“[^”]*”/g, " ")
    .replace(/"[^"]{0,300}"/g, " ");
}

/** Narration-only scan window: balanced strip, then cut dangling open/close quote segments. */
function pronounNarrationOnly(window: string): string {
  let s = stripQuotedDialogue(window);
  const firstDanglingClose = s.indexOf("”");
  if (firstDanglingClose !== -1) s = s.slice(firstDanglingClose + 1);
  const lastDanglingOpen = Math.max(s.lastIndexOf('"'), s.lastIndexOf("“"));
  if (lastDanglingOpen !== -1) s = s.slice(0, lastDanglingOpen);
  return s;
}

/** Gendered name-token index; ambiguous tokens (both genders) are dropped — precision first. */
function buildPronounTokenIndex(
  cast: Array<{ name: string; gender?: string }>,
): Map<string, { name: string; gender: PronounGender }> {
  const index = new Map<string, { name: string; gender: PronounGender }>();
  const ambiguous = new Set<string>();
  for (const member of cast) {
    const gender = normalizePronounGender(member.gender);
    const name = String(member.name ?? "").trim();
    if (!gender || !name) continue;
    for (const rawToken of name.split(/\s+/)) {
      const token = rawToken.replace(/\.$/, "").toLowerCase();
      if (token.length < 3 || PRONOUN_NAME_TITLES.has(token)) continue;
      const existing = index.get(token);
      if (existing && existing.gender !== gender) {
        ambiguous.add(token);
        continue;
      }
      if (!existing) index.set(token, { name, gender });
    }
  }
  for (const token of ambiguous) index.delete(token);
  return index;
}

/** Detector (a) — attribution flip. See source of truth for the full contract. */
function detectAttributionFlipsLocal(
  text: string,
  tokenIndex: Map<string, { name: string; gender: PronounGender }>,
): PronounDriftEventLocal[] {
  const events: PronounDriftEventLocal[] = [];
  const tagPattern = new RegExp(`["\\u201D]\\s*(he|she)\\s+(?:${PRONOUN_SPEECH_VERBS})\\b`, "gi");
  let tag: RegExpExecArray | null;
  while ((tag = tagPattern.exec(text)) !== null) {
    if (text[tag.index] === '"') {
      const quotesThrough = (text.slice(0, tag.index + 1).match(/"/g) ?? []).length;
      if (quotesThrough % 2 !== 0) continue; // opening quote → tag pronoun is inside dialogue
    }
    const tagGender: PronounGender = tag[1].toLowerCase() === "he" ? "male" : "female";

    let windowStart = 0;
    const currentBoundary = text.lastIndexOf("\n\n", tag.index);
    if (currentBoundary !== -1) {
      const previousBoundary = text.lastIndexOf("\n\n", currentBoundary - 1);
      windowStart = previousBoundary === -1 ? 0 : previousBoundary + 2;
    }
    const narration = pronounNarrationOnly(text.slice(windowStart, tag.index));

    let nearest: { pos: number; gender: PronounGender } | null = null;
    let nearestOppositeName: { pos: number; name: string } | null = null;
    let sameGenderNamePresent = false;
    for (const [token, info] of tokenIndex) {
      const namePattern = new RegExp(`\\b${escapeReForName(token)}\\b`, "gi");
      let nameMatch: RegExpExecArray | null;
      while ((nameMatch = namePattern.exec(narration)) !== null) {
        if (info.gender === tagGender) sameGenderNamePresent = true;
        if (!nearest || nameMatch.index > nearest.pos) nearest = { pos: nameMatch.index, gender: info.gender };
        if (info.gender !== tagGender && (!nearestOppositeName || nameMatch.index > nearestOppositeName.pos)) {
          nearestOppositeName = { pos: nameMatch.index, name: info.name };
        }
      }
    }
    const subjectPronounPattern = /\b(he|she)\b/gi;
    let pronounMatch: RegExpExecArray | null;
    while ((pronounMatch = subjectPronounPattern.exec(narration)) !== null) {
      const gender: PronounGender = pronounMatch[1].toLowerCase() === "he" ? "male" : "female";
      if (!nearest || pronounMatch.index > nearest.pos) nearest = { pos: pronounMatch.index, gender };
    }

    if (!nearest) continue;
    if (nearest.gender === tagGender) continue;
    if (sameGenderNamePresent) continue;
    if (!nearestOppositeName) continue;

    const snippet = text
      .slice(Math.max(0, tag.index - 120), Math.min(text.length, tag.index + tag[0].length + 60))
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);
    events.push({ kind: "attribution_flip", characterName: nearestOppositeName.name, sentence: snippet });
  }
  return events;
}

/** Detector (b) — impossible self-reference. See source of truth for the full contract. */
function detectImpossibleSelfReferencesLocal(
  text: string,
  tokenIndex: Map<string, { name: string; gender: PronounGender }>,
): PronounDriftEventLocal[] {
  const events: PronounDriftEventLocal[] = [];
  const subjectPattern = /^\s*((?:[A-Z][A-Za-z'\-]*\.?\s+){0,2}[A-Z][A-Za-z'\-]*)/;

  for (const paragraph of text.split(/\n\s*\n/)) {
    const narration = stripQuotedDialogue(paragraph);
    const paragraphLower = narration.toLowerCase();

    for (const sentence of narration.split(/(?<=[.!?])\s+/)) {
      const subjectMatch = sentence.match(subjectPattern);
      if (!subjectMatch) continue;
      const candidateTokens = subjectMatch[1]
        .split(/\s+/)
        .map((t) => t.replace(/\.$/, "").toLowerCase())
        .filter((t) => t.length >= 3 && !PRONOUN_NAME_TITLES.has(t));
      let subject: { name: string; gender: PronounGender } | null = null;
      for (const candidate of candidateTokens) {
        const info = tokenIndex.get(candidate);
        if (info) { subject = info; break; }
      }
      if (!subject) continue;

      const wrongGender: PronounGender = subject.gender === "male" ? "female" : "male";
      const wrongReflexive = subject.gender === "female" ? "himself" : "herself";
      const wrongPossessive = subject.gender === "female" ? "his" : "her";
      const intervener = subject.gender === "female" ? /\b(he|him)\b/i : /\bshe\b/i;

      const rest = sentence.slice((subjectMatch.index ?? 0) + subjectMatch[0].length);
      const reflexiveMatch = new RegExp(`\\b${wrongReflexive}\\b`, "i").exec(rest);
      const possessiveMatch = new RegExp(`\\b${wrongPossessive}\\s+(?:own\\s+)?(?:${PRONOUN_SELF_NOUNS})\\b`, "i").exec(rest);
      const hit =
        reflexiveMatch && (!possessiveMatch || reflexiveMatch.index <= possessiveMatch.index)
          ? reflexiveMatch
          : possessiveMatch;
      if (!hit) continue;
      if (intervener.test(rest.slice(0, hit.index))) continue;

      let wrongGenderCastPresent = false;
      for (const [token, info] of tokenIndex) {
        if (info.gender !== wrongGender) continue;
        if (new RegExp(`\\b${escapeReForName(token)}\\b`).test(paragraphLower)) { wrongGenderCastPresent = true; break; }
      }
      if (wrongGenderCastPresent) continue;

      events.push({
        kind: "impossible_self_reference",
        characterName: subject.name,
        sentence: sentence.replace(/\s+/g, " ").trim().slice(0, 200),
      });
    }
  }
  return events;
}

function detectPronounDriftEventsLocal(
  text: string,
  cast: Array<{ name: string; gender?: string }>,
): PronounDriftEventLocal[] {
  const tokenIndex = buildPronounTokenIndex(cast);
  if (tokenIndex.size === 0) return [];
  return [
    ...detectAttributionFlipsLocal(text, tokenIndex),
    ...detectImpossibleSelfReferencesLocal(text, tokenIndex),
  ];
}

/**
 * Chapter split for the pronoun scan. Source of truth: splitProseIntoChapters in
 * ./structural-verifiers.ts — replicated (same heading regex) because structural-verifiers
 * imports THIS module and a back-import would create a cycle.
 */
function splitProseForPronounScan(prose: string): string[] {
  const text = String(prose ?? "");
  if (!text.trim()) return [];
  const re = /^\s*chapter\s+(?:\d+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b.*$/gim;
  const indices: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) indices.push(m.index);
  if (indices.length === 0) return [text];
  const chunks: string[] = [];
  if (indices[0] > 0 && text.slice(0, indices[0]).trim()) chunks.push(text.slice(0, indices[0]));
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i];
    const end = i + 1 < indices.length ? indices[i + 1] : text.length;
    chunks.push(text.slice(start, end));
  }
  return chunks;
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
    // pronounsUnstable now has a deterministic extractor (drift detectors, >=2 events / >=2 chapters);
    // when it speaks (only ever `true`) it WINS over the judge. It stays unset below threshold, so the
    // citation-gated judge still decides for defects the precision-first detectors cannot see.
    pronounsUnstable: deterministic.pronounsUnstable ?? fromJudge.pronounsUnstable,
    culpritConfessesTamperingOnly: fromJudge.culpritConfessesTamperingOnly ?? deterministic.culpritConfessesTamperingOnly,
    revealUsesUnplantedEvidence: fromJudge.revealUsesUnplantedEvidence ?? deterministic.revealUsesUnplantedEvidence,
    mechanismExplainedTooEarly: fromJudge.mechanismExplainedTooEarly ?? deterministic.mechanismExplainedTooEarly,
    noResolution: fromJudge.noResolution ?? deterministic.noResolution,
    endingContradictsEarlier: fromJudge.endingContradictsEarlier ?? deterministic.endingContradictsEarlier,
    // A_68 FIX A — mechanism coherence is a judge call (physics is semantic); citation-gated in score.ts.
    mechanismIncoherent: fromJudge.mechanismIncoherent ?? deterministic.mechanismIncoherent,
    // A_68 FIX B/C — deterministic verifiers win (set from the structural verdict in score.ts, flag-gated).
    temporalContradiction: deterministic.temporalContradiction ?? fromJudge.temporalContradiction,
    duplicateReveal: deterministic.duplicateReveal ?? fromJudge.duplicateReveal,
    // the extractor's exact facts are authoritative
    weakMurderMethod: deterministic.weakMurderMethod ?? fromJudge.weakMurderMethod,
  };
}
