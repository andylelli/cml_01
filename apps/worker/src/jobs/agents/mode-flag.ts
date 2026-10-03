/**
 * A mode flag (`shadow`, `enforce`, …): the lower-cased value, or "" when unset or any spelling of off.
 *
 * ORC-D07: the Agent 2/2b/2c/2e checks each hand-rolled `v && v !== "off" && v !== "false" && v !== "0"`,
 * so `AGENT2_CAST_CHECK=no` read as ON. One reader, the off-words of @cml/cml FLAG_OFF_VALUES.
 */
import { FLAG_OFF_VALUES } from "@cml/cml";

const OFF = new Set(FLAG_OFF_VALUES); // owner decision 9: the one off-vocabulary ("n" no longer)

export function readModeFlag(raw: string | undefined): string {
  const v = String(raw ?? "").trim().toLowerCase();
  return v && !OFF.has(v) ? v : "";
}
