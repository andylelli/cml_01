# ANALYSIS 15 — World-First Scene Enrichment: Bug Review and Fixes

**Date:** 2026-03-28  
**Status:** Complete — all bugs fixed and committed  
**Commit:** `eb47801`  
**Scope:** Review of the three ANALYSIS_13 implementation changes:
1. `applyWorldFirstSceneEnrichment()` in `agent7-run.ts`
2. `worldDocument` pass-through in `agent9-run.ts`
3. World brief block in `agent9-prose.ts`

---

## 1. What Was Reviewed

ANALYSIS_13 implemented the World-First architecture across two files in a prior session. This analysis reviews those changes for correctness, type safety, and consistency now that the code is in its final form.

Files reviewed:
- `apps/worker/src/jobs/agents/agent7-run.ts` — enrichment functions
- `apps/worker/src/jobs/agents/agent9-run.ts` — worldDocument pass-through
- `packages/prompts-llm/src/agent9-prose.ts` — `buildWorldBriefBlock()`
- `packages/prompts-llm/src/types/world-document.ts` — type definitions
- `apps/worker/src/jobs/agents/agent65-run.ts` — World Builder runner
- `schema/world_document.schema.yaml` — schema for WorldDocumentResult
- `schema/narrative_outline.schema.yaml` — schema for scene fields

---

## 2. Findings Ranked by Severity

### Bug 1 — CRITICAL: `locationRegisterNote` Always Blank

**File:** `apps/worker/src/jobs/agents/agent7-run.ts`  
**Function:** `applyWorldFirstSceneEnrichment()`

**Root cause:**
```typescript
// WRONG — scene.locationId does not exist in the narrative outline schema
const locationId: string = (scene as any).locationId ?? '';
const locReg = (world.locationRegisters ?? []).find(
  (l: any) =>
    locationId   // always '' because locationId is never set
      ? l.locationId === locationId || ...
      : false,   // guard is always false
);
(scene as any).locationRegisterNote = locReg
  ? `${locReg.emotionalRegister} — ${locReg.cameraAngle}`
  : '';          // always ''
```

**What the schema actually provides:**  
The narrative outline schema stores location as `scene.setting.location` (a name string), not `scene.locationId`. Because `locationId` is always `undefined → ''`, the lookup guard `locationId ? ... : false` permanently evaluates to `false`, so every scene receives an empty `locationRegisterNote`.

**Impact:** `locationRegisterNote` — the field that tells Agent 9 the emotional stance and camera angle for a scene's location — was silently zeroed out for 100% of scenes. Agent 9 received no location-register context from the World Document despite the field being present in the scene schema.

**Fix applied:**
```typescript
// CORRECT — read from scene.setting.location with locationId as optional override
const locationName: string =
  (scene as any).locationId ??       // forward-compatible if added later
  (scene as any).setting?.location ?? // where the schema actually stores it
  '';
const locReg = (world.locationRegisters ?? []).find(
  (l: any) =>
    locationName
      ? l.locationId === locationName ||
        l.name?.toLowerCase() === locationName.toLowerCase()
      : false,
);
(scene as any).locationRegisterNote = locReg
  ? `${locReg.emotionalRegister} — ${locReg.cameraAngle}`
  : '';
```

---

### Bug 2 — MEDIUM: Misleading Type Comment on `WorldDocumentArcTurningPoint.position`

**File:** `packages/prompts-llm/src/types/world-document.ts`

**Root cause:**
```typescript
export interface WorldDocumentArcTurningPoint {
  /** Decimal string e.g. "0.30" — maps to arc positions */
  position: string;
```

The comment says the field holds a decimal like `"0.30"`. It does not. The schema defines `position` as an enum:
```yaml
allowed: [opening, early, first_turn, mid, second_turn, pre_climax, climax, resolution]
```

Both `toArcPosition()` in Agent 7 and `buildWorldBriefBlock()` in Agent 9 already correctly treat `position` as one of these enum strings when doing `.find(t => t.position === arcPos)`. The type itself was correct; the comment was wrong.

**Impact:** Anyone reading the type comment to understand how to call the World Builder prompt or interpret its output would believe `position` is a numeric string like `"0.30"` and produce broken JSON. The World Builder LLM could also be confused if the comment leaked into its system prompt.

**Fix applied:**
```typescript
export interface WorldDocumentArcTurningPoint {
  /** Arc position enum — one of: opening | early | first_turn | mid | second_turn | pre_climax | climax | resolution */
  position: string;
```

---

### Inconsistency 3 — MEDIUM: Arc Position Cutoffs Diverged Between Agent 7 and Agent 9

**Files:** `apps/worker/src/jobs/agents/agent7-run.ts` vs `packages/prompts-llm/src/agent9-prose.ts`

