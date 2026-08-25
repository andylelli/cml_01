# Code audit backlog — checking the full codebase for bugs

**Written:** 2026-08-25 · **Type:** a TODO list, ordered by expected yield.
Descends from [ANALYSIS_73](../documentation/analysis/ANALYSIS_73/ANALYSIS_73.md), which reviewed the
tree in four passes and fixed what it could. This is what is left, why each item is worth doing, and
the command or method to do it with.

**How to use it.** Tick items as they are done and record the finding (or the negative result) in the
next ANALYSIS. A negative result is worth recording — §28 of A_73 is half its value, because it says
where NOT to look again.

---

## 0. What has already been checked — do not redo

| Pass | Coverage | Where |
|---|---|---|
| 12 review lenses | two-body duplication, read paths, inert code, prompts-as-code, degradation paths, interaction, build skew, representations, unreachable logic, test validity, resume/durability, UI truth | A_73 §11–§26 |
| Whole-tree mechanical sweep | all 308 files in `packages/*/src` + `apps/*/src` for: empty catches, loose equality, ReDoS, `sort()` comparators, unbounded loops, division guards, floating promises, TODO markers | A_73 §27–§28 |

**Where the defects actually were, so the next pass aims correctly:** not in local logic. Every
confirmed finding was a boundary where one concept existed twice and only one copy was observable.
Classic single-file bug classes came back essentially empty — 0 empty catches, 0 loose `==`, 0
ReDoS candidates, 0 TODOs in 308 files.

---

## 1. Surfaces that have never been reviewed at all

**These are the highest-yield items on this list, because nothing has looked here yet.**

- [ ] **`scripts/*.mjs` — ~30 files, zero review passes.** Two of A_73's findings already came from
      scripts (`run-cost-audit.mjs`'s undocumented 0.5 cache multiplier; `judge-pairwise.mjs`'s
      divergent price table), and these files are how every probe, ledger and cost figure is
      produced. A wrong script does not crash — it produces a confident number that gets quoted in a
      board. Start with the ones whose output has been cited: `run-cost-audit.mjs`,
      `external-read-ledger.mjs`, `judge-pairwise.mjs`, `cost-model-swap.mjs`, `axis-sweep.mjs`.
- [ ] **Vue components and reactivity — `apps/web/src`.** A_73 §24 found `$` printed on a GBP value
      and stopped there. Reactivity bugs (stale computed, missed watcher, a poll overwriting fresh
      state) are exactly the class that produced A_30's `loadScoringReport` defect, which wrote
      `null` over a loaded report every 3 seconds. Check every polling loop for the same shape.
- [ ] **Domain semantics of the ten unreviewed packages.** `beat-scheduler` (798 LOC),
      `clue-spec` (425), `cml-core` (1,406), `device-library` (330), `novelty` (604),
      `period-kb` (1,025), `prose-guard` (941), `rubric-score` (2,467), `story-geometry` (2,546),
      `style-contract` (377). They typecheck and their tests pass; nobody has asked whether they do
      the right thing. `rubric-score` and `story-geometry` are the two that gate the pipeline.

## 1b. Open from the 2026-08-25 scripts pass

Two script defects were found and fixed that day (the ledger arithmetic computing from disk;
`judge-ab.mjs` hard-coding marks the manifest now owns). This one was found, measured, and
**deliberately not fixed** — changing it changes the meaning of a number the plan quotes, and it
cannot be verified without `logs/llm.jsonl`.

- [ ] **`run-cost-audit.mjs` understates rework, and the cost governor is worth more than its number
      suggests.** `repeatCost`/`repeatCalls` group by `(runId, agent)` and charge everything *after
      the first call of each label* to repeats. But every repair pass gets its OWN agent label, so
      the first call of each is booked as fresh work. **MEASURED** on `scratchpad/a72-run-20260823.log`,
      chapter 4 alone:

      ```
      Agent9-ProseGenerator-Ch4      2 calls   <- 1 genuine first pass
      Agent9-Regen-Ch4-missing_clue  4 calls   <- all rework
      Agent9-AtmosphereRepair-Ch4    2 calls   <- all rework
      Agent9-PostPassPolish-Ch4      2 calls   <- all rework
      ```

      True rework is 9 of 10 calls; the metric counts 6. Across a run with 44 regen calls spread over
      five `Agent9-Regen-*` families, the undercount is substantial — so PLAN-TO-90 §7's *"repeat
      calls are 17% of the bill"* is a floor, not the figure, and **E1's value is understated by it**.

      The decision, not just the fix: is "rework" every call under a repair label, or only retries of
      the same label? Report both, and say which the £1 target is measured against. Needs
      `logs/llm.jsonl`, so it belongs with §2.

## 2. Checks that need the run artifacts (the other laptop)

`stories/` and `logs/` are gitignored, so these cannot be run from a fresh clone.

- [ ] **Confirm the clearance-vocabulary causal chain (A_73 §11.1).** Count clearance sentences
      across the archived manuscripts that match the WIDE vocabulary but NOT the narrow one. Non-zero
      means the injector has been firing on prose that was already correct, and a named reader
      complaint has a mechanical cause. Free, needs manuscripts only.
- [ ] **Settle the clue-matcher question (A_73 §4.2).** Put `clue_5`'s observable and `pointsTo` next
      to chapter 4 of `story_20260823-2038` and decide: did the model fail to plant it, or does the
      55%-of-10-tokens matcher false-negative on natural prose? **The single most valuable
      unanswered question in A_73.** Opposite fixes depending on the answer.
