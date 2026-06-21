# Agent 6.5 — World Builder: A Ground-Up Redesign

> Tone is a *contract* the user signs at spec time and that threads through every agent — not a 6,000-token "world document" authored two-thirds of the way down the pipeline and gated on whether one paragraph hit 200 words.

I'm Claude. I was asked to redesign Agent 6.5 from the ground up — blue-sky, no allegiance to the current shape. My conclusion up front: **the World Builder as a late, standalone, length-gated artifact is the wrong shape for the job.** Voice, register, humour-permission, and emotional arc are not late-stage synthesis problems; they are *upstream commitments* that should be fixed once — as a small, canonical **Style Contract** established at spec/grounding time — and then read by every generative agent that follows. What's left of 6.5 after that is not a document-builder; it's a thin **prose-conditioning compiler** that turns the contract plus the finished logic into hard constraints and exemplar passages for Agent 9. Below is the evidence and the rebuild.

The fractional name says it all. **6.5 was *inserted***, not designed — a patch for a felt gap ("the prose has no soul, no consistent voice") wedged between fair-play (6) and the outliner (7). A patch is exactly what you'd expect to gate on a length proxy and to own a concern that should have been owned upstream.

---

## 1. The job to be done

Strip the schema away and the durable jobs are:

1. **Commit to a voice.** Register, diction, humour tolerance, sentence rhythm, narrative distance — the *feel* of the book. This is the thing a reader notices in the first paragraph and the thing that must not drift across 80,000 words.
2. **Give each character a distinguishable voice** consistent with their profile (`speechMannerisms`, `humourStyle`, `humourLevel`) so dialogue isn't interchangeable.
3. **Map the emotional arc** — where the book tightens, where it breathes, where humour is forbidden (`body_discovery`, the reveal) and where it's permitted.
4. **Anchor period texture** — what it *feels like* to live in this exact month and year, as prose-facing detail rather than a history lesson.
5. **Pre-stage the reveal's retroactive weight** — which earlier moments the ending will recolour.

Here is the crucial observation: **Job 1 is the user's, and it's expressible at spec time.** "A wry, Christie-ish country-house comedy of manners" or "a cold, Highsmith-flavoured psychological grind" is a *premise input*, not something to discover after the cast, locations, timeline, CML, clues, and fair-play proof are all locked. Jobs 2–5 are *derivations* of Job 1 against the finished logic. The current agent fuses the commitment and all five derivations into one late LLM call — which is why tone arrives last, partially, and gated on length.

---

## 2. How it works today

The runner [`apps/worker/src/jobs/agents/agent65-run.ts`](../../apps/worker/src/jobs/agents/agent65-run.ts) calls `generateWorldDocument()` in [`packages/prompts-llm/src/agent65-world-builder.ts`](../../packages/prompts-llm/src/agent65-world-builder.ts) at progress step 90–93 — after fair-play, before the outliner. It runs at temperature 0.7, `maxTokens: 6000`, with **three** inner attempts plus the outer scoring-retry wrapper (`executeAgentWithRetry`). Output validates against [`schema/world_document.schema.yaml`](../../schema/world_document.schema.yaml).

The mechanics:

- The prompt ([`WORLD_BUILDER_SYSTEM`](../../packages/prompts-llm/src/agent65-world-builder.ts) + `buildWorldBuilderUserMessage`) dumps **every** upstream artifact — full CASE, character profiles, location profiles, temporal context, background context, locked facts, clue distribution — as pretty-printed JSON, then asks for one giant object: `storyTheme`, `historicalMoment`, `characterPortraits[]`, `characterVoiceSketches[]`, `locationRegisters[]`, `storyEmotionalArc`, a 12-position `humourPlacementMap`, `breakMoment`, `revealImplications`, and `validationConfirmations`.
- The output then runs the full house **GENERATE→PARSE→NORMALIZE→PAD→PATCH** gauntlet: `jsonrepair` before parse; `normalizeWorldDocumentStructure` rebuilds missing sub-objects from defaults; `sanitiseArrayOfObjects` strips stray strings the model appended to arrays; `completeHumourPlacementMap` *invents* any missing humour positions and fills empty rationales with boilerplate; and **`validationConfirmations` is force-set to all-`true`** before the gate that checks it (lines 976–984).
- Then the **length gates**: `arcDescription ≥ 200 words` (the `arc_description_gate`, +100 prompt buffer → 300 target), `storyTheme ≥ 25 words`, `revealImplications ≥ 90 words`, `eraRegister ≥ 150 words`. When the model falls short, deterministic expanders (`enforceArcDescriptionFloor`, `enforceStoryThemeFloor`, `enforceRevealImplicationsFloor`) **pad the text from turning-points and canned sentences** until the count passes — including three hardcoded `FALLBACK_PARAGRAPHS` of generic mystery-prose-about-mystery-prose.
- Downstream, [`agent7-run.ts`](../../apps/worker/src/jobs/agents/agent7-run.ts) runs `applyWorldFirstSceneEnrichment` (lines ~524–606), copying five fields onto each scene: `emotionalRegister`, `dominantCharacterNote`, `humourGuidance`, `eraTextureNote`, `locationRegisterNote`. [`agent9-run.ts`](../../apps/worker/src/jobs/agents/agent9-run.ts) passes the whole `worldDocument` into prose generation.
- The scorer [`packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts`](../../packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts) weights `validation 0.4 / quality 0.25 / completeness 0.25 / consistency 0.1`. The 0.4 "validation" block is the six `validationConfirmations` booleans — **the ones the runner already forced to `true`.** The "quality" block is dominated by `arcDescription word count (200–300w)` and `storyTheme ≥25 words`.

---

## 3. Where it hurts

**A. The quality gate measures length, and length rewards padding (the headline smell).** The single most load-bearing field, `arcDescription`, is gated on *word count* — a proxy that an LLM games by writing more, not better. Worse, when the model writes a tight, excellent 170-word arc, the pipeline doesn't reject it for a retry — it **pads it** with `enforceArcDescriptionFloor`, splicing in turning-point restatements and, failing that, three canned `FALLBACK_PARAGRAPHS` about how "every mystery carries a secondary arc beneath the whodunnit machinery." So the gate is satisfiable two ways: write 300 real words, or write 150 and let the deterministic padder finish the job with prose no human chose. Either way the gate passes. **A length floor cannot tell a good arc from a bloated one**, and the fallback guarantees that a *failing* output is silently converted into a *passing* one — the [PAD-masks-failure pattern](00_README.md) in its purest form: the artifact looks clean downstream and is partly machine-filler.

**B. The "quality" score is mostly a tautology.** 40% of the score is `validationConfirmations`, which the runner sets to all-`true` at line 982 *before* the scorer reads them. The model's self-assessment is overwritten with success and then scored as success. Combined with the length-proxy "quality" block, the headline number says almost nothing about whether the voice is actually distinct, the humour map actually sensible, or the arc actually usable. It's a [no-backstop gate](00_README.md) inverted: instead of killing a good run, it *passes* a hollow one.

**C. Tone arrives last, and only partially survives.** Voice is authored at step 90 — *after* the cast was named (Agent 2), profiled (2b), placed (2c), and after all the logic was built and proved. But voice should have shaped all of those. A character's `speechMannerisms` in 2b was written with no voice contract; 6.5 then writes `characterVoiceSketches` that must *retrofit* a voice onto a profile authored blind. And the rich thing 6.5 produces — three register fragments of *actual speech* per character, a full arc, a humour matrix — is consumed by Agent 7 as **five flattened strings per scene** (`emotionalRegister`, `dominantCharacterNote`, `humourGuidance`, `eraTextureNote`, `locationRegisterNote`). Most of the document's nuance is discarded at the first consumer. We pay 6,000 tokens to author a rich artifact and forward a postcard of it.

**D. Fragmented ownership of one truth.** Tone-ish concerns are scattered: era constraints in Agent 1, character voice mannerisms in 2b, location mood in 2c, period texture in 2d *and* here, scene register in 7, prose voice in 9. No single source of truth. Nothing guarantees the wry-comedy premise the user typed survives into the cast's mannerisms, the location moods, the humour map, and the prose. Each agent reinvents "what does this story feel like" from whatever upstream JSON it happens to receive. That's how you get a country-house romp whose victim's discovery scene reads like a different book.

**E. It's a patch, and it patches in the wrong place.** The `.5` and the late slot are the tell: 6.5 exists because prose felt soulless, so a "soul-injector" was bolted on right before prose. But soul isn't injectable late; it's a constraint that has to be *present while every creative decision is made*. Bolting it on at 90% means every decision from 1 through 6 was made without it.

