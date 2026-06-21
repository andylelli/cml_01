# Agent 2c — Location Profiles: A Ground-Up Redesign

> Stop building a combinatorial sensory bible the night before we know the building. Generate a tight location spine eagerly, and texture each scene's senses just-in-time — in that scene's own time-and-weather — at the moment prose is written.

I'm Claude. This is my blue-sky redesign of Agent 2c, the agent that today produces the "location bible": a primary location, a handful of key locations each carrying deeply nested `sensoryDetails` plus optional `sensoryVariants` per time-of-day × weather, narrative paragraphs everywhere, and a global `atmosphere` block. I've read the runner ([agent2c-run.ts](../../apps/worker/src/jobs/agents/agent2c-run.ts)), the builder ([agent2c-location-profiles.ts](../../packages/prompts-llm/src/agent2c-location-profiles.ts)), the schema ([location_profiles.schema.yaml](../../schema/location_profiles.schema.yaml)), and — crucially — the *only* consumer that matters, the prose agent's [buildLocationProfilesBlock](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts).

---

## 1. The job to be done

A whodunit's prose needs two distinct things from "location," and today's agent conflates them:

1. **A stable spine.** A short, canonical list of *which physical places exist*, what each is *for* in the mystery (crime scene, clue site, gathering room, escape route), who can *access* each and when, and the geographic anchor (place + country + era). This is **logic-adjacent** — sightlines, locked doors, isolation, who-was-where — and it must be consistent across every chapter and reconcilable with the CML. It belongs to the structured model.

2. **Per-scene sensory texture.** At the moment the prose agent writes Chapter 7 — set in the library, at night, in rain, from Inspector Vane's POV — it needs 3-4 concrete, period-grounded, character-observable sensory atoms *for that exact context*. Night-rain-library is a different palette from afternoon-clear-library. This is **just-in-time, ephemeral, scene-local** texture.

The job to be done is *not* "write an exhaustive multi-sensory encyclopedia of every place the story might visit." Nobody reads the encyclopedia. The prose agent literally takes `slice(0, 3)` of locations and `slice(0, 3)` of each sense ([prompt-blocks.ts L314-321](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts)), then it picks *one* variant per chapter and discards the rest. We are paying to generate a library that's read three sentences at a time.

So the real job splits cleanly: **own the spine eagerly; texture lazily.**

---

## 2. How it works today

Agent 2c runs at orchestrator [line 731](../../apps/worker/src/jobs/mystery-orchestrator.ts) — immediately after character profiles, long before the world doc (line 926), the outliner (line 955), and prose (line 975). Its `narrative` input is declared optional precisely because, in the real pipeline order, **it is always absent.** The builder's scene-location extraction ([agent2c-location-profiles.ts L107-119](../../packages/prompts-llm/src/agent2c-location-profiles.ts)) runs against an empty array every time, so `uniqueLocations` is empty and the prompt falls back to "invent context-appropriate sub-locations." The agent is guessing which rooms the story will use, blind.

It produces, in one LLM call:

- `primary` — name, type, place, country, summary, visualDescription, atmosphere, 3-5 paragraphs.
- `keyLocations[]` — ≥4 objects, each with `visualDetails`, four `sensoryDetails` arrays (≥4 atoms each, enforced by an F30-5 minimum), an `accessControl` string, 2 narrative paragraphs, and 3-4 `sensoryVariants` (each a full time/weather/mood palette of its own).
- `atmosphere` — a global block with `eraMarkers`, `sensoryPalette`, paragraphs.

Then it's wrapped in defensive scaffolding that tells the whole story:

- **Truncation band-aid.** The developer prompt screams "write `atmosphere` BEFORE `keyLocations` so it is never truncated" ([L175-178](../../packages/prompts-llm/src/agent2c-location-profiles.ts)), and config raised `max_tokens` 4500→8000 with the comment *"atmosphere block at end of JSON was being truncated"* ([generation-params.yaml L50](../../apps/worker/config/generation-params.yaml)). We are reordering JSON keys and doubling the token budget to survive a payload that's too big.
- **Truncation guards.** The runner re-checks the atmosphere object field-by-field and throws bespoke retry errors ([L403-434](../../packages/prompts-llm/src/agent2c-location-profiles.ts)) — an entire error-message taxonomy whose only purpose is to detect cut-off output.
- **Deterministic mutation after the LLM.** `compileSensoryAtoms` strips sentences down to noun phrases with a regex ([phrase-analysis.ts L235-289](../../packages/prompts-llm/src/agent9-prose/phrase-analysis.ts)), and `enforceLocationSensoryFallbacks` injects canned phrases like *"shadowed corners in the room"* when an array is thin ([agent2c-run.ts L55-101](../../apps/worker/src/jobs/agents/agent2c-run.ts)). Neither re-validates against the scorer afterward — exactly the cross-cutting "post-LLM mutation without re-validation" failure mode.
- **F5a/F5b noun-phrase war.** Multiple prompt rules, a `CONJUGATED_VERB_RE` regex, post-hoc bleed warnings — all fighting to keep `sensoryDetails` from becoming full sentences that get copied verbatim into prose.

So today's agent spends most of its complexity budget defending against its own output strategy.

---

## 3. Where it hurts

- **Eager, blind, exhaustive.** It generates rich detail for locations it's *guessing at*, because it runs before the outliner. Locations that barely appear (or never appear) get the same ≥4-atoms-per-sense, 3-4-variants treatment as the crime scene.
- **Combinatorial waste.** `sensoryVariants` is a time × weather grid pre-computed for every key location. With 4 locations × 3-4 variants × 3 sense arrays, that's the bulk of the tokens — and the prose agent uses exactly **one variant per chapter per location** ([prompt-blocks.ts L347-366](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts)). Most variants are generated, validated, mutated, and thrown away.
- **Truncation is structural, not incidental.** A big nested JSON with the most-required block (`atmosphere`) historically last *will* clip under load. Key-reordering and an 8000-token ceiling treat the symptom. The disease is "one giant document."
- **The consumer wants almost none of it.** `buildLocationProfilesBlock` discards every `paragraphs` array via `stripLocationParagraphs` ([prompt-blocks.ts L100-115](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts)). So the agent writes 2-3 narrative paragraphs per location plus 2-3 for primary plus 2-3 for atmosphere — and the only downstream reader throws them all away. Pure token churn.
- **Texture is decoupled from the scene that needs it.** The variant the prose agent picks comes from a fuzzy string match between a scene's `setting.location` and a key location's `id`/`name`, then `selectSensoryVariant` does priority matching with anti-repeat ([phrase-analysis.ts L202-223](../../packages/prompts-llm/src/agent9-prose/phrase-analysis.ts)). If the match misses, the scene gets generic global palette. We pre-generated specificity and then risk not delivering it.
- **No re-validation after mutation.** The grounding-lead fallbacks and sentence-stripping run *after* the scorer, so what ships can differ from what passed.

---

## 4. Blue-sky redesign

I'd split Agent 2c into **2c-Spine (eager, structured, tiny)** and **2c-Texture (lazy, per-scene, generated at prose time)**. The current monolith dies.

### 4.1 The Location Spine — generated eagerly, kept tiny

A single small artifact the spine owns, produced right where 2c is today (it needs only setting + CML, which exist). Per location:

```json
{
  "id": "library",
  "name": "The West Library",
  "type": "interior",
  "purpose": "clue_site",
  "access": "Locked after dinner; key held by the butler; family access by day",
  "layout": "Two doors (hall + servants' passage); tall casement to the terrace; gallery overlooks the floor",
  "fixedTraits": ["dark oak panelling", "gas sconces", "rain-prone north casement"],
  "baselinePalette": {
    "dominant": "cold beeswax and old paper",
    "tags": ["hushed", "shadowed", "wood-smoke"]
  }
}
```

