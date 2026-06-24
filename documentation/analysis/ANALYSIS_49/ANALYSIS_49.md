# ANALYSIS_49 — Implementation plans for the four deferred ANALYSIS_48 items (the "needs a live-run gate" upstream fixes)

Status: **planning doc — four code-grounded implementation plans (one architect pass per item, verified against the repo).** Sibling of [ANALYSIS_48](../ANALYSIS_48/ANALYSIS_48.md) (which landed the three *safe* Tier-1 fixes) and [ROADMAP_TO_80](../ANALYSIS_47/ROADMAP_TO_80.md). These four items were deferred from A_48 not because they're low-value but because each **changes generation behavior or run control flow** and so must be landed one focused PR at a time, **flag-gated, and validated on a full Azure run** before the flag is flipped — the same discipline ROADMAP_TO_80 prescribes for M4.

---

## 0. TL;DR

1. **All four are real levers on the frozen rubric marks**, and all four are mostly *wiring existing-but-disabled machinery* — effort **M** each, not L.
2. **The shared rule (non-negotiable):** every change ships behind an env flag **default-OFF**, keeps the current behavior as the fallback, lands with unit tests, and is only flipped ON after a live run confirms the target metric moved and nothing regressed. Telemetry (the existing shadow logging) stays on so we can diff old-vs-new every run.
3. **Recommended order** (lowest-risk / highest-confidence first): **T1.7+T1.6 (novelty store)** → **T1.8 (clue restructure)** → **T1.2/T1.3 (Agent 7 outline)** → **T1.4 (voice gate)**. Rationale in §5.
4. **Each plan below is self-contained**: current state (file:line), target, phased steps, risks + safe path, validation, rollback + effort.

### Summary

| Item | Rubric lever | Core move | Flag | Effort | Live-run gate |
|---|---|---|---|:--:|---|
| **T1.7+T1.6** | premise (frozen 7) | persist a cross-run fingerprint ledger; feed `recent(20)` into Agent 3 avoidance; then lower the skip threshold | `NOVELTY_CROSS_RUN` (+ `generation-params.yaml` threshold) | M | two consecutive runs differ on ≥2 structural fields |
| **T1.8** (+T2.10/11) | clues, pacing, prose | restructure the clue record `{observable, inference, pointsTo, first_full_reveal_chapter}` **additively** (keep `description` derived); one-insight + one-clearance gates | none (additive) → `AGENT5_*` for the gates | M | no Ch9/Ch10 double-clearance; no verbatim leak |
| **T1.2+T1.3** | pacing (→5), plot, opening | make `buildSceneGrid` authoritative (one job/chapter, no adjacent repeat) + per-chapter word budget; invert the length-rewarding scorer | `AGENT7_SCHEDULER_AUTHORITATIVE` | M | one job/chapter, word counts near target, pacing ≥7 |
| **T1.4** | dialogue (frozen 6), character | strengthen the 2b prompt for distinct registers/tics, then enforce `checkVoiceCapsules` as a bounded retry gate | `AGENT2B_VOICE_CHECK=enforce` | M | register diversity, retries ≤1, dialogue off 6 |

---

## 1. T1.7 + T1.6 — Wire the cross-run novelty store *(recommended first)*

**Rubric lever:** `premise` (frozen 7 — every run is the "manipulated clock at a manor").

### Current state
- `@cml/novelty` (`packages/novelty/`) is **built, tested, and unwired** — `index.ts:11-13` literally says "NOT wired into the pipeline"; zero imports under `apps/`. It exposes `NoveltyStore.append/recent/judge` (`store.ts:22/:36/:45`), a pure deterministic `judgeNovelty` (`compare.ts:81`, free), and a `Fingerprint` shape (`types.ts:40`) of five structural fields (`axis, mechanism_family, false_assumption_pattern, discriminating_test_shape, inference_shape`) the live CML already exposes.
- Agent 8 (`auditNovelty`, `agent8-novelty.ts:337`) compares only to **static seeds** (`agent3-run.ts:291`), identical every run; `buildNoveltyConstraints` (`shared.ts:699-742`) is seed-derived.
- It never runs: `generation-params.yaml:167` `similarity_threshold_default: 1.1` → `shouldSkipNovelty = threshold >= 1` (`agent3-run.ts:282`) → always skipped, and the skip path writes a **vanity `total:100/grade:A`** (`:451-476`).

