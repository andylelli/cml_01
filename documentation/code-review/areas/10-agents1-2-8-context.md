# 10 — Agents 1, 2–2e & 8: setting, cast, profiles, context, novelty

**Scope:** 19 files, 6,656 lines, 5,207 code lines (7 worker runners + 12 `prompts-llm` modules; list in §1) · **Read:** every line · **Written:** 2026-09-25
**Finding prefix:** A1X · **Method:** [RUBRIC.md](../RUBRIC.md)

## 1. What this area does

```
generateMystery (mystery-orchestrator.ts:1196-1336)
 ├─ runAgent1   agent1-run.ts        → refineSetting()            agent1-setting.ts         → ctx.setting
 ├─ runAgent2   agent2-run.ts        → generateCastNames + designCast() agent2-cast.ts      → ctx.cast
 │               normaliseCastOutput → enforceVictimRoleInvariant → repairCastSchemaFields → re-roll
 │               shadow: checkCast() agent2-cast-checker.ts (AGENT2_CAST_CHECK)
 ├─ runAgent2e  agent2e-run.ts       → generateBackgroundContext() agent2e-background-context.ts → ctx.backgroundContext
 │               shadow: deriveBackgroundContext() agent2e-background-derive.ts (AGENT2E_DERIVE_BACKGROUND)
 ├─ (3b, 3 — Agent 8 auditNovelty() agent8-novelty.ts runs INSIDE agent3-run.ts:524-541)
 ├─ … 5, 6, gates …
 └─ R9 trio (sequential, or Promise.all when AGENT_PROFILES_PARALLEL)
     ├─ runAgent2b agent2b-run.ts → generateCharacterProfiles() agent2b-character-profiles.ts → ctx.characterProfiles
     │              gate: extractVoiceCapsule/checkVoiceCapsules agent2b-voice-capsule.ts (AGENT2B_VOICE_CHECK)
     ├─ runAgent2c agent2c-run.ts → generateLocationProfiles() agent2c-location-profiles.ts → compileSensoryAtoms
     │              → enforceLocationSensoryFallbacks → F5b bleed warn → spine shadow (agent2c-location-spine.ts)
     │              → scene gate (agent2c-location-distinctness.ts, AGENT2C_SCENE_GATE) → ctx.locationProfiles
     └─ runAgent2d agent2d-run.ts → generateTemporalContext() agent2d-temporal-context.ts → season re-pin → ctx.temporalContext
identity-match.ts — name/role predicates used by agent2-run, agent6-run, agent6-reveal-gate.
```

Every runner has the same shell: progress → `if (enableScoring…) executeAgentWithRetry(…) else direct call` →
deterministic post-fix → `validateArtifact` → flag-gated shadow/gate → progress. Every 2b/2c/2d/2e generator has the
same inner shell: `withValidationRetry` → `client.chat` → JSON parse (±jsonrepair) → structural throw → cost read
from the per-label tracker. Retry layers stacked on one stage: transport (`client.chat`), generator loop (2–3
attempts), scoring loop (`AGENT_PRE9_ENABLE_LLM_RETRIES`, default OFF), runner schema re-roll (1, 2), gate loop (2b, 2c).

## 2. Verdict

Structurally healthy and low-churn compared with Agents 5–9; the complexity is **accretion, not design**. Three
things generate it: (1) the same runner and generator skeletons hand-copied 6× and 4×, and the copies have already
drifted (dropped `characterGenders` on the Agent 2 re-roll, truncation guard in 2 of 4 parsers, three cost
conventions); (2) the cast artifact has **two normalisers** (`designCast` and the runner's 330-line, cc-67
`normaliseCastOutput`) plus four or five bodies each of "who is the detective", "who is the victim", "minimum
suspect pool" and "70 % unique archetypes"; (3) redesign scaffolding (shadow checkers, derive modules, gates) sits
inline in runners. The single most valuable change is **A1X-01 + A1X-04: one cast-identity/boundary module**, because
it removes a live defect class — MEASURED here: Agent 2's substring victim test designates *"Friend of the victim"* as
the victim, the exact abort class #10 that `@cml/cml` `isVictimArchetype` was written to close. The generic
context-stage runner (A1X-02) is the largest line reduction (~300) and makes R9 trivially correct.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A1X-01 | P1 | C | Detective/victim/name identity has 5+ bodies; two `isDetectiveArchetype`s disagree; Agent 2 reopens abort class #10 | R0 move · R2 unify | M | ≈ −80 |
| A1X-02 | P1 | B/C | One generic context-stage runner for 1/2/2b/2c/2d/2e; returns an outcome (R9 becomes trivial) | R1 | L (2–3 d) | ≈ −300 |
| A1X-03 | P1 | C/F | One JSON-artifact generator for 2b/2c/2d/2e; adopt `guardedJsonrepairParse` (2b/2c lack truncation guard) | R1 (R2 for 2b/2c guard) | M | ≈ −120 |
| A1X-04 | P1 | C/E | Cast boundary module: two normalisers, 3 suspect-pool top-ups, 5 archetype thresholds, 2 gender vocabularies | R1 (R2 gender/schema) | M | ≈ −130 |
| A1X-05 | P2 | B/I | `designCast` (426 LOC, cc 54, depth 7) → attempt loop over 4 named checks; blind legacy re-rolls | R1 (R2 retry policy) | M | ≈ −30 |
| A1X-06 | P2 | C | Bounded quality-gate loop written twice (2b voice, 2c scene) with divergent cost accounting | R1 | S | ≈ −60 |
| A1X-07 | P2 | A/C/D | Sensory-phrase normalisation: 4 bodies, lives in Agent 9, dead fallback helper, no-op `ignoreAtoms`, F5b can't fire | R1 (R2 F5b) | S | ≈ −30 (−55) |
| A1X-08 | P2 | C | Second month→season "single source of truth" in 2d; mandated date not enforced | R1 (R2 pin) | S | ≈ −5 |
| A1X-09 | P2 | F/G | "Cost of this call" re-derived from a cumulative tracker in 8 places; retries over-count; Agent 2 always 0 | R1 | S | ≈ −10 |
| A1X-10 | P2 | F/I | Agent 1 repair ladder runs in the wrong order; blind re-roll; duplicated realism fold | R2 (R1 fold) | S | ≈ −20 |
| A1X-11 | P2 | I | Prompt/token items: 2c rules repeated (13 % of system prompt), 2e double retry feedback, Agent 8 LLM computes overwritten fields | R2 | S | 0 (−1.3 k chars/2c call) |
| A1X-12 | P2 | C/E | Agent 8: threshold/weights in 3 bodies; summariser reads CML-1.x paths (14/14 "Victim: Unknown") | R1 (R2 edges) | S | ≈ −10 |
| A1X-13 | P2 | A/E | Type-level cycle `agent2-cast` ↔ `agent2-cast-checker`; background artifact typed 3× | R0 | S | ≈ −15 |
| A1X-14 | P3 | D/H | Compiler-dead locals, test-only export, 4× `simpleHash`, 2× LCG, 5 tri-state flag parsers, wrong memo | R0/R1 | S | ≈ −60 |
| A1X-15 | P3 | D | Production-unreachable branches (no-names cast prompt, realism belt, 2c narrative path) | R2 | S | ≈ −60 |

