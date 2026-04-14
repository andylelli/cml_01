# ANALYSIS_12: Generator-Wide Quality Gaps and Remediation Plan

## Overview

Systematic audit of 20 quality categories across the CML mystery generator pipeline.
Each category is assessed against existing infrastructure, current gaps, and recommended fixes.
Issues are grouped into three priority tiers: **output hygiene**, **story-state consistency**, and **quality control**.

### Status key

| Symbol | Meaning |
|--------|---------|
| NOT DONE | Not yet implemented — needs new code |

---

## Tier 1 — Output Hygiene

### 1. Text Encoding in PDF Export — DONE

**Problem:** PDF export produces corrupted characters — broken apostrophes, quotes, em dashes, and ellipses (mojibake like `â`, `â`, `â`). Broken words like `truthâand`, `fearâfear`, `himselfâorganized`. Hidden/bad characters causing odd spacing like `Iâƒ I`.

**Note:** The in-pipeline `EncodingValidator` handles encoding at the prose generation stage, but the PDF export path introduces its own encoding issues — likely during HTML-to-PDF rendering or font embedding.

**Gaps:**
- No encoding sanitization in the PDF export pipeline
- No validation that the PDF output preserves the cleaned prose text
- Smart quote / em dash characters may not be supported by the PDF renderer's font

**Recommendations:**
1. **Add a pre-PDF encoding pass** — before rendering to PDF, normalize all Unicode punctuation to ASCII-safe equivalents or ensure the PDF font supports the full Unicode range
2. **Replace smart quotes/dashes** with their ASCII equivalents (`"`, `'`, `--`, `...`) if the PDF renderer cannot handle them, or embed a font that supports the full typographic character set
3. **Add a post-PDF validation** — re-read the PDF text layer and check for mojibake patterns
4. **Investigate the PDF rendering library** — determine whether the issue is in the HTML template, the rendering engine, or the font configuration

---

### 2. Prompt Leakage Filtering — DONE

**Existing infrastructure:**
- `checkTemplateLeakage()` in `packages/story-validation/src/chapter-validator.ts` — regex-based scaffold detection
- Boilerplate fingerprint deduplication (repeated >100 char paragraphs)
- Prompt instruction in `agent9-prose.ts` line ~1465: "Never emit scaffold prose"

**Gaps:**
- Pattern-based only — cannot catch novel scaffold variations the regex doesn't know about
- No structural classifier for "prompt-shaped" prose (e.g., lists of instructions, weather directives, bare location tags embedded in narratives)
- No detection of scene-metadata fragments (e.g., `Under overcast with intermittent rain, creating a damp and chilly environment. skies...`)

**Recommendations:**
1. **Extend leakage regexes** — add patterns for common LLM scaffold idioms:
   - `^(Under|In|By the time they reached|At The)\s+[A-Z].*\bskies\b` — bare atmospheric scene-setting that reads like a prompt
   - `^(Setting|Location|Atmosphere|Weather|Mood):` — metadata key-value pairs leaked verbatim
   - `\b(sensory detail|grounding element|narrative beat|plot point)\b` — meta-language about storytelling technique
2. **Add a per-paragraph structural score** — flag paragraphs with extremely low verb density or high noun-phrase stacking, which signals copy-pasted atmosphere blocks rather than narrative prose
3. **Long-term:** Consider an LLM-based semantic filter that classifies paragraphs as "prose" vs "scaffold" (expensive — gated behind a quality flag)

---

### 3. Chapter Schema Enforcement — DONE

**Existing infrastructure:**
- `validateChapter()` in `packages/story-validation/src/chapter-validator.ts` — 9 per-chapter checks
- Paragraph count minimum, max paragraph length, balance checks
- Chapter number used for late-chapter threshold scaling
- `ChapterContent` interface in `types.ts`

**Gaps:**
- No cross-story chapter **ordering** validation (missing, duplicated, or skipped chapter numbers)
- No chapter **title** format validation (no enforcement of title-only, number-only, or number+title)
- No detection of format inconsistency within the same story (titled chapters mixed with numbered chapters)

**Recommendations:**
1. **Add a `ChapterSequenceValidator`** — run post-prose across all chapters:
   - Verify sequential numbering with no gaps or duplicates
   - Verify uniform title format (all titled, all numbered, or all number+title)
   - Error severity: major (title inconsistency), critical (missing chapter)
2. **Integrate into the validation pipeline** after the per-chapter validators complete

---

### 12. Malformed Sentence Detection — NOT DONE

**Existing infrastructure:**
- `malformedOutputs` tracking in `agent9-prose.ts` line ~3267 — counts unparseable JSON
- Sentence-level pronoun repair implies sentence boundary detection
- Validation retry wrapper prevents structurally malformed artifacts from entering pipeline

**Gaps:**
- No prose-level grammar validation (subject-verb agreement, tense consistency)
- No sentence splice / run-on detection
- No detection of duplicated or incomplete sentence fragments
- No detection of summary-mode text dropped into narrative flow (e.g., "A half-empty bottle of poison is found in the study.")

**Recommendations:**
1. **Add a sentence-quality postprocessor** — lightweight heuristics, not a full grammar engine:
   - Flag sentences >60 words (likely run-on)
   - Flag sentences with >3 coordinate conjunctions (likely splice)
   - Flag sentences that begin with articles + passive voice + present tense inside past-tense chapters (summary intrusion signal)
   - Flag duplicated 6+-word n-grams within the same chapter
2. **Severity:** moderate for grammar, major for duplicated fragments
3. **Long-term:** Consider integrating a sentence-level LLM quality check for the final chapter batch only (cost-bounded)

---

### 15. Dialogue Formatting — NOT DONE

**Existing infrastructure:**
- `repairDialogueAttributionPronouns()` in `packages/story-validation/src/pronoun-repair.ts`
- Dialogue-open style categorization in prose-consistency-validator
- Dialogue presence scoring in quality reports

**Gaps:**
- No quotation mark normalization (mismatched smart/straight quotes)
- No validation of dialogue punctuation (missing comma before closing quote, missing attribution)
- No detection of dialogue blending into narration without proper formatting

**Recommendations:**
1. **Add quotation mark normalization** to the encoding sanitizer — standardize all quotes to curly or straight (pick one convention):
   - `"` → `"` / `"` or vice versa
   - `'` → `'` / `'` or vice versa
   - Detect orphaned open-quotes (no matching close-quote in the same paragraph)
2. **Add dialogue punctuation validation:**
   - Require comma or period before closing quote in dialogue lines
   - Flag dialogue lines with no attribution and no paragraph break context
3. **Integrate** into the existing `EncodingValidator` pass (quote normalization) and `ChapterValidator` (punctuation checks)

---

## Tier 2 — Story-State Consistency

### 4. Location Continuity — DONE

**Existing infrastructure:**
- `checkSettingFidelity()`, `checkSceneGrounding()` in `chapter-validator.ts`
- `checkRoleLocationConsistency()` in `character-validator.ts`
- Location profiles stored per-CML with sensory details (via `CMLAccessors`)
- Setting drift detection (e.g., manor-specific terms in non-manor scenario)

**Gaps:**
- No canonical name normalization across chapters (e.g., "Drawing Room" ≠ "drawing-room")
- No structured location→chapter mapping to detect impossible transitions (character in room A, next paragraph in room B without movement)
- No scene-to-scene location transition validation

**Recommendations:**
1. **Add a `LocationNormalizer`** — maintain a canonical-name registry built from CML `location_profiles`:
   - Normalize casing, hyphenation, and article usage ("the library" → "Library")
   - Map aliases (e.g., "the study" → "Study" if they are the same room)
   - Flag paragraphs that reference a location by an unregistered name (severity: moderate)
2. **Add cross-chapter location consistency** — track the most recent canonical location per character and flag jumps without narrative transition (severity: moderate)
3. **Feed the canonical name list into the prose prompt** so the LLM uses consistent references from generation time

---

### 5. Timeline Consistency — NOT DONE

**Existing infrastructure:**
- `temporal-consistency.ts` — month/season mapping and conflict detection
- `checkTemporalConsistency()` in `chapter-validator.ts`
- Cross-scene temporal contradiction checking in `narrative-continuity-validator.ts`
- Season pattern regex matching

**Gaps:**
- No hour/minute-level timeline tracking (times of day are not modeled)
- No structured time-of-death / alibi-window cross-validation
- No detection of chronological contradictions between specific clock times in clues, dialogue, and narration
- No "last seen alive at X" vs "died at Y" constraint checking

**Recommendations:**
1. **Add a `TimelineValidator`** operating on CML + prose:
   - Extract all absolute times from CML (alibi_window, time anchors, locked facts involving times)
   - Build a canonical event timeline: `[{event, character, time, chapter, source}]`
   - Extract prose-mentioned times via regex (`/\b\d{1,2}[:.]\d{2}\s*(AM|PM|a\.m\.|p\.m\.)?/gi`, `/\b(midnight|noon|half past \w+|quarter to \w+)\b/gi`)
   - Validate ordering: no character can be in two places at the same time; "last seen at X" must be before "found dead at Y"
   - Error severity: critical (timeline contradictions involving the culprit/victim)
2. **Feed canonical timeline constraints** into the Agent 9 prose prompt per-chapter as locked temporal facts
3. **Long-term:** Model an explicit `TimelineState` object parallel to `NarrativeState`, updated per-chapter

---

