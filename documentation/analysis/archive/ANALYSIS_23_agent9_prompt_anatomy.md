# ANALYSIS_23: Agent 9 Prompt Anatomy — Exact Content and Data Sources

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Entry point:** `buildProsePrompt(inputs: ProseGenerationInputs, scenesOverride?, chapterStart?, chapterSummaries?)`  
**Returns:** `{ system, developer, user, messages, sectionSizes }`  
**LLM call shape:** 3 messages — `system`, `user` (main), `user` (checklist)

---

## 1. Message Structure

```So
messages[0] role: system  — composedSystem  (baseSystem + 17 context blocks + budget line + developer)
messages[1] role: user    — user             (obligation block + timeline + case overview + scenes JSON)
messages[2] role: user    — checklist        (pre-submit verification list)
```

The composed system is assembled by `applyPromptBudgeting` and has this internal order:

```
<baseSystem>
<17 context blocks in priority order — see §3>
PROMPT BUDGET SUMMARY: budget=6200 tokens; ...
<developer / output schema>
```

---

## 2. Fixed Sections

### 2.1 `system` (base) — `buildProsePrompt` lines ~1645–1700
A hardcoded string containing the persona declaration, absolute rules, and per-story variable injections.

| Element | Source |
|---------|--------|
| "You are an expert prose writer…" and all static rules | Hardcoded in `buildProsePrompt` |
| ⛔ ABSOLUTE RULE — CHARACTER NAMES (full cast list ×2) | `inputs.cast.characters[].name` |
| MORAL COMPLEXITY REQUIREMENT (story-specific) | `inputs.moralAmbiguityNote` (string, optional) |
| VICTIM IDENTITY rule | `resolveVictimName(inputs.cast)` → `cast.characters[]` where `role === 'victim'` or `roleArchetype.includes('victim')` |
| ⚠️ AMATEUR DETECTIVE STORY warning | Only present when `inputs.detectiveType === 'amateur'` |

### 2.2 `developer` / output schema — `buildProsePrompt` lines ~1875–1930
Defines the JSON output schema and per-chapter writing standards.

| Element | Source |
|---------|--------|
| JSON schema (status / tone / chapters / cast / note) | Hardcoded |
| `audit` self-check field injection | Applied via `developerWithAudit.replace(...)` — hardcoded pattern |
| Chapter count (`N total`) | `scenes.length` (from `scenesOverride` or `outline.acts[].scenes[]`) |
| `chapterStart` | Caller-supplied (defaults to 1) |
| Per-chapter paragraph/word guidance | Computed from `getGenerationParams().agent9_prose.word_policy` → `generation-params.yaml` `preferred_chapter_words[targetLength]` |
| Narrative style | `inputs.narrativeStyle` (default `'classic'`) |
| Target length label | `inputs.targetLength` (default `'medium'`) |
| Fair-play clue timing guardrails ×4 | Hardcoded |
| `inputs.qualityGuardrails` items | `inputs.qualityGuardrails` (`string[]`, optional) |
| `buildProseRequirements(caseData, scenes)` block | `CML.prose_requirements.*` — see §2.3 |
| `wordCountContract` (6 lines) | `getChapterWordTargets(targetLength)` → config; hardcoded contract text |

### 2.3 `buildProseRequirements(caseData, scenesForChapter)` — lines ~975–1050
Appended at the end of `developer`. Only emits content when `CML.prose_requirements` is non-empty.

| Output section | CML field |
|----------------|-----------|
| Discriminating test scene | `prose_requirements.discriminating_test_scene` (act_number, scene_number, required_elements, test_type, outcome) |
| Suspect clearance scenes | `prose_requirements.suspect_clearance_scenes[]` (suspect_name, act_number, scene_number, clearance_method, supporting_clues) |
| Culprit revelation scene | `prose_requirements.culprit_revelation_scene` (act_number, scene_number, revelation_method) + cross-ref clues from `clue_to_scene_mapping` |
| Identity protection rules | `prose_requirements.identity_rules[]` (character_name, revealed_in_act, before_reveal_reference, after_reveal_reference) |
| Clue placement for this batch | `prose_requirements.clue_to_scene_mapping[]` filtered to scenes in this batch (clue_id, act_number, scene_number, delivery_method) |
| Validation consequence warning | Hardcoded |

---

## 3. The 17 Context Blocks

These are assembled by `buildPromptContextBlocks` and ranked `critical / high / medium / optional`. Under token pressure the `applyPromptBudgeting` function drops `optional` → `medium` → `high` blocks in that order; `critical` blocks are never dropped.

Total budget: **6,200 tokens**. Per-block caps (where set):

| Block key | Cap | Priority |
|-----------|-----|----------|
| `pronoun_accuracy` | 700 | critical |
| `character_personality` | 900 | high |
| `location_profiles` | 1,000 | medium |
| `temporal_context` | 850 | medium |
| `continuity_context` | 500 | medium |
| `humour_guide` | 850 | optional |
| `craft_guide` | 850 | optional |
| All other blocks | uncapped | varies |

### 3.1 `pronoun_accuracy` — `buildPronounAccuracyBlock(cast)` lines ~1390–1440

Priority: **critical** | Token cap: **700**

Emitted only for cast members with `gender === 'male'`, `'female'`, or `'non-binary'`. Characters with unknown/absent gender are deliberately excluded.

| Content | Source |
|---------|--------|
| Per-character pronoun table (subject/object/possessive/reflexive) | `inputs.cast.characters[].name` + `.gender` |
| 8 numbered rules (pronouns, disambiguation, reflexives, dialogue attribution, cleft clauses, singular they) | Hardcoded |
| MANDATORY PRE-OUTPUT CHECK paragraph | Hardcoded |

Pronoun sets emitted: `he/him/his/himself` (male), `she/her/her/herself` (female), `they/them/their/themselves` (non-binary).

### 3.2 `character_consistency` — inline in `buildProsePrompt` lines ~1725–1740

Priority: **critical** | No cap

| Content | Source |
|---------|--------|
| Full cast name list ×2 | `inputs.cast.characters[].name` |
| Per-character role list | `inputs.cast.characters[].role` |
| No-invented-characters rule + examples | Hardcoded |

### 3.3 `world_document` — `buildWorldBriefBlock(worldDoc, chapterIndex, totalChapters, characterPronouns)` lines ~945–995

Priority: **high** | No cap

Only present when `inputs.worldDocument` is supplied. Supersedes raw character/location/temporal blocks for richer context. The block is position-aware: `chapterIndex / totalChapters` determines which emotional arc segment and whether the break-moment or reveal-implications sections are emitted.

