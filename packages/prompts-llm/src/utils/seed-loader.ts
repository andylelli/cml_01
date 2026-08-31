/**
 * Load and analyze seed CML files for structural patterns
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parse as parseYAML } from "yaml";
import type { SeedPattern } from "../types.js";

/**
 * A_79 B — the corpus is loaded from `library/works/<slug>/case.cml2.yaml` as well as from the flat
 * `examples/` directory.
 *
 * Every file in `examples/` is a legacy encoding: A_77 §4.2 measured 0 of 14 passing `validateCml`,
 * and §3.2 found four of them materially wrong about their own plots — one naming a character who
 * does not exist in the book. `library/works/` holds re-encodings verified span-by-span against the
 * source text. Both are read, and the corpus is read FIRST so that where a work exists in both the
 * verified copy is the one an axis filter reaches.
 *
 * Default OFF, for the same reason A1 is: this changes what every Agent 3 prompt is built from.
 */
const corpusSeedsEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.SEED_CORPUS_FROM_LIBRARY ?? "").trim());

/**
 * A_79 §11.3 — skip works the evidence gate FAILED.
 *
 * `library/works/.verification.json` is written by `scripts/corpus-sync-fingerprints.mjs`, which
 * recomputes each work's anchor coverage against its own source text. A work marked `failed` has
 * positive evidence against it: our first Big Bow Mystery encode described the murderer entering the
 * locked room beforehand with a key — which is the book's REFUTED theory, argued at length in-world,
 * and the exact opposite of Zangwill's trick. It passed `validateCml` cleanly, because a schema check
 * cannot tell a coherent wrong answer from a right one.
 *
 * Only `failed` is excluded. A work with no evidence on disk is kept: "we did not look" must never
 * read as "it is bad". Missing manifest = nothing skipped, so the gate can only ever remove works it
 * has actually judged.
 */
const failedWorks = (root: string): Set<string> => {
  const manifest = join(root, ".verification.json");
  if (!existsSync(manifest)) return new Set();
  try {
    const works = (JSON.parse(readFileSync(manifest, "utf-8")) as { works?: Record<string, string> }).works ?? {};
    return new Set(Object.entries(works).filter(([, state]) => state === "failed").map(([slug]) => slug));
  } catch {
    return new Set();
  }
};

const loadLibraryWorks = (examplesDir: string): any[] => {
  if (!corpusSeedsEnabled()) return [];
  const root =
    String(process.env.SEED_CORPUS_LIBRARY_DIR ?? "").trim() ||
    join(examplesDir, "..", "library", "works");
  if (!existsSync(root)) return [];
  const failed = failedWorks(root);
  const out: any[] = [];
  for (const slug of readdirSync(root).sort()) {
    if (failed.has(slug)) continue;
    const file = join(root, slug, "case.cml2.yaml");
    if (!existsSync(file)) continue;
    try {
      out.push({ filename: `${slug}.yaml`, cml: parseYAML(readFileSync(file, "utf-8")) });
    } catch {
      /* a single unreadable work must not take the generator down */
    }
  }
  return out;
};

export function loadSeedCMLFiles(examplesDir: string): any[] {
  if (!examplesDir || !existsSync(examplesDir)) {
    return loadLibraryWorks(examplesDir ?? "");
  }

  try {
    const corpus = loadLibraryWorks(examplesDir);
    const seen = new Set(corpus.map((e) => e.filename.replace(/\.ya?ml$/, "")));
    const files = readdirSync(examplesDir).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
    const legacy = files
      .filter((f) => !seen.has(f.replace(/_cml2\.ya?ml$/, "").replace(/\.ya?ml$/, "")))
      .map((file) => ({ filename: file, cml: parseYAML(readFileSync(join(examplesDir, file), "utf-8")) }));
    return [...corpus, ...legacy];
  } catch {
    return [];
  }
}

