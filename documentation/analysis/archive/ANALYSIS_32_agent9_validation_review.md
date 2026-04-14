# ANALYSIS_32 — Agent 9 Validation Pipeline Review

*Facts only. No assessments. Awaiting author permission before adding assessment layer.*

---

## Section 1: Position and Purpose

The story validation pipeline runs inside `agent9-run.ts` after all prose chapters have been generated and after the first call to `applyDeterministicProsePostProcessing()`. Its primary job is to verify the finished story against a set of structural, semantic, and prose-quality rules before the run is committed and scored. Failure at this gate either warns (needs_review / needs_revision) or causes the run to throw and abort (failed / hard-stop categories from the release gate).

A separate, lighter validator — `ChapterValidator` — runs inline during generation, per chapter and per batch, before a chapter is committed to the chapter list. `ChapterValidator` is not part of `StoryValidationPipeline`; it runs much earlier in the pipeline and its purpose is to block bad chapters from entering the committed set before they contaminate subsequent generation.

---

## Section 2: Source Files

| Purpose | File |
|---|---|
| Pipeline entry point | `packages/story-validation/src/pipeline.ts` |
| Type definitions | `packages/story-validation/src/types.ts` |
| Validator 1 | `packages/story-validation/src/encoding-validator.ts` |
| Validator 2 | `packages/story-validation/src/character-validator.ts` |
| Validator 3 | `packages/story-validation/src/prose-consistency-validator.ts` |
| Validator 4 | `packages/story-validation/src/narrative-continuity-validator.ts` |
| Validator 5 | `packages/story-validation/src/case-transition-validator.ts` |
| Validator 6 | `packages/story-validation/src/discriminating-test-validator.ts` |
| Validator 7 | `packages/story-validation/src/suspect-closure-validator.ts` |
| Validator 8 | `packages/story-validation/src/physical-validator.ts` |
| Validator 9 | `packages/story-validation/src/era-validator.ts` |
| Post-loop validator A | `packages/story-validation/src/chapter-validator.ts` → `validateChapterSequence()` |
| Post-loop validator B | `packages/story-validation/src/location-normalizer.ts` → `validateLocationConsistency()` |
| LLM semantic fallbacks | `packages/story-validation/src/semantic-validator.ts` |
| Temporal analysis utility | `packages/story-validation/src/temporal-consistency.ts` |
| Pronoun repair utility | `packages/story-validation/src/pronoun-repair.ts` |
| Generation-time validator | `packages/story-validation/src/chapter-validator.ts` → `ChapterValidator` class |
| Integration host | `apps/worker/src/jobs/agents/agent9-run.ts` |
| Generation host | `packages/prompts-llm/src/agent9-prose.ts` |

---

## Section 3: Core Type Definitions

### 3.1 `ValidationError`

```typescript
interface ValidationError {
  type: string;
  message: string;
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  sceneNumber?: number;
  lineNumber?: number;
  suggestion?: string;
  cmlReference?: string;
}
```

### 3.2 `ValidationResult`

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
```

### 3.3 `Story` (pipeline input)

```typescript
interface Story {
  id: string;
  projectId: string;
  scenes: Scene[];           // Scene: { number, title, summary?, text, paragraphs? }
  metadata?: { era?, setting?, cast? };
}
```

### 3.4 `CMLData` (pipeline input)

```typescript
interface CMLData {
  CASE: {
    meta: { era?, setting? };
    cast: CastEntry[];
    crime_scene?: any;
    discriminating_test?: { method?, design? };
    culpability?: { culprits: string[] };
  };
  lockedFacts?: Array<{ id, value, description, appearsInChapters? }>;
  locationProfiles?: { primary?: { name }, keyLocations?: Array<{ name }> };
}
```

### 3.5 `ProseConsistencyReport`

```typescript
interface ProseConsistencyReport {
  lockedFactsChecked: number;
  lockedFactsViolations: number;
  pronounDriftViolations: number;
  openingStyleViolations: number;
  contextLeakageViolations: number;
  overallStatus: 'pass' | 'needs_review' | 'fail';
}
```

### 3.6 `ValidationReport` (pipeline output)

```typescript
interface ValidationReport {
  valid: boolean;
  errors: ValidationError[];
  summary: { totalIssues, critical, major, moderate, minor };
  status: 'passed' | 'needs_review' | 'needs_revision' | 'failed';
  canProceed: boolean;
  recommendations: string[];
  consistencyReport: ProseConsistencyReport;
}
```

---

## Section 4: `StoryValidationPipeline` Execution Model

### 4.1 Constructor — 9 validators in declared order

1. `new EncodingValidator()`
2. `new CharacterConsistencyValidator()`
3. `new ProseConsistencyValidator()`
4. `new NarrativeContinuityValidator()`
5. `new CaseTransitionValidator()`
6. `new DiscriminatingTestValidator(llmClient, logContext)`
7. `new SuspectClosureValidator(llmClient, logContext)`
8. `new PhysicalPlausibilityValidator()`
9. `new EraAuthenticityValidator()`

### 4.2 `validate(story, cml)` execution

1. Iterates through the 9 validators using a `for...of` loop.
2. Each validator is wrapped in a `try/catch`; individual validator errors are logged but do not abort the remaining validators (with one exception — see §4.3).
3. Each validator's `validate(story, cml)` returns `ValidationResult { valid, errors[] }`.
4. All errors are accumulated into `allErrors`.
5. **Early exit:** if `CharacterConsistencyValidator` produces any error with `severity === 'critical'`, the pipeline returns `generateReport(allErrors, cml)` immediately without running validators 3–9.
6. After the 9-validator loop, two post-loop functions run:
   - `validateChapterSequence(story)` — checks chapter number sequence
   - `validateLocationConsistency(story, cml)` — checks location name variants
7. Errors from post-loop functions are appended to `allErrors`.
8. `generateReport(allErrors, cml)` is called to produce the `ValidationReport`.

### 4.3 `determineStatus(errors)` thresholds

| Condition | Status |
|---|---|
| Any `critical` error | `'failed'` |
| More than 5 `major` errors | `'needs_revision'` |
| At least 1 `major` OR more than 5 `moderate` errors | `'needs_review'` |
| Otherwise | `'passed'` |

`canProceed = status !== 'failed'`

### 4.4 `buildConsistencyReport(errors)` → `ProseConsistencyReport`

- Counts `lockedFactsViolations`: errors of type `locked_fact_contradicted` or `locked_fact_missing_value`
- Counts `pronounDriftViolations`: errors of type `pronoun_drift`
- Counts `openingStyleViolations`: errors of type `opening_style_repetition`
- Counts `contextLeakageViolations`: errors of type `context_leakage` or `context_leakage_suspected`
- `overallStatus = 'fail'` if any critical or major errors present; otherwise `'needs_review'` if violations > 0; otherwise `'pass'`

### 4.5 `autoFix(story)`

- Calls `EncodingValidator.fixStory(story)` only.
- Encoding artifacts are the only auto-fixable class of error.
- Character, continuity, logic, and era errors are not auto-fixed.

---

## Section 5: Validator 1 — `EncodingValidator`

### 5.1 Encoding artifact table

14 explicit replacement rules covering mojibake sequences (UTF-8 bytes misread as Latin-1):

| Input sequence | Correct output |
|---|---|
| `â€™` | `'` (right single quote) |
| `â€˜` | `'` (left single quote) |
| `â€œ` | `"` (left double quote) |
| `â€` / `â€\x9d` | `"` (right double quote) |
| `â€"` | `—` (em dash) |
| `â€"` | `–` (en dash) |
| `â€¦` | `…` (ellipsis) |
| `Ã¢â‚¬â„¢` | `'` |
| `Ã¢â‚¬Å"` | `"` |
| `Ã¢â‚¬` | `"` |
| `Ã‚Â` | `` (remove double-decoded prefix) |
| Double-byte forms | Deduplicated |
| `\uFFFD` (replacement char) | `` (remove) |

### 5.2 Detection

- `ENCODING_PATTERN`: combined regex matching all 14 patterns plus double-byte forms plus `\uFFFD`
- `ILLEGAL_CONTROL_CHAR_PATTERN`: `/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g`
- Per-scene: if `ENCODING_PATTERN.test(text)` → `encoding_artifact` (major)
- Per-scene: if `ILLEGAL_CONTROL_CHAR_PATTERN.test(text)` → `illegal_character` (major)

### 5.3 `fixEncoding(text)`

1. NFC normalize
2. Apply all 14 replacement rules
3. Strip zero-width characters (`\u200B–\u200D`, `\uFEFF`)
4. Strip remaining control characters
5. Strip `\u00A0` (non-breaking space)
6. Strip trailing whitespace per line

### 5.4 `fixStory(story)`

Maps all scenes; for each scene applies `fixEncoding` to `scene.text` and each element of `scene.paragraphs[]`.

