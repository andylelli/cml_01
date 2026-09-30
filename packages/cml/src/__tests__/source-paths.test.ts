import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { describe, expect, it } from "vitest";
import {
  SOURCE_PATH_PROMPT_ROOTS,
  SOURCE_PATH_RETRY_TEMPLATES,
  WORKER_LEGAL_SOURCE_PATTERNS,
  enumerateSourcePaths,
  sourcePathPattern,
} from "../source-paths.js";

/**
 * CR-16 (A5-02) — the table reproduces the five bodies it replaced. VERBATIM copies of each old body are
 * below; over every library case the derived lists must equal them, and the worker's validator must accept
 * only enumerated paths (validator ⊆ enumerator).
 */
const OLD_PATTERNS = [
  /^CASE\.inference_path\.steps\[(\d+)\]\.observation$/,
  /^CASE\.inference_path\.steps\[(\d+)\]\.correction$/,
  /^CASE\.inference_path\.steps\[(\d+)\]\.required_evidence\[(\d+)\]$/,
  /^CASE\.constraint_space\.time\.anchors\[(\d+)\]$/,
  /^CASE\.constraint_space\.time\.contradictions\[(\d+)\]$/,
  /^CASE\.constraint_space\.access\.actors\[(\d+)\]$/,
  /^CASE\.constraint_space\.access\.objects\[(\d+)\]$/,
  /^CASE\.constraint_space\.access\.permissions\[(\d+)\]$/,
  /^CASE\.constraint_space\.physical\.laws\[(\d+)\]$/,
  /^CASE\.constraint_space\.physical\.traces\[(\d+)\]$/,
  /^CASE\.cast\[(\d+)\]\.alibi_window$/,
  /^CASE\.cast\[(\d+)\]\.access_plausibility$/,
  /^CASE\.cast\[(\d+)\]\.evidence_sensitivity\[(\d+)\]$/,
  /^CASE\.discriminating_test\.evidence_clues\[(\d+)\]$/,
  /^CASE\.prose_requirements\.clue_to_scene_mapping\[(\d+)\]\.clue_id$/,
];
const OLD_PROMPT_ROOTS = `- CASE.inference_path.steps[N].observation
- CASE.inference_path.steps[N].correction
- CASE.inference_path.steps[N].required_evidence[M]
- CASE.constraint_space.time.anchors[M]
- CASE.constraint_space.time.contradictions[M]
- CASE.constraint_space.access.actors[M]
- CASE.constraint_space.access.objects[M]
- CASE.constraint_space.access.permissions[M]
- CASE.constraint_space.physical.laws[M]
- CASE.constraint_space.physical.traces[M]
- CASE.cast[N].alibi_window
- CASE.cast[N].access_plausibility
- CASE.cast[N].evidence_sensitivity[M]
- CASE.discriminating_test.evidence_clues[M]
- CASE.prose_requirements.clue_to_scene_mapping[M].clue_id
- CASE.death_method`;
const OLD_RETRY_TEMPLATES = [
  "CASE.inference_path.steps[N].observation",
  "CASE.inference_path.steps[N].correction",
  "CASE.inference_path.steps[N].required_evidence[M]",
  "CASE.constraint_space.time.anchors[M]",
  "CASE.constraint_space.time.contradictions[M]",
  "CASE.cast[N].alibi_window",
  "CASE.cast[N].access_plausibility",
  "CASE.constraint_space.physical.traces[M]",
];
// prompts-llm buildValidSourcePaths, verbatim (the worker's computeStrictSourcePathWhitelist is the same list
// without the death_method tail, then deduplicated and validated)
function oldBuildValidSourcePaths(caseData: any): string[] {
  const paths: string[] = [];
  const steps = Array.isArray(caseData?.inference_path?.steps) ? caseData.inference_path.steps : [];
  for (let i = 0; i < steps.length; i++) {
    paths.push(`CASE.inference_path.steps[${i}].observation`);
    paths.push(`CASE.inference_path.steps[${i}].correction`);
    const reqEvidence = Array.isArray(steps[i]?.required_evidence) ? steps[i].required_evidence : [];
    for (let j = 0; j < reqEvidence.length; j++) paths.push(`CASE.inference_path.steps[${i}].required_evidence[${j}]`);
  }
  const pushIndexed = (base: string, arr: unknown[] | undefined): void => {
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < arr.length; i++) paths.push(`${base}[${i}]`);
  };
  pushIndexed("CASE.constraint_space.time.anchors", caseData?.constraint_space?.time?.anchors);
  pushIndexed("CASE.constraint_space.time.contradictions", caseData?.constraint_space?.time?.contradictions);
  pushIndexed("CASE.constraint_space.access.actors", caseData?.constraint_space?.access?.actors);
  pushIndexed("CASE.constraint_space.access.objects", caseData?.constraint_space?.access?.objects);
  pushIndexed("CASE.constraint_space.access.permissions", caseData?.constraint_space?.access?.permissions);
  pushIndexed("CASE.constraint_space.physical.laws", caseData?.constraint_space?.physical?.laws);
  pushIndexed("CASE.constraint_space.physical.traces", caseData?.constraint_space?.physical?.traces);
  const cast = Array.isArray(caseData?.cast) ? caseData.cast : [];
  for (let i = 0; i < cast.length; i++) {
    paths.push(`CASE.cast[${i}].alibi_window`);
    paths.push(`CASE.cast[${i}].access_plausibility`);
    const sensitivity = Array.isArray(cast[i]?.evidence_sensitivity) ? cast[i].evidence_sensitivity : [];
    for (let j = 0; j < sensitivity.length; j++) paths.push(`CASE.cast[${i}].evidence_sensitivity[${j}]`);
  }
  const testEvidence = Array.isArray(caseData?.discriminating_test?.evidence_clues) ? caseData.discriminating_test.evidence_clues : [];
  for (let i = 0; i < testEvidence.length; i++) paths.push(`CASE.discriminating_test.evidence_clues[${i}]`);
  const clueSceneMap = Array.isArray(caseData?.prose_requirements?.clue_to_scene_mapping) ? caseData.prose_requirements.clue_to_scene_mapping : [];
  for (let i = 0; i < clueSceneMap.length; i++) paths.push(`CASE.prose_requirements.clue_to_scene_mapping[${i}].clue_id`);
  if (typeof caseData?.death_method === "string" && caseData.death_method.trim()) paths.push("CASE.death_method");
  return paths;
}

