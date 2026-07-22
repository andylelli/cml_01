import { describe, expect, it } from "vitest";
import {
  buildCluePrompt,
  parseClueJsonContent,
  dropMalformedParsedClues,
  CANONICAL_PARSED_CLUE_ID_RE,
} from "../agent5-clues.ts";

const summarizePromptParity = (prompt: { developer: string; user: string }) => ({
  developerMarkers: [
    "First-pass Required Output Slots",
    "Deterministic Output Contracts",
    "CAST PATH BINDING CONTRACT",
  ].filter((marker) => prompt.developer.includes(marker)),
  userMarkers: [
    "OUTPUT SHAPE CONTRACT",
    "CONTRADICTION CHAIN",
    "ELIMINATION CHAIN",
    "FAIL-FAST STATUS",
    "DISCRIMINATING ID EXACTNESS",
    "SELF-CHECK OUTPUT RULE",
  ].filter((marker) => prompt.user.includes(marker)),
});

const summarizeRetryParity = (prompt: { user: string }) => ({
  retryMarkers: [
    "Retry mode (bounded delta repair):",
    "violation_codes[]:",
    "must_fix[]:",
    "targeted_clue_ids[]:",
    "preserve_clue_ids[]:",
    "strict_source_paths[]:",
    "required_id_to_source_mappings[]:",
    "required_step_coverage_floors[]:",
    "required_late_clue_slot:",
    "required_direct_culprit_clue:",
    "cast_index_to_name_map[] (authoritative for CASE.cast[N].*):",
    "Hard retry contract:",
  ].filter((marker) => prompt.user.includes(marker)),
});

