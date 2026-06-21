# Agent 1 — Era & Setting Refiner: A Ground-Up Redesign

> Blue-sky brief: if I could rebuild the first agent in the pipeline from nothing, knowing what the job actually is and what frontier models can now do, what would it become? My answer: mostly *not an LLM call at all*.

---

## 1. The job to be done (first-principles)

Strip away the current implementation. What does the pipeline genuinely need before it can start designing a mystery?

It needs a **period contract**: a compact, authoritative statement of what is *possible* and *impossible* in the chosen time and place, expressed so that every downstream agent can reason against it. Concretely, three things:

1. **Hard period facts** — what technology, forensics, communication, transport, and policing exist in this decade. These are *constraints on the logic*. If the year is 1931, the detective cannot pull a phone record, cannot run DNA, cannot get a same-day ballistics match from a county station. These facts gate the *fairness* of the whole mystery: a fair-play clue must be discoverable using only period-available means.
2. **Place affordances** — what this *kind* of location physically permits: who can enter and leave, what is observable from where, how isolated it is, how outside help is summoned. These gate the *mechanism* and the *alibis*.
3. **Atmosphere seed** — a small amount of genuinely authored mood/sensory framing (weather, light, the texture of the place) that gives the prose agent something to breathe with. This is the *only* part that wants an LLM.

The critical insight: **#1 and #2 are reference data, not creative work.** "What forensics existed in the 1930s" has a correct answer that does not change between runs. The job is to *select and bind* the right facts to this run — a retrieval-and-filter problem — and then author a *thin* layer of atmosphere on top. The current agent inverts this: it asks a generator to re-derive the facts every time and then trusts it to also police its own accuracy.

A good design separates **"what is true about 1931"** (deterministic, owned, testable) from **"what is evocative about *this* rainy night at Thornfield Hall"** (generative, per-run, low-stakes). The current agent fuses them and pays for it.

---

## 2. How it works today (grounded)

The contract and flow live in four files:

- [`packages/prompts-llm/src/agent1-setting.ts`](../../packages/prompts-llm/src/agent1-setting.ts) — prompt builder + `refineSetting()` generation loop.
- [`apps/worker/src/jobs/agents/agent1-run.ts`](../../apps/worker/src/jobs/agents/agent1-run.ts) — runner, scoring-path retry, schema-repair retry.
- [`packages/prompts-llm/src/shared/constraints.ts`](../../packages/prompts-llm/src/shared/constraints.ts) — `buildEraConstraints(decade)` / `buildLocationConstraints(location, institution)`.
- [`schema/setting_refinement.schema.yaml`](../../schema/setting_refinement.schema.yaml) — the output contract.

**The data is already deterministic — and then thrown away.** `buildEraConstraints("1930s")` returns a hardcoded string bundle ("Fingerprinting standard, basic toxicology, ballistics analysis emerging…") for five decades (1920s–1960s), defaulting to the 1930s for anything else. `buildLocationConstraints` returns a *generic templated paragraph* with the location/institution names interpolated — it contains no location-specific facts at all, just placeholder headings like "Architecture creates natural access restrictions." Both are stuffed into the `developer` prompt as `JSON.stringify`'d source material ([`agent1-setting.ts:112-129`](../../packages/prompts-llm/src/agent1-setting.ts)).

**Then an LLM is asked to restate them.** `buildSettingPrompt()` instructs the model to produce `era.technology[]`, `era.forensics[]`, etc. — i.e. to *paraphrase* the bundle it was just handed — plus `location`, `atmosphere`, and a `realism` self-audit. A per-run "variation seed" is hashed from `runId` to nudge architectural detail, naming style, and focus area (`generateVariationSeed`, [lines 82-89](../../packages/prompts-llm/src/agent1-setting.ts)). The call runs at `temperature: 0.6, max_tokens: 2000` ([`generation-params.yaml`](../../apps/worker/config/generation-params.yaml)).

