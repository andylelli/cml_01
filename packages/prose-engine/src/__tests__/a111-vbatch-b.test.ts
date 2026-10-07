/**
 * A_111 V batch, group B — selection, the culprit predicate and the gate (WF-005 V2O-01/02, V2K-02/03/06/08/10/11).
 *
 * Every fix rides PROSE_V2_AUDIT_FIXES (read at call time). Each `describe` holds a KNOWN POSITIVE — the defect,
 * reproduced with the flag unset — next to the repaired behaviour with the flag on. The sentences are the shapes the
 * audit measured on stored books; the names are invented.
 */
import { afterEach, describe, expect, it } from "vitest";

import { clueTermsOnPage, keyTermHits } from "../clue-terms.js";
import { culpritContextOf, namesAsCulprit } from "../culprit.js";
import { applyGate } from "../gate.js";
import { checkHardGates, measureInstruments } from "../selector.js";
import type { ClueSurface, ContractCore, Finding, ProseChapterLike, SceneContract } from "../types.js";

const FLAG = "PROSE_V2_AUDIT_FIXES";
const on = <T>(f: () => T): T => {
  process.env[FLAG] = "1";
  try {
    return f();
  } finally {
    delete process.env[FLAG];
  }
};
afterEach(() => {
  delete process.env[FLAG];
});

const scene = (chapter: number, extra: Partial<SceneContract> = {}): SceneContract =>
  ({
    chapter,
    beat: null,
    role: "investigation",
    title: `Chapter ${chapter}`,
    present: ["Ada Larch", "Felix Larch", "Tobias Wren", "Inspector Hollis"],
    location: "the boathouse",
    mustSurface: [],
    mayMention: [],
    mustNotReveal: [],
    eliminationsAllowed: [],
    job: null,
    beats: {},
    ...extra,
  }) as SceneContract;

/** Ten chapters, reveal at 8, culprit Ada Larch, victim Felix Larch (one surname: the archive has two such cases). */
const makeCore = (overrides: { scenes?: SceneContract[]; decisive?: string[]; min?: number } = {}): ContractCore =>
  ({
    book: { chapters: 10, words: { min: overrides.min ?? 7_500, max: 12_500 } },
    chronology: { rows: [] },
    roles: { reveal: 8, discriminatingTest: 7, aftermath: 10, falseSolution: null, clearances: [] },
    scenes: overrides.scenes ?? Array.from({ length: 10 }, (_, i) => scene(i + 1)),
    fairPlay: {
      culprits: ["Ada Larch"],
      victim: "Felix Larch",
      mechanismSummary: "",
      decisiveClueIds: overrides.decisive ?? [],
      revealChapter: 8,
    },
    notes: [],
  }) as unknown as ContractCore;

const ch = (number: number, ...paragraphs: string[]): ProseChapterLike => ({ number, title: "", paragraphs });
const words = (n: number, word = "rain"): string => Array.from({ length: n }, () => word).join(" ") + ".";

// ── V-10 — the culprit predicate ─────────────────────────────────────────────────────────────────────────────────

