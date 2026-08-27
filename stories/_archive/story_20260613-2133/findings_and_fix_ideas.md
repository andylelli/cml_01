# Final Fix Plan

**Story:** `story_20260613-2133`  
**Run:** `run_52999c10-8f10-4a61-8310-338bb73257b2`  
**Purpose:** Final implementation plan for the six accepted fixes.

---

## Implementation Order

1. Character lifecycle ledger and identity gate.
2. Narrative anti-leakage detector.
3. Reader-trust scoring caps.
4. Failure-class retry subcodes and stage-mode guard.
5. Fallback minimum floor and expansion pass.
6. Clue trace, anchor parity, and report normalization.

---

## Fix 1: Character Lifecycle Ledger and Identity Gate

**Goal**

Prevent impossible cast state transitions, especially a victim appearing later as an alive suspect, dialogue participant, or confessing culprit.

**Code areas**

- `packages/story-validation/src/character-lifecycle-validator.ts`
- `packages/story-validation/src/narrative-continuity-validator.ts`
- `packages/story-validation/src/pipeline.ts`
- `packages/story-validation/src/types.ts`
- `packages/prompts-llm/src/agent9-prose/generate.ts`
- `apps/worker/src/jobs/agents/agent9-run.ts`

**Final design**

Add a shared lifecycle validator that builds a ledger from CML, outline, and prose evidence.

```ts
export type CharacterLifecycleStatus =
  | "alive"
  | "deceased"
  | "victim"
  | "active_dialogue"
  | "active_suspect"
  | "cleared"
  | "culprit"
  | "confesses";

export type LifecycleEvidenceStrength = "hard" | "medium" | "heuristic";

export interface CharacterLifecycleEvent {
  characterName: string;
  status: CharacterLifecycleStatus;
  chapterNumber: number;
  evidence: string;
  source: "cml" | "outline" | "prose";
  strength: LifecycleEvidenceStrength;
}
```

Hard invalid states:

- Victim/deceased character later appears in active dialogue.
- Victim/deceased character later confesses.
- Victim/deceased character is assigned as culprit.
- Cleared character is later assigned as culprit, unless explicitly marked as false clearance.

**Implementation notes**

- Add the validator early in `StoryValidationPipeline`, immediately after `CharacterConsistencyValidator`.
- Critical lifecycle failures should short-circuit validation.
- Replace or wrap Agent 9's current `detectVictimAlive()` with the shared lifecycle helper.
- Run a pre-prose CML/outline audit before Agent 9 generation begins.
- Use exact normalized cast names as the primary matching key; surname-only matches should be advisory unless surnames are unique.

**Acceptance checks**

- Ch1 marks Felix as corpse, Ch2 has Felix speak: fail with `victim_reappears_alive`.
- CML marks Felix as both victim and culprit: fail with `victim_culprit_conflict`.
- Non-victim suspect appears in dialogue: pass.

---

## Fix 2: Narrative Anti-Leakage Detector

**Goal**

Block prompt, validator, retry, and scaffold language from final prose.

**Code areas**

- `packages/story-validation/src/control-plane-leakage.ts`
- `packages/story-validation/src/chapter-validator.ts`
- `packages/prompts-llm/src/agent9-prose/lint.ts`
- `packages/prompts-llm/src/agent9-prose/sanitization.ts`
- `packages/prompts-llm/src/agent9-prose/banned-phrases.ts`

**Final design**

Create one shared leakage detector used by chapter validation, Agent 9 linting, fallback commit checks, release gates, and scoring caps.

```ts
export type LeakageConfidence = "hard" | "contextual" | "watch";

export interface LeakagePattern {
  code: string;
  pattern: RegExp;
  confidence: LeakageConfidence;
  severity: "critical" | "major" | "moderate";
}
```

Hard failures:

- `validator`
- `retry`
- `fallback`
- `stage mode`
- schema-like labels such as `Setting:`, `Scene:`, `Mood:`, `Chapter progress:`

Contextual failures:

- `contract`
- `obligation`
- `required`
- `must include`
- `ensure that`

**Implementation notes**

- Ordinary chapters should fail and retry when hard leakage is detected.
- Final fallback salvage may use a narrow cleanup pass, but must re-run deterministic leakage detection afterward.
- Return structured findings with excerpts and offsets so retry packets can quote the offending sentence.

