/**
 * M6 — give Agent 9 the rubric it is judged by (architecture/REVIEW_10.md §2, §10).
 *
 * REVIEW_09 §1 split the ten rubric categories in two: four that swing three and four marks with the
 * machinery, and six that have never moved — opening hook and atmosphere sit at exactly 8 in five
 * external reads out of five, with ZERO variance, and dialogue has never once exceeded 7. No detector
 * reaches those six. M6 is the cheaper of the two things that might.
 *
 * These tests pin the properties the change rests on, in both directions (§7 conventions). The
 * negative ones matter more than the positive ones: this block's whole risk is that it works for the
 * wrong reason, and rules 1–3 below are what keep the eventual measurement admissible.
 */

import { describe, expect, it } from "vitest";

import { buildJudgedOnBlock } from "../agent9-prose/prompt-blocks.js";
import { buildPromptContextBlocks, __isRubricInPromptEnabled } from "../agent9-prose/prompt-builder.js";
import { buildRubricSystemPrompt } from "@cml/rubric-score";
import { CATEGORIES } from "@cml/rubric-score";

describe("AGENT9_RUBRIC_IN_PROMPT — the flag", () => {
  it("is OFF unless explicitly enabled, and reads env at call time", () => {
    // module-const-flags-frozen-before-dotenv: a module const freezes before dotenv runs and the
    // lever is then unsettable from .env.local. That defect recurred in agent7-run.ts on 2026-08-05.
    expect(__isRubricInPromptEnabled({})).toBe(false);
    for (const v of ["1", "true", "TRUE", "yes", "on", "On"]) {
      expect(__isRubricInPromptEnabled({ AGENT9_RUBRIC_IN_PROMPT: v }), v).toBe(true);
    }
    for (const v of ["", "0", "false", "no", "off", "shadow"]) {
      expect(__isRubricInPromptEnabled({ AGENT9_RUBRIC_IN_PROMPT: v }), v).toBe(false);
    }
  });

  it("disabled ⇒ the empty string, so the prompt is byte-identical to what it always emitted", () => {
    expect(buildJudgedOnBlock(false)).toBe("");
  });
});

describe("the judged_on block — what it must say", () => {
  const block = buildJudgedOnBlock(true);

  it("names every one of the ten categories a reader marks", () => {
    // A partial list reads as a licence on the rest. `CATEGORIES` is the judge's own enum, so this
    // fails if the rubric ever grows a category the prompt does not mention.
    const lower = block.toLowerCase();
    const NAMED_AS: Record<string, string> = {
      premise: "premise",
      opening_hook: "opening hook",
      plot_structure: "plot structure",
      character_clarity: "character clarity",
      dialogue: "dialogue",
      atmosphere: "atmosphere",
      clues: "clues",
      pacing: "pacing",
      ending: "ending",
      prose: "prose",
    };
    for (const category of CATEGORIES) {
      expect(lower, category).toContain(NAMED_AS[category]);
    }
  });

  it("gives the DETAIL to the six that have never moved", () => {
    // The four the machinery already drives get one clause; the six get their own line. Measured by
    // the thing that distinguishes them in the text: a leading dash and a colon.
    for (const flat of ["OPENING HOOK:", "ATMOSPHERE:", "CHARACTER CLARITY:", "DIALOGUE:", "PACING:", "PROSE:"]) {
      expect(block, flat).toContain(`- ${flat}`);
    }
    // …and the four are named together, not itemised.
    expect(block).toMatch(/premise, plot structure, clues and evidence logic, and \n?the ending/);
  });

  it("says marks are earned by what is on the page, not by intent", () => {
    expect(block).toMatch(/visible on the page, never by intent/);
  });
});

