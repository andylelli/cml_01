import { promises as fs } from 'fs';
import { join, dirname } from 'path';
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
export class FileReportRepository implements ReportRepository {
  constructor(private baseDir: string) {}

  async save(report: GenerationReport): Promise<void> {
    const dirPath = join(this.baseDir, report.project_id);
    const filePath = join(dirPath, `${report.run_id}.json`);

    // Ensure directory exists
    await fs.mkdir(dirPath, { recursive: true });

    // Write report
    await fs.writeFile(filePath, JSON.stringify(report, null, 2), 'utf-8');
  }

  async get(projectId: string, runId: string): Promise<GenerationReport | null> {
    const filePath = join(this.baseDir, projectId, `${runId}.json`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null; // File not found
      }
      throw error;
    }
  }

  async list(projectId: string, limit = 10): Promise<GenerationReport[]> {
    const dirPath = join(this.baseDir, projectId);

    try {
      const files = await fs.readdir(dirPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      // Read all reports
      const reports: GenerationReport[] = [];
      for (const file of jsonFiles) {
        const filePath = join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        reports.push(JSON.parse(content));
      }

      // Sort by generated_at descending (most recent first)
      reports.sort((a, b) => 
        new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
      );

      // Limit results
      return reports.slice(0, limit);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return []; // Directory doesn't exist yet
      }
      throw error;
    }
  }

  async getAggregate(): Promise<AggregateStats> {
    // Get all project directories
    const projectDirs = await this.getProjectDirectories();

    let totalGenerations = 0;
    let successCount = 0;
    let totalScore = 0;
    let totalRetries = 0;
    const failureCounts: Record<string, number> = {};
    const gradeDistribution: Record<string, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    };

    // Read all reports
    for (const projectDir of projectDirs) {
      const dirPath = join(this.baseDir, projectDir);
      const files = await fs.readdir(dirPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      for (const file of jsonFiles) {
        const filePath = join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const report: GenerationReport = JSON.parse(content);

        totalGenerations++;
        if (report.passed) successCount++;
        totalScore += report.overall_score;
        totalRetries += report.summary.retry_stats.total_retries;

        // Track grade distribution
        if (report.overall_grade in gradeDistribution) {
          gradeDistribution[report.overall_grade]++;
        }

        // Track failure patterns
        for (const phase of report.phases) {
          if (!phase.passed) {
            const key = phase.agent;
            failureCounts[key] = (failureCounts[key] || 0) + 1;
          }
        }
      }
    }

    // Calculate common failures
    const commonFailures = Object.entries(failureCounts)
      .map(([phase, count]) => ({
        phase,
        count,
        percentage: totalGenerations > 0 ? (count / totalGenerations) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalGenerations,
      successRate: totalGenerations > 0 ? (successCount / totalGenerations) * 100 : 0,
      averageScore: totalGenerations > 0 ? totalScore / totalGenerations : 0,
      averageRetries: totalGenerations > 0 ? totalRetries / totalGenerations : 0,
      commonFailures,
      scoreDistribution: {
        A: gradeDistribution.A,
        B: gradeDistribution.B,
        C: gradeDistribution.C,
        D: gradeDistribution.D,
        F: gradeDistribution.F,
      },
    };
  }

  private async getProjectDirectories(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.baseDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return []; // Base directory doesn't exist yet
      }
      throw error;
    }
  }
}
