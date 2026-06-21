# Agent 3b — Hard-Logic Devices: A Ground-Up Redesign

> Blue-sky brief: if I could rebuild the mechanism-ideation step from nothing, knowing the job is to ground the crime in a *novel, feasible, mechanically sound* trick — and that Agent 3 has to actually build the proof on top of it — what would it become? My answer: a **retrieve-recombine-prove** loop against a curated device library, with the chosen device welded to the CML as a hard constraint a checker enforces — and most likely **folded into Agent 3** as the first move of constructing the proof.

---

## 1. The job to be done (first-principles)

Strip the implementation away. Before the CML exists, what does the pipeline genuinely need from a "hard-logic device" step?

It needs **one concrete, novel, period-feasible mechanism that the entire logical proof will hang from.** A whodunit's mechanism is the load-bearing wall: the impossible-seeming surface (the locked room, the unbreakable alibi, the body in the wrong place) and the hidden reality that dissolves it (thermal expansion released the latch; the clock was wound back forty minutes; the victim was already dead when the shot was heard). Everything downstream — the false assumption the detective must overturn, the discriminating test, the fair-play clues, the timeline — is *derived from* this mechanism.

So the job has four parts, and the current agent does only the first:

1. **Propose** a mechanism that is genuinely novel relative to genre clichés and to the seed library.
2. **Check it is feasible** in this story's physics and forensics — a 1931 mechanism cannot depend on something 1931 can't do, observe, or measure.
3. **Bind it** to the CML so tightly that Agent 3 cannot quietly ignore it or contradict it.
4. **Verify** that the proof Agent 3 builds actually *uses* the mechanism and is deducible from its clues.

The critical insight: **ideation is the cheap part; feasibility and binding are the whole value.** A frontier model can brainstorm five clever-sounding tricks in one breath. What it cannot do reliably, and what the current design never checks, is guarantee that the trick *works* given the era constraints and that the proof *honors* it. We have built an idea generator and called it a grounding step.

A second insight: **novelty is a property relative to a corpus, not a vibe.** "Is this device a cliché?" has a better answer than asking the same LLM that invented it to grade its own originality (`whyNotTrope`). It is a retrieval/similarity question against the seed library and a growing record of devices we've used.

---

## 2. How it works today (grounded)

Three files carry it:

- [`packages/prompts-llm/src/agent3b-hard-logic-devices.ts`](../../packages/prompts-llm/src/agent3b-hard-logic-devices.ts) — prompt builder + `generateHardLogicDevices()` generation/parse/normalize loop.
- [`apps/worker/src/jobs/agents/agent3b-run.ts`](../../apps/worker/src/jobs/agents/agent3b-run.ts) — runner, scoring-path retry, schema validation, `LockedFactRegistry` build.
- [`schema/hard_logic_devices.schema.yaml`](../../schema/hard_logic_devices.schema.yaml) — the output contract.

**It generates ~5 devices as text JSON.** The prompt ([`agent3b-hard-logic-devices.ts:113-217`](../../packages/prompts-llm/src/agent3b-hard-logic-devices.ts)) asks for an array of device objects — `title`, `corePrinciple`, `principleType` (one of four enums), `surfaceIllusion`, `underlyingReality`, `fairPlayClues[]`, `whyNotTrope`, `variationEscalation`, `mechanismFamilyHints[]`, and — on the *first* device only — `lockedFacts[]` (clock times, distances, weights, written out in period word-form). It runs at `temperature: 0.7, max_tokens: 6000` ([`generation-params.yaml`](../../apps/worker/config/generation-params.yaml)).

**The output strategy is text-JSON, so it truncates.** The config comment says it outright: *"raised from 4000: 5-device JSON consistently truncated at 4000."* The parse path even has a bespoke detector — if the response doesn't end in `}`, it throws *"Response appears truncated... Increase max_tokens or reduce output size"* ([`agent3b-hard-logic-devices.ts:269`](../../packages/prompts-llm/src/agent3b-hard-logic-devices.ts)). That is the architecture confessing that the fix for truncation is a bigger bucket.

**Then it normalizes and pads.** `normalizeDevice()` coerces `principleType` to `physical_law` if it isn't one of the four enums, and backfills every missing field with a generic placeholder — `corePrinciple` → `"Constraint-driven contradiction"`, `fairPlayClues` → `["Observable timing inconsistency", "Access-path contradiction"]`. A device that came back half-empty is silently inflated into a "valid" device. The runner requires ≥3 devices or throws.

