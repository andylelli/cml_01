# Owner decisions — the code-review programme, 2026-09-30

The R1 work that needed no one's decision is done for CR-01–06, 08, 10, 11, 14, 18, 20–22, 24 and 25, and in part
for CR-12, 16, 19 and 33 (README §0). What is left needs you. **98 ledger items** (every open question, and every row
whose note says OWNER) wait on a decision. **147 more** sit in the v1 prose engine, which takes bug fixes only.

This document puts the decisions in the order that unblocks the most. Each has the evidence, the options, one
recommendation and what it releases. The appendix lists all 98 items by CR, generated from
`tools/ledger-state.tsv`, so nothing here is a hand-kept copy of the ledger.

Evidence labels follow CLAUDE.md: **MEASURED** was run this session; **INFERRED** is read from code.

---

## DECIDED 2026-09-30 (owner) — STATUS

The owner answered: **1 (b)** retire v1; **2 (b)** `@cml/cml` with an explicit `role` winning over the archetype;
**3** guard 2b, 2c and 4, leave 5 and 7; **4** make `CASE.death_method` legal; **5** A34-01's four convergences,
one section at a time; **the rest as recommended** (6–11 and §12). Work order is by what each unblocks, cheapest
first; the v1 retirement needs one paid recording, so it waits for its parameters to be approved.

| # | Decision | Status | Commit | Note |
|---|---|---|---|---|
| 4 | `CASE.death_method` a legal clue source | todo | | `workerLegal` in `@cml/cml` source-paths.ts |
| 3 | JSON guard at 2b, 2c, 4 | todo | | `parseLlmJson(raw, { guard })`; 5 and 7 stay unguarded |
| 5 | Normaliser convergence, one section at a time | todo | | the characterisation snapshot shows what each moves |
| 6 | Discriminating evidence: ≥2, once, before Agent 6 | todo | | later stages read, never write (ADR-0005) |
| 2 | One role predicate, `role` wins, shadow counter first | todo | | `[identity-disagree]`; flip after N runs |
| 7 | A6-D01 true cost; delete the phase-score retry path | todo | | |
| 8 | `HONEST_SCORERS=enforce`, retire vanity scorers, 35/35/15/15, scorer owns caps, report when scoring off | todo | | |
| 9 | One flag vocabulary, warn on anything else | todo | | |
| 10 | `castGenders` applied after Agent 2; one binary vocabulary | todo | | |
| 11 | Refuse a second concurrent run at the API | todo | | |
| 12 | Owner CRs per §12 | todo | | CR-07 batch behind one flag, then CR-28/29/30/32/34 |
| 1 | Retire v1 | todo (needs a paid recording) | | re-base `full-d0ee7b26`, `-noscore`, `from-clues-d0ee7b26` onto v2 first |

---

## 1. The v1 engine rule — 147 items wait on it

**Decision.** Does the v1 prose engine (runAgent9's body below the v2 early return, `generateProse`,
`agent9-prose/`) stay bug-fixes-only?

**Evidence.** Since 2026-09-25 v2 is the engine (chapter per call). v1 is still the engine in four of the five replay
fixtures (only `v2-prose-cdad5315` runs v2) and holds most of the review's Agent 9 findings: CR-15, 17, 23, 26, 27 and 31 are 61–100% v1 items.

**Options.**
- (a) Keep the rule. The 147 items stay open until v1 is retired.
- (b) Retire v1: delete the engine behind `PROSE_ENGINE=v1`. Most of the 147 close as moot.
- (c) Lift the rule for R0/R1 moves only; replay pins v1 byte for byte.

**Recommendation: (b), after one matched pair confirms v2 on the v1 fixture's seed.** Keeping over 7,000 lines alive
for bug fixes costs every future change a v1 path to keep compiling. (c) spends effort on code with no future.
Retiring v1 means first rebasing the full-pipeline fixtures (`full-d0ee7b26`, its `-noscore` variant and
`from-clues-d0ee7b26`) onto v2, or they stop replaying.

**Disclosed.** Some v1 files were touched before this rule was set. Unused imports and locals in `generate.ts` and
`agent9-run.ts`, the `BatchCallbackFailure` fix and the `buildRetryPacketFeedback` rename were all replay-proven.
This session added two v1 bug fixes and nothing else:
- SCO-D06: the prose rescore drops the fallback trust cap. One line, `1db19ec1`.
- CANARY_REPLAY_FAIRPLAY_ADVISORY was registered in the flag checker. No v1 code changed (`ec4665c2`).

