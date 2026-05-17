# ANALYSIS_20 — Phased Implementation Plan

**Date:** 2026-05-16  
**Validation baseline:** `npm run canary:core` — each phase must produce EXIT:0 before proceeding to the next.

---

## Build + Test Cycle (all phases)

```powershell
# After every code change:
npm run -w @cml/worker build       # rebuild dist — stale dist is the #1 false-failure cause
npm run canary:core                # full pipeline; must exit 0
```

Agent 9-only changes do not require a worker build. Changes to `packages/prompts-llm/src/**` require:
```powershell
npm run -w @cml/prompts-llm build
npm run -w @cml/worker build
npm run canary:core
```

---

## Phase 1 — Fix Template Bleed at the Source (BLUE-A + BLUE-B)

**Issues resolved:** A20-TB-1, A20-TB-2, A20-TB-3, A20-TB-4, A20-CF-1  
**Risk:** Very low. No LLM prompt structure change, no new fields.  
**Estimated scope:** ~90 lines across 2 files.

### 1a — Agent 2c Schema: Noun Phrases Instead of Sentences

**File:** `packages/prompts-llm/src/agent2c-location-profiles.ts`

**Change 1 — Schema example strings** (~L210–213):
Replace `"Full 2-sentence ..."` strings in the schema JSON example with noun-phrase format:
```
Before: "sounds": ["Full 2-sentence sound description — ambient and specific noises", ...]
After:  "sounds": ["crackling fire", "pages turning in the silence"]
```
Apply the same transform to `sights`, `smells`, `tactile`.

**Change 2 — Critical Sensory Richness instruction** (~L256):
```
Before: Each sensory detail entry MUST be a full 2-sentence description (minimum 20 words per entry).
        Arrays of one-word items or short phrases WILL be rejected.
After:  Each sensory detail entry MUST be a short noun phrase or gerund (3–8 words, no verbs, no
        complete sentences). Full sentences WILL be rejected. Examples:
        ✓ "crackling fire"  ✓ "damp stone underfoot"  ✓ "wood smoke and tallow"
        ✗ "The fire crackles in the hearth, providing warmth."
```

### 1b — compileSensoryAtoms Post-Processor

**File:** `packages/prompts-llm/src/agent9-prose.ts` (or new utility imported there)

Add `compileSensoryAtoms(profiles)` function immediately after `generateLocationProfiles` call in `agent2c-run.ts` (~L65). The function strips any sentences that still arrive despite the schema change:

```typescript
// In packages/prompts-llm/src/agent9-prose.ts — export this, call from agent2c-run.ts
export function compileSensoryAtoms(profiles: any): any {
  const atomise = (val: string): string => {
    if (typeof val !== 'string') return val;
    // If short already (<=60 chars and no period), leave it
    if (val.length <= 60 && !/[.!?]/.test(val)) return val;
    // Strip leading "The " + strip everything from first verb phrase onwards
    return val
      .replace(/^The\s+/i, '')
      .replace(/\bprovide[sd]?\b.*$/i, '')
      .replace(/\bfill[sed]?\b.*$/i, '')
      .replace(/\blinger[sed]?\b.*$/i, '')
      .replace(/\bcrackle[sd]?\b.*$/i, 'crackling')
      .replace(/,\s*(punctuated|interrupted|mingling|creating|offering|inviting)[^,]*$/i, '')
      .replace(/\s*as\s+if\s+.*$/i, '')
      .replace(/\s*—\s+.*$/i, '')
      .replace(/[.,;]+$/, '')
      .trim();
  };
  const SENSORY_KEYS = ['sights', 'sounds', 'smells', 'tactile'];
  const transformLocation = (loc: any): any => {
    if (!loc?.sensoryDetails) return loc;
    const sd = { ...loc.sensoryDetails };
    for (const key of SENSORY_KEYS) {
      if (Array.isArray(sd[key])) sd[key] = sd[key].map(atomise);
    }
    return { ...loc, sensoryDetails: sd };
  };
  return {
    ...profiles,
    keyLocations: Array.isArray(profiles.keyLocations)
      ? profiles.keyLocations.map(transformLocation)
      : profiles.keyLocations,
  };
}
```