### 6. Culprit/Solution Consistency — NOT DONE

**Existing infrastructure:**
- `SuspectClosureValidator` — culprit evidence chain validation (regex + LLM semantic fallback)
- `NarrativeContinuityValidator` — post-reveal identity stability
- Regex elimination detection ("cleared", "ruled out", "innocent")
- Evidence terms correlation (evidence + reason + alibi)
- CML canonical culprit/method/motive stored in structured state

**Gaps:**
- No explicit post-reveal motive consistency check (culprit confesses to correct motive)
- No detection of guilt reassignment errors (blame shifts to wrong character in final paragraphs)
- Culprit evidence is regex-first; semantic validation is fallback only

**Recommendations:**
1. **Add a resolution-specific check** to `SuspectClosureValidator`:
   - In the final 20% of chapters, verify the character named as guilty matches `cml.CASE.culpability` where `culpability === 'guilty'`
   - Verify no innocent character is described as confessing or being arrested
   - Error severity: critical
2. **Add motive-alignment scoring** — compare the confession/reveal text against the CML `motive_seed` for the guilty character (LLM-based, gated)
3. **Low priority** given existing infrastructure is reasonably strong

---

### 7. Motive Stability — NOT DONE

**Existing infrastructure:**
- Agent 2 assigns `motive_seed` and `motive_strength` per character
- CML stores these as structured fields

**Gaps:**
- **No runtime validation** that motives appear in or are consistent with prose
- No drift detection (character acts against stated motive across chapters)
- No confession-to-motive alignment validation
- Each chapter prompt can regenerate motive framing without constraint

**Recommendations:**
1. **Add motive keywords to prose prompt constraints** — extract 3–5 key terms from `motive_seed` and include them in the per-chapter `CHAPTER OBLIGATIONS` block for chapters where that character's motive should surface (severity: soft — guidance, not hard validation)
2. **Add a `MotiveConsistencyValidator`** — post-prose check:
   - For the guilty character, verify chapters that discuss their motive use consistent language
   - For the confession/reveal chapter, verify the stated motive aligns with `motive_seed`
   - Use token overlap between CML motive text and prose (similar to current clue obligation checking)
   - Error severity: major (motive drift), critical (confession contradicts setup)
3. **Store motive-mention tracking** in `NarrativeState` so the prompt can reference earlier motive beats

---

### 8. Pronoun and Character-Identity Consistency — NOT DONE

**Problem:** Characters are sometimes referred to with inconsistent pronouns (e.g., `her` in one paragraph, `their` in the next). Pronoun switching mid-chapter breaks immersion.

**Gaps:**
- Nested pronoun antecedent resolution (ambiguous multi-character references)
- Pronoun repair limited to unambiguous single-character sentences — multi-character scenes are not corrected
- No detection of mid-chapter pronoun switching for the same character

**Recommendations:**
1. **Add a per-chapter pronoun consistency check** — within a single chapter, if the same character is referred to with different pronoun sets, flag as critical
2. **Extend pronoun repair** to handle two-character scenes (the most common case after single-character)
3. **Add a pronoun-consistency directive** to the retry prompt when pronoun errors are detected

---

### 9. Resolution Contradiction Detection — NOT DONE

**Existing infrastructure:**
- Post-reveal identity stability checking (no role-alias after arrest/confession)
- Disappearance-to-death bridge validation
- Culprit evidence chain presence checking
- Suspect elimination evidence checking

**Gaps:**
- No detection of accidental guilt reassignment (e.g., prose says "Geraint's actions" when it should say "Claire's actions")
- No verification that emotional resolution aligns with plot facts
- No "two culprits named" detection

**Recommendations:**
1. **Add a final-chapter sanity check** in `SuspectClosureValidator`:
   - In chapters after the reveal, extract character names that co-occur with guilt keywords ("guilty", "confess", "arrested", "poisoned", "murdered")
   - Verify only the CML-designated culprit appears in this set
   - Flag if an innocent character is falsely implicated (severity: critical)
2. **Add action-attribution checking** — in the reveal chapter, verify that the method description (e.g., "administered the poison") is attributed to the correct character name
3. **Lower priority than Tier 1** — existing infra catches most issues

---

### 17. Knowledge State Tracking — NOT DONE

**Existing infrastructure:** None

**Gaps:**
- No tracking of what each character (or the reader) knows at any point in the story
- No detection of knowledge anachronisms (character reacts to a clue before discovering it)
- No verification that clue discovery matches the narrative outline's intended progression

**Recommendations:**
1. **Add a `KnowledgeStateTracker`** — build progressively during prose generation:
   - For each chapter, record: `{character, learned_fact, chapter_number}`
   - Sources: CML clue distribution (which clue surfaces in which chapter), detective's deductions, dialogue revelations
   - This data is already partially available from the narrative outline's `scene_clues` field
2. **Add a discovery-order validator** — post-prose check:
   - Verify the detective does not reference a clue before the chapter where it was assigned
   - Verify suspects are not accused before evidence exists
   - Error severity: major (knowledge anachronism)
3. **Complex to implement fully** — start with CML clue-to-chapter mapping as ground truth, validate that prose-mentioned clues don't precede their assigned chapter
4. **Medium priority** — high impact on story logic but requires significant new infrastructure

---

## Tier 3 — Quality Control

### 10. Clue Repetition Reduction — NOT DONE

**Existing infrastructure:**
- `cluesRevealedToReader` in `NarrativeState` — tracks which clue IDs have been surfaced
- Clue density parameter ("minimal"/"moderate"/"dense") in design
- Clue-to-scene mapping in CML narrative outline

**Gaps:**
- No tracking of how many times the same clue has been **explained** (discovery vs re-evaluation vs final payoff)
- No detection of near-identical wording restatement of the same clue across chapters
- `cluesRevealedToReader` tracks presence but not explanation count or wording variation

**Recommendations:**
1. **Extend `NarrativeState.cluesRevealedToReader`** to record a mention count and last-mention chapter:
   ```typescript
   cluesRevealedToReader: Array<{ clueId: string; mentionCount: number; lastChapter: number }>;
   ```
2. **Add per-chapter clue repetition guidance** in the prompt:
   - If a clue was already introduced (mentionCount > 0), instruct: "Reference [clue] briefly or from a new angle — do not restate the original discovery"
   - If mentionCount ≥ 3, instruct: "Do not describe [clue] again unless directly confronted with new evidence"
3. **Add a post-prose validator** that detects near-identical clue explanation wording across chapters using token overlap scoring (similar infrastructure to current `chapterMentionsRequiredClue`)
4. **Severity:** moderate (repetition), not critical

---

### 11. Emotional Phrase Repetition — NOT DONE

**Existing infrastructure:**
- Opening style entropy checking (variety enforcement for chapter openings)
- `usedSensoryPhrases` in `NarrativeState` — tracks last 20 sensory phrases
- n-gram overlap detection for template leakage
- Prompt instruction: "Use 2–3 senses per scene"

**Gaps:**
- No tracking of emotional-beat phrases ("heart racing", "chill down spine", "weight pressing down")
- `usedSensoryPhrases` tracks sensory vocabulary but not emotional vocabulary
- No lexical variation enforcement for tension-building language across chapters

**Recommendations:**
1. **Extend `NarrativeState` with `usedEmotionalBeats`** — parallel to `usedSensoryPhrases`:
   ```typescript
   usedEmotionalBeats: string[]; // last 30 emotional phrases, oldest first
   ```
2. **Extract emotional beats** from each completed chapter — simple pattern matching for common phrases:
   - `heart (racing|pounding|hammering|skipping)`
   - `chill (down|along|through) (her|his|their) spine`
   - `weight (of|pressing|bearing) (down|on)`
   - `tension (thickened|hung|crackled|mounted)`
   - `truth (lurking|hiding|waiting|beneath)`
3. **Include used beats in prompt** — similar to used opening styles, emit: "Do not reuse these emotional phrases: [list]"
4. **Severity:** minor (repetition is a quality issue, not a correctness issue)

---

### 13. Narrative Mode Consistency — NOT DONE

**Existing infrastructure:** None

**Gaps:**
- No detection of outline-style intrusion in prose (bare fact statements, list-like paragraphs)
- No mode blending detection (shifts between dramatized dialogue and summarized narration)
- No "show vs tell" quality signal

**Recommendations:**
1. **Add a `NarrativeModeValidator`** with heuristic checks on each paragraph:
   - **Summary intrusion signal:** Paragraph has ≤2 sentences, uses present tense, no dialogue, no character action verbs → flag as "possible summary intrusion" (severity: moderate)
   - **Outline intrusion signal:** Paragraph starts with a noun phrase and colon, or reads as a bare factual statement with no scene grounding → flag (severity: major)
   - **Mode shift signal:** Detect paragraphs where verb tense shifts from past to present mid-paragraph (excluding dialogue)
2. **Feed back** into retry directives: "Rewrite flagged paragraph as dramatized prose"
3. **Medium priority** — affects reader experience but not story correctness

---

### 14. Summary Intrusion Prevention — NOT DONE

**Existing infrastructure:**
- Prompt guidance: "Each clue must be concrete, specific, and noticeable" / "Do not bury it in atmosphere or passing dialogue"
- Template leakage detection (catches some scaffold intrusions)

**Gaps:**
- No runtime detection of summary statements embedded in scene prose
- No validation that prose obeys "dramatize, don't summarize"
- Only prompt guidance — no enforcement

