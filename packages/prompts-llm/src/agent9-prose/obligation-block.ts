/**
 * agent9-prose/obligation-block.ts
 * buildChapterObligationBlock â€” the combined clue-obligation / NSD context block
 * injected into every prose prompt.
 */
import { isVictimArchetype, readLockedClocksAndDurations, selectDeceptionPair, parseClockTime } from "@cml/cml";
import { resolveClearanceOwnership, isClearanceOwnershipEnabled } from "./clearance-ownership.js";
import { deriveClueObservable, deathMethodTellHints, type ClueDistributionResult, type Clue } from "../agent5-clues.js";
import {
  OPENING_ATMOSPHERE_MARKERS,
  formatGroundingMarkers, getGenerationParams } from "@cml/story-validation";
import {
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import {
  getRequiredClueIdsForScene,
  resolveClueOwnership,
  isClueOwnershipEnabled,
  isClueOwnershipByPageEnabled,
  partitionCluesByPage,
  isBehaviouralClue,
  isAftermathFinalScene,
  isDeliveryMethodLabel,
  resolveSceneRef,
  type SceneRefPath,
  sceneMatchesCmlSceneRef,
  surfaceSpecKeyTerms,
  tokenMatchesText,
  tokenizeForClueObligation,
} from "./clue-validation.js";
import { sanitizeContinuityTailForPrompt } from "./continuity-tail.js";
import { getSeasonAllowList, capitalizeWord } from "./lint.js";
import { HUMOUR_STYLES } from "./prompt-blocks.js";
import type { CanonicalSeason } from "./lint.js";
import { sanitizeClueField, tagCharacter, buildIdentityMap } from "./phrase-analysis.js";
import { getTieredBannedPhrasePolicy } from "./banned-phrases.js";
import type { BeatFingerprint } from "./phrase-analysis.js";
import type { NarrativeState } from "../types/narrative-state.js";
import type {
  ProseChapter,
  ChapterRequirementLedgerEntry,
  MacroArcEntry,
  ProseGenerationInputs,
} from "./types.js";
/**
 * A_84 follow-up #1 — `AGENT9_REVEAL_DECEPTION_PURPOSE`: the one plain sentence the reveal never states.
 *
 * Four of the last five external reads ask for the SAME missing sentence and write it themselves:
 *
 *   1711 (clues 7): "The forged entry did not create an alibi by itself. It made everyone argue about
 *                    the wrong moment…" — "That's the missing bridge."
 *   2035 (clues 7): "it still needs one very plain sentence telling the reader exactly how Desmond
 *                    used it."
 *   1907 (clues 5): "Decide exactly how the fast clock helps the forged call sheet … the reader cannot
 *                    tell which version is intended."
 *   1242 (clues 8): "the timing still wobbles"
 *
 * The reveal contract below demands the mechanism of death, the access, the motive and the exclusions.
 * It never demands the PURPOSE — what the deception made everyone believe, and how that belief put the
 * culprit beyond suspicion. Yet the case holds exactly that: `false_assumption.statement /
 * what_it_hides / why_it_seems_reasonable`, the staged and true times in `hidden_model.mechanism`, and
 * the culprit's own `alibi_window`. Checked 2026-09-07: `why_it_seems_reasonable` reaches no Agent 9
 * prompt at all, and the staged/true pair reaches none as an obligation.
 *
 * This asks for a COUNTABLE thing — one sentence, both halves in it — which is what this model
 * follows (A_75: operations, not statistics). The facts are given as key terms and locked values, never
 * as a sentence to copy (A_67: illustrative prose in a prompt ships verbatim). Default OFF; env read at
 * call time (ADR-0004).
 */
export const isRevealDeceptionPurposeEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_REVEAL_DECEPTION_PURPOSE ?? "").trim());

/**
 * A_87 P4 — let a `revelation` beat refuse a keyword-only discriminating-test claim. See the call
 * site for the measurement (24% of archived runs lose the reveal contract to this).
 */
export const isSceneRefArbitrationEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_SCENE_REF_ARBITRATION ?? "").trim());

const buildDeceptionPurposeLines = (cmlCase: any, culpritNames: string, culpritAlibiLock: Array<{ name: string; alibiWindow: string }>): string[] => {
  const fa = cmlCase?.false_assumption ?? {};
  const terms = (v: unknown): string => {
    const s = typeof v === "string" ? v.trim() : "";
    return s ? surfaceSpecKeyTerms(s) : "";
  };
  const belief = terms(fa.statement);
  const hidden = terms(fa.what_it_hides);
  const why = terms(fa.why_it_seems_reasonable);
  const mech = cmlCase?.hidden_model?.mechanism ?? {};
  const apparent = typeof mech.apparent_time_of_death === "string" ? mech.apparent_time_of_death.trim() : "";
  const actual = typeof mech.actual_time_of_death === "string" ? mech.actual_time_of_death.trim() : "";
  const window = culpritAlibiLock[0]?.alibiWindow ?? "";
  const who = culpritNames || "the culprit";

  const facts: string[] = [];
  if (belief) facts.push(`the false belief — ${belief}`);
  if (hidden) facts.push(`what it concealed — ${hidden}`);
  if (why) facts.push(`why it was believed — ${why}`);

  const lines: string[] = [];
  lines.push(
    `  - ⚠ THE DECEPTION'S PURPOSE, IN ONE SENTENCE: within the deduction the detective must say aloud, in a SINGLE ` +
      `sentence, (a) what the deception made everyone believe and (b) exactly how that belief put "${who}" beyond ` +
      `suspicion — the false belief and the true state named side by side in that one sentence. Do not split it across ` +
      `two sentences and do not leave either half implied; a reader should be able to quote the line back as the reason ` +
      `the trick worked.` +
      (facts.length > 0 ? ` Build it from these facts in your own words, never copied: ${facts.join("; ")}.` : ""),
  );
  if (apparent && actual && window) {
    lines.push(
      `    The values that sentence must carry, verbatim: the staged reading "${apparent}", the true moment "${actual}", ` +
        `and ${who}'s own account "${window}" — say which of the two times fell inside that account and which did not. ` +
        `That gap is the whole of the protection, and the reader must be able to check it from the page.`,
    );
  }
  return lines;
};

/**
 * A_86 items 1 & 5 — `AGENT9_AFTERMATH_POSITIVE_JOB`: tell the final chapter what it IS, not only
 * what it must not be.
 *
 * THE EVIDENCE. "Chapter 10" is the single most repeated ask across twelve external reads (9 of the
 * reviewers' own "with X, this could reach…" clauses name it). The contract below already carried
 * four requirements and six prohibitions, and the model complied 0 times out of 22 in one audit and
 * 0 of 2 on the last run. CLAUDE.md's settled finding explains why: **this model complies with
 * OPERATIONS and ignores STATISTICS** — "show the emotional and social consequences" is not a
 * countable thing to do, so it is not done.
 *
 * WHERE THE REPLACEMENT COMES FROM. Not invented: it is what the reviewers PRAISED in the chapters
 * that worked, plus the structural move one of them prescribed outright —
 *   "Dorothy remembers Adela's precision, Ferdinand admits everyone resented her, and the remaining
 *    staff begin to imagine rebuilding routine"
 *   "characters reflecting, not re-solving"
 *   "'Captain Ivor Hale had signed the confession.' That line appears near the END of Chapter 10,
 *    but it should be the STARTING CONDITION of the chapter."
 *
 * So the outcome opens the chapter as an accomplished fact, and the rest is four countable beats.
 * The prohibitions are kept — they are what stops the re-staging — but they are no longer the whole
 * instruction. OFF: byte-identical.
 */
export const isAftermathPositiveJobEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_AFTERMATH_POSITIVE_JOB ?? "").trim());

/**
 * A_86 item 5 — `AGENT9_CLEARING_HUMAN_BEAT`: the clearing chapter clears people, not alibis.
 *
 * THE EVIDENCE, from the read that scored highest (85/100): *"Chapter 9's clearances are acceptable
 * because they give Gerald, Harriet, and Halloway emotional closure, not just legal clearance.
 * Gerald apologizing to Harriet is a good human beat."* Two other reads asked for chapter 9 to be
 * "trimmed", and what they were objecting to in every case was a per-suspect recitation of alibis.
 *
 * The difference between the version that scored and the versions that did not is not length — it is
 * that each clearance carried a human beat. That is countable, so it is asked for as one.
 */
export const isClearingHumanBeatEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_CLEARING_HUMAN_BEAT ?? "").trim());

/**
 * A_86 item 2 — `AGENT9_ONE_WEAPON`: the story has exactly one murder weapon, and only it carries
 * the marks of the killing.
 *
 * REVIEWER-NAMED, twice, as the book's headline issue:
 *   "1. Murder weapon confusion — Chapter 1 says a heavy brass letter opener lies near the body.
 *    Chapter 3 introduces a heavy brass candlestick with blood and hair… Use one weapon."
 *   "1. Weapon confusion: paperweight vs decanter"
 *   "With the time math fixed and the weapon cleaned up, this could reach 87-89/100."
 *
 * MEASURED over the 37 manuscripts on disk (`npm run probe:weapon-confusion`): 4 books put the
 * killing evidence on two different objects — 11%, and two of the four were never flagged by anyone.
 * The case declares exactly ONE `death_method`; nothing told the prose that the declaration was
 * exclusive, so a second object got decorated with the same blood-and-residue vocabulary.
 *
 * A countable operation, not a prohibition: name the weapon, and say that no other object carries
 * the marks. The mechanism's own parts are exempted explicitly — a clock's chime hammer and a
 * tampering wire are not rival weapons, and the probe's first draft flagged both. OFF: byte-identical.
 */
export const isOneWeaponEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_ONE_WEAPON ?? "").trim());

/**
 * A_91 — WIT AND DEPTH AS PER-CHAPTER OPERATIONS.
 *
 * Both already exist as DATA and as run-stable GUIDANCE, and neither reliably reaches the page:
 * 16 of 17 characters across the last three books carry a humour style and a level above zero, the
 * guide names five styles with worked examples — and a whole book contains 3 to 5 understatement
 * markers, while 6 of 17 signature tics appear at all.
 *
 * The reason is the shape of the ask, not its absence. The guide asks for a RATE ("for every 3 pages
 * of investigation, insert 1 understated observation"), and this model complies with countable
 * OPERATIONS and ignores statistics — VoiceSpec asked for 22.0-word sentences and got 15.86 in 0 of
 * 10 chapters. So the beats below name ONE character, in ONE chapter, and say what to do once.
 *
 * Assignment is deterministic — character index and chapter number — so a resumed or retried run
 * reproduces itself exactly, and so no character carries two beats in the same chapter.
 */
export const isWitBeatEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_WIT_BEAT ?? "").trim());
export const isDepthBeatEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_DEPTH_BEAT ?? "").trim());

export interface BeatCandidate {
  name: string;
  humourStyle?: string;
  humourLevel?: number;
  formativeIncident?: string;
}

/** Stable, dependency-free rotation: the same chapter always draws the same character. */
const rotate = <T>(pool: T[], chapterNumber: number): T | undefined =>
  pool.length === 0 ? undefined : pool[(Math.max(1, chapterNumber) - 1) % pool.length];

/**
 * Who carries this chapter's wit beat. Only characters the profile actually made funny are eligible,
 * and the detective is deliberately eligible — the guide's own rule is that the detective delivers
 * one mild remark per major scene, not that they never speak.
 */
export const selectWitBeat = (
  profiles: ReadonlyArray<BeatCandidate>,
  chapterNumber: number,
): BeatCandidate | undefined =>
  rotate(
    (profiles ?? []).filter(
      (p) => p?.name && p.humourStyle && p.humourStyle !== "none" && Number(p.humourLevel ?? 0) > 0,
    ),
    chapterNumber,
  );

/** Who shows their formative trait in this chapter. Offset by one so it is rarely the wit-beat character. */
export const selectDepthBeat = (
  profiles: ReadonlyArray<BeatCandidate>,
  chapterNumber: number,
): BeatCandidate | undefined =>
  rotate(
    (profiles ?? []).filter((p) => p?.name && String(p.formativeIncident ?? "").trim().length > 12),
    chapterNumber + 1,
  );

export const buildWitBeatLines = (beat: BeatCandidate | undefined, styles: Record<string, string>): string[] => {
  if (!beat) return [];
  const style = String(beat.humourStyle ?? "").trim();
  const definition = styles[style] ?? "";
  return [
    `  - ⚠ ONE WIT BEAT, and it belongs to ${beat.name}: exactly one remark in this chapter, in their ` +
      `register — ${style.replace(/_/g, " ")}${definition ? `, which is: ${definition}` : ""} It must ` +
      `arise from what is in front of them — an object, a delay, another character's answer — never ` +
      `from a reflection on truth, appearances or human nature. One remark, not a run of them, and no ` +
      `other character is funny in this chapter.`,
    `    If the scene is a discovery of a body, a moment of genuine grief, or the explanation of the ` +
      `mechanism, SKIP the beat entirely rather than force it. A missing beat costs nothing; a joke in ` +
      `those three places costs the chapter.`,
  ];
};

export const buildDepthBeatLines = (beat: BeatCandidate | undefined): string[] => {
  if (!beat) return [];
  return [
    `  - ⚠ ONE THING FROM ${beat.name.toUpperCase()}'S LIFE BEFORE THIS CASE, shown once and not explained: ` +
      `${String(beat.formativeIncident ?? "").trim()}`,
    `    Put the TRAIT on the page as an action or a physical detail in a sentence of ordinary business ` +
      `— the way they stand, what they will not do, what their hands are doing. Do NOT narrate the ` +
      `cause in the same paragraph. If the cause surfaces at all in this chapter it surfaces in ONE ` +
      `line of their own dialogue, said briefly and not dwelt on, and never to explain their behaviour ` +
      `in the case.`,
  ];
};

