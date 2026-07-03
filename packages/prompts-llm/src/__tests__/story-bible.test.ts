import { describe, expect, it } from "vitest";
import { buildStoryBible, runBibleGates } from "../story-bible.js";
import { buildMacroArcPlan } from "../agent9-prose/types.js";

// First-principles LLD §5.1/§6.1 — the Story Bible folds the scattered upstream artifacts into one
// dereferenceable object and runs the source-level gates. Reuses the A_57 sundial fixture.

const sundialDevice = {
  title: "The Garden Sundial Alibi",
  corePrinciple:
    "The sundial's shadow length and direction, combined with solar azimuth and elevation angles, contradict the supposed murder time.",
  fairPlayClues: ["Weather logs confirm clear skies that day"],
};
const clearAfternoon = { weather: "clear skies", timeOfDay: "Early afternoon", season: "summer" };
const lockedFacts = [
  { id: "lf_true", description: "the actual murder time the shadow indicates", value: "twenty minutes past four in the afternoon" },
  { id: "lf_staged", description: "time the watch was staged to show", value: "half past three in the afternoon" },
];
const cast = [
  { name: "Edith Marwood", gender: "female", role_archetype: "victim" },
  { name: "Edward Marwood", gender: "male", role_archetype: "suspect" },
  { name: "Daphne Sinclair", gender: "female", role_archetype: "suspect" },
  { name: "Arthur Hale", gender: "male", role_archetype: "detective" },
];

const baseInputs = {
  lockedFacts,
  device: sundialDevice,
  atmosphere: clearAfternoon,
  cast,
  victim: "Edith Marwood",
  culprits: ["Edward Marwood"],
  macroArcPlan: buildMacroArcPlan(8),
  cmlCase: {
    cast,
    discriminating_test: {
      design: "recreate the sundial shadow at the true temperature and time the lag",
      evidence_clues: ["clue_shadow_lag", "clue_weather_log"],
      eliminated_suspects: ["Daphne Sinclair"],
    },
  },
  characterBundle: {
    characters: [
      {
        name: "Arthur Hale",
        voiceFragments: [{ register: "dry-precise", text: "He measured his words like dosages." }],
        humourStyle: "wry understatement",
        humourLevel: 2,
        forbiddenCliché: "the game is afoot",
        speechMannerisms: "trails off mid-thought",
      },
    ],
  },
  storyContract: {
    crimeTimeAnchors: ["twenty minutes past four in the afternoon"],
    culpritAlibiWindows: { "Edward Marwood": "claims the stables from three to five" },
  },
  cluesByChapter: { 3: ["clue_shadow_lag"], 6: ["clue_weather_log"] },
};

describe("buildStoryBible — folds upstream artifacts into one dereferenceable object", () => {
  const bible = buildStoryBible(baseInputs);

  it("inherits the world-state ledger (facts typed, identity, contradiction)", () => {
    expect(bible.facts.length).toBe(2);
    expect(bible.characters.map((c) => c.name)).toContain("Edward Marwood");
    expect(bible.contradiction).not.toBeNull();
  });

  it("represents the central contradiction UNLABELLED (no fabricated staged/true split)", () => {
    expect(bible.clock.contradictionValues).not.toBeNull();
    expect(bible.clock.contradictionValues).toHaveLength(2);
    // staged is empty until an explicit upstream triple exists — we do not guess which value is staged
    expect(Object.keys(bible.clock.staged)).toHaveLength(0);
    expect(bible.discriminatingTest.contradictionValues).toEqual(bible.clock.contradictionValues);
  });

  it("derives true-time anchors and the murder moment from the G5 oracle, not prose", () => {
    expect(bible.clock.true.crime_anchor_0).toBe("twenty minutes past four in the afternoon");
    expect(bible.clock.murderMoment).toBe("twenty minutes past four in the afternoon");
  });

  it("locks voice profiles from the character bundle", () => {
    expect(bible.voices["Arthur Hale"]).toMatchObject({
      register: "dry-precise",
      humourStyle: "wry understatement",
      forbiddenCliché: "the game is afoot",
    });
  });

  it("populates the discriminating test as a structured object", () => {
    expect(bible.discriminatingTest.exposingAction).toMatch(/recreate the sundial shadow/);
    expect(bible.discriminatingTest.evidenceClueIds).toEqual(["clue_shadow_lag", "clue_weather_log"]);
    expect(bible.discriminatingTest.eliminatedSuspects).toEqual(["Daphne Sinclair"]);
  });

  it("builds a per-chapter beat-sheet from the macro-arc plan + clue map", () => {
    expect(bible.beatSheet).toHaveLength(8);
    expect(bible.beatSheet[0].archetype).toBe("DISCOVERY");
    expect(bible.beatSheet[0].arcPosition).toBe("opening");
    expect(bible.beatSheet[0].mustNotReveal.solutionCulprit).toBe(true); // culprit hidden early
    expect(bible.beatSheet[bible.beatSheet.length - 1].mustNotReveal.solutionCulprit).toBe(false); // resolution may reveal
    expect(bible.beatSheet[2].cluesToPlant).toContain("clue_shadow_lag"); // chapter 3
  });

  it("is pure — identical inputs produce identical output", () => {
    expect(JSON.stringify(buildStoryBible(baseInputs))).toBe(JSON.stringify(bible));
  });

  it("is null-safe on empty inputs", () => {
    const empty = buildStoryBible({});
    expect(empty.beatSheet).toEqual([]);
    expect(empty.clock.contradictionValues).toBeNull();
    expect(empty.voices).toEqual({});
  });
});

describe("runBibleGates — source-level coherence + soundness (LLD §6.1/P2)", () => {
  it("passes a sound, coherent case", () => {
    const bible = buildStoryBible(baseInputs);
    const verdict = runBibleGates(bible, ["Edward Marwood", "Daphne Sinclair"]);
    expect(verdict.ok).toBe(true);
  });

  it("fails when a suspect is neither culprit nor eliminated (not fair-play sound)", () => {
    const bible = buildStoryBible(baseInputs);
    // 'Mrs Vane' is in play but the test neither names her culprit nor eliminates her
    const verdict = runBibleGates(bible, ["Edward Marwood", "Daphne Sinclair", "Mrs Vane"]);
    expect(verdict.ok).toBe(false);
    expect(verdict.discriminator.issues.some((i) => i.kind === "suspect_unaccounted")).toBe(true);
  });

  it("fails when the culprit is the victim (incoherent)", () => {
    const bible = buildStoryBible({ ...baseInputs, culprits: ["Edith Marwood"] });
    const verdict = runBibleGates(bible, ["Edward Marwood", "Daphne Sinclair"]);
    expect(verdict.ok).toBe(false);
    expect(verdict.contradiction.conflicts.some((c) => c.kind === "culprit_is_victim")).toBe(true);
  });
});