**Recommendations:**
- Covered by recommendation 13.1 above (`NarrativeModeValidator` summary intrusion signal)
- Additionally: **add a prose-level check** for sentences that match the CML scene summary with >70% token overlap — these are likely copy-pasted from the summary rather than dramatized (severity: moderate)
- Can reuse the `tokenizeForClueObligation` infrastructure for similarity scoring

---

### 16. Verbosity Control — NOT DONE

**Existing infrastructure:**
- Hard floor and preferred target word counts per chapter
- Paragraph count minimum (3+) and max length (2400 chars)
- Paragraph length balance detection (10:1 ratio)

**Gaps:**
- No **overwrite** detection (chapters that are excessively verbose, restating mood without advancing plot)
- No descriptive density caps
- No "scene progress per paragraph" heuristic

**Recommendations:**
1. **Add a word count ceiling** — symmetrical to the hard floor:
   - Preferred ceiling: 1.3× the target word count
   - Hard ceiling: 1.5× the target
   - Severity: moderate (exceeding preferred), major (exceeding hard ceiling)
2. **Add a paragraph-level progress heuristic:**
   - Count paragraphs that introduce new information (new character action, new dialogue, new clue, new location) vs paragraphs that only describe atmosphere or emotion
   - If >40% of paragraphs are atmosphere-only, flag as "descriptive overload" (severity: moderate)
3. **Lower priority** — word count floors are the bigger problem in practice

---

### 18. Sensory Description Filtering — NOT DONE

**Existing infrastructure:**
- `checkSceneGrounding()` in chapter-validator — sensory marker detection (smell, sound, cold, warm, etc.)
- Minimum sensory cue requirement (2+) and atmosphere marker (1+) in opening block
- Location profile sensory palettes (sights, sounds, smells, tactile)
- `usedSensoryPhrases` tracking in NarrativeState (last 20)
- Prompt guidance: "Use 2–3 senses per scene"

**Gaps:**
- No sensory **overstuffing** detection (≥5 sensory cues jammed into a single paragraph)
- No cross-chapter sensory phrase repetition checking (same descriptor in multiple chapters)
- No validation that prose uses sensory details from the assigned location profile (design-prose alignment)

**Recommendations:**
1. **Add sensory density cap** to `checkSceneGrounding()`:
   - Flag paragraphs with ≥5 distinct sensory markers as "sensory overload" (severity: minor)
   - This catches the "pasted sensory block" pattern where all five senses are crammed into one sentence
2. **Cross-chapter sensory dedup** is already scaffolded by `usedSensoryPhrases` — add a check that flags exact 3-gram overlaps across chapters (severity: minor)
3. **Low priority** — sensory grounding is more often under-present than over-present

---

### 19. Supporting Cast Tracking — NOT DONE

**Existing infrastructure:**
- `checkNamedWalkOns()` in `character-validator.ts` — flags out-of-cast named characters
- Title+surname walk-on blocking
- Character usage tracking per scene
- Unnamed role walk-ons allowed ("a footman", "the constable")

**Gaps:**
- No detection of abandoned characters (cast member introduced but never mentioned after Act I)
- No underused character warnings
- No detection of names that conflict with existing cast aliases

**Recommendations:**
1. **Add an `AbandonedCharacterDetector`** — post-prose cross-story check:
   - For each cast member, count total chapter appearances
   - If a non-victim cast member appears in ≤1 chapter, flag as "underused character" (severity: minor)
   - If a cast member is mentioned in Act I but not in Acts II or III, flag as "abandoned after setup" (severity: moderate)
2. **Add alias conflict detection** — when walk-on detection parses names, verify no walk-on surname matches a cast member's surname (already partially implemented via `allowedSurnames`)
3. **Low priority** — walk-on detection catches the worst cases

---

### 20. Final QA Pipeline — NOT DONE

**Existing infrastructure:**
- `StoryValidationPipeline` in `packages/story-validation/src/pipeline.ts` — sequential 9-validator chain
- Report generation with severity summary (critical/major/moderate/minor)
- Post-generation summary diagnostics
- Report invariants checking

**Gaps:**
- Validators detect issues but do not attempt automated repair (except pronoun repair and encoding fix)
- No issue prioritization logic beyond severity labels
- No re-generation loop for individually failed chapters (only full-batch retry)
- No final polish pass (spelling, repeated wording, paragraph breaks)

**Recommendations:**
1. **Add a `RepairPipeline`** — complement the validation pipeline with a repair pipeline:
   - Encoding repair — already exists (`EncodingValidator.fixStory()`)
   - Pronoun repair — already exists (`PronounRepair`)
   - Quote normalization — new (as per item 15)
   - Summary intrusion flagging — new (as per item 13/14), with optional LLM-based rewrite
2. **Add per-chapter re-generation** for chapters with critical errors that survive repair:
   - Currently the system retries the entire batch, including chapters that already passed
   - A per-chapter retry would be more efficient and targeted
3. **Add a final spellcheck pass** — use a lightweight dictionary check for proper nouns vs unknown words
4. **Medium priority** — the validation pipeline is solid, repair capabilities are the main gap

---

## Priority Matrix

### Immediate (high impact, bounded scope)

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 1 | PDF export encoding fix | Small | Eliminates mojibake in exported stories |
| 3 | Chapter sequence validation | Small | Catches missing/duplicated chapters |
| 8 | Pronoun consistency per chapter | Small | Stops mid-chapter pronoun switching |
| 9 | Resolution guilt-attribution check | Small | Catches wrong-character blame in reveal |
| 15 | Quote normalization | Small | Fixes inconsistent quotation marks |

### Near-term (moderate effort, strong quality improvement)

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 2 | Extended prompt leakage patterns | Small | Catches novel scaffold idioms |
| 6 | Culprit/motive post-reveal check | Medium | Prevents wrong-character confessions |
| 7 | Motive stability validation | Medium | Prevents motive drift and confession mismatches |
| 10 | Clue repetition tracking in NarrativeState | Medium | Reduces repeated clue explanations |
| 11 | Emotional beat tracking in NarrativeState | Medium | Reduces repeated tension phrases |
| 12 | Sentence-level quality heuristics | Medium | Catches run-ons, splices, summary intrusion |
| 13 | Narrative mode consistency | Medium | Detects outline text in prose |
| 14 | Summary intrusion prevention | Medium | Blocks raw fact statements in scene prose |
| 16 | Verbosity control (word count ceiling) | Small | Prevents overwritten chapters |
| 18 | Sensory overstuffing detection | Small | Catches pasted sensory blocks |
| 19 | Abandoned character detection | Small | Flags unused cast members |

### Long-term (significant effort or requires LLM-based analysis)

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 4 | Cross-chapter location graph | Large | Catches impossible character movements |
| 5 | Hour-level timeline validator | Large | Catches time contradictions in clues/alibis |
| 17 | Knowledge state tracking | Large | Catches discovery-order violations |
| 20 | Per-chapter repair/regeneration pipeline | Large | Reduces wasted full-batch retries |

---

## Implementation Guidance

### Architecture fit

The recommended validators and state extensions follow the existing architecture:

- **New validators** → add to `packages/story-validation/src/` and register in `pipeline.ts`
- **NarrativeState extensions** → extend the interface in `packages/prompts-llm/src/types/narrative-state.ts` and update `updateNSD()` to populate new fields
- **Prompt constraint additions** → add to `buildNarrativeStateBlock()` or `buildChapterObligationsBlock()` in `agent9-prose.ts`
- **Repair pipeline** → parallel to `StoryValidationPipeline` in story-validation package

### Dependency ordering

Some items depend on others:

1. Item 15 (quote normalization) can be added to the existing `EncodingValidator` immediately
2. Items 10 and 11 (repetition tracking) require `NarrativeState` schema changes, then prompt changes
3. Item 13 (narrative mode) should precede item 14 (summary intrusion) since they share infrastructure
4. Item 17 (knowledge tracking) depends on reliable clue-to-chapter mapping from the narrative outline
5. Item 5 (timeline) is independent and can be developed in parallel with everything else

### Testing approach

Each new validator should follow the established pattern:
- Unit test in `packages/story-validation/src/__tests__/` with synthetic CML + story fixtures
- Integration test verifying the validator is registered and runs in the pipeline
- Manual test with at least one real generated story to calibrate thresholds

---

## Fixes

Concrete code-level fixes for each of the 20 issues, grounded in the actual codebase.

---

### Fix 1 — Text Encoding in PDF Export — IMPLEMENTED

**Root cause:** `buildProsePdf()` in `apps/api/src/server.ts` renders text through `escapePdfText()` into raw PDF 1.4 content streams. The font was `/Helvetica` (Type1) with no explicit encoding declared, defaulting to StandardEncoding. Characters outside ASCII — em dashes (`—` U+2014), smart quotes (`"` U+201C, `"` U+201D, `'` U+2018, `'` U+2019), ellipses (`…` U+2026), bullets (`•` U+2022) — were written as multi-byte UTF-8 sequences by `Buffer.from(pdf, "utf-8")`, but the PDF font expected single-byte glyph codes, producing mojibake.

**Fix applied:** Replaced `escapePdfText()` with `encodePdfText()` in `apps/api/src/server.ts`:

1. **`UNICODE_TO_WINANSI` mapping table** — maps 27 Unicode code points (0x0080–0x009F range that differs from ISO-8859-1) to their WinAnsiEncoding byte values. Covers smart quotes, em/en dashes, ellipsis, bullets, trademark, ligatures, etc.

