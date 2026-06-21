# Agent 2b — Character Profiles: A Ground-Up Redesign

> The cast already has the facts. The prose pipeline already shreds voice into deployable atoms. So what is this 1000-words-per-character essay-writing step actually *for* — and could it be a deterministic projection plus one tiny voice call instead of a whole LLM agent with a repair band-aid bolted to its side?

---

## 1. The job to be done

Strip away the implementation and Agent 2b exists to answer one question for every cast member:

> *"When this character speaks and moves on the page, what do they sound like, and what private pressure colours how they say it?"*

That's it. The **facts** — name, occupation, secret, motive, alibi window, access, stakes, relationships — are already produced by [Agent 2](../../packages/prompts-llm/src/agent2-cast.ts) and live in the CML. The **logic** is owned by Agents 3–6. Agent 2b's genuine, non-duplicative contribution is a narrow, prose-facing thing: a **voice fingerprint** (how they talk), a **behavioural tell** (how they move under stress), and one or two strands of **interiority** (what they want and fear that isn't in the case file). Everything else it currently emits is either (a) a re-statement of Agent 2 fields, or (b) raw material that a *downstream* agent re-digests anyway.

The honest job to be done is small. The current agent is large. That gap is the whole story.

---

## 2. How it works today

[`generateCharacterProfiles`](../../packages/prompts-llm/src/agent2b-character-profiles.ts) takes the full CML plus the Agent 2 cast and asks one LLM call to expand every cast entry into a dossier: `summary`, `publicPersona`, `privateSecret`, `motiveSeed`, `motiveStrength` (enum), `alibiWindow`, `accessPlausibility`, `stakes`, `humourStyle` (9-value enum), `humourLevel` (0.0–1.0 float), `speechMannerisms`, `internalConflict`, `personalStakeInCase`, optionally `physicalMannerisms` / `privateLonging`, and — the one *required* output — a `paragraphs[]` array of "4–6 narrative paragraphs (~1000 words)" per character.

Around that single call sits a remarkable amount of scaffolding:

- **Three retry layers.** Validation-wrapper retries inside the call ([`withValidationRetry`](../../packages/prompts-llm/src/utils/validation-retry-wrapper.ts), errors rewritten into character-named instructions via `buildValidationFeedback`); scoring-driven retries in the worker ([`executeAgentWithRetry`](../../apps/worker/src/jobs/agents/shared.ts), max 3 per [retry-limits.yaml](../../apps/worker/config/retry-limits.yaml)); and the targeted repair below.
- **A per-character repair call.** [`repairMissingParagraphs`](../../packages/prompts-llm/src/agent2b-character-profiles.ts) (`Agent2b-ProfileRepair`) fires when any profile comes back with an empty `paragraphs[]` — a documented band-aid for the *last profile getting truncated* under the token ceiling, even though that ceiling is now 8000 tokens ([generation-params.yaml](../../apps/worker/config/generation-params.yaml)).
- **A scoring adapter that rewrites the field names.** The [scorer](../../packages/story-validation/src/scoring/phase-scorers/agent2b-character-profiles-scorer.ts) expects `character_name`, `public_persona`, `private_secrets`, `behavioral_tells`, `humour_style` — names the agent never produces. The [adapter](../../apps/worker/src/jobs/scoring-adapters/agent2b-scoring-adapter.ts) bridges them, and in doing so **glues `paragraphs[0..3]` onto the persona/secret/motive/stakes fields purely to clear the scorer's word-count thresholds** (`scoreProfileDepth` wants ≥150 words for full marks). It also expands the `humourStyle` enum back into a prose sentence so `humour_style.length > 20` passes.

So depth is measured by counting words, and the agent pads to hit the count.

**Where the output actually goes.** Two consumers:

1. [Agent 6.5 World Builder](../../packages/prompts-llm/src/agent65-world-builder.ts) receives the *entire* `characterProfiles.profiles` JSON (`### CHARACTER_PROFILES`, serialized whole) and **re-derives** `characterVoiceSketches`, `characterPortraits`, and a `humourPlacementMap` from it — explicitly instructed to keep voice sketches "consistent with the speechMannerisms and humourStyle from the character profiles."
2. [Agent 9 Prose](../../apps/worker/src/jobs/agents/agent9-run.ts) passes the profiles to [`buildAssetLibrary`](../../packages/prompts-llm/src/asset-library.ts), which mines **only** `speechMannerisms` (split into per-clause `voice:*` atoms with budgets) and `internalConflict` (one atom, budget 2). The portrait atoms it builds (`firstImpression`, `physical`, `manner`) read fields that **come from the World Builder, not from 2b.**

Read that twice. The asset library — the part of the pipeline that does the genuinely smart thing, turning voice into budgeted, deploy-once atoms — uses **two** of Agent 2b's fields. The required, repair-protected, word-count-padded `paragraphs[]` essay is consumed by prose **only** through the scoring context (`agent2b_character_profiles: characterProfiles.profiles`) and through Agent 6.5's wholesale re-digestion. Nobody reads those 1000 words as voice. We generate an essay, retry it, repair it, score its length — and then a *different* LLM call paraphrases it into the structure we actually deploy.

---

## 3. Where it hurts

1. **The required field is the least-used field.** `paragraphs[]` is the only `required: true` item in the profile schema, it's the reason the repair path exists, and it's the thing the adapter pads — yet prose consumes it indirectly at best. We've optimised, gated, and band-aided the one output that matters least.

2. **"No new facts" vs. "write 1000 words" is an unwinnable brief.** The system prompt says *"Do not introduce new facts beyond the provided cast and CML"* and then demands six paragraphs per character. Six paragraphs that invent nothing can only re-phrase Agent 2. So the model either pads (and the prose inherits beige restatement) or it quietly invents biography (and now there's un-validated canon — a [post-LLM mutation without re-validation](../../C:/Users/andyl/.claude/projects/c--CML/memory/agent9-postprocess-after-validation.md) smell, one layer earlier). This tension is **structural**, not a prompt-tuning problem.

3. **Depth-by-word-count is a metric that rewards the wrong thing.** `scoreProfileDepth` gives points for 150-word personas and 100-word secrets. The adapter exists *to feed that metric* by concatenating narrative paragraphs onto short fields. We built a length detector and then built a length generator to satisfy it. A character is not deep because their secret is described in 100 words.

4. **Humour metadata is an over-engineered control plane.** A 9-value `humourStyle` enum + a 0.0–1.0 `humourLevel` float, with elaborate prompt rules ("aristocrats tend to understatement… max 1 character at 0.9–1.0"). Downstream, Agent 6.5 collapses it into a `humourPlacementMap` and asset-library **ignores `humourStyle`/`humourLevel` entirely**. We're carrying a precise float that no deployer reads precisely.

5. **The repair call is treating a symptom of text-JSON generation.** `repairMissingParagraphs` exists because a single completion emitting N full dossiers as hand-built JSON truncates the last one. That is a *generation-mode* failure. With constrained decoding / structured outputs, the model cannot emit a profile object missing its required array — the failure class disappears, and with it the entire `Agent2b-ProfileRepair` label, its prompt, its parse-and-`jsonrepair` fallback, and its error handling.

6. **The 2b/2c/2d/2e quartet is fragmentation.** Four sequential "expand the CML into prose-ready X" LLM calls (characters, locations, temporal, background), each with its own schema, scorer, adapter, retry stack, and truncation risk. Four full re-sends of overlapping CML context. This is [token churn](../../C:/Users/andyl/.claude/projects/c--CML/memory/MEMORY.md) by architecture.

---

## 4. Blue-sky redesign

If I started over, I would **delete the profile essay and replace it with a typed Voice Capsule produced by constrained decoding** — small, testable, threaded directly into prose, with no repair path and (ideally) no separate agent at all.

### 4.1 The core artifact: a Voice Capsule, not a biography

Per character, the only thing prose can't already get from the CML:

```json
{
  "name": "Edith Pryce",
  "register": "clipped, provincial-genteel; over-corrects to formal diction when nervous",
  "speechTells": [
    "ends statements with a small interrogative 'isn't it' when seeking control",
    "never finishes a sentence about her late husband"
  ],
  "physicalTell": "smooths an already-smooth tablecloth when a question lands too close",
  "humour": { "mode": "polite_savagery", "frequency": "rare" },
  "wants": "to keep the house, which she cannot afford and will not say so",
  "fears": "that being believed about the night requires admitting she was awake",
  "stakeInCase": "the inquiry threatens the one fact she has organised her dignity around"
}
```

Note what changed:

- **`paragraphs[]` is gone.** No essay. Voice is captured as *deployable fragments*, not prose. This is exactly the shape `asset-library.ts` already wants — `speechTells` map one-to-one onto `voice:*` atoms with no string-splitting heuristic in the middle. We stop generating prose so a downstream function can re-shred it back into fragments.
- **`humourLevel: 0.0–1.0` float → `frequency: never|rare|sometimes|often`.** Three of those words map cleanly to atom budgets; the float never did. A control value should be exactly as precise as the deployer that reads it, and no more.
- **`wants` / `fears` / `stakeInCase`** carry the interiority (today's `privateLonging` / `internalConflict` / `personalStakeInCase`) — the genuinely additive, non-CML content — as **one sentence each**, which is all the asset-library deploys anyway (budget 2).
- **Restated CML fields are gone.** `motiveSeed`, `alibiWindow`, `accessPlausibility`, `motiveStrength`, `publicPersona` already live in the cast. A capsule that re-emits them is a sync hazard. Prose reads them from the cast directly.

### 4.2 Constrained decoding kills the repair path entirely

Target model is Opus 4.8 with native structured outputs. We hand it a JSON schema (or tool definition) requiring an **array of exactly N capsules**, each with required `speechTells` (min length 2) and required `humour.mode` from the enum. The model **cannot** return a capsule missing its required fields or with an out-of-enum humour mode — the decoder won't let it. That single change deletes:

- `repairMissingParagraphs` and the `Agent2b-ProfileRepair` call;
- the `try { JSON.parse } catch { jsonrepair }` ladder in both the main and repair paths;
- the enum-coercion prose ("MUST be one of these exact values…");
- the validation-wrapper's *schema*-error retries (logic/consistency retries stay).

The remaining retry surface is "is this voice any good," not "is this parseable" — which is the only retry worth paying tokens for.

### 4.3 Resolving "no new facts" honestly

The tension dissolves once we stop asking for paragraphs. A Voice Capsule's job is **explicitly** to add what isn't in the cast: register, tells, wants, fears. Those aren't "facts about the case" — they're *performance directions*. The rule changes from the self-contradictory *"add richness but invent nothing"* to a clean, checkable contract:

> *Add nothing to the case logic (no new events, times, relationships, or secrets). Add everything about delivery (how this person sounds, moves, wants, and fears).*

That's a rule a validator can actually enforce: cross-check capsule text against the CML's fact set; flag any new named entity, time, or causal claim. Voice can't leak into logic because voice isn't shaped like logic.

### 4.4 Does this need to be a separate LLM call at all?

Two strong options, and I'd ship **B**:

- **Option A — Merge into Agent 2 (Cast).** The cast designer already invents the person; have it emit the Voice Capsule in the same structured call. One LLM round-trip produces facts + voice together, guaranteed consistent (no second model re-reading the first model's output). Cost: a heavier Agent 2 schema and prompt.

- **Option B — Merge the 2b/2c/2d/2e quartet into one "Prose Brief" agent (my pick).** All four "expand CML into prose-ready X" steps share inputs (the CML) and one consumer (Agent 6.5 + Agent 9). Collapse them into a **single structured call** that emits `{ voiceCapsules[], locationRegisters[], temporalTexture, backgroundNotes }`. One CML re-send instead of four. One schema, one scorer, one retry stack. With a 1M-context model and constrained decoding, emitting four typed sections in one pass is trivial and removes three inter-agent serialization seams (and three truncation risks). This directly attacks the fragmentation smell the brief flags.

Either way, **Agent 2b as a standalone agent stops existing.**

### 4.5 Lazy per-scene generation? No — but lazy *elaboration*, yes

Generating capsules per-scene is tempting (only flesh out characters when they appear) but wrong here: voice must be **stable across the whole book**, and prose batches need a consistent fingerprint from chapter 1. A character whose register drifts because it was re-generated in chapter 7 is a continuity bug. So the **capsule is eager and global** — cheap enough to make for everyone up front (it's ~8 short fields, not 1000 words).

What *can* be lazy is **elaboration into a scene-specific beat**: when a character enters a scene, the prose agent (which already does atom selection) pulls their capsule and the arc-position and decides which tell to deploy *now*. That's already how `selectChapterAtoms` works. We don't need a per-scene LLM call; we need the global capsule to be clean enough that deterministic selection does the rest.

### 4.6 What the scorer becomes

Delete `scoreProfileDepth`'s word-count ladder and the field-renaming adapter entirely. Score the capsule on things that predict good prose:

- **Distinctiveness** (cheap, deterministic): are the `register` / `speechTells` strings pairwise dissimilar across the cast? Two characters with the same tell is the real failure, and a trigram-overlap check catches it without an LLM.
- **Groundedness** (deterministic): does any capsule introduce a named entity / time / causal claim absent from the CML? Enforces 4.3.
- **Deployability** (deterministic): does every capsule have ≥2 atomizable `speechTells` and a non-empty `physicalTell`? That's literally "will the asset library have something to deploy."

No word counts. No padding incentive. The adapter (`adaptCharacterProfilesForScoring`) is deleted, not refactored — the capsule already *is* the scorer's input shape.

---

## 5. Ripple effects on the rest of the pipeline

- **[Agent 6.5 World Builder](../../packages/prompts-llm/src/agent65-world-builder.ts):** Today it re-derives voice sketches from the profile JSON. Under the redesign it receives clean capsules and either (a) passes `speechTells`/`humour` straight through into `characterVoiceSketches` (one fewer paraphrase, one fewer place for drift), or (b) the `humourPlacementMap` is fed directly by `humour.frequency` per character. Strictly less work and less divergence.

- **[asset-library.ts](../../packages/prompts-llm/src/asset-library.ts):** The biggest winner. The string-splitting heuristic on `speechMannerisms` (`.split(/;|\.\s+/)`) goes away — `speechTells[]` is already an array of atoms. `internalConflict` becomes `fears`, `firstImpression`/`physical`/`manner` consolidate with `physicalTell`. The library gets *more* structured input with *less* parsing.

- **Token cost:** One capsule call (or one merged Prose-Brief call) replaces a 1000-word-×-N essay generation plus a repair call plus retries. Per the brief's cost reality, most spend is re-sent prompts; merging 2b–2e removes three redundant CML re-sends.

- **Scoring aggregator / [thresholds](../../packages/story-validation/src/scoring/thresholds.ts):** the `agent2b-character-profiles: 75` threshold and its component minima get re-pointed at the new deterministic checks (or rolled into a `prose_brief` threshold under Option B).

- **No effect on logic agents (3–6).** This change is entirely on the prose-facing side of the CML wall, which is exactly where it should be.

---

## 6. How we'd know it worked

- **Zero `Agent2b-ProfileRepair` invocations** across a run sample — the failure class is structurally gone, not suppressed.
- **Adapter deleted:** `adaptCharacterProfilesForScoring` no longer exists; capsule == scorer input.
- **Distinctiveness measured at the source:** pairwise `speechTells` similarity stays below threshold across the cast (today nothing checks this until prose, if at all).
- **Groundedness gate green:** automated check finds no capsule introducing CML-absent entities/times/causality — proving the "no new facts" rule is now enforceable rather than aspirational.
- **Voice survives to the page:** sample chapters where each present character deploys ≥1 of their own `speechTells` — measurable because the atoms are now traceable end-to-end (capsule → atom id → chapter).
- **Cost down:** tokens/character for this stage drop materially vs. the 1000-word baseline; merged-quartet variant cuts CML re-sends from 4 to 1.

---

## 7. Migration path

1. **Add capsules alongside profiles (non-breaking).** Extend the structured call to emit `voiceCapsules[]` in addition to today's `profiles[]`. Constrained decoding on the *new* field only. Ship it dark.
2. **Repoint `asset-library.ts`** to prefer `speechTells[]` / `physicalTell` / `fears` when present, falling back to the legacy split-on-`speechMannerisms` path. Now prose is driven by capsules with the essay still present as a safety net.
3. **Repoint Agent 6.5** to consume `voiceCapsules` for voice sketches and `humour.frequency` for the placement map.
4. **Flip the scorer** to the three deterministic checks; delete the word-count ladder and the adapter. Re-baseline the threshold.
5. **Drop `paragraphs[]` and the restated CML fields** from the schema once nothing reads them; **delete `repairMissingParagraphs`** and the `jsonrepair` ladder.
6. **(Option B) Merge 2b–2e** into one Prose-Brief agent — do this last, as a clean consolidation once each section is independently capsule-shaped.

Each step is independently shippable and reversible; the essay stays as a fallback until step 5 proves it's dead weight.

---

## 8. The pitch in one paragraph

Agent 2b writes a 1000-word biography per character that nobody reads as prose — the asset library shreds two of its fields into voice atoms, the World Builder paraphrases the rest, and the scorer just counts its words while an adapter pads short fields to clear the count and a repair call patches the last profile when the essay truncates. Replace the essay with a small, typed **Voice Capsule** — register, a couple of speech tells, a physical tell, a coarse humour setting, and one sentence each of want/fear/stake — produced by **constrained decoding** so it can't be malformed (deleting the entire repair path), scored by **deterministic distinctiveness/groundedness/deployability checks** instead of word count (deleting the adapter), and threaded **straight into the atom library** it was always destined for. The self-defeating "invent nothing but write a thousand words" brief becomes the honest "add nothing to the logic, everything to the delivery," and the 2b/2c/2d/2e quartet collapses into a single Prose-Brief call — fewer agents, fewer seams, fewer tokens, and voice that actually survives to the page.

---

## 9. Implementation Plan

> Sections 1–8 argued the *what* and *why*; this is the *how* — the spikes that de-risk it, the code that gets written and the code that gets deleted (with real paths), the order it has to happen in given the cross-agent dependencies, and the first PR I'd open tomorrow.

### 9.1 Validate the approach first (de-risking spikes)

Three things must be true before any production code lands. Each is a half-day spike against the live model, not a design meeting.

- **Spike A — Constrained decoding actually holds the shape.** Take the [Voice Capsule schema](#41-the-core-artifact-a-voice-capsule-not-a-biography) (§4.1), wire it as a tool definition / structured-output schema, and run it against Opus 4.8 over 3 real casts of 6–10 characters. The pass bar: **zero** capsules emitted with `speechTells.length < 2`, zero out-of-enum `humour.mode`, zero malformed JSON across ~25 capsules — i.e. the decoder makes [`repairMissingParagraphs`](../../packages/prompts-llm/src/agent2b-character-profiles.ts) structurally unreachable. If the model needs a `jsonrepair` net even once under constrained decoding, the whole "delete the repair path" thesis is in question and I want to know on day one. This is shared platform **P2**'s first real exercise on the prose side.
- **Spike B — Deterministic distinctiveness has signal.** Implement the trigram-overlap pairwise check on `register` + `speechTells` (§4.6) and run it over both *good* hand-written casts and a deliberately *beige* cast (every character "speaks plainly, is direct"). The bar: the beige cast trips the threshold and the good cast doesn't. If trigram overlap can't separate them, I need a different distinctiveness metric before I delete `scoreProfileDepth`.
- **Spike C — Groundedness gate is enforceable, not aspirational.** Build the named-entity/time/causal-claim extractor over capsule text and diff it against the CML fact set (§4.3). Feed it a capsule that smuggles in an invented sibling and a specific clock time; confirm both are flagged. This is the spike that proves "add nothing to logic" is a *check*, not a hope — and it's the one I'd expect to be fiddliest (NER over short strings is noisy), so I want its false-positive rate measured before it gates anything.

If A fails, stop and rethink. If B or C are merely noisy, ship them as **warn-only** (telemetry, not a hard gate) until tuned — see §9.5.

### 9.2 What gets built — and deleted (components & contracts)

**Built:**

| Component | Path | Note |
|---|---|---|
| `VoiceCapsule` type | `packages/prompts-llm/src/types/voice-capsule.ts` (new) | The §4.1 shape; the I/O contract below |
| Capsule generation call | extend [`agent2b-character-profiles.ts`](../../packages/prompts-llm/src/agent2b-character-profiles.ts) → later renamed to `prose-brief.ts` | constrained-decoding tool def emitting `voiceCapsules[]` |
| Deterministic scorer | replace [`agent2b-character-profiles-scorer.ts`](../../packages/story-validation/src/scoring/phase-scorers/agent2b-character-profiles-scorer.ts) internals | distinctiveness + groundedness + deployability (§4.6) |
| Capsule→atom path | repoint [`asset-library.ts`](../../packages/prompts-llm/src/asset-library.ts) | consume `speechTells[]`/`physicalTell`/`fears` directly |

**Deleted (real paths, in dependency order so nothing reads a thing after it's gone):**

- [`repairMissingParagraphs`](../../packages/prompts-llm/src/agent2b-character-profiles.ts) (the `Agent2b-ProfileRepair` call, its prompt, and its `JSON.parse → jsonrepair` fallback, agent2b-character-profiles-scorer's sibling at lines ~138–196).
- The `import { jsonrepair }` ladder in [`agent2b-character-profiles.ts`](../../packages/prompts-llm/src/agent2b-character-profiles.ts) (line 11 + the `catch` at ~245) — constrained decoding makes it dead.
- The whole scoring adapter [`adaptCharacterProfilesForScoring`](../../apps/worker/src/jobs/scoring-adapters/agent2b-scoring-adapter.ts) — the field-rename + `paragraphs[0..3]`-gluing + enum-expansion lives only to feed `scoreProfileDepth`; when the scorer takes capsules natively the adapter has no caller.
- `scoreProfileDepth`'s word-count ladder inside the scorer (the `>=80 words` / `>=150 words` thresholds the adapter pads toward).
- The `.split(/;|\.\s+/)` heuristic in [`asset-library.ts`](../../packages/prompts-llm/src/asset-library.ts) (~line 56) once `speechTells[]` arrives pre-atomized.
- `paragraphs[]` and the restated CML fields (`motiveSeed`, `alibiWindow`, `accessPlausibility`, `motiveStrength`, `publicPersona`, `humourStyle` enum, `humourLevel` float) from the schema — **last**, after step 5 of §9.4 proves nothing reads them.

**I/O contract (the load-bearing interface):**

- **In:** the full CML + Agent 2 cast (unchanged inputs; same as today).
- **Out:** `{ voiceCapsules: VoiceCapsule[] }`, exactly one capsule per cast member, `voiceCapsules[i].name === cast.characters[i].name`. Each capsule conforms to §4.1 and to the **Style Contract (6.5)** — register and humour mode must be expressible within the contract's tone, not contradict it.
- **Invariant (gates the call):** every named entity, time, and causal claim in capsule text is present in the CML/cast fact set. Nothing new in logic; everything new in delivery.

### 9.3 Dependencies & sequencing

This change lives entirely on the prose-facing side of the CML wall, so it does **not** block the logic keystone — but it's coupled to two platforms and one downstream consumer.

- **Platform P2 (constrained decoding / structured output)** is a hard prerequisite — it *is* the mechanism that deletes the repair path. Spike A (§9.1) is the first real load on P2's prose side. Build order: P2 infra ready → Spike A → capsule call.
- **Platform P1 (typed CML core + checker library)** is the source of truth the groundedness gate diffs against (§9.1 Spike C). The gate is only as good as P1's fact extraction; if P1 lands its checker library after this agent, ship the groundedness gate warn-only against an interim CML read and harden it when P1 arrives.
- **Platform P4 (golden/canary replay harness)** is how §9.4's canary and §9.5's rollback run. No new infra needed here beyond a capsule-aware golden set.
- **Platform P3 (validation-gated mutation)** is mostly Agent 9's concern, but it's why capsules must be *clean at the source*: Agent 9 consumes capsules and applies validation-gated mutation downstream — a capsule that leaks an un-grounded fact becomes an un-revalidated mutation one layer up (the [post-LLM-mutation smell](../../C:/Users/andyl/.claude/projects/c--CML/memory/agent9-postprocess-after-validation.md)). The groundedness gate here is the backstop for that.
- **Downstream — Agent 9 consumption.** Agent 9 reads capsules via [`buildAssetLibrary`](../../packages/prompts-llm/src/asset-library.ts) → `selectChapterAtoms`. The repoint (build, above) must keep the legacy `speechMannerisms` split path as a fallback until the capsule path is proven, so Agent 9 never sees an empty atom set mid-migration.
- **Downstream — Agent 6.5 World Builder.** [`agent65-world-builder.ts`](../../packages/prompts-llm/src/agent65-world-builder.ts) re-derives voice sketches today; repoint it to pass `speechTells`/`humour` through (§5). Sequence *after* the capsule call ships dark, so 6.5 has a real field to read.

**The 2b/2c/2d/2e → Prose-Brief merge — sequencing (the live option from the brief).** Per the cross-agent map: **2e is deleted into Agent 2**, **2d becomes a TemporalAnchor**, **2b becomes the Voice Capsule**, **2c becomes eager-spine + lazy-texture**. Do **not** merge first. Make each section independently capsule-shaped under its own agent, prove each in isolation, *then* collapse the four typed sections (`voiceCapsules[]`, `locationRegisters[]`, `temporalTexture`, `backgroundNotes`) into one constrained-decoding **Prose-Brief** call (Option B, §4.4) as a final consolidation — one CML re-send instead of four, one scorer, one retry stack. Merging before each section is clean would just relocate four fragile schemas into one fragile schema. Order: capsule (this plan) → 2c/2d/2e each shaped → Prose-Brief merge.

### 9.4 Test & validation strategy

The §4.6 scorer dimensions *are* the test suite — each becomes an executable check, not a word count.

1. **Distinctiveness (unit):** pairwise trigram overlap on `register`+`speechTells` across a fixture cast stays below threshold; a planted duplicate tell on two characters fails the test. (Mirrors Spike B.)
2. **Deployability (unit):** every capsule has `speechTells.length >= 2` and a non-empty `physicalTell` — literally "the asset library will have something to deploy." A capsule that passes decoding but is deployment-empty must still fail this.
3. **Groundedness (integration) — the headline invariant:** **no fact in any capsule is absent from the CML/cast fact set.** Run the §9.1-Spike-C extractor over capsule output and assert the diff is empty. This is the test that makes "add nothing to logic" enforceable; it's a hard gate, not a score component.
4. **End-to-end traceability (integration):** generate a sample chapter and assert each present character deploys ≥1 of *their own* `speechTells` — capsule → atom id → chapter, traceable because the atoms are now first-class (§6).
5. **Repair-path-is-dead (regression):** assert `Agent2b-ProfileRepair` is invoked **zero** times across a run sample, and that `repairMissingParagraphs`/`adaptCharacterProfilesForScoring` symbols no longer exist (grep-as-test in CI).
6. **Canary (P4):** replay the golden cast set through old vs. new; the new path must (a) produce one capsule per character, (b) green the three gates, (c) show tokens/character materially down vs. the 1000-word baseline.

### 9.5 Rollout & rollback

Follow the §7 migration ladder — each rung is independently shippable and reversible — with these guardrails:

- **Dark launch (step 1):** capsules emitted alongside `profiles[]`, behind a flag, scored but not gating. Essay stays as the live path. Rollback = flip flag off; zero blast radius.
- **Shadow scoring:** run new deterministic scorer in parallel with the old word-count scorer for N runs; compare verdicts before the new one gates. Distinctiveness/groundedness ship **warn-only** first if Spike B/C were noisy (§9.1), promoting to hard gates only once false-positive rate is measured low.
- **Repoint consumers (steps 2–3):** asset-library and Agent 6.5 prefer capsules, **fall back to legacy `speechMannerisms`** when absent. This is the reversible heart of the migration — both paths live simultaneously.
- **Cut the safety net (step 5):** delete `paragraphs[]`, the repair call, and the adapter **only after** the regression test (§9.4.5) is green across a full canary sample. This is the one-way door; everything before it rolls back by flag or fallback.
- **Merge last (step 6):** the Prose-Brief consolidation is a separate, later rollout with its own canary — never bundled with the capsule cutover.

### 9.6 Open questions to resolve before coding

- **Groundedness NER precision.** Can the extractor reliably tell a *new* named entity from a paraphrase of an existing one ("the housekeeper" vs. "Mrs. Pryce")? If precision is poor, the gate ships warn-only and we accept some leakage risk short-term. **Resolve via Spike C.**
- **Distinctiveness threshold value.** What trigram-overlap number separates "distinct" from "samey" without flagging two genuinely similar servants? Needs calibration against real casts — **Spike B output sets it.**
- **`humour.frequency` granularity.** Is `never|rare|sometimes|often` enough for Agent 6.5's `humourPlacementMap`, or does it need a 5th bucket? Confirm with 6.5's actual mapping before freezing the enum.
- **Capsule ownership under Option A vs. B.** If Agent 2 ends up emitting capsules directly (§4.4 Option A), does this agent disappear entirely or remain as the validator? Decide before the merge step, not during it.
- **Style Contract conformance enforcement.** Is (6.5) conformance a hard gate or a warn? A capsule whose register fights the Style Contract is a real defect — but failing the whole run on it may be too brittle early on.

### 9.7 "Ready to build" checklist

- [ ] Spike A green: constrained decoding holds the capsule shape over 3 real casts, zero repairs needed.
- [ ] Spike B green: trigram distinctiveness separates beige from distinct casts; threshold chosen.
- [ ] Spike C measured: groundedness extractor flags planted facts; false-positive rate known.
- [ ] `VoiceCapsule` type + I/O contract (§9.2) reviewed and frozen.
- [ ] Style Contract (6.5) conformance decision made (gate vs. warn).
- [ ] Golden cast set captured in P4 for canary (§9.4.6).
- [ ] Flag plumbing in place for dark launch (§9.5).

**First task / PR:** *"Add `VoiceCapsule` type + dark-launch capsule generation behind a flag."* Land `packages/prompts-llm/src/types/voice-capsule.ts`, extend [`agent2b-character-profiles.ts`](../../packages/prompts-llm/src/agent2b-character-profiles.ts) to emit `voiceCapsules[]` via constrained decoding **alongside** the existing `profiles[]` (nothing deleted yet), and gate it behind a flag scored warn-only. That single PR *is* Spike A in production form — it proves the decoder holds the shape before we touch the repair path, the adapter, or the scorer.
