import { afterEach, describe, expect, it } from "vitest";
import { buildBookContract } from "@cml/prose-engine";
import { renderSceneContract } from "../jobs/agents/agent9-v2/run.js";

/**
 * Found by tracing the owner's read of mystery-1790960614933 (seed 82094) to the brief: chapter 10's contract put the
 * arrested culprit "On the page", and the writer had her tending the fire. With CML_VERIFIED_FIXES on, chapters
 * after the reveal leave the culprits off the page and say where they are.
 */
const scene = (n: number, beat: string, title: string) => ({
  sceneNumber: n, act: n < 3 ? 1 : 3, beat, title,
  characters: ["Bertram Norbury", "Nora Quayle", "Ada Pike"], setting: { location: "the office" },
});
const contract = buildBookContract({
  cml: {
    CASE: {
      culpability: { culprits: ["Nora Quayle"] },
      victim: { name: "Montague Gaunt" },
      cast: [
        { name: "Nora Quayle", role_archetype: "suspect" },
        { name: "Ada Pike", role_archetype: "suspect" },
        { name: "Bertram Norbury", role_archetype: "detective" },
        { name: "Montague Gaunt", role_archetype: "victim" },
      ],
      hidden_model: { mechanism: { description: "a compass held at a habitual tilt" } },
      prose_requirements: { clue_to_scene_mapping: [] },
    },
  },
  clues: { clues: [{ id: "clue_compass_tilt", observable: "the scuffed brass casing", description: "worn edge", criticality: "essential" }] },
  outline: { acts: [{ scenes: [scene(1, "gathering", "Arrival"), scene(2, "final_trap", "The Test"), scene(3, "revelation", "Named"), scene(4, "resolution", "After")] }] },
  cast: { characters: [{ name: "Nora Quayle" }, { name: "Ada Pike" }, { name: "Bertram Norbury" }, { name: "Montague Gaunt", role_archetype: "victim" }] },
  profiles: null, world: undefined, locations: undefined, temporal: undefined, setting: undefined,
  lockedFacts: [], humourLevel: "classic", primaryAxis: undefined, targetLength: "short",
});
const reveal = contract.roles.reveal;
const after = contract.scenes.map((s) => s.chapter).find((c) => c > reveal && contract.scenes.find((s) => s.chapter === c)!.present.includes("Nora Quayle"));
const onPage = (text: string) => text.split("\n").find((l) => l.trim().startsWith("On the page:")) ?? "";
afterEach(() => { delete process.env.CML_VERIFIED_FIXES; });

describe("the arrested culprit in the aftermath", () => {
  it("the fixture has a chapter after the reveal with the culprit present (known positive)", () => {
    expect(after).toBeDefined();
  });

  it("OFF: that chapter puts the culprit on the page (the defect, unchanged)", () => {
    expect(onPage(renderSceneContract(contract, after!))).toContain("Nora Quayle");
  });

  it("ON: it leaves the culprit off the page and says she is in custody; others stay", () => {
    process.env.CML_VERIFIED_FIXES = "1";
    const text = renderSceneContract(contract, after!);
    expect(onPage(text)).not.toContain("Nora Quayle");
    expect(onPage(text)).toContain("Ada Pike");
    expect(text).toContain(`Nora Quayle is in custody since chapter ${reveal}`);
  });

  it("ON: the reveal chapter itself still has the culprit on the page", () => {
    process.env.CML_VERIFIED_FIXES = "1";
    expect(onPage(renderSceneContract(contract, reveal))).toContain("Nora Quayle");
  });
});
