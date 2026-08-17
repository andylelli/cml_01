/**
 * Derivation — build the `StoryGeometry` contract from the frozen CML plus the Agent-7 outline.
 *
 * Deterministic wherever possible (GEOMETRY-AGENT-DESIGN §2 responsibility 1). Exactly two fields
 * are genuinely open — which trace is the clincher, and whom the false solution accuses — and both
 * have a complete deterministic fallback here, so the LLM resolve is an IMPROVEMENT on this path,
 * never a prerequisite for it. That matters: a stage whose derivation depends on a call it may not
 * make is a stage that reports "unavailable" the first time the cheap deployment hiccups.
 */

import type {
  ChapterContract,
  ChapterRole,
  Clincher,
  FalseSolutionGeometry,
  GeometryClue,
  GeometryDeriveInput,
  GeometryScene,
  MethodSignature,
  StoryGeometry,
  TimeModel,
} from "./types.js";
import { checkGeometryClosure } from "./closure.js";

// ── CML access ───────────────────────────────────────────────────────────────

/** The CASE object, whether it arrived wrapped or bare. Never mutated. */
export const caseOf = (cml: unknown): any => (cml as any)?.CASE ?? cml ?? {};

const str = (v: unknown): string => String(v ?? "").trim();

/**
 * Read a cast member's role through BOTH spellings.
 *
 * `castDesign.characters` carries `roleArchetype`; `cml.CASE.cast` carries `role_archetype`. A bare
 * snake_case read silently matches nobody — three separate bugs in the 2026-07-24 agents review.
 */
export const roleOf = (member: any): string =>
  str(member?.role_archetype ?? member?.roleArchetype ?? member?.role).toLowerCase();

// ── The method's physical signature ──────────────────────────────────────────

/**
 * The physical tells a manner of death leaves on a body or a scene.
 *
 * CANONICAL BODY. `agent7-run.ts` carried this list privately ("kept local to avoid a cross-package
 * import"); it now imports this one. The lists are identical, so nothing changed behaviourally — but
 * the second body is gone, which is the point.
 */
export const deathMethodSignatureTerms = (deathMethod: unknown): string[] => {
  const m = str(deathMethod).toLowerCase();
  if (!m) return [];
  if (/poison|toxin|venom|arsenic|cyanide|strychnine/.test(m)) return ["poison", "numbness", "bitter", "residue", "collapse", "convulsion", "froth"];
  if (/stab|knife|blade|dagger|puncture/.test(m)) return ["stab", "wound", "blood", "blade", "puncture"];
  if (/blunt|struck|bludgeon|blow|beaten/.test(m)) return ["blunt", "wound", "blood", "bruis", "struck"];
  if (/strangl|garrot|throttle|asphyxiat|suffocat/.test(m)) return ["strangl", "ligature", "throat", "collar", "petechiae"];
  if (/shot|gun|firearm|bullet|pistol|revolver/.test(m)) return ["shot", "wound", "bullet", "powder", "cartridge", "gunshot"];
  if (/drown/.test(m)) return ["drown", "water", "sodden", "lungs"];
  return [];
};

// ── Outline traversal ────────────────────────────────────────────────────────

/** Every scene of the outline in reading order. Chapter N is index N-1 — the prose stage's mapping. */
export const flattenScenes = (narrative: GeometryDeriveInput["narrative"]): GeometryScene[] =>
  (narrative?.acts ?? []).flatMap((act) => (Array.isArray(act?.scenes) ? act.scenes : []));

const sceneSignal = (scene: GeometryScene | undefined): string =>
  [scene?.beat, scene?.title, scene?.purpose, scene?.summary].map((v) => str(v)).join(" ").toLowerCase();

/**
 * Which chapter reveals the solution.
 *
 * Beat labels first — the Golden-Age arc names `final_trap` and `revelation` as DISTINCT beats, and
 * §8bis's rival explanation for the 68-scoring run is precisely that the outline collapsed them. When
 * the beats are authored, believe them; only fall back to "the last chapter" when they are not.
 */
