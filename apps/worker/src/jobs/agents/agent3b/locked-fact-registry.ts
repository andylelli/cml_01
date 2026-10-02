/**
 * The locked-fact registry built from the hard-logic devices (Pillar 1): wording normalisation, declared
 * derivations, device arithmetic reconciliation, implied intervals, case temporal coherence, and the
 * locked-facts artifact. Moved from agent3b-run.ts (code review A34-12 / CR-24), which re-exports what it exported.
 */
import { envOn } from "../../env-flags.js";
import { isChronologyEnabled as isA90ChronologyEnabled, solveLockedChronology, summariseChronology } from "@cml/cml";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import {
  generateHardLogicDevices,
  type SettingRefinementResult,
} from "@cml/prompts-llm";
import {
  validateArtifact,
  checkCaseTimeCoherence,
  checkDeclaredDerivations,
  summariseSpine,
  type CaseTimeCoherenceViolation,
  parseClockTime,
  parseDurationMinutes,
  rewriteDurationMinutes,
  dialGapMinutes,
  summariseDecorativeTimes,
} from "@cml/cml";
import {
  type OrchestratorContext,
  appendRetryFeedback,
  type LockedFact,
} from "../shared.js";
// A34-03 (R1): the pure helpers live in @cml/cml (packages/cml/src/locked-facts.ts); re-exported so
// existing importers of this module keep their path.
import { wordifyLockedFactValue, stripLeadingArticleFromLockedValue, impliedIntervalFactId, verifiedFixesEnabled } from "@cml/cml";
import { contradictsDirection, deviceContradicts, expectedDirection, falseAndTrueClocks, fixText, repairDeviceDirection } from "./device-direction.js";
export { stripLeadingArticleFromLockedValue, impliedIntervalFactId };


/**
 * X38-AT-SOURCE — make the device satisfy its own arithmetic before the values freeze.
 *
 * MEASURED 2026-08-20 over the 20 archived locked-fact registries
 * (`scripts/probe-device-arithmetic.mjs`). Of the ten devices either branch of
 * `checkCaseTimeCoherence` can read, **ten have arithmetic that does not close** — not the half
 * REVIEW_05 §12.11 reported, which counted cases the gate cannot read as cases it passed. And they
 * cluster: **six of the ten are wrong by exactly five minutes**, four of those the identical shape —
 * two clock values twenty-five minutes apart under a duration declaring twenty. The model is not
 * making scattered slips. It reaches for a round duration while writing clock values that a
 * quarter-hour idiom pushes five minutes further apart than that, and it does so most of the time.
 *
 * So X38 is promoted from a warning to a repair, HERE, because Agent 3b is the last moment the values
 * are still soft — locked facts are contractual and injected into the prose verbatim, so past this
 * point the only available repair is a chapter that contradicts the registry, which is why X38 was
 * built as a detector with no repair path. Agent 3 has not authored `hidden_model.mechanism` yet
 * either, and that prose restates the interval ("delaying the shadow by about twenty minutes"), so a
 * repair applied one agent later would fix the fact and leave the description stating the old number
 * — a fix that authors the defect it removes, this tracker's own recurring pattern.
 *
 * **IT REPAIRS ONLY WHAT THE DEVICE DECLARED DERIVED, and this is the whole design.**
 *
 * The first draft of this pass rewrote the DURATION on the reasoning that it is the derived quantity —
 * the two clock values are what the prose prints and what the alibi windows are built on, so the
 * interval is the one the case can absorb. That is true of every device in the archive, and the
 * archive is **24 of 24 clock-family devices** (pendulum, bell, sundial, hourglass, escapement). It is
 * FALSE for families this pipeline actively asks for: a poison's onset, a tide's period, a fuse's
 * burn are physical constants, and when the numbers disagree it is the TIMES that must move, not the
 * interval. Rewriting the interval there would silently corrupt the mechanism and produce a story
 * whose poison acts in the wrong time. The corpus could not have shown that, because it contains no
 * such device — which is exactly why a corpus must not be the source of a repair's assumptions.
 *
 * So the author declares it. `derivedFrom` names the facts a value is a consequence of; absent, the
 * value is PRIMARY and untouchable. The rule this encodes is general:
 *
 *      A DETECTOR MAY GUESS. A REPAIRER MAY NOT.
 *
 * A warning that is wrong costs a minute of reading. A rewritten locked fact is printed into the book
 * verbatim and is unrecoverable. So `checkCaseTimeCoherence` keeps its shape heuristic and keeps
 * WARNING on every incoherent device — no coverage is lost — while nothing WRITES without a licence
 * from the case itself.
 *
 * Verified, not assumed. The declared relation is recomputed, the rewritten value re-parsed by the
 * function that produced it, and the whole registry re-checked by the DETECTOR; if any step fails the
 * old value goes back and the run keeps the warning it always had. That assertion is the X64/X65
 * lesson — a substitution applied without one silently no-opped for an entire run.
 */
