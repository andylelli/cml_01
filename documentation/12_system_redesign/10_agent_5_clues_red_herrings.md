# Agent 5 — Clues & Red Herrings: A Ground-Up Redesign

> Clues are not a creative act to be audited for fairness afterward — they are the *renderings* of inference steps the CML has already proven. Derive them, don't guess-then-police them.

*Written by Claude. This is my opinionated blue-sky redesign of Agent 5, the agent that turns a validated logical model into the concrete observations a reader sees and the misdirections that fool them.*

---

## 1. The job to be done

A fair-play whodunit makes a promise: **everything the detective uses to solve the case, the reader saw too.** Agent 5 is where that promise is kept or broken. Its job is to produce two things:

1. **Clues** — concrete, plantable observations that, taken together, let an attentive reader reconstruct the solution.
2. **Red herrings** — plausible-but-innocent details that pull the reader toward the wrong conclusion, then resolve benignly.

Here is the thing that the current design misses, and the hinge of this whole document: **by the time Agent 5 runs, the deductions are already decided.** Agent 3 produced an `inference_path` — an ordered chain of `{observation, correction, effect}` steps that *is* the solution's proof — plus a `discriminating_test`, a `false_assumption`, and (per the schema) a `false_solution` naming the convincing wrong suspect. Agent 4 validated it. The logic is settled and frozen.

So the job to be done is **not** "invent the clues." The job is: **render each already-decided inference step as an observable thing, and render each already-decided false belief as a misleading thing.** A clue's entire reason to exist is to make one inference step *available* to the reader. If a clue doesn't entail a step in the path, it's noise. If a step has no clue, the mystery is unfair — full stop.

That reframing — clues as a *projection* of the inference path onto the page, not an independent creative deliverable — is the whole redesign.

---

## 2. How it works today

Agent 5 today is two pieces:

- **The prompt builder** — [`packages/prompts-llm/src/agent5-clues.ts`](../../packages/prompts-llm/src/agent5-clues.ts) (~1,200 lines). It does something genuinely good and worth keeping: `generateExplicitClueRequirements()` walks `inference_path.steps` and emits a per-step checklist ("Generate a clue that makes the reader directly observe X"; "Generate a clue that provides evidence for correction Y"), with suggested placement and a legal `sourceInCML` path per requirement. It also injects bounds, legal source-path families, and a retry payload.
- **The runner** — [`apps/worker/src/jobs/agents/agent5-run.ts`](../../apps/worker/src/jobs/agents/agent5-run.ts), which is **~168 KB / 3,800 lines — one of the largest files in the repo.** The exported `runAgent5()` alone runs from line 2809 to ~3775. The bulk is a sprawl of deterministic checkers, repairers, and synthesizers.

The runner's shape, in its own words (from the function map):

- `enforceAgent5DeterministicContracts()` (line 2635) is a gauntlet of **gates that `throw` on failure**: source-path legality, inference step bounds, cast-name/path consistency, model-audit consistency, era time-style, locked-fact time conflicts, culprit-discriminating clue presence, discriminating-evidence-ID presence, strict step-coverage floors, strict prompt contracts, meta-clue text, discriminating-test reachability, and mechanism visibility.
- Between the gates sit **deterministic repairers and synthesizers**: `repairInvalidSourcePaths`, `repairCastNamePathConsistency`, `synthesizeMissingCulpritDiscriminatingClues`, `synthesizeMissingDiscriminatingEvidenceClues`, `synthesizeStrictStepCoverageBackstopClues`, `synthesizeSuspectCoverageBackstopClues`, `sanitizeRedHerringOverlap`, `pruneOverlappingRedHerrings`, `sanitizeEraTimeStyleInClues`.
- `runAgent5()` orchestrates a **retry cascade**: JSON-parse retry → guardrail retry → inference-coverage retry → suspect-coverage retry → red-herring-overlap retry → discriminating-test-ID retry → deterministic backfill → final hard gates.

The deterministic guardrails proper live in [`apps/worker/src/jobs/agents/shared.ts`](../../apps/worker/src/jobs/agents/shared.ts) — `applyClueGuardrails`, which enforces minimum essential-clue counts, **forces essential clues out of "late" placement** (`essentialLate.forEach(... clue.placement = "mid"/"early")`), bans detective-only phrasing, and dedupes IDs. The `ClueGuardrailIssue` type with `severity: "critical" | "warning"` is the currency of the whole subsystem.

