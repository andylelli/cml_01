# Low-Level Design — Prose Generation Architecture

**Parent HLD:** `documentation/plan/prose-generation-HLD.md`  
**Spec:** `documentation/10_prose_generation/10_prose_generation.md`  
**Status:** Complete — all sections fully detailed with code-level specifications.

Each section answers:
- **Where:** exact file(s) and function(s) to change
- **What:** precise code change with before/after snippets
- **Test:** what the unit / integration test must assert
- **Risk:** known caveats or ordering constraints

---

### Source map (line numbers valid as of the session this LLD was written)

| Symbol | File | Approx. line |
|---|---|---|
| `buildWorldBriefBlock()` | `packages/prompts-llm/src/agent9-prose.ts` | 889 |
| `buildPromptContextBlocks()` | same | 1664 |
| `applyPromptBudgeting()` | same | 1703 |
| `buildProsePrompt()` inline builders | same | 1845 (char), 1911 (loc), 1986 (temporal) |
| `buildNSDBlock()` | same | 1507 |
| `buildPronounAccuracyBlock()` | same | 1554 |
| `buildChapterObligationBlock()` | same | 1293 |
| `detectRecurringPhrases()` | same | 1413 |
| `generateProse()` | same | 3517 |
| `generateProse()` batch commit path | same | ~4050 |
| `NarrativeState` interface | `packages/prompts-llm/src/types/narrative-state.ts` | 1 |
| `updateNSD()` | same | ~80 |
| `initNarrativeState()` | same | ~60 |
| Orchestrator `onBatchComplete` | `apps/worker/src/jobs/agents/agent9-run.ts` | ~1259 |

---

## Phase 1 — Correctness Fixes and Missing Injections

### 1.1 Fix `humourPlacementMap` enum mismatch

**Root cause:** `buildWorldBriefBlock()` computes `arcPosForHumour` with arc-position labels (`opening`, `early`, `first_turn`, `mid`, `second_turn`, `pre_climax`, `climax`, `resolution`) then looks up:
```typescript
const humourEntry = worldDoc.humourPlacementMap.find((e: any) => e.scenePosition === arcPosForHumour);
```
But `humourPlacementMap[].scenePosition` is typed with a completely different set of values (`opening_scene`, `first_investigation`, `body_discovery`, `first_interview`, `domestic_scene`, `mid_investigation`, `second_interview`, `tension_scene`, `pre_climax`, `discriminating_test`, `revelation`, `resolution`). Only `pre_climax` and `resolution` overlap, so `humourEntry` is `undefined` for 6 of 8 arc positions and the humour block silently vanishes.

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildWorldBriefBlock()` (~line 999)

- **What:**

  Add the following constant **above** `buildWorldBriefBlock()`:
  ```typescript
  /** Maps turningPoint arc-position labels → humourPlacementMap scenePosition labels.
   *  Used so the humour permission lookup works for all 8 arc positions. */
  const ARC_POS_TO_SCENE_TYPE: Record<string, string> = {
    opening:      'opening_scene',
    early:        'first_investigation',
    first_turn:   'tension_scene',
    mid:          'mid_investigation',
    second_turn:  'second_interview',
    pre_climax:   'pre_climax',
    climax:       'discriminating_test',
    resolution:   'resolution',
  };
  ```

  **Before** (inside `buildWorldBriefBlock()`, ~line 1006):
  ```typescript
  const arcPosForHumour = chapterIndex <= 1 ? 'opening'
    : chapterIndex <= Math.floor(totalChapters * 0.25) ? 'early'
    : ...;
  const humourEntry = worldDoc.humourPlacementMap.find((e: any) => e.scenePosition === arcPosForHumour);
  ```

  **After:**
  ```typescript
  const arcPosForHumour = chapterIndex <= 1 ? 'opening'
    : chapterIndex <= Math.floor(totalChapters * 0.25) ? 'early'
    : ...;
  const mappedSceneType = ARC_POS_TO_SCENE_TYPE[arcPosForHumour] ?? arcPosForHumour;
  const humourEntry = worldDoc.humourPlacementMap.find((e: any) => e.scenePosition === mappedSceneType);
  ```

- **Test:** Unit test with a `humourPlacementMap` containing all 12 scene-position entries. For each of the 8 `arcPosForHumour` values, assert `humourEntry` is not `undefined` and that `humourEntry.humourPermission` is the string from the corresponding mapped entry.

- **Risk:** The 8→12 mapping is not strictly bijective (e.g. `body_discovery`, `domestic_scene`, `first_interview` have no arc-position counterpart). That is fine — those entries will never be selected by the current chapter-index calculation. The mapping only needs to be injective from the 8 arc keys. Verify the constant matches the schema's `allowed` list before shipping.

---

### 1.2 Wire `victimConfirmedDeadChapter` setter

**Root cause:** `NarrativeState.victimConfirmedDeadChapter` is never assigned anywhere. It is read in `buildNSDBlock()` to inject the victim-state guarantee line, but since it is always `undefined` the line is never emitted, so the LLM can re-animate the victim in any chapter.

- **Where:** (two sites)
  1. `packages/prompts-llm/src/agent9-prose.ts` — `generateProse()` batch commit path (~line 4050)
  2. `apps/worker/src/jobs/agents/agent9-run.ts` — `onBatchComplete` callback (~line 1269)

- **What:**

  **Site 1 — inside `generateProse()`.** After `batchSuccess = true` and before the `onBatchComplete` callback fires, detect the victim's death via keyword scan of the committed prose:

  ```typescript
  // In generateProse(), after `batchSuccess = true` in the per-batch loop:
  if (liveNarrativeState && liveNarrativeState.victimConfirmedDeadChapter === undefined) {
    const victimNameLower = resolveVictimName(inputs.cast).toLowerCase();
    if (victimNameLower) {
      const batchText = proseBatch.chapters
        .flatMap((ch: ProseChapter) => ch.paragraphs)
        .join(' ')
        .toLowerCase();
      const deathPattern = /\b(dead|body|corpse|killed|murder(?:ed)?|lifeless|deceased|slain|strangled|shot|stabbed)\b/;
      if (batchText.includes(victimNameLower) && deathPattern.test(batchText)) {
        liveNarrativeState = {
          ...liveNarrativeState,
          victimConfirmedDeadChapter: chapterStart,
        };
      }
    }
  }
  ```

  **Site 2 — orchestrator `onBatchComplete`.** Mirrors the same detection so the external `narrativeState` (used in repair-run restarts) also records the chapter:

  ```typescript
  // In agent9-run.ts, onBatchComplete, after the existing updateNSD() call:
  if (narrativeState.victimConfirmedDeadChapter === undefined) {
    const victimName = resolveVictimName(cml.CAST as CastDesign).toLowerCase();
    if (victimName) {
      const batchText = (batchChapters as ProseChapter[])
        .flatMap((ch) => ch.paragraphs)
        .join(' ')
        .toLowerCase();
      const deathPattern = /\b(dead|body|corpse|killed|murder(?:ed)?|lifeless|deceased|slain)\b/;
      if (batchText.includes(victimName) && deathPattern.test(batchText)) {
        narrativeState = { ...narrativeState, victimConfirmedDeadChapter: batchStart };
      }
    }
  }
  ```

  **Export `resolveVictimName` first:** it is defined at line ~1090 of `agent9-prose.ts` (`export const resolveVictimName = ...`) but is NOT currently re-exported from `packages/prompts-llm/src/index.ts`. Add it:
  ```typescript
  // packages/prompts-llm/src/index.ts
  export { generateProse, resolveVictimName } from "./agent9-prose.js";
  ```
  Then import it in `agent9-run.ts`:
  ```typescript
  import { generateProse, initNarrativeState, updateNSD, resolveVictimName, type NarrativeState } from "@cml/prompts-llm";
  ```

- **Test:**
  - Unit (prose lib): Construct `generateProse()` inputs where chapter 2's prose contains the victim's name + "was found dead". Assert that after the run, `liveNarrativeState.victimConfirmedDeadChapter === 2`.
  - Unit (NSD block): Pass a `NarrativeState` with `victimConfirmedDeadChapter: 3` to `buildNSDBlock()`. Assert rendered output contains `"VICTIM STATE"` and `"Chapter 3"`.
  - Regression: Story with no death imagery in prose → `victimConfirmedDeadChapter` remains `undefined`.

- **Risk:** Keyword scan is heuristic. It will fire on false positives (e.g. a scene where a character says "the victim was dead long before we arrived"). This is acceptable — setting the chapter slightly early is safer than never setting it. The scan runs only until the first match (`=== undefined` guard prevents re-triggering). If stronger accuracy is needed, require the CML author to add an outline field `bodyDiscoveryScene: number` and use that instead.

---

### 1.3 Sync `cluesRevealedToReader` into `liveNarrativeState`

**Root cause:** In `generateProse()` at the batch commit path (~line 4050), `updateNSD()` is called with only `paragraphs`. The `cluesRevealedIds` parameter exists in `updateNSD()`'s signature but is never passed, so `cluesRevealedToReader` remains empty throughout the run. The NSD block therefore never lists previously-revealed clues, removing the fair-play continuity guarantee.

Note: The orchestrator's `onBatchComplete` (~line 1269) already passes `cluesRevealedIds` correctly to the EXTERNAL `narrativeState`. This fix closes the same gap on the INTERNAL `liveNarrativeState` within `generateProse()`.

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `generateProse()` batch commit path (~line 4050)

- **What:**

  **Before:**
  ```typescript
  if (liveNarrativeState) {
    const lastProseChapter = proseBatch.chapters[proseBatch.chapters.length - 1];
    liveNarrativeState = updateNSD(liveNarrativeState, { paragraphs: lastProseChapter?.paragraphs });
  }
  ```

  **After:**
  ```typescript
  if (liveNarrativeState) {
    const lastProseChapter = proseBatch.chapters[proseBatch.chapters.length - 1];
    const batchRevealedIds = batchScenes
      .flatMap((s: any) => (Array.isArray(s.cluesRevealed) ? s.cluesRevealed : []))
      .map((id: unknown) => String(id))
      .filter(Boolean);
    liveNarrativeState = updateNSD(liveNarrativeState, {
      paragraphs: lastProseChapter?.paragraphs,
      cluesRevealedIds: batchRevealedIds,
    });
  }
  ```

  No change to `updateNSD()` itself — its signature already accepts `cluesRevealedIds`.

- **Test:**
  - Unit: Call `updateNSD()` with `cluesRevealedIds: ['clue_001', 'clue_002']`. Assert returned state has `cluesRevealedToReader: ['clue_001', 'clue_002']`.
  - Integration: Two-batch story where batch 1 reveals `clue_001`. Assert that `buildNSDBlock()` on the batch-2 prompt contains `"clue_001"` in the rendered clue list.
  - Regression: Empty `cluesRevealed` array on scenes → `cluesRevealedToReader` remains `[]`, no crash.

- **Risk:** `getRequiredClueIdsForScene()` (already exported) is an alternative source for clue IDs if `scene.cluesRevealed` proves unreliable. The implementation above uses the simpler direct property access which mirrors what the orchestrator already does.

---

### 1.4 Inject `arcDescription` into `buildWorldBriefBlock()`

**Root cause:** `buildWorldBriefBlock()` injects `arc.dominantRegister` but not `arc.arcDescription`. The `arcDescription` field contains 300–400 words of emotional arc prose that the LLM needs to pace narrative tension correctly across chapters. Its absence means the LLM only receives one sentence of emotional context.

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildWorldBriefBlock()`, emotional arc section (~line 1023)

