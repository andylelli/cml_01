/**
 * agent9-prose/prompt-blocks.ts
 * Individual prompt-section builders: character contracts, personality,
 * location profiles, temporal context, setting, fair-play, pronoun accuracy.
 */
import { selectChapterAtoms } from "../asset-library.js";
import {
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import type { CaseData } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import { tagCharacter, selectSensoryVariant, compileSensoryAtoms } from "./phrase-analysis.js";
import type { BeatFingerprint } from "./phrase-analysis.js";
import { getSeasonAllowList, deriveTemporalSeasonLock } from "./lint.js";
import type { CanonicalSeason } from "./lint.js";
import { surfaceSpecKeyTerms } from "./clue-validation.js";
import type { CastDesign } from "../agent2-cast.js";
import type { AssetLibrary } from "../types/asset-library.js";
import type { ProseChapter, MacroArcEntry, ProseGenerationInputs } from "./types.js";
export function buildPronounAccuracyBlock(cast: any[]): string {
  if (!cast || cast.length === 0) return '';

  // CML stories are set in the 1930s–1950s Golden Age — only binary genders exist.
  const knownGenderCast = cast.filter((c: any) => {
    const g = c.gender?.toLowerCase();
    return g === 'male' || g === 'female';
  });

  if (knownGenderCast.length === 0) return '';

  // Table columns: subject / object / possessive / reflexive.
  // Using four distinct forms prevents ambiguity — 'she/her/her' looked like a typo;
  // 'she/her/herself' gives three distinct tokens the model can act on.
  // ANALYSIS_17 Issue II: add explicit "NEVER use" anti-form for each character.
  const pronounTable = knownGenderCast.map((c: any) => {
    const gender = c.gender!.toLowerCase();
    const pronouns = gender === 'male' ? 'he/him/his/himself' : 'she/her/her/herself';
    const wrongPronouns = gender === 'male' ? 'she/her/herself' : 'he/him/his/himself';
    return `  • ${c.name}: ALWAYS ${pronouns} — NEVER ${wrongPronouns}`;
  }).join('\n');

  // T2-4 (Rule 11): Cast-composition rule — injected only when the cast has exactly
  // one male and two or more females. The 3:1+ ratio means "he/him" almost always
  // refers to the lone male; this rule makes that fact explicit so the LLM can use it
  // as a deduction rule rather than having to look up the table every sentence.
  const maleChars = knownGenderCast.filter((c: any) => c.gender!.toLowerCase() === 'male');
  const femaleChars = knownGenderCast.filter((c: any) => c.gender!.toLowerCase() === 'female');
  const maleName = maleChars.length === 1 ? maleChars[0].name : null;
  const castCompositionRule = (maleName && femaleChars.length >= 2)
    ? `\n11. Cast composition rule: ${maleName} is the ONLY male character in this story. Every "he/him/his/himself" refers exclusively to ${maleName} — never to any female character. Conversely, any follow-up sentence with no named subject that immediately follows a sentence about a female character must use "she/her" — not "he/him". When in doubt after writing a sentence about a female character, the default pronoun for the next sentence is "she".`
    : '';

  // Dynamic example character names for pronoun rules 8–10 — derived from actual cast
  // so the WRONG/RIGHT examples always reference the real story characters, not canary names.
  const _exRuleF     = femaleChars.length > 0 ? femaleChars[0].name.split(' ')[0] : 'Millicent';
  const _exRuleM     = maleChars.length > 0   ? (maleChars[0].name.trim().split(/\s+/).pop() ?? 'Thorne') : 'Thorne';
  const _exRuleFsur  = femaleChars.length > 0 ? (femaleChars[0].name.trim().split(/\s+/).pop() ?? 'Wren') : 'Wren';
  const _exRuleMfull = maleChars.length > 0   ? maleChars[0].name : 'Charles Thorne';
  const _exRuleF2    = femaleChars.length > 1 ? femaleChars[1].name.split(' ')[0] : _exRuleF;

  return `\n\n⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS\n\nThe following pronouns are locked facts, on the same level as character names\nand hard-logic device values. Using the wrong pronoun is a continuity error,\nnot a style choice.\n\nCanonical pronoun table (subject / object / possessive / reflexive):\n${pronounTable}\n\nThis rule overrides stylistic choice. If you are unsure which pronoun to use for a character,\nre-read their name above. There is no character in this story with ambiguous gender.\n\nMANDATORY PRE-OUTPUT CHECK: Before generating the JSON, re-read every sentence\nthat contains a pronoun and verify it against the table. If any mismatch is found,\ncorrect it before outputting. This check is not optional.\n\nRules:\n1. Every sentence is subject to this table — no exceptions for dialogue, reflection,\n   narration, or attribution.\n2. When characters of different genders appear in the same sentence and a pronoun\n   could refer to more than one of them, use the character's name instead of a pronoun\n   to eliminate ambiguity entirely.\n3. A pronoun must never migrate from one character to another across a semicolon,\n   comma splice, or consecutive sentence — even when the same pronoun gender applies\n   to multiple characters.\n4. "Her" takes two grammatical functions — both are exclusively female:\n   • Indirect object (before the/a/an/another): "he told her the truth", "gave her a letter"\n   • Possessive determiner (before a noun): "her coat", "her voice"\n   For a MALE character: use "him" (indirect object) or "his" (possessive). Never "her".\n5. Reflexive pronouns (himself/herself/themselves) must match the table above.\n6. In dialogue attribution ("he said", "she replied"), the attribution pronoun must\n   agree with the SPEAKER's gender — not the last character named inside the quoted speech.\n7. In nested or cleft clauses ("It was she who had…", "It was he that…"), pronoun\n   gender must still match the referent character's canonical set in the table.\n8. When multiple characters of different genders appear in the same sentence, use the character's\n   name instead of a pronoun to eliminate ambiguity:\n   WRONG: "${_exRuleF} watched ${_exRuleM}; she crossed the room and he frowned." (ambiguous antecedent)\n   RIGHT: "${_exRuleF} watched ${_exRuleM}; ${_exRuleM} crossed the room and ${_exRuleF} frowned." (explicit)\n9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character\n   named inside the quoted speech:\n   WRONG: \\"I have no alibi,\\" ${_exRuleFsur} said. He turned away. (if ${_exRuleFsur} is female, \\"He\\" is wrong)\n   RIGHT: \\"I have no alibi,\\" ${_exRuleFsur} said. She turned away.\n10. In ALL dialogue attribution, use the speaker's FULL NAME — not a pronoun. This is mandatory:\n   WRONG: \\"'${_exRuleMfull},' he began\\" — if ${_exRuleF2} is speaking, \\"he\\" is wrong AND ambiguous.\n   RIGHT: \\"'${_exRuleMfull},' ${_exRuleF2} began\\" — the speaker's name is always unambiguous.\n   The person addressed by name inside quoted speech is NOT the speaker. Name the speaker explicitly.`;
}

export type PromptBlockPriority = "critical" | "high" | "medium" | "optional";

export interface PromptContextBlock {
  key: string;
  content: string;
  priority: PromptBlockPriority;
}

export interface PromptSectionInputs {
  pronounAccuracyBlock: string; // [PHASE 1] dedicated pronoun block
  characterConsistencyRules: string;
  firstAppearanceContractsBlock: string;
  characterPressureContractBlock: string;
  settingRefinementBlock: string;
  backgroundContextBlock: string;
  fairPlayContractBlock: string;
  characterPersonalityContext: string;
  characterContractsBlock: string;
  physicalPlausibilityRules: string;
  eraAuthenticityRules: string;
  locationProfilesContext: string;
  temporalContextBlock: string;
  lockedFactsBlock: string;
  clueDescriptionBlock: string;
  nsdBlock: string;
  continuityBlock: string;
  discriminatingTestBlock: string;
  humourGuideBlock: string;
  craftGuideBlock: string;
  /**
   * M6 — the ten categories the finished story is scored on, in the writer's vocabulary
   * (architecture/REVIEW_10.md §2). Optional and empty unless `AGENT9_RUBRIC_IN_PROMPT` is set, so
   * with the flag off the prompt is byte-identical to what it has always emitted.
   */
  judgedOnBlock?: string;
  /**
   * A_75 §6.1 (P1) — this book's committed voice. Run-stable, so it lands in the cached prefix and is
   * paid for once. Empty unless `AGENT9_VOICE_SPEC` is set.
   */
  voiceSpecBlock?: string;
  sceneGroundingChecklist: string;
  provisionalScoringFeedbackBlock: string;
  worldDocumentBlock: string;
  texturePoolBlock?: string;
  /**
   * Agent 7.5 — the manuscript contract (architecture/GEOMETRY-AGENT-DESIGN.md §8.2).
   *
   * Three of the four are RUN-STABLE — identical in every chapter — so they land inside the cached
   * prompt prefix and are paid for once. Empty strings when the geometry stage is off or the
   * contract binding flag is not set, which drops them from the prompt entirely.
   *
   * The one genuinely new thing on this prompt surface is what these blocks DO NOT carry: every
   * existing block is positive — do this, include that — and the contract's `mustNotContain` is
   * deliberately withheld from the model and enforced by the acceptance test instead (§8.3).
   */
  geometryTimeBlock?: string;
  geometryClincherBlock?: string;
  geometryMethodBlock?: string;
  geometryChapterBlock?: string;
}


export function stripLocationParagraphs(locationProfiles: any): any {
  if (!locationProfiles || typeof locationProfiles !== 'object') return locationProfiles;
  const strip = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(strip);
    if (obj && typeof obj === 'object') {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'paragraphs') continue; // drop prose blocks
        out[k] = strip(v);
      }
      return out;
    }
    return obj;
  };
  return strip(locationProfiles);
}

