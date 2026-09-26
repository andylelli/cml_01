# 05 — Agent 9 repair, regen & polish

**Scope:** 9 files, 4,800 lines, 3,347 code lines — `packages/prompts-llm/src/agent9-prose/{deterministic-repair, regen-integration, regen-llm, regen-registry, regen-repair, repair, post-pass-polish, polish-provider, repair-efficacy}.ts` · **Read:** every line, plus the callers in `generate.ts` and `apps/worker/src/jobs/agents/agent9-run.ts` and the recognisers in `@cml/prose-guard` · **Written:** 2026-09-25
**Finding prefix:** A9R · **Method:** [RUBRIC.md](../RUBRIC.md)

## 1. What this area does

Everything that changes a chapter after the first draft, except the chapter retry loop itself.

| Rung (ADR-0007) | Module | Entry points | Called from |
|---|---|---|---|
| Scoped LLM regen: the engine | `regen-repair.ts` | `runRegenRepair`, `regenThenValidate` (progress-or-revert) | regen-integration, worker |
| Scoped LLM regen: the LLM call | `regen-llm.ts` | `makeRegenFn`, `buildRegenPrompt`, edit-list channel | generate.ts (1 site), agent9-run.ts (12 sites) |
| Scoped LLM regen: the passes | `regen-integration.ts` | 15 `run*Pass` runners, validators, instruction catalog, Bible dereference | generate.ts (clue), agent9-run.ts (the rest) |
| Metadata | `regen-registry.ts` | `REGEN_PASS_REGISTRY` (14 entries), `finishRegenPass` | tests only |
| Deterministic floor | `deterministic-repair.ts` | clue / DT / clearance patches, `repairChapterDeterministically`, `buildCompletionFallbackChapter`, `buildChapterRepairContext` | generate.ts |
| Other LLM repairs | `repair.ts` | `attemptUnderflowExpansion` (length), `runAtmosphereRepairIfNeeded` (phrase swap) | generate.ts |
| Polish | `post-pass-polish.ts`, `polish-provider.ts` | `polishPassingChapter` (per chapter, Opus on `.env.local`), `runFullStoryRepetitionPolish` (flag, off) | generate.ts |
| Telemetry | `repair-efficacy.ts` | changed / no_change / rolled_back tallies | generate.ts only |

Data in: the chapter, a `ChapterRequirementLedgerEntry`, the Story Bible slice (`RegenBible`), raw CML (`caseData`, typed `any`), clue distribution. Data out: the chapter, plus repaired/unresolved refs. Order in a run: per chapter, generate → pronoun/sanitize → clue regen → **deterministic floor** → evaluate → **polish** → batch lint (all in `generate.ts`). Then, in the worker after `generateProse` returns: scaffold → leakage → dual-value (+ ship-scope residual) → mechanism → transition → voice → locked-fact regen → floor → culprit / resolution / suspect regens → floors → pronoun regen → geometry repairs.

## 2. Verdict

The engine is sound. `regenThenValidate`, per-defect acceptance (A_73 §32), the insertion/rewrite split and the edit-list channel are the best-reasoned code in Agent 9. The complexity comes from the fact that **every repair concept exists twice**, and one copy is usually unobservable:
- a registry that describes the passes and a separate worker that runs them;
- floor templates, and the hand-copied regexes that are supposed to recognise them;
- five "is this suspect cleared?" predicates;
- two LLM passes, polish and scaffold regen, de-templating the same sentences under two different acceptance tests.

S3 delivered the registry, but not the collapse. Commit `e2073a44` changed `regen-integration.ts` by −10 lines, against a projected −900. The repetition it targeted lives in eleven hand-rolled wrapper blocks in `agent9-run.ts`, and those are untouched. The single most valuable change is **A9R-03**:
- The polish prompt tells the model to remove exactly the lexical markers the stage validators require.
- The default-ON `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` routes exactly the chapters carrying those markers to polish.
- Polish is 18–24% of run spend, and 6 of 10 calls were rolled back across the 08-26 runs.

