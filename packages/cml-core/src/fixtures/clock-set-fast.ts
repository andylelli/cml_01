/**
 * The §4.6 worked example, hand-authored as a typed CML — the executable spec of the whole
 * thesis. Closed circle: Dr. Vale, Hartwell, Mrs. Carrow. Victim: Lord Ashby. The study clock is
 * eight minutes fast, so the apparent 08:20 death is really 08:12; the administration window is
 * 08:00–08:12.
 *
 * Two states:
 *   - `clockSetFastBroken()`  — the case the CURRENT system would ship. Step 3 claims to eliminate
 *     Vale from the porter log (he "boarded the 08:12 train"), but boarding at a single instant
 *     does not cover the window. Uniqueness ⇒ SOLUTION_NOT_UNIQUE {Carrow, Vale}.
 *   - `clockSetFastRepaired()` — the station-master fact (Vale on the platform 08:00–08:12) is
 *     added, covering the window. Uniqueness ⇒ UNIQUE {Carrow}.
 *
 * Times are minutes since midnight: 07:40=460, 08:00=480, 08:12=492, 08:30=510.
 */

import type { Entity, TypedCml } from "../types.js";

const T = { h0740: 460, h0800: 480, h0812: 492, h0830: 510, eod: 1440 } as const;

const entities = (): Entity[] => [
  { kind: "person", id: "vale", name: "Dr. Vale", role: "suspect" },
  { kind: "person", id: "hartwell", name: "Hartwell", role: "suspect" },
  { kind: "person", id: "carrow", name: "Mrs. Carrow", role: "suspect" },
  { kind: "person", id: "ashby", name: "Lord Ashby", role: "victim" },
  { kind: "location", id: "study", name: "the study" },
  { kind: "location", id: "kitchen", name: "the kitchen" },
  { kind: "location", id: "station", name: "the village station" },
  { kind: "location", id: "away", name: "off the premises" },
];

export function clockSetFastBroken(): TypedCml {
  return {
    caseId: "clock-set-fast/broken",
    entities: entities(),
    crime: {
      location: "study",
      // true administration window after correcting the fast clock (08:00–08:12)
      window: { start: T.h0800, end: T.h0812 },
      // the kitchen is adjacent to the study — being there does NOT alibi
      reachableFrom: ["kitchen"],
    },
    clues: [
      {
        kind: "time_correction",
        id: "clue_clock",
        establishesWindow: { start: T.h0800, end: T.h0812 },
        availableByStep: 1,
        worded: "A second clock and the train schedule show the study clock is eight minutes fast.",
      },
      {
        kind: "presence",
        id: "clue_carrow_kitchen",
        person: "carrow",
        location: "kitchen",
        interval: { start: T.h0800, end: T.h0830 },
        availableByStep: 1,
        worded: "The cook places Mrs. Carrow in the kitchen from eight until half past.",
      },
      {
        kind: "presence",
        id: "clue_hartwell_away",
        person: "hartwell",
        location: "away",
        interval: { start: T.h0740, end: T.eod },
        availableByStep: 2,
        worded: "The access log shows Hartwell surrendered his key and left the manor at 07:40.",
      },
      {
        kind: "presence",
        id: "clue_vale_boarded",
        person: "vale",
        location: "station",
        // a SINGLE instant: boarding at 08:12 — not a covering interval
        interval: { start: T.h0812, end: T.h0812 },
        availableByStep: 3,
        worded: "The porter log shows Dr. Vale boarded the 08:12 train at the village station.",
      },
    ],
    inferencePath: [
      {
        id: "step1_clock",
        rule: "time_correction",
        from: ["clue_clock"],
        establishesWindow: { start: T.h0800, end: T.h0812 },
      },
      {
        id: "step2_hartwell",
        rule: "access_impossible",
        from: ["clue_hartwell_away"],
        eliminates: "hartwell",
      },
      {
        // UNSOUND: "boarded at 08:12" does not cover the 08:00–08:12 window
        id: "step3_vale",
        rule: "access_impossible",
        from: ["clue_vale_boarded"],
        eliminates: "vale",
      },
    ],
    solution: { culpritId: "carrow" },
  };
}

export function clockSetFastRepaired(): TypedCml {
  const cml = clockSetFastBroken();
  cml.caseId = "clock-set-fast/repaired";
  // The discriminating fact: the station-master confirms Vale was on the platform from 08:00,
  // covering the whole crime window — now boarding is backed by genuine whereabouts.
  cml.clues.push({
    kind: "presence",
    id: "clue_vale_platform",
    person: "vale",
    location: "station",
    interval: { start: 480, end: 492 },
    availableByStep: 3,
    worded: "The station-master confirms Dr. Vale stood on the platform from eight o'clock until the train left.",
  });
  // Step 3 now rests on the covering fact as well, making the elimination sound.
  const step3 = cml.inferencePath.find((e) => e.id === "step3_vale");
  if (step3) step3.from = ["clue_vale_boarded", "clue_vale_platform"];
  return cml;
}
