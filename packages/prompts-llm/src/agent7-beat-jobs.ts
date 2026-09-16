/**
 * A_95 M6 — A BEAT'S JOB, AS FIELDS. The middle of the book has no turn.
 *
 * ── THE DEFECT, MEASURED ─────────────────────────────────────────────────────────────────────────
 *
 * Three vocabularies claim each chapter's job, and the prose obeys the concrete one:
 *
 *   the Golden-Age BEAT LABEL on the scene   Agent 7   near-fixed across 51 outlines
 *   the scene PURPOSE                        Agent 7   what the prose actually follows
 *   the positional ARCHETYPE                 Agent 9   `buildMacroArcPlan(chapterCount)`
 *
 * Over 51 stored outlines, a scene labelled `false_solution` has a purpose that names an innocent
 * being accused in **23 of 51 (45%)**; an `alibis` scene carries its "second dramatic incident" in
 * **2 of 51 (4%)**. The label is worn, not done.
 *
 * On the bookshop book (seed 63935) scenes 3-7 were five consecutive *"Reveal … evidence linking
 * Percival …"* purposes, and the prose followed: **0 sentences in ten chapters entertain any other
 * suspect as the culprit, 0 theories are overturned**, and new content falls from 60% in chapter 2
 * to 25% by chapter 7. RED_HERRING and REVERSAL were in those prompts by label and were answered
 * with clue reveals. Nothing enforces any of it — `lint.ts` disabled the archetype validator for
 * false positives and left "enforced via prompt injection only".
 *
 * The reader never writes "obvious culprit" — the rubric has no misdirection category — so this
 * lands as *"chapters 3-8 circle the same information"*, plot 7, pacing 7 (REVIEW_14's rule: a
 * defect that produces flatness gets a positive sentence and an 8).
 *
 * ── THE FIX ──────────────────────────────────────────────────────────────────────────────────────
 *
 * A label is a rate; a named field is an operation. Each beat whose job is a TURN gets one or two
 * required fields naming who and what, validated by the same completeness machinery that already
 * carries `pivotElement` and `factEstablished`. The purpose then has something concrete to state,
 * and Agent 9 receives a name rather than an archetype.
 */

/** The beats whose job is a turn, and the fields that make that job countable. */
export interface BeatJob {
  beat: string;
  /** Required field names on the scene. */
  fields: readonly string[];
  /** One line for the Agent 7 contract. */
  instruction: string;
  /** Does this purpose/summary do the beat's job? Used by the repair pass and the audit. */
  test: RegExp;
}

export const BEAT_JOBS: readonly BeatJob[] = [
  {
    beat: "false_solution",
    fields: ["accusedInnocent", "flawFound"],
    instruction:
      '"accusedInnocent": the EXACT NAME of a suspect who is NOT the culprit, and who this scene ' +
      'genuinely accuses — the evidence must point at them and the detective must believe it for a ' +
      'time. "flawFound": one sentence naming the single fact that breaks the accusation. The purpose ' +
      "must begin by naming the accusation, not by reporting evidence.",
    test: /\baccus|\bwrong(ly)?\b|\binnocent\b|false (solution|theory|conclusion)|mistaken/i,
  },
  {
    beat: "alibis",
    fields: ["secondIncident"],
    instruction:
      '"secondIncident": a NEW event that happens in this scene — a threat, a theft, a second ' +
      "discovery, a disappearance. Not a deduction about the murder already committed. The beat ends " +
      "on it.",
    // Widened TWICE, both times because the detector was narrower than the language:
    //   (a) it had "theft" but not "broken into", and failed its own worked fixture;
    //   (b) MEASURED on run 50862 — it scored scene 5 as failing when the purpose read "end with a
    //       SECOND DRAMATIC INCIDENT", because an adjective between "second" and "incident" broke the
    //       match. A false negative in an audit is worse than no audit: it reports a defect that is
    //       not there and hides that the contract WORKED.
    test: /second\s+(?:\w+\s+)?(incident|death|body|attack|shock|discovery|crime)|threat|theft|stolen|broke?n? in(to)?|break-in|intrud|ransack|fire breaks|assault|disappear|vanish|another (death|body|attack)/i,
  },
  {
    beat: "motives",
    fields: ["suspicionShiftsTo"],
    instruction:
      '"suspicionShiftsTo": the EXACT NAME of the suspect this scene ends up pointing at, who must ' +
      "NOT be the culprit. The discovery that shifts suspicion is the beat.",
    test: /shift|suspicion|misleading|red herring|points? (to|at)/i,
  },
  {
    beat: "secrets",
    fields: ["unrelatedLie"],
    instruction:
      '"unrelatedLie": who lied, about what, and why it has NOTHING to do with the murder. This is the ' +
      "beat that separates moral guilt from criminal guilt.",
    test: /\bl(ie|ies|ied|ying)\b|secret|unrelated|nothing to do with the (murder|death|crime)/i,
  },
  {
    beat: "revelation",
    fields: ["consequenceFor"],
    instruction:
      '"consequenceFor": the EXACT NAME of the character whose life this closing scene shows changed, ' +
      "and how. The culprit is already exposed; this scene shows the cost, and must not re-run the " +
      "evidence, re-confirm alibis, or re-stage the accusation.",
    test: /aftermath|consequence|cost|changed|restor|absorb|what became of|routine/i,
  },
] as const;