describe("agent5 clue prompt first-pass contract", () => {
  it("includes fixed required clue slot IDs in developer prompt", () => {
    const prompt = buildCluePrompt({
      cml: {
        CASE: {
          meta: { title: "Clockwork Silence", crime_class: { category: "murder" } },
          false_assumption: { type: "temporal", statement: "The clock stopped naturally." },
          culpability: { culprits: ["Iwan Hale"] },
          hidden_model: { mechanism: { description: "The culprit wound and stalled the clock movement." } },
          discriminating_test: {
            design: "Use grease traces on the key slot to prove staged stoppage.",
            evidence_clues: ["clue_clock_trace"],
          },
          inference_path: {
            steps: [
              {
                observation: "Grease marked the key slot before supper.",
                correction: "The displayed time was staged.",
                required_evidence: ["Witness heard false chime sequence."],
              },
            ],
          },
          cast: [
            { name: "Iwan Hale", culprit_eligibility: "eligible" },
            { name: "Agnes Pike", culprit_eligibility: "eligible", alibi_window: "in the pantry" },
          ],
          constraint_space: {
            time: { anchors: ["supper bell at seven"], contradictions: [] },
            access: { actors: ["butler"], objects: ["clock key"], permissions: [] },
            physical: { laws: [], traces: ["grease streak"] },
          },
        },
      },
      clueDensity: "moderate",
      redHerringBudget: 1,
    });

    expect(prompt.developer).toContain("First-pass Required Output Slots");
    expect(prompt.developer).toContain("clue_mechanism_visibility_core");
    expect(prompt.developer).toContain("clue_core_contradiction_chain");
    expect(prompt.developer).toContain("clue_core_elimination_chain");
    expect(prompt.developer).toContain("CAST PATH BINDING CONTRACT");
    expect(summarizePromptParity(prompt)).toMatchInlineSnapshot(`
      {
        "developerMarkers": [
          "First-pass Required Output Slots",
          "Deterministic Output Contracts",
          "CAST PATH BINDING CONTRACT",
        ],
        "userMarkers": [
          "OUTPUT SHAPE CONTRACT",
          "CONTRADICTION CHAIN",
          "ELIMINATION CHAIN",
          "FAIL-FAST STATUS",
          "DISCRIMINATING ID EXACTNESS",
          "SELF-CHECK OUTPUT RULE",
        ],
      }
    `);
  });

  it("includes strict output-shape and chain constraints in user prompt", () => {
    const prompt = buildCluePrompt({
      cml: {
        CASE: {
          false_assumption: { statement: "The clock stopped naturally." },
          hidden_model: { mechanism: { description: "Clock movement was deliberately tampered with." } },
          discriminating_test: { design: "Compare key marks against expected chime order." },
          inference_path: {
            steps: [{ observation: "Grease around key slot.", correction: "Clock was staged.", required_evidence: [] }],
          },
          cast: [{ name: "Iwan Hale", culprit_eligibility: "eligible" }],
        },
      },
      clueDensity: "minimal",
      redHerringBudget: 0,
    });

    expect(prompt.user).toContain("OUTPUT SHAPE CONTRACT");
    expect(prompt.user).toContain("CONTRADICTION CHAIN");
    expect(prompt.user).toContain("ELIMINATION CHAIN");
    expect(prompt.user).toContain("FAIL-FAST STATUS");
  });

  it("includes retry cast-binding map and mandatory pre-output self-check in retry mode", () => {
    const prompt = buildCluePrompt({
      cml: {
        CASE: {
          false_assumption: { statement: "The clock stopped naturally." },
          hidden_model: { mechanism: { description: "Clock movement was deliberately tampered with." } },
          discriminating_test: {
            design: "Compare key marks against expected chime order.",
            evidence_clues: ["clue_clock_trace"],
          },
          inference_path: {
            steps: [{ observation: "Grease around key slot.", correction: "Clock was staged.", required_evidence: [] }],
          },
          cast: [
            { name: "Iwan Hale", culprit_eligibility: "eligible" },
            { name: "Agnes Pike", culprit_eligibility: "eligible" },
          ],
        },
      },
      clueDensity: "moderate",
      redHerringBudget: 1,
      fairPlayFeedback: {
        overallStatus: "fail",
        violations: [
          {
            severity: "critical",
            rule: "Cast Path Consistency",
            description: "sourceInCML cast index mismatched with suspect name",
            suggestion: "Bind suspect references to cast index",
          },
        ],
        violationCodes: ["cast_path_consistency"],
        targetedClueIds: ["clue_core_elimination_chain"],
        preserveClueIds: ["clue_seed_keep"],
        strictSourcePaths: [
          "CASE.inference_path.steps[0].observation",
          "CASE.discriminating_test.evidence_clues[0]",
        ],
        requiredIdToSourceMappings: [
          { id: "clue_clock_trace", sourceInCML: "CASE.discriminating_test.evidence_clues[0]" },
        ],
        requiredStepCoverageFloors: [
          { step: 1, requireContradiction: true, requireMapped: true },
        ],
        requiredLateClueSlot: { id: "clue_late_optional_slot_1", placement: "late", criticality: "optional" },
        requiredDirectCulpritClue: {
          id: "clue_culprit_direct_iwan_hale",
          culpritName: "Iwan Hale",
          allowedSourcePaths: ["CASE.inference_path.steps[0].observation"],
          requiredPhrases: ["Iwan Hale", "direct evidence"],
        },
      },
    });

    expect(prompt.user).toContain("violation_codes[]");
    expect(prompt.user).toContain("targeted_clue_ids[]");
    expect(prompt.user).toContain("preserve_clue_ids[]");
    expect(prompt.user).toContain("strict_source_paths[]");
    expect(prompt.user).toContain("required_id_to_source_mappings[]");
    expect(prompt.user).toContain("required_step_coverage_floors[]");
    expect(prompt.user).toContain("required_late_clue_slot");
    expect(prompt.user).toContain("required_direct_culprit_clue");
    expect(prompt.user).toContain("clue_culprit_direct_iwan_hale");
    expect(prompt.user).toContain("cast_index_to_name_map[]");
    expect(prompt.user).toContain("Retry CAST PATH BINDING CONTRACT (MANDATORY)");
    expect(prompt.user).toContain("Mandatory pre-output self-check");
    expect(prompt.user).not.toContain("Fix these unresolved targets first:");
    expect(summarizeRetryParity(prompt)).toMatchInlineSnapshot(`
      {
        "retryMarkers": [
          "Retry mode (bounded delta repair):",
          "violation_codes[]:",
          "must_fix[]:",
          "targeted_clue_ids[]:",
          "preserve_clue_ids[]:",
          "strict_source_paths[]:",
          "required_id_to_source_mappings[]:",
          "required_step_coverage_floors[]:",
          "required_late_clue_slot:",
          "required_direct_culprit_clue:",
          "cast_index_to_name_map[] (authoritative for CASE.cast[N].*):",
          "Hard retry contract:",
        ],
      }
    `);
  });

  it("keeps invariant contracts and avoids versioned run-shaped default-path prose", () => {
    const prompt = buildCluePrompt({
      cml: {
        CASE: {
          false_assumption: { statement: "The clock stopped naturally." },
          hidden_model: { mechanism: { description: "Clock movement was deliberately tampered with." } },
          discriminating_test: {
            design: "Compare key marks against expected chime order.",
            evidence_clues: ["clue_clock_trace"],
          },
          inference_path: {
            steps: [
              { observation: "Grease around key slot.", correction: "Clock was staged.", required_evidence: [] },
            ],
          },
          cast: [{ name: "Iwan Hale", culprit_eligibility: "eligible" }],
          quality_controls: {
            clue_visibility_requirements: {
              late_clues_min: 1,
            },
          },
        },
      },
      clueDensity: "moderate",
      redHerringBudget: 0,
      fairPlayFeedback: {
        overallStatus: "needs-revision",
        strictSourcePaths: [
          "CASE.inference_path.steps[0].observation",
          "CASE.discriminating_test.evidence_clues[0]",
        ],
        requiredIdToSourceMappings: [
          { id: "clue_clock_trace", sourceInCML: "CASE.discriminating_test.evidence_clues[0]" },
        ],
        requiredStepCoverageFloors: [
          { step: 1, requireContradiction: true, requireMapped: true },
        ],
        requiredLateClueSlot: { id: "clue_late_optional_slot_1", placement: "late", criticality: "optional" },
        requiredDirectCulpritClue: {
          id: "clue_culprit_direct_iwan_hale",
          culpritName: "Iwan Hale",
          allowedSourcePaths: ["CASE.inference_path.steps[0].observation"],
          requiredPhrases: ["Iwan Hale", "direct evidence"],
        },
      },
    });

    expect(prompt.developer).toContain("Deterministic Output Contracts");
    expect(prompt.developer).toContain("SOURCE FORMAT CONTRACT");
    expect(prompt.developer).toContain("ANTI-COLLAPSE OUTPUT RULE");
    expect(prompt.user).toContain("FAIL-FAST STATUS EXTENSION");
    expect(prompt.user).toContain("DISCRIMINATING ID EXACTNESS");
    expect(prompt.user).toContain("SELF-CHECK OUTPUT RULE");
    expect(prompt.user).toContain("If quality controls require late clues, satisfy late placement with supporting or optional clues only.");
    expect(prompt.user).not.toContain("CULPRIT-UNIQUE CLUE");
    expect(prompt.user).not.toContain("PREMEDITATION CLUES");
    expect(prompt.user).not.toContain("DISCRIMINATING TEST CLUES");
    expect(prompt.developer).not.toContain("V2 Hardening Addendum");
    expect(prompt.developer).not.toContain("V5 Deterministic Source Mapping (highest priority)");
    expect(prompt.user).not.toContain("V5 SOURCE SHORTLIST RULE");
    expect(prompt.user).not.toContain("V5 ID->PATH RULE");
    expect(prompt.user).not.toContain("V5 STEP-3 RULE");
    expect(prompt.user).not.toContain("V5 YVETTE RULE");
    expect(prompt.user).not.toContain("V6 CULPRIT RULE");
    expect(prompt.user).not.toContain("V6 LATE-CLUE RULE");
    expect(prompt.developer).not.toContain("Strict First-Attempt Contract Payload");
    expect(prompt.user).not.toContain("Strict first-attempt contract payload");
  });

  it("does not render fair-play audit feedback section for recommendations-only first-pass strict payload", () => {
    const prompt = buildCluePrompt({
      cml: {
        CASE: {
          false_assumption: { statement: "The clock stopped naturally." },
          hidden_model: { mechanism: { description: "Clock movement was deliberately tampered with." } },
          discriminating_test: {
            design: "Compare key marks against expected chime order.",
            evidence_clues: ["clue_clock_trace"],
          },
          inference_path: {
            steps: [
              { observation: "Grease around key slot.", correction: "Clock was staged.", required_evidence: [] },
            ],
          },
          cast: [{ name: "Iwan Hale", culprit_eligibility: "eligible" }],
        },
      },
      clueDensity: "moderate",
      redHerringBudget: 0,
      fairPlayFeedback: {
        overallStatus: "needs-revision",
        recommendations: ["Apply strict source whitelist and exact ID mapping."],
        strictSourcePaths: ["CASE.inference_path.steps[0].observation"],
      },
    });

    expect(prompt.developer).not.toContain("## Fair Play Audit Feedback");
  });
});

