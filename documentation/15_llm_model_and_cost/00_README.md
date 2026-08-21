# 15 — Claude as a provider for Agent 9: feasibility, blockers, and costing

**Written:** 2026-07-31 · **Trigger:** owner's question — *"is it possible to hook up the actual claude agent for use in agent 9, instead of a raw LLM. What are the costs?"*, then *"how much extra for a final Sonnet 5 pass, per chapter or whole story?"* · **Regime:** corpus era (A_63 §2.8) — behaviour levers ship flag-gated default-OFF, probed before promotion.

**Type:** a COSTING + FEASIBILITY note. Nothing here is scheduled and nothing has been built. It exists so the decision is made against measured numbers rather than intuition.

**Method note, load-bearing:** every claim is marked **MEASURED** (I ran the check and the command is quoted), **INFERRED** (follows from code reading or vendor docs, not observed on a run), or **UNVERIFIED** (a number I could not check from inside this repo). The single most consequential number in §4 — what a run actually costs today — is one the pipeline's own telemetry reports **~6× too low**, so the marking is the point.

---

## 1. "The actual Claude agent" is three different products

The phrase covers three things that differ in *who supplies the agent loop* and *who hosts it*. Only one is a drop-in.

| | What it is | Package / surface | Fit for Agent 9 |
|---|---|---|---|
| **1. Claude Messages API** | A chat-completion endpoint. Swap the provider inside the existing client. | `@anthropic-ai/sdk` | **Drop-in.** One adapter in `packages/llm-client`. Agent 9's harness is untouched. |
| **2. Claude Agent SDK** | Claude Code packaged as a library: agent loop, built-in Read/Write/Edit/Bash/Grep, subagents, hooks, permissions. You still host and deploy it. | `@anthropic-ai/claude-agent-sdk` | **Replaces our harness, not our prompt.** |
| **3. Managed Agents** | Anthropic runs the loop *and* hosts a per-session sandbox container. | `client.beta.agents` / `sessions` | **Poor fit** — our validators are local TypeScript in this monorepo, not sandbox-resident. |

**INFERRED — the observation that should drive the choice.** Agent 9 already *is* an agent harness. [agent9-run.ts](../../apps/worker/src/jobs/agents/agent9-run.ts) is 7,064 lines of exactly what an agent SDK supplies: seven prose paths, ~15 regen classes, per-chapter validators, checkpointing, retry budgets, rollback. Option 2 does not add capability; it swaps whose loop we debug, and discards the harness hardened across A_61–A_68.

What option 2 *would* buy is different in kind: exposing `composeChapterValidator` as a **tool** so the model self-checks before returning, instead of us catching the failure and firing a `runRegenRepair` round-trip. That is a real idea, but it is a harness rewrite priced against an unmeasured benefit — see §9.

---

## 2. The current call path

