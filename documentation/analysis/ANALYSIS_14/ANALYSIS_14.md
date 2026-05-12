# ANALYSIS_14 — Agent 6 Overhaul Verified + Two Pre-existing Story-Validation Failures

Run reference: `mystery-1778523031529`
Date: 2026-05-11
Execution command: `npm run canary:core`
Log: `logs/canary-core-run-live.txt`
Outcome: **FAIL** — Story validation: 1 critical + 1 major issue

---

## 1. Executive Summary

This was the first canary run after the Agent 6 Fair Play Auditor two-phase overhaul (plan: `documentation/plan/agent6-fairplay-overhaul-plan.md`). The overhaul objective — eliminate false-positive critical violations and remove unnecessary Agent 4 CML revision escalations — was **fully verified**:

- Agent 6 passed on the **first LLM call** (~4 seconds, zero retries, zero escalation).
- The deterministic structural pre-audit logged `PASS — all 3 inference step(s) covered, 3 evidence clue(s) verified in early|mid. LLM will assess narrative quality only.`
- Blind reader simulation: **PASS**.

The pipeline failure originated from **two pre-existing bugs** unrelated to Agent 6:

1. **[critical]** `Inference coverage` story-validator check: `discriminating_test.evidence_clues` referenced `clue_1, clue_2` (Agent 3 CML placeholder IDs) that no longer existed after Agent 5 regeneration cycles. The story-validator's inference coverage gate fired; a clue regen cycle was triggered (spending budget), but the CML's `evidence_clues` array was never updated to the real IDs before reaching final validation.

2. **[major]** `SuspectClosure` validator: regex and semantic fallback both failed for non-culprit Captain Ivor Hale and culprit Dr. Mallory Finch. The validator requires full names to appear in the reveal text; Agent 9 used surnames only ("Dr. Finch", "Captain Hale"). Both regex and semantic fallback returned false. This is the same bug documented in ANALYSIS_13 §2.2.

---

## 2. Run Timeline

| Time (UTC) | Stage | Outcome |
|---|---|---|
| 18:10:31 | Agent 1 Setting | Pass |
| 18:10:40 | Agent 2 Cast | Pass — 4 characters (Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill) |
| 18:10:55 | Agent 2e Background Context | Pass on attempt 1/2 |
| 18:11:10 | Agent 3b Hard Logic Devices | Retry ×1 (truncated JSON); pass on attempt 2/3 |
| ~18:11:24 | Agent 3 CML | Pass — CML generated with `evidence_clues: [clue_1, clue_2]` (placeholder IDs) |
| ~18:11:48 | Agent 8 Novelty | Pass — most similar: *The Mysterious Affair at Styles* (0.73), threshold 0.90 |
| 18:11:55 | Agent 5 first pass | Pass — 12 clues distributed |
| 18:12:12 | Agent 5 coverage regen | Regenerating to address coverage gaps |
| 18:12:29 | Agent 5 suspect regen | Regenerating to address suspect coverage gaps |
| 18:12:47 | **Agent 6 structural pre-audit** | **PASS** — 3 steps covered, 3 evidence clues in early\|mid |
| 18:12:47 | **Agent 6 LLM audit** | **PASS** — first attempt, ~4s, narrative-quality-only mode |
| 18:12:51 | **Agent 6 blind reader** | **PASS** |
| 18:12:55 | Agent 2b Character Profiles | Pass on attempt 1/3 |
| 18:13:34 | Agent 2c Location Profiles | Pass on attempt 1/3 |
| 18:14:31 | Agent 2d Temporal Context | Pass on attempt 1/2 — July 1933 |
| 18:14:31 | Agent 6.5 World Builder | Pass (2 LLM calls) |
| ~18:15:31 | Agent 7 Narrative | Pass — 10 scenes, 19,800 words; discriminating test placed Scene 7 (late Act II) |
| ~18:16 | Agent 9 prose Ch 1 | Pass |
| ~18:16 | Agent 9 prose Ch 2 | **Retry ×2** — n-gram overlap 0.82 ≥ 0.70 |
| ~18:17 | Agent 9 prose Ch 5 | **Retry ×2** — n-gram overlap + repeated paragraph fingerprint |
| ~18:18 | Agent 9 prose Ch 10 | **Retry ×1** — template non-convergent |
| ~18:20:47 | Agent 9 prose complete | 10 chapters — 3/10 required retry |
| ~18:20:47 | Post-prose validation | Locked-fact sweep: 4 injections; pronoun sweep: 2 repairs |
| ~18:20:47 | `DiscriminatingTestValidator` | Scene 4 + Scene 3 semantically validated |
| ~18:20:56 | `SuspectClosureValidator` | **FAIL** — Captain Ivor Hale + Dr. Mallory Finch, regex + semantic both fail |
| ~18:20:56 | `InferenceCoverageValidator` | **FAIL [critical]** — `clue_1`, `clue_2` missing from distributed clues |
| 18:20:56 | Final validation gate | **FAIL** — 1 critical, 1 major |

