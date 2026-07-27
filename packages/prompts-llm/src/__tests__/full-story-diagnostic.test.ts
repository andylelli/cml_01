import { afterEach, describe, expect, it } from "vitest";
import {
  anchorFullStoryFindings,
  applyFullStoryDiagnosticFindings,
  buildFullStoryDiagnosticPrompt,
  parseFullStoryFindings,
  resolveFullStoryDiagnosticMode,
  runFullStoryDiagnostic,
  type FullStoryFinding,
} from "../agent9-prose/full-story-diagnostic.js";
import type { ProseChapter } from "../agent9-prose/types.js";

// A_69 Increment 3 — whole-story READ-ONLY diagnostic → per-chapter guarded edit.
// The two things these tests exist to pin: an unanchored finding never reaches an edit, and a rewrite
// that drops a fact rolls back.

afterEach(() => {
  delete process.env.AGENT9_FULLSTORY_DIAGNOSTIC;
  delete process.env.AGENT9_MODEL_POLISH;
});

const filler = (n: number): string =>
  Array.from({ length: n }, (_, i) => `word${i}`).join(" ");

const CH1: ProseChapter = {
  title: "The Frozen Shadow",
  paragraphs: [
    "Inspector Wren stood at the sundial and counted the minutes. The shadow had not moved since ten past nine.",
    `He noted the hour of twenty minutes past ten and said nothing to Mrs Hale. ${filler(70)}`,
  ],
};

const CH2: ProseChapter = {
  title: "The Cold Plate",
  paragraphs: [
    "Mrs Hale poured the tea and did not look up. The copper plate was cold to the touch.",
    `Wren turned it over twice before he spoke. ${filler(70)}`,
  ],
};

const CH3: ProseChapter = {
  title: "The Naming",
  paragraphs: [
    "The drawing room was full and the fire had burned low. Wren named the culprit without raising his voice.",
    `Mrs Hale did not deny it. ${filler(70)}`,
  ],
};

const CHAPTERS = [CH1, CH2, CH3];
const LOCKED = ["twenty minutes past ten"];
const CAST = ["Wren", "Mrs Hale"];

const makeClient = (
  respond: (userContent: string, agent: string) => string,
  calls: { agent: string; model?: string }[] = [],
) =>
  ({
    chat: async (req: any) => {
      const userContent = String(req?.messages?.[1]?.content ?? "");
      calls.push({ agent: String(req?.logContext?.agent ?? ""), model: req?.model });
      return { content: respond(userContent, String(req?.logContext?.agent ?? "")), model: "test-model", latencyMs: 1 };
    },
  }) as any;

describe("resolveFullStoryDiagnosticMode", () => {
  it("defaults to off when unset", () => {
    expect(resolveFullStoryDiagnosticMode()).toBe("off");
  });

  it("maps shadow spellings to shadow", () => {
    for (const value of ["shadow", "SHADOW", " shadow "]) {
      process.env.AGENT9_FULLSTORY_DIAGNOSTIC = value;
      expect(resolveFullStoryDiagnosticMode()).toBe("shadow");
    }
  });

  // The deliberate asymmetry: a boolean must never start editing prose.
  it("maps true/1 to shadow, NOT apply", () => {
    for (const value of ["true", "1"]) {
      process.env.AGENT9_FULLSTORY_DIAGNOSTIC = value;
      expect(resolveFullStoryDiagnosticMode()).toBe("shadow");
    }
  });

  it("maps apply to apply", () => {
    process.env.AGENT9_FULLSTORY_DIAGNOSTIC = "apply";
    expect(resolveFullStoryDiagnosticMode()).toBe("apply");
  });

  it("treats an unrecognised value as off", () => {
    process.env.AGENT9_FULLSTORY_DIAGNOSTIC = "yes-please";
    expect(resolveFullStoryDiagnosticMode()).toBe("off");
  });
});

describe("parseFullStoryFindings", () => {
  const good = {
    chapter: 2,
    quote: "The copper plate was cold to the touch",
    findingClass: "motif_abandoned",
    note: "the plate never returns",
  };

  it("parses the object form", () => {
    const parsed = parseFullStoryFindings(JSON.stringify({ findings: [good] }));
    expect(parsed.findings).toHaveLength(1);
    expect(parsed.findings[0].findingClass).toBe("motif_abandoned");
    expect(parsed.malformed).toBe(0);
  });

  it("parses a bare array and a JSON blob wrapped in commentary", () => {
    expect(parseFullStoryFindings(JSON.stringify([good])).findings).toHaveLength(1);
    expect(parseFullStoryFindings(`Here you go:\n${JSON.stringify({ findings: [good] })}\nthanks`).findings)
      .toHaveLength(1);
  });

  it("accepts `class` as an alias for findingClass", () => {
    const { chapter, quote, note } = good;
    const parsed = parseFullStoryFindings(JSON.stringify({ findings: [{ chapter, quote, note, class: "flat_reveal" }] }));
    expect(parsed.findings[0].findingClass).toBe("flat_reveal");
  });

  it("drops entries outside the closed class enum", () => {
    const parsed = parseFullStoryFindings(
      JSON.stringify({ findings: [{ ...good, findingClass: "prose_is_bad" }] }),
    );
    expect(parsed.findings).toHaveLength(0);
    expect(parsed.malformed).toBe(1);
  });

  it("drops a too-short quote, a bad chapter number, and a non-object row", () => {
    const parsed = parseFullStoryFindings(
      JSON.stringify({
        findings: [
          { ...good, quote: "cold" },
          { ...good, chapter: 0 },
          { ...good, chapter: 1.5 },
          "not an object",
        ],
      }),
    );
    expect(parsed.findings).toHaveLength(0);
    expect(parsed.malformed).toBe(4);
  });

  it("never throws on unparseable input", () => {
    expect(parseFullStoryFindings("").findings).toEqual([]);
    expect(parseFullStoryFindings("total gibberish").findings).toEqual([]);
  });
});