---

## Section 6: Validator 2 — `CharacterConsistencyValidator`

### 6.1 Entry condition

Returns `{ valid: true, errors: [] }` immediately if no CML data is provided.

### 6.2 `buildCharacterManifest(cml)`

Produces two structures:

**`manifest: Map<canonicalName, CharacterState>`**
- `gender`, `role`, `pronouns` (subject/object/possessive), `isCrewMember`
- Derived from `cml.CASE.cast[]`

**`aliasToCanonical: Map<label, canonicalName>`**
- Full name → canonical
- Surname only → canonical
- First name only → canonical
- `.alias` field → canonical
- Each element of `.aliases[]` → canonical

**`allowedSurnames: Set<string>`** — set of all recognized surnames from the manifest for the walk-on detection check.

### 6.3 Pattern constant

`TITLED_NAME_PATTERN`: matches titled references: `Inspector|Constable|Sergeant|Captain|Detective|Mr|Mrs|Miss|Dr` followed by a capitalized word.

### 6.4 Per-story checks

1. `detectNameSwitches(story, manifest)` — cross-scene check. Searches for multiple variant detective names (`Detective Thompson`, `Detective Harrington`, `Detective Chen`, `Detective`) across all scenes. If more than one is found: `detective_name_inconsistency` (critical).

### 6.5 Per-scene checks (for each `scene` in `story.scenes`)

1. `checkNamedWalkOns(scene.text, scene.number, allowedSurnames)` — scans for titled names whose surname is not in `allowedSurnames`. Error: `illegal_named_walk_on` (major).
2. `checkPronounAgreement(scene, manifest, aliasToCanonical)` — for each recognized character, calls `findIncorrectPronouns()`. Error: `pronoun_gender_mismatch` (critical) if incorrect pronouns found.
3. `checkRoleLocationConsistency(scene, manifest)` — checks passenger vs crew area violations. Errors: `role_location_mismatch` (major) for passenger in crew quarters; `role_location_notice` (moderate) for crew in passenger-exclusive areas.

### 6.6 `findIncorrectPronouns()` algorithm

**Inputs:** scene text, labels for target character, all reference labels for all characters, correct pronouns for target character, full manifest, target character name, `canonicalToLabels` map.

**Algorithm:**

1. Split text into sentences on `.`, `!`, `?`.
2. For each sentence that contains a label for the target character:
   a. Build `context = sentence + (next sentence if next sentence contains no character labels)`
   b. Set `primarySentence = sentences[i]`
   c. Set `precedingContext = sentences[0..i].join(' ')` — all sentences up to and including current
   d. **Co-presence guard:** if context already contains a correct-gender pronoun for the target character, skip this sentence entirely. Disabled for non-binary (they/them/their) targets.
   e. For each pronoun form (`he`, `she`, `him`, `her`, `his`, `herself`, `himself`, `hers`): if found in `context` and it is the wrong gender for the target character, call `isOwnedByCompetingEntity()`.
   f. If `isOwnedByCompetingEntity()` returns false, add to `incorrect[]`.
3. Return deduplicated `incorrect[]`.

**`isOwnedByCompetingEntity(pronoun, primarySentence, precedingContext)`:**

1. **Possessive carry-forward guard:** if `primarySentence` starts with `his\b` (male possessive) and the pronoun being tested is male but the target character is not male → return true (carry-forward male subject from previous sentence owns this pronoun). Mirror logic for `her\b` and female pronouns.
2. **Competing entity scan:** for each other character in the manifest that appears anywhere in `precedingContext` (by label match): if the tested pronoun matches any of their stored pronoun forms (including derived reflexives `herself`/`himself` and predicate possessive `hers`) → return true.
3. Otherwise return false.

**Reflexive and predicate possessive handling:**
- `herself`: correct only for `subject === 'she'`; flags for all others
- `himself`: correct only for `subject === 'he'`; flags for all others
- `hers`: correct only for `possessive === 'her'`; flags for all others

**Non-binary exception:** the co-presence guard (step d above) is deliberately disabled for non-binary characters because `they/them/their` are common plural/generic pronouns whose presence in context does not reliably indicate the non-binary character is being correctly referred to.

---

## Section 7: Validator 3 — `ProseConsistencyValidator`

### 7.1 Overview

Runs four independent checks; errors from all four are returned.

### 7.2 Check 1: `checkLockedFacts(story, cml)`

**Source:** `cml.lockedFacts[]` — each entry has `{ id, value, description, appearsInChapters? }`

**Per-scene logic:**

1. If `fact.appearsInChapters` is set and does not include `scene.number`, skip this scene for this fact.
2. Keyword gate (when `appearsInChapters` not set): extract keywords from `fact.description` where word length ≥ 4; require `>= min(2, keywords.length)` keyword matches in `scene.text`. If keyword gate fails, skip fact for this scene.
3. Verbatim check: `new RegExp(escapeRegex(canonicalValue), 'i').test(scene.text)`
4. If verbatim value absent: call `detectConflictingValue()` which compares numeric tokens in prose to the canonical value's numeric tokens.
5. If conflict detected: `locked_fact_contradicted` (critical), `cmlReference: lockedFacts[{fact.id}]`
6. If value simply absent: `locked_fact_missing_value` (major)

### 7.3 Check 2: `checkPronounDrift(story, cml)`

**Source:** `cml.CASE.cast[]` where `cast[].gender` is not `'non-binary'` and not `'unknown'`.

**Per-character, per-scene:**
1. Find all positions of `firstName` in `scene.text`.
2. For each position, extract a 200-character window around it.
3. Build `oppositePronouns()` regex matching the wrong-gender subject/object/possessive pronouns with word boundaries.
4. If opposite pronoun found in window: `pronoun_drift` (moderate), `cmlReference: cast[{name}].gender`.
5. Max one error per character per scene.

### 7.4 Check 3: `checkOpeningStyles(story)`

**Scope:** Skips if fewer than 4 scenes.

**7 style buckets:**
- `dialogue-open`: starts with `"`
- `noun-phrase-atmosphere`: starts with adjective + noun (atmospheric)
- `expository-setup`: starts with `The` or `A` as expository opener
- `temporal-subordinate`: starts with temporal subordinate clause (As|When|While|By the time…)
- `character-action`: starts with a named character
- `time-anchor`: starts with a time reference (At dawn / In the morning / That evening…)
- `general-descriptive`: fallback

**Logic:** if any single style bucket accounts for more than 50% of all scene openings: `opening_style_repetition` (moderate).

### 7.5 Check 4: `checkContextLeakage(story)`

**Pattern 1:** `/\bAt The [A-Z][a-zA-Z\s]+ in [A-Z][a-zA-Z]+\b/g` — scaffold template marker. Error: `context_leakage` (major).

**Pattern 2:** sentence length > 40 words AND contains a room name AND contains a country/estate name AND contains sensory enumeration. Error: `context_leakage_suspected` (minor).

---

## Section 8: Validator 4 — `NarrativeContinuityValidator`

### 8.1 Scene-pair loop

Iterates `i = 1` to `story.scenes.length - 1`; compares scene i-1 and scene i.

| Error type | Severity | Trigger condition |
|---|---|---|
| `missing_case_transition_bridge` | major | `DISAPPEARANCE_TERMS` in `prev.text` AND `DEATH_TERMS` in `curr.text` AND NOT `BRIDGE_TERMS` in `curr.text` |
| `investigator_role_drift` | major | `sawAmateurInvestigator` flag set AND `OFFICIAL_TAKES_CHARGE_TERMS` in `curr.text` AND NOT `ROLE_TRANSITION_TERMS` in `curr.text` |
| `temporal_contradiction` | major | `analyzeTemporalConsistency()` returns `conflictingSeasons.length > 0` for scene pair |

**Key regex sets (selected):**
- `BRIDGE_TERMS`: `body was found|confirmed dead|turned up dead|missing person case became a murder|identified the body`
- `DISAPPEARANCE_TERMS`: `went missing|disappeared|vanished|reported missing|hasn't been seen`
- `DEATH_TERMS`: `found dead|body was|was murdered|killed|died`
- `OFFICIAL_TAKES_CHARGE_TERMS`: `Inspector|Detective|Police constable` + `took over|took charge|assumed control`
- `ROLE_TRANSITION_TERMS`: `handed over|handed the case to|turned it over to|deferred to`

### 8.2 Post-loop pivot check

After the scene-pair loop, identifies the pivot scene — the first scene containing `ARREST_OR_CONFESSION_TERMS` (`arrested|under arrest|confess(ed|ion)|admitted it|the culprit was revealed`). Checks all scenes **after** the pivot for `ROLE_ALIAS_TERMS`.

| Error type | Severity | Trigger |
|---|---|---|
| `identity_role_alias_break` | **critical** | Scene after arrest/confession uses `the (killer|murderer|culprit|criminal)|the suspect did it` |

