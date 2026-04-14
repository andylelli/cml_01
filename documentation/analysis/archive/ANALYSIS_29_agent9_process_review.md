# ANALYSIS_29 — Agent 9 Process Review: Every Step, Prompts, Responses, and Reprocess Paths

**Date:** 2026-03-17  
**Scope:** Full factual record of what agent 9 does, step by step — from context ingestion through final commit — including actual prompt samples, structure of each prompt section, per-batch retry paths, post-generation repair paths, validations, and the release gate.  
**Prior art:** ANALYSIS_23 (prompt anatomy), ANALYSIS_16 (pronoun phase), ANALYSIS_17 (temporal fix), ANALYSIS_20 (atmosphere repair phrase substitution).  
**Rule:** Facts only. No recommendations or analysis here.

---

## 1. Pipeline Position

Agent 9 is the final generation agent in the story pipeline. It runs after:

| Preceding agent | Output consumed by agent 9 |
|---|---|
| Agent 1 — CML generator | `ctx.cml` |
| Agent 2a — Background context | `ctx.backgroundContext` |
| Agent 2b — Cast design | `ctx.cast` |
| Agent 2c — Character profiles | `ctx.characterProfiles` |
| Agent 3 — Location profiles | `ctx.locationProfiles` |
| Agent 4 — Temporal context | `ctx.temporalContext` |
| Agent 5 — Clue distribution | `ctx.clueDistribution` |
| Agent 6 — Setting refinement | `ctx.settingRefinement` |
| Agent 6.5 — World builder | `ctx.worldDocument` |
| Agent 7 — Narrative outline | `ctx.narrative` |
| Agent 8 — Hard logic devices | `ctx.hardLogicDevices` |

Agent 9 produces `ctx.prose` and `ctx.validationReport`. These are the terminal pipeline outputs.

Source file: `apps/worker/src/jobs/agents/agent9-run.ts` (~1,820 lines)  
Prompt builder: `packages/prompts-llm/src/agent9-prose.ts` (~3,800 lines)

### 1.A Assessment

**Goal clarity:** ✅ Agent 9's terminal position is well-motivated. All logical, structural, and creative inputs are fully resolved before Agent 9 runs — it has no downstream agent to delegate to and no upstream agent that still needs its results.

**Input table labeling:** ❌ The table above contains systematically wrong agent numbers throughout. Based on ANALYSIS_30, the correct mapping is:

| Correct agent | Role | ctx field |
|---|---|---|
| Agent 3 | CML generator | `ctx.cml` |
| Agent 2 | Cast design | `ctx.cast` |
| Agent 2b | Character profiles | `ctx.characterProfiles` |
| Agent 2c | Location profiles | `ctx.locationProfiles` |
| Agent 2d | Temporal context | `ctx.temporalContext` |
| Agent 2e | Background context | (see Section 2.A) |
| Agent 3b | Hard logic devices | `ctx.hardLogicDevices` |
| Agent 5 | Clue distribution | `ctx.clueDistribution` |
| Agent 6.5 | World builder | `ctx.worldDocument` |
| Agent 7 | Narrative outline | `ctx.narrative` |
| Agent 1 | Setting refinement | `ctx.settingRefinement` |

Agent 8 (novelty check) is a structural gate only and does not contribute direct context to Agent 9's prose prompt. The table's attribution of "Agent 1 — CML generator" (actually Agent 3), "Agent 8 — Hard logic devices" (actually Agent 3b), and "Agent 6 — Setting refinement" (actually Agent 1) are all incorrect.

**Dependency chain:** The 11-agent sequential chain means any upstream failure cascades to Agent 9 with no recovery path at this point. Agent 9 inherits the full output of every upstream agent — if any upstream agent produced subtly wrong output without hard-failing, Agent 9 has no mechanism to detect or compensate for it. All structural validation burden rests on agents 1–8.

---

## 2. Entry Inputs — What `runAgent9` Receives

All inputs are destructured from `ctx` at the top of the function:

| Input | Source field | Type |
|---|---|---|
| CML case data | `ctx.cml` | `CaseData` |
| Cast design | `ctx.cast` | `CastDesign` |
| Character profiles | `ctx.characterProfiles` | `CharacterProfilesResult` |
| Location profiles | `ctx.locationProfiles` | `LocationProfiles` |
| Temporal context | `ctx.temporalContext` | `TemporalContext` |
| Hard logic devices | `ctx.hardLogicDevices` | `HardLogicDevices` |
| Narrative outline | `ctx.narrative` | `NarrativeOutline` |
| Clue distribution | `ctx.clueDistribution` | `ClueDistributionResult` |
| World document | `ctx.worldDocument` | `WorldDocument` (optional) |
| Target length | derived from CML | `"short" | "medium" | "long"` |
| Narrative style | `ctx.narrativeStyle` | `"classic" | "modern" | "atmospheric"` |
| Model | configured | string (e.g. `gpt-4o-mini`) |

Additionally, `runAgent9` reads two writing guide files from disk:

- `notes/DEFINITIVE_GUIDE_TO_HUMOUR.md` → injected as `humourGuideBlock` (optional priority, can be dropped by budget)
- `notes/WHAT_MAKES_A_GOOD_WHODUNNIT.md` → injected as `craftGuideBlock` (optional priority, can be dropped by budget)

### 2.A Assessment

**Input richness:** ✅ The input set covers all dimensions a prose writer needs: logical structure (CML), cast identity and voice (cast, characterProfiles), physical environment (locationProfiles), temporal anchor (temporalContext), mystery mechanics (hardLogicDevices, clueDistribution), story arc (narrative outline), and creative context (worldDocument). This is more information than any human author would typically have laid out before writing a chapter.

**Critical optional dependency:** ❌ `ctx.worldDocument` is listed as optional. It contains the most quality-defining inputs — character voice sketches, emotional arc turning points, humour placement map, era texture, and the season lock (WORLD FIX A). If Agent 6.5 fails or does not run, Agent 9 has no fallback for any of these. The prose model falls back to the cast's `characterProfiles` for voice guidance, but these are structural summaries (public/hidden/stakes), not voice sketches with dialogue fragments and humour register.

**Disk I/O fragility:** ❌ `loadWritingGuides` reads two files from disk at runtime. If either file is absent or unreadable, the block silently drops — no error is logged and no prompt-budget record exists of the drop. These files contain the humour guide and craft guide, which are the highest-quality creative guidance documents outside the world document.

**`backgroundContext` thread:** ⚠️ `ctx.backgroundContext` (produced by Agent 2e) is not listed in the Section 2 input table. It is unclear whether background context threads directly into Agent 9's prompt or only indirectly via the world document. If it is absent from prompt construction, thematic and social-historical grounding may be missing from the prose context blocks.

**`lockedFacts` source:** The `ctx.hardLogicDevices` input is the origin of `lockedFacts`. This chain (Agent 3b → `devices[].lockedFacts` → CML → Agent 9 → `annotatedLockedFacts`) is not made explicit in Section 2 but is critical to understanding how the consistency-validation feature in Section 3.2 works.

---

## 3. Pre-generation Setup

### 3.1 Baseline Prose Guardrails

Three hardcoded strings are defined at entry:

```
"Avoid stereotypes and reduce bias."
"Keep language original; do not copy copyrighted text."
"Output valid JSON only."
```

These appear verbatim in the system message `rules` block.

### 3.2 `annotatedLockedFacts` Derivation (ANALYSIS_28 fix)

A `clueIdToChapters` map is built from `narrative.acts[].scenes[].cluesRevealed`. Each clue ID maps to a `Set<number>` of chapters where it is revealed.

For each `lockedFact` in the CML, the fact's `description` and `value` are tokenized (lowercase, stripped of stopwords, minimum 4 characters). The token list is matched against clue descriptions and `pointsTo` fields in `clueDistribution.clues`. If a fact's tokens overlap with a clue's keywords by ≥ 2, the fact inherits the clue's `appearsInChapters` set.

Result: `annotatedLockedFacts` — an array of `AnnotatedLockedFact` objects, each identical to a `LockedFact` except with an optional `appearsInChapters: Set<number>` field appended.

### 3.3 NarrativeState Initialization

`initNarrativeState(annotatedLockedFacts, characterGenderMap)` is called once. The returned `NarrativeState` object contains:

```typescript
{
  lockedFacts: AnnotatedLockedFact[];   // from annotatedLockedFacts
  characterPronouns: Record<string, string>;  // name → "he/him" | "she/her" | "they/them"
  cluesRevealedToReader: string[];      // initially []
}
```

This object is passed into `generateProse` as `inputs.narrativeState` and is deep-copied inside `generateProse` into `liveNarrativeState` to prevent mutation bleed-back.

### 3.A Assessment

**`annotatedLockedFacts` heuristic quality:** ⚠️ The token-matching approach (lowercase, stopword filter, ≥4-char minimum, ≥2 token overlap against clue descriptions and `pointsTo` fields) is functional but fuzzy. Two distinct failure modes exist:
- **Over-association:** A locked fact whose description shares generic tokens with an unrelated clue (e.g. both mention "clock" or "window") will inherit that clue's chapter set incorrectly, scoping consistency checks too narrowly.
- **Under-association:** A relevant clue described using different vocabulary to the locked fact will not be matched, defaulting the fact to "check all chapters" — which is safe but can produce false-positive consistency errors in chapters where the locked fact cannot plausibly appear.

The fallback (no `appearsInChapters` → check all chapters) is the correct defensive choice. False positives produce retry costs; false negatives produce missed validations. The conservative direction is preferable, and the ANALYSIS_28 fix represents a genuine improvement over the prior behaviour of always checking all chapters.

**Improvement opportunity:** The heuristic could be strengthened by cross-referencing locked facts back to their source `hardLogicDevices.devices[].clueId` or equivalent field path, since locked facts derive directly from hard logic devices. A source-level association would be exact rather than fuzzy.

**`NarrativeState` design:** ✅ Architecturally sound. The deep copy inside `generateProse` is correct defensive programming — any mutation by the generation loop feeds back only into `liveNarrativeState`, not the outer agent's copy. The three-field structure (lockedFacts, characterPronouns, cluesRevealedToReader) covers the three most important continuity dimensions: physical-evidence exactitude, character identity, and clue-reveal history.

---

## 4. Prompt Construction — `buildProsePrompt`

Location: `packages/prompts-llm/src/agent9-prose.ts` → `buildProsePrompt()`

Every call to the LLM passes through `buildProsePrompt`. It produces a `messages` array of 3 elements: `[system, user, checklist]`.

### 4.1 Message 1 — System

The system message is a concatenation of:

1. **Creative context preamble** (injected before `system` by the orchestrator). Example from PROMPT_01:
   > `CONTEXT: You are writing chapters of a Golden Age whodunnit mystery novel in the literary tradition of Agatha Christie, Arthur Conan Doyle, and Dorothy L. Sayers. This is a creative fiction writing task…`

2. **`system` constant** — the expert prose writer declaration plus absolute rules:
   - `⛔ ABSOLUTE RULE — CHARACTER NAMES:` with the full cast list and gender labels
   - 13 named prose rules (DISAPPEARANCE-TO-MURDER BRIDGE, ANTI-REPETITION, TEMPLATE LEAKAGE BAN, TEMPORAL CONSISTENCY, DENOUEMENT REQUIREMENT, MORAL COMPLEXITY, VICTIM IDENTITY, plus baseline guardrails)
   - Amateur detective warning (if `detectiveType === 'amateur'`)

3. **17 context blocks**, assembled by `buildPromptContextBlocks()` and budgeted by `applyPromptBudgeting()`:

   | Block key | Priority | Function | Cap (tokens) |
   |---|---|---|---|
   | `pronoun_accuracy` | critical | `buildPronounAccuracyBlock()` | 700 |
   | `character_consistency` | critical | inline | none |
   | `world_document` | high | `buildWorldBriefBlock()` | none |
   | `character_personality` | high (critical if non-binary cast) | inline | 900 |
   | `physical_plausibility` | high | inline | none |
   | `era_authenticity` | high | inline | none |
   | `location_profiles` | medium | inline | 1000 |
   | `temporal_context` | medium | inline | 850 |
   | `locked_facts` | critical | inline | none |
   | `clue_descriptions` | critical | `buildClueDescriptionBlock()` | none |
   | `narrative_state` | critical | `buildNSDBlock()` | none |
   | `continuity_context` | medium | `buildContinuityContext()` | 500 |
   | `discriminating_test` | critical | `buildDiscriminatingTestChecklist()` | none |
   | `humour_guide` | optional | inline from guide file | 850 |
   | `craft_guide` | optional | inline from guide file | 850 |
   | `scene_grounding` | critical | `buildSceneGroundingChecklist()` | none |
   | `provisional_scoring_feedback` | critical | `formatProvisionalScoringFeedbackBlock()` | none |

   **Budget rule:** Total token budget is 6,200. Fixed tokens (system base + developer + user) are subtracted first. Remaining tokens are allocated to blocks in drop order: optional → medium → high. Critical blocks are never dropped.

