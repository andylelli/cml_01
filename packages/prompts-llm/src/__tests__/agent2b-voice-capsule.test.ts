import { describe, expect, it } from "vitest";
import {
  extractVoiceCapsule,
  checkVoiceCapsules,
} from "../agent2b-voice-capsule.js";
import type { VoiceCapsule } from "../agent2b-voice-capsule.js";
import type { CharacterProfileOutput } from "../agent2b-character-profiles.js";

/** A CharacterProfileOutput with sensible, voice-rich defaults; overridable per test. */
function makeProfile(
  overrides: Partial<CharacterProfileOutput> & { name: string },
): CharacterProfileOutput {
  return {
    name: overrides.name,
    summary: overrides.summary ?? "A composed provincial solicitor with a buried debt.",
    publicPersona: overrides.publicPersona ?? "respectable, unflappable",
    privateSecret: overrides.privateSecret ?? "embezzled from the estate trust",
    motiveSeed: overrides.motiveSeed ?? "ruin if the audit proceeds",
    motiveStrength: overrides.motiveStrength ?? "strong",
    humourStyle: overrides.humourStyle ?? "dry_wit",
    humourLevel: overrides.humourLevel ?? 0.5,
    speechMannerisms:
      overrides.speechMannerisms ??
      "answers in clipped legal phrases; softens into provincial idioms when pressed",
    internalConflict:
      overrides.internalConflict ??
      "fears that admitting the debt will ruin the daughter he secretly supports",
    personalStakeInCase:
      overrides.personalStakeInCase ?? "the inquiry threatens the one fact he hides",
    paragraphs: overrides.paragraphs ?? [],
    ...overrides,
  };
}

/** A capsule with grounded defaults; overridable per test. */
function makeCapsule(overrides: Partial<VoiceCapsule> & { name: string }): VoiceCapsule {
  return {
    name: overrides.name,
    register: overrides.register ?? "formal",
    speechTics: overrides.speechTics ?? ["clips into legal phrasing", "trails off when cornered"],
    diction: overrides.diction ?? "clipped legal phrasing",
    humour: overrides.humour ?? { style: "dry_wit", level: "sometimes" },
    tells: overrides.tells ?? ["smooths the tablecloth"],
    throughLine: overrides.throughLine ?? "fears the debt will ruin his daughter",
  };
}

describe("extractVoiceCapsule — grounded projection", () => {
  it("projects a grounded capsule from a well-formed profile", () => {
    const capsule = extractVoiceCapsule(makeProfile({ name: "Edmund Crale" }));

    expect(capsule.name).toBe("Edmund Crale");
    // "clipped legal phrases" → formal register.
    expect(capsule.register).toBe("formal");
    // Two clauses split on ';' → two atomizable tics.
    expect(capsule.speechTics.length).toBe(2);
    expect(capsule.speechTics[0]).toContain("clipped legal phrases");
    expect(capsule.diction).toContain("clipped legal phrases");
    // humourLevel 0.5 buckets to "sometimes".
    expect(capsule.humour).toEqual({ style: "dry_wit", level: "sometimes" });
    // throughLine prefers internalConflict.
    expect(capsule.throughLine).toContain("daughter");
    // tics double as verbal tells.
    expect(capsule.tells.length).toBeGreaterThanOrEqual(1);
  });

  it.each([
    { level: 0, expected: "never" },
    { level: 0.2, expected: "rare" },
    { level: 0.5, expected: "sometimes" },
    { level: 0.9, expected: "often" },
  ])("buckets humourLevel $level → $expected", ({ level, expected }) => {
    const capsule = extractVoiceCapsule(makeProfile({ name: "X", humourLevel: level }));
    expect(capsule.humour.level).toBe(expected);
  });

  it.each([
    { mannerism: "answers in terse, clipped monosyllables", expected: "terse" },
    { mannerism: "speaks plainly and directly, no frills", expected: "plain" },
    { mannerism: "florid, ornate, elaborate flourishes", expected: "florid" },
    { mannerism: "warm and gentle, genial tone", expected: "warm" },
    { mannerism: "cold, aloof, detached delivery", expected: "cold" },
    { mannerism: "formal and precise legal phrasing", expected: "formal" },
  ])("derives register $expected from mannerism", ({ mannerism, expected }) => {
    const capsule = extractVoiceCapsule(makeProfile({ name: "X", speechMannerisms: mannerism }));
    expect(capsule.register).toBe(expected);
  });

  it("falls back from internalConflict → personalStakeInCase → summary for throughLine", () => {
    const fromStake = extractVoiceCapsule(
      makeProfile({ name: "A", internalConflict: "", personalStakeInCase: "owes a blood debt" }),
    );
    expect(fromStake.throughLine).toBe("owes a blood debt");

    const fromSummary = extractVoiceCapsule(
      makeProfile({
        name: "B",
        internalConflict: "",
        personalStakeInCase: "",
        summary: "a haunted widow",
      }),
    );
    expect(fromSummary.throughLine).toBe("a haunted widow");
  });

  it("never throws on malformed / partial input", () => {
    expect(() => extractVoiceCapsule(null)).not.toThrow();
    expect(() => extractVoiceCapsule(undefined)).not.toThrow();
    expect(() => extractVoiceCapsule({} as CharacterProfileOutput)).not.toThrow();
    // Wrong types where strings/numbers are expected.
    expect(() =>
      extractVoiceCapsule({
        name: 123 as unknown as string,
        speechMannerisms: { bad: true } as unknown as string,
        humourLevel: "high" as unknown as number,
      } as CharacterProfileOutput),
    ).not.toThrow();

    const empty = extractVoiceCapsule({} as CharacterProfileOutput);
    expect(empty.register).toBe("unknown");
    expect(empty.speechTics).toEqual([]);
    expect(empty.humour.level).toBe("never");
  });
});

