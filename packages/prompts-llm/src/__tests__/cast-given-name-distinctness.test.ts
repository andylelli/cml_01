/**
 * THE CAST-NAME RULE THE PIPELINE CALLS MANDATORY, FINALLY CHECKED.
 *
 * `agent2-cast.ts:468` — *"no two characters may share the same initial. This guarantees name
 * uniqueness across stories."* Nothing verified it until 2026-09-04.
 *
 * MEASURED over the 50 shipped casts in the store, split by who chose the names:
 *
 *   named by the pipeline (n=42)    10% share a first-name INITIAL,  0% share a given NAME
 *   supplied by a seeded run (n=8)  75% share an initial,           50% share a given name
 *
 * The rule works where it is sent. It is not sent when cast names are supplied — `namingDirectives`
 * is an empty string in that branch — so every one of the four books that shipped two characters
 * with the same first name came from the seeded generator. That half is fixed at source in
 * `scripts/run-params.mjs`; this checker covers the 10% residual on the path the generator cannot
 * reach.
 *
 * Two external reads named the consequence, and they carry the two lowest `character_clarity` marks
 * in the recent set: 76/100 *"Two Adelas in a short mystery is unnecessary friction"* and 77/100
 * *"Do not use Adela twice"* (character_clarity 5).
 *
 * The fixtures below use the real colliding names from those books, not invented ones.
 */

import { describe, expect, it } from "vitest";

import { checkCast } from "../agent2-cast-checker.js";

const character = (name: string, extra: Record<string, unknown> = {}) => ({
  name,
  ageRange: "40s",
  occupation: "Stage manager",
  roleArchetype: `Archetype for ${name}`,
  role: "suspect",
  gender: name.startsWith("Gerald") ? "male" : "female",
  publicPersona: "A composed professional who keeps the company running to time.",
  privateSecret: "Has been quietly covering a shortfall in the season's accounts.",
  motiveSeed: "Feared exposure of the shortfall.",
  motiveStrength: "moderate",
  accessPlausibility: "possible",
  ...extra,
});

const castOf = (...names: string[]) =>
  ({ characters: names.map((n) => character(n)), relationships: [] }) as any;

const codes = (cast: any): string[] => checkCast(cast).issues.map((i) => i.code);
const issueFor = (cast: any, code: string) => checkCast(cast).issues.find((i) => i.code === code);

describe("duplicate given names", () => {
  it("flags the real collision two reads complained about", () => {
    // The exact pair from the 76/100 and 77/100 books.
    const cast = castOf("Dr. Adela Quayle", "Adela Jardine", "Gerald Yardley", "Lavinia Gaunt");
    expect(codes(cast)).toContain("duplicate_given_name");
    const issue = issueFor(cast, "duplicate_given_name");
    expect(issue?.severity).toBe("error");
    expect(issue?.character).toBe("Adela Jardine");
    expect(issue?.message).toContain("Dr. Adela Quayle");
  });

  it("strips honorifics before comparing — the collision is behind a title", () => {
    // "Dr. Adela Quayle" vs "Adela Jardine" only collides once the honorific is removed. A naive
    // first-token comparison reads "Dr." as the given name and finds nothing.
    expect(codes(castOf("Dr. Adela Quayle", "Adela Jardine"))).toContain("duplicate_given_name");
    expect(codes(castOf("Dr. Adela Quayle", "Captain Adela Jardine"))).toContain("duplicate_given_name");
  });

  it("is silent on a clean cast — the shipped seed-22362 names", () => {
    const clean = castOf(
      "Desmond Jardine",
      "Dr. Edmund Rutherford",
      "Iris Norbury",
      "Harriet Penhale",
      "Clarissa Gaunt",
    );
    expect(codes(clean)).not.toContain("duplicate_given_name");
    expect(codes(clean)).not.toContain("shared_given_initial");
  });
});

describe("shared first-name initials", () => {
  it("flags two distinct names that begin with the same letter", () => {
    // "Adela" and "Ambrose" are different names that read as the same person in a scan. This is the
    // 45% case in the seeded generator, where the two name pools share all sixteen initials.
    const cast = castOf("Adela Quayle", "Ambrose Yardley", "Lavinia Gaunt");
    expect(codes(cast)).toContain("shared_given_initial");
    expect(issueFor(cast, "shared_given_initial")?.severity).toBe("warn");
  });

  it("does not double-report: a duplicate NAME is not also reported as a duplicate initial", () => {
    // Two Adelas share a name and, trivially, an initial. Reporting both would make one defect look
    // like two and would inflate any rate measured off these codes.
    const cast = castOf("Dr. Adela Quayle", "Adela Jardine");
    expect(codes(cast).filter((c) => c === "duplicate_given_name")).toHaveLength(1);
    expect(codes(cast)).not.toContain("shared_given_initial");
  });

  it("reports each later collision once, against the FIRST holder", () => {
    const cast = castOf("Adela Quayle", "Ambrose Yardley", "Augusta Penhale");
    const shared = checkCast(cast).issues.filter((i) => i.code === "shared_given_initial");
    expect(shared).toHaveLength(2);
    expect(shared.every((i) => i.message.includes("Adela Quayle"))).toBe(true);
  });
});

describe("it does not disturb what the checker already reported", () => {
  it("still finds duplicate archetypes, and adds nothing to a clean cast", () => {
    const dup = {
      characters: [
        character("Iris Norbury", { roleArchetype: "Veteran Stage Manager" }),
        character("Desmond Jardine", { roleArchetype: "Veteran Stage Manager" }),
      ],
      relationships: [],
    } as any;
    expect(codes(dup)).toContain("duplicate_archetype");
    // Distinct names, distinct initials — the new checks must stay quiet here.
    expect(codes(dup)).not.toContain("duplicate_given_name");
    expect(codes(dup)).not.toContain("shared_given_initial");
  });

  it("tolerates a missing or blank name without throwing", () => {
    const odd = {
      characters: [character("Iris Norbury"), { ...character("x"), name: "" }, { ...character("y"), name: undefined }],
      relationships: [],
    } as any;
    expect(() => checkCast(odd)).not.toThrow();
    expect(codes(odd)).not.toContain("duplicate_given_name");
  });
});