**Acceptance checks**

- Text containing `validator` fails as critical.
- Text containing `stage mode` fails as critical.
- Legal/narrative use of `contract` is not automatically critical; it is contextual and reviewed by surrounding phrase shape.

---

## Fix 3: Reader-Trust Scoring Caps

**Goal**

Make internal scoring reflect reader-fatal failures. A structurally broken mystery should not receive an A-grade prose score.

**Code areas**

- `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`
- `packages/story-validation/src/scoring/types.ts`
- `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts`
- `apps/worker/src/jobs/agents/agent9-run.ts`

**Final design**

Pass trust signals into the Agent 9 scorer. The scorer applies caps after calculating the normal weighted score.

```ts
export interface ProseTrustSignal {
  code: string;
  severity: "critical" | "major" | "moderate";
  cap?: number;
  source: "validation" | "release_gate" | "fallback";
}

export interface ReaderTrustDiagnostics {
  uncapped_total: number;
  capped_total: number;
  applied_caps: Array<{
    code: string;
    cap: number;
    reason: string;
  }>;
}
```

Final caps:

- `identity_continuity_collapse`: cap at 60.
- `control_plane_leakage`: cap at 75.
- `multiple_fallback_short_chapters`: cap at 80.
- `missing_discriminating_test_execution`: cap at 85.

**Implementation notes**

- The scorer should consume validation/release/fallback signals rather than re-running its own separate detectors.
- Preserve `uncapped_total` in `breakdown.reader_trust`.
- If a cap causes the score to fall below pass threshold, `passed` must become false.
- Do not add `warning` to `RunOutcome` as part of this fix; warning state should remain in diagnostics and release-gate warning counts unless a repo-wide type migration is planned.

**Acceptance checks**

- `victim_reappears_alive` caps Agent 9 total at 60.
- Two fallback chapters under floor cap Agent 9 total at 80.
- Clean prose has no trust caps and preserves current scoring.

---

## Fix 4: Failure-Class Retry Subcodes and Stage-Mode Guard

**Goal**

Stop repeated same-class retry loops, especially suspect-pressure chapters resolving the culprit too early.

**Code areas**

- `packages/prompts-llm/src/retry-protocol.ts`
- `packages/prompts-llm/src/agent9-prose/generate.ts`
- `packages/prompts-llm/src/agent9-prose/obligation-block.ts`
- `packages/prompts-llm/src/agent9-prose/clue-validation.ts`

**Final design**

Extend the existing retry taxonomy with subcodes rather than creating a parallel Agent 9 taxonomy.

```ts
export interface RetryPacket {
  attempt: number;
  failureClass: RetryFailureClass;
  failureSubcode?: string;
  offendingText?: string;
  failedGates: string[];
  mustFix: string[];
  warningsToClear: string[];
  maxRetries: number;
  shouldEscalate: boolean;
}
```

Add shared stage-mode rules consumed by both prompt obligations and validation.

```ts
export interface StageModeRule {
  mode: "suspect_pressure" | "test_setup" | "test_execution" | "resolution";
  forbiddenPatterns: RegExp[];
  promptRules: string[];
  retryRules: string[];
}
```

For `suspect_pressure`, fail affirmative premature resolution:

- confession
- arrest
- final accusation
- definitive culprit declaration
- case-closed language

**Implementation notes**

- Fix current retry classification so stage-mode outcome failures do not map to generic completeness.
- Add `failureSubcode: "stage_mode_outcome"` for premature resolution.
- Include exact offending text in retry packets.
- Add a negation/hypothetical guard so phrases like "there was still no confession" do not hard-fail.
- Keep prompt wording and validator terms identical.

**Acceptance checks**

- `Felix confessed` in a suspect-pressure chapter fails with `stage_mode_outcome`.
- `There was still no confession` does not fail as premature resolution.
- Retry packet includes the offending phrase and the no-resolution rule.

---

## Fix 5: Fallback Minimum Floor and Expansion Pass

**Goal**

Prevent retry-exhaustion fallback from committing skeletal 300-450 word chapters.

**Code areas**

- `packages/prompts-llm/src/agent9-prose/generate.ts`
- `packages/prompts-llm/src/agent9-prose/repair.ts`
- `packages/prompts-llm/src/agent9-prose/types.ts`
- `packages/story-validation/src/story-length-targets.ts`

