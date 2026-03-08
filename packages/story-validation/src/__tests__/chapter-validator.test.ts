import { describe, it, expect } from "vitest";
import { ChapterValidator } from "../chapter-validator.js";
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
