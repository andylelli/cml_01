/**
 * ANALYSIS_99 §10.2.1 — the role table, and the four archived shapes it has to get right.
 *
 * Each case below is a shape MEASURED in the outline archive, not an invention:
 *   - `…, final_trap, revelation` — the Golden-Age arc, 48 of 50 outlines end on the reveal scene;
 *   - `…, final_trap, revelation, revelation` — the commonest shape: the trap demonstrates, the
 *     first revelation names, the last is the aftermath. Reading the trap as the naming chapter is
 *     what took the first cut of this rule to 19 of 53 against v1;
 *   - `…, final_trap, final_trap, revelation` — 11 of 52 carry two traps (A_96 F10);
 *   - `…, revelation, revelation` — 21 of 52 duplicate the revelation beat, which is the
 *     reveal-then-aftermath shape and must not be relabelled (A_96 §5.7 #1: the first cut of the v1
 *     repair relabelled the FINAL scene of 23 of 65 outlines and un-made the aftermath chapter);
 *   - a chapter between the reveal and the aftermath — the two books where v2 disagrees with v1;
 *   - no beats at all — a non-Golden-Age arc still needs a reveal and an opening.
 *
 * Agreement with v1's live arbitration over the archive: 51 of 53
 * (`node scripts/probe-v2-role-agreement.mjs`), both disagreements asserted below by project id.
 */
import { describe, expect, it } from "vitest";

import { assignChapterRoles } from "../roles.js";

const outline = (beats: Array<string | null>, extra: Record<number, Record<string, unknown>> = {}) =>
  beats.map((beat, i) => ({
    sceneNumber: i + 1,
    act: i < 3 ? 1 : i < 8 ? 2 : 3,
    beat: beat ?? undefined,
    title: `Scene ${i + 1}`,
    purpose: "",
    summary: "",
    ...(extra[i + 1] ?? {}),
  }));

const GOLDEN = [
  "gathering",
  "crime",
  "first_enquiries",
  "motives",
  "alibis",
  "false_solution",
  "secrets",
  "pattern",
  "final_trap",
  "revelation",
];

describe("the Golden-Age arc", () => {
  const { roles, byChapter } = assignChapterRoles(outline(GOLDEN));

  it("the last scene is the aftermath, because an earlier scene carries the trap", () => {
    expect(roles.aftermath).toBe(10);
    expect(byChapter.get(10)).toBe("aftermath");
  });

  it("the reveal is the trap chapter, and it is never the aftermath", () => {
    expect(roles.reveal).toBe(9);
    expect(byChapter.get(9)).toBe("reveal");
    expect(roles.reveal).not.toBe(roles.aftermath);
  });

  it("with no test staged earlier, the reveal chapter is also the discriminating test", () => {
    expect(roles.discriminatingTest).toBe(9);
  });

  it("the false solution and the alibis scene take their own roles", () => {
    expect(roles.falseSolution).toBe(6);
    expect(byChapter.get(6)).toBe("false_solution");
    expect(roles.clearances).toContain(5);
    expect(byChapter.get(5)).toBe("clearances");
  });

  it("scene 1 is the opening and the rest are investigation", () => {
    expect(byChapter.get(1)).toBe("opening");
    expect(byChapter.get(3)).toBe("investigation");
    expect(byChapter.get(7)).toBe("investigation");
  });
});

describe("a `pattern` scene that stages a test takes the discriminating test", () => {
  it("moves the DT earlier, and the reveal stays at the trap", () => {
    const scenes = outline(GOLDEN, {
      8: { purpose: "Reconstruct the timeline and demonstrate the compass offset" },
    });
    const { roles, byChapter } = assignChapterRoles(scenes);
    expect(roles.discriminatingTest).toBe(8);
    expect(byChapter.get(8)).toBe("discriminating_test");
    expect(roles.reveal).toBe(9);
  });

  it("a `pattern` scene that merely reconstructs nothing does NOT take it", () => {
    const { roles } = assignChapterRoles(outline(GOLDEN, { 8: { purpose: "Uncover more ledger entries" } }));
    expect(roles.discriminatingTest).toBe(9);
  });
});

describe("two final_trap scenes: the LAST names, the first demonstrates", () => {
  /**
   * A_96 F10 measured that on run 50862 the prose confessed at the FIRST of two traps while v1's
   * contract said the second — so F10 moved the contract to the first. v2 does not need to: the two
   * chapters get DISJOINT contracts, and the culprit sits in the earlier one's `mustNotReveal` until
   * the naming chapter, which says where NOT to confess. v1 could not say that.
   */
  it("the trap pair splits into a demonstration and a naming", () => {
    const beats = [...GOLDEN];
    beats[8] = "final_trap";
    beats[7] = "final_trap"; // scenes 8 AND 9, run 50862's own shape
    const { roles } = assignChapterRoles(outline(beats));
    expect(roles.reveal).toBe(9);
    expect(roles.discriminatingTest).toBe(8);
    expect(roles.aftermath).toBe(10);
  });
});

