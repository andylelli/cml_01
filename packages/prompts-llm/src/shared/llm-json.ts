/**
 * CR-20 (ORC-04, A34-06, A1X-03) — the one parse ladder for an LLM's JSON payload.
 *
 * Ten generators each carried their own: strict parse, then (sometimes) the truncation guard from
 * `json-boundary.ts`, then jsonrepair, then (sometimes) the outermost `{…}` span parsed strictly and
 * then repaired. The steps were the same; which ones ran was not, and four boundaries ran jsonrepair
 * with no truncation guard. The policy is now two explicit options, so a boundary's rule is visible at
 * the call site and changing it is one word:
 *
 *   guard    refuse a truncation-shaped payload rather than let jsonrepair close it (the a3c2973f
 *            phantom-structure class). OFF at 2b, 2c, 5, 7 and Agent 4, as before this module; turning it
 *            on there is the owner's call (ORC-Q03): a payload repaired today would be refused and retried.
 *   extract  after repair fails, try the outermost `{…}` span: "strict" parses it, "strict+repair" also
 *            repairs it.
 *
 * Callers keep their own error messages — several reach a retry prompt — so this reports what happened
 * rather than throwing. `llm-json.test.ts` pins it against verbatim copies of the ladders it replaced.
 */
import { jsonrepair } from "jsonrepair";
import { looksTruncatedJson } from "./json-boundary.js";

export interface LlmJsonOptions {
  guard: boolean;
  extract?: "none" | "strict" | "strict+repair";
}

export interface LlmJsonResult<T> {
  /** The parsed value; undefined when every step failed or the guard refused the payload. */
  data: T | undefined;
  /** jsonrepair produced the value. */
  repaired: boolean;
  /** The guard refused a truncation-shaped payload (only with `guard: true`). */
  truncated: boolean;
  /** The value came from the outermost `{…}` span. */
  extracted: boolean;
  /** The last strict-parse error: the whole payload's, then the span's if one was tried. Unset on a strict success. */
  parseError?: Error;
  /** What jsonrepair (or parsing its output) threw on the whole payload, when that step ran and failed. */
  repairError?: Error;
}

export function parseLlmJson<T = unknown>(raw: string, options: LlmJsonOptions): LlmJsonResult<T> {
  const flags = { repaired: false, truncated: false, extracted: false };
  let parseError: Error | undefined;
  let repairError: Error | undefined;
  try {
    return { data: JSON.parse(raw) as T, ...flags };
  } catch (error) {
    parseError = error as Error;
  }
  if (options.guard && looksTruncatedJson(raw)) {
    return { data: undefined, ...flags, truncated: true, parseError };
  }
  try {
    return { data: JSON.parse(jsonrepair(raw)) as T, ...flags, repaired: true, parseError };
  } catch (error) {
    repairError = error as Error;
  }
  const extract = options.extract ?? "none";
  if (extract !== "none") {
    const trimmed = raw.trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      const candidate = trimmed.slice(start, end + 1);
      try {
        return { data: JSON.parse(candidate) as T, ...flags, extracted: true, parseError, repairError };
      } catch (error) {
        parseError = error as Error;
      }
      if (extract === "strict+repair") {
        try {
          return { data: JSON.parse(jsonrepair(candidate)) as T, ...flags, repaired: true, extracted: true, parseError, repairError };
        } catch {
          /* fall through */
        }
      }
    }
  }
  return { data: undefined, ...flags, parseError, repairError };
}

/**
 * The YAML fallback's line sanitiser, for a CML the model returned as YAML: drops a trailing remark after a
 * quoted value and comments out a line that is neither a key nor a list item. A34-06: Agents 3 and 4 each
 * declared it inside their attempt loop, byte-identical apart from whitespace.
 */
/**
 * A YAML reply: parsed as written first, and through `sanitizeYaml` only when that does not give a mapping.
 *
 * `sanitizeYaml` comments out every line without a colon. That rescues stray prose around a mapping, but it
 * corrupts a wrapped string: a folded (`>-`) continuation line keeps the "# " as literal text, and a plain
 * scalar's continuation is cut off. MEASURED (found applying owner decision 3, 2026-09-30): a library case
 * round-tripped through `yaml.dump` came back with 15+ fields reading "# …". Both CML agents always sanitised
 * first. `load` is the site's own YAML parser (Agent 3 and Agent 4 use different libraries, A34-06).
 */
export function loadYamlReply(raw: string, load: (text: string) => unknown): { value: unknown; sanitized: boolean } {
  try {
    const value = load(raw);
    if (value !== null && typeof value === "object" && !Array.isArray(value)) return { value, sanitized: false };
  } catch {
    /* not YAML as written — try the sanitised text */
  }
  return { value: load(sanitizeYaml(raw)), sanitized: true };
}

export const sanitizeYaml = (raw: string): string =>
  raw
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;

      const doubleQuoteMatch = line.match(/^([\s\S]*?:\s*"(?:[^"\\]|\\.)*")\s+(.+)$/);
      if (doubleQuoteMatch && !doubleQuoteMatch[2].trimStart().startsWith("#")) {
        return doubleQuoteMatch[1];
      }

      const singleQuoteMatch = line.match(/^([\s\S]*?:\s*'(?:[^'\\]|\\.)*')\s+(.+)$/);
      if (singleQuoteMatch && !singleQuoteMatch[2].trimStart().startsWith("#")) {
        return singleQuoteMatch[1];
      }

      if (!trimmed.includes(":")) {
        const isListItem = trimmed.startsWith("-") || trimmed.startsWith("[") || trimmed.startsWith("{");
        if (!isListItem) {
          const indentMatch = line.match(/^(\s*)/);
          const indent = indentMatch ? indentMatch[1] : "";
          return `${indent}# ${trimmed}`;
        }
      }

      return line;
    })
    .join("\n");