/**
 * A_90 §12 — `AGENT9_LOCATION_LABEL_PROSE`. The outline's scene location is a LABEL ("Drawing room
 * and manor clock room"); printed raw into "Scene is set in: …", the model copied it into narration
 * with its capital — the reader's first "generated artifact" on run 81042. MEASURED over 537
 * archived outline scenes: 39% are compound "X and Y" labels and 57% are "Capital lowercase…"
 * labels. ON: the label is rendered as a phrase a character would say — lowercase common-noun
 * labels, an article, a compound split into its two places — and the line says not to copy it.
 */
export const isLocationLabelProseEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_LOCATION_LABEL_PROSE ?? "").trim());

const isProperNounLabel = (label: string): boolean => {
  const words = label.trim().split(/\s+/);
  // "Lockwood Estate", "Manor House Library": two or more capitalised words in a row read as a name.
  return words.length >= 2 && /^[A-Z]/.test(words[0]!) && /^[A-Z]/.test(words[1]!);
};

const asPlacePhrase = (label: string): string => {
  const trimmed = label.trim().replace(/^[Tt]he\s+/, "");
  if (!trimmed) return "";
  const proper = isProperNounLabel(trimmed);
  const body = proper ? trimmed : trimmed[0]!.toLowerCase() + trimmed.slice(1);
  return proper ? body : `the ${body}`;
};

/** "Drawing room and manor clock room" -> "the drawing room and the manor clock room". */
export const renderLocationForProse = (label: string): string => {
  const parts = String(label ?? "").split(/\s+and\s+|\s*&\s*/).map(asPlacePhrase).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
};

/**
 * A_90 §12 — `AGENT9_REVEAL_ARITHMETIC`. The reader of run 81042 (87/100) asked for the reveal to
 * "state the mechanism in three steps" — the real time, the staged reading, and how the instrument
 * was made to disagree — because the shipped line ("the manor clock struck at twenty-five minutes
 * past three, but its face showed a quarter to four, then the chime was advanced by twenty minutes")
 * "blurs whether the chime was early, late, advanced, or separated from the hands". The three steps
 * are arithmetic on values the case already locks, so they are RENDERED here from the numbers and
 * the model is asked to say them, in order, as three sentences. Self-gating: nothing prints without
 * both death times; step 3 prints only when the device declares its deception pair (`derivedFrom`).
 */
export const isRevealArithmeticEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_REVEAL_ARITHMETIC ?? "").trim());

const INDEPENDENT_TIMEPIECE_RE = /\b(?:independent|untampered|not tampered|stopped (?:pocket )?watch|wristwatch|pocket watch|external|not visible|separate)\b/i;

export const buildDeceptionArithmeticLines = (
  cmlCase: any,
  lockedFacts: ReadonlyArray<{ id?: unknown; value?: unknown; description?: unknown; derivedFrom?: unknown }> | undefined,
): string[] => {
  const mech = cmlCase?.hidden_model?.mechanism ?? {};
  const apparent = typeof mech.apparent_time_of_death === "string" ? mech.apparent_time_of_death.trim() : "";
  const actual = typeof mech.actual_time_of_death === "string" ? mech.actual_time_of_death.trim() : "";
  if (!apparent || !actual) return [];
  const facts = Array.isArray(lockedFacts) ? lockedFacts : [];
  const pair = selectDeceptionPair(facts);
  const { clocks } = readLockedClocksAndDurations(facts);
  const describe = (id: string): string => {
    const fact = facts.find((f) => String(f?.id ?? "").trim() === id);
    return String(fact?.description ?? "").trim();
  };
  const independent = clocks.find(
    (c) => (!pair || (c.id !== pair.clocks[0].id && c.id !== pair.clocks[1].id)) && INDEPENDENT_TIMEPIECE_RE.test(describe(c.id)),
  );
  const actualDial = parseClockTime(actual);
  const fixedBy = independent && actualDial !== null && independent.dial === actualDial ? ` — fixed by ${describe(independent.id)}` : "";

  const steps: string[] = [];
  steps.push(`1. the REAL time of death: "${actual}"${fixedBy};`);
  steps.push(`2. the STAGED reading: "${apparent}" — the time the tampered instrument made everyone believe;`);
  if (pair) {
    const [a, b] = pair.clocks;
    // Which of the pair is the reading people SAW, and which the true moment? The one that equals the
    // staged time is the displayed value; the other is where the instrument really stood.
    const apparentDial = parseClockTime(apparent);
    const displayed = apparentDial !== null && b.dial === apparentDial ? b : a;
    const real = displayed === a ? b : a;
    const forward = ((displayed.dial - real.dial) % 720 + 720) % 720;
    const ahead = forward <= 360;
    const minutes = ahead ? forward : 720 - forward;
    steps.push(
      `3. the SHIFT: "${pair.interval.raw}" — ${describe(displayed.id) || displayed.id} ran ${minutes} minutes ${ahead ? "AHEAD of" : "BEHIND"} the true time: ` +
        `when it showed "${displayed.raw}", the true time was "${real.raw}".`,
    );
  }
  return [
    `  - ⚠ THE ARITHMETIC OF THE DECEPTION, IN THREE SEPARATE SENTENCES, IN THIS ORDER (every value verbatim, in the detective's own voice, before the confession):`,
    ...steps.map((line) => `      ${line}`),
    `    Do not blend them into one clause, and never describe the shift with a bare "advanced", "delayed" or "altered" — say which reading was ahead of which, and by how much.`,
  ];
};