describe("V-10: a deed verb needs a person as its object; a possessive is never the agent; a shared surname is not a name", () => {
  const people = culpritContextOf(makeCore());

  it("KNOWN POSITIVE: OFF, a figurative 'cut through the silence' names the culprit as the murderer", () => {
    const text = "She remembered the dinner where Ada Larch's wit had cut through the silence.";
    expect(namesAsCulprit(text, "Ada Larch", people)).toBe(true);
    expect(on(() => namesAsCulprit(text, "Ada Larch", people))).toBe(false);
  });

  it("KNOWN POSITIVE: OFF, a struck match and a cut-glass tumbler accuse the person holding them", () => {
    for (const text of [
      "In the hush that followed, Ada Larch struck a match and touched it to the wick of a lamp.",
      "Ada Larch busied herself with the decanter, pouring brandy into a cut-glass tumbler.",
      "Ada Larch pushed open the door to the boathouse.",
      "Ada Larch waited until the clock struck eleven.",
    ]) {
      expect(namesAsCulprit(text, "Ada Larch", people), text).toBe(true);
      expect(on(() => namesAsCulprit(text, "Ada Larch", people)), text).toBe(false);
    }
  });

  it("a real accusation still names the culprit: the victim, any part of the victim's name, or a pronoun as object", () => {
    for (const text of [
      '"Ada Larch killed Felix Larch," the inspector said.',
      "It was Ada Larch who struck him down in the boathouse.",
      "Ada Larch, you drowned Felix in the shallows and walked back dry.",
      "Ada Larch is the murderer.",
      "Ada Larch was arrested before the constable had finished his tea.",
    ]) {
      expect(on(() => namesAsCulprit(text, "Ada Larch", people)), text).toBe(true);
    }
  });

  it("KNOWN POSITIVE: OFF, the culprit's surname alone matches a relative who shares it; ON only a unique surname does", () => {
    const text = "Larch confessed to the inspector before dawn.";
    expect(namesAsCulprit(text, "Ada Larch", people)).toBe(true);
    expect(on(() => namesAsCulprit(text, "Ada Larch", people))).toBe(false);
    // the full name is never ambiguous
    expect(on(() => namesAsCulprit("Ada Larch confessed to the inspector before dawn.", "Ada Larch", people))).toBe(true);
    // a surname nobody else carries still stands for the culprit
    expect(on(() => namesAsCulprit("Wren confessed to the inspector before dawn.", "Tobias Wren", people))).toBe(true);
  });

  it("KNOWN POSITIVE: OFF, the murderer is 'Ada Larch's footman' reads as Ada Larch; ON the possessor is not the agent", () => {
    const text = "The murderer was Ada Larch's footman, all along.";
    expect(namesAsCulprit(text, "Ada Larch", people)).toBe(true);
    expect(on(() => namesAsCulprit(text, "Ada Larch", people))).toBe(false);
  });

  it("'X's confession' is X's own act, and still names X", () => {
    expect(on(() => namesAsCulprit("The room absorbed the weight of Ada Larch's confession.", "Ada Larch", people))).toBe(true);
    expect(on(() => namesAsCulprit("Ada Larch's maid confessed to the theft of a brooch.", "Ada Larch", people))).toBe(false);
  });

  it("the gate's fair-play stop: OFF a figurative line after the reveal ships the book; ON it stops", () => {
    const core = makeCore();
    const chapters = Array.from({ length: 10 }, (_, i) =>
      i + 1 === 9 ? ch(9, "She recalled how Ada Larch's wit had cut through the silence.") : ch(i + 1, "The rain kept on."),
    );
    const expected = chapters.map((c) => c.number!);
    expect(applyGate({ chapters, core, expected, findings: [], deterministicWrites: 0 }).ship).toBe(true);
    const verdict = on(() => applyGate({ chapters, core, expected, findings: [], deterministicWrites: 0 }));
    expect(verdict.ship).toBe(false);
    expect(verdict.stops[0]).toMatch(/names Ada Larch as the murderer/);
  });

  it("the selector's culprit_early: OFF a struck match before the reveal is an early naming; ON it is not", () => {
    const core = makeCore({ scenes: Array.from({ length: 10 }, (_, i) => scene(i + 1, { mustNotReveal: i + 1 < 8 ? [{ what: "culprit", until: 8 }] as never : [] })) });
    const draft = [ch(3, "Ada Larch struck a match and lit the lamp.")];
    expect(checkHardGates(draft, core, [3]).some((h) => h.kind === "culprit_early")).toBe(true);
    expect(on(() => checkHardGates(draft, core, [3])).some((h) => h.kind === "culprit_early")).toBe(false);
    const accused = [ch(3, "Ada Larch killed Felix Larch and nobody saw.")];
    expect(on(() => checkHardGates(accused, core, [3])).some((h) => h.kind === "culprit_early")).toBe(true);
  });
});

// ── V-11 — book-level checks with one chapter per call ───────────────────────────────────────────────────────────

