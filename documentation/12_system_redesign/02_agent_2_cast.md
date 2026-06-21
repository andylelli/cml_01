# Agent 2 — Cast & Motive Designer: A Ground-Up Redesign

> The cast is a *constraint-satisfaction sample*, not a JSON document we coerce into shape after the fact — and half of what it commits to today (who's guilty, who's a red herring) is a guess the logic agent overrides anyway.

---

## 1. The job to be done

Strip away the implementation and Agent 2 has exactly one real job:

**Produce a set of people who could plausibly populate a Golden Age murder mystery — distinct, period-grounded, motivated, related to each other — such that the logic agent (Agent 3) has rich, contradictory raw material to build a fair-play proof from.**

That's it. It is the *casting director* of the pipeline. It decides who is in the room. It does **not** — or should not — decide who did it, who the reader should suspect, or how the timeline resolves. Those are *proof* decisions, and the proof hasn't been built yet when Agent 2 runs.

The downstream contract is narrower than the current artifact implies. From [agent3-run.ts](../../apps/worker/src/jobs/agents/agent3-run.ts), the CML generator consumes:

- `castNames` — the roster of names (load-bearing: locks identity across 13 downstream agents).
- `castGenders` — name→gender map (load-bearing: drives the prose pronoun-lock; a wrong value here narrates a woman as "he").
- `detectiveType` ← `crimeDynamics.detectiveCandidates[0]` — *only the first element.*
- `victimArchetype` ← `crimeDynamics.victimCandidates[0]` — *only the first element.*

Everything else — `possibleCulprits`, `redHerrings`, the full `victimCandidates`/`detectiveCandidates` lists, `motiveStrength`, `accessPlausibility`, `alibiWindow` — is read by the **scorer** and by 2b/2e for flavour, but the **logic** that defines the mystery (`culpability.culprits`, the real alibi windows, the discriminating test) is re-derived from scratch by Agent 3. The cast's crime-dynamics block is, by the time it matters, **decorative**. There is even an F1b collision guard in Agent 3 that fires when the CML's chosen culprit collides with the cast's chosen victim — two agents guessing at the same decision and disagreeing.

So the job to be done is: **rich, distinct, related, gendered people + a victim seed + a detective seed.** Not a half-built logic model.

---

## 2. How it works today

[`designCast()`](../../packages/prompts-llm/src/agent2-cast.ts) builds one large text prompt ([`buildCastPrompt`](../../packages/prompts-llm/src/agent2-cast.ts)) with system + developer + user blocks, calls the LLM in `jsonMode`, `JSON.parse`s the text, and then runs a **long deterministic gauntlet** to force the parse into the [`cast_design.schema.yaml`](../../schema/cast_design.schema.yaml) contract:

1. **Count enforcement** — retry if `characters.length` ≠ expected; on the final attempt, **pad with literal `Placeholder N` characters** ("name: Placeholder 3, occupation: resident, secret: keeps a secret") or truncate.
2. **Enum coercion** — `accessPlausibility` and `motiveStrength` near-misses regex-mapped to the nearest legal value ("certain"→"easy", "overwhelming"→"compelling").
3. **Gender normalization** — three different layers, including a hand-maintained list of ~50 period first names and a `-a/-ine/-ette` suffix heuristic, finally falling back to **index parity** (`idx % 2 === 0 ? "female" : "male"`).
4. **Required-field default-fill** — any missing field gets a canned default.
5. **`crimeDynamics` snake→camel + derivation** — if `possibleCulprits` is empty, slice the first 3 non-detective names; if `victimCandidates` empty, take the first name; etc.
6. **Relationship reshaping** — accept five different shapes the model might emit (bare array, nested-under-character, `{with}`/`{target}` keys, object-keyed-by-name) and normalize into `{ pairs: [...] }`; if no pair references two real cast names, **synthesize a ring topology** of "social acquaintance / moderate tension" edges.
7. **Archetype diversification** — [`diversifyRoleArchetypes`](../../packages/prompts-llm/src/agent2-cast.ts) reassigns duplicate `roleArchetype` labels from a canned pool to hit a ≥70% unique floor.
8. **Stereotype hard-gate** — back in [agent2-run.ts](../../apps/worker/src/jobs/agents/agent2-run.ts), if `diversity.stereotypeCheck` is non-empty, **throw and kill the pipeline.**

Then [`normaliseCastOutput`](../../apps/worker/src/jobs/agents/agent2-run.ts) runs *the same family of fixes again* at the worker layer before schema validation, and a third schema-repair retry path re-calls `designCast` with extra guardrail text if validation still fails. Variation is injected deterministically by hashing the `runId` into a naming pool, a set of forbidden first-name initials, a relationship theme, a motive distribution, and a social dynamic.

