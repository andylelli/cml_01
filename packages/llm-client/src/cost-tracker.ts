/**
 * Token cost calculation and tracking
 */

import type { CostConfig, TokenUsage } from "./types.js";

export const defaultCostConfig: CostConfig = {
  // GPT-4o pricing (approximate, converted to GBP)
  gpt4oPromptCostPer1k: 0.0021725,
  gpt4oCompletionCostPer1k: 0.00869,

  // GPT-4o-mini pricing (Sweden Central regional, per 1K tokens, GBP)
  gpt4oMiniPromptCostPer1k: 0.00013035,
  gpt4oMiniCompletionCostPer1k: 0.0005214,

  // GPT-4.1-mini pricing ($0.40/$1.60 per million tokens, converted to GBP at 0.79)
  gpt41MiniPromptCostPer1k: 0.000316,
  gpt41MiniCompletionCostPer1k: 0.001264,

  // GPT-3.5-turbo pricing (converted to GBP)
  gpt35PromptCostPer1k: 0.000395,
  gpt35CompletionCostPer1k: 0.001185,

  // Anthropic list pricing, converted to GBP at the same 0.79 rate used above.
  // Deliberately LIST, not Sonnet 5's introductory $2/$10 — an under-reported rate is the failure
  // mode this file already has once (see the gpt-4.1 note in calculateCost), and a polish-stage A/B
  // is only decidable if the new provider's cost is not flattering.
  // Sonnet 5 $3/$15 per MTok:
  claudeSonnetPromptCostPer1k: 0.00237,
  claudeSonnetCompletionCostPer1k: 0.01185,
  // Opus 5 $5/$25 per MTok:
  claudeOpusPromptCostPer1k: 0.00395,
  claudeOpusCompletionCostPer1k: 0.01975,
  // Haiku 4.5 $1/$5 per MTok:
  claudeHaikuPromptCostPer1k: 0.00079,
  claudeHaikuCompletionCostPer1k: 0.00395,
};

export class CostTracker {
  private totalCost = 0;
  private costByModel = new Map<string, number>();
  private costByAgent = new Map<string, number>();

  constructor(private config: CostConfig = defaultCostConfig) {}

  calculateCost(model: string, usage: TokenUsage): number {
    const modelName = model.toLowerCase();

    // Anthropic models first — their ids share no substring with the GPT branches below, so an
    // unmatched claude-* id would otherwise silently fall through to the GPT-3.5 fallback rate.
    if (modelName.includes("claude")) {
      const isHaiku = modelName.includes("haiku");
      const isOpus = !isHaiku && modelName.includes("opus");
      const promptPer1k = isHaiku
        ? this.config.claudeHaikuPromptCostPer1k
        : isOpus
          ? this.config.claudeOpusPromptCostPer1k
          : this.config.claudeSonnetPromptCostPer1k;
      const completionPer1k = isHaiku
        ? this.config.claudeHaikuCompletionCostPer1k
        : isOpus
          ? this.config.claudeOpusCompletionCostPer1k
          : this.config.claudeSonnetCompletionCostPer1k;
      return (usage.promptTokens / 1000) * promptPer1k + (usage.completionTokens / 1000) * completionPer1k;
    }

    // Detect gpt-4.1-mini first — it does not contain "4o" so without an explicit
    // check it falls through to the GPT-3.5 fallback and produces understated costs.
    const isGpt41Mini = modelName.includes("gpt-4.1-mini") || modelName.includes("4.1-mini");
    const isGpt4oMini = !isGpt41Mini && (modelName.includes("gpt-4o-mini") || modelName.includes("4o-mini"));
    const isGpt4o = !isGpt41Mini && !isGpt4oMini && (modelName.includes("gpt-4o") || modelName.includes("4o"));

    const promptCostPer1k = isGpt41Mini
      ? this.config.gpt41MiniPromptCostPer1k
      : isGpt4oMini
        ? this.config.gpt4oMiniPromptCostPer1k
        : isGpt4o
          ? this.config.gpt4oPromptCostPer1k
          : this.config.gpt35PromptCostPer1k;

    const completionCostPer1k = isGpt41Mini
      ? this.config.gpt41MiniCompletionCostPer1k
      : isGpt4oMini
        ? this.config.gpt4oMiniCompletionCostPer1k
        : isGpt4o
          ? this.config.gpt4oCompletionCostPer1k
          : this.config.gpt35CompletionCostPer1k;

    const promptCost = (usage.promptTokens / 1000) * promptCostPer1k;
    const completionCost = (usage.completionTokens / 1000) * completionCostPer1k;

    return promptCost + completionCost;
  }

  trackCost(model: string, usage: TokenUsage, agent?: string): number {
    const cost = this.calculateCost(model, usage);

    this.totalCost += cost;

    // Track by model
    const modelCost = this.costByModel.get(model) || 0;
    this.costByModel.set(model, modelCost + cost);

    // Track by agent if provided
    if (agent) {
      const agentCost = this.costByAgent.get(agent) || 0;
      this.costByAgent.set(agent, agentCost + cost);
    }

    return cost;
  }

  getTotalCost(): number {
    return this.totalCost;
  }

  getCostByModel(): Map<string, number> {
    return new Map(this.costByModel);
  }

  getCostByAgent(): Map<string, number> {
    return new Map(this.costByAgent);
  }

  reset(): void {
    this.totalCost = 0;
    this.costByModel.clear();
    this.costByAgent.clear();
  }

  getSummary(): {
    totalCost: number;
    byModel: Record<string, number>;
    byAgent: Record<string, number>;
  } {
    return {
      totalCost: this.totalCost,
      byModel: Object.fromEntries(this.costByModel),
      byAgent: Object.fromEntries(this.costByAgent),
    };
  }
}