export function extractStructuralPatterns(cmlFiles: any[]): SeedPattern[] {
  return cmlFiles.map(({ filename, cml }) => {
    /**
     * The axis lives on `false_assumption.type`. It has never lived on `meta.primaryAxis`.
     *
     * This read `cml?.CASE?.meta?.primaryAxis`, a field NO seed file and no generated CML has ever
     * carried, so every one of the 13 curated exemplars extracted as `axis: "unknown"`.
     * `selectRelevantPatterns` then filtered for an exact axis match and returned **zero patterns for
     * all five axes**, so `formatPatternsForPrompt` emitted "No seed patterns available for this
     * axis." on every run this project has ever done. The entire seed library — the Moonstone, Styles,
     * the Yellow Room — has never reached a prompt.
     *
     * It matters most for exactly the axes that need it: the corpus holds identity ×3 and spatial ×2,
     * and an `identity` run was getting none of them while being handed the bare word "identity".
     *
     * A THIRD SPELLING of one vocabulary — `false_assumption.type` is what the data uses,
     * `meta.primary_axis` is the snake_case fallback agents 5–8 read, and `meta.primaryAxis` is this
     * camelCase one that matches nothing. Read in the same order agents 5–8 already do, so the seed
     * loader and the downstream agents agree on where the axis lives.
     */
    const axis =
      cml?.CASE?.false_assumption?.type ||
      cml?.CASE?.meta?.primary_axis ||
      cml?.CASE?.meta?.primaryAxis ||
      "unknown";
    
    /**
     * A_79 B — THREE OF THESE FIVE READS COULD NEVER RETURN A VALUE.
     *
     * `hidden_model.mechanism.type` — no seed file has ever had a `.type`; the text is in
     *   `.description`. Always "unknown".
     * `constraint_space.constraints` — there is no such array. The real shape is
     *   `.time` / `.access` / `.social`, each holding named lists. Always 0.
     * `inference_path.length` — `inference_path` is an OBJECT with a `.steps` array. `.length` on an
     *   object is `undefined`. Always 0.
     *
     * So the one block designed to carry worked structure into a prompt emitted, for every book this
     * project has ever held: "Mechanism type: unknown / Constraint space size: 0 constraints /
     * Inference path: 0 steps" (A_78 §3). Fixing the axis read (X91) fixed SELECTION; this fixes
     * CONTENT, which is the half that was actually empty.
     */
    const C = cml?.CASE ?? {};

    /**
     * A_79 B — ROLE-AWARE DE-SPECIFICATION, for the same reason the device patterns get it.
     *
     * An exemplar teaches the SHAPE of a deception. A character's name teaches nothing and is the one
     * thing in the block a generator could copy, so it is replaced by the role that character plays.
     * Replacing every name with a single placeholder would be worse than useless — it collapses the
     * victim and the culprit into one word and destroys the distinction that IS the mystery
     * (A_78 §9.4) — so each name is swapped for its OWN role.
     *
     * Object nouns are deliberately kept. "The canary", "the two pills", "the bird-cage" are genre
     * furniture, not anyone's property, and they are the part that makes an example legible.
     */
    const ROLE_WORD: Record<string, string> = {
      victim: "the victim", culprit: "the culprit", detective: "the investigator",
      suspect: "a suspect", witness: "a witness", bystander: "a bystander",
    };
    const TITLES = new Set(["The", "Mrs", "Mr", "Sir", "Miss", "Dr", "Lady", "Lord", "Inspector", "Doctor"]);
    const subs: Array<[string, string]> = [];
    for (const member of (C.cast ?? []) as any[]) {
      const word = ROLE_WORD[String(member?.role ?? "")] ?? "a person";
      for (const part of String(member?.name ?? "").replace(/[^A-Za-z ]/g, " ").split(/\s+/)) {
        if (/^[A-Z]/.test(part) && part.length > 2 && !TITLES.has(part)) subs.push([part, word]);
      }
    }
    subs.sort((a, b) => b[0].length - a[0].length);
    const despecify = (text: unknown): string => {
      let t = String(text ?? "").replace(/\s+/g, " ").trim();
      for (const [name, word] of subs) {
        t = t.replace(new RegExp(`\\b${name}(\u2019s|'s)?\\b`, "g"), word);
      }
      return t.replace(/\b(the victim|the culprit|the investigator|a suspect)(,? \1)+/g, "$1").trim();
    };

    const cs = C.constraint_space ?? {};
    const constraintSpaceSize =
      (cs.time?.anchors?.length ?? 0) + (cs.time?.windows?.length ?? 0) +
      (cs.access?.actors?.length ?? 0) + (cs.access?.objects?.length ?? 0) +
      (cs.social?.trust_channels?.length ?? 0) + (cs.social?.authority_sources?.length ?? 0);
    const steps: any[] = C.inference_path?.steps ?? [];

    return {
      id: filename.replace(/\.(yaml|yml)$/, ""),
      title: C.meta?.title || filename.replace(/_cml2\.(yaml|yml)$/, "").replace(/\.(yaml|yml)$/, ""),
      axis,
      structure: {
        mechanismType: C.meta?.crime_class?.subtype || C.hidden_model?.mechanism?.type || "unknown",
        falseAssumptionPattern: C.false_assumption?.type || "unknown",
        constraintSpaceSize,
        inferencePathSteps: steps.length,
        discriminatingTestMethod: C.discriminating_test?.method || "unknown",
      },
      content: {
        premise: despecify(C.surface_model?.narrative?.summary),
        falseAssumptionStatement: despecify(C.false_assumption?.statement),
        mechanismDescription: despecify(C.hidden_model?.mechanism?.description),
        inferenceSketch: steps
          .map((st: any, i: number) => `${i + 1}. ${despecify(st?.correction ?? st?.observation)}`)
          .filter((l) => l.length > 6)
          .join(" "),
        discriminatingTestDesign: despecify(C.discriminating_test?.design),
      },
    };
  });
}