**The self-audit is a hard gate.** The model must return `realism.anachronisms: []` and `realism.implausibilities: []`. If either is non-empty, `refineSetting` retries the *same prompt* (`agent1-setting.ts:283-298`), and if it still fails, the runner throws and the **entire run dies** (`agent1-run.ts:76-84`).

**Three retry layers** wrap this lookup-with-flavor task:

- **Layer A — internal** (`refineSetting`, `default_max_attempts: 3`): JSON parse failure, missing sections, or non-empty realism lists → resend the *identical* prompt.
- **Layer B — scoring-driven** (`executeAgentWithRetry`): if the phase score fails, feedback from `buildRetryFeedback()` is appended to the `tone` input via `appendRetryFeedbackOptional()`. **This is conditional on `tone` being defined** — `appendRetryFeedbackOptional` returns `undefined` untouched when `base === undefined` ([`shared.ts:466-471`](../../apps/worker/src/jobs/agents/shared.ts)). So when the user gives no tone, *the retry guidance is silently dropped* and Layer B resends the same prompt blind.
- **Layer C — schema-repair** (`agent1-run.ts:86-112`): if `validateArtifact("setting_refinement", …)` fails, regenerate once more with `maxAttempts=2`, same business inputs.

**And the scorer grades a different artifact entirely.** The phase scorer [`agent1-setting-refinement-scorer.ts`](../../packages/story-validation/src/scoring/phase-scorers/agent1-setting-refinement-scorer.ts) expects an output shaped like `{ locations: [{ name, layout, key_features, clue_placements }], physical_constraints, accessibility_notes }` — a *clue-placement* artifact that Agent 1 does not produce. The gap is bridged by [`adaptSettingForScoring`](../../apps/worker/src/jobs/scoring-adapters/agent1-scoring-adapter.ts), which *synthesizes* fake spatial layouts and `clue_placements` from the access-control list, with a code comment that says the quiet part out loud: *"Synthesise clue_placements from access items so the +10 existence score fires."* The scoring loop is grading manufactured filler, not the model's real work.

Downstream, the artifact feeds Agent 2 (cast), 2c (locations), 2d (temporal), 2e (background), 3b (devices), and is referenced again at prose time (`agent9-run.ts`). They mostly read `era.decade`, `era.socialNorms`, `location.type`, and `location.description`.

---

## 3. Where it hurts (specific to this agent)

1. **It pays LLM money to launder a lookup.** The era facts are already in code. The agent's main act is restating `buildEraConstraints` output in array form. The "value add" is marginal rephrasing plus a temperature-0.6 chance of *drifting* from the very facts we handed it — i.e. it can only make the authoritative data *worse*.

2. **Generator-as-its-own-auditor is a smell that becomes a run-killer.** Asking one call to both invent content and certify it anachronism-free is structurally weak: the model that didn't notice the anachronism while writing is the same model asked whether it wrote one. Worse, a non-empty `realism.anachronisms` array hard-fails the whole pipeline (`agent1-run.ts:83`) — so the *honest* behavior (flagging a real problem) is punished identically to corruption. The training-incentive this creates is "always return `[]`," which makes the audit theater.

3. **The deterministic data is thin and frozen.** Five decades, hardcoded, defaulting to 1930s. Ask for 1910 or 1955-specific nuance and you get the 1930s bundle silently. `buildLocationConstraints` is *pure template* — it contributes no real location knowledge, only headings. So the "grounding" the LLM is told to trust is partly hollow, and it has to confabulate the location specifics anyway.

4. **The `tone`-coupled retry bug.** Retry guidance rides on the `tone` string. No tone → no guidance injected (`appendRetryFeedbackOptional` short-circuits on `undefined`). The exact runs that most need steering (sparse briefs) are the ones that get blind same-prompt resends. This is latent and silent.

5. **The scorer/output mismatch means the gate is fictional.** Because `adaptSettingForScoring` fabricates `clue_placements` and spatial `layout` text to satisfy the scorer, the 75-threshold gate for this phase is largely measuring the *adapter's* output, not the LLM's. Three retry layers defend a score computed on synthetic data.