| Section | Source |
|---------|--------|
| `## Era:` + eraRegister + emotionalRegister + physicalConstraints | `worldDocument.historicalMoment.*` |
| `## Season Lock` (mandatory, derives season from specificDate) | `worldDocument.historicalMoment.specificDate` → `MONTH_TO_SEASON` lookup |
| `## Story Theme` | `worldDocument.storyTheme` |
| `## Emotional register at this point` | `worldDocument.storyEmotionalArc.turningPoints[]` — position matched to `arcPosition` computed from `chapterIndex/totalChapters` |
| `## Character Voices` — one entry per character | `worldDocument.characterVoiceSketches[]` (voiceDescription, fragments[register∈{comfortable,evasive}], humourNote) |
| Inline pronoun label `(she/her/her/herself)` next to each character name | `inputs.narrativeState?.characterPronouns` map |
| `## Character Break Moment` | `worldDocument.breakMoment` — only when `0.6 ≤ chapterIndex/totalChapters ≤ 0.85` |
| `## Reveal Implications` | `worldDocument.revealImplications` — only when `chapterIndex ≥ floor(totalChapters * 0.75)` |

### 3.4 `character_personality` — inline in `buildProsePrompt` lines ~1745–1810

Priority: **high** | Token cap: **900**

Only present when `inputs.characterProfiles.profiles` is a non-empty array.

| Content | Source |
|---------|--------|
| Per-character persona block (public, hidden, stakes, humour, voice, conflict, personal stake) | `inputs.characterProfiles.profiles[].*` |
| `HUMOUR_STYLE_DESCRIPTIONS` mapping | Hardcoded dictionary inside `buildProsePrompt` |
| 9 writing guidance bullets | Hardcoded |

### 3.5 `physical_plausibility` — inline in `buildProsePrompt` lines ~1820–1835

Priority: **high** | No cap

Fully hardcoded. No runtime data injected. Describes permitted vs forbidden physical evidence by environment type (interior / exterior calm / exterior storm).

### 3.6 `era_authenticity` — inline in `buildProsePrompt` lines ~1837–1844

Priority: **high** | No cap

Only present when `CML.meta.era.decade` is resolved to a non-empty string.

| Content | Source |
|---------|--------|
| Era label | `CML.meta.era.decade` |
| Forbidden terms list (era-conditional) | Hardcoded, currently only `'1950s'` has a specific list; other eras get a generic message |
| Required period markers | Hardcoded (partially era-conditional) |

### 3.7 `location_profiles` — inline in `buildProsePrompt` lines ~1852–1935

Priority: **medium** | Token cap: **1,000**

Only present when `inputs.locationProfiles` is supplied. Raw `paragraphs` arrays are stripped first by `stripLocationParagraphs` to prevent verbatim prose leakage.

| Content | Source |
|---------|--------|
| Primary location name, place, country, summary | `inputs.locationProfiles.primary.*` |
| Key locations list (name, type, purpose) | `inputs.locationProfiles.keyLocations[].*` |
| Atmosphere mood and weather | `inputs.locationProfiles.atmosphere.mood / .weather` |
| Sensory palette (sights, sounds, smells, tactile per location, max 3 locations) | `inputs.locationProfiles.keyLocations[0..2].sensoryDetails.*` |
| Anti-leakage instruction and sensory writing techniques | Hardcoded |
| Per-chapter sensory palette hints | `inputs.locationProfiles.keyLocations[].sensoryVariants[]` — matched to each scene by `timeOfDay` + `weather`; falls back to `chapterNum % variants.length` cycling |

### 3.8 `temporal_context` — inline in `buildProsePrompt` lines ~1937–1985

Priority: **medium** | Token cap: **850**

Only present when `inputs.temporalContext` is supplied.

| Content | Source |
|---------|--------|
| Date string (month + year) | `inputs.temporalContext.specificDate.month` + `.year` |
| Season label and weather patterns | `inputs.temporalContext.seasonal.season / .weather[]` |
| Season lock + forbidden season list | `deriveTemporalSeasonLock(inputs.temporalContext)` → `MONTH_TO_SEASON[month]` |
| Men's and women's fashion (formal, casual, accessories) | `inputs.temporalContext.fashion.mensWear.* / womensWear.*` |
| Cultural entertainment (music, films) | `inputs.temporalContext.cultural.entertainment.popularMusic[] / .films[]` |
| Prices | `inputs.temporalContext.cultural.dailyLife.typicalPrices[]` |
| Major events | `inputs.temporalContext.currentAffairs.majorEvents[]` |
| Atmospheric details | `inputs.temporalContext.atmosphericDetails[]` |
| Seasonal exclusive allow-list + forbidden words | `getSeasonAllowList(lockedSeason)` → hardcoded per-season string |
| Fashion and cultural guidance | Hardcoded |

### 3.9 `locked_facts` — inline in `buildProsePrompt` lines ~2000–2010

Priority: **critical** | No cap

Only present when `inputs.lockedFacts` is non-empty.

| Content | Source |
|---------|--------|
| Per-fact "if mentioned, use exactly: …" directive | `inputs.lockedFacts[]` (`id`, `value`, `description`) — sourced from `Agent3b.HardLogicDeviceIdea.lockedFacts[]` |

### 3.10 `clue_descriptions` — `buildClueDescriptionBlock(scenes, clueDistribution, cmlCase)` lines ~1295–1345

Priority: **critical** | No cap

| Content | Source |
|---------|--------|
| Per-clue block (description, category, criticality, supportsInferenceStep, pointsTo) | `inputs.clueDistribution.clues[]` (Agent 5 output) — filtered to clue IDs referenced in scenes' `cluesRevealed[]` |
| Mapping-only clue lines (when Agent 5 has no entry but mapping has delivery_method) | `CML.prose_requirements.clue_to_scene_mapping[]` filtered to current scenes |

### 3.11 `narrative_state` — `buildNSDBlock(inputs.narrativeState)` lines ~1380–1395

Priority: **critical** | No cap

Only present when `inputs.narrativeState` is supplied. This is the live NarrativeState threaded through batches.

| Content | Source |
|---------|--------|
| LOCKED FACTS (verbatim values) | `inputs.narrativeState.lockedFacts[]` |
| CHARACTER PRONOUNS | `inputs.narrativeState.characterPronouns` (Record<name, pronouns>) |
| CLUES ALREADY REVEALED TO READER | `inputs.narrativeState.cluesRevealedToReader[]` |

### 3.12 `continuity_context` — `buildContinuityContext(chapterSummaries, chapterStart)` lines ~2270–2325

