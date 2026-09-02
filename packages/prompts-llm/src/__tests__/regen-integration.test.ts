import { describe, expect, it, vi } from "vitest";
import { buildStoryBible } from "../story-bible.js";
import { buildMacroArcPlan } from "../agent9-prose/types.js";
import {
  pronounsFromBible,
  lockedFactValues,
  embargoForBeat,
  instructionForDefect,
  buildRegenRequest,
  composeChapterValidator,
  runClueRegenPass,
  runClearanceRegenPass,
  runSuspectEliminationRegenPass,
  runScaffoldRegenPass,
  runMechanismRevealRegenPass,
  runVoiceLeakageRegenPass,
  applyScaffoldExhaustionFloor,
  culpritEvidenceLinkInText,
  assembleScoringChapterTexts,
  detectDualValueAtShipScope,
  runDualValueFullStoryResidualPass,
} from "../agent9-prose/regen-integration.js";
import { detectScaffoldNotProse } from "@cml/prose-guard";
import {
  deriveMechanismTerms,
  chapterFullyExplainsMechanism,
  mechanismExplanationParagraphIndex,
} from "../agent9-prose/mechanism-detect.js";
import { chapterClueAppearsEarly } from "../agent9-prose/clue-validation.js";
import { makeRegenFn } from "../agent9-prose/regen-llm.js";
import type { ProseDefect } from "../agent9-prose/regen-repair.js";
import type { ProseChapter, ChapterRequirementLedgerEntry } from "../agent9-prose/types.js";

// LLD §6.4 / P3.3 — the verifier→Bible→regen glue. Pure; dereferences the Bible, never re-derives.

const bible = buildStoryBible({
  lockedFacts: [
    { id: "lf_time", description: "the staged time", value: "half past three" },
    { id: "lf_log", description: "the weather log", value: "Weather logs confirming clear skies during the afternoon" },
  ],
  cast: [
    { name: "Evelyn Harcourt", gender: "female", role_archetype: "detective" },
    { name: "James Harcourt", gender: "male", role_archetype: "suspect" },
    { name: "Lord Charles Harcourt", gender: "male", role_archetype: "victim" },
  ],
  victim: "Lord Charles Harcourt",
  culprits: ["James Harcourt"],
  macroArcPlan: buildMacroArcPlan(8),
});

const clueDefect: ProseDefect = {
  chapter: 3,
  paragraphIndex: 1,
  kind: "missing_clue",
  detail: "the cold tea clue is absent",
  obligationRef: "clue_cold_tea",
  severity: "hard",
};

describe("Bible dereferencing — pronouns, locked facts, embargo", () => {
  it("derives locked pronouns from cast gender", () => {
    expect(pronounsFromBible(bible)).toMatchObject({
      "Evelyn Harcourt": "she/her",
      "James Harcourt": "he/him",
    });
  });

  it("surfaces only ATOMIC locked-fact values verbatim (the descriptive weather log is paraphrasable)", () => {
    const vals = lockedFactValues(bible).map((f) => f.value);
    expect(vals).toContain("half past three");
    expect(vals).not.toContain("Weather logs confirming clear skies during the afternoon");
  });

  it("embargoes the culprit on a non-resolution beat, but not on the resolution beat", () => {
    const ch3Beat = bible.beatSheet.find((b) => b.chapter === 3)!;
    const lastBeat = bible.beatSheet[bible.beatSheet.length - 1];
    expect(embargoForBeat(bible, ch3Beat)).toContain("James Harcourt is the culprit");
    expect(embargoForBeat(bible, lastBeat)).toEqual([]); // resolution may reveal
  });
});

describe("instructionForDefect — maps kind to a concrete in-scene instruction", () => {
  it("clue → plant as observation", () => {
    expect(instructionForDefect(clueDefect)).toMatch(/in-scene observation/i);
    expect(instructionForDefect(clueDefect)).toMatch(/clue_cold_tea/);
  });
  it("clearance → witnessed deduction, not verdict", () => {
    expect(instructionForDefect({ ...clueDefect, kind: "missing_clearance", obligationRef: "Mallory" })).toMatch(
      /witnessed deduction/i,
    );
  });
  it("scaffold → REPLACE the machine-inserted wording entirely (A_64 F3), conveying the fact in-scene", () => {
    const instr = instructionForDefect({ ...clueDefect, kind: "scaffold_not_prose" });
    expect(instr).toMatch(/machine-inserted template text/i);
    expect(instr).toMatch(/REPLACE each flagged sentence entirely/);
    expect(instr).toMatch(/do not reuse or lightly edit its wording/i); // the dv_clock_off echo failure
  });
  it("clue_too_late → add the observation within the first quarter, keeping the later mention", () => {
    const instr = instructionForDefect({ ...clueDefect, kind: "clue_too_late" });
    expect(instr).toMatch(/FIRST QUARTER/);
    expect(instr).toMatch(/later mention intact/i);
  });
  it("scaffold carrying the A1 early-clue lead → constrained to PRIVATE noticing, no announcement (ITEM 12)", () => {
    const a1Detail = "Clara laid the facts out plainly where the others could see them: mantel clock rewound.";
    const instr = instructionForDefect({ ...clueDefect, kind: "scaffold_not_prose", detail: a1Detail });
    expect(instr).toMatch(/PRIVATELY notices or examines/);
    expect(instr).toMatch(/do NOT stage the investigator announcing conclusions/i);
    expect(instr).toMatch(/assembled listeners/i);
    expect(instr).toMatch(/do NOT summarize what is known/i);
    // ordinary scaffold details keep the normal wording — the override fires only on the A1 lead
    const normal = instructionForDefect({ ...clueDefect, kind: "scaffold_not_prose", detail: "the trail bent toward the gardener" });
    expect(normal).toMatch(/REPLACE each flagged sentence entirely/);
    expect(normal).not.toMatch(/assembled listeners/i);
  });
  it("aftermath_repeat → a direct question gets acknowledgement only, not a re-justification (A_82 §14.3)", () => {
    // MEASURED on run mystery-1788369981295: this defect kind failed both regen attempts on the same
    // paragraph. Chapter 9 has Beatrice ask the culprit "You did this for me, didn't you?" and the
    // rewrite kept answering it with a restated motive ("I believed it was the only way to prevent
    // ruin... I judged it necessary") — exactly the restatement the instruction already forbade, pulled
    // back in by the shape of a direct question. §13.6/§14.3 independently confirmed the same defect:
    // this project's own aftermath_repeat regen scored 375→375, unchanged, and the external reviewer
    // separately named chapter 9 as re-litigating Hugo's guilt.
    const instr = instructionForDefect({ ...clueDefect, kind: "aftermath_repeat" });
    expect(instr).toMatch(/do not restate.*the motive/i);
    expect(instr).toMatch(/ACKNOWLEDGEMENT ONLY/);
    expect(instr).toMatch(/asking the culprit to confirm or explain/i);
    expect(instr).toMatch(/never a restated reason, a re-justification/i);
  });
});