export function selectRelevantPatterns(
  patterns: SeedPattern[],
  targetAxis: string,
  maxPatterns = 3
): SeedPattern[] {
  // Filter to same axis
  const sameAxis = patterns.filter(p => p.axis === targetAxis);
  
  // Take up to maxPatterns
  return sameAxis.slice(0, maxPatterns);
}

export function formatPatternsForPrompt(patterns: SeedPattern[]): string {
  if (patterns.length === 0) {
    return "No seed patterns available for this axis.";
  }

  /**
   * A_79 B — emit the WORKED CASE, not a row of counts.
   *
   * The previous block conveyed, per book, a filename and one word: three of its five fields were
   * structurally always-empty and a fourth restated the axis the prompt had already been given. A
   * generator cannot learn the shape of a deception from "0 constraints".
   *
   * These are structures, not text to imitate: no character name, no setting and no sentence of any
   * novel appears here. What is shown is what the reader was meant to believe, what was actually
   * true, how the gap was closed and how the truth was forced — which is genre grammar, and is the
   * only part of a mystery that transfers.
   */
  const trim = (s: string, n: number): string =>
    s.length <= n ? s : `${s.slice(0, s.lastIndexOf(" ", n) > 0 ? s.lastIndexOf(" ", n) : n)}…`;

  return patterns
    .map((p) => {
      const c = p.content ?? ({} as SeedPattern["content"]);
      const lines = [`WORKED EXAMPLE — ${p.title} (${p.axis} axis)`];
      if (c.premise) lines.push(`  Surface: ${trim(c.premise, 260)}`);
      if (c.falseAssumptionStatement) lines.push(`  The reader's wrong belief: ${trim(c.falseAssumptionStatement, 200)}`);
      if (c.mechanismDescription) lines.push(`  What was actually happening: ${trim(c.mechanismDescription, 300)}`);
      if (c.inferenceSketch) lines.push(`  How the gap closed (${p.structure.inferencePathSteps} steps): ${trim(c.inferenceSketch, 420)}`);
      if (c.discriminatingTestDesign) lines.push(`  How the truth was forced (${p.structure.discriminatingTestMethod}): ${trim(c.discriminatingTestDesign, 260)}`);
      lines.push(`  Constraint space: ${p.structure.constraintSpaceSize} named anchors, actors and channels`);
      return lines.join("\n");
    })
    .join("\n\n") +
    "\n\nThese are STRUCTURES, not material. Build a different deception of comparable rigour: do not " +
    "reuse a mechanism, a setting or a phrase from any of them.";
}
