# ANALYSIS_33 — Pronoun Errors End-to-End: Prompts, Checking, Validation, and Retries

**Date**: 2026-04-15
**References**: ANALYSIS_29 (process review), ANALYSIS_31 (scoring), ANALYSIS_32 (validation pipeline)
**Target**: End-to-end pronoun accuracy — every mechanism, every gap, every refactor needed

---

## §1 Scope and Framing

### §1.1 Why pronoun errors are the biggest issue

Pronoun errors are uniquely damaging for four reasons:

1. **Reader trust** — a single pronoun swap for a named character signals author incompetence more loudly than any other continuity error. A reader who encounters "Eleanor poured him a brandy. He reached for the decanter" (where Eleanor is female and he/him appear immediately after her name) loses all faith in narrative reliability.

2. **LLM prior strength** — large language models have extremely strong binary-gender completion priors from training data. A male character named "Adrian" will attract he/him completions; a female character named "Helen" will attract she/her. But any name can attract the wrong prior under context pressure, especially in mixed-gender scenes.

3. **Non-binary characters** — singular they/them completions are rarer in training data. The LLM defaults to binary gender under any prompt ambiguity. Non-binary is the failure mode hardest to prompt-engineer away and hardest to detect.

4. **Cascade risk** — one wrong pronoun in sentence N propagates via lastSingleCharacter carry-forward to sentences N+1, N+2 until the next character name appears. A single wrong attribution at the start of a paragraph can misattribute every pronoun in six subsequent sentences.

### §1.2 The four-layer model

This analysis covers the full pipeline:

```
LAYER 1: PROMPTS          — Does the LLM know the rules before it generates?
LAYER 2: REPAIR/CHECKING  — Can we fix it deterministically after generation?
LAYER 3: VALIDATION       — Can we detect what repair missed?
LAYER 4: RETRY            — When detection fails, does the LLM retry effectively?
```

Each layer has known weaknesses. The goal of ANALYSIS_33 is to document those weaknesses rigorously and propose targeted fixes. Facts sections (§2–§5) are observations only. Assessment sections (§6–§9) and the refactors section (§11) carry explicit recommendations.

---

## §2 The Prompt Layer — Facts

### §2.1 System message pronoun rules

The `system` constant in `buildProsePrompt()` contains two pronoun directives:

**Block A — Character names cast list with gender labels:**
```
⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: [NAME (woman), NAME (man), ...].
```
Each cast member is annotated with `(woman)` or `(man)` based on gender. Unknown-gender characters receive no label. Non-binary characters receive neither label.

**Block B — Inline gender warning:**
```
⚠️ BEFORE YOU WRITE each chapter, also ask yourself:
"Am I using the correct pronouns for every character — she/her for women, he/him for men?"
If not, correct it before writing a single word.
⛔ GENDER IS NON-NEGOTIABLE: The gender of every character is shown above.
Use the correct pronouns at all times — a woman is always she/her, a man is always he/him.
Never swap, default, or guess.
```

**Observation:** Both Block A and Block B mention only binary pronouns (she/her, he/him). Non-binary characters who carry `they/them/their` are not addressed by name anywhere in the system message.

### §2.2 `buildPronounAccuracyBlock()` — the dedicated pronoun block

**Priority:** `critical` (never dropped). **Position:** 0 (first in the ordered block list). **Token cap:** 700.

The function builds a block with four components:

**Component 1 — Non-binary warning (hoisted to top, only when applicable):**
```
⚠ NON-BINARY CAST — SINGULAR THEY/THEM/THEIR ⚠
FORBIDDEN for [NAMES]: she / her / herself / he / him / his / himself.
Use only: they / them / their / themselves.
These are SINGULAR pronouns for ONE individual — not a group.
Example: "[Name] adjusted their collar as they crossed the room." — correct.
Example: "[Name] adjusted her collar as she crossed the room." — WRONG.
```
When ALL cast members are non-binary, the warning reads "ALL characters in this story use they/them/their."
When non-binary forms are a minority, names are listed explicitly with FORBIDDEN forms.

**Component 2 — Four-column canonical pronoun table:**
```
• [Name]: he/him/his/himself
• [Name]: she/her/her/herself
• [Name]: they/them/their/themselves
```
Only cast members with known gender (male/female/non-binary) are included. Unknown-gender characters are intentionally omitted.

**Component 3 — MANDATORY PRE-OUTPUT CHECK:**
```
MANDATORY PRE-OUTPUT CHECK: Before generating the JSON, re-read every sentence
that contains a pronoun and verify it against the table. If any mismatch is found,
correct it before outputting. This check is not optional.
```

**Component 4 — 8 rules:**
1. Every sentence without exceptions (dialogue, reflection, narration, attribution)
2. When characters of different genders appear in the same sentence → use the name to eliminate ambiguity
3. Pronoun must never migrate across semicolons, comma splices, or consecutive sentences
4. `her` disambiguation: indirect object ("told her the truth") vs possessive ("her coat")
5. Reflexive pronouns must match table (himself/herself/themselves)
6. Dialogue attribution pronoun must match the SPEAKER's gender, not the last named character inside the speech
7. Nested/cleft clauses ("It was she who…") must still match the referent
8. Singular they/them/their for non-binary carries same mandatory status as gendered pronouns

### §2.3 `buildContextSummary()` — user message cast annotation

Every character in the cast summary is annotated with their pronoun form:
```
Cast: Name (she/her), Name (he/him), Name (they/them), ...
```

For non-binary cast members, a separate reminder paragraph is appended directly to the user message:
```
⚠ PRONOUN REMINDER: [NAME] use they/them/their (singular).
Never write she/her or he/him for these characters.
```

The format uses 2-form (she/her, he/him, they/them) rather than the 4-form in `buildPronounAccuracyBlock()`.

### §2.4 NSD block — character pronouns section

The NarrativeState block (injected between continuity context and discriminating-test checklist) includes a `CHARACTER PRONOUNS` section when `state.characterPronouns` is non-empty:
```
CHARACTER PRONOUNS — never deviate from these:
  • [Name]: he/him
  • [Name]: she/her
```

