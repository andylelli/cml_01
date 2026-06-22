import { describe, expect, it } from "vitest";
import { applyHardCaps } from "../hard-caps.js";
import { bandFor } from "../bands.js";
import { extractStoryFacts } from "../facts.js";
import { scoreStory, type RubricJudge } from "../score.js";
import { CATEGORIES, type Category, type RubricScore, type StoryFacts } from "../types.js";

/** A clean rubric score: every category 8/10 → raw total 80. */
function rubric(overrides: Partial<Record<Category, number>> = {}): RubricScore {
  const categories = CATEGORIES.map((c) => ({ category: c, mark: overrides[c] ?? 8, reason: "test" }));
  return {
    categories,
    total: categories.reduce((s, c) => s + c.mark, 0),
    overall_view: "v",
    what_works: [],
    main_problems: [],
    chapter_issues: [],
    fastest_fixes: [],
  };
}
const markOf = (r: { categories: Array<{ category: Category; mark: number }> }, c: Category) =>
  r.categories.find((x) => x.category === c)!.mark;

describe("bands (§ Score Bands)", () => {
  it("maps totals to the calibration bands", () => {
    expect(bandFor(95)).toBe("Excellent, polished mystery");
    expect(bandFor(82)).toBe("Very strong");
    expect(bandFor(72)).toBe("Solid draft");
    expect(bandFor(64)).toBe("Promising but rough");
    expect(bandFor(35)).toBe("Hard to follow as a story");
  });
});

describe("applyHardCaps — a clean story is unchanged", () => {
  it("no caps fire → final == raw total, no caps applied", () => {
    const r = applyHardCaps(rubric(), {});
    expect(r.final).toBe(80);
    expect(r.rawTotal).toBe(80);
    expect(r.capsApplied).toEqual([]);
    expect(r.band).toBe("Very strong");
  });
});

describe("applyHardCaps — each rubric hard cap fires correctly", () => {
  it("culprit = victim → char ≤2, ending ≤3, overall ≤55", () => {
    const r = applyHardCaps(rubric(), { culpritIsVictim: true });
    expect(markOf(r, "character_clarity")).toBe(2);
    expect(markOf(r, "ending")).toBe(3);
    expect(r.final).toBeLessThanOrEqual(55);
    expect(r.capsApplied.some((c) => /culprit = victim/.test(c))).toBe(true);
  });

  it("dead victim appears alive → char ≤3, plot ≤5, clues ≤6, ending ≤4, overall ≤60", () => {
    const r = applyHardCaps(rubric({ character_clarity: 9, plot_structure: 9, clues: 9, ending: 9 }), {
      deadVictimAppearsAlive: true,
    });
    expect(markOf(r, "character_clarity")).toBe(3);
    expect(markOf(r, "plot_structure")).toBe(5);
    expect(markOf(r, "clues")).toBe(6);
    expect(markOf(r, "ending")).toBe(4);
    expect(r.final).toBeLessThanOrEqual(60);
  });

  it("dead victim appears alive AND is culprit → char ≤2, ending ≤3, overall ≤55", () => {
    const r = applyHardCaps(rubric(), { deadVictimAppearsAlive: true, deadVictimIsCulprit: true });
    expect(markOf(r, "character_clarity")).toBe(2);
    expect(markOf(r, "ending")).toBe(3);
    expect(r.final).toBeLessThanOrEqual(55);
  });

  it("victim = investigator → char ≤3", () => {
    expect(markOf(applyHardCaps(rubric(), { victimIsInvestigator: true }), "character_clarity")).toBe(3);
  });

  it("pronoun instability → char ≤5, prose ≤5, overall ≤69", () => {
    const r = applyHardCaps(rubric(), { pronounsUnstable: true });
    expect(markOf(r, "character_clarity")).toBe(5);
    expect(markOf(r, "prose")).toBe(5);
    expect(r.final).toBeLessThanOrEqual(69);
  });

  it("template leakage → prose ≤4, overall ≤65", () => {
    const r = applyHardCaps(rubric(), { templateLeakageHits: ["the elapsed time was confirmed"] });
    expect(markOf(r, "prose")).toBe(4);
    expect(r.final).toBeLessThanOrEqual(65);
  });

  it("victim unnamed → overall ≤72 (no category cap)", () => {
    const r = applyHardCaps(rubric({ premise: 10, opening_hook: 10 }), { victimUnnamed: true });
    expect(r.final).toBeLessThanOrEqual(72);
  });

  it("weak murder method → ending ≤6, overall ≤75", () => {
    const r = applyHardCaps(rubric(), { weakMurderMethod: true });
    expect(markOf(r, "ending")).toBe(6);
    expect(r.final).toBeLessThanOrEqual(75);
  });

  it("reveal uses unplanted evidence → ending ≤5; ending contradicts → ending ≤4", () => {
    expect(markOf(applyHardCaps(rubric(), { revealUsesUnplantedEvidence: true }), "ending")).toBe(5);
    expect(markOf(applyHardCaps(rubric(), { endingContradictsEarlier: true }), "ending")).toBe(4);
  });

  it("takes the MINIMUM cap when several fire on the same category", () => {
    // pronoun (prose≤5) + leakage (prose≤4) → prose ≤4
    const r = applyHardCaps(rubric(), { pronounsUnstable: true, templateLeakageHits: ["x x"] });
    expect(markOf(r, "prose")).toBe(4);
    expect(r.final).toBeLessThanOrEqual(65); // tightest ceiling
  });

  it("a high raw score with a continuity defect lands in the right band (§ How to Score Overall)", () => {
    // raw 90s but culprit==victim → must drop to ≤55 (Major continuity problems / Usable concept band)
    const r = applyHardCaps(rubric({ premise: 10, opening_hook: 9, plot_structure: 9, dialogue: 9, atmosphere: 9, clues: 9, pacing: 9, prose: 9 }), { culpritIsVictim: true });
    expect(r.rawTotal).toBeGreaterThanOrEqual(85);
    expect(r.final).toBeLessThanOrEqual(55);
  });
});