- **What:**

  **Before:**
  ```typescript
  if (arc.dominantRegister) {
    lines.push(`\n## Story Emotional Register\nDominant: ${arc.dominantRegister}`);
  }
  ```

  **After:**
  ```typescript
  if (arc.dominantRegister || arc.arcDescription) {
    lines.push(`\n## Story Emotional Register`);
    if (arc.dominantRegister) lines.push(`Dominant: ${arc.dominantRegister}`);
    if (arc.arcDescription) lines.push(`\nArc:\n${arc.arcDescription}`);
    if (arc.endingNote) lines.push(`\nEnding note: ${arc.endingNote}`);
  }
  ```

  Note: `arc.endingNote` is also in the schema and equally absent; inject it here as it costs little token budget and completes the emotional arc picture.

- **Test:** Unit: Supply `buildWorldBriefBlock()` with a `worldDoc` whose `storyEmotionalArc.arcDescription` is a 5-sentence string. Assert the rendered block contains the full string under `"Arc:"`.

- **Risk:** `arcDescription` is 300–400 words. The `world_document` block is assigned `high` priority in `applyPromptBudgeting()`. Confirm the 850-word arc text does not tip the world block over its effective share of the 6,200-token cap. If it does, truncate to the first 200 words:
  ```typescript
  const arcText = arc.arcDescription.split('\n').slice(0, 3).join('\n'); // first 3 paragraphs
  ```

---

### 1.5 Inject `atmosphere.eraMarkers` into location profiles block

**Root cause:** The inline `locationProfilesContext` builder in `buildProsePrompt()` (~line 1911) loops over `locationProfiles.keyLocations` and injects sensory details, but never references `locationProfiles.atmosphere.eraMarkers[]`. These are the "period anchors" (e.g. `"gas lamps not yet replaced by electricity"`, `"calling cards still in use"`) that keep the LLM from anachronistic details.

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — inline `locationProfilesContext` builder, **after** the existing sensory details section and **before** the `accessControl` line (~line 1940)

  **Note on refactoring:** This inline builder is also refactored into `buildLocationProfilesBlock()` as part of §1.6. The code below shows the final post-refactor location inside that named function.

- **What:**

  Add the following block after the `atmosphere.sensoryPalette` injection (§3.5) and before any `keyLocations` loop:
  ```typescript
  const eraMarkers: string[] = Array.isArray(inputs.locationProfiles?.atmosphere?.eraMarkers)
    ? inputs.locationProfiles.atmosphere.eraMarkers
    : [];
  if (eraMarkers.length > 0) {
    locationBlock += `\n\nEra markers: ${eraMarkers.slice(0, 6).join(' | ')}`;
  }
  ```

  Cap at 6 markers. The `atmosphere` block is at `medium` priority in `applyPromptBudgeting()`.

- **Test:** Unit: Supply location profiles with `atmosphere.eraMarkers: ['gas lamps', 'servants in livery', 'no telegrams after midnight']`. Assert the rendered block contains `"Era markers: gas lamps | servants in livery | no telegrams after midnight"`.

- **Risk:** None. The field is optional in the schema; the `Array.isArray` guard handles absent values cleanly.

---

### 1.6 Extract inline block builders and filter to scene-active characters

**Root cause (two problems, one refactoring opportunity):**

1. `buildProsePrompt()` contains three large inline builders (~80–150 lines each) that are untestable in isolation:
   - `characterPersonalityContext` (~line 1845)
   - `locationProfilesContext` (~line 1911)
   - `temporalContextBlock` (~line 1986)

2. All three builders inject context for **every** character / location unconditionally. For a 9-character story, the LLM receives 6+ character portraits even in a 2-character scene, wasting token budget and conflating voice registers.

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildProsePrompt()` and three inline blocks

- **What:**

  **Step A — Extract the three inline builders into top-level named functions:**

  ```typescript
  /**
   * Builds the character personality context block.
   * When activeNames is provided, only profiles for characters in that set are included.
   */
  export function buildCharacterPersonalityBlock(
    characterProfiles: ProseGenerationInputs['characterProfiles'],
    cast: CastDesign,
    writingGuides: string[],
    activeNames?: Set<string>,
  ): string {
    if (!characterProfiles?.profiles?.length) return '';
    const profiles = activeNames?.size
      ? characterProfiles.profiles.filter((p: any) => activeNames.has(p.name))
      : characterProfiles.profiles;
    // ... (move the full existing inline body here, replacing the unconditional loop)
    return result;
  }

  /**
   * Builds the location profiles context block.
   * chapterIndex is used for sensory variant cycling (§3.3).
   */
  export function buildLocationProfilesBlock(
    locationProfiles: ProseGenerationInputs['locationProfiles'],
    chapterIndex: number,
  ): string {
    if (!locationProfiles) return '';
    // ... (move the full existing inline body here, with §1.5 eraMarkers + §3.5 sensoryPalette additions)
    return result;
  }

  /**
   * Builds the temporal context block.
   * Includes all §6.x additions when the corresponding fields are present.
   */
  export function buildTemporalContextBlock(
    temporalContext: ProseGenerationInputs['temporalContext'],
  ): string {
    if (!temporalContext) return '';
    // ... (move the full existing inline body here, with §6.x additions)
    return result;
  }
  ```

  **Step B — Replace the inline builds inside `buildProsePrompt()` with calls:**
  ```typescript
  // BEFORE (three ~100-line anonymous blocks):
  let characterPersonalityContext = '';
  if (inputs.characterProfiles && ...) { ... }

  // AFTER:
  const activeCharacterNames = new Set<string>(
    (batchScenes as any[]).flatMap((s: any) =>
      Array.isArray(s.characters) ? (s.characters as string[]) : [],
    ),
  );
  const characterPersonalityContext = buildCharacterPersonalityBlock(
    inputs.characterProfiles,
    inputs.cast,
    inputs.writingGuides ?? [],
    activeCharacterNames.size > 0 ? activeCharacterNames : undefined,
  );
  const locationProfilesContext = buildLocationProfilesBlock(
    inputs.locationProfiles,
    chapterIndex,
  );
  const temporalContextBlock = buildTemporalContextBlock(inputs.temporalContext);
  ```

  **Step C — apply the same active-set filter in `buildWorldBriefBlock()` portrait and voice-sketch loops:**
  Add an optional `activeCharacterNames?: Set<string>` parameter to `buildWorldBriefBlock()`. In the portrait loop and the voice-sketch loop, add a guard:
  ```typescript
  if (activeCharacterNames?.size && !activeCharacterNames.has(portrait.name)) continue;
  ```
  Call site in `buildProsePrompt()`: pass `activeCharacterNames`.

- **Test:**
  - `buildCharacterPersonalityBlock`: 9-profile input with `activeNames = new Set(['Alice', 'Bob'])` → rendered block contains only Alice and Bob entries.
  - `buildLocationProfilesBlock`: input with `atmosphere.eraMarkers` → era marker line present; input without → line absent.
  - `buildTemporalContextBlock`: input with `seasonal.daylight` → "Daylight:" line present.
  - `buildWorldBriefBlock` with `activeCharacterNames`: 9-character cast, 3 active → portrait block has exactly 3 entries.

- **Risk:** Test coverage must be added for all three extracted functions before their inline originals are deleted. Extract first, test, then delete the inlined copies. One at a time.

---

## Phase 2 — Asset Library Foundation

### 2.1 Define the `Asset` interface

- **Where:** `packages/prompts-llm/src/types/asset-library.ts` (new file)

- **What:**

  ```typescript
  /** A single injectable content atom. */
  export interface Asset {
    /** Deterministic ID: "{type}:{scopeKey}:{index}". E.g. "portrait:Alice:physical" */
    id: string;
    /** Source field path in the CML object, for traceability. */
    source: string;
    /** Whether this atom is tied to a specific character/location or spans the whole story. */
    scope: 'character' | 'location' | 'story' | 'window';
    /** The key value for the scope — character name, location ID, or "" for story-scope. */
    scopeKey: string;
    /** Register tag: 'tense' | 'relief' | 'humorous' | 'observational' | 'neutral' */
    register?: string;
    /** The prose content to inject. */
    content: string;
    /**
     * Maximum times this atom should appear across the story.
     * 1 = inject once only; 2 = at most twice; 0 = unlimited.
     */
    budget: number;
    /**
     * Obligation tier — determines whether the atom is a hard obligation or a
     * texture suggestion.
     */
    tier: 'obligation' | 'texture';
    /** Token-budget priority for applyPromptBudgeting(). */
    priority: 'critical' | 'high' | 'medium' | 'lower';
  }

  /** Map of atom ID → Asset. */
  export type AssetLibrary = Record<string, Asset>;
  ```

  Export both from `packages/prompts-llm/src/index.ts`.

- **Test:** Compile-only check (`tsc --noEmit`). No runtime test needed for the type definition alone.

- **Risk:** Keep `Asset` serialisable (no functions, no class instances) so it round-trips through JSON checkpoint storage without custom serialisation.

---

### 2.2 Add `deployedAssets` to `NarrativeState`

- **Where:** `packages/prompts-llm/src/types/narrative-state.ts`

