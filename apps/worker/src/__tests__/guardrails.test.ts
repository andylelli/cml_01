/**
 * WP10: Unit tests for inference path coverage guardrails
 * 
 * Tests the deterministic guardrail logic from the mystery orchestrator.
 * Since the guardrail functions are module-internal, we replicate the core
 * logic here for isolated testing.
 */
import { describe, expect, it } from "vitest";

// ==========================================================================
// Minimal type stubs matching the orchestrator's internal types
// ==========================================================================
type ClueGuardrailIssue = { severity: "critical" | "warning"; message: string };

interface Clue {
  id: string;
  description: string;
  placement: "early" | "mid" | "late";
  criticality: "essential" | "supporting" | "optional";
  category: string;
  pointsTo: string;
  sourceInCML?: string;
  supportsInferenceStep?: number;
  evidenceType?: "observation" | "contradiction" | "elimination";
}

interface RedHerring {
  description: string;
  supportsAssumption: string;
}

interface ClueDistributionResult {
  clues: Clue[];
  redHerrings: RedHerring[];
  clueTimeline: Record<string, string[]>;
  fairPlayChecks: any;
  cost: number;
  durationMs: number;
}

// ==========================================================================
// Replicated guardrail functions (mirrors orchestrator internals)
// ==========================================================================

interface InferenceCoverageResult {
  issues: ClueGuardrailIssue[];
  coverageMap: Map<number, { observation: boolean; contradiction: boolean; elimination: boolean }>;
  uncoveredSteps: number[];
  hasCriticalGaps: boolean;
}

const checkInferencePathCoverage = (cml: any, clues: ClueDistributionResult): InferenceCoverageResult => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = cml?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];

  if (!Array.isArray(steps) || steps.length === 0) {
    issues.push({ severity: "critical", message: "No inference_path steps found in CML" });
    return { issues, coverageMap: new Map(), uncoveredSteps: [], hasCriticalGaps: true };
  }

  const coverageMap = new Map<number, { observation: boolean; contradiction: boolean; elimination: boolean }>();
  for (let i = 0; i < steps.length; i++) {
    coverageMap.set(i + 1, { observation: false, contradiction: false, elimination: false });
  }

  for (const clue of clues.clues) {
    const stepNum = clue.supportsInferenceStep;
    if (stepNum && coverageMap.has(stepNum)) {
      const coverage = coverageMap.get(stepNum)!;
      const evidenceType = clue.evidenceType || "observation";
      if (evidenceType in coverage) {
        (coverage as any)[evidenceType] = true;
      }
    }
  }

  const uncoveredSteps: number[] = [];
  for (const [stepNum, coverage] of coverageMap) {
    if (!coverage.observation) {
      uncoveredSteps.push(stepNum);
      issues.push({ severity: "critical", message: `Inference step ${stepNum} has NO covering clue` });
    }
    if (!coverage.contradiction) {
      issues.push({ severity: "warning", message: `Inference step ${stepNum} has no contradiction clue` });
    }
  }

  return { issues, coverageMap, uncoveredSteps, hasCriticalGaps: uncoveredSteps.length > 0 };
};

const checkContradictionPairs = (cml: any, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = cml?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];

  for (let i = 0; i < steps.length; i++) {
    const stepNum = i + 1;
    const stepClues = clues.clues.filter(c => c.supportsInferenceStep === stepNum);
    const evidenceTypes = new Set(stepClues.map(c => c.evidenceType || "observation"));

    if (stepClues.length >= 2 && evidenceTypes.has("observation") &&
        (evidenceTypes.has("contradiction") || evidenceTypes.has("elimination"))) {
      continue;
    }

    if (stepClues.length < 2) {
      issues.push({ severity: "warning", message: `Step ${stepNum} has only ${stepClues.length} mapped clue(s)` });
    }
  }

  return issues;
};

const checkFalseAssumptionContradiction = (cml: any, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = cml?.CASE ?? cml;
  const falseAssumption = caseBlock?.false_assumption?.statement || "";

  if (!falseAssumption) {
    issues.push({ severity: "critical", message: "No false_assumption.statement in CML" });
    return issues;
  }

  const contradictionClues = clues.clues.filter(c => c.evidenceType === "contradiction");
  if (contradictionClues.length === 0) {
    issues.push({ severity: "critical", message: "No clue with evidenceType=contradiction found" });
  }

  return issues;
};

