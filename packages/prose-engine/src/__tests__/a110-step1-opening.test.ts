import { afterEach, describe, expect, it } from "vitest";
import { buildBookContract } from "../book-contract.js";
import { collectCheckerFindings } from "../findings.js";
import { openingLines } from "../opening.js";
import { measureInstruments } from "../selector.js";
import { completeProjects } from "./fixtures.js";
import type { ContractInput } from "../types.js";

/**
 * ANALYSIS_110 step 1 — PROSE_V2_OPENING: the place before anybody speaks (W2), a room described on its first visit
 * (W3), each person introduced where they first appear (P1), the death met by everybody present and by the world
 * outside (D1, D2), the second exchange's long line capped (L3); and the three guards that keep the passage alive —
 * the checkers leave its two paragraphs alone, the selector leaves them out of the speech share, the brief's
 * every-paragraph rule exempts them.
 */
afterEach(() => {
  delete process.env.PROSE_V2_OPENING;
});
const projects = completeProjects();
const build = (input: ContractInput, on: boolean) => {
  if (on) process.env.PROSE_V2_OPENING = "1";
  else delete process.env.PROSE_V2_OPENING;
  return buildBookContract(input);
};

describe("A_110 step 1 over the archive", () => {
  it("has archived projects to check", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("OFF: no chapter carries an opening, and the brief is byte-identical to a flag-less build", () => {
    for (const p of projects.slice(0, 8)) {
      const a = build(p.input, false);
      expect(a.scenes.some((s) => s.opening)).toBe(false);
      process.env.PROSE_V2_OPENING = "0";
      expect(buildBookContract(p.input).brief.text).toBe(a.brief.text);
    }
  });

  it("ON: the first chapter opens on the place wherever the location profile describes it", () => {
    let withPlace = 0;
    for (const p of projects) {
      const looks = (p.input.locations as { primary?: { visualDescription?: string } } | undefined)?.primary?.visualDescription;
      const first = build(p.input, true).scenes[0]!;
      if (!looks) continue;
      withPlace++;
      expect(first.opening?.establishing?.looks).toBe(looks.replace(/\s+/g, " ").trim());
    }
    expect(withPlace).toBeGreaterThan(0);
  });

  it("ON: everybody on any page is introduced exactly once, never the victim, and in the first chapter that lists them", () => {
    for (const p of projects) {
      const c = build(p.input, true);
      const introduced = c.scenes.flatMap((s) => (s.opening?.introductions ?? []).map((i) => ({ name: i.name, chapter: s.chapter })));
      const names = introduced.map((i) => i.name);
      expect(new Set(names).size).toBe(names.length);
      expect(names).not.toContain(c.fairPlay.victim);
      for (const i of introduced) {
        const firstListed = c.scenes.find((s) => s.present.includes(i.name))!.chapter;
        expect(i.chapter).toBe(firstListed);
      }
    }
  });

  it("ON: the body chapter has everybody present speak of the death; the culprit's relation is never given", () => {
    let bodies = 0;
    for (const p of projects) {
      const c = build(p.input, true);
      const body = c.scenes.find((s) => s.opening?.death);
      if (!body) continue;
      bodies++;
      expect(body.opening!.death!.witnesses).toEqual(body.present.filter((n) => n !== c.fairPlay.victim));
      for (const s of c.scenes) for (const i of s.opening?.introductions ?? []) if (c.fairPlay.culprits.includes(i.name)) expect(i.relation).toBeUndefined();
    }
    expect(bodies).toBeGreaterThan(0);
  });

  it("ON: the opening chapter sheds its trait, inner-conflict and shared-history lines", () => {
    for (const p of projects) {
      const first = build(p.input, true).scenes[0]!;
      expect(first.beats.depth).toBeUndefined();
      expect(first.texture?.conflict).toBeUndefined();
      expect(first.texture?.history).toBeUndefined();
    }
  });

  it("ON (L3): the long line of the second exchange is capped at forty words", () => {
    const p = projects[0]!;
    expect(build(p.input, true).brief.text).toMatch(/between twenty-five and forty words/);
    expect(build(p.input, false).brief.text).toMatch(/twenty-five words or more/);
  });
});

describe("A_110 step 1 — the lines and the guards", () => {
  it("renders a count and a slot, and names the place's own words", () => {
    const lines = openingLines({
      establishing: { looks: "A grey stone building above the harbour." },
      introductions: [{ name: "Ada Vane", occupation: "family lawyer", pronoun: "she is" }],
      death: { victim: "Hugh Vane", pronoun: "he", who: "a retired shipowner, in his seventies", witnesses: ["Ada Vane", "Tom Bell"], authority: "the town is miles off" },
    });
    expect(lines[0]).toMatch(/^This chapter opens on the place before anybody speaks\. .*A grey stone building above the harbour\. The first line anybody speaks is in the third paragraph or later\.$/);
    // A_111 P-3: one operation for the newcomers, then the facts — no sentence to paste.
    expect(lines[1]).toBe("One person is on the page for the first time here. Introduce each in the sentence where they first do or say something, at most one introduction to a paragraph, in your own words, from these facts:");
    expect(lines[2]).toBe("  Ada Vane: family lawyer");
    expect(lines).toContain("The first time Hugh Vane is named, a clause says who he was: a retired shipowner, in his seventies.");
    expect(lines).toContain("Somebody sends for the police and a doctor, and they cannot come yet: the town is miles off");
  });

  const place = [
    "The Cliffhaven Hotel stood on the cliff above Mevagissey, three storeys of grey stone under a slate roof gone dark with salt. The whitewash had peeled from the seaward wall.",
    "It was the middle of January, 1934, and the fog had come in off the bay at dusk. The night was thick with it. The air was heavy with salt and coal smoke, and the sea could be heard and not seen.",
  ];
  const chapter = { number: 1, title: "One", paragraphs: [...place, "\"Who found him?\" Eleanor asked, setting down her gloves on the desk."] };

  it("the checkers leave the opening's two paragraphs of place alone (they drew three findings before)", () => {
    const p = projects[0]!;
    const inPlace = (on: boolean) => {
      const c = build(p.input, on);
      return collectCheckerFindings([chapter], c, [1]).filter((f) => place.join(" ").includes(f.quote.slice(0, 30)) && /register_sentence|abstract_subject/.test(f.class)).length;
    };
    expect(inPlace(false)).toBeGreaterThan(0);
    expect(inPlace(true)).toBe(0);
  });

  it("the selector leaves the opening's two paragraphs out of the speech-opening share", () => {
    delete process.env.PROSE_V2_OPENING;
    const off = measureInstruments([chapter]).dialogueOpenShare;
    process.env.PROSE_V2_OPENING = "1";
    const on = measureInstruments([chapter]).dialogueOpenShare;
    expect(off).toBeCloseTo(1 / 3);
    expect(on).toBe(1);
  });

  it("P1 check: a first appearance with no word of the occupation is a finding; one with it is not", () => {
    // A person whose name carries no word of the occupation ("Inspector Evelyn Harcourt" already says it).
    const nameSays = (i: { name: string; occupation: string }) => i.occupation.split(/\s+/).some((w) => w.length >= 5 && i.name.toLowerCase().includes(w.slice(0, 5)));
    const p = projects.find((q) => build(q.input, true).scenes.some((s) => (s.opening?.introductions ?? []).some((i) => !nameSays(i))))!;
    const c = build(p.input, true);
    const person = c.scenes.flatMap((s) => s.opening?.introductions ?? []).find((i) => !nameSays(i))!;
    const bare = { number: 1, title: "One", paragraphs: [`${person.name} came in out of the rain and shut the door.`] };
    const told = { number: 1, title: "One", paragraphs: [`${person.name}, the ${person.occupation}, came in out of the rain and shut the door.`] };
    const hits = (ch: typeof bare) => collectCheckerFindings([ch], c, [1]).filter((f) => f.class === "introduction_missing" && f.quote.includes(person.name.split(" ")[0]!)).length;
    expect(hits(bare)).toBe(1);
    expect(hits(told)).toBe(0);
  });
});
