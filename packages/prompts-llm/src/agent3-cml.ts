/**
 * Agent 3: CML Generator - Prompt building and generation
 * This is the CORE agent - the backbone of the mystery generation system
 */

import type { AzureOpenAIClient, LLMLogger, Message } from "@cml/llm-client";
import { parse as parseYAML } from "yaml";
import { validateCml } from "@cml/cml";
import { reviseCml } from "./agent4-revision.js";
import { jsonrepair } from "jsonrepair";
import yaml from "js-yaml";
import type { CMLPromptInputs, CMLGenerationResult, PromptMessages } from "./types.js";
import {
  MYSTERY_EXPERT_SYSTEM,
  CML_SPECIALIST_SYSTEM,
  FAIR_PLAY_CHECKLIST,
  INFERENCE_PATH_QUALITY,
} from "./shared/system.js";
import {
  buildEraConstraints,
  buildLocationConstraints,
} from "./shared/constraints.js";
import {
  CML_2_0_SCHEMA_SUMMARY,
  AXIS_TYPE_DESCRIPTIONS,
} from "./shared/schemas.js";
import {
  loadSeedCMLFiles,
  extractStructuralPatterns,
  selectRelevantPatterns,
  formatPatternsForPrompt,
} from "./utils/seed-loader.js";
import { join } from "path";

/**
 * Build the complete prompt for CML generation
 */