const checkDiscriminatingTestReachability = (cml: any, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = cml?.CASE ?? cml;
  const discrimTest = caseBlock?.discriminating_test;

  if (!discrimTest?.design) {
    issues.push({ severity: "critical", message: "No discriminating_test.design in CML" });
    return issues;
  }

  const designText = (discrimTest.design || "").toLowerCase();
  const relevantClues = clues.clues.filter(c => {
    const clueText = c.description.toLowerCase();
    const testWords = designText.split(/\s+/).filter((w: string) => w.length > 4);
    const matchCount = testWords.filter((w: string) => clueText.includes(w)).length;
    return testWords.length > 0 && matchCount >= Math.ceil(testWords.length * 0.2);
  });

  if (relevantClues.length === 0) {
    issues.push({ severity: "critical", message: "Discriminating test references no evidence found in the clue set" });
  }

  return issues;
};

const checkSuspectElimination = (cml: any, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = cml?.CASE ?? cml;
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const culprits = caseBlock?.culpability?.culprits ?? [];

  const suspects = cast.filter((c: any) =>
    c.culprit_eligibility === "eligible" && !culprits.includes(c.name)
  );

  if (suspects.length === 0) return issues;

  const allClueText = clues.clues.map(c => c.description.toLowerCase()).join(" ");

  const uneliminable = suspects.filter((suspect: any) => {
    const name = (suspect.name || "").toLowerCase();
    const nameWords = name.split(/\s+/);
    return !nameWords.some((w: string) => w.length > 2 && allClueText.includes(w));
  });

  if (uneliminable.length > 0) {
    issues.push({ severity: "warning", message: `${uneliminable.length} suspect(s) are never referenced` });
  }

  return issues;
};

// ==========================================================================
// Test Helpers
// ==========================================================================

const makeClue = (overrides: Partial<Clue> = {}): Clue => ({
  id: "clue_001",
  description: "Test clue description",
  placement: "early",
  criticality: "essential",
  category: "physical",
  pointsTo: "suspect",
  ...overrides,
});

const makeClueSet = (clueOverrides: Partial<Clue>[] = []): ClueDistributionResult => ({
  clues: clueOverrides.map((o, i) => makeClue({ id: `clue_${i + 1}`, ...o })),
  redHerrings: [],
  clueTimeline: { early: [], mid: [], late: [] },
  fairPlayChecks: {},
  cost: 0,
  durationMs: 0,
});

const makeCml = (overrides: any = {}): any => ({
  CASE: {
    inference_path: {
      steps: [
        {
          observation: "Clock in study shows 9:15 but witness heard crash at 9:45",
          correction: "Separate symptom onset from administration",
          effect: "Alibis tied to late window lose decisiveness",
          required_evidence: ["Clock reading", "Witness testimony"],
          reader_observable: true,
        },
        {
          observation: "Garden soil on library windowsill but window locked inside",
          correction: "Someone entered through window and relocked it",
          effect: "Eliminates suspects without garden access",
          required_evidence: ["Soil analysis", "Lock mechanism"],
          reader_observable: true,
        },
        {
          observation: "Mrs. Harrison claims she was reading but lamp was cold at 10 PM",
          correction: "Mrs. Harrison was not in the library at the stated time",
          effect: "Eliminates Mrs. Harrison as suspect",
          required_evidence: ["Lamp temperature", "Mrs. Harrison statement"],
          reader_observable: true,
        },
      ],
    },
    false_assumption: { statement: "The crime occurred during the dinner party" },
    discriminating_test: {
      design: "Re-enact the timing with the clock and lamp to prove the window entry occurred before dinner",
      knowledge_revealed: "Only one person had garden access before dinner",
    },
    cast: [
      { name: "Colonel Blackwood", culprit_eligibility: "eligible" },
      { name: "Mrs. Harrison", culprit_eligibility: "eligible" },
      { name: "Dr. Whitmore", culprit_eligibility: "eligible" },
    ],
    culpability: { culprits: ["Colonel Blackwood"] },
    ...overrides,
  },
});

// ==========================================================================
// Tests
// ==========================================================================