// ── Parse-boundary hardening (run a3c2973f phantom-clue class) ─────────────────────────────────
// The LLM hit its completion limit mid-clue; the raw payload ended `{"id": "clue_` and jsonrepair
// closed it into a phantom clue with no content, which survived every downstream repair and
// hard-stopped the release gate on NSD visibility. Both halves of the fix are covered here.

describe("parseClueJsonContent — truncation detection", () => {
  it("clean JSON parses without repair or truncation", () => {
    const res = parseClueJsonContent('{"clues": [{"id": "clue_1", "description": "A stopped clock."}]}');
    expect(res.repaired).toBe(false);
    expect(res.truncated).toBe(false);
    expect(res.clueData.clues).toHaveLength(1);
  });

  it("sloppy-but-complete JSON (trailing comma) is repaired but NOT flagged truncated", () => {
    const res = parseClueJsonContent('{"clues": [{"id": "clue_1", "description": "A stopped clock."},]}');
    expect(res.repaired).toBe(true);
    expect(res.truncated).toBe(false);
  });

  it("a payload cut mid-string (the run-a3c2973f tail) is repaired AND flagged truncated", () => {
    const truncatedPayload =
      '{"clues": [{"id": "clue_16", "description": "Edward Fletcher was in the main hall."}, {"id": "clue_';
    const res = parseClueJsonContent(truncatedPayload);
    expect(res.repaired).toBe(true);
    expect(res.truncated).toBe(true);
    // jsonrepair fabricates the phantom — which is exactly why dropMalformedParsedClues must run
    const ids = (res.clueData.clues as any[]).map((c) => String(c?.id ?? ""));
    expect(ids).toContain("clue_16");
  });
});

