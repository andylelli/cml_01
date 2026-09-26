# 03 — Agent 9 prompt construction

**Scope:** 11 files, 5,697 lines, 4,094 code lines (`agent9-prose/{prompt-builder, obligation-block, prompt-blocks, injection-templates, opening-ideation, opening-freshness, banned-phrases, narrative-balance}.ts`, `prose-brief.ts`, `story-bible.ts`, `story-contract.ts`) · **Read:** every line · **Written:** 2026-09-25
**Finding prefix:** A9P · **Method:** [RUBRIC.md](../RUBRIC.md)

**Evidence sources used in this report (all MEASURED unless marked):**
- **Real prompts:** 32 captured Agent 9 requests from two runs (`mystery-1785175520689`, 2026-07-27, 17 prompts; `run_20260731-1416`, 15 prompts), recovered from git history at `a42f87c6` (`documentation/prompts/actual/*/NN_Agent9-ProseGenerator-Ch*_request.md`, since deleted from HEAD). The code paths cited from them are unchanged since (`buildStoryToDateBlock` last changed `c476e92c`, 2026-05-21; the outcome-block concatenations and the block caps date from May/June).
- **Current-code prompts:** `buildProsePrompt` run from the built dist over the four frozen real-artifact bundles in `eval/golden/bundle-*.json` × 10 chapters = **40 prompts**, plus a synthetic 10-chapter fixture. Pure functions, no LLM. Scripts in the reviewer scratchpad (`a9p/*.mjs`).

---

## 1. What this area does

```
generate.ts (per batch, per attempt)
  └─ buildProsePrompt(inputs, batchScenes, chapterStart, chapterSummaries, priorChapters)   prompt-builder.ts:1565
       1. derive facts inline: cast, victim, detective/POV, active names, arc position, season, stage mode   1572-1676, 2073-2101
       2. render ~29 context blocks  → buildPromptContextBlocks (key, priority, stability)                  1246
            builders in prompt-builder.ts (world brief, first-appearance, NSD, clue desc, locked facts …),
            prompt-blocks.ts (pronoun, contracts, personality, location, temporal, setting, background, fair play, judged-on),
            context-management.ts, discriminating.ts, phrase-analysis.ts, story-geometry
       3. build three NON-block regions:
            system preamble (literal, 1693-1726) · developer (literal schema + guardrails + prose requirements,
            patched twice by string .replace(), + mode contract + outcome contract + gates, 2133-2243) ·
            user (obligation block + outcome block + timeline + STORY TO DATE + completeness + case summary
            + pronoun lock + outline JSON, 2318) · checklist (third message, 2409-2490)
       4. applyPromptBudgeting(baseSystem, developer, user, blocks, 24,000)                                 1398
            per-block char truncation → priority drop (optional→medium→high) → system = preamble + blocks
            + "PROMPT BUDGET SUMMARY …" + developer
       5. return { messages[3], sectionSizes (pre-budget, blocks only), atom ids, system/developer/user }
  └─ buildChapterObligationBlock(14 positional params)                                                      obligation-block.ts:37
Frozen-fact modules: story-contract.ts (built once in the worker), story-bible.ts (built only on the regen path).
Unwired: opening-ideation.ts, prose-brief.ts.
```

Data in: `ProseGenerationInputs` (CML `caseData: any`, outline, CastDesign, four upstream artifacts typed `any`, locked facts, clue distribution, narrative state, story contract, geometry). Data out: three chat messages plus fingerprints.

## 2. Verdict

