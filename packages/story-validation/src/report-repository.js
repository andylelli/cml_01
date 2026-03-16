import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { assertGenerationReportInvariants } from './scoring/report-invariants.js';
/**
 * File-based report repository
 * Stores reports as JSON files in a directory structure:
 * {baseDir}/{projectId}/{runId}.json
 */
export class FileReportRepository {
    baseDir;
    constructor(baseDir) {
        this.baseDir = baseDir;
    }
    parseAndValidateReport(content) {
        const parsed = JSON.parse(content);
        assertGenerationReportInvariants(parsed);
        return parsed;
    }
    async save(report) {
        // Guard against contradictory report payloads before persistence/export.
        assertGenerationReportInvariants(report);
        const dirPath = join(this.baseDir, report.project_id);
        const filePath = join(dirPath, `${report.run_id}.json`);
        const tempPath = join(dirPath, `${report.run_id}.${randomUUID()}.tmp`);
        // Ensure directory exists
        await fs.mkdir(dirPath, { recursive: true });
        // Write report atomically to avoid readers observing partial JSON during live polling.
        const payload = JSON.stringify(report, null, 2);
        await fs.writeFile(tempPath, payload, 'utf-8');
        await fs.rename(tempPath, filePath);
    }
    async get(projectId, runId) {
        const filePath = join(this.baseDir, projectId, `${runId}.json`);
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return this.parseAndValidateReport(content);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return null; // File not found
            }
            throw error;
        }
    }
    async list(projectId, limit = 10) {
        const dirPath = join(this.baseDir, projectId);
        try {
            const files = await fs.readdir(dirPath);
            const jsonFiles = files.filter(f => f.endsWith('.json'));
            // Read all reports
            const reports = [];
            for (const file of jsonFiles) {
                const filePath = join(dirPath, file);
                try {
                    const content = await fs.readFile(filePath, 'utf-8');
                    reports.push(this.parseAndValidateReport(content));
                }
                catch {
                    // Skip malformed or invariant-violating historical files in list views.
                    continue;
                }
            }
            // Sort by generated_at descending (most recent first)
            reports.sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime());
            // Limit results
            return reports.slice(0, limit);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return []; // Directory doesn't exist yet
            }
            throw error;
        }
    }
    async getAggregate() {
        // Get all project directories
        const projectDirs = await this.getProjectDirectories();
        let totalGenerations = 0;
        let successCount = 0;
        let totalScore = 0;
        let totalRetries = 0;
        const failureCounts = {};
        const gradeDistribution = {
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
                let report;
                try {
                    const content = await fs.readFile(filePath, 'utf-8');
                    report = this.parseAndValidateReport(content);
                }
                catch {
                    // Skip malformed or invariant-violating historical files in aggregates.
                    continue;
                }
                totalGenerations++;
                if (report.passed)
                    successCount++;
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
    async getProjectDirectories() {
        try {
            const entries = await fs.readdir(this.baseDir, { withFileTypes: true });
            return entries
                .filter(entry => entry.isDirectory())
                .map(entry => entry.name);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return []; // Base directory doesn't exist yet
            }
            throw error;
        }
    }
}
//# sourceMappingURL=report-repository.js.map