describe("dropMalformedParsedClues — phantom-clue filter", () => {
  it("drops the exact run-a3c2973f phantom (bare id, no description) and keeps real clues", () => {
    const { kept, droppedWarnings } = dropMalformedParsedClues([
      { id: "clue_16", description: "Edward Fletcher was in the main hall.", placement: "mid" },
      { id: "clue_", evidenceType: "observation" }, // the phantom, post-normalizer shape
    ]);
    expect(kept.map((c: any) => c.id)).toEqual(["clue_16"]);
    expect(droppedWarnings).toHaveLength(1);
    expect(droppedWarnings[0]).toContain('"clue_"');
  });

  it("drops a canonical-id clue whose description is empty (unplantable)", () => {
    const { kept, droppedWarnings } = dropMalformedParsedClues([
      { id: "clue_17", description: "   " },
    ]);
    expect(kept).toHaveLength(0);
    expect(droppedWarnings[0]).toContain("clue_17");
  });

  it("keeps named synthetics and hyphen/underscore ids untouched (no false positives)", () => {
    const clues = [
      { id: "clue_mechanism_visibility_core", description: "The sundial shadow falls wrong." },
      { id: "clue_culprit_direct_rupert_langley", description: "Direct evidence ties Rupert to the gnomon." },
      { id: "clue_late_optional_slot_1", description: "A late texture detail." },
    ];
    const { kept, droppedWarnings } = dropMalformedParsedClues(clues);
    expect(kept).toHaveLength(3);
    expect(droppedWarnings).toHaveLength(0);
  });

  it("the canonical regex rejects a bare clue_ but accepts suffixed ids (mirrors the worker gate)", () => {
    expect(CANONICAL_PARSED_CLUE_ID_RE.test("clue_")).toBe(false);
    expect(CANONICAL_PARSED_CLUE_ID_RE.test("clue_1")).toBe(true);
    expect(CANONICAL_PARSED_CLUE_ID_RE.test("clue_core_contradiction_chain")).toBe(true);
  });

  it("tolerates a non-array input (returns empty, no throw)", () => {
    const { kept, droppedWarnings } = dropMalformedParsedClues(undefined);
    expect(kept).toEqual([]);
    expect(droppedWarnings).toEqual([]);
  });
});

