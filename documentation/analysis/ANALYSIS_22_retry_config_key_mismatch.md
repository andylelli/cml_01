# ANALYSIS_22: Retry Config Key Mismatch — All Agents Silently Receive Zero Retries

Date: 2026-03-30

## Summary

Run 2026-03-30T16:59 produced the log line:

```
No retry config found for agent: agent65_world_builder
```

Investigation revealed this is not an isolated agent65 anomaly. The key naming convention in
`retry-limits.yaml` (hyphen-separated: `agent65-world-builder`) has never matched the convention
used at code call sites (underscore-separated: `"agent65_world_builder"`). The `RetryManager.canRetry()`
method performs an exact string lookup; no normalisation is applied. The result: **no agent in the
pipeline has ever had retry config applied**. Every agent silently receives 0 retries when it fails
scoring at runtime, regardless of the values in the YAML.

The warning appears in logs only when a scoring failure actually triggers `canRetry` — so in runs
where all agents pass on the first attempt, the misconfiguration is invisible.

---

## Log Evidence (Run 2026-03-30T16:59)

```
2026-03-30T16:59:50.351Z [INFO    ] Agent65-WorldBuilder | chat_request
2026-03-30T17:00:18.161Z [INFO    ] Agent65-WorldBuilder | chat_response
No retry config found for agent: agent65_world_builder
```

Agent65 completed its LLM call successfully but subsequently failed scoring. `executeAgentWithRetry`
called `retryManager.canRetry("agent65_world_builder")` — received `false` — and treated the agent
as having exhausted its retry budget. The configured `max_retries: 1` was never consulted.

---

## Root Cause — Naming Convention Divergence

### YAML keys (`apps/worker/config/retry-limits.yaml`)

All keys use **hyphen-separated** lowercase identifiers:

```yaml
retry_limits:
  agent1-background:
    max_retries: 2
    ...
  agent65-world-builder:
    max_retries: 1
    backoff_strategy: none
    backoff_delay_ms: 5000
    reason: "World Builder has internal retry; one phase-level retry is sufficient"
  agent9-prose:
    max_retries: 2
    ...
```

### Code call sites (`apps/worker/src/jobs/agents/`)

All calls to `executeAgentWithRetry` use **underscore-separated** identifiers:

| File | Agent ID passed to `executeAgentWithRetry` |
|------|--------------------------------------------|
| `agent1-run.ts:23` | `"agent1_setting"` |
| `agent2b-run.ts:24` | `"agent2b_profiles"` |
| `agent65-run.ts:24` | `"agent65_world_builder"` |

Not only are separators different (hyphen vs underscore), the name suffixes themselves differ:
`agent1-background` (YAML) vs `"agent1_setting"` (code). This means the YAML and code naming schemes
were divergent from the start — the YAML was authored using a different naming convention than the
one eventually adopted at the call sites.

### Lookup mechanism (`packages/story-validation/src/scoring/retry-manager.ts:154`)

```typescript
canRetry(agent: string): boolean {
  const agentConfig = this.config.retry_limits[agent];   // exact string access, no normalisation

  if (!agentConfig) {
    console.warn(`No retry config found for agent: ${agent}`);
    return false;   // ← treat as 0 retries allowed
  }
  ...
}
```

No normalisation (no hyphen→underscore conversion, no fuzzy matching) is performed. The lookup is
an exact property access on the parsed YAML object. If the key is not found, `canRetry` returns
`false` — identical to the agent having been retried to its maximum already.

### Hardcoded default config (`retry-manager.ts:getDefaultConfig()`)

The in-code fallback (used if the YAML cannot be loaded) **also uses hyphen keys**:

```typescript
return {
  retry_limits: {
    'agent1-background': { max_retries: 2, ... },
    'agent65-world-builder': { ... },   // ← hyphens here too
  },
  ...
};
```

This confirms the original default config was authored with hyphens, then the code call sites
evolved independently to use underscores. Both naming schemes are now self-consistent within their
own context, but they have never been reconciled.

