import type { GenerationReport } from './types.js';
export interface ReportInvariantViolation {
    code: string;
    message: string;
}
export declare function validateGenerationReportInvariants(report: GenerationReport | Record<string, unknown>): ReportInvariantViolation[];
export declare function assertGenerationReportInvariants(report: GenerationReport | Record<string, unknown>): void;