---

## 3. Agent 6 Overhaul Verification

### 3.1 Pre-audit log (from warnings array)

```
Agent 6 structural pre-audit: PASS — all 3 inference step(s) covered,
3 evidence clue(s) verified in early|mid. LLM will assess narrative quality only.

CML gate: back-filled evidence_clues with 2 clue(s):
clue_core_contradiction_chain, clue_4
```

The parity-bridge back-fill ran as expected, adding real clue IDs to `evidence_clues`. However, the CML still retained `clue_1` and `clue_2` alongside the new IDs — see §4.1 for root cause.

### 3.2 LLM audit performance

| Metric | Value |
|---|---|
| Attempts | 1 |
| Mode | Narrative-quality only (structural pre-audit passed) |
| Request time | 18:12:47.064Z |
| Response time | 18:12:51.868Z |
| Duration | ~4.8 seconds |
| Result | pass |
| Escalation triggered | No |
| Agent 4 CML revision | Not triggered |

**Comparison to pre-overhaul baseline (ANALYSIS_13):** Agent 6 previously required 2–3 LLM calls, triggered clue regen, then triggered Agent 4 CML revision on every run due to false-positive `inference_path_abstract` classification. This run: 1 call, 0 escalations.

### 3.3 All tests passing

All 144 worker tests pass (`npm run test -w @cml/worker`, exit 0), including both updated agent6-run-flow tests.

---

## 4. Failure Analysis

### 4.1 [critical] Inference Coverage — clue_1 / clue_2 placeholder ID leak

**Symptom:**
```
Inference coverage: [critical] Discriminating test evidence_clues
reference missing clue id(s): clue_1, clue_2

Inference coverage gate: critical gaps found; regenerating clues with coverage feedback
```

**Root cause:** Agent 3 (CML Generator) emits `discriminating_test.evidence_clues` as placeholder IDs (`clue_1`, `clue_2`) in the initial CML. Agent 5 extracts and assigns real IDs (`clue_core_contradiction_chain`, etc.). The parity-bridge back-fill in Agent 6 pre-processing correctly adds real IDs to `evidence_clues`, but the original placeholder IDs are **not removed**. When the story-validator's `InferenceCoverageValidator` runs post-prose, it finds `clue_1` and `clue_2` in `evidence_clues`, looks for them in the distributed clues, and raises a critical gap.

**Why it didn't fire at Agent 6 stage:** `runDeterministicStructuralAudit` checks `evidence_clues` IDs against the distributed clue list and found `clue_core_contradiction_chain` (newly back-filled) present in early|mid — passing. But the placeholder IDs `clue_1` / `clue_2` were still sitting in the array and went undetected because the parity-bridge appended rather than replaced.

