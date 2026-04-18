# Prose Generation — High-Level Design (HLD)

**Based on:** `documentation/10_prose_generation/10_prose_generation.md`  
**LLD:** `documentation/plan/prose-generation-LLD.md`  
**Status of this document:** High-level phased plan. Low-level task breakdown in the LLD.

---

## Context

`documentation/10_prose_generation/10_prose_generation.md` defines the target prose generation architecture:
the Asset Library, per-chapter context scoping, atom-level deployment tracking, story
rhythm controls, and the quality feedback loop. The current implementation delivers the
scaffolding (world document injection, obligation contract, NSD block, clue descriptions)
but none of the Asset Library, scoping, timing, or diagnostic structures.

The plan is organised into five phases of increasing architectural ambition. Each phase
delivers independently verifiable improvements to prose quality or system correctness.
No phase is a refactor-for-its-own-sake — each one closes a concrete gap identified in
the §9 implementation status table or the Appendix A audit.

---

## Phase 1 — Correctness Fixes and Missing Injections

**Theme:** Close the gaps that require no new infrastructure — bugs, missing wires,
and small injections that are fully specified in §09 but simply not implemented.

**Why first:** These are the smallest effort items with the highest immediate quality
return. They also unblock Phase 2 by eliminating confounding factors before the more
complex work begins.

**Scope:**

1. **Fix the `humourPlacementMap` enum mismatch** (§3.3).  
   `scenePosition` uses story-phase labels (`opening_scene`, `first_investigation`, …);
   `arcPosForHumour` uses turning-point labels (`opening`, `early`, `first_turn`, …).
   The `find()` call therefore returns `undefined` for ~75% of chapters, silently dropping
   humour guidance. The fix is a mapping table or enum normalisation. This is a correctness
   bug affecting every story.

2. **Wire `victimConfirmedDeadChapter` setter in the orchestrator** (§6.3, §9 table).  
   The NSD block already injects this value when it is present. The orchestrator never
   sets it. The setter call exists in the design; it just needs to be wired.

3. **Sync `cluesRevealedToReader` into `liveNarrativeState`** (§4.2).  
   The orchestrator updates its own `narrativeState` copy but `generateProse()` works
   from `liveNarrativeState`, which is never synchronised. The NSD block's
   "DO NOT REVEAL AGAIN" guard therefore never fires.

4. **Inject `storyEmotionalArc.arcDescription`** (§5.4, §9 table).  
   `buildWorldBriefBlock()` reads `arcDescription` from the world document field but
   does not inject it. One line of code; doc-specified.

5. **Inject `atmosphere.eraMarkers` in location profiles** (§1.3, §9 table).  
   Available in `locationProfiles`; currently dropped. Add to the location profiles
   block after the sensory palette section.

6. **Filter character portraits and voice sketches to scene-active characters only** (§2.1, §9 table).  
   Currently every character's portrait and voice sketch is injected every chapter.
   `scene.characters[]` is already on the scene object. Use it as a filter. Characters
   not appearing in any scene in this batch are excluded from both blocks. This is the
   primary attention-concentration mechanism described in §2.1 and reduces token waste
   on large casts.

**Exit criteria:** All six items pass unit tests; a test story with a non-binary cast
member shows humour guidance injected in early/mid/late chapters; victim state line
appears in NSD after the victim's death chapter.

---

## Phase 2 — Asset Library Foundation

**Theme:** Build the core infrastructure that everything else in §09 depends on:
the `Asset` data structure, the library builder, and `NarrativeState.deployedAssets`.

**Why second:** Phases 3–5 all depend on this. Without it, scoped injection (Phase 3),
timing gates (Phase 4), and self-report tracking (Phase 5) have nowhere to live.

**Scope:**

1. **Define the `Asset` interface** (§2.3).  
   `id`, `source`, `scope`, `scopeKey`, `register`, `content`, `budget`, `used`,
   `priority`. This is the atom unit of the entire post-Phase 1 architecture.

2. **Add `deployedAssets` to `NarrativeState`** (§4.1).  
   `deployedAssets: Record<string, number[]>` — atom ID → chapter numbers deployed.
   Persist alongside existing NSD fields; include in checkpoint save/restore.