export function buildCMLPrompt(inputs: CMLPromptInputs, examplesDir?: string): PromptMessages {
  // Load seed patterns if examples directory provided
  let seedPatternsText = "No seed patterns loaded (will generate from first principles).";
  if (examplesDir) {
    try {
      const cmlFiles = loadSeedCMLFiles(examplesDir);
      const patterns = extractStructuralPatterns(cmlFiles);
      const relevantPatterns = selectRelevantPatterns(patterns, inputs.primaryAxis, 3);
      seedPatternsText = formatPatternsForPrompt(relevantPatterns);
    } catch (error) {
      console.warn("Failed to load seed patterns:", error);
    }
  }

  // Build novelty constraints section
  let noveltyText = "";
  if (inputs.noveltyConstraints) {
    noveltyText = `
**Novelty Constraints**:
You must diverge from these seed cases: ${inputs.noveltyConstraints.divergeFrom.join(", ")}

Required divergence in these areas:
${inputs.noveltyConstraints.areas.map(area => `- ${area}`).join("\n")}

Specific patterns to avoid:
${inputs.noveltyConstraints.avoidancePatterns.map(pattern => `- ${pattern}`).join("\n")}

Your mystery must be structurally novel - use seeds for CML format only, not content.

**Imagination requirement**:
Think of something clever, cunning, imaginative, and logical. Use inventive, non-obvious combinations of setting details, false assumptions, culprit access paths, and discriminating tests.
Aim for fresh logic while staying fair-play and coherent with the era/location constraints.`;
  }

  const hardLogicModes = inputs.hardLogicModes ?? [];
  const difficultyMode = inputs.difficultyMode ?? "standard";
  const backgroundContext = inputs.backgroundContext;
  const backgroundContextText = backgroundContext
    ? [
        `Backdrop: ${backgroundContext.backdropSummary}`,
        `Era: ${backgroundContext.era.decade}${backgroundContext.era.socialStructure ? ` (${backgroundContext.era.socialStructure})` : ""}`,
        `Setting: ${backgroundContext.setting.location} • ${backgroundContext.setting.institution}${backgroundContext.setting.weather ? ` • ${backgroundContext.setting.weather}` : ""}`,
        `Cast anchors: ${backgroundContext.castAnchors.join(", ") || "none"}`,
        backgroundContext.theme ? `Theme pressure: ${backgroundContext.theme}` : "",
      ].filter(Boolean).join("\n")
    : "(No dedicated background context artifact provided. Use setting/cast constraints.)";
  const hardLogicDevices = Array.isArray(inputs.hardLogicDevices) ? inputs.hardLogicDevices : [];
  const hardLogicDeviceText = hardLogicDevices.length > 0
    ? hardLogicDevices
        .map((device, index) => {
          const clues = device.fairPlayClues.slice(0, 4).join("; ");
          return `${index + 1}. ${device.title}\n   - principle: ${device.principleType} | ${device.corePrinciple}\n   - illusion: ${device.surfaceIllusion}\n   - reality: ${device.underlyingReality}\n   - fair clues: ${clues}\n   - anti-trope: ${device.whyNotTrope}`;
        })
        .join("\n")
    : "(No dedicated hard-logic ideation artifact provided. Use hard-logic tags and mechanism family hints.)";
  const hardLogicSection = `
**Golden Age Hard-Logic Device Constraints**:
- Build mechanism around a physical law, mathematical principle, cognitive bias, or social-logic mechanism.
- Avoid overused stock devices unless fundamentally reimagined (no twins-as-shortcut, no generic gimmicks).
- No modern technology or post-1945 science.
- Keep all reasoning period-solvable (1920-1945 knowledge).
- Make contradiction explicit between testimony and measurable fact.

Hard-logic focus tags: ${hardLogicModes.length > 0 ? hardLogicModes.join(", ") : "standard varied mix"}
Difficulty mode: ${difficultyMode}

Escalation behavior:
- standard: single-principle elegant construction
- increase: multi-step reasoning, at least one fair cognitive misdirection
- extreme: near-impossible appearance with rigorous logical mechanism and timing/geometry precision`;

  const hardLogicGroundingSection = `
**Hard-Logic Ideation Artifact (must ground final mechanism design)**:
${hardLogicDeviceText}

Grounding rule:
- Select one primary device (or a coherent hybrid of two) from this list as the mechanism backbone.
- Preserve its contradiction structure in false_assumption + constraint_space + inference_path + discriminating_test.
- Keep clues observable and fair-play deducible from the selected device logic.`;

  const backgroundGroundingSection = `
**Background Context Artifact (must remain separate from mechanism logic)**:
${backgroundContextText}

Background rule:
- Keep backdrop coherence in CASE.meta (era/setting), cast social dynamics, and narrative atmosphere.
- Do NOT use background details as a substitute for mechanism logic.
- Mechanism proof must still come from hard-logic device constraints and fair-play clues.`;

  // System message
  const system = `${CML_SPECIALIST_SYSTEM}

${MYSTERY_EXPERT_SYSTEM}`;

  // Developer message with schema and seed patterns
  const developer = `**CML 2.0 Schema Reference**:
${CML_2_0_SCHEMA_SUMMARY}

---

**Primary Axis Types**:
${AXIS_TYPE_DESCRIPTIONS}

---

**Seed CML Structural Patterns** (for CML format inspiration only - DO NOT COPY CONTENT):
${seedPatternsText}

---

${noveltyText}

**Uniqueness Seed**: ${inputs.runId}-${inputs.projectId}
Use this seed to ensure the case details and logic differ meaningfully from prior runs.

---

**Era Constraints**:
${buildEraConstraints(inputs.decade)}

---

**Location Constraints**:
${buildLocationConstraints(inputs.location, inputs.institution)}

---

**Setting Lock**:
All story elements must remain consistent with the specified setting type and location. Do not switch to a different location type.

---

${hardLogicSection}

---

${backgroundGroundingSection}

---

${hardLogicGroundingSection}

---

${FAIR_PLAY_CHECKLIST}

${INFERENCE_PATH_QUALITY}

**Inference Path Construction Rules**:
1. Every observation must describe something the reader can WITNESS in a scene - 
   a physical object, a statement, a visible action, a document - NOT a conclusion
2. Every correction must follow from STATED EVIDENCE in constraint_space or cast, 
   not from detective intuition
3. Every effect must produce a NAMED consequence: "Eliminates [suspect]" or 
   "Narrows administration window to [time range]"
4. required_evidence must list 2-4 CML facts per step. These are the facts that 
   Agent 5 MUST surface as clues for the reader. If you cannot list concrete evidence, 
   the observation is too abstract - rewrite it.
5. The constraint_space MUST contain at least one contradiction per inference step - 
   a pair of facts that create logical tension the reader can resolve
6. The discriminating_test.design MUST reference specific evidence the reader has 
   already seen in earlier inference steps`;

  const requiredSkeleton = `
**Required YAML Skeleton (do not omit any keys)**:

CML_VERSION: 2.0
CASE:
  meta:
    title: ""
    author: ""
    license: "CC-BY-4.0"
    era:
      decade: ""
      realism_constraints: []
    setting:
      location: ""
      place: ""
      country: ""
      institution: ""
    crime_class:
      category: "murder"
      subtype: ""
  cast:
    - name: ""
      age_range: ""
      role_archetype: ""
      relationships: []
      public_persona: ""
      private_secret: ""
      motive_seed: ""
      motive_strength: "moderate"
      alibi_window: ""
      access_plausibility: "medium"
      opportunity_channels: []
      behavioral_tells: []
      stakes: ""
      evidence_sensitivity: []
      culprit_eligibility: "eligible"
      culpability: "unknown"
  culpability:
    culprit_count: 1
    culprits: []
  surface_model:
    narrative:
      summary: ""
    accepted_facts: []
    inferred_conclusions: []
  hidden_model:
    mechanism:
      description: ""
      delivery_path: []
    outcome:
      result: ""
  false_assumption:
    statement: ""
    type: ""
    why_it_seems_reasonable: ""
    what_it_hides: ""
  constraint_space:
    time:
      anchors: []
      windows: []
      contradictions: []
    access:
      actors: []
      objects: []
      permissions: []
    physical:
      laws: []
      traces: []
    social:
      trust_channels: []
      authority_sources: []
  inference_path:
    steps:
      - observation: "Concrete scene-level observation the reader can witness"
        correction: "Conclusion derivable from stated evidence"
        effect: "Named suspect eliminated or constraint tightened"
        required_evidence:
          - "Specific CML fact the reader must witness"
          - "Another specific CML fact"
        reader_observable: true
  discriminating_test:
    method: "trap"
    design: ""
    knowledge_revealed: ""
    pass_condition: ""
  fair_play:
    all_clues_visible: true
    no_special_knowledge_required: true
    no_late_information: true
    reader_can_solve: true
    explanation: ""
  quality_controls:
    inference_path_requirements:
      min_steps: 3
      max_steps: 5
      require_observation_correction_effect: true
    clue_visibility_requirements:
      essential_clues_min: 3
      essential_clues_before_test: true
      early_clues_min: 2
      mid_clues_min: 2
      late_clues_min: 1
    discriminating_test_requirements:
      timing: "early_act3"
      must_reference_inference_step: true
  prose_requirements:
    discriminating_test_scene:
      act_number: 3
      scene_number: 4
      required_elements:
        - "Execute the discriminating test"
        - "Observe the culprit's reaction or result"
        - "Draw conclusion about guilt"
      test_type: ""
    suspect_clearance_scenes:
      - suspect_name: "(each non-culprit suspect)"
        act_number: 3
        scene_number: 5
        clearance_method: "Specific alibi or evidence that eliminates them"
        supporting_clues: ["clue_id_1", "clue_id_2"]
    culprit_revelation_scene:
      act_number: 3
      scene_number: 6
      revelation_method: "Confrontation with evidence"
    identity_rules:
      - character_name: "(if identity axis)"
        revealed_in_act: 3
        before_reveal_reference: "the stranger" 
        after_reveal_reference: "Lord Ashford"
    clue_to_scene_mapping:
      - clue_id: "clue_early_1"
        act_number: 1
        scene_number: 3
        delivery_method: "Direct observation"
`;

  // User message with specific requirements
  const user = `Create a complete mystery case in CML 2.0 format with these exact specifications:

**Setting & Era**:
- Decade: ${inputs.decade}
- Location: ${inputs.location}
- Institution: ${inputs.institution}
- Weather: ${inputs.weather}
- Social Structure: ${inputs.socialStructure}
- Tone: ${inputs.tone}
- Theme: ${inputs.theme ?? "(none specified)"}

IMPORTANT - Geographic Specificity:
Fill the "place" and "country" fields in meta.setting with specific location:
- For country estates/manor houses: Choose a specific English village or county (e.g., "Little Middleton, Yorkshire")
- For Riviera settings: Specify French Riviera (Nice, Cannes, Monaco) or Italian Riviera
- For ocean liners: Specify route (e.g., "Southampton to New York route", "Atlantic Ocean")
- For trains: Specify route (e.g., "London to Edinburgh route", "England")
- Always include country (usually "England", "France", "Italy", or route description)

**Cast Requirements**:
- Cast Size: ${inputs.castSize} characters
- Use these exact names: ${inputs.castNames.join(", ")}
- Detective Type: ${inputs.detectiveType}
- Victim Archetype: ${inputs.victimArchetype}

**Mystery Logic**:
- Primary Axis: ${inputs.primaryAxis}
- False Assumption Type: Must be ${inputs.primaryAxis} (matching axis)
- Complexity Level: ${inputs.complexityLevel}
- Mechanism Families: ${inputs.mechanismFamilies.join(", ")}
- Hard-Logic Focus Tags: ${hardLogicModes.length > 0 ? hardLogicModes.join(", ") : "standard varied mix"}
- Escalation Difficulty: ${difficultyMode}

**Hard-Logic Device Grounding Candidates**:
${hardLogicDeviceText}

**Requirements**:
1. Generate complete CML 2.0 YAML document
2. Start with "CML_VERSION: 2.0"
3. Build entire mystery around the **${inputs.primaryAxis}** axis
4. False assumption MUST be type: ${inputs.primaryAxis}
5. Use ALL provided character names in cast section
6. Create mechanism that exploits the false assumption
7. Design constraint space with 5-8 constraints that hide the truth
8. Build inference path with 3-5 logical steps. EACH step must satisfy ALL of:
   a. observation: A CONCRETE, SCENE-LEVEL fact the reader can witness
      (e.g., "Medicine bottle label shows Dr. Bauerstein's prescription filled on Tuesday")
      NOT abstract summaries (e.g., "Timeline discrepancies in witness accounts")
   b. correction: A conclusion the reader can DERIVE from the observation + one or more
      pieces of stated evidence - never a leap of logic
   c. effect: A TESTABLE narrowing of the suspect pool (name the suspect eliminated or the
      constraint that tightens)
   d. required_evidence: An array of 2-4 specific CML facts the reader must see to make this
      correction. Each entry must be a concrete observation witnessable in a scene.
   e. reader_observable: true (all steps must be reader-observable for fair play)
9. Create discriminating test appropriate for ${inputs.primaryAxis} axis
10. Ensure all fair-play checklist items are true
11. Fill quality_controls with realistic numeric targets that match the inference path and fair-play plan
12. Ground every clue in mechanism or constraint violations
13. Weave the Theme into the title and narrative summary without adding new keys
14. Ensure mechanism is diagrammable and contradiction-driven (assumption vs measurable fact)
15. If Escalation Difficulty is "increase" or "extreme", require multi-step inference with at least one fair misdirection
16. The fair_play.explanation field must NOT be a generic statement like "All evidence
    supports the solution." It MUST specifically name which evidence supports each
    inference step, e.g.: "Step 1: The poison timing report (early) and housekeeper's
    testimony (mid) let the reader separate symptom onset from administration.
    Step 2: Dr. Bauerstein's hospital alibi (mid) eliminates him. Step 3: Mary's
    contradictory medicine account (discriminating test) identifies her as culprit."
17. **Generate prose_requirements section** to guide Agent 9 prose generation:
    - discriminating_test_scene: Specify which act/scene will contain the discriminating test execution
    - suspect_clearance_scenes: For each non-culprit suspect, specify which act/scene will explicitly clear them and by what method
    - culprit_revelation_scene: Specify which act/scene reveals the culprit's identity
    - identity_rules: If using identity axis, specify how characters should be referenced before/after identity reveal
    - clue_to_scene_mapping: Map key clues to specific acts (scene number optional)
    This ensures Agent 9 knows exactly where to place validation-critical content.

**Output Format**:
Respond with ONLY valid JSON matching the CML 2.0 schema. No explanations, no markdown code blocks, no commentary.
Start immediately with the JSON object containing "CML_VERSION": 2.0 and the complete CASE structure.
Do not invent extra keys outside the schema. Do not omit any required keys. If unsure, use safe placeholder strings but keep required fields present.`;

  // Convert to Message array
  // Note: "developer" role not supported by Azure OpenAI, so merge into system message
  const combinedSystem = `${system}\n\n# Technical Specifications\n\n${developer}\n\n${requiredSkeleton}`;
  const messages: Message[] = [
    { role: "system", content: combinedSystem },
    { role: "user", content: user },
  ];

  return {
    system,
    developer,
    user,
    messages,
  };
}

