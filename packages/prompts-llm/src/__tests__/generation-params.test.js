import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { fileURLToPath } from "url";
import { describe, expect, it, afterEach } from "vitest";
import { getGenerationParams, resetGenerationParamsCacheForTests, } from "../utils/generation-params.js";
describe("generation params loader", () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    afterEach(() => {
        delete process.env.CML_GENERATION_PARAMS_PATH;
        resetGenerationParamsCacheForTests();
    });
    it("throws when configured path is missing", () => {
        process.env.CML_GENERATION_PARAMS_PATH = path.join(tmpdir(), "does-not-exist", "params.yaml");
        resetGenerationParamsCacheForTests();
        expect(() => getGenerationParams()).toThrow("Failed to load generation params from");
    });
    it("applies YAML overrides from a single config file", () => {
        const dir = mkdtempSync(path.join(tmpdir(), "cml-gen-params-"));
        const configPath = path.join(dir, "generation-params.yaml");
        const baselinePath = path.resolve(testDir, "../../../../apps/worker/config/generation-params.yaml");
        const baselineYaml = readFileSync(baselinePath, "utf8");
        const overriddenYaml = baselineYaml
            .replace("hard_floor_relaxation_ratio: 0.88", "hard_floor_relaxation_ratio: 0.85")
            .replace("default_max_attempts: 4", "default_max_attempts: 5");
        writeFileSync(configPath, overriddenYaml, "utf8");
        process.env.CML_GENERATION_PARAMS_PATH = configPath;
        resetGenerationParamsCacheForTests();
        const config = getGenerationParams();
        expect(config.agent9_prose.word_policy.hard_floor_relaxation_ratio).toBe(0.85);
        expect(config.agent9_prose.generation.default_max_attempts).toBe(5);
        rmSync(dir, { recursive: true, force: true });
    });
});
//# sourceMappingURL=generation-params.test.js.map