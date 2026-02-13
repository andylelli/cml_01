import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ValidationPanel from "../ValidationPanel.vue";
import type { AllValidation } from "../types";

describe("ValidationPanel.vue", () => {
  it("renders heading when validation is null", () => {
    const wrapper = mount(ValidationPanel, {
      props: { validation: null },
    });
    expect(wrapper.text()).toContain("Validation Results");
  });

  it("renders all artifact sections when validation provided", () => {
    const validation: AllValidation = {
      setting: { valid: true, errors: [], warnings: [] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    expect(wrapper.text()).toContain("setting");
    expect(wrapper.text()).toContain("cast");
    expect(wrapper.text()).toContain("cml");
    expect(wrapper.text()).toContain("clues");
    expect(wrapper.text()).toContain("outline");
  });

  it("shows checkmark icon for valid artifacts", () => {
    const validation: AllValidation = {
      setting: { valid: true, errors: [], warnings: [] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    const checkmarks = wrapper.findAll("span").filter((w) => w.text() === "✅");
    expect(checkmarks.length).toBe(5);
  });

  it("shows error icon for invalid artifacts", () => {
    const validation: AllValidation = {
      setting: { valid: false, errors: ["Error 1"], warnings: [] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    const errorIcons = wrapper.findAll("span").filter((w) => w.text() === "❌");
    expect(errorIcons.length).toBe(1);
  });

  it("shows warning icon for artifacts with warnings only", () => {
    const validation: AllValidation = {
      setting: { valid: true, errors: [], warnings: ["Warning 1"] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    const warningIcons = wrapper.findAll("span").filter((w) => w.text() === "⚠️");
    expect(warningIcons.length).toBe(1);
  });

  it("displays error count badge when errors present", () => {
    const validation: AllValidation = {
      setting: { valid: false, errors: ["Error 1", "Error 2", "Error 3"], warnings: [] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    expect(wrapper.text()).toContain("3");
  });

  it("displays warning count badge when warnings present", () => {
    const validation: AllValidation = {
      setting: { valid: true, errors: [], warnings: ["Warning 1", "Warning 2"] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    expect(wrapper.text()).toContain("2");
  });

  it("expands section when clicked", async () => {
    const validation: AllValidation = {
      setting: { valid: false, errors: ["Test error"], warnings: [] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    // Initially collapsed
    expect(wrapper.text()).not.toContain("Test error");

    // Click to expand
    const settingButton = wrapper.findAll("button").find((b) => b.text().includes("setting"));
    await settingButton?.trigger("click");
    await nextTick();

    // Now expanded
    expect(wrapper.text()).toContain("Test error");
  });

  it("collapses section when clicked again", async () => {
    const validation: AllValidation = {
      setting: { valid: false, errors: ["Test error"], warnings: [] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    const settingButton = wrapper.findAll("button").find((b) => b.text().includes("setting"));

    // Expand
    await settingButton?.trigger("click");
    await nextTick();
    expect(wrapper.text()).toContain("Test error");

    // Collapse
    await settingButton?.trigger("click");
    await nextTick();
    expect(wrapper.text()).not.toContain("Test error");
  });

  it("displays multiple errors in list", async () => {
    const validation: AllValidation = {
      setting: { valid: false, errors: ["Error 1", "Error 2", "Error 3"], warnings: [] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    const settingButton = wrapper.findAll("button").find((b) => b.text().includes("setting"));
    await settingButton?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Error 1");
    expect(wrapper.text()).toContain("Error 2");
    expect(wrapper.text()).toContain("Error 3");
  });

  it("displays both errors and warnings", async () => {
    const validation: AllValidation = {
      setting: { valid: false, errors: ["Test error"], warnings: ["Test warning"] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    const settingButton = wrapper.findAll("button").find((b) => b.text().includes("setting"));
    await settingButton?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Errors:");
    expect(wrapper.text()).toContain("Test error");
    expect(wrapper.text()).toContain("Warnings:");
    expect(wrapper.text()).toContain("Test warning");
  });

  it("handles undefined warnings gracefully", () => {
    const validation: AllValidation = {
      setting: { valid: true, errors: [] },
      cast: { valid: true, errors: [] },
      cml: { valid: true, errors: [] },
      clues: { valid: true, errors: [] },
      outline: { valid: true, errors: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    expect(wrapper.text()).toContain("setting");
  });

  it("shows no-issues message when valid section is expanded", async () => {
    const validation: AllValidation = {
      setting: { valid: true, errors: [], warnings: [] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    const settingButton = wrapper.findAll("button").find((b) => b.text().includes("setting"));
    await settingButton?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("No issues found.");
  });

  it("can expand multiple sections simultaneously", async () => {
    const validation: AllValidation = {
      setting: { valid: false, errors: ["Setting error"], warnings: [] },
      cast: { valid: false, errors: ["Cast error"], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    const wrapper = mount(ValidationPanel, {
      props: { validation },
    });

    const settingButton = wrapper.findAll("button").find((b) => b.text().includes("setting"));
    const castButton = wrapper.findAll("button").find((b) => b.text().includes("cast"));

    await settingButton?.trigger("click");
    await castButton?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Setting error");
    expect(wrapper.text()).toContain("Cast error");
  });
});
