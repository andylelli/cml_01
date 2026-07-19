import { describe, expect, it } from "vitest";
import { isVictimArchetype } from "@cml/cml";

// Abort class #10 (2026-07-19, P5-CR poison arm, mystery-1784460757946): role_archetype
// "Friend of the victim" satisfied every `role.includes("victim")` predicate, so a LIVING cast
// member was prompted as "DECEASED, past-tense only", convicted by the lifecycle validator, and
// reframed by the rescue pass — reader-trust criticals → gate failed. The predicate must match
// what the role DENOTES (victim as head noun), not any mention of the word.
describe("isVictimArchetype — head-noun semantics", () => {
  it("denoting roles match", () => {
    expect(isVictimArchetype("Victim")).toBe(true);
    expect(isVictimArchetype("victim")).toBe(true);
    expect(isVictimArchetype("The victim")).toBe(true);
    expect(isVictimArchetype("Murder victim")).toBe(true);
    expect(isVictimArchetype("Second victim")).toBe(true);
    expect(isVictimArchetype("Victim (poisoned)")).toBe(true);
    expect(isVictimArchetype("Victim of the poisoning")).toBe(true);
    expect(isVictimArchetype("victim, hotel guest")).toBe(true);
  });

  it("class-#10 fixture and its relational siblings do NOT match", () => {
    expect(isVictimArchetype("Friend of the victim")).toBe(false);
    expect(isVictimArchetype("Victim's confidant")).toBe(false);
    expect(isVictimArchetype("victim advocate")).toBe(false);
    expect(isVictimArchetype("Sister of the victim")).toBe(false);
    expect(isVictimArchetype("Widow; friend of the victim")).toBe(false);
  });

  it("non-victim roles and junk do NOT match", () => {
    expect(isVictimArchetype("Businesswoman")).toBe(false);
    expect(isVictimArchetype("Family Rival")).toBe(false);
    expect(isVictimArchetype("Detective")).toBe(false);
    expect(isVictimArchetype("")).toBe(false);
    expect(isVictimArchetype(undefined)).toBe(false);
    expect(isVictimArchetype(null)).toBe(false);
  });
});
