# ANALYSIS_35 — Run `run_9e6b3a34-8111-4928-99bf-b6a55a00609c`: Protagonist-Name Opener Dominance + Agent 5 Planning Failures
*Date: 2026-06-13 | Run: `run_9e6b3a34-8111-4928-99bf-b6a55a00609c` | Started: ~20:33 UTC | Duration: 799.2s | Cost: £0.4780 | Status: warning*

---

## 1. Scope

This report covers the run completed on 13 June 2026, project **Test 02** (`proj_bb5df4a8-7db3-4075-b841-f6f05f55bee1`). The run completed all 10 chapters but with 6 exhausted retry budgets and a scoring report generation failure.

Source artefact:
- `c:\CML\data\store.json` (events for `run_9e6b3a34-8111-4928-99bf-b6a55a00609c`)
- Story file: `stories\story_20260613-2047\generated_in_scene_batches_9_batch_es_required_r.md`

---

## 2. Outcome Summary

| Item | Value |
|------|-------|
| Run status | Completed with warnings |
| Chapters completed | 10 / 10 |
| Chapters requiring retry | 9 / 10 (only Ch2 passed first-time) |
| Chapters exhausting all 6 retries | 6 (Ch4, Ch5, Ch6, Ch8, Ch9, Ch10) |
| Completion-fallback chapters | 6 |
| Total wasted LLM attempts | ~36 (across exhausted retries) |
| Scoring report | Failed (invariant violation) |
| Agent 5 deterministic synthesis events | 9 (6 evidence-ID clones + culprit + late slot + step 4) |
| Cumulative quality score | 97 / 100 |

---

## 3. Story Concept

| Field | Value |
|-------|-------|
| Title | *(untitled — February 1933 country house)* |
| Setting | Maplewood Manor, Ashcombe Vale, England — February 1933 |
| Detective | Patricia Peverel (amateur) |
| Victim | Lord Ashcombe |
| Culprit | Helen Willoughby (housekeeper) |
| Cast | Patricia Peverel, Helen Willoughby, Neil Lisle, David Brabazon, Yvette Ferrers |
| Mechanism | Mantel clock winding key turned backward ~40 minutes; scratch marks on winding arbor; servant note of late chimes contradicts stopped hands |
| Spec | 1930s, CountryHouse, Classic tone, amateur detective, short target, `proseBatchSize: 1` |

---

## 4. Issue Inventory

### Issue 1 — Protagonist-Name Opener Dominance (CRITICAL)

**Classification:** Prose quality / retry-loop failure  
**Chapters affected:** 1, 3, 4, 5, 6, 7, 8, 9, 10 (9 of 10)  
**Retry-exhausted chapters:** 4, 5, 6, 8, 9, 10

#### 4.1 Per-chapter breakdown

| Chapter | Offending opener | Attempts before pass | Fallback? | Co-issues |
|---------|-----------------|---------------------|-----------|-----------|
| 1 | `"patricia cleared"` | 2 | No | — |
| 2 | — | 1 | No | — |
| 3 | `"patricia gathered"` | 2 | No | — |
| 4 | `"patricia stepped"` | 6 + retry | Yes (81/100) | — |
| 5 | `"patricia questioned"` | 6 + retry | Yes (84/100) | Unbalanced quotes |
| 6 | `"patricia inclined"` | 6 + retry | Yes (84/100) | — |
| 7 | `"helen s"` | 2 | No | — |
| 8 | `"neil lisle"` | 6 + retry | Yes (91/100) | Feb/spring contradiction |
| 9 | `"patricia recalled"` | 6 + retry | Yes (79/100) | Suspect-pressure resolution |
| 10 | `"patricia s"` | 6 + retry | Yes (80/100) | Feb/spring contradiction |

The dominant pattern is `"patricia [verb]"` — the detector fires when a chapter's first word "patricia" appears as the opening of 3 or more paragraphs (the `currentFirstWordCount >= 3` branch of the opener-uniqueness linter). Chapters 7 and 8 show that supporting characters can also trigger the same gate (`"helen s"`, `"neil lisle"`), but "patricia" is the primary repeat offender because she is the POV protagonist.

`"patricia s"` (Ch10) and `"helen s"` (Ch7) are possessive constructions (`Patricia's…`, `Helen's…`) where the tokenizer splits on the apostrophe, leaving `"s"` as a non-meaningful token (length 1); the trigger fires via the `currentFirstWordCount >= 3` path on `"patricia"` / `"helen"`.

