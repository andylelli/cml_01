/**
 * Create a test result
 */
export function createTest(name, category, passed, score, weight = 1.0, message, severity) {
    return {
        name,
        category,
        passed,
        score,
        weight,
        message,
        severity,
    };
}
/**
 * Create a passing test with full score
 */
export function pass(name, category, weight = 1.0, message) {
    return createTest(name, category, true, 100, weight, message);
}
/**
 * Create a failing test with zero score
 */
export function fail(name, category, weight = 1.0, message, severity = 'major') {
    return createTest(name, category, false, 0, weight, message, severity);
}
/**
 * Create a partial score test
 */
export function partial(name, category, score, weight = 1.0, message, severity) {
    return createTest(name, category, score >= 60, // Pass if >= 60
    score, weight, message, severity);
}
/**
 * Check if value exists and is not empty
 */
export function exists(value) {
    if (value === null || value === undefined)
        return false;
    if (typeof value === 'string')
        return value.trim().length > 0;
    if (Array.isArray(value))
        return value.length > 0;
    if (typeof value === 'object')
        return Object.keys(value).length > 0;
    return true;
}
/**
 * Check if array has minimum length
 */
export function hasMinLength(arr, min) {
    return Array.isArray(arr) && arr.length >= min;
}
/**
 * Check if array has maximum length
 */
export function hasMaxLength(arr, max) {
    return Array.isArray(arr) && arr.length <= max;
}
/**
 * Check if value is within range
 */
export function inRange(value, min, max) {
    return value !== undefined && value >= min && value <= max;
}
/**
 * Check if string meets minimum word count
 */
export function hasMinWords(text, min) {
    if (!text)
        return false;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length >= min;
}
/**
 * Check if all required fields exist in object
 */
export function hasRequiredFields(obj, fields) {
    if (!obj)
        return false;
    return fields.every(field => exists(obj[field]));
}
/**
 * Calculate weighted average score from tests
 */
export function calculateWeightedScore(tests) {
    if (tests.length === 0)
        return 0;
    const totalWeight = tests.reduce((sum, test) => sum + test.weight, 0);
    if (totalWeight === 0)
        return 0;
    const weightedSum = tests.reduce((sum, test) => sum + test.score * test.weight, 0);
    return weightedSum / totalWeight;
}
/**
 * Calculate score for a specific category
 */
export function calculateCategoryScore(tests, category) {
    const categoryTests = tests.filter(t => t.category === category);
    return calculateWeightedScore(categoryTests);
}
/**
 * Get all failed tests
 */
export function getFailedTests(tests) {
    return tests.filter(t => !t.passed);
}
/**
 * Get critical failures
 */
export function getCriticalFailures(tests) {
    return tests.filter(t => !t.passed && t.severity === 'critical');
}
/**
 * Check if any critical tests failed
 */
export function hasCriticalFailures(tests) {
    return getCriticalFailures(tests).length > 0;
}
/**
 * Calculate pass rate (percentage of passing tests)
 */
export function calculatePassRate(tests) {
    if (tests.length === 0)
        return 100;
    const passed = tests.filter(t => t.passed).length;
    return (passed / tests.length) * 100;
}
/**
 * Validate required schema fields
 */
export function validateSchema(obj, requiredFields, category = 'validation', weight = 1.0) {
    const tests = [];
    if (!obj) {
        tests.push(fail('Object exists', category, weight, 'Required object is null or undefined', 'critical'));
        return tests;
    }
    for (const field of requiredFields) {
        const value = obj[field];
        if (!exists(value)) {
            tests.push(fail(`Field: ${String(field)}`, category, weight / requiredFields.length, `Required field "${String(field)}" is missing or empty`, 'major'));
        }
        else {
            tests.push(pass(`Field: ${String(field)}`, category, weight / requiredFields.length, `Field "${String(field)}" is present`));
        }
    }
    return tests;
}
/**
 * Score text quality based on length and content
 */
export function scoreTextQuality(text, minWords, idealWords, name, category = 'quality') {
    if (!text || text.trim().length === 0) {
        return fail(name, category, 1.0, 'Text is empty', 'major');
    }
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    if (wordCount < minWords) {
        const score = Math.max(0, (wordCount / minWords) * 60);
        return partial(name, category, score, 1.0, `Text is too short (${wordCount}/${minWords} words)`, 'minor');
    }
    if (wordCount >= idealWords) {
        return pass(name, category, 1.0, `Text quality good (${wordCount} words)`);
    }
    // Between min and ideal: scale from 60 to 100
    const score = 60 + ((wordCount - minWords) / (idealWords - minWords)) * 40;
    return partial(name, category, Math.round(score), 1.0, `Text quality acceptable (${wordCount} words)`);
}
/**
 * Score array completeness
 */
export function scoreArrayCompleteness(arr, min, ideal, name, category = 'completeness') {
    if (!arr || arr.length === 0) {
        return fail(name, category, 1.0, 'Array is empty', 'major');
    }
    const count = arr.length;
    if (count < min) {
        const score = Math.max(0, (count / min) * 60);
        return partial(name, category, score, 1.0, `Insufficient items (${count}/${min})`, 'minor');
    }
    if (count >= ideal) {
        return pass(name, category, 1.0, `Complete (${count} items)`);
    }
    // Between min and ideal: scale from 60 to 100
    const score = 60 + ((count - min) / (ideal - min)) * 40;
    return partial(name, category, Math.round(score), 1.0, `Acceptable (${count} items)`);
}
/**
 * Check for duplicates in array
 */
export function checkDuplicates(arr, getName, testName, category = 'validation') {
    const names = arr.map(getName);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
        return fail(testName, category, 1.0, `Duplicate entries found: ${[...new Set(duplicates)].join(', ')}`, 'major');
    }
    return pass(testName, category, 1.0, 'No duplicates found');
}
/**
 * Score consistency between related values
 */
export function scoreConsistency(value1, value2, name, message) {
    const matches = JSON.stringify(value1) === JSON.stringify(value2);
    if (matches) {
        return pass(name, 'consistency', 1.0, message);
    }
    return fail(name, 'consistency', 1.0, `${message} - values are inconsistent`, 'minor');
}
//# sourceMappingURL=scorer-utils.js.map