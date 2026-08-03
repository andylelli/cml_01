/**
 * [PHASE 5] Narrative arc archetypes — the structural contract one chapter owes the story.
 *
 * WHY THIS IS A LEAF MODULE (S6 prerequisite, architecture/REVIEW_01.md).
 * `MacroArcEntry` was declared in `agent9-prose/types.ts` and imported by `story-bible.ts`, which
 * sits OUTSIDE agent9-prose/ — while agent9-prose/ imports `../story-bible.js` in return. That
 * mutual reference is one of the two back-edges that made "extract agent9-prose into its own
 * package" (S6) produce a cycle rather than a layer.
 *
 * Only the TYPES move here: `buildMacroArcPlan` and the archetype contracts stay in agent9-prose/,
 * because planning an arc is generation work and belongs to the engine. What the rest of the package
 * needed was never the planner — only the shape of its output.
 */

export const BASE_ARCHETYPES = [
  'DISCOVERY',        // body found — no interrogation
  'FIRST_CONTACT',    // initial interviews — no evidence found yet
  'EVIDENCE',         // physical discovery — no formal accusation
  'ALIBI_PROBE',      // test one alibi — result must be stated
  'RED_HERRING',      // follow wrong lead — disproved within chapter
  'REVERSAL',         // prior assumption overturned — new theory formed
  'ISOLATION',        // eliminate one suspect definitively
  'DISCRIMINATING',   // apply discriminating test logic
  'CONFRONTATION',    // direct accusation scene — culprit present
  'RESOLUTION',       // confession, arrest, aftermath
] as const;

export type Archetype = typeof BASE_ARCHETYPES[number];

export interface MacroArcEntry {
  chapter: number;
  archetype: Archetype;
  mustContain: string;
  mustNotContain: string;
}