---

## Impact

### Per-agent effect

When any agent fails scoring:
1. `executeAgentWithRetry` calls `retryManager.canRetry(agentId)`
2. `agentId` (underscore form) is not found in `config.retry_limits` (hyphen keys)
3. `canRetry` logs the warning and returns `false`
4. The retry loop does not execute — the agent proceeds with its first (failed) result
5. `global.abort_on_max_retries: true` has no effect because no phase-level limit was reached;
   the system just moves on

The effective retry budget for every agent is 0.

### Severity

**High** — the retry system is a quality gate. Agents like `agent4-hard-logic` are configured with
`max_retries: 4` and `agent2-cast` with `max_retries: 3` precisely because they are expensive to
recover from downstream. None of these budgets are applied. A single transient LLM quality failure
propagates forward as accepted output. For agent65, a failed World Build (incorrect world geography,
contradicted era, etc.) passes through when a single retry would likely resolve it.

The bug is silent in successful runs, making it easy to miss. The only observable symptom is the
`No retry config found` warning — which only appears when a failure occurs.

---

## Fix

### Option A — Normalise YAML keys to underscore convention (preferred)

Rename all keys in `retry-limits.yaml` and `getDefaultConfig()` to match the underscore identifiers
actually used in code:

```yaml
# Before
agent65-world-builder:
  max_retries: 1
  ...

# After
agent65_world_builder:
  max_retries: 1
  ...
```

This requires auditing every `executeAgentWithRetry` call site and creating a one-to-one mapping of
code IDs to YAML keys. Since the code names are the source of truth (they are what actually flow
through the runtime), code should drive the YAML naming.

### Option B — Normalise at load time in `RetryManager`

In `loadConfig()`, after parsing the YAML, rekey all entries by replacing hyphens with underscores:

```typescript
const normalised: Record<string, RetryConfig> = {};
for (const [key, value] of Object.entries(config.retry_limits)) {
  normalised[key.replace(/-/g, '_')] = value;
}
config.retry_limits = normalised;
```

This is defensive but only helps with the hyphen/underscore mismatch. It does not fix cases where
the YAML key suffix is also different from the code ID (e.g. `agent1-background` vs `agent1_setting`).

### Recommendation

**Option A** — because the name-suffix divergence (e.g. `agent1-background` vs `"agent1_setting"`)
cannot be fixed by normalisation alone. A full key audit is needed regardless. Normalising in code
would give false confidence that the mapping is correct while leaving the suffix mismatches unresolved.

The fix work should:
1. Enumerate every `executeAgentWithRetry` call site and record the exact string passed as arg 0
2. Replace all YAML keys (and `getDefaultConfig` keys) with those exact strings
3. Add a test that asserts every registered agent ID in `retry-limits.yaml` matches at least one
   call site, and every call site has a corresponding YAML entry

---

## Files Affected

| File | Change Required |
|------|-----------------|
| `apps/worker/config/retry-limits.yaml` | Rename all keys to match underscore call-site IDs |
| `packages/story-validation/src/scoring/retry-manager.ts` | Update `getDefaultConfig()` keys to match |
| All `agentN-run.ts` files | No change — code IDs are the reference; YAML conforms to code |

---

## Status

| Item | Status |
|------|--------|
| Root cause identified: key naming convention divergence | ✅ Done |
| Impact assessed: all agents receive 0 retries | ✅ Done |
| Call-site audit (enumerate all agent IDs used in code) | ✅ Done |
| YAML re-key to match code IDs | ✅ Done |
| `getDefaultConfig()` re-key | ✅ Done |
| Test: YAML keys ↔ call-site IDs bijection | ⧳ Pending |

---

## Related Documents

- **ANALYSIS_04** — Configurable retry modes for agent9
- **ANALYSIS_16** — Pronoun validation failures (retry budget wasted by false positives)
- **ANALYSIS_19** — Residual pronoun errors post Phase D (retry interaction)
