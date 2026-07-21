import { describe, expect, it, vi } from "vitest";

// obligation-block reads rollout flags at runtime; disable the tiered phrase contract so the
// assertions stay focused on the A_64 C1/C2 contracts under test.
vi.mock("@cml/story-validation", async () => {
  const actual = await vi.importActual<any>("@cml/story-validation");
  return {
    ...actual,
    getGenerationParams: () => ({
      agent9_prose: { rollout_flags: { tiered_phrase_contract_enabled: false } },
    }),
  };
});

import { buildChapterObligationBlock } from "../agent9-prose/obligation-block.ts";
import { buildMacroArcPlan } from "../agent9-prose/types.ts";

// ── A_64 §3.3 — THE PLANTED MYSTERY drafting contracts (C1 plants, C2 earned reveal + aftermath) ──

const mkScene = (sceneNumber: number, act: number, title: string, extras: any = {}): any => ({
  act,
  sceneNumber,
  title,
  purpose: title,
  setting: { location: "Marlowe Hall study" },
  characters: [],
  summary: "",
  ...extras,
});

const makeOutline = (): any[] => [
  mkScene(1, 1, "The Gathering"),
  mkScene(2, 1, "The Crime", { cluesRevealed: ["c_early"] }),
  mkScene(3, 1, "First Enquiries", { cluesPlanted: ["c_tide"] }),
  mkScene(4, 2, "Motives"),
  mkScene(5, 2, "Movements", { cluesRevealed: ["c_tide"] }),
  mkScene(6, 2, "The False Solution"),
  mkScene(7, 2, "Secrets", { cluesRevealed: ["c_watch"] }),
  mkScene(8, 3, "The Pattern"),
  mkScene(9, 3, "The Final Trap"),
  mkScene(10, 3, "Aftermath"),
];

const makeCase = (): any => ({
  meta: { setting: { location: "Marlowe Hall" } },
  cast: [
    { name: "Alice Grey", role: "detective", gender: "female" },
    { name: "Edgar Vale", role_archetype: "suspect", gender: "male" },
    { name: "Lionel Marlowe", role_archetype: "victim", gender: "male" },
  ],
  culpability: { culprits: ["Edgar Vale"] },
  hidden_model: { mechanism: { description: "the tide chart swapped to fake the crossing time" } },
  prose_requirements: {
    discriminating_test_scene: { act_number: 3, scene_number: 1 },
    culprit_revelation_scene: { act_number: 3, scene_number: 2 },
    suspect_clearance_scenes: [],
    clue_to_scene_mapping: [],
  },
});

const clueDistribution: any = {
  clues: [
    { id: "c_early", category: "physical", description: "mud on the terrace step", observable: "fresh mud drying on the terrace step", pointsTo: "someone came in from the shore", placement: "early", criticality: "supporting", sourceInCML: "x" },
    { id: "c_tide", category: "temporal", description: "the tide chart on the desk", observable: "a tide chart lying open on the victim's desk", pointsTo: "the crossing time was impossible", placement: "mid", criticality: "essential", sourceInCML: "x" },
    { id: "c_watch", category: "physical", description: "the stopped watch", observable: "the victim's watch stopped at ten past nine", pointsTo: "the staged time", placement: "mid", criticality: "essential", sourceInCML: "x" },
  ],
};

const buildBlockFor = (scene: any, chapterNumber: number, opts: { macroArcPlan?: any; outline?: any[] } = {}): string =>
  buildChapterObligationBlock(
    [scene],
    chapterNumber,
    makeCase(),
    [] as any,
    undefined,
    clueDistribution,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    opts.macroArcPlan,
    opts.outline ?? makeOutline(),
    undefined,
  );

describe("A_64 C1 — PLANT OBLIGATIONS rendering", () => {
  it("renders a stamped plant as an incidental, significance-unflagged appearance", () => {
    const outline = makeOutline();
    const block = buildBlockFor(outline[2], 3, { outline });
    expect(block).toContain("PLANT OBLIGATIONS");
    expect(block).toContain("[plant:c_tide]");
    // observables render as de-spoiled key terms (surfaceSpecKeyTerms), same as clue obligations
    expect(block).toMatch(/tide/);
    expect(block).toMatch(/chart/);
    expect(block).toMatch(/significance UNFLAGGED|NO character comments/);
    expect(block).toContain('"little did they know"'); // the forbidden narrator-hint rule is explicit
  });

  it("emits no plant section when the scene has no cluesPlanted", () => {
    const outline = makeOutline();
    const block = buildBlockFor(outline[3], 4, { outline });
    expect(block).not.toContain("PLANT OBLIGATIONS");
  });
});

