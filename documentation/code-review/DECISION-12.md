# Owner decision 12 — the six owner CRs (CR-07, 28, 29, 30, 32, 34)

**Started 2026-10-01.** The owner's instruction: "for the rest go with the recommendations" (OWNER-DECISIONS §12).

| CR | Recommendation (§12) |
|---|---|
| CR-07 | Batch the verified bugs in non-v1 agents behind ONE flag (default OFF) and read one matched pair |
| CR-28 | Decide STORY TO DATE first (A9P-Q01); v1 (decision 1) |
| CR-29 | Follows decision 7 |
| CR-30 | Retire vanity scorers, unreachable retry path, patch engine (after its offline replay), unwired modules |
| CR-32 | Per-agent overrides outrank the tier (ORC-Q07) |
| CR-34 | After CR-29 |

Method: each item was re-audited against the current code (three read-only agents, 2026-10-01), because decisions
1, 7 and 8 deleted much of what the items describe. An item is **moot** when the code it describes is gone (evidence
in its row), **done** when built and verified, **deferred** with a reason.

## Plan

1. **CR-30** retire dead code (no prompt change; replay must MATCH).
2. **CR-32** per-agent override outranks the tier at every explicit-model site (no model changes under today's env).
3. **CR-07 + CR-29 batch** — every verified fix that changes a prompt or an outcome on the default path goes behind ONE flag, `CML_VERIFIED_FIXES` (OFF), so one matched pair can read them together (the §12 recommendation). Fixes confined to an already-OFF arm or byte-identical go in unflagged.
4. **CR-28 / CR-34** last.

## STATUS

| Item | CR | Status | Commit | Note |
|---|---|---|---|---|
| A5-10 | CR-28 | deferred |  | CR-28: every-run prompt change, non-prose savings; needs a probe |
| A5-11 | CR-29 | done | 55448eb5 | behind CML_VERIFIED_FIXES: every Agent 5 regeneration carries strictContract + lockedFacts (agent5/contract-payload.ts). Only the red-herrin |
| A5-16 | CR-28 | deferred |  | CR-28: every-run prompt change, non-prose savings; needs a probe |
| A5-D04 | CR-29 | done | 55448eb5 | behind CML_VERIFIED_FIXES (as A5-11) |
| A5-D05 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: suspect coverage re-runs after a floor regeneration |
| A5-Q02 | CR-07 | done | 55448eb5 | DECIDED (decision 12, review's R2 recommendation): meridiem needs a clock number; also fixed 'a.m.' never matching; still behind AGENT5_MERI |
| A5-Q03 | CR-28 | deferred |  | CR-28: every-run prompt change, non-prose savings; needs a probe |
| A5-Q06 | CR-30 | done | 4bd53121 | flag + 6 branches retired |
| A6-02 | CR-29 | done | 55448eb5 | failure-derived phrases first (≤8), then the contract lines, cap 16 — on the retries-on arm only |
| A6-03 | CR-29 | done | 55448eb5 | outer half moot (decision 7) and dead branch deleted (4bd53121); inner retry text classified behind CML_VERIFIED_FIXES |
| A6-16 | CR-34 | deferred |  | k=1 default; audit→read data dependency; provisional audit waits on A6-Q01 |
| A6-17 | CR-28 | deferred |  | CR-28: every-run prompt change, non-prose savings; needs a probe |
| A6-D02 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: break-moment default via the role predicates |
| A6-D08 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: no duplicate contradiction backstop clue |
| A6-Q02 | CR-29 | done | 55448eb5 | DECIDED (decision 12, review's recommendation): behind CML_VERIFIED_FIXES a World Builder failure degrades to degradedWorldDocument with an  |
| A6-Q03 | CR-34 | deferred |  | waits on A6-Q01 |
| A6-Q04 | CR-32 | done | 69ed426b | AGENT6_MODEL effective; separate labels not built |
| A7-D01 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES (OFF): Agent 7's case summary reads CML 2.0 — victim via isVictimMember, motive = culprit's motive_seed, culprit a |
| A7-D02 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: retry fills missing act purposes (fillMissingActPurposes) |
| A7-D05 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: committed outline schema-validated, warn-only |
| A7-D09 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: gate-mode repairs re-persist the outline |
| A7-Q01 | CR-30 | done | 4bd53121 | OFF arm retired at 7 sites |
| A7-Q03 | CR-30 | moot | c5423dfd | A7-01 done; scheduler unwired |
| A7-Q05 | CR-07 | todo | | |
| A34-05 | CR-30 | done | 4bd53121 | patch engine deleted |
| A34-08 | CR-07 | done | ecb12773 | behind CML_VERIFIED_FIXES: Agent 4's Mystery Axis line prints primaryAxis (R0 step skipped: it saves no tokens) |
| A34-09 | CR-29 | done | 55448eb5 | theme families ignore appended retry feedback (themeWithoutRetryFeedback); byte-identical without feedback |
| A34-14 | CR-28 | deferred |  | CR-28: every-run prompt change, non-prose savings; needs a probe |
| A34-D03 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: gender by the member's own name |
| A34-D04 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: cast paired by name; extras kept with a note (unnamed extras dropped with a note) |
| A34-D10 | CR-07 | wip | 5aeaf992 | the normaliser's victim test is a decision-2 site (resolveIdentity, shadow); fixed when CML_IDENTITY_ROLE_WINS flips |
| A34-D11 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: the two contradicting rules now say Agent 5 back-fills evidence_clues (known positive: flag-on replay diverges he |
| A34-D12 | CR-29 | done | 55448eb5 | behind CML_VERIFIED_FIXES: post-repair validation returned with the repaired CML |
| A34-D13 | CR-32 | done | 69ed426b | override outranks tier |
| A34-Q03 | CR-30 | done | 4bd53121 | offline 0/2 fixed; retired |
| A34-Q05 | CR-32 | done | 69ed426b | override outranks tier |
| A1X-10 | CR-29 | done | 0ca80a5f | behind CML_VERIFIED_FIXES: backfill before a paid re-roll; the runner delegates to the one backfillSetting |
| A1X-11 | CR-28 | deferred |  | CR-28: every-run prompt change, non-prose savings; needs a probe |
| A1X-15 | CR-30 | wip | 4bd53121 | 2 of 3 parts; no-names branch deferred (public input, 14 test calls) |
| A1X-D01 | CR-07 | done | 55448eb5 | Agent 2's victim fallback through resolveIdentity("agent2.victim") — shadow until CML_IDENTITY_ROLE_WINS flips |
| A1X-D03 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: Agent 8 summariser reads CML 2.0 |
| A1X-D04 | CR-07 | done | 2ad12d6c | owner decision 10 |
| A1X-D06 | CR-32 | done | 69ed426b | override outranks tier |
| A1X-D10 | CR-29 | done | 55448eb5 | the re-roll warning says what it does (same prompt) |
| A1X-D11 | CR-07 | done | 55448eb5 | behind CML_VERIFIED_FIXES: 2b pairs profile and cast member by name |
| A1X-Q03 | CR-07 | done | 2ad12d6c | owner decision 10 |
| A1X-Q05 | CR-30 | done | 4bd53121 | F5b + realism belt deleted |
| A1X-Q06 | CR-30 | todo | | |
| A1X-Q07 | CR-29 | done | 55448eb5 | DECIDED (decision 12, CR-29): behind CML_VERIFIED_FIXES legacy Agent 2 repairs deterministic misses without a blind re-roll |
| ORC-14 | CR-32 | done | 69ed426b | override outranks tier |
| ORC-D01 | CR-07 | moot | 03c4f5d3 | executeAgentWithRetry and abortCritical deleted (decision 7) |
| ORC-D11 | CR-07 | done | 4bd53121 | byte-identical |
| ORC-Q07 | CR-32 | done | 69ed426b | override outranks tier |
| SCO-01 | CR-30 | done | 51f0d14a | owner decision 8 |
| SCO-Q05 | CR-30 | done | 4bd53121 | deleted |
| A6-Q01 | CR-29 | todo | | reopened: the withdrawal was wrong (see Agents 5/6 audit) |

## Audit — Agents 3, 4, 7 (read-only agent, 2026-10-01, ~153k tokens, 57 tool uses)

All MEASURED against current src unless marked.

- **A7-D01 live.** `agent7-narrative.ts:288,291` read CML-1.x `setup.crime.*` → "Victim: Unknown", "Unknown motive"; culprits fall into the Witness list (`:298-316`); the victim lookup `:570-577` searches an absent `legacy.cast`. Fix changes Agent 7's prompt on every run (A7-Q05's probe).
- **A7-D02 live.** The schema-repair retry (`agent7/generate.ts:103-136`) skips the act-purpose fill that `normalizeRawOutline` does on attempt 1 (`agent7/normalize.ts:289-299`) → abort at `:136`. Deterministic.
- **A7-D05 live.** Only `generate.ts:87,132` validate; outlines adopted by scene-count, coverage, clue-pacing (×4) and completeness routes are never schema-validated. Deterministic (warn-only).
- **A7-D09 live (gate mode only).** Outline persisted at `mystery-orchestrator.ts:585` before `runAgent75` mutates it (`agent75-run.ts:325-327`); never re-persisted; resume returns early (`:263`). Default `shadow` unaffected.
- **A7-Q01 open.** `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` default ON, own parse idiom (`stage-runner.ts:45-53`); seven OFF arms never exercised.
- **A34-05 / A34-Q03.** Patch engine `agent4-patch.ts` (403 lines) reached only via `CML_REPAIR_MODE=patch|shadow` (default `rewrite`, unset in `.env.local`). Its real proposer is an LLM (`makeLlmPatchProposer`), so a true offline replay is impossible (INFERRED: nothing recorded — it has never fired); only a heuristic-proposer dry run is free.
- **A34-08 live.** `agent4-revision.ts:318` prints `originalPrompt.user.substring(0,200)` as "Mystery Axis"; `agent6/structural-retry.ts:254-288` builds the whole Agent 3 prompt to supply it.
- **A34-09 partly.** Scorer-feedback pollution moot (decision 7); two theme-family derivations remain (`agent3b-hard-logic-devices.ts:393,666`) on `inputs.theme`, which the plausibility regenerate path extends with feedback; default (`AGENT3B_PLAUSIBILITY_JUDGE=shadow`) never regenerates.
- **A34-14 live.** Rule 4 states `required_evidence` twice (`agent3-cml.ts:544-553`); seed early (`:497`); `buildCMLPrompt` inline (`:325-956`).
- **A34-D03 live.** `cml/normalize.ts:223-246` takes `existing = castArray[index]` but genders it by the INPUT name at that index.
- **A34-D04 live.** `normalize.ts:222-224` maps over `inputs.castNames`: extras dropped, missing padded, by position.
- **A34-D10 live at default.** `normalize.ts:279` substring `roleIncludes(…["victim"])`; decision 2's `resolveIdentity` keeps the old verdict while `CML_IDENTITY_ROLE_WINS` is OFF.
- **A34-D11 partly.** Skeleton says `evidence_clues: []  # Agent 5 back-fills` (`agent3-cml.ts:740-742`) while `:574,:903` require non-empty. Normaliser-defaults half moot (decision 5).
- **A34-D12 live.** `agent3/cml-acceptance.ts:248-256` returns the pre-repair validation when revalidation fails; it feeds degrade warnings and the abort decision.
- **A34-D13 / A34-Q05.** Agent 4 (`agent4-revision.ts:517-531`) and the patch proposer pass no model; design deployment is commented out in `.env.local`, so no effect today (INFERRED).

## Audit — Agents 5, 6, 6.5 (read-only agent, 2026-10-01, ~190k tokens, 59 tool uses)

**Correction found:** the ledger's withdrawal of A6-Q01 (written in this programme) was wrong — A6-02 and A6-03 sit on
Agent 6's own `AGENT_PRE9_ENABLE_LLM_RETRIES` arm and the World Builder's own loop, neither deleted by decision 7.
A6-Q01 is reopened. That arm is unset in `.env`/`.env.local` and defaults OFF (`stage-runner.ts:30-31`).

- **A5-10 live.** Proactive first-pass feedback changes 0 bytes; because every call passes feedback,
  `isFirstAttemptPrompt` (`agent5-clues.ts:870`) is never true, so two first-attempt lines never ship. `status` unread;
  `audit` overwritten by `reconcileModelAudit`. `inference` IS read by `buildCaseModel` (report-only, AGENT3_CASE_LOGIC).
- **A5-11 / A5-D04 live.** Only the first payload carries `strictContract`/`lockedFacts` (`agent5/extraction.ts:41-55`);
  every retry omits them, including the default-ON red-herring floor (`coverage-retries.ts:418`). Prompt-changing.
- **A5-16 live.** Volatile `## CML Summary` opens the developer message (`agent5-clues.ts:591`). Prompt reorder.
- **A5-D05 live.** `enforceSuspectCoverage` (`agent5-run.ts:370`) adds backstops; the red-herring floor (`:391`) then
  regenerates the whole set and suspect coverage is not re-run. Deterministic.
- **A5-Q02 partly.** Backspace bytes gone; the fix is behind `AGENT5_MERIDIEM_CHECK` (OFF) and its predicate
  `/\b(am|pm|a\.m\.|p\.m\.)\b/i` (`clue-time.ts:194`) is the naive regex that trips on "I am".
- **A5-Q06 live.** Six `AGENT5_ENABLE_LLM_RETRIES` branches (`extraction.ts:63,96,168`, `coverage-retries.ts:319,493`,
  `evidence-remediation.ts:397`), flag unset everywhere.
- **A6-02 live (retries-on arm).** `deriveRequiredCluePhrases` fills its 16 slots with fixed lines first
  (`agent6/retry-contract.ts:278-285`); with a 7-member cast no violation-specific phrase survives (INFERRED, arithmetic).
- **A6-03 partly.** Outer half moot (decision 7); `inputs.retryFeedback` branch now has no caller
  (`agent65-world-builder.ts:233,957-966`). Inner loop's generic retry text demands length (`:1031-1047`) for failures the
  padding floors made unreachable; truncation detected by regex on the message (`:1008`).
- **A6-16 live.** Provisional audit (`structural-retry.ts:308-318`, retries-on); majority-of-k samples sequential
  (`agent6-run.ts:631-638`); audit loop and blind read sequential.
- **A6-17 live.** Whole CASE pretty-printed into the World Builder prompt (`:333-351`); "300 words" hard-coded (`:246,249`).
- **A6-D02 live.** `chooseBreakMomentCharacter` reads `member.role` (`:748,755`); CASE.cast has `role_archetype`.
- **A6-D08 live.** With no `correction`, the backstop's "contradiction" clue repeats the "observation" clue's text
  (`retry-contract.ts:856-863` vs `:896-903`), on the default path.
- **A6-Q02 live.** World Builder throws after 3 attempts; nothing catches it. Review: degrade to
  `normalizeWorldDocumentStructure({})` with a floor warning.
- **A6-Q04 live.** Both Agent 6 calls pass `resolveDesignModel()`, so `AGENT6_MODEL` never applies.

## Audit — Agents 1, 2, 8, orchestration, scoring (read-only agent, 2026-10-01, ~143k tokens, 57 tool uses)

- **A1X-10 live.** A missing top-level key costs an LLM re-roll (`agent1-setting.ts:283-296`) before the free backfill
  (`agent1-run.ts:68-118`); the runner's re-roll (`:127`) sends the same prompt; the runner's realism fold
  (`agent1-run.ts:43-63`) can never fire (`agent1-setting.ts:300-325` clears the arrays first).
- **A1X-D06 live.** `agent1-setting.ts:247` passes the base deployment explicitly, so `AGENT1_MODEL` never applies.
- **A1X-D10 live.** Warning claims "schema repair guardrails" (`agent1-run.ts:125`); the re-roll sends the same input.
- **A1X-Q05 live.** F5b (`agent2c-run.ts:198-223`) can fire only on fallback text — the sensory fallbacks strip every
  bleed first (`:87-88,121,139`); the realism belt as above.
- **A1X-11 partly.** 2c rules repeated (`agent2c-location-profiles.ts:173-175,266,270`) and its example JSON uses the
  phrases its own rule forbids; 2e double feedback moot (decision 7); Agent 8 asks for fields it recomputes.
- **A1X-15 live.** Agent 2's no-names branch, the 2c `narrative` path (always undefined) and the realism belt are
  unreachable from the pipeline.
- **A1X-D01 live.** Agent 2's victim fallback (`agent2-run.ts:547,566`) is a substring `/victim/` test; decision 2 wired
  only the detective sites.
- **A1X-D11 live.** 2b pairs profile *i* with cast member *i* (`agent2b-character-profiles.ts:159,345,436`).
- **A1X-Q07 live.** Legacy Agent 2 re-rolls blind on misses the final attempt repairs deterministically
  (`agent2-cast.ts:751-756,819-836`); legacy is production (`AGENT2_CONSTRAINED_CAST` unset).
- **A1X-D03 / A1X-Q06 live, not reached here.** Agent 8's summariser reads CML-1.x paths (`agent8-novelty.ts:154-165`);
  `.env.local` sets `NOVELTY_SIMILARITY_THRESHOLD=1.0`, which skips it — the API's default (0.9) runs it.
- **ORC-14 / ORC-Q07 live.** `client.ts:264`: `options.model || resolveAgentModel(label, default)`; eleven call sites
  pass an explicit model (design tier for Agents 3, 3b ×2, 5, 6 ×2, 7; base for Agent 1 and the semantic validator).
  MEASURED: no `AGENT*_MODEL` is set and the design deployment is commented out, so letting overrides outrank the tier
  changes no call's model under today's env files.
- **ORC-D11 live.** `name-generator.ts:591-599` duplicates the pool for "2× weight", then de-duplicates it — a no-op.
- **SCO-Q05.** `comparePromptVariants` has no importer outside its barrel and its own test.

## The batch's first live run — seed 5670 (2026-10-02)

`CML_VERIFIED_FIXES=1 CANARY_CORE_INPUTS_YAML=scripts/generated/run-params-5670.yaml node --use-system-ca scripts/canary-core.mjs`
— temporal · 1950s · Theatre · Classic · short · amateur · classic · humour classic · cast 5 (Ambrose Dunmore,
Prudence Merrow, Clarissa Ellery, Julian Penhale, Kenneth Ingram) · angle "a bomb-disposal officer home on leave" ·
fresh names: 25 given / 25 surnames excluded from the last 5 runs. A smoke test of the batch, not a read.

**Attempt 1** — `mystery-1790895750302`, **£0.04**, aborted at Agent 8: the audit's reply hit its 2,500-token cap
(`finishReason: length`, unterminated JSON). Cause (MEASURED): A1X-D03 gives every seed summary its real victim,
motive and method — "Unknown" in the prompt 250 → 40, the prompt 160k → 206k chars; the five previous audits ended
at 891–1,020 tokens. Fixed under the same flag: the cap is 8,000 when it is on (`e8d7b700`).

**Attempt 2** — `mystery-1790896091454` / `canary_1790896091452`, **£0.93** ($1.17, run-cost-audit), 10 chapters,
12,207 words, `stories/story_20261002-0022/`. Release gate as written: `unknown`; run_outcome `failed — One or more
phases failed threshold` (Agent 3 82, Agent 7 70).

| # | Prediction | Result |
|---|---|---|
| 1 | Completes to a release-gate verdict, no crash or abort from batch code | **Partly.** Attempt 1 aborted on batch code (fixed); attempt 2 completed, but the gate read `unknown` — a separate, pre-existing defect: only v1 ever wrote `release_gate_summary`, so every v2 run fell back to phase thresholds. Fixed: v2's own gate is now the run's release gate (`recordV2ReleaseGate`). Under it this run is "shipped, needs review" (0 stops, 10 warnings). |
| 2 | Agent 7's prompt names the real victim and motive (A7-D01) | **Pass.** `**Victim**: Prudence Merrow`, `**Motive**: Feared Prudence would reveal his past political affiliations`; 0 "Unknown". |
| 3 | Agent 8 runs and its summaries name the victim (A1X-D03) | **Pass** — and it is what broke attempt 1. Attempt 2: `stop` at 977 tokens. |
| 4 | `[identity-disagree]` lines appear | **Fail.** 0 lines: no detective/victim site disagreed on this cast. The counter's first live value is 0. |
| 5 | No `[A6-Q02]` unless the World Builder fails | **Pass** (0). |
| 6 | Cost £0.9–1.4 | **Pass.** £0.93 + £0.04. |

**Do not send this book to a reader:** its SHIP-CHECK is WORTH A LOOK — 156 repeated 6-word spans, 125.1 per 10k,
7.2× the corpus median ("quarter to six in the evening" ×25). One scene-ref join fell back to keywords (5/21
unresolved); no prose chapter was forced to a deterministic fallback.

## The batch read — matched pair, seed 82094 (2026-10-02)

Spatial (the axis rule: spatial had 0–1 reads) · 1950s · CountryHouse · Cozy · short · private detective · classic ·
cast 6 (Adela Halloway, Cecil Thorne, Harriet Bellamy, Ivor Yardley, Marguerite Selwyn, Ottoline Fairweather) · angle
"a circus wintering in a market town". The novelty ledger was snapshotted before OFF and restored before ON (both
halves saw the same history; the OFF entry was merged back afterwards). `CML_IDENTITY_ROLE_WINS` off in both.

| | OFF `mystery-1790960614933` | ON `mystery-1790962241800` (`CML_VERIFIED_FIXES=1 AGENT5_RED_HERRING_TOPUP=1 CML_PROMPT_TRIMS=1`) |
|---|---|---|
| Completed · gate | 10 ch · **warning** (7 classes) · run_outcome passed | 10 ch · **warning** (4 classes) · run_outcome passed |
| Cost (run-cost-audit) | £0.95 | £0.93 |
| Agent 7 case summary | "**Victim**: Unknown", "Unknown motive" | "**Victim**: Cecil Thorne", "**Motive**: Victim refused to approve contract renewal for circus" |
| Agent 5 first prompt | ~7,507 tokens | ~6,430 tokens (−1,077) |
| Cache hit (run) | 48% | 48% |
| SHIP-CHECK | Normal (0.0 per 10k) | Normal (1.5 per 10k) |
| Agent 3 phase | 99 | 82 — fails "Discriminating test" (see below) |
| `[identity-disagree]` | 2 | 1 |
| Red-herring top-up | — | did not fire (2 survived separation) |

**Predictions:** both complete with a real gate verdict — **pass** (the v2 gate fix works live); Agent 7 names the
victim only ON — **pass**; Agent 5 ~675 tokens shorter — **pass** (−1,077); cost ON ≤ OFF — **pass**; identity counter
0 — **fail** (see below); top-up fires only on a deficit — **not exercised**.

**Found:** (1) ON's Agent 3 phase failed in 2 of 2 ON runs (seeds 5670, 82094) on `discriminating_test missing
evidence_clues` — A34-D11 tells Agent 3 to leave them empty (its skeleton's own instruction) and the honest scorer still
required them. Fixed: under the flag the scorer accepts an empty list (report-only; Agent 5's contracts still require the
ids). (2) The identity counter fired 3× across the pair, all at `agent2.victim`: the model marked TWO members
`role: victim` before normalisation (Cecil, the real victim, and Ivor, a suspect); the old archetype test resolved it to
Cecil, the unified predicate would call both victims. **Decision 2's flip stays OFF** — it would change who Agent 2 keeps
as the victim.

**Verdict (owner delegated, best judgement):** `CML_VERIFIED_FIXES=1` and `CML_PROMPT_TRIMS=1` set in `.env.local`
(backup `.env.local.bak-20261002-batch`); the flags stay in code, so one line reverts. `AGENT5_RED_HERRING_TOPUP` stays
OFF (no evidence). A single pair settles crashes and outcomes, not a mark.

**External reads (owner, ChatGPT, ±3 marks):** seed 5670 (batch ON, the WORTH-A-LOOK book) **78/100** — clock direction,
Kenneth not physically tied to the mechanism, repetitive clue exposition; seed 82094 OFF **80/100** — an ending
contradiction around Ottoline (the culprit) costs most; "87–89 with chapter 10 corrected". The ON half
(`stories/story_20261002-1855/`, SHIP-CHECK normal) is unread — its read completes the pair. A difference under ~7 marks
between the halves is unmeasured (memory: the rubric cannot rank two books).

### Injector audit of the two reads (2026-10-02, free — the run's own prompts)

| Complaint (read) | Source | Status |
|---|---|---|
| Arrested culprit tends the fire in ch10 (82094 OFF, "biggest continuity error") | **Ours** — ch10's contract put her "On the page" in the aftermath | Fixed behind `CML_VERIFIED_FIXES` (`7501ebf9`) |
| "Miss Fairweather is cleared" in ch9 — the culprit (82094 OFF) | **Ours** — THE CLOCK listed her alibi like an innocent's; ch9's contract asks a clearance beat per suspect | Fixed (her row reads "cover") |
| "Where and when: [object Object]." (82094 OFF brief) | **Ours** — setting objects stringified | Fixed |
| "Kenneth Ingram was seen accessing…" notes-like line (5670) | **Ours** — the clue description is in the brief verbatim and was copied; MEASURED 71/459 clue lines (15.5%) across 25 v2 runs reappear as an 8-word span | Fixed behind `CML_VERIFIED_FIXES` (`564229a2`): 8+-word observables briefed as ≤6-word fragments |
| Clock "wound forward" vs times saying back (5670) | **Ours** — the device text contradicts its own locked times; MEASURED 2 of 7 directional devices in the archive | Fixed behind `CML_VERIFIED_FIXES` (`564229a2`): direction words repaired at source in Agent 3b (magnitude stays X38's) |
| "(…reserved for chapter 6)" scaffold note (5670) | Model paraphrasing a reveal-timing instruction; not in any brief | Open |
| "absence of any digital clocks or mobile telephones" (82094 OFF) | **Model** — no period-constraint wording reaches the writer's brief (an earlier attribution to us was the probe's error, withdrawn) | Not ours |
| Long speech → short reply pattern; repetition | Model | — |
