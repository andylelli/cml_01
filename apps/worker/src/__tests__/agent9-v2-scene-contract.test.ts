/**
 * What a chapter is TOLD, read back from the text the writer receives.
 *
 * The brief states the reveal and the length operations once for the whole book. A continuation
 * writing chapter 9 has that brief twenty thousand tokens behind it and this contract in front.
 * MEASURED: three of four v2 books named the culprit and never stated the act.
 */
import { describe, expect, it } from "vitest";
import { buildBookContract } from "@cml/prose-engine";

import { renderSceneContract } from "../jobs/agents/agent9-v2/run.js";

const contract = buildBookContract({
  cml: {
    CASE: {
      culpability: { culprits: ["Nora Quayle"] },
      victim: { name: "Montague Gaunt" },
      cast: [
        { name: "Nora Quayle", role_archetype: "suspect" },
        { name: "Bertram Norbury", role_archetype: "detective" },
        { name: "Montague Gaunt", role_archetype: "victim" },
      ],
      hidden_model: { mechanism: { description: "a compass held at a habitual tilt" } },
      prose_requirements: { clue_to_scene_mapping: [] },
    },
  },
  clues: { clues: [{ id: "clue_compass_tilt", observable: "the scuffed brass casing", description: "worn edge", criticality: "essential" }] },
  outline: {
    acts: [
      {
        scenes: [
          // The victim is IN chapter 1, as seed 50862's outline has him — the case the body rule exists for.
          { sceneNumber: 1, act: 1, beat: "gathering", title: "Arrival", characters: ["Bertram Norbury", "Montague Gaunt"], setting: { location: "the office" }, cluesRevealed: ["clue_compass_tilt"] },
          { sceneNumber: 2, act: 2, beat: "final_trap", title: "The Test", characters: ["Bertram Norbury"], setting: { location: "the dunes" } },
          { sceneNumber: 3, act: 3, beat: "revelation", title: "After", characters: ["Bertram Norbury"], setting: { location: "the promenade" } },
        ],
      },
    ],
  },
  cast: { characters: [{ name: "Nora Quayle" }, { name: "Bertram Norbury" }, { name: "Montague Gaunt", role_archetype: "victim" }] },
  profiles: null,
  world: undefined,
  locations: undefined,
  temporal: undefined,
  setting: undefined,
  lockedFacts: [],
  humourLevel: "classic",
  primaryAxis: undefined,
  targetLength: "short",
});

describe("what the reads of 2026-09-22 found in the contract", () => {
  it("KNOWN-POSITIVE: the victim is the body, never on the page among the living", () => {
    const text = renderSceneContract(contract, 1);
    expect(text).toMatch(/The body: Montague Gaunt/);
    expect(text).not.toMatch(/On the page:.*Montague Gaunt/);
  });

  it("the wit line names nobody's move by its label", () => {
    for (const scene of contract.scenes) {
      const text = renderSceneContract(contract, scene.chapter);
      expect(text).not.toMatch(/flat answer|short retort|unmeant joke/);
    }
  });

  it("an aftermath chapter whose outline title announces the reveal is titled by the writer", () => {
    const aftermath = contract.roles.aftermath;
    if (aftermath === null) return;
    const scene = contract.scenes.find((s) => s.chapter === aftermath)!;
    const mislabelled = { ...contract, scenes: contract.scenes.map((s) => (s === scene ? { ...s, title: "The Culprit Revealed" } : s)) };
    const text = renderSceneContract(mislabelled, aftermath);
    expect(text).toMatch(/your own title: this chapter is the aftermath/);
    expect(text).not.toMatch(/The Culprit Revealed/);
  });
});

describe("the per-chapter contract carries the operations the book missed", () => {
  it("KNOWN-POSITIVE: the reveal chapter is told the sentence it owes, by name and verb", () => {
    const text = renderSceneContract(contract, contract.roles.reveal);
    expect(text).toMatch(/Nora Quayle killed Montague Gaunt/);
    expect(text).toMatch(/verb of killing/);
  });

  it("no other chapter is told to name the culprit", () => {
    for (const scene of contract.scenes) {
      if (scene.chapter === contract.roles.reveal) continue;
      expect(renderSceneContract(contract, scene.chapter), `chapter ${scene.chapter}`).not.toMatch(/verb of killing/);
    }
  });

  it("every chapter is told its length as a count of full paragraphs, with the word target beside it", () => {
    for (const scene of contract.scenes) {
      const text = renderSceneContract(contract, scene.chapter);
      expect(text, `chapter ${scene.chapter}`).toMatch(/At least \d+ paragraphs here run to four sentences or more, for about \d+ words/);
      expect(text).not.toMatch(/^\s*About \d+ words\.$/m);
    }
  });
});
