# Outstanding Redesign Items — what remains to make the new system live & testable

> A living tracker of everything *deferred* by the blue-sky redesign program in
> [`../12_system_redesign/`](../12_system_redesign/). The 15 agent docs describe the target; this
> file records the gap between what is **built and proven offline** and what is needed for an
> **integrated, end-to-end-testable pipeline** — plus the UI/API alignment surface.
>
> Branch: `redesign/agent-blue-sky`. Last updated: 2026-06-22.
>
> **Related:** [`../14_chat-gpt-scoring-alignment/aligning-the-scoring-system.md`](../14_chat-gpt-scoring-alignment/aligning-the-scoring-system.md)
> — a parallel workstream to replace the headline score with the holistic prose rubric (tracked in §4 below).

---

## 1. Status in one paragraph

Across the program we built **eight isolated, pure, default-dark packages** (one per agent area) plus
the live, flag-gated changes to Agents 1/2/2b–2e/4 from the earlier phase. All are green in isolation
— **229 unit tests across the foundations** (verified: period-kb 66, cml-core 65, device-library 23,
clue-spec 15, style-contract 19, beat-scheduler 11, novelty 12, prose-guard 18; ~122 of these added
this session) — and every redesign's core thesis is validated on **real shipped data** via offline/
live spikes. **None of this session's packages are wired into the live pipeline.** So the *foundations*
are tested; the *integrated new system does not exist yet as a runnable pipeline*. Three gates stand
between here and an end-to-end test (§3).

---

## 2. What is DONE (built, tested, committed)

| Area | Package / change | Tests | Real-data evidence |
|---|---|---|---|
| Agent 1 (era/setting) | `@cml/period-kb` (+ live flag) | 66 | EraOracle / anachronism linter |
| Agent 2-family (2/2b/2c/2d/2e) | live prompts-llm/worker changes, flag-gated | — | stop-bleeding + diversity retry, shadow scorers |
| Agent 3 keystone | `@cml/cml-core` (typed CML + timeline/deducibility/uniqueness + certify + repair-loop) | 65* | corpus shadow (0/6 machine-checkable today), live certify-loop converged |
| Agent 3b | `@cml/device-library` + **device-binding checker** in cml-core | 23 + 12 | retrieval ≥3, feasibility gate, binding goldens |
| Agent 4 | `agent4-patch` (patchCmlNode), graceful degrade, `CML_REPAIR_MODE` | — | live Spike A: 387-byte node patch |
| Agent 5 | `@cml/clue-spec` (`deriveClueSpec`) | 15 | **synthesizer coverage 20/20** over 19 runs |
| Agent 6 | `proveSolvability` + `DifficultyReport` in cml-core | (in 65*) | live blind-reader **8% false-veto, checker 0 flips** |
| Agent 6.5 | `@cml/style-contract` | 19 | Spike-A expressibility + gate-inversion |
| Agent 7 | `@cml/beat-scheduler` (`buildSceneGrid`) | 11 | **11/12** grids complete/ordered/covered |
| Agent 8 | `@cml/novelty` (fingerprints + ledgers + verdict) | 12 | **dark-code confirmed**; cliché catch 4/8→8/8 |
| Agent 9 | `@cml/prose-guard` (mutate-then-validate, backstop, chapter-as-contract) | 18 | §7.1 shadow: fair-play 12/12, coverage 10/12 |