/**
 * Generate CML with retry loop and validation
 */
export async function generateCML(
  client: AzureOpenAIClient,
  inputs: CMLPromptInputs,
  examplesDir?: string,
  maxAttempts = 3
): Promise<CMLGenerationResult> {
  const logger = client.getLogger();
  const startTime = Date.now();

  // Build prompt
  const prompt = buildCMLPrompt(inputs, examplesDir);

  const ensureObject = (value: unknown) =>
    value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const ensureArray = (value: unknown) => (Array.isArray(value) ? value : []);
  const ensureString = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim() ? value : fallback;

  const normalizeCml = (raw: Record<string, unknown>) => {
    const cml = ensureObject(raw);
    cml.CML_VERSION = 2.0;

    const caseBlock = ensureObject(cml.CASE);
    cml.CASE = caseBlock;

    const meta = ensureObject(caseBlock.meta);
    caseBlock.meta = meta;
    meta.title = ensureString(meta.title, "Untitled Mystery");
    meta.author = ensureString(meta.author, "CML Generator");
    meta.license = ensureString(meta.license, "CC-BY-4.0");

    const era = ensureObject(meta.era);
    meta.era = era;
    era.decade = ensureString(era.decade, inputs.decade);
    era.realism_constraints = ensureArray(era.realism_constraints);

    const setting = ensureObject(meta.setting);
    meta.setting = setting;
    setting.location = ensureString(setting.location, inputs.location);
    setting.institution = ensureString(setting.institution, inputs.institution);

    const crimeClass = ensureObject(meta.crime_class);
    meta.crime_class = crimeClass;
    crimeClass.category = ensureString(crimeClass.category, "murder");
    crimeClass.subtype = ensureString(crimeClass.subtype, "poisoning");

    const castArray = Array.isArray(caseBlock.cast) ? caseBlock.cast : [];
    const names = inputs.castNames?.length ? inputs.castNames : castArray.map((c) => (c as any)?.name).filter(Boolean);
    const normalizedCast = (names.length ? names : castArray.map((c) => (c as any)?.name).filter(Boolean)).map((name, index) => {
      const existing = ensureObject(castArray[index]);
      const eligibility = ensureString(existing.culprit_eligibility, "eligible");
      const normalizedEligibility = ["eligible", "ineligible", "locked"].includes(eligibility)
        ? eligibility
        : "eligible";
      const culpability = ensureString(existing.culpability, "unknown");
      const normalizedCulpability = ["guilty", "innocent", "unknown"].includes(culpability)
        ? culpability
        : "unknown";
      return {
        name: ensureString(existing.name, name || `Suspect ${index + 1}`),
        age_range: ensureString(existing.age_range, "adult"),
        role_archetype: ensureString(existing.role_archetype, "suspect"),
        relationships: ensureArray(existing.relationships),
        public_persona: ensureString(existing.public_persona, "reserved"),
        private_secret: ensureString(existing.private_secret, "keeps a secret"),
        motive_seed: ensureString(existing.motive_seed, "inheritance"),
        motive_strength: ensureString(existing.motive_strength, "moderate"),
        alibi_window: ensureString(existing.alibi_window, "evening"),
        access_plausibility: ensureString(existing.access_plausibility, "medium"),
        opportunity_channels: ensureArray(existing.opportunity_channels),
        behavioral_tells: ensureArray(existing.behavioral_tells),
        stakes: ensureString(existing.stakes, "reputation"),
        evidence_sensitivity: ensureArray(existing.evidence_sensitivity),
        culprit_eligibility: normalizedEligibility,
        culpability: normalizedCulpability,
      };
    });
    caseBlock.cast = normalizedCast;

    const culpability = ensureObject(caseBlock.culpability);
    caseBlock.culpability = culpability;
    culpability.culprit_count = typeof culpability.culprit_count === "number" ? culpability.culprit_count : 1;
    const culpritNames = ensureArray(culpability.culprits);
    culpability.culprits = culpritNames.length ? culpritNames : [normalizedCast[0]?.name ?? "Unknown"].filter(Boolean);

    const surface = ensureObject(caseBlock.surface_model);
    caseBlock.surface_model = surface;
    const surfaceNarrative = ensureObject(surface.narrative);
    surface.narrative = surfaceNarrative;
    surfaceNarrative.summary = ensureString(surfaceNarrative.summary, "A mystery unfolds.");
    surface.accepted_facts = ensureArray(surface.accepted_facts);
    surface.inferred_conclusions = ensureArray(surface.inferred_conclusions);

    const hidden = ensureObject(caseBlock.hidden_model);
    caseBlock.hidden_model = hidden;
    const hiddenMechanism = ensureObject(hidden.mechanism);
    hidden.mechanism = hiddenMechanism;
    hiddenMechanism.description = ensureString(hiddenMechanism.description, "Poisoned tea.");
    hiddenMechanism.delivery_path = ensureArray(hiddenMechanism.delivery_path);
    const hiddenOutcome = ensureObject(hidden.outcome);
    hidden.outcome = hiddenOutcome;
    hiddenOutcome.result = ensureString(hiddenOutcome.result, "Victim poisoned.");

    const falseAssumption = ensureObject(caseBlock.false_assumption);
    caseBlock.false_assumption = falseAssumption;
    falseAssumption.statement = ensureString(falseAssumption.statement, "Death was natural.");
    falseAssumption.type = ensureString(falseAssumption.type, inputs.primaryAxis);
    falseAssumption.why_it_seems_reasonable = ensureString(falseAssumption.why_it_seems_reasonable, "Symptoms mimic illness.");
    falseAssumption.what_it_hides = ensureString(falseAssumption.what_it_hides, "Poisoning timeline.");

    const constraintSpace = ensureObject(caseBlock.constraint_space);
    caseBlock.constraint_space = constraintSpace;
    const constraintTime = ensureObject(constraintSpace.time);
    constraintSpace.time = constraintTime;
    constraintTime.anchors = ensureArray(constraintTime.anchors);
    constraintTime.windows = ensureArray(constraintTime.windows);
    constraintTime.contradictions = ensureArray(constraintTime.contradictions);
    const constraintAccess = ensureObject(constraintSpace.access);
    constraintSpace.access = constraintAccess;
    constraintAccess.actors = ensureArray(constraintAccess.actors);
    constraintAccess.objects = ensureArray(constraintAccess.objects);
    constraintAccess.permissions = ensureArray(constraintAccess.permissions);
    const constraintPhysical = ensureObject(constraintSpace.physical);
    constraintSpace.physical = constraintPhysical;
    constraintPhysical.laws = ensureArray(constraintPhysical.laws);
    constraintPhysical.traces = ensureArray(constraintPhysical.traces);
    const constraintSocial = ensureObject(constraintSpace.social);
    constraintSpace.social = constraintSocial;
    constraintSocial.trust_channels = ensureArray(constraintSocial.trust_channels);
    constraintSocial.authority_sources = ensureArray(constraintSocial.authority_sources);

    const inferencePath = ensureObject(caseBlock.inference_path);
    caseBlock.inference_path = inferencePath;
    if (!Array.isArray(inferencePath.steps) || inferencePath.steps.length < 3) {
      throw new Error(
        "CML generation produced " + (Array.isArray(inferencePath.steps) ? inferencePath.steps.length : 0) +
        " inference_path steps (minimum 3 required). " +
        "The LLM must produce concrete inference steps - placeholder injection is no longer supported."
      );
    }
    // Ensure each step has required_evidence array and reader_observable
    for (const step of inferencePath.steps as any[]) {
      if (!Array.isArray(step.required_evidence)) {
        step.required_evidence = [];
      }
      if (typeof step.reader_observable !== "boolean") {
        step.reader_observable = true;
      }
    }

    const discriminatingTest = ensureObject(caseBlock.discriminating_test);
    caseBlock.discriminating_test = discriminatingTest;
    const method = ensureString(discriminatingTest.method, "trap");
    discriminatingTest.method = [
      "reenactment",
      "trap",
      "constraint_proof",
      "administrative_pressure",
    ].includes(method)
      ? method
      : "trap";
    discriminatingTest.design = ensureString(discriminatingTest.design, "Confront with evidence");
    discriminatingTest.knowledge_revealed = ensureString(discriminatingTest.knowledge_revealed, "Access window");
    discriminatingTest.pass_condition = ensureString(discriminatingTest.pass_condition, "Culprit reacts");

    const fairPlay = ensureObject(caseBlock.fair_play);
    caseBlock.fair_play = fairPlay;
    fairPlay.all_clues_visible = typeof fairPlay.all_clues_visible === "boolean" ? fairPlay.all_clues_visible : true;
    fairPlay.no_special_knowledge_required =
      typeof fairPlay.no_special_knowledge_required === "boolean" ? fairPlay.no_special_knowledge_required : true;
    fairPlay.no_late_information = typeof fairPlay.no_late_information === "boolean" ? fairPlay.no_late_information : true;
    fairPlay.reader_can_solve = typeof fairPlay.reader_can_solve === "boolean" ? fairPlay.reader_can_solve : true;
    fairPlay.explanation = ensureString(fairPlay.explanation, "All clues provided before reveal.");

    const qualityControls = ensureObject(caseBlock.quality_controls);
    caseBlock.quality_controls = qualityControls;
    const inferenceRequirements = ensureObject(qualityControls.inference_path_requirements);
    qualityControls.inference_path_requirements = inferenceRequirements;
    inferenceRequirements.min_steps = typeof inferenceRequirements.min_steps === "number" ? inferenceRequirements.min_steps : 3;
    inferenceRequirements.max_steps = typeof inferenceRequirements.max_steps === "number" ? inferenceRequirements.max_steps : 5;
    inferenceRequirements.require_observation_correction_effect =
      typeof inferenceRequirements.require_observation_correction_effect === "boolean"
        ? inferenceRequirements.require_observation_correction_effect
        : true;

    const clueVisibility = ensureObject(qualityControls.clue_visibility_requirements);
    qualityControls.clue_visibility_requirements = clueVisibility;
    clueVisibility.essential_clues_min = typeof clueVisibility.essential_clues_min === "number" ? clueVisibility.essential_clues_min : 3;
    clueVisibility.essential_clues_before_test =
      typeof clueVisibility.essential_clues_before_test === "boolean" ? clueVisibility.essential_clues_before_test : true;
    clueVisibility.early_clues_min = typeof clueVisibility.early_clues_min === "number" ? clueVisibility.early_clues_min : 2;
    clueVisibility.mid_clues_min = typeof clueVisibility.mid_clues_min === "number" ? clueVisibility.mid_clues_min : 2;
    clueVisibility.late_clues_min = typeof clueVisibility.late_clues_min === "number" ? clueVisibility.late_clues_min : 1;

    const discriminatingRequirements = ensureObject(qualityControls.discriminating_test_requirements);
    qualityControls.discriminating_test_requirements = discriminatingRequirements;
    const timing = ensureString(discriminatingRequirements.timing, "early_act3");
    discriminatingRequirements.timing = ["late_act2", "early_act3", "mid_act3"].includes(timing)
      ? timing
      : "early_act3";
    discriminatingRequirements.must_reference_inference_step =
      typeof discriminatingRequirements.must_reference_inference_step === "boolean"
        ? discriminatingRequirements.must_reference_inference_step
        : true;

    return cml;
  };

  let lastError: Error | undefined;
  let lastValidation: any = { valid: false, errors: ["No attempts made"] };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Generate CML
      const response = await client.chatWithRetry({
        messages: prompt.messages,
        model:
          process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
        temperature: 0.7,
        maxTokens: 8000,
        jsonMode: true, // JSON output
        logContext: {
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          retryAttempt: attempt,
        },
      });

      // Parse JSON/YAML
      let cml: any;
      let jsonParseError: Error | undefined;
      let yamlParseError: Error | undefined;
      const sanitizeYaml = (raw: string) =>
        raw
          .split("\n")
          .map((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) return line;

            const doubleQuoteMatch = line.match(/^([\s\S]*?:\s*"(?:[^"\\]|\\.)*")\s+(.+)$/);
            if (doubleQuoteMatch && !doubleQuoteMatch[2].trimStart().startsWith("#")) {
              return doubleQuoteMatch[1];
            }

            const singleQuoteMatch = line.match(/^([\s\S]*?:\s*'(?:[^'\\]|\\.)*')\s+(.+)$/);
            if (singleQuoteMatch && !singleQuoteMatch[2].trimStart().startsWith("#")) {
              return singleQuoteMatch[1];
            }

            if (!trimmed.includes(":")) {
              const isListItem = trimmed.startsWith("-") || trimmed.startsWith("[") || trimmed.startsWith("{");
              if (!isListItem) {
                const indentMatch = line.match(/^(\s*)/);
                const indent = indentMatch ? indentMatch[1] : "";
                return `${indent}# ${trimmed}`;
              }
            }

            return line;
          })
          .join("\n");

      const tryParseJson = (raw: string): any => {
        try {
          return JSON.parse(raw);
        } catch (error) {
          jsonParseError = error as Error;
        }

        try {
          const repaired = jsonrepair(raw);
          return JSON.parse(repaired);
        } catch {
          // ignore repair failure
        }

        const trimmed = raw.trim();
        const start = trimmed.indexOf("{");
        const end = trimmed.lastIndexOf("}");
        if (start !== -1 && end > start) {
          const candidate = trimmed.slice(start, end + 1);
          try {
            return JSON.parse(candidate);
          } catch (error) {
            jsonParseError = error as Error;
          }

          try {
            const repaired = jsonrepair(candidate);
            return JSON.parse(repaired);
          } catch {
            // ignore repair failure
          }
        }

        return undefined;
      };

      const modelName = response.model || "unknown";
      cml = tryParseJson(response.content);

      if (!cml) {
        try {
          const sanitized = sanitizeYaml(response.content);
          cml = parseYAML(sanitized);

          await logger.logResponse({
            runId: inputs.runId,
            projectId: inputs.projectId,
            agent: "Agent3-CMLGenerator",
            operation: "parse_output_sanitized",
            model: modelName,
            success: true,
            validationStatus: "pass",
            retryAttempt: attempt,
            latencyMs: Date.now() - startTime,
            metadata: { note: "YAML sanitized after parse failure" },
          });
        } catch (error) {
          yamlParseError = error as Error;
        }
      }

      if (!cml) {
        const jsonMessage = jsonParseError ? jsonParseError.message : "Unknown JSON parse error";
        const yamlMessage = yamlParseError ? yamlParseError.message : "Unknown YAML parse error";

        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          operation: "parse_yaml",
          errorMessage: `Output parse failed: ${jsonMessage}; ${yamlMessage}`,
          retryAttempt: attempt,
          metadata: { rawContent: response.content.substring(0, 500) },
        });

        if (attempt < maxAttempts) {
          continue; // Retry
        } else {
          throw new Error(`Output parsing failed after ${maxAttempts} attempts: ${jsonMessage}`);
        }
      }

      const normalized = normalizeCml(cml as Record<string, unknown>);

      // Validate against CML schema
      const validation = validateCml(normalized);
      lastValidation = validation;

      const latencyMs = Date.now() - startTime;
      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent3-CMLGenerator"] || 0;

      if (validation.valid) {
        // Success!
        await logger.logResponse({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          operation: "generate_cml",
          model: modelName,
          success: true,
          validationStatus: "pass",
          retryAttempt: attempt,
          latencyMs,
          metadata: {
            axis: inputs.primaryAxis,
            castSize: inputs.castSize,
            complexity: inputs.complexityLevel,
          },
        });

        return {
          cml: normalized,
          validation,
          attempt,
          latencyMs,
          cost,
        };
      }

      // Validation failed
      await logger.logResponse({
        runId: inputs.runId,
        projectId: inputs.projectId,
        agent: "Agent3-CMLGenerator",
        operation: "generate_cml",
        model: modelName,
        success: false,
        validationStatus: "fail",
        errorMessage: `Validation errors: ${validation.errors.join("; ")}`,
        retryAttempt: attempt,
        latencyMs,
        metadata: {
          validationErrors: validation.errors,
          axis: inputs.primaryAxis,
        },
      });

      if (attempt < maxAttempts) {
        // Will retry
        continue;
      } else {
        // Max attempts reached - call Agent 4 (Revision) to fix validation errors
        await logger.logRequest({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          operation: "calling_agent4_revision",
          metadata: {
            validationErrorCount: validation.errors.length,
            agent3Attempts: maxAttempts,
          },
        });

        try {
          const revisionResult = await reviseCml(client, {
            originalPrompt: { 
              system: prompt.system, 
              developer: prompt.developer || "", 
              user: prompt.user 
            },
            invalidCml: yaml.dump(cml),
            validationErrors: validation.errors,
            attempt: 1,
            runId: inputs.runId,
            projectId: inputs.projectId,
          });

          // Agent 4 succeeded! Return the fixed CML
          const totalLatency = Date.now() - startTime;
          const costTracker = client.getCostTracker();
          const totalCost = costTracker.getSummary().byAgent["Agent3-CMLGenerator"] || 0;
          const revisionCost = costTracker.getSummary().byAgent["Agent4-Revision"] || 0;

          await logger.logResponse({
            runId: inputs.runId,
            projectId: inputs.projectId,
            agent: "Agent3-CMLGenerator",
            operation: "generate_cml_with_revision",
            model: modelName,
            success: true,
            validationStatus: "pass",
            retryAttempt: attempt,
            latencyMs: totalLatency,
            metadata: {
              agent3Attempts: maxAttempts,
              agent4Attempts: revisionResult.attempt,
              totalRevisions: revisionResult.revisionsApplied.length,
              agent3Cost: totalCost,
              agent4Cost: revisionCost,
              totalCost: totalCost + revisionCost,
              axis: inputs.primaryAxis,
            },
          });

          return {
            cml: revisionResult.cml,
            validation: revisionResult.validation,
            attempt: maxAttempts + revisionResult.attempt,
            latencyMs: totalLatency,
            cost: totalCost + revisionCost,
            revisedByAgent4: true,
            revisionDetails: {
              attempts: revisionResult.attempt,
              revisionsApplied: revisionResult.revisionsApplied,
            },
          };
        } catch (revisionError) {
          // Agent 4 also failed - throw with context
          await logger.logError({
            runId: inputs.runId,
            projectId: inputs.projectId,
            agent: "Agent3-CMLGenerator",
            operation: "agent4_revision_failed",
            errorMessage: (revisionError as Error).message,
            metadata: {
              agent3Attempts: maxAttempts,
              originalErrors: validation.errors,
            },
          });

          throw new Error(
            `CML generation failed after Agent 3 (${maxAttempts} attempts) and Agent 4 revision. ` +
            `Original errors: ${validation.errors.slice(0, 5).join("; ")}... ` +
            `Revision error: ${(revisionError as Error).message}`
          );
        }
      }
    } catch (error) {
      lastError = error as Error;
      
      await logger.logError({
        runId: inputs.runId,
        projectId: inputs.projectId,
        agent: "Agent3-CMLGenerator",
        operation: "generate_cml",
        errorMessage: (error as Error).message,
        retryAttempt: attempt,
        metadata: { attempt, maxAttempts },
      });

      if (attempt >= maxAttempts) {
        throw error;
      }
    }
  }

  // Should not reach here, but just in case
  throw lastError || new Error(`CML generation failed: ${lastValidation.errors.join("; ")}`);
}
