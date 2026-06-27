# Aligning the Scoring System to the Mystery Story Scoring Rubric

> How to change the codebase's scoring system to produce the score described in
> [`scoring-approach.md`](scoring-approach.md) — a holistic, reader-facing, 10-category /100 rubric
> with hard caps and a fixed report format — **without throwing away the deterministic machinery that
> already exists** and that, as it turns out, computes most of the rubric's hard caps for free.

---

## 1. The core mismatch (why this is a real change, not a tweak)

| | **Today's system** | **The rubric (target)** |
|---|---|---|
| Unit scored | each **agent's artifact** (15 phases) | the **finished story** (one book) |
| Method | **deterministic / heuristic** (regex, counts, structural checks) — *no LLM-judge exists in scoring today* | an **LLM critic reading the prose** |
| Categories | `validation / quality / completeness / consistency` per phase | `Premise, Opening Hook, Plot, Character Clarity, Dialogue, Atmosphere, Clues, Pacing, Ending, Prose` |
| Overall | **average of 15 phase totals** ([`aggregator.ts:174-178`](../../packages/story-validation/src/scoring/aggregator.ts)), adjusted by run outcome | **sum of 10 categories /100**, clamped by score bands + hard caps |
| Owns | per-phase **retry decisions** (mid-run) + release gates | the **final product verdict** |

The current `overall_score` answers *"did every agent's artifact pass its threshold?"* — **process health**. The rubric answers *"is the finished story any good to read?"* — **product quality**. These are different questions and the redesign should **keep both**, not replace one with the other.

**Central insight that makes alignment cheap:** the rubric's *subjective* categories (premise, dialogue, atmosphere, prose feel) genuinely need an LLM critic — but its **hard caps and penalty rules are almost all *deterministic facts*** the pipeline already knows or that the redesign packages already compute:

> *"victim consistently dead", "culprit ≠ victim", "investigator stable", "pronouns stable", "clues planted before used", "reveal uses only planted evidence", "no template/validation-text leakage".*

So the alignment is the **same hybrid the whole redesign keeps arriving at**: *a checker owns the facts, a critic owns the judgement, and they never trade places* (Agent 6 §4.1, Agent 9 §4.3). The checker **supplies and enforces** the hard caps; the LLM critic **scores** the ten categories; neither is asked to do the other's job.

---

## 2. Target architecture

Introduce one new top-level scorer that runs **once, on the assembled book, after Agent 9**:

```
Final prose (all chapters)
        │
        ├── DETERMINISTIC FACTS  ──────────────────────────────┐
        │   • CML facts: victim/culprit/detective roles, death  │
        │     chapter, clue→chapter map, timeline (CASE/outline) │
        │   • contract fidelity per chapter (@cml/prose-guard)   │
        │   • clue coverage / ordering (@cml/clue-spec,          │
        │     @cml/beat-scheduler)                               │
        │   • solvability + uniqueness (@cml/cml-core)           │
        │   • novelty verdict (@cml/novelty)                     │
        │   • leakage / pronoun / role detectors (prose-guard+)  │
        │                                                        ▼
        └── LLM CRITIC ─────────────►  FinalStoryRubricScorer  ──► RubricScore
            (rubric == system prompt,        │  (applies hard caps in code,
             structured output, low temp)    │   clamps to score bands)
                                             ▼
                              overall_score / overall_grade (canonical)
                              + rubric_breakdown (10 cats + caps + sections)
                              + "Fastest Fixes" → feeds Agent 9 critic rewrite
```