4. **`developer` section** (appended inside `applyPromptBudgeting` after context blocks):
   - JSON output schema (prose chapters)
   - `audit` self-check field (stripped before storage, present only to force self-review)
   - Word count contract (per-length hard floor and preferred target)
   - 8 novel-quality prose requirements
   - Fair play guardrails (4 rules)
   - `CRITICAL PROSE REQUIREMENTS` block from CML (`buildProseRequirements()`)
   - `PROMPT BUDGET SUMMARY` line (dropped/truncated block names)

5. **Chapter obligation contract** (in `user` message, not system):
   - `buildChapterObligationBlock()` — per-chapter location anchor, clue obligations with early-placement mandates, suspect clearances, discriminating test flag
   - `buildTimelineStateBlock()` — frozen timeline anchors + locked time phrases

### 4.2 Message 2 — User

The user message is always:

```
Write the full prose following the outline scenes.

[CHAPTER OBLIGATION CONTRACT (MUST SATISFY)]
[FROZEN TIMELINE STATE (DO NOT ALTER)]

[buildContextSummary output — title, era, setting, crime, culprit, cast with pronouns, non-binary reminder if applicable, Setting Lock]

Outline scenes:
[JSON.stringify(scenesWithAdjustedEstimates, null, 2)]
```

The scenes array is sanitized via `sanitizeScenesCharacters()` (phantom names removed) and each scene gets its `estimatedWordCount` raised to at least `chapterTargetWords`.

### 4.3 Message 3 — Checklist

A plain-text checklist appended as a second user message:

```
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of N words and aims for M words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ [Seasonal allow-list and forbidden words if temporalLock exists]
□ [Per early-placement clue: chapter N "description" is placed in first 25%...]
□ PRONOUN AUDIT — [table of character / canonical pronouns / used in draft / match?]
□ Return valid JSON only.
```

### 4.4 Prompt Token Budget Example (from PROMPT_01, Chapter 1)

From the PROMPT_01 prompt budget summary line captured in the file:
- **Model:** GPT-4o-mini  
- **Temperature:** 0.42  
- **MaxTokens:** 4,500  
- **Route:** buildProsePrompt (initial generation)  
- **Total messages:** 2 (system + user; checklist merged or follow-on)

### 4.A Assessment

**17-block budget architecture:** ✅ Sophisticated and well-designed. The four-tier priority system (critical / high / medium / optional) guarantees that must-have constraints are always present regardless of context size. The drop order (optional → medium → high, with critical never dropped) is correct.

**`world_document` priority risk:** ❌ The world document is classified as "high" (droppable under budget pressure) despite containing the most quality-defining inputs: character voice sketches with dialogue fragments and humour register, emotional arc turning points, story theme, and the season lock (WORLD FIX A). For a story with a large cast or many clue obligations that fill the critical blocks, the world document is the first high-priority block to be sacrificed. Reclassifying it as "critical" would guarantee its presence at the cost of potentially dropping `character_personality`, `era_authenticity`, or `physical_plausibility`. Given that voice guidance is the primary differentiator between generic and characterful prose, the current ordering understates its importance.

**`character_personality` priority:** ⚠️ "High" by default, "critical" only if non-binary cast is present. For a binary-gender cast, character personality context — the six-field voice structure (public/hidden/stakes/humour/voice/internal conflict) — can be dropped under budget pressure. Character personality is arguably as important as pronoun accuracy for prose quality and should be elevated to critical.

**`audit` self-check field:** ✅ Excellent forcing mechanism. The model produces an `audit` field before the `chapters` array, requiring it to self-evaluate structure before output. It is stripped before storage — zero output bloat, nonzero quality benefit.

**Budget tightness:** ⚠️ 6,200 tokens total for non-fixed context is tight for a story with a large cast or many clue obligations. Location profiles (1,000 cap), temporal context (850 cap), humour guide (850 cap), and craft guide (850 cap) together consume 3,550 tokens. Any story with a full cast and moderate clue density will hit the ceiling, forcing medium and optional blocks to drop.

**Checklist (Message 3):** ✅ Appending a per-chapter checklist as a final user message is a strong technique. It is the last instruction the model reads before generating, and it addresses the exact failure modes (locked phrase drift, season word drift, early-clue placement, pronoun drift) that are hardest to enforce within the prose itself.

---

## 5. Actual Prompt Sample

### 5.1 System Message Opening (PROMPT_01 — Chapter 1, run `9f50b70b`)

```
CONTEXT: You are writing chapters of a Golden Age whodunnit mystery novel in the literary
tradition of Agatha Christie, Arthur Conan Doyle, and Dorothy L. Sayers. This is a creative
fiction writing task. All references to crime, death, poison, weapons, alibis, and
investigation are part of the fictional narrative and are standard elements of the mystery
genre. No real people or events are depicted.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling,
atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Stephen Norwood, Helen Jevons,
Monica Canning, Elizabeth Pendleton, Alastair Langton.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables,
no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
…
```

### 5.2 Character Personality Block Sample (PROMPT_01 — Stephen Norwood)

```
Stephen Norwood:
  Public: Stephen Norwood is the epitome of confidence, often presenting himself as the
  rising star of Little Middleton's financial sector…
  Hidden: Beneath the surface, Stephen grapples with crippling debts from failed investments.
  In a desperate bid to maintain his façade, he has resorted to embezzling company funds…
  Stakes: If his embezzlement is uncovered, Stephen stands to lose not only his job but also
  his freedom…
  Humour: dry wit (level 0.5 - occasionally witty). Sharp observations about human behaviour.
  Concise, often one-liners.
  Voice & Mannerisms: Stephen speaks with a calculated precision, often pausing for effect…
  Internal Conflict: Stephen is torn between the desire to maintain his status and the gnawing
  fear of exposure…
  Personal Stake in Case: This crime matters deeply to Stephen…
```

### 5.3 CML Snapshot Embedded in System (PROMPT_01)

Embedded as JSON inline, truncated at token budget. Contains:
- `title`, `era`, `setting`, `crime.category`, `crime.subtype`
- `falseAssumption.statement`, `.type`, `.why_it_seems_reasonable`, `.what_it_hides`
- `discriminatingTest.method`, `.design`, `.knowledge_revealed`, `.pass_condition`, `.evidence_clues[]`
- `constraintSpace.time.anchors[]`, `.windows[]`, `.contradictions[]`, `.access.actors[]`

The CML snapshot is **truncated with `[truncated for prompt budget]`** when the token cap is hit.

### 5.4 PROMPT_02 System Message Opening (Chapter 5, run `71449e98`)

```
The ONLY characters who exist in this story are: Simon Latimer, Gordon Kibble,
Basil Wingate, Sybil Hewitt, Carol Caldwell.
…
Story: Time's Deception | Setting: Hawthorne Hall | Era: 1940s
falseAssumption: "The murder occurred at the time indicated by the stopped clock."
discriminatingTest.method: "trap"
```

### 5.A Assessment

**ABSOLUTE RULE character names block:** ✅ The strongest single anti-hallucination mechanism in the prompt. A named cast list with explicit gender labels and a prohibition on inventing walk-on characters directly addresses the most common prose failure mode — the model introducing genre-attractor names. Placing this at the top of the system message before any other rules is correct.

**Character personality detail:** ✅ The six-field structure (public, hidden, stakes, humour, voice, internal conflict) is rich and specific enough to guide dialogue and narrative perspective. The humour level with a prose description ("sharp observations, concise one-liners") gives the model an actionable anchor rather than an abstract numerical rating.

**CML snapshot truncation risk:** ❌ The CML snapshot is truncated at token budget and the sample in Section 5.3 confirms this happens in live runs. The CML's most logic-dense fields — `falseAssumption`, `discriminatingTest`, and `constraintSpace.time.anchors` — are exactly what the model needs to plant the correct false assumption, dramatize the test, and respect the locked timeline. If truncation occurs past those fields, the model must infer the mystery structure from partial information. The Chapter Obligation Contract (Section 4.1) partially mitigates this for the discriminating test, but the false assumption's setup (`.why_it_seems_reasonable`, `.what_it_hides`) has no obligation-contract equivalent.

**Cross-run consistency:** ✅ Section 5.4 confirms the prompt opening is consistent across runs — cast list with gender annotations and the false assumption statement are present in Chapter 5 of a different story as well as Chapter 1 of the first. This confirms the prompt builder is deterministic in its first-block ordering.

**Sample coverage gap:** ⚠️ Sections 5.1–5.4 cover only the system message and part of the CML snapshot. The user message (obligation contract + timeline state + scene outline JSON) and message 3 (checklist) are not sampled. These are the per-batch variable elements — the obligation contract in particular changes per chapter and contains the most actionable constraints. A live sample of the user and checklist messages would complete the prompt anatomy analysis.

---

## 6. The `generateProse` Function — Main Loop

Location: line 3208 of `agent9-prose.ts`

### 6.1 Initialization

```
configuredMaxAttempts ← getGenerationParams().agent9_prose.generation.default_max_attempts
batchSize ← min(inputs.batchSize || 1, proseModelConfig.max_batch_size)
sceneCount ← total scenes from outline.acts[].scenes
temporalSeasonLock ← deriveTemporalSeasonLock(inputs.temporalContext)
```

State collections initialized:
- `chapters: ProseChapter[]` — committed chapters
- `chapterSummaries: ChapterSummary[]` — continuity context
- `chapterValidationHistory` — retry failure log
- `provisionalChapterScores` — per-chapter provisional scores
- `promptFingerprints` — sha256 hash of first-attempt prompts per chapter
- `liveNarrativeState` — deep copy of `inputs.narrativeState`
- `rollingProvisionalFeedback` — last 4 scoring feedback items (forwarded to next batch)
- Underflow telemetry counters

### 6.2 Per-Batch Loop

For each batch of `batchSize` scenes (default: 1 scene per batch):

```
for batchStart in 0..sceneCount step batchSize:
  build chapterRequirementLedger (word targets, required clue IDs)
  for attempt in 1..maxBatchAttempts:
    call buildProsePrompt(...)
    if attempt > 1 AND lastBatchErrors exist:
      append assistant turn (prior raw response, if attempt < maxBatchAttempts)
      append user turn with buildEnhancedRetryFeedback(...)
    call client.chat(...)
    parse response → proseBatch
    for each chapter in batch:
      enforceMonthSeasonLockOnChapter (deterministic season-word substitution)
      sanitizeGeneratedChapter (phantom name removal)
      if single overlong paragraph: split on sentence boundaries
      repairChapterPronouns (deterministic pronoun repair)
      evaluateCandidate (content validation + obligation validation)
      if hardFloorUnderflow OR preferredMissOnly:
        attemptUnderflowExpansion (LLM call)
        re-evaluate
      pronounValidator.validate (CharacterConsistencyValidator)
      targeted pronoun repair if issues found
      re-validate after repair
      collect chapterErrors
    lintBatchProse (entropy, fingerprint, n-gram)
    if batchErrors:
      store lastBatchErrors
      if attempt >= maxBatchAttempts: throw
      continue to next attempt
    commit batch → chapters[], chapterSummaries[]
    update liveNarrativeState via updateNSD()
    feed provisional scores forward → rollingProvisionalFeedback
    call inputs.onBatchComplete (notifies orchestrator)
    break
```

### 6.3 Batch Size and Token Budget

| Target length | MaxTokens per scene | MaxTokens total |
|---|---|---|
| short / medium | 4,500 | `min(4500 × batchSize, 20000)` |
| long | 6,000 | `min(6000 × batchSize, 20000)` |

Temperature: `proseModelConfig.temperature` (0.42 in observed runs, 0.45 in code comments)

### 6.A Assessment

**Batch size 1:** ✅ Safest strategy but expensive. Each batch = 1 LLM call, and each batch failure triggers up to `default_max_attempts` retry calls. For a 15-scene story, worst-case = 45+ LLM calls. The tradeoff (per-scene precision over cost) is correct for production-quality prose where any per-scene error is worth correcting immediately.