`state.characterPronouns` is a `Record<string, string>` populated from prior chapter generation. For the first batch of chapters, this record is empty. The NSD pronoun block does not appear until batch 2 or later.

### §2.5 Character personality block — implicit pronoun reinforcement

`buildWorldBriefBlock()` has a `characterPronouns?` parameter. When provided, character voice section headings include inline pronoun labels:
```
### Helen Wenlock (she/her)
```

For non-binary characters, the profile entry opens with:
```
PRONOUN IDENTITY: [Name] uses they/them/their (singular they, non-binary gender identity). Never write she/her or he/him for [Name].
```

The `character_personality` block is prioritised `high` for all-binary casts and `critical` only when a non-binary cast member is present. Under tight prompt budget, the `high` version is droppable.

### §2.6 Message 3 — PRONOUN AUDIT checklist

The final user message (the checklist the model reads immediately before generating) includes a PRONOUN AUDIT table for binary-gender cast:
```
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns
  you actually used, then verify against the canonical table. Correct any mismatch
  before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Helen Wenlock        | she/her/her   | [fill in]     | [yes/no]
  Frederick Daubeny    | he/him/his    | [fill in]     | [yes/no]
```

Filter applied: `cast.filter(c => c.gender === 'male' || c.gender === 'female')`.

**Observation:** Non-binary characters are excluded from the audit table by this filter. The canonical column uses 3-form (`she/her/her`, `he/him/his`) rather than the 4-form used in `buildPronounAccuracyBlock()`.

### §2.7 Underflow expansion — compact pronoun lock

When a chapter is below word-count floor and triggers the underflow expansion LLM call, the expansion system prompt includes:
```
Pronoun lock — never change: Name: he/him; Name: she/her; [...].
Do not alter any pronoun or gendered reference for any character.
```
This uses 2-form only (he/him, she/her, they/them). The full cast is enumerated.

---

## §3 The Repair Layer — Facts

### §3.1 `repairChapterPronouns()` — two-pass conservative repair

Defined in `packages/story-validation/src/pronoun-repair.ts`. Called on each generated chapter before validation.

**Pass 1 — sentence-level repair (`repairPronouns()`):**
- Full chapter text is joined into one string (paragraphs separated by `\n\n`)
- Split into sentences; for each sentence, the mentioned cast members are found
- 5 cases: single named character → repair; zero named (carry-forward from `lastSingleCharacter`) → repair; 2+ same-gender → repair; 2+ mixed-gender with clear sentence-opening subject → conservative repair if no competing gender in sentence; 2+ mixed-gender ambiguous → skip
- `lastSingleCharacter` persists across paragraph boundaries

**Pass 2 — dialogue-attribution repair (`repairDialogueAttributionPronouns()`):**
- Pattern: closing-quote + optional comma + subject pronoun + attribution verb
- Lookback: up to 800 chars or the last paragraph break, whichever is closer
- Finds text before the opening quote; if exactly ONE cast member is mentioned → verify attribution pronoun matches speaker gender; if wrong → fix
- Only repairs unambiguous speaker attribution

### §3.2 `repairPronouns()` algorithm — detailed

