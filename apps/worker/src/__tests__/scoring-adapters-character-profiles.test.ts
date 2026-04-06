import { describe, expect, it } from "vitest";
import { adaptCharacterProfilesForScoring } from "../jobs/scoring-adapters/index.js";

const BASE_PROFILE = {
  name: "Inspector Thorne",
  summary: "A seasoned detective with an eye for detail.",
  publicPersona: "Known throughout the county as a methodical, unflappable investigator.",
  privateSecret: "Harbours a deep guilt over a case he let go cold twenty years ago.",
  motiveSeed: "Wants to restore his reputation after a public failure.",
  motiveStrength: "strong" as const,
  alibiWindow: "Was dining at the manor from 8pm until midnight.",
  accessPlausibility: "Had unescorted access to the east wing.",
  stakes: "His career and pension depend on solving this case.",
  humourStyle: "dry_wit" as const,
  speechMannerisms: "Long pauses before key observations.",
  paragraphs: [
    "Inspector Thorne has spent thirty years walking the thin line between patience and obsession. " +
      "His public image is one of quiet authority, though those who know him well detect a persistent " +
      "unease behind his eyes, as if the world is always one step ahead of him and he knows it.",
    "The cold case that haunts him — a missing child, a wrongly accused man, a file quietly closed — " +
      "is never far from his thoughts. He keeps a copy of the original case notes in a locked drawer " +
      "and reviews them each anniversary, adding nothing, changing nothing, only reading.",
    "His motive in the current case is partly professional and partly personal. The victim was " +
      "connected to the old affair, and Thorne suspects that solving one will finally unlock the other. " +
      "He is methodical where others are impulsive, and patient where others grow frustrated.",
    "Should he fail, Thorne faces enforced retirement and the permanent closure of the cold case. " +
      "He has no family to fall back on, no savings beyond his pension, and no identity outside the badge.",
  ],
} as any;

describe("adaptCharacterProfilesForScoring — Phase 1 fixes", () => {
  describe("1a: humour style richness", () => {
    it("expands short enum values to >20 char descriptions", () => {
      const result = adaptCharacterProfilesForScoring([BASE_PROFILE]);
      const profile = result.character_profiles[0];
      expect(profile.humour_style).toBeDefined();
      expect(profile.humour_style!.length).toBeGreaterThan(20);
      expect(profile.humour_style).toContain("Dry wit");
    });

    it("expands all known humour style enums", () => {
      const styles = [
        "understatement",
        "dry_wit",
        "polite_savagery",
        "self_deprecating",
        "observational",
        "deadpan",
        "sardonic",
        "blunt",
      ] as const;

      for (const style of styles) {
        const result = adaptCharacterProfilesForScoring([
          { ...BASE_PROFILE, humourStyle: style },
        ]);
        const profile = result.character_profiles[0];
        expect(profile.humour_style, `${style} should expand`).toBeDefined();
        expect(profile.humour_style!.length, `${style} description too short`).toBeGreaterThan(20);
      }
    });

    it("omits humour_style entirely when value is 'none'", () => {
      const result = adaptCharacterProfilesForScoring([
        { ...BASE_PROFILE, humourStyle: "none" },
      ]);
      expect(result.character_profiles[0].humour_style).toBeUndefined();
    });

    it("omits humour_style entirely when field is absent", () => {
      const result = adaptCharacterProfilesForScoring([
        { ...BASE_PROFILE, humourStyle: undefined },
      ]);
      expect(result.character_profiles[0].humour_style).toBeUndefined();
    });
  });

  describe("1b: profile narrative depth via paragraphs[]", () => {
    it("public_persona includes paragraphs[0]", () => {
      const result = adaptCharacterProfilesForScoring([BASE_PROFILE]);
      const { public_persona } = result.character_profiles[0];
      expect(public_persona).toContain("thirty years walking the thin line");
      // Fixture: publicPersona (~9 words) + paragraphs[0] (~50 words) ≥ 40-word tier
      expect(public_persona!.split(/\s+/).length).toBeGreaterThanOrEqual(40);
    });

    it("private_secrets includes paragraphs[1]", () => {
      const result = adaptCharacterProfilesForScoring([BASE_PROFILE]);
      const { private_secrets } = result.character_profiles[0];
      expect(private_secrets).toContain("locked drawer");
      expect(private_secrets!.split(/\s+/).length).toBeGreaterThanOrEqual(40);
    });

    it("motive_and_alibi includes motiveSeed, alibi, access, motiveStrength, and paragraphs[2]", () => {
      const result = adaptCharacterProfilesForScoring([BASE_PROFILE]);
      const { motive_and_alibi } = result.character_profiles[0];
      expect(motive_and_alibi).toContain("restore his reputation");
      expect(motive_and_alibi).toContain("Alibi:");
      expect(motive_and_alibi).toContain("Access:");
      expect(motive_and_alibi).toContain("Motive strength: strong");
      expect(motive_and_alibi).toContain("partly professional");
      expect(motive_and_alibi!.split(/\s+/).length).toBeGreaterThanOrEqual(40);
    });

    it("stakes includes paragraphs[3]", () => {
      const result = adaptCharacterProfilesForScoring([BASE_PROFILE]);
      const { stakes } = result.character_profiles[0];
      expect(stakes).toContain("enforced retirement");
      expect(stakes!.split(/\s+/).length).toBeGreaterThanOrEqual(20);
    });
  });
});