describe("buildRegenRequest — assembles a fully-constrained request from the Bible", () => {
  const chapter: ProseChapter = { title: "Ch3", paragraphs: ["Evelyn entered.", "Nothing seemed amiss."] };
  const req = buildRegenRequest(chapter, clueDefect, bible);

  it("carries the scoped paragraph, instruction, pronouns, locked facts, and embargo", () => {
    expect(req.paragraphIndex).toBe(1);
    expect(req.instruction).toMatch(/clue_cold_tea/);
    expect(req.constraints.pronouns["James Harcourt"]).toBe("he/him");
    expect(req.constraints.lockedFacts.some((f) => f.value === "half past three")).toBe(true);
    expect(req.constraints.mustNotReveal).toContain("James Harcourt is the culprit");
    expect(req.defect).toBe(clueDefect);
  });
});

describe("composeChapterValidator — scaffold gate + targeted checks", () => {
  const cluePresent = (c: ProseChapter) => {
    const ok = (c.paragraphs ?? []).join(" ").toLowerCase().includes("cold tea");
    return { ok, score: ok ? 100 : 0, violations: ok ? [] : ["missing_clue"] };
  };
  const validate = composeChapterValidator(cluePresent);

  it("fails when the targeted clue is absent", () => {
    expect(validate({ title: "", paragraphs: ["nothing here"] }).ok).toBe(false);
  });
  it("fails when scaffold is present even if the clue is there", () => {
    const r = validate({ title: "", paragraphs: ["The cold tea sat there; the trail bent toward the gardener."] });
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.startsWith("scaffold_not_prose"))).toBe(true);
  });
  it("passes clean prose that surfaces the clue", () => {
    expect(validate({ title: "", paragraphs: ["The cold tea sat untouched, a skin forming on it."] }).ok).toBe(true);
  });
});

describe("runClueRegenPass — the A1 replacement (P3.3), end-to-end with a mock client", () => {
  const ledgerEntry: ChapterRequirementLedgerEntry = {
    chapterNumber: 3,
    hardFloorWords: 800,
    preferredWords: 1200,
    requiredClueIds: ["clue_cold_tea"],
    clueObligationContext: [{ id: "clue_cold_tea", description: "the victim's tea sat cold and untouched", placement: "mid" }],
  };
  const clueDistribution: any = {
    clues: [{ id: "clue_cold_tea", description: "tea cold untouched", observable: "the cold tea sat untouched", placement: "mid", pointsTo: "" }],
  };
  const missingChapter: ProseChapter = { title: "Ch3", paragraphs: ["Evelyn entered the study.", "Nothing seemed amiss."] };

  it("plants a missing clue by ADDING a paragraph (originals preserved) and reports it repaired", async () => {
    const client = {
      chat: vi.fn(async () => ({
        // preserves BOTH original paragraphs and ADDS the clue paragraph (insertion-only)
        content: JSON.stringify({ chapter: { title: "Ch3", paragraphs: ["Evelyn entered the study.", "Nothing seemed amiss.", "On the desk, the cold tea sat untouched, a skin on its surface."] } }),
      })),
    } as any;
    const res = await runClueRegenPass({
      chapter: missingChapter,
      ledgerEntry,
      bible,
      regen: makeRegenFn({ client }),
      clueDistribution,
    });
    expect(res.ran).toBe(true);
    expect(res.repaired).toContain("clue_cold_tea");
    expect(res.unresolved).toEqual([]);
    expect(res.chapter.paragraphs.join(" ")).toMatch(/cold tea/);
    expect(res.chapter.paragraphs).toContain("Nothing seemed amiss."); // original preserved
  });

  it("ROLLS BACK a regen that modifies an existing paragraph (the repair.ts:153 re-gendering guard)", async () => {
    // The regen plants the clue but REWRITES paragraph 2 (drops "Nothing seemed amiss.") — the kind of
    // whole-chapter rewrite that historically re-genders characters / drops content. Must be rejected.
    const onUnresolved = vi.fn();
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({ chapter: { title: "Ch3", paragraphs: ["Evelyn entered the study.", "He saw the cold tea sit untouched and felt a chill."] } }),
      })),
    } as any;
    const res = await runClueRegenPass({
      chapter: missingChapter,
      ledgerEntry,
      bible,
      regen: makeRegenFn({ client }),
      clueDistribution,
      maxAttemptsPerDefect: 1,
      onUnresolved,
    });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toContain("clue_cold_tea");
    expect(onUnresolved).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringMatching(/modified_or_dropped_original_paragraph/),
    );
    expect(res.chapter.paragraphs).toEqual(missingChapter.paragraphs); // untouched original retained
  });

  it("is a no-op (no LLM call) when every required clue is already present", async () => {
    const client = { chat: vi.fn() } as any;
    const present: ProseChapter = { title: "Ch3", paragraphs: ["Evelyn saw the cold tea sit untouched on the desk."] };
    const res = await runClueRegenPass({ chapter: present, ledgerEntry, bible, regen: makeRegenFn({ client }), clueDistribution });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("reports unresolved (and logs) when regen cannot surface the clue — A1 floor still applies", async () => {
    const onUnresolved = vi.fn();
    const client = { chat: vi.fn(async () => ({ content: JSON.stringify({ chapter: { title: "Ch3", paragraphs: ["Evelyn entered the study.", "Still nothing."] } }) })) } as any;
    const res = await runClueRegenPass({
      chapter: missingChapter,
      ledgerEntry,
      bible,
      regen: makeRegenFn({ client }),
      clueDistribution,
      maxAttemptsPerDefect: 2,
      onUnresolved,
    });
    expect(res.unresolved).toContain("clue_cold_tea");
    expect(res.repaired).toEqual([]);
    expect(onUnresolved).toHaveBeenCalled();
    expect(res.chapter.paragraphs.join(" ")).not.toMatch(/cold tea/); // original retained for the floor
  });
});

