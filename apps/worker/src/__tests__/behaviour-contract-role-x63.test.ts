import { describe, it, expect } from "vitest";
import { assembleCharacterBundle } from "../jobs/mystery-orchestrator.js";

/**
 * X63 — the per-act behaviour contract was role-blind, and its own comment said "derived from motive
 * seed + role". `CharacterProfilesResult` carries no role field, so role was never in scope to read.
 *
 * The contract matters because it is the ONLY per-character behavioural steering that reaches Agent 9
 * — prompt-blocks.ts prints it verbatim as "Act N behaviour contract". Cast and profiles below are
 * the real 08-19 run (mystery-1787090659145).
 */
const CAST = [
  { name: "Dr. Mallory Finch", role_archetype: "detective" },
  { name: "Eleanor Voss", role_archetype: "victim" },
  { name: "Hugo Vane", role_archetype: "suspect" },
  { name: "Beatrice Quill", role_archetype: "suspect" },
];

const PROFILES = {
  profiles: [
    { name: "Dr. Mallory Finch", motiveSeed: "hoping to redeem herself", internalConflict: "guilt over a past medical failure" },
    { name: "Eleanor Voss", motiveSeed: "her demise prevents a new will", internalConflict: "the loneliness of estrangement" },
    { name: "Hugo Vane", motiveSeed: "the threat of disinheritance", internalConflict: "ruthless ambition against fear" },
    { name: "Beatrice Quill", motiveSeed: "financial losses and wounded pride", internalConflict: "bitterness of past slights" },
  ],
} as any;

const WORLD = { characterVoiceSketches: [] } as any;
const bundleOf = (cast: unknown[] = CAST) =>
  Object.fromEntries(
    assembleCharacterBundle("run", PROFILES, WORLD, cast).characters.map((c) => [c.name, c.permittedBehavioursByAct]),
  );

describe("assembleCharacterBundle — the behaviour contract knows the role (X63)", () => {
  it("never tells the DETECTIVE to be evasive or to show a behavioural tell", () => {
    const finch = bundleOf()["Dr. Mallory Finch"]!;
    const all = [finch.act1, finch.act2, finch.act3].join(" ");
    expect(all).not.toMatch(/One behavioural tell is permitted/i);
    expect(finch.act2).toMatch(/is not a suspect/i);
    expect(finch.act2).toMatch(/evasion, defensiveness under questioning and behavioural tells are NOT/i);
  });

  it("does not give the VICTIM a live three-act contract ending in confession", () => {
    const eleanor = bundleOf()["Eleanor Voss"]!;
    expect(eleanor.act1).toMatch(/DECEASED/);
    expect(eleanor.act2).toMatch(/DECEASED/);
    expect(eleanor.act3).toMatch(/DECEASED/);
    expect(eleanor.act3).toMatch(/No confrontation, no confession/i);
    expect(eleanor.act2).not.toMatch(/One behavioural tell is permitted/i);
  });

  it("keeps the culprit and the innocent suspects on ONE contract — a difference would be a tell", () => {
    const b = bundleOf();
    // Hugo is the culprit, Beatrice is innocent. Only their own motive/conflict text may differ.
    const strip = (s: string) => s.replace(/"[^"]*"/g, '"…"');
    expect(strip(b["Hugo Vane"]!.act1)).toBe(strip(b["Beatrice Quill"]!.act1));
    expect(strip(b["Hugo Vane"]!.act2)).toBe(strip(b["Beatrice Quill"]!.act2));
    expect(strip(b["Hugo Vane"]!.act3)).toBe(strip(b["Beatrice Quill"]!.act3));
  });

  it("Act III is no longer byte-identical for everyone — it reads the profile like Act II does", () => {
    const b = bundleOf();
    expect(b["Hugo Vane"]!.act3).toMatch(/ruthless ambition against fear/);
    expect(b["Beatrice Quill"]!.act3).toMatch(/bitterness of past slights/);
    expect(b["Hugo Vane"]!.act3).not.toBe(b["Beatrice Quill"]!.act3);
    expect(b["Dr. Mallory Finch"]!.act3).not.toBe(b["Hugo Vane"]!.act3);
  });

  it("suspects still carry their motive in Act I and their conflict in Act II, as before", () => {
    const hugo = bundleOf()["Hugo Vane"]!;
    expect(hugo.act1).toMatch(/Hidden motive: "the threat of disinheritance" — do not surface in Act I/);
    expect(hugo.act2).toMatch(/Internal conflict emerging: "ruthless ambition against fear"/);
  });

  it("degrades to the suspect contract when the roster is absent or the name is unknown", () => {
    const noRoster = bundleOf([]);
    expect(noRoster["Dr. Mallory Finch"]!.act2).toMatch(/One behavioural tell is permitted/);
    const misnamed = bundleOf([{ name: "Someone Else", role_archetype: "detective" }]);
    expect(misnamed["Dr. Mallory Finch"]!.act2).toMatch(/One behavioural tell is permitted/);
  });

  it("reads camelCase roleArchetype too — the cast-field trap", () => {
    const camel = bundleOf([{ name: "Dr. Mallory Finch", roleArchetype: "detective" }]);
    expect(camel["Dr. Mallory Finch"]!.act2).toMatch(/is not a suspect/i);
  });
});