- **What:**

  **Before:**
  ```typescript
  export interface NarrativeState {
    version: 1;
    lockedFacts: LockedFact[];
    characterPronouns: Record<string, string>;
    cluesRevealedToReader: string[];
    continuityTail: string;
    victimConfirmedDeadChapter?: number;
  }
  ```

  **After:**
  ```typescript
  export interface NarrativeState {
    version: 1;
    lockedFacts: LockedFact[];
    characterPronouns: Record<string, string>;
    cluesRevealedToReader: string[];
    continuityTail: string;
    victimConfirmedDeadChapter?: number;
    /** Asset atom ID → chapter numbers that atom was used in. Populated by obligation stamping (§2.5). */
    deployedAssets: Record<string, number[]>;
    /** locationId → last-used sensoryVariant ID (§3.3). */
    lastUsedSensoryVariant: Record<string, string>;
    /** Arc-position label of the previous committed chapter (§4.4). */
    previousChapterArcPosition?: string;
    /** Recurring phrase warnings forwarded to the next chapter's scoring block (§5.4). */
    recurringPhraseWarnings: string[];
  }
  ```

  **In `initNarrativeState()`** — preserve the existing two-parameter signature and inline pronoun-building loop, adding the four new fields to the return object:
  ```typescript
  export function initNarrativeState(
    lockedFacts: LockedFact[],
    characterGenders: Record<string, string>,
  ): NarrativeState {
    const characterPronouns: Record<string, string> = {};
    for (const [name, gender] of Object.entries(characterGenders)) {
      const g = gender?.toLowerCase();
      if (g === 'male') characterPronouns[name] = 'he/him/his';
      else if (g === 'female') characterPronouns[name] = 'she/her/her';
      else if (g === 'non-binary') characterPronouns[name] = 'they/them/their';
    }
    return {
      version: 1,
      lockedFacts,
      characterPronouns,
      cluesRevealedToReader: [],
      continuityTail: '',
      deployedAssets: {},
      lastUsedSensoryVariant: {},
      recurringPhraseWarnings: [],
      // victimConfirmedDeadChapter and previousChapterArcPosition default to undefined
    };
  }
  ```

  `updateNSD()` spreads the incoming state and only modifies `continuityTail`, `cluesRevealedToReader`. The spread operator carries all new fields forward unchanged:
  ```typescript
  export function updateNSD(
    current: NarrativeState,
    lastChapter: { paragraphs?: string[]; cluesRevealedIds?: string[] },
  ): NarrativeState {
    return {
      ...current,
      continuityTail: ...,
      cluesRevealedToReader: ...,
      // All new fields are carried by the spread. Stamp them at the call site.
    };
  }
  ```

- **Test:**
  - `initNarrativeState()` returns state where `deployedAssets === {}`, `lastUsedSensoryVariant === {}`, `recurringPhraseWarnings === []`.
  - Serialise to JSON and parse back — all new fields survive round-trip.
  - Any code path that spreads `NarrativeState` (`{...state, x: y}`) will carry the new fields; audit `grep -r 'NarrativeState' src/` for explicit spreads that might truncate.

- **Risk:** If `agent9-run.ts` stores/restores `narrativeState` as raw JSON, the new fields will be `undefined` on first restore for old checkpoints. Add migration fallback in the restore path:
  ```typescript
  const restored: NarrativeState = {
    deployedAssets: {},
    lastUsedSensoryVariant: {},
    recurringPhraseWarnings: [],
    ...rawJson,
  };
  ```

---

### 2.3 Build `buildAssetLibrary()`

- **Where:** `packages/prompts-llm/src/asset-library.ts` (new file)

- **What:**

  ```typescript
  import type { Asset, AssetLibrary } from './types/asset-library.js';

  export function buildAssetLibrary(
    worldDoc: any,
    characterProfiles: any,
    locationProfiles: any,
    temporalContext: any,
  ): AssetLibrary {
    const lib: AssetLibrary = {};
    const add = (asset: Asset) => { lib[asset.id] = asset; };

    // -- Character atoms --
    for (const profile of (characterProfiles?.profiles ?? [])) {
      const name: string = profile.name;
      // First-impression (single budget-1 obligation atom)
      if (profile.firstImpression) {
        add({ id: `portrait:${name}:first_impression`, source: 'characterProfiles.firstImpression',
              scope: 'character', scopeKey: name, tier: 'obligation', budget: 1,
              priority: 'high', content: profile.firstImpression });
      }
      // Physical, manner, distinctive detail (texture, budget 2)
      if (profile.physical) {
        add({ id: `portrait:${name}:physical`, source: 'characterProfiles.physical',
              scope: 'character', scopeKey: name, tier: 'texture', budget: 2,
              priority: 'medium', content: profile.physical });
      }
      if (profile.manner) {
        add({ id: `portrait:${name}:manner`, source: 'characterProfiles.manner',
              scope: 'character', scopeKey: name, tier: 'texture', budget: 2,
              priority: 'medium', content: profile.manner });
      }
      // Speech mannerisms: split on ';' or sentence boundary, one atom each
      const mannerisms: string[] = (profile.speechMannerisms ?? '')
        .split(/;|\.\s+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 10);
      mannerisms.forEach((m, i) => {
        add({ id: `voice:${name}:manner_${i}`, source: 'characterProfiles.speechMannerisms',
              scope: 'character', scopeKey: name, tier: 'obligation', budget: 3,
              priority: 'high', content: m });
      });
      if (profile.internalConflict) {
        add({ id: `voice:${name}:conflict`, source: 'characterProfiles.internalConflict',
              scope: 'character', scopeKey: name, tier: 'obligation', budget: 2,
              priority: 'high', content: profile.internalConflict });
      }
    }

    // -- Era / historical atoms --
    if (worldDoc?.historicalMoment?.eraRegister) {
      const era: string = worldDoc.historicalMoment.eraRegister;
      era.split(/\.\s+/).filter((s: string) => s.length > 20).slice(0, 5)
        .forEach((fragment, i) => {
          add({ id: `era:story:${i}`, source: 'worldDoc.historicalMoment.eraRegister',
                scope: 'story', scopeKey: '', tier: 'texture', budget: 0,
                priority: 'medium', content: fragment });
        });
    }

    // -- Reveal implication atoms --
    if (Array.isArray(worldDoc?.revealImplications)) {
      (worldDoc.revealImplications as string[]).forEach((impl, i) => {
        add({ id: `reveal:story:${i}`, source: 'worldDoc.revealImplications',
              scope: 'window', scopeKey: '', tier: 'texture', budget: 1,
              priority: 'medium', content: impl });
      });
    }

    // Add further chunking (location sensory, temporal cultural) as Phases 3–6 land.
    return lib;
  }
  ```

- **Test:**
  - Unit: 3-character input → assert exactly 3 `portrait:*:first_impression` atoms with `budget: 1`.
  - Unit: Character with `speechMannerisms: "speaks in questions; never finishes sentences. Uses 'rather' as a filler."` → 3 mannerism atoms.
  - Determinism: two calls with identical inputs → identical `Object.keys(lib)` order.

- **Risk:** `characterProfiles` is `any` until Phase 3 types are tightened. Use defensive `?.` throughout.

---

### 2.4 Build `selectChapterAtoms()`

- **Where:** `packages/prompts-llm/src/asset-library.ts`

- **What:**

  ```typescript
  export function selectChapterAtoms(
    library: AssetLibrary,
    activeCharacterNames: Set<string>,
    activeLocationIds: Set<string>,
    deployedAssets: Record<string, number[]>,
    arcPosition: string,
  ): { obligationAtoms: Asset[]; textureAtoms: Asset[] } {
    const obligation: Asset[] = [];
    const texture: Asset[] = [];

    for (const asset of Object.values(library)) {
      // Scope filter
      if (asset.scope === 'character' && !activeCharacterNames.has(asset.scopeKey)) continue;
      if (asset.scope === 'location' && !activeLocationIds.has(asset.scopeKey)) continue;

      // Budget filter
      const usedCount = (deployedAssets[asset.id] ?? []).length;
      if (asset.budget > 0 && usedCount >= asset.budget) continue;

      if (asset.tier === 'obligation') {
        obligation.push(asset);
      } else {
        texture.push(asset);
      }
    }

    // Rank texture by deployment recency (least recently used first)
    texture.sort((a, b) => {
      const aLast = Math.max(-1, ...(deployedAssets[a.id] ?? []));
      const bLast = Math.max(-1, ...(deployedAssets[b.id] ?? []));
      return aLast - bLast;
    });

    return { obligationAtoms: obligation, textureAtoms: texture };
  }
  ```

- **Test:** Unit: 10-atom library, 2 active characters (3 atoms each), 1 story atom, 4 atoms with `deployedAssets` count ≥ budget → assert returned `obligationAtoms.length === correctValue`, no retired atoms present.

- **Risk:** `arcPosition` parameter is reserved for the register-matching filter (§3.2). Wire it up once voice-fragment register tags are implemented; until then it is accepted but unused.

---

### 2.5 Obligation stamping on chapter commit

- **Where:** `apps/worker/src/jobs/agents/agent9-run.ts` — `onBatchComplete` callback, after the `updateNSD()` call (~line 1272)

- **What:**

  The `onBatchComplete` callback will receive the list of obligation atoms that were selected for that batch. Thread `selectedObligationAtomIds: string[]` from the prompt-assembly step to the commit step via a closure variable:

  ```typescript
  // In the orchestrator, before calling generateProse():
  let pendingObligationAtomIds: string[] = [];

  // Pass this setter into the inputs or build a closure that generateProse() can call:
  // Option A (recommended): add an optional `onAtomsSelected` callback to ProseGenerationInputs
  //   onAtomsSelected?: (atomIds: string[]) => void
  // Option B: return selected atom IDs from the batch prompt builder and receive
  //           them in onBatchComplete via an extended signature.
  ```

  Selection approach: after `selectChapterAtoms()` runs inside the batch loop in `generateProse()`, pass `obligationAtoms.map(a => a.id)` to the `onAtomsSelected` callback. The orchestrator's closure stamps them after commit:

  ```typescript
  // In onBatchComplete (after updateNSD call):
  for (const atomId of pendingObligationAtomIds) {
    if (!narrativeState.deployedAssets[atomId]) {
      narrativeState = {
        ...narrativeState,
        deployedAssets: { ...narrativeState.deployedAssets, [atomId]: [batchStart] },
      };
    } else {
      narrativeState.deployedAssets[atomId] = [...narrativeState.deployedAssets[atomId], batchStart];
    }
  }
  pendingObligationAtomIds = [];
  ```

  **Critical invariant:** do NOT stamp if the batch failed (retry path). Only stamp after the batch passes all validation gates.

- **Test:**
  - Integration: one batch with 3 obligation atoms → after commit, each atom ID maps to `[batchStart]` in `deployedAssets`.
  - Integration: batch fails validation, retries, passes on retry → `deployedAssets` updated once (not twice).

- **Risk:** Threading `onAtomsSelected` callback through `ProseGenerationInputs` requires a type change. If that interface is exported and consumed externally, add the callback as optional (`onAtomsSelected?: (ids: string[]) => void`) to stay backwards-compatible.

---

---

## Phase 3 — Scoped Context Assembly

