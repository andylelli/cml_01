import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
function readJson(path) {
    return JSON.parse(readFileSync(path, 'utf-8'));
}
describe('Fixed-seed prose benchmarks (chapter-level)', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const fixturePath = join(here, 'fixtures', 'fixed-seed-benchmarks.json');
    const fixture = readJson(fixturePath);
    it('matches expected prose totals and chapter score signatures for benchmark seeds', () => {
        for (const benchmark of fixture.benchmarks) {
            const reportPath = join(here, '..', '..', '..', '..', 'validation', `quality-report-${benchmark.run_id}.json`);
            const report = readJson(reportPath);
            const prosePhase = (report.phases ?? []).find((phase) => phase.agent === 'agent9_prose');
            expect(prosePhase, `missing agent9_prose in ${benchmark.run_id}`).toBeDefined();
            const proseTotal = prosePhase?.score?.total;
            expect(proseTotal, `unexpected prose total in ${benchmark.run_id}`).toBe(benchmark.expected_prose_total);
            const chapterScores = prosePhase?.score?.breakdown?.chapter_scores ?? [];
            expect(chapterScores.length, `unexpected chapter score count in ${benchmark.run_id}`).toBe(benchmark.expected_chapter_count);
            const actualScoreMap = {};
            for (const chapter of chapterScores) {
                actualScoreMap[String(chapter.chapter)] = chapter.individual_score;
            }
            expect(actualScoreMap, `chapter-level score drift detected in ${benchmark.run_id}`).toEqual(benchmark.expected_chapter_scores);
        }
    });
});
//# sourceMappingURL=fixed-seed-benchmark.replay.test.js.map