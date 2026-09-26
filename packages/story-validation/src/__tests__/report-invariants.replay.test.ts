import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { validateGenerationReportInvariants } from '../scoring/report-invariants.js';

describe('GenerationReport invariant replay fixtures', () => {
  it('detects known contradiction in run_9b2fcacd report', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    // The pinned report lives beside the test; the repo's validation/ folder is gitignored.
    const reportPath = join(here, 'fixtures', 'quality-report-run_9b2fcacd-99b6-4b55-ae52-30bb7e5fd263.json');

    const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
    const violations = validateGenerationReportInvariants(report);

    expect(violations.map(v => v.code)).toContain(
      'template_linter_abort_without_failed_checks'
    );
  });
});