describe("checkVoiceCapsules — distinctiveness / groundedness / deployability", () => {
  it("a distinct, grounded cast passes with no errors", () => {
    const capsules = [
      makeCapsule({ name: "Edmund", register: "formal", speechTics: ["clips into legal phrasing"] }),
      makeCapsule({
        name: "Vivienne",
        register: "florid",
        speechTics: ["lingers on grand adjectives", "quotes dead poets"],
      }),
      makeCapsule({
        name: "Gideon",
        register: "terse",
        speechTics: ["answers in single clipped words"],
      }),
    ];
    const r = checkVoiceCapsules(capsules);
    expect(r.ok).toBe(true);
    expect(r.issues.filter((i) => i.severity === "error")).toEqual([]);
    expect(r.metrics.count).toBe(3);
    expect(r.metrics.deployableCount).toBe(3);
    expect(r.metrics.duplicatePairs).toBe(0);
    expect(r.metrics.uniqueRegisters).toBe(3);
  });

  it("flags an empty register as a deployability error", () => {
    const r = checkVoiceCapsules([
      makeCapsule({ name: "Edmund", register: "unknown" as VoiceCapsule["register"] }),
    ]);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.code === "empty_register" && i.severity === "error")).toBe(true);
    expect(r.metrics.groundedRegisterCount).toBe(0);
  });

  it("flags a capsule with no speech tics as undeployable", () => {
    const r = checkVoiceCapsules([makeCapsule({ name: "Mute", speechTics: [] })]);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.code === "no_speech_tics" && i.severity === "error")).toBe(true);
    expect(r.metrics.deployableCount).toBe(0);
  });

  it("warns (not errors) on an empty throughLine", () => {
    const r = checkVoiceCapsules([makeCapsule({ name: "Flat", throughLine: "" })]);
    expect(r.issues.some((i) => i.code === "empty_through_line" && i.severity === "warn")).toBe(true);
    // throughLine alone does not fail the run.
    expect(r.ok).toBe(true);
  });

  it("treats placeholder fields as empty/ungrounded", () => {
    const r = checkVoiceCapsules([
      makeCapsule({
        name: "Placeholder Pete",
        register: "unknown" as VoiceCapsule["register"],
        speechTics: ["TBD", "N/A", "none"],
        throughLine: "todo",
      }),
    ]);
    expect(r.ok).toBe(false);
    expect(r.metrics.ungroundedCount).toBe(1);
    // Placeholder tics are stripped → undeployable.
    expect(r.issues.some((i) => i.code === "no_speech_tics")).toBe(true);
  });

  it("flags two near-identical voices as a duplicate (distinctiveness)", () => {
    const capsules = [
      makeCapsule({
        name: "Alice",
        register: "plain",
        speechTics: ["speaks plainly and is very direct about everything"],
      }),
      makeCapsule({
        name: "Bob",
        register: "plain",
        speechTics: ["speaks plainly and is very direct about everything"],
      }),
    ];
    const r = checkVoiceCapsules(capsules);
    expect(r.metrics.duplicatePairs).toBe(1);
    const dup = r.issues.find((i) => i.code === "duplicate_voice");
    expect(dup).toBeDefined();
    expect(dup?.severity).toBe("warn");
    expect(dup?.feedback).toContain("Bob");
  });

  it("does not flag genuinely distinct voices as duplicates", () => {
    const capsules = [
      makeCapsule({ name: "Alice", register: "warm", speechTics: ["hums an old lullaby mid-sentence"] }),
      makeCapsule({ name: "Bob", register: "cold", speechTics: ["names a precise hour for everything"] }),
    ];
    const r = checkVoiceCapsules(capsules);
    expect(r.metrics.duplicatePairs).toBe(0);
  });

  it("never throws on malformed input", () => {
    expect(() => checkVoiceCapsules(null)).not.toThrow();
    expect(() => checkVoiceCapsules(undefined)).not.toThrow();
    expect(() => checkVoiceCapsules([] as VoiceCapsule[])).not.toThrow();
    expect(() =>
      checkVoiceCapsules([
        null as unknown as VoiceCapsule,
        { name: 5, speechTics: "nope" } as unknown as VoiceCapsule,
        makeCapsule({ name: "OK" }),
      ]),
    ).not.toThrow();

    const r = checkVoiceCapsules(null);
    expect(r.metrics.count).toBe(0);
    expect(r.ok).toBe(true);
  });

  it("round-trips: extractVoiceCapsule output passes the checker", () => {
    const capsules = [
      extractVoiceCapsule(
        makeProfile({
          name: "Edmund Crale",
          speechMannerisms: "answers in clipped legal phrases; softens into idiom when pressed",
        }),
      ),
      extractVoiceCapsule(
        makeProfile({
          name: "Vivienne Ashe",
          speechMannerisms: "florid, ornate flourishes; lingers on grand adjectives",
          internalConflict: "cannot afford the house she will not give up",
        }),
      ),
    ];
    const r = checkVoiceCapsules(capsules);
    expect(r.ok).toBe(true);
    expect(r.metrics.deployableCount).toBe(2);
    expect(r.metrics.duplicatePairs).toBe(0);
  });
});
