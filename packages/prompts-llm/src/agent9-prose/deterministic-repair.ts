/**
 * agent9-prose/deterministic-repair.ts
 * Deterministic chapter repair helpers, fallback chapter construction,
 * and shared chapter repair context derivation.
 */
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult } from "../agent5-clues.js";
import {
  composeKeyTermPhrase,
  countWords,
  isDeliveryMethodLabel,
  resolveClueObligationState,
  resolveDiscriminatingTestValidityState,
  resolveStageModeKey,
  sceneMatchesCmlSceneRef,
} from "./clue-validation.js";
import type { StageModeKey } from "./clue-validation.js";
import type {
  ChapterRequirementLedgerEntry,
  ProseChapter,
} from "./types.js";

export type MatchingClearance = {
  suspect_name: string;
  clearance_method?: string;
  supporting_clues?: string[];
};

type RequiredClueMaterialization = {
  clueId: string;
  description: string;
  placement?: string;
  pointsTo?: string;
  requiresEarlyPlacement: boolean;
  isMissing: boolean;
};

export interface ChapterRepairContext {
  chapterNumber: number;
  scene: any;
  sceneCount: number;
  stageMode: StageModeKey;
  investigatorName: string;
  culpritName?: string;
  suspectNames: string[];
  requiredClueSummaries: string[];
  matchingClearances: MatchingClearance[];
}

export interface DeterministicRepairResult {
  chapter: ProseChapter;
  appliedRepairs: string[];
  insertedClueIds: string[];
  insertedEarlyClueIds: string[];
  insertedSuspects: string[];
  insertedDiscriminatingTest: boolean;
}

const RAW_CLUE_ID_RE = /\bclue_[a-z0-9_]+\b/i;
const CLEARANCE_TERMS_RE = /\b(cleared|ruled\s+out|eliminated|not\s+the\s+culprit|innocent|alibi\s+holds|alibi\s+confirmed|could\s+not\s+have)\b/i;
const CLEARANCE_EVIDENCE_RE = /\b(evidence|because|therefore|which\s+proves|proof|alibi|timeline|constraint|observation)\b/i;

const normalizeClueStatement = (value: string): string =>
  value.trim().replace(/\s+/g, " ").replace(/[.?!]+$/g, "");

const normalizeOptionalClueSummary = (value: string | undefined): string | undefined => {
  const normalized = normalizeClueStatement(String(value ?? "").trim());
  if (!normalized || RAW_CLUE_ID_RE.test(normalized)) {
    return undefined;
  }
  return normalized;
};

const normalizeSceneCharacterName = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const entry = value as { name?: unknown; characterName?: unknown; id?: unknown };
    const name = entry.name ?? entry.characterName ?? entry.id;
    return typeof name === "string" ? name.trim() : "";
  }
  return "";
};

export const resolveFallbackInvestigatorName = (cmlCase: any, characters: string[]): string => {
  const cast = Array.isArray(cmlCase?.cast) ? cmlCase.cast : [];
  const detectiveEntry = cast.find((entry: any) => {
    const role = String(entry?.role_archetype ?? entry?.role ?? "").toLowerCase();
    return role.includes("detective") || role.includes("investigator");
  });
  const detectiveName = String(detectiveEntry?.name ?? "").trim();
  if (detectiveName) return detectiveName;

  const firstNamedCharacter = characters.find((name) => name.trim().length > 0);
  return firstNamedCharacter || "the investigator";
};

const resolveCanonicalFocusName = (focusName: string | undefined, cmlCase: any): string | undefined => {
  const requested = String(focusName ?? "").trim();
  if (!requested) return undefined;
  const castNames: string[] = (Array.isArray(cmlCase?.cast) ? cmlCase.cast : [])
    .map((entry: any) => String(entry?.name ?? "").trim())
    .filter((name: string) => name.length > 0);
  if (castNames.length === 0) return requested;
  const exact = castNames.find((name: string) => name.toLowerCase() === requested.toLowerCase());
  if (exact) return exact;
  const requestedSurname = requested.split(/\s+/).pop()?.toLowerCase() ?? "";
  if (!requestedSurname) return undefined;
  const surnameMatch = castNames.find((name: string) => {
    const surname = name.split(/\s+/).pop()?.toLowerCase() ?? "";
    return surname === requestedSurname;
  });
  return surnameMatch;
};

