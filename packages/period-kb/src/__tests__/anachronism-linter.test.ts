import { describe, expect, it } from "vitest";
import { lint } from "../anachronism-linter.js";
import { loadEraEntry } from "../loader.js";

const era1931 = loadEraEntry(1931);

const tokens = (s: string): Set<string> =>
  new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));

// 20 snippets, each containing exactly one anachronism for 1931.
const PLANTED_ANACHRONISMS: string[] = [
  "The fluorescent light hummed overhead.",
  "She filled in the form with a ballpoint pen.",
  "The lab confirmed a DNA profiling match.",
  "He switched on the television set in the corner.",
  "Her mobile phone buzzed in her handbag.",
  "A CCTV camera watched the hallway.",
  "The doctor prescribed penicillin for the wound.",
  "He ran the page through the photocopier.",
  "The computer beeped as it processed the data.",
  "They boarded the jet airliner at dawn.",
  "Forensics took a DNA swab from the glass.",
  "He signed it with a biro.",
  "The halogen lamp glared on the desk.",
  "A security camera covered the gate.",
  "The nurse administered antibiotics overnight.",
  "A surveillance camera blinked above the door.",
  "She clicked record on the tape recorder.",
  "Strip lighting flickered in the cellar.",
  "The cell phone screen lit the room.",
  "An LED light glowed on the panel.",
];

// Period-faithful snippets the linter must NOT flag.
const CLEAN_PERIOD_SNIPPETS: string[] = [
  "Gaslight flickered along the corridor.",
  "The motorcar's headlights swept the gravel drive.",
  "A wireless set crackled in the drawing room.",
  "The telegram arrived just before noon.",
  "He dusted the glass for fingerprints with grey powder.",
];

describe("anachronism linter — detection (§9.1 S2 spike gate: ≥18/20, <2 false positives)", () => {
  it("flags at least 18 of 20 planted anachronisms", () => {
    const flagged = PLANTED_ANACHRONISMS.filter((s) => lint(s, era1931).violations.length > 0);
    expect(flagged.length).toBeGreaterThanOrEqual(18);
  });

  it("actually flags all 20 (current lexicon)", () => {
    const missed = PLANTED_ANACHRONISMS.filter((s) => lint(s, era1931).violations.length === 0);
    expect(missed).toEqual([]);
  });

  it("produces fewer than 2 false positives on clean period prose", () => {
    const falsePositives = CLEAN_PERIOD_SNIPPETS.filter((s) => lint(s, era1931).violations.length > 0);
    expect(falsePositives.length).toBeLessThan(2);
    expect(falsePositives).toEqual([]);
  });
});

describe("anachronism linter — invariants", () => {
  it("ok=false when a violation exists, ok=true when clean", () => {
    expect(lint("The fluorescent light hummed.", era1931).ok).toBe(false);
    expect(lint("Gaslight flickered.", era1931).ok).toBe(true);
  });

  it("reports each canonical anachronism once even if phrased twice", () => {
    const r = lint("The fluorescent light and the fluorescent lighting both buzzed.", era1931);
    expect(r.violations).toHaveLength(1);
  });

  it("NEVER adds facts: stripped output tokens are a subset of input tokens", () => {
    const input =
      "Gaslight flickered along the hall. The fluorescent light hummed overhead. The telegram arrived at noon.";
    const { strippedText } = lint(input, era1931, { strip: true });
    expect(strippedText).toBeDefined();
    const out = tokens(strippedText!);
    const inp = tokens(input);
    for (const t of out) {
      expect(inp.has(t), `stripped output introduced token "${t}"`).toBe(true);
    }
    // and it actually removed the offending term
    expect(strippedText!.toLowerCase()).not.toContain("fluorescent");
    expect(strippedText!.toLowerCase()).toContain("telegram");
  });

  it("strip is a no-op on clean text", () => {
    const input = "Gaslight flickered along the hall.";
    expect(lint(input, era1931, { strip: true }).strippedText).toBe(input);
  });
});

describe("anachronism linter — is year-sensitive (per-entry, not global)", () => {
  it("flags 'fluorescent light' in 1931 but NOT in 1955", () => {
    const text = "The fluorescent light buzzed overhead.";
    expect(lint(text, loadEraEntry(1931)).violations.length).toBeGreaterThan(0);
    expect(lint(text, loadEraEntry(1955)).violations.length).toBe(0);
  });

  it("flags 'television' in 1925 but NOT in 1965", () => {
    const text = "He switched on the television in the corner.";
    expect(lint(text, loadEraEntry(1925)).violations.length).toBeGreaterThan(0);
    expect(lint(text, loadEraEntry(1965)).violations.length).toBe(0);
  });

  it("still flags DNA in every seeded decade (it never arrives in our range)", () => {
    const text = "The lab ran a DNA profiling match.";
    for (const year of [1925, 1931, 1945, 1955, 1965]) {
      expect(lint(text, loadEraEntry(year)).violations.length, `year ${year}`).toBeGreaterThan(0);
    }
  });
});
