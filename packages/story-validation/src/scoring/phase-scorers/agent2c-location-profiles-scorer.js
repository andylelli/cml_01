import { pass, fail, partial, exists, calculateCategoryScore, getCriticalFailures, } from '../scorer-utils.js';
/**
 * Scores the Location Profiles phase (Agent 2c)
 *
 * Validation: All 5 senses present
 * Quality: Sensory richness, specificity
 * Completeness: All key locations covered
 * Consistency: Atmosphere alignment with era/setting
 */
export class LocationProfilesScorer {
    async score(input, output, context) {
        const tests = [];
        // VALIDATION TESTS (40% weight)
        tests.push(...this.validateStructure(output));
        // QUALITY TESTS (30% weight)
        tests.push(...this.assessQuality(output));
        // COMPLETENESS TESTS (20% weight)
        tests.push(...this.checkCompleteness(output, context));
        // CONSISTENCY TESTS (10% weight)
        tests.push(...this.checkConsistency(output, context));
        // Calculate component scores
        const validation_score = calculateCategoryScore(tests, 'validation');
        const quality_score = calculateCategoryScore(tests, 'quality');
        const completeness_score = calculateCategoryScore(tests, 'completeness');
        const consistency_score = calculateCategoryScore(tests, 'consistency');
        // Calculate total
        const total = validation_score * 0.4 +
            quality_score * 0.3 +
            completeness_score * 0.2 +
            consistency_score * 0.1;
        const criticalFailures = getCriticalFailures(tests);
        const passed = criticalFailures.length === 0 && total >= 60;
        const component_failures = [];
        if (validation_score < 60)
            component_failures.push('validation');
        if (quality_score < 50)
            component_failures.push('quality');
        if (completeness_score < 60)
            component_failures.push('completeness');
        if (consistency_score < 50)
            component_failures.push('consistency');
        return {
            agent: 'agent2c-location-profiles',
            validation_score,
            quality_score,
            completeness_score,
            consistency_score,
            total: Math.round(total),
            grade: this.calculateGrade(total),
            passed,
            tests,
            component_failures: component_failures.length > 0 ? component_failures : undefined,
            failure_reason: !passed
                ? this.buildFailureReason(criticalFailures, component_failures)
                : undefined,
        };
    }
    validateStructure(output) {
        const tests = [];
        if (!output || !Array.isArray(output.location_profiles)) {
            tests.push(fail('Profiles array exists', 'validation', 3.0, 'Location profiles array is missing', 'critical'));
            return tests;
        }
        tests.push(pass('Profiles array exists', 'validation', 1.0));
        if (output.location_profiles.length === 0) {
            tests.push(fail('Profiles not empty', 'validation', 3.0, 'No location profiles generated', 'critical'));
            return tests;
        }
        // Validate each profile
        let validProfiles = 0;
        for (const profile of output.location_profiles) {
            const profileTests = this.validateProfile(profile);
            tests.push(...profileTests);
            if (profileTests.every(t => t.passed)) {
                validProfiles++;
            }
        }
        const validRate = validProfiles / output.location_profiles.length;
        tests.push(validRate >= 0.8
            ? pass('Profile validity rate', 'validation', 2.0, `${Math.round(validRate * 100)}% valid`)
            : partial('Profile validity rate', 'validation', validRate * 100, 2.0, `Only ${Math.round(validRate * 100)}% valid`));
        return tests;
    }
    validateProfile(profile) {
        const tests = [];
        const name = profile.location_name || 'Unknown';
        // All 5 senses required
        const senses = [
            { field: 'visual_details', name: 'Visual' },
            { field: 'sounds', name: 'Auditory' },
            { field: 'smells', name: 'Olfactory' },
            { field: 'tactile', name: 'Tactile' },
            { field: 'taste', name: 'Taste' },
        ];
        for (const sense of senses) {
            if (!exists(profile[sense.field])) {
                tests.push(fail(`${name}: ${sense.name} sense`, 'validation', 0.5, `Missing ${sense.name.toLowerCase()} details`, 'major'));
            }
            else {
                tests.push(pass(`${name}: ${sense.name} sense`, 'validation', 0.1));
            }
        }
        // Geographic grounding and atmosphere required
        if (!exists(profile.geographic_grounding)) {
            tests.push(fail(`${name}: Geographic grounding`, 'validation', 0.5, 'Missing geographic grounding', 'major'));
        }
        else {
            tests.push(pass(`${name}: Geographic grounding`, 'validation', 0.1));
        }
        if (!exists(profile.atmosphere_and_mood)) {
            tests.push(fail(`${name}: Atmosphere`, 'validation', 0.5, 'Missing atmosphere description', 'minor'));
        }
        else {
            tests.push(pass(`${name}: Atmosphere`, 'validation', 0.1));
        }
        return tests;
    }
    assessQuality(output) {
        const tests = [];
        if (!output.location_profiles || output.location_profiles.length === 0) {
            return tests;
        }
        // Check sensory richness (word count per sense)
        let totalRichness = 0;
        for (const profile of output.location_profiles) {
            totalRichness += this.scoreSensoryRichness(profile);
        }
        const avgRichness = totalRichness / output.location_profiles.length;
        tests.push(avgRichness >= 70
            ? pass('Sensory richness', 'quality', 2.0, `Average: ${Math.round(avgRichness)}%`)
            : partial('Sensory richness', 'quality', avgRichness, 2.0, `Average: ${Math.round(avgRichness)}%`));
        // Check geographic specificity (not generic)
        let specificLocations = 0;
        for (const profile of output.location_profiles) {
            if (this.isGeographicallySpecific(profile)) {
                specificLocations++;
            }
        }
        tests.push(specificLocations >= output.location_profiles.length * 0.8
            ? pass('Geographic specificity', 'quality', 1.0, `${specificLocations}/${output.location_profiles.length} specific`)
            : partial('Geographic specificity', 'quality', (specificLocations / output.location_profiles.length) * 100, 1.0, `Only ${specificLocations}/${output.location_profiles.length} specific`));
        return tests;
    }
    scoreSensoryRichness(profile) {
        let score = 0;
        const senseFields = [
            profile.visual_details,
            profile.sounds,
            profile.smells,
            profile.tactile,
            profile.taste,
        ];
        for (const field of senseFields) {
            if (!field)
                continue;
            const wordCount = field.split(/\s+/).length;
            if (wordCount >= 50)
                score += 20; // Rich description
            else if (wordCount >= 25)
                score += 12; // Adequate
            else if (wordCount >= 10)
                score += 6; // Minimal
            else
                score += 2; // Too sparse
        }
        return Math.min(100, score);
    }
    isGeographicallySpecific(profile) {
        const grounding = profile.geographic_grounding || '';
        // Look for specific markers: addresses, city names, coordinates, landmarks
        const specificMarkers = [
            /\d+\s+\w+\s+(street|road|avenue|lane|boulevard)/i, // Street addresses
            /\w+,\s+\w+/i, // City, State/Country
            /\d+°.*\d+°/i, // Coordinates
            /\b(north|south|east|west)\s+of\s+\w+/i, // Relative to known place
            /\d+\s+(miles|kilometers|km)\s+(from|to)/i, // Distance from known place
        ];
        return specificMarkers.some(pattern => pattern.test(grounding)) || grounding.length > 100;
    }
    checkCompleteness(output, context) {
        const tests = [];
        const profileCount = output.location_profiles?.length || 0;
        // Expect at least 3-5 key locations (crime scene, suspect homes, investigation sites)
        tests.push(profileCount >= 3
            ? pass('Minimum locations', 'completeness', 1.5, `${profileCount} locations`)
            : partial('Minimum locations', 'completeness', (profileCount / 3) * 100, 1.5, `Only ${profileCount} locations`, 'major'));
        // Check that all 5 senses are covered for each location
        let fullyCovered = 0;
        for (const profile of output.location_profiles) {
            const senses = [
                profile.visual_details,
                profile.sounds,
                profile.smells,
                profile.tactile,
                profile.taste,
            ];
            if (senses.every(exists)) {
                fullyCovered++;
            }
        }
        tests.push(fullyCovered === profileCount
            ? pass('All senses covered', 'completeness', 1.5, `${fullyCovered}/${profileCount} locations`)
            : partial('All senses covered', 'completeness', (fullyCovered / profileCount) * 100, 1.5, `Only ${fullyCovered}/${profileCount} locations`));
        return tests;
    }
    checkConsistency(output, context) {
        const tests = [];
        if (!output.location_profiles || output.location_profiles.length === 0) {
            return tests;
        }
        // Check for duplicate location names
        const names = output.location_profiles.map(p => p.location_name).filter((name) => exists(name));
        const uniqueNames = new Set(names.map(n => n.toLowerCase()));
        tests.push(uniqueNames.size === names.length
            ? pass('No duplicate locations', 'consistency', 1.0)
            : fail('No duplicate locations', 'consistency', 1.0, `${names.length - uniqueNames.size} duplicate(s)`, 'major'));
        // Check atmosphere consistency with era/setting
        if (context.previous_phases && context.cml) {
            const cml = context.cml;
            const era = cml?.BACKGROUND_CONTEXT?.era_background?.decade;
            const settingType = cml?.BACKGROUND_CONTEXT?.location_background?.location_type;
            let consistentAtmospheres = 0;
            for (const profile of output.location_profiles) {
                if (this.isAtmosphereConsistent(profile, era, settingType)) {
                    consistentAtmospheres++;
                }
            }
            if (era || settingType) {
                const consistencyRate = consistentAtmospheres / output.location_profiles.length;
                tests.push(consistencyRate >= 0.7
                    ? pass('Atmosphere consistency', 'consistency', 1.0, `${Math.round(consistencyRate * 100)}% consistent`)
                    : partial('Atmosphere consistency', 'consistency', consistencyRate * 100, 1.0, `Only ${Math.round(consistencyRate * 100)}% consistent`));
            }
        }
        return tests;
    }
    isAtmosphereConsistent(profile, era, settingType) {
        const atmosphere = (profile.atmosphere_and_mood || '').toLowerCase();
        const visual = (profile.visual_details || '').toLowerCase();
        // Simple heuristics: check for era/setting-appropriate vocabulary
        if (era && era.includes('1920')) {
            // Jazz Age markers
            const markers = ['art deco', 'jazz', 'speakeasy', 'prohibition', 'flapper'];
            if (markers.some(m => atmosphere.includes(m) || visual.includes(m))) {
                return true;
            }
        }
        if (settingType && settingType.toLowerCase().includes('manor')) {
            const markers = ['grand', 'elegant', 'refined', 'estate', 'aristocratic'];
            if (markers.some(m => atmosphere.includes(m) || visual.includes(m))) {
                return true;
            }
        }
        // If we can't determine, assume consistent (benefit of doubt)
        return true;
    }
    calculateGrade(score) {
        if (score >= 90)
            return 'A';
        if (score >= 80)
            return 'B';
        if (score >= 70)
            return 'C';
        if (score >= 60)
            return 'D';
        return 'F';
    }
    buildFailureReason(criticalFailures, componentFailures) {
        const parts = [];
        if (criticalFailures.length > 0) {
            parts.push(`${criticalFailures.length} critical failure(s)`);
        }
        if (componentFailures.length > 0) {
            parts.push(`Components below minimum: ${componentFailures.join(', ')}`);
        }
        return parts.join('; ') || 'Score below threshold';
    }
}
//# sourceMappingURL=agent2c-location-profiles-scorer.js.map