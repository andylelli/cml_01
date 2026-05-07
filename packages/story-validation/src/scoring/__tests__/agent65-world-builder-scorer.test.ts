import { describe, expect, it } from "vitest";
import { Agent65WorldBuilderScorer } from "../phase-scorers/agent65-world-builder-scorer.js";

const REQUIRED_HUMOUR_POSITIONS = [
  "opening_scene",
  "first_investigation",
  "body_discovery",
  "first_interview",
  "domestic_scene",
  "mid_investigation",
  "second_interview",
  "tension_scene",
  "pre_climax",
  "discriminating_test",
  "revelation",
  "resolution",
] as const;

function buildValidOutput(storyTheme: string) {
  return {
    status: "final",
    storyTheme,
    historicalMoment: {
      specificDate: "1934-03",
      eraRegister: "A historically grounded month-level snapshot with social pressure and practical constraints.",
      currentTensions: ["Economic stress", "Political uncertainty", "Class friction"],
      physicalConstraints: ["Limited communication", "Travel friction", "Isolation"],
      emotionalRegister: "Anxious but resolute",
    },
    characterPortraits: [{ name: "Eleanor Voss", portrait: "Portrait text", eraIntersection: "Era overlap" }],
    characterVoiceSketches: [
      {
        name: "Eleanor Voss",
        voiceDescription: "Measured and observant",
        fragments: [
          { register: "comfortable", text: "One" },
          { register: "evasive", text: "Two" },
          { register: "stressed", text: "Three" },
        ],
      },
    ],
    locationRegisters: [{ locationId: "library", emotionalRegister: "Charged", cameraAngle: "Close" }],
    storyEmotionalArc: {
      dominantRegister: "Tense",
      arcDescription: new Array(220).fill("emotion").join(" "),
      turningPoints: [
        { position: "opening", emotionalDescription: "a" },
        { position: "early", emotionalDescription: "a" },
        { position: "first_turn", emotionalDescription: "a" },
        { position: "mid", emotionalDescription: "a" },
        { position: "second_turn", emotionalDescription: "a" },
        { position: "pre_climax", emotionalDescription: "a" },
        { position: "climax", emotionalDescription: "a" },
        { position: "resolution", emotionalDescription: "a" },
      ],
      endingNote: "Reflective",
    },
    humourPlacementMap: REQUIRED_HUMOUR_POSITIONS.map((position) => ({
      scenePosition: position,
      humourPermission:
        position === "body_discovery" || position === "discriminating_test" || position === "revelation"
          ? "forbidden"
          : "permitted",
      rationale: "Contract rationale",
    })),
    breakMoment: {
      character: "Eleanor Voss",
      scenePosition: "tension_scene",
      form: "Voice cracks",
      narrativeFunction: "Signals emotional cost",
    },
    revealImplications: "The reveal recontextualizes earlier moments and sharpens accountability.",
    validationConfirmations: {
      noNewCharacterFacts: true,
      noNewPlotFacts: true,
      castComplete: true,
      eraSpecific: true,
      lockedFactsPreserved: true,
      humourMapComplete: true,
    },
  };
}

describe("Agent65WorldBuilderScorer storyTheme gate alignment", () => {
  it("flags sub-25-word storyTheme", async () => {
    const scorer = new Agent65WorldBuilderScorer();
    const output = buildValidOutput(
      "In The Clockwork Deception, class tensions and personal ambition reveal how secrets fracture trust and lead to dire consequences.",
    );

    const score = await scorer.score({}, output as any, { castSize: 1 } as any);
    const themeTest = score.tests.find((entry) => entry.name === "storyTheme ≥25 words");

    expect(themeTest).toBeDefined();
    expect(themeTest?.passed).toBe(false);
    expect(themeTest?.message ?? "").toContain("storyTheme has 19 words");
  });

  it("passes 25-word storyTheme", async () => {
    const scorer = new Agent65WorldBuilderScorer();
    const output = buildValidOutput(
      "At its core, this mystery shows that protecting status through deception delays justice, until visible evidence forces every participant to accept responsibility for the human harm created.",
    );

    const score = await scorer.score({}, output as any, { castSize: 1 } as any);
    const themeTest = score.tests.find((entry) => entry.name === "storyTheme ≥25 words");

    expect(themeTest).toBeDefined();
    expect(themeTest?.passed).toBe(true);
  });
});