// ─────────────────────────────────────────────────────────────────────────
// Extracted inline block builders (§1.6)
// Each was previously inlined inside buildProsePrompt.  They are exported so
// they can be unit-tested in isolation.  The inline originals will be removed
// once test coverage is confirmed.
// ─────────────────────────────────────────────────────────────────────────

/**
 * Pillar 2: Builds the CHARACTER CONTRACTS block for a specific scene's prose prompt.
 * Per-character entry scoped to which characters are active, filtered by activeNames.
 * Includes voice fragments, humour contract, forbidden cliché, and per-act behaviour.
 */

export const buildCharacterContractsBlock = (
  characterBundle: ProseGenerationInputs['characterBundle'],
  activeNames?: Set<string>,
  actNumber?: number,
  identityMap?: Map<string, string>,
): string => {
  if (!characterBundle || !Array.isArray(characterBundle.characters) || characterBundle.characters.length === 0) {
    return '';
  }
  const toShow = activeNames?.size
    ? characterBundle.characters.filter((c) => activeNames.has(c.name))
    : characterBundle.characters;
  if (toShow.length === 0) return '';

  const actKey = actNumber === 1 ? 'act1' : actNumber === 3 ? 'act3' : 'act2';
  const lines: string[] = ['\n\n## CHARACTER CONTRACTS (binding for this scene)'];
  lines.push('Each entry below constrains how this character must be written in this chapter.');
  lines.push('These override generic style guidance when they conflict.\n');

  for (const char of toShow) {
    lines.push(`### ${identityMap ? tagCharacter(char.name, identityMap) : char.name}`);
    if (char.speechMannerisms) {
      lines.push(`Voice & mannerisms: ${char.speechMannerisms}`);
    }
    // A_61 RC5.3 — the signature tic is the binding idiolect anchor the dialogue-distinctiveness gate
    // checks. Item 14: the instruction is per-chapter, so a "use it at least once" mandate compounds
    // across chapters into verbatim over-repetition (tide run: 8/10 chapters). Phrase it as SPARING use
    // — ownership stays absolute, frequency does not. Back-compat: absent ⇒ the line is omitted and the
    // block is unchanged.
    const signatureTic = String((char as any).signatureTic ?? '').trim();
    if (signatureTic) {
      lines.push(`SIGNATURE TIC (use sparingly — this is ${char.name}'s alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "${signatureTic}"`);
    }
    /**
     * X43 (REVIEW_10 §4) — THE FRAGMENTS WERE BEING COPIED, NOT MATCHED, AND THE GUARD BESIDE THEM
     * ALREADY EXISTED.
     *
     * These lines are Agent 6.5's `characterVoiceSketches[].fragments`. They were handed over under
     * "match this register and rhythm" and nothing else — the ONE voice input in this whole prompt with
     * no anti-verbatim guard. Two lines above, `signatureTic` carries one (A_61 RC5.3, earned by an
     * eight-of-ten-chapters over-repetition) and it works: one occurrence in an entire manuscript. The
     * atmosphere field one block away carries one too ("do NOT reproduce this phrase verbatim in
     * prose; translate into scene-specific, character-observed sensory language").
     *
     * MEASURED over the four runs holding both a character bundle and a cold read — longest verbatim
     * ≥5-word span of each fragment, searched against the shipped manuscript:
     *
     *   external 86 · dialogue 7 ·  6/18 leaked (33%)
     *   external 84 · dialogue 7 ·  5/18 (28%)
     *   external 78 · dialogue 6 ·  7/18 (39%)
     *   external 76 · dialogue 6 ·  9/18 (50%)
     *
     * It tracks the reader's mark with no overlap between the 7s and the 6s — the separation X30
     * provably could not make (REVIEW_09 §9.8). Dialogue has never once scored above 7 in five reads,
     * and "generated catchphrases" is the only complaint that appears in all five.
     *
     * BOTH reader complaints have this one source. Verbatim reuse is the obvious half; the other is
     * the model REMIXING a fragment into something that is not English — the 78 turned "One must mind
     * the details, lest chaos reign" into *"Every detail demands attention or shadows gather reign"*,
     * which is the *"malformed/generated"* line the same reader quoted.
     *
     * So: same guard, same shape, on the field beside the one that already had it. The fragments are
     * evidence about how this person sounds; they are not lines to spend.
     *
     * `probe:voice-fragment-leak` is the instrument that says whether this worked.
     */
    if (char.voiceFragments.length > 0) {
      lines.push(
        `Sample voice fragments — a REGISTER SAMPLE, showing how ${char.name} sounds. They are not lines to use: ` +
        `do NOT reproduce any phrase from them verbatim or near-verbatim, here or in any other chapter, and do not ` +
        `remix their wording. Write new sentences that sound like the same person speaking:`,
      );
      for (const frag of char.voiceFragments.slice(0, 2)) {
        lines.push(`  [${frag.register}] "${frag.text}"`);
      }
    }
    const freq = char.humourLevel >= 0.7 ? 'frequently' : char.humourLevel >= 0.4 ? 'occasionally' : 'rarely';
    if (char.humourStyle && char.humourStyle !== 'none' && char.humourLevel > 0) {
      lines.push(`Humour: ${char.humourStyle.replace(/_/g, ' ')} — deploy ${freq} (level ${char.humourLevel.toFixed(1)})`);
    } else {
      lines.push('Humour: none — this character plays it straight in all scenes');
    }
    lines.push(`FORBIDDEN phrase (never write for ${char.name}): "${char.forbiddenCliché}"`);
    const actBehaviour = char.permittedBehavioursByAct[actKey];
    if (actBehaviour) {
      lines.push(`Act ${actNumber ?? 2} behaviour contract: ${actBehaviour}`);
    }
    lines.push('');
  }
  return lines.join('\n');
};