---

## 4. Blue-sky redesign

**Verdict: split 6.5 into two things and move both off the critical late path.**

1. A **Style Contract** — a small, canonical, mostly-deterministic object created *at spec/grounding time* (right after Agent 1), threaded into every generative agent as a required input. This is the single source of truth for voice.
2. A thin **Prose-Conditioning Compiler** that replaces the late 6.5 call — it takes the (now-finished) logic plus the contract and emits **hard style constraints + exemplar passages** for Agent 9, scored on *usability*, not length.

### 4.1 The Style Contract — set once, threaded everywhere

A compact object, authored once and frozen, owned by no single mid-pipeline prompt:

```ts
interface StyleContract {
  // ── from the user's spec (or a one-shot "style agent" right after Agent 1) ──
  register: 'wry-comic' | 'cozy' | 'noir' | 'psychological' | 'classical-fair-play' | ...;
  comparables: string[];          // e.g. ["Sayers", "Marsh"] — voice anchors, not plagiarism targets
  narrativeDistance: 'close-third' | 'omniscient' | 'first-person';
  humourTolerance: 0 | 1 | 2 | 3; // global ceiling; per-scene map derives from this
  proseConstraints: {             // HARD, checkable
    sentenceRhythm: 'varied' | 'clipped' | 'periodic';
    forbiddenDevices: string[];   // e.g. ["modern idiom", "head-hopping", "purple metaphor"]
    diction: 'period-formal' | 'plain' | 'ornate';
  };
  exemplars: ExemplarPassage[];   // 2-4 short gold passages the prose agent is conditioned on
}
```

Two design moves matter here:

- **It's created at the top, not the bottom.** The contract is an *input* to Agent 2 (cast), 2b (profiles), 2c (locations), 7 (outline), and 9 (prose). A character's `speechMannerisms` are now written *knowing* the book is wry close-third — not retrofitted later. Location moods inherit the register. The humour map isn't authored in isolation in 6.5; it's *derived* from `humourTolerance` plus per-character `humourLevel` plus the arc.
- **Most of it is a choice, not a generation.** `register`, `narrativeDistance`, `humourTolerance`, `diction` are enums the *user* should be able to set at spec time — the same way they pick era and crime type. Where the user is silent, a single tiny "Style" pass right after grounding picks defaults from the premise. Either way it's cheap, early, and canonical. ("Build mysteries like an engineer builds proofs" applies to tone too: the voice is an *axiom* stated up front, not a theorem discovered at step 90.)

### 4.2 What's left of 6.5: a prose-conditioning compiler

The genuinely late-binding work — character voice fragments, the emotional arc against the *actual* outline, the reveal's retroactive map — still needs the finished logic. But it should produce **what the prose agent can actually use**, conditioned on the contract:

- **Hard style constraints** (checkable): forbidden-device list, diction band, per-scene humour permission (derived, then sanity-checked), season/era vocab (already owned by the temporal anchor — see the [2d redesign](05_agent_2d_temporal_context.md)).
- **Exemplar passages**, not descriptions of passages. Instead of "voiceDescription: dry, clipped, defensive when cornered," generate **2–3 lines of that character actually speaking** in the book's register — which 6.5 *already does* in `fragments[]`, except today they're buried in a document Agent 7 flattens away. Forward them to Agent 9 *as conditioning exemplars*, the highest-leverage form of voice control a modern model has.
- **The arc as a constraint the outliner consumes whole**, not five strings per scene. Agent 7 should receive the arc and humour map *structurally* and place beats against them, rather than getting `emotionalRegister` stamped onto each scene after the fact.

This is no longer a "World Document." It's a **compiled conditioning bundle**: constraints + exemplars, addressed to the prose model, derived from a contract that already governed everything upstream.

### 4.3 Replace the length gate with a usability signal

Delete `arc_description_gate` and friends. Delete the `FALLBACK_PARAGRAPHS` padders — if an output is too thin, that's a *retry signal*, not a thing to quietly fill with machine prose. Replace with checks that measure whether the output is **usable**:

| Today (length proxy) | Redesign (usability signal) |
|---|---|
| `arcDescription ≥ 200 words` | **Arc coverage**: does the arc reference every structural beat the outline will need (opening, each turn, climax, resolution) with a distinct emotional value? Pass/fail on *coverage*, not count. |
| `storyTheme ≥ 25 words` | **Theme is a claim, not a noun phrase**: parse for subject + predicate; reject titles/fragments structurally. Length is irrelevant if it's a sentence that asserts something. |
| `validationConfirmations` all true (force-set) | **Delete.** They're tautological. Replace with the deterministic checks they pretended to summarise (cast coverage, locked-fact preservation) run *for real*. |
| voice sketch present | **Voice distinctiveness**: an LLM-judge (or embedding-distance) check that character fragments are *mutually distinguishable* and consistent with each profile's `humourLevel`/`speechMannerisms`. A `humourStyle: "none"` character producing wit is a real failure a word count can't catch. |
| — | **Contract conformance**: do the exemplars obey `proseConstraints` (no forbidden devices, right diction band)? This is the check that actually protects the prose. |

A modern model (target Opus 4.8, 1M context, native structured output) is perfectly capable of being an **LLM-judge** for distinctiveness and contract-conformance — far more meaningful than `split(/\s+/).length`. The gate becomes "is this conditioning bundle good enough to write from," which is the question we actually care about.

### 4.4 Concrete example

User spec: *"wry country-house mystery, late-Sayers register, gentle humour, no gore."*

- **Today:** That intent is typed once and largely lost. Agent 2b writes mannerisms blind. At step 90, 6.5 ingests ~all artifacts as JSON, writes a `storyTheme`, a 300-word arc (or a 160-word one the padder finishes), a 12-row humour map (any missing rows machine-filled), and per-character `fragments` — then Agent 7 flattens it to five strings per scene and most of the voice work evaporates. The arc passes because it's 300 words; nobody checked whether the wry register actually reached the page.
- **Redesign:** `StyleContract = { register:'wry-comic', comparables:['Sayers'], narrativeDistance:'close-third', humourTolerance:2, diction:'period-formal', forbiddenDevices:['gore','modern idiom'], exemplars:[…] }` is fixed right after grounding. Agent 2 casts *toward* that register; 2b's mannerisms are written *in* it; 2c's location moods inherit it; the humour map is **derived** (tolerance 2 + per-character `humourLevel`, solemn positions still forbidden) rather than re-authored. The late compiler produces three lines of each suspect actually speaking in late-Sayers cadence, plus the arc as structured beats for the outliner, plus a forbidden-device list. The gate is: *are these voices mutually distinct, contract-conformant, and arc-complete?* — judged, not counted. If the model's wit leaks into a `humourStyle:"none"` character, that fails; a 170-word-but-excellent arc passes.

### 4.5 Where it lives

The contract should be a **first-class field on the CML case** (it governs creative decisions the way `constraint_space` governs logical ones), created at the spec/grounding boundary. The compiler can stay a discrete step where 6.5 sits today (it needs the finished logic) — but renamed and re-scoped as "prose conditioning," explicitly downstream-facing, and gated on usability. If we'd rather shed the agent entirely, the compiler folds into **Agent 9's own conditioning step**: 9 already receives the contract and the logic; it can compile its own exemplars on entry. My mild preference is to keep one thin compiler so Agent 7 also gets the structured arc/humour map — but either is defensible, and both kill the standalone "World Document."

---

## 5. Ripple effects on the rest of the pipeline

