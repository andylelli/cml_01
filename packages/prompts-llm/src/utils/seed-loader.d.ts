/**
 * Load and analyze seed CML files for structural patterns
 */
import type { SeedPattern } from "../types.js";
export declare function loadSeedCMLFiles(examplesDir: string): any[];
export declare function extractStructuralPatterns(cmlFiles: any[]): SeedPattern[];
export declare function selectRelevantPatterns(patterns: SeedPattern[], targetAxis: string, maxPatterns?: number): SeedPattern[];
export declare function formatPatternsForPrompt(patterns: SeedPattern[]): string;
