import type { GenerationReport } from './scoring/types.js';
/**
 * Repository interface for storing and retrieving generation reports
 */
export interface ReportRepository {
    /**
     * Save a generation report
     */
    save(report: GenerationReport): Promise<void>;
    /**
     * Get a specific report by project and run ID
     */
    get(projectId: string, runId: string): Promise<GenerationReport | null>;
    /**
     * List reports for a project (most recent first)
     */
    list(projectId: string, limit?: number): Promise<GenerationReport[]>;
    /**
     * Get aggregate statistics across all reports
     */
    getAggregate(): Promise<AggregateStats>;
}
/**
 * Aggregate statistics across multiple reports
 */
export interface AggregateStats {
    totalGenerations: number;
    successRate: number;
    averageScore: number;
    averageRetries: number;
    commonFailures: Array<{
        phase: string;
        count: number;
        percentage: number;
    }>;
    scoreDistribution: {
        A: number;
        B: number;
        C: number;
        D: number;
        F: number;
    };
}
/**
 * File-based report repository
 * Stores reports as JSON files in a directory structure:
 * {baseDir}/{projectId}/{runId}.json
 */
export declare class FileReportRepository implements ReportRepository {
    private baseDir;
    constructor(baseDir: string);
    private parseAndValidateReport;
    save(report: GenerationReport): Promise<void>;
    get(projectId: string, runId: string): Promise<GenerationReport | null>;
    list(projectId: string, limit?: number): Promise<GenerationReport[]>;
    getAggregate(): Promise<AggregateStats>;
    private getProjectDirectories;
}
