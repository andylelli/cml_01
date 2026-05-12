# ANALYSIS_12 — Suspect Closure + Discriminating Test Realisation Failure

Run reference: `mystery-1778427187923`
Date: 2026-05-10
Execution command: `npm run canary:core`
Log file: `logs/canary-core-run-live.txt`
Outcome: **FAIL** — Story validation: 1 critical, 3 major issues

---

## 1. Executive Summary

This run followed a successful Agent 5 hardening pass (fixes to `strictPromptContractsEnabled`, `repairInvalidSourcePaths`, and `synthesizeMissingCulpritDiscriminatingClues`). Agent 5 produced 9 clues on the first attempt with no source-path hard gate failure — confirming those fixes are working.

The failure occurred entirely in final story validation, driven by two categories of problem:

1. **Suspect closure missing**: Captain Ivor Hale was not explicitly eliminated with evidence in the prose. Dr. Mallory Finch (culprit) was not explicitly convicted in prose either — both regex and semantic fallback validators failed.
2. **Discriminating test not realized in prose**: The regex validator failed to find the discriminating test staged in the narrative. The semantic fallback succeeded for scene 2 but was insufficient for the validator to count it as realised — suggesting the test scene was too implicit.

Contributing upstream factor: Agent 6 repeatedly audited the CML as a structural fair-play failure (`inference_path_abstract`) and escalated to Agent 4 CML revision, consuming retry budget and leaving 5 non-structural violations in the final accepted state. The pipeline proceeded to prose with those unresolved warnings, increasing the obligation density Agent 9 had to satisfy.

---

## 2. Run Timeline

| Time | Stage | Outcome |
|---|---|---|
| 15:33:08 | Agent 1 Setting | Pass |
| 15:33:19 | Agent 2 Cast | Pass (4 characters) |
| 15:33:32 | Agent 2e Background | Pass attempt 1/2 |
| 15:33:52 | Agent 3b Hard Logic | Pass attempt 1/3 |
| 15:34:15 | Agent 3 CML | Pass |
| 15:34:20 | Agent 8 Novelty | Pass (0.76 similarity, threshold 0.90) |
| 15:34:20 | **Agent 5 first pass** | **9 clues — no source-path failure** |
| 15:35:00 | Agent 6 first audit | Fail → clue regen triggered |
| 15:35:14 | Agent 5 regen (fair play feedback) | Pass |
| 15:35:21 | Agent 6 second audit | Fail — classified `inference_path_abstract` |
| 15:35:25 | Blind reader simulation | Pass |
| 15:35:25 | Agent 4 CML revision | Triggered |
| 15:35:58 | Agent 6 post-revision audit | Fail — 5 non-structural violations remain |
| 15:36:09 | Agent 5 post-revision clue regen | Pass |
| 15:36:37 | Agent 6 final | Downgraded Logical Deducibility to warning — proceeded |
| 15:36:37 | Agents 2b/2c/2d/65/7 | All pass first attempt |
| 15:39:23 | Agent 9 Ch1 | Pass (pronoun repair: 4) |
| 15:40:04 | Agent 9 Ch2 | Retry ×4 — word count below floor on attempt 3/4, passed attempt 4 |
| 15:41:06 | Agent 9 Ch4 | Pass (pronoun repair: 17) |
| 15:41:16 | Agent 9 Ch5 | Retry ×3 — weak atmosphere opening, passed attempt 3 |
| 15:41:48 | Agent 9 Ch7 | Pass (score 84/100) |
| 15:42:38 | All 10 chapters | Complete (cumulative 96/100) |
| 15:42:49 | Final story validation | **FAIL — 1 critical, 3 major** |

---

## 3. Agent 5 Fix Confirmation

The three fixes shipped in this session worked as intended:

| Fix | Evidence |
|---|---|
| `strictPromptContractsEnabled` now default-on | Agent 6 post-revision logs show strict synthesis running: `clue_culprit_direct_dr_mallory_finch -> CASE.cast[1].access_plausibility` (legal cast path, not old illegal `CASE.culpability.culprits[0]`) |
| `repairInvalidSourcePaths` dot→underscore canonicalization | No `invalid source path` gate failure at any point. Zero Agent 5 source-path retries. |
| `synthesizeMissingCulpritDiscriminatingClues` legal paths | Synthesised culprit clue used `CASE.cast[1].access_plausibility` — a valid `ALLOWED_SOURCE_PATTERNS` path |

