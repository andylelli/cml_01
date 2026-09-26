# 04 — Agent 9 validation & lint

**Scope:** `packages/prompts-llm/src/agent9-prose/{clue-validation, lint, sanitization, phrase-analysis, discriminating, full-story-diagnostic, prose-blind-reader, mechanism-detect}.ts` — 8 files, 4,124 lines, 2,945 code lines · **Read:** every line · **Written:** 2026-09-25
**Finding prefix:** A9V · **Method:** [RUBRIC.md](../RUBRIC.md)

Measurements marked MEASURED were run against the built copy (`scratchpad/build`, same source) with small
node scripts that import the compiled modules; no LLM calls. Scripts: `scratchpad/a9v/{classify,probes,overlap,death,bench}.mjs`.

## 1. What this area does

The deterministic judges of Agent 9's per-chapter loop, plus three small flag-gated LLM checks.

| Module | Role | Main entry points (caller) |
|---|---|---|
| `lint.ts` | Template linter over a batch vs committed chapters; text primitives (tokenise, n-grams, Jaccard, entropy, opening sentence); model-bound verdict-closer rules; **season-lock rewriter** (a repair, not a lint) | `lintBatchProse` (generate.ts:3371, 3391), `enforceMonthSeasonLockOnChapterWithTelemetry` (generate.ts:2603, 3016) |
| `clue-validation.ts` | Stage-mode classifier; CML scene-ref resolution; word targets; batch-gate telemetry; clue tokeniser + presence matcher; key-term composers; `RESOLUTION_RE`; chapter obligation validator; inference-chain soft check | `validateChapterPreCommitObligations` (generate.ts evaluateCandidate), `resolveStageModeKey` (prompt-builder.ts:2093, deterministic-repair.ts:841, generate.ts:3814, 4266), `chapterMentionsRequiredClue` (regen-integration, generate) |
| `sanitization.ts` | Output scrub (audit phrasing, internal ids, titled names), prose JSON parse, paragraph-split repair, input cast/scene normalisation | `sanitizeGeneratedChapter` (generate.ts:2717, 3043, 3270), `parseProseResponse` (4 callers) |
| `phrase-analysis.ts` | Beat fingerprints, identity tags, recurring 7-gram detector, clue-field scrub, scoring-feedback prompt block, sensory variants, **Agent 2c** atom compiler | `detectRecurringPhrases`, `compileSensoryAtoms` (agent2c-run.ts:199) |
| `discriminating.ts` | Discriminating-test checklist **prompt block** + CML sanity check | `buildDiscriminatingTestChecklist` (prompt-builder.ts:1817) |
| `mechanism-detect.ts` | "Chapter explains the mechanism" predicate | generate.ts A_55 gate, regen-integration |
| `full-story-diagnostic.ts` | Whole-story read-only LLM diagnostic → anchored findings → guarded per-chapter rewrite | agent9-run (ship layer), `AGENT9_FULLSTORY_DIAGNOSTIC` |
| `prose-blind-reader.ts` | LLM names the culprit from pre-reveal prose (warning) | agent9-run.ts:7036, `ENABLE_PROSE_BLIND_READER` |

Data flow: chapter → season lock → pronoun repair → `sanitizeGeneratedChapter` → deterministic clue patch →
`evaluateCandidate` (ChapterValidator + obligations + echo gate + mechanism gate) → per batch `lintBatchProse`
→ **every issue flattened to its `.message` string** (generate.ts:3429, 3438) → `batchErrors: string[]` →
three regex classifiers re-derive what went wrong (gate telemetry, retry class, retry family).

## 2. Verdict

