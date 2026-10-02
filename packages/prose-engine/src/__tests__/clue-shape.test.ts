import { afterEach, describe, expect, it } from "vitest";
import { fragmentObservable } from "../clue-shape.js";
import { buildBible } from "../bible.js";
import { buildContractCore } from "../contract.js";
import { completeProjects } from "./fixtures.js";

/** Clue lines shaped so they cannot be pasted in as narration (the 5670 read: "sounds like notes, not narration"). */
const words = (s: string) => s.replace(/[^\p{L}\p{N}'’ ]+/gu, " ").split(/\s+/).filter(Boolean);
/** Words as the fragmenter counts them — whitespace-separated, so "thirty-one" is one word. */
const spaced = (s: string) => s.trim().split(/\s+/).filter(Boolean);
afterEach(() => { delete process.env.CML_VERIFIED_FIXES; });

describe("fragmentObservable", () => {
  it("breaks run 5670's copied clue into ≤6-word fragments, every word kept in order", () => {
    const line = "Kenneth Ingram was seen accessing Ambrose Dunmore's dressing room where the dagger was found with fresh handling marks.";
    const out = fragmentObservable(line);
    expect(out).toBe("Kenneth Ingram was seen accessing Ambrose / Dunmore's dressing room / where the dagger was found / with fresh handling marks");
    for (const frag of out.split(" / ")) expect(spaced(frag).length).toBeLessThanOrEqual(6);
    expect(words(out)).toEqual(words(line));
  });

  it("leaves a short observable as it is", () => {
    expect(fragmentObservable("the scuffed brass casing")).toBe("the scuffed brass casing");
    expect(fragmentObservable("a stopped watch at six")).toBe("a stopped watch at six");
  });
});

describe("the brief's clue lines over the archive", () => {
  const projects = completeProjects();
  const clueLines = (p: (typeof projects)[number]) => {
    const core = buildContractCore(p.input);
    const body = buildBible(p.input, core).sections.find((s) => s.key === "clues")?.body ?? "";
    return body.split("\n").filter((l) => /^\s*\[[^\]]+\] chapter \d+: /.test(l)).map((l) => l.replace(/^\s*\[[^\]]+\] chapter \d+: /, "").replace(/ — \S.* reads it because .*$/, ""));
  };

  it("ON: no clue line carries a fragment over 6 words; OFF has long sentences to shape (known positive)", () => {
    let offLong = 0;
    for (const p of projects) offLong += clueLines(p).filter((l) => words(l).length >= 8).length;
    expect(offLong).toBeGreaterThan(0);
    process.env.CML_VERIFIED_FIXES = "1";
    for (const p of projects) {
      for (const l of clueLines(p)) {
        // A line under 8 words is left whole (no 8-word span to copy); anything longer comes in ≤6-word fragments.
        if (spaced(l).length < 8) continue;
        for (const frag of l.split(" / ")) expect(spaced(frag).length, l).toBeLessThanOrEqual(6);
      }
    }
  });
});
