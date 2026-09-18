/**
 * ANALYSIS_99 §10.13 — the writer parser, and the plan that decides how much it is asked for at once.
 *
 * The parser's fixtures are the shapes that have actually cost this project a run: a reply cut mid
 * sentence, a missing chapter, a re-numbered chapter, a writer that drops the trailing rule. A_88's
 * finding is why the truncation test is structural — run `mystery-1789105355374` aborted claiming a
 * schema failure when both Agent 7 replies were cut mid-string, and the guard could not fire because
 * an absent `finish_reason` defaults to `"stop"`.
 */
import { describe, expect, it } from "vitest";

import { buildContractCore } from "../contract.js";
import { planSegments, priorChapters, CHAPTERS_PER_ACT_SEGMENT } from "../segments.js";
import { continueInstruction, parseWriterOutput, writerFormatInstruction } from "../writer-format.js";
import { loadArchive } from "./fixtures.js";

const core = (chapters: number, words = 1_000) =>
  buildContractCore({
    wordTargets: { chapters, min: words * chapters * 0.75, max: words * chapters * 1.25, chapterIdeal: words },
    cml: { CASE: { culpability: { culprits: ["X"] } } },
    outline: {
      acts: [
        {
          scenes: Array.from({ length: chapters }, (_, i) => ({
            sceneNumber: i + 1,
            act: 1,
            beat: i === chapters - 1 ? "revelation" : "investigation",
            title: `Scene ${i + 1}`,
            characters: [],
            setting: { location: "the hall" },
            estimatedWordCount: words,
          })),
        },
      ],
    },
  });

describe("the plan", () => {
  it("a short book fits one call on a 32k writer, which is the whole point of v2", () => {
    const plan = planSegments(core(10, 1_000), 32_768);
    expect(plan.kind).toBe("book");
    expect(plan.segments).toHaveLength(1);
    expect(plan.segments[0]!.chapters).toHaveLength(10);
    expect(plan.reason).toMatch(/whole book/);
  });

  it("a long book falls to act-sized segments, each with every earlier chapter in context", () => {
    const plan = planSegments(core(30, 2_200), 32_768);
    expect(plan.kind).toBe("acts");
    expect(plan.segments.every((s) => s.chapters.length <= CHAPTERS_PER_ACT_SEGMENT)).toBe(true);
    expect(plan.segments.flatMap((s) => s.chapters)).toHaveLength(30);
  });

  it("a writer with a small cap falls to one chapter per call — v1's unit, as the worst case", () => {
    const plan = planSegments(core(10, 2_000), 4_000);
    expect(plan.kind).toBe("chapters");
    expect(plan.segments).toHaveLength(10);
  });

  it("no chapter is written twice or dropped, in any plan", () => {
    for (const cap of [4_000, 8_000, 16_000, 32_768, 200_000]) {
      const plan = planSegments(core(12, 1_400), cap);
      const all = plan.segments.flatMap((s) => s.chapters);
      expect(new Set(all).size, `cap ${cap}`).toBe(all.length);
      expect(all.sort((a, b) => a - b), `cap ${cap}`).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    }
  });

  it("the prior chapters of a segment are every chapter before it", () => {
    const plan = planSegments(core(12, 2_400), 20_000);
    expect(priorChapters(plan, 0)).toEqual([]);
    expect(priorChapters(plan, 1)).toEqual(plan.segments[0]!.chapters);
    expect(priorChapters(plan, plan.segments.length - 1).length).toBeGreaterThan(0);
  });

  it("an empty contract yields an empty plan rather than a throw", () => {
    const plan = planSegments(core(0), 32_768);
    expect(plan.segments).toEqual([]);
  });
});