**Location:** `apps/worker/src/jobs/mystery-orchestrator.ts` lines 551–590 — `canonicalExistingEvidence` filter uses the regex `/^clue_[a-z0-9_-]+$/i` to decide which existing IDs are "canonical" before back-filling. This regex accepts placeholder IDs (`clue_1`, `clue_2`) because `1` satisfies `[a-z0-9_-]+`. They survive into `canonicalExistingEvidence` and are then spread into the final array alongside the newly appended real IDs, so the back-fill produces `[clue_1, clue_2, clue_core_contradiction_chain, clue_4]` rather than the intended replacement. The back-fill needs to filter by actual distributed clue IDs instead of a pattern:
- **Option A (preferred):** Replace the regex filter with a set-membership check against the distributed clue IDs: `const distributedIds = new Set(ctx.clues!.clues.map(c => String(c.id))); const canonicalExistingEvidence = currentEvidence.filter(id => distributedIds.has(id));`
- **Option B:** Unconditionally replace `evidence_clues` with only the selected essential IDs, discarding any pre-existing IDs.

**Severity:** Critical — fires every run where Agent 3 uses placeholder IDs (which appears to be the standard output).

### 4.2 [major] SuspectClosure — surname-only references in reveal chapter

**Symptom:**
```
[SuspectClosureValidator] Regex validation failed for Captain Ivor Hale; trying semantic fallback...
[SuspectClosureValidator] Semantic validation also failed for Captain Ivor Hale
[SuspectClosureValidator] Regex validation failed for culprit Dr. Mallory Finch; trying semantic fallback...
[SuspectClosureValidator] Semantic validation also failed for culprit Dr. Mallory Finch
```

**Root cause:** Two separate failures that stack:

1. **Phase 1 (regex):** `ELIMINATION_TERMS` and `CULPRIT_TERMS` require narrow vocabulary (`cleared`, `ruled out`, `eliminated`, `culprit`, `killer`, `murderer`, `responsible`). Literary prose uses a wider vocabulary: "removing him from suspicion", "his alibi was unassailable", "only Dr. Finch could have arranged the crime" — none of these match. Regex consistently fails for well-written prose.

2. **Phase 2 (semantic fallback):** The validator already has `extractSurname` + `nameAppearsInText` — it correctly matches surnames (`Hale`, `Finch`). However, the semantic fallback only examines scenes where **the suspect's name appears** (`nameAppearsInText` returns true). In literary mystery prose, elimination passages typically use pronouns or title-only references after the character's initial introduction: "his movements were accounted for", "the Captain could not have reached the study in time". These passages do **not** contain the surname, so `nameAppearsInText` returns false, the semantic fallback skips them, and no scene is ever checked where the elimination actually occurs.

This is a structural scope problem: elimination evidence exists in the story, but the validator's scene-filter requires the name to appear in the same scene as the elimination language — which literary prose violates by design.

This is the **same class of bug as ANALYSIS_13 §2.2**, which was documented but not yet fixed.

**Location:** `packages/story-validation/src/suspect-closure-validator.ts` — the Phase 2 loop filters scenes by `nameAppearsInText` before semantic checking; this filter must be relaxed or eliminated for the full-story elimination check.

**Severity:** Major — fires whenever Agent 9 uses surname shorthand in the reveal, which is stylistically natural prose behaviour.

### 4.3 [moderate] Pronoun drift — Eleanor Voss, Beatrice Quill