That's it. No four-array sensory matrix, no variant grid, no narrative paragraphs, no global atmosphere block carrying paragraphs nobody reads. The spine is:

- **Logic-bearing fields only** (`access`, `layout`, `purpose`, sightlines/isolation) plus a one-line geographic anchor and **3-5 `fixedTraits`** — the invariant nouns that must stay consistent across every chapter (the oak, the sconces, the casement).
- **A `baselinePalette`** — one dominant impression + a few tag words. This is the *seed* for lazy texture, not the texture itself.

It's small enough to never truncate, small enough to fit a tool-call / structured-output schema, and small enough that a human can eyeball it. The whole "write atmosphere first so it isn't clipped" hack evaporates because there is no long tail to clip.

### 4.2 Use constrained decoding, not text-JSON-then-repair

Target is Opus 4.8 with tool use and structured outputs. I'd define the spine as a **tool schema** and let the model fill it via a forced tool call. That deletes, in one move: `jsonrepair`, the JSON.parse/repair dance, the bespoke `atmosphere`-missing error taxonomy, the key-ordering instruction, and the truncation guards. A schema-constrained tool call can't emit a missing required field or a half-written object. The 8000-token ceiling drops back toward 1500-2000 because the payload is genuinely small.

### 4.3 Texture lazily — at the moment prose writes a scene

Here's the core inversion. **The prose agent already knows the scene's exact context** — location, `timeOfDay`, `weather`, POV character, mood — because the outliner produced `scene.setting` ([agent7-narrative.ts L189-191](../../packages/prompts-llm/src/agent7-narrative.ts)). So texture should be generated *there*, *then*, for *that* context only.

Two ways to deliver it, in order of preference:

**(a) Inline, in the prose call itself.** Instead of pre-baking 12 variants, I pass the prose agent the location's `baselinePalette` + `fixedTraits` and a single instruction: *"Before writing, derive 3-4 fresh sensory atoms for THIS scene's time-of-day and weather, consistent with the dominant palette and fixed traits, then write them as things the POV character observes — never as facts about the room."* Opus is more than capable of generating night-rain-library texture on the fly from a seed; that's exactly what the prose model does best. Zero variants pre-generated, zero thrown away, and the texture is *guaranteed* matched to the scene because it was born from the scene.

**(b) A thin just-in-time texture pass** (if we want texture decoupled from prose for caching/reuse). A tiny per-(location, timeOfDay, weather) call that returns one palette of 3-4 atoms per sense — generated only for the (location × context) pairs the outline *actually uses*, deduped. If three chapters all use library-night-rain, we generate it once and cache. This is the "texture on demand" model: we only ever pay for context combinations the story really visits, which the upfront bible can't know.

Either way the win is the same: **we stop generating the Cartesian product and start generating the realized set.** A 15-chapter story might touch 6 distinct (location, time, weather) combinations — not 4 locations × 4 times × 3 weathers = 48.

### 4.4 Killing truncation by changing the output strategy

Truncation today is a property of *one large response*. The redesign attacks it three ways at once:

1. **The eager artifact shrinks ~5×** (spine only, no sensory matrix, no paragraphs, no variant grid) — it stops being big enough to clip.
2. **Constrained/tool output** can't produce a structurally-truncated object; the field is either present and well-formed or the call retries cleanly.
3. **Texture is many tiny calls (or inline)** instead of one giant one — each is comfortably inside budget, and a clip in one scene's texture degrades that scene, not the whole bible.

Truncation and waste are the *same* bug — "generate everything upfront in one block" — so one fix kills both.

### 4.5 What the prose agent actually needs at the moment it writes a scene

From reading [buildLocationProfilesBlock](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts), the prose agent's real appetite per scene is small and specific:

- The **location's name + purpose + access/layout** (for grounding and logic) — from the spine.
- **3-4 sensory atoms matched to this scene's time/weather** — from lazy texture.
- The **dominant palette / tag words** as a tonal cue — from `baselinePalette`.
- A handful of **era markers** — these should come from Agent 1/2d, not be re-minted here (see §5).

