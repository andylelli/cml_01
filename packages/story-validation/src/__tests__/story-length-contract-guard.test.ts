import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const THIS_FILE = fileURLToPath(import.meta.url);
const TEST_DIR = fileURLToPath(new URL(".", import.meta.url));
const WORKSPACE_ROOT = fileURLToPath(new URL("../../../../", import.meta.url));
const CANONICAL_TARGETS_FILE = join(
  WORKSPACE_ROOT,
  "packages",
  "story-validation",
  "src",
  "story-length-targets.ts",
);

const ALLOWED_EXTENSIONS = new Set([".ts", ".js"]);
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "coverage", ".turbo"]);

const FORBIDDEN_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: "scenes target literal", regex: /\bscenes\s*:\s*(20|30|42)\b/ },
  { label: "chapters target literal", regex: /\bchapters\s*:\s*(20|30|42)\b/ },
  {
    label: "chapterMinWords target literal",
    regex: /\bchapterMinWords\s*:\s*(800|1_?200|1_?500)\b/,
  },
  { label: "minWords target literal", regex: /\bminWords\s*:\s*(15_?000|40_?000|70_?000)\b/ },
  {
    label: "maxWords target literal",
    regex: /\bmaxWords\s*:\s*(25_?000|60_?000|100_?000)\b/,
  },
];

type Violation = {
  file: string;
  line: number;
  label: string;
  source: string;
};

const shouldSkipFile = (absolutePath: string): boolean => {
  const rel = relative(WORKSPACE_ROOT, absolutePath).replace(/\\/g, "/");
  if (rel.includes("/__tests__/")) return true;
  if (rel.includes(".test.")) return true;
  if (rel.endsWith("story-length-contract-guard.test.ts")) return true;
  return false;
};

const collectCodeFiles = (root: string): string[] => {
  const out: string[] = [];

  const walk = (dir: string) => {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) {
        if (entry.name !== ".github") continue;
      }

      const absolute = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        walk(absolute);
        continue;
      }

      if (!ALLOWED_EXTENSIONS.has(extname(entry.name))) continue;
      out.push(absolute);
    }
  };

  walk(root);
  return out;
};

const findViolations = (): Violation[] => {
  const roots = [join(WORKSPACE_ROOT, "apps"), join(WORKSPACE_ROOT, "packages")];
  const files = roots.flatMap(collectCodeFiles);
  const violations: Violation[] = [];

  for (const file of files) {
    if (file === CANONICAL_TARGETS_FILE) continue;
    if (file === THIS_FILE) continue;
    if (shouldSkipFile(file)) continue;

    const content = readFileSync(file, "utf8");
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const pattern of FORBIDDEN_PATTERNS) {
        if (!pattern.regex.test(line)) continue;
        violations.push({
          file: relative(WORKSPACE_ROOT, file).replace(/\\/g, "/"),
          line: index + 1,
          label: pattern.label,
          source: line.trim(),
        });
      }
    });
  }

  return violations;
};

describe("story length contract guard", () => {
  it("does not hardcode chapter/scene/word targets outside story-length-targets.ts", () => {
    const violations = findViolations();

    expect(
      violations,
      violations.length === 0
        ? ""
        : [
            "Found hardcoded story length target literals in code:",
            ...violations.map(
              (v) => `- ${v.file}:${v.line} [${v.label}] ${v.source}`,
            ),
            "Move target literals into apps/worker/config/generation-params.yaml (story_length_policy) and read via shared resolvers.",
          ].join("\n"),
    ).toEqual([]);
  });
});