**`maxBatchAttempts` = 3 (from current config):** ✅ Three attempts with graduated feedback (attempt 1: initial generation, attempt 2: with prior response as assistant turn, attempt 3: clean rebuild) is well-sequenced. The session summary notes a legacy value of 4 — the current value of 3 reflects a cost-reduction from `generation-params.ts`.

**`rollingProvisionalFeedback`:** ✅ Passing the last 4 provisional chapter scores as corrective targets for the next batch is the strongest quality-feedback mechanism in the loop. It creates a moving-window quality contract that the model can act on in real time, rather than discovering deficits only after the full story is complete.

**Temperature 0.42–0.45:** ⚠️ Deliberately low for creative writing. Reduces lexical variety in exchange for structural compliance. Given the tight clue obligation, locked-facts, and pronoun requirements, this tradeoff is defensible. The risk is prose that reads mechanically correct but lacks voice variety — partially offset by the character voice sketches in the world document.

**`liveNarrativeState` update on commit:** ✅ Updating the NSD after each committed chapter via `updateNSD` ensures `cluesRevealedToReader` is accurate at each batch boundary. This prevents the model from re-revealing clues already surfaced in a prior chapter — a key fairness and continuity requirement.

**Underflow telemetry:** ✅ Tracking expansion attempts, recoveries, and failures per run provides actionable monitoring data. Including it in the return value makes it possible to identify stories with systematically short chapters and correlate with model/temperature configuration.

---

## 7. Per-Batch Validation Sequence

Each chapter inside a batch is evaluated by:

### 7.1 Hard structural checks
- `chapter.title` must be a non-empty string
- `chapter.paragraphs` must be a non-empty array of strings

### 7.2 `ChapterValidator.validateChapter()`
- Checks chapter-level content issues (scene location anchoring / grounding, temporal month/season contradiction, setting drift)
- Issues graded as `critical`, `major`, `minor`, `warning`
- Only `critical` and `major` become hard errors that trigger retry

### 7.3 `validateChapterPreCommitObligations()`
- **Word count:** is chapter below `hardFloorWords`? is it below `preferredWords`?
- **Clue obligations:** for each required clue ID in `chapterRequirementLedger`:
  - Token-match chapter text against clue `description` + `pointsTo` tokens (threshold: 40% of tokens, minimum 1)
  - If `clue.placement === 'early'`: also check first 25% of paragraphs (threshold: 25% of tokens)
  - If absent or late: emit hard failure with prose-facing repair directive
- Deduplicates identical error strings (e.g. two clue IDs with same description)

### 7.4 Underflow expansion (LLM call)
If chapter is below `hardFloorWords` OR below `preferredWords`:
- Call `attemptUnderflowExpansion(client, chapter, chapterNumber, scene, ledgerEntry, model, runId, projectId, temporalSeasonLock, cast)`
- System: "You are a surgical prose revision assistant… Expand without changing clue logic, chronology, or character identity. Season lock. Pronoun lock."
- User: current word count, expansion target, required clue obligations, scene summary, scene purpose
- Temperature: `expansionConfig.temperature` (lower than main generation)
- MaxTokens: `expansionConfig.max_tokens`
- Returns single chapter JSON: `{"chapter":{"title":"...","summary":"...","paragraphs":[...]}}`
- After expansion: re-run `repairChapterPronouns`, re-evaluate

### 7.5 Pronoun validation (CharacterConsistencyValidator)
- `pronounValidator.validate()` checks every pronoun against the cast gender map
- Error type: `pronoun_gender_mismatch`
- On error: attempt targeted `repairPronouns()` (deterministic) for flagged characters
- After deterministic repair: re-validate
- Any remaining mismatches become `chapterErrors` (LLM retry required)

### 7.6 `lintBatchProse()` — Anti-template linter
Three checks applied to the committed batch against all prior chapters:
1. **Opening-style entropy:** Shannon entropy of chapter opening style labels across a rolling window; threshold is adaptive (0.65 early, 0.72 mid, 0.80 late story)
2. **Paragraph fingerprint:** exact deduplication of long prose blocks (configurable min chars)
3. **N-gram overlap:** Jaccard similarity of n-grams between batch paragraphs and prior paragraph pool; threshold configurable

**Entropy bypass rule:** if the only failure at the final attempt is entropy-too-low, the batch is accepted with a warning instead of throwing. This prevents false hard-stops.

### 7.A Assessment

**Validation sequence ordering:** ✅ The five-step sequence (hard structure → content validation → obligation checking → underflow expansion → pronoun validation → anti-template linting) is well-ordered. Hard structural failures (missing title/paragraphs) are cheapest to detect and most likely to signal a parse failure — correct to check first.

**Clue obligation token-match threshold:** ⚠️ The 40% of tokens / min 1 threshold is the weakest gate in the validation sequence. A chapter that mentions a single keyword from a clue description in passing can satisfy the obligation. For critical clues this is insufficient — the obligation contract requires on-page observation and explicit inference, not incidental vocabulary overlap. The delivery-method label exemption (falling through to `pointsTo` tokens when the description is a genre label like "Direct observation") is a necessary pragmatic fix, but introduces a softer token path that further reduces precision.

**Early-placement 25% paragraph window:** ✅ Well-designed. Using paragraph count rather than character offset is robust to paragraph length variation. The 25% token-match threshold for early presence (lower than the 40% full-chapter threshold) is intentionally weaker — correct, since early prose is observational while clue descriptions use conclusory analytical language.

**Underflow expansion at low temperature:** ⚠️ Expansion prose generated at `expansionConfig.temperature` (0.2) will be structurally safe but may feel mechanical. The expanded chapter avoids pronoun drift (via re-running `repairChapterPronouns`) but does not re-run `lintBatchProse` — meaning expanded prose could introduce template phrases or repeated openings without detection.

**Entropy bypass at final attempt:** ✅ Accepting entropy-only failures at the final attempt is correct pragmatism. Shannon entropy over an 8-chapter window is an aggregate metric — a single chapter's opening style cannot meaningfully be retried into compliance. Logging the bypass as a warning is the right observability choice.

---

## 8. Per-Batch Retry Feedback — `buildEnhancedRetryFeedback`

On attempt 2+, the orchestrator:
1. Appends the prior raw LLM response as an `assistant` turn (attempts 2 and 3 only; final attempt omits this so the model rebuilds clean)
2. Appends a new `user` turn with `buildEnhancedRetryFeedback(errors, caseData, chapterRange, attempt, maxAttempts)`

The feedback function categorizes errors into buckets and emits targeted repair directives:

| Bucket | Detection pattern | Repair content |
|---|---|---|
| Clue early-placement | `"first quarter of the chapter"` or `"is present but"` | Move existing paragraphs before 25% mark; add inference paragraph immediately following |
| Clue absent | `"clue evidence … is absent"` | Attempt 2: two-paragraph sequence near start; Attempt 3: mandatory structure; Attempt 4+: REBUILD from scratch within first 300 words |
| Other clue | `"missing required clue obligation"`, `"clue visibility"` | Same as absent (graduated by attempt) |
| Word count | `/word count below (hard floor|preferred target)/i` | State exact target; expand with action beats, no recap |
| Scene grounding | `"scene location anchoring"`, `"grounding"` | Open with named location + 2 sensory cues + 1 atmosphere marker |
| Opening entropy | `"opening-style entropy too low"` | 5 prescribed opening patterns (dialogue, time anchor, motion, noun-phrase, temporal subordinate); DO NOT open with generic descriptive |
| Pronoun | `pronoun_gender_mismatch` or `/incorrect pronoun/i` | Per-failing-character directive: correct pronoun set, exact wrong forms found, instruction to fix all occurrences |
| Character names | `"character"`, `"name"` | Cast list reminder, walk-on anonymity rule |
| Setting drift | `"setting"`, `"location"` | Location type reminder |
| Discriminating test | `"discriminating test"` | Must be explicit, complete, reference specific clues |
| Prose quality | `"paragraph"`, `"chapter"` | Vary paragraph lengths, include sensory details |

**Structural guardrail:** if ≥ 3 directives are active simultaneously, a reminder appended: "paragraphs array must contain MULTIPLE separate strings—aim for 5–8."

### 8.A Assessment

**Bucketed feedback quality:** ✅ The 11-bucket error categorization is comprehensive, covering: early placement, absent clue, other clue, word count, scene grounding, opening entropy, pronoun, character names, setting drift, discriminating test, and prose quality. Each bucket emits a targeted repair directive rather than a generic retry instruction.

**Graduated escalation:** ✅ The three-tier attempt progression (suggest structure → mandate structure → rebuild from scratch) is well-calibrated. Attempt 2 provides contextual scaffolding; attempt 3 mandates a specific sequence; the final attempt omits the prior response entirely for a clean slate. This matches how a skilled editor would escalate directive language.

**Prior-response-as-assistant-turn:** ✅ Appending the model's own prior response as an assistant turn on attempts 2–3 is a sophisticated prompting technique. The model can perform targeted correction on a visible failure rather than regenerating from a mental model of what went wrong.

**Omitting prior response on final attempt:** ✅ Correct. By the final attempt, anchoring the model to its prior broken response would perpetuate the failure pattern. The clean rebuild allows the model to start fresh with only the repair directives.

**Structural guardrail (≥3 simultaneous directives):** ✅ The paragraph-structure reminder when many buckets fire simultaneously is a pragmatic safeguard against the model emitting a single-string chapter — a common failure when multiple constraints are active and attention is split across them.

**Gap — world document drop:** ❌ There is no feedback bucket for the scenario where `world_document` was truncated by budget pressure. If the block was dropped, the model had no voice guidance and the prose will be tonally generic. There is no mechanism to detect or flag this condition in retry feedback, nor any way to tell the model to infer voice from its remaining context.

---

## 9. Post-`generateProse` Processing

After `generateProse` returns:

### 9.1 First `applyDeterministicProsePostProcessing(prose, locationProfiles, castCharacters)`

Steps inside this function:
1. `enforceReadableParagraphFlow(paragraphs)` — split on double newline, enforce long paragraphs, normalize whitespace
2. Grounding lead detection: checks first paragraph for `hasAnchor`, `sensoryCount >= 2`, `hasAtmosphere`
3. If grounding insufficient: inject `buildDeterministicGroundingLead(chapterIndex, locationProfiles)` (5-template location opener)
4. `sanitizeProseText()` — NFC normalize, mojibake replacements, dialogue normalization
5. Template leakage scaffold detection (pattern: `At The [Location] … smell of … atmosphere ripe for revelation`) — replace with grounding lead
6. Long paragraph dedup via `seenLongParagraphs` fingerprint set
7. `repairChapterPronouns(chapter, castCharacters)` — deterministic pronoun repair

This call runs on the raw `generateProse` output.

### 9.2 ProseScorer Evaluation

`ProseScorer` runs `adaptProseForScoring(prose, cmlCase)` then `scorer.score(adapted)`.

Scores are upserted to the run's aggregator. Per-chapter details emitted to diagnostic log.

### 9.3 Batch Retry Surface Reporting

Any chapters that had retry failures during `generateProse` are logged as warnings but do **not** stop execution at this point.

### 9.A Assessment

**Deterministic repair design:** ✅ Handling all mechanically fixable issues without an LLM call is the right architectural choice. Season-word substitution, mojibake replacement, pronoun regex repair, and template leakage detection are deterministic rules that can be applied unconditionally and cheaply.

**Grounding lead templates:** ⚠️ Five hardcoded templates is a creative limitation. For a 15–20 chapter story where many chapters need grounding repair, template recycling becomes visible to readers. A location-aware selection from `locationProfiles` would narrow the repetition space with contextually relevant openers — currently the templates are generic and not tied to the actual scene location.

**Three-call redundancy:** ⚠️ Calling `applyDeterministicProsePostProcessing` three times (here, after schema validation, and after auto-fix) means the same repairs run across three pipeline stages. The function is idempotent so this is harmless, but it indicates the system cannot predict where drift will be introduced and defends at every stage boundary. A cleaner design would maintain a "clean" invariant between stages and only repair at known dirty transitions — specifically, the schema-retry path and the auto-fix path.

**Template leakage detection:** ✅ The specific pattern match for scaffold prose is an effective catch for a known LLM failure mode. Replacing the scaffold with a grounding lead ensures the chapter retains a located opening even after leakage removal.

