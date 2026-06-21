# Agent 2d — Temporal Context: A Ground-Up Redesign

> Temporal truth should be one small, derived fact table that everyone reads — not a 4,500-token LLM essay whose one load-bearing field a later agent silently overrides.

I'm Claude. I was asked to redesign Agent 2d from the ground up, starting from the job to be done and taking merge/absorb/non-LLM options seriously. My conclusion up front: **Agent 2d as a standalone generative agent should not exist.** Its one fact the pipeline actually enforces (month → season) is already derived deterministically elsewhere, and everything else it produces is flavor that belongs in the world-building layer or in nothing at all. Below is the evidence and the rebuild.

---

## 1. The job to be done

Strip away the schema and the only durable jobs are:

1. **Anchor the story in a specific moment.** Pick a concrete `year` + `month` inside the chosen decade so two runs in the "1950s" don't feel identical, and so downstream agents have a single date to reason about.
2. **Derive the hard environmental facts that follow from that date.** Month → season → permissible weather/daylight/seasonal-vocabulary. These are *constraints* that prose must not contradict.
3. **Supply period texture on demand.** Fashion, prices, music, headlines, social attitudes — atmosphere a prose scene can reuse without inventing anachronisms.

Job 2 is a **fact derivation** (a lookup table, not a creative act). Job 1 is **one RNG draw plus a constraint** ("a real date in this decade"). Only Job 3 is plausibly an LLM job — and even then it overlaps heavily with [Agent 1](04_agent_1_era_setting.md) (which already establishes `era.technology`, `era.socialNorms`, `era.forensics`) and with the Agent 6.5 World Builder. The current agent fuses all three into one generative artifact, which is why it's both expensive and contradiction-prone.

---

## 2. How it works today

The runner [`apps/worker/src/jobs/agents/agent2d-run.ts`](../../apps/worker/src/jobs/agents/agent2d-run.ts) calls `generateTemporalContext()` in [`packages/prompts-llm/src/agent2d-temporal-context.ts`](../../packages/prompts-llm/src/agent2d-temporal-context.ts) at progress step 89–91, late in the grounding quartet (2b/2c/2d/2e). It runs at temperature 0.7, `max_tokens: 4500`, `default_max_attempts: 2` (per [`apps/worker/config/generation-params.yaml`](../../apps/worker/config/generation-params.yaml)).

The mechanics:

- A deterministic `simpleHash(runId)` already picks the `year` and `month` **before the LLM runs** (`generateSpecificDate`, lines 116–134). So the anchor date — the one genuinely load-bearing output — is *not* an LLM decision. The prompt then commands the model in three places to copy that exact date back ("CRITICAL DATE REQUIREMENT… DO NOT change the year or month").
- The LLM is then asked to fill an enormous schema ([`schema/temporal_context.schema.yaml`](../../schema/temporal_context.schema.yaml)): `seasonal`, `fashion` (mens/womens formal/casual/accessories), `currentAffairs`, `cultural` (entertainment/literature/technology/dailyLife), `socialAttitudes` (class/gender/race/norms), `atmosphericDetails`, and 3–5 narrative `paragraphs`. The field glossary in [`documentation/03_Agents/05_agent_2d_temporal_context.md`](../../documentation/03_Agents/05_agent_2d_temporal_context.md) runs to ~14 nested object groups.
- Output is parsed with `JSON.parse` → `jsonrepair` fallback, validated against the schema, scored by `TemporalContextScorer`, with one quality-guardrail retry.
- Downstream, only **two** consumers exist: Agent 6.5 ([`agent65-run.ts`](../../apps/worker/src/jobs/agents/agent65-run.ts)) and Agent 9 ([`agent9-run.ts`](../../apps/worker/src/jobs/agents/agent9-run.ts) + the prose package).

Here is the punchline, and it's the whole reason for this redesign. Agent 9 does **not trust** the season the LLM authored. In [`packages/prompts-llm/src/agent9-prose/lint.ts`](../../packages/prompts-llm/src/agent9-prose/lint.ts) it re-derives season from the month via a hardcoded table:

```ts
export const MONTH_TO_SEASON: Record<string, CanonicalSeason> = {
  january: 'winter', february: 'winter', march: 'spring', /* … */ december: 'winter',
};
export const deriveTemporalSeasonLock = (temporalContext) => {
  const month = normalizeMonthToken(temporalContext?.specificDate?.month);
  const season = MONTH_TO_SEASON[month];        // ← the real season
  return { month, season };
};
```