### 3.1 Replace flat portrait + voice injection with scoped obligation pool

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildCharacterPersonalityBlock()` (extracted in §1.6); `buildWorldBriefBlock()` portrait/voice-sketch loops

- **What:**

  `buildCharacterPersonalityBlock()` currently loops unconditionally over all profiles. After §2.3 creates the asset library, replace this with `selectChapterAtoms()` filtered to character scope:

  ```typescript
  // In buildCharacterPersonalityBlock(), add assetLibrary + deployedAssets parameters:
  export function buildCharacterPersonalityBlock(
    characterProfiles: ProseGenerationInputs['characterProfiles'],
    cast: CastDesign,
    writingGuides: string[],
    activeNames: Set<string>,
    library?: AssetLibrary,
    deployedAssets?: Record<string, number[]>,
    arcPosition?: string,
    chapterIndex?: number,
    totalChapters?: number,
  ): string {
    if (!characterProfiles?.profiles?.length) return '';

    // Determine introduction chapters using scene ordering from the outline
    // (passed implicitly via the active set; first appearance = set contains name
    //  but deployedAssets has no portrait:name:first_impression yet)
    const profiles = activeNames.size
      ? characterProfiles.profiles.filter((p: any) => activeNames.has(p.name))
      : characterProfiles.profiles;

    let result = '## Character Reference\n';
    for (const profile of profiles) {
      const name: string = profile.name;
      const isIntroductionChapter = library && deployedAssets
        && !(deployedAssets[`portrait:${name}:first_impression`]?.length > 0);

      if (isIntroductionChapter && library?.[`portrait:${name}:first_impression`]) {
        result += `\n### ${name}\n${library[`portrait:${name}:first_impression`].content}\n`;
      } else {
        // Subsequent appearances: inject obligation atoms not yet at budget
        const { obligationAtoms } = selectChapterAtoms(
          library ?? {},
          new Set([name]),
          new Set(),
          deployedAssets ?? {},
          arcPosition ?? 'mid',
        );
        obligationAtoms
          .filter(a => a.scopeKey === name)
          .forEach(a => { result += `\n${a.content}\n`; });
      }
    }
    return result;
  }
  ```

- **Test:**
  - 9-character library, 3 active. `deployedAssets` has `portrait:Alice:first_impression: [1]` (already deployed). Assert Alice's entry uses obligation atoms, not first-impression. Assert non-active characters produce no output.
  - Introduction chapter: no prior deployment → first-impression atom is the only output for that character.

- **Risk:** "Introduction chapter" detection depends on `deployedAssets` being populated before the first call. On the first batch (chapter 1), `deployedAssets` starts as `{}` so every character is in introduction mode. This is correct.

---

### 3.2 Register-matched voice fragment selection

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildWorldBriefBlock()` voice-sketch section (currently `fragments.slice(0, 3)`, ~line 980)

- **What:**

  Import `ARC_POSITION_REGISTER` from `constants/arc-position.ts` (defined once in the Cross-cutting section). Do **not** re-declare it here. The authoritative values are:

  ```
  opening → 'warm'   early → 'curious'   first_turn → 'urgent'   mid → 'methodical'
  second_turn → 'stressed'   pre_climax → 'stressed'   climax → 'tense'   resolution → 'reflective'
  ```

  **Before** (in voice-sketch loop, ~line 985):
  ```typescript
  const selected = fragments.slice(0, 3);
  ```

  **After:**
  ```typescript
  const dominantRegister = ARC_POSITION_REGISTER[arcPosition] ?? 'neutral';
  const humourEntry = worldDoc.humourPlacementMap?.find(
    (e: any) => e.scenePosition === ARC_POS_TO_SCENE_TYPE[arcPosition],
  );
  const humourPermitted = humourEntry?.humourPermission !== 'forbidden';

  // Priority: register-matched fragments first; humorous elevated when permitted
  const sorted = [...fragments].sort((a: any, b: any) => {
    const aRegister: string = a.register ?? 'neutral';
    const bRegister: string = b.register ?? 'neutral';
    const aMatch = aRegister === dominantRegister ? 0 : 1;
    const bMatch = bRegister === dominantRegister ? 0 : 1;
    // Humorous fragments bubble up when humour is permitted, sink when forbidden
    const aHumour = aRegister === 'humorous' ? (humourPermitted ? -1 : 2) : 0;
    const bHumour = bRegister === 'humorous' ? (humourPermitted ? -1 : 2) : 0;
    return (aMatch + aHumour) - (bMatch + bHumour);
  });
  const selected = sorted.slice(0, 3);
  ```

- **Test:**
  - Arc position `resolution` + humour permitted → humorous fragment first in `selected`.
  - Arc position `climax` + humour forbidden → humorous fragment absent or last.
  - No fragments with matching register → falls back to first 3 unsorted.

- **Risk:** Voice fragments must have a `register` field in `characterVoiceSketches`. If absent, the sort is stable and the existing behaviour is preserved (no regression).

---

### 3.3 Sensory variant elevation from hint to obligation

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildLocationProfilesBlock()` (extracted in §1.6); `buildChapterObligationBlock()` (~line 1293); `updateNSD()` in `narrative-state.ts`

- **What:**

  **A. Selection logic in `buildLocationProfilesBlock()`:**
  ```typescript
  function selectSensoryVariant(
    variants: any[],
    chapterIndex: number,
    lastUsed: string | undefined,
    scene: { timeOfDay?: string; weather?: string },
  ): any | undefined {
    if (!variants?.length) return undefined;

    // 1. Match by timeOfDay + weather
    let candidates = variants.filter(v =>
      v.timeOfDay === scene.timeOfDay && v.weather === scene.weather,
    );
    // 2. Fall back to timeOfDay only
    if (!candidates.length) {
      candidates = variants.filter(v => v.timeOfDay === scene.timeOfDay);
    }
    // 3. Fall back to modulo
    if (!candidates.length) candidates = [...variants];

    // 4. Non-repetition: if only one candidate and it equals lastUsed, rotate
    if (candidates.length === 1 && candidates[0].id === lastUsed) {
      candidates = variants.filter(v => v.id !== lastUsed);
      if (!candidates.length) candidates = [...variants]; // only one variant exists
    }

    // Select by modulo for determinism
    return candidates[chapterIndex % candidates.length];
  }
  ```

  In `buildLocationProfilesBlock()`, call `selectSensoryVariant()` for each active location's `sensoryVariants[]` and include the variant in the returned block (not just as a hint).

  **B. Obligation elevation in `buildChapterObligationBlock()`:**
  Pass the selected variant into the obligation block:
  ```typescript
  if (selectedVariant) {
    lines.push(
      `\nSensory obligation — use at least two of: ` +
      `${selectedVariant.sights.slice(0, 2).join(', ')} | ` +
      `${selectedVariant.sounds.slice(0, 2).join(', ')} | ` +
      `${selectedVariant.smells.slice(0, 1).join(', ')}. ` +
      `Mood: ${selectedVariant.mood}.`,
    );
  }
  ```

  **C. State update after commit:**
  In `generateProse()` batch commit path, after the existing `updateNSD()` call, update `lastUsedSensoryVariant`:
  ```typescript
  if (selectedVariantId && locationId) {
    liveNarrativeState = {
      ...liveNarrativeState,
      lastUsedSensoryVariant: {
        ...liveNarrativeState.lastUsedSensoryVariant,
        [locationId]: selectedVariantId,
      },
    };
  }
  ```

- **Test:**
  - Same location, same time-of-day, chapters 2 and 3 → different variant IDs selected.
  - Only 1 variant available → that variant is returned every time (no crash).
  - Obligation block for a location with a variant contains `"Sensory obligation"` line.

- **Risk:** `sensoryVariants[].id` must be stable per the CML (e.g. `'morning_rain'`). Confirm via schema — `id: string, required: true` is confirmed.

---

### 3.4 Texture pool injection

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildProsePrompt()` system message assembly; `buildPromptContextBlocks()` (~line 1664)

- **What:**

  Add a new `texture_pool` block to `buildPromptContextBlocks()`:
  ```typescript
  {
    key: 'texture_pool',
    priority: 'medium',
    content: texturePoolBlock,
    maxTokens: 600,
  }
  ```

  Build `texturePoolBlock` just before `buildPromptContextBlocks()` is called:
  ```typescript
  const { textureAtoms } = selectChapterAtoms(
    assetLibrary,
    activeCharacterNames,
    activeLocationIds,
    liveNarrativeState.deployedAssets,
    arcPosition,
  );
  const texturePoolBlock = textureAtoms.length > 0
    ? `## Texture Pool\nDraw on these as opportunities arise — you are not required to use them.\n\n` +
      textureAtoms.slice(0, 10).map(a => `- ${a.content}`).join('\n')
    : '';
  ```

- **Test:**
  - Token budget at cap → `texture_pool` block is dropped before `high`-priority blocks are touched.
  - 5 texture atoms → all 5 appear in rendered block when under budget.

- **Risk:** `textureAtoms.slice(0, 10)` hard cap prevents runaway injection before budgeting. The `applyPromptBudgeting()` `maxTokens: 600` cap provides the second line of defence.

---

### 3.5 Inject `atmosphere.sensoryPalette`

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildLocationProfilesBlock()` (extracted in §1.6), under the primary location block

- **What:**

  After the existing sensory details and before any `eraMarkers` block (§1.5):
  ```typescript
  const palette = inputs.locationProfiles?.atmosphere?.sensoryPalette;
  if (palette?.dominant) {
    const secondary = Array.isArray(palette.secondary) && palette.secondary.length > 0
      ? ` Secondary: ${palette.secondary.slice(0, 3).join(', ')}.`
      : '';
    locationBlock += `\n\nOverall palette: ${palette.dominant}.${secondary}`;
  }
  ```

- **Test:** Location profiles with `sensoryPalette: { dominant: 'wet wool and coal smoke', secondary: ['cold stone', 'tallow candles'] }` → rendered block contains `"Overall palette: wet wool and coal smoke. Secondary: cold stone, tallow candles."`.

- **Risk:** None.

---

### 3.6 Inject `keyLocations[n].accessControl`

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildLocationProfilesBlock()`, per-key-location loop

- **What:**

  In the key-location loop (after injecting sensory details for each location):
  ```typescript
  if (loc.accessControl) {
    locationBlock += `\nAccess: ${loc.accessControl}`;
  }
  ```

- **Test:** Key location with `accessControl: "By invitation only — locked after midnight"` → rendered block contains `"Access: By invitation only"`.

- **Risk:** None. Field is `required: true` in the schema, so defensive guard is still needed (`if (loc.accessControl)`) for CML files authored before the field was added.

---

---

## Phase 4 — Story Rhythm and Timing Gates

### 4.1 Two-phase `revealImplications` injection

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildWorldBriefBlock()`, `revealImplications` section (~line 1036)