export const beatJobFor = (beat: unknown): BeatJob | undefined => {
  const key = String(beat ?? "").trim().toLowerCase();
  return BEAT_JOBS.find((j) => j.beat === key);
};

export const isBeatJobFieldsEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT7_BEAT_JOB_FIELDS ?? "").trim());

/** The contract block for the Agent 7 prompt. */
export const buildBeatJobContract = (): string => {
  const lines: string[] = [];
  lines.push("");
  lines.push("## WHAT EACH BEAT MUST DO (A_95 — MANDATORY where the scene carries one of these beats)");
  lines.push("");
  lines.push("A beat name on a scene is a promise about what CHANGES in it. A scene that carries one of the");
  lines.push("beats below and merely reveals more evidence has not done its job, and the story stops turning.");
  lines.push("For each such scene, fill the named fields AND make the purpose state that job first.");
  lines.push("");
  for (const job of BEAT_JOBS) {
    lines.push(`**${job.beat}** — ${job.instruction}`);
    lines.push("");
  }
  lines.push("A name in these fields must be one of the cast, spelled exactly as in the cast list. The");
  lines.push("accused, the suspected and the liar are NOT the culprit: the culprit is exposed at the final");
  lines.push("trap, and a story that suspects only the guilty party has no middle.");
  return lines.join("\n");
};

export interface BeatJobAudit {
  /** Scenes whose beat has a job and whose purpose does not do it. */
  failures: Array<{ sceneNumber: number; beat: string; missingFields: string[]; purposeDoesJob: boolean }>;
  /** Scenes carrying a job beat at all. */
  checked: number;
}

/**
 * Audits an outline against the beat jobs. Reports; it does NOT rewrite — a purpose is prose, and
 * this project's record on deterministic prose repair is the reason A_95 M1 hands text to an LLM
 * instead (A_84, A_91). The report drives the existing Agent 7 retry feedback.
 */
export const auditBeatJobs = (narrative: unknown): BeatJobAudit => {
  const acts = (narrative as any)?.acts;
  const failures: BeatJobAudit["failures"] = [];
  let checked = 0;
  if (!Array.isArray(acts)) return { failures, checked };
  for (const act of acts) {
    for (const scene of Array.isArray(act?.scenes) ? act.scenes : []) {
      const job = beatJobFor(scene?.beat);
      if (!job) continue;
      checked += 1;
      const missingFields = job.fields.filter((f) => {
        const v = (scene as any)?.[f];
        return typeof v !== "string" || v.trim().length === 0;
      });
      const blob = `${String(scene?.purpose ?? "")} ${String(scene?.summary ?? "")}`;
      const purposeDoesJob = job.test.test(blob);
      if (missingFields.length > 0 || !purposeDoesJob) {
        failures.push({
          sceneNumber: Number(scene?.sceneNumber ?? 0),
          beat: job.beat,
          missingFields,
          purposeDoesJob,
        });
      }
    }
  }
  return { failures, checked };
};

/** One retry-feedback line per failing scene, naming the scene and what it owes. */
export const buildBeatJobFeedback = (audit: BeatJobAudit): string => {
  if (audit.failures.length === 0) return "";
  const lines = audit.failures.map((f) => {
    const job = beatJobFor(f.beat)!;
    const missing = f.missingFields.length > 0 ? `missing ${f.missingFields.join(", ")}` : "fields present";
    const purpose = f.purposeDoesJob ? "purpose states the job" : "the PURPOSE does not state the job";
    return `  - scene ${f.sceneNumber} (${f.beat}): ${missing}; ${purpose}. ${job.instruction}`;
  });
  return [
    "SCENE BEATS THAT DID NOT DO THEIR JOB — fix every one:",
    ...lines,
    "A scene carrying one of these beats that only reveals more evidence leaves the story without a turn.",
  ].join("\n");
};
