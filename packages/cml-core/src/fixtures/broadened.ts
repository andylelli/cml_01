/**
 * Broadened fixtures — proving the typed core + engines generalise beyond the §4.6 temporal case
 * to the other load-bearing Golden Age structures:
 *
 *   - LOCKED ROOM / access-by-key — elimination by a *capability* (who held a key), not timing.
 *   - UNIQUE MEANS — elimination by a *capability* (who had the knowledge/skill the crime required).
 *   - LARGER CIRCLE (6 suspects) — a mix of temporal alibis and capability eliminations at scale,
 *     stressing the uniqueness engine's exhaustiveness.
 *
 * Each "broken" state is non-unique (a spare suspect the clues cannot rule out); each "repaired"
 * state adds the missing discriminating clue (and the matching inference step) to reach UNIQUE.
 */

import type { Entity, TypedCml } from "../types.js";

// ── Locked study: only a keyholder could enter the bolted room ──────────────

function lockedStudyEntities(): Entity[] {
  return [
    { kind: "person", id: "reeve", name: "Reeve", role: "suspect" },
    { kind: "person", id: "halloway", name: "Halloway", role: "suspect" },
    { kind: "person", id: "pike", name: "Pike", role: "suspect" },
    { kind: "person", id: "dunmore", name: "Dunmore", role: "suspect" },
    { kind: "person", id: "ashby", name: "Lord Ashby", role: "victim" },
    { kind: "location", id: "study", name: "the bolted study" },
  ];
}

export function lockedStudyBroken(): TypedCml {
  return {
    caseId: "locked-study/broken",
    entities: lockedStudyEntities(),
    crime: {
      location: "study",
      window: { start: 600, end: 660 },
      reachableFrom: [],
      requiredCapabilities: ["key_to_study"],
    },
    clues: [
      { kind: "capability", id: "clue_halloway_nokey", person: "halloway", capability: "key_to_study", has: false, availableByStep: 1, worded: "Halloway's key was logged in the butler's pantry all evening." },
      { kind: "capability", id: "clue_pike_nokey", person: "pike", capability: "key_to_study", has: false, availableByStep: 2, worded: "Pike never held a study key; the housekeeper confirms it." },
      // Dunmore's key status is never established — the reader cannot rule him out.
    ],
    inferencePath: [
      { id: "step1_halloway", rule: "unique_capability", from: ["clue_halloway_nokey"], eliminates: "halloway" },
      { id: "step2_pike", rule: "unique_capability", from: ["clue_pike_nokey"], eliminates: "pike" },
    ],
    solution: { culpritId: "reeve" },
  };
}

export function lockedStudyRepaired(): TypedCml {
  const cml = lockedStudyBroken();
  cml.caseId = "locked-study/repaired";
  cml.clues.push({ kind: "capability", id: "clue_dunmore_nokey", person: "dunmore", capability: "key_to_study", has: false, availableByStep: 3, worded: "Dunmore's only key was to the cellar, not the study." });
  cml.inferencePath.push({ id: "step3_dunmore", rule: "unique_capability", from: ["clue_dunmore_nokey"], eliminates: "dunmore" });
  return cml;
}

// ── Unique means: the poison demanded pharmacological knowledge ─────────────

function poisonEntities(): Entity[] {
  return [
    { kind: "person", id: "voss", name: "Dr. Voss", role: "suspect" },
    { kind: "person", id: "calloway", name: "Sister Calloway", role: "suspect" },
    { kind: "person", id: "pym", name: "Mr. Pym", role: "suspect" },
    { kind: "person", id: "ade", name: "Mrs. Ade", role: "suspect" },
    { kind: "person", id: "harrow", name: "Mr. Harrow", role: "victim" },
  ];
}

