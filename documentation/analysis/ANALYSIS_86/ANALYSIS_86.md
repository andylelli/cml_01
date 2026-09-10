# ANALYSIS_86 — one hundred ways to spend less and lose nothing (2026-09-09)

Every item below is meant to satisfy the same test: **it reduces cost, time or credit, or raises the
score, and it cannot lower quality or score.** Where an item could only be shown safe by a run, it is
listed as *measure-first* — the measurement is the item, and it is itself free.

Evidence labels follow the CLAUDE.md standard: **MEASURED** (a number from this codebase's own logs
or artifacts), **INFERRED** (follows from a measured fact and the code), **ASSUMED** (plausible, not
yet measured — the item is to measure it).

## STATUS — 2026-09-10

Items carry an inline annotation (`→ **DONE** ...`) recording what was actually built, and where the
item as written turned out to be wrong. **24 of 100 are resolved.** Commits: `f5d5012e` (group A),
`e3fca2de` (23, 31, 69, 71, 77, 94), `cc5d7640` (89, 91, 93, 96-100).

| outcome | items |
|---|---|
| built and tested | 1, 2, 3, 4, 5, 6, 9, 10, 23, 69, 71, 77, 89, 93, 94 |
| built, partial | 31 (detail recorded; the threshold still needs a run), 91 (script yes, auto-hook deliberately not) |
| recorded as a standing rule in CLAUDE.md | 96, 97, 98, 99, 100 |
| WITHDRAWN — the item was wrong | 7 (`maxRetries: 0` is deliberate; both clients wrap chatOnce in withRetry) |
| DEFERRED — could cause the harm it prevents | 8 (a per-deployment limiter doubles the request rate if the deployments share a quota; item 9 is the measurement that settles it) |
| already done before this list | 18, 55 (A_85 F1/F6) |

**Four items in this list were measurably wrong**, which is the reason each was checked before being
built rather than after: item 1 (three of its four error codes were already present; the real gap was
`connection_error` vs the SDK's `"Connection error."`), item 6 (re-deriving geometry on resume would
be incorrect by design), item 7 (withdrawn), and item 69 (the orchestrator half was already fixed —
the live defect was in the replay path). The A_86 numbers they were drawn from stand; the proposed
fixes did not.

**Verification for every commit above:** `build:all` exit 0; llm-client 139, worker 893, prompts-llm
1490, api 10 tests pass; both flag audits clean. A bare `npx vitest run` from the root reports 28
failing FILES — all in `apps/web`, `apps/api` and `scripts/**/*.mjs`, all pre-existing runner
artifacts (the `.mjs` suites are `node --test` files, and the api suite needs the env its own
workspace script sets). Confirmed against commit `47d346b6`, before any of this work.

**The 76 remaining** are unstarted. The highest-value are 11 (regen before the 30k-token retry),
12 (the victim-alive false positive, 3 of 12 retries — needs its measurement first), 24/25 (the polish
prompt and paragraph-scoped rollback, now unblocked by item 23), 53 (3b clock facts at the schema)
and 79-88 (the run summary).

---
## 0. The map the list is drawn from — MEASURED

`node scripts/run-cost-audit.mjs`, five runs to 2026-09-08, mean **£0.60/run**:

| where it goes | share | note |
|---|---|---|
| Agent 9 prose generation (gpt-4.1) | 56% | ~30k prompt tokens per call; 0.6–1.1 retries per chapter (6–11 per 10-chapter run); **49%** of prompt tokens served from cache (295k of 607k, `logs/llm.jsonl`, 22 responses) |
| Agent 9 post-pass polish (claude-opus-5) | 26% | **54% of its output is rolled back** — 39 of 72 calls across the 15 prose artifacts that carry `repairEfficacy`; 4 of 7 in the latest run; rollback reason recorded as `validation_regression` with the regression itself discarded; 0% prompt caching (no `cache_control`); `maxRetries: 0` |
| Agent 9 regen passes (gpt-4.1 / mini) | 7% | ~2k prompt tokens per call, 42% cached |
| everything upstream of Agent 9 | ~8% | Agent 3 12.9k-token prompts, Agent 6.5 21k, all 4.1-mini |
| repeat calls of every kind | 20% (£0.15/run) | zero-repeat floor £0.48/run |