export const summarizeClueForFallback = (
  clueId: string,
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  clueDistribution?: ClueDistributionResult,
): string => {
  // NB: this returns the RICH description (full sentence) on purpose — it feeds the polish obligation
  // guard's token-overlap presence check (post-pass-polish.ts), which needs the full token set. The
  // R-A key-term reduction is applied at the PASTE consumption sites instead (clearance / clueText /
  // completion fallback), never here.
  const fromLedger = (ledgerEntry?.clueObligationContext ?? []).find((entry) => entry.id === clueId)?.description;
  if (fromLedger && fromLedger.trim().length > 0) {
    return fromLedger.trim().replace(/\s+/g, " ");
  }
  const fromDistribution = (clueDistribution?.clues ?? []).find((entry) => String(entry?.id ?? "") === clueId)?.description;
  if (fromDistribution && fromDistribution.trim().length > 0) {
    return fromDistribution.trim().replace(/\s+/g, " ");
  }
  // FIX 2 (leak fix): never emit a raw clue identifier (e.g. "clue_id_1") into prose. When no
  // human-readable description resolves, return empty so callers' `.filter(Boolean)` drops it and
  // fall back to non-identifier phrasing (clearance method, timeline, generic evidence language).
  return "";
};

const summarizeClueForProse = (
  clueId: string,
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  clueDistribution?: ClueDistributionResult,
): string | undefined => {
  // R-A (M0): every return is KEY TERMS (composeKeyTermPhrase), never the raw description/pointsTo
  // sentence — so the deterministic pastes downstream can never reproduce a 12-word verbatim run.
  const clue = (clueDistribution?.clues ?? []).find((entry) => String(entry?.id ?? "") === clueId);
  const fromDistribution = String(clue?.description ?? "").trim();
  if (fromDistribution && !isDeliveryMethodLabel(fromDistribution)) {
    const terms = composeKeyTermPhrase(fromDistribution);
    if (terms) return terms;
  }
  const pointsTo = String(clue?.pointsTo ?? "").trim();
  if (pointsTo) {
    const terms = composeKeyTermPhrase(pointsTo);
    if (terms) return terms;
  }
  const fromLedger = String(
    (ledgerEntry?.clueObligationContext ?? []).find((entry) => entry.id === clueId)?.description ?? "",
  ).trim();
  if (fromLedger && !isDeliveryMethodLabel(fromLedger)) {
    const terms = composeKeyTermPhrase(fromLedger);
    if (terms) return terms;
  }
  return undefined;
};

const extractDiscriminatingTestEvidenceClueIds = (caseData: CaseData): string[] => {
  const discriminatingTest = (caseData as any)?.CASE?.discriminating_test ?? {};
  if (!Array.isArray(discriminatingTest?.evidence_clues)) {
    return [];
  }
  const seen = new Set<string>();
  const clueIds: string[] = [];
  for (const entry of discriminatingTest.evidence_clues) {
    const clueId = typeof entry === "string"
      ? entry.trim()
      : String(entry?.clue_id ?? entry?.id ?? "").trim();
    if (!clueId || seen.has(clueId)) continue;
    seen.add(clueId);
    clueIds.push(clueId);
  }
  return clueIds;
};

const buildDiscriminatingTestEvidenceSummary = (
  caseData: CaseData,
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  clueDistribution: ClueDistributionResult | undefined,
  clueText?: string,
): string => {
  const evidenceSummaries = extractDiscriminatingTestEvidenceClueIds(caseData)
    .map((clueId) => normalizeOptionalClueSummary(summarizeClueForProse(clueId, ledgerEntry, clueDistribution)))
    .filter((value): value is string => Boolean(value));
  if (evidenceSummaries.length > 0) {
    return evidenceSummaries.join("; ");
  }
  return normalizeOptionalClueSummary(clueText) || "the key evidence already on the table";
};

const buildRequiredClueMaterializations = (
  chapter: ProseChapter,
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  clueDistribution: ClueDistributionResult | undefined,
  castNames?: string[],
): RequiredClueMaterialization[] => {
  if (!ledgerEntry || !Array.isArray(chapter?.paragraphs) || chapter.paragraphs.length === 0) {
    return [];
  }
  const materializations = ledgerEntry.requiredClueIds.map((clueId) => {
    const clueState = resolveClueObligationState(
      chapter,
      ledgerEntry,
      clueId,
      clueDistribution,
      castNames,
    );
    // R-A (M0): force both operands to KEY TERMS regardless of source (proseFacingDescription may be a
    // full sentence even when summarizeClueForProse is already term-reduced).
    const description = composeKeyTermPhrase(
      normalizeOptionalClueSummary(
        clueState.proseFacingDescription
        || summarizeClueForProse(clueId, ledgerEntry, clueDistribution),
      ) ?? "",
    );
    const pointsTo = composeKeyTermPhrase(normalizeOptionalClueSummary(clueState.pointsTo ?? undefined) ?? "");
    const isMissing = !clueState.isPresent;
    const requiresEarlyPlacement = clueState.placement === "early" && !clueState.isEarlyEnough;
    return {
      clueId,
      description: description ?? "",
      placement: clueState.placement ?? undefined,
      pointsTo,
      requiresEarlyPlacement,
      isMissing,
    };
  }).filter((entry) => entry.description.length > 0);

  // R-A (ROADMAP_TO_80 M0): collapse near-duplicate clue records before injection. Agent 5 can emit
  // two clues whose prose-facing descriptions differ only by a verb ("Direct evidence LINKS / TIES
  // Lady Eleanor to the mechanism access point…"), which the patch then pastes back-to-back verbatim
  // (the verified Ch8 twin). Dedupe by significant-token Jaccard ≥ 0.7 — high enough that genuinely
  // distinct clues are kept, low enough that near-identical twins collapse to one.
  return dedupeByDescriptionSimilarity(materializations);
};