export const resolveRevealChapter = (scenes: ReadonlyArray<GeometryScene>): number => {
  const byBeat = scenes.findIndex((s) => /^(final_trap|reveal_solution)$/.test(str(s?.beat)));
  if (byBeat >= 0) return byBeat + 1;
  const bySignal = scenes.findIndex((s) => /(culprit revealed|the reveal|unmask|denouncement|accusation of the murderer)/.test(sceneSignal(s)));
  if (bySignal >= 0) return bySignal + 1;
  return scenes.length;
};

/**
 * Does the chapter the reveal contract binds actually look like a reveal? (REVIEW_05 §10.4 / N4)
 *
 * MEASURED three runs running: the beat label does not track what a chapter does. Run 1936 labelled
 * chapter 7 `final_trap` and disclosed in chapter 9; the 08-04 treatment run labelled chapter 8
 * `final_trap` and titled it *"The Discriminating Test"*, while its only naming sentence landed in
 * chapter 10 — a chapter the contract does not bind at all.
 *
 * This REPORTS the disagreement; it does not re-bind. Titles are as model-authored as beats, and
 * preferring one guess over another is not a fix — an authoritative `beat-scheduler` is (§8bis).
 *
 * IT ALSO GATES A NUMBER. §14.3: the injection detector only sees chapters the contract binds, so
 * while the reveal is misbound, `met_by_injection_count` under-reports and cannot be read as the
 * injector's firing rate.
 */
const TEST_LIKE =
  /(discriminating test|constraint_proof|conducts the test|the test\b|experiment|demonstration|trap is set|proof of concept)/;
/**
 * Deliberately does NOT contain "revelation". That is the canonical Golden-Age name for the
 * AFTERMATH beat, so matching it would report a disagreement on every correctly-formed outline —
 * the first version of this check fired on all ten of them.
 */
const DISCLOSURE_LIKE =
  /(culprit revealed|culprit.{0,3}s unveiling|reveals? \w+ as the culprit|names? the murderer|as the murderer|unmask|confession|confesses)/;
/**
 * A chapter that looks back on a disclosure is not the disclosure. Without this, the aftermath
 * chapter — which restates the culprit by design — reads as a rival for the reveal contract, and
 * the 08-02 1654 outline (correctly bound) produced a note.
 */
const AFTERMATH_LIKE = /(aftermath|epilogue|reflects|looking back|days later|weeks later)/;

const sceneTitleSignal = (scene: GeometryScene | undefined): string =>
  [scene?.title, scene?.purpose, scene?.summary].map((v) => str(v)).join(" ").toLowerCase();

export const checkRevealBinding = (
  scenes: ReadonlyArray<GeometryScene>,
  revealChapter: number,
): string | null => {
  const bound = scenes[revealChapter - 1];
  if (!bound) return null;
  const boundLooksLikeTest = TEST_LIKE.test(sceneTitleSignal(bound));

  // A later chapter whose OWN WORDS read as the disclosure and NOT as aftermath. Its beat is
  // excluded on purpose: the question is whether the label agrees with the chapter.
  const laterDisclosure = scenes
    .map((scene, index) => ({ scene, chapter: index + 1 }))
    .find(({ scene, chapter }) => {
      if (chapter <= revealChapter) return false;
      const signal = sceneTitleSignal(scene);
      return DISCLOSURE_LIKE.test(signal) && !AFTERMATH_LIKE.test(signal);
    });

  if (!boundLooksLikeTest || !laterDisclosure) return null;
  const parts = [
    `reveal bound to chapter ${revealChapter} by its beat "${str(bound.beat) || "(none)"}"`,
    `but that chapter reads as the discriminating test ("${str(bound.title)}")`,
    `and chapter ${laterDisclosure.chapter} ("${str(laterDisclosure.scene.title)}") reads as the disclosure`,
  ];
  return `${parts.join(" ")} — the contract may be bound to the wrong chapter, so every reveal check ` +
    `(and the injected-disclosure count) is reading a chapter that does not disclose`;
};

const resolveChapterByBeat = (scenes: ReadonlyArray<GeometryScene>, beat: RegExp, signal: RegExp): number | null => {
  const byBeat = scenes.findIndex((s) => beat.test(str(s?.beat)));
  if (byBeat >= 0) return byBeat + 1;
  const bySignal = scenes.findIndex((s) => signal.test(sceneSignal(s)));
  return bySignal >= 0 ? bySignal + 1 : null;
};

// ── The two open choices ─────────────────────────────────────────────────────

