/**
 * Agent 3: CML Generator - Prompt building and generation
 * This is the CORE agent - the backbone of the mystery generation system
 */

import type { AzureOpenAIClient, LLMLogger, Message } from "@cml/llm-client";
import { getGenerationParams } from "@cml/story-validation";
import { parse as parseYAML } from "yaml";
import { resolveDesignModel } from "./utils/model-tiers.js";
import { validateCml, isVictimArchetype } from "@cml/cml";
import { reviseCml } from "./agent4-revision.js";
import { patchCmlNode, makeLlmPatchProposer } from "./agent4-patch.js";
import { jsonrepair } from "jsonrepair";
import { looksTruncatedJson } from "./shared/json-boundary.js";
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
import { groundDiscriminatingKnowledgeRevealed } from "./shared/grounding.js";
import {
  loadSeedCMLFiles,
  extractStructuralPatterns,
  selectRelevantPatterns,
  formatPatternsForPrompt,
} from "./utils/seed-loader.js";
import { join } from "path";

// L1 (ANALYSIS_48 T1.1): map a crime classification to a physical manner of death, used as the
// fallback when the model didn't author CASE.death_method. Mirrors DEATH_METHOD_CANON in
// agent9-prose/prompt-builder and DEATH_METHOD_TOKENS in rubric-score/facts (kept local to avoid a
// cross-package coupling from Agent 3 into the prose layer; the three are unified in ANALYSIS_48 T3).
const DEATH_METHOD_FROM_CRIME_CLASS: Array<[RegExp, string]> = [
  [/stab|knif|blade|dagger/i, "stabbing"],
  [/shoot|shot|gun|firearm|pistol|revolver/i, "gunshot"],
  [/strangl|garrot|throttl/i, "strangulation"],
  [/poison|arsenic|cyanide|toxin/i, "poisoning"],
  [/bludgeon|blunt|cudgel|struck|\bblow\b/i, "a blunt-force blow"],
  [/drown/i, "drowning"],
  [/smother|suffocat|asphyxiat/i, "suffocation"],
  [/electrocut/i, "electrocution"],
  [/burn|arson/i, "burning"],
];

/** Returns a physical manner-of-death phrase from the crime subtype/category, or "" if none matches. */
export const deriveDeathMethodFromCrimeClass = (subtype: string, category: string): string => {
  const haystack = `${subtype} ${category}`;
  for (const [re, method] of DEATH_METHOD_FROM_CRIME_CLASS) if (re.test(haystack)) return method;
  return "";
};

// A_53 P10 (seed-loader-recompute-per-generate-call): memoize the seed library load+extract+format
// keyed by (examplesDir, primaryAxis). generateCML rebuilds the prompt on each collision/novelty
// retry, which otherwise re-reads and re-parses the entire seed library up to 3×/run for an input
// that never changes. The cache is process-local (seed files are read-only at runtime).
const seedPatternsTextCache = new Map<string, string>();

/**
 * Build the complete prompt for CML generation
 */
