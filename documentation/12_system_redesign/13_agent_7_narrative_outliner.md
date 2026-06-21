# Agent 7 — Narrative Outliner: A Ground-Up Redesign

> The outline is a scheduling problem with a known-correct answer. Stop asking the LLM to schedule and then deterministically correcting it — schedule deterministically, and let the LLM do the one thing it's actually good at: making each slot feel like a scene.

I'm Claude. I was asked to redesign Agent 7 from the ground up. My thesis is a single inversion: **the obligatory beats of a fair-play whodunit form a partially-ordered set with hard ordering and pacing constraints — a solvable constraint problem — so a deterministic scheduler should lay them into a scene grid, and the LLM's job should shrink to *dramatizing* each slot.** Today we do the opposite: the LLM free-schedules as prose-y summaries, then a thick stack of deterministic gates and band-aids tries to repair the schedule after the fact. That stack — the scene-count lock, the clue-pacing gate, `applyDeterministicCluePreAssignment`, the discriminating-test vocabulary patch — is the negative space of the agent that *should* exist. Below, the case and the rebuild.

---

## 1. The job to be done

Strip the prompt away and Agent 7 owes the pipeline exactly one thing: **a chapter plan that is provably complete, correctly ordered, and well-paced, with enough texture per slot that Agent 9 can write a chapter from it.**

"Complete and correctly ordered" is not vague. The validated CML hands Agent 7 a concrete set of *obligations* that MUST appear in the story and a set of *ordering laws* they must obey:

- **The obligations** (the must-occur beats): introduce the victim; discover the crime; introduce each suspect; reveal each clue from the [Agent 5 distribution](../03_Agents/11_agent_5_clue_distribution.md); plant each red herring; clear each false suspect; run the discriminating test; deliver the reveal; denouement.
- **The ordering laws** (hard constraints, all already encoded in CML): every load-bearing clue is *revealed* before it is *used*; the discriminating test fires only after its supporting clues are visible (`quality_controls.discriminating_test_requirements.timing` ∈ `{late_act2, early_act3, mid_act3}`, and `essential_clues_before_test: true`); the reveal comes last and introduces no new clue; the false solution precedes the real one; the detective's entry obeys their type (police/private/amateur).
- **The pacing targets** (soft constraints): ≥60% clue-bearing scenes; no run of >2 clueless scenes; clues spread across all three acts; an exact total scene count split by act ratio; ≥1 emotional micro-beat per 5 scenes; the [Golden Age 10-beat arc](../../packages/prompts-llm/src/agent7-narrative.ts) for 10-chapter stories.

That is a **scheduling problem**: assign obligations to slots in a grid subject to ordering and pacing constraints. It has a known-correct structure, and for a Golden Age whodunit it is *small* (10–28 slots, a few dozen obligations). The genuinely creative, irreducibly-LLM part is much narrower: given a slot whose *function* is fixed ("reveal clue C4 to the reader; clear suspect Marlowe by alibi"), decide **who is present, what the emotional beat is, what the scene is *really* about under its surface, and the texture** — the things `dramaticElements`, `summary`, `subtextNote`, and the World-First fields capture. Scheduling is engineering; dramatization is writing. The current agent fuses them and asks the LLM to do both at once, then spends most of its code policing the engineering half.

---

## 2. How it works today

The runner [`apps/worker/src/jobs/agents/agent7-run.ts`](../../apps/worker/src/jobs/agents/agent7-run.ts) (~1,530 lines) calls `formatNarrative()` in [`packages/prompts-llm/src/agent7-narrative.ts`](../../packages/prompts-llm/src/agent7-narrative.ts) at temperature 0.5, `max_tokens: 16000`, with pacing config `min_clue_scene_ratio: 0.6`, `act1_ratio: 0.28`, `act2_ratio: 0.47` (Act III is the remainder), from [`apps/worker/config/generation-params.yaml`](../../apps/worker/config/generation-params.yaml).

The prompt ([`buildUserRequest`](../../packages/prompts-llm/src/agent7-narrative.ts)) is enormous and almost entirely about *enforcing the schedule the LLM is about to get wrong*. It hands the model exact per-act scene counts ("EXACTLY N scenes total: X in Act I, Y in Act II, Z in Act III. Count your scenes before submitting."), a ~40-line "Fair Play Clue Sequencing Rules" block with worked violation/correct examples, a "Clue Distribution" requirement ("clues in at least 60% of all scenes… at least M scenes must have a non-empty cluesRevealed array"), detective-entry rules by type, a victim-exclusion rule, and the 10-beat arc. The output is `NarrativeOutline`: three `ActStructure` blocks, each an ordered list of `Scene` objects.

Then the runner runs a **gauntlet of deterministic gates**, most of which exist to catch the LLM mis-scheduling:

1. **JSON salvage + temporal normalization.** `JSON.parse` → `jsonrepair` → brace-slice fallback; a truncation guard throws on `finish_reason=length`; `normalizeOutlineTemporalAnchors` rewrites clock-time variants to one canonical anchor across every scene field.
2. **Schema repair retry.** If `validateArtifact("narrative_outline", …)` fails, regenerate once with schema-error guardrails; a deterministic pre-pass synthesizes missing `act.purpose` values first.
3. **Scene-count gate, twice.** Inside the scoring retry, a count outside `±getChapterTargetTolerance()` is forced to grade **F** with a retry message restating the exact act split. After scoring, a *final* scene-count gate retries once more, then falls back to `rebalanceNarrativeSceneCountsDeterministically` — which *fabricates* "Bridge Scenes" (`makeBridgeScene`) or deletes clueless scenes to hit the target.
4. **The scene-count LOCK.** `captureNarrativeSceneCountSnapshot` / `checkNarrativeSceneCountFloor` freeze the total and per-act counts so that *every subsequent repair retry* is rejected if it changes the count. This is the "whack-a-mole" backstop: fix coverage, but don't you dare change the count while doing it.
5. **Coverage gate.** `evaluateOutlineCoverage` regex-scans scene text for discriminating-test and suspect-clearance vocabulary; if absent, regenerate (accepted only if issues drop *and* the count lock holds).
6. **Clue-pacing gate.** If clue-bearing scenes < 60%, regenerate; if still short, call **`applyDeterministicCluePreAssignment`** — the band-aid — which programmatically stuffs clue IDs into scenes (respecting `clue_to_scene_mapping`, then essential clues, then gap-fills every third scene in long clueless runs, then act-balanced threshold-fill) until the ratio passes, capped by `computeDeterministicGapFillCap`.
7. **Pre-commit completeness, Pillar-4 completeness, clue-coverage, and discriminating-test vocabulary patches.** More deterministic mutation: `redHerringPlacement=null` patches, generic-`factEstablished` repair, force-assignment of any unanchored clue ID to the least-loaded scene in its act, and — if no test scene is detected — literally splicing the sentence *"The detective stages a discriminating re-enactment test…"* into a candidate scene's `purpose`.
8. **World-First enrichment.** `applyWorldFirstSceneEnrichment` deterministically derives five world fields (`emotionalRegister`, `dominantCharacterNote`, `humourGuidance`, `eraTextureNote`, `locationRegisterNote`) per scene from the World Document via position→arc-label and act→scene-type mappings.

---

## 3. Where it hurts

**A. The LLM free-schedules, then we deterministically correct it — so the LLM's scheduling is *load-bearing but untrusted*.** This is the headline smell. We ask the model to decide which clue goes in which scene, then `applyDeterministicCluePreAssignment` overrides that decision whenever the ratio is short; we ask it to place the discriminating test, then splice test vocabulary into a scene if it didn't; we ask it for an exact scene count, then `rebalanceNarrativeSceneCountsDeterministically` fabricates Bridge Scenes if it missed. We pay full LLM price for a schedule we then partially throw away — and the deterministic correction runs **after** the schema validation that "blessed" the artifact, so a clue anchored by `applyDeterministicCluePreAssignment` lands in a scene whose `summary` and `purpose` never mention it. Agent 9 then sees `cluesRevealed: ["c7"]` in a scene whose prose has no idea c7 is there. That's exactly the [post-LLM-mutation-without-re-validation](../../C:/Users/andyl/.claude/projects/c--CML/memory/agent9-postprocess-after-validation.md) failure mode: the structured field and the prose-facing text silently diverge.

**B. The clue-pre-assignment band-aid treats a symptom of the wrong contract.** `applyDeterministicCluePreAssignment` exists *only* because the LLM under-distributes clues when asked to schedule freely. It is 165 lines of careful pool-picking, gap-detection, and act-balancing to retrofit a property (≥60% clue-bearing scenes, every essential clue anchored, no long clueless runs) that a scheduler would simply *construct as an invariant*. The function's own stats struct (`mappingAssignments`, `essentialAssignments`, `gapFillAssignments`, `thresholdFillAssignments`) is a confession: four distinct repair strategies layered to patch one scheduling failure.

**C. The scene-count lock is whack-a-mole.** Because each repair retry can change the count as a side-effect, the runner has to *freeze* the count and reject any retry that moves it — then, when the model can't satisfy "fix coverage AND keep the exact count," it falls back to fabricating Bridge Scenes (generic, clue-padded filler whose summary is boilerplate). The count is treated as sacred and the *content* as negotiable, which is backwards: the count should be a trivial consequence of the schedule, not a constraint the LLM repeatedly violates and we repeatedly re-pin.

**D. No backstop in places, hard-abort in others.** The pacing gate and completeness gates can `throw` and kill the run mid-pipeline ("Outline pacing gate failed… remaining gap exceeds deterministic fill cap"; "Outline completeness gate failed"). This is the [no-backstop-gate-kills-runs](../../C:/Users/andyl/.claude/projects/c--CML/memory/template-bleed-no-backstop-kills-runs.md) pattern: a deterministic gate that, when the LLM's free schedule is bad enough, aborts rather than degrades. A scheduler-first design can't reach these states because the obligations are placed *correctly by construction*.

**E. Token churn dominates, and most of it is restating the schedule.** A 16K-token call, plus up to *four or five* full regenerations (scoring retry, schema retry, scene-count retry, coverage retry, pacing retry, pre-commit remediation) — each one re-sending the entire ~6KB developer context and ~4KB user prompt — to produce an artifact whose scheduling we then overwrite anyway. The prompt's own bulk (exact counts, fair-play sequencing essays, violation examples) is the cost of asking a generative model to behave like a constraint solver.