6. **Triple retries for a near-deterministic task** multiply token churn and call count for what should be a single bind-and-validate step. Every layer resends essentially the same prompt (the documentation itself notes "no prompt delta" for Layers A and C).

---

## 4. Blue-sky redesign

**Thesis: replace the agent with a deterministic Period Knowledge Base + a binder, and keep an LLM only for the thin atmosphere layer — under constrained decoding, with audit as a separate non-generative pass.**

### 4.1 New contract

Split the single fused artifact into two provenance-tagged halves:

```
SettingContract {
  era:      <FROZEN, from KB — period facts, byte-for-byte from the knowledge base>
  place:    <FROZEN, from KB — affordances for this location archetype>
  atmosphere: <AUTHORED, from LLM — weather, light, mood, sensory framing>
  provenance: { era: "kb:v3/1931", place: "kb:v3/country_manor", atmosphere: "llm:opus-4.8" }
}
```

The downstream-load-bearing fields (`era.*`, `location.type/description/accessControl`, `socialNorms`) come from the KB and are **never** model-authored. Only `atmosphere` is generated. The `realism` self-audit block is *deleted from the generation contract* — see §4.4.

### 4.2 The Period Knowledge Base (replaces buildEraConstraints + the bulk of the agent)

A curated, versioned data file — `packages/period-kb/` — keyed by **year** (not coarse decade), with interpolation/nearest-anchor rules for in-between years. Each entry is structured, sourced, and testable:

```yaml
# packages/period-kb/eras/1931.yaml
year: 1931
forensics:
  fingerprinting: { status: routine, caveat: "manual classification, days for a match" }
  toxicology:     { status: basic,   detectable: [arsenic, strychnine, morphine], blind_to: [most_synthetics] }
  ballistics:     { status: emerging, caveat: "comparison microscope new; regional labs only" }
  blood:          { status: typing_only, note: "ABO groups; no individuation" }
communication:
  telephone: { availability: town_exchanges, caveat: "party lines, operator-connected, no records" }
  telegram:  { latency: hours }
  post:      { latency: days }
policing: { forensic_labs: scarce, amateur_detective: plausible, miranda: false }
transport: { air_commercial: nascent, rail: peak, motorcar: common_unreliable }
sources: ["..."]   # citations make it auditable and defensible
```

This is **retrieval, not generation**. The binder selects the year's entry (with documented nearest-anchor fallback instead of the current silent default-to-1930s), filters to fields relevant to the location, and emits `era.*` directly. It is fast, free, deterministic, reviewable in a PR, and *improvable* — when we learn that 1931 toxicology couldn't detect X, we fix one YAML line and every future run is correct, with no prompt-engineering.

The same approach replaces `buildLocationConstraints` with real per-archetype affordance data (`country_manor`, `ocean_liner`, `night_train`, `snowbound_inn`…): actual access points, isolation profile, observability map — not the current placeholder paragraph.

### 4.3 The thin atmosphere LLM call (the only generation that survives)

