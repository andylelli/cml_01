# Actual Prompt Record

- Run ID: `run_121d9ea4-81a7-43d2-8346-0befa4662c46`
- Project ID: `proj_f12cd2e9-6843-40b3-a08b-1b5853396c34`
- Timestamp: `2026-04-14T21:46:21.350Z`
- Agent: `Agent3-CMLGenerator`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.7`
- Max Tokens: `8000`
- Retry Attempt: `1`
- Prompt Hash: `dcee7ee8144512c7`

## Message 1 (role=system)

```text
You are a CML (Case Modeling Language) 2.0 specialist. You design mystery cases as formal logical structures that can be mechanically validated.

Your role is to:
- Create complete CML documents following the 2.0 schema exactly
- Ensure all required sections are present and properly structured
- Build mysteries around specific logical axes (temporal, spatial, identity, behavioral, authority)
- Design mechanisms that exploit false assumptions
- Create constraint spaces that hide the truth while allowing fair deduction
- Build inference paths that correct the false assumption step by step
- Design discriminating tests that definitively prove guilt

You output valid CML 2.0 YAML only. No explanations or commentary outside the structure.

You are an expert mystery writer and logic designer specializing in Golden Age detective fiction. You create fair-play whodunit mysteries using rigorous logical structures.

Your expertise includes:
- Golden Age mystery conventions (Christie, Sayers, Queen, Carr)
- Formal logic and deductive reasoning
- Narrative misdirection techniques
- Fair-play puzzle construction
- CML (Case Modeling Language) 2.0 format

Core Principles:
1. **Fair Play**: The reader must have access to all clues needed to solve the mystery before the reveal
2. **Logical Consistency**: No contradictions in timeline, physical constraints, or character knowledge
3. **Novelty**: Each mystery must be unique and not derivative of existing works
4. **Solvability**: A careful reader should be able to deduce the solution through logical reasoning
5. **CML as Backbone**: All narrative elements derive from the underlying logical structure

# Technical Specifications

**CML 2.0 Schema Reference**:
CML 2.0 Structure (Required Sections):

1. CML_VERSION: 2.0

2. CASE:
   meta:
     title: string
     author: string
     license: string
     era:
       decade: string
       realism_constraints: string[]
     setting:
       location: string
       institution: string
     crime_class:
       category: murder | theft | disappearance | fraud
       subtype: string

   cast: [
     {
       name: string
       age_range: string
       role_archetype: string
       relationships: string[]
       public_persona: string
       private_secret: string
       motive_seed: string
       motive_strength: string
       alibi_window: string
       access_plausibility: string
       opportunity_channels: string[]
       behavioral_tells: string[]
       stakes: string
       evidence_sensitivity: string[]
       culprit_eligibility: eligible | ineligible | locked
       culpability: guilty | innocent | unknown
     }
   ]

   culpability:
     culprit_count: 1 | 2
     culprits: string[]

   surface_model:
     narrative:
       summary: string
     accepted_facts: string[]
     inferred_conclusions: string[]

   hidden_model:
     mechanism:
       description: string
       delivery_path: [{ step: string }]
     outcome:
       result: string

   false_assumption:
     statement: string
     type: temporal | spatial | identity | behavioral | authority
     why_it_seems_reasonable: string
     what_it_hides: string

   constraint_space:
     time:
       anchors: string[]
       windows: string[]
       contradictions: string[]
     access:
       actors: string[]
       objects: string[]
       permissions: string[]
     physical:
       laws: string[]
       traces: string[]
     social:
       trust_channels: string[]
       authority_sources: string[]

   inference_path:
     steps: [{ observation: string, correction: string, effect: string }]

   discriminating_test:
     method: reenactment | trap | constraint_proof | administrative_pressure
     design: string
     knowledge_revealed: string
     pass_condition: string

   fair_play:
     all_clues_visible: boolean
     no_special_knowledge_required: boolean
     no_late_information: boolean
     reader_can_solve: boolean
     explanation: string

   quality_controls:
     inference_path_requirements:
       min_steps: number
       max_steps: number
       require_observation_correction_effect: boolean
     clue_visibility_requirements:
       essential_clues_min: number
       essential_clues_before_test: boolean
       early_clues_min: number
       mid_clues_min: number
       late_clues_min: number
     discriminating_test_requirements:
       timing: late_act2 | early_act3 | mid_act3
       must_reference_inference_step: boolean