Priority: **medium** | Token cap: **500**

Only present when `chapterSummaries.length > 0` (chapter 2+). Populated by `extractChapterSummary` after each committed batch.

| Content | Source |
|---------|--------|
| Aggregated character names used in all prior chapters | `ChapterSummary[].charactersPresent[]` |
| Aggregated setting vocabulary | `ChapterSummary[].settingTerms[]` |
| Last 3 chapter titles and first key event | `ChapterSummary[].title / .keyEvents[0]` |

`extractChapterSummary` populates these by: (a) regex-matching cast names against chapter text; (b) pattern-matching room/location vocabulary; (c) extracting first sentences of first 3 paragraphs.

### 3.13 `discriminating_test` — `buildDiscriminatingTestChecklist(caseData, chapterRange, outline, totalScenes)` lines ~2410–2535

Priority: **critical** | No cap

Only injected when `chapterEnd ≥ ceil(totalScenes * 0.70)` (late-story chapters). Silent if the CML has no `discriminating_test.design`.

| Content | Source |
|---------|--------|
| Test type + description | `CML.discriminating_test.design.test_type / .description` |
| Evidence clue references with act/scene location | `CML.discriminating_test.evidence_clues[]` + `extractClueLocations()` (CML clue_registry × outline scenes) |
| Test execution checklist (type-conditional) | Hardcoded per `test_type` (timing_test, physical_test, knowledge_test, access_test, or generic) |
| Suspect elimination list | `CML.discriminating_test.eliminated_suspects[]` |
| Detective reasoning + prose integration requirements | Hardcoded |

### 3.14 `humour_guide` — inline in `buildProsePrompt` lines ~2020–2065

Priority: **optional** | Token cap: **850**

Only present when `inputs.writingGuides?.humour` is a non-empty string. The humour guide text itself is **entirely hardcoded** — `inputs.writingGuides.humour` is treated as a boolean gate only (its string value is not used).

### 3.15 `craft_guide` — inline in `buildProsePrompt` lines ~2068–2095

Priority: **optional** | Token cap: **850**

Only present when `inputs.writingGuides?.craft` is a non-empty string. Identically structured to the humour guide — the string value is a gate; all block text is hardcoded.

### 3.16 `scene_grounding` — `buildSceneGroundingChecklist(scenes, locationProfiles, chapterStart)` lines ~2350–2395

Priority: **critical** | No cap

| Content | Source |
|---------|--------|
| Per-chapter anchor directive (`"anchor opening in "X"; include 2+ sensory cues…"`) | Scene setting from `scene.setting.location` or outline `scene.location`; profile names from `inputs.locationProfiles.primary.name` + `.keyLocations[].name` |
| Known location anchors summary line | `inputs.locationProfiles.*` |

### 3.17 `provisional_scoring_feedback` — `formatProvisionalScoringFeedbackBlock(inputs.provisionalScoringFeedback)` lines ~1457–1470

Priority: **critical** | No cap

Only present when `inputs.provisionalScoringFeedback` is non-empty. Last 2 items are used.

| Content | Source |
|---------|--------|
| Per-chapter score, deficits, required corrections | `inputs.provisionalScoringFeedback[]` (fromChapter, score, deficits[], directives[]) — generated by `buildProvisionalChapterScore` after each committed batch |

---

## 4. `user` Message (messages[1])

Assembled in `buildProsePrompt` lines ~2070–2080 as a single concatenated string.

| Section | Source / Builder |
|---------|-----------------|
| `CHAPTER OBLIGATION CONTRACT` | `buildChapterObligationBlock(scenes, chapterStart, cmlCase, lockedFacts, temporalLock, clueDistribution)` — see §4.1 |
| `FROZEN TIMELINE STATE` | `buildTimelineStateBlock(temporalLock, lockedFacts, cmlCase)` — see §4.2 |
| `# Case Overview` | `buildContextSummary(inputs.caseData, inputs.cast)` — see §4.3 |
| `Outline scenes:` + JSON | `sanitizeScenesCharacters(scenes, castNames)` with `estimatedWordCount` bumped to `max(existing, chapterTargetWords)` |

### 4.1 `buildChapterObligationBlock` — lines ~1155–1255

One entry per scene. Per-chapter:

| Section | Source |
|---------|--------|
| Location anchor | `scene.setting.location` or `scene.location` |
| CLUE OBLIGATIONS — if distribution entry exists | `clueDistribution.clues` (description, pointsTo, placement); early-placement gets mandatory two-paragraph structure |
| CLUE OBLIGATIONS — no distribution entry (fallback) | `CML.prose_requirements.clue_to_scene_mapping[].delivery_method`; `act_number === 1` → early placement flag |
| Suspect clearance required | `CML.prose_requirements.suspect_clearance_scenes[]` filtered to this act/scene |
| Discriminating test required flag | `CML.prose_requirements.discriminating_test_scene` (act_number, scene_number) |
| Locked fact phrase obligations | `inputs.lockedFacts[]` (description, value) — up to 8 |
| Seasonal allow-list / forbidden words | `deriveTemporalSeasonLock(inputs.temporalContext)` |

### 4.2 `buildTimelineStateBlock` — lines ~1125–1155

| Section | Source |
|---------|--------|
| Timeline anchor sentence | `deriveTemporalSeasonLock(inputs.temporalContext)` (month, season) |
| Established timeline facts | `CML.constraint_space.time.anchors[]` (or `constraint_space.timeline.anchors[]`) — up to 5 |
| Time-phrase locked facts | `inputs.lockedFacts[]` filtered by time/clock regex — up to 6 |

### 4.3 `buildContextSummary` — lines ~920–960

| Field | Source |
|-------|--------|
| Title | `CML.meta.title` |
| Era | `CML.meta.era.decade` |
| Setting | `CML.meta.setting.location` |
| Crime | `CML.meta.crime_class.category / .subtype` |
| Culprit | `CML.culpability.culprits[]` |
| Victim | `resolveVictimName(inputs.cast)` → cast role lookup |
| False assumption | `CML.false_assumption.statement` |
| Cast | `inputs.cast.characters[].name` |
| Setting Lock rule | Hardcoded, interpolates location string |

---

## 5. Checklist Message (messages[2])

A bullet list generated inline at the end of `buildProsePrompt` lines ~2095–2115. It is a **second user message** appended after the main user prompt.