## 2. One role predicate — A34-02, A1X-01, A1X-Q01 (CR-12)

**Evidence, MEASURED.** `scripts/role-predicate-disagreement.mjs` runs all 2,502 archived cast members through each
old site predicate and the `@cml/cml` one. The members come from 109 Agent 2 casts and 103 CMLs in
`data/store.json`, 137 library cases, and the replay stores. **577 disagreements.**
- Most are the old sites reading `role_archetype` only, while `roleTextsOf` also reads `role`. There the new
  predicate is right: "innocent heiress" with role "victim".
- Some old verdicts are wrong: "Actress and victim's former mentee" is counted as the victim.
- But the new detective predicate also marks members whose `role` is "suspect" as detectives. Examples:
  "Outsider Investigator" and "police inspector, official authority". Agent 9 then never clears them.

**Options.**
- (a) `@cml/cml` as is.
- (b) `@cml/cml`, but an explicit `role` field wins over the archetype.
- (c) Keep the per-site predicates.

**Recommendation: (b).** The `role` enum is the one field that answers the question (X50). It fixes the "Outsider
Investigator" class and keeps the gains. Ship it behind a shadow counter (`[identity-disagree]`, A1X-01) for N runs,
then flip.

**Releases:** A34-02, A1X-01 step 2, A6-07 (the suspect list), A6-D04, A9W-04, A9R-04.

## 3. The JSON guard at the unguarded boundaries — ORC-Q03, A34-D07, A9V-Q06 (CR-20)

**Evidence, MEASURED.**
- Unguarded, jsonrepair turns text that is not JSON into a value: prose becomes a string, YAML becomes an array.
  That value then fails a shape check with the wrong error.
- **At Agent 4 a well-formed YAML reply of a valid CML degrades.** jsonrepair's array means the YAML fallback never
  runs (`agent4-revise-characterisation`, "a YAML reply"). Agent 3 is guarded, so its fallback works.
- The guard reads only the tail character, so a payload cut just after an inner `}` passes it.

**State.** Each boundary is now one word: `parseLlmJson(raw, { guard })`. The unguarded boundaries are 2b, 2c, 4, 5
and 7, plus the v1 prose parser.

**Recommendation: guard 2b, 2c and 4 now; leave 5 and 7.**
- Agent 5 flags truncation itself and retries.
- Agent 7 refuses on `finishReason` first.

Then decide separately whether the guard should check the parsed shape rather than the tail character.

**Cost.** A payload repaired today would be refused and retried: one extra call, only when the model truncates.

## 4. Is `CASE.death_method` a legal clue source? — A5-Q01, A5-D03 (CR-16)

**Evidence, MEASURED in the review.** The Agent 5 prompt demands a clue sourced at `CASE.death_method` (A_67 FIX-2).
The worker's validator rejects that path and rewrites the clue to `steps[0].observation`. In all four golden bundles
the tell never sits on `death_method`.

**State.** It is one field now: `workerLegal` in `@cml/cml` `source-paths.ts` (`ec47208f`).

**Recommendation: make it legal.** That was FIX-2's intent. The prompt and the validator stop contradicting each
other on every run.

## 5. The two CML normalisers' divergent defaults — A34-Q01, A34-D16, A34-D05 (CR-14)

