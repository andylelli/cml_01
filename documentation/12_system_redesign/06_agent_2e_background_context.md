# Agent 2e — Background Context: A Ground-Up Redesign

> Blue-sky brief: if I could rebuild Agent 2e from nothing, what would it become? My answer is the bluntest in this whole series — **it should not exist as a standalone LLM call.** It is a 1200-token pass that mostly photocopies its own inputs, runs full retry/scoring orchestration to produce one genuinely-new sentence, and is graded against a schema it never emits. Delete the stage; keep the one sentence; compute the rest.

---

## 1. The job to be done (first-principles)

Strip the implementation away. What does the pipeline actually need that this agent supposedly provides?

The downstream agents — CML (3), devices (3b), world-builder (6.5), prose (9) — each need a **shared, one-paragraph statement of social pressure**: *why is this particular cast trapped in this particular place, and what makes their private loyalties expensive?* That single framing keeps the mechanism, the alibis, and the prose pointed at the same dramatic center of gravity. An inheritance hearing, a quarantine, a board vote, a snowed-in reunion — pick one, and every later agent has a reason the cast can't just leave and can't stop lying.

That is a real need. But notice how *small* it is. It is **one synthesized fact**: a backdrop premise. Everything else the current artifact carries — the decade, the location, the institution, the weather, the social norms, the list of cast names — is **already authored** by Agent 1 (setting) and Agent 2 (cast). It is reference data the pipeline is *holding in its hands* at the moment 2e runs.

So the honest job-to-be-done is:

1. **Synthesize one backdrop premise** ("an inheritance hearing keeps heirs, staff, and creditors under one roof while public scandal makes private loyalties expensive"). Genuinely creative. Wants a model. ~1 sentence.
2. **Select 4–8 socially-central cast anchors.** Borderline-deterministic — Agent 2 already tags detective/victim candidates and roles. A ranked pick, not an invention.
3. **Restate the era/setting facts in a flat shape.** Pure copy. Zero creative content. The current prompt literally hands the model `decade`, `location`, `institution`, `weather` and asks it to write them back out.

Item 1 is the whole value. Items 2 and 3 are derivable from artifacts that already exist. The current agent fuses all three into one LLM call, wraps it in three retry layers and a scoring loop, and ships it as a "phase." That is a vast orchestration tax on one sentence of real output.

---

## 2. How it works today (grounded)

Four files define the agent:

- [`packages/prompts-llm/src/agent2e-background-context.ts`](../../packages/prompts-llm/src/agent2e-background-context.ts) — prompt builder + `generateBackgroundContext()`.
- [`apps/worker/src/jobs/agents/agent2e-run.ts`](../../apps/worker/src/jobs/agents/agent2e-run.ts) — runner, scoring-path retry, schema validation.
- [`schema/background_context.schema.yaml`](../../schema/background_context.schema.yaml) — the output contract.
- [`packages/story-validation/src/scoring/phase-scorers/agent2e-background-scorer.ts`](../../packages/story-validation/src/scoring/phase-scorers/agent2e-background-scorer.ts) — the phase scorer.

**It runs third, right behind the cast.** Despite the "2e" label, the runtime order in [`mystery-orchestrator.ts:663-671`](../../apps/worker/src/jobs/mystery-orchestrator.ts) is `1 → 2 → 2e → 3b → 3 → … → 2b → 2c → 2d`. Agent 2e fires *immediately after* Agent 2, with **nothing between them** and only Agent 1 + Agent 2 outputs in scope. The "2b/2c/2d/2e fragmentation" framing is a documentation artifact — at runtime, 2b/2c/2d come *much later* (after CML), and they merely receive `backgroundContext` as a passive scoring-context hint, not as a true input ([`agent2c-run.ts:128`](../../apps/worker/src/jobs/agents/agent2c-run.ts), [`agent2d-run.ts:42`](../../apps/worker/src/jobs/agents/agent2d-run.ts)). This matters: 2e is structurally a *trailer on Agent 2*, not a member of a context cluster.

**The prompt feeds the model its own answers.** [`buildBackgroundContextPrompt`](../../packages/prompts-llm/src/agent2e-background-context.ts) (lines 48-118) hands the model `setting.era.decade`, `setting.location.description`, `setting.location.type`, `setting.atmosphere.weather`, `setting.era.socialNorms`, and the exact cast names — then asks it to return a JSON object containing `era.decade`, `setting.location`, `setting.institution`, `setting.weather`, and `castAnchors` ("use these exact names only"). Of the seven output fields, **five are restatements of inputs**. Only `backdropSummary` and (loosely) `theme` are synthesized. Runs at `temperature: 0.4, max_tokens: 1200, default_max_attempts: 2` ([`generation-params.yaml:63-70`](../../apps/worker/config/generation-params.yaml)).