// ── A_65b Ph6 — the STRICT STRUCTURAL CONTRACT renders FIRST-PASS ────────────────────────────
// Previously these shapes reached the LLM only in retry mode (gated on violations/warnings) and
// retries are disabled by default — verified on the A_64 probe: 0 strict lines in its single
// Agent-5 request, and deterministic synthesis fired on 5/5 planted-era runs.
describe("agent5 strict contract — first-pass rendering (A_65b Ph6)", () => {
  const minimalCml: any = {
    CASE: {
      meta: { title: "T", crime_class: { category: "murder" } },
      false_assumption: { type: "temporal", statement: "s" },
      culpability: { culprits: ["Iwan Hale"] },
      hidden_model: { mechanism: { description: "m" } },
      inference_path: { steps: [{ observation: "o", correction: "c" }] },
      cast: [{ name: "Iwan Hale", culprit_eligibility: "eligible" }],
    },
  };

  it("renders required ids, the direct-culprit clue, and the late slot in the FIRST-PASS user prompt", () => {
    const prompt = buildCluePrompt({
      cml: minimalCml,
      clueDensity: "moderate",
      redHerringBudget: 2,
      strictContract: {
        requiredIdToSourceMappings: [{ id: "clue_id_1", sourceInCML: "CASE.cast[0].alibi_window" }],
        requiredDirectCulpritClue: {
          id: "clue_culprit_direct_iwan_hale",
          culpritName: "Iwan Hale",
          allowedSourcePaths: ["CASE.cast[0].alibi_window"],
          requiredPhrases: ["Iwan Hale"],
        },
        requiredLateClueSlot: { id: "clue_late_optional_slot_1", placement: "late", criticality: "optional" },
        requiredStepCoverageFloors: [{ step: 1, requireContradiction: true, requireMapped: true }],
      },
    } as any);
    expect(prompt.user).toContain("STRICT STRUCTURAL CONTRACT");
    expect(prompt.user).toContain('REQUIRED ID: "clue_id_1"');
    expect(prompt.user).toContain('DIRECT CULPRIT CLUE: id="clue_culprit_direct_iwan_hale"');
    expect(prompt.user).toContain('LATE SLOT: id="clue_late_optional_slot_1"');
    expect(prompt.user).toContain("STEP 1: must have a CONTRADICTION-evidence clue");
    expect(prompt.user).toMatch(/NEVER meta-boilerplate/);
  });

  it("renders nothing extra without a strictContract (no behavior change on the default path)", () => {
    const prompt = buildCluePrompt({ cml: minimalCml, clueDensity: "moderate", redHerringBudget: 2 } as any);
    expect(prompt.user).not.toContain("STRICT STRUCTURAL CONTRACT");
  });
});