/**
 * A_80 F15 — CASE-LEVEL TEMPORAL COHERENCE. A MEASURE. It does not gate and does not repair.
 *
 * X38 below reconciles ONE relation: an interval a device declared to be a consequence of two named
 * times. It cannot see a case whose times simply do not add up, because nothing declared them
 * related. That is the gap this reports.
 *
 * WHY IT EXISTS. Run mystery-1788287075975 locked `lobby_clock_time_seen` 11:10,
 * `pocket_watch_time_found` 10:45 and `suspect_departure_time_reported` 11:00 against a 25-minute
 * shift. The first pair is consistent (11:10 − 25 = 10:45). The third is not: corrected it lands at
 * 10:35, ten minutes BEFORE the death — so the tampering EXONERATES the suspect instead of
 * incriminating him. The external read marked the clue logic 4/10 and said the story "has not decided
 * what Hale's false alibi is". The incoherence was in the locked facts, before a word of prose.
 *
 * MEASURED over the 38 archived `locked-facts-*.json` artifacts (`scripts/a80-baseline-f15b.mjs`),
 * and the number is the finding rather than a tuning input:
 *
 *   false/true pair differs by something other than the declared shift   6 of 9  (66.7%)
 *   corrected alibi falls before the death (mechanism inverted)          3 of 5  (60.0%)
 *
 * Those are not near-misses — they include a declared 10-minute shift across times 65 and 90 minutes
 * apart, and a case whose "displayed" and "actual" times are the SAME value. **Two of every three
 * clock cases this pipeline has produced do not close arithmetically**, and clock cases are 44 of the
 * 102 shipped runs.
 *
 * SO IT DOES NOT GATE. A check that fires on two thirds of runs is an off switch with extra steps
 * (CLAUDE.md B1), and blocking here would stop most clock mysteries rather than fix any. The finding
 * this reports is that the repair belongs UPSTREAM: Agent 3b should DERIVE the true time from the
 * false time and the shift, making incoherence impossible by construction, rather than have anything
 * downstream detect it. Until that exists, this makes the defect visible in every run's warnings
 * instead of only in an external reader's score.
 */
/**
 * The clock's DIRECTION at source (see ./device-direction.ts for the measurement). With CML_VERIFIED_FIXES on: the
 * locked false/true times decide whether the clock was set forward or back, and the device's prose fields and the
 * registry's fact descriptions are rewritten to say so. Asserted like X38 (the X64/X65 lesson): if a clock sentence
 * still contradicts after the rewrite, everything goes back and the run keeps a warning.
 */
export function reconcileDeviceDirection(ctx: OrchestratorContext): void {
  if (!verifiedFixesEnabled()) return;
  const registry = ctx.lockedFactRegistry ?? [];
  const pair = falseAndTrueClocks(registry, parseClockTime);
  if (!pair) return;
  const want = expectedDirection(pair.shown, pair.truth);
  if (!want) return;
  const device = (ctx.hardLogicDevices as { devices?: Array<Record<string, unknown>> } | undefined)?.devices?.[0];
  if (!device) return;
  const deviceBefore = JSON.stringify(device);
  const descriptionsBefore = registry.map((f) => f.description);
  const changed = repairDeviceDirection(device, want);
  let registryChanged = 0;
  for (const f of registry) {
    if (typeof f.description !== "string") continue;
    const fixed = fixText(f.description, want);
    if (fixed !== f.description) { f.description = fixed; registryChanged++; }
  }
  if (changed.length === 0 && registryChanged === 0) return;
  const stillWrong = deviceContradicts(device, want)
    || registry.some((f) => typeof f.description === "string" && contradictsDirection(f.description, want));
  if (stillWrong) {
    const restored = JSON.parse(deviceBefore) as Record<string, unknown>;
    for (const k of Object.keys(device)) delete device[k];
    Object.assign(device, restored);
    registry.forEach((f, i) => { f.description = descriptionsBefore[i]; });
    ctx.warnings.push(`[clock direction] the device's direction words contradict its times (shows ${pair.shownText}, true ${pair.truthText} — set ${want}) and the rewrite did not clear them; kept as written.`);
    return;
  }
  ctx.warnings.push(
    `[clock direction] repaired at source: the clock shows ${pair.shownText} against a true ${pair.truthText}, so it was set ${want}; `
      + `${changed.length} device field(s) and ${registryChanged} fact description(s) said otherwise — ${changed.slice(0, 2).join("; ")}`,
  );
}

