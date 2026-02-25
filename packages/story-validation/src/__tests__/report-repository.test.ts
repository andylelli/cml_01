/**
 * Unit tests for FileReportRepository
 * Uses a real temp directory to test all persistence operations.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { FileReportRepository } from "../report-repository.js";
import type { GenerationReport } from "../scoring/types.js";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeReport(
  overrides: Partial<GenerationReport> = {}
): GenerationReport {
  return {
    project_id: "proj-1",
    run_id: "run-1",
    generated_at: new Date("2026-02-24T10:00:00Z").toISOString(),
    total_duration_ms: 60000,
    total_cost: 0.12,
    overall_score: 82,
    overall_grade: "B",
    passed: true,
    phases: [],
    summary: {
      phases_passed: 9,
      phases_failed: 0,
      total_phases: 9,
      pass_rate: 100,
      weakest_phase: "agent1-background",
      strongest_phase: "agent4-hard-logic",
      retry_stats: {
        total_retries: 1,
        phases_retried: 1,
        retry_rate: "11.11",
        retried_phases: [{ agent: "agent2-cast", retry_count: 1, max_retries: 3 }],
      },
      total_cost: 0.12,
    },
    threshold_config: { mode: "standard" },
    ...overrides,
  };
}

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

let tempDir: string;

beforeEach(async () => {
  // Create a unique temp directory per test
  tempDir = join(tmpdir(), `cml-report-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  await fs.mkdir(tempDir, { recursive: true });
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

// ─── save() ───────────────────────────────────────────────────────────────────

describe("FileReportRepository.save()", () => {
  it("creates the project directory and writes the report file", async () => {
    const repo = new FileReportRepository(tempDir);
    const report = makeReport();
    await repo.save(report);

    const filePath = join(tempDir, "proj-1", "run-1.json");
    const content = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(content);
    expect(parsed.project_id).toBe("proj-1");
    expect(parsed.run_id).toBe("run-1");
    expect(parsed.overall_score).toBe(82);
  });

  it("overwrites an existing report with the same project/run id", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ overall_score: 70 }));
    await repo.save(makeReport({ overall_score: 85 }));

    const filePath = join(tempDir, "proj-1", "run-1.json");
    const parsed = JSON.parse(await fs.readFile(filePath, "utf-8"));
    expect(parsed.overall_score).toBe(85);
  });

  it("handles multiple projects without collision", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ project_id: "proj-A", run_id: "run-1" }));
    await repo.save(makeReport({ project_id: "proj-B", run_id: "run-1" }));

    const fileA = join(tempDir, "proj-A", "run-1.json");
    const fileB = join(tempDir, "proj-B", "run-1.json");
    expect(JSON.parse(await fs.readFile(fileA, "utf-8")).project_id).toBe("proj-A");
    expect(JSON.parse(await fs.readFile(fileB, "utf-8")).project_id).toBe("proj-B");
  });
});

// ─── get() ────────────────────────────────────────────────────────────────────

describe("FileReportRepository.get()", () => {
  it("returns the saved report by project and run id", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ overall_score: 77, overall_grade: "C" }));

    const result = await repo.get("proj-1", "run-1");
    expect(result).not.toBeNull();
    expect(result!.overall_score).toBe(77);
    expect(result!.overall_grade).toBe("C");
  });

  it("returns null when project does not exist", async () => {
    const repo = new FileReportRepository(tempDir);
    const result = await repo.get("no-such-project", "run-1");
    expect(result).toBeNull();
  });

  it("returns null when run id does not exist", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport());

    const result = await repo.get("proj-1", "no-such-run");
    expect(result).toBeNull();
  });
});

// ─── list() ───────────────────────────────────────────────────────────────────

describe("FileReportRepository.list()", () => {
  it("returns empty array when project has no reports", async () => {
    const repo = new FileReportRepository(tempDir);
    const result = await repo.list("proj-1");
    expect(result).toEqual([]);
  });

  it("returns all reports for a project", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ run_id: "run-1", generated_at: "2026-02-24T10:00:00Z" }));
    await repo.save(makeReport({ run_id: "run-2", generated_at: "2026-02-24T11:00:00Z" }));
    await repo.save(makeReport({ run_id: "run-3", generated_at: "2026-02-24T12:00:00Z" }));

    const result = await repo.list("proj-1");
    expect(result).toHaveLength(3);
  });

  it("returns reports sorted most-recent first", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ run_id: "run-A", generated_at: "2026-02-24T08:00:00Z" }));
    await repo.save(makeReport({ run_id: "run-B", generated_at: "2026-02-24T10:00:00Z" }));
    await repo.save(makeReport({ run_id: "run-C", generated_at: "2026-02-24T12:00:00Z" }));

    const result = await repo.list("proj-1");
    expect(result[0].run_id).toBe("run-C");
    expect(result[1].run_id).toBe("run-B");
    expect(result[2].run_id).toBe("run-A");
  });

  it("respects the limit parameter", async () => {
    const repo = new FileReportRepository(tempDir);
    for (let i = 1; i <= 5; i++) {
      await repo.save(
        makeReport({ run_id: `run-${i}`, generated_at: `2026-02-24T0${i}:00:00Z` })
      );
    }

    const result = await repo.list("proj-1", 2);
    expect(result).toHaveLength(2);
    // Most recent two
    expect(result[0].run_id).toBe("run-5");
    expect(result[1].run_id).toBe("run-4");
  });

  it("does not return reports from other projects", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ project_id: "proj-1", run_id: "run-1" }));
    await repo.save(makeReport({ project_id: "proj-2", run_id: "run-2" }));

    const result = await repo.list("proj-1");
    expect(result).toHaveLength(1);
    expect(result[0].run_id).toBe("run-1");
  });
});

// ─── getAggregate() ───────────────────────────────────────────────────────────

describe("FileReportRepository.getAggregate()", () => {
  it("returns zero stats when no reports exist", async () => {
    const repo = new FileReportRepository(tempDir);
    const stats = await repo.getAggregate();
    expect(stats.totalGenerations).toBe(0);
    expect(stats.successRate).toBe(0);
    expect(stats.averageScore).toBe(0);
    expect(stats.averageRetries).toBe(0);
    expect(stats.commonFailures).toEqual([]);
  });

  it("counts total generations correctly", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ project_id: "proj-1", run_id: "run-1" }));
    await repo.save(makeReport({ project_id: "proj-1", run_id: "run-2" }));
    await repo.save(makeReport({ project_id: "proj-2", run_id: "run-1" }));

    const stats = await repo.getAggregate();
    expect(stats.totalGenerations).toBe(3);
  });

  it("calculates successRate as percentage of passed reports", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ run_id: "run-1", passed: true }));
    await repo.save(makeReport({ run_id: "run-2", passed: true }));
    await repo.save(makeReport({ run_id: "run-3", passed: false }));

    const stats = await repo.getAggregate();
    expect(stats.successRate).toBeCloseTo(66.67, 1);
  });

  it("calculates averageScore across all reports", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ run_id: "run-1", overall_score: 80 }));
    await repo.save(makeReport({ run_id: "run-2", overall_score: 60 }));

    const stats = await repo.getAggregate();
    expect(stats.averageScore).toBeCloseTo(70, 1);
  });

  it("populates scoreDistribution grade counts", async () => {
    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ run_id: "run-A", overall_grade: "A" }));
    await repo.save(makeReport({ run_id: "run-B", overall_grade: "B" }));
    await repo.save(makeReport({ run_id: "run-B2", overall_grade: "B" }));
    await repo.save(makeReport({ run_id: "run-F", overall_grade: "F" }));

    const stats = await repo.getAggregate();
    expect(stats.scoreDistribution.A).toBe(1);
    expect(stats.scoreDistribution.B).toBe(2);
    expect(stats.scoreDistribution.C).toBe(0);
    expect(stats.scoreDistribution.F).toBe(1);
  });

  it("tracks common failures from failed phases", async () => {
    const failedPhase = {
      agent: "agent4-hard-logic",
      phase_name: "Hard Logic",
      score: {
        agent: "agent4-hard-logic",
        validation_score: 40,
        quality_score: 40,
        completeness_score: 40,
        consistency_score: 40,
        total: 40,
        grade: "F" as const,
        passed: false,
        tests: [],
      },
      duration_ms: 5000,
      cost: 0.05,
      threshold: 85,
      passed: false,
      tests: [],
    };

    const repo = new FileReportRepository(tempDir);
    await repo.save(makeReport({ run_id: "run-1", phases: [failedPhase] }));
    await repo.save(makeReport({ run_id: "run-2", phases: [failedPhase] }));

    const stats = await repo.getAggregate();
    const hardLogicFailure = stats.commonFailures.find(
      (f) => f.phase === "agent4-hard-logic"
    );
    expect(hardLogicFailure).toBeDefined();
    expect(hardLogicFailure!.count).toBe(2);
  });
});
