/**
 * agent9-prose/discriminating.ts
 * Discriminating-test checklist builder and checklist requirement validator.
 */
import { isVictimArchetype } from "@cml/cml";
import type { CaseData } from "@cml/cml";
import type { NarrativeOutline } from "../agent7-narrative.js";
import type { ClueDistributionResult } from "../agent5-clues.js";
import type { ProseChapter, ChapterRequirementLedgerEntry } from "./types.js";
import { surfaceSpecKeyTerms } from "./clue-validation.js";

/**
 * Canonical framing for any place that injects `discriminating_test.design` into a
 * prose prompt. R-A (ROADMAP_TO_80 M0): the design is an analytical sentence Agent9 copied
 * verbatim however firmly we forbade it (run_1d55f7c7 + the recent replay shipped it word-for-word).
 * The cure is to NOT hand the sentence at all — surface only the KEY TERMS so the model must compose
 * its own prose; a key-term list cannot form a 12-word verbatim run from the source.
 */
export const describeDtMechanismForPrompt = (design: unknown): string => {
  const terms = surfaceSpecKeyTerms(String(design ?? "").trim());
  if (!terms) return "";
  return (
    "Render this test MECHANISM as live, in-scene action and dialogue, composing ENTIRELY in your own " +
    "words from these elements (reproducing any briefing phrase verbatim FAILS validation): " +
    terms
  );
};