### Target state
A persistent ledger of **shipped** runs' fingerprints. On each successful run, append the CML's skeleton. Before Agent 3, load `recent(N)` and fold prior-run structures into `ctx.noveltyConstraints.avoidancePatterns/divergeFrom` so Agent 3 is pushed away from recent runs. The **free deterministic `judge`** becomes the gate; the static-seed LLM audit becomes optional.

### Phased steps
1. **Persistence** — new `packages/novelty/src/persistence.ts`: `loadLedger(path)` / `appendToLedger(path, fp)` using the repo's atomic temp-write+rename convention (`apps/api/src/db.ts:123-132`). File: `data/novelty-ledger.json` (`{version:1, shipped: Fingerprint[]}`), path via `CML_NOVELTY_LEDGER_PATH ?? <cwd>/data/novelty-ledger.json`. Cap ~500 entries. **Separate from `store.json`** (append-only, independent of the API DB).
2. **Append-on-ship** — in `mystery-orchestrator.ts` success path (after status computed, before the return ~:1126, only when `status !== "failure"` and prose exists): a small `cmlToSkeleton(CASE)` mapper (reuse the fields `buildNoveltyConstraints` already reads, `shared.ts:713-717`) → `appendToLedger`. `try/catch`, best-effort, never fails a shipped run.
3. **Load + merge** — in `mystery-orchestrator.ts` ~:720 after `buildNoveltyConstraints`: `new NoveltyStore(loadLedger(path))`, take `recent(20)`, fold each fingerprint's structural fields into `avoidancePatterns`/`divergeFrom` (capped, mirroring the existing `.slice(0,12/16)`). **This is the divergence lever — no LLM cost.**
4. **Lower the threshold (T1.6)** — `generation-params.yaml:167` `1.1 → 0.7`; keep the `NOVELTY_SIMILARITY_THRESHOLD` env override for tuning.
5. **Gate** — alongside `runNoveltyAudit` (`agent3-run.ts:287`), call `store.judge(cmlToSkeleton(ctx.cml), N)`; if `verdict !== "distinct"`, push `divergence_directive`+`shared_structure` into `strongerConstraints` and regenerate via the existing `:330` path (cap 1 retry via `retriesEnabled`). Advisory by default; `NOVELTY_HARD_FAIL=true` (already read at `:363`) makes a persisting `clone` an error.
6. **De-vanity the score** — `agent3-run.ts:451-476`: when cross-run is on, score from the judge verdict, not a hardcoded A.

### Risks & safe path
Cost is ~0 (the judge is deterministic/free; keep the LLM audit off by default). Cold start: `judgeNovelty` returns `distinct` on an empty corpus (`compare.ts:82-83`) — first runs proceed. Regen capped at 1. Whole feature behind `NOVELTY_CROSS_RUN` (default off). Concurrency: last-write-wins via atomic rename (serialize with a save-promise chain like `db.ts:137` if jobs run concurrently).

### Validation
**Unit** (`packages/novelty/src/__tests__/`): append `run_A`, then `judge({...run_A, id:run_B})` → `clone` with `nearest.id=run_A`; ledger round-trip + 500-cap; `cmlToSkeleton` maps a real `examples/*_cml2.yaml` CASE to the right enum buckets. **Live:** run twice with `NOVELTY_CROSS_RUN=1`; the two shipped CMLs differ on ≥2 structural fields and `data/novelty-ledger.json` grows by one per run.

### Rollback & effort
Revert `:167` to `1.1` (instant re-skip) or `NOVELTY_CROSS_RUN=0`; delete the ledger to reset. **Effort M** (≈60-line module + one mapper + two orchestrator hooks + one gate + config + tests). No DB/schema change.

---

## 2. T1.8 (+T2.10/T2.11) — Restructure the Agent 5 clue record *(recommended second)*

**Rubric lever:** `clues`, `pacing`, `prose`.