- **Schema fact:** `worldDoc.revealImplications` is `type: string` (90-150 words of prose). Not an array.

- **Prerequisite:** Hoist `relativePos` out of the `if (bm)` block that currently owns it, placing the declaration in the outer scope **before** the break moment block:
  ```typescript
  // Add this BEFORE the `const bm = worldDoc.breakMoment;` line:
  const relativePos = chapterIndex / Math.max(1, totalChapters);
  // Then remove the duplicate `const relativePos = ...` from inside `if (bm) { ... }`
  ```

- **What:**

  The current code injects `revealImplications` verbatim only in the final act:

  **Before** (~line 1036):
  ```typescript
  // Reveal implications — only in final act
  if (worldDoc.revealImplications && chapterIndex >= Math.floor(totalChapters * 0.75)) {
    lines.push(`\n## Reveal Implications (plant these subtly)\n${worldDoc.revealImplications}`);
  }
  ```

  **After:**
  ```typescript
  if (typeof worldDoc.revealImplications === 'string' && worldDoc.revealImplications.length > 0) {
    if (relativePos >= 0.75) {
      // Late chapters: full retrospective injection (unchanged heading kept for consistency)
      lines.push(`\n## Reveal Implications (plant these subtly)\n${worldDoc.revealImplications}`);
    } else if (chapterIndex >= 2) {
      // Chapters 3 → 74%: forward-planting instruction as texture
      // Truncate to first 80 chars to form the planting template noun phrase
      const fragment = worldDoc.revealImplications.split('.')[0]?.slice(0, 100) ?? worldDoc.revealImplications.slice(0, 100);
      lines.push(
        `\n## Reveal Groundwork (texture — do not explain, only plant)\n` +
        `Plant a detail related to: "${fragment}" — do not explain its significance yet.`,
      );
    }
    // Chapters 0–1 (chapterIndex ≤ 1): no injection
  }
  ```

- **Test:**
  - Chapter 3 / 12-chapter story (25%) → block contains `"Reveal Groundwork"` and `"do not explain"`, NOT `"Reveal Implications"`.
  - Chapter 10 / 12 (83%) → block contains `"Reveal Implications (plant these subtly)"`, NOT `"Groundwork"` phrasing.
  - Chapter 1 → neither block present.
  - `revealImplications` is a short sentence → `fragment` extraction uses `.split('.')[0]` safely.

- **Risk:** Planting atoms become texture-pool atoms in Phase 2 once the asset library is in use. Until then, inject them directly in `buildWorldBriefBlock()` as a text block; they will be refactored into `selectChapterAtoms()` scope during Phase 3 integration.

---

### 4.2 Break moment approach signal (40–60% window)

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildWorldBriefBlock()`, break moment section (~line 1029)

- **Schema facts:** `breakMoment` has fields `character`, `scenePosition`, `form`, `narrativeFunction`. There is **no** `description` field.

- **Prerequisite:** `relativePos` must be hoisted per §4.1 above (both §4.1 and §4.2 After code depend on it being available in the outer function scope).

