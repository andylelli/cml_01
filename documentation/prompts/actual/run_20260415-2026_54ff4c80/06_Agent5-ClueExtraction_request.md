# Actual Prompt Record

- Run ID: `run_54ff4c80-a3f4-4c81-9851-2496f2ec647c`
- Project ID: `proj_18b6d4d8-ff54-4c67-87ea-d9c34999cfdb`
- Timestamp: `2026-04-15T20:27:22.127Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.4`
- Max Tokens: `3000`
- Attempt: `first`
- Prompt Hash: `48366caa7db98a8f`

## Message 1 (role=system)

```text
You are a clue extraction specialist for Golden Age mystery fiction. Extract clues ONLY from existing CML facts and organize them for fair play presentation.

**Rules**:
- Extract clues ONLY from existing CML facts — never invent new information
- Every clue must be traceable to the CML structure
- Concrete, specific descriptions (not abstract)
- Observable by reader in scenes, not detective-only information
- Cite sourceInCML for every clue
- All essential clues must appear before the solution so the reader can solve the mystery
- fair play is the core principle: every logical step must be supported by visible evidence

**Clue Categories**:
- **Temporal**: Time-based evidence (clocks, schedules, alibis, timelines)
- **Spatial**: Location and access evidence (rooms, distances, locked doors)
- **Physical**: Tangible evidence (objects, traces, fingerprints, injuries)
- **Behavioral**: Pattern evidence (habits, reactions, suspicious actions)
- **Testimonial**: Witness statements and testimony

**Example**: ❌ "Timeline discrepancies" ✅ "Mrs. Whitmore says a quarter to ten, but library clock stopped at a quarter past nine"

Return valid JSON.
```

## Message 2 (role=developer)