#### 4.2 Root cause — wrong retry feedback for character-name opener

The `template_bleed` linter issue carries `matchingPriorParagraph: firstTwoWords` (e.g. `"patricia stepped"`). The retry-feedback block in `generate.ts` tested `i.type === 'template_bleed'` but always emitted the **location-boilerplate feedback**:

> *"⛔ LOCATION BOILERPLATE OPENING — your chapter opens with a room name or location set-piece. WRONG: 'The Library in Little Middleton...'"*

That feedback has no relevance to a character-name opener. The model received the instruction to avoid room-inventory openings on every retry and correctly did so — but continued starting paragraphs with "Patricia" because nothing told it not to. All 6 retries were semantically identical from the model's perspective.

#### 4.3 Contributing cause — no pre-generation prevention

The obligation block had no constraint explicitly banning >2 paragraph openings with the detective's name. The only opener rule was the generic `"Begin with a character action, spoken line, or clock/time marker — never a location name"`. With a first-person investigation narrative, the natural completion prior is to begin every paragraph with the protagonist acting, which reliably produces `Patricia [verb]` × 3 or more.

#### 4.4 Fixes applied (2026-06-13)

**Fix A — `packages/prompts-llm/src/agent9-prose/generate.ts`:**  
The `template_bleed` retry-feedback block now reads `matchingPriorParagraph`'s first token to discriminate:
- First token `"the"` or `"entering"` → existing location-boilerplate feedback (unchanged)
- Any other token → new **character/word-dominance feedback** that quotes the exact offending word (e.g. `"Patricia"`) and instructs the model to keep that opener to ≤ 2 paragraphs with concrete alternatives

**Fix B — `packages/prompts-llm/src/agent9-prose/obligation-block.ts`:**  
Detective first name extracted at function level (not just inside the Ch1 block). Added a **pre-generation PARAGRAPH OPENER DIVERSITY constraint** to every chapter's obligation block:
> *"No more than 2 paragraphs in this chapter may begin with "Patricia" or "Patricia's" as the first word. … Opening 3 or more paragraphs with "Patricia" will cause automated rejection."*

Both fixes are live. This converts the failure from a 6-retry exhaustion pattern to an upfront prevention that should eliminate the issue on first generation.

---

### Issue 2 — Month/Season Contradiction (chapters 8 and 10)

**Classification:** Temporal consistency / prose quality  
**Chapters affected:** 8 and 10  

The world document fixes the setting at **February 1933** (`temporal-context: February 1933`). Despite this, chapters 8 and 10 contained spring language:

- Ch8: `"Chapter 8 has month/season contradiction (february vs spring)"`
- Ch10: `"Chapter 10 has month/season contradiction (february vs spring)"`

The temporal repair feedback mechanism (`enforceMonthSeasonLockOnChapterWithTelemetry` + the retry directive at `generate.ts` line 702) exists and is active. The season contradiction did not appear on attempts 2–5 for these chapters — it appeared on attempt 1 and again on attempt 6 (the final FINAL-ATTEMPT rebuild).

**Probable cause:** The "FINAL ATTEMPT — COMPLETE REBUILD REQUIRED" block adds a `CRITICAL — SENSORY GROUNDING GATE` instruction that asks for atmospheric language (rain, wind, fog, etc.). On a full rebuild with no memory of prior errors, the model defaults to spring-like atmospheric framing ("mild air", "first warmth of the season") because February is an ambiguous month that can feel transitional. The sensory grounding prompt inadvertently invites spring vocabulary.

**Current state:** Self-resolving once the opener issue is cleared. The opener was the primary blocker across all 6 retries; the temporal repair feedback could not take effect because the opener failure halted the retry on the same batch. With Fix A in place (correct opener feedback), the temporal repair feedback will be presented earlier and the season contradiction is expected to resolve within 2 attempts.

**Remaining risk:** The final-attempt rebuild still does not explicitly reinforce the month lock in its SENSORY GROUNDING GATE phrasing. A targeted fix would add the month name to the final-attempt instruction:
> *"Sensory atmosphere must reflect the month: February (mid-winter). Do not write spring or transitional-season language."*

---

### Issue 3 — Stage-Mode Outcome Failure (chapter 9)

**Classification:** Story structure / prose constraint  
**Chapter affected:** 9

