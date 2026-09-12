import { describe, expect, it } from "vitest";

import { buildChapterRequirementLedger, partitionCluesByPage } from "../agent9-prose/clue-validation.js";
import { buildDeceptionArithmeticLines, renderLocationForProse } from "../agent9-prose/obligation-block.js";

/**
 * A_90 §12 — the fixes built from run 81042's read (87/100), each reproduced from the run's own
 * artifacts: the outline label copied into prose, the reveal that blurred which reading was ahead,
 * and the clue obligations that re-mandated evidence already on earlier pages (11 of 14 in chapters
 * 3–6, none marked inherited, because ownership followed the CML map and not the page).
 */
const withEnv = <T>(vars: Record<string, string | undefined>, fn: () => T): T => {
  const saved: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(vars)) {
    saved[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    return fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
};

describe("renderLocationForProse (AGENT9_LOCATION_LABEL_PROSE)", () => {
  it("turns the run's compound label into a phrase a character would say", () => {
    expect(renderLocationForProse("Drawing room and manor clock room")).toBe("the drawing room and the manor clock room");
    expect(renderLocationForProse("Manor clock room")).toBe("the manor clock room");
    expect(renderLocationForProse("The library")).toBe("the library");
  });
  it("keeps a proper name as it is", () => {
    expect(renderLocationForProse("Lockwood Estate")).toBe("Lockwood Estate");
    expect(renderLocationForProse("Bell Tower and Manor Hall")).toBe("Bell Tower and Manor Hall");
  });
});

describe("buildDeceptionArithmeticLines (AGENT9_REVEAL_ARITHMETIC) — run 81042's device and case", () => {
  const device = [
    { id: "clock_chime_actual_time", value: "twenty-five minutes past three", description: "The actual time at which the clock's hour strike sounded, read from the clock's internal striking train (not visible externally)." },
    { id: "clock_chime_displayed_time", value: "a quarter to four", description: "The time displayed by the clock's hands at the moment the chime sounded, read from the clock face visible to all observers." },
    { id: "victim_watch_stopped_time", value: "ten minutes past three", description: "Time indicated by the victim's stopped pocket watch found at the scene, fixed at moment of death, read from an independent timepiece." },
    { id: "clock_chime_advance_interval", value: "twenty minutes", description: "The amount by which the clock's chime was advanced ahead of real time, calculated arithmetically.", derivedFrom: ["clock_chime_displayed_time", "clock_chime_actual_time"] },
  ];
  const cmlCase = { hidden_model: { mechanism: { apparent_time_of_death: "a quarter to four", actual_time_of_death: "ten minutes past three" } } };

  it("renders the three steps, names the independent timepiece, and says which reading was ahead", () => {
    const lines = buildDeceptionArithmeticLines(cmlCase, device);
    const text = lines.join("\n");
    expect(lines[0]).toContain("THREE SEPARATE SENTENCES");
    expect(text).toContain('1. the REAL time of death: "ten minutes past three" — fixed by Time indicated by the victim\'s stopped pocket watch');
    expect(text).toContain('2. the STAGED reading: "a quarter to four"');
    expect(text).toContain("ran 20 minutes AHEAD of the true time");
    expect(text).toContain('when it showed "a quarter to four", the true time was "twenty-five minutes past three"');
    expect(text).toContain('never describe the shift with a bare "advanced"');
  });

  it("prints two steps without a declared pair, and nothing without both death times", () => {
    const noPair = buildDeceptionArithmeticLines(cmlCase, device.slice(0, 3));
    expect(noPair.join("\n")).toContain("2. the STAGED reading");
    expect(noPair.join("\n")).not.toContain("3. the SHIFT");
    expect(buildDeceptionArithmeticLines({ hidden_model: { mechanism: { apparent_time_of_death: "a quarter to four" } } }, device)).toEqual([]);
  });
});

describe("clue ownership by the page (AGENT9_CLUE_OWNERSHIP_BY_PAGE)", () => {
  // Chapter 4's two obligations from the run, with the chapter-3 prose that had already staged them.
  const clueDistribution = {
    clues: [
      { id: "clue_5", description: "Witnesses report hearing the manor clock chime before the expected meal time; the note is irregular.", observable: "witnesses report hearing the manor clock chime before the expected meal time", criticality: "essential", placement: "early" },
      { id: "clue_6", description: "The manor clock chime sounded twenty minutes before the actual time.", observable: "the manor clock chime sounded twenty minutes before the actual time", criticality: "essential" },
      { id: "clue_9", description: "A glove fragment with clock oil is found near the detent lever.", observable: "a glove fragment with clock oil near the detent lever", criticality: "essential" },
    ],
  } as any;
  const castNames = ["Ambrose Halloway", "Josephine Rutherford"];
  const priorChapters = [
    { chapterNumber: 1, paragraphs: ["Rain on the canal. The body lay by the clock."] },
    { chapterNumber: 2, paragraphs: ["Nothing of the chime was said that evening."] },
    { chapterNumber: 3, paragraphs: [
      "“I heard the chime before the meal,” Josephine Rutherford said. The witnesses agreed the manor clock chime had come before the expected meal time, an irregular note in the day.",
      "Ambrose Halloway listened: the manor clock chime had sounded twenty minutes before the actual time, by the stopped watch.",
    ] },
  ] as any[];

  it("partitions the run's chapter-4 clues: two already on chapter 3's page, one still pending", () => {
    const { pending, onPage } = partitionCluesByPage(["clue_5", "clue_6", "clue_9"], priorChapters, clueDistribution, castNames);
    expect(pending).toEqual(["clue_9"]);
    expect(onPage.get("clue_5")).toBe(3);
    expect(onPage.get("clue_6")).toBe(3);
  });

  /**
   * A_90 §13 — the guard the matched pair proved necessary. Arm B retired chapter 8's
   * `clue_culprit_direct_ottoline_dunmore` and came back with "reveal uses evidence not planted
   * earlier" and a geometry warning that the reveal never named the culprit.
   */
  it("never retires the reveal's own evidence, an essential clue, or anything in a protected chapter", () => {
    const withCulprit = {
      clues: [
        ...clueDistribution.clues,
        { id: "clue_culprit_direct_ottoline", description: "Ottoline Dunmore's own logbook entries and tools", observable: "Ottoline Dunmore's own logbook entries and tools", criticality: "supporting" },
      ],
    } as any;
    const staged = [
      ...priorChapters,
      { chapterNumber: 4, paragraphs: ["Ottoline Dunmore's own logbook entries and tools lay open on the bench."] },
    ];
    // a culprit-direct id is never retired, however plainly it is on the page
    expect(partitionCluesByPage(["clue_culprit_direct_ottoline"], staged, withCulprit, castNames).pending)
      .toEqual(["clue_culprit_direct_ottoline"]);
    // "never retire an essential clue" was REJECTED as a guard: 93% of the archive's clues are
    // essential, so it would make the lever inert. An ordinary essential clue on the page is retired.
    expect(partitionCluesByPage(["clue_5"], priorChapters, clueDistribution, castNames).pending).toEqual([]);
    // a protected chapter (reveal / discriminating test) retires nothing
    expect(partitionCluesByPage(["clue_5", "clue_6"], priorChapters, clueDistribution, castNames, true).pending)
      .toEqual(["clue_5", "clue_6"]);
  });

  it("the requirement ledger drops on-page clues only under the flag, and records where they were", () => {
    const cmlCase = {
      prose_requirements: {
        clue_to_scene_mapping: [
          { clue_id: "clue_5", act_number: 1, scene_number: 4 },
          { clue_id: "clue_6", act_number: 1, scene_number: 4 },
          { clue_id: "clue_9", act_number: 1, scene_number: 4 },
        ],
      },
    };
    const scenes = [1, 2, 3, 4].map((n) => ({ act: 1, sceneNumber: n, cluesRevealed: n === 4 ? ["clue_5", "clue_6", "clue_9"] : [] }));
    const off = withEnv({ AGENT9_CLUE_OWNERSHIP_BY_PAGE: undefined }, () =>
      buildChapterRequirementLedger(cmlCase, [scenes[3]], 4, "short", clueDistribution, scenes, priorChapters),
    );
    expect(off[0]!.requiredClueIds.sort()).toEqual(["clue_5", "clue_6", "clue_9"]);
    expect(off[0]!.inheritedFromPage).toBeUndefined();

    const on = withEnv({ AGENT9_CLUE_OWNERSHIP_BY_PAGE: "true" }, () =>
      buildChapterRequirementLedger(cmlCase, [scenes[3]], 4, "short", clueDistribution, scenes, priorChapters),
    );
    expect(on[0]!.requiredClueIds).toEqual(["clue_9"]);
    expect(on[0]!.inheritedFromPage).toEqual([
      { id: "clue_5", chapter: 3 },
      { id: "clue_6", chapter: 3 },
    ]);
  });
});
