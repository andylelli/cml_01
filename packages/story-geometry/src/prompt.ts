/**
 * The Agent 9 interface — the contract as prompt input (§8.2, §8.3).
 *
 * Geometry meets Agent 9 exactly twice: as an INPUT before a chapter is generated, and as an
 * ACCEPTANCE TEST after it. It never appears as a third thing — no text, no template, no example
 * sentence. These builders live in this package, next to the object they render, so the one rule
 * that keeps them honest is enforceable by a unit test rather than by discipline:
 *
 *   > The block states obligations in the vocabulary of the finished text, and stops.
 *
 * "Eleanor held the torn fabric beside Hugo's cuff…" is the external reviewer's suggestion, not our
 * prompt. The moment geometry supplies prose it becomes the injector layer under a new name, and
 * complaint #1 in every external review returns.
 *
 * THE PROMPTING SUBTLETY (§8.3). Negative instructions are weak — naming a thing you do not want
 * raises the chance the model produces it. So `mustNotContain` is NEVER rendered here. The prompt
 * gets the chapter's role, expressed positively; the acceptance test gets the prohibition.
 */

import { summariseTrace } from "./derive.js";
import type { StoryGeometry } from "./types.js";

export interface GeometryPromptBlock {
  /** Block key, matching the taxonomy Agent 9's prompt builder already uses. */
  key: "geometry_time" | "geometry_clincher" | "geometry_method" | "geometry_chapter";
  content: string;
}

const ROLE_STATEMENT: Record<string, string> = {
  opening: "This chapter opens the case. It puts the physical facts in front of the reader as things seen, not as conclusions.",
  investigation: "This chapter investigates. It gathers and complicates; it settles nothing.",
  false_solution: "This chapter proposes a solution that is wrong. It is argued well enough to convince, and it is not the truth.",
  discriminating_test: "This chapter is the test that separates the true explanation from the false one.",
  reveal: "This chapter discloses. The reader leaves it knowing who, how, and why — nothing is held back for later.",
  aftermath: "This chapter is aftermath: consequence and reaction to what has already been disclosed. It carries the human cost, not the case.",
};

/**
 * The run-stable blocks — identical in every chapter, so they land inside the cached prompt prefix
 * and are paid for once. Measured, not hoped: the 08-02 run served 139,392 cached prompt tokens,
 * with chapter 3 alone at 23,680 of 24,521 cached.
 */
export const buildGeometryRunBlocks = (geometry: StoryGeometry): GeometryPromptBlock[] => {
  const blocks: GeometryPromptBlock[] = [];

  const { trueTime, apparentTime } = geometry.timeModel;
  if (trueTime && apparentTime) {
    blocks.push({
      key: "geometry_time",
      content:
        `\n\n## TIME MODEL\n` +
        `This story has exactly two times, and every clock, watch, chime, note, testimony and remembered ` +
        `hour in it resolves to one of them:\n` +
        `  • ${apparentTime} — the time the staged evidence appears to show.\n` +
        `  • ${trueTime} — the time the death actually occurred.\n` +
        `Any other hour a character states must be one of these two, or must be explicitly related to one of ` +
        `them in the same passage.`,
    });
  }

  if (geometry.clincher && geometry.clincher.uniqueToCulprit) {
    const c = geometry.clincher;
    blocks.push({
      key: "geometry_clincher",
      content:
        `\n\n## THE DECISIVE TRACE\n` +
        `One physical fact ties ${c.uniqueToCulprit} to the act and could have been left by nobody else:\n` +
        // Short form on purpose (§8.8): the full text of this clue is already in `clue_descriptions`,
        // and a geometry block that re-prints it becomes a second clue channel. What this block adds
        // is WHERE it must appear, which nothing else states.
        `  ${summariseTrace(c.trace)}\n` +
        `(It is one of the clues already listed for you — this block adds only where it must appear, not what it is.)\n` +
        `It is on the page by chapter ${c.plantByChapter}, present and unremarked — a detail of the scene that ` +
        `nobody flags as significant. It is produced as proof in chapter ${c.payoffChapter}. Render it as an ` +
        `object in the world, in your own words.`,
    });
  }

  if (geometry.methodSignature) {
    const m = geometry.methodSignature;
    blocks.push({
      key: "geometry_method",
      content:
        `\n\n## THE MANNER OF DEATH, ON THE PAGE\n` +
        `The victim died by ${m.method}. Chapter ${m.plantChapter} shows the reader the physical signs of that — ` +
        `what is visible on the body and around it — as observation inside the scene. The reveal will name this ` +
        `method, and the early chapters are what make that naming earned.`,
    });
  }

  return blocks;
};

/**
 * The per-chapter block. Positive only: role plus what the chapter owes. The prohibitions in
 * `mustNotContain` are enforced by the acceptance test and are deliberately not shown to the model.
 */
export const buildGeometryChapterBlock = (
  geometry: StoryGeometry,
  chapterStart: number,
  chapterEnd: number = chapterStart,
): GeometryPromptBlock | null => {
  const contracts = geometry.chapterContract.filter((c) => c.chapter >= chapterStart && c.chapter <= chapterEnd);
  if (contracts.length === 0) return null;

  const lines = contracts.flatMap((contract) => {
    const role = ROLE_STATEMENT[contract.role] ?? "";
    return [
      `\nCHAPTER ${contract.chapter} — ${contract.role.replace(/_/g, " ")}`,
      ...(role ? [`  ${role}`] : []),
      ...(contract.mustContain.length > 0
        ? [`  This chapter delivers:`, ...contract.mustContain.map((item) => `    • ${item}`)]
        : []),
    ];
  });

  return {
    key: "geometry_chapter",
    content: `\n\n## CHAPTER CONTRACT${lines.join("\n")}`,
  };
};

/**
 * NOT BUILT, DELIBERATELY: the `geometry_feedback` block of §8.2.
 *
 * The design lists a fifth block — violation feedback on a retry, stability `attempt`. It has no
 * reachable producer: §8.9 requires the chapter-level acceptance test to run on the COMMITTED
 * chapter, after all deterministic post-processing, which is strictly after the retry loop that
 * would consume such a block. Shipping it anyway would be a prompt branch nothing can ever populate
 * — the "flag set in config, read by nothing" defect in a different costume.
 *
 * A geometry violation reaches the model through the regeneration path instead: the violation's
 * message becomes the regen defect's `detail`, and `instructionForDefect` turns that into the
 * instruction. Same content, one body, and it actually fires.
 */
