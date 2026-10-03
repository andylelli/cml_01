/**
 * When does a pipeline run make a cover? Read at CALL time (ADR-0004).
 *
 *   spec / CLI value  "off" | "auto" | "auto:N" | "<card-id>" | "<a>+<b>"   — the per-run choice (UI dropdown, --cover)
 *   CML_COVER_GEN     on → runs with no explicit choice get "auto". Default OFF.
 *
 * An explicit "off" beats the env; an explicit style beats the env. Returns the style spec to use, or
 * null for no cover.
 */
const ON = new Set(["1", "true", "on", "yes"]);

export const coverGenEnabled = (raw = process.env.CML_COVER_GEN) => ON.has((raw ?? "").trim().toLowerCase());

export const resolveCoverRequest = (explicit: unknown, envRaw = process.env.CML_COVER_GEN): string | null => {
  const v = typeof explicit === "string" ? explicit.trim() : "";
  if (v.toLowerCase() === "off" || v.toLowerCase() === "none") return null;
  if (v) return v;
  return coverGenEnabled(envRaw) ? "auto" : null;
};