Agent 5 is no longer a source of hard failures in this run class.

---

## 4. Root Cause Map

### RC1. Suspect closure not realized in prose (critical)

**Validator failure**: `SuspectClosureValidator` failed regex and semantic fallback for both Captain Ivor Hale (non-culprit) and Dr. Mallory Finch (culprit).

**Structural cause**: Agent 6 classified the CML as `inference_path_abstract` and escalated to Agent 4 CML revision. After revision, 5 fair-play violations were downgraded to warnings and the pipeline proceeded. This means Agent 9 received a CML with explicit `discriminating_test` and `culpability` entries but without concrete prose-level anchors strong enough to force Agent 9 to name and eliminate suspects explicitly.

**Proximate cause in Agent 9**: No chapter explicitly names Captain Ivor Hale and provides a corroborated reason for his elimination. No chapter explicitly names Dr. Mallory Finch as the culprit using physical trace / mechanism link language.

**File reference**: `apps/worker/src/jobs/mystery-orchestrator.ts` — proceeds to prose generation when only non-structural fair-play violations remain. Chapter prompts for Agent 9 do not appear to mandate explicit suspect-naming in the confrontation/elimination chapters.

### RC2. Discriminating test too implicit in prose (major)

**Validator failure**: `DiscriminatingTestValidator` regex check failed; semantic fallback passed for scene 2 but with ambiguous language ("potentially excluding Dr. Finch if no evidence of tampering is found"). This is a conditional framing, not an explicit realization.

**Structural cause**: The discriminating test in the CML was the clock examination. Agent 9 wrote a scene that referenced the clock but did not stage it as an explicit, active discriminating test with named suspects and a stated mechanism outcome.

**Likely cause**: Chapter 7 scored 84/100 (the lowest chapter score), suggesting that is where the test scene landed, but it passed individual chapter validation. The chapter-level validator does not check discriminating test realization — only the final story validator does.

### RC3. Pronoun drift across multiple chapters (moderate, ×4)

Eleanor Voss (female) generated nearby male pronouns in chapters 5, 8, 9, and 10.

The pre-validation pronoun repair ran for ch1 (4 repairs) and ch4 (17 repairs) and ch9 (4 repairs). The final `applyDeterministicPronounSweep` applied 1 further repair. Despite these, 4 moderate violations remain in final validation.

**Root cause**: The pre-validation sweep is applied per-chapter individually. A male pronoun near a character mention can survive when the antecedent spans a paragraph boundary or when a nearby male character is the actual intended subject. The per-chapter sweep cannot resolve ambiguous cross-sentence pronoun scope.

### RC4. Context leakage suspected in chapters 2, 4, 7, 9 (minor, ×4)

Location profile template sentences (room + sensory enumeration patterns, 69–90 word sentences) were detected in four chapters.

**Root cause**: Agent 9 prompt likely includes location profile context, and for longer scene-setting passages the model reverts to template-style enumeration inherited from the location profile artifact. This is a repeat of the pattern identified in ANALYSIS_11.

### RC5. Agent 6 repeated structural classification (upstream contributor)

Agent 6 classified the initial CML as `inference_path_abstract` and triggered Agent 4 CML revision. After revision the audit still showed critical failures on Clue Visibility, Information Parity, Logical Deducibility, Discriminating Test Timing, and No Withholding. These were ultimately downgraded because deterministic clue coverage showed no structural gaps — but the prose received abstract, under-anchored fair-play guidance.

This is a recurrence of the upstream pattern: Agent 6 cannot distinguish abstract inference paths from concretely anchored ones reliably, and Agent 4 revision does not always produce concrete evidence anchors even when instructed.

---

## 5. Failure Classification