**Final design**

Replace the current completion fallback with a bounded fallback pipeline:

1. Build deterministic scene beat skeleton.
2. Expand once through fallback-specific expansion.
3. Validate against floor, leakage, stage-mode, and clue obligations.
4. Allow at most one additional expansion attempt.
5. If still invalid, hard-stop or release-fail instead of silently committing a stub.

```ts
export interface FallbackChapterTelemetry {
  chapterNumber: number;
  reason: "retry_exhaustion" | "generation_exception";
  sourceFailureClass?: string;
  initialWords: number;
  finalWords: number;
  expansionAttempts: number;
  committed: boolean;
}
```

Floor policy:

- Use story-length config as the base.
- For short/medium modes, floor should be at least 850 words unless explicitly overridden.
- Long mode may require a higher configured floor.

**Fallback commit gates**

- Word count meets fallback floor.
- At least five paragraphs.
- At least one dialogue exchange or direct witness statement.
- Required clue obligations present.
- No hard leakage terms.
- Stage-mode rules pass.

**Acceptance checks**

- Forced fallback below floor is rejected.
- Fallback containing `chapter advances` or `scene objective` is rejected.
- Valid fallback commits with degraded-success telemetry.

---

## Fix 6: Clue Trace, Anchor Parity, and Report Normalization

**Goal**

Make clue ID drift visible, guarantee NSD anchor parity, and prevent report surfaces from disagreeing about run outcome.

**Code areas**

- `packages/prompts-llm/src/agent9-prose/clue-validation.ts`
- `packages/prompts-llm/src/agent5-clues.ts`
- `apps/worker/src/jobs/agents/agent5-run.ts`
- `apps/worker/src/jobs/agents/agent9-run.ts`
- `apps/worker/src/jobs/scoring-logger.ts`
- `packages/story-validation/src/scoring/report-invariants.ts`
- `packages/story-validation/src/report-repository.ts`
- `packages/story-validation/src/scoring/aggregator.ts`

**Final design**

Split implementation into two subfeatures.

**Subfeature A: clue namespace and anchor quality**

```ts
export interface ClueNamespaceAudit {
  canonicalIds: string[];
  referencedIds: string[];
  missingIds: string[];
  nonCanonicalIds: string[];
  safeRemaps: Array<{ from: string; to: string; reason: string }>;
  status: "pass" | "repaired" | "fail";
}

export type EvidenceAnchorQuality = "explicit" | "hinted" | "synthetic";

export interface EvidenceAnchor {
  clue_id: string;
  chapter_number: number;
  evidence_quote: string;
  evidence_offset?: {
    chapter: number;
    paragraph: number;
    sentence: number;
  };
  confidence: number;
  quality: EvidenceAnchorQuality;
}
```

Rules:

- Validate clue IDs before Agent 5 commit and before Agent 9 starts.
- Safe remaps are allowed only when deterministic and logged.
- Every NSD `newly_revealed_clue_id` must have an anchor.
- Synthetic anchors count for parity but are reported as degraded trace quality.

**Subfeature B: report normalization**

Keep existing canonical run outcome type:

- `run_outcome`: `passed | failed | aborted | infra_failure`
- `release_gate_outcome.status`: `passed | failed | unknown`
- warning state remains in `warning_count` and diagnostics

Add normalized diagnostic status for UI/report consumers:

```ts
export interface NormalizedRunStatusDiagnostic {
  display_status: "passed" | "warning" | "failed" | "aborted" | "infra_failure";
  discrepancies: string[];
  warning_count: number;
  hard_stop_count: number;
}
```

**Implementation notes**

- Add `quality: "synthetic"` to `buildSyntheticNsdClueAnchor()`.
- Update report invariants so synthetic anchors satisfy parity.
- Add a separate warning/diagnostic for high synthetic-anchor ratio.
- Normalize report status in the scoring aggregator or orchestrator before save; repository invariants remain the final guard.

**Acceptance checks**

- NSD revealed clue without extracted evidence gets a synthetic anchor with `quality: "synthetic"`.
- Passed reports no longer fail persistence if synthetic anchors exist.
- Report with release warnings surfaces `display_status: "warning"` without changing `run_outcome` type.
- Release-gate failed report cannot persist as `run_outcome: "passed"`.
