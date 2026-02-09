/**
 * Unit tests for Agent 7: Narrative Formatter
 */

import { describe, it, expect } from "vitest";
import { buildNarrativePrompt } from "../src/agent7-narrative.js";
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult } from "../src/agent5-clues.js";

// Mock CML data
const mockCaseData: CaseData = {
  meta: {
    title: "The Clockwork Murder",
    primary_axis: "temporal",
    schema_version: "2.0",
  },
  setup: {
    era: {
      year: 1895,
      location: "Victorian London",
      key_details: ["Gaslight streets", "Telegraph communication", "Hansom cabs"],
    },
    crime: {
      description: "Lord Ashford found stabbed in his locked study",
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
      character_id: "nephew",
      name: "Charles Ashford",
      role: "suspect",
      access_level: "routine",
    },
    {
      character_id: "butler",
      name: "Jenkins",
      role: "suspect",
      access_level: "routine",
    },
  ],
  constraint_space: {
    time: [
      {
        description: "Victim heard alive at 11:45 PM",
        constraint_type: "establishes_boundary",
      },
      {
        description: "Body discovered at midnight",
        constraint_type: "eliminates",
      },
    ],
    access: [
      {
        description: "Study door locked from inside",
        constraint_type: "physical_barrier",
      },
    ],
    physical: [
      {
        description: "Bloodstain pattern indicates left-handed attacker",
        constraint_type: "narrows",
      },
    ],
  },
  inference_path: {
    steps: [
      {
        type: "observation",
        observation: "Study locked from inside, no other exit",
        reasoning: "Killer must have locked door after exiting",
      },
      {
        type: "constraint",
        observation: "Only butler has spare key",
        reasoning: "Butler could lock door from outside",
      },
    ],
    discriminating_test: {
      when: "mid_act_2",
      test: "Detective finds butler is left-handed",
      reveals: "Physical evidence matches butler's handedness",
    },
  },
  solution: {
    culprit: {
      character_id: "butler",
      motive: "Blackmail victim threatened to expose butler's past",
      method: "Stabbed victim, locked door from outside with spare key",
    },
    false_assumption: {
      description: "Reader assumes locked room means suicide or accident",
      when_revealed: "mid_act_2",
    },
  },
};

// Mock clue distribution
const mockClues: ClueDistributionResult = {
  clues: [
    {
      id: "clue_1",
      category: "temporal",
      description: "Victim heard alive at 11:45 PM",
      sourceInCML: "constraint_space.time[0]",
      pointsTo: "Time of death window",
      placement: "early",
      criticality: "essential",
    },
    {
      id: "clue_2",
      category: "physical",
      description: "Study door locked from inside",
      sourceInCML: "constraint_space.access[0]",
      pointsTo: "Locked room setup",
      placement: "early",
      criticality: "essential",
    },
    {
      id: "clue_3",
      category: "testimonial",
      description: "Nephew has alibi at club",
      sourceInCML: "cast[nephew].evidence_sensitivity",
      pointsTo: "Eliminates nephew",
      placement: "mid",
      criticality: "essential",
    },
    {
      id: "clue_4",
      category: "physical",
      description: "Butler is left-handed",
      sourceInCML: "inference_path.discriminating_test",
      pointsTo: "Matches evidence",
      placement: "mid",
      criticality: "essential",
    },
  ],
  redHerrings: [
    {
      id: "rh_1",
      description: "Window slightly ajar",
      supportsAssumption: "Outside entry possible",
      misdirection: "Window too small",
    },
  ],
  fairPlayChecks: {
    essentialCluesCount: 4,
    allCluesBeforeSolution: true,
    discriminatingTestPresent: true,
    noSpecialKnowledge: true,
  },
};

