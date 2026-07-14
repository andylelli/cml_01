# ANALYSIS_34 — Run `mystery-1781208176181`: Chapter 3 Retry Exhaustion
*Date: 2026-06-11 | Run: `mystery-1781208176181` | Started: 20:02 UTC | Failed: ~20:14 UTC*

---

## 1. Scope

This report covers the run that started at **20:02 UTC on 11 June 2026** and was abandoned
after Agent9 exhausted all retry attempts on Chapter 3. A new pipeline run
(`mystery-1781209629371`) was started 12 minutes later at 20:27 UTC.

Source artefacts:
- `c:\CML\logs\llm.jsonl` (lines 78–131)
- `c:\CML\logs\agent9-checkpoint-mystery-1781208176181.json`

---

## 2. Outcome Summary

| Item | Value |
|------|-------|
| Run status | Abandoned after Chapter 3 retry exhaustion |
| Run ID | `mystery-1781208176181` |
| Chapters completed | 2 of 10 (Ch1, Ch2) |
| Failure stage | `Agent9-ProseGenerator-Ch3` |
| Failure class | Fingerprint / paragraph-opening linter — repeated rejections |
| Ch3 LLM attempts | **6** (over ~100 seconds, 20:13:05–20:14:48 UTC) |
| Pre-prose pipeline | All agents passed (Agents 1–7 complete) |
| Secondary issues in checkpoint prose | Role-title phrasing ("the doctor Finch", "the captain Hale"); truncated sentences |

---

## 3. Pipeline Progress Reached

All pre-prose agents completed successfully before the failure:

1. Agent1 — Setting Refiner: pass
2. Agent2 — Cast Designer: pass
3. Agent2e — Background Context: pass
4. Agent3b — Hard Logic Device Generator: pass
5. Agent3 — CML Generator: pass
6. Agent8 — Novelty Auditor: pass (novelty 0.56, highest similarity 0.44 to *The Big Bow Mystery*)
7. Agent5 — Clue Extraction: pass (16 clues, 2 red herrings, fair-play passed)
8. Agent6 — Fair-Play Auditor: pass
9. Agent6 — Blind Reader: pass (suspected culprit: Captain Ivor Hale, confidence: *likely*)
10. Agent2b — Character Profiles: pass
11. Agent2c — Location Profiles: pass
12. Agent2d — Temporal Context: pass
13. Agent65 — World Builder: pass
14. Agent7 — Narrative Formatter: pass (required two LLM calls, both succeeded)
15. **Agent9 — Prose Ch1: pass**
16. **Agent9 — Prose Ch2: pass**
17. **Agent9 — Prose Ch3: FAIL × 6 → run abandoned**

---

## 4. Story Concept (This Run)

| Field | Value |
|-------|-------|
| Title | "The Tides of Time: A Coastal Hotel Murder" |
| Setting | Rocky Shoreline Bay Hotel / Bayview Hotel, St. Ives Bay, 1945 |
| Detective | Dr. Mallory Finch (role flip from the earlier same-day run) |
| Victim | Beatrice Quill (hotel receptionist) |
| Culprit | Captain Ivor Hale |
| Mechanism | Victim's clock minute hand misaligned vs second hand; radio weather report at half past eleven contradicts clock's ten-past-eleven reading; clock wound back forty minutes |
| Ch3 function | Mallory hears the radio tide report; discovers Captain Hale's fingerprint on the clock winding mechanism; confronts timeline contradiction |

---

## 5. Failure Evidence

### 5.1 Six Ch3 attempts in ~100 seconds

```
20:13:05  chat_request  promptHash 5b346c734e2ed831  (attempt 1)
20:13:05  chat_response                               → FAIL (linter)
20:13:05  chat_request  promptHash a17d98841ec5ca73  (attempt 2)
20:13:29  chat_response                               → FAIL (linter)
20:13:29  chat_request  promptHash a935da47c0171f51  (attempt 3)
20:13:51  chat_response                               → FAIL (linter)
20:13:51  chat_request  promptHash dfa1ef8391b93d5a  (attempt 4)
20:14:10  chat_response                               → FAIL (linter)
20:14:10  chat_request  promptHash bf58963a69c09d0b  (attempt 5)
20:14:28  chat_response                               → FAIL (linter)
20:14:28  chat_request  promptHash 17edc21d5df7e5fc  (attempt 6)
20:14:48  chat_response                               → FAIL → exhausted
```

