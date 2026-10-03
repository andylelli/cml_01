/**
 * A6-10 / A7-03 (code review, R1) — the ONE accessor for the CML prompt-header projection.
 *
 * The `legacy` / `cmlCase` / `meta` prelude and the header fields derived from it (title, primary axis,
 * crime, culprit, false assumption, inference steps, era, discriminating test, constraint lists) had five
 * bodies: agent6-fairplay.ts (narrative and full developer contexts), agent7-narrative.ts (developer
 * context and user request) and agent8-novelty.ts (`summarizeCML`). They now all read this module.
 *
 * The bodies did NOT agree, and this refactor is byte-preserving, so the differences are parameters
 * rather than fixes. Recorded here so the R2 step (A7-03 step 2, owner decision) can see them:
 *
 *   field                 Agent 6 (FA-1/2/5 audited)              Agents 7 and 8 (older)
 *   primary axis          false_assumption.type → meta.primary_axis   meta.primary_axis → false_assumption.type
 *   crime                 crime_class.subtype → category → setup.crime   setup.crime → subtype → category
 *   untitled fallback     "Untitled Mystery" (6, 7)                    "Untitled" (8)
 *   inference step text   observation / correction only (6)            + step.type / step.reasoning (7)
 *   discriminating test   legacy labels When / What / Why (6)          When / Test / Reveals (7)
 *   constraint lists      every entry (6)                              first 3 entries (7)
 *   constraint space      CASE.constraint_space ?? legacy (6, 7)       per key: CASE…time ?? legacy…time (8)
 *
 * For a CASE-shaped CML 2.0 document the precedence differences are inert: `meta.primary_axis` and
 * `setup.*` are not in the schema. They bite only on legacy-shaped input (agent7/agent8 test fixtures).
 */

/** The three roots every site derived first, plus the cast list. */
export interface CmlRoots {
  /** The CML as passed (CML 1.x top-level shape, or `{ CASE }`). */
  legacy: any;
  /** `legacy.CASE`, or `{}`. */
  cmlCase: any;
  /** `CASE.meta`, else top-level `meta`, else `{}`. */
  meta: any;
  /** `meta.crime_class`, or `{}`. */
  crimeClass: any;
  /** `CASE.cast` when it is an array, else top-level `cast`, else `[]`. */
  cast: any;
}

export function cmlRoots(cml: unknown): CmlRoots {
  const legacy = cml as any;
  const cmlCase = (legacy?.CASE ?? {}) as any;
  const meta = cmlCase.meta ?? legacy.meta ?? {};
  const crimeClass = meta.crime_class ?? {};
  const cast = Array.isArray(cmlCase.cast) ? cmlCase.cast : legacy.cast ?? [];
  return { legacy, cmlCase, meta, crimeClass, cast };
}

/** Where a site differs from the others. Each site passes its own policy; see the table above. */
export interface CasePromptPolicy {
  /** "false_assumption_first" = Agent 6 (FA-5); "meta_first" = Agents 7 and 8. */
  axisPrecedence: "false_assumption_first" | "meta_first";
  /** "crime_class_first" = Agent 6 (FA-5); "legacy_setup_first" = Agents 7 and 8. */
  crimePrecedence: "crime_class_first" | "legacy_setup_first";
  /** "Untitled Mystery" (Agents 6, 7) or "Untitled" (Agent 8). */
  untitled: string;
}

export const AGENT6_CASE_POLICY: CasePromptPolicy = {
  axisPrecedence: "false_assumption_first",
  crimePrecedence: "crime_class_first",
  untitled: "Untitled Mystery",
};
export const AGENT7_CASE_POLICY: CasePromptPolicy = {
  axisPrecedence: "meta_first",
  crimePrecedence: "legacy_setup_first",
  untitled: "Untitled Mystery",
};
export const AGENT8_CASE_POLICY: CasePromptPolicy = {
  axisPrecedence: "meta_first",
  crimePrecedence: "legacy_setup_first",
  untitled: "Untitled",
};

export interface CasePromptView extends CmlRoots {
  title: string;
  primaryAxis: string;
  crime: string;
  culpritName: string;
  falseAssumptionStatement: string;
  /** The raw inference steps (CASE first, then legacy), never rendered here. */
  inferenceSteps: any[];
  /** "decade - location" from meta, else "year - location" from legacy setup.era, else "Unknown era". */
  era: string;
  settingLocation: string;
}