| Validation issue | Severity | Class |
|---|---|---|
| `suspect_closure_missing` — Captain Ivor Hale not eliminated | major | `prose.suspect_closure_missing` |
| `suspect_closure_missing` — Dr. Mallory Finch not convicted | (implied in validator failures) | `prose.suspect_closure_missing` |
| `cml_test_not_realized` — discriminating test too implicit | major | `prose.cml_test_not_realized` |
| 2 further major issues (logged to scoring.jsonl) | major | unknown — check scoring.jsonl |
| `pronoun_drift` Eleanor Voss ×4 chapters | moderate | `prose.pronoun_drift` |
| `context_leakage_suspected` ×4 chapters | minor | `prose.context_leakage` |

---

## 6. What Did Not Fail This Run

Compared to the last run captured in ANALYSIS_11:

- Agent 5 source-path gate: **no failure** (fixed)
- Agent 5 hard-fail retries: **none** (fixed)
- Template linter high n-gram overlap Chapter 7: **no failure** — Chapter 7 scored 84/100 and passed chapter validation
- Chapter 2 word count: required 4 retry attempts but passed
- Chapter 5 atmosphere opening: required 3 retry attempts but passed

The failure class has shifted from Agent 5 / template convergence → suspect closure + discriminating test realization. This is progress in failure localization.

---

## 7. Prevention-First Remediation Plan

### P0 (Immediate): Mandate suspect naming in Agent 9 chapter prompts for confrontation chapters

Change:
- Identify which outline chapters map to suspect elimination and culprit reveal scenes.
- Inject mandatory suspect-naming requirements into those chapter prompts: for each eligible non-culprit, the chapter must name them and state the corroborated exclusion reason; for the culprit chapter, must name them and cite the physical/mechanism trace.

Success condition:
- `SuspectClosureValidator` regex passes without semantic fallback for non-culprit elimination and culprit conviction chapters.

### P1 (Immediate): Mandate explicit discriminating test staging language in Agent 9

Change:
- When CML includes a `discriminating_test`, inject a required narrative contract into the relevant chapter prompt: the test must be named explicitly, the mechanism must be stated, and the outcome must name the culprit.
- Avoid conditional framing ("potentially") — require declarative past-tense resolution.

Success condition:
- `DiscriminatingTestValidator` regex passes without semantic fallback.

### P2 (Short-term): Strengthen Agent 6 structural classification to reduce `inference_path_abstract` false positives

Change:
- Tighten the `inference_path_abstract` classification criteria so it requires concrete evidence of missing named entities or records in the CML — not just abstract wording in inference steps.
- Reduce the frequency of Agent 4 CML revision escalation for cases where clue coverage is otherwise sound.

Success condition:
- Agent 6 does not classify satisfiable CML as `inference_path_abstract` when discriminating test and cast entries are concretely populated.

### P3 (Short-term): Fix pronoun drift scope across paragraph boundaries

Change:
- Extend `applyDeterministicPronounSweep` to scan a window of ±2 sentences around each female character mention for nearby male pronouns, not only within the same sentence.
- Add a second sweep pass that resolves ambiguous cross-sentence cases by checking the last named character before the pronoun.

Success condition:
- `pronoun_drift` violations drop to zero for female characters who are the sole named character in a paragraph.

### P4 (Short-term): Suppress location profile template sentence patterns in Agent 9

Change:
- Add a location-profile-template detection filter to the per-chapter pre-validation sweep that identifies and breaks up room+sensory-enumeration sentences above 60 words.
- Alternatively, strip template-style enumerations from the location profile context passed to Agent 9.

Success condition:
- `context_leakage_suspected` violations drop to zero.

---

## 8. Verification Gates

1. Full core run produces zero `suspect_closure_missing` critical/major issues.
2. `DiscriminatingTestValidator` regex passes without falling back to semantic.
3. No `pronoun_drift` moderate violations for Eleanor Voss (or any female character) in any chapter.
4. No `context_leakage_suspected` minor violations.
5. Agent 5 source-path gate continues to produce zero hard failures (regression check on fix from this session).

---

## 9. Final Assessment

The Agent 5 fixes from this session are confirmed working and have eliminated a recurring hard failure class. The failure has shifted upstream to a different and harder problem: Agent 9 prose does not reliably realize the discriminating test and suspect closure arcs even when the CML contains the required entries. This is a prose generation obligation gap — Agent 9 is passing chapter-level validation but failing story-level semantic contracts. The fix requires stronger mandatory constraints in the chapter prompts for confrontation and elimination scenes.
