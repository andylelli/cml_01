import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createPinia } from "pinia";
import { resetSessionState } from "../composables/useSessionState";
import App from "../views/WorkshopView.vue";

/**
 * The operator console.
 *
 * Two of these used to toggle `[data-testid="advanced-toggle"]` and assert the CML viewer appeared.
 * That control is gone (UI-003 §3): it gated a tab group from inside a screen only reachable in
 * advanced mode, and turning it off removed the Workshop from the nav while the Workshop was still
 * the rendered view (B15, verified stranded). Entering the console now asserts the mode it needs, so
 * the assertions move from "toggle it on" to "it is already on, and nothing here can turn it off".
 */

const mountConsole = () =>
  mount(App, {
    global: {
      plugins: [createPinia()],
      stubs: { "font-awesome-icon": true },
    },
  });

// `mode` is a module singleton (B13) and outlives a test file.
beforeEach(() => resetSessionState());

describe("WorkshopView — the operator console", () => {
  it("enters operator mode on mount rather than asking", async () => {
    const wrapper = mountConsole();
    await nextTick();
    // The Advanced tab carries `disabled: !isAdvanced`. Enabled without anyone toggling anything
    // is the observable fact; the old test asserted the text "CML Viewer", which was the SIDEBAR's
    // 13th button rather than the panel, and so described the nav rather than the mode.
    const advanced = wrapper.findAll("button").find((b) => b.text().trim() === "Advanced");
    expect(advanced, "no Advanced tab").toBeTruthy();
    expect(advanced?.attributes("disabled")).toBeUndefined();
    wrapper.unmount();
  });

  it("offers no control that could strand the user here", () => {
    const wrapper = mountConsole();
    expect(wrapper.find('[data-testid="advanced-toggle"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="expert-toggle"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it("draws one navigation system, not three", async () => {
    // UI-003 §2: the sidebar's 13 entries had no destinations of their own. `currentView` was read
    // by a single watcher which set the tab refs the tabs already set, and those watchers wrote it
    // back — 2 log POSTs and 3 storage writes for one click.
    const wrapper = mountConsole();
    await nextTick();
    expect(wrapper.find("aside nav").exists()).toBe(false);
    wrapper.unmount();
  });

  it("shows export panel in export tab", async () => {
    const wrapper = mountConsole();
    await wrapper.findAll("button").find((btn) => btn.text().trim() === "Export")?.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Export selected");
    wrapper.unmount();
  });

  it("switches review sub-tabs", async () => {
    const wrapper = mountConsole();

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

    expect(wrapper.text()).toContain("No story text yet. Generate to create it.");
    wrapper.unmount();
  });
});