- **What:**

  **Before (actual source):**
  ```typescript
  const bm = worldDoc.breakMoment;
  if (bm) {
    const relativePos = chapterIndex / Math.max(1, totalChapters);  // <-- will be removed by hoisting
    if (relativePos >= 0.6 && relativePos <= 0.85) {
      lines.push(`\n## Character Break Moment (this section of the story)\nCharacter: ${bm.character}\nForm: ${bm.form}\nNarrative function: ${bm.narrativeFunction}`);
    }
  }
  ```

  **After** (uses hoisted `relativePos` from §4.1 prerequisite):
  ```typescript
  if (worldDoc?.breakMoment?.character) {
    const bm = worldDoc.breakMoment;
    if (relativePos >= 0.60 && relativePos <= 0.85) {
      // Full obligation injection — keep existing heading and multi-field format
      lines.push(
        `\n## Character Break Moment (this section of the story)\n` +
        `Character: ${bm.character}\n` +
        `Form: ${bm.form ?? ''}\n` +
        `Narrative function: ${bm.narrativeFunction ?? ''}`,
      );
    } else if (relativePos >= 0.40 && relativePos < 0.60) {
      // Approach signal: texture only — "approaching" not "at"
      lines.push(
        `\n## Character Pressure\n` +
        `${bm.character} is approaching a point of breakdown. ` +
        `Stress and strain should be accumulating visibly — through behaviour, not statement. ` +
        `No confrontation yet.`,
      );
    }
  }
  ```

  The `relativePos` ranges are mutually exclusive: `[0.40, 0.60)` vs `[0.60, 0.85]`. No state needed.

- **Test:**
  - Chapter 5/12 (41%) → "Character Pressure" block present; full "Character Break Moment" absent.
  - Chapter 7/12 (58%) → "Character Pressure" block present (still in [0.40, 0.60) window).
  - Chapter 8/12 (66%) → "Character Break Moment" block present; "Character Pressure" absent.
  - Chapter 2/12 (16%) → neither block present.

- **Risk:** `breakMoment.character` may be absent in older CML files. The `worldDoc?.breakMoment?.character` guard keeps the section silent rather than crashing.

---

### 4.3 Break moment full obligation — obligation stamping

- **Where:** `apps/worker/src/jobs/agents/agent9-run.ts` — `onBatchComplete` callback (§2.5 infrastructure)

- **What:**

  Once Phase 2.5 obligation stamping is in place, the break-moment full-injection block in `buildWorldBriefBlock()` is a window-scoped atom (`scope: 'window'`, `budget: 1`). Add it to the library in `buildAssetLibrary()`:

  ```typescript
  if (worldDoc?.breakMoment) {
    add({
      id: 'break_moment:story:full',
      source: 'worldDoc.breakMoment',
      scope: 'window',
      scopeKey: '',
      tier: 'obligation',
      budget: 1,
      priority: 'high',
      content: `${worldDoc.breakMoment.character}: ${worldDoc.breakMoment.form ?? ''} — ${worldDoc.breakMoment.narrativeFunction ?? ''}`,
    });
  }
  ```

  After the break-moment chapter commits, `deployedAssets['break_moment:story:full']` will be populated and `selectChapterAtoms()` will exclude it from future batches.

  **No prompt-builder change needed for Phase 4.3.** The obligation stamping infrastructure from §2.5 handles retirement automatically.

- **Test:** Integration: 12-chapter story; chapter 8 is in the 60–85% window and triggers the full break-moment block → `deployedAssets['break_moment:story:full']` equals `[8]`; chapters 9–12 no longer receive the break-moment block.

- **Risk:** Depends on Phase 2.5 (obligation stamping). Until Phase 2.5 is live, the window-based conditional in `buildWorldBriefBlock()` prevents double-injection anyway.

---

### 4.4 Tonal contrast enforcement

- **Where:** `packages/prompts-llm/src/types/narrative-state.ts` — `NarrativeState`; `packages/prompts-llm/src/agent9-prose.ts` — `buildChapterObligationBlock()` (§2.2 adds `previousChapterArcPosition` field)

- **What:**

  `previousChapterArcPosition` is already added to `NarrativeState` in §2.2. Update `updateNSD()` to accept and store it:

  ```typescript
  export function updateNSD(
    current: NarrativeState,
    lastChapter: {
      paragraphs?: string[];
      cluesRevealedIds?: string[];
      arcPosition?: string;    // NEW
    },
  ): NarrativeState {
    return {
      ...current,
      continuityTail: ...,
      cluesRevealedToReader: ...,
      previousChapterArcPosition: lastChapter.arcPosition ?? current.previousChapterArcPosition,
    };
  }
  ```

  In `generateProse()` batch commit path, pass the current arc position to `updateNSD()`:
  ```typescript
  liveNarrativeState = updateNSD(liveNarrativeState, {
    paragraphs: lastProseChapter?.paragraphs,
    cluesRevealedIds: batchRevealedIds,
    arcPosition: currentArcPosition,   // derive from chapterStart / sceneCount
  });
  ```

  In `buildChapterObligationBlock()`, add the tonal contrast check:
  ```typescript
  const HIGH_TENSION_POSITIONS = new Set(['first_turn', 'mid', 'second_turn', 'pre_climax', 'climax']);

  if (
    narrativeState?.previousChapterArcPosition &&
    HIGH_TENSION_POSITIONS.has(narrativeState.previousChapterArcPosition) &&
    HIGH_TENSION_POSITIONS.has(currentArcPosition)
  ) {
    const humourEntry = worldDoc?.humourPlacementMap?.find(
      (e: any) => e.scenePosition === ARC_POS_TO_SCENE_TYPE[currentArcPosition],
    );
    if (humourEntry?.humourPermission !== 'forbidden' && humourEntry?.permittedCharacters?.length > 0) {
      lines.push(
        `\nTonal contrast required: the previous chapter was high-tension. ` +
        `${humourEntry.permittedCharacters[0]} may use ${humourEntry.permittedForms?.[0] ?? 'understatement'} ` +
        `to provide a brief moment of relief before tension resumes.`,
      );
    } else {
      lines.push(
        `\nTonal contrast required: the previous chapter was high-tension. ` +
        `This chapter must include at least one beat of relief, pause, or quiet observation.`,
      );
    }
  }
  ```

- **Test:**
  - Two consecutive chapters both in `mid` arc position → obligation block contains `"Tonal contrast"`.
  - One `early` then one `climax` → no contrast instruction injected (early is not high-tension).
  - High-tension → high-tension with humour permitted → character-specific humour framing injected.

- **Risk:** Depends on Phase 1.1 (`ARC_POS_TO_SCENE_TYPE` constant). Import it from the same module.

---

---

## Phase 5 — Diagnostics and Quality Feedback Loop

### 5.1 LLM self-report `<used_assets>` tag

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `buildProsePrompt()` system message tail; response parsing path (~line 2300); `apps/worker/src/jobs/agents/agent9-run.ts` — `onBatchComplete`

- **What:**

  **A. Add self-report instruction to system message in `buildProsePrompt()`:**
  ```typescript
  // At the end of the composedSystem string, after all other blocks:
  if (textureAtomIds.length > 0) {
    composedSystem +=
      `\n\n## Asset Self-Report (required)\n` +
      `At the very END of your response, after all prose, add a single line:\n` +
      `<used_assets>${textureAtomIds.join(',')}</used_assets>\n` +
      `Replace the list with only the IDs of texture assets you actually used. ` +
      `If you used none, output <used_assets></used_assets>.`;
  }
  ```
  `textureAtomIds` is the list of texture atom IDs passed to the chapter.

  **B. Extract the self-report tag in the chapter parsing path (~line 2300):**
  ```typescript
  function extractAndStripUsedAssets(rawResponse: string): {
    prose: string;
    usedAssetIds: string[];
  } {
    const match = rawResponse.match(/<used_assets>([\s\S]*?)<\/used_assets>/);
    const usedAssetIds = match
      ? match[1].split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const prose = rawResponse.replace(/<used_assets>[\s\S]*?<\/used_assets>/g, '').trimEnd();
    return { prose, usedAssetIds };
  }
  ```

  Call `extractAndStripUsedAssets()` in the JSON parse path before the prose is stored. Pass `usedAssetIds` back through the `onBatchComplete` callback (add a `usedTextureAtomIds?: string[]` field to the callback arguments).

  **C. Stamp texture atoms in `onBatchComplete`:**
  ```typescript
  // In onBatchComplete, after obligation stamping (§2.5):
  for (const atomId of (usedTextureAtomIds ?? [])) {
    // Validate: only stamp IDs that exist in the library (reject LLM hallucinations)
    if (!assetLibrary[atomId]) continue;
    narrativeState.deployedAssets[atomId] = [
      ...(narrativeState.deployedAssets[atomId] ?? []),
      batchStart,
    ];
  }
  ```

- **Test:**
  - Unit: `extractAndStripUsedAssets('...prose...\n<used_assets>era:story:0,era:story:1</used_assets>')` → `prose` contains no XML tag; `usedAssetIds = ['era:story:0', 'era:story:1']`.
  - Unit: LLM hallucinates `<used_assets>fake_id</used_assets>` → after `assetLibrary` validation, no stamp applied for `fake_id`.
  - Integration: Failed retry chapter → no texture stamping applied (only commit path stamps).

- **Risk:** LLM may include the `<used_assets>` tag mid-prose (unlikely but possible). The regex `/<used_assets>[\s\S]*?<\/used_assets>/g` strips ALL occurrences. Validate that remaining prose is structurally sound after stripping.

---

### 5.2 Budget enforcement for texture atoms

- **Where:** `packages/prompts-llm/src/asset-library.ts` — `selectChapterAtoms()`

- **What:**

  The `deployedAssets` entries accumulated by §2.5 (obligation) and §5.1 (texture self-report) feed directly into the `budget > 0 && usedCount >= budget` filter already present in `selectChapterAtoms()`. No additional code is needed once §5.1 is live.

  Add the defensive secondary guard for atoms that cleared the budget check but subsequently had their `deployedAssets` count updated mid-batch (race between callback and next prompt build):
  ```typescript
  // In selectChapterAtoms(), after the main filter loop:
  const hardCapTexture = texture.filter(a =>
    a.budget === 0 || (deployedAssets[a.id] ?? []).length < a.budget,
  );
  return { obligationAtoms: obligation, textureAtoms: hardCapTexture };
  ```

- **Test:** Texture atom with `budget: 2` already stamped twice (`deployedAssets[id] = [3, 7]`) → excluded from `textureAtoms`.

- **Risk:** None. This is a defensive guard on existing logic.

---

### 5.3 End-of-run asset diagnostic report

- **Where:** `packages/prompts-llm/src/asset-library.ts` — new `buildAssetDiagnosticReport()` function; `apps/worker/src/jobs/agents/agent9-run.ts` — after final chapter commit

- **What:**

  ```typescript
  export function buildAssetDiagnosticReport(
    library: AssetLibrary,
    deployedAssets: Record<string, number[]>,
  ): string {
    const lines: string[] = ['# Asset Deployment Diagnostic'];

    const neverDeployed = Object.values(library).filter(
      a => !(deployedAssets[a.id]?.length > 0),
    );
    const overDeployed = Object.values(library).filter(
      a => a.budget > 0 && (deployedAssets[a.id]?.length ?? 0) > a.budget,
    );

    lines.push(`\n## Never Deployed (${neverDeployed.length})`);
    for (const a of neverDeployed) {
      lines.push(`- [${a.tier}] ${a.id} (budget: ${a.budget})`);
    }

    lines.push(`\n## Over-Deployed (${overDeployed.length})`);
    for (const a of overDeployed) {
      const count = deployedAssets[a.id].length;
      lines.push(`- ${a.id}: deployed ${count}× against budget ${a.budget}`);
    }

    // Per-type deployment breakdown
    const byScope = new Map<string, number>();
    for (const [id, chapters] of Object.entries(deployedAssets)) {
      if (!library[id]) continue;
      const scope = library[id].scope;
      byScope.set(scope, (byScope.get(scope) ?? 0) + chapters.length);
    }
    lines.push('\n## Deployment by Scope');
    for (const [scope, count] of byScope.entries()) {
      lines.push(`- ${scope}: ${count} deployments`);
    }

    return lines.join('\n');
  }
  ```

  In `agent9-run.ts`, after the final chapter commits:
  ```typescript
  if (assetLibrary && narrativeState.deployedAssets) {
    const report = buildAssetDiagnosticReport(assetLibrary, narrativeState.deployedAssets);
    ctx.runLogger.logDiagnostic('asset_deployment', report);
  }
  ```

- **Test:** Unit: library of 10 atoms, 3 never deployed, 2 over-budget → report contains exactly those 3 IDs in `"Never Deployed"` and those 2 IDs in `"Over-Deployed"`.

- **Risk:** None. The report is write-only (no action taken on its content).

---

### 5.4 Wire `detectRecurringPhrases` into scoring and retry

- **Where:** `packages/prompts-llm/src/agent9-prose.ts` — `generateProse()` batch commit path; `buildPromptContextBlocks()` `provisional_scoring_feedback` block

- **What:**

  `detectRecurringPhrases()` is already called at the end of the run (after all chapters), feeding `runAtmosphereRepairIfNeeded()`. The new wiring: also call it at each batch boundary and forward warnings to the NEXT batch's scoring block.

  **A. In `generateProse()` batch commit path, after `updateNSD()`:**
  ```typescript
  // After updateNSD call:
  const batchText = proseBatch.chapters.flatMap((ch: ProseChapter) => ch.paragraphs);
  const newPhraseWarnings = detectRecurringPhrases([{ paragraphs: batchText }]);
  if (newPhraseWarnings.length > 0) {
    liveNarrativeState = {
      ...liveNarrativeState,
      recurringPhraseWarnings: [
        ...new Set([...liveNarrativeState.recurringPhraseWarnings, ...newPhraseWarnings.map(p => p.phrase)]),
      ].slice(0, 10), // cap at 10 phrases
    };
  }
  ```

  **B. In `buildPromptContextBlocks()`, read `recurringPhraseWarnings` from NarrativeState:**
  ```typescript
  const phraseWarningText = narrativeState?.recurringPhraseWarnings?.length > 0
    ? `\nPhrases to avoid (already overused in earlier chapters): ` +
      narrativeState.recurringPhraseWarnings.map(p => `"${p}"`).join(', ') + '.'
    : '';
  // Append to the provisional_scoring_feedback block content
  ```

  **C. Clear phrase warnings after they are injected** (so they don't persist forever):
  ```typescript
  // In generateProse() batch commit path, after injecting them into the prompt:
  liveNarrativeState = { ...liveNarrativeState, recurringPhraseWarnings: [] };
  ```
  Actually: clear them only after the NEXT batch's prompt has been built, not immediately after commit. Use a "pending warnings" pattern: warnings from batch N are consumed when building batch N+1's prompt, then cleared.

- **Test:**
  - Unit: chapter with phrase `"the shadows deepened"` appearing 4 times → `recurringPhraseWarnings` contains `"the shadows deepened"` after commit.
  - Unit: `buildPromptContextBlocks()` with `recurringPhraseWarnings: ['the shadows deepened']` → `provisional_scoring_feedback` block contains `'"the shadows deepened"'`.
  - Regression: empty `recurringPhraseWarnings` → no phrase-avoidance text in scoring block.

- **Risk:** `detectRecurringPhrases()` may be slow on long chapters if called per-batch. Profile it; if > 50ms, call it async in a setTimeout and accept a 1-batch delay on warning propagation.

---

---

## Phase 6 — Temporal Context Completeness

All Phase 6 changes are **additive** to the existing `buildTemporalContextBlock()` extracted in §1.6. The existing builder retains all current content (season-lock enforcement, `getSeasonAllowList()`, USAGE REQUIREMENTS, fashion integration guidance, cultural touchstone guidance, `specificDate` injection, prices, atmospheric details). Phase 6 only appends the following new fields to their respective sections.

> **Important:** Do NOT replace the existing inline builder with a simplified version. Extract the existing builder as-is into `buildTemporalContextBlock()` first (§1.6), then add each new field below into the correct position of that extracted function.

The new code lines to add (each inserted at the position indicated):

```typescript
// ── After existing `Weather: ${seasonWeather}` line: ─────────────────────── §6.1 + §6.2
if (inputs.temporalContext?.seasonal?.daylight) {
  temporalContextBlock += `\\n- Daylight: ${inputs.temporalContext.seasonal.daylight}`;
}
if ((inputs.temporalContext?.seasonal?.seasonalActivities ?? []).length > 0) {
  temporalContextBlock += `\\n- Seasonal activities: ${inputs.temporalContext.seasonal.seasonalActivities.slice(0, 4).join(', ')}`;
}
if ((inputs.temporalContext?.seasonal?.holidays ?? []).length > 0) {
  temporalContextBlock += `\\n- Seasonal occasions: ${inputs.temporalContext.seasonal.holidays.slice(0, 3).join(', ')}`;
}

// ── After existing `films` line in entertainment section: ────────────────── §6.3
const theaterStr = (inputs.temporalContext?.cultural?.entertainment?.theater ?? []).slice(0, 2).join(', ');
const radioStr   = (inputs.temporalContext?.cultural?.entertainment?.radio   ?? []).slice(0, 2).join(', ');
if (theaterStr) temporalContextBlock += `; Theatre: ${theaterStr}`;
if (radioStr)   temporalContextBlock += `; Radio: ${radioStr}`;

// ── After entertainment line: ─────────────────────────────────────────────── §6.4
const litPubs   = (inputs.temporalContext?.cultural?.literature?.recentPublications ?? []).slice(0, 3);
const litGenres = (inputs.temporalContext?.cultural?.literature?.popularGenres ?? []).slice(0, 3);
if (litPubs.length || litGenres.length) {
  temporalContextBlock += `\\n- Literature: ${[...litPubs, ...litGenres.map((g: string) => `[${g}]`)].join(' | ')}`;
}

// ── After literature line: ───────────────────────────────────────────────── §6.5
const techItems = [
  ...(inputs.temporalContext?.cultural?.technology?.recentInventions ?? []).slice(0, 3),
  ...(inputs.temporalContext?.cultural?.technology?.commonDevices ?? []).slice(0, 3),
];
if (techItems.length) {
  temporalContextBlock += `\\n- Technology: ${techItems.join(' | ')}`;
}

