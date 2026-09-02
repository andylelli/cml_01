/**
 * Glue between the verifiers, the Story Bible, and the scoped regen loop (first-principles LLD §6.4 /
 * P3.3). Pure and testable: it turns a `ProseDefect` into a fully-constrained `RegenRequest` by
 * DEREFERENCING the Bible (pronouns from identity, locked-fact values, the culprit embargo from the
 * chapter beat) — nothing re-derived — and composes the chapter validator the loop gates against. The
 * orchestrator's remaining job is then just: detect defects → `runRegenRepair(..., makeRegenFn(...))`.
 */

import { buildCulpritEvidenceSentenceInScene } from "./injection-templates.js";
import {
  noScaffoldValidator,
  detectScaffoldNotProse,
  detectReportStyleClearance,
  noReportStyleClearanceValidator,
  // A_62 RC-2.1 — the detector the rubric's `templateLeakageHits` cap already keys off. It has lived in
  // this shared package all along; only the generation-side consumer was missing (see below).
  detectTemplateLeakage,
  // A_62 RC-2.2 — moved INTO prose-guard from rubric-score so this loop can reach it (the RC-2 rule).
  detectDualValueNoContrast,
} from "@cml/prose-guard";
import type { DiscriminatingPair } from "@cml/prose-guard";
import type { ValidatorResult } from "@cml/prose-guard";
import type { ClueDistributionResult } from "../agent5-clues.js";
import type { StoryBible, ChapterBeat } from "../story-bible.js";
import { chapterMentionsRequiredClue, resolveClueObligationState, RESOLUTION_RE } from "./clue-validation.js";
import type { ProseChapter, ChapterRequirementLedgerEntry } from "./types.js";
import { runRegenRepair } from "./regen-repair.js";
import type { ChapterValidator, ProseDefect, RegenFn, RegenRequest } from "./regen-repair.js";
// Leaf-module detectors (no cycle: mechanism-detect.js imports nothing from generate/regen-integration).
import { chapterFullyExplainsMechanism, mechanismExplanationParagraphIndex } from "./mechanism-detect.js";
// S3 — the pass registry plus the result-shaping tail every pass used to repeat inline.
import { finishRegenPass, regenPassDidNotRun } from "./regen-registry.js";
// The aftermath-repeat detector, imported rather than reimplemented: the repair must be validated
// against the SAME body the acceptance test uses, or it can pass its own check and fail the real one.
import { detectAftermathRepeatParagraphs } from "@cml/story-geometry";
import { CLEARANCE_TERMS_WITH_KILLER_RE as CLEARANCE_TERMS, CLEARANCE_EVIDENCE_RE as CLEARANCE_EVIDENCE } from "../shared/clearance-vocabulary.js";

const pronounFor = (gender: string): string => (gender === "male" ? "he/him" : gender === "female" ? "she/her" : "they/them");

/** Locked pronouns per named character, from the Bible identity substrate (D5). */
export function pronounsFromBible(bible: Pick<StoryBible, "characters">): Record<string, string> {
  const out: Record<string, string> = {};
  for (const c of bible.characters ?? []) {
    if (c.name) out[c.name] = pronounFor(c.gender);
  }
  return out;
}

/**
 * A_61 RC2.2 — the canonical typed gender per named character from the frozen Bible (male/female only;
 * "unknown" is omitted — the contradiction gate surfaces it). This is the SINGLE authoritative gender
 * source the validators/generation dereference under AGENT9_BIBLE_AUTHORITATIVE, instead of each site
 * re-parsing raw cast gender. (RC2.5's soundness repair guarantees no cast member reaches here unknown.)
 */
export function genderMapFromBible(bible: Pick<StoryBible, "characters">): Record<string, "male" | "female"> {
  const out: Record<string, "male" | "female"> = {};
  for (const c of bible.characters ?? []) {
    if (c.name && (c.gender === "male" || c.gender === "female")) out[c.name] = c.gender;
  }
  return out;
}

/** Atomic locked-fact values that must be reproduced verbatim (descriptive facts are paraphrasable). */
export function lockedFactValues(bible: Pick<StoryBible, "facts">): Array<{ value: string; description?: string }> {
  return (bible.facts ?? [])
    .filter((f) => f.type === "atomic" && f.value)
    .map((f) => ({ value: f.value, description: f.description || undefined }));
}

/** The reveal embargo for a chapter: the culprit name(s) when this beat must not reveal the solution,
 *  plus (A_61 RC2.4) the concealment mechanism when this beat precedes the discriminating-test chapter. */
export function embargoForBeat(bible: Pick<StoryBible, "culprits">, beat: ChapterBeat | undefined): string[] {
  if (!beat) return [];
  const out: string[] = [];
  if (beat.mustNotReveal?.solutionCulprit) {
    out.push(...(bible.culprits ?? []).map((c) => `${c} is the culprit`), ...(beat.mustNotReveal.clues ?? []));
  }
  if (beat.mustNotReveal?.mechanism) {
    out.push("how the concealment mechanism works (withheld until the discriminating test)");
  }
  return out;
}

/**
 * The A1 early-clue lead emitted by deterministic-repair.ts (and matched by prose-guard's
 * `A1:laid_facts_out` detector). MUST stay byte-identical to both — the scaffold override below keys
 * off its presence in the defect detail.
 */
const A1_EARLY_CLUE_LEAD = "laid the facts out plainly where the others could see them";

/** Map a defect kind to a concrete in-scene instruction for the model. */
export function instructionForDefect(defect: ProseDefect): string {
  const ref = defect.obligationRef ? ` (${defect.obligationRef})` : "";
  switch (defect.kind) {
    case "missing_clue":
      return `Plant the required clue${ref} in this chapter as a concrete in-scene observation a character sees, does, or says — not as a summary. Detail: ${defect.detail}`;
    case "clue_too_late":
      return `The required clue${ref} surfaces too late in this chapter. ADD a concrete in-scene observation of it within the FIRST QUARTER of the chapter — something a character sees, does, or says inside the ongoing scene, not a summary — and keep the existing later mention intact. Detail: ${defect.detail}`;
    case "missing_clearance":
      return `Dramatize the clearance of ${defect.obligationRef ?? "this suspect"} as a witnessed deduction (where they were, who saw them) — not a verdict. Detail: ${defect.detail}`;
    case "missing_resolution":
      return `Render the resolution in-scene (confession / arrest / consequence), naming the culprit — not as a report. Detail: ${defect.detail}`;
    case "culprit_unlinked":
      return `Connect the culprit to the means and method through evidence already on the page, dramatized — not asserted. Detail: ${defect.detail}`;
    case "scaffold_not_prose":
      // The A1 early-clue lead: a free rewrite dramatizes it as the investigator ANNOUNCING the case
      // to assembled listeners (the reveal-style chapter opening). Constrain the rewrite to a private,
      // in-scene noticing instead.
      if (defect.detail.toLowerCase().includes(A1_EARLY_CLUE_LEAD)) {
        return `Rewrite the flagged sentence(s) so the investigator PRIVATELY notices or examines the evidence inside the ongoing scene, preserving the underlying fact(s). Do NOT stage the investigator announcing conclusions or presenting the case to assembled listeners, and do NOT summarize what is known. Detail: ${defect.detail}`;
      }
      // A_64 §2 F3: "preserving the underlying fact. Detail: <fragment>" read to the model as "keep
      // this wording" — dv_clock_off's regen echoed the flagged sentence back verbatim. Make the
      // replace-the-wording contract explicit; the fragments are machine-inserted template text.
      return `The flagged fragment(s) are machine-inserted template text, not authored prose. REPLACE each flagged sentence entirely — do not reuse or lightly edit its wording — conveying the same underlying fact (who was where, what the evidence shows) through in-scene action or dialogue. Flagged: ${defect.detail}`;
    case "missing_case_transition_bridge":
      return `Insert an explicit body-discovery / confirmation / identification bridge that reclassifies the missing-person case as murder BEFORE any murder language appears — a concrete, witnessed discovery event, not a summary. Detail: ${defect.detail}`;
    case "pronoun_mismatch":
      return `Correct the pronoun(s) to match the locked gender for the named character; change nothing else. Detail: ${defect.detail}`;
    case "locked_fact_absent":
      return `Surface the locked fact${ref} verbatim, woven into the scene. Detail: ${defect.detail}`;
    case "mechanism_revealed_early":
      return `Withhold the causal/method explanation of the concealment mechanism. Keep the physical clue/observation on the page (name the object, what was seen, what was measured), but do NOT explain HOW the trick worked — remove the "because / so that / this allowed / how the X worked" causal clause — until the discriminating-test scene. Detail: ${defect.detail}`;
    case "early_spoiler":
    case "leakage":
      return `Remove the premature reveal / leaked material, keeping the scene intact. Detail: ${defect.detail}`;
    case "voice_tic_leakage":
      return `Rewrite the flagged speaker's dialogue so it stays in THEIR OWN idiom: remove the other character's signature phrase from their line. Do NOT reassign the line to the other character and do NOT delete the exchange — reword it in the speaker's established voice, preserving what the line communicates. Detail: ${defect.detail}`;
    case "aftermath_repeat":
      // The negative constraint. Deletion is the cheapest way to silence the detector and the worst
      // outcome — an aftermath chapter with its content excised is shorter, flatter, and trips the
      // word-floor gate. So the instruction asks for REPLACEMENT with the thing the chapter actually
      // owes: what the disclosure cost the people still in the room.
      return `This chapter is the aftermath. The chapter before it has ALREADY told the reader who did it, how, and why — ` +
        `so re-explaining any of that here is the reader being told twice. Rewrite the flagged paragraph so it carries ` +
        `CONSEQUENCE and REACTION instead: what this has cost, what someone does or cannot do now, what is said or left ` +
        `unsaid between the people still here. Keep the paragraph roughly its present length — replace the restatement, ` +
        `do not delete it. Do not re-name the culprit as a discovery, do not restate the method, the motive or how the ` +
        `concealment worked, and do not clear any suspect. ` +
        // A_82 §14.3/S13.6, live measurement: this defect kind failed both regen attempts on the same
        // paragraph — chapter 9's Beatrice asks the culprit "You did this for me, didn't you?" and the
        // rewrite kept answering it with a restated justification ("I believed it was the only way to
        // prevent ruin... I judged it necessary"), which is exactly the motive restatement the
        // instruction above already forbids. A DIRECT QUESTION FROM ANOTHER CHARACTER pulls the model
        // toward re-arguing the case even when told not to, so name that specific shape: if the
        // flagged paragraph contains another character asking the culprit to confirm or explain WHY.
        `If the flagged paragraph contains another character asking the culprit to confirm or explain ` +
        `WHY, the culprit's answer must be an ACKNOWLEDGEMENT ONLY — a single word, a silence, a look, a ` +
        `physical gesture — never a restated reason, a re-justification, or an "I did it because" ` +
        `clause. The case for why was already made; this chapter is what it costs to have heard it. ` +
        `Detail: ${defect.detail}`;
    case "dual_value_no_contrast":
      // A_62 RC-2.2 / A_57 D2 — the central clue stated as two flat side-by-side truths. The fix is
      // MORE binding, not less content: both canonical values must survive, joined as one observed
      // contradiction. Deleting either value would silence the detector while destroying the clue.
      return `The two flagged values are stated as flat, parallel facts. Rewrite so a character OBSERVES them as one contradiction: keep BOTH values verbatim on the page and bind them with explicit contrast (yet / but / could only / impossible / did not match) inside the ongoing scene. Do NOT delete or alter either value, and do NOT explain HOW the trick behind the discrepancy worked. Detail: ${defect.detail}`;
    default:
      return defect.detail;
  }
}