**Two nested retry systems wrap the one sentence.** Inside `generateBackgroundContext`, [`withValidationRetry`](../../packages/prompts-llm/src/utils/validation-retry-wrapper.js) re-sends on JSON-parse failure or `status !== "ok"` (max 2 attempts). Outside, when scoring is enabled, [`executeAgentWithRetry`](../../apps/worker/src/jobs/agents/agent2e-run.ts) re-runs the whole thing on a failed phase score, with feedback appended to the `theme`/`tone` fields ([`agent2e-run.ts:35-36`](../../apps/worker/src/jobs/agents/agent2e-run.ts)). Then the runner re-validates against the schema and **throws to kill the run** if it still fails ([`agent2e-run.ts:82-88`](../../apps/worker/src/jobs/agents/agent2e-run.ts)).

**The scorer grades a phantom artifact.** This is the load-bearing finding. The artifact's real shape is `{ backdropSummary, era:{decade,socialStructure}, setting:{location,institution,weather}, castAnchors[], theme }`. But [`BackgroundContextScorer`](../../packages/story-validation/src/scoring/phase-scorers/agent2e-background-scorer.ts) reads a **completely different schema**: `era_background.tech_capabilities`, `era_background.forensic_capabilities`, `location_background.physical_constraints`, `constraints.prohibited_anachronisms` — *none of which the artifact emits.* The gap is papered over by [`adaptBackgroundContextForScoring`](../../apps/worker/src/jobs/scoring-adapters/agent2e-scoring-adapter.ts), which **rebuilds the scorer's expected object almost entirely from `setting`** — `tech_capabilities: setting.era.technology`, `forensic_capabilities: setting.era.forensics`, `physical_constraints: setting.location.physicalConstraints`, and so on. The model's actual output contributes only `decade`, `location`, and a single `socialStructure` string to what gets scored. **The phase gate is grading Agent 1's setting, laundered through an adapter, not Agent 2e's work.**

**Downstream, the artifact is consumed thinly.** Agent 3 flattens it to ~5 lines of text ([`agent3-cml.ts:78-84`](../../packages/prompts-llm/src/agent3-cml.ts)) that duplicate setting/cast data the same prompt already carries. Agent 9 uses exactly two fields — `backdropSummary` and `castAnchors` ([`agent9-run.ts:2997-3007`](../../apps/worker/src/jobs/agents/agent9-run.ts)). Agent 6.5 dumps the whole JSON blob into its prompt ([`agent65-world-builder.ts:296`](../../packages/prompts-llm/src/agent65-world-builder.ts)). The genuinely-used signal across all of them is **`backdropSummary` plus the anchor list**. The rest is redundant with Agent 1/2.

---

## 3. Where it hurts (specific to this agent)

1. **It pays a full LLM call + orchestration to photocopy its inputs.** Five of seven fields are restatements of data already in `ctx.setting` and `ctx.cast`. A temperature-0.4 model copying `decade` and `location` back can only ever *match or corrupt* them — it cannot improve them. The marginal value is one sentence (`backdropSummary`) and a name-ranking.

2. **The scorer/artifact mismatch makes the gate fictional — and dangerous.** Because the scorer reads `tech_capabilities`/`forensic_capabilities`/`physical_constraints` that the artifact never produces, and the adapter back-fills them from `setting`, **the phase score is essentially a re-score of Agent 1**. A retry loop that resends the prompt on a failed score is steering 2e using a signal that barely reflects 2e. And the model's *actual* deliverable — `backdropSummary`, the only thing that matters — is **never scored at all** (the scorer has no test for it). The one field worth grading is ungraded; six fields not worth grading drive the gate.

3. **A no-backstop schema throw on trivial output.** [`agent2e-run.ts:87`](../../apps/worker/src/jobs/agents/agent2e-run.ts) throws and kills the entire run if the (tiny, mostly-copied) artifact fails schema validation. For an artifact whose 5 deterministic fields *cannot* fail unless the model mangled a copy, this is a run-killer guarding against the model failing to transcribe text we already had.

4. **It is the tail of a fragmentation that, at runtime, isn't even adjacent.** The doc framing groups 2b/2c/2d/2e as a "context cluster," but 2e runs 100+ lines and several agents *before* the others. It is not the tail of a cluster — it is a **trailer bolted onto Agent 2**, separated only by a function boundary, a retry harness, a scoring adapter, and a prompt-capture artifact. All of that overhead buys a function call's worth of separation.

5. **Token churn and call-count tax with no creative justification.** Two internal attempts × optional scoring re-runs, each resending a near-identical prompt, for ~1 sentence of novel content. On Opus-class pricing this is pure waste; on any model it adds a serializing dependency (Agent 3b/3 wait on it) for almost no information gain.

