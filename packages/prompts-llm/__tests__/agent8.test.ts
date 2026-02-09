/**
 * Unit tests for Agent 8: Novelty Auditor
 */

import { describe, it, expect } from "vitest";
import { buildNoveltyPrompt } from "../src/agent8-novelty.js";
import type { CaseData } from "@cml/cml";

// Mock generated CML
const mockGeneratedCML: CaseData = {
  meta: {
    title: "The Clockwork Murder",
    primary_axis: "temporal",
    schema_version: "2.0",
  },
  setup: {
    era: {
      year: 1895,
      location: "Victorian London",
      key_details: ["Gaslight streets", "Telegraph", "Hansom cabs"],
    },
    crime: {
      description: "Lord Ashford found stabbed in locked study",
      victim: "Lord Ashford",
      method: "stabbed",
      location: "Locked study",
      when: "11:47 PM",
    },
  },
  cast: [
    {
      character_id: "detective",
      name: "Inspector Lestrade",
      role: "detective",
      access_level: "full",
    },
    {
      character_id: "butler",
      name: "Jenkins",
      role: "suspect",
      access_level: "routine",
    },
  ],
  constraint_space: {
    time: [{ description: "Victim heard alive at 11:45 PM", constraint_type: "establishes_boundary" }],
    access: [{ description: "Study locked from inside", constraint_type: "physical_barrier" }],
    physical: [{ description: "Bloodstain indicates left-handed attacker", constraint_type: "narrows" }],
  },
  inference_path: {
    steps: [
      {
        type: "observation",
        observation: "Study locked, no other exit",
        reasoning: "Killer locked door from outside",
      },
    ],
    discriminating_test: {
      when: "mid_act_2",
      test: "Butler is left-handed",
      reveals: "Matches physical evidence",
    },
  },
  solution: {
    culprit: {
      character_id: "butler",
      motive: "Blackmail - victim threatened exposure",
      method: "Stabbed victim, locked door with spare key",
    },
    false_assumption: {
      description: "Locked room suggests suicide",
      when_revealed: "mid_act_2",
    },
  },
};

// Mock seed CML 1
const mockSeedCML1: CaseData = {
  meta: {
    title: "The Moonstone",
    primary_axis: "spatial",
    schema_version: "2.0",
  },
  setup: {
    era: {
      year: 1868,
      location: "English Country Estate",
      key_details: ["Victorian era", "Country house", "Servants"],
    },
    crime: {
      description: "Moonstone diamond stolen from locked room",
      victim: "Rachel Verinder",
      method: "theft",
      location: "Bedroom",
      when: "Overnight",
    },
  },
  cast: [
    {
      character_id: "detective",
      name: "Sergeant Cuff",
      role: "detective",
      access_level: "full",
    },
    {
      character_id: "servant",
      name: "Rosanna Spearman",
      role: "suspect",
      access_level: "routine",
    },
  ],
  constraint_space: {
    time: [{ description: "Diamond seen at 10 PM", constraint_type: "establishes_boundary" }],
    access: [{ description: "Only three people had keys", constraint_type: "eliminates" }],
    physical: [{ description: "Paint stain on nightgown", constraint_type: "narrows" }],
  },
  inference_path: {
    steps: [
      {
        type: "observation",
        observation: "Paint stain links to theft",
        reasoning: "Thief touched wet paint",
      },
    ],
    discriminating_test: {
      when: "late_act_2",
      test: "Finding the painted door",
      reveals: "Thief's route",
    },
  },
  solution: {
    culprit: {
      character_id: "servant",
      motive: "Love - protecting the real culprit",
      method: "Moved diamond while sleepwalking",
    },
    false_assumption: {
      description: "External thief theory",
      when_revealed: "late_act_2",
    },
  },
};