describe("V-11: book-level kinds read the book so far, not one chapter", () => {
  const core = makeCore();

  it("KNOWN POSITIVE: OFF, one 1,100-word chapter is 'book_short' against the BOOK's 7,500; ON against its share", () => {
    const draft = [ch(4, words(1_100))];
    expect(checkHardGates(draft, core, [4]).some((h) => h.kind === "book_short")).toBe(true);
    expect(on(() => checkHardGates(draft, core, [4])).some((h) => h.kind === "book_short")).toBe(false);
    // a genuinely short chapter still ranks below: 300 words against a share of 750
    const short = on(() => checkHardGates([ch(4, words(300))], core, [4])).find((h) => h.kind === "book_short");
    expect(short?.detail).toMatch(/300 words against 750/);
  });

  it("over the whole book the floor is the whole minimum, ON as OFF", () => {
    const book = Array.from({ length: 10 }, (_, i) => ch(i + 1, words(700)));
    const expected = book.map((c) => c.number!);
    expect(checkHardGates(book, core, expected).some((h) => h.kind === "book_short")).toBe(true);
    expect(on(() => checkHardGates(book, core, expected)).some((h) => h.kind === "book_short")).toBe(true);
  });

  it("KNOWN POSITIVE: OFF, a chapter after the reveal is 'reveal_unnamed' unless it accuses again; ON the book already did", () => {
    const soFar = { chapters: [ch(7, "The rain kept on."), ch(8, '"Ada Larch killed Felix Larch," the inspector said.')], numbers: [7, 8] };
    const draft = [ch(9, "The house was quiet in the morning, and the boats were drawn up.")];
    expect(checkHardGates(draft, core, [9], undefined, soFar).some((h) => h.kind === "reveal_unnamed")).toBe(true);
    expect(on(() => checkHardGates(draft, core, [9], undefined, soFar)).some((h) => h.kind === "reveal_unnamed")).toBe(false);
  });

  it("while the book has NOT named the culprit, the later draft that names them still wins", () => {
    const soFar = { chapters: [ch(8, "The inspector looked at each of them in turn.")], numbers: [8] };
    const silent = [ch(9, "The house was quiet in the morning.")];
    const naming = [ch(9, "Ada Larch was arrested before the constable had finished his tea.")];
    expect(on(() => checkHardGates(silent, core, [9], undefined, soFar)).some((h) => h.kind === "reveal_unnamed")).toBe(true);
    expect(on(() => checkHardGates(naming, core, [9], undefined, soFar)).some((h) => h.kind === "reveal_unnamed")).toBe(false);
  });

  it("the reveal chapter itself must still name the culprit", () => {
    const draft = [ch(8, "The inspector looked at each of them in turn.")];
    expect(on(() => checkHardGates(draft, core, [8], undefined, { chapters: [], numbers: [] })).some((h) => h.kind === "reveal_unnamed")).toBe(true);
  });

  it("KNOWN POSITIVE: OFF, a report-only finding is a warning, so every run reads needs_review; ON it is a report", () => {
    const finding = (cls: Finding["class"], severity: Finding["severity"]): Finding =>
      ({ class: cls, chapter: 3, quote: "q", note: "n", severity, source: "checker" }) as Finding;
    const findings = [finding("clock_off_table", "report"), finding("clock_off_table", "report"), finding("recap", "craft")];
    const book = Array.from({ length: 10 }, (_, i) => ch(i + 1, i + 1 === 8 ? "Ada Larch killed Felix Larch." : "Rain."));
    const args = { chapters: book, core, expected: book.map((c) => c.number!), findings, deterministicWrites: 0 };
    const off = applyGate(args);
    expect(off.warnings).toEqual(["clock_off_table: 2 unresolved", "recap: 1 unresolved"]);
    expect(off.reports).toBeUndefined();
    const audited = on(() => applyGate(args));
    expect(audited.warnings).toEqual(["recap: 1 unresolved"]);
    expect(audited.reports).toEqual(["clock_off_table: 2 reported (report-only, never sent to an editor)"]);
  });
});