### A1X-01 — One identity concept, five-plus bodies; Agent 2 reopens abort class #10
- **P1 · lens C · R0 (moves) / R2 (predicate unification) · M**
- **Evidence (MEASURED + INFERRED):**
  - Two `isDetectiveArchetype`: `apps/worker/src/jobs/agents/identity-match.ts:71` (word-boundary + non-police
    qualifier denylist, used by agent2-run) and `packages/cml/src/roles.ts:47` (head-noun/"of"-split/possessive
    discipline, used by agent9-run.ts:1342/2296/4033/7041, mystery-orchestrator.ts:552, case-locked-facts.ts:158).
    MEASURED on 11 probe strings (dist builds): they disagree on 4 — "friend of the detective" (true/false), "the
    detective's landlady" (true/false), "Building Inspector" (false/true), "insurance investigator" (false/true).
    Consequence: a suspect who is an insurance investigator is a *detective* to Agent 9 (excluded from the
    elimination-suspect set → never cleared) but a *suspect* to Agent 2.
  - Third/fourth detective bodies: substring `/(detective|investigator|inspector|sleuth)/` in
    `agent2-cast-checker.ts:328` and (with `victim`) `agent2-cast-checker.ts:29` ≡ `agent2-cast.ts:222`
    (`isProtectedArchetype`); exact role/candidate sets in `agent2-cast.ts:823-834`; `looksDetective` in
    `agent2-run.ts:191-194`.
  - Victim: `enforceVictimRoleInvariant` resolves by `/victim/.test(archetype)` (`agent2-run.ts:481`, lock test
    `:500`), not `isVictimArchetype` (`roles.ts:12`, the abort-class-#10 fix). MEASURED probe (no `role` fields,
    cast order detective, "Friend of the victim", "victim", …): Mary Finch [Friend of the victim] → `role=victim`,
    Lord Ashby [victim] → `role=suspect`, `victimCandidates: ['Mary Finch']`, motive anchor synthesised to the
    wrong person. `checkCast` resolves the victim in yet another order (`agent2-cast-checker.ts:331-336`).
  - Names: `surname`/`namesMatch` duplicated in `agent9-prose/prose-blind-reader.ts:24-28` (identity-match's own
    comment says "mirrors"); name-or-surname word tests also in `regen-integration.ts:225,984`,
    `generate.ts:2255` with different surname-length floors (none / ≥3 / ≥4). `identity-match.ts` lives in
    `apps/worker`, so `prompts-llm` and `story-validation` cannot import it — the layering causes the copies.
  - `roleArchetypeIncludesWord` (`identity-match.ts:54`) has no production caller (repo-wide grep; test only) and
    embodies the word-boundary approach roles.ts documents as insufficient.
- **Proposal:** move `surname`, `namesMatch`, `nameAppearsAsWord` to `packages/cml/src/identity.ts` (@cml/cml has no
  internal deps and is a declared dependency of worker, prompts-llm, story-validation); re-export from the old path
  for one release. Add `resolveCastRoles(characters, crimeDynamics) → {detective, victim, suspects}` in the cast
  boundary module (A1X-04), built on `roleTextsOf`/`isDetectiveArchetype`/`isVictimArchetype`, and use it in
  `enforceVictimRoleInvariant`, `checkCast`, `designCast`'s top-up and `normaliseCastOutput`'s fallback. Fold the
  non-police qualifier set into `@cml/cml` `isDetectiveArchetype`. Delete identity-match's `isDetectiveArchetype`,
  `NON_DETECTIVE_QUALIFIER_RE`, `roleArchetypeIncludesWord` (+ its test block).
- **Benefit:** 5 detective predicates → 1, 3 victim predicates → 1, 3 surname matchers → 1; closes a reproduced
  abort-class-#10 door; ~−80 lines.
- **Verification:** moves = R0 (identical bodies; existing identity-match/reveal-gate tests). Unification is R2 (role
  tags reach prompts): first ship a shadow counter in Agent 2 logging `[identity-disagree]` when old and new
  predicates differ; ADR-0011 counter at zero over N runs, or owner accepts as a defect fix on the probe above.
- **Relates to:** A1X-04, A1X-13; Agent 6 and Agent 9 areas (consumers of both predicates).

### A1X-02 — One generic context-stage runner
- **P1 · lens B/C · R1 · L (2–3 days)**
- **Evidence (MEASURED):** 9 runners use the dual branch `if (ctx.enableScoring && ctx.scoreAggregator &&
  ctx.retryManager && ctx.scoringLogger)`; 6 are here. Dual-branch code: agent1-run.ts:26-75, agent2-run.ts:701-770,
  agent2b-run.ts:28-76, agent2c-run.ts:162-222, agent2d-run.ts:22-70, agent2e-run.ts:34-100 = 346 lines. Generator
  inputs are written 2–3× per runner (agent1-run.ts:31/65/161; agent2-run.ts:706/756/835; agent2b-run.ts:33/66/109;
  agent2c-run.ts:167/204/325). `executeAgentWithRetry` takes 12 positional params (shared.ts:707-724); its 8-arg tail
  is repeated verbatim in every runner. jscpd: 2c↔2d 27 lines, 2b↔2d 20, agent2-run self 22, 2↔2e 13, 1↔3b 12,
  2e↔3b 11, 2d↔65 10. `cml: undefined as any` in 5 scorer contexts (agent1-run.ts:46, agent2-run.ts:728,
  agent2c-run.ts:186, agent2d-run.ts:44, agent2e-run.ts:57). The copies have drifted (A1X-04 gender lock, A1X-11(b)).
  With feedback `undefined`, every scoring-path input equals the non-scoring input (`appendRetryFeedback(base,
  undefined) === base`), so the two branches collapse without byte change.