export function uniqueMeansBroken(): TypedCml {
  return {
    caseId: "unique-means/broken",
    entities: poisonEntities(),
    crime: {
      location: "drawing_room",
      window: { start: 1230, end: 1290 },
      reachableFrom: [],
      requiredCapabilities: ["pharmacology"],
    },
    clues: [
      { kind: "capability", id: "clue_pym_nopharm", person: "pym", capability: "pharmacology", has: false, availableByStep: 1, worded: "Pym is a stockbroker who faints at the sight of a syringe." },
      { kind: "capability", id: "clue_ade_nopharm", person: "ade", capability: "pharmacology", has: false, availableByStep: 1, worded: "Mrs. Ade has no medical training whatever." },
      // Sister Calloway (a nurse) is never shown to lack the precise dosing knowledge — a spare.
    ],
    inferencePath: [
      { id: "step1_pym", rule: "unique_capability", from: ["clue_pym_nopharm"], eliminates: "pym" },
      { id: "step2_ade", rule: "unique_capability", from: ["clue_ade_nopharm"], eliminates: "ade" },
    ],
    solution: { culpritId: "voss" },
  };
}

export function uniqueMeansRepaired(): TypedCml {
  const cml = uniqueMeansBroken();
  cml.caseId = "unique-means/repaired";
  cml.clues.push({ kind: "capability", id: "clue_calloway_nopharm", person: "calloway", capability: "pharmacology", has: false, availableByStep: 3, worded: "Sister Calloway trained only in convalescent care; the lethal dose required pharmacological knowledge she demonstrably lacks." });
  cml.inferencePath.push({ id: "step3_calloway", rule: "unique_capability", from: ["clue_calloway_nopharm"], eliminates: "calloway" });
  return cml;
}

// ── Larger circle (6 suspects): temporal alibis + capability eliminations ───

export function largeCircleUnique(): TypedCml {
  return {
    caseId: "large-circle/unique",
    entities: [
      { kind: "person", id: "marsh", name: "Marsh", role: "suspect" },
      { kind: "person", id: "gale", name: "Gale", role: "suspect" },
      { kind: "person", id: "stroud", name: "Stroud", role: "suspect" },
      { kind: "person", id: "pellew", name: "Pellew", role: "suspect" },
      { kind: "person", id: "birch", name: "Birch", role: "suspect" },
      { kind: "person", id: "corliss", name: "Corliss", role: "suspect" },
      { kind: "person", id: "thorne", name: "Sir Thorne", role: "victim" },
      { kind: "location", id: "library", name: "the library" },
      { kind: "location", id: "away", name: "off the premises" },
    ],
    crime: {
      location: "library",
      window: { start: 600, end: 660 },
      reachableFrom: [],
      requiredCapabilities: ["combination_to_safe"],
    },
    clues: [
      // two eliminated by alibi (precluding presence covering the window)
      { kind: "presence", id: "clue_gale_away", person: "gale", location: "away", interval: { start: 540, end: 720 }, availableByStep: 1, worded: "Gale was at the village inn all evening; a dozen witnesses." },
      { kind: "presence", id: "clue_stroud_away", person: "stroud", location: "away", interval: { start: 580, end: 700 }, availableByStep: 1, worded: "Stroud was on the last train, conductor's testimony." },
      // three eliminated by lacking the safe combination
      { kind: "capability", id: "clue_pellew_nocombo", person: "pellew", capability: "combination_to_safe", has: false, availableByStep: 2, worded: "Pellew was never trusted with the safe." },
      { kind: "capability", id: "clue_birch_nocombo", person: "birch", capability: "combination_to_safe", has: false, availableByStep: 2, worded: "Birch only joined the household last month." },
      { kind: "capability", id: "clue_corliss_nocombo", person: "corliss", capability: "combination_to_safe", has: false, availableByStep: 2, worded: "Corliss admits he never knew the combination." },
    ],
    inferencePath: [
      { id: "e_gale", rule: "access_impossible", from: ["clue_gale_away"], eliminates: "gale" },
      { id: "e_stroud", rule: "access_impossible", from: ["clue_stroud_away"], eliminates: "stroud" },
      { id: "e_pellew", rule: "unique_capability", from: ["clue_pellew_nocombo"], eliminates: "pellew" },
      { id: "e_birch", rule: "unique_capability", from: ["clue_birch_nocombo"], eliminates: "birch" },
      { id: "e_corliss", rule: "unique_capability", from: ["clue_corliss_nocombo"], eliminates: "corliss" },
    ],
    solution: { culpritId: "marsh" },
  };
}
