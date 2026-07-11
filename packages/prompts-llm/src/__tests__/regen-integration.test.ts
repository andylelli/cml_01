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
  runScaffoldRegenPass,
  runMechanismRevealRegenPass,
} from "../agent9-prose/regen-integration.js";
import {
  deriveMechanismTerms,
  chapterFullyExplainsMechanism,
  mechanismExplanationParagraphIndex,
} from "../agent9-prose/mechanism-detect.js";
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
  it("scaffold → rewrite as grounded prose preserving the fact", () => {
    expect(instructionForDefect({ ...clueDefect, kind: "scaffold_not_prose" })).toMatch(/grounded in-scene prose/i);
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
