import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { afterEach, describe, expect, it, vi } from "vitest";
import { reviseCml } from "../agent4-revision.js";

/**
 * CR-21 (A34-07) — characterisation of reviseCml's revision loop before its reply parsing and degrade path
 * move out of it. Scripted Agent 4 replies over: valid first time, a YAML reply, garbage then valid, garbage
 * throughout (degrade on and off), and a reply that stays invalid (the no-progress guard). Per scenario:
 * each call's digest of messages, and a digest of the result or the thrown message.
 */
const FLAGS = ["AGENT4_GRACEFUL_DEGRADE", "AGENT4_MAX_COST_USD"];
const saved: Record<string, string | undefined> = {};
afterEach(() => { for (const f of FLAGS) { if (saved[f] === undefined) delete process.env[f]; else process.env[f] = saved[f]; } vi.restoreAllMocks(); });

const WORK = join(__dirname, "..", "..", "..", "..", "library", "works", "a_jury_of_her_peers", "case.cml2.yaml");
const validObj = yaml.load(readFileSync(WORK, "utf8")) as Record<string, any>;
const valid = JSON.stringify(validObj);
const invalidObj = { CML_VERSION: 2, CASE: { meta: { title: "Thin" }, inference_path: { steps: "none" } } };
const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);

async function run(replies: string[], env: Record<string, string> = {}) {
  for (const f of FLAGS) saved[f] = process.env[f];
  for (const [k, v] of Object.entries(env)) process.env[k] = v;
  for (const level of ["warn", "error", "log"] as const) vi.spyOn(console, level).mockImplementation(() => {});
  const calls: string[] = [];
  let i = 0;
  const logger = { logRequest: async () => {}, logResponse: async () => {}, logError: async () => {} };
  const client = {
    getLogger: () => logger,
    getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    chat: async (req: any) => {
      calls.push(digest(req.messages));
      return { model: "m", content: replies[Math.min(i++, replies.length - 1)], latencyMs: 1, finishReason: "stop" };
    },
  };
  try {
    const r = await reviseCml(client as any, {
      originalPrompt: { system: "s", developer: "d", user: "u" },
      invalidCml: yaml.dump(invalidObj),
      validationErrors: ["CASE.cast is required", "inference_path.steps must be an array"],
      attempt: 1, runId: "a347-rev", projectId: "a347-proj",
    }, 3);
    return {
      calls,
      result: {
        cml: digest(r.cml), valid: r.validation.valid, errors: r.validation.errors.length, attempt: r.attempt,
        revisions: r.revisionsApplied.length, degraded: r.degraded ?? false, unresolved: r.unresolvedLogicWarnings?.length ?? 0,
      },
    };
  } catch (e) {
    return { calls, threw: (e as Error).message.slice(0, 300) };
  }
}

describe("reviseCml characterisation (A34-07)", () => {
  it("valid on the first reply", async () => { expect(await run([valid])).toMatchSnapshot(); });
  it("a YAML reply", async () => { expect(await run([yaml.dump(validObj)])).toMatchSnapshot(); });
  it("garbage, then valid", async () => { expect(await run(["garbage", valid])).toMatchSnapshot(); });
  it("garbage throughout, degrade on", async () => { expect(await run(["garbage"], { AGENT4_GRACEFUL_DEGRADE: "true" })).toMatchSnapshot(); });
  it("garbage throughout, degrade off", async () => { expect(await run(["garbage"], { AGENT4_GRACEFUL_DEGRADE: "false" })).toMatchSnapshot(); });
  it("stays invalid (no-progress guard), degrade on", async () => { expect(await run([JSON.stringify(invalidObj)], { AGENT4_GRACEFUL_DEGRADE: "true" })).toMatchSnapshot(); });
  it("stays invalid, degrade off", async () => { expect(await run([JSON.stringify(invalidObj)], { AGENT4_GRACEFUL_DEGRADE: "false" })).toMatchSnapshot(); });
});