| Item | Source |
|------|--------|
| Word floor and target | `chapterWordTargets.hardFloorWords` + `chapterTargetWords` (= preferredWords + 200) from config |
| Locked phrase verbatim reminder | Hardcoded (always present) |
| Seasonal allow-list and forbidden words | `deriveTemporalSeasonLock(inputs.temporalContext)` — only if temporalLock is defined |
| Per-chapter early-clue placement checkboxes | `inputs.clueDistribution.clues[]` where `placement === 'early'`; fallback to `CML.prose_requirements.clue_to_scene_mapping[]` where `act_number === 1` and `delivery_method` present |
| "Return valid JSON only" | Hardcoded |

---

## 6. Underflow Expansion Prompt (separate LLM call)

Function: `attemptUnderflowExpansion(...)` — lines ~2920–3000

Called post-validation when a committed chapter is below the hard floor or preferred target. This is a **minimal two-message call** (no 17-block budgeting).

| Part | Content | Source |
|------|---------|--------|
| System | "You are a surgical prose revision assistant…" + anti-leakage rule | Hardcoded |
| System | Season lock line | `temporalLock` (month, season) → `getSeasonAllowList` |
| System | Pronoun lock (compact `Name: he/him` list) | `cast[].name` + `.gender` |
| User | Word count deficit and expansion target | `chapterWordTargets.*` from config |
| User | Required clue obligations with description and placement note | `ledgerEntry.clueObligationContext[]` (built from clueDistribution + CML mapping) |
| User | Scene summary and purpose | `scene.summary`, `scene.purpose` from outline |
| User | Current chapter text (full) | The committed `ProseChapter.paragraphs.join('\n\n')` |
| Config | `temperature`, `max_tokens` | `generation-params.yaml` `agent9_prose.underflow_expansion.*` |

---

## 7. Retry Prompt (`buildEnhancedRetryFeedback`)

Function: lines ~2620–2830. Called when a batch fails validation and the driver loop retries.

The retry is injected as an **additional user message** prepended to a fresh `buildProsePrompt` call.

| Error category | Filter criterion | Feedback style |
|----------------|-----------------|----------------|
| `clueValidationErrors` | message contains `clue evidence`, `clue obligation`, `clue visibility`, or `missing required clue` | Detailed structure; see `buildRetryMicroPromptDirectives` |
| `pronounErrors` | `pronoun_gender_mismatch` or `incorrect pronoun` pattern | Per-character FIX directive with gender label + wrong tokens found |
| `characterErrors` | `character` or `name` (after excluding above) | Full cast list + name-hallucination solution |
| `settingErrors` | `setting` or `location` | Location-type-specific solution from `CML.meta.setting.location_type` |
| `testErrors` | `discriminating test` | Reasoning, explicitness, clue-reference checklist |
| `wordCountErrors` | `/word count below/i` | Explicit word target from regex-extracted current/target counts |
| `qualityErrors` | `paragraph` or `chapter` | Generic paragraph-variety guidance |
| `otherErrors` | Anything remaining | Verbatim error list only |

### Clue repair escalation (`buildRetryMicroPromptDirectives`)

| Attempt | Absent-clue instruction |
|---------|------------------------|
| 1–2 | Two-paragraph near-chapter-start structure with sensory observation + inference |
| 3 | Mandatory two-paragraph structure labelled A/B; must be a present-action beat, not recalled memory |
| 4+ | Mandatory WITHIN FIRST 300 WORDS block; rebuild chapter from scratch; any prior wording discarded |

Late-placed clue repairs (evidence present but too late) always emit the same directive regardless of attempt: MOVE existing paragraphs before the 25% mark; add inference paragraph immediately after.

---

## 8. Data-Source Summary Table

| Input field | What it feeds |
|-------------|--------------|
| `inputs.caseData` (CML) | `buildContextSummary`, `buildProseRequirements`, `buildChapterObligationBlock`, `buildDiscriminatingTestChecklist`, `buildTimelineStateBlock`, `era_authenticity`, `character_consistency` |
| `inputs.outline` | Scene list for iteration, `totalScenes`, `buildDiscriminatingTestChecklist` clue location extraction |
| `inputs.cast` | `pronoun_accuracy`, `character_consistency`, `character_personality` (gate), `buildContextSummary`, victim name resolution, underflow pronoun lock |
| `inputs.characterProfiles.profiles[]` | `character_personality` block content |
| `inputs.locationProfiles` | `location_profiles` block, `scene_grounding` checklist, sensory palette hints |
| `inputs.temporalContext` | `temporal_context` block, season lock used in `buildChapterObligationBlock`, `buildTimelineStateBlock`, checklist, underflow prompt |
| `inputs.worldDocument` | `world_document` block (supersedes raw temporal/location/personality when present) |
| `inputs.lockedFacts[]` | `locked_facts` block, `buildChapterObligationBlock`, `buildTimelineStateBlock`, underflow clue obligations |
| `inputs.clueDistribution` | `clue_descriptions` block, `buildChapterObligationBlock` (primary), checklist early-clue items, underflow clue obligations, `buildChapterRequirementLedger` (for validation) |
| `inputs.narrativeState` | `narrative_state` block, `world_document` pronoun label injection |
| `inputs.writingGuides.humour` | Gates `humour_guide` block (text is hardcoded) |
| `inputs.writingGuides.craft` | Gates `craft_guide` block (text is hardcoded) |
| `inputs.qualityGuardrails[]` | Appended to fair-play guardrails in `developer` |
| `inputs.moralAmbiguityNote` | Injected into `system` MORAL COMPLEXITY REQUIREMENT |
| `inputs.detectiveType` | Gates amateur-detective warning in `system` |
| `inputs.provisionalScoringFeedback[]` | `provisional_scoring_feedback` block |
| `chapterSummaries[]` | `continuity_context` block |
| `generation-params.yaml` `agent9_prose.*` | Word floors/targets, style-linter config, underflow expansion config, per-block token caps |

---

## 9. Budget Management

```
applyPromptBudgeting(baseSystem, developerWithContracts, user, blocks, 6200)
```

Fixed tokens (system + developer + user) are estimated first. Remaining budget is allocated to the 17 context blocks. Blocks that exceed their per-block cap are truncated with `[truncated for prompt budget]`. If total block tokens still exceed the remaining budget, blocks are dropped in this order:

1. `optional` — `humour_guide`, `craft_guide`
2. `medium` — `location_profiles`, `temporal_context`, `continuity_context`, `era_authenticity`
3. `high` — `world_document`, `character_personality`, `physical_plausibility`
4. `critical` — **never dropped** (`pronoun_accuracy`, `character_consistency`, `locked_facts`, `clue_descriptions`, `narrative_state`, `discriminating_test`, `scene_grounding`, `provisional_scoring_feedback`)