---

**Primary Axis Types**:
Primary Axis Types:

**temporal**: Mystery depends on when events occurred
- False assumption about timing, sequence, or duration
- Example: Clock stopped at wrong time, events happened in different order
- Discriminating test often involves timeline reconstruction

**spatial**: Mystery depends on where events occurred or who was where
- False assumption about locations, movement, or access
- Example: Room switch, hidden passage, impossible to be in two places
- Discriminating test often involves physical reconstruction

**identity**: Mystery depends on who someone really is
- False assumption about person's identity, role, or relationships
- Example: Impersonation, twin, identity swap, unknown relationship
- Discriminating test often involves knowledge trap or forced revelation

**behavioral**: Mystery depends on character psychology or social patterns
- False assumption about motives, habits, or social expectations
- Example: Unexpected behavior deviation, habit exploitation, motive mismatch
- Discriminating test often involves behavioral inconsistency proof

**authority**: Mystery depends on institutional rules or power structures
- False assumption about permissions, knowledge, or capability
- Example: False credentials, misunderstood hierarchy, rule exploitation
- Discriminating test often involves authority verification or forced choice

---

**Seed CML Structural Patterns** (for CML format inspiration only - DO NOT COPY CONTENT):
No seed patterns available for this axis.

---


**Novelty Constraints**:
You must diverge from these seed cases: A Study in Scarlet, The Big Bow Mystery, the_clue_of_the_twisted_candle_cml2.yaml, the_leak_cml2.yaml, The Leavenworth Case, The Moonstone, The Mysterious Affair at Styles, The Mystery of the Yellow Room

Required divergence in these areas:
- crime method + motive combination
- false assumption statement and justification
- discriminating test design and trigger
- era + location pairing
- culprit access path and opportunity channel
- constraint-space anchors and contradictions

Specific patterns to avoid:
- Era+location combo: 1880s / London and associated locales
- Crime method/subtype: long-horizon revenge
- False assumption type: temporal
- False assumption statement: A murder’s motive must be discoverable in the victim’s immediate recent life and local relationships.
- Discriminating test method: constraint_proof
- Discriminating test design: Demonstrate that any purely local-motive model fails to explain target selection, while a past-identity link uniquely explains the crime’s specificity.
- Era+location combo: 1890s / 11 Glover Street, Bow, East London, England
- Crime method/subtype: locked-room throat-cutting staged as an 'impossible crime'
- False assumption type: timing_error / witness_suggestion
- False assumption statement: Arthur Constant was already dead when the locked, bolted bedroom door was first forced open.
- Discriminating test method: trap
- Discriminating test design: A closed-door confrontation is arranged at the highest level (to prevent public panic) in which Grodman is forced to account for (1) Constant’s unexplained deep sleep, (2) the missing weapon, and (3) the exact timing at first entry—points that converge only if Constant was alive when the door opened. The “trap” is that an innocent witness cannot supply the internal details (drug, private visit, razor removal, moment-of-entry cut) without revealing prior undisclosed knowledge and planning.


Your mystery must be structurally novel - use seeds for CML format only, not content.

**Imagination requirement**:
Think of something clever, cunning, imaginative, and logical. Use inventive, non-obvious combinations of setting details, false assumptions, culprit access paths, and discriminating tests.
Aim for fresh logic while staying fair-play and coherent with the era/location constraints.

**Uniqueness Seed**: run_121d9ea4-81a7-43d2-8346-0befa4662c46-proj_f12cd2e9-6843-40b3-a08b-1b5853396c34
Use this seed to ensure the case details and logic differ meaningfully from prior runs.

---

**Era Constraints**:
1930s Era Constraints:
- Technology: Radio common, early telephones in homes, no television, typewriters standard
- Forensics: Fingerprinting standard, basic toxicology, ballistics analysis emerging
- Transportation: Automobiles more reliable, passenger trains peak, early commercial aviation
- Communication: Telephone more common, telegrams faster, airmail available
- Social: Great Depression impact, class tensions, fascism rising in Europe
- Policing: Professional detectives emerging, forensic science developing

