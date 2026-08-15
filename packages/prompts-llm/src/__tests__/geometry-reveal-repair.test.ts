/**
 * N7 — the reveal repair, on a channel that may modify (REVIEW_08 §3, §8).
 *
 * THE FAILURE THIS PASS EXISTS FOR, from the 08-07 apply-mode run:
 *
 *     geometry regen UNRESOLVED in ch8: regen introduced: modified_or_dropped_original_paragraph:1  ×3
 *
 * `reveal_culprit_not_named@8` was correct, the model's answer was correct, and the channel rejected
 * it three times: `runInsertionRegenPass` forbids changing an existing paragraph, and a reveal is not
 * something a chapter can be given one more paragraph of.
 *
 * The first test is the whole thesis — ONE model reply, the two channels, opposite verdicts. The rest
 * pin the guards that replace insertion-only, because dropping a guard is how a modify channel turns
 * into the free whole-chapter rewrite that re-genders characters (repair.ts:153).
 */

import { describe, expect, it, vi } from "vitest";

import {
  runInsertionRegenPass,
  runRevealRepairRegenPass,
} from "../agent9-prose/regen-integration.js";
import type { ProseChapter } from "../agent9-prose/types.js";
import type { ProseDefect } from "../agent9-prose/regen-repair.js";

const BIBLE = {
  facts: [{ id: "clock", type: "atomic", value: "8:50", description: "the staged time" }],
  characters: [
    { name: "Hugo Hale", pronouns: "he/him", gender: "male" },
    { name: "Eleanor Frey", pronouns: "she/her", gender: "female" },
  ],
  culprits: ["Hugo Hale"],
  beatSheet: [],
} as any;

/** A reveal chapter that circles the disclosure and never makes it — the 08-07 shape. */
const UNDISCLOSING: ProseChapter = {
  chapterNumber: 8,
  title: "The Reveal",
  paragraphs: [
    "The library had gone very still, and the clock on the mantel still read 8:50.",
    "Eleanor set down the ledger and looked at the faces around the table, one after another, until the silence itself began to feel like an answer nobody wanted to give.",
    "Outside, the rain kept on against the glass, steady and indifferent to any of it.",
  ],
} as ProseChapter;

const DEFECT: ProseDefect = {
  chapter: 8,
  kind: "missing_resolution",
  detail: "Chapter 8 is the reveal and never names the culprit.",
  obligationRef: "geometry_reveal_culprit_not_named",
  severity: "hard",
};

/**
 * The stand-in for `validatorForCode` — the caller's REAL detector re-run. Here: does the chapter name
 * the culprit as guilty? (The run path substitutes the candidate into the manuscript and re-runs
 * `checkManuscriptGeometry`; the contract this pass depends on is the same either way.)
 */
const namesTheCulprit = (c: ProseChapter) => {
  const text = (c.paragraphs ?? []).join(" ");
  const ok = /Hugo Hale/.test(text) && /\b(killed|murdered|did it|guilty|responsible)\b/i.test(text);
  return { ok, score: ok ? 100 : 0, violations: ok ? [] : ["geometry:reveal_culprit_not_named"] };
};

/** What a model actually returns when told to name the killer: the closest paragraph, rewritten. */
const REWRITTEN = [
  UNDISCLOSING.paragraphs![0],
  "Eleanor set down the ledger. \"You wound the clock back yourself, Hugo, after he was already dead,\" she said. \"You killed him.\" Hugo Hale did not deny it, and the silence around the table turned into something else entirely as the others understood what she had just said.",
  UNDISCLOSING.paragraphs![2],
];

const args = (overrides: Record<string, unknown> = {}) => ({
  chapter: UNDISCLOSING,
  defects: [DEFECT],
  bible: BIBLE,
  regen: vi.fn(async () => ({ ...UNDISCLOSING, paragraphs: REWRITTEN })),
  presenceValidatorFor: () => namesTheCulprit,
  ...overrides,
});