/** The Bible slice the regen dereferences: locked facts, identity pronouns, culprit embargo, beat sheet. */
export type RegenBible = Pick<StoryBible, "facts" | "characters" | "culprits" | "beatSheet">;

/** Build the fully-constrained regen request for a defect, dereferencing the Bible. */
export function buildRegenRequest(chapter: ProseChapter, defect: ProseDefect, bible: RegenBible): RegenRequest {
  const beat = bible.beatSheet?.find((b) => b.chapter === defect.chapter);
  return {
    chapter,
    paragraphIndex: defect.paragraphIndex,
    instruction: instructionForDefect(defect),
    constraints: {
      lockedFacts: lockedFactValues(bible),
      pronouns: pronounsFromBible(bible),
      mustNotReveal: embargoForBeat(bible, beat),
    },
    defect,
  };
}

/**
 * Compose the chapter validator the loop gates against: the general scaffold gate (every regen must
 * not re-introduce template) plus any caller-supplied targeted checks (clue presence, pronoun count,
 * fidelity). Scores sum and violations concat — a regen ships only if it improves the target and
 * regresses none of these. Mirrors `prose-guard`'s `allOf`, lifted to `ProseChapter`.
 */
export function composeChapterValidator(
  ...checks: Array<(chapter: ProseChapter) => ValidatorResult>
): ChapterValidator {
  const all = [(c: ProseChapter) => noScaffoldValidator((c.paragraphs ?? []).join(" ")), ...checks];
  return (chapter: ProseChapter): ValidatorResult => {
    const results = all.map((v) => v(chapter));
    return {
      ok: results.every((r) => r.ok),
      score: results.reduce((s, r) => s + r.score, 0),
      violations: results.flatMap((r) => r.violations),
    };
  };
}

const chapterText = (c: ProseChapter): string => (c.paragraphs ?? []).join(" ");

/** A presence check for one required clue id, for the composed validator. */
const cluePresenceValidator =
  (clueId: string, clueDistribution?: ClueDistributionResult, castNames?: string[]) =>
  (c: ProseChapter): ValidatorResult => {
    const present = chapterMentionsRequiredClue(chapterText(c), clueId, clueDistribution, castNames);
    return { ok: present, score: present ? 100 : 0, violations: present ? [] : [`missing_clue:${clueId}`] };
  };

/**
 * Early-placement check for one required clue, for the composed validator. Dereferences the SAME
 * composite the deterministic floor keys off (`resolveClueObligationState().isEarlyEnough` — i.e.
 * chapterClueAppearsEarly plus the context-only fallback), so a regen that passes here provably
 * pre-empts the early-clue prepend in `applyDeterministicCluePatch`. Not re-derived.
 */
const clueEarlyPlacementValidator =
  (
    clueId: string,
    ledgerEntry: ChapterRequirementLedgerEntry,
    clueDistribution?: ClueDistributionResult,
    castNames?: string[],
  ) =>
  (c: ProseChapter): ValidatorResult => {
    const early = resolveClueObligationState(c, ledgerEntry, clueId, clueDistribution, castNames).isEarlyEnough;
    return { ok: early, score: early ? 100 : 0, violations: early ? [] : [`clue_too_late:${clueId}`] };
  };

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A_73 §11.1 — single-sourced (this is the +killer variant); see shared/clearance-vocabulary.ts

/** A co-located clearance check for one suspect: name + clearance term + evidence connector in one paragraph. */
const clearancePresenceValidator =
  (suspect: string) =>
  (c: ProseChapter): ValidatorResult => {
    const name = suspect.trim();
    const surname = name.split(/\s+/).pop() ?? name;
    const nameRe = new RegExp(`\\b(?:${escapeRe(name)}|${escapeRe(surname)})\\b`, "i");
    const present = (c.paragraphs ?? []).some(
      (p) => nameRe.test(p) && CLEARANCE_TERMS.test(p) && CLEARANCE_EVIDENCE.test(p),
    );
    return { ok: present, score: present ? 100 : 0, violations: present ? [] : [`missing_clearance:${name}`] };
  };

const normPara = (p: string): string => String(p ?? "").replace(/\s+/g, " ").trim();

/**
 * Insertion-only guard for clue planting: the regen may ADD paragraphs (where the new in-scene
 * observation lives) but must not MODIFY or DROP any existing paragraph. This is the deterministic
 * safety net for the `repair.ts:153` lesson — a whole-chapter regen that re-genders a character, drops
 * an already-present clue, or alters a locked-fact value in untouched text changes an original
 * paragraph, so it fails here and is rolled back. Whitespace-normalized so trivial reformatting of a
 * preserved paragraph does not false-trip.
 */
const preserveOriginalParagraphsValidator =
  (originalParagraphs: ReadonlyArray<string>) =>
  (c: ProseChapter): ValidatorResult => {
    const present = new Set((c.paragraphs ?? []).map(normPara));
    const dropped = originalParagraphs.map(normPara).filter((p) => p.length > 0 && !present.has(p));
    if (dropped.length > 0) {
      /**
       * A_73 §4.2/§4.3 — NAME WHAT THIS GUARD THREW AWAY.
       *
       * The 2026-08-23 run spent 18 `missing_clue` regen calls, and the log showed them failing in
       * TWO different ways that nothing distinguished:
       *
       *   ch4 clue_5  ×2  "did not improve the targeted property (score 200, was 200)"
       *   ch6 clue_14 ×4  "regen introduced: modified_or_dropped_original_paragraph:1"
       *
       * The second is not a clue failure at all — the regen was rejected by THIS guard, which is
       * exact set-membership over whitespace-normalised paragraphs, so changing one word in any
       * pre-existing paragraph rolls back the whole candidate INCLUDING a clue insertion that
       * worked. Four paid calls on ch6 died here rather than to the thing they were sent to fix,
       * and then the deterministic injector pasted the template prose the reader complains about.
       *
       * The guard is NOT loosened — it exists for the `repair.ts:153` lesson (a whole-chapter regen
       * that re-genders a character or alters a locked-fact value in untouched text). What changes
       * is that the rejected paragraph is now visible, so the next person can answer the question
       * this pass could not: is the guard protecting the book, or discarding good repairs?
       */
      console.warn(
        `[Agent 9][A_73] regen REJECTED by paragraph-preservation guard: ${dropped.length} original ` +
          `paragraph(s) modified or dropped. First: "${dropped[0]!.slice(0, 120)}…" — the candidate is ` +
          `discarded whole, including any obligation it satisfied.`,
      );
    }
    return {
      ok: dropped.length === 0,
      score: dropped.length === 0 ? 100 : 0,
      violations: dropped.length > 0 ? [`modified_or_dropped_original_paragraph:${dropped.length}`] : [],
    };
  };

export interface InsertionRegenPassResult {
  chapter: ProseChapter;
  /** obligationRefs that were missing and are now present after regen. */
  repaired: string[];
  /** obligationRefs regen could not surface — caller logs + falls to the deterministic floor. */
  unresolved: string[];
  /** true when at least one defect was present (i.e. the pass actually ran a regen). */
  ran: boolean;
  /** A_64 §2 F3 — scaffold rules de-templated by the deterministic exhaustion floor (scaffold pass only). */
  floored?: string[];
}

/**
 * P4 — the general insertion-regen pass: dramatize each given defect (clue, clearance, resolution, …)
 * as an in-scene addition through the scoped regen loop, gated by (a) the scaffold detector, (b) the
 * insertion-only preservation guard (no existing paragraph modified — the `repair.ts:153` re-gendering
 * safety net), and (c) one presence validator per defect. A plant ships only if it surfaces its target
 * and breaks none of the others; whatever regen cannot resolve is returned for the deterministic floor.
 * The injector this replaces does not fire when run BEFORE it (the element is now present).
 */
