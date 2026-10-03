/**
 * A_110 M1 / WP-006 K6 — the contract's invariants, as data, over the finite sequence of its chapters.
 *
 * Every contract defect A_110 found was found by a person reading a finished book: the victim "cleared", a joke handed
 * to somebody in custody, the murderer missing from the page of the chapter that names them. Each is a contradiction
 * between two facts the contract already holds, so each is decided here before a single call is made. MEASURED over
 * the 64 stored contracts (31 distinct casts) before the A_110 step-0 fixes: victim among the suspects to clear in 74%
 * of casts, culprit off the reveal's page in 48%, a wit owner off the page in 65% of wit chapters.
 *
 * A rule is a row: a name, the question it answers, and a check that returns the chapters where it fails. WP-006 §2.5
 * writes the same rules as formulas over a trace (always, eventually, until); this is the evaluator for the
 * "always" family over the contract. Telemetry: the run report prints the violations; nothing gates on them.
 */
import type { BookContract, SceneContract } from "./types.js";

export interface RuleViolation {
  rule: string;
  where: string;
}

interface Rule {
  name: string;
  /** The chapters (or "book") where the rule fails; empty when it holds. */
  check: (contract: BookContract, bibleText: string) => string[];
}

const culpritsOf = (c: BookContract): string[] => c.fairPlay.culprits.filter(Boolean);
const onPage = (c: BookContract, s: SceneContract): string[] =>
  s.present.filter((n) => n !== c.fairPlay.victim && !(s.chapter > c.roles.reveal && culpritsOf(c).includes(n)));
const ch = (s: SceneContract): string => `ch${s.chapter}`;

export const CONTRACT_RULES: ReadonlyArray<Rule> = [
  {
    name: "victim-not-cleared",
    check: (c) => c.scenes.filter((s) => s.eliminationsAllowed.some((e) => e.name === c.fairPlay.victim)).map(ch),
  },
  {
    name: "culprit-not-cleared",
    check: (c) => c.scenes.filter((s) => s.eliminationsAllowed.some((e) => culpritsOf(c).includes(e.name))).map(ch),
  },
  {
    name: "culprit-on-reveal-page",
    check: (c) => {
      const reveal = c.scenes.find((s) => s.chapter === c.roles.reveal);
      if (!reveal || culpritsOf(c).length === 0) return [];
      return culpritsOf(c).some((n) => reveal.present.includes(n)) ? [] : [ch(reveal)];
    },
  },
  {
    name: "culprit-on-a-page-before-reveal",
    check: (c) =>
      culpritsOf(c).length === 0 || c.scenes.some((s) => s.chapter < c.roles.reveal && s.present.some((n) => culpritsOf(c).includes(n)))
        ? []
        : ["book"],
  },
  {
    name: "wit-owner-on-page",
    check: (c) =>
      c.scenes
        .filter((s) => s.beats.wit && [s.beats.wit.name, ...s.beats.wit.shapes.map((x) => x.name)].some((n) => !onPage(c, s).includes(n)))
        .map(ch),
  },
  {
    name: "no-wit-at-body-test-reveal",
    check: (c) => {
      const body = c.scenes.find((s) => s.present.includes(c.fairPlay.victim) && !s.wound && !s.victimAlive)?.chapter;
      const forbidden = new Set([body, c.roles.discriminatingTest ?? c.roles.reveal, c.roles.reveal]);
      return c.scenes.filter((s) => s.beats.wit && forbidden.has(s.chapter)).map(ch);
    },
  },
  {
    name: "aftermath-first-not-in-custody",
    check: (c) => c.scenes.filter((s) => s.aftermath?.consequenceFor && culpritsOf(c).includes(s.aftermath.consequenceFor)).map(ch),
  },
  {
    name: "trait-not-in-every-call-bible",
    check: (_c, bible) => (/shown never explained/.test(bible) ? ["bible"] : []),
  },
  {
    name: "trait-owned-once",
    check: (c) => {
      const seen = new Map<string, number>();
      for (const s of c.scenes) if (s.beats.depth) seen.set(s.beats.depth.name, (seen.get(s.beats.depth.name) ?? 0) + 1);
      return [...seen].filter(([, n]) => n > 1).map(([name]) => name);
    },
  },
];

export const checkContractRules = (contract: BookContract, bibleText = contract.bible?.text ?? ""): RuleViolation[] =>
  CONTRACT_RULES.flatMap((rule) => rule.check(contract, bibleText).map((where) => ({ rule: rule.name, where })));
