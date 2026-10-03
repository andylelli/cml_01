/**
 * A6-12 — property tests for the World Builder's validation, written against the code BEFORE the
 * validator refactor and kept as its regression net.
 *
 *  1. `completeHumourPlacementMap` postcondition, over generated maps: exactly the 12 required positions,
 *     in order, once each, every rationale a non-empty string — and the function is idempotent. This is
 *     what made the three humour gates (missing / duplicate / empty rationale) unreachable: the map is
 *     completed in `normalizeWorldDocumentStructure` before schema validation, and nothing in between
 *     touches it (`validateArtifact` only reads; `enforceCastCoverage` touches portraits and sketches).
 *  2. `buildDefaultValidationConfirmations` postcondition: exactly the six keys, all booleans. The six are
 *     then forced to true, so the self-validation gate could not fire.
 *  3. `enforceRevealImplicationsFloor` cannot return fewer than 90 words once the storyTheme gate has
 *     passed (it runs first): three fixed sentences plus a theme sentence of 7 + (>= 25) words.
 *  4. End to end: generateWorldDocument over seeded, generated LLM replies (mutations of the four golden
 *     World Documents, both values of CML_VERIFIED_FIXES). Every prompt, retry message, returned document,
 *     thrown error and log line is digested into a file snapshot recorded from the pre-refactor code; the
 *     refactor must reproduce it byte for byte. The same corpus shows the deleted gates' messages never
 *     occur while the reachable gates' messages do (the known-positive that makes the zero mean something).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __testables, generateWorldDocument } from "../agent65-world-builder.ts";

const {
  completeHumourPlacementMap,
  buildDefaultValidationConfirmations,
  enforceRevealImplicationsFloor,
  enforceStoryThemeFloor,
  countWords,
} = __testables;

const POSITIONS = [
  "opening_scene", "first_investigation", "body_discovery", "first_interview", "domestic_scene",
  "mid_investigation", "second_interview", "tension_scene", "pre_climax", "discriminating_test",
  "revelation", "resolution",
];
const CONFIRM_KEYS = [
  "noNewCharacterFacts", "noNewPlotFacts", "castComplete", "eraSpecific", "lockedFactsPreserved", "humourMapComplete",
];

// ── seeded generator ─────────────────────────────────────────────────────────
function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
  const pick = <T,>(xs: readonly T[]): T => xs[int(0, xs.length - 1)];
  const chance = (p: number) => next() < p;
  const shuffle = <T,>(xs: T[]): T[] => {
    const out = [...xs];
    for (let i = out.length - 1; i > 0; i--) {
      const j = int(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  return { next, int, pick, chance, shuffle };
}
type Rng = ReturnType<typeof rng>;

const VOCAB = [
  "the", "house", "silence", "grief", "pressure", "inspector", "letter", "garden", "truth", "fear",
  "loyalty", "evening", "rain", "secret", "debt", "duty", "and", "of", "a", "glass", "clock", "corridor",
];
function text(r: Rng, n: number, opts: { punctuate?: boolean; paragraphs?: number } = {}): string {
  const words: string[] = [];
  for (let i = 0; i < n; i++) {
    let w = r.pick(VOCAB);
    if (opts.punctuate && r.chance(0.12)) w += r.pick([".", "!", "?"]);
    words.push(w);
  }
  if (opts.punctuate && words.length > 0 && r.chance(0.7)) words[words.length - 1] += ".";
  const paras = Math.max(1, opts.paragraphs ?? 1);
  if (paras === 1 || words.length < paras) return words.join(" ");
  const size = Math.ceil(words.length / paras);
  const out: string[] = [];
  for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size).join(" "));
  return out.join(r.pick(["\n\n", "\n \n", "\n\n\n"]));
}

function randomValue(r: Rng): unknown {
  return r.pick<unknown>([undefined, null, "", "  ", "x", 5, true, false, [], {}, "yes", 0]);
}

function randomHumourEntry(r: Rng): unknown {
  if (r.chance(0.1)) return randomValue(r);
  const entry: Record<string, unknown> = {
    scenePosition: r.chance(0.9) ? r.pick(POSITIONS) : r.pick(["bogus", "", 7]),
    humourPermission: r.pick(["permitted", "conditional", "forbidden"]),
  };
  const rationale = r.int(0, 4);
  if (rationale === 0) entry.rationale = text(r, r.int(1, 12));
  else if (rationale === 1) entry.rationale = "";
  else if (rationale === 2) entry.rationale = "   ";
  else if (rationale === 3) entry.rationale = randomValue(r);
  if (r.chance(0.3)) entry.condition = text(r, 4);
  return entry;
}

function randomHumourMap(r: Rng): unknown {
  if (r.chance(0.08)) return randomValue(r);
  return Array.from({ length: r.int(0, 20) }, () => randomHumourEntry(r));
}

// ── 1. completeHumourPlacementMap postcondition ──────────────────────────────
describe("A6-12 property: completeHumourPlacementMap", () => {
  it("returns the 12 required positions in order, once each, each with a non-empty rationale (3000 inputs)", () => {
    const r = rng(1201);
    for (let i = 0; i < 3000; i++) {
      const out = completeHumourPlacementMap(randomHumourMap(r));
      expect(out.map((e) => e.scenePosition)).toEqual(POSITIONS);
      for (const e of out) {
        expect(typeof e.rationale).toBe("string");
        expect(e.rationale.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("is idempotent: a second completion changes nothing (3000 inputs)", () => {
    const r = rng(1202);
    for (let i = 0; i < 3000; i++) {
      const once = completeHumourPlacementMap(randomHumourMap(r));
      expect(completeHumourPlacementMap(once)).toEqual(once);
    }
  });
});

// ── 2. buildDefaultValidationConfirmations postcondition ─────────────────────
describe("A6-12 property: buildDefaultValidationConfirmations", () => {
  it("returns exactly the six keys, in order, all booleans (3000 inputs)", () => {
    const r = rng(1203);
    for (let i = 0; i < 3000; i++) {
      let input: unknown = randomValue(r);
      if (r.chance(0.7)) {
        const o: Record<string, unknown> = {};
        for (const k of [...CONFIRM_KEYS, "extra", "humourMapcomplete"]) if (r.chance(0.6)) o[k] = randomValue(r);
        input = o;
      }
      const out = buildDefaultValidationConfirmations(input) as Record<string, unknown>;
      expect(Object.keys(out)).toEqual(CONFIRM_KEYS);
      for (const k of CONFIRM_KEYS) expect(typeof out[k]).toBe("boolean");
    }
  });
});

// ── 3. reveal floor after a passing theme ────────────────────────────────────
describe("A6-12 property: enforceRevealImplicationsFloor after the storyTheme gate passed", () => {
  it("the closed-form minimum (no base, no register, a 25-word theme) is at least 90 words", () => {
    const theme = Array.from({ length: 25 }, () => "w").join(" ");
    const out = enforceRevealImplicationsFloor("", 90, theme, "");
    expect(countWords(out)).toBeGreaterThanOrEqual(90);
  });

  it("never returns fewer than 90 words when storyTheme has >= 25 words (5000 inputs)", () => {
    const r = rng(1204);
    let checked = 0;
    for (let i = 0; i < 5000; i++) {
      const register = r.pick<unknown>(["", "  ", undefined, 7, text(r, r.int(1, 6))]);
      const caseTheme = r.chance(0.5) ? "" : text(r, r.int(1, 5));
      const theme = enforceStoryThemeFloor(
        r.pick<unknown>(["", undefined, text(r, r.int(1, 40), { punctuate: r.chance(0.5) })]),
        25, caseTheme, register,
      );
      if (countWords(theme) < 25) continue; // the theme gate fires first; the reveal floor is never reached
      checked++;
      const base = r.pick<unknown>(["", undefined, 5, text(r, r.int(0, 89), { punctuate: true })]);
      const out = enforceRevealImplicationsFloor(base, 90, theme, register);
      expect(countWords(out)).toBeGreaterThanOrEqual(90);
    }
    expect(checked).toBeGreaterThan(3000);
  });
});

// ── 4. end-to-end characterisation over generated replies ────────────────────
const GOLDEN = ["56049d93", "6b91b4b1", "a5c017a1", "eb1251aa"].map((id) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../../../../eval/golden/bundle-${id}.json`, import.meta.url)), "utf8")),
);

function mutateDoc(r: Rng, base: any, cast: Array<{ name: string; role_archetype?: string }>): any {
  const d = structuredClone(base);
  delete d.cost;
  delete d.durationMs;

  // humour map
  switch (r.int(0, 11)) {
    case 1: d.humourPlacementMap = r.shuffle(d.humourPlacementMap).slice(0, r.int(0, 11)); break;
    case 2: d.humourPlacementMap = [...d.humourPlacementMap, ...d.humourPlacementMap.slice(0, r.int(1, 4)).map((e: any) => ({ ...e, humourPermission: "permitted" }))]; break;
    case 3: d.humourPlacementMap = d.humourPlacementMap.map((e: any) => (r.chance(0.4) ? { ...e, rationale: r.pick(["", "  "]) } : e)); break;
    case 4: d.humourPlacementMap = d.humourPlacementMap.map((e: any) => { if (r.chance(0.4)) { const c = { ...e }; delete c.rationale; return c; } return e; }); break;
    case 5: d.humourPlacementMap = [...d.humourPlacementMap, "note", null, 5, []]; break;
    case 6: d.humourPlacementMap = r.shuffle(d.humourPlacementMap); break;
    case 7: d.humourPlacementMap = r.pick<unknown>(["nope", null, {}]); break;
    case 8: delete d.humourPlacementMap; break;
    case 9: d.humourPlacementMap = randomHumourMap(r); break;
    case 10: if (r.chance(0.5)) d.humourPlacementMap[r.int(0, 11)].humourPermission = "maybe"; break;
    default: break;
  }

  // confirmations
  switch (r.int(0, 7)) {
    case 1: d.validationConfirmations = Object.fromEntries(CONFIRM_KEYS.map((k) => [k, r.chance(0.5)])); break;
    case 2: d.validationConfirmations = Object.fromEntries(CONFIRM_KEYS.map((k) => [k, randomValue(r)])); break;
    case 3: delete d.validationConfirmations; break;
    case 4: d.validationConfirmations = { ...d.validationConfirmations, extra: false }; break;
    case 5: d.validationConfirmations = "true"; break;
    default: break;
  }

  // emotional arc
  if (d.storyEmotionalArc && typeof d.storyEmotionalArc === "object") {
    const arc = d.storyEmotionalArc;
    switch (r.int(0, 7)) {
      case 1: arc.arcDescription = text(r, r.int(0, 400), { punctuate: r.chance(0.6) }); break;
      case 2: arc.arcDescription = text(r, r.int(0, 450), { punctuate: true, paragraphs: r.int(2, 5) }); break;
      case 3: delete arc.arcDescription; break;
      case 4: arc.arcDescription = text(r, r.int(180, 420)); break; // one sentence, no terminal stop
      case 5: arc.arcDescription = text(r, r.int(5, 60), { punctuate: true }); break;
      default: break;
    }
    switch (r.int(0, 5)) {
      case 1: arc.turningPoints = []; break;
      case 2: arc.turningPoints = (arc.turningPoints ?? []).map((tp: any) => ({ ...tp, emotionalDescription: "" })); break;
      case 3: delete arc.turningPoints; break;
      case 4: arc.turningPoints = [{ position: "opening", emotionalDescription: text(r, r.int(1, 20)) }, "junk"]; break;
      default: break;
    }
    switch (r.int(0, 6)) {
      case 1: arc.dominantRegister = ""; break;
      case 2: arc.dominantRegister = "   "; break;
      case 3: delete arc.dominantRegister; break;
      case 4: arc.dominantRegister = 7; break;
      default: break;
    }
  } else if (r.chance(0.5)) {
    d.storyEmotionalArc = randomValue(r);
  }

  // storyTheme, revealImplications
  switch (r.int(0, 6)) {
    case 1: d.storyTheme = text(r, r.int(1, 30), { punctuate: r.chance(0.5) }); break;
    case 2: d.storyTheme = ""; break;
    case 3: delete d.storyTheme; break;
    case 4: d.storyTheme = 42; break;
    case 5: d.storyTheme = text(r, r.int(1, 4), { punctuate: true }); break;
    default: break;
  }
  switch (r.int(0, 5)) {
    case 1: d.revealImplications = text(r, r.int(0, 120), { punctuate: true }); break;
    case 2: d.revealImplications = ""; break;
    case 3: delete d.revealImplications; break;
    default: break;
  }

  // cast coverage
  const victim = cast.find((m) => String(m.role_archetype ?? "").toLowerCase() === "victim")?.name;
  const without = (xs: any[], name?: string) => xs.filter((x: any) => x?.name !== name);
  switch (r.int(0, 11)) {
    case 1: d.characterVoiceSketches = without(d.characterVoiceSketches, victim); break;
    case 2: d.characterVoiceSketches = without(d.characterVoiceSketches, victim); d.characterPortraits = without(d.characterPortraits, victim); break;
    case 3: d.characterPortraits = without(d.characterPortraits, cast[r.int(2, cast.length - 1)].name); break;
    case 4: d.characterPortraits = r.shuffle(d.characterPortraits); d.characterVoiceSketches = r.shuffle(d.characterVoiceSketches); break;
    case 5: d.characterVoiceSketches = [...d.characterVoiceSketches, d.characterVoiceSketches[0]]; break;
    case 6: d.characterPortraits = [...d.characterPortraits, "note", null]; break;
    case 7: d.characterPortraits = d.characterPortraits.map((p: any, i: number) => (i === 2 ? { ...p, name: "Nobody" } : p)); break;
    case 8: d.characterVoiceSketches = [d.characterVoiceSketches[0], ...without(d.characterVoiceSketches.slice(1), victim)].reverse(); break;
    default: break;
  }

  // schema breakers the normaliser does not repair
  if (r.chance(0.06) && d.breakMoment && typeof d.breakMoment === "object") d.breakMoment.scenePosition = "revelation";
  if (r.chance(0.05) && Array.isArray(d.characterPortraits) && d.characterPortraits[0] && typeof d.characterPortraits[0] === "object") delete d.characterPortraits[0].portrait;
  if (r.chance(0.04)) d.status = r.pick(["wip", 3]);
  if (r.chance(0.04)) delete d.breakMoment;
  if (r.chance(0.03)) d.historicalMoment = randomValue(r);
  return d;
}

function reply(r: Rng, base: any, cast: any[]): { content: string; finishReason: string } {
  const k = r.next();
  if (k < 0.05) return { content: "not json at all", finishReason: "stop" };
  if (k < 0.09) return { content: '{"status": "final", "storyTheme": "cut', finishReason: r.pick(["stop", "length"]) };
  if (k < 0.12) return { content: "", finishReason: r.pick(["stop", "length", "max_tokens"]) };
  return { content: JSON.stringify(mutateDoc(r, base, cast)), finishReason: "stop" };
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const errLine = (s: string) => s.split("\n")[0];

const DELETED_GATE = [
  /humourPlacementMap missing required scenePosition/,
  /humourPlacementMap has duplicate scenePosition/,
  /humourPlacementMap\[\d+\] \(.*\) has an empty rationale/,
  /World Builder self-validation failures/,
  /revealImplications is too short/,
];
const REACHABLE_GATE: Record<string, RegExp> = {
  parse: /JSON parse failure on attempt/,
  schema: /Schema validation failed on attempt/,
  cast: /characterPortraits|characterVoiceSketches/,
  arcParagraphs: /arcDescription must be multi-paragraph/,
  theme: /storyTheme is too short/,
};

describe("A6-12 characterisation: generateWorldDocument over generated replies", () => {
  const FLAG = "CML_VERIFIED_FIXES";
  let saved: string | undefined;
  let logs: string[] = [];
  beforeEach(() => {
    saved = process.env[FLAG];
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => { logs.push(args.map(String).join(" ")); });
  });
  afterEach(() => {
    if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved;
    vi.restoreAllMocks();
  });

  it("reproduces every prompt, retry, document, error and log line; deleted gates never fire", async () => {
    const CASES = 320;
    const r = rng(1205);
    const lines: string[] = [];
    const errorMessages: string[] = [];
    let successes = 0;
    for (let i = 0; i < CASES; i++) {
      const bundle = GOLDEN[i % GOLDEN.length];
      const a = bundle.artifacts;
      const flagOn = r.chance(0.5);
      if (flagOn) process.env[FLAG] = "1"; else delete process.env[FLAG];
      const cml = structuredClone(a.cml);
      if (r.chance(0.5)) {
        cml.CASE.meta = { ...(cml.CASE.meta ?? {}), theme: text(r, r.int(1, 5)) };
      }
      const cast = cml.CASE.cast;
      const replies = [reply(r, a.world_document, cast), reply(r, a.world_document, cast), reply(r, a.world_document, cast)];
      const requests: string[] = [];
      let n = 0;
      const client = {
        chat: vi.fn(async (req: any) => {
          requests.push(sha(JSON.stringify(req)));
          const last = String(req.messages[req.messages.length - 1].content);
          if (req.logContext?.retryAttempt > 1) {
            const m = /(?:failed validation with this error|was not valid JSON):\n([^\n]*)/.exec(last);
            if (m) errorMessages.push(m[1]);
          }
          const rep = replies[Math.min(n++, replies.length - 1)];
          return { content: rep.content, finishReason: rep.finishReason, model: "m", usage: {}, latencyMs: 1, cost: 0.01 * n };
        }),
      };
      logs = [];
      let outcome: string;
      let kind: string;
      try {
        const doc: any = await generateWorldDocument(
          {
            caseData: cml,
            characterProfiles: a.character_profiles,
            locationProfiles: a.location_profiles,
            temporalContext: a.temporal_context,
            backgroundContext: a.background_context,
            hardLogicDevices: a.hard_logic_devices,
            clueDistribution: a.clues,
            runId: `r${i}`,
            projectId: "p",
          } as any,
          client as any,
        );
        expect(typeof doc.durationMs).toBe("number");
        const { durationMs: _d, ...stable } = doc;
        outcome = JSON.stringify(stable);
        kind = `ok@${requests.length}`;
        successes++;
      } catch (e: any) {
        outcome = `ERR ${e.message}`;
        errorMessages.push(e.message);
        kind = `err@${requests.length}`;
      }
      const digest = sha(JSON.stringify({ requests, outcome, logs }));
      lines.push(`${i} ${flagOn ? "on " : "off"} ${kind} ${digest.slice(0, 16)}${kind.startsWith("err") ? ` ${errLine(outcome).slice(0, 70)}` : ""}`);
    }

    for (const re of DELETED_GATE) {
      expect(errorMessages.filter((m) => re.test(m)), String(re)).toEqual([]);
    }
    for (const [name, re] of Object.entries(REACHABLE_GATE)) {
      expect(errorMessages.some((m) => re.test(m)), `known-positive: ${name} gate is exercised`).toBe(true);
    }
    expect(successes).toBeGreaterThan(CASES / 3);
    await expect(lines.join("\n") + "\n").toMatchFileSnapshot("./__snapshots__/agent65-world-builder-characterisation.txt");
  }, 120_000);
});
