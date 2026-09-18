import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * EVERY `goTo(...)` MUST NAME A TAB THAT EXISTS.
 *
 * Panels are `v-if`'d on `activeMainTab`, so navigating to a tab id that does not exist matches
 * nothing and the console renders a BLANK PAGE with no error anywhere. It has happened twice:
 *
 *   - the "Fix →" button on validation rows pointed at a `spec` tab removed in UI-006
 *   - UI-009 renamed the tabs, and four links were left pointing at `review` and `advanced`
 *
 * Both were found by reading, not by failing. This reads the source instead, because the bug is a
 * string that does not match another string and no amount of mounting will surface it unless a test
 * happens to click that exact control in that exact state.
 */

const ROOT = join(__dirname, "..", "..", "..");

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === "__tests__" || entry === "node_modules" ? [] : sourceFiles(full);
    }
    return /\.(vue|ts)$/.test(entry) ? [full] : [];
  });

/** The tab ids `mainTabs` declares, read from the source so the test cannot drift from it. */
const declaredTabIds = (): string[] => {
  const state = readFileSync(join(ROOT, "views", "workshop", "useWorkshopState.ts"), "utf8");
  const block = state.match(/const mainTabs = computed<Tab\[\]>\(\(\) => \[([\s\S]*?)\]\);/);
  expect(block, "could not find mainTabs in useWorkshopState.ts").toBeTruthy();
  return [...block![1].matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
};

describe("workshop navigation", () => {
  it("declares the tabs this test expects", () => {
    expect(declaredTabIds()).toEqual(["build", "inspect", "export"]);
  });

  it("never navigates to a tab that does not exist", () => {
    const valid = new Set(declaredTabIds());
    const offenders: string[] = [];

    // A literal only. `goTo(tab)` and messages containing "${tab}" are not navigation targets —
    // the first is checked at runtime by goTo's own guard, the second is just text.
    const isLiteral = (id: string) => !id.includes("${");

    for (const file of sourceFiles(ROOT)) {
      const src = readFileSync(file, "utf8");
      for (const call of src.matchAll(/goTo\(\s*["'`]([^"'`]+)["'`]/g)) {
        if (isLiteral(call[1]) && !valid.has(call[1])) {
          offenders.push(`${file.replace(ROOT, "")}: goTo("${call[1]}")`);
        }
      }
      // The same mistake, written the other way.
      for (const call of src.matchAll(/activeMainTab(?:\.value)?\s*=\s*["'`]([^"'`]+)["'`]/g)) {
        if (isLiteral(call[1]) && !valid.has(call[1])) {
          offenders.push(`${file.replace(ROOT, "")}: activeMainTab = "${call[1]}"`);
        }
      }
    }

    expect(offenders, `these navigate to tabs that do not exist:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });
});