Retry drivers, from the retry-protocol records of the last four run directories (n=12):
`fetch failed` ×2 (a transport error consuming a validation attempt), `VICTIM ALIVE` ×3 (two of them
past-tense characterisation of the victim — "was nothing if not precise", "insisted on cross-checking"),
clue-evidence label vocabulary ×2 (A_85 F5), discriminating-test ×1 (F1), stage-mode ×2 (F2), gender
agreement ×1, final-reveal completeness ×1.

Rate limit: `defaultRetryConfig` is 4 attempts from 1.5 s with a 30 s cap and no `Retry-After` handling.
Run 24901's chapter 10 exhausted that in 14 s against an Azure 429 and fell back to a rejected draft; the
original run had already died on a network error at Agent 3, so the story cost £0.45 + £1.15.

Prompt composition (ch5 request, 89.6k chars ≈ 22k tokens after the record's own overhead): `FROZEN
FACT STATE` 7.2k tokens, byte-identical from chapter 3 onward (cache-friendly); `CHAPTER OBLIGATION
CONTRACT` 2–3k per chapter (volatile); relationship block 2.3k; prior-chapter quality observations 1.5k;
prose requirements 1.5k; fair-play contract 1.7k; system message 1.8k.

---

## A. Transport and resilience — the run must not die, and dying must not cost a rerun

1. **Add `fetch failed`, `ECONNRESET`, `ETIMEDOUT`, `EAI_AGAIN` to `retryableErrors`** in
   `packages/llm-client/src/retry.ts`. MEASURED: "fetch failed" reached the chapter validator as a
   failure and burned a full 30k-token retry in 2 of 12 retries. Risk: none — a transport error is not
   a content error.
    → **DONE, and the item was PARTLY WRONG.** `ECONNRESET`, `ETIMEDOUT`, `EAI_AGAIN` and `ENOTFOUND` were already in `retryableErrors`. Two real gaps were: `fetch failed` (absent), and `connection_error` with an UNDERSCORE, which can never match the SDK's actual `"Connection error."` — that is why the chapter-3 polish call of run 24901 was thrown as non-retryable. Added `fetch failed`, `connection error`, `socket hang up` in `packages/llm-client/src/retry.ts`; 6 tests, including one that pins that content failures are still NOT retryable.
2. **Honour `Retry-After` on 429** in `azure-http-transport.ts` / `retry.ts`. MEASURED: four attempts in
   14 s lost chapter 10 of run 24901. Waiting is free; the fallback that replaced it shipped a rejected
   draft.
    → **DONE.** `parseRetryAfterMs` in `azure-http-transport.ts` (delta-seconds and HTTP-date), carried on `AzureHttpError.retryAfterMs`, honoured by `getRetryDelayMs`. The accompanying test caught a defect in my own parser: `"-5"` fell through to `Date.parse` and clamped to 0, i.e. *retry immediately* — a sanity window (now-60s .. now+24h) now rejects it. 6 tests.
3. **Raise `maxAttempts` for 429 only** (e.g. 8, cap 120 s). Same evidence. The cost of an extra minute
   is zero; the cost of the fallback was the ending mark.
    → **DONE.** `rateLimitMaxAttempts: 8` and `rateLimitMaxDelayMs: 120000` on `defaultRetryConfig`, applied by `isRateLimitError` only. NOTE: the loop bound was `config.maxAttempts`, so raising only the inner check would have been a no-op — the loop now admits the largest budget any class can earn and the per-error check decides when to stop. A non-429 error still stops at 4 (test), and a legacy config without the new fields behaves exactly as before (test). 6 tests.
4. **Never let a transport error consume a *validation* attempt.** In `generate.ts`, catch the client's
   transport error class and re-issue the identical request rather than entering the retry protocol
   (which rewrites the prompt and counts an attempt). INFERRED from #1.
    → **DONE.** `TRANSPORT_REISSUE_BUDGET = 2` in `generate.ts`: a transport failure re-issues the identical request and does NOT consume a content attempt. The predicate is `isTransportFailureMessage`, exported from llm-client and built on the SAME `retryableErrors` list, deliberately — two lists answering "is this the network's fault" would be the WF-002 divergence shape, and this one feeds a WRITE. Bounded, so a genuinely dead endpoint still ends the run.
5. **Persist regenerated stages on resume.** `resume-run.ts:195` says so itself: a second failure resumes
   from the same point. MEASURED: run 24901 paid twice for prose. Write the regenerated artifacts back
   under the resume's own id.
    → **DONE, and the blocking premise was already false.** The old note said the API owns the store writer; `scripts/canary-core.mjs` had persisted artifacts from outside the API since REVIEW_03 item 7. So it was two writers, and the resume path was the one going without. New `apps/worker/src/jobs/json-artifact-store.ts` is that writer ONCE; `resume-run.ts` now passes it to `generateMystery`, and the canary's inline copy was deleted in favour of it — bodies go DOWN while the capability arrives. Safe for resume because `loadResumeBundle` reads through `latestArtifact`, so the regenerated copy is the one restored.
6. **Resume skips Agent 7.5 as "survived"** — but 7.5 is deterministic and free; always re-run it so
   F4's drop and the closure diagnostic apply to the resumed prose. Cost: milliseconds.
    → **DONE, but NARROWED — the item as written was wrong.** Re-running 7.5 wholesale on a resume would be incorrect: `resume-hydration.ts` explains that a contract must belong to the outline that produced it. What is safe is the part that is not a derivation: the A_85 F4 foreign-clock drop is a function of the locked facts and the restored geometry's own time model. It now runs on the restored path, closing F4's stated KNOWN LIMIT.
7. **Polish pass: `maxRetries: 0` on the Anthropic client** (`anthropic-client.ts:104`). MEASURED: one
   `Connection error` on chapter 3 of run 24901 meant no polish for that chapter — the call's cost is
   the same whether it is retried once or skipped, and a skipped polish is a lost improvement. One retry.
    → **WITHDRAWN — the item was wrong.** `maxRetries: 0` on the Anthropic SDK client is deliberate and correct: both clients wrap `chatOnce` in `withRetry`, so the SDK must not retry underneath us. The chapter-3 polish call was lost to the vocabulary gap in item 1, not to this setting. Fixed by item 1; nothing to change here.
8. **Rate-limit the two deployments separately.** The 429 was on `gpt-4.1` while `gpt-4.1-mini` was
   idle; the regen deployment is a different pool (F2 relies on this). Make the limiter per-deployment
   so a prose 429 does not stall regen calls. INFERRED.
    → **DEFERRED, deliberately — it could cause the harm it aims to prevent.** A per-deployment limiter only helps if the deployments hold SEPARATE Azure quotas. If they share one, splitting the limiter doubles the request rate and buys MORE 429s. Nothing in this repo records which it is, so building it now would be a guess against the "no negative consequences" test. Item 9 is the measurement that settles it.
9. **Pre-flight the Azure quota** with one 1-token call at t=0 and print the remaining RPM/TPM headers,
   so a run that will hit 429 at chapter 10 says so before Agent 1 spends anything. ASSUMED (headers
   present on Azure responses) — measure.
    → **DONE, and better than proposed.** No probe call: `readRateLimitSnapshot` reads `x-ratelimit-remaining-requests/-tokens` and the limit headers off responses the run ALREADY pays for, on both the success and 429 paths. Every field optional — a deployment that emits none yields `{}`, never a zero, so an absent header can never read as "quota exhausted". This is the record that unblocks item 8.
10. **Checkpoint prose per chapter to disk during the run** (the checkpoint path exists:
    `agent9CheckpointPath`) and make the canary script pass it by default, so a Windows process abort
    (`0xC0000409`, cited in `run-resume.ts`) costs one chapter, not ten.
    → **DONE.** The canary now passes `agent9CheckpointPath` and `resumeAgent9FromCheckpoint` by default (opt out with `CANARY_AGENT9_CHECKPOINT=0`). The capability already existed and no canary run had ever used it, which is why every Agent-9-stage loss cost the whole stage.

## B. Retry economics — a retry is a 30k-token prompt and +2.43 register points

11. **Send the cheap regen before the expensive retry** for defect classes that have a regen (missing
    clue, missing resolution, culprit link, suspect elimination, aftermath repeat): a 2k-token edit-list
    regen first, the 30k full-chapter retry only if it fails. MEASURED: regen calls average 2k tokens vs
    30k; INFERRED that ≥2 of 12 retries (clue evidence) were regen-shaped.
12. **Victim-alive detector: exempt simple-past characterisation** ("was nothing if not precise",
    "insisted on cross-checking every delivery") when no present-tense or progressive verb follows.
    MEASURED: 2 of 3 VICTIM ALIVE retries in the sample are of this shape. Measure over the corpus first
    (count of flagged sentences with no present/progressive verb) — the item is the measurement, then the
    exemption behind a flag.
13. **Gender-agreement retry ("both women" in a paragraph with a man)**: route to the pronoun regen
    channel (A_66 P3, 1 paragraph) instead of a chapter retry. One retry in the sample.
14. **Final-reveal completeness**: the failure names two missing elements (motive, opportunity); the
    reveal-repair regen (`runRevealRepairRegenPass`) exists. Route there first.
15. **Retry with the failing paragraphs only in the negative example**, not the whole rejected draft.
    The retry protocol already says "use failed draft as negative example only" — measure the token
    delta of sending 3 paragraphs instead of 30. INFERRED saving ≥3k tokens per retry.
16. **Cap retries at 2 for `template` class** (a lint-only class with a deterministic de-templating
    floor) — the third attempt adds abstraction (A_75) and the floor would run anyway. MEASURED: 2 of 12
    retries were `template`.
17. **Make `class: unknown` impossible**: every retry record should carry a class; 4 of 12 did not, so
    they cannot be routed to a cheaper channel. Instrumentation, zero risk.
18. **Stop the DT check's mandated re-proof** — done (F1). Listed so the count is honest: it was 1 of 12.
19. **Stop the stage-mode whipsaw on chapter 10** — F2 repairs the draft; the remaining lever is to
    exclude chapter 10 from the DT key-term requirement entirely once F1 has confirmed the test on the
    page (already the effect of F1 when chapter 8 staged it).
20. **A_80 F3 regression guard restores the first attempt when a retry loses facts** — extend it to
    restore when a retry gains a *lint* hit but loses no fact, so a lint-only retry can never ship a
    worse chapter. Zero cost; measure how often it would fire.
21. **Retry temperature escalation** (0.42 → 0.86 on Agent 9) increases abstraction on the retried
    chapter. Measure register on attempt 1 vs attempt 3 across the corpus (`prose_fingerprints` and the
    prompt log carry both) before keeping the escalation; if it does not raise pass rate, freeze it.
22. **Batch-of-one prose (`proseBatchSize: 1`) is the cheapest failure unit** — keep it; but the
    per-chapter *system* message (1.8k) is resent 10–21 times per run. It is run-stable and cached
    (49%), which is why this is not item 1.

## C. The polish pass — 26% of spend, 54% discarded

23. **Record the regression that rolled the polish back.** `post-pass-polish.ts:350` discards
    `validated.hardErrors`; record `hardErrors[0]` in the `repairEfficacy` ledger. Until then every fix
    below is a guess. Zero cost.
    → **DONE — and it was the enabler, as expected.** `PolishResult.rollbackDetail` now carries the FIRST validator error the polished candidate introduced (`post-pass-polish.ts`), the ledger reason becomes `validation_regression: <the actual check>`, and it is logged. Until now the regression was computed, used for the decision, and dropped — which is why items 24/25 could only be guesses. The next run's ledger answers them from evidence.
24. **Feed the polish prompt the exact checks it regresses on.** The prompt carries a LOCKED STORY
    CONTRACT and cast names; if the regressions are pronoun, victim-alive or gender agreement (the
    retry drivers), add those three rules verbatim. INFERRED from B12–B13; confirm with C23.
25. **Paragraph-scoped polish with paragraph-scoped rollback.** Today one regressing sentence discards
    the whole chapter's polish (~£0.064). Ask for an edit list per paragraph and roll back only the
    offending paragraph. MEASURED waste: ~£0.15–0.26 per run.
26. **Skip polish on chapters the fallback produced** (rejected drafts): polish on a chapter that already
    failed validation regresses by construction. Check `fallbackTelemetry` before polishing.
27. **Anthropic prompt caching on the polish system prompt** (`cache_control: ephemeral` on the stable
    prefix). 4.4k-token prompts, ~2k stable: small (~£0.005/call) but free.
28. **Measure Sonnet vs Opus for polish on a matched pair** (`RESUME_REDO=prose` + `REPLAY_CAPTURE_PROMPTS`)
    before assuming Opus is required; the keep rate (46%) is the number to beat, not the prose. This is
    a measurement, so it is safe; switching is not, until it is measured.
29. **Polish only chapters that passed first time.** `AGENT9_POLISH_RETRIED_CHAPTERS` is already OFF; keep
    it OFF (retried chapters carry the abstraction the polish then polishes).
30. **Do not polish a chapter twice** across resume: the resume re-polished chapters whose polish had
    already been kept in the original run. Persist the "kept" flag with the chapter (see A5).
31. **Make `quality_no_gain` a recorded number, not a reason string** — what score delta counts as
    gain — so the threshold can be tuned from data.
    → **PARTLY DONE.** The reason string is no longer a bare class — it carries the detail (item 23). The `quality_no_gain` threshold itself is unchanged and still needs a run's ledger to tune, which item 23 now makes possible.
32. **Polish rollback should keep the *validator-clean* paragraphs of the polished version** — a merge,
    not a discard. Same as C25 stated from the other side.

## D. Prompt size and caching — 30k tokens per prose call, half cached

33. **Order every run-stable block before every chapter-stable block** — `AGENT9_PROMPT_PREFIX_ORDER` is
    ON and the hit rate is 49%. Measure which 'chapter'-tier blocks are actually byte-stable across
    chapters (the FROZEN FACT STATE was, from chapter 3) and promote them to 'run' tier. Free.
34. **Chapters 1–2 break the cache** (FROZEN FACT STATE hashes differ for ch1, ch2, then stabilise).
    Find the two facts that change and emit them in a separate volatile block.
35. **Trim `PRIOR CHAPTER QUALITY OBSERVATIONS` (1.5k)** to the observations that changed since last
    chapter; the rest is already in the cached prefix. Measure delta.
36. **The relationship block (2.3k) is run-stable** — verify it sits in the 'run' tier; if it is
    emitted per chapter after volatile content it is paid uncached ten times.
37. **Deduplicate the two "CHAPTER OUTCOME CONTRACT (MANDATORY)" headings** (316 + 124 tokens) — one
    contract, stated once.
38. **Drop the prompt-record overhead from the token count** the budget uses; the budget should count
    what is sent, and the record's own headers are not sent. Accuracy only.
39. **Cap `FROZEN FACT STATE` descriptions at the fact, not the paragraph**: 7.2k tokens for ~7 facts
    plus world state means most of it is prose about the facts. Measure what Agent 9 actually cites.
40. **Emit the clue-obligation contract as ids + one line each**, not the full clue records — the
    contract is 2–3k per chapter and the model is asked for countable things, not descriptions.
41. **Stop resending the whole cast profile bundle to late chapters** for characters who have no scene
    in the batch (the first-appearance contract already scopes to who appears).
42. **Measure the prompt token ceiling's actual use**: `AGENT9_PROMPT_TOKEN_CEILING=56000` was raised
    from 40000; the ch5 prompt is ~22k. If nothing approaches the ceiling, the caps machinery costs
    diagnosis time for nothing — leave the ceiling, delete the diagnosis of caps that never fire.
43. **Agent 6.5 world builder: 21k-token prompt, one call** — it re-receives the CML, profiles and
    locations it could reference by id. Measure what its output uses.
44. **Agent 3 CML: 12.9k-token prompt, ~1.3 calls per run** — its seed-pattern and diverge-from lists
    grow with the corpus ("diverging from 20 recent runs"); cap the diverge-from list at the 12 nearest
    by axis (the merge already reserves three seed slots).
45. **Cache the Azure `usage.cachedPromptTokens` per agent in the run summary** so every run reports its
    hit rate; today the number lives only in `logs/llm.jsonl`.

## E. Shadow and telemetry calls — paid, non-gating

46. **`RubricScorer` (shadow) failed on HTTP 400** in run 24901 and produced nothing: gate the call on a
    pre-check for content-filter triggers, or run it against the blind-reader retry framing
    (`AGENT6_BLIND_READER_REFUSAL_RETRY` exists). Otherwise the call is paid and wasted.
47. **`RUBRIC_SCORING_MODE=off` when credits are low** — the number is a health signal only (the rubric
    cannot rank two books, n=8). Zero score effect by construction.
48. **`Agent9-FullStoryDiagnostic` (shadow, 15k-token prompt, 2% of spend)**: run it only on runs that
    will be read externally (the pre-registered ones), not on every probe run.
49. **`NoveltySkeletonJudge` (shadow)**: it has never gated; the deterministic skeleton is always
    "distinct". Off by default until the LLM audit is compared to the deterministic one.
50. **Agent 6 blind reader**: two HTTP 400s in run 24901 before the retry landed. Count refusals per
    run in the summary so the retry flag's value is visible.
51. **Atmosphere repair returned 0 replacements in 44% of calls** (35 of 80). Cheap (£0.001), but each
    is a round trip: skip the call when the "present phrase" list has one entry that a deterministic
    synonym table can replace.
52. **Print a "shadow spend" line in every run summary**: the sum of calls that gate nothing. It was
    ~4% here; it should be a known number, not a discovered one.

## F. Upstream agents — small money, large leverage on what Agent 9 must repair

53. **Agent 3b: forbid clock-typed locked facts on a non-temporal axis, at the schema.** MEASURED: 17 of
    17 stored non-temporal cases have a clock-locking primary device and 0 of 17 hold any non-clock
    device; X39 fires on 5 of 15 (F4's reach) and the other 10 adopted the device's clock. This is the
    root of the timing mark. It is a prompt-and-schema change verified by the artifact, not a run.
54. **Agent 3b: return five devices, keep one** — the other four are generated and paid for every run
    and never used (all five lock clocks; the re-rank found nothing to prefer). Generate two.
55. **Agent 2: shared histories name one event** — done (F6). Measure the detector rate on the next
    cast artifact.
56. **Agent 2 retries (6 calls over 4 runs)**: the retry reasons are schema/name-collision; the
    `--fresh-names` generator already guarantees distinct initials — pass that guarantee to the
    checker so it stops re-asking for it.
57. **Agent 7 outline: the discriminating-test scene index** — the coordinate mismatch (WF-001) means
    the geometry contract and the outline disagree on where the test is; emit the test's scene by
    *ordinal within act*, the reconciliation `clearance-ownership.ts` already performs.
58. **Agent 5 clue `pointsTo` is inference vocabulary** ("pressure, discrepancy, suggests"); ask Agent 5
    for `observable` as the on-page thing and `pointsTo` as the conclusion, explicitly, so F5's union
    rule has clean inputs.
59. **Agent 4 revision (2 calls, 5k completion each)** runs even when Agent 3's CML validated first
    time. Skip when `validation.valid` and no logic warnings.
60. **Agent 2c location profiles (5k completion)**: profile only locations the outline uses; the outline
    is built after — reorder so 2c runs after 7 for the locations 7 chose, or cap 2c to the preset's
    canonical rooms.

## G. Post-passes and floors — deterministic writes that readers quote

61. **Locked-fact floor: never inject where the LLM regen found no target chapter.** INFERRED (the
    tide facts were injected with no regen label): align the floor's target search to the regen's
    ≥2-description-token gate, F1-style. With F4 the tide case is gone; the rule still guards the next.
62. **Every floor sentence is registered and recognised as shipped** — the "You did it" pattern was
    blind to its own curly quote (A_85). Add a test that runs every builder's specimen through the
    typography fold before matching. Zero cost.
63. **Clue floor: use the observable, never the description**, when pasting — the paste "Pressure
    discrepancy suggests entry forged genuine" is the description label. F5 stops the paste in the
    measured case; this stops the *label* in the remaining ones.
64. **Delete the floor sentence when a later LLM pass restates the same fact** (the A_84 F1 rule for
    the locked-fact floor, extended to the clue floor): a book-scoped presence check before shipping.
65. **The atmosphere-repair clause guard** — done (F3). Extend the same guard to the scaffold regen's
    edit list (`AGENT9_REGEN_EDIT_LIST` splices paragraphs verbatim; check it cannot splice mid-sentence).
66. **`detectFinalChapterVerdictEnding` is MEASURE-only** and fires on the last paragraph; now that the
    culprit floor stands down (A_85), promote it to a ship-check that moves, not rewrites, the paragraph.
67. **Clearance trim budget = 0 when geometry is absent** — already; add the same "budget 0" rule for a
    chapter the fallback produced (a rejected draft should not be trimmed into a different rejected draft).
68. **Repair passes should skip chapters they cannot change**: the scaffold regen ran three passes on
    chapter 8 of run 24901 after the atmosphere repair had already mangled the sentence (F3). Order:
    guard first, regen second.

## H. Quality-only fixes that cost nothing — measured dead channels

69. **The positive seed-exemplar channel is dead**: `loadSeedCMLFilesCached(EXAMPLES_ROOT)` is handed the
    workspace root, not `examples/`, and loads 0 files (14 exist). One path. MEASURED (A_77).
    → **DONE, and the item was STALE in its main half.** MEASURED against the built loader: `<workspaceRoot>/examples` -> 14 seed files, `<workspaceRoot>` -> 0, `<workerAppRoot>/examples` -> 0. The ORCHESTRATOR path A_77 reported is already fixed (`runtime-paths.ts` joins "examples" onto the workspace root, and it loads all 14). The live defect was in `agent9-replay.ts`, which had its own join onto `workerAppRoot` — a directory that does not exist — so every replay ran with an empty seed corpus while the run it replayed had a full one. Fixed there.
70. **`AGENT9_GROUNDING_LEAD=0` is right** — the prepend wrote templated openers; keep it off and delete
    the "coverage below target (0/10)" gate warning that fires on every run and means nothing.
71. **Scene-grounding coverage warning** — same: a warning that fires on 100% of runs is an off switch
    with extra steps (B1). Remove or make it conditional on the lead being enabled.
    → **DONE.** The release gate reported `scene-grounding coverage below target (0/10)` on every run. That coverage is produced by the grounding-lead prepend, and `AGENT9_GROUNDING_LEAD=0` has been the settled setting since A_82 P9 — so the gate reported the absence of a feature nobody wants as a defect of the manuscript, always. It now fires only when the lead is actually enabled, where a low number is a real finding; otherwise it logs at info. Not deleted: it is the only reader of that telemetry.
72. **The provenance yaml must never be regenerated** — the generator now refuses (e573f1db). Add the
    seed to the story folder's filename so a read can be joined to its parameters without the yaml.
73. **Cast pronouns are a locked fact** — `pronoun_policy: verify` means the sweeps are dead; delete the
    four dead sweeps (348 lines) so nobody re-enables them "to tidy" (they corrupt 213 of 387 chapters).
74. **Novelty ledger: the diverge-from list omits runs that failed** — run 1 of seed 91375 never entered
    the corpus, so run 2 was not steered away from it. Record the CML of failed runs too; it costs nothing.
75. **`chatgpt-review.txt` ingestion**: a script that parses the category table into the external-read
    ledger at read time (`eval/results/external-read/manifest.json`) instead of by hand — the 11
    September reads were parsed by a probe in this session; make it the tool.
76. **The story angle reaches Agents 1, 2, 2e, 3b, 3 — not 6.5 or 7.** Pass `storyAngle` to the world
    builder and outline too; both invent scenes and neither knows the world the cast was built from.
77. **Fresh-names exclusion is 3 runs; the reviewer reads consecutively** — raise to 5 (24 of 28
    consecutive books shared a full name before A_84 #2).
    → **DONE.** `--fresh-names` default 3 -> 5. Three was chosen for no measured reason; the number that matters is how many books back a consecutive reader remembers a name, and 24 of 28 consecutive books shared a full cast name before the exclusion existed (A_84 #2). Pools are 24 surnames / 32 given names and the generator already warns and falls back rather than failing. `--fresh-names 0` still replays a pre-2026-09-07 file byte-identically; `--self-test` passes.
78. **Retire `AGENT9_LOCKED_FACT_ALIASES` and other falsified flags** from `.env.local` into the
    audit's recommended-against section — each is a line the next reader must evaluate.

## I. Instrumentation — every one is free and turns a guess into a number

79. **Run summary prints: cost, cache-hit rate, retries by class, regen outcomes by kind, polish
    kept/rolled back with reasons, floor injections by builder, fallbacks by chapter.** Today these are
    in five places or nowhere.
80. **Per-chapter cost line** (prose + retries + regen + polish) — the £ of a chapter that fell back.
81. **Record the first `hardError` of every rollback and every retry in the artifact** (C23).
82. **Log the deployment and the `Retry-After` value on every 429.**
83. **Persist `repairEfficacy` for every run** — only 15 of 40 prose artifacts carry it.
84. **A `shadow_spend` counter** (E52).
85. **A `wasted_tokens` counter**: tokens of calls whose output was discarded (rolled-back polish,
    0-replacement repairs, rejected drafts that a fallback did not ship).
86. **`cachedPromptTokens` on Anthropic responses** — the client sets nothing and reads nothing; add both.
87. **Retry-record class on every retry** (B17).
88. **A one-line `RUN_SEED=` echo at the top of every log** so a log can be joined to its yaml.

## J. Dev loop — time is credit too

89. **`npm run build:all` rebuilds 14 packages for a one-package change** (~4 min). Build the changed
    package and its dependents only (`tsc -b` with project references).
    → **DONE.** `npm run build:changed` — `scripts/build-all.mjs --changed` skips packages whose dist is newer than their src and builds the first stale one plus everything after it. ORDER is already topological, so "everything after" IS the downstream set; deliberately blunt, because an over-build costs seconds and an under-build ships a stale dist to the worker. VERIFIED: all-fresh skips everything; touching `story-geometry` (mid-ORDER) builds 9 of 16 in 57s instead of ~4 min. The default and `pretest` are unchanged.
90. **Vitest: 339 test files; run the touched package's suite by default**, the full suite in CI.
91. **`flags:check` and `flags:runtime` as a pre-commit hook** — both are seconds and both have caught
    no-op levers.
    → **PARTLY DONE — script yes, automatic hook deliberately not.** `npm run verify:flags` runs both audits in one command (seconds). An automatic pre-commit hook was NOT installed: it would slow every commit for the other session working on this branch, and a hook that blocks a commit is a bad surprise to install on someone else's behalf. Left as a one-command opt-in.
92. **Prompt-capture harness as a CLI** (`REPLAY_CAPTURE_PROMPTS` exists): `npm run capture -- --agent
    Agent2` so a lever is verified by its prompt in one command, not a scratch script.
93. **A `probe` directory with the replay probes from A_84/A_85** (culprit link, DT check, clue pool,
    X39 reach) checked in, so the next reader replays them instead of rewriting them.
    → **DONE.** The two A_85 replay probes are checked in as `scripts/probe-clue-presence-pool.mjs` and `scripts/probe-x39-reach.mjs` with `npm run probe:clue-presence` / `probe:x39-reach`, joining the existing `probe:*` family. Both run green against the stored corpus, so the next reader replays them instead of rewriting them.
94. **Delete the CRLF/LF mix** (`git warns on every commit`): one `.gitattributes` line.
    → **DONE.** `.gitattributes` added: `* text=auto eol=lf`, CRLF kept for `.bat`/`.cmd`/`.ps1`, binaries marked. Every `git add` in this repo printed a warning per file, which trains the reader to ignore git's output — the one place a real warning would show.

## K. Runs and reads — the expensive instrument

95. **Pre-register every paid run** (already a CLAUDE.md rule) — and add the *falsifier* line to the
    summary the run prints, so the read is scored against it.
96. **Read the matched pair, not the single run**: `RESUME_REDO=prose` costs the prose stage only
    (~£0.45) and settles a prose-side lever; a fresh run (£1.15) settles nothing about a prose lever.
    → **DONE (CLAUDE.md).** Recorded as a standing rule: prefer `RESUME_REDO=prose` (~£0.45, one stage against a byte-identical upstream) to a fresh run for any prose-side lever.
97. **Do not spend a read on a fallback book**: if any chapter fell back, resume that chapter (A5/A10)
    before sending the book out — a read of a rejected draft measures the fallback, not the pipeline.
    → **DONE (CLAUDE.md).** Recorded: never spend a read on a book with a fallback chapter — it measures the fallback, not the pipeline — with the exact log strings to grep for.
98. **One read per lever, not one lever per read**: bundle levers that touch different chapters (the
    A_85 series touches ch1, ch8–10 and the timeline) so one read can score each by category.
    → **DONE (CLAUDE.md).** Recorded: bundle levers that touch different chapters so one read scores several by category.
99. **Authority, spatial, behavioural have 0–1 external reads** — choose the next seeds by axis, not at
    random, until each axis has three; a mark on an unread axis is worth more than a fifth temporal mark.
    → **DONE (CLAUDE.md).** Recorded: choose the next seed by axis until every axis has three reads; authority/spatial/behavioural have 0-1 each.
100. **Stop when the reader's list is the injector list** — the last four reads' "generator lines" were
     all ours (A_84, A_85). When a read names no injector, that is the signal to spend on prose levers;
     until then every read is an injector audit and should be scored as one.

---

## What to do first (my order, by £ per hour of work)

| # | item | evidence | expected |
|---|---|---|---|
| 1 | A1 + A2 + A3: transport errors retry, 429 waits | MEASURED | no more fallback endings from rate limits; no £0.45 re-runs from `fetch failed` |
| 2 | C23 → C24/C25: record the polish regression, then scope the rollback | MEASURED 54% discarded | ~£0.15–0.26 per run recovered, no quality change |
| 3 | B11: regen before retry for regen-shaped classes | MEASURED 2k vs 30k | 2–4 fewer 30k retries per run, less abstraction |
| 4 | A5: persist regenerated stages on resume | MEASURED | a second failure costs one stage, not a run |
| 5 | F53: no clock facts on a non-temporal axis, at 3b | MEASURED 17/17 | the timing mark's root, before any prose is bought |
| 6 | I79–I88: the summary line | free | every later decision measured instead of found |

Nothing above changes a model, a temperature, or a prompt operation the reader has scored well. The
items that could — polish model (C28), temperature escalation (B21) — are listed as measurements only.
    → **DONE (CLAUDE.md).** Recorded: while a read still quotes our own template sentences it is an injector audit and should be scored as one, not as evidence about prose.