Local logic is careful and heavily annotated; the complexity is not in any single rule but in two
structural choices. First, **the linter and the obligation validator emit prose, not codes**: the
`ProseLinterIssue.type` is known at the source and discarded at the batch boundary, and 123 regex/prefix
tests downstream re-derive it from message text — measured, they get it wrong for 17 of 42 message templates
(gate telemetry) and classify 8 of 42 as `unknown` (retry routing). Second, **almost every predicate here has a
second body elsewhere** (scorer, rubric, geometry, story-validation, sanitizer) and the pairs have drifted in
measurable ways: the clue matcher (split-brain already documented at agent9-run.ts:3374), the season
detector vs season repairer (the repairer corrupts "broken spring fragment" into "broken autumn fragment"),
the death-method gate vs the grader (the gate is vacuous for 3 of 4 typical method phrases), the audit-leak
lists (the exhaustion "strip" cannot remove what the lint flagged), three "re-staged reveal" detectors, two
opening-style classifiers. The single most valuable change is **one failure vocabulary** (A9V-01): codes at
the emit site, table lookups instead of regex classifiers. It removes a defect class and is the prerequisite
for turning `lintBatchProse` (766 LOC, cc 152) into the rule table it naturally is (A9V-02). Compute cost is
negligible (≈31 ms per lint call).

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A9V-01 | P1 | F/C | Four failure vocabularies; lint/obligation types flattened to strings; 3 regex classifiers disagree (17/42 wrong gate, 8/42 `unknown`, 6/42 no family) | R1 → R2 | L (2–3 d) | ≈ −60 in area; −100s in generate.ts later |
| A9V-02 | P1 | B | `lintBatchProse` is ~21 independent rules in one closure; make it a rule table with ids and per-rule counters | R1 | M (1.5 d) | −100 |
| A9V-03 | P1 | C | Audit/debug-note leak patterns in 4 bodies; the exhaustion pre-accept strip cannot remove what the lint flags (MEASURED) | R1 → R2 | S–M | −40 |
| A9V-04 | P1 | C | Clue presence: gate matcher vs scorer matcher (split brain) + 4 near-clone matchers in one file | R1 → R2 | M | −90 |
| A9V-05 | P1 | C | Season: detector (story-validation) vs repairer (lint.ts) use different "mechanical spring" rules; repairer corrupts evidence names (MEASURED); 3rd/4th bodies dead or duplicated | R0 + R2 | M | −45 |
| A9V-06 | P2 | C | Death-method surface predicate: gate ≠ grader despite the comment; gate vacuous on "with"/"head" (MEASURED) | R2 | S | −10 |
| A9V-07 | P2 | C | "Re-staged reveal" in 3 bodies, "culprit disclosure" in ~8; the generation gate is the loosest | R2 | M | −60 |
| A9V-08 | P2 | C | `mechanism-detect.ts` is a byte-identical copy of the rubric's detector; move to prose-guard | R1 | S | −35 |
| A9V-09 | P2 | C | Two `classifyOpeningStyle` bodies; lint's opening-sentence extractor cuts at "Dr." (MEASURED) | R2 | S | −40 |
| A9V-10 | P2 | C | Clearance *evidence* connectors: 3 private byte-identical copies + a shared export that disagrees with the release gate (MEASURED) | R1 → R2 | S | −10 |
| A9V-11 | P2 | A/B | `validateChapterPreCommitObligations` → stage-mode rule table; split clue-validation.ts (8 responsibilities); derive stage mode once (4 derivation sites) | R1 | M (1 d) | −60 |
| A9V-12 | P2 | I | Name the trigger structurally: 12 of 22 lint messages and the premature-resolution rule quote nothing; one duplicated sentence → 3 issues (MEASURED) | R2 | S–M | −25 |
| A9V-13 | P3 | D | Dead/vestigial: `mapStageModeToCompositionPhase` (dead since 2026-06-15), `conflictingSeasonPatterns`, 9 compiler-flagged unused imports/params, duplicate helpers, ~25 own-file-only exports | R0 | S | −80 |
| A9V-14 | P3 | E | `any` at every CML/outline read though typed `Scene` exists; bare `jsonrepair` at the prose boundary; 3 ad-hoc JSON fallbacks | R0 / R2 | S–M | ±0 |
| A9V-15 | P3 | H | CPU is negligible: 31 ms mean / 50 ms worst per lint call; ≈1.9 s per 60-call run | R1 | S | ±0 |
| A9V-16 | P3 | A | Misplaced code: Agent 2c transform, prompt blocks and LLM stages in a "validation" area; validation error string injected into the prose prompt | R0 / R2 | S | ±0 |

---

### A9V-01 — One failure vocabulary instead of four
- **P1 · lens F/C · R1 (codes + parity) then R2 (routing on codes) · L (2–3 days)**
- **Evidence (MEASURED):**
  - `ProseLinterIssue.type` (types.ts:300, 13 values) is dropped at generate.ts:3429/3438 (`issue => issue.message`). `validateChapterPreCommitObligations` returns `hardFailures: string[]` with no code at all.
  - Three classifiers re-derive the category from text: `inferBatchGatesFromError` (clue-validation.ts:442, 10 gates → persisted as `gate_outcomes`, agent9-run.ts:4726/5399), `classifySingle`/`classifySubcode` (retry-protocol.ts:29/52, 9 classes → `shouldContinueRetry`), `detectRetryIssueFamilies` (generate.ts:512, 8 families → prompt strategy). Count of regex/prefix tests over message text: **92 in generate.ts, 21 in retry-protocol.ts, 10 in `inferBatchGatesFromError` = 123**.
  - Running all three over the 22 lint and 20 obligation message templates (`classify.mjs`):
    - gate attribution wrong/extra for **17/42** — e.g. `control_plane_leakage` and `debug_note_bleed` → `completeness_structure` only; any message containing "verbatim" (cross-chapter echo, back-to-back duplicate, scene-template) → `locked_fact_word_form`; "Gender agreement … pronouns" misses `\bpronoun\b`; the three final-chapter resolution messages never reach `final_reveal_completeness`.
    - retry class `unknown` for **8/42**, including the most common obligation, *"clue evidence … is absent"*, and *"no resolution event detected"*.
    - no retry family for **6/42** (debug note, victim alibi, verdict closer, three final-chapter messages) — the X80 shape the `retry-routing-vocabulary` test believed closed ("54 of 54 route" covered archived messages only).
  - `debug_note_bleed` is overloaded with three meanings (audit leak lint.ts:740, gender collective 768/773, verdict closer 792), so the exhaustion bypass at generate.ts:3507 accepts gender and verdict-closer failures as if they were debug notes.
  - Bypasses key off message prefixes (generate.ts:3446, 3478–3480, 3552); the opener bypass's own comment calls the design "scoped by MESSAGE STRING".
- **Proposal:** new `contracts/prose-failure-codes.ts`: `type ProseFailureCode` (≈45 codes, one per rule/message template, e.g. `lint.opener_repeat`, `obligation.clue_absent`, `stage.aftermath.restage`) and one table `FAILURE_CODES: Record<code, { gate: BatchGateName; retryClass: RetryFailureClass; family: RetryFamily; bypass?: "entropy"|"opener"|"fingerprint_note"; cosmetic?: boolean }>`. Lint and obligations return `ValidationFinding { code, message, evidence?, matchingPriorParagraph? }`. `batchErrors` becomes `ValidationFinding[]`; the three classifiers become lookups; story-validation's `ChapterValidationIssue` gets an optional `code` so its strings join the same table (and geometry codes map in by name — they already are codes). Phase 1 (R1): add codes, keep every message byte-identical, and a parity test asserting `FAILURE_CODES[code]` equals today's regex output **for every template** — this freezes current behaviour, including its errors, as a table. Phase 2 (R2, flag): correct the table rows that are wrong today (the 17/8/6 above) — this changes retry routing and gate telemetry, so the owner decides.
- **Benefit:** removes the "vocabulary that cannot read its own strings" class (X80, X62/X74/X75); 3 regex classifiers (~130 lines) → one ~80-line table; message wording becomes free to improve (A9V-12) without silently re-routing retries; `gate_outcomes` in the report becomes true.
- **Verification:** parity test over all templates (seed: `scratchpad/a9v/classify.mjs`); before/after byte-equality of retry prompts on fixed error sets.
- **Relates to:** A9V-02, A9V-11, A9V-12; retry/generate area (the 92 consumers in generate.ts); CODE-AUDIT-BACKLOG §3.