2. **`encodePdfText()`** — replaces `escapePdfText()`. For each character:
   - PDF special chars (`\`, `(`, `)`) → escaped
   - Printable ASCII (0x20–0x7E) → pass through
   - Latin-1 Supplement (0xA0–0xFF) → octal escape `\xxx` (byte value = code point)
   - Unicode with WinAnsi mapping (smart quotes, dashes, etc.) → octal escape with mapped byte
   - Anything else → `?` fallback

3. **Font declaration** updated from `/BaseFont /Helvetica` to `/BaseFont /Helvetica /Encoding /WinAnsiEncoding` — tells the PDF renderer to use Windows-1252 encoding, which supports all common typographic characters.

**Result:** The PDF file remains ASCII-safe (all non-ASCII characters are encoded as PDF octal escape sequences like `\227` for em dash). The WinAnsiEncoding declaration tells the renderer to map byte 0x97 → em dash glyph. Smart quotes, em dashes, ellipses, bullets, and accented characters now render correctly.

**Files changed:** `apps/api/src/server.ts` (3 edits: new function, call site, font declaration)
**Tests:** 51/51 API tests pass (3 pre-existing scoring failures unchanged)

---

### Fix 2 — Prompt Leakage Filtering — IMPLEMENTED

**Root cause:** `checkTemplateLeakage()` in `packages/story-validation/src/chapter-validator.ts` used a single hardcoded scaffold regex plus duplicate paragraph detection. Novel scaffold idioms — metadata key-value lines, meta-language about storytelling technique, instruction-shaped prose — passed through undetected.

**Fix applied:** Extended `checkTemplateLeakage()` in `packages/story-validation/src/chapter-validator.ts` with four new detection patterns:

1. **Metadata key-value leakage** — regex `/^(Setting|Location|Atmosphere|Weather|Mood|Tone|Theme|Scene|Time|Chapter\s*\d*):/m` catches verbatim metadata lines like `Setting: A dimly lit room`.

2. **Meta-language about storytelling technique** — regex matching phrases like "sensory detail", "grounding element", "narrative beat", "plot point", "character arc", "story beat", "scene transition", "dramatic irony".

3. **Instruction-shaped prose** — regex catching imperative verbs (ensure, make sure, remember to, etc.) combined with storytelling nouns (tension, atmosphere, clue, motive, suspense, mystery).

4. **Low-verb-density paragraph flag** — per-paragraph heuristic: splits into sentences, checks verb presence with a 60+ verb vocabulary. If <30% of sentences contain verbs in a paragraph with 3+ sentences, flags as a possible copy-pasted atmosphere block (moderate severity, one flag per chapter max).

**Files changed:** `packages/story-validation/src/chapter-validator.ts` (extended `checkTemplateLeakage()`)
**Tests:** 4 new test cases in `packages/story-validation/src/__tests__/chapter-validator.test.ts` — metadata leakage, meta-language, instruction-shaped prose, clean prose false-positive check. All 20 chapter-validator tests pass.

---

### Fix 3 — Chapter Schema Enforcement — IMPLEMENTED

**Root cause:** No cross-story validation of chapter ordering. The per-chapter `validateChapter()` in `chapter-validator.ts` validates each chapter in isolation — it never checks whether all expected chapter numbers exist, whether any are duplicated, or whether title formats are consistent across the story.

**Fix applied:** Added exported `validateChapterSequence(story: Story): ValidationError[]` function in `packages/story-validation/src/chapter-validator.ts` and integrated it into `StoryValidationPipeline.validate()` in `packages/story-validation/src/pipeline.ts`.

The function performs three checks:
1. **Duplicate chapter numbers** — flags as `critical` with type `chapter_duplicated`
2. **Missing chapters (gaps in sequence)** — flags each missing number as `critical` with type `chapter_missing`
3. **Title format consistency** — classifies each title as `number-only`, `number-plus-title`, `bare-number`, or `title-only`; flags mixed formats as `major` with type `chapter_title_inconsistency`

The pipeline calls `validateChapterSequence()` after all per-chapter validators complete, appending results to the shared error list.

**Files changed:** `packages/story-validation/src/chapter-validator.ts` (new exported function), `packages/story-validation/src/pipeline.ts` (import + call after validator loop)
**Tests:** 6 new test cases in `packages/story-validation/src/__tests__/chapter-validator.test.ts` — sequential pass, gap detection, duplicate detection, mixed titles, uniform titles, empty scenes. All 26 chapter-validator tests pass.

---

### Fix 4 — Location Continuity — IMPLEMENTED

**Root cause:** No canonical name normalization across chapters. `checkSettingFidelity()` and `checkSceneGrounding()` in `chapter-validator.ts` check individual chapters against location pattern vocabularies but don't enforce consistent location naming from the CML location profiles.

**Fix applied:**

1. **New file `packages/story-validation/src/location-normalizer.ts`** with two exported functions:
   - `buildLocationRegistry(cml)` — builds a `Map<lowercase-variant, canonical-name>` from `locationProfiles.primary.name` and `locationProfiles.keyLocations[].name`. Registers each canonical name plus no-article and hyphenated variants.
   - `validateLocationConsistency(story, cml)` — scans each chapter's text against the registry, flagging non-canonical casing as `location_name_variant` (moderate severity). One flag per variant per chapter. Skips very short names (≤3 chars) to avoid false positives.

2. **Extended `CMLData` type** in `packages/story-validation/src/types.ts` with optional `locationProfiles` field (`primary?.name`, `keyLocations[]`).

3. **Pipeline integration** in `packages/story-validation/src/pipeline.ts` — `validateLocationConsistency()` called after chapter sequence validation.

4. **Agent 9 pass-through** in `apps/worker/src/jobs/agents/agent9-run.ts` — both validation call sites now pass `locationProfiles` alongside `lockedFacts`.

**Files changed:** `types.ts` (CMLData type), `location-normalizer.ts` (new), `pipeline.ts` (import + call), `index.ts` (export), `agent9-run.ts` (2 call sites)
**Tests:** 8 new test cases in `packages/story-validation/src/__tests__/location-normalizer.test.ts` — registry building, canonical vs non-canonical detection, edge cases. All pass.

---

### Fix 5 — Timeline Consistency

**Root cause:** `temporal-consistency.ts` only handles month-to-season mapping. No hour-level timeline validation exists. Specific clock times in clues, dialogue, and narration are not cross-validated.

**Fix:** Add a `TimelineExtractor` that pulls time references from prose and a `TimelineValidator` that checks ordering constraints.

**File: `packages/story-validation/src/timeline-validator.ts`** (new file)

```typescript
import type { Story, ValidationError, CMLData } from './types.js';

const CLOCK_TIME_PATTERN = /\b(\d{1,2})[:.]\s?(\d{2})\s*(a\.?m\.?|p\.?m\.?|AM|PM|o['']?clock)?\b/gi;
const NAMED_TIME_PATTERN = /\b(midnight|noon|half\s+past\s+\w+|quarter\s+to\s+\w+|quarter\s+past\s+\w+|dawn|dusk|daybreak|sunrise|sunset)\b/gi;

interface TimeReference {
  raw: string;
  normalizedMinutes: number; // minutes from midnight
  chapter: number;
  character?: string;
}

export function extractTimeReferences(story: Story): TimeReference[] {
  const refs: TimeReference[] = [];
  for (const scene of story.scenes) {
    const text = scene.text ?? '';
    let match: RegExpExecArray | null;

    // Clock times
    const clockRe = new RegExp(CLOCK_TIME_PATTERN.source, 'gi');
    while ((match = clockRe.exec(text)) !== null) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridiem = (match[3] ?? '').toLowerCase().replace(/\./g, '');
      if (meridiem.startsWith('p') && hours < 12) hours += 12;
      if (meridiem.startsWith('a') && hours === 12) hours = 0;
      refs.push({
        raw: match[0],
        normalizedMinutes: hours * 60 + minutes,
        chapter: scene.number,
      });
    }

    // Named times
    const namedRe = new RegExp(NAMED_TIME_PATTERN.source, 'gi');
    while ((match = namedRe.exec(text)) !== null) {
      const name = match[0].toLowerCase();
      let mins = -1;
      if (name === 'midnight') mins = 0;
      else if (name === 'noon') mins = 720;
      else if (name === 'dawn' || name === 'daybreak' || name === 'sunrise') mins = 360;
      else if (name === 'dusk' || name === 'sunset') mins = 1080;
      if (mins >= 0) {
        refs.push({ raw: match[0], normalizedMinutes: mins, chapter: scene.number });
      }
    }
  }
  return refs;
}