/**
 * Builds the CHARACTER PERSONALITIES, VOICES & HUMOUR block for prose prompts.
 * Pass `activeNames` (set of character names present in the current batch of
 * scenes) to restrict the output to only those characters and reduce token use.
 */
/**
 * A_80 §18.4 / A_81 §11 — the shared-history block, shared by BOTH character-block paths.
 *
 * It was first written inline at the TAIL of `buildCharacterPersonalityBlock`, and MEASURED across
 * the whole prompt log of run mystery-1788293825799 it reached ZERO prompts. The cause is the
 * `if (library && deployedAssets)` branch at the top of that function: in production the asset
 * library is always present, so the function returns the scoped atom block and never reaches its
 * own tail. `CHARACTER PERSONALITIES` is likewise absent from every prompt, which confirmed it.
 *
 * A block appended after an early return is not a block. It lives here now and is called from both
 * paths — which is also the only arrangement that cannot drift.
 */
const buildRelationshipHistoryBlock = (castDesign: CastDesign, activeNames?: Set<string>): string => {
    const rel = (castDesign as any)?.relationships;
    // Both shapes: `{ pairs: [...] }`, and the bare array the model has been MEASURED to emit
    // (agent2-cast.ts:84 documents that regression).
    const rawPairs: any[] = Array.isArray(rel) ? rel : Array.isArray(rel?.pairs) ? rel.pairs : [];
    const pairs = rawPairs
      .map((p: any) => ({
        a: String(p?.character1 ?? p?.a ?? '').trim(),
        b: String(p?.character2 ?? p?.b ?? '').trim(),
        relationship: String(p?.relationship ?? '').trim(),
        tension: String(p?.tension ?? '').trim(),
        history: String(p?.sharedHistory ?? '').trim(),
      }))
      .filter((p) => p.a && p.b && p.history)
      // Scope to the characters actually in these chapters, exactly as the personalities above are.
      .filter((p) => !activeNames?.size || activeNames.has(p.a) || activeNames.has(p.b));
    if (pairs.length === 0) return '';
    const rows = pairs
      .map((p) => `  ${p.a} & ${p.b}${p.relationship ? ` (${p.relationship}` : ''}${p.tension ? `, tension ${p.tension})` : p.relationship ? ')' : ''}: ${p.history}`)
      .join('\n');
    return (
      '\n\nWHAT THESE PEOPLE ALREADY ARE TO EACH OTHER:\n\n' +
      'These are not backstory notes to summarise — they are the history the characters carry into ' +
      'every scene, and they existed long before the crime.\n\n' +
      rows +
      '\n\nUSE THEM AS FOLLOWS. Twice or more across the story, let a shared history show WITHOUT ' +
      'being explained: an old habit between two people, a subject one of them steps around, a ' +
      'familiarity that needs no introduction. A reader should be able to tell that two characters ' +
      'have a past from how they speak to each other, not from a sentence telling them so. Never ' +
      'write the history out as exposition, and never have a character recite their own relationship.'
    );
};