- **`FinalStoryRubricScorer`** (new) — home: `packages/story-validation/src/scoring/rubric/`. It owns the rubric.
- It is **LLM-judge primary, checker-gated**: the model proposes the ten category scores and the narrative sections; the code then **enforces every hard cap and band clamp deterministically** so a cap can never be "forgotten" (the rubric's own instruction — *"if the total seems too generous because of a major continuity problem, lower the final score"* — becomes a guaranteed code step, not a hope).
- The **15 per-phase scores stay** exactly as they are, but their role narrows to **process telemetry + retry control** (they run mid-generation; the rubric can't, because it needs the whole book). The report keeps them under `phases[]`; the **headline `overall_score` switches to the rubric**.

**Two design notes that differ from today's model:**

1. **Unweighted, equal categories.** The rubric total is a *straight sum of ten equal /10 marks* (no
   weights) — unlike today's weighted `validation/quality/completeness/consistency` components. The
   judge returns ten marks; `total = Σ`, then caps/band-clamp apply. Per-component weighting survives
   only *inside* the per-phase scorers, which are no longer the headline.
2. **"Start at 5/10" is part of the prompt, not a vibe.** The rubric's philosophy — *start each
   category at 5/10, add points for clear strengths, subtract for specific problems* — is encoded
   verbatim in the judge's system prompt so each mark is *anchored*, and every mark must cite a
   concrete reason (the rubric's Scoring Style section). This anchoring is what makes a low-temperature
   judge reproducible enough to gate on.

---

## 3. The ten categories → which signals feed/cross-check each

The LLM critic scores every category, but each gets a **deterministic cross-check** that either caps it or is fed to the critic as a verified fact (so the critic reasons about prose, not about facts it can't reliably extract).

> **Legend:** ✓ = the signal already exists in a shipped package; ⊕ = a net-new detector to build (small,
> pure, listed in §6). `prose-guard+` means "extend `@cml/prose-guard`". The packages cited are real and
> green (`cml-core` 65 tests, `prose-guard` 18, `clue-spec` 15, `beat-scheduler` 11, `novelty` 12).

| Rubric category | LLM critic judges | Deterministic signal (package) |
|---|---|---|
| **1 Premise / Concept** | originality, dramatic potential | `NoveltyVerdict` distinct/variation/clone (`@cml/novelty` ✓); mechanism≠murder-method distinction (CML `CASE.hidden_model.mechanism` vs `outcome` ⊕) |
| **2 Opening Hook** | vividness, clarity of victim/investigator | victim named in ch.1, body-not-too-late, no metadata-dump opening (`prose-guard.detectLocationMetadataDump`) |
| **3 Plot Structure** | escalation, reversal, reveal-follows | the beat grid: each chapter changes state, test before reveal (`@cml/beat-scheduler`) |
| **4 Character Clarity** | role/relationship clarity | **hard caps** from `CASE.cast` roles + `culpability` (exact, today) + pronoun stability (`prose-guard.countMisgenderedPronouns` ✓, gendered by `CASE.cast.gender`) |
| **5 Dialogue** | naturalness, subtext, distinct voices | leakage/"validation-checklist" phrasing detector (prose-guard+) |
| **6 Atmosphere / Setting** | specificity, connection to mystery | location-leak + repeated-weather-opening + 10–25% setting-budget check |
| **7 Mystery Clues / Evidence Logic** | fairness, gradual interpretation | **clue planted-before-used + reveal-uses-only-planted** (`clue-spec`, `beat-scheduler`, `cml-core.proveSolvability`) |
| **8 Pacing** | momentum, no repeated scenes | chapter-balance budgets + repeated-interrogation detector |
| **9 Ending / Reveal** | motive/method/opportunity/consequence | **hard caps**: culprit≠victim (`CASE` roles, exact today ✓), reveal uses planted clues (`prose-guard` contract ✓), mechanism-vs-death distinction (`CASE.hidden_model` ⊕) |
| **10 Prose / Polish** | fluency, natural flow | **hard cap**: template/validation-text leakage (prose-guard+ ⊕), doubled words / "the doctor Finch" / encoding (⊕) |

This map is the build list for §6: a small library of **deterministic detectors** that turn the rubric's penalty bullets into machine signals.

---

## 4. Hard caps as code (the rubric's caps are mostly already computable)

The rubric's hard caps and Major Penalty Rules become a deterministic **cap engine** applied *after*
the LLM scores. Critically, **the facts these caps need are readable *today* from the shipped
`CASE` / `clues` / `outline` artifacts** — the cap engine does **not** depend on the (still-unwired)
typed `cml-core` integration. The redesign packages provide *stronger/proven* versions of the same
signals once wired, but nothing here is blocked on them.

| Rubric cap (from scoring-approach.md) | Fires from | Source (available **today** → stronger later) |
|---|---|---|
| Dead victim appears alive → Char ≤3, Plot ≤5, Clues ≤6, Ending ≤4, overall ≤60 | victim name speaks/acts after the death chapter | `CASE` victim name + outline death chapter + prose scan **⊕** |
| Culprit = victim **by accident** → Char ≤2/3, Ending ≤3, overall ≤55 | culprit name ∈ victim role | `CASE.culpability.culprits` vs the `victim`-role cast member **(exact, today)** |
| Victim = investigator by accident → Char ≤3 | victim role = detective role | `CASE.cast` role fields **(exact, today)** |
| Victim unnamed → Hook/Char/Ending down, overall ≤72 | victim name absent from prose | `CASE` victim name + prose scan **⊕** |
| Pronouns repeatedly switch → Char ≤5, Prose ≤5, overall <70 | per-character wrong-gender pronoun rate | `prose-guard.countMisgenderedPronouns` **✓** (needs per-character gender, from `CASE.cast.gender`) |
| Prompt/template/validation leakage → Prose ≤4, overall ≤65 | the leakage phrase set (§ appendix B) | extend `prose-guard.detectLocationMetadataDump` → `detectTemplateLeakage` **⊕** |
| Reveal uses evidence not planted earlier → Ending ≤5 | a reveal fact not in any prior chapter's `must_surface` | `prose-guard` contract ✓ → `cml-core.proveSolvability` deducibility (post-integration) |
| Clues not planted before used → Clues down | inference path consumes a clue first visible later | `clue-spec` / `beat-scheduler` ordering over `CASE.inference_path` + `clues` **✓** |
| Weak murder method (mechanism explained, death not) → Clues down, Ending ≤6, overall ≤mid-70s | death method absent while mechanism present | `CASE.hidden_model.mechanism` vs `CASE.hidden_model.outcome` **⊕** |
| Ending contradicts earlier chapters → Ending ≤4 | continuity contradiction | critic-primary + `proveSolvability` uniqueness (post-integration) |

Caps are applied in code (`applyHardCaps`, see appendix A), so the final number is **provably
consistent with the facts** regardless of LLM variance — which is exactly how to make an LLM-judge
trustworthy and reproducible enough to gate on. **The caps that are "exact today" (role collisions)
are the rubric's most damaging penalties, and they cost a single artifact read to enforce.**

---

## 5. Changes to the report / aggregator / thresholds

1. **`overall_score` / `overall_grade` become the rubric's /100 and band**, not the average of phase totals. Edit [`aggregator.ts`](../../packages/story-validation/src/scoring/aggregator.ts) `generateReport()` so the canonical `overall_score` reads the `RubricScore.total` when present, falling back to the phase-average only if the rubric scorer didn't run.
2. **Add `rubric_breakdown` to `GenerationReport`** ([`types.ts`](../../packages/story-validation/src/scoring/types.ts)): the ten category scores, the caps applied, and the narrative sections (Overall View, What Works, Main Problems, Chapter-by-Chapter Issues, Fastest Fixes) — the rubric's exact Output Format.
3. **Score bands replace the A–F grade mapping** for the headline ([`thresholds.ts:calculateGrade`](../../packages/story-validation/src/scoring/thresholds.ts)) — or keep A–F internally and add the rubric's 90–100 / 80–89 / … bands for display.
4. **Per-phase thresholds keep driving retries and release gates** unchanged — they are now explicitly "process health", surfaced as a secondary block, not the headline.
5. **The rubric's "Fastest Fixes" / "Chapter-by-Chapter Issues" feed the Agent 9 critic** (redesign §4.3): the same critique that scores the book can drive a targeted rewrite. *Aligning scoring and finishing the Agent 9 redesign are the same work.*

---

## 6. What to build / change / keep

**Build**
- `packages/story-validation/src/scoring/rubric/` — `FinalStoryRubricScorer` (LLM call), `rubric-prompt.ts` (the rubric *is* the system prompt), `rubric-schema.ts` (structured-output schema mirroring the Output Format), `hard-caps.ts` (`applyHardCaps`), `band-clamp.ts`.
- A small **deterministic detector library** for §3/§4 signals — most already exist (`@cml/prose-guard`, `@cml/cml-core`, `@cml/clue-spec`, `@cml/beat-scheduler`, `@cml/novelty`); the net-new piece is `detectTemplateLeakage` (extend `prose-guard`) and a `victim-after-death` / `role-collision` fact extractor over the CML.
- A `rubric-scoring-adapter` in `apps/worker/src/jobs/scoring-adapters/` that assembles the prose + facts and calls the scorer (mirrors the existing adapters).
- The **calibration harness** (§7).

**Change**
- `aggregator.ts` (canonical score source), `types.ts` (`rubric_breakdown`), `thresholds.ts` (bands), the API serializer + UI for the new report block (a genuine UX upgrade — show the table + sections, not a bare number).

**Keep**
- All 15 per-phase scorers (process telemetry + retry control). They are *not* deleted; they stop being the headline.
- The release-gate hard-stop machinery (encoding/temporal) — still terminal.

**No LLM-judge exists in scoring today**, so this introduces a new pattern; reuse the `AzureOpenAIClient` + structured-output approach the redesign already specs (P2).

---

## 7. Calibration & alignment process (the point of this folder)

The rubric is only trustworthy if the LLM-judge **agrees with a human/GPT reference**. So:

1. **Assemble a labelled set** — N finished stories scored by the reference (ChatGPT against this exact rubric, or a human). Store the ten category marks + total + notes.
2. **Run `FinalStoryRubricScorer` in shadow** over the same set; measure **per-category and total agreement** (mean abs error, band-match rate, cap-agreement).
3. **Tune** the prompt (few-shot calibration examples drawn from the labelled set), temperature (0.2–0.3), and the cap thresholds until agreement is acceptable. *Do not* change weights blind — calibrate against the labels.
4. **The deterministic caps are the anchor** — they remove the most damaging LLM variance (the continuity/role/leakage failures the rubric most penalises), so the judge only has to be consistent on the *subjective* categories, which is where LLMs are strong.
5. **Promote** shadow → canary → primary once total agreement is within a target band and no cap disagreements remain.

---

## 8. Migration path & rollout

1. **Land the detector library + `applyHardCaps`** (pure, deterministic, unit-tested against fixtures of each cap). Zero behaviour change.
2. **Land `FinalStoryRubricScorer` behind `RUBRIC_SCORING_MODE = off | shadow | primary`** (default `shadow`). In shadow it logs `rubric_breakdown` next to today's `overall_score`; the headline is unchanged.
3. **Calibrate** (§7) on the labelled set; collect shadow agreement on real runs.
4. **Flip to `primary`** — `overall_score` becomes the rubric; phase scores move to a secondary block; ship the paired API/UI change.
5. **Wire "Fastest Fixes" into the Agent 9 critic** so the score also *drives* improvement (closes the loop with the Agent 9 redesign).

Rollback is a flag flip; the phase-average path stays intact until `primary` is trusted.

---

## 9. Open questions / risks

- **LLM-judge variance** — mitigated by the deterministic caps (which remove the worst failure modes), low temperature, structured output, and few-shot calibration; measured by the shadow agreement metric. The rubric's own *"lower the total to match the band"* instruction is implemented as a deterministic clamp, not left to the model.
- **Cost** — one extra LLM call per run on the full book. Cheap next to the ~96% of run tokens spent on prose retries today (Agent 9 §3.4); and the same call doubles as the Agent 9 critic.
- **Generation-time vs end-of-run** — the rubric scores the *finished* book, so it cannot gate mid-run; the per-phase scorers must remain for retry control. The rubric's chapter-level issues can trigger *targeted* Agent 9 rewrites after assembly, not full regeneration.
- **Chapter mapping** — the rubric's Chapter Balance Standards need per-chapter prose; the chapter-as-contract (`@cml/prose-guard.deriveChapterContracts`) already gives the per-chapter obligation + the beat grid gives the chapter *function*, so balance can be checked per chapter against its function.
- **Two scores, one report** — be explicit in the UI that *process health* (phases) and *product quality* (rubric) are different axes; don't average them into one misleading number.

---

## 10. One-paragraph summary

Today the headline score is the average of fifteen deterministic per-agent artifact scores; the rubric wants one holistic critic reading the finished story across ten reader-facing categories with hard caps. Don't replace one with the other — **add a `FinalStoryRubricScorer` that is LLM-critic primary and checker-gated**: the model scores the ten subjective categories from the prose, and the deterministic checkers the redesign already built (`cml-core` facts, `prose-guard` fidelity/leak/pronoun, `clue-spec` coverage, `beat-scheduler` ordering, `novelty` verdict) **supply and enforce every hard cap in code** so the number is reproducible and consistent with the facts. Make that rubric /100 the canonical `overall_score`, keep the fifteen phase scores as process-health telemetry and retry control, calibrate the judge against a labelled ChatGPT/human reference in shadow before promoting, and feed its "Fastest Fixes" into the Agent 9 critic so the same pass that *scores* the book also *improves* it.

---

## Appendix A — concrete contracts (`rubric/`)

The structured-output schema mirrors the rubric's Output Format; the cap engine is a pure function.

```ts
// rubric-schema.ts — what the LLM critic returns (P2 structured output; no JSON-parse-or-throw)
type Category =
  | "premise" | "opening_hook" | "plot_structure" | "character_clarity" | "dialogue"
  | "atmosphere" | "clues" | "pacing" | "ending" | "prose";

interface CategoryMark {
  category: Category;
  mark: number;          // 0–10, started at 5 then ±
  reason: string;        // REQUIRED — the rubric forbids bare "good"/"bad"
}

interface ChapterIssue { chapter: number; issues: string[] }

interface RubricScore {
  categories: CategoryMark[];          // exactly 10
  total: number;                       // Σ marks, BEFORE caps (the judge's raw view)
  overall_view: string;               // "stronger/weaker than prior drafts, and why"
  what_works: string[];
  main_problems: string[];
  chapter_issues: ChapterIssue[];
  fastest_fixes: string[];            // → feeds the Agent 9 critic rewrite
}

// hard-caps.ts — deterministic, applied AFTER the LLM scores. Pure.
interface StoryFacts {              // all readable today from CASE/clues/outline + prose
  victimName?: string; victimId?: string; culpritIds: string[]; detectiveId?: string;
  deathChapter?: number;
  victimSpeaksAfterDeath: boolean;   // ⊕ detector
  pronounWrongRateByChar: Record<string, number>;   // prose-guard
  templateLeakageHits: string[];     // ⊕ detectTemplateLeakage
  cluesPlantedBeforeUse: boolean;    // clue-spec/beat-scheduler over CASE
  revealUsesOnlyPlanted: boolean;    // prose-guard contract
  deathMethodPresent: boolean;       // ⊕ hidden_model.outcome present in prose
}

interface CappedScore { final: number; band: string; capsApplied: string[]; categories: CategoryMark[] }

function applyHardCaps(raw: RubricScore, facts: StoryFacts): CappedScore;
//  ▸ clamps individual category marks (e.g. culpritIds∩{victimId} ⇒ character_clarity ≤ 2),
//  ▸ recomputes total = Σ(clamped),
//  ▸ applies the overall ceilings (e.g. dead-victim-alive ⇒ total ≤ 60),
//  ▸ maps total → band (90–100 … <40), and records every cap fired in `capsApplied`.
```

`StoryFacts` is the seam: each field is a small deterministic detector (mostly existing). The judge
never *enforces* a cap — it only scores; the cap engine guarantees consistency.

## Appendix B — `detectTemplateLeakage` (the ⊕ net-new detector)

Extend `@cml/prose-guard`'s leak family. Fire on the rubric's exact leakage examples (verbatim from
[`scoring-approach.md`](scoring-approach.md) § "Prompt / Template Leakage" and § Prose/Polish):

```ts
const LEAKAGE = [
  /\bthe chapter moves forward through\b/i,
  /\brequired evidence was kept explicit\b/i,
  /\bthe elapsed time was confirmed\b/i,
  /\bthe time was recorded as\b/i,
  /^\s*at \w+,\s+(early|late|mid)\b/im,          // "At Study, Early afternoon settled…"
  /\b(instead than|moves forward through vivid detail)\b/i,
  /\bthe (doctor|captain|inspector|professor) [A-Z]\w+\b/, // "the doctor Finch"
  /\b(\w+)\s+\1\b/i,                               // doubled words
];
// returns the matched fragments → StoryFacts.templateLeakageHits → caps Prose ≤4 if non-empty
```

These are **deterministic and high-precision** (they are literally generated-text artifacts), so the
most reputation-damaging rubric penalty — *raw validation/planning text in the prose* — is caught for
free and enforced as a cap, never left to the judge's discretion.

---

*See also [`../13_system_redesign/outstanding-redesign-item.md`](../13_system_redesign/outstanding-redesign-item.md)
§4 (the shared P2 structured-output + P4 replay dependencies this scorer also needs) and §6 Agent 9
(the critic this scorer's "Fastest Fixes" feed).*
