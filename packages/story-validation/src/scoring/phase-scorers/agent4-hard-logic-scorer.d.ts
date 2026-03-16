import { Scorer, PhaseScore, ScoringContext } from '../types.js';
/**
 * Hard Logic Device from CML
 */
export interface HardLogicDevice {
    id: string;
    name?: string;
    type?: string;
    description?: string;
    why_necessary?: string;
    implications?: string[];
    red_herring_potential?: string;
}
/**
 * Hard Logic input
 */
export interface HardLogicInput {
    cast?: any[];
    crime_type?: string;
}
/**
 * Hard Logic output (CML hard logic devices)
 */
export interface HardLogicOutput {
    hard_logic_devices: HardLogicDevice[];
}
/**
 * Scores the Hard Logic Devices phase (Agent 3b/4)
 *
 * Validation: Schema compliance, device structure
 * Quality: Logic soundness, necessity justification
 * Completeness: Sufficient devices for mystery complexity
 * Consistency: Non-contradictory devices, clear implications
 */
export declare class HardLogicScorer implements Scorer<HardLogicInput, HardLogicOutput> {
    score(input: HardLogicInput, output: HardLogicOutput, context: ScoringContext): Promise<PhaseScore>;
    /**
     * Validation: Schema structure
     */
    private validateStructure;
    /**
     * Validate individual device
     */
    private validateDevice;
    /**
     * Quality: Logic soundness
     */
    private assessQuality;
    /**
     * Score individual device depth (0-100)
     */
    private scoreDeviceDepth;
    /**
     * Completeness: Sufficient devices
     */
    private checkCompleteness;
    /**
     * Consistency: Non-contradictory logic
     */
    private checkConsistency;
    /**
     * Calculate letter grade
     */
    private calculateGrade;
    /**
     * Build failure reason
     */
    private buildFailureReason;
}