6. **Theme passes through, lightly mutated, for no clear consumer.** `theme` is fed in and echoed out, occasionally rephrased. Agent 3 already receives `ctx.inputs.theme` directly. The 2e `theme` round-trip is a second, divergent copy of a value the pipeline already owns.

7. **The largest consumer doesn't even score against it.** Agent 6.5 receives the whole `backgroundContext` JSON into its prompt ([`agent65-run.ts:33`](../../apps/worker/src/jobs/agents/agent65-run.ts)), but its scorer runs with `previous_phases: {}` and only the CML ([`agent65-run.ts:48-53`](../../apps/worker/src/jobs/agents/agent65-run.ts)) — so the world-builder's quality gate is blind to whether it used the backdrop at all. The artifact's biggest reader treats it as optional prompt seasoning. That is a fair description of the whole artifact: seasoning, not structure.

---

## 4. Blue-sky redesign

**Thesis: delete Agent 2e as a stage. Move its one creative act — the backdrop premise — into Agent 2's cast pass, where the cast and motives are being invented anyway. Compute the anchors and the flat era/setting fields deterministically. Score the one sentence that matters, not the six that don't.**

This is the strongest "absorb this stage" case in the entire pipeline, and I want to make it rigorously rather than rhetorically.

### 4.1 Why Agent 2 is the right home (not Agent 1, not a new "Grounding" agent)

The backdrop premise is a statement about **why this cast shares an arena under pressure**. It is downstream of the cast — you cannot write "an inheritance hearing keeps heirs, staff, and creditors under one roof" until you know there *are* heirs, staff, and creditors. So it cannot fold up into Agent 1 (which runs before the cast exists). It *can* fold into Agent 2, which is the first point at which both ingredients — setting (from 1) and cast (just produced) — coexist. At runtime they already coexist there: 2e fires with nothing between it and Agent 2.

I considered, and reject, three alternatives the brief raises:

- **A consolidated "Grounding" agent (merge 1, 2d, 2e).** This re-creates a standalone call for the same one-sentence payload and re-introduces the exact handoff/scoring/retry surface I'm trying to delete. It also forces an artificial coupling: Agent 1 (era facts, mostly deterministic) and 2d (temporal sequencing, genuinely hard logic) have nothing structurally to do with a backdrop premise. Bundling them produces a grab-bag agent with three unrelated failure modes. Rejected.
- **Compute the backdrop summary deterministically from artifacts.** Tempting, because the *other* five fields are deterministic — but the summary itself is not. "What social engine traps *this* cast here" is a genuinely creative compression of cast + setting that templating would flatten into the very "they are all connected by events at the manor" weak output the current prompt warns against ([`agent2e-background-context.ts:89`](../../packages/prompts-llm/src/agent2e-background-context.ts)). The one creative field stays a model call. Rejected for the summary; accepted for everything else.
- **Leave 2e as-is but just fix the scorer.** This treats the symptom. Even with a correct scorer, you'd still have a full LLM stage producing one novel sentence behind a retry harness. Fixing the gate on a stage that shouldn't exist is polishing a deletion candidate. Rejected.

The premise is not big enough to anchor its own agent — it is **one field on the cast artifact**, produced by the call that already knows the cast best.

### 4.2 The new shape

Agent 2's output gains a single field:

```jsonc
// added to the cast artifact, produced in the SAME tool call as motives/relationships
"backdrop": {
  "summary": "An inheritance hearing keeps heirs, staff, and creditors under one roof while public scandal makes private loyalties expensive.",
  "pressure": "scandal-driven reputational cost"   // 2-4 word tag for the dramatic engine
}
```

Everything else the old artifact carried is **computed by a pure function**, not generated:

```ts
// builders run after Agent 2 returns; no LLM, no retry, no scoring
function deriveBackgroundContext(setting, cast, backdrop): BackgroundContextArtifact {
  return {
    status: "ok",
    backdropSummary: backdrop.summary,
    era: { decade: setting.era.decade, socialStructure: setting.era.socialNorms.join("; ") },
    setting: {
      location:    setting.location.description,
      institution: setting.location.type,
      weather:     setting.atmosphere.weather,
    },
    castAnchors: rankAnchors(cast),   // detective + victim candidates + role-central, top 6
    theme:       inputs.theme,
  };
}
```

`rankAnchors` is deterministic: Agent 2 already exposes `crimeDynamics.detectiveCandidates` and `victimCandidates` ([`agent3-run.ts:94-95`](../../apps/worker/src/jobs/agents/agent3-run.ts)), plus per-character roles. Anchors = detective candidate, then victim-adjacent, then institutional/role-central characters, capped at 6. No model needed to *select names that already exist*.