All six LLM responses were structurally valid JSON and completed in 18–28 seconds
each. Rejection was synchronous post-parse — almost certainly the fingerprint /
paragraph-opening linter.

### 5.2 Consistent paragraph-opening pattern across all six attempts

Every Ch3 attempt opened with a close variant of the same sentence:

| Attempt | First paragraph opening |
|---------|------------------------|
| 1 | "The late morning sunlight, muted by a veil of mist…" |
| 2 | "The late morning sunlight, muted by a veil of mist…" |
| 3 | "The late morning light filtered through the curved glass…" |
| 4 | "The late morning light, filtered through the overcast windows…" |
| 5 | "The late morning light filtered through the curved glass…" |
| 6 | "The late morning light, filtered through the overcast windows…" |

Pairs (1,2), (3,5), and (4,6) are near-identical. Even the distinct variants share the
same syntactic pattern ("The late morning [light/sunlight]… cast… scent…").

### 5.3 Within-chapter cross-paragraph fingerprint collisions

Each Ch3 attempt contained 9–12 paragraphs. Inside most attempts, at least two
paragraphs begin with "The late morning…" and two begin with "Mallory's…" or
"The detective's…". The within-chapter fingerprint check detects repeated paragraph
openers and rejects the chapter. Because the prompt is essentially unchanged across
retries (the linter gives no semantic feedback), the model converged on the same
structural shape each time.

### 5.4 Ch2 continuity tail seeding the collision

The **continuityTail** passed into the Ch3 prompt was the last three sentences of Ch2:

> *"As the spring rain intensified outside, the room seemed to close in, the scent
> of damp earth and salt air pressing against the windows. Mallory's thoughts turned
> to the next steps: to question alibis with renewed rigor, to trace the subtle
> fractures in testimony, and to unravel the tangled web of deception woven around
> the victim's final moments. The detective's resolve hardened. Time, once a
> steadfast ally, had become a puzzle demanding careful scrutiny."*

This tail primed the model toward "damp earth and salt air pressing against the windows"
atmospheric phrasing and "Mallory's thoughts…" as a paragraph-opening template — the
exact patterns it kept reproducing in Ch3 paragraph 1 and the repeated interior
paragraphs, triggering the fingerprint linter on each attempt.

---

## 6. Secondary Issues in Checkpoint Prose (Ch1–2)

These problems were locked into the checkpoint before the Ch3 failure and would have
carried forward into the released story:

### 6.1 Role-title phrasing ("the doctor Finch", "the captain Hale")

Appears **8+ times** across chapters 1 and 2. Examples from the checkpoint:

- `"the doctor Finch stepped cautiously into the dimly lit suite"` (Ch1 ¶1)
- `"the doctor Finch straightened, the weight of responsibility settling"` (Ch1 ¶12)
- `"the captain Hale appeared next, his naval bearing unyielding"` (Ch1 ¶6)
- `"Mallory's thoughts drifted to the captain Hale, whose claim"` (Ch2 ¶7)

Same structural defect documented in ANALYSIS_32/33 and in the debrief for run
`mystery-1781198079693` (the successful same-day run that scored 69/100 externally).

### 6.2 Truncated sentences

At least **6 sentences cut off before a closing quote mark** in Ch1–2:

- `"She would have noticed if it were "` (Ch1 ¶5)
- `"I can attest to the "` (Ch1 ¶7)
- `"speaks more clearly than most witnesses ever "` (Ch1 ¶12)
- `"I cannot imagine why anyone would want to disrupt the "` (Ch2 ¶5)
- `"depend on clarity, not "` (Ch2 ¶6)
- `"concealed behind this temporal "` (Ch2 ¶4)
- `"The assumptions that have guided our inquiries until now must be "` (Ch2 ¶4)

Token-limit artefacts. Identical in character to those observed in run
`mystery-1781198079693`.

