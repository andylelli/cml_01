export interface PromptVariantRun {
    seedId: string;
    score: number;
    componentScores?: {
        validation?: number;
        quality?: number;
        completeness?: number;
        consistency?: number;
    };
}
export interface PromptVariantSample {
    variantId: string;
    runs: PromptVariantRun[];
}
export interface AbHarnessConfig {
    alpha?: number;
    minSampleSize?: number;
    minEffectSize?: number;
}
export interface PromptVariantComparison {
    variantA: string;
    variantB: string;
    seedsCompared: number;
    meanScoreA: number;
    meanScoreB: number;
    meanDelta: number;
    winsA: number;
    winsB: number;
    ties: number;
    pValue: number;
    statisticallySignificant: boolean;
    recommendedWinner: string | null;
    reason: string;
}
export declare function comparePromptVariants(sampleA: PromptVariantSample, sampleB: PromptVariantSample, config?: AbHarnessConfig): PromptVariantComparison;
