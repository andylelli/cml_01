/**
 * The boundary that has to hold, as a test.
 *
 * "It does not write or edit prose. Not one sentence, not one injected clause." (§3) The moment
 * geometry supplies prose it becomes the injector layer under a new name, and complaint #1 in every
 * external review returns. These assertions are what keep that from happening by accident.
 */

import { describe, expect, it } from "vitest";

import { deriveStoryGeometry } from "../derive.js";
import { buildGeometryChapterBlock, buildGeometryRunBlocks } from "../prompt.js";
import type { GeometryOutline } from "../types.js";

const OUTLINE: GeometryOutline = {
  acts: [
    {
      scenes: [
        { beat: "gathering" }, { beat: "crime" }, { beat: "first_enquiries" }, { beat: "motives" },
        { beat: "alibis" }, { beat: "false_solution" }, { beat: "secrets" }, { beat: "pattern" },
        { beat: "final_trap" }, { beat: "revelation" },
      ],
    },
  ],
};

const geometry = deriveStoryGeometry({
  cml: {
    CASE: {
      culpability: { culprits: ["Hugo Hale"] },
      death_method: "strangled",
      hidden_model: { mechanism: { actual_time_of_death: "10:15", apparent_time_of_death: "8:50" } },
      false_solution: { accused_suspect: "Eleanor Frey" },
    },
  },
  clues: [{ id: "c1", category: "physical", criticality: "essential", description: "a torn scrap of grey fabric", keyTerms: ["fabric"] }],
  narrative: OUTLINE,
});

describe("geometry prompt blocks", () => {
  it("emits the three run-stable blocks so they land in the cached prefix", () => {
    const keys = buildGeometryRunBlocks(geometry).map((b) => b.key);
    expect(keys).toEqual(["geometry_time", "geometry_clincher", "geometry_method"]);
  });

  it("states both times as the only two the manuscript may resolve to", () => {
    const time = buildGeometryRunBlocks(geometry).find((b) => b.key === "geometry_time");
    expect(time?.content).toContain("8:50");
    expect(time?.content).toContain("10:15");
    expect(time?.content).toMatch(/exactly two times/i);
  });

  it("gives the model the chapter's ROLE positively and never the prohibition", () => {
    const aftermath = geometry.chapterContract.find((c) => c.role === "aftermath")!;
    const block = buildGeometryChapterBlock(geometry, aftermath.chapter);
    expect(block?.content).toMatch(/consequence and reaction/);
    // The negative obligations exist on the contract and are enforced by the acceptance test —
    // naming them to the model raises the chance it produces them.
    for (const prohibition of aftermath.mustNotContain) {
      expect(block?.content).not.toContain(prohibition);
    }
  });

  it("returns nothing for a chapter the contract does not bind", () => {
    expect(buildGeometryChapterBlock(geometry, 4)).toBeNull();
  });


  it("supplies no quoted prose, in any block", () => {
    const all = [
      ...buildGeometryRunBlocks(geometry).map((b) => b.content),
      buildGeometryChapterBlock(geometry, 9)?.content ?? "",
      buildGeometryChapterBlock(geometry, 10)?.content ?? "",
    ].join("\n");
    // A quotation mark around a sentence is the signature of copy the model is meant to reuse.
    expect(all).not.toMatch(/[“"][A-Z][^"”]{25,}[.!?][”"]/);
  });
});

describe("§8.8 — geometry must not become a second clue channel", () => {
  const longClue = {
    id: "c_long",
    category: "physical",
    criticality: "essential",
    keyTerms: ["fabric"],
    description:
      "A torn scrap of grey herringbone wool, roughly two inches across, caught on the splintered edge of the terrace rail nearest the library door; it matches the weave of a gentleman's winter overcoat and carries a faint smell of pipe smoke.",
  };
  const withLongClue = deriveStoryGeometry({
    cml: {
      CASE: {
        culpability: { culprits: ["Hugo Hale"] },
        death_method: "strangled",
        hidden_model: { mechanism: { actual_time_of_death: "10:15", apparent_time_of_death: "8:50" } },
        false_solution: { accused_suspect: "Eleanor Frey" },
      },
    },
    clues: [longClue],
    narrative: OUTLINE,
  });

  it("keeps the full clue text on the object for the report", () => {
    expect(withLongClue.clincher?.trace).toBe(longClue.description);
  });

  it("but sends the prompt a short noun phrase, not the whole clue description", () => {
    const block = buildGeometryRunBlocks(withLongClue).find((b) => b.key === "geometry_clincher")!;
    expect(block.content).not.toContain("pipe smoke");
    expect(block.content).toMatch(/torn scrap of grey herringbone wool/);
    expect(block.content).toMatch(/already listed for you/);
  });

  it("caps the trace in the chapter contract too", () => {
    const reveal = withLongClue.chapterContract.find((c) => c.role === "reveal")!;
    expect(reveal.mustContain.join(" ")).not.toContain("pipe smoke");
  });
});