**State.** Both normalisers now sit side by side in `cml/normalize.ts` as two profiles. A characterisation snapshot
covers 137 library cases plus 8 kinds of damage. **23 of 25 probed fields still differ** (A34-01's table).
Examples:
- Agent 3 defaults a missing mechanism to "Poisoned tea." — a phrase its own prompt bans.
- Agent 3 drops the schema's `role` and `moral_complexity` on every run (A34-D16).
- Its last-resort culprit can be the detective (A34-D05).

**Recommendation (A34-01's):**
- neutral defaults;
- preserve schema fields;
- case-insensitive enums;
- culprit integrity on both paths.

Do it one section at a time. The snapshot shows exactly what each convergence moves.

## 6. One discriminating-evidence policy — A5-Q05 (CR-16)

**Evidence.** Three policies rewrite `discriminating_test.evidence_clues`:
- "≥1 only when empty" (Agent 5);
- "back-fill to 3" (the pre-prose gate);
- "≥2" (Agent 9).

The field changes after the fair-play audit has read it.

**State.** The scoring behind all three is now one function (`04e0bc58`).

**Recommendation:** ≥2, applied once, before Agent 6 audits the case. Later stages then read it and never write it
(ADR-0005).

## 7. Retries and cost — A6-D01, SCO-Q02, ORC-Q01 (CR-19, CR-18)

**Evidence.**
- Agent 6's retry budget never charges the first retry of each cost source (A6-D01).
- Per-call cost on `ChatResponse` (CR-19) would fix that, and would therefore make some runs abort that pass today.
- Separately, phase-score retries are off by default (`AGENT_PRE9_ENABLE_LLM_RETRIES`), and their abort path is
  unreachable (ORC-11).
- **Premise found false this session:** the ledger said per-agent costs were correct since CR-06. They were not for
  2b, 2c, 2d, 2e and 3b: `withValidationRetry` summed running totals. Fixed in `07898bd0`; telemetry only.

**Recommendation.**
- Take A6-D01, charging the true cost. The budget then means what its number says.
- Delete the phase-score retry path and its abort (ADR-0003), rather than restoring it. It has not run at default
  since the deterministic mode.

**Releases:** CR-19's core, SCO-08, SCO-Q02, ORC-Q01, A6-Q01, A5-Q06.

## 8. Scoring honesty — SCO-Q01, SCO-Q06, SCO-07, SCO-Q08 (CR-18, CR-30)

**Evidence.** The vanity scorers are about 3,400 lines. `HONEST_SCORERS` has run in shadow.
- The fair-play diagnostic weights 40/40/20; the scorer weights 35/35/15/15. MEASURED: 100 against 85 on one input.
- The trust cap is 88 in the adapter and 85 in the scorer.
- The expected clue set is derived three ways.

**Recommendation.**
- Promote `HONEST_SCORERS=enforce` and retire the vanity scorers (CR-30).
- 35/35/15/15 everywhere.
- The scorer's table owns the caps.
- Write the report when scoring is off (SCO-Q08). The run's raw flag record (`2d009a33`) already writes regardless.

## 9. Flag vocabularies — ORC-Q05 (CR-22)

**State.**
- Every run now records the raw flag environment it saw, in `logs/run-config-<runId>.json` and the report's
  `run_config`. The names are generated and checked by `flags:check`.
- The worker's two boolean idioms are one helper each.
- **Still eight vocabularies.** Examples: `AGENT7_STRUCTURED_OUTPUT=on` reads OFF, and some flags accept `y` where
  others do not.

**Recommendation.** One vocabulary: `1|true|yes|on` and `0|false|no|off`. Log a warning on any other value. The raw
record makes the change auditable run by run.

## 10. Gender — A1X-Q03, the Agent 2 re-roll (CR-12, CR-21)

**Evidence.**
- Agent 2's schema-repair re-roll has never passed the user's `castGenders`. It is now an explicit
  `characterGenders: undefined`.
- `designCast` normalises gender to binary; the worker's `normaliseCastOutput` still accepts "non-binary".

**Recommendation.**
- Apply `castGenders` deterministically after Agent 2 (A1X-Q03).
- One binary vocabulary, as the rest of the pipeline already assumes (A_73 §40).

## 11. Concurrency — ORC-Q06 (CR-33)

**State.** The shutdown flush is now per run (`ba1b5496`). The API still starts a run per request with no guard. A
timed-out run keeps executing in the background, and the prose repair counters are module state (v1).

**Recommendation: refuse a second concurrent run at the API.** Making the pipeline concurrency-safe means reaching
the v1 module state (decision 1).

## 12. The six owner CRs

| CR | Decision | Recommendation |
|---|---|---|
| CR-07 | 19 verified live bugs whose fix changes a prompt, chapter or outcome (VERIFIED-BUGS #1–4, 6–13, 19) | Batch the ones in non-v1 agents behind one flag and read one matched pair |
| CR-28 | Token budget: cap STORY TO DATE, fix stale block caps, stop sending facts 2–10× | Decide STORY TO DATE first (A9P-Q01); it decides whether the rest matters. v1 (decision 1) |
| CR-29 | Failure-aware retries; polish that respects the validators | Follows decision 7 |
| CR-30 | Retire or restore: vanity scorers, unreachable retry path, patch engine, unwired modules | Retire all four (decisions 7 and 8; the patch engine after its offline replay, A34-Q03) |
| CR-32 | Model routing: design model silences per-agent overrides; Agents 1, 4, 6 routing | Per-agent overrides outrank the tier (ORC-Q07) |
| CR-34 | Avoidable LLM calls | After CR-29 |

## 13. Not started — stopped here at your request

These are R1 and need no decision. They were not started because the session stopped after CR-16:
- **CR-16:** DONE 2026-09-30 (`12131e7c`, `6d13cdf7`, `9af9b5fd`). Three R2 findings came out of it, now in
  the appendix: A6-04 (WP8A's backstop-first ordering differs from the pre-LLM one in 65/65 planted cases),
  A5-08's remainder, A6-D09.
- **CR-13:** typed case view — 8 non-v1 items.
- **CR-17:** season, arc position and locked facts — 8 non-v1 items.
- **CR-27:** 4 non-v1 items.
- **CR-31:** 5 non-v1 items.

---

## Appendix — every open owner item

<!-- GENERATED by documentation/code-review/tools/owner-decisions-appendix.mjs from tools/ledger-state.tsv; do not edit by hand -->

**99 open items.**

### CR-03 (1)

| Item | What it asks | Ledger note |
|---|---|---|
| ORC-Q02 | ORC-07: may the replay harness adopt the live rubric path? Its historical scores become non-comparable with new ones. |  |

### CR-06 (2)

| Item | What it asks | Ledger note |
|---|---|---|
| SCO-D01 | Fair-play diagnostic drift: agent9-run.ts:5260-5263 (40/40/20) vs scorer 35/35/15/15. MEASURED 100 vs 85 on one input. | waits on SCO-Q06 (which weighting is canonical); the fix is one body for both, choosing needs the owner |
| SCO-Q06 | Canonical fair-play weighting for the diagnostic: 35/35/15/15? |  |

### CR-07 (4)

| Item | What it asks | Ledger note |
|---|---|---|
| A1X-Q03 | Enforce the user's castGenders deterministically in Agent 2 (D4)? |  |
| A5-Q02 | What should the AM/PM guard detect, given that a naive fix aborts on "I am"? |  |
| A7-Q05 | Approve a probe for the D1 fix (A7-03 step 2)? It changes Agent 7's prompt on every run. |  |
| ORC-Q01 | ORC-11: should an exhausted scoring retry ever abort (restore the intended behaviour), or should the dead abort be deleted in line with ADR-0003? |  |

### CR-09 (1)

| Item | What it asks | Ledger note |
|---|---|---|
| A9W-12 | Helper layer (3,645 lines) → 12 modules behind re-export shims | CR-09 waits: every consumer of the helper layer (agent9-run.ts:1-4096) is below runAgent9's v2 early return, so it is v1-only code; owner decision 2026-09-26: v1 takes bug fixes only, no refactors (same as CR-26) |

### CR-10 (1)

| Item | What it asks | Ledger note |
|---|---|---|
| A9G-D11 | A 4th back-edge exists at narrative-state.ts:46 (A9G-15). *High*. | the narrative-state back-edge matters only for S6 (extracting agent9-prose as a package), an owner question (A9G-Q03, CR-11) |

### CR-11 (2)

| Item | What it asks | Ledger note |
|---|---|---|
| A9G-15 | S6 evidence: 67 forward edges, 16 dead, 25 type-only; a 4th back-edge found | measurement for S6; its conclusion (a leaf prose-contracts package) is the owner's question A9G-Q03 |
| A9G-Q03 | S6: does A9G-15's edge profile (types plus leaf constants, 11 non-leaf value sites) settle it in favour of a leaf prose-contracts package? |  |

### CR-12 (9)

| Item | What it asks | Ledger note |
|---|---|---|
| A1X-01 | Detective/victim/name identity has 5+ bodies; two isDetectiveArchetypes disagree; Agent 2 reopens abort class #10 | R0 done (8f86016c): surname/namesMatch/nameAppearsAsWord moved to @cml/cml, re-exported; roleArchetypeIncludesWord deleted. OWNER (A1X-Q01): unifying the detective/victim predicates — 577 disagreements over 2,502 archived cast members (scripts/role-predicate-disagreement.mjs) |
| A1X-Q01 | Which detective semantics win when unified — head-noun/relational exclusion (@cml/cml), non-police qualifier | OWNER. Evidence: scripts/role-predicate-disagreement.mjs --examples (577 disagreements; examples per site) |
| A34-02 | ≥8 role-predicate sites with ≥5 semantics; abort-class #10 substring survives | MEASURED by the item's own rule: 577 old-vs-new disagreements over the archive, so R2 (owner, A1X-Q01). The new predicate fixes 'Actress and victim's former mentee' as victim, but marks some role:suspect members ('Outsider Investigator', 'police inspector, official authority') as detectives |
| A34-D05 | Last-resort culprit fallback can name the detective or victim | OWNER (A34-Q01): the last-resort culprit fallback (normalizedCast[0]) can name the detective or victim; fixing it changes the CML on that path |
| A6-07 | "Guess names the culprit": 3 matchers with opposite failure modes; blind reader told the detective and victim are suspects | OWNER (R2): one cast-aware guess resolver changes the blind-reader and T2.1 verdicts that gate |
| A6-D04 | The blind reader is told the detective and victim are "suspects" (:1721, agent6-fairplay.ts:911). Medium confidence on impact. | OWNER (R2): the blind-reader prompt lists the detective and victim as suspects; removing them changes the prompt |
| A6-D07 | T2.1 false positive on shared surnames (A6-07). With the reveal gate in enforce mode this can block. Medium confidence. | OWNER (R2): T2.1's same-surname match can block in enforce mode; changing the matcher changes a gate |
| A9R-Q03 | For A9R-04: which clearance vocabulary and scope is canonical, the regen's (paragraph, witness/saw) or the floor/lint's (chapter, constraint/observat… |  |
| A9W-Q04 | Is the single-culprit truncation in enforceCmlCulpritRoleIntegrity intended? |  |

### CR-14 (2)

| Item | What it asks | Ledger note |
|---|---|---|
| A34-D16 | A3 normaliser drops the schema's canonical role/moral_complexity on every run | OWNER (A34-Q01 step 2): the generate profile's cast list is a fixed field list, so role/moral_complexity are dropped every run; preserving them changes the CML every downstream prompt reads. Pinned by the characterisation's 'extra schema fields' damage |
| A34-Q01 | Normaliser defaults (A34-01 step 2): which direction wins for each divergent row? My recommendation: neutral | OWNER. The two profiles now sit side by side in cml/normalize.ts; each divergent row is one section of one profile, and the characterisation snapshot shows what a convergence moves |

### CR-15 (2)

| Item | What it asks | Ledger note |
|---|---|---|
| A9G-Q06 | Should the registry's misroute corrections (A9G-04 step 2) ship as one flag or several? |  |
| A9V-Q01 | For A9V-01 phase 2: should a lone clue-absent failure get the full retry budget (clue_timing)? Today it is unknown. |  |

### CR-16 (14)

| Item | What it asks | Ledger note |
|---|---|---|
| A34-Q04 | Structural repairs (A34-10): should repairCaseSoundness and the discriminator verifier run at CML |  |
| A5-02 | Source-path vocabulary: 5 bodies, diverged (CASE.death_method) | step 1 (R1) done: @cml/cml source-paths.ts is the one table (templates, derived regexes, one enumerator, prompt roots, retry templates); the worker validator, strict whitelist, retry templates, prompts-llm enumerator and the prompt's root list derive from it; equivalence test against verbatim copies over 137 library cases; Agent 5 prompt byte-identical on replay. Step 2 (OWNER): is CASE.death_method legal (the prompt demands it, the worker rewrites it) |
| A5-15 | generateExplicitClueRequirements vs @cml/clue-spec deriveClueSpec: two derivations | OWNER = A5-Q07 (when clue-spec becomes the prompt checklist) |
| A5-D03 | CASE.death_method prompt-legal, worker-illegal — HIGH, MEASURED (A5-02). | OWNER = A5-Q01 (is CASE.death_method a legal source?); the table (ec47208f) makes it one field |
| A5-Q01 | Should CASE.death_method be a legal sourceInCML in the worker (A_67 FIX-2's intent)? |  |
| A5-Q04 | Red-herring floor: a targeted red-herring-only call, or move the floor before the deterministic phases? |  |
| A5-Q05 | What is the one evidence-ID policy (≥1 / back-fill to 3 / ≥2), and at which stage is it applied once? |  |
| A5-Q07 | When does @cml/clue-spec become the source of the prompt checklist (A5-15)? |  |
| A6-04 | One deterministic clue-floor sequence exists in 4 orderings; one discards its repairs silently | R1 done: refreshCoverageOnContext (4 copies). MEASURED: pre-LLM and post-revision orderings agree in 65/65 planted cases; WP8A (backstop first) differs in 65/65, so one ordering at all four sites is R2 — OWNER |
| A6-D09 | synchronizeClueTraceabilityFromCurrentClues creates empty prose_requirements / discriminating_test_scene objects even on a no-op (:1227–1228). Low se… | MEASURED 0/103 archived CMLs lack prose_requirements.discriminating_test_scene, so the empty stub is never created in the corpus. When it is, Agent 7's prompt prints 'Act undefined, Scene undefined' (agent7-narrative.ts:468 tests the object for truthiness) and the schema's required fields fail. The fix (read without creating; create prose_requirements only on a write) changes Agent 7's prompt on that path: R2, owner (CR-07 class) |
| A7-D07 | Hallucinated clue IDs survive to Agent 9. They pass the pacing gate (raw non-empty count) and are stripped only on the pre-assignment path, which run… | OWNER (R2): the pacing gate counts hallucinated clue ids as clue-bearing; filtering them changes when the gate fires |
| A7-Q04 | Which placement default is correct for a clue with missing placement: act 2 or act 3 (A7-06)? |  |
| A9V-Q02 | Which body should own clue presence — the gate's chapter-level stemmed matcher or the scorer's paragraph-level one? (A_73 §4.2 is the same question.) |  |
| SCO-Q04 | Where should the clue-evidence matcher live: story-validation or the worker's agent 9 module? |  |

### CR-17 (8)

| Item | What it asks | Ledger note |
|---|---|---|
| A1X-Q04 | Pin 2d's specificDate to the hashed anchor rather than trusting the LLM (A1X-08)? | CR-03 found: 2d seeds the date from runId, so a resume that re-runs 2d re-dates the story (REPLAY.md) |
| A34-Q02 | Agent 9 and the registry (A34-03): should Agent 9 read ctx.lockedFactRegistry? If so, should secondary |  |
| A9G-Q02 | Who owns narrative state: the package (proposed) or the worker? And should the three whole-story passes move to the ship layer (A9G-05)? |  |
| A9P-Q06 | For each divergent fact pair (A9P-01 step 2): which body wins — e.g. the Bible's evenly spaced arc positions or the prompt's thresholds? |  |
| A9V-Q03 | Season repairer: when the case names a spring, should the floor ever rewrite bare "spring"? |  |
| A9W-Q01 | NSD ownership (A9W-02): should the package own the NarrativeState outright (worker adopts it), accepting that atoms/beat history start flowing into f… |  |
| A9W-Q02 | Bible (A9W-03): build once in the worker and pass into generateProse, or once in the package and return it? Either way, should worker regens get the… |  |
| ORC-Q04 | ORC-08: which arc-position formula is canonical? |  |

### CR-18 (9)

| Item | What it asks | Ledger note |
|---|---|---|
| A1X-Q02 | Should phase scores measure the raw LLM output (today for 1, 2, 2c) or the shipped, post-processed artifact? |  |
| SCO-07 | Prose-stage semantic duplicates: expected clue set ×3, fair-play weights ×2 (drifted), DT scene ×2, trust caps ×2 | OWNER: normalizeClueIdForMatch deduped (a422bd65). Remaining pairs have drifted and move reported numbers: fair-play weights (waits SCO-Q06), trust cap 88 vs 85, three expected-clue sets, keyword vs CML discriminating-scene resolver |
| SCO-D04 | retry-feedback.ts:54 "partial successes" compares score (0–100) to weight (≤3), so it never renders. :45 hides all minor | OWNER: retry-feedback 'partial successes' never renders (score vs weight) — fixing it changes retry prompt text (retries are off by default) |
| SCO-D08 | Agent 1 adapter discards location.description (agent1-scoring-adapter.ts:30). High. | OWNER: Agent 1 adapter discards location.description — fixing it changes the vanity score |
| SCO-D12 | Novelty "skipped" is recorded as 100/A and averaged into overall_score (agent3-run.ts ~700); the headline cap mitigates. | OWNER: novelty 'skipped' recorded as 100/A in the mean — a report-number policy |
| SCO-Q02 | Under ADR-0006, should phase-score retries exist? If yes, may exhausting them abort a run? |  |
| SCO-Q03 | Agent 3b under honest scoring: 85 or 75? Are strict/lenient modes wanted at all? |  |
| SCO-Q07 | Should 2b, 2d, 6.5 and 9 get honest check tables? |  |
| SCO-Q08 | Should the report (the ADR-0010 durable record) be written even when ENABLE_SCORING is off, with phase scoring as an optional |  |

### CR-19 (1)

| Item | What it asks | Ledger note |
|---|---|---|
| A6-D01 | The retry budget never charges the first retry of each cost source. perCallCostDelta (:1477) sets its baseline on first observation, which happens *a… | OWNER: charging the first retry of each cost source can newly trip the $0.15 Agent 6 retry budget, which THROWS (aborts the run); calls cost $0.002-0.008, up to ~$0.03 uncharged today. A run-outcome change, so it goes with CR-29 |

### CR-20 (4)

| Item | What it asks | Ledger note |
|---|---|---|
| A34-D07 | Agent 4 parser has no truncation guard on a full-CML re-emission | OWNER (ORC-Q03): Agent 4 is now parseLlmJson(raw, { guard: false, extract: "strict+repair" }) — guarding it is one word |
| A7-10 | agent7-narrative-schema.ts is a request schema, not a boundary parser; 3 drifted bodies of the outline shape | DEFERRED: a schema -> derived type -> boundary parser needs a schema source chosen (zod or FromSchema: a new dependency, owner); the request schema's flag AGENT7_STRUCTURED_OUTPUT is OFF and R4 was demoted to DON'T (REVIEW_05 §11.1). The parse half is done (8054d8a6) |
| A9V-Q06 | Is refusing truncated prose JSON (instead of repairing it) acceptable at the Agent 9 boundary? |  |
| ORC-Q03 | ORC-04: guard the four unguarded jsonrepair boundaries (2b, 2c, 4, prose)? That is R2: payloads that are repaired today would be refused and retried. | OWNER. Now one word per site (guard: false at 2b, 2c, 4, 5, 7). MEASURED for the decision: unguarded, jsonrepair turns non-JSON into a value (prose -> a string, YAML -> an array) that then fails a shape check; the guard reads only the tail character, so a payload cut just after an inner } passes it; and at Agent 4 a well-formed YAML reply of a valid CML DEGRADES — jsonrepair's array means the YAML fallback never runs (agent4-revise-characterisation 'a YAML reply') |

### CR-22 (1)

| Item | What it asks | Ledger note |
|---|---|---|
| ORC-Q05 | ORC-05: unify env-flag vocabularies (so that 1 means on everywhere), with a warning on unknown values, and register the four unregistered and two mis… |  |

### CR-25 (2)

| Item | What it asks | Ledger note |
|---|---|---|
| A5-12 | WeakMap memos keyed on a CML that is mutated in place | OWNER (with A5-D06): deriving the strict contract once after all CML mutation removes the caches, and changes clue output on remap runs |
| A5-D06 | Stale memo after remap — MEDIUM, INFERRED. After remapMissing… rewrites evidence_clues (:4255), the | OWNER: a 2-line fix (invalidate strictPromptFeedbackCache/strictSourcePathWhitelistCache after remapMissingDiscriminatingEvidenceIdsToExistingClues, as three other sites do) stops a fabricated clue on remap runs — it changes clues, so prompts downstream; needs a flag or the owner's yes |

### CR-27 (1)

| Item | What it asks | Ledger note |
|---|---|---|
| A9P-Q04 | Canonical guide text: notes/*.md or the in-code condensations (A9P-09)? |  |

### CR-28 (5)

| Item | What it asks | Ledger note |
|---|---|---|
| A5-Q03 | Keep asking the model for status, audit and inference, or wire consumers? Should the two suppressed |  |
| A9P-Q01 | STORY TO DATE policy: how many chapters verbatim, and are the rest summarised (A9P-03)? It decides whether the 24,000 ceiling, the craft floor and R8… |  |
| A9P-Q02 | Which copy of the outcome contract stays — system or user (A9P-07)? |  |
| A9P-Q03 | Pronoun block: raise its cap or shorten the rules? Temporal block: move the season rules to the top or raise the cap (A9P-04)? |  |
| A9P-Q07 | Should buildProseRequirements keep broadcasting every obligation to every chapter, given the obligation block's exclusivity design (A9P-08 item 2)? |  |

### CR-29 (5)

| Item | What it asks | Ledger note |
|---|---|---|
| A1X-Q07 | For legacy (non-constrained) Agent 2, skip re-rolls for deterministically fixable misses (A1X-05)? |  |
| A6-Q01 | A6-02 and A6-03 change retry prompts only on the AGENT_PRE9_ENABLE_LLM_RETRIES arm. Is that arm still intended to be probed, or should its code wait… |  |
| A6-Q02 | Agent 6.5 is treated as "creative texture" for scoring (A_53 P2), yet three parse failures abort the run. normalizeWorldDocumentStructure({}) already… |  |
| A9G-Q04 | Should residual classes that exhaustion accepts anyway stop consuming retries at attempts 1–2 (A9G-06 #2)? |  |
| A9R-Q01 | For A9R-03: gate polish off floor-touched chapters, or teach polish the must-survive tokens? Is the offline replay of the 08-26 polish responses acce… |  |

### CR-30 (14)

| Item | What it asks | Ledger note |
|---|---|---|
| A1X-Q05 | Delete F5b and the Agent 1 realism belt on the evidence of zero report counts, or keep as belts? |  |
| A1X-Q06 | Is Agent 8 (LLM) still meant to run anywhere, given NOVELTY_SIMILARITY_THRESHOLD=1.0? If not, fix D3 or freeze it. |  |
| A34-Q03 | Patch engine (A34-05): promote after an offline corpus replay, or record a verdict and delete? A pipeline A/B |  |
| A5-Q06 | The six AGENT5_ENABLE_LLM_RETRIES branches (≈ 350 lines) have not run at default since the deterministic mode |  |
| A7-Q01 | Is the AGENT_PRE9_ENABLE_CONTRACT_RECOVERY=0 mode (deterministic-only / fail-fast) still wanted? It is default ON, the OFF arm is never exercised, an… |  |
| A7-Q03 | If N6 promotes AGENT7_SCHEDULER_AUTHORITATIVE, @cml/beat-scheduler claims to replace "~700 lines of band-aids" (beat-scheduler/src/index.ts:6-8). Sho… |  |
| A9G-Q01 | A9G-03: restore the enhanced feedback at attempt 2 (a flag plus a probe) or accept terminal-only and delete ~1,050 lines? |  |
| A9G-Q05 | Delete the preferCompletionOnFailure abort path as contrary to ADR-0003 (A9G-13)? |  |
| A9P-Q05 | ROADMAP-FROM-82 §4b and the prose-brief redesign: keep staged, or delete (A9P-15)? |  |
| A9R-Q04 | Should runClearanceRegenPass be deleted, or wired as the per-chapter clearance pass the registry says exists? |  |
| A9V-Q05 | Retire rules whose counters stay at zero (near-vacuous stage wordlists, the adjacent-duplicate rule) once A9V-02 reports them? |  |
| A9W-Q03 | Under pronoun_policy: verify, ~400 lines of worker deterministic pronoun code never run. Keep strict/relaxed as supported arms (then unify their guar… |  |
| SCO-Q01 | Promote HONEST_SCORERS=enforce and retire the vanity scorers and adapters (SCO-01)? If both stay, is permanent shadow the |  |
| SCO-Q05 | Keep comparePromptVariants for the R6 eval harness, or delete it? |  |

### CR-31 (3)

| Item | What it asks | Ledger note |
|---|---|---|
| A9R-Q02 | For A9R-02 R2: should the scaffold detector (and therefore the rubric cap) widen to the current templates, knowing it will lower scores on runs that… |  |
| A9R-Q05 | Is the det-repair fallback's castNames omission (A9R-12) intended? |  |
| A9V-Q04 | May the gate adopt geometry's disclosure/aftermath detectors (stricter than today) behind a flag? |  |

### CR-32 (3)

| Item | What it asks | Ledger note |
|---|---|---|
| A34-Q05 | Agent 4 model tier: should Agent 4 run on the design tier, as the YAML comment assumes? |  |
| A6-Q04 | Should AGENT6_MODEL be made effective, with separate labels for the auditor and the blind reader (the ".env.local.example" low-risk tail)? |  |
| ORC-Q07 | ORC-14: should a per-agent model override outrank the design tier? |  |

### CR-33 (4)

| Item | What it asks | Ledger note |
|---|---|---|
| A7-Q02 | Should S7 be re-scoped from "delete coercion sites" to "consolidate plus per-site counters"? A7-11 argues that four zeros cannot justify deleting the… |  |
| A9W-Q05 | May the report fields rewrite_pass_count (always 0) and the five duplicated telemetry fields be dropped from the diagnostics schema? |  |
| ORC-12 | Four "one run per process" singletons, while the API permits concurrent runs → per-run RunTelemetry | process-guards flush keyed by run (ba1b5496). Waits (v1): the repair counters (deterministic-repair.ts, repair-efficacy.ts) are module stores in agent9-prose. OWNER: refuse concurrent runs at the API (ORC-Q06) |
| ORC-Q06 | ORC-12: should the API refuse concurrent runs, or should the pipeline be made concurrency-safe? |  |

### CR-34 (1)

| Item | What it asks | Ledger note |
|---|---|---|
| A6-Q03 | Can the post-revision provisional audit (A6-16 #1) be replaced by the deterministic audit without a probe, given that its output feeds a payload A6-0… |  |