Chapter 9 is in `suspect_pressure` stage mode. The `stage_mode_outcome` gate fires when the culprit name appears in the chapter AND `RESOLUTION_RE` matches (words such as "confessed", "arrested", "the murderer is", "it was you", "proved guilty", etc.).

The failure fired on **attempts 1 and 6** with message:
> *"Stage-mode outcome failed (suspect_pressure): no full culprit resolution is allowed in suspect-pressure mode."*

Attempts 2–5 had only 1 issue (the opener), meaning the resolution language was successfully removed on retry 2 and stayed absent through retries 3–5. On the final rebuild (attempt 6), the model re-introduced resolution language from scratch.

`RESOLUTION_RE` pattern (for reference):
```
/\b(confess(?:ed|es)?|arrest(?:ed)?|taken into custody|I (?:did|killed)|guilty|you committed|
  you killed|the murderer is|it was you|unmask(?:ed)?|expos(?:ed|es)|named as|revealed as|
  proved? guilty|brought to justice|caught red-handed|surrendered|condemned|
  the killer (?:was|proved?|is))\b/i
```

**Current state:** The retry feedback correctly tells the model to avoid culprit resolution in suspect-pressure mode. The failure is masked by the opener being the primary blocker. Once Fix A is in place, the stage-mode failure may surface more visibly — the retry feedback for `stage_mode_outcome` should be checked to confirm it's being injected when both issues are present.

**Note:** Storing the stage-mode constraint explicitly in the obligation block (as a MANDATORY rule) would be a stronger prevention-side fix than relying only on retry feedback.

---

### Issue 4 — Agent 5: Discriminating Test References Non-Existent Clue IDs (CRITICAL — planning layer)

**Classification:** Agent 5 clue planning / CML ID alignment  

Agent 5 reported two critical inference-coverage failures:

```
[critical] Discriminating test evidence_clues reference missing clue id(s):
  clue_clock_winding_key_backward,
  clue_scratch_marks_on_arbor,
  clue_servant_note_two_chimes,
  clue_helen_kitchen_supervision,
  clue_neil_stable_alibi,
  clue_david_library_alibi

[critical] Discriminating test references no evidence found in the clue set
```

**Root cause:** The CML's `prose_requirements.inference_chain` (generated by Agent 3) used **semantically descriptive clue IDs** that were meaningful but never registered in the actual clue distribution produced by Agent 5. Agent 5's discriminating test references the CML's inference chain directly, creating a namespace mismatch: the IDs in the discriminating test don't exist in `clueDistribution.clues`.

The CML gate back-fill also fired:
```
CML gate: back-filled evidence_clues with 2 clue(s): clue_3, clue_9
```

This suggests the CML's `evidence_clues` in the discriminating test block was partially populated with real IDs but also referenced descriptive IDs never generated by Agent 5.

**Deterministic recovery:** Agent 5 cloned 6 new clue records from the nearest real clue:
```
clue_clock_winding_key_backward  <= clue_core_contradiction_chain
clue_scratch_marks_on_arbor      <= clue_3
clue_servant_note_two_chimes     <= clue_9
clue_helen_kitchen_supervision   <= clue_4
clue_neil_stable_alibi           <= clue_mechanism_visibility_core
clue_david_library_alibi         <= clue_2
```

The clones allowed the discriminating test to reference valid evidence, but they are shallow structural copies. The narrative content of the cloned clues may not exactly match the CML's original intent, potentially weakening the discriminating test's ability to correctly identify the culprit.

**Also affected:** Because Agent 5 created the clones with the descriptive IDs, the NSD transfer trace at scoring time includes those new IDs (`clue_clock_winding_key_backward`, etc.) but the scoring report's evidence anchor lookup finds no matching anchors for them, triggering Issue 6 (below).

**Proposed fix:** Agent 3 (CML Generator) should use only generic sequential IDs (`clue_1`, `clue_2`, … or a UUID scheme) in the `inference_chain.evidence_clues` references, OR Agent 5's discriminating test construction should fuzzy-match descriptive IDs to the nearest real clue by semantic similarity before treating a missing ID as critical.

---

### Issue 5 — Red Herring Overlap with True-Solution Signals

**Classification:** Agent 5 — red herring design  
**Severity:** Warning (deterministically repaired)

Both red herrings overlapped with the true inference chain on the same lexical tokens:

```
rh_1 → inference steps 1, 2, 3 via: clock, backward, stopped, manipulation
rh_2 → inference steps 1, 2, 3 via: clock, backward, assumption, stopped, chiming
```