**It feeds Agent 3 as prose, with a soft instruction.** Agent 3 receives the devices rendered into a text block and is told ([`agent3-cml.ts:116-119`](../../packages/prompts-llm/src/agent3-cml.ts)):

> *"Select one primary device (or a coherent hybrid of two) from this list as the mechanism backbone. Preserve its contradiction structure in false_assumption + constraint_space + inference_path + discriminating_test."*

That is the entire binding. It is a suggestion. **Nothing verifies that the generated CML actually used the device** — not its `false_assumption`, not its `discriminating_test`, not its clues. The same device text is pasted again lower down as "grounding candidates" ([`agent3-cml.ts:469`](../../packages/prompts-llm/src/agent3-cml.ts)).

**There is no feasibility check anywhere.** Nothing confirms the mechanism is possible given Agent 1's era constraints. A device whose `underlyingReality` quietly assumes a 1931 detective can lift a latent fingerprint off cloth, or that a telephone exchange logs call times, sails straight through.

**The scorer grades the devices in isolation.** `HardLogicScorer` runs on the device array adapted by `adaptHardLogicForScoring`, *before* any CML exists ([`agent3b-run.ts:56-67`](../../apps/worker/src/jobs/agents/agent3b-run.ts)) — `cml: undefined as any`. So we score the *idea* for plausibility-on-its-own and never score the thing that matters: did the proof honor the idea.

**The first device also seeds the LockedFactRegistry** ([`agent3b-run.ts:113-143`](../../apps/worker/src/jobs/agents/agent3b-run.ts)) — its `lockedFacts` become ground-truth values the prose agent must never contradict. So a hallucinated or placeholder-padded first device doesn't just weaken the mechanism; it poisons the locked facts that govern the prose 8 agents later.

---

## 3. Where it hurts (specific to this agent)

1. **Free ideation with no feasibility gate is the core defect.** The agent's one job is to ground the crime, and it grounds it in something nobody checked is *possible*. The era contract from Agent 1 (what forensics/tech/policing exist in this decade) is the natural feasibility oracle, and 3b never consults it. A mechanism that depends on a capability the period doesn't have is not a hard-logic device; it's a fair-play landmine that detonates at prose time when a sharp reader notices.

2. **The binding to Agent 3 is a polite request, not a constraint.** "Select one primary device... preserve its contradiction structure" is advice. Agent 3 can ignore the device, pick a different mechanism, or paraphrase it into something contradictory, and **every gate downstream still reads green** because nothing compares the final CML to the device. The whole point of running 3b *before* 3 — grounding — is silently optional.

3. **Truncation is masked, not solved.** The 4000→6000 bump is a bucket, not a fix. Five rich devices with locked facts is a lot of free-text JSON; at `temperature 0.7` the model will eventually overrun any ceiling, and when it does we either throw (whole run dies) or — worse — parse a partial and pad the rest with placeholders. We're generating *five* devices to *use one*, paying 5× the truncation risk for 1× the value.

4. **Placeholder padding manufactures fake mechanisms.** `normalizeDevice`'s backfills mean a device that failed to generate properly becomes a "Constraint-driven contradiction" with two generic clues — and that can be the *primary* device, which seeds the locked facts and is the one Agent 3 is told to ground in. The deterministic repair makes the artifact *look* complete while hollowing out its meaning.

5. **Novelty is self-graded.** `whyNotTrope` asks the model that just invented the device to certify it isn't a trope. We have a seed corpus and a novelty auditor (Agent 8) that runs at the *end* on the finished CML — but 3b, the one place a fresh mechanism is actually chosen, has no retrieval and no corpus check. Novelty is asserted, not measured, and measured too late to change the mechanism.

6. **We score the idea, never the grounding.** Three retry layers defend a score computed on the device list with `cml: undefined`. The expensive question — *did the proof use the device?* — is never asked by anyone.

7. **Five devices, one used, costs and confuses.** The other four are dead weight: tokens spent, truncation risk multiplied, and an invitation for Agent 3 to "coherently hybridize two" into something neither device's clues actually support.

---

## 4. Blue-sky redesign

I'd stop treating this as "an LLM brainstorm that emits five JSON ideas" and rebuild it as **a constrained, checked, single-mechanism selection** — and I'd seriously consider that it isn't a separate agent at all, but the opening move of constructing the proof. Target model: **Claude Opus 4.8** (`claude-opus-4-8`), 1M context, strict tool use / structured outputs, adaptive thinking.