And in [`prompt-blocks.ts`](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts) the derived value **wins** over the authored one:

```ts
const lockedSeason = seasonLock?.season ?? explicitSeason;   // derived first, LLM's seasonal.season only as fallback
```

Then `enforceMonthSeasonLockOnChapter*` in `lint.ts` mechanically rewrites any conflicting season word in finished prose to match the *derived* season, emitting `season_lock_replacements_total` telemetry. So `temporalContext.seasonal.season` — a required schema field the LLM spent tokens reasoning about — is **dead data**: used only as a fallback that, for any valid month, never fires.

---

## 3. Where it hurts

**A. Split ownership of a single truth (the headline smell).** Temporal truth is *authored* in 2d but *enforced/overridden* in 9. The model writes "season: spring" for a March story; Agent 9 agrees by coincidence. But nothing guarantees agreement: if the LLM ever picks a season inconsistent with the hashed month (e.g. it reads the weather/mood hints and writes "autumn" for a May date), 2d's value is silently discarded and the prose lock uses the table. Two sources of truth, one of them ignored, no reconciliation — textbook [POST-LLM mutation without re-validation](../../C:/Users/andyl/.claude/projects/c--CML/memory/agent9-postprocess-after-validation.md) territory, where a deterministic pass quietly diverges from the authored artifact.

**B. The anchor date isn't even an LLM decision.** `generateSpecificDate` hashes the `runId` to choose year+month deterministically, then we spend prompt real estate *forcing* the LLM to echo it back and burn a retry if it drifts. We pay LLM tokens to transcribe a value we already computed.

**C. Token churn for mostly-unconsumed output.** 4,500 max tokens × up to 2 attempts produce ~14 nested field-groups. Only the date, the season (re-derived anyway), a handful of weather/daylight/activity strings, and a few atmospheric lines actually reach prompt-blocks. `fashion`, `currentAffairs`, `cultural`, `socialAttitudes` overlap with Agent 1's `era.*` and Agent 6.5's world bible — generated again here, scored, then largely unread.

**D. Conceptual overlap → contradiction risk.** Agent 1 already owns "period constraints." Agent 6.5 already owns the consumable world bible. Agent 2d wedges a third period-flavor artifact between them, with no enforced consistency against either. Anachronism rules ("no anachronisms whatsoever") are restated here without reference to Agent 1's `era.technology`/`era.forensics`, so the two can disagree.

**E. Fragility of the GENERATE→PARSE→PAD pattern.** A 14-group nested schema at temp 0.7 is exactly the shape that fails JSON validity and leans on `jsonrepair`, padding, and "continue on validation failure" — masking a degraded artifact that then flows downstream as if clean.

---

## 4. Blue-sky redesign

**Verdict: delete the generative Agent 2d. Replace it with (i) a deterministic `TemporalAnchor` fact table that is the single source of truth, and (ii) absorb the genuinely-creative period texture into Agent 1 / Agent 6.5.** No standalone temporal LLM call.

### 4.1 The single source of truth: a derived `TemporalAnchor`

One small structured object, computed by a pure function, owned by nobody's prompt:

```ts
interface TemporalAnchor {
  year: number;            // hashed from runId within the decade (as today)
  month: CanonicalMonth;   // hashed from runId
  day?: number;            // optional
  season: CanonicalSeason; // DERIVED: MONTH_TO_SEASON[month] — the ONLY place this map lives
  daylight: DaylightBand;  // DERIVED from {season, latitude-band of location}
  allowedSeasonVocab: string[];   // getSeasonAllowList(season)
  forbiddenSeasonVocab: string[]; // the other three seasons' words
}
```

This is `generateSpecificDate` + `deriveTemporalSeasonLock` + `getSeasonAllowList`, unified into one module (say `packages/cml/src/temporal-anchor.ts`) and emitted as part of the CML case the moment the date is drawn. **`MONTH_TO_SEASON` lives in exactly one file.** Agent 9's `deriveTemporalSeasonLock` becomes `cml.temporalAnchor.season` — a read, not a re-derivation. The split disappears because there is no longer a second author to disagree with.

