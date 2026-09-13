import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadEnvFiles } from "../jobs/cli-runtime.js";

/**
 * A_91 — the worker's hand-rolled env parser did not strip inline comments while the canary path's
 * `dotenv` did, so one file gave two different values depending on the entry point.
 *
 *     AGENT9_PROMPT_TOKEN_CEILING=56000  # raised from 40000 2026-09-04
 *
 * became NaN here, and the prose prompt ceiling fell back to its 24,000 default on every resumed
 * run. MEASURED in the prompts: fresh run `budget=56000 … dropped=[none]`; the two resumes that
 * followed `budget=24000 … dropped=[humour_guide, background_context, location_profiles]`.
 */
const KEYS = ["A91_NUMBER", "A91_COMMENTED_BOOL", "A91_QUOTED", "A91_HASH_IN_VALUE", "A91_PLAIN"];
const dirs: string[] = [];
afterEach(() => {
  for (const k of KEYS) delete process.env[k];
  for (const d of dirs.splice(0)) fs.rmSync(d, { recursive: true, force: true });
});

const withEnvFile = (body: string) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "a91-env-"));
  dirs.push(dir);
  fs.writeFileSync(path.join(dir, ".env.local"), body, "utf8");
  loadEnvFiles(dir);
};

describe("loadEnvFiles — inline comments", () => {
  it("strips the comment so a NUMBER is a number", () => {
    withEnvFile("A91_NUMBER=56000  # raised from 40000 2026-09-04: run 22362\n");
    expect(process.env.A91_NUMBER).toBe("56000");
    expect(Number(process.env.A91_NUMBER)).toBe(56000);
    expect(Number.isFinite(Number(process.env.A91_NUMBER))).toBe(true);
  });

  it("a commented boolean keeps only its value", () => {
    withEnvFile("A91_COMMENTED_BOOL=true   # because of A_67\n");
    expect(process.env.A91_COMMENTED_BOOL).toBe("true");
  });

  it("a quoted value is left exactly as quoted, hash and all", () => {
    withEnvFile('A91_QUOTED="keep # this"\n');
    expect(process.env.A91_QUOTED).toBe("keep # this");
  });

  it("a hash with no leading space is part of the value", () => {
    withEnvFile("A91_HASH_IN_VALUE=abc#def\n");
    expect(process.env.A91_HASH_IN_VALUE).toBe("abc#def");
  });

  it("an ordinary value is unchanged", () => {
    withEnvFile("A91_PLAIN=hello world\n");
    expect(process.env.A91_PLAIN).toBe("hello world");
  });
});