describe("N7 — the reveal repair needs a channel that may modify", () => {
  it("the SAME reply the insertion channel rejects, the modify channel accepts", async () => {
    const reply = async () => ({ ...UNDISCLOSING, paragraphs: REWRITTEN });

    // The 08-07 behaviour, reproduced: the repair is correct and the guard throws it away.
    const insertion = await runInsertionRegenPass({
      chapter: UNDISCLOSING,
      defects: [DEFECT],
      bible: BIBLE,
      regen: vi.fn(reply) as any,
      presenceValidatorFor: () => namesTheCulprit,
      maxAttemptsPerDefect: 1,
    });
    expect(insertion.repaired).toEqual([]);
    expect(insertion.unresolved).toEqual(["geometry_reveal_culprit_not_named"]);
    expect(insertion.chapter.paragraphs).toEqual(UNDISCLOSING.paragraphs);

    // N7: same chapter, same defect, same reply — repaired.
    const modify = await runRevealRepairRegenPass(args({ regen: vi.fn(reply) }) as any);
    expect(modify.ran).toBe(true);
    expect(modify.repaired).toEqual(["geometry_reveal_culprit_not_named"]);
    expect(modify.unresolved).toEqual([]);
    expect(modify.chapter.paragraphs![1]).toMatch(/Hugo Hale did not deny it/);
    // Everything it was not asked to touch is still exactly itself.
    expect(modify.chapter.paragraphs![0]).toBe(UNDISCLOSING.paragraphs![0]);
    expect(modify.chapter.paragraphs![2]).toBe(UNDISCLOSING.paragraphs![2]);
  });

  it("does not run — and costs nothing — when there is no defect", async () => {
    const regen = vi.fn();
    const result = await runRevealRepairRegenPass(args({ defects: [], regen }) as any);
    expect(result.ran).toBe(false);
    expect(regen).not.toHaveBeenCalled();
  });

  it("tells the model the repair is NOT insertion-only, and what still may not move", async () => {
    const regen = vi.fn(async () => ({ ...UNDISCLOSING, paragraphs: REWRITTEN }));
    await runRevealRepairRegenPass(args({ regen }) as any);
    const instruction = String(regen.mock.calls[0][0].instruction);
    expect(instruction).toMatch(/MAY REWRITE/);
    expect(instruction).toMatch(/replace, never delete/);
    expect(instruction).toMatch(/locked-fact value/);
    // The shared per-kind instruction is still the head of it — this appends, it does not replace.
    expect(instruction).toMatch(/Render the resolution in-scene/);
  });

  // X35 — the N7 run's attempt 2 confessed to STRANGLING in a stabbing case, because nothing in the
  // message or the Bible slice ever told the model what the method was.
  it("names the case's death method, so the reveal cannot invent one", async () => {
    const regen = vi.fn(async () => ({ ...UNDISCLOSING, paragraphs: REWRITTEN }));
    await runRevealRepairRegenPass(
      args({ regen, deathMethod: "stabbed with a decorative letter opener" }) as any,
    );
    const instruction = String(regen.mock.calls[0][0].instruction);
    expect(instruction).toMatch(/stabbed with a decorative letter opener/);
    expect(instruction).toMatch(/never substitute another method/);
  });

  // X34/class-#5 — the writer and the gate must agree on scope, or the pass produces prose its own
  // detector cannot read, which is exactly how the 08-14 run wasted its repair.
  it("asks for the disclosure in the shape the detector can read (culprit named before the admission)", async () => {
    const regen = vi.fn(async () => ({ ...UNDISCLOSING, paragraphs: REWRITTEN }));
    await runRevealRepairRegenPass(args({ regen, culprit: "Hugo Hale" }) as any);
    const instruction = String(regen.mock.calls[0][0].instruction);
    expect(instruction).toMatch(/Hugo Hale is NAMED IN FULL in the paragraph BEFORE the moment of admission/);
    expect(instruction).toMatch(/keep other characters' names out of that paragraph/);
  });

  it("says nothing about method or naming when the caller supplies neither — no empty clauses", async () => {
    const regen = vi.fn(async () => ({ ...UNDISCLOSING, paragraphs: REWRITTEN }));
    await runRevealRepairRegenPass(args({ regen }) as any);
    const instruction = String(regen.mock.calls[0][0].instruction);
    expect(instruction).not.toMatch(/THE MURDER WAS COMMITTED BY/);
    expect(instruction).not.toMatch(/NAMED IN FULL/);
  });

  it("rejects a rewrite that drops a locked-fact value on the way past", async () => {
    const regen = vi.fn(async () => ({
      ...UNDISCLOSING,
      paragraphs: [
        "The library had gone very still, and nobody looked at the mantel clock at all.",
        REWRITTEN[1],
        UNDISCLOSING.paragraphs![2],
      ],
    }));
    const result = await runRevealRepairRegenPass(args({ regen, maxAttemptsPerDefect: 1 }) as any);
    expect(result.repaired).toEqual([]);
    expect(result.chapter.paragraphs).toEqual(UNDISCLOSING.paragraphs);
  });

  it("rejects a reveal delivered by deleting the scene around it (the length floor)", async () => {
    const regen = vi.fn(async () => ({
      ...UNDISCLOSING,
      paragraphs: ["The clock read 8:50. Hugo Hale had killed him."],
    }));
    const result = await runRevealRepairRegenPass(args({ regen, maxAttemptsPerDefect: 1 }) as any);
    expect(result.repaired).toEqual([]);
    expect(result.chapter.paragraphs).toEqual(UNDISCLOSING.paragraphs);
  });

  it("rejects a rewrite that fixes the reveal and breaks something else (no-regression guard)", async () => {
    const regen = vi.fn(async () => ({ ...UNDISCLOSING, paragraphs: REWRITTEN }));
    const result = await runRevealRepairRegenPass(
      args({
        regen,
        maxAttemptsPerDefect: 1,
        /**
         * What the run path passes, in miniature: the whole acceptance test re-run against a baseline
         * taken from the CURRENT manuscript, so it is clean on the chapter as it stands and dirty only
         * on what a candidate adds. That shape is load-bearing — `acceptanceReason` blocks on
         * violations NEW relative to `before`, so a guard that also fails on the original would be
         * carried in the baseline and block nothing at all.
         */
        noRegressionValidator: (c: ProseChapter) => {
          const changed = (c.paragraphs ?? []).join(" ") !== UNDISCLOSING.paragraphs!.join(" ");
          return {
            ok: !changed,
            score: changed ? 0 : 100,
            violations: changed ? ["geometry_introduced:unaccounted_time@8"] : [],
          };
        },
      }) as any,
    );
    expect(result.repaired).toEqual([]);
    expect(result.unresolved).toEqual(["geometry_reveal_culprit_not_named"]);
    expect(result.chapter.paragraphs).toEqual(UNDISCLOSING.paragraphs);
  });

  it("still fails the repair when the rewrite does not actually disclose — the detector is not bypassed", async () => {
    const regen = vi.fn(async () => ({
      ...UNDISCLOSING,
      paragraphs: [
        UNDISCLOSING.paragraphs![0],
        "Eleanor set down the ledger and said that the answer had been in front of them the whole evening, and that they would all see it soon enough for themselves.",
        UNDISCLOSING.paragraphs![2],
      ],
    }));
    const result = await runRevealRepairRegenPass(args({ regen, maxAttemptsPerDefect: 1 }) as any);
    expect(result.repaired).toEqual([]);
    expect(result.unresolved).toEqual(["geometry_reveal_culprit_not_named"]);
  });
});