const significantTokens = (s: string): Set<string> =>
  new Set(
    s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length > 3),
  );

const tokenJaccard = (a: Set<string>, b: Set<string>): number => {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  return inter / (a.size + b.size - inter);
};

const dedupeByDescriptionSimilarity = (
  entries: RequiredClueMaterialization[],
): RequiredClueMaterialization[] => {
  const kept: RequiredClueMaterialization[] = [];
  const keptTokens: Set<string>[] = [];
  for (const entry of entries) {
    const toks = significantTokens(entry.description);
    if (keptTokens.some((k) => tokenJaccard(k, toks) >= 0.7)) continue;
    kept.push(entry);
    keptTokens.push(toks);
  }
  return kept;
};

const buildDeterministicClueParagraphs = (
  materials: RequiredClueMaterialization[],
  investigatorName: string,
  isEarly: boolean,
): string[] => {
  if (materials.length === 0) return [];
  const clueList = materials.map((entry) => entry.description).join("; ");
  const lead = isEarly
    ? `At the start of the exchange, ${investigatorName} put concrete details where everyone could see them`
    : `${investigatorName} surfaced the next hard detail before the scene could drift into speculation`;
  const observationParagraph =
    `${lead}: ${clueList}. The chapter treated those facts as observable evidence, not rumor, and tied them to what could be seen, timed, and compared in real time.`;
  // R-A (M0): operands are now key-term lists (≤6 tokens each), composed into a sentence — never a
  // pasted spec sentence, so no 12-word verbatim run can survive.
  const inferenceSentences = materials.map((entry) => {
    if (entry.pointsTo) {
      return `Weighing ${entry.description}, ${investigatorName} saw the evidence narrow toward ${entry.pointsTo}.`;
    }
    return `Weighing ${entry.description}, ${investigatorName} judged the standing explanation weakened and in need of a stricter test.`;
  });
  const inferenceParagraph =
    `${materials.length > 1 ? "Those observations" : "That observation"} redirected the reasoning at once. ${inferenceSentences.join(" ")}`;
  return [observationParagraph, inferenceParagraph];
};

export const applyDeterministicCluePatch = (
  chapter: ProseChapter,
  scene: any,
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  clueDistribution: ClueDistributionResult | undefined,
  caseData: CaseData,
  castNames?: string[],
): { chapter: ProseChapter; insertedClueIds: string[]; insertedEarlyClueIds: string[] } => {
  if (!Array.isArray(chapter?.paragraphs) || chapter.paragraphs.length === 0 || !ledgerEntry) {
    return { chapter, insertedClueIds: [], insertedEarlyClueIds: [] };
  }
  const materials = buildRequiredClueMaterializations(chapter, ledgerEntry, clueDistribution, castNames)
    .filter((entry) => entry.isMissing || entry.requiresEarlyPlacement);
  if (materials.length === 0) {
    return { chapter, insertedClueIds: [], insertedEarlyClueIds: [] };
  }

  const cmlCase = (caseData as any)?.CASE ?? {};
  const characters = (Array.isArray(scene?.characters) ? scene.characters : [])
    .map(normalizeSceneCharacterName)
    .filter(Boolean);
  const investigatorName = resolveFallbackInvestigatorName(cmlCase, characters);
  const paragraphs = [...chapter.paragraphs];
  const earlyMaterials = materials.filter((entry) => entry.requiresEarlyPlacement);
  const lateMaterials = materials.filter((entry) => !entry.requiresEarlyPlacement && entry.isMissing);

  if (earlyMaterials.length > 0) {
    paragraphs.splice(0, 0, ...buildDeterministicClueParagraphs(earlyMaterials, investigatorName, true));
  }
  if (lateMaterials.length > 0) {
    const insertionIndex = Math.max(1, paragraphs.length - 1);
    paragraphs.splice(insertionIndex, 0, ...buildDeterministicClueParagraphs(lateMaterials, investigatorName, false));
  }

  return {
    chapter: {
      ...chapter,
      paragraphs,
    },
    insertedClueIds: materials.map((entry) => entry.clueId),
    insertedEarlyClueIds: earlyMaterials.map((entry) => entry.clueId),
  };
};

