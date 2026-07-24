/**
 * The rubric judge prompt (aligning-the-scoring-system.md §2 + scoring-approach.md). The rubric IS
 * the system prompt — a faithful condensation of scoring-approach.md, with the two design notes baked
 * in: **start each category at 5/10** and **every mark must cite a concrete reason**. The full rubric
 * (bands, all penalty examples, chapter-balance standards) lives in scoring-approach.md and should be
 * appended verbatim when wiring the live judge; this is the load-bearing core.
 */

import type { StoryFacts } from "./types.js";

export function buildRubricSystemPrompt(): string {
  return [
    "You are a strict, specific, consistent critic of Golden-Age mystery fiction. Score the finished",
    "story against this rubric. A strong score requires clear EXECUTION, not just a good idea: stable",
    "characters, coherent timeline, planted clues, fair-play logic, readable prose, a satisfying reveal.",
    "",
    "Method: start EACH category at 5/10. Add points only for clear strengths visible in the text;",
    "subtract for specific problems. Do not inflate because the premise is promising if the draft is",
    "confusing. Every mark MUST cite a concrete reason (e.g. \"the victim is named, which improves",
    "clarity\"; \"the clock mechanism is explained too early\"). Never give a bare \"good\"/\"bad\".",
    "",
    "Score these ten categories, each out of 10, then sum to /100:",
    "  premise, opening_hook, plot_structure, character_clarity, dialogue, atmosphere, clues,",
    "  pacing, ending, prose.",
    "",
    "Also report the structural conditions you observe (the `flags`), because they carry hard penalties:",
    "  dead victim appears alive without flashback; culprit confesses only to tampering not the death;",
    "  the reveal uses evidence not planted earlier (revealUsesUnplantedEvidence); the mechanism is fully",
    "  explained too early — before the discriminating-test scene (mechanismExplainedTooEarly); the ending",
    "  contradicts earlier chapters; pronouns repeatedly switch for one character (pronounsUnstable);",
    "  multiple characters change roles; victim identity unclear; no real resolution (no",
    "  confession/exposure/arrest/consequence); the cover-up mechanism is physically IMPOSSIBLE or",
    "  internally incoherent (mechanismIncoherent) — the described trick could not actually produce the",
    "  staged evidence in the real world. Judge the PHYSICS, not the plausibility of the plot: a clock,",
    "  watch, chime, or written log can genuinely be reset/advanced/slowed to fake a time, but a reading",
    "  fixed by an external driver CANNOT be time-shifted by tampering with the instrument — e.g. \"cold",
    "  warped the plate and delayed the sundial's shadow by minutes\" (a shadow follows the sun, it cannot",
    "  be delayed), \"the thermometer ran slow so the time looked earlier\", \"the tide was held back an",
    "  hour\". If the mechanism only works by hand-waving physics, set mechanismIncoherent.",
    "",
    "EVIDENCE IS MANDATORY. For EVERY flag you set to true, add an entry to `flag_citations` giving the",
    "chapter number and the VERBATIM sentence from the prose that proves it. A flag with no citation, or a",
    "citation whose sentence does not appear in the cited chapter, will be DROPPED automatically — do not",
    "raise a structural flag you cannot point to a specific sentence for. In particular, only set",
    "revealUsesUnplantedEvidence if you can name the reveal sentence AND confirm no earlier chapter shows",
    "that evidence; only set mechanismExplainedTooEarly if the full mechanism is spelled out in a chapter",
    "BEFORE the discriminating-test scene; only set pronounsUnstable if you can quote a VERBATIM sentence",
    "where the narration uses the wrong-gender pronoun for a named character — dialogue about an absent",
    "third party does not count. Deterministic checks will verify these against the structure.",
    "",
    "Prioritise: is the victim clearly named and consistently dead? is the investigator stable? is the",
    "culprit distinct from the victim? are pronouns stable? are clues planted before they are used? does",
    "the reveal explain the MURDER, not just the cover-up? does the prose read like fiction, not notes?",
    "",
    "Return JSON only, matching the provided schema (categories[10] with mark+reason, total, overall_view,",
    "what_works, main_problems, chapter_issues, fastest_fixes, flags, flag_citations).",
  ].join("\n");
}

/**
 * The user message: the verified facts (so the critic reasons about prose, not facts it can't extract)
 * followed by the full story prose.
 */
export function buildRubricUserMessage(
  prose: string,
  verified: StoryFacts & { victimName?: string; culprit?: string; testChapter?: number | null },
): string {
  const facts: string[] = [];
  if (verified.victimName) facts.push(`Victim (confirmed from the structured model): ${verified.victimName}.`);
  if (verified.culprit) facts.push(`Culprit (confirmed): ${verified.culprit}.`);
  if (verified.testChapter) {
    facts.push(
      `The discriminating-test scene is Chapter ${verified.testChapter}. The mechanism is only "explained too early" ` +
        `if it is fully spelled out BEFORE Chapter ${verified.testChapter}.`,
    );
  }
  if (verified.culpritIsVictim) facts.push("CONFIRMED DEFECT: the culprit and the victim are the same person.");
  if (verified.victimIsInvestigator) facts.push("CONFIRMED DEFECT: the victim and the investigator are the same person.");
  if (verified.victimUnnamed) facts.push("CONFIRMED: the victim is never named in the prose.");
  if (verified.pronounsUnstable) {
    facts.push("CONFIRMED DEFECT: narration pronouns switch gender for at least one character across multiple chapters.");
  }
  if ((verified.templateLeakageHits ?? []).length) {
    facts.push(`CONFIRMED LEAKAGE (generated/validation text in the prose): ${verified.templateLeakageHits!.join(" | ")}`);
  }
  const preamble = facts.length
    ? `Verified facts (do not contradict these; they are enforced as hard caps):\n- ${facts.join("\n- ")}\n\n`
    : "";
  return `${preamble}Score this finished mystery:\n\n${prose}`;
}
