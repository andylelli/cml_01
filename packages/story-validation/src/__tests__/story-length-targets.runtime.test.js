import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { getChapterTarget, getChapterTargetTolerance, getSceneTarget, getStoryLengthTarget, getStoryLengthTargetMetadata, } from "../story-length-targets.js";
import { resetGenerationParamsCacheForTests } from "../generation-params.js";
describe("story length targets runtime config", () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    afterEach(() => {
        delete process.env.CML_GENERATION_PARAMS_PATH;
        resetGenerationParamsCacheForTests();
    });
    it("reads chapter targets from generation params YAML", () => {
        const dir = mkdtempSync(path.join(tmpdir(), "cml-story-targets-"));
        const configPath = path.join(dir, "generation-params.yaml");
        const baselinePath = path.resolve(testDir, "../../../../apps/worker/config/generation-params.yaml");
        const baselineYaml = readFileSync(baselinePath, "utf8");
        const overriddenYaml = baselineYaml
            .replace("short: 20", "short: 22")
            .replace("medium: 30", "medium: 33")
            .replace("long: 42", "long: 45")
            .replace("chapter_target_tolerance: 3", "chapter_target_tolerance: 4")
            .replace("min_words: 15000", "min_words: 18000")
            .replace("max_words: 25000", "max_words: 28000")
            .replace("chapter_ideal_words: 1000", "chapter_ideal_words: 1200");
        writeFileSync(configPath, overriddenYaml, "utf8");
        process.env.CML_GENERATION_PARAMS_PATH = configPath;
        resetGenerationParamsCacheForTests();
        expect(getChapterTarget("short")).toBe(22);
        expect(getSceneTarget("short")).toBe(22);
        expect(getChapterTarget("medium")).toBe(33);
        expect(getSceneTarget("medium")).toBe(33);
        expect(getChapterTarget("long")).toBe(45);
        expect(getSceneTarget("long")).toBe(45);
        expect(getChapterTargetTolerance()).toBe(4);
        const meta = getStoryLengthTargetMetadata("short");
        const resolved = getStoryLengthTarget("short");
        expect(meta.target.chapters).toBe(22);
        expect(meta.target.scenes).toBe(22);
        expect(meta.target.minWords).toBe(18000);
        expect(meta.target.maxWords).toBe(28000);
        expect(meta.target.chapterMinWords).toBe(818);
        expect(meta.target.chapterIdealWords).toBe(1200);
        expect(resolved.minWords).toBe(18000);
        expect(resolved.maxWords).toBe(28000);
        expect(resolved.chapterMinWords).toBe(818);
        expect(resolved.chapterIdealWords).toBe(1200);
        expect(meta.fingerprint).toContain("story_length_policy:short:22+/-4/18000-28000/818/1200");
        expect(meta.fingerprint).toContain("short:22+/-4/18000-28000/818/1200");
        rmSync(dir, { recursive: true, force: true });
    });
});
//# sourceMappingURL=story-length-targets.runtime.test.js.map