The artifact schema stays **byte-for-byte identical**, so Agents 3, 3b, 6.5, 9 don't change a line. The artifact is still emitted, still written to the report, still capturable — it just stops being an *LLM stage* and becomes a *derived view*.

### 4.3 Concrete walk-through

Agent 2 is already producing, in one structured tool call, the cast, motives, relationships, and crime dynamics. We extend its output schema with `backdrop.summary` + `backdrop.pressure` and add four lines to its prompt: *"Also state, in one sentence, the social engine that traps this specific cast in one place and makes their loyalties costly — the backdrop pressure. Do not invent mechanism or culprit."* The model is already reasoning about who hates whom and why; the backdrop premise is a natural by-product of that same thought, not a fresh context-load. **One creative act, zero extra calls, zero new handoff.**

Then `deriveBackgroundContext` runs synchronously after Agent 2 returns and writes `ctx.backgroundContext`. The CML generator at 3b/3 sees exactly what it sees today.

### 4.4 The overhead-vs-value ledger

| What 2e costs today | What it actually produces |
|---|---|
| 1 LLM call, 1200 max_tokens, temp 0.4 | 1 synthesized sentence (`backdropSummary`) |
| 2 internal retry attempts | 1 name-ranking (derivable) |
| Optional scoring re-runs | 5 fields copied verbatim from inputs |
| A scoring adapter + scorer (grading the wrong schema) | a `theme` echo the pipeline already owns |
| A schema-validation throw that can kill the run | |
| A prompt-capture artifact per run | |
| A serializing dependency before 3b/3 | |