describe("runClueRegenPass — clue_too_late (ITEM 12): present-but-late EARLY clue reaches the LLM before the deterministic prepend", () => {
  const earlyLedger: ChapterRequirementLedgerEntry = {
    chapterNumber: 1,
    hardFloorWords: 800,
    preferredWords: 1200,
    requiredClueIds: ["clue_clock"],
    clueObligationContext: [
      { id: "clue_clock", description: "The mantel clock has been rewound.", placement: "early" },
    ],
  };
  const earlyClueDistribution: any = {
    clues: [
      {
        id: "clue_clock",
        description: "The mantel clock has been rewound.",
        category: "physical",
        criticality: "essential",
        placement: "early",
        pointsTo: "the time of death was staged",
      },
    ],
  };
  // Clue tokens appear ONLY in the final paragraph — present, but outside the first-quarter window.
  const lateChapter: ProseChapter = {
    title: "Ch1",
    paragraphs: [
      "Clara crossed the drawing room and let the household settle before she spoke.",
      "Edgar kept his eyes on the hearth while the servants avoided one another.",
      "The butler answered each question with the same flat courtesy he gave every guest.",
      "Rain pressed against the tall panes, and the fire did little to warm the corners.",
      "Someone had drawn the curtains, and no one would say who.",
      "Clara watched the small betrayals pass between them, saying nothing yet.",
      "The maid's account and the gardener's account refused to agree on the smallest points.",
      "Only at the end did Clara mark it: the mantel clock had been rewound, and the time of death it implied was staged.",
    ],
  };

  it("emits a clue_too_late defect and repairs it when the regen ADDS an early in-scene observation", async () => {
    const client = {
      chat: vi.fn(async () => ({
        // all 8 originals preserved; the observation is INSERTED early (index 1)
        content: JSON.stringify({
          chapter: {
            title: "Ch1",
            paragraphs: [
              lateChapter.paragraphs[0],
              "On her way past the hearth, Clara paused: the mantel clock had been rewound, its staged time promising a lie about the death.",
              ...lateChapter.paragraphs.slice(1),
            ],
          },
        }),
      })),
    } as any;
    const res = await runClueRegenPass({
      chapter: lateChapter,
      ledgerEntry: earlyLedger,
      bible,
      regen: makeRegenFn({ client }),
      clueDistribution: earlyClueDistribution,
    });
    expect(res.ran).toBe(true);
    expect(res.repaired).toContain("clue_clock");
    expect(res.unresolved).toEqual([]);
    // the clue now satisfies the early-placement check the deterministic floor keys off
    expect(chapterClueAppearsEarly(res.chapter.paragraphs, "clue_clock", earlyClueDistribution)).toBe(true);
    // the chapter opening was not replaced
    expect(res.chapter.paragraphs[0]).toBe(lateChapter.paragraphs[0]);
  });

  it("is a no-op (no LLM call) when the early clue is ALREADY early", async () => {
    const client = { chat: vi.fn() } as any;
    const earlyChapter: ProseChapter = {
      title: "Ch1",
      paragraphs: [
        "Clara saw at once that the mantel clock had been rewound; whoever staged the time of death had been careless.",
        ...lateChapter.paragraphs.slice(1, 7),
      ],
    };
    const res = await runClueRegenPass({
      chapter: earlyChapter,
      ledgerEntry: earlyLedger,
      bible,
      regen: makeRegenFn({ client }),
      clueDistribution: earlyClueDistribution,
    });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("is a no-op (no LLM call) for a late clue that is NOT required-early (placement mid)", async () => {
    const client = { chat: vi.fn() } as any;
    const midLedger: ChapterRequirementLedgerEntry = {
      ...earlyLedger,
      clueObligationContext: [
        { id: "clue_clock", description: "The mantel clock has been rewound.", placement: "mid" },
      ],
    };
    const midDistribution: any = {
      clues: [{ ...earlyClueDistribution.clues[0], placement: "mid" }],
    };
    const res = await runClueRegenPass({
      chapter: lateChapter,
      ledgerEntry: midLedger,
      bible,
      regen: makeRegenFn({ client }),
      clueDistribution: midDistribution,
    });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("reports unresolved (chapter untouched) when the regen still leaves the clue late — deterministic floor still applies", async () => {
    const onUnresolved = vi.fn();
    const client = {
      chat: vi.fn(async () => ({
        // originals preserved but the added mention is APPENDED — still outside the early window
        content: JSON.stringify({
          chapter: {
            title: "Ch1",
            paragraphs: [
              ...lateChapter.paragraphs,
              "She thought again of the rewound mantel clock before retiring for the night.",
            ],
          },
        }),
      })),
    } as any;
    const res = await runClueRegenPass({
      chapter: lateChapter,
      ledgerEntry: earlyLedger,
      bible,
      regen: makeRegenFn({ client }),
      clueDistribution: earlyClueDistribution,
      maxAttemptsPerDefect: 1,
      onUnresolved,
    });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toContain("clue_clock");
    expect(onUnresolved).toHaveBeenCalled();
    expect(res.chapter.paragraphs).toEqual(lateChapter.paragraphs); // original retained for the floor
  });
});

describe("runClearanceRegenPass — the A3/B7 replacement (P4)", () => {
  const chapter: ProseChapter = { title: "Ch5", paragraphs: ["The drawing room was tense.", "Evelyn studied the three of them."] };

  it("regenerates a witnessed clearance by ADDING a paragraph (no clearance present → ran)", async () => {
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({ chapter: { title: "Ch5", paragraphs: ["The drawing room was tense.", "Evelyn studied the three of them.", "Mallory had been seen in town by two witnesses all afternoon; he could not have been at the manor, and the alibi held."] } }),
      })),
    } as any;
    const res = await runClearanceRegenPass({
      chapter,
      chapterNumber: 5,
      suspectsNeedingClearance: ["Edward Mallory"],
      bible,
      regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(true);
    expect(res.repaired).toContain("Edward Mallory");
    expect(res.unresolved).toEqual([]);
  });

  it("is a no-op when the suspect is already cleared in-scene", async () => {
    const cleared: ProseChapter = {
      title: "Ch5",
      paragraphs: ["Edward Mallory was seen in town by two witnesses; his alibi held and he could not have done it."],
    };
    const client = { chat: vi.fn() } as any;
    const res = await runClearanceRegenPass({
      chapter: cleared,
      chapterNumber: 5,
      suspectsNeedingClearance: ["Edward Mallory"],
      bible,
      regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("rolls back a clearance regen that rewrites an existing paragraph", async () => {
    const client = {
      chat: vi.fn(async () => ({
        // drops "The drawing room was tense." — modifies existing content → rejected
        content: JSON.stringify({ chapter: { title: "Ch5", paragraphs: ["Evelyn studied the three of them.", "Mallory was cleared because two witnesses saw him in town."] } }),
      })),
    } as any;
    const res = await runClearanceRegenPass({
      chapter,
      chapterNumber: 5,
      suspectsNeedingClearance: ["Edward Mallory"],
      bible,
      regen: makeRegenFn({ client }),
      maxAttemptsPerDefect: 1,
    });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toContain("Edward Mallory");
  });
});

describe("runSuspectEliminationRegenPass — A_67 FIX-1(b) multi-chapter clearance regen", () => {
  const ch1: ProseChapter = { title: "Ch1", paragraphs: ["The manor settled into an uneasy quiet after the storm."] };
  const makeCh2 = (): ProseChapter => ({
    title: "Ch2",
    paragraphs: ["The drawing room was tense.", "Evelyn studied Edward Mallory across the table."],
  });

  it("dramatizes a clearance in the last chapter that names the suspect (ran + repaired); untouched chapters are preserved", async () => {
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: {
            title: "Ch2",
            paragraphs: [
              "The drawing room was tense.",
              "Evelyn studied Edward Mallory across the table.",
              "Two witnesses had seen Mallory in town all afternoon; his alibi held, and he could not have been at the manor.",
            ],
          },
        }),
      })),
    } as any;
    const res = await runSuspectEliminationRegenPass({
      chapters: [ch1, makeCh2()],
      suspects: ["Edward Mallory"],
      bible,
      regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(true);
    expect(res.repaired).toContain("Edward Mallory");
    expect(res.unresolved).toEqual([]);
    expect(res.chapters[0]).toEqual(ch1); // the non-target chapter is left exactly as-is
  });

  it("is a no-op (no LLM call) when every suspect is already cleared in-scene — the injector floor stays silent too", async () => {
    const cleared: ProseChapter = {
      title: "Ch2",
      paragraphs: ["Edward Mallory was seen in town by two witnesses; his alibi held and he could not have done it."],
    };
    const client = { chat: vi.fn() } as any;
    const res = await runSuspectEliminationRegenPass({
      chapters: [ch1, cleared],
      suspects: ["Edward Mallory"],
      bible,
      regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("returns the suspect UNRESOLVED (handed to the deterministic injector floor) when regen rewrites an existing paragraph", async () => {
    const client = {
      chat: vi.fn(async () => ({
        // drops the two original paragraphs → insertion-only guard rejects → unresolved
        content: JSON.stringify({
          chapter: { title: "Ch2", paragraphs: ["Mallory was cleared because two witnesses saw him in town."] },
        }),
      })),
    } as any;
    const res = await runSuspectEliminationRegenPass({
      chapters: [ch1, makeCh2()],
      suspects: ["Edward Mallory"],
      bible,
      regen: makeRegenFn({ client }),
      maxAttemptsPerDefect: 1,
    });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toContain("Edward Mallory");
  });

  // X29 (REVIEW_08 §7) — the pass targeted "the last chapter that names the suspect", falling back to
  // the final chapter, and the aftermath names everyone. That put a clearance in the one chapter whose
  // contract forbids one, so `aftermath_repeat` repaired it straight back out: on the 08-07 run ch9
  // shipped two of its eight paragraphs short. The reveal chapter is the ceiling.
  describe("X29 — a clearance may never land after the reveal", () => {
    const aftermath: ProseChapter = {
      title: "Ch3",
      paragraphs: ["The house was quiet again, and Edward Mallory left on the morning train."],
    };
    const clearanceReturn = (title: string, originals: string[]) => ({
      content: JSON.stringify({
        chapter: {
          title,
          paragraphs: [
            ...originals,
            "Two witnesses had seen Mallory in town all afternoon; his alibi held, and he could not have been at the manor.",
          ],
        },
      }),
    });

    it("targets the reveal chapter, not the later chapter that names the suspect", async () => {
      const ch2 = makeCh2();
      const client = { chat: vi.fn(async () => clearanceReturn("Ch2", ch2.paragraphs)) } as any;
      const res = await runSuspectEliminationRegenPass({
        chapters: [ch1, ch2, aftermath],
        suspects: ["Edward Mallory"],
        bible,
        regen: makeRegenFn({ client }),
        lastClearanceChapter: 2, // ch2 is the reveal; ch3 is aftermath
      });
      expect(res.repaired).toContain("Edward Mallory");
      expect(res.chapters[2]).toEqual(aftermath); // the aftermath is untouched
      expect((res.chapters[1].paragraphs ?? []).join(" ")).toMatch(/alibi held/);
    });

    it("falls back to the reveal chapter — not the final chapter — when no earlier chapter names them", async () => {
      const unnamed: ProseChapter = { title: "Ch2", paragraphs: ["The drawing room was tense."] };
      const client = { chat: vi.fn(async () => clearanceReturn("Ch2", unnamed.paragraphs)) } as any;
      const res = await runSuspectEliminationRegenPass({
        chapters: [ch1, unnamed, aftermath],
        suspects: ["Edward Mallory"],
        bible,
        regen: makeRegenFn({ client }),
        lastClearanceChapter: 2,
      });
      expect(res.chapters[2]).toEqual(aftermath);
      expect((res.chapters[1].paragraphs ?? []).join(" ")).toMatch(/alibi held/);
    });

    it("is unbounded when the argument is omitted — the pre-X29 behaviour, for callers without geometry", async () => {
      const client = { chat: vi.fn(async () => clearanceReturn("Ch3", aftermath.paragraphs)) } as any;
      const res = await runSuspectEliminationRegenPass({
        chapters: [ch1, makeCh2(), aftermath],
        suspects: ["Edward Mallory"],
        bible,
        regen: makeRegenFn({ client }),
      });
      expect(res.repaired).toContain("Edward Mallory");
      expect((res.chapters[2].paragraphs ?? []).join(" ")).toMatch(/alibi held/); // the last naming chapter
    });
  });
});

describe("runScaffoldRegenPass — RC1.2/RC1.3 endgame de-templating (P4)", () => {
  const scaffoldChapter: ProseChapter = {
    title: "Ch8",
    paragraphs: [
      "The library had gone very still.",
      "She weighed the timing, and the trail bent toward the gardener.",
    ],
  };

  it("is a no-op (no LLM call) when the chapter has no scaffold or report-style clearance", async () => {
    const client = { chat: vi.fn() } as any;
    const clean: ProseChapter = { title: "Ch8", paragraphs: ["Evelyn set the cold cup down and named the killer at last."] };
    const res = await runScaffoldRegenPass({ chapter: clean, chapterNumber: 8, bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("dramatizes a deductive-scaffold paragraph and reports it repaired", async () => {
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: {
            title: "Ch8",
            paragraphs: [
              "The library had gone very still.",
              "Evelyn turned the cold teacup in her hands until the gardener's eyes dropped to the floor.",
            ],
          },
        }),
      })),
    } as any;
    const res = await runScaffoldRegenPass({ chapter: scaffoldChapter, chapterNumber: 8, bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(true);
    expect(res.repaired.length).toBeGreaterThan(0);
    expect(res.unresolved).toEqual([]);
    // the flagged scaffold shape is gone from the shipped chapter
    expect(res.chapter.paragraphs.join(" ")).not.toMatch(/the trail bent toward/i);
  });

  it("dramatizes a report-style clearance ('X was cleared because …') into a witnessed deduction", async () => {
    const verdict: ProseChapter = {
      title: "Ch8",
      paragraphs: ["The drawing room waited.", "Beatrice was cleared because the timeline held."],
    };
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: {
            title: "Ch8",
            paragraphs: [
              "The drawing room waited.",
              '"I was scalding milk with Cook when the clock struck," Beatrice said, and Cook nodded that she had watched her do it.',
            ],
          },
        }),
      })),
    } as any;
    const res = await runScaffoldRegenPass({ chapter: verdict, chapterNumber: 8, bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(true);
    expect(res.repaired.length).toBeGreaterThan(0);
    expect(res.chapter.paragraphs.join(" ")).not.toMatch(/was cleared because/i);
  });

  it("ROLLS BACK a rewrite that drops a locked fact present in the original", async () => {
    const onUnresolved = vi.fn();
    const withFact: ProseChapter = {
      title: "Ch8",
      paragraphs: [
        "The clock had stopped at half past three.",
        "She weighed the timing, and the trail bent toward the gardener.",
      ],
    };
    const client = {
      chat: vi.fn(async () => ({
        // clears the scaffold but silently drops the locked value "half past three"
        content: JSON.stringify({
          chapter: {
            title: "Ch8",
            paragraphs: [
              "The clock had stopped.",
              "Evelyn turned the cold teacup until the gardener looked away.",
            ],
          },
        }),
      })),
    } as any;
    const res = await runScaffoldRegenPass({
      chapter: withFact,
      chapterNumber: 8,
      bible,
      regen: makeRegenFn({ client }),
      maxAttemptsPerDefect: 1,
      onUnresolved,
    });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved.length).toBeGreaterThan(0);
    expect(onUnresolved).toHaveBeenCalledWith(expect.anything(), expect.stringMatching(/dropped_locked_fact|lowered score/));
    expect(res.chapter.paragraphs.join(" ")).toMatch(/half past three/); // original retained
  });

  // ── A_64 §2 F3 — the exhaustion floor (the dv_clock_off / v_tide_enforce ship-time residual) ──

  // The A_64 §1.3 shipped sentence, verbatim (dv_clock_off ch10, call 48): the regen echoed it back
  // and the pass shipped it behind an invisible warning. The floor must de-template it while keeping
  // every fact value ("nine to ten PM", both names).
  const A3_SHIPPED =
    "By the time of the crime, the Alibi confirmed: nine to ten PM accounted for Beatrice Quill's movements elsewhere; Beatrice Quill could not have been responsible.";
  // The A_64 §1.4 shipped sentence, verbatim (v_tide_enforce ch10): the B5 injector template.
  const B5_SHIPPED =
    "Captain Ivor Hale was responsible, and the evidence placed the matter beyond all reasonable doubt.";

  it("FLOOR: de-templates the shipped A3 clearance sentence, preserving every fact value", () => {
    const chapter: ProseChapter = { title: "Ch10", paragraphs: ["The room held its breath.", A3_SHIPPED] };
    const { chapter: out, floored } = applyScaffoldExhaustionFloor(chapter);
    expect(floored).toEqual(["A3:accounted_for_movements"]);
    const text = out.paragraphs.join(" ");
    expect(detectScaffoldNotProse(text)).toEqual([]); // the ship-time recheck (facts.ts) cannot cap this
    expect(text).toContain("nine to ten PM"); // locked-fact value survives
    expect(text).toContain("placed Beatrice Quill elsewhere");
    expect(text).toContain("could not have been responsible"); // clearance meaning intact
  });

  it("FLOOR: de-templates the shipped B5 culprit-evidence sentence, keeping attribution AND evidence linkage", () => {
    const chapter: ProseChapter = { title: "Ch10", paragraphs: [B5_SHIPPED, "The tide had turned at last."] };
    const { chapter: out, floored } = applyScaffoldExhaustionFloor(chapter);
    expect(floored).toEqual(["B5:beyond_reasonable_doubt"]);
    const text = out.paragraphs.join(" ");
    expect(detectScaffoldNotProse(text)).toEqual([]);
    // A_80 item 3 — the floor now rewrites into the COMPLIANT in-scene form rather than into
    // "was responsible; the evidence allowed no other reading", which `injection-templates.ts`
    // already registers as generator residue and which external readers have quoted back four
    // times. The two properties this test exists to protect are unchanged and asserted directly:
    expect(text).toContain("Captain Ivor Hale"); // attribution kept
    // The culprit-evidence link, asserted as the PROPERTY rather than as the old sentence's wording.
    // agent9-run.ts:2494 records that this in-scene form "satisfies culpritEvidenceLinkInText and
    // trips no verdict-closer rule" — which is the whole reason it exists.
    expect(text).toMatch(/proof|evidence/i);
    expect(text).not.toMatch(/beyond all reasonable doubt/i);
    expect(text).not.toMatch(/allowed no other reading/i);
  });

  it("FLOOR: is a no-op on clean prose and on non-floored families (A1 stays watched, not rewritten)", () => {
    const clean: ProseChapter = { title: "Ch2", paragraphs: ["Evelyn crossed the wet lawn without a word."] };
    expect(applyScaffoldExhaustionFloor(clean)).toEqual({ chapter: clean, floored: [] });
    const a1: ProseChapter = { title: "Ch2", paragraphs: ["She weighed the timing, and the trail bent toward the gardener."] };
    const res = applyScaffoldExhaustionFloor(a1);
    expect(res.floored).toEqual([]);
    expect(res.chapter.paragraphs).toEqual(a1.paragraphs); // silent-sibling doctrine: only observed families floor
  });

  it("PASS TAIL: when the regen ECHOES the A3 template back (the dv_clock_off failure), the floor fires and the shipped chapter is detector-clean", async () => {
    const chapter: ProseChapter = { title: "Ch10", paragraphs: ["The room held its breath.", A3_SHIPPED] };
    const client = {
      // the model reproduces the flagged sentence verbatim — both attempts
      chat: vi.fn(async () => ({ content: JSON.stringify({ chapter }) })),
    } as any;
    const res = await runScaffoldRegenPass({
      chapter,
      chapterNumber: 10,
      bible,
      regen: makeRegenFn({ client }),
      maxAttemptsPerDefect: 1,
    });
    expect(res.ran).toBe(true);
    expect(res.unresolved.length).toBeGreaterThan(0); // the regen loop honestly failed…
    expect(res.floored).toEqual(["A3:accounted_for_movements"]); // …and the floor caught it
    const text = res.chapter.paragraphs.join(" ");
    expect(detectScaffoldNotProse(text)).toEqual([]);
    expect(text).toContain("nine to ten PM");
  });

  it("PASS TAIL: the floor does NOT fire when the regen genuinely dramatizes the scaffold", async () => {
    const chapter: ProseChapter = { title: "Ch10", paragraphs: ["The room held its breath.", A3_SHIPPED] };
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: {
            title: "Ch10",
            paragraphs: [
              "The room held its breath.",
              '"Nine to ten PM — I watched Beatrice Quill cross the yard myself," Cook said, and nobody doubted her.',
            ],
          },
        }),
      })),
    } as any;
    const res = await runScaffoldRegenPass({ chapter, chapterNumber: 10, bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(true);
    expect(res.floored).toEqual([]);
    expect(res.chapter.paragraphs.join(" ")).toContain("Cook said");
  });
});

