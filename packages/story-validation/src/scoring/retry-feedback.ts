import type { PhaseScore } from './types.js';

/**
 * Builds detailed retry feedback for LLM based on scoring failure
 */
export function buildRetryFeedback(score: PhaseScore, attemptNumber: number): string {
  const parts: string[] = [];

  parts.push(`=== RETRY ATTEMPT ${attemptNumber} - SCORING FEEDBACK ===\n`);
  parts.push(`Previous attempt scored: ${score.total}/100 (Grade: ${score.grade})`);

  if (score.failure_reason) {
    parts.push(`\n**Failure Reason**: ${score.failure_reason}`);
  }

  // Component scores
  parts.push(`\n**Component Scores**:`);
  parts.push(`  - Validation: ${score.validation_score}/100 ${score.validation_score < 60 ? '❌ BELOW MINIMUM' : '✓'}`);
  parts.push(`  - Quality: ${score.quality_score}/100 ${score.quality_score < 50 ? '❌ BELOW MINIMUM' : '✓'}`);
  parts.push(`  - Completeness: ${score.completeness_score}/100 ${score.completeness_score < 60 ? '❌ BELOW MINIMUM' : '✓'}`);
  parts.push(`  - Consistency: ${score.consistency_score}/100 ${score.consistency_score < 50 ? '❌ BELOW MINIMUM' : '✓'}`);

  // Critical failures
  const criticalTests = score.tests.filter(t => !t.passed && t.severity === 'critical');
  if (criticalTests.length > 0) {
    parts.push(`\n**🚨 CRITICAL ISSUES** (must fix):`);
    criticalTests.forEach(t => {
      const reason = t.message || 'Failed validation';
      parts.push(`  - ${t.name}: ${reason}`);
    });
  }

  // Major failures
  const majorTests = score.tests.filter(t => !t.passed && t.severity === 'major');
  if (majorTests.length > 0) {
    parts.push(`\n**⚠️  MAJOR ISSUES** (should fix):`);
    majorTests.forEach(t => {
      const reason = t.message || 'Failed validation';
      parts.push(`  - ${t.name}: ${reason}`);
    });
  }

  // Minor warnings
  const minorTests = score.tests.filter(t => !t.passed && t.severity === 'minor');
  if (minorTests.length > 0 && minorTests.length <= 5) {
    parts.push(`\n**ℹ️  MINOR ISSUES** (nice to fix):`);
    minorTests.slice(0, 5).forEach(t => {
      const reason = t.message || 'Failed validation';
      parts.push(`  - ${t.name}: ${reason}`);
    });
  }

  // Partial successes (show progress)
  const partialTests = score.tests.filter(t => t.passed && t.score && t.score < t.weight);
  if (partialTests.length > 0 && partialTests.length <= 3) {
    parts.push(`\n**📊 PARTIAL SUCCESSES** (room for improvement):`);
    partialTests.slice(0, 3).forEach(t => {
      const percentage = t.score && t.weight ? Math.round((t.score / t.weight) * 100) : 0;
      parts.push(`  - ${t.name}: ${percentage}% (${t.message || 'partial pass'})`);
    });
  }

  parts.push(`\n**ACTION REQUIRED**:`);
  parts.push(`Please regenerate your output addressing the critical and major issues listed above.`);
  parts.push(`Focus especially on components that failed minimum thresholds.`);

  return parts.join('\n');
}

