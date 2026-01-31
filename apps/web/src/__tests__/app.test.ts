import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import App from "../App.vue";

vi.mock("@headlessui/vue", () => ({
  SwitchGroup: { template: "<div><slot /></div>" },
  SwitchLabel: { template: "<span><slot /></span>" },
  Switch: {
    template: "<button data-testid=\"switch\" @click=\"$emit('update:checked', true)\"><slot /></button>",
    emits: ["update:checked"],
  },
}));

describe("App shell (phase 1)", () => {
  it("hides CML viewer by default", () => {
    const wrapper = mount(App);
    expect(wrapper.text()).not.toContain("CML Viewer");
  });

  it("shows CML viewer when advanced mode enabled", async () => {
    const wrapper = mount(App);
    const switches = wrapper.findAll("[data-testid=\"switch\"]");
    await switches[0].trigger("click");
    await nextTick();
    expect(wrapper.text()).toContain("CML Viewer");
  });
});
