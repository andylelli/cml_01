/**
 * Token cost calculation and tracking
 */
import type { CostConfig, TokenUsage } from "./types.js";
export declare const defaultCostConfig: CostConfig;
export declare class CostTracker {
    private config;
    private totalCost;
    private costByModel;
    private costByAgent;
    constructor(config?: CostConfig);
    calculateCost(model: string, usage: TokenUsage): number;
    trackCost(model: string, usage: TokenUsage, agent?: string): number;
    getTotalCost(): number;
    getCostByModel(): Map<string, number>;
    getCostByAgent(): Map<string, number>;
    reset(): void;
    getSummary(): {
        totalCost: number;
        byModel: Record<string, number>;
        byAgent: Record<string, number>;
    };
}