describe("mechanism-detect — the single-source predicate the S8 pass and the rubric cap both key off", () => {
  const MECH = "The culprit rewound the mantel clock and reset the hands to fabricate the alibi timing.";
  const terms = deriveMechanismTerms(MECH);

  it("derives salient (≥5-char, non-stopword) mechanism terms", () => {
    expect(terms).toEqual(expect.arrayContaining(["culprit", "rewound", "mantel", "clock", "reset", "fabricate", "alibi", "timing"]));
    expect(terms).not.toContain("the"); // stopword
    expect(terms).not.toContain("and");
  });

  it("EXPLAINS when ≥50% terms co-occur AND a causal marker is present", () => {
    const explains = "Then she rewound the mantel clock and reset the hands to fabricate the alibi timing, so the culprit's scheme held.";
    expect(chapterFullyExplainsMechanism(explains.toLowerCase(), terms)).toBe(true);
  });

  it("does NOT explain when the chapter only NAMES mechanism nouns without the causal marker (legit clue-planting)", () => {
    const planted = "The mantel clock, its hands still, sat beside the culprit's chair; the alibi and the timing troubled her.";
    // ≥5 term hits but no explanation marker → must NOT trip
    expect(chapterFullyExplainsMechanism(planted.toLowerCase(), terms)).toBe(false);
  });

  it("mechanismExplanationParagraphIndex locates the paragraph that both hits terms and carries the marker", () => {
    const paras = [
      "The house was quiet in the small hours.",
      "Then she rewound the mantel clock and reset the hands to fabricate the alibi timing.",
    ];
    expect(mechanismExplanationParagraphIndex(paras, terms)).toBe(1);
    expect(mechanismExplanationParagraphIndex(["A quiet room.", "The clock sat on the mantel."], terms)).toBe(-1);
  });
});

