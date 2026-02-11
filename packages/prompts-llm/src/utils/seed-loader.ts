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
    const axis = cml?.CASE?.meta?.primaryAxis || "unknown";
    
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