- **Agent 1 / grounding:** gains the one-shot Style pass (or simply reads the user's spec choices) and emits the `StyleContract` into CML. One small, cheap call — or zero, if the UI collects register/distance/humour at spec time.
- **Agent 2 / 2b / 2c:** take the contract as input. Cast, mannerisms, and location moods are authored *in voice* instead of blind. This is where the largest quality lift comes from — voice present *during* creation, not bolted on after.
- **Agent 7 (outliner):** stops receiving five flattened strings per scene. Receives the arc + humour map *structurally* and places beats against them. `applyWorldFirstSceneEnrichment` ([agent7-run.ts](../../apps/worker/src/jobs/agents/agent7-run.ts) ~524–606) is replaced by structured arc consumption, not field-stamping.
- **Agent 9 (prose):** conditioned on **exemplar passages + hard constraints**, the highest-leverage voice control available. The contract's `forbiddenDevices`/`diction` become checkable post-conditions, not vibes.
- **Schema:** `world_document.schema.yaml` shrinks dramatically. `validationConfirmations` is deleted (tautological). `storyTheme`/`arcDescription` lose their length minimums and gain structural checks. A new `style_contract.schema.yaml` is born at the CML layer.
- **Scoring:** the [6.5 scorer](../../packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts) drops the `validationConfirmations` 0.4 block and the word-count quality tests; adds distinctiveness + contract-conformance LLM-judge tests. `enforceArcDescriptionFloor` / `enforceStoryThemeFloor` / `enforceRevealImplicationsFloor` / `FALLBACK_PARAGRAPHS` are **deleted** — no more padding-to-pass.
- **Token churn:** the late call shrinks (no longer dumping every artifact to re-author voice from scratch; the contract did the heavy lifting upstream). One small early call appears. Net roughly flat tokens, far better placement.

---

## 6. How we'd know it worked

- **Voice-drift down.** Sample chapter openings across a book; measure register consistency (LLM-judge or embedding variance). The contract-threaded version should drift less than the bolt-on-at-90% version.
- **Character distinctiveness up.** Blind-attribution test: can a reader/judge assign dialogue lines to the right character above chance? Today's flattened five-strings predict *no*; exemplar-conditioned prose should beat it.
- **Padding goes to zero.** No `FALLBACK_PARAGRAPHS`, no deterministic arc expansion fires — because the gate is usability, not length. Telemetry: count how often the old expanders ran (it's the dominant single-attempt failure per the code's own comment); target zero in the redesign.
- **`humourStyle:"none"` violations caught.** Inject a test case where the contract/profile forbids wit; the distinctiveness/conformance judge must *fail* it. A word count never could.
- **Gate means something.** A deliberately bloated 350-word but generic arc should now *fail* coverage; a tight excellent 170-word arc should *pass*. Inverting today's behavior is the proof.
- **Spec-intent survival.** Set a distinctive premise ("wry, no gore"); trace it into cast mannerisms, location moods, humour map, and final prose. Today it's lost by step 90; the contract should make it traceable end-to-end.

---

## 7. Migration path

1. **Introduce the `StyleContract` as an additive field (no behavior change).** Derive it from existing signals (premise/theme/era) in one cheap pass after Agent 1; write it into CML. Nothing reads it yet. Ship.
2. **Thread it into the late 6.5 prompt first.** Have `buildWorldBuilderUserMessage` consume the contract as the governing voice input. Low-risk: 6.5 still runs, but now conditioned on a canonical voice instead of inferring one. Measure voice consistency before/after.
3. **Replace the length gates with usability checks.** Swap `arc_description_gate` + the floor-padders for coverage/structure/distinctiveness checks (LLM-judge). Delete `FALLBACK_PARAGRAPHS` and the deterministic expanders. Watch retry-rate and quality A/B.
4. **Thread the contract upstream.** Feed it into Agent 2/2b/2c so cast, mannerisms, and locations are authored in voice. This is the big quality move; do it once the contract is proven stable.
5. **Forward exemplars, not flattened strings.** Replace `applyWorldFirstSceneEnrichment`'s five-string stamping with structured arc/humour consumption in Agent 7, and exemplar-passage conditioning in Agent 9. Blind-compare prose voice.
6. **Re-scope or retire the late agent.** Rename 6.5 to the prose-conditioning compiler (or fold it into Agent 9's conditioning). Drop `validationConfirmations` from the schema and scorer. The "World Document" is gone; a contract plus a conditioning bundle remain.

Steps 1–3 are independently shippable and reversible; 1–2 are additive refactors that de-risk the rest. The order deliberately proves the contract *late* (cheap, safe) before threading it *early* (high-leverage, higher-blast-radius).

---

## 8. The pitch in one paragraph

Agent 6.5 spends 6,000 tokens, two-thirds of the way down the pipeline, to author a "World Document" whose most important field is gated on hitting 200 words — a length proxy an LLM games by writing more, and which the code *itself* pads from canned fallback paragraphs when the model writes a tight 160, so a failing arc is silently converted to a passing one; meanwhile 40% of its quality score is six `validationConfirmations` booleans the runner force-sets to `true` before scoring them. The deeper problem is the `.5`: voice was bolted on after the cast, locations, logic, and fair-play proof were all built *without* it, then flattened to five strings per scene at the first consumer. Fix the shape, not the gate: make tone a small canonical **Style Contract** the user signs at spec time and that threads into every generative agent, so cast mannerisms and location moods are authored *in voice* rather than retrofitted; reduce what's left of 6.5 to a thin compiler that emits **hard style constraints plus exemplar passages** for the prose model; and replace the word-count floor with a real usability signal — arc coverage, voice distinctiveness, contract conformance — judged by the model we already have, not counted by `split(/\s+/)`. One voice, owned once, threaded everywhere, with a gate that finally measures whether the prose will have a soul instead of whether one paragraph is long enough.

---

## 9. Implementation Plan

> Sections 1–8 argue the shape; this section turns it into an ordered, de-risked build that proves the Style Contract is worth threading *before* we pay the cost of threading it.

### 9.1 Validate the approach first (de-risking spikes)

The entire redesign rests on one unproven claim: **a small canonical Style Contract, threaded into prose conditioning, produces measurably more consistent voice than authoring a fat world-doc at step 90.** Prove that on one project before touching the pipeline shape.

- **Spike A — author one contract by hand.** Pick a live project with a distinctive premise (the "wry country-house, late-Sayers, no gore" archetype from §4.4). Hand-author a `StyleContract` object — `register`, `comparables`, `narrativeDistance`, `humourTolerance`, `proseConstraints`, and 2–4 `exemplars`. No code yet; just prove the schema is expressible and sufficient for *that* book. If I can't fill it without hand-waving, the schema is wrong.
- **Spike B — thread it into Agent 9 only.** Inject the contract into prose conditioning ([`agent9-run.ts`](../../apps/worker/src/jobs/agents/agent9-run.ts)) for a few chapters — exemplar passages plus `forbiddenDevices`/`diction` as hard constraints — *bypassing* `worldDocument` entirely for those chapters. This is the cheapest possible test of the high-leverage move.
- **Blind compare.** Generate the same chapters two ways: (1) today's path (full `worldDocument` → `applyWorldFirstSceneEnrichment` → five flattened strings → Agent 9), and (2) contract-conditioned. Blind-judge both for register consistency and forbidden-device leakage (LLM-judge, target Opus 4.8).
- **Falsification (kill the redesign here if true):** the contract-conditioned prose shows *no measurable voice gain* over the late world-doc path; **or** the contract is too vague to condition on — i.e. two competent humans author wildly different contracts from the same premise, so it isn't canonical. Either result means voice does not live in a small upstream object and §4's thesis is wrong. Better to learn that for the cost of one project than after threading five agents.

### 9.2 What gets built — and deleted (components & contracts)

| Build / Delete | What | Where |
|---|---|---|
| **BUILD** | `style_contract.schema.yaml` — the canonical voice artifact (§4.1 shape). Signed at the spec/grounding boundary, frozen, a first-class CML field. | `schema/style_contract.schema.yaml`; field on the CML case |
| **BUILD** | Style-signing pass — reads user spec choices (`register`/`narrativeDistance`/`humourTolerance` as enums) or, where silent, one tiny LLM pass after Agent 1 fills defaults from premise. P2 structured output, no free-text parsing. | grounding / post-Agent-1 |
| **BUILD** | Thin **conditioning compiler** replacing `generateWorldDocument`: consumes contract + finished logic, emits `{ hardConstraints, exemplars[], arc (structured), humourMap (derived) }`. No "document." P2 structured output. | `packages/prompts-llm/src/` (re-scoped from `agent65-world-builder.ts`) |
| **BUILD** | **Usability signal** replacing the word-count gate: arc-coverage check (every structural beat referenced with a distinct emotional value), theme-is-a-claim parse (subject+predicate, not a noun phrase), voice-distinctiveness LLM-judge (fragments mutually distinguishable, consistent with each profile's `humourLevel`/`humourStyle`), contract-conformance LLM-judge (exemplars obey `proseConstraints`). | `packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts` |
| **BUILD** | Contract→agent consumption interface: a single typed accessor every generative agent calls to read the frozen contract from CML (so no agent re-derives voice from raw upstream JSON). | shared types in `packages/prompts-llm/src/` |
| **DELETE** | `FALLBACK_PARAGRAPHS` (the 3 canned mystery-about-mystery paragraphs) + `enforceArcDescriptionFloor` + `enforceStoryThemeFloor` + `enforceRevealImplicationsFloor`. These are the PAD-masks-failure machinery: they silently convert a failing arc into a passing one. | [`agent65-world-builder.ts`](../../packages/prompts-llm/src/agent65-world-builder.ts) lines ~443–519, ~129–215, and the exports at ~1085–1089 |
| **DELETE** | The 200-word `arc_description_gate` floor (and its +100 prompt buffer / `getArcDescParams`), the `storyTheme ≥25` floor, the `revealImplications ≥90`/`eraRegister ≥150` floors. Replaced by structural checks in row 4 above. | [`agent65-world-builder.ts`](../../packages/prompts-llm/src/agent65-world-builder.ts) ~217–220; [`generation-params.yaml`](../../apps/worker/config/generation-params.yaml) `quality` block |
| **DELETE** | The force-set `validationConfirmations` loop (`for (const key of confirmKeys) … = true`) and its tautological 0.4 scorer block. The runner sets all six booleans to `true` at lines 973–984 *before* the gate and the scorer read them — self-assessment overwritten with success, then scored as success. Replace with the deterministic checks they pretended to summarise (cast coverage, locked-fact preservation), run for real. | [`agent65-world-builder.ts`](../../packages/prompts-llm/src/agent65-world-builder.ts) lines 973–984; the 6.5 scorer's `validation` weight |
| **DELETE** | `applyWorldFirstSceneEnrichment`'s five-string stamping (`emotionalRegister`, `dominantCharacterNote`, `humourGuidance`, `eraTextureNote`, `locationRegisterNote`) onto every scene. Replaced by structured arc/humour-map consumption in Agent 7. | [`agent7-run.ts`](../../apps/worker/src/jobs/agents/agent7-run.ts) lines 532–608, call site 1313–1320 |

The contract→agent interface is the keystone of the build: one frozen object, one typed read, no re-derivation. Everything else hangs off it.

### 9.3 Dependencies & sequencing

The Style Contract is an **upstream contract, not a late doc** — so the dependency graph runs spec→down, and the order below respects it. KEYSTONE **Agent 3** is logic and is *unaffected*, but the contract rides alongside the CML it produces, so 3 must carry the field through untouched.

1. **Phase 0 — sign the contract (spec/grounding).** Land `style_contract.schema.yaml`, the signing pass, and the typed accessor. Additive: written into CML, read by nobody. Verify Agent 3 carries it through. *(Shared platform: P2 structured output for the signing pass.)*
2. **Phase 1 — prove it late (Agent 9 first).** Thread the contract into Agent 9 prose conditioning (the §9.1 spike, productised). Lowest blast radius, highest leverage — exemplars + hard constraints are where voice actually reaches the page.
3. **Phase 2 — swap the gate.** Replace the length floors + padders with the usability signal (§9.2 row 4) and delete the force-set `validationConfirmations`. Independently shippable; watch retry-rate and the A/B.
4. **Phase 3 — thread upstream into authoring (2 → 2b → 2c → 7).** Feed the contract into Agent 2 (cast voiced *toward* register), 2b (Voice Capsule authored to *conform* to the contract, not retrofitted), 2c (location mood inherits register), 7 (scene register + structured arc consumption replacing `applyWorldFirstSceneEnrichment`). This is the big quality move and the big blast radius — do it only once the contract is proven stable in Phases 1–2.
5. **Phase 4 — retire the doc.** Re-scope 6.5 to the thin compiler (or fold into Agent 9's conditioning); shrink `world_document.schema.yaml`; drop `validationConfirmations` from schema and scorer.

**First increment:** Phase 0 + the Phase-1 Agent-9 thread on a flag — the smallest end-to-end slice that exercises the whole thesis (sign → read → condition → judge) on one project without deleting anything yet.

### 9.4 Test & validation strategy

Tests assert *voice*, never *length*. The word count is gone, so the test suite is what guarantees quality.

- **Voice-distinctiveness as a test.** Golden fixture: a cast with one `humourStyle:"none"` character. The distinctiveness judge must *fail* output where wit leaks into that character — a regression a word count could never catch. (P4 golden replay harness.)
- **Contract-conformance as a test.** Fixture contract with `forbiddenDevices:['modern idiom','gore']`; assert the conformance judge fails exemplars/prose that violate them. Assert it passes a clean tight 170-word arc and *fails* a bloated generic 350-word one — inverting today's behavior is the proof the gate now means something.
- **Arc-coverage as a test.** Assert pass/fail on whether the arc references every structural beat the outline needs, independent of length.
- **Invariant (the load-bearing one):** *every generative agent receives the same frozen contract.* Add a check that the contract object read by Agents 2, 2b, 2c, 7, and 9 is byte-identical to the one signed at grounding — no agent mutates or re-derives it. If this invariant breaks, we're back to fragmented ownership (§3.D).
- **A/B voice consistency on canary.** P4 canary replay: contract-threaded vs late-world-doc, sample chapter openings across a book, measure register variance (LLM-judge / embedding distance). Contract path must drift less.
- **Padding-goes-to-zero telemetry.** Counter on the old expanders during migration; target zero firings, then delete. (Today's code comment calls the floor the *dominant* single-attempt failure cause — that's the number to drive to zero.)

### 9.5 Rollout & rollback

- **Flag:** `STYLE_CONTRACT_CONDITIONING` (off by default). On → Agent 9 conditions on the contract and the usability gate is live; off → today's `worldDocument` + `applyWorldFirstSceneEnrichment` + length gate.
- **Shadow run:** for canary projects, run contract-threaded conditioning *alongside* the late-world-doc path and log both gate decisions + a blind voice-consistency score, serving the old path. Promotes confidence without risking output.
- **Kill criteria:** flip off if (a) §9.1 falsification holds on real projects — no voice gain; (b) the usability judge is flakier than the (admittedly bad) word gate — i.e. non-determinism causes spurious retries above the old floor-fire rate; or (c) the same-contract invariant (§9.4) can't be held because an upstream agent needs to mutate voice mid-pipeline (which would mean the contract isn't actually canonical).
- **Reversibility:** Phases 0–2 are additive/flagged and fully reversible. Phase 3 (upstream threading) is the point of no easy return — gate it on Phases 1–2 holding green on canary for a sustained window before deleting `applyWorldFirstSceneEnrichment`.

### 9.6 Open questions to resolve before coding

- **How does the user express the contract?** Enums in the spec UI (`register`/`narrativeDistance`/`humourTolerance` picked like era/crime-type), free-text premise the signing pass parses, or both? This decides whether Phase 0 is mostly UI or mostly LLM. My lean: enums for the structured fields, one tiny pass to derive defaults + exemplars where the user is silent.
- **Exemplar sourcing and licensing.** The exemplars are the highest-leverage control *and* the legal sharp edge. Are they (a) model-generated *in* the target register (safe, but is generated-gold good enough?), (b) excerpts from `comparables` authors (licensing/plagiarism risk — `comparables` are *anchors, not targets*), or (c) the project's own earlier accepted chapters (clean, but cold-start has none)? Resolve before the compiler ships, because it hard-codes the source.
- **How prescriptive can the constraints be without flattening prose?** `forbiddenDevices` and a `diction` band protect voice, but an over-tight contract produces uniform, lifeless prose — the opposite failure from drift. Need a calibration pass: how many forbidden devices / how narrow a diction band before distinctiveness *drops*. The conformance judge must reward *consistency*, not *sameness*.

### 9.7 "Ready to build" checklist

- [ ] §9.1 spike run on one real project; blind-compare shows a measurable voice gain over the late world-doc path (falsification not triggered).
- [ ] `style_contract.schema.yaml` drafted and proven expressible by hand for ≥2 distinct premises (Spike A).
- [ ] Decided how the user expresses the contract (§9.6) — enums vs. derived.
- [ ] Decided exemplar sourcing + cleared licensing (§9.6).
- [ ] Typed contract accessor designed; same-contract invariant test (§9.4) specced.
- [ ] Usability-judge prompts (distinctiveness + conformance + arc-coverage) drafted with golden pass/fail fixtures, including the `humourStyle:"none"`-leak case.
- [ ] `STYLE_CONTRACT_CONDITIONING` flag + shadow-run logging wired.

**FIRST task / PR:** *Spec the `style_contract.schema.yaml` and wire it into Agent 9 prose conditioning behind `STYLE_CONTRACT_CONDITIONING`* — Phase 0 + the Phase-1 Agent-9 thread, with the §9.1 blind-compare as its acceptance test. Nothing is deleted in this PR; the floors, padders, force-set `validationConfirmations`, and `applyWorldFirstSceneEnrichment` come out only after the contract path proves itself on canary.