export const buildCharacterPersonalityBlock = (
  characterProfiles: any,
  castDesign: CastDesign,
  activeNames?: Set<string>,
  library?: AssetLibrary,
  deployedAssets?: Record<string, number[]>,
  arcPosition?: string,
): string => {
  if (!characterProfiles || !Array.isArray(characterProfiles.profiles)) return '';

  // §3.1: When asset library is available, use scoped obligation-pool atoms instead of
  // the flat verbose block. Falls back to the existing rich block when no library is given.
  if (library && deployedAssets) {
    const profiles = activeNames?.size
      ? characterProfiles.profiles.filter((p: any) => activeNames.has(p.name))
      : characterProfiles.profiles;
    let result = '\n\n## Character Reference\n';
    for (const profile of profiles) {
      const name: string = profile.name;
      if (!name) continue;
      const castChar = (castDesign?.characters ?? []).find((c: any) => c.name === name);
      const gender = (castChar?.gender ?? '').toLowerCase();
      const pronounTag = gender === 'female' ? '(she/her — NEVER he/him)' : gender === 'male' ? '(he/him — NEVER she/her)' : '';
      const nameHeader = pronounTag ? `${name} ${pronounTag}` : name;
      const isIntroductionChapter = !(deployedAssets[`portrait:${name}:first_impression`]?.length > 0);
      if (isIntroductionChapter && library[`portrait:${name}:first_impression`]) {
        result += `\n### ${nameHeader}\n${library[`portrait:${name}:first_impression`].content}\n`;
      } else {
        const { obligationAtoms } = selectChapterAtoms(
          library,
          new Set([name]),
          new Set<string>(),
          deployedAssets,
          arcPosition ?? 'mid',
        );
        const charAtoms = obligationAtoms.filter((a) => a.scopeKey === name);
        if (charAtoms.length > 0) {
          result += `\n### ${nameHeader}\n`;
          charAtoms.forEach((a) => { result += `${a.content}\n`; });
        }
      }
    }
    // A_81 §11 — the asset path returns HERE. Appending the shared-history block only after this
    // return is exactly how it reached zero prompts across an entire run.
    return result + buildRelationshipHistoryBlock(castDesign, activeNames);
  }

  const HUMOUR_STYLE_DESCRIPTIONS: Record<string, string> = {
    understatement: 'Increases seriousness by pretending not to. Deadpan delivery of extraordinary facts.',
    dry_wit: 'Sharp observations about human behaviour. Concise, often one-liners.',
    polite_savagery: 'Maintains perfect civility while delivering devastating verbal incisions.',
    self_deprecating: 'Turns wit inward. Disarming, often hides intelligence or pain.',
    observational: 'Notices absurdity in situations and people. Comments wryly on what others miss.',
    deadpan: 'Delivers the remarkable as though it were mundane. Flat affect, maximum impact.',
    sardonic: 'Darker edge. Mocking tone that reveals cynicism or world-weariness.',
    blunt: 'Says what others are thinking. Lacks social filter. Comic through honesty.',
    none: 'This character is not humorous. They are earnest, tense, or grief-stricken.',
  };
  const profilesToShow = activeNames?.size
    ? characterProfiles.profiles.filter((p: any) => activeNames.has(p.name))
    : characterProfiles.profiles;
  const personalities = profilesToShow.map((profile: any) => {
    const name = profile.name || 'Unknown';
    const persona = profile.publicPersona || '';
    const secret = profile.privateSecret || '';
    const stakes = profile.stakes || '';
    const internalConflict = profile.internalConflict || '';
    const personalStake = profile.personalStakeInCase || '';
    const humourStyle = profile.humourStyle || 'none';
    const humourLevel = typeof profile.humourLevel === 'number' ? profile.humourLevel : 0;
    const speechMannerisms = profile.speechMannerisms || '';
    const styleDesc = HUMOUR_STYLE_DESCRIPTIONS[humourStyle] || '';
    let humourGuidance = '';
    if (humourStyle !== 'none' && humourLevel > 0) {
      const frequency = humourLevel >= 0.7 ? 'frequently' : humourLevel >= 0.4 ? 'occasionally' : 'rarely';
      humourGuidance = '\n  Humour: ' + humourStyle.replace(/_/g, ' ') + ' (level ' + humourLevel.toFixed(1) + ' - ' + frequency + ' witty). ' + styleDesc;
    } else {
      humourGuidance = '\n  Humour: None - this character plays it straight. Their seriousness provides contrast for wittier characters.';
    }
    const physicalMannerisms = profile.physicalMannerisms || '';
    const privateLonging = profile.privateLonging || '';
    const motiveSeed = profile.motiveSeed || '';
    const motiveStrength = profile.motiveStrength || '';
    const voiceLine = speechMannerisms ? '\n  Voice & Mannerisms: ' + speechMannerisms : '';
    const conflictLine = internalConflict ? '\n  Internal Conflict: ' + internalConflict : '';
    const stakeLine = personalStake ? '\n  Personal Stake in Case: ' + personalStake : '';
    // physicalMannerisms - schema note: "deploy at most one per scene, not as a list"
    const physicalLine = physicalMannerisms ? '\n  Physical tells (deploy one per scene, not all at once): ' + physicalMannerisms : '';
    // privateLonging - schema note: "let it leak into one or two moments"
    const longingLine = privateLonging ? '\n  Private longing (let surface in 1-2 moments, never central): ' + privateLonging : '';
    const motiveLine = motiveSeed ? '\n  Motive seed: ' + motiveSeed + (motiveStrength ? ' (' + motiveStrength + ')' : '') : '';
    const castChar2 = (castDesign?.characters ?? []).find((c: any) => c.name === name);
    const gender2 = (castChar2?.gender ?? '').toLowerCase();
    const pronounTag2 = gender2 === 'female' ? ' (she/her — NEVER he/him)' : gender2 === 'male' ? ' (he/him — NEVER she/her)' : '';
    return name + pronounTag2 + ':\n  Public: ' + persona + '\n  Hidden: ' + secret + '\n  Stakes: ' + stakes + humourGuidance + voiceLine + motiveLine + conflictLine + physicalLine + longingLine + stakeLine;
  }).join('\n\n');
  /**
   * A_80 §18.4 — SHARED HISTORY WAS BEING GENERATED AND THROWN AWAY.
   *
   * `cast_design.schema.yaml` has required `relationships.pairs[]` with a required `sharedHistory`,
   * and Agent 2 is instructed to fill it with concrete pairwise past ("Quincy and Brabazon served
   * together in the navy — Brabazon knows Quincy's wartime secret"). MEASURED across the whole
   * prompt log of run mystery-1788287075975: the string `sharedHistory` appears in **exactly one**
   * prompt — Agent 2's own instruction to produce it — and in **no** downstream prompt. Agent 9 was
   * being told "show how relationships changed" with no relationships supplied.
   *
   * Two independent external reads then asked for this in almost the same words. 2026-08-31: "we
   * need more concrete relationship history — why did Beatrice trust Hale?". 2026-09-01: "it still
   * needs more relationship history … Hale once protected Beatrice's career". Character life has sat
   * at 7/10 across every read, with no detector and no repair pass, because the material it wants
   * was computed and discarded rather than missing.
   *
   * This is the A_78 pattern — data that exists and reaches no prompt — and it is the cheapest
   * untried lever on the board: no new model call, no new field, just carrying what is already paid
   * for one stage further.
   */
  const relationshipBlock = buildRelationshipHistoryBlock(castDesign, activeNames);

  return '\n\nCHARACTER PERSONALITIES, VOICES & HUMOUR:\n\nEach character has a distinct personality, voice, humour style, and hidden depth. Use these to create authentic, differentiated characters whose wit (or lack thereof) reveals who they are:\n\n' + personalities + relationshipBlock + '\n\nWRITING GUIDANCE:\n1. Dialogue: Each character should sound different. Humour style shapes HOW they speak, humourLevel shapes HOW OFTEN.\n2. Internal thoughts: Reference their hidden secrets and stakes to add subtext.\n3. Body language: Show personality through gestures, posture, habits.\n4. Reactions: Characters react differently to same events based on personality.\n5. Speech patterns: Use speechMannerisms for verbal tics, rhythm, formality level.\n6. Personal stake: Characters with personalStakeInCase defined should reference it at least twice across the story through internal monologue, hesitation, or action — especially the detective.\n7. HUMOUR CONTRAST: Characters with high humourLevel (0.7+) should deliver wit frequently. Characters with low/zero should play it straight. The CONTRAST between witty and earnest characters creates the best comedy.\n8. HUMOUR AS CHARACTER: A character\'s humour style reveals their psychology - self_deprecating masks insecurity, polite_savagery masks aggression, deadpan masks emotion.\n9. NEVER force humour on a character with humourLevel 0 or style none.';
};

/**
 * Builds the LOCATION PROFILES context block for prose prompts.
 * Accepts the raw locationProfiles object, the scenes in the current batch
 * (for sensoryVariants matching), and the 1-based chapter number of the first
 * scene in the batch.
 */

/**
 * §3.3a: Select the most contextually appropriate sensory variant for a scene.
 *
 * Priority: time+weather match > time-only match > any candidate.
 * Anti-repeat: if only one candidate remains and it was last used, shuffle.
 * Stable rotation: fallback uses `chapterIndex % candidates.length`.
 */