3. **Build `buildAssetLibrary()`** (§2.2).  
   Given all pre-prose pipeline outputs, chunk every prose-relevant field into atoms
   according to the rules in §2.2:
   - Character portrait → 4 atoms (first-impression, physical, manner, distinctive detail)
   - `historicalMoment.eraRegister` → 5 atoms (social, economic, emotional weather,
     defining constraint, concrete anchor)
   - `speechMannerisms` → N atoms (one per distinct behaviour)
   - `internalConflict` → up to 3 atoms (core tension, external manifestation, resolution
     condition)
   - `physicalMannerisms`, `privateLonging`, `eraIntersection` → single atom each
   - `revealImplications` → one atom per named earlier moment
   - Voice fragments, sensory arrays, `currentTensions[]` items → one atom each (already
     per-element in their source arrays)  
   Assign `budget` and `priority` per the type-level table in §2.5.

4. **Build `selectChapterAtoms()`** (§3.1).  
   Given a chapter's scene list, query the library for candidate atoms by:
   - `scope` matching active characters + locations from `scene.characters[]` and
     `scene.setting.location`
   - `used.length < budget`
   - Register compatibility for voice fragments (arc position → dominant register)  
   Return two lists: `obligationAtoms` and `textureAtoms`.

5. **Obligation stamping on chapter commit** (§4.2).  
   After a batch clears all validation gates, stamp each obligation atom assigned to
   those chapters: append the chapter number to `deployedAssets[id]`. This is
   deterministic — no LLM introspection required.

**Exit criteria:** A test story shows `deployedAssets` populated after each committed
batch; `buildAssetLibrary()` produces atoms for a 5-character, 3-location story with
`budget` values matching the §2.5 table; re-running with the same inputs produces the
same library (determinism test); an interrupted run resumed from checkpoint shows
`deployedAssets` correctly restored and chapter continuation from the right point (§4.5
retry/resume durability — satisfied entirely by `deployedAssets` NSD persistence; the
Atom Library is always re-derived from inputs, never stored).

---

## Phase 3 — Scoped Context Assembly

**Theme:** Replace the current "inject everything every chapter" approach with the
chapter-scoped, atom-selected approach specified in §§2–3. This is the architectural
shift that eliminates attention dilution and token waste.

**Why third:** Requires the Asset Library from Phase 2. This phase changes what arrives
in the LLM's context window — the most impactful single change for prose quality.

**Scope:**

1. **Replace flat portrait + voice injection with scoped obligation pool** (§§2.4, 3.1).  
   `buildWorldBriefBlock()` currently injects all portraits and all voice sketches.
   Replace with: obligation atoms for characters in this chapter's scenes, drawn from
   the library. First-impression atom on introduction chapter; subsequent atoms on
   scheduled chapters per the §2.5 budget table.

2. **Register-matched voice fragment selection** (§3.3, §9 table).  
   Replace the current `fragments.slice(0, 3)` with the arc-position → dominant register
   → fragment priority order defined in the §3.3 table. This ensures the voice fragment
   offered matches the emotional key of the chapter.

3. **Sensory variant elevation from hint to obligation** (§3.2, §9 table).  
   Promote the sensory variant injection from guidance text to a scene obligation line
   in the obligation contract: "This chapter's opening must draw from these specific
   senses." Record the used variant ID in `NarrativeState` to enforce the non-repetition
   rule on consecutive location visits. Fall back to the §3.2 cascade logic when no
   direct time-of-day/weather match exists.

4. **Texture pool injection** (§§2.4, 5.3).  
   After obligation atoms, inject a clearly labelled optional pool: secondary portrait
   atoms, additional sensory dimensions, era register atoms beyond the current obligation,
   cultural touchstones from `temporalContext`. Label it explicitly: "Draw on these to
   add period texture and character depth as opportunities arise — you are not required
   to use them."

5. **Inject `atmosphere.sensoryPalette.dominant` and `sensoryPalette.secondary[]`** (§3.2, Appendix A.3).  
   These two fields — the primary location's overall dominant palette descriptor and its
   secondary descriptors — are currently dropped entirely (Appendix A status: ❌). Add
   them to the texture pool in the location profiles block, after the per-location
   `sensoryVariants` entry. They are texture-class atoms; inject as a labelled section:
   `Overall palette: {dominant}. Secondary: {list}` under the primary location heading.

6. **Inject `keyLocations[n].accessControl`** (§3.2, Appendix A.3).  
   Currently dropped (Appendix A status: ❌). `accessControl` encodes movement constraints
   (e.g. locked rooms, servant-only areas) needed for physical plausibility — the prose
   LLM must know which characters can plausibly be in which locations. Inject as a
   logic annotation per key location in the location profiles block: `Access: {text}`.  
   Classification: `logic` atom; inject unconditionally (not gated by scene-active filter)
   so all movement constraints are always visible.