export function reportCaseTemporalCoherence(ctx: OrchestratorContext): void {
  const registry = ctx.lockedFactRegistry ?? [];
  if (registry.length < 2) return;

  const label = (f: LockedFact) => `${f.id ?? ""} ${f.description ?? ""}`;
  const clocks = registry
    .map((f) => ({ fact: f, minutes: parseClockTime(String(f.value ?? "")) }))
    .filter((c): c is { fact: LockedFact; minutes: number } => c.minutes !== null);
  const shifts = registry
    .map((f) => parseDurationMinutes(String(f.value ?? "")))
    .filter((n): n is number => n !== null && n > 0 && n < 240);
  if (clocks.length < 2 || shifts.length === 0) return;
  const shiftSet = new Set(shifts);

  const FALSE_RE = /false|displayed|shown|clock_time|lobby_clock|apparent|staged/i;
  const TRUE_RE = /actual|real|true_time|time_of_death|died/i;
  const DEATH_RE = /death|murder|killed|died|victim|body/i;
  const ALIBI_RE = /departure|departed|alibi|left|seen|witness/i;

  const falseT = clocks.find((c) => FALSE_RE.test(label(c.fact)));
  const trueT = clocks.find((c) => TRUE_RE.test(label(c.fact)) && c.fact.id !== falseT?.fact.id);
  if (falseT && trueT) {
    const gap = dialGapMinutes(falseT.minutes, trueT.minutes);
    if (!shiftSet.has(gap)) {
      ctx.warnings.push(
        `[A_80 F15] case arithmetic does not close: "${falseT.fact.id}"="${falseT.fact.value}" and ` +
          `"${trueT.fact.id}"="${trueT.fact.value}" are ${gap} minutes apart, but the case declares a shift of ` +
          `${[...shiftSet].join("/")} minute(s). The reader is asked to subtract a number the case does not state. ` +
          `MEASURE only — 66.7% of archived clock cases fail this, so it reports rather than blocks.`,
      );
    }
  }

  const death = clocks.find((c) => DEATH_RE.test(label(c.fact)));
  const alibi = clocks.find((c) => ALIBI_RE.test(label(c.fact)) && c.fact.id !== death?.fact.id);
  if (death && alibi) {
    for (const shift of shiftSet) {
      if (alibi.minutes - shift < death.minutes) {
        ctx.warnings.push(
          `[A_80 F15] the mechanism may be INVERTED: "${alibi.fact.id}"="${alibi.fact.value}" corrected by the ` +
            `${shift}-minute shift falls before "${death.fact.id}"="${death.fact.value}". A tampered clock that ` +
            `places the suspect elsewhere BEFORE the death exonerates him rather than incriminating him — which ` +
            `is the defect the 2026-09-01 external read scored 4/10 on clue logic. MEASURE only.`,
        );
        break;
      }
    }
  }
}

/**
 * Runtime getter, never a module const (`module-const-flags-frozen-before-dotenv`, ADR-0004).
 */
export const isDeclaredDerivationsEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3B_DECLARED_DERIVATIONS ?? ""));

/**
 * PHASE 1 — check what the device SAYS it derived, and report what the spine READ.
 *
 * EXTRACTED FROM `runAgent3b` SO IT CAN BE TESTED AT ALL. Inline, this block sat inside a large
 * async orchestration function, so the only way to exercise it was a paid run — which is precisely
 * the shape CLAUDE.md warns about: *"verify a lever by its agent label in the prompt log, not by
 * grepping the module. Three flags were found to be no-ops on 2026-08-29 despite looking correctly
 * wired."* A lever whose only test is £1 does not get tested.
 *
 * `checkCaseTimeCoherence` fires only on EXACTLY two clock facts and EXACTLY one duration. MEASURED
 * on run mystery-1788457673117 (external read 76/100, whose reviewer's first complaint was the
 * arithmetic): two clocks and TWO durations, so it never ran. Driving off DECLARATIONS instead of
 * fact counts removes that heuristic — a case that declares `derivedFrom` has stated its own
 * pairing — and reaches the `instant = instant ± duration` shape X38 cannot read.
 *
 * The telemetry line is emitted whenever the flag is on, INCLUDING when nothing is wrong: a run that
 * reports what the spine read can be diagnosed later, which is the "clean" versus "never looked"
 * distinction X38's silent `continue` erased.
 */
export function applyDeclaredDerivationCheck(ctx: OrchestratorContext): CaseTimeCoherenceViolation[] {
  if (!isDeclaredDerivationsEnabled()) return [];
  const registry = ctx.lockedFactRegistry ?? [];
  ctx.warnings.push(`[X38-spine] ${summariseSpine(registry)}`);

  /**
   * T3 — the locked TIME facts the case's own reasoning never refers to.
   *
   * MEASURED over 37 cases: 55% of locked time facts prove nothing, across 78% of cases. Telemetry
   * only, and B1 is why: at 78% a gate would be an off switch with extra steps. The number is the
   * finding — half the times this pipeline forces into the prose are decoration by construction,
   * because Agent 3b authors a device clock and Agent 3 authors an inference path and nothing
   * requires the second to use the first.
   */
  const decorative = summariseDecorativeTimes(ctx.cml, registry);
  if (decorative) ctx.warnings.push(decorative);
  return checkDeclaredDerivations(registry);
}