\* cml-core's 65 tests = Agent 3 core (41) + 3b binding checker (12) + Agent 6 solvability (12). The
"23 + 12" for 3b is device-library (23, its own package) + the binding checker (12, living inside
cml-core's 65 — not double-counted in the 229 total). All flag names below were verified present in
the codebase.

**Discipline held everywhere:** isolated/pure/dependency-light packages; built on the cml-core
keystone where the redesign points; `tsc` + vitest green; dist gitignored; honest spikes (including
where findings were more nuanced than the doc's hypothesis); **the live pipeline never destabilized**
— all additive and default-off.

---

## 3. The three gates to an end-to-end test of the new system

1. **Wiring.** Zero of this session's packages are imported by `apps/worker`. Each must be plugged
   into its agent runner behind a flag. *No LLM platform needed for this step itself.*
2. **The P2 structured-output platform + the deferred LLM halves.** Constrained decoding / strict
   tool-use is the single highest-leverage shared dependency; five redesigns gate on it (§4). Until it
   exists, the LLM-driven halves of those agents cannot be built.
3. **API + UI serializer updates** for the artifact shapes that change (§5).

> **Fastest route to a *real* first test** (needs none of gate 2): wire **Agent 9 Phase A**
> (`mutateThenValidate` + best-draft backstop) into the live runner behind
> `mutation_revalidation_enabled` / `best_draft_backstop_enabled`, and stand up **shadow mode** for
> Agents 5/6/7/8 (log-alongside, act on nothing) using the existing offline harnesses.

---

## 4. Cross-cutting platform dependencies (block multiple agents)

- **P2 — Structured output / constrained decoding** (highest leverage). Required by: 3b recombination
  (one strict device), Agent 5 Stage-B render, Agent 6 reader panel verdicts, Agent 8 `Fingerprint` +
  `NoveltyVerdict` extraction/judge, Agent 9 critic. Today's stack is text-JSON + `jsonrepair`.
- **P3 — Validation-gated mutation as a *platform law*.** `@cml/prose-guard`'s `mutateThenValidate`
  is the reference implementation; the principle (no mutation ships unvalidated) should be lifted to a
  shared utility every agent's deterministic passes use.
- **P4 — Golden/canary replay harness.** Several spikes assume a replay rig (Agent 9 regression
  goldens, Agent 6 historical-kill canary, Agent 8 verdict-distribution canary). A shared P4 harness
  needs to exist to gate flag promotion.
- **Cross-run / persistent stores.** Agent 8's `NoveltyStore` (append-one-fingerprint-per-run) and
  the device-library `usage_log` need a persistent, governed home (file/KV), versioned per run.
- **LLM extractor pattern.** Agents 3b, 5, 6, 8, 9 all need a "model emits a typed sub-object"
  capability — one shared pattern, not five.
- **Scoring alignment (own workstream).** Replace the headline `overall_score` (today: average of 15
  deterministic per-agent artifact scores) with the holistic 10-category /100 prose rubric — an
  **LLM-critic-primary, checker-gated** `FinalStoryRubricScorer` whose hard caps are enforced in code
  from the deterministic checkers (most already exist; most facts readable today from the `CASE`/
  `clues`/`outline` artifacts, so this is **not blocked on the cml-core wiring**). Reuses P2
  (structured output) + P4 (replay/calibration). Full spec:
  [`../14_chat-gpt-scoring-alignment/aligning-the-scoring-system.md`](../14_chat-gpt-scoring-alignment/aligning-the-scoring-system.md).
  Its "Fastest Fixes" output also feeds the Agent 9 critic — so this advances Agent 9 too.

---

## 5. UI / API alignment surface

The web app reads a REST contract (`/api/projects/:id/{cml,clues,outline,prose,fair-play,
novelty-audit,hard-logic-devices,…}/latest` + SSE run events). **Today it is fully aligned** because
nothing is wired. As phases activate, these artifact contracts change shape and need a *coordinated*
`apps/api` serializer + `apps/web` update (they are flag-gated, so the UI keeps reading the old shape
until each flag flips):

| Endpoint | Change | Effort |
|---|---|---|
| `/novelty-audit/latest` | similarity decimal → `NoveltyVerdict` (verdict + nearest + directive) | real (new shape) |
| `/fair-play/latest` | `FairPlayAuditResult` → `SolvabilityProof` + `DifficultyReport` | real (new shape) |
| `/hard-logic-devices/latest` | five free-text devices → one structured device + feasibility verdict | real |
| `/prose/latest` | adds `contractFidelity` / `criticVerdicts`; drops linter-stats telemetry | minor (additive) |
| `/clues/latest`, `/outline/latest` | schema shape unchanged (field *ownership* changes, per each §5) | none expected |

**Open UI decisions:** (a) version the API so old/new artifact shapes coexist during canary; (b)
decide whether the UI should *surface* the richer new signals (explainable novelty verdict, difficulty
report, contract-fidelity, solvability proof) — a genuine UX upgrade over a bare decimal — rather than
merely not-break on them.

---

## 6. Per-agent outstanding items (the §9 ladders, distilled)

**Agent 1 — Era/Setting:** swap the `@cml/period-kb` stub oracle for the real KB across more decades/
places; promote `AGENT1_PERIOD_KB_ENABLED` from off → shadow → on.

**Agent 2-family:** promote the cast-check / constrained-cast / voice / spine / background flags from
shadow to active once shadow scorers are trusted.

**Agent 3 (keystone):** fold the typed core into the live generator (today's CML is still prose-in-a-
schema); emit the typed CML as the source of truth; run `certify` at the source so Agents 5/6/7
consume a proven model. **This is the biggest single integration and unblocks most downstream wins.**

**Agent 3b:** recombination LLM call under structured output (P2); wire feasibility to the real
period-kb oracle; emit the `grounding` block from Agent 3 so the **binding checker** (built) runs live;
fold 3b into Agent 3 as the mechanism sub-step.

**Agent 4:** promote `patchCmlNode` / graceful-degrade from shadow; add the binding-map as a
deterministic revision target.

**Agent 5:** flip the LLM contract from generate → render slots (P2); delete the synthesizers once the
coverage metric (proven 20/20) stays at zero in shadow; move placement onto the cml-core deducibility
checker; switch red herrings to `false_solution`.

**Agent 6:** wire `proveSolvability` as the authoritative correctness verdict (`agent6_checker_
authoritative`); remove the run-killing blind-reader `throw` *first*; build the N-persona panel (P2);
delete the escalation policy once correctness is guaranteed upstream.

**Agent 6.5:** the live Agent-9 conditioning thread (Spike B); exemplar *generation* (LLM); the
voice-distinctiveness / contract-conformance LLM-judges; thread the Style Contract into Agents 2/2b/2c/
7; delete the length floors + `FALLBACK_PARAGRAPHS` + force-set `validationConfirmations`.

**Agent 7:** swap `cluesRevealed` and the scene count from the grid (delete the band-aids —
`applyDeterministicCluePreAssignment`, the count lock, Bridge-Scene fabricator, vocabulary splice);
invert the prompt to the per-slot Dramatizer (P2); promote scheduler feasibility into Agent 4.

**Agent 8:** the live `NOVELTY_MODE = off|shadow|active` flag (turn the dark code on); LLM fingerprint
extractor + structural judge (P2); skeleton stage in Agent 3; persistent cross-run store; delete the
`1.1` magic number + `fail_delta` + the five-way weights.

**Agent 9:** wire Phase A live (the safety laws — **no upstream dependency, do this first**); LLM
critic in shadow → primary → delete the regex linter battery; delete deterministic prose mutation
(grounding lead, pronoun sweep) behind the wrapper; whole-book long-context write (P2/§4.4); adopt the
chapter-as-contract as authoritative once Agents 5/7 emit per-scene obligations (they now can).

---

## 7. Recommended sequencing

1. **Agent 9 Phase A live** + **shadow mode for 5/6/7/8** — real signal, near-zero risk, no P2.
2. **Stand up P2 structured-output** — the unlock for everything LLM-driven.
3. **Agent 3 typed-core integration** — the keystone; makes downstream contracts *arrive* proven.
4. **Promote per-agent flags** shadow → active, one at a time, each paired with its API/UI serializer
   change and gated on the P4 canary.
5. **Delete the band-aids** only after each agent's replacement is trusted in canary (every redesign
   removes more than it adds — the deletions are the payoff, not the start).

**Parallel track — scoring alignment (§4).** Can start *now*, independent of all pipeline wiring: the
rubric scorer reads the finished prose + the existing `CASE`/`clues`/`outline` artifacts, runs in
shadow alongside today's aggregator, and promotes once calibrated against a labelled reference. Its
deterministic hard caps (role collisions, leakage, pronoun instability) are the cheapest, highest-
value quality signals available and are enforceable today.

Each step is independently shippable and reversible; none requires a big-bang cutover.