// Mock seed CML 2 - Similar to generated
const mockSeedCML2: CaseData = {
  meta: {
    title: "The Locked Study Mystery",
    primary_axis: "temporal",
    schema_version: "2.0",
  },
  setup: {
    era: {
      year: 1892,
      location: "Victorian London",
      key_details: ["Gaslight", "Victorian society", "Scotland Yard"],
    },
    crime: {
      description: "Nobleman killed in locked study",
      victim: "Lord Pemberton",
      method: "stabbed",
      location: "Study",
      when: "Night",
    },
  },
  cast: [
    {
      character_id: "detective",
      name: "Inspector Gregson",
      role: "detective",
      access_level: "full",
    },
    {
      character_id: "servant",
      name: "Harrison",
      role: "suspect",
      access_level: "routine",
    },
  ],
  constraint_space: {
    time: [{ description: "Victim alive at 11:30 PM", constraint_type: "establishes_boundary" }],
    access: [{ description: "Door locked from inside", constraint_type: "physical_barrier" }],
    physical: [{ description: "Weapon suggests right-handed attacker", constraint_type: "narrows" }],
  },
  inference_path: {
    steps: [
      {
        type: "observation",
        observation: "Locked door, no exit",
        reasoning: "Must be locked from outside",
      },
    ],
    discriminating_test: {
      when: "mid_act_2",
      test: "Servant has spare key",
      reveals: "Means to lock from outside",
    },
  },
  solution: {
    culprit: {
      character_id: "servant",
      motive: "Revenge for past wrongs",
      method: "Killed victim, locked door with key",
    },
    false_assumption: {
      description: "Locked room indicates suicide",
      when_revealed: "mid_act_2",
    },
  },
};

const mockSeedCMLs = [mockSeedCML1, mockSeedCML2];