### Current state
- `Clue = {id, category, description, sourceInCML, pointsTo, placement, criticality, supportsInferenceStep?, evidenceType?}` (`agent5-clues.ts:106-116`) — `description`/`pointsTo` are full spec **sentences** (the historical leak source).
- The fixed-slot scheme **mandates** three cross-referenced IDs `clue_mechanism_visibility_core` / `clue_core_contradiction_chain` / `clue_core_elimination_chain` (`:456-478`, repeated in the output contract `:855`).
- Deterministic synthesizers write full-sentence duplicates: `agent5-run.ts:825/:873/:1722` ("Direct evidence links/ties {culprit}…").
- **Blast radius** (every consumer of `description`/`pointsTo`/IDs): suspect-coverage/elimination guardrails (`agent5-run.ts:1248-1316, 1507-1541, 1579`), fair-play audit (`agent6-fairplay.ts:478-487, 757`; evidence IDs `:364`), prose obligation block (`obligation-block.ts:92-93, 403, 416`), clue-validation seam (`clue-validation.ts:528`; note `surfaceSpecKeyTerms:390` already reduces the sentence to terms — i.e. `observable` is a precomputed version), deterministic-repair (`:124-151, 242, 257, 419`), prompt-builder/`generate.ts:266`/`phrase-analysis.ts`, and the typed `clue-spec` deriver (`ClueSlot.keyTerms` is the natural home for `observable`).

### Target state (ADDITIVE — back-compat preserved)
Add `observable?` (renderable key-terms, not a sentence), `inference?` (the deduction), `first_full_reveal_chapter?` (state in full once, reference thereafter). **Keep `description` always-readable** via `deriveClueDescription(clue) = clue.description ?? composeFromObservableInference(clue)` so no consumer ever sees `undefined`. Rules: no two clues share a normalized `pointsTo` (one-insight); ≤1 elimination clue per suspect (one-clearance — fixes the Ch9/Ch10 smear).

### Phased steps (each observably inert until the last)
1. **Schema + prompt (additive).** Add the three fields to `Clue` (`:106`); add `deriveClueDescription()`; update the JSON output schema (`:800-812`) and prompt rules (`:848-870`) to request them + the "state once / reference after `first_full_reveal_chapter`" discipline. `description` stays optional-but-derived. Ships with zero behavior change.
2. **Synthesizers.** Rewrite `:825/:873/:1722` to emit `observable`+`inference`+`pointsTo` and set `description = deriveClueDescription(...)` so guardrail text-blobs still match.
3. **Slots → tagging.** **Keep** the three `clue_*_core` IDs (preserve cross-refs); give each a distinct `observable`/`inference`/`first_full_reveal_chapter` so they're no longer prose-identical. Reference re-pointing only.
4. **Gates.** Add `checkPointsToDistinctness(clues)` (normalized `pointsTo`) and extend `analyzeSuspectCoverage:1588` with `overEliminated` (flag `eliminationLike > 1`); repair demotes/merges the 2nd elimination per suspect.
5. **Flip read-sites.** `clue-validation.ts:528` use `observable ?? description`; `obligation-block.ts:403/416` pass `observable` (skip `surfaceSpecKeyTerms` when present); fair-play renders `observable + inference`.

### Risks & safe path
Never remove the `clue_*_core` IDs (step 3 tags, not deletes) → `discriminating_test.evidence_clues` and `clue_to_scene_mapping` keep resolving. `description` is always populated (derived) → fair-play/obligation pipelines unchanged until step 5. Steps 1-4 are inert; step 5 is the only behavior flip.

### Validation
**Unit** (`agent5.test.ts`/`agent5-clues.test.ts`): no two clues share normalized `pointsTo`; `overEliminated` empty (≤1 elimination/suspect); `deriveClueDescription` non-empty (back-compat); synthesizers populate `observable`/`inference`. **Live:** Agent-5 phase-score ≥80 unchanged; no Ch9/Ch10 double-clearance; no verbatim spec-sentence in prose (cross-check the committed `dedupeByDescriptionSimilarity`); `clues`/`pacing`/`prose` hold or rise.

### Rollback & effort
Additive fields + derive-helper → revert = remove the fields + two gates; no migration (old CMLs fall back to `description`). **Effort M.**