The `PROMPT BUDGET SUMMARY` line at the end of the composed system reports exactly which blocks were dropped and which were truncated, enabling post-run diagnosis.

---

## 10. Worked Example — *The Timeless Deception*, Chapter 1, Attempt 1

**Source:** [PROMPT_09.md](PROMPT_09.md)  
**Run:** `run_35e536ce-718a-4297-97f7-dbf5ddd22910` | **Project:** `proj_c6c75f54-8591-47f8-8d5e-dfd3c0fdab72`  
**Date:** 2026-03-17T19:13:33Z | **Model:** GPT-4o-mini  
**Outcome:** FAILED — `clue_4` placed too late; word count 793/1300

This is a chapter 1, batch-size-1 call. No `worldDocument`, `locationProfiles`, `temporalContext`, or `chapterSummaries` were present at token budget time, so all fell off under pressure.

### Budget summary

```
budget=6200 tokens; fixed=3476; context=1946
dropped=[humour_guide, craft_guide, location_profiles, temporal_context]
truncated=[character_personality]
```

`humour_guide` and `craft_guide` were dropped first (optional). `location_profiles` and `temporal_context` were dropped next (medium). `character_personality` (high) survived but was truncated at 900 tokens — Jeremiah Marsden and Frederick Ackroyd's personality blocks were cut.

### messages[0] — system (annotated)

Each section is labelled with the §3 block key that produced it.

```
You are an expert prose writer for classic mystery fiction…        ← §2.1 system base
                                                                     (hardcoded)

⛔ ABSOLUTE RULE — CHARACTER NAMES:                                 ← §2.1
The ONLY characters who exist in this story are:
  Gertrude Ramsden, Joan Kershaw, Simon Greenwood,                 ← inputs.cast.characters[].name
  Jeremiah Marsden, Frederick Ackroyd.
...

- MORAL COMPLEXITY REQUIREMENT:                                     ← §2.1
  "The murderer tampered with the clock not out of malice           ← inputs.moralAmbiguityNote
   but to cover up a crime of passion…"

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian…       ← §2.1
                                                                     (inputs.detectiveType === 'amateur')

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT                   ← §3.1 pronoun_accuracy [critical]
Canonical pronoun table (subject / object / possessive / reflexive):
  • Gertrude Ramsden: she/her/her/herself                          ← inputs.cast[].gender → 'female'
  • Joan Kershaw: she/her/her/herself
  • Simon Greenwood: he/him/his/himself                            ← inputs.cast[].gender → 'male'
  • Jeremiah Marsden: he/him/his/himself
  • Frederick Ackroyd: he/him/his/himself
MANDATORY PRE-OUTPUT CHECK: …                                       ← hardcoded
Rules 1–8 …                                                         ← hardcoded

CRITICAL CHARACTER CONSISTENCY RULES:                              ← §3.2 character_consistency [critical]
1. Use ONLY names from this list …                                  ← inputs.cast[].name
2. Character roles are fixed:
   - Gertrude Ramsden: amateur_investigator                        ← inputs.cast[].role
   - Joan Kershaw: victim
   …

CHARACTER PERSONALITIES, VOICES & HUMOUR:                         ← §3.4 character_personality [high]
Gertrude Ramsden:                                                   ← inputs.characterProfiles.profiles[0]
  Public: Respected and nurturing figure…                          ← profile.publicPersona
  Hidden: Struggles with depression…                               ← profile.privateSecret
  Humour: dry wit (level 0.5). Sharp observations…                 ← profile.humourStyle + humourLevel
  Voice & Mannerisms: Gentle cadence, often pausing thoughtfully.  ← profile.speechMannerisms
  Internal Conflict: Weight of husband's absence…                  ← profile.internalConflict
…
[Jeremiah Marsden and Frederick Ackroyd truncated for prompt budget]  ← §9 truncation at 900 tokens

PHYSICAL PLAUSIBILITY REQUIREMENTS:                                ← §3.5 physical_plausibility [high]
[Interior viable evidence etc. — hardcoded]

ERA AUTHENTICITY (1940s):                                          ← §3.6 era_authenticity [high]
[Forbidden terms; required period markers]                          ← inputs.caseData CML.meta.era.decade

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES:     ← §3.9 locked_facts [critical]
  - The exact time shown on the stopped clock face: "ten minutes    ← inputs.lockedFacts[0].value
    past eleven"                                                     ← inputs.lockedFacts[0].description
  - The exact amount the clock was wound back: "forty minutes"      ← inputs.lockedFacts[1]

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:                 ← §3.10 clue_descriptions [critical]
• [clue_4] The presence of oil suggests recent tampering            ← clueDistribution.clues['clue_4'].description
  Category: temporal | Criticality: essential                       ← clue.category / .criticality
  Points to: Indicates the clock may have been manipulated.         ← clue.pointsTo

═══ NARRATIVE STATE ═══                                            ← §3.11 narrative_state [critical]
LOCKED FACTS:                                                       ← inputs.narrativeState.lockedFacts[]
  • The exact time shown on the stopped clock face: "ten minutes
    past eleven"
  • The exact amount the clock was wound back: "forty minutes"
CHARACTER PRONOUNS — never deviate from these:                      ← inputs.narrativeState.characterPronouns
  • Gertrude Ramsden: she/her/her
  …

SCENE GROUNDING CHECKLIST (MUST FOLLOW):                           ← §3.16 scene_grounding [critical]
Known location profile anchors: Eversham Manor, The Library,        ← inputs.locationProfiles.keyLocations[].name
  The Dining Room
- Chapter 1: anchor opening in "the library of Ackroyd Manor";     ← scene.setting.location (outline)
  include 2+ sensory cues and 1+ atmosphere marker before major dialogue.

PROMPT BUDGET SUMMARY: budget=6200 tokens; fixed=3476;             ← §9 applyPromptBudgeting output
  context=1946; dropped=[humour_guide, craft_guide,
  location_profiles, temporal_context]; truncated=[character_personality]

# Prose Output Schema                                               ← §2.2 developer
Return JSON with this structure:
  { "status", "tone", "chapters", "cast", "note", "audit" }        ← hardcoded + audit inject
…
WORD COUNT CONTRACT (NON-NEGOTIABLE):                               ← §2.2 wordCountContract
- Preferred generation target: 1500 words per chapter.             ← preferredWords(short)+200 = 1300+200
- Hard floor: 704 words per chapter.                               ← generation-params.yaml hard_floor
…
CRITICAL PROSE REQUIREMENTS:                                        ← §2.3 buildProseRequirements
**Discriminating Test Scene (Act 3, Scene 4):** …                  ← CML.prose_requirements.discriminating_test_scene
**Suspect Clearance Scenes:** …                                     ← CML.prose_requirements.suspect_clearance_scenes[]
**Culprit Revelation (Act 3, Scene 6):** …                         ← CML.prose_requirements.culprit_revelation_scene
```