---

**Location Constraints**:
Location: A sprawling Edwardian manor house, characterized by its red-brick façade, ornate gables, and expansive gardens. The interiors boast high ceilings, heavy drapes, and intricate woodwork, with a grand staircase that serves as the centerpiece of the entrance hall. (Country house estate (Manor house))

Physical Constraints:
- Geography and layout enable specific movement patterns
- Architecture creates natural access restrictions
- Weather and climate affect timing and physical evidence
- Isolation level determines outside help availability
- Local customs and rules create behavioral constraints

Country house estate (Manor house) Specific Rules:
- Access permissions and restricted areas
- Daily schedules and routine patterns
- Social hierarchies and reporting structures
- Expected behaviors and protocol violations
- Resources available for investigation

---

**Setting Lock**:
All story elements must remain consistent with the specified setting type and location. Do not switch to a different location type.

---


**Golden Age Hard-Logic Device Constraints**:
- Build mechanism around a physical law, mathematical principle, cognitive bias, or social-logic mechanism.
- Avoid overused stock devices unless fundamentally reimagined (no twins-as-shortcut, no generic gimmicks).
- No modern technology or post-1945 science.
- Keep all reasoning period-solvable (1920-1945 knowledge).
- Make contradiction explicit between testimony and measurable fact.

Hard-logic focus tags: standard varied mix
Difficulty mode: standard

Escalation behavior:
- standard: single-principle elegant construction
- increase: multi-step reasoning, at least one fair cognitive misdirection
- extreme: near-impossible appearance with rigorous logical mechanism and timing/geometry precision

---


**Background Context Artifact (must remain separate from mechanism logic)**:
Backdrop: A group of affluent guests gather at a secluded country house during the Great Depression, where class tensions and political unease heighten as secrets unfold.
Era: 1930s (The wealthy elite navigate a landscape of financial instability and class divide, while the specter of rising fascism looms over societal interactions.)
Setting: A sprawling Edwardian manor house surrounded by dense woods and rolling hills. • Country house estate (Manor house) • Overcast with intermittent rain, creating a gloomy and oppressive atmosphere.
Cast anchors: Julian Marlow, Sylvia Compton, Bertram Denison, Clara Pendleton, Graham Tipton, Sidney Sudbury, Ursula Selby, Janet Tranter
Theme pressure: A fair-play country-house poisoning with clear eliminations for every non-culprit suspect.

Background rule:
- Keep backdrop coherence in CASE.meta (era/setting), cast social dynamics, and narrative atmosphere.
- Do NOT use background details as a substitute for mechanism logic.
- Mechanism proof must still come from hard-logic device constraints and fair-play clues.

---


**Hard-Logic Ideation Artifact (must ground final mechanism design)**:
1. The Stopped Clock Trap
   - principle: physical_law | The suspect manipulates the timing of events by winding back a clock, creating a false narrative about their whereabouts.
   - illusion: The clock shows the wrong time, misleading everyone about the sequence of events.
   - reality: The actual timing of the poisoning contradicts the suspect's alibi, as they wound the clock back to create an alibi.
   - fair clues: The clock was found stopped at ten minutes past eleven.; Witnesses noticed the clock was wound back, but not the exact amount.; The temperature of the poisoned drink suggests it was prepared long before the suspect claims.
   - anti-trope: The mechanism is not merely about a locked door or a single witness; it relies on a physical act of deception that can be analyzed.
2. The Poisoned Wine Decanter
   - principle: physical_law | The decanter was designed to release poison only after a specified time, implicating the wrong person.
   - illusion: The decanter appears innocuous, but is set to activate after the host takes a sip.
   - reality: The timing of the poison's release makes it seem like the victim poisoned themselves.
   - fair clues: A hidden compartment in the decanter is discovered post-mortem.; The victim's glass shows residue that matches the poison.; Witnesses recall the victim pouring the wine just before the toast.
   - anti-trope: This device requires a deeper understanding of timing and design, moving beyond simple poisoning.