---

## 3. T1.2 + T1.3 — Authoritative beat scheduler + per-chapter word budget

**Rubric lever:** `pacing` (dropped to 5), `plot_structure`, `opening_hook`.

### Current state
- `runAgent7SchedulerShadow` is the **last** statement of `runAgent7` (`agent7-run.ts:1582`), called *after* `ctx.narrative` is committed; it builds the grid (`:57`), invariant-checks (`:59-61`), and only `console.info`s a diff (`:62-66`). "Acts on nothing" is literal — returns `void`, no caller reads the grid. Gated by `AGENT7_SCHEDULER_SHADOW` (default on, logs only).
- The LLM outline is the sole authority; ~700 lines after `formatNarrative` (`:842`) are band-aids the grid would guarantee by construction (`applyDeterministicCluePreAssignment:356`, clue-coverage force-assign `:1471`, closure splices `:1519-1554`).
- **Verbosity bug:** every scene is hardcoded `estimatedWordCount: 1800` (`agent7-narrative.ts:875`); `prompt-builder.ts:1772` does `Math.max(scene.estimatedWordCount, chapterTargetWords)` so the 1800 beats `short`'s ~1,000 ideal → ~1,800-word chapters → pacing 5. (`computeChapterObligation`, `chapter-obligation-contract.ts:98-99`, already derives the *correct* target from `getStoryLengthTarget` — it's just overridden.)
- **Scorer inversion:** `scoreSceneDetail` (`agent7-narrative-scorer.ts:261-285`) gives more points for longer summaries.
- **Adjacency smear:** the PENULTIMATE SCENE RULE (`agent7-narrative.ts:750`) is an unenforced prompt line → Ch9+Ch10 both run clearances.

### Target state
After the outline is built and gated, **overwrite each scene's `cluesRevealed` and attach `chapterJob`/`obligations` from the grid** (positionally by scene index). The grid guarantees one distinct job per slot, essential reveals before the test, clearances landed once in Act II+ (`schedule.ts:147-184`). Per-chapter `estimatedWordCount` = `getStoryLengthTarget(targetLength).chapterIdealWords`. Scorer rewards concision near target.

### Phased steps (behind one flag)
1. **Flag** near `agent7-run.ts:38`: `AGENT7_SCHEDULER_AUTHORITATIVE` (default OFF); keep shadow telemetry.
2. **Promote the builder**: refactor `runAgent7SchedulerShadow` → `buildAgent7Grid(ctx, narrative): SceneGrid|null` (build + invariant-check + log; `null` on `SchedulerInfeasibleError`).
3. **Apply authoritatively**: new `applyGridToOutline(narrative, grid)` at the end of `runAgent7`, only when `flag && grid && grid.sceneCount === flattenNarrativeScenes(narrative).length`; per scene `i` set `cluesRevealed = grid.slots[i].cluesRevealed`, `chapterJob = grid.slots[i].function`, stash `obligations`. Gate on equal **total** count; skip+warn on mismatch.
4. **Word budget**: in the same pass, set every `scene.estimatedWordCount = chapterIdealWords` (neutralizes the `Math.max`).
5. **Prompt default fix** (safe regardless of flag): `agent7-narrative.ts:875` replace literal `1800` with the resolved `chapterIdealWords`.
6. **Schema**: add optional `chapterJob?`/`obligations?` to the Scene interface (`:185-224`).
7. **Invert `scoreSceneDetail`** (`agent7-narrative-scorer.ts:261-285`): full points for a tight 2-3-sentence summary near the per-chapter word window; penalize bloat and too-short.
8. **Suppress redundant band-aids when authoritative**: guard the closure splices (`:1519-1554`) + `applyDeterministicCluePreAssignment` (`:356`) to no-op when the grid already provided coverage (running both re-introduces the smear).

### Risks & safe path
Grid clue IDs must match `ctx.clues.clues[].id` — they're built from the same `ctx.clues` (`:48-53`) so they align, **but verify on a full run** (this is M4: "not flipped blind"). Apply the grid *after* all gates so retries still see LLM output. Gate on equal total count only (don't reorder scenes). Flag default-OFF; shadow telemetry stays on to diff grid-vs-outline every run.