### A9V-02 — `lintBatchProse` as a rule table
- **P1 · lens B · R1 · M (1.5 days)**
- **Evidence (INFERRED + MEASURED):** lint.ts:107–872, 766 LOC, cc 152, depth 6. Phases are independent and only append to `issues`: entropy 183–210, paragraph fingerprint 212–241, opening duplicate 247–265, opener uniqueness 278–321, intra-chapter sentence dup 339–358, cross-chapter echo 380–417 (with a `console.warn` side effect, 403), n-gram 427–481, banned phrases 484–493, control-plane leakage 495–506, suspect clearance 514–568, then a per-chapter/per-paragraph loop 643–778 bundling room inventory, Group A opener, Group C stock phrases, adjacent duplicate, same opener sentence, 15 template-bleed closures, 19 debug-note patterns, victim alibi, gender collective; verdict closer 783–799; boundary integrity 804–846; truncation 852–869. Shared closure state is small: `styleLinterConfig`, `mode`, `chapterOffset`, derived entropy thresholds, `generatedChapterCount`, `nameOpenerTokens`. Each fix since 2026-05 added a block inline (13 commits). Per-rule telemetry exists for only 5 of 13 types (types.ts:285–297); the 7 `template_bleed` sub-rules are indistinguishable.
- **Proposal:** `agent9-prose/lint/` with `context.ts` (`LintContext`: batch, prior, options, config, lazily cached normalised prior paragraphs/sentences/n-grams/first sentences), `rules/*.ts` exporting `LintRule { id: ProseFailureCode; run(ctx): ValidationFinding[] }` (~21 rules, 10–60 LOC each), `index.ts` coordinator (~60 LOC) iterating an **ordered** `LINT_RULES` array and returning `{ issues, diagnostics }` (the echo warning becomes a diagnostic the caller logs). Order must be preserved: `classifyFailure` builds `mustFix` from `validationErrors.slice(0, 4)`, so issue order reaches prompt bytes. Constant pattern lists move to module scope.
- **Benefit:** cc 152 → coordinator cc ≤ 5, largest rule cc ≈ 15; per-rule firing counters for free — the "counter at zero" evidence ADR-0011 needs before a rule can be retired (several stage/lint wordlists look near-vacuous or redundant, A9V-12); rule-level unit tests.
- **Verification:** golden snapshot of the ordered issue list (type, message, matchingPriorParagraph) over a fixture set with one chapter per rule plus a clean chapter and multi-chapter prior context, before and after.
- **Relates to:** A9V-01, A9V-03, A9V-09, A9V-12, A9V-15.

