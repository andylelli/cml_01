# Agent 3 — CML Generator: A Ground-Up Redesign

> The pipeline's founding promise is "build mysteries like an engineer builds proofs: logic first." Agent 3 is where the proof is supposed to be *constructed* — so it is the one place the metaphor must be made literally true. Today it asks a single LLM to hold an entire self-consistent proof in its head and trust it. A ground-up Agent 3 would let the LLM **propose** the proof and a deterministic engine **verify** it, inline, until fair-play stops being a downstream opinion and becomes a property the artifact provably has.

---

## 1. The job to be done — constructing a verifiable fair-play proof

Strip away the schema and the prompt scaffolding, and Agent 3 has exactly one job: **produce the complete logical model of a mystery that a fair-play reader could, in principle, solve from the clues alone — and be right that they could.**

That is not a writing task. It is a *construction* task in the formal sense. A fair-play whodunit is a small theorem:

- There is a set of **entities** — suspects, the victim, the detective, objects, locations.
- There are **events** located in **time** (the death, comings and goings, the tampering).
- There are **access facts** — who could be where, who could touch what, who held which key.
- There is a hidden **mechanism** — the actual causal story of how the crime was done.
- There is a **false assumption** the surface presentation invites the reader to make.
- There are **observations** the reader witnesses, which become **clues**.
- There is an **inference path** — a chain of edges from observations to corrections to eliminations.
- And there is a **solution**: a single culprit the evidence uniquely identifies.

The hard property — the *whole point of the genre* — is this: **the clues must entail the solution, and they must entail it uniquely.** Every non-culprit suspect must be eliminable from the shown evidence, and the culprit must be the only suspect left standing. If two suspects are equally consistent with everything the reader saw, the mystery is *unfair* — not as a matter of taste, but as a matter of logic. The reader could not have known.