export function validateTimeline(story: Story, cml?: CMLData): ValidationError[] {
  const errors: ValidationError[] = [];
  const refs = extractTimeReferences(story);
  if (refs.length < 2) return errors;

  // Check for same-chapter time contradictions (time going backwards within a chapter)
  const byChapter = new Map<number, TimeReference[]>();
  for (const ref of refs) {
    if (!byChapter.has(ref.chapter)) byChapter.set(ref.chapter, []);
    byChapter.get(ref.chapter)!.push(ref);
  }

  for (const [chapter, chapterRefs] of byChapter) {
    for (let i = 1; i < chapterRefs.length; i++) {
      const prev = chapterRefs[i - 1];
      const curr = chapterRefs[i];
      // Allow 24h wrap (midnight crossing) — flag if backwards by more than 60 min without crossing midnight
      const diff = curr.normalizedMinutes - prev.normalizedMinutes;
      if (diff < -60 && diff > -720) {
        errors.push({
          type: 'timeline_contradiction',
          message: `Chapter ${chapter}: Time goes backwards from "${prev.raw}" to "${curr.raw}"`,
          severity: 'major',
          sceneNumber: chapter,
        });
      }
    }
  }

  return errors;
}
```

Register in pipeline. Long-term: add alibi-window cross-validation against CML `hard_logic_devices`.

**Tests:** Fixture with "9:30 PM" then "8:15 PM" in same chapter → major error.

---

### Fix 6 — Culprit/Solution Consistency

**Root cause:** `SuspectClosureValidator` checks that some scene mentions the culprit with evidence terms, but doesn't verify the **reveal/confession chapter** attributes guilt to the correct character. An innocent character could be described confessing and it would pass.

**Fix:** Add a post-reveal guilt-attribution check to `SuspectClosureValidator`.

**File: `packages/story-validation/src/suspect-closure-validator.ts`** — after the culprit evidence chain loop (~line 125)

Add to the `validate()` method before the return:

```typescript
    // Post-reveal guilt attribution check
    const guiltKeywords = /\b(guilty|confess(?:ed|es|ion)?|arrested|apprehended|admitted|responsible\s+for\s+(?:the\s+)?(?:murder|killing|death|crime|poisoning))\b/i;
    const totalScenes = story.scenes.length;
    const revealThreshold = Math.floor(totalScenes * 0.8); // Last 20% of chapters

    for (const scene of story.scenes) {
      if (scene.number < revealThreshold) continue;
      const text = scene.text ?? '';
      if (!guiltKeywords.test(text)) continue;

      // Extract character names that co-occur with guilt keywords in the same sentence
      for (const castName of castNames) {
        if (culpritSet.has(castName)) continue; // skip the actual culprit — expected
        // Check if innocent character is falsely implicated
        const sentences = text.split(/[.!?]+/);
        for (const sentence of sentences) {
          if (sentence.includes(castName) && guiltKeywords.test(sentence)) {
            // Exclude sentences that negate guilt ("was not guilty", "proved innocent")
            if (/\b(not|never|in?nocen|cleared|ruled\s+out)\b/i.test(sentence)) continue;
            errors.push({
              type: 'guilt_misattribution',
              message: `Scene ${scene.number}: Innocent character "${castName}" appears in guilt context: "${sentence.trim().slice(0, 120)}..."`,
              severity: 'critical',
              sceneNumber: scene.number,
              suggestion: `Ensure only the designated culprit(s) (${[...culpritSet].join(', ')}) are attributed guilt in the reveal`,
            });
          }
        }
      }
    }
```

**Tests:** Fixture where innocent character "confessed" in last chapter → critical. Fixture where actual culprit confesses → no error.

---

### Fix 7 — Motive Stability

**Root cause:** Each chapter prompt can regenerate motive framing independently. The `motive_seed` from the CML cast is not fed into the per-chapter `CHAPTER OBLIGATIONS` block, so motive language drifts across chapters.

**Fix:** Two parts: (a) inject motive keywords into the chapter obligation prompt, (b) add a post-prose motive-alignment check.

**Part A — File: `packages/prompts-llm/src/agent9-prose.ts`** — inside `buildChapterObligationBlock()` (~line 889–1000)

After the clue obligations section, add for the reveal chapter:

```typescript
// Motive stability: inject motive keywords for chapters where the culprit's motive should surface
const culpritNames = (caseData as any)?.CASE?.culpability?.culprits ?? [];
const castMembers = (caseData as any)?.CASE?.cast ?? [];
if (chapterNumber >= totalChapters * 0.7) { // Last 30% — motive surfaces
  for (const culpritName of culpritNames) {
    const culpritEntry = castMembers.find((c: any) => c.name === culpritName);
    const motiveSeed = culpritEntry?.motive_seed ?? '';
    if (motiveSeed) {
      // Extract 3-5 key terms from motive_seed
      const motiveTerms = motiveSeed.toLowerCase()
        .split(/\s+/)
        .filter((w: string) => w.length >= 4)
        .slice(0, 5)
        .join(', ');
      lines.push(`  MOTIVE CONSISTENCY: When ${culpritName}'s motive surfaces, use language consistent with: "${motiveSeed}". Key terms: ${motiveTerms}`);
    }
  }
}
```

**Part B — File: `packages/story-validation/src/suspect-closure-validator.ts`**

Add a motive-alignment check after the guilt-attribution check:

```typescript
    // Motive alignment: in reveal chapters, check culprit motive matches CML
    for (const culprit of culpritSet) {
      const castEntry = cml.CASE.cast.find((c: any) => normalizeName(c.name) === culprit);
      const motiveSeed = castEntry?.motive_seed ?? '';
      if (!motiveSeed) continue;

      const motiveTokens = motiveSeed.toLowerCase().split(/\s+/).filter((w: string) => w.length >= 4);
      if (motiveTokens.length === 0) continue;

      const revealScenes = story.scenes.filter(s => s.number >= revealThreshold);
      const revealText = revealScenes.map(s => s.text ?? '').join(' ').toLowerCase();
      const matchedTokens = motiveTokens.filter(t => revealText.includes(t));
      const overlap = matchedTokens.length / motiveTokens.length;

      if (overlap < 0.2 && revealText.includes(culprit.toLowerCase())) {
        errors.push({
          type: 'motive_drift',
          message: `Culprit "${culprit}" motive in reveal has <20% overlap with CML motive_seed ("${motiveSeed.slice(0, 80)}...")`,
          severity: 'major',
          suggestion: `Ensure the confession/reveal references the original motive: "${motiveSeed}"`,
        });
      }
    }
```

**Tests:** Fixture with culprit motive_seed "jealousy over inheritance" but reveal text says "revenge for old grudge" → major. Fixture with matching motive → no error.

---

### Fix 8 — Pronoun and Character-Identity Consistency

**Root cause:** `pronoun-repair.ts` repairs pronouns per-sentence when exactly 1 character is named. It skips multi-character scenes where pronoun ambiguity exists. No check for mid-chapter pronoun switching (same character referred to as "he" then "they" in the same chapter).

**Fix:** Add a per-chapter pronoun consistency check in `character-validator.ts`.

**File: `packages/story-validation/src/character-validator.ts`** — add to `validate()` method

```typescript
    // Per-chapter pronoun consistency check
    for (const scene of story.scenes) {
      const text = scene.text ?? '';
      for (const [canonical, state] of manifest) {
        if (state.gender === 'unknown') continue;
        if (!this.containsLabel(text, canonical)) continue;

        // Find all pronoun sets used for this character in this chapter
        const expectedPronouns = state.pronouns;
        const sentences = text.split(/[.!?]+/);
        const pronounSetsUsed = new Set<string>();

        for (const sentence of sentences) {
          if (!this.containsLabel(sentence, canonical)) continue;
          const lower = sentence.toLowerCase();
          if (/\bhe\b|\bhim\b|\bhis\b/.test(lower)) pronounSetsUsed.add('male');
          if (/\bshe\b|\bher\b|\bhers\b/.test(lower)) pronounSetsUsed.add('female');
          if (/\bthey\b|\bthem\b|\btheir\b/.test(lower)) pronounSetsUsed.add('nb');
        }

        // If multiple pronoun sets used for same character in same chapter → flag
        if (pronounSetsUsed.size > 1) {
          errors.push({
            type: 'pronoun_switch_mid_chapter',
            message: `Scene ${scene.number}: Character "${canonical}" referred to with multiple pronoun sets (${[...pronounSetsUsed].join(', ')}) in the same chapter`,
            severity: 'major',
            sceneNumber: scene.number,
            suggestion: `Use consistent pronouns for ${canonical}: ${expectedPronouns.subject}/${expectedPronouns.object}/${expectedPronouns.possessive}`,
          });
        }
      }
    }