### 4.1 A curated, feasibility-annotated device library + retrieval

Pure from-scratch ideation is the wrong primitive. The right one is **retrieve-then-recombine** against a growing library of vetted mechanism *patterns*.

A device library entry is a structured, human-or-pipeline-curated record:

- `pattern_id`, `title`, `family` (timing / spatial-routing / identity / behavioral / authority)
- `principle` and `principleType` (physical law, math, cognitive bias, social logic)
- `surface_illusion_template` and `underlying_reality_template`
- `feasibility`: which eras/places it works in, and **what capabilities it requires and forbids** ("requires: a hearth that peaks in heat predictably; forbids: nothing post-1945") — annotated against the same era model Agent 1 owns
- `clue_archetypes`: the kinds of observable trace it leaves
- `usage_log`: which past runs used it and with what variations (the novelty signal)

The library is seeded from the existing seed CMLs and grows every run: each *accepted, novel* device gets distilled back into a pattern (or flagged as a near-duplicate of one).

The 3b step then becomes:

1. **Retrieve** the handful of patterns compatible with this run's era, place, primary axis, and mechanism-family directives (a cheap filter + similarity rank, *not* an LLM call).
2. **Recombine into something novel.** Hand Opus 4.8 the 3–5 retrieved patterns, the era contract, the cast/locations, and ask it — with adaptive thinking — to **synthesize ONE mechanism** that is a genuinely fresh recombination, not a copy of any single pattern. The library anchors it to feasible physics; the model supplies the novelty. This is the sweet spot between "absurd from-scratch invention" and "stale library lookup."

Pure ideation stays available as a fallback when retrieval returns nothing compatible — but it's the exception, not the architecture.

### 4.2 Output ONE device, structurally guaranteed — killing truncation at the source

Generate **one** device, not five. We only ever use one; generating five multiplies truncation risk to buy options we discard.

And generate it with **strict structured output** (`output_config.format` with a `json_schema`, or a strict tool the model fills), not free-text JSON. With constrained decoding the model **cannot** emit a missing field, a bad `principleType` enum, or a half-closed object. That single change deletes:

- the `endsWith('}')` truncation sniffer,
- the entire `normalizeDevice` placeholder-padding path,
- the enum-coercion fallback,
- the "≥3 devices or throw" guard.

There is nothing left to pad because the structure is guaranteed at decode time. One small, well-formed device is also far below any token ceiling — truncation as a failure mode is *gone*, not raised. (If we ever want a shortlist for human curation, generate one strict device, then *separately* a few alternatives — never co-mingled in one giant JSON blob whose tail truncates.)

### 4.3 Feasibility checking against the era contract

Before a device is accepted, run it through a **feasibility gate** that is part deterministic, part LLM-judge:

- **Deterministic capability check.** The device declares `requires[]` and `forbids[]` capabilities. The era contract from Agent 1 declares what this decade *can* do (forensics, comms, transport, policing). A simple checker confirms every `requires` is available and nothing the mechanism leans on is a `forbids` violation — no DNA, no CCTV, no phone-record subpoena in 1931. This is the same "fair clues must be discoverable by period means" rule from the Agent 1 redesign, applied to the *mechanism*.
- **Physical-plausibility judge.** A focused Opus 4.8 call (not the generator) asks one question: *given these era physics and this scene, does this mechanism actually work — would the latch really release at that temperature, would that timing really hold?* It returns a structured verdict with a reason, and it's allowed to say no.

A device that fails feasibility is regenerated *with the failure reason fed back* (real feedback, not the same prompt resent) or, if it keeps failing, retrieval picks a different base pattern. The honest "this doesn't work" path is first-class, not a thing to be padded over.

### 4.4 Bind the device to the CML as a hard constraint Agent 3 cannot dodge

This is the change that makes 3b *matter*. Today the device is prose advice. In the redesign the chosen device is a **typed constraint object** that travels into Agent 3 and is *checked against the produced CML*:

- The device's `surface_illusion`, `underlying_reality`, `principleType`, `required_clue_archetypes`, and `locked_facts` become explicit fields the CML must reference.
- Agent 3 produces the CML with **structured output that includes a `grounding` block** naming the `device_id` it built on, and mapping device → CML elements: which `false_assumption` encodes the illusion, which `discriminating_test` resolves it, which clues realize the required archetypes, which locked facts appear.
- A **deterministic binding checker** then verifies that mapping is real: the named false_assumption exists, the discriminating test actually discriminates on the device's principle, every `required_clue_archetype` has a corresponding clue, and the locked facts are present and consistent. If the CML "ignored" the device, the map doesn't validate and the run is steered — not waved through.

This is the cross-cutting thesis applied here: **logic is a proof; verify it with a checker, not another LLM.** The device stops being a hint and becomes a property the CML *provably* has.

### 4.5 Should 3b merge with Agent 3? — Yes, as the "mechanism" sub-step of the proof

Here is the opinionated call: **3b should merge into Agent 3 as the first phase of constructing the proof.**

The fractional `3b` number is a fossil — "we needed mechanism grounding, so we bolted on a pre-pass." But mechanism *is* the foundation of the proof, not a separate artifact handed across a brittle boundary. With a 1M-context frontier model, the historical reason to split them (small models couldn't hold "design a mechanism" and "build the whole logical model" in one pass) is gone.

A merged Agent 3 would, in one coherent context: **retrieve + recombine the mechanism → feasibility-check it → build the CML on top of it → and emit the grounding map**, with the binding checker confirming the CML honors its own mechanism. No serialize-to-prose, no re-parse, no "did Agent 3 actually use what 3b made" gap — because the same agent made both, in one context, and proved the link.

I'd keep the **library, retrieval, and feasibility checker as shared services** (so they're reusable and testable in isolation), but collapse the *agent boundary*. Mechanism selection becomes Phase 1 of "Architect the Logic," not a standalone numbered agent. If we're cautious about a big-bang merge, the device-as-typed-constraint + binding checker (4.4) delivers most of the value while keeping 3b a separate step — that's the migration's first beachhead (§7).

### 4.6 Concrete device example, end-to-end

Run seed: 1931, an isolated fen-country boarding school, primary axis **temporal**, mechanism family **timing**.

1. **Retrieve.** Library returns three timing patterns feasible for 1931 (mechanical clocks, hearth heat, tide tables — all period-plausible) and excludes any that need electrical timing logs.
2. **Recombine.** Opus 4.8 synthesizes ONE device:
   - *surface_illusion:* the victim was heard alive at "half past nine at night" — the chapel clock chimed and a maid heard him call out.
   - *underlying_reality:* the chapel clock had been wound back **forty minutes**; the "call" was a wax-cylinder recording on the gramophone, and the real death was earlier, fixing a different suspect's alibi as the lie.
   - *principleType:* `physical_law` (the clock) reinforced by `cognitive_bias` (everyone trusts the chime).
   - *required_clue_archetypes:* a mechanical inconsistency on the clock face/mechanism; a trace of the recording medium; a timing contradiction between two witnesses.
   - *locked_facts:* `clock_tamper = "forty minutes"`, `chime_time = "half past nine at night"` — period word-form, era-imperial.
3. **Feasibility gate.** Deterministic: does 1931 support wax-cylinder playback and hand-wound clocks? Yes. Does the mechanism `forbid` anything period-available it needs? No. Judge: would winding a fen-school chapel clock back forty minutes go unnoticed until the contradiction surfaces? Plausible — pass.
4. **Bind + build (merged Agent 3).** The CML's `false_assumption` = "the chime fixes time of death"; its `discriminating_test` = comparing the clock mechanism's wear to the claimed time; clues realize all three archetypes; locked facts flow into the registry.
5. **Binding checker.** Confirms the CML's false_assumption, discriminating test, and clues map onto the device. Green — and green *means something*, because it's a structural match, not a score on a fabricated adapter.

---

## 5. Ripple effects on the rest of the pipeline