- **Proposal:** `apps/worker/src/jobs/agents/context-stage.ts`:
  ```ts
  interface ContextStageSpec<R, A> {
    agentId: string; phaseName: string; artifactKey: keyof OrchestratorContext;
    progress: { key: string; start: [string, number]; done: (a: A) => [string, number] };
    generate(ctx, feedback?: string): Promise<R>;          // feedback folding is per-agent (tone/theme/guardrails)
    score?(ctx, r: R): Promise<{ adapted: unknown; score: PhaseScore }>;  // adapter + honest scorer
    toArtifact(r: R): A; postProcess?(a: A, ctx, warnings: string[]): A;
    schema: { name: ArtifactName; onInvalid: "warn" | "throw" | RepairHook<A> };
    shadows?: ShadowCheck<A>[]; gate?: BoundedGateSpec<A>;   // A1X-06
    abortCritical?: boolean;
  }
  runContextStage(ctx, spec): Promise<StageOutcome<A>>  // {artifact, cost, durationMs, warnings[]}, no ctx mutation
  applyStageOutcome(ctx, outcome)                         // writes artifact, agentCosts, agentDurations, warnings
  ```
  plus `envMode(name)` (off/shadow/enforce) and a `RepairHook` implementing "deterministic repair → re-validate →
  (contract recovery) LLM re-roll with guardrails → throw" shared by Agents 1 and 2. Per-agent spec files: 2d ≈ 50
  lines (from 105), 2b ≈ 30 + gate, 2e ≈ 40 + derive shadow, Agent 1 ≈ 25 + pure `backfillSetting`, Agent 2 ≈ 70.
  **Keep out:** Agent 8 (runs inside Agent 3's novelty/CML-regeneration loop, agent3-run.ts:524-594) and Agent 2's
  domain pipeline (normalise → invariant) — the template hosts only its shell via `postProcess`/`RepairHook`;
  forcing Agent 2's repair semantics into generic options would hide the load-bearing ADR-0003 ordering. Score must
  stay *before* `postProcess` (today 1, 2, 2c score the raw LLM output) to be R1 — see §11 Q2.
- **R9:** today (orchestrator:1282-1328) the parallel branch shallow-clones ctx with a private warnings buffer and a
  suppressed `savePartialReport`, runs `Promise.all`, copies three artifact fields back by hand, merges buffers in
  fixed order, and relies on `agentCosts`/`agentDurations`/`errors` being shared by reference. With outcomes it is
  `const outs = await Promise.all(pending.map(s => runContextStage(ctx, s)))` then `outs.forEach(o =>
  applyStageOutcome(ctx, o))` — the sequential branch uses the same `apply`, so FLAG-AUDIT's R9 acceptance
  ("byte-identical artifacts") holds by construction and the clone/copy-back disappears (−30 lines).
- **Benefit:** ≈ −300 lines; runAgent2c cc 56 → ~10, runAgent2 34 → ~8, runAgent2b 31 → ~5, runAgent1 168 LOC → ~25.
- **Verification:** no runner has a direct test today (0 importers for 1/2b/2d/2e). Write first: per-runner
  characterisation tests with a mock client (capture `messages`, return fixtures) × `enableScoring` on/off,
  asserting ctx artifact, exact `warnings` order, cost/duration keys, LLM call count.
- **Relates to:** A1X-06, A1X-09, A1X-10; Agents 3b/6.5/7 areas (same dual branch).

### A1X-03 — One JSON-artifact generator for 2b/2c/2d/2e
- **P1 · lens C/F · R1 (R2 for adding the truncation guard to 2b/2c) · M**
- **Evidence:** identical shells in agent2b-character-profiles.ts:248-353, agent2c-location-profiles.ts:346-476,
  agent2d-temporal-context.ts:319-416, agent2e-background-context.ts:121-209: `withValidationRetry` +
  validationFn payload shim (2b:262-266, 2c:360-364, 2d:332-336) + `client.chat` + parse + cumulative cost +
  console logging (2b:309-323, 2c:452-466, 2d:392-406, 2e:184-198). jscpd: 2b↔2d 36 lines, 2c↔2d 32, 2d↔2e 25,
  2b↔2c 19, 2c↔2e 18, 2b↔2e 18. Divergence that matters: truncation guard present in 2d (`:365`) and 2e (`:162`),
  absent in 2b (`:291-296`, and `repairMissingParagraphs` `:233-237`) and 2c (`:389-394`) — the a3c2973f
  phantom-structure class `shared/json-boundary.ts` exists to stop; `guardedJsonrepairParse`
  (json-boundary.ts:40) is used by none of the four. Runners re-validate the same artifact for 2b/2e with no
  intervening change (double validation).
- **Proposal:** `packages/prompts-llm/src/shared/json-artifact-generator.ts` — `generateJsonArtifact<T>({client,
  label, configKey, schema, maxAttempts, buildMessages(prevErrors), structuralCheck?, withRunMeta?})` using
  `guardedJsonrepairParse` and per-call cost (A1X-09). 2c's atmosphere guard and the prompt builder's regex
  re-parsing of its own error strings (agent2c-location-profiles.ts:141-164) become structured error codes.
  `refineSetting` can adopt it later (A1X-10); `designCast` and `auditNovelty` should not (idiosyncratic).
- **Benefit:** ≈ −120 lines; 4 parse bodies → 1; closes the truncation hole in 2b/2c.
- **Verification:** snapshot the messages each generator sends (no prompt snapshots exist for this area; only
  agent5 has any) via a mock client, byte-equal before/after; `validation-retry-wrapper.test.ts` exists.
- **Relates to:** A1X-02, A1X-09; Agents 3/5/6/6.5 (same bare-jsonrepair inventory).

### A1X-04 — Cast boundary module: one normaliser, one vocabulary
- **P1 · lens C/E · R1 (R2 for gender vocabulary/schema) · M**
- **Evidence:**
  - Enum coercers duplicated verbatim: agent2-run.ts:94-153 vs agent2-cast.ts:657-733 & 674-684 (jscpd
    81-87≡799-804, 143-155≡674-685); crimeDynamics snake→camel: agent2-run.ts:82-85 ≡ agent2-cast.ts:800-803.
  - Gender: `designCast` is binary (agent2-cast.ts:666-673, A_73 §40 "the whole pipeline now agrees"); the runner
    still maps to `"non-binary"` (agent2-run.ts:118-126) and `schema/cast_design.schema.yaml:57` still allows it.
    Commit 40a98d90 (08-26, "binary cast by design") edited 5 bodies and missed these 2 (unreachable after
    designCast today, but a live second body).
  - Suspect-pool top-up ×5: designCast final attempt (agent2-cast.ts:818-866, uses config key
    `max_possible_culprits: 3` as a *minimum*), normaliseCastOutput (agent2-run.ts:201-203), and three inside
    `enforceVictimRoleInvariant` (steps 3 `:507-525`, 5 `:540-556`, A_56 `:563-584`), each with its own eligibility.
  - "70 % unique archetypes" ×5: agent2-cast.ts:215-218 (hard-coded, prompt), :542-545 (config),
    agent2-cast-checker.ts:130 default, agent2-cast-scorer.ts:414, agent2-cast-real-scorer.ts:268 (scorers count
    raw strings, generators normalised ones).
  - Placeholder character defaults ×3: agent2-cast.ts:634-647, :778-793, apps/api/src/server.ts:383-395.
  - Relationship-shape readers ×4: `normalizeRelationshipWeb` (agent2-cast.ts:99), agent2-run.ts:216-226,
    `checkCast.extractEdges` (agent2-cast-checker.ts:106-124 — ignores bare arrays, so the constrained-mode call at
    agent2-cast.ts:883 sees every node isolated), `adaptCastForScoring` (agent2-scoring-adapter.ts:51-56).
  - `normaliseCastOutput` (agent2-run.ts:79, 330 LOC, cc 67, **untested**, module-private) has 12 phases sharing
    only `{castRaw, characters, cd, warnings}` (+ `castNames` inside the relationship phases): little closure state.
- **Proposal:** `packages/prompts-llm/src/agent2-cast-boundary.ts`: `CAST_ENUMS`, `coerceMotiveStrength /
  AccessPlausibility / Tension / Gender` (binary), `normalizeCrimeDynamicsKeys`, `normalizeRelationshipWeb` (moved),
  `CAST_INVARIANTS = { minSuspects: 3, minArchetypeUniqueRatio: config }`, `PLACEHOLDER_CHARACTER`,
  `resolveCastRoles` (A1X-01), `computeSuspectPool(cast, roles)`, and `normaliseCastArtifact(raw) → {cast,
  repairs[]}` as a ~40-line coordinator over: coerceKeys → coerceEnums → resolveGenders → deriveCrimeDynamics →
  normaliseRelationships (lift nested, merge/dedupe, ring floor) → enforceVictimRoleInvariant → coerceDiversity.
  `designCast` and `runAgent2` call the same coercers. Also apply the user's `castGenders` deterministically here
  (§9 D4). This is the module S7/constrained decoding (redesign 02 §4.2) would later delete in one piece.
- **Benefit:** normaliseCastOutput cc 67 → phases ≤ 12; enforceVictimRoleInvariant 205/cc 52 → ~90/cc ~20;
  ≈ −130 lines; one gender vocabulary; one suspect-pool rule.
- **Verification:** R0 extraction first (move phases verbatim); characterisation tests for normaliseCastOutput on
  3–4 raw LLM-shaped fixtures (bare-array relationships, nested relationships, snake_case, missing gender) with
  exact warnings; agent2-victim-repair/culprit-topup tests exist. Merging the top-up rules is R1 (subtle order
  differences — preserve by test); gender/schema is R2.
- **Relates to:** A1X-01, A1X-05, A1X-13; scoring-adapters area.

### A1X-05 — `designCast`: an attempt loop over named checks
- **P2 · lens B/I · R1 (R2 for retry policy) · M**
- **Evidence:** agent2-cast.ts:533 (426 LOC, cc 54, depth 7). Four checks (count :605-652, required fields
  :736-794, culprit count :807-866, archetype diversity :872-924) each repeat the same tri-modal pattern: before the
  final attempt `continue` (with feedback only if `AGENT2_CONSTRAINED_CAST`), on the final attempt repair (legacy)
  or throw (constrained). Gender normalised twice (:720-726 and :935-938). Blanket `catch` swallows non-final
  errors silently (:949-954). Legacy mode re-sends the same prompt (only temperature escalates) on culprit /
  archetype misses that the final attempt — and then `enforceVictimRoleInvariant` — fix deterministically: up to 2
  extra cast calls (~9.8 k-char prompt, MEASURED) per miss.
- **Proposal:** `type Verdict = {ok: cast} | {retry: feedback?} | {fail: Error}`; `CAST_CHECKS = [countCheck,
  requiredFieldsCheck, culpritCountCheck, archetypeDiversityCheck]`, each `(cast, {attempt, isFinal, constrained})`;
  state in a `CastAttemptContext {dynamicGuardrails, expectedCount, requiredUniqueArchetypes, config}`; designCast
  becomes a ~70-line loop. Separately (R2, owner): skip the re-roll for deterministically fixable misses.
- **Benefit:** cc 54 → ~10 + 4 × ≤ 10; depth 7 → 3.
- **Verification:** agent2-cast-stop-bleeding + diversity tests (mock chat) exist; add prompt-capture per retry path.
- **Relates to:** A1X-04, A1X-11.

### A1X-06 — One bounded quality-gate helper
- **P2 · lens C · R1 · S**
- **Evidence:** agent2b-run.ts:92-141 and agent2c-run.ts:287-378 share mode parse, env retry ceiling, regenerate-
  with-feedback via `appendRetryFeedback(tone)`, cost/duration accumulation, accept-if-better, `gate=pass|accept-
  after-N|shadow` summary and per-issue warnings. Divergent: 2b adds the generator's cumulative `.cost`
  (agent2b-run.ts:117 → over-count) while 2c uses the before/after tracker delta (agent2c-run.ts:320-341, with a
  comment explaining why); 2c catches regeneration errors and re-validates schema, 2b does neither.
- **Proposal:** `apps/worker/src/jobs/agents/quality-gate.ts` `runBoundedGate<T>({mode, maxRetries, initial,
  evaluate(T)→{issues, pass}, isBetter(cand, best), regenerate(feedback), validate?, feedback, label})`; plugs
  into `ContextStageSpec.gate`.
- **Benefit:** ≈ −60 lines; one cost rule; both flags default OFF so safe to land.
- **Verification:** shadow/enforce tests with a mock regenerator (only the pure predicates are tested today:
  agent2b-voice-gate.test.ts, agent2c-location-distinctness.test.ts).
- **Relates to:** A1X-02, A1X-09; Agent 3b plausibility judge, Agent 6 reveal gate (same shape).

### A1X-07 — Sensory-phrase normalisation: four bodies, wrong package, dead parts
- **P2 · lens A/C/D · R1 (R2 for F5b) · S**
- **Evidence:** `compileSensoryAtoms` lives in `agent9-prose/phrase-analysis.ts:293` but its only callers are
  agent2c-run.ts:199/219/345 (import at `agent9-prose/prompt-blocks.ts:13` is unused). Two "is it a sentence"
  predicates with different verb lists (phrase-analysis atomiser vs `CONJUGATED_VERB_RE`, agent2c-run.ts:29-37).
  The F5b bleed warning (agent2c-run.ts:233-258) runs *after* `enforceLocationSensoryFallbacks` has dropped every
  entry `isFullSentenceBleed` matches (`:88`), so it can only fire on the pipeline's own fallback text (a room
  named e.g. "Rose Room"). `buildLocationFallback` (`:94-106`) restates `SENSORY_FALLBACK_VARIANTS[f][0]` and both
  call sites are unreachable (`:126` index 0/1 always defined; `:142` field already padded). `SENSORY_FALLBACK_ATOMS`
  (`:74-79`) uses `/s+/g` (letter s): MEASURED values `"hadowed corner in"`, `"ubdued noi e carrying through"`…; and
  even with `\s+` the stem cannot equal a room-named atom under exact `Set.delete` (MEASURED: `"shadowed corners in
  the study"` not ignored either way) → `ignoreAtoms` is a no-op since commit 51db0d1a (08-21). 13 `any` in the
  runner for a typed `LocationProfilesResult`.