describe("Agent 7: Narrative Formatter - Prompt Building", () => {
  it("generates complete prompt structure", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.system).toBeDefined();
    expect(prompt.developer).toBeDefined();
    expect(prompt.user).toBeDefined();
    expect(prompt.system.length).toBeGreaterThan(100);
    expect(prompt.developer.length).toBeGreaterThan(100);
    expect(prompt.user.length).toBeGreaterThan(100);
  });

  it("includes narrative architect role in system prompt", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.system).toContain("narrative architect");
    expect(prompt.system).toContain("Three-act structure");
    expect(prompt.system).toContain("scene-by-scene outline");
  });

  it("describes mystery storytelling craft principles", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    const principles = [
      "Setup, Investigation, Resolution",
      "Pacing",
      "Character development",
      "Atmosphere",
      "Fair play",
      "Dramatic irony",
    ];

    principles.forEach((principle) => {
      expect(prompt.system).toContain(principle);
    });
  });

  it("includes mystery overview in developer prompt", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("The Clockwork Murder");
    expect(prompt.developer).toContain("1895 - Victorian London");
    expect(prompt.developer).toContain("temporal");
    expect(prompt.developer).toContain("Lord Ashford");
    expect(prompt.developer).toContain("Jenkins");
  });

  it("includes false assumption and reveal timing", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("The False Assumption");
    expect(prompt.developer).toContain("locked room means suicide");
    expect(prompt.developer).toContain("mid_act_2");
  });

  it("lists cast with roles", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Cast of Characters");
    expect(prompt.developer).toContain("Inspector Lestrade");
    expect(prompt.developer).toContain("Detective");
    expect(prompt.developer).toContain("Charles Ashford");
    expect(prompt.developer).toContain("Suspect");
  });

  it("includes inference path steps", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Detective's Inference Path");
    expect(prompt.developer).toContain("locked from inside");
    expect(prompt.developer).toContain("butler has spare key");
  });

  it("includes discriminating test details", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("The Discriminating Test");
    expect(prompt.developer).toContain("mid_act_2");
    expect(prompt.developer).toContain("butler is left-handed");
  });

  it("organizes clues by act placement", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Early Clues (Act I)");
    expect(prompt.developer).toContain("Mid Clues (Act II)");
    expect(prompt.developer).toContain("Late Clues (Act III)");
    expect(prompt.developer).toContain("clue_1");
    expect(prompt.developer).toContain("clue_2");
  });

  it("includes red herrings with IDs", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Red Herrings");
    expect(prompt.developer).toContain("rh_1");
    expect(prompt.developer).toContain("Window slightly ajar");
  });

  it("includes key constraints (time and access)", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Key Constraints");
    expect(prompt.developer).toContain("Temporal");
    expect(prompt.developer).toContain("Access");
    expect(prompt.developer).toContain("heard alive at 11:45");
    expect(prompt.developer).toContain("locked from inside");
  });

  it("includes era details for atmosphere", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Era Details");
    expect(prompt.developer).toContain("Gaslight streets");
    expect(prompt.developer).toContain("Telegraph communication");
    expect(prompt.developer).toContain("Hansom cabs");
  });

  it("supports short length target", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
      targetLength: "short",
    });

    expect(prompt.user).toContain("short");
    expect(prompt.user).toContain("15-25 scenes");
    expect(prompt.user).toContain("novella");
  });

  it("supports medium length target (default)", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
      targetLength: "medium",
    });

    expect(prompt.user).toContain("medium");
    expect(prompt.user).toContain("25-35 scenes");
    expect(prompt.user).toContain("40,000-60,000 words");
  });

  it("supports long length target", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
      targetLength: "long",
    });

    expect(prompt.user).toContain("long");
    expect(prompt.user).toContain("35-50 scenes");
    expect(prompt.user).toContain("70,000-100,000 words");
  });

  it("supports classic narrative style (default)", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
      narrativeStyle: "classic",
    });

    expect(prompt.user).toContain("classic");
    expect(prompt.user).toContain("Golden Age");
    expect(prompt.user).toContain("rational deduction");
  });

  it("supports modern narrative style", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
      narrativeStyle: "modern",
    });

    expect(prompt.user).toContain("modern");
    expect(prompt.user).toContain("Contemporary mystery");
    expect(prompt.user).toContain("character-driven");
  });

  it("supports atmospheric narrative style", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
      narrativeStyle: "atmospheric",
    });

    expect(prompt.user).toContain("atmospheric");
    expect(prompt.user).toContain("Gothic/noir");
    expect(prompt.user).toContain("mood and setting");
  });

  it("provides three-act structure guidelines", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("Act I: Setup");
    expect(prompt.user).toContain("25-30% of scenes");
    expect(prompt.user).toContain("Act II: Investigation");
    expect(prompt.user).toContain("45-50% of scenes");
    expect(prompt.user).toContain("Act III: Resolution");
    expect(prompt.user).toContain("20-25% of scenes");
  });

  it("specifies scene requirements", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    const requirements = [
      "Setting",
      "Characters present",
      "Purpose",
      "Clues revealed",
      "Dramatic elements",
      "Summary",
    ];

    requirements.forEach((req) => {
      expect(prompt.user).toContain(req);
    });
  });

  it("includes pacing principles", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("Pacing Principles");
    expect(prompt.user).toContain("action");
    expect(prompt.user).toContain("reflection");
    expect(prompt.user).toContain("Space clues evenly");
    expect(prompt.user).toContain("Build tension");
  });

  it("requests JSON output with acts array", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("JSON object");
    expect(prompt.user).toContain("acts");
    expect(prompt.user).toContain("actNumber");
    expect(prompt.user).toContain("scenes");
  });

  it("includes scene structure in JSON schema", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("sceneNumber");
    expect(prompt.user).toContain("setting");
    expect(prompt.user).toContain("location");
    expect(prompt.user).toContain("timeOfDay");
    expect(prompt.user).toContain("atmosphere");
    expect(prompt.user).toContain("cluesRevealed");
    expect(prompt.user).toContain("dramaticElements");
    expect(prompt.user).toContain("estimatedWordCount");
  });

  it("includes totalScenes and estimatedTotalWords in output", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("totalScenes");
    expect(prompt.user).toContain("estimatedTotalWords");
    expect(prompt.user).toContain("pacingNotes");
  });

  it("provides example scene structure", () => {
    const prompt = buildNarrativePrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("Discovery");
    expect(prompt.user).toContain("Lord Ashford's study");
    expect(prompt.user).toContain("Morning after the murder");
    expect(prompt.user).toContain("detective");
    expect(prompt.user).toContain("Locked room mystery established");
  });
});
