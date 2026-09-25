/**
 * ANALYSIS_109 M2 — what the reader is shown, and when, as the contract schedules it.
 *
 * The reader model (`walkReader` in `@cml/cml`) needs, from the book: the chapter each
 * clue is first shown in (the contract's OWNERSHIP — a clue is `mustSurface` in the chapter that owns
 * it and only `mayMention` after), the chapter each stated clearance lands in (`eliminationsAllowed`),
 * where the test and the reveal fall, and — with `PROSE_V2_FALSE_LEAD` — the false solution's points the
 * contract owns. All of it is the contract's own; nothing here reads prose.
 */
import type { ReaderInput } from "@cml/cml";

import type { ContractCore } from "./types.js";

export const readerInputOf = (core: ContractCore): ReaderInput => {
  const ownership = new Map<string, number>();
  const clearances = new Map<string, number>();
  const leads: Array<{ chapter: number; implicates: string }> = [];
  const scenes = [...core.scenes].sort((a, b) => a.chapter - b.chapter);
  for (const scene of scenes) {
    for (const surface of scene.mustSurface) if (!ownership.has(surface.id)) ownership.set(surface.id, scene.chapter);
    for (const lead of scene.falseLeads ?? []) leads.push({ chapter: scene.chapter, implicates: lead.accused });
    for (const elimination of scene.eliminationsAllowed) {
      if (!clearances.has(elimination.name)) clearances.set(elimination.name, scene.chapter);
    }
  }
  return {
    ownership,
    clearances,
    leads,
    chapters: scenes.map((s) => s.chapter),
    testChapter: core.roles.discriminatingTest ?? core.roles.reveal,
    revealChapter: core.roles.reveal,
  };
};