It needs *none* of: the per-location narrative paragraphs (stripped), the global `atmosphere.paragraphs` (stripped), the 3-4 pre-baked variants beyond the one it picks, or the redundant `eraMarkers` that overlap Agent 1's era data. The redesign hands the prose agent exactly its appetite and nothing else.

### 4.6 Concrete before/after

**Before (today):** one ~8000-token call → primary (4 paras) + 4 keyLocations (16 sensory arrays + 12-16 variant sub-palettes + 8 paras) + atmosphere (2 paras + palette) → `jsonrepair` → schema validate → `compileSensoryAtoms` regex-strip → `enforceLocationSensoryFallbacks` canned-phrase injection → no re-validation. Prose then uses `slice(0,3)` of three of those locations.

**After:**
- *Eager:* one ~1500-token tool call → spine of N locations (logic fields + 3-5 fixedTraits + baselinePalette each). Validates by construction.
- *Lazy (at prose time):* for Chapter 7 (library/night/rain), the prose prompt receives `library` spine + baselinePalette and is instructed to mint 3-4 observed atoms for night-rain. No variant grid existed to throw away.

---

## 5. Ripple effects on the rest of the pipeline

- **Schema & artifact.** `location_profiles.schema.yaml` shrinks dramatically: `sensoryDetails`, `sensoryVariants`, and the per-location/global `paragraphs` arrays come out; `fixedTraits` + `baselinePalette` + `layout` go in. A migration shim can keep emitting an empty `keyLocations[].sensoryDetails` for one release so downstream readers don't NPE.
- **Agent 9 (prose).** `buildLocationProfilesBlock` simplifies: it stops doing fuzzy variant-matching and `selectSensoryVariant` rotation, and instead injects spine + baseline + a "derive texture now" instruction. `selectSensoryVariant` and the `lastUsedSensoryVariant` anti-repeat bookkeeping can retire. `stripLocationParagraphs` becomes a no-op (nothing to strip). The F5a/F5b noun-phrase war moves to prose-time generation where atoms are produced fresh and observed, so they never were sentences to begin with.
- **`compileSensoryAtoms` & `enforceLocationSensoryFallbacks`** — both deletable. They exist only to clean up the big upfront sensory dump. No dump, no cleanup, no post-mutation-without-revalidation hazard.
- **Agent 6.5 (world doc)** reads `ctx.locationProfiles` ([agent65-run.ts L31, L73](../../apps/worker/src/jobs/agents/agent65-run.ts)). It now reads the spine — *better* input, because the spine is the canonical place-and-access list it actually wants for world coherence, minus the sensory noise.
- **Ordering insight.** Because texture is lazy, the "2c runs before the outliner so it can't know which locations are used" problem *dissolves* — texture is generated *after* the outliner, by construction, since it's generated at prose time. The eager spine genuinely can run early (it only needs setting + CML). We get early-spine + late-texture without reordering the pipeline.
- **Era markers** should be sourced once (Agent 1 / 2d) and referenced, not re-generated in 2c — removes a class of anachronism-drift between the two era lists.
- **Cost/latency.** Eager call shrinks ~5×. Lazy texture adds small calls only for realized (location × context) pairs, cached/deduped — net token spend drops because we stop generating the unused 80% of the variant grid. If texture is inlined into the prose call (option a), the *added* call count is zero.

---

## 6. How we'd know it worked

