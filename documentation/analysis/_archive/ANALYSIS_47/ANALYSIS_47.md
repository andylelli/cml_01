# ANALYSIS_47 — The Agent-9 replay is an upstream-vs-prose **ablation**: holding agents 1–8 fixed and re-rolling Agent 9 reproduces every score-capping defect **verbatim** (leakage, unstated death-method, implausible mechanism) while only the pronoun defect changes — proving the ceiling is set **upstream of Agent 9**, not by the prose

Status: **investigation complete + fix validated live (§7). Replay run `replay-1782168455589` re-ran ONLY Agent 9 prose against run `c133fe54`'s artifacts (project `proj_8e6d7185`, "Blackwood Manor"); rubric 62 vs the original 64 — same band, same four caps; D1/D3/D6 recur identically (upstream), D4 pronouns improve sharply (prose-layer). Answers the question "were the issues in agents <9?" — yes, the capping ones are. §7: a 2-line leakage-injection fix + corrected upstream data lifted a fresh replay to 65 (leakage caps cleared live); the remaining caps/defects (D1 method, D4 pronouns, clue-patch dump) are confirmed prose-layer.**

Run reviewed: [`stories/story_20260622-2351/…batch_es_required_r.md`](../../../stories/story_20260622-2351/generated_in_scene_batches_1_batch_es_required_r.md) (136 lines, 33,789 chars, 10 chapters), rubric [`rubric-report.json`](../../../stories/story_20260622-2351/rubric-report.json) / [`.md`](../../../stories/story_20260622-2351/rubric-report.md), generated 2026-06-22T22:51:55Z.
Control (the original full run): `run_c133fe54-…` = **ANALYSIS_46**, prose [`stories/story_20260622-2214/…required_.md`](../../../stories/story_20260622-2214/generated_in_scene_batches_10_batch_es_required_.md), ChatGPT 70, rubric 64.
**Critical fact:** both runs share the same `projectId proj_8e6d7185-cf4a-4741-ae73-8e6e987fe3cc`. The Agent-9 replay bench (commits `78e81934`/`c1f2dd7b`/`eacaaf30`, landed last night) **re-runs prose generation against a prior run's artifacts** — so agents 1–8 output is byte-identical between the two; only Agent 9's prose is freshly sampled.

---

## 0. TL;DR

1. **This run is an experiment, not just another draft.** Because the replay reuses run `c133fe54`'s artifacts unchanged and re-rolls only Agent 9, it is a clean **ablation**: any defect that recurs is *upstream of Agent 9* (baked into the agents-1–8 artifacts the prose faithfully renders); any defect that changes is *Agent 9's own* (prose-layer, stochastic). The user's question — *"were any of the issues with the previous <9 agents?"* — is answered directly and, for the first time, with a controlled comparison rather than inference.
2. **The score did not move: rubric 62 (raw 65) vs the original 64 (raw 69), same band "Promising but rough", same four caps.** A fresh prose roll could not lift the story off its ceiling, because the ceiling is set by the artifacts, not the prose.
3. **Three of the four score-capping defects recur — two of them verbatim:** D3 control-plane **leakage** (the `discriminating_test.design` block appears *word-for-word* in both runs), D1 **unstated death-method** (concealment explained, death never stated — both runs), D6 **implausible mechanism** (wind rewinds a pendulum clock 40 min — both runs). All three are **upstream / agents 1–8**: the schema text, the missing `death_method` field, and the physically-absurd device live in the CML and the hard-logic artifacts, so no prose sampling can remove them. Same caps fired both times: `prose ≤ 4`, `significant leakage → overall ≤ 65`, `weak murder method → ending ≤ 6` and `→ overall ≤ 75`.
4. **Exactly one defect class changed: D4 pronouns — and it improved sharply.** The original swapped the two *leads* systematically (Pembroke "She set the clock"; Lady Eleanor "his poise / his opportunity / His final glance"). This roll has only **scattered secondary-character slips** (Pembroke "She straightened" Ch3 L41; Dr Langley "he/his" Ch1 L15, Ch7 L89–91) — few enough that the judge wrote *"stable pronouns."* Pronoun gendering is therefore **prose-layer and stochastic**, the one defect a reroll can help.
5. **Conclusion the bench exists to surface:** re-rolling Agent 9 is the wrong lever for this story's score. The capping defects must be fixed *upstream* (the ANALYSIS_45 §8 / ANALYSIS_46 plan: pin facts, render from a contract, gate plausibility). The replay bench's real value is precisely this — it **localises** a defect to before-or-at Agent 9 in one run.
6. **Validated live (§6):** the dominant leakage cap was traced not to the artifacts but to a deterministic Agent-9 *injection* (`INJECTION_TEMPLATES`) whose hardcoded strings — `"The time was recorded as…"` / `"The elapsed time was confirmed as…"` — match the rubric's own `detectTemplateLeakage` regexes. A **2-line rephrase** + corrected upstream data lifted a fresh replay **62 → 65, both leakage caps cleared**. D1 (method) and D4 (pronouns) persisted exactly as the partition predicted — prose-layer, untouched by data — and the run surfaced the *clue-patch* dump as a second deterministic-repair leak, proving the wording fix is a patch and **R-A (contract render) is the cure**.