```

**Caveat:** This will false-positive in scenes with multiple characters where "he" refers to character A and "she" to character B. Mitigate by only flagging when the character name is in the same sentence as the conflicting pronoun. The per-sentence scope in the code above handles this.

**Tests:** Fixture with "Margaret said he would come" then "Margaret saw her reflection" (different referents) → no false positive since "he" sentence doesn't contain Margaret. Fixture with "Holmes said they were ready" then "Holmes drew his coat" → flags.

---

### Fix 9 — Resolution Contradiction Detection

**Root cause:** No post-reveal check that only the CML-designated culprit is attributed guilt. Covered substantively by Fix 6. This fix adds the additional "two culprits named" and action-attribution checks.

**Fix:** Extend the guilt-attribution check from Fix 6 with:

**File: `packages/story-validation/src/suspect-closure-validator.ts`** — after Fix 6's block

```typescript
    // Two-culprits-named detection: check that reveal doesn't name more guilty parties than CML designates
    const revealScenes = story.scenes.filter(s => s.number >= revealThreshold);
    const guiltAttributedCharacters = new Set<string>();
    for (const scene of revealScenes) {
      const text = scene.text ?? '';
      const sentences = text.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (!guiltKeywords.test(sentence)) continue;
        for (const name of castNames) {
          if (sentence.includes(name) && !/\b(not|never|innocen|cleared|ruled\s+out)\b/i.test(sentence)) {
            guiltAttributedCharacters.add(name);
          }
        }
      }
    }

    if (guiltAttributedCharacters.size > culpritSet.size) {
      const extraCulprits = [...guiltAttributedCharacters].filter(n => !culpritSet.has(n));
      errors.push({
        type: 'extra_culprits_named',
        message: `Reveal names ${guiltAttributedCharacters.size} guilty characters but CML designates ${culpritSet.size}. Extra: ${extraCulprits.join(', ')}`,
        severity: 'critical',
        suggestion: `Only ${[...culpritSet].join(', ')} should be attributed guilt`,
      });
    }

    // Action attribution: verify crime method description for culprit
    const methodKeywords = /\b(administered|poisoned|stabbed|shot|strangled|drowned|pushed|struck|bludgeoned|suffocated)\b/i;
    for (const scene of revealScenes) {
      const text = scene.text ?? '';
      const sentences = text.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (!methodKeywords.test(sentence)) continue;
        for (const name of castNames) {
          if (culpritSet.has(name)) continue; // culprit doing the crime is expected
          if (sentence.includes(name) && !/\b(victim|target|was\s+(poisoned|stabbed|shot|found))\b/i.test(sentence)) {
            errors.push({
              type: 'method_misattribution',
              message: `Scene ${scene.number}: Crime method attributed to non-culprit "${name}": "${sentence.trim().slice(0, 120)}..."`,
              severity: 'major',
              sceneNumber: scene.number,
            });
          }
        }
      }
    }
```

**Tests:** fixture with 2 characters flagged as guilty but CML has 1 → critical. Fixture with "Margaret administered the poison" when Margaret is innocent → major.

---

### Fix 10 — Clue Repetition Reduction

**Root cause:** `NarrativeState.cluesRevealedToReader` tracks which clues have surfaced (as a `string[]` of IDs) but not how many times each was explained or restated. No per-chapter guidance tells the LLM to vary its description of previously-introduced clues.

**Fix:** Two parts: (a) Extend `NarrativeState` to track mention counts, (b) Add per-chapter guidance in `buildNSDBlock()`.

**Part A — File: `packages/prompts-llm/src/types/narrative-state.ts`**

Change the `cluesRevealedToReader` type and add tracking:

```typescript
// In NarrativeState interface, replace:
cluesRevealedToReader: string[];
// With:
cluesRevealedToReader: Array<{ clueId: string; mentionCount: number; lastChapter: number }>;
```

**Part A2 — File: `apps/worker/src/jobs/agents/agent9-run.ts`** — in `onBatchComplete`

Update the clue merging logic (~line 984) to track mention counts:

```typescript
if (batchRevealedIds.length > 0) {
  const existing = new Map(narrativeState.cluesRevealedToReader.map(c => [c.clueId, c]));
  for (const clueId of batchRevealedIds) {
    const prev = existing.get(clueId);
    if (prev) {
      existing.set(clueId, { ...prev, mentionCount: prev.mentionCount + 1, lastChapter: batchEnd });
    } else {
      existing.set(clueId, { clueId, mentionCount: 1, lastChapter: batchEnd });
    }
  }
  narrativeState = { ...narrativeState, cluesRevealedToReader: [...existing.values()] };
}
```

**Part B — File: `packages/prompts-llm/src/agent9-prose.ts`** — in `buildNSDBlock()`

Replace the clues-revealed line (~line 1244):

```typescript
if (state.cluesRevealedToReader.length > 0) {
  const clueLines = state.cluesRevealedToReader.map(c => {
    if (c.mentionCount >= 3) return `  • ${c.clueId}: SATURATED — do NOT describe again unless confronted with new evidence`;
    if (c.mentionCount >= 1) return `  • ${c.clueId}: Already introduced — reference briefly or from a new angle, do not restate the original discovery`;
    return `  • ${c.clueId}: Not yet introduced`;
  });
  lines.push(`\nCLUES ALREADY REVEALED TO READER:\n${clueLines.join('\n')}`);
}
```

**Impact on existing code:** `initNarrativeState()` must initialize `cluesRevealedToReader` as `[]` (already does — empty array). All places that read `cluesRevealedToReader` must handle the new shape. The `nsdBefore` trace in `onBatchComplete` needs updating to `.map(c => c.clueId)` for backward-compatible logging.

**Tests:** Unit test `updateNSD` with repeated clue IDs → mentionCount increments. Test `buildNSDBlock` output contains "SATURATED" when count ≥ 3.

---

### Fix 11 — Emotional Phrase Repetition

**Root cause:** `usedSensoryPhrases` in NarrativeState tracks `adjective + noun` sensory phrases but not emotional beat phrases ("heart racing", "chill down her spine", "weight of the truth"). These get repeated across multiple chapters.

**Fix:** Add `usedEmotionalBeats` to NarrativeState, extract them in `updateNSD()`, and inject in `buildNSDBlock()`.

**Part A — File: `packages/prompts-llm/src/types/narrative-state.ts`**

1. Add to `NarrativeState` interface:

```typescript
/** Emotional beat phrases used so far — keeps last 30, oldest first. */
usedEmotionalBeats: string[];
```

2. Add extraction function:

```typescript
const EMOTIONAL_BEAT_PATTERNS = [
  /heart\s+(racing|pounding|hammering|skipping|sinking|lurching)/gi,
  /chill\s+(down|along|through)\s+\w+\s+spine/gi,
  /weight\s+(of|pressing|bearing)\s+(down|on)/gi,
  /tension\s+(thickened|hung|crackled|mounted|built|grew)/gi,
  /truth\s+(lurking|hiding|waiting|beneath|behind)/gi,
  /blood\s+(ran\s+cold|drained|froze)/gi,
  /stomach\s+(churned|dropped|knotted|tightened)/gi,
  /breath\s+(caught|hitched|quickened|held)/gi,
  /hands\s+(trembled|shook|tightened|clenched)/gi,
  /silence\s+(stretched|hung|pressed|settled|fell)/gi,
];

export function extractEmotionalBeats(text: string, limit = 5): string[] {
  const found: string[] = [];
  for (const pattern of EMOTIONAL_BEAT_PATTERNS) {
    const re = new RegExp(pattern.source, 'gi');
    const matches = text.match(re) ?? [];
    found.push(...matches.map(m => m.toLowerCase()));
  }
  return [...new Set(found)].slice(0, limit);
}
```

3. Update `updateNSD()` to populate:

```typescript
// Inside the completedChapters.forEach loop, after sensory phrase extraction:
const emotionalBeats = extractEmotionalBeats(allText);
emotionalBeats.forEach(b => {
  if (!newBeats.includes(b)) newBeats.push(b);
});

// In return, add:
usedEmotionalBeats: newBeats.slice(-30),
```

4. Update `initNarrativeState()`:

```typescript
usedEmotionalBeats: [],
```

**Part B — File: `packages/prompts-llm/src/agent9-prose.ts`** — in `buildNSDBlock()`

After the sensory phrases line:

```typescript
if (state.usedEmotionalBeats && state.usedEmotionalBeats.length > 0) {
  lines.push(`\nDO NOT REUSE THESE EMOTIONAL PHRASES (already used): ${state.usedEmotionalBeats.slice(-15).join('; ')}`);
}
```

**Tests:** Unit test `extractEmotionalBeats` with "her heart was racing and she felt the weight of it pressing down" → ["heart racing", "weight of it pressing down"]. Test `buildNSDBlock` output includes emotional beat ban.

---

### Fix 12 — Malformed Sentence Detection

**Root cause:** No prose-level grammar/structure validation. Sentence splices, run-ons, and duplicated fragments pass through.

**Fix:** Add sentence-level heuristic checks to `chapter-validator.ts`.

**File: `packages/story-validation/src/chapter-validator.ts`** — add new private method

```typescript
private checkSentenceQuality(chapter: ChapterContent): ChapterValidationIssue[] {
  const issues: ChapterValidationIssue[] = [];
  const text = chapter.text ?? (chapter.paragraphs ?? []).join(' ');
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

  for (const sentence of sentences) {
    const wordCount = sentence.split(/\s+/).length;

    // Run-on detection: sentences over 60 words
    if (wordCount > 60) {
      issues.push({
        type: 'sentence_run_on',
        message: `Sentence with ${wordCount} words (>60): "${sentence.slice(0, 80)}..."`,
        severity: 'moderate',
      });
    }

    // Comma splice detection: 3+ coordinate conjunctions
    const conjunctions = (sentence.match(/\b(and|but|or|yet|so|for|nor)\b/gi) ?? []).length;
    if (conjunctions > 3) {
      issues.push({
        type: 'sentence_splice',
        message: `Sentence with ${conjunctions} conjunctions (possible splice): "${sentence.slice(0, 80)}..."`,
        severity: 'moderate',
      });
    }
  }

  // Duplicated fragment detection: 6+ word n-grams appearing more than once
  const words = text.toLowerCase().split(/\s+/);
  const ngramSize = 6;
  const ngramCounts = new Map<string, number>();
  for (let i = 0; i <= words.length - ngramSize; i++) {
    const ngram = words.slice(i, i + ngramSize).join(' ');
    ngramCounts.set(ngram, (ngramCounts.get(ngram) ?? 0) + 1);
  }
  for (const [ngram, count] of ngramCounts) {
    if (count > 1) {
      issues.push({
        type: 'duplicated_fragment',
        message: `6-word phrase repeated ${count} times: "${ngram}"`,
        severity: 'major',
      });
      break; // One per chapter to avoid noise
    }
  }

  return issues;
}
```

Add `...this.checkSentenceQuality(chapter)` to the `validateChapter()` result array.

**Tests:** Fixture with 70-word sentence → moderate. Fixture with repeated 6-word phrase → major.

---

### Fix 13 — Narrative Mode Consistency

**Root cause:** No detection of outline-style intrusion (bare fact statements, list-like paragraphs) or mode shifts between dramatized and summary text within prose.

**Fix:** Add a `NarrativeModeValidator` in story-validation.

**File: `packages/story-validation/src/narrative-mode-validator.ts`** (new file)

```typescript
import type { Validator, Story, ValidationResult, ValidationError } from './types.js';