describe("extractStoryFacts — the exact facts from the CASE + prose", () => {
  const caseData = {
    cast: [
      { name: "Inspector Gray", role: "detective" },
      { name: "Lord Ashby", role: "victim" },
      { name: "Marlowe", role: "suspect" },
    ],
    culpability: { culprits: ["Marlowe"] },
  };

  it("a clean story: culprit≠victim, victim named, no leakage", () => {
    const f = extractStoryFacts(caseData, "Lord Ashby lay dead in the study; Inspector Gray questioned Marlowe.");
    expect(f.culpritIsVictim).toBe(false);
    expect(f.victimIsInvestigator).toBe(false);
    expect(f.victimUnnamed).toBe(false);
    expect(f.templateLeakageHits).toEqual([]);
  });

  it("detects the accidental culprit==victim collision (exact, from CASE)", () => {
    const bad = { ...caseData, culpability: { culprits: ["Lord Ashby"] } };
    expect(extractStoryFacts(bad, "Lord Ashby...").culpritIsVictim).toBe(true);
  });

  it("detects an unnamed victim and template leakage in the prose", () => {
    const f = extractStoryFacts(caseData, "The body was found. The elapsed time was confirmed as forty minutes.");
    expect(f.victimUnnamed).toBe(true); // "Lord Ashby" never appears
    expect(f.templateLeakageHits!.length).toBeGreaterThan(0);
  });
});

describe("scoreStory — orchestration with an injectable stub judge", () => {
  const caseData = {
    cast: [{ name: "Gray", role: "detective" }, { name: "Lord Ashby", role: "victim" }, { name: "Marlowe", role: "suspect" }],
    culpability: { culprits: ["Marlowe"] },
  };
  const cleanProse = "Lord Ashby lay dead. Gray studied the room, then turned to Marlowe with a question.";

  it("a strong story scored 8s ships ~80 with no caps", async () => {
    const judge: RubricJudge = async () => ({ rubric: rubric() });
    const r = await scoreStory({ prose: cleanProse, cml: caseData, judge });
    expect(r.final).toBe(80);
    expect(r.band).toBe("Very strong");
    expect(r.capsApplied).toEqual([]);
  });

  it("the deterministic extractor OVERRIDES a generous judge: leakage in prose caps Prose ≤4 even if the judge gave 10", async () => {
    const leaky = "The chapter moves forward through vivid detail. Lord Ashby is dead.";
    const judge: RubricJudge = async () => ({ rubric: rubric({ prose: 10 }) }); // judge missed the leak
    const r = await scoreStory({ prose: leaky, cml: caseData, judge });
    expect(r.categories.find((c) => c.category === "prose")!.mark).toBe(4); // capped by the extractor's fact
    expect(r.final).toBeLessThanOrEqual(65);
    expect(r.capsApplied.some((c) => /leakage/.test(c))).toBe(true);
  });

  it("merges judge-supplied semantic flags (dead-victim-alive) into the caps", async () => {
    const judge: RubricJudge = async () => ({ rubric: rubric(), flags: { deadVictimAppearsAlive: true } });
    const r = await scoreStory({ prose: cleanProse, cml: caseData, judge });
    expect(r.final).toBeLessThanOrEqual(60);
  });
});
