import { describe, it, expect } from "vitest";
import { ChapterValidator, validateChapterSequence } from "../chapter-validator.js";
import type { CMLData } from "../types.js";

const makeCml = (): CMLData => ({
  CASE: {
    meta: {
      setting: {
        location: "Harrowfield Hall",
      },
    },
    cast: [
      { name: "Jennifer Daubeny", role_archetype: "suspect" },
      { name: "Michael Warenne", role_archetype: "detective" },
    ],
    culpability: { culprits: ["Jennifer Daubeny"] },
  },
});

describe("ChapterValidator tightening", () => {
  const validator = new ChapterValidator();

  it("flags opening block when location/sensory/atmosphere grounding is delayed", () => {
    const chapter = {
      chapterNumber: 2,
      title: "Late Grounding",
      paragraphs: [
        "The interview began with clipped questions and careful answers.",
        "No one commented on the room or the weather while the silence stretched.",
        "Only later did they cross into Harrowfield Hall's library as rain tapped the stained-glass windows.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((issue) => issue.message.includes("opening block lacks a clear named location anchor"))).toBe(true);
    expect(result.issues.some((issue) => issue.message.includes("opening block has weak sensory grounding"))).toBe(true);
    expect(result.issues.some((issue) => issue.message.includes("opening block has weak atmosphere/time grounding"))).toBe(true);
  });

  it("passes opening-block grounding when first paragraph anchors location + sensory + atmosphere", () => {
    const chapter = {
      chapterNumber: 2,
      title: "Strong Opening",
      paragraphs: [
        "At Harrowfield Hall, rain hissed at the windows while a damp draft carried the scent of smoke through the study.",
        "Michael Warenne listened to the whisper of the curtains before he spoke.",
        "Jennifer Daubeny waited by the fireplace.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((issue) => issue.message.includes("opening block"))).toBe(false);
  });

  it("flags month/season contradiction inside a chapter", () => {
    const chapter = {
      chapterNumber: 3,
      title: "Contradiction",
      paragraphs: [
        "The May evening settled over Harrowfield Hall, warm and bright.",
        "Yet the atmosphere was unmistakably autumn, with leaves and fall chill in the same breath.",
        "Michael examined the room in silence.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((issue) => issue.message.includes("month/season contradiction"))).toBe(true);
  });

  it("flags contradiction from temporal lock month even when chapter omits month token", () => {
    const chapter = {
      chapterNumber: 4,
      title: "Temporal Lock",
      temporalMonth: "april",
      temporalSeason: "spring",
      paragraphs: [
        "The grounds looked unmistakably autumnal, with fall chill in every corridor.",
        "No one mentioned the date aloud.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((issue) => issue.message.includes("month/season contradiction"))).toBe(true);
  });

  it("flags contradiction from month abbreviations and dialogue seasonal phrases", () => {
    const chapter = {
      chapterNumber: 5,
      title: "Dialogue Contradiction",
      paragraphs: [
        "By Oct., Harrowfield Hall should have settled into autumn rain.",
        "\"This has a pure springtime glow,\" Jennifer said, smiling at the garden.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((issue) => issue.message.includes("month/season contradiction"))).toBe(true);
  });

  it("flags scaffold/template leakage prose blocks", () => {
    const leaked =
      "At The Library in Harrowfield Village, England, the smell of A musty aroma fills the air, " +
      "a blend of aged paper and polished wood, while overcast with occasional drizzles contributes " +
      "to a moody ambiance, creating an atmosphere ripe for revelation.";

    const chapter = {
      chapterNumber: 5,
      title: "Leakage",
      paragraphs: [
        leaked,
        leaked,
        "Jennifer stared into the fire, saying nothing.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((issue) => issue.message.includes("templated scaffold prose") || issue.message.includes("repeated long boilerplate"))).toBe(true);
  });

  it("flags metadata key-value leakage", () => {
    const chapter = {
      chapterNumber: 3,
      title: "Metadata Leak",
      paragraphs: [
        "Setting: A dimly lit library with oak panelling and dusty shelves.",
        "Jennifer Daubeny shifted in her chair while rain fell against the windows of Harrowfield Hall.",
        "The scent of damp paper hung in the cold air as evening settled.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((i) => i.message.includes("metadata key-value leakage"))).toBe(true);
  });

  it("flags meta-language about storytelling technique", () => {
    const chapter = {
      chapterNumber: 4,
      title: "Meta Language",
      paragraphs: [
        "The rain drummed on the roof of Harrowfield Hall as evening crept across the grounds.",
        "A sensory detail grounding element was woven into the scene to heighten the dramatic irony.",
        "Jennifer looked away from the cold window with a sigh.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((i) => i.message.includes("meta-language about storytelling technique"))).toBe(true);
  });

  it("flags instruction-shaped prose (prompt leakage)", () => {
    const chapter = {
      chapterNumber: 6,
      title: "Instruction Leak",
      paragraphs: [
        "The scent of damp stone filled the hall as evening rain hammered the windows.",
        "Ensure the reader feels the tension building as the detective approaches the study.",
        "Jennifer stood at the mantelpiece and said nothing.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((i) => i.message.includes("instruction-shaped prose"))).toBe(true);
  });

  it("does NOT false-positive on clean narrative prose", () => {
    const chapter = {
      chapterNumber: 2,
      title: "Clean Prose",
      paragraphs: [
        "Rain fell against the windows of Harrowfield Hall as Jennifer Daubeny crossed the corridor.",
        "She paused at the library door, listening to the silence before pushing it open.",
        "Inside, the scent of woodsmoke mingled with damp paper. The fire had burned low.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCml());
    expect(result.issues.some((i) =>
      i.message.includes("metadata key-value leakage") ||
      i.message.includes("meta-language") ||
      i.message.includes("instruction-shaped") ||
      i.message.includes("low verb density")
    )).toBe(false);
  });
});

describe("ChapterValidator — victim identity (chapter 1)", () => {
  const validator = new ChapterValidator();

  const makeCmlWithVictim = (): CMLData => ({
    CASE: {
      meta: { setting: { location: "Harrowfield Hall" } },
      cast: [
        { name: "Edith Clavering", role_archetype: "victim" },
        { name: "Michael Warenne", role_archetype: "detective" },
        { name: "Jennifer Daubeny", role_archetype: "suspect" },
      ],
      culpability: { culprits: ["Jennifer Daubeny"] },
    },
  });

  it("flags anonymous victim language in chapter 1", () => {
    const chapter = {
      chapterNumber: 1,
      title: "The Discovery",
      paragraphs: [
        "The morning mist curled around the old stones of Harrowfield Hall.",
        "In the library, they found the body of an unknown victim lying on the floor.",
        "Michael Warenne knelt beside the still form, his expression grave.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCmlWithVictim());
    expect(
      result.issues.some((i) =>
        i.message.includes("anonymous victim") || i.message.includes('"body of an unknown person"')
      )
    ).toBe(true);
  });

  it("flags chapter 1 that does not name the known victim", () => {
    const chapter = {
      chapterNumber: 1,
      title: "The Discovery",
      paragraphs: [
        "A terrible discovery was made at dawn in the east wing.",
        "The body had been there for hours, cold and still.",
        "Michael Warenne surveyed the scene with sharp eyes.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCmlWithVictim());
    expect(
      result.issues.some((i) => i.message.includes("does not name the victim"))
    ).toBe(true);
  });

  it("does NOT flag chapter 1 when the victim's name appears", () => {
    const chapter = {
      chapterNumber: 1,
      title: "The Discovery",
      paragraphs: [
        "Edith Clavering was found in the library just after seven.",
        "Her coffee cup sat still warm on the side table — a cruel detail.",
        "Michael Warenne examined the scene without speaking.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCmlWithVictim());
    expect(
      result.issues.some(
        (i) => i.message.includes("does not name the victim") || i.message.includes("anonymous victim")
      )
    ).toBe(false);
  });

  it("does NOT check victim naming in chapter 2 or later", () => {
    const chapter = {
      chapterNumber: 2,
      title: "The Investigation Begins",
      paragraphs: [
        "The body of an unknown victim had set the hall abuzz.",
        "Michael Warenne stood at the window, thinking.",
      ],
    };

    const result = validator.validateChapter(chapter, makeCmlWithVictim());
    // Victim naming check only applies to chapter 1 — no victim issue expected for ch2
    expect(
      result.issues.some(
        (i) => i.message.includes("does not name the victim") || i.message.includes("anonymous victim")
      )
    ).toBe(false);
  });
});

// Helpers for discriminating test threshold tests
const makeCmlWithDiscriminatingTest = (): CMLData => ({
  CASE: {
    meta: { setting: { location: "Harrowfield Hall" } },
    cast: [{ name: "Jennifer Daubeny", role_archetype: "suspect" }],
    culpability: { culprits: ["Jennifer Daubeny"] },
    discriminating_test: {
      design: "A confrontation is staged in the study where all suspects are present. The clock is examined publicly.",
    },
  },
});

describe("ChapterValidator — discriminating test threshold scales with totalChapters", () => {
  const validator = new ChapterValidator();

  it("does NOT flag chapter 13/20 (65%) — below the 70% check threshold", () => {
    const result = validator.validateChapter(
      {
        chapterNumber: 13,
        totalChapters: 20,
        title: "Chapter 13",
        paragraphs: ["The investigation continued without resolution."],
      },
      makeCmlWithDiscriminatingTest()
    );
    expect(result.issues.filter((i) => i.message.includes("discriminating test"))).toHaveLength(0);
  });

  it("does NOT flag chapter 14/20 (70%) — at check threshold but below 85% report threshold", () => {
    const result = validator.validateChapter(
      {
        chapterNumber: 14,
        totalChapters: 20,
        title: "Chapter 14",
        paragraphs: ["The investigation continued without resolution."],
      },
      makeCmlWithDiscriminatingTest()
    );
    expect(result.issues.filter((i) => i.message.includes("discriminating test"))).toHaveLength(0);
  });

  it("flags chapter 17/20 (85%) when no key terms found — inside the report zone", () => {
    const result = validator.validateChapter(
      {
        chapterNumber: 17,
        totalChapters: 20,
        title: "Chapter 17",
        paragraphs: ["The detective walked through the garden, lost in thought about the weather."],
      },
      makeCmlWithDiscriminatingTest()
    );
    expect(result.issues.filter((i) => i.message.includes("discriminating test"))).toHaveLength(1);
  });

  it("does NOT flag chapter 17/20 when key terms from the design ARE present", () => {
    const result = validator.validateChapter(
      {
        chapterNumber: 17,
        totalChapters: 20,
        title: "Chapter 17",
        paragraphs: [
          "Everyone gathered in the study as the detective examined the clock publicly.",
          "The confrontation had finally arrived.",
        ],
      },
      makeCmlWithDiscriminatingTest()
    );
    expect(result.issues.filter((i) => i.message.includes("discriminating test"))).toHaveLength(0);
  });

  it("old 12-chapter story: does NOT flag chapter 9/12 (75%) — below 85% report threshold", () => {
    const result = validator.validateChapter(
      {
        chapterNumber: 9,
        totalChapters: 12,
        title: "Chapter 9",
        paragraphs: ["Irrelevant prose."],
      },
      makeCmlWithDiscriminatingTest()
    );
    expect(result.issues.filter((i) => i.message.includes("discriminating test"))).toHaveLength(0);
  });

  it("old 12-chapter story: flags chapter 11/12 (92%) when key terms missing", () => {
    const result = validator.validateChapter(
      {
        chapterNumber: 11,
        totalChapters: 12,
        title: "Chapter 11",
        paragraphs: ["Irrelevant prose."],
      },
      makeCmlWithDiscriminatingTest()
    );
    expect(result.issues.filter((i) => i.message.includes("discriminating test"))).toHaveLength(1);
  });
});

describe("validateChapterSequence — cross-story chapter ordering", () => {
  const makeStory = (scenes: Array<{ number: number; title: string }>) => ({
    id: "test",
    projectId: "p1",
    scenes: scenes.map(s => ({ ...s, text: "Some prose.", paragraphs: ["Some prose."] })),
  });

  it("passes sequential chapters with no gaps", () => {
    const errors = validateChapterSequence(makeStory([
      { number: 1, title: "Chapter 1: The Discovery" },
      { number: 2, title: "Chapter 2: The Investigation" },
      { number: 3, title: "Chapter 3: The Resolution" },
    ]));
    expect(errors).toHaveLength(0);
  });

  it("detects missing chapter (gap)", () => {
    const errors = validateChapterSequence(makeStory([
      { number: 1, title: "Chapter 1" },
      { number: 3, title: "Chapter 3" },
    ]));
    expect(errors.some(e => e.type === "chapter_missing" && e.message.includes("Chapter 2"))).toBe(true);
    expect(errors.some(e => e.severity === "critical")).toBe(true);
  });

  it("detects duplicate chapter numbers", () => {
    const errors = validateChapterSequence(makeStory([
      { number: 1, title: "Chapter 1" },
      { number: 2, title: "Chapter 2" },
      { number: 2, title: "Chapter 2 Redux" },
      { number: 3, title: "Chapter 3" },
    ]));
    expect(errors.some(e => e.type === "chapter_duplicated" && e.message.includes("Chapter 2"))).toBe(true);
    expect(errors.some(e => e.severity === "critical")).toBe(true);
  });

  it("detects mixed chapter title formats", () => {
    const errors = validateChapterSequence(makeStory([
      { number: 1, title: "Chapter 1: The Discovery" },
      { number: 2, title: "The Investigation" },
      { number: 3, title: "Chapter 3" },
    ]));
    expect(errors.some(e => e.type === "chapter_title_inconsistency")).toBe(true);
    expect(errors.some(e => e.severity === "major")).toBe(true);
  });

  it("passes uniform title-only format", () => {
    const errors = validateChapterSequence(makeStory([
      { number: 1, title: "The Discovery" },
      { number: 2, title: "The Investigation" },
      { number: 3, title: "The Resolution" },
    ]));
    expect(errors.some(e => e.type === "chapter_title_inconsistency")).toBe(false);
  });

  it("returns no errors for empty scene list", () => {
    const errors = validateChapterSequence(makeStory([]));
    expect(errors).toHaveLength(0);
  });
});