describe("anchorFullStoryFindings", () => {
  const finding = (over: Partial<FullStoryFinding>): FullStoryFinding => ({
    chapter: 1,
    quote: "The shadow had not moved since ten past nine",
    findingClass: "pacing_drift",
    note: "n/a",
    ...over,
  });

  it("anchors a verbatim quote", () => {
    const { anchored, discarded } = anchorFullStoryFindings({ findings: [finding({})], chapters: CHAPTERS });
    expect(anchored).toHaveLength(1);
    expect(discarded).toHaveLength(0);
  });

  it("tolerates curly-quote, dash and whitespace drift in a re-typed quote", () => {
    const { anchored } = anchorFullStoryFindings({
      findings: [finding({ quote: "The  shadow   had not moved\nsince ten past nine" })],
      chapters: CHAPTERS,
    });
    expect(anchored).toHaveLength(1);
  });

  // The hallucination channel — this is the guard the whole increment rests on.
  it("discards a quote that appears nowhere", () => {
    const { anchored, discarded } = anchorFullStoryFindings({
      findings: [finding({ quote: "the clock tower struck thirteen" })],
      chapters: CHAPTERS,
    });
    expect(anchored).toHaveLength(0);
    expect(discarded).toHaveLength(1);
  });

  it("discards a real quote attributed to the wrong chapter", () => {
    const { anchored, discarded } = anchorFullStoryFindings({
      findings: [finding({ chapter: 3, quote: "The copper plate was cold to the touch" })],
      chapters: CHAPTERS,
    });
    expect(anchored).toHaveLength(0);
    expect(discarded).toHaveLength(1);
  });

  it("discards an out-of-range chapter", () => {
    const { discarded } = anchorFullStoryFindings({ findings: [finding({ chapter: 99 })], chapters: CHAPTERS });
    expect(discarded).toHaveLength(1);
  });
});

describe("buildFullStoryDiagnosticPrompt", () => {
  it("includes every chapter and forbids emitting prose", () => {
    const prompt = buildFullStoryDiagnosticPrompt({ chapters: CHAPTERS });
    expect(prompt).toContain("READ ONLY");
    expect(prompt).toMatch(/DO NOT rewrite/i);
    expect(prompt).toContain("CHAPTER 1");
    expect(prompt).toContain("CHAPTER 3");
    expect(prompt).toContain("The copper plate was cold to the touch");
  });
});

describe("runFullStoryDiagnostic", () => {
  it("makes no call when off", async () => {
    const calls: { agent: string }[] = [];
    const client = makeClient(() => "{}", calls);
    const result = await runFullStoryDiagnostic({ chapters: CHAPTERS, client, mode: "off" });
    expect(calls).toHaveLength(0);
    expect(result.findings).toEqual([]);
  });

  it("returns anchored findings and separates the unanchored ones", async () => {
    const payload = JSON.stringify({
      findings: [
        {
          chapter: 2,
          quote: "The copper plate was cold to the touch",
          findingClass: "motif_abandoned",
          note: "never returns",
        },
        {
          chapter: 1,
          quote: "a phrase the story never contains at all",
          findingClass: "flat_reveal",
          note: "hallucinated",
        },
      ],
    });
    const client = makeClient(() => payload);
    const result = await runFullStoryDiagnostic({ chapters: CHAPTERS, client, mode: "shadow" });
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].chapter).toBe(2);
    expect(result.discarded).toHaveLength(1);
    expect(result.failed).toBe(false);
  });

  it("routes through the polish tier when AGENT9_MODEL_POLISH is set", async () => {
    process.env.AGENT9_MODEL_POLISH = "frontier-strong";
    const calls: { agent: string; model?: string }[] = [];
    const client = makeClient(() => JSON.stringify({ findings: [] }), calls);
    await runFullStoryDiagnostic({ chapters: CHAPTERS, client, model: "prose-deploy", mode: "shadow" });
    expect(calls[0].agent).toBe("Agent9-FullStoryDiagnostic");
    expect(calls[0].model).toBe("frontier-strong");
  });

  it("reports failure instead of throwing when the call errors", async () => {
    const client = { chat: async () => { throw new Error("boom"); } } as any;
    const result = await runFullStoryDiagnostic({ chapters: CHAPTERS, client, mode: "shadow" });
    expect(result.failed).toBe(true);
    expect(result.findings).toEqual([]);
  });
});