---

## Section 9: Validator 5 — `CaseTransitionValidator`

### 9.1 Story-level (not scene-pair) check

Joins all scene texts into a single string. Checks are enforced when:
- `cml.CASE.meta.crime_category.includes('missing')`, OR
- `cml.CASE.meta.crime_category === 'unknown'`, OR
- `hasDisappearanceSignal` (any `DISAPPEARANCE_TERMS` found in full text)

### 9.2 Check logic

Requires Bridge Terms (`BRIDGE_TERMS`) to appear anywhere in the full story text when the above conditions are met.

Error: `case_transition_missing` (major) if bridge absent.

---

## Section 10: Validator 6 — `DiscriminatingTestValidator`

### 10.1 Phase 1 — Regex component scoring

Four component patterns applied per scene:

| Component | Pattern |
|---|---|
| `TEST_TERMS` | `/test\|experiment\|re-?enactment\|trap\|constraint proof\|demonstration\|verification/` |
| `EVIDENCE_TERMS` | `/because\|therefore\|proof\|evidence\|measured\|timed\|observed/` |
| `EXCLUSION_TERMS` | `/excluded?\|eliminated?\|ruled\s+out\|could\s+not\s+have\|cannot\s+be\s+the\s+culprit\|only\s+one\s+person\s+could/` |
| `OUTCOME_TERMS` | `/culprit\|killer\|murderer\|did\s+it\|was\s+guilty\|is\s+guilty\|must\s+be/` |

**`toCoverage(sceneText)`:** returns a score 0–4 counting which components are present.

**Pass condition:** at least one scene passes all 4 components simultaneously → overall pass.

If no valid test scene: records the scene with the highest coverage score as the "best candidate" for error attribution.

### 10.2 Phase 2 — LLM semantic fallback

Activated when Phase 1 finds no valid test scene AND `llmClient` is available.

- Calls `semanticValidateDiscriminatingTest(sceneText, llmClient, logContext)` per scene, in scene order.
- Prompt: asks if the scene contains a hypothesis test + elimination logic + evidence/proof.
- Returns `{ isValid: boolean, confidence: 'high'|'medium'|'low', reasoning: string }`.
- Parameters: `temperature=0.0`, `maxTokens=200`, JSON-only response.
- Accepts a scene as valid if `isValid === true && confidence !== 'low'`.
- Stops at first accepted scene.

### 10.3 Error types

| Error type | Severity | Condition |
|---|---|---|
| `missing_discriminating_test` | **critical** | No valid test scene found (both phases fail) |
| `discriminating_test_missing_setup` | major | TEST_TERMS absent in best candidate |
| `discriminating_test_missing_evidence_usage` | major | EVIDENCE_TERMS absent in best candidate |
| `discriminating_test_missing_elimination_logic` | major | EXCLUSION_TERMS absent in best candidate |
| `discriminating_test_missing_outcome_declaration` | major | OUTCOME_TERMS absent in best candidate |
| `cml_test_not_realized` | major | CML has `discriminating_test.method` or `discriminating_test.design` set, but no scene contains any TEST_TERMS at all |

---

## Section 11: Validator 7 — `SuspectClosureValidator`

### 11.1 Suspect elimination loop

For each non-culprit suspect derived from `cml.CASE.culpability.culprits`:

**Phase 1:** Searches all scene texts for a scene containing:
- Suspect name (by label match)
- `ELIMINATION_TERMS` (`excluded?|eliminated?|ruled\s+out|alibi|proved innocent|could not have`)
- `EVIDENCE_TERMS` (`evidence|proof|because|confirmed|established|showed`)

If found → suspect is cleared, continue to next suspect.

**Phase 2 (LLM fallback):** Calls `semanticValidateSuspectElimination(sceneText, suspectName, llmClient, logContext)` per scene.
- Prompt: asks if scene references the named suspect, explains why they are cleared/eliminated, and supports this with evidence.
- Parameters: `temperature=0.0`, `maxTokens=200`, JSON-only.
- Accepts if `isValid === true && confidence !== 'low'`.

If neither phase passes: `suspect_closure_missing` (major).

### 11.2 Culprit evidence chain loop

For each culprit in `cml.CASE.culpability.culprits`:

**Phase 1:** Searches all scene texts for a scene containing:
- Culprit name (by label match),
- `CULPRIT_TERMS` (`culprit|guilty|murdered|killed|committed|responsible for the crime`)
- `EVIDENCE_TERMS`

**Phase 2 (LLM fallback):** Calls `semanticValidateCulpritEvidence(sceneText, culpritName, llmClient, logContext)`.
- Prompt: asks if scene connects the named culprit to the crime with decisive evidence, proof, or reasoning (by name, connecting them to the crime as killer/murderer/responsible party).
- Parameters: `temperature=0.0`, `maxTokens=200`, JSON-only.
- Accepts if `isValid === true && confidence !== 'low'`.

If neither phase passes: `culprit_evidence_chain_missing` (**critical**).

---

## Section 12: Validator 8 — `PhysicalPlausibilityValidator`

### 12.1 Per-scene trigger conditions and checks

| Trigger | Method | Error type | Severity |
|---|---|---|---|
| `footprint` in scene text | `validateFootprints()` | `implausible_footprints` | major |
| `embedded\|buried in\|stuck in` in scene text | `validateEmbeddedObjects()` | `implausible_embedded_object` | major |
| `storm\|rain\|wind` in scene text | `validateWeatherEvidence()` | `weather_incompatible_evidence` | major |
| `struggle\|fight\|confrontation` in scene text | `validateStruggleEvidence()` | `implausible_struggle_damage` | moderate |

### 12.2 `validateFootprints()`

Checks viability of surface type for footprint retention.

- **Viable surfaces:** carpet, soft earth, dust, snow, mud, sand
- **Non-viable surfaces:** wooden deck, tile, metal

Logic: if a non-viable surface term is present AND scene lacks any viable surface term → `implausible_footprints` (major).

### 12.3 `validateEmbeddedObjects()`

Checks: if `metal|insignia|badge` AND `embedded|buried|stuck` AND `wood|deck|plank` are all present → `implausible_embedded_object` (major). Message: "Metal object cannot become embedded in hardwood deck without massive force."

### 12.4 `validateWeatherEvidence()`

Checks: if `storm|tempest|gale` AND `dust|paper|footprint|fiber` AND `deck|outside|exterior` are all present → `weather_incompatible_evidence` (major).

### 12.5 `validateStruggleEvidence()`

Checks three implausible damage patterns:

| Pattern | Message |
|---|---|
| `/shattered.*steel\|broken.*iron/i` | "Human struggle cannot shatter steel or iron" |
| `/embedded.*metal.*wood/i` | "Struggle cannot embed metal in hardwood" |
| `/cracked.*stone\|fractured.*marble/i` | "Human struggle unlikely to crack stone/marble" |

Error: `implausible_struggle_damage` (moderate) per matched pattern.

---

## Section 13: Validator 9 — `EraAuthenticityValidator`

### 13.1 Entry condition

Validator is active only when `cml.CASE.meta.era.decade` is set AND matches a key in `ERA_CONTEXTS`. Unknown eras return `{ valid: true, errors: [] }` silently.

### 13.2 Defined era contexts

**`'1950s'`:**
- `forbiddenTerms`: smartphone, internet, email, text message, CCTV, DNA test, social media
- `technologyAvailable`: telephone, telegram, radio, automobile, typewriter
- `technologyForbidden`: same as forbidden terms
- `requiredMarkers` (period flavor signals)

**`'1920s'`:**
- `forbiddenTerms`: television, computer, email, mobile phone, plastic, nylon
- `technologyAvailable`: telephone, telegram, motorcar, gramophone, wireless
- `technologyForbidden`: same as forbidden terms

### 13.3 `checkAnachronisms(story, eraContext)`

Per scene: for each `forbiddenTerm` in `eraContext.forbiddenTerms`, tests `/\b{term}\b/i` against `scene.text`. Error: `anachronism` (major) per matched term.

### 13.4 `checkPeriodMarkers(story, eraContext)`

Per scene where `scene.text.length > 500`:
- `hasFormalAddress`: scene contains formal address patterns (e.g. "My dear", "Quite so", period-appropriate honorifics)
- `hasPeriodTech`: scene mentions a technology from `eraContext.technologyAvailable`
- `hasFashionDetail`: scene contains clothing/fashion detail appropriate to era

If all three are zero (no period flavor at all) → `missing_period_markers` (moderate).

---

## Section 14: Post-Loop Validator A — `validateChapterSequence(story)`

Called on `story` after the 9-validator loop. Exported standalone function from `chapter-validator.ts`.

### 14.1 Duplicate chapter numbers

For each `scene.number` that appears more than once across `story.scenes`: `chapter_duplicated` (**critical**), `sceneNumber` set to the duplicated chapter number.