- **Proposal:** `packages/prompts-llm/src/agent2c-sensory.ts` holding atomiser, one predicate, fallback variants and
  a pure `enforceSensoryFallbacks(profiles) → {profiles, insertions}`; delete `buildLocationFallback`,
  `SENSORY_FALLBACK_ATOMS` and the `ignoreAtoms` option (no-op, MEASURED); F5b: delete, or move before the filter so
  it counts what was dropped (R2, owner).
- **Benefit:** ≈ −30 lines (−55 with F5b); removes an Agent-9 → Agent-2c layering inversion.
- **Verification:** a58-sensory-bleed.test.ts; add a fallback-insertion snapshot on a sparse fixture.

### A1X-08 — Month→season: a second "single source of truth"
- **P2 · lens C · R1 (R2 for date pinning) · S**
- **Evidence:** `deriveSeasonFromMonth` (agent2d-temporal-context.ts:115-121, "single source of truth", `fall`,
  unknown → winter) vs `shared/temporal-anchor.ts:37-72` (`MONTH_TO_SEASON`/`monthToSeason`, "single source of
  truth", `autumn`, unknown → undefined) which Agent 9's lint already imports (lint.ts:14); third copy in
  story-validation/temporal-consistency.ts:3. `deriveTemporalAnchor` (temporal-anchor.ts:172) has no production
  caller, while agent2d-run.ts:77 re-pins the season from the *LLM-returned* month it calls "mandated".
- **Proposal:** `deriveSeasonFromMonth = m => SCHEMA_SEASON[monthToSeason(m) ?? "winter"]` with `autumn → fall`.
  Optional R2: pin `specificDate.{year,month}` from `deriveTemporalAnchor(decade, runId || projectId)`.
- **Benefit:** ADR-0005 compliance for the season-lock family (README §11).
- **Verification:** 13-case test (12 months, casing/whitespace, unknown); temporal-anchor.test.ts pattern.

### A1X-09 — Cost of a call: eight bodies, wrong in both directions
- **P2 · lens F/G · R1 (telemetry only; ADR-0004 exempt — no prompt/chapter byte changes) · S**
- **Evidence:** generators read `getSummary().byAgent[label]` — cumulative per run (cost-tracker.ts:136-157):
  agent1-setting.ts:327, 2b:303, 2c:446, 2d:386, 2e:178, agent8-novelty.ts:366. `withValidationRetry` sums per
  attempt (validation-retry-wrapper.ts `totalCost += cost`), `executeAgentWithRetry` sums per attempt
  (shared.ts:735), runners add again (agent1-run.ts:169, agent2-run.ts:847, agent2b-run.ts:117) → k attempts report
  the sum of prefix sums. `designCast` returns `cost: 0` ("not available in simplified client", agent2-cast.ts:947)
  → Agent 2 is always 0 in `totalCost = Σ agentCosts` (orchestrator:1645). The correct delta pattern exists at
  agent2c-run.ts:320-341 and agent3b. `trackCost` already returns the per-call cost (client.ts:388) but
  `ChatResponse` (llm-client types.ts:69-75) drops it.
- **Proposal:** add `cost?: number` to `ChatResponse`; generators use `response.cost` (inside A1X-03's helper,
  designCast, refineSetting, auditNovelty); delete all byAgent reads in this area.
- **Benefit:** one source; fixes over-count on retries and Agent 2's zero. Note for owner: report cost numbers change.
- **Relates to:** A1X-03, A1X-06; every agent (cross-area).

### A1X-10 — Agent 1's repair ladder runs in the wrong order
- **P2 · lens F/I · R2 (R1 for the fold merge) · S**
- **Evidence:** `refineSetting` spends an LLM re-roll on a missing top-level key (agent1-setting.ts:281-296) that
  the runner's free `backfillSettingArtifact` (agent1-run.ts:102-143, a 42-line closure) would fill. The runner's
  schema-repair re-roll (agent1-run.ts:159-168) re-sends the identical prompt although its warning says "with schema
  repair guardrails" (`SettingInputs` has no guardrails field). The realism fold exists twice (agent1-setting.ts:
  298-323 and agent1-run.ts:77-97); the runner copy is unreachable because refineSetting always clears the arrays.
  `refineSetting` passes `model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!` (:246), which beats the A_73 router, so
  `AGENT1_MODEL` can never take effect (§9 D6).
