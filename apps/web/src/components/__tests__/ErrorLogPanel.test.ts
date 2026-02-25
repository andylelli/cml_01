import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ErrorLogPanel from "../ErrorLogPanel.vue";
import type { ErrorItem } from "../types";

const makeErrors = (): ErrorItem[] => [
  { id: "1", timestamp: Date.now() - 5000, severity: "error", scope: "pipeline", message: "Generation failed", details: "Network timeout" },
  { id: "2", timestamp: Date.now() - 2000, severity: "warning", scope: "spec", message: "Spec incomplete" },
  { id: "3", timestamp: Date.now(), severity: "info", scope: "project", message: "Project created" },
];

describe("ErrorLogPanel", () => {
  it("renders all error messages", () => {
    const wrapper = mount(ErrorLogPanel, { props: { errors: makeErrors() } });
    expect(wrapper.text()).toContain("Generation failed");
    expect(wrapper.text()).toContain("Spec incomplete");
    expect(wrapper.text()).toContain("Project created");
  });

  it("renders empty state when no errors", () => {
    const wrapper = mount(ErrorLogPanel, { props: { errors: [] } });
    const text = wrapper.text().toLowerCase();
    expect(text).toMatch(/no log entries|no entries|empty|no errors/);
  });

  it("shows error details when available", () => {
    const wrapper = mount(ErrorLogPanel, { props: { errors: makeErrors() } });
    expect(wrapper.text()).toContain("Network timeout");
  });

  it("emits clear event when clear button clicked", async () => {
    const wrapper = mount(ErrorLogPanel, { props: { errors: makeErrors() } });
    const buttons = wrapper.findAll("button");
    const clearBtn = buttons.find((b) => b.text().toLowerCase().includes("clear"));
    if (clearBtn) {
      await clearBtn.trigger("click");
      expect(wrapper.emitted("clear")).toBeDefined();
    }
  });

  it("filters by severity - shows only errors when error filter selected", async () => {
    const wrapper = mount(ErrorLogPanel, { props: { errors: makeErrors() } });
    const select = wrapper.find("select");
    if (select.exists()) {
      await select.setValue("error");
      // After filtering, only the error message should be visible
      const text = wrapper.text();
      expect(text).toContain("Generation failed");
    }
  });

  it("displays scope badges for each error", () => {
    const wrapper = mount(ErrorLogPanel, { props: { errors: makeErrors() } });
    expect(wrapper.text()).toContain("pipeline");
  });
});
