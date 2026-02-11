import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createPinia } from "pinia";
import App from "../App.vue";

describe("App shell (phase 1)", () => {
  it("hides CML viewer by default", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });
    expect(wrapper.text()).not.toContain("CML Viewer");
  });

  it("shows CML viewer when advanced mode enabled", async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });
    const toggle = wrapper.find("[data-testid=\"advanced-toggle\"]");
    await toggle.setValue(true);
    await nextTick();
    expect(wrapper.text()).toContain("CML Viewer");
  });

  it("shows export panel", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });
    expect(wrapper.text()).toContain("Export selected");
  });

  it("switches review sub-tabs", async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });

    await wrapper.findAll("button").find((btn) => btn.text().trim() === "Review")?.trigger("click");
    await nextTick();

    await wrapper.findAll("button").find((btn) => btn.text().trim() === "Clues")?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Clue Board");

    await wrapper.findAll("button").find((btn) => btn.text().trim() === "Outline")?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Story Outline");

    await wrapper.findAll("button").find((btn) => btn.text().trim() === "Prose")?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Prose not yet generated");
  });
});