const PHYSICAL_TRACE_HINTS =
  /\b(fabric|thread|fibre|fiber|cuff|glove|button|stain|smear|print|fingerprint|footprint|mud|soil|ash|powder|residue|scratch|tear|torn|splinter|hair|blood|ink|wax|scent|mark|impression|shard|fragment|key|thread)\b/i;

/**
 * Choose the clincher from clues that ALREADY EXIST.
 *
 * The preference order is the genre's, not an arbitrary score: a physical trace beats a testimonial
 * one; an essential clue beats a supporting one; a clue that carries a named physical object beats an
 * abstraction. `clue-spec` derives slots from inference steps and has no slot type for "the single
 * decisive physical trace" (§5) — so this selects among its output rather than adding to it.
 */
export const selectClincherClue = (clues: ReadonlyArray<GeometryClue>): GeometryClue | null => {
  const candidates = clues.filter((c) => str(c?.id));
  if (candidates.length === 0) return null;
  const score = (c: GeometryClue): number => {
    let s = 0;
    // CS2 — a DECLARED clincher wins outright. The weight is larger than every other signal combined
    // on purpose: when the clue set says which clue is the clincher, scoring is not a tie-breaker,
    // it is a fallback for clue sets that do not say (REVIEW_05 §23).
    if (str(c.role).toLowerCase() === "clincher") s += 32;
    if (str(c.category).toLowerCase() === "physical") s += 8;
    if (str(c.criticality).toLowerCase() === "essential") s += 4;
    if (PHYSICAL_TRACE_HINTS.test(`${str(c.description)} ${str(c.pointsTo)} ${(c.keyTerms ?? []).join(" ")}`)) s += 3;
    if (typeof c.supportsInferenceStep === "number") s += 1;
    // A clue whose whole job is to signal the manner of death is the METHOD signature's evidence, not
    // the clincher — the two are separate obligations and must not collapse into one.
    if (c.isDeathMethodTell === true) s -= 6;
    return s;
  };
  const ranked = [...candidates].sort((a, b) => score(b) - score(a));
  return score(ranked[0]) > 0 ? ranked[0] : null;
};

/**
 * The clincher as a short noun phrase, for anything that reaches the prose prompt.
 *
 * §8.8: "If a geometry block would duplicate an existing block, the geometry block is wrong" — and
 * clue text belongs to `clue_descriptions`. Geometry still has to say WHICH object is decisive, so
 * some restatement is unavoidable; what it must not do is re-print a whole clue description into a
 * run-stable block and become a second clue channel. The stored `trace` keeps the full text for the
 * report; only the prompt sees this.
 */
export const summariseTrace = (trace: string): string => {
  const text = str(trace).replace(/\s+/g, " ");
  if (!text) return "";
  const firstClause = text.split(/[.;:]\s/)[0] ?? text;
  const clipped = firstClause.length <= 90 ? firstClause : `${firstClause.slice(0, 87).trimEnd()}…`;
  return clipped.replace(/[.,;:]$/, "");
};

/** Salient lowercase terms the acceptance test can look for. Never sent to the prose model as copy. */
const clincherKeyTerms = (clue: GeometryClue | null, trace: string): string[] => {
  const declared = (clue?.keyTerms ?? []).map((t) => str(t).toLowerCase()).filter(Boolean);
  if (declared.length > 0) return [...new Set(declared)].slice(0, 6);
  const hits = [...`${trace}`.matchAll(new RegExp(PHYSICAL_TRACE_HINTS.source, "gi"))].map((m) => m[0].toLowerCase());
  if (hits.length > 0) return [...new Set(hits)].slice(0, 6);
  // Last resort: the longest content words of the trace. Weak, and deliberately so — a weak term set
  // makes the acceptance test permissive, never falsely accusatory.
  return [...new Set(
    trace.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 6),
  )].slice(0, 4);
};

// ── Field derivations ────────────────────────────────────────────────────────

const deriveTimeModel = (caseData: any, input: GeometryDeriveInput): TimeModel => {
  const mechanism = caseData?.hidden_model?.mechanism ?? {};
  return {
    trueTime: str(mechanism.actual_time_of_death) || null,
    apparentTime: str(mechanism.apparent_time_of_death) || null,
    directionViolations: (input.timelineViolations ?? []).map((v) => ({ code: str(v.code), message: str(v.message) })),
    // Kept as written, not parsed: the acceptance test owns the one clock parser (§ types.ts).
    accountedTimes: (input.lockedFacts ?? []).map((f) => str(f?.value)).filter(Boolean),
  };
};

