# @cml/device-library

A curated, era-annotated **hard-logic mechanism pattern library** plus deterministic **retrieval**
and **feasibility** services.

This is the **first increment** of the Agent 3b redesign — see
[`documentation/12_system_redesign/08_agent_3b_hard_logic_devices.md`](../../documentation/12_system_redesign/08_agent_3b_hard_logic_devices.md)
(§9.7: *"Author the device-library schema + seed ~10 vetted patterns + the deterministic
era+axis+family retrieval filter — offline, nothing wired into the live run"*). It is the data asset
every later phase recombines against, and it unblocks Spike A.

> **Status: pure, zero external deps beyond ajv/js-yaml, NOT wired into the pipeline.** The live 3b
> still runs its five-device ideation path. The two LLM/keystone-gated phases — **recombination**
> under structured output (§4.2, needs P2) and the **CML binding checker** (§4.4, needs the Agent 3
> typed core) — are deliberately deferred.

## Why it exists

Today Agent 3b free-associates five mechanism ideas, never checks they're **physically possible in
the story's era**, and hands the winner to Agent 3 as a polite suggestion nobody verifies the proof
followed. The redesign is **retrieve → recombine → prove**. This package builds the two
deterministic ends of that loop:

- **Retrieve** ([retrieve.ts](src/retrieve.ts)) — a cheap, no-LLM filter over the corpus by era,
  primary axis, and mechanism family, ranked by novelty (least-used first). Replaces the five-device
  brainstorm fan-out.
- **Prove feasibility** ([feasibility.ts](src/feasibility.ts)) — the gate the current pipeline lacks:
  a device is feasible only if every capability it **requires** is available in the era, no capability
  it **forbids** is available (else the era defeats the trick), and it doesn't require something it
  forbids. *"No DNA, no CCTV, no phone-records in 1931."*

The **recombine** step in the middle (an LLM synthesising one novel device from the retrieved
shortlist) is the part that needs a model and is out of this increment's scope.

## The corpus

11 vetted patterns ([data/patterns/](data/patterns/)) across all five families
(timing, spatial_routing, identity, authority, behavioral) — distilled from Golden-Age conventions
and the §4.6 worked example, each annotated with `feasibility.{eras, requires, forbids}`,
`clue_archetypes`, and provenance `sources`. Schema:
[`schema/device_library.schema.yaml`](../../schema/device_library.schema.yaml).

## Spike A (the §9.1 go-signal)

```ts
import { retrievePatterns, checkFeasibility, makeStubOracle } from "@cml/device-library";

// §4.6 fen-country boarding school, 1931, primary axis temporal, family timing
const ranked = retrievePatterns({ decade: 1930, primaryAxis: "temporal", mechanismFamilies: ["timing"] });
// → 5 compatible patterns (clock_rewind, recorded_presence, tidal_window, delayed_poison, hearth_release)

const oracle = makeStubOracle(1931);
checkFeasibility(ranked[0].pattern, oracle).feasible;        // true
checkFeasibility(byId("recorded_presence"), makeStubOracle(1880)).reason;
// "infeasible — era lacks required: sound_recording_playback."
```

≥3 compatible patterns on a typical seed is the spike's pass criterion; the corpus returns **5**.

## The feasibility oracle

`checkFeasibility(pattern, oracle)` takes an injectable `EraCapabilityOracle`. This package ships a
decade-keyed **stub** ([era-capabilities.ts](src/era-capabilities.ts)) — exactly the §9.3 fallback
("if Agent 1 hasn't shipped that contract yet, I stub it") — covering every capability the seed
patterns reference. The intended real oracle is **Agent 1 / `@cml/period-kb`**; because the oracle is
injected, swapping it in later changes nothing in the checker.

## Tests (23)

- **Spike A / retrieval** — ≥3 compatible patterns for the fen-school seed; era/axis/family/place
  filtering; novelty ranking.
- **Feasibility invariants (§9.4)** — a feasible device's `requires ⊆ era capabilities`;
  `requires ∩ forbids = ∅`; anachronistic dependency rejected (gramophone in 1880, DNA in 1931);
  era-defeats-trick rejected (voice-auth vs the recorded-voice alibi); the gate is **not inert**
  (rejects ≥1 pattern off-era).
- **Corpus integrity** — every pattern schema-valid; ids unique; all five families present; every
  `requires`/`forbids` capability is known to the era model (no typos).

```bash
npm run -w @cml/device-library test         # vitest (23 tests)
npm run -w @cml/device-library type-check   # tsc --noEmit
npm run -w @cml/device-library build        # tsc → dist/ (gitignored)
```

## What's next on the §7 ladder

1. **Recombination** prompt (one device, strict structured output) — needs P2.
2. **Feasibility wired to the real period-kb oracle** + LLM plausibility judge with failure-feedback.
3. **Device-as-typed-constraint + binding checker** in the Agent 3 typed CML core (§4.4) — the
   highest-value phase; makes "did the CML honor its mechanism" a provable property.
4. **Fold 3b into Agent 3** as the mechanism sub-step, keeping library/retrieval/feasibility as
   shared services.
