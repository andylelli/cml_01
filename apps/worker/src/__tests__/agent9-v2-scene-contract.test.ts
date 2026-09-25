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

  const retitled = (chapter: number, title: string) => ({
    ...contract,
    scenes: contract.scenes.map((s) => (s.chapter === chapter ? { ...s, title } : s)),
  });

  it("KNOWN-POSITIVE: an aftermath titled as a reveal loses the title, and no instruction enters the header", () => {
    const aftermath = contract.roles.aftermath;
    if (aftermath === null) return;
    for (const title of ["The Culprit Revealed", "Confrontation and Aftermath"]) {
      const text = renderSceneContract(retitled(aftermath, title), aftermath);
      expect(text, title).toMatch(new RegExp(`^=== CHAPTER ${aftermath} ===$`, "m"));
      expect(text, title).toMatch(/Its title is yours: this chapter comes after Nora Quayle was named/);
      expect(text, title).not.toContain(title);
    }
  });

  it("KNOWN-POSITIVE: a reveal titled 'Clearing the Innocent' loses the title — all three read books", () => {
    const reveal = contract.roles.reveal;
    const text = renderSceneContract(retitled(reveal, "Clearing the Innocent"), reveal);
    expect(text).toMatch(new RegExp(`^=== CHAPTER ${reveal} ===$`, "m"));
    expect(text).toMatch(/Its title is yours: this is the chapter where Nora Quayle is named/);
  });

  it("KNOWN-NEGATIVE: titles that fit their role are kept", () => {
    const reveal = contract.roles.reveal;
    expect(renderSceneContract(retitled(reveal, "The Culprit Revealed"), reveal)).toMatch(/: The Culprit Revealed ===/);
    const aftermath = contract.roles.aftermath;
    if (aftermath !== null) {
      expect(renderSceneContract(retitled(aftermath, "The Rector's Unimpeachable Word"), aftermath)).toMatch(/: The Rector's Unimpeachable Word ===/);
    }
  });

  it("the aftermath is told to begin after the case closes, and never told who was exposed", () => {
    const aftermath = contract.roles.aftermath;
    if (aftermath === null) return;
    const text = renderSceneContract(contract, aftermath);
    expect(text).toMatch(/Opens on the first ordinary thing that happens once the case is closed/);
    expect(text).toMatch(/mentioned in one clause or not at all/);
    expect(text).not.toMatch(/settled outcome|was exposed in chapter/);
  });

  it("the reveal asks for the culprit's own answer on the page", () => {
    const text = renderSceneContract(contract, contract.roles.reveal);
    // 17-hitting-90 P1.5: two counted lines, each with a slot — "answers … the reason" produced silence.
    expect(text).toMatch(/Then Nora Quayle speaks twice, in their own words on the page/);
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

describe("17-hitting-90 — after the reveal, a clearing title fits no chapter", () => {
  // Five chapters, so a clearance chapter sits BETWEEN the reveal (3) and the aftermath (5), as pair 2's chapter 9 did.
  const five = buildBookContract({
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
    clues: { clues: [] },
    outline: {
      acts: [
        {
          scenes: [
            { sceneNumber: 1, act: 1, beat: "gathering", title: "Arrival", characters: ["Bertram Norbury"], setting: { location: "the office" } },
            { sceneNumber: 2, act: 1, beat: "investigation", title: "The Dunes", characters: ["Bertram Norbury"], setting: { location: "the dunes" } },
            { sceneNumber: 3, act: 2, beat: "final_trap", title: "The Test", characters: ["Bertram Norbury"], setting: { location: "the dunes" } },
            { sceneNumber: 4, act: 3, beat: "alibis", title: "Clearing the Innocent", characters: ["Bertram Norbury"], setting: { location: "the lounge" } },
            { sceneNumber: 5, act: 3, beat: "revelation", title: "After", characters: ["Bertram Norbury"], setting: { location: "the promenade" } },
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
  const retitle = (chapter: number, title: string) => ({
    ...five,
    scenes: five.scenes.map((s) => (s.chapter === chapter ? { ...s, title } : s)),
  });

  it("the fixture has a chapter between the reveal and the aftermath", () => {
    expect(five.roles.reveal).toBe(3);
    expect(five.roles.aftermath).toBe(5);
  });

  it("KNOWN-POSITIVE: pair 2's chapter 9 — 'Clearing the Innocent' after the reveal — loses the title", () => {
    const text = renderSceneContract(five, 4);
    expect(text).toMatch(/^=== CHAPTER 4 ===$/m);
    expect(text).toMatch(/Its title is yours: this chapter comes after Nora Quayle was named in chapter 3/);
    expect(text).not.toContain("Clearing the Innocent");
  });

  it("KNOWN-NEGATIVE: a clearing title BEFORE the reveal is still the chapter's own", () => {
    expect(renderSceneContract(retitle(2, "Clearing the Innocent"), 2)).toMatch(/: Clearing the Innocent ===/);
  });

  it("the closure chapter asks for one sentence per cleared suspect and leaves the clock in the reveal", () => {
    expect(five.brief.text).toMatch(/the suspect's name and the word "cleared", and the next sentence is what that suspect does with their hands/);
    expect(five.brief.text).toMatch(/The clock values belong to chapter 3/);
  });
});