```text
## CML Summary
**Title**: The Timed Demise
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 5 characters
**Requested density**: minimal
**Effective density**: moderate (auto-escalated to satisfy mandatory requirements)

## Mandatory Clue Requirements (9 required)
1. Generate a clue that makes the reader directly observe: "The decorative clock emits a peculiar ticking sound...."
   → observation | essential | early | temporal | step 1 | terms: decorative, clock, emits

2. Generate a clue that provides evidence for: "The ticking indicates that the clock is wound and functioning, suggesting it was used recently...."
   → contradiction | essential | early | temporal | step 1 | terms: ticking, indicates, clock

3. Generate a clue that makes the reader directly observe: "Witnesses confirm seeing Emmeline at 9:30 PM, shortly before the discovery of her body...."
   → observation | essential | early | temporal | step 2 | terms: witnesses, confirm, seeing

4. Generate a clue that provides evidence for: "Given that the poison's release must have occurred before 9:30 PM, the assumption that it was admini..."
   → contradiction | essential | early | temporal | step 2 | terms: given, poison's, release

5. Generate a clue that makes the reader directly observe: "The clock shows a peculiar weight distribution and signs of tampering...."
   → observation | essential | mid | temporal | step 3 | terms: clock, shows, peculiar

6. Generate a clue that provides evidence for: "This suggests that the clock mechanism was altered to ensure poison release was timed with Emmeline'..."
   → contradiction | essential | mid | temporal | step 3 | terms: suggests, clock, mechanism

7. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "A demonstration where guests are invited to interact with the clock while the detective observes the..."
   → observation | essential | mid | temporal | terms: demonstration, guests, invited

8. Generate a clue showing observable evidence of Sandra Oldham's premeditation or planning (Financial gain). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: financial

9. Generate a clue that provides elimination evidence for suspect: Philip Slater
   → elimination | essential | mid | testimonial | terms: Philip Slater

## Temporal Constraints
- 9:00 PM
- 10:00 PM
- Emmeline was seen alive at 9:30 PM, but the poison must have been ingested earlier.

## Access Constraints
Actors: Sandra Oldham, Philip Slater
Objects: decorative clock, poison vial

## Physical Evidence
- Fingerprints on the clock
- Signs of tampering

## Evidence-Sensitive Characters
- Sandra Oldham: sensitive items: poisoning method, inheritance details
- Emmeline Barraclough: sensitive items: time of death, affair details
- Josiah Garlick: sensitive items: service records, guest list
- Philip Slater: sensitive items: gambling debts, relationship history
- John Ogden: sensitive items: investigation results, suspect alibis

## Hard Precedence (resolve in order)
1. sourceInCML legality
2. index bounds and cast name-index correctness
3. discriminating-test clue ID coverage
4. suspect elimination quality
5. red-herring separation
6. optional texture

## Deterministic Bounds (use exactly)
- inference_path steps path index range: 0..2
- supportsInferenceStep valid range: 1..3
- constraint_space.time.anchors index range: 0..1
- constraint_space.time.contradictions index range: 0..0
- cast index range: 0..4

## Cast Name -> Index Map (for CASE.cast[N] paths)
- Sandra Oldham -> 0
- Emmeline Barraclough -> 1
- Josiah Garlick -> 2
- Philip Slater -> 3
- John Ogden -> 4

## Clue Density: moderate
Generate 8-12 clues total.
Additional optional clues (2-4 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "The poison was administered directly during the gathering."

## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
  - ticking
  - indicates
  - clock
  - given
  - poison's
  - release
  - suggests
  - mechanism
- preferred_false_assumption_terms:
  - poison
  - administered
  - directly
- red_herring_contract:
  - Use preferred_false_assumption_terms where possible.
  - Avoid correction_terms_forbidden_in_red_herrings in redHerrings[].description and redHerrings[].misdirection.
  - Include one sentence in each misdirection explicitly justifying non-overlap with true-solution mechanism language.

## Clue Placement Strategy
- Early (Act I): essential clues, set up the puzzle, introduce key observations
- Mid (Act II): supporting clues, deepen investigation, complicate the picture
- Late (Act III): optional clues, final revelations, confirm the solution

Criticality levels:
- essential: reader must see this to follow the detective's logic
- supporting: reinforces key deductions without being critical
- optional: adds texture and atmosphere

## Quality Controls (from CML)
- Essential clues minimum: 3
- Essential clues before test: true
- Early clues minimum: 2
- Mid clues minimum: 2
- Late clues minimum: 1

If targets conflict with clue density, prioritize fair play (essential clues and early placement).
If mandatory requirements exceed requested density, satisfy mandatory requirements first and keep optional clues minimal.

## Quality Bar
- Essential clues must form a solvable chain, not disconnected facts.
- Clue wording should be concrete enough for scene-level prose rendering.
- Placement should enforce fair-play timing rather than clustering clues at reveal.

## Hard Constraints Learned from Failures
- Discriminating-test clue ID coverage is mandatory: every ID in CASE.discriminating_test.evidence_clues must appear as a clue id.
- Required discriminating-test clue IDs must be criticality: essential and placement: early|mid.
- Elimination clues must include a concrete alibi window, corroborator/evidence source, and explicit exclusion logic in pointsTo.
- sourceInCML must use legal CML paths only; do not invent path families.
- Red herrings must support the false assumption and include non-overlap justification vs true culprit mechanism facts.
- Narrative-facing time wording must be era-appropriate and written in words (for example, "quarter past nine", not "9:15 PM").
- supportsInferenceStep and step-indexed sourceInCML references must stay within actual inference-path bounds.
- Red herring text must not reuse correction-language tokens from inference_path.steps[].correction.
- If inference_path has 3 step(s), valid supportsInferenceStep/source step indices are 1..3 and 0..2 respectively.
- Cast paths must use CASE.cast[N] with N from the Name->Index map above. Do not substitute names inside brackets.

## Source Path Legality (Critical)
Allowed source roots include:
- CASE.inference_path.steps[N].observation
- CASE.inference_path.steps[N].correction
- CASE.inference_path.steps[N].required_evidence[M]
- CASE.constraint_space.time.anchors[M]
- CASE.constraint_space.time.contradictions[M]
- CASE.constraint_space.access.actors[M]
- CASE.constraint_space.access.objects[M]
- CASE.constraint_space.access.permissions[M]
- CASE.constraint_space.physical.laws[M]
- CASE.constraint_space.physical.traces[M]
- CASE.cast[N].alibi_window
- CASE.cast[N].access_plausibility
- CASE.cast[N].evidence_sensitivity[M]
- CASE.discriminating_test.evidence_clues[M]
- CASE.prose_requirements.clue_to_scene_mapping[M].clue_id
Forbidden examples:
- CASE.constraint_space.access.footprints[0]
- CASE.character_behavior.*
- CASE.character_testimonial.*
- CASE.cast.Name.*

## Micro-exemplars
- Weak clue: "Someone was nervous around dinner."
- Strong clue: "Port wine decanter seal is broken before service despite butler log marking it intact at ten past seven."
- Weak sourceInCML: "case notes"
- Strong sourceInCML: "CASE.constraint_space.time.anchors[1]"

## Silent Pre-Output Checklist
- every clue traceable to CML
- essential clues placed early/mid only
- supportsInferenceStep populated when applicable
- at least one contradiction clue exists for every inference step with supportsInferenceStep mapping
- red herrings support false assumption without inventing facts
- all discriminating-test evidence clue IDs present in clue list
- elimination clues include qualifying alibi/corroboration/exclusion detail
- no illegal sourceInCML paths
- no out-of-range inference-step indices
- no digit-based clock notation in description/pointsTo
- set status="pass" only when all audit arrays are empty; otherwise status="fail"
- JSON only, no markdown fences

## Output JSON Schema
```json
{
  "status": "pass|fail",
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal|spatial|physical|behavioral|testimonial",
      "description": "Concrete, specific clue description",
      "sourceInCML": "Where in CML this comes from",
      "pointsTo": "What it reveals",
      "placement": "early|mid|late",
      "criticality": "essential|supporting|optional",
      "supportsInferenceStep": 1,
      "evidenceType": "observation|contradiction|elimination"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Red herring description",
      "supportsAssumption": "Which false assumption it supports",
      "misdirection": "How it misleads"
    }
  ],
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  }
}
```
```