describe("runMechanismRevealRegenPass — S8 mechanism-too-early de-spoiling (pre-scoring)", () => {
  const MECH = "The culprit rewound the mantel clock and reset the hands to fabricate the alibi timing.";
  const mechanismTerms = deriveMechanismTerms(MECH);

  it("is a no-op (no LLM call) when the chapter only plants the clue without explaining the method", async () => {
    const client = { chat: vi.fn() } as any;
    const planted: ProseChapter = {
      title: "Ch3",
      paragraphs: ["The mantel clock, its hands still, sat beside the culprit's chair; the alibi and the timing troubled her."],
    };
    const res = await runMechanismRevealRegenPass({ chapter: planted, chapterNumber: 3, mechanismTerms, bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("is a no-op when there are no mechanism terms (empty mechanism description)", async () => {
    const client = { chat: vi.fn() } as any;
    const explains: ProseChapter = {
      title: "Ch3",
      paragraphs: ["Then she rewound the mantel clock and reset the hands to fabricate the alibi timing, so the scheme held."],
    };
    const res = await runMechanismRevealRegenPass({ chapter: explains, chapterNumber: 3, mechanismTerms: [], bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("REWRITES a pre-test chapter that explains the method, withholding the causal clause, and reports it repaired", async () => {
    const explains: ProseChapter = {
      title: "Ch3",
      paragraphs: [
        "The house was quiet in the small hours.",
        "Then she rewound the mantel clock and reset the hands to fabricate the alibi timing, so the culprit's scheme held.",
      ],
    };
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: {
            title: "Ch3",
            paragraphs: [
              "The house was quiet in the small hours.",
              "The mantel clock had stopped; its hands lay still, and she noted the hour without another word.",
            ],
          },
        }),
      })),
    } as any;
    const res = await runMechanismRevealRegenPass({ chapter: explains, chapterNumber: 3, mechanismTerms, bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(true);
    expect(res.repaired).toEqual(["mechanism_ch3"]);
    expect(res.unresolved).toEqual([]);
    // the method explanation is gone; the physical clue (the clock) is still on the page
    expect(chapterFullyExplainsMechanism(res.chapter.paragraphs.join(" ").toLowerCase(), mechanismTerms)).toBe(false);
    expect(res.chapter.paragraphs.join(" ")).toMatch(/clock/i);
  });

  it("ROLLS BACK a rewrite that drops a locked fact present in the original (preservation guard)", async () => {
    const onUnresolved = vi.fn();
    const withFact: ProseChapter = {
      title: "Ch3",
      paragraphs: [
        "The clock had stopped at half past three.",
        "Then she rewound the mantel clock and reset the hands to fabricate the alibi timing, so the scheme held.",
      ],
    };
    const client = {
      chat: vi.fn(async () => ({
        // withholds the method BUT silently drops the locked value "half past three"
        content: JSON.stringify({
          chapter: {
            title: "Ch3",
            paragraphs: [
              "The clock had stopped.",
              "The mantel clock's hands lay still, and she noted the hour without a word.",
            ],
          },
        }),
      })),
    } as any;
    const res = await runMechanismRevealRegenPass({
      chapter: withFact,
      chapterNumber: 3,
      mechanismTerms,
      bible,
      regen: makeRegenFn({ client }),
      maxAttemptsPerDefect: 1,
      onUnresolved,
    });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved.length).toBeGreaterThan(0);
    expect(res.chapter.paragraphs.join(" ")).toMatch(/half past three/); // original retained
  });
});

describe("runVoiceLeakageRegenPass — RC5.3 enforce-with-repair (cross-speaker tic leakage)", () => {
  // Test oracle standing in for validateDialogueIdiolect (the worker injects the real one):
  // the tic counts as LEAKED while a James-attributed quote still carries Evelyn's signature phrase.
  const TIC = "mark my words";
  const JAMES_LEAK_RE = /"[^"]*mark my words[^"]*"\s*,?\s*(?:said|replied)\s+James/i;
  const leakedTics = (text: string): string[] => (JAMES_LEAK_RE.test(text) ? [TIC] : []);
  const leaks = [{ owner: "Evelyn Harcourt", speaker: "James Harcourt", tic: TIC }];

  it("is a no-op (no LLM call) when the tic only appears in its owner's mouth", async () => {
    const client = { chat: vi.fn() } as any;
    const clean: ProseChapter = {
      title: "Ch4",
      paragraphs: ['"Mark my words, the vicar lied," said Evelyn Harcourt.'],
    };
    const res = await runVoiceLeakageRegenPass({
      chapter: clean, chapterNumber: 4, leaks, bible, regen: makeRegenFn({ client }), leakedTics,
    });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("REWRITES the wrong speaker's line in their own idiom and reports it repaired", async () => {
    const leaking: ProseChapter = {
      title: "Ch4",
      paragraphs: [
        "The study smelled of cold ash.",
        '"Mark my words, the vicar lied," said James Harcourt.',
      ],
    };
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: {
            title: "Ch4",
            paragraphs: [
              "The study smelled of cold ash.",
              '"The vicar lied — I would stake the estate on it," said James Harcourt.',
            ],
          },
        }),
      })),
    } as any;
    const res = await runVoiceLeakageRegenPass({
      chapter: leaking, chapterNumber: 4, leaks, bible, regen: makeRegenFn({ client }), leakedTics,
    });
    expect(res.ran).toBe(true);
    expect(res.repaired).toEqual(["voice_leak_ch4_1"]);
    expect(res.unresolved).toEqual([]);
    // the leak is gone; James still speaks (the line was reworded, not deleted or reassigned)
    expect(leakedTics(res.chapter.paragraphs.join(" "))).toEqual([]);
    expect(res.chapter.paragraphs.join(" ")).toMatch(/said James Harcourt/);
  });

  it("ROLLS BACK a rewrite that clears the leak but drops a locked fact (preservation guard)", async () => {
    const onUnresolved = vi.fn();
    const withFact: ProseChapter = {
      title: "Ch4",
      paragraphs: [
        "The clock had stopped at half past three.",
        '"Mark my words, the vicar lied," said James Harcourt.',
      ],
    };
    const client = {
      chat: vi.fn(async () => ({
        // clears the tic BUT silently drops the locked value "half past three"
        content: JSON.stringify({
          chapter: {
            title: "Ch4",
            paragraphs: [
              "The clock had stopped.",
              '"The vicar lied," said James Harcourt.',
            ],
          },
        }),
      })),
    } as any;
    const res = await runVoiceLeakageRegenPass({
      chapter: withFact, chapterNumber: 4, leaks, bible, regen: makeRegenFn({ client }),
      leakedTics, maxAttemptsPerDefect: 1, onUnresolved,
    });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toEqual(["voice_leak_ch4_1"]);
    expect(onUnresolved).toHaveBeenCalled();
    expect(res.chapter.paragraphs.join(" ")).toMatch(/half past three/); // original retained
  });

  it("groups the SAME tic leaked into two mouths as one obligation naming both speakers", async () => {
    const doubleLeakRe = /"[^"]*mark my words[^"]*"\s*,?\s*(?:said|replied)\s+(?:James|Charles)/i;
    const doubleLeakedTics = (text: string): string[] => (doubleLeakRe.test(text) ? [TIC] : []);
    const leaking: ProseChapter = {
      title: "Ch5",
      paragraphs: [
        '"Mark my words, the gate was locked," said James Harcourt.',
        '"Mark my words indeed," replied Charles.',
      ],
    };
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: {
            title: "Ch5",
            paragraphs: [
              '"The gate was locked — depend upon it," said James Harcourt.',
              '"Depend upon it indeed," replied Charles.',
            ],
          },
        }),
      })),
    } as any;
    const res = await runVoiceLeakageRegenPass({
      chapter: leaking,
      chapterNumber: 5,
      leaks: [
        { owner: "Evelyn Harcourt", speaker: "James Harcourt", tic: TIC },
        { owner: "Evelyn Harcourt", speaker: "Charles", tic: TIC },
      ],
      bible,
      regen: makeRegenFn({ client }),
      leakedTics: doubleLeakedTics,
    });
    expect(res.ran).toBe(true);
    expect(res.repaired).toEqual(["voice_leak_ch5_1"]); // ONE grouped obligation, not two
    expect(client.chat).toHaveBeenCalledTimes(1);
  });
});