### 14.2 Missing chapters (gaps)

Iterates sorted chapter number list; for every gap between consecutive scene numbers, one `chapter_missing` error (critical) per missing chapter number.

### 14.3 Title format consistency

Classifies each scene title into one of four patterns:
- `number-only`: `/^chapter\s+\d+$/i`
- `number-plus-title`: `/^chapter\s+\d+[:\s-]+\S/i`
- `bare-number`: `/^\d+$/`
- `title-only`: all other titles

If more than one pattern is present across the story: `chapter_title_inconsistency` (major).

---

## Section 15: Post-Loop Validator B — `validateLocationConsistency(story, cml)`

### 15.1 `buildLocationRegistry(cml)` → `Map<lowerCaseVariant, canonicalName>`

Sources: `cml.locationProfiles.primary.name` + each element of `cml.locationProfiles.keyLocations[].name`.

For each location name, three variants are generated and mapped:
1. Original name (lowercased)
2. No-leading-article form (strips `the`, `a`, `an` prefix)
3. Hyphenated word form (spaces replaced with hyphens)

All three variants map to the canonical name.

### 15.2 Check logic

Per scene, per registry entry: looks for the canonical location name's case variants in `scene.text`. If a case-mismatch variant is found (matching text but not exact case): `location_name_variant` (moderate).

Skips location names whose length ≤ 3 characters.

---

## Section 16: LLM Semantic Validators (`semantic-validator.ts`)

Three functions, all operating at `temperature=0.0`, `maxTokens=200`, JSON-only output.

### 16.1 `semanticValidateDiscriminatingTest(sceneText, client, logContext)`

**Prompt asks:** does the scene contain a hypothesis test + elimination logic + evidence or proof?

**Response shape:** `{ isValid: boolean, confidence: 'high'|'medium'|'low', reasoning: string }`

Call site: `DiscriminatingTestValidator` Phase 2.

### 16.2 `semanticValidateSuspectElimination(sceneText, suspectName, client, logContext)`

**Prompt asks:** does the scene reference the named suspect, explain why they were cleared/eliminated, and support this with evidence?

**Response shape:** same as above.

Call site: `SuspectClosureValidator` Phase 2 (suspects).

### 16.3 `semanticValidateCulpritEvidence(sceneText, culpritName, client, logContext)`

**Prompt asks:** does the scene reference the named culprit by name, connect them to the crime (as killer/murderer/responsible party), and provide decisive evidence, proof, or reasoning?

Examples in prompt: "The poison in Richard's study matched the substance in the victim's blood"; "Elizabeth's glove was found at the scene"; "Only Catherine had access to the locked room."

**Response shape:** same as above.

Call site: `SuspectClosureValidator` Phase 2 (culprit evidence chain).

---

## Section 17: Temporal Consistency Utility (`temporal-consistency.ts`)

### 17.1 Data tables

- `MONTH_TO_SEASON`: 12-entry map (january → winter; march–may → spring; june–august → summer; september–november → autumn; december → winter)
- `MONTH_ABBREVIATIONS`: 11-entry map (jan, feb, mar, apr, jun, jul, aug, sep, sept, oct, nov, dec → full names)
- `MONTH_TO_FORBIDDEN_SEASONS`: derived from `MONTH_TO_SEASON`; for each month, the 3 seasons that are NOT the month's season

### 17.2 `analyzeTemporalConsistency(text, temporalMonth?)` → `TemporalConsistencyAnalysis`

1. Scans `text` for all `MONTH_PATTERNS` (full names + abbreviations with regex word-boundary).
2. If `temporalMonth` is provided and normalizes to a known month, adds it to the month set.
3. Derives `expectedSeasonsSet` from all mentioned months via `MONTH_TO_SEASON`.
4. Scans `text` for all `SEASON_PATTERNS` (spring/springtime/vernal; summer/summertime/midsummer; autumn/autumnal/fall; winter/wintertime/wintry).
5. A season present in text that is NOT in `expectedSeasonsSet` is added to `conflictingSeasons`.

Returns `{ mentionedMonths, expectedSeasons, conflictingSeasons }`.

If no months mentioned and no `temporalMonth` provided: returns empty arrays (no check possible, no violation).

---

## Section 18: Pronoun Repair Utility (`pronoun-repair.ts`)

### 18.1 Entry function: `repairChapterPronouns(chapter, cast)` → `{ chapter, repairCount }`

**Two-pass algorithm:**

**Pass 1 — Sentence-level repair on full chapter text:**
1. Joins all `chapter.paragraphs` with `\n\n` into `fullText`.
2. Calls `repairPronouns(fullText, cast)` — see §18.2.
3. Splits result back into paragraphs on `\n\n`.

**Pass 2 — Dialogue-attribution repair per paragraph:**
4. For each paragraph produced by Pass 1, calls `repairDialogueAttributionPronouns(paragraph, characters)` — see §18.3.
5. Accumulates total repair count from both passes.

Returns repaired chapter object with new paragraphs array.

### 18.2 `repairPronouns(text, cast, options?)` — main repair engine

**Options:**
- `options.targetNames?: string[]` — if provided, restricts repair to named characters and skips the competing-gender guard (validator has already confirmed no competing owner exists). If `targetNames` is empty array (no validatable targets) → returns immediately with no repairs.

**Algorithm:**

1. Splits text on `\n\n` into paragraphs.
2. Maintains `lastSingleCharacter: CharacterPronounInfo | null` as carry-forward state across paragraphs.
3. For each paragraph: splits on sentence pattern `/([^.!?]*[.!?]+\s*)|([^.!?]+$)/g`.
4. For each sentence segment:
   - `mentioned = findMentionedCharacters(segment, characters)`
   - **Case 1 — exactly 1 named character:** set `lastSingleCharacter = mentioned[0]`; call `repairPronounsInSegment(segment, mentioned[0])`.
   - **Case 2 — 0 named characters:** if `lastSingleCharacter` is not null, use it as the repair target (carry-forward). In targeted mode: if a non-target character appears in the segment, null `lastSingleCharacter` and skip repair.
   - **Case 3 — 2+ named characters, same gender:** repair using the first mentioned character's pronouns; set `lastSingleCharacter`.
   - **Case 4 — 2+ named characters, mixed gender:** use sentence-opening heuristic — find the character whose label the sentence starts with. If found: in conservative mode, only repair if no other character in this sentence shares the pronoun's gender; in targeted mode, always repair. Set `lastSingleCharacter = subjectCharacter`.
   - **Case 5 — 2+ mixed-gender without clear subject:** null `lastSingleCharacter`; skip repair.

### 18.3 `repairDialogueAttributionPronouns(text, characters)`

**Target pattern:** closing quote + optional comma/space + subject pronoun (`he|she|they`) + attribution verb (`said|asked|murmured|replied|whispered|continued|cried|called|added|began|finished|insisted|admitted|declared|announced|exclaimed`).

**Algorithm per match:**
1. Look back up to 800 chars from match offset; find nearest preceding paragraph break as lookback boundary.
2. Find the opening quote character corresponding to the closing quote.
3. Extract `textBeforeQuote` (text before the opening quote in the lookback window).
4. Find all characters mentioned in `textBeforeQuote`.
5. If exactly 1 character found → verify attribution pronoun matches speaker's gender.
6. If mismatch: replace pronoun with `correctPronoun(pronoun, speaker.pronouns)`.
7. Ambiguous (0 or 2+ characters before quote) → skip.

### 18.4 `repairPronounsInSegment(segment, targetCharacter)`

Replaces wrong-gender pronouns in `segment` for `targetCharacter`.

**`her` disambiguation** (important for female targets who need `his`): if `her` is found and followed by `^[a-z]` AND the following word is not a determiner/article/`to` → treat as possessive → replace with `his`; otherwise treat as object → replace with `him`.

---

## Section 19: `ChapterValidator` — Generation-Time Validator

### 19.1 Position in pipeline

`ChapterValidator` is distinct from `StoryValidationPipeline`. It runs inside `agent9-prose.ts` during the chapter generation loop, per chapter and per batch attempt, before a chapter is committed to the `chapters[]` array.

**Host location:** `packages/prompts-llm/src/agent9-prose.ts` — `generateProse()` function.

**Instantiation:** `const chapterValidator = new ChapterValidator()` — single instance reused across all chapters.

### 19.2 When it runs

Inside the `for (let batchStart = 0; batchStart < scenes.length; ...)` loop and the inner `for (let attempt = 1; attempt <= maxBatchAttempts; ...)` retry loop. Runs on each candidate chapter before acceptance. If validation fails (critical or major issues) the batch attempt is rejected; `buildEnhancedRetryFeedback()` is called and the next attempt begins.

### 19.3 `validateChapter(chapter, cmlData)` — interface

