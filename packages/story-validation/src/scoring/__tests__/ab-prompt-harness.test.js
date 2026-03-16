import { describe, expect, it } from 'vitest';
import { comparePromptVariants } from '../ab-prompt-harness.js';
describe('A/B prompt harness', () => {
    it('selects a statistically significant winner when effect and p-value pass', () => {
        const sampleA = {
            variantId: 'variant_a',
            runs: [
                { seedId: 's1', score: 90 },
                { seedId: 's2', score: 91 },
                { seedId: 's3', score: 90 },
                { seedId: 's4', score: 89 },
                { seedId: 's5', score: 92 },
                { seedId: 's6', score: 90 },
                { seedId: 's7', score: 91 },
                { seedId: 's8', score: 90 },
            ],
        };
        const sampleB = {
            variantId: 'variant_b',
            runs: [
                { seedId: 's1', score: 87 },
                { seedId: 's2', score: 88 },
                { seedId: 's3', score: 87 },
                { seedId: 's4', score: 86 },
                { seedId: 's5', score: 88 },
                { seedId: 's6', score: 87 },
                { seedId: 's7', score: 88 },
                { seedId: 's8', score: 87 },
            ],
        };
        const comparison = comparePromptVariants(sampleA, sampleB);
        expect(comparison.statisticallySignificant).toBe(true);
        expect(comparison.recommendedWinner).toBe('variant_a');
        expect(comparison.seedsCompared).toBe(8);
        expect(comparison.pValue).toBeLessThanOrEqual(0.05);
    });
    it('does not select a winner when sample size is below threshold', () => {
        const sampleA = {
            variantId: 'variant_a',
            runs: [
                { seedId: 's1', score: 90 },
                { seedId: 's2', score: 91 },
            ],
        };
        const sampleB = {
            variantId: 'variant_b',
            runs: [
                { seedId: 's1', score: 88 },
                { seedId: 's2', score: 89 },
            ],
        };
        const comparison = comparePromptVariants(sampleA, sampleB);
        expect(comparison.statisticallySignificant).toBe(false);
        expect(comparison.recommendedWinner).toBeNull();
        expect(comparison.reason).toContain('sample size');
    });
    it('does not select a winner when effect size is too small', () => {
        const sampleA = {
            variantId: 'variant_a',
            runs: [
                { seedId: 's1', score: 90.1 },
                { seedId: 's2', score: 90.2 },
                { seedId: 's3', score: 90.0 },
                { seedId: 's4', score: 90.3 },
                { seedId: 's5', score: 90.1 },
                { seedId: 's6', score: 90.2 },
                { seedId: 's7', score: 90.0 },
                { seedId: 's8', score: 90.2 },
            ],
        };
        const sampleB = {
            variantId: 'variant_b',
            runs: [
                { seedId: 's1', score: 90.0 },
                { seedId: 's2', score: 90.0 },
                { seedId: 's3', score: 89.9 },
                { seedId: 's4', score: 90.1 },
                { seedId: 's5', score: 90.0 },
                { seedId: 's6', score: 90.0 },
                { seedId: 's7', score: 89.9 },
                { seedId: 's8', score: 90.0 },
            ],
        };
        const comparison = comparePromptVariants(sampleA, sampleB, {
            minEffectSize: 1.0,
        });
        expect(comparison.statisticallySignificant).toBe(false);
        expect(comparison.recommendedWinner).toBeNull();
        expect(comparison.reason).toContain('effect threshold');
    });
});
//# sourceMappingURL=ab-prompt-harness.test.js.map