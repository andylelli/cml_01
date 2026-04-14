# ANALYSIS_08: Azure OpenAI Endpoint DNS Resolution Failure (ENOTFOUND)

Date: 2026-03-15

## Question Answered
What causes `getaddrinfo ENOTFOUND <endpoint>` errors on Azure OpenAI API calls, and how should they be handled?

## Error Snapshot (From Runtime Logs)

```
2026-03-14T13:47:50.668Z [ERROR] Agent1-SettingRefiner | chat_error |
  errorCode: "ENOTFOUND"
  errorMessage: "getaddrinfo ENOTFOUND openai-ds1sweden.openai.azure.com"
  retryAttempt: 1
  promptHash: afc4d5c9b1e93758

2026-03-14T13:47:56.950Z [ERROR] Agent1-SettingRefiner | chat_error |
  errorCode: "ENOTFOUND"
  retryAttempt: 2

2026-03-14T13:48:03.556Z [ERROR] Agent1-SettingRefiner | chat_error |
  errorCode: "ENOTFOUND"  
  retryAttempt: 3
```

Run affected: `run_78f5ee4e-de39-4cb4-b2c5-52ecc63cf6c2` (2026-03-14T13:47)
Agent: `Agent1-SettingRefiner` (earliest agent in the pipeline)
All three configured retry attempts exhausted on the same failing endpoint.

## Technical Cause

`ENOTFOUND` is a Node.js DNS resolution error. `getaddrinfo` is the system DNS lookup function. The error means the hostname `openai-ds1sweden.openai.azure.com` could not be resolved to an IP address via DNS.

### Possible causes (in order of likelihood)

1. **Wrong endpoint configured** — The environment variable or config for the Azure OpenAI endpoint is pointing to a hostname that does not exist or has been renamed/deleted. `openai-ds1sweden.openai.azure.com` is a Sweden-region Azure OpenAI resource name; if the resource was deleted, renamed, or if the wrong deployment URL is in the config, DNS would fail.

2. **Transient DNS failure** — The DNS resolver on the host machine or local network failed to resolve the hostname for the duration of that run. Runs before and after on 2026-03-14 (from 08:xx and 21:xx) use a different or correctly resolving endpoint and succeed.

3. **Environment variable not set / wrong value** — If the `AZURE_OPENAI_ENDPOINT` or equivalent env var is missing, the client may fall back to a default or stale URL.

4. **Network misconfiguration** — VPN, proxy, or firewall blocking external DNS resolution for `*.openai.azure.com` hostnames at the time of that specific run.

## Observed Pattern

- The error occurred **only once**, in run `run_78f5ee4e` at 13:47 on 2026-03-14.
- All three retry attempts in the LLM client's retry config failed with the same error (DNS resolution does not improve with retrying at this cadence).
- No subsequent runs (2026-03-14T21:xx, 2026-03-15T08:xx, 2026-03-15T09:xx) show this error — those runs connect successfully.
- The error is concentrated on Agent 1 (first agent), which means the pipeline never progressed past the first API call.

## Current Retry Behaviour

The LLM client's default retry config (`packages/llm-client/src/retry.ts`) retries on network errors including `ENOTFOUND`. However, DNS resolution failure is **not recoverable through retrying** — if the hostname doesn't resolve, routing three requests to the same non-existent endpoint wastes all retry budget without any chance of success.

## Recommended Fixes

### 1. Validate endpoint at startup (high priority)

Before making any API call, the worker/API app should verify the configured Azure OpenAI endpoint is reachable. A simple DNS lookup or HTTP health-check on startup can catch misconfiguration before any agent runs begin, providing an immediate and actionable error message instead of consuming retry budget.

```typescript
// Example: apps/worker/src/startup.ts or apps/api/src/startup.ts
import { lookup } from 'dns/promises';
const url = new URL(process.env.AZURE_OPENAI_ENDPOINT ?? '');
await lookup(url.hostname); // throws ENOTFOUND early, descriptive error
```

### 2. Exclude ENOTFOUND from per-call retry budget

ENOTFOUND should not count against the per-call retry budget allocated to content quality retries. DNS failure is an infrastructure problem, not a transient API error. Consider separating network-layer retries (short timeout, infrastructure error codes) from content-layer retries (content_filter, validation_failure, token_limit).

**File:** `packages/llm-client/src/retry.ts`

Currently `ENOTFOUND` is likely included in the generic network-error retry bucket. It should either:
- Be retried with exponential backoff at a longer interval (not 6-second cadence)
- Or be escalated immediately as a fatal infrastructure error that aborts the run with a clear message

### 3. Log the configured endpoint on all API errors

When an API error occurs, log the full endpoint hostname (sanitised — no auth tokens). This makes it immediately obvious from logs whether the error is due to wrong configuration vs. transient network failure. Currently the error message only includes the resolved (or unresolved) hostname from the Node.js error, not the configured value in the environment.

## Impact Assessment

### Observed impact
- One run aborted at Agent 1 (no story generated)
- 3 retry attempts exhausted, zero API calls succeeded
- No content filter errors logged for this run (pipeline never reached Agent 9)

### Risk going forward
- If the endpoint configuration is wrong in any deployment environment (staging, production), every run will fail immediately at Agent 1 with no useful error surfaced to the user
- The generic retry exhaustion error message does not distinguish network failure from API content rejection, making diagnosis slow

## Status
**ANALYSIS COMPLETE. FIXES NOT YET IMPLEMENTED.** The ENOTFOUND error appears to have been a transient or one-off failure (subsequent runs on the same day succeed). However, the startup validation and retry-config separation improvements are recommended to prevent silent endpoint misconfiguration from consuming retry budget in future.