Input:
```typescript
{
  title: string;
  paragraphs: string[];
  chapterNumber: number;
  totalChapters: number;
  temporalMonth?: string;
  temporalSeason?: string;
}
```

Output:
```typescript
{
  isValid: boolean;          // true when criticalIssues.length === 0
  issues: ChapterValidationIssue[];
}
```

`ChapterValidationIssue`: `{ severity: 'critical'|'major'|'moderate'|'minor', message: string, suggestion?: string }`

### 19.4 Nine internal checks

| # | Check method | Scope | Error severity |
|---|---|---|---|
| 1 | `checkCharacterNames()` | All chapters | critical |
| 2 | `checkSettingFidelity()` | All chapters (ch ≤ 5 stricter) | critical / moderate |
| 3 | `checkDiscriminatingTest()` | Chapters ≥ 85% of total | major |
| 4 | `checkProseQuality()` | All chapters | major / moderate |
| 5 | `checkSceneGrounding()` | All chapters | major / moderate |
| 6 | `checkEncodingIntegrity()` | All chapters | major |
| 7 | `checkTemporalConsistency()` | All chapters | major |
| 8 | `checkTemplateLeakage()` | All chapters | major / moderate |
| 9 | `checkVictimNaming()` | Chapter 1 only | major |

### 19.5 Check detail: `checkSettingFidelity()`

**Setting pattern vocabulary (7 location types):**
- `country_estate`: estate, manor, grounds, drawing room, study, library
- `london_townhouse`: london, townhouse, square, parlour, street
- `ocean_liner`: ship, deck, cabin, stateroom, saloon, gangway
- `orient_express`: train, compartment, railway, dining car, corridor
- `hotel`: hotel, lobby, suite, reception, hallway
- `scottish_castle`: castle, highland, keep, battlements, great hall
- `cotswold_village`: village, cottage, lane, high street, green

Logic: if `locationType` is in `settingPatterns` AND conflicting terms from OTHER location types are found: critical issue (regardless of chapter number). If chapter ≤ 3 and expected terms are absent: moderate issue.

### 19.6 Check detail: `checkDiscriminatingTest()`

Only triggered when `chapter.chapterNumber >= Math.ceil(totalChapters * 0.85)`. Extracts up to 5 key terms from `cml.CASE.discriminating_test.design` (words length > 4, excluding stop words). If no key terms found in chapter text: major issue.

### 19.7 Check detail: `checkProseQuality()`

Four sub-checks:
1. `paragraphs.length < 3` → major
2. `max(paragraphLengths) > 2400` → major
3. `max/min paragraph ratio > 10` → moderate (extreme imbalance)
4. More than 50% of paragraphs shorter than 100 chars → moderate
5. Any paragraph-opening word repeated > 3 times → moderate

### 19.8 Check detail: `checkSceneGrounding()`

Checks the opening 2 paragraphs (`paragraphs.slice(0, 2)`):
1. Presence of strict location anchor from `settingPatterns[locationType]` or `locationName` → major if absent (or moderate if locationType not in known patterns)
2. Sensory markers (smell/scent/odor/sound/echo/silence/cold/warm/damp/glow/shadow/flicker, etc.) count ≥ 2 → major if fewer than 2
3. Atmosphere/time markers (rain/wind/fog/storm/evening/morning/night/dawn/dusk) count ≥ 1 → major if absent
4. If location anchor absent from opening block but present later in chapter → secondary moderate issue about delayed grounding

### 19.9 Check detail: `checkTemplateLeakage()`

Six sub-checks:
1. Long scaffold prose pattern (At The … the smell of … atmosphere ripe for revelation) → major
2. Metadata key-value pair leakage (`Setting:`/`Location:`/`Atmosphere:`/`Mood:` etc.) → major
3. Meta-language about storytelling (`sensory detail`, `narrative beat`, `plot point`, `character arc`, etc.) → major
4. Instruction-shaped prose (`ensure|make sure|remember to|don't forget|incorporate` + tension/mystery/clue words) → major
5. Low verb-density paragraph (< 30% of sentences contain a verb): moderate, max one per chapter
6. Duplicate long paragraph blocks (≥ 180 chars, normalized): major

### 19.10 Check detail: `checkVictimNaming()`

Chapter 1 only. Extracts victim character from `cml.CASE.cast` by `roleArchetype.includes('victim')`. Two checks:
1. If victim name is known but not present in chapter 1 text (by full name or surname/first-name fragment > 3 chars): major
2. If anonymous victim language matches `/\b(an?\s+unknown\s+(victim|body|person|man|woman)|body\s+of\s+an?\s+(unknown|unidentified)|unidentified\s+(victim|body|person))\b/i`: major

### 19.11 Interaction with retry loop

All `critical` and `major` issues from `contentValidation.issues` are collected into `hardErrors[]`. If `hardErrors.length > 0`, the batch attempt fails. `buildEnhancedRetryFeedback()` formats all error messages as directed retry instructions. On the final attempt, the raw LLM response is NOT sent as an assistant turn (clean rebuild); on earlier attempts it is.

---

## Section 20: Integration in `agent9-run.ts`

### 20.1 Call sequence

```
applyDeterministicProsePostProcessing()          ← pass 1 (pronoun repair + post-processing)
↓
storyForValidation = buildStoryObject(prose)      ← { id, projectId, scenes: chapters.map(...) }
↓
validationPipeline.validate(storyForValidation, cmlData)
↓
preRepairValidationSummary = { ...validationReport.summary }
↓
validationPipeline.autoFix(storyForValidation)   ← encoding fix only
↓
apply encoding fixes to prose.chapters[].paragraphs (if text changed)
↓
applyDeterministicProsePostProcessing()          ← pass 2 (re-apply after encoding fix)
↓
postRepairValidationSummary = re-validate().summary  ← for diagnostic logging
↓
Release Gate evaluation (§21)
```

### 20.2 Story object construction

```typescript
storyForValidation = {
  id: runId,
  projectId,
  scenes: prose.chapters.map((chapter, index) => ({
    number: index + 1,
    title: chapter.title,
    text: chapter.paragraphs.join('\n\n'),
  }))
}
```

### 20.3 CML data passed to pipeline

The pipeline receives `{ ...cml, lockedFacts, locationProfiles }` cast to the `CMLData` shape. `lockedFacts` and `locationProfiles` come from separate context variables held in `agent9-run.ts`.

### 20.4 Status branching

| `validationReport.status` | Action |
|---|---|
| `'passed'` | Progress report only; continue |
| `'needs_review'` | Warning pushed to `ctx.warnings`; continue |
| `'needs_revision'` | Error logged; first 10 errors printed; **throw error** (generation aborts) |
| `'failed'` | Error logged; first 10 errors printed; contributing factors logged; **throw error** |

Contributing factors logged on failure: batch retry count, CML clue coverage gaps, outline coverage issues, fair play audit status, validation error details.

---

## Section 21: Release Gate

### 21.1 Overview

The release gate runs after validation and auto-fix. It collects two arrays:
- `releaseGateReasons[]` — warnings logged to `ctx.warnings`; run continues.
- `hardStopReasons[]` — throws `Error("Release gate hard-stop: ...")` immediately; orchestrator catch block saves a partial report with zeroed prose score.

A condition can appear in both arrays (warning AND hard-stop).

### 21.2 Error classifier functions

Four exported classifier functions (used to populate `hasSuspectEliminationCoverageFailure`):

| Function | Matches |
|---|---|
| `isDiscriminatingTestCoverageError(error)` | types: `missing_discriminating_test`, `cml_test_not_realized`, `discriminating_test_missing`; OR message matches `/(discriminating\s+test\|re-?enactment\|timing\s+test\|constraint\s+proof\|test\s+scene)/i` |
| `isSuspectClosureCoverageError(error)` | types: `suspect_closure_missing`, `suspect_elimination_coverage_incomplete`, `suspect_elimination_missing`, `suspect_clearance_missing`; OR message matches suspect closure pattern |
| `isCulpritEvidenceChainCoverageError(error)` | types: `culprit_evidence_chain_missing`, `culprit_chain_missing`, `culprit_evidence_missing`, `culprit_link_missing`; OR message matches culprit chain pattern |
| `isSuspectEliminationCoverageError(error)` | `isSuspectClosureCoverageError(error) || isCulpritEvidenceChainCoverageError(error)` |

All four use `normalizeValidationErrorKey()` (lowercase + non-alphanumeric replaced by `_`, leading/trailing `_` stripped) for fuzzy type matching.

### 21.3 Release gate evaluation helpers (called before populating reason arrays)