**Conservative mode (default, used by `repairChapterPronouns()`):**
- Competing-gender guard is ACTIVE: if target character is male and another female appears in the same sentence (or vice versa), and no clear sentence-opening subject is identifiable → SKIP (don't repair)
- Mixed-gender sentence with identifiable subject: only repair if NO other character in the sentence shares the pronoun's wrong gender (safe-to-repair check)

**Targeted mode (used post-validator, with `options.targetNames`):**
- Competing-gender guard is DISABLED
- Non-target cast members: `hasNonTargetIn(segment)` — if a non-target appears in the sentence or is in carry-forward context → null `lastSingleCharacter` to prevent carry-forward misattribution
- Caller (the validator) has confirmed no competing entity owns the mismatch
- Guard bypass justified by validator's sentence-level analysis

**`correctPronoun()` — `her` disambiguation:**
- If wrong pronoun is `her` and target is male: checks the substring immediately following `her` in the sentence
- If followed by a noun-like content (not article/preposition/conjunction) → possessive → replace with `his`
- If followed by article, preposition, or end of sentence → object → replace with `him`

### §3.3 `repairChapterPronouns()` — post-underflow-expansion re-run

After underflow expansion, `repairChapterPronouns()` is called again on the expanded chapter. This ensures the expansion LLM, despite its compact pronoun lock, has its output cleaned before per-batch validation.

---

## §4 The Detection/Validation Layer — Facts

### §4.1 `CharacterConsistencyValidator` — sentence-level detection with 5 guards

Defined in `packages/story-validation/src/character-validator.ts`.

**Alias index:** `aliasToCanonical` maps every lowercase variant (full name, first name, surname, explicit aliases) to the canonical name. Auto-generated: if `"Frederick Daubeny"`, then `"daubeny"` and `"frederick"` are also registered. This was added as an explicit fix (ANALYSIS_21) to prevent the competing-entity guard from failing on surname-only references.

**`findIncorrectPronouns()` — 5 guards in sequence:**

| Guard | Condition | Effect |
|---|---|---|
| 1. Possessive carry-forward | Primary sentence starts with `his\b` / `her\b` | Suppresses male/female pronoun checks respectively |
| 2. Co-presence | Target's OWN correct pronoun already in context | Suppress ALL wrong-gender checks; DISABLED for non-binary |
| 3. In-sentence competing entity | Other cast member in primary sentence matches pronoun gender | Suppress that pronoun form |
| 4. Preceding-context competing entity | Other cast member in ANY preceding sentence (scene start → current) matches pronoun gender | Suppress that pronoun form |
| 5. Reflexive/predicate-possessive derivation | `herself/himself/hers/his` — derived from subject pronoun, not stored in CharacterState | Applied in guards 3 and 4 |

**Error message format:**
```
Character "NAME" has incorrect pronouns. Should use he/him/his but found: she, her
```
When multiple wrong pronouns are found, they are comma-separated in the `found:` field.

**One error per character per scene.** All wrong pronoun forms for a character in one scene are concatenated into a single error message.

### §4.2 `ProseConsistencyValidator.checkPronounDrift()` — coarser post-generation check

Defined in `packages/story-validation/src/prose-consistency-validator.ts`. Called only within `StoryValidationPipeline.validate()`.

**Algorithm:**
- For each binary-gender cast member, find all positions of their FIRST NAME in scene text
- For each position: extract a ±200-character window around the name
- If any wrong-gender pronoun appears in the window → emit `pronoun_drift` error (moderate severity)
- Break after first hit per character per scene (at most one error per character per scene)

**Non-binary characters:** explicitly excluded (`if (!gender || gender === 'non-binary') continue`).

**Competing-entity guard:** ABSENT. No check for whether the wrong-gender pronoun belongs to another character in the window.

### §4.3 Per-batch integration (in `agent9-prose.ts`)

The order of operations for each chapter in a batch:

```
1. repairChapterPronouns(chapter, cast)          — conservative deterministic repair
2. ChapterValidator.validateChapter()             — hard errors (word count, etc.)
3. underflow expansion (if triggered)
   → repairChapterPronouns(expanded, cast)        — repair again after expansion
4. CharacterConsistencyValidator.validate()       — pronoun_gender_mismatch detection
5. flagged names → repairPronouns(text, cast, { targetNames: flaggedNames })  — targeted repair
6. CharacterConsistencyValidator.validate()       — re-validate after targeted repair
7. residual pronoun_gender_mismatch → chapterErrors[]  — escalate to retry
```

Controlled by `pronounCheckingEnabled` flag derived from `generation-params.yaml`.

### §4.4 `StoryValidationPipeline` integration

`StoryValidationPipeline.validate()` (called after all chapters are committed to the store) runs:

1. `CharacterConsistencyValidator.validate()` — full story, all scenes, `pronoun_gender_mismatch` (critical)
2. `ProseConsistencyValidator.validate()` — includes `checkPronounDrift()`, `pronoun_drift` (moderate)

Pronoun errors in the pipeline:
- `pronoun_gender_mismatch` (critical) → sets `overallStatus = 'failed'` in `determineStatus()`
- `pronoun_drift` (moderate) → triggers a validation warning but does not alone cause `failed`

**No repair pass exists at the pipeline level.** Detection only. If a critical pronoun error is found in `StoryValidationPipeline`, the story is marked failed with no recovery path.

`ProseConsistencyReport.overallStatus` is set from the full combined error list, not just ProseConsistencyValidator's own errors. A `pronoun_gender_mismatch` critical from CharacterConsistencyValidator will set `overallStatus = 'fail'` even though `ProseConsistencyReport` is nominally scoped to the ProseConsistencyValidator's own checks (locked facts, pronoun drift, opening styles, context leakage). This produces a state where `overallStatus = 'fail'` with all ProseConsistencyReport component counts at zero — an internally inconsistent report state.

---

## §5 The Retry Layer — Facts

### §5.1 `buildEnhancedRetryFeedback()` — pronoun error bucket

Pronoun errors are extracted as a separate bucket BEFORE character errors (Phase 2 fix). The filter:
```typescript
errors.filter(e => !clueValidationErrors.includes(e) && (
  e.toLowerCase().includes('pronoun_gender_mismatch') ||
  /incorrect pronoun|wrong pronoun|should use he|should use she|should use they/i.test(e)
))
```

This prevents pronoun errors from being routed to the "CHARACTER NAME ERRORS" feedback block (which gives wrong-fix instructions: "Find every invented name and... replace it with a real cast member").

### §5.2 Per-character directive construction

For each pronoun error, the character name, correct pronoun set, and wrong pronouns found are extracted by regex:
```
/^Character "([^"]+)" has incorrect pronouns\. Should use ([^\s]+) but found: (.+)$/
```

If the regex matches, a per-character directive is emitted:
```
⚠️ NAME is GENDER — use "correct/pronoun/set" ONLY.
   You wrote: wrong, pronouns — these are WRONG for this character.
   Every time "NAME" appears: correct/pronoun/set. No exceptions.
```

If the regex does NOT match (e.g., a different error message format), it falls back to:
```
⚠️ [original error message text]
```

The gender label (MALE/FEMALE/NON-BINARY) is looked up from the cast array.

### §5.3 HOW TO FIX paragraph

Appended to the pronoun feedback block:
```
HOW TO FIX: Search your draft for every occurrence of each name above.
Replace any pronoun that does not match the gender shown.
Minimal sentence rewording is acceptable where it improves clarity (e.g. naming
the character explicitly instead of relying on a pronoun). Do NOT alter plot
points, clue details, alibis, or dialogue meaning.
```

### §5.4 Retry path for story-level pipeline errors

`StoryValidationPipeline` pronoun errors have NO targeted repair path. There is no story-level call to `repairPronouns()` before or after `StoryValidationPipeline.validate()`. If a `pronoun_gender_mismatch` error is found at the pipeline level (post-all-chapter-generation), it results in a `failed` status with no automated recovery.

---

## §6 Assessment — Prompt Layer

### Issue P-1 (HIGH): Non-binary characters excluded from PRONOUN AUDIT checklist

**Location:** `buildChecklist()` checklist builder, line ~2074:
```typescript
const castWithGender = cast.filter((c: any) =>
  c.gender?.toLowerCase() === 'male' || c.gender?.toLowerCase() === 'female'
);
```
Non-binary characters are excluded from the audit table. The PRONOUN AUDIT is the only mechanism that forces the model to perform active self-review per character by name. Skipping non-binary characters removes this check for the hardest failure mode — singular they/them assignments where the LLM's binary completion prior is strongest. This is directly contrary to the intent of the non-binary warning that was explicitly added to `buildPronounAccuracyBlock()`.

**Fix:** Include non-binary characters in the audit table with canonical `they/them/their`.

### Issue P-2 (MEDIUM): System message ABSOLUTE RULE block omits non-binary pronoun mandate

**Location:** `system` constant in `buildProsePrompt()`:
```
⛔ GENDER IS NON-NEGOTIABLE: ... a woman is always she/her, a man is always he/him.
```
No mention of non-binary characters. The system message is the architectural base prompt — the LLM reads it first and it frames all subsequent instruction. A non-binary character introduced only in `buildPronounAccuracyBlock()` (a context block, not the base system) is more likely to be overlooked when binary priors dominate generation.

**Fix:** Add "or they/them for non-binary characters" to the system message ABSOLUTE RULE block and to the `⚠️ BEFORE YOU WRITE` self-check.

### Issue P-3 (MEDIUM): Pronoun format inconsistency across prompt sections

Three different pronoun citation formats appear across the prompt:
- `buildPronounAccuracyBlock()`: 4-form (`she/her/her/herself`) — most complete
- `buildContextSummary()`: 2-form (`she/her`, `he/him`)
- PRONOUN AUDIT checklist: 3-form (`she/her/her`, `he/him/his`)
- `buildNSDBlock()`: 2-form (`he/him`, `she/her`)
- Expansion pronoun lock: 2-form (`she/her`, `he/him`)

The 3-form used in the PRONOUN AUDIT (`she/her/her`) has two identical tokens (`her/her`). These represent different grammatical cases (object/possessive) but are visually indistinguishable. The 4-form (`she/her/her/herself`) in the accuracy block makes the fourth token (reflexive) unambiguous. The inconsistency across sections can dilute the model's confidence in which form is canonical.

**Fix:** Standardise all secondary references to 4-form, or explicitly label the columns (subject/object/possessive/reflexive) in the audit table.

### Issue P-4 (LOW): NSD character pronouns block is empty for the first chapter batch

For the first batch of chapters, `state.characterPronouns` is an empty record because no prior chapters have been written. The NSD block's `CHARACTER PRONOUNS — never deviate from these:` section does not appear. The model has `buildPronounAccuracyBlock()` and `buildContextSummary()` which both carry pronoun information, so this is not a gap for a single-batch story — but for the specific sub-area of "NSD reinforcement of pronouns", the first batch gets no NSD signal.

**Note:** This is low severity because the accuracy block is critical-priority and always included. The NSD block would be redundant for batch 1 anyway.

### Issue P-5 (LOW): `character_personality` block is droppable for all-binary casts

Under tight prompt budget, `character_personality` (priority `high` for binary-only casts) is dropped before critical blocks. The personality block implicitly reinforces pronoun identity through character voice sections that are headed with `Name (she/her)` labels (from `characterPronouns?` parameter) and through the prose style of character-specific descriptions. When dropped, this reinforcement is lost. For binary casts, this is low impact because `buildPronounAccuracyBlock()` carries explicit rules. For non-binary casts where one character uses they/them, the block is escalated to critical and is safe.

---

## §7 Assessment — Repair Layer

### Issue R-1 (MEDIUM): Conservative repair leaves valid repairs for the validator to find

**Location:** `repairPronouns()`, the 2+ mixed-gender sentence case.

In conservative mode, a sentence containing both a male and female character is only repaired if (a) one of them is the clear sentence-opening subject AND (b) no character in the sentence shares the wrong-gender pronoun with the subject. The condition (b) means: if the subject is male and a female character also appears in the sentence, repair is blocked even when the wrong-gender pronouns (`she/her`) obviously belong to the female character rather than the male subject being checked.

This is correct defensively — the repair can't be certain of ownership without full sentence parsing — but it means every occurrence of this pattern goes through the full validator cycle (validation → targeted repair → re-validate) instead of being fixed in the pre-validation conservative pass.

**Impact:** Every skipped repair that the validator later confirms costs approximately one targeted-repair cycle. This is not catastrophically expensive, but it means the conservative pass is leaving work on the table that the validator will do anyway. The conservative pass exists to reduce validator load.

**Fix:** Enable the sentence-opening subject heuristic in conservative mode for the simple case: if the sentence opens with the target character's name (or label), treat the subject as identified and apply the full repair. The competing-gender guard is still needed for pronouns that appear far from the sentence subject — apply a hybrid: repair the subject-adjacent pronoun set but keep the guard for ambiguous distant pronouns.

### Issue R-2 (LOW): Dialogue attribution lookback may miss speakers in dense paragraphs

**Location:** `repairDialogueAttributionPronouns()`, lookback up to 800 chars or paragraph break.

In a dense paragraph where a character is introduced, several hundred words of action and internal monologue follow, and then they speak — the opening-quote may be more than 800 chars from the last occurrence of the speaker's name. The repair defaults to ambiguous and skips. The conservative pass was the correct instinct here; the validator (Guard 4, preceding-context) will catch it. But the repair misses the opportunity to fix it deterministically.

**Impact:** Low. Most dialogue attribution is close to the speaker introduction. The 800-char limit was specifically chosen to avoid cross-paragraph contamination. This is an acceptable tradeoff.

### Issue R-3 (LOW): `lastSingleCharacter` carry-forward doesn't reset at scene breaks within a chapter

**Location:** `repairPronouns()`, paragraph loop.

A chapter may have two scenes separated by blank lines (the `\n\n` paragraph break). If scene A ends with male character `lastSingleCharacter = Frederick` and scene B opens with a pronoun-only sentence before any character is named, `Frederick` is carried forward as the assumed referent. If scene B is primarily about female characters, the early pronouns get incorrectly assigned.

**Impact:** Low. The carry-forward is bounded by `lastSingleCharacter = null` whenever a multi-gender sentence is encountered. Scene breaks in practice almost always introduce a named character within the first sentence. But in edge cases of stream-of-consciousness opening a new scene without a name, this can misrepresent the subject.

---

## §8 Assessment — Detection/Validation Layer

### Issue V-1 (CRITICAL): `pronoun_drift` has no competing-entity guard and fires false positives

**Location:** `ProseConsistencyValidator.checkPronounDrift()`.

The 200-char window check around each first-name mention has NO competing-entity guard. In a scene containing both Frederick (male) and Helen (female), every window around "Helen" that also contains "his/him/he" within 200 chars will emit a `pronoun_drift` moderate error — even when "his" belongs to Frederick who is named 30 chars earlier.

`CharacterConsistencyValidator` (which ALSO runs at story-validation level) handles this exact pattern correctly via Guard 4 (preceding-context competing entity). `pronoun_drift` will fire false positives for the same passages that CharacterConsistencyValidator correctly suppresses.

**Consequence:** `pronoun_drift` moderate violations do not alone set `overallStatus = 'failed'`. However:
1. They inflate the violation count, confusing report interpretation
2. If `CharacterConsistencyValidator` also fires for the same passage (because Guard 4 doesn't suppress for some other reason), the story gets both `pronoun_gender_mismatch` (critical) AND `pronoun_drift` (moderate) for a single underlying error — double-counting
3. In the inverse case, `pronoun_drift` can fire when CharacterConsistencyValidator does NOT — generating a moderate violation for a passage that the more accurate detector cleared. This creates an inconsistent validation signal.

**Root cause:** `pronoun_drift` was implemented before `CharacterConsistencyValidator` had Guard 4 (the preceding-context guard). At the time, it served as a coarser fallback. Since ANALYSIS_26 added Guard 4, `pronoun_drift` is now strictly weaker than `CharacterConsistencyValidator` for binary-gender detection and offers no coverage that CharacterConsistencyValidator does not. It adds only noise.

**Fix options (in order of preference):**
1. **Remove `checkPronounDrift()` entirely** from `ProseConsistencyValidator`. Replace with a note that `CharacterConsistencyValidator` is the canonical pronoun check at story level. This is the cleanest option.
2. **Make `pronoun_drift` advisory-only:** never set it as anything higher than `info` severity; remove it from the violation counts that affect `overallStatus`. This preserves historical log data but removes its ability to mislead report consumers.

### Issue V-2 (HIGH): No story-level targeted pronoun repair pass

**Location:** `StoryValidationPipeline.validate()` — detection only, no repair.

If `CharacterConsistencyValidator.validate()` finds a `pronoun_gender_mismatch` at the pipeline level, the story is marked `failed` with no deterministic repair attempted. The per-batch loop (§4.3) catches most chapter-level pronoun errors because it runs both conservative repair and targeted repair before committing. But there are cases where a pronoun error exists at story scope that wasn't manifest at chapter scope:

- The error was introduced by `applyDeterministicProsePostProcessing()` (the final story-wide sweep) — which runs after all chapters are committed but before pipeline validation. If this sweep introduces a regression, the pipeline will catch it but not fix it.
- The error survived the per-batch retry limit but was committed anyway (the batch exhausted `maxBatchAttempts` without resolution).

In both cases, running `repairPronouns()` in targeted mode on the flagged chapters/scenes before marking the story `failed` would recover a meaningful fraction of these cases without any LLM cost.

**Fix:** In `StoryValidationPipeline.validate()` (or in the story-generation post-processing loop that calls it), before returning a `failed` result for `pronoun_gender_mismatch`, run `repairPronouns({ targetNames: flaggedNames })` on each failing scene's text. Re-validate. If the re-validation passes, upgrade the status. If it still fails, the `failed` status stands. This is pure deterministic work with no LLM cost.

### Issue V-3 (MEDIUM): `ProseConsistencyReport.overallStatus` is not scoped to ProseConsistencyValidator

**Location:** `buildConsistencyReport()` in pipeline construction.

`ProseConsistencyReport.overallStatus` is derived from the full error list passed to the report builder — errors from ALL validators, not just `ProseConsistencyValidator`. A `pronoun_gender_mismatch` critical from `CharacterConsistencyValidator` sets `overallStatus = 'fail'` while all four ProseConsistencyValidator component fields (locked-facts violations, pronoun-drift violations, opening-style violations, context-leakage violations) remain at zero. Downstream consumers of `ProseConsistencyReport.overallStatus` cannot distinguish "ProseConsistencyValidator found a violation" from "CharacterConsistencyValidator found a violation."

**Fix:** Scope `ProseConsistencyReport.overallStatus` to only the errors returned by `ProseConsistencyValidator.validate()`. Introduce a separate `storyValidationStatus` field (or use the existing `determineStatus()` return value directly) for the full combined status.

### Issue V-4 (LOW): `detectNameSwitches()` is hardcoded to detective name variants

**Location:** `CharacterConsistencyValidator.detectNameSwitches()`:
```typescript
const detectiveNames = ['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective'];
```
This check runs on every story generation regardless of the actual cast. It will miss detective name switches in 99% of stories (because the detective has a different name) and will produce spurious hits if any cast member happens to be named Thompson, Harrington, or Chen.

This is not a pronoun error but it illustrates that an important validator component has dead logic that should be replaced with cast-driven detection. A name switch in the detective character's name is a character consistency error that is currently only caught by the hardcoded list.

**Fix:** Replace the hardcoded list with a cast-driven approach: for each cast member, check whether their name is used consistently or if multiple variants appear (e.g., "Dr. Watson" in scene 1, "Holmes's companion Watson" in scene 3, "the doctor" in scene 5 with no Watson introduction). Consider whether this is in scope for the current round of pronoun fixes or deferred.

---

## §9 Assessment — Retry Layer

### Issue Rt-1 (HIGH): Retry prompt sends the LLM back to generate from scratch without sentence-level anchors

**Location:** `buildEnhancedRetryFeedback()` pronoun block and the retry loop in `agent9-prose.ts`.

When a pronoun error survives targeted repair and reaches the retry path, the feedback tells the LLM:
- WHO has wrong pronouns ✅
- WHAT the correct forms are ✅
- WHAT forms were found ✅
- HOW to fix conceptually ✅
- WHERE in the text the error occurs ✗

The LLM is asked to regenerate the entire batch of chapters without being given the specific sentences that failed. It must re-create those chapters from scratch and somehow avoid repeating the error it made without knowing exactly which sentence triggered the validator.

In practice, the LLM faces the same creative context that produced the original error. If a scene involves Frederick and Helen having a conversation which caused `her` to be misattributed to Frederick, the next attempt will reconstruct the same scene and may produce the same error.

**Better approach:** Extract the failing sentences from the committed chapter text, include them in the retry feedback as verbatim examples, and ask the LLM to produce corrected versions of those specific sentences (not a full chapter rewrite). Then re-apply the corrected sentences to the chapter via deterministic substitution. This is the "phrase-level substitution" approach that was already applied for atmosphere repairs (ANALYSIS_20 — see the comment block in `agent9-prose.ts` around line 3066).

**Concrete fix:** In the pronoun retry path, when `pronounIssues.length > 0` and targeted repair is unsuccessful, before escalating to `chapterErrors[]` (LLM retry), attempt one additional step: extract the first 3 sentences from the chapter containing any wrong-pronoun forms found by the validator, include them in the retry feedback as "Sentence containing the error: [verbatim text]", and ask for a corrected version of each failing sentence only. Apply corrections with string substitution. Re-validate. Only if this also fails escalate to full chapter retry.

### Issue Rt-2 (MEDIUM): Retry feedback regex is silently fragile

**Location:** `buildEnhancedRetryFeedback()`, per-character directive extraction:
```typescript
const nameMatch = /^Character "([^"]+)" has incorrect pronouns\. Should use ([^\s]+) but found: (.+)$/.exec(msg);
if (!nameMatch) return `  ⚠️ ${msg}`;
```

If the validator error message format changes (e.g., the `found:` field is renamed, the surrounding text is updated, quotes are changed), the regex silently fails and the LLM receives the raw error message without per-character correction directives. The fallback `⚠️ ${msg}` is visible in the retry prompt but provides no targeted instruction.

**Fix:** Add a test assertion that the regex matches a sample error message from `CharacterConsistencyValidator`. The error message format should be treated as a contract between the validator and the retry feedback builder — any change to the validator message format must simultaneously update the regex. A dedicated `formatPronounErrorForRetry(error: ValidationError): string` function in the validator module would make this coupling explicit.

### Issue Rt-3 (LOW): No story-level LLM retry for pipeline-level pronoun failures

**Location:** Post-`StoryValidationPipeline.validate()` handling, `agent9-run.ts`.

If a story exits the generation loop and reaches pipeline validation with a `pronoun_gender_mismatch` critical, the only action is reporting the failure. There is no story-level retry mechanism. This is by design (retrying a complete story generation would be extremely expensive), but the combinaton with Issue V-2 (no deterministic repair pass at story level) means these failures are unrecoverable.

**Fix:** Implement Issue V-2's deterministic repair pass. That alone covers the recoverable fraction. Full story re-generation for purely pronoun reasons is not warranted.

---

## §10 Cross-Cutting Issues

### Issue X-1: The detector (CharacterConsistencyValidator) and the repair (repairPronouns) use different carry-forward semantics

`repairPronouns()` carries `lastSingleCharacter` across paragraph boundaries (the full chapter is treated as one stream). `CharacterConsistencyValidator.findIncorrectPronouns()` carries context only within a single scene (`text` = a scene). For multi-scene chapters, the chapter text is passed as a single scene, so both are operating on the same scope. But there is a subtle difference: the validator's `precedingContext` accumulates sentence-by-sentence from scene start (growing window), while the repair's `lastSingleCharacter` forgets when a multi-character sentence is encountered. These divergences mean the repair can fail to repair a sentence that the validator will flag (the validator's accumulated context identified the true owner; the repair's carry-forward was nulled by a prior multi-character sentence).

**Impact:** Medium. This divergence can produce validators catching errors that targeted repair then cannot fix (the targeted pass also respects competing entities, so if the repair logic says "ambiguous" for a sentence the targeted mode also says "ambiguous" — the error escalates to LLM retry correctly). The divergence itself is not a bug, but it means the repair and validator can disagree on some sentence boundaries.

### Issue X-2: Non-binary is the hardest case and has the most prompt gaps

Across all four layers, non-binary handling is spot-checked rather than systematic:
- Prompt: `buildPronounAccuracyBlock()` ✅ has non-binary warning; system message ✗ binary-only; PRONOUN AUDIT ✗ excludes non-binary
- Repair: `repairPronouns()` only repairs male/female (no `PRONOUN_MAP` entry for non-binary); dialogue attribution repair does not cover they/them misattribution
- Detection: `CharacterConsistencyValidator` ✅ full non-binary coverage with disabled co-presence guard; `pronoun_drift` ✗ excludes non-binary entirely
- Retry: feedback builder ✅ includes NON-BINARY gender label for non-binary characters

The repair layer has the most critical gap: `PRONOUN_MAP` in `pronoun-repair.ts` contains only `male` and `female` entries. Non-binary characters are excluded from `buildCharacterInfo()` (which filters on `gender === 'male' || gender === 'female'`). There is **no deterministic pronoun repair for non-binary characters** — the entire pipeline depends on the LLM getting it right from the prompt, and if it doesn't, only the validator detects it and the retry path handles it through re-generation (not deterministic fixed repair).

This is a significant architectural hole. An LLM that writes `she/her` for a non-binary character gets zero deterministic help.

---

## §11 Proposed Refactors

### R01 — Fix PRONOUN AUDIT to include non-binary characters (P-1)

**File:** `packages/prompts-llm/src/agent9-prose.ts`
**Change:** Update the `castWithGender` filter in the checklist builder to include non-binary, and use `they/them/their` as the canonical column for non-binary characters.

```typescript
// Before:
const castWithGender = cast.filter((c: any) =>
  c.gender?.toLowerCase() === 'male' || c.gender?.toLowerCase() === 'female'
);

// After:
const castWithGender = cast.filter((c: any) => {
  const g = c.gender?.toLowerCase();
  return g === 'male' || g === 'female' || g === 'non-binary';
});

// And update canonical column:
const canonical = g === 'female' ? 'she/her/her' : g === 'non-binary' ? 'they/them/their' : 'he/him/his';
```

**Effort:** 5 lines. Zero risk.

### R02 — Non-binary pronoun mandate in system message ABSOLUTE RULE block (P-2)

**File:** `packages/prompts-llm/src/agent9-prose.ts`
**Change:** In the `system` constant, update the binary-only gender warning to mention non-binary.

Current text:
```
⚠️ BEFORE YOU WRITE each chapter, also ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men?"
⛔ GENDER IS NON-NEGOTIABLE: ... a woman is always she/her, a man is always he/him.
```

Proposed text:
```
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men, they/them for non-binary characters?"
⛔ GENDER IS NON-NEGOTIABLE: ... a woman is always she/her, a man is always he/him, a non-binary character is always they/them/their. Never swap, default, or guess.
```

The system message is the first thing the LLM reads. A single addition here is high leverage.

**Effort:** 2 lines. Zero risk.

### R03 — Remove `checkPronounDrift()` from `ProseConsistencyValidator` (V-1)

**File:** `packages/story-validation/src/prose-consistency-validator.ts`
**Change:** Remove the `checkPronounDrift()` call from `validate()` and the method itself. Update `ProseConsistencyReport` to remove `pronounDriftViolations` count. Update `StoryValidationPipeline.validate()` which reads `pronounDriftViolations`.

**Rationale:** `CharacterConsistencyValidator` with Guard 4 (preceding-context competing entity, added in ANALYSIS_26) now provides strictly superior detection with zero false-positive rate for the cases `pronoun_drift` was meant to catch. `pronoun_drift` generates false positives (no competing-entity guard), adds noise to reports, and can cause `overallStatus` inconsistencies. It provides no coverage that CharacterConsistencyValidator does not.

Running `CharacterConsistencyValidator` at pipeline level (it already runs) is sufficient.

**Effort:** ~30 lines removed. Low risk — tests for `pronoun_drift` should be deleted or converted to `CharacterConsistencyValidator` tests.

If this removal is politically difficult (historical data dependency), implement as Issue V-1's option 2: downgrade `pronoun_drift` to `info` severity so it never affects `overallStatus`.

### R04 — Add deterministic repair pass to `StoryValidationPipeline` (V-2)

**File:** `packages/story-validation/src/pipeline.ts`
**Change:** After `CharacterConsistencyValidator.validate()` finds `pronoun_gender_mismatch` errors, attempt targeted repair before returning `failed`.

```typescript
// Pseudo-code for the new pipeline repair pass:
const pronounErrors = errors.filter(e => e.type === 'pronoun_gender_mismatch');
if (pronounErrors.length > 0 && cast.length > 0) {
  // Attempt deterministic repair per scene
  let repairedAny = false;
  for (const scene of story.scenes) {
    const flaggedNames = pronounErrors
      .filter(e => e.sceneNumber === scene.number)
      .map(e => /^Character "([^"]+)"/.exec(e.message)?.[1])
      .filter((n): n is string => !!n);
    if (flaggedNames.length === 0) continue;
    const result = repairPronouns(scene.text, cast, { targetNames: flaggedNames });
    if (result.repairCount > 0) {
      scene.text = result.text;
      repairedAny = true;
    }
  }
  if (repairedAny) {
    // Re-run CharacterConsistencyValidator on the repaired story
    const residual = characterValidator.validate(story, cml).errors
      .filter(e => e.type === 'pronoun_gender_mismatch');
    // Replace pronoun errors in the combined error list with residual only
    errors = [...errors.filter(e => e.type !== 'pronoun_gender_mismatch'), ...residual];
  }
}
```

This repair pass costs nothing (deterministic, no LLM call) and salvages stories where pronoun errors survived exclusively because conservative repair was not applied at story level.

**Effort:** ~40 lines. Medium complexity (requires importing `repairPronouns` into story-validation package, or moving the repair call into a shared coordinator). The `repairPronouns` function is already in `packages/story-validation/src/pronoun-repair.ts` so the import path is within the same package.

### R05 — Sentence-level anchors in pronoun retry feedback (Rt-1)

**File:** `packages/prompts-llm/src/agent9-prose.ts`, `buildEnhancedRetryFeedback()` pronoun block
**Change:** When building the pronoun feedback block, also extract the first failing sentence for each character from the current chapter text.

This requires the feedback builder to receive the current chapter text (or a `Record<characterName, failingSentence>` pre-computed map). To avoid major interface changes, compute the failing sentence map in the generation loop before calling `buildEnhancedRetryFeedback()`:

```typescript
// In the generation loop, after targeted repair fails:
const failingSentences: Record<string, string> = {};
for (const msg of residualPronounIssues) {
  const nameMatch = /^Character "([^"]+)"/.exec(msg);
  if (!nameMatch) continue;
  const name = nameMatch[1];
  // Extract first sentence containing the character label + a wrong-gender pronoun
  const wrongPronounPattern = charState.gender === 'male'
    ? /\b(she|her|hers|herself)\b/i
    : /\b(he|him|his|himself)\b/i;
  const sentences = chapterText.split(/(?<=[.!?])\s+/);
  const failingSentence = sentences.find(s =>
    characterMentionedIn(s, labelsFor(name)) && wrongPronounPattern.test(s)
  );
  if (failingSentence) failingSentences[name] = failingSentence;
}
```

Then in the retry feedback per-character block:
```
⚠️ NAME is GENDER — use "he/him/his" ONLY.
   Failing sentence: "[The exact sentence from the chapter]"
   Why it fails: 'her/she' are WRONG here — NAME is male.
   Fixed version should use he/him/his throughout.
```

This gives the LLM a surgical target rather than "search your draft." Effort: medium. High impact.

### R06 — Add non-binary support to `pronoun-repair.ts` (X-2)

**File:** `packages/story-validation/src/pronoun-repair.ts`
**Change:** Add non-binary to `PRONOUN_MAP` and update `buildCharacterInfo` to include non-binary characters.

```typescript
// Current:
const PRONOUN_MAP: Record<string, PronounSet> = {
  male: { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself' },
  female: { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself' },
};

// Add:
  'non-binary': { subject: 'they', object: 'them', possessive: 'their', reflexive: 'themselves' },
```

Update `buildCharacterInfo`:
```typescript
// Current filter:
.filter((c) => c.gender && (c.gender.toLowerCase() === 'male' || c.gender.toLowerCase() === 'female'))

// New filter:
.filter((c) => {
  const g = c.gender?.toLowerCase();
  return g === 'male' || g === 'female' || g === 'non-binary';
})
```

Update `repairPronounsInSegment`: the current code builds `wrongPronouns` based on `targetGender === 'male' ? female-pronouns : male-pronouns`. For non-binary (they/them/their), the wrong pronouns are all binary gendered forms. The subject heuristic and `her`-disambiguation path need non-binary case handling.

**Complexity note:** the `her` disambiguation (possessive vs object) is only relevant for male targets. For a non-binary target where `she/her/his/him/himself/herself` are all wrong, the replacement logic is simpler: any binary-gendered pronoun → replace with the corresponding neutral form. The disambiguated `her` path still applies for determining whether `her` was possessive ("her coat" → their coat) or indirect-object ("told her" → told them).

This is the highest-value repair gap. Without it, the pipeline has zero deterministic recovery for non-binary pronoun errors.

**Effort:** ~25 lines. Medium risk — all pronoun repair tests should pass after the change; new non-binary-specific tests should be added.

### R07 — Replace `detectNameSwitches()` hardcoded list with cast-driven detection (V-4)

**File:** `packages/story-validation/src/character-validator.ts`
**Change:** Replace the hardcoded detective names with a cast-driven check: for each cast member, detect if their canonical name appears in some scenes alongside a different name that doesn't belong to any other cast member.

This should be treated as a separate fix (not blocking pronoun improvement), but logged here for completeness.

---

## §12 Summary Table — Issues by Priority

| ID | Layer | Severity | Title | Fix |
|---|---|---|---|---|
| V-1 | Validation | **CRITICAL** | `pronoun_drift` has no competing-entity guard — generates false positives | Remove or downgrade to info (R03) |
| X-2 | Cross-cutting | **HIGH** | Non-binary characters have zero deterministic repair support | Add non-binary to `PRONOUN_MAP` (R06) |
| P-1 | Prompts | **HIGH** | Non-binary characters excluded from PRONOUN AUDIT checklist | Fix filter (R01) |
| V-2 | Validation | **HIGH** | No story-level deterministic pronoun repair — pipeline failures are unrecoverable | Add repair pass before `failed` return (R04) |
| Rt-1 | Retry | **HIGH** | Retry feedback lacks failing sentence — LLM must regenerate blind | Extract + include failing sentence (R05) |
| P-2 | Prompts | MEDIUM | System message ABSOLUTE RULE block omits non-binary pronoun mandate | Add they/them to system message (R02) |
| P-3 | Prompts | MEDIUM | Three different pronoun citation formats across prompt sections | Standardise to 4-form |
| R-1 | Repair | MEDIUM | Conservative repair leaves valid repairs for the validator | Enable subject-heuristic in conservative mode |
| V-3 | Validation | MEDIUM | `ProseConsistencyReport.overallStatus` not scoped to ProseConsistencyValidator | Scope overallStatus to ProseConsistencyValidator errors |
| Rt-2 | Retry | MEDIUM | Retry feedback regex silently fails if validator message format changes | Contract test between validator and feedback builder |
| P-4 | Prompts | LOW | NSD character pronouns empty for batch 1 | Informational — accuracy block covers this |
| P-5 | Prompts | LOW | `character_personality` droppable for binary-only casts | Low; accuracy block compensates |
| R-2 | Repair | LOW | Dialogue attribution lookback may miss speakers in very dense paragraphs | Acceptable tradeoff |
| R-3 | Repair | LOW | `lastSingleCharacter` doesn't reset at scene breaks within a chapter | Edge case; low frequency |
| V-4 | Validation | LOW | `detectNameSwitches()` hardcoded detective names — misses real switches | Cast-driven detection (R07) |
| Rt-3 | Retry | LOW | No story-level LLM retry for pipeline-level pronoun failures | Covered by R04 |

---

## §13 Recommended Implementation Order

The following sequence maximises pronoun accuracy improvement per unit of implementation risk:

**Round 1 — Zero-risk prompt fixes (30 minutes combined):**
1. R01 — Add non-binary to PRONOUN AUDIT filter
2. R02 — Add non-binary to system message ABSOLUTE RULE block
These have no failure modes, affect only prompt text, and directly address the hardest failure case.

**Round 2 — High-value detector cleanup (1 hour):**
3. R03 — Remove `pronoun_drift` from ProseConsistencyValidator
Removes a noise source and false-positive path. Clean up tests.

**Round 3 — Core repair gap (2–4 hours):**
4. R06 — Add non-binary support to `pronoun-repair.ts`
Most impactful coding change. Requires careful `repairPronounsInSegment` extension for non-binary and new test suite.

**Round 4 — Pipeline repair safety net (2–3 hours):**
5. R04 — Deterministic repair pass in `StoryValidationPipeline`
Closes the hole where pipeline-level pronoun errors have no recovery path.

**Round 5 — Retry feedback quality improvement (2–3 hours):**
6. R05 — Sentence-level anchors in pronoun retry feedback
Most complex change; requires threading chapter text through to feedback builder or pre-computing the failing-sentence map. Reduces full-chapter retry count for pronoun-only failures.

**Deferred:**
- R07 — Cast-driven `detectNameSwitches()` (unrelated to pronouns; useful but separate scope)
- P-3 — Pronoun format standardisation (cosmetic; minimal LLM impact)
- V-3 — `ProseConsistencyReport.overallStatus` scoping (housekeeping; correct but low operational impact)