**MEASURED.** All pipeline LLM traffic goes through `LLMClient.chat()` at [client.ts:114](../../packages/llm-client/src/client.ts#L114), which wraps a single-attempt `chatOnce()` in `withRetry`. `chatOnce` calls Azure's `getChatCompletions` with `temperature`, `maxTokens`, and an optional `responseFormat: { type: "json_object" }`.

**MEASURED — models in use** (`logs/llm.jsonl`, 4 runs): `gpt-4.1` on 373 calls, `gpt-4o-mini` on 69.

A provider swap therefore has exactly one insertion point. That is the good news, and it is the main argument for option 1 over option 2.

---

## 3. Two hard blockers on a straight swap

### 3.1 `temperature` is rejected by every current Claude model

**MEASURED.** [client.ts:122](../../packages/llm-client/src/client.ts#L122) escalates temperature per retry attempt via `escalateRetryTemperature`. Agent 9 leans on this heavily. Distinct temperatures observed in `logs/llm-prompts-full.jsonl`:

```
node -e "...group llm-prompts-full.jsonl by agent, tally o.temperature..."
agent9: { 0.30: 65, 0.42: 50, 0.54: 20, 0.64: 2, 0.66: 8, 0.70: 32 }
other:  { 0.10: 5, 0.20: 15, 0.30: 6, 0.40: 10, 0.50: 7, 0.60: 15, 0.70: 20, 0.75: 5, 0.82: 3 }
```

The `0.42 / 0.54 / 0.66` ladder is the retry escalation; `0.70` is the critique→rewrite-at-creative-temperature pass (LLD §6.5 / P4.2, [agent9-run.ts:198](../../apps/worker/src/jobs/agents/agent9-run.ts#L198)).

**INFERRED (vendor docs).** `temperature`, `top_p`, and `top_k` return a **400** on Claude Opus 5, Sonnet 5, Opus 4.8, and Opus 4.7. They are still accepted on Sonnet 4.5, Haiku 4.5, and Opus 4.6.

**Consequence.** The design intent recorded in the [client.ts:110-113](../../packages/llm-client/src/client.ts#L110-L113) comment — *"salt repeated retries by escalating temperature"* to escape a sampling basin — has no direct equivalent on a current Claude model. Replacements, in order of preference:

1. Vary the **prompt** across attempts (a per-attempt nonce or a re-framing instruction). This is the honest port: it targets the same "don't re-walk the same basin" goal by a supported mechanism.
2. Vary `output_config.effort` (`low` → `high`) per attempt. Changes reasoning depth, not sampling — a weaker analogue.
3. Pin the polish/rewrite paths to a temperature-accepting model (Sonnet 4.5 / Haiku 4.5). Works, but freezes us on an older generation.

This is the single largest piece of work in a full-pipeline swap and it is behavioural, not mechanical — it needs its own A/B, because the escalation ladder is load-bearing for retry success rate and nobody has measured what replaces it.

### 3.2 `jsonMode` has no like-for-like

**MEASURED.** `chatOnce` passes `responseFormat: { type: "json_object" }` when `options.jsonMode` is set — an "any valid JSON" constraint.

**INFERRED.** Claude's equivalent is `output_config.format` with an actual JSON **schema**, or `strict: true` on a tool definition. There is no schema-free JSON mode. Every `jsonMode` call site needs either a real schema or a fall back to instruct-and-parse.

---

## 4. Cost baseline — and the ~6× telemetry error

### 4.1 Measured token volumes

**MEASURED.** Aggregated from `logs/llm.jsonl` over the four runs it contains, counting `operation === "chat_response"`:

| Run | Calls | Input tokens | Output tokens | Agent 9 input | Agent 9 output | **Reported** cost |
|---|---:|---:|---:|---:|---:|---:|
| `run_477bb27a` | 204 | 2,007,577 | 374,831 | 1,940,743 | 335,397 | $1.19 |
| `mystery-1785175520689` | 118 | 1,192,491 | 209,903 | 1,091,180 | 166,292 | $0.66 |
| `run_e68c8118` | 67 | 774,172 | 144,097 | 766,754 | 142,652 | $0.47 |
| `run_6dc1ee3a` | 53 | 690,893 | 88,050 | 670,415 | 83,681 | $0.37 |

**MEASURED — Agent 9 dominates.** On the 07-27 run it is **91.5%** of input tokens and **79%** of output tokens. Any provider decision is, in practice, an Agent 9 decision.

### 4.2 The cost tracker under-reports by ~6×

**MEASURED.** [cost-tracker.ts:36-54](../../packages/llm-client/src/cost-tracker.ts#L36-L54) branches on `gpt-4.1-mini`, `gpt-4o-mini`, and `gpt-4o`. The string `gpt-4.1` matches **none** of them — `includes("4o")` is false — so it falls through to the GPT-3.5 fallback rates at [cost-tracker.ts:21-22](../../packages/llm-client/src/cost-tracker.ts#L21-L22).

**UNVERIFIED (list price, confirm against the Azure invoice).** GPT-4.1 at $2.00/M input, $8.00/M output.

| Run | Real cost at $2/$8 | Reported | Ratio |
|---|---:|---:|---:|
| `run_477bb27a` | **$7.01** | $1.19 | 5.9× |
| `mystery-1785175520689` | **$4.06** | $0.66 | 6.1× |
| `run_e68c8118` | **$2.70** | $0.47 | 5.7× |
| `run_6dc1ee3a` | **$2.09** | $0.37 | 5.7× |

This corroborates the standing note *"report total_cost under-reports ~7×"* and localises it to one missing branch. **A one-line fix** (add a `gpt-4.1` case) makes every future run's `total_cost` and every per-agent attribution real. Worth doing regardless of the Claude decision — it is currently impossible to A/B on cost.

**Take a full run as ~$4 typical, ~$7 on a heavy-retry run.**

---

## 5. Full-pipeline swap: what Claude would cost

Same token volumes, vendor list prices. "Typical" = `mystery-1785175520689` (1.19M in / 0.21M out); "heavy" = `run_477bb27a` (2.01M / 0.375M).

| Model | $/M in | $/M out | Typical run | Heavy run | vs today |
|---|---:|---:|---:|---:|---:|
| GPT-4.1 *(today)* | 2.00 | 8.00 | **$4.06** | **$7.01** | — |
| Claude Haiku 4.5 | 1.00 | 5.00 | $2.24 | $3.88 | 0.55× |
| Claude Sonnet 5 *(intro¹)* | 2.00 | 10.00 | $4.48 | $7.77 | 1.10× |
| Claude Sonnet 5 *(list)* | 3.00 | 15.00 | $6.73 | $11.64 | 1.66× |
| Claude Opus 5 | 5.00 | 25.00 | $11.21 | $19.41 | 2.76× |

¹ Sonnet 5 introductory pricing runs through 2026-08-31; it reverts to $3/$15 after.

**INFERRED — billing continuity.** Claude is available on **Microsoft Foundry** at standard Anthropic rates, billed through the Microsoft Marketplace. Given the stack is already Azure, this avoids adding a vendor relationship. Feature parity on Foundry is beta-flagged for several capabilities — check before depending on structured outputs or prompt caching there.

### 5.1 Prompt caching will not rescue this as-is

**MEASURED.** I computed the longest common literal prefix across Agent 9 `ProseGenerator` prompts within each run:

| Scope | Avg prompt | Shared prefix | Share |
|---|---:|---:|---:|
| Across chapters (same run, n=10–20 calls) | ~99K chars | ~7.4K chars | **7.6%** |
| Between retry attempts of the same chapter (n=30 pairs) | ~112K chars | ~89.8K chars | **80.2%** |

Chapter-specific content is injected too early in the prompt, so the cross-chapter prefix diverges almost immediately. Naive caching buys ~10–15% today. **Restructuring prompt assembly** — stable material (story bible, contract, style rules) first, chapter payload last — would move most of that ~99K into a cacheable prefix and cut an Opus 5 run by ~25–30%. That restructure is its own increment and touches [agent9-prose.ts](../../packages/prompts-llm/src/agent9-prose.ts).

---

## 6. The narrower question: a final Sonnet 5 pass

This is the cheap option, and the machinery already exists.

### 6.1 Measured artefact sizes

**MEASURED.** Taking the *last* `ProseGenerator` response per run+chapter from `logs/llm.jsonl`:

| Run | Chapters | Story tokens | Per chapter | Per chapter (~words) |
|---|---:|---:|---:|---:|
| `mystery-1785175520689` | 10 | 30,119 | 3,012 | ~1,900 |
| `run_e68c8118` | 10 | 27,360 | 2,736 | ~2,100 |
| `run_477bb27a` | 10 | 26,759 | 2,676 | ~1,800 |
| `run_6dc1ee3a` | 10 | 21,604 | 2,160 | ~1,700 |

**A chapter is ~2,700 output tokens. A story is ~27,000.**

### 6.2 The hooks already exist

**MEASURED.** [post-pass-polish.ts](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts) (493 lines) already provides both scopes:

- `polishPassingChapter` ([:144](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L144)) — per-chapter, `temperature: 0.2`, `maxTokens: 5000`, gated by `hasPolishRegression` with rollback.
- `runFullStoryRepetitionPolish` ([:393](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L393)) — full-story analysis, then a per-chapter apply loop, `temperature: 0.3`, `maxTokens: 5000`, gated by `hasRepetitionRewriteRegression`.

So this is **routing existing call sites to a second provider**, not new machinery.

### 6.3 Cost of the pass, Sonnet 5

| Shape | In / out per run | List ($3/$15) | Intro ($2/$10) |
|---|---:|---:|---:|
| Per-chapter, **current polish scope** (as wired today²) | 21K / 13K | **$0.25** | $0.17 |
| Per-chapter, full line-edit, lean context (~3K) | 57K / 27K | **$0.58** | $0.39 |
| Per-chapter, full line-edit, rich context (~12K bible) | 147K / 27K | **$0.85** | $0.57 |
| ↳ same, with the bible as a cached prefix | — | **$0.56** | $0.38 |
| **Whole-story**, single rewrite pass | 39K / 27K | **$0.52** | $0.35 |
| **Whole-story**, diagnostic-only (emits an edit list) | 39K / 2K | **$0.15** | $0.10 |

² **MEASURED** from `logs/llm.jsonl`: `Agent9-PostPassPolish-Ch1` averaged 2,076 in / 1,263 out per call. The current polish operates on flagged spans, not the whole chapter — hence the smaller footprint. Extrapolated ×10 chapters.

**Against a $4–7 run, every shape is a 4–15% increment.** Cost is not the deciding factor here; the *shape* is.

### 6.4 The thinking surcharge — do not skip this

**INFERRED (vendor docs).** Sonnet 5 runs **adaptive thinking by default** when the `thinking` field is omitted — a change from Sonnet 4.6. Thinking tokens bill at the **output** rate. Budget **+30–80% on every output figure above** unless thinking is explicitly disabled.

For a line-edit pass, `thinking: { type: "disabled" }` is the right setting (accepted on Sonnet 5) and keeps the table honest.

### 6.5 Two call-site defects this exposes

**MEASURED — `maxTokens: 5000`** at [:177](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L177) and [:464](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L464). On Sonnet 5, `max_tokens` caps thinking **plus** response text together. A 2,700-token chapter rewrite with adaptive thinking on can truncate mid-edit and surface as `stop_reason: "max_tokens"`. Either raise the budget (~16K) or disable thinking.

**MEASURED — `temperature: 0.2` / `0.3`** at [:176](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L176) and [:463](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L463). A **400** on Sonnet 5 (§3.1). Trivial to resolve here — a line edit wants no creative variance — but it must be resolved before the first call, not discovered on a live run.

---

## 7. Per-chapter vs whole-story: the actual trade

| | Per-chapter | Whole-story |
|---|---|---|
| Output bound | 2.7K tokens — safe | 27K tokens — needs streaming, `max_tokens` ≥ 64K |
| Rollback | Per-chapter, already implemented (`hasPolishRegression`) | All-or-nothing over ~20K words |
| Parallelism | 10 concurrent calls | Serial |
| Caching | Good, if the bible is a shared prefix | N/A (single call) |
| Catches cross-chapter defects | **No** | **Yes** |
| Rewrite-drift risk | Low | Real over 20K words |

**The deciding fact.** Per ANALYSIS_70, the open failure class is **cross-chapter**: repeated openings, the ch9 duplicate-chapter family, escalation and voice drift. A per-chapter pass is structurally blind to all of it. A whole-story rewrite can see it but is the riskiest shape to apply.

---

## 8. Recommendation

**Do the third shape: whole-story diagnostic, per-chapter apply.**

One Sonnet 5 read of the full story that emits a **list of targeted edits** rather than rewritten prose (~$0.15/run, $0.10 at intro pricing), then apply those edits through the existing per-chapter validator-gated rollback.

Why this and not the other two:

- It gets cross-chapter vision — the failure class that is actually open — at the **cheapest** price point in the table.
- It never hands 20K words to a single generation, so rewrite drift and all-or-nothing rollback both disappear.
- `runFullStoryRepetitionPolish` **already has this exact shape**: full-story analysis followed by a per-chapter loop. This is a provider swap plus a prompt change on an existing function, not a new pass.
- Output is ~2K tokens, so §6.4's thinking surcharge is immaterial and §6.5's `maxTokens` defect does not bite on the diagnostic call.

Ship it flag-gated default-OFF per §2.8, probe it, promote on evidence.

**Do not** take the full-pipeline swap (§5) as the first move. It is 1.7–2.8× the cost, and §3.1 makes it a behavioural change — the temperature-escalation ladder needs a replacement that has never been measured. If a full swap is wanted later, Sonnet 5 at ~1.1–1.7× is the candidate, not Opus 5.

**Do first, independent of any of this:** fix [cost-tracker.ts](../../packages/llm-client/src/cost-tracker.ts) (§4.2). Until `gpt-4.1` has a rate branch, no cost A/B between providers can be trusted, and the reported figure on every run to date is ~6× low.

---

## 9. What is not decided, and what is not measured

- **UNVERIFIED — Azure GPT-4.1 list pricing** ($2/$8). Every "vs today" ratio in §5 depends on it. Confirm against the actual invoice before anyone quotes these numbers externally.
- **UNBASELINED — quality delta.** Nothing here measures whether Sonnet 5 prose is *better* than GPT-4.1 prose on our rubric. The entire case for the pass is that it is cheap enough to find out. First probe should be N≥4 matched on chapter count (per the standing single-run-canary caution).
- **UNBASELINED — the thinking surcharge.** The +30–80% figure is inferred from vendor docs, not observed. First probe should record `usage.output_tokens` with thinking on and off.
- **NOT PRICED — option 2 (Agent SDK).** A validator-as-tool loop could cut regen round-trips, but nobody has measured what fraction of current regen traffic is self-correctable. Until that number exists, the harness rewrite has an unmeasured benefit and a known large cost. The measurement is cheap: count regen calls whose defect class a validator could have surfaced pre-return.
- **NOT COSTED — the prompt-assembly restructure** (§5.1). Worth ~25–30% on any Claude run and some fraction on GPT-4.1 too, but it touches the Agent 9 prompt builder, which is a high-blast-radius file.