const deriveMethodSignature = (caseData: any): MethodSignature | null => {
  const method = str(caseData?.death_method);
  if (!method) return null;
  const keyTerms = deathMethodSignatureTerms(method);
  return {
    method,
    // Chapter 1 by construction: the body is discovered there, and "the murder method disappears"
    // is the complaint that appears in both external reads.
    plantChapter: 1,
    keyTerms,
  };
};

const deriveClincher = (
  caseData: any,
  input: GeometryDeriveInput,
  revealChapter: number,
): Clincher | null => {
  const clues = input.clues ?? [];
  const resolvedId = str(input.resolution?.clincherClueId) || null;
  const resolvedClue = resolvedId ? clues.find((c) => str(c.id) === resolvedId) ?? null : null;
  const clue = resolvedClue ?? selectClincherClue(clues);

  /**
   * THE RESOLVE MAY RESTATE A CLUE. IT MAY NOT AUTHOR ONE.
   *
   * FOUND ON REVIEW 2026-08-03. The trace was taken from `resolution.clincherTrace` whenever it was
   * non-empty — including when `clincherClueId` named a clue that does not exist. A resolve returning
   * an unknown id plus a sentence therefore attached free prose to a DIFFERENT clue's id and marked
   * it `source: "llm"`. The probe's output was the external reviewer's own suggested sentence,
   * "Eleanor held the torn fabric beside Hugo's cuff.", travelling into the prose prompt as the
   * clincher trace.
   *
   * That is §3 breached through the back door: geometry does not invent clues, and a trace that maps
   * to no clue is invented. The restatement is honoured only when it belongs to a clue that exists.
   */
  const resolvedTrace = resolvedClue ? str(input.resolution?.clincherTrace) : "";
  const trace = resolvedTrace || str(clue?.description) || str(clue?.pointsTo);
  if (!trace) return null;

  const culprit = str((caseData?.culpability?.culprits ?? [])[0]) || null;
  // Planted by chapter 3 at the latest, and never later than the chapter before the payoff — the
  // genre's rule, and both reviewers' request. A 2-chapter book would otherwise plant at the payoff.
  const plantByChapter = Math.max(1, Math.min(3, revealChapter - 1));
  return {
    trace,
    clueId: str(clue?.id) || null,
    uniqueToCulprit: culprit,
    plantByChapter,
    payoffChapter: revealChapter,
    keyTerms: clincherKeyTerms(clue, trace),
    source: resolvedClue || resolvedTrace ? "llm" : "derived",
    sourceCriticality: str(clue?.criticality).toLowerCase() || null,
  };
};

const deriveFalseSolution = (
  caseData: any,
  scenes: ReadonlyArray<GeometryScene>,
  input: GeometryDeriveInput,
  revealChapter: number,
): FalseSolutionGeometry => {
  const declared = str(caseData?.false_solution?.accused_suspect);
  const resolved = str(input.resolution?.accused);
  const culprit = str((caseData?.culpability?.culprits ?? [])[0]);
  // Prefer the CML's own answer; fall back to the resolve only when the CML's answer is absent or is
  // the culprit — the case 1810 shipped, where an instruction with no downstream validator was the
  // only thing standing between the story and accusing the murderer in chapter 6.
  const accused = declared && declared !== culprit ? declared : resolved || declared || null;
  const proposedChapter = resolveChapterByBeat(scenes, /^false_solution$/, /(false solution|wrong suspect|premature accusation|misdirection)/);
  const testChapter = resolveChapterByBeat(scenes, /^(pattern|final_trap)$/, /(discriminating test|the test|experiment|demonstration)/);
  return {
    accused: accused || null,
    proposedChapter,
    collapseChapter: testChapter ?? (revealChapter > 1 ? revealChapter : null),
  };
};

