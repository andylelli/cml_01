/**
 * A_62 abort class #5 — repairUnanchoredNsdCluesBeforeGate.
 *
 * The defect (M1v5 run 1, mystery-1784238677818): the release gate hard-stopped on an ESSENTIAL
 * NSD-revealed clue with corrective_attempts: 0 — the gate enforces collectClueEvidenceFromProse
 * while the repair layers satisfy chapterMentionsRequiredClue (split-brain matchers), so nothing
 * upstream could ever repair what only the gate could see. The batch loop even DETECTED the gap
 * and papered over it with synthetic trace anchors.
 *
 * These tests pin the repair edge: the acceptance validator IS the injected gate matcher, a
 * successful plant clears the clue, a failed plant leaves it for the hard-stop, and optional /
 * empty inputs never burn an LLM call.
 */
import { describe, expect, it, vi } from "vitest";
import { repairUnanchoredNsdCluesBeforeGate } from "../jobs/agents/agent9-run.js";

const bible = { facts: [], characters: [], culprits: [], beatSheet: [] };

const clues = {
  clues: [
    {
      id: "clue_core_contradiction_chain",
      description: "The presence of poison indicates foul play in the victim's death.",
      observable: "Discovery of poison in the victim's system.",
      criticality: "essential",
    },
  ],
};

const trace = [
  { batch_start: 1, batch_end: 3, newly_revealed_clue_ids: ["clue_core_contradiction_chain"] },
];

const chapters = [
  { title: "Ch1", paragraphs: ["The house had gone quiet."] },
  { title: "Ch2", paragraphs: ["Evelyn read the letters twice."] },
  { title: "Ch3", paragraphs: ["The doctor arrived before the rain."] },
];

// A stub "gate matcher": a clue is visible iff a paragraph contains both 'poison' and 'victim'.
// The REAL matcher is injected at the call site; the helper must treat it as an oracle.
const stubCollect = (chs: any[]) => {
  const text = chs.map((c) => (c.paragraphs ?? []).join(" ")).join(" ").toLowerCase();
  const visible = text.includes("poison") && text.includes("victim");
  return { visibleClueIds: visible ? ["clue_core_contradiction_chain"] : [] };
};