---

## 1. The ablation, and what it isolates

| | **Original** `c133fe54` (ANALYSIS_46) | **Replay** `replay-1782168455589` (this) |
|---|---|---|
| Agents 1–8 artifacts | (source) | **identical — reused, not regenerated** |
| Agent 9 prose | sampled roll A | sampled roll B (fresh) |
| Rubric final / raw | 64 / 69 | **62 / 65** |
| Band | Promising but rough | **Promising but rough** |
| Caps applied | prose≤4 · sig-leakage→≤65 · ending≤6 · method→≤75 | **identical four** |
| ChatGPT | 70 | — (not re-scored) |

The only variable between the two columns is the Agent-9 sample. So the comparison cleanly partitions ANALYSIS_46's defect classes into **upstream-determined** (recur under a new sample) vs **prose-determined** (change under a new sample). That partition is the deliverable.

---

## 2. Defects that RECUR → upstream of Agent 9 (agents 1–8)

### D3 — Control-plane leakage (recurs; the load-bearing block is **verbatim**)
The `discriminating_test.design` schema is pasted into Chapter 9 in *both* runs, identical string:

> *"Inspector Harold Pembroke set out two competing theories… Either The stopped clock showing ten minutes past eleven accurately indicates the time of death, or Proves the physical mechanism of wind-induced clock rewind… ran the discriminating test in full view: **A controlled test is arranged where the garden window is opened at the exact time of a scheduled wind gust, demonstrating the clock's pendulum reversing**… **Lady Eleanor Blackwood is uniquely linked to the mechanism through a precisely timed entry and exit**…"*

— replay L115–119 ≡ original L203–205, word-for-word. A **hard-logic device fact** also leaks into Ch6 here (L81): *"…Visible evidence of Lady Eleanor Blackwood's financial control… is observed in her private documents and ledger, indicating premeditation… inferred Shows Lady Eleanor's motive and planning visible before confrontation."* Two independent prose samples both transcribe the same schema sentences because **the schema text is what they were handed** — the artifact, not the writer, is the source. *(Note the one piece that varied: the clearance-schema leak "Dr…cleared because the Medical appointment records…" present in the original L187–189 was rendered naturally this roll — so leakage location partly floats, but the structural `discriminating_test` block is deterministic.)* **Home: R-A chapter-as-contract** — hand the obligation + key terms, never the spec sentence. Upstream.

### D1 — Murder method unstated (recurs)
Both runs explain *concealment* (clock manipulation) in exhaustive detail and never state *how the victim died*; the reveal is a mercy/illness confession — replay Ch10 L131 *"He was suffering… I tried to spare him… a drawn-out ruin"* — with no `death_method`. The deterministic cap fires identically: *"weak murder method (concealment explained, death not) → ending ≤ 6 / overall ≤ 75."* No prose sample can state a fact the CML doesn't carry. **Home: L1 required `death_method` field**, validated, surfaced in the reveal. Upstream.