const buildDeterministicDiscriminatingTestParagraphs = (args: {
  caseData: CaseData;
  investigatorName: string;
  evidenceSummary: string;
  focusName?: string;
}): string[] => {
  const cmlCase = (args.caseData as any)?.CASE ?? {};
  const discriminatingTest = cmlCase?.discriminating_test ?? {};
  const falseAssumption = cmlCase?.false_assumption ?? {};
  const eliminatedSuspects = Array.isArray(discriminatingTest?.eliminated_suspects)
    ? discriminatingTest.eliminated_suspects
        .map((entry: any) => typeof entry === "string" ? entry.trim() : String(entry?.name ?? "").trim())
        .filter(Boolean)
    : [];
  const theoryA = normalizeClueStatement(
    String(falseAssumption?.statement ?? "the accepted explanation still held together").trim(),
  );
  const culpritName = args.focusName?.trim();

  // R-A (ROADMAP_TO_80 M0): describe the test's SHAPE — never paste the design / pass_condition /
  // knowledge_revealed schema sentences (the Ch9 78-word verbatim leak). theoryA is the surface
  // assumption (reader-meaningful); everything else is composed prose, not transcribed schema.
  const theoryParagraph =
    `${args.investigatorName} set out the two competing readings so everyone could weigh them side by side. Either ${theoryA}, or the physical evidence had been deliberately staged to suggest as much. Once the alternatives were stated plainly, vague suspicion gave way to what could actually be tested.`;
  const testParagraph =
    `${args.investigatorName} then ran that test in full view, recreating the conditions the evidence demanded and letting the room watch the outcome unfold. The comparison turned on ${args.evidenceSummary}, and the result was plain enough for every witness to read for themselves.`;
  const eliminationLead = eliminatedSuspects.length > 0
    ? `${eliminatedSuspects.join(", ")} ${eliminatedSuspects.length > 1 ? "were" : "was"} ruled out because the same result contradicted ${eliminatedSuspects.length > 1 ? "their accounts" : "that account"} once the evidence was compared under identical conditions.`
    : "One path was ruled out because the evidence failed it under direct comparison, while the surviving path matched each observable result.";
  const conclusionTail = culpritName
    ? ` That left ${culpritName} as the only suspect whose version still depended on the false explanation.`
    : "";
  const conclusionParagraph =
    `${eliminationLead} The result proved one theory and ruled out the other because the evidence behaved in only one way when tested directly.${conclusionTail}`;

  return [theoryParagraph, testParagraph, conclusionParagraph];
};

export const applyDeterministicDiscriminatingTestPatch = (
  chapter: ProseChapter,
  caseData: CaseData,
  investigatorName: string,
  clueText?: string,
  focusName?: string,
  ledgerEntry?: ChapterRequirementLedgerEntry,
  clueDistribution?: ClueDistributionResult,
): { chapter: ProseChapter; inserted: boolean } => {
  if (!Array.isArray(chapter?.paragraphs) || chapter.paragraphs.length === 0) {
    return { chapter, inserted: false };
  }
  if (resolveDiscriminatingTestValidityState(chapter).isValid) {
    return { chapter, inserted: false };
  }
  const paragraphs = [...chapter.paragraphs];
  const insertionIndex = Math.max(1, paragraphs.length - 1);
  paragraphs.splice(
    insertionIndex,
    0,
    ...buildDeterministicDiscriminatingTestParagraphs({
      caseData,
      investigatorName,
      evidenceSummary: buildDiscriminatingTestEvidenceSummary(
        caseData,
        ledgerEntry,
        clueDistribution,
        clueText,
      ),
      focusName,
    }),
  );
  return {
    chapter: {
      ...chapter,
      paragraphs,
    },
    inserted: true,
  };
};

const dedupeMatchingClearances = (clearances: MatchingClearance[]): MatchingClearance[] => {
  const seen = new Set<string>();
  const deduped: MatchingClearance[] = [];
  for (const clearance of clearances) {
    const name = String(clearance?.suspect_name ?? "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push({
      suspect_name: name,
      clearance_method: typeof clearance.clearance_method === "string" ? clearance.clearance_method.trim() : undefined,
      supporting_clues: Array.isArray(clearance.supporting_clues)
        ? clearance.supporting_clues.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
        : undefined,
    });
  }
  return deduped;
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const chapterHasCoLocatedClearance = (paragraphs: string[], suspectName: string): boolean => {
  const escapedName = escapeRegExp(suspectName.trim());
  const suspectPattern = new RegExp(`\\b${escapedName}\\b`, "i");
  const surname = suspectName.trim().split(/\s+/).pop() ?? suspectName.trim();
  const surnamePattern = new RegExp(`\\b${escapeRegExp(surname)}\\b`, "i");
  return paragraphs.some(
    (paragraph) =>
      (suspectPattern.test(paragraph) || surnamePattern.test(paragraph)) &&
      CLEARANCE_TERMS_RE.test(paragraph) &&
      CLEARANCE_EVIDENCE_RE.test(paragraph),
  );
};

