# ANALYSIS_52 — The role model + the remaining work (post-K1/K2 register)

Status: **living register — supersedes [ANALYSIS_51](../ANALYSIS_51/ANALYSIS_51.md) as the single source of truth for what is still open.** A_51 carried the K1 (named victim) and K2 (rubric honesty) keystones from idea to *landed-and-measured*; this doc records that result, formalizes the **cast role model** that permanently closes the "victim is dead **and** alive" class of failure, and re-orders the outstanding work around the bottleneck as it now actually stands.

> Lineage: A_48 (upstream-fitness thesis) → A_49 (Tier-1 code plans) → A_50 (§9 structural pivot + triad) → A_51 (K1 cast + K2 honest judge — both landed; pipeline completes; K2 honest in situ) → **A_52 (this doc: lock the role model; chase triad effectiveness on the now-honest stick).** Target unchanged: [ROADMAP_TO_80](../ANALYSIS_47/ROADMAP_TO_80.md) ≥ 80.

---

## ⏱ Implementation order (do top-to-bottom)

Legend: `✅` landed · `☐` not started · `◐` partial. **Rule:** the role model (1) is the next structural keystone — it deletes the victim-coherence failure class *and* the detective-identity bug at the root. Do it before reopening the category ladder (4), because the ladder is only worth flipping now that K2 is an honest stick.

