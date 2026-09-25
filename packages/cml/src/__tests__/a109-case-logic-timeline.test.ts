/**
 * ANALYSIS_109 M1 — the Simple Temporal Network and the case timeline built on it.
 *
 * Known-positives are hand-built contradictions of the shapes readers named; known-negatives are the
 * golden cases, whose verdicts were read by hand before they were pinned here (§10 of the analysis).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { analyseTimeline, buildCaseModel, classifyStatement, solveStn, summariseTimeline } from "../index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const golden = path.join(here, "..", "..", "..", "..", "eval", "golden");
const bundle = (id: string) => JSON.parse(fs.readFileSync(path.join(golden, `bundle-${id}.json`), "utf8")).artifacts;
const haveGolden = fs.existsSync(golden);

describe("the STN", () => {
  it("KNOWN-POSITIVE: last seen at 10:15, killed between 9:50 and 10:05 — the conflict names both", () => {
    const result = solveStn("Z", [
      { from: "Z", to: "act_start", min: 615, label: "last seen alive at a quarter past ten" },
      { from: "Z", to: "act_end", max: 605, label: "killed between ten to ten and five past ten" },
      { from: "act_start", to: "act_end", min: 0, label: "the act starts before it ends" },
    ]);
    expect(result.consistent).toBe(false);
    expect(result.conflict).toEqual(
      expect.arrayContaining(["last seen alive at a quarter past ten", "killed between ten to ten and five past ten"]),
    );
  });

  it("KNOWN-NEGATIVE: a satisfiable network gives the tightest bounds", () => {
    const result = solveStn("Z", [
      { from: "Z", to: "act_start", min: 375, label: "last seen at 6:15" },
      { from: "Z", to: "act_end", max: 450, label: "found at 7:30" },
      { from: "Z", to: "act_start", min: 360, max: 450, label: "window 6:00–7:30" },
      { from: "act_start", to: "act_end", min: 0, label: "order" },
    ]);
    expect(result.consistent).toBe(true);
    expect(result.bounds("act_start")).toEqual([375, 450]);
    expect(result.bounds("act_end")?.[1]).toBe(450);
  });
});

describe("classifying a statement", () => {
  it("claims stay out of the true network; discoveries, sightings alive and murder windows go in", () => {
    expect(classifyStatement("anchor_0", "Half past six: Hourglass indicates death time")).toBe("claim");
    expect(classifyStatement("anchor_1", "Half past seven: Body discovered")).toBe("discovery");
    expect(classifyStatement("anchor_2", "Quarter past six: Margaret Hensley last saw Lady Beatrice alive")).toBe("alive-at");
    expect(classifyStatement("window_0", "Between quarter past six and half past seven: Possible murder window")).toBe("act-window");
    expect(classifyStatement("window_1", "Between six and half past six: Edward Winthrope's alibi window")).toBe("context");
    expect(classifyStatement("apparent_time_of_death", "apparent time of death")).toBe("claim");
  });

  it("a scheduled six o'clock dinner is context, not a clock reading", () => {
    expect(classifyStatement("anchor_1", "Household dinner scheduled for six o'clock")).toBe("context");
    expect(classifyStatement("anchor_0", "Grandfather clock chimes quarter past five")).toBe("claim");
  });
});

describe.skipIf(!haveGolden)("the golden cases, verdicts read by hand (MEASURED 2026-09-25)", () => {
  const run = (id: string) => {
    const a = bundle(id);
    const model = buildCaseModel({ cml: a.cml, clues: a.clues });
    return { model, t: analyseTimeline(model) };
  };

  it("56049d93: act 6:15–7:30 from the window, the discovery and the last sighting; no innocent's alibi covers it", () => {
    const { model, t } = run("56049d93");
    expect(t.consistent).toBe(true);
    expect(summariseTimeline(t, model)).toContain("act 6:15–7:30");
    expect(t.innocents.filter((i) => i.coverage === "covers")).toEqual([]);
    expect(t.innocents.find((i) => i.name.includes("Hensley"))?.coverage).toBe("none");
  });

  it("6b91b4b1 and a5c017a1: one innocent covers, the rest partial", () => {
    for (const id of ["6b91b4b1", "a5c017a1"]) {
      const { t } = run(id);
      expect(t.act).not.toBeNull();
      expect(t.innocents.filter((i) => i.coverage === "covers")).toHaveLength(1);
      expect(t.innocents.some((i) => i.coverage === "partial")).toBe(true);
    }
  });

  it("eb1251aa: every time is a claim, so the act is not determinable and no alibi is judged", () => {
    const { model, t } = run("eb1251aa");
    expect(t.act).toBeNull();
    expect(summariseTimeline(t, model)).toContain("not determinable");
    expect(t.innocents.every((i) => i.coverage === "unknown")).toBe(true);
  });
});
