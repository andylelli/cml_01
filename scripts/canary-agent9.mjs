import path from "path";
import { spawnSync } from "child_process";
import { config as loadDotEnv } from "dotenv";

const root = process.cwd();
loadDotEnv({ path: path.join(root, ".env") });
loadDotEnv({ path: path.join(root, ".env.local") });

const args = parseArgs(process.argv.slice(2));
const startChapter = toPositiveInt(args.startChapter) ?? 1;

const boundaryArgs = [
  path.join("scripts", "canary-agent-boundary.mjs"),
  "--agent",
  "9",
  ...stripFlagWithValue(process.argv.slice(2), "--agent"),
];

console.log("CANARY_AGENT", "Agent9-Prose");
console.log("FROM_CHAPTER", startChapter);
console.log("CHAPTER_START", startChapter);

const delegated = spawnSync(process.execPath, boundaryArgs, {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});

if (typeof delegated.status === "number") {
  process.exit(delegated.status);
}

if (delegated.error) {
  const message = delegated.error instanceof Error ? delegated.error.message : String(delegated.error);
  console.error(message);
}

process.exit(1);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = "true";
      continue;
    }
    out[key] = next;
    i += 1;
  }
  return out;
}

function toPositiveInt(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
}

function stripFlagWithValue(argv, flag) {
  const out = [];
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token !== flag) {
      out.push(token);
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      i += 1;
    }
  }
  return out;
}