// ── V-15 — clue presence: whole words, half the clue's own terms, one chapter ────────────────────────────────────

describe("V-15: the clue tests count whole words, and need half the clue's own key terms", () => {
  const TERMS = ["fishing", "knife", "cellar", "door", "lock", "bear", "traces", "handling"];

  it("whole words in their regular inflections, never inside another word", () => {
    expect(keyTermHits(["lock"], "the door was locked", "word")).toBe(1);
    expect(keyTermHits(["lock"], "a block of ice and a silver locket", "word")).toBe(0);
    expect(keyTermHits(["bear"], "he stroked his beard", "word")).toBe(0);
    expect(keyTermHits(["handling"], "someone had handled the blade", "word")).toBe(1);
    expect(keyTermHits(["traces"], "a trace of oil", "word")).toBe(1);
    expect(clueTermsOnPage(TERMS, "the fishing knife lay by the cellar door, its lock scored.")).toBe(true);
    expect(clueTermsOnPage(TERMS, "she closed the door and stroked her beard.")).toBe(false);
    expect(clueTermsOnPage([], "anything")).toBe(true);
  });

  it("KNOWN POSITIVE: OFF, the gate's decisive-clue stop passes on 'door' and the 'bear' in 'beard'; ON it stops", () => {
    const surface: ClueSurface = { id: "clue_knife", observable: "", keyTerms: TERMS } as ClueSurface;
    const core = makeCore({ decisive: ["clue_knife"], scenes: Array.from({ length: 10 }, (_, i) => scene(i + 1, { mustSurface: i + 1 === 3 ? [surface] : [] })) });
    const book = (three: string) =>
      Array.from({ length: 10 }, (_, i) => ch(i + 1, i + 1 === 3 ? three : i + 1 === 8 ? "Ada Larch killed Felix Larch." : "He shut the door and stroked his beard."));
    const generic = book("The rain kept on against the door.");
    const args = (chapters: ProseChapterLike[]) => ({ chapters, core, expected: chapters.map((c) => c.number!), findings: [], deterministicWrites: 0 });
    expect(applyGate(args(generic)).stops).toEqual([]);
    expect(on(() => applyGate(args(generic))).stops[0]).toMatch(/decisive clue clue_knife is on no page before the reveal/);
    const staged = book("The fishing knife lay by the cellar door; its lock showed fresh traces of handling.");
    expect(on(() => applyGate(args(staged))).stops).toEqual([]);
  });

  it("the gate asks it of ONE chapter: terms scattered one per chapter across the book are not a staged clue", () => {
    const surface: ClueSurface = { id: "clue_knife", observable: "", keyTerms: TERMS } as ClueSurface;
    const core = makeCore({ decisive: ["clue_knife"], scenes: Array.from({ length: 10 }, (_, i) => scene(i + 1, { mustSurface: i + 1 === 3 ? [surface] : [] })) });
    const scattered = ["fishing rods", "a knife", "the cellar", "a door", "a lock", "a bear", "traces"].map((w, i) => ch(i + 1, `There was ${w} somewhere.`));
    const chapters = [...scattered, ch(8, "Ada Larch killed Felix Larch."), ch(9, "Rain."), ch(10, "Rain.")];
    const verdict = on(() => applyGate({ chapters, core, expected: chapters.map((c) => c.number!), findings: [], deterministicWrites: 0 }));
    expect(verdict.stops.some((s) => s.includes("clue_knife"))).toBe(true);
  });

  it("KNOWN POSITIVE: OFF, the selector's clue_missing accepts a generic family ('letter, written'); ON it needs the clue's own terms", () => {
    const surface: ClueSurface = { id: "clue_ledger", observable: "a torn ledger page with a pencilled tide time", keyTerms: ["torn", "ledger", "page", "pencilled", "tide", "time"] } as ClueSurface;
    const core = makeCore({ scenes: Array.from({ length: 10 }, (_, i) => scene(i + 1, { mustSurface: i + 1 === 3 ? [surface] : [] })) });
    const clues = { clues: [{ id: "clue_ledger", description: "a document showing the letter was written later", observable: "a document showing the letter was written later", pointsTo: "a forged letter" }] };
    const generic = [ch(3, "A letter had come by the evening post, written in a hand nobody knew, and the document lay on the hall table.")];
    expect(checkHardGates(generic, core, [3], clues).some((h) => h.kind === "clue_missing")).toBe(false);
    expect(on(() => checkHardGates(generic, core, [3], clues)).some((h) => h.kind === "clue_missing")).toBe(true);
    const staged = [ch(3, "On the torn ledger page someone had pencilled the tide time in a small hand.")];
    expect(on(() => checkHardGates(staged, core, [3], clues)).some((h) => h.kind === "clue_missing")).toBe(false);
  });
});