describe("Agent 8: Novelty Auditor - Prompt Building", () => {
  it("generates complete prompt structure", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.system).toBeDefined();
    expect(prompt.developer).toBeDefined();
    expect(prompt.user).toBeDefined();
    expect(prompt.system.length).toBeGreaterThan(100);
    expect(prompt.developer.length).toBeGreaterThan(100);
    expect(prompt.user.length).toBeGreaterThan(100);
  });

  it("includes similarity detection specialist role in system prompt", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.system).toContain("similarity detection specialist");
    expect(prompt.system).toContain("ensure sufficient novelty");
    expect(prompt.system).toContain("structural inspiration only");
  });

  it("distinguishes allowed vs not allowed copying", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.system).toContain("What IS allowed");
    expect(prompt.system).toContain("What is NOT allowed");
    expect(prompt.system).toContain("structural patterns");
    expect(prompt.system).toContain("Identical or near-identical");
  });

  it("lists specific copying violations", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    const violations = [
      "same crime, method, motive",
      "Character names",
      "same era + location",
      "same culprit type",
      "false assumption",
    ];

    violations.forEach((v) => {
      expect(prompt.system.toLowerCase()).toContain(v.toLowerCase());
    });
  });

  it("includes generated mystery summary in developer prompt", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.developer).toContain("Generated Mystery");
    expect(prompt.developer).toContain("The Clockwork Murder");
    expect(prompt.developer).toContain("1895 - Victorian London");
    expect(prompt.developer).toContain("Lord Ashford");
  });

  it("includes all seed CML summaries", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.developer).toContain("Seed CML Examples");
    expect(prompt.developer).toContain("Seed 1");
    expect(prompt.developer).toContain("Seed 2");
    expect(prompt.developer).toContain("The Moonstone");
    expect(prompt.developer).toContain("The Locked Study Mystery");
  });

  it("summarizes key CML attributes for comparison", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    // Should include title, era, crime, cast, culprit, motive, false assumption, test
    expect(prompt.developer).toContain("**Primary Axis**:");
    expect(prompt.developer).toContain("**Era & Setting**:");
    expect(prompt.developer).toContain("**Crime**:");
    expect(prompt.developer).toContain("**Culprit**:");
    expect(prompt.developer).toContain("**Motive**:");
    expect(prompt.developer).toContain("**False Assumption**:");
    expect(prompt.developer).toContain("**Discriminating Test**:");
  });

  it("lists 5 similarity dimensions in user prompt", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("Similarity Dimensions");
    expect(prompt.user).toContain("1. Plot Similarity");
    expect(prompt.user).toContain("2. Character Similarity");
    expect(prompt.user).toContain("3. Setting Similarity");
    expect(prompt.user).toContain("4. Solution Similarity");
    expect(prompt.user).toContain("5. Structural Similarity");
  });

  it("defines plot similarity criteria", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("Plot Similarity");
    expect(prompt.user).toContain("Same crime type");
    expect(prompt.user).toContain("Same crime method");
    expect(prompt.user).toContain("Same victim profile");
  });

  it("defines character similarity criteria", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("Character Similarity");
    expect(prompt.user).toContain("Same or similar character names");
    expect(prompt.user).toContain("Same character role combinations");
    expect(prompt.user).toContain("Same relationship dynamics");
  });

  it("defines setting similarity criteria", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("Setting Similarity");
    expect(prompt.user).toContain("Same era");
    expect(prompt.user).toContain("Same location");
    expect(prompt.user).toContain("Same era details");
  });

  it("defines solution similarity criteria", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("Solution Similarity");
    expect(prompt.user).toContain("Same culprit profile");
    expect(prompt.user).toContain("Same motive category");
    expect(prompt.user).toContain("Same false assumption");
    expect(prompt.user).toContain("Same discriminating test");
  });

  it("defines structural similarity criteria", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("Structural Similarity");
    expect(prompt.user).toContain("inference path length");
    expect(prompt.user).toContain("constraint counts");
    expect(prompt.user).toContain("cast size");
  });

  it("explains weighted similarity scoring", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("Overall Similarity");
    expect(prompt.user).toContain("weighted average");
    expect(prompt.user).toContain("Plot: 30%");
    expect(prompt.user).toContain("Characters: 25%");
    expect(prompt.user).toContain("Solution: 25%");
  });

  it("uses default similarity threshold of 0.7 (70%)", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("70%");
    expect(prompt.user).toContain("Pass/Fail Threshold");
  });

  it("supports custom similarity threshold", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
      similarityThreshold: 0.6,
    });

    expect(prompt.user).toContain("60%");
  });

  it("defines pass/fail/warning status levels", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("- **Pass**:");
    expect(prompt.user).toContain("- **Warning**:");
    expect(prompt.user).toContain("- **Fail**:");
  });

  it("requests JSON output with similarity scores", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("JSON object");
    expect(prompt.user).toContain("status");
    expect(prompt.user).toContain("overallNovelty");
    expect(prompt.user).toContain("mostSimilarSeed");
    expect(prompt.user).toContain("similarityScores");
  });

  it("includes similarity score structure in JSON schema", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("seedTitle");
    expect(prompt.user).toContain("overallSimilarity");
    expect(prompt.user).toContain("plotSimilarity");
    expect(prompt.user).toContain("characterSimilarity");
    expect(prompt.user).toContain("settingSimilarity");
    expect(prompt.user).toContain("solutionSimilarity");
    expect(prompt.user).toContain("structuralSimilarity");
    expect(prompt.user).toContain("concerningMatches");
  });

  it("requests violations and warnings lists", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("violations");
    expect(prompt.user).toContain("warnings");
    expect(prompt.user).toContain("recommendations");
  });

  it("emphasizes specificity in similarity reporting", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("specific");
    expect(prompt.user).toContain("what similarities exist");
    expect(prompt.user).toContain("whether they violate");
  });

  it("provides example similarity report", () => {
    const prompt = buildNoveltyPrompt({
      generatedCML: mockGeneratedCML,
      seedCMLs: mockSeedCMLs,
    });

    expect(prompt.user).toContain("The Moonstone");
    expect(prompt.user).toContain("0.62");
    expect(prompt.user).toContain("Same era (Victorian England)");
  });
});