---

## 7. Root Cause Analysis

### Primary cause — fingerprint linter: no-feedback retry loop

The fingerprint linter rejects chapters with repeated paragraph openers and provides
no textual feedback to the retry prompt. Each retry therefore sends the model the
same instructions, world document, chapter contract, and continuity tail. The model
has no reason to produce a structurally different chapter. Given a Ch3 contract that
demands "Mallory notices the radio tide report → discovers fingerprint on mechanism
→ confronts timeline contradiction", the model reliably produces the same four
paragraph-opening templates.

With 6 retries all failing the same way, the run hits the limit and is abandoned.

### Contributing cause — continuity tail atmospheric recycling

The Ch2 tail embedded "damp earth and salt air pressing against the windows" and
"Mallory's thoughts turned to the next steps" into the Ch3 prompt context. These
phrases acted as strong completion priors, causing the model to open Ch3 with the
same atmospheric setup and then recycle the same sentence structures throughout.

### Contributing cause — narrow chapter contract

The Ch3 contract required exactly three observable events (radio report, fingerprint,
confrontation) in a single 1,000-word chapter. With only three beat requirements and
a highly similar character cast, the model's output space for paragraph openers was
narrow enough that six attempts all converged on the same pattern.

---

## 8. Comparison to Earlier Runs

| Item | Run `1781198079693` (successful) | Run `1781208176181` (this run) |
|------|----------------------------------|-------------------------------|
| Ch3 attempts | 1 | 6 |
| Ch3 linter result | pass | fail × 6 |
| Role-title phrasing | yes ("the doctor Finch") | yes (same) |
| Truncated sentences | 6+ | 6+ |
| Culprit | Beatrice Quill | Captain Ivor Hale |
| Detective | Eleanor Voss | Dr. Mallory Finch (role flip) |
| External score (if story had completed) | 69/100 | n/a (did not complete) |

The role flip is notable: in this run the previous run's culprit (Beatrice Quill)
becomes the victim. The mechanism is also different — minute-hand misalignment plus
radio tide report rather than tidal water clock vs mechanical clock. The Ch3 chapter
function is structurally similar enough that the same fingerprint trap triggered.

---

## 9. Improvement Proposals

These proposals target the Chapter 3 retry loop specifically. General prose quality
fixes are tracked in the debrief for run `1781198079693`.

### P0 - Completion-first fallback on retry exhaustion (likelihood: 10/10)

When Agent9 exhausts retries for a chapter batch, do not abort the run. Commit a
deterministic fallback chapter and continue to later chapters so story generation
always reaches full chapter count.

Goal: prevent regression where prose quality failures terminate the whole run before
story completion.

This does not solve the quality root cause by itself, but it converts a fatal stop
into a recoverable quality-debt event.

### P1 — Inject linter feedback into retry context (likelihood: 9/10)

When the fingerprint linter rejects, pass the specific failing paragraph openers back
to the model in the retry prompt:

> *"Your previous Chapter 3 was rejected because paragraphs 1, 3, and 7 all begin
> with 'The late morning light…'. Rewrite the chapter using different opening words
> for every paragraph."*

This gives the model the semantic signal needed to break the convergence pattern.
Implementation is low-risk and directly addresses the root cause.

### P2 — Strip atmosphere phrases from continuity tail (likelihood: 8/10)

Before injecting the continuity tail into the next chapter's prompt, remove
sentences that contain the overused atmosphere vocabulary list (currently used for
the atmosphere repair pass). This prevents the tail from seeding the next chapter
with the exact phrases the generator most over-uses.

Specifically: strip any sentence containing "salt air", "damp earth", "coal smoke",
"spring rain", "sea fog" from the continuity tail before passing it to Ch3+.

### P3 — Paragraph-opener diversity requirement in chapter contract (likelihood: 7/10)

Add an explicit contract line:

> *"No two paragraphs in this chapter may begin with the same word or the same
> two-word phrase. Beginning a paragraph with 'The' followed by a weather/light
> description is permitted once only."*

This pre-empts the linter rather than reacting to it, and is cheaper than P1 (no
error-path engineering needed).