- **Truncation rate → ~0.** The atmosphere-missing retry path ([agent2c-location-profiles.ts L403-434](../../packages/prompts-llm/src/agent2c-location-profiles.ts)) should stop firing entirely. Track its hit count; target zero.
- **Eager token count drops ~5×** and `max_tokens` can be lowered from 8000 back to ~2000 without raising retries.
- **Variant-waste metric goes to zero.** Today: (variants generated) vs (variants used). After: nothing pre-generated is unused, because texture is generated on demand for realized contexts only.
- **Sensory-context match rate → 100%.** Today some scenes fall back to generic global palette when the fuzzy variant match misses. Lazy texture is always scene-matched by construction; log and confirm no fallbacks.
- **Fewer deterministic fallback insertions.** The `enforceLocationSensoryFallbacks` warning count ([agent2c-run.ts L94-98](../../apps/worker/src/jobs/agents/agent2c-run.ts)) should trend to zero, then the function is deleted.
- **Prose quality holds or improves.** A/B the location/sensory sub-scores from `LocationProfilesScorer` and prose sensory-richness gates between old bible and new spine+lazy texture. Hypothesis: equal-or-better, because texture is freshly observed per scene instead of recycled from a stale grid.
- **No post-mutation drift.** With `compileSensoryAtoms` gone, "what passed the scorer" and "what shipped to prose" are identical — verifiable by checksum.

---

## 7. Migration path

1. **Add the spine alongside the bible (non-breaking).** Introduce `2c-Spine` producing `locationSpine` into `ctx`, while the existing 2c still runs. Wire the world doc and prose to *prefer* the spine when present, fall back to the bible. Ship dark.
2. **Move texture to prose-time (option a).** In `buildLocationProfilesBlock`, when a spine + baseline exist, inject the "derive texture now" instruction instead of reading pre-baked variants. Gate behind a flag; A/B sensory scores.
3. **Switch eager generation to a tool/structured call.** Replace the text-JSON-then-`jsonrepair` path with a forced tool call against the spine schema. Delete the atmosphere truncation guards and key-ordering prompt text as they go green.
4. **Retire the bible.** Once spine+lazy meets quality bars across a batch, stop generating `sensoryDetails`/`sensoryVariants`/`paragraphs`. Delete `compileSensoryAtoms`, `enforceLocationSensoryFallbacks`, `selectSensoryVariant`, and the F5b bleed warnings. Shrink the schema; lower `max_tokens`.
5. **(Optional) Promote spine logic fields into CML.** `access`, `layout`, `purpose`, sightlines are logic-adjacent; long-term they may belong in the CML location model so validation/fair-play can reason over them directly, with the spine becoming a projection rather than a separate artifact.

Each step is independently shippable and reversible behind a flag — no big-bang rewrite.

---

## 8. The pitch in one paragraph

Agent 2c today generates an exhaustive, combinatorial location bible — four sense-arrays and a time×weather variant grid per location, plus paragraphs nobody reads — blind, before the outliner exists, in one giant JSON whose final `atmosphere` block we keep having to rescue from truncation by reordering keys and doubling the token budget. The prose agent uses a tiny sliced fraction of it and throws the rest away. I'd split it: own a **tiny eager Location Spine** (logic fields, fixed traits, one baseline palette per place) produced via a constrained tool call that can't truncate, and generate **sensory texture lazily at prose time**, fresh, for the exact (location × time × weather) the scene actually uses — killing truncation and combinatorial waste with the same cut, because they were always the same bug: generating everything upfront in one block.

---

## 9. Implementation Plan

> Turning the split — eager spine, lazy texture — into an ordered, de-risked, flag-gated build that an AI agent can start tomorrow without guessing.

### 9.1 Validate the approach first (de-risking spikes)

Before deleting a single line, I want one number that proves the core bet: **lazy per-scene texture is at least as good as the upfront bible, at a fraction of the cost.** The whole redesign rests on "Opus mints night-rain-library texture on demand from a `baselinePalette` seed better than we pre-bake it." If that's false, I keep the bible. So spike it.