export const buildLocationProfilesBlock = (
  locationProfiles: any,
  scenesOverride: unknown[] | undefined,
  chapterStart: number,
  lastUsedSensoryVariant?: Record<string, string>,
): string => {
  if (!locationProfiles) return '';
  const loc = stripLocationParagraphs(locationProfiles);
  const primaryName = loc.primary?.name || 'N/A';
  const primaryPlace = loc.primary?.place || '';
  const primaryCountry = loc.primary?.country || '';
  const geographicContext = primaryPlace && primaryCountry
    ? primaryPlace + ', ' + primaryCountry
    : primaryPlace || primaryCountry || '';
  const primarySummary = loc.primary?.summary || '';
  const keyLocs = (loc.keyLocations || []).map((l: any) =>
    '- ' + l.name + ' (' + l.type + '): ' + l.purpose
  ).join('\n');
  const mood = loc.atmosphere?.mood || 'N/A';
  const weather = loc.atmosphere?.weather || 'N/A';
  // Build comprehensive sensory palette
  const sensoryExamples = (loc.keyLocations || []).slice(0, 3).map((l: any) => {
    const senses = l.sensoryDetails || {};
    const sights = (senses.sights || []).slice(0, 3).join(', ');
    const sounds = (senses.sounds || []).slice(0, 3).join(', ');
    const smells = (senses.smells || []).slice(0, 3).join(', ');
    const tactile = (senses.tactile || []).slice(0, 2).join(', ');
    return l.name + ' (' + l.type + '):\n  - Visual: ' + sights + '\n  - Sounds: ' + sounds + '\n  - Scents: ' + smells + (tactile ? '\n  - Touch: ' + tactile : '');
  }).join('\n\n');
  const locationLine = geographicContext
    ? 'Primary Location: ' + primaryName + ' (' + geographicContext + ')\n' + primarySummary
    : 'Primary Location: ' + primaryName + '\n' + primarySummary;
  // §1.5: Era markers — distinctive period-specific details for the location
  const eraMarkersArr: string[] = Array.isArray(loc.atmosphere?.eraMarkers)
    ? loc.atmosphere.eraMarkers
    : [];
  const eraMarkersStr = eraMarkersArr.length > 0
    ? '\n\nEra markers: ' + eraMarkersArr.slice(0, 6).join(' | ')
    : '';
  const sensoryGuidance = '\n\n⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.\n\nSCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room\'s qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.\n\nSENSORY WRITING TECHNIQUES:\n- Opening paragraphs: Lead with 2-3 sensory details to ground the scene\n- Movement between locations: Note sensory changes (quiet study → noisy dining room)\n- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)\n- Period authenticity: Use period-specific sensory details from location/temporal profiles\n- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature';
  let locationResult = '\n\nLOCATION PROFILES:\n\nYou have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.\n\n' + locationLine + '\n\nKey Locations Available:\n' + keyLocs + '\n\nAtmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): ' + mood + '\nWeather: ' + weather + eraMarkersStr + '\n\nUSAGE GUIDELINES:\n1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room\'s general qualities\n2. Geographic grounding: Reference the specific place (' + (geographicContext || 'setting') + ') naturally in dialogue or narrative\n3. Action scenes: Integrate physical layout details (access, sightlines, constraints)\n4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette\n5. Era details: Weave in period markers naturally\n6. Consistency: Keep all location descriptions aligned with profiles\n7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.\n8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.\n9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter\n\nSENSORY PALETTE (use 2-3 senses per scene):\n' + sensoryExamples + sensoryGuidance;
  // Append chapter-specific sensory palette hints derived from sensoryVariants objects
  if (Array.isArray(scenesOverride) && scenesOverride.length > 0 && Array.isArray(loc.keyLocations)) {
    const paletteHints: string[] = [];
    scenesOverride.forEach((scene: any, idx: number) => {
      const sceneSettingObj = scene.setting;
      const sceneSetting: string = (typeof sceneSettingObj?.location === 'string' ? sceneSettingObj.location : '').toLowerCase();
      const sceneTimeOfDay: string = (typeof sceneSettingObj?.timeOfDay === 'string' ? sceneSettingObj.timeOfDay : '').toLowerCase();
      const sceneWeather: string = (typeof sceneSettingObj?.atmosphere === 'string' ? sceneSettingObj.atmosphere : '').toLowerCase();
      const chapterNum = chapterStart + idx;
      const matchedLocation = (loc.keyLocations as any[]).find((kl: any) =>
        (kl.id && sceneSetting.includes(kl.id.toLowerCase())) ||
        (kl.name && sceneSetting.includes(kl.name.toLowerCase()))
      );
      if (matchedLocation?.sensoryVariants?.length > 0) {
        const variants: any[] = matchedLocation.sensoryVariants;
        const locationKey: string = matchedLocation.id ?? matchedLocation.name ?? '';
        const lastUsed = lastUsedSensoryVariant?.[locationKey];
        let variant: any = selectSensoryVariant(
          variants,
          chapterNum - 1,
          lastUsed,
          { timeOfDay: sceneTimeOfDay, weather: sceneWeather },
        );
        if (variant) {
          const sights = (variant.sights || []).slice(0, 2).join(', ');
          const sounds = (variant.sounds || []).slice(0, 2).join(', ');
          const smells = (variant.smells || []).slice(0, 2).join(', ');
          paletteHints.push(
            `  Chapter ${chapterNum} palette — ${variant.timeOfDay}, ${variant.weather}, ${variant.mood} mood [location: ${matchedLocation.name}]:\n` +
            `    • ${sights}\n    • ${sounds}\n    • ${smells}`
          );
        }
      }
    });
    if (paletteHints.length > 0) {
      locationResult += '\n\nCHAPTER SENSORY PALETTE HINTS (evoke these qualities without copying verbatim):\n' + paletteHints.join('\n');
    }
  }
  // §3.5: Inject overall sensory palette from atmosphere.sensoryPalette
  const palette = loc.primary?.atmosphere?.sensoryPalette;
  if (palette?.dominant) {
    const secondary = Array.isArray(palette.secondary) && palette.secondary.length > 0
      ? ` Secondary: ${(palette.secondary as string[]).slice(0, 3).join(', ')}.`
      : '';
    locationResult += `\n\nOverall palette: ${palette.dominant}.${secondary}`;
  }
  return locationResult;
};

/**
 * Builds the TEMPORAL CONTEXT block for prose prompts.
 * Accepts the full temporalContext object from ProseGenerationInputs.
 */