### Validation
**Unit:** `applyGridToOutline` overwrites `cluesRevealed` positionally + sets `chapterJob`; no two adjacent slots share `clear_suspect`; every scene `estimatedWordCount === chapterIdealWords`; count-mismatch skips+warns; bloated summary now scores lower than a tight one. **Live (`short`):** one distinct `chapterJob`/chapter; no adjacent duplicate clearance (Ch9=test+proof, Ch10=name culprit+denouement); chapter word counts cluster near 1,000; judge **pacing ≥7** (from 5).

### Rollback & effort
Unset the flag (steps 3-4, 8 no-op); steps 5-7 independently revertable; no migration (new fields optional). **Effort M** — small logic, mostly existing; the cost is the required full-run validation.

---

## 4. T1.4 — Enforce `checkVoiceCapsules` as a bounded retry gate

**Rubric lever:** `dialogue` (frozen 6), `character_clarity`.

### Current state
- The shadow check (`agent2b-run.ts:89-106`, `AGENT2B_VOICE_CHECK` default off) projects profiles → `VoiceCapsule` and runs `checkVoiceCapsules`, but only pushes telemetry to `ctx.warnings`; nothing reads `ok`/`metrics`/`issues`. The artifact is already committed at `:59/:64`.
- `checkVoiceCapsules` (`agent2b-voice-capsule.ts:250-353`) computes `register`, `deployableCount` (concrete register AND ≥1 tic, `:313`), `uniqueRegisters` (`:272/:344`), `duplicatePairs` (trigram overlap of register+tics ≥0.7, `:317-337`). `ok` is true with no *error* issues (`:349`) — so `duplicate_voice` (warn) doesn't fail today.
- **Why voices collapse:** `register` comes only from `deriveRegister(speechMannerisms)` (`:123-138`) keyword-scan; the 2b prompt (`agent2b-character-profiles.ts:53-135`) asks for `speechMannerisms` generically, never requires a *distinct* register per character, and nudges everyone to "measured/precise/formal" → 4-of-5 land on `formal`/`plain`.

### Target state
The 2b prompt produces one distinct register + one concrete quotable tic per **active speaker** (so the gate passes on attempt 1 in the common case); `checkVoiceCapsules` runs as a bounded retry gate; on failure a targeted feedback string (reuse the issue `feedback` fields `:285/:309/:333`) drives one retry; after exhaustion, accept the best set with a warning — never abort. Gate: `uniqueRegisters >= ceil(0.6*count) && duplicatePairs == 0 && deployableCount == count`.

### Phased steps
1. **Strengthen the prompt** (`agent2b-character-profiles.ts:78-118`): a VOICE DISTINCTNESS section — assign each active speaker a register from `{formal, plain, terse, florid, warm, cold}`, each used at most once unless speakers > registers; one concrete quotable tic each, no shared tics; explicitly forbid all-"measured/precise/formal"; deliberately contrast. Add `terse/florid/warm/cold` so `deriveRegister` (`:129-134`) maps them. (This alone diversifies the deterministic projection — no schema change.)
2. **Wire the gate** in a bounded loop in `runAgent2b`: after `extractVoiceCapsule`+`checkVoiceCapsules`, evaluate the threshold; on failure join top `issue.feedback` strings (prioritize `duplicate_voice` then `empty_register`), append via `appendRetryFeedback` (`shared.ts:458`) into the `tone` arg, and re-call `generateCharacterProfiles`.
3. **Thresholds** (justified by ANALYSIS_48 §5): `ceil(0.6*count)` tolerates intentional pairing in big casts while breaking the 4/5-formal collapse; `duplicatePairs==0` is the direct anti-collapse lever; `deployableCount==count` guarantees every speaker is quotable. **Gate only active speakers** (filter out victim/silent roles).
4. **Bound + accept-after-exhaustion**: `AGENT2B_VOICE_MAX_RETRIES` (default 1); on exhaustion keep the best attempt (lowest `duplicatePairs`, then highest `uniqueRegisters`), warn, continue — mirror `withValidationRetry`'s exhaustion (`validation-retry-wrapper.ts:128-149`). Never throw.