const buildDeterministicClearanceParagraph = (
  clearance: MatchingClearance,
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  clueDistribution: ClueDistributionResult | undefined,
): string => {
  const suspectName = clearance.suspect_name.trim();
  const supportHints = (clearance.supporting_clues ?? [])
    .slice(0, 2)
    // R-A (M0): key-terms at the paste site — the rich summary feeds the guard, not the prose.
    .map((clueId) => composeKeyTermPhrase(summarizeClueForFallback(clueId, ledgerEntry, clueDistribution)))
    .filter(Boolean);
  const supportClause = supportHints.length > 0
    ? `the evidence around ${supportHints.join(" and ")}`
    : clearance.clearance_method
      ? `the ${clearance.clearance_method} established by the evidence and the timeline`
      : "the evidence and the timeline";
  return `${suspectName} was cleared because ${supportClause} placed ${suspectName} outside the fatal sequence of events. ${suspectName}'s alibi was confirmed, which proved ${suspectName} could not have been the culprit the room first feared.`;
};

export const applyDeterministicClearancePatch = (
  chapter: ProseChapter,
  clearances: MatchingClearance[],
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  clueDistribution?: ClueDistributionResult,
): { chapter: ProseChapter; insertedSuspects: string[] } => {
  if (!Array.isArray(chapter?.paragraphs) || clearances.length === 0) {
    return { chapter, insertedSuspects: [] };
  }
  const uniqueClearances = dedupeMatchingClearances(clearances);
  const paragraphs = [...chapter.paragraphs];
  const insertedSuspects: string[] = [];
  const insertionIndex = Math.min(Math.max(1, paragraphs.length - 1), 2);
  const additions: string[] = [];
  for (const clearance of uniqueClearances) {
    if (chapterHasCoLocatedClearance(paragraphs, clearance.suspect_name)) continue;
    additions.push(buildDeterministicClearanceParagraph(clearance, ledgerEntry, clueDistribution));
    insertedSuspects.push(clearance.suspect_name);
  }
  if (additions.length === 0) {
    return { chapter, insertedSuspects: [] };
  }
  paragraphs.splice(insertionIndex, 0, ...additions);
  return {
    chapter: {
      ...chapter,
      paragraphs,
    },
    insertedSuspects,
  };
};

export const repairChapterDeterministically = (args: {
  chapter: ProseChapter;
  repairContext: ChapterRepairContext;
  ledgerEntry?: ChapterRequirementLedgerEntry;
  clueDistribution?: ClueDistributionResult;
  caseData: CaseData;
  castNames?: string[];
  applyClearancePatch?: boolean;
}): DeterministicRepairResult => {
  const appliedRepairs: string[] = [];
  let chapter = args.chapter;

  const cluePatch = applyDeterministicCluePatch(
    chapter,
    args.repairContext.scene,
    args.ledgerEntry,
    args.clueDistribution,
    args.caseData,
    args.castNames,
  );
  chapter = cluePatch.chapter;
  if (cluePatch.insertedClueIds.length > 0) {
    appliedRepairs.push("clue_materialization");
  }

  let insertedDiscriminatingTest = false;
  if (args.repairContext.stageMode === "discriminating_test") {
    // R-A (M0): key-terms at the paste site; requiredClueSummaries stays rich for the guard.
    const clueText = args.repairContext.requiredClueSummaries
      .map((s) => composeKeyTermPhrase(s))
      .filter(Boolean)
      .join("; ");
    const dtPatch = applyDeterministicDiscriminatingTestPatch(
      chapter,
      args.caseData,
      args.repairContext.investigatorName,
      clueText,
      args.repairContext.culpritName,
      args.ledgerEntry,
      args.clueDistribution,
    );
    chapter = dtPatch.chapter;
    insertedDiscriminatingTest = dtPatch.inserted;
    if (dtPatch.inserted) {
      appliedRepairs.push("discriminating_test_scaffold");
    }
  }

  let insertedSuspects: string[] = [];
  if (args.applyClearancePatch) {
    const clearancePatch = applyDeterministicClearancePatch(
      chapter,
      args.repairContext.matchingClearances,
      args.ledgerEntry,
      args.clueDistribution,
    );
    chapter = clearancePatch.chapter;
    insertedSuspects = clearancePatch.insertedSuspects;
    if (insertedSuspects.length > 0) {
      appliedRepairs.push("suspect_clearance");
    }
  }

  return {
    chapter,
    appliedRepairs,
    insertedClueIds: cluePatch.insertedClueIds,
    insertedEarlyClueIds: cluePatch.insertedEarlyClueIds,
    insertedSuspects,
    insertedDiscriminatingTest,
  };
};