| Helper | Returns | Threshold |
|---|---|---|
| `evaluateProseReadability(prose)` | `{ denseChapterCount, underParagraphCount, severeParagraphBlocks }` | `denseChapterCount > 0` → warning |
| `evaluateSceneGroundingCoverage(prose, locationProfiles)` | `{ grounded, total, coverage }` | `coverage < 0.9` → warning |
| `evaluatePlaceholderLeakage(prose)` | `{ roleSurnameCount, standaloneCount, genericRoleCount, hasLeakage, severeLeakage, examples[] }` | any leakage → warning + hard stop |
| `evaluateChapterHeadingArtifacts(prose)` | `{ duplicatedHeadingCount, hasArtifacts }` | `hasArtifacts` → warning + hard stop |

**`evaluatePlaceholderLeakage` patterns:**
- Pattern 1: `/\b(a|an)\s+(inspector|detective|...)\s+([A-Z][a-z]+)\b/` → `roleSurnameCount`
- Pattern 2: `/\b(a woman [A-Z][a-z]+|a man [A-Z][a-z]+)\b/` → `standaloneCount`
- Pattern 3: `/\b(a gentleman|an inspector|...)\b/` → `genericRoleCount`
- `severeLeakage = roleSurnameCount > 0 || standaloneCount >= 2`
- `hasLeakage = roleSurnameCount > 0 || standaloneCount > 0 || genericRoleCount >= 12`

### 21.4 NSD/Clue visibility divergence

Computed by comparing two sources:
- `nsdRevealedClues`: clue IDs marked as newly revealed in `ctx.nsdTransferTrace`
- `evidenceVisibleClues`: clue IDs found to have prose evidence anchors via `collectClueEvidenceFromProse()`

Divergence:
- `revealedWithoutEvidence`: in NSD but absent from prose → warning + hard stop
- `evidenceWithoutReveal`: in prose but not in NSD → warning only

### 21.5 Hard-stop conditions (triggers throw)

| Condition | Hard-stop message |
|---|---|
| `fairPlayAudit.overallStatus === 'fail'` OR `fpValidation < 60` OR any check has `status === 'fail'` | `"fair play audit failed (score/100): mystery violates fundamental fair play principles"` |
| `validationErrorTypes.has('temporal_contradiction')` | `"temporal continuity contradiction detected"` |
| `proseContainsMojibake` | `"mojibake/encoding artifact remains"` |
| `proseContainsIllegalControlChars` OR `validationErrorTypes.has('illegal_character')` | `"illegal character/encoding corruption detected"` |
| `hasSuspectEliminationCoverageFailure` | `"suspect elimination coverage incomplete"` |
| `placeholderLeakage.hasLeakage` | placeholder leakage message with counts and examples |
| `chapterHeadingArtifacts.hasArtifacts` | `"duplicate chapter heading artifacts detected"` |
| `revealedWithoutEvidence.length > 0` | `"clue visibility incomplete (N NSD-revealed clue(s) have no prose evidence anchors)"` |

### 21.6 Warning-only conditions (no throw)

| Condition |
|---|
| `fairPlayAudit.overallStatus === 'needs-revision'` |
| `validationErrorTypes.has('identity_role_alias_break')` OR `missing_case_transition_bridge` OR `case_transition_missing` |
| `validationErrorTypes.has('investigator_role_drift')` |
| `validationErrorTypes.has('missing_discriminating_test')` OR `cml_test_not_realized` |
| `readabilitySummary.denseChapterCount > 0` |
| `sceneGrounding.coverage < 0.9` |
| `nsdVisibilityDivergence.diverged` (when only `evidenceWithoutReveal`, not `revealedWithoutEvidence`) |

### 21.7 Fair play audit scoring

The release gate uses a simple linear map:
- `overallStatus === 'pass'` → 100
- `overallStatus === 'needs-revision'` → 70
- Otherwise → 45

Hard stop fires if `fpValidation < 60` OR any check in `fairPlayAudit.checks[]` has `status === 'fail'`.

### 21.8 Release gate diagnostic record

Logged to `scoringLogger` as `release_gate_summary`:

```typescript
{
  validation_status, validation_summary,
  validation_snapshots: { pre_repair, post_repair, release_gate },
  release_gate_warning_count, release_gate_hard_stop_count,
  release_gate_warnings, release_gate_hard_stops,
  readability, scene_grounding, placeholder_leakage, chapter_heading_artifacts,
  clue_visibility_expected_ids, clue_visibility_extracted_ids,
  clue_visibility_missing_expected_ids, clue_visibility_unexpected_extracted_ids,
  nsd_visibility_divergence,
  has_illegal_control_chars, has_mojibake,
  fair_play_status,
}
```

### 21.9 Failure lineage bundle (E4)

Logged to `scoringLogger` as `failure_lineage`:

```typescript
{
  first_failing_chapter: number | null,
  error_classes: string[],     // classified from chapterValidationHistory
  corrective_attempts: number, // proseRepairPassCount + proseRewritePassCount
  final_blocking_reason: string | null,
}
```

Error class classification regex:
- `clue_visibility`: matches `/clue|evidence/i`
- `word_count`: matches `/word.*count|minimum.*words|chapter.*length/i`
- `temporal`: matches `/temporal|season|month/i`
- `scene_grounding`: matches `/scene.*ground|location/i`
- `identity_continuity`: matches `/identity|character|phantom/i`
- `template_leakage`: matches `/template|fingerprint|ngram/i`
- `validation_error`: fallback

---

## Section 22: Complete Error Type Reference Table

| Error type | Validator | Severity |
|---|---|---|
| `encoding_artifact` | EncodingValidator | major |
| `illegal_character` | EncodingValidator | major |
| `pronoun_gender_mismatch` | CharacterConsistencyValidator | **critical** |
| `illegal_named_walk_on` | CharacterConsistencyValidator | major |
| `role_location_mismatch` | CharacterConsistencyValidator | major |
| `role_location_notice` | CharacterConsistencyValidator | moderate |
| `detective_name_inconsistency` | CharacterConsistencyValidator | **critical** |
| `locked_fact_contradicted` | ProseConsistencyValidator | **critical** |
| `locked_fact_missing_value` | ProseConsistencyValidator | major |
| `pronoun_drift` | ProseConsistencyValidator | moderate |
| `opening_style_repetition` | ProseConsistencyValidator | moderate |
| `context_leakage` | ProseConsistencyValidator | major |
| `context_leakage_suspected` | ProseConsistencyValidator | minor |
| `missing_case_transition_bridge` | NarrativeContinuityValidator | major |
| `investigator_role_drift` | NarrativeContinuityValidator | major |
| `temporal_contradiction` | NarrativeContinuityValidator | major |
| `identity_role_alias_break` | NarrativeContinuityValidator | **critical** |
| `case_transition_missing` | CaseTransitionValidator | major |
| `missing_discriminating_test` | DiscriminatingTestValidator | **critical** |
| `discriminating_test_missing_setup` | DiscriminatingTestValidator | major |
| `discriminating_test_missing_evidence_usage` | DiscriminatingTestValidator | major |
| `discriminating_test_missing_elimination_logic` | DiscriminatingTestValidator | major |
| `discriminating_test_missing_outcome_declaration` | DiscriminatingTestValidator | major |
| `cml_test_not_realized` | DiscriminatingTestValidator | major |
| `suspect_closure_missing` | SuspectClosureValidator | major |
| `culprit_evidence_chain_missing` | SuspectClosureValidator | **critical** |
| `implausible_footprints` | PhysicalPlausibilityValidator | major |
| `weather_incompatible_evidence` | PhysicalPlausibilityValidator | major |
| `implausible_embedded_object` | PhysicalPlausibilityValidator | major |
| `weather_destroys_evidence` | PhysicalPlausibilityValidator | major |
| `implausible_struggle_damage` | PhysicalPlausibilityValidator | moderate |
| `anachronism` | EraAuthenticityValidator | major |
| `missing_period_markers` | EraAuthenticityValidator | moderate |
| `chapter_duplicated` | validateChapterSequence | **critical** |
| `chapter_missing` | validateChapterSequence | **critical** |
| `chapter_title_inconsistency` | validateChapterSequence | major |
| `location_name_variant` | validateLocationConsistency | moderate |

---

## Section 23: Inline ChapterValidator Pronoun Repair Sequence

During generation (in `agent9-prose.ts`), four pronoun-related operations occur per chapter candidate:

1. **Pre-validation deterministic repair:** `repairChapterPronouns(chapter, inputs.cast.characters)` is called on the raw generated chapter before any validation. If repairs were made, `chapter` is updated in `proseBatch.chapters[i]` before the `evaluateCandidate()` call. Controlled by `pronounCheckingEnabled` flag from `getGenerationParams().agent9_prose.validation.pronoun_checking_enabled`.

2. **`ChapterValidator` check (inside `evaluateCandidate()`):** `contentValidation.issues` from `chapterValidator.validateChapter()` includes setting/grounding/template/quality checks. Pronoun state is not directly checked here (that is handled by `CharacterConsistencyValidator` separately).