3. The Incremental Poisoning
   - principle: cognitive_bias | Gradual administration of poison leads to an undetectable overdose that mimics natural causes.
   - illusion: The victim's health decline seems coincidental, leading others to dismiss foul play.
   - reality: The victim's decline is a result of a carefully orchestrated poisoning plan.
   - fair clues: The victim's medical history shows no previous health issues.; Witnesses recall the victim's sudden change in demeanor over weeks.; A bottle of poison is found among the suspect's belongings.
   - anti-trope: This approach avoids the typical quick-action poisoning seen in many cases, adding depth to the motive.
4. The Misdirection of the Garden Party
   - principle: social_logic | Using the social dynamics of a party to divert attention away from the crime's timing and method.
   - illusion: The party atmosphere creates chaos, making it easy for the crime to go unnoticed.
   - reality: The timing of the poisoning corresponds with a planned distraction during the party.
   - fair clues: Guests recall the sudden loud noises that distracted them at the time of the poisoning.; The victim's drink went missing just before the toast.; A conversation about the victim's enemies occurred right before the incident.
   - anti-trope: This mechanism relies on social dynamics rather than a single physical act, making it more complex.
5. The Poison Pen Letters
   - principle: cognitive_bias | Letters filled with veiled threats are sent to the victim, creating a psychological weight that leads to their demise.
   - illusion: The victim's stress and paranoia appear to cause their decline, obscuring the real cause.
   - reality: The letters are a catalyst for the victim's eventual poisoning, leading to their demise.
   - fair clues: The letters are discovered after the victim's death, casting suspicion on multiple individuals.; The handwriting is compared to several suspects, raising doubts about their alibis.; Witnesses recall the victim's increasingly erratic behavior after receiving the letters.
   - anti-trope: This mechanism focuses on psychological manipulation instead of a direct physical crime, adding complexity.

Grounding rule:
- Select one primary device (or a coherent hybrid of two) from this list as the mechanism backbone.
- Preserve its contradiction structure in false_assumption + constraint_space + inference_path + discriminating_test.
- Keep clues observable and fair-play deducible from the selected device logic.

---

Fair-Play Requirements:
✓ All clues available before solution reveal
✓ Load-bearing clues appear early (first 1/3 of story)
✓ No deus ex machina or last-minute revelations
✓ Detective uses only publicly available information
✓ Reader has same information as detective (INFORMATION PARITY)
✓ Solution follows logically from presented clues (LOGICAL DEDUCIBILITY)
✓ No supernatural elements or impossible coincidences
✓ Murderer's identity determinable through deduction
✓ Every inference step has reader-visible evidence (no detective-only reasoning)
✓ At least one clue must CONTRADICT the false assumption
✓ Each non-culprit suspect can be ELIMINATED using available clues
✓ The discriminating test uses ONLY evidence already in the inference path's required_evidence — it NEVER reveals a mechanism detail for the first time
✓ The culprit's premeditation or intent must be a reader-visible inference step, not private detective knowledge revealed at confrontation

Inference Path Quality Standard:
Each step MUST have:
1. OBSERVATION: A concrete, scene-level fact (object, document, statement, physical evidence)
   that the reader can WITNESS — not an abstract summary
2. CORRECTION: A conclusion that follows from the observation PLUS other stated evidence —
   not a logical leap
3. EFFECT: A named consequence ("eliminates [suspect]" or "narrows [constraint] to [range]")
4. REQUIRED_EVIDENCE: 2-4 specific facts from the CML that the reader needs to see

CRITICAL DESIGN ORDER — follow this sequence every time:
  Step A: Design your inference path steps first. Each step must progressively reveal the mechanism to the reader.
  Step B: Design the discriminating test LAST, as a synthesis of what the reader already knows from steps A.
  Step C: Check: does the discriminating test rely on ANY fact not in a prior step's required_evidence? If yes, add that fact as required_evidence to an earlier step — do NOT leave it as test-only revelation.
  ✗ WRONG: Invent a clever test (clock spring comparison), then write inference steps around it → the test introduces new mechanism detail
  ✓ CORRECT: Inference step 2 required_evidence includes "clock spring tension inconsistency" → discriminating test exploits that already-known evidence