Both agents map a normalised story position (0.0–1.0) to an arc label to look up the `emotionalDescription` from `WorldDocumentResult.storyEmotionalArc.turningPoints`. They used different thresholds:

| Arc Label | `toArcPosition()` (Agent 7) | `buildWorldBriefBlock()` (Agent 9) |
|-----------|----------------------------|-------------------------------------|
| `opening` | `< 0.12` | `chapterIndex <= 1` (≈ `<= 0.08`) |
| `first_turn` | `< 0.38` | `<= 0.40` |
| `second_turn` | `< 0.68` | `<= 0.70` |
| `pre_climax` | `< 0.82` | `<= 0.80` |
| `climax` | `< 0.93` | everything else before last |
| `resolution` | `>= 0.93` | `chapterIndex === totalChapters - 1` |

**Impact:** A scene at, say, position 0.39 would be tagged `first_turn` by Agent 7 (scene enrichment) but `mid` by Agent 9 (prose prompt). The scene's `emotionalRegister` field (set by Agent 7) and the World Brief block injected into the prose prompt (built by Agent 9) would describe different emotional moments from the World Document for the same scene, creating a subtle contradiction in the prose instructions.

**Fix applied:** `toArcPosition()` updated to match `buildWorldBriefBlock()` thresholds exactly:

```typescript
function toArcPosition(pos: number): string {
  // Thresholds aligned with buildWorldBriefBlock in agent9-prose.ts
  if (pos <= 0.08) return 'opening';
  if (pos <= 0.25) return 'early';
  if (pos <= 0.40) return 'first_turn';
  if (pos <= 0.55) return 'mid';
  if (pos <= 0.70) return 'second_turn';
  if (pos <= 0.80) return 'pre_climax';
  if (pos < 1.00)  return 'climax';
  return 'resolution';
}
```

---

### Design Issue 4 — LOW: `eraTextureNote` Identical on Every Scene (Not Fixed)

**File:** `apps/worker/src/jobs/agents/agent7-run.ts`

```typescript
const physicalConstraints: string[] =
  world.historicalMoment?.physicalConstraints ?? [];
(scene as any).eraTextureNote = physicalConstraints.join('; ');
```

The schema describes `eraTextureNote` as: "one sentence… felt **in this scene**." The code joins all physical constraints into one long string and assigns the same string to every scene. This is technically functional — Agent 9 receives valid era texture guidance — but it:
- May include 3–5 constraints per scene as a run-on string not resembling a single sentence
- Is identical for every scene, so the field provides no per-scene variation

**Decision:** Left as-is. Fixing this properly requires selecting the most relevant constraint per scene based on its setting or purpose, which requires more context than is available deterministically. Logged here for future tuning.

---

## 3. Code That Was Correct

The following items from ANALYSIS_13 were reviewed and found to have no bugs:

| Component | Status |
|-----------|--------|
| `agent9-run.ts` — both `generateProse()` calls include `worldDocument: ctx.worldDocument` | Correct |
| `agent7-run.ts` — `applyWorldFirstSceneEnrichment` called only when `ctx.worldDocument` is truthy | Correct |
| `agent7-run.ts` — warning logged with correct scene count from `narrative.acts?.flatMap(...)` | Correct |
| `toSceneType()` — act/scene-in-act mapping to `humourPlacementMap` scenePosition values all match the schema enum | Correct |
| `dominantCharacterNote` — character name match is case-insensitive substring, handles name variations | Correct |
| `humourGuidance` fallback — `{ permission: 'permitted' }` when no humour entry found is a safe default | Correct |
| `agent65-run.ts` — both scoring and non-scoring paths write `ctx.worldDocument` | Correct |
| `buildWorldBriefBlock()` — all six world document sections conditionally rendered; `breakMoment` only shown near the right story position | Correct |
| `world-document.ts` — all interface fields match the schema YAML structure | Correct (type-level) |

---

## 4. Commit Details

```
eb47801  fix: 3 bugs in ANALYSIS_13 World-First scene enrichment

Files changed:
  apps/worker/src/jobs/agents/agent7-run.ts
  packages/prompts-llm/src/types/world-document.ts
```

---

## 5. Remaining Risk

With Bug 1 fixed, `locationRegisterNote` will now be populated when:
1. `scene.setting.location` is a string that matches a `locationRegisters[].name` (case-insensitive) or `locationRegisters[].locationId` exactly

It will remain blank if:
- The World Builder uses a different name/casing for a location than the narrative outline does
- A scene has no `setting.location` set (schema marks it `required: true`, so this should not occur)

The name-matching approach is best-effort. A more robust implementation would use CML location IDs as a primary key consistently across all agents. This is a follow-on improvement rather than a blocking bug.