// ── A_64 §2 F1 — the shared culprit-evidence link predicate (the v_tide_enforce split-brain) ──

describe("culpritEvidenceLinkInText — ONE predicate for the RC1.4 regen pass and the B5 injector", () => {
  const CULPRIT = "Captain Ivor Hale";

  it("links on full name + culprit-term + evidence-term", () => {
    expect(
      culpritEvidenceLinkInText(CULPRIT, "Captain Ivor Hale was responsible because the evidence held."),
    ).toBe(true);
  });

  it("links on the capitalized surname with boundaries", () => {
    expect(culpritEvidenceLinkInText(CULPRIT, "Hale did it; the timeline proves it.")).toBe(true);
  });

  it("does NOT link on the lowercase common word ('hale and hearty' — the false-linked side of the split-brain)", () => {
    expect(
      culpritEvidenceLinkInText(CULPRIT, "They found him hale and hearty; the killer had left evidence behind."),
    ).toBe(false);
  });

  it("does NOT link on a substring inside another word ('Whitehall')", () => {
    expect(
      culpritEvidenceLinkInText(CULPRIT, "The Whitehall office held the killer's evidence file."),
    ).toBe(false);
  });

  it("links on a lowercase FULL name (case drift must not re-open the split)", () => {
    expect(
      culpritEvidenceLinkInText(CULPRIT, "captain ivor hale was the murderer, therefore the case closed."),
    ).toBe(true);
  });
});