const ROOT = join(__dirname, "..", "..", "..", "..", "library", "works");
const cases = existsSync(ROOT)
  ? readdirSync(ROOT).filter((w) => existsSync(join(ROOT, w, "case.cml2.yaml"))).map((w) => (yaml.load(readFileSync(join(ROOT, w, "case.cml2.yaml"), "utf8")) as any)?.CASE)
  : [];

describe("source-path table (A5-02)", () => {
  it("derives the worker's 15 regexes exactly", () => {
    expect(WORKER_LEGAL_SOURCE_PATTERNS.map((r) => r.source)).toEqual(OLD_PATTERNS.map((r) => r.source));
    expect(sourcePathPattern("CASE.death_method").source).toBe("^CASE\\.death_method$");
  });

  it("derives the prompt's root list and the retry templates exactly", () => {
    expect(SOURCE_PATH_PROMPT_ROOTS.map((t) => `- ${t}`).join("\n")).toBe(OLD_PROMPT_ROOTS);
    expect(SOURCE_PATH_RETRY_TEMPLATES).toEqual(OLD_RETRY_TEMPLATES);
  });

  it("enumerates exactly what the old enumerators did, over the library", () => {
    expect(cases.length).toBeGreaterThanOrEqual(100);
    for (const c of cases) {
      const old = oldBuildValidSourcePaths(c);
      expect(enumerateSourcePaths(c, { deathMethod: true })).toEqual(old);
      expect(enumerateSourcePaths(c, { deathMethod: false })).toEqual(old.filter((p) => p !== "CASE.death_method"));
    }
  });

  it("every worker-legal path it enumerates matches a worker pattern (validator ⊆ enumerator's families)", () => {
    for (const c of cases.slice(0, 20)) {
      for (const p of enumerateSourcePaths(c, { deathMethod: false })) {
        expect(WORKER_LEGAL_SOURCE_PATTERNS.some((re) => re.test(p)), p).toBe(true);
      }
    }
  });
});
