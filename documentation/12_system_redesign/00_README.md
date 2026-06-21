# 12 — System Redesign: Blue-Sky Thinking

> The brief, posed to Claude for every agent in the pipeline:
> **"If you could redesign this agent from the ground up — blue-sky thinking, starting over COMPLETELY — what would it do?"**

This folder is a thought experiment, not a roadmap. Each document below takes one agent of the
CML whodunit pipeline and reimagines it from first principles — not "what small fix would help,"
but "if the current implementation didn't exist and I were rebuilding the *job to be done* with
today's frontier models, what would I build?"

These documents are deliberately opinionated. They are meant to provoke, to surface the
architectural debt we've been routing around, and to ask the questions that incremental work never
gets to ask. Nothing here is committed. Everything here is on the table.

---

## Why do this now

The pipeline works. It produces fair-play Golden Age whodunits, logic-first, with CML as the single
source of truth. But it is a system that **grew** rather than one that was **designed**, and the
shape of that growth is visible everywhere:

- **Fifteen agents, accreted one at a time.** Agents 1, 2, 2b, 2c, 2d, 2e, 3b, 3, 4, 5, 6, 6.5, 7,
  8, 9. The fractional numbering (2b–2e, 3b, 6.5) is the fossil record of "we needed one more pass
  here" decisions. A ground-up design would not arrive at this org chart by choice.

- **Three retry layers per agent.** Almost every agent wraps its generation in (a) internal
  generation retries, (b) scoring-driven retries via `executeAgentWithRetry`, and (c) schema-repair
  retries. Most retries are *the same prompt, resent.* Token churn is the dominant cost of the whole
  system — on one baseline run, prose retries alone were ~96% of token spend, and the CML revision
  loop was described in its own config as "a major call-count churner."

- **Generate → parse → normalize → pad → patch.** Agents emit JSON *text*, which is parsed, then
  normalized (snake_case→camelCase, enum coercion), then padded or truncated to exact counts, then
  deterministically post-processed. A large fraction of the codebase exists to *fight the model's
  output into shape* rather than to constrain it at the source.

- **Deterministic patches that corrupt clean output.** The most painful class of bug we ship: a
  post-LLM deterministic pass mutates already-correct text and is *not re-validated.* Agent 9's
  "grounding lead" template leaked raw location fields into a chapter; its pronoun "repair" flipped
  correct pronouns to wrong ones. The model was right; the patch broke it.

