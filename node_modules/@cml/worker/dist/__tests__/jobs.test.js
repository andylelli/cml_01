import { describe, expect, it } from "vitest";
import { jobRegistry } from "../jobs/index.js";
describe("worker job registry (phase 1)", () => {
    it("includes all phase 1 job names", () => {
        expect(Object.keys(jobRegistry)).toEqual([
            "settingJob",
            "castJob",
            "cmlJob",
            "validateCmlJob",
            "cluesJob",
            "outlineJob",
            "proseJob",
            "gamePackJob",
            "fullPipelineJob",
        ]);
    });
    it("runs placeholder job handlers", async () => {
        const originalEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const originalApiKey = process.env.AZURE_OPENAI_API_KEY;
        process.env.AZURE_OPENAI_ENDPOINT = "";
        process.env.AZURE_OPENAI_API_KEY = "";
        try {
            await expect(jobRegistry.settingJob({})).rejects.toThrow(/Azure OpenAI credentials/i);
        }
        finally {
            process.env.AZURE_OPENAI_ENDPOINT = originalEndpoint;
            process.env.AZURE_OPENAI_API_KEY = originalApiKey;
        }
    });
});
//# sourceMappingURL=jobs.test.js.map