describe("the two archived outlines where v2 deliberately disagrees with v1", () => {
  /**
   * MEASURED by `scripts/probe-v2-role-agreement.mjs`: agreement 51 of 53, and these are the two.
   * In both, the outline gives its final scene BOTH jobs — "Reveal … through confrontation; show
   * emotional and social aftermath" — so no scene is purely the reveal, and v1 resolves it by
   * putting the kill statement on the chapter whose purpose is "Officially clear all innocent
   * suspects". That is A_96 B6's defect from a new direction.
   */
  const shape = (ninth: string, ninthPurpose: string) =>
    outline(
      ["gathering", "crime", "first_enquiries", "motives", "alibis", "false_solution", "secrets", "final_trap", ninth, "revelation"],
      {
        8: { purpose: "Conduct the discriminating test linking the culprit uniquely to the crime" },
        9: { purpose: ninthPurpose },
        10: { purpose: "Reveal the culprit through confrontation with evidence; show emotional and social aftermath" },
      },
    );

  it("canary_1787390918999 — a second false_solution at 9 that clears the innocent", () => {
    const { roles, byChapter } = assignChapterRoles(
      shape("false_solution", "Officially clear all innocent suspects using alibis and evidence"),
    );
    expect(roles.reveal).toBe(8);
    expect(roles.aftermath).toBe(10);
    expect(byChapter.get(9)).toBe("clearances");
  });

  it("canary_1789583740167 (run 95041) — a `pattern` at 9 that reinforces innocence", () => {
    const { roles, byChapter } = assignChapterRoles(shape("pattern", "Reinforce innocence"));
    expect(roles.reveal).toBe(8);
    expect(byChapter.get(9)).toBe("clearances");
  });

  it("the chapter between the reveal and the aftermath is a CLOSURE chapter, never a second reveal", () => {
    const { roles, notes } = assignChapterRoles(shape("pattern", "Reinforce innocence"));
    expect(roles.clearances).toContain(9);
    expect(notes.join(" ")).toMatch(/owes closure/);
  });
});

describe("A_96 §5.7 #1 — a duplicated `revelation` is reveal-then-aftermath, and neither is relabelled", () => {
  it("the earlier revelation is the reveal and the last is the aftermath", () => {
    const beats = [...GOLDEN];
    beats[8] = "revelation"; // no final_trap anywhere
    const { roles, byChapter } = assignChapterRoles(outline(beats));
    expect(roles.aftermath).toBeNull(); // no earlier final_trap ⇒ the closing scene is the reveal
    expect(roles.reveal).toBe(10);
    expect(byChapter.get(9)).toBe("investigation");
  });

  it("THE DOMINANT ARC — trap, revelation, revelation: the middle one names and the last is aftermath", () => {
    // MEASURED: this is the commonest shape in the outline archive, and reading it as "the first
    // trap names" is what took the first cut of this rule to 19 of 53 (see the header).
    const beats = [...GOLDEN];
    beats[9] = "revelation";
    beats[8] = "revelation";
    beats[7] = "final_trap";
    const { roles } = assignChapterRoles(outline(beats));
    expect(roles.reveal).toBe(9);
    expect(roles.discriminatingTest).toBe(8);
    expect(roles.aftermath).toBe(10);
  });
});

describe("degenerate outlines still get a reveal", () => {
  it("no beats at all: the last scene reveals, scene 1 opens", () => {
    const { roles, byChapter } = assignChapterRoles(outline([null, null, null, null]));
    expect(roles.reveal).toBe(4);
    expect(roles.aftermath).toBeNull();
    expect(byChapter.get(1)).toBe("opening");
  });

  it("no scenes at all: chapter 1, and a note saying so", () => {
    const { roles, notes } = assignChapterRoles([]);
    expect(roles.reveal).toBe(1);
    expect(notes.join(" ")).toMatch(/no scenes/);
  });

  it("a one-scene outline is its own reveal", () => {
    const { roles } = assignChapterRoles(outline(["revelation"]));
    expect(roles.reveal).toBe(1);
    expect(roles.aftermath).toBeNull();
  });
});

describe("the invariants the rest of the engine relies on", () => {
  const shapes: Array<Array<string | null>> = [
    GOLDEN,
    [...GOLDEN.slice(0, 8), "final_trap", "revelation"],
    [...GOLDEN.slice(0, 9), "revelation"],
    ["gathering", "crime", "revelation"],
    [null, null, null],
    ["revelation", "revelation"],
    ["final_trap", "revelation"],
  ];

  it("exactly one reveal, at most one aftermath, and they are never the same chapter", () => {
    for (const shape of shapes) {
      const { roles, byChapter } = assignChapterRoles(outline(shape));
      const reveals = [...byChapter.values()].filter((r) => r === "reveal");
      const aftermaths = [...byChapter.values()].filter((r) => r === "aftermath");
      expect(reveals.length, shape.join(",")).toBe(1);
      expect(aftermaths.length, shape.join(",")).toBeLessThanOrEqual(1);
      if (roles.aftermath !== null) expect(roles.aftermath).not.toBe(roles.reveal);
    }
  });

  it("a clearance chapter is before the reveal, or a closure chapter between it and the aftermath", () => {
    for (const shape of shapes) {
      const { roles } = assignChapterRoles(outline(shape));
      for (const c of roles.clearances) {
        const label = `${shape.join(",")}: clearance ${c}, reveal ${roles.reveal}, aftermath ${roles.aftermath}`;
        // Never AT the reveal (the culprit is named there) and never the aftermath itself — those
        // are the two placements the reader has objected to.
        expect(c, label).not.toBe(roles.reveal);
        expect(c, label).not.toBe(roles.aftermath);
        if (c > roles.reveal && roles.aftermath !== null) expect(c, label).toBeLessThan(roles.aftermath);
      }
    }
  });
});