**Exit criteria:** A 9-character story shows fewer than 4 portrait blocks per chapter
(only active characters); voice fragments match the chapter's arc register; the sensory
variant used is recorded in NSD and the fallback cascade fires when no direct match
exists; `sensoryPalette` dominant/secondary fields appear in the primary location's
texture pool entry; `accessControl` annotations appear for all key locations.

---

## Phase 4 — Story Rhythm and Timing Gates

**Theme:** Implement the time-gated injections that give the story its rhythmic shape:
reveal seeding before the reveal, the break moment approach signal, and tonal contrast
enforcement.

**Why fourth:** These depend on `deployedAssets` (Phase 2) for the break moment budget
and on the scoped assembly (Phase 3) for correct atom injection. They also require
extending `NarrativeState` slightly.

**Scope:**

1. **Two-phase `revealImplications` injection** (§3.4).  
   - **Phase 1 (chapters 3 → 75%):** decompose `revealImplications` into per-moment
     atoms. Rewrite each as a forward-facing planting instruction (what to plant, not
     why it matters). Inject as texture atoms; retire after that window closes.
   - **Phase 2 (chapters 75%+):** current behaviour retained (full text, retrospective
     framing). The change is only to Phase 1 — currently the early injection does not
     exist.

2. **Break moment approach signal** (§3.5, §9 table).  
   Between 40% and 60% of story: inject a compressed signal into the texture pool:
   the character is identified by name, the form is not specified, only that pressure
   should be visibly accumulating. This is currently missing entirely.

3. **Break moment full obligation** (§3.5).  
   Between 60% and 85%: the current behaviour (full content injection) is in place.
   No code change needed here — Phase 2 adds the obligation stamping so the atom
   retires at budget 1 after the break occurs.

4. **Tonal contrast enforcement** (§3.6, §9 table).  
   - Add `previousChapterArcPosition` to `NarrativeState` (one field, updated per
     committed batch).
   - At obligation contract construction: if the preceding and current arc positions
     both map to the high-tension register tier, inject the tonal contrast floor
     instruction defined in §3.6.
   - When the `humourPlacementMap` entry for the current position resolves with
     `allowed` or `encouraged`, replace the generic contrast note with the specific
     humour framing (character, permitted forms). This is more precise and ties the
     rhythm mechanism directly to the humour architecture.

**Exit criteria:** Test stories show sanitised plant instructions appearing in early
chapters for each named moment in `revealImplications`; break moment approach signal
appears in ~40–60% chapters; tonal contrast instruction fires on consecutive high-tension
chapters and uses humour framing when available.

---

## Phase 5 — Diagnostics and Quality Feedback Loop

**Theme:** Close the tracking loop — texture atom self-report, budget enforcement,
end-of-run diagnostics, and wiring `detectRecurringPhrases` into scoring and retry.

**Why last:** Requires all prior phases. The self-report is only meaningful once scoped
injection is live; the diagnostic report is only useful once atoms are being deployed
and tracked.

**Scope:**

1. **LLM self-report `<used_assets>` tag** (§4.3, §9 table).  
   Append to each chapter prompt the self-report instruction defined in §4.3.
   Parse the tag from each committed chapter response; strip before storing prose;
   append chapter number to `deployedAssets[id]` for each reported ID. Discard
   self-reports from failed retry attempts.

2. **Budget enforcement for texture atoms** (§4.1).  
   At selection time `selectChapterAtoms()` already filters `used.length < budget`.
   Once self-report data populates `deployedAssets`, this filter has real data.
   Add a secondary check: never inject an atom whose `deployedAssets[id]` length meets
   or exceeds its `budget`, regardless of selection score.

3. **End-of-run asset diagnostic report** (§4.4, §9 table).  
   After the last chapter commits, emit the per-story diagnostic grouping never-deployed
   atoms, overdeployed atoms, and per-type breakdowns. Initially: write to the run log
   alongside the existing quality report. Format to match the §4.4 description.

4. **Wire `detectRecurringPhrases` into scoring and retry** (§8.2, §9 table).  
   `detectRecurringPhrases()` exists and produces a phrase list. Currently it is called
   but the result is not fed into the `provisional_scoring_feedback` block or used as
   a retry trigger. Wire: if repeated phrases are detected at the batch boundary,
   include them in the next batch's `provisional_scoring_feedback`; if a committed
   chapter has recurring phrases above the threshold, flag it in the quality report
   (but do not force a retry — it is a scoring signal, not a gate).

