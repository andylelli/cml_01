/**
 * A cost tracker passed to a client must be the tracker the client uses.
 *
 * `AnthropicClient` has honoured `config.costTracker` since it was written — the Agent 9 polish
 * provider depends on it to fold Anthropic spend into the run's ledger. `AzureOpenAIClient` did not:
 * the field was absent from its config type, so a caller that passed one got no error, no data, and
 * zeros back from its own instance.
 *
 * MEASURED 2026-08-23: `judge-pairwise.mjs` reported `totalCost: 0` after a paid call, and
 * `judge-ab.mjs` has the same wiring — so the 0b.0 experiment's spend line was never real. One
 * capability, two clients, one wired: the same shape as X84's polish provider.
 */

import { describe, expect, it } from 'vitest';

import { AzureOpenAIClient } from '../client.js';
import { AnthropicClient } from '../anthropic-client.js';
import { CostTracker } from '../cost-tracker.js';

describe('an injected cost tracker', () => {
  it('is the one the Azure client reports through', () => {
    const shared = new CostTracker();
    const client = new AzureOpenAIClient({
      apiKey: 'test-key',
      endpoint: 'https://example.invalid',
      defaultModel: 'gpt-4.1-mini',
      costTracker: shared,
    });
    expect(client.getCostTracker()).toBe(shared);
  });

  it('is the one the Anthropic client reports through — unchanged, and the reason this was noticed', () => {
    const shared = new CostTracker();
    const client = new AnthropicClient({ apiKey: 'test-key', defaultModel: 'claude-sonnet-5', costTracker: shared });
    expect(client.getCostTracker()).toBe(shared);
  });

  it('falls back to a private tracker when none is passed — the pre-existing behaviour', () => {
    const a = new AzureOpenAIClient({ apiKey: 'k', endpoint: 'https://example.invalid' });
    const b = new AzureOpenAIClient({ apiKey: 'k', endpoint: 'https://example.invalid' });
    expect(a.getCostTracker()).toBeDefined();
    expect(a.getCostTracker()).not.toBe(b.getCostTracker());
  });

  it('shares one ledger across two clients, which is the point', () => {
    // A run uses an Azure client for prose and an Anthropic client for polish. Before this, only half
    // the bill could land in one place.
    const shared = new CostTracker();
    const azure = new AzureOpenAIClient({ apiKey: 'k', endpoint: 'https://example.invalid', costTracker: shared });
    const anthropic = new AnthropicClient({ apiKey: 'k', defaultModel: 'claude-sonnet-5', costTracker: shared });
    expect(azure.getCostTracker()).toBe(anthropic.getCostTracker());
  });
});