export const buildTemporalContextBlock = (
  temporalContext: any,
): string => {
  if (!temporalContext) return '';
  const canonicalSeasonSet = new Set<CanonicalSeason>(['spring', 'summer', 'autumn', 'winter']);
  const month = typeof temporalContext.specificDate?.month === 'string' && temporalContext.specificDate.month.trim().length > 0
    ? temporalContext.specificDate.month.trim()
    : 'Unknown month';
  const yearValue = temporalContext.specificDate?.year;
  const year = (typeof yearValue === 'number' || typeof yearValue === 'string')
    ? String(yearValue)
    : 'Unknown year';
  const dateStr = `${month} ${year}`;
  const explicitSeasonRaw = typeof temporalContext.seasonal?.season === 'string'
    ? temporalContext.seasonal.season.trim().toLowerCase()
    : '';
  const explicitSeason = canonicalSeasonSet.has(explicitSeasonRaw as CanonicalSeason)
    ? (explicitSeasonRaw as CanonicalSeason)
    : undefined;
  const season = explicitSeason ?? 'N/A';
  const seasonLock = deriveTemporalSeasonLock(temporalContext);
  const lockedSeason: CanonicalSeason | undefined = seasonLock?.season ?? explicitSeason;
  const forbiddenSeasons = lockedSeason
    ? (['spring', 'summer', 'autumn', 'winter'] as const).filter((s) => s !== lockedSeason).join(', ')
    : '';
  const seasonWeather = (temporalContext.seasonal?.weather || []).slice(0, 3).join(', ');
  const mensFormeal = (temporalContext.fashion?.mensWear?.formal || []).slice(0, 4).join(', ');
  const mensCasual = (temporalContext.fashion?.mensWear?.casual || []).slice(0, 3).join(', ');
  const mensAcc = (temporalContext.fashion?.mensWear?.accessories || []).slice(0, 3).join(', ');
  const womensFormeal = (temporalContext.fashion?.womensWear?.formal || []).slice(0, 4).join(', ');
  const womensCasual = (temporalContext.fashion?.womensWear?.casual || []).slice(0, 3).join(', ');
  const womensAcc = (temporalContext.fashion?.womensWear?.accessories || []).slice(0, 3).join(', ');
  const music = (temporalContext.cultural?.entertainment?.popularMusic || []).slice(0, 3).join(', ');
  const films = (temporalContext.cultural?.entertainment?.films || []).slice(0, 2).join(', ');
  const theaterStr = (temporalContext.cultural?.entertainment?.theater || []).slice(0, 2).join(', ');
  const radioStr = (temporalContext.cultural?.entertainment?.radio || []).slice(0, 2).join(', ');
  const litPubs = (temporalContext.cultural?.literature?.recentPublications || []).slice(0, 3);
  const litGenres = (temporalContext.cultural?.literature?.popularGenres || []).slice(0, 3);
  const techItems = [
    ...(temporalContext.cultural?.technology?.recentInventions || []).slice(0, 3),
    ...(temporalContext.cultural?.technology?.commonDevices || []).slice(0, 3),
  ];
  const dailyActivities = (temporalContext.cultural?.dailyLife?.commonActivities || []).slice(0, 3);
  const socialRituals = (temporalContext.cultural?.dailyLife?.socialRituals || []).slice(0, 3);
  const seasonalDaylight = temporalContext.seasonal?.daylight;
  const seasonalActivities = (temporalContext.seasonal?.seasonalActivities || []).slice(0, 4);
  const seasonalHolidays = (temporalContext.seasonal?.holidays || []).slice(0, 3);
  const prices = (temporalContext.cultural?.dailyLife?.typicalPrices || []).slice(0, 4).join(', ');
  const majorEvents = (temporalContext.currentAffairs?.majorEvents || []).slice(0, 2).join('; ');
  const atmosphericDetails = (temporalContext.atmosphericDetails || []).slice(0, 4).join(' ');
  const entertainmentLine = '- Music/entertainment: ' + music +
    (films ? '; Films: ' + films : '') +
    (theaterStr ? '; Theatre: ' + theaterStr : '') +
    (radioStr ? '; Radio: ' + radioStr : '');
  const literatureLine = (litPubs.length || litGenres.length)
    ? '\n- Literature: ' + [...litPubs, ...litGenres.map((g: string) => `[${g}]`)].join(' | ')
    : '';
  const technologyLine = techItems.length
    ? '\n- Technology: ' + techItems.join(' | ')
    : '';
  const dailyLifeLine = dailyActivities.length
    ? '\n- Daily life: ' + dailyActivities.join(', ')
    : '';
  const socialRitualsLine = socialRituals.length
    ? '\n- Social rituals: ' + socialRituals.join(', ')
    : '';
  const socialAttitudes = temporalContext.socialAttitudes;
  const socialAttitudesParts: string[] = [];
  if ((socialAttitudes?.class || []).length) {
    socialAttitudesParts.push(`class: ${(socialAttitudes.class as string[]).slice(0, 2).join(', ')}`);
  }
  if ((socialAttitudes?.gender || []).length) {
    socialAttitudesParts.push(`gender: ${(socialAttitudes.gender as string[]).slice(0, 2).join(', ')}`);
  }
  if ((socialAttitudes?.generalNorms || []).length) {
    socialAttitudesParts.push(`norms: ${(socialAttitudes.generalNorms as string[]).slice(0, 2).join(', ')}`);
  }
  const socialAttitudesLine = socialAttitudesParts.length
    ? '\n- Social attitudes — ' + socialAttitudesParts.join(' | ')
    : '';
  const seasonLockRule = lockedSeason
    ? '\n8. Season lock (hard): This timeline is anchored to ' + month + ' (' + lockedSeason + '). Avoid incompatible seasonal labels (' + forbiddenSeasons + ') in the same chapter.'
    : '\n8. Season lock (hard): No canonical season is provided. Keep seasonal language internally consistent within each chapter and avoid mixing different seasons.';
  const seasonalLanguageRule = lockedSeason
    ? '\n9. SEASONAL LANGUAGE — EXCLUSIVE ALLOW-LIST:\n   Allowed seasonal vocabulary (only these are permitted): ' + getSeasonAllowList(lockedSeason) + '\n   Forbidden seasonal words (never use, even in metaphors or dialogue): ' + forbiddenSeasons + ' and their adjective forms.\n   Replace any forbidden seasonal word immediately — in narration, dialogue, and internal character thought.\n   Do not use forbidden words even as part of a simile, metaphor, or poetic line.'
    : '\n9. SEASONAL LANGUAGE — CONSISTENCY RULE:\n   Because no canonical season is locked, avoid explicit seasonal labels unless the chapter establishes one and then remains consistent with it.';
  const fashionGuidance = '\n\nFASHION INTEGRATION TECHNIQUES:\n- First appearance: Describe outfit to establish class/personality\n- Accessories: Gloves, hats, pocket watches, jewelry reveal status\n- Time-specific: Different outfits for different times of day\n- Character traits: Fastidious dresser vs rumpled appearance\n- Action integration: "She tugged at her glove" or "He adjusted his tie"\n- Weather appropriate: Overcoats in winter, light linen in summer';
  const culturalGuidance = '\n\nCULTURAL TOUCHSTONE INTEGRATION:\n- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"\n- Background details: Radio playing, newspaper headlines, theater posters\n- Social commentary: Characters discuss current events naturally\n- Class indicators: Aristocrats discuss opera, servants discuss music halls\n- Authentic references: Use actual songs, films, events from the specific date';
  return '\n\nTEMPORAL CONTEXT:\n\nThis story takes place in ' + dateStr + ' during ' + season + '.\n\nSeasonal Atmosphere:\n- Weather patterns: ' + seasonWeather +
    (seasonalDaylight ? '\n- Daylight: ' + seasonalDaylight : '') +
    (seasonalActivities.length ? '\n- Seasonal activities: ' + seasonalActivities.join(', ') : '') +
    (seasonalHolidays.length ? '\n- Seasonal occasions: ' + seasonalHolidays.join(', ') : '') +
    '\n- Season: ' + season + '\n\nPeriod Fashion (describe naturally):\n- Men formal: ' + mensFormeal + '\n- Men casual: ' + mensCasual + '\n- Men accessories: ' + mensAcc + '\n- Women formal: ' + womensFormeal + '\n- Women casual: ' + womensCasual + '\n- Women accessories: ' + womensAcc + '\n\nCultural Context (reference naturally):\n' + entertainmentLine + '\n- Typical prices: ' + prices + (majorEvents ? '\n- Current events: ' + majorEvents : '') + literatureLine + technologyLine + dailyLifeLine + socialRitualsLine + '\n\nAtmospheric Details:\n' + atmosphericDetails + fashionGuidance + culturalGuidance + '\n\nUSAGE REQUIREMENTS:\n1. Date references: Mention month/season at least once early in story\n2. Fashion descriptions: Every character gets fashion description on first appearance\n3. Cultural touchstones: Reference music/entertainment 2-3 times across story\n4. Prices/daily life: Use when relevant (meals, tickets, wages)\n5. Seasonal consistency: Weather and atmosphere must match ' + month + ' and ' + season + ' throughout\n6. Historical accuracy: NO anachronisms for ' + dateStr + '\n7. Month-season lock: If a chapter mentions ' + month + ', do not use conflicting season labels in that chapter.'
    + seasonLockRule
    + seasonalLanguageRule
    + socialAttitudesLine;
};