describe("repairUnanchoredNsdCluesBeforeGate — A_62 class #5", () => {
  it("plants the clue in the NSD step's chapter and the GATE matcher accepts it", async () => {
    const regen = vi.fn(async (req: any) => ({
      ...req.chapter,
      paragraphs: [
        ...(req.chapter.paragraphs ?? []),
        "Evelyn held the vial to the lamp: poison, unmistakably, in the victim's system.",
      ],
    }));
    const notes: string[] = [];
    const res = await repairUnanchoredNsdCluesBeforeGate({
      chapters,
      unanchoredClueIds: ["clue_core_contradiction_chain"],
      nsdTransferTrace: trace,
      cmlCase: {},
      clues,
      bible,
      regen,
      collectEvidence: stubCollect as any,
      onNote: (m) => notes.push(m),
    });

    expect(res.repaired).toEqual(["clue_core_contradiction_chain"]);
    expect(res.unresolved).toEqual([]);
    // planted into ch3 — the batch_end of the NSD step that claimed the reveal
    expect(res.chapters[2].paragraphs.join(" ")).toMatch(/poison/);
    // originals preserved (insertion-only — the repair.ts:153 lesson)
    expect(res.chapters[0].paragraphs).toEqual(chapters[0].paragraphs);
    expect(res.chapters[2].paragraphs[0]).toBe("The doctor arrived before the rain.");
    // the residual (post-story-validation plant) is logged, never silent
    expect(notes.join(" ")).toMatch(/A_62 class #5 residual/);
  });

  it("regen that cannot satisfy the matcher is rescued by the class-#13 deterministic floor", async () => {
    // Regen adds text the ORACLE still rejects (mentions poison but never the victim). Pre-class-#13
    // this was a certain hard-stop; now the deterministic floor plants the observable verbatim and
    // the SAME oracle accepts it.
    const regen = vi.fn(async (req: any) => ({
      ...req.chapter,
      paragraphs: [...(req.chapter.paragraphs ?? []), "A faint chemical smell — poison, perhaps."],
    }));
    const res = await repairUnanchoredNsdCluesBeforeGate({
      chapters: JSON.parse(JSON.stringify(chapters)),
      unanchoredClueIds: ["clue_core_contradiction_chain"],
      nsdTransferTrace: trace,
      cmlCase: {},
      clues,
      bible,
      regen,
      collectEvidence: stubCollect as any,
      maxAttemptsPerDefect: 1,
    });

    expect(res.repaired).toContain("clue_core_contradiction_chain");
    expect(res.unresolved).toEqual([]);
    expect(res.chapters[2].paragraphs.join(" ")).toContain("The record now held one further detail");
  });

  it("is a no-op with NO regen call when nothing is unanchored", async () => {
    const regen = vi.fn();
    const res = await repairUnanchoredNsdCluesBeforeGate({
      chapters,
      unanchoredClueIds: [],
      nsdTransferTrace: trace,
      cmlCase: {},
      clues,
      bible,
      regen,
      collectEvidence: stubCollect as any,
    });
    expect(regen).not.toHaveBeenCalled();
    expect(res.repaired).toEqual([]);
  });

  it("falls back to an early chapter when no NSD step claims the clue", async () => {
    const seen: number[] = [];
    const regen = vi.fn(async (req: any) => {
      seen.push(req.defect?.chapter ?? -1);
      return {
        ...req.chapter,
        paragraphs: [...(req.chapter.paragraphs ?? []), "Poison had reached the victim, she was sure."],
      };
    });
    await repairUnanchoredNsdCluesBeforeGate({
      chapters,
      unanchoredClueIds: ["clue_core_contradiction_chain"],
      nsdTransferTrace: [], // no step claims it
      cmlCase: {},
      clues,
      bible,
      regen,
      collectEvidence: stubCollect as any,
    });
    expect(seen).toEqual([2]); // early-chapter fallback, never out of range
  });
});

// Abort class #12 (P5-DV poison, mystery-1784570276364): a round-1 plant was accepted by the
// matcher, then the post-processing chain rewrote it and the gate's re-collect missed — the caller
// now runs a second round whose regen instruction carries an impersonal-phrasing suffix. This pins
// the suffix plumbing: round-2 defects must carry it verbatim into the regen request.
describe("repairUnanchoredNsdCluesBeforeGate — class #12 detailSuffix", () => {
  it("appends detailSuffix to the regen instruction when provided", async () => {
    const seen: string[] = [];
    const regen = vi.fn(async (req: any) => {
      seen.push(String(req.instruction ?? ""));
      return {
        ...req.chapter,
        paragraphs: [...(req.chapter.paragraphs ?? []), "poison traces marked the victim's glass."],
      };
    });
    await repairUnanchoredNsdCluesBeforeGate({
      chapters,
      unanchoredClueIds: ["clue_core_contradiction_chain"],
      nsdTransferTrace: trace,
      cmlCase: {},
      clues,
      bible,
      regen: regen as any,
      collectEvidence: stubCollect as any,
      detailSuffix: " Do NOT name any person.",
    });
    expect(seen.length).toBeGreaterThan(0);
    expect(seen.every((d) => d.endsWith(" Do NOT name any person."))).toBe(true);
  });

  it("omits the suffix when not provided", async () => {
    const seen: string[] = [];
    const regen = vi.fn(async (req: any) => {
      seen.push(String(req.instruction ?? ""));
      return {
        ...req.chapter,
        paragraphs: [...(req.chapter.paragraphs ?? []), "poison traces marked the victim's glass."],
      };
    });
    await repairUnanchoredNsdCluesBeforeGate({
      chapters,
      unanchoredClueIds: ["clue_core_contradiction_chain"],
      nsdTransferTrace: trace,
      cmlCase: {},
      clues,
      bible,
      regen: regen as any,
      collectEvidence: stubCollect as any,
    });
    expect(seen.length).toBeGreaterThan(0);
    expect(seen.every((d) => !d.includes("Do NOT name any person"))).toBe(true);
  });
});

// Abort class #13 (P5-DV tide_on, mystery-1784576986525): the Azure content filter starved the
// anchor regen — every attempt errored, zero candidates — and the hard-stop was certain. The
// deterministic floor appends a neutral-subject paragraph carrying the clue observable and clears
// the id iff THE GATE'S OWN matcher accepts it.
describe("repairUnanchoredNsdCluesBeforeGate — class #13 deterministic floor", () => {
  it("starved regen (throws every attempt) falls back to the deterministic plant and the matcher accepts", async () => {
    const regen = vi.fn(async () => { throw new Error("content filter"); });
    const notes: string[] = [];
    const res = await repairUnanchoredNsdCluesBeforeGate({
      chapters: JSON.parse(JSON.stringify(chapters)),
      unanchoredClueIds: ["clue_core_contradiction_chain"],
      nsdTransferTrace: trace,
      cmlCase: {},
      clues,
      bible,
      regen: regen as any,
      collectEvidence: stubCollect as any,
      onNote: (m) => notes.push(m),
    });
    expect(res.repaired).toContain("clue_core_contradiction_chain");
    expect(res.unresolved).toEqual([]);
    const planted = res.chapters.flatMap((c: any) => c.paragraphs ?? []).join(" ");
    expect(planted).toContain("The record now held one further detail");
    expect(planted).toContain("Discovery of poison in the victim's system");
    expect(notes.some((n) => n.includes("DETERMINISTIC floor planted"))).toBe(true);
  });

  it("floor that the matcher rejects leaves the id unresolved (hard-stop stands, honestly)", async () => {
    const regen = vi.fn(async () => { throw new Error("content filter"); });
    const neverMatch = () => ({ visibleClueIds: [] });
    const res = await repairUnanchoredNsdCluesBeforeGate({
      chapters: JSON.parse(JSON.stringify(chapters)),
      unanchoredClueIds: ["clue_core_contradiction_chain"],
      nsdTransferTrace: trace,
      cmlCase: {},
      clues,
      bible,
      regen: regen as any,
      collectEvidence: neverMatch as any,
    });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toContain("clue_core_contradiction_chain");
  });

  it("clue with no observable/description text stays unresolved rather than planting an empty line", async () => {
    const regen = vi.fn(async () => { throw new Error("content filter"); });
    const bareClues = { clues: [{ id: "clue_bare", criticality: "essential" }] };
    const bareTrace = [{ batch_start: 1, batch_end: 2, newly_revealed_clue_ids: ["clue_bare"] }];
    const res = await repairUnanchoredNsdCluesBeforeGate({
      chapters: JSON.parse(JSON.stringify(chapters)),
      unanchoredClueIds: ["clue_bare"],
      nsdTransferTrace: bareTrace,
      cmlCase: {},
      clues: bareClues,
      bible,
      regen: regen as any,
      collectEvidence: (() => ({ visibleClueIds: [] })) as any,
    });
    expect(res.unresolved).toContain("clue_bare");
    const text = res.chapters.flatMap((c: any) => c.paragraphs ?? []).join(" ");
    expect(text).not.toContain("set down without comment: .");
  });
});