The code works and is heavily commented, but the prompt is not built from a model — it is accreted. There is no block interface: block metadata lives in four places keyed by bare strings, and **about half of what the model reads is outside the block model entirely**, unmeasured and unbudgeted — including the single largest and fastest-growing item, the full text of every prior chapter (`STORY TO DATE`: 652 → 72,611 chars ch1→ch10, 59% of the ch10 prompt, ≈99% of the growth in "fixed" tokens that drives every budget drop). The complexity comes from **re-derivation**: the prompt layer recomputes victim, culprit, detective, suspects, arc position, season, pronouns and death method from raw artifacts 3–9 times each with divergent predicates, while the StoryContract and Story Bible that ADR-0005 says it dereferences are built and not read (the contract's victim is computed from `cml.CAST`, which does not exist — `fallback_unknown` in 62/62 archived artifacts). The same facts are then rendered 2–10 times per prompt; one block is concatenated twice verbatim; stale per-block caps truncate three blocks mid-word in **40/40 current and 32/32 real prompts**, cutting pronoun rules 9–11 and the temporal block's season-lock rules. **The single most valuable change** is a `PromptFacts` object computed once per chapter from one frozen source, rendered through a single block registry that covers every region of the prompt — the prerequisite for every other item here, provable byte-identical with a golden-prompt snapshot over `eval/golden`.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A9P-01 | P1 | C, A | Bible facts re-derived 3–9× each in the prompt layer (ADR-0005); frozen objects built but unread | R1 → R2 | L (3 d) | −300 |
| A9P-02 | P1 | A, I | No block interface: metadata in 4 places; ~50% of the prompt outside the block model | R1 | M–L (2 d) | −60 |
| A9P-03 | P1 | I | STORY TO DATE is not a block: 59% of the ch10 prompt, ≈99% of "fixed" growth, uncapped | R1 model / R2 cap | M | +40 |
| A9P-04 | P1 | I, F | Stale caps + mid-word truncation: 3 blocks truncated in 40/40 and 32/32 prompts | R1 / R2 | S–M | +20 |
| A9P-05 | P1 | B | `buildChapterObligationBlock`: 14 params, 974 LOC, 557-line callback cc 137 | R1 | L (2 d) | −150 |
| A9P-06 | P1 | B, G | `buildProsePrompt`: 943-LOC coordinator; unasserted `.replace()` splices | R1 | L (2–3 d) | −200 |
| A9P-07 | P2 | I | CHAPTER OUTCOME CONTRACT concatenated twice (system + user) in every prompt | R2 | S | −1 |
| A9P-08 | P2 | C, I | 14 facts rendered 2–10× per prompt; four pairs disagree | R2 | M | −150 |
| A9P-09 | P2 | C, A | Prompt-as-code: ~29k chars of literals; humour/craft guides are a second body of `notes/*.md` | R0 / R2 | M | ±0 |
| A9P-10 | P2 | F, I | Budget telemetry printed into the model's prompt; never reaches the report | R1 + R2 | S | +15 |
| A9P-11 | P2 | C, E | Stage-mode knowledge in 5 tables across 3 files, typed `string` | R1 | S–M | −60 |
| A9P-12 | P2 | I | R8 prefix cache defeated by budget drops of run-stable blocks | R2 | M | ±0 |
| A9P-13 | P2 | E | Missing input types: `CmlCase`, `ProseScene`, unified `CastMember`; four artifacts `any` | R0 | M | ±0 |
| A9P-14 | P3 | D, G | 13 flags, 4 parse idioms, 8 read inline mid-function | R0/R1 | S | −10 |
| A9P-15 | P3 | D | Unwired/write-only: `opening-ideation.ts`, `prose-brief.ts`, 3 StoryContract fields, 4 Bible fields | R0 (owner) | S | −400 if deleted |
| A9P-16 | P3 | D | Dead computation and orphaned docblocks | R0 | S | −80 |

---

### A9P-01 — The prompt layer re-derives every Bible fact; the frozen objects are built and not read
- **P1 · lens C/A · R1 (extract) → R2 (collapse divergent bodies) · L (3 days)**
- **Evidence (MEASURED / INFERRED):**

  | Fact | Bodies (predicate differences) |
  |---|---|
  | Victim | `buildContextSummary` prompt-builder.ts:416 (role or archetype, CastDesign→CML fallback); `resolveVictimName` :438 (3 passes); `buildFirstAppearanceContractsBlock` :505 (`resolveVictimName ‖ culpability.victim`); `buildChapterOutcomeBlock` :734 (`culpability.victim ?? victimCandidates[0] ?? /victim/i`); `buildProsePrompt` :1609 **and** :1679 (same call twice); system cast list :1696 and consistency rules :1733 (`isVictimArchetype(c.role ?? c.roleArchetype)`, no snake case, no culpability); obligation-block.ts:76, :98, :958 (`isVictimArchetype(c.role_archetype ?? c.role)` over CML cast); `resolveVictimContract` story-contract.ts:79 (a verbatim second body of `resolveVictimName`) |
  | Culprit | obligation-block.ts:82, :146, :169, :390, :663, :681, :716, :894/:909, :953 — nine derivations with two different filters |
  | Detective | prompt-builder.ts:1589 (POV), obligation-block.ts:103 and again :427 inside the loop (identical predicate) |
  | Suspects | prompt-builder.ts:658 and :1943 (no narrator exclusion) vs obligation-block.ts:121 (excludes narrator) vs :682 |
  | Arc position | prompt-builder.ts:204 (`chapterIndex`, `totalChapters`) and :1613 (`ci`, `outline.totalScenes ?? scenes.length`); story-bible.ts:207 (even spacing — different result: ch3/10 is `early` in the prompt, `first_turn` in the Bible); worker agent9-run.ts:4603 (1-based, feeds `previousChapterArcPosition` consumed by obligation-block.ts:822) |
  | Season | world_document from the LLM-authored `historicalMoment.specificDate` by substring month search (prompt-builder.ts:235) vs `deriveTemporalSeasonLock(temporalContext)` everywhere else (:2092, prompt-blocks.ts:475) |
  | Death method | `resolveDeathMethod` prompt-builder.ts:481 (canonical wound phrase) vs obligation-block.ts:763 **and** :916 (raw `subtype ‖ category`, e.g. "murder"); comment at :915 blames an import cycle a leaf module removes |
  | Pronouns | from `cmlCase.cast` (obligation-block.ts:994), from CastDesign (prompt-builder.ts:2308, :2443, prompt-blocks.ts:25, :271, :338), from `narrativeState.characterPronouns` (:1082, world brief :290) |

  Meanwhile `precompileStoryContract` is called once (agent9-run.ts:4490) with `castData: cml.CAST` — not a CML 2.0 key (`schema/cml_2_0.schema.yaml` top level; `CaseData = any` lets it compile) — so `victim` is `fallback_unknown` in **62/62** archived report/result JSON files at `a42f87c6`, and `culpritAlibiWindows` is always `{}`. `storyContract.victim` has no reader except that warning line. `buildStoryBible` runs only on the flag-gated regen path (generate.ts:2726); no prompt builder imports it, and its `clock`, `placement`, `voices`, `discriminatingTest` fields have no reader anywhere.
- **Proposal:** `agent9-prose/prompt-facts.ts` — `derivePromptFacts(inputs): PromptFacts` (run-level, computed once in `generateProse`) and `deriveChapterContext(facts, scenes, chapterStart): ChapterContext`. **Step 1 (R1):** move every existing derivation into it *unchanged*, keeping divergent bodies as honestly named separate fields (`victimForSystemCast`, `victimForGuardrail`, …) so bytes do not move; all builders read facts. **Step 2 (R2, one flag or owner decision per fact):** collapse each divergent pair onto one body. Make `PromptFacts` a projection of the Story Bible (ADR-0005 explicitly allows per-chapter projections); fix `castData` to `castDesign` and delete `resolveVictimContract`.
- **Benefit:** ~40 derivation sites → 1 module (~150 LOC); ~300 lines removed from builders; eliminates the defect class ADR-0005 names ("one concept, three bodies"). Makes A9P-05/06 mechanical.
- **Verification:** golden-prompt snapshot (§7) byte-identical after step 1; each step-2 collapse shows its diff on the 40 golden prompts before the owner decides.
- **Relates to:** A9P-05, A9P-06, A9P-08; area agent9-run (`cml.CAST`, arc position at 4603, `{...worldState, beatSheet: []}` ×13).

### A9P-02 — There is no block interface, and half the prompt is not a block
- **P1 · lens A/I · R1 · M–L (2 days)**
- **Evidence (MEASURED):** block metadata is split across `PromptSectionInputs` (prompt-blocks.ts:73), the `orderedSections` array with priority/stability (prompt-builder.ts:1247), `perBlockTokenCap` *inside* `applyPromptBudgeting` (:1408), and `CRAFT_INPUT_BLOCKS` (:1351) — all keyed by bare strings, so a typo silently removes a cap. Outside the model entirely: system preamble (~6k chars), developer (7–10.5k), user (obligation ~9k, outcome, timeline, story-to-date, completeness, case summary, pronoun header, outline JSON), checklist (~2k), asset self-report and every retry turn. On the synthetic fixture the blocks are 31–37k of 59–70k chars; in the ch10 real prompt the shipped blocks are ~16.5k of 123k. `sectionSizes` (:2493) is measured **before** budgeting and over blocks only, so REVIEW_14 §4's "48.4% reference / 12.6% craft" is a share of pre-budget block sizes, not of what the model receives.
- **Proposal:** `agent9-prose/blocks/registry.ts`:
  ```ts
  interface PromptBlockSpec { key: BlockKey; placement: 'system'|'developer'|'user'|'checklist';
    priority: 'critical'|'high'|'medium'|'optional'; stability: 'run'|'chapter'|'attempt'|'pinned_last';
    group: 'reference'|'compliance'|'character'|'craft'|'feedback'|'structure';
    capTokens?: number; criticalCapTokens?: number; craftInput?: boolean;
    render(facts: PromptFacts, ch: ChapterContext, flags: PromptFlags): string }
  export const AGENT9_BLOCKS: readonly PromptBlockSpec[]   // array order = today's emission order
  ```
  `BlockKey` is a union; the developer and user regions become `critical`, uncapped blocks with `placement` set, so they are byte-identical but measured. `renderBlocks → orderForCaching → applyBudget → assembleMessages` replaces the ad-hoc assembly; telemetry (`sectionSizes`, budget stats) comes from the same objects for every placement.
- **Benefit:** one table instead of four; every character of the prompt attributable to a named block; budget can see what actually grows (A9P-03).
- **Verification:** golden snapshot byte-identical; a registry test asserts every `BlockKey` has exactly one spec.
- **Relates to:** A9P-03, A9P-04, A9P-10, A9P-12.

### A9P-03 — STORY TO DATE: the largest, fastest-growing content is invisible to the budget
- **P1 · lens I · R1 to model as a block, R2 to cap · M**
- **Evidence (MEASURED, 2 real runs):** `buildStoryToDateBlock` (context-management.ts:249) emits the full text of every prior chapter, uncapped, into the user message (prompt-builder.ts:1795, :2318). Run 07-31: 652 → 7,778 → 14,462 → … → 72,611 chars (ch1→ch10); "fixed" tokens 7,891 → 26,006, exceeding the 24,000 ceiling at ch9–10. Growth of fixed = +18,115 tokens; growth of story-to-date = +71,959 chars ≈ +17,990 tokens — **≈99%**. Run 07-27 is the same shape (642 → 70,483; fixed 7,952 → 25,446). The budget responds by dropping 11 blocks by ch7 — including `continuity_context`, the compact prior-chapter summary that exists to *replace* the dump — while the dump is kept. A_73 §31 attributes the futility to growing critical blocks; the measurement says it is this. Every retry re-sends it (REVIEW_12: retries are 37% of prose prompt volume).
- **Proposal:** register `story_to_date` (placement `user`, stability `chapter`, priority `critical`, cap ∞) — R1, bytes identical, now measured. Then (R2, owner) a policy: last N chapters verbatim, earlier chapters as `continuity_context` summaries, capped. Note for REVIEW_14 §11.2: raising the ceiling to 40,000 moves the cliff rather than removing it — the dump grows ~7.2k chars per committed chapter.
- **Benefit:** at ch10 up to ~15k tokens per call and per retry; stops the craft/reference drops at their cause.
- **Verification:** R1 by snapshot; R2 by the ADR-0004 probe regime (flag + matched pairs), watching continuity defects.
- **Relates to:** A9P-02, A9P-12; X47; REVIEW_12; REVIEW_14 §4, §11.2.

### A9P-04 — Stale caps truncate three blocks mid-word in every prompt
- **P1 · lens I/F · R1 (move caps into registry, measure) / R2 (change caps or cut rules at boundaries) · S–M**
- **Evidence (MEASURED):** `truncated=[location_profiles, temporal_context, pronoun_accuracy]` (plus `first_appearance_contracts` in most chapters) in **40/40** current golden prompts and **32/32** real prompts. `truncateToTokenBudget` (prompt-builder.ts:1390) cuts at a character count.
  - `pronoun_accuracy` (cap 700 tokens, :1409) is 3,029 chars for a 1-person cast, 3,390 for six: truncated for **every cast size**; the cut lands mid-word in rule 9 ("refers to the S") and removes rule 10 — both added with the cap in `c476e92c` (2026-05-21), so rule 10 has never reached the model.
  - `temporal_context` (cap 850, comment "fits a full temporal profile") is 6.3–6.8k chars on the four golden bundles; truncation removes 2.9–3.4k chars including USAGE REQUIREMENTS, **rule 8 "Season lock (hard)" and rule 9 "SEASONAL LANGUAGE — EXCLUSIVE ALLOW-LIST"** in 4/4 bundles.
  - `location_profiles` (cap 1000) loses 0.9–1.1k chars.
  Three independent truncation mechanisms coexist with no shared policy: builder-internal slices (`slice(0,8)`, 260-char tails), per-block character caps, and priority drops.
- **Proposal:** caps move into the registry with a test asserting each block's measured size on the golden fixtures against its cap; truncation at line/rule boundaries. Resizing caps or reordering rule text is R2 — owner call, but the current state is a defect (§9), not a policy.
- **Benefit:** restores rules the prompt believes it sends; ends silent tail loss as a class.
- **Verification:** golden fixtures report block size vs cap; any cap change probed per ADR-0004.
- **Relates to:** A9P-02, A9P-10; §9 items 1–2.

### A9P-05 — Decompose `buildChapterObligationBlock`
- **P1 · lens B · R1 · L (2 days)**
- **Evidence (MEASURED):** obligation-block.ts:37 — 974 LOC, cc 82, depth 6, **14 positional parameters**; the `forEach` callback at :262 is 557 LOC, cc 137. Closure state shared with the callback: **19 derived values** (`proseRequirements`, `dtScene`, `DT_SIGNAL_RE`, `dtResolutionScenes`, `dtHasExactMatch`, `clearanceScenes`, `victimNameForIdentity`, `detectiveFirstName`, `clueMap`, `deliveryMethodMap`, `INTERROGATION_VERBS_RE`, `recentlyInterrogatedSuspects`, `culpritNameSet`, `culpritAlibiLock`, `timelineSpine`, `isRevealClue`, `clueStageForRun`, `continuityTailExcerpt`, the mutable `lines`) plus 9 parameters. The callback emits **27 ordered sections**; seven batch-level trailers follow. Duplications inside: detective (:103/:427), revelation ref (:341/:352), culprit/victim sets rebuilt per section, `mannerOfDeath` twice, the reveal and clearance signal regexes also inlined in prompt-builder.ts:1811, :1934.
- **Proposal:** `obligation/context.ts` `resolveObligationContext(facts, ch)` (the 19 values, most of which move to `PromptFacts` per A9P-01); `obligation/classify.ts` `classifyChapter(scene, ctx): ChapterRole` (`isDT`, `isReveal`, `isPostReveal`, `isPreReveal`, `isFalseSolution`, `isInterrogation`, `matchingClearances`); `obligation/sections.ts` — an ordered array of 27 pure renderers `(ctx, role, chapterNo) => string[]` (`renderClueObligations`, `renderClearances`, `renderDiscriminatingTest`, `renderRevealChapter`, `renderWalkedDeduction`, …), and `obligation/trailers.ts`. Signature becomes `buildChapterObligationBlock(ctx: ObligationContext, scenes: ProseScene[])`.
- **Benefit:** 974-LOC function → ~40-LOC coordinator; no function above cc ~12; each rule independently testable; 14 params → 2 typed.
- **Verification:** golden snapshot plus the existing 10 direct calls in `agent9-prose.test.ts`, `obligation-aftermath-item11`, `obligation-planted-mystery-a64`.
- **Relates to:** A9P-01, A9P-11, A9P-13.

### A9P-06 — Turn `buildProsePrompt` into a coordinator; remove the self-patching template
- **P1 · lens B/G · R1 · L (2–3 days)**
- **Evidence (MEASURED/INFERRED):** prompt-builder.ts:1565, 943 LOC, cc 94, ~9 phases (fact derivation 1572–1676; system literal 1678–1726; twelve block builds 1728–1998 including an inline word-form clock parser 1824–1866 that duplicates story-validation's `parseClockTime`; guardrails/flags 2000–2071; targets/stage mode/obligation 2073–2131; developer 2133–2243; user 2245–2318; geometry/blocks/budget 2320–2407; checklist 2409–2490). ~20 closure values would form a `ChapterContext`. The developer literal is edited after construction by **two unasserted `String.replace` calls on its own anchor text** (:2139, :2161) — the exact failure mode REVIEW_14 §12.2 recorded (a substitution "applied without an assertion, and silently no-opped"); `developer` without the audit patch is never used. Eight flags are read inline mid-function (A9P-14). The returned `system/developer/user` fields are test-only, and `system` is not what is sent (no blocks, no amateur warning).
- **Proposal:** `buildProsePrompt = assemble(budget(renderBlocks(AGENT9_BLOCKS, facts, deriveChapterContext(...), resolvePromptFlags(env))))` plus `buildChecklist(ctx)`; fold the two `.replace` splices into the literal's composition (byte-identical) or assert the anchor; move the clock parser to a named helper beside `parseClockTime` (merging them is R2).
- **Benefit:** 943 → ~80 LOC coordinator; cc 94 → ≤15; closure state becomes explicit.
- **Verification:** golden snapshot; `agent9-prose.test.ts` (29 calls).
- **Relates to:** A9P-01, A9P-02, A9P-09, A9P-14.

### A9P-07 — The CHAPTER OUTCOME CONTRACT is sent twice
- **P2 · lens I · R2 · S**
- **Evidence (MEASURED):** `chapterOutcomeBlock` is appended to the developer (prompt-builder.ts:2164, which ends up in the system message) and interpolated into the user message (:2318). Present twice in **32/32 real** and **40/40 golden** prompts; 449–2,702 chars per call (the final-reveal version is largest), on every retry, and counted in `fixed` so it accelerates block drops. Both concatenations arrived in one commit (`07621f8f`, message "commit") with no rationale. Its forbidden-reveals line also duplicates the ACTIVE CHAPTER MODE CONTRACT — the same list three times per prompt.
- **Proposal:** keep one copy (owner picks position; recency argues for user). Prompt change → flag or owner decision.
- **Benefit:** ~110–675 tokens per call and retry; one fewer drift pair.
- **Verification:** snapshot diff shows exactly one removed region.
- **Relates to:** A9P-08, A9P-11.

### A9P-08 — Fourteen facts are rendered 2–10 times per prompt, and four pairs disagree
- **P2 · lens C/I · R2 · M**
- **Evidence (MEASURED on fixtures/real prompts; INFERRED where noted):** pronouns in 5 sections plus inline tags (54–80 "she/her|he/him" occurrences per prompt, 6-person casts) from three sources (A9P-01); season lock 6 renderings from 2 derivations; each locked value 4×; victim "DECEASED" 3×; era forbidden terms 2× from two vocabularies (prompt-builder.ts:1761 knows only the 1950s; obligation-block.ts:212 a table for 1860s–1950s); sensory variant computed twice by duplicated code (prompt-builder.ts:1652–1676 ≡ prompt-blocks.ts:403–435) and rendered twice. **Disagreeing pairs:**
  1. **Voice fragments** — `characterBundle.voiceFragments` is copied from `worldDocument.characterVoiceSketches` (mystery-orchestrator.ts:567–576), rendered with X43's anti-verbatim guard in `character_contracts` (prompt-blocks.ts:218) and **unguarded** as `[register] text` in `world_document` (prompt-builder.ts:309–312). Up to 12/21 fragments appear twice in golden prompts. X43's "the ONE voice input with no guard" is still true of its twin.
  2. **DT/clearance obligations** — `buildProseRequirements` (:842) broadcasts the DT scene, every clearance scene and the revelation scene, with a "entire generation will be rejected" threat, to **40/40** prompts; the obligation block's ITEM 11 exclusivity gives the DT contract to 6/40. It also prints placeholder clue ids (`clue_id_1`) that obligation-block.ts:645 filters (seen in the 07-31 real prompt).
  3. **Opening rules** — 6–8 statements disagree: open on setting and sensory grounding before plot (location rule 7, prompt-blocks.ts:401; developer "SCENE-SETTING", :2133) vs never open on a location/"character action first" (obligation-block.ts:411) vs in medias res, no weather preamble (:1689) vs "atmosphere (one sentence max) → body" (obligation-block.ts:441).
  4. **Death method** — "stab wound" (outcome contract) vs raw subtype (obligation block), A9P-01.
- **Proposal:** each fact gets one owning block in the registry; other blocks reference it ("see PRONOUN TABLE") or drop it. Every change is a prompt change — probe per ADR-0004, largest first (voice fragments, prose requirements broadcast, openings).
- **Benefit:** est. 3–6k chars per prompt; removes live contradictions.
- **Verification:** snapshot diffs per consolidation; flags + probes.
- **Relates to:** A9P-01, A9P-07; REVIEW_14 §6 step 2 (the contract audit) — this is its duplication map.

### A9P-09 — Prompt-as-code, and a guide that lives in two places
- **P2 · lens C/A · R0 (verbatim move) / R2 (resolve the two bodies) · M**
- **Evidence (MEASURED):** long literals: 18,323 chars in prompt-builder.ts, 7,622 in prompt-blocks.ts, 2,925 in obligation-block.ts (`data/metrics.md`). The humour and craft guide blocks (:1961–1995) are hand-condensed copies of `notes/DEFINITIVE_GUIDE_TO_HUMOUR.md` (6,588 B) and `notes/WHAT_MAKES_A_GOOD_WHODUNNIT.md` (3,285 B). The worker reads both files (agent9-run.ts:3348, called at :4552 and :5578) and passes their contents in, and the prompt builder uses them **only as booleans**. Editing the notes changes nothing; deleting either file silently removes its block from every prompt.
- **Proposal:** `agent9-prose/prompt-text/{system-preamble,developer-schema,humour-guide,craft-guide,physical-plausibility,pronoun-rules,obligation-text,…}.ts` exporting constants and small template functions; builders keep assembly only. `writingGuides` becomes `{ humour: boolean; craft: boolean }` (R1) until the owner chooses which guide body is canonical (R2).
- **Benefit:** prompt text reviewable and diffable apart from logic; ~29k chars out of the logic files.
- **Verification:** golden snapshot is the byte-equality proof for R0.
- **Relates to:** A9P-06.

### A9P-10 — Budget telemetry goes to the model, not to the report
- **P2 · lens F/I (ADR-0010) · R1 (add) + R2 (remove the line) · S**
- **Evidence (MEASURED):** `applyPromptBudgeting` appends `PROMPT BUDGET SUMMARY: budget=…; dropped=[…]; truncated=[…]` (178–450 chars) into the system message (:1553) of every call; `buildProsePrompt` discards the returned `droppedBlocks/truncatedBlocks` (:2387). Only the X47 test parses the line; no script does. `prompt_fingerprints.section_sizes` is pre-budget, so no report records what was dropped.
- **Proposal:** return a `BudgetOutcome` and stamp it on `promptFingerprints` (R1); then remove the line from the prompt (R2).
- **Benefit:** the report can answer "what did chapter 8 actually see"; ~50–110 tokens per call.
- **Relates to:** A9P-02, A9P-04.

### A9P-11 — Stage-mode knowledge is spread over five tables
- **P2 · lens C/E · R1 · S–M**
- **Evidence (INFERRED):** `defaultStageModeProfiles` (narrative-balance.ts:44) plus YAML overrides; `modeOutcomeByMode` and `requiredInfoByMode` (prompt-builder.ts:678, :689); `buildModeSpecificChecklistItems` (:761); `STAGE_MODE_EMBARGO_TIER` (obligation-block.ts:188). All key on `StageModeKey` but are typed `Record<string, …>`, and the mode is passed as `activeMode as any` (:700).
- **Proposal:** `STAGE_MODE_SPECS: Record<StageModeKey, { embargoTier, requiredOutcomes, forbiddenReveals, mustChangeByEnd, requiredNewInfo, checklist }>` in narrative-balance.ts; YAML override stays.
- **Benefit:** one table; the compiler catches a missing mode.
- **Relates to:** A9P-05, A9P-07.

### A9P-12 — The R8 prefix cache is only as stable as the budget's drop set
- **P2 · lens I · R2 · M**
- **Evidence (MEASURED on the real runs, flag OFF there):** stability tags in `buildPromptContextBlocks` are correct, but run-stable blocks were dropped at ch3 (`humour_guide`), ch6 (`physical_plausibility`, `era_authenticity`, `temporal_context`) and ch7 (`craft_guide`). With `AGENT9_PROMPT_PREFIX_ORDER` on, each change rewrites the run prefix: three invalidations per book, driven by A9P-03's growth. With the flag off the cached prefix ends at block 2.
- **Proposal:** decide `run`-block membership once per run (or drop `chapter` blocks before any `run` block) — R2; cap story-to-date (A9P-03) removes most of the pressure.
- **Relates to:** A9P-03; FLAG-AUDIT `AGENT9_PROMPT_PREFIX_ORDER` (DEFER).

### A9P-13 — Missing input types behind 265 `any`
- **P2 · lens E · R0 · M**
- **Evidence (MEASURED):** `any` 140 (prompt-builder), 94 (obligation-block), 31 (prompt-blocks). Most are lambda parameters over CML arrays, because `CaseData = any` (packages/cml/src/index.ts:105); then dual reads of CastDesign vs CML cast (`caseEntry ?? designEntry`, `role_archetype ?? role ?? roleArchetype`: 22 casts in `buildFirstAppearanceContractsBlock` alone); then `scenes: unknown[]` cast to `any[]` although `Scene` exists (agent7-narrative.ts:116) — the builder reads worker-stamped fields (`mechanismRevealAllowed`, `suspectClearanceAllowed`, `cluesPlanted`) not on it. `ProseGenerationInputs` types four artifacts `any` although `CharacterProfilesResult`, `LocationProfilesResult`, `TemporalContextResult`, `WorldDocumentResult` exist.
- **Proposal:** `CmlCase` (start from clue-spec's `CmlCaseForClues` and story-validation's `CMLData`); `ProseScene = Scene & WorkerSceneStamps`; `CastMember` normalised once in `PromptFacts`; real types on the four inputs. The `cml.CAST` defect (A9P-01) is the argument for doing this.
- **Verification:** `tsc --noEmit`; no runtime change.

### A9P-14 — Flags: four parse idioms, read mid-function
- **P3 · lens D/G · R0 (hoist) / R2 (unify parse) · S**
- **Evidence (MEASURED):** 13 flags in scope (§6) parsed as `=== 'true' || === '1'` (:1225, :1785, obligation-block.ts:759), `/^(1|true|yes|on)$/i` (:1235, :1244, :1334, :1337, :2037, :2048, :2168, :2227, opening-ideation.ts:39), YAML `!== false` (obligation-block.ts:233), numeric floor (:2384). `AGENT9_REVEAL_CITES_PLANTS` is read inside the per-scene loop. `AGENT9_BIBLE_AUTHORITATIVE` defaults OFF while production runs ON (FLAG-AUDIT: PROMOTE).
- **Proposal:** `resolvePromptFlags(env): PromptFlags` once per call, keeping each flag's current parse exactly (unifying `yes/on` acceptance is R2).

### A9P-15 — Unwired and write-only code (ADR-0011 classification)
- **P3 · lens D · R0 with owner sign-off · S**
- **Evidence (MEASURED, repo-wide incl. scripts, tests, dynamic imports, package root):**
  - **`opening-ideation.ts`** (225 lines, commit `48f97123`, 2026-08-25): zero importers; not in the barrel; `package.json` has no `exports`, and no deep import exists; `openingIdeationEnabled` never called; `RECENT_OPENING_SITUATIONS` ships empty. `AGENT9_OPENING_IDEATION` is registered in FLAG-AUDIT (:468, deferred) and ROADMAP-FROM-82 §4b plans the wiring. This is the shape `flag-register-check.mjs` says it cannot detect ("read by a function with zero call sites"). **Classification:** not deletable on the compiler's word (it has a registered flag and a roadmap item); staged. Owner decides 4b; if abandoned, delete and remove the FLAG-AUDIT row.
  - **`prose-brief.ts`** (177 lines, June 2026 "offline foundation"): exported from the package root (index.ts:80), used only by its own test. Staged; same decision.
  - **StoryContract:** `victim` (only logged, and wrong), `sensoryAtoms` (built from `locationProfiles`, an object, as if it were an array — always `{}`; no reader), `lockedFacts` (no reader). **Bible:** `clock`, `placement`, `voices`, `discriminatingTest` no readers; `runBibleGates` test-only (the worker calls both gates directly).
- **Benefit:** up to ~400 lines if the owner closes the staged items.

### A9P-16 — Dead computation and orphaned comments
- **P3 · lens D · R0 · S**
- **Evidence (MEASURED):** `castCompositionRule` (prompt-blocks.ts:47–52) computed and never interpolated — "Rule 11" has not been emitted since `c476e92c`. Orphaned docblocks attached to nothing or the wrong function: prompt-builder.ts:936–947, 984–987, 1175–1195 (a "revert Phase 1" recipe naming functions that moved), 1322–1329, 1559–1563; prompt-blocks.ts:146–150, 346–359. Unused exports (`data/export-usage.md`): `buildWorldBriefBlock`, `buildNSDBlock`, `buildClueDescriptionBlock`, `buildContextSummary`, `buildRevealGroundworkCues`, `REVEAL_GROUNDWORK_BANNED_TERMS`, `truncateToTokenBudget` — un-export when split. Mojibake in comments (obligation-block.ts:3, agent9-prose/index.ts:3).

---

## 4. Target structure

```
agent9-prose/
  prompt-facts.ts            derivePromptFacts / deriveChapterContext (projection of the Bible)   ~200
  prompt-flags.ts            resolvePromptFlags                                                    ~60
  blocks/
    registry.ts              PromptBlockSpec, BlockKey, AGENT9_BLOCKS (order, priority, caps)      ~180
    render.ts / budget.ts / assemble.ts   renderBlocks, applyBudget → BudgetOutcome, messages     ~250
    world-brief.ts, first-appearance.ts, nsd.ts, locked-facts.ts, clue-descriptions.ts,
    outcome.ts, prose-requirements.ts, story-to-date.ts, checklist.ts …  (one builder each)       ~900
  obligation/ context.ts, classify.ts, sections.ts (27 renderers), trailers.ts                    ~650
  prompt-text/               verbatim literals as constants/templates                             ~900
  prompt-blocks.ts           existing builders, typed (shrinks as they move into blocks/)         ~450
  prompt-builder.ts          buildProsePrompt coordinator + re-exports                            ~120
  narrative-balance.ts       + STAGE_MODE_SPECS                                                    ~260
```
Scope files ~5,700 → ~4,900 lines (literals are moved, not removed), no function above ~80 LOC or cc ~15.

## 5. Suggested sequence

1. **Golden-prompt snapshot** over `eval/golden` × chapters × flag matrix (§7). Nothing else starts before this.
2. A9P-16, A9P-14 hoist, A9P-13 types (R0).
3. A9P-09 literal move (R0; snapshot proves bytes).
4. A9P-02 registry + A9P-10 telemetry + A9P-03 story-to-date as a block (R1, bytes unchanged, now measured).
5. A9P-01 step 1 `PromptFacts` (R1).
6. A9P-05 and A9P-06 decompositions (R1), A9P-11.
7. Owner decisions (R2, each flag-gated/probed): A9P-04 caps, A9P-07, A9P-03 cap policy, A9P-08 consolidations, A9P-01 step 2, A9P-12, A9P-15.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `AGENT9_PROMPT_PREFIX_ORDER` | off | prompt-builder.ts:1225 | DEFER (R8) | Clean bucket concat; defeated by drops (A9P-12) |
| `AGENT9_RUBRIC_IN_PROMPT` | off | :1235 | PROBED — HOLD | Empty block when off; clean |
| `AGENT9_GEOMETRY_CONTRACT` | off | :1244 | DEFER | Four blocks, try/catch degrade (ADR-0003, fine) |
| `AGENT9_CRITICAL_BLOCK_CAPS` | off | :1334 | Deferred, own run | Spreads caps into the cap map; belongs in registry |
| `AGENT9_PROMPT_BUDGET_CRAFT_FLOOR` | off in code, **true** in `.env.local` | :1337 | SETTLED 2026-08-19 | Code default contradicts production |
| `AGENT9_BIBLE_AUTHORITATIVE` | off in code, ON in prod | :1785 | PROMOTE | Different parse idiom |
| `AGENT9_OPENING_STYLE_PER_STORY` | off | :2037 | PROBE NEXT RUN | Inline read |
| `AGENT9_SENSORY_PALETTE_ROTATION` | off | :2048 | PROBE NEXT RUN | Inline read |
| `AGENT7_SCHEDULER_AUTHORITATIVE` | off | :2168 | Not audited (backlog) | Agent 7 flag read by Agent 9 |
| `AGENT9_OPENING_FRESHNESS` | off | :2227 | PROBE NEXT RUN | Passes `[object Object]` (§9 item 5) |
| `AGENT9_PROMPT_TOKEN_CEILING` | 24000 | :2384 | CONFIG | Floor 8000 |
| `AGENT9_REVEAL_CITES_PLANTS` | off | obligation-block.ts:759 | DEFER (R6) | Read per scene inside loop |
| `AGENT9_OPENING_IDEATION` | off | opening-ideation.ts:39 | Deferred (corpus) | Getter never called (A9P-15) |
| YAML `tiered_phrase_contract_enabled` / `blue_sky_mode_enabled` / `stage_modes` | true / false / — | obligation-block.ts:230, prompt-builder.ts:2001, narrative-balance.ts:130 | n/a (config) | Read in two places each |

## 7. Safety net

- **Tests today:** prompt-builder — 5 direct (`atomic-locked-fact-a57`, `discriminating-contradiction-a57`, `m6-rubric-in-prompt`, `prompt-budget-craft-floor-x47`, `prompt-prefix-order`) plus `agent9-prose.test.ts` via the barrel (29 `buildProsePrompt` calls, 7 obligation-block calls); obligation-block 2 direct; prompt-blocks 2; opening-freshness, injection-templates, banned-phrases, prose-brief 1 each; story-bible 8. **None:** story-contract.ts (including the `castData` defect), narrative-balance.ts, opening-ideation.ts. **No byte-level snapshot of any Agent 9 prompt exists**; fixtures are tiny (a 3-person cast, 1-scene outline) — the "fixtures tidier than production" trap REVIEW_14 §10.2 describes.
- **Replay harness:** `REPLAY_DRY=1` exits before any prompt is built, and replay stubs `characterBundle` — not usable as a prompt net as is. A `REPLAY_PROMPTS_ONLY` mode writing per-chapter prompt sha256 would make it one.
- **Characterisation test to write first — `agent9-prompt-golden.test.ts`:** for each `eval/golden/bundle-*.json` (real artifacts) × every chapter × {all flags off; each prompt flag on alone; budget binding (ceiling 8000) and not}, call `buildProsePrompt` with deterministic narrative state and synthetic prior chapters, serialise `messages`, `sectionSizes`, atom ids and budget outcome, and compare with committed golden files (`toMatchFileSnapshot`), generated from the current code before any refactor. Add a guard asserting every block key is non-empty in at least one fixture. Any diff means the change is R2 — stop.

## 8. What NOT to refactor

- `pronoun_accuracy` stays **last** (`pinned_last`, A_66 recency fix) — do not let a stability sort move it.
- Array order within a priority is the drop order; any reorder changes which block dies under budget (prefix-order comment, :1307). The registry must preserve it.
- `surfaceSpecKeyTerms` everywhere clue text reaches the prompt (R-A leakage cure) — do not "simplify" to the full description.
- The order-neutral contradiction wording (:1899–1904, A_58) and the observation-only / inference-embargo split (A_65) are measured fixes.
- The geometry try/catch (:2339) is ADR-0003 degradation, not sloppiness.
- `injection-templates.ts` is correct as designed (one registry, laundered forms included); only its callers matter.
- Lens H: `buildProsePrompt` costs **1.2 ms** per call (MEASURED, 200 iterations) against LLM calls of tens of seconds; `getGenerationParams` is cached. No compute work is worth doing here.

## 9. Incidental defects

1. **Pronoun rules 9–11 never reach the model** — block truncated for every cast size, cut mid-word in rule 9; rule 10 lost since it was added; rule 11 (`castCompositionRule`) never interpolated. MEASURED (40/40, 32/32). High confidence.
2. **temporal_context season-lock rules 8–9 cut** in 4/4 golden bundles (2.9–3.4k chars lost); `location_profiles` and usually `first_appearance_contracts` also truncated. MEASURED. High.
3. **`precompileStoryContract({ castData: cml.CAST })`** (agent9-run.ts:4491): no such key; victim `fallback_unknown` in 62/62 archived JSON; `culpritAlibiWindows` always `{}` → Bible `placement` always empty; a misleading warning in every report. `sensoryAtoms` is built from an object as if it were an array. MEASURED/INFERRED. High.
4. **Voice fragments unguarded in `world_document`** while guarded in `character_contracts` (X43 half-applied). MEASURED. High.
5. **Opening freshness exempts `[object Object]`**: `String(CASE.hidden_model.mechanism)` (prompt-builder.ts:2239), but `mechanism` is an object (schema :157), so device words are never exempted. Flag-gated off. High.
6. **Placeholder clue ids** (`clue_id_1`) shown by `buildProseRequirements`; the obligation block filters them. MEASURED in the 07-31 prompt. Medium.
7. **Manner of death** from raw `subtype ‖ category` (obligation-block.ts:916) can print "murder" or a setting label as the "manner of death". INFERRED. Medium-low.
8. **Arc position off by one** between worker (agent9-run.ts:4603, 1-based) and prompt builder (0-based), so `previousChapterArcPosition` and `currentArcPosition` are on different scales in the tonal-contrast rule (obligation-block.ts:822). INFERRED. Medium.
9. **Case-specific hard bans** (`banned-phrases.ts:11`: "quarter past three" families, `getTieredBannedPhrasePolicy` ignores its case argument) go into every prompt and could collide with a locked value of the same time. INFERRED. Low.
10. **Deleting `notes/*.md` silently removes** humour_guide/craft_guide from every prompt (A9P-09). INFERRED. High, latent.
11. Literal backslashes (`\"`) in pronoun rule 9–10 examples (prompt-blocks.ts:62); moot while truncated. Low.

## 10. Cross-area observations

- **Frozen objects built but not dereferenced.** StoryContract and Story Bible exist; consumers re-derive. Expect the same in agent9-run (`{...worldState, beatSheet: []}` ×13, `buildStoryBible` imported and unused) and in the validators.
- **`CaseData = any`** hides shape bugs repo-wide (`cml.CAST`); any agent reading CML is exposed to it.
- **Snake/camel cast duality** (`role_archetype ?? role ?? roleArchetype`) recurs everywhere — one normalised `CastMember` at the boundary would remove a family of casts.
- **Arc position has four bodies across three packages/apps**; stage mode five tables.
- **Unasserted string surgery** on generated text (`.replace(anchor, …)`) is the X64 failure mode; grep other agents for it.
- **Telemetry written into prompts or logs rather than the report** (ADR-0010) — check other agents' prompt budgets and summaries.
- **Pre-budget measurement taken as the prompt's composition** — REVIEW_14 §4 should be re-based on delivered prompts.
- **Built-but-unwired modules with registered flags** (opening-ideation) — `flag-register-check` cannot see them; a "getter has a call site" check would.

## 11. Open questions for the owner

1. STORY TO DATE policy: how many chapters verbatim, and are the rest summarised (A9P-03)? It decides whether the 24,000 ceiling, the craft floor and R8 still matter.
2. Which copy of the outcome contract stays — system or user (A9P-07)?
3. Pronoun block: raise its cap or shorten the rules? Temporal block: move the season rules to the top or raise the cap (A9P-04)?
4. Canonical guide text: `notes/*.md` or the in-code condensations (A9P-09)?
5. ROADMAP-FROM-82 §4b and the prose-brief redesign: keep staged, or delete (A9P-15)?
6. For each divergent fact pair (A9P-01 step 2): which body wins — e.g. the Bible's evenly spaced arc positions or the prompt's thresholds?
7. Should `buildProseRequirements` keep broadcasting every obligation to every chapter, given the obligation block's exclusivity design (A9P-08 item 2)?
