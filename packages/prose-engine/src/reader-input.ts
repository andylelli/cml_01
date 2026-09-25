/**
 * ANALYSIS_109 M2 — what the reader is shown, and when, as the contract schedules it.
 *
 * The reader model (`walkReader` in `@cml/cml`) needs three things from the book: the chapter each
 * clue is first shown in (the contract's OWNERSHIP — a clue is `mustSurface` in the chapter that owns
 * it and only `mayMention` after), the chapter each stated clearance lands in (`eliminationsAllowed`),
 * and where the test and the reveal fall. All three are the contract's own; nothing here reads prose.
 */
import type { ReaderInput } from "@cml/cml";

import type { ContractCore } from "./types.js";

export const readerInputOf = (core: ContractCore): ReaderInput => {
  const ownership = new Map<string, number>();
  const clearances = new Map<string, number>();
  const scenes = [...core.scenes].sort((a, b) => a.chapter - b.chapter);
  for (const scene of scenes) {
    for (const surface of scene.mustSurface) if (!ownership.has(surface.id)) ownership.set(surface.id, scene.chapter);
    for (const elimination of scene.eliminationsAllowed) {
      if (!clearances.has(elimination.name)) clearances.set(elimination.name, scene.chapter);
    }
  }
  return {
    ownership,
    clearances,
    chapters: scenes.map((s) => s.chapter),
    testChapter: core.roles.discriminatingTest ?? core.roles.reveal,
    revealChapter: core.roles.reveal,
  };
};