This belongs **inside the CML timeline**, not a sidecar artifact. The CML already models `constraint_space.time`; the anchor is its natural home. "Build mysteries like an engineer builds proofs" means the season is a *theorem* derived from the month axiom, not an opinion an LLM offers and another agent overrules.

### 4.2 Resolving the Agent-9 contradiction explicitly

Today: 2d authors `seasonal.season`; 9 ignores it and rewrites prose to the table.
Redesign: there is one `season`, computed once, written into CML, **passed to Agent 9 as a hard constraint in the generation prompt** (not just enforced in post-processing). Agent 9's mechanical `enforceMonthSeasonLockOnChapter` survives as a *backstop/lint*, but it now reconciles against the same value the prose generator was given — so replacements should trend toward zero, and a nonzero `season_lock_replacements_total` becomes a real signal ("the model violated a stated constraint") rather than routine cleanup of an unstated one. One owner, one value, enforcement that *agrees with* authoring instead of overriding it.

### 4.3 Where the period texture goes (the creative remainder)

The fields that *are* genuinely generative — fashion, current affairs, cultural touchstones, social attitudes, atmospheric sensory lines — are world-bible content. They should be **owned by Agent 6.5 (World Builder)**, which already exists to produce reusable, prose-facing world detail, conditioned on `(TemporalAnchor, Agent 1 era constraints, locations)`. This:

- removes the third overlapping period artifact (Agent 1 = constraints, Agent 6.5 = consumable texture, anchor = hard facts);
- lets Agent 1's `era.technology`/`era.forensics`/`era.socialNorms` be the *input* to the texture, killing the anachronism-disagreement risk;
- is one fewer LLM round-trip, with the surviving creative work folded into an agent that already runs.

If we'd rather not enlarge 6.5, the alternative is to fold texture into **Agent 1 as a single "Grounding" agent** that emits era constraints *and* period texture together — but I prefer 6.5 because texture is prose-facing and benefits from knowing the cast and locations, which Agent 1 doesn't yet have.

### 4.4 Deterministic vs LLM — the dividing line

| Concern | Today | Redesign |
|---|---|---|
| Anchor year/month | hash, then LLM echoes it | hash only (no LLM) |
| Season | LLM authors + Agent 9 re-derives | derived once, single source |
| Daylight band | LLM prose string | derived from season + location latitude band |
| Season allow/forbid vocab | hardcoded in lint.ts | derived in anchor, read by 9 |
| Fashion / affairs / culture / attitudes | LLM in 2d | Agent 6.5 (conditioned on anchor + era) |
| Holidays for the month | LLM free text | small lookup table keyed by (month, region), LLM only for obscure regions |

Everything mechanical becomes a function. The LLM is reserved for open-ended period color, and only inside an agent that already has the context to do it well.

### 4.5 Concrete example

`runId` hashes to **May 1953, London**.

