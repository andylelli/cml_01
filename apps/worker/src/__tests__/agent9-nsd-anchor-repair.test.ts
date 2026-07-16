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

  it("leaves the clue for the hard-stop when the regen cannot satisfy the gate matcher", async () => {
    // Regen adds text the ORACLE still rejects (mentions poison but never the victim).
    const regen = vi.fn(async (req: any) => ({
      ...req.chapter,
      paragraphs: [...(req.chapter.paragraphs ?? []), "A faint chemical smell — poison, perhaps."],
    }));
    const res = await repairUnanchoredNsdCluesBeforeGate({
      chapters,
      unanchoredClueIds: ["clue_core_contradiction_chain"],
      nsdTransferTrace: trace,
      cmlCase: {},
      clues,
      bible,
      regen,
      collectEvidence: stubCollect as any,
      maxAttemptsPerDefect: 1,
    });

    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toContain("clue_core_contradiction_chain");
    // the failed draft is not committed — originals stand
    expect(res.chapters[2].paragraphs).toEqual(chapters[2].paragraphs);
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