### messages[1] — user / obligation block (annotated)

```
Write the full prose following the outline scenes.

CHAPTER OBLIGATION CONTRACT (MUST SATISFY):                        ← §4.1 buildChapterObligationBlock
- Chapter 1:
  - Location anchor: the library of Ackroyd Manor.                 ← scene.setting.location (outline Act 1 Sc 1)
  - CLUE OBLIGATIONS:
    • The presence of oil suggests recent tampering with            ← clueDistribution.clues['clue_4'].description
      the clock. [clue_4] ⚠ EARLY PLACEMENT                        ← clue.placement === 'early'
      Points to: Indicates the clock may have been                  ← clue.pointsTo
        manipulated.
      ↳ In the immediately following paragraph, include             ← hardcoded early-placement structure
        an explicit inference or suspicion…
- Locked fact phrase obligations:                                   ← inputs.lockedFacts[]
  - If this batch mentions The exact time shown on the
    stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was
    wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.       ← getSeasonAllowList('winter')
- Forbidden seasonal words: spring, summer, autumn.                ← 'winter' excluded from the 4-season list

FROZEN TIMELINE STATE (DO NOT ALTER):                              ← §4.2 buildTimelineStateBlock
- Timeline anchor: January (winter).                               ← deriveTemporalSeasonLock(temporalContext)
- Established timeline fact: 10:15 PM (time on the clock)          ← CML.constraint_space.time.anchors[]
- Established timeline fact: 10:00 PM (last seen)
- If referenced, use exact time phrase: "ten minutes past           ← inputs.lockedFacts[] filtered for time regex
  eleven"
- If referenced, use exact time phrase: "forty minutes"

# Case Overview                                                     ← §4.3 buildContextSummary
Title: The Timeless Deception | Era: 1940s | Setting: Little        ← CML.meta.title/era.decade/setting.location
  Middleton
Crime: murder (suspicious death)                                    ← CML.meta.crime_class.category/.subtype
Culprit: Frederick Ackroyd                                          ← CML.culpability.culprits[]
Victim: Joan Kershaw                                                ← resolveVictimName(cast) → role=victim
False assumption: The murder occurred at the time indicated         ← CML.false_assumption.statement
  by the clock.
Cast: Gertrude Ramsden, Joan Kershaw, Simon Greenwood,              ← inputs.cast.characters[].name
  Jeremiah Marsden, Frederick Ackroyd
Setting Lock: Keep all scenes consistent with Little Middleton.     ← hardcoded, interpolates CML location

Outline scenes:                                                     ← sanitizeScenesCharacters(scenes)
[
  {
    "sceneNumber": 1, "act": 1,
    "title": "Discovery",
    "setting": { "location": "the library of Ackroyd Manor",        ← outline.acts[0].scenes[0].setting
      "timeOfDay": "Morning after the murder", ... },
    "characters": [...],                                            ← sanitized to valid cast members only
    "cluesRevealed": ["clue_4"],                                    ← outline scene data
    "estimatedWordCount": 1500,                                     ← bumped to max(800, preferredWords+200)
    ...
  }
]
```

### messages[2] — user / checklist (annotated)

```
BEFORE SUBMITTING YOUR JSON — verify this checklist:              ← §5 checklist message

□ Each chapter reaches the hard floor of 704 words                ← chapterWordTargets.hardFloorWords
  and aims for 1500 words or more.                                 ← preferredWords + 200
□ If you mention locked evidence, you used the exact               ← hardcoded
  locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.         ← getSeasonAllowList(temporalLock.season)
□ Forbidden seasonal words: spring, summer, autumn.               ← 4 seasons minus 'winter'
□ Chapter 1: "The presence of oil suggests recent tampering        ← clue.placement === 'early' → §5 early-clue
  with the clock." is placed in the first 25% of the chapter,       checkbox from clueDistribution
  followed by an explicit inference or suspicion paragraph.
□ Return valid JSON only.                                          ← hardcoded
```

### Attempt 2 — messages[3] added (retry injection, annotated)

The attempt 1 response returned `clue_4` too late and at 793 words. The retry driver called `buildEnhancedRetryFeedback` and appended a fourth message.

```
Attempt 2/4 — chapters 1 — 2 validation issue(s) to resolve:     ← §7 buildEnhancedRetryFeedback

═══ CLUE OBLIGATION FAILURES (classified as QUALITY ERRORS        ← error categorized as clueLatePlacedErrors
    in this case — placement, not absence) ═══                      (contains "first quarter of the chapter")
• Chapter 1: clue evidence "The presence of oil suggests           ← validateChapterPreCommitObligations output
  recent tampering with the clock." is present but must
  appear in the first quarter of the chapter — move the
  observation beat to before the 25% mark.

═══ RETRY MICRO-PROMPTS (2) ═══                                    ← §7 buildRetryMicroPromptDirectives

• REPAIR [clue_early_placement — attempt 2]:                       ← clueLatePlacedErrors branch
  "The presence of oil suggests recent tampering with the
   clock." is already present but appears TOO LATE. DO NOT
  write a new instance. Instead, MOVE the existing
  paragraph(s)…

• MICRO-PROMPT [word_count]: Raise chapter length to at            ← wordCountErrors branch
  least 1300 words (currently 793). Expand with concrete            ← regex extracted current=793, target=1300
  action beats…

Return corrected JSON for chapters 1.                              ← not final attempt → edit-not-rebuild instruction
```

### Key observations from this example

1. **Budget pressure was immediate**: Only 1,946 context tokens were available after fixed sections consumed 3,476. The humour and craft guides (optional, 850 tokens each) and both location/temporal blocks (medium) were dropped on the very first chapter.

2. **Pronoun block survived intact**: At 700-token cap the full 5-character table plus 8 rules fits without truncation.

3. **`narrative_state` duplicates `locked_facts`**: Both §3.9 (`locked_facts` block) and §3.11 (`narrative_state`) emit the same two locked-fact phrases. This is intentional — `narrative_state` is the live NarrativeState record (read-only, threaded between batches); `locked_facts` block is the obligation directive (telling the model what to do). The model sees both and neither is redundant.

