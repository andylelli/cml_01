import { describe, expect, it } from "vitest";
import { mutateThenValidate, allOf } from "../mutate.js";
import { generateWithBackstop, BestDraftTracker } from "../backstop.js";
import {
  checkContractFidelity,
  makeFidelityValidator,
  noMetadataDumpValidator,
  pronounConsistencyValidator,
  detectLocationMetadataDump,
  detectTemplateLeakage,
  countMisgenderedPronouns,
  revealsCulprit,
} from "../fidelity.js";
import { deriveChapterContracts } from "../contract.js";

// ───────────────────────────────────────────────────────────────────────────
// §3.2 REGRESSION GOLDEN — the grounding-lead leak (run_1d55f7c7)
// ───────────────────────────────────────────────────────────────────────────
describe("§3.2 golden — validation-gated mutation REVERTS the grounding-lead leak", () => {
  const cleanChapter =
    "The library had cooled by the time Gray returned to it. He stood a moment at the window, watching the rain bead and run.";
  // the buggy deterministic injector that shipped a location-metadata dump into the first line
  const buggyGroundingLead = (prose: string): string =>
    `Wynthorpe Manor - Library in a quiet tension underlies the cozy setting cast. ${prose}`;

  it("a clean opening that the injector would corrupt is kept untouched", () => {
    const outcome = mutateThenValidate(cleanChapter, buggyGroundingLead, noMetadataDumpValidator);
    expect(outcome.reverted).toBe(true);
    expect(outcome.applied).toBe(false);
    expect(outcome.value).toBe(cleanChapter); // the model's clean prose ships, not the dump
    expect(outcome.reason).toMatch(/location_metadata_dump/);
  });

  it("the dump is what the detector actually catches (and a clean opening is not)", () => {
    expect(detectLocationMetadataDump(buggyGroundingLead(cleanChapter))).toBe(true);
    expect(detectLocationMetadataDump(cleanChapter)).toBe(false);
  });

  it("detectTemplateLeakage catches the rubric's exact validation-text artifacts, not clean prose", () => {
    expect(detectTemplateLeakage("The chapter moves forward through vivid detail instead than recap.").length).toBeGreaterThan(0);
    expect(detectTemplateLeakage("The elapsed time was confirmed as forty minutes.").length).toBeGreaterThan(0);
    expect(detectTemplateLeakage("At Study, Early afternoon settled over the investigation.").length).toBeGreaterThan(0);
    expect(detectTemplateLeakage("Gray questioned the doctor Finch about the will.").length).toBeGreaterThan(0);
    expect(detectTemplateLeakage("Gray crossed to the window and watched the rain.")).toEqual([]);
  });

  it("a genuinely lossless mutation (it doesn't regress) IS allowed to ship", () => {
    const addTitle = (p: string): string => p.replace(/^/, ""); // no-op-ish, regresses nothing
    const outcome = mutateThenValidate(cleanChapter, addTitle, noMetadataDumpValidator);
    expect(outcome.applied).toBe(true);
    expect(outcome.reverted).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// §3.3 REGRESSION GOLDEN — the pronoun sweep flip (run_1d55f7c7)
// ───────────────────────────────────────────────────────────────────────────
describe("§3.3 golden — validation-gated mutation REVERTS the pronoun flip", () => {
  const correctFemale =
    "Mrs. Penn set down her cup. She had not slept, and her hands betrayed it; she folded them in her lap.";
  // the buggy cross-paragraph pronoun inheritance that flipped a correct female run to male
  const buggyPronounSweep = (prose: string): string =>
    prose.replace(/\bShe\b/g, "He").replace(/\bshe\b/g, "he").replace(/\bher\b/g, "his");

  it("a correct female pronoun run is NOT flipped to male", () => {
    const validator = pronounConsistencyValidator("female");
    const outcome = mutateThenValidate(correctFemale, buggyPronounSweep, validator);
    expect(outcome.reverted).toBe(true);
    expect(outcome.value).toBe(correctFemale); // we keep the model's correct pronouns
    expect(countMisgenderedPronouns(outcome.value, "female")).toBe(0);
  });

  it("the misgender counter actually rises under the buggy sweep (the regression it catches)", () => {
    expect(countMisgenderedPronouns(correctFemale, "female")).toBe(0);
    expect(countMisgenderedPronouns(buggyPronounSweep(correctFemale), "female")).toBeGreaterThan(0);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// §3.1 REGRESSION GOLDEN — the opener-exhaustion abort (ANALYSIS_44)
// ───────────────────────────────────────────────────────────────────────────
describe("§3.1 golden — the best-draft backstop guarantees a story (never aborts)", () => {
  it("a chapter that always trips a cosmetic 'repeated opener' check still ships the best draft", async () => {
    // every attempt produces readable prose that the old linter would hard-block forever
    const drafts = [
      "Inspector Gray crossed to the window. Inspector Gray studied the sill.",
      "Inspector Gray crossed to the window. He studied the sill, then the latch.",
      "Inspector Gray crossed to the window. He studied the sill, the latch, the frost.",
    ];
    const result = await generateWithBackstop<string>({
      maxAttempts: 3,
      generate: (attempt) => drafts[attempt - 1],
      score: (draft, attempt) => ({
        draft,
        // cosmetic linter "never converges"; score improves slightly each rewrite
        score: 50 + attempt,
        converged: false,
        complaints: ["paragraphs open on the inspector's name"],
      }),
    });
    expect(result.draft.length).toBeGreaterThan(0); // a story shipped — never empty
    expect(result.accepted).toBe("best_draft_backstop");
    expect(result.draft).toBe(drafts[2]); // the best-scored (last) draft
    expect(result.warnings[0]).toMatch(/never dies with no story/);
  });

  it("converged drafts stop early and are not flagged as a backstop ship", async () => {
    const result = await generateWithBackstop<string>({
      maxAttempts: 3,
      generate: () => "A clean, varied chapter that the critic is happy with.",
      score: (draft) => ({ draft, score: 95, converged: true }),
    });
    expect(result.accepted).toBe("converged");
    expect(result.attempts).toBe(1);
  });

  it("only an all-empty generator (a real upstream failure) throws — nothing to ship", async () => {
    await expect(
      generateWithBackstop<string>({ maxAttempts: 2, generate: () => "", score: (d) => ({ draft: d, score: 0, converged: false }) }),
    ).rejects.toThrow(/no non-empty draft/);
  });

  it("BestDraftTracker is monotone — a worse later draft never displaces a better one", () => {
    const t = new BestDraftTracker<string>();
    t.consider("good", 90, 1);
    t.consider("worse", 40, 2);
    expect(t.get()?.draft).toBe("good");
  });
});

// ───────────────────────────────────────────────────────────────────────────
// §4.1 the chapter-as-contract — derivation + machine-checkable fidelity
// ───────────────────────────────────────────────────────────────────────────
describe("§4.1 deriveChapterContracts — fair-play ordering falls out of the plan", () => {
  const scenes = [
    { chapter: 1, present: ["Gray", "Marlowe"], cluesRevealed: [{ id: "C1", keyTerms: ["stopped clock"] }] },
    { chapter: 2, present: ["Gray", "Mrs. Penn"], cluesRevealed: [{ id: "C7", keyTerms: ["scorched blotter"] }], eliminations: ["Mrs. Penn"] },
    { chapter: 3, present: ["Gray"], cluesRevealed: [{ id: "C11", keyTerms: ["cipher"] }] },
  ];
  const contracts = deriveChapterContracts(scenes, { culpritName: "Marlowe", revealChapter: 3 });

  it("a clue revealed later is must_not_reveal in every earlier chapter", () => {
    const ch1 = contracts.find((c) => c.chapter === 1)!;
    expect(ch1.must_not_reveal.clues.map((c) => c.clue)).toEqual(["C11", "C7"]); // both later clues hidden
    expect(ch1.must_surface.map((c) => c.clue)).toEqual(["C1"]);
  });

  it("the culprit is must_not_reveal until the reveal chapter", () => {
    expect(contracts.find((c) => c.chapter === 1)!.must_not_reveal.solution_culprit).toBe(true);
    expect(contracts.find((c) => c.chapter === 3)!.must_not_reveal.solution_culprit).toBe(false);
  });

  it("eliminations and present characters are carried onto the contract", () => {
    const ch2 = contracts.find((c) => c.chapter === 2)!;
    expect(ch2.eliminations_allowed).toEqual(["Mrs. Penn"]);
    expect(ch2.present).toContain("Mrs. Penn");
  });
});

describe("§4.1 checkContractFidelity — fidelity is a machine property (§6.4)", () => {
  const contract = deriveChapterContracts(
    [
      { chapter: 1, present: ["Gray"], cluesRevealed: [{ id: "C1", keyTerms: ["stopped clock"] }] },
      { chapter: 2, present: ["Gray"], cluesRevealed: [{ id: "C7", keyTerms: ["scorched blotter"] }] },
      { chapter: 3, cluesRevealed: [{ id: "C11", keyTerms: ["cipher"] }] },
    ],
    { culpritName: "Marlowe", revealChapter: 3 },
  ).find((c) => c.chapter === 2)!;

  it("passes prose that surfaces the chapter's clue and leaks nothing future", () => {
    const prose = "Gray turned the scorched blotter to the lamp. The pressed lines told their own story.";
    const r = checkContractFidelity(prose, contract, { culpritName: "Marlowe" });
    expect(r.ok).toBe(true);
    expect(r.surfaced).toEqual(["C7"]);
    expect(r.score).toBe(100);
  });

  it("FAILS (hard) when the chapter's required clue is missing", () => {
    const r = checkContractFidelity("Gray paced the study and learned nothing new.", contract, { culpritName: "Marlowe" });
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.kind === "missing_clue" && v.severity === "hard")).toBe(true);
  });

  it("FAILS (hard) when a future clue leaks early — the never-cosmetic property", () => {
    const prose = "Gray turned the scorched blotter to the lamp — and beside it lay the cipher, decades old.";
    const r = checkContractFidelity(prose, contract, { culpritName: "Marlowe" });
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.kind === "leaked_clue")).toBe(true);
  });

  it("FAILS (hard) when the culprit is unmasked before the reveal chapter", () => {
    const prose = "Gray turned the scorched blotter over. Marlowe was the killer; the blotter proved it.";
    const r = checkContractFidelity(prose, contract, { culpritName: "Marlowe" });
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.kind === "culprit_revealed")).toBe(true);
  });

  it("revealsCulprit is a tight heuristic (name near a guilt marker), not a bare name match", () => {
    expect(revealsCulprit("Marlowe was the killer.", "Marlowe")).toBe(true);
    expect(revealsCulprit("Marlowe poured the tea and said nothing.", "Marlowe")).toBe(false);
  });
});

describe("the two laws compose: a fidelity-gated mutation + the backstop", () => {
  it("makeFidelityValidator reverts a mutation that would leak a future clue", () => {
    const contract = deriveChapterContracts(
      [
        { chapter: 1, cluesRevealed: [{ id: "C1", keyTerms: ["stopped clock"] }] },
        { chapter: 2, cluesRevealed: [{ id: "C9", keyTerms: ["green ledger"] }] },
      ],
      { revealChapter: 2 },
    ).find((c) => c.chapter === 1)!;
    const validator = allOf(makeFidelityValidator(contract), noMetadataDumpValidator);
    const cleanCh1 = "The stopped clock on the mantel had not moved since the night of the storm.";
    const leakyEdit = (p: string): string => `${p} (See also the green ledger, which we should not mention yet.)`;
    const outcome = mutateThenValidate(cleanCh1, leakyEdit, validator);
    expect(outcome.reverted).toBe(true);
    expect(outcome.value).toBe(cleanCh1);
  });
});