### P4 — Cross-chapter fingerprint check (likelihood: 5/10)

Extend the fingerprint linter to flag paragraph openers that also appeared in the
two preceding chapters (not just within the current chapter). The Ch3 failure pattern
strongly resembles Ch2's atmospheric paragraph openers, which is the root seeding
issue but currently undetected cross-chapter.

Implementation cost is higher; likely introduces new false-positive failures in
chapters that legitimately need to echo prior ones.

### P5 — Role-title hard-ban in style contract (likelihood: 7/10)

Add to the style hard-ban list:

```
"the doctor [Surname]"
"the captain [Surname]"
"the colonel [Surname]"
```

This fixes the role-title phrasing documented in both this run and the preceding one.
Already proposed in run `1781198079693` debrief (item B3). Low risk, high probability
of fixing a consistent defect across all runs with military or medical characters.

### P6 — Sentence-completion gate (likelihood: 7/10)

Before the fingerprint check, validate that no paragraph ends immediately before a
closing quote with an incomplete sentence (fragment under 8 words, no terminal
punctuation). Trigger a retry on failure. Already proposed in run `1781198079693`
debrief (item C1). Same defect pattern appeared here in Ch1–2 prose.

---

## 10. Summary

Run `mystery-1781208176181` failed because Agent9's Chapter 3 prose generator
produced structurally identical output across six retries and the fingerprint linter
rejected all of them. The immediate trigger was
the continuity tail from Ch2 embedding atmospheric phrases ("damp earth and salt air",
"Mallory's thoughts turned to the next steps") that primed Ch3 toward the same
paragraph-opening templates on every attempt.

The non-negotiable first fix is **P0** (completion-first fallback) so runs complete
even when quality gates fail. The highest-value root-cause fix for this failure class
remains **P1** (high-fidelity linter feedback into retry prompts), but implementation
needs to be fully deterministic and always-on rather than feature-gated or dependent
on optional flags.

The run also preserved two known prose defects in the checkpoint — role-title phrasing
and truncated sentences — that are independent of the Ch3 failure and require
separate fixes (B3 and C1 from the `1781198079693` debrief).

---

## 11. Code-State Verification (As Of 2026-06-11)

This section checks current repository code to determine whether the proposed fixes are
already present, partially present, or missing.

### 11.1 Retry budget and model behavior

- Agent9 default batch retries are **6** (`agent9_prose.generation.default_max_attempts: 6`) in:
	- `apps/worker/config/generation-params.yaml`
- Prose generation temperature is **0.42**, with retry-time escalation for template overlap:
	- `packages/prompts-llm/src/agent9-prose/generate.ts`

### 11.2 Linter feedback into retry prompts (P1 status)

- Strong progress exists: retry feedback now receives structured `linterIssues` and can
	inject banned prior passages when `matchingPriorParagraph` is available.
- Implementation points:
	- `buildEnhancedRetryFeedback(...)` and BANNED paragraph logic in
		`packages/prompts-llm/src/agent9-prose/generate.ts`
	- `matchingPriorParagraph` population in
		`packages/prompts-llm/src/agent9-prose/lint.ts`

**Risk:** the strongest behavior is still behind optional flag
`enableSurgicalFingerprintRetry` (not hard-wired globally).

### 11.3 Early non-convergence stop (critical remaining risk)

- Retry can still terminate before full attempt budget when class repeats:
	- `classifyFailure` / `shouldContinueRetry` in `packages/prompts-llm/src/retry-protocol.ts`
	- abort call site in `packages/prompts-llm/src/agent9-prose/generate.ts`

This is the largest control-plane risk for this failure class.

### 11.4 Continuity-tail priming (P2 status)

- Continuity tail is still injected as raw excerpt into Chapter obligations:
	- `packages/prompts-llm/src/agent9-prose/obligation-block.ts`
- No deterministic stripping of overused atmosphere phrases before injection.

This preserves the same seeding vector that triggered the Chapter 3 convergence loop.

### 11.5 Paragraph-opener diversity (P3 status)

