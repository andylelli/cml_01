import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { afterEach, describe, expect, it, vi } from "vitest";
import { generateCML } from "../agent3-cml.js";

/**
 * CR-21 (A34-07) — characterisation of generateCML's attempt loop and its escalation to Agent 4, written
 * before the loop is restructured. Scripted Agent 3 replies (chatWithRetry) and Agent 4 replies (chat),
 * over the paths the loop takes: valid first time, a parse failure then valid, invalid until Agent 4
 * rewrites it, Agent 4 failing (graceful degrade on, then off). Per scenario: each call's agent and a digest
 * of its messages, and a digest of the result (or the thrown message).
 */
const FLAGS = ["AGENT4_GRACEFUL_DEGRADE", "CML_REPAIR_MODE"];
const saved: Record<string, string | undefined> = {};
afterEach(() => { for (const f of FLAGS) { if (saved[f] === undefined) delete process.env[f]; else process.env[f] = saved[f]; } vi.restoreAllMocks(); });

const WORK = join(__dirname, "..", "..", "..", "..", "library", "works", "a_jury_of_her_peers", "case.cml2.yaml");
const valid = JSON.stringify(yaml.load(readFileSync(WORK, "utf8")));
const invalid = JSON.stringify({ CML_VERSION: 2, CASE: { meta: { title: "Thin" }, inference_path: { steps: "none" } } });
const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);

const inputs = {
  decade: "1910s", location: "A farmhouse", institution: "Farm", tone: "Classic", weather: "Cold",
  socialStructure: "Rural", primaryAxis: "behavioral", castSize: 4,
  castNames: ["Martha Hale", "Mrs Peters", "John Wright", "Minnie Wright"], detectiveType: "Amateur",
  victimArchetype: "John Wright", complexityLevel: "moderate", mechanismFamilies: ["strangulation"],
  runId: "a347-run", projectId: "a347-project",
} as any;

async function run(agent3: string[], agent4: string[], env: Record<string, string> = {}) {
  for (const f of FLAGS) saved[f] = process.env[f];
  for (const [k, v] of Object.entries(env)) process.env[k] = v;
  for (const level of ["warn", "error", "log"] as const) vi.spyOn(console, level).mockImplementation(() => {});
  const calls: Array<{ via: string; agent: unknown; messages: string }> = [];
  let a3 = 0, a4 = 0;
  const logger = { logRequest: async () => {}, logResponse: async () => {}, logError: async () => {} };
  const client = {
    getLogger: () => logger,
    getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    chatWithRetry: async (req: any) => {
      calls.push({ via: "chatWithRetry", agent: req.logContext?.agent, messages: digest(req.messages) });
      return { model: "m", content: agent3[Math.min(a3++, agent3.length - 1)], latencyMs: 1, finishReason: "stop" };
    },
    chat: async (req: any) => {
      calls.push({ via: "chat", agent: req.logContext?.agent, messages: digest(req.messages) });
      return { model: "m", content: agent4[Math.min(a4++, agent4.length - 1)], latencyMs: 1, finishReason: "stop" };
    },
  };
  try {
    const r = await generateCML(client as any, inputs, undefined, 2);
    return {
      calls,
      result: {
        cml: digest(r.cml), attempt: r.attempt, valid: r.validation.valid, errors: r.validation.errors.length,
        revisedByAgent4: r.revisedByAgent4 ?? false, degraded: (r as any).degraded ?? false, notes: r.normalizationNotes,
      },
    };
  } catch (e) {
    return { calls, threw: (e as Error).message.slice(0, 300) };
  }
}

describe("generateCML characterisation (A34-07)", () => {
  it("valid on the first attempt", async () => { expect(await run([valid], [valid])).toMatchSnapshot(); });
  it("parse failure, then valid", async () => { expect(await run(["{not json", valid], [valid])).toMatchSnapshot(); });
  it("invalid on every attempt; Agent 4 rewrites it valid", async () => { expect(await run([invalid, invalid], [valid])).toMatchSnapshot(); });
  it("invalid on every attempt; Agent 4 fails, degrade on", async () => { expect(await run([invalid, invalid], ["garbage", "garbage", "garbage"], { AGENT4_GRACEFUL_DEGRADE: "true" })).toMatchSnapshot(); });
  it("invalid on every attempt; Agent 4 fails, degrade off", async () => { expect(await run([invalid, invalid], ["garbage", "garbage", "garbage"], { AGENT4_GRACEFUL_DEGRADE: "false" })).toMatchSnapshot(); });
  it("parse failure on every attempt", async () => { expect(await run(["{not json", "{still not"], [valid])).toMatchSnapshot(); });
});