It works. It reliably produces a schema-valid cast. But look at what it is: **a small amount of generation wrapped in a large amount of repair.**

---

## 3. Where it hurts

**The normalize/pad/coerce layer is most of the file, and it actively degrades quality.** The placeholder-padding path is the clearest tell: when the model returns 5 characters instead of 6, the "fix" injects a character literally named `Placeholder 3` whose secret is "keeps a secret" — a character that then flows into 2b's dossier, 3's CML, 7's outline, and 9's prose. We've turned a recoverable generation miss into a permanent quality defect *to satisfy a count.* Padding to hit a number is the opposite of casting.

**Gender is resolved by three guesses stacked on a coin flip.** The final fallback is `idx % 2`. The schema comment admits gender is "backfilled deterministically." This field is load-bearing for prose pronouns — MEMORY flags pronoun bugs as a recurring class — and we're setting it by array index when the model stays silent. The right fix is to never *let* the model stay silent.

**Agent 2 makes logic commitments it has no authority to make.** `possibleCulprits`, `redHerrings`, `victimCandidates`, `detectiveCandidates` are all chosen here, **before any logic exists.** Then Agent 3 re-decides culpability from scratch, and an F1b guard exists precisely because the two disagree. This is double work that creates a *new failure mode* (the collision) rather than removing one. The cast is guessing the ending before the mystery is designed.

**The scorer grades a different artifact than the agent produces.** [`agent2-cast-scorer.ts`](../../packages/story-validation/src/scoring/phase-scorers/agent2-cast-scorer.ts) checks for `culprit_eligibility`, `opportunity_channels`, `behavioral_tells`, `evidence_sensitivity`, `relationships: string[]` — **none of which Agent 2 emits.** The [adapter](../../apps/worker/src/jobs/scoring-adapters/agent2-scoring-adapter.ts) fabricates them: `opportunity_channels: []`, `behavioral_tells: []`, `culpability: undefined`, and synthesizes `culprit_eligibility` from the crime-dynamics block. So the scorer's depth metric scores empty arrays the agent was never asked to fill, and its "relationship reciprocity" / "relationships reference cast" tests operate on strings the adapter glued together. **We are scoring an impedance-mismatched shadow of the real artifact.** A whole 30%-weighted "quality" dimension is partly measuring the adapter, not the model.

**Variation is mechanical, not semantic.** Forbidding first-name initials by LCG and banning a fixed list of 15 surnames ("Harrington, Whitfield, …") is a 2023-era trick for low-diversity models. It fights *symptoms* of sameness (repeated names) rather than *causes* (the model defaulting to the same character archetypes), and it can force awkward names to satisfy an initials constraint that has nothing to do with story quality.

**Three repair layers, mostly the same prompt resent.** Per the [redesign README](00_README.md), token churn dominates cost and most retries are identical prompts. Agent 2's internal loop retries on count, on culprit count, on archetype diversity — each a full regeneration of the entire cast to fix one scalar.

---

## 4. Blue-sky redesign

If I started over, Agent 2 would be a **constrained-decoding casting sampler that produces a relationship graph and people — and nothing about guilt.** Here's the shape.

### 4.1 New contract: people + graph + seeds, no verdict

```jsonc
{
  "characters": [
    {
      "name": "Edmund Crale",
      "gender": "male",                    // REQUIRED in schema, enforced at decode
      "ageRange": "50s",
      "occupation": "estate solicitor",
      "socialPosition": "professional, old-money-adjacent",
      "publicPersona": "...",
      "privateSecret": "...",
      "stakes": "...",                     // what they stand to lose in *this household*
      "motiveSeeds": [                      // 1..n candidate pressures, NOT a verdict
        { "pressure": "forged codicil he drafted is about to be audited",
          "target": "anyone who could trigger the audit",
          "intensity": "strong" }
      ]
    }
    // ... exactly castSize entries, guaranteed by constrained decoding
  ],
  "relationships": {
    "edges": [
      { "a": "Edmund Crale", "b": "Vivienne Ashe",
        "type": "professional-with-private-debt",
        "tension": "high",
        "sharedHistory": "Edmund Crale drafted Vivienne Ashe's late husband's will and quietly buried a clause...",
        "directional": false }
    ]
  },
  "seeds": {
    "detective": { "name": "...", "type": "amateur", "entryJustification": "..." },
    "victimCandidates": ["...", "..."]      // ADVISORY, ranked; Agent 3 may pick or override
  },
  "diversity": { "recommendations": ["..."] }   // no self-audit stereotype gate
}
```