- **Proposal:** move a pure `backfillSetting(raw, {decade, location, institution})` and `foldRealismNotes()` into
  agent1-setting.ts; run backfill before the structural check; drop the explicit model; either pass real guardrails
  on re-roll or reword the warning.
- **Benefit:** fewer LLM calls on the rare failure path; ≈ −20 lines; one fold.

### A1X-11 — Prompt and token items (cite; owner decides)
- **P2 · lens I · R2 · S**
- (a) 2c prompt: sensory-format rule 3× (433 + 501 + 476 chars) and F30-5 minimum 2× (357 + 293) — MEASURED ≈ 1,270
  redundant chars of 9,801 system+developer (13 %) on every 2c call. The schema exemplar (agent2c-location-
  profiles.ts:221-253) contains "beeswax", "damp stone", "tick of a mantel clock", "long shadows" — the atoms its own
  distinctness rule (:265) forbids repeating and the 08-21 fallback review removed as setting-specific.
- (b) 2e appends retry feedback to both `theme` and `tone` (agent2e-run.ts:42-43) → "Retry guidance" twice.
- (c) Agent 8 asks for `status/overallNovelty/highestSimilarity/mostSimilarSeed/overallSimilarity`, all
  recomputed and overwritten (agent8-novelty.ts:395-424); only per-dimension scores and notes are needed.