**Exit criteria:** A test story shows `<used_assets>` tags stripped from prose output;
`deployedAssets` shows texture atom entries from self-report; the diagnostic report
generates at end of run; recurring phrases from one batch appear in the next batch's
`provisional_scoring_feedback` block.

---

## Phase 6 — Temporal Context Completeness

**Theme:** Inject the Agent 2d (`temporal_context`) fields that already exist in the
block but are silently dropped. These are all high-priority texture atoms that make
prose feel authentically embedded in its era — the source material for period detail,
seasonal atmosphere, and social attitude. None require new infrastructure; they are
missing injections in the existing `buildTemporalContextBlock()` function.

**Why last:** All missing fields are texture-class. They do not gate correctness or
architecture. Phase 3 should be live first so these new atoms enter the scoped texture
pool rather than the old "inject everything" path.

**Scope:**

1. **Inject `seasonal.daylight`** (§3.1, Appendix A.4b).  
   Single texture field. Append to the existing seasonal section of the temporal context
   block as `Daylight: {text}`.

2. **Inject `seasonal.holidays[]` and `seasonal.seasonalActivities[]`** (§3.1, Appendix A.4b).  
   Both are texture arrays. Inject after `Weather patterns` as:
   `Seasonal activities: {list}` (up to 4 items); `Seasonal occasions: {list}` (up to 3
   items). Omit entirely when arrays are empty.

3. **Inject `cultural.entertainment.theater[]` and `cultural.entertainment.radio[]`** (§3.1, Appendix A.4b).  
   Currently `films[]` and `popularMusic[]` are injected but theater and radio are
   dropped. Append to the existing entertainment line as `; Theatre: {list}` and
   `; Radio: {list}` (up to 2 items each) when present.

4. **Inject `cultural.literature.*`** (§3.1, Appendix A.4b).  
   `recentPublications[]` and `popularGenres[]`. Add a new `Literature: {list}` line
   below the entertainment line (up to 3 items from each sub-array, pipe-separated).

5. **Inject `cultural.technology.*`** (§3.1, Appendix A.4b).  
   `recentInventions[]` and `commonDevices[]`. Add a `Technology: {list}` line (up to
   3 items from each). These are the concrete objects that belong in period prose — what
   characters use, operate, and refer to.

6. **Inject `cultural.dailyLife.commonActivities[]` and `social­Rituals[]`** (§3.1, Appendix A.4b).  
   Add a `Daily life: {activities list}` line and `Social rituals: {rituals list}` line
   (up to 3 items each). Omit when empty.

7. **Inject `socialAttitudes.*`** (§3.1, Appendix A.4b).  
   `class[]`, `gender[]`, `generalNorms[]` — the social operating system of the era.
   These are logic-class atoms: they set the constraints within which characters speak
   and act. Inject as a clearly labelled block `Social attitudes — class: {list} |
   gender: {list} | norms: {list}` (up to 2 items each). Place at the end of the
   temporal context block so it does not disrupt the existing fashion/entertainment
   ordering.

**Token budget note:** The `temporal_context` block has an 850-token cap. Phase 6 items
are additive. Add them in the order listed above so that `applyPromptBudgeting()` drops
from the bottom of the block (lower-priority luxury fields) before dropping higher-value
content. If the cap is hit, `socialAttitudes` is last — the existing entertainment/fashion
content is retained.

**Exit criteria:** A test story's temporal context block contains daylight, seasonal
activities, theater/radio entries, literature, technology, daily life, and social attitude
lines; the block stays within its 850-token cap; none of the existing fashion/weather
fields are displaced.

---

## Summary

| Phase | Theme | Key deliverable | Dependencies |
|---|---|---|---|
| 1 | Correctness fixes + missing injections | 6 targeted fixes — no new infra | None |
| 2 | Asset Library foundation | `Asset` type, `buildAssetLibrary()`, `deployedAssets` | Phase 1 |
| 3 | Scoped context assembly | Chapter-scoped injection replaces full-cast injection | Phase 2 |
| 4 | Story rhythm and timing gates | Reveal seeds, break moment signal, tonal contrast | Phases 2–3 |
| 5 | Diagnostics and quality loop | Self-report, end-of-run report, recurring phrase feed | Phases 2–4 |
| 6 | Temporal context completeness | All Agent 2d texture atoms injected | Phase 3 |

Each phase is a shippable increment that improves story quality independently of later
phases. Phases 3 and 4 together represent the full §09 architectural target. Phase 5
closes the measurement loop that allows systematic quality improvement over time. Phase 6
saturates the temporal context block with all the period-texture material the spec
specifies, delivering the full era-immersion capability of Agent 2d.