- **Agent 1 (Era & Setting)** becomes the feasibility oracle. Its `requires/forbids`-style capability list (already argued for in the Agent 1 redesign) is what 3b's deterministic feasibility gate reads. The two agents start sharing one era-capability model instead of each re-deriving period facts.
- **Agent 3 (CML Generator)** absorbs mechanism selection (if merged) or at minimum gains a required `grounding` map and a binding checker. Either way, "did the CML use the device" stops being unknowable.
- **Agent 4 (Validate/Revise)** gets a new, *deterministic* check to run: the binding map. A device-honoring failure becomes a specific, actionable revision ("CML ignores the discriminating test the device requires") instead of a vague score dip.
- **Agent 5 (Clues)** receives `required_clue_archetypes` as a contract, not a hope — it must place clues that realize the device's traces, and that's checkable.
- **Agent 8 (Novelty)** is partly front-run: novelty is now measured at *mechanism-selection* time against the library, where it can still change the device, instead of only at the end on a finished CML where the only lever is reject-and-redo. Agent 8 becomes a final backstop, not the first real novelty check.
- **Agent 9 (Prose) + LockedFactRegistry** get clean, structurally-guaranteed locked facts from a real (never placeholder-padded) device — removing one source of the locked-fact corruption that downstream pronoun/grounding passes are blamed for.
- **Token + reliability:** generating one strict device instead of five free-text ones cuts 3b's tokens and *eliminates* its truncation failure mode and its placeholder-padding masking.

---

## 6. How we'd know it worked

- **Grounding fidelity: ~100%.** Every shipped CML has a *validated* binding map to its device. Today this number is unmeasured (and probably well below 100%).
- **Zero truncation events** in 3b logs — the `endsWith('}')` sniffer is deleted because it can't fire under constrained decoding.
- **Zero placeholder devices.** No shipped device contains a normalizer backfill string (`"Constraint-driven contradiction"`, the canned clue pair). Grep the corpus; the count should be zero.
- **Feasibility pass rate is tracked and < 100%.** If the feasibility gate *never* rejects, it isn't doing anything — a healthy system shows some devices bounced for era violations and regenerated.
- **Measured novelty.** Each device carries a similarity score to the library; we can chart the distribution and catch a drift toward clichés *before* prose, not after.
- **Fewer late-stage fair-play defects** traceable to an impossible mechanism (the era-capability landmines that currently surface, if at all, at read time).
- **Cost per run for the mechanism step drops** (one device, not five) while grounding *quality* rises — the rare case where cheaper and better move together.

---

## 7. Migration path

1. **Stop padding silently.** Make `normalizeDevice` log every backfill it performs and surface it as a real warning, so we can *see* how often devices ship hollow today. (Cheap, immediately revealing.)
2. **Switch the output to strict structured output.** Move 3b from text-JSON to `output_config.format` / strict tool. Delete the truncation sniffer and the enum coercion. This alone kills truncation and most padding. Generate one device first behind a flag; keep five available until the binding checker lands.
3. **Add the feasibility gate.** Give devices `requires/forbids`, wire the deterministic capability check to Agent 1's era contract, and add the single-question plausibility judge with real failure-feedback regeneration.
4. **Introduce the device-as-typed-constraint + grounding map.** Have Agent 3 emit a `grounding` block; build the deterministic binding checker; route binding failures into Agent 4 as actionable revisions. **This is the highest-value step and works while 3b is still a separate agent** — the merge can wait.
5. **Stand up the device library + retrieval.** Seed from the existing seed CMLs; add the recombination prompt; start logging accepted devices back as patterns with novelty scoring.
6. **Merge 3b into Agent 3** as the mechanism sub-step, keeping library/retrieval/feasibility as shared services. Retire the standalone `3b` artifact once the merged path is proven at parity.

Each step is shippable alone and each removes code rather than adding a layer to route around.

---

## 8. The pitch in one paragraph

Today Agent 3b free-associates five mechanism ideas into a giant text-JSON blob that truncates, pads its gaps with placeholders, self-certifies its own novelty, is never checked for whether it's *physically possible* in the story's era, and is handed to Agent 3 as a polite suggestion nobody verifies the proof actually followed. I'd rebuild it as **retrieve-recombine-prove**: retrieve feasible mechanism patterns from a curated, era-annotated device library; have Opus 4.8 recombine them into **one** novel device emitted under strict structured output (so truncation and padding are impossible by construction); gate it through a real feasibility check against Agent 1's period capabilities; and bind it to the CML as a **typed constraint a deterministic checker enforces**, so Agent 3 cannot ignore or contradict the mechanism it's supposed to be grounding. And because mechanism *is* the foundation of the proof, I'd ultimately **fold 3b into Agent 3** as the first move of constructing the logic — turning a brittle, unverified handoff into a single grounded pass where "the CML honors its mechanism" is a property we can prove, not a hope we ship.

---

## 9. Implementation Plan

> Turning §§1–8 into a build sequence: prove retrieve-recombine-prove on a *tiny* seeded library before I write a line of production code, then ship the binding checker (the value) before the merge (the risk).

