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
    "  the reveal uses evidence not planted earlier; the ending contradicts earlier chapters; pronouns",
    "  repeatedly switch for one character; multiple characters change roles; victim identity unclear;",
    "  no real resolution (no confession/exposure/arrest/consequence).",
    "",
    "Prioritise: is the victim clearly named and consistently dead? is the investigator stable? is the",
    "culprit distinct from the victim? are pronouns stable? are clues planted before they are used? does",
    "the reveal explain the MURDER, not just the cover-up? does the prose read like fiction, not notes?",
    "",
    "Return JSON only, matching the provided schema (categories[10] with mark+reason, total, overall_view,",
    "what_works, main_problems, chapter_issues, fastest_fixes, flags).",
  ].join("\n");
}

/**
 * The user message: the verified facts (so the critic reasons about prose, not facts it can't extract)
 * followed by the full story prose.
 */
export function buildRubricUserMessage(prose: string, verified: StoryFacts & { victimName?: string; culprit?: string }): string {
  const facts: string[] = [];
  if (verified.victimName) facts.push(`Victim (confirmed from the structured model): ${verified.victimName}.`);
  if (verified.culprit) facts.push(`Culprit (confirmed): ${verified.culprit}.`);
  if (verified.culpritIsVictim) facts.push("CONFIRMED DEFECT: the culprit and the victim are the same person.");
  if (verified.victimIsInvestigator) facts.push("CONFIRMED DEFECT: the victim and the investigator are the same person.");
  if (verified.victimUnnamed) facts.push("CONFIRMED: the victim is never named in the prose.");
  if ((verified.templateLeakageHits ?? []).length) {
    facts.push(`CONFIRMED LEAKAGE (generated/validation text in the prose): ${verified.templateLeakageHits!.join(" | ")}`);
  }
  const preamble = facts.length
    ? `Verified facts (do not contradict these; they are enforced as hard caps):\n- ${facts.join("\n- ")}\n\n`
    : "";
  return `${preamble}Score this finished mystery:\n\n${prose}`;
}
