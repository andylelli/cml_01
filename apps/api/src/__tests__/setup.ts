/**
 * Vitest globalSetup: runs once before any test module is imported.
 *
 * Points the API at isolated temp persistence paths so tests never touch the
 * real data/store.json, report repository, runtime logs, or prompt docs.
 */
import { tmpdir } from "os";
import { join } from "path";
import { promises as fs } from "fs";

const tempRoot = join(tmpdir(), `cml-api-test-${process.pid}`);
const tempStorePath = join(tempRoot, "store.json");

export async function setup() {
  await fs.mkdir(tempRoot, { recursive: true });
  process.env.CML_JSON_DB_PATH = tempStorePath;
  process.env.CML_REPORTS_DIR = join(tempRoot, "reports");
  process.env.CML_ACTIVITY_LOG_FILE_PATH = join(tempRoot, "logs", "activity.jsonl");
  process.env.LOG_FILE_PATH = join(tempRoot, "logs", "llm.jsonl");
  process.env.FULL_PROMPT_LOG_FILE_PATH = join(tempRoot, "logs", "llm-prompts-full.jsonl");
  process.env.ACTUAL_PROMPT_DOCS_DIR = join(tempRoot, "actual-prompts");
  process.env.CML_WORKER_LOGS_DIR = join(tempRoot, "worker-logs");
  process.env.CML_CLEAR_DEFAULT_RUNTIME_PATHS = "false";
}

export async function teardown() {
  await fs.rm(tempRoot, { recursive: true, force: true });
}
