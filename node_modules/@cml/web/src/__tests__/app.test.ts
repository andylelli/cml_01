import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import App from "../App.vue";

describe("App shell (phase 1)", () => {
  it("hides CML viewer by default", () => {
    const wrapper = mount(App);
    expect(wrapper.text()).not.toContain("CML Viewer");
  });

  it("shows CML viewer when advanced mode enabled", async () => {
    const wrapper = mount(App);
    const toggle = wrapper.find("[data-testid=\"advanced-toggle\"]");
    await toggle.setValue(true);
    await nextTick();
    expect(wrapper.text()).toContain("CML Viewer");
  });

  it("shows export panel", () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain("Export selected");
  });
});