3. **Post-evaluation targeted pronoun repair:** After `evaluateCandidate()`, `CharacterConsistencyValidator.validate()` is run against the chapter to find `pronoun_gender_mismatch` errors. For confirmed mismatches, `repairPronouns(chapterText, cast, { targetNames: flaggedNames })` is called in targeted mode (skips competing-gender guard). After repair, `CharacterConsistencyValidator.validate()` is run again; residual mismatch errors are escalated to `chapterErrors[]` (triggering retry).

4. **Post-expansion repair:** If an underflow expansion was triggered and succeeded, `repairChapterPronouns()` is called again on the expanded chapter.

---

## Section 24: Pronoun Repair vs Validation Guard — Relationship

The system uses three distinct pronoun mechanisms:

| Mechanism | Location | Mode | Purpose |
|---|---|---|---|
| `repairChapterPronouns()` | `agent9-prose.ts` per-chapter generation | Conservative (competing-gender guard active) | Deterministic safety net on raw LLM output before validation |
| `repairPronouns(..., { targetNames })` | `agent9-prose.ts` post-validator | Targeted (guard bypassed, validator confirmed no competing owner) | Fix validator-confirmed mismatches; re-validation confirms success |
| `applyDeterministicProsePostProcessing()` | `agent9-run.ts` | Full chapter set, conservative | Final story-wide sweep after all chapters committed; runs twice (before and after encoding auto-fix) |
| `CharacterConsistencyValidator.validate()` | Both `agent9-prose.ts` and `StoryValidationPipeline` | Detection only | Reports `pronoun_gender_mismatch` errors; does not repair |
| `ProseConsistencyValidator.checkPronounDrift()` | `StoryValidationPipeline` only | Detection only | Reports `pronoun_drift` errors using a 200-char window heuristic; lower precision than the validator above |

The `pronoun_drift` check in `ProseConsistencyValidator` is a separate, coarser check from `pronoun_gender_mismatch` in `CharacterConsistencyValidator`. They can both fire for the same prose passage.

---

## Section 25: Issues Found — Bugs, Errors, and Inconsistencies

*Assessment layer. Each finding includes: file, location, severity classification, description, and recommended fix.*

Severity classification used here is independent of `ValidationError.severity`. It describes the impact on the system:
- **CRITICAL** — causes incorrect run-abort, silent data loss, or hard-stop on good output
- **HIGH** — produces systematically wrong validation results; likely affects every run
- **MEDIUM** — incorrect behavior in a subset of cases; occasionally wrong results
- **LOW** — misleading contracts, dead code, or cosmetic inconsistencies with no runtime impact

---

### Issue 1 — autoFix runs unreachably after throw for needs_revision/failed

**File:** `apps/worker/src/jobs/agents/agent9-run.ts`
**Severity: CRITICAL**

The validation status branching throws immediately for `needs_revision` or `failed`. The `autoFix` block is placed after the `else { ... throw }` arm, so it is structurally unreachable for any story that does not have status `passed` or `needs_review`:

```
validate() → status = needs_revision → throw     ← autoFix never reached
validate() → status = needs_review   → (no throw) → autoFix runs ← only path where it executes
```

Encoding artifacts produce `major` errors. Six or more major errors → `needs_revision`. So a story with ≥6 encoding artifacts throws before the fix that would have cleared them can run. The correct behavior is to apply `autoFix` before the initial validation so that encoding-only `needs_revision` outcomes are prevented, or immediately after validation and before the status decision is made.

**Recommended fix:** Apply `autoFix` to `storyForValidation` immediately after construction (before calling `validate()`), then propagate the fixed text back into `prose.chapters[i].paragraphs`. Re-validate once from the fixed story. This ensures the status decision is never based on encoding artifacts that were trivially correctable.

---

### Issue 2 — Stale `validationErrorTypes` causes spurious hard-stop after successful autoFix

**File:** `apps/worker/src/jobs/agents/agent9-run.ts`
**Severity: CRITICAL**

`validationErrorTypes` is built from `validationReport.errors` immediately after the first `validate()` call. The report is never updated after `autoFix()` runs. At the Release Gate, the hard-stop condition for illegal characters is:

```typescript
if (proseContainsIllegalControlChars || validationErrorTypes.has("illegal_character")) {
```

`proseContainsIllegalControlChars` correctly re-scans the current (post-fix) prose. But `validationErrorTypes.has("illegal_character")` is stale — it reflects the pre-fix state. If a story has a `needs_review` status (1–5 major errors) that include an `illegal_character` error, `autoFix` correctly strips the character from `prose.chapters`, `proseContainsIllegalControlChars` evaluates to false — but `validationErrorTypes.has("illegal_character")` is still true, triggering a hard-stop for a problem that no longer exists in the output.

The same pattern is not present for `proseContainsMojibake` (that check looks only at current prose, not `validationErrorTypes`), so the mojibake check is clean. Only the `illegal_character` OR branch is stale.

**Recommended fix:** Remove the `|| validationErrorTypes.has("illegal_character")` OR clause. The `proseContainsIllegalControlChars` re-scan on current prose is sufficient and accurate.

---

### Issue 3 — Dead ternary: all setting-drift errors are always `'critical'`

**File:** `packages/story-validation/src/chapter-validator.ts` — `checkSettingFidelity()`
**Severity: HIGH**

```typescript
const severity = chapter.chapterNumber <= 5 ? 'critical' : 'critical';
```