**Call site** in `apps/worker/src/jobs/agents/agent2c-run.ts`, after `ctx.locationProfiles = result` (both branches ~L65 and ~L74):
```typescript
import { compileSensoryAtoms } from '@cml/prompts-llm';
ctx.locationProfiles = compileSensoryAtoms(ctx.locationProfiles);
```

### 1c — Sensory Palette Hint Format: Atmosphere First

**File:** `packages/prompts-llm/src/agent9-prose.ts`, function `buildLocationProfilesBlock` (~L2765)

Change the `paletteHints.push(...)` call inside the `scenesOverride` loop:
```
Before:
  `  Chapter ${chapterNum} (${matchedLocation.name}, ${variant.timeOfDay} / ${variant.weather} — ${variant.mood}):\n`

After:
  `  Chapter ${chapterNum} palette — ${variant.timeOfDay}, ${variant.weather}, ${variant.mood} mood [location: ${matchedLocation.name}]:\n`
```

### Phase 1 — Test Criteria

Run `npm run canary:core`. Pass when:
- No chapter opening starts with `"The [Room Name] in [Place]..."` pattern
- No chapter opening starts with `"By the time they reached The [Room]..."` 
- Sensory data in palette hints are noun phrases, not full sentences
- Template bleed score (from `template_linter_*` telemetry fields) is lower than the run 7 baseline

---

## Phase 2 — Type-Aware Fact Injection (BLUE-C)

**Issues resolved:** A20-EV-1, A20-EV-2, A20-EV-3  
**Risk:** Low. Self-contained function replacement.  
**Estimated scope:** ~60 lines in 1 file.

### 2a — Classify canonical values and select injection template

**File:** `apps/worker/src/jobs/agents/agent9-run.ts`, function `enforceLockedFactValuePresence` (~L660)

Add a `FactValueType` classifier and a template map **before** the function:

```typescript
type FactValueType = 'time' | 'duration_minutes' | 'weight' | 'length' | 'generic';

function classifyFactValue(canonical: string): FactValueType {
  if (/\b(past|to|o'clock|quarter|half)\b/i.test(canonical)) return 'time';
  if (/\b(minute|second|hour)s?\b/i.test(canonical))           return 'duration_minutes';
  if (/\b(pound|stone|kilogram)s?\b/i.test(canonical))         return 'weight';
  if (/\b(feet?|foot|inch|metre|meter|yard)s?\b/i.test(canonical)) return 'length';
  return 'generic';
}

const INJECTION_TEMPLATES: Record<FactValueType, (desc: string, val: string) => string> = {
  time:             (_d, v) => `The clock stood at ${v}.`,
  duration_minutes: (d, v)  => `The interval — ${d.toLowerCase()} — came to ${v}.`,
  weight:           (d, v)  => `${d.charAt(0).toUpperCase() + d.slice(1)} weighed ${v}.`,
  length:           (d, v)  => `The measurement confirmed: ${v}.`,
  generic:          (_d, v) => `The relevant value was established: ${v}.`,
};
```

### 2b — One-injection-per-fact-per-story guard + use template

Replace the injection line inside `enforceLockedFactValuePresence`:

```typescript
// Before the outer chapters.map loop, build a set of already-injected canonical values:
const alreadyInjectedCanonicals = new Set<string>();

// Inside the loop, replace:
//   updatedParagraphs[bestIdx] = `The evidence showed ${canonical}. ${...}`;
// with:
if (alreadyInjectedCanonicals.has(canonical.toLowerCase())) continue;
const valueType = classifyFactValue(canonical);
const sentence = INJECTION_TEMPLATES[valueType](description, canonical);
updatedParagraphs[bestIdx] = `${sentence} ${updatedParagraphs[bestIdx].trim()}`;
alreadyInjectedCanonicals.add(canonical.toLowerCase());
```

### Phase 2 — Test Criteria

Run `npm run canary:core`. Pass when:
- No occurrence of `"The evidence showed [measurement]"` in generated prose
- Each locked-fact canonical value appears at most once across the full story
- Injected sentences are grammatically correct for the value type (time values get clock-format sentences, etc.)

