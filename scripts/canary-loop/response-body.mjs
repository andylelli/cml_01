/**
 * The ONE reader for a prompt-log response body.
 *
 * `canary-agent-boundary.mjs` and `canary-agent3.mjs` each carried a byte-identical private copy of
 * this — the two-bodies-for-one-concept shape that `readLatestAgentJson`'s own comment warns about,
 * two files further along the same call path. N5 needed a third caller, so the copies became one
 * body rather than three.
 */

import fs from "fs/promises";
import { parseJsonText } from "./json.mjs";

/** The fenced `text` block under `## Response Body`, parsed. Throws when absent or malformed. */
export function extractResponseJson(markdown) {
  const textBlockMatch = String(markdown ?? "").match(/##\s+Response Body[\s\S]*?```text\s*([\s\S]*?)```/i);
  if (!textBlockMatch) {
    throw new Error("Unable to parse response body JSON block.");
  }
  const raw = textBlockMatch[1].trim();
  try {
    return parseJsonText(raw);
  } catch (error) {
    throw new Error(
      `Response body JSON parse failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/** The same, given a path. */
export async function readResponseJson(filePath) {
  return extractResponseJson(await fs.readFile(filePath, "utf8"));
}