4. **`clue_4` retry was late-placement, not absent**: The error message was `"is present but must appear in the first quarter"`, which routes to `clueLatePlacedErrors` in §7 — producing a MOVE directive rather than an ADD directive. Attempt 2 succeeded.

5. **Chapter 2 adds `continuity_context` and `provisional_scoring_feedback`**: After chapter 1 committed, `extractChapterSummary` populated a `ChapterSummary` entry and `buildProvisionalChapterScore` generated score 85/100. Chapter 2's system prompt therefore includes §3.12 (`continuity_context`) and §3.17 (`provisional_scoring_feedback`), both absent in chapter 1. The NarrativeState also gained an `openingStyleClassification` entry preventing the model from re-using a `general-descriptive` opening.

---

## 11. Verbatim Prompt — Chapter 1, Attempt 1 (what was actually sent to the LLM)

Source: `PROMPT_09.md` — run `run_35e536ce-718a-4297-97f7-dbf5ddd22910`, 2026-03-17T19:13:33Z  
Model: GPT-4o-mini | Agent: `Agent9-ProseGenerator-Ch1` | 3 messages

---

### Message 1 — role: system

```
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Gertrude Ramsden, Joan Kershaw, Simon Greenwood, Jeremiah Marsden, Frederick Ackroyd.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Gertrude Ramsden, Joan Kershaw, Simon Greenwood, Jeremiah Marsden, Frederick Ackroyd?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.

Rules:
- Do not introduce new facts beyond the CML and outline.
- Preserve all clues, alibis, and the core mystery logic.
- Maintain strict setting fidelity to the specified location and era.
- Write immersive, sensory-rich prose that transports readers to the setting
- Include scene-setting passages that establish atmosphere, time, and place
- Use varied sentence structure and sophisticated vocabulary
- Show character emotions through actions and dialogue, not just telling
- Create distinct character voices and personalities based on their profiles
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, include an explicit bridge to confirmed murder.
- ANTI-REPETITION: Do not repeat atmospheric or descriptive phrases across adjacent chapters.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation".
- TEMPORAL CONSISTENCY: If a month is mentioned, season wording in the same timeline must be compatible.
- DENOUEMENT REQUIREMENT: Final chapter must show concrete consequences — culprit fate, relationship changes, detective resolution.
- MORAL COMPLEXITY REQUIREMENT: "The murderer tampered with the clock not out of malice but to cover up a crime of passion, leading to a complex emotional dilemma." — acknowledge this in the denouement.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. Police are unnamed background figures only ("a constable", "the sergeant", "an officer from the village"). No Inspector [Surname], no Constable [Surname].

CRITICAL CHARACTER CONSISTENCY RULES:
1. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST: Gertrude Ramsden, Joan Kershaw, Simon Greenwood, Jeremiah Marsden, Frederick Ackroyd
2. Gender pronouns:
   - Gertrude Ramsden: she/her/her
   - Joan Kershaw: she/her/her
   - Simon Greenwood: he/him/his
   - Jeremiah Marsden: he/him/his
   - Frederick Ackroyd: he/him/his

CHARACTER PERSONALITIES, VOICES & HUMOUR:

Gertrude Ramsden:
  Public: Respected and nurturing figure in the local community, known for her kindness and wisdom.
  Hidden: Struggles with depression after the loss of her husband in the war, feeling isolated and forgotten.
  Stakes: Potentially uncovering hidden truths that could implicate those she cares about.
  Humour: dry wit (level 0.5). Sharp observations about human behaviour. Concise, often one-liners.
  Voice & Mannerisms: Gentle cadence, often pausing thoughtfully. Penchant for proverbs.
  Internal Conflict: Weight of husband's absence; investigation offers chance to reclaim voice and purpose.

Joan Kershaw:
  Public: Independent and ambitious; admired for journalistic integrity.
  Hidden: Involved in an affair with the victim, which could destroy her career if revealed.
  Humour: sardonic (level 0.6). Darker edge. Mocking tone revealing cynicism.
  Voice & Mannerisms: Brisk, confident tone; uses irony to mask vulnerability.

Simon Greenwood:
  Public: Diligent and loyal to the estate; meticulous nature and dedication.
  Hidden: Has been embezzling funds from the estate to support his lavish lifestyle.
  Humour: None — plays it straight. Seriousness provides contrast for wittier characters.
  Voice & Mannerisms: Speaks with precision, rarely indulges in humour.

Jeremiah Marsden:
  Public: Charismatic and influential; known for community initiatives and charm.
  Hidden: Engaged in illegal political dealings; feels threatened by victim's knowledge of his corruption.
  Humour: observational (level 0.4). Notices absurdity in situations. Wry comments.
  Voice & Mannerisms: Charismatic [truncated for prompt budget]

Frederick Ackroyd:
  [truncated for prompt budget]

PHYSICAL PLAUSIBILITY REQUIREMENTS:
- Interior viable evidence: fingerprints, torn fabric, overturned furniture, blood spatter, documents
- IMPLAUSIBLE (DO NOT USE): footprints on wooden deck; footprints in rain/storm; metal embedded in hardwood; light objects in storm
- Struggle evidence: overturned furniture, torn clothing, scattered items, defensive wounds ✓

ERA AUTHENTICITY (1940s):
- FORBIDDEN: Modern technology
- REQUIRED (2+ per scene): Formal address (Mr./Mrs./Miss/Dr./Sir/Lady), period technology, period fashion
- Use period-authentic language and social norms

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
If a locked fact is not relevant to this chapter, skip it. But if you do mention it, use exactly the phrase above.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
• [clue_4] The presence of oil suggests recent tampering with the clock.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Indicates the clock may have been manipulated.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══
LOCKED FACTS:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Gertrude Ramsden: she/her/her
  • Joan Kershaw: she/her/her
  • Simon Greenwood: he/him/his
  • Jeremiah Marsden: he/him/his
  • Frederick Ackroyd: he/him/his
═══════════════════════════════════════════════════════

SCENE GROUNDING CHECKLIST (MUST FOLLOW):
Known location profile anchors: Eversham Manor, The Library, The Dining Room
- Chapter 1: anchor opening in "the library of Ackroyd Manor"; include 2+ sensory cues and 1+ atmosphere marker before major dialogue.

PROMPT BUDGET SUMMARY: budget=6200 tokens; fixed=3476; context=1946; dropped=[humour_guide, craft_guide, location_profiles, temporal_context]; truncated=[character_personality, location_profiles, temporal_context]

# Prose Output Schema
Return JSON with this structure:
{
  "status": "draft",
  "tone": "classic|modern|atmospheric",
  "chapters": [{"title": "...", "summary": "...", "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]}],
  "cast": ["Name 1", "Name 2"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph N | absent",
    "season_words_used": "list seasonal words used | none",
    "discriminating_test_present": "yes: chapter N paragraph M | no",
    "required_clues_present": "clue_id: chapter N paragraph M | absent"
  }
}
The audit field is a self-check only. It will be stripped before storage.

Requirements:
- Write exactly one chapter per outline scene (1 total).
- Chapter numbering starts at 1.
- HARD FLOOR 704 words; PREFERRED TARGET 1300+ words.
- Classic tone.
- Reflect the outline summary. Keep all logic consistent with CML.

NOVEL-QUALITY PROSE REQUIREMENTS:
1. SCENE-SETTING: Establish time of day, weather, lighting; use sensory details (sight, sound, smell, touch).
2. SHOW, DON'T TELL: Body language reveals emotion; actions reveal character.
3. VARIED SENTENCE STRUCTURE: Mix short punchy sentences with longer flowing ones.
4. DIALOGUE THAT REVEALS CHARACTER: Distinct speech patterns; subtext; action beats over dialogue tags.
5. SENSORY IMMERSION: 2–3 senses minimum per scene.
6. PARAGRAPH STRUCTURE: Opening hook; middle development; closing revelation or transition.
7. PACING VARIATION: Short paragraphs for action, longer for atmosphere, moderate for investigation.
8. EMOTIONAL SUBTEXT & TENSION: Hidden secrets/stakes; suspicion, unease, watchfulness.

QUALITY GUARDRAILS (MUST SATISFY):
1. FAIR PLAY CLUE TIMING: Clue in chapter N → detective may only act on it in N+1 or later.
2. FAIR PLAY INFORMATION PARITY: All clues visible to reader before detective uses them.
3. FAIR PLAY REVELATION SPACING: Discriminating test uses only clues from N-1 or earlier.
4. FAIR PLAY CONFRONTATION: Final confrontation cites only previously visible evidence.
5. Use only canonical cast names from CML. No invented titled placeholders.
6. Suspect-elimination coverage before final reveal closes.
7. Culprit evidence chain with explicit reasoning connectors (because/therefore/proves).

CRITICAL PROSE REQUIREMENTS:
**Discriminating Test Scene (Act 3, Scene 4):** Execute test, Observe reaction, Draw conclusion about guilt | Outcome: N/A
**Suspect Clearance Scenes (Act 3, Scene 5):**
- Gertrude Ramsden: past connection with victim shows no motive
- Joan Kershaw: Joan is the victim and cannot be implicated
- Simon Greenwood: financial ties do not indicate motive for murder
- Jeremiah Marsden: loyal service to the family confirmed
**Culprit Revelation (Act 3, Scene 6):** Confrontation with evidence.
VALIDATION CONSEQUENCE: Failure costs $5–8 to regenerate. Follow these specifications precisely.

WORD COUNT CONTRACT (NON-NEGOTIABLE):
- Preferred generation target: 1500 words per chapter.
- Hard floor: 704 words per chapter.
- Overshoot rather than undershoot.
- Expand with concrete action beats, clue-linked dialogue, and sensory detail.
- Never pad with recap, repeated atmosphere, or generic filler.
```

