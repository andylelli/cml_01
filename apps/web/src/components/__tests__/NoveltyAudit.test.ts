import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import NoveltyAudit from "../NoveltyAudit.vue";
import type { NoveltyAuditData } from "../types";

describe("NoveltyAudit.vue", () => {
  it("renders empty state when audit is null", () => {
    const wrapper = mount(NoveltyAudit, {
      props: { audit: null },
    });
    expect(wrapper.text()).toContain("Novelty audit not yet run");
  });

  it("displays pass status with green badge", () => {
    const audit: NoveltyAuditData = {
      status: "pass",
      seedIds: ["seed1", "seed2"],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    const badge = wrapper.find(".bg-emerald-100");
    expect(badge.exists()).toBe(true);
    expect(badge.text()).toContain("pass");
  });

  it("displays fail status with red badge", () => {
    const audit: NoveltyAuditData = {
      status: "fail",
      seedIds: ["seed1"],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    const badge = wrapper.find(".bg-rose-100");
    expect(badge.exists()).toBe(true);
    expect(badge.text()).toContain("fail");
  });

  it("displays warn status with amber badge", () => {
    const audit: NoveltyAuditData = {
      status: "warn",
      seedIds: ["seed1"],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    const badge = wrapper.find(".bg-amber-100");
    expect(badge.exists()).toBe(true);
    expect(badge.text()).toContain("warn");
  });

  it("displays all seed IDs checked", () => {
    const audit: NoveltyAuditData = {
      status: "pass",
      seedIds: ["seed1", "seed2", "seed3"],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    expect(wrapper.text()).toContain("seed1");
    expect(wrapper.text()).toContain("seed2");
    expect(wrapper.text()).toContain("seed3");
  });

  it("displays pattern matches with similarity scores", () => {
    const audit: NoveltyAuditData = {
      status: "warn",
      seedIds: ["seed1"],
      patterns: [
        {
          seed: "seed1",
          similarity: 0.755,
          matches: ["Similar plot element", "Similar character"],
        },
      ],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    expect(wrapper.text()).toContain("seed1");
    expect(wrapper.text()).toContain("76%"); // Math.round(0.755 * 100) = 76
    expect(wrapper.text()).toContain("Similar plot element");
    expect(wrapper.text()).toContain("Similar character");
  });

  it("colors high similarity (>70%) in red", () => {
    const audit: NoveltyAuditData = {
      status: "fail",
      seedIds: ["seed1"],
      patterns: [
        {
          seed: "seed1",
          similarity: 0.85,
          matches: ["Match"],
        },
      ],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    // Check within pattern matches section, not status badge
    expect(wrapper.text()).toContain("85% similar");
    const allBadges = wrapper.findAll(".bg-rose-100");
    const similarityBadge = allBadges.find((b) => b.text().includes("85%"));
    expect(similarityBadge).toBeDefined();
  });

  it("colors medium similarity (40-70%) in amber", () => {
    const audit: NoveltyAuditData = {
      status: "warn",
      seedIds: ["seed1"],
      patterns: [
        {
          seed: "seed1",
          similarity: 0.55,
          matches: ["Match"],
        },
      ],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    // Check within pattern matches section
    expect(wrapper.text()).toContain("55% similar");
    const allBadges = wrapper.findAll(".bg-amber-100");
    const similarityBadge = allBadges.find((b) => b.text().includes("55%"));
    expect(similarityBadge).toBeDefined();
  });

  it("colors low similarity (<40%) in green", () => {
    const audit: NoveltyAuditData = {
      status: "pass",
      seedIds: ["seed1"],
      patterns: [
        {
          seed: "seed1",
          similarity: 0.25,
          matches: ["Match"],
        },
      ],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    // Check within pattern matches section
    expect(wrapper.text()).toContain("25% similar");
    const allBadges = wrapper.findAll(".bg-emerald-100");
    const similarityBadge = allBadges.find((b) => b.text().includes("25%"));
    expect(similarityBadge).toBeDefined();
  });

  it("displays multiple pattern matches", () => {
    const audit: NoveltyAuditData = {
      status: "warn",
      seedIds: ["seed1", "seed2"],
      patterns: [
        {
          seed: "seed1",
          similarity: 0.6,
          matches: ["Match 1a", "Match 1b"],
        },
        {
          seed: "seed2",
          similarity: 0.45,
          matches: ["Match 2a"],
        },
      ],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    expect(wrapper.text()).toContain("Match 1a");
    expect(wrapper.text()).toContain("Match 1b");
    expect(wrapper.text()).toContain("Match 2a");
    expect(wrapper.text()).toContain("60%");
    expect(wrapper.text()).toContain("45%");
  });

  it("displays summary when provided", () => {
    const audit: NoveltyAuditData = {
      status: "pass",
      seedIds: ["seed1"],
      summary: "Mystery shows strong originality with unique plot elements.",
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    expect(wrapper.text()).toContain("Mystery shows strong originality with unique plot elements.");
  });

  it("handles audit with no patterns", () => {
    const audit: NoveltyAuditData = {
      status: "pass",
      seedIds: ["seed1", "seed2"],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    expect(wrapper.text()).toContain("seed1");
    expect(wrapper.text()).toContain("seed2");
    expect(wrapper.text()).not.toContain("Similarity");
  });

  it("handles audit with empty seedIds array", () => {
    const audit: NoveltyAuditData = {
      status: "pass",
      seedIds: [],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    expect(wrapper.text()).toContain("Novelty Audit");
  });

  it("handles pattern with no matches", () => {
    const audit: NoveltyAuditData = {
      status: "pass",
      seedIds: ["seed1"],
      patterns: [
        {
          seed: "seed1",
          similarity: 0.2,
          matches: [],
        },
      ],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    expect(wrapper.text()).toContain("20%");
  });

  it("displays 'Seeds Checked' label", () => {
    const audit: NoveltyAuditData = {
      status: "pass",
      seedIds: ["seed1"],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    expect(wrapper.text()).toContain("Seeds Checked");
  });

  it("shows pattern matches section only when patterns exist", () => {
    const auditWithoutPatterns: NoveltyAuditData = {
      status: "pass",
      seedIds: ["seed1"],
    };
    const wrapperWithout = mount(NoveltyAudit, {
      props: { audit: auditWithoutPatterns },
    });

    expect(wrapperWithout.text()).not.toContain("Pattern Matches");

    const auditWithPatterns: NoveltyAuditData = {
      status: "warn",
      seedIds: ["seed1"],
      patterns: [
        {
          seed: "seed1",
          similarity: 50,
          matches: ["Match"],
        },
      ],
    };
    const wrapperWith = mount(NoveltyAudit, {
      props: { audit: auditWithPatterns },
    });

    expect(wrapperWith.text()).toContain("Pattern Matches");
  });

  it("formats similarity to whole number", () => {
    const audit: NoveltyAuditData = {
      status: "warn",
      seedIds: ["seed1"],
      patterns: [
        {
          seed: "seed1",
          similarity: 0.45666,
          matches: ["Match"],
        },
      ],
    };
    const wrapper = mount(NoveltyAudit, {
      props: { audit },
    });

    expect(wrapper.text()).toContain("46%"); // Math.round(0.45666 * 100) = 46
  });
});