### A9V-03 — One registry for audit/debug-note leak patterns
- **P1 · lens C · R1 (merge, no change in matches) → R2 (union) · S–M**
- **Evidence (MEASURED):** four bodies of one family: lint `DEBUG_NOTE_PATTERNS` (lint.ts:610–642, 19), sanitizer `INTERNAL_AUDIT_LEAK_PATTERNS` (sanitization.ts:11–23, 11), `sanitizeClueField` (phrase-analysis.ts:115–123, 4), prose-guard `TEMPLATE_LEAKAGE` (fidelity.ts, overlaps on "the time was recorded as"). Lint ∩ sanitizer = 10 (two with small variations); 9 lint-only (arithmetic "a difference of N minutes", investigator-wait variants, `[locked fact]`, mechanism-relies-on); 1 sanitizer-only. Consequence: the sanitizer runs before the lint (generate.ts:2717), so a lint `debug_note_bleed` hit at batch time is almost always a lint-only pattern — and the exhaustion pre-accept "strip" (generate.ts:3515–3528) uses the **sanitizer** list and keeps any paragraph that is not *entirely* leak text. Probe: *"…a difference of 12 minutes that nobody could explain"* → lint flags, sanitizer leaves it, paragraph survives and ships.
- **Proposal:** `prose-guard/src/leak-patterns.ts` (prompts-llm and rubric-score both already depend on prose-guard): `LEAK_PATTERNS: { id, re, scope: "scrub"|"gate"|"cap" }[]`; `stripInternalAuditPhrasing`, the lint rule, `sanitizeClueField` and `detectTemplateLeakage` select by scope. Step 1 keeps each consumer's current set (R1). Step 2 (R2): the pre-accept strip removes the offending *sentence* with the gate's own patterns.
- **Benefit:** 4 lists → 1; the exhaustion path can finally remove what it accepted; ~40 lines.
- **Verification:** per-consumer match-set equality test on a sentence corpus (every pattern's positive control + existing test fixtures).
- **Relates to:** A9V-02, A9V-13 (`stripAuditLocal`).

### A9V-04 — Clue presence: one matcher, a policy per use
- **P1 · lens C · R1 (in-file merge) → R2 (gate = scorer) · M**
- **Evidence:** (INFERRED) generation gate `chapterMentionsRequiredClue` (clue-validation.ts:792) vs release-gate/scorer `collectClueEvidenceFromProse` (agent9-scoring-adapter.ts:280). They differ in text source (observable vs description), stopword list (two sets both named `CLUE_TOKEN_STOPWORDS`, clue-validation.ts:511 vs adapter:124), stemming (`tokenMatchesText` vs `includes`), granularity (chapter vs paragraph), threshold (0.55/0.35 of ≤10 tokens vs config 0.30, min 2) and fallback (semantic families vs none). The repo documents this as "SPLIT-BRAIN MATCHERS" (agent9-run.ts:3374, A_62 abort class #5) and patched it with a gate-side repair rather than a merge. Inside the file, four near-clones build tokens and threshold them differently: `chapterMentionsRequiredClue` 792, `chapterClueAppearsEarly` 893 (0.25), `resolveContextOnlyCluePresence` 944, `resolveContextOnlyClueEarlyPresence` 965 (1 if ≤4 tokens else 0.25); `validateBatchInferenceChain` 1494 has a sixth tokeniser. A_73 §4.2 ("55%-of-10-tokens matcher") is the open question this would answer.
- **Proposal:** `agent9-prose/clue-presence.ts`: `clueTokens(source, castNames)`, `matchTokens(text, tokens, policy)`, policies `WHOLE_CHAPTER`, `EARLY_WINDOW`, `CONTEXT_ONLY`, `CONTEXT_EARLY` reproducing today's thresholds exactly (R1, −90 lines). Then (R2, flag) move the matcher into a package both sides can import and make the scorer and the gate call the same function with an explicit granularity parameter.
- **Benefit:** removes the documented split-brain class; the gate-side repair edge at agent9-run.ts:3400ff becomes unnecessary.
- **Verification:** truth-table test over the existing clue fixtures (regen-integration, deterministic-repair-early-insert tests) comparing old and new per policy.
- **Relates to:** A9V-13 (`surfaceSpecKeyTerms`), area owning the scoring adapter.

### A9V-05 — Season: detector and repairer must share one rule
- **P1 · lens C · R0 (dead) + R2 (behaviour) · M**
- **Evidence (MEASURED, `probes.mjs`, September lock, YAML flags on):**
  - Repairer `enforceMonthSeasonLockOnChapterWithTelemetry` (lint.ts:1044) with `contextAware` + `protectedCollocations`: *"A broken spring fragment lay on the sill as the evening fog rolled in."* → **"A broken autumn fragment…"**; the chapter validator with the case's `caseNamesMechanicalSpring` sees no conflict. The repairer knows nothing of the REVIEW_12 case switch; its protection is `SPRING_MECHANICAL_COLLOCATION_RE` (997), and `MECHANICAL_CONTEXT_RE` (996) contains `spring` itself so `isProtectedSpringContext` (1025) reduces to "collocation or no weather word nearby".
  - Converse: *"The garden had been lovely that spring…"* is flagged by the detector and left by the repairer (no context word) → a retry the floor could not prevent.
  - `narrative-continuity-validator.ts:210` calls `analyzeTemporalConsistency(text)` with no case vocabulary, so the whole-story validator still flags "broken spring fragment" — the REVIEW_12 §3.1 fix reached only one of two callers.
  - Dead/duplicate bodies: `conflictingSeasonPatterns` (lint.ts:1015, no reader anywhere) whose comment claims to mirror the detector; `deriveTemporalSeasonLock` (960) = `monthToSeason` (shared/temporal-anchor.ts:68); two `MONTH_TO_SEASON`/`CanonicalSeason` (story-validation temporal-consistency.ts:1–16 and shared/temporal-anchor.ts:30–50, whose header still says "verbatim COPY… until phase 2").
- **Proposal:** season lives in story-validation `temporal-consistency.ts` (prompts-llm already imports it): export `seasonConflictSpans(text, lock, caseCtx)` used by both the detector and a relocated `season-lock.ts` repairer, which takes the case context and only rewrites spans the detector would flag. R0 now: delete `conflictingSeasonPatterns`, make `deriveTemporalSeasonLock` call `monthToSeason`, re-export one `MONTH_TO_SEASON`. R2: repairer/detector parity; pass case terms in narrative-continuity.
- **Benefit:** no deterministic corruption of the murder device's name; every detector hit is repairable by the floor (the lint.ts:1006 comment's stated intent); 4 season vocabularies → 1.
- **Verification:** parity test: for a sentence corpus × 4 locks × case-names-spring on/off, `repairer changes span ⇔ detector flags span`.
- **Relates to:** REVIEW_12 §3.1, ADR-0005.

### A9V-06 — Death-method surface predicate: gate ≠ grader
- **P2 · lens C · R2 · S**
- **Evidence (MEASURED, `death.mjs`):** `proseSurfacesDeathMethod` (clue-validation.ts:1140) says it matches "the SAME way the rubric grader does" (1131–1138). It tokenises the free-text method keeping any word >3 chars; the grader (rubric-score facts.ts:34–55) maps to a stem family. On prose that never mentions the death: "stabbed with a letter opener", "poisoned with arsenic in her tea", "blunt force trauma to the head" → gate **true** (via "with"/"head"), grader **false**. A third pattern body (`shared/death-method-patterns.ts`) exists and differs from the rubric's list (no `struck`, no `dagger` trigger).
- **Proposal:** move `DeathMethodKind` patterns + a `surfacesDeathMethod(prose, method)` into prose-guard; rubric-score and both gate call sites (final-reveal and final-chapter checks, 1376, 1449, 1468) import it.
- **Benefit:** the "weak murder method" cap gets a real lever; −10 lines, 3 bodies → 1.
- **Verification:** truth table over the 10 `DeathMethodKind`s × positive/negative prose.
- **Relates to:** A9V-07, A9V-08.

### A9V-07 — Re-staged reveal and culprit disclosure
- **P2 · lens C · R2 · M**
- **Evidence (INFERRED):** "aftermath re-stages the reveal": `detectRestagedRevealViolations` (clue-validation.ts:206, gate, culprit-blind, 2026-07-31), `detectAftermathRepeatParagraphs` (story-geometry accept.ts:329, 2026-08-04 — its comment says "Nothing in the pipeline detects a repeated EVENT"), `detectDuplicateReveal` (rubric-score structural-verifiers.ts:339, 2026-07-24). "Culprit disclosure/resolution" regex bodies: `RESOLUTION_RE` and `AFFIRMATIVE_SUSPECT_PRESSURE_RESOLUTION_RE` (clue-validation.ts:1075, 1159), geometry `GUILT_MARKER`/`disclosingSentence`/`disclosureMatcher` (accept.ts:193, 387, 520) and `DISCLOSURE_LIKE` (derive.ts:142), prose-guard `GUILT_MARKERS` (fidelity.ts:26), story-validation `CULPRIT_TERMS`, `CONFESSION_RE`, rubric `REVEAL_ACCUSATION_RE`. The final-chapter gate (1437–1475) is satisfied by `RESOLUTION_RE` anywhere + surname anywhere — looser than geometry's sentence-scoped disclosure, which is warning-only (REVIEW_15).
- **Proposal:** geometry's detectors are the richest and already the repair validator; export them and have the gate call `detectAftermathRepeatParagraphs` and `disclosingSentence` (prompts-llm already depends on story-geometry). Keep `RESOLUTION_RE` only as the chapter-1 negative test.
- **Benefit:** a passing gate implies a passing geometry check; ~60 lines.
- **Verification:** replay over archived manuscripts (owner's machine) counting gate/geometry disagreements before promoting.
- **Relates to:** A9V-06, A9V-11.

### A9V-08 — `mechanism-detect.ts` into prose-guard
- **P2 · lens C · R1 · S**
- **Evidence (MEASURED):** `MECHANISM_EXPLANATION_MARKER_A9` (mechanism-detect.ts:17) is byte-identical to rubric-score structural-verifiers.ts:210; stopwords and the ≥50%-of-terms rule duplicate 222–240. Deliberate (rubric-score must not be imported by prompts-llm, facts.ts:236) and pinned only by example tests (a55-prose-gates.test.ts:53). Precedent: `detectDualValueNoContrast` was moved to prose-guard for exactly this reason.
- **Proposal:** move the module to `prose-guard/src/mechanism.ts`; rubric imports it.
- **Benefit:** parity by construction; −35 lines. **Verification:** existing tests + typecheck.

### A9V-09 — Opening style: one classifier, one sentence extractor
- **P2 · lens C · R2 · S**
- **Evidence (MEASURED):** `classifyOpeningStyle` exists twice — types/narrative-state.ts:60 (lint entropy) and a private copy in story-validation prose-consistency-validator.ts (~640, `opening_style_repetition`) with different verb lists and time-anchor forms. The lint feeds it `extractOpeningSentence` (lint.ts:82), which cuts at honorific periods: *"Dr. Mallory Finch examined the body…"* → `"Dr."` → `general-descriptive` (full sentence: `character-action`), so the classifier's titled-name branch is unreachable from the lint and entropy is biased down. Four more opening-sentence extractors: lint.ts:709/712, context-management.ts:93, generate.ts:1761; the validator uses an abbreviation-safe one.
- **Proposal:** `story-validation/src/opening-style.ts` exporting the abbreviation-safe extractor + one classifier; both consumers import.
- **Benefit:** 2 classifiers + 5 extractors → 1 + 1; fewer spurious `opening_style_entropy` retries. **Verification:** classification table over `data/opening-corpus.json` situations and fixture openers.

### A9V-10 — Clearance evidence connectors
- **P2 · lens C · R1 → R2 · S**
- **Evidence (MEASURED):** A_73 §11.1 single-sourced the clearance *terms* but not the *evidence* half: lint.ts:518, deterministic-repair.ts:68 and agent9-run.ts:2342 are byte-identical private copies; `shared/clearance-vocabulary.ts:41` `CLEARANCE_EVIDENCE_RE` (used by the regen validator) differs from all three and from the release gate (suspect-closure-validator.ts:13). *"Hale was cleared; a witness saw him in the garden at nine."* → regen accepts, lint and release gate reject.
- **Proposal:** R1: export the lint body as `CLEARANCE_EVIDENCE_NARROW_RE` from the shared module, delete the three copies, extend the parity test to the evidence half. R2: align the regen validator with the release gate.
- **Benefit:** 5 bodies → 2 pinned ones; a regen that passes cannot fail the gate.

### A9V-11 — Obligation validator as a stage table; split clue-validation.ts
- **P2 · lens A/B · R1 · M (1 day)**
- **Evidence (INFERRED):** `validateChapterPreCommitObligations` (clue-validation.ts:1188, 291 LOC, cc 57, 6 params) = word target 1210–1227, clue loop 1234–1269 (redundant inner `if (!clueState.isEarlyEnough)` 1258; `seenClueFailKeys` cannot fire because ids are already unique), eight-case switch 1275–1434 whose marker regexes are rebuilt per call (1276–1281), final-chapter resolution 1437–1475. Shared state: `chapterText`, `chapterLower`, `chapterNumber`. clue-validation.ts itself holds 8 responsibilities (stage mode, scene-ref resolution, word targets, cost total 409, batch-gate telemetry 416–509, clue matching, key-term composers 540–570, resolution text 1075–1121). The stage mode is derived at 4 sites (prompt-builder.ts:1805/2093, deterministic-repair.ts:835–849, generate.ts:3806 and ~4258 with inline copies of the DT-scene regex and 0.70 threshold) — ADR-0005 says derive once.
- **Proposal:** `obligations/{word-target, clue-obligations, stage-rules, final-chapter}.ts` with `STAGE_RULES: Record<StageModeKey, (view) => ValidationFinding[]>`; coordinator ≈ 40 LOC. Split the file into `stage-mode.ts`, `scene-refs.ts`, `word-targets.ts`, `batch-gates.ts` (→ A9V-01 table), `clue-presence.ts` (A9V-04), `key-terms.ts`, `resolution-language.ts`. Compute `stageModeByChapter` once (Bible or ledger) and pass it to prompt builder and validator.
- **Benefit:** cc 57 → ≤ 12; prompt and validator can no longer disagree on the mode (REVIEW_12 §5 shape).
- **Verification:** golden obligation results per stage mode (existing agent9-prose / item11 tests + fixtures).

### A9V-12 — Every rule names its trigger; drop redundant duplicate rules
- **P2 · lens I · R2 · S–M**
- **Evidence (MEASURED):** REVIEW_12 §8.2 made three messages quote their trigger. Still restating the rule without evidence: template-bleed closures (lint.ts:727), debug note (741), room inventory (653), Group A (664), victim alibi (754), gender collective (769), verdict closer (793), truncation (863), adjacent duplicate (700), same-opener (717), ngram/fingerprint only via `matchingPriorParagraph`, and `hasAffirmativePrematureResolution` (1338–1341). `overlap.mjs`: one duplicated sentence yields 3 issues (opening dup 247, sentence dup 339, adjacent dup 692) or 2 mid-chapter; the adjacent rule is subsumed by the sentence rule, which also makes the "back-to-back" opener-bypass prefix (generate.ts:3479) unreachable.
- **Proposal:** in the rule table each rule returns `evidence` (matched span); the message template appends it. Retire the adjacent-duplicate rule once its counter confirms it never fires alone.
- **Benefit:** retries become edits, not regenerations (REVIEW_12: retries are 37% of prose prompt volume); fewer duplicate directives.

### A9V-13 — Dead and vestigial code
- **P3 · lens D · R0 · S**
- **Evidence (MEASURED):** `mapStageModeToCompositionPhase` + `CompositionPhaseKey` (clue-validation.ts:30, 63) — last caller removed in 95011cc9 (2026-06-15); only mention elsewhere is ANALYSIS_40; exported only through the internal `export *` barrel, not the package index; no flag → R0 under ADR-0011 (un-export, then delete on the compiler's word). `conflictingSeasonPatterns` (lint.ts:1015) likewise. `tsc --noUnusedLocals --noUnusedParameters`: 9 hits — discriminating.ts:8, 9, **92 (`outline` parameter never read)**; lint.ts:9 (`ARC_POSITION_REGISTER`); phrase-analysis.ts:6–9 (4 imports), 122. Also `buildDiagnosticRepairPrompt` ignores `args.chapter` (full-story-diagnostic.ts:290); `stripAuditLocal` (sanitization.ts:86) duplicates `stripAuditField` (244); `surfaceSpecKeyTerms`/`composeKeyTermPhrase` identical but for `max` (540/545); `getRequiredClueIdsForScene` inlines `getPerActSceneNumber` (657 vs 95); `escapeRegExp` exported (lint.ts:936) yet re-inlined 4× (lint.ts:536, 541; clue-validation.ts:1148, 1438); dangling comments (discriminating.ts:268–274, phrase-analysis.ts:204–209); entropy comment (lint.ts:167–170) documents TS defaults, not the live YAML (0.62/0.70/0.70). ~25 exports are used only in their own file (export-usage.md) — un-export when splitting.
- **Benefit:** ≈ −80 lines. **Verification:** typecheck + tests + `build:all`.

### A9V-14 — Types and parse boundaries
- **P3 · lens E · R0 (types) / R2 (parse) · S–M**
- **Evidence:** 37 `any` in clue-validation.ts, 21 in discriminating.ts, 12 in sanitization.ts; every `scene: any` although `Scene` (agent7-narrative.ts:116) is typed and includes `beat`; `cmlCase: any` (CaseData = any). `parseProseResponse` (sanitization.ts:85–97) runs `jsonrepair` bare, while five other agents guard truncation via `shared/json-boundary.ts`; prose-blind-reader.ts:85–91 and full-story-diagnostic.ts:106–117 hand-roll regex JSON fallbacks (jscpd clone with agent3b/agent6).
- **Proposal:** `import type { Scene }`; a narrow `CmlProseView` type for the ~12 CML fields read here (R0). Route the three LLM parses through `guardedJsonrepairParse` (R2 — a truncated prose payload would be refused, not repaired).

### A9V-15 — Compute efficiency: negligible
- **P3 · lens H · R1 · S**
- **Evidence (MEASURED, `bench.mjs`, 20 chapters, 65,594 words, 3 attempts each):** `lintBatchProse` 31 ms mean, 50 ms for ch20 vs 19 prior; 60 calls ≈ 1.9 s. Obligations 2.75 ms/call; season lock 29 ms for 60 calls. Against 30–90 s per chapter LLM call this is ≈ 0.1%. Waste exists (prior chapters re-normalised on every call and every rule; `allPriorText` rebuilt per batch chapter, lint.ts:681; per-call RegExp construction in the season lock and death-method check) but is not worth a change on its own; the `LintContext` cache in A9V-02 removes it for free.

### A9V-16 — Code in the wrong place
- **P3 · lens A · R0 / R2 · S**
- **Evidence:** `compileSensoryAtoms` (phrase-analysis.ts:293) is an Agent 2c post-processor (agent2c-run.ts:199, 219, 345); `discriminating.ts` builds a prompt block; when `validateChecklistRequirements` fails, its "❌ CHECKLIST VALIDATION FAILED …" string is returned **as the prompt block** (discriminating.ts:103–106) — an internal error message sent to the model in place of the checklist; the season-lock rewriter lives in the linter; the two LLM stages are not validation. prompts-llm imports `@cml/story-validation` from 28 files without declaring it in package.json.
- **Proposal:** move `compileSensoryAtoms` beside agent2c; `discriminating.ts` → prompt blocks; log the checklist failure and omit the block (R2); declare the dependency (cross-area).

## 4. Target structure

```
agent9-prose/
  lint/                      index.ts (~60)  context.ts (~80)  rules/*.ts (~21 rules, ~560 total)
  obligations/               index.ts (~40)  word-target.ts  clue-obligations.ts  stage-rules.ts (~150)  final-chapter.ts
  stage-mode.ts (~150)       scene-refs.ts (~80)   word-targets.ts (~40)   key-terms.ts (~40)
  clue-presence.ts (~180)    resolution-language.ts (~120: RESOLUTION_RE, backstop sentence)
  season-lock.ts (~90, uses story-validation temporal-consistency)
  sanitization.ts (~200)     phrase-analysis.ts (~230, minus 2c atoms)
  full-story-diagnostic.ts, prose-blind-reader.ts (unchanged, guarded parse)
contracts/prose-failure-codes.ts (~120)   — the one vocabulary (A9V-01)
prose-guard/src/{leak-patterns, mechanism, death-method}.ts   — shared gate↔grader predicates
story-validation/src/opening-style.ts     — one classifier + extractor
```
Largest function after: ≈ 60 LOC, cc ≤ 15 (today 766 / cc 152 and 291 / cc 57).

## 5. Suggested sequence

1. **R0 cleanup (A9V-13, A9V-14 types):** delete compiler-proven dead code, fix unused params, un-export own-file symbols. ½ day.
2. **Characterisation nets (§7)** — lint golden, obligation golden, classifier table over all templates.
3. **A9V-02 rule table** (R1), order-preserving, golden-verified; per-rule counters added to the report (additive telemetry).
4. **A9V-11 split + stage table** (R1); compute stage mode once.
5. **A9V-01 phase 1**: codes alongside messages + parity table (R1). Phase 2 behind a flag (R2, owner).
6. **Shared predicates, R1 moves:** A9V-08 (mechanism), A9V-10 step 1, A9V-03 step 1, A9V-04 in-file merge, A9V-05 R0 part.
7. **R2 corrections, each flag-gated with a replay/corpus measurement:** A9V-05 repairer parity, A9V-06, A9V-07, A9V-09, A9V-12, A9V-04 gate=scorer.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `AGENT9_AFTERMATH_FINAL_SIGNAL_FALLBACK` | unset → off | clue-validation.ts:270 (runtime getter) | DEFER (needs zero-FP) | Adds a second (signal) path to `isGoldenAgeAftermathFinalChapter`; contained |
| `AGENT9_FULLSTORY_DIAGNOSTIC` | unset → off (`off/shadow/apply`) | full-story-diagnostic.ts:69 | DEFER (≥3 shadow runs) | Clean mode switch |
| `ENABLE_PROSE_BLIND_READER` | unset → off | prose-blind-reader.ts:31 | **not in register** — name is outside `flags:check`'s pattern | Rename to `AGENT9_*` or widen the pattern |
| `AGENT9_CROSS_CHAPTER_ECHO` | unset → off | generate.ts:3355 → `options.crossChapterEcho` | DEFER, deliberately | Rule always computed and logged; only the issue is gated |
| `AGENT9_REGEN_SUSPECT_ELIM` | SET on | generate.ts:3376 | DEFER | Decides whether `suspect_clearance_missing` is pasted or escalated |
| YAML `boundary_integrity_gate_enabled`, `season_lock_context_aware_enabled`, `season_lock_protected_collocations_enabled`, `semantic_rewrite_diff_guard_enabled`, `precommit_phrase_gate_enabled`, `opener_exhaustion_bypass_enabled` | all on (`!== false`) | generate.ts:2122–2138, passed as options | not in FLAG-AUDIT (config rollout flags) | The season options are why the repairer's rules diverge from the detector (A9V-05); the bypass flags key off message prefixes (A9V-01) |

## 7. Safety net

- **Tests today:** agent9-prose.test.ts (lint + obligations), sentence-dedupe-c3, obligation-aftermath-item11, stage-mode-item11-aftermath, agent9-aftermath-restaged-reveal, resolution-narrowing-r12, r-a-keyterms, a58-prose-fixes, regen-integration, deterministic-repair-early-insert, full-story-diagnostic, agent9-identifier-scrub, full-story-repetition-polish, temporal-anchor, retry-routing-vocabulary, clearance-vocabulary-parity, a55-prose-gates. Statement coverage (coverage.md): `lintBatchProse` 73%, `validateChapterPreCommitObligations` 54%, lint.ts 76%, clue-validation.ts 72%, sanitization 53%, phrase-analysis 45%, prose-blind-reader 6%.
- **Gaps:** no test names `opening_style_entropy`, `debug_note_bleed`, `control_plane_leakage`, `victim_alibi_error`, `sentence_fragment_truncation`, Group A/C, room inventory, verdict closer or gender collective; no test for `buildChapterRequirementLedger`, `validateBatchInferenceChain`, `extractBeatFingerprints`, `parseProseResponse`, `countMechanicalSeasonCollisions`, `blindReadProse`.
- **Write first:** (1) lint golden — fixture set with one triggering chapter per rule + clean chapter + prior context, snapshot of the *ordered* issue list; (2) obligations golden — one chapter per stage mode, pass and fail; (3) classifier table test over all 42 templates (seed `classify.mjs`), freezing current routing before A9V-01; (4) season detector/repairer truth table (`probes.mjs` cases); (5) gate↔grader truth tables for death method and mechanism.
- **Replay:** `agent9-replay.ts` needs LLM calls or gitignored checkpoints; for these pure functions direct goldens are cheaper. The owner's 171–198 archived manuscripts would make the ideal before/after corpus for every R2 item (count rule firings old vs new).

## 8. What NOT to refactor

- The corpus-measured wordings: `RESOLUTION_RE` narrowing (1049–1106), the aftermath phrase list without "for the first time" (1385–1404), `SPRING_SEASONAL_ONLY_RE` — move them verbatim; they carry measured positive controls.
- The trigger-quoting messages from REVIEW_12 §8.2 — their exact text is what the model edits against.
- Narrow vs wide clearance *terms* — deliberately different and pinned by `clearance-vocabulary-parity`.
- Catch-and-continue in the diagnostic and blind reader (ADR-0003: best-effort stages never abort).
- `skipNgramCheck` for late arc positions, cross-chapter echo default-off, the entropy bypass — measured policy.
- The mechanism detector must not *import* rubric-score — move it to prose-guard instead (A9V-08).
- `FULL_STORY_FINDING_CLASSES` closed enum and the anchor-or-discard rule — load-bearing guards.

## 9. Incidental defects

| # | Defect | Evidence | Confidence |
|---|---|---|---|
| 1 | A lone *"clue evidence … is absent"* (and *"no resolution event detected"*) classifies as retry class `unknown`; with a repeat at attempt 2, `shouldContinueRetry` (retry-protocol.ts:201) returns false and the chapter goes to terminal fallback, forfeiting attempt 3 (generate.ts:3672–3684; `AGENT9_REDESIGN_V1` on) | class MEASURED; effect INFERRED; the deterministic clue patch usually pre-empts it | High / medium |
| 2 | `gate_outcomes` in the report misattribute 17 of 42 message templates (control-plane leakage → completeness; "verbatim" → locked_fact_word_form) | MEASURED | High |
| 3 | Season repairer rewrites "broken spring fragment" → "broken autumn fragment" | MEASURED | High |
| 4 | Whole-story narrative-continuity validator still flags the mechanical spring (no case args, narrative-continuity-validator.ts:210) | MEASURED | High |
| 5 | `proseSurfacesDeathMethod` passes prose that never names the death for methods containing "with", "head" | MEASURED | High |
| 6 | Gender-collective rule fails valid prose ("Both men turned as she entered") and is typed `debug_note_bleed`, so it and the verdict-closer rule ride the debug-note exhaustion bypass | MEASURED | High |
| 7 | `extractOpeningSentence` cuts at "Dr."/"Mr." | MEASURED | High |
| 8 | Exhaustion pre-accept strip cannot remove lint-only debug notes; keeps any mixed paragraph | MEASURED | High |
| 9 | Regen clearance validator accepts connectors ("witness", "saw") the release gate rejects | MEASURED | High |
| 10 | `validateChecklistRequirements` failure text is sent to the model as the DT checklist block | INFERRED (discriminating.ts:103–106) | High; frequency UNVERIFIABLE |
| 11 | `revealChapterText` is documented as the reveal chapter but generate.ts passes all prior chapters joined, making the reveal-satisfied conjunction near-vacuous | INFERRED | Medium |
| 12 | "back-to-back" opener-bypass prefix unreachable (sentence-dup rule co-fires with a non-bypass type) | MEASURED | High |
| 13 | `ENABLE_PROSE_BLIND_READER` invisible to `flags:check` | INFERRED | High |

## 10. Cross-area observations

- **Typed-at-source, stringly-typed-at-boundary** is likely general: Agent 5/6 have their own `*FailureClass` string classifiers (agent5-run.ts:159, agent6-escalation-policy.ts). The A9V-01 pattern (codes + one table + parity test) applies.
- **Gate ↔ grader pairs** recur across the repo; prose-guard is the established neutral home (dual-value, template leakage, scaffold). Candidates found here: leak patterns, mechanism, death method, disclosure, clue presence, opening style.
- **Micro-idioms re-implemented everywhere:** regex escape inlined 49× in 24 files; ≥ 8 sentence splitters in this area alone; ≥ 6 tokenisers with the same lower/strip/split core; ≥ 5 surname extractors. A small `text` primitives module would remove a whole class of "same sentence, different definition" disagreements.
- **Stage-mode / DT-chapter derivation** repeated at 4 sites violates ADR-0005 — the Bible should carry it.
- **Undeclared workspace dependency:** prompts-llm → story-validation (28 files) is missing from package.json and from the architecture map.

## 11. Open questions for the owner

1. For A9V-01 phase 2: should a lone clue-absent failure get the full retry budget (`clue_timing`)? Today it is `unknown`.
2. Which body should own clue presence — the gate's chapter-level stemmed matcher or the scorer's paragraph-level one? (A_73 §4.2 is the same question.)
3. Season repairer: when the case names a spring, should the floor ever rewrite bare "spring"?
4. May the gate adopt geometry's disclosure/aftermath detectors (stricter than today) behind a flag?
5. Retire rules whose counters stay at zero (near-vacuous stage wordlists, the adjacent-duplicate rule) once A9V-02 reports them?
6. Is refusing truncated prose JSON (instead of repairing it) acceptable at the Agent 9 boundary?
