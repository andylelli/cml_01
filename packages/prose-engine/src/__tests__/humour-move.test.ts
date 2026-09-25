/**
 * 17-hitting-90 P4.2 — a humour style reaches the writer as a move, never as the enum's label.
 */
import { describe, expect, it } from "vitest";

import { buildBrief } from "../brief.js";
import { buildContractCore } from "../contract.js";
import { HUMOUR_MOVE_PHRASES, humourMove } from "../humour-move.js";
import { loadArchive } from "./fixtures.js";

describe("the humour move", () => {
  it("KNOWN-POSITIVE: polite_savagery is a move, and the label is nowhere in it", () => {
    const move = humourMove("polite_savagery");
    expect(move).toMatch(/courteous/);
    expect(move).not.toMatch(/savagery/);
  });

  it("every enum value has a move that is a clause, not a name", () => {
    for (const style of ["understatement", "dry_wit", "polite_savagery", "self_deprecating", "observational", "deadpan", "sardonic", "blunt"]) {
      const move = humourMove(style);
      expect(move.split(/\s+/).length).toBeGreaterThan(5);
      expect(move).not.toContain(style.replace(/_/g, " "));
    }
    expect(HUMOUR_MOVE_PHRASES).toHaveLength(8);
  });

  it("an unknown style falls back to its own words", () => {
    expect(humourMove("gallows_humour")).toBe("gallows humour");
  });

  it("on the engine-pair case the brief carries Bertram's move and never the words 'polite savagery'", () => {
    const pair = loadArchive().find((p) => p.projectId === "canary_1790272530595");
    if (!pair) return;
    const core = buildContractCore(pair.input);
    const brief = buildBrief({ core, profiles: (pair.input.profiles?.profiles ?? []) as never, humourLevel: pair.input.humourLevel });
    expect(brief.text).not.toMatch(/polite savagery/i);
    expect(brief.text).toMatch(/Bertram Vance is funny in one way only: says the cruellest thing/);
  });
});