const buildStageAwareFallbackParagraphs = (args: {
  stageMode?: string;
  investigatorName: string;
  focusName?: string;
  clueText?: string;
  caseData?: CaseData;
}): string[] => {
  const stageMode = String(args.stageMode ?? "").trim();
  const investigatorName = args.investigatorName.trim() || "the investigator";
  const focusName = args.focusName?.trim();
  const clueText = args.clueText?.trim();
  const evidenceAnchor = clueText && clueText.length > 0
    ? clueText.split(";")[0]?.trim() || clueText
    : "the last visible contradiction in the room";

  if (stageMode === "suspect_pressure") {
    const target = focusName || "the most exposed suspect";
    return [
      `${investigatorName} did not accuse ${target} outright, but pressure tightened when ${evidenceAnchor} exposed a fresh fear and a small lie. The hesitation sharpened suspicion because it tied motive to something that could be checked, while still leaving the final answer unresolved.`,
      "No confession followed, and no one declared the case closed. What changed was the pressure map: a secret moved closer to the surface, loyalties looked thinner, and the next scene inherited a narrower and more dangerous question.",
    ];
  }

  if (stageMode === "discriminating_test") {
    return buildDeterministicDiscriminatingTestParagraphs({
      caseData: args.caseData ?? ({ CASE: {} } as CaseData),
      investigatorName,
      evidenceSummary: normalizeOptionalClueSummary(evidenceAnchor) || "the key evidence already on the table",
      focusName,
    });
  }

  if (stageMode === "final_reveal") {
    const culpritName = focusName
      || String((args.caseData as any)?.CASE?.culpability?.culprits?.[0] ?? "the culprit").trim()
      || "the culprit";
    // R-A (M0): the mechanism description is long analytical text — prime 12-word-run material. Surface
    // key terms only (the run flagged "A precisely timed gust of wind entered through the garden window…").
    const methodDescription = composeKeyTermPhrase(
      String((args.caseData as any)?.CASE?.hidden_model?.mechanism?.description ?? "").trim(),
    ) || "the precise murder method";

    return [
      `${investigatorName} named ${culpritName} only after laying motive and opportunity side by side in plain terms. The motive was tied to emotional pressure that had already surfaced in testimony, while the opportunity was tied to verified access and a narrowed time window no other suspect could satisfy.`,
      `${investigatorName} then connected means to method without ornament: ${methodDescription}. The opportunity and access linkage held against alibi checks, and the method detail matched the physical evidence rather than a dramatic accusation.`,
      `The room understood why the accusation stood. Motive explained the decision, opportunity explained the timing, and method explained the death itself; together they formed one chain of proof that could be tested and repeated without contradiction.`,
    ];
  }

  return [];
};

export const resolveFallbackStageMode = (args: {
  scene: any;
  chapterNumber: number;
  sceneCount: number;
  cmlCase: any;
  allScenes: any[];
  dtSceneCheck: any;
}): StageModeKey => {
  const { scene, chapterNumber, sceneCount, cmlCase, allScenes, dtSceneCheck } = args;
  const isDiscriminatingTestChapter = dtSceneCheck
    ? sceneMatchesCmlSceneRef(
        scene,
        dtSceneCheck,
        allScenes,
        /\b(discriminating|test|controlled comparison|trap|prove|disprove)/i,
      )
    : chapterNumber >= Math.ceil(sceneCount * 0.70);
  return resolveStageModeKey(
    chapterNumber,
    chapterNumber,
    sceneCount,
    isDiscriminatingTestChapter,
    cmlCase,
    allScenes,
    [scene],
  );
};

export const resolveBatchMatchingClearances = (args: {
  batchScenes: any[];
  batchStart: number;
  cmlCase: any;
  scenes: any[];
}): {
  chapterMatchingClearances: MatchingClearance[][];
  batchMatchingClearances: MatchingClearance[];
} => {
  const { batchScenes, batchStart, cmlCase, scenes } = args;
  const victimNames = new Set<string>(
    ((cmlCase?.cast ?? []) as any[])
      .filter((entry: any) => String(entry?.role_archetype ?? entry?.role ?? "").toLowerCase().includes("victim"))
      .map((entry: any) => String(entry?.name ?? "").trim().toLowerCase()),
  );
  const allClearanceScenes: MatchingClearance[] = Array.isArray(cmlCase?.prose_requirements?.suspect_clearance_scenes)
    ? cmlCase.prose_requirements.suspect_clearance_scenes.filter(
        (entry: any) => !victimNames.has(String(entry?.suspect_name ?? "").trim().toLowerCase()),
      )
    : [];

  const chapterMatchingClearances = batchScenes.map((scene: any, sceneIdx: number) => {
    let sceneClearances = allClearanceScenes.filter((entry) =>
      sceneMatchesCmlSceneRef(
        scene,
        entry,
        scenes,
        /\b(clear|cleared|clearance|alibi|ruled out|eliminat)/i,
      ),
    );
    if (sceneClearances.length === 0) {
      const nextScene = scenes[batchStart + sceneIdx + 1] as any;
      const sceneAct = Number(scene?.act);
      const isLastSceneInAct = !nextScene || Number(nextScene?.act) !== sceneAct;
      if (isLastSceneInAct) {
        sceneClearances = allClearanceScenes.filter((entry) => Number((entry as any).act_number) === sceneAct);
      }
    }
    return dedupeMatchingClearances(sceneClearances);
  });

  let batchMatchingClearances = dedupeMatchingClearances(chapterMatchingClearances.flat());
  if (batchMatchingClearances.length === 0 && allClearanceScenes.length > 0) {
    const nextScene = scenes[batchStart + batchScenes.length] as any;
    const batchActNumbers = new Set((batchScenes as any[]).map((scene: any) => Number(scene?.act)));
    const isLastBatchInAct = !nextScene || !batchActNumbers.has(Number(nextScene?.act));
    if (isLastBatchInAct) {
      batchMatchingClearances = dedupeMatchingClearances(
        allClearanceScenes.filter((entry) => batchActNumbers.has(Number((entry as any).act_number))),
      );
    }
  }

  return {
    chapterMatchingClearances,
    batchMatchingClearances,
  };
};