- *Today:* 2d's LLM gets "May 1953," is told 3× not to change it, fills 14 field groups including `seasonal.season: "spring"` and three atmospheric paragraphs. Agent 9 throws away `"spring"`, recomputes `MONTH_TO_SEASON["may"] = "spring"` (lucky match), builds an allow-list, and rewrites any "summer"/"autumn"/"winter" word in the prose. ~4,500 tokens, one artifact, one ignored field.
- *Redesign:* `temporalAnchor = { year:1953, month:"may", season:"spring", daylight:"long-evening", allowedSeasonVocab:["spring","vernal","springtime"], forbiddenSeasonVocab:[…] }` — computed in microseconds, written into CML. Agent 6.5, already running, gets `(anchor, era constraints, London, cast)` and produces the Coronation-month texture (it's June 1953 for the actual Coronation, so the model can even note the run-up), prices, fashion — as *world bible* entries. Agent 9 reads `anchor.season` directly and is told the allow-list as a generation constraint. Zero standalone temporal LLM call; the one true season can never disagree with itself.

---

## 5. Ripple effects on the rest of the pipeline

- **Agent 9 prose:** `deriveTemporalSeasonLock` / `MONTH_TO_SEASON` / `getSeasonAllowList` move out of `lint.ts` into the shared anchor module and become reads. The lint stays as a backstop but should fire far less. `temporalContext.seasonal.season` references in `prompt-blocks.ts` (line ~400–408) collapse to `cml.temporalAnchor.season`. The cross-artifact temporal conflict detector (`detectCrossArtifactTemporalConflicts`, lint ~772) now compares against one canonical anchor.
- **Agent 6.5:** gains the fashion/affairs/cultural/attitudes responsibility, conditioned on the anchor and Agent 1's era. Its prompt grows; net LLM calls drop by one.
- **Agent 1:** unchanged, or optionally renamed the "Grounding" agent if we fold texture here instead of 6.5.
- **Schema:** `temporal_context.schema.yaml` shrinks to (or is replaced by) the `TemporalAnchor` shape inside the CML; the texture fields migrate to the world-bible schema. `TemporalContextScorer` and the [scoring adapter](../../apps/worker/src/jobs/scoring-adapters/) for 2d retire or fold into 6.5's scorer.
- **Orchestrator:** one fewer agent in the 2b/2c/2d/2e quartet → the quartet becomes a trio. Progress steps 89–91 free up. Removes one GENERATE→PARSE→PAD→PATCH surface and one "continue on validation failure" mask.
- **Risk to watch:** Agent 6.5 currently runs *after* CML; the anchor must be computed early (at date draw) so 6.5 and 9 both read the same value. That ordering is already satisfied because the date is drawn deterministically and needs no upstream artifact.

---

## 6. How we'd know it worked

- **`season_lock_replacements_total` trends to ~0** across runs. Today it's routine cleanup of an unstated constraint; after the redesign a nonzero value means the model violated a *stated* one — a real, actionable signal.
- **Zero temporal contradictions** from `detectCrossArtifactTemporalConflicts` attributable to season/month disagreement (there is now one source).
- **Token/cost delta:** one fewer 4,500-token × ≤2-attempt agent; measure total run cost before/after. Expect a clean drop minus whatever 6.5 grows.
- **No regression in period texture quality:** A/B blind-read a sample — does prose set in May 1953 still feel period-specific when the texture comes from 6.5 instead of 2d? Score fashion/price/atmosphere specificity with the existing quality bar.
- **Determinism check:** same `runId` ⇒ byte-identical `TemporalAnchor` every run (it's a pure function). Easy unit test; impossible to assert today because the season rode an LLM.
- **Schema-failure rate** for the retired 2d artifact goes to zero (no artifact); watch 6.5's failure rate doesn't spike.

---

## 7. Migration path

1. **Extract the anchor (no behavior change).** Move `generateSpecificDate`, `MONTH_TO_SEASON`, `deriveTemporalSeasonLock`, `getSeasonAllowList` into `packages/cml/src/temporal-anchor.ts` as one pure function returning `TemporalAnchor`. Have both 2d and Agent 9 import from it. Ship; nothing changes behaviorally, but the duplication is gone and there's now one map.
2. **Make Agent 9 read the anchor, not re-derive.** Replace `deriveTemporalSeasonLock(temporalContext)` calls with `cml.temporalAnchor`. Keep the lint backstop. Verify `season_lock_replacements_total` is unchanged.
3. **Stop the LLM from authoring season.** Drop `seasonal.season` as an LLM-authored field; populate it from the anchor. Now there is provably one source. Validate over a batch that prose is unaffected.
4. **Move texture to Agent 6.5.** Add fashion/affairs/cultural/attitudes/atmospheric generation to 6.5's prompt, conditioned on `(anchor, era, locations, cast)`. Run both old-2d and new-6.5 in shadow mode; blind-compare texture quality.
5. **Delete generative Agent 2d.** Remove the runner, the prompt builder, the scorer, the scoring adapter, and the standalone schema; drop the step from the orchestrator. The anchor is emitted at date-draw time; 6.5 owns texture; 9 reads the anchor.
6. **Tighten enforcement.** Pass the allow/forbid vocab to Agent 9 as a *generation* constraint, not just a post-process. Watch replacement telemetry fall.

Each step is independently shippable and reversible; steps 1–2 are pure refactors that de-risk the rest.

---

## 8. The pitch in one paragraph

Agent 2d spends 4,500 tokens and a retry to produce a 14-group period essay whose single enforced fact — the season — it isn't even allowed to decide: the date is hashed before the model runs, and Agent 9 throws away the model's season and re-derives it from a hardcoded month→season table, rewriting prose to match. That's two owners of one truth with the authored one ignored. So delete the generative agent: derive the date, season, daylight, and seasonal vocabulary deterministically into a single `TemporalAnchor` written into the CML timeline (one map, one source, read by everyone), and fold the genuinely-creative period texture into Agent 6.5's world bible where it can be conditioned on Agent 1's era constraints. The result is one fewer LLM round-trip, zero split-ownership, a season that cannot contradict itself, and season-lock telemetry that finally means something.

---

## 9. Implementation Plan

> This is a *delete-and-absorb* plan, not a rebuild — so the riskiest moves are the deletion (proving nothing downstream silently depended on 2d's flavor) and the ownership transfer (proving Agent 9 reading the anchor equals what it computes today). I sequence those proofs first.

### 9.1 Validate the approach first (de-risking spikes)

Before deleting anything, I want three falsifiable spikes. Each is a few hours and answers a question that, if it goes the wrong way, changes the plan.

1. **The anchor reproduces today's load-bearing values, byte-for-byte.** Write the pure `deriveTemporalAnchor(decade, runId, location)` and assert that for a corpus of real `runId`s it returns the *same* `year`/`month` that [`generateSpecificDate`](../../packages/prompts-llm/src/agent2d-temporal-context.ts) (lines 116–134) produces today, and the *same* `season` that [`MONTH_TO_SEASON`](../../packages/prompts-llm/src/agent9-prose/lint.ts) (line 742) → [`deriveTemporalSeasonLock`](../../packages/prompts-llm/src/agent9-prose/lint.ts) (line 787) produces. Reuse the exact `simpleHash` and bit-shift math (`hash % 10`, `(hash >> 4) % 12`) so the date is identical — *this is a copy, not a reimplementation.* **Falsification:** if my anchor's date or season drifts from the legacy values on any real `runId`, the hashing or month-normalization has a hidden input (locale-cased month token, decade parsing) and I stop and find it.
2. **Agent 9 reading the anchor == today's overridden season, on a canary run.** Take one or two golden runs, compute the anchor, and confirm that the `lockedSeason` chosen in [`prompt-blocks.ts`](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts) (line 408, `seasonLock?.season ?? explicitSeason`) is unchanged when `seasonLock` comes from the anchor instead of `deriveTemporalSeasonLock(temporalContext)`. Because today's `lockedSeason` already prefers the derived season over the LLM's `explicitSeason`, this *should* be a no-op — proving it on a canary is what lets me delete the LLM field with confidence.
3. **Nothing reads a 2d field that 6.5 won't reproduce.** Grep every consumer of `temporalContext.*` (the `fashion/cultural/currentAffairs/socialAttitudes` reads in [`prompt-blocks.ts`](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts) lines ~412–420) and list each field that reaches a prompt. **Falsification:** if a field reaches prose that 6.5's world bible has no slot for, texture absorption is under-scoped and 9.3's 6.5 work grows before I can delete 2d.

If spike 1 or 2 fails, the deletion is blocked and I fix the foundation first. Spike 3 only resizes the 6.5 work.

### 9.2 What gets built — and deleted (components & contracts)

**Built (small, deterministic):**

- A pure module `packages/cml/src/temporal-anchor.ts` exporting `deriveTemporalAnchor(decade, runId, location): TemporalAnchor` and the `TemporalAnchor` type from §4.1. It is the **single home** of `simpleHash`, the date hash, `MONTH_TO_SEASON`, `getSeasonAllowList`, and the daylight derivation. No LLM, no I/O, no retries.
- A write-site in the CML core (the P1 typed CML, see §9.3): the anchor is populated into `constraint_space.time` of the CML case **at the moment the date is drawn**, before any temporal-aware agent runs. This is the single-writer point — see the invariant in 9.4.

**Deleted (with real paths):**

| Surface | File | Action |
|---|---|---|
| 2d runner | [`apps/worker/src/jobs/agents/agent2d-run.ts`](../../apps/worker/src/jobs/agents/agent2d-run.ts) | delete; remove from orchestrator step sequence (progress 89–91) |
| 2d prompt builder + `generateSpecificDate` | [`packages/prompts-llm/src/agent2d-temporal-context.ts`](../../packages/prompts-llm/src/agent2d-temporal-context.ts) | delete `buildTemporalContextPrompt`/`generateTemporalContext`; `generateSpecificDate`+`simpleHash` move (verbatim) into `temporal-anchor.ts` |
| 2d scorer + scoring adapter | `TemporalContextScorer` and the 2d entry under [`apps/worker/src/jobs/scoring-adapters/`](../../apps/worker/src/jobs/scoring-adapters/) | delete |
| 2d schema | [`schema/temporal_context.schema.yaml`](../../schema/temporal_context.schema.yaml) | retire; texture fields migrate to the world-bible schema |
| 2d generation params | the 2d block in [`apps/worker/config/generation-params.yaml`](../../apps/worker/config/generation-params.yaml) | delete (the `max_tokens: 4500`, `default_max_attempts: 2`) |

**What Agent 9 stops doing:** it stops *deriving* season. [`deriveTemporalSeasonLock`](../../packages/prompts-llm/src/agent9-prose/lint.ts) (line 787) and `MONTH_TO_SEASON` (line 742) move out of `lint.ts` into the anchor module; the call in [`prompt-blocks.ts`](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts) (line 407–408) becomes `const lockedSeason = cml.temporalAnchor.season` — a **read**. The mechanical rewrite [`enforceMonthSeasonLockOnChapterWithTelemetry`](../../packages/prompts-llm/src/agent9-prose/lint.ts) (line 871) survives as a backstop but reconciles against the same value the generator was given, so `season_lock_replacements_total` should trend to ~0. `detectCrossArtifactTemporalConflicts` now compares against one canonical anchor.

### 9.3 Dependencies & sequencing

**Platform / cross-agent prerequisites:**

- **P1 typed CML core (KEYSTONE = Agent 3).** The `TemporalAnchor` lives in the CML timeline (`constraint_space.time`). The anchor write-site needs the typed CML to exist; until then I land the module against the current case shape and migrate the home when P1 ships.
- **P3 validation-gated-mutation discipline.** The anchor must be the **single writer** of season — this is the discipline that makes the deletion safe (no post-LLM pass re-derives it, per the [post-process-after-validation memory](../../C:/Users/andyl/.claude/projects/c--CML/memory/agent9-postprocess-after-validation.md)).
- **P4 golden/canary replay harness.** Makes `season_lock_replacements_total` a real regression signal and powers the spikes in 9.1.
- **Agent 9 = chapter-as-contract:** change its season source from re-derive to anchor read (9.2).
- **Agent 6.5 = Style Contract / world bible:** absorbs fashion/affairs/cultural/attitudes/atmospheric texture, conditioned on `(anchor, Agent 1 era constraints, locations, cast)`.
- **Agent 1 = Period KB:** unchanged; its `era.technology`/`era.forensics`/`era.socialNorms` become the *input* to 6.5's texture.
- **Umbrella:** this deletion is one limb of the **MERGE 2b/2c/2d/2e → "Prose Brief"** consolidation; 2e is DELETED→Agent 2, 2b→Voice Capsule, 2c→eager spine+lazy texture. Coordinate the orchestrator step removal with that work so the quartet collapses cleanly.

**Ordered phases** (each independently shippable and reversible):

1. **Extract the anchor (no behavior change).** Build `temporal-anchor.ts`; both 2d and Agent 9 import from it. Duplication gone, one map. — *first increment.*
2. **Agent 9 reads the anchor, not re-derives.** Swap the `prompt-blocks.ts` call to the anchor read; keep the lint backstop; verify telemetry unchanged.
3. **Stop the LLM authoring season.** Drop `seasonal.season` as an LLM field; populate from anchor. Provably one source.
4. **Move texture to Agent 6.5** in shadow mode; blind-compare quality (per 9.1 spike 3 scoping).
5. **Delete generative 2d** (runner, prompt, scorer, adapter, schema, orchestrator step, params).
6. **Tighten enforcement:** pass allow/forbid vocab to Agent 9 as a *generation* constraint, not just post-process.

**First increment:** phase 1 — the pure `temporal-anchor.ts` module behind no flag, imported by both 2d and 9, changing nothing behaviorally.

### 9.4 Test & validation strategy

- **Single-writer invariant (the core test):** assert that exactly one code path computes season. A test greps the codebase and fails if `MONTH_TO_SEASON` or any `month → season` map exists outside `temporal-anchor.ts`; a runtime assertion in CI fails if any agent writes `season` after the anchor draw. No re-derivation, anywhere.
- **anchor == legacy-output golden:** for a corpus of real `runId`s, `deriveTemporalAnchor` must return the exact `year`/`month`/`season` the legacy `generateSpecificDate` + `deriveTemporalSeasonLock` produce (this is 9.1 spike 1, frozen as a golden).
- **Determinism:** same `runId` ⇒ byte-identical `TemporalAnchor` (pure-function unit test).
- **Canary (P4 harness):** replay one to two golden runs end-to-end; assert `lockedSeason` and finished-prose season words are identical pre/post, and that `season_lock_replacements_total` does not *increase*. A post-deletion run with the vocab passed as a generation constraint should show it *fall*.
- **Texture non-regression:** blind A/B read of period-texture specificity (fashion/price/atmosphere) on a May-1953-style sample, old-2d vs 6.5, against the existing quality bar.

### 9.5 Rollout & rollback

- **Phases 1–3 are pure refactors** behind no user-visible flag; each is independently revertable by git since behavior is asserted-identical.
- **Deletion (phase 5) behind a flag:** gate the 2d orchestrator step on `ENABLE_AGENT_2D` (default on, then off). With it off, the step is skipped and the anchor + 6.5 texture supply everything; flip on to restore 2d instantly if a regression surfaces. Delete the dead step only after a bake period.
- **Keep the artifact shape if anything still reads it.** If any consumer still expects a `temporalContext`-shaped object, emit a thin **compatibility shim** from the anchor + 6.5 texture (`{ specificDate, seasonal: { season }, ...texture }`) so nothing NPEs during migration. Remove the shim once 9.1 spike 3's consumer list is empty.
- **Rollback trigger:** any increase in `season_lock_replacements_total`, any new `detectCrossArtifactTemporalConflicts` hit, or a texture-quality drop below bar → flip the flag, keep the anchor (it's a no-op refactor), investigate.

### 9.6 Open questions to resolve before coding

- **Daylight derivation needs a latitude band.** §4.1's `daylight` is derived from `(season, location latitude band)`. Where does the latitude band come from — Agent 1's `location`, a lookup, or do I scope daylight to v2 and ship season-only first? (Leaning: ship season + allow-vocab first; daylight as a fast-follow.)
- **Holidays:** §4.4 wants a `(month, region)` lookup table with LLM only for obscure regions. Is that table in scope for the anchor, or does it live as 6.5 texture? (Leaning: 6.5, to keep the anchor pure-deterministic.)
- **Anchor home before P1 lands.** Do I land `temporal-anchor.ts` against the current untyped case shape and migrate into `constraint_space.time` when Agent 3's typed CML ships, or block on P1? (Leaning: land now, migrate later — phase 1 has no dependency on P1.)
- **6.5 ordering:** §5 notes 6.5 runs after CML; confirm it reads the anchor that was written at date-draw, not a stale copy.
- **`detectCrossArtifactTemporalConflicts`** — once there's one source, does it still have a job, or does it degrade to a no-op I should delete?

### 9.7 "Ready to build" checklist

- [ ] 9.1 spike 1 passes: anchor reproduces legacy `year`/`month`/`season` on a real-`runId` corpus.
- [ ] 9.1 spike 2 passes: anchor-sourced `lockedSeason` is unchanged on a canary.
- [ ] 9.1 spike 3 done: complete list of `temporalContext.*` prompt consumers; each mapped to a 6.5 slot or marked droppable.
- [ ] Single-writer invariant test written and green (no `month → season` map outside `temporal-anchor.ts`).
- [ ] Golden corpus + determinism unit tests in place.
- [ ] `ENABLE_AGENT_2D` flag and compatibility-shim plan agreed.
- [ ] Open questions in 9.6 answered (at minimum: daylight scope, anchor home before P1).

**First task / PR:** create `packages/cml/src/temporal-anchor.ts` exporting `deriveTemporalAnchor` + the `TemporalAnchor` type, moving `simpleHash`/`generateSpecificDate` (verbatim, from [`agent2d-temporal-context.ts`](../../packages/prompts-llm/src/agent2d-temporal-context.ts) lines 104–134) and `MONTH_TO_SEASON`/`deriveTemporalSeasonLock`/`getSeasonAllowList` (from [`lint.ts`](../../packages/prompts-llm/src/agent9-prose/lint.ts) lines 742–833) into it, with both Agent 2d and Agent 9 importing from the new module and a golden test asserting byte-identical output to today. Pure refactor, no behavior change — phase 1.