/**
 * The chapter contracts.
 *
 * Bound to the chapters that carry every measured defect (§11 Q4): chapter 1 (method signature), the
 * reveal, and the aftermath — plus the false-solution chapter, which §5 lists as a geometry field
 * with no downstream validator. Deliberately NOT every chapter: a contract on chapter 4 would be
 * formalism, and each contract costs prompt surface.
 */
const deriveChapterContracts = (
  scenes: ReadonlyArray<GeometryScene>,
  revealChapter: number,
  chapterCount: number,
  falseSolution: FalseSolutionGeometry,
  clincher: Clincher | null,
  methodSignature: MethodSignature | null,
  timeModel: TimeModel,
): ChapterContract[] => {
  /**
   * One contract per chapter, resolved by PRECEDENCE rather than by call order.
   *
   * FOUND ON REVIEW 2026-08-03. The first version skipped any chapter that already had a contract,
   * and added them in the order opening → false_solution → reveal → aftermath. So an outline whose
   * false-solution beat lands on the same chapter as the reveal — which happens whenever the outline
   * has no `final_trap` beat and its last chapter is `false_solution` — **silently dropped the reveal
   * contract entirely**, and with it every disclosure check the acceptance test performs. The most
   * important obligation in the object disappeared because of the order two lines were written in.
   *
   * Precedence: reveal > aftermath > false_solution > opening. A chapter that must disclose is a
   * reveal chapter whatever else it also is.
   */
  const ROLE_PRECEDENCE: ChapterRole[] = ["reveal", "aftermath", "false_solution", "discriminating_test", "investigation", "opening"];
  const byChapter = new Map<number, ChapterContract>();
  const add = (chapter: number, role: ChapterRole, mustContain: string[], mustNotContain: string[]) => {
    if (chapter < 1 || chapter > chapterCount) return;
    const existing = byChapter.get(chapter);
    if (existing && ROLE_PRECEDENCE.indexOf(existing.role) <= ROLE_PRECEDENCE.indexOf(role)) return;
    if (existing) {
      // POSITIVES COMPOSE, NEGATIVES DO NOT. A chapter that is both the false solution and the reveal
      // still owes both sets of contents, so `mustContain` merges. `mustNotContain` takes the winning
      // role's alone: the loser's prohibitions were written for a different job and can directly
      // contradict the winner's — a one-chapter story would otherwise carry "must name the culprit"
      // and the opening's "must not reveal the identity of the culprit" in the same contract.
      byChapter.set(chapter, {
        chapter,
        role,
        mustContain: [...new Set([...mustContain, ...existing.mustContain])],
        mustNotContain,
      });
      return;
    }
    byChapter.set(chapter, { chapter, role, mustContain, mustNotContain });
  };
  const contracts = () => [...byChapter.values()];

  // Chapter 1 — the method's physical signature. "The murder method disappears… the candlestick
  // never returns" is complaint #2 in both external reads.
  add(
    1,
    "opening",
    [
      ...(methodSignature
        ? [`the physical signs of the manner of death (${methodSignature.method}) observed on or around the body`]
        : []),
      ...(clincher && clincher.plantByChapter === 1
        ? [`the trace that will later prove decisive, present incidentally and unremarked: ${summariseTrace(clincher.trace)}`]
        : []),
    ],
    ["the identity of the culprit", "how the concealment worked"],
  );

  if (falseSolution.proposedChapter && falseSolution.accused) {
    add(
      falseSolution.proposedChapter,
      "false_solution",
      [`a solution that accuses ${falseSolution.accused}, argued well enough to convince`],
      ["an accusation of the real culprit", "the true solution"],
    );
  }

  add(
    revealChapter,
    "reveal",
    [
      "the culprit named outright",
      "how the murder was physically done",
      "why they did it",
      ...(clincher ? [`the decisive trace produced as proof: ${summariseTrace(clincher.trace)}`] : []),
      /**
       * X44 — the 08-06 read's second named gap. That run hit best-ever in all ten categories and
       * still asked for this: *"the true murder window could be stated in one crisp line: 'The clock
       * showed 10:45, but the true time was 10:55.'"* Four obligations above and not one of them is
       * about the clock, in a story whose entire deception is a clock.
       *
       * Both anchors or neither. A one-anchor case has no two-time deception to disclose, and the
       * acceptance check declines on the same condition — an obligation the model is given must be one
       * the test can score.
       */
      ...(timeModel.apparentTime && timeModel.trueTime
        ? [
            `both times stated together and related to each other: ${timeModel.apparentTime} — what the staged ` +
              `evidence appeared to show — against ${timeModel.trueTime}, when the death actually happened`,
          ]
        : []),
    ],
    ["any question left standing about who did it", "a deferral of the answer to a later scene"],
  );

  /**
   * X23 — EVERY chapter after the reveal is aftermath, not just the next one.
   *
   * This bound `revealChapter + 1` alone. MEASURED on the N6 pair, and the asymmetry is the whole
   * finding: the treatment's reveal is chapter 9 of 10, so the single aftermath contract happened to
   * cover its only remaining chapter and the detector saw its repeats. The control's reveal is
   * chapter 8 of 10 — so chapter 9 was bound, chapter 10 was **not bound at all**, and the three
   * repeated paragraphs an external reader called *"the biggest structural weakness"* sat outside
   * the contract where nothing could see them.
   *
   * That also explains why the aftermath regen pass has never fired usefully: on a control-shaped
   * story it is pointed at the wrong chapter.
   *
   * The obligation is not "the chapter after the reveal owes consequence" — it is "once the reader
   * has been told, no later chapter may argue the case again". Binding every subsequent chapter says
   * that, and needs no guess about which one is *the* aftermath. Deliberately NOT a re-binding of the
   * reveal: [§10.4](../../../architecture/REVIEW_05.md) declined that, and the reveal binding turns
   * out to be correct on both N6 runs anyway (disclosure found in the bound chapter both times).
   */
  for (let n = revealChapter + 1; n <= chapterCount; n += 1) {
    add(
      n,
      "aftermath",
      ["the consequence of, and the human reaction to, what chapter " + revealChapter + " disclosed"],
      [
        "any restatement of the method",
        "any restatement of the motive",
        "any restatement of the concealment",
        "any suspect clearance",
        "any re-naming of the culprit as a discovery",
      ],
    );
  }

  return contracts().sort((a, b) => a.chapter - b.chapter);
};