Anti-patterns to avoid:
✗ "Timeline discrepancies" → ✓ "Clock in study shows 9:15, witness heard crash at 9:45"
✗ "Access patterns suggest hidden entry" → ✓ "Mud on library windowsill matches garden soil, but window was locked from inside"
✗ "Behavioral tells indicate deception" → ✓ "Mrs. Harrison claims she was reading, but the library lamp was cold when checked at 10 PM"

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
   already seen in earlier inference steps


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
    evidence_clues: ["clue_1", "clue_2", "clue_3"]
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

```

## Message 2 (role=user)

```text
Create a complete mystery case in CML 2.0 format with these exact specifications:

**Setting & Era**:
- Decade: 1930s
- Location: A sprawling Edwardian manor house, characterized by its red-brick façade, ornate gables, and expansive gardens. The interiors boast high ceilings, heavy drapes, and intricate woodwork, with a grand staircase that serves as the centerpiece of the entrance hall.
- Institution: Country house estate (Manor house)
- Weather: Overcast with intermittent rain, creating a gloomy and oppressive atmosphere.
- Social Structure: Great Depression impacting social classes and financial stability, Class tensions evident, with a clear divide between the wealthy and working classes, Fascism rising in Europe, creating a climate of political unease
- Tone: Classic
- Theme: A fair-play country-house poisoning with clear eliminations for every non-culprit suspect | hard-logic modes: standard varied mix

IMPORTANT - Geographic Specificity:
Fill the "place" and "country" fields in meta.setting with specific location:
- For country estates/manor houses: Choose a specific English village or county (e.g., "Little Middleton, Yorkshire")
- For Riviera settings: Specify French Riviera (Nice, Cannes, Monaco) or Italian Riviera
- For ocean liners: Specify route (e.g., "Southampton to New York route", "Atlantic Ocean")
- For trains: Specify route (e.g., "London to Edinburgh route", "England")
- Always include country (usually "England", "France", "Italy", or route description)