- (d) 2e copies 5 of 7 fields (derive module proves it) — already argued in redesign 06 §4; cite, don't redo.
- (e) independent `repairMissingParagraphs` calls run sequentially (agent2b:330-345) — rare path; `Promise.all`.
- Magnitude: (a) every run; the rest rare or (c) only when Agent 8 runs (`NOVELTY_SIMILARITY_THRESHOLD=1.0` in
  `.env.local` per FLAG-AUDIT → skipped in production). Verify with the prompt-eval harness
  (agent1-agent2-prompt-eval, agent2b-8-prompt-eval) plus a probe.

### A1X-12 — Agent 8: policy in three bodies; summariser reads CML 1.x
- **P2 · lens C/E · R1 (R2 at out-of-range edges) · S**
- **Evidence:** effective threshold guarded to (0,1) in `buildNoveltyPrompt` (agent8-novelty.ts:72-80) but not in
  `auditNovelty` (:389-393) → prompt and verdict disagree for out-of-range inputs; fail band `+10` hard-coded in the
  prompt (:270-272) vs `config.thresholds.fail_delta`; weights in prompt text (:261-266), config, and a display
  string (agent3-run.ts:633). `summarizeCML` reads `setup/solution` paths absent from CML 2.0: MEASURED over the 13
  real seeds + 1: 14/14 "Victim: Unknown", 14/14 "Motive: Unknown", crime = method = solution method (§9 D3). No
  retry/repair on parse; a parse failure propagates out of runAgent3 (no try around agent3-run.ts:529-541).
  Overlap with `packages/novelty` / `novelty-*.ts`: same question, different mechanism (LLM 5-dimension similarity
  vs deterministic fingerprint verdict), no shared code — a strangler in progress; do not merge.
- **Proposal:** `resolveNoveltyPolicy(inputs, config) → {threshold, failThreshold, weights}` computed once, passed to
  the prompt and exported for agent3-run's message; read CML 2.0 paths (`cast[].role`, `hidden_model.mechanism`,
  `cast[].motive_seed`) — R2 (prompt bytes).
- **Verification:** agent8.test.ts (prompt tests) + byte-equal prompt for in-range thresholds.

### A1X-13 — Type-level cycle and triplicated artifact types
- **P2 · lens A/E · R0 · S**
- **Evidence:** agent2-cast-checker.ts:20 imports types from agent2-cast.ts, which imports `checkCast` (agent2-cast.ts:13)
  — metrics.md reports the 2-file type cycle. 2b/2e/derive also import `CastDesign` from the generator module
  (agent2b-character-profiles.ts:12, agent2e-background-context.ts:14, agent2e-background-derive.ts:32). Background
  artifact typed three times: `BackgroundContextArtifact` (agent2e:17-31), `BackgroundContextInput`
  (types.ts:91-105, jscpd 16 lines), story-validation scorer's own `BackgroundContextInput`.
- **Proposal:** leaf `agent2-cast-types.ts` (no imports) holding `CharacterProfile`, `RelationshipWeb`,
  `CastDesign`, `CastDesignResult`, `CastInputs` (or the A1X-04 boundary module); agent2-cast.ts re-exports so
  index.ts:215 is unchanged; `BackgroundContextInput = BackgroundContextArtifact` alias.
- **Verification:** `tsc --noEmit`; metrics tool cycle list empty.

### A1X-14 — Mechanical dead code and duplicate utilities
- **P3 · lens D/H · R0 (dead) / R1 (merges) · S**
- MEASURED `tsc --noUnusedLocals`: `TENSIONS` (agent2-cast-checker.ts:24), `location` (agent2c-location-profiles.ts:105),
  `retriesEnabled` (agent1-run.ts:22, agent2-run.ts:687), unused import `appendRetryFeedback` (agent2d-run.ts:14).
- `roleArchetypeIncludesWord` test-only (A1X-01). 36 type exports in area files have no user outside their file
  (export-usage.md) — un-export when files split.
- `simpleHash` ×4 (agent1-setting.ts:71 `>>>0`; agent2-cast.ts:135, name-generator.ts:19, temporal-anchor.ts:78
  `Math.abs`) and LCG ×2 (agent2-cast.ts:151-171, name-generator.ts LCG class): merge the core, keep each
  finalisation at the call site (seed bytes must not change; golden test).
- Tri-state flag parsing ×5 in area (agent2-run.ts:873-874, agent2b-run.ts:92-94, agent2c-run.ts:266-267,
  agent2e-run.ts:121-122, `parseSceneGateMode`) with off-words {off,false,0} while other flags also accept "no".
- `checkCastMemo` (agent2-run.ts:51-70): a microsecond saving that returns a stale result (§9 D5) — delete (R1).
- Lens H otherwise: negligible everywhere here (O(n²) over ≤ 10 characters/locations vs 5–60 s LLM calls).