A single, small, **constrained-decoding** call (Opus 4.8 structured output / tool-schema) that authors *only* `atmosphere` — weather, time of day, mood, a few sentences of sensory framing — given the frozen `era` + `place` as read-only context. Because the model **cannot emit the `era`/`place` fields** (they aren't in its output schema), it physically cannot corrupt the period facts. Temperature can stay expressive here precisely because nothing logic-bearing depends on this text.

Per-run variation moves out of a hashed seed nudging one big prompt and into honest *sampling parameters* on this tiny call. The `runId`-hash architectural-emphasis hack (`generateVariationSeed`) disappears.

### 4.4 Correctness: audit becomes a checker, not a confession

Delete `realism.anachronisms` / `realism.implausibilities` from the generation contract. Replace the self-audit with a **deterministic anachronism linter** that runs *after* atmosphere generation and validates the authored text *against the KB it was given*:

- The atmosphere prose mentions "headlights sweeping the drive" in 1931 → fine (KB: motorcars common).
- It mentions "she checked her wristwatch under the fluorescent hall light" in 1931 → linter flags `fluorescent` against `kb:1931/lighting` and either rejects with a *specific* targeted fix or strips the offending clause.

Crucially this is a **different mechanism from the generator**, with a backstop instead of a kill-switch: a violation produces a *targeted* regeneration of just the atmosphere call (cheap, scoped), and if it still fails, it falls back to a neutral KB-derived atmosphere stub rather than aborting the run. Compare today, where a non-empty realism array nukes the whole pipeline (`agent1-run.ts:83`). The logic-bearing data (`era`/`place`) needs *no* audit because it was never generated.

### 4.5 What the retry stack collapses to

Three layers → effectively zero for the data, one scoped retry for atmosphere:

- KB bind: deterministic, cannot "fail" in the LLM sense (missing year = explicit nearest-anchor with a logged warning, not a retry).
- Atmosphere: constrained decoding guarantees schema-valid output, so Layer A (parse/structure) and Layer C (schema-repair) **vanish**. Only the linter can ask for one scoped re-roll.
- Scoring (Layer B): the scorer is rewritten to grade the *real* artifact (is the KB binding complete and consistent with the brief? is the atmosphere on-period and non-empty?) so `adaptSettingForScoring`'s fabricated `clue_placements` are **deleted**. And retry feedback no longer rides on `tone`, killing the `appendRetryFeedbackOptional`-on-`undefined` bug.

### 4.6 Concrete before/after

| | Today | Redesign |
|---|---|---|
| Era facts | LLM paraphrases a hardcoded string at T=0.6 | KB lookup, byte-exact, year-keyed |
| Location facts | Generic template paragraph | Per-archetype affordance data |
| Anachronism check | Generator self-certifies `[]`; non-empty = run dies | Deterministic linter on atmosphere only; targeted re-roll + stub fallback |
| Variation | `runId` hash nudges one big prompt | Sampling params on a 4-field call |
| Generation cost | Full 2000-token JSON every attempt × 3 layers | One small constrained call for ~4 fields |
| Scoring | Grades synthesized filler | Grades the real binding + atmosphere |

---

## 5. Ripple effects on the rest of the pipeline

- **Downstream consumers get *better* data with no contract break.** Agents 2/2c/2d/2e/3b/9 read `era.decade`, `era.socialNorms`, `location.type`, `location.description`. We keep those exact field paths; they're now KB-sourced and more accurate. A back-compat shim emits the legacy `SettingRefinement` shape from the new `SettingContract` during migration.
- **The whole pipeline inherits a shared period authority.** Agent 6 (Fair-Play Auditor) and the blind-reader can *check clues against the same KB* — "is this clue discoverable by 1931 means?" becomes a lookup, not a vibe. The KB becomes a cross-cutting fairness oracle, not a one-shot Agent-1 artifact. This is arguably the biggest win: period correctness stops being re-litigated per agent.
- **Token/cost.** Agent 1 is not a top spender (prose dominates), but eliminating its triple-retry full-JSON regeneration removes call-count churn and a class of run-killing aborts on the *first* agent — high leverage because an Agent-1 abort wastes the cheapest possible point to fail.
- **Provenance everywhere.** Tagging fields `kb:` vs `llm:` lets later agents and debugging tools know which facts are authoritative vs creative — useful for the "machinery hidden unless asked for" philosophy.

---

## 6. How we'd know it worked

- **Period-accuracy:** a fixed audit set of (year, claim) pairs (e.g. "1931 has no fluorescent lighting," "no same-day DNA in any decade we support") — KB must answer correctly 100%; current agent's free-text drift can't guarantee this.
- **Run-kill rate from Agent 1 → ~0.** Today a non-empty realism array or schema failure aborts the run; the redesign has no generated logic-bearing fields to fail and a stub fallback for atmosphere.
- **Anachronism leak rate** measured by the *independent* linter on authored atmosphere across N runs — should trend toward zero and, when non-zero, be *fixable in the KB* rather than by reprompting.
- **Cost/latency per Agent-1 success:** expect a step-down (no triple full-JSON regenerations; one ~4-field constrained call).
- **Scoring honesty:** the phase score is computed on real fields, so the score must correlate with downstream agents' satisfaction with the setting (sanity-checkable by removing the synthetic `clue_placements` and confirming the gate still discriminates good from bad).
- **Variation without drift:** N runs of the same brief show varied `atmosphere` but byte-identical `era`/`place` — proving creativity and correctness are cleanly separated.

---

## 7. Migration path (incremental, no big-bang)

1. **Build the KB behind the existing function.** Reimplement `buildEraConstraints` to read year-keyed `packages/period-kb/` data and return the *same string shape*. Zero downstream change; deletes the silent 1930s default. Ship.
2. **Bind era/place deterministically.** In `refineSetting`, populate `era.*` and `location.type/accessControl` directly from the KB and *remove those fields from the LLM's output schema*. The LLM now only authors `atmosphere`. Keep emitting the legacy `SettingRefinement` shape. Validate parity on a canary set ([`scripts/canary-loop/config.mjs`](../../scripts/canary-loop/config.mjs) maps id `1` to this agent).
3. **Move atmosphere to constrained decoding** (Opus 4.8 structured output). Delete Layer A/C retries for this agent; they're now unreachable.
4. **Add the anachronism linter** as a post-generation pass with targeted re-roll + KB stub fallback. Delete the `realism.anachronisms/implausibilities` self-audit and its run-killing gate (`agent1-run.ts:76-84`).
5. **Fix scoring.** Rewrite [`agent1-setting-refinement-scorer.ts`](../../packages/story-validation/src/scoring/phase-scorers/agent1-setting-refinement-scorer.ts) to grade the real artifact; delete `adaptSettingForScoring`'s synthetic `clue_placements`. Decouple retry feedback from `tone`, fixing `appendRetryFeedbackOptional` blindness.
6. **Expose the KB to Agents 6/6.5** as a shared fairness oracle. Now period-correctness is enforced pipeline-wide.

Each step is independently shippable and reversible, and each *removes* a documented failure mode.

---

## 8. The pitch in one paragraph

Agent 1 today spends an LLM call to paraphrase facts it was handed, certifies its own work under a gate that kills the whole run if it's honest, and is scored against a fabricated artifact via an adapter that admits it's gaming the rubric. The job it's actually doing — bind authoritative period and place facts to this run, then add a breath of atmosphere — is 90% retrieval and 10% creativity. So **I'd make the 90% a curated, versioned, year-keyed Period Knowledge Base that downstream agents share as a fairness oracle, make the 10% a tiny constrained-decoding call that can only touch mood, and replace the generator's self-confession with a separate deterministic linter that has a backstop instead of a kill-switch.** Correctness stops being a prompt-engineering wish and becomes a property of the data: when we learn 1931 had no fluorescent light, we fix one line of YAML, and every future mystery is right.

---

## 9. Implementation Plan

> One line: turn Sections 1–8 from a thesis into a buildable, de-risked sequence — the cheapest experiments first, then the actual KB + binder + linter, with contracts and gates concrete enough that an AI can pick up the first PR without further design.

### 9.1 Validate the approach first (de-risking spikes)

The bet is "period facts are reference data, not creative work, and a small curated KB can serve the whole pipeline." Three spikes prove or kill it before we delete anything.

| Spike | Question it answers | Build (throwaway) | Falsified if… | Go/no-go signal |
|---|---|---|---|---|
| **S1 — Coverage probe** | Is the *current* free-text era output already redundant with what a KB could hold? | Diff `buildEraConstraints("1930s")` output against the `era.*` arrays that `refineSetting` actually emits across ~30 cached canary runs. | The LLM is *adding* load-bearing facts not derivable from the bundle (i.e. it's doing real work, not laundering). | ≥90% of emitted `era.*` items map back to the hardcoded bundle → KB is sufficient. **Go.** |
| **S2 — KB seed + linter PoC** | Can a year-keyed YAML answer the §6 audit set, and can a *deterministic* linter catch anachronisms the generator misses? | Hand-author `1931.yaml` + `country_manor.yaml`; write a ~50-line keyword/regex linter; run it against 20 known-bad atmosphere snippets ("fluorescent," "DNA swab," "rang her mobile"). | Linter can't catch obvious anachronisms without unbounded rule sprawl, or YAML can't express a fact downstream needs. | Linter flags ≥18/20 planted anachronisms with <2 false positives → **Go.** |
| **S3 — Constrained-decode atmosphere** | Will Opus 4.8 structured output reliably author a 4-field `atmosphere` object it *cannot* escape from? | One tool-schema call (`atmosphere` only) over 10 (year, archetype) pairs; assert it never emits an `era`/`place` field and is always schema-valid. | Model needs the logic fields in-context to write usable mood, or constrained decoding degrades prose quality unacceptably. | 10/10 schema-valid, zero logic-field leakage, atmosphere reads on-period → **Go.** |

Spikes are ~1 day each and share no code with the final build; a no-go on S1 means the agent does real generative work and this redesign is wrong at the root, so run S1 first.

### 9.2 What gets built — and deleted (components & contracts)

**New (named, with target paths):**

| Component | Path | Responsibility |
|---|---|---|
| `period-kb` package | [`packages/period-kb/`](../../packages/period-kb/) | Versioned data + loader. The KB itself. |
| Era data | `packages/period-kb/eras/<year>.yaml` | Year-keyed forensics/comms/policing/transport facts + `sources`. |
| Place data | `packages/period-kb/places/<archetype>.yaml` | Per-archetype access points, isolation profile, observability map. |
| `EraOracle` | `packages/period-kb/src/oracle.ts` | `bindEra(year)` / `bindPlace(archetype)` with **explicit nearest-anchor fallback** (logged warning, no silent default). Exposes `isDiscoverableBy(year, claim)` for Agents 6/6.5. |
| Anachronism linter | `packages/period-kb/src/anachronism-linter.ts` | `lint(atmosphereText, eraEntry) → { violations, strippedText? }`. Deterministic, KB-driven. |
| Atmosphere prompt builder | `packages/prompts-llm/src/agent1-atmosphere.ts` | Tiny constrained-decoding call; output schema = `atmosphere` only (4 fields). |
| `SettingContract` type + schema | `packages/cml/src/types/setting-contract.ts`, `schema/setting_contract.schema.yaml` | The provenance-tagged §4.1 artifact. |
| Back-compat shim | inside `refineSetting` | Emits legacy `SettingRefinement` shape from `SettingContract` during migration. |

**Deleted / shrunk (real paths):**

- [`packages/prompts-llm/src/shared/constraints.ts`](../../packages/prompts-llm/src/shared/constraints.ts) — `buildEraConstraints` becomes a thin KB-reader (Step 1), then is deleted once callers move to `EraOracle`. `buildLocationConstraints` (the pure-template paragraph, lines 51+) is **deleted**, replaced by place data.
- [`packages/prompts-llm/src/agent1-setting.ts`](../../packages/prompts-llm/src/agent1-setting.ts) — `generateVariationSeed` (lines 82-89) deleted; the big `buildSettingPrompt` shrinks to the atmosphere-only builder; Layer A retry loop (283-298) deleted.
- [`apps/worker/src/jobs/agents/agent1-run.ts`](../../apps/worker/src/jobs/agents/agent1-run.ts) — the **run-killing realism gate (lines 76-84) deleted**; Layer C schema-repair (86-112) deleted (constrained decoding makes it unreachable).
- [`apps/worker/src/jobs/scoring-adapters/agent1-scoring-adapter.ts`](../../apps/worker/src/jobs/scoring-adapters/agent1-scoring-adapter.ts) — synthetic `clue_placements` fabrication deleted.
- `realism.anachronisms` / `realism.implausibilities` removed from [`schema/setting_refinement.schema.yaml`](../../schema/setting_refinement.schema.yaml) generation contract.

**Rebuilt agent contract:**

```
runAgent1(inputs: { year: int, locationArchetype: string, brief?: tone }) → SettingContract {
  era:        EraOracle.bindEra(year)             // FROZEN, kb-sourced
  place:      EraOracle.bindPlace(archetype)      // FROZEN, kb-sourced
  atmosphere: lint(llmAtmosphere(era, place))     // AUTHORED, ≤4 fields, linter-clean or stubbed
  provenance: { era: "kb:vN/<year>", place: "kb:vN/<archetype>", atmosphere: "llm:opus-4.8" | "kb:stub" }
}
```

Guarantees: `era`/`place` are byte-identical for a given (year, archetype, KB version); the agent **cannot** abort the run (worst case = KB-derived atmosphere stub); output schema is always valid (constrained decoding).

### 9.3 Dependencies & sequencing

**Must exist first:**

- **P2 (constrained-decoding / structured-output tool-call infra)** — the atmosphere call depends on it. This is the only hard platform blocker. Until P2 lands, the atmosphere call uses today's text-JSON path behind the same builder interface (a stopgap, not the final form).
- **P1 (typed CML core)** — `SettingContract` should live as a typed CML artifact; `validateArtifact` already routes through [`@cml/cml`](../../packages/cml/) (confirmed in `agent1-run.ts:9`), so this is incremental, not a prerequisite.
- **P4 (golden/canary replay)** — needed for the parity gate in Phase 2, not for building the KB.
- **Other agents:** Agent 1 is a *producer* for the cross-agent map and blocks little. The KB→oracle handoff to **Agent 6 / 6.5** (clue-discoverability checks) depends on the Agent 3 **keystone** typed CML core landing first, because "is this clue discoverable by 1931 means?" needs Agent 3's logical-core clue representation to query against. So Phase 5 below is gated on Agent 3, not on Agent 1.

**Ordered phases (maps onto §7, with the first increment called out):**

1. **Phase 0 — KB skeleton + oracle (first increment).** Stand up `packages/period-kb/` with `1931.yaml`, `country_manor.yaml`, the `EraOracle`, and unit tests. No pipeline wiring. This is the smallest shippable, reversible PR and unblocks everything.
2. **Phase 1 — KB behind the existing function.** Reimplement `buildEraConstraints` to read the KB and return the *same string shape*; delete the silent 1930s default. Zero downstream change.
3. **Phase 2 — deterministic bind + parity.** Populate `era.*`/`place.*` from the oracle in `refineSetting`; remove them from the LLM output schema; keep emitting legacy `SettingRefinement`. Gate on canary parity (P4).
4. **Phase 3 — constrained atmosphere (needs P2).** Move atmosphere to the 4-field constrained call; delete Layer A/C retries.
5. **Phase 4 — linter + kill-switch removal.** Add the anachronism linter with targeted re-roll + stub fallback; delete the realism gate (`agent1-run.ts:76-84`) and fix scoring (§7.5).
6. **Phase 5 — expose oracle to Agents 6/6.5** (gated on Agent 3 keystone).

### 9.4 Test & validation strategy

- **Unit (KB/oracle):** every `<year>.yaml` parses and conforms to a strict schema (no free-text where structured fields are expected); `bindEra` returns the nearest anchor with a warning for unseeded years and never throws.
- **Golden (§6 audit set):** the fixed `(year, claim)` table ("1931 → no fluorescent lighting," "any decade → no same-day DNA") becomes a committed golden test; KB must answer **100%**. This is the acceptance gate for period-accuracy from §6.
- **Property / invariant test (this agent's signature invariant):** *for any fixed (year, archetype, KB version), `era` and `place` are byte-identical across N runs while `atmosphere` varies.* Encodes §6's "variation without drift" directly — fuzz the run seed, assert `deepEqual(run[i].era, run[j].era)` and `atmosphere` non-identical. A failure means logic and creativity have re-fused.
- **Linter property test:** the linter never *adds* facts — `lint` output text is a subset (possibly with clauses stripped) of input, never an extension; and any term it flags appears in a KB `forbidden`/`absent` list.
- **Canary replay (P4):** run id `1` against the canary harness ([`scripts/canary-loop/`](../../scripts/canary-loop/)); Phase 2 acceptance = legacy-shape parity within tolerance; Phase 4 acceptance = run-kill rate from Agent 1 == 0 across the canary set.
- **Acceptance gates tied to §6:** period-accuracy 100% on the audit set; Agent-1 run-kill rate ≈ 0; anachronism-leak rate trending to 0 and KB-fixable; scoring computed on real fields (remove synthetic `clue_placements` and confirm the 75-threshold gate still discriminates good from bad).

### 9.5 Rollout & rollback

- **Feature flag:** `AGENT1_PERIOD_KB_ENABLED` (env-var convention, matching the existing `AGENT_PRE9_ENABLE_*` flags in [`shared.ts:473-481`](../../apps/worker/src/jobs/agents/shared.ts)). Off → legacy `refineSetting` path unchanged.
- **Shadow:** Phase 1–2 run the KB binder in shadow, logging diffs between KB-bound `era.*` and the legacy LLM output without affecting the live artifact.
- **Canary:** flip the flag for canary runs only (id `1`); compare downstream agent satisfaction and run-kill rate before broad rollout.
- **Legacy fallback:** flag off restores the full legacy path; the back-compat shim means even with the flag *on*, downstream consumers still see the legacy `SettingRefinement` shape until they migrate.
- **Kill criteria:** roll back if canary shows (a) any downstream contract break, (b) period-accuracy regression on the audit set, or (c) atmosphere quality drop that a reader-panel spot-check flags. Because each phase is independently reversible, rollback is per-phase, not all-or-nothing.

### 9.6 Open questions to resolve before coding

1. **Year resolution.** Brief gives a decade today (`eraPreference: "1930s"`), but the KB is year-keyed. Do we ask for a year upstream, or deterministically pick a representative year per decade? (Affects the `runAgent1` input contract.)
2. **Interpolation rule.** Nearest-anchor vs. field-level interpolation for in-between years — and who owns documenting the chosen anchor in `provenance`.
3. **KB versioning surface.** Is the KB version pinned per-run (reproducibility) or always-latest (correctness)? Provenance tag (`kb:vN`) implies pinning — confirm.
4. **Archetype taxonomy.** Fixed enum of place archetypes vs. open set; how `locationSpec.institution` maps to an archetype.
5. **Linter strip-vs-reject policy.** When the linter finds a violation, default to silent clause-strip or to a targeted re-roll first? (§4.4 implies re-roll then stub.)
6. **Scorer rewrite scope.** What exactly does the rewritten [`agent1-setting-refinement-scorer.ts`](../../packages/story-validation/src/scoring/phase-scorers/agent1-setting-refinement-scorer.ts) grade once `clue_placements` are gone — KB-binding completeness + atmosphere on-period-ness only?

### 9.7 "Ready to build" checklist

- [ ] S1 coverage probe passed (≥90% of `era.*` items derivable from the bundle).
- [ ] §6 audit set committed as a golden-test fixture (the `(year, claim)` table).
- [ ] `SettingContract` schema agreed and the legacy→new field mapping written down (§5 shim).
- [ ] Open questions 9.6 #1 (year resolution) and #3 (KB versioning) answered — they fix the input contract and provenance tag.
- [ ] P2 availability confirmed *or* the text-JSON stopgap interface for the atmosphere call agreed (so Phase 0–2 don't block on it).
- [ ] Place-archetype enum decided (9.6 #4).
- [ ] Feature-flag name `AGENT1_PERIOD_KB_ENABLED` reserved.

**First task / PR to pick up:** *Phase 0* — create `packages/period-kb/` with `eras/1931.yaml`, `places/country_manor.yaml`, the `EraOracle` (`bindEra`/`bindPlace` with logged nearest-anchor fallback), the strict YAML schema, and unit + golden tests for the §6 audit set. No pipeline wiring — pure, reversible, and it unblocks every later phase.