This is a **constraint-satisfaction / theorem-construction problem**. The "answer" is a structure that simultaneously satisfies: timeline consistency (no one is in two places at once; the culprit's access window overlaps the crime window; every alibi is either true or provably broken), deducibility (the clue set entails the culprit), and uniqueness (the clue set entails *no other* suspect). Agent 3's real deliverable is a structure with those three properties.

The CML schema ([`schema/cml_2_0.schema.yaml`](../../schema/cml_2_0.schema.yaml)) is a *serialization* of that structure: `cast`, `constraint_space.time` / `.access` / `.physical`, `hidden_model.mechanism`, `false_assumption`, `inference_path.steps`, `discriminating_test`, `culpability.culprits`, `closed_circle`, `false_solution`, `red_herrings`. Everything is present in the data model. What is *absent* is anything that checks the data model is **true**.

---

## 2. How it works today

Agent 3 is one large generation function with a built-in revision loop, wrapped by an orchestrator runner that also drives novelty.

- **The prompt** ([`packages/prompts-llm/src/agent3-cml.ts`](../../packages/prompts-llm/src/agent3-cml.ts), `buildCMLPrompt`) is enormous and almost entirely *instructional*. It hands the model the schema summary, era/location constraints, the hard-logic device candidates from Agent 3b, a fair-play checklist, ~21 numbered requirements, a long list of anti-trope bans, micro-exemplars of "weak vs strong" inference steps, and a full required YAML skeleton. It then asks for **one JSON object** containing the entire case.
- **One call produces the whole proof.** Timeline + mechanism + alibis + inference path + clue grounding + the false solution + red herrings + the solution — all mutually consistent, all in a single completion, at `temperature 0.4`, `max_tokens` from config, with `default_max_attempts: 3` ([`generation-params.yaml`](../../apps/worker/config/generation-params.yaml)).
- **Then the repair machine runs.** `generateCML` parses the output (JSON, then `jsonrepair`, then brace-slicing, then sanitized-YAML fallback), then `normalizeCml` — which is hundreds of lines of *padding and patching*: coercing enums, filling default cast fields, forcing the victim ineligible, dropping invalid culprits and substituting a `fallbackCulprit`, manufacturing a `false_solution`/`red_herrings`/`closed_circle` when the model omitted them, coercing chapter pointers, and gap-filling `suspect_clearance_scenes` for every suspect the model forgot. Only then does `validateCml` run — a **schema** check, not a logic check.
- **If schema validation fails after all attempts, Agent 4 is called inline** (`reviseCml`) — another LLM, asked to fix the validation errors. This is the loop the config itself flags as "a major call-count churner."
- **The runner** ([`apps/worker/src/jobs/agents/agent3-run.ts`](../../apps/worker/src/jobs/agents/agent3-run.ts), `runAgent3`) adds two more deterministic safety nets — `repairInferenceRequiredEvidence` (synthesizes `required_evidence` from the step's own text when missing) and `checkVictimCulpritCollision` (retries once with explicit exclusions if the culprit is the victim) — then runs the Agent 8 novelty audit, which can trigger *another* full CML regeneration.
- **The actual fair-play check happens later and elsewhere.** The orchestrator's "CML Validation Gate" ([`mystery-orchestrator.ts`](../../apps/worker/src/jobs/mystery-orchestrator.ts)) runs **after Agent 5 has already produced clues** and back-fills `discriminating_test.evidence_clues` from those finished clues. Fair-play *correctness* — does the case actually solve? — is deferred to Agent 6's LLM auditor and a blind-reader LLM that tries to crack the case.

The shape of this is unmistakable: **generate a proof freely, then spend the rest of the pipeline trying to find out whether it was actually a proof.**

---

## 3. Where it hurts

**One LLM holds the entire proof, and nothing checks the load-bearing property.** Agent 3 is asked to keep dozens of facts mutually consistent across time, access, mechanism, and inference — and then it is graded on *schema validity*. `validateCml` confirms the keys are present and the enums are legal. It does not, and structurally cannot, confirm that the porter log actually contradicts the alibi, that the culprit's access window actually overlaps the crime, or that some *innocent* suspect isn't equally consistent with every clue. The runner even hard-codes the quality score: `revisedByAgent4 ? 60 : 100`. A case that is logically broken but schema-clean scores **100/100** at this stage. We are measuring the wrong thing with great precision.

**The backfill threshold is the system confessing the gap.** The config exposes `evidence_clue_backfill_threshold: 3` with `fail_when_backfill_exceeds_threshold: true`. Read what that *means*: Agent 3 routinely produces a `discriminating_test` whose `evidence_clues` don't trace to real clues, so a **later** gate quietly injects the missing clue IDs from Agent 5's output — and only *fails the run* if more than three had to be injected. That is not a safety feature; it is a **gap detector with a tolerance dial.** The system has institutionalized the expectation that the proof will have holes, built a machine to paper over a few of them, and set a number for how many holes are too many. The honest reading of `fail_when_backfill_exceeds_threshold` is: *"this LLM leaves logical gaps; we patch up to three of them and abort on the fourth."*

**Determinism papers over logic, not just shape.** `normalizeCml`'s `fallbackCulprit` logic will silently *pick a different culprit* if the model's named culprit is ineligible — but the `inference_path`, `discriminating_test`, and `false_solution` were all written to convict the **original** culprit. The schema still passes. The proof now points at the wrong person and nothing notices. `repairInferenceRequiredEvidence` synthesizes evidence text *from the step's own prose* — manufacturing the appearance of grounding precisely where grounding was missing. These patches make the artifact *look* solvable to the schema while making it *less* solvable in fact.

**There is no inline solver, so generation iterates against the wrong oracle.** The retry loop re-sends the prompt with the *schema* errors appended. The model never receives the feedback that actually matters: "Suspect Hartwell is also consistent with every clue you've shown — your solution is not unique," or "the culprit's only access window closes forty minutes before the death." It cannot fix a logic bug it is never told about. So it iterates toward schema-clean nonsense.

**Fair-play is deferred to LLM auditors who can only sample.** Agent 6's blind reader is a wonderful idea — *try to solve the case the way a reader would* — but it is one stochastic attempt at a search problem. If it happens not to spot the second viable suspect, the case ships unfair. An LLM auditor answers "does this *seem* solvable?"; it cannot answer "is the solution *provably unique*?" We have outsourced a decidable question to a vibe.

This is the system's central architectural bet: **that a sufficiently good prompt makes one LLM construct correct proofs, and that downstream LLMs will catch the failures.** It is also the system's central weakness. The first half overestimates single-pass reasoning under a 40-constraint load; the second half asks auditors to *catch* what a checker could *prevent*.

---

## 4. Blue-sky redesign — the LLM proposes, a solver disposes

Here is what I would build if Agent 3 didn't exist.

### 4.1 The core inversion

Stop asking the LLM for a finished, trusted proof. Ask it for a **proposal**, and put a **deterministic verifier in the loop** that gives it ground-truth feedback until the proposal is provably a fair-play proof. The LLM's strength is *invention* — clever mechanisms, fresh motives, surprising misdirection. A solver's strength is *bookkeeping* — checking that 40 facts are mutually consistent without ever getting tired or hand-waving. Use each for what it is good at.

The generation loop becomes:

```
propose (LLM)  →  verify (deterministic engine)  →  counterexample/feedback  →  repair (LLM)  →  verify  → …
                                                  └── until: consistent ∧ deducible ∧ unique
```

The exit condition is not "schema valid." It is **"the timeline is consistent, the shown clues entail the culprit, and they entail no one else."** That is a property we can *decide*, not audit.

### 4.2 CML as a typed logical structure (not a bag of strings)

The blocker today is that CML is *prose in a schema*. `alibi_window: "evening"`, `constraint_space.time.contradictions: ["the porter log conflicts with the alibi"]` — these are sentences. No engine can reason over a sentence. So the first move is to give CML a **typed logical core** that the LLM populates *alongside* the human-readable text:

- **Entities**: typed records — `Person`, `Object`, `Location`, `Key/Permission`, with stable IDs.
- **Events**: `{ id, actor, action, location, time_interval }` where `time_interval` is two ordered time points on a single declared timeline (the model emits `08:12`, not "twelve past eight"; the *prose-facing* worded form is a separate display field).
- **Access facts**: `{ person, can_reach: location|object, during: interval, via: channel }` — first-class, machine-checkable, not buried in `opportunity_channels` strings.
- **Observations → Clues**: each observation is `{ id, witnessable_in_scene, asserts: <fact>, available_by: <story-time> }`. A clue is an observation the reader is given.
- **Inference edges**: each step is `{ from: [observation_ids], rule, eliminates: [suspect_id] | narrows: <constraint> }`. The `rule` is one of a small closed vocabulary the checker understands (`alibi_contradiction`, `access_impossible`, `physical_law`, `unique_capability`, …).
- **Solution**: `culprit_id`, plus the claim "the clue set entails this and only this."

Crucially, this is **structured output the model emits natively under constrained decoding** — not text we parse and pray over. The whole `normalizeCml` apparatus (enum coercion, brace-slicing, YAML fallback, padding) *disappears*, because the structure is guaranteed at decode time. The human-readable CML we already ship becomes a **rendering** of this typed core, not the source of truth.

### 4.3 The deterministic engines

Three small, boring, *fast* engines — the kind of code that is a joy to unit-test because it has no opinions:

1. **Timeline / alibi consistency engine.** Loads every event and access fact onto the declared timeline. Checks: no person occupies two locations in overlapping intervals; the crime event has at least one actor with access during the crime window; every alibi is classified as *holds* (the suspect demonstrably could not have done it) or *breakable* (and if breakable, *which fact* breaks it). This is interval arithmetic and graph reachability — decidable, deterministic, sub-millisecond.

2. **Deducibility checker.** Takes the **clue set** (only observations the reader is actually given, by their `available_by` time) and the inference rules, and computes the *forward closure*: starting from the clues, which suspects get eliminated by valid rule applications? It confirms the inference path is **sound** (every edge's premises are present in the clues shown *before* that point — no clue used before the reader has it) and **complete enough** to reach the named culprit. If a step claims `eliminates: Hartwell` but the premises aren't in the clue set, that's a hard failure with an exact location — the very gap the backfill threshold currently counts.

3. **Uniqueness checker.** The one that makes fair-play *provable*. For each suspect `S`, ask: *is there a consistent world, satisfying every shown clue, in which S is the culprit?* For the real culprit the answer must be yes; **for every other suspect it must be no.** Concretely: hypothesize `S` guilty, run the consistency engine against the full clue set, and see whether a contradiction is forced. If two suspects survive, the solution is **not unique** and the case is unfair — and the checker says *exactly which suspect* is the spare and *which constraint* would need to exist to eliminate them. With a closed circle of 5–8 suspects this is trivially cheap to do exhaustively. No sampling. No "seems solvable." A decision.

These engines are not AI. They are the part of "build mysteries like an engineer builds proofs" that the system has been *describing* in its prompts and never *executing*.

### 4.4 Tool-calling the checker mid-generation

With a frontier model that does native tool use, the verifier isn't a post-process — it's a **tool the model calls while constructing the case.** The model drafts the timeline, calls `check_timeline()`, gets back "Hartwell's access window closes at 07:40, forty minutes before the death — your culprit can't have done it," and fixes the access fact *before* it ever writes the inference path on top of it. It drafts the clue set, calls `check_uniqueness()`, gets back "Ms. Vane is also consistent with all clues; add a discriminating fact or you have two solutions," and adds the porter log. The model iterates against **ground truth**, in-context, instead of against a re-sent prompt full of schema complaints.

This is the difference between a writer guessing whether their alibi math works and a writer with a calculator open. The calculator never gets tired at fact #38.

### 4.5 Fair-play becomes a *provable* property

When generation exits, we don't *hope* the case is fair — we have a **certificate**: the timeline is consistent (engine 1), the clues shown entail the culprit (engine 2), and they entail *no other* suspect (engine 3). That certificate ships *with* the CML. Fair-play stops being an audit Agent 6 performs after the fact and becomes an invariant Agent 3 *establishes by construction*. Agent 6's blind reader can still run — as a *confidence check on prose realization* ("did the prose actually surface the clues the certificate says exist?") — but it is no longer the thing standing between us and an unsolvable mystery.

### 4.6 Worked example — and how the checker catches a non-unique solution

A small case. Closed circle: **Dr. Vale**, **Hartwell**, **Mrs. Carrow**. Victim: Lord Ashby, found dead at the manor, apparent time of death **08:20**. Mechanism (hidden): the clock in the study was set **eight minutes fast**, so the "08:20" everyone reads is really **08:12**.

The LLM proposes:
- Events: Vale boards the 08:12 train at the village station (porter log). Hartwell leaves the manor at 07:40 (key surrendered, access log). Carrow is in the kitchen 08:00–08:30 (cook's testimony).
- Clues shown: the porter log; the access log; the study clock; the cook's testimony.
- Inference path: Step 1 — clock is fast (clue: a second clock + the train schedule) → real death time is **08:12**. Step 2 — Hartwell's access ended 07:40 → **eliminate Hartwell**. Step 3 — Vale was on the 08:12 train per the porter log → **eliminate Vale**. Solution: **Mrs. Carrow**.

Now the checker runs:

- **Timeline engine**: consistent. Good.
- **Deducibility**: from the shown clues, Step 1's premises are present, Step 2's are present, Step 3's are present. The path reaches Carrow. So far this looks like a clean proof — *and it is exactly the kind of case the current system would ship.*
- **Uniqueness engine** — the new thing — tests each suspect against the clue set:
  - Hypothesize **Hartwell** guilty → contradicts the 07:40 access log given real death 08:12. **Eliminated.** Good.
  - Hypothesize **Carrow** guilty → consistent (in the kitchen, adjacent to the study, no alibi for 08:12). **Possible.**
  - Hypothesize **Vale** guilty → the porter log puts Vale on the 08:12 train... **but the porter log only proves Vale *boarded*; it does not prove the train had *left* the platform at 08:12.** If the train was still standing at the platform at 08:12, Vale could have administered the poison and *then* boarded. The clue set does **not** force Vale's elimination. **Vale is also possible.**

The uniqueness checker returns: **`SOLUTION_NOT_UNIQUE: {Carrow, Vale} both consistent. Step 3 elimination of Vale is unsound: "boarded at 08:12" does not entail "departed before 08:12." Add a discriminating fact (e.g. station-master confirms 08:12 departure, or Vale visible in a carriage by a witness) or the reader cannot rule Vale out.`**

That is the bug the **current** system ships and prays Agent 6's blind reader happens to catch. The redesigned Agent 3 catches it *deterministically, every time, before any prose exists*, and hands the LLM the exact repair. The model adds the station-master's departure confirmation to the clue set, re-runs the check, gets a unique solution, and exits with a certificate.

That single example is the whole thesis in miniature: **the gap the backfill threshold counts after the fact is the gap the solver closes during construction.**

---

## 5. Ripple effects on the rest of the pipeline

A provably-correct CML at the source changes what the downstream agents are *for* — and some of them largely vanish.

- **Agent 4 (CML Validator / Revision) — mostly absorbed.** Today Agent 4 is an *LLM* called to fix *schema* errors. With constrained decoding the schema can't be violated, and with the inline solver the logic is fixed in-loop by Agent 3 itself. The "major call-count churner" revision loop is deleted. What little remains — a final independent re-run of the three engines as a gate — is **deterministic and free**, not an LLM call.

- **Agent 5 (Clues & Red Herrings) — re-scoped and de-risked.** Today Agent 5 also acts as a *guardrail* that catches missing clues, and the orchestrator back-fills `discriminating_test.evidence_clues` from Agent 5's output. In the redesign, the clue set and its deducibility are **already certified** by Agent 3. Agent 5's job narrows to its real value: **dressing** the certified observations into vivid, fair, well-placed clues and authoring red herrings — where every red herring can itself be checked: *does this misleading detail still leave the solution unique?* The backfill gate and its threshold dial are **retired** — there is nothing to back-fill, because the evidence-clue mapping is part of the certificate.

- **Agent 6 (Fair-Play Auditor + blind reader) — demoted from gate to confidence check.** The blind reader stops being the safety net for *logical* fairness (now guaranteed) and becomes a check on *realization*: did Agent 9's prose actually surface every clue the certificate promises, in solvable order? That is a far easier, far more reliable question. The expensive, stochastic "try to solve the case" search is no longer load-bearing.

- **Agent 8 (Novelty) — unaffected in kind, cleaner in practice.** Novelty is a different axis (similarity to seeds) and stays. But today a novelty failure triggers a *full CML regeneration* that throws away a possibly-correct proof and rolls the dice again. With a typed core, novelty divergence can be requested as a *constrained* re-proposal that keeps the verified skeleton and perturbs the mechanism/motive — cheaper and less likely to regress logic.

- **Agent 3b (Hard-Logic Devices) — tighter coupling, more leverage.** The device ideation can now hand Agent 3 not just a prose "principle" but a *typed mechanism template* whose contradiction structure the solver understands — so the clever idea survives intact into a checkable proof instead of being flattened into strings.

The net: the **logic-correctness** responsibility collapses from *five places that each partially own it* (3, 4, 5's guardrails, the orchestrator gate, 6's blind reader) into **one place that fully owns it** (Agent 3, with a solver). That is the redesign's biggest structural win — it deletes the diffusion of responsibility that lets bad logic slip between the cracks.

---

## 6. How we'd know it worked

- **Unfair cases caught at the source, not downstream.** Track the rate at which Agent 6's blind reader fails to solve a case (or solves it to the *wrong* suspect). In the redesign this should approach zero for *logical* reasons — any residual failures are prose-realization bugs, which is a different, smaller problem.
- **Backfill goes to zero.** `evidence_clue_backfill_threshold` exists only because the proof has holes. The success metric is that the back-fill machine *never fires* — and we delete it.
- **Uniqueness violations surfaced and counted.** Instrument the uniqueness checker: how often does the *first* LLM proposal have a non-unique solution? My strong prior is "very often" — and that number is the size of the problem we have been shipping blind. Watch it fall across repair iterations to zero before exit.
- **Fewer, cheaper calls.** The Agent 4 revision loop and schema-repair retries vanish; the in-loop solver calls are deterministic and free. Token spend on the logic stages should drop sharply even though the model now *iterates more* — because it iterates against a free checker instead of re-sending a 4,000-token prompt.
- **A real quality score.** Replace the hard-coded `revisedByAgent4 ? 60 : 100` with a score derived from the certificate: did it pass on the first proposal, or after N solver-guided repairs? That number actually means something.
- **No silent culprit swaps.** Zero cases where the named culprit differs from the suspect the inference path convicts — today's `fallbackCulprit` failure mode becomes structurally impossible.

---

## 7. Migration path

This does not require a big-bang rewrite. The verifier can be built *beside* the current generator and earn trust before it gates anything.

1. **Build the engines as a pure library, offline.** Implement the timeline, deducibility, and uniqueness checkers against the *existing* CML by writing a best-effort parser from today's stringy fields into the typed core. Run them over the whole corpus of already-generated CML in `apps/api/data/reports/`. This costs nothing and immediately tells us **how many shipped cases are non-unique or non-deducible.** That number alone justifies the project.
2. **Add the typed core to the schema as optional, populated fields.** Ask Agent 3 (still text-prompted) to *also* emit the typed events/access/clue IDs alongside the prose. Run the engines as a **non-blocking diagnostic** in the orchestrator gate next to the existing backfill logic. Observe agreement and failure rates in production with zero risk.
3. **Flip the engines to advisory in-loop feedback.** Expose them as tools and let Agent 3 call them during generation, but don't yet *require* a clean certificate to exit. Measure how much first-pass quality improves when the model gets ground truth.
4. **Make the certificate the exit condition.** Once the engines are trusted and the typed core is reliably emitted under constrained decoding, the loop exits *only* on a clean certificate. Now retire the backfill gate, fold Agent 4 into a deterministic re-check, and re-scope Agent 5 and Agent 6 as in §5.
5. **Delete the scaffolding.** With structure guaranteed at decode and logic guaranteed by the solver, remove `normalizeCml`'s padding/coercion, the YAML-sanitize fallback, `repairInferenceRequiredEvidence`, and the LLM revision loop. The function gets *dramatically* smaller.

Every step is independently valuable and independently reversible. The risk is front-loaded into a pure library that touches nothing until we trust it.

---

## 8. The pitch in one paragraph

Agent 3's job is to construct a fair-play proof, but today we ask one LLM to hold the entire proof in its head, check only that the *schema* is valid, and then spend the rest of the pipeline — Agent 4's revision loop, Agent 5's guardrails, an orchestrator back-fill with a tolerance dial for how many logical holes are acceptable, and Agent 6's one-shot blind reader — trying to find out whether it was actually a proof. The blue-sky redesign makes the founding metaphor literally true: give CML a **typed logical core** the machine can reason over, build three small deterministic engines that decide **timeline consistency, deducibility, and solution uniqueness**, and let the LLM **call them as tools mid-generation** so it iterates against ground truth instead of re-sent prompts — until it exits with a **certificate that the clues entail the culprit and no one else.** Fair-play stops being a vibe a downstream auditor assesses and becomes a property the artifact provably has at the source; the logic-correctness responsibility that is smeared across five agents collapses into one; and the backfill threshold — the system quietly confessing it leaves gaps — gets deleted because there are no gaps left to count. **The LLM proposes; the solver disposes; and for the first time the proof is actually proven.**

---

## 9. Implementation Plan

> This is the keystone. I am not just rebuilding Agent 3 — I am building the **shared platform (P1 + P2)** that Agents 4, 5, 6, 7, 8, and 3b all consume. So this plan is deliberately the most rigorous in the series, and it must land *before* its dependents.

### 9.1 Validate the approach first (de-risking spikes)

The entire redesign rests on **one unproven bet**, and I refuse to build anything until I've tried to falsify it:

> **Can a deterministic deducibility + uniqueness checker even be written over a typed CML, and can Opus 4.8 iterate against it via tool-calls until it reaches a clean certificate — for a small case, by hand?**

Everything else (deleting `normalizeCml`, retiring the backfill gate, re-scoping Agents 4/5/6) is *consequence*. If that bet fails, the redesign is dead and I want to know in days, not after I've rewritten the schema.

**The make-or-break spike.** I hand-author **one** typed CML — the §4.6 clock-set-fast case (Vale / Hartwell / Carrow), already worked out — as a literal TypeScript object, not generated. Then I write the **deducibility + uniqueness checkers** against it as plain functions. Concretely the spike must demonstrate three things, in order:

1. **The checker decides.** Given the hand-authored typed core, `checkUniqueness()` returns `SOLUTION_NOT_UNIQUE: {Carrow, Vale}` with the exact unsound step — reproducing §4.6 by hand. Then I add the station-master departure fact and it returns `UNIQUE`. If I can't express "boarded ≠ departed" in the type system cleanly, the type system is wrong and I learn it here.
2. **The model can read the counterexample.** I feed Opus 4.8 (via `tool_use`, see [`packages/llm/src`](../../packages/llm/src)) the checker as a callable tool and the broken case, and confirm it can interpret `SOLUTION_NOT_UNIQUE` and propose the *right* repair (add a discriminating fact) rather than thrash.
3. **The loop converges.** Starting from a deliberately-broken proposal, the propose→verify→repair loop reaches a certificate in a **bounded** number of turns (target ≤ 5) without oscillating.

**Falsification criteria (go/no-go).** I kill or rethink the redesign if *any* of these hold after the spike:
- The uniqueness check is **intractable or undecidable** in practice for a 5–8 suspect circle (e.g. the "consistent world" search blows up, or I can't bound it — see 9.6).
- The model **cannot converge**: it loops, ignores the counterexample, or "fixes" uniqueness by deleting suspects rather than adding clues.
- Expressing real mechanisms (clock-fast, locked-room, substitution) in the typed core requires so much logic that it stops being **decidable and fast**.

This spike is ~2 files and zero production wiring. It is the cheapest possible test of the most expensive possible assumption.

### 9.2 What gets built — and deleted (components & contracts)

**Built — the typed core (P1).** A new package, `packages/cml-core/`, holding the typed logical structure from §4.2 as discriminated-union TS types plus runtime guards: `Entity` (`Person | Object | Location | Permission`), `Event { id, actor, action, location, interval }`, `Interval { start, end }` over a single declared integer timeline, `AccessFact { person, reaches, during, via }`, `Observation { id, scene, asserts, availableBy }`, `InferenceEdge { from[], rule, eliminates }` with `rule` drawn from a **closed vocabulary** the checkers understand (`alibi_contradiction`, `access_impossible`, `physical_law`, `unique_capability`, …), and `Solution { culpritId }`.

**Built — the three engines (P1) as named, separately-testable modules:**

| Engine | Path | Decides | Cost |
|---|---|---|---|
| Timeline / alibi consistency | `packages/cml-core/src/engines/timeline.ts` | no person in two places at once; crime window has an accessible actor; each alibi *holds* or *breakable-by-fact-X* | interval arithmetic + reachability, sub-ms |
| Deducibility | `packages/cml-core/src/engines/deducibility.ts` | forward closure from the **shown** clue set reaches the culprit; every edge's premises are present *before* its position (no clue used early) | graph walk, sub-ms |
| Uniqueness | `packages/cml-core/src/engines/uniqueness.ts` | for each suspect `S`, is there a consistent world satisfying all clues where `S` is guilty? Exactly one survivor ⇒ unique | exhaustive over 5–8 suspects, cheap |

**Built — the tool-call loop (P2).** `packages/cml-core/src/certify.ts` exposes the three engines as `tool_use` definitions and runs the propose→verify→repair loop in [`packages/prompts-llm/src/agent3-cml.ts`](../../packages/prompts-llm/src/agent3-cml.ts), exiting only when all three engines pass. The structured typed core is emitted under **constrained decoding / structured output (P2)** so it is guaranteed at decode time — no parse-and-pray.

**Built — the fair-play certificate.** A new artifact, `FairPlayCertificate { timelineConsistent, deducibleTo: culpritId, uniqueAmong: suspectIds[], repairIterations, checkerVersion }`, emitted alongside the CML and consumed downstream (Agents 5/6/7/9) as the **truth-half** of fair-play. This is the new exit condition, replacing `validateCml`'s schema-only pass.

**Deleted or shrunk** (this is half the win — see §3, §5):

| Today | Fate |
|---|---|
| `normalizeCml` enum-coercion / brace-slice / YAML-fallback / cast-padding ([`agent3-cml.ts:578`](../../packages/prompts-llm/src/agent3-cml.ts)) | **deleted** — structure guaranteed at decode |
| `fallbackCulprit` silent culprit swap ([`agent3-cml.ts:693`](../../packages/prompts-llm/src/agent3-cml.ts)) | **deleted** — solver convicts the named culprit or the loop doesn't exit |
| `repairInferenceRequiredEvidence` / `buildEvidenceFallback` ([`agent3-run.ts:25`](../../apps/worker/src/jobs/agents/agent3-run.ts)) | **deleted** — grounding is certified, not synthesized from prose |
| `evidence_clue_backfill` gate + `evidence_clue_backfill_threshold` ([`mystery-orchestrator.ts:736`](../../apps/worker/src/jobs/mystery-orchestrator.ts), [`generation-params.yaml`](../../apps/worker/config/generation-params.yaml)) | **retired** — evidence→clue mapping is part of the certificate, nothing to back-fill |
| Agent 4 LLM revision loop (`reviseCml`, [`agent4-revision.ts`](../../packages/prompts-llm/src/agent4-revision.ts)) | **absorbed** — schema can't break; logic fixed in-loop; residual = deterministic re-check |
| `revisedByAgent4 ? 60 : 100` hard-coded score ([`agent3-run.ts:211`](../../apps/worker/src/jobs/agents/agent3-run.ts)) | **replaced** — score derived from `certificate.repairIterations` |

**Rebuilt I/O contract.** *In:* the same `CMLPromptInputs` (setting, cast, devices, novelty constraints). *Out:* `{ cml, typedCore, certificate, cost }` — the certificate is the new load-bearing field; `validation.valid` becomes "certificate present and clean," not "schema keys present."

### 9.3 Dependencies & sequencing

**P1 and P2 are built HERE, in this agent, and nowhere else.** Every dependent waits on them:

- **Agent 4** absorbs the certify loop as its inner generate-verify-repair — *needs P1+P2 first.*
- **Agent 5** derives clues from `typedCore.inference_path` and calls the **deducibility** checker to prove each red herring preserves uniqueness — *needs P1.*
- **Agent 6** reuses all three engines as the truth-half of its blind-reader comparison — *needs P1.*
- **Agent 7** schedules the CML obligations the certificate enumerates — *needs the certificate shape.*
- **Agent 8** hooks novelty onto the cheap structural skeleton instead of regenerating whole proofs — *needs `typedCore`.*
- **Agent 9** consumes the proven CML and must surface every certified clue — *needs the certificate.*
- **Agent 3b (devices)** folds in as the **mechanism sub-step**: it hands Agent 3 a *typed mechanism template* whose contradiction structure the timeline engine understands.

So this plan **must land before all of them.** I will not let a dependent start against a half-built checker.

**Ordered phases (each independently shippable behind a flag):**

1. **Typed core** — `packages/cml-core/` types + guards. No engine yet.
2. **Timeline engine** — interval consistency + alibi classification. Unit-tested standalone.
3. **Deducibility engine** — forward closure over the shown clue set.
4. **Uniqueness engine** — the hard one; exhaustive per-suspect world search.
5. **Tool-call loop** — wire engines as `tool_use`, run propose→verify→repair against constrained decoding.
6. **Integrate** — emit certificate from `runAgent3`, flip exit condition, then delete the §9.2 scaffolding.

**Clear first increment:** phases 1–4 are a **pure offline library** validated against the corpus (see §7 of the redesign and 9.5) before *any* generation wiring. The library earns trust touching nothing.

### 9.4 Test & validation strategy

This is a checker — its correctness *is* the product, so it gets the heaviest test budget in the series.

- **Property tests (the core invariant).** `accepted CML ⇒ checker certifies a unique solution`: generate random small typed cores, and assert that *anything* the certify loop accepts passes an independent re-run of all three engines (no self-agreement bug). The contrapositive: `non-unique core ⇒ uniqueness engine rejects` with the spare suspect named.
- **Adversarial corpus the checker MUST reject.** Hand-author a battery of *deliberately broken* cases: two suspects equally consistent (non-unique); a step that uses a clue before its `availableBy` (unsound order); the §3 `fallbackCulprit` case where the inference path convicts person A but `culprits=[B]` (must reject, not silently swap); an alibi that "holds" only because a contradicting fact was omitted. Each must fail with the *exact* location.
- **The §4.6 clock-set-fast case as the canonical golden.** Both states are checked-in fixtures: the broken version asserts `SOLUTION_NOT_UNIQUE: {Carrow, Vale}` with the "boarded ≠ departed" diagnosis; the repaired version (station-master fact added) asserts `UNIQUE`. This golden is the executable spec of the whole thesis.
- **Golden / canary replay harness (P4).** A frozen set of certified runs replays through the engines on every change; a checker-version bump that flips any golden's verdict blocks merge. Canary a handful of live runs through the engines in shadow before promotion.
- **Convergence test.** From seeded-broken proposals, assert the loop reaches a certificate within the turn bound (9.1) and never exits *without* one.

### 9.5 Rollout & rollback

- **Flag:** `cml_core_checker` with stages `off → shadow → advisory → gating`, mirroring §7's migration ladder.
- **Shadow run first (the killer measurement).** Run the engines over **every already-shipped CML** in [`apps/api/data/reports/`](../../apps/api/data/reports/) via a best-effort parser from today's stringy fields into the typed core, and report **how many shipped cases the uniqueness checker would FAIL.** My strong prior (§3, §6): a lot. That single number justifies the whole project and sets the rollback bar — if shadow shows the checker rejecting cases humans judge *fair*, the checker is too strict and I tune before gating.
- **Advisory stage:** engines run as a non-blocking diagnostic next to the existing backfill logic; production keeps shipping; we watch agreement and first-proposal non-uniqueness rate fall across repairs.
- **Legacy fallback:** at `gating`, if the loop can't reach a certificate within the turn budget, fall back to **today's path** (generate + `normalizeCml` + schema validate) and tag the run `certificate: absent` rather than failing it — until confidence is high.
- **Kill criteria:** revert to `off`/`advisory` if certify p95 turn-count exceeds budget, if the checker rejects > X% of cases that pass blind-reader audit (false-positive on fairness), or if uniqueness latency regresses run time materially.

### 9.6 Open questions to resolve before coding

1. **How expressive must the logic be?** Propositional + interval constraints likely cover the genre (access windows, "boarded ≠ departed", unique capability). Do any real mechanisms need quantifiers or arithmetic the spike can't express? The 9.1 spike is partly *for* answering this.
2. **Decidability & performance of uniqueness.** "Consistent world per suspect" is a small CSP/SAT instance. Is exhaustive enumeration genuinely cheap at 8 suspects, or do I need a real SAT/SMT backend (and is that worth the dependency)?
3. **How to bound the proof search.** What's the turn budget before the loop is declared stuck, and what does the model do when stuck — surface to a human, fall back to legacy, or relax a constraint?
4. **What the LLM proposes vs what the solver fills.** Does the model author the full typed core (events, access, edges) and the solver only *check*? Or does the solver also *search for* a missing discriminating fact and hand it back? Leaning check-only first (simpler, more honest); searching is a later enhancement.
5. **Display/source-of-truth split.** The human-readable CML becomes a *rendering* of the typed core. Who owns the render, and how do we guarantee prose and types never drift?

### 9.7 "Ready to build" checklist

- [ ] §4.6 clock-set-fast case agreed as the canonical golden (both broken and repaired states).
- [ ] Closed `rule` vocabulary for `InferenceEdge` enumerated and signed off.
- [ ] Uniqueness approach chosen for the spike: hand-rolled enumeration vs SAT/SMT (9.6 #2).
- [ ] Opus 4.8 `tool_use` wiring confirmed against [`packages/llm/src`](../../packages/llm/src) for the spike loop.
- [ ] Turn budget + stuck-handling decided (9.6 #3).
- [ ] Shadow-run parser scoped against [`apps/api/data/reports/`](../../apps/api/data/reports/).
- [ ] **FIRST PR:** hand-author one typed CML (the §4.6 case) in `packages/cml-core/` and write the **deducibility + uniqueness checker spike** that reproduces `SOLUTION_NOT_UNIQUE: {Carrow, Vale}` and flips to `UNIQUE` once the station-master fact is added — then prove Opus 4.8 can read that counterexample and converge via `tool_use`. **No production wiring. Pure go/no-go on the keystone bet.**