---

## Phase 3 — Inline Identity Tags for Pronoun Accuracy (BLUE-D)

**Issues resolved:** A20-PR-1, A20-PR-2, A20-PR-3, A20-PR-4  
**Risk:** Low-medium. Tags appear only in structured instruction blocks, not prose.  
**Estimated scope:** ~100 lines across 1 file.

### 3a — tagCharacter helper + identityMap builder

**File:** `packages/prompts-llm/src/agent9-prose.ts`

Add near the top of the file (after imports):

```typescript
/** Compact pronoun anchor co-located with every character name in instruction blocks.
 *  Tags appear ONLY in structured prompt blocks — never injected into prose continuity text. */
function tagCharacter(name: string, identityMap: Map<string, string>): string {
  const tag = identityMap.get(name);
  return tag ? `${name}[${tag}]` : name;
}

function buildIdentityMap(cast: any[]): Map<string, string> {
  return new Map(cast.map((c: any) => {
    const g = (typeof c.gender === 'string' ? c.gender : '').toLowerCase();
    const tag = g === 'female' ? 'SHE' : g === 'male' ? 'HE' : 'THEY';
    return [c.name as string, tag];
  }));
}
```

### 3b — NARRATIVE VOICE declaration at prompt position 0

**File:** `packages/prompts-llm/src/agent9-prose.ts`, in `buildProsePrompt` (~L2995)

Identify the POV character (role_archetype contains 'detective'). Prepend to the system prompt (before all other blocks):

```typescript
const povChar = cast.find((c: any) =>
  typeof c.role_archetype === 'string' && c.role_archetype.toLowerCase().includes('detective')
);
const identityMap = buildIdentityMap(cast);
const narrativeVoiceLine = povChar
  ? `NARRATIVE VOICE: ${tagCharacter(povChar.name, identityMap)} is the viewpoint character. ` +
    `Unanchored "she/her" or "he/him" without a nearby name refers to ${povChar.name}. ` +
    `Default narrator pronoun: ${identityMap.get(povChar.name) ?? 'SHE'}. ` +
    `Never default to "he/his" as the neutral narrator voice unless the POV character is male.\n\n`
  : '';
```

Inject `narrativeVoiceLine` as the first content of the system message.

### 3c — Apply tagCharacter to instruction blocks (not prose)

In each of the four target builder functions, thread `identityMap` as a parameter and wrap character name references:

| Builder function | Line ref | Where to apply tag |
|---|---|---|
| `buildChapterObligationBlock` | ~L1824 | `locationAnchor` character names, clue character names |
| `buildNSDBlock` | ~L2169 | `clearedSuspects[].name`, `unresolvedSuspects[]` entries |
| `buildCharacterContractsBlock` | ~L2513 | Each contract header character name |
| `buildCharacterPersonalityBlock` | ~L2563 | Each personality section header |

**Do NOT** apply `tagCharacter` inside:
- `buildStoryToDateBlock` (prose summaries)
- `continuityTailExcerpt` (verbatim prior prose)
- Any block that emits prose rather than instructions

### Phase 3 — Test Criteria

Run `npm run canary:core`. Pass when:
- No character oscillates between he/him and she/her within the same chapter
- POV character (detective) is not referred to with the wrong pronoun in any chapter
- Generated prose does not contain literal `[SHE]` or `[HE]` tag text (tag bleed into prose = regression)

---

## Phase 4 — Narrative Beat Registry (BLUE-E)

**Issues resolved:** A20-IS-1, A20-IS-2, A20-IS-3, A20-IS-4  
**Risk:** Medium. Adds a new prompt block and a new data extraction step per chapter.  
**Estimated scope:** ~120 lines across 2 files.

### 4a — Beat fingerprint extraction function

**File:** `packages/prompts-llm/src/agent9-prose.ts`

Add `extractBeatFingerprints(chapter)` near `buildNSDBlock`:

```typescript
export interface BeatFingerprint {
  chapterNumber: number;
  beats: string[];  // 3-5 key sentences from the chapter
}

export function extractBeatFingerprints(
  chapter: ProseChapter,
  chapterNumber: number,
  castNames: string[],
): BeatFingerprint {
  const paragraphs = chapter.paragraphs ?? [];
  // Primary heuristic: select the most noun-dense, pronoun-light sentence from each 200-word block
  const BLOCK_SIZE = 200;
  const beats: string[] = [];
  let wordBuffer = 0;
  let blockSentences: string[] = [];
  const scoreSentence = (s: string): number => {
    const words = s.split(/\s+/);
    const pronouns = words.filter(w => /^(he|she|they|it|him|her|his|their|its)$/i.test(w)).length;
    const nouns = words.filter(w => w.length >= 5 && !/^(which|where|when|that|this|with|from|have|been|will|would|could|should)$/i.test(w)).length;
    return nouns - pronouns;
  };
  for (const para of paragraphs) {
    const sentences = para.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      blockSentences.push(sentence);
      wordBuffer += sentence.split(/\s+/).length;
      if (wordBuffer >= BLOCK_SIZE) {
        const best = blockSentences.reduce((a, b) => scoreSentence(a) >= scoreSentence(b) ? a : b);
        if (best.length >= 40) beats.push(best.trim());
        wordBuffer = 0;
        blockSentences = [];
      }
    }
  }
  // Secondary heuristic: dialogue exchange lines with 2+ cast names
  for (const para of paragraphs) {
    const sentences = para.split(/(?<=[.!?])\s+/);
    for (const s of sentences) {
      const nameCount = castNames.filter(n => s.includes(n)).length;
      const hasDialogue = /\bsaid\b|\breplied\b|\basked\b|\banswered\b|\bwhispered\b/.test(s);
      if (nameCount >= 1 && hasDialogue && s.length >= 40 && beats.length < 6) {
        if (!beats.some(b => jaccardSimilarity(toNgrams(tokenizeWords(b), 4), toNgrams(tokenizeWords(s), 4)) > 0.4)) {
          beats.push(s.trim());
        }
      }
    }
  }
  return { chapterNumber, beats: beats.slice(0, 6) };
}
```

### 4b — FORBIDDEN REPEAT block in NSD

Extend `buildNSDBlock` to accept `beatHistory: BeatFingerprint[]` and inject the FORBIDDEN REPEAT section when `beatHistory.length > 0`:

```typescript
// In buildNSDBlock, after the INVESTIGATION LOG section:
if (Array.isArray(beatHistory) && beatHistory.length > 0) {
  const allBeats = beatHistory.flatMap(bfp =>
    bfp.beats.map(beat => `• Ch${bfp.chapterNumber}: "${beat.slice(0, 90)}${beat.length > 90 ? '…' : ''}"`)
  );
  lines.push('\n⛔ FORBIDDEN REPEATS — These narrative beats have already been written.');
  lines.push('Do NOT rewrite them or near-paraphrases. Write something that has NOT happened yet:');
  allBeats.forEach(b => lines.push(b));
  lines.push('Advancing the story requires new information, a new character action, or a new location.');
}
```

### 4c — Multi-hop n-gram linter window expansion

**File:** `packages/prompts-llm/src/agent9-prose.ts`, in the `runTemplateLinter` function (~L857)

The `priorChapters` argument already contains ALL prior chapters (not just N-1). The `prior_paragraph_limit: 25` in `generation-params.yaml` limits how many prior paragraphs are tested. Confirm this covers ≥4 chapters worth of content (typical chapter = 4–6 paragraphs → 25 covers ~5 chapters). If stories have 10 chapters, raise `prior_paragraph_limit` to 40 in `generation-params.yaml`.

Lower overlap threshold from `0.80` to `0.65` for cross-chapter detection (high enough to avoid false positives on the reveal chapter):
```yaml
# generation-params.yaml
prior_paragraph_limit: 40   # was 25
overlap_threshold: 0.65     # was 0.80 — catches paraphrase repeats, not just near-copies
```

### 4d — Commit beat history into NarrativeState

**File:** `packages/prompts-llm/src/agent9-prose.ts`, in `updateNSD` / `NarrativeState` type