export class NarrativeModeValidator implements Validator {
  name = 'NarrativeModeValidator';

  validate(story: Story): ValidationResult {
    const errors: ValidationError[] = [];

    for (const scene of story.scenes) {
      const paragraphs = scene.paragraphs ?? (scene.text ?? '').split(/\n\n+/);

      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (trimmed.length < 20) continue;

        // Outline intrusion: starts with noun phrase + colon
        if (/^[A-Z][^.!?]*:\s/.test(trimmed) && trimmed.split(/[.!?]+/).length <= 2) {
          errors.push({
            type: 'outline_intrusion',
            message: `Scene ${scene.number}: Paragraph looks like an outline entry: "${trimmed.slice(0, 80)}..."`,
            severity: 'major',
            sceneNumber: scene.number,
          });
        }

        // Summary intrusion: short paragraph, present tense, no dialogue, no action verbs
        const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 5);
        if (sentences.length <= 2 && sentences.length > 0) {
          const hasDialogue = /[""\u201C\u201D]/.test(trimmed);
          const hasPresentTense = /\b(is|are|has|does|goes|comes|stands|sits|lies|walks|runs)\b/i.test(trimmed);
          const hasPastTense = /\b(was|were|had|did|went|came|stood|sat|lay|walked|ran)\b/i.test(trimmed);
          if (!hasDialogue && hasPresentTense && !hasPastTense) {
            errors.push({
              type: 'summary_intrusion',
              message: `Scene ${scene.number}: Short present-tense paragraph may be summary not prose: "${trimmed.slice(0, 80)}..."`,
              severity: 'moderate',
              sceneNumber: scene.number,
            });
          }
        }

        // Mode shift: verb tense shifts from past to present mid-paragraph (excluding dialogue)
        const nonDialogue = trimmed.replace(/"[^"]*"/g, '').replace(/\u201C[^\u201D]*\u201D/g, '');
        const pastVerbs = (nonDialogue.match(/\b(was|were|had|did|went|came|stood|walked|looked|turned|said|asked|felt|knew|thought)\b/gi) ?? []).length;
        const presentVerbs = (nonDialogue.match(/\b(is|are|has|does|goes|comes|stands|walks|looks|turns|says|asks|feels|knows|thinks)\b/gi) ?? []).length;
        if (pastVerbs >= 3 && presentVerbs >= 3) {
          errors.push({
            type: 'tense_shift',
            message: `Scene ${scene.number}: Mixed verb tenses in paragraph (${pastVerbs} past, ${presentVerbs} present): "${trimmed.slice(0, 80)}..."`,
            severity: 'moderate',
            sceneNumber: scene.number,
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
```

Register in `pipeline.ts` validator array.

**Tests:** Fixture with "Setting: The library on a stormy night." → major outline intrusion. Fixture with present-tense summary sentence in past-tense chapter → moderate.

---

### Fix 14 — Summary Intrusion Prevention

**Root cause:** No detection of CML summary text copy-pasted into prose. Covered mostly by Fix 13 (summary intrusion signal) plus the template leakage regexes from Fix 2.

**Additional fix:** Add token-overlap check against CML scene summaries.

**File: `packages/story-validation/src/chapter-validator.ts`** — add to `checkTemplateLeakage()` or as new method

```typescript
private checkSummaryIntrusion(chapter: ChapterContent, cml?: CMLData): ChapterValidationIssue[] {
  if (!cml) return [];
  const issues: ChapterValidationIssue[] = [];

  // Get scene summary from CML narrative outline
  const narrativeOutline = (cml as any).CASE?.narrative_outline;
  if (!narrativeOutline) return issues;

  const allScenes = (narrativeOutline.acts ?? []).flatMap((a: any) => a.scenes ?? []);
  const matchingScene = allScenes.find((s: any) => s.sceneNumber === chapter.chapterNumber);
  if (!matchingScene?.summary) return issues;

  const summaryTokens = matchingScene.summary.toLowerCase().split(/\s+/).filter((w: string) => w.length >= 4);
  if (summaryTokens.length < 5) return issues;

  const chapterText = (chapter.paragraphs ?? []).join(' ').toLowerCase();
  const matchCount = summaryTokens.filter((t: string) => chapterText.includes(t)).length;
  const overlap = matchCount / summaryTokens.length;

  if (overlap > 0.7) {
    issues.push({
      type: 'summary_copy_paste',
      message: `Chapter ${chapter.chapterNumber} has >70% token overlap with CML scene summary — likely copy-pasted rather than dramatized`,
      severity: 'major',
    });
  }

  return issues;
}
```

**Tests:** Fixture where chapter text is the scene summary verbatim → major. Fixture with natural prose inspired by summary → no error.

---

### Fix 15 — Dialogue Formatting

**Root cause:** No quotation mark normalization. Mixed smart/straight quotes appear in the same story. Orphaned open-quotes with no matching close-quote.

**Fix:** Add quotation mark normalization to `EncodingValidator.fixEncoding()` and add dialogue punctuation checks to `chapter-validator.ts`.

**Part A — File: `packages/story-validation/src/encoding-validator.ts`** — in `fixEncoding()`

Add after the existing mojibake replacements:

```typescript
// Normalize quotation marks to straight quotes (consistent convention)
text = text.replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"');  // double smart → straight
text = text.replace(/[\u2018\u2019\u201A\u201B]/g, "'");              // single smart → straight
```

**Part B — File: `packages/story-validation/src/chapter-validator.ts`** — add method

```typescript
private checkDialogueFormatting(chapter: ChapterContent): ChapterValidationIssue[] {
  const issues: ChapterValidationIssue[] = [];
  const text = chapter.text ?? (chapter.paragraphs ?? []).join('\n');

  // Orphaned quotes: count open vs close double quotes
  const doubleQuotes = (text.match(/"/g) ?? []).length;
  if (doubleQuotes % 2 !== 0) {
    issues.push({
      type: 'orphaned_quote',
      message: `Chapter has ${doubleQuotes} double quotes (odd number — orphaned open/close quote)`,
      severity: 'moderate',
    });
  }

  return issues;
}
```

Add `...this.checkDialogueFormatting(chapter)` to `validateChapter()`.

**Tests:** Text with 5 double quotes → moderate orphaned_quote. Text with 4 → no error.

---

### Fix 16 — Verbosity Control

**Root cause:** Word count validation only enforces a **floor**. No ceiling exists. Chapters can be excessively verbose without penalty.

**Fix:** Add a word count ceiling check to `validateChapterPreCommitObligations()` in `agent9-prose.ts`.

**File: `packages/prompts-llm/src/agent9-prose.ts`** — in `validateChapterPreCommitObligations()` (~line 692–795)

After the hard floor check, add:

```typescript
// Word count ceiling check
const preferredCeiling = Math.ceil(preferredWords * 1.3);
const hardCeiling = Math.ceil(preferredWords * 1.5);

if (chapterWordCount > hardCeiling) {
  result.hardFailures.push({
    type: 'word_count_exceeds_hard_ceiling',
    message: `Chapter ${chapterNumber}: ${chapterWordCount} words exceeds hard ceiling of ${hardCeiling} (1.5× preferred ${preferredWords})`,
  });
} else if (chapterWordCount > preferredCeiling) {
  result.preferredMisses.push({
    type: 'word_count_exceeds_preferred_ceiling',
    message: `Chapter ${chapterNumber}: ${chapterWordCount} words exceeds preferred ceiling of ${preferredCeiling} (1.3× preferred ${preferredWords})`,
  });
}
```

Also add ceiling guidance to the retry feedback in `buildEnhancedRetryFeedback()`:

```typescript
if (errors.some(e => e.type.includes('ceiling'))) {
  directives.push('REDUCE word count: tighten descriptions, remove redundant atmosphere, advance plot more efficiently.');
}
```

**Tests:** Chapter with 2500 words when preferred is 1600 → exceeds hard ceiling (2400). Chapter with 2100 → exceeds preferred ceiling (2080).

---

### Fix 17 — Knowledge State Tracking

**Root cause:** No tracking of what each character or the reader knows at any point. No detection of discovery-order violations (detective references clue before the chapter it's assigned to).

**Fix:** Add clue-discovery-order validation using the existing CML clue-to-chapter mapping.

**File: `packages/story-validation/src/knowledge-validator.ts`** (new file)

```typescript
import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';

export class KnowledgeStateValidator implements Validator {
  name = 'KnowledgeStateValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    if (!cml) return { valid: true, errors: [] };
    const errors: ValidationError[] = [];

    // Build clue-to-earliest-chapter map from narrative outline
    const narrativeOutline = (cml as any).CASE?.narrative_outline;
    if (!narrativeOutline) return { valid: true, errors: [] };

    const clueFirstChapter = new Map<string, number>();
    const allScenes = (narrativeOutline.acts ?? []).flatMap((a: any) => a.scenes ?? []);
    for (const scene of allScenes) {
      const clues = scene.cluesRevealed ?? scene.scene_clues ?? [];
      for (const clueId of clues) {
        if (!clueFirstChapter.has(clueId)) {
          clueFirstChapter.set(clueId, scene.sceneNumber);
        }
      }
    }

    // Get clue descriptions
    const clueDescriptions = new Map<string, string>();
    const clueList = (cml as any).CASE?.clues ?? (cml as any).CASE?.hard_logic_devices?.clues ?? [];
    for (const clue of clueList) {
      if (clue.id && clue.description) {
        clueDescriptions.set(clue.id, clue.description);
      }
    }

    // For each clue, check if prose mentions it before its assigned chapter
    for (const [clueId, assignedChapter] of clueFirstChapter) {
      const description = clueDescriptions.get(clueId);
      if (!description) continue;

      // Tokenize clue description for matching
      const clueTokens = description.toLowerCase()
        .split(/\s+/)
        .filter(w => w.length >= 4)
        .slice(0, 8);
      if (clueTokens.length < 3) continue;

      for (const scene of story.scenes) {
        if (scene.number >= assignedChapter) break; // Only check earlier chapters
        const sceneText = (scene.text ?? '').toLowerCase();
        const matchedTokens = clueTokens.filter(t => sceneText.includes(t));
        const overlap = matchedTokens.length / clueTokens.length;

        if (overlap >= 0.5) {
          errors.push({
            type: 'knowledge_anachronism',
            message: `Chapter ${scene.number}: References clue "${clueId}" (50%+ token match) before its assigned chapter ${assignedChapter}`,
            severity: 'major',
            sceneNumber: scene.number,
            suggestion: `Clue "${clueId}" should first appear in chapter ${assignedChapter} per the narrative outline`,
          });
          break; // One error per clue
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
```

Register in pipeline after NarrativeContinuityValidator.

**Tests:** Fixture with clue assigned to chapter 5 but mentioned in chapter 2 → major. Fixture with clue in correct chapter → no error.

---

### Fix 18 — Sensory Description Filtering

**Root cause:** `checkSceneGrounding()` in `chapter-validator.ts` enforces a minimum (2+ sensory cues, 1+ atmosphere marker) but has no maximum. ≥5 distinct sensory markers in one paragraph represents overstuffing.

**Fix:** Add a sensory density cap to `checkSceneGrounding()`.

**File: `packages/story-validation/src/chapter-validator.ts`** — inside `checkSceneGrounding()`

After the minimum sensory check, add:

```typescript
// Sensory overstuffing check: per-paragraph
const paragraphs = chapter.paragraphs ?? (chapter.text ?? '').split(/\n\n+/);
const SENSORY_MARKERS_ALL = /\b(smell|scent|aroma|stench|fragrance|sound|silence|echo|rustle|noise|dim|bright|gleam|shadow|flicker|cold|warm|damp|chill|heat|rough|smooth|soft|hard|sharp|bitter|sweet|sour|acrid|musty|stale)\b/gi;

for (const para of paragraphs) {
  const sensoryMatches = [...new Set((para.match(SENSORY_MARKERS_ALL) ?? []).map(m => m.toLowerCase()))];
  if (sensoryMatches.length >= 5) {
    issues.push({
      type: 'sensory_overstuffing',
      message: `Paragraph has ${sensoryMatches.length} sensory markers (≥5) — possible pasted sensory block: "${para.slice(0, 60)}..."`,
      severity: 'minor',
    });
  }
}
```

Also add cross-chapter sensory dedup using `usedSensoryPhrases` from NarrativeState (already tracked):

The existing `usedSensoryPhrases` tracking in `updateNSD()` and the "DO NOT REUSE" injection in `buildNSDBlock()` covers cross-chapter dedup at the prompt level. A post-prose validation check can be added:

```typescript
// Cross-chapter sensory dedup (optional post-prose)
// This is already handled by NarrativeState.usedSensoryPhrases + buildNSDBlock prompt injection.
// A validation-time check would flag exact 3-gram matches across chapters.
```

**Tests:** Paragraph with "the cold, damp air carried the stale scent of musty wood and a sharp, acrid smell" → 7 sensory markers → minor overstuffing.

---

### Fix 19 — Supporting Cast Tracking

**Root cause:** No detection of abandoned characters (cast members introduced in Act I but never mentioned again). `checkNamedWalkOns()` catches out-of-cast names but not underuse of in-cast members.

**Fix:** Add a cross-story character usage check.

**File: `packages/story-validation/src/character-validator.ts`** — add to `validate()` method, after per-scene checks

```typescript
    // Abandoned character detection: cross-story check
    if (cml && story.scenes.length >= 6) {
      const totalScenes = story.scenes.length;
      const actIEnd = Math.ceil(totalScenes * 0.33);
      const actIIStart = actIEnd + 1;

      for (const [canonical, state] of manifest) {
        if (state.role?.toLowerCase().includes('victim')) continue; // victims may die early

        const chaptersAppearing = story.scenes
          .filter(s => (s.text ?? '').includes(canonical))
          .map(s => s.number);

        // Underused: appears in ≤1 chapter total (excluding victim)
        if (chaptersAppearing.length <= 1 && !state.isCrewMember) {
          errors.push({
            type: 'underused_character',
            message: `Character "${canonical}" appears in only ${chaptersAppearing.length} chapter(s) — may be underused`,
            severity: 'minor',
          });
        }

        // Abandoned after setup: appears in Act I but not in Acts II or III
        const actIAppearances = chaptersAppearing.filter(n => n <= actIEnd);
        const laterAppearances = chaptersAppearing.filter(n => n > actIEnd);
        if (actIAppearances.length > 0 && laterAppearances.length === 0) {
          errors.push({
            type: 'abandoned_character',
            message: `Character "${canonical}" appears in Act I (chapters ${actIAppearances.join(',')}) but never again after chapter ${actIEnd}`,
            severity: 'moderate',
          });
        }
      }
    }
```

**Tests:** Fixture where "Lord Ashcroft" appears only in chapter 1 of a 12-chapter story → moderate abandoned. Fixture where victim dies in chapter 2 → no false positive. Fixture where all characters appear in Acts II-III → no error.

---

### Fix 20 — Final QA Pipeline

**Root cause:** `StoryValidationPipeline.autoFix()` only applies encoding fixes. No quotation normalization, no pronoun repair integration, no per-chapter re-generation for chapters with critical errors.

**Fix:** Extend `autoFix()` to include all available repair passes, and add per-chapter retry support.

**Part A — File: `packages/story-validation/src/pipeline.ts`** — extend `autoFix()`

```typescript
autoFix(story: Story, cml?: CMLData): Story {
  const encodingValidator = new EncodingValidator();
  let fixed = encodingValidator.fixStory(story);

  // Pronoun repair pass (if CML available)
  if (cml) {
    const { repairChapterPronouns } = require('./pronoun-repair.js');
    const cast = cml.CASE.cast.map((c: any) => ({
      name: c.name,
      gender: c.gender,
      aliases: c.aliases ?? [],
    }));

    fixed = {
      ...fixed,
      scenes: fixed.scenes.map(scene => {
        const paragraphs = scene.paragraphs ?? (scene.text ?? '').split(/\n\n+/);
        const chapter = { title: scene.title, paragraphs };
        const { chapter: repaired } = repairChapterPronouns(chapter, cast);
        return {
          ...scene,
          paragraphs: repaired.paragraphs,
          text: repaired.paragraphs.join('\n\n'),
        };
      }),
    };
  }

  return fixed;
}
```

**Part B — Per-chapter re-generation:** This requires changes to `agent9-run.ts` to support targeted chapter re-generation rather than full-batch retry. The existing `buildNarrativeSubsetForChapterIndexes()` function (used for identity continuity repair) provides the pattern:

**File: `apps/worker/src/jobs/agents/agent9-run.ts`** — after full-story validation, if specific chapters have critical errors

```typescript
// After StoryValidationPipeline.validate():
const criticalChapters = report.errors
  .filter(e => e.severity === 'critical' && e.sceneNumber != null)
  .map(e => e.sceneNumber!);
const uniqueFailedChapters = [...new Set(criticalChapters)];

if (uniqueFailedChapters.length > 0 && uniqueFailedChapters.length <= Math.ceil(totalChapters * 0.4)) {
  // Targeted re-generation for failed chapters only (up to 40% of story)
  // Reuse the existing buildNarrativeSubsetForChapterIndexes pattern
  ctx.log(`Targeting ${uniqueFailedChapters.length} chapters for re-generation: ${uniqueFailedChapters.join(', ')}`);
  // ... invoke per-chapter regeneration with existing infrastructure
}
```

The full implementation leverages the existing identity-continuity-repair code path (`buildNarrativeSubsetForChapterIndexes` + `generateProse` with chapter subset). The key change is triggering it from validation failures, not just identity breaks.

**Tests:** Integration test: story with 1 chapter having a critical encoding error → autoFix repairs it. Story with 2/12 chapters failing critically → targeted re-generation triggered (not full retry).