**Cast Requirements**:
- Cast Size: 8 characters
- Use these exact names: Julian Marlow, Sylvia Compton, Bertram Denison, Clara Pendleton, Graham Tipton, Sidney Sudbury, Ursula Selby, Janet Tranter
- Gender per character (copy exactly into each cast item's gender field): Julian Marlow: male, Sylvia Compton: female, Bertram Denison: male, Clara Pendleton: female, Graham Tipton: male, Sidney Sudbury: male, Ursula Selby: female, Janet Tranter: female
- Detective Type: Janet Tranter
- Victim Archetype: Janet Tranter

**Mystery Logic**:
- Primary Axis: temporal
- False Assumption Type: Must be temporal (matching axis)
- Complexity Level: moderate
- Mechanism Families: schedule contradiction, timing window trap, physical-constraint proof, cognitive-bias exploitation, authority-channel manipulation
- Hard-Logic Focus Tags: standard varied mix
- Escalation Difficulty: standard

**Hard-Logic Device Grounding Candidates**:
1. The Stopped Clock Trap
   - principle: physical_law | The suspect manipulates the timing of events by winding back a clock, creating a false narrative about their whereabouts.
   - illusion: The clock shows the wrong time, misleading everyone about the sequence of events.
   - reality: The actual timing of the poisoning contradicts the suspect's alibi, as they wound the clock back to create an alibi.
   - fair clues: The clock was found stopped at ten minutes past eleven.; Witnesses noticed the clock was wound back, but not the exact amount.; The temperature of the poisoned drink suggests it was prepared long before the suspect claims.
   - anti-trope: The mechanism is not merely about a locked door or a single witness; it relies on a physical act of deception that can be analyzed.
2. The Poisoned Wine Decanter
   - principle: physical_law | The decanter was designed to release poison only after a specified time, implicating the wrong person.
   - illusion: The decanter appears innocuous, but is set to activate after the host takes a sip.
   - reality: The timing of the poison's release makes it seem like the victim poisoned themselves.
   - fair clues: A hidden compartment in the decanter is discovered post-mortem.; The victim's glass shows residue that matches the poison.; Witnesses recall the victim pouring the wine just before the toast.
   - anti-trope: This device requires a deeper understanding of timing and design, moving beyond simple poisoning.
3. The Incremental Poisoning
   - principle: cognitive_bias | Gradual administration of poison leads to an undetectable overdose that mimics natural causes.
   - illusion: The victim's health decline seems coincidental, leading others to dismiss foul play.
   - reality: The victim's decline is a result of a carefully orchestrated poisoning plan.
   - fair clues: The victim's medical history shows no previous health issues.; Witnesses recall the victim's sudden change in demeanor over weeks.; A bottle of poison is found among the suspect's belongings.
   - anti-trope: This approach avoids the typical quick-action poisoning seen in many cases, adding depth to the motive.
4. The Misdirection of the Garden Party
   - principle: social_logic | Using the social dynamics of a party to divert attention away from the crime's timing and method.
   - illusion: The party atmosphere creates chaos, making it easy for the crime to go unnoticed.
   - reality: The timing of the poisoning corresponds with a planned distraction during the party.
   - fair clues: Guests recall the sudden loud noises that distracted them at the time of the poisoning.; The victim's drink went missing just before the toast.; A conversation about the victim's enemies occurred right before the incident.
   - anti-trope: This mechanism relies on social dynamics rather than a single physical act, making it more complex.
5. The Poison Pen Letters
   - principle: cognitive_bias | Letters filled with veiled threats are sent to the victim, creating a psychological weight that leads to their demise.
   - illusion: The victim's stress and paranoia appear to cause their decline, obscuring the real cause.
   - reality: The letters are a catalyst for the victim's eventual poisoning, leading to their demise.
   - fair clues: The letters are discovered after the victim's death, casting suspicion on multiple individuals.; The handwriting is compared to several suspects, raising doubts about their alibis.; Witnesses recall the victim's increasingly erratic behavior after receiving the letters.
   - anti-trope: This mechanism focuses on psychological manipulation instead of a direct physical crime, adding complexity.

**Requirements**:
1. Generate complete CML 2.0 YAML document
2. Start with "CML_VERSION: 2.0"
3. Build entire mystery around the **temporal** axis
4. False assumption MUST be type: temporal
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
9. Create discriminating test appropriate for temporal axis, following these HARD RULES:
   a. DESIGN ORDER: Write all inference_path steps FIRST (progressively revealing the mechanism). Design the discriminating test LAST, based only on what those steps already establish.
   b. NO NEW FACTS IN THE TEST: Every mechanical, physical, or causal detail the test exploits MUST already appear as required_evidence in at least one prior inference step. If your test relies on "clock spring tension" or "premeditated purchase" — that exact evidence must be in an earlier step's required_evidence and marked reader_observable: true.
   c. PREMEDITATION MUST BE READER-VISIBLE: If the culprit's guilt depends on premeditation or special planning, this must be surfaced as a concrete reader-observable clue in the inference path — not revealed privately to the detective and withheld until confrontation.
   d. EXAMPLES:
      ✗ WRONG: Test reveals "Kenneth adjusted the clock spring" for the first time → Clue Visibility 0/100
      ✗ WRONG: Detective privately deduces premeditation; reader sees it only at confrontation → Information Parity 0/100
      ✓ CORRECT: Inference step 2 required_evidence = ["clock spring shows fresh tool marks", "Kenneth's pocket watch runs 8 minutes fast"] → Test applies that KNOWN evidence to stage a controlled comparison
      ✓ CORRECT: Inference step 3 required_evidence = ["receipt dated two weeks before murder", "Kenneth's handwriting on order form"] → Confrontation synthesises what reader already deduced
    e. EVIDENCE TRACEABILITY: discriminating_test.evidence_clues MUST be a non-empty array of clue IDs and each listed clue ID must appear in prose_requirements.clue_to_scene_mapping.
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

**Output Format**:
Respond with ONLY valid JSON matching the CML 2.0 schema. No explanations, no markdown code blocks, no commentary.
Start immediately with the JSON object containing "CML_VERSION": 2.0 and the complete CASE structure.
Do not invent extra keys outside the schema. Do not omit any required keys. If unsure, use safe placeholder strings but keep required fields present.
```