Add `beatHistory: BeatFingerprint[]` to `NarrativeState`. In `onBatchComplete` (in `agent9-run.ts`), extract fingerprints from each committed chapter and append to `liveNarrativeState.beatHistory`.

### Phase 4 — Test Criteria

Run `npm run canary:core`. Pass when:
- Chapters 6–9 no longer share the same confrontation scene (different character combinations, different dialogue, different evidence referenced)
- n-gram overlap linter triggers on any pair of chapters with >65% 6-gram Jaccard overlap (check `template_linter_ngram_overlap_failures` in telemetry)
- `beatHistory` appears in the NSD block for chapters 3+ (visible in run logs)

---

## Phase 5 — Pre-Generation Chapter Arc Locking (BLUE-F)

**Issues resolved:** A20-IS-1, A20-IS-3, A20-IS-4 (structural)  
**Risk:** Medium. Introduces pre-generation planning step and post-generation structural validator.  
**Estimated scope:** ~150 lines across 2 files.

### 5a — MacroArcPlan compiler

**File:** `packages/prompts-llm/src/agent9-prose.ts`

```typescript
const BASE_ARCHETYPES = [
  'DISCOVERY',        // body found — no interrogation
  'FIRST_CONTACT',    // initial interviews — no evidence found yet
  'EVIDENCE',         // physical discovery — no formal accusation
  'ALIBI_PROBE',      // test one alibi — result must be stated
  'RED_HERRING',      // follow wrong lead — disproved within chapter
  'REVERSAL',         // prior assumption overturned — new theory formed
  'ISOLATION',        // eliminate one suspect definitively
  'DISCRIMINATING',   // apply discriminating test logic
  'CONFRONTATION',    // direct accusation scene — culprit present
  'RESOLUTION',       // confession, arrest, aftermath
] as const;

type Archetype = typeof BASE_ARCHETYPES[number];

interface MacroArcEntry { chapter: number; archetype: Archetype; mustContain: string; mustNotContain: string; }

export function buildMacroArcPlan(chapterCount: number): MacroArcEntry[] {
  // Interpolate/compress BASE_ARCHETYPES to fit chapterCount (min 5, max 15)
  const n = Math.max(5, Math.min(15, chapterCount));
  const archetypes: Archetype[] = [];
  // Always anchor first and last
  archetypes.push('DISCOVERY');
  const middle = BASE_ARCHETYPES.slice(1, -1);
  const step = (middle.length - 1) / (n - 2);
  for (let i = 0; i < n - 2; i++) {
    archetypes.push(middle[Math.round(i * step)]);
  }
  archetypes.push('RESOLUTION');
  return archetypes.map((archetype, idx) => ({
    chapter: idx + 1,
    archetype,
    ...ARCHETYPE_CONTRACTS[archetype],
  }));
}

const ARCHETYPE_CONTRACTS: Record<Archetype, { mustContain: string; mustNotContain: string }> = {
  DISCOVERY:     { mustContain: 'body found / victim identified', mustNotContain: 'formal accusation or interrogation' },
  FIRST_CONTACT: { mustContain: 'at least two suspect interviews', mustNotContain: 'physical evidence discovery' },
  EVIDENCE:      { mustContain: 'new physical clue discovered', mustNotContain: 'formal accusation' },
  ALIBI_PROBE:   { mustContain: 'one alibi tested with a stated result', mustNotContain: 'evidence already found in prior chapters' },
  RED_HERRING:   { mustContain: 'wrong lead followed and disproved', mustNotContain: 'final culprit identified' },
  REVERSAL:      { mustContain: 'prior theory overturned by new evidence', mustNotContain: 'same confrontation as prior chapter' },
  ISOLATION:     { mustContain: 'one suspect definitively eliminated', mustNotContain: 'new body or crime' },
  DISCRIMINATING:{ mustContain: 'discriminating test logic applied to culprit', mustNotContain: 'unsolved crime' },
  CONFRONTATION: { mustContain: 'culprit directly present and addressed', mustNotContain: 'repeat of prior interview structure' },
  RESOLUTION:    { mustContain: 'confession or arrest, method explained', mustNotContain: 'unresolved loose ends' },
};
```