export const buildChapterRepairContext = (args: {
  chapterNumber: number;
  scene: any;
  sceneCount: number;
  caseData: CaseData;
  cmlCase: any;
  scenes: any[];
  dtSceneCheck: any;
  ledgerEntry?: ChapterRequirementLedgerEntry;
  clueDistribution?: ClueDistributionResult;
  matchingClearances?: MatchingClearance[];
}): ChapterRepairContext => {
  const {
    chapterNumber,
    scene,
    sceneCount,
    caseData,
    cmlCase,
    scenes,
    dtSceneCheck,
    ledgerEntry,
    clueDistribution,
    matchingClearances,
  } = args;
  const stageMode = resolveFallbackStageMode({
    scene,
    chapterNumber,
    sceneCount,
    cmlCase,
    allScenes: scenes,
    dtSceneCheck,
  });
  const characters = (Array.isArray(scene?.characters) ? scene.characters : [])
    .map(normalizeSceneCharacterName)
    .filter(Boolean);
  const investigatorName = resolveFallbackInvestigatorName(cmlCase, characters);
  const suspectNames = ((cmlCase?.cast ?? []) as any[])
    .filter((entry: any) => {
      const role = String(entry?.role_archetype ?? entry?.role ?? "").toLowerCase();
      return !role.includes("detective") && !role.includes("victim");
    })
    .map((entry: any) => String(entry?.name ?? ""))
    .filter(Boolean);
  const culpritName: string = ((caseData as any)?.CASE?.culpability?.culprits ?? [])[0] ?? "";
  const requiredClueSummaries = (ledgerEntry?.requiredClueIds ?? [])
    .map((clueId) => summarizeClueForFallback(clueId, ledgerEntry, clueDistribution))
    .filter(Boolean);

  return {
    chapterNumber,
    scene,
    sceneCount,
    stageMode,
    investigatorName,
    culpritName: culpritName || undefined,
    suspectNames,
    requiredClueSummaries,
    matchingClearances: matchingClearances ?? [],
  };
};