This is an inherent tension when the mechanism **is** a clock manipulation: both the true solution path and the red herrings necessarily reference clock-related language. The deterministic sanitizer rewrote both red-herring descriptions to strip the overlapping tokens from `description`/`misdirection` fields.

**Temporal lexical collision:** 2 tokens (`"stopped"`, `"clock"`) appeared in both the false-assumption and correction lexicons. The false assumption is that the clock stopped naturally; the correction is that it was wound backward. The shared vocabulary is structurally unavoidable with this mechanism type.

**Current state:** Deterministically repaired. The story still completed. However, shallow lexical sanitization of red-herring text does not guarantee that the rendered prose will avoid signalling the true mechanism — the prose LLM still receives the CML with the core mechanism visible in the solution, and may inadvertently echo clock-related language in red-herring scenes.

---

### Issue 6 — Scoring Report Generation Failure (invariant violation)

**Classification:** Scoring infrastructure  
**Invariant:** `nsd_revealed_clues_missing_evidence_anchors`

```
Scoring report generation failed: GenerationReport invariant violation(s):
  nsd_revealed_clues_missing_evidence_anchors:
  NSD transfer trace includes newly revealed clue IDs without matching clue evidence anchors.
```

The `hasMissingNsdEvidenceAnchors` check (in `report-invariants.ts`) walks every step in the NSD transfer trace, finds `newly_revealed_clue_ids`, and verifies that each ID has a matching entry in `clue_evidence_anchors`. The 6 deterministically-synthesised clones (Issue 4) were injected into the clue set but were not back-propagated into the NSD evidence anchor table.

**Consequence:** The scoring report is not generated. The quality tab in the UI will show no per-chapter metric breakdown for this run. The cumulative score (97/100) appears in the run events but the full scoring diagnostic (clue delivery, inference coverage, narrative arc) is unavailable.

**Fix path:** After Agent 5 deterministic synthesis, each newly created clue ID should be added to the NSD anchor table with a synthetic anchor referencing its clone source. This is a post-synthesis registration step currently missing from the deterministic pathway.

---

### Issue 7 — Chapter 5 Unbalanced Quotation Marks

**Classification:** Prose quality / punctuation  
**Chapter affected:** 5, attempts 1 and 6

```
Boundary integrity failure in chapter 5: unbalanced quotation marks.
Repair punctuation boundaries before commit.
```

On attempt 1 (2 issues) and attempt 6 (2 issues), Ch5 contained unbalanced quotes alongside the opener issue. The quote imbalance resolved itself on attempts 2–5 (1 issue only — opener remained). On the final rebuild the imbalance reappeared, consistent with the model not having memory of prior punctuation corrections.

**Current state:** Self-resolving in non-exhausted retries. Not a systematic gap at this time.

---

## 5. Agent 5 Remediation Cascade Summary

The scale of deterministic synthesis in this run was unusually large:

| Action | Count |
|--------|-------|
| Evidence-ID clones synthesised | 6 |
| Culprit direct clue synthesised | 1 |
| Late clue slot synthesised | 1 |
| Step 4 contradiction clue synthesised | 1 |
| Red herrings sanitized | 2 |
| CML evidence_clues back-filled | 2 |

9 synthesis events and 2 back-fills in a single run indicate that the CML (Agent 3) output is structurally underspecified for Agent 5's requirements. The LLM retry loop for inference coverage was **skipped** (`Inference coverage gate: critical gaps detected; skipping LLM retry and relying on deterministic step/evidence backstops`), meaning the CML was never repaired by an LLM — only patched deterministically.

The root cause of the cascade is Issue 4: once the discriminating test's clue IDs don't exist, every downstream step that references them also needs patching.

---

## 6. Improvement Proposals

### P0 — Fix already applied: opener retry feedback discrimination (DONE)

`generate.ts` now reads `matchingPriorParagraph` first token to discriminate location-boilerplate from character-name opener and emits specific feedback for each case. See Section 4.4 Fix A.

### P1 — Fix already applied: pre-generation opener diversity constraint (DONE)

`obligation-block.ts` now injects a MANDATORY PARAGRAPH OPENER DIVERSITY rule naming the detective's first name for all chapters. See Section 4.4 Fix B.

### P2 — Add month-lock to FINAL ATTEMPT sensory grounding gate (likelihood: 9/10)

