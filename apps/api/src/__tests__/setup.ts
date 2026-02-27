/**
 * Vitest globalSetup — runs once before any test module is imported.
 *
 * Sets CML_JSON_DB_PATH to a temp file so the API server never touches the
 * real data/store.json during test runs. The temp file is deleted on teardown.
 */
import { tmpdir } from "os";
import { join } from "path";
import { promises as fs } from "fs";

const tempStorePath = join(tmpdir(), `cml-test-store-${process.pid}.json`);

export async function setup() {
  // Point the API at an isolated temp store before createServer() is called
  process.env.CML_JSON_DB_PATH = tempStorePath;
}

export async function teardown() {
  try {
    await fs.unlink(tempStorePath);
  } catch {
    // already gone — fine
  }
}