/**
 * A_86 item 3 — `AGENT3B_REPAIR_IMPLIED_INTERVAL`: repair the interval a device did not bother to declare.
 *
 * THE GAP, MEASURED 2026-09-10 over the 50 stored cases. `reconcileDeviceArithmetic` may only touch a
 * fact that declares `derivedFrom` with exactly two sources — "no declaration, no rewrite", which is
 * the right default for a value that might be primary. But **only 31 of 180 locked facts (17%) carry
 * a declaration**, and **9 of the 22 cases with a time violation (41%) declare nothing at all**, so
 * the repair is powerless on them by design rather than by defect.
 *
 * The prompt already asks for the declaration at length — it is REQUIRED, with a worked example and
 * a self-check — and is followed 17% of the time. More prose will not move that: CLAUDE.md's rule is
 * that this model complies with operations and ignores exhortation. So infer the shape instead of
 * asking again.
 *
 * WHEN AN INFERENCE IS SAFE, and it is a narrow window: a device holding EXACTLY two clock facts and
 * EXACTLY one duration fact has only one arithmetic reading — the duration is the interval between
 * the clocks. There is no second candidate to confuse it with. Two clocks and two durations is
 * ambiguous and is left alone; so is any device with three clocks.
 *
 * MEASURED reach: 9 devices have that exact shape with no declaration, 8 of them disagree with their
 * own clocks, and 7 of those compute to a plausible interval. The same guards as the declared path
 * apply — zero-length refused, and `rewriteDurationMinutes` refuses anything it cannot spell under a
 * hundred minutes, which is what keeps a midnight-straddling pair from being written back as "seven
 * hundred minutes". OFF: byte-identical.
 */
export const isRepairImpliedIntervalEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3B_REPAIR_IMPLIED_INTERVAL ?? "").trim());