export async function runInsertionRegenPass(args: {
  chapter: ProseChapter;
  defects: ReadonlyArray<ProseDefect>;
  bible: RegenBible;
  regen: RegenFn;
  presenceValidatorFor: (defect: ProseDefect) => (c: ProseChapter) => ValidatorResult;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  if (args.defects.length === 0) {
    return regenPassDidNotRun(args.chapter);
  }
  const validate = composeChapterValidator(
    preserveOriginalParagraphsValidator(args.chapter.paragraphs ?? []),
    ...args.defects.map((d) => args.presenceValidatorFor(d)),
  );
  const result = await runRegenRepair(
    args.chapter,
    args.defects,
    (chapter, defect) => buildRegenRequest(chapter, defect, args.bible),
    args.regen,
    validate,
    { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
    // A_73 §32 — judge each repair on its own defect, not on the sum over all of them.
    (d) => args.presenceValidatorFor(d),
  );
  return finishRegenPass(result.chapter, args.defects, result.unresolved);
}

/** Back-compat alias of the result shape for the clue pass. */
export type ClueRegenPassResult = InsertionRegenPassResult;

/**
 * P3.3 — the clue-miss regen pass (the A1 replacement). Detects required clues absent from the chapter
 * via the SAME presence check the deterministic patch uses — and required EARLY clues that are present
 * but fail the early-placement check (the other trigger of the deterministic prepend) — then runs the
 * general insertion-regen pass.
 *
 * Ordering contract: run BEFORE `repairChapterDeterministically` so a successful plant makes the clue
 * present (and early, for `clue_too_late`) and the deterministic A1 patch does not inject (A1 demoted
 * to the logged emergency floor).
 */
export async function runClueRegenPass(args: {
  chapter: ProseChapter;
  ledgerEntry?: ChapterRequirementLedgerEntry;
  bible: StoryBible;
  regen: RegenFn;
  clueDistribution?: ClueDistributionResult;
  castNames?: string[];
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<ClueRegenPassResult> {
  const ledgerEntry = args.ledgerEntry;
  const requiredClueIds = ledgerEntry?.requiredClueIds ?? [];
  const missing = requiredClueIds.filter(
    (id) => !chapterMentionsRequiredClue(chapterText(args.chapter), id, args.clueDistribution, args.castNames),
  );
  // Present-but-late early clues must reach the LLM path too: otherwise the deterministic floor is the
  // first thing to touch them, and its early-clue block is what the scaffold regen later dramatizes
  // into a reveal-style chapter opening. Same composite predicate the floor's trigger uses.
  const tooLate = ledgerEntry
    ? requiredClueIds.filter((id) => {
        if (missing.includes(id)) return false;
        const state = resolveClueObligationState(args.chapter, ledgerEntry, id, args.clueDistribution, args.castNames);
        return state.placement === "early" && state.isPresent && !state.isEarlyEnough;
      })
    : [];
  if (missing.length === 0 && tooLate.length === 0) {
    return regenPassDidNotRun(args.chapter);
  }
  const chapterNumber = ledgerEntry?.chapterNumber ?? 0;
  const ctxById = new Map((ledgerEntry?.clueObligationContext ?? []).map((c) => [c.id, c]));
  const defects: ProseDefect[] = [
    ...missing.map((id) => {
      const ctx = ctxById.get(id);
      return {
        chapter: chapterNumber,
        kind: "missing_clue" as const,
        detail: ctx?.description || ctx?.deliveryMethod || `required clue ${id} is absent`,
        obligationRef: id,
        severity: "hard" as const,
      };
    }),
    ...tooLate.map((id) => {
      const ctx = ctxById.get(id);
      return {
        chapter: chapterNumber,
        kind: "clue_too_late" as const,
        detail: `${ctx?.description || `required clue ${id}`} — present, but only after the first quarter of the chapter`,
        obligationRef: id,
        severity: "hard" as const,
      };
    }),
  ];
  return runInsertionRegenPass({
    chapter: args.chapter,
    defects,
    bible: args.bible,
    regen: args.regen,
    presenceValidatorFor: (d) =>
      d.kind === "clue_too_late" && ledgerEntry
        ? clueEarlyPlacementValidator(d.obligationRef ?? "", ledgerEntry, args.clueDistribution, args.castNames)
        : cluePresenceValidator(d.obligationRef ?? "", args.clueDistribution, args.castNames),
    maxAttemptsPerDefect: args.maxAttemptsPerDefect,
    onUnresolved: args.onUnresolved,
  });
}

/**
 * P4 — the clearance regen pass (the A3/B7 replacement). Given the suspects that need a co-located
 * clearance in this chapter (detected upstream from prose_requirements / the suspect-closure verifier),
 * dramatizes each as a witnessed deduction rather than the deterministic verdict template.
 */
export async function runClearanceRegenPass(args: {
  chapter: ProseChapter;
  chapterNumber: number;
  suspectsNeedingClearance: ReadonlyArray<string>;
  bible: StoryBible;
  regen: RegenFn;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  const needing = args.suspectsNeedingClearance.filter(
    (s) => s && !clearancePresenceValidator(s)(args.chapter).ok,
  );
  if (needing.length === 0) {
    return regenPassDidNotRun(args.chapter);
  }
  const defects: ProseDefect[] = needing.map((suspect) => ({
    chapter: args.chapterNumber,
    kind: "missing_clearance" as const,
    detail: `clear ${suspect} as a witnessed deduction (where they were, who saw them)`,
    obligationRef: suspect,
    severity: "hard" as const,
  }));
  return runInsertionRegenPass({
    chapter: args.chapter,
    defects,
    bible: args.bible,
    regen: args.regen,
    presenceValidatorFor: (d) => clearancePresenceValidator(d.obligationRef ?? ""),
    maxAttemptsPerDefect: args.maxAttemptsPerDefect,
    onUnresolved: args.onUnresolved,
  });
}

/** Report-style clearance as a whole-chapter validator (verdict prose fails; dramatized deduction passes). */
const reportStyleClearanceChapterValidator = (c: ProseChapter): ValidatorResult =>
  noReportStyleClearanceValidator(chapterText(c));

/**
 * Locked-fact values that were present in the ORIGINAL chapter must survive a rewrite. Unlike the clue
 * pass (which INSERTS and forbids touching existing paragraphs), the scaffold pass REWRITES the offending
 * paragraph, so the preservation guard is fact-level, not paragraph-level: every canonical value that was
 * on the page stays on the page. (Clue-presence and pronoun fidelity are re-checked downstream.)
 */
const preserveLockedFactsValidator =
  (requiredValues: ReadonlyArray<string>) =>
  (c: ProseChapter): ValidatorResult => {
    const text = chapterText(c);
    const dropped = requiredValues.filter((v) => v && !text.includes(v));
    return {
      ok: dropped.length === 0,
      score: dropped.length === 0 ? 100 : 0,
      violations: dropped.map((v) => `dropped_locked_fact:${v}`),
    };
  };

/** No prompt/template/validation-text leakage anywhere in the chapter (A_62 RC-2.1). */
const noTemplateLeakageChapterValidator = (c: ProseChapter): ValidatorResult => {
  const hits = detectTemplateLeakage(chapterText(c));
  return {
    ok: hits.length === 0,
    score: hits.length === 0 ? 100 : 0,
    violations: hits.map((h) => `template_leakage:${h}`),
  };
};

/**
 * A_62 RC-2.1 guardrail — the leakage instruction says "REMOVE the leaked material", and removal
 * shortens the chapter. A rewrite that satisfies the leakage detector by deleting text would trade a
 * `prose ≤4` cap for a `completeness_structure` batch-gate failure (word floors) — swapping a scoring
 * problem for a RUN-KILLING one. So a leakage rewrite must not shrink the chapter meaningfully: it has
 * to re-dramatize the material in-scene, not cut it.
 *
 * The 15% tolerance is deliberate: excising a genuinely templated sentence legitimately loses a few
 * words, but a paragraph that collapses has been deleted rather than rewritten.
 */
const preserveChapterLengthValidator =
  (originalWordCount: number, tolerance = 0.15) =>
  (c: ProseChapter): ValidatorResult => {
    const words = chapterText(c).split(/\s+/).filter(Boolean).length;
    const floor = Math.floor(originalWordCount * (1 - tolerance));
    const ok = words >= floor;
    return {
      ok,
      score: ok ? 100 : 0,
      violations: ok ? [] : [`chapter_shrank:${words}<${floor} (leakage rewrite deleted text instead of re-dramatizing it)`],
    };
  };

/** Best-effort: which paragraph index contains a fragment (case-insensitive prefix). -1 if none. */
const paragraphIndexOfFragment = (paragraphs: ReadonlyArray<string>, fragment: string): number => {
  const needle = fragment.trim().slice(0, 60).toLowerCase();
  if (!needle) return -1;
  return paragraphs.findIndex((p) => String(p ?? "").toLowerCase().includes(needle));
};

/**
 * A_64 §2 F3 — the exhaustion floor for MACHINE-INSERTED scaffold. The 7.5 pool shipped the scaffold
 * cap on 8/16 runs, and in 7/8 the surviving hit sat in a chapter this pass had already regen'd: the
 * model tends to echo an injector-pasted template back verbatim (dv_clock_off, call 48), the loop
 * exhausts its attempts, and the template ships behind an invisible warning. These sentences are OUR
 * OWN pastes (A3 clearance patch — deterministic-repair.ts; B5 culprit-evidence — agent9-run.ts), so a
 * value-preserving deterministic de-templating always exists. Signature-narrow on purpose: only the two
 * OBSERVED ship-time families (A_64 §1.1); B7 stays watched-not-fixed (the silent-sibling doctrine).
 * Each transform keeps every fact value in the sentence (names, times, support clauses) and removes
 * only the detector-signature phrasing.
 */
/**
 * EXPORTED for X13's totality test, not for use.
 *
 * Every entry here REWRITES a sentence an injector wrote, which means every `replacement` is a shape
 * `INJECTED_SENTENCE_PATTERNS` must recognise — the laundered form is what SHIPS, and a registry that
 * knows only the injector's phrasing matched nothing on the run that motivated REVIEW_05 §10.1. The
 * test asserts that correspondence so a third floor cannot be added without it.
 */
export const SCAFFOLD_EXHAUSTION_FLOORS: ReadonlyArray<{
  rule: string;
  re: RegExp;
  /** A `String.replace` replacement — a template string, or a function when the floor needs a builder. */
  replacement: string | ((...args: string[]) => string);
}> = [
  // A3 — "accounted for X's movements elsewhere" → "placed X elsewhere". Matches the template's own
  // possessive shape (deterministic-repair.ts clearance patch); paraphrases stay unresolved rather
  // than risk a botched capture.
  {
    rule: "A3:accounted_for_movements",
    // Periods allowed in the captured span (probe-#1 external read: "Dr. Mallory Finch" evaded
    // the old class — honorific dots blinded the whole single-sourced chain).
    re: /\baccounted for ([^;!?]{0,40}?)['’]s\s+movements elsewhere\b/gi,
    replacement: "placed $1 elsewhere",
  },
  // B5 — de-template the verdict clause but KEEP an evidence linkage: the culprit-evidence gate
  // (suspect-closure-validator, severity critical) and the injector's own EVIDENCE_TERMS predicate
  // both require it — a bare "was responsible" could flip a passing gate into an abort. NOTE: within
  // a run the B5 injector fires AFTER the scaffold pass (A_64 §1.4), so this floor's live activation
  // site is the ship-check in agent9-run, not the in-pass tail.
  {
    rule: "B5:beyond_reasonable_doubt",
    /**
     * A_80 item 3 — THIS FLOOR USED TO REPLACE ONE TEMPLATE WITH ANOTHER.
     *
     * Its replacement was the string "was responsible; the evidence allowed no other reading" — which
     * `injection-templates.ts` already carries a detector for (line ~188), whose header quotes a
     * reader calling it "not story prose; generator residue", and whose X4 telemetry records a **100%
     * violation rate**: "as written it cannot produce a compliant sentence". External readers have now
     * quoted the result back FOUR times, the latest being the 2026-09-01 read that listed
     * "Captain Ivor Hale was responsible; the evidence allowed no other reading" among the lines that
     * are "not natural fiction".
     *
     * So the de-templating floor was the thing writing the template. It now calls
     * `buildCulpritEvidenceSentenceInScene`, the compliant builder that already existed in that same
     * registry and was already marked as this injector's `supersededBy`. The culprit's name is
     * captured from the sentence it is replacing, so the fact survives — this floor's contract is to
     * be value- and evidence-preserving, and dramatising the accusation preserves both.
     */
    re: /\b([A-Z][\w'’.-]*(?:\s+[A-Z][\w'’.-]*)*)\s+was responsible, and the evidence placed the matter beyond all reasonable doubt\.?/g,
    replacement: (_match: string, culprit: string) => buildCulpritEvidenceSentenceInScene(culprit.trim()),
  },
];

/**
 * Apply the exhaustion floors to a chapter. Pure + idempotent; returns the rules that fired. Exported
 * for the fixture tests — production entry is the tail of `runScaffoldRegenPass`.
 */
export function applyScaffoldExhaustionFloor(chapter: ProseChapter): { chapter: ProseChapter; floored: string[] } {
  const floored = new Set<string>();
  const paragraphs = (chapter.paragraphs ?? []).map((p) => {
    let out = p;
    for (const f of SCAFFOLD_EXHAUSTION_FLOORS) {
      if (f.re.test(out)) {
        f.re.lastIndex = 0; // reset the /g/ cursor between test and replace
        // The union is narrowed here because `String.replace` has no overload accepting
        // `string | fn` — the floor may supply either, and B5 supplies a builder.
        out =
          typeof f.replacement === "function"
            ? out.replace(f.re, f.replacement as (...a: string[]) => string)
            : out.replace(f.re, f.replacement);
        floored.add(f.rule);
      }
      f.re.lastIndex = 0;
    }
    return out;
  });
  if (floored.size === 0) return { chapter, floored: [] };
  return { chapter: { ...chapter, paragraphs }, floored: [...floored] };
}

/**
 * P4 (RC1.2/RC1.3) — the deductive-scaffold / report-style-clearance regen pass. The re-measure cap
 * family: the endgame ships its deduction and suspect clearances as templated verdicts ("X was cleared
 * because …", "the trail bent toward …") that the rubric hard-caps (prose ≤ 4 scaffold, prose ≤ 6 /
 * ending ≤ 7 report-style). Instead of another per-signature reword (a confirmed mole — A_59, 3×), this
 * DETECTS the offending shape with the SAME detectors the rubric caps use (single source in
 * `@cml/prose-guard`) and DRAMATIZES the flagged paragraph in-scene via the scoped regen loop, gated so
 * a rewrite ships only if it clears the scaffold + report-style shape AND drops no locked fact.
 *
 * Ordering contract: run AFTER generation + deterministic hygiene, BEFORE scoring — a cleared chapter no
 * longer trips the cap; whatever regen cannot resolve is logged and the (uncapped-if-clean) score is honest.
 */
export async function runScaffoldRegenPass(args: {
  chapter: ProseChapter;
  chapterNumber: number;
  bible: RegenBible;
  regen: RegenFn;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  const paragraphs = args.chapter.paragraphs ?? [];
  const text = paragraphs.join(" ");
  const scaffoldHits = detectScaffoldNotProse(text);
  const reportStyle = detectReportStyleClearance(text);
  if (scaffoldHits.length === 0 && !reportStyle) {
    return regenPassDidNotRun(args.chapter);
  }
  // Group the offending fragments by paragraph so each regen edit is paragraph-scoped (never a free
  // whole-chapter rewrite — the repair.ts:153 re-gendering lesson).
  const fragmentsByParagraph = new Map<number, string[]>();
  const addFragment = (idx: number, frag: string) => {
    const key = idx >= 0 ? idx : 0;
    const list = fragmentsByParagraph.get(key) ?? [];
    list.push(frag);
    fragmentsByParagraph.set(key, list);
  };
  for (const h of scaffoldHits) addFragment(paragraphIndexOfFragment(paragraphs, h.fragment), h.fragment);
  if (reportStyle) {
    const idx = paragraphs.findIndex((p) => detectReportStyleClearance(p));
    addFragment(idx, "a suspect clearance stated as a verdict — dramatize it as a witnessed deduction");
  }
  const defects: ProseDefect[] = [...fragmentsByParagraph.entries()].map(([idx, frags]) => ({
    chapter: args.chapterNumber,
    paragraphIndex: idx,
    kind: "scaffold_not_prose" as const,
    detail: frags.join(" | "),
    obligationRef: `scaffold_ch${args.chapterNumber}_p${idx}`,
    severity: "hard" as const,
  }));
  const requiredValues = lockedFactValues(args.bible)
    .map((f) => f.value)
    .filter((v) => v && text.includes(v));
  const validate = composeChapterValidator(
    reportStyleClearanceChapterValidator,
    preserveLockedFactsValidator(requiredValues),
  );
  const result = await runRegenRepair(
    args.chapter,
    defects,
    (chapter, defect) => buildRegenRequest(chapter, defect, args.bible),
    args.regen,
    validate,
    { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
  );
  // A_64 §2 F3 — exhaustion floor, gated on the DETECTOR (not on `unresolved`: the acceptance loop
  // takes partial-progress candidates, so hits can survive with an empty unresolved list). If the
  // final chapter still trips a machine-inserted signature, de-template it deterministically so the
  // rubric's ship-time recheck (facts.ts, same detector) cannot cap what we pasted ourselves.
  let finalChapter = result.chapter;
  let floored: string[] = [];
  if (detectScaffoldNotProse((finalChapter.paragraphs ?? []).join(" ")).length > 0) {
    const floorResult = applyScaffoldExhaustionFloor(finalChapter);
    finalChapter = floorResult.chapter;
    floored = floorResult.floored;
  }
  return finishRegenPass(finalChapter, defects, result.unresolved, { floored });
}

/**
 * A_62 RC-2.1 — `templateLeakageHits`, the most frequent cap of the M1 era (7/15 runs; prose ≤4 on
 * 10/15) and, until now, the one with no repair arm.
 *
 * THE FINDING THIS CLOSES: the lever was already built and simply never plugged in. Everything below
 * already shipped —
 *   - `detectTemplateLeakage`      (`@cml/prose-guard/fidelity.ts:155`) — returns the exact fragments
 *   - `noTemplateLeakageValidator` (`…/fidelity.ts:165`)
 *   - `ProseDefectKind` `"leakage"` (`regen-repair.ts:35`) — declared, and emitted by NOTHING
 *   - the regen instruction         (`instructionForDefect`, `case "leakage"`)
 *   - the regen/retry/accept loop   (shared with `scaffold_not_prose`)
 * The only missing piece was a producer mapping detector hits onto `ProseDefect{kind:"leakage"}`.
 *
 * THE GENERAL RULE (A_62 RC-2): *a cap has a lever iff its detector is reachable from the generation
 * loop.* `prompts-llm` never imports `@cml/rubric-score` (three files hand-mirror it in comments), so
 * scoring-only detectors are structurally leverless. `@cml/prose-guard` is the sanctioned shared home
 * — `scaffold.ts:144` says so outright — and `scaffold` already proves the pattern. This applies it.
 *
 * Soundness: the validator's first check IS `detectTemplateLeakage`, the same function the rubric cap
 * keys off, so a passing regen provably no longer trips the class. `preserveLockedFactsValidator`
 * guarantees no canonical value is dropped, and `preserveChapterLengthValidator` guarantees the model
 * RE-DRAMATIZED rather than deleted (see its note — deletion would trade a cap for a run-killer).
 * Paragraph-scoped, never a free whole-chapter rewrite (the repair.ts:153 re-gendering lesson).
 * No-op (`ran:false`) on a clean chapter — no cost burn, no LLM call.
 */
export async function runTemplateLeakageRegenPass(args: {
  chapter: ProseChapter;
  chapterNumber: number;
  bible: RegenBible;
  regen: RegenFn;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  const paragraphs = args.chapter.paragraphs ?? [];
  const text = paragraphs.join(" ");
  const hits = detectTemplateLeakage(text);
  if (hits.length === 0) {
    return regenPassDidNotRun(args.chapter);
  }

  // Group the leaked fragments by paragraph so each regen edit stays paragraph-scoped.
  const fragmentsByParagraph = new Map<number, string[]>();
  for (const hit of hits) {
    const idx = paragraphIndexOfFragment(paragraphs, hit);
    const key = idx >= 0 ? idx : 0;
    const list = fragmentsByParagraph.get(key) ?? [];
    list.push(hit);
    fragmentsByParagraph.set(key, list);
  }

  const defects: ProseDefect[] = [...fragmentsByParagraph.entries()].map(([idx, frags]) => ({
    chapter: args.chapterNumber,
    paragraphIndex: idx,
    kind: "leakage" as const,
    detail: frags.join(" | "),
    obligationRef: `leakage_ch${args.chapterNumber}_p${idx}`,
    severity: "hard" as const,
  }));

  const requiredValues = lockedFactValues(args.bible)
    .map((f) => f.value)
    .filter((v) => v && text.includes(v));
  const originalWords = text.split(/\s+/).filter(Boolean).length;

  const validate = composeChapterValidator(
    noTemplateLeakageChapterValidator,
    preserveLockedFactsValidator(requiredValues),
    preserveChapterLengthValidator(originalWords),
  );

  const result = await runRegenRepair(
    args.chapter,
    defects,
    (chapter, defect) => buildRegenRequest(chapter, defect, args.bible),
    args.regen,
    validate,
    { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
  );
  return finishRegenPass(result.chapter, defects, result.unresolved);
}

/**
 * A_62 RC-2.2 — `dualValueNoContrast` (Item 9, A_57 D2): the discriminating clue's staged and true
 * values stated as two flat side-by-side truths instead of one observed contradiction → `clues ≤6`.
 * 6/21 shipped runs and ACCELERATING (3 of 5 on M1 attempt 3) — the second of the two leverless caps.
 *
 * Unlike RC-2.1 (pure wiring), this required promoting the detector: it lived only in
 * `@cml/rubric-score`, which this package must not depend on, so the cap was structurally leverless
 * (the RC-2 rule). It now lives in `@cml/prose-guard/dual-value.ts`; rubric-score imports it from
 * there — cap and lever key off the SAME function, so a passing regen provably no longer trips it.
 *
 * THE FALSE-WIN GUARD (the part that makes this pass safe): the cheapest way to silence the detector
 * is to DELETE one of the two values — no co-occurrence, no defect… and no discriminating clue. The
 * validator therefore requires BOTH canonical values verbatim in the rewritten chapter; a rewrite
 * that drops either is rejected even though the detector would read clean. The fix is more binding,
 * not less content.
 *
 * Takes the pair from the world-state ledger (`worldState.contradiction` — the same single source of
 * truth `ctx.discriminatingContradiction` publishes to the rubric; A_57 D2, never re-derived).
 * Paragraph-scoped where the co-occurrence sits inside one paragraph; falls back to the paragraph
 * holding the first value when the window spans a boundary. No-op (`ran:false`) when the pair is
 * absent or the chapter is clean — no LLM call, no cost.
 */
export async function runDualValueContrastRegenPass(args: {
  chapter: ProseChapter;
  chapterNumber: number;
  bible: RegenBible;
  pair: DiscriminatingPair | null | undefined;
  regen: RegenFn;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  const paragraphs = args.chapter.paragraphs ?? [];
  const text = paragraphs.join(" ");
  if (!args.pair || !detectDualValueNoContrast(text, args.pair)) {
    return regenPassDidNotRun(args.chapter);
  }

  // Scope: prefer the single paragraph that trips the detector on its own; if the window spans a
  // paragraph boundary, anchor on the paragraph carrying the first canonical value.
  let targetIdx = paragraphs.findIndex((p) => detectDualValueNoContrast(String(p ?? ""), args.pair!));
  if (targetIdx < 0) targetIdx = Math.max(0, paragraphIndexOfFragment(paragraphs, args.pair.values[0]));

  const [staged, truth] = args.pair.values;
  const defect: ProseDefect = {
    chapter: args.chapterNumber,
    paragraphIndex: targetIdx,
    kind: "dual_value_no_contrast",
    detail: `staged value "${staged}" and true value "${truth}" sit side-by-side with no contrast connective`,
    obligationRef: `dual_value_ch${args.chapterNumber}_p${targetIdx}`,
    severity: "hard" as const,
  };

  const requiredValues = lockedFactValues(args.bible)
    .map((f) => f.value)
    .filter((v) => v && text.includes(v));

  const detectorClearValidator = (c: ProseChapter): ValidatorResult => {
    const fired = detectDualValueNoContrast(chapterText(c), args.pair!);
    return { ok: !fired, score: fired ? 0 : 100, violations: fired ? ["dual_value_no_contrast:still flat"] : [] };
  };
  const bothValuesPreservedValidator = (c: ProseChapter): ValidatorResult => {
    const lower = chapterText(c).toLowerCase();
    const missing = args.pair!.values.filter((v) => !lower.includes(String(v ?? "").trim().toLowerCase()));
    return {
      ok: missing.length === 0,
      score: missing.length === 0 ? 100 : 0,
      violations: missing.map((v) => `dual_value_dropped:${v} (deleting a value silences the detector but destroys the clue)`),
    };
  };

  const validate = composeChapterValidator(
    detectorClearValidator,
    bothValuesPreservedValidator,
    preserveLockedFactsValidator(requiredValues),
  );

  const result = await runRegenRepair(
    args.chapter,
    [defect],
    (chapter, d) => buildRegenRequest(chapter, d, args.bible),
    args.regen,
    validate,
    { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
  );
  return finishRegenPass(result.chapter, [defect], result.unresolved);
}

/**
 * A_64 §2 (the 7.2 rewire) — THE scoring-text assembly, single-sourced. The rubric scores
 * `chapters.join("\n\n")` where each chapter is `title\n\n` + `paragraphs.join("\n\n")` (previously a
 * private orchestrator helper), while the dual-value LEVER detected on ONE chapter's
 * `paragraphs.join(" ")` — so a canonical pair whose 240-char window spans a chapter boundary (or text
 * reflowed by post-pass hygiene) fired the cap at scoring while the lever stayed silent on every arm:
 * the 7.2 "enabled and silent / tide_on capped anyway" split-brain. The orchestrator now delegates to
 * this function, so lever-scope and cap-scope provably read the same text.
 */
export function assembleScoringChapterTexts(chapters: unknown): string[] {
  return (Array.isArray(chapters) ? chapters : [])
    .map((c: any) => {
      const body = Array.isArray(c?.paragraphs) ? c.paragraphs.join("\n\n") : String(c?.content ?? c?.text ?? "");
      const title = c?.title ? `${c.title}\n\n` : "";
      return `${title}${body}`.trim();
    })
    .filter(Boolean);
}

/** The dual-value detector at CAP scope: the exact text the rubric will score. */
export function detectDualValueAtShipScope(chapters: unknown, pair: DiscriminatingPair | null | undefined): boolean {
  if (!pair) return false;
  return detectDualValueNoContrast(assembleScoringChapterTexts(chapters).join("\n\n"), pair);
}

/**
 * A_64 §2 (the 7.2 rewire, part 2) — the ship-scope residual arm. Runs AFTER the per-chapter
 * dual-value pass (and its hygiene rerun): if the CAP-scope detector still fires, the flat pair spans
 * a chapter boundary or was reintroduced by later text passes — invisible to the per-chapter lever by
 * construction. Targets the chapters carrying a canonical value (last-first, max 2 attempts) with an
 * acceptance that IS the gate's own signal: the ship-scope detector, evaluated with the candidate
 * chapter spliced into the full story. Class-#5 doctrine: repairs consume the gate's signal.
 */
export async function runDualValueFullStoryResidualPass(args: {
  chapters: ProseChapter[];
  bible: RegenBible;
  pair: DiscriminatingPair | null | undefined;
  regen: RegenFn;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<{ chapters: ProseChapter[]; repaired: boolean; ran: boolean }> {
  if (!args.pair || !detectDualValueAtShipScope(args.chapters, args.pair)) {
    return { chapters: args.chapters, repaired: false, ran: false };
  }
  const chapters = [...args.chapters];
  const [aRaw, bRaw] = args.pair.values;
  const a = String(aRaw ?? "").trim().toLowerCase();
  const b = String(bRaw ?? "").trim().toLowerCase();
  const candidateIdxs: number[] = [];
  for (let i = chapters.length - 1; i >= 0; i--) {
    const t = chapterText(chapters[i]).toLowerCase();
    if (t.includes(a) || t.includes(b)) candidateIdxs.push(i);
  }
  const requiredValues = lockedFactValues(args.bible).map((f) => f.value).filter(Boolean);
  for (const idx of candidateIdxs.slice(0, 2)) {
    const target = chapters[idx];
    const presentValues = requiredValues.filter((v) => v && chapterText(target).includes(v));
    const defect: ProseDefect = {
      chapter: idx + 1,
      kind: "dual_value_no_contrast",
      detail: `staged value "${aRaw}" and true value "${bRaw}" sit flat at STORY scope (the window may span a chapter boundary); bind them with an explicit contrast in this chapter`,
      obligationRef: `dual_value_ship_ch${idx + 1}`,
      severity: "hard" as const,
    };
    const spliceIn = (c: ProseChapter) => chapters.map((ch, i2) => (i2 === idx ? c : ch));
    const validate = composeChapterValidator(
      (c: ProseChapter): ValidatorResult => {
        const fired = detectDualValueAtShipScope(spliceIn(c), args.pair);
        return { ok: !fired, score: fired ? 0 : 100, violations: fired ? ["dual_value_no_contrast:still flat at ship scope"] : [] };
      },
      (c: ProseChapter): ValidatorResult => {
        const full = assembleScoringChapterTexts(spliceIn(c)).join("\n\n").toLowerCase();
        const missing = args.pair!.values.filter((v) => !full.includes(String(v ?? "").trim().toLowerCase()));
        return {
          ok: missing.length === 0,
          score: missing.length === 0 ? 100 : 0,
          violations: missing.map((v) => `dual_value_dropped:${v} (deleting a value silences the detector but destroys the clue)`),
        };
      },
      preserveLockedFactsValidator(presentValues),
    );
    const result = await runRegenRepair(
      target,
      [defect],
      (chapter, d) => buildRegenRequest(chapter, d, args.bible),
      args.regen,
      validate,
      { maxAttemptsPerDefect: 1, onUnresolved: args.onUnresolved },
    );
    if (result.unresolved.length === 0) {
      chapters[idx] = result.chapter;
      return { chapters, repaired: true, ran: true };
    }
  }
  return { chapters, repaired: false, ran: true };
}

/**
 * S8 (A_61 mechanism-too-early) — the fifth member of the regen family, the WRITE/REPAIR arm the
 * mechanism-timing check never had. When a PRE-discriminating-test chapter fully explains HOW the
 * concealment trick worked (the same `chapterFullyExplainsMechanism` predicate the A_55 generation gate
 * and the rubric's "mechanism explained too early" cap key off), the only prior lever was a
 * generation-time hardError the completion-first fallback could bypass — after which the cap silently
 * clamps two categories. This REWRITES the offending paragraph to withhold the causal clause while
 * keeping the physical clue on the page (a rewrite, not an insertion), gated so a rewrite ships only if
 * it clears the same predicate AND drops no locked fact.
 *
 * Soundness: the validator's first check IS chapterFullyExplainsMechanism, so a passing regen provably no
 * longer trips the class; preserveLockedFactsValidator guarantees no locked fact is dropped. Runs BEFORE
 * scoring so a cleared chapter scores honestly; whatever regen cannot resolve is logged and the cap (if
 * still tripped) behaves exactly as today. No-op (ran:false) on a chapter that only NAMES mechanism nouns
 * without the causal marker — legitimate clue-planting is never stripped.
 */
export async function runMechanismRevealRegenPass(args: {
  chapter: ProseChapter;
  chapterNumber: number;
  mechanismTerms: ReadonlyArray<string>;
  bible: RegenBible;
  regen: RegenFn;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  const paragraphs = args.chapter.paragraphs ?? [];
  const text = paragraphs.join(" ");
  const terms = [...args.mechanismTerms];
  if (terms.length === 0 || !chapterFullyExplainsMechanism(text.toLowerCase(), terms)) {
    return regenPassDidNotRun(args.chapter);
  }
  const idx = mechanismExplanationParagraphIndex(paragraphs, terms);
  const defect: ProseDefect = {
    chapter: args.chapterNumber,
    paragraphIndex: idx >= 0 ? idx : 0,
    kind: "mechanism_revealed_early",
    detail: `mechanism method explained before the discriminating test (terms: ${terms.slice(0, 6).join(", ")})`,
    obligationRef: `mechanism_ch${args.chapterNumber}`,
    severity: "hard",
  };
  const requiredValues = lockedFactValues(args.bible)
    .map((f) => f.value)
    .filter((v) => v && text.includes(v));
  const validate = composeChapterValidator(
    (c) => {
      const ok = !chapterFullyExplainsMechanism(chapterText(c).toLowerCase(), terms);
      return { ok, score: ok ? 100 : 0, violations: ok ? [] : ["mechanism_explained_too_early"] };
    },
    preserveLockedFactsValidator(requiredValues),
  );
  const result = await runRegenRepair(
    args.chapter,
    [defect],
    (chapter, d) => buildRegenRequest(chapter, d, args.bible),
    args.regen,
    validate,
    { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
  );
  return finishRegenPass(result.chapter, [defect], result.unresolved);
}

// ── RC1.4 — the resolution + culprit-evidence injectors converted to regen ──────────────────────────
const surnameOf = (fullName: string): string => {
  const t = String(fullName ?? "").trim().split(/\s+/).filter(Boolean);
  return t[t.length - 1] ?? "";
};
const nameOrSurnameRe = (fullName: string): RegExp => {
  const name = String(fullName ?? "").trim();
  const surname = surnameOf(name);
  return new RegExp(`\\b(?:${escapeRe(name)}|${escapeRe(surname)})\\b`, "i");
};

/** Resolution presence: the final chapter both closes (RESOLUTION_RE) AND names the culprit surname. */
const resolutionPresent = (finalChapter: ProseChapter, culpritSurname: string): boolean => {
  const t = chapterText(finalChapter);
  return RESOLUTION_RE.test(t) && new RegExp(`\\b${escapeRe(culpritSurname)}\\b`, "i").test(t);
};
const resolutionPresenceValidator =
  (culpritSurname: string) =>
  (c: ProseChapter): ValidatorResult => {
    const present = resolutionPresent(c, culpritSurname);
    return { ok: present, score: present ? 100 : 0, violations: present ? [] : [`missing_resolution:${culpritSurname}`] };
  };

/**
 * P4 (RC1.3/RC1.4) — the resolution regen pass (the B6 injectResolutionIfAbsent replacement). When the
 * FINAL chapter does not close in-scene (confession/arrest naming the culprit), dramatize the reveal via
 * the scoped regen instead of pasting the deterministic "It was me… I confess" backstop. Runs BEFORE the
 * injector so a successful regen makes it a logged no-op floor.
 */
export async function runResolutionRegenPass(args: {
  chapter: ProseChapter;
  chapterNumber: number;
  culprit: string;
  bible: RegenBible;
  regen: RegenFn;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  const culpritSurname = surnameOf(args.culprit);
  if (!args.culprit || !culpritSurname || resolutionPresenceValidator(culpritSurname)(args.chapter).ok) {
    return regenPassDidNotRun(args.chapter);
  }
  const defects: ProseDefect[] = [{
    chapter: args.chapterNumber,
    kind: "missing_resolution",
    detail: `render the reveal in-scene — ${args.culprit} confesses or is arrested, named explicitly — not a report`,
    obligationRef: args.culprit,
    severity: "hard",
  }];
  return runInsertionRegenPass({
    chapter: args.chapter,
    defects,
    bible: args.bible,
    regen: args.regen,
    presenceValidatorFor: () => resolutionPresenceValidator(culpritSurname),
    maxAttemptsPerDefect: args.maxAttemptsPerDefect,
    onUnresolved: args.onUnresolved,
  });
}

/**
 * P4 (RC3.3) — the case-transition-bridge regen pass. When a chapter shifts a missing-person frame to
 * murder language with no bridge (detected upstream by @cml/story-validation, whose regexes live in the
 * worker layer — passed in as `bridgePresent` to keep this package acyclic), dramatize an explicit
 * body-discovery/confirmation bridge in the flagged paragraph via the scoped regen. Cross-chapter: the
 * caller supplies the detected paragraphIndex. A REWRITE pass (composeChapterValidator, not insertion),
 * so it may modify the death paragraph; ships only if a bridge is now present and no locked fact dropped.
 */
export async function runCaseTransitionRegenPass(args: {
  chapter: ProseChapter;
  chapterNumber: number;
  paragraphIndex: number;
  bible: RegenBible;
  regen: RegenFn;
  /** BRIDGE_TERMS.test — injected from @cml/story-validation so this module has no story-validation dep. */
  bridgePresent: (chapterText: string) => boolean;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  if (args.bridgePresent(chapterText(args.chapter))) {
    return regenPassDidNotRun(args.chapter);
  }
  const requiredValues = lockedFactValues(args.bible)
    .map((f) => f.value)
    .filter((v) => v && chapterText(args.chapter).includes(v));
  const validate = composeChapterValidator(
    (c: ProseChapter): ValidatorResult => {
      const ok = args.bridgePresent(chapterText(c));
      return { ok, score: ok ? 100 : 0, violations: ok ? [] : ["missing_case_transition_bridge"] };
    },
    (c: ProseChapter): ValidatorResult => {
      const dropped = requiredValues.filter((v) => !chapterText(c).includes(v));
      return { ok: dropped.length === 0, score: dropped.length === 0 ? 100 : 0, violations: dropped.map((v) => `dropped_locked_fact:${v}`) };
    },
  );
  const defect: ProseDefect = {
    chapter: args.chapterNumber,
    paragraphIndex: args.paragraphIndex,
    kind: "missing_case_transition_bridge",
    detail: "the case shifts from a missing person to murder with no bridging discovery event",
    obligationRef: `transition_ch${args.chapterNumber}`,
    severity: "hard",
  };
  const result = await runRegenRepair(
    args.chapter,
    [defect],
    (chapter, d) => buildRegenRequest(chapter, d, args.bible),
    args.regen,
    validate,
    { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
  );
  return finishRegenPass(result.chapter, [defect], result.unresolved);
}

/**
 * RC5.3 (enforce-with-repair) — the voice-idiolect leakage regen pass, the REPAIR half the dialogue-
 * distinctiveness gate never had. When another character's SIGNATURE TIC appears verbatim in a speaker's
 * attributed dialogue (the strong voice-swap signal the deterministic gate flags at error severity), the
 * offending paragraph is REWRITTEN so the speaker stays in their own idiom — via the scoped regen, never
 * a deterministic reword (the standing law: deterministic code verifies, it never writes prose).
 *
 * Gated on the SAME predicate the gate uses: `leakGone` is injected from the caller (the worker owns
 * @cml/story-validation's validateDialogueIdiolect) so this package stays acyclic — mirroring
 * runCaseTransitionRegenPass's `bridgePresent`. A rewrite ships only if the chapter no longer carries
 * leakage AND drops no locked fact. Repair-not-abort: whatever regen cannot clear is logged by the
 * caller and ships with the release-gate warning exactly as before this pass existed.
 */
export async function runVoiceLeakageRegenPass(args: {
  chapter: ProseChapter;
  chapterNumber: number;
  /** Verbatim leaked tics with their owner and the wrong-mouth speaker (from the idiolect gate). */
  leaks: ReadonlyArray<{ owner: string; speaker: string; tic: string }>;
  bible: RegenBible;
  regen: RegenFn;
  /**
   * validateDialogueIdiolect-derived probe: the tics CURRENTLY leaked in the given chapter text.
   * Per-tic (not a whole-chapter boolean) so fixing leak 1 of 2 validates on its own merits — a
   * chapter-level "no leakage anywhere" predicate would revert a good first fix while the second
   * leak still stands (runRegenRepair validates after EVERY defect with the same validator).
   */
  leakedTics: (chapterText: string) => string[];
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  const normText = (s: string): string => String(s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  const initiallyLeaked = new Set(args.leakedTics(chapterText(args.chapter)).map(normText));
  // Group by tic: the same phrase leaked into two mouths is ONE rewrite obligation naming both
  // speakers — two same-tic defects would each fail validation while the other's occurrence stands.
  const byTic = new Map<string, { owner: string; speakers: string[]; tic: string }>();
  for (const leak of args.leaks) {
    const key = normText(leak?.tic ?? "");
    if (!key || !String(leak.speaker ?? "").trim() || !initiallyLeaked.has(key)) continue;
    const entry = byTic.get(key) ?? { owner: leak.owner, speakers: [], tic: leak.tic };
    if (!entry.speakers.includes(leak.speaker)) entry.speakers.push(leak.speaker);
    byTic.set(key, entry);
  }
  if (byTic.size === 0) {
    return regenPassDidNotRun(args.chapter);
  }
  const requiredValues = lockedFactValues(args.bible)
    .map((f) => f.value)
    .filter((v) => v && chapterText(args.chapter).includes(v));

  let current = args.chapter;
  const repaired: string[] = [];
  const unresolved: string[] = [];
  let seq = 0;
  for (const entry of byTic.values()) {
    seq += 1;
    const ref = `voice_leak_ch${args.chapterNumber}_${seq}`;
    // Scope to the offending paragraph only when the tic appears in exactly ONE paragraph — with
    // several (e.g. the owner's legitimate use elsewhere) attribution is ambiguous here, so fall
    // back to the whole chapter and let the instruction target the wrong speaker's line.
    const paragraphs = current.paragraphs ?? [];
    const hits = paragraphs
      .map((p, i) => (normText(p).includes(normText(entry.tic)) ? i : -1))
      .filter((i) => i >= 0);
    const defect: ProseDefect = {
      chapter: args.chapterNumber,
      paragraphIndex: hits.length === 1 ? hits[0] : undefined,
      kind: "voice_tic_leakage",
      detail:
        `"${entry.tic}" is ${entry.owner}'s signature phrase but appears in ${entry.speakers.join(" and ")}'s ` +
        `dialogue — reword ${entry.speakers.join(" and ")}'s line(s) in their own voice, without ${entry.owner}'s phrase`,
      obligationRef: ref,
      severity: "hard",
    };
    const validate = composeChapterValidator(
      (c: ProseChapter): ValidatorResult => {
        const still = args.leakedTics(chapterText(c)).map(normText).includes(normText(entry.tic));
        return { ok: !still, score: still ? 0 : 100, violations: still ? [`voice_tic_leakage:${entry.tic}`] : [] };
      },
      preserveLockedFactsValidator(requiredValues),
    );
    const result = await runRegenRepair(
      current,
      [defect],
      (chapter, d) => buildRegenRequest(chapter, d, args.bible),
      args.regen,
      validate,
      { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
    );
    current = result.chapter;
    if (result.unresolved.length > 0) unresolved.push(ref);
    else repaired.push(ref);
  }
  return { chapter: current, repaired, unresolved, ran: true };
}

const CULPRIT_TERMS_RE = /\b(culprits?|killers?|murderers?|responsible|did\s+it)\b/i;
const CULPRIT_EVIDENCE_RE = /\b(evidence|because|therefore|which\s+proves|proof|alibi|timeline|constraint|observation)\b/i;

/**
 * A_64 §2 F1 — THE shared culprit-evidence link predicate. The RC1.4 regen pass and the worker's
 * `enforceCulpritEvidencePresence` injector previously judged linkage with DIFFERENT name matchers
 * (case-insensitive `\b(name|surname)\b` here vs case-sensitive substring in the worker) — the exact
 * split-brain that let the injector paste its B5 template AFTER the regen pass had judged the story
 * linked (v_tide_enforce, A_64 §1.4; the class-#5 doctrine violated). Both sides now consume THIS
 * function. Name matching: full name case-insensitive with boundaries (multi-word, collision-safe);
 * surname case-SENSITIVE with boundaries — a surname in prose is capitalized, `/\bhale\b/i` matched
 * the adjective in "hale and hearty" (false-linked), and boundaries reject "Whitehall"-style substrings.
 */
export const culpritEvidenceLinkInText = (culprit: string, text: string): boolean => {
  const name = String(culprit ?? "").trim();
  if (!name) return false;
  const surname = surnameOf(name);
  const fullNameRe = new RegExp(`\\b${escapeRe(name)}\\b`, "i");
  const surnameRe = surname ? new RegExp(`\\b${escapeRe(surname)}\\b`) : null; // case-sensitive on purpose
  const named = fullNameRe.test(text) || (surnameRe !== null && surnameRe.test(text));
  return named && CULPRIT_TERMS_RE.test(text) && CULPRIT_EVIDENCE_RE.test(text);
};

/** Culprit-evidence link present in a chapter: name + culprit-term + evidence-term co-located. */
const culpritEvidenceInChapter = (c: ProseChapter, culprit: string): boolean =>
  culpritEvidenceLinkInText(culprit, chapterText(c));
const culpritEvidencePresenceValidator =
  (culprit: string) =>
  (c: ProseChapter): ValidatorResult => {
    const present = culpritEvidenceInChapter(c, culprit);
    return { ok: present, score: present ? 100 : 0, violations: present ? [] : [`culprit_unlinked:${culprit}`] };
  };

export interface CulpritEvidenceRegenResult {
  chapters: ProseChapter[];
  repaired: string[];
  unresolved: string[];
  ran: boolean;
}

/**
 * P4 (RC1.4) — the culprit-evidence regen pass (the B5 enforceCulpritEvidencePresence replacement). For
 * each LIVE culprit (the caller applies the F1/A_54 victim-collision + Ch1-deceased guards and passes the
 * filtered list) not already linked to the means/method by evidence on the page, dramatize the link in the
 * last chapter that names them, via the scoped regen. Runs BEFORE the injector, which stays as the floor.
 */
export async function runCulpritEvidenceRegenPass(args: {
  chapters: ProseChapter[];
  liveCulprits: ReadonlyArray<string>;
  bible: RegenBible;
  regen: RegenFn;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<CulpritEvidenceRegenResult> {
  const chapters = [...args.chapters];
  const repaired: string[] = [];
  const unresolved: string[] = [];
  let ran = false;
  const requiredValues = lockedFactValues(args.bible).map((f) => f.value).filter(Boolean);

  for (const culprit of args.liveCulprits) {
    if (!culprit) continue;
    // Already linked in ANY chapter → nothing to do (mirrors the injector's whole-prose predicate).
    if (chapters.some((c) => culpritEvidenceInChapter(c, culprit))) continue;
    // Target the LAST chapter that names the culprit, else the last chapter (mirrors the injector).
    const re = nameOrSurnameRe(culprit);
    let targetIdx = -1;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (re.test(chapterText(chapters[i]))) { targetIdx = i; break; }
    }
    if (targetIdx < 0) targetIdx = chapters.length - 1;
    if (targetIdx < 0) continue;
    ran = true;
    const target = chapters[targetIdx];
    const presentValues = requiredValues.filter((v) => chapterText(target).includes(v));
    // RC1.4 review fix: insertion-only — the culprit link is ADDED, so no existing paragraph may be
    // modified or dropped (the whole-chapter rewrite could otherwise silently delete a planted fair-play
    // clue that isn't an atomic locked fact — no downstream gate would restore it).
    const validate = composeChapterValidator(
      preserveOriginalParagraphsValidator(target.paragraphs ?? []),
      culpritEvidencePresenceValidator(culprit),
      (c: ProseChapter): ValidatorResult => {
        const dropped = presentValues.filter((v) => !chapterText(c).includes(v));
        return { ok: dropped.length === 0, score: dropped.length === 0 ? 100 : 0, violations: dropped.map((v) => `dropped_locked_fact:${v}`) };
      },
    );
    const defect: ProseDefect = {
      chapter: targetIdx + 1,
      kind: "culprit_unlinked",
      detail: `connect ${culprit} to the means and method through evidence already on the page, dramatized — not asserted`,
      obligationRef: culprit,
      severity: "hard",
    };
    const result = await runRegenRepair(
      target,
      [defect],
      (chapter, d) => buildRegenRequest(chapter, d, args.bible),
      args.regen,
      validate,
      { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
    );
    if (result.unresolved.length === 0) {
      chapters[targetIdx] = result.chapter;
      repaired.push(culprit);
    } else {
      unresolved.push(culprit);
    }
  }
  return { chapters, repaired, unresolved, ran };
}

/**
 * A_67 FIX-1 (P4) — the suspect-elimination regen pass: the multi-chapter sibling of
 * runCulpritEvidenceRegenPass, and the wiring the standalone runClearanceRegenPass never had. For each
 * non-culprit suspect not already cleared (co-located name + clearance term + evidence connector) in ANY
 * chapter, dramatize the clearance as a witnessed deduction in the last chapter that names them, via the
 * scoped regen. Runs BEFORE enforceSuspectEliminationPresence so a successful regen makes the deterministic
 * register-sentence injector ("X was thoroughly cleared by the evidence…") a logged no-op floor — the
 * A_67 FIX-1(b) "the injection must never write into prose" goal. The suspect SET is supplied by the caller
 * (cast minus culprits minus detectives — the injector's own list, so floor and gate agree on scope).
 * Insertion-only: existing paragraphs and locked-fact values are preserved (the repair.ts:153 guard).
 */
export async function runSuspectEliminationRegenPass(args: {
  chapters: ProseChapter[];
  suspects: ReadonlyArray<string>;
  bible: RegenBible;
  regen: RegenFn;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
  /**
   * X29 — the last chapter a clearance may be placed in, 1-based. Chapters after it are AFTERMATH.
   *
   * FOUND ON THE FIRST APPLY-MODE RUN (REVIEW_08 §3). This pass targets "the last chapter that names
   * the suspect", falling back to the final chapter — which lands it squarely in the aftermath. The
   * aftermath contract's `mustNotContain` says "any suspect clearance", so on that run both this pass
   * and `aftermath_repeat` worked on chapter 9, pulling it in opposite directions, and it shipped two
   * paragraphs shorter with its confession reference gone.
   *
   * Two obligations that contradict each other on the same chapter is not a tuning problem, it is a
   * contract defect. Suspects are cleared during the investigation and the reveal; the aftermath owes
   * consequence. Omitted ⇒ unbounded, which is the old behaviour.
   */
  lastClearanceChapter?: number;
}): Promise<CulpritEvidenceRegenResult> {
  const chapters = [...args.chapters];
  const repaired: string[] = [];
  const unresolved: string[] = [];
  let ran = false;
  const requiredValues = lockedFactValues(args.bible).map((f) => f.value).filter(Boolean);

  // Group suspects still needing a clearance by the last chapter that names them — mirrors the injector's
  // whole-prose "already present?" check and its last-chapter targeting, so one regen call per chapter
  // clears everyone who lands there.
  const byTarget = new Map<number, string[]>();
  for (const suspect of args.suspects) {
    if (!suspect) continue;
    if (chapters.some((c) => clearancePresenceValidator(suspect)(c).ok)) continue;
    const re = nameOrSurnameRe(suspect);
    // X29 — never later than the last chapter a clearance is allowed in.
    const ceiling =
      typeof args.lastClearanceChapter === "number" && args.lastClearanceChapter >= 1
        ? Math.min(args.lastClearanceChapter - 1, chapters.length - 1)
        : chapters.length - 1;
    let targetIdx = -1;
    for (let i = ceiling; i >= 0; i--) {
      if (re.test(chapterText(chapters[i]))) { targetIdx = i; break; }
    }
    if (targetIdx < 0) targetIdx = ceiling;
    if (targetIdx < 0) continue;
    const arr = byTarget.get(targetIdx);
    if (arr) arr.push(suspect);
    else byTarget.set(targetIdx, [suspect]);
  }

  for (const [targetIdx, suspectsHere] of byTarget) {
    ran = true;
    const target = chapters[targetIdx];
    const presentValues = requiredValues.filter((v) => chapterText(target).includes(v));
    const defects: ProseDefect[] = suspectsHere.map((suspect) => ({
      chapter: targetIdx + 1,
      kind: "missing_clearance" as const,
      detail: `clear ${suspect} as a witnessed deduction (where they were, who saw them) — dramatized, not a verdict`,
      obligationRef: suspect,
      severity: "hard" as const,
    }));
    const validate = composeChapterValidator(
      preserveOriginalParagraphsValidator(target.paragraphs ?? []),
      ...defects.map((d) => clearancePresenceValidator(d.obligationRef ?? "")),
      (c: ProseChapter): ValidatorResult => {
        const dropped = presentValues.filter((v) => !chapterText(c).includes(v));
        return { ok: dropped.length === 0, score: dropped.length === 0 ? 100 : 0, violations: dropped.map((v) => `dropped_locked_fact:${v}`) };
      },
    );
    const result = await runRegenRepair(
      target,
      defects,
      (chapter, d) => buildRegenRequest(chapter, d, args.bible),
      args.regen,
      validate,
      { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
    );
    // Insertion-only guard makes writing back safe even on partial success — no original paragraph is
    // lost, and any suspect regen could not clear is returned for the deterministic injector floor.
    chapters[targetIdx] = result.chapter;
    const unresolvedHere = new Set(result.unresolved.map((d) => d.obligationRef ?? "").filter(Boolean));
    for (const s of suspectsHere) {
      if (unresolvedHere.has(s)) unresolved.push(s);
      else repaired.push(s);
    }
  }
  return { chapters, repaired, unresolved, ran };
}

/**
 * Agent 7.5 geometry (GEOMETRY-AGENT-DESIGN §8.5, §8.6) — the aftermath chapter repeats the reveal.
 *
 * THE PART WITH NO PRECEDENT IN THIS CODEBASE, and it deserves stating plainly:
 *
 *   > A positive constraint is satisfied by ADDING text. A negative constraint can only be satisfied
 *   > by removing or rewriting it.
 *
 * Every other pass in this file is, at heart, "make something appear". This one is "make something
 * stop appearing", and none of the existing machinery expresses it — the `Obligation` union upstream
 * is entirely positive, which is precisely why "Chapter 10 repeats Chapter 9" has had no owner.
 *
 * WHY IT IS NOT A WHOLE-CHAPTER REGENERATION. Regenerating a chapter to DELETE a repeated reveal
 * risks dropping locked facts, clue mentions or cast names along the way — the exact collateral the
 * acceptance validators exist to catch. The right primitive already exists and has never been probed:
 * `AGENT9_REGEN_EDIT_LIST`, which returns only the changed paragraphs and splices the untouched ones
 * verbatim, so anything the pass did not name CANNOT drift by construction. This pass is that flag's
 * first compelling use case, and FLAG-AUDIT's stronger argument for it — safety, not cost — is
 * exactly this argument. The channel is chosen by the injected `RegenFn`, so enabling the edit-list
 * flag changes how this pass edits without changing a line here.
 *
 * THE THREE GUARDS, and what each one stops:
 *   • the detector itself, re-run — the same body `checkManuscriptGeometry` uses, never a second copy
 *   • locked-fact preservation — a rewrite that quietly drops the canonical clock value is rejected
 *   • length preservation — DELETING the offending paragraph is the cheapest way to satisfy a negative
 *     constraint and the worst outcome available: it shortens the chapter, flattens the ending, and
 *     trips the word-floor batch gate. The repair must REPLACE the restatement with consequence.
 *
 * No-op (`ran: false`, no LLM call, no cost) when the chapter is clean.
 */
export async function runAftermathRepeatRegenPass(args: {
  chapter: ProseChapter;
  chapterNumber: number;
  /** Paragraph indices the acceptance test flagged. Empty ⇒ the pass does not run. */
  paragraphIndices: ReadonlyArray<number>;
  culprit: string | null;
  methodTerms: ReadonlyArray<string>;
  /** What the reveal chapter already delivered — used only in the defect detail, never as copy. */
  revealChapter: number;
  bible: RegenBible;
  regen: RegenFn;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  const paragraphs = args.chapter.paragraphs ?? [];
  const flagged = [...new Set(args.paragraphIndices)].filter((i) => i >= 0 && i < paragraphs.length);
  if (flagged.length === 0) {
    return regenPassDidNotRun(args.chapter);
  }

  const defects: ProseDefect[] = flagged.map((index) => ({
    chapter: args.chapterNumber,
    paragraphIndex: index,
    kind: "aftermath_repeat" as const,
    detail:
      `this paragraph re-delivers what chapter ${args.revealChapter} already disclosed (the culprit's guilt, the ` +
      `method, the motive, the concealment, or a suspect's clearance)`,
    obligationRef: `aftermath_repeat_ch${args.chapterNumber}_p${index}`,
    severity: "hard" as const,
  }));

  const text = chapterText(args.chapter);
  const requiredValues = lockedFactValues(args.bible)
    .map((f) => f.value)
    .filter((v) => v && text.includes(v));
  const originalWords = text.split(/\s+/).filter(Boolean).length;

  const noAftermathRepeatValidator = (c: ProseChapter): ValidatorResult => {
    const remaining = detectAftermathRepeatParagraphs(c.paragraphs ?? [], {
      culprit: args.culprit,
      methodTerms: args.methodTerms,
    });
    return {
      ok: remaining.length === 0,
      // The score is the progress signal `regenThenValidate` gates on: a rewrite that clears two of
      // three offending paragraphs must read as an improvement, not as a flat failure.
      score: remaining.length === 0 ? 100 : Math.max(0, 100 - remaining.length * 25),
      violations: remaining.map((i) => `aftermath_repeat:p${i}`),
    };
  };

  const validate = composeChapterValidator(
    noAftermathRepeatValidator,
    preserveLockedFactsValidator(requiredValues),
    preserveChapterLengthValidator(originalWords),
  );

  const result = await runRegenRepair(
    args.chapter,
    defects,
    (chapter, defect) => buildRegenRequest(chapter, defect, args.bible),
    args.regen,
    validate,
    { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
  );
  return finishRegenPass(result.chapter, defects, result.unresolved);
}

/**
 * N7 (REVIEW_08 §3) — THE REVEAL REPAIR, ON A CHANNEL THAT MAY MODIFY.
 *
 * THE DEFECT THIS EXISTS FOR, measured on the 08-07 apply-mode run:
 *
 * ```
 * geometry regen UNRESOLVED in ch8: regen introduced: modified_or_dropped_original_paragraph:1   ×3
 * ```
 *
 * The manuscript never named its culprit, `reveal_culprit_not_named@8` detected that correctly, and
 * the repair failed three times for the same reason each time — it ran on `runInsertionRegenPass`,
 * whose `preserveOriginalParagraphsValidator` rejects any candidate that changes an existing
 * paragraph.
 *
 * **A reveal cannot be inserted.** Planting a clue is something a chapter can be given one more
 * paragraph of; disclosing the culprit is what an existing paragraph must be made to SAY. Asked to
 * name the killer, the model rewrote the paragraph that came closest — the correct authorial move —
 * and the guard threw it away three times running. That is a repair path that cannot succeed, not a
 * model that failed.
 *
 * THE GUARD IS TRADED, NOT DROPPED. Insertion-only buys exactly one thing: nothing outside the repair
 * can drift. This pass keeps that guarantee by other means, all of them deterministic:
 *   • **the detector itself, re-run** — supplied by the caller, so this pass never re-implements
 *     "is it fixed?" (§8.5's rule: a regen validated against a paraphrase of the detector can pass its
 *     own check and fail the one that ships);
 *   • **locked-fact preservation** — every canonical value on the page today is on the page after;
 *   • **a length floor** — the cheapest way to satisfy a positive obligation is to write less around
 *     it, and a reveal that arrives with the chapter 15% shorter has cut the scene, not repaired it;
 *   • **`noRegressionValidator`** (optional, and the one that actually replaces insertion-only) — the
 *     caller's "no NEW violation in this chapter" probe, which is what stops a rewrite fixing the
 *     reveal and breaking something else in the same chapter.
 *
 * AND THE CHANNEL MATTERS AS MUCH AS THE GUARD. Run this over the edit-list `RegenFn`
 * (`makeRegenFn({ editList: true })`): the model returns only the paragraphs it changed and every
 * other one is spliced from the source object, so "nothing else drifted" stops being a hope checked
 * afterwards and becomes structural. §36 measured that difference on the aftermath pass — 0 of 3
 * repaired without the channel, 2 of 3 with it, at a quarter of the cost.
 *
 * No-op (`ran: false`, no LLM call, no cost) when there are no defects.
 */
export async function runRevealRepairRegenPass(args: {
  chapter: ProseChapter;
  defects: ReadonlyArray<ProseDefect>;
  bible: RegenBible;
  regen: RegenFn;
  /** The REAL detector, re-run on the candidate — never a second implementation of the check. */
  presenceValidatorFor: (defect: ProseDefect) => (c: ProseChapter) => ValidatorResult;
  /** Optional: reject a candidate that introduces any NEW violation in this chapter. */
  noRegressionValidator?: (c: ProseChapter) => ValidatorResult;
  /**
   * X35 — `CASE.death_method`, verbatim ("stabbed with a decorative letter opener").
   *
   * MEASURED ON THE N7 RUN: `reveal_method_absent`'s message says only that the chapter "does not state
   * how the murder was physically done" — it never says what the method IS, and the Bible slice this
   * pass dereferences carries locked facts, pronouns and culprits but not the method. So attempt 2
   * confessed to STRANGLING in a stabbing case. Had the disclosure check accepted it, a contradictory
   * reveal would have shipped; it was caught by an unrelated rejection, which is luck and not a guard.
   */
  deathMethod?: string | null;
  /** The culprit, so the instruction can ask for the disclosure the detector is able to READ (X34). */
  culprit?: string | null;
  maxAttemptsPerDefect?: number;
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}): Promise<InsertionRegenPassResult> {
  if (args.defects.length === 0) {
    return regenPassDidNotRun(args.chapter);
  }

  const text = chapterText(args.chapter);
  const requiredValues = lockedFactValues(args.bible)
    .map((f) => f.value)
    .filter((v) => v && text.includes(v));
  const originalWords = text.split(/\s+/).filter(Boolean).length;

  const validate = composeChapterValidator(
    ...args.defects.map((d) => args.presenceValidatorFor(d)),
    preserveLockedFactsValidator(requiredValues),
    preserveChapterLengthValidator(originalWords),
    ...(args.noRegressionValidator ? [args.noRegressionValidator] : []),
  );

  const result = await runRegenRepair(
    args.chapter,
    args.defects,
    (chapter, defect) => {
      const request = buildRegenRequest(chapter, defect, args.bible);
      // The shared instruction says WHAT to render and is silent on whether an existing paragraph may
      // change — so the model guesses, and on this obligation it guessed "rewrite" three times
      // running. Say it outright, and say what still may not move.
      //
      // X35 names the method, because the run that did not proved the model will invent one. The
      // placement clause is the class-#5 rule — the gate and the writer agree on scope: X34 reads a
      // confession only where the culprit is named BEFORE it, in the same paragraph, so that is what
      // this asks for. An instruction that produces prose its own detector cannot read is the defect
      // this pass exists because of.
      const method = String(args.deathMethod ?? "").trim();
      const culprit = String(args.culprit ?? "").trim();
      return {
        ...request,
        instruction:
          `${request.instruction} You MAY REWRITE the paragraph that comes closest to carrying this ` +
          `moment — this repair is NOT insertion-only, and folding the disclosure into the scene that ` +
          `already exists is better than appending a new one. Change nothing else: leave every other ` +
          `paragraph as it stands, keep the chapter at its present length (replace, never delete), and ` +
          `keep every locked-fact value exactly as written.` +
          (method
            ? ` THE MURDER WAS COMMITTED BY: ${method}. That is the story's own fact — state it, and ` +
              `never substitute another method.`
            : "") +
          (culprit
            ? ` Write the disclosure so ${culprit} is NAMED IN FULL in the paragraph BEFORE the moment ` +
              `of admission, and keep other characters' names out of that paragraph — a reader (and the ` +
              `check that reads this chapter) must be able to tell whose confession it is.` +
              // X41 — EARN IT. The 08-15 reveal satisfied the obligation and the reader still marked it
              // down: "Hugo confesses, but the final proof is too abrupt". The check can only ask
              // whether the chapter discloses; nothing asks whether the disclosure was built. So the
              // instruction does, naming the beats the reader asked for in the order they asked.
              ` Earn it before it lands: put the case to ${culprit} FIRST — the physical evidence that ` +
              `only fits them, then the opportunity, then the motive — and let the admission answer that, ` +
              `rather than arriving on its own. A confession that precedes its proof reads as abrupt.`
            : ""),
      };
    },
    args.regen,
    validate,
    { maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2, onUnresolved: args.onUnresolved },
  );
  return finishRegenPass(result.chapter, args.defects, result.unresolved);
}