export function projectCaseForPrompt(cml: unknown, policy: CasePromptPolicy): CasePromptView {
  const roots = cmlRoots(cml);
  const { legacy, cmlCase, meta, crimeClass, cast } = roots;
  const title = meta?.title || policy.untitled;
  const primaryAxis = policy.axisPrecedence === "false_assumption_first"
    // FA-5: meta.primary_axis not in CML 2.0 schema; false_assumption.type is the canonical field
    ? cmlCase.false_assumption?.type || meta?.primary_axis || "unknown"
    : meta?.primary_axis || cmlCase.false_assumption?.type || "unknown";
  const crime = policy.crimePrecedence === "crime_class_first"
    // FA-5: schema canonical order: subtype → category; setup.crime not in CML 2.0
    ? crimeClass.subtype || crimeClass.category || legacy.setup?.crime?.description || "crime"
    : legacy.setup?.crime?.description || crimeClass.subtype || crimeClass.category || "crime";
  // FA-3: CML 2.0 has no setup.crime.victim field; victim info lives in hidden_model.outcome.result
  const culpritName = cmlCase.culpability?.culprits?.[0] || cast[0]?.name || "Unknown";
  const falseAssumptionStatement =
    cmlCase.false_assumption?.statement || legacy.solution?.false_assumption?.description || "Unknown";
  const inferenceSteps = cmlCase.inference_path?.steps ?? legacy.inference_path?.steps ?? [];
  const era = meta?.era?.decade
    ? `${meta.era.decade} - ${meta.setting?.location ?? "Unknown"}`
    : legacy.setup?.era
      ? `${legacy.setup.era.year} - ${legacy.setup.era.location}`
      : "Unknown era";
  const settingLocation = meta?.setting?.location ?? legacy.setup?.era?.location ?? "Unknown setting";
  return { ...roots, title, primaryAxis, crime, culpritName, falseAssumptionStatement, inferenceSteps, era, settingLocation };
}

/** The constraint space Agents 6 and 7 read (Agent 8 resolves each key separately — see the table). */
export const constraintSpaceOf = (view: CmlRoots): any =>
  view.cmlCase.constraint_space ?? view.legacy.constraint_space ?? {};

/**
 * One constraint category as a bullet list. `limit` caps the entries (Agent 7 shows 3; Agent 6 all).
 * Accepts the CML 2.0 object shape (entries under `keys`) and the legacy array shape.
 */
export function formatConstraintList(value: any, keys: string[], limit?: number): string {
  const take = (entries: any[]) => (limit === undefined ? entries : entries.slice(0, limit));
  if (Array.isArray(value)) {
    return take(value).map((entry: any) => `- ${entry.description ?? entry}`).join("\n") || "None";
  }
  const lines = keys.flatMap((key) => (Array.isArray(value?.[key]) ? value[key] : []));
  return take(lines).map((entry: any) => `- ${entry.description ?? entry}`).join("\n") || "None";
}

/**
 * The discriminating-test block. CML 2.0 (`CASE.discriminating_test`) renders identically everywhere;
 * the legacy fallback's labels differ: Agent 6 prints When/What/Why, Agent 7 When/Test/Reveals.
 */
export function renderDiscriminatingTest(view: CmlRoots, legacyLabels: "what_why" | "test_reveals"): string {
  const { cmlCase, legacy } = view;
  if (cmlCase.discriminating_test) {
    return `**Method**: ${cmlCase.discriminating_test.method}\n**Design**: ${cmlCase.discriminating_test.design}\n**Reveals**: ${cmlCase.discriminating_test.knowledge_revealed}`;
  }
  const dt = legacy.inference_path?.discriminating_test;
  const [testLabel, revealsLabel] = legacyLabels === "what_why" ? ["What", "Why"] : ["Test", "Reveals"];
  return `**When**: ${dt?.when ?? "final act"}\n**${testLabel}**: ${dt?.test ?? "N/A"}\n**${revealsLabel}**: ${dt?.reveals ?? "N/A"}`;
}

/**
 * A7-D01 / A1X-D03 (owner decision 12, CML_VERIFIED_FIXES) — the victim's name read from CML 2.0
 * `CASE.cast`. Undefined when the fix is off, the cast is not an array, or no member is a victim; the
 * caller supplies its own legacy fallback chain.
 */
export function victimMemberOf(view: CmlRoots, isVictim: (member: any) => boolean): any {
  return Array.isArray(view.cast) ? view.cast.find((c: any) => isVictim(c)) : undefined;
}

/** The culprit's CML 2.0 `motive_seed`, trimmed, or undefined (the caller's legacy chain follows). */
export function culpritMotiveSeedOf(view: CmlRoots, culpritName: string): string | undefined {
  const member = Array.isArray(view.cast) ? view.cast.find((c: any) => c?.name === culpritName) : undefined;
  return (typeof member?.motive_seed === "string" && member.motive_seed.trim()) || undefined;
}