**`sanitizeProseText` scope:** ✅ The 40+ mojibake replacement pairs and NFC normalization cover the most common encoding failure modes. Running this at every post-processing pass ensures the output is always encoding-clean before reaching validation.

---

## 10. Schema Validation — `validateArtifact("prose", prose)`

The prose object is validated against the `prose.schema.yaml` schema.

**On failure:**
- Schema errors are formatted as guardrail strings
- A full second call to `generateProse` is made, this time with `qualityGuardrails` augmented with the schema error messages
- The system message includes these guardrails inline
- If the second generation also fails schema: throw (no further retry)

**On success:** advance to story validation.

### 10.A Assessment

**Post-full-generation timing:** ⚠️ Schema validation fires after all N chapters are generated. A single schema failure therefore triggers a full `generateProse` re-run — all chapters regenerated from scratch. For a 15-chapter story this is the most expensive failure path in Agent 9, potentially doubling the total LLM call count.

**Schema failure frequency:** Schema failures should be rare in practice — the JSON output schema is in the developer block, `jsonrepair` is applied to the raw response, and the `audit` field strip is deterministic. The primary failure scenario is a structural nesting mismatch (e.g. an extra array level around chapters) that `jsonrepair` cannot resolve. The `qualityGuardrails` augmented with schema errors should address formatting issues on the retry, but not fundamental model-version incompatibilities.

**Single retry policy:** ✅ One additional full `generateProse` call with schema error guardrails is reasonable. If schema fails twice, throwing is correct — two structurally invalid responses from the same configuration suggest a fundamental prompt/model incompatibility rather than a random sampling failure.

**Per-batch schema validation alternative:** Validating schema per committed batch would catch failures earlier but requires a partial-prose schema that can accept incomplete story state, adding schema complexity. The current post-full-generation approach trades regeneration cost (rare but expensive) for schema simplicity.

---

## 11. Second `applyDeterministicProsePostProcessing` (Pre-Validation Pass)

A second call to `applyDeterministicProsePostProcessing` runs immediately before `validationPipeline.validate`. Code comment: "last opportunity for pronoun repair before validation".

This is identical to the first call — same function, same arguments. It catches any drift introduced between the first post-processing and the schema validation step.

### 11.A Assessment

**Justification:** ✅ The code comment ("last opportunity for pronoun repair before validation") is accurate. Between the first post-processing pass and this call, the schema validation retry — if it ran — will have regenerated all chapters from scratch, reintroducing any drift the first pass corrected. For the majority of runs with no schema failure this call is a cheap idempotent no-op. On the schema-retry path it is essential.

**Redundancy scope:** The second pass is primarily a safety net for the schema-retry case. A cleaner design would be an explicit `repairAfterSchemaRetry()` call that only fires on the retry path rather than re-running the full deterministic stack unconditionally. This would also make the code intent clearer to future maintainers who may not immediately recognise why an apparently redundant call is present.

---

## 12. Story Validation — `validationPipeline.validate`

Location: `StoryValidationPipeline`

Input: `storyForValidation` (prose reformatted as scenes), `{...cml, lockedFacts: annotatedLockedFacts}`

The pipeline runs all registered validators. The `lockedFacts` passed here carry `appearsInChapters` annotations (ANALYSIS_28 fix), which gates the `prose-consistency-validator` to only check chapters where a locked fact is expected to appear.

**Result handling:**
- `"passed"` → continue
- `"needs_review"` → log warning, continue
- Any other status → log first 10 errors and **throw**

### 12.A Assessment

**`annotatedLockedFacts` integration:** ✅ The strongest architectural feature in Agent 9. By scoping prose consistency checks to chapters where a locked fact is expected to appear (via `appearsInChapters`), the validation pipeline avoids false-positive failures in chapters where the locked fact logically cannot appear. This is a direct improvement over the pre-ANALYSIS_28 behaviour of checking all chapters unconditionally, which generated spurious errors for facts constrained to specific acts.

**`"needs_review"` handling:** ✅ Not throwing on `"needs_review"` is well-designed. It allows prose with borderline or subjective quality issues to be committed for human review rather than auto-regenerated. This is correct for issues where the validator may be over-sensitive rather than the prose being genuinely wrong.

**Throwing on other statuses:** ⚠️ The policy of throwing on any non-`needs_review`, non-`passed` status is strict. Its effectiveness depends entirely on validator calibration. An incorrectly calibrated validator that returns `"failed"` too eagerly will cause unnecessary full regenerations. The threshold between `"needs_review"` and other statuses should be carefully set in each registered validator.

**`storyForValidation` equivalence:** Validation runs on `storyForValidation` (a reformatted version of the prose), not directly on `ctx.prose`. If the reformatting is lossy, the validated version and the committed version are not strictly identical. For structural normalizations (whitespace, field ordering) this is acceptable. For content changes it should be explicitly verified.

---

## 13. Auto-Fix Pass — `validationPipeline.autoFix()`

After validation, `autoFix()` is called unconditionally. It applies all registered auto-fixers to the prose. Result is the post-fixed prose object.

### 13.A Assessment

**Unconditional execution:** ✅ Running `autoFix()` unconditionally after validation is correct. If validation passed, auto-fix is a no-op for issues that don't need fixing while still applying normalization. If validation surfaced `"needs_review"`, auto-fixers may resolve some of those issues.

**Knowledge gap:** ❌ ANALYSIS_29 does not document what the registered auto-fixers actually do. Without knowing their scope — whether they modify prose text, structural fields, or only metadata — it is not possible to assess whether they could introduce regression after the validated version was accepted. This is the largest knowledge gap in Sections 9–15. A companion analysis of each registered auto-fixer is needed for a complete assessment.

**Risk:** If any auto-fixer modifies prose paragraphs (e.g. injecting missing scene transitions or normalizing text), it could introduce character, plot, or clue inconsistencies absent from the validated version. The third `applyDeterministicProsePostProcessing` pass (Section 14) mitigates structural issues but would not catch new logical inconsistencies.

---

## 14. Third `applyDeterministicProsePostProcessing` (Post-Auto-Fix Pass)

A third call runs after `autoFix`. Same function, same arguments. Catches any structural drift introduced by auto-fixers.

### 14.A Assessment

**Post-auto-fix rationale:** ✅ Running `applyDeterministicProsePostProcessing` after `autoFix()` is the correct response to the unknown auto-fixer scope documented in Section 13.A. If any fixer modifies prose paragraphs, this pass re-applies season lock, mojibake repair, pronoun regex repair, and template leakage detection.

**Three-call redundancy pattern:** This is the third call to the same idempotent function across three pipeline stages (Section 9, Section 11, here). For a clean run (no schema retry, no auto-fixer mutations) all three calls are no-ops after the first. The pattern is acceptable defense-in-depth, but obscures the code's intent. Each call should bear a comment explaining the specific dirty-state scenario it guards against: (1) raw generation output, (2) schema-retry output, (3) auto-fixer output.

---

## 15. Release Gate — 12 Condition Categories

Location: `agent9-run.ts` lines ~1420–1600

Each condition evaluates a specific failure type. Conditions produce warnings (logged), hard-stops (both logged and added to `hardStopReasons[]`), or both.

| # | Condition | Trigger | Warning | Hard-stop |
|---|---|---|---|---|
| 1 | Fair play score < 60 or zero-score violations | `fairPlayAudit.score < 60` or `fairPlayAudit.violations.some(v => v.score === 0)` | ✓ | ✓ |
| 2 | Critical continuity | `identity_role_alias_break` or `missing_case_transition_bridge` in validation errors | ✓ | ✗ |
| 3 | Temporal contradiction | `temporal_contradiction` type in validation errors | ✓ | ✓ |
| 4 | Investigator role drift | `investigator_role_drift` type in validation errors | ✓ | ✗ |
| 5 | Mojibake / encoding artifact remains | `hasMojibake(prose)` after all post-processing | ✓ | ✓ |
| 6 | Illegal control chars / encoding corruption | `hasIllegalChars(prose)` | ✓ | ✓ |
| 7 | Discriminating test / CML test coverage | `missing_discriminating_test` or `cml_test_not_realized` | ✓ | ✗ |
| 8 | Suspect elimination coverage incomplete | `hasSuspectEliminationCoverageFailure(validationReport)` | ✓ | ✓ |
| 9 | Placeholder token leakage | `roleSurname > 0` OR standalone unexplained placeholder `>= 2` | ✓ | ✓ |
| 10 | Duplicate chapter heading artifacts | `evaluateChapterHeadingArtifacts(prose).hasDuplicates` | ✓ | ✓ |
| 11 | Readability density exceeded | `evaluateProseReadability(prose).densityExceeded` | ✓ | ✗ |
| 12 | Scene grounding coverage < 90% | `evaluateSceneGroundingCoverage(prose, locationProfiles).coverage < 0.9` | ✓ | ✗ |
| 13 | NSD reveals lacking prose evidence (revealedWithoutEvidence) | `revealedWithoutEvidence.length > 0` | ✓ | ✓ |

After evaluating all conditions:
- Warnings → emitted to `ctx.warnings` / diagnostic log
- If `hardStopReasons.length > 0` → **throw** with all hard-stop reasons concatenated

### 15.A Assessment

**Coverage:** ✅ 13 conditions comprehensively cover the major failure categories: fairness (1), continuity (2, 4), temporal integrity (3), encoding integrity (5, 6), mystery mechanics (7, 8, 13), output cleanliness (9, 10), and prose quality (11, 12).

**Hard-stop vs warning calibration:**

| # | Condition | Current | Assessment |
|---|---|---|---|
| 1 | Fair play score < 60 | Hard-stop | ✅ Correct |
| 2 | Critical continuity | Warning | ⚠️ Identity/role alias breaks are factual errors; arguably should be a hard-stop |
| 3 | Temporal contradiction | Hard-stop | ✅ Correct |
| 4 | Investigator role drift | Warning | ⚠️ Ambiguous severity; warning is defensible |
| 5 | Mojibake remains | Hard-stop | ✅ Correct |
| 6 | Illegal chars | Hard-stop | ✅ Correct |
| 7 | Discriminating test uncovered | Warning | ❌ Should be a hard-stop — the discriminating test is the core mechanism of a whodunnit. A story without it dramatized in prose is fundamentally incomplete as a mystery |
| 8 | Suspect elimination incomplete | Hard-stop | ✅ Correct |
| 9 | Placeholder leakage | Hard-stop | ✅ Correct |
| 10 | Duplicate heading artifacts | Hard-stop | ✅ Correct |
| 11 | Readability density | Warning | ✅ Appropriate — subjective quality metric |
| 12 | Scene grounding < 90% | Warning | ⚠️ 10% ungrouped chapters in a 15-chapter story = 1–2 chapters with no location anchor. Could reasonably be a soft hard-stop at < 80% |
| 13 | NSD reveals without prose evidence | Hard-stop | ✅ Correct — direct fair-play integrity issue |

**Key calibration gap — condition 7:** The discriminating test is the mechanism by which the detective proves the culprit beyond reasonable doubt. A whodunnit where this test is absent from the prose is structurally incomplete as a mystery genre work. Making condition 7 a warning allows such stories to be committed and delivered to readers. This is the most significant calibration issue in the release gate.

**Section numbering note:** The step sequence in Section 25 refers to "12 categories" for the release gate. This section documents 13 conditions. The count in Section 25 is off by one.

---

## 16. Context Commit

If all gates pass:

```typescript
ctx.prose = prose;
ctx.validationReport = validationReport;
```

These are the only two mutations agent 9 makes to `ctx`.

### 16.A Assessment

**Simplicity:** ✅ Two mutations, no side effects, no conditional branching. The context commit is minimal and correct.

**`ctx.prose` vs validated version:** The prose committed to `ctx.prose` is the post-auto-fix, post-third-post-processing version. The story validation in Section 12 ran on `storyForValidation` — a reformatted representation of the pre-auto-fix prose. If `autoFix` changed any prose paragraphs, the committed version may differ from the validated version. For structural normalizations this is acceptable; for content changes it is a subtle correctness gap.

**`ctx.validationReport` scope:** The validation report captures story validation results (Section 12). It does not include release gate warnings from Section 15. If a story passes the release gate with warnings, those warnings are emitted to `ctx.warnings` and logs but are not stored in `ctx.validationReport`. Downstream consumers reading only `ctx.validationReport` will not see release gate warnings.

---

## 17. Post-`generateProse` Atmosphere Repair

After all chapters are committed in `generateProse` (before returning), the function runs:

```typescript
const recurringPhrases = detectRecurringPhrases(chapters);
if (recurringPhrases.length > 0) {
  const repairedChapters = await runAtmosphereRepairIfNeeded(client, chapters, recurringPhrases, model, runId, projectId);
  chapters.splice(0, chapters.length, ...repairedChapters);
}
```

### 17.1 `detectRecurringPhrases(chapters, ngramSize=7, threshold=3)`

- Tokenizes all chapter text to 7-grams
- Filters n-grams with ≥ 3 content words (length > 3, not in stopword set)
- Returns phrases appearing in ≥ `threshold` (3) distinct chapters, sorted by chapter-hit count descending, max 15 phrases

### 17.2 `runAtmosphereRepairIfNeeded(client, chapters, bannedPhrases, ...)`

- Identifies chapters containing at least one banned phrase
- For each affected chapter (max 8):
  - Sends only the phrases actually present in that chapter to the LLM
  - System: "You are a prose variety assistant. For each phrase provide one fresh, scene-specific alternative."
  - User: numbered list of present phrases, schema `{"replacements":[{"original":"...","replacement":"..."}]}`
  - Temperature: 0.7; MaxTokens: `max(400, len(phrases) × 80)`
  - Applies replacements via regex on original paragraphs (ANALYSIS_20 phrase-substitution, not wholesale rewrite)
  - Preservation: capitalisation preserved, surrounding prose untouched

This is a **best-effort** repair — if the LLM returns unparseable output, the original chapter is kept.

### 17.A Assessment

**Placement:** ✅ Running atmosphere repair inside `generateProse`, after all chapters are committed but before returning, is the correct placement. Cross-chapter phrase frequency can only be meaningfully computed once all chapters exist.

**7-gram threshold design:** ✅ 7-grams are specific enough to catch template phrases ("the smell of old wood and stagnant air") while avoiding false positives on incidental shared vocabulary. The ≥3 distinct-chapter threshold filters coincidental repetitions in favour of structural template leakage.

**Phrase-substitution approach:** ✅ Replacing specific phrases rather than rewriting chapters preserves the surrounding prose context and minimizes the risk of introducing inconsistencies. This is the correct repair philosophy — surgical and minimal.

**Capitalisation preservation:** ✅ First-character capitalisation is preserved in replacements. A sentence-opening phrase will be replaced with a capitalised alternative.

**Best-effort failure mode:** ✅ If the LLM returns unparseable output, the original chapter is kept. Atmosphere repair is a quality enhancement, not a correctness requirement — falling back to the original is the right choice.

**Temperature 0.7 for replacements:** ✅ Higher temperature than main generation is appropriate for phrase replacement — it increases vocabulary range across alternatives, preventing the replacement model from suggesting the same phrase again in similar contexts.

**8-chapter limit:** ⚠️ For a 20-chapter story with widespread template leakage, only the first 8 affected chapters are repaired. The selection criteria (which chapters fall within the first 8) is not documented. If the affected chapters are ordered by phrase-hit count, high-hit chapters would be prioritised; if by chapter index, later chapters could be left unrepaired with the same recurring phrases.

---

## 18. `onBatchComplete` Callback (Orchestrator Side)

When `generateProse` calls `inputs.onBatchComplete(chapters, chapterStart, chapterEnd, retryErrors)`:

The orchestrator (`agent9-run.ts`):
1. **Updates NSD clues:** for each chapter, extracts detected clue IDs and calls `updateNSD(narrativeState, detectedClues)` — appends to `cluesRevealedToReader`
2. **Per-batch scoring:** calls `computeProseChapterScoreSeries(batch, priorChapters)` on the newly committed chapters and upserts to the run's aggregator
3. **Progress event:** emits a `prose_batch_complete` progress event with chapter range, scores, and any retry errors
4. **Run history panel:** retry errors are surfaced in the UI panel

### 18.A Assessment

**NSD update integration:** ✅ Updating `cluesRevealedToReader` immediately at each batch boundary (via `onBatchComplete → updateNSD`) ensures the NSD block in the next batch's prompt accurately reflects what has already been revealed to the reader. Without this, the model could re-reveal clues in later chapters, breaking the fair-play contract.

**Per-batch scoring as quality feedback loop:** ✅ Computing provisional chapter scores immediately on commit and forwarding last 4 to `rollingProvisionalFeedback` is the mechanism that gives Agent 9 a quality signal during generation rather than only after it. This allows the model to correct quality deficits two chapters later, not only after the full story is complete.

**`prose_batch_complete` progress event:** ✅ Surfacing chapter range, scores, and retry errors in real time enables the UI panel to show generation progress. Making retry errors explicitly visible in the panel is important for identifying which chapters are problematic while the run is still in progress.

