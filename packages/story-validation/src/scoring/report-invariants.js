const TEMPLATE_LINTER_ABORT_PATTERN = /template\s*linter/i;
function toNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}
function getCanonicalOutcome(report) {
    const explicit = report.run_outcome;
    if (explicit === 'passed' || explicit === 'failed' || explicit === 'aborted') {
        return explicit;
    }
    if (report.aborted === true) {
        return 'aborted';
    }
    if (report.passed === true) {
        return 'passed';
    }
    if (report.passed === false) {
        return 'failed';
    }
    return undefined;
}
function getAbortReason(report) {
    const runOutcomeReason = report.run_outcome_reason;
    if (typeof runOutcomeReason === 'string' && runOutcomeReason.trim().length > 0) {
        return runOutcomeReason;
    }
    const legacyAbortReason = report.abort_reason;
    if (typeof legacyAbortReason === 'string' && legacyAbortReason.trim().length > 0) {
        return legacyAbortReason;
    }
    return '';
}
function getTemplateLinterFailedCheckCount(report) {
    const diagnostics = Array.isArray(report.diagnostics) ? report.diagnostics : [];
    return diagnostics.reduce((total, entry) => {
        if (!entry || typeof entry !== 'object') {
            return total;
        }
        const details = entry.details;
        if (!details || typeof details !== 'object') {
            return total;
        }
        return total + toNumber(details.template_linter_failed_checks);
    }, 0);
}
function hasMissingNsdEvidenceAnchors(report) {
    const diagnostics = Array.isArray(report.diagnostics) ? report.diagnostics : [];
    for (const entry of diagnostics) {
        if (!entry || typeof entry !== 'object') {
            continue;
        }
        const details = entry.details;
        if (!details || typeof details !== 'object') {
            continue;
        }
        const trace = details.nsd_transfer_trace;
        if (!Array.isArray(trace)) {
            continue;
        }
        for (const step of trace) {
            if (!step || typeof step !== 'object') {
                continue;
            }
            const stepRecord = step;
            const revealed = Array.isArray(stepRecord.newly_revealed_clue_ids)
                ? stepRecord.newly_revealed_clue_ids.filter((id) => typeof id === 'string' && id.length > 0)
                : [];
            if (revealed.length === 0) {
                continue;
            }
            const anchors = Array.isArray(stepRecord.clue_evidence_anchors)
                ? stepRecord.clue_evidence_anchors
                : [];
            const anchoredClues = new Set(anchors
                .filter((anchor) => Boolean(anchor) && typeof anchor === 'object')
                .map((anchor) => anchor.clue_id)
                .filter((value) => typeof value === 'string' && value.length > 0));
            const hasMissing = revealed.some((clueId) => !anchoredClues.has(clueId));
            if (hasMissing) {
                return true;
            }
        }
    }
    return false;
}
function hasFailedPhaseSignals(report) {
    const phases = Array.isArray(report.phases) ? report.phases : [];
    const hasFailedPhase = phases.some((phase) => {
        if (!phase || typeof phase !== 'object') {
            return false;
        }
        return phase.passed === false;
    });
    if (hasFailedPhase) {
        return true;
    }
    const summary = report.summary;
    if (!summary || typeof summary !== 'object') {
        return false;
    }
    return toNumber(summary.phases_failed) > 0;
}
// E1: helpers for post_generation_summary presence check
function hasAgent9ProsePhaseEntry(report) {
    const phases = Array.isArray(report.phases) ? report.phases : [];
    return phases.some((phase) => {
        if (!phase || typeof phase !== 'object')
            return false;
        return phase.agent === 'agent9_prose';
    });
}
function hasAgent9ProsePostGenerationSummaryDiagnostic(report) {
    const diagnostics = Array.isArray(report.diagnostics) ? report.diagnostics : [];
    return diagnostics.some((entry) => {
        if (!entry || typeof entry !== 'object')
            return false;
        return entry.key === 'agent9_prose_post_generation_summary';
    });
}
const LEGACY_PROGRESS_FIELDS = [
    'expected_chapter_count',
    'chapters_generated',
    'word_underflow_hard_floor_misses',
    'word_underflow_hard_floor_chapters',
];
const REQUIRED_CANONICAL_PROGRESS_FIELDS = [
    'expected_chapters_total',
    'chapters_generated_committed',
    'chapters_failed_uncommitted',
    'story_words_total',
    'chapter_words_hard_floor',
];
const REQUIRED_CANONICAL_UNDERFLOW_FIELDS = [
    'chapter_words_hard_floor_miss_count',
    'chapters_with_hard_floor_miss',
];
const REQUIRED_COUNT_RECONCILIATION_FIELDS = [
    'expected_chapters_total',
    'chapters_generated_committed',
    'chapters_failed_uncommitted',
    'failed_uncommitted_chapter_ranges',
    'chapter_word_buckets',
    'run_state',
];
const REQUIRED_COUNT_RECONCILIATION_WORD_BUCKET_FIELDS = [
    'hard_floor_miss_count',
    'pass_count',
];
function getAgent9ProsePostGenerationSummaryDetails(report) {
    const diagnostics = Array.isArray(report.diagnostics) ? report.diagnostics : [];
    for (const entry of diagnostics) {
        if (!entry || typeof entry !== 'object') {
            continue;
        }
        const entryRecord = entry;
        const isSummary = entryRecord.key === 'agent9_prose_post_generation_summary'
            || entryRecord.diagnostic_type === 'post_generation_summary';
        if (!isSummary) {
            continue;
        }
        const details = entryRecord.details;
        if (!details || typeof details !== 'object') {
            return undefined;
        }
        return details;
    }
    return undefined;
}
function hasAnyField(details, fields) {
    return fields.some((field) => Object.prototype.hasOwnProperty.call(details, field));
}
function missingFields(details, fields) {
    return fields.filter((field) => !Object.prototype.hasOwnProperty.call(details, field));
}
function getFiniteNumber(details, key) {
    const value = details[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
function getPrimitiveArray(details, key) {
    const value = details[key];
    if (!Array.isArray(value)) {
        return undefined;
    }
    const allPrimitive = value.every((entry) => typeof entry === 'string' || (typeof entry === 'number' && Number.isFinite(entry)));
    if (!allPrimitive) {
        return undefined;
    }
    return value;
}
function normalizePrimitiveArray(values) {
    return values
        .map((entry) => (typeof entry === 'number' ? `n:${entry}` : `s:${entry}`))
        .sort();
}
function isFiniteNonNegativeNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}
function hasModernMetricsSnapshot(details) {
    return Object.prototype.hasOwnProperty.call(details, 'metrics_snapshot');
}
export function validateGenerationReportInvariants(report) {
    const candidate = report;
    const violations = [];
    const outcome = getCanonicalOutcome(candidate);
    const passed = candidate.passed;
    const abortReason = getAbortReason(candidate);
    if (outcome === 'passed' && passed !== true) {
        violations.push({
            code: 'outcome_passed_requires_passed_true',
            message: 'run_outcome=passed requires passed=true.',
        });
    }
    if (outcome === 'aborted' && passed === true) {
        violations.push({
            code: 'aborted_run_cannot_pass',
            message: 'Aborted runs cannot have passed=true.',
        });
    }
    if (outcome === 'aborted' && abortReason.length === 0) {
        violations.push({
            code: 'aborted_run_requires_reason',
            message: 'Aborted runs must include run_outcome_reason (or legacy abort_reason).',
        });
    }
    if (TEMPLATE_LINTER_ABORT_PATTERN.test(abortReason)) {
        const linterFailedChecks = getTemplateLinterFailedCheckCount(candidate);
        if (linterFailedChecks <= 0) {
            violations.push({
                code: 'template_linter_abort_without_failed_checks',
                message: 'Abort reason references template linter but diagnostics report zero template_linter_failed_checks.',
            });
        }
    }
    if (hasMissingNsdEvidenceAnchors(candidate)) {
        violations.push({
            code: 'nsd_revealed_clues_missing_evidence_anchors',
            message: 'NSD transfer trace includes newly revealed clue IDs without matching clue evidence anchors.',
        });
    }
    const releaseGateOutcome = candidate.release_gate_outcome;
    if (releaseGateOutcome && typeof releaseGateOutcome === 'object') {
        const status = releaseGateOutcome.status;
        if (status === 'failed' && outcome === 'passed') {
            violations.push({
                code: 'release_gate_failed_cannot_have_passed_outcome',
                message: 'release_gate_outcome.status=failed is incompatible with run_outcome=passed.',
            });
        }
    }
    if (outcome === 'passed' && hasFailedPhaseSignals(candidate)) {
        violations.push({
            code: 'failed_phase_signal_cannot_have_passed_outcome',
            message: 'Failed phase signals (phases[].passed=false or summary.phases_failed>0) are incompatible with run_outcome=passed.',
        });
    }
    // E1: agent9_prose phase present → post_generation_summary diagnostic required
    if (hasAgent9ProsePhaseEntry(candidate) && !hasAgent9ProsePostGenerationSummaryDiagnostic(candidate)) {
        violations.push({
            code: 'missing_post_generation_summary',
            message: 'agent9_prose phase is present but agent9_prose_post_generation_summary diagnostic is missing.',
        });
    }
    const proseSummaryDetails = getAgent9ProsePostGenerationSummaryDetails(candidate);
    if (proseSummaryDetails && hasModernMetricsSnapshot(proseSummaryDetails)) {
        const countReconciliation = proseSummaryDetails.count_reconciliation;
        if (!countReconciliation || typeof countReconciliation !== 'object') {
            violations.push({
                code: 'missing_count_reconciliation',
                message: 'post_generation_summary with metrics_snapshot must include count_reconciliation diagnostics.',
            });
        }
        else {
            const reconciliationRecord = countReconciliation;
            const missingReconciliationFields = missingFields(reconciliationRecord, REQUIRED_COUNT_RECONCILIATION_FIELDS);
            if (missingReconciliationFields.length > 0) {
                violations.push({
                    code: 'malformed_count_reconciliation',
                    message: `count_reconciliation missing required fields: ${missingReconciliationFields.join(', ')}`,
                });
            }
            const runState = reconciliationRecord.run_state;
            if (runState !== 'in_progress' && runState !== 'partial_generation' && runState !== 'complete') {
                violations.push({
                    code: 'malformed_count_reconciliation',
                    message: 'count_reconciliation.run_state must be one of in_progress, partial_generation, complete.',
                });
            }
            const ranges = reconciliationRecord.failed_uncommitted_chapter_ranges;
            if (!Array.isArray(ranges)) {
                violations.push({
                    code: 'malformed_count_reconciliation',
                    message: 'count_reconciliation.failed_uncommitted_chapter_ranges must be an array.',
                });
            }
            else {
                const invalidRange = ranges.some((range) => {
                    if (!range || typeof range !== 'object') {
                        return true;
                    }
                    const record = range;
                    const start = record.start;
                    const end = record.end;
                    return (!isFiniteNonNegativeNumber(start)
                        || !isFiniteNonNegativeNumber(end)
                        || start > end);
                });
                if (invalidRange) {
                    violations.push({
                        code: 'malformed_count_reconciliation',
                        message: 'count_reconciliation.failed_uncommitted_chapter_ranges entries must provide non-negative numeric start/end with start <= end.',
                    });
                }
            }
            const chapterWordBuckets = reconciliationRecord.chapter_word_buckets;
            if (!chapterWordBuckets || typeof chapterWordBuckets !== 'object') {
                violations.push({
                    code: 'malformed_count_reconciliation',
                    message: 'count_reconciliation.chapter_word_buckets must be an object.',
                });
            }
            else {
                const buckets = chapterWordBuckets;
                const missingBucketFields = missingFields(buckets, REQUIRED_COUNT_RECONCILIATION_WORD_BUCKET_FIELDS);
                if (missingBucketFields.length > 0) {
                    violations.push({
                        code: 'malformed_count_reconciliation',
                        message: `count_reconciliation.chapter_word_buckets missing required fields: ${missingBucketFields.join(', ')}`,
                    });
                }
                const invalidBucketValue = REQUIRED_COUNT_RECONCILIATION_WORD_BUCKET_FIELDS.some((field) => !isFiniteNonNegativeNumber(buckets[field]));
                if (invalidBucketValue) {
                    violations.push({
                        code: 'malformed_count_reconciliation',
                        message: 'count_reconciliation.chapter_word_buckets values must be non-negative finite numbers.',
                    });
                }
            }
        }
    }
    if (proseSummaryDetails && hasAnyField(proseSummaryDetails, LEGACY_PROGRESS_FIELDS)) {
        const missingCanonicalProgress = missingFields(proseSummaryDetails, REQUIRED_CANONICAL_PROGRESS_FIELDS);
        if (missingCanonicalProgress.length > 0) {
            violations.push({
                code: 'missing_canonical_progress_metrics',
                message: `post_generation_summary contains legacy progress metrics without canonical fields: ${missingCanonicalProgress.join(', ')}`,
            });
        }
        const hasLegacyUnderflow = hasAnyField(proseSummaryDetails, [
            'word_underflow_hard_floor_misses',
            'word_underflow_hard_floor_chapters',
        ]);
        if (hasLegacyUnderflow) {
            const missingCanonicalUnderflow = missingFields(proseSummaryDetails, REQUIRED_CANONICAL_UNDERFLOW_FIELDS);
            if (missingCanonicalUnderflow.length > 0) {
                violations.push({
                    code: 'missing_canonical_underflow_metrics',
                    message: `post_generation_summary contains legacy underflow metrics without canonical fields: ${missingCanonicalUnderflow.join(', ')}`,
                });
            }
        }
        const progressAliasMismatches = [];
        const progressPairs = [
            ['expected_chapters_total', 'expected_chapter_count'],
            ['chapters_generated_committed', 'chapters_generated'],
        ];
        for (const [canonical, legacy] of progressPairs) {
            const canonicalValue = getFiniteNumber(proseSummaryDetails, canonical);
            const legacyValue = getFiniteNumber(proseSummaryDetails, legacy);
            if (canonicalValue === undefined || legacyValue === undefined) {
                continue;
            }
            if (canonicalValue !== legacyValue) {
                progressAliasMismatches.push(`${canonical}=${canonicalValue} vs ${legacy}=${legacyValue}`);
            }
        }
        if (progressAliasMismatches.length > 0) {
            violations.push({
                code: 'canonical_legacy_progress_metric_mismatch',
                message: `post_generation_summary canonical/legacy progress alias mismatch: ${progressAliasMismatches.join('; ')}`,
            });
        }
        const underflowAliasMismatches = [];
        const underflowCountPairs = [
            ['chapter_words_hard_floor_miss_count', 'word_underflow_hard_floor_misses'],
        ];
        for (const [canonical, legacy] of underflowCountPairs) {
            const canonicalValue = getFiniteNumber(proseSummaryDetails, canonical);
            const legacyValue = getFiniteNumber(proseSummaryDetails, legacy);
            if (canonicalValue === undefined || legacyValue === undefined) {
                continue;
            }
            if (canonicalValue !== legacyValue) {
                underflowAliasMismatches.push(`${canonical}=${canonicalValue} vs ${legacy}=${legacyValue}`);
            }
        }
        const underflowArrayPairs = [
            ['chapters_with_hard_floor_miss', 'word_underflow_hard_floor_chapters'],
        ];
        for (const [canonical, legacy] of underflowArrayPairs) {
            const canonicalValue = getPrimitiveArray(proseSummaryDetails, canonical);
            const legacyValue = getPrimitiveArray(proseSummaryDetails, legacy);
            if (!canonicalValue || !legacyValue) {
                continue;
            }
            const canonicalNorm = normalizePrimitiveArray(canonicalValue);
            const legacyNorm = normalizePrimitiveArray(legacyValue);
            if (canonicalNorm.length !== legacyNorm.length) {
                underflowAliasMismatches.push(`${canonical} length ${canonicalNorm.length} vs ${legacy} length ${legacyNorm.length}`);
                continue;
            }
            const mismatch = canonicalNorm.some((entry, index) => legacyNorm[index] !== entry);
            if (mismatch) {
                underflowAliasMismatches.push(`${canonical} differs from ${legacy}`);
            }
        }
        if (underflowAliasMismatches.length > 0) {
            violations.push({
                code: 'canonical_legacy_underflow_metric_mismatch',
                message: `post_generation_summary canonical/legacy underflow alias mismatch: ${underflowAliasMismatches.join('; ')}`,
            });
        }
    }
    return violations;
}
export function assertGenerationReportInvariants(report) {
    const violations = validateGenerationReportInvariants(report);
    if (violations.length === 0) {
        return;
    }
    const detail = violations.map(v => `${v.code}: ${v.message}`).join(' | ');
    throw new Error(`GenerationReport invariant violation(s): ${detail}`);
}
//# sourceMappingURL=report-invariants.js.map