- **Spike A — Texture-from-seed bake-off (the falsifiable one).** Pick one canary run with a stored `location_profiles` artifact. For its 3-4 most-used locations, take the existing pre-baked `sensoryVariants` (today's output) as the control. Then feed Opus only the proposed spine seed (`baselinePalette` + `fixedTraits` + the scene's `timeOfDay`/`weather`/POV) and have it mint 3-4 fresh atoms. Score both with `LocationProfilesScorer` ([packages/story-validation](../../packages/story-validation)) and the Agent 9 sensory-richness gate. **Falsification:** if lazy texture scores materially below the bible on a 5-run sample, the inline-texture bet (§4.3a) is dead and I fall back to the decoupled cached pass (§4.3b) or stop. I expect lazy to win on *match rate* (it's born from the scene) and tie on richness.
- **Spike B — Constrained spine fits & can't truncate.** Define the spine tool schema (§9.2) and force a tool call on 5 settings. Confirm the payload lands at ~1500-2000 tokens with zero `jsonrepair` invocations and zero atmosphere-missing retries. This proves §4.2 mechanically.
- **Spike C — Realized-set vs Cartesian-product count.** Parse 3 stored Agent 7 outlines; count the *distinct* (location × timeOfDay × weather) tuples each story actually uses. Confirm it's ~6-10, not the 48 the variant grid implies. This sizes the lazy-texture cost ceiling and is pure read-only analysis.

Spikes A and C touch no production path; B is throwaway. None ships. Gate: all three green before Phase 1.

### 9.2 What gets built — and deleted (components & contracts)

**Built — `LocationSpine` type + tool schema.** A new tiny artifact, shape exactly as §4.1: per location `{ id, name, type, purpose, access, layout, fixedTraits[3-5], baselinePalette{dominant, tags[]} }` plus a one-line geographic anchor at the top. Defined as a **forced tool-call schema** (shared platform P2) so it validates by construction. Lives alongside today's builder in [packages/prompts-llm/src/](../../packages/prompts-llm/src/) as `agent2c-location-spine.ts`; new schema `schema/location_spine.schema.yaml`.

**Built — prose-time texture generator + its Agent 9 hook.** This is the load-bearing dependency on the **Agent 9 redesign**. Per §4.3a (preferred), it's an *instruction injected into the prose prompt*, not a separate call: in [buildLocationProfilesBlock](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts) I emit the matched location's spine + `baselinePalette` and a directive to derive 3-4 observed atoms for this scene's `timeOfDay`/`weather`. The hook point is Agent 9's prose-time prompt assembly — so this work **cannot land before the Agent 9 redesign exposes that hook** (see [09_agent_9](./09_agent_9_prose.md) prose-time generation). Option §4.3b (a thin cached per-(location,time,weather) pass keyed on realized tuples) is the fallback if Spike A says inline is too lossy.

**Deleted — with real paths:**

| Delete | Path | Why it can go |
|---|---|---|
| `compileSensoryAtoms` | [packages/prompts-llm/src/agent9-prose/phrase-analysis.ts L235-289](../../packages/prompts-llm/src/agent9-prose/phrase-analysis.ts) | Exists only to regex-strip the upfront sensory dump |
| `enforceLocationSensoryFallbacks` + `DEFAULT_SENSORY_FALLBACKS` + `buildLocationFallback` | [apps/worker/src/jobs/agents/agent2c-run.ts L21-101, L162](../../apps/worker/src/jobs/agents/agent2c-run.ts) | Canned-phrase injection post-scorer; no dump to backfill |
| `selectSensoryVariant` + `lastUsedSensoryVariant` anti-repeat | [packages/prompts-llm/src/agent9-prose/phrase-analysis.ts L202-223](../../packages/prompts-llm/src/agent9-prose/phrase-analysis.ts) | No variant grid to rotate through |
| F5b bleed warnings + `CONJUGATED_VERB_RE` | [apps/worker/src/jobs/agents/agent2c-run.ts L19, L171-196](../../apps/worker/src/jobs/agents/agent2c-run.ts) | Atoms are minted observed at prose time — never sentences to strip |
| `sensoryDetails`, `sensoryVariants`, per-location & global `paragraphs` | [schema/location_profiles.schema.yaml](../../schema/location_profiles.schema.yaml) | Replaced by spine fields |
| atmosphere-truncation guards + key-ordering prompt text | [packages/prompts-llm/src/agent2c-location-profiles.ts L175-178, L403-434](../../packages/prompts-llm/src/agent2c-location-profiles.ts) | Payload no longer big enough to clip |
| `max_tokens: 8000` → ~2000 | [apps/worker/config/generation-params.yaml L50](../../apps/worker/config/generation-params.yaml) | Spine is ~1500 tokens |

**I/O contract (the spine):**

- *In:* `ctx.setting.setting`, `ctx.cml` (the CML core from Agent 3 — locations, access, who-was-where). **No `narrative`** — the spine genuinely doesn't need the outline, which is why it can stay early.
- *Out:* `ctx.locationSpine` — array of N spine objects + anchor. Replaces `ctx.locationProfiles` once the bible retires.
- *Consumers:* Agent 6.5 world doc ([agent65-run.ts L31, L73](../../apps/worker/src/jobs/agents/agent65-run.ts)) reads spine instead of bible; Agent 9 prose reads spine + mints texture.

**Live option (from the dependency map):** the spine half is a candidate to **merge into a single "Prose Brief"** alongside 2b (Voice Capsule) and the TemporalAnchor (ex-2d). If that merge lands, `LocationSpine` becomes a *section* of the Prose Brief artifact rather than a standalone — I'd build it standalone first (smaller blast radius) and fold it in only after both are green.

### 9.3 Dependencies & sequencing

**Shared platform:** needs **P2 (constrained-decoding/structured-output)** for the spine tool call — this is the truncation kill and is a hard prerequisite for Phase 3. **P3 (validation-gated mutation)** matters because deleting `compileSensoryAtoms`/`enforceLocationSensoryFallbacks` removes the post-scorer mutation entirely (the cleanest way to satisfy P3 is to have nothing to re-validate). **P1 (typed CML core)** is the long-term home for spine logic fields (§7 step 5). **P4 (golden/canary replay)** backs the bake-off and the rollout gates.

**Cross-agent (keystone-first):**
- **Agent 3 (KEYSTONE)** must land first — the spine's `access`/`layout`/`purpose` reconcile against the typed CML location model. Spine is downstream of CML.
- **Agent 7 outline** is what finally tells texture *which* (location × context) tuples are real — but only the **lazy** half consumes it, and it consumes it *implicitly* (at prose time, post-outline). The eager spine needs nothing from 7. This is the ordering knot dissolving by construction.
- **Agent 9 prose-time hook** is the hard dependency for the texture generator — I can't inject "derive texture now" until Agent 9's redesign gives me the prose-time prompt seam.

**Ordered phases (each shippable + flag-reversible, mirroring §7):**
1. **Spine alongside bible (dark).** Emit `ctx.locationSpine`; bible still runs. Read-only addition.
2. **World doc prefers spine.** Point Agent 6.5 at the spine when present.
3. **Texture to prose-time** (needs Agent 9 hook). Flag `prose.lazyTexture`; A/B sensory scores.
4. **Spine via tool call** (needs P2). Delete truncation guards as they go green.
5. **Retire the bible.** Delete the table above; shrink schema; drop `max_tokens`.

**First increment:** Phase 1 — add the `LocationSpine` type, schema, and a `2c-Spine` generator writing `ctx.locationSpine` in parallel with the untouched bible. Nothing reads it yet. Pure additive, zero risk to live runs.

### 9.4 Test & validation strategy

- **Truncation-impossible invariant.** Once the spine is a forced tool call, add a test asserting the generator path contains **no `jsonrepair`** and **no atmosphere-missing retry branch**. The atmosphere-missing retry counter ([agent2c-location-profiles.ts L403-434](../../packages/prompts-llm/src/agent2c-location-profiles.ts)) must read zero across the canary batch.
- **Coverage invariant — "every scene's location has a spine + on-demand texture."** A post-prose check over each Agent 7 scene: its `setting.location` resolves to exactly one spine entry (no fuzzy-match misses → no generic-palette fallback), and that scene received minted texture for its own `timeOfDay`/`weather`. Target: 100% spine-resolution, **zero** generic-fallback events (today's fuzzy match misses are the bug this kills).
- **Schema-by-construction test.** Generate spine for 5 settings; assert every required field present, `fixedTraits.length ∈ [3,5]`, `baselinePalette` non-empty — without any repair pass.
- **No-post-mutation checksum.** With `compileSensoryAtoms` gone, assert "what passed the scorer" === "what shipped to prose" by checksum (directly addresses the post-LLM-mutation-without-revalidation hazard from my MEMORY notes).
- **Canary A/B (P4).** Replay the golden set old-bible vs spine+lazy; compare `LocationProfilesScorer` sub-scores and prose sensory-richness gate. Ship only on equal-or-better. Watch the variant-waste metric go to zero (nothing pre-generated is unused).

### 9.5 Rollout & rollback

- Every phase behind a flag: `agent2c.spine` (emit), `worldDoc.preferSpine`, `prose.lazyTexture`, `agent2c.spineToolCall`, `agent2c.retireBible`.
- **Dark first:** Phase 1 emits the spine into `ctx` and reports but no consumer reads it — observe token cost and schema validity on real runs with zero behavior change.
- **Rollback:** flip the flag; the bible code stays in-tree until Phase 5 explicitly deletes it. Phases 1-4 are reversible by a single flag with no data migration. The §5 migration shim (emit empty `keyLocations[].sensoryDetails`) keeps old readers from NPEing during the overlap window.
- **Point of no return:** Phase 5 (bible retirement) is the only irreversible step — gate it on a full green canary batch *and* one week of Phase 3/4 in production without a sensory-score regression.

### 9.6 Open questions to resolve before coding

1. **Inline vs cached texture (§4.3a vs b).** Spike A decides. If inline, added call count is zero; if cached, I need a `(locationId, timeOfDay, weather)` cache and an eviction story.
2. **Does the Agent 9 redesign actually expose a prose-time hook I can inject into?** Confirm the seam exists before committing to inline texture; coordinate with the Agent 9 plan. This is the single biggest external unknown.
3. **Era markers ownership.** §5 says source once from Agent 1/2d — confirm Agent 1's Period KB exposes era markers the spine/prose can reference so 2c stops re-minting them.
4. **Prose Brief merge — now or later?** Build spine standalone, or land it directly inside a merged 2b/2c/2d Prose Brief? I lean standalone-first; needs a decision with the owners of those agents.
5. **Spine logic fields → CML now or later?** §7 step 5 promotes `access`/`layout`/`purpose` into the typed CML. Deferred to post-Agent-3, but the spine schema should be shaped so that promotion is a projection, not a rewrite.

### 9.7 "Ready to build" checklist

- [ ] Spike A bake-off run; lazy texture scores ≥ bible on the canary sample (else fall back to §4.3b).
- [ ] Spike B confirms constrained spine ≤2000 tokens, zero repairs.
- [ ] Spike C confirms realized tuple count ≪ Cartesian product.
- [ ] Agent 3 typed CML location model available to reconcile `access`/`layout`/`purpose` against.
- [ ] Agent 9 prose-time hook confirmed to exist (Q2).
- [ ] P2 constrained-output infra available (for Phase 4).
- [ ] Flags `agent2c.spine` etc. registered.
- [ ] Migration shim for `keyLocations[].sensoryDetails` ready.
- [ ] **FIRST PR:** add `schema/location_spine.schema.yaml`, the `LocationSpine` TS type, and `agent2c-location-spine.ts` generating `ctx.locationSpine` in parallel with the untouched bible (Phase 1, dark, no consumer). Includes the schema-by-construction test from §9.4 and a token-cost log line. This PR changes no existing behavior and is the foundation everything else lands on.
