/**
 * CR-12 (A1X-04) — the cast's enum coercers, once.
 *
 * `designCast` (inline, per character) and the worker's `normaliseCastOutput` (as closures) each coerced a
 * model's near-miss enum values with the same patterns and defaults. These are the worker's bodies, moved
 * verbatim; both now call them. Gender is not here: designCast maps to a binary vocabulary and
 * normaliseCastOutput is binary too since owner decision 10 (2026-10-01).
 */

export const coerceMotiveStrength = (value: unknown): "weak" | "moderate" | "strong" | "compelling" => {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw === "weak" || raw === "moderate" || raw === "strong" || raw === "compelling") {
    return raw;
  }
  if (/compell|overwhelm|extreme|decisive|certain/.test(raw)) return "compelling";
  if (/strong|high|powerful|major|serious/.test(raw)) return "strong";
  if (/moderate|medium|mixed|balanced/.test(raw)) return "moderate";
  if (/weak|low|minor|slight|none|n\/a|na|unknown|unclear/.test(raw)) return "weak";
  return "moderate";
};

export const coerceAccessPlausibility = (value: unknown): "impossible" | "unlikely" | "possible" | "easy" => {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw === "impossible" || raw === "unlikely" || raw === "possible" || raw === "easy") {
    return raw;
  }
  if (/certain|definite|guarant|easy|high|sure/.test(raw)) return "easy";
  if (/like|probable|often|common|frequent/.test(raw)) return "possible";
  if (/unlike|improbab|rare|seldom|difficult|hard/.test(raw)) return "unlikely";
  if (/impossible|never|no.access|barred/.test(raw)) return "impossible";
  return "possible";
};

export const coerceRelationshipTension = (value: unknown): "none" | "low" | "moderate" | "high" => {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw === "none" || raw === "low" || raw === "moderate" || raw === "high") {
    return raw;
  }
  if (/none|no\s*tension|neutral|calm/.test(raw)) return "none";
  if (/low|mild|minor|slight/.test(raw)) return "low";
  if (/moderate|medium|mixed/.test(raw)) return "moderate";
  if (/high|severe|intense|strong/.test(raw)) return "high";
  return "moderate";
};