export const buildCompletionFallbackChapter = (
  existing: ProseChapter | undefined,
  scene: any,
  chapterNumber: number,
  ledgerEntry: ChapterRequirementLedgerEntry | undefined,
  clueDistribution: ClueDistributionResult | undefined,
  caseData: CaseData,
  options?: {
    stageMode?: string;
    matchingClearances?: MatchingClearance[];
    focusName?: string;
  },
): ProseChapter => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const location = String(scene?.setting?.location ?? cmlCase?.meta?.setting?.location ?? "the estate").trim();
  const timeOfDay = String(scene?.setting?.timeOfDay ?? scene?.setting?.time ?? "later that day").trim();
  const atmosphere = String(scene?.setting?.atmosphere ?? cmlCase?.meta?.setting?.atmosphere ?? "an unsettled quiet").trim();
  const characters = (Array.isArray(scene?.characters) ? scene.characters : [])
    .map(normalizeSceneCharacterName)
    .filter(Boolean)
    .slice(0, 3);
  // R-A (M0): scene objective/summary can be a full spec sentence — surface key terms only.
  const sceneObjective = composeKeyTermPhrase(String(scene?.objective ?? scene?.purpose ?? scene?.summary ?? "").trim());
  const floorWords = Math.max(850, ledgerEntry?.hardFloorWords ?? 0);
  // R-A (M0): key-terms at the paste site (completion fallback ships directly to the reader).
  const clueText = (ledgerEntry?.requiredClueIds ?? [])
    .map((clueId) => composeKeyTermPhrase(summarizeClueForFallback(clueId, ledgerEntry, clueDistribution)))
    .filter(Boolean)
    .join("; ");
  const investigatorName = resolveFallbackInvestigatorName(cmlCase, characters);
  const investigatorSentenceName = investigatorName.replace(/^\w/, (char) => char.toUpperCase());
  const canonicalFocusName = resolveCanonicalFocusName(options?.focusName, cmlCase);
  const stageAwareParagraphs = buildStageAwareFallbackParagraphs({
    stageMode: options?.stageMode,
    investigatorName: investigatorSentenceName,
    focusName: canonicalFocusName,
    clueText,
    caseData,
  });

  const namedCharacters = characters.length > 0 ? characters.join(", ") : "the investigators";
  const clueSentence = clueText.length > 0
    ? `The most important observable details were ${clueText}, and they were handled as things seen, touched, compared, or challenged in the room.`
    : "The important evidence stayed physical and visible: time, place, testimony, and object all had to agree before anyone could trust an inference.";

  const fallbackParagraphs: string[] = [
    `${location} held the inquiry in ${timeOfDay}, with ${atmosphere} pressing at the windows and along the furniture. ${namedCharacters} did not begin with certainty. They began with what could still be checked: who stood where, what had been touched, and which statement shifted under pressure.`,
    characters.length > 0
      ? `${characters.join(", ")} remained close enough to be seen and heard. One answer came too quickly; another arrived after a pause long enough to matter. The exchange did not solve the case, but it sharpened the investigation because each person had to attach their words to a concrete time, object, or movement.`
      : "The investigators worked methodically, pressing each contradiction until the scene yielded usable evidence. No one was allowed to drift into generalities; every claim had to return to a witnessed action or a physical mark.",
    clueText.length > 0
      ? `${clueSentence} The detail was not treated as a conclusion by itself. It was set beside the testimony, then tested against the order of events until the weak part of one account showed through.`
      : `${clueSentence} That discipline kept the scene from becoming accusation by instinct; the facts had to do the work before suspicion could safely narrow.`,
    sceneObjective.length > 0
      ? `The immediate pressure concerned ${sceneObjective}. ${investigatorSentenceName} kept the discussion in the present moment, returning each witness to the same anchors until evasion became more noticeable than speech. A small correction, a glance toward the wrong object, or a delayed denial gave the chapter its turn.`
      : `The final pressure stayed unresolved. ${investigatorSentenceName} had less need of a dramatic declaration than of a next test, and the scene supplied one: a statement that could be checked against a physical fact before anyone was named with certainty.`,
  ];

  const expansionBeats = [
    `${investigatorSentenceName} let the silence do part of the work. When the central discrepancy was repeated, it was done plainly, without ornament, so everyone had to hear how little of the story still fitted. The answer that followed was useful less for what it admitted than for what it avoided.`,
    "A physical check followed the talk. Someone crossed to the relevant object, another witness corrected the angle or the time, and the contradiction became less abstract. It was now something everyone could inspect together, which made denial harder and panic easier to read.",
    "The witness pressure did not become a verdict. It became a narrower corridor. One possibility lost strength because it required two impossible movements; another survived because it matched the object on the table and the time already sworn to by someone else.",
    `By the end, the scene had changed. No confession had been forced, and no arrest had been made, but the balance among suspects had shifted. ${investigatorSentenceName} left the last question hanging where everyone could feel it, attached to evidence that would have to be answered in the next scene.`,
  ];
  const mergedParagraphs = [...fallbackParagraphs, ...stageAwareParagraphs];
  let guard = 0;
  while (countWords(mergedParagraphs.join(" ")) < floorWords && guard < 8) {
    const baseBeat = expansionBeats[guard % expansionBeats.length];
    const duplicateCount = mergedParagraphs.filter((paragraph) => paragraph === baseBeat).length;
    const selectedBeat = duplicateCount === 0
      ? baseBeat
      : `${baseBeat} The same contradiction was tested again from a different witness angle, so repetition became verification rather than recycled phrasing.`;
    mergedParagraphs.push(selectedBeat);
    guard += 1;
  }

  const fallbackChapter: ProseChapter = {
    title: (existing?.title && existing.title.trim().length > 0)
      ? existing.title.trim()
      : `Chapter ${chapterNumber}`,
    paragraphs: mergedParagraphs,
  };
  const cluePatchedChapter = applyDeterministicCluePatch(
    fallbackChapter,
    scene,
    ledgerEntry,
    clueDistribution,
    caseData,
  ).chapter;
  let stagePatchedChapter = cluePatchedChapter;
  if (options?.stageMode === "discriminating_test") {
    stagePatchedChapter = applyDeterministicDiscriminatingTestPatch(
      cluePatchedChapter,
      caseData,
      investigatorSentenceName,
      clueText,
      canonicalFocusName,
      ledgerEntry,
      clueDistribution,
    ).chapter;
  }
  if (options?.matchingClearances?.length) {
    return applyDeterministicClearancePatch(
      stagePatchedChapter,
      options.matchingClearances,
      ledgerEntry,
      clueDistribution,
    ).chapter;
  }
  return stagePatchedChapter;
};