describe("WP4A: checkInferencePathCoverage", () => {
  it("returns no critical issues when all steps are covered", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { supportsInferenceStep: 1, evidenceType: "observation", description: "Clock shows 9:15" },
      { supportsInferenceStep: 1, evidenceType: "contradiction", description: "Witness heard crash at 9:45" },
      { supportsInferenceStep: 2, evidenceType: "observation", description: "Soil on windowsill" },
      { supportsInferenceStep: 2, evidenceType: "contradiction", description: "Window locked inside" },
      { supportsInferenceStep: 3, evidenceType: "observation", description: "Mrs. Harrison reading claim" },
      { supportsInferenceStep: 3, evidenceType: "contradiction", description: "Lamp was cold" },
    ]);

    const result = checkInferencePathCoverage(cml, clues);
    expect(result.hasCriticalGaps).toBe(false);
    expect(result.uncoveredSteps).toEqual([]);
  });

  it("flags critical issue when a step has no covering clue", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { supportsInferenceStep: 1, evidenceType: "observation", description: "Clock shows 9:15" },
      // Step 2 and 3 have no clues
    ]);

    const result = checkInferencePathCoverage(cml, clues);
    expect(result.hasCriticalGaps).toBe(true);
    expect(result.uncoveredSteps).toContain(2);
    expect(result.uncoveredSteps).toContain(3);
  });

  it("returns critical when no inference steps exist", () => {
    const cml = makeCml({ inference_path: { steps: [] } });
    const clues = makeClueSet([]);

    const result = checkInferencePathCoverage(cml, clues);
    expect(result.hasCriticalGaps).toBe(true);
    expect(result.issues[0].severity).toBe("critical");
  });
});

describe("WP4B: checkContradictionPairs", () => {
  it("returns no issues when each step has observation + contradiction", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { supportsInferenceStep: 1, evidenceType: "observation" },
      { supportsInferenceStep: 1, evidenceType: "contradiction" },
      { supportsInferenceStep: 2, evidenceType: "observation" },
      { supportsInferenceStep: 2, evidenceType: "elimination" },
      { supportsInferenceStep: 3, evidenceType: "observation" },
      { supportsInferenceStep: 3, evidenceType: "contradiction" },
    ]);

    const result = checkContradictionPairs(cml, clues);
    expect(result.filter(i => i.severity === "critical")).toHaveLength(0);
  });

  it("warns when step has only observation clues", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { supportsInferenceStep: 1, evidenceType: "observation" },
    ]);

    const result = checkContradictionPairs(cml, clues);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("WP4C: checkFalseAssumptionContradiction", () => {
  it("returns no issues when contradiction clue exists", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { evidenceType: "contradiction", description: "Timeline proves crime happened before dinner" },
    ]);

    const result = checkFalseAssumptionContradiction(cml, clues);
    expect(result.filter(i => i.severity === "critical")).toHaveLength(0);
  });

  it("flags critical when no contradiction clue exists", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { evidenceType: "observation", description: "Some observation" },
    ]);

    const result = checkFalseAssumptionContradiction(cml, clues);
    expect(result.some(i => i.severity === "critical")).toBe(true);
  });

  it("flags critical when no false_assumption exists", () => {
    const cml = makeCml({ false_assumption: {} });
    const clues = makeClueSet([]);

    const result = checkFalseAssumptionContradiction(cml, clues);
    expect(result.some(i => i.severity === "critical")).toBe(true);
  });
});

describe("WP4D: checkDiscriminatingTestReachability", () => {
  it("returns no issues when clues reference discriminating test concepts", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { description: "The clock timing and lamp were examined together to prove the entry" },
    ]);

    const result = checkDiscriminatingTestReachability(cml, clues);
    expect(result.filter(i => i.severity === "critical")).toHaveLength(0);
  });

  it("flags critical when no clues relate to discriminating test", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { description: "An unrelated piece of physical evidence about fingerprints" },
    ]);

    const result = checkDiscriminatingTestReachability(cml, clues);
    expect(result.some(i => i.severity === "critical")).toBe(true);
  });

  it("flags critical when no discriminating test exists", () => {
    const cml = makeCml({ discriminating_test: {} });
    const clues = makeClueSet([]);

    const result = checkDiscriminatingTestReachability(cml, clues);
    expect(result.some(i => i.severity === "critical")).toBe(true);
  });
});