### A1X-15 — Production-unreachable branches
- **P3 · lens D · R2 (ADR-0011: not compiler-provable) · S**
- `buildCastPrompt`'s no-names branch and naming directives (agent2-cast.ts:439-443, 465-470) plus
  `deriveNameInitials`/naming pools (:151-206): runAgent2 always passes names (agent2-run.ts:699); a second
  naming-pool vocabulary beside name-generator.ts. Agent 1 realism belt (A1X-10). 2c `narrative` path — always
  undefined (already documented by R2 at agent2c-location-profiles.ts:92-99). Evidence route: report warning counts
  ("Agent 1: folded … residual realism note(s)") at zero; examples/agent2-demo.ts is the only no-names caller.

## 4. Target structure

```
packages/cml/src/identity.ts                 surname, namesMatch, nameAppearsAsWord           ~40
packages/cml/src/roles.ts                    + non-police qualifier in isDetectiveArchetype  (+5)
packages/prompts-llm/src/
  agent2-cast-types.ts                        cast types (leaf)                                ~90
  agent2-cast-boundary.ts                     enums, coercers, invariants, resolveCastRoles,
                                              computeSuspectPool, normaliseCastArtifact        ~380
  agent2-cast.ts                              prompt + designCast loop + CAST_CHECKS           ~620 (from 958)
  agent2-cast-checker.ts                      checkCast (uses resolveCastRoles)                ~450
  agent2c-sensory.ts                          atomiser, predicate, fallbacks                   ~130
  shared/json-artifact-generator.ts           generateJsonArtifact                             ~80
  agent2b/2c/2d/2e generators                 prompt + spec call                               −25 to −45 each
apps/worker/src/jobs/agents/
  context-stage.ts                            runContextStage, applyStageOutcome, RepairHook   ~130
  quality-gate.ts                             runBoundedGate                                   ~50
  agent1-run.ts ~40 · agent2-run.ts ~150 (from 889) · agent2b ~55 · agent2c ~80 · agent2d ~50 · agent2e ~80
  identity-match.ts                           deleted (re-export shim for one release)
```

## 5. Suggested sequence

1. **R0 hygiene:** A1X-14 dead locals; A1X-13 leaf types + alias. (S)
2. **Safety net:** prompt/message snapshot tests for all 7 generators via mock client; runner characterisation
   tests (1/2/2b/2c/2d/2e × scoring on/off); normaliseCastOutput fixtures. (M)
3. **A1X-09** per-call cost (llm-client + area generators). (S)
4. **A1X-03** generator helper (2d/2e first — byte-equal; then 2b/2c with the truncation guard as R2). (M)
5. **A1X-01 moves (R0)**, then the identity-disagreement shadow counter; unify on evidence (R2). (M)
6. **A1X-04** cast boundary: extract verbatim (R0) → merge coercers (R1) → gender/schema (R2). (M)
7. **A1X-05** designCast checks. (M)
8. **A1X-02** stage runner (2d → 2b → 2e → 2c → 1 → 2), then **A1X-06** gate helper, then rewrite the R9 block. (L)
9. **A1X-07, A1X-08, A1X-10, A1X-12** in any order. (S each)
10. R2 queue for the owner: A1X-11, A1X-15, F5b, date pinning, retry-policy items.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `AGENT_PRE9_ENABLE_LLM_RETRIES` | OFF | shared.ts:662 (via executeAgentWithRetry); dead reads agent1-run.ts:22, agent2-run.ts:687 | unregistered group, "default OFF" | gates the scoring loop in every runner |
| `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` | **ON** (`if (!raw) return true`, shared.ts:697-705) | agent1-run.ts:23, agent2-run.ts:688 | listed as **default OFF** — register is wrong | enables schema re-roll in 1 & 2 |
| `AGENT2_CAST_CHECK` | OFF | agent2-run.ts:873 | default OFF | inline shadow → `shadows[]` |
| `AGENT2_CONSTRAINED_CAST` | OFF | agent2-cast.ts:552 | default OFF | doubles every designCast check branch (A1X-05) |
| `AGENT2B_VOICE_CHECK` / `_MAX_RETRIES` | OFF / 1 | agent2b-run.ts:92, :97 | default OFF / CONFIG | gate loop (A1X-06) |
| `AGENT2C_SPINE_CHECK` | OFF | agent2c-run.ts:266 | default OFF | shadow |
| `AGENT2C_SCENE_GATE` / `_MAX_RETRIES` | OFF / 1 (cap 2) | agent2c-run.ts:287, :304 | default OFF / CONFIG | gate loop; dead `ignoreAtoms` (A1X-07) |
| `AGENT2E_DERIVE_BACKGROUND` | OFF | agent2e-run.ts:121 | default OFF | "stage is deletable" evidence (redesign 06) |
| `HONEST_SCORERS` | OFF | shared.ts:679 via applyHonestScorer (1, 2, 2c, 2e) | not in register | scorer selection inside `score` |
| `AGENT_PROFILES_PARALLEL` | OFF | mystery-orchestrator.ts:859 | DEFER (byte-identical probe) | R9 clone/copy-back (A1X-02) |
| `ENABLE_SCORING` | OFF | mystery-orchestrator.ts:882 | — | the dual branch in all 6 runners |
| `AZURE_OPENAI_DEPLOYMENT_NAME` (explicit model) | set | agent1-setting.ts:246 | CONFIG | defeats `AGENT1_MODEL` routing |

## 7. Safety net

- **Pinned:** identity-match.test.ts; agent2-victim-repair + agent2-culprit-topup-a56 (enforceVictimRoleInvariant);
  agent2-cast-checker, agent2-cast-stop-bleeding, agent2-cast-diversity (designCast with mock chat); agent2.test,
  agent1.test, prompt-eval harnesses (string-presence scores ≥ 85/90); voice-capsule/gate, distinctness, spine,
  temporal-anchor, agent2e-background-derive, agent8.test (prompt), a58-sensory-bleed, validation-retry-wrapper,
  resume-parallel-profiles (R9 × resume selection only).
- **Gaps:** no test calls any runner (runAgent1/2/2b/2c/2d/2e), `refineSetting`, the 2b/2c/2d/2e generators or
  `auditNovelty`; `normaliseCastOutput` (330 LOC) untested; no prompt snapshots for any area prompt.
- **Write first:** (1) mock-client message snapshots for the 7 generators (incl. retry paths); (2) runner
  characterisation (artifact, warnings order, cost keys, call count) × scoring on/off; (3) normaliseCastOutput
  fixtures; (4) `deriveSeasonFromMonth` 13-case table; (5) identity predicate table (the 11 strings above).
