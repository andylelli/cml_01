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

  // GPT-3.5-turbo pricing (converted to GBP)
  gpt35PromptCostPer1k: 0.000395,
  gpt35CompletionCostPer1k: 0.001185,
};

export class CostTracker {
  private totalCost = 0;
  private costByModel = new Map<string, number>();
  private costByAgent = new Map<string, number>();

  constructor(private config: CostConfig = defaultCostConfig) {}

  calculateCost(model: string, usage: TokenUsage): number {
    const modelName = model.toLowerCase();
    const isGpt4oMini = modelName.includes("gpt-4o-mini") || modelName.includes("4o-mini");
    const isGpt4o = !isGpt4oMini && (modelName.includes("gpt-4o") || modelName.includes("4o"));

    const promptCostPer1k = isGpt4oMini
      ? this.config.gpt4oMiniPromptCostPer1k
      : isGpt4o
        ? this.config.gpt4oPromptCostPer1k
        : this.config.gpt35PromptCostPer1k;

    const completionCostPer1k = isGpt4oMini
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