In the "FINAL ATTEMPT — COMPLETE REBUILD REQUIRED" block in `generate.ts`, add an explicit month constraint alongside the sensory grounding list:

> *"Atmospheric language must reflect the story month (February — mid-winter). Do NOT write spring, transitional-season, or warm-weather descriptions."*

This prevents the season contradiction from resurfacing on final-attempt rebuilds.

### P3 — Add suspect_pressure prohibition to obligation block (likelihood: 8/10)

For chapters mapped to `suspect_pressure` stage mode, add an explicit MANDATORY constraint in the obligation block:

> *"⛔ STAGE MODE: SUSPECT PRESSURE — this chapter must NOT contain any scene in which the culprit confesses, is arrested, or is named as the murderer. This is forbidden in this chapter. Suspects are pressured; the case is not resolved."*

This prevents the RESOLUTION_RE trigger from firing at all rather than relying only on retry feedback.

### P4 — Agent 3: enforce generic clue IDs in inference_chain (likelihood: 8/10)

The CML generator (Agent 3) prompt should specify that `evidence_clues` references in the `inference_chain` and `discriminating_test` blocks must use **the actual clue IDs present in the CML's `clue_distribution`**, not newly invented descriptive strings. A post-generation validation step should cross-check all `evidence_clues` references against the top-level clue list before Agent 5 receives the CML.

### P5 — Post-synthesis NSD anchor registration (likelihood: 9/10)

When Agent 5's deterministic synthesis creates a new clue ID, register it in the NSD evidence anchor table with a synthetic anchor referencing the source clue. This eliminates the `nsd_revealed_clues_missing_evidence_anchors` invariant violation without changing scoring logic.

### P6 — Inference coverage LLM retry on partial gap (likelihood: 7/10)

Currently, when critical gaps are detected in the inference coverage gate, the LLM retry loop is **skipped entirely** and the system falls back to deterministic synthesis. An LLM retry attempt (limited to 1–2 calls) before deterministic fallback would give the system a chance to fix the gap semantically (using real clue IDs) rather than by cloning. This would reduce the clone cascade and improve scoring report accuracy.

---

## 7. Code-State Verification (As Of 2026-06-13)

| Issue | Status | Code location |
|-------|--------|---------------|
| Opener retry feedback mismatch (P0) | ✅ **Fixed** | `packages/prompts-llm/src/agent9-prose/generate.ts` |
| Pre-generation opener diversity constraint (P1) | ✅ **Fixed** | `packages/prompts-llm/src/agent9-prose/obligation-block.ts` |
| Month-lock in final-attempt rebuild (P2) | ❌ Missing | `generate.ts` FINAL ATTEMPT block |
| Suspect-pressure ban in obligation block (P3) | ❌ Missing | `obligation-block.ts` — stage-mode handling |
| Agent 3 clue ID namespace (P4) | ❌ Missing | Agent 3 prompt / CML validation gate |
| NSD anchor registration after synthesis (P5) | ❌ Missing | Agent 5 deterministic synthesis path |
| Inference coverage LLM retry before fallback (P6) | ❌ Missing | Agent 5 inference coverage gate |

---

## 8. Summary

Run `run_9e6b3a34-8111-4928-99bf-b6a55a00609c` completed all 10 chapters but exhausted the retry budget on 6 of them. The dominant failure was the **protagonist-name opener dominance** bug: the `template_bleed` retry feedback was hard-coded to the location-boilerplate case and gave completely wrong instructions for character-name opener repeats. The model had no way to correct its output and repeated the same structure across all 6 attempts. Both fixes (correct retry feedback + pre-generation constraint) have been applied.

Three secondary issues remain in the planning layer: Agent 3 generates clue IDs that Agent 5 cannot resolve, triggering a cascade of 9 deterministic synthesis events; the NSD anchor table is not updated after synthesis, causing the scoring report invariant to fail; and the inference-coverage LLM retry is unconditionally skipped when critical gaps exist, preventing semantic repair before deterministic fallback.

The story completed and scored 97/100 cumulative, but the scoring diagnostic report was not generated. Priority for the next iteration:

1. **P2** (month-lock in final-attempt block) — low-effort, directly reduces season contradiction recurrence
2. **P3** (suspect-pressure obligation constraint) — low-effort, prevents stage-mode violation on rebuild
3. **P4 + P5** (clue ID namespace + NSD registration) — higher effort, fixes the scoring report failure and reduces Agent 5 remediation load