- Partial coverage exists via:
	- opening-style entropy checks (`lint.ts`)
	- structural-pivot mitigation (`retry-protocol.ts` + `generate.ts`)
- But there is no strict deterministic rule of the form:
	- "no repeated first-word / first-two-word paragraph openers within chapter"

### 11.6 Cross-chapter overlap checks (P4 status)

- Already partially implemented:
	- n-gram overlap check with threshold 0.65
	- paragraph fingerprint check
	- prior chapter candidate windows

So P4 is less of a gap than initially assumed.

### 11.7 Completion-first fallback (P0 status)

- Implemented in Agent9 generator:
	- `preferCompletionOnFailure` input (default true)
	- exhaustion path now degrades to deterministic fallback chapter text instead of
		throwing and aborting the run
- Primary implementation points:
	- `packages/prompts-llm/src/agent9-prose/types.ts`
	- `packages/prompts-llm/src/agent9-prose/generate.ts`

This closes the immediate regression risk: prose retry exhaustion no longer has to
terminate story generation before full chapter completion.

---

## 12. Deep Assessment: Will These Changes Fix Root Cause?

| Proposal | Current status | Root-cause impact |
|------|------|------|
| P0: Completion-first fallback | **Implemented** | High for run-completion reliability; converts fatal abort into recoverable quality debt |
| P1: Linter-aware retry feedback | **Partially implemented** | High, but not guaranteed unless surgical path is always enabled and retries are not cut short |
| P2: Continuity-tail sanitization | **Missing** | High; this directly blocks the observed priming loop |
| P3: Opener diversity contract | **Partially implemented** | Medium-high; current entropy checks are softer than deterministic opener constraints |
| P4: Cross-chapter fingerprint checks | **Mostly present** | Medium; useful but not primary blocker now |
| P5: Role-title hard-ban | **Present as soft-ban family text** | Medium for prose quality; not core to retry collapse |
| P6: Sentence-completion gate | **Present** | Medium for quality stability; not core to Chapter 3 convergence |

### 12.1 Net verdict

Current state should be evaluated in two lanes:

1. **Completion lane:** materially improved; P0 now prevents chapter-level retry
	exhaustion from aborting the full run.
2. **Quality lane:** still open; system changes improve detection and guidance but
	**do not yet fully close the root cause** because:

1. The retry controller can still end attempts early on repeated class in non-fallback paths.
2. The continuity-tail seeding vector remains unmitigated.
3. The strongest fingerprint response path is still optional.

---

## 13. Deterministic vs LLM-Oriented Fix Strategy

### 13.1 Recommended architecture split

For this specific failure mode, the correct fix should be **deterministic-first**:

- **Deterministic control-plane:** 70%
- **LLM prompt guidance:** 30%

Rationale: this is primarily a retry-orchestration convergence issue, not a creativity
deficit. The model repeatedly converges because prompt state and context anchors are
too similar across retries.

### 13.2 Deterministic fixes to prioritize immediately

1. **Keep completion-first fallback as default policy** (already implemented).
2. **Do not early-abort template-only repeat classes before a minimum post-escalation pass.**
3. **Make surgical fingerprint retry default-on** (opt-out rather than opt-in).
4. **Sanitize continuity tail deterministically** before injection (remove overused atmosphere
	 phrase families).
5. **On first template-overlap failure, clear assistant-echo anchoring** for the next retry.
6. **Add strict opener uniqueness rule** (deterministic check over first word / first two words
	 for paragraph starts inside the chapter).

### 13.3 LLM-oriented measures (secondary)

Keep and refine current retry directives (BANNED paragraph, structural pivot, explicit
repair scaffolds), but treat them as secondary once deterministic retry-state control
is in place.

---

## 14. Final Recommendation

The strongest one-pass stabilization path is:

- Treat completion as invariant: never fail run completion due to chapter-level prose retry exhaustion.
- Implement deterministic quality controls in Section 13.2 next.
- Keep existing LLM repair directives as augmentation, not primary control.

This should convert the current retry loop from "same prompt state -> same chapter shape"
to a controlled state machine that forces genuinely new candidate structures while
preserving clue and continuity obligations, without regressing completion reliability.
