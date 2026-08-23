/**
 * Load and analyze seed CML files for structural patterns
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parse as parseYAML } from "yaml";
import type { SeedPattern } from "../types.js";

export function loadSeedCMLFiles(examplesDir: string): any[] {
  if (!examplesDir || !existsSync(examplesDir)) {
    return [];
  }

  try {
    const files = readdirSync(examplesDir).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
    return files.map((file) => {
      const content = readFileSync(join(examplesDir, file), "utf-8");
      const cml = parseYAML(content);
      return { filename: file, cml };
    });
  } catch {
    return [];
  }
}

export function extractStructuralPatterns(cmlFiles: any[]): SeedPattern[] {
  return cmlFiles.map(({ filename, cml }) => {
    /**
     * The axis lives on `false_assumption.type`. It has never lived on `meta.primaryAxis`.
     *
     * This read `cml?.CASE?.meta?.primaryAxis`, a field NO seed file and no generated CML has ever
     * carried, so every one of the 13 curated exemplars extracted as `axis: "unknown"`.
     * `selectRelevantPatterns` then filtered for an exact axis match and returned **zero patterns for
     * all five axes**, so `formatPatternsForPrompt` emitted "No seed patterns available for this
     * axis." on every run this project has ever done. The entire seed library — the Moonstone, Styles,
     * the Yellow Room — has never reached a prompt.
     *
     * It matters most for exactly the axes that need it: the corpus holds identity ×3 and spatial ×2,
     * and an `identity` run was getting none of them while being handed the bare word "identity".
     *
     * A THIRD SPELLING of one vocabulary — `false_assumption.type` is what the data uses,
     * `meta.primary_axis` is the snake_case fallback agents 5–8 read, and `meta.primaryAxis` is this
     * camelCase one that matches nothing. Read in the same order agents 5–8 already do, so the seed
     * loader and the downstream agents agree on where the axis lives.
     */
    const axis =
      cml?.CASE?.false_assumption?.type ||
      cml?.CASE?.meta?.primary_axis ||
      cml?.CASE?.meta?.primaryAxis ||
      "unknown";
    
    return {
      id: filename.replace(/\.(yaml|yml)$/, ""),
      axis,
      structure: {
        mechanismType: cml?.CASE?.hidden_model?.mechanism?.type || "unknown",
        falseAssumptionPattern: cml?.CASE?.false_assumption?.type || "unknown",
        constraintSpaceSize: cml?.CASE?.constraint_space?.constraints?.length || 0,
        inferencePathSteps: cml?.CASE?.inference_path?.length || 0,
        discriminatingTestMethod: cml?.CASE?.discriminating_test?.method || "unknown",
      },
    };
  });
}

export function selectRelevantPatterns(
  patterns: SeedPattern[],
  targetAxis: string,
  maxPatterns = 3
): SeedPattern[] {
  // Filter to same axis
  const sameAxis = patterns.filter(p => p.axis === targetAxis);
  
  // Take up to maxPatterns
  return sameAxis.slice(0, maxPatterns);
}

export function formatPatternsForPrompt(patterns: SeedPattern[]): string {
  if (patterns.length === 0) {
    return "No seed patterns available for this axis.";
  }

  return patterns.map(p => `
Pattern from ${p.id} (${p.axis} axis):
- Mechanism type: ${p.structure.mechanismType}
- False assumption: ${p.structure.falseAssumptionPattern}
- Constraint space size: ${p.structure.constraintSpaceSize} constraints
- Inference path: ${p.structure.inferencePathSteps} steps
- Discriminating test: ${p.structure.discriminatingTestMethod}
`).join("\n");
}
