# PRE-REGISTRATION — the root-cause run · written BEFORE spending

**Written:** 2026-08-31, before launch. Nothing below is edited after the result is known; the
outcome is appended as a separate section.

**Why this exists:** four separate times on 2026-08-29 a "the flag is broken" finding turned out to
be the harness, and twice a hypothesis I had already built on died when finally tested. Predictions
written afterwards are worthless.

---

## 1. What is being tested

The A_76 §14 root cause: **we ordered the suspect roll-call in ch8, ch9 AND ch10 and regenerated any
chapter that omitted it.** Fixed by resolving clearance ownership once per book, with the final
chapter structurally ineligible.

Plus §15's two ride-alongs — the clearance budget that counted the victim and detective as suspects
(5 instead of 3), and the validator that demanded the murder victim be cleared.

## 2. Flags

```
ON   AGENT9_CLEARANCE_OWNERSHIP        the root-cause fix — one owner, never the finale
ON   STORY_GEOMETRY_ROLE_FIELD_FIX     budget 5 -> 3, so clearance_over_budget can finally bind
ON   AGENT9_AFTERMATH_GROUNDING        verified firing in two prior runs
ON   AGENT9_LENGTH_COUNTERPRESSURE     verified firing in two prior runs
ON   AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT  two no-ops fixed 08-29; never yet fired
ON   AGENT9_REGEN_CONVERGENCE_STOP     retries drive abstraction (+2.43 pts, t=2.97)
ON   AGENT9_CLEARANCE_TRIM             regated, detective-safe, budget defaulted
ON   AGENT9_RECAP_STRIP_INJECTED       now sees the 39%/35% injections

OFF  AGENT9_VOICE_SPEC                 falsified — asked 22.0, delivered 15.86, 0/10 chapters
OFF  AGENT9_CROSS_CHAPTER_ECHO         ~6 extra retries/book on the axis that predicts the headline
```

Unconditional and already live: the victim exclusion in the closure validator, the abstract-subject
craft operation, the opening-style fix, the aftermath prohibitions.

## 3. PREDICTIONS — committed in advance

| # | prediction | baseline | confidence |
|---|---|---|---|
| 1 | The ch10 prompt contains NO `SUSPECT CLEARANCE REQUIRED` | present in ch8+ch9+ch10 on the last run | **near-certain** — mechanical, already verified offline |
| 2 | The lint gate arms 0 suspects on ch10 | armed 3 | **near-certain** — same |
| 3 | Clearance sentences in the FINAL chapter ≤ 2 | 5 on the complained-about book; corpus median 2–3 | **medium** — the mandate is gone but genre habit may persist |
| 4 | The final chapter title contains none of reveal/revelation/culprit/killer/exposed/accused | "The Culprit Revealed" | **medium** — prompt prohibition, never yet exercised |
| 5 | Suspects given clearance treatment in BOTH final chapters ≤ 2 | 4 | **medium** |
| 6 | Register rate between 8% and 11.5% | 7.38% last run, 11.05% before, corpus mean 14.6% | **low** — run-to-run SD is 3.47, this is a range not a prediction |
| 7 | No new hard-stop from the changed validators | 0 expected | **high** — the victim fix only removes a demand |

**What would count as failure:** 1 or 2 false (the fix did not reach the run), or 3 and 5 unchanged
while 1 and 2 hold (the mandate was not the cause after all — which would be the most interesting
result available, since it falsifies the root cause).

**What I am NOT predicting:** the headline. A single read is ±3 marks and the last one scored 82; any
number from 79 to 85 is consistent with no change at all. The register is a range, not a claim.

## 4. Measurement plan, fixed now

```
node scripts/check-ending-repetition.mjs <manuscript> --cast "<cast>"   predictions 3,4,5
node scripts/verify-flag-firing-in-run.mjs <storyDir>                   flags actually fired
node scripts/retries-vs-abstraction.mjs                                 retry counts
prompt-log grep for SUSPECT CLEARANCE REQUIRED by chapter                predictions 1,2
machineRegisterRate over the manuscript                                  prediction 6
```

The external read is the only thing that speaks to the score, and it is the owner's to give.