The most urgent change is **A9R-02**. Since 2026-07-17 the scaffold detector has not recognised three of the five clue-floor sentence shapes, including the one the 08-23 reader quoted.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A9R-01 | P1 | A C D | Registry is metadata, not dispatch: 1 dead entry, ≥4 live passes missing, 11 worker wrapper blocks untouched | R1 | L (2–3 d) | −200 |
| A9R-02 | P1 | C | Floor templates and their recognisers have drifted: 8 of 11 live floor sentences evade the scaffold detector, 9 of 10 evade `INJECTED_SENTENCE_PATTERNS` | R0 + R2 | M | +60 (test) |
| A9R-03 | P1 | I F | Polish and validators fight by construction; rollback telemetry cannot show which validator | R1 → R2 | S + M | +30 |
| A9R-04 | P1 | C | "Suspect cleared" has 5 bodies and 2 evidence vocabularies; the suspect-elimination pass and floor disagree (A_64 F1's unfixed sibling) | R0 → R2 | M | −40 |
| A9R-05 | P2 | A B C | `regen-integration.ts` is six modules; the pass skeleton is repeated 13× | R1 | M | −250 |
| A9R-06 | P2 | C F | Five independent "LLM rewrites a chapter" engines; truncation handled at one site, for one provider | R1 | M | −150 |
| A9R-07 | P2 | G F | Repair telemetry spread over 3 module-level stores; efficacy covers 2 of ~17 LLM repair passes | R1 | M | +40 |
| A9R-08 | P2 | I | Regen retries resend a byte-identical prompt; insertion passes have no structural channel | R2 | M | +40 |
| A9R-09 | P2 | C E | Repair context re-derives Bible facts from raw CML; X50's `??` role bug survives in 4 copies | R2 | M | −60 |
| A9R-10 | P2 | I | The clue regen ignores `AGENT9_MODEL_REGEN` and runs on the prose tier | R2 | S | −5 |
| A9R-11 | P3 | D | Dead and vestigial: `runClearanceRegenPass`, `applyClearancePatch`, `clueTerms`, a 40-line boolean clone, 3 producer-less defect kinds | R0/R1 | S | −130 |
| A9R-12 | P3 | A B | Split `deterministic-repair.ts`; merge the two floor patch chains | R1 | M | −40 |
| A9R-13 | P3 | E B | `CaseData = any` casts, 14× `as const` defect literals, a 10-positional-parameter LLM function | R0 | S–M | −60 |
| A9R-14 | P3 | I H | Regen prompt order defeats caching; atmosphere calls run serially; instruction and detail duplicated in the prompt | R2/R1 | S | ±0 |

### A9R-01 — The registry is documentation; the worker is the real registry
- **P1 · lens A/C/D · R1 · L (2–3 days)**
- **Evidence (MEASURED):**
  - Nothing reads `REGEN_PASS_REGISTRY`, `REPAIRABLE_DEFECT_KINDS`, `REGEN_PASS_FLAGS`, `regenPassById` or `passesForDefectKind` outside `__tests__/regen-registry.test.ts` (grep over apps/, packages/, scripts/). `runner` and `flag` are strings (`regen-registry.ts:42,50`).
  - **Dead entry:** `clearance → runClearanceRegenPass` (`regen-registry.ts:69-76`) has no production caller. It is exported from `index.ts:147` and used only in tests. The comment at `regen-integration.ts:1299` says as much.
  - **Missing live passes.** Each builds `ProseDefect`s and calls the engine from the worker:
    - locked-fact regen: `agent9-run.ts:5687`, `runInsertionRegenPass`, kind `locked_fact_absent`, `AGENT9_REGEN_LOCKED_FACT`;
    - pronoun regen: `agent9-run.ts:5871-5893`, direct `runRegenRepair`, default ON;
    - NSD-anchor regen plus its own floor: `agent9-run.ts:3400-3520`;
    - geometry insertion reuse: `agent9-run.ts:6763`.
  - The test's assertion that `pronoun_mismatch` and `locked_fact_absent` "have no registered PASS — they are repaired inside other passes' validators" (`regen-registry.test.ts`, defect-kind block) is contradicted by the two sites above.
  - Flag gates are compound and not captured: voice needs `AGENT9_VOICE_ENFORCE=enforce`; aftermath and reveal need `AGENT9_GEOMETRY_ACCEPTANCE=apply` plus their own flag; mechanism needs mechanism terms and a DT chapter.
  - The "flags appear in source" test reads `regen-integration.ts`, which reads no flags, plus FLAG-AUDIT.md. So it only proves FLAG-AUDIT mentions the string; it cannot catch a mis-gated pass.
  - The registry claims `early_spoiler` is repaired by `template_leakage` (`regen-registry.ts:144`). No code produces that kind.
  - **Where the wrappers went:** `agent9-run.ts` has 12 `makeRegenFn(` sites, 11 `{ ...worldState, beatSheet: [] }` Bible slices and 11 `costBefore… getTotalCost()` brackets (4917, 4960, 5013, 5076, 5115, 5171, 5665, 5758, 5856, 7128, 7525). Each sits inside an identical if-flag / try / for-chapter / write-back / `applyStandardPostProcessingChain` / catch / finally shell of 35–95 lines (≈810 lines of regen orchestration in total).
  - S3 commit `e2073a44`: `regen-integration.ts` went 1,337 → 1,327 lines. It has since grown to 1,625.
  - The registry does not record ADR-0007's own relation, "each regen pass runs before its corresponding injector". Which floor a pass pre-empts, and which predicate both consult, lives only in comments.
- **Proposal:**
  - Make each spec executable: `RegenPassSpec { id, family, defectKinds, isEnabled(env), phase, detect(ctx) → defects[], run(ctx, defects), presence: (target, text) ⇒ boolean, floor: FloorId | null }`.
  - Add `apps/worker/src/jobs/agents/agent9/regen-phase.ts` with `runRegenPhase(ctx, phase)`. It owns the shell once (flag, cost bracket, Bible slice, `makeRegenFn`, per-chapter loop, write-back, hygiene re-run, warnings). The worker calls it at the existing phase points, so the interleaving with floors is kept.
  - Register the four worker passes and delete `clearance`.
  - Replace the source-text test with one that runs the phase driver against a spy for each flag combination.
  - This is the regen tranche of S4.
- **Benefit:** ≈ −200 lines in `runAgent9` (cc 605 → ≈545). "Which obligations have an LLM path, what gates them, what floor sits under them" becomes one executable table, which is what REVIEW_01 §5.7 asked for. The `presence`/`floor` pairing makes A9R-04's class of split-brain testable.
- **Verification:** golden replay (`agent9-replay.ts`) with a recording `RegenFn`. The sequence of `(pass, chapter, defect)` requests must be byte-identical before and after for every flag combination in `.env.local` plus all-off.
- **Relates to:** A9R-04, A9R-05, A9R-07; area 04 (agent9-run, S4).

### A9R-02 — Floor templates and their recognisers are separate hand-copies, and they have drifted
- **P1 · lens C · R0 (share constants, add inventory test) + R2 (widen detection) · M**
- **Evidence (MEASURED):**
  - The floor writers are in `deterministic-repair.ts:308-321` (clue), `:430-446` (DT), `:569-573` (clearance), `:815-817` (reveal fallback), `agent9-run.ts:3483` (NSD) and `:1242` (locked facts).
  - Their recognisers are hand-copied regexes in four places: prose-guard `scaffold.ts` `SEED_SIGNATURES`, `injection-templates.ts:54` `INJECTED_SENTENCE_PATTERNS`, `regen-integration.ts:529` `SCAFFOLD_EXHAUSTION_FLOORS`, and `phrase-analysis.ts:137`.
  - Running the live builders' output through the built detectors (scratchpad `a9r/scaffold-check.mjs`, `a9r/inj-check.mjs`):
    - **evades `detectScaffoldNotProse`:** "The record now held: …", "Weighed against the rest, X bent the trail toward Y.", "… left the standing account weaker.", and all three clearance frames;
    - **detected:** "laid the facts out", "pressed on", "shifted the reasoning", and the two A2 DT sentences;
    - **`INJECTED_SENTENCE_PATTERNS` recognises 1 of 10** sampled floor sentences (only the worker's B7 sentence).
  - Cause: commit `1e677246` (2026-07-17) reworded the A1 inference sentences ("the trail bent toward" → "bent the trail toward"; "looked weaker for it" → "left … weaker"), and `e7befb9e` (2026-07-31) retired the A3 "accounted for X's movements elsewhere" template. Neither updated the recognisers.
    - The seed signatures `A1:trail_bent_toward`, `A1:account_weaker` and `A3:accounted_for_movements`, and the A3 exhaustion floor, now target text no writer emits.
    - `prose-guard/__tests__/scaffold.test.ts:15-18` pins the pre-July fixture strings, so it passes.
    - The 08-23 reader quoted "bent the trail toward Temporal conflict hale alibi" (`deterministic-repair.ts:604`). The detector behind the rubric scaffold cap, the scaffold regen trigger and its acceptance cannot see that sentence.
  - The A1 lead string has five bodies: writer `:309`, `regen-integration.ts:88`, `scaffold.ts:35`, `phrase-analysis.ts:140`, and test regexes. Byte-identity is "enforced" by a comment.
  - The X13 totality test checks recogniser against recogniser (`SCAFFOLD_EXHAUSTION_FLOORS` ↔ `INJECTED_SENTENCE_PATTERNS`), never writer against recogniser.
- **Proposal:**
  - **R0:** move each template's fixed wording into one constant module in prose-guard (`floor-signatures.ts`; prompts-llm already depends on prose-guard). Builders and seed regexes both derive from those constants, byte-identical, so prose is unchanged.
  - Move every builder into `injection-templates.ts`, including the det-repair clearance frames, the NSD sentence and the locked-fact variants.
  - Add `floor-template-inventory.test.ts`. It calls every real builder with fixtures and asserts each sentence is recognised by `detectScaffoldNotProse` and `isInjectedSentence`. To land green today it records the current gaps as an explicit allow-list, so the next drift fails.
  - **R2 (owner):** add the evading shapes to the detectors. This raises scaffold hits, which triggers more regen and more honest caps.
- **Benefit:** removes the defect class "template changed, recogniser didn't" (five instances found here). The scaffold cap and `met_by_injection` start counting what the floors actually write. ADR-0003 says floor firings must be logged as floor firings.
- **Verification:** R0 — byte-equality of builder output before and after, plus the existing tests. R2 — flag, then compare scaffold-hit counts on the replay corpus.
- **Relates to:** A9R-07; area on prose-guard/rubric-score.

### A9R-03 — Polish and the validators fight by construction
- **P1 · lens I/F · R1 (telemetry, S) then R2 (fix, M) — the owner decides the fix**
- **Evidence:**
  - **What triggers a rollback (INFERRED from code):** `post-pass-polish.ts` rolls back on
    - finish reason `max_tokens` or `refusal` (`:286`);
    - a parse throw (`:296`);
    - an empty chapter (`:308`);
    - any `hardErrors` from `validateCandidate` (`:317`).

    All four are reported as the single string `validation_regression`, and the hard errors are discarded.
  - `hasPolishRegression` (`:47-84`) adds three `obligation_regression` triggers: length below 80%; a required clue summary whose fuzzy tokens were in the original but not the polish; a clearance suspect's name disappearing.
  - `validateCandidate` is `generate.ts:3264-3288`. It runs pronoun repair and sanitize, then `evaluateCandidate`: the hard word floor; clue presence and first-25% placement; **stage-contract lexical markers** (`clue-validation.ts:1297-1390`); scene cast and location coverage; mechanism-too-early; victim-alive. It does **not** re-run the deterministic floor, which the original passed through (`generate.ts:2761`). It does **not** run the batch linter, which runs after polish (`generate.ts:3371`), and a failed batch retries and discards the polish.
  - **What the prompt knows** (`buildPostPassPolishPrompt :117-223`): stage mode, investigator, culprit, clue summaries, clearance names, balance hints. It is not told the word floor, stage markers, early placement, locked facts, season lock, or scene locations.
  - **What it instructs** (`:148-172`):
    - #1 rewrite verdict sentences, quoting "…placed her elsewhere; she could not have been responsible". That example satisfies `CLEARANCE_TERMS_RE` (`could not have`) and matches the A3 floor form.
    - #2 cut "this is what proves it", and #4 reword "a test outcome stated as a result". `DISCRIMINATING_TEST_PROOF_RE` requires `proves?|result|rules? out|observation` (`clue-validation.ts:1029`).
    - #5 stop reciting alibis and narrated deductions. `final_reveal` requires `opportunity|access|alibi|means…`.
    - "Cut the explanation" and "cut repeated phrasing" shorten a chapter that underflow expansion may have left only 80 words above the hard floor (`repair.ts:51`).
  - The floors were written *for* those markers. `deterministic-repair.ts:436-439` keeps the DT markers the gate needs; `:566-568` says a frame that reads well "while failing that gate is worse than the flat one". Polish is told to rewrite exactly those sentences.
  - **Routing (MEASURED):** `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` defaults ON (`generate.ts:3203`). It sends `final_reveal`, `discriminating_test`, `suspect_pressure` and `false_suspect_clearing` chapters to polish and bypasses the provisional gate. All four modes carry lexical hard gates.
  - **Outcome (MEASURED, ANALYSIS_74 §10.3):** 4 calls, 4 rolled back, reasons `(validation_regression, obligation_regression)`; 6 of 10 across the two runs. `validation_regression` cannot distinguish a validator from a truncation or refusal, so "the reasons name validators" is not established by the telemetry.
  - Separately, the finish-reason check uses Anthropic vocabulary only. Azure truncation is `finish_reason: "length"` (`llm-client/src/client.ts:401`). On the code-default Azure path a truncated reply goes through `jsonrepair` (`sanitization.ts:94`) and can be kept if it lost less than 20%.
  - This is the same shape as REVIEW_12 §3.4/§5: the prompt instructs what the validator rejects.
- **Proposal:**
  - **Step 1 (R1, prose-neutral, ADR-0004 exempt):** return `rejection: { kind: finish|parse|empty|hard_errors|obligation|no_change, detail: string[] }` and record it with the stage mode and whether a floor fired in this chapter. Accept `length` and `content_filter` as truncation or refusal.
  - **Free probe (no LLM):** `llm-prompts-full.jsonl` holds every `Agent9-PostPassPolish-Ch*` prompt (source JSON included) and response for the 08-26 runs. Replay the 10 responses through `validateCandidate` and `hasPolishRegression` offline with the run's ledger, and tabulate the hard errors by stage mode and floor-fired.
  - **Prediction:** the rollbacks are stage-marker, clue-token or word-floor failures on high-leakage and floor-touched chapters. Also count kept polishes followed by a batch-lint failure.
  - **Step 2 (R2, if confirmed), cheapest first:**
    - (a) gate polish off chapters where a floor fired and let the measured scaffold regen (P4: A1 scaffold 14 → 0) handle them;
    - (b) derive a "must survive" token list from the same regexes and state it in the prompt;
    - (c) edit-list polish with validator-bearing paragraphs locked;
    - (d) fold the batch linter into `validateCandidate`.
- **Benefit:** polish is 18–24% of spend. At the observed 60% rollback rate, ≈11–14% of a £1.45–1.73 run buys nothing. Either (a) saves that spend or (b)/(c) converts it into kept edits.
- **Verification:** step 1 — unit tests with a mock client for each rejection kind. Step 2 — flag plus the probe above, then N≥2 runs.
- **Relates to:** A9R-06 (the finish reason belongs in the shared engine), A9R-02, ADR-0008.

### A9R-04 — "Suspect cleared" has five bodies; the pass and the floor disagree
- **P1 · lens C · R0 then R2 · M**
- **Evidence (MEASURED):**

  | Body | Scope | Terms | Evidence vocabulary | Name match |
  |---|---|---|---|---|
  | regen `clearancePresenceValidator` (`regen-integration.ts:221`) | paragraph | +killer | shared: `witness`, `saw`, `seen`, `account` | case-insensitive, `\b` |
  | det-repair `chapterHasCoLocatedClearance` (`:514`) | paragraph | base | local `:68`: `which proves`, `constraint`, `observation` | case-insensitive, `\b` |
  | lint `suspect_clearance_missing` (`lint.ts:517`) | chapter | base | local copy of `:68` | case-insensitive, `\b` |
  | worker floor `enforceSuspectEliminationPresence` (`agent9-run.ts:2344`) | chapter | base | local copy of `:68` | `nameInTextShared`: case-sensitive substring, no boundary (`:2130`) |
  | polish guard (`post-pass-polish.ts:73`) | chapter | — | — | name only |

  - The A_73 sweep (`a9da7582`) moved regen's evidence regex into `shared/clearance-vocabulary.ts` and left the three `which proves|constraint|observation` copies alone. The shared export is therefore the **minority** definition.
  - `deterministic-repair.ts:67` carries a "single-sourced" comment above a local copy. The parity test pins only the TERMS regexes.
  - The regen pass says it "mirrors the injector" (`regen-integration.ts:1336`) but does not. A regen that clears a suspect with "the porter saw her" satisfies the pass and may still trigger the floor.
  - This is exactly the v_tide_enforce split-brain that A_64 §2 F1 fixed for culprit evidence by exporting `culpritEvidenceLinkInText` (`:1199`) to both sides. Suspect elimination never got that fix.
- **Proposal:**
  - **R0:** give both evidence regexes names in the shared file (`CLEARANCE_EVIDENCE_REGEN_RE`, `CLEARANCE_EVIDENCE_FLOOR_RE`), import them everywhere, and extend the parity test. This is byte-identical.
  - **R2 (flag):** export `suspectClearedInText(suspect, text)` from regen-integration and have both the pass's skip set and the floor consume it, as with culprit evidence. Pick one scope and one vocabulary.
- **Benefit:** removes one live split-brain. Five bodies become two named ones (R0) and then one (R2).
- **Verification:** R0 — parity test plus typecheck. R2 — `deterministic_clearance_paste_count` and regen UNRESOLVED counts, flag on vs off.
- **Relates to:** A9R-01 (`presence` field), A9R-09.

### A9R-05 — `regen-integration.ts` is six modules wrapped around a 13× skeleton
- **P2 · lens A/B/C · R1 · M**
- **Evidence (MEASURED):**
  - **Responsibilities:**
    - Bible dereference (`:37-81`, including `genderMapFromBible`, used by worker validators);
    - instruction catalog (`:83-147`);
    - validator library (`:168-281, 448-508, 978-998, 1186-1217`);
    - a *deterministic* scaffold exhaustion floor (`:510-572`);
    - scoring-text assembly used by the orchestrator (`:820-843`);
    - the worker injector's predicate (`:1199`);
    - 15 runners.
  - **Per-pass idioms in one file:** `runRegenRepair(` ×13, each with `(chapter,d)=>buildRegenRequest(chapter,d,args.bible)`; `maxAttemptsPerDefect ?? 2` ×11; `lockedFactValues(args.bible)…filter(present)` ×11; inline copies of `preserveLockedFactsValidator` ×3 (`:1067, :1267, :1374`); `? 100 : 0` ×16; `severity: "hard"` ×14.
  - `finishRegenPass` is used by only 8 of the 15 runners.
  - The fragment-grouping block appears twice (`:603-609`, `:693-700`) and the last-chapter-naming-X targeting twice (`:1251-1256`, `:1343-1353`).
  - There are four result types for one shape: `InsertionRegenPassResult` ≡ `RegenPassOutcome` (registry `:219`), the `ClueRegenPassResult` alias, `CulpritEvidenceRegenResult`, and the residual's inline type.
- **Proposal:**
  - Create `agent9-prose/regen/`: `bible-deref.ts`, `instructions.ts`, `validators.ts` (with a `check(ok, violation)` helper), `request.ts`, and `passes/{insertion,rewrite,story-scope}.ts`.
  - Add one `runScopedRegen({ chapter, defects, bible, regen, checks, preserve: "paragraphs" | "facts" | "facts+length", ... })`, so each runner becomes detector plus defects plus checks.
  - Move `assembleScoringChapterTexts` and `detectDualValueAtShipScope` to the scoring/shared layer, `applyScaffoldExhaustionFloor` next to the floors (A9R-12), and `culpritEvidenceLinkInText` to a shared presence module (A9R-04).
- **Benefit:** ≈ −250 lines. Each runner shrinks to 15–30 lines, and "insertion vs rewrite" becomes a `preserve` argument instead of a hand-composed validator list, so it is harder to misclassify (the ADR-0007 guard).
- **Verification:** the 19 area test files (233 tests, green, MEASURED), plus a recording-`RegenFn` characterisation test asserting identical requests and validator verdicts per runner.
- **Relates to:** A9R-01, A9R-06.

### A9R-06 — Five independent "LLM rewrites a chapter" engines
- **P2 · lens C/F · R1 · M**
- **Evidence (INFERRED):**
  - In this area:
    - regen (`regen-repair.ts` + `regen-llm.ts`);
    - underflow expansion (`repair.ts:36`), which has no rollback of its own and runs up to 6 passes (`generate.ts:2993`);
    - atmosphere phrase swap (`repair.ts:306`);
    - polish (`post-pass-polish.ts:225`);
    - full-story polish (`:578`).
  - A sixth copy sits outside the area: `full-story-diagnostic.ts:370` (jscpd: `:380-392` ≡ `post-pass-polish.ts:655-670`), which has no provider seam.
  - They differ in envelope (`{"chapter"}` vs `{"status":"draft","chapters"}`), parser (`parseExpandedChapterResponse` / `parseProseResponse` / `parseEditListResponse`), guard, outcome reporting, and model choice.
  - Only polish checks the finish reason, and only in Anthropic vocabulary (A9R-03).
  - The pronoun lock is rebuilt from raw cast in `repair.ts:92-97`, a duplicate of `regen-integration.ts:37`.
- **Proposal:** add `runChapterRewrite({ call: LlmCallContext, prompt, channel: "whole" | "edit-list" | "insert-list" | "phrase-list", guard, maxAttempts, label, ledger })`. It returns `{ chapter, outcome, reason }`, normalises truncation and refusal across providers, and records into the run ledger (A9R-07). `regenThenValidate` is already 80% of it. Polish, full-story polish, the diagnostic and expansion become guards plus prompts.
- **Benefit:** ≈ −150 lines, one truncation policy, and every repair call measured.
- **Verification:** mock-client characterisation tests per caller asserting identical `chat()` arguments and identical keep/rollback decisions.
- **Relates to:** A9R-03, A9R-07, A9R-08.

### A9R-07 — Repair telemetry is fragmented and covers two passes
- **P2 · lens G/F · R1 (prose-neutral) · M**
- **Evidence (MEASURED):**
  - There are three module-level stores:
    - `deterministic-repair.ts:594-611` (clue and clearance paste counters, reset and read by the worker at `agent9-run.ts:3663, 5283`);
    - `repair-efficacy.ts:46` (reset inside `generateProse` at `generate.ts:2066`);
    - `polish-provider.ts:65-68`.
  - A fourth sink is the worker's X4 `ctx.agent9InjectorLint`.
  - `recordRepairOutcome` is called only for `post_pass_polish` and `atmosphere_repair` (`generate.ts:3295-3299, 4505`). None of the ~15 other LLM repair passes record, including the default-ON scaffold and pronoun regens and the clue regen.
  - Atmosphere is diffed for **every** chapter (`generate.ts:4504`), so its "calls" count is chapters, not calls. HANDOVER's "10 calls, 9 changed" is not comparable with polish.
  - The DT floor has no counter, and production reads only `.chapter` from `DeterministicRepairResult` (`generate.ts:2772, 3053`). `appliedRepairs`, `insertedDiscriminatingTest` and the other flags are dropped.
  - `repair-efficacy.ts` has no test.
- **Proposal:** a run-scoped `RepairLedger { floor(id, target, chapter, sentence), llm(pass, outcome, reason) }` created by the worker and passed into `generateProse` and the regen phase. Record inside `regenThenValidate` (which already has `applied`/`reverted`/`reason`) and inside each floor builder, then emit once into the report (ADR-0010). Delete the three module-level stores.
- **Benefit:** "does rework buy anything?" gets answered for all of rework, not 2 of ~17 passes, and floor firings become countable per ADR-0003.
- **Verification:** unit tests on the ledger; byte-identical prose on replay.

### A9R-08 — Regen retries are blind re-rolls; insertion has no structural channel
- **P2 · lens I · R2 · M**
- **Evidence:**
  - `regenThenValidate` sends `buildRequest(chapter)` with the original chapter on every attempt, and `lastReason` is never fed back (`regen-repair.ts:145-164`). Attempt 2 is a byte-identical prompt at temperature 0.3.
  - Measured in-source (`regen-integration.ts:255-256`, 08-23 run): 18 clue regen calls. `ch4 clue_5 ×2` failed "did not improve"; `ch6 clue_14 ×4` failed on the paragraph-preservation guard, which discards the whole candidate, including a clue insertion that worked.
  - The edit-list channel (FLAG-AUDIT: 0/3 → 2/3 success at ¼ cost) can only *replace* paragraphs (`regen-llm.ts:77`), so insertion passes still pay for whole-chapter output and lose candidates to the post-hoc guard.
- **Proposal (R2, flag):**
  - (a) Append "previous attempt rejected: <reason>" on retry.
  - (b) Add an insert-list channel, `{"insertions":[{"after":i,"text":…}]}`, for insertion-family passes. Preservation becomes structural, as edit-list made it for rewrites.
  - (c) Interim, zero-cost: salvage the paragraphs a whole-chapter candidate added into the original, then validate presence.
- **Benefit:** insertion regens cost less (output ≈ ¼) and convert guard rejections into repairs, which pushes work up the ladder, as ADR-0007 intends.
- **Verification:** the offline `probe:reveal-repair`-style rehearsal on archived chapters, then flag on vs off counts of `deterministic_clue_paste_count`.

### A9R-09 — The repair context re-derives Bible facts, with X50's bug in four copies
- **P2 · lens C/E · R2 · M**
- **Evidence (MEASURED):**
  - `buildChapterRepairContext` derives suspects with `role_archetype ?? role` + `.includes("detective")` (`deterministic-repair.ts:958-962`). The same body appears at `clue-validation.ts:361`, `generate.ts:3823` and `generate.ts:4275`.
  - X50 (`@cml/cml` `roles.ts:30-99`) replaced exactly this shape with `roleTextsOf` + `isDetectiveArchetype` in the worker, and says it "replaces the `??` chain at every role-reading site". A sleuth archetyped "… Investigator" stays in `suspectNames`.
  - The investigator (`:91-96`, same `??` shape) and victim set (`:864`) have the same problem.
  - The culprit is read raw at `:796`, `:965`, `:870`, and the pronoun map is rebuilt in `repair.ts:92`. Meanwhile regen dereferences `bible.culprits` and `bible.characters` (ADR-0005).
  - Title-casing of the investigator (the A_68 fix) is applied in the DT builder (`:413`) and the fallback chapter (`:1014`) but not in the clue-paste lead (`:346`).
- **Proposal:** build `ChapterRepairContext` from the Story Bible plus `roles.ts`, through one `resolveCastRoles(bibleOrCml)` used by all four suspect sites and the worker's `computeEliminationSuspects`.
- **Benefit:** four bodies become one, and the X50 defect is removed from the stage-contract check (`discovery_opening`'s "introduce a suspect" can currently be satisfied by the sleuth).
- **Verification:** R2, because suspect sets change. Unit tests with Agent-2-style archetypes; a stage-contract diff on replay.

### A9R-10 — The clue regen ignores the regen model tier
- **P2 · lens I · R2 · S**
- **Evidence (MEASURED):**
  - The `AGENT9_MODEL_REGEN` fix (FLAG-AUDIT "BUG (fixed)", `agent9-run.ts:4323`) wired the worker's 12 `makeRegenFn` sites.
  - `generate.ts:2741` still passes `model: inputs.model`, which is the generate tier. An explicit model beats the router.
  - `AGENT9_REGEN_CLUE` is ON and was the busiest regen on 08-23 (18 calls).
  - Estimate (INFERRED from FLAG-AUDIT's own ratio, £0.150 / 11 premium calls vs £0.030 at the configured tier): ≈ £0.20 on a run like 08-23.
- **Proposal:** resolve `resolveStageModel("regen", opts.model)` inside `makeRegenFn`, the one choke point, as polish already does with `resolveStageModel("polish", …)`.
- **Verification:** the model id in `llm-prompts-full.jsonl` for `Agent9-Regen-*` labels.

### A9R-11 — Dead and vestigial code
- **P3 · lens D · R0/R1 · S · ≈ −130**
- **Evidence (MEASURED):**
  - `runClearanceRegenPass` (`regen-integration.ts:415-446`) has no production caller.
  - Every caller of `repairChapterDeterministically` passes `applyClearancePatch: false` (`generate.ts:2770, 3051`, the only test at `:1289`), so the branch at `deterministic-repair.ts:737-750` and the `insertedSuspects` field are unreachable in production.
  - `hasRepetitionRewriteRegression` (`post-pass-polish.ts:424-471`) is a 48-line clone of `repetitionRewriteRegressionReason` (`:491-532`; jscpd). `fullstory-polish-visibility.test.ts:124` already pins the equivalence, so it can become `reason(args) !== null`.
  - `ProseDefectKind` has three members with no producer: `victim_animated`, `suspect_unaccounted`, `early_spoiler` (`regen-repair.ts:27-33`).
  - The alias `ClueRegenPassResult` (`:332`) is redundant.
  - The comment at `deterministic-repair.ts:588` names `applyDeterministicStagePatches`, a function that never existed in git history.
- **Proposal and verification:** un-export and delete (R0: typecheck); drop the always-false parameter (R1, grep-proven); collapse the clone (R1, the existing test).

### A9R-12 — Split `deterministic-repair.ts` and merge its two patch chains
- **P3 · lens A/B · R1 · M**
- **Evidence:**
  - The file holds context derivation (`:91-173, 824-981`), which `post-pass-polish.ts` imports for a type.
  - It holds three floors and the completion fallback. `buildCompletionFallbackChapter` is 112 LOC, cc 26, with 7 parameters.
  - The clue → DT → clearance chain is written twice: `repairChapterDeterministically` (`:689`) and the tail of `buildCompletionFallbackChapter` (`:1066-1093`). The second omits `castNames` for the clue patch.
- **Proposal:** split into `chapter-obligation-context.ts`, `floors/{clue,discriminating-test,clearance}.ts` (templates into `injection-templates.ts`, per A9R-02) and `completion-fallback.ts`. The fallback calls `repairChapterDeterministically({ clearances })`.
- **Verification:** the existing agent9-prose tests plus byte-equality of fallback chapters on fixtures. The `castNames` divergence needs an explicit decision.

### A9R-13 — Types and signatures
- **P3 · lens E/B · R0 · S–M**
- **Evidence:**
  - `CaseData = any` (`packages/cml/src/index.ts:105`) makes the 15 `(caseData as any)` casts in `deterministic-repair.ts` redundant.
  - `ChapterRepairContext.scene: any`.
  - Defect literals carry `"…" as const` ×14 in `regen-integration.ts`.
  - `attemptUnderflowExpansion` takes 10 positional parameters with `scene: any, cast?: any[]`.
  - The `(client, model, runId, projectId)` quadruple recurs in five LLM function signatures.
- **Proposal:** a `CmlCaseView` pick parsed once; a `defect(kind, chapter, ref, detail, idx?)` factory; `LlmCallContext`.

### A9R-14 — Small efficiency items (honest magnitudes)
- **P3 · lens I/H · R2/R1 · S**
- **Evidence:**
  - The regen prompt puts the volatile `OBLIGATION` first and the chapter last (`regen-llm.ts:142-170`). Two defects in one chapter share only a ~150-token prefix, so R8-style ordering would let them share the chapter prefix. Worth pennies per run.
  - `runAtmosphereRepairIfNeeded` makes independent per-chapter calls serially (`repair.ts:327`). Bounded concurrency saves ~15–30 s wall-clock and no money.
  - The instruction and the `detail` restate each other (for example `culprit_unlinked`: `:103` vs `:1275`; `missing_clearance`: `:99` vs `:1367`). That is prompt duplication, though tiny.
  - CPU: repeated joins and regex builds per validation are negligible against LLM latency. Not worth a change.

## 4. Target structure

```
packages/prose-guard/src/floor-signatures.ts        ~80   fixed template wording, shared by writers and recognisers (A9R-02)
packages/prompts-llm/src/agent9-prose/
  repair-engine/ run-chapter-rewrite.ts            ~180   channels, guard, finish-reason, ledger (A9R-06; absorbs regen-repair + regen-llm)
                 channels.ts                        ~150   whole / edit-list / insert-list / phrase-list parsers
  regen/ bible-deref.ts ~60 · instructions.ts ~110 · validators.ts ~160 · passes/*.ts ~450 · registry.ts ~200 (executable)
  floors/ clue.ts ~180 · discriminating-test.ts ~90 · clearance.ts ~150 · injection-templates.ts ~140
  chapter-obligation-context.ts                     ~220
  completion-fallback.ts                            ~160
  polish/ post-pass-polish.ts ~330 · full-story-polish.ts ~170 · polish-provider.ts ~110
  repair-ledger.ts                                   ~90   replaces repair-efficacy + module counters
apps/worker/src/jobs/agents/agent9/regen-phase.ts   ~180   runRegenPhase driver (A9R-01)
```

Net for the area plus its worker wrappers: ≈ −600 lines, with no file over ~450.

## 5. Suggested sequence

1. **R0, independent, each alone:** A9R-11 deletions; A9R-04 R0 (named evidence regexes plus parity test); A9R-02 R0 (shared constants plus the inventory test with its allow-list); A9R-13 types.
2. **A9R-03 step 1:** rollback-reason telemetry and the Azure truncation fix, then run the free offline replay of the 08-26 polish responses. This produces the evidence the owner needs.
3. **A9R-07:** the run-scoped ledger. Every later step becomes measurable.
4. **A9R-05, then A9R-06:** file split and shared engine, with a recording-`RegenFn` and mock-client characterisation first.
5. **A9R-01:** the executable registry and `runRegenPhase` (with area 04 / S4).
6. **R2 decisions for the owner, behind flags:** A9R-03 step 2, A9R-04 merge, A9R-02 detector widening, A9R-08 channels, A9R-09 roles, A9R-10 tier.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `AGENT9_REGEN_EDIT_LIST` | off | `regen-llm.ts:47` (per call) | PROBE ANSWERED, promote | Rewrite passes pin `editList: true` anyway; the flag now matters only for non-pinned rewrite passes |
| `AGENT9_POLISH_PROVIDER` / `_ANTHROPIC_MODEL` | off / claude-sonnet-5 | `polish-provider.ts:56-62` | DEFER (R6) / CONFIG | Header docs are stale (Opus in use; "one call site" but full-story polish also uses it) |
| `AGENT9_CLEARANCE_AT_END` | off | `deterministic-repair.ts:664` | DELETE candidate | Read inside the floor; belongs in the floor spec |
| `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` | **on** | `generate.ts:3203` | PROMOTE | Selects exactly the lexical-gate stage modes (A9R-03) |
| `AGENT9_POLISH_RETRIED_CHAPTERS` | off | `generate.ts:3190` | DEFER | — |
| `AGENT9_FULLSTORY_POLISH` | off | `generate.ts:4521` | DEFER | Its A_71 `clueTerms` guard is never passed (§9) |
| `AGENT9_REGEN_CLUE` | on (.env) | `generate.ts` | PROMOTE | Ignores `AGENT9_MODEL_REGEN` (A9R-10) |
| `AGENT9_REGEN_{SCAFFOLD(on), PRONOUN(on), LEAKAGE, DUAL_VALUE, MECHANISM, TRANSITION, RESOLUTION, CULPRIT_EVIDENCE, SUSPECT_ELIM, LOCKED_FACT, AFTERMATH_REPEAT, REVEAL_MODIFY}`, `AGENT9_VOICE_ENFORCE` | see flags.ts | worker `agent9/flags.ts`, `agent9-run.ts:3548-3562` | mixed | Each gates a hand-written wrapper block; LOCKED_FACT and PRONOUN are absent from the registry (A9R-01) |

## 7. Safety net

- **Covered:** 19 test files, 233 tests, all green (MEASURED in the build copy): regen-integration, registry, repair, llm, edit-list, the RC tests, geometry reveal and aftermath, polish-provider, the full-story polish pair, splice guard, det-repair early insert, clearance culprit, injection totality, clearance parity. `agent9-prose.test.ts` covers the det-repair builders, the fallback chapter and the polish prompt.
- **Gaps:**
  - `repair-efficacy.ts` has 0 tests.
  - `polishPassingChapter`'s rollback paths are untested for Azure finish reasons.
  - Nothing runs real floor builders through the scaffold detector or `isInjectedSentence` (A9R-02).
  - `prose-guard` fixtures pin retired templates.
  - The worker wrapper blocks have no direct test.
- **Write first:**
  - (1) a recording-`RegenFn` characterisation of every runner (requests plus verdicts);
  - (2) a mock-client characterisation of polish, full-story polish and expansion `chat()` arguments;
  - (3) the floor-template inventory test;
  - (4) phase-driver order tests over the flag matrix on `agent9-replay.ts`.

## 8. What NOT to refactor

- **The deterministic floors and their template wording** (ADR-0003/0007). Move them freely; rewording changes shipped prose (R2).
- **`preserveOriginalParagraphsValidator`'s strictness** (the `repair.ts:153` lesson). Change the channel (A9R-08), not the guard.
- **`acceptanceReason` and the `scopedValidate` hybrid** in `runRegenRepair` (A_73 §32). It is subtle and load-bearing.
- **The 15% length tolerance and the both-values guard on dual-value.** Both are false-win guards.
- **Per-call env reads** (the dotenv-freeze trap).
- **Claiming a polish slot before the call** (`generate.ts:3240`). Keep the one-attempt invariant.
- **The two scope pairs, dual-value per-chapter/residual and resolution/reveal_repair.** These are scopes, not duplicate bodies.
- **Name-hash frame selection**, which keeps clearance output reproducible.
- **`polish-provider.ts`'s telemetry sharing and the Anthropic `MIN_MAX_TOKENS`.**

## 9. Incidental defects

1. **Scaffold detector blind to current floor templates** (A9R-02). Since 07-17, 3 of 5 A1 sentence shapes evade it; since 07-31, all 3 clearance frames do. The A3 seed and exhaustion floor target retired text. **High confidence** (measured with the built detectors).
2. **`INJECTED_SENTENCE_PATTERNS` misses 9 of 10 floor templates.** A reveal delivered by the det-repair fallback reads `met`, not `met_by_injection`. **High.**
3. **Suspect-elimination pass and floor disagree** on scope, vocabulary and name matching (A9R-04). **High** on the code; frequency unmeasured.
4. **Polish finish-reason check ignores Azure `length`/`content_filter`** (`post-pass-polish.ts:286`). **High.**
5. **`clueTerms` guard never wired.** Neither `runFullStoryRepetitionPolish` (`:685`) nor `full-story-diagnostic.ts:408` passes it, so the A_71 "clue reworded out" gap is live when the flag is on. **High.**
6. **Clue regen on the prose tier** despite `AGENT9_MODEL_REGEN` (A9R-10). **High.**
7. **X50 `??` role bug** in 4 suspect-set copies and the fallback investigator (A9R-09). **Medium** (depends on Agent 3 archetype strings).
8. **Clue-paste lead skips A_68 title-casing** (`deterministic-repair.ts:346`). **Low–medium.**
9. **Atmosphere efficacy counts chapters as calls** (`generate.ts:4504`). **High.**
10. **The DT floor has no counter**, and `DeterministicRepairResult` flags are dropped in production. **High.**

## 10. Cross-area observations

- **Recogniser drift.** Any detector that hand-copies generator text drifts. Look for writer/recogniser pairs everywhere: prompt examples vs linters, and templates vs `phrase-analysis` allow-lists. A "run the real builder through the real detector" test is the general fix; the lifecycle interaction test is the precedent.
- **Registry as documentation.** An enumerability table with string references, checked against source text, invites drift. Other registries (flag register, geometry code partition) should be checked for whether they are executed or merely asserted.
- **Prompt vs validator.** Prompts that instruct removal of what validators require (REVIEW_12 §5, and here polish): audit every LLM "improve prose" prompt against the lexical gates downstream of it.
- **Two-site capability wiring.** "One capability, two call sites, one wired" recurs: the model tier here, the provider seam in `full-story-diagnostic.ts`. Resolve at the choke point (inside the factory or client), not at call sites.
- **Module-level run counters.** They assume one story per process, and exist in at least three modules here. A run context object is the cross-agent fix.
- **Whole-chapter rewrite clones.** The LLM "rewrite chapter → parse → guard → rollback" shape also exists in `full-story-diagnostic.ts` and likely in other agents' repair paths.

## 11. Open questions for the owner

1. For A9R-03: gate polish off floor-touched chapters, or teach polish the must-survive tokens? Is the offline replay of the 08-26 polish responses acceptable as the deciding evidence?
2. For A9R-02 R2: should the scaffold detector (and therefore the rubric cap) widen to the current templates, knowing it will lower scores on runs that paste?
3. For A9R-04: which clearance vocabulary and scope is canonical, the regen's (paragraph, witness/saw) or the floor/lint's (chapter, constraint/observation)?
4. Should `runClearanceRegenPass` be deleted, or wired as the per-chapter clearance pass the registry says exists?
5. Is the det-repair fallback's `castNames` omission (A9R-12) intended?
