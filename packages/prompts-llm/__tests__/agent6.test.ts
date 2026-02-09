/**
 * Unit tests for Agent 6: Fair Play Auditor
 */

import { describe, it, expect } from "vitest";
import { buildFairPlayPrompt } from "../src/agent6-fairplay.js";
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
      key_details: ["Gaslight era", "Telegraph communication"],
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
      evidence_sensitivity: [
        {
          evidence_type: "temporal",
          vulnerability: "Was seen at the club at 11:30 PM",
        },
      ],
    },
    {
      character_id: "butler",
      name: "Jenkins",
      role: "suspect",
      access_level: "routine",
      evidence_sensitivity: [
        {
          evidence_type: "physical",
          vulnerability: "Has key to study",
        },
      ],
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
      {
        type: "elimination",
        observation: "Nephew seen at club at 11:30",
        reasoning: "Nephew couldn't reach manor by 11:45",
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
      description: "Victim heard alive at 11:45 PM by maid",
      sourceInCML: "constraint_space.time[0]",
      pointsTo: "Establishes time of death window",
      placement: "early",
      criticality: "essential",
    },
    {
      id: "clue_2",
      category: "physical",
      description: "Study door locked from inside with key in lock",
      sourceInCML: "constraint_space.access[0]",
      pointsTo: "Locked room mystery setup",
      placement: "early",
      criticality: "essential",
    },
    {
      id: "clue_3",
      category: "testimonial",
      description: "Nephew has alibi - seen at club at 11:30 PM",
      sourceInCML: "cast[nephew].evidence_sensitivity",
      pointsTo: "Eliminates nephew as suspect",
      placement: "mid",
      criticality: "essential",
    },
    {
      id: "clue_4",
      category: "physical",
      description: "Butler is left-handed (discriminating test)",
      sourceInCML: "inference_path.discriminating_test",
      pointsTo: "Matches bloodstain pattern",
      placement: "mid",
      criticality: "essential",
    },
    {
      id: "clue_5",
      category: "behavioral",
      description: "Butler nervous when asked about spare keys",
      sourceInCML: "cast[butler].evidence_sensitivity",
      pointsTo: "Butler has means to lock door from outside",
      placement: "late",
      criticality: "supporting",
    },
  ],
  redHerrings: [
    {
      id: "rh_1",
      description: "Window slightly ajar, suggesting outside entry",
      supportsAssumption: "Locked room was breached from outside",
      misdirection: "Window too small for human entry",
    },
  ],
  fairPlayChecks: {
    essentialCluesCount: 4,
    allCluesBeforeSolution: true,
    discriminatingTestPresent: true,
    noSpecialKnowledge: true,
  },
};

describe("Agent 6: Fair Play Auditor - Prompt Building", () => {
  it("generates complete prompt structure", () => {
    const prompt = buildFairPlayPrompt({
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

  it("includes fair play auditor role in system prompt", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.system).toContain("fair play auditor");
    expect(prompt.system).toContain("Detection Club");
    expect(prompt.system).toContain("All clues must be revealed");
  });

  it("lists the 7 core fair play rules", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    const rules = [
      "All clues must be revealed",
      "No special knowledge",
      "No information withheld",
      "logically deducible",
      "discriminating test",
      "No supernatural",
      "detective must not commit crimes",
    ];

    rules.forEach((rule) => {
      expect(prompt.system.toLowerCase()).toContain(rule.toLowerCase());
    });
  });

  it("includes mystery overview in developer prompt", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("The Clockwork Murder");
    expect(prompt.developer).toContain("temporal");
    expect(prompt.developer).toContain("Lord Ashford");
    expect(prompt.developer).toContain("Jenkins"); // Culprit name
  });

  it("extracts inference path steps", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Inference Path");
    expect(prompt.developer).toContain("locked from inside");
    expect(prompt.developer).toContain("butler has spare key");
    expect(prompt.developer).toContain("Nephew seen at club");
  });

  it("includes discriminating test details", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Discriminating Test");
    expect(prompt.developer).toContain("mid_act_2");
    expect(prompt.developer).toContain("butler is left-handed");
    expect(prompt.developer).toContain("handedness");
  });

  it("organizes clues by placement (early/mid/late)", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Early Clues (Act I)");
    expect(prompt.developer).toContain("Mid Clues (Act II)");
    expect(prompt.developer).toContain("Late Clues (Act III)");
    expect(prompt.developer).toContain("2 clues"); // 2 early clues
  });

  it("lists essential clues separately", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Essential Clues");
    expect(prompt.developer).toContain("heard alive at 11:45");
    expect(prompt.developer).toContain("locked from inside");
    expect(prompt.developer).toContain("left-handed");
  });

  it("includes red herrings", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Red Herrings");
    expect(prompt.developer).toContain("Window slightly ajar");
    expect(prompt.developer).toContain("Locked room was breached");
  });

  it("includes constraint space details", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Constraint Space");
    expect(prompt.developer).toContain("Temporal Constraints");
    expect(prompt.developer).toContain("Access Constraints");
    expect(prompt.developer).toContain("Physical Evidence");
    expect(prompt.developer).toContain("Bloodstain pattern");
  });

  it("includes cast evidence sensitivity", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.developer).toContain("Cast Evidence Sensitivity");
    expect(prompt.developer).toContain("Charles Ashford");
    expect(prompt.developer).toContain("seen at the club");
    expect(prompt.developer).toContain("Has key to study");
  });

  it("includes 9-point audit checklist in user prompt", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    const checklistItems = [
      "Clue Visibility",
      "Information Parity",
      "Special Knowledge",
      "Logical Deducibility",
      "Discriminating Test Timing",
      "No Withholding",
      "Constraint Consistency",
      "False Assumption Support",
      "Solution Uniqueness",
    ];

    checklistItems.forEach((item) => {
      expect(prompt.user).toContain(item);
    });
  });

  it("requests JSON output format", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("JSON object");
    expect(prompt.user).toContain("overallStatus");
    expect(prompt.user).toContain("checks");
    expect(prompt.user).toContain("violations");
    expect(prompt.user).toContain("warnings");
    expect(prompt.user).toContain("recommendations");
  });

  it("specifies severity levels for violations", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("critical");
    expect(prompt.user).toContain("moderate");
    expect(prompt.user).toContain("minor");
  });

  it("requests specific location information for violations", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("location");
    expect(prompt.user).toContain("Where in the CML/clues");
  });

  it("emphasizes thoroughness and specificity", () => {
    const prompt = buildFairPlayPrompt({
      caseData: mockCaseData,
      clues: mockClues,
    });

    expect(prompt.user).toContain("thorough");
    expect(prompt.user).toContain("specific");
    expect(prompt.user).toContain("exactly what's wrong");
    expect(prompt.user).toContain("how to fix it");
  });
});