The honest one-line summary: **the LLM generates clues freely; then ~3,000 lines of code interrogate, repair, and occasionally re-invent them to make them fair.**

---

## 3. Where it hurts

**Generate-then-audit-for-fairness is backwards.** This is the central wound. A clue exists *to support a specific inference step*. But Agent 5 asks the LLM to generate clues as a free creative act, and only *afterward* does the runner check "does step 3 have an observation clue? a contradiction clue? does the culprit have a direct-evidence clue? are essential clues before the test?" When the answer is no — which it routinely is, because the LLM was never structurally bound to the path — the runner either retries with more constraints or **deterministically synthesizes the missing clue itself** (`synthesizeMissingDiscriminatingEvidenceClues`, `synthesizeStrictStepCoverageBackstopClues`, `synthesizeMissingCulpritDiscriminatingClues`). At that point the system has admitted the real shape of the problem: *the set of clues that must exist is computable from the CML.* We're just computing it as a fallback after the LLM's freelance attempt instead of as the primary design.

This produces a specific, recognizable failure mode. The deterministic synthesizers fire because a creative gap was found — but a clue minted by a template ("a witness recalls the clock showed eleven, which contradicts...") is mechanical, flat, and unplantable. It satisfies the gate and degrades the prose. It's exactly the cross-cutting reality the whole redesign program keeps naming: **GENERATE→PARSE→NORMALIZE→PAD→PATCH, where deterministic fallbacks mask failures.** The gate goes green; the page goes grey.

**The monolith.** 168 KB is not a feature; it's accreted scar tissue. Every past failure left a checker, every checker that hard-failed too often grew a repairer, every repairer that mangled output grew a sanitizer. There are gates *and* their inverse synthesizers for the same property (check `getMissingDiscriminatingEvidenceIds`, then `synthesizeMissingDiscriminatingEvidenceClues`, then check again). The file is unreviewable as a whole and each addition raises the odds of a **NO-BACKSTOP GATE that kills a run** — one of those `throw`s in `enforceAgent5DeterministicContracts` aborts a generation that produced a perfectly good story, because a regex decided a `sourceInCML` path was illegal.