### Risks & safe path
Retry storm if the prompt underperforms → cap at 1 retry + a **third** mode `AGENT2B_VOICE_CHECK=enforce` (default off), flipped on only after a live run. Over-tight threshold on tiny casts → the active-speaker filter + 0.6 (not 1.0) + accept-after-exhaustion. **Interaction with the landed T1.5 humour atoms** — add "vary humour styles too (≥2 distinct)" so register and humour diversity reinforce, not collapse onto one axis. Cost: ≤1 extra N-profile call per failing run.

### Validation
**Unit** (`agent2b-voice-capsule.test.ts`): a 5-capsule all-`formal` set fails the gate; distinct registers/tics clear it; feedback string contains the `:333` "Differentiate…" text. **Live:** log `uniqueRegisters`/`duplicatePairs`/`deployableCount`/retry count (expect 0-1); confirm `dialogue` moves off 6 and `character_clarity` 6→7.

### Rollback & effort
Set `AGENT2B_VOICE_CHECK` back to shadow/unset → gate + feedback path inert (prompt strengthening is benign, can stay). **Effort M** (prompt S + bounded loop M + threshold/tests S; no schema change, no new agent).

---

## 5. Sequencing & cross-cutting protocol

**Recommended order and why:**
1. **T1.7+T1.6 (novelty)** — *additive and isolated*: a separate ledger file + a constraints feed; cold-start safe; instant kill-switch (revert the threshold). Lowest blast radius, and the only lever on the frozen `premise`.
2. **T1.8 (clue restructure)** — additive fields with a derived `description`, so steps 1-4 are inert until one read-site flip; large blast radius but fully back-compat.
3. **T1.2/T1.3 (Agent 7)** — behavior-flipping (the grid becomes authoritative); needs the live-run clue-ID alignment check (M4). Do after the clue work so the grid's clue IDs and the restructured ledger are settled together.
4. **T1.4 (voice gate)** — last because it's the most retry-sensitive; it benefits from being tuned on a stable pipeline, and the prompt-strengthening half can land early (benign) while the enforced gate waits for a live read.

**Shared live-run validation protocol (apply to each before flipping its flag):**
- Land code + unit tests with the flag **OFF**; confirm the suite is green and the shadow/telemetry diff is sane.
- Flip the flag in a single replay against a known project; capture the rubric report + the item's specific metric (premise divergence / clue distinctness / pacing & one-job-per-chapter / register diversity).
- **Accept only if** the target metric moved in the right direction **and** no previously-passing rubric category regressed and no new hard cap fired. Otherwise revert the flag (code stays) and iterate.
- Keep the shadow logging permanently so every future run reports old-vs-new.

**Cross-cutting risks:**
- **Death-method chain (already landed):** the Agent 7 word-budget must not starve the reveal chapter below the death-method obligation; check the reveal still names the killing.
- **Clue IDs are the shared currency** of T1.8 *and* T1.2/T1.3 (the grid reads `ctx.clues`) — land/validate the clue restructure first so the grid consumes stable IDs.
- **Two retry-bearing gates (T1.4 voice, T1.2 outline)** — stagger them; never flip both flags in the same run, so a retry regression is attributable.

**Effort:** all four are **M**. None requires a new LLM agent, a DB migration, or a schema rename. The dominant cost is the live-run validation budget, not the code.

---

## 6. What this unblocks

These four are the remaining Tier-1 items from ANALYSIS_48 §6. With them landed and validated, the upstream artifacts carry: a non-repeating premise (novelty), deduped one-insight clues with a paced one-clearance structure (clue restructure), a paced outline with one job per chapter and a real word budget (scheduler), and distinct character voices (voice gate) — on top of the already-shipped manner-of-death, de-anchored mechanism exemplar, and humour atoms. That is the bulk of the "artifacts stop capping the prose" precondition ROADMAP_TO_80 named for Agent 9 to reach a dependable 73–76 and a credible run at 80. Tier 2/3 (the blind-reader surprise inversion, the 3b plausibility judge, and the scorer rewrites) remain as the next program after these land.