export function buildCMLPrompt(inputs: CMLPromptInputs, examplesDir?: string): PromptMessages {
  // Load seed patterns if examples directory provided
  let seedPatternsText = "No seed patterns loaded (will generate from first principles).";
  if (examplesDir) {
    // A_53 P10 (seed-loader-recompute-per-generate-call): serve from the (dir, axis) memo when present.
    const seedCacheKey = `${examplesDir}::${inputs.primaryAxis}`;
    const cached = seedPatternsTextCache.get(seedCacheKey);
    if (cached !== undefined) {
      seedPatternsText = cached;
    } else {
      try {
        const cmlFiles = loadSeedCMLFiles(examplesDir);
        const patterns = extractStructuralPatterns(cmlFiles);
        const relevantPatterns = selectRelevantPatterns(patterns, inputs.primaryAxis, 3);
        seedPatternsText = formatPatternsForPrompt(relevantPatterns);
        seedPatternsTextCache.set(seedCacheKey, seedPatternsText);
      } catch (error) {
        console.warn("Failed to load seed patterns:", error);
      }
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

**PLOT STRUCTURE ANTI-TROPES (unconditional — not overridable by theme, novelty constraints, or input seed):**
The following plot elements are permanently banned because they will trigger a novelty-audit failure (Agent 8 similarity ≥ 0.75 against the seed library):
- Inheritance dispute as the primary motive (victim recently changed will; culprit stands to lose or gain)
- Poison concealed in coffee, tea, hot milk, medicine, or food at a domestic table
- Elderly wealthy female victim who owns a country estate and controls family finances
- Culprit who is the victim's spouse or domestic partner using household poisoning

If two or more of the above are present, the story will be rejected. Design around different motive structures: blackmail, professional rivalry, silencing a witness, concealing a past crime, jealousy unrelated to inheritance. Use non-domestic murder mechanisms from the hard-logic device list.

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
  REQUIRED_EVIDENCE ANTI-ABSTRACTNESS CONTRACT:
  - Each required_evidence item must name at least one concrete anchor from CML context (person, object, document, location, timestamp/time phrase, physical trace, access record, witness statement).
  - Reject placeholders and generic summaries (for example: "timeline discrepancy", "suspicious behavior", "motive pressure", "detective insight", "inconsistency", "anomaly").
  - Reject detective-only private cognition phrasing (for example: "he seems guilty", "she appears nervous") as evidence.
  - If a step cannot be supported by 2-4 concrete entries, rewrite the step so concrete evidence exists before final output.
  Avoid abstract placeholders in required_evidence (for example: "timeline discrepancy",
  "suspicious behavior", "hidden motive", "detective insight"). Each entry must name
  a concrete artifact, witness statement, document, timestamp, physical trace, or access record.
  Do NOT use detective-only behavioral shorthand as evidence (for example: "signals of guilt",
  "suspicious reactions", "observed defensiveness", or "confession").
5. The constraint_space MUST contain at least one contradiction per inference step - 
   a pair of facts that create logical tension the reader can resolve
6. The discriminating_test.design MUST reference specific evidence the reader has 
  already seen in earlier inference steps
7. If discriminating_test.design references a mechanism detail (clock tampering, forged pass,
   access key use, poison preparation, ledger alteration), that exact mechanism evidence must
   already appear in required_evidence of at least one earlier inference step.
8. discriminating_test.design, discriminating_test.knowledge_revealed, and discriminating_test.pass_condition
   must describe a factual contradiction, mechanism exposure, or suspect elimination the reader can verify.
   Do NOT make the proof depend on reactions, defensiveness, "signals of guilt", or confession.
9. Do NOT use procedure-only wrapper wording in discriminating_test.design (for example: "a reenactment is staged", "putting guests under scrutiny", "events surrounding", "under observation") unless the sentence also states the concrete contradiction or mechanism fact being proven from earlier evidence.

Quality bar:
- Every major section must be operationally useful to downstream agents (clues, fair-play audit, narrative outline, prose).
- Avoid generic mystery boilerplate; encode concrete contradictions, named evidence, and explicit eliminations.
- Maintain strict axis coherence: false_assumption type, mechanism logic, and discriminating test must align.

Hard constraints learned from failures:
- Keep required setting fields non-empty, including CASE.meta.setting.institution.
- Use canonical enum vocabulary consistently; avoid ad-hoc variant labels.
- Ensure discriminating_test.evidence_clues is non-empty and each clue ID appears in prose_requirements.clue_to_scene_mapping.
- Ensure each inference step has concrete required_evidence that downstream clue extraction can convert directly to clues.
- Use era-appropriate worded time references in narrative-facing evidence text (for example, "ten minutes to eleven", not "10:50 PM").
- Ensure each inference effect is consistent with final culprit assignment; do not eliminate the declared culprit in any inference step.

Micro-exemplars:
- Weak inference observation: "Witness accounts conflict."
- Strong inference observation: "Station porter logs Dr. Vale boarding the twelve minutes past eight service while his alibi claims he was at the manor at ten past eight."
- Weak effect: "Narrows suspects."
- Strong effect: "Eliminates Hartwell by proving key access ended at twenty minutes to eight, forty minutes before symptom onset."
- Weak discriminating test: "A suspect reacts defensively during the reenactment and reveals guilt."
- Strong discriminating test: "The porter log, forged timetable, and altered clock prove only Hartwell's alibi depends on the false timeline."
- Weak discriminating test design: "A reenactment is staged, putting guests under scrutiny."
- Strong discriminating test design: "Comparing the porter log with the forged timetable and reset clock proves Hartwell's claimed arrival is impossible."

GOLDEN AGE GENRE STRUCTURES (required — these make the case a fair-play mystery, not a bare logic puzzle):
- death_method: the PHYSICAL manner of death — HOW the victim was killed (e.g. "stabbed with a letter opener", "poisoned with arsenic", "struck with a fire iron", "strangled", "shot"). This MUST be a bodily killing action and MUST be DISTINCT from the concealment mechanism: the clock/timeline/alibi trick goes in hidden_model.mechanism, NEVER here. The reveal has to state how the victim DIED, not only how the crime was hidden — a case that explains only the concealment fails the fair-play contract and is rejected by the rubric's weak-murder-method gate.
- false_solution: a CONVINCING but WRONG solution accusing an INNOCENT suspect, with a chain of supporting_points, and exactly one flaw (the_one_flaw) the detective later notices. The accused_suspect MUST NOT be the real culprit.
- red_herrings: at least TWO misleading details. Each MUST have an innocent_explanation that resolves it — never leave a suspicious detail unexplained. Each red herring MUST misdirect TOWARD an INNOCENT suspect (ideally the false_solution's accused) and AWAY from the real culprit — a "red herring" that points at the actual culprit adds no misdirection and is wrong. Red herrings should be plausible and meaningful, not random.
- motive: the culprit's motive must be specific and human, NOT a generic "financial desperation / inheritance / money troubles" cliché on its own (the #1 novelty-failure pattern). If money is involved, anchor it to a concrete, particular stake (a specific secret, relationship, reputation, or obligation) that makes THIS culprit's choice feel inevitable.
- closed_circle.suspects: the sealed pool of suspects. The real culprit (culpability.culprits) MUST be a member. No outsider may be the culprit.
- hidden_model.mechanism.actual_time_of_death / apparent_time_of_death: when the concealment fakes a TIME, both are REQUIRED as concrete clock times ("9:10", "a quarter past ten"). They MUST satisfy the direction that makes a false-time trick work:
    • the APPARENT time must fall INSIDE a window the culprit can account for — the staged time is what gives the culprit their alibi;
    • the ACTUAL time must fall in a gap the culprit CANNOT account for — the real time is what exposes them.
  Staging a time that lands inside the culprit's own unaccounted gap incriminates them and is backwards; a reader will notice immediately. Say plainly, in the mechanism description, WHY the culprit chose to move the apparent time in that direction. If the concealment does not fake a time, leave both fields empty.
- THE HONEST TIMEPIECE: when the concealment fakes a time, the case MUST contain one independent time source the tampering did not reach — a wristwatch on the body, a stopped mechanism, a witnessed event, a log kept elsewhere. It is what lets the detective prove which reading is false, and the reader must be able to see it doing that work. Without it the deduction rests on assertion. If two timepieces disagree, the story must establish WHICH is reliable and WHY, never leave both merely contradictory.
- SETTING NAMES: refer to each location by the SAME name every time it appears, using the names established in the location profiles. Do not invent decorative variants for the same room ("the lounge" must not also appear as "the glass-domed ballroom" or "the marble lobby chandelier room"); a reader tracking who was where cannot follow a place that changes name.
- alibi_window (per suspect, in cast): the span each suspect can account for. It MUST OVERLAP the window in which the victim actually died — an alibi covering a period when nobody claims the murder happened proves nothing and makes the clearances meaningless. State it as a concrete clock span ("8:00 to 8:30 in the billiard room"), never a vague part of day ("evening"). Where the concealment makes the APPARENT time of death differ from the REAL one, the alibis that matter are those covering the REAL window; a suspect whose alibi covers only the apparent time has no alibi at all, which is exactly the trap the detective should notice.
- The reader must be able to reach the true solution from clues shown before the reveal; the detective must not rely on a confession or secret knowledge.

Before finalizing, run a silent checklist:
- death_method names a PHYSICAL manner of death (stabbed/poisoned/struck/strangled/shot), distinct from the concealment mechanism
- if the concealment creates a false time or reading, it tampers with a genuinely resettable instrument (clock/watch/chime/bell/log), NOT a reading fixed by an external driver (sundial/shadow, thermometer, tide, candle) which cannot be time-shifted by cooling/warping/moving it
- if the concealment fakes a time: apparent_time_of_death sits inside a culprit alibi window, actual_time_of_death sits in a culprit gap, and the two differ
- all required top-level keys present
- 3-5 inference steps with required_evidence in each
- discriminating_test uses only previously exposed evidence
- false_solution accuses an innocent suspect and has exactly one flaw
- at least two red_herrings, each with an innocent_explanation
- closed_circle.suspects includes the real culprit and excludes outsiders
- fair_play booleans true with specific explanation
- required_evidence entries are concrete and non-abstract in every step
- prose_requirements populated and clue IDs traceable
- required setting fields (including institution) are non-empty
- canonical enum forms only
- narrative-facing time references are era-appropriate and written in words
- inference effects do not contradict culprit assignment`;

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
  death_method: ""  # REQUIRED — physical manner of death (stabbed/poisoned/struck/strangled/shot): HOW the victim died, NOT the concealment trick
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
      actual_time_of_death: ""
      apparent_time_of_death: ""
    outcome:
      result: ""
  false_assumption:
    statement: ""
    type: ""
    why_it_seems_reasonable: ""
    what_it_hides: ""
  false_solution:
    accused_suspect: "Name of an INNOCENT suspect the evidence seems to point to"
    supporting_points:
      - "Evidence/motive that makes this wrong solution look convincing"
      - "A second supporting point"
    the_one_flaw: "The single fact this false solution cannot explain — what the detective notices"
    refuted_in_chapter: 6
  red_herrings:
    - id: "red_herring_1"
      description: "A genuinely suspicious circumstance"
      points_at_suspect: "Name it misleads suspicion toward"
      innocent_explanation: "The benign truth behind it, revealed before the solution"
      resolved_in_chapter: 7
    - id: "red_herring_2"
      description: "A second misleading detail"
      points_at_suspect: "Name"
      innocent_explanation: "Its innocent explanation"
      resolved_in_chapter: 7
  closed_circle:
    suspects:
      - "Every suspect name forming the sealed pool (culprit MUST be one of these)"
    rationale: "Why no outsider could be responsible"
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
    # Leave empty — Agent 5 back-fills evidence_clues with the real planted clue ids. Do NOT emit
    # placeholder ids like clue_1/clue_2 (they are treated as canonical evidence obligations and abort).
    evidence_clues: []
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
${inputs.castGenders && Object.keys(inputs.castGenders).length > 0 ? `- Gender per character (copy exactly into each cast item's gender field): ${inputs.castNames.filter(n => inputs.castGenders![n]).map(n => `${n}: ${inputs.castGenders![n]}`).join(', ')}` : ''}
- Detective Type: ${inputs.detectiveType}
- Victim Archetype: ${inputs.victimArchetype} — MUST appear in cast with role_archetype "Victim". CRITICAL: "${inputs.victimArchetype}" is the victim and MUST NOT appear in culpability.culprits[] under any circumstances.
${inputs.culpritExclusionNames && inputs.culpritExclusionNames.length > 0 ? `- FORBIDDEN culprits (these names MUST NOT be in culpability.culprits[]): ${inputs.culpritExclusionNames.join(', ')} — they are victim or detective roles.` : ''}

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
6. Create mechanism that exploits the false assumption. PHYSICAL COHERENCE (critical — a physically impossible trick fails fair-play and is rejected): if the concealment works by producing a FALSE TIME or any false reading, it must tamper with an instrument whose value can genuinely be reset, advanced, retarded, or stopped — a clock, watch, chime, bell, whistle, or written log can all be falsified this way. A reading whose value is fixed by an EXTERNAL physical driver CANNOT be time-shifted by tampering with the instrument: a sundial/shadow is set by the sun's geometry, a thermometer by ambient heat, a tide by the moon, a burned candle or wick by elapsed burning. Cooling, warping, chilling, or moving such a device changes the reading's VALUE or POSITION, never the underlying TIMELINE — "cold warped the plate and delayed the sundial's shadow by minutes" is a CATEGORY ERROR and is rejected. Name the specific instrument and the physically real way it was falsified
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
    Every entry must include at least one concrete anchor (person/object/document/location/time phrase/trace/access record/witness statement).
    Forbidden entries include abstract placeholders and detective-only interpretation (for example "suspicious behavior", "signals of guilt", "detective insight").
   e. reader_observable: true (all steps must be reader-observable for fair play)
9. Create discriminating test appropriate for ${inputs.primaryAxis} axis, following these HARD RULES:
   a. DESIGN ORDER: Write all inference_path steps FIRST (progressively revealing the mechanism). Design the discriminating test LAST, based only on what those steps already establish.
   b. NO NEW FACTS IN THE TEST: Every mechanical, physical, or causal detail the test exploits MUST already appear as required_evidence in at least one prior inference step. If your test relies on "clock spring tension" or "premeditated purchase" — that exact evidence must be in an earlier step's required_evidence and marked reader_observable: true.
   c. PREMEDITATION MUST BE READER-VISIBLE: If the culprit's guilt depends on premeditation or special planning, this must be surfaced as a concrete reader-observable clue in the inference path — not revealed privately to the detective and withheld until confrontation.
   d. EXAMPLES:
      ✗ WRONG: Test reveals "Kenneth adjusted the clock spring" for the first time → Clue Visibility 0/100
      ✗ WRONG: Detective privately deduces premeditation; reader sees it only at confrontation → Information Parity 0/100
      ✓ CORRECT: Inference step 2 required_evidence = ["clock spring shows fresh tool marks", "Kenneth's pocket watch runs eight minutes fast"] → Test applies that KNOWN evidence to stage a controlled comparison
      ✓ CORRECT: Inference step 3 required_evidence = ["receipt dated two weeks before murder", "Kenneth's handwriting on order form"] → Confrontation synthesises what reader already deduced
    e. EVIDENCE TRACEABILITY: discriminating_test.evidence_clues MUST be a non-empty array of clue IDs and each listed clue ID must appear in prose_requirements.clue_to_scene_mapping.
    f. ANTI-ABSTRACTION: If discriminating_test.design references mechanism details (for example clock spring marks, forged signatures, key transfer, poison preparation, altered ledger entries), those exact details must already appear as concrete required_evidence in earlier inference steps.
    g. FACT-FORWARD TEST DESIGN: Do not stop at procedure wrappers ("reenactment", "staged", "under scrutiny", "surrounding events"). The design sentence must explicitly name the contradiction or mechanism fact being proven from earlier evidence.
    h. UNIQUE-MEANS DISCRIMINATOR (critical — closes the "unfair reveal"): if the concealment mechanism requires a special skill, tool, access, or knowledge to execute (e.g. clock-tampering needs clockwork/horological knowledge; a forged ledger needs bookkeeping access; a poison needs pharmaceutical know-how), then an EARLY or MID inference step MUST establish — as concrete reader_observable required_evidence — that the CULPRIT uniquely possessed that capability AND that the other suspects did not. The reveal/discriminating test may rely only on this PLANTED means-discriminator. NEVER introduce the culprit's special capability ("only X had the mechanical knowledge", "only X could read the dining log") for the first time at the reveal — that is the #1 fair-play failure. Add an evidence_clue for it in clue_to_scene_mapping at an early/mid scene.
    i. PLANT BEFORE REVEAL: every clue ID in discriminating_test.evidence_clues MUST be mapped in prose_requirements.clue_to_scene_mapping to a scene that comes strictly BEFORE prose_requirements.discriminating_test_scene (earlier act, or same act + earlier scene). A discriminating clue planted at or after the test scene is "late information" and fails fair-play.
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
    - Every clue ID used in discriminating_test.evidence_clues MUST be present in clue_to_scene_mapping
    This ensures Agent 9 knows exactly where to place validation-critical content.
  18. Required setting fields must be non-empty, including CASE.meta.setting.institution.
  19. Use canonical enum/value forms only (avoid ad-hoc variants).
  20. Use era-appropriate worded time references in narrative-facing text (for example, "quarter past nine" rather than numeric digital notation).
  21. REQUIRED SELF-CHECK BEFORE OUTPUT:
    - Iterate all inference_path.steps.
    - Verify each step has required_evidence length 2-4.
    - Verify each required_evidence entry is concrete and anchored (not abstract, not detective-private cognition).
    - If any step fails, rewrite that step before returning JSON.

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
  maxAttempts?: number
): Promise<CMLGenerationResult> {
  const logger = client.getLogger();
  const startTime = Date.now();
  const config = getGenerationParams().agent3_cml.params;
  const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;

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
        gender: existing.gender || inputs.castGenders?.[name] || undefined,
      };
    });

    const roleIncludes = (role: unknown, tokens: string[]) => {
      const text = String(role ?? "").toLowerCase();
      return tokens.some((token) => text.includes(token));
    };

    // Wave 1 integrity lock: when a victim archetype is supplied, force the matching cast
    // entry to victim role and make them ineligible as culprit.
    const victimHint = String(inputs.victimArchetype ?? "").trim().toLowerCase();
    if (victimHint) {
      const hintedVictim = normalizedCast.find((member) =>
        String(member.name ?? "").trim().toLowerCase() === victimHint,
      );
      if (hintedVictim) {
        hintedVictim.role_archetype = "victim";
        hintedVictim.culprit_eligibility = "ineligible";
        hintedVictim.culpability = "innocent";
      }
    }

    // Any character explicitly marked victim in the cast must remain ineligible and innocent.
    for (const member of normalizedCast) {
      if (roleIncludes(member.role_archetype, ["victim"])) {
        member.culprit_eligibility = "ineligible";
        member.culpability = "innocent";
      }
    }

    caseBlock.cast = normalizedCast;

    const culpability = ensureObject(caseBlock.culpability);
    caseBlock.culpability = culpability;
    const detectiveNameSet = new Set(
      normalizedCast
        .filter((member) => roleIncludes(member.role_archetype, ["detective", "investigator", "inspector"]))
        .map((member) => String(member.name ?? "").trim().toLowerCase()),
    );
    const victimNameSet = new Set(
      normalizedCast
        .filter((member) => roleIncludes(member.role_archetype, ["victim"]))
        .map((member) => String(member.name ?? "").trim().toLowerCase()),
    );

    const rawCulprits = ensureArray(culpability.culprits)
      .map((name) => String(name ?? "").trim())
      .filter(Boolean);

    const validCulprits = rawCulprits.filter((name) => {
      const lowered = name.toLowerCase();
      if (victimNameSet.has(lowered) || detectiveNameSet.has(lowered)) return false;
      const castEntry = normalizedCast.find((member) => String(member.name ?? "").trim().toLowerCase() === lowered);
      if (!castEntry) return false;
      return castEntry.culprit_eligibility === "eligible";
    });

    const fallbackCulprit = normalizedCast.find((member) => {
      const lowered = String(member.name ?? "").trim().toLowerCase();
      if (!lowered) return false;
      if (victimNameSet.has(lowered) || detectiveNameSet.has(lowered)) return false;
      return member.culprit_eligibility === "eligible";
    });

    const normalizedCulprits = validCulprits.length > 0
      ? [validCulprits[0]]
      : fallbackCulprit
        ? [String(fallbackCulprit.name)]
        : [normalizedCast[0]?.name ?? "Unknown"].filter(Boolean);

    culpability.culprits = normalizedCulprits;
    culpability.culprit_count = normalizedCulprits.length;

    const normalizedCulpritSet = new Set(normalizedCulprits.map((name) => name.toLowerCase()));
    for (const member of normalizedCast) {
      const lowered = String(member.name ?? "").trim().toLowerCase();
      if (!lowered) continue;
      if (normalizedCulpritSet.has(lowered)) {
        member.culpability = "guilty";
        member.culprit_eligibility = "eligible";
      } else if (member.culpability === "guilty") {
        member.culpability = "unknown";
      }
    }

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
    // A_71 — false-time direction fields. Default to "" (not a placeholder time): an absent time must
    // read as "this concealment does not fake a time", which checkTimelineDeception treats as
    // nothing-to-check. Inventing a default here would fabricate a coherence claim the case never made.
    hiddenMechanism.actual_time_of_death = ensureString(hiddenMechanism.actual_time_of_death, "");
    hiddenMechanism.apparent_time_of_death = ensureString(hiddenMechanism.apparent_time_of_death, "");
    const hiddenOutcome = ensureObject(hidden.outcome);
    hidden.outcome = hiddenOutcome;
    hiddenOutcome.result = ensureString(hiddenOutcome.result, "Victim poisoned.");

    // L1 (ANALYSIS_48 T1.1): guarantee a PHYSICAL manner of death so the prose resolveDeathMethod chain
    // and the rubric weak-murder-method grader always have a token to enforce. Prefer the model's
    // authored value; else derive from the crime classification; else a neutral physical default. Kept
    // separate from hidden_model.mechanism (the concealment trick) — the reveal must name the killing.
    const authoredDeathMethod = ensureString(caseBlock.death_method, "").trim();
    caseBlock.death_method =
      authoredDeathMethod ||
      deriveDeathMethodFromCrimeClass(
        ensureString(crimeClass.subtype, ""),
        ensureString(crimeClass.category, ""),
      ) ||
      "poisoning";

    const falseAssumption = ensureObject(caseBlock.false_assumption);
    caseBlock.false_assumption = falseAssumption;
    falseAssumption.statement = ensureString(falseAssumption.statement, "Death was natural.");
    falseAssumption.type = ensureString(falseAssumption.type, inputs.primaryAxis);
    falseAssumption.why_it_seems_reasonable = ensureString(falseAssumption.why_it_seems_reasonable, "Symptoms mimic illness.");
    falseAssumption.what_it_hides = ensureString(falseAssumption.what_it_hides, "Poisoning timeline.");

    // SWEEP A — normalise the Golden Age genre structures so they are always present and
    // schema-valid. Defaults are derived from existing CASE data; the LLM is asked to author
    // richer versions (see prompt). The genre validator enforces quality (≥2 herrings with
    // innocent explanations, a false solution with a flaw, culprit inside the closed circle).
    const castEntries: any[] = Array.isArray(caseBlock.cast) ? (caseBlock.cast as any[]) : [];
    const culpritNamesForGenre: string[] = Array.isArray((caseBlock.culpability as any)?.culprits)
      ? ((caseBlock.culpability as any).culprits as any[]).map((n) => String(n).trim()).filter(Boolean)
      : [];
    const roleOf = (entry: any) => String(entry?.role_archetype ?? entry?.role ?? "").toLowerCase();
    const suspectNamesForGenre: string[] = castEntries
      .filter((e) => !roleOf(e).includes("detective") && !isVictimArchetype(roleOf(e)))
      .map((e) => String(e?.name ?? "").trim())
      .filter(Boolean);
    const innocentSuspect = suspectNamesForGenre.find((n) => !culpritNamesForGenre.includes(n));

    // Chapter-pointer fields are optional numbers; the LLM often emits strings ("Chapter 6", "6").
    // Coerce to an integer chapter number, or undefined when no number is present (validator skips
    // undefined optional fields). Prevents "must be number" validation failures.
    const coerceChapter = (value: unknown): number | undefined => {
      if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
      if (typeof value === "string") {
        const match = value.match(/\d+/);
        if (match) return parseInt(match[0], 10);
      }
      return undefined;
    };

    // closed_circle
    const closedCircle = ensureObject(caseBlock.closed_circle);
    caseBlock.closed_circle = closedCircle;
    const declaredCircle = ensureArray(closedCircle.suspects).map((n) => String(n).trim()).filter(Boolean);
    closedCircle.suspects = declaredCircle.length > 0
      ? Array.from(new Set(declaredCircle))
      : Array.from(new Set(suspectNamesForGenre));
    closedCircle.rationale = ensureString(
      closedCircle.rationale,
      "The suspects are bound together by the central situation and none could have come from outside it.",
    );

    // false_solution
    const falseSolution = ensureObject(caseBlock.false_solution);
    caseBlock.false_solution = falseSolution;
    falseSolution.accused_suspect = ensureString(
      falseSolution.accused_suspect,
      innocentSuspect || suspectNamesForGenre[0] || "an innocent member of the circle",
    );
    falseSolution.supporting_points = ensureArray(falseSolution.supporting_points);
    if ((falseSolution.supporting_points as any[]).length === 0) {
      falseSolution.supporting_points = [
        ensureString(falseAssumption.why_it_seems_reasonable, "Their motive and opportunity look strongest on the surface."),
      ];
    }
    falseSolution.the_one_flaw = ensureString(
      falseSolution.the_one_flaw,
      ensureString(falseAssumption.what_it_hides, "It cannot account for the one physical fact the detective fixes on."),
    );
    const refutedChapter = coerceChapter(falseSolution.refuted_in_chapter);
    if (refutedChapter === undefined) {
      delete falseSolution.refuted_in_chapter;
    } else {
      falseSolution.refuted_in_chapter = refutedChapter;
    }

    // red_herrings — coerce to a well-formed array; guarantee an innocent_explanation per entry.
    const rawHerrings = ensureArray(caseBlock.red_herrings) as any[];
    caseBlock.red_herrings = rawHerrings.map((h, idx) => {
      const obj = (h && typeof h === "object") ? h as Record<string, unknown> : {};
      return {
        id: ensureString(obj.id, `red_herring_${idx + 1}`),
        description: ensureString(obj.description, "A suspicious circumstance that draws the eye."),
        points_at_suspect: typeof obj.points_at_suspect === "string" ? obj.points_at_suspect : undefined,
        innocent_explanation: ensureString(
          obj.innocent_explanation,
          "It has an innocent explanation unrelated to the crime, revealed before the solution.",
        ),
        resolved_in_chapter: coerceChapter(obj.resolved_in_chapter),
      };
    });

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
    const originalStepCount = Array.isArray(inferencePath.steps) ? inferencePath.steps.length : 0;
    if (originalStepCount < 3) {
      // A_53 P2 (repair-not-abort): synthesize the missing steps from THIS case's own constraint
      // anchors + mechanism (never a fixed plot), pad to the floor of 3, and warn — so Agent 4 sees a
      // structurally-valid artifact instead of the run dying inside normalize. Evidence on synthesized
      // steps is repaired downstream by repairInferenceRequiredEvidence.
      const steps: any[] = Array.isArray(inferencePath.steps) ? [...inferencePath.steps] : [];
      const anchors = [
        ...ensureArray(constraintTime.anchors),
        ...ensureArray(constraintTime.windows),
        ...ensureArray(constraintTime.contradictions),
        ...ensureArray(constraintAccess.actors),
        ...ensureArray(constraintAccess.objects),
        ...ensureArray(constraintAccess.permissions),
        ...ensureArray(constraintPhysical.laws),
        ...ensureArray(constraintPhysical.traces),
        ...ensureArray(constraintSocial.trust_channels),
        ...ensureArray(constraintSocial.authority_sources),
      ]
        .map((entry) => ensureString(entry, "").trim())
        .filter((entry) => entry.length > 0);
      const mechanismHint = ensureString(
        ensureObject(ensureObject(caseBlock.hidden_model).mechanism).description,
        "",
      ).trim();
      while (steps.length < 3) {
        const i = steps.length;
        const anchor = anchors[i % Math.max(anchors.length, 1)];
        steps.push({
          observation: anchor && anchor.length > 0
            ? anchor
            : `Observation ${i + 1}: a concrete scene-level detail is established on the page.`,
          correction: mechanismHint
            ? `Re-read against the established mechanism (${mechanismHint}), this detail revises the surface sequence.`
            : `Correction ${i + 1}: the surface reading of this detail is revised by the on-page evidence.`,
          effect: "The set of viable explanations narrows toward a single testable hypothesis.",
          required_evidence: [],
          reader_observable: true,
        });
      }
      inferencePath.steps = steps;
      console.warn(
        `[agent3-cml] inference_path had ${originalStepCount} step(s); synthesized ${3 - originalStepCount} ` +
        `from this case's constraint anchors to reach the floor of 3 (repair-not-abort).`,
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
    discriminatingTest.evidence_clues = ensureArray(discriminatingTest.evidence_clues)
      .map((id) => String(id ?? "").trim())
      .filter((id) => id.length > 0);

    // Deterministic pre-check: keep knowledge_revealed grounded in reader-visible
    // inference evidence before schema/fair-play validation.
    groundDiscriminatingKnowledgeRevealed(caseBlock);

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
    inferenceRequirements.max_steps =
      typeof inferenceRequirements.max_steps === "number"
        ? inferenceRequirements.max_steps
        : config.inference_requirements.default_max_steps;
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

    // ── Deterministic suspect_clearance_scenes gap-fill ──────────────────────
    // Agent 3 LLM frequently omits one or more non-culprit suspects from
    // prose_requirements.suspect_clearance_scenes.  When a suspect is missing,
    // no clearance obligation is ever injected into prose prompts, and the
    // SuspectClosureValidator release gate fails even though the clues exist.
    // This patch ensures EVERY non-culprit, non-detective suspect has an entry.
    const proseRequirements = ensureObject(caseBlock.prose_requirements);
    caseBlock.prose_requirements = proseRequirements;
    const existingClearances: any[] = ensureArray(proseRequirements.suspect_clearance_scenes);

    // Identify which suspects already have a clearance entry (by name).
    const clearedNames = new Set<string>(
      existingClearances
        .filter((e: any) => e && typeof e.suspect_name === "string")
        .map((e: any) => (e.suspect_name as string).trim().toLowerCase())
    );

    // Derive culprit and detective sets from the normalized cast.
    const culpritSet = new Set<string>(
      ensureArray(culpability.culprits)
        .filter((n: unknown) => typeof n === "string")
        .map((n: unknown) => (n as string).trim().toLowerCase())
    );
    const detectiveRoles = new Set(["detective", "investigator", "inspector"]);
    const detectiveCastNames = new Set<string>(
      (normalizedCast as any[])
        .filter((c: any) => {
          const ra = String(c.role_archetype ?? c.role ?? "").toLowerCase();
          return [...detectiveRoles].some((r) => ra.includes(r));
        })
        .map((c: any) => (c.name as string).trim().toLowerCase())
    );

    // A_50 §9: drop any LLM-authored clearance for the CULPRIT (or detective) — the gap-fill below
    // already skips them on ADD, but the LLM's original list was written back UNFILTERED, leaving a
    // culprit-clearance that causes cleared_culprit_conflict. Remove them at the source.
    for (let i = existingClearances.length - 1; i >= 0; i -= 1) {
      const n = String(existingClearances[i]?.suspect_name ?? "").trim().toLowerCase();
      if (n && (culpritSet.has(n) || detectiveCastNames.has(n))) existingClearances.splice(i, 1);
    }

    // Determine a sensible default scene for gap-filled clearances:
    // one scene before the culprit revelation scene (which is late Act 3).
    const revealActNum: number =
      typeof proseRequirements.culprit_revelation_scene === "object" &&
      proseRequirements.culprit_revelation_scene !== null
        ? (Number((proseRequirements.culprit_revelation_scene as any).act_number) || 3)
        : 3;
    const revealSceneNum: number =
      typeof proseRequirements.culprit_revelation_scene === "object" &&
      proseRequirements.culprit_revelation_scene !== null
        ? (Number((proseRequirements.culprit_revelation_scene as any).scene_number) || 6)
        : 6;
    const clearanceActNum = revealActNum;
    // A_67 FIX-1(c): fold gap-filled clearances INTO the reveal / discriminating-test scene (where the
    // reveal already eliminates non-culprits on-page) instead of stamping them all onto a dedicated
    // pre-reveal scene — the structural root of the duplicate "clearance chapter" the probe reads flag.
    // Default-off (probe before default-on); when off, the historical (reveal − 1) coordinate is kept.
    const foldSuspectClearances =
      process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "true" || process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "1";
    const clearanceSceneNum = foldSuspectClearances ? revealSceneNum : Math.max(1, revealSceneNum - 1);

    // Build a lookup of clue IDs that appear to eliminate each suspect.
    const clueToSceneMapping: any[] = ensureArray(proseRequirements.clue_to_scene_mapping);
    const suspectEliminationClues: Map<string, string[]> = new Map();
    for (const clueEntry of clueToSceneMapping) {
      if (!clueEntry || typeof clueEntry !== "object") continue;
      const clueId = String(clueEntry.clue_id ?? "").trim();
      if (!clueId) continue;
      // Look for any cast name mentioned in this clue entry.
      const entryText = JSON.stringify(clueEntry).toLowerCase();
      for (const castMember of normalizedCast as any[]) {
        const nameLower = String(castMember.name ?? "").trim().toLowerCase();
        if (!nameLower || culpritSet.has(nameLower) || detectiveCastNames.has(nameLower)) continue;
        const surname = nameLower.split(" ").pop() ?? nameLower;
        if (entryText.includes(nameLower) || entryText.includes(surname)) {
          if (!suspectEliminationClues.has(nameLower)) suspectEliminationClues.set(nameLower, []);
          suspectEliminationClues.get(nameLower)!.push(clueId);
        }
      }
    }

    // Add missing entries.
    let gapFillCount = 0;
    for (const castMember of normalizedCast as any[]) {
      const nameLower = String(castMember.name ?? "").trim().toLowerCase();
      if (!nameLower) continue;
      if (culpritSet.has(nameLower) || detectiveCastNames.has(nameLower)) continue;
      if (clearedNames.has(nameLower)) continue;

      // Derive clearance method from the suspect's alibi_window if available.
      const alibiWindow = ensureString(castMember.alibi_window, "");
      const clearanceMethod = alibiWindow
        ? `Alibi confirmed: ${alibiWindow}`
        : "Alibi confirmed by corroborating witness";

      existingClearances.push({
        suspect_name: castMember.name,
        act_number: clearanceActNum,
        scene_number: clearanceSceneNum,
        clearance_method: clearanceMethod,
        supporting_clues: suspectEliminationClues.get(nameLower) ?? [],
      });
      gapFillCount += 1;
    }

    proseRequirements.suspect_clearance_scenes = existingClearances;

    if (gapFillCount > 0) {
      // Log is not available here; the caller will surface this in warnings.
      // The patch is silent — it corrects the LLM output without burning a retry attempt.
    }

    return cml;
  };

  let lastError: Error | undefined;
  let lastValidation: any = { valid: false, errors: ["No attempts made"] };

  for (let attempt = 1; attempt <= resolvedMaxAttempts; attempt++) {
    try {
      // Generate CML
      const retryContextMessage =
        attempt > 1 && !lastValidation.valid && Array.isArray(lastValidation.errors) && lastValidation.errors.length > 0
          ? {
              role: "user" as const,
              content:
                "Correction Targets (retry mode):\n" +
                lastValidation.errors.map((err: string) => `- ${err}`).join("\n") +
                "\nFix these failures first. Preserve already-valid sections unless they conflict with target fixes. Do not reintroduce previously rejected enum/value forms.",
            }
          : undefined;

      const messages = retryContextMessage
        ? [...prompt.messages, retryContextMessage]
        : prompt.messages;

      const response = await client.chatWithRetry({
        messages,
        model: resolveDesignModel()!,
        temperature: config.model.temperature,
        maxTokens: config.model.max_tokens,
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

        // A_65b Ph8 — truncation guard on THE CML BOUNDARY: jsonrepair closes a completion-limit
        // truncated payload into a valid-looking case with silently missing tail sections (the
        // phantom-clue class, a3c2973f, at the highest-stakes boundary). A truncated payload is
        // REFUSED, routing to the existing parse-failure retry path instead of ingesting a phantom.
        if (looksTruncatedJson(raw)) {
          jsonParseError = new Error(
            "CML payload looks completion-limit truncated (no closing brace) — refusing jsonrepair (phantom-structure risk); treat as parse failure",
          );
          return undefined;
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

        if (attempt < resolvedMaxAttempts) {
          continue; // Retry
        } else {
          throw new Error(`Output parsing failed after ${resolvedMaxAttempts} attempts: ${jsonMessage}`);
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

      if (attempt < resolvedMaxAttempts) {
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
            agent3Attempts: resolvedMaxAttempts,
          },
        });

        try {
          // CML_REPAIR_MODE = patch | rewrite | shadow.
          //  - patch:  node-scoped targeted patches first (redesign §4.2/§9.2); avoids re-emitting the
          //            whole 8000-token doc to fix one field. On full resolution returns immediately.
          //  - rewrite: legacy whole-CML revision (the default — preserves prior score behavior).
          //  - shadow: run patching for telemetry only and ALWAYS use the legacy rewrite result.
          // A_53 P9 (full-rewrite-resends-entire-cml-each-pass): the patch engine is the efficiency
          // win, but it is a SCORE-SENSITIVE default change (it produces a different CML revision path),
          // so A_53 integration keeps the default at "rewrite" until an A/B validates patch quality —
          // set CML_REPAIR_MODE=patch to opt in. (See ANALYSIS_53 integration note.)
          const repairMode = (process.env.CML_REPAIR_MODE ?? "rewrite").trim().toLowerCase();
          // A_53 P9 (patch-then-rewrite-double-spend): hold the partially-repaired CML from a
          // non-resolving patch pass so the legacy rewrite continues from patch progress instead of
          // discarding it and re-revising the ORIGINAL cml. Null when patch didn't run/produce output.
          let patchedSoFar: Record<string, unknown> | undefined;
          if (repairMode === "patch" || repairMode === "shadow") {
            try {
              const patchResult = await patchCmlNode({
                cml: cml as Record<string, unknown>,
                propose: makeLlmPatchProposer(client, { runId: inputs.runId, projectId: inputs.projectId }),
                maxPatches: 16,
              });
              // A_53 P9 (patch-then-rewrite-double-spend): remember the (partially) repaired doc; it is
              // used below as the rewrite seed when patch couldn't fully resolve, so applied patches are
              // not thrown away. (shadow mode intentionally ignores this and rewrites from original.)
              if (repairMode === "patch") {
                patchedSoFar = patchResult.cml as Record<string, unknown>;
              }
              await logger.logResponse({
                runId: inputs.runId,
                projectId: inputs.projectId,
                agent: "Agent3-CMLGenerator",
                operation: "cml_targeted_patch",
                model: modelName,
                success: patchResult.validation.valid,
                validationStatus: patchResult.validation.valid ? "pass" : "fail",
                retryAttempt: attempt,
                latencyMs: Date.now() - startTime,
                metadata: {
                  mode: repairMode,
                  errorsBefore: validation.errors.length,
                  errorsAfter: patchResult.validation.errors.length,
                  patchesApplied: patchResult.applied.length,
                  contractRejections: patchResult.rejected.length,
                },
              });
              if (repairMode === "patch" && patchResult.validation.valid) {
                // A_53 P6 (grounding-mutation-after-validation): the patch may have re-mutated
                // discriminating_test / inference_path — re-ground knowledge_revealed then re-validate
                // ONCE so grounding never ships stale after a mutation. (required_evidence is repaired
                // downstream by applyCmlRepairAndRevalidate in agent3-run.) Keep the patched validation
                // if re-grounding somehow regresses it.
                const patchedCaseBlock = (patchResult.cml as any)?.CASE ?? patchResult.cml;
                groundDiscriminatingKnowledgeRevealed(patchedCaseBlock as Record<string, unknown>);
                const regrounded = validateCml(patchResult.cml as any);
                return {
                  cml: patchResult.cml,
                  validation: regrounded.valid ? regrounded : patchResult.validation,
                  attempt: resolvedMaxAttempts + 1,
                  latencyMs: Date.now() - startTime,
                  cost: client.getCostTracker().getSummary().byAgent["Agent3-CMLGenerator"] || 0,
                  revisedByAgent4: true,
                  revisionDetails: {
                    attempts: patchResult.applied.length,
                    revisionsApplied: patchResult.applied.map((a) => `patched ${a.path} (${a.nodeBytes}b)`),
                  },
                };
              }
              // shadow mode, or patch mode that didn't fully resolve → fall through to legacy rewrite.
            } catch (patchErr) {
              await logger.logError({
                runId: inputs.runId,
                projectId: inputs.projectId,
                agent: "Agent3-CMLGenerator",
                operation: "cml_targeted_patch_error",
                errorMessage: (patchErr as Error).message,
              });
              // fall through to legacy rewrite on any patch-path error
            }
          }

          const revisionResult = await reviseCml(client, {
            originalPrompt: {
              system: prompt.system, 
              developer: prompt.developer || "", 
              user: prompt.user 
            },
            // A_53 P9 (patch-then-rewrite-double-spend): seed the rewrite with patch progress when a
            // patch pass ran but didn't fully resolve; else the original parse. Preserves applied
            // patches instead of re-revising from scratch.
            invalidCml: yaml.dump(patchedSoFar ?? cml),
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
              agent3Attempts: resolvedMaxAttempts,
              agent4Attempts: revisionResult.attempt,
              totalRevisions: revisionResult.revisionsApplied.length,
              agent3Cost: totalCost,
              agent4Cost: revisionCost,
              totalCost: totalCost + revisionCost,
              axis: inputs.primaryAxis,
            },
          });

          if (revisionResult.degraded) {
            // Graceful degrade: revision ran out of budget but returned best-so-far. Carry the
            // unresolved warnings forward and PROCEED rather than killing the run.
            await logger.logResponse({
              runId: inputs.runId,
              projectId: inputs.projectId,
              agent: "Agent3-CMLGenerator",
              operation: "generate_cml_degraded",
              model: modelName,
              success: false,
              validationStatus: "fail",
              retryAttempt: attempt,
              latencyMs: totalLatency,
              metadata: { unresolvedWarnings: revisionResult.unresolvedLogicWarnings?.length ?? 0 },
            });
          }

          return {
            cml: revisionResult.cml,
            validation: revisionResult.validation,
            attempt: resolvedMaxAttempts + revisionResult.attempt,
            latencyMs: totalLatency,
            cost: totalCost + revisionCost,
            revisedByAgent4: true,
            revisionDetails: {
              attempts: revisionResult.attempt,
              revisionsApplied: revisionResult.revisionsApplied,
            },
            degraded: revisionResult.degraded,
            unresolvedLogicWarnings: revisionResult.unresolvedLogicWarnings,
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
              agent3Attempts: resolvedMaxAttempts,
              originalErrors: validation.errors,
            },
          });

          throw new Error(
            `CML generation failed after Agent 3 (${resolvedMaxAttempts} attempts) and Agent 4 revision. ` +
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

      if (attempt >= resolvedMaxAttempts) {
        throw error;
      }
    }
  }

  // Should not reach here, but just in case
  throw lastError || new Error(`CML generation failed: ${lastValidation.errors.join("; ")}`);
}