### 9.1 Validate the approach first (de-risking spikes)

Before committing to a device library as a data asset and a new checker stack, I want three throwaway spikes that each try to *falsify* the thesis. None of these touch the live pipeline — they run offline against one fixed seed (1931 fen-country boarding school, axis temporal, family timing, from §4.6) so I can eyeball the artifacts.

- **Spike A — Does a tiny library actually retrieve?** Hand-author **8–12** device patterns (schema below) distilled from the existing seed CMLs and a couple of canonical Golden-Age tricks. Write the cheap deterministic filter (era + axis + family). *Falsified if* for a normal seed the filter returns 0–1 compatible patterns — that means the library is too sparse to recombine from and the whole architecture collapses into the from-scratch fallback it's meant to replace. I want ≥3 compatible patterns on a typical seed.
- **Spike B — Does recombination under structured output yield ONE feasible, novel device?** Feed Opus 4.8 the 3–5 retrieved patterns + a stub era contract and ask for **one** device via a strict `json_schema` (the §4.2 contract). *Falsified if* the model copies a single pattern verbatim (no recombination), or produces incoherent mechanics (surface_illusion that the underlying_reality doesn't actually dissolve), or the structured-output call can't hold the schema. I'm checking two things at once here: that constrained decoding holds, and that "library anchors feasibility, model supplies novelty" is real and not wishful.
- **Spike C — Is feasibility judgeable, and is binding checkable?** Run the device's `requires/forbids` against a stub Agent-1 capability list (deterministic), then hand-build a CML grounding map and run a prototype binding checker. *Falsified if* feasibility can't be decided without re-deriving the whole era model (means Agent 1's contract isn't the right oracle), or if "the discriminating_test discriminates on the device's principle" turns out to be unverifiable deterministically and quietly needs an LLM judge after all.

If any spike falsifies, I stop and rethink the data asset before building services. Concretely: A failing → grow/restructure the library schema; B failing → reconsider retrieve-recombine vs. constrained from-scratch; C failing → the binding checker may need to be LLM-assisted, which changes §4.4's "checker not LLM" claim.

### 9.2 What gets built — and deleted (components & contracts)

The redesign is mostly *new shared services plus deletions*, not edits to the existing 3b generator. Build order is bottom-up: library → retrieval → recombination → feasibility → binding.

| Component | Type | Path (new unless noted) | Replaces / Deletes |
|---|---|---|---|
| Device-library schema | Data contract | `schema/device_library.schema.yaml` | — (new asset) |
| Seed corpus | Data | `packages/device-library/data/patterns/*.yaml` | the implicit "novelty by vibe" |
| Retrieval service | Lib | `packages/device-library/src/retrieve.ts` | the 5-device brainstorm fan-out |
| Recombination prompt | Prompt | `packages/prompts-llm/src/agent3b-recombine.ts` | most of [`agent3b-hard-logic-devices.ts`](../../packages/prompts-llm/src/agent3b-hard-logic-devices.ts) |
| Feasibility checker | Lib | `packages/device-library/src/feasibility.ts` | (none today — net-new gate) |
| CML device-binding type | Type | extend `schema/cml.schema.yaml` (`grounding` block) | the prose "Grounding rule" in [`agent3-cml.ts:116-119`](../../packages/prompts-llm/src/agent3-cml.ts) |
| Binding checker rule | Checker | `packages/cml/src/checkers/device-binding.ts` | the unmeasurable "did Agent 3 use it" gap |

**Delete with real paths (the band-aids §3 catalogs):**

- The truncation sniffer — [`agent3b-hard-logic-devices.ts:269`](../../packages/prompts-llm/src/agent3b-hard-logic-devices.ts) (`if (!trimmed.endsWith('}'))`). Impossible under constrained decoding.
- The placeholder-padding path — `normalizeDevice()` enum-coercion + field backfills (called at [`agent3b-hard-logic-devices.ts:286`](../../packages/prompts-llm/src/agent3b-hard-logic-devices.ts)). Nothing to pad when the schema is guaranteed at decode time.
- The `≥3 devices or throw` guard — [`agent3b-hard-logic-devices.ts:288`](../../packages/prompts-llm/src/agent3b-hard-logic-devices.ts). We emit one device by design.
- The self-graded novelty field (`whyNotTrope`) — replaced by a real similarity score against `usage_log` in the retrieval service.
- The isolated, pre-CML score with `cml: undefined as any` — [`agent3b-run.ts:56-67`](../../apps/worker/src/jobs/agents/agent3b-run.ts). We stop scoring the *idea* and start checking the *binding*.

**I/O contract (the new 3b step / mechanism sub-step):**

- **In:** era contract (`requires/forbids` capabilities from Agent 1), seed directives (`primaryAxis`, `mechanismFamilies`, `difficultyMode` — already assembled in [`agent3b-run.ts:47-50`](../../apps/worker/src/jobs/agents/agent3b-run.ts)), cast + locations, library handle.
- **Out:** ONE `device` object (typed, schema-guaranteed) + a `feasibility_verdict` (pass + reason) + `device_id` + `novelty_score` + `lockedFacts[]`. The `device_id` and `lockedFacts` are what travel into the CML grounding map and the `LockedFactRegistry` seeding at [`agent3b-run.ts:113-143`](../../apps/worker/src/jobs/agents/agent3b-run.ts) (which keeps its existing shape — it just receives a *real* device, never a padded one).

### 9.3 Dependencies & sequencing

**Hard dependencies (cross-agent map):**

- **KEYSTONE = Agent 3.** The device-binding type lives in the typed CML core, and the binding checker is a rule in Agent 3's checker library (P1). I cannot build §4.4 until Agent 3's typed core + checker harness exist. So Agent 3's redesign **precedes** 3b's binding work, and 3b's endgame (fold-in) **is** part of Agent 3's mechanism sub-step.
- **Agent 1 = feasibility oracle.** The deterministic capability check reads Agent 1's `requires/forbids` era model. If Agent 1 hasn't shipped that contract yet, I stub it (a flat capability list keyed by decade) so 3b isn't blocked, then swap to the real KB.
- **P2 structured-output infra** must exist before §4.2 — it's what makes truncation/padding impossible. This is the single highest-leverage shared dependency.
- **Agent 8 (novelty)** consumes the library's `usage_log`; the recombination + similarity score is itself a novelty lever, front-running Agent 8. Loose coupling — Agent 8 can keep its end-stage check as a backstop while 3b's measure-at-selection lands.
- **Agent 9 / LockedFactRegistry** is downstream and passive — it just stops being poisoned by placeholder devices.

**Ordered phases (library-first, merge-last):**

1. **Library + retrieval as shared services** (no pipeline change yet) — seed corpus, schema, deterministic filter + similarity. Testable in isolation. *This is first because everything else recombines against it.*
2. **Structured-output single-device generation** behind a flag (needs P2). Delete the truncation sniffer, `normalizeDevice`, the `≥3` guard on the flagged path.
3. **Feasibility gate** wired to Agent 1's contract (or stub), with failure-reason feedback regeneration.
4. **Device-as-typed-constraint + binding checker** (needs Agent 3 typed core). **Highest-value phase; works while 3b is still a separate agent** — this is the beachhead from §7.4.
5. **Fold 3b into Agent 3** as the mechanism sub-step, library/retrieval/feasibility staying as shared services. Retire the standalone `3b` artifact at parity.

**First increment:** author `schema/device_library.schema.yaml` + seed ~10 vetted patterns and the deterministic retrieval filter — nothing wired into the live run. It's the asset every later phase depends on and the thing Spike A needs.

### 9.4 Test & validation strategy

The invariants are the spec — each maps to an automated check, not a vibe.

- **Feasibility invariant (the core fix).** *A shipped device cannot use a capability absent from the era KB, nor lean on anything in its own `forbids`.* Test: property test that fuzzes era contracts and asserts every accepted device's `requires` ⊆ era capabilities and `requires ∩ forbids = ∅`. A device citing DNA/CCTV/phone-records in 1931 must be rejected. The feasibility pass rate is *tracked and asserted < 100%* — a gate that never rejects is dead (§6).
- **Binding invariant (makes 3b matter).** *The CML mechanism MUST instantiate the chosen device or the checker fails the run.* Test: golden CMLs with a correct grounding map pass; mutate the CML so its `false_assumption` no longer encodes the device's illusion, or drop a `required_clue_archetype`'s clue → the binding checker MUST fail. This is the deterministic check Agent 4 gains (§5).
- **Truncation-impossible.** Test: assert the truncation sniffer and `normalizeDevice` are *gone* (grep the source for `endsWith('}')` and the canned strings `"Constraint-driven contradiction"` / `"Observable timing inconsistency"` → count 0 across the corpus and src). Fuzz long recombinations under the strict schema and assert no partial/invalid object ever parses.
- **Novelty measured, not asserted.** Test: every device carries a `novelty_score` vs. the library; assert it's populated and below the cliché threshold; assert `whyNotTrope` no longer exists.
- **Canary / golden replay (P4).** Pin the §4.6 fen-school seed as a golden: same inputs → a feasible, era-valid device with a *validating* binding map. Run it in the canary set so any regression in retrieval, feasibility, or binding surfaces before merge.

### 9.5 Rollout & rollback

- **Flag:** `enableDeviceLibrary` (default off). Off = today's five-device ideation path untouched. On = retrieve-recombine-prove.
- **Shadow mode first.** With the flag on in *shadow*, run the library path **alongside** pure ideation: generate both, ship the legacy device, but log the library device + its feasibility verdict + binding-map validity. This lets me measure grounding fidelity and feasibility reject-rate on real runs before the new path drives any output — and compare novelty distributions head to head.
- **Promote per phase.** Flip phases 2→3→4 to "live" independently; each is shippable and removes code (§7). The binding checker (phase 4) can go live while 3b is still standalone.
- **Library governance/versioning.** The library is a versioned data asset (`device_library_version` stamped into each run's metadata). New patterns distilled from accepted devices land via PR review, never auto-committed mid-run — governance is human-gated so a bad auto-distillation can't silently pollute retrieval. Roll back by pinning an earlier `device_library_version`.
- **Kill criteria.** Revert the flag if: feasibility pass rate hits 100% (gate inert) or craters below ~70% (library too era-narrow); binding-checker false-positive rate makes Agent 3 un-shippable; or shadow shows the library device is *less* novel than ideation. Rollback is a flag flip — legacy code stays until phase 5 parity.

### 9.6 Open questions to resolve before coding

- **Where does the seed library come from?** Distilling the existing seed CMLs gives provenance but may be thin and genre-narrow. Do I supplement with hand-authored canonical Golden-Age patterns (richer, but risks baking in clichés the system should *avoid*)? I lean: seed from our CMLs + a small vetted canonical set, tagged so retrieval can *down-weight* the canonical ones for novelty.
- **How do I keep the library novel, not a cliché machine?** If every run distills its device back as a pattern, the library converges on whatever the model likes. Need a de-dup/cliché threshold on intake and a similarity penalty in retrieval ranking — but the exact threshold is unknown until I see the score distribution (Spike B + shadow data).
- **How much does the model invent vs. retrieve?** §4.1 says "library anchors feasibility, model supplies novelty" — but the split is undefined. Too retrieval-heavy → stale; too invention-heavy → we're back to unfeasible from-scratch ideation. Resolve empirically in Spike B by measuring recombination distance from the nearest source pattern.
- **Is binding fully deterministic?** "The discriminating_test discriminates on the device's principle" may need an LLM assist for semantic cases (Spike C). If so, §4.4's pure-checker claim softens to checker-plus-narrow-judge — decide before coding the checker.
- **One device with no fallback?** If retrieval returns nothing compatible *and* the from-scratch fallback also fails feasibility, what ships? Define the hard-fail behavior (fail the run vs. relax a directive) before phase 3.

### 9.7 "Ready to build" checklist

- [ ] Agent 3 typed CML core + checker harness exists (or its interface is stable enough to target) — KEYSTONE dependency for the binding checker.
- [ ] Agent 1 `requires/forbids` era contract available, or a decade-keyed stub agreed.
- [ ] P2 structured-output infra usable from `prompts-llm` (`json_schema` / strict tool).
- [ ] Device-library schema reviewed (`schema/device_library.schema.yaml`).
- [ ] Spikes A/B/C run on the §4.6 fen-school seed and none falsified the thesis.
- [ ] `enableDeviceLibrary` flag + shadow-mode logging plumbed.
- [ ] Golden/canary seed pinned with an expected validating binding map.
- [ ] Open questions §9.6 (seed source, invent/retrieve split, deterministic-binding) have working answers.

**FIRST task / PR:** *"Author `schema/device_library.schema.yaml` and seed ~10 vetted device patterns distilled from the existing seed CMLs, plus the deterministic era+axis+family retrieval filter — offline, nothing wired into the live run."* This unblocks Spike A and is the data asset every later phase recombines against.