The right-hand column is one sentence and one ranking. The redesign keeps **both**: the sentence moves into Agent 2 (marginal cost: a few tokens on a call that's already happening), the ranking becomes a pure function. Everything in the left column disappears. This is not a "make it cheaper" change — it is a **stage deletion** with the value preserved.

### 4.5 What to do about scoring

Don't rebuild the broken scorer — **retire it.** Replace the phase gate with a tiny deterministic check on the one field worth checking, run inside Agent 2's existing validation:

- `backdrop.summary` is 1–2 sentences, ≥ 12 words, names a *shared* pressure (heuristic: references a setting/institution token AND a social/relational token).
- `castAnchors` ⊆ cast names, 4–8 entries (guaranteed by construction, so this is an assertion, not a gate).

No separate scorer class, no adapter, no phantom schema. If the summary fails the word/grounding check, it rides Agent 2's *existing* retry — it does not get its own retry machinery. The thing actually worth grading finally gets graded; the six derived fields stop being graded because there is nothing to grade about a copy.

---

## 5. Ripple effects on the rest of the pipeline

- **Agent 2 (cast)** gains two output fields and four prompt lines. Its tool-call schema grows slightly; its scoring grows one assertion. This is the only agent that materially changes.
- **`agent2e-run.ts` is deleted**, and the `runAgent2e(ctx)` call at [`mystery-orchestrator.ts:667`](../../apps/worker/src/jobs/mystery-orchestrator.ts) is replaced by an inline `ctx.backgroundContext = deriveBackgroundContext(...)`. One serializing await removed from the critical path.
- **`agent2e-background-context.ts`**, the scoring adapter, and the scorer are removed. `BackgroundContextScorer`, `adaptBackgroundContextForScoring`, and the `agent2e_background_context` cost/duration keys go away (or the cost key reports 0).
- **Agents 3, 3b, 6.5, 9: zero code change.** They read `ctx.backgroundContext` with the identical schema. This is the whole point of keeping the artifact shape stable — the consumers can't tell the difference between a generated and a derived artifact.
- **The report/artifact stream** still emits `background_context` ([`mystery-orchestrator.ts:668`](../../apps/worker/src/jobs/mystery-orchestrator.ts)), so dashboards, prompt-capture diffing, and stored runs keep working. The only missing item is the 2e *prompt* snapshot — because there is no longer a 2e prompt.
- **The `theme` round-trip collapses**: `backgroundContext.theme = inputs.theme`, full stop. No second divergent copy.

The net architectural effect: the pipeline drops from 15 LLM stages to 14, with **no loss of downstream information** and the removal of a fictional quality gate.

---

## 6. How we'd know it worked

1. **Artifact equivalence.** On a corpus of past runs, `deriveBackgroundContext(setting, cast, backdrop)` should produce an artifact that validates against `background_context.schema.yaml` 100% of the time (the derived fields cannot fail; only `backdrop.summary` can, and it's checked at the Agent 2 layer). Compare derived vs. historical 2e artifacts: the 5 copied fields should match Agent 1/2 source *more* faithfully than the old LLM copies did (no transcription drift).
2. **Downstream invariance.** Run the same seeds through old (2e-as-agent) and new (2e-as-derivation) pipelines; CML, fair-play, and prose outputs should be statistically indistinguishable in score. If 2e was adding real value, removing it would *drop* downstream quality — I predict it won't move, which is the proof it was overhead.
3. **Backdrop quality, measured where it lives.** Track the `backdrop.summary` word/grounding heuristic pass-rate inside Agent 2. It should match or beat the old 2e `backdropSummary` quality (same model, more context, no copy-tax diluting the call's attention).
4. **Cost & latency.** One fewer LLM call and its retries per run. Expect a measurable drop in total tokens and a shorter critical path to CML.
5. **The scorer bug stops mattering** because the scorer is gone. As a regression guard, assert that no remaining scorer reads `era_background`/`location_background` (the phantom schema) anywhere.

---

## 7. Migration path

**Phase 0 — confirm the value floor (no code).** Diff a sample of historical 2e artifacts against `deriveBackgroundContext(setting, cast, <use existing backdropSummary>)`. Verify the 5 derived fields are reconstructible from inputs. This proves the "mostly a photocopy" claim before touching anything.

**Phase 1 — derive in place, keep the call.** Land `deriveBackgroundContext`. Have `agent2e-run.ts` keep calling the LLM but **only for `backdropSummary`** (drop the 5 copied fields from the prompt; fill them from the deriver). Shrinks the prompt, removes the scorer/adapter, replaces the gate with the word/grounding heuristic. Lower-risk: the call still exists, but it now does one job.

**Phase 2 — fold into Agent 2.** Add `backdrop.summary`/`backdrop.pressure` to Agent 2's output schema and prompt. Have the orchestrator replace `runAgent2e` with the synchronous deriver. Delete `agent2e-run.ts`, `agent2e-background-context.ts`, the adapter, and the scorer. Behind a flag, run shadow comparisons (Phase-1 artifact vs. Phase-2 artifact) until equivalence is confirmed.

**Phase 3 — clean up.** Remove the `agent2e_background_context` entry from `generation-params.yaml`, the cost/duration keys, the standalone documentation page, and the prompt-capture wiring. Update the agent-count and the runtime-order docs to reflect 14 stages.

Each phase is independently shippable and reversible; the schema stability of the artifact means consumers never break.

---

## 8. The pitch in one paragraph

Agent 2e is a 1200-token LLM stage that copies five of its seven output fields straight from artifacts the pipeline already holds, gets graded by a scorer reading a schema it never emits (so the gate actually re-scores Agent 1 through an adapter), can hard-throw the whole run over a failed transcription, and contributes exactly one piece of genuine information downstream — a single backdrop-pressure sentence used by CML and prose. It is the clearest delete-this-stage candidate in the pipeline. So delete it: move the one creative sentence into Agent 2's cast call (where the cast and motives are already being reasoned about), compute the era/setting/anchor fields with a pure function, keep the artifact shape byte-identical so no downstream agent changes, and replace the fictional phase gate with a two-line check on the only field worth checking. The pipeline loses a stage, a retry harness, a scoring adapter, a phantom-schema scorer, and a run-killer — and loses no information at all.

---

## 9. Implementation Plan

> Sections 1–8 argue *why* to delete the stage; this section is the de-risked build order to actually do it. This is the simplest plan in the series — it is a deletion, not a redesign — so the entire risk is concentrated in one proof: that a pure function plus one new Agent-2 field reproduces the 2e artifact byte-for-byte. Prove that on a canary first; everything else is bookkeeping.

### 9.1 Validate the approach first (de-risking spikes)

I will not delete a single line until I have proven, on real run data, that no consumer can tell a derived artifact from a generated one. The whole redesign rests on one claim — *the artifact is reconstructible from inputs plus one sentence* — so I attack that claim before I trust it.

**Spike A — enumerate every reader of the 2e artifact (must be exhaustive before deleting).** I grepped this already; the complete consumer set of `ctx.backgroundContext` is:

| Reader | Location | What it actually reads |
|---|---|---|
| Agent 3 (CML) | [`agent3-cml.ts:77-84`](../../packages/prompts-llm/src/agent3-cml.ts) | flattens `backdropSummary`, `era.{decade,socialStructure}`, `setting.{location,institution,weather}`, `castAnchors`, `theme` to ~5 text lines |
| Agent 3b | [`agent3b-run.ts:32,62`](../../apps/worker/src/jobs/agents/agent3b-run.ts) | passes the whole artifact as `agent2e_background_context` scoring context |
| Agent 6.5 (world-builder) | [`agent65-run.ts:33,75`](../../apps/worker/src/jobs/agents/agent65-run.ts) | dumps the whole JSON blob into its prompt |
| Agent 9 (prose) | [`agent9-run.ts:2782,2997-3007`](../../apps/worker/src/jobs/agents/agent9-run.ts) | uses **only** `backdropSummary` and `castAnchors` (top 6) |
| Orchestrator | [`mystery-orchestrator.ts:668,1018,1219`](../../apps/worker/src/jobs/mystery-orchestrator.ts) | emits `background_context` artifact; passes `ctx.backgroundContext` into report + later agents |

The contract every one of them depends on is [`background_context.schema.yaml`](../../schema/background_context.schema.yaml): `{ status, backdropSummary, era:{decade,socialStructure?}, setting:{location,institution,weather?}, castAnchors[], theme? }`. **If the derived artifact validates against this schema and matches field-for-field, all five readers are invariant by construction.** That is the falsifiable target.

**Spike B — prove byte-identical reproduction on a canary corpus (the one spike that can kill the plan).** Take ≥20 historical runs that have a stored 2e artifact (the `documentation/prompts/actual/run_*/05_Agent2e-BackgroundContext_response.md` captures, plus `apps/api/data/reports/*` run JSON). For each, feed the *same* `setting` + `cast` into a draft `deriveBackgroundContext(...)`, supplying the historical `backdropSummary` as the `backdrop.summary` input (we are testing the derivation, not the model yet). Then diff the derived artifact against the historical one. **The five derived fields must match exactly** — `era.decade`, `era.socialStructure`, `setting.location`, `setting.institution`, `setting.weather`, `theme`, and `castAnchors` (modulo ordering/cap). Where they *don't* match, I learn something important: either the old LLM was mangling a copy (good — derivation is strictly better) or my pure function has the wrong mapping (fix it now, cheaply, before any deletion).

**Falsification — what would make me stop.** If a historical `castAnchors` list contains a name that is *not* derivable from `cast` ranking (i.e., the model invented or reordered anchors in a way no deterministic rule reproduces, and that ordering demonstrably matters to Agent 9), then "select is deterministic" is false and the anchor pick needs more than `rankAnchors`. If any historical `socialStructure` or `institution` carries information *not present in `setting`* (i.e., the model added a real fact, not a copy), then "five fields are photocopies" is false for that field and it must move into the Agent-2 creative payload too. I expect neither — Section 2 shows the prompt literally hands the model these values — but the canary is how I *prove* it rather than assert it. If the canary shows ≥95% exact reproduction with the residual being old-LLM transcription drift, the plan is green.

### 9.2 What gets built — and deleted (components & contracts)

This plan deletes far more than it adds. Two things get built; six get removed.

**BUILT (1) — the pure derivation function.** A new `deriveBackgroundContext(setting, cast, backdrop, theme)` (home: `packages/prompts-llm/src/` next to the cast types, or a small `derive-background-context.ts`). No `ctx.client`, no `await`, no retry, no scoring. Signature and body are already sketched in §4.2. Its only non-trivial piece is `rankAnchors(cast)`: deterministic, ordered detective-candidate → victim-adjacent → role/institution-central, capped at 6, drawn from fields Agent 2 already exposes ([`agent3-run.ts:94-95`](../../apps/worker/src/jobs/agents/agent3-run.ts): `crimeDynamics.detectiveCandidates`, `victimCandidates`). Output type is the existing `BackgroundContextArtifact` — **no new type**, that is the point.

**BUILT (2) — one new field on Agent 2's output.** Add `backdrop:{summary,pressure}` to Agent 2's tool-call schema and ~4 prompt lines (the instruction in §4.3). Plus one assertion in Agent 2's *existing* validation: `backdrop.summary` ≥ 12 words and references a setting/institution token AND a social/relational token (the §4.5 heuristic). No new scorer class.

**DELETED (with real paths):**

| Delete | Path | Note |
|---|---|---|
| The runner | [`agent2e-run.ts`](../../apps/worker/src/jobs/agents/agent2e-run.ts) | whole file; the `runAgent2e` import + call at [`mystery-orchestrator.ts:51,667`](../../apps/worker/src/jobs/mystery-orchestrator.ts) |
| The prompt builder | [`agent2e-background-context.ts`](../../packages/prompts-llm/src/agent2e-background-context.ts) | `generateBackgroundContext()` and its prompt |
| The scoring adapter | [`agent2e-scoring-adapter.ts`](../../apps/worker/src/jobs/scoring-adapters/agent2e-scoring-adapter.ts) | `adaptBackgroundContextForScoring` + its export in `scoring-adapters/index.js` |
| The phantom-schema scorer | [`agent2e-background-scorer.ts`](../../packages/story-validation/src/scoring/phase-scorers/agent2e-background-scorer.ts) | `BackgroundContextScorer`; the `era_background`/`location_background` schema dies with it |
| Retry/validation harness | inside `agent2e-run.ts` (the `executeAgentWithRetry` wrap + the schema-throw at `:82-88`) | the run-killer goes away |
| Config + cost keys | `agent2e_background_context` block in [`generation-params.yaml:63-70`](../../apps/worker/config/generation-params.yaml); `ctx.agentCosts`/`ctx.agentDurations` keys | report cost for this stage becomes 0 / absent |

**THE COMPATIBILITY SHIM (the load-bearing contract).** At [`mystery-orchestrator.ts:667`](../../apps/worker/src/jobs/mystery-orchestrator.ts), replace `await runAgent2e(ctx)` with a synchronous:

```ts
ctx.backgroundContext = deriveBackgroundContext(
  ctx.setting!.setting, ctx.cast!.cast, ctx.cast!.cast.backdrop, ctx.inputs.theme,
);
if (onArtifact && ctx.backgroundContext)
  await onArtifact("background_context", ctx.backgroundContext).catch(() => {});
```

The artifact is still set on `ctx.backgroundContext`, still emitted as `background_context`, still passed to the report ([`:1018,1219`](../../apps/worker/src/jobs/mystery-orchestrator.ts)). **Same key, same shape, same emission point.** Agents 3/3b/6.5/9 are not touched. The *only* observable difference is that no 2e prompt snapshot is captured (there is no 2e prompt). That is the whole compatibility surface: keep the artifact byte-identical and the deletion is invisible to everyone downstream.

### 9.3 Dependencies & sequencing

This change sits inside the broader pipeline rework; the dependency map says the umbrella is **MERGE 2b/2c/2d/2e into a "Prose Brief"**, and *this deletion is the simplest case of that umbrella* — 2e has no logic to merge, only a sentence to relocate and fields to derive. It does not block, and is not blocked by, the keystone (**Agent 3**) or the harder sibling redesigns (2d→TemporalAnchor, 2b→Voice Capsule, 2c→eager spine + lazy texture). It can land independently and first.

**Hard dependency — Agent 2 must change before 2e can be deleted.** The backdrop sentence lives on Agent 2's output, so:

- **Phase 0 (no code):** run the §9.1 canary. Gate the whole effort on ≥95% byte-identical reproduction.
- **Phase 1 — Agent 2 grows the field.** Add `backdrop.summary`/`backdrop.pressure` to Agent 2's schema + prompt + one validation assertion. Ship it; 2e still runs and still ignores the new field. Zero risk: additive only. This must come first because the deriver needs `cast.backdrop` to exist.
- **Phase 2 — derive in place, keep the call (the §7 Phase-1 step).** Land `deriveBackgroundContext`. Keep `agent2e-run.ts` calling the LLM, but only for `backdropSummary`; fill the five copied fields from the deriver. This isolates the derivation function under the old harness so I can shadow-diff it before deleting anything.
- **Phase 3 — flip the orchestrator to the shim, delete 2e.** Replace `runAgent2e` with the synchronous derive (now sourcing `backdrop.summary` from the Phase-1 Agent-2 field). Delete the runner, prompt, adapter, and scorer. Behind a flag (§9.5).
- **Phase 4 — cleanup.** Remove the config block, cost/duration keys, and update agent-count/runtime-order docs to 14 stages.

**Platform dependencies.** Lean on **P3 (validation-gated-mutation discipline)** for the one new Agent-2 assertion — the backdrop heuristic must be a *validation* check that feeds Agent 2's existing retry, not a fresh gate. Lean on **P4 (golden/canary replay harness)** for §9.1 and §9.4 — the byte-identical proof *is* a P4 replay. No dependency on P2 (constrained decoding) beyond whatever Agent 2 already uses for its tool call.

**First increment:** Phase 0 + Phase 1 in one PR — run the canary, and (if green) add the additive `backdrop` field to Agent 2. Nothing is deleted; the field is dormant; the proof is captured in CI.

### 9.4 Test & validation strategy

The thesis is "no information lost," so the tests are equality tests, not quality tests.

1. **Byte-identical artifact golden test (the keystone test).** For the canary corpus, assert `deriveBackgroundContext(setting, cast, {summary: historicalBackdropSummary, ...}, theme)` deep-equals the historical 2e artifact on all five derived fields and validates against `background_context.schema.yaml`. This is the regression guard that the shim is truly transparent. It runs in CI as a P4 replay.
2. **"No information lost" invariant.** Diff what each *consumer* receives, not just the artifact: render Agent 3's `backgroundContextText` block ([`agent3-cml.ts:77-84`](../../packages/prompts-llm/src/agent3-cml.ts)) and Agent 9's two injected lines ([`agent9-run.ts:2997-3007`](../../apps/worker/src/jobs/agents/agent9-run.ts)) from both the old and derived artifacts; they must be string-identical. If the *prompts* the downstream agents see are identical, downstream behavior is identical by definition.
3. **`rankAnchors` determinism test.** Same `cast` → same anchor list, every time; anchors ⊆ cast names; 4–8 entries. Property-style over the canory casts.
4. **Backdrop heuristic test.** Unit-test the §4.5 word/grounding check (≥12 words, shared-pressure tokens) against known-good and known-weak summaries (e.g. the "all connected by events at the manor" failure the old prompt warns against, [`agent2e-background-context.ts:89`](../../packages/prompts-llm/src/agent2e-background-context.ts)).
5. **Downstream-invariance canary (the §6.2 experiment).** Run identical seeds through old (2e-as-agent) and new (2e-as-derivation) pipelines; CML / fair-play / prose scores must be statistically indistinguishable. A *drop* would mean 2e was adding real value — I predict no movement, and that null result is the proof.
6. **Regression guard:** assert no remaining scorer references `era_background`/`location_background` anywhere (the phantom schema must be fully dead).

### 9.5 Rollout & rollback

- **Flag:** `derive_background_context` (default off in Phase 2, default on in Phase 3). When off, the orchestrator runs the legacy `runAgent2e`; when on, it runs the synchronous deriver. One boolean, one branch at [`mystery-orchestrator.ts:667`](../../apps/worker/src/jobs/mystery-orchestrator.ts).
- **Keep 2e as a dead fallback for one release.** Do **not** delete `agent2e-run.ts`/`agent2e-background-context.ts`/the adapter/the scorer in the same PR that flips the flag. Keep them reachable behind `derive_background_context === false` for exactly one release. If any downstream consumer mismatches in production, flip the flag back — instant rollback to byte-identical old behavior, no redeploy of consumers needed (their contract never changed).
- **Delete in the *following* release**, once the golden test + downstream-invariance canary have a clean release of telemetry. The cleanup PR (Phase 4) removes the dead files and the flag together.
- **Rollback is cheap precisely because the artifact shape is stable.** There is no schema migration, no consumer change, no stored-data format change to revert. The flag is the entire rollback mechanism.

### 9.6 Open questions to resolve before coding

1. **Does any historical `castAnchors` ordering carry meaning Agent 9 relies on?** Agent 9 takes `.slice(0,6)` — does the *order* of those six matter to prose, or only the set? If order matters, `rankAnchors` must reproduce the old model's implicit ranking, not just the membership. (Resolve in §9.1 Spike B.)
2. **Is `socialStructure` ever more than `setting.era.socialNorms.join("; ")`?** The deriver assumes it's a pure join. If the old model meaningfully *synthesized* social structure beyond the norms array, that synthesis is a second creative field and must move into the Agent-2 backdrop payload, not the deriver.
3. **Where exactly does `backdrop` live on the cast artifact, and does Agent 2's tool schema tolerate the addition without breaking constrained decoding?** Confirm the field name doesn't collide and that adding it doesn't perturb the existing cast/motive sampling.
4. **What does the report/dashboard show for a stage with zero LLM cost?** Decide whether `agent2e_background_context` reports `cost: 0` or is dropped from `agentCosts` entirely — and whether any UI ([`apps/web/src/App.vue`](../../apps/web/src/App.vue)) hard-expects the key.
5. **Does `theme` ever legitimately diverge from `inputs.theme`?** The deriver sets `theme = inputs.theme` flat. Confirm no consumer depends on the old 2e `theme` mutation (§3 item 6 says it shouldn't — verify against the canary).

### 9.7 "Ready to build" checklist

- [ ] §9.1 canary corpus assembled (≥20 historical runs with stored 2e artifacts).
- [ ] §9.1 Spike B passes: ≥95% byte-identical reproduction of the five derived fields; residual explained as old-LLM transcription drift.
- [ ] Open questions 1 and 2 (anchor ordering, `socialStructure` synthesis) answered by the canary; if either fails, that field is re-scoped into the Agent-2 payload before proceeding.
- [ ] `rankAnchors` ranking rule pinned and unit-tested against canary casts.
- [ ] Backdrop word/grounding heuristic agreed and unit-tested.
- [ ] `derive_background_context` flag plumbed at the orchestrator branch point.
- [ ] Golden + downstream-invariance tests wired into the P4 replay harness.

**FIRST task / PR:** *"Add dormant `backdrop.{summary,pressure}` to Agent 2 + land the §9.1 byte-identical canary as a CI golden test."* This PR deletes nothing and changes no downstream agent — it adds one additive Agent-2 field (still ignored by everything) and commits the proof that `deriveBackgroundContext` reproduces the historical 2e artifact. Green CI on that golden test is the signal that the deletion in the next PR is safe.