export function buildChapterObligationBlock(
  scenesForChapter: unknown[],
  chapterStart: number,
  cmlCase: any,
  lockedFacts: ProseGenerationInputs['lockedFacts'] | undefined,
  temporalLock: { month: string; season: CanonicalSeason } | undefined,
  clueDistribution?: ClueDistributionResult,
  wordTarget?: { targetWords: number },
  sensoryVariantsByChapter?: Record<number, any>,
  narrativeState?: NarrativeState,
  currentArcPosition?: string,
  worldDoc?: any,
  macroArcPlan?: MacroArcEntry[],
  allOutlineScenes?: any[],
  currentStageMode?: string,
  priorChapters?: ProseChapter[],
  characterProfiles?: ReadonlyArray<BeatCandidate>,
): string {
  if (!Array.isArray(scenesForChapter) || scenesForChapter.length === 0) {
    return '';
  }

  const proseRequirements = cmlCase?.prose_requirements ?? {};
  const dtScene = proseRequirements?.discriminating_test_scene;
  // ITEM 11 (#3): DT exclusivity — resolve the discriminating-test chapter ONCE across the
  // whole outline. When ANY outline scene EXACT-matches the DT scene ref (act/scene
  // coordinates), that chapter alone owns the DT contract and the keyword fallback is
  // disabled for every other chapter — otherwise a later chapter whose summary merely says
  // "disproved" re-claims the full reveal contract after the true DT chapter already ran
  // (the Ch9/Ch10 duplicated-reveal defect). The keyword fallback applies only when no
  // exact match exists anywhere.
  const DT_SIGNAL_RE = /\b(discriminating|test|controlled comparison|trap|prove|disprove)/i;
/** A_87 P4b — hoisted from the reveal classification so the arbitration can re-apply it. */
const REVEAL_SIGNAL_RE = /\b(culprit|confront|confession|resolve|resolution|denouement|case\s+closed)/i;
  const dtResolutionScenes: any[] = Array.isArray(allOutlineScenes) && allOutlineScenes.length > 0
    ? allOutlineScenes
    : (Array.isArray(scenesForChapter) ? (scenesForChapter as any[]) : []);
  const dtHasExactMatch = Boolean(
    dtScene && dtResolutionScenes.some((s: any) => sceneMatchesCmlSceneRef(s, dtScene, allOutlineScenes)),
  );
  // Exclude deceased victims from clearance obligations — a dead character cannot
  // meaningfully appear in a "alibi confirmed" paragraph and causes the LLM to
  // generate nonsensical or repetitive prose when forced to clear a victim.
  const _victimNamesForClearance = new Set<string>(
    ((cmlCase?.cast ?? []) as any[])
      .filter((c: any) => isVictimArchetype(c.role_archetype ?? c.role))
      .map((c: any) => String(c.name ?? '').trim().toLowerCase())
  );
  // Culprits must never be included in suspect-clearance obligations.
  const _culpritNamesForClearance = new Set<string>(
    ((cmlCase?.culpability?.culprits ?? []) as any[])
      .map((name: any) => String(name ?? '').trim().toLowerCase())
      .filter(Boolean)
  );
  const clearanceScenes = Array.isArray(proseRequirements?.suspect_clearance_scenes)
    ? proseRequirements.suspect_clearance_scenes.filter(
        (entry: any) => {
          const suspect = String(entry?.suspect_name ?? '').trim().toLowerCase();
          if (!suspect) return false;
          if (_victimNamesForClearance.has(suspect)) return false;
          if (_culpritNamesForClearance.has(suspect)) return false;
          return true;
        }
      )
    : [];
  const victimForIdentity = ((cmlCase?.cast ?? []) as any[])
    .find((c: any) => isVictimArchetype(c.role_archetype ?? c.role));
  const victimNameForIdentity = String(victimForIdentity?.name ?? '').trim();

  // Extract detective first name for the paragraph-opener diversity constraint (all chapters).
  const detectiveCastEntry = ((cmlCase?.cast ?? []) as any[]).find((c: any) =>
    String(c.role ?? '').toLowerCase() === 'detective' ||
    String((c as any).role_archetype ?? '').toLowerCase().includes('detective')
  );
  const detectiveFirstName: string = String(detectiveCastEntry?.name ?? '').trim().split(/\s+/)[0] ?? '';

  const clueMap = new Map<string, Clue>(
    (clueDistribution?.clues ?? []).map((c) => [c.id, c]),
  );
  const deliveryMethodMap = new Map<string, { delivery_method?: string; act_number?: number; scene_number?: number }>(
    ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
      .filter((e: any) => e?.clue_id)
      .map((e: any) => [String(e.clue_id), e]),
  );

  // Fix 5: Detect recently-interrogated suspects from beat history to prevent
  // repetitive confrontation scenes in consecutive chapters.
  const INTERROGATION_VERBS_RE = /\b(?:question(?:ed|ing)?|interrogat(?:ed|ing)?|confront(?:ed|ing)?|interview(?:ed|ing)?|accus(?:ed|ing)?|press(?:ed|ing)?|challeng(?:ed|ing)?)\b/i;
  const allSuspectNames: string[] = ((cmlCase.cast ?? []) as any[])
    .filter((c: any) => {
      const role = String(c.role_archetype ?? c.role ?? '').toLowerCase();
      return !role.includes('detective') && !isVictimArchetype(role) && !role.includes('narrator');
    })
    .map((c: any) => String(c.name ?? '').trim())
    .filter(Boolean);
  const recentlyInterrogatedSuspects = new Set<string>();
  if (narrativeState?.beatHistory && allSuspectNames.length > 0) {
    const recentBeats = (narrativeState.beatHistory as BeatFingerprint[]).slice(-8);
    for (const bfp of recentBeats) {
      for (const beat of bfp.beats) {
        if (INTERROGATION_VERBS_RE.test(beat)) {
          for (const suspectName of allSuspectNames) {
            const lastName = (suspectName.split(' ').pop() ?? suspectName);
            if (new RegExp(`\\b${lastName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(beat)) {
              recentlyInterrogatedSuspects.add(suspectName);
            }
          }
        }
      }
    }
  }

  // FIX-C3: Extract culprit alibi windows for per-chapter alibi consistency lock.
  const culpritNameSet = new Set<string>(
    ((cmlCase?.culpability?.culprits ?? []) as any[]).filter((n: any) => typeof n === 'string' && n)
  );
  const culpritAlibiLock = ((cmlCase?.cast ?? []) as any[])
    .filter((c: any) => culpritNameSet.has(String(c.name ?? '')))
    .map((c: any) => ({ name: String(c.name), alibiWindow: String(c.alibi_window ?? '').trim() }))
    .filter((c) => c.alibiWindow.length > 0);

  // A_64 §3.3 C3 — THE TIMELINE SPINE. The corpus's plot_structure complaint (96% deficit,
  // near-verbatim across 33 runs): "the timeline is muddled by multiple characters' conflicting
  // accounts". Root cause: each interrogation scene re-tells whereabouts freely, and retellings
  // drift. The spine pins every suspect's CLAIMED account once, canonically; every retelling must
  // match it verbatim in substance. Victims are excluded (no alibi to claim).
  const timelineSpine: string[] = ((cmlCase?.cast ?? []) as any[])
    .filter((c: any) => !isVictimArchetype(c.role_archetype ?? c.role))
    .map((c: any) => ({ name: String(c?.name ?? '').trim(), w: String(c?.alibi_window ?? '').trim() }))
    .filter((c) => c.name && c.w)
    .map((c) => `${c.name} claims: ${c.w}`);

  // B2: a "reveal-class" clue names the culprit or explains the tamper mechanism — the kind
  // Agent5 sometimes tags placement:'early', which previously forced the full solution into
  // an early chapter. Identified by clue id, by spoiler phrasing, or by containing a culprit
  // name. Used to suppress the early "who it implicates" reasoning in pre-reveal chapters.
  const culpritNamesLower = Array.from(culpritNameSet)
    .map((n) => String(n).trim().toLowerCase())
    .filter(Boolean);
  const isRevealClue = (clue: Clue | undefined): boolean => {
    if (!clue) return false;
    const id = String(clue.id ?? '').toLowerCase();
    if (/mechanism|culprit|visibility_core/.test(id)) return true;
    const text = `${clue.description ?? ''} ${clue.pointsTo ?? ''}`.toLowerCase();
    if (/\bbefore the discriminating test\b|\bcore mechanism\b|\bmechanism access point\b/.test(text)) return true;
    return culpritNamesLower.some((n) => text.includes(n));
  };

  // FIX-M3 + FIX-D1: Clue-stage embargo — controls what the LLM may state per stage.
  // Keyed off the controlled currentStageMode vocabulary (StageModeKey), NOT the
  // geometry-derived currentArcPosition. The old code keyed off currentArcPosition,
  // whose values ({opening, early, mid, pre_climax, resolution, ...}) NEVER intersected
  // the STAGE*_ARC sets ({investigation, suspect_pressure, testing, ...}), so the embargo
  // silently evaluated to tier 4 (no embargo) for EVERY chapter — which is how
  // run_1d55f7c7 forced the full culprit+mechanism reveal into Chapter 3.
  const STAGE_MODE_EMBARGO_TIER: Record<string, number> = {
    discovery_opening: 1,
    early_investigation: 1,
    suspect_pressure: 2,
    false_suspect_clearing: 2,
    clue_reinterpretation: 3,
    discriminating_test: 4,
    final_reveal: 4,
    aftermath_consequence: 4,
  };
  // Unknown/absent stage modes default to the RESTRICTIVE tier 2 (fail safe). The
  // legitimate reveal modes are explicitly mapped to tier 4 above, so they are never
  // over-restricted by this default.
  const clueStageForRun =
    currentStageMode && STAGE_MODE_EMBARGO_TIER[currentStageMode] !== undefined
      ? STAGE_MODE_EMBARGO_TIER[currentStageMode]
      : 2;

  const lines: string[] = ['CHAPTER OBLIGATION CONTRACT (MUST SATISFY):'];

  // A_86 item 2 — one weapon, and only it bears the marks. See isOneWeaponEnabled for the evidence.
  if (isOneWeaponEnabled()) {
    const declaredWeapon: string = (() => {
      const explicit = typeof (cmlCase as any)?.death_method === 'string' ? (cmlCase as any).death_method.trim() : '';
      if (explicit) return explicit;
      const cc = (cmlCase as any)?.meta?.crime_class ?? {};
      return (typeof cc.subtype === 'string' && cc.subtype.trim()) || (typeof cc.category === 'string' && cc.category.trim()) || '';
    })();
    if (declaredWeapon) {
      lines.push(
        `  - ⚠ ONE WEAPON (MANDATORY, whole-book): the victim was killed by — ${declaredWeapon}. That is the ` +
          `ONLY object in this story that may carry blood, a dark smear, a residue, a stain, hair or a wound. ` +
          `No second object is described as if it might have been the weapon, in this chapter or any other. ` +
          `Parts of the concealment mechanism (a wire, a chime hammer, a catch, a pulley) are NOT weapons and ` +
          `must never be given those marks. A reader who cannot say what killed the victim has been given two ` +
          `weapons where the case declared one.`,
      );
    }
  }

  // Era authenticity preamble — injected once per batch so the LLM never introduces
  // anachronistic terms regardless of how far the pronoun/clue blocks push the system
  // message down in the context window.
  const eraDecode: string = String(cmlCase?.meta?.era?.decade ?? '').trim();
  const ERA_FORBIDDEN: Record<string, string[]> = {
    '1860s': ['telephone','automobile','airplane','radio','television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1870s': ['telephone','automobile','airplane','radio','television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1880s': ['automobile','airplane','radio','television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1890s': ['airplane','radio','television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1900s': ['television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital','plastic'],
    '1910s': ['television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital','plastic'],
    '1920s': ['television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1930s': ['computer','internet','email','cell phone','mobile phone','smartphone','GPS','laptop','digital camera','text message','app','wifi','bluetooth','jet plane'],
    '1940s': ['internet','email','cell phone','mobile phone','smartphone','GPS','laptop','digital camera','text message','app','wifi','bluetooth'],
    '1950s': ['internet','email','cell phone','mobile phone','smartphone','GPS','laptop','digital camera','text message','app','wifi','bluetooth'],
  };
  const eraForbidden = ERA_FORBIDDEN[eraDecode];
  if (eraForbidden && eraForbidden.length > 0) {
    lines.push(`- ERA RULE (${eraDecode}): NEVER use these anachronistic terms: ${eraForbidden.map(t => `"${t}"`).join(', ')}. Any occurrence will cause the chapter to be rejected.`);
  }

  // Stage 9: tiered banned-phrase controls (hard/soft/watch) shared with runtime repair.
  const rolloutFlagsRaw = (getGenerationParams().agent9_prose as any)?.rollout_flags;
  const rolloutFlags = {
    tiered_phrase_contract_enabled:
      rolloutFlagsRaw?.tiered_phrase_contract_enabled !== false,
  };
  if (rolloutFlags.tiered_phrase_contract_enabled) {
    const phrasePolicy = getTieredBannedPhrasePolicy(cmlCase);
    if (phrasePolicy.hard.length > 0) {
      lines.push(
        `- STYLE HARD-BAN: NEVER use these phrase families: ${phrasePolicy.hard.map((p) => `"${p}"`).join(', ')}. Any occurrence triggers rejection/retry.`,
      );
    }
    if (phrasePolicy.soft.length > 0) {
      lines.push(
        `- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: ${phrasePolicy.soft.map((p) => `"${p}"`).join(', ')}.`,
      );
    }
    if (phrasePolicy.watch.length > 0) {
      lines.push(
        `- STYLE WATCHLIST: keep these patterns varied and scene-specific: ${phrasePolicy.watch.map((p) => `"${p}"`).join(', ')}.`,
      );
    }
  }

  const continuityTailRaw = typeof narrativeState?.continuityTail === 'string'
    ? narrativeState.continuityTail
    : '';
  const continuityTail = sanitizeContinuityTailForPrompt(continuityTailRaw);
  const continuityTailExcerpt = continuityTail.length > 220
    ? `${continuityTail.slice(0, 220).trimEnd()}...`
    : continuityTail;

  /**
   * A_89 B1 — which chapter OWNS each clue, so a later chapter refers to it instead of staging it
   * again. Resolved once for the whole outline; see `resolveClueOwnership` for the measurement.
   */
  const clueOwnership = isClueOwnershipEnabled()
    ? resolveClueOwnership(cmlCase, (allOutlineScenes ?? []) as any[])
    : null;

  (scenesForChapter as any[]).forEach((scene, idx) => {
    const chapterNumber = chapterStart + idx;
    const requiredClueIds = getRequiredClueIdsForScene(cmlCase, scene, allOutlineScenes);
    const sceneAct = Number(scene?.act);
    // P1-1: compute per-act scene number for clearance/DTS matching (same normalisation
    // as getRequiredClueIdsForScene — CML uses per-act numbers, outline uses global).
    const perActSceneNum = allOutlineScenes
      ? Number(scene?.sceneNumber) - allOutlineScenes.filter((s: any) => Number(s?.act) < sceneAct).length
      : Number(scene?.sceneNumber);
    const locationAnchor = String(scene?.setting?.location || scene?.location || '').trim();
    // Exact match uses per-act scene number so CML clue_to_scene_mapping aligns with outline.
    const exactClearances = clearanceScenes.filter((entry: any) =>
      sceneMatchesCmlSceneRef(
        scene,
        entry,
        allOutlineScenes,
        /\b(clear|cleared|clearance|alibi|ruled out|eliminat)/i,
      ),
    );
    const matchingClearances: typeof exactClearances = exactClearances.length > 0
      ? exactClearances
      : (() => {
          // ITEM 11 (#2): unmatched act clearances belong on the act's resolved reveal/DT
          // chapter — the chapter where the case is argued on-page. Attaching them to the
          // last chapter of the act unconditionally stacked a full clearance list onto the
          // aftermath chapter AFTER the reveal already delivered them (Ch9/Ch10 duplicated
          // reveal). Last-in-act remains the fallback only when neither the revelation
          // scene nor the DT scene resolves to a chapter within this act.
          const actScenes = dtResolutionScenes.filter((s: any) => Number(s?.act) === sceneAct);
          const anchorRefs: Array<{ ref: any; signal: RegExp }> = [
            {
              ref: proseRequirements.culprit_revelation_scene ?? null,
              signal: /\b(culprit|confront|confession|resolve|resolution|denouement|case\s+closed)/i,
            },
            { ref: dtScene ?? null, signal: DT_SIGNAL_RE },
          ];
          // Exact coordinate matches take precedence over keyword signals for BOTH refs, so
          // a keyword-only hit can never outrank the configured reveal/DT chapter.
          let anchorScene: any = null;
          for (const { ref } of anchorRefs) {
            if (!ref) continue;
            anchorScene = actScenes.find((s: any) => sceneMatchesCmlSceneRef(s, ref, allOutlineScenes)) ?? null;
            if (anchorScene) break;
          }
          if (!anchorScene) {
            for (const { ref, signal } of anchorRefs) {
              if (!ref) continue;
              anchorScene = actScenes.find((s: any) => sceneMatchesCmlSceneRef(s, ref, allOutlineScenes, signal)) ?? null;
              if (anchorScene) break;
            }
          }
          if (anchorScene) {
            return Number(anchorScene?.sceneNumber) === Number(scene?.sceneNumber)
              ? clearanceScenes.filter((entry: any) => Number(entry?.act_number) === sceneAct)
              : [];
          }
          // No reveal/DT chapter resolves in this act — only fire on the genuinely last
          // chapter of the act. With proseBatchSize=1 every batch has 1 scene, so
          // idx===length-1 is always true — which caused the fallback to fire for every
          // chapter in the act (#24). Check allOutlineScenes to find whether any scene with
          // the same act number has a higher sceneNumber than the current one. If there is
          // a later scene in the same act, this is not the clearance chapter yet.
          const isLastInAct = allOutlineScenes
            ? !allOutlineScenes.some(
                (s: any) => Number(s?.act) === sceneAct && Number(s?.sceneNumber) > Number(scene?.sceneNumber),
              )
            : idx === (scenesForChapter as any[]).length - 1;
          return isLastInAct
            ? clearanceScenes.filter((entry: any) => Number(entry?.act_number) === sceneAct)
            : [];
        })();

    /**
     * A_76 §14 — ONE OWNER PER CLEARANCE, AND NEVER THE FINALE.
     *
     * Everything above resolves independently for every chapter, so the last chapters all claim the
     * same act-3 roster. MEASURED across 557 prose prompts: 172 carry the MANDATORY clearance demand,
     * at ch8 (37), ch9 (74) and ch10 (61) and nowhere else — and on the complained-about run the
     * byte-identical suspect list went to all three. We ordered the roll-call three times and the
     * lint gate regenerated any chapter that omitted it, which is why three rounds of prohibition
     * text could not win.
     *
     * The exclusivity above was meant to prevent this and cannot, because its exact-match branch is
     * dead: the CML numbers scenes against a nominal ~6-scene story and the outline numbers them
     * globally, so only 1 of 116 refs across 29 books ever matches. See `clearance-ownership.ts` for
     * the reconciliation.
     *
     * Applied as a FILTER on top of the existing resolution rather than a replacement: with the flag
     * off the block is byte-identical, and with it on a chapter can only keep the suspects it owns.
     *
     * Flag-gated `AGENT9_CLEARANCE_OWNERSHIP`, read at call time.
     */
    let ownedClearances = matchingClearances;
    if (isClearanceOwnershipEnabled() && Array.isArray(allOutlineScenes) && allOutlineScenes.length > 0) {
      const clearanceOwnership = resolveClearanceOwnership({
        clearanceScenes,
        allOutlineScenes: allOutlineScenes as any[],
        excludeSuspects: [..._victimNamesForClearance],
      });
      const owned = new Set(
        (clearanceOwnership.suspectsByScene.get(Number(scene?.sceneNumber)) ?? [])
          .map((n) => String(n).trim().toLowerCase()),
      );
      ownedClearances = matchingClearances.filter((entry: any) =>
        owned.has(String(entry?.suspect_name ?? entry?.suspect ?? "").trim().toLowerCase()));
    }
    // ITEM 11 (#3): keyword fallback only when no exact DT match exists anywhere (see
    // dtHasExactMatch above) — the DT contract is exclusive to the exact-matched chapter.
    /**
     * A_87 P4 — a KEYWORD-derived DT claim must not delete the reveal contract.
     *
     * `isRevealChapter` below is `!isDiscriminatingTestChapter && …`, so the two contracts are
     * mutually exclusive by construction. That is right when the DT chapter is known by coordinate
     * and dangerous when it is guessed from a word: `DT_SIGNAL_RE` contains `test|prove|
     * discriminating`, and on run mystery-1789140940497 it matched 5 of 10 scenes INCLUDING BOTH
     * `revelation` beats — scene 10, "Confronting Quentin Everleigh", matched on the word
     * "discriminating". The reveal chapter was classified as the DT chapter and all five reveal
     * obligations were emitted nowhere. MEASURED across the archive: this loses the reveal contract
     * entirely on 11 of 45 runs (24%), and in 10 of those 11 a reveal scene existed.
     *
     * So when the DT claim came from the KEYWORD path and the scene's own beat says `revelation`,
     * the beat wins. Narrow on purpose: an exact or global-scene DT match is never overridden, and a
     * keyword DT claim on a non-revelation beat still stands.
     *
     * Largely belt-and-braces once P2 is on — a resolving DT ref makes `dtHasExactMatch` true and
     * retires the keyword path — but it is the safety net for a ref that resolves to nothing at all.
     */
    /**
     * Factored so the reveal arbitration below can ask the same question of OTHER scenes: "would the
     * DT contract still hold this one?". Handing the reveal to a scene the DT keeps is how one of the
     * two remaining losses happened (A_87 §8.5).
     */
    const dtClaimStandsFor = (candidate: any): boolean => {
      if (!dtScene) return false;
      const path: SceneRefPath = dtHasExactMatch
        ? resolveSceneRef(candidate, dtScene, allOutlineScenes)
        : resolveSceneRef(candidate, dtScene, allOutlineScenes, DT_SIGNAL_RE);
      if (path === "none") return false;
      const keywordOnly = path === "signal";
      const beatIsRevelation = String(candidate?.beat ?? "").toLowerCase() === "revelation";
      return !(isSceneRefArbitrationEnabled() && keywordOnly && beatIsRevelation);
    };
    const dtPath: SceneRefPath = dtHasExactMatch
      ? resolveSceneRef(scene, dtScene, allOutlineScenes)
      : resolveSceneRef(scene, dtScene, allOutlineScenes, DT_SIGNAL_RE);
    const dtClaimIsKeywordOnly = dtPath === "signal";
    const sceneBeatIsRevelation = String((scene as any)?.beat ?? "").toLowerCase() === "revelation";
    const dtClaimYieldsToRevealBeat =
      isSceneRefArbitrationEnabled() && dtClaimIsKeywordOnly && sceneBeatIsRevelation;
    const isDiscriminatingTestChapter = dtPath !== "none" && !dtClaimYieldsToRevealBeat;

    // Post-reveal naming constraint — fires for chapters that come after the revelation
    // scene so the LLM doesn't replace the culprit's name with role aliases.
    const revelationSceneRef = proseRequirements.culprit_revelation_scene ?? null;
    const isPostRevealChapter = !isDiscriminatingTestChapter &&
      revelationSceneRef != null && (
        Number(scene?.act) > Number(revelationSceneRef.act_number) ||
        (Number(scene?.act) === Number(revelationSceneRef.act_number) &&
          Number(scene?.sceneNumber) > Number(revelationSceneRef.scene_number) &&
          perActSceneNum > Number(revelationSceneRef.scene_number))
      );

    // Hoisted above the clue loop so reveal-class clue deferral (B2) can use it. Detects
    // the chapter that contains the culprit-revelation scene.
    const revelationScene = proseRequirements.culprit_revelation_scene ?? null;
    /**
     * A_87 P4b — a signal-only reveal claim must not land on TWO chapters.
     *
     * REVEAL_SIGNAL_RE matches on confront/resolve/culprit, and 19 of 45 archived outlines carry two
     * `revelation` beats, so the keyword routinely claims both. MEASURED over the 45 archived
     * (cml, outline) pairs with the real `buildChapterObligationBlock`: the reveal contract lands on
     * exactly one chapter in 27, on none in 11, and on TWO in 7. Enabling the DT arbitration above
     * alone moves that to 31 / 2 / 12 — it rescues nine lost contracts but converts five of them into
     * duplicates, which is the ch8-repeats-ch9 complaint arriving from the other direction.
     *
     * So when the claim is keyword-derived and more than one scene answers it, the LAST such scene
     * keeps it. MEASURED: the last `revelation`-beat scene IS the final scene of the book in 44 of 45
     * outlines, so "last" is the reveal in practice, not merely a tie-break.
     *
     * An exact (or global-scene) coordinate match is never overridden — only the guess is arbitrated.
     */
    const revealPath: SceneRefPath = revelationScene
      ? resolveSceneRef(scene, revelationScene, allOutlineScenes, REVEAL_SIGNAL_RE)
      : "none";
    /**
     * A_87 P4c — pick ONE winner explicitly, rather than only suppressing losers.
     *
     * Two failure modes remained after P4b, traced against the archive:
     *   1. The last keyword claimant was itself still held by the DT contract, so suppressing the
     *      earlier claimant left the reveal on nobody (787500681232: ch8 and ch9 both claim, ch9 is
     *      "The Culprit Revealed" but its beat is `final_trap`, so the DT keeps it).
     *   2. No scene matched REVEAL_SIGNAL_RE at all, because the outline never uses the words
     *      culprit/confront/confession (787512796199: the reveal chapter is titled "Clearing the
     *      Innocent and Confirming the ...").
     *
     * So: a resolved coordinate wins outright; failing that the LAST keyword claimant the DT does not
     * hold; failing that the LAST `revelation`-beat scene the DT does not hold. MEASURED: the last
     * `revelation`-beat scene is the final scene of the book in 44 of 45 archived outlines, so the
     * beat is a real resolver here and not a tie-break of last resort.
     */
    let revealWinnerSceneNumber: number | null = null;
    if (isSceneRefArbitrationEnabled() && revelationScene != null && Array.isArray(allOutlineScenes)) {
      const scenes = allOutlineScenes as any[];
      const pathOf = (candidate: any): SceneRefPath =>
        resolveSceneRef(candidate, revelationScene, allOutlineScenes, REVEAL_SIGNAL_RE);
      /**
       * A_89 B3 — the aftermath chapter can never be the reveal chapter.
       *
       * ITEM 11 already established this for the stage mode: when an earlier `final_trap` chapter
       * names the culprit on-page, the closing `revelation` chapter is aftermath. The obligation
       * block asked the question separately and answered it differently, so chapter 10 received the
       * reveal contract AND the aftermath contract — "walk the full evidence chain" beside "do NOT
       * end on the arrest/confession line". MEASURED: that collision is in 37 of the 39 runs where
       * the reveal contract was assigned, and A_87's "last revelation beat wins" rule made it
       * universal, because the last revelation beat is the final scene in 44 of 45 outlines.
       *
       * Both sides now defer to `isAftermathFinalScene`, so they cannot disagree.
       */
      const pool = scenes.filter((candidate) => !isAftermathFinalScene(candidate, scenes));
      const aftermathExcluded = pool.length < scenes.length;
      const byCoordinate = pool.filter((c) => {
        const pathForCandidate = pathOf(c);
        return pathForCandidate === "exact" || pathForCandidate === "global-scene";
      });
      const freeKeywordClaimants = pool.filter((c) => pathOf(c) === "signal" && !dtClaimStandsFor(c));
      const freeRevelationBeats = pool.filter(
        (c) => String(c?.beat ?? "").toLowerCase() === "revelation" && !dtClaimStandsFor(c),
      );
      /**
       * When the aftermath chapter IS the only revelation beat, ITEM 11's own premise says where the
       * reveal went: the culprit is named on-page in the `final_trap` chapter. So that chapter takes
       * the contract. Without this the pool empties and the reveal lands nowhere — measured at 12/45
       * assigned before this clause was added, against 45/45 with it.
       */
      const trapBeats = aftermathExcluded
        ? pool.filter((c) => String(c?.beat ?? "").toLowerCase() === "final_trap" && !dtClaimStandsFor(c))
        : [];
      const winner =
        byCoordinate[byCoordinate.length - 1] ??
        freeKeywordClaimants[freeKeywordClaimants.length - 1] ??
        freeRevelationBeats[freeRevelationBeats.length - 1] ??
        trapBeats[trapBeats.length - 1] ??
        null;
      revealWinnerSceneNumber = winner ? Number(winner.sceneNumber) : null;
    }
    /**
     * A_89 B3 — and a belt-and-braces check on the chapter actually being built: a chapter whose
     * STAGE MODE is `aftermath_consequence` never carries the reveal contract, whatever the winner
     * selection above concluded. The two are computed from the same predicate now, so this should be
     * unreachable; it is here because the collision it prevents cost three marks once already.
     */
    const stageModeIsAftermath =
      String(currentStageMode ?? "").toLowerCase() === "aftermath_consequence";
    const isRevealChapter = isSceneRefArbitrationEnabled() && revelationScene != null
      ? (!isDiscriminatingTestChapter &&
         !stageModeIsAftermath &&
         revealWinnerSceneNumber != null &&
         revealWinnerSceneNumber === Number((scene as any)?.sceneNumber))
      : (!isDiscriminatingTestChapter && revealPath !== "none");
    // A pre-reveal chapter is any investigation chapter strictly before the
    // discriminating-test / revelation / aftermath chapters. Reveal-class clues (those
    // that name the culprit or explain the tamper mechanism) must NOT have their
    // "who it implicates" reasoning forced into these chapters.
    const isPreRevealChapter = !isDiscriminatingTestChapter && !isRevealChapter && !isPostRevealChapter;

    // A_65 Phase 1 — the scene's register text (beat/title/purpose/summary), used by the
    // false-solution license below and the C3 interrogation contract further down.
    const sceneRegisterBlob = `${String((scene as any)?.beat ?? '')} ${String((scene as any)?.title ?? '')} ${String((scene as any)?.purpose ?? '')} ${String((scene as any)?.summary ?? '')}`;
    // The false-solution chapter is the FIRST licensed reasoning beat: it MUST reason visibly —
    // honestly, to the wrong conclusion the evidence permits.
    const isFalseSolutionChapter =
      isPreRevealChapter && /false.?solution|false theory|wrong (?:theory|conclusion)|convincing (?:wrong|false)/i.test(sceneRegisterBlob);

    lines.push(`- Chapter ${chapterNumber}:`);
    // [PHASE 5] Inject structural archetype contract
    if (macroArcPlan) {
      const arcEntry = macroArcPlan.find((e) => e.chapter === chapterNumber);
      if (arcEntry) {
        lines.push(`  - STRUCTURAL ARCHETYPE — Chapter ${chapterNumber} must be: ${arcEntry.archetype}`);
        lines.push(`      ✓ MUST contain: ${arcEntry.mustContain}`);
        lines.push(`      ✗ MUST NOT contain: ${arcEntry.mustNotContain}`);
      }
    }
    if (wordTarget) {
      lines.push(`  - Word count: Target ${wordTarget.targetWords} words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.`);
    }
    if (isPostRevealChapter) {
      const postRevealCulpritNames: string = ((cmlCase?.culpability?.culprits ?? []) as any[])
        .filter((n: any) => typeof n === 'string' && n).join(' and ');
      if (postRevealCulpritNames) {
        lines.push(`  - POST-REVEAL NAMING: the culprit has been unmasked. Refer to ${postRevealCulpritNames} by name. Do NOT use "the killer", "the murderer", "the culprit", "the criminal", or any similar role label as a substitute for ${postRevealCulpritNames}'s name.`);
      }
    }

    if (chapterNumber === 1 && victimNameForIdentity) {
      lines.push(`  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "${victimNameForIdentity}" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming ${victimNameForIdentity} in the same paragraph.`);
    }
    // A_65 Phase 1 — THE WITHHELD-INFERENCE CONTRACT. The 33-run corpus's unified syndrome
    // (clues unearned · exposition drag · report-register prose · confession-reveal) traces to
    // the old instant-inference mandate: every clue was observed AND explained on arrival, so
    // nothing was ever withheld (A_65 F3: chapter 1 carried the solved contradiction). Inference
    // is now RATIONED: pre-reveal chapters observe; reasoning is licensed at exactly three beats
    // — the false solution (honestly wrong), the discriminating test, and the walked reveal.
    if (isFalseSolutionChapter) {
      lines.push(`  - ⚖ REASONING LICENSED (the false solution): this chapter MAY and SHOULD reason visibly — honestly, to the WRONG conclusion the evidence permits. Cite real observations the reader has seen; let the error be a fair misreading of true clues, never stupidity. This is the story's first assembled theory.`);
    } else if (isPreRevealChapter) {
      lines.push(`  - ⛔ INFERENCE EMBARGO (pre-reveal): observations ACCUMULATE here; explicit deduction ("therefore", "which proved", "could only mean", if-A-and-B-then-C assembly of locked values) is RESERVED for the false-solution, discriminating-test, and reveal chapters. Characters may wonder, doubt, or fall silent over a detail — never explain it.`);
    }
    // A_91 — the two beats. Per chapter, one named character each, deterministic.
    if (isWitBeatEnabled()) {
      lines.push(...buildWitBeatLines(selectWitBeat(characterProfiles ?? [], chapterNumber), HUMOUR_STYLES));
    }
    if (isDepthBeatEnabled()) {
      lines.push(...buildDepthBeatLines(selectDepthBeat(characterProfiles ?? [], chapterNumber)));
    }
    lines.push(`  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.`);
    if (isLocationLabelProseEnabled() && locationAnchor) {
      lines.push(`  - Scene is set in ${renderLocationForProse(locationAnchor)} — name the place as a character would, within the paragraph, never as your opening phrase, and never as the label above.`);
    } else {
      lines.push(`  - Scene is set in: ${locationAnchor || 'the canonical scene location'} — reference it naturally within the paragraph, never as your opening phrase.`);
    }
    lines.push(`  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: ${formatGroundingMarkers(OPENING_ATMOSPHERE_MARKERS)}. A chapter that omits all of these from its opening paragraph will be rejected.`);
    // OPENER DIVERSITY: Validator-enforced constraint preventing protagonist-name dominance
    // across paragraph openers. Fires for all chapters since the protagonist's name is the
    // most common repeated-opener trigger across runs.
    if (detectiveFirstName) {
      lines.push(
        `  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "${detectiveFirstName}" or "${detectiveFirstName}'s" as the first word. ` +
        `You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. ` +
        `Opening 3 or more paragraphs with "${detectiveFirstName}" will cause automated rejection.`
      );
    }
    // FIX-P2: First chapter — investigator-role establishment requirement.
    // Prevents the LLM from deferring authority to an off-screen "real detective" who never arrives.
    if (chapterNumber === 1) {
      const detectiveName = ((cmlCase?.cast ?? []) as any[]).find((c: any) =>
        String(c.role ?? '').toLowerCase() === 'detective' ||
        String((c as any).role_archetype ?? '').toLowerCase().includes('detective')
      )?.name ?? '';
      if (detectiveName) {
        lines.push(`  - INVESTIGATOR ESTABLISHMENT REQUIRED: ${detectiveName} must claim or be recognised as the investigator in this chapter. Establish ${detectiveName} as the detective-in-charge within the first two paragraphs — ${detectiveName} IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. ${detectiveName} begins the investigation in this chapter.`);
      }
    };

    // B2: Ch1 body-first — victim body must appear in the first two paragraphs.
    if (chapterNumber === 1) {
      lines.push(
        `  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. ` +
        `Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. ` +
        `Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.`
      );
      // A_71 — plant the weapon at discovery (external review of story_20260731-1650).
      // The murder weapon was declared in the reveal ("the fatal blow was delivered with the clock")
      // but its physical evidence was never observed at the scene, so the method read as ASSERTED
      // rather than DISCOVERED. Planting the observable facts here is what lets the reveal land as
      // a deduction the reader could have made.
      lines.push(
        `  - ⛔ WEAPON PLANTED AT DISCOVERY (Chapter 1 only): if an object at the scene is the murder weapon, its physical condition must be OBSERVED here without being named as the weapon. ` +
        `Show at least two of: damage to the object consistent with impact; a transfer on it (blood, hair, fibre, residue); an injury on the body whose shape or position matches it; its weight, position, or the effort it would take to move. ` +
        `Describe what is seen, never what it means — the investigator must not conclude, or even speculate, that this object is the weapon. A reader should be able to look back after the reveal and find the proof already on the page.`
      );
    }

    // Mechanism spoiler ban — fires for the early/mid investigation stages (embargo tier
    // 1–2: discovery, early_investigation, suspect_pressure, false_suspect_clearing).
    // Previously hardcoded to chapterNumber <= 2, which left every later pre-reveal chapter
    // (e.g. the suspect-pressure chapter that leaked in run_1d55f7c7) unprotected.
    if (clueStageForRun <= 2) {
      lines.push(
        `  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. ` +
        `Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. ` +
        `WRONG: "The culprit had altered the device by forty minutes to create a false alibi." ` +
        `RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."`
      );
    }

    if (continuityTailExcerpt && idx === 0) {
      lines.push(
        `  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. ` +
        `Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "${continuityTailExcerpt}".`,
      );
    } else if (idx > 0) {
      lines.push(
        `  - Inter-chapter handoff: Chapter ${chapterNumber} must open by continuing unresolved pressure from the end of Chapter ${chapterNumber - 1}. ` +
        `Use a concrete bridge (same object, question, movement trail, or emotional beat), not a reset atmosphere paragraph.`,
      );
    }

    /**
     * A_89 B1 — a clue is DRAMATIZED in the chapter that owns it and REFERRED TO afterwards.
     *
     * Every scene listing a clue in `cluesRevealed` (or mapped to it) previously received the same
     * "MUST be dramatized" instruction, so the model staged the same evidence repeatedly. MEASURED
     * over 47 runs: a 41% median re-mandate rate. Applying ownership to the 45 archived outlines
     * takes the mean from 30.5 obligations per book to 24.4, and the heaviest single chapter seen
     * from 18 to 9 — which is the "proof becomes a speech" complaint at its source.
     *
     * The clue is NOT removed from the chapter: `getRequiredClueIdsForScene` still reports it, so
     * validation still accepts it there. Only the ASK changes.
     */
    const ownedClueIds = clueOwnership
      ? requiredClueIds.filter((id) => clueOwnership.get(id) === Number((scene as any)?.sceneNumber))
      : requiredClueIds;
    const inheritedByMap = clueOwnership
      ? requiredClueIds.filter((id) => clueOwnership.get(id) !== Number((scene as any)?.sceneNumber))
      : [];
    // A_90 §12 — ownership by the PAGE: a clue the model already staged in an earlier chapter is
    // inherited whatever the map says (run 81042: 11 of 14 obligations in chapters 3–6 re-mandated
    // evidence already on earlier pages; chapter 4 re-staged chapter 3's testimony line for line).
    const pageOwnership = isClueOwnershipByPageEnabled() && Array.isArray(priorChapters) && priorChapters.length > 0
      ? partitionCluesByPage(
          ownedClueIds,
          priorChapters,
          clueDistribution,
          ((cmlCase?.cast ?? []) as any[]).map((c: any) => String(c?.name ?? '')).filter(Boolean),
          // A_90 §13: the reveal and the discriminating test never retire an obligation.
          isRevealChapter || isDiscriminatingTestChapter,
        )
      : null;
    const ownedAfterPage = pageOwnership ? pageOwnership.pending : ownedClueIds;
    const inheritedClueIds = pageOwnership
      ? [...inheritedByMap, ...ownedClueIds.filter((id) => pageOwnership.onPage.has(id))]
      : inheritedByMap;

    if (inheritedClueIds.length > 0) {
      const named = inheritedClueIds
        .map((id) => {
          const clue = clueMap.get(id);
          const terms = clue ? surfaceSpecKeyTerms(String(clue.observable ?? clue.description ?? ''), 4) : '';
          const owner = pageOwnership?.onPage.get(id) ?? clueOwnership?.get(id);
          return terms ? `${terms}${owner ? ` (first shown in chapter ${owner})` : ''}` : '';
        })
        .filter(Boolean);
      if (named.length > 0) {
        lines.push(
          `  - ALREADY ON THE PAGE — refer, do NOT re-stage: ${named.join('; ')}. ` +
          `These were dramatized earlier. A character may MENTION one in passing, or reason from it, ` +
          `but do not describe the discovery again, do not re-list the evidence, and do not restate ` +
          `what it proves. Re-staging reads as a recap and an external reader has named it twice.`,
        );
      }
    }

    if (ownedAfterPage.length > 0) {
      lines.push(`  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:`);
      lines.push(`    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a`);
      lines.push(`    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's`);
      lines.push(`    description sentence verbatim into the prose FAILS validation.`);
      for (const clueId of ownedAfterPage) {
        const clue = clueMap.get(clueId);
        if (clue) {
          const isDeferredReveal = isPreRevealChapter && isRevealClue(clue);
          const earlyFlag = clue.placement === 'early'
            ? ' ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter'
            : '';
          lines.push(`    • ${surfaceSpecKeyTerms(deriveClueObservable(clue))} [${clueId}]${earlyFlag}`);
          if (isDeferredReveal) {
            // Reveal-class clue in a pre-reveal chapter: surface the OBSERVABLE anomaly but
            // withhold the solution. The "Points to" (who it implicates) line and the
            // reasoning paragraph are SUPPRESSED here — they are what forced the
            // culprit + mechanism into early chapters in run_1d55f7c7.
            lines.push(`      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.`);
            lines.push(`         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.`);
            lines.push(`         Present it as an unexplained discrepancy; the culprit and method are revealed later.`);
            if (clue.placement === 'early') {
              lines.push(`         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).`);
            }
          } else if (isPreRevealChapter) {
            // A_65 Phase 1 — the old branch here mandated a ¶2 that "explicitly reasons about what
            // this evidence implies" for every early clue, which serialized the deduction across
            // chapters 1–8 and left the reveal nothing to assemble. Observation only, meaning later.
            lines.push(`      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies.${clue.placement === 'early' ? ' Place the observation in paragraph 1 or 2.' : ''}`);
          } else {
            // Licensed chapters (discriminating test / reveal) keep the clue's meaning — the walk
            // and the test cite what each clue proves.
            lines.push(`      Points to: ${surfaceSpecKeyTerms(String(clue.pointsTo ?? ''))}`);
          }
        } else {
          // Fallback: no distribution data — use delivery_method from clue_to_scene_mapping if available
          const mapping = deliveryMethodMap.get(clueId);
          const fallbackDesc = mapping?.delivery_method
            ? mapping.delivery_method.trim()
            : 'observable evidence relevant to the investigation';
          const isEarlyMapping = Number(mapping?.act_number) === 1;
          const earlyFlagFallback = isEarlyMapping
            ? ' ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter'
            : '';
          lines.push(`    • ${fallbackDesc} [${clueId}]${earlyFlagFallback}`);
          if (isPreRevealChapter) {
            // A_65 Phase 1 — fallback branch: same inversion as above (observe; never explain).
            lines.push(`      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE but must NOT state what it implies.${isEarlyMapping ? ' Place the observation in paragraph 1 or 2.' : ''}`);
          } else {
            lines.push(`      Points to: what this observation reveals about the time or circumstances of the crime.`);
          }
        }
      }
    } else {
      lines.push(`  - Clue obligations: none for this chapter.`);
    }

    // A_64 §3.3 C1 — PLANT obligations: the outline (applyPlantBeforeReveal / the scheduler's
    // plant_clue) stamped essential clues to APPEAR here incidentally, ≥2 scenes before their
    // reveal. The corpus's #1 deficit is "clues introduced too late / not foreshadowed — unearned":
    // the plant is the foreshadow. The clue is ON the page; its significance is NOT.
    const cluesPlanted: string[] = Array.isArray((scene as any)?.cluesPlanted)
      ? ((scene as any).cluesPlanted as any[]).map(String)
      : [];
    if (cluesPlanted.length > 0) {
      lines.push(`  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:`);
      for (const clueId of cluesPlanted) {
        const clue = clueMap.get(clueId);
        const observable = clue ? surfaceSpecKeyTerms(deriveClueObservable(clue)) : 'the physical detail this clue concerns';
        lines.push(`    • ${observable} [plant:${clueId}]`);
      }
      lines.push(`    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.`);
    }

    // DIAGNOSIS-BATCH #2 — MOTIVE BEAT obligation: applyMotivePlantBeforeReveal (agent7-run.ts)
    // stamped this scene to carry a motive-behavioral beat for the culprit, ≥2 scenes before the
    // reveal. Same shape as the PLANT OBLIGATIONS block above (incidental, unflagged), applied to
    // BEHAVIOR rather than a physical clue. MEASURED twice: the 84/100 read ("plant it earlier with
    // one small moment") and the 78/100 read ("give Kestrel one stronger motive scene"), on two
    // different culprits — the same ask both times.
    //
    // The actual motive is deliberately NOT re-stated here. MOTIVE LOCK (prompt-builder.ts) already
    // delivers the culprit's real motive to every chapter's prompt that has a culprit at all; this
    // block only marks that THIS chapter owes the behavioral beat, and points back at that single
    // source rather than quoting the motive a second time — two components describing one motive
    // would risk disagreeing (CLAUDE.md's evidence standard).
    const motiveBeatCulprit = String((scene as any)?.motiveBeatCulprit ?? "").trim();
    if (motiveBeatCulprit) {
      lines.push(`  - MOTIVE BEAT OBLIGATION (incidental appearance): ${motiveBeatCulprit} must do or say something small and visible in this chapter that is consistent with the motive stated under MOTIVE LOCK above — a reaction, a refusal, a physical tell, an evasion — WITHOUT stating the motive, explaining it, or revealing guilt. The moment should read as ordinary in the scene; do not flag its importance. Its significance surfaces only at the reveal.`);
    }

    // A_64 §3.3 C3 — timeline spine + the ONE-QUESTION rule for interrogation/alibi scenes.
    // "Drags during repetitive alibi discussions" (pacing, 90% deficit) + "timeline muddled by
    // conflicting accounts" (plot_structure, 96%): an interrogation scene that re-litigates the
    // whole board both drags AND drifts. Scope: investigation-register scenes before the reveal.
    // (sceneRegisterBlob hoisted above for the A_65 false-solution license.)
    const isInterrogationScene =
      isPreRevealChapter && /\b(alibi|interrogat|question|witness|statement|whereabouts|movement|enquir|inquir)/i.test(sceneRegisterBlob);
    if (isInterrogationScene) {
      if (timelineSpine.length > 0) {
        lines.push(`  - TIMELINE SPINE (canonical claimed accounts — every retelling must MATCH these in substance; accounts may be doubted, but what a character CLAIMS never drifts between chapters):`);
        for (const entry of timelineSpine.slice(0, 8)) lines.push(`      · ${entry}`);
      }
      // The one-question rule stands even when no alibi windows exist to pin (probe review: gating
      // it on the spine silently dropped the pacing contract wherever Agent 3 left alibi_window empty).
      lines.push(`  - ONE-QUESTION RULE: this scene RESOLVES OR SHARPENS EXACTLY ONE timeline question (pick the one this chapter's clue/clearance obligations serve). It may restate AT MOST ONE already-established fact for context. Do NOT re-summarize other suspects' accounts, do NOT re-litigate settled points — the scene ends with its one question visibly answered, or visibly sharpened into a better question.`);
    }

    // Fix 5: Interrogation differentiation — if this scene interrogates a suspect who was
    // already interrogated in a recent chapter, inject a mandatory differentiation directive.
    if (recentlyInterrogatedSuspects.size > 0) {
      const sceneText = [
        String(scene?.purpose ?? ''),
        String(scene?.description ?? ''),
        String(scene?.title ?? ''),
      ].join(' ').toLowerCase();
      if (INTERROGATION_VERBS_RE.test(sceneText)) {
        for (const suspectName of recentlyInterrogatedSuspects) {
          const lastName = (suspectName.split(' ').pop() ?? suspectName).toLowerCase();
          if (sceneText.includes(lastName) || sceneText.includes(suspectName.toLowerCase())) {
            lines.push(
              `  - ⛔ DIFFERENTIATION REQUIRED: ${suspectName} has already been questioned in a recent chapter.`,
              `    Do NOT re-stage the same confrontation style. Instead advance the investigation past it:`,
              `    • Examine physical evidence connected to ${suspectName}`,
              `    • Reveal a new contradiction in ${suspectName}'s account via a third party or document`,
              `    • Show ${suspectName} in an unguarded moment (not direct detective questioning)`,
              `    This chapter must establish new information not already given in prior ${suspectName} scenes.`,
            );
            break;
          }
        }
      }
    }

    // Tonal contrast — omit for discriminating test/revelation chapters that must sustain maximum tension
    if (!isDiscriminatingTestChapter) {
      lines.push(`  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.`);
    }

    // FIX-D2: Confrontation escalation rule — a second confrontation arc must differ materially.
    // Fires when the current macro-arc archetype is CONFRONTATION and a prior chapter already
    // used that archetype (detected via macroArcPlan).
    if (macroArcPlan) {
      const chapterNumForArc = chapterNumber;
      const arcEntry = macroArcPlan.find((e: any) => Number(e.chapter) === chapterNumForArc);
      const isConfrontationChapter = String(arcEntry?.archetype ?? '').toUpperCase() === 'CONFRONTATION';
      const priorConfrontation = macroArcPlan.some(
        (e: any) => Number(e.chapter) < chapterNumForArc && String(e.archetype ?? '').toUpperCase() === 'CONFRONTATION',
      );
      if (isConfrontationChapter && priorConfrontation) {
        lines.push(
          `  - ⛔ CONFRONTATION ESCALATION REQUIRED: a confrontation scene has already occurred in a prior chapter.`,
          `    This exchange MUST end differently. One of the following is required:`,
          `    (a) New physical evidence is produced or discovered during the exchange.`,
          `    (b) The suspect reveals a detail not stated anywhere in the story until now.`,
          `    (c) The investigator revises their theory as a direct result of this encounter.`,
          `    Do NOT write a confrontation that ends without new information entering the story.`,
        );
      }
    }

    // FIX-M3 + FIX-D1: Clue-stage embargo — restrict how much the LLM may reveal.
    if (clueStageForRun <= 3) {
      lines.push(`  - CLUE DISCLOSURE RULE (Stage ${clueStageForRun}/4):`);
      if (clueStageForRun === 1) {
        lines.push(`    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.`);
      } else if (clueStageForRun === 2) {
        lines.push(`    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.`);
      } else {
        lines.push(`    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.`);
      }
      lines.push(`    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.`);
      lines.push(`    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.`);
    }
    if (currentStageMode === 'suspect_pressure' || currentArcPosition === 'suspect_pressure') {
      lines.push(`  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.`);
    }

    if (ownedClearances.length > 0) {
      lines.push(`  - ⚠ SUSPECT CLEARANCE REQUIRED (MANDATORY): each suspect below must be ruled out on-page — dramatised in the scene's action and dialogue, not recited as a verdict:`);
      for (const clearance of ownedClearances) {
        const realClueIds = Array.isArray(clearance.supporting_clues)
          ? (clearance.supporting_clues as string[]).filter((id: string) => id && !id.match(/^clue_id_\d+$/))
          : [];
        const clueRef = realClueIds.length > 0 ? ` Cite clues: ${realClueIds.join(', ')}.` : '';
        // A_67 FIX-1 (de-register): guidance, not a copy-me template. Keep the suspect name and the
        // clearance method so the obligation is concrete, but ask for the clearance to be dramatised
        // across the scene rather than compressed into one report-register sentence.
        lines.push(`    • "${clearance.suspect_name}": somewhere in this chapter, name ${clearance.suspect_name} and show — through a witness's words, a physical record, or the detective's observation — the clearance method ("${clearance.clearance_method}") that rules them out, then let the conclusion that they could not have done it land naturally in the prose. Use ordinary clearing language ("cleared", "ruled out", "innocent", "alibi holds", "could not have") woven into the scene across as many sentences as it takes; do not compress it into one flat report line, and show how the alibi was confirmed rather than merely asserting it.${clueRef}`);
      }
      if (isClearingHumanBeatEnabled() && ownedClearances.length > 0) {
        // A_86 item 5 — the difference between the clearing chapter that scored 85 and the ones two
        // reviewers asked to have "trimmed" was not length. It was that each clearance carried a
        // human beat: *"Chapter 9's clearances are acceptable because they give Gerald, Harriet and
        // Halloway emotional CLOSURE, not just legal clearance. Gerald apologizing to Harriet is a
        // good human beat."* That is countable, so it is asked for as one.
        lines.push(
          `  - ✅ CLEAR THE PERSON, NOT THE ALIBI: each clearance above must also land ONE human beat ` +
            `between two named characters — an apology, a resentment finally said aloud, a thanks, a ` +
            `reconciliation, an admission of what they had assumed. A suspect who is exonerated and ` +
            `unchanged has been processed, not cleared. Never the same beat twice in this chapter.`,
        );
      }
    }
    // FIX-C3: Alibi consistency lock — culprit's established alibi window must not be contradicted.
    if (culpritAlibiLock.length > 0) {
      for (const { name, alibiWindow } of culpritAlibiLock) {
        lines.push(`  - ALIBI LOCK: ${name}'s established alibi is "${alibiWindow}". Do NOT place ${name} at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.`);
      }
    }
    // FIX-M2: Culprit testimony continuity — for chapters 2+, any specific time, place, or
    // claim already made by the culprit must not be altered or contradicted.
    if (chapterNumber > 1) {
      const _m2CulpritNames = ((cmlCase?.culpability?.culprits ?? []) as any[])
        .map((n: any) => String(n).trim())
        .filter(Boolean);
      if (_m2CulpritNames.length > 0) {
        const _m2List = _m2CulpritNames.join(' and ');
        lines.push(`  - TESTIMONY CONTINUITY: ${_m2List} has already made statements in earlier chapters. Any time, location, or claim attributed to ${_m2List} in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.`);
      }
    }
    if (isDiscriminatingTestChapter) {
      const dtDetails = cmlCase.discriminating_test ?? {};
      const dtMethod = dtDetails.method ?? 'confrontation';
      const dtDesign = typeof dtDetails.design === 'string' ? dtDetails.design : '';
      const dtEvidenceClues: string[] = Array.isArray(dtDetails.evidence_clues) && dtDetails.evidence_clues.length > 0
        ? (dtDetails.evidence_clues as any[]).filter((c: any) => typeof c === 'string' && c.trim())
        : ((cmlCase.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
            .filter((e: any) => Number(e?.act_number) === Number(dtScene?.act_number))
            .map((e: any) => String(e?.clue_id || ''))
            .filter(Boolean);
      const culpritNames: string = (cmlCase.culpability?.culprits ?? []).filter((n: any) => typeof n === 'string' && n).join(', ');
      const nonCulpritSuspects: string[] = (cmlCase.cast ?? [])
        .filter((c: any) => {
          if ((cmlCase.culpability?.culprits ?? []).includes(c.name)) return false;
          const role = String(c.role_archetype ?? c.role ?? '').toLowerCase();
          return !role.includes('detective') && !isVictimArchetype(role);
        })
        .map((c: any) => c.name as string)
        .filter(Boolean);
      lines.push(`  - ⚠ DISCRIMINATING TEST (${dtMethod}) — MANDATORY real-time scene with dialogue and confrontation. DO NOT summarize it after the fact.`);
      if (culpritNames) lines.push(`    ⚠ CULPRIT-UNIQUENESS REQUIRED: the decisive evidence must expose a fact or physical characteristic that ONLY ${culpritNames} could satisfy. Announcing that the crime method occurred does NOT qualify. The test must reveal access, knowledge, or physical proof that eliminates all non-culprits before naming ${culpritNames}.`);
      if (dtDesign) {
        // R-A (ROADMAP_TO_80 M0): never hand the LLM the full design SENTENCE — it copies it verbatim
        // however firmly we forbid it. Give only the key TERMS (shared chokepoint) so the model composes.
        lines.push(`    Elements the test must dramatize (compose the scene ENTIRELY in your own sentences from these — reproducing any briefing phrase verbatim FAILS validation): ${surfaceSpecKeyTerms(dtDesign)}`);
      }
      if (dtEvidenceClues.length > 0) lines.push(`    Cite these already-revealed clue IDs during the test: ${dtEvidenceClues.join(', ')}`);
      if (nonCulpritSuspects.length > 0) lines.push(`    Eliminate on-page with explicit evidence: ${nonCulpritSuspects.map((n) => `"${n}"`).join(', ')} — state EXACTLY why each is ruled out (because / therefore / which proves).`);
      if (culpritNames) lines.push(`    Convict: name "${culpritNames}" explicitly as the murderer. Connect every clue to them using "because / therefore / which proves".`);
      const dtCulpritEntry = (cmlCase.cast ?? []).find(
        (c: any) => (cmlCase.culpability?.culprits ?? []).includes(c.name)
      );
      const dtCulpritMotive = String(dtCulpritEntry?.motive_seed ?? '').trim();
      if (dtCulpritMotive) {
        lines.push(`    Motive statement REQUIRED: the culprit must explicitly state or acknowledge their motive during or immediately after the confrontation. Canonical motive: "${dtCulpritMotive}". Do not omit it.`);
      }
      lines.push(`    Required beats in order: (1) detective states the test logic, (2) test is executed as a scene beat, (3) each suspect's response is shown, (4) non-culprits eliminated with evidence, (5) culprit named and case sealed.`);
      // FIX-M1: Discriminating-test new-fact requirement — a DT chapter that only re-interrogates
      // known facts will be rejected. One new physical fact, object, or testimony is mandatory.
      lines.push(`    NEW OBSERVABLE FACT REQUIRED: this chapter MUST introduce exactly one physical fact, object, or testimony that has NOT appeared in any prior chapter. A discriminating-test chapter that only recapitulates known facts will be rejected and regenerated.`);
    }
    // Culprit revelation scene obligation — when this chapter contains the revelation scene
    // and it is not already the discriminating test chapter (which handles conviction above).
    // `revelationScene` / `isRevealChapter` are computed above the clue loop (hoisted for B2).
    if (isRevealChapter) {
      const culpritNames: string = (cmlCase.culpability?.culprits ?? []).filter((n: any) => typeof n === 'string' && n).join(', ');
      const revealMethod: string = revelationScene.revelation_method ?? 'confrontation with evidence';
      lines.push(`  - ⚠ CULPRIT REVELATION REQUIRED (${revealMethod}): this chapter MUST name "${culpritNames}" explicitly as the murderer before the chapter ends. Include a complete evidence chain using "because / therefore / which proves" for each piece of proof. Do not let the chapter end with the culprit unnamed or the verdict ambiguous.`);
      const revealCulpritEntry = (cmlCase.cast ?? []).find(
        (c: any) => (cmlCase.culpability?.culprits ?? []).includes(c.name)
      );
      const revealCulpritMotive = String(revealCulpritEntry?.motive_seed ?? '').trim();
      if (revealCulpritMotive) {
        lines.push(`  - Motive statement REQUIRED: the culprit must explicitly state or acknowledge their motive in this chapter. Canonical motive: "${revealCulpritMotive}". Do not paraphrase or omit it.`);
      }
      // FIX-M2 + FIX-E1: Strengthen revelation completeness — require evidence chain and kill statement.
      lines.push(`  - ⚠ EVIDENCE CHAIN REQUIRED: before or during the confession the detective must summarise the evidence chain — stating at minimum: (a) the mechanism of death, (b) how the culprit accessed the victim, (c) the motive, and (d) why all other suspects are excluded.`);
      // A_84 follow-up #1 — (e) the deception's PURPOSE, the sentence four of five readers asked for.
      if (isRevealDeceptionPurposeEnabled()) {
        lines.push(...buildDeceptionPurposeLines(cmlCase, culpritNames, culpritAlibiLock));
      }
      // A_90 §12 — the three steps the reader asked for, rendered from the locked numbers.
      if (isRevealArithmeticEnabled()) {
        lines.push(...buildDeceptionArithmeticLines(cmlCase, lockedFacts as any));
      }
      lines.push(`  - ⚠ KILL STATEMENT REQUIRED: the culprit must use or strongly imply a specific act verb — "I killed", "I poisoned", "I struck", "I administered" — within 3 sentences of naming the victim. Passive constructions ("the death occurred", "she was found") are NOT sufficient. The culprit's agency must be explicit.`);
      lines.push(`  - ⚠ PRONOUN RESOLUTION: any pronoun in the confession that refers to a third party ("protect him", "because of her") must be resolved by naming the character in the same sentence.`);
      // A_58 #1: the reveal repeatedly failed "no resolution event" + "close in-scene". Make both explicit.
      lines.push(`  - ⚠ RESOLUTION EVENT REQUIRED: this chapter must contain a concrete resolution beat — the culprit CONFESSES, is ARRESTED/taken into custody, or the detective explicitly names them as the murderer with the evidence. A reflective summary is NOT a resolution event.`);
      lines.push(`  - ⚠ CLOSE IN-SCENE (final paragraph): end the chapter INSIDE the scene — on a line of dialogue, a physical action, or a sensation. Do NOT end on a narrator's summary verdict ("the case was closed", "justice had been served", "X was responsible"). The last sentence should be something a character does, says, or feels in the moment.`);

      // A_64 §3.3 C2 — THE EARNED REVEAL. The 33-run corpus's ending complaint, near-verbatim: "the
      // reveal relies on confession rather than logical deduction from earlier clues" (63% deficit)
      // and clues "feel unearned". The fix: walk the deduction through the essential clues in the
      // order the reader met them, citing each one's earlier on-page appearance — and demote the
      // confession to confirmation. (This is also what structurally retires the B5 injector: a
      // walked chain IS the culprit-evidence linkage.)
      {
        // Clues the reader has already seen: every cluesRevealed in outline scenes BEFORE this one,
        // in narrative order (identity match into allOutlineScenes; chapter-index fallback).
        const outline: any[] = Array.isArray(allOutlineScenes) ? allOutlineScenes : [];
        let sceneCut = outline.findIndex((s: any) => s === scene);
        if (sceneCut < 0) sceneCut = Math.max(0, chapterNumber - 1);
        const priorClueIds: string[] = [];
        for (const s of outline.slice(0, sceneCut)) {
          for (const id of (Array.isArray(s?.cluesRevealed) ? s.cluesRevealed : []).map(String)) {
            if (!priorClueIds.includes(id)) priorClueIds.push(id);
          }
        }
        const essentialPrior = priorClueIds
          .map((id) => clueMap.get(id))
          .filter((c): c is Clue => Boolean(c) && (c as Clue).criticality === "essential");
        // A_67 FIX-3 (plant→payoff): when reveal-cites-plants is on, front-load the cause-of-death method
        // tell (token-matched against death_method) and lift the 6-clue cap so EVERY planted essential
        // clue is cited at the reveal, not merely asserted. Default OFF = identical to the prior slice(0,6).
        const revealCitesPlants =
          process.env.AGENT9_REVEAL_CITES_PLANTS === "true" || process.env.AGENT9_REVEAL_CITES_PLANTS === "1";
        let walked: Clue[];
        let methodWalkNote = "";
        if (revealCitesPlants) {
          const mannerOfDeath = ((): string => {
            const explicit = typeof (cmlCase as any)?.death_method === "string" ? (cmlCase as any).death_method.trim() : "";
            if (explicit) return explicit;
            const cc = (cmlCase as any)?.meta?.crime_class ?? {};
            return (typeof cc.subtype === "string" && cc.subtype.trim()) || (typeof cc.category === "string" && cc.category.trim()) || "";
          })();
          const tokens = mannerOfDeath ? deathMethodTellHints(mannerOfDeath).tokens.map((t) => t.toLowerCase()) : [];
          const isMethodTell = (c: Clue): boolean => {
            if (tokens.length === 0) return false;
            const hay = `${c.observable ?? ""} ${c.description ?? ""} ${c.pointsTo ?? ""}`.toLowerCase();
            return tokens.some((t) => hay.includes(t));
          };
          const method = essentialPrior.filter(isMethodTell);
          const rest = essentialPrior.filter((c) => !isMethodTell(c));
          walked = [...method, ...rest].slice(0, 12);
          if (method.length > 0) {
            methodWalkNote = ` The physical cause-of-death evidence (how ${mannerOfDeath || "the victim died"}) MUST be one of the walked clues — the reveal cites where the reader first saw it, never merely asserts the method.`;
          }
        } else {
          walked = essentialPrior.slice(0, 6);
        }
        if (walked.length > 0) {
          lines.push(`  - ⚠ THE DEDUCTION MUST BE WALKED, NOT ASSERTED: the detective retraces the essential clues IN THE ORDER THE READER MET THEM, citing each one's earlier on-page appearance (where it was, who was present) BEFORE drawing its inference:${methodWalkNote}`);
          walked.forEach((c, i) => {
            lines.push(`      ${i + 1}. ${surfaceSpecKeyTerms(deriveClueObservable(c))} [${c.id}]`);
          });
          lines.push(`    Each step must reference the moment the reader first saw the clue, so the chain can be verified from memory — "we all saw it, we simply read it wrong" is the register. A reveal that asserts conclusions without citing these appearances FAILS.`);
        }
        lines.push(`  - ⚠ CONFESSION CONFIRMS, NEVER SUPPLIES: the deduction chain must be COMPLETE — culprit named, mechanism explained, evidence walked — BEFORE any confession begins. The confession may corroborate, supply motive colour, or add emotional weight; it must NOT introduce the decisive fact. If deleting the confession would break the logical case, restructure so the deduction stands alone.`);
      }
    }
    // A_64 §3.3 C2 — the AFTERMATH beat. Corpus ending complaint #2 (near-verbatim across runs):
    // "lacks a satisfying emotional payoff; the implications are not explored; feels abrupt". The
    // grid schedules a denouement in the final slot; this gives it CONTENT.
    const lastChapterInPlan = Array.isArray(macroArcPlan) && macroArcPlan.length > 0
      ? Math.max(...macroArcPlan.map((e) => e.chapter))
      : undefined;
    if (lastChapterInPlan != null && chapterNumber === lastChapterInPlan) {
      lines.push(`  - AFTERMATH REQUIRED (final chapter): after the resolution event, the fallout must land — at least two paragraphs in which (a) the motive is understood in HUMAN terms by those left behind (what it cost, what it says about the household), and (b) at least one named character's changed circumstance is SHOWN in-scene, not summarized. Do NOT end on the arrest/confession line, and do NOT end on a verdict sentence.`);
      // A_65 Phase 3 — the top-6 derivation: WEAK aftermaths carry MORE motive-wording than
      // strong ones (7.3 vs 5.2 motive-term paragraphs) — stated motive is the failure mode.
      lines.push(`  - AFTERMATH REGISTER: the motive arrives in VOICE — a character's spoken line, a specific act (a returned letter, a chair left empty, a debt quietly paid) — NEVER as narrator explanation ("she had done it because…"). If the narrator must gloss it, one clause maximum.`);
    }

    // §3.3b: Sensory obligation injection
    const selectedVariant = sensoryVariantsByChapter?.[chapterNumber];
    if (selectedVariant) {
      lines.push(
        `  - Sensory obligation — use at least two of: ` +
        `${(selectedVariant.sights ?? []).slice(0, 2).join(', ')} | ` +
        `${(selectedVariant.sounds ?? []).slice(0, 2).join(', ')} | ` +
        `${(selectedVariant.smells ?? []).slice(0, 1).join(', ')}. ` +
        `Mood: ${selectedVariant.mood ?? ''}.`,
      );
    }
  });

  // §4.4: Tonal contrast enforcement — when two consecutive chapters are both high-tension,
  // inject an explicit relief instruction (stronger than the existing per-chapter tonal hint).
  if (
    currentArcPosition &&
    narrativeState?.previousChapterArcPosition &&
    HIGH_TENSION_POSITIONS.has(narrativeState.previousChapterArcPosition) &&
    HIGH_TENSION_POSITIONS.has(currentArcPosition)
  ) {
    const humourEntry = Array.isArray(worldDoc?.humourPlacementMap)
      ? worldDoc.humourPlacementMap.find(
          (e: any) => e.scenePosition === ARC_POS_TO_SCENE_TYPE[currentArcPosition],
        )
      : undefined;
    if (humourEntry?.humourPermission !== 'forbidden' && humourEntry?.permittedCharacters?.length > 0) {
      lines.push(
        `\n- Tonal contrast required: the previous chapter was high-tension. ` +
        `${humourEntry.permittedCharacters[0]} may use ${humourEntry.permittedForms?.[0] ?? 'understatement'} ` +
        `to provide a brief moment of relief before tension resumes.`,
      );
    } else {
      lines.push(
        `\n- Tonal contrast required: the previous chapter was high-tension. ` +
        `This chapter must include at least one beat of relief, pause, or quiet observation.`,
      );
    }
  }

  if ((lockedFacts ?? []).length > 0) {
    lines.push('- Locked fact phrase obligations:');
    (lockedFacts ?? []).slice(0, 8).forEach((fact) => {
      lines.push(`  - If this batch mentions ${fact.description}, write exactly: "${fact.value}".`);
    });
  }

  if (temporalLock) {
    lines.push(`- Seasonal vocabulary allow-list: ${getSeasonAllowList(temporalLock.season)}.`);
    lines.push(`- Forbidden seasonal words: ${['spring', 'summer', 'autumn', 'winter'].filter((s) => s !== temporalLock.season).join(', ')}.`);
  }

  // FIX-P1: Beat uniqueness guard — list beats committed in prior chapters so the LLM
  // does not repeat the same chapter purpose (e.g., two alibi-probe chapters in a row).
  const usedBeatsList = narrativeState?.beatHistory
    ?.map((b: any) => {
      const label = String(b.archetypeLabel ?? b.label ?? b.purpose ?? '').trim();
      const ch = Number(b.chapterNumber ?? b.chapter ?? 0);
      return label ? `Ch${ch}: ${label}` : null;
    })
    .filter(Boolean) as string[] | undefined;
  if (usedBeatsList && usedBeatsList.length > 0) {
    lines.push(`- BEATS ALREADY PLAYED — do not make any of the following the primary purpose of this chapter:`);
    for (const beat of usedBeatsList) {
      lines.push(`  • ${beat}`);
    }
    lines.push(`  If this chapter's primary purpose would duplicate a beat above, shift the focus: introduce new evidence, a new witness angle, or a change in the investigator's theory.`);
  }

  // Fix-3: DT-Fallback reminder — when we are in the final arc window (pre_climax /
  // climax) and the CML defines a discriminating test, remind the LLM to stage it as a
  // concrete scene before the story ends. Prevents cml_test_not_realized when the exact
  // act/scene coordinate match in buildDiscriminatingTestChecklist misses by one scene.
  if (dtScene && (currentArcPosition === 'pre_climax' || currentArcPosition === 'climax')) {
    const dtMethod = String(cmlCase?.discriminating_test?.method ?? cmlCase?.discriminating_test?.test_type ?? '').trim();
    if (dtMethod) {
      lines.push(`\n⚠ DISCRIMINATING TEST WINDOW: The story's "${dtMethod}" test MUST be staged as a concrete scene before the story ends. If this chapter has not yet performed it, do so now — do not defer to a later chapter. A post-hoc summary is NOT acceptable.`);
    }
  }

  // Phase 6 Layer 1: Resolution chapter mandatory checklist
  // ITEM 11 (#1): `currentArcPosition === 'resolution'` is purely POSITIONAL (the last
  // chapter), while the stage-mode layer knows WHETHER the reveal already happened in an
  // earlier chapter ('aftermath_consequence'). Re-issuing the full reveal mandate on an
  // aftermath final chapter duplicated the Ch9 reveal into Ch10 — the aftermath contract
  // below requires retrospect instead of re-staging.
  if (currentArcPosition === 'resolution' && currentStageMode === 'aftermath_consequence') {
    const culpritNames: string = ((cmlCase?.culpability?.culprits ?? []) as string[]).filter((n) => typeof n === 'string' && n).join(', ');
    lines.push(`\n⛔ AFTERMATH CONTRACT — THIS IS THE FINAL CHAPTER (the culprit was already exposed in an earlier chapter):`);
    lines.push(`  Four requirements MUST hold:`);
    lines.push(`  1. NAME IN RETROSPECT: refer to ${culpritNames || 'the culprit'} BY NAME whenever the solved case is discussed — never only "the killer", "the murderer", or "the culprit".`);
    lines.push(`  2. OUTCOME REFERENCE: reference the already-delivered outcome (arrest, custody, or confession) as a settled fact — characters speak of it or its consequences are visible. Do NOT re-enact it.`);
    lines.push(`  3. REMAINING QUESTIONS: tie off the questions the reveal left open — what becomes of the household, the estate, and the surviving characters' obligations.`);
    lines.push(`  4. CONSEQUENCE: show the emotional and social consequences of the truth on the surviving characters.`);
    if (isAftermathPositiveJobEnabled()) {
      // A_86 item 1 — the same obligations restated as things to DO. See the enabler's docblock for
      // where each line comes from: every one is a reviewer's own praise or prescription.
      lines.push(``);
      lines.push(`  ✅ WHAT THIS CHAPTER IS FOR — do all four, and nothing that re-argues the case:`);
      lines.push(
        `  A. OPEN ON THE SETTLED OUTCOME. The FIRST paragraph states the outcome as an accomplished ` +
          `fact the reader already knows — "${culpritNames || 'the culprit'} had signed the confession", ` +
          `"${culpritNames || 'the culprit'} was gone". It is the chapter's starting condition, not its destination.`,
      );
      lines.push(
        `  B. TWO SURVIVORS, TWO CHANGES. Name TWO surviving characters and give each ONE concrete thing ` +
          `that is now different: a duty taken up or set down, a room reopened or shut, a possession ` +
          `handed on, a plan abandoned. Concrete and specific — not "felt changed".`,
      );
      lines.push(
        `  C. ONE MEMORY OF THE VICTIM that is NOT evidence — a habit, a kindness, an irritation, ` +
          `something they always said. It must not bear on how they died.`,
      );
      lines.push(
        `  D. ONE PHYSICAL DETAIL of the place resuming ordinary use — a room being cleaned, a routine ` +
          `restarting, an object put back where it belongs.`,
      );
    }
    lines.push(`  ⛔ DO NOT RE-STAGE THE REVEAL: no new accusation scene, no fresh confession, no re-run of the evidence chain, and no per-suspect clearance recitation — all of these already happened on-page in the reveal chapter, and repeating them will be rejected and regenerated.`);
    // A_71 — the specific evasion the model actually used, three attempts running: it wrapped the
    // whole reveal in a recollection frame ("the confession lingered in the air, the words still
    // echoing: 'I killed her. … I struck her with the candlestick, then set the clock…'") and treated
    // that as retrospect. Naming the loophole up front is cheaper than rejecting it three times.
    lines.push(`  ⛔ DO NOT QUOTE THE CONFESSION. Referring to it is required; reproducing its words is forbidden. Write "the confession he had signed", never a quoted line of it. A recollection frame ("the words still echoing", "his confession lingered") does NOT make a quotation retrospective — it is the reveal delivered a second time, and it will be rejected.`);
    lines.push(`  ⛔ DO NOT RESTATE the motive, the method, or how the concealment worked. The reader already has them. Referring to "what he had done" is enough.`);
    /**
     * A_76 — THE READER'S COMPLAINT, THIRD TIME OF ASKING.
     *
     * External read of `story_20260830-1850`: *"Chapter 10 does not reveal the culprit. It re-clears
     * Beatrice, Sylvia, and Hugo almost line by line."* The same objection was made on two earlier
     * manuscripts. The clearance TRIM cannot reach it — that deletes redundant clearance SENTENCES,
     * and this book contains none: the repetition is a STRUCTURE, the same three suspects staged in
     * the same order doing parallel business in both chapters.
     *
     *   ch9   Beatrice + notebook · Sylvia + doorway · Hugo + drinks cabinet
     *   ch10  Beatrice + notebook · Sylvia + doorway · Hugo + window
     *
     * The contract already forbade re-staging the reveal, quoting the confession and restating the
     * method — but nothing forbade re-clearing the innocent, and requirement 4 ("consequences on the
     * surviving characters") actively INVITES a suspect-by-suspect tour. So the generator obeyed
     * "clear the innocent" twice, exactly as the reader described.
     *
     * Stated as a prohibition on a countable thing, which is the lever class that works on this model
     * (A_75: operations are obeyed, statistics are not). Requirement 4 is narrowed in the same breath
     * so the two do not contradict each other — that contradiction is its own defect, met twice today.
     */
    lines.push(`  ⛔ DO NOT RE-CLEAR THE INNOCENT. The innocent were cleared in an earlier chapter and the reader has not forgotten. This chapter may NOT contain: a paragraph devoted to each suspect in turn, any restatement of where a suspect was or who confirms it, any alibi or corroboration, or any sentence of the form "you could not have done it" / "your account holds" / "the evidence clears you". If a cleared suspect appears, they appear as a PERSON WITH A LIFE RESUMING — not as a case still being argued.`);
    lines.push(`  ⛔ NO ROLL-CALL. Requirement 4 is satisfied by ONE consequence shown concretely, not by a tour of the cast. Do not give the surviving characters a paragraph each in the order they were suspected.`);
    /**
     * A_76 — THE OUTLINE AND THIS CONTRACT WERE GIVING OPPOSITE ORDERS.
     *
     * `story_20260830-1850` outline: ch8 `final_trap` "The Final Trap" (where the confession actually
     * lands), ch9 `final_trap` "Clearing the Innocent" — a DUPLICATE beat — and ch10 `revelation`
     * "The Culprit Revealed". No outline this project has produced has ever carried an `aftermath`
     * beat; every one ends on `revelation`.
     *
     * So chapter 10 arrived carrying a scene titled "The Culprit Revealed" AND this contract saying
     * the culprit was already exposed and must not be re-revealed. Told to reveal and not to reveal,
     * the model did the one thing neither instruction forbade: it re-cleared the innocent. The
     * reader's note — *"the title of Chapter 10 is now misleading"* — is the surface of that.
     *
     * The real repair belongs in Agent 7 (assign `aftermath` when the reveal is earlier), which is a
     * separate change with its own risk. This closes the contradiction where it is cheapest and
     * safest: telling the writer which of the two conflicting instructions wins.
     */
    lines.push(`  ⛔ THE SCENE TITLE FOR THIS CHAPTER IS SUPERSEDED. If the outline calls this chapter a revelation, a reveal, an unmasking or a naming, IGNORE THAT — the reveal has already happened and this contract governs. Do not write toward the title. Write the aftermath.`);
    /**
     * A_76 — AND THE TITLE YOU RETURN IS WHAT THE READER SEES.
     *
     * The model AUTHORS the `title` field; `saveReadableStory` prints it verbatim as the chapter
     * heading. So telling the writer to ignore a reveal-promising outline title fixes the prose and
     * leaves "## Chapter 10: The Culprit Revealed" on the page — which is the half of the complaint
     * the reader actually led with: *"the title of Chapter 10 is now misleading"*.
     *
     * Naming the banned words rather than asking for "an appropriate title": this model complies with
     * countable instructions and negotiates away vague ones.
     */
    lines.push(`  ⛔ THE TITLE YOU RETURN MUST NOT PROMISE A REVEAL. The reader sees it as the chapter heading. Do not return a title containing "reveal", "revealed", "revelation", "unmasked", "the culprit", "the killer", "exposed", "solution" or "accused". Title it for what the chapter actually contains — the aftermath, what it cost, what is left.`);

    /**
     * ── A_75 §13 — THE FINAL CHAPTER IS THE MOST ABSTRACT PART OF EVERY BOOK ─────────────────────
     *
     * MEASURED over 132 ten-chapter manuscripts, machine-register rate per chapter (the one prose
     * instrument that tracks the human mark, rho = -0.421):
     *
     *     ch1 11.3%  ch2 14.7%  ch3 15.8%  ch4 13.0%  ch5 14.9%
     *     ch6 16.6%  ch7 14.8%  ch8 14.0%  ch9 14.8%  ch10 17.0%
     *
     * It is not a gradient — the middle is noise and the two ENDPOINTS are the signal. Chapter 1 is
     * markedly the most concrete thing in the book; **chapter 10 is the most abstract, above the
     * ~16% that marks a prose-4 manuscript.** And ch10 is the chapter readers keep naming:
     * *"Chapter 10 contains major validation leakage"*, *"Chapter 9 and Chapter 10 overlap"*,
     * *"the final test repeats after the confession"*.
     *
     * THE CAUSE IS THIS CONTRACT. Read the four requirements above: refer, reference, tie off, show
     * the consequences of the truth. Every verb is a REPORTING verb, and the three prohibitions each
     * remove a dramatisable action. Nothing in it asks for a single thing a reader could see, hear or
     * touch — while chapter 1 carries a mandated grounding checklist and comes in 5.7 points lower.
     *
     * The prohibitions are RIGHT and stay: each was written against a measured evasion, including
     * A_71's recollection-frame loophole the model used three attempts running. What was missing is a
     * positive requirement to put the consequence in the room, which is what the chapter is FOR.
     *
     * AXIS-NEUTRAL: a consequence is physical whichever way the crime was concealed. Nothing here
     * mentions a clock, a room, an identity, a rank or a behavioural tell, so it reads the same on all
     * five `false_assumption` axes.
     *
     * Flag-gated `AGENT9_AFTERMATH_GROUNDING` (default OFF), read at call time.
     */
    if (/^(1|true|yes|on)$/i.test(process.env.AGENT9_AFTERMATH_GROUNDING ?? "")) {
      lines.push(`  5. PUT THE CONSEQUENCE IN THE ROOM: requirements 3 and 4 must be carried by something the reader can SEE, HEAR or TOUCH — a task someone resumes or abandons, an object moved, kept or thrown away, a room that has changed use, a habit broken. Name at least TWO physical things in this chapter that were not in the reveal chapter.`);
      lines.push(`  6. NO SUMMARISING CLOSE: do not end on a sentence whose subject is an abstraction — "the truth", "the case", "justice", "the matter". End inside the scene, on a person doing something.`);
    }
  } else if (currentArcPosition === 'resolution') {
    const culpritNames: string = ((cmlCase?.culpability?.culprits ?? []) as string[]).filter((n) => typeof n === 'string' && n).join(', ');
    const murderMethod: string = cmlCase?.hidden_model?.mechanism?.description ?? 'the crime method';
    // A_67 FIX-2 (BUG-1): feed the PHYSICAL cause of death (CASE.death_method) into the "name the manner
    // of death" half of the METHOD obligation. Previously ONLY the concealment string (hidden_model.
    // mechanism.description) was interpolated, so the model was told to name the killing but handed cover-up
    // vocabulary — the "concealment explained, death not" defect the weakMurderMethod cap penalises.
    // Resolved inline (death_method → crime_class subtype/category) to avoid a prompt-builder import cycle.
    const mannerOfDeath: string = (() => {
      const explicit = typeof (cmlCase as any)?.death_method === 'string' ? (cmlCase as any).death_method.trim() : '';
      if (explicit) return explicit;
      const cc = (cmlCase as any)?.meta?.crime_class ?? {};
      const subtype = typeof cc.subtype === 'string' ? cc.subtype.trim() : '';
      const category = typeof cc.category === 'string' ? cc.category.trim() : '';
      return subtype || category || '';
    })();
    lines.push(`\n⛔ MANDATORY RESOLUTION — THIS IS THE FINAL CHAPTER:`);
    lines.push(`  Five events MUST appear as on-page prose (not offstage summary):`);
    lines.push(`  1. ACCUSATION: The detective names ${culpritNames || 'the culprit'} and states the charge.`);
    lines.push(`  2. CULPRIT RESPONSE: ${culpritNames || 'The culprit'} confesses with detail, or reacts in a way that confirms guilt.`);
    // L1 (ROADMAP_TO_80 M0): the reveal must state HOW THE VICTIM DIED (manner of death), not only
    // how the timeline/scene was faked — otherwise the "concealment explained, death not" cap fires.
    lines.push(`  3. METHOD: State BOTH how the victim was physically killed${mannerOfDeath ? ` — name the manner of death (${mannerOfDeath}): the physical injury or agent (the wound, the poison, the blow, the ligature), NOT the cover-up` : ` (name the manner of death — e.g. the stab wound, the poison, the blow)`} AND how the scene/timeline was manipulated (compose in your own words from these elements, do NOT quote them verbatim: ${surfaceSpecKeyTerms(murderMethod)}). Naming only the concealment is a failure.`);
    lines.push(`  4. CONSEQUENCE: What happens to ${culpritNames || 'the culprit'} (arrested, fled, taken into custody).`);
    lines.push(`  5. AFTERMATH: At least one other character reacts emotionally to the truth.`);
    lines.push(`  A chapter submitted without all five will be rejected and regenerated.`);
    // A_71 — two craft requirements from the 2026-07-31 external review of story_20260731-1650
    // (scored 75/100). Both were named as the changes that would "raise the score significantly".
    //
    // (a) MECHANISM PRECISION. The reveal said the clock had been "tampered with" and the chime "set
    //     to ring falsely" — a LABEL, not a mechanism. The reader could not reconstruct how the hands
    //     read 8:10 while the chime sounded at 8:45. Requirement 3 above already forces the manner of
    //     death; nothing forced the CONCEALMENT to be mechanically legible.
    lines.push(`  ⚙ MECHANISM PRECISION: explain the concealment as a sequence of physical operations a reader could repeat — which part was altered, in what order, and why that produces the false impression.`);
    lines.push(`     Words like "tampered with", "manipulated", "rigged", "somehow", or "interfered with" are LABELS, not explanations. If you use one, the next sentence must say concretely what was done to which part.`);
    lines.push(`     If two effects come from separate parts of the same object, say so explicitly — a reader must not be left assuming one action caused both.`);
    // (b) PHYSICAL TRACE. The culprit was linked by access, nervousness, proximity, motive and
    //     confession — all behavioural. `culpritEvidenceLinkInText` accepts exactly that, so the
    //     chapter passed while the reviewer judged the proof "not fully decisive".
    lines.push(`  🔬 PHYSICAL TRACE: at least ONE piece of physical evidence must tie ${culpritNames || 'the culprit'} to the method itself — a mark, residue, transfer, fragment, or trace left by the act.`);
    lines.push(`     Access, opportunity, nervousness, proximity, motive, and confession are NOT physical traces. They establish that ${culpritNames || 'the culprit'} COULD have done it; the trace establishes that they DID.`);
    lines.push(`     The trace must have been observable earlier in the story — reveal what it MEANS here, do not invent it here.`);
    // FIX-2: Mandatory per-suspect clearance in final chapter.
    // gpt-4.1-mini efficiently places clearances in earlier chapters and writes Chapter 10
    // as pure resolution, causing the final lint gate to fail. Force explicit clearances here.
    const _resCulpritSet = new Set<string>(
      ((cmlCase?.culpability?.culprits ?? []) as any[])
        .map((n: any) => String(n).trim())
        .filter(Boolean)
    );
    const _resVictimSet = new Set<string>(
      ((cmlCase?.cast ?? []) as any[])
        .filter((c: any) => isVictimArchetype(c.role_archetype ?? c.role))
        .map((c: any) => String(c.name ?? '').trim())
        .filter(Boolean)
    );
    const finalChapterSuspects: string[] = ((cmlCase?.cast ?? []) as any[])
      .filter((c: any) => {
        const name = String(c.name ?? '').trim();
        if (_resCulpritSet.has(name)) return false;
        if (_resVictimSet.has(name)) return false;
        const role = String(c.role_archetype ?? c.role ?? '').toLowerCase();
        // FIX-2 patch: detectives must also be cleared in the resolution chapter because
        // the lint gate (matchingClearances from suspect_clearance_scenes) checks ALL
        // non-culprit, non-victim characters. Without an explicit obligation the LLM uses
        // first-person speech which omits the detective's own name, failing the name gate.
        return !role.includes('narrator');
      })
      .map((c: any) => String(c.name ?? '').trim())
      .filter(Boolean);
    if (finalChapterSuspects.length > 0) {
      lines.push(`  6. SUSPECT CLEARANCES (MANDATORY — lint-enforced): every non-culprit suspect below must be ruled out on-page in THIS chapter, dramatised rather than recited:`);
      for (const suspectName of finalChapterSuspects) {
        // A_67 FIX-1 (de-register): no copy-me Example sentence and no single-paragraph constraint —
        // both drove the verbatim "…alibi was confirmed because…" report line reviewers flag. Ask for
        // the clearance to be watched as deduction and spread across the scene.
        lines.push(`    • "${suspectName}" — somewhere in this chapter, name "${suspectName}" and let the reader watch the evidence rule them out: show the alibi or observation as a witnessed fact (a named witness, a record, a timeline), then the detective's conclusion that they could not have been responsible. Use ordinary clearing language ("cleared", "ruled out", "innocent", "alibi holds", "could not have") woven into the scene across as many sentences as it takes; do not compress it into one flat report line that merely asserts the alibi was confirmed.`);
      }
      lines.push(`  Items 1–6 are ALL mandatory. A chapter missing any item will be rejected and regenerated.`);
    }
  }

  // F6a/F6b: Compact pronoun table reminder — appended to every chapter's obligation block
  // so the gender anchors are adjacent to the generation instruction regardless of context depth.
  // Full 10-rule contract is in the pronoun_accuracy block (priority: critical); this is a
  // lightweight re-check cue for Chapters 5+ where that block is buried in the context window.
  const castForPronouns: any[] = ((cmlCase?.cast ?? []) as any[]).filter(
    (c: any) => c.gender?.toLowerCase() === 'male' || c.gender?.toLowerCase() === 'female'
  );
  if (castForPronouns.length > 0) {
    const compactTable = castForPronouns
      .map((c: any) => {
        const pronouns = c.gender.toLowerCase() === 'male' ? 'he/him/his' : 'she/her/her';
        return `    ${c.name}: ${pronouns}`;
      })
      .join('\n');
    lines.push(`\n⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:`);
    lines.push(compactTable);
    lines.push(`  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.`);
  }

  return `\n\n${lines.join('\n')}`;
}
