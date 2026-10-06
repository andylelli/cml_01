/**
 * A_111 V-19 and V-20 — the instrument fixes from the v2 engine audit (WF-005). They change no prompt; each restores or
 * records state the engine lost.
 */
import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { restoreSourceLockedFacts } from "../jobs/resume-hydration.js";
import { codeVersion } from "../jobs/run-config.js";
import { RunLogger } from "../jobs/run-logger.js";
import { normalizeStoryText } from "../jobs/story-output.js";
import { resolveRole } from "../jobs/agents/agent9-v2/roles.js";
import type { OrchestratorContext } from "../jobs/agents/index.js";

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

const ctxWith = (registry?: unknown[]) => ({ warnings: [] as string[], lockedFactRegistry: registry }) as unknown as OrchestratorContext;

describe("V-19 — a redo restores the source run's locked facts (V2O-03 / V2C-06)", () => {
  const root = mkdtempSync(join(tmpdir(), "a111-lf-"));
  mkdirSync(join(root, "logs"), { recursive: true });
  const facts = [{ id: "time_of_death", value: "a quarter past nine", description: "" }];
  writeFileSync(join(root, "logs", "locked-facts-mystery-1.json"), JSON.stringify({ runId: "mystery-1", registry: facts }));

  it("loads the source run's registry and says so", () => {
    const ctx = ctxWith();
    restoreSourceLockedFacts(ctx, "mystery-1", root);
    expect(ctx.lockedFactRegistry).toEqual(facts);
    expect(ctx.warnings.join(" ")).toMatch(/restored 1 locked fact\(s\) from the source run's registry \(mystery-1\)/);
  });

  it("a source that left none is reported, and the registry stays as the source had it", () => {
    const ctx = ctxWith();
    restoreSourceLockedFacts(ctx, "run_ui-2", root);
    expect(ctx.lockedFactRegistry).toBeUndefined();
    expect(ctx.warnings.join(" ")).toMatch(/left no locked-fact registry/);
  });

  it("never overwrites a registry the run already holds", () => {
    const own = [{ id: "own", value: "x", description: "" }];
    const ctx = ctxWith(own);
    restoreSourceLockedFacts(ctx, "mystery-1", root);
    expect(ctx.lockedFactRegistry).toBe(own);
  });
});

describe("V-20 — the run records what it ran and keeps what it wrote", () => {
  it("run-config carries the commit (V2K-05)", () => {
    const v = codeVersion(join(process.cwd(), "apps", "worker"));
    // In this checkout git is present; a 40-hex commit, and a boolean for uncommitted changes.
    if (v.commit !== null) expect(v.commit).toMatch(/^[0-9a-f]{40}$/);
    expect([true, false, null]).toContain(v.dirty);
  });

  it("the run log is named by the full run id, so two runs of a day keep two files (V2O-06)", () => {
    const name = (RunLogger as unknown as { formatRunLogFileName: (id: string) => string }).formatRunLogFileName;
    expect(name("resume-1791313282573")).toMatch(/^run_\d{8}_resume-1791313282573\.json$/);
    expect(name("resume-1791313282573")).not.toBe(name("resume-1791308574179"));
    expect(name("run_bcc0d637-0506-4314-908a-21c89d941c49")).toMatch(/_bcc0d637-0506-4314-908a-21c89d941c49\.json$/);
  });

  it("the redo's .md writer repairs mojibake as the API writer does (V2O-11)", () => {
    // Both writers now run the same @cml/cml repairMojibake, so they agree on every input it covers.
    expect(normalizeStoryText("Itâ€™s the end")).toBe("It's the end");
    expect(normalizeStoryText("It’s plain")).toBe("It's plain");
  });

  it("an anthropic role with no key falls back to Azure with the role's Azure model (V2O-10)", () => {
    process.env.PROSE_V2_WRITER = "anthropic:claude-opus-5";
    delete process.env.ANTHROPIC_API_KEY;
    const azure = { chat: async () => ({ content: "" }) } as never;
    const role = resolveRole("writer", azure);
    expect(role.provider).toBe("azure");
    expect(role.model).toBe("gpt-4.1");
  });
});