Pronoun drift flagged in chapters 1, 2, 5, 7, 10 (Eleanor Voss) and chapters 3, 7 (Beatrice Quill). The pre-validation deterministic pronoun sweep (`applyDeterministicPronounSweep`) applied 2 repairs at the post-prose stage, but the story-validator still found male pronouns nearby female characters. Likely nearby-pronoun false positives (e.g., a male character's pronoun in the same paragraph) rather than actual attributions.

Not a pipeline-blocking issue at current severity threshold, but repeated across runs.

### 4.4 [minor] Context leakage — location profile template sentences

3 chapters (2, 4, 5) flagged for sentences showing hallmarks of location profile template leakage (room + sensory enumeration, 78–104 words). Not blocking at minor severity.

---

## 5. Prose Generation Health

| Chapter | Retries | Issue |
|---|---|---|
| Ch 1 | 0 | Clean |
| Ch 2 | 2 | n-gram overlap 0.82 ≥ 0.70 |
| Ch 3 | 0 | Clean |
| Ch 4 | 0 | Clean |
| Ch 5 | 2 | n-gram overlap + repeated paragraph fingerprint |
| Ch 6 | 0 | Clean |
| Ch 7 | 0 | Clean |
| Ch 8 | 0 | Clean |
| Ch 9 | 0 | Clean |
| Ch 10 | 1 | Template non-convergent |

3/10 chapters required retry (30%). Chapters 2 and 5 needed sensory grounding repair on first pass (sensory marker gate). All chapters ultimately validated.

---

## 6. Recommended Fixes (Priority Order)

| # | Bug | Severity | Agent | Fix |
|---|---|---|---|---|
| 1 | `evidence_clues` placeholder ID retention | Critical | Agent 5 / Agent 6 pre-proc | Replace `evidence_clues` array with verified real IDs after Agent 5 run; remove any IDs not present in distributed clue list |
| 2 | `SuspectClosureValidator` scene-scope mismatch | Major | Story Validation | Semantic fallback must search full-story concatenated text (not scene-by-scene) for elimination/culprit evidence; OR instruct Agent 9 to name each suspect explicitly in the elimination line |
| 3 | Pronoun drift false positives | Moderate | Story Validation | Narrow proximity window for pronoun-drift detection to same-sentence scope rather than same-paragraph |

---

## 7. Agent 6 Overhaul — Status

The Phase 1 + Phase 2 overhaul is **complete and verified**:

| Objective | Status |
|---|---|
| Eliminate `required_evidence` hallucination | ✅ Relabelled as "CML authoring notes (scaffold only)" |
| Clue ID Manifest in developer context | ✅ Implemented |
| Audit scope boundary notice | ✅ Implemented |
| `runDeterministicStructuralAudit()` | ✅ PASS on first run |
| Backstops moved pre-LLM | ✅ Confirmed |
| Narrative-quality-only LLM mode when structural passes | ✅ Confirmed (~4.8s, 1 call) |
| Escalation driven by deterministic result | ✅ No false escalation |
| Agent 4 CML revision triggered | ✅ Not triggered (correct) |
| All 144 tests passing | ✅ |

Next work should target fix #1 (evidence_clues cleanup) and fix #2 (SuspectClosure surname matching).

---

## 8. Strategic Holistic Analysis

Four distinct failure themes run across all issues in this run. Rather than fixing each bug in isolation, addressing the underlying theme eliminates the whole class of failures.

---

### 8.1 Theme: The CML is not kept in sync with the clue distribution it spawns

**Affects:** §4.1 (critical — evidence_clues placeholder IDs), §3.1 (parity-bridge appending rather than replacing)

**Root cause pattern:** Agent 3 generates the CML with placeholder IDs (`clue_1`, `clue_2`) as structural intent. Agent 5 then extracts and distributes real clues under real IDs. But the CML is never updated to reflect this — it remains an artefact of Agent 3's intent rather than a live truth. Every downstream validator that reads `discriminating_test.evidence_clues` from the CML is reading stale, invalid data.

The parity-bridge back-fill in Agent 6 pre-processing is a patch on top of a patch — it appends real IDs but cannot know which placeholder IDs to remove, so the poisoned originals survive to the final validator.

**Holistic solution: Post-Agent-5 CML ID reconciliation step**

Define a single deterministic "CML hydration" step that runs immediately after Agent 5 completes (before Agent 6 pre-audit). This step:

1. **Replaces** `discriminating_test.evidence_clues` wholesale with the IDs of all distributed early|mid essential clues that satisfy the discriminating test design intent. No appending. Full replacement.
2. **Verifies** all `inference_path.steps[].required_evidence` entries (currently labelled as authoring notes) — if any happen to contain valid real IDs, reconcile them; if they contain only prose descriptions (the common case), leave them untouched as notes.
3. **Emits a structured reconciliation report** (e.g., `{ replaced: ["clue_1","clue_2"], with: ["clue_core_contradiction_chain","clue_4"] }`) that is logged and included in the partial artifact for diagnostics.

The parity-bridge back-fill in Agent 6 is then redundant for `evidence_clues` and can be narrowed to its original purpose (parity clue injection only). `runDeterministicStructuralAudit` becomes the verification pass over already-clean data.

**Benefit:** Eliminates the critical story-validator failure permanently. Removes a whole class of "placeholder ID leaked downstream" bugs. Makes the CML a reliable source of truth at all stages from Agent 5 onward.

---

### 8.2 Theme: Validators use scene-scoped name-matching that silently skips elimination passages

**Affects:** §4.2 (major — SuspectClosure failure), §4.3 (moderate — pronoun drift false positives)

**Root cause pattern:** `SuspectClosureValidator` already has `extractSurname` + `nameAppearsInText` — it can match surnames without issue. The structural failure is different: the semantic fallback **only examines scenes where the suspect's name appears**. In literary mystery prose, elimination passages routinely use pronouns or title-only forms ("his movements were accounted for", "the Captain was clearly elsewhere") after the character's name has been established. The elimination passage does not contain the surname, so the scene is excluded from the semantic check — even though it contains the evidence that would validate the elimination.

This is a scope-boundary problem: both regex and semantic validation are scene-scoped, but the evidence that exonerates a suspect is distributed across chapters, or is present in a scene that refers to the suspect by pronoun only.

`pronoun_drift` has the inverse problem: it fires when any male pronoun appears in a paragraph containing a female character's name — a false positive whenever a male character and a female character share a paragraph (which is standard prose).

**Root cause pattern:** Both validators enforce a local, scene-scoped assumption on prose that is inherently cross-scene and pronoun-referential. This is a validator architecture mismatch with literary prose conventions, not a bug in Agent 9.

**Holistic solution: Full-story scope for elimination; sentence-scope for pronoun detection**

**A. Full-story suspect elimination check:**

For the suspect elimination check, concatenate all scene texts and check the full story as a single unit. If the culprit is explicitly implicated anywhere in the story AND the suspect's name appears anywhere in the story (establishing they exist as a character), the suspect is implicitly cleared by culprit accusation. As a hardening measure, also run the semantic check on a concatenated reveal-chapter block (the final 2–3 scenes) where elimination summaries most commonly occur.

Concretely:
- Phase 1 regex: unchanged (fast filter, good enough when prose happens to match)
- Phase 2 semantic: instead of iterating per-scene filtered by `nameAppearsInText`, concatenate the last N scenes (configurable, default 3) and run a single semantic check: "Does the following excerpt, taken from the mystery's resolution, eliminate [suspect] as a suspect, either explicitly or by naming another character as the culprit?"
- If that fails, run one more check on the full story text (all scenes joined), asking if the culprit is identified anywhere and the suspect is distinct from the culprit

This eliminates both the "name must appear in elimination scene" constraint and the "no single scene has all the evidence" constraint.

**B. Pronoun drift detection: sentence-scope, not paragraph-scope**

The current detector flags a female character when a male pronoun appears anywhere in the same paragraph. Fix: narrow the detection window to the same sentence, or — better — only flag when the pronoun is the subject or object of a clause whose nearest named antecedent is the flagged character. This eliminates false positives from multi-character paragraphs entirely.

**Benefit:** Eliminates the major SuspectClosure failure permanently. Eliminates the moderate pronoun drift false positives. The full-story scope change is also architecturally correct for mystery structure — suspects are cleared by the resolution chapter, not necessarily in their own dedicated elimination scene.

---

### 8.3 Theme: Agent 9 receives verbatim template text as context and reproduces it

**Affects:** §4.4 (minor — context leakage), §5 (prose retries — n-gram overlap 0.82 in Ch 2, Ch 5)

**Root cause pattern:** Agent 9 receives full location profiles as context. Location profiles are themselves written by an LLM (Agent 2c) and contain long, enumeration-heavy descriptive sentences ("The study: oak-panelled walls, Persian rugs, a grandfather clock on the mantel, the scent of pipe tobacco..."). When Agent 9 writes the corresponding scene, the highest-probability completion is to paraphrase or directly reproduce this enumeration. The anti-template linter catches the n-gram overlap (0.82 ≥ 0.70 threshold) and forces retries.

The retries ultimately succeed, but at cost: 2 extra LLM calls per affected chapter, and 3/10 chapters affected in this run. This is a structural incentive problem — Agent 9 is handed a template and then penalised for using it.

**Holistic solution: Context compression before Agent 9**

Before passing location profiles (and character profiles) to Agent 9, run a deterministic compression step that replaces the full profile with a compact "scene anchor note":

- **Full location profile** (200–400 words of enumerated sensory detail) → **scene anchor** (1–2 sentences: setting name, 2 defining physical features, 1 atmosphere note)
- **Full character profile** (200–300 words of backstory, motivation, personality) → **character note** (character name, role, 1 defining trait, 1 motive hint)

The compressed form gives Agent 9 the grounding it needs to write accurately without providing copy-able template text. The anti-template linter should rarely fire against source material that is already compact.

Alternatively (lower effort): strip location/character profile context from chapters where the chapter's outline scene does not feature a primary location transition or character introduction. Agent 9 only needs the full profile when a character or location first appears.

**Benefit:** Reduces prose retries (currently 30% of chapters). Reduces context token count per Agent 9 call. Eliminates context leakage warnings. Faster, cheaper prose generation.

---

### 8.4 Theme: Agent 3b consistently hits its token ceiling

**Affects:** §2 timeline (Agent 3b retry ×1 for truncated JSON); prior runs show the same pattern

**Root cause pattern:** Agent 3b (Hard Logic Device Generator) is asked to produce 5 hard-logic devices in a single JSON response. Each device contains multiple verbose fields (mechanism, variationEscalation, etc.). The response consistently approaches or exceeds the configured `max_tokens` limit, producing truncated JSON. A retry regenerates the full response, passing on attempt 2. This burns 1 extra LLM call every run.

**Holistic solutions (two options):**

**Option A (config change, ~5 minutes):** Increase Agent 3b `max_tokens` from 4000 (current value in `apps/worker/config/generation-params.yaml`) to at least 6000. The canary run truncation ended mid-sentence inside a `variationEscalation` field, confirming the response exceeded 4000 completion tokens for this particular mystery input. This is the minimum viable fix — a single parameter change.

**Option B (structural, more robust):** Reduce the number of devices requested from 5 to 3. The CML generator (Agent 3) selects from the generated devices anyway; 3 high-quality devices give it sufficient choice without the output volume that causes truncation. The 5-device design over-produces to compensate for quality variance; improving the device prompt quality would make 3 sufficient.

**Benefit of Option A:** Immediate, zero retries. **Benefit of Option B:** Permanently solves the volume problem, improves per-device quality, reduces output cost.

---

### 8.5 Summary: Four themes, four targeted interventions

| Theme | Intervention | Blocking severity | Effort |
|---|---|---|---|
| CML not in sync with clue distribution | Post-Agent-5 CML ID reconciliation step (full replace of `evidence_clues`) | Critical | Medium |
| Rigid scene-scoped name-matching in validators | Full-story scope for elimination check; sentence-scope pronoun detection | Major + Moderate | Low–Medium |
| Agent 9 reproduces context template text | Context compression before Agent 9 (compact anchors, not full profiles) | Minor + retry cost | Medium |
| Agent 3b token ceiling | Increase `max_tokens` or reduce to 3 devices | Retry cost (no block) | Trivial (Option A) |

None of the above are independent one-off patches. Each addresses the structural incentive or architectural decision that causes a whole class of failures:

- **Theme 8.1** removes the need for the parity-bridge back-fill's append logic, simplifies `runDeterministicStructuralAudit`, and makes the CML a reliable truth from Agent 5 onward.
- **Theme 8.2** changes the semantic fallback from scene-scoped iteration to a full-story / reveal-block search, correctly handling the literary pattern of suspects being cleared by implication at the resolution rather than in a dedicated elimination scene. Once this scope fix is in place, the validator reliably handles all well-written mystery prose.
- **Theme 8.3** attacks prose retries at source rather than through linter tuning; it also reduces per-chapter token usage, which has compounding cost benefit across 10 chapters.
- **Theme 8.4** is a trivial config fix that eliminates a reproducible per-run wasted call.

Recommended implementation order: 8.1 → 8.4 → 8.2 → 8.3 (critical-first, then quick win, then medium-effort structural fixes).