---

### Message 2 — role: user

```
Write the full prose following the outline scenes.

CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 1:
  - Location anchor: the library of Ackroyd Manor.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The presence of oil suggests recent tampering with the clock. [clue_4] ⚠ EARLY PLACEMENT — write this in the first 25% of the chapter
      Points to: Indicates the clock may have been manipulated.
      ↳ In the immediately following paragraph, include an explicit inference or suspicion that relates to what was just observed.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Established timeline fact: 10:15 PM (time on the clock)
- Established timeline fact: 10:00 PM (last seen)
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

# Case Overview
Title: The Timeless Deception | Era: 1940s | Setting: Little Middleton
Crime: murder (suspicious death) | Culprit: Frederick Ackroyd
False assumption: The murder occurred at the time indicated by the clock.
Cast: Gertrude Ramsden, Joan Kershaw, Simon Greenwood, Jeremiah Marsden, Frederick Ackroyd
Setting Lock: Keep all scenes and descriptions consistent with Little Middleton.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the library of Ackroyd Manor",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": ["Gertrude Ramsden", "Frederick Ackroyd", "Simon Greenwood", "Joan Kershaw", "Jeremiah Marsden"],
    "purpose": "Introduce the crime and the initial suspects",
    "cluesRevealed": ["clue_4"],
    "dramaticElements": {
      "conflict": "Tension arises as the household grapples with the shock of the murder.",
      "tension": "All eyes are on Frederick, who seems particularly anxious.",
      "microMomentBeats": ["Gertrude observes the clock, feeling a chill at the sight of the stopped hands."]
    },
    "summary": "The morning after the murder, the household gathers in the library, where the victim was discovered. Tension fills the air as everyone awaits the arrival of the detective, Gertrude Ramsden, who has been invited due to her keen observational skills.",
    "estimatedWordCount": 800
  }
]
```

---

### Message 3 — role: user (pre-submit checklist)

```
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 704 words and aims for 1500 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 1: "The presence of oil suggests recent tampering with the clock." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Return valid JSON only.
```

---

## 11a. Verbatim Prompt — Chapter 1, Attempt 2 (retry injection added)

Source: `PROMPT_09.md` — 2026-03-17T19:13:43Z  
Model: GPT-4o-mini | Messages: 4 (Messages 1–3 identical to Attempt 1; Message 4 added below)

---

### Message 4 — role: user (retry injection)

```
Attempt 2/4 — chapters 1 — 2 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (2) ═══
• Chapter 1: clue evidence "The presence of oil suggests recent tampering with the clock." is present but must appear in the first quarter of the chapter — move the observation beat to before the 25% mark.
• Chapter 1: word count below preferred target (793/1300)

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [clue_visibility — attempt 2]: chapters 1 are missing: The presence of oil suggests recent tampering with the clock..
  Near the beginning of the chapter:
  • Paragraph 1: A character directly observes or discovers the missing evidence. Be specific and sensory — describe what is seen, touched, or heard. Include any exact required phrase verbatim.
  • Paragraph 2 (immediately following): The detective or POV character explicitly reasons about what this evidence means — who it implicates, what is suspicious, or what inference it supports.
  Keep these as two clearly separate paragraphs. Do not bury the evidence in atmosphere or background dialogue.
• MICRO-PROMPT [word_count]: Raise chapter length to at least 1300 words (currently 793). Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.

Regenerate chapters 1 with the above corrections applied.
```