// ── V-16a — the long-sentence instrument ─────────────────────────────────────────────────────────────────────────

describe("V-16a: sentences split after a closing quote and at a paragraph break", () => {
  const twenty = "the tide came in over the flats and the boats lifted one by one against the posts of the jetty";

  it("KNOWN POSITIVE: OFF, two 20-word sentences joined by a closing quote count as one long sentence; ON as two", () => {
    const chapters = [ch(1, `"${twenty}." ${twenty[0]!.toUpperCase()}${twenty.slice(1)}.`)];
    expect(measureInstruments(chapters).longSentenceShare).toBe(1);
    expect(on(() => measureInstruments(chapters).longSentenceShare)).toBe(0);
  });

  it("KNOWN POSITIVE: OFF, a paragraph ending on a closing quote is glued to the next paragraph; ON it is not", () => {
    const chapters = [ch(1, `"${twenty}."`, `${twenty[0]!.toUpperCase()}${twenty.slice(1)}.`)];
    expect(measureInstruments(chapters).longSentenceShare).toBe(1);
    expect(on(() => measureInstruments(chapters).longSentenceShare)).toBe(0);
  });

  it("a genuinely long sentence is still long", () => {
    const chapters = [ch(1, `${twenty} and ${twenty}.`)];
    expect(on(() => measureInstruments(chapters).longSentenceShare)).toBe(1);
  });
});

// A_111 P-11 — arm D's reveal named its murderer as "Adela looked from Ivor to Harriet, her voice steady. "You killed
// Cecil Thorne."": the accusation one sentence after the name, and the culprit by first name alone. Both count, the
// first name only when nobody else in the case carries it; a figurative "you struck a match" still does not.
describe("A_111 P-11 — the accusation in the next sentence, and the unique first name", () => {
  const ctx = { victim: "Cecil Thorne", cast: ["Adela Halloway", "Cecil Thorne", "Harriet Bellamy", "Ivor Yardley", "Marguerite Selwyn"] };
  it("counts with the audit flag on", async () => {
    process.env.PROSE_V2_AUDIT_FIXES = "1";
    const { namesAsCulprit } = await import("../culprit.js");
    expect(namesAsCulprit('Adela looked from Ivor to Harriet, her voice steady. "You killed Cecil Thorne."', "Ivor Yardley", ctx)).toBe(true);
    expect(namesAsCulprit("Harriet turned to Ivor. You killed him.", "Ivor Yardley", ctx)).toBe(true);
    expect(namesAsCulprit("Ivor smiled. You struck a match.", "Ivor Yardley", ctx)).toBe(false);
    expect(namesAsCulprit("Ivor's wit had cut through the silence.", "Ivor Yardley", ctx)).toBe(false);
    delete process.env.PROSE_V2_AUDIT_FIXES;
  });
  it("a first name another member shares is not the culprit", async () => {
    process.env.PROSE_V2_AUDIT_FIXES = "1";
    const { namesAsCulprit } = await import("../culprit.js");
    const shared = { ...ctx, cast: [...ctx.cast, "Ivor Pike"] };
    expect(namesAsCulprit('Adela looked at Ivor. "You killed Cecil Thorne."', "Ivor Yardley", shared)).toBe(false);
    delete process.env.PROSE_V2_AUDIT_FIXES;
  });
});
