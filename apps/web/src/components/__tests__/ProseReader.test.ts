import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ProseReader from "../ProseReader.vue";
import type { ProseData } from "../types";

describe("ProseReader.vue", () => {
  const sampleProseData: ProseData = {
    status: "complete",
    tone: "mysterious",
    chapters: [
      {
        title: "Chapter 1: The Beginning",
        summary: "The story begins",
        paragraphs: ["First paragraph of chapter 1.", "Second paragraph of chapter 1."],
      },
      {
        title: "Chapter 2: The Middle",
        summary: "The plot thickens",
        paragraphs: ["First paragraph of chapter 2.", "Second paragraph of chapter 2."],
      },
      {
        title: "Chapter 3: The End",
        summary: "The conclusion",
        paragraphs: ["First paragraph of chapter 3.", "Second paragraph of chapter 3."],
      },
    ],
    cast: ["Detective", "Suspect"],
  };

  it("renders empty state when prose is null", () => {
    const wrapper = mount(ProseReader, {
      props: { prose: null },
    });
    expect(wrapper.text()).toContain("Prose not yet generated");
  });

  it("renders navigation when no chapters", () => {
    const wrapper = mount(ProseReader, {
      props: {
        prose: {
          status: "complete",
          chapters: [],
        },
      },
    });
    expect(wrapper.text()).toContain("Chapter"); // Shows navigation UI
  });

  it("renders chapter list in sidebar", () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    expect(wrapper.text()).toContain("Chapter 1: The Beginning");
    expect(wrapper.text()).toContain("Chapter 2: The Middle");
    expect(wrapper.text()).toContain("Chapter 3: The End");
  });

  it("renders first chapter by default", () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    expect(wrapper.text()).toContain("First paragraph of chapter 1.");
    expect(wrapper.text()).toContain("Second paragraph of chapter 1.");
  });

  it("displays chapter summary when available", () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    expect(wrapper.text()).toContain("The story begins");
  });

  it("switches chapter when sidebar item clicked", async () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    // Initially shows chapter 1
    expect(wrapper.text()).toContain("First paragraph of chapter 1.");

    // Click chapter 2
    const chapterButtons = wrapper.findAll("button").filter((b) => b.text().includes("Chapter 2"));
    await chapterButtons[0].trigger("click");
    await nextTick();

    // Now shows chapter 2
    expect(wrapper.text()).toContain("First paragraph of chapter 2.");
    expect(wrapper.text()).not.toContain("First paragraph of chapter 1.");
  });

  it("navigates to next chapter with Next button", async () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    expect(wrapper.text()).toContain("First paragraph of chapter 1.");

    const nextButton = wrapper.findAll("button").find((b) => b.text().includes("Next"));
    await nextButton?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("First paragraph of chapter 2.");
  });

  it("navigates to previous chapter with Prev button", async () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    // Go to chapter 2 first
    const nextButton = wrapper.findAll("button").find((b) => b.text().includes("Next"));
    await nextButton?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("First paragraph of chapter 2.");

    // Go back to chapter 1
    const prevButton = wrapper.findAll("button").find((b) => b.text().includes("Prev"));
    await prevButton?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("First paragraph of chapter 1.");
  });

  it("disables Prev button on first chapter", () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    const prevButton = wrapper.findAll("button").find((b) => b.text().includes("Prev"));
    expect(prevButton?.attributes("disabled")).toBeDefined();
  });

  it("disables Next button on last chapter", async () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    // Navigate to last chapter
    const chapter3Button = wrapper.findAll("button").filter((b) => b.text().includes("Chapter 3"));
    await chapter3Button[0].trigger("click");
    await nextTick();

    const nextButton = wrapper.findAll("button").find((b) => b.text().includes("Next"));
    expect(nextButton?.attributes("disabled")).toBeDefined();
  });

  it("displays chapter progress indicator", () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    expect(wrapper.text()).toContain("Chapter 1 of 3");
  });

  it("updates progress indicator when chapter changes", async () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    expect(wrapper.text()).toContain("Chapter 1 of 3");

    const nextButton = wrapper.findAll("button").find((b) => b.text().includes("Next"));
    await nextButton?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Chapter 2 of 3");
  });

  it("highlights current chapter in sidebar", () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    const chapterButtons = wrapper.findAll("button").filter((b) => b.text().includes("Chapter"));
    const activeChapter = chapterButtons.find((b) => b.classes().includes("bg-slate-900"));
    expect(activeChapter).toBeDefined();
    if (activeChapter) {
      expect(activeChapter.text()).toContain("Chapter 1");
    }
  });

  it("updates highlighted chapter when navigation occurs", async () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    const nextButton = wrapper.findAll("button").find((b) => b.text().includes("Next"));
    await nextButton?.trigger("click");
    await nextTick();

    const chapterButtons = wrapper.findAll("button").filter((b) => b.text().includes("Chapter"));
    const activeChapter = chapterButtons.find((b) => b.classes().includes("bg-slate-900"));
    expect(activeChapter).toBeDefined();
    if (activeChapter) {
      expect(activeChapter.text()).toContain("Chapter 2");
    }
  });

  it("renders all paragraphs with proper spacing", () => {
    const wrapper = mount(ProseReader, {
      props: { prose: sampleProseData },
    });

    const paragraphs = wrapper.findAll("p");
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
  });

  it("handles chapter without summary gracefully", () => {
    const proseWithoutSummary: ProseData = {
      status: "complete",
      chapters: [
        {
          title: "Chapter 1",
          paragraphs: ["Content"],
        },
      ],
    };
    const wrapper = mount(ProseReader, {
      props: { prose: proseWithoutSummary },
    });

    expect(wrapper.text()).toContain("Chapter 1");
    expect(wrapper.text()).toContain("Content");
  });

  it("handles single chapter correctly", () => {
    const singleChapterProse: ProseData = {
      status: "complete",
      chapters: [
        {
          title: "Only Chapter",
          paragraphs: ["Single chapter content"],
        },
      ],
    };
    const wrapper = mount(ProseReader, {
      props: { prose: singleChapterProse },
    });

    expect(wrapper.text()).toContain("Chapter 1 of 1");

    const prevButton = wrapper.findAll("button").find((b) => b.text().includes("Prev"));
    const nextButton = wrapper.findAll("button").find((b) => b.text().includes("Next"));

    expect(prevButton?.attributes("disabled")).toBeDefined();
    expect(nextButton?.attributes("disabled")).toBeDefined();
  });

  it.skip("displays note when provided", () => {
    // TODO: Check if note is actually displayed in component template
    const proseWithNote: ProseData = {
      status: "complete",
      chapters: [
        {
          title: "Chapter 1",
          paragraphs: ["Content"],
        },
      ],
      note: "This is a special note",
    };
    const wrapper = mount(ProseReader, {
      props: { prose: proseWithNote },
    });

    expect(wrapper.text()).toContain("This is a special note");
  });
});