**Separation of concerns:** ✅ The callback pattern (Agent 9's generation loop calls `inputs.onBatchComplete`; the orchestrator implements it in `agent9-run.ts`) is a clean separation between generation logic and orchestration logic. Agent 9's core loop does not need to know about the aggregator or progress events.

---

## 19. `generateProse` Return Value

```typescript
{
  status: "draft";
  tone: string;                        // narrativeStyle
  chapters: ProseChapter[];            // all committed chapters
  cast: string[];                      // character names
  note: string;                        // retry summary
  cost: number;                        // aggregate Azure OpenAI cost ($)
  durationMs: number;                  // total wall time
  prompt_fingerprints?: Array<{        // sha256 hash per chapter, first-attempt only
    chapter: number;
    hash: string;
    section_sizes: Record<string, number>;  // chars per prompt block (E5 traceability)
  }>;
  validationDetails?: {
    totalBatches: number;
    batchesWithRetries: number;
    failureHistory: Array<{ batchIndex, chapterRange, attempt, errors }>;
  };
  underflow: UnderflowTelemetry;       // expansion attempt/recovered/failed counts
  proseLinterStats: ProseLinterStats;  // entropy/fingerprint/ngram check counts
}
```

### 19.A Assessment

**Completeness:** ✅ The return value is richly documented. Cost, duration, chapter list, retry summary, prompt fingerprints, validation details, underflow telemetry, and prose linter stats provide a complete picture of the generation run.

**Prompt fingerprints (E5 traceability):** ✅ SHA-256 hashes of first-attempt prompts per chapter, with `section_sizes` recording character counts per prompt block, provide deterministic traceability for debugging. The section sizes are the key diagnostic for understanding what context was and wasn't included in each prompt.

**Gap — dropped block report:** ❌ The return value does not include a record of which prompt blocks were truncated or dropped by budget pressure. The `section_sizes` field records what was included but not what was excluded. Knowing which blocks dropped in a given run would be the most actionable diagnostic for prose quality issues caused by budget pressure (e.g. world document dropped in run X, chapter Y scored poorly).

**`validationDetails.failureHistory`:** ✅ A complete retry audit trail per batch (batchIndex, chapterRange, attempt, errors) enables reconstruction of the exact state at each failed attempt when combined with prompt fingerprints.

**Omission — schema retry indicator:** The return value does not have an explicit field indicating whether a schema validation retry occurred. Callers can infer this from cost/duration spikes but a boolean `schemaRetryOccurred` would be cleaner.

---

## 20. Reprocess Paths Summary

Agent 9 has five distinct LLM reprocess / repair paths:

| Path | Trigger | LLM calls | Same prompt? |
|---|---|---|---|
| **Per-batch retry** | Any hard error in batch validation | 1 per retry (up to `maxBatchAttempts`) | No — retry feedback user turn appended; prior response appended as assistant turn (attempts 2/3) |
| **Underflow expansion** | Chapter below hard floor or below preferred target | 1 per chapter per attempt | No — expansion-specific short prompt |
| **Pronoun retry** | `pronoun_gender_mismatch` survives deterministic repair | Rolled into per-batch retry | No — pronoun feedback bucket appended |
| **Schema validation repair** | `validateArtifact("prose", prose)` fails | Full re-call to `generateProse` | No — schema errors added to `qualityGuardrails` |
| **Atmosphere repair** | `detectRecurringPhrases` finds ≥ 3 chapters with common phrase | 1 per affected chapter (max 8) | No — phrase-synonym-only prompt |

### 20.A Assessment

**Coverage:** ✅ The five paths cover all known failure modes: structural/content failure (per-batch retry), word count underflow (underflow expansion), pronoun drift (absorbed into per-batch retry with zero additional overhead), schema failure (full regeneration), and template fatigue (atmosphere repair).

**Escalation hierarchy:** ✅ The paths escalate in cost proportionally to failure severity: underflow expansion (1 targeted call per chapter), pronoun retry (0 extra calls, rolled into existing batch attempt), atmosphere repair (≤8 calls post-generation), per-batch retry (up to `maxBatchAttempts−1` extra calls per scene), schema retry (full N-chapter regeneration). This cost ordering matches the expected severity hierarchy well.

**Gap — quality-signal-triggered regeneration:** ❌ Low provisional scores from `ProseScorer` do not trigger any regeneration path. A chapter that passes all validation gates with a low prose quality score is committed and cannot be regenerated without human intervention. Given that scores are available in real time via `onBatchComplete`, there is a missed opportunity to trigger a targeted quality retry when a chapter scores significantly below the story average.

**Gap — world document absence:** ❌ There is no regeneration path triggered by `ctx.worldDocument` being absent. Quality degradation caused by missing voice guidance would only surface as low ProseScorer scores — which as noted above, don't trigger regeneration. This is a structural gap: the most quality-defining input can be absent with no retry consequence.

**Schema retry idempotency risk:** If a schema failure is caused by a model-version issue where the model consistently emits a different JSON structure, the schema retry will fail again. The `qualityGuardrails` augmented with schema errors addresses formatting instructions but not structural model incompatibilities.

---

## 21. Key Configuration Values (from `generation-params.yaml`)

| Parameter | Location | Observed value |
|---|---|---|
| `default_max_attempts` | `agent9_prose.generation` | 4 |
| `max_batch_size` | `agent9_prose.prose_model` | 1 |
| `temperature` | `agent9_prose.prose_model` | 0.42 |
| `preferred_chapter_words.medium` | `agent9_prose.word_policy` | ~1,300 |
| `hard_floor_relaxation_ratio` | `agent9_prose.word_policy` | 0.77 |
| `min_hard_floor_words` | `agent9_prose.word_policy` | ~1,001 |
| `pronoun_checking_enabled` | `agent9_prose.validation` | true |
| Target token budget | hardcoded in `buildProsePrompt` | 6,200 |
| MaxTokens (medium chapter) | hardcoded in `generateProse` | 4,500 |
| MaxTokens (long chapter) | hardcoded in `generateProse` | 6,000 |
| Atmosphere repair temperature | hardcoded in `runAtmosphereRepairIfNeeded` | 0.7 |
| Entropy threshold (late story) | `agent9_prose.style_linter.entropy.standard` | 0.80 |

### 21.A Assessment

**Configuration completeness:** ✅ The exposed parameters (max_attempts, max_batch_size, temperature, word targets, style linter thresholds) are the right choices for runtime tuning without code changes. They directly affect generation behaviour while keeping implementation details hidden.

**Hardcoded values:** ⚠️ The 6,200-token context budget and per-chapter MaxTokens (4,500 / 6,000) are hardcoded. The context budget in particular is a critical quality lever — it directly trades off between prompt richness and API cost. Making it configurable per model in `generation-params.yaml` would allow it to be raised for higher-capacity models without code changes.

**Table accuracy — two incorrect values:**
- `preferred_chapter_words.medium` is listed as `~1,300`. The actual value in `generation-params.ts` is `1,600`. The table has taken the `short` target value instead.
- `min_hard_floor_words` is listed as `~1,001`. The actual config entry is `600` (an absolute minimum; the computed hard floor per target length is `floor(preferred × 0.77)`). The 1,001 figure is the computed floor for a _short_ chapter, not a global minimum in the config.

**`default_max_attempts` discrepancy:** The table lists 4 but the current `generation-params.ts` value is 3. The table may reflect an earlier version of the configuration.

**Atmosphere repair temperature:** Hardcoded at 0.7 in `runAtmosphereRepairIfNeeded`. Moving this to configuration would allow tuning for models that produce more stable phrase replacements at lower temperatures.

---

## 22. Helper Functions Defined in `agent9-run.ts`

| Function | Purpose |
|---|---|
| `sanitizeProseText(value)` | NFC normalize, mojibake replacements, dialogue normalization |
| `proseMojibakeReplacements` | 40+ char→char replacements for common UTF-8 mojibake patterns |
| `enforceReadableParagraphFlow(paragraphs)` | Paragraph splitting on double-newline, long-paragraph enforcement |
| `buildDeterministicGroundingLead(chapterIndex, locationProfiles)` | 5-template location opener used when grounding is absent |
| `applyDeterministicProsePostProcessing(prose, locationProfiles, cast)` | Orchestrates all deterministic repairs: paragraph flow, grounding, sanitize, leakage, dedup, pronoun repair |
| `normalizeChapterTitle(value)` | Strips "Chapter N:" prefixes |
| `sanitizeProseResult(prose)` | Applies `sanitizeProseText` across all chapters |
| `getExpectedClueIdsForVisibility(cmlCase, clueDistribution)` | Union of 4 clue ID sources for NSD/clue-visibility check |
| `evaluateProseReadability(prose)` | Dense chapter / under-paragraph counts |
| `evaluateSceneGroundingCoverage(prose, locationProfiles)` | % grounded openings |
| `evaluatePlaceholderLeakage(prose)` | roleSurname / standalone / generic patterns |
| `evaluateChapterHeadingArtifacts(prose)` | Duplicate heading detection |
| `loadWritingGuides(workspaceRoot)` | Reads humour + craft guide files from disk |
| `isDiscriminatingTestCoverageError(e)` | Error classifier |
| `isSuspectClosureCoverageError(e)` | Error classifier |
| `isCulpritEvidenceChainCoverageError(e)` | Error classifier |
| `isSuspectEliminationCoverageError(e)` | Error classifier |

### 22.A Assessment

**Coverage:** ✅ The helper function set cleanly separates deterministic repair operations (pronoun, paragraph flow, grounding, sanitize, mojibake, dedup), evaluation operations (readability, grounding coverage, placeholder, headings), and error classifiers for release gate routing. The separation is well-structured.

**`buildDeterministicGroundingLead` limitation:** ⚠️ Five hardcoded templates is a creative limitation. For a 15–20 chapter story where many chapters need grounding repair, template recycling becomes visible. The templates are generic and not location-specific; drawing the template vocabulary from `locationProfiles` would produce contextually appropriate openers and reduce repetition.

**`loadWritingGuides` I/O dependency:** ❌ Disk I/O in a critical-path helper is a fragility. The function is called once per Agent 9 invocation. If the files are absent, large, or temporarily locked, this blocks agent startup. Caching the guide content in memory after first successful load would eliminate this startup dependency.

**`anonymizeUnknownTitledNames` omission:** ❌ This function is used in `sanitizeScenesCharacters` and `sanitizeGeneratedChapter` as part of the phantom name removal system, but it is not listed in the Section 22 table. It should be documented here.

**Error classifiers:** The four error-classifier predicates (`isDiscriminatingTestCoverageError`, `isSuspectClosureCoverageError`, `isCulpritEvidenceChainCoverageError`, `isSuspectEliminationCoverageError`) are string-matching classifiers operating on error message text. This is fragile — if error message text changes, classifiers silently break without a compile-time error. A typed error hierarchy would be more robust.

---

## 23. Key Prompt-Building Functions in `agent9-prose.ts`

| Function | Line | What it builds |
|---|---|---|
| `buildProsePrompt` | ~2600 | Main prompt assembler — all 3 messages |
| `buildTimelineStateBlock` | 1113 | Frozen timeline facts: temporal lock, anchors, locked time phrases |
| `buildChapterObligationBlock` | 1145 | Per-chapter location/clue/clearance/test obligations |
| `detectRecurringPhrases` | 1256 | Cross-chapter phrase dedup (7-gram, 3+ chapter threshold) |
| `buildClueDescriptionBlock` | 1290 | Clue descriptions + mapping-only clues from clue_to_scene_mapping |
| `buildNSDBlock` | 1350 | NSD block: locked facts, character pronouns, clues already revealed |
| `buildPronounAccuracyBlock` | 1393 | 9-rule mandatory continuity contract + per-character pronoun table + non-binary warning |
| `formatProvisionalScoringFeedbackBlock` | 1471 | Last 2 chapter scores forwarded as corrective targets |
| `stripLocationParagraphs` | 1603 | Removes `paragraphs` array from location profiles before injection |
| `buildWorldBriefBlock` | ~2100 | World Document block: era, season lock, story theme, emotional arc, character voices, break moment, reveal implications |
| `buildContextSummary` | ~2200 | User message preamble: title, era, setting, crime, culprit, cast with pronouns |
| `buildProseRequirements` | ~2250 | CML prose_requirements block: discriminating test scene, clearance scenes, revelation scene, identity rules, clue mapping |
| `extractChapterSummary` | 2262 | Extracts characters present, setting terms, key events for continuity context |
| `buildContinuityContext` | 2313 | Continuity block from prior chapter summaries |
| `buildSceneGroundingChecklist` | 2376 | Per-chapter location anchor + sensory requirement checklist |
| `validateChecklistRequirements` | 2418 | Validates discriminating test clue IDs and suspects exist in registry/cast |
| `buildDiscriminatingTestChecklist` | 2470 | Late-story checklist: test type, evidence, execution, suspect elimination, prose quality |
| `extractClueLocations` | 2592 | Maps clue IDs to Act/Scene from outline |
| `buildEnhancedRetryFeedback` | ~2650 | Categorized retry feedback with micro-prompt repair directives |
| `attemptUnderflowExpansion` | ~2900 | Underflow expansion LLM call (short prompt, single chapter) |
| `runAtmosphereRepairIfNeeded` | ~3060 | Atmosphere phrase-substitution repair (ANALYSIS_20) |
| `generateProse` | 3208 | Main exported async function |

### 23.A Assessment

**Function coverage:** ✅ All major prompt sections are implemented as dedicated functions with well-scoped responsibilities. The separation between obligation contract (`buildChapterObligationBlock`), world brief (`buildWorldBriefBlock`), continuity (`buildContinuityContext`), grounding checklist, discriminating test checklist, retry feedback, underflow expansion, and atmosphere repair is clean and maintainable.

**`buildProsePrompt` size:** ⚠️ The main assembler at line ~2600 carries the entire assembly logic: 17-block budget allocation, developer section construction, checklist formatting, and 3-message orchestration. Its length makes it the highest-complexity single function in Agent 9. Decomposing the developer section and checklist construction into distinct named functions would improve readability without changing behaviour.

**`formatProvisionalScoringFeedbackBlock` window size:** ⚠️ Only the last 2 chapter scores are forwarded (`.slice(-2)`). For a story where the first 8 chapters had persistent quality issues only partly resolved, the most recent 2 scores may not represent the full quality trajectory. Widening to 3–4 scores would provide a more robust signal, particularly in the middle acts of a 15+ chapter story.

**`buildDiscriminatingTestChecklist` pre-validation:** ✅ Validating that clue IDs and suspect names in the discriminating test exist in the registry and cast before building the checklist is a strong correctness guard. The prompt will not reference phantom clue IDs or non-existent suspects.

**`buildProseRequirements` cost-framing:** ✅ The validation consequence warning ("story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate") is an effective concrete framing. Monetary cost framing has been shown to improve LLM compliance with critical constraints.

**`buildContextSummary` non-binary reminder:** ✅ The inline pronoun reminder appended to the user message for non-binary cast members (after cast list and before scene JSON) ensures the proximal instruction — the last thing the model reads before generating — contains the explicit singular-they correction. This is the correct placement for highest-impact instructions.

---

## 24. Actual Prompt Files Available for Cross-Reference

All 9 prompt sample files are in `documentation/analysis/`:

| File | Run ID | Chapter(s) | Story |
|---|---|---|---|
| PROMPT_01.txt | `run_9f50b70b` | Ch1 | The Clockwork Conundrum |
| PROMPT_01_ANALYSIS.md | `run_9f50b70b` | Ch1 | analysis of PROMPT_01 |
| PROMPT_02.md | `run_71449e98` | Ch5 | Time's Deception |
| PROMPT_02_ANALYSIS.md | `run_71449e98` | Ch5 | analysis |
| PROMPT_03.md | — | — | — |
| PROMPT_03_ANALYSIS.md | — | — | analysis |
| PROMPT_04.md | — | — | — |
| PROMPT_05.md | — | — | — |
| PROMPT_05_ANALYSIS.md | — | — | analysis |
| PROMPT_06.md | — | — | — |
| PROMPT_06_ANALYSIS.md | — | — | analysis |
| PROMPT_07.md | — | — | — |
| PROMPT_07_ANALYSIS.md | — | — | analysis |
| PROMPT_08.md | — | — | — |
| PROMPT_08_ANALYSIS.md | — | — | analysis |
| PROMPT_09.md | — | — | — |
| PROMPT_09_ANALYSIS.md | — | — | analysis |

These files contain actual LLM prompt/response pairs captured during live runs.

### 24.A Assessment

**Traceability value:** ✅ Capturing actual LLM prompt/response pairs during live runs is excellent engineering practice. These files provide a direct debugging surface for prompt anatomy analysis that cannot be reconstructed from logs alone.

**Coverage gap:** ❌ Only PROMPT_01 and PROMPT_02 have paired analysis documents. PROMPT_03 through PROMPT_09 have no analysis. For a thorough assessment of prompt effectiveness across different story types, run configurations, failure modes, and model versions, all 9 prompt files should have analysis documents.

**Run ID linkage:** ✅ Each prompt file is linked to its run ID. This enables cross-referencing with run quality reports in `reviews/` to correlate specific prompt content with final story quality scores.

**Content diversity gap:** The two analyzed prompts cover a 5-character binary-gender cast (Chapter 1) and a different 5-character story (Chapter 5). Coverage of longer-cast stories, non-binary cast members, long-target-length runs, and retry-path prompts (the `buildEnhancedRetryFeedback` content) would provide a more complete picture of how the prompt adapts across run configurations.

---

## 25. Complete Step Sequence (Annotated)

```
runAgent9(ctx)
│
├── [1] Extract all inputs from ctx (cml, cast, profiles, outline, etc.)
│
├── [2] Define baselineProseGuardrails (3 hardcoded rules)
│
├── [3] Build annotatedLockedFacts
│       clueIdToChapters map ← narrative.acts[].scenes[].cluesRevealed
│       for each lockedFact: token match vs clue keywords (≥2 match → appearsInChapters)
│
├── [4] initNarrativeState(annotatedLockedFacts, genderMap)
│       → NarrativeState {lockedFacts, characterPronouns, cluesRevealedToReader:[]}
│
├── [5] generateProse(client, inputs)         [packages/prompts-llm/src/agent9-prose.ts]
│   │
│   ├── [5a] Per-batch loop (default 1 scene per batch)
│   │   │
│   │   ├── [5a.i] buildChapterRequirementLedger (word targets, required clue IDs)
│   │   │
│   │   ├── [5a.ii] Per-attempt loop (1..maxBatchAttempts)
│   │   │   │
│   │   │   ├── [5a.ii.A] buildProsePrompt(...)
│   │   │   │   ├── system:  character rules + 17 context blocks (budgeted)
│   │   │   │   ├── user:    obligation contract + timeline state + context summary + scenes JSON
│   │   │   │   └── user:    checklist (locked phrases, season, early clues, pronoun audit)
│   │   │   │
│   │   │   ├── [5a.ii.B] if attempt>1: append assistant turn (prior response) + retry feedback
│   │   │   │
│   │   │   ├── [5a.ii.C] client.chat(...) [Azure OpenAI LLM call]
│   │   │   │
│   │   │   ├── [5a.ii.D] parseProseResponse (JSON.parse + jsonrepair + stripAuditField)
│   │   │   │
│   │   │   ├── [5a.ii.E] for each chapter:
│   │   │   │   ├── enforceMonthSeasonLockOnChapter (deterministic)
│   │   │   │   ├── sanitizeGeneratedChapter (phantom name removal)
│   │   │   │   ├── single-paragraph split (if overlong)
│   │   │   │   ├── repairChapterPronouns (deterministic)
│   │   │   │   ├── evaluateCandidate (hard structure + content + obligation checks)
│   │   │   │   ├── if underflow: attemptUnderflowExpansion (LLM) → re-evaluate
│   │   │   │   └── pronounValidator.validate → targeted repair → re-validate
│   │   │   │
│   │   │   ├── [5a.ii.F] lintBatchProse (entropy + fingerprint + ngram)
│   │   │   │
│   │   │   ├── [5a.ii.G] if batchErrors: store lastBatchErrors, throw if final attempt
│   │   │   │
│   │   │   └── [5a.ii.H] commit batch: chapters[], chapterSummaries[]
│   │   │       update liveNarrativeState via updateNSD()
│   │   │       feed scores to rollingProvisionalFeedback
│   │   │       call inputs.onBatchComplete(chapters, chapterStart, chapterEnd, errors)
│   │   │
│   │   └── [5b] if not batchSuccess: throw
│   │
│   ├── [5c] detectRecurringPhrases → runAtmosphereRepairIfNeeded (LLM, phrase substitution)
│   │
│   └── [5d] validateChapterCount, compute cost/duration, return ProseGenerationResult
│
├── [6] applyDeterministicProsePostProcessing (1st pass)
│
├── [7] ProseScorer evaluation → upsert to aggregator
│
├── [8] Surface batch retry warnings
│
├── [9] validateArtifact("prose", prose)
│   └── if fail: schema repair retry (full generateProse call with schema error guardrails)
│
├── [10] applyDeterministicProsePostProcessing (2nd pass — pre-validation)
│
├── [11] validationPipeline.validate(story, cml + annotatedLockedFacts)
│   └── if fail (not needs_review): throw
│
├── [12] validationPipeline.autoFix()
│
├── [13] applyDeterministicProsePostProcessing (3rd pass — post-auto-fix)
│
├── [14] Release gate evaluation (12 categories)
│   └── if hardStopReasons.length > 0: throw
│
└── [15] ctx.prose = prose; ctx.validationReport = validationReport
```

### 25.A Assessment

**Accuracy:** ✅ The step sequence correctly represents the call hierarchy from `runAgent9` through to context commit. Branching at step [9] (schema retry looping back to `generateProse`), step [11] (throw on validation failure), and step [14] (throw on hard-stop conditions) are all correctly represented.

**Step [14] condition count discrepancy:** ❌ Step [14] is labeled "Release gate evaluation (12 categories)" but Section 15 of this document defines 13 conditions. The step sequence count is off by one.

**Atmosphere repair placement:** ✅ Step [5c] (`detectRecurringPhrases → runAtmosphereRepairIfNeeded`) is correctly positioned inside `generateProse` before the return value is computed. This matches the actual code structure — atmosphere repair runs after all batch commits are complete but before `generateProse` returns the `ProseGenerationResult`.

**`applyDeterministicProsePostProcessing` multiplicity:** ✅ All three calls (steps [6], [10], [13]) are represented with their correct stage descriptions. The sequence makes the three-call pattern visible, which helps reviewers identify the redundancy discussed in Section 9.A.

**Missing feedback loop representation:** ⚠️ The step sequence does not show where `rollingProvisionalFeedback` is fed from the orchestrator side (`onBatchComplete`) back into `generateProse` for subsequent batches. This feedback loop is central to the quality mechanism and its absence from the sequence makes it non-obvious to new readers how quality signals propagate during generation.

**`liveNarrativeState` vs `inputs.narrativeState`:** The sequence correctly shows that `liveNarrativeState` is updated within the generation loop (step [5a.ii.H] commit). The initial deep copy from `inputs.narrativeState` (Section 3.3) is implicit in step [5] initialization but could be shown explicitly to clarify why the outer agent's state is not mutated.

---

## 26. Proposed Fixes for All Identified Issues

**Scope:** This section consolidates every issue flagged in the `.A Assessment` subsections (Sections 1–25) into actionable fix proposals. Fixes are grouped by root-cause theme. Each fix identifies the affected section(s), the root cause, the proposed solution, and the implementation surface. Not yet implemented.

---

### 26.1 Correctness — Config Table Inaccuracies (Section 21.A)

**Issues:**
- `preferred_chapter_words.medium` is listed as `~1,300`; actual value in `generation-params.ts` is `1,600`.
- `min_hard_floor_words` is listed as `~1,001`; actual config entry is `600`.
- `default_max_attempts` is listed as `4`; current code value is `3`.

**Root cause:** The Section 21 table was authored at an earlier version of the configuration and was not updated when `generation-params.ts` changed.

**Fix:** Correct the three values in the table. Add a note that the `~1,001` figure is the computed hard floor for a *short* chapter (`floor(1300 × 0.77) = 1001`), not a raw config value, and the raw config `min_hard_floor_words = 600` is the safety minimum.

**Surface:** Documentation only — Section 21 table.

---

### 26.2 Correctness — Step Sequence Gate Count (Section 25.A)

**Issue:** Step [14] in Section 25 is labeled "Release gate evaluation (12 categories)" but Section 15 documents 13 conditions.

**Root cause:** Condition 13 (NSD reveals without prose evidence) was added after the step sequence was originally written and the count was not updated.

**Fix:** Change the label in Step [14] to "Release gate evaluation (13 conditions)". Also correct the title of Section 15 from "12 Condition Categories" to "13 Condition Categories" for consistency.

**Surface:** Documentation only — Section 15 heading and Section 25 step [14] label.

---

### 26.3 Correctness — Section 1 Input Table Agent Labels (Section 1.A)

**Issue:** The input table in Section 1 maps `ctx` fields to completely wrong agent numbers throughout (e.g., "Agent 1 — CML generator" when CML is produced by Agent 3; "Agent 8 — Hard logic devices" when Agent 3b produces hardLogicDevices).

**Root cause:** The table was originally authored with placeholder agent numbers that did not reflect the actual pipeline defined in ANALYSIS_30.

**Fix:** Replace the entire table with the correct mapping verified against ANALYSIS_30:

| Correct agent | Role | ctx field |
|---|---|---|
| Agent 3 | CML generator | `ctx.cml` |
| Agent 2 | Cast design | `ctx.cast` |
| Agent 2b | Character profiles | `ctx.characterProfiles` |
| Agent 2c | Location profiles | `ctx.locationProfiles` |
| Agent 2d | Temporal context | `ctx.temporalContext` |
| Agent 2e | Background context | `ctx.backgroundContext` |
| Agent 3b | Hard logic devices | `ctx.hardLogicDevices` |
| Agent 5 | Clue distribution | `ctx.clueDistribution` |
| Agent 6 | Fair play audit | `ctx.fairPlayAudit` |
| Agent 6.5 | World builder | `ctx.worldDocument` |
| Agent 7 | Narrative outline | `ctx.narrative` |
| Agent 1 | Setting refinement | `ctx.settingRefinement` |

**Surface:** Documentation only — Section 1 table.

---

### 26.4 Quality — Elevate `world_document` to Critical Priority (Section 4.A, Section 20.A)

**Issue:** `world_document` is classified as "high" priority in `buildPromptContextBlocks`, making it droppable under token budget pressure. It contains the most quality-defining inputs: character voice sketches, emotional arc turning points, humour placement map, era texture, and the authoritative season lock (WORLD FIX A). There is no regeneration path, warning, or feedback bucket triggered by its absence (Section 20.A, Section 8.A).

**Root cause:** When the block was first introduced, it was added as a non-critical enhancement. It has since become the primary vehicle for voice, tone, and temporal correctness.

**Fix:**
1. In `buildPromptContextBlocks()` (`agent9-prose.ts`), change `world_document` priority from `'high'` to `'critical'`.
2. If `world_document` content is empty (world doc was not generated), emit a warning to the run log at Agent 9 startup so the absence is visible in run history.
3. Add a note in the `PROMPT BUDGET SUMMARY` line (injected by `applyPromptBudgeting`) if the world document was empty, so the diagnostics captured in `prompt_fingerprints.section_sizes` make the absence traceable.

**Impact:** Characters previously elevated to critical (`pronoun_accuracy`, `locked_facts`, `clue_descriptions`, `narrative_state`, `discriminating_test`, `scene_grounding`, `provisional_scoring_feedback`) are already at critical. Adding `world_document` means the only blocks that can now be dropped under budget pressure are: `character_personality` (high), `physical_plausibility` (high), `era_authenticity` (high), `location_profiles` (medium), `temporal_context` (medium), `humour_guide` (optional), `craft_guide` (optional). This is an acceptable tradeoff given that `world_document` subsumes much of the purpose of `era_authenticity` and `temporal_context`.

**Surface:** `packages/prompts-llm/src/agent9-prose.ts` — one priority value change.

---

### 26.5 Quality — Elevate `character_personality` to Critical for All Casts (Section 4.A)

**Issue:** `character_personality` is "high" by default and only elevated to "critical" when a non-binary cast member is present. For binary-gender casts, character voice context — the six-field structure that defines how each character speaks and what motivates them — can be dropped under budget pressure.

**Root cause:** The conditional elevation was introduced specifically to guarantee pronoun guidance for non-binary characters. The quality value of the personality block for all casts was not considered separately.

**Fix:** Remove the conditionality. Set `character_personality` to `'critical'` unconditionally in `buildPromptContextBlocks()`. The non-binary pronoun guidance in this block is now subsumed by the dedicated `pronoun_accuracy` block (added in ANALYSIS_16); the only remaining reason to elevate personality is prose quality, which applies to all stories.

**Note:** With both `world_document` and `character_personality` at critical, the budget pressure falls entirely on `physical_plausibility` (high), `era_authenticity` (high), `location_profiles` (medium), `temporal_context` (medium), `humour_guide` (optional), `craft_guide` (optional). These are the correct candidates for sacrifice under pressure.

**Surface:** `packages/prompts-llm/src/agent9-prose.ts` — one priority value change and removal of the `hasNonBinaryCast` conditional.

---

### 26.6 Quality — Add Feedback Bucket for World Document Absence (Section 8.A)

**Issue:** `buildEnhancedRetryFeedback` has no bucket for the case where the world document was absent or truncated. If this is the root cause of poor prose tone and voice flatness, retry directives give no guidance on how to compensate.

**Root cause:** The feedback function was built around validation error types, not prompt-content gaps.

**Fix:** After the fix in 26.4 makes `world_document` critical, this issue is largely resolved — the block will not be dropped. However, when `worldDocument` is absent at Agent 9 entry (Agent 6.5 failed), add a fallback voice-guidance paragraph to the system message assembled inline from `characterProfiles` (voice & mannerisms field). This ensures the model has minimal voice anchors even without the full world document.

**Surface:** `packages/prompts-llm/src/agent9-prose.ts` — `buildProsePrompt()` or a new `buildFallbackVoiceBlock()` helper.

---

### 26.7 Validation Calibration — Elevate Discriminating Test to Hard-Stop (Section 15.A, Condition 7)

**Issue:** Condition 7 (discriminating test not dramatized in prose / `cml_test_not_realized`) produces a warning but not a hard-stop. A story where the core mystery proves mechanism is absent from the prose is fundamentally incomplete as a whodunnit, yet it is committed and delivered to users.

**Root cause:** Condition 7 was likely kept as a warning during initial development to avoid aggressive hard-stops while the discriminating test detection logic was calibrated.

**Fix:** Change Condition 7 in `agent9-run.ts` to add its reason to `hardStopReasons[]` in addition to emitting a warning. Pair this with an audit of the `isDiscriminatingTestCoverageError` and `isSuspectClosureCoverageError` classifiers to verify they are not over-sensitive (see Section 26.12). Only promote to hard-stop once the classifier is confirmed to have low false-positive rate.

**Surface:** `apps/worker/src/jobs/agents/agent9-run.ts` — release gate condition 7.

---

### 26.8 Validation Calibration — Strengthen Clue Obligation Token-Match (Section 7.A)

**Issue:** The 40% threshold / minimum 1 match for clue obligation validation is too weak. A chapter satisfying a critical clue obligation by including one incidental keyword passes the gate without the clue being meaningfully dramatized.

**Root cause:** The threshold was set conservatively to avoid excessive false-positive rejections. The binary classification (present / absent) does not account for the distinction between incidental vocabulary and intentional narrative delivery.

**Fix:**
1. Raise the minimum match count for clue descriptions with 5+ significant tokens from 1 to 2. This eliminates single-keyword false-passes while not materially increasing false-positive rejection rate.
2. Add a third check alongside `description` and `pointsTo` token matching: if the clue has a `criticality` of `'critical'`, also validate that the matched tokens appear within a 100-word window (i.e., the clue content is concentrated, not scattered). This is a stronger signal of intentional delivery.
3. Document the rationale for each threshold in a code comment to prevent future regression.

**Surface:** `packages/prompts-llm/src/agent9-prose.ts` — `chapterMentionsRequiredClue()` and `validateChapterPreCommitObligations()`.

---

### 26.9 Observability — Add Dropped-Block Report to Return Value (Section 19.A)

**Issue:** `generateProse` return value includes `prompt_fingerprints.section_sizes` (chars per block that were included) but not a record of which blocks were dropped or truncated by budget pressure. The most actionable diagnostic for prose quality issues caused by budget pressure is absent.

**Root cause:** The budget system was built to apply silently; reporting was regarded as secondary.

**Fix:** In `applyPromptBudgeting()`, collect dropped block keys and truncated block keys during the allocation pass. Return them alongside the allocated blocks. Surface this in the `ProseGenerationResult` as an optional `promptBudgetDetails` field:

```typescript
promptBudgetDetails?: {
  chapter: number;
  droppedBlocks: string[];       // keys of blocks dropped entirely
  truncatedBlocks: string[];     // keys of blocks that hit their per-block cap
}[];
```

Also include the dropped/truncated keys in the existing `PROMPT BUDGET SUMMARY` line injected into the developer section (already present but content not fully documented).

**Surface:** `packages/prompts-llm/src/agent9-prose.ts` — `applyPromptBudgeting()` and `ProseGenerationResult` interface.

---

### 26.10 Observability — Include Release Gate Warnings in `ctx.validationReport` (Section 16.A)

**Issue:** Release gate warnings (Section 15) are emitted to `ctx.warnings` and logs but are not stored in `ctx.validationReport`. Downstream consumers reading only `ctx.validationReport` cannot see conditions 2, 4, 7, 11, 12 fired as warnings.

**Root cause:** Release gate evaluation was added after `ctx.validationReport` was defined. Warnings were plumbed to `ctx.warnings` by default without updating the report schema.

**Fix:** Extend `ctx.validationReport` (or the `ProseValidationResult` type) with a `releaseGateWarnings` field — an array of objects `{ conditionNumber, description }`. After release gate evaluation, all warning conditions that fired are pushed to this field. Hard-stop conditions that threw are already exposed via the throw itself.

**Surface:** `apps/worker/src/jobs/agents/agent9-run.ts` — release gate block; type definitions for `ctx.validationReport`.

---

### 26.11 Robustness — Replace String-Matching Error Classifiers with Typed Errors (Section 22.A)

**Issue:** `isDiscriminatingTestCoverageError`, `isSuspectClosureCoverageError`, `isCulpritEvidenceChainCoverageError`, and `isSuspectEliminationCoverageError` classify errors by matching against error message text strings. If any error message is rephrased in a validator, the classifier silently breaks with no compile-time warning.

**Root cause:** The validators emit errors as plain strings. There is no typed error hierarchy.

**Fix:** Introduce an `ErrorCode` enum or `type` union (e.g. `'discriminating_test_not_covered' | 'suspect_clearance_missing' | ...`) and ensure each validator-emitted error object carries a `code` field. The classifiers then check `error.code === 'discriminating_test_not_covered'` rather than `error.message.includes(...)`. This is a type-safe refactor with no behaviour change.

**Surface:** `StoryValidationPipeline` validators and `apps/worker/src/jobs/agents/agent9-run.ts` classifiers.

---

### 26.12 Robustness — Make Writing Guide Loading Explicit (Section 2.A, Section 22.A)

**Issue:** `loadWritingGuides` silently drops guide files when they are absent or unreadable. There is no log entry and no prompt-budget record of the drop. These files contain the highest-quality creative guidance documents outside the world document.

**Root cause:** The function was written with a silent-fallback pattern to avoid blocking Agent 9 startup for a non-critical resource.

**Fix:** Keep the non-blocking behaviour (do not throw) but add explicit warn-level log entries when either file fails to load, including the file path and error reason. Also surface the absence in the `PROMPT BUDGET SUMMARY` line and in `promptBudgetDetails.droppedBlocks` (see fix 26.9) with a key like `'humour_guide [file not found]'`.

**Surface:** `apps/worker/src/jobs/agents/agent9-run.ts` — `loadWritingGuides()`.

---

### 26.13 Architecture — Source-Level `annotatedLockedFacts` Association (Section 3.A)

**Issue:** The current `annotatedLockedFacts` derivation uses fuzzy token matching (≥2 shared tokens between a locked fact and a clue) to associate locked facts with chapters. This can over- or under-associate based on shared generic vocabulary.

**Root cause:** Agent 3b embeds locked facts inside `hardLogicDevices.devices[].lockedFacts`. The chain from `lockedFact` back to its source device, and from there to the clue ID the device supports, is not traced.

**Fix:** In the `annotatedLockedFacts` build step in `agent9-run.ts`, first attempt a direct source-level association: for each locked fact, find the `hardLogicDevice` whose `lockedFacts` array contains it (matching on `description` + `value` equality). From that device, look up the device's primary clue ID from `ctx.clueDistribution`. If found, use that clue's `appearsInChapters` directly via `clueIdToChapters`. Fall through to the existing token-match heuristic only when the source device cannot be found (backward-compatibility path for any store format where device→fact linkage is absent).

**Surface:** `apps/worker/src/jobs/agents/agent9-run.ts` — `annotatedLockedFacts` derivation block.

---

### 26.14 Architecture — Conditional Second `applyDeterministicProsePostProcessing` (Section 11.A)

**Issue:** The second call to `applyDeterministicProsePostProcessing` (Section 11) runs unconditionally on every execution. Its stated purpose is to catch drift introduced by the schema validation retry — but the retry only occurs when schema validation fails, which is rare.

**Root cause:** Defensive default: always run repairs at every stage boundary rather than tracking whether the prior stage introduced drift.

**Fix:** Track whether a schema retry occurred via a local boolean `schemaRetryOccurred`. Call the second `applyDeterministicProsePostProcessing` only if `schemaRetryOccurred === true`. On all other runs, the second pass is eliminated. The third pass (after `autoFix`, Section 14) remains unconditional since autoFix scope is unknown. Add a code comment to both calls explaining their specific guard scenario.

**Note:** This change makes the code intent explicit and eliminates work on the majority (successful) execution path.

**Surface:** `apps/worker/src/jobs/agents/agent9-run.ts` — post-generation block.

---

### 26.15 Architecture — Location-Aware Grounding Lead Templates (Section 9.A, Section 22.A)

**Issue:** `buildDeterministicGroundingLead` uses five hardcoded generic templates, not tied to the actual chapter location. For multi-chapter stories with widespread grounding failures, template recycling produces visible repetition. Location-specific vocabulary available in `locationProfiles` is not used.

**Root cause:** The deterministic grounding lead was implemented as a fast static fallback. Drawing from `locationProfiles` requires selecting the correct profile for the chapter's scene location, adding a lookup dependency.

**Fix:** Inside `buildDeterministicGroundingLead`, accept the current chapter's scene location name as an additional parameter. Look up the matching `LocationProfile` from the passed `locationProfiles` array. Use the profile's `sensoryDetails`, `architecturalFeatures`, or `atmosphere` fields to populate the lead sentence's environment vocabulary, selecting from the five template structures but substituting location-specific nouns. Fall back to the current generic templates if no profile matches.

**Surface:** `apps/worker/src/jobs/agents/agent9-run.ts` — `buildDeterministicGroundingLead()` and all call sites.

---

### 26.16 Architecture — Widen Provisional Scoring Feedback Window (Section 23.A)

**Issue:** `formatProvisionalScoringFeedbackBlock` uses only the last 2 chapter scores (`.slice(-2)`). For stories where quality issues persist across 3–5 chapters before correcting, the last 2 scores may not represent the full quality pattern.

**Root cause:** The window size of 2 was chosen conservatively to avoid filling the context budget with historical feedback. The `provisional_scoring_feedback` block has no per-block token cap.

**Fix:** Widen the slice to the last 3 scores (`.slice(-3)`). Add a token cap to the `provisional_scoring_feedback` block in the budget system (e.g. `450` tokens) matching the cap pattern used for `pronoun_accuracy`, `humour_guide`, and `craft_guide`. This gives a richer quality signal while preventing context bloat in long-running stories.

**Surface:** `packages/prompts-llm/src/agent9-prose.ts` — `formatProvisionalScoringFeedbackBlock()` and `buildPromptContextBlocks()` order config.

---

### 26.17 Documentation — Add `anonymizeUnknownTitledNames` to Section 22 Function Table

**Issue:** `anonymizeUnknownTitledNames` is used in both `sanitizeScenesCharacters` and `sanitizeGeneratedChapter` (the phantom name removal system), but it is not listed in the Section 22 helper function table.

**Fix:** Add a row to the Section 22 table:

| Function | Purpose |
|---|---|
| `anonymizeUnknownTitledNames(text, validCastNames)` | Replaces `Title Surname` patterns for non-cast names with anonymous role phrases (e.g. "Detective Harlow" → "the detective"); used in scene and chapter sanitization |

**Surface:** Documentation only — Section 22 table.

---

### 26.18 Documentation — Add `backgroundContext` to Section 2 Input Table (Section 2.A)

**Issue:** `ctx.backgroundContext` (produced by Agent 2e) is absent from the Section 2 entry inputs table. It is one of the 11 upstream agent outputs and should be listed for completeness.

**Fix:** Add a row to the Section 2 input table:

| Input | Source field | Type |
|---|---|---|
| Background context | `ctx.backgroundContext` | `BackgroundContext` |

Also add a note that `ctx.backgroundContext` currently feeds into the world document generation (Agent 6.5) but does not appear as a named block in Agent 9's prompt construction — its influence is indirect via `worldDocument`. If its content should be injected directly (e.g. as a "medium" priority social/historical context block), that is a separate prompt engineering decision.

**Surface:** Documentation only — Section 2 input table.

---

### 26.19 Summary — Fix Priority Matrix

| Fix | Sections | Type | Estimated impact | Risk |
|---|---|---|---|---|
| 26.4 — Elevate `world_document` to critical | 4.A, 20.A | Code (1 line) | High — guarantees voice/tone context in every prompt | Low — displaces physical_plausibility (already covered by era_authenticity) |
| 26.5 — Elevate `character_personality` to critical | 4.A | Code (1 line) | High — guarantees character voice for all casts | Low — same displacement as above |
| 26.7 — Discriminating test to hard-stop | 15.A | Code (1 line + classifier audit) | High — prevents structurally incomplete mysteries from being committed | Medium — requires classifier calibration first |
| 26.9 — Dropped-block report in return value | 19.A | Code (medium) | High — makes budget pressure visible in diagnostics | Low — additive only |
| 26.13 — Source-level lockedFacts association | 3.A | Code (medium) | Medium — reduces fuzzy mis-associations | Low — falls back to existing heuristic |
| 26.8 — Strengthen clue token-match | 7.A | Code (small) | Medium — reduces false-pass rate for clue obligations | Medium — may increase retry rate initially |
| 26.6 — Fallback voice block when worldDoc absent | 8.A | Code (small) | Medium — partial compensation for missing world doc | Low |
| 26.14 — Conditional 2nd post-processing pass | 11.A | Code (small) | Low (perf) — eliminates wasted work on clean path | Low — strictly additive guard |
| 26.15 — Location-aware grounding lead | 9.A, 22.A | Code (medium) | Medium — reduces template repetition in grounded chapters | Low |
| 26.16 — Widen provisional feedback window | 23.A | Code (small) | Medium — richer quality signal for mid-story corrections | Low |
| 26.10 — Release gate warnings in `ctx.validationReport` | 16.A | Code (small) | Medium — improves downstream observability | Low |
| 26.11 — Typed error classifiers | 22.A | Code (medium) | Low (correctness) — prevents silent classifier breakage | Low — pure refactor |
| 26.12 — Explicit writing guide logging | 2.A, 22.A | Code (trivial) | Low — visibility only | None |
| 26.2 — Step sequence count correction | 25.A | Doc | None | None |
| 26.3 — Section 1 agent label table | 1.A | Doc | None | None |
| 26.1 — Config table value corrections | 21.A | Doc | None | None |
| 26.17 — `anonymizeUnknownTitledNames` in table | 22.A | Doc | None | None |
| 26.18 — `backgroundContext` in Section 2 table | 2.A | Doc | None | None |

**Recommended implementation order:** 26.4 + 26.5 first (single-line priority changes, maximum quality impact), then 26.7 (after classifier audit), then 26.9 + 26.10 (observability), then 26.8 + 26.13 + 26.16 (validation/quality), then remaining code changes, then documentation corrections.

---

*End of ANALYSIS_29*
