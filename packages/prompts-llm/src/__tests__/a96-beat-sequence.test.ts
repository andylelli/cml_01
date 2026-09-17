/**
 * A_96 F1 / F2 / F10 — pinned on run 50862's own outline.
 *
 * B6: 36 of 52 stored outlines duplicate a beat. This one gave `final_trap` to scenes 8 AND 9; the
 * prose confessed in 8, chapter 9 cleared suspects of a confessed crime, and the reveal contract
 * landed on 9. B5: 8 of 10 chapter titles were the scene title verbatim, two carrying the beat name.
 */
import { afterEach, describe, expect, it } from "vitest";

import {
  isBeatSequenceRepairEnabled,
  isStripBeatTitlesEnabled,
  repairBeatSequence,
  stripBeatPrefixFromTitle,
} from "../agent7-beat-sequence.js";
import { buildChapterObligationBlock, isEarliestTrapWinsEnabled } from "../agent9-prose/obligation-block.js";
import { sanitizeGeneratedChapter } from "../agent9-prose/sanitization.js";

const FLAGS = ["AGENT7_BEAT_SEQUENCE_REPAIR", "AGENT9_STRIP_BEAT_TITLES", "AGENT9_EARLIEST_TRAP_WINS", "AGENT9_REVEAL_ON_DT_CHAPTER", "AGENT9_SCENE_REF_ARBITRATION"];
const saved = Object.fromEntries(FLAGS.map((f) => [f, process.env[f]]));
afterEach(() => {
  for (const f of FLAGS) {
    if (saved[f] === undefined) delete process.env[f];
    else process.env[f] = saved[f]!;
  }
});

/** Run 50862's outline: beats, titles and the two purposes that mattered, verbatim. */
const outline50862 = () => ({
  acts: [
    { scenes: [
      { sceneNumber: 1, beat: "gathering", title: "Discovery", purpose: "Introduce the crime and detective; establish initial contradictions" },
      { sceneNumber: 2, beat: "crime", title: "Dissonant Bearings", purpose: "Reveal early contradictions" },
      { sceneNumber: 3, beat: "first_enquiries", title: "Ledger Shadows", purpose: "Reveal ledger inconsistencies" },
    ] },
    { scenes: [
      { sceneNumber: 4, beat: "motives", title: "Motives in the Dunes", purpose: "Reveal plausible motives; shift suspicion" },
      { sceneNumber: 5, beat: "alibis", title: "Alibis and Shadows", purpose: "Test alibis and expose contradictions; end with a second dramatic incident" },
      { sceneNumber: 6, beat: "false_solution", title: "False Solution: The Judge’s Compass", purpose: "Accuse Gwendolyn based on false assumption of compass bearing; detective spots the flaw" },
      { sceneNumber: 7, beat: "secrets", title: "Secrets Beneath the Surface", purpose: "Uncover unrelated lies" },
      { sceneNumber: 8, beat: "final_trap", title: "The Final Trap: Compass and Ledger", purpose: "Execute discriminating test proving compass bearing offset and ledger manipulation" },
    ] },
    { scenes: [
      { sceneNumber: 9, beat: "final_trap", title: "Clearing the Innocent", purpose: "Confirm alibis of all innocent suspects; provide closure to their arcs" },
      { sceneNumber: 10, beat: "revelation", title: "Confrontation and Aftermath", purpose: "Reveal culprit through confrontation; show consequences and aftermath" },
    ] },
  ],
});
const scenesOf = (n: any) => n.acts.flatMap((a: any) => a.scenes);

describe("flags default OFF", () => {
  it("all three are off unless .env says so", () => {
    for (const f of FLAGS) delete process.env[f];
    expect(isBeatSequenceRepairEnabled()).toBe(false);
    expect(isStripBeatTitlesEnabled()).toBe(false);
    expect(isEarliestTrapWinsEnabled()).toBe(false);
  });
});