- [ ] **Verify the novelty ledger was in fact empty.** `ls apps/worker/data/novelty-ledger.json` and
      `apps/api/data/`. The fix works either way, but it decides whether Agent 3b has been diverging
      from 7 prior runs or from none — on the one engine that earns 9s.
- [ ] **B1's geometry replay.** Replay geometry over the archive and ask whether the 86-scoring runs
      would have shipped under a blocking gate. Prerequisite for the gate-authority decision, which
      has been open across four boards.

## 3. Finish the two-body sweep

The technique that found the most is not exhausted. For each concept below: how many bodies, and is
the divergence deliberate?

- [ ] **Price tables (4 bodies)** — `CostTracker`, `run-cost-audit.mjs`, `judge-pairwise.mjs`,
      `probe-run-token-economics.mjs`. Different coverage *and* different fallbacks: an unknown model
      defaults to `gpt-4.1` in one and `gpt-4.1-mini` in another, a 5x difference applied silently.
- [ ] **The 0.79 FX rate (4 bodies)** — and in `cost-tracker.ts` it is pre-multiplied into eight
      per-model constants, so changing it means hand-editing all eight with no unconverted list price
      left to check against. That is the mechanism behind "wrong about rates twice".
- [ ] **Retry/failure-class vocabularies** — the linter's `ProseLinterIssue.type` union, the retry
      router's classes, the validator's error types, and the geometry codes. Four enumerations of
      "what can go wrong" that must agree at their boundaries.
- [ ] **Geometry codes: the gate list vs the validator list.** X79 found this exact shape for
      mojibake. Same check, different vocabulary.
- [ ] **Write a parity test for each surviving pair.** The repo already has five
      (`mojibake-one-vocabulary`, `opening-grounding-vocabulary`, `primary-axis-vocabulary`,
      `retry-routing-vocabulary`, `degrade-abort-parity-r12`) plus the two added by A_73. The
      technique is proven in-repo; it has simply never been pointed at the large instances.

## 4. Prompt-as-code — eight blocks still unread

Reading one block found X63. Reading the next two found the `character_clarity` ceiling (A_72 §12)
and a contract that **forbids** what A3 would ask for (A_73 §14.1). This is the highest-yield
non-mechanical lens in the repo.

- [ ] `narrative_state` (5.2% of prompt) · [ ] `fair_play_contract` (5.2%) ·
      [ ] `pronoun_accuracy` (4.9%) · [ ] `scene_grounding` (2.6%) · [ ] `clue_descriptions` (2.2%) ·
      [ ] `provisional_scoring_feedback` (1.8%) · [ ] `character_consistency` (1.4%) ·
      [ ] `character_pressure_contract` (1.4%) — *partially read, A_73 §14.1*

For each, ask the three questions that have paid off: what does it REQUIRE, what does it FORBID, and
what is it silent about?

## 5. Test validity

A_73 §22.2 found a test that injects the parameter the bug is in. That is a class, not an instance.

- [ ] **Sweep for the same shape.** Every test that passes a path, a client, a clock or a config
      object explicitly cannot detect a defect in how that dependency is RESOLVED by default. Grep
      the suites for injected paths and ask what the default does.
- [ ] **Machine-specific paths.** One hardcoded `C:/CML/...` was fixed; `scripts/extract-story.mjs`
      still contains one.
- [ ] **Which critical paths have no test at all?** 291 test files against 308 sources is strong
      coverage of behaviour and says nothing about wiring — the ledger path had 14 passing tests and
      none of them touched the resolver.

## 6. Runtime, durability, concurrency

- [ ] **Classify the 19 non-atomic writes.** `writeFileSync` / `await fs.writeFile` against 9 that
      use temp-write-plus-rename. Which of the 19 are records (must be atomic) and which are logs
      (need not be)?
- [ ] **Stamp the resume checkpoint with a code version.** `promptFingerprints` catches prompt drift
      but not code drift, and this project's levers are overwhelmingly linter and repair changes. A
      run resumed across a change is a mixture of two builds with nothing recording the seam.
- [ ] **Concurrency assumptions.** Three module-level telemetry counters assume one run per process.
      True today; the assumption is written in a comment, not enforced.
- [ ] **`fetch` without timeout** in `apps/web/src/services/api.ts` — no abort controller anywhere.

## 7. Recorded, judged not-wrong-today

Revisit only if the surrounding assumptions change.

- [ ] `summarizeCalibration` returns `meanAbsError: 0` for an empty set, which reads as perfect judge
      agreement unless the caller checks `count`. Confirm every caller checks it.
- [ ] The 22 default-OFF flags across Agents 1-7 have never had FLAG-AUDIT's treatment
      (*unset is not the same as off*). Named in [FLAG-AUDIT.md](FLAG-AUDIT.md).

---

## 8. Where NOT to look

Ruled out by measurement, recorded so the effort is not spent twice.

- **Dead branches and impossible conditions.** Swept; nothing found beyond one configuration case
  (`NOVELTY_SIMILARITY_THRESHOLD=1.0`). The logic is sound where it is local.
- **Classic JS footguns** — empty catches, loose equality, ReDoS, missing sort comparators,
  unguarded division, unbounded loops. All swept, all clean.
- **More detectors on plot, clues and endings.** REVIEW_15 is the proof: the detectors for the
  reader's two largest complaints already existed and already fired.
- **Widening a wordlist to fix a wordlist.** The durable fix is one list; the durable check is the
  sweep in §3, not the patch.