What changed and why:

- **No `possibleCulprits`, no `redHerrings`.** Deleted. Those are proof decisions. Each character carries `motiveSeeds` — *raw pressures* the logic agent can promote into a real motive, deflate into a red herring, or ignore. The cast no longer guesses the ending; it hands Agent 3 a deck of loaded cards and lets the proof decide which one is the ace. This **deletes the F1b collision class entirely** — there's only one place culpability is ever decided.
- **`victimCandidates` is explicitly advisory and ranked**, `detective` is a single committed seed (the one thing Agent 2 *is* well-placed to decide, since "who investigates" is a casting choice, not a logic choice).
- **Relationships are a first-class graph object** (`edges` with typed, directional flag) — not five accepted shapes normalized into one. The model authors the graph directly because the schema *is* a graph.
- **`gender` is a required enum at decode time.** Not backfillable, not inferred, not coin-flipped. The model must commit per character or decoding is invalid.

### 4.2 Constrained decoding deletes the entire normalize/pad/coerce layer

Today's model is Opus 4.8 with native structured outputs and constrained decoding (see [claude-api skill]; target the frontier, not the gpt-4.1-mini the current code apologizes for in its comments). Bind the output to a JSON Schema with:

- `characters` → `minItems: castSize, maxItems: castSize`. **The count is guaranteed.** Delete the retry-on-count loop, delete the placeholder-padding, delete the truncation. There is no `Placeholder 3` because the model cannot emit the wrong count.
- `motiveStrength` / `accessPlausibility` / `tension` / `gender` as `enum`. **Near-misses are structurally impossible.** Delete `normaliseMotiveStrength`, `normaliseAccessPlausibility`, `normalizeRelationshipTension`, `normalizeGender`, and the regex word-lists in both files.
- `gender` and every required field as `required`. **The default-fill block is gone.** A missing field is a decode failure, retried *once* by the SDK, not papered over with "inheritance" / "keeps a secret".
- `relationships.edges` as the only relationship shape. **The five-shape acceptance code, the nested-relationship lifting, the ring-topology synthesis — all gone.**

Concretely, this is the deletion of roughly **everything between line 500 and line 742** of `agent2-run.ts`'s `normaliseCastOutput` and **everything between line 500 and 745** of `designCast`. The agent shrinks to: build prompt → constrained call → semantic check → return. Per the README's thesis #1, *constrain at the source, don't repair at the sink.*

### 4.3 Diversity as constraint-satisfaction sampling, not post-hoc reassignment

The interesting half of casting *is* a CSP. We have hard constraints (exactly N people, exactly one detective, period-authentic names, gender required) and soft objectives (distinct archetypes, distinct social positions, distinct ages, motive-intensity spread, a connected relationship graph with real tension). Today we generate freely and then *repair* diversity with `diversifyRoleArchetypes` slapping canned labels onto duplicates.

Blue-sky: **express the diversity objectives in the prompt as a sampling target, and let the frontier model satisfy them in one reasoning pass** — it's strong enough now. Give it the *axes* to spread across, not a list of banned surnames:

> Cast N people who differ on **at least three** of: generation, social class, relationship to the victim, relationship to money, region of origin, temperament. No two characters may share a primary archetype. Distribute motive intensity so the household has 1–2 high-pressure figures and several with quieter, deniable pressures.