describe("A_64 C2 — the earned reveal (walked deduction + demoted confession)", () => {
  it("the reveal chapter walks prior essential clues in reader order and demotes the confession", () => {
    const outline = makeOutline();
    const block = buildBlockFor(outline[8], 9, { outline }); // scene 9 = culprit_revelation_scene (act 3, per-act 2)
    expect(block).toContain("THE DEDUCTION MUST BE WALKED, NOT ASSERTED");
    // order: c_tide (revealed scene 5) before c_watch (scene 7); supporting c_early excluded
    const iTide = block.indexOf("[c_tide]");
    const iWatch = block.indexOf("[c_watch]");
    expect(iTide).toBeGreaterThan(-1);
    expect(iWatch).toBeGreaterThan(iTide);
    expect(block).not.toContain("1. fresh mud"); // supporting clue not in the walk
    expect(block).toContain("CONFESSION CONFIRMS, NEVER SUPPLIES");
  });

  it("a non-reveal chapter gets neither contract", () => {
    const outline = makeOutline();
    const block = buildBlockFor(outline[4], 5, { outline });
    expect(block).not.toContain("DEDUCTION MUST BE WALKED");
    expect(block).not.toContain("CONFESSION CONFIRMS");
  });
});

describe("A_64 C3 — the timeline spine + one-question rule on interrogation scenes", () => {
  const withAlibis = (): any => {
    const c = makeCase();
    c.cast = [
      { name: "Alice Grey", role: "detective", gender: "female", alibi_window: "" },
      { name: "Edgar Vale", role_archetype: "suspect", gender: "male", alibi_window: "in the billiard room from nine until half past ten" },
      { name: "Clara Whitfield", role_archetype: "suspect", gender: "female", alibi_window: "walking the shore path until the tide turned" },
      { name: "Lionel Marlowe", role_archetype: "victim", gender: "male", alibi_window: "irrelevant — the victim" },
    ];
    return c;
  };
  const buildWithCase = (scene: any, chapterNumber: number, cmlCase: any, outline: any[]): string =>
    buildChapterObligationBlock([scene], chapterNumber, cmlCase, [] as any, undefined, clueDistribution,
      undefined, undefined, undefined, undefined, undefined, undefined, outline, undefined);

  it("an interrogation-register pre-reveal scene carries the spine (claims verbatim) and the one-question rule", () => {
    const outline = makeOutline();
    const scene = mkScene(4, 2, "Alibis", { purpose: "The inspector questions the household about their movements." });
    const block = buildWithCase(scene, 4, withAlibis(), outline);
    expect(block).toContain("TIMELINE SPINE");
    expect(block).toContain("Edgar Vale claims: in the billiard room from nine until half past ten");
    expect(block).toContain("Clara Whitfield claims: walking the shore path");
    expect(block).not.toContain("Lionel Marlowe claims"); // victims excluded
    expect(block).toContain("ONE-QUESTION RULE");
  });

  it("a non-interrogation scene gets neither", () => {
    const outline = makeOutline();
    const scene = mkScene(6, 2, "The Storm Breaks", { purpose: "The household shelters from the gale." });
    const block = buildWithCase(scene, 6, withAlibis(), outline);
    expect(block).not.toContain("TIMELINE SPINE");
    expect(block).not.toContain("ONE-QUESTION RULE");
  });

  it("the reveal chapter never carries the one-question rule (the walk owns that chapter)", () => {
    const outline = makeOutline();
    const scene = mkScene(9, 3, "The Final Trap", { purpose: "The inspector questions Edgar Vale one last time." });
    const block = buildWithCase(scene, 9, withAlibis(), outline);
    expect(block).not.toContain("ONE-QUESTION RULE");
  });

  it("no alibi windows in the CML → no spine (graceful degradation)", () => {
    const outline = makeOutline();
    const scene = mkScene(4, 2, "Alibis", { purpose: "Questioning about movements." });
    const block = buildWithCase(scene, 4, makeCase(), outline);
    expect(block).not.toContain("TIMELINE SPINE");
  });
});

describe("A_64 C2 — the aftermath beat on the final chapter", () => {
  it("the last chapter of the macro arc carries the AFTERMATH REQUIRED contract", () => {
    const outline = makeOutline();
    const block = buildBlockFor(outline[9], 10, { outline, macroArcPlan: buildMacroArcPlan(10) });
    expect(block).toContain("AFTERMATH REQUIRED (final chapter)");
    expect(block).toMatch(/motive is understood in HUMAN terms/);
  });

  it("a middle chapter never carries it", () => {
    const outline = makeOutline();
    const block = buildBlockFor(outline[4], 5, { outline, macroArcPlan: buildMacroArcPlan(10) });
    expect(block).not.toContain("AFTERMATH REQUIRED");
  });
});