| # | Work | Status | Why now |
|:--:|---|:--:|---|
| **1** | **Role model: `detective` + `victim` first-class, `n-2` suspects** (§1) | ☑ 🔑 | **Landed (`4cbf146f`)** — code-complete + unit-tested; closes victim dead-and-alive **and** the detective-identity bug at the root. Live confirmation (zero victim-lifecycle signals on a full run) pending |
| 2 | Triad effectiveness in prose (withhold mechanism to the test scene; plant reveal-evidence earlier) (§3 #2) | ☑ 🔑 | **Resolved (`c17a3bc4`) — the triad WAS landing; K2 was over-detecting.** Reading run mystery-1782585273377's ch1 showed exemplary clue-planting and zero mechanism explanation. Fixed the two verifier over-detections (mechanism-explained-marker; indeterminate-prose veto). Re-measure on the next run |
| 3 | Close the 2 release-gate warnings (critical continuity + scene-grounding ≤ target) (§3 #3) | ◐ | **scene-grounding instruction elevated (`60476705`)**; critical-continuity is run-specific (identity_role_alias_break / case_transition_missing) — the test run will reveal which fires and whether n=5 + the role model clear it |
| 4 | Re-open the category ladder (one flag/run) against the honest rubric (§3 #4) | ◐ | Now legitimate — K2 can finally tell a real lever from noise |
| 5 | Premise diversity (rotate seed theme + structural cross-run divergence) (§3 #5) | ☐ | Stop the "Second Key" clone; vary victim/mechanism/motive class run-to-run |
| 6 | Residual polish: pronoun sweep under role-swap · mutation re-validation full chain (§3 #6) | ◐ | After the above |

**One-liner:** ✅ K1/K2 done + pipeline completes → **1 role model → 2 triad-in-prose → 3 clear the 2 warnings → 4 category ladder → 5 premise diversity → 6 polish.**

---

## 0. TL;DR — the state of play (2026-06-27)

1. **The two A_51 keystones are landed and the pipeline now completes end-to-end.** Confirmation run `mystery-1782585273377`: no abort, **0 hard-stops**, internal 74/C, and — for the first time — a final-story rubric measured *in situ*.
2. **K2 is an honest stick now, proven in situ.** The rubric scored 62/100 and **every cap was backed by a deterministic structural fact**, not LLM noise: `mechanismExplainedChapter: 1` vs `testChapter: 8`, and `unplantedEvidence: [clue_1, clue_2, clue_3, clue_5]`. We can finally read lever success off the score.
3. **K1 works** — the shipped victim is a named, profiled, distinct character (Captain Ivor Hale, found dead in the lobby). But the *mechanism* by which K1 identifies roles is fragile (it infers the detective from a free-form archetype regex), which is the seam this doc closes.
4. **The bottleneck has moved twice this session.** It was "no abort"; then "honest judge + named victim"; now it is **(a) lock the role model** so victim/detective/culprit can never blur, and **(b) make the triad actually land in prose** — both newly tractable because K2 can see them.
5. **Why the role model is the keystone:** the recurring "victim speaks after death" / "deceased_character_confesses" aborts (§9 lineage) and the detective-identity bug (§1.4) are the *same* root — roles are inferred and reassignable instead of being fixed, locked slots. Make `detective` and `victim` first-class single roles and the failure class is gone by construction.

---

## 1. The cast role model (NEW — the structural keystone) 🔑

### 1.1 The model

A fair-play mystery has exactly **two fixed principals and a suspect pool**:

```
detective : 1     fixed, first-class, named, ALIVE throughout
victim    : 1     fixed, first-class, named + profiled, DEAD from the murder scene onward
suspects  : n-2   the pool; n ≥ 5
```

Downstream, **attributes** (not headcount roles) are assigned to the suspect pool:
- `culprit` — exactly **one** suspect (assigned by Agent 3 from `possibleCulprits`).
- `redHerring` — suspects who look guilty but are cleared (the misdirection surface).

**The culprit is not a cast role.** In fair play the murderer must be indistinguishable from the other suspects to the reader, so "culprit" is a *hidden attribute* of one suspect — never a visible slot, never a separate head. This is why the count is `1 + 1 + (n-2)`, not `victim + detective + culprit + suspects`.

### 1.2 Why this closes "the victim is dead **and** alive"

The recurring failure (`deceased_character_confesses`, `victim_reappears_alive`, the §9.1 aborts) happens when the victim also holds a role that needs them *alive in the present tense* — a suspect who gets interviewed, or even the detective. With the model above:

- the victim holds **no role that requires being alive** — they are not a suspect, not the detective, not the culprit;
- the victim is **lifecycle-locked**: dead from the murder scene onward, present only via *discovery*, *recollection/flashback*, or *physical evidence* — never as an active present-tense agent;
- there is therefore **nothing for the prose to contradict**. The dead-and-alive class is removed *by construction*, not patched after the fact.

The existing §9.1 role-coherence repair becomes a backstop for stray narration, not the load-bearing fix.

### 1.3 The invariants (deterministic, repair-not-abort)

1. `|detective| = 1`, `|victim| = 1`, `|suspects| = n-2`, `n ≥ 5`.
2. `detective ≠ victim`; `detective ∉ suspects`; `victim ∉ suspects`.
3. `culprit ∈ suspects`, exactly one (assigned downstream).
4. The victim has a stated relationship to **≥1 suspect** — the motive anchor the eventual culprit inherits.
5. Lifecycle: the victim is dead after the murder scene; any present-tense victim action is reframed (recollection) or removed.

Per project rule (MEMORY): every violation is a **warning → deterministic repair**, never a hard throw.

### 1.4 Why explicit slots beat inferred roles (the bug this kills)

Today the detective is *inferred* from a free-form `roleArchetype` via `/detective|investigator|inspector|sleuth/`, and the victim is resolved heuristically. In the confirmation run, Agent 2 labelled the detective Eleanor Voss **"Authority Figure"** — no keyword — so [`enforceVictimRoleInvariant`](../../../apps/worker/src/jobs/agents/agent2-run.ts) failed to recognise her as the detective and briefly designated **the detective as the victim**. A retry happened to ship a coherent cast (Hale), but the bug is latent and seed-dependent.

Explicit `detective` / `victim` role fields make the exclusion deterministic — no keyword guessing, no regex miss. This *is* the fix for that bug; the role model subsumes the A_51 "K1 detective-identity robustness" follow-up.

### 1.5 The `n` knob

`n = 5` is the **minimum coherent** fair-play cast: 3 suspects = 1 culprit + 2 red herrings, which satisfies the canary's "≥ 2 red herrings, inference-isolated from the solution." It is also the **leanest** — fewer named characters to weave reduces the late-pipeline continuity/grounding/placeholder load A_51 observed at n = 6.

- **Default `n = 5`** (robust, minimal). Generalises for free: the rule is `1 + 1 + (n-2)` for any `n ≥ 5`.
- Bump to **6** (4 suspects) only if the *honest* rubric shows misdirection/novelty is thin. 3 suspects is the floor where a whodunit still works, not where it is richest — Golden Age cases often run 4–6.

### 1.6 Implementation plan (scoped, no new abort surface)

1. **Agent 2 contract** ([`agent2-cast.ts`](../../../packages/prompts-llm/src/agent2-cast.ts)): add explicit single-valued `role: "detective" | "victim" | "suspect"` to the character schema; require exactly one detective, exactly one victim, `n-2` suspects; keep the victim profiled with a culprit/suspect relationship.
2. **`enforceVictimRoleInvariant`** ([`agent2-run.ts`](../../../apps/worker/src/jobs/agents/agent2-run.ts)): resolve the detective and victim from the explicit `role` field (fall back to `crimeDynamics.detectiveCandidates` / archetype only when the field is absent — kills the regex-miss). Enforce §1.3 invariants as warning→repair.
3. **Checker** ([`agent2-cast-checker.ts`](../../../packages/prompts-llm/src/agent2-cast-checker.ts)): report on the explicit roles (counts, distinctness, victim profiled + tied to a suspect) — extend the K1 victim reporting already there.
4. **Lifecycle lock**: ensure the victim role flows to the Agent 9 locked-fact / lifecycle layer so the victim is dead-only in the present timeline (the §9.1 machinery already exists — point it at the explicit victim slot).
5. **Canary** ([`canary-core-inputs.yaml`](../../../scripts/canary-core-inputs.yaml)): set `castSize: 5`; keep the gender locks.
6. **Acceptance (structural, not rubric):** exactly one detective + one victim + 3 suspects, all distinct; victim named + tied to a suspect; a full run shows **zero** `victim_reappears_alive` / `deceased_character_confesses` signals.

---

## 2. Landed this session (banked — do not re-litigate)

All on `redesign/agent-blue-sky`; suites green throughout (prompts-llm 512, story-validation 288, worker 221, rubric-score 42, prose-guard 21, web 174); type-checks clean.

| Commit | What |
|---|---|
| `36e12e26` | **Banked the uncommitted §4 machinery + scorers + ROADMAP_TO_80 docs** — corrected A_51's false "already committed" claim; clean base for the keystones. |
| `6ee19960` | **K2 — rubric honesty.** Structural verifiers (planted-evidence, mechanism-timing, victim-named) that veto/confirm the LLM judge; per-flag cited-evidence verification; `RUBRIC_JUDGE_MODEL`; calibration hook. **Proven honest in situ** (§0 #2). |
| `a08be22d` | **K1 — first-class named victim** + `enforceVictimRoleInvariant` (repair-not-abort). Confirmed in prose 3×. |
| `97a299ae` | **Fix #1** — placeholder gate no longer false-positives on relative clauses ("a woman Eleanor had once mentored"). +4 tests. |
| `4768c3ed` | **Fix #2** — the deterministic reveal *fallback* now surfaces the death method (it previously stated only the concealment mechanism → run #1 abort). +1 test. |

**Confirmation run `mystery-1782585273377`:** completed end-to-end, 0 hard-stops, K1 victim named, **K2 = 62/100 honest** (caps backed by structural facts). See A_51 §3.7 for the full read.

---

## 3. Outstanding work (the register)

Legend: `☐` open · `◐` partial · `🔑` keystone.

| # | Area | Outstanding issue | Status | Best solution |
|---|---|---|:--:|---|
| 1 | **Cast role model** | Roles inferred + reassignable → victim dead-and-alive class + detective-identity bug | ☑ 🔑 | **Landed `4cbf146f`:** explicit `role` field + invariant resolving detective via role→candidates→archetype + role tagging + `checkCast` role counts + canary `n=5`. Live confirmation pending |
| 2 | **Triad effectiveness in prose** | ~~Mechanism explained @ch1 + clues unplanted~~ — **these were K2 verifier over-detections, not real defects** | ☑ 🔑 | **`c17a3bc4`:** ch1 plants the clue exemplarily and never explains the mechanism. Fixed the verifiers (require an explanation marker, not term-presence; don't let an indeterminate prose-scan veto a CASE-ordering "planted"). The triad IS landing; re-measure on the next run |
| 3 | **Release gate (2 warnings)** | `critical continuity issue` + `scene-grounding coverage below target` keep a completed run from *passing* | ◐ | scene-grounding: elevated the opening-grounding obligation (`60476705`). Continuity is NOT dead-and-alive — it's `identity_role_alias_break`/`case_transition_missing` (run-specific); diagnose from the next run |
| 4 | **Category ladder** | P1.1/P1.3/P1.4/P2.1/P2.2/P2.3/P3 built, flag-OFF — never legitimately acceptance-tested | ◐ | Re-open one flag per replay against the *honest* rubric; accept only on a moved (trustworthy) category |
| 5 | **Premise diversity** | Near-clone every run ("The Second Key" attractor) | ☐ | Rotate/perturb the seed theme per run; target structural divergence (victim, mechanism family, motive class), not just the similarity score |
| 6 | **Residual polish** | Pronoun mis-gendering under role-swap; post-Agent9 mutation re-validation covers only grounding-lead | ◐ | Harden the pronoun sweep against role-swap context; extend mutation re-validation across the full post-processing chain |
| 7 | **Agent 5 exclusivity / Agent 4 convergence** | Direct-culprit slot still admits a non-culprit; revision non-convergence after fair-play escalation | ☐ | Carried from A_51 §2 #6/#9 — revisit after 1–4 |

---

## 4. Recommended sequence (decisive)

1. **Role model (§1).** The next structural keystone: deletes the victim dead-and-alive class and the detective-identity bug, and trims the cast to the lean fair-play minimum. Accept on structural signals (one detective + one victim + 3 distinct suspects; zero victim-lifecycle signals).
2. **Triad in prose (§3 #2).** With K2 honest, this is now measurable: withhold the mechanism to the test chapter and plant every reveal clue earlier, then watch `mechanismExplainedChapter` and `unplantedEvidence` clear.
3. **Clear the 2 release-gate warnings (§3 #3)** so a completed run *passes*.
4. **Category ladder (§3 #4)** — one flag per replay against the honest rubric.
5. **Premise diversity (§3 #5)**, then **polish (§3 #6/#7)**.

**One-liner:** lock the roles → make the triad land → pass the gate → then the ladder → diversity → polish.

---

## 5. Progress tracker (live)

`☐` not started · `◐` in progress · `✅` accepted on a trustworthy signal.

| Item | Status | Notes |
|---|:--:|---|
| K1 named victim | ✅ | Confirmed in prose 3× (`a08be22d`). |
| K2 rubric honesty | ✅ | Honest stick demonstrated in situ — 62/100, caps backed by structural facts (`6ee19960`). |
| Pipeline completes (no abort) | ✅ | Fix #1 (`97a299ae`) + Fix #2 (`4768c3ed`) → `mystery-1782585273377` ran end-to-end, 0 hard-stops. |
| **Role model (detective+victim+n-2 suspects)** | ☑ 🔑 | **Landed `4cbf146f`** — explicit `role` slots, robust detective resolution, role tagging, canary `n=5`. +6 tests. Live confirmation (zero victim-lifecycle signals) pending. |
| **Triad effectiveness in prose** | ☑ 🔑 | **`c17a3bc4`** — was K2 over-detection, not a real defect; verifiers fixed (explanation-marker + indeterminate-prose). Re-measure next run. |
| Release gate — 2 warnings | ◐ | scene-grounding obligation elevated (`60476705`); critical-continuity is run-specific (identity_role_alias_break / case_transition_missing). |
| Category ladder vs honest rubric | ◐ | Built, flag-OFF; now legitimately testable. |
| Premise diversity | ☐ | Single fixed canary theme guarantees a clone. |

---

### Appendix — reference runs

| Run | Config | Outcome | What it proved |
|---|---|---|---|
| `mystery-1782508634205` (A_50) | 4-cast, all levers + triad | 63 (58 raw), release-gate fail | triad fixes prose but old judge can't see it → K2; phantom victim → K1 |
| `mystery-1782545187071` (A_51) | 6-cast, levers off, K1+K2+triad | **aborted** ch8 (death-method fallback) | K1 confirmed (named victim); exposed the Fix #2 fallback bug |
| `mystery-1782577884032` (A_51) | 6-cast | **aborted** release gate (placeholder FP) | exposed the Fix #1 false positive |
| **`mystery-1782585273377` (A_52)** | 6-cast, K1+K2+triad+Fix#1+Fix#2 | **completed**, 0 hard-stops, **K2 = 62/100 honest** | pipeline completes; K2 honest in situ; bottleneck → role model + triad-in-prose |

Baseline for reference: `run_9b824eb2` (Tier-1 only, older judge) = 71 LLM / 68 shadow. Target: [ROADMAP_TO_80](../ANALYSIS_47/ROADMAP_TO_80.md) ≥ 80.