// ── After technology line: ───────────────────────────────────────────────── §6.6
const dailyActivities = (inputs.temporalContext?.cultural?.dailyLife?.commonActivities ?? []).slice(0, 3);
const socialRituals   = (inputs.temporalContext?.cultural?.dailyLife?.socialRituals ?? []).slice(0, 3);
if (dailyActivities.length) temporalContextBlock += `\\n- Daily life: ${dailyActivities.join(', ')}`;
if (socialRituals.length)   temporalContextBlock += `\\n- Social rituals: ${socialRituals.join(', ')}`;

// ── At end of block (lowest priority — first cut under budget pressure): ─── §6.7
const sa = inputs.temporalContext?.socialAttitudes;
if (sa) {
  const saParts: string[] = [];
  if ((sa.class ?? []).length)        saParts.push(`class: ${(sa.class as string[]).slice(0, 2).join(', ')}`);
  if ((sa.gender ?? []).length)       saParts.push(`gender: ${(sa.gender as string[]).slice(0, 2).join(', ')}`);
  if ((sa.generalNorms ?? []).length) saParts.push(`norms: ${(sa.generalNorms as string[]).slice(0, 2).join(', ')}`);
  if (saParts.length) temporalContextBlock += `\\n- Social attitudes — ${saParts.join(' | ')}`;
}
```

The `temporal_context` block is assigned `priority: 'high'` and `maxTokens: 850` in `applyPromptBudgeting()`. All new content is appended to the single existing block string, so the existing 850-token cap applies to it as a unit. Social attitudes is appended last so token-budget truncation drops it first.

### 6.1 Inject `seasonal.daylight`

- **Where:** Existing temporal builder — after `seasonWeather` line
- **What:** `temporalContextBlock += \`\\n- Daylight: ${daylight}\`` when `temporalContext.seasonal.daylight` is present.
- **Test:** Input with `seasonal.daylight: 'Long summer days — dusk after 9 PM'` → rendered block contains `"Daylight:"`.
- **Risk:** None.

### 6.2 Inject `seasonal.holidays[]` and `seasonal.seasonalActivities[]`

- **Where:** Existing temporal builder — after §6.1 daylight line
- **What:** Two conditional appends; each omitted when the array is absent or empty.
- **Test:** Both arrays populated → both lines present. Both empty → neither line present.
- **Risk:** None.

### 6.3 Inject `cultural.entertainment.theater[]` and `radio[]`

- **Where:** Existing temporal builder — appended to the end of the existing `music` variable line (after `films`)
- **What:** Append `"; Theatre: ..."` and `"; Radio: ..."` to the concatenated entertainment string.
- **Test:** `theater: ['The Mousetrap']` → entertainment line contains `"Theatre: The Mousetrap"`.
- **Risk:** None.

### 6.4 Inject `cultural.literature.*`

- **Where:** Existing temporal builder — after entertainment concatenation
- **What:** Single line `"- Literature: {recentPublications} | {[popularGenres]}"`.
- **Test:** `literature: { recentPublications: ['Crime at Black Dudley'], popularGenres: ['detective fiction'] }` → `"Literature: Crime at Black Dudley | [detective fiction]"`.
- **Risk:** None.

### 6.5 Inject `cultural.technology.*`

- **Where:** Existing temporal builder — after §6.4 literature line
- **What:** Single line `"- Technology: {recentInventions} | {commonDevices}"`.
- **Test:** `recentInventions: ['television broadcast']` → `"Technology: television broadcast"`.
- **Risk:** None.

### 6.6 Inject `cultural.dailyLife.commonActivities[]` and `socialRituals[]`

- **Where:** Existing temporal builder — after §6.5 technology line
- **What:** Two conditional appends.
- **Test:** Both arrays set → both lines present. One absent → only the populated line appears.
- **Risk:** None.

### 6.7 Inject `socialAttitudes.*`


- **Where:** `buildTemporalContextBlock()` — last in the block (token-budget-friendly position)
- **What:** Single line: `"Social attitudes — class: ...; gender: ...; norms: ..."`.
- **Test:** Input with only `class` populated → line contains `"class:"` and no `"gender:"` or `"norms:"`.
- **Test (token-budget):** `buildTemporalContextBlock()` output fed into `applyPromptBudgeting()` with a 100-token cap → social attitudes line is the first content lost.
- **Risk:** Confirmed that the 850-token cap in `applyPromptBudgeting()` applies to the block as a unit (not to individual lines). The line ordering within the block guarantees social attitudes is truncated last-to-first if the block is too long.

---

---

## Cross-cutting Concerns

### Final `NarrativeState` interface (authoritative — after all phases)

```typescript
// packages/prompts-llm/src/types/narrative-state.ts

export interface NarrativeState {
  version: 1;
  lockedFacts: LockedFact[];
  characterPronouns: Record<string, string>;
  cluesRevealedToReader: string[];           // §1.3: now correctly synced
  continuityTail: string;
  victimConfirmedDeadChapter?: number;       // §1.2: was never set; now set on keyword scan
  deployedAssets: Record<string, number[]>;  // §2.2: new — maps atomId → [chapter numbers]
  lastUsedSensoryVariant: Record<string, string>; // §3.3: new — maps locationKey → variantKey
  previousChapterArcPosition?: string;       // §4.4: new — arc position of last committed chapter
  recurringPhraseWarnings: string[];         // §5.4: new — phrases to suppress in next batch
}

// Signature preserved — two parameters required (lockedFacts and characterGenders).
// The inline pronoun-building loop is retained; new fields are added to the return object:
export function initNarrativeState(
  lockedFacts: LockedFact[],
  characterGenders: Record<string, string>,
): NarrativeState {
  const characterPronouns: Record<string, string> = {};
  for (const [name, gender] of Object.entries(characterGenders)) {
    const g = gender?.toLowerCase();
    if (g === 'male') characterPronouns[name] = 'he/him/his';
    else if (g === 'female') characterPronouns[name] = 'she/her/her';
    else if (g === 'non-binary') characterPronouns[name] = 'they/them/their';
  }
  return {
    version: 1,
    lockedFacts,
    characterPronouns,
    cluesRevealedToReader: [],
    continuityTail: '',
    victimConfirmedDeadChapter: undefined,
    deployedAssets: {},
    lastUsedSensoryVariant: {},
    previousChapterArcPosition: undefined,
    recurringPhraseWarnings: [],
  };
}
```

**Checkpoint migration:** When deserialising a `NarrativeState` from a checkpoint that predates these fields, apply defaults:

```typescript
function migrateNarrativeState(raw: Partial<NarrativeState>): NarrativeState {
  return {
    ...initNarrativeState(raw.lockedFacts ?? [], {}),
    ...raw,
    deployedAssets: raw.deployedAssets ?? {},
    lastUsedSensoryVariant: raw.lastUsedSensoryVariant ?? {},
    recurringPhraseWarnings: raw.recurringPhraseWarnings ?? [],
  };
}
```

Call `migrateNarrativeState()` instead of raw assertion in the checkpoint-load path.

---

### Shared constants — `constants/arc-position.ts`

Create `packages/prompts-llm/src/constants/arc-position.ts` (new file, no existing equivalent):

```typescript
/**
 * Maps the 8 arc-position labels used in storyEmotionalArc and chapter batches
 * to the 12 scenePosition labels used in worldDoc.humourPlacementMap[].scenePosition.
 *
 * Only pre_climax and resolution overlap naturally.
 * All other mappings are defined here (§1.1 fix).
 */
export const ARC_POS_TO_SCENE_TYPE: Record<string, string> = {
  opening:     'opening_scene',
  early:       'first_investigation',
  first_turn:  'tension_scene',       // first plot turn = first tension escalation scene
  mid:         'mid_investigation',
  second_turn: 'second_interview',
  pre_climax:  'pre_climax',
  climax:      'discriminating_test',
  resolution:  'resolution',
};

/**
 * Dominant narrative register for each arc position.
 * Used in: §3.2 voice fragment selection, §4.4 tonal contrast.
 */
export const ARC_POSITION_REGISTER: Record<string, string> = {
  opening:     'warm',
  early:       'curious',
  first_turn:  'urgent',
  mid:         'methodical',
  second_turn: 'stressed',
  pre_climax:  'stressed',
  climax:      'tense',
  resolution:  'reflective',
};

/**
 * High-tension positions used by §4.4 tonal contrast enforcement.
 */
export const HIGH_TENSION_POSITIONS = new Set([
  'first_turn',
  'second_turn',
  'pre_climax',
  'climax',
]);
```

**Import everywhere that currently re-declares these values inline.**
- `buildWorldBriefBlock()` in `agent9-prose.ts` — imports `ARC_POS_TO_SCENE_TYPE` (§1.1)
- `buildChapterObligationBlock()` in `agent9-prose.ts` — imports `HIGH_TENSION_POSITIONS`, `ARC_POSITION_REGISTER` (§3.2, §4.4)
- `selectChapterAtoms()` in `asset-library.ts` — imports `ARC_POSITION_REGISTER` (§2.4)

---

### New files summary

| File | Phase | Purpose |
|---|---|---|
| `packages/prompts-llm/src/constants/arc-position.ts` | 1.1 | Shared arc-position constants |
| `packages/prompts-llm/src/types/asset-library.ts` | 2.1 | `Asset` interface + `AssetLibrary` type |
| `packages/prompts-llm/src/asset-library.ts` | 2.3 | `buildAssetLibrary()` + `selectChapterAtoms()` + `buildAssetDiagnosticReport()` |

No other new files. All other changes are edits to existing files.

---

### Token budget governance

Current totals in `applyPromptBudgeting()` (all blocks must fit within **6,200 tokens** total):

| Block | Priority | Current cap | Phase impact |
|---|---|---|---|
| `pronoun_accuracy` | critical | 700 | none |
| `character_personality` | high | 1,400 | §1.6: active-set filter reduces consumed tokens |
| `location_profiles` | high | 1,000 | §3.5 sensoryPalette + §3.6 accessControl add ~80 tokens |
| `temporal_context` | high | 850 | §6.1–6.7 add up to ~200 tokens (social attitudes last) |
| `continuity_context` | high | 500 | none |
| `humour_guide` | medium | 850 | §1.1 fix increases hit rate — now consumes its budget more often |
| `craft_guide` | medium | 850 | none |
| `texture_pool` | medium | 600 | §3.4: NEW — cap must be registered in `applyPromptBudgeting()` |
| `provisional_scoring_feedback` | optional | 300 | §5.4: adds phrase-warning suffix (~50 tokens) |

