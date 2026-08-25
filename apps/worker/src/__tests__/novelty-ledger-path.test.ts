/**
 * A_73 §12.1 / §22.2 — the DEFAULT path resolution, which no test exercised.
 *
 * `novelty-ledger.test.ts` passes an explicit `ledgerPath` to every call, so it proved load and
 * append work and was structurally incapable of noticing that production looked in the wrong
 * directory: `noveltyLedgerPath()` resolved against `process.cwd()`, and `npm run -w @cml/worker dev`
 * runs with cwd = `apps/worker`, which has never contained a `data/` folder. The catch-all in
 * `loadNoveltyLedger` then turned "wrong directory" into "no prior runs", silently — on the one
 * mechanism A_72 §2.1 measured as the pipeline's only engine for the marks the reader pays 9s for.
 *
 * The generalisable lesson, and the reason this file exists: a test that SUPPLIES a dependency by
 * parameter cannot detect a defect in how that dependency is RESOLVED by default.
 */
import { describe, it, expect, afterEach } from "vitest";
import path from "path";
import { existsSync } from "fs";
import {
  noveltyLedgerPath,
  legacyNoveltyLedgerPaths,
  activeNoveltyLedgerPath,
  resolveWorkspaceRoot,
} from "../jobs/novelty-ledger.js";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("novelty ledger path resolution", () => {
  it("does not depend on cwd", () => {
    delete process.env.CML_NOVELTY_LEDGER_PATH;
    const fromHere = noveltyLedgerPath();
    const originalCwd = process.cwd();
    try {
      process.chdir(path.dirname(originalCwd));
      expect(
        noveltyLedgerPath(),
        "the ledger path changed when cwd changed — this is exactly the A_73 §12.1 defect",
      ).toBe(fromHere);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it("resolves inside the workspace root, not inside a package directory", () => {
    delete process.env.CML_NOVELTY_LEDGER_PATH;
    const resolved = noveltyLedgerPath();
    expect(resolved).toBe(path.join(resolveWorkspaceRoot(), "data", "novelty-ledger.json"));
    expect(resolved).not.toContain(path.join("apps", "worker", "data"));
  });

  it("honours an explicit CML_NOVELTY_LEDGER_PATH override", () => {
    process.env.CML_NOVELTY_LEDGER_PATH = path.join("X:", "elsewhere", "ledger.json");
    expect(noveltyLedgerPath()).toBe(path.join("X:", "elsewhere", "ledger.json"));
  });

  it("still READS the legacy cwd-dependent locations, so an existing ledger is not abandoned", () => {
    delete process.env.CML_NOVELTY_LEDGER_PATH;
    const legacy = legacyNoveltyLedgerPaths();
    expect(legacy.some((p) => p.includes(path.join("apps", "api", "data")))).toBe(true);
    expect(legacy.some((p) => p.includes(path.join("apps", "worker", "data")))).toBe(true);
  });

  it("the active path is the canonical one, or the first legacy file that exists", () => {
    delete process.env.CML_NOVELTY_LEDGER_PATH;
    const active = activeNoveltyLedgerPath();
    const candidates = [noveltyLedgerPath(), ...legacyNoveltyLedgerPaths()];
    expect(candidates).toContain(active);
    // Whatever it picked, reader and writer agree — that is the invariant that matters.
    if (active !== noveltyLedgerPath()) {
      expect(existsSync(active)).toBe(true);
    }
  });
});