export function reconcileDeviceArithmetic(ctx: OrchestratorContext): void {
  const registry = ctx.lockedFactRegistry;
  if (!registry || registry.length === 0) return;

  // The ONLY entry point: a fact the device declared to be a consequence of exactly two others.
  // No declaration, no rewrite — a primary value is untouchable no matter how the numbers look.
  const byId = new Map(registry.map((f, index) => [String(f.id ?? "").trim(), { fact: f, index }]));
  /**
   * A_86 item 3 — stamp the ONE unambiguous implied derivation, so the existing repair below sees it.
   *
   * Deliberately done by giving the fact a `derivedFrom` rather than by adding a second repair path:
   * the rewrite, the plausibility refusal, the zero-length guard, the read-back assertion and the
   * write-through to the device already exist and are correct. A second body of that logic is the
   * trap this file's own history is full of.
   */
  if (isRepairImpliedIntervalEnabled()) {
    const impliedId = impliedIntervalFactId(registry, parseClockTime, parseDurationMinutes);
    if (impliedId) {
      const target = registry.find((f) => String(f.id ?? "").trim() === impliedId);
      if (target && !(Array.isArray(target.derivedFrom) && target.derivedFrom.length === 2)) {
        const clockIds = registry
          .filter((f) => {
            const v = String(f.value ?? "").trim();
            return v && parseDurationMinutes(v) === null && parseClockTime(v) !== null;
          })
          .map((f) => String(f.id ?? "").trim());
        if (clockIds.length === 2) {
          (target as { derivedFrom?: unknown }).derivedFrom = clockIds;
          ctx.warnings.push(
            `[X38] implied derivation inferred (A_86 item 3): "${impliedId}" is the only duration in a ` +
              `device holding exactly two clock facts (${clockIds.join(", ")}), so it is their interval. ` +
              `The device did not declare it; the repair below now applies the same checks it would have.`,
          );
        }
      }
    }
  }

  const candidates = registry
    .map((fact, index) => ({ fact, index }))
    .filter(({ fact }) => Array.isArray(fact.derivedFrom) && fact.derivedFrom.length === 2);
  if (candidates.length === 0) return;

  for (const { fact, index } of candidates) {
    const id = String(fact.id ?? "").trim() || "(unnamed)";
    const raw = String(fact.value ?? "").trim();
    const sources = (fact.derivedFrom ?? []).map((s) => byId.get(s.trim()));

    // A declaration naming facts that do not exist is a defect in the declaration, not a licence.
    if (sources.some((s) => s === undefined)) {
      ctx.warnings.push(
        `[X38] ${id} declares derivedFrom [${(fact.derivedFrom ?? []).join(", ")}], and at least one of ` +
          `those ids is not in the registry. Not repaired — an unresolvable declaration is not a licence.`,
      );
      continue;
    }

    // This pass knows ONE relation: an interval between two clock positions. A declared dependency
    // between other quantities (a distance from a speed and a time, a total from its parts) is
    // recorded by the case and simply not actionable here — which is a silence, not a pass.
    const a = parseClockTime(String(sources[0]!.fact.value ?? ""));
    const b = parseClockTime(String(sources[1]!.fact.value ?? ""));
    const current = parseDurationMinutes(raw);
    if (a === null || b === null || current === null) {
      /**
       * THE SILENCE THAT LET A DEFECT SHIP. This was a bare `continue`.
       *
       * MEASURED on run mystery-1788457673117: `actual_call_sheet_creation` declared
       * `derivedFrom: [call_sheet_date, call_sheet_creation_delay]` — the first time in this
       * project's history a device declared its own dependency, which PLAN-TO-90 §10.4 recorded as a
       * milestone — and this branch discarded it without a word, because the declaration is
       * `instant = instant + duration` and this pass only knows `duration = |A − B|`. The reviewer
       * then spent a paragraph on the arithmetic.
       *
       * The comment above is still right that a shape this pass cannot compute is "a silence, not a
       * pass" — but a silence nobody can see is indistinguishable from a clean case. It now says so.
       * Gated on the same flag as the spine check, so with the flag off this file behaves exactly as
       * it always has.
       */
      if (envOn("AGENT3B_DECLARED_DERIVATIONS")) {
        const unreadable = [
          a === null ? `${sources[0]!.fact.id}="${sources[0]!.fact.value}"` : null,
          b === null ? `${sources[1]!.fact.id}="${sources[1]!.fact.value}"` : null,
          current === null ? `${id}="${raw}"` : null,
        ].filter(Boolean);
        ctx.warnings.push(
          `[X38] declared derivation NOT EVALUATED: ${id} declares derivedFrom ` +
            `[${(fact.derivedFrom ?? []).join(", ")}], but this pass reads only ` +
            `"duration = |A − B|" and could not read ${unreadable.join(", ")} in that shape. ` +
            `Reported rather than skipped — a silent skip is indistinguishable from a clean case, ` +
            `and the spine check above evaluates the shapes this one cannot.`,
        );
      }
      continue;
    }

    const gap = dialGapMinutes(a, b);
    if (gap === current) continue; // the declared relation already holds

    // Two sources at the same clock value make a zero-length interval, which is not a mechanism.
    if (gap === 0) {
      ctx.warnings.push(
        `[X38] device arithmetic NOT repaired: ${sources[0]!.fact.id} and ${sources[1]!.fact.id} lock ` +
          `the same time, so ${id} has no interval to state. Left for the case to answer.`,
      );
      continue;
    }

    const declared = { index, id, raw, minutes: current };
    const clockIds = [sources[0]!.fact.id, sources[1]!.fact.id];

  // Also the guard against a dial wrap. `parseClockTime` is dial-relative (0..719) on purpose, so a
  // pair straddling midnight — 11:50 and 00:10 — reads as 700 minutes apart rather than twenty. The
  // detector has always computed it that way; the repair must not turn that into a locked fact
  // declaring "seven hundred minutes". `rewriteDurationMinutes` refuses anything it cannot spell as a
  // minute count under a hundred, so the case keeps its warning and a person reads it.
    const repaired = rewriteDurationMinutes(declared.raw, gap);
    if (repaired === null) {
      ctx.warnings.push(
        `[X38] device arithmetic NOT repaired: ${declared.id} "${declared.raw}" could not be restated at ` +
          `${gap} minutes without guessing at its wording. The incoherence stands, and is reported below.`,
      );
      continue;
    }

    const before = declared.raw;
    registry[declared.index] = { ...registry[declared.index]!, value: repaired };

    // The assertion. If the rewrite did not do what it claimed, put it back.
    if (parseDurationMinutes(repaired) !== gap) {
      registry[declared.index] = { ...registry[declared.index]!, value: before };
      ctx.warnings.push(
        `[X38] device arithmetic repair REVERTED: restating ${declared.id} as "${repaired}" does not ` +
          `read back as ${gap} minutes. This is a defect in the repair, not in the case.`,
      );
      continue;
    }

    /**
     * ── WRITE THE REPAIR BACK TO THE DEVICE, OR IT NEVER REACHES THE PAGE ────────────────────────
     *
     * MEASURED on run `canary_1787953182108` (external read 85/100, the reader's number-one issue):
     * this repair restated `signal_window_duration` from "thirty-five minutes" to "fifty minutes",
     * the CML carried the corrected value — and the MANUSCRIPT said "thirty-five minutes" EIGHT
     * times and "fifty minutes" not once.
     *
     * The cause is one value with two bodies. This function mutated `ctx.lockedFactRegistry`; the
     * device it was read from still held the old string at
     * `hardLogicDevices.devices[0].lockedFacts[2].value`, and BOTH are handed downstream. The writer
     * reads the device.
     *
     * The reader's verdict on the result: *"But 10:40 to 11:30 is 50 minutes, not 35... Right now the
     * mechanism works, but the arithmetic needs correcting."* — and *"with the tide arithmetic fixed
     * ... this could reach 90–92/100."* A repair that does not reach the page is not a repair.
     *
     * Scoped exactly: only the ONE fact this pass just rewrote, matched by id, and only when the
     * device still holds the superseded value. Nothing else in the device is touched.
     */
    const devices = ctx.hardLogicDevices?.devices ?? [];
    let wroteBack = 0;
    for (const device of devices) {
      const facts: any[] = Array.isArray((device as any)?.lockedFacts) ? (device as any).lockedFacts : [];
      for (const fact of facts) {
        if (String(fact?.id ?? "").trim() !== declared.id) continue;
        if (String(fact?.value ?? "").trim() !== before) continue;
        fact.value = repaired;
        wroteBack += 1;
      }
    }

    ctx.warnings.push(
      `[X38] device arithmetic repaired at source: ${declared.id} declares itself derived from ` +
        `${clockIds.join(" and ")}, which are ${gap} minutes apart, so "${before}" (${declared.minutes}) ` +
        `is restated as "${repaired}". Only the declared-derived value changed; its sources are untouched. ` +
        `Written back to ${wroteBack} device fact(s)` +
        `${wroteBack === 0 ? " — NONE, so the device still carries the old value and the prose will use it" : ""}.`,
    );
  }
}

