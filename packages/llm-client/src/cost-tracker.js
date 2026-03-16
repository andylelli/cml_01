/**
 * Token cost calculation and tracking
 */
export const defaultCostConfig = {
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
    config;
    totalCost = 0;
    costByModel = new Map();
    costByAgent = new Map();
    constructor(config = defaultCostConfig) {
        this.config = config;
    }
    calculateCost(model, usage) {
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
    trackCost(model, usage, agent) {
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
    getTotalCost() {
        return this.totalCost;
    }
    getCostByModel() {
        return new Map(this.costByModel);
    }
    getCostByAgent() {
        return new Map(this.costByAgent);
    }
    reset() {
        this.totalCost = 0;
        this.costByModel.clear();
        this.costByAgent.clear();
    }
    getSummary() {
        return {
            totalCost: this.totalCost,
            byModel: Object.fromEntries(this.costByModel),
            byAgent: Object.fromEntries(this.costByAgent),
        };
    }
}
//# sourceMappingURL=cost-tracker.js.map