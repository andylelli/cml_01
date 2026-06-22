import { describe, expect, it } from "vitest";
import { applyHardCaps } from "../hard-caps.js";
import { bandFor } from "../bands.js";
import { extractStoryFacts } from "../facts.js";
import { scoreStory, type RubricJudge } from "../score.js";
import { createLLMRubricJudge, parseJudgeResult, type ChatFn } from "../llm-judge.js";
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

  it("MINOR leakage (1 fragment) → prose ≤4 ONLY, no overall cap (rubric: 'unless leakage is very minor')", () => {
    const r = applyHardCaps(rubric(), { templateLeakageHits: ["the elapsed time was confirmed"] });
    expect(markOf(r, "prose")).toBe(4);
    expect(r.final).toBeGreaterThan(65); // a single note-like line is a Prose penalty, not a global cap
  });

  it("MATERIAL leakage (≥2 fragments) → prose ≤4 AND overall ≤65", () => {
    const r = applyHardCaps(rubric(), { templateLeakageHits: ["the elapsed time was confirmed", "the chapter moves forward through"] });
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
    // pronoun (prose≤5) + material leakage (prose≤4) → prose ≤4
    const r = applyHardCaps(rubric(), { pronounsUnstable: true, templateLeakageHits: ["x x", "y y"] });
    expect(markOf(r, "prose")).toBe(4);
    expect(r.final).toBeLessThanOrEqual(65); // tightest ceiling (leakage 65 < pronoun 69)
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

  it("ANALYSIS_45 §5.1 fix: does NOT flag victimUnnamed when the CASE has no role:victim member", () => {
    // the live Fairweather CML tagged no cast member as victim, yet the victim WAS named in prose
    const noVictimRole = {
      cast: [{ name: "Inspector Gray", role: "detective" }, { name: "Marlowe", role: "suspect" }],
      culpability: { culprits: ["Marlowe"] },
    };
    const f = extractStoryFacts(noVictimRole, "Sir Lionel lay dead in the study; Gray questioned Marlowe.");
    expect(f.victimUnnamed).toBeUndefined(); // unresolved victim name → defer to the judge, do not cap
    expect(f.culpritIsVictim).toBeUndefined();
  });

  it("resolves the victim from a dedicated CASE.victim field when cast isn't tagged", () => {
    const withField = { victim: "Sir Lionel", cast: [{ name: "Gray", role: "detective" }], culpability: { culprits: ["X"] } };
    expect(extractStoryFacts(withField, "Gray paced the hall.").victimUnnamed).toBe(true); // resolved + absent
    expect(extractStoryFacts(withField, "Sir Lionel lay dead; Gray paced.").victimUnnamed).toBe(false);
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

  it("the deterministic extractor OVERRIDES a generous judge: material leakage caps Prose ≤4 + overall ≤65 even if the judge gave 10", async () => {
    const leaky = "The chapter moves forward through vivid detail. The elapsed time was confirmed as forty minutes. Lord Ashby is dead.";
    const judge: RubricJudge = async () => ({ rubric: rubric({ prose: 10 }) }); // judge missed the leak
    const r = await scoreStory({ prose: leaky, cml: caseData, judge });
    expect(r.categories.find((c) => c.category === "prose")!.mark).toBe(4); // capped by the extractor's fact
    expect(r.final).toBeLessThanOrEqual(65); // two distinct leakage fragments → material → overall cap
    expect(r.capsApplied.some((c) => /leakage/.test(c))).toBe(true);
  });

  it("merges judge-supplied semantic flags (dead-victim-alive) into the caps", async () => {
    const judge: RubricJudge = async () => ({ rubric: rubric(), flags: { deadVictimAppearsAlive: true } });
    const r = await scoreStory({ prose: cleanProse, cml: caseData, judge });
    expect(r.final).toBeLessThanOrEqual(60);
  });
});

describe("createLLMRubricJudge — wraps a ChatFn, tolerant of fences/missing fields", () => {
  const payload = {
    categories: CATEGORIES.map((c) => ({ category: c, mark: 7, reason: "ok" })),
    total: 70,
    overall_view: "decent",
    what_works: ["clear victim"],
    main_problems: ["thin clues"],
    chapter_issues: [{ chapter: 1, issues: ["slow open"] }],
    fastest_fixes: ["plant clue earlier"],
    flags: { weakMurderMethod: true },
  };

  it("parses a code-fenced JSON judge response into { rubric, flags }", async () => {
    const chat: ChatFn = async () => ({ content: "```json\n" + JSON.stringify(payload) + "\n```" });
    const judge = createLLMRubricJudge(chat, { temperature: 0.2 });
    const { rubric: r, flags } = await judge({ systemPrompt: "s", userMessage: "u", schema: {} as never });
    expect(r.categories).toHaveLength(10);
    expect(r.total).toBe(70);
    expect(flags?.weakMurderMethod).toBe(true);
  });

  it("parseJudgeResult backfills total from category marks when absent", () => {
    const { rubric: r } = parseJudgeResult(JSON.stringify({ categories: CATEGORIES.map((c) => ({ category: c, mark: 6, reason: "x" })) }));
    expect(r.total).toBe(60);
  });

  it("normalizes alt category keys/labels so the caps can bind (the live gpt-4o-mini shape)", () => {
    // model returned `name`/`score` and prose-ish labels — must map to canonical categories
    const { rubric: r } = parseJudgeResult(
      JSON.stringify({
        categories: [
          { name: "Premise / Concept", score: 8, notes: "x" },
          { name: "Opening Hook", score: 7 },
          { name: "Plot Structure", score: 6 },
          { name: "Character Clarity", score: 5 },
          { name: "Dialogue", score: 7 },
          { name: "Atmosphere / Setting", score: 6 },
          { name: "Mystery Clues / Evidence Logic", score: 5 },
          { name: "Pacing", score: 7 },
          { name: "Ending / Reveal", score: 6 },
          { name: "Prose / Polish", score: 7 },
        ],
      }),
    );
    expect(r.categories.map((c) => c.category)).toEqual(CATEGORIES);
    expect(r.categories.find((c) => c.category === "character_clarity")!.mark).toBe(5);
  });

  it("the wrapped judge composes with scoreStory + caps end to end (stub chat)", async () => {
    const leaky = "The chapter moves forward through vivid detail. Lord Ashby is dead.";
    const chat: ChatFn = async () => ({ content: JSON.stringify({ ...payload, categories: CATEGORIES.map((c) => ({ category: c, mark: 9, reason: "x" })) }) });
    const r = await scoreStory({
      prose: leaky,
      cml: { cast: [{ name: "Lord Ashby", role: "victim" }], culpability: { culprits: ["X"] } },
      judge: createLLMRubricJudge(chat),
    });
    expect(r.categories.find((c) => c.category === "prose")!.mark).toBe(4); // extractor's leakage fact caps it
  });
});