describe("WP4E: checkSuspectElimination", () => {
  it("returns no issues when all suspects are referenced in clues", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { description: "Mrs. Harrison was seen in the garden" },
      { description: "Dr. Whitmore had an alibi confirmed by the butler" },
    ]);

    const result = checkSuspectElimination(cml, clues);
    expect(result.filter(i => i.severity === "warning")).toHaveLength(0);
  });

  it("warns when suspects are never referenced in any clue", () => {
    const cml = makeCml();
    const clues = makeClueSet([
      { description: "A mysterious footprint in the garden" },
    ]);

    const result = checkSuspectElimination(cml, clues);
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns no issues when there are no eligible suspects", () => {
    const cml = makeCml({ cast: [] });
    const clues = makeClueSet([]);

    const result = checkSuspectElimination(cml, clues);
    expect(result).toHaveLength(0);
  });
});

describe("WP6A: classifyFairPlayFailure", () => {
  const classifyFairPlayFailure = (
    coverageResult: InferenceCoverageResult,
    _fairPlayAudit: any,
    cml: any
  ) => {
    const caseBlock = cml?.CASE ?? cml;
    const steps = caseBlock?.inference_path?.steps ?? [];

    const abstractSteps = steps.filter((s: any) => {
      const obs = (s.observation || "").trim();
      const hasEvidence = Array.isArray(s.required_evidence) && s.required_evidence.length > 0;
      return obs.length < 30 || !hasEvidence;
    });

    if (abstractSteps.length >= Math.ceil(steps.length * 0.5)) {
      return "inference_path_abstract";
    }

    const cs = caseBlock?.constraint_space ?? {};
    const totalConstraints = [
      ...(cs.time?.contradictions ?? []),
      ...(cs.time?.anchors ?? []),
      ...(cs.access?.actors ?? []),
      ...(cs.physical?.traces ?? []),
    ].length;

    if (totalConstraints < 4) return "constraint_space_insufficient";
    if (coverageResult.hasCriticalGaps) return "clue_coverage";
    return "clue_only";
  };

  it("classifies abstract inference paths correctly", () => {
    const cml = makeCml({
      inference_path: {
        steps: [
          { observation: "Short", correction: "c", effect: "e" },
          { observation: "Also short", correction: "c", effect: "e" },
          { observation: "Third short one", correction: "c", effect: "e" },
        ],
      },
    });
    const coverage: InferenceCoverageResult = {
      issues: [], coverageMap: new Map(), uncoveredSteps: [], hasCriticalGaps: false,
    };

    expect(classifyFairPlayFailure(coverage, null, cml)).toBe("inference_path_abstract");
  });

  it("classifies sparse constraint space", () => {
    const cml = makeCml({ constraint_space: {} });
    const coverage: InferenceCoverageResult = {
      issues: [], coverageMap: new Map(), uncoveredSteps: [], hasCriticalGaps: false,
    };

    expect(classifyFairPlayFailure(coverage, null, cml)).toBe("constraint_space_insufficient");
  });

  it("classifies clue coverage gaps", () => {
    const cml = makeCml({
      constraint_space: {
        time: { contradictions: ["a"], anchors: ["b"] },
        access: { actors: ["c", "d"] },
        physical: { traces: ["e"] },
      },
    });
    const coverage: InferenceCoverageResult = {
      issues: [], coverageMap: new Map(), uncoveredSteps: [1], hasCriticalGaps: true,
    };

    expect(classifyFairPlayFailure(coverage, null, cml)).toBe("clue_coverage");
  });

  it("defaults to clue_only when no structural issues", () => {
    const cml = makeCml({
      constraint_space: {
        time: { contradictions: ["a"], anchors: ["b"] },
        access: { actors: ["c", "d"] },
        physical: { traces: ["e"] },
      },
    });
    const coverage: InferenceCoverageResult = {
      issues: [], coverageMap: new Map(), uncoveredSteps: [], hasCriticalGaps: false,
    };

    expect(classifyFairPlayFailure(coverage, null, cml)).toBe("clue_only");
  });
});