describe("F2 — the duplicate final_trap is relabelled, and the clearances after the reveal are dropped", () => {
  it("THE DEFECT, repaired on the run's own outline", () => {
    const n = outline50862();
    const r = repairBeatSequence(n);
    const sc = scenesOf(n);
    // scene 9 no longer duplicates scene 8's beat; it takes the canonical beat for its position
    expect(sc[8].beat).not.toBe("final_trap");
    expect(r.relabelled).toEqual([{ sceneNumber: 9, from: "final_trap", to: "pattern" }]);
    // the clearance clause after the reveal is gone; the closure half survives
    expect(sc[8].purpose).toBe("Provide closure to their arcs");
    expect(r.clearancesStripped.map((c) => c.sceneNumber)).toEqual([9]);
    // the real final trap keeps its beat and its purpose
    expect(sc[7].beat).toBe("final_trap");
    expect(sc[7].purpose).toMatch(/^Execute discriminating test/);
  });

  it("scenes BEFORE the reveal keep their clearances — that is where clearing belongs", () => {
    const n = outline50862();
    repairBeatSequence(n);
    expect(scenesOf(n)[4].purpose).toMatch(/^Test alibis/);
  });

  it("a unique sequence is untouched", () => {
    const n = outline50862();
    scenesOf(n)[8].beat = "pattern"; scenesOf(n)[8].purpose = "Reconstruct the timeline";
    const r = repairBeatSequence(n);
    expect(r.relabelled).toEqual([]);
    expect(r.clearancesStripped).toEqual([]);
  });

  it("with no final_trap at all, only the final scene is treated as after-the-reveal", () => {
    const n = { acts: [{ scenes: [
      { sceneNumber: 1, beat: "gathering", purpose: "Confirm alibis early; introduce the cast" },
      { sceneNumber: 2, beat: "revelation", purpose: "Confirm alibis of everyone; the aftermath settles" },
    ] }] };
    const r = repairBeatSequence(n);
    expect(r.clearancesStripped.map((c) => c.sceneNumber)).toEqual([2]);
    expect(scenesOf(n)[0].purpose).toMatch(/^Confirm alibis early/);
  });

  it("no acts, no crash", () => {
    expect(repairBeatSequence(null).relabelled).toEqual([]);
  });

  /**
   * 2026-09-17 bug check. MEASURED over the 65 stored outlines: the first cut relabelled the FINAL
   * scene of 23 of them — every outline ending `…, final_trap, revelation, revelation` lost its last
   * `revelation` to `pattern` or `secrets`, which un-made the aftermath chapter and moved the reveal.
   */
  it("REGRESSION: a duplicated `revelation` is the reveal-then-aftermath shape and is left alone", () => {
    const n = outline50862();
    const sc = scenesOf(n);
    sc[8].beat = "revelation"; sc[8].title = "The Culprit Revealed"; sc[8].purpose = "Reveal the culprit through confrontation";
    const r = repairBeatSequence(n);
    expect(r.relabelled).toEqual([]);
    expect(sc[8].beat).toBe("revelation");
    expect(sc[9].beat).toBe("revelation");
  });

  it("REGRESSION: the final scene is never relabelled, whatever its beat duplicates", () => {
    const n = outline50862();
    const sc = scenesOf(n);
    sc[8].beat = "pattern";
    sc[9].beat = "final_trap"; // a duplicate of scene 8's, at the end of the book
    repairBeatSequence(n);
    expect(sc[9].beat).toBe("final_trap");
  });

  it("a replacement is a beat NO scene carries, so a relabel cannot create the next duplicate", () => {
    const n = { acts: [{ scenes: [
      { sceneNumber: 1, beat: "gathering" }, { sceneNumber: 2, beat: "motives" }, { sceneNumber: 3, beat: "motives" },
      { sceneNumber: 4, beat: "alibis" }, { sceneNumber: 5, beat: "revelation" },
    ] }] };
    const r = repairBeatSequence(n);
    // positional for index 2 is first_enquiries (free); crime is also free but first_enquiries is nearer forward
    expect(r.relabelled).toEqual([{ sceneNumber: 3, from: "motives", to: "first_enquiries" }]);
    const beats = scenesOf(n).map((s: any) => s.beat);
    expect(new Set(beats).size).toBe(beats.length);
  });

  /**
   * 2026-09-17 bug check. MEASURED over the 65 stored outlines: 45 of the 120 clauses the two
   * clearance strippers dropped carried reveal language — "She confronts Charles Fenwick with the
   * evidence of clock tampering and his falsified alibi" went because of the word "alibi".
   */
  it("REGRESSION: a confrontation that mentions the culprit's broken alibi is not a clearance", () => {
    const n = outline50862();
    const sc = scenesOf(n);
    sc[9].purpose =
      "Inspector Harcourt systematically clears Annabelle Marwood and Harold Grimshaw. " +
      "She confronts Charles Fenwick with the evidence of clock tampering and his falsified alibi, exposing his motive and method.";
    const r = repairBeatSequence(n);
    expect(sc[9].purpose).toBe("She confronts Charles Fenwick with the evidence of clock tampering and his falsified alibi, exposing his motive and method.");
    expect(r.clearancesStripped.map((c) => c.dropped)).toContain("Inspector Harcourt systematically clears Annabelle Marwood and Harold Grimshaw.");
  });
});