export const buildSettingRefinementBlock = (caseData: CaseData): string => {
  const setting = (caseData as any)?.SETTING_REFINEMENT;
  if (!setting || typeof setting !== 'object') return '';

  const era = setting.era ?? {};
  const loc = setting.location ?? {};
  const atmosphere = setting.atmosphere ?? {};
  const realism = setting.realism ?? {};

  const technology = Array.isArray(era.technology) ? era.technology.slice(0, 4).join(' | ') : '';
  const communication = Array.isArray(era.communication) ? era.communication.slice(0, 3).join(' | ') : '';
  const socialNorms = Array.isArray(era.socialNorms) ? era.socialNorms.slice(0, 3).join(' | ') : '';
  const policing = Array.isArray(era.policing) ? era.policing.slice(0, 3).join(' | ') : '';
  const constraints = Array.isArray(loc.physicalConstraints) ? loc.physicalConstraints.slice(0, 4).join(' | ') : '';
  const access = Array.isArray(loc.accessControl) ? loc.accessControl.slice(0, 4).join(' | ') : '';
  const recommendations = Array.isArray(realism.recommendations) ? realism.recommendations.slice(0, 4) : [];

  const lines: string[] = ['\n\nSETTING REFINEMENT CONSTRAINTS (authoritative grounding):'];
  if (era.decade) lines.push(`- Era anchor: ${era.decade}.`);
  if (technology) lines.push(`- Era technology texture: ${technology}`);
  if (communication) lines.push(`- Communication limits: ${communication}`);
  if (socialNorms) lines.push(`- Social norms to respect: ${socialNorms}`);
  if (policing) lines.push(`- Policing/procedure constraints: ${policing}`);
  if (loc.type || loc.description) {
    lines.push(`- Location frame: ${loc.type ?? 'setting'}${loc.description ? ` — ${loc.description}` : ''}`);
  }
  if (loc.geographicIsolation) lines.push(`- Isolation pressure: ${loc.geographicIsolation}`);
  if (constraints) lines.push(`- Physical movement constraints: ${constraints}`);
  if (access) lines.push(`- Access-control realities: ${access}`);
  if (atmosphere.weather || atmosphere.timeOfDay || atmosphere.mood) {
    lines.push(
      `- Baseline atmosphere: ${atmosphere.weather ?? 'unspecified weather'} | ${atmosphere.timeOfDay ?? 'unspecified time'} | ${atmosphere.mood ?? 'unspecified mood'}`,
    );
  }
  if (recommendations.length > 0) {
    lines.push('- Realism recommendations (must influence scene choices):');
    recommendations.forEach((rec: string) => lines.push(`  - ${rec}`));
  }

  return lines.join('\n');
};

export const buildBackgroundContextBlock = (caseData: CaseData): string => {
  const background = (caseData as any)?.BACKGROUND_CONTEXT ?? (caseData as any)?.background_context;
  if (!background || typeof background !== 'object') return '';

  const lines: string[] = ['\n\nBACKGROUND CONTEXT (social coherence anchor):'];
  if (background.backdropSummary) lines.push(`- Backdrop summary: ${background.backdropSummary}`);
  if (background.theme) lines.push(`- Background theme pressure: ${background.theme}`);
  if (background.era?.decade || background.era?.socialStructure) {
    lines.push(`- Era-social frame: ${background.era?.decade ?? 'unspecified decade'} | ${background.era?.socialStructure ?? 'unspecified social structure'}`);
  }
  if (background.setting?.location || background.setting?.institution || background.setting?.weather) {
    lines.push(
      `- Social arena: ${background.setting?.location ?? 'unspecified location'} | ${background.setting?.institution ?? 'unspecified institution'}${background.setting?.weather ? ` | weather: ${background.setting.weather}` : ''}`,
    );
  }
  if (Array.isArray(background.castAnchors) && background.castAnchors.length > 0) {
    lines.push(`- Cast anchors for social continuity: ${background.castAnchors.slice(0, 8).join(', ')}`);
  }
  lines.push('- Keep chapter interactions legible through this shared social pressure; avoid disconnected scene-to-scene social logic.');
  return lines.join('\n');
};