**F. The CML already contains a partial schedule that we ignore as authoritative.** `prose_requirements` (in [`schema/cml_2_0.schema.yaml`](../../schema/cml_2_0.schema.yaml)) *already* carries `discriminating_test_scene.{act_number, scene_number}`, `suspect_clearance_scenes[].{act_number, scene_number}`, `culprit_revelation_scene.{act_number, scene_number}`, and `clue_to_scene_mapping[].{clue_id, act_number, scene_number}`. The upstream logic half-knows the schedule — but Agent 7 passes it to the LLM as *soft* "Prose Requirements" guidance and then has to *re-detect* whether the LLM honored it (the coverage gate) and *re-impose* it when it didn't (the pre-assignment and vocabulary patches). The authoritative schedule is right there; we just don't treat it as authoritative.

---

## 4. Blue-sky redesign

**Split the agent in two along the seam that already exists in the code:**

> **Stage A — the Beat Scheduler (deterministic).** A pure function that consumes the CML obligations + ordering/pacing constraints and emits a *scene grid*: an ordered list of slots, each tagged with the obligations it discharges. Provably complete (every obligation placed), provably ordered (every law satisfied), exact count by construction. No LLM.
>
> **Stage B — the Scene Dramatizer (LLM).** For each slot, the model receives its fixed *function* and writes the *texture*: `characters`, `dramaticElements`, `summary`, `subtextNote`, micro-beats, atmosphere. It may not change which beats live where, the count, or the clue assignments. It dramatizes a schedule it cannot rewrite.

### 4.1 Stage A: the Beat Scheduler

This is a constraint-satisfaction / topological-layout problem, and it's small. The algorithm:

**1. Collect obligations from the CML** (not from prose-y inference — from the structured artifact):

```ts
type Obligation =
  | { kind: 'introduce_victim' }
  | { kind: 'discover_crime' }
  | { kind: 'introduce_suspect'; name: string }
  | { kind: 'detective_entry'; type: 'police'|'private'|'amateur' }
  | { kind: 'reveal_clue'; id: string; criticality: 'essential'|'supporting'|'optional'; placement: 'early'|'mid'|'late' }
  | { kind: 'plant_red_herring'; id: string }
  | { kind: 'clear_suspect'; name: string; supportingClues: string[] }
  | { kind: 'false_solution' }
  | { kind: 'discriminating_test'; supportingClues: string[]; timing: 'late_act2'|'early_act3'|'mid_act3' }
  | { kind: 'reveal_solution' }
  | { kind: 'denouement' };
```

Every one of these is read directly from CML: `culpability.culprits`, `cast` roles, the [Agent 5](../03_Agents/11_agent_5_clue_distribution.md) clue distribution and timeline, `inference_path.steps[].required_evidence`, `discriminating_test`, and the `prose_requirements` partial schedule.

**2. State the ordering laws as precedence edges** (a DAG over obligations):