**The fairness logic lives in the wrong place — twice.** "Are all needed clues present and visible before the test?" is asked here (Agent 5 gates) *and again* in Agent 6 (`recomputeCoverageSnapshotForAgent6`, `ensureCriticalFairPlayBackstopClues` — Agent 6 imports Agent 5's coverage machinery and *re-synthesizes* clues). Two agents, two LLM calls, two retry budgets, both answering a question that is **deterministically decidable from the CML inference path**. That is pure token churn around a graph problem.

**The LLM is asked to make decisions it shouldn't own.** Today's prompt lets the model decide *which* clues exist, *how many*, *what they point to*, and — via the `status: "fail"` escape hatch — whether to even try. The retry code has to strip that escape hatch on retries ("Returning status=fail is not acceptable on this attempt"). When you're fighting your own model's permission to opt out, the contract is wrong.

---

## 4. Blue-sky redesign

**Thesis: clues are derived from the inference path, not generated alongside it. The set of required clues is computed; the LLM only renders each one as a concrete, plantable observation. Placement and visibility become a constraint the checker owns, not a guardrail file Agent 5 carries.**

### 4.1 Split the agent into three honest stages

**Stage A — `deriveClueSpec(cml)` (pure, deterministic, no LLM).**
A small typed function — the legitimate descendant of today's `generateExplicitClueRequirements` and `buildStrictPromptFeedback`, promoted from "prompt hint" to "source of truth." It reads the frozen CML and emits a complete `ClueSpec`: the exact list of clues that *must* exist, each as a slot, not yet prose. The mapping rules are mechanical:

| CML source | Derived clue slot(s) |
|---|---|
| each `inference_path.steps[i].observation` | one **observation clue** making that observation reader-visible |
| each `inference_path.steps[i].correction` | one **contradiction clue** entailing the correction over the false assumption |
| `discriminating_test.knowledge_revealed` + `pass_condition` | the **discriminating evidence** clue(s) the test turns on |
| `culpability.culprits[*]` | one **direct-evidence clue** tying each culprit to the mechanism |
| each eligible non-culprit suspect | one **elimination/alibi clue** clearing them |
| `false_solution.supporting_points[*]` | **red-herring slots** (see 4.3) |
| `false_solution.the_one_flaw` | a clue that the false solution *cannot* explain — the hinge |

Every slot is born with a stable `id`, an `evidenceType` (`observation | contradiction | elimination`), a `supportsInferenceStep`, a legal `sourceInCML`, and a `criticality`. **There is no question of "missing coverage" anymore — coverage is constructed, not audited.** The thing today's runner spends thousands of lines *checking and backfilling* is now the *input*.

**Stage B — `renderClue(slot, worldContext)` (LLM, constrained).**
For each slot, the LLM's *only* job is: turn this abstract requirement into a concrete, era-appropriate, plantable observation. Not "decide a clue exists" — the slot already guarantees that. With Opus 4.8 and native structured outputs, this is a constrained-decoding call returning exactly the slot's schema: `{ id (fixed), description, pointsTo, category, placement_hint }`. The model cannot invent a `sourceInCML` (it's fixed by the slot), cannot duplicate IDs (assigned), cannot return `status: "fail"` (no such field), cannot reference detective-only knowledge (the slot's `evidenceType` and the schema forbid it). **Most of the gate surface evaporates because the bad states are unrepresentable, not caught after the fact.** Batch all slots into one call so the model sees the whole evidence set and can keep descriptions distinct and non-redundant.

**Stage C — placement as a constraint solve, owned by the deducibility checker.**
This is the part I'd hand *off* Agent 5 entirely. The fair-play question — "is every load-bearing clue present and visible *before* the discriminating test, in an order that lets the reader deduce?" — belongs to the **deducibility/fair-play checker that the Agent 3 redesign owns.** That checker already proves the inference path is sound; clue placement is the same proof projected onto a timeline. Placement is a tiny constraint problem:

- essential clues for step *i* must land before the discriminating-test scene;
- a clue must not precede the fact it depends on;
- spread across early/mid/late to satisfy density.

A constraint solver (or a topological sort over step dependencies) assigns `early/mid/late` deterministically and *correctly*, replacing today's blunt `applyClueGuardrails` hack that just shoves essential clues out of "late" by parity (`index % 2 === 0 ? "mid" : "early"`). If the constraints are unsatisfiable, that's not an Agent 5 prose failure — it's a **CML defect** that should have been caught at Agent 3/4, and the error points there.

### 4.2 Red herrings are derived from the false solution, not invented

The CML already encodes the misdirection: `false_solution` (the convincing wrong accusation, its `supporting_points`, and `the_one_flaw`) and `false_assumption` (the misleading premise the reader holds). **Red herrings are the observable renderings of these.** For each `supporting_points[*]`, derive a red-herring slot whose `supportsAssumption` is that point and whose `innocent_explanation` (required by the schema) is the benign truth. The LLM renders it; it never invents which false beliefs to support.

This kills the single nastiest checker in the file — `findRedHerringTrueSolutionOverlap` / `sanitizeRedHerringOverlap` / `pruneOverlappingRedHerrings`, the lexical-overlap machinery that exists *only because* freely-invented herrings kept accidentally reinforcing the true solution. A herring derived from `false_solution.supporting_points` **cannot** reinforce the true solution by construction — it points at the innocent accused. The overlap problem was self-inflicted by free generation.

### 4.3 What collapses

Mapping the 168 KB onto the new design, here's what *disappears*:

- **All "missing coverage" gates + their synthesizers** (`getMissingDiscriminatingEvidenceIds`, `synthesizeMissing*`, `checkStrictStepCoverageFloors`, `synthesizeStrictStepCoverageBackstopClues`, `synthesizeSuspectCoverageBackstopClues`, `findCulpritDiscriminatingGaps`) — **gone.** Coverage is constructed in Stage A.
- **All source-path repair/validation** (`repairInvalidSourcePaths`, `checkSourcePathValidity`, `validateSourcePath`, the `ALLOWED_SOURCE_PATTERNS` whitelist) — **gone.** Paths are assigned by the slot, never authored by the model.
- **Inference-step-bounds, cast-name/path-consistency, model-audit-consistency gates** — **gone.** No free IDs, no free names, no self-reported audit to reconcile.
- **Red-herring overlap machinery** — **gone** (4.2).
- **The whole retry cascade in `runAgent5`** — **gone.** There's nothing to retry *for coverage*; there are at most localized re-renders if a single description is weak.
- **`applyClueGuardrails`'s placement-by-parity hack** — replaced by the checker-owned constraint solve.

What *survives*, much smaller: era-time-style rendering (better solved by giving the LLM the era's time vocabulary up front than by `replaceDigitTimesWithEraWords` post-hoc), and the locked-fact consistency check (Pillar 1) — though even that becomes "the slot carries the locked fact verbatim," not "scan output for conflicts." Realistically **the runner drops from ~3,800 lines to a few hundred.**

### 4.4 Worked example

CML (frozen) contains:

```
inference_path.steps[2] = {
  observation: "The study clock had stopped at the time of the will signing.",
  correction:  "But the gardener heard it chime the hour AFTER the signing — so it was reset.",
  effect:      "The signing time on record is false; the will was signed later than claimed."
}
false_assumption.statement = "The clock fixes the time of death."
false_solution = { accused_suspect: "the nephew",
  supporting_points: ["The nephew inherited everything", "He was alone in the study at the recorded time"],
  the_one_flaw: "He could not have reset a clock he never touched (no prints on the case)." }
```

**Stage A derives, deterministically:**

- `clue_obs_step3` — observation, supports step 3, `sourceInCML: inference_path.steps[2].observation`, essential, must appear before the test.
- `clue_contra_step3` — contradiction (the gardener's chime), supports step 3, `sourceInCML: inference_path.steps[2].correction`, essential.
- `clue_flaw` — derived from `the_one_flaw` (the clean clock-case, no prints), the hinge that breaks the false solution.
- `rh_nephew_inherits` — red herring from supporting_point 1, `supportsAssumption: "the nephew benefits most"`, innocent_explanation pre-loaded.
- `rh_nephew_alone` — red herring from supporting_point 2.

**Stage B (LLM) renders only the descriptions**, e.g. for `clue_contra_step3`: *"Old Hargreaves the gardener mentions, almost in passing, that he was deadheading roses beneath the study window and heard the mantel clock strike the hour a good while after the household had gathered for the signing."* Concrete, plantable, era-voiced — and the model *only* had to write the sentence, not decide the clue should exist or what it proves.

**Stage C (checker)** places `clue_obs_step3` and `clue_contra_step3` in early/mid (both before the Act-III re-enactment that is the discriminating test), `clue_flaw` mid, herrings early. It verifies — by topological order over the path — that a reader holding these clues can reach `effect` of step 3 and thence the solution. If yes, fair-play is *proven*, not estimated.

---

## 5. Ripple effects on the rest of the pipeline

**Agent 6 (Fair-Play audit) becomes mostly redundant — by design.** This is the biggest downstream win. Today Agent 6 re-derives coverage (`recomputeCoverageSnapshotForAgent6`), re-checks discriminating-test reachability and mechanism visibility, and even *re-synthesizes* clues (`ensureCriticalFairPlayBackstopClues`) — it's a second, LLM-backed pass at the exact question Agent 5 already gated on. In the new design, **fair-play is a property the construction guarantees and the checker proves**, not something to re-audit downstream. The deducibility checker (Agent 3's redesign) emits a machine-checkable certificate: *"clue set C is complete for inference path P and fully visible before test T."* Agent 6 shrinks to the one thing a deterministic checker genuinely can't do well: a **"blind reader" sanity read** — does the *rendered prose-level* misdirection actually feel fair and unguessable to a fresh reader? That's a judgment call worth an LLM. The structural audit — the bulk of Agent 6 today — is deleted, taking a full LLM call + retry budget with it.

**Agent 3 / the CML schema gains responsibility.** Stage A can only derive clues the CML actually supports. If a step's `correction` has no `required_evidence`, or a `false_solution.supporting_point` has no benign explanation, Stage A surfaces it *immediately* as a CML defect — pushing fair-play failures left, to where logic is cheap to fix, instead of right, where they abort prose. The `required_evidence` and `reader_observable` fields already on `inference_path.steps` become load-bearing inputs rather than ignored hints.

**Agent 7 (Outliner) and Agent 9 (Prose) get a cleaner contract.** Each clue arrives with a proven, solver-assigned placement, so the outline's discriminating-test and suspect-clearance scenes (already required by `prose_requirements` in the schema) get exact clue lists to plant. No more `synthesizeMissing*` template clues leaking flat sentences into prose.

**Token + cost.** One bounded structured-output render call replaces a multi-stage retry cascade; an entire Agent 6 structural pass disappears. This is a direct hit on the pipeline's dominant cost, **TOKEN CHURN**.

**Crucially: no post-LLM mutation without re-validation.** Today's synthesizers mutate clue sets *after* the LLM, and the placement hack rewrites `placement` with no re-check — a textbook instance of the "POST-LLM MUTATION WITHOUT RE-VALIDATION corrupts output" hazard. In the redesign the only post-LLM step is the constraint *solve*, which is itself the validation. Nothing is silently mutated; it's solved or it errors loudly at the CML.

---

## 6. How we'd know it worked

- **Runner LOC drops by ~85%** (3,800 → a few hundred), and `enforceAgent5DeterministicContracts`'s throw-gates are gone or reduced to a single "CML cannot support a fair clue set" assertion that points back at Agent 3.
- **Deterministic-synthesizer fire rate → ~0.** Today's `synthesize*`/`backfill` warnings should essentially never appear; if a required clue isn't rendered, that's a render retry, not a template injection. Track it as a metric and alarm if it's non-zero.
- **Agent 6 critical-failure rate → ~0** for *structural* fair-play (coverage, visibility, reachability), because those are now guaranteed upstream. Remaining Agent 6 findings should be prose-level "feels unfair" judgments only.
- **Fair-play certificate exists and is checkable**: every run emits "clue set complete for path P, visible before test T," and a held-out audit can verify it independently.
- **Blind-reader solvability** (human or LLM-as-blind-reader spot-check): the rendered clues alone should let a fresh reader reconstruct the solution at the intended difficulty — the actual end goal, finally measured directly rather than proxied by gate counts.
- **No run aborts on a clue gate** for a story whose logic was sound. The class of "good story killed by a regex on `sourceInCML`" goes to zero.

---

## 7. Migration path

This can land incrementally without a big-bang rewrite.

1. **Promote `generateExplicitClueRequirements` to authoritative.** It already derives per-step requirements; make Stage A (`deriveClueSpec`) a real typed module that returns the complete required-clue set, and assign IDs/paths/criticality there. Low risk — it formalizes logic that exists.
2. **Flip the contract.** Change the LLM call from "generate clues" to "render these slots." Use structured outputs so `id`/`sourceInCML`/`evidenceType` are fixed by the slot, not authored. Remove the `status: "fail"` escape hatch from the schema.
3. **Delete synthesizers as their gates go quiet.** Once Stage A guarantees coverage, the `synthesize*`/`backfill*` paths become dead code — remove them and their paired checkers together. Watch the synthesizer-fire metric hit zero first; that's your safety signal.
4. **Move placement to the checker.** Replace `applyClueGuardrails`'s placement hack and the standalone reachability checks with the deducibility checker's constraint solve (shared with the Agent 3 redesign). Emit the fair-play certificate.
5. **Derive red herrings from `false_solution`.** Switch the herring source to `supporting_points`/`the_one_flaw`; delete the overlap-sanitizer machinery.
6. **Slim Agent 6** to the blind-reader pass once the certificate is trusted; remove `recomputeCoverageSnapshotForAgent6` and `ensureCriticalFairPlayBackstopClues`.

Each step is independently shippable and each *deletes* more than it adds. The metric that tells you a step succeeded is always the same: the corresponding gate stops firing because the bad state can no longer occur.

---

## 8. The pitch in one paragraph

Agent 5 today generates clues as a free creative act and then spends 168 KB of accreted checkers, repairers, and synthesizers policing them for fairness — and when the policing finds a gap, it mints a flat template clue to fill it, masking the failure and dulling the prose. That's backwards: a clue's only reason to exist is to make one already-decided inference step visible to the reader, so the set of clues that must exist is *computable* from the frozen CML, not invented. I'd derive the complete clue and red-herring spec deterministically from the `inference_path`, `discriminating_test`, and `false_solution`; shrink the LLM's job to *rendering* each required slot as a concrete, plantable observation it cannot misnumber, mispath, or skip; and hand clue placement and fair-play visibility to the deducibility checker that already proves the logic — which turns fair-play into a proven certificate instead of a downstream re-audit, makes most of Agent 6 redundant, and collapses the largest, most fragile runner in the repo to a few hundred honest lines.

---

## 9. Implementation Plan

> Sections 1–8 argue the *what* and *why*; this is the de-risked *how* — the order I'd build it in so each increment deletes more than it adds and never ships a half-converted gate that can kill a good run.

### 9.1 Validate the approach first (de-risking spikes)

Before touching the runner, I want one falsifiable spike that proves the thesis on *real* data, because the whole redesign rests on a single empirical claim: **the clue set is fully derivable from the frozen CML, and the LLM can render every derived slot without any backfill.** If that's false, I want to know in a day, not a quarter.

**Spike 1 — derivation completeness (no LLM).** Take one already-frozen CML from `data/store.json` (a run that passed Agent 4). Run today's [`generateExplicitClueRequirements()`](../../packages/prompts-llm/src/agent5-clues.ts) over it and diff its output against the *final* clue set that real run shipped (after all of `synthesizeMissing*`/`backfill`). The question: **does the derived slot-set already cover every clue the deterministic synthesizers ended up minting?** If `generateExplicitClueRequirements` derives slots A,B,C but the shipped run also contains a synthesized D,E that the deriver never named, the derivation is *incomplete* — and I need to find which CML field D,E came from (likely `discriminating_test.knowledge_revealed`, culprit direct-evidence, or suspect elimination, per the §4.1 table) and add that rule. **Falsification:** if synthesized clues trace to no CML field at all, the thesis is wrong and clues are genuinely under-determined by the CML — stop and fix Agent 3's schema first.

**Spike 2 — rendering hits every slot.** Promote the deriver to authoritative on that *one* CML: feed its slot-set to a single structured-output render call (§4.1 Stage B), Opus 4.8 with the slot schema fixing `id`/`sourceInCML`/`evidenceType`. Run the result through the *existing* `applyClueGuardrails` + `enforceAgent5DeterministicContracts` **in report-only mode** (gates log, never `throw`, never synthesize). The question: **does derive-then-render pass every coverage gate with zero synthesizer fires?** **Falsification:** if rendering can't hit a slot (model refuses, or produces something a gate still rejects), I learn whether the gap is schema (slot under-specified) or prompt (rendering instructions too thin) — both cheap to fix before committing to the deletion.

Both spikes are read-only against frozen data and gated behind a flag; neither changes a single shipped run. I will not write the deletion PRs until Spike 1 shows ≥100% derivation coverage and Spike 2 shows zero synthesizer fires on a 10-CML sample.

### 9.2 What gets built — and deleted (components & contracts)

**Built (small, typed, load-bearing):**

- **`deriveClueSpec(cml): ClueSpec`** — the typed promotion of `generateExplicitClueRequirements` from advisory `RequiredClueSpec[]` to authoritative source of truth. One load-bearing clue slot per inference step (observation + contradiction), discriminating-evidence slots from `discriminating_test`, one direct-evidence slot per culprit, one elimination slot per eligible non-culprit, and red-herring slots from `false_solution.supporting_points[*]` + the hinge slot from `the_one_flaw` (§4.1 table, §4.2). Each slot is born with a stable `id`, `evidenceType`, `supportsInferenceStep`, a *fixed* legal `sourceInCML`, and `criticality`. Pure, deterministic, no LLM, fully unit-testable.
- **The per-slot rendering prompt under structured output** — one batched constrained-decoding call returning exactly `{ id (fixed), description, pointsTo, category, placement_hint }` per slot. The schema makes the bad states unrepresentable: no authored `sourceInCML`, no duplicate IDs, no `status: "fail"` field.
- **The `slot → clue` contract** — a typed interface (`ClueSlot` in, `RenderedClue` out) that Agent 7/9 consume directly. This is the only new public surface.

**Deleted (the bulk of the 168 KB):**

| Component (current) | Fate | Replaced by |
|---|---|---|
| `synthesizeMissing*`, `synthesizeStrictStepCoverageBackstopClues`, `synthesizeSuspectCoverageBackstopClues`, `getMissingDiscriminatingEvidenceIds`, `checkStrictStepCoverageFloors` | **Deleted** | Coverage constructed in `deriveClueSpec` |
| `repairInvalidSourcePaths`, `checkSourcePathValidity`, `ALLOWED_SOURCE_PATTERNS` whitelist | **Deleted** | Paths assigned by the slot, never authored |
| `findRedHerringTrueSolutionOverlap`, `sanitizeRedHerringOverlap`, `pruneOverlappingRedHerrings` | **Deleted** | Herrings derived from `false_solution`, can't overlap by construction (§4.2) |
| `applyClueGuardrails` placement-by-parity hack (`index % 2 === 0 ? "mid" : "early"` in [`shared.ts`](../../apps/worker/src/jobs/agents/shared.ts)) | **Deleted** | Checker-owned constraint solve (Stage C) |
| The `runAgent5` retry cascade (JSON → guardrail → coverage → suspect → herring → discrim-ID → backfill) | **Deleted** | At most a localized re-render of one weak description |
| Agent 6's `recomputeCoverageSnapshotForAgent6` + `ensureCriticalFairPlayBackstopClues` (imported from `agent5-run.js` into [`agent6-run.ts`](../../apps/worker/src/jobs/agents/agent6-run.ts)) | **Deleted** | Deducibility-checker certificate (§5) |

**Survives, much smaller:** era-time-style rendering (moved up-front into the slot's render context, not `replaceDigitTimesWithEraWords` post-hoc) and the locked-fact carry (the slot carries the locked fact verbatim rather than scanning output for conflicts — Pillar 1).

### 9.3 Dependencies & sequencing

This work is **downstream of Agent 3** and I won't pretend otherwise — the keystone dependency is real and ordering matters.

- **AFTER Agent 3** ships the typed `inference_path` (with load-bearing `required_evidence`/`reader_observable` per step) **and the deducibility/fair-play checker** (shared-platform **P1**). Stage A reads Agent 3's frozen path; Stage C *is* Agent 3's checker projected onto a clue timeline. Until the checker exists, I can build and ship Stages A+B (derive-then-render) but placement stays on a *thin, deterministic topo-sort stub* I own temporarily, not the full constraint solver.
- **COORDINATE the Agent 6 deletion.** Agent 6's structural audit (`recomputeCoverageSnapshotForAgent6`, `ensureCriticalFairPlayBackstopClues`) becomes redundant *as this lands*. I will not delete it until the certificate is emitted and trusted (§9.5); the two PRs are sequenced — emit certificate, run both in parallel for a canary window, then delete Agent 6's structural pass.
- **FEEDS Agent 7 and Agent 9.** Agent 7 (beat-scheduler) places derived clues into scenes using their solver-assigned placement; Agent 9 (prose) consumes per-scene clue obligations. Both get a *cleaner* contract, so I coordinate the `slot → clue` interface shape with them before freezing it.
- **Rendering uses P2** structured-output infra; mutation discipline uses **P3** (validation-gated mutation — the only post-LLM step is the solve, which *is* the validation); canary replay uses **P4**.

**Ordered phases** (each independently shippable, each deletes more than it adds):

1. `deriveClueSpec` as a typed module, authoritative behind a flag (formalizes existing logic — low risk).
2. Flip the LLM contract from "generate" to "render slots" under structured output; remove the `status:"fail"` escape hatch.
3. Delete `synthesize*`/`backfill*` + their paired checkers once the synthesizer-fire metric hits zero.
4. Move placement to the deducibility checker; emit the fair-play certificate.
5. Switch red herrings to `false_solution`; delete the overlap sanitizers.
6. Slim Agent 6 to the blind-reader pass; delete `recomputeCoverageSnapshotForAgent6` + `ensureCriticalFairPlayBackstopClues`.

**First increment:** phase 1 — make `deriveClueSpec` authoritative behind a flag, changing *nothing* in the shipped path until §9.1's spikes pass.

### 9.4 Test & validation strategy

**The one invariant** that must hold on every run, asserted by the deducibility checker and *not* by any guardrail: **every load-bearing inference step has ≥1 visible clue rendered before the discriminating test, and a reader holding only the rendered clues can topologically reach the solution.** This is the certificate from §5 — checkable, held-out-auditable, and the direct measurement of fair-play the gate-counts only ever proxied.

- **Unit (deriver):** for a corpus of frozen CMLs, assert `deriveClueSpec` emits exactly one observation + one contradiction slot per inference step, one direct-evidence slot per culprit, one elimination slot per eligible suspect, and red-herring slots for every `supporting_point`. Property test: every slot's `sourceInCML` resolves to a real path in the CML.
- **Red-herring invariant:** every red-herring slot's `supportsAssumption` traces to a `false_solution.supporting_point` and carries an `innocent_explanation`; assert **no** red herring's source path overlaps the true `inference_path` — the overlap class is structurally impossible, and the test proves it stays so.
- **Render contract:** structured-output schema validation — `id`/`sourceInCML`/`evidenceType` echo the slot unchanged; no duplicate IDs; every slot rendered (zero unfilled).
- **Certificate test:** the checker certifies `clue set C complete for path P, visible before test T`; a held-out auditor re-verifies independently. Synthesizer-fire count is a metric asserted `=== 0`.
- **Canary (P4):** replay the golden/canary CML set through derive-then-render vs the legacy free-generate path; diff certificates and blind-reader solvability, not byte-for-byte prose.

### 9.5 Rollout & rollback

- **Flag:** `AGENT5_DERIVE_THEN_RENDER` (off by default). On = derive-then-render + certificate; off = legacy free-generate-then-audit.
- **Shadow phase:** run derive-then-render in **shadow** alongside the live legacy path on the canary corpus — both produce clue sets, only legacy ships, and a job logs per-run: derivation coverage %, synthesizer fires (legacy), certificate pass/fail (shadow), blind-reader solvability delta. This is pure observation; no shipped run changes.
- **Promote** to live only when, over the canary window: derivation coverage = 100%, shadow certificate pass rate ≥ legacy structural-pass rate, and blind-reader solvability is non-inferior.
- **Kill criteria (auto-rollback to flag-off):** any run where a derived slot fails to render after one re-render; certificate fails on a CML that Agent 4 passed (means a derivation rule is wrong, *not* a prose problem — alarm points at `deriveClueSpec`/Agent 3); or blind-reader solvability regresses below the legacy baseline. Because the Agent 6 structural pass is only deleted *after* the certificate is trusted, rollback during the shadow/canary window is a flag flip with zero data migration.

### 9.6 Open questions to resolve before coding

- **Multi-clue steps.** Some inference steps genuinely need more than one observation to be fair (a corroborating second witness). Does `deriveClueSpec` emit a fixed one-per-step, or does it read a `required_evidence` *cardinality* off the step? I lean on the latter — let Agent 3's schema state how many observations a step requires — but that's a schema dependency to settle first.
- **Clue redundancy budget.** Fair play sometimes wants *belt-and-suspenders* (two independent clues for the keystone deduction) so a reader who misses one still has a path. Is redundancy a derivation rule (emit N for `criticality:"essential"` steps) or a separate density knob? It must not reintroduce free invention.
- **How rendering stays concrete and plantable.** The whole point is killing flat template clues; a thin "render this slot" prompt could regress to equally flat *LLM* clues. The render call needs enough `worldContext` (cast, setting, era vocabulary, scene affordances) that descriptions are physically plantable — and I need a concreteness check (length/specificity/named-object heuristic, or an LLM-as-reader spot-check) that triggers a *re-render*, never a synthesize.

### 9.7 "Ready to build" checklist

- [ ] Spike 1 run on ≥10 frozen CMLs from `data/store.json`; derivation coverage measured vs shipped clue sets (§9.1).
- [ ] Every synthesized clue in those runs traced to a CML field, or a new derivation rule added to close the gap.
- [ ] Spike 2 shows zero synthesizer fires on the sample under report-only gates.
- [ ] `ClueSlot` / `RenderedClue` contract drafted and reviewed with Agent 7/9 owners.
- [ ] Multi-clue cardinality + redundancy questions (§9.6) resolved with Agent 3 schema owner.
- [ ] `AGENT5_DERIVE_THEN_RENDER` flag wired, default off, shadow logging in place.
- [ ] Deducibility-checker certificate format agreed with the Agent 3 redesign (shared P1).

**First task / PR:** *Make `generateExplicitClueRequirements` authoritative behind the `AGENT5_DERIVE_THEN_RENDER` flag* — extract it into a typed `deriveClueSpec(cml): ClueSpec` module that assigns stable `id`/`sourceInCML`/`criticality` per slot, wire it as the shadow input to Spike 1's coverage diff, and change **nothing** in the shipped generate-then-audit path until the spike proves derivation completeness. It formalizes logic that already exists, ships dark, and produces the exact metric (derivation coverage %) that green-lights every deletion after it.