describe("applyFullStoryDiagnosticFindings", () => {
  const finding = (chapter: number, quote: string): FullStoryFinding => ({
    chapter,
    quote,
    findingClass: "voice_inconsistency",
    note: "lift the register",
  });

  const rewriteOf = (chapter: ProseChapter, paragraphs: string[]) =>
    JSON.stringify({ status: "draft", chapters: [{ title: chapter.title, paragraphs }] });

  it("makes no call when there are no findings", async () => {
    const calls: { agent: string }[] = [];
    const client = makeClient(() => "{}", calls);
    const result = await applyFullStoryDiagnosticFindings({
      chapters: [...CHAPTERS], findings: [], client, lockedValues: LOCKED, castNames: CAST,
    });
    expect(calls).toHaveLength(0);
    expect(result.editedChapters).toEqual([]);
  });

  it("keeps a clean rewrite that preserves facts, names, numbers and length", async () => {
    const client = makeClient(() =>
      rewriteOf(CH2, [
        "Mrs Hale poured out the tea and kept her eyes down. The copper plate lay cold beneath his hand.",
        `Wren turned it over twice before he found his voice. ${filler(70)}`,
      ]),
    );
    const result = await applyFullStoryDiagnosticFindings({
      chapters: [...CHAPTERS],
      findings: [finding(2, "The copper plate was cold to the touch")],
      client,
      lockedValues: LOCKED,
      castNames: CAST,
    });
    expect(result.editedChapters).toEqual([2]);
    expect(result.rolledBackChapters).toEqual([]);
    expect(result.chapters[1].paragraphs[0]).toContain("kept her eyes down");
  });

  // The rollback guard: a rewrite that quietly drops a locked fact must never ship.
  it("rolls back a rewrite that drops a locked-fact value", async () => {
    const client = makeClient(() =>
      rewriteOf(CH1, [
        "Inspector Wren stood at the sundial and counted the minutes. The shadow had not moved since ten past nine.",
        `He noted the hour and said nothing to Mrs Hale. ${filler(70)}`,
      ]),
    );
    const original = [...CHAPTERS];
    const result = await applyFullStoryDiagnosticFindings({
      chapters: original,
      findings: [finding(1, "The shadow had not moved since ten past nine")],
      client,
      lockedValues: LOCKED,
      castNames: CAST,
    });
    expect(result.editedChapters).toEqual([]);
    expect(result.rolledBackChapters).toEqual([1]);
    expect(result.chapters[0]).toBe(CH1);
  });

  it("rolls back a rewrite that drops a cast name", async () => {
    const client = makeClient(() =>
      rewriteOf(CH2, [
        "She poured the tea and did not look up. The copper plate was cold to the touch.",
        `He turned it over twice before he spoke. ${filler(70)}`,
      ]),
    );
    const result = await applyFullStoryDiagnosticFindings({
      chapters: [...CHAPTERS],
      findings: [finding(2, "The copper plate was cold to the touch")],
      client,
      lockedValues: LOCKED,
      castNames: CAST,
    });
    expect(result.rolledBackChapters).toEqual([2]);
  });

  it("rolls back an unparseable response rather than dropping the chapter", async () => {
    const client = makeClient(() => "not json at all");
    const result = await applyFullStoryDiagnosticFindings({
      chapters: [...CHAPTERS],
      findings: [finding(2, "The copper plate was cold to the touch")],
      client,
      lockedValues: LOCKED,
      castNames: CAST,
    });
    expect(result.rolledBackChapters).toEqual([2]);
    expect(result.chapters[1]).toBe(CH2);
  });

  // Cost bound — a diagnostic that flags every chapter must not become a whole-story rewrite.
  it("edits at most maxChapters chapters, most-flagged first", async () => {
    const calls: { agent: string }[] = [];
    const client = makeClient((_user, agent) => {
      const n = Number(agent.replace(/^.*-Ch/, ""));
      const chapter = CHAPTERS[n - 1];
      return rewriteOf(chapter, chapter.paragraphs);
    }, calls);
    const result = await applyFullStoryDiagnosticFindings({
      chapters: [...CHAPTERS],
      findings: [
        finding(1, "The shadow had not moved since ten past nine"),
        finding(2, "The copper plate was cold to the touch"),
        finding(2, "Mrs Hale poured the tea and did not look up"),
        finding(3, "Wren named the culprit without raising his voice"),
      ],
      client,
      lockedValues: LOCKED,
      castNames: CAST,
      maxChapters: 1,
    });
    expect(calls).toHaveLength(1);
    // Chapter 2 carries two findings, so it wins the single slot.
    expect(calls[0].agent).toBe("Agent9-FullStoryDiagnosticRepair-Ch2");
    expect(result.editedChapters.concat(result.rolledBackChapters)).toEqual([2]);
  });
});
