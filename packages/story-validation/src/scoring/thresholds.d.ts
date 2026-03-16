/**
 * Threshold configuration and validation logic
 */
import type { PhaseScore, ThresholdConfig } from './types.js';
/**
 * Default thresholds for each phase
 */
export declare const DEFAULT_THRESHOLDS: Record<string, number>;
/**
 * Component minimum thresholds (apply to ALL phases)
 * Each component must meet its minimum regardless of composite score
 */
export declare const COMPONENT_MINIMUMS: {
    validation_score: number;
    quality_score: number;
    completeness_score: number;
    consistency_score: number;
};
/**
 * Threshold modes for different quality requirements
 */
export declare const THRESHOLD_MODES: {
    strict: {
        default: number;
        'agent4-hard-logic': number;
        'agent9-prose': number;
    };
    standard: {
        [x: string]: number;
    };
    lenient: {
        default: number;
        'agent4-hard-logic': number;
        'agent9-prose': number;
    };
};
/**
 * Check if a phase score passes the threshold
 * Requires BOTH composite threshold AND all component minimums
 */
export declare function passesThreshold(score: PhaseScore, config: ThresholdConfig): boolean;
/**
 * Identify which components failed to meet their minimums
 */
export declare function getFailedComponents(score: PhaseScore): string[];
/**
 * Calculate letter grade from numeric score
 */
export declare function calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F';
/**
 * Get threshold for a specific agent and config
 */
export declare function getThreshold(agent: string, config: ThresholdConfig): number;