export function validateChecklistRequirements(caseData: CaseData): string {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const discriminatingTest = cmlCase.discriminating_test;
  
  if (!discriminatingTest || !discriminatingTest.design) {
    return ''; // No test to validate
  }
  
  const evidenceClues = discriminatingTest.evidence_clues || [];

  // Build the authoritative set of known clue IDs from clue_to_scene_mapping.
  // CASE.clue_registry does not exist in the cml_2_0 schema — the real source is
  // prose_requirements.clue_to_scene_mapping[].clue_id.
  const knownClueIds = new Set<string>(
    ((cmlCase.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
      .map((entry: any) => String(entry?.clue_id || ''))
      .filter(Boolean)
  );

  // Check that all evidence clues exist in the known clue set.
  // Skip if there is no clue map — an empty mapping means we cannot validate.
  const missingClues: string[] = [];
  if (knownClueIds.size > 0) {
    evidenceClues.forEach((clue: any) => {
      const clueId = typeof clue === 'string' ? clue : clue.clue_id;
      if (clueId && !knownClueIds.has(clueId)) {
        missingClues.push(clueId);
      }
    });
  }
  
  if (missingClues.length > 0) {
    return `❌ CHECKLIST VALIDATION FAILED: Discriminating test references clues not in clue_to_scene_mapping: ${missingClues.join(', ')}. Cannot generate checklist with invalid clue references.`;
  }
  
  // Check that eliminated suspects exist in cast
  const eliminated = discriminatingTest.eliminated_suspects || [];
  const cast = cmlCase.cast || [];
  const missingCast: string[] = [];
  
  eliminated.forEach((suspect: any) => {
    const suspectName = typeof suspect === 'string' ? suspect : suspect.name;
    const exists = cast.some((member: any) => member.name === suspectName);
    if (!exists) {
      missingCast.push(suspectName);
    }
  });
  
  if (missingCast.length > 0) {
    return `❌ CHECKLIST VALIDATION FAILED: Discriminating test eliminates suspects not in cast: ${missingCast.join(', ')}. Cannot eliminate non-existent characters.`;
  }
  
  return ''; // Validation passed
}

/**
 * Build discriminating test checklist from CML.
 * Provides explicit checkbox requirements for late chapters (past 70% of story) where the test should appear.
 * Breaks down complex multi-step reasoning into concrete requirements.
 */
export function buildDiscriminatingTestChecklist(
  caseData: CaseData, 
  chapterRange: string, 
  outline: NarrativeOutline,
  totalScenes: number
): string {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const discriminatingTest = cmlCase.discriminating_test;
  
  if (!discriminatingTest || !discriminatingTest.design) {
    return '';
  }
  
  // Validate checklist requirements before building
  const validationError = validateChecklistRequirements(caseData);
  if (validationError) {
    return '\n\n' + validationError + '\n';
  }
  
  const proseReqs = cmlCase.prose_requirements ?? {};
  const dtScene = proseReqs.discriminating_test_scene;
  // discriminating_test.design is a string in the schema, not an object — access it directly.
  const testDescription = typeof discriminatingTest.design === 'string' ? discriminatingTest.design : '';
  // test_type lives in prose_requirements.discriminating_test_scene; use discriminating_test.method as fallback.
  const testType = dtScene?.test_type || discriminatingTest.method || 'unknown';

  // evidence_clues and eliminated_suspects are not in the cml_2_0 schema.
  // Derive them from clue_to_scene_mapping (filtered to the DT scene) and the cast minus culprits.
  const rawEvidenceClues: any[] = Array.isArray(discriminatingTest.evidence_clues) ? discriminatingTest.evidence_clues : [];
  const evidenceClues: any[] = rawEvidenceClues.length > 0
    ? rawEvidenceClues
    : ((proseReqs.clue_to_scene_mapping ?? []) as any[])
        .filter((e: any) => !dtScene || Number(e?.act_number) === Number(dtScene?.act_number))
        .map((e: any) => String(e?.clue_id || ''))
        .filter(Boolean);

  const culpritSet = new Set<string>((cmlCase.culpability?.culprits ?? []).map((n: any) => String(n)));
  const rawEliminated: any[] = Array.isArray(discriminatingTest.eliminated_suspects) ? discriminatingTest.eliminated_suspects : [];
  const eliminated: any[] = rawEliminated.length > 0
    ? rawEliminated
    : (cmlCase.cast ?? []).filter((c: any) => {
        if (culpritSet.has(c.name)) return false;
        if (String(c.culpability || '').toLowerCase() === 'guilty') return false;
        const role = String(c.role_archetype ?? c.role ?? '').toLowerCase();
        return !role.includes('detective') && !isVictimArchetype(role);
      }).map((c: any) => c.name).filter(Boolean);
  
  // Only show checklist for the discriminating test chapter batch.
  // P2-12: Use chapter-percentage comparison (n / totalScenes) rather than raw chapter count
  // so the checklist fires correctly when batchSize > 1 and the DT scene number is below
  // the raw integer threshold. The call site already validates the DT scene via act+scene
  // matching; this guard prevents the checklist from appearing in very early chapters only.
  const chapterNumbers = chapterRange.split('-').map(n => parseInt(n, 10));
  const isLateChapter = chapterNumbers.some(n => n / totalScenes >= 0.40);
  
  if (!isLateChapter) {
    return '';
  }
  
  // Extract clue locations from outline
  const clueLocations = extractClueLocations(caseData);
  
  let checklist = '\n\n═══════════════════════════════════════════════════════════\n';
  checklist += '🎯 DISCRIMINATING TEST CHECKLIST - CRITICAL REQUIREMENTS\n';
  checklist += '═══════════════════════════════════════════════════════════\n\n';
  checklist += `This is a **${testType}** test. The detective must:\n\n`;
  checklist += `**Test mechanism (paraphrase — do NOT copy verbatim):**\n${describeDtMechanismForPrompt(testDescription)}\n\n`;
  checklist += `**MANDATORY CHECKLIST - Every box must be checked:**\n\n`;
  
  // Evidence clue requirements with locations
  if (evidenceClues.length > 0) {
    checklist += `☐ **Evidence Integration**\n`;
    evidenceClues.forEach((clue: any) => {
      const clueId = typeof clue === 'string' ? clue : clue.clue_id;
      const clueType = typeof clue === 'object' ? clue.type || 'clue' : 'clue';
      const location = clueLocations.get(clueId);
      const locationStr = location ? ` (appears in ${location})` : '';
      checklist += `  ☐ Explicitly reference or use clue: "${clueId}" (${clueType})${locationStr}\n`;
    });
    checklist += `\n`;
  }
  
  // Test execution requirements based on type
  checklist += `☐ **Test Execution**\n`;
  if (testType === 'timing_test' || testType === 'timeline_test') {
    checklist += `  ☐ Detective reviews or reconstructs the timeline\n`;
    checklist += `  ☐ Show calculation or reasoning about time windows\n`;
    checklist += `  ☐ Demonstrate which suspects had/lacked opportunity\n`;
  } else if (testType === 'physical_test' || testType === 'capability_test') {
    checklist += `  ☐ Detective tests or demonstrates the physical requirement\n`;
    checklist += `  ☐ Show measurement, demonstration, or verification\n`;
    checklist += `  ☐ Clearly show which suspects can/cannot meet requirement\n`;
  } else if (testType === 'knowledge_test' || testType === 'specialized_knowledge') {
    checklist += `  ☐ Detective identifies what specialized knowledge is required\n`;
    checklist += `  ☐ Show investigation of who has this knowledge\n`;
    checklist += `  ☐ Demonstrate which suspects possess/lack the knowledge\n`;
  } else if (testType === 'access_test' || testType === 'opportunity_test') {
    checklist += `  ☐ Detective maps who had access at critical time\n`;
    checklist += `  ☐ Show verification of alibis or access records\n`;
    checklist += `  ☐ Clearly eliminate suspects who lacked access\n`;
  } else {
    checklist += `  ☐ Detective performs the test or verification as a concrete scene beat, not a summary paragraph\n`;
    checklist += `  ☐ The detective confronts the culprit or key suspect directly with the evidence or mechanism\n`;
    checklist += `  ☐ Show the trap springing in real time: inconsistent answer, visible nerves, or a damning response\n`;
    checklist += `  ☐ Show clear reasoning and evidence evaluation leading into the confrontation\n`;
    checklist += `  ☐ Demonstrate which suspects pass/fail the test with explicit on-page elimination logic\n`;
  }
  checklist += `\n`;

  // A_57 D7 — physical concreteness. The test must DEMONSTRATE, not assert. A human reader penalises a
  // test that "proves itself" with vague geometry; show the action, the observed value, and the explicit
  // exclusion of the false account. Generic across test types.
  checklist += `☐ **Physical Concreteness (the test must SHOW, not assert — do not let "the evidence prove itself")**\n`;
  checklist += `  ☐ A concrete physical ACTION with the apparatus or evidence — place it, measure it, re-enact it, or lay one record beside another, on the page\n`;
  checklist += `  ☐ The specific OBSERVED VALUE the test yields — the measurement, angle, time, count, or reading as a concrete quantity, not "the evidence" or "the truth"\n`;
  checklist += `  ☐ The EXCLUSION made explicit — show that this observed value can ONLY fit the true account and CANNOT fit the false one the suspects gave; name both and rule one out in the prose\n`;
  checklist += `\n`;

  // Suspect elimination requirements
  if (eliminated.length > 0) {
    checklist += `☐ **Suspect Elimination**\n`;
    eliminated.forEach((suspect: any) => {
      const suspectName = typeof suspect === 'string' ? suspect : suspect.name;
      checklist += `  ☐ Clearly eliminate "${suspectName}" from suspicion\n`;
    });
    checklist += `\n`;
  }
  
  // Detective reasoning requirements
  checklist += `☐ **Detective Reasoning**\n`;
  checklist += `  ☐ Detective explicitly states the test logic\n`;
  checklist += `  ☐ Show step-by-step deduction process\n`;
  checklist += `  ☐ Connect test results to innocence/guilt determination\n`;
  checklist += `\n`;
  
  // Prose quality requirements
  checklist += `☐ **Prose Integration**\n`;
  checklist += `  ☐ Scene is dramatic and engaging (not dry exposition)\n`;
  checklist += `  ☐ Use dialogue to reveal test logic naturally\n`;
  checklist += `  ☐ Build tension as test proceeds\n`;
  checklist += `  ☐ Clear moment of revelation when test succeeds\n`;
  checklist += `\n`;
  
  checklist += `⚠️ **VALIDATION:** If ANY checkbox above is unchecked in your prose, the chapter will FAIL validation.\n`;
  checklist += `This test is THE HARDEST element to get right. Take your time. Check every box.\n`;
  checklist += `CRITICAL: Render the discriminating test as a real-time dramatic scene with dialogue, confrontation, and a visible trap outcome. Do not hide it inside retrospective summary.\n`;
  checklist += `═══════════════════════════════════════════════════════════\n`;
  
  return checklist;
}

/**
 * Extract evidence clue locations from clue_to_scene_mapping.
 * Returns map of clue_id to Act/Scene location for checklist injection.
 * Each mapping entry already carries act_number and scene_number, so no
 * outline search is needed. CASE.clue_registry does not exist in the schema.
 */
export function extractClueLocations(caseData: CaseData): Map<string, string> {
  const clueLocations = new Map<string, string>();
  const cmlCase = (caseData as any)?.CASE ?? {};
  const mappings = (cmlCase.prose_requirements?.clue_to_scene_mapping ?? []) as any[];

  for (const entry of mappings) {
    const clueId = String(entry?.clue_id || '');
    if (clueId && !clueLocations.has(clueId)) {
      clueLocations.set(clueId, `Act ${entry.act_number}, Scene ${entry.scene_number}`);
    }
  }

  return clueLocations;
}

/** Strip violence/crime keywords from BANNED PARAGRAPH text to avoid Azure content-filter
 *  triggering on the guardrail itself.  Sentence structure and non-violent phrasing is
 *  preserved — those are what the model needs to know it must avoid. (P1-I) */
// P2-13: Structural masking instead of word-level redaction.
// Word-level redaction produces [crime-redacted]-filled sentences that the LLM cannot
// recognise as scaffolding to avoid. Structural masking exposes the sentence boundaries
// without revealing the content — LLM avoids the scaffold without seeing its vocabulary.