describe("F1 — beat names are not for the reader", () => {
  it("strips a leading beat-name prefix and keeps the title", () => {
    expect(stripBeatPrefixFromTitle("False Solution: The Judge’s Compass")).toBe("The Judge’s Compass");
    expect(stripBeatPrefixFromTitle("The Final Trap: Compass and Ledger")).toBe("Compass and Ledger");
    expect(stripBeatPrefixFromTitle("Revelation — Shadows Lifted")).toBe("Shadows Lifted");
  });

  it("leaves a real title alone, including ones that merely contain a beat word", () => {
    for (const t of ["Clearing the Innocent", "Shadows on the Dunes", "The Pattern of the Tide", "Secrets of the Choir"]) {
      expect(stripBeatPrefixFromTitle(t)).toBe(t);
    }
  });

  it("never returns an empty title", () => {
    expect(stripBeatPrefixFromTitle("False Solution:")).toBe("False Solution:");
  });

  it("the outline repair retitles both leaking scenes", () => {
    const n = outline50862();
    const r = repairBeatSequence(n);
    expect(r.titlesStripped.map((t) => t.sceneNumber)).toEqual([6, 8]);
    expect(scenesOf(n)[5].title).toBe("The Judge’s Compass");
  });

  it("the Agent 9 chapter title is stripped only when the flag is on", () => {
    const chapter = { title: "The Final Trap: Compass and Ledger", paragraphs: ["Bertram set the compass down."] } as any;
    delete process.env.AGENT9_STRIP_BEAT_TITLES;
    expect(sanitizeGeneratedChapter(chapter, []).title).toBe("The Final Trap: Compass and Ledger");
    process.env.AGENT9_STRIP_BEAT_TITLES = "true";
    expect(sanitizeGeneratedChapter(chapter, []).title).toBe("Compass and Ledger");
  });
});

describe("F10 — the earliest final_trap wins the reveal", () => {
  const CASE = {
    prose_requirements: {
      culprit_revelation_scene: { act_number: 3, scene_number: 6, revelation_method: "Confrontation" },
      discriminating_test_scene: { act_number: 3, scene_number: 4, required_elements: ["Execute the compass comparison"] },
      clue_to_scene_mapping: [],
    },
    discriminating_test: { method: "compass comparison" },
    culpability: { culprits: ["Nora Quayle"] },
    cast: [{ name: "Nora Quayle", role_archetype: "suspect", motive_seed: "exposure" }, { name: "Bertram Norbury", role_archetype: "detective" }],
    hidden_model: { mechanism: { apparent_time_of_death: "nine o'clock", actual_time_of_death: "ten past nine" } },
  };
  const SCENES = scenesOf(outline50862()).map((s: any) => ({ ...s, act: s.sceneNumber <= 3 ? 1 : s.sceneNumber <= 8 ? 2 : 3, characters: ["Bertram Norbury"] }));
  const block = (n: number) =>
    buildChapterObligationBlock([SCENES[n - 1]], n, CASE, undefined, undefined, undefined, undefined, undefined, undefined,
      n === 10 ? "resolution" : n >= 8 ? "climax" : "rising", undefined, undefined, SCENES,
      n === 10 ? "aftermath_consequence" : undefined, undefined, undefined, undefined);

  it("OFF: on the duplicated outline the kill statement goes to the SECOND trap — the run's defect", () => {
    delete process.env.AGENT9_EARLIEST_TRAP_WINS;
    process.env.AGENT9_REVEAL_ON_DT_CHAPTER = "true";
    process.env.AGENT9_SCENE_REF_ARBITRATION = "true";
    const carrying = [8, 9].filter((n) => block(n).includes("KILL STATEMENT REQUIRED"));
    expect(carrying).toEqual([9]);
  });

  it("ON: it goes to the FIRST trap, where the prose confesses", () => {
    process.env.AGENT9_EARLIEST_TRAP_WINS = "true";
    process.env.AGENT9_REVEAL_ON_DT_CHAPTER = "true";
    process.env.AGENT9_SCENE_REF_ARBITRATION = "true";
    const carrying = [8, 9].filter((n) => block(n).includes("KILL STATEMENT REQUIRED"));
    expect(carrying).toEqual([8]);
  });
});