- `agent9-replay.ts` hydrates upstream artifacts, so it is **not** a net for this area.

## 8. What NOT to refactor

- **Prompt builders** (buildCastPrompt 240, buildLocationProfilesPrompt 245, buildTemporalContextPrompt 195,
  buildSettingPrompt 123): long because they are literal prompt text; the house "Quality bar / Micro-exemplars /
  silent checklist" sections are scored by the prompt-eval harness. Only extract logic (2c atmosphere feedback,
  detective-type ternaries → a table), never split the text.
- **checkCast** (337 LOC, cc 56): flat (depth 3), pure, tested; cc is `?.`/`??`. Extract only `resolveCastRoles`.
- **Repair-not-abort ordering** in Agent 2 (normalise → victim invariant → deterministic backfill → LLM re-roll) is
  ADR-0003/0007 policy; the stage runner must host it as a hook, not flatten it.
- **Score-before-postProcess** ordering (1, 2, 2c) — preserve for R1; changing it is an owner decision (§11 Q2).
- **Agent 8 vs packages/novelty**: parallel by design during the redesign; retire agent8-novelty when the skeleton
  judge is promoted, don't merge.
- **The A_53 P10 Sets/Maps** in enforceVictimRoleInvariant are harmless; leave them (but drop checkCastMemo).

## 9. Incidental defects

| # | Defect | Evidence | Confidence |
|---|---|---|---|
| D1 | Agent 2 designates a relational "Friend of the victim" as the victim when `role` is absent (abort class #10 via substring) | agent2-run.ts:481/500; MEASURED probe (A1X-01) | High (predicate); reachability needs LLM to omit `role` |
| D2 | `SENSORY_FALLBACK_ATOMS` uses `/s+/g`; `ignoreAtoms` is a no-op either way | agent2c-run.ts:79; MEASURED | High; no behaviour impact (fallbacks now room-named) |
| D3 | Agent 8 summariser reads CML-1.x paths: every summary "Victim: Unknown", "Motive: Unknown" | agent8-novelty.ts:153-164; MEASURED 14/14 on real seeds | High; live only when the audit runs |
| D4 | Agent 2 schema re-roll drops `characterGenders` (user gender lock); nothing enforces `castGenders` deterministically (comment at agent2-cast.ts:660-665 claims the caller fills from the map; no caller does) | agent2-run.ts:835-846 vs :708/:758; agent3-run.ts:177 | High (drop); Medium (impact) |
| D5 | `checkCastMemo` returns the pre-normalisation check to the AGENT2_CAST_CHECK shadow (same object, mutated in place) when HONEST_SCORERS is on | agent2-run.ts:51-70, 737, 776, 878 | High; telemetry only |
| D6 | Agent 1 passes an explicit model, so `AGENT1_MODEL` routing can never apply (router header says Agent 1 passes none) | agent1-setting.ts:245-246; client.ts:264 | High |
| D7 | FLAG-AUDIT lists `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` as default OFF; code is default ON | shared.ts:697-705; FLAG-AUDIT Addendum 5 | High |
| D8 | Agent 2 cost always 0; retries over-count elsewhere | A1X-09 | High |
| D9 | Agent 8 has no parse repair/retry; failure propagates out of runAgent3 | agent8-novelty.ts:378-382; agent3-run.ts:529 | Medium (frequency unverifiable) |
| D10 | Agent 1 re-roll warning claims "schema repair guardrails" but sends the same prompt | agent1-run.ts:159-168 | High |
| D11 | 2b repair/feedback pairs profile *i* with cast character *i* by index (wrong source if the model reorders) | agent2b-character-profiles.ts:105, 196 | Low–Medium |
| D12 | Misleading telemetry: 2e derive always says "only backdropSummary differs" (agent2e-run.ts:155); 2d comment says schema errors are errors, code warns (agent2d-run.ts:75 vs 90-96); Agent 8 duration overwritten on re-audit (agent3-run.ts:537) | cited | High; cosmetic |
| D13 | `prompts-llm` imports `@cml/story-validation` in 27 files without declaring it (workspace hoisting) | packages/prompts-llm/package.json | High; cross-area |

## 10. Cross-area observations

- The dual scoring/non-scoring branch and the 12-positional-arg `executeAgentWithRetry` are in 9 runners (3b, 6.5, 7
  too); A1X-02's runner and an options-object signature serve all of them.
- "Cost from the cumulative per-label tracker" is in every generator repo-wide (Agents 3, 3b, 4, 5, 6, 6.5, 7);
  fix once at `ChatResponse.cost`.
- Bare `jsonrepair` without the truncation guard survives outside the Ph8 inventory (2b, 2c here); grep others.
- Tri-state off/shadow/enforce parsers: `parseSceneGateMode`, `parseRevealGateMode`, `parseHonestScorerMode`,
  `parsePlausibilityJudgeMode` + inline copies — one helper in a low package.
- Role/identity predicates must live in `@cml/cml`; any copy in `apps/worker` guarantees a prompts-llm twin.
- "Single source of truth" comments exist on two bodies of the same fact (season) — grep for that phrase.
- Bounded regenerate-with-feedback gates (2b, 2c, 3b judge, 6 reveal gate) share one shape.
- Agent 8 sends a separate `developer`-role message while every other agent concatenates system+developer
  (UNVERIFIABLE whether the deployment treats them identically).

## 11. Open questions for the owner

1. Which detective semantics win when unified — head-noun/relational exclusion (`@cml/cml`), non-police qualifier
   exclusion (identity-match), or both (proposed)? Accept the D1 probe as a defect fix, or require a counter?
2. Should phase scores measure the raw LLM output (today for 1, 2, 2c) or the shipped, post-processed artifact?
3. Enforce the user's `castGenders` deterministically in Agent 2 (D4)?
4. Pin 2d's `specificDate` to the hashed anchor rather than trusting the LLM (A1X-08)?
5. Delete F5b and the Agent 1 realism belt on the evidence of zero report counts, or keep as belts?
6. Is Agent 8 (LLM) still meant to run anywhere, given `NOVELTY_SIMILARITY_THRESHOLD=1.0`? If not, fix D3 or freeze it.
7. For legacy (non-constrained) Agent 2, skip re-rolls for deterministically fixable misses (A1X-05)?