// ── The compiler ─────────────────────────────────────────────────────────────

/**
 * Compile the manuscript contract. Pure, total, and never throws on partial input — a missing field
 * becomes an UNMET closure entry, which is a diagnosis, not a crash. A new stage must not become a
 * new abort class (§7).
 */
export const deriveStoryGeometry = (input: GeometryDeriveInput): StoryGeometry => {
  const caseData = caseOf(input.cml);
  const scenes = flattenScenes(input.narrative);
  const chapterCount = scenes.length || Number(input.narrative?.totalScenes ?? 0) || 0;
  const revealChapter = scenes.length > 0 ? resolveRevealChapter(scenes) : chapterCount;

  const timeModel = deriveTimeModel(caseData, input);
  const methodSignature = deriveMethodSignature(caseData);
  const clincher = deriveClincher(caseData, input, revealChapter);
  const falseSolution = deriveFalseSolution(caseData, scenes, input, revealChapter);
  const chapterContract = deriveChapterContracts(
    scenes,
    revealChapter,
    chapterCount,
    falseSolution,
    clincher,
    methodSignature,
    timeModel,
  );

  const geometry: StoryGeometry = {
    version: 1,
    chapterCount,
    culprit: str((caseData?.culpability?.culprits ?? [])[0]) || null,
    timeModel,
    clincher,
    methodSignature,
    chapterContract,
    falseSolution,
    // Two sentences, in scene. "The clearances are logical but too mechanical" / "the Eleanor-alibi
    // section is validation logic, not story" — the same complaint, both reads.
    clearanceBudget: { maxSentences: 2, inScene: true },
    closure: { closed: false, unmet: [], waived: [], notes: [], revealBindingUncertain: false },
  };

  geometry.closure = checkGeometryClosure(geometry, caseData);
  const bindingNote = scenes.length > 0 ? checkRevealBinding(scenes, revealChapter) : null;
  if (bindingNote) {
    geometry.closure.notes.push(bindingNote);
    // The same finding, in the form a consumer can act on. The note is for a human reading the
    // report; this is for the scoring path, which must not read a bound-chapter verdict as a verdict
    // about the story (REVIEW_05 §14.3).
    geometry.closure.revealBindingUncertain = true;
  }
  return geometry;
};
