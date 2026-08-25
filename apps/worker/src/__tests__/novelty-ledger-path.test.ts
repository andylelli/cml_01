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
import { execFileSync } from "child_process";
import { pathToFileURL } from "url";
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
  /**
   * Resolve the path in a CHILD PROCESS whose cwd we control, rather than calling `process.chdir()`
   * here.
   *
   * The first version of this test did chdir-and-restore in-process. It passed in isolation and
   * under vitest's default worker-thread pool, and BROKE `runtime-paths.test.ts` the moment the
   * suite ran single-threaded — because cwd is global to the process, and under a shared pool one
   * test's chdir is every other test's environment. A test for "does not depend on cwd" that
   * corrupts cwd for its neighbours is not a test worth having.
   */
  const distModule = path.join(resolveWorkspaceRoot(), "apps", "worker", "dist", "jobs", "novelty-ledger.js");

  const resolveInChildProcess = (cwd: string): string => {
    const href = pathToFileURL(distModule).href;
    const script = `import(${JSON.stringify(href)}).then(m => process.stdout.write(m.noveltyLedgerPath()));`;
    return execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      cwd,
      encoding: "utf8",
      env: { ...process.env, CML_NOVELTY_LEDGER_PATH: "" },
    }).trim();
  };

  /**
   * Runs against `dist`, deliberately — that is what production loads (`dev` is `node dist/index.js`,
   * A_73 §19.1), and a child process cannot import the TypeScript source the way vitest can.
   * Skipped rather than failed when dist is absent: a missing build is not evidence about cwd.
   */
  it.skipIf(!existsSync(distModule))("does not depend on cwd", () => {
    const repoRoot = resolveWorkspaceRoot();
    const fromRoot = resolveInChildProcess(repoRoot);
    const fromElsewhere = resolveInChildProcess(path.dirname(repoRoot));
    expect(
      fromElsewhere,
      "the ledger path changed when cwd changed — this is exactly the A_73 §12.1 defect",
    ).toBe(fromRoot);
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