## Message 3 (role=user)

```text
Extract and organize clues from this mystery CML.

Generate 8-12 clues and 2 red herrings that uphold fair play — every essential clue must be placed so the reader can solve the mystery before the detective reveals the answer.

Rules:
- Do NOT invent new facts — every clue must be traceable to CML
- Essential clues: "early" or "mid" placement ONLY — never "late". A "late" essential clue means the reader cannot solve the mystery before the detective.
- DISCRIMINATING TEST CLUES: Any clue that enables the discriminating test to make sense must be placed "early" or "mid". The discriminating test scene exploits knowledge the reader already has — it must NEVER be the reader's first exposure to the mechanism detail.
- DISCRIMINATING TEST ID CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear as a clue id.
- PREMEDITATION CLUES: If the culprit's guilt depends on premeditation or planning, that evidence must be a separate reader-visible clue placed "early" or "mid". The detective cannot withhold this from the reader until confrontation.
- ELIMINATION CLUES: Must include time window, corroborator/evidence source, and direct exclusion logic in pointsTo ("Eliminates <name> because ...").
- SOURCE PATH LEGALITY: sourceInCML must use only legal CML path roots.
- STYLE: Use era-appropriate worded time references in clue descriptions and pointsTo.
- TIME FORMAT: Never use digit-based clock notation in clue descriptions or pointsTo.
- RED HERRING SEPARATION: Do not reuse correction-language tokens from inference_path.steps[].correction in red herring description/misdirection text.
- FIRST-ATTEMPT RED HERRING CONTRACT: avoid correction-language tokens in red herrings from the start, not only in retry mode.
- CAST PATH CONSISTENCY: If sourceInCML is CASE.cast[N].*, then clue description/pointsTo suspect references must match the name at cast index N.
- STATUS CONTRACT: Return status="pass" only when all audit arrays are empty; otherwise return status="fail".
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above
```