### 5b — Inject archetype contract into chapter obligation block

In `buildChapterObligationBlock` (~L1824), prepend a `STRUCTURAL ARCHETYPE` line per chapter using the precomputed `MacroArcPlan`:

```
STRUCTURAL ARCHETYPE — Chapter N must be: EVIDENCE
  ✓ MUST contain: new physical clue discovered
  ✗ MUST NOT contain: formal accusation
```

The `MacroArcPlan` is computed once per story run in `generateProse` and threaded through to each batch call.

### 5c — Post-generation structural validator

After each batch commits, run a lightweight keyword check against the archetype contracts. Failure adds a linter issue with `type: 'archetype_violation'` and triggers a retry with the unfulfilled contract stated explicitly in the retry feedback.

This is **not** an LLM call — it is regex/keyword matching against `mustContain` and `mustNotContain` strings.

### Phase 5 — Test Criteria

Run `npm run canary:core`. Pass when:
- Chapters 6–9 each have a different assigned archetype in the obligation block
- No two consecutive chapters share `CONFRONTATION` archetype
- The `DISCOVERY` archetype chapter contains the victim being found (not assumed prior knowledge)
- All 5 canary runs succeed: `EXIT:0`

---

## Phase 6 — StoryContract Precompiler (BLUE-G)

**Issues resolved:** A20-VIC-1, A20-VIC-2, plus consolidation of A, C, D  
**Risk:** Medium-high. Largest scope change; must not regress Phases 1–5.  
**Estimated scope:** ~400 lines; builds on all prior phases.

### 6a — Fix victim resolution (highest-priority subitem, A20-VIC-1/2)

**File:** `packages/prompts-llm/src/agent9-prose.ts`, `resolveVictimName` (~L1541)

The current function finds the victim by `role === 'victim'` OR `role_archetype.includes('victim')`. The bug: if CML assigns Beatrice as `culprit`, the victim is unresolved and suppression silently fails.

Add a fallback chain:
```typescript
export const resolveVictimName = (cast: CastDesign): string => {
  const chars = Array.isArray((cast as any)?.characters) ? (cast as any).characters : [];
  // Pass 1: explicit role=victim
  let victim = chars.find((c: any) => c.role === 'victim');
  // Pass 2: role_archetype contains 'victim'
  if (!victim) victim = chars.find((c: any) =>
    typeof (c.roleArchetype ?? c.role_archetype) === 'string' &&
    (c.roleArchetype ?? c.role_archetype).toLowerCase().includes('victim')
  );
  // Pass 3: culpability.victim field on CML if available
  if (!victim && (cast as any)?.culpabilityVictim) {
    victim = chars.find((c: any) => c.name === (cast as any).culpabilityVictim);
  }
  return (victim as any)?.name ?? '';
};
```

Also apply victim resolution from `cml.CASE.culpability.victim` in `agent9-run.ts` (~L1741):
```typescript
// Fallback to CML-level culpability.victim if cast-level role resolution fails
const culpabilityVictim = (cml as any)?.CASE?.culpability?.victim ?? '';
if (!victimName && culpabilityVictim) {
  // use culpabilityVictim for all victim suppression logic
}
```

### 6b — StoryContract interface

**New file:** `packages/prompts-llm/src/story-contract.ts`

```typescript
import type { MacroArcEntry } from './agent9-prose.js';
import type { FactValueType } from '../apps/worker/src/jobs/agents/agent9-run.js'; // or re-export from prompts-llm

export interface StoryContract {
  victim: {
    name: string;
    status: 'deceased';
    roleConfirmedFrom: 'cast.role=victim' | 'cast.role_archetype' | 'cml.culpability.victim' | 'fallback_unknown';
  };
  sensoryAtoms: Record<string, {
    sights: string[];
    sounds: string[];
    smells: string[];
    tactile: string[];
  }>;
  lockedFacts: Array<{
    id: string;
    canonical: string;
    valueType: FactValueType;
    injectionTemplate: string;
    appearsInChapter: number;
  }>;
  macroArcPlan: MacroArcEntry[];
}
```

