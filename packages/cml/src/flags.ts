/**
 * Owner decision 9 (2026-10-01, ORC-Q05) — ONE boolean-flag vocabulary.
 *
 * The code review counted eight: some reads accepted only "true", some only "1", one also "y"/"n", most
 * `1|true|yes|on` — so `AGENT7_STRUCTURED_OUTPUT=on` read as OFF. Now every converted read accepts
 * `1|true|yes|on` as on and `0|false|no|off` as off (case-insensitive, trimmed); anything else is warned
 * about once per flag and falls back to the flag's default. The raw value each run saw is recorded in the run's
 * flag record (CR-22), so the change is auditable run by run. Read at call time (ADR-0004).
 */
export const FLAG_ON_VALUES: readonly string[] = ["1", "true", "yes", "on"];
export const FLAG_OFF_VALUES: readonly string[] = ["0", "false", "no", "off"];

const warned = new Set<string>();

export function readBooleanFlag(name: string, defaultValue: boolean, env: Record<string, string | undefined> = process.env): boolean {
  const raw = String(env[name] ?? "").trim().toLowerCase();
  if (!raw) return defaultValue;
  if (FLAG_ON_VALUES.includes(raw)) return true;
  if (FLAG_OFF_VALUES.includes(raw)) return false;
  if (!warned.has(name)) {
    warned.add(name);
    console.warn(`[flags] ${name}=${JSON.stringify(env[name])} is not a recognised value (1|true|yes|on or 0|false|no|off); using its default (${defaultValue ? "on" : "off"}).`);
  }
  return defaultValue;
}