- **Gates with no backstop.** A single linter (Agent 9's `template_bleed`) could burn an entire
  retry budget and hard-abort a run with *no story at all*, while the report still read green.

- **Truncation.** JSON outputs hit `max_tokens` and truncate mid-structure (Agent 2c's atmosphere
  block; Agent 3b's device list), which we patch by raising token ceilings rather than by changing
  the output strategy.

None of this is anyone's mistake. It is what *any* system looks like after eighteen months of "ship
the fix." The point of this folder is to imagine the system we'd build if we got to keep everything
we learned and throw away everything we accreted.

---

## The cross-cutting redesign theses

Five ideas recur across the per-agent documents. They are the spine of the whole exercise.

### 1. Constrain at the source, don't repair at the sink
The dominant failure mode is *generate freely, then wrestle the output into the contract.* With
modern tool-use and constrained decoding, the schema can be enforced **at decode time** — the model
literally cannot emit a malformed cast, a missing enum, or the wrong count. That deletes whole
families of code: the normalizers, the enum coercers, the placeholder-padders, the schema-repair
retries. If the structure is guaranteed, the only thing left to validate is *meaning*.

### 2. Logic is a proof; verify it with a checker, not another LLM
The system's founding metaphor is "build mysteries like an engineer builds proofs." We honor that
metaphor in the *artifact* (CML) but not in the *method*: we ask one LLM to hold an entire
self-consistent proof — timeline, mechanism, inference path, clue grounding — in its head, and then
ask **other LLMs** to catch the gaps (Agent 6's blind reader, Agent 8's similarity heuristic). A
ground-up design pairs the generative LLM with **deterministic checkers**: a timeline engine that
knows whether the alibis are consistent, a deducibility checker that knows whether the clues
actually entail the solution. The LLM proposes; the solver disposes. Fair-play stops being a vibe an
auditor assesses and becomes a property the artifact provably has.

### 3. Validation-gated mutation, always
No deterministic pass may mutate an artifact and ship it unchecked. Every repair — pronoun fix,
season lock, grounding lead, locked-fact word-form — must re-run the validator it claims to satisfy
and prove it didn't break something else. The cheapest version of this rule would have prevented
several of our worst shipped defects outright.

### 4. Fewer, larger, smarter calls
The 2b/2c/2d/2e quartet, the 3b→3→4 logic chain, the 6→6.5→7 staging chain — much of this
fragmentation exists because older, cheaper, smaller-context models couldn't do the whole job in one
pass. With a 1M-token context and a frontier reasoning model, many of these boundaries are
historical, not essential. Several documents argue for **merging** adjacent agents into a single
coherent pass with a single shared context, trading a dozen brittle handoffs for one rich one.

### 5. The pipeline should produce things lazily and just-in-time
We build enormous upfront bibles — full sensory profiles for every location, full dossiers for every
character — before we know which locations or characters the story will actually lean on (the
outline doesn't exist yet). A redesign generates the *spine* eagerly and the *texture* lazily, at
the moment a scene needs it, in that scene's context.

---

## The agent documents

Each file imagines one agent rebuilt from scratch. They share a common structure: the job to be
done, how it works today, where it hurts, the blue-sky redesign, ripple effects, how we'd measure
success, and a migration path — and each closes with **Section 9, an Implementation Plan** that
turns the vision into a de-risked, buildable sequence (validation spikes, what to build and delete,
dependencies, test strategy, rollout, and a "ready to build" kickoff checklist).

| # | Agent | Today's job | Redesign document |
|---|-------|-------------|-------------------|
| 1 | Era & Setting Refiner | Brief → historical-constraint artifact | [01_agent_1_era_setting.md](01_agent_1_era_setting.md) |
| 2 | Cast & Motive Designer | Suspect roster, relationships, candidates | [02_agent_2_cast.md](02_agent_2_cast.md) |
| 2b | Character Profiles | Prose-ready dossiers (voice, secrets) | [03_agent_2b_character_profiles.md](03_agent_2b_character_profiles.md) |
| 2c | Location Profiles | Sensory location bibles | [04_agent_2c_location_profiles.md](04_agent_2c_location_profiles.md) |
| 2d | Temporal Context | Period temporal grounding | [05_agent_2d_temporal_context.md](05_agent_2d_temporal_context.md) |
| 2e | Background Context | Misc background grounding | [06_agent_2e_background_context.md](06_agent_2e_background_context.md) |
| 3 | CML Generator | The full logical model of the mystery | [07_agent_3_cml_generator.md](07_agent_3_cml_generator.md) |
| 3b | Hard Logic Devices | Novel mechanism ideation (pre-CML) | [08_agent_3b_hard_logic_devices.md](08_agent_3b_hard_logic_devices.md) |
| 4 | CML Validator / Revision | Validate + repair the CML in a loop | [09_agent_4_cml_revision.md](09_agent_4_cml_revision.md) |
| 5 | Clues & Red Herrings | Clue set + fair-play guardrails | [10_agent_5_clues_red_herrings.md](10_agent_5_clues_red_herrings.md) |
| 6 | Fair-Play Auditor | Solvability audit + blind reader | [11_agent_6_fair_play_auditor.md](11_agent_6_fair_play_auditor.md) |
| 6.5 | World Builder | Tone / arc / texture world document | [12_agent_65_world_builder.md](12_agent_65_world_builder.md) |
| 7 | Narrative Outliner | Scene-by-scene chapter plan | [13_agent_7_narrative_outliner.md](13_agent_7_narrative_outliner.md) |
| 8 | Novelty Auditor | Similarity audit vs seed CMLs | [14_agent_8_novelty_auditor.md](14_agent_8_novelty_auditor.md) |
| 9 | Prose Generator | Chapter prose from all artifacts | [15_agent_9_prose_generator.md](15_agent_9_prose_generator.md) |

---

## If I redesigned the *whole* system in one sentence

I'd collapse the fifteen agents into roughly **five stages** — *Ground, Architect the Logic, Verify
the Logic, Plan the Telling, Tell It* — where the logic is generated against a deterministic
fair-play solver instead of audited after the fact, every artifact is structurally guaranteed by
constrained decoding instead of repaired after parsing, texture is generated lazily in the scene
that needs it instead of as upfront bibles, and no deterministic pass is ever allowed to mutate an
artifact without re-proving the property it claims to fix.

The per-agent documents are where that sentence gets its teeth.