// ── A_64 §2 — the 7.2 dual-value rewire: cap-scope detection + the ship-scope residual arm ──

describe("dual-value at SHIP scope — the 7.2 'enabled and silent' split-brain", () => {
  const pair = { values: ["ten past nine", "a quarter to eight"] as [string, string] };
  const crossChapter: any[] = [
    { title: "Chapter 1", paragraphs: ["The study was cold.", "The watch on the desk read ten past nine."] },
    { title: "Chapter 2", paragraphs: ["The tide tables gave a quarter to eight for the last crossing.", "Nobody spoke."] },
  ];

  it("assembleScoringChapterTexts mirrors the rubric's text (title + double-newline joins)", () => {
    const texts = assembleScoringChapterTexts(crossChapter);
    expect(texts[0]).toBe("Chapter 1\n\nThe study was cold.\n\nThe watch on the desk read ten past nine.");
    expect(texts).toHaveLength(2);
  });

  it("fires ACROSS a chapter boundary where the per-chapter lever is silent by construction", () => {
    expect(detectDualValueAtShipScope(crossChapter, pair)).toBe(true);
    // neither chapter alone carries both values — the per-chapter pass cannot see this
    for (const ch of crossChapter) {
      const t = (ch.paragraphs as string[]).join(" ").toLowerCase();
      expect(t.includes(pair.values[0]) && t.includes(pair.values[1])).toBe(false);
    }
  });

  it("stays silent when a contrast connective binds the pair", () => {
    const bound: any[] = [
      { title: "Chapter 1", paragraphs: ["The watch on the desk read ten past nine."] },
      { title: "Chapter 2", paragraphs: ["Yet the tide tables gave a quarter to eight — the watch could not be trusted."] },
    ];
    expect(detectDualValueAtShipScope(bound, pair)).toBe(false);
  });

  it("residual pass: no-op when the ship-scope detector is clear", async () => {
    const client = { chat: vi.fn() } as any;
    const bound: any[] = [
      { title: "Chapter 1", paragraphs: ["The watch on the desk read ten past nine."] },
      { title: "Chapter 2", paragraphs: ["Yet the tide tables gave a quarter to eight."] },
    ];
    const res = await runDualValueFullStoryResidualPass({
      chapters: bound, bible, pair, regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("residual pass: binds a cross-chapter pair when the regen adds the contrast (acceptance = the gate's own signal)", async () => {
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: {
            title: "Chapter 2",
            paragraphs: ["Yet the tide tables gave a quarter to eight for the last crossing — the watch could not be right.", "Nobody spoke."],
          },
        }),
      })),
    } as any;
    const res = await runDualValueFullStoryResidualPass({
      chapters: crossChapter.map((c) => ({ ...c })), bible, pair, regen: makeRegenFn({ client }),
    });
    expect(res.ran).toBe(true);
    expect(res.repaired).toBe(true);
    expect(detectDualValueAtShipScope(res.chapters, pair)).toBe(false); // the cap provably cannot fire
  });

  it("residual pass: an ECHO regen fails honestly (ran, not repaired) — the cap prediction warning path", async () => {
    const onUnresolved = vi.fn();
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({ chapter: { title: "Chapter 2", paragraphs: ["The tide tables gave a quarter to eight for the last crossing.", "Nobody spoke."] } }),
      })),
    } as any;
    const res = await runDualValueFullStoryResidualPass({
      chapters: crossChapter.map((c) => ({ ...c })), bible, pair, regen: makeRegenFn({ client }), onUnresolved,
    });
    expect(res.ran).toBe(true);
    expect(res.repaired).toBe(false);
    expect(onUnresolved).toHaveBeenCalled();
  });
});