Then **verify the spread with a deterministic checker, not an LLM** (README thesis #2): compute archetype-uniqueness, age-band spread, social-position spread, and graph connectivity from the returned object. If a soft objective misses, *that* is the only thing the single retry's feedback mentions — "two characters are both 'disgraced insider'; differentiate one" — instead of resending the whole prompt blind. The deterministic `diversifyRoleArchetypes` fallback is deleted: we'd rather have the model re-cast one person than rubber-stamp a label.

This also kills the run-hash machinery. **Variation should come from the temperature and the seed in the prompt's framing, plus the upstream setting**, not from forbidding the letter Q. If we want reproducible variety, seed the model's framing with a one-line "household flavour" drawn from the setting (a declining naval family / a self-made industrialist's circle / a theatrical company on tour) and let *that* propagate naturally to names, occupations, and tensions — semantic variation, not lexical.

### 4.4 Where culprit selection should live: in Agent 3, period

The single most important change. **Defer all culpability to the logic agent.** Agent 3 already does this — it builds `culpability.culprits` from scratch — so today's `possibleCulprits` is at best a hint and at worst a contradiction. By moving the *motive seeds* to the character level and deleting the verdict from the cast, we get:

- One source of truth for guilt (Agent 3), so **no collision guard needed** (F1b's whole reason to exist evaporates).
- A richer signal to Agent 3: instead of "these 3 are possible culprits," it gets *per-character pressures with intensities*, which is exactly the raw material a proof needs to choose a culprit whose motive is strongest and whose alibi is breakable.
- Honest red herrings: a red herring is a *proof structure* (a suspect with apparent motive whose alibi later verifies), which can only be authored once the timeline exists. Asking the cast agent to pre-name red herrings before there's a timeline is asking for arbitrary ones — exactly what the current prompt warns against ("Red herrings are plausible but not arbitrary") while structurally guaranteeing arbitrariness.

The detective seed *stays* in Agent 2, because "who is the lens character" is a casting decision and the entry-mandate logic (how an amateur/PI legitimately gets access) is genuinely good and worth keeping.

### 4.5 Should this agent exist? Merge, split, or keep?

**Keep it, but absorb 2b into it.** Right now Agent 2 produces a thin sketch and **Agent 2b** ([character profiles](../../apps/worker/src/jobs/agents/agent2b-run.ts)) re-reads `ctx.cast.cast` to produce the prose-ready dossier (voice, humour, mannerisms, internal conflict). That split exists because small models couldn't hold "design the ensemble" and "voice each person" in one pass. A 1M-context frontier model can. Merging 2+2b into a single **"Ensemble"** stage means voice and motive are designed *together* — the secret and the speech mannerism reinforce each other instead of being bolted on by a second agent that can only see the first's JSON. That's README thesis #4 (fewer, larger, smarter calls) applied to the most natural seam in the early pipeline.

What stays separate: the **detective-entry mandate** prompt logic is excellent and should survive verbatim. The **stereotype hard-gate should be deleted**, not kept — asking a generator to self-audit for stereotypes and hard-failing the whole run if its self-report is non-empty is a perverse incentive (the model learns to always report `[]`), and it's a gate with no backstop (README failure-mode #4). Replace it with a cheap deterministic check (no character whose entire identity is their ethnicity/disability/profession-as-personality) that *warns* and feeds the single retry, never kills the run.

### 4.6 Concrete before/after

**Before (today, a real failure path):** model returns 5 of 6 characters with `motiveStrength: "overwhelming"` and gender omitted on two. → retry consumed on count → second call returns 6 but one `accessPlausibility: "certain"` → coerced to "easy" → two genders still missing → inferred from name list, one miss → `idx % 2` coin-flip assigns "female" to a character named Edmund → flows to prose → pronoun bug. Three of the README's named failure modes in one cast.

**After:** constrained decode guarantees 6 characters, all enums legal, all genders committed. Deterministic checker notes two characters share the "anxious heir" archetype and the graph has an isolated node. Single structured-feedback retry: *"Re-cast character 4 to a distinct archetype and give character 6 at least one relationship edge."* Model fixes exactly those two things. No padding, no coercion, no coin flip, no pronoun bug.

---

## 5. Ripple effects on the rest of the pipeline

- **Agent 3 (CML Generator):** *gains* per-character motive seeds, *loses* the pre-baked culprit/herring lists it ignored anyway. Its F1b victim/culprit collision guard ([agent3-run.ts](../../apps/worker/src/jobs/agents/agent3-run.ts)) can be **deleted** — there's only one culpability decision now. Its inputs get *richer and less contradictory.*
- **Agent 2b:** **absorbed** into the merged Ensemble stage. One fewer handoff, one fewer artifact, voice designed with motive.
- **Agent 2e (background context):** reads the same cast object; minor field-name update only.
- **Agent 9 (prose):** the pronoun-lock table (built from `characters.filter(c => c.gender)`) becomes **reliable** because gender is decode-required, not backfilled. Directly addresses the recurring pronoun-bug class in MEMORY.
- **The scorer + adapter:** the [adapter](../../apps/worker/src/jobs/scoring-adapters/agent2-scoring-adapter.ts) is **deleted** and the [scorer](../../packages/story-validation/src/scoring/phase-scorers/agent2-cast-scorer.ts) is **rewritten to grade the real artifact** — distinctness, graph connectivity, motive-seed specificity, gender completeness — not fabricated `opportunity_channels: []` arrays. Validation stops being 40%-weighted schema-checking (constrained decoding already guarantees structure) and re-weights toward *meaning*: are these people actually distinct, actually related, actually loaded with usable pressure?
- **Cost:** count/enum/diversity regenerations disappear; the merge with 2b removes a full call. Net fewer tokens for a richer artifact.

---

## 6. How we'd know it worked

- **Zero placeholder characters ever reach Agent 3.** Today's padding path is invisible in the green report; measure it directly and drive it to zero (it should be structurally impossible).
- **Zero deterministic enum/gender coercions logged.** The `[Agent 2] normalised …` warnings should never fire, because decoding can't produce a near-miss.
- **Pronoun-mismatch rate in final prose → 0** for characters whose gender Agent 2 set (the load-bearing reason gender exists).
- **F1b collisions → 0** (structurally, since culpability lives in one place).
- **Distinctness, measured deterministically:** archetype-uniqueness ratio, age-band spread, and social-position spread computed and trended — not as a 70% gate to game, but as a quality signal. Pairwise character-embedding similarity below a ceiling catches "two characters who are secretly the same person."
- **Graph health:** every character has ≥1 edge; ≥1 high-tension edge per cast; no isolated nodes — computed, not LLM-judged.
- **Scorer/artifact alignment:** the scorer reads the fields the agent emits. (Today it does not. This is a bug the redesign fixes by construction.)
- **Agent 3 acceptance:** the CML generator promotes a motive seed into the real culprit motive without rewriting it — a sign the seeds were genuinely usable, not flavour.

---

## 7. Migration path

Incremental, behind flags, no big-bang:

1. **Stop the bleeding (1 PR):** delete the **placeholder-padding** path; on a count miss, retry with structured feedback instead of injecting `Placeholder N`. Lowest-risk, highest-quality win.
2. **Constrained decoding (1 PR):** bind `designCast` to the JSON Schema via the SDK's structured-output / tool mode. Behind a flag, run both paths, diff outputs. Once stable, **delete** the normalize/coerce/default-fill blocks in both `designCast` and `normaliseCastOutput`. The schema-repair retry path in `agent2-run.ts` becomes dead code.
3. **Make gender decode-required (folds into step 2):** delete the three-layer gender backfill and the `idx % 2` fallback. Watch the prose pronoun metric.
4. **Move motive to the character level, delete the verdict (1 PR, coordinated with Agent 3):** add `motiveSeeds[]`, remove `possibleCulprits`/`redHerrings`, make `victimCandidates` advisory. Update Agent 3 to read seeds; **delete the F1b collision guard.** This is the only change that touches a second agent — gate it carefully.
5. **Relationships-as-graph (1 PR):** swap `relationships.pairs` for `relationships.edges`; delete the five-shape acceptor and ring-topology synthesizer.
6. **Rewrite the scorer to the real artifact, delete the adapter (1 PR).** Independent of the others; do it whenever.
7. **Merge 2b into the Ensemble stage (larger, last).** Only after 1–6 prove the constrained, graph-shaped cast is stable. This is the one structural change worth deferring.
8. **Retire run-hash variation (cleanup):** once semantic variation via setting-flavour framing is validated as diverse-enough, delete the naming-pool/initials/LCG machinery.

Steps 1–3 and 6 are pure wins with no cross-agent risk and can ship first.

---

## 8. The pitch in one paragraph

Agent 2 today is a small act of casting wrapped in a large act of repair: it generates a thin cast, then spends hundreds of lines padding it to a count, coercing its enums, coin-flipping its genders, reshaping its relationships, and guessing the murderer — a guess Agent 3 throws away and re-derives, leaving behind only a collision guard to clean up the disagreement. **Rebuild it as a constrained-decoding casting sampler:** the schema is enforced at decode time so the count, the enums, and the gender are *guaranteed* (deleting the entire normalize/pad/coerce layer and the pronoun-bug class with it); relationships are authored directly as a typed graph; diversity is a stated sampling objective verified by a deterministic checker, not a canned-label reassignment; and **all judgment about guilt is deferred to the one agent with the proof in hand.** Agent 2 stops being a half-built logic model we wrestle into shape and becomes what it should always have been — the casting director who hands the logic engine a room full of distinct, related, loaded people and lets the proof decide which one is the killer.

---

## 9. Implementation Plan

> Sections 1–8 are the *why* and the *what*. This is the *how*: the spikes that de-risk the thesis before I write the real code, the modules I build and the lines I delete, the order I do it in, and the gates that tell me it worked.

### 9.1 Validate the approach first (de-risking spikes)

The whole redesign rests on one assumption: **"constrain at the source" actually constrains.** Before deleting a single line of the normalize/pad/coerce layer, I prove that — cheaply — because if the constraint engine doesn't enforce what I think it enforces, deleting the repair layer ships broken casts to 13 downstream agents.

| # | Spike | Question it answers | Kill signal | Cost |
|---|---|---|---|---|
| **S1** | **Count & enum enforcement is real.** Call Opus 4.8 with `output_config.format` bound to a cast JSON Schema (`characters` with `minItems/maxItems = castSize`, `gender`/`motiveStrength`/`accessPlausibility`/`tension` as `enum`). Run 50 times across castSize 4–8. Count violations. | Does structured-output decoding *actually* guarantee count and enums, or do I still need a checker? | **>0 count violations** in 50 runs, OR any enum near-miss reaches the parsed object. | ~1 hr, ~50 calls |
| **S2** | **Gender is never silent.** In S1's runs, count characters where `gender` is missing/empty/null. | Can I delete the three-layer gender backfill + `idx % 2` and trust decode? | Any character decodes without a legal `gender`. | folds into S1 |
| **S3** | **Graph-shaped output is authorable.** Bind `relationships.edges` as the *only* relationship shape (typed `enum` on `tension`, `directional` bool). Check the model emits a connected graph referencing real cast names without the five-shape acceptor. | Does the model author a graph directly, or does it still need reshaping? | >10% of runs produce edges referencing non-cast names or leave nodes isolated. | folds into S1 |
| **S4** | **Single-retry-on-soft-miss converges.** Deterministically score distinctness (archetype-uniqueness, age/social spread) on S1 output; for the misses, send *one* structured-feedback retry ("re-cast character N to a distinct archetype"). Measure how often one retry fixes it. | Is the "one targeted retry" loop (replacing blind full-regeneration) good enough? | <80% of soft-misses resolve in one retry. | ~30 min |

> **S1 is the keystone and it has a known trap.** Per the [claude-api skill], the structured-outputs JSON-Schema validator on Opus 4.8 enforces type/`enum`/`required`/`additionalProperties:false`, **but does *not* enforce `minItems`/`maxItems`** (the SDK strips array-length and numeric/string-length constraints and validates them client-side). So `minItems: castSize` is **not** a hard decode-time guarantee — it's a strong prompt-level steer plus a client-side check. **This changes the plan:** the count guarantee comes from `required` fields + enum legality (which *are* enforced) **plus a tiny deterministic count assertion that triggers the single S4 retry** — not from the schema alone. S1 measures how often the model hits the exact count unaided; if that's ≥~95%, the one-retry loop closes the gap and we still delete the padding path. If S1 shows frequent count misses, we keep a thin count-check + retry (still a fraction of today's gauntlet) rather than placeholder-padding. Either way the `Placeholder 3` path dies. **Run S1 before committing to 9.2's deletions.**

Spikes are throwaway scripts under `scripts/` (alongside [canary-agent3.mjs](../../scripts/canary-agent3.mjs)), not production code. Go/no-go: S1+S2 green ⇒ proceed to constrained decoding + gender-required; S3 green ⇒ proceed to graph; S4 green ⇒ delete `diversifyRoleArchetypes`.

### 9.2 What gets built — and deleted

**Built / changed:**

| Module / path | Change |
|---|---|
| [`schema/cast_design.schema.yaml`](../../schema/cast_design.schema.yaml) | Rewrite to the §4.1 contract: per-character `gender` (enum, **required**) + `motiveSeeds[]`; `relationships.edges` replaces `relationships.pairs`; `seeds` (advisory `victimCandidates`, single committed `detective`); **delete `crimeDynamics` block entirely** (no `possibleCulprits`/`redHerrings`). |
| [`packages/prompts-llm/src/agent2-cast.ts`](../../packages/prompts-llm/src/agent2-cast.ts) (761 lines) | `designCast` becomes: build prompt → constrained `output_config.format` call → deterministic checker → at most one targeted retry → return. New `castDesignSchema` (JSON Schema literal) + `checkCastDistinctnessAndGraph()` (pure, deterministic). |
| New: `packages/prompts-llm/src/agent2-cast-checker.ts` | Deterministic, no-LLM: archetype-uniqueness ratio, age-band & social-position spread, graph connectivity (every node ≥1 edge, ≥1 high-tension edge), count assertion, light stereotype heuristic. Returns structured feedback strings for the single retry. Replaces the *idea* of `diversifyRoleArchetypes` and the stereotype hard-gate. |
| [`packages/story-validation/src/scoring/phase-scorers/agent2-cast-scorer.ts`](../../packages/story-validation/src/scoring/phase-scorers/agent2-cast-scorer.ts) (549 lines) | Rewrite to grade the **real** artifact: distinctness, graph health, motive-seed specificity, gender completeness. Stop scoring `opportunity_channels`/`behavioral_tells`/`culprit_eligibility`. |

**Deleted / shrunk (real paths):**

- [`apps/worker/src/jobs/agents/agent2-run.ts`](../../apps/worker/src/jobs/agents/agent2-run.ts) (482 lines) — delete `normaliseCastOutput` and its helpers (`normaliseMotiveStrength`, `normaliseAccessPlausibility`, the gender-backfill layers, `crimeDynamics` snake→camel + derivation, the stereotype hard-gate throw). The schema-repair retry path becomes dead code. *(The doc's §4.2 "lines 500–742" estimate predates the file shrinking to 482 lines — delete by function, not by line number.)*
- [`packages/prompts-llm/src/agent2-cast.ts`](../../packages/prompts-llm/src/agent2-cast.ts) — delete the placeholder-padding/truncation, enum-coercion regex word-lists, five-shape relationship acceptor + ring-topology synthesizer, `diversifyRoleArchetypes`, and the run-hash naming-pool / forbidden-initials / LCG variation machinery.
- [`apps/worker/src/jobs/scoring-adapters/agent2-scoring-adapter.ts`](../../apps/worker/src/jobs/scoring-adapters/agent2-scoring-adapter.ts) (83 lines) — **delete the whole file**; the scorer reads the artifact directly.
- [`apps/worker/src/jobs/agents/agent3-run.ts`](../../apps/worker/src/jobs/agents/agent3-run.ts) — delete the **F1b victim/culprit collision guard** (lines ~110–199) once culpability lives only in Agent 3.

**Rebuilt I/O contract:**

```
IN  (unchanged): refined setting (Agent 1), castSize, runId
OUT (new):       { characters[castSize]{ name, gender(enum,req), ageRange, occupation,
                                         socialPosition, publicPersona, privateSecret,
                                         stakes, roleArchetype, motiveSeeds[] },
                   relationships{ edges[]{ a, b, type, tension(enum), sharedHistory, directional } },
                   seeds{ detective{name,type,entryJustification}, victimCandidates[] (advisory) },
                   diversity{ recommendations[] } }
```

No `possibleCulprits`, no `redHerrings`, no `culpability` — those are Agent 3's, period (§4.4).

### 9.3 Dependencies & sequencing

**Platform first.** This agent is a *consumer* of shared platform **P2 (constrained-decoding / structured-output tool-call infra)** — it cannot ship before P2 exists, because the entire deletion of the repair layer depends on `output_config.format` being wired into the LLM client ([`packages/llm-client`](../../packages/llm-client/src/client.ts)). It also leans on **P4 (golden/canary replay harness)** to prove the new path matches the old in shape while differing in quality. It does **not** depend on **P1 (typed CML core)** directly, but the culpability-deferral handshake (motiveSeeds → Agent 3) is the one place P1's keystone owner (Agent 3) must move in lockstep.

Ordered phases (each shippable behind its flag):

1. **P2 lands** (structured-output in `llm-client`). Run **S1–S4**. *First concrete increment.*
2. **Stop the bleeding (no P2 needed):** delete placeholder-padding; on count miss, single structured-feedback retry. Pure quality win, zero cross-agent risk — ship first, even before P2 if scheduling demands.
3. **Constrained decoding + gender-required:** bind `designCast` to the schema; behind flag, dual-run + diff; then delete the coerce/backfill/default-fill blocks.
4. **Relationships-as-graph:** swap `pairs`→`edges`; delete five-shape acceptor + ring synthesizer.
5. **Motive-to-character + delete the verdict (coordinated with Agent 3 / KEYSTONE):** add `motiveSeeds[]`, drop `possibleCulprits`/`redHerrings`, make `victimCandidates` advisory; Agent 3 reads seeds; **delete F1b**. The only multi-agent change — gate hardest.
6. **Scorer rewrite + adapter delete:** independent; ship anytime.
7. **Merge 2b → Ensemble:** last, largest, only after 1–6 are stable.

Phases 2, 3, 6 are pure wins with no cross-agent risk and can land in any order once P2 is in.

### 9.4 Test & validation strategy

- **Unit:** `agent2-cast-checker.ts` is pure — table-test distinctness/graph/count math against hand-built fixtures (a cast with two identical archetypes → flagged; an isolated node → flagged; correct count → clean).
- **Property:** for any decoded cast, assert the invariants that the constraint engine + checker are *supposed* to guarantee: `characters.length === castSize`; every `gender ∈ {male,female,non-binary}`; every enum legal; every character appears in ≥1 edge; no edge references a non-cast name. These are exactly the things §6 says must go to zero.
- **Agent-specific invariant test (the load-bearing one):** **no character named `Placeholder N` and no logged `[Agent 2] normalised …` warning may appear in any golden run.** This is the single test that proves the repair layer is gone, not just bypassed — it asserts §6's "zero placeholder characters" and "zero deterministic coercions" by construction.
- **Golden/canary (P4):** replay a fixed set of settings through old vs new path; diff. The *structure* must validate identically; the *content* is allowed (expected) to differ. Wire into the existing canary scripts ([scripts/canary-agent3.mjs](../../scripts/canary-agent3.mjs) pattern). Add a canary that asserts **F1b collisions === 0** post-phase-5.
- **Acceptance gates (tied to §6):** ship a phase only when its §6 metric holds on canary — zero placeholders, zero coercions logged, gender-completeness 100%, graph-health 100% (every node ≥1 edge, ≥1 high-tension edge), and (phase 5) F1b → 0. The pronoun-mismatch-in-final-prose → 0 metric is measured downstream at Agent 9 and trended, not gated here (it's the *reason* gender-required exists).

### 9.5 Rollout & rollback

- **Flag:** `AGENT2_CONSTRAINED_CAST` (env, read in [`shared.ts`](../../apps/worker/src/jobs/agents/shared.ts) alongside the existing `preAgent9*` flags). Phase 5's cross-agent change gets its own sub-flag `AGENT2_DEFER_CULPABILITY` so the cast-shape change can ship before the Agent-3 handshake.
- **Shadow → canary → default:** flag off = legacy `designCast` + full repair gauntlet (untouched). Flag on for canary settings only; dual-run and diff in P4. Promote to default per-phase once the §6 gate holds for N consecutive canary runs.
- **Legacy fallback:** the old normalize path stays in the tree (dead behind the flag) until phase 7; a single env flip reverts to it with zero redeploy. Delete the legacy code only after the constrained path has been default for a full canary cycle with no count/enum/gender regressions.
- **Kill criteria (auto-revert the flag):** any count violation reaching Agent 3; any illegal enum/gender in a default-path run; F1b collisions > 0 after phase 5 (means the verdict didn't fully move); or canary distinctness/graph-health dropping below the legacy baseline. Each maps 1:1 to a §6 success metric — if a §6 metric regresses, the flag flips.

### 9.6 Open questions to resolve before coding

1. **S1's count-enforcement result.** If Opus 4.8 misses the exact count more than rarely (the `minItems` caveat), do we (a) keep a thin count-check + one retry, or (b) over-generate by one and trim the weakest? I lean (a) — trimming reintroduces a quality judgment the cast shouldn't make.
2. **`motiveSeeds` shape Agent 3 actually wants.** Is `{pressure, target, intensity}` (§4.1) the right granularity for the CML generator to promote a seed into a real motive without rewriting it? Needs a one-paragraph contract agreed with the Agent-3 owner *before* phase 5.
3. **Detective seed authority.** Agent 2 commits the detective (§4.4) — does Agent 3 ever need to override it? If yes, the detective seed is advisory too and the contract changes.
4. **2b merge timing.** Does the merged Ensemble stage stay one constrained call, or does voice need a second pass even on a 1M-context model? Defer until phases 1–6 prove stable (it's explicitly last).
5. **Stereotype check as warning, not gate.** What exactly does the deterministic heuristic flag (§4.5: "no character whose entire identity is their ethnicity/disability/profession")? Needs a concrete, testable rule before it can warn-and-feed-the-retry.

### 9.7 "Ready to build" checklist

- [ ] **P2 (structured-output infra) merged** into [`packages/llm-client`](../../packages/llm-client/src/client.ts) and callable from `designCast`.
- [ ] **S1 run and green** — count + enum + gender enforcement measured on Opus 4.8 (the `minItems` caveat resolved one way or the other). *Nothing in 9.2 ships before this.*
- [ ] S3 (graph) and S4 (one-retry-converges) green.
- [ ] New `cast_design.schema.yaml` contract reviewed; `motiveSeeds` shape agreed with the Agent-3 owner (open question #2).
- [ ] `AGENT2_CONSTRAINED_CAST` flag wired in `shared.ts`; P4 dual-run/diff harness ready for cast settings.
- [ ] Invariant test (`no Placeholder N`, no `[Agent 2] normalised` warning) written and **failing** against the current path (so it proves something when it goes green).

**First concrete task / PR:** *"Agent 2: structured-output count/enum/gender spike (S1–S2)."* A throwaway script under `scripts/` that binds a draft cast JSON Schema to Opus 4.8 via the new P2 path, runs 50 casts across castSize 4–8, and reports count violations, illegal enums, and missing genders. Green → it greenlights the whole 9.2 deletion; red → it tells us exactly how thin a count/enum backstop we still need before we delete the gauntlet. Everything else in this plan waits on that number.