**Rules:**
1. No new prose content may be appended to `composedSystem` outside `buildPromptContextBlocks()`.
2. All new blocks must declare `priority` and `maxTokens` in `buildPromptContextBlocks()`.
3. When total exceeds 6,200, the drop order is: optional → medium → high. Critical is never dropped.
4. The `texture_pool` block (medium, 600) is the largest new addition — if the budget is tight, it is the first medium-priority block to be dropped. This is acceptable: texture is enhancement, not correctness.

---

### `updateNSD()` signature (final)

```typescript
export function updateNSD(
  current: NarrativeState,
  lastChapter: {
    paragraphs?: string[];
    cluesRevealedIds?: string[];    // §1.3
    arcPosition?: string;           // §4.4
  },
): NarrativeState;
```

All call sites (in `generateProse()` and in `onBatchComplete`) must be updated to pass `arcPosition` and `cluesRevealedIds`. The orchestrator's existing `onBatchComplete` already passes `cluesRevealedIds` — only `arcPosition` needs to be added there.

---

### Implementation sequence

Execute phases in this order to minimise re-work:

1. **Phase 1** (correctness fixes) — self-contained, no dependencies
2. **Phase 6** (temporal context) — self-contained, safe to do early
3. **Phase 2** (asset library: new files + NarrativeState fields) — foundation for 3, 4, 5
4. **Phase 3** (scoped context assembly) — depends on Phase 2 (asset library)
5. **Phase 4** (rhythm gates) — depends on Phase 2 (deployedAssets stamping for §4.3)
6. **Phase 5** (diagnostics) — depends on Phase 2 (self-report stamping)

All phases within a phase can be implemented in section order (1.1 → 1.6, etc.).

---

---

## Implementation Tracker

Status legend: `[ ]` not started · `[~]` in progress · `[x]` complete · `[!]` blocked

### Phase 1 — Correctness Fixes and Missing Injections

| # | Section | Task | File | Status |
|---|---------|------|------|--------|
| 1.1 | §1.1 | Fix `humourPlacementMap` enum mismatch — add `ARC_POS_TO_SCENE_TYPE` constant, rewrite lookup | `agent9-prose.ts` | `[x]` |
| 1.2 | §1.2 | Wire `victimConfirmedDeadChapter` setter — export `resolveVictimName` from `index.ts`; import + call in `agent9-run.ts` | `index.ts`, `agent9-run.ts` | `[x]` |
| 1.3 | §1.3 | Sync `cluesRevealedToReader` — pass `scene.cluesRevealed` ids into `updateNSD()` call | `agent9-prose.ts` | `[x]` |
| 1.4 | §1.4 | Inject `arcDescription` into `buildWorldBriefBlock()` at 0–100% | `agent9-prose.ts` | `[x]` |
| 1.5 | §1.5 | Inject `atmosphere.eraMarkers` into location profiles block | `agent9-prose.ts` | `[x]` |
| 1.6a | §1.6 | Extract `buildCharacterPersonalityBlock()`, filter to scene-active characters | `agent9-prose.ts` | `[x]` |
| 1.6b | §1.6 | Extract `buildLocationProfilesBlock()` | `agent9-prose.ts` | `[x]` |
| 1.6c | §1.6 | Extract `buildTemporalContextBlock()` | `agent9-prose.ts` | `[x]` |

### Phase 2 — Asset Library Foundation

| # | Section | Task | File | Status |
|---|---------|------|------|--------|
| 2.1 | §2.1 | Define `Asset` interface and `AssetLibrary` type | `types/asset-library.ts` (new) | `[x]` |
| 2.2a | §2.2 | Add `deployedAssets`, `lastUsedSensoryVariant`, `previousChapterArcPosition`, `recurringPhraseWarnings` to `NarrativeState` | `types/narrative-state.ts` | `[x]` |
| 2.2b | §2.2 | Update `initNarrativeState()` return object with new fields | `types/narrative-state.ts` | `[x]` |
| 2.2c | §2.2 | Update `migrateNarrativeState()` to call `initNarrativeState(raw.lockedFacts ?? [], {})` | `types/narrative-state.ts` | `[x]` |
| 2.3 | §2.3 | Build `buildAssetLibrary()` function | `asset-library.ts` (new) | `[x]` |
| 2.4 | §2.4 | Build `selectChapterAtoms()` function | `asset-library.ts` (new) | `[x]` |
| 2.5 | §2.5 | Obligation stamping in `onBatchComplete` — mark deployed atoms in `NarrativeState` | `agent9-run.ts` | `[x]` |

### Phase 3 — Scoped Context Assembly

| # | Section | Task | File | Status |
|---|---------|------|------|--------|
| 3.1 | §3.1 | Replace flat portrait + voice injection with scoped obligation pool | `agent9-prose.ts` | `[x]` |
| 3.2 | §3.2 | Register-matched voice fragment selection (import `ARC_POSITION_REGISTER`) | `agent9-prose.ts` | `[x]` |
| 3.3a | §3.3 | `selectSensoryVariant()` in `buildLocationProfilesBlock()` | `agent9-prose.ts` | `[x]` |
| 3.3b | §3.3 | Add sensory variant obligation injection to `buildChapterObligationBlock()` | `agent9-prose.ts` | `[x]` |
| 3.3c | §3.3 | Add `lastUsedSensoryVariant` stamping after batch commit in `generateProse()` | `agent9-prose.ts` | `[x]` |
| 3.4 | §3.4 | Texture pool injection — `texturePoolBlock` + register in `buildPromptContextBlocks()` | `agent9-prose.ts` | `[x]` |
| 3.5 | §3.5 | Inject `atmosphere.sensoryPalette` into location profiles block | `agent9-prose.ts` | `[x]` |
| 3.6 | §3.6 | Inject `keyLocations[n].accessControl` into location profiles block | `agent9-prose.ts` | `[ ]` |

### Phase 4 — Story Rhythm and Timing Gates

| # | Section | Task | File | Status |
|---|---------|------|------|--------|
| 4.0 | §4.1 pre | Hoist `relativePos` to outer scope of `buildWorldBriefBlock()` (prerequisite for 4.1 + 4.2) | `agent9-prose.ts` | `[x]` |
| 4.1 | §4.1 | Two-phase `revealImplications` injection (string-typed, not array) | `agent9-prose.ts` | `[x]` |
| 4.2 | §4.2 | Break moment approach signal — add 40–60% pre-signal block | `agent9-prose.ts` | `[x]` |
| 4.3 | §4.3 | Break moment full obligation — add atom to `buildAssetLibrary()` | `agent9-prose.ts` | `[x]` |
| 4.4a | §4.4 | Tonal contrast — update `updateNSD()` to accept + store `arcPosition` | `types/narrative-state.ts` | `[x]` |
| 4.4b | §4.4 | Tonal contrast — add `previousChapterArcPosition` enforcement to `buildChapterObligationBlock()` | `agent9-prose.ts` | `[x]` |
| 4.4c | §4.4 | Pass `arcPosition` at all `updateNSD()` call sites | `agent9-prose.ts`, `agent9-run.ts` | `[x]` |

### Phase 5 — Diagnostics and Quality Feedback Loop

| # | Section | Task | File | Status |
|---|---------|------|------|--------|
| 5.1 | §5.1 | LLM self-report `<used_assets>` — parse tag from prose output, stamp `deployedAssets` | `agent9-prose.ts`, `agent9-run.ts` | `[x]` |
| 5.2 | §5.2 | Budget enforcement — cap texture atoms consumed per chapter | `asset-library.ts` | `[x]` |
| 5.3 | §5.3 | End-of-run asset diagnostic — `buildAssetDiagnosticReport()`, write to log | `asset-library.ts`, `agent9-run.ts` | `[x]` |
| 5.4a | §5.4 | `detectRecurringPhrases()` — implement phrase frequency scan | `agent9-prose.ts` | `[x]` |
| 5.4b | §5.4 | Wire phrase warnings into `provisional_scoring_feedback` block | `agent9-prose.ts` | `[x]` |
| 5.4c | §5.4 | Clear phrase warnings after injection (pending-warnings pattern) | `agent9-prose.ts` | `[x]` |

### Phase 6 — Temporal Context Completeness

| # | Section | Task | File | Status |
|---|---------|------|------|--------|
| 6.0 | §1.6 pre | Ensure `buildTemporalContextBlock()` is extracted (§1.6c) before adding fields | `agent9-prose.ts` | `[x]` |
| 6.1 | §6.1 | Inject `seasonal.daylight` | `agent9-prose.ts` | `[x]` |
| 6.2 | §6.2 | Inject `seasonal.holidays[]` and `seasonal.seasonalActivities[]` | `agent9-prose.ts` | `[x]` |
| 6.3 | §6.3 | Inject `cultural.entertainment.theater[]` and `radio[]` | `agent9-prose.ts` | `[x]` |
| 6.4 | §6.4 | Inject `cultural.literature.*` | `agent9-prose.ts` | `[x]` |
| 6.5 | §6.5 | Inject `cultural.technology.*` | `agent9-prose.ts` | `[x]` |
| 6.6 | §6.6 | Inject `cultural.dailyLife.commonActivities[]` and `socialRituals[]` | `agent9-prose.ts` | `[x]` |
| 6.7 | §6.7 | Inject `socialAttitudes.*` (lowest priority — appended last) | `agent9-prose.ts` | `[x]` |

### Cross-cutting / Infrastructure

| # | Section | Task | File | Status |
|---|---------|------|------|--------|
| X.1 | Cross-cutting | Create `constants/arc-position.ts` with `ARC_POS_TO_SCENE_TYPE` and `ARC_POSITION_REGISTER` | `constants/arc-position.ts` (new) | `[x]` |
| X.2 | Cross-cutting | Register `texture_pool` block (medium, 600 tokens) in `applyPromptBudgeting()` | `agent9-prose.ts` | `[x]` |
| X.3 | Cross-cutting | Update `updateNSD()` final signature — accept `cluesRevealedIds`, `arcPosition` | `types/narrative-state.ts` | `[x]` |
| X.4 | Cross-cutting | Update all `updateNSD()` call sites to pass new parameters | `agent9-prose.ts`, `agent9-run.ts` | `[x]` |

---

### Completion summary

```
Phase 1:   8 / 8   tasks complete
Phase 2:   7 / 7   tasks complete
Phase 3:   7 / 8   tasks complete
Phase 4:   7 / 7   tasks complete
Phase 5:   6 / 6   tasks complete
Phase 6:   8 / 8   tasks complete
Cross-cut: 4 / 4   tasks complete
─────────────────────────────────
Total:     47 / 48 tasks complete
```