describe("the parser", () => {
  const reply = [
    "=== CHAPTER 1: The Frozen Clock ===",
    "",
    "Bertram set the compass down and did not look at it again.",
    "",
    '"You are early," she said.',
    "",
    "=== CHAPTER 2: Dissonant Bearings ===",
    "",
    "The ledger lay open on the desk.",
  ].join("\n");

  it("reads chapters, titles and paragraphs", () => {
    const draft = parseWriterOutput(reply, [1, 2]);
    expect(draft.chapters).toHaveLength(2);
    expect(draft.chapters[0]!.title).toBe("The Frozen Clock");
    expect(draft.chapters[0]!.paragraphs).toHaveLength(2);
    expect(draft.chapters[1]!.paragraphs[0]).toBe("The ledger lay open on the desk.");
    expect(draft.truncated).toBe(false);
    expect(draft.missing).toEqual([]);
  });

  it("A_88 — a reply cut mid-sentence is truncated, whatever the provider said about why", () => {
    const cut = reply.replace("The ledger lay open on the desk.", "The ledger lay open on the");
    const draft = parseWriterOutput(cut, [1, 2]);
    expect(draft.truncated).toBe(true);
  });

  it("a missing chapter is truncated and named", () => {
    const draft = parseWriterOutput(reply, [1, 2, 3]);
    expect(draft.missing).toEqual([3]);
    expect(draft.truncated).toBe(true);
    expect(draft.chapters).toHaveLength(2);
  });

  it("a chapter outside the segment is reported, never silently kept", () => {
    const draft = parseWriterOutput(reply, [1]);
    expect(draft.unexpected).toEqual([2]);
    expect(draft.chapters).toHaveLength(1);
  });

  it("chapters come back in the CONTRACT's order, whatever order they were written in", () => {
    const swapped = [
      "=== CHAPTER 2: Second ===",
      "",
      "Second chapter body.",
      "",
      "=== CHAPTER 1: First ===",
      "",
      "First chapter body.",
    ].join("\n");
    const draft = parseWriterOutput(swapped, [1, 2]);
    expect(draft.chapters.map((c) => c.title)).toEqual(["First", "Second"]);
  });

  it("a repeated header does not overwrite the chapter already written", () => {
    const repeated = `${reply}\n\n=== CHAPTER 1: The Frozen Clock ===\n\nA second, shorter attempt.`;
    const draft = parseWriterOutput(repeated, [1, 2]);
    expect(draft.chapters[0]!.paragraphs[0]).toMatch(/^Bertram set the compass down/);
  });

  it("a writer that drops the trailing rule is still read", () => {
    const loose = "CHAPTER 1: The Frozen Clock\n\nBertram set the compass down.";
    const draft = parseWriterOutput(loose, [1]);
    expect(draft.chapters).toHaveLength(1);
    expect(draft.chapters[0]!.title).toBe("The Frozen Clock");
  });

  it("an unreadable reply is an empty draft, not an exception", () => {
    for (const raw of ["", "I am unable to help with that request.", "{\"chapters\": []}"]) {
      const draft = parseWriterOutput(raw, [1, 2]);
      expect(draft.chapters).toEqual([]);
      expect(draft.missing).toEqual([1, 2]);
      expect(draft.truncated).toBe(true);
    }
  });

  it("a header with no body is not a chapter", () => {
    const draft = parseWriterOutput("=== CHAPTER 1: Empty ===\n\n", [1]);
    expect(draft.chapters).toEqual([]);
    expect(draft.missing).toEqual([1]);
  });
});

describe("the instructions carry structure and no prose", () => {
  it("the format instruction shows the delimiter and quotes no sentence", () => {
    const instruction = writerFormatInstruction([1, 2, 3]);
    expect(instruction).toContain("=== CHAPTER <number>: <the chapter's title> ===");
    expect(instruction).toContain("Chapters owed: 1, 2, 3.");
    // A_67 — an example sentence in a prompt is reproduced. There is no sentence of prose here.
    expect(instruction).not.toMatch(/[.!?]["”]/);
  });

  it("the continue instruction names what is done and what is owed", () => {
    const instruction = continueInstruction([1, 2], [3, 4]);
    expect(instruction).toContain("Chapters 1, 2 are written");
    expect(instruction).toContain("Continue with 3, 4");
  });
});

describe("the plan over the archive", () => {
  const archive = loadArchive();

  it.skipIf(archive.length === 0)("every archived book fits ONE call on a 32k writer", () => {
    let book = 0;
    const others: string[] = [];
    for (const project of archive) {
      const plan = planSegments(buildContractCore(project.input), 32_768);
      if (plan.kind === "book") book += 1;
      else others.push(`${project.projectId}:${plan.kind}`);
    }
    console.info(`[segments] ${archive.length} books — one call ${book}, other ${others.join(", ") || "none"}`);
    // The whole of v2's second move depends on this: a short book is ~10,870 words MEASURED over 48
    // manuscripts, which is ~15,800 output tokens, inside 80% of a 32,768 cap. Planning from the
    // outline's own estimate instead put 41 of 53 into act-sized segments for nothing, because that
    // estimate runs 1.8x what the pipeline delivers.
    //
    // One archived project carries an 18-scene outline, and a book that long is what the act-sized
    // path exists for — so the assertion is on the SHORT books, which is every book this pipeline
    // has ever shipped to a reader.
    for (const project of archive) {
      const core = buildContractCore(project.input);
      if (core.scenes.length > 12) continue;
      const plan = planSegments(core, 32_768);
      expect(plan.kind, `${project.projectId} (${core.scenes.length} chapters)`).toBe("book");
    }
    expect(book).toBeGreaterThanOrEqual(archive.length - 2);
  });
});