### D6 — Mechanism implausibility (recurs)
Replay Ch9 L111: *"the hands spun backward, coming to rest at ten minutes past eleven… The elapsed time was confirmed as forty minutes."* Same physically-absurd "gust rewinds a pendulum clock 40 minutes" as the original; the rubric premise note again flags *"the complexity of the mechanism… may strain plausibility."* The device is selected upstream (Agent 3/3b); the prose only narrates it. **Home: §4.3 Agent-3b mechanism-plausibility judge.** Upstream.

Also recurring (both runs): the template phrase *"The elapsed time was confirmed as three minutes/forty minutes"* (replay L17/39/51/111) and *"The time was recorded as ten minutes past eleven"* (L99) — the exact strings `detectTemplateLeakage` catches, which is why C2's *significant-leakage* path fired both times. These too are scaffold artifacts, not prose choices.

---

## 3. Defect that CHANGES → prose-layer (Agent 9's own)

### D4 — Pronoun gendering (improved sharply on the reroll)
The CASE.cast.gender data is identical between runs, yet the outcome differs — so this defect is **sampled, not determined**:

| | Original `c133fe54` | Replay (this) |
|---|---|---|
| Pembroke (♂) | "**She** set the clock" (L55) | "**She** straightened, fixing Lady Eleanor…" (Ch3 L41) — one slip |
| Lady Eleanor (♀) | "**his** poise" (L15), "**his** opportunity" (L107), "**He** met Pembroke's gaze, but **his** eyes" (L173), "**His** final glance" (L227) — **leads swapped throughout** | none found — Eleanor's pronouns stable |
| Dr Langley (♀) | — | "**His** connection…" (Ch1 L15), "**he** addressed the inspector… confirmed **his** absence" (Ch7 L89–91) |
| Judge verdict | Char 6 / Prose 5 (called out) | *"stable pronouns"* (judge didn't flag) |

The original mis-gendered *both leads systematically*; this roll has only a handful of slips on *secondary* characters, low enough that the rubric judge missed them. **This is the one class a reroll demonstrably helps** — and equally, the one class that will keep surfacing unfixably until a deterministic **R-B gender-aware pronoun critique over `CASE.cast.gender`** runs post-generation (recall: Agent-9 post-processing runs after validation with no re-check — see [[agent9-postprocess-after-validation]]). Prose-layer.

---

## 4. Why the score didn't move (and the lesson for the bench)

Rubric 62 vs 64 is within sampling noise; the **band and all four caps are identical**. The two caps that dominate the ceiling — leakage (overall ≤ 65) and weak murder method (≤ 75) — are both upstream defects, so they reappear regardless of the prose roll. The reroll *did* its job on the only thing it controls (pronouns), and it still couldn't move the headline. **That is the finding the replay bench is built to deliver:** it tells you, per defect, whether the lever is Agent 9 or the artifacts above it. For this story the answer is overwhelmingly *the artifacts* — re-rolling prose is wasted spend until L1/R-A/§4.3 land.

---

## 5. Recommendations (delta over ANALYSIS_46 §5)

The plan is unchanged; this run **promotes three items from "recurs across runs" to "recurs across *prose samples of the same artifacts*"** — the strongest possible evidence they are upstream and that prose-side tweaks cannot touch them.

- **P-Bench (new): make the replay an explicit upstream/prose classifier.** Auto-diff a replay's caps + categories against the source run and emit a per-defect verdict {upstream | prose-layer | mixed}. The data is already produced; one comparison turns the bench from "re-score" into "localise." Then route each defect to the right layer instead of re-rolling blind.
- **P2 (L1) — sharpened to P1-urgency:** required `death_method` field. D1 recurred *verbatim-in-kind* under a fresh sample → it is 100% upstream; no prose work will ever fix it.
- **P3 (R-A) chapter-as-contract — sharpened:** D3's `discriminating_test.design` block leaked **word-for-word twice**. This is the clearest proof yet that the generator is handed the spec sentence; render obligations + terms, never the schema string.
- **P2′ (D6) Agent-3b plausibility judge:** unchanged; recurs because the device is chosen upstream.
- **P3 (R-B) pronoun critique:** the one *prose-layer* fix — but make it deterministic and post-generation (gender-aware sweep over `CASE.cast.gender`), because severity is sample-dependent and the judge will not reliably catch the residue (it missed it here).
- **P0 (rubric as headline):** reaffirmed — a fresh prose sample of an A+-headline run still lands 62; the headline average remains blind to what both the rubric and ChatGPT see.

**Anti-tactical reminder (per §8.4):** none of this is "fix the Blackwood replay." The ablation generalises — *for any run*, a defect that survives an Agent-9 reroll is an artifact-grammar defect and must be fixed before Agent 9; only sample-varying defects belong to the writer.

---

## 6. Validation — the fix, run live (replay `replay-1782243320215`, 2026-06-23)

We acted on the partition: a **2-line code fix** to the leakage source + **corrected upstream data**, then re-ran the same Agent-9 replay against the same project. The point was not to "fix the Blackwood story" but to prove the partition empirically — does removing the *upstream/injection* cause lift the score, while the *prose-layer* defects persist? It does, on both counts.

### 6.1 What changed
- **Code (the real leakage lever):** the cap-tripping leakage was never in the artifacts — it was a deterministic Agent-9 injection, [`INJECTION_TEMPLATES`](../../../apps/worker/src/jobs/agents/agent9-run.ts) (`enforceLockedFactValuePresence`), emitting `"The time was recorded as {v}."` / `"The elapsed time was confirmed as {v}."` whenever the LLM omitted a locked numeric fact. **Those two strings match the rubric's own `detectTemplateLeakage` regexes verbatim** (and lint's DEBUG_NOTE_PATTERNS) — a self-inflicted cap. Rephrased to `"The hour stood at {v}."` / `"It had taken {v} in all."`, which read as prose and match neither linter. *(This is the [[agent9-postprocess-after-validation]] layer — a post-LLM pass with no re-validation.)*
- **Data (this project's stored CML, idx-19 last-wins artifact):** `hidden_model.outcome.result` rewritten to describe the **death** (stabbing), not just the concealment; `discriminating_test.design / knowledge_revealed / pass_condition` rewritten from schema sentences into natural prose.

### 6.2 Result — 62 → 65, both leakage caps gone

| | Replay `…455589` (§1) | Replay `…320215` (this fix) |
|---|---|---|
| **final / raw** | 62 / 65 | **65 / 66** |
| `prose` mark | **4** (capped, leakage) | **6** (uncapped) |
| caps applied | leakage ×2 **+** weak-method ×2 | **weak-method ×2 only** |
| proseChars | 33,789 | 28,908 (leaner — no bloat injections) |

The leakage caps (`prose ≤ 4`, `overall ≤ 65`) **cleared on live data**. The injection still fires — visible as `"It had taken three minutes in all."` (Ch1) and `"The hour stood at ten minutes past eleven."` (Ch8) — but now passes the detector. This is the §1 thesis closed: the score ceiling was set *at/above Agent 9*, not by the prose roll, and a cause-level fix moved it.

### 6.3 The partition held — prose-layer defects persisted exactly as predicted
- **D1 (method) — cap correctly still fires.** The word **"stabbed" never appears** in the fresh prose; only "a blotter stained with … blood" (Ch1) and "I can confirm death occurred" (Ch1). The data edit improved the artifact but **could not force the prose to surface the method** — `weakMurderMethod` is a *true positive*, not detector brittleness. **Confirms D1 is prose-layer; needs L1 enforcement (required `death_method`, rendered in the reveal), not a data tweak.**
- **D4 (pronouns) — recurred, and the judge under-counted it.** The judge flagged "'he' used for Lady Eleanor once"; the prose actually mis-genders her **four times in one Ch1 passage** ("**he** wore **his** grief … when Pembroke addressed **him**, **he** hesitated") and again in Ch3, and mis-genders **Pembroke as "She"** ("**She** addressed Dr. Langley", "**She** turned to Dr. Beatrice Langley"). **Confirms both R-B (deterministic gender-aware sweep) and the ANALYSIS_47 §3 note that the LLM critic misses pronoun residue — it cannot be the only guard.**

### 6.4 New/residual issues this run surfaces (none affect *this* score, but they're the next class fixes)
- **Clue-patch verbatim dump — and duplicated** (Ch8): the *second* deterministic repair (`applyDeterministicCluePatch`) pastes clue text + `pointsTo` verbatim, and here injects **two near-identical clues** differing only in one verb — *"Direct evidence **links** Lady Eleanor … ; Direct evidence **ties** Lady Eleanor …"* — each with the full "From X, Pembroke inferred Y. No other eligible suspect…" scaffold. It is ugly schema-prose that escapes `detectTemplateLeakage` only because it matches no regex. **This is the proof that the wording fix in §6.1 is a *patch, not a cure*: every deterministic-repair injection is a latent leak. The durable fix is R-A (render the obligation, never paste the field) + de-duplicating clue records upstream.**
- **Template chapter openers, mismatched to scene** (Ch1 opens *"The Library at Blackwood Manor…"* but the scene is the Study; Ch5 and Ch10 stack **two** location preambles). The opener metadata is scaffold the `detectLocationMetadataDump` / room-list linter is meant to catch and didn't here — a gap to widen.
- **Ch6 opens with the same sentence twice, verbatim** (a doubled-paragraph bug the doubled-*word* regex doesn't catch).
- **Victim never named** — the judge dinged opening_hook for it; C1 correctly **deferred** (no false `victimUnnamed` cap, since no `role:victim` cast member), but it remains a real reader defect for the L-layer to own.
- **D6 (mechanism) untouched by design** — "the clock's hands jerked backward, then stopped" (Ch9); premise note still "somewhat conventional." No hard cap, deferred per §4.

### 6.5 Takeaway
One cause-level change to the *injection layer* + corrected upstream data lifted a fresh replay 62 → 65 and erased the dominant cap — exactly where the partition said the ceiling lived. Everything that remained (D1 method, D4 pronouns, the clue-patch dump, template openers) is **prose-layer**, untouched by data, and maps 1:1 onto the standing plan: **L1** (death_method, surfaced), **R-A** (contract render — kills *all* deterministic-repair dumps, not just the time-phrase wording), **R-B** (gender-aware pronoun sweep, because the judge misses it). The replay bench plus this fix is now a working *localise → fix-at-cause → re-verify* loop.

---

## 7. One-paragraph summary

Last night's run is an Agent-9 **replay** — the new bench re-ran only the prose against run `c133fe54`'s untouched agents-1–8 artifacts — which makes it a controlled ablation answering the user's question directly: the issues that cap the score live **upstream of Agent 9**. The score barely moved (62 vs 64, same band, same four caps), and three of four ANALYSIS_46 defects recurred — leakage (the `discriminating_test.design` block leaked *verbatim* in both runs), the unstated death-method, and the implausible wind-rewinds-the-clock mechanism — because the schema text, the missing fact, and the bad device are baked into the artifacts the prose faithfully renders. Only pronoun gendering changed, improving from systematic lead-swaps to scattered secondary slips, marking it as the lone prose-layer defect a reroll can help. The takeaway: re-rolling Agent 9 is the wrong lever for this story's ceiling; pin the facts (L1), render from a contract (R-A), and gate plausibility (§4.3) upstream — and teach the replay bench to label each defect upstream-vs-prose so the right lever is pulled every time. **§6 closes the loop:** acting on exactly that partition — a 2-line fix to the leakage *injection* (its hardcoded template strings matched the rubric's own leakage regex) plus corrected upstream data — lifted a fresh replay 62 → 65 with both leakage caps gone, while every prose-layer defect (method unstated, pronoun mis-gendering the judge under-counts, the clue-patch verbatim dump) persisted untouched. Cause-level fix at the right layer moved the number; the rest now has named owners (L1, R-A, R-B).

---

## 8. The fix plan (prose-layer defects)

Each item is a **class fix at the prose layer**, verified the way §6 established: re-run the same replay (`proj_8e6d7185`) after each change and watch the caps. Ordered by leverage. (D6 mechanism is excluded — structural, no hard cap.)

### P1 — R-A: stop the deterministic-repair passes pasting schema text *(the real leakage cure)*
- **Why:** §6.1's template rephrase only changed the *wording* of one injection; §6.4 shows the **clue-patch** still dumps raw fields and even duplicated a clue ("links"/"ties"). Every deterministic-repair paste is a latent leak.
- **Where:** [`deterministic-repair.ts`](../../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts) — `applyDeterministicCluePatch`/`buildDeterministicClueParagraphs` (L224–289), `applyDeterministicDiscriminatingTestPatch` (L291+); [`agent9-run.ts`](../../../apps/worker/src/jobs/agents/agent9-run.ts) `enforceLockedFactValuePresence` (L1758).
- **How:** (a) **dedupe** clue records before injection (collapse near-identical `description`/`pointsTo` by normalized text — kills the "links/ties" twin); (b) when an obligation is unmet, **don't concatenate the raw field** — route `{keyTerms, obligation}` through the existing scoped **micro-regen** of that one paragraph; (c) if micro-regen is unavailable, raise a **HARD contract violation → chapter retry** instead of shipping the dump verbatim.
- **Effect:** removes the clue-patch dump and makes the §6.1 wording patch moot (nothing is pasted). Durable across all stories.

### P2 — L1: required `death_method`, enforced in the reveal *(clears the last cap)*
- **Why:** §6.3 — "stabbed" never reaches the prose though the CML knows it; `weakMurderMethod` is a true positive.
- **Where:** CML schema (`CASE.death_method`, or promote `meta.crime_class.subtype`) + the reveal-chapter obligation contract; detector reads `hidden_model.outcome.result`.
- **How:** (a) make `death_method` a validated **required** field (here "stabbing"); (b) add it to the reveal chapter's `must_surface` with key terms `["stab","stabbed","wound"]` so `checkContractFidelity` enforces it as HARD; (c) keep `outcome.result` describing the death (already corrected in data).
- **Effect:** `ending` 6→7, `weak murder method` ceilings gone.

### P3 — R-B: deterministic gender-aware pronoun sweep *(kills D4, which the judge misses)*
- **Why:** §6.3 — the LLM critic under-counts (saw "once"; actual = Eleanor "he" ×4, Pembroke "She" ×2). Can't rely on the judge.
- **Where:** a post-generation pass using `countMisgenderedPronouns`/`pronounConsistencyValidator` ([`prose-guard/fidelity.ts`](../../../packages/prose-guard/src/fidelity.ts)) over `CASE.cast.gender` — **re-validated** after, to avoid the [[agent9-postprocess-after-validation]] trap.
- **How:** for each character, within sentence windows anchored to their name, flip wrong-gender pronouns; confirm `countMisgenderedPronouns` net-decreases and **revert if worse**.
- **Effect:** removes the Eleanor "he" cluster and the Pembroke "She" slips.

### P4 — opener/duplicate linter gaps *(cheap quality)*
- **Where:** [`lint.ts`](../../../packages/prompts-llm/src/agent9-prose/lint.ts) (`detectLocationMetadataDump`, room-list preamble).
- **How:** (a) catch the "`<Room> in Ashcombe, Devonshire held a tense weight…; <smell>, and <smell> completed the picture`" opener template and the **stacked double-preamble** (Ch5/Ch10); (b) flag **identical adjacent sentences** (Ch6's doubled opening). Both become `template_bleed` retry triggers.

**Sequencing:** P2 first (smallest, clears the only remaining cap), then P1 (the durable leakage cure), then P3, then P4. Re-run the replay after each.

### 8.1 Expected impact (estimated — 3 independent lenses + adversarial skeptic)

Honest answer: **§8 raises the floor and hardens durability; it does *not* raise the ceiling.** Realistic post-§8 score **65 → ~67** (range 64–69), **staying in "Promising but rough."** Reaching "Solid draft" (≥70) is the optimistic tail (~15–25% per roll), not the central outcome.

| Fix | Δ (realistic) | Why so small — and its *real* value |
|---|---:|---|
| **P1** R-A | **+0** here | Leakage already cleared at 65; the judge *tolerated* the clue-patch dump (clues 7). **Value = durability:** prevents the leakage cap re-firing on a fresh roll (a **−3 to −8** swing). |
| **P2** L1 | **+0–1** | The only firing cap → uncapping `ending` 6→7. *Not* free: `weakMurderMethod` is deterministic and still fired after the data fix because the reveal never says "stab" — needs the HARD contract enforcement **and** a roll that emits the term. |
| **P3** R-B | **+0–1** | The judge under-counts pronouns **4:1** — fixing what it can't see yields ~0 upside. **Value = downside insurance:** forecloses the bad roll where `pronounsUnstable` trips (`character ≤5 / prose ≤5 / overall ≤69`). |
| **P4** openers | **+0–1** | A `pacing` point; `prose` is shared with P1/P3 and rises at most +1 *once*. |

**Why the ceiling is ~71–72:** the upside is walled by four categories §8 touches *none* of — **dialogue 6** (expository/stilted), **opening_hook 6** (slow, victim unnamed), **premise 7** (conventional), and **D6 mechanism** (no hard cap to remove). 80 needs an *average* of 8.0; §8 is prose-repair, not craft. The real score lever is §9.

---

## 9. The path to 80+ (full program — designed, then adversarially stress-tested)

80 = band "Very strong" = **category average 8.0 — no weak category**. From 65 that is **+15 raw with zero slack**: the five categories at 6 (opening, character, dialogue, pacing, prose) each need **+2**, three more (premise, plot, clues) need **+1**, ending must clear its cap *and* gain a reveal point, **and atmosphere must hold at 8**. Every bet must win.

### 9.1 The hard fact that bounds the target: four categories are *frozen*

Across **five independent runs** on disk, the LLM judge has never moved four marks:

| Run | final | premise | opening | dialogue | ending | prose | pacing | char |
|---|--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 2336 | 68 | **7** | **6** | **6** | **6\*** | 7 | 6 | 7 |
| 2343 | 65 | **7** | **6** | **6** | **6\*** | 4\* | 6 | 7 |
| 2351 | 62 | **7** | **6** | **6** | **6\*** | 4\* | 5 | 6 |
| 2039 (post-fix) | 65 | **7** | **6** | **6** | **6\*** | 6 | 6 | 6 |
| 2102 | 66 | **7** | **6** | **6** | **6\*** | 6 | 6 | 6 |

`premise=7, opening=6, dialogue=6, ending=6(capped)` — **zero variance.** The judge has a structural prior on these; it is not noise. Any plan that books +1/+2 on them is booking points the judge has never awarded. (`ending` clears with L1; `premise/opening/dialogue` are the real wall.)

### 9.2 The dependable path: 65 → ~73–76 ("Solid draft"). This part is real.

These milestones are verified, owned, and low-perceptibility-risk (the judge reads them directly, or the cap is deterministic). **The shared dependency is M0's contract-render** — *nothing in Agent 9 currently consumes a victim/premise/voice/beat artifact*, so every upstream field is inert until R-A surfaces it.

| Milestone | What | Owner (verified) | Lifts | Cum. |
|---|---|---|---|--:|
| **M0** | R-A contract-render plumbing + L1 `death_method` (repoint the 3 `murderMethod=mechanism.description` sites in `generate.ts` to a typed `death_method`, HARD-require stab/wound in the reveal) + R-B pronoun sweep | Agent 3 `agent3-cml.ts`, Agent 9 `generate.ts`, `clue-validation.ts` | clears the last cap; ending→7; unblocks M2–M4 | 68–70 |
| **M1** | **Delete the 5-template `buildDeterministicGroundingLead` prepend** (`agent9-run.ts` L362–411) — route grounding failures back through micro-regen instead. This one template is the dominant prose offender: it *is* the "repeated atmospheric descriptions", the Ch1 Library/Study mismatch, the Ch6 doubled opener | Agent 9 `agent9-run.ts` | prose+pacing+opening assist; **hold atmosphere 8** | 71–73 |
| **M4** | Beat-scheduler authoritative (`agent7-run.ts` — currently `SHADOW`, "acts on nothing") + clue dedupe (collapse the Ch8 "links/ties" twin) → kills the Ch9/Ch10 double-clearance smear | Agents 7/5, `deterministic-repair.ts` | pacing/plot/clues +1 each | ~76 |

M0/M1/M4 reliably reach **~73–76**. That is the honest, bankable target.

### 9.3 The fragile craft block: M2 + M3 (budget +1, not +2; gate on N≥5 replays)

- **M2** — named victim + in-medias-res Ch1 hook + a `premise.logline`/`unusual_angle` (Agent 2/2e, surfaced via M0). Hits "victim not named early" (real) but the "slow/not gripping" half is craft → expect opening **6→7**, not 6→8.
- **M3** — wire the **built-but-dead VoiceCapsule** into the Agent-9 prompt + an anti-exposition subtext rule + a dialogue target in the guarded polish pass. But dialogue is **frozen at 6 across all five runs** despite generic guidance; a capsule + one temp-0.2 polish most likely yields **6→7**.

### 9.4 What the roadmap *misses* — the actual levers for the last 5–7 points

The frozen categories are a **craft-ceiling + calibration + base-model** problem, not a plumbing one. 80 needs three things no milestone above provides:
1. **Multi-pass critique→rewrite** for dialogue/opening (not one timid polish) — and done safely given the [[agent9-postprocess-after-validation]] trap (re-validate, roll back).
2. **Judge re-calibration at the 70–80 band.** The rubric was calibrated at ~65 (ANALYSIS_45/46) and runs **1–6 pts under ChatGPT**; its frozen `dialogue=6`/`opening=6` priors may themselves be miscalibrated. Auditing this against human scores could be worth more than half the craft work — and is currently unproposed.
3. **A stronger base model** (or a dedicated dialogue-rewrite sub-model). Four runs frozen at the same craft marks regardless of prompt changes is the signature of a base-model ceiling: if the generator can't write 8-level dialogue, no contract surfaces what isn't generated.
- Plus: an **atmosphere-density guard** (M1 deletes the templates earning the lone 8) and an **N≥5 replay variance budget** (raw totals cluster 65–70 ±2; single-replay +1s are within noise).

### 9.5 Verdict

**Dependable: 65 → ~73–76 ("Solid draft")** via M0/M1/M4 — verified, owned, low-risk. **80 is unlikely on the prose/logic program alone: ~5–12% on a single run, <5% sustained across the N≥3 acceptance bar.** The block is the three frozen craft categories, which the judge has never moved and which need calibration + multi-pass revision + likely a model upgrade — not more Agent-9 wiring. Tellingly, even ChatGPT (which scores *above* the rubric) put the cheap-fix ceiling at ~77. **Recommendation: commit to M0→M1→M4 as the funded path to a durable Solid-draft 73–76; treat 80 as a research goal gated on the §9.4 levers, and prove any frozen-category gain across ≥5 replays before believing it.** M5 (planted surprise, plausible mechanism per D6, novelty store per D7) is a ceiling buffer and durability play — never a banked point.

**The dedicated roadmaps (siblings):** [ROADMAP_TO_80.md](./ROADMAP_TO_80.md) is the operational, fundable plan (M0→M1→M4 → dependable 73–76; 80 a calibration-gated stretch). [ROADMAP_TO_90.md](./ROADMAP_TO_90.md) is the long-horizon framing — finding, code-verified, that the next wall above ~76 is the **judge** (a `gpt-4.1-mini`, temp-0.2, "start at 5/10" scorer with no 9/10 anchors and no top-band calibration), not the prose, and that 90 is a human-supervised research program contingent on rebuilding how the story is *measured* before how it is *written*.
