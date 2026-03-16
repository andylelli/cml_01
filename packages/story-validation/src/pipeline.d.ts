/**
 * Story Validation Pipeline
 * Coordinates all validators and provides comprehensive quality checking
 */
import type { Story, CMLData, ValidationError, ProseConsistencyReport } from './types.js';
import type { AzureOpenAIClient } from '@cml/llm-client';
export interface ValidationReport {
    status: 'passed' | 'needs_review' | 'needs_revision' | 'failed';
    summary: {
        totalIssues: number;
        critical: number;
        major: number;
        moderate: number;
        minor: number;
    };
    errors: ValidationError[];
    canProceed: boolean;
    recommendations: string[];
    consistencyReport?: ProseConsistencyReport;
}
export declare class StoryValidationPipeline {
    private validators;
    constructor(llmClient?: AzureOpenAIClient);
    validate(story: Story, cml?: CMLData): Promise<ValidationReport>;
    private generateReport;
    private buildConsistencyReport;
    private determineStatus;
    private generateRecommendations;
    /**
     * Auto-fix what can be automatically corrected
     */
    autoFix(story: Story): Story;
}
