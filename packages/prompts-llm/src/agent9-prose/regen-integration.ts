/**
 * Glue between the verifiers, the Story Bible, and the scoped regen loop (first-principles LLD §6.4 /
 * P3.3). Pure and testable: it turns a `ProseDefect` into a fully-constrained `RegenRequest` by
 * DEREFERENCING the Bible (pronouns from identity, locked-fact values, the culprit embargo from the
 * chapter beat) — nothing re-derived — and composes the chapter validator the loop gates against. The
 * orchestrator's remaining job is then just: detect defects → `runRegenRepair(..., makeRegenFn(...))`.
 */

import {
  noScaffoldValidator,
  detectScaffoldNotProse,
  detectReportStyleClearance,
  noReportStyleClearanceValidator,
} from "@cml/prose-guard";
import type { ValidatorResult } from "@cml/prose-guard";
import type { ClueDistributionResult } from "../agent5-clues.js";
import type { StoryBible, ChapterBeat } from "../story-bible.js";
import { chapterMentionsRequiredClue, RESOLUTION_RE } from "./clue-validation.js";
import type { ProseChapter, ChapterRequirementLedgerEntry } from "./types.js";
import { runRegenRepair } from "./regen-repair.js";
import type { ChapterValidator, ProseDefect, RegenFn, RegenRequest } from "./regen-repair.js";

const pronounFor = (gender: string): string => (gender === "male" ? "he/him" : gender === "female" ? "she/her" : "they/them");

/** Locked pronouns per named character, from the Bible identity substrate (D5). */
export function pronounsFromBible(bible: Pick<StoryBible, "characters">): Record<string, string> {
  const out: Record<string, string> = {};
  for (const c of bible.characters ?? []) {
    if (c.name) out[c.name] = pronounFor(c.gender);
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

/** Map a defect kind to a concrete in-scene instruction for the model. */
export function instructionForDefect(defect: ProseDefect): string {
  const ref = defect.obligationRef ? ` (${defect.obligationRef})` : "";
  switch (defect.kind) {
    case "missing_clue":
    case "clue_too_late":
      return `Plant the required clue${ref} in this chapter as a concrete in-scene observation a character sees, does, or says — not as a summary. Detail: ${defect.detail}`;
    case "missing_clearance":
      return `Dramatize the clearance of ${defect.obligationRef ?? "this suspect"} as a witnessed deduction (where they were, who saw them) — not a verdict. Detail: ${defect.detail}`;
    case "missing_resolution":
      return `Render the resolution in-scene (confession / arrest / consequence), naming the culprit — not as a report. Detail: ${defect.detail}`;
    case "culprit_unlinked":
      return `Connect the culprit to the means and method through evidence already on the page, dramatized — not asserted. Detail: ${defect.detail}`;
    case "scaffold_not_prose":
      return `Rewrite the flagged deductive-scaffold sentence(s) as grounded in-scene prose, preserving the underlying fact. Detail: ${defect.detail}`;
    case "pronoun_mismatch":
      return `Correct the pronoun(s) to match the locked gender for the named character; change nothing else. Detail: ${defect.detail}`;
    case "locked_fact_absent":
      return `Surface the locked fact${ref} verbatim, woven into the scene. Detail: ${defect.detail}`;
    case "early_spoiler":
    case "leakage":
      return `Remove the premature reveal / leaked material, keeping the scene intact. Detail: ${defect.detail}`;
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

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const CLEARANCE_TERMS = /\b(cleared|ruled\s+out|eliminated|not\s+the\s+(?:culprit|killer)|innocent|alibi\s+(?:holds|confirmed)|could\s+not\s+have)\b/i;
const CLEARANCE_EVIDENCE = /\b(evidence|because|therefore|proof|alibi|timeline|witness(?:es)?|saw|seen|account)\b/i;

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
    return { chapter: args.chapter, repaired: [], unresolved: [], ran: false };
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
  );
  const unresolved = result.unresolved.map((d) => d.obligationRef ?? "").filter(Boolean);
  const repaired = args.defects.map((d) => d.obligationRef ?? "").filter((r) => r && !unresolved.includes(r));
  return { chapter: result.chapter, repaired, unresolved, ran: true };
}

/** Back-compat alias of the result shape for the clue pass. */
export type ClueRegenPassResult = InsertionRegenPassResult;

/**
 * P3.3 — the clue-miss regen pass (the A1 replacement). Detects required clues absent from the chapter
 * via the SAME presence check the deterministic patch uses, then runs the general insertion-regen pass.
 *
 * Ordering contract: run BEFORE `repairChapterDeterministically` so a successful plant makes the clue
 * present and the deterministic A1 patch does not inject (A1 demoted to the logged emergency floor).
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
  const requiredClueIds = args.ledgerEntry?.requiredClueIds ?? [];
  const missing = requiredClueIds.filter(
    (id) => !chapterMentionsRequiredClue(chapterText(args.chapter), id, args.clueDistribution, args.castNames),
  );
  if (missing.length === 0) {
    return { chapter: args.chapter, repaired: [], unresolved: [], ran: false };
  }
  const chapterNumber = args.ledgerEntry?.chapterNumber ?? 0;
  const ctxById = new Map((args.ledgerEntry?.clueObligationContext ?? []).map((c) => [c.id, c]));
  const defects: ProseDefect[] = missing.map((id) => {
    const ctx = ctxById.get(id);
    return {
      chapter: chapterNumber,
      kind: "missing_clue" as const,
      detail: ctx?.description || ctx?.deliveryMethod || `required clue ${id} is absent`,
      obligationRef: id,
      severity: "hard" as const,
    };
  });
  return runInsertionRegenPass({
    chapter: args.chapter,
    defects,
    bible: args.bible,
    regen: args.regen,
    presenceValidatorFor: (d) => cluePresenceValidator(d.obligationRef ?? "", args.clueDistribution, args.castNames),
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
    return { chapter: args.chapter, repaired: [], unresolved: [], ran: false };
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

/** Best-effort: which paragraph index contains a fragment (case-insensitive prefix). -1 if none. */
const paragraphIndexOfFragment = (paragraphs: ReadonlyArray<string>, fragment: string): number => {
  const needle = fragment.trim().slice(0, 60).toLowerCase();
  if (!needle) return -1;
  return paragraphs.findIndex((p) => String(p ?? "").toLowerCase().includes(needle));
};

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
    return { chapter: args.chapter, repaired: [], unresolved: [], ran: false };
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
  const unresolved = result.unresolved.map((d) => d.obligationRef ?? "").filter(Boolean);
  const repaired = defects.map((d) => d.obligationRef ?? "").filter((r) => r && !unresolved.includes(r));
  return { chapter: result.chapter, repaired, unresolved, ran: true };
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
    return { chapter: args.chapter, repaired: [], unresolved: [], ran: false };
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

const CULPRIT_TERMS_RE = /\b(culprits?|killers?|murderers?|responsible|did\s+it)\b/i;
const CULPRIT_EVIDENCE_RE = /\b(evidence|because|therefore|which\s+proves|proof|alibi|timeline|constraint|observation)\b/i;

/** Culprit-evidence link present in a chapter: name + culprit-term + evidence-term co-located. */
const culpritEvidenceInChapter = (c: ProseChapter, culprit: string): boolean => {
  const t = chapterText(c);
  return nameOrSurnameRe(culprit).test(t) && CULPRIT_TERMS_RE.test(t) && CULPRIT_EVIDENCE_RE.test(t);
};
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
    const validate = composeChapterValidator(
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