describe("the judged_on block — what it must NOT say", () => {
  const block = buildJudgedOnBlock(true);
  const judge = buildRubricSystemPrompt();

  /**
   * RULE 1 — the writer's vocabulary, not the judge's.
   *
   * If the grader's own instructions reached the author, an internal-score gain would be the prompt
   * reading itself back and the internal number would stop being admissible evidence about M6 at all.
   * Each phrase below is verified to be IN the judge's prompt first, so this test fails loudly if the
   * judge is rewritten and the guard silently starts asserting nothing.
   */
  it("shares no critic-vocabulary phrase with the judge's own system prompt", () => {
    const CRITIC_ONLY = [
      "start EACH category at 5/10",
      "flag_citations",
      "Return JSON only",
      "overall_view",
      "chapter_issues",
      "fastest_fixes",
    ];
    for (const phrase of CRITIC_ONLY) {
      expect(judge, `judge should contain ${phrase}`).toContain(phrase);
      expect(block, `block must not contain ${phrase}`).not.toContain(phrase);
    }
    // The judge's scoring mechanics in any form.
    expect(block).not.toMatch(/5\/10|out of 10 in each category, starting at|sum to \/100/);
  });

  /**
   * RULE 2 — no flag list. Naming a detector teaches a model to avoid the detector, not the defect.
   */
  it("names none of the judge's structural flags", () => {
    for (const flag of [
      "mechanismIncoherent",
      "revealUsesUnplantedEvidence",
      "mechanismExplainedTooEarly",
      "pronounsUnstable",
    ]) {
      expect(judge, `judge should contain ${flag}`).toContain(flag);
      expect(block, `block must not contain ${flag}`).not.toContain(flag);
    }
  });

  /**
   * RULE 3 — no example sentences. `story-geometry/prompt.ts`: "the block states obligations in the
   * vocabulary of the finished text, and stops". X40 exists because pipeline text reaches the page.
   */
  it("supplies no prose the model could copy — no quoted specimen sentences", () => {
    expect(block).not.toMatch(/["“][A-Z][^"”]{15,}["”]/);
    expect(block).not.toMatch(/\bExample:/i);
    expect(block).not.toMatch(/\be\.g\./i);
  });
});

describe("the judged_on block — how it sits in the prompt", () => {
  const sections = (judgedOnBlock: string) =>
    ({
      pronounAccuracyBlock: "PRONOUNS",
      characterConsistencyRules: "CONSISTENCY",
      firstAppearanceContractsBlock: "FIRST",
      characterPressureContractBlock: "PRESSURE",
      settingRefinementBlock: "SETTING",
      backgroundContextBlock: "BACKGROUND",
      fairPlayContractBlock: "FAIRPLAY",
      characterPersonalityContext: "PERSONALITY",
      characterContractsBlock: "CONTRACTS",
      physicalPlausibilityRules: "PHYSICS",
      eraAuthenticityRules: "ERA",
      locationProfilesContext: "LOCATIONS",
      temporalContextBlock: "TEMPORAL",
      lockedFactsBlock: "LOCKED",
      clueDescriptionBlock: "CLUES",
      nsdBlock: "NSD",
      continuityBlock: "CONTINUITY",
      discriminatingTestBlock: "DISCRIMINATING",
      humourGuideBlock: "HUMOUR",
      craftGuideBlock: "CRAFT",
      judgedOnBlock,
      sceneGroundingChecklist: "GROUNDING",
      provisionalScoringFeedbackBlock: "FEEDBACK",
      worldDocumentBlock: "WORLD",
      texturePoolBlock: "TEXTURE",
    }) as any;

  it("flag OFF ⇒ absent, and every other block is untouched", () => {
    const off = buildPromptContextBlocks(sections(""));
    const on = buildPromptContextBlocks(sections("JUDGED"));
    expect(off.map((b) => b.key)).not.toContain("judged_on");
    expect(on.map((b) => b.key)).toContain("judged_on");
    // The ONLY difference is the new block: same keys otherwise, same content, same priorities.
    expect(on.length).toBe(off.length + 1);
    for (const block of off) {
      const paired = on.find((b) => b.key === block.key)!;
      expect(paired.content, block.key).toBe(block.content);
      expect(paired.priority, block.key).toBe(block.priority);
    }
  });

  it("is droppable under budget pressure — high, never critical", () => {
    // A dropped standard degrades craft; a dropped `critical` block breaks coherence. This must be
    // shed before `locked_facts` or `geometry_time` ever are.
    const block = buildPromptContextBlocks(sections("JUDGED")).find((b) => b.key === "judged_on")!;
    expect(block.priority).toBe("high");
  });
});