export const buildFairPlayContractBlock = (caseData: CaseData): string => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const fairPlay = cmlCase.fair_play ?? {};
  const falseAssumption = cmlCase.false_assumption ?? {};
  const inferenceSteps = Array.isArray(cmlCase.inference_path?.steps) ? cmlCase.inference_path.steps : [];
  const discriminatingTest = cmlCase.discriminating_test ?? {};

  // P2-19: Baseline guardrails are always included so they go through the token-budget system
  // (fair_play_contract block, priority critical) rather than being hardcoded outside the budget.
  // These were previously injected via a separate fairPlayGuardrails array in buildProsePrompt.
  const lines: string[] = [
    '\n\nFAIR-PLAY AND INFERENCE CONTRACT:',
    '- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.',
    '- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.',
    '- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.',
    '- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.',
    '- Never solve by withheld information. Keep reader-information parity with detective reasoning.',
  ];

  if (falseAssumption.statement) {
    // Surface assumption is the reader-facing premise — keep it readable. The HIDDEN truth is schema
    // scaffold the LLM copies → surface key terms only (R-A, M0).
    lines.push(`- False assumption in force: ${falseAssumption.statement}`);
    if (falseAssumption.what_it_hides) {
      lines.push(`- Hidden truth to progressively expose (compose in your own words from these elements): ${surfaceSpecKeyTerms(String(falseAssumption.what_it_hides))}`);
    }
  }
  if (inferenceSteps.length > 0) {
    lines.push('- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):');
    inferenceSteps.slice(0, 4).forEach((step: any, idx: number) => {
      // R-A leakage cure: never hand the LLM the full observation/correction/effect SENTENCE — it copies
      // it verbatim (the door-bolt/thermal leaks). Surface only the deduped key TERMS so it must compose.
      const obs = surfaceSpecKeyTerms(String(step?.observation ?? ''));
      const corr = surfaceSpecKeyTerms(String(step?.correction ?? ''));
      const effect = surfaceSpecKeyTerms(String(step?.effect ?? ''));
      const snippet = [obs && `obs: ${obs}`, corr && `corr: ${corr}`, effect && `effect: ${effect}`].filter(Boolean).join(' | ');
      if (snippet) lines.push(`  - Step ${idx + 1}: ${snippet}`);
    });
  }
  if (Object.keys(discriminatingTest).length > 0) {
    if (discriminatingTest.method) lines.push(`- Discriminating test method: ${discriminatingTest.method}`);
    if (discriminatingTest.design) lines.push(`- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): ${surfaceSpecKeyTerms(String(discriminatingTest.design))}`);
    if (Array.isArray(discriminatingTest.evidence_clues) && discriminatingTest.evidence_clues.length > 0) {
      lines.push(`- Test must rely on already-shown clue IDs: ${discriminatingTest.evidence_clues.join(', ')}`);
    }
  }
  if (typeof fairPlay.explanation === 'string' && fairPlay.explanation.trim().length > 0) {
    lines.push(`- Fair-play rationale: ${fairPlay.explanation.trim()}`);
  }

  return lines.join('\n');
};

/**
 * M6 — WHAT THE FINISHED STORY IS JUDGED ON (architecture/REVIEW_10.md §2, §10).
 *
 * Agent 9 has never been told the rubric it is scored against. Every other block in its prompt
 * describes the CASE — the clues, the contract, the times, the voices. None describes the STANDARD.
 *
 * WHY THIS IS THE PROBE AT THE CEILING. REVIEW_09 §1 split the ten categories in two: four that swing
 * three and four marks with the machinery (premise, plot, clues, ending) and six that have never moved
 * at all — opening hook and atmosphere sit at exactly 8 in five external reads out of five, with ZERO
 * variance, and dialogue has never once exceeded 7. No detector reaches those six. They are prompt and
 * model work, and this is the cheaper of the two.
 *
 * THREE RULES, EACH GUARDING A FAILURE THIS CODEBASE HAS ALREADY PAID FOR.
 *
 * 1. THE WRITER'S VOCABULARY, NOT THE JUDGE'S. This is deliberately NOT `buildRubricSystemPrompt()`
 *    pasted across. That text is written for a critic — "start EACH category at 5/10", the `flags`
 *    list, the citation protocol — and handing it to the author would make the internal score measure
 *    the prompt's own echo: the story written in the grader's words, then graded by them. The external
 *    read is the only honest measurement of M6 either way, and keeping the two vocabularies apart is
 *    what stops an internal gain from being pure Goodhart. Pinned by test against the judge's prompt.
 *
 * 2. NO FLAG LIST. Naming `mechanismIncoherent` or `revealUsesUnplantedEvidence` teaches a model to
 *    avoid the DETECTOR, not the defect. Every one of those conditions is already constrained by a
 *    block that states it positively — geometry, fair play, physical plausibility.
 *
 * 3. NO EXAMPLE SENTENCES. `story-geometry/prompt.ts`'s rule, and it applies with more force here:
 *    *"the block states obligations in the vocabulary of the finished text, and stops"*. The moment
 *    this supplies prose it becomes the injector layer under a new name, and X40 exists precisely
 *    because pipeline text reaches the page. The craft and humour guides beside it carry the examples;
 *    this one carries the standard.
 *
 * WEIGHTED TOWARD THE SIX THAT DO NOT MOVE. All ten are named — a story is judged on all ten, and a
 * partial list reads as a licence on the rest — but the four the machinery already drives get one
 * clause each and the six get the detail. That is where the marks are.
 *
 * THE HONEST LIMIT, stated here because the run will not state it: on hook and atmosphere the readers
 * are already complimentary AT 8 (*"strong setup"*, *"cold cliffside hotel, fog, ship's bell — all
 * work"*), and no read has ever described what a 9 would contain. This block cannot target what no
 * reader has named. If those two stay at 8 after M6, that is REVIEW_10 §8's falsification arriving,
 * and Move 4 — a frontier generation model — becomes the honest next step rather than a speculative
 * one.
 *
 * Empty string when disabled, so `buildPromptContextBlocks` filters it out and the prompt is
 * byte-identical to what it has always emitted.
 */
export const buildJudgedOnBlock = (enabled: boolean): string => {
  if (!enabled) return '';
  return [
    '\n\nHOW THIS STORY WILL BE JUDGED:',
    '',
    'A reader scores the finished book out of 10 in each of ten areas. Marks are earned by what is ' +
      'visible on the page, never by intent: a promising premise does not carry a confusing draft, and ' +
      'a category is never credited for something the text merely implies.',
    '',
    'The six that decide whether a sound mystery reads as a good BOOK:',
    '- OPENING HOOK: the first chapter puts a concrete physical situation in front of the reader and ' +
      'makes the second chapter necessary. Not a promise of interest later — a reason to keep reading now.',
    '- ATMOSPHERE: place, weather, hour and social temperature are felt through what characters notice ' +
      'while doing something else. Mood carried by a few recurring physical anchors, not by adjectives.',
    '- CHARACTER CLARITY: each person is instantly distinguishable and stays themselves. Clarity is the ' +
      'floor, not the target — a reader who can only say the roles were stable has given you eight out ' +
      'of ten. Wanting a particular suspect to be innocent is what earns nine.',
    '- DIALOGUE: every speaker sounds like a different person, and speech does work beyond conveying ' +
      'facts — evasion, pressure, affection, self-protection. Nobody says aloud what they would not ' +
      'naturally say, and no character reuses a formulation they have used before.',
    '- PACING: each chapter changes what the reader understands. Nothing is restated once it has landed, ' +
      'and no late chapter re-argues a case the reader has already been given.',
    '- PROSE: it reads as fiction throughout. Nothing on the page sounds like a summary, a report, a ' +
      'checklist, or a note about the story rather than the story itself.',
    '',
    'And the four the structure already carries — premise, plot structure, clues and evidence logic, and ' +
      'the ending — are judged on whether the idea is distinctive, the shape holds, every deduction rests ' +
      'on something the reader was shown first, and the close answers the question completely.',
    '',
    'Write to be READ, not to be checked. Satisfying the obligations elsewhere in this prompt is the ' +
      'minimum; these ten are the whole of what a reader will say about the result.',
  ].join('\n');
};