Both branches of the ternary are identical. The clearly intended expression was `'critical' : 'major'` — early chapters (≤5) get critical to prevent bad continuity propagation; later chapters get major (still a hard validation error via the caller's filter, but not the abort-the-pipeline critical level). As written, setting drift in chapter 18 of a 20-chapter story triggers a critical issue, which marks `isValid = false` and triggers a retry even though the story is nearly complete. This causes retry churn and unnecessary aborts on late chapters.

**Recommended fix:** `'critical' : 'major'`.

---

### Issue 4 — `settingPatterns` dictionary duplicated but inconsistent across two methods

**File:** `packages/story-validation/src/chapter-validator.ts`
**Severity: HIGH**

The `settingPatterns` dictionary is defined independently inside both `checkSettingFidelity` and `checkSceneGrounding`. The two copies have diverged for multiple location types:

| Location type | `checkSettingFidelity` terms | `checkSceneGrounding` terms |
|---|---|---|
| `country_estate` | `estate, manor, countryside, grounds, drawing room` | `estate, manor, grounds, drawing room, study, library` |
| `ocean_liner` | `ship, deck, cabin, stateroom, dining saloon, liner` | `ship, deck, cabin, stateroom, saloon, gangway` |
| `scottish_castle` | `castle, scotland, highland, keep, battlements` | `castle, highland, keep, battlements, great hall` |
| `cotswold_village` | `village, cotswold, cottage, high street` | `village, cottage, lane, high street, green` |

A chapter on an ocean liner will be tested against different terms depending on whether it is failing `checkSettingFidelity` (drift detection) or `checkSceneGrounding` (anchor detection). This can produce contradictory outcomes: the drift check finds no conflict terms, but the grounding check finds no anchor terms, because the anchor terms include words the drift check doesn't know about. Maintenance of either copy will silently leave the other out of sync.

**Recommended fix:** Extract a single module-level `SETTING_PATTERNS` constant and reference it from both methods.

---

### Issue 5 — Paragraph-opener repetition triggers on normal high-frequency stop-words

**File:** `packages/story-validation/src/chapter-validator.ts` — `checkProseQuality()`
**Severity: HIGH**

```typescript
const firstWords = chapter.paragraphs
  .map(p => p.trim().split(/\s+/)[0])
  .filter(w => w);
const repetitive = Object.entries(wordCounts).filter(([_, count]) => count > 3);
```

No stop-word filter is applied. Words like `"The"`, `"He"`, `"She"`, `"It"`, `"A"`, `"His"`, `"Her"` are among the most common paragraph-opening words in literary prose. A chapter of 8+ paragraphs has a near-certain chance of starting at least 4 with `"The"`. This fires a moderate warning on virtually every chapter, flooding the retry feedback with noise that pulls the model toward artificial opener variation at the expense of natural prose rhythm. The warning is essentially always-on and therefore conveys no information.

**Recommended fix:** Add a stop-word exclusion set before the > 3 count check:
```typescript
const OPENER_STOP_WORDS = new Set(['the', 'a', 'an', 'he', 'she', 'it', 'they', 'his', 'her', 'its', 'their', 'i', 'we', 'you', 'but', 'and', 'so', 'then', 'as', 'at', 'in', 'on', 'by']);
const repetitive = Object.entries(wordCounts)
  .filter(([word, count]) => count > 3 && !OPENER_STOP_WORDS.has(word.toLowerCase()));
```

---

### Issue 6 — `ChapterValidator.isValid` contract is broken

**File:** `packages/story-validation/src/chapter-validator.ts` — `validateChapter()`
**Severity: MEDIUM**

`isValid` is set to `criticalIssues.length === 0` — so it is `true` when there are only major issues. But every caller (in `agent9-prose.ts`) filters for `severity === 'critical' || severity === 'major'` when deciding whether to add issues to `hardErrors[]`. The result is that `isValid = true` while the caller simultaneously treats the chapter as having hard errors that require retry. This makes the `isValid` field actively misleading: a consumer checking `contentValidation.isValid` as a quick pass/fail test would conclude the chapter is valid when it is not.

**Recommended fix:** Either align `isValid` to match the critical+major gate that all callers already use:
```typescript
const isValid = issues.filter(i => i.severity === 'critical' || i.severity === 'major').length === 0;
```
Or rename the field to `noCriticalIssues` to make its actual meaning explicit.

---

### Issue 7 — `detectNameSwitches` is permanently hardcoded to three specific detector names

**File:** `packages/story-validation/src/character-validator.ts` — `detectNameSwitches()`
**Severity: MEDIUM**

```typescript
const detectiveNames = ['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective'];
```

This method only detects inconsistency among three hardcoded detective surnames. It produces no output for:
- Any detective with a different name (the actual protagonist name varies per run)
- Any Inspector, Constable, Sergeant, or Captain character
- Any non-investigator character whose name is used inconsistently across scenes

The method was clearly a prototype that was never generalized. The `manifest` parameter is accepted but never used inside the function body. For the vast majority of stories, this check silently passes even when the detective is called "Inspector Marlowe" in chapters 1–8 and "Inspector Harlow" in chapters 9–20 — a genuine critical continuity issue.

**Recommended fix:** Replace the hardcoded list with a cross-scene consistency scan over all characters in `manifest` — for each canonical character, collect all name-variant references found across all scenes and flag when more than one non-alias variant is observed.

---

### Issue 8 — `SuspectClosureValidator` uses case-sensitive `text.includes(name)` for all name matching

**File:** `packages/story-validation/src/suspect-closure-validator.ts`
**Severity: MEDIUM**

```typescript
const hasClosure = story.scenes.some((scene) => {
  const text = scene.text || '';
  return text.includes(suspect) && ELIMINATION_TERMS.test(text) && EVIDENCE_TERMS.test(text);
});
```

And in the LLM fallback loop:
```typescript
for (const scene of story.scenes) {
  if (scene.text?.includes(suspect)) {
```

`String.includes` is a substring, case-sensitive exact match against the full canonical name (e.g. `"Frederick Pemberton"`). In typical mystery prose the culprit and suspects are frequently referred to by surname only (`"Pemberton"`) or title-plus-surname (`"Lord Pemberton"`). None of these would match `"Frederick Pemberton"`.

This means:
1. Phase 1 (regex) misses all surname-only references — the scene containing the elimination argument is never found.
2. Phase 2 (LLM fallback) also skips those scenes because the scene-filter guard uses the same `includes(name)` check.

The validator can produce false `suspect_closure_missing` (major) and `culprit_evidence_chain_missing` (critical) errors for stories that correctly eliminate suspects and name the culprit, simply because the scene uses the character's surname rather than their full name.

`CharacterConsistencyValidator` solves exactly this problem via `aliasToCanonical` + `containsAnyLabel()`. `SuspectClosureValidator` does not, despite being subject to the same prose reference patterns.

**Recommended fix:** Replicate the label-matching approach. Generate surname + full name variants (and any aliases from CML) for each suspect/culprit, and test for any variant's presence using word-boundary regex rather than exact substring inclusion.

---

### Issue 9 — `buildConsistencyReport.overallStatus` is contaminated by non-prose-consistency errors

**File:** `packages/story-validation/src/pipeline.ts` — `buildConsistencyReport()`
**Severity: LOW**

`overallStatus` is computed from the full `allErrors[]` array passed in from all 9 validators:

```typescript
const criticalOrMajor = errors.filter(e => e.severity === 'critical' || e.severity === 'major').length;
const overallStatus = criticalOrMajor > 0 ? 'fail' : ...
```

`ProseConsistencyReport` is conceptually scoped to the four checks run by `ProseConsistencyValidator` (locked facts, pronoun drift, opening styles, context leakage). But because `buildConsistencyReport` receives the full error list, a `pronoun_gender_mismatch` (critical) from `CharacterConsistencyValidator`, or a `missing_discriminating_test` (critical) from `DiscriminatingTestValidator`, will set `overallStatus = 'fail'` on a `ProseConsistencyReport` that otherwise has zero violations in its four component fields. This means the field is not interpretable in isolation: `overallStatus = 'fail'` with all counts at zero is an inconsistent state that confuses downstream consumers.

**Recommended fix:** Restrict the `overallStatus` computation to only the errors whose types are relevant to prose consistency: `locked_fact_contradicted`, `locked_fact_missing_value`, `pronoun_drift`, `opening_style_repetition`, `context_leakage`, `context_leakage_suspected`.

---

### Issue 10 — `postRepairValidationSummary` is never updated after autoFix

**File:** `apps/worker/src/jobs/agents/agent9-run.ts`
**Severity: LOW**

```typescript
const preRepairValidationSummary = { ...validationReport.summary };
let postRepairValidationSummary = { ...validationReport.summary };  // identical copy
```

`postRepairValidationSummary` is initialized to the same object as `preRepairValidationSummary` and is never subsequently updated. The Release Gate diagnostic record logs both under `validation_snapshots.pre_repair` and `validation_snapshots.post_repair`, but they are always identical. The intent was clearly to hold a post-fix re-validation summary for comparison, but the re-validation was never implemented. Any analysis of these diagnostics comparing pre/post summaries to measure the impact of autoFix will always show no change.

**Recommended fix:** After applying encoding fixes from `autoFix()`, re-validate `storyForValidation` (or the corresponding updated scenes) and assign the resulting summary to `postRepairValidationSummary` before the Release Gate runs.

---

### Issue 11 — DT outer guard at 70% is inconsistent with inner guard at 85%

**File:** `packages/story-validation/src/chapter-validator.ts` — `validateChapter()` and `checkDiscriminatingTest()`
**Severity: LOW**

```typescript
// In validateChapter():
if (chapter.chapterNumber >= Math.ceil(total * 0.70)) {
  const testIssues = this.checkDiscriminatingTest(chapter, cmlCase, total);
  ...
// In checkDiscriminatingTest():
if (chapter.chapterNumber >= Math.ceil(totalChapters * 0.85) && foundTerms.length === 0) {
```

For a 20-chapter story, the outer guard activates at chapter 14, but the inner guard returns nothing for chapters 14–16. Chapters 14, 15, and 16 call `checkDiscriminatingTest`, build the `keyTerms` list, and search the chapter text — then the inner condition evaluates to false and returns `[]` unconditionally. No errors can be produced for these chapters regardless of content. Beyond the wasted computation, the two thresholds are a maintenance trap: the relevant threshold for whether the DT check is live for a given chapter is the inner value (85%), but the outer value (70%) gives a misleading impression.

**Recommended fix:** Change the outer guard to `Math.ceil(total * 0.85)` to match the inner guard, or remove the inner threshold duplication entirely.

---

### Summary table

| # | File | Severity | Description |
|---|---|---|---|
| 1 | `agent9-run.ts` | CRITICAL | autoFix unreachable for needs_revision/failed — encoding-only failures cannot self-correct |
| 2 | `agent9-run.ts` | CRITICAL | Stale `validationErrorTypes` causes illegal_character hard-stop after autoFix cleared it |
| 3 | `chapter-validator.ts` | HIGH | Dead ternary `'critical' : 'critical'` — all setting drift is critical regardless of chapter position |
| 4 | `chapter-validator.ts` | HIGH | `settingPatterns` dict duplicated and inconsistent across `checkSettingFidelity` / `checkSceneGrounding` |
| 5 | `chapter-validator.ts` | HIGH | Paragraph-opener check fires on stop-words — virtually every chapter triggers a false moderate warning |
| 6 | `chapter-validator.ts` | MEDIUM | `isValid = true` even when major issues present — broken contract vs caller behavior |
| 7 | `character-validator.ts` | MEDIUM | `detectNameSwitches` hardcoded to 3 detective surnames — all other characters silently pass |
| 8 | `suspect-closure-validator.ts` | MEDIUM | Case-sensitive substring name match — surname-only prose references produce false critical/major errors |
| 9 | `pipeline.ts` | LOW | `buildConsistencyReport.overallStatus` contaminated by errors from non-prose-consistency validators |
| 10 | `agent9-run.ts` | LOW | `postRepairValidationSummary` never updated — pre/post diagnostic snapshots always identical |
| 11 | `chapter-validator.ts` | LOW | DT outer guard (70%) inconsistent with inner guard (85%) — wasteful and misleading |