- `reveal_clue(c)` ≺ any obligation that *uses* c (from `inference_path.steps[].required_evidence` and `clear_suspect.supportingClues` and `discriminating_test.supportingClues`).
- every `reveal_clue(c)` where c is essential ≺ `discriminating_test` (the CML's `essential_clues_before_test: true`).
- `discriminating_test` placed in the act-window from `discriminating_test_requirements.timing`.
- `false_solution` ≺ `discriminating_test` ≺ `reveal_solution` ≺ `denouement`.
- `discover_crime` and `introduce_victim` in Act I; `detective_entry` per type; victim absent after discovery.
- `reveal_solution` introduces **no** new `reveal_clue` (it's a sink with no clue obligations after it).

**3. Lay obligations into a grid of exactly `getSceneTarget(targetLength)` slots, split by act ratio.** This is the solver. A simple, robust approach: assign each act its slot budget (the existing `computeTargetActSceneCounts`), topologically sort obligations within the precedence DAG, distribute them across the act's slots so that (a) all precedence edges hold, (b) clue reveals land in ≥60% of slots with no >2 clueless run (a trivially-satisfiable spread since reveals outnumber the 40% slack), and (c) the discriminating test sits in its required window. Because reveals + clearances + herrings comfortably exceed the 60% floor, the pacing target is met *by construction* — not retrofitted. If a constraint set is genuinely infeasible (more essential clues than pre-test slots, say), the scheduler fails **loudly and early, at the CML layer**, where it's a logic bug worth surfacing — not at scene 14 of prose.

The output of Stage A is a `SceneGrid`:

```ts
interface SceneSlot {
  sceneNumber: number;
  act: 1 | 2 | 3;
  obligations: Obligation[];     // what this slot MUST discharge
  cluesRevealed: string[];       // derived from reveal_clue obligations — AUTHORITATIVE
  beat?: GoldenAgeBeat;          // for 10-chapter format, assigned in order
  function: string;              // one-line machine summary: "Reveal c4; clear Marlowe by alibi"
}
interface SceneGrid { slots: SceneSlot[]; provenComplete: true; }
```

`cluesRevealed` is now **produced by the scheduler**, not the LLM and not a post-hoc patch. `applyDeterministicCluePreAssignment` ceases to exist — the property it retrofitted is now the scheduler's invariant. So does `rebalanceNarrativeSceneCountsDeterministically`, the Bridge-Scene fabricator, the scene-count lock, the coverage gate, and the discriminating-test vocabulary splice. They were all corrections to a schedule that is now correct by construction.

### 4.2 Stage B: the Scene Dramatizer

The LLM gets the `SceneGrid` and, per slot, fills *only* the texture fields. With Opus 4.8's native structured output / constrained decoding, this is a **tool-call / constrained-schema** task, not a "return JSON and pray" task: the model emits `{ characters, setting, dramaticElements, summary, subtextNote }` for slot N, and `sceneNumber`, `act`, `cluesRevealed`, and `beat` are **not in its writable surface at all** — they come from the grid. The prompt collapses from a constraint-enforcement essay to a craft brief:

> "Slot 12 (Act II) must: reveal clue `c4` (the muddy boot-scraper) to the reader, and clear Captain Marlowe via his confirmed 3:15 alibi. Present characters available: {Marlowe, the housekeeper, the detective}. Write this as a scene: who's there, the emotional beat, what it's *really* about beneath the interview, 2–3 sentence summary. Honour the locked facts and the World register for this slot."

The whole "Fair Play Clue Sequencing Rules" section, the violation/correct examples, the "count your scenes" warning, and the 60%-distribution math **disappear from the prompt** — they're now guarantees the model can't break, not rules it might. The model writes better scenes because it's spending its reasoning on drama, not arithmetic.

### 4.3 The clean contract

| Concern | Owner | Guarantee |
|---|---|---|
| Which obligations exist | Scheduler (reads CML) | Complete: every CML obligation is an input |
| Which slot each obligation lands in | Scheduler | Ordered: all precedence laws hold |
| Total + per-act scene count | Scheduler | Exact by construction |
| `cluesRevealed` per scene | Scheduler | ≥60% coverage, no >2 clueless run, every essential clue before the test |
| Discriminating-test placement | Scheduler | In the CML-specified act window |
| `beat` (10-chapter arc) | Scheduler | In canonical order |
| `characters`, `setting`, `summary`, `dramaticElements`, `subtextNote`, micro-beats | Dramatizer (LLM) | Vivid, specific, world-consistent |
| World-First register fields | Deterministic enrichment (unchanged, but now over a valid grid) | Derived from World Document |

The seam is sharp: **the scheduler owns *what happens where*; the LLM owns *what it feels like*.** Validation splits accordingly — Stage A is checked by *constraint assertions* (is every obligation placed? does every edge hold?), which are unit-testable and deterministic; Stage B is checked by *quality scoring* (is the texture specific, are characters consistent), which is where the `NarrativeScorer` actually belongs. The schema-repair retry, scene-count gate, coverage gate, and pacing gate — every gate in §2 items 3–7 — collapse into a single Stage-A assertion that either passes (always, for feasible CML) or fails loudly at the logic layer.

### 4.4 Deleting the band-aids

Concretely, the redesign deletes or repurposes:

- **`applyDeterministicCluePreAssignment`** → deleted. Its invariant is the scheduler's output.
- **`rebalanceNarrativeSceneCountsDeterministically` + `makeBridgeScene`** → deleted. No fabricated filler; the grid has exactly the right count.
- **Scene-count lock (`captureNarrativeSceneCountSnapshot`, `checkNarrativeSceneCountFloor`)** → deleted. Nothing downstream changes the count.
- **Discriminating-test / suspect-closure vocabulary patches** → deleted. The slot's `function` *is* the test; the LLM dramatizes it, it can't omit it.
- **The clue-coverage force-assignment gate** → deleted. Every distribution ID is a `reveal_clue` obligation the scheduler must place.
- **`evaluateOutlineCoverage` regex scanner** → repurposed as a *post-Stage-B lint* that confirms the dramatized text actually mentions the obligation (catches a lazy LLM that ignored its brief), not as a scheduler.
- **The scene-count F-grade in the scoring retry** → deleted. Count is never wrong.
- **World-First enrichment** → kept as-is, but now always runs over a structurally-valid grid.

### 4.5 A worked schedule example

Take a 10-chapter Golden Age story. CML gives: culprit Vane; suspects {Marlowe, Hale, Dr. Pryce}; essential clues {c1 stopped clock, c4 boot-scraper, c7 forged letter}; supporting {c2, c5}; red herrings {rh1}; `discriminating_test` = constraint_proof, `timing: early_act3`, supporting `{c1, c4}`; clearances: Marlowe (alibi, supports c4), Hale (timeline, supports c2), Pryce (no-motive, supports c7). Slot budget: Act I = 3, Act II = 5, Act III = 2.

The scheduler produces (each slot tagged with its obligations; `cluesRevealed` derived):

| Slot | Act | Beat | Obligations discharged | cluesRevealed |
|---|---|---|---|---|
| 1 | I | gathering | introduce_victim, introduce {Marlowe, Hale, Pryce, Vane} | — |
| 2 | I | crime | discover_crime, reveal c1 | c1 |
| 3 | I | first_enquiries | detective_entry(police), reveal c2, plant rh1 | c2 |
| 4 | II | motives | reveal c4 | c4 |
| 5 | II | alibis | clear Hale (uses c2) | — |
| 6 | II | false_solution | false_solution (accuses Marlowe via rh1) | — |
| 7 | II | secrets | reveal c5, reveal c7 | c5, c7 |
| 8 | II | pattern | clear Marlowe (uses c4), clear Pryce (uses c7) | — |
| 9 | III | final_trap | **discriminating_test** (uses c1, c4 — both revealed by slot 4) | — |
| 10 | III | revelation | reveal_solution (no new clue), denouement | — |

Every precedence edge holds **by construction**: c1 (slot 2) and c4 (slot 4) both precede the test (slot 9); the test precedes the reveal (slot 10); the false solution (slot 6) precedes the test; rh1 is planted (slot 3) before it's used to mislead (slot 6); the reveal introduces no new clue. Clue-bearing slots = 4/10 reveals + the test/clearance slots that *cite* prior clues — and the scheduler can lift coverage to ≥6/10 trivially by attaching a "re-examine c1" reference to a clearance slot if the raw reveal count dips below 60%. The count is exactly 10, split 3/5/2. **No gate ran. No patch fired. Nothing was fabricated.** The LLM then receives slot 9 as *"stage the constraint-proof test using c1 and c4 to rule out everyone but Vane"* and writes the drama — the trap, the room, the dawning silence — without ever being able to put the test in the wrong place.

---

## 5. Ripple effects on the rest of the pipeline

- **Agent 9 (prose) — the big win.** Agent 9 today walks the outline scene-by-scene, accumulating `cluesRevealedToReader` to enforce fair-play at prose time ([`agent9-run.ts`](../../apps/worker/src/jobs/agents/agent9-run.ts) ~line 3066, 3484). With the redesign, that accumulator is fed by a *provably-ordered* `cluesRevealed` — so Agent 9's own fair-play checks (does this chapter use a clue not yet revealed?) become *confirmations* that should never fire, not corrections. The dangerous divergence in §3-A — where a band-aid-anchored clue ID sits in a scene whose prose doesn't mention it — is gone, because the LLM *dramatized that exact obligation* and the text and the field came from the same source. The handoff becomes: "here is a correct schedule with vivid scenes," not "here is a schedule we patched; please re-check it."
- **Agent 5 (clues) & Agent 6 (fair-play).** The scheduler makes the *clue-distribution placement* and the *fair-play ordering* into a single enforced contract. If Agent 5's distribution is infeasible to schedule (too many essential clues for the pre-test window), the scheduler surfaces it immediately — which is arguably a check that belongs upstream anyway. Agent 6's fair-play guarantees gain a structural backstop.
- **The CML `prose_requirements` block.** This becomes the *scheduler's authoritative input* rather than soft LLM guidance. We could even **promote the scheduler upstream**: emit the `SceneGrid` as part of CML validation (Agent 4), so the logic and its schedule are validated together — "build mysteries like an engineer builds proofs" extended to the chapter plan. Agent 7 then becomes *purely* the Dramatizer.
- **Scoring.** `NarrativeScorer` / the [agent7 scoring adapter](../../apps/worker/src/jobs/scoring-adapters/) drop their scene-count and clue-pacing components (now structurally guaranteed) and focus on what scoring is for: texture quality, character consistency, subtext richness.
- **Orchestrator & cost.** The five-deep regeneration cascade collapses to one Dramatizer call (no scheduling retries — there's nothing to re-schedule). Token spend drops sharply: the prompt loses its constraint-enforcement bulk, and the retries that re-sent the full context disappear. The hard-abort `throw`s in the pacing/completeness gates are removed — feasibility is decided once, deterministically, before any LLM call.
- **Schema.** `narrative_outline.schema.yaml` is unchanged in shape (Agent 9 keeps reading the same fields), but `sceneNumber`, `act`, `cluesRevealed`, and `beat` become scheduler-owned and the rest LLM-owned — a documented split, not a free-for-all.

---

## 6. How we'd know it worked

- **Band-aid invocation count → 0.** Today `applyDeterministicCluePreAssignment`, the Bridge-Scene fabricator, and the vocabulary patches fire on a meaningful fraction of runs (each emits a `ctx.warnings` line). After the redesign these functions don't exist; the warning lines vanish. Grep the warnings stream — it should go quiet.
- **Scene-count and pacing gate retries → 0.** No run regenerates for count or coverage, because both are guaranteed. Measure the regeneration-cascade depth per run; expect it to flatten to 1.
- **Fair-play ordering violations at Agent 9 → 0 by construction.** Agent 9's "clue used before revealed" check should never fire. Today it occasionally does (and gets corrected); after, a single firing is a *real bug in the scheduler*, which is a much better signal.
- **Field/text divergence → 0.** Audit: for every scene, does the `summary`/`purpose` text reference the clues in `cluesRevealed`? Today the band-aid breaks this; after, the LLM dramatized exactly those obligations, so coverage of "field mentioned in text" should approach 100%.
- **Scheduler infeasibility surfaces upstream.** Count CML cases the scheduler rejects as infeasible. Each is a logic bug that *used to* manifest as a confusing mid-prose abort or a fabricated Bridge Scene — now caught at the logic layer with a precise message ("4 essential clues but only 3 pre-test slots").
- **Token/cost delta.** Compare total Agent 7 cost (prompt + retries) before/after. Expect a clean drop from the smaller prompt and the collapsed cascade.
- **Blind-read quality holds or improves.** A/B blind-read scene texture: does a dramatizer freed from scheduling write *more* vivid, subtext-rich scenes? The hypothesis is yes — it's spending all its budget on craft.

---

## 7. Migration path

Each step is independently shippable and reversible; the early steps are pure additions that de-risk the rest.

1. **Build the scheduler as a shadow, asserting nothing.** Write `buildSceneGrid(cml, clues, targetLength)` as a pure function in `packages/prompts-llm` (or `packages/cml`). Run it alongside the current agent, log its grid next to the LLM's outline, and diff. This costs nothing and tells us how often the LLM's free schedule already matches the deterministic one (and where it diverges).
2. **Replace the clue-pre-assignment band-aid with the scheduler's `cluesRevealed`.** First real swap: instead of `applyDeterministicCluePreAssignment` patching the LLM's outline, *overwrite* `cluesRevealed` from the grid. The LLM still writes everything else. Verify Agent 9 fair-play checks stay green and field/text divergence drops.
3. **Replace the scene-count gate with the grid's count.** Stop retrying for count; build the act/scene skeleton from the grid and have the LLM fill texture into a fixed number of slots. Delete `rebalanceNarrativeSceneCountsDeterministically`, `makeBridgeScene`, and the count lock.
4. **Invert the prompt.** Switch the Dramatizer prompt from "schedule this story" to "dramatize these slots," using Opus 4.8 constrained decoding so `sceneNumber`/`act`/`cluesRevealed`/`beat` are non-writable. Delete the fair-play-sequencing essay, the count warnings, and the coverage/test-vocabulary gates. Keep `evaluateOutlineCoverage` only as a post-hoc lint.
5. **Promote feasibility upstream (optional but ideal).** Run the scheduler's feasibility check inside Agent 4 (CML validation) so an unschedulable case fails at the logic layer. Emit the `SceneGrid` as a validated CML sub-artifact; Agent 7 becomes purely the Dramatizer.
6. **Delete the dead gates and re-point scoring.** Remove the completeness/pacing/coverage `throw`s and the scene-count F-grade; drop the corresponding components from `NarrativeScorer` and the scoring adapter; keep texture/consistency scoring.

After step 3 the whack-a-mole is gone; after step 4 the prompt is a craft brief; after step 5 the schedule is a proven theorem of the CML.

---

## 8. The pitch in one paragraph

Agent 7's real job is a small, solvable scheduling problem — lay the obligatory beats of a fair-play whodunit (reveal each clue, clear each suspect, run the discriminating test after its clues are visible, reveal last) into a scene grid under hard ordering and pacing laws the CML already encodes — but the current design asks an LLM to *free-schedule* it as prose-y summaries and then spends most of a 1,500-line runner deterministically correcting the result: a clue-pre-assignment band-aid that stuffs clue IDs into scenes, a scene-count lock that fabricates filler "Bridge Scenes," a coverage gate that splices test vocabulary into a scene's purpose, and a cascade of regenerations that re-send 10KB of prompt to fix a schedule we then overwrite anyway. Invert it: a deterministic **Beat Scheduler** consumes the CML obligations and constraints and emits a grid that is *complete and correctly ordered by construction* — exact count, ≥60% clue coverage, every essential clue before the test, all free — and the LLM's job shrinks to **dramatizing each fixed slot**: who's present, the emotional beat, what the scene is really about. That single seam deletes every band-aid in §2, makes Agent 9's fair-play checks into confirmations that never fire, collapses the retry cascade to one call, turns the schema-validation-then-mutate divergence into a single source of truth, and lets the model spend all its reasoning on the one thing only it can do — making the scene feel like a scene.

---

## 9. Implementation Plan

> Turning §§1–8 into a build I'd actually start Monday: prove the scheduler can solve a frozen CML before writing a line of prompt, then swap the band-aids out one at a time behind a flag.

### 9.1 Validate the approach first (de-risking spikes)

The whole redesign rests on one unproven claim: **for a real validated CML, the obligatory beats are a satisfiable constraint set that a small deterministic solver can lay into a grid with zero LLM help.** I will not write a single line of the Dramatizer prompt until that's proven on real data. Three spikes, in order:

**Spike 1 — the scheduler emits a valid grid, offline, with no LLM.** Write `buildSceneGrid(cml, clues, targetLength)` as a throwaway script that runs over a corpus of already-validated CMLs from `data/store.json` and the `apps/api/data/reports/` runs. For each, assert the three invariants directly: (a) **count** — `slots.length === getSceneTarget(targetLength)`, split by `computeTargetActSceneCounts`; (b) **ordering** — every precedence edge in §4.1 step 2 holds (build the DAG, topologically check it against slot order); (c) **coverage** — clue-bearing slots ≥ 60%, no run of >2 clueless slots, every essential clue before the discriminating-test slot. Success = the grid passes all three for every CML in the corpus. **Falsification = the constraint set is unsatisfiable for some real case** (e.g. more essential clues than pre-test slots), or the scheduler can't *express* a case the current code handles — that tells me the obligation model in §4.1 is missing something before I've sunk any cost into Stage B.

**Spike 2 — `prose_requirements` is a usable authoritative input, not just soft guidance.** Take the CMLs that *have* a populated `prose_requirements` block (`schema/cml_2_0.schema.yaml` line 341: `discriminating_test_scene`, `suspect_clearance_scenes`, `culprit_revelation_scene`, `clue_to_scene_mapping`) and check that promoting it from guidance to *constraint* doesn't over-determine the grid into infeasibility. The question I'm de-risking: when the upstream partial schedule and my derived precedence DAG disagree, who wins? (My answer: `prose_requirements` pins the slots it specifies; the scheduler fills the rest around them. But I want to see the conflict rate before committing.)

**Spike 3 — LLM dramatization of one fixed slot preserves the schedule.** A single hand-built grid, a single slot, the §4.2 craft brief, Opus 4.8 structured output. Assert the model's returned object contains **none** of `sceneNumber`/`act`/`cluesRevealed`/`beat` (they aren't in its writable surface) and that the prose it *does* return mentions the obligation it was handed. Falsification = the model can't write a good scene without also wanting to reorder — meaning the seam is in the wrong place.

If Spike 1 or 3 falsifies, **stop and rethink the seam** before building anything in §9.2.

### 9.2 What gets built — and deleted (components & contracts)

**Built:**

| Component | Where | Contract |
|---|---|---|
| `buildSceneGrid(cml, clues, targetLength): SceneGrid` | new pure module in `packages/cml` (or `packages/prompts-llm`) | Total function over a *validated* CML. Returns a grid satisfying all §4.3 guarantees, or throws a typed `SchedulerInfeasibleError` with the precise unmet constraint. No I/O, no LLM, fully unit-testable. |
| `SceneGrid` / `SceneSlot` / `Obligation` types | same module | The §4.1 types. `cluesRevealed` and `beat` are scheduler-owned and immutable downstream. |
| Per-slot Dramatizer prompt | replaces `buildUserRequest` in [`packages/prompts-llm/src/agent7-narrative.ts`](../../packages/prompts-llm/src/agent7-narrative.ts) | A craft brief per slot (§4.2), not a constraint essay. Uses Opus 4.8 structured output so the four scheduler-owned fields are non-writable. |
| Grid→Agent-9 contract | the `narrative_outline` artifact | Same schema shape; `sceneNumber`/`act`/`cluesRevealed`/`beat` provably from the grid, the texture fields from the LLM. This *is* the clean per-scene contract that lets Agent 9's clue-timing machinery evaporate (§5). |

**Deleted** (real symbols in [`apps/worker/src/jobs/agents/agent7-run.ts`](../../apps/worker/src/jobs/agents/agent7-run.ts)):

| Symbol | Line(s) today | Why it dies |
|---|---|---|
| `applyDeterministicCluePreAssignment` | 304 (called 1149, 1223) | Its ≥60%/essential/no-long-run invariant is now the scheduler's construction. |
| `rebalanceNarrativeSceneCountsDeterministically` + `makeBridgeScene` | 228, 141 (called 976, 1043) | No fabricated filler; the grid has the exact count. |
| `captureNarrativeSceneCountSnapshot` + `checkNarrativeSceneCountFloor` | 103, 117 (called 1084, 1113, 1144, 1204, 1257, 1287) | Nothing downstream changes the count, so nothing to lock. |
| `computeDeterministicGapFillCap` | 58 | Only fed the gap-fill band-aid. |
| Scene-count F-grade + final count gate | ~833, 967 | Count is never wrong. |
| Discriminating-test / suspect-clearance vocabulary splice | the `evaluateOutlineCoverage`-driven patches (618, called 1077, 1112, 1468, 1527) | The slot's `function` *is* the test; the LLM dramatizes it. |

**Repurposed, not deleted:** `evaluateOutlineCoverage` (618) survives as a *post-Stage-B lint* — it confirms the dramatized text actually mentions the obligations the grid assigned (catches a lazy LLM), instead of acting as a scheduler. `applyWorldFirstSceneEnrichment` (532) is kept verbatim but now always runs over a structurally-valid grid.

### 9.3 Dependencies & sequencing

**Keystone is Agent 3.** The scheduler consumes the *typed CML obligations* Agent 3 produces — `inference_path.steps[].required_evidence`, `discriminating_test` + its supporting clues and `timing`, suspect clearances, the reveal — plus the `prose_requirements` partial schedule (`schema/cml_2_0.schema.yaml` line 341). Without P1's typed CML core, the scheduler is reading prose-y fields and the whole "by construction" claim collapses. **So Agent 3 / P1 lands first.**

- **Needs (upstream):** Agent 3 obligations (P1 typed CML), Agent 5 derived clues — the clue *slots* the scheduler places (`ClueDistributionResult`, `clueTimeline`).
- **Feeds (downstream):** Agent 9 — the grid is its clean per-scene contract; this is where the big win lands (its clue-timing/completeness accumulator becomes a confirmation that never fires). Agent 6.5's Style Contract rides into the Dramatizer call. P2 structured-output infra powers the dramatization call so the scheduler-owned fields are non-writable.
- **Discipline:** P3 validation-gated-mutation — **the schedule is the contract; the LLM may not silently reorder it.** This is the load-bearing rule; §9.4 enforces it as a property test.

**Ordered phases:**
1. **Scheduler** (`buildSceneGrid` + types + invariant asserts) — pure, offline, shadow-logged against the live agent. Zero behaviour change.
2. **Dramatization** — invert the prompt; LLM fills texture into fixed slots via structured output.
3. **Integrate** — swap the grid in as authoritative, delete the band-aids per §9.2, re-point scoring (§5).

**First increment:** Phase 1, shadow-only — `buildSceneGrid` running beside the current agent, its grid diffed against the LLM's free outline, asserting nothing. This is pure addition, ships dark, and immediately tells me how often the LLM already matches the deterministic schedule (and exactly where it diverges) — the data that justifies the rest.

### 9.4 Test & validation strategy

The point of scheduler-first is that correctness becomes *property*, not *vibe*. Tests mirror that:

- **Property tests on `buildSceneGrid` (the heart).** Over generated and corpus CMLs, assert by construction: the grid is **always complete** (every obligation placed), **always correctly ordered** (every §4.1 precedence edge holds — this is a pure DAG check), and **always meets pacing** (≥60% clue-bearing, no >2 clueless run, essential clues before the test). These should pass for 100% of *feasible* CMLs; an infeasible one must throw `SchedulerInfeasibleError` with a precise message, never return a silently-wrong grid.
- **Dramatization-never-reorders test (P3 enforcement).** Feed a fixed grid through the Dramatizer; assert the returned artifact's `sceneNumber`/`act`/`cluesRevealed`/`beat` are *bit-identical* to the grid's. Any divergence is a hard test failure — this is the validation-gated-mutation guard made executable.
- **Dead-code proof.** A test that constructs the worst-case CML the band-aids were built for (under-distributed clues, missed count) and asserts the scheduler still emits a valid grid — i.e. `applyDeterministicCluePreAssignment` and `rebalanceNarrativeSceneCountsDeterministically` would have *nothing to do*. When that's green across the corpus, the band-aids are **provably dead code** and can be deleted, not just disabled.
- **Field/text divergence audit.** For every dramatized scene, assert its `summary`/`purpose` references the clues in `cluesRevealed`. Today the band-aid breaks this; after, it should approach 100% (the §6 metric).
- **Golden/canary replay (P4).** Run the full before/after pipeline on the canary CML set; expect: band-aid invocation count → 0, regeneration-cascade depth → 1, zero Agent-9 fair-play firings, and blind-read texture quality holding or improving.

### 9.5 Rollout & rollback

- **Flag:** `agent7.schedulerFirst` (off by default), read in [`agent7-run.ts`](../../apps/worker/src/jobs/agents/agent7-run.ts). Off = today's free-outline-then-correct path, untouched. On = scheduler → dramatize.
- **Shadow first:** with the flag *off*, still run `buildSceneGrid` and log its grid + invariant results next to the live LLM outline (Phase 1). This gathers the match/divergence data with zero production risk.
- **Canary on:** enable for the canary cohort, compare against shadow on the §6 metrics.
- **Kill criteria (flip the flag off if any holds):** the scheduler reports infeasible on >X% of CMLs that the old path completed (means the obligation model is incomplete, not the CML); blind-read texture quality regresses; or the Dramatizer is observed reordering/dropping a grid-owned field despite structured output (means P2 isn't actually constraining the surface). Rollback is a flag flip — the old code path stays intact until §9.2's deletions land, which only happens *after* the dead-code proof (§9.4) is green.

### 9.6 Open questions to resolve before coding

1. **Aesthetic / pacing beats with no CML obligation.** The Golden-Age 10-beat arc and "≥1 emotional micro-beat per 5 scenes" are *pacing* targets, not CML obligations — there's no `Obligation` to place for "gathering" or "secrets" mood beats. Does the scheduler assign these from a fixed arc template (deterministic, §4.5's `beat` column) and let the Dramatizer fill the feeling, or are they purely the LLM's? My lean: scheduler assigns the *label* in canonical order, LLM owns the feeling. Confirm before coding the grid type.
2. **Scene-count: target vs hard constraint.** `getSceneTarget` returns a target with `±getChapterTargetTolerance()` slack today. Is the grid's count an *exact* hard constraint (cleaner, but can it always pack the obligations into exactly N?) or a target-within-tolerance the scheduler optimizes toward? If obligations ever exceed comfortable N, exact-count and feasibility fight. Decide the precedence.
3. **How much freedom the Dramatizer gets.** Locked: `cluesRevealed`, `act`, `sceneNumber`, `beat`, *which* obligations a slot discharges. Open: can the LLM choose which *present characters* appear, the setting, the order of beats *within* a slot? Too tight and the prose stiffens; too loose and "may not reorder" leaks. Draw that line explicitly in the prompt contract.
4. **Where the scheduler lives.** `packages/cml` (so it can be promoted into Agent 4 / CML validation per §5 and §7 step 5) vs `packages/prompts-llm` (closer to the agent). The §7 end-state wants it upstream; starting it in `packages/cml` avoids a later move.

### 9.7 "Ready to build" checklist

- [ ] Spike 1 green: `buildSceneGrid` emits a valid grid (count + ordering + ≥60% coverage) for every CML in the corpus, with zero LLM help.
- [ ] Spike 2 done: `prose_requirements` conflict rate measured; promotion rule (pin specified slots, fill the rest) decided.
- [ ] Spike 3 green: a single slot dramatized via Opus 4.8 structured output, with the four scheduler-owned fields proven non-writable.
- [ ] §9.6 Q1 (aesthetic beats), Q2 (exact vs tolerance count), Q3 (Dramatizer freedom), Q4 (module home) answered in writing.
- [ ] Agent 3 / P1 typed-CML obligations available as a stable input; Agent 5 clue slots stable.
- [ ] `agent7.schedulerFirst` flag wired, defaulting off.
- [ ] Property-test scaffold ready (complete / ordered / paced asserts + dramatization-never-reorders).

**First task / PR:** *Implement the Beat Scheduler — `buildSceneGrid(cml, clues, targetLength)` over `prose_requirements` + `inference_path`, with the §4.1 `Obligation`/`SceneGrid` types and the three invariant assertions (complete, ordered, ≥60% coverage) — and run it in shadow beside the live agent, diffing its grid against the LLM's free outline and asserting nothing.* That single PR is pure addition, proves Spike 1 on real data, and produces the divergence numbers that justify every subsequent step.