### 6c — precompileStoryContract function

Compute once in `agent9-run.ts` after all upstream agents complete, before `generateProse` is called:

```typescript
function precompileStoryContract(ctx: OrchestratorContext): StoryContract {
  return {
    victim: resolveVictimContract(ctx.cml),
    sensoryAtoms: buildSensoryAtomsFromContract(ctx.locationProfiles),
    lockedFacts: buildTypedLockedFacts(ctx.lockedFacts ?? []),
    macroArcPlan: buildMacroArcPlan(ctx.targetChapterCount),
  };
}
```

The `StoryContract` is passed into `generateProse` as a single `storyContract` field, replacing the four independently computed inputs it consolidates (victim name, location profiles for sensory, locked fact templates, arc plan).

### 6d — Migrate Phase 1–3 logic into StoryContract

Once Phase 6 is stable:
- `compileSensoryAtoms` call in `agent2c-run.ts` is replaced by `storyContract.sensoryAtoms`
- `classifyFactValue` + `INJECTION_TEMPLATES` in `agent9-run.ts` is replaced by `storyContract.lockedFacts[].injectionTemplate`
- `buildIdentityMap` call in `buildProsePrompt` is replaced by a map derived from cast (unchanged, already threaded through StoryContract)

### Phase 6 — Test Criteria

Run `npm run canary:core` × 5 consecutive passes. Pass when:
- Murder victim is named in Chapter 1 (or discovery chapter)
- All 4 named cast members do not all appear alive simultaneously in every chapter
- `victim.roleConfirmedFrom` in story contract logs is NOT `'fallback_unknown'`
- No regression on Phases 1–5 criteria
- All 5 runs: `EXIT:0`

---

## Dependency Graph

```
Phase 1 (BLUE-A + B)   ──────► Phase 2 (BLUE-C)
                         │
                         └────► Phase 3 (BLUE-D)
                                      │
                         ┌────────────┘
                         ▼
                    Phase 4 (BLUE-E)
                         │
                         ▼
                    Phase 5 (BLUE-F)
                         │
                         ▼
                    Phase 6 (BLUE-G — consolidation)
```

Phases 2 and 3 are independent of each other and can be implemented in parallel. Phases 4 and 5 require Phase 1 to be stable first (beat registry benefits from clean chapter prose; false positives from template bleed poison fingerprints). Phase 6 depends on all prior phases.

---

## Files Modified Per Phase

| Phase | Files modified |
|-------|---------------|
| 1a–b  | `packages/prompts-llm/src/agent2c-location-profiles.ts`, `packages/prompts-llm/src/agent9-prose.ts` (new `compileSensoryAtoms`), `apps/worker/src/jobs/agents/agent2c-run.ts` |
| 1c    | `packages/prompts-llm/src/agent9-prose.ts` (`buildLocationProfilesBlock`) |
| 2     | `apps/worker/src/jobs/agents/agent9-run.ts` (`enforceLockedFactValuePresence`) |
| 3     | `packages/prompts-llm/src/agent9-prose.ts` (helper + 4 builder functions + `buildProsePrompt`) |
| 4     | `packages/prompts-llm/src/agent9-prose.ts` (`buildNSDBlock`, new `extractBeatFingerprints`), `apps/worker/config/generation-params.yaml` |
| 5     | `packages/prompts-llm/src/agent9-prose.ts` (new `buildMacroArcPlan`, `buildChapterObligationBlock`), `apps/worker/src/jobs/agents/agent9-run.ts` |
| 6     | `packages/prompts-llm/src/story-contract.ts` (new), `packages/prompts-llm/src/agent9-prose.ts` (`resolveVictimName`), `apps/worker/src/jobs/agents/agent9-run.ts` |

---

## Rollback Safety

Each phase is isolated. If a phase introduces a regression:
1. Revert only the files listed for that phase
2. Run `npm run -w @cml/worker build && npm run canary:core` to confirm baseline restored
3. Do not proceed to the next phase until the current phase produces a clean canary run