/**
 * Write `locked-facts-{runId}.json`.
 *
 * EXPORTED, and called twice per run — found on review 2026-08-18. The registry is BUILT here from the
 * device, but X51 appends the case's own facts (the weapon, each suspect's alibi location) at the end
 * of `runAgent3`, which happens later. With a single write at build time the artifact showed only the
 * device's clock times, so an audit of a future run would read this file and conclude the weapon and
 * alibi pins never landed. This project diagnoses runs from artifacts; an artifact that is a snapshot
 * of an intermediate state is worse than none.
 */
export function writeLockedFactsArtifact(ctx: OrchestratorContext): void {
  try {
    const logsDir = join(ctx.workerAppRoot, "logs");
    if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });
    writeFileSync(
      join(logsDir, `locked-facts-${ctx.runId}.json`),
      JSON.stringify({ runId: ctx.runId, registry: ctx.lockedFactRegistry ?? [] }, null, 2),
      "utf8",
    );
  } catch (err) {
    ctx.warnings.push(`Pillar 1: failed to write locked-facts file: ${String(err)}`);
  }
}

export async function buildLockedFactRegistryPhase(ctx: OrchestratorContext, setting: SettingRefinementResult, deviceLibraryBlock: string) {
  if (ctx.inputs.enableLockedFactRegistry) {
    /**
     * Extracted so the arithmetic-regeneration path below can REBUILD the registry from a fresh
     * device. Byte-identical work to what ran inline before; the only change is that it can now be
     * called twice.
     */
    const buildRegistryFromPrimaryDevice = (): void => {
      const primaryDevice = ctx.hardLogicDevices!.devices[0];
      const rawFacts: Array<{ id?: unknown; value?: unknown; description?: unknown; derivedFrom?: unknown; anchor?: unknown; }> = Array.isArray(primaryDevice?.lockedFacts) ? primaryDevice.lockedFacts : [];

      ctx.lockedFactRegistry = rawFacts
        .filter((f) => typeof f.id === "string" && typeof f.value === "string" && (f.value as string).trim().length > 0)
        .map((f) => {
          const id = (f.id as string).trim();
          const original = (f.value as string).trim();
          const wordified = wordifyLockedFactValue(original);
          if (wordified !== original) {
            ctx.warnings.push(`Pillar 1: repaired digit-form locked fact ${id} "${original}" → "${wordified}" (era word-form)`);
          }
          // A_72 C1: the article belongs to the sentence, not the value. See the helper's header for
          // what "a quarter past eleven" beside "ten minutes past eleven" did to the 08-23 manuscript.
          const value = stripLeadingArticleFromLockedValue(wordified);
          if (value !== wordified) {
            ctx.warnings.push(`[A_72 C1] stripped leading article from locked fact ${id}: "${wordified}" → "${value}"`);
          }
          return {
            id,
            value,
            description: typeof f.description === "string" ? (f.description as string).trim() : "",
            // Carried through verbatim: it is the ONLY licence any later pass has to rewrite this value.
            ...(Array.isArray(f.derivedFrom)
              ? { derivedFrom: (f.derivedFrom as unknown[]).map((x) => String(x).trim()).filter(Boolean) }
              : {}),
            // A_90 — the duration's anchor travels with the fact; `parseDurationAnchor` validates it.
            ...(f.anchor && typeof f.anchor === "object"
              ? { anchor: f.anchor as { at: string; edge: "start" | "end"; } }
              : {}),
          };
        });

      // X38-at-source: reconcile before the artifact is written, so locked-facts-{runId}.json records
      // the values the run actually used rather than the ones it was about to repair.
      reconcileDeviceArithmetic(ctx);
      reconcileDeviceDirection(ctx);
    };

    buildRegistryFromPrimaryDevice();

    // A_90 — what the device's clock solves to, and which durations sit nowhere on it.
    if (isA90ChronologyEnabled()) {
      ctx.warnings.push(`[A_90 chronology] device: ${summariseChronology(solveLockedChronology(ctx.lockedFactRegistry ?? []))}`);
    }

    reportCaseTemporalCoherence(ctx);

    // Emit to apps/worker/logs/locked-facts-{runId}.json for observability.
    writeLockedFactsArtifact(ctx);

    // The assignment now happens inside `buildRegistryFromPrimaryDevice`, so TypeScript no longer
    // narrows it here. Read once into a local rather than asserting non-null at each use.
    const builtRegistry = ctx.lockedFactRegistry ?? [];
    ctx.warnings.push(
      `Pillar 1: locked fact registry built with ${builtRegistry.length} fact(s): ` +
      builtRegistry.map((f) => `${f.id}="${f.value}"`).join(", ")
    );

    /**
     * X38 (REVIEW_09 §3) — the device's own arithmetic, at the cheapest end of the pipeline.
     *
     * The 08-15 device declared `murder_time_displayed` 7:15, `chime_recorded_time` 7:05 and
     * `pendulum_delay_duration` "fourteen minutes". 7:15 − 7:05 is ten. These values are injected into
     * the prose VERBATIM, so the contradiction shipped, and the cold read led with it and marked the
     * clue logic 6/10.
     *
     * Here rather than at acceptance because Agent 9 cannot repair it: a locked fact is contractual,
     * and a chapter rewritten to reconcile the numbers would contradict the registry. This is the
     * moment the case is still cheap to fix — before an outline, before £1 of prose written against it.
     */
    let arithmeticViolations = checkCaseTimeCoherence({ lockedFacts: ctx.lockedFactRegistry });

    /**
     * ── PHASE 1: CHECK WHAT THE DEVICE SAYS IT DERIVED ───────────────────────────────────────────
     *
     * `checkCaseTimeCoherence` above fires only when the registry holds EXACTLY two clock facts and
     * EXACTLY one duration. MEASURED on run mystery-1788457673117 (external read 76/100, whose
     * reviewer's first complaint was the arithmetic): two clocks and TWO durations, so it never ran.
     * That case was blind to four separate checks at once, and this is the fourth.
     *
     * Driving off DECLARATIONS instead of fact counts removes the heuristic entirely — a case that
     * declares `derivedFrom` has already told us the pairing, and no extra duration can switch the
     * check off. It also reaches the shape X38 cannot: `instant = instant ± duration`.
     *
     * Baselined before wiring (`scripts/temporal-spine-baseline.mjs`, 44 archived runs): 25 declare a
     * derivation, and **11 of those 25 (44%) carry one that does not close** — so this is not a check
     * that fires on everything (CLAUDE.md B1) nor one that fires on nothing.
     *
     * Flag-gated `AGENT3B_DECLARED_DERIVATIONS`, default OFF, read at CALL TIME (ADR-0004).
     */
    const declaredDerivationsEnabled = isDeclaredDerivationsEnabled();
    arithmeticViolations = [...arithmeticViolations, ...applyDeclaredDerivationCheck(ctx)];

    for (const violation of arithmeticViolations) {
      ctx.warnings.push(`[X38] Pillar 1 case-time incoherence (${violation.code}): ${violation.message}`);
    }

    /**
     * ── A_75 §11: THE WARNING NOW DOES SOMETHING ─────────────────────────────────────────────────
     *
     * The comment above argues that this is the only moment the case can be fixed — "Agent 9 cannot
     * repair it: a locked fact is contractual" — and until now the code answered by pushing a warning
     * and continuing.
     *
     * MEASURED over the 29 stored device artifacts: **10 (34%) ship with arithmetic that does not
     * work.** `reconcileDeviceArithmetic` above repairs only a fact that DECLARES `derivedFrom` with
     * two sources — correctly conservative, it will not guess which of three numbers is wrong — and
     * **6 of the 10 carry no such declaration**, so the repair cannot reach them.
     *
     * What happens to those six is documented end to end for `canary_1787512796199`: X38 warned here,
     * geometry raised `locked_time_arithmetic` again at Agent 9 (where it can only warn), the book
     * shipped, and BOTH external readers spent essentially their whole review on the hourglass
     * numbers. `clues` scored 5 and 7 — the category with the most recoverable headroom in the ledger.
     *
     * So: regenerate the DEVICE, which is the thing that is wrong, at the design-tier price
     * (~$0.01–0.02) rather than paying £1 of prose to render numbers that cannot work. Bounded to one
     * attempt, and the regenerated device is accepted ONLY if the arithmetic actually clears — a
     * regeneration that fails leaves the original in place, so this can never make a case worse or
     * abort a run.
     *
     * Flag-gated `AGENT3B_ARITHMETIC_REGEN`, default OFF, read at call time.
     */
    const arithmeticRegenEnabled = envOn("AGENT3B_ARITHMETIC_REGEN");
    if (arithmeticRegenEnabled && arithmeticViolations.length > 0) {
      const beforeDevices = ctx.hardLogicDevices;
      const beforeRegistry = ctx.lockedFactRegistry;
      /**
       * The feedback describes BOTH arithmetic shapes, and asks for a daypart.
       *
       * It used to name only `duration = |A − B|`, which was true of the only violations that could
       * reach it. The declared-derivations check now also raises `instant = instant ± duration`, so a
       * regeneration told about one shape would be asked to fix a defect it had not been shown.
       *
       * The daypart clause is the other half of the 76/100 case: "twenty minutes past three" is
       * 03:20 or 15:20, the case chose neither, and every temporal check downstream then picks one by
       * accident. Asking for the daypart is a countable operation on the value itself — which is the
       * kind of instruction this model actually complies with (CLAUDE.md: operations, not statistics).
       */
      const feedback = `The device's own numbers must agree. ${arithmeticViolations.map((v) => v.message).join(" ")} `
        + `Regenerate the device so its locked facts are arithmetically consistent, in BOTH directions: `
        + `if two clock times and a duration are locked, the duration MUST equal the interval between `
        + `the two times; and if a clock time is derived from another clock time plus a duration, it `
        + `MUST equal that sum. State the derived value's \`derivedFrom\` as the ids of the two facts it `
        + `is computed from. Every clock value MUST also name its half of the day ("a quarter to six in `
        + `the evening", not "a quarter to six"), and if two values fall on different days say so on `
        + `each ("on the evening prior", "on the murder day") — otherwise the interval between them is `
        + `not determined and the reader is asked to do a sum that has more than one answer.`;
      const genLabel = "Agent3b-HardLogicDeviceGenerator";
      const costBefore = ctx.client.getCostTracker().getSummary().byAgent[genLabel] || 0;
      try {
        const regenerated = await generateHardLogicDevices(ctx.client, {
          runId: ctx.runId,
          projectId: ctx.projectId || "",
          decade: setting.setting.era.decade,
          location: setting.setting.location.description,
          institution: setting.setting.location.type,
          tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", feedback),
          theme: appendRetryFeedback(ctx.inputs.theme || "", feedback),
          primaryAxis: ctx.primaryAxis,
          mechanismFamilies: ctx.initialHardLogicDirectives.mechanismFamilies,
          hardLogicModes: ctx.initialHardLogicDirectives.hardLogicModes,
          difficultyMode: ctx.initialHardLogicDirectives.difficultyMode,
          noveltyConstraints: ctx.noveltyConstraints,
          deviceLibraryBlock,
        });
        const regenValid = validateArtifact("hard_logic_devices", regenerated);
        if (!regenValid.valid || !regenerated?.devices?.length) {
          ctx.warnings.push(`[X38-regen] regenerated device failed schema validation; keeping the original.`);
        } else {
          /**
           * Rebuild the registry from the NEW device and re-run the check. Accept only on a clear.
           *
           * THE ACCEPTANCE MUST RE-RUN THE SAME SET OF CHECKS THAT RAISED THE VIOLATIONS. It ran only
           * `checkCaseTimeCoherence`, so once the declared-derivations check began contributing, a
           * regeneration could be ACCEPTED while the very violation that triggered it still stood —
           * the device replaced, the warning cleared, and the defect still in the case. That is the
           * same shape as an acceptance validator that cannot see the defect it is repairing, which
           * is what made the ch9 aftermath regen report 375 → 375 for ever.
           */
          ctx.hardLogicDevices = regenerated;
          buildRegistryFromPrimaryDevice();
          const after = [
            ...checkCaseTimeCoherence({ lockedFacts: ctx.lockedFactRegistry }),
            ...(declaredDerivationsEnabled ? checkDeclaredDerivations(ctx.lockedFactRegistry) : []),
          ];
          if (after.length === 0) {
            writeLockedFactsArtifact(ctx);
            arithmeticViolations = [];
            ctx.warnings.push(
              `[X38-regen] device regenerated and its arithmetic now agrees — repaired at the design tier, `
              + `before an outline and before any prose was written against it.`
            );
          } else {
            // Never trade a known-bad device for an unknown-bad one.
            ctx.hardLogicDevices = beforeDevices;
            ctx.lockedFactRegistry = beforeRegistry;
            ctx.warnings.push(
              `[X38-regen] regenerated device still disagrees (${after.map((v) => v.code).join(", ")}); `
              + `reverted to the original. The case ships with the incoherence NAMED, as before.`
            );
          }
        }
      } catch (err) {
        ctx.warnings.push(`[X38-regen] regeneration error: ${(err as Error).message}; keeping the original.`);
      } finally {
        const costAfter = ctx.client.getCostTracker().getSummary().byAgent[genLabel] || 0;
        const spent = Math.max(0, costAfter - costBefore);
        if (spent > 0) ctx.warnings.push(`[X38-regen] spent £${spent.toFixed(4)} at the design tier.`);
      }
    }
